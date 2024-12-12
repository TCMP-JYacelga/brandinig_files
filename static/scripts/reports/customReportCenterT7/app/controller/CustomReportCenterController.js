/**
 * @class GCP.controller.CustomReportCenterController
 * @extends Ext.app.Controller
 * @author Nilesh Shinde
 */

/**
 * This controller is prime controller in Report Center which handles all
 * measure events fired from GroupView. This controller has important
 * functionality like on any change on grid status or quick filter change, it
 * forms required URL and gets data which is then shown on Summary Grid.
 */

Ext
	.define(
		'GCP.controller.CustomReportCenterController',
		{
			extend : 'Ext.app.Controller',
			requires : ['Ext.ux.gcp.PageSettingPopUp'],
			views :
			[
				'GCP.view.CustomReportCenterView', 'Ext.ux.gcp.PreferencesHandler'
			],
			refs :
			[
				{
					ref : 'customReportCenterViewRef',
					selector : 'customReportCenterViewType'
				},{
					ref:'filterView',
					selector:'filterView'	
				},{
					ref : 'customReportCenterFilterViewRef',
					selector : 'customReportCenterFilterViewType'
				},{
					ref : 'clientAutoCompleter',
					selector : 'customReportCenterViewType customReportCenterFilterViewType AutoCompleter[itemId="reportCenterClientId"]'
				},{
					ref : 'sellerCombo',
					selector : 'customReportCenterViewType customReportCenterFilterViewType combobox[itemId="reportCenterSellerId"]'
				},{
					ref : 'groupView',
					selector : 'customReportCenterViewType groupView'
				},{
					ref : 'smartgrid',
					selector : 'customReportCenterViewType groupView smartgrid'
				},{
					ref : 'btnClearPreferences',
					selector : 'customReportCenterViewType customReportCenterFilterViewType button[itemId="btnClearPreferences"]'
				},{
					ref : 'btnSavePreferences',
					selector : 'customReportCenterViewType customReportCenterFilterViewType button[itemId="btnSavePreferences"]'
				},{
					ref : 'statusFltRef',
					selector : 'customReportCenterViewType customReportCenterFilterViewType combo[itemId="reportStatusToolBar"]'
				},{
					ref : 'pageSettingPopUp',
					selector : 'pageSettingPopUp[itemId="pagesettingCustomReport"]'
				}
			],
			config :
			{
				preferenceHandler : null,
				filterData : [],
				favReport : [],
				widgetType : '01',
				reportModule : '01',
				strDefaultMask : '0000',
				strPageName : 'customReportCenter',
				sellerFilterVal : strSeller,
				clientFilterVal : null,
				clientFilterDesc : null ,
				reportStatus : null,
				filterDataPref : {},
				pageSettingPopup : null,
				strGetModulePrefUrl : 'services/userpreferences/customReportCenter/{0}.json',
				cfgGroupByUrl : 'services/grouptype/reportCenterNewUX/groupBy.srvc?&'+csrfTokenName+'=' + tokenValue
					+ '&$filter=seller eq ' + '\'' + '\'' + strSeller + '\'' + '\' and client eq ' + '\'' + '{0}'
					+ '\'' + ' and seller eq ' + '\'' + strSeller + '\''
			//urlOfGridViewPref : 'userpreferences/reportCenterFilter/reportCenterViewPref.srvc',
			//urlGridViewFilterPref : 'userpreferences/reportCenterFilter/reportCenterViewFilter.srvc'

			},
			/**
			 * A template method that is called when your application boots. It
			 * is called before the Application's launch function is executed so
			 * gives a hook point to run any code before your Viewport is
			 * created.
			 */
			init : function()
			{
				var me = this;
				me.updateConfigs();
				me.getFavoriteReports();
				me.doApplySavedPreferences();
				$(document).on('savePreference', function(event) {
				//	me.toggleSavePrefrenceAction(false);
					me.handleSavePreferences();
				});
				$(document).on('clearPreference', function(event) {
						me.handleClearPreferences();
				});
				$(document).on('createCustomReport',function(event){
					var filter= me.getCustomReportCenterFilterViewRef();
					if(!Ext.isEmpty(filter)){
						doChooseReport( filter.seller, filter.clientCode, filter.clientDesc );
					}else{
						doChooseReport(strSeller,strClient,strClientDesc );
					}
				});
				$(document).on('performPageSettings', function(event) 
						{
							me.showPageSettingPopup('PAGE');
						});
				$(document).on('handleClientChangeInQuickFilter',function(isSessionClientFilter) {
					me.handleClientChangeInQuickFilter(isSessionClientFilter);
				});
				me.control(
				{
					'customReportCenterFilterViewType' :
					{
						'beforerender':function(){
							var useSettingsButton = me.getFilterView()
							.down('button[itemId="useSettingsbutton"]');
							if (!Ext.isEmpty(useSettingsButton)) {
								useSettingsButton.hide();
							}
						},
						'afterrender' : function()
						{
							me.setInfoTooltip();
							//me.setDataForQuickFilter();
							me.setSelectedFilters();
						},
						'quickFilterChange' : function( filterJson )
						{
							me.setDataForQuickFilter( filterJson );
							me.disablePreferencesButton("savePrefMenuBtn",false);
							if( me.getCustomReportCenterViewRef() )
								me.getCustomReportCenterViewRef().setLoading( true );
							me.applyQuickFilter();
						},
						'refreshGroupByTabs' : function( client )
						{
							me.refreshGroupByTabs( client );
						}
					},
					'customReportCenterViewType' :
					{
						'deleteFavoriteRep' : me.deleteFavoriteRep,
						'addFavoriteRep' : me.addFavoriteRep
					},
					'customReportCenterViewType groupView' :
					{
						'groupTabChange' : function( groupInfo, subGroupInfo, tabPanel, newCard, oldCard )
						{
						//	me.setDataForQuickFilter();		
							me.disablePreferencesButton("savePrefMenuBtn",false);
							me.disablePreferencesButton("clearPrefMenuBtn",false);
							me.doHandleGroupTabChange( groupInfo, subGroupInfo, tabPanel, newCard, oldCard );
						},
						'groupActionClick' : function( actionName, isGroupAction, maskPosition, grid,
							arrSelectedRecords )
						{
							if( isGroupAction === true )
								me.doHandleGroupActions( actionName, grid, arrSelectedRecords, 'groupAction' );
						},
						'gridRender' : me.doHandleLoadGridData,
						'gridPageChange' : me.doHandleLoadGridData,
						'gridSortChange' : me.doHandleLoadGridData,
						'gridPageSizeChange' : me.doHandleLoadGridData,
						'gridColumnFilterChange' : me.doHandleLoadGridData,
						'gridRowSelectionChange' : me.doHandleGridRowSelectionChange,

						'gridStateChange' : function( grid )
						{
							me.disablePreferencesButton("savePrefMenuBtn",false);
						},
						'render' : function()
						{
							if( objGridViewFilterPref )
							{
								var objJsonData = Ext.decode( objGridViewFilterPref );
								objGroupByPref = objJsonData;
								if( !Ext.isEmpty( objGroupByPref ) )
								{
								//	me.toggleSavePrefrenceAction( false );
								//	me.toggleClearPrefrenceAction( true );
								}
							}
						},
						'gridRowActionClick' : function(grid, rowIndex, columnIndex,actionName, record) {
								me.doHandleRowIconClick(actionName, grid, record, rowIndex);
						}
					},
					'customReportCenterViewType groupView smartgrid' :
					{
						'cellclick' : me.handleGridRowClick
					},
					'filterView button[itemId="clearSettingsButton"]' : {
						'click' : function() {
							me.handleClearSettings();
						}
					},
					 'filterView' : 
					 {
						appliedFilterDelete : function(btn)
						{
								me.handleAppliedFilterDelete(btn);
						}
					},
					'pageSettingPopUp[itemId="pagesettingCustomReport"]' : {
						'applyPageSetting' : function(popup, data,strInvokedFrom) {
							me.applyPageSetting(data,strInvokedFrom);
						},
						'savePageSetting' : function(popup, data,strInvokedFrom) {
							me.savePageSetting(data,strInvokedFrom);
						},
						'restorePageSetting' : function(popup,data,strInvokedFrom) {
							me.restorePageSetting(data,strInvokedFrom);
						}
					}
				/*	'customReportCenterViewType customReportCenterTitleViewType button[itemId="btnCreateReport"]' :
					{
						click : function( btn, opts )
						{
							doChooseReport( me.sellerFilterVal, me.clientFilterVal, me.clientFilterDesc );
						}
					}*/
				} );
			},
			handleClientChangeInQuickFilter : function(isSessionClientFilter) {
				var me = this;
				if (isSessionClientFilter)
					me.clientFilterVal = selectedFilterClient;
				else
					me.clientFilterVal = isEmpty(selectedClient)
							? 'all'
							: selectedClient;
				me.clientFilterDesc = selectedFilterClientDesc;
				me.filterApplied = 'Q';
				me.setDataForQuickFilter();
				if (me.clientFilterVal == 'all') {
					me.showAdvFilterCode = null;
					me.filterApplied = 'ALL';
					me.refreshData();
				} else {
					me.applyQuickFilter();
				}
			},
			refreshGroupByTabs : function( client )
			{
				var me = this;
				var strUrl = Ext.String.format( me.cfgGroupByUrl, client );
				me.getGroupView().loadGroupByMenus( strUrl );
			},

			//Preference handling functions starts

			handleClearPreferences : function()
			{
				var me = this;
			//	me.toggleSavePrefrenceAction( false );
				var arrPref = me.getPreferencesToSave( false );
				me.preferenceHandler.clearPagePreferences( me.strPageName, null, me.postHandleClearPreferences, null,
					me, true );
			},
			handleSavePreferences : function()
			{
				var me = this;
				var arrPref = me.getPreferencesToSave( false );
				if( arrPref )
				{
					me.preferenceHandler.savePagePreferences( me.strPageName, arrPref, me.postHandleSavePreferences,
						null, me, true );
				}
			},
			getPreferencesToSave : function( localSave )
			{
				var me = this;
				var groupView = me.getGroupView();
				var grid = null;
				var arrCols = null, objCol = null, arrColPref = null, arrPref = [], objFilterPref = null,data={},financialInstitutionVal,clientVal,clientDesc,repOrDwnld,statusCode,reportType,repOrDwnldDesc,statusFilterDesc,reportTypeDesc;
				var groupInfo = null, subGroupInfo = null, strModule = null, filter = me
					.getCustomReportCenterFilterViewRef();
				var state = null;
				if( groupView )
				{
					state = groupView.getGroupViewState();
					groupInfo = groupView.getGroupInfo() || '{}';
					subGroupInfo = groupView.getSubGroupInfo() || {};
					var clientVal=me.clientFilterVal;
					var clientDesc=me.clientFilterDesc;
					if(!Ext.isEmpty(filter)){
						data = filter.getQuickFilterJSON();
						financialInstitutionVal = ( data[ 'sellerCode' ] || "" );
						//clientVal = ( data[ 'clientCode' ] || "" );
						//clientDesc = ( data[ 'clientDesc' ] || "" );
						repOrDwnld = ( data[ 'repOrDwnld' ] || "" );
						statusCode = ( data[ 'statusCode' ] || "" );
						reportType = ( data[ 'reportType' ] || "" );
						repOrDwnldDesc = ( data[ 'repOrDwnldDesc' ] || "" );
						statusFilterDesc = ( data[ 'statusCodeDesc' ] || "" );
						reportTypeDesc = ( data[ 'reportTypeDesc' ] || "" );
					}else{
						financialInstitutionVal=strSeller;
						//clientVal=strClient;
						//clientDesc=strClientDesc;
						repOrDwnld='R';
						reportType='C';
					}
					
					strModule = state.groupCode
					arrPref.push(
					{
						"module" : "groupByPref",
						"jsonPreferences" :
						{
							groupCode : state.groupCode,
							subGroupCode : state.subGroupCode
						}
					} );
					arrPref.push(
					{
						"module" : subGroupInfo.groupCode,
						"jsonPreferences" :
						{
							'gridCols' : state.grid.columns,
							'pgSize' : state.grid.pageSize,
							'sortState' : state.grid.sortState,
							'gridSetting' : groupView.getGroupViewState().gridSetting
						}
					} );
					arrPref.push(
					{
						"module" : "groupViewFilterPref",
						"jsonPreferences" :
						{
							'financialInstitutionVal' : financialInstitutionVal,
							//'clientVal' : clientVal,
							//'clientDesc' : clientDesc,
							'repOrDwnld' : repOrDwnld,
							'statusCode' : statusCode,
							'reportType' : reportType,
							'repOrDwnldDesc' : repOrDwnldDesc,
							'statusFilterDesc' : statusFilterDesc,
							'reportTypeDesc' : reportTypeDesc,
							'filterSelectedClientCode':clientVal,
							'filterSelectedClientDesc':clientDesc
						}
					} );
				}
				return arrPref;
			},
			postHandleClearPreferences : function( data, args, isSuccess )
			{
				var me = this;
			//	me.toggleSavePrefrenceAction( false );
				if( isSuccess === 'N' )
				{
					me.disablePreferencesButton("clearPrefMenuBtn",false);
				}
				else
				{
					me.disablePreferencesButton("savePrefMenuBtn",false);
					me.disablePreferencesButton("clearPrefMenuBtn",true);
				}
			},
			setDefaultValueToFilter:function(){
				var data={};
				data['financialInstitutionVal'] = strSeller,
				data['clientVal'] = strClient,
				data['clientDesc'] = strClientDesc,
				data['repOrDwnld'] = 'R',
				data['reportType'] = 'C'
				return data;
			},
			postHandleSavePreferences : function( data, args, isSuccess )
			{
				var me = this;
				if( isSuccess === 'N' )
				{
					if( !Ext.isEmpty( me.getBtnSavePreferences() ) )
						me.disablePreferencesButton("savePrefMenuBtn",false);
				}
				else
				{
					me.disablePreferencesButton("savePrefMenuBtn",true);
					me.disablePreferencesButton("clearPrefMenuBtn",false);
				}
			},
			//End of prefrence handling

			doSavePreferenceToLocale : function()
			{
				var me = this, filter = me.getCustomReportCenterFilterViewRef();
				data = null;
				if(Ext.isEmpty(filter)&&objGridViewFilterPref){
					data=me.setDefaultValueToFilter();
				}else if(!Ext.isEmpty(filter)){
					data = filter.getQuickFilterJSON();
				}	
				me.preferenceHandler.setLocalPreferences( me.strPageName, data );
			},
			doApplySavedPreferences : function()
			{
				var me = this, filter = me.getCustomReportCenterFilterViewRef();
				var objPref = null;
				objPref = me.preferenceHandler.getLocalPreferences( me.strPageName );
				if( objPref )
				{
					strSeller = objPref[ 'sellerCode' ] || strSeller;
					strClient = objPref[ 'clientCode' ] || strClient;
					strClientDesc = objPref[ 'clientDesc' ] || strClientDesc;
					me.filterDataPref = objPref;
					me.setDataForQuickFilter( objPref );
					me.preferenceHandler.setLocalPreferences( me.strPageName, null );
				}
			},
			setSelectedFilters : function()
			{
				var me = this, filter = me.getCustomReportCenterFilterViewRef();
				var objPref = null;
				objPref = me.filterDataPref;
				if(!Ext.isEmpty(filter)){
					if( objPref.statusCode )
					{
						var reportStatusCombo=filter.down('combobox[itemId="reportStatusToolBar"]');
						reportStatusCombo.setValue(objPref.statusCode);
						filter.statusCode = objPref.statusCode;
						filter.statusCodeDesc = objPref.statusFilterDesc;
					}
					if( objPref.clientCode )
					{
						var clientMenu = filter.down('menu[itemId="clientMenu"]');
						var clientBtn = filter.down('button[itemId="clientBtn"]');					
						filter.clientCode = objPref.clientCode;
						filter.clientDesc = objPref.clientDesc;	
					}
				}
				
			//	me.setDataForQuickFilter( objPref );
			},
			
		doHandleGridRowSelectionChange : function(groupInfo, subGroupInfo, objGrid,
			objRecord, intRecordIndex, arrSelectedRecords, jsonData) {
				var me = this;
				var objGroupView = me.getGroupView();
				var buttonMask = me.strDefaultMask;
				var maskArray = new Array(), actionMask = '', objData = null;;

				if (!Ext.isEmpty(jsonData)
						&& !Ext.isEmpty(jsonData.d.__buttonMask))
					buttonMask = jsonData.d.__buttonMask;
					
				var isSameUser = true;
				var isDisabled = false;
				var isSubmit = false;
				maskArray.push(buttonMask);
				
				for (var index = 0; index < arrSelectedRecords.length; index++) {
					objData = arrSelectedRecords[index];
					maskArray.push(objData.get('__metadata').__rightsMap);
					if (objData.raw.makerId === USER) {
						isSameUser = false;
					}
					if (objData.raw.validFlag != 'Y') {
						isDisabled = true;
					}
					if (objData.raw.isSubmitted == 'Y' && objData.raw.requestState == 0) {
						isSubmit = true;
					}
				}
				actionMask = doAndOperation(maskArray, 10);
				me.enableDisableGroupActions(actionMask, isSameUser, isDisabled,
						isSubmit);
			},

			enableDisableGroupActions : function(actionMask, isSameUser, isDisabled,
					isSubmit) {
				var me=this;		
				var objGroupView = me.getGroupView();
				var actionBar = objGroupView.down('toolbar[itemId="groupActionToolBar"]');
				var blnEnabled = false, strBitMapKey = null, arrItems = new Array();
				if (!Ext.isEmpty(actionBar) && !Ext.isEmpty(actionBar.items.items)) {
					arrItems = actionBar.items.items;
					Ext.each(arrItems, function(item) {
								strBitMapKey = parseInt(item.maskPosition,10) - 1;
								if (strBitMapKey) {
									blnEnabled = isActionEnabled(actionMask,
											strBitMapKey);

									if ((item.maskPosition === 5 && blnEnabled)) {
										blnEnabled = blnEnabled && isSameUser;
									} else if (item.maskPosition === 6 && blnEnabled) {
										blnEnabled = blnEnabled && isSameUser;
									} else if (item.maskPosition === 7 && blnEnabled) {
										blnEnabled = blnEnabled && isDisabled;
									} else if (item.maskPosition === 8 && blnEnabled) {
										blnEnabled = blnEnabled && !isDisabled;
									} else if (item.maskPosition === 9 && blnEnabled) {
										blnEnabled = blnEnabled && !isSubmit;
									}
									item.setDisabled(!blnEnabled);
								}
							});
				}
			},
			doHandleRowIconClick : function(actionName, objGrid, record, rowIndex) {
                    var me = this;
                    if (actionName === 'submit' || actionName === 'accept'
                            || actionName === 'enable' || actionName === 'disable'
                            || actionName === 'reject' || actionName === 'discard')
                        me.doHandleGroupActions(actionName, objGrid, [record],
                                'groupAction');
                    else if (actionName === 'btnHistory') {
                        var recHistory = record.raw.history;
                        if (!Ext.isEmpty(recHistory)
                                && !Ext.isEmpty(recHistory.__deferred.uri)) {
                            me.showHistory(record.raw.
                                            reportName,
                                    recHistory.__deferred.uri, record
                                            .get('identifier'));
                        }
                    } else if (actionName === 'btnView') {
                        viewCustomReport( record );
                    } else if (actionName === 'btnEdit') {
                        editCustomReport( record );
                    }
            },
            showHistory : function(report, url, id )
            {
             var historyPopup = Ext.create(
                    'GCP.view.HistoryPopup',
                    {
                        reportName: report,
                        historyUrl : url,
                        identifier : id
                    } ).show();
                historyPopup.center();
                Ext.getCmp('btnCustomReportHistoryPopupClose').focus();
            },
			doHandleGroupActions : function( strAction, grid, arrSelectedRecords, strActionType )
			{
				var me = this;
				var strUrl;
				if( strAction == 'submit' )
				{
					strUrl = 'loadCustomReportWidgetsData/submit.srvc?';
				}
				else if(strAction == 'discard' )
				{
					strUrl = 'loadCustomReportWidgetsData/discard.srvc?';
				}
				else if(strAction == 'accept' )
				{
					strUrl = 'loadCustomReportWidgetsData/approve.srvc?';
				}
				else if(strAction == 'reject')
				{
					strUrl = 'loadCustomReportWidgetsData/reject.srvc?';
				}
				else if(strAction == 'enable')
				{
					strUrl = 'loadCustomReportWidgetsData/enable.srvc?';
				}
				else if(strAction == 'disable' )
				{
					strUrl = 'loadCustomReportWidgetsData/disable.srvc?';
				}
				if(strAction == 'disable')
				{
					/*Ext.MessageBox.confirm( 'Suspend', 'Are you sure suspend your Schedules  too?', function( btn )
					{
						if( btn === 'yes' )
						{
							me.preHandleGroupActions( strUrl, '', grid, arrSelectedRecords, strActionType, strAction )
						}
					} );*/
					$('#showDiscardPopup').dialog({
						bgiframe : true,
						autoOpen : false,
						modal : true,
						resizable : false,
						width : "320px",
						buttons : {
							Yes : function() {
								me.preHandleGroupActions( strUrl, '', grid, arrSelectedRecords, strActionType, strAction )
								$(this).dialog('destroy');
							},
							No : function() {
								$(this).dialog('destroy');
							}
						},
				        close: function (event, ui) {
				            $(this).dialog('destroy');
				        }
					});
					$('#showDiscardPopup').dialog('open');
				}
				else if( strAction == 'reject' )
				{
					this.showRejectVerifyPopUp(strAction, strUrl,
							grid, arrSelectedRecords, strActionType);
				}
				else
				{
					me.preHandleGroupActions( strUrl, '', grid, arrSelectedRecords, strActionType, strAction );
				}
			},
			preHandleGroupActions : function( strUrl, remark, grid, arrSelectedRecords, strActionType, strAction )
			{
				var me = this;
				var groupView = me.getGroupView();
				var objGroupView = me.getGroupView();
				if( !Ext.isEmpty( groupView ) )
				{
					var me = this;
					if( !Ext.isEmpty( grid ) )
					{
						var arrayJson = new Array();
						var records = ( arrSelectedRecords || [] );
						for( var index = 0 ; index < records.length ; index++ )
						{
							arrayJson.push(
							{
								reportCode : records[ index ].data.reportCode,
								entityCode : records[ index ].data.entityCode,
								sellerId : records[ index ].data.sellerId,
								identifier : records[ index ].data.identifier,
								serialNo : grid.getStore().indexOf(records[index]) + 1,
								userMessage : remark
							} );
						}
						if( arrayJson )
							arrayJson = arrayJson.sort( function( valA, valB )
							{
								return valA.serialNo - valB.serialNo
							} );
						groupView.setLoading( true );
						if(strUrl != null && strUrl.indexOf("?")>0)
							strUrl+="&"+csrfTokenName+"="+tokenValue;
						else	
							strUrl+="?"+csrfTokenName+"="+tokenValue;
						Ext.Ajax.request(
						{
							url : strUrl,
							method : 'POST',
							jsonData : Ext.encode( arrayJson ),
							success : function( response )
							{
								//var jsonRes = Ext.JSON
								//		.decode(jsonData.responseText);
								var errorMessage = '';
								if(response.responseText != '[]')
							       {
								        var jsonData = Ext.decode(response.responseText);
								        if(!Ext.isEmpty(jsonData))
								        {
								        	jsonData = jsonData.d.instrumentActions;
								        	for(var i =0 ; i<jsonData.length;i++ )
								        	{
								        		var arrError = jsonData[i].errors;
								        		if(!Ext.isEmpty(arrError))
								        		{
								        			for(var j =0 ; j< arrError.length; j++)
										        	{
									        			errorMessage = errorMessage + arrError[j].code +' : '+ arrError[j].errorMessage+"<br/>";
										        	}
								        		}
								        		
								        	}
									        if('' != errorMessage && null != errorMessage)
									        {
									         //Ext.Msg.alert("Error",errorMessage);
									        	Ext.MessageBox.show({
													title : getLabel('instrumentErrorPopUpTitle','Error'),
													msg : errorMessage,
													buttons : Ext.MessageBox.OK,
													buttonText: {
											            ok: getLabel('btnOk', 'OK')
														},
													cls : 'ux_popup',
													icon : Ext.MessageBox.ERROR
												});
									        } 
								        }
							       }
								groupView.setLoading( false );
								me.getSmartgrid().refreshData();
								objGroupView.handleGroupActionsVisibility( me.strDefaultMask );
							},
							failure : function()
							{
								var errMsg = "";
								groupView.setLoading( false );
								Ext.MessageBox.show(
								{
									title : getLabel( 'instrumentErrorPopUpTitle', 'Error' ),
									msg : getLabel( 'instrumentErrorPopUpMsg', 'Error while fetching data..!' ),
									buttons : Ext.MessageBox.OK,
									buttonText: {
							            ok: getLabel('btnOk', 'OK')
										},
									icon : Ext.MessageBox.ERROR
								} );
							}
						} );
					}
				}
			},
			addFavoriteRep : function( reportCode, wdgt )
			{
				var me = this;
				me.favReport.push( reportCode );
				var newReportset = "{\"reports\":" + "[";
				me.flagFavSet = true;
				for( var index = 0 ; index < me.favReport.length ; index++ )
				{
					var rep = me.favReport[ index ];
					var newRep = '"' + rep + '"';
					newReportset = newReportset + newRep;
					if( index != ( me.favReport.length - 1 ) )
						newReportset = newReportset + ",";
				}

				newReportset = newReportset + "]}";


				Ext.Ajax.request(
				{
					url : 'userpreferences/customReportCenter/preferredReports.srvc',
					method : 'POST',
					jsonData : newReportset,
					success : function( response )
					{},
					failure : function()
					{}
				} );

				var favLength = me.favReport.length;
				/*
				 * me.getFavButtonRef().setText(getLabel('favorites',
				 * 'Favorites') + "(<span class='red'>" + favLength + "</span>)");
				 * me.getFavButtonRef().accArray = me.favReport;
				 */
			},
			deleteFavoriteRep : function( reportCode, wdgt )
			{
				var reportId = reportCode;
				var me = this;
				me.flagFavSet = true;
				var index = me.favReport.indexOf( reportId, 0 );

				if( index > -1 )
				{
					me.favReport.splice( index, 1 );
				}
				var newReportset = "{\"reports\":" + "[";

				for( var index = 0 ; index < this.favReport.length ; index++ )
				{
					var Acc = me.favReport[ index ];
					var newAcc = '"' + Acc + '"';
					newReportset = newReportset + newAcc;
					if( index != ( me.favReport.length - 1 ) )
						newReportset = newReportset + ",";
				}

				newReportset = newReportset + "]}";

				Ext.Ajax.request(
				{
					url : 'userpreferences/customReportCenter/preferredReports.srvc',
					method : 'POST',
					jsonData : newReportset,
					success : function( response )
					{
					},
					failure : function()
					{
					}

				} );
				var favLength = me.favReport.length;
				/*
				 * me.getFavButtonRef().setText(getLabel('favorites',
				 * 'Favorites') + "(<span class='red'>" + favLength + "</span>)");
				 * me.getFavButtonRef().accArray = me.favReport;
				 */
			},
			
			showRejectVerifyPopUp : function(strAction, strActionUrl,
					grid, arrSelectedRecords, strActionType) {
				var me = this;
				var titleMsg = '', fieldLbl = '';
				
				fieldLbl = getLabel('rejectRemarkPopUpTitle',
							'Please Enter Reject Remark');
				titleMsg = getLabel('rejectRemarkPopUpFldLbl', 'Reject Remark');
				var msgbox = Ext.Msg.show({
							title : titleMsg,
							msg : fieldLbl,
							cls:'t7-popup',
							buttons : Ext.Msg.OKCANCEL,
							multiline : 4,
							width: 355,
							height : 270,
							bodyPadding : 0,
							fn : function(btn, text) {
								if (btn == 'ok') {
								    if (Ext.isEmpty(text)) {
					                       Ext.Msg.alert(getLabel('errorTitle', 'Error'), getLabel('rejectRestrictionErroMsg',
					                                            'Reject Remark field can not be blank'));
					                }else{
					                	me.preHandleGroupActions( strActionUrl, text, grid, 
												arrSelectedRecords, strActionType, strAction );
					                }
								}
							}
						});
				msgbox.textArea.enforceMaxLength = true;
				msgbox.textArea.inputEl.set({
					maxLength : 255
				});
			},
			
			getFavoriteReports : function()
			{
				var me = this;
				Ext.Ajax.request(
				{
					url : 'userpreferences/customReportCenter/preferredReports.srvc',
					headers: objHdrCsrfParams,
					method : "GET",
					success : function( response )
					{
						if( response.responseText != '' )
							me.loadFavoriteReports( Ext.decode( response.responseText ) );
					},
					failure : function( response )
					{
						// console.log('Error
						// Occured-handleAccountTypeLoading');
					}
				} );
			},

			loadFavoriteReports : function( data )
			{
				if( data.error == null )
				{
					var me = this;
					var jsonData = JSON.parse( data.preference );
					// var FavoritesCount = jsonData.reports.length;
					var accSetArray = jsonData.reports;
					var accFavArrInt = [];
					for( i = 0 ; i < jsonData.reports.length ; i++ )
					{
						accFavArrInt.push( accSetArray[ i ] );
					}
					me.favReport = accFavArrInt;
				}
			},

			applyQuickFilter : function()
			{
				var me = this;
				var groupView = me.getGroupView();
				groupView.down( 'smartgrid' ).refreshData();
			},
			doHandleCellClick : function( view, td, cellIndex, record, tr, rowIndex, e, eOpts )
			{
				var me = this;
				var linkClicked = ( e.target.tagName == 'SPAN' );
				var imgClicked = ( e.target.tagName == 'A' && cellIndex == 2 );
				var clickedId = e.target.id;
				if( clickedId == 'seeSchedule' && cellIndex == 2 )
				{
					me.addNewScheduleReport( record );
				}
				else if( clickedId == 'addSchedule' && cellIndex == 2 )
				{
					me.addNewScheduleReport( record );
				}
				else if( imgClicked && cellIndex == 2 )
				{
					//editCustomReport( record );
				}
				/*else if( generateClicked )
				{
					me.generateOndemand( record );
				}*/
			},

			generateOndemand : function( record )
			{
				var me = this;
				me.doSavePreferenceToLocale();
				me.submitRequest( 'Generate', record );
			},
			editReport : function( record )
			{
				var me = this;
				me.submitRequest( 'editReport', record );
			},

			handleRowIconClickDwnld : function( tableView, rowIndex, columnIndex, btn, event, record )
			{
				var me = this;
				me.submitRequest( 'Download', record );
			},

			addNewScheduleReport : function( record )
			{
				var me = this;
				me.doSavePreferenceToLocale();
				me.submitRequest( 'addSchedule', record );
			},
			updateConfigs : function()
			{
				var me = this;
				me.preferenceHandler = Ext.create( 'Ext.ux.gcp.PreferencesHandler' );
				var objPref = {};
				if( !Ext.isEmpty( objGridViewFilterPref ) )
				{
					var data = Ext.decode( objGridViewFilterPref );
					var clientVal = data.clientVal;
					var clientDesc = data.clientDesc;
					var reportOrDownload = data.repOrDwnld;
					var status = data.statusCode;
					var seller = data.financialInstitutionVal;
					var reportType = data.reportType;
					objPref[ 'sellerCode' ] = seller;
					objPref[ 'clientCode' ] = clientVal;
					objPref[ 'clientDesc' ] = clientDesc;
					objPref[ 'repOrDwnld' ] = reportOrDownload;
					objPref[ 'reportType' ] = reportType;
					objPref[ 'statusCode' ] = status;
					me.clientFilterVal = data.filterSelectedClientCode;
					me.clientFilterDesc = data.filterSelectedClientDesc;
					if (entity_type == '1') {
						$("#summaryClientFilterSpan").text(me.clientFilterDesc);
						changeClientAndRefreshGrid(me.clientFilterVal,me.clientFilterDesc)
					}else if(entity_type=='0'){
						$("#summaryClientFilter").val(me.clientFilterDesc);
						changeClientAndRefreshGrid(me.clientFilterVal,me.clientFilterDesc)
					}
					me.setDataForQuickFilter( objPref );
					me.filterDataPref = objPref;
					/* Set Filter Elements Value Of Filter Panle */

				}else{
					objPref[ 'sellerCode' ] = strSeller;
					objPref[ 'clientCode' ] = strClient;
					objPref[ 'clientDesc' ] = strClientDesc;
					objPref[ 'repOrDwnld' ] = 'R';
					objPref[ 'reportType' ] ='C';
					//me.setDataForQuickFilter( objPref );
					me.filterDataPref = objPref;
				}

				//me.widgetType = 
			},
			doHandleLoadGridData : function( groupInfo, subGroupInfo, grid, url, pgSize, newPgNo, oldPgNo, sorter )
			{
				var me = this;
				var objGroupView = me.getGroupView();
				var buttonMask = me.strDefaultMask;
				url = url + me.widgetType + '.srvc';
				objGroupView.handleGroupActionsVisibility( buttonMask );
				var strUrl = grid.generateUrl( url, pgSize, newPgNo, oldPgNo, sorter );
				strUrl += me.generateFilterUrl( groupInfo, subGroupInfo );
				strUrl = strUrl + "&" + csrfTokenName + "=" + csrfTokenValue;

				var arrOfParseQuickFilter = [], arrOfParseAdvFilter = [], arrOfFilteredApplied = [];
				if (!Ext.isEmpty(me.filterData)) {
					if (!Ext.isEmpty(me.filterData) && me.filterData.length >= 1) 
					{
						var quickJsonData = me.filterData;
						var reqJsonInQuick = me.findInQuickFilterData(quickJsonData,'seller');
						if (!Ext.isEmpty(reqJsonInQuick)) 
						{
							arrQuickJson = quickJsonData;
							arrQuickJson = me.removeFromQuickArrJson(arrQuickJson,'seller');
							quickJsonData = arrQuickJson;
						}
						var reqJsonInQuick = me.findInQuickFilterData(quickJsonData,'repOrDwnld');
						if (!Ext.isEmpty(reqJsonInQuick)) 
						{
							arrQuickJson = quickJsonData;
							arrQuickJson = me.removeFromQuickArrJson(arrQuickJson,'repOrDwnld');
							quickJsonData = arrQuickJson;
						}
						var reqJsonInQuick = me.findInQuickFilterData(quickJsonData,'reportType');
						if (!Ext.isEmpty(reqJsonInQuick)) 
						{
							arrQuickJson = quickJsonData;
							arrQuickJson = me.removeFromQuickArrJson(arrQuickJson,'reportType');
							quickJsonData = arrQuickJson;
						}
						arrOfParseQuickFilter = generateFilterArray(quickJsonData);
					}
				}
				me.advFilterData = [];
				if (!Ext.isEmpty(me.advFilterData)) 
				{ 
					if (!Ext.isEmpty(me.advFilterData) && me.advFilterData.length >= 1) {				
						arrOfParseAdvFilter = generateFilterArray(me.advFilterData);
					}
				}

				if (arrOfParseQuickFilter && arrOfParseAdvFilter) 
				{
					arrOfFilteredApplied = arrOfParseQuickFilter.concat(arrOfParseAdvFilter);
					if ( arrOfFilteredApplied )
						me.getFilterView().updateFilterInfo(arrOfFilteredApplied);
				}
				grid.loadGridData( strUrl, null, null, false );
			},

			generateFilterUrl : function( groupInfo, subGroupInfo )
			{
				var me = this;
				var filterView = me.getCustomReportCenterFilterViewRef();
				var strQuickFilterUrl = '', strWidgetFilterUrl = '', strUrl = '', isFilterApplied = false, isFavouriteFilter = false;
				strQuickFilterUrl = me.generateUrlWithQuickFilterParams( me.filterData );
				strWidgetFilterUrl = me.generateWidgetUrl( groupInfo, subGroupInfo );
				if( !Ext.isEmpty( strQuickFilterUrl ) )
				{
					strUrl += strQuickFilterUrl;
					isFilterApplied = true;
				}
				if( !Ext.isEmpty( strWidgetFilterUrl ) )
				{
					if( isFilterApplied )
						strUrl += ' and ' + strWidgetFilterUrl;
					else
						strUrl += '&$filter=' + strWidgetFilterUrl;
				}
				if(!Ext.isEmpty(filterView)){
					if( !Ext.isEmpty( filterView.clientCode ) && filterView.clientCode != 'all' ){
						strUrl += '&$isClientFilterSelected=Y';
					}	
				}else{
					if(!Ext.isEmpty(strClient)){
						strUrl += '&$isClientFilterSelected=Y';
					}	
				}
				if( strDownloadFilter == 'D' )
				{
					strUrl += '&$isDownloadFilter=D';
				}
				return strUrl;
			},
			generateUrlWithQuickFilterParams : function( urlFilterData )
			{
				var me = this;
				var filterData = urlFilterData;
				var isFilterApplied = false;
				var strFilter = '&$filter=';
				var strTemp = '';
				var strFilterParam = '';
				for( var index = 0 ; index < filterData.length ; index++ )
				{
					if( isFilterApplied )
						strTemp = strTemp + ' and ';
					switch( filterData[ index ].operatorValue )
					{
						case 'eq':
						case 'lk':
							isFilterApplied = true;
							strTemp = strTemp + filterData[ index ].paramName + ' ' + filterData[ index ].operatorValue
								+ ' ' + '\'' + filterData[ index ].paramValue1 + '\'';
							break;
						case 'statusFilterOp' :
							var objValue = filterData[index].paramValue1;
							var objUser = filterData[index].makerUser;
							var objArray = objValue.split(',');
							for (var i = 0; i < objArray.length; i++) {
									if( i== 0)
									strTemp = strTemp + '(';
									if(objArray[i] == 12){
										strTemp = strTemp + "(requestState eq 0 and isSubmitted eq 'N')";
									}
									else if(objArray[i] == 14){
										strTemp = strTemp + "(requestState eq 1 and isSubmitted eq 'N')";
									}
									else if(objArray[i] == 3){
										strTemp = strTemp + "(requestState eq 3 and validFlag eq 'Y')";
									}
									else if(objArray[i] == 11){
										strTemp = strTemp + "(requestState eq 3 and validFlag eq 'N')";
									}
									else if(objArray[i] == 13){
										strTemp = strTemp + "(((isSubmitted eq 'N' and (requestState eq '0' or requestState eq '1' )) or (requestState eq '4') or (requestState eq '5'))and makerId ne '"+objUser+"' )";
									}
									else if(objArray[i] == 0 || objArray[i] == 1){
										strTemp = strTemp + "(requestState eq "+objArray[i]+" and isSubmitted eq 'Y')";
									}
									else{
										strTemp = strTemp + "(requestState eq "+objArray[i]+")";
									}
									if(i != (objArray.length -1)){
										strTemp = strTemp + ' or ';
									}
									if(i == (objArray.length -1))
									strTemp = strTemp + ')';
							
							}	
							break;
					}
					isFilterApplied = true;
				}
				if( isFilterApplied )
					strFilter = strFilter + strTemp;
				else
					strFilter = '';
				return strFilter;
			},
			generateWidgetUrl : function( groupInfo, subGroupInfo )
			{
				if( subGroupInfo.groupCode != 'all' )
				{
					var strWidgetFilter = 'reportModule' + ' eq ' + '\'' + subGroupInfo.groupCode + '\'';
				}
				else
				{
					var strWidgetFilter = '';
					'reportModule' + ' eq ' + '\'' + '%' + '\'';
				}

				return strWidgetFilter;
			},
			doHandleGroupTabChange : function( groupInfo, subGroupInfo, tabPanel, newCard, oldCard )
			{
				var me = this;
				me.widgetType = subGroupInfo.groupCode;
				me.reportModule = subGroupInfo.groupCode;
				var objGroupView = me.getGroupView();
				var strModule = '', strUrl = null, args = null;
				groupInfo = groupInfo || {};
				subGroupInfo = subGroupInfo || {};

				if( groupInfo )
				{
					if( groupInfo.groupTypeCode == 'ADV_FILTER' )
					{
						strModule = subGroupInfo.groupCode
						args =
						{
							'module' : strModule
						};
						me.preferenceHandler.readModulePreferences( me.strPageName, strModule,
							me.postDoHandleGroupTabChange, args, me, true );
					}
					else
					{
						args =
						{
							scope : me
						};
						strModule = subGroupInfo.groupCode;
						strUrl = Ext.String.format( me.strGetModulePrefUrl, strModule );
						me.getSavedPreferences( strUrl, me.postDoHandleGroupTabChange, args );
					}
				}
			},
			postDoHandleGroupTabChange : function( data, args, isSuccess )
			{
				var me = args.scope;
				var objGroupView = me.getGroupView();
				var objSummaryView = me.getCustomReportCenterViewRef(), objPref = null, gridModel = null, intPgSize = null,showPager = true, heightOption = null;
				var colModel = null, arrCols = null;
				if( data && data.preference )
				{
				//	me.toggleClearPrefrenceAction( true );
					objPref = Ext.decode( data.preference );
					arrCols = objPref.gridCols || objDefPref[ mapService[ args[ 'module' ] ] ] || null;
					intPgSize = objPref.pgSize || _GridSizeTxn;
					colModel = objSummaryView.getColumns( arrCols );
					showPager = objPref.gridSetting
					&& !Ext.isEmpty(objPref.gridSetting.showPager)
					? objPref.gridSetting.showPager
					: true;
					heightOption = objPref.gridSetting
							&& !Ext.isEmpty(objPref.gridSetting.heightOption)
							? objPref.gridSetting.heightOption
							: null;	
					if( colModel )
					{
						gridModel =
						{
							columnModel : colModel,
							pageSize : intPgSize,
							showPagerForced : showPager,
							heightOption : heightOption,
							storeModel:{
							  sortState:objPref.sortState
		                    }
						};
					}
				}
				objGroupView.reconfigureGrid( gridModel );
			},
			getSavedPreferences : function( strUrl, fnCallBack, args )
			{
				var me = this;
				Ext.Ajax.request(
				{
					url : strUrl,
					method : 'GET',
					success : function( response )
					{
						var data = null;
						if( response && response.responseText )
							data = Ext.decode( response.responseText );
						Ext.Function.bind( fnCallBack, me );
						if( fnCallBack )
							fnCallBack( data, args );
					},
					failure : function()
					{
					}

				} );
			},
			setDataForQuickFilter : function( filterJson )
			{   
				var data = null,filterDataObject={};
				var me = this, filter = me.getCustomReportCenterFilterViewRef(), arrFilter = [];
				if( !me.isEmptyObject( filterJson ) )
				{
					data = filterJson;
				}
				else if(Ext.isEmpty(filter))
				{
					filterDataObject['clientCode']=strClient;
					filterDataObject['sellerCode']=strSeller;
					filterDataObject['repOrDwnld']='R';
					filterDataObject['reportType']='C';					
					data=filterDataObject;
				}else{
					data = filter.getQuickFilterJSON();
				}
				if( data )
				{
					if( data[ 'sellerCode' ] )
					{
						arrFilter.push(
						{
							paramName : 'seller',
							paramValue1 : ( data[ 'sellerCode' ] || '' ).toUpperCase(),
							operatorValue : 'eq',
							dataType : 'S'
						} );
					}
					if( data[ 'repOrDwnld' ] )
					{
						arrFilter.push(
						{
							paramName : 'repOrDwnld',
							paramValue1 : ( data[ 'repOrDwnld' ] || '' ),
							operatorValue : 'eq',
							dataType : 'S'
						} );
						strDownloadFilter = data[ 'repOrDwnld' ];
					}
					if( data[ 'reportType' ] && data[ 'reportType' ] != 'FAVORITE' )
						arrFilter.push(
						{
							paramName : 'reportType',
							paramValue1 : ( data[ 'reportType' ] || '' ),
							operatorValue : 'eq',
							dataType : 'S'
						} );

					if( data[ 'clientCode' ] )
						arrFilter.push(
						{
							paramName : 'clientName',
							paramValue1 : encodeURIComponent(( data[ 'clientDesc' ] || '' ).replace(new RegExp("'", 'g'), "\''")),
							operatorValue : 'eq',
							dataType : 'S',
							displayType : 5,
							paramFieldLable : getLabel('lblcompany', 'Company Name'),
							displayValue1 : ( data[ 'clientDesc' ] || '' )
						} );

					if( data[ 'statusCode' ] )
						arrFilter.push(
						{
							paramName : 'reportStatus',
							paramValue1 : ( data[ 'statusCode' ] || '' ),
							operatorValue : 'statusFilterOp',
							makerUser : encodeURIComponent(USER.replace(new RegExp("'", 'g'), "\''")),
							dataType : 'S',
							displayType : 5,
							paramFieldLable : getLabel('status', 'Status'),
							displayValue1 : ( data[ 'statusCodeDesc' ] || '' )
						} );
					
					
				}
				me.filterData = arrFilter;
			},
			setInfoTooltip : function()
			{
				var me = this, filter = me.getCustomReportCenterFilterViewRef(), arrFilter = [];
				Ext.create( 'Ext.tip.ToolTip',
				{
					target : 'imgFilterInfoStdView',
					listeners :
					{
						'beforeshow' : function( tip )
						{
							var data = filter.getQuickFilterJSON();
							var financialInstitutionVal = data[ 'sellerCode' ];
							var clientVal = ( data[ 'clientDesc' ] || getLabel( 'none', 'None' ) );
							var repOrDwnldDesc = ( data[ 'repOrDwnldDesc' ] || getLabel( 'all', 'All' ) );
							var statusFilter = ( data[ 'statusCodeDesc' ] || getLabel( 'all', 'All' ) );
							var reportTypeDesc = ( data[ 'reportTypeDesc' ] || getLabel( 'all', 'All' ) );
							tip.update( getLabel( 'financialInstitution', 'Financial Insitution' ) + ' : '
								+ financialInstitutionVal + '<br/>' + getLabel( 'client', 'Company Name' ) + ' : '
								+ clientVal + '<br/>' + getLabel( 'status', 'Status' ) + ' : ' + statusFilter );
						}
					}
				} );

			},
			submitRequest : function( str, record )
			{
				var me = this;
				form = document.createElement( 'FORM' );
				form.name = 'frmMain';
				form.id = 'frmMain';
				form.method = 'POST';
				if( str == 'addReport' )
				{
					strUrl = "addCustomReport.srvc";
					form.appendChild( me.createFormField( 'INPUT', 'HIDDEN', 'clientCode',
						me.clientFilterVal ) );
					form.appendChild( me.createFormField( 'INPUT', 'HIDDEN', 'entitlementSeller', strSeller ) );
					form.appendChild( me.createFormField( 'INPUT', 'HIDDEN', 'reportCode', '' ) );
				}
				if( str == 'addIMDef' )
				{
					strUrl = "interfaceMapCenter.srvc";
				}
				if( str == 'editReport' )
				{
					strUrl = "editCustomReport.srvc";
					form
						.appendChild( me.createFormField( 'INPUT', 'HIDDEN', 'reportCode', record.get( 'reportCode' ) ) );
					form
						.appendChild( me.createFormField( 'INPUT', 'HIDDEN', 'clientCode', record.get( 'entityCode' ) ) );
					form.appendChild( me.createFormField( 'INPUT', 'HIDDEN', 'entitlementSeller', record
						.get( 'sellerId' ) ) );
				}
				else if( str == 'addSchedule' )
				{
					strUrl = "addScheduleDefination.srvc";

					form.appendChild( me.createFormField( 'INPUT', 'HIDDEN', 'schSrcId', record.get( 'reportCode' ) ) );
					form
						.appendChild( me.createFormField( 'INPUT', 'HIDDEN', 'schSrcName', record.get( 'reportName' ) ) );
					form.appendChild( me.createFormField( 'INPUT', 'HIDDEN', 'schSecurityProfileName', record
						.get( 'securityProfile' ) ) );
					form.appendChild( me.createFormField( 'INPUT', 'HIDDEN', 'schSecurityProfileID', record
						.get( 'securityProfileId' ) ) );
					form.appendChild( me.createFormField( 'INPUT', 'HIDDEN', 'schDelInfo', record.get( 'delInfo' ) ) );
					form.appendChild( me.createFormField( 'INPUT', 'HIDDEN', 'schDelMedium',
						( record.get( 'medium' ) == 'EMAIL' ? 'SMTP' : record.get( 'medium' ) ) ) );
					form
						.appendChild( me.createFormField( 'INPUT', 'HIDDEN', 'schDelOutput', record.get( 'delOutput' ) ) );
					form.appendChild( me
						.createFormField( 'INPUT', 'HIDDEN', 'schModuleCode', record.get( 'moduleCode' ) ) );
					form.appendChild( me.createFormField( 'INPUT', 'HIDDEN', 'schSrcType', record.get( 'srcType' ) ) );
					form.appendChild( me
						.createFormField( 'INPUT', 'HIDDEN', 'schSrcSubType', record.get( 'reportType' ) ) );
					form.appendChild( me
						.createFormField( 'INPUT', 'HIDDEN', 'schEntityCode', record.get( 'entityCode' ) ) );
					form.appendChild( me.createFormField( 'INPUT', 'HIDDEN', 'sellerId', record.get( 'sellerId' ) ) );
					form
						.appendChild( me.createFormField( 'INPUT', 'HIDDEN', 'identifier', record.get( 'identifier' ) ) );
					form.appendChild( me.createFormField( 'INPUT', 'HIDDEN', 'version', 0 ) );
					form.appendChild( me
						.createFormField( 'INPUT', 'HIDDEN', 'recordKeyNo', record.get( 'recordKeyNo' ) ) );
					form.appendChild( me
						.createFormField( 'INPUT', 'HIDDEN', 'schEntityType', record.get( 'entityType' ) ) );
					form
						.appendChild( me.createFormField( 'INPUT', 'HIDDEN', 'schChannel', record.get( 'channelName' ) ) );
					form.appendChild( me.createFormField( 'INPUT', 'HIDDEN', 'intRecordKeyNmbr', record
						.get( 'intRecordKeyNmbr' ) ) );
				}
				else if( str == 'Generate' )
				{
					strUrl = "showGenerateReportParam.srvc";
					form.appendChild( me.createFormField( 'INPUT', 'HIDDEN', 'screenName', 'customReportCenter' ) );
					form
						.appendChild( me.createFormField( 'INPUT', 'HIDDEN', 'moduleCode', record.get( 'moduleCode' ) ) );
					form.appendChild( me.createFormField( 'INPUT', 'HIDDEN', 'srcType', record.get( 'srcType' ) ) );
					form
						.appendChild( me.createFormField( 'INPUT', 'HIDDEN', 'reportCode', record.get( 'reportCode' ) ) );
					form.appendChild( me.createFormField( 'INPUT', 'HIDDEN', 'reportFileName', record
						.get( 'reportName' ) ) );
					form.appendChild( me.createFormField( 'INPUT', 'HIDDEN', 'delInfo', record.get( 'delInfo' ) ) );
					form.appendChild( me.createFormField( 'INPUT', 'HIDDEN', 'delMedium',
						( record.get( 'medium' ) == 'EMAIL' ? 'SMTP' : record.get( 'medium' ) ) ) );
					form.appendChild( me.createFormField( 'INPUT', 'HIDDEN', 'securityProfileID', record
						.get( 'securityProfileId' ) ) );
					form.appendChild( me.createFormField( 'INPUT', 'HIDDEN', 'securityProfileName', record
						.get( 'securityProfile' ) ) );
					form
						.appendChild( me.createFormField( 'INPUT', 'HIDDEN', 'clientCode', record.get( 'entityCode' ) ) );
					form.appendChild( me.createFormField( 'INPUT', 'HIDDEN', 'entitlementSeller', record
						.get( 'sellerId' ) ) );
					form
						.appendChild( me.createFormField( 'INPUT', 'HIDDEN', 'srcSubType', record.get( 'reportType' ) ) );
					form
						.appendChild( me.createFormField( 'INPUT', 'HIDDEN', 'entityType', record.get( 'entityType' ) ) );
					form.appendChild( me
						.createFormField( 'INPUT', 'HIDDEN', 'channelName', record.get( 'channelName' ) ) );
					form.appendChild( me.createFormField( 'INPUT', 'HIDDEN', 'intRecordKeyNo', record
						.get( 'intRecordKeyNmbr' ) ) );
				}
				else if( str == 'Download' )
				{
					strUrl = "downloadPreGeneratedReport.srvc";
					form.appendChild( me
						.createFormField( 'INPUT', 'HIDDEN', 'recordKeyNo', record.get( 'recordKeyNo' ) ) );
					form.appendChild( me.createFormField( 'INPUT', 'HIDDEN', 'schTempFileDir', record
						.get( 'schTempFileDir' ) ) );
					form
						.appendChild( me.createFormField( 'INPUT', 'HIDDEN', 'gaFileName', record.get( 'gaFileName' ) ) );
				}
				else if( str == 'View' )
				{
					strUrl = "viewScheduleReport.srvc";

					form
						.appendChild( me.createFormField( 'INPUT', 'HIDDEN', 'identifier', record.get( 'identifier' ) ) );
					form.appendChild( me.createFormField( 'INPUT', 'HIDDEN', 'version', record.get( 'version' ) ) );
					form.appendChild( me
						.createFormField( 'INPUT', 'HIDDEN', 'recordKeyNo', record.get( 'recordKeyNo' ) ) );
					form.appendChild( me
						.createFormField( 'INPUT', 'HIDDEN', 'schEntityType', record.get( 'entityType' ) ) );
					form
						.appendChild( me.createFormField( 'INPUT', 'HIDDEN', 'schChannel', record.get( 'channelName' ) ) );
					form.appendChild( me.createFormField( 'INPUT', 'HIDDEN', 'intRecordKeyNmbr', record
						.get( 'intRecordKeyNmbr' ) ) );
				}
				else if( str == 'Edit' )
				{
					strUrl = "editScheduleReport.srvc";
					form
						.appendChild( me.createFormField( 'INPUT', 'HIDDEN', 'identifier', record.get( 'identifier' ) ) );
					form.appendChild( me.createFormField( 'INPUT', 'HIDDEN', 'version', record.get( 'version' ) ) );
					form.appendChild( me
						.createFormField( 'INPUT', 'HIDDEN', 'recordKeyNo', record.get( 'recordKeyNo' ) ) );
					form.appendChild( me
						.createFormField( 'INPUT', 'HIDDEN', 'schEntityType', record.get( 'entityType' ) ) );
					form
						.appendChild( me.createFormField( 'INPUT', 'HIDDEN', 'schChannel', record.get( 'channelName' ) ) );
					form.appendChild( me.createFormField( 'INPUT', 'HIDDEN', 'intRecordKeyNmbr', record
						.get( 'intRecordKeyNmbr' ) ) );
				}

				form.appendChild( me.createFormField( 'INPUT', 'HIDDEN', csrfTokenName, csrfTokenValue ) );
				form.action = strUrl;
				//me.setFilterParameters(form);
				document.body.appendChild( form );
				form.submit();
				document.body.removeChild( form );
			},
			createFormField : function( element, type, name, value )
			{
				var inputField;
				inputField = document.createElement( element );
				inputField.type = type;
				inputField.name = name;
				inputField.value = value;
				return inputField;
			},

			isEmptyObject : function( obj )
			{
				for( var i in obj )
				{
					if( obj.hasOwnProperty( i ) )
					{
						return false;
					}
				}
				return true;
			},
			handleAppliedFilterDelete : function(btn)
			{
				var me = this;
				var objData = btn.data;
				var quickJsonData = me.filterData;
				if(!Ext.isEmpty(objData))
				{
					var paramName = objData.paramName || objData.field;
					var reqJsonInAdv = null;
					var arrAdvJson =null;
					var reqJsonInQuick = me.findInQuickFilterData(quickJsonData,paramName);
					if (!Ext.isEmpty(reqJsonInQuick)) 
					{
						arrQuickJson = quickJsonData;
						arrQuickJson = me.removeFromQuickArrJson(arrQuickJson,paramName);
						me.filterData = arrQuickJson;
					}
					me.resetFieldInAdvAndQuickOnDelete(objData);
					me.refreshData();
				}
			},
			resetFieldInAdvAndQuickOnDelete : function(objData){
				var me = this,strFieldName;
				if(!Ext.isEmpty(objData))
					strFieldName = objData.paramName || objData.field;
				var accountFilter = me.accountFilter;
				
				if (strFieldName ==='reportStatusToolBar' && !Ext.isEmpty(me.getStatusFltRef())) {
					me.getStatusFltRef().setValue('All');
				}
				
				if(strFieldName === 'reportStatus'){
					var objField = me.getStatusFltRef();
					if(!Ext.isEmpty(objField)){
						objField.selectAllValues();
						me.reportStatus = 'ALL';
					}
				}
				else if(strFieldName ==='client')
				{			
					if(isClientUser())
					{
						var clientComboBox = me.getCustomReportCenterFilterViewRef().down('combo[itemId="clientCombo"]');
						me.clientFilterVal = 'ALL';
						selectedFilterClientDesc = "";
						selectedFilterClient = "";
						selectedClientDesc = "";
						clientComboBox.setValue(me.clientFilterVal);
					} 
					else 
					{
						var clientComboBox = me.getCustomReportCenterFilterViewRef().down('combo[itemId="clientAutoCompleter]');
						clientComboBox.reset();
						me.clientFilterVal = '';
						selectedFilterClientDesc = "";
						selectedFilterClient = "";
					}
				}
			},
			handleClearSettings:function(){
				 var me=this;
				 var filterView=me.getCustomReportCenterFilterViewRef();
				 /*if(!isClientUser){
						clientFilterId=filterView.down('combobox[itemId="reportCenterClientId"]');
						clientFilterId.suspendEvents();
						clientFilterId.reset();
						clientFilterId.resumeEvents();
					}else{
						clientFilterId=filterView.down('combo[itemId="clientCombo"]');
						clientFilterId.setValue(strClient);	
				 }
				 */
				 		 
				 var clientCombo=filterView.down('combobox[itemId="clientCombo"]');
				 clientCombo.suspendEvents();
				 clientCombo.setValue("");
				 clientCombo.resumeEvents();
				 me.filterData=[];
				 filterView.clientCode = "";
				 filterView.clientDesc = "";
				 filterView.statusCode = "";
				 filterView.statusCodeDesc = "";
				 var statusFltId = filterView.down('combo[itemId=reportStatusToolBar]');
				 statusFltId.reset();
				 statusFltId.selectAllValues();
				 var groupView = me.getGroupView();
				groupView.down('smartgrid').refreshData();
			},
			disablePreferencesButton: function(btnId,boolVal){
				$("#"+btnId).attr("disabled",boolVal);
				if(boolVal)
					$("#"+btnId).css("color",'grey');
				else
					$("#"+btnId).css("color",'#FFF');
			},savePageSetting : function(arrPref, strInvokedFrom) { 
				/* This will be get invoked from page level setting always */
				var me = this, args = {};
				if (!Ext.isEmpty(arrPref)) {
					me.preferenceHandler.savePagePreferences(me.strPageName, arrPref,
							me.postHandleSavePageSetting, args, me, false);
				}
			},
			postHandleSavePageSetting : function(data, args, isSuccess) {
				if (isSuccess === 'N')  {
					Ext.MessageBox.show({
						title : getLabel('instrumentErrorPopUpTitle', 'Error'),
						msg : getLabel('errorMsg', 'Error while apply/restore setting'),
						buttons : Ext.MessageBox.OK,
						buttonText: {
					            ok: getLabel('btnOk', 'OK')
								},
						cls : 't7-popup',
						icon : Ext.MessageBox.ERROR
					});
				}
				else
				{
					var me = this;
					me.preferenceHandler.readPagePreferences(me.strPageName,
								me.postDoHandleReadPagePrefNew, null, me, true);
				}
			},
			applyPageSetting : function(arrPref, strInvokedFrom) {
				var me = this, args = {};
				if (!Ext.isEmpty(arrPref)) {
					if (strInvokedFrom === 'GRID' && _charCaptureGridColumnSettingAt === 'L') 
					{
						/**
						 * This handling is required for non-us market
						 */
						var groupView = me.getGroupView(), 
						subGroupInfo = groupView.getSubGroupInfo()|| {}, 
						objPref = {},
						groupInfo = groupView.getGroupInfo()|| '{}', 
						strModule = subGroupInfo.groupCode;
						Ext.each(arrPref || [], function(pref) 
								{
									if (pref.module === 'ColumnSetting') 
									{
										objPref = pref.jsonPreferences;
									}
								});
						args['strInvokedFrom'] = strInvokedFrom;
						args['objPref'] = objPref;
						strModule = strModule === 'all' ? groupInfo.groupTypeCode + '-' + strModule : strModule;
						me.preferenceHandler.saveModulePreferences(me.strPageName,
								strModule, objPref, me.postHandlePageGridSetting, args,
								me, false);
					} 
					else 
					{
						me.preferenceHandler.savePagePreferences(me.strPageName,
						arrPref, me.postHandlePageGridSetting, args, me, false);
					}
				}
			},
		restorePageSetting : function(arrPref, strInvokedFrom) { 
				//For US, NON US market		
				var me = this;
				if (strInvokedFrom === 'GRID' && _charCaptureGridColumnSettingAt === 'L') 
						{
							var groupView = me.getGroupView(), subGroupInfo = groupView.getSubGroupInfo()
							|| {}, objPref = {}, groupInfo = groupView.getGroupInfo()
							|| '{}', strModule = subGroupInfo.groupCode, args = {};

					strModule = strModule === 'all' ? groupInfo.groupTypeCode + '-'+ strModule : strModule;
					args['strInvokedFrom'] = strInvokedFrom;
					Ext.each(arrPref || [], function(pref) 
					{
						if (pref.module === 'ColumnSetting') 
						{
							pref.module = strModule;
							return false;
						}
					});
					me.preferenceHandler.clearPagePreferences(me.strPageName,
					arrPref,me.postHandleRestorePageSetting, args, me, false);
				} 
				else
					me.preferenceHandler.clearPagePreferences(me.strPageName,
					arrPref,me.postHandleRestorePageSetting, null, me, false);
			},
			postHandlePageGridSetting : function(data, args, isSuccess) {
				if (isSuccess === 'Y') 
				{
					var me = this;
					var objGroupView = me.getGroupView(), gridModel = null;
					if (args && args.strInvokedFrom === 'GRID' && _charCaptureGridColumnSettingAt === 'L') 
					{
						
						if (args.objPref && args.objPref.gridCols)
							gridModel = 
							{
								columnModel : args.objPref.gridCols
							}
						objGroupView.reconfigureGrid(gridModel);
					}
					else
						window.location.reload();
				} 
				else 
				{
					Ext.MessageBox.show({
						title : getLabel('instrumentErrorPopUpTitle', 'Error'),
						msg : getLabel('errorMsg', 'Error while apply/restore setting'),
						buttons : Ext.MessageBox.OK,
						buttonText: {
				            ok: getLabel('btnOk', 'OK')
							},
						cls : 't7-popup',
						icon : Ext.MessageBox.ERROR
					});
				}
			},
			postHandleRestorePageSetting : function(data, args, isSuccess) {
				if (isSuccess === 'Y') 
				{
					var me = this;
					var objGroupView = me.getGroupView();
					if (args && args.strInvokedFrom === 'GRID'&& _charCaptureGridColumnSettingAt === 'L') 
					{
						if (objGroupView)
							objGroupView.reconfigureGrid(null);
					} 
					else
						window.location.reload();
				} 
				else 
				{
					Ext.MessageBox.show({
						title : getLabel('instrumentErrorPopUpTitle', 'Error'),
						msg : getLabel('errorMsg', 'Error while apply/restore setting'),
						buttons : Ext.MessageBox.OK,
						buttonText: {
				            ok: getLabel('btnOk', 'OK')
							},
						cls : 't7-popup',
						icon : Ext.MessageBox.ERROR
					});
				}
			},
			showPageSettingPopup : function(strInvokedFrom) 
			{
				var me = this, objData = {}, objGroupView =  me.getGroupView(), 
				objPrefData, objGeneralSetting, objGridSetting, objColumnSetting;
				var objGroupByVal = '', objDefaultFilterVal = '', objGridSizeVal = '',
				objRowPerPageVal = _GridSizeTxn, strTitle = null, subGroupInfo;
				me.pageSettingPopup = null;

							if (!Ext.isEmpty(objcustReportPref))
							{
								//Replace as per screen saved preferences
								objPrefData = Ext.decode(objcustReportPref); //Replace as per screen saved preferences
								
								objGeneralSetting = objPrefData && objPrefData.d.preferences &&
								objPrefData.d.preferences.GeneralSetting ? objPrefData.d.preferences.GeneralSetting : null;
								
								objGridSetting = objPrefData && objPrefData.d.preferences && 
								objPrefData.d.preferences.GridSetting ? objPrefData.d.preferences.GridSetting : null;
								/**
								 * This default column setting can be taken from
								 * preferences/gridsets/under defined( js file)
								 */
								if(entityType == 0)
								{
									objColumnSetting = objPrefData && objPrefData.d.preferences && objPrefData.d.preferences.ColumnSetting
									&& objPrefData.d.preferences.ColumnSetting.gridCols ? objPrefData.d.preferences.ColumnSetting.gridCols
									: (REPORT_GENERIC_COLUMN_MODELADM || '[]'); 
								}
								else
								{
									objColumnSetting = objPrefData && objPrefData.d.preferences && objPrefData.d.preferences.ColumnSetting
									&& objPrefData.d.preferences.ColumnSetting.gridCols ? objPrefData.d.preferences.ColumnSetting.gridCols
									: (REPORT_GENERIC_COLUMN_MODEL || '[]'); 
								}
								
								// For Dynamic profile will change column model as per grid set profile define at filter view js file
										
								if (!Ext.isEmpty(objGeneralSetting)) 
								{
									objGroupByVal = objGeneralSetting.defaultGroupByCode;
									objDefaultFilterVal = objGeneralSetting.defaultFilterCode;
								}
								if (!Ext.isEmpty(objGridSetting)) 
								{
									objGridSizeVal = objGridSetting.defaultGridSize;
									objRowPerPageVal = objGridSetting.defaultRowPerPage;
								}
							}

							objData["groupByData"] = objGroupView? objGroupView.cfgGroupByData : [];
							objData["filterUrl"] = 'services/userfilterslist/'+me.strPageName;
							objData["rowPerPage"] = _AvailableGridSize;
							objData["groupByVal"] = objGroupByVal;
							objData["filterVal"] = objDefaultFilterVal;
							objData["gridSizeVal"] = objGridSizeVal;
							objData["rowPerPageVal"] = objRowPerPageVal;
							subGroupInfo = objGroupView.getSubGroupInfo() || {};
							strTitle = (strInvokedFrom === 'GRID' ? getLabel("columnSettings","Column Settings") 
									+ ' : ' + (subGroupInfo.groupDescription||'')  : getLabel("Settings", "Settings"));
							
							me.pageSettingPopup = Ext.create('Ext.ux.gcp.PageSettingPopUp', {
										cfgPopUpData : objData,
										cfgGroupView : objGroupView,
										cfgDefaultColumnModel : objColumnSetting,
										cfgViewOnly : _IsEmulationMode,
										cfgInvokedFrom : strInvokedFrom,
										title : strTitle,
										itemId : 'pagesettingCustomReport'
									});
							me.pageSettingPopup.show();
							me.pageSettingPopup.center();
			},
			postDoHandleReadPagePrefNew : function(data, args, isSuccess) {
				var me = this;
				if (isSuccess === 'Y') {
					if (!Ext.isEmpty(data)) {				
						objcustReportPref = Ext.encode(data);
					}
				}
			},removeFromQuickArrJson : function(arr, key) {
				for (var ai, i = arr.length; i--;) {
					if ((ai = arr[i]) && ai.paramName == key) {
						arr.splice(i, 1);
					}
				}
				return arr;
			},
			removeFromAdvanceArrJson : function(arr,key){
				for (var ai, i = arr.length; i--;) {
					if ((ai = arr[i]) && ai.field == key) {
						arr.splice(i, 1);
					}
				}
				return arr;
			},
			findInAdvFilterData : function(arr, key) {
				var reqJson = null;
				for (var ai, i = arr.length; i--;) {
					if ((ai = arr[i]) && ai.field == key) {
						reqJson = ai;
					}
				}
				return reqJson;
			},
			findInQuickFilterData : function(arr, key) {
				var reqJson = null;
				for (var ai, i = arr.length; i--;) {
					if ((ai = arr[i]) && ai.paramName == key) {
						reqJson = ai;
					}
				}
				return reqJson;
			},
			refreshData : function() {
				var me = this;
				var objGroupView = me.getGroupView();
				var grid = objGroupView.getGrid();
				grid.removeAppliedSort();
				objGroupView.refreshData();
			},
			handleGridRowClick : function( view, td, cellIndex, record, tr, rowIndex, e, eOpts ) {
				var me = this;
				var clickedColumn = view.getGridColumns()[cellIndex];
				var columnId = clickedColumn.itemId;
				var columnType = clickedColumn.colType;
				if(columnType !== 'actioncontent' && columnType !== 'checkboxColumn' && columnType !=='action' && columnId) {
				var objGroupView = me.getGroupView();
				var grid = objGroupView.getGrid();
					var columnModel = null;
					var columnAction = null;
					if (!Ext.isEmpty(grid.columnModel)) {
						columnModel = grid.columnModel;
						for (var index = 0; index < columnModel.length; index++) {
							if (columnModel[index].colId == 'actioncontent') {
								columnAction = columnModel[index].items;
								break;
							}
						}
					}
					var arrVisibleActions = [];
					var arrAvailableActions = [];
					if (!Ext.isEmpty(columnAction))
						arrAvailableActions = columnAction;
					var store = grid.getStore();
					var jsonData = store.proxy.reader.jsonData;
					if (!Ext.isEmpty(arrAvailableActions)) {
						for (var count = 0; count < arrAvailableActions.length; count++) {
							var btnIsEnabled = false;
							if (!Ext.isEmpty(grid) && !Ext.isEmpty(grid.isRowIconVisible)) {
								btnIsEnabled = grid.isRowIconVisible(store, record,
										jsonData, arrAvailableActions[count].itemId,
										arrAvailableActions[count].maskPosition);
								if (btnIsEnabled == true) {
									arrVisibleActions.push(arrAvailableActions[count]);
									btnIsEnabled = false;
								}
							}
						}
					}
					if (!Ext.isEmpty(arrVisibleActions)) {
						me.doHandleRowIconClick(arrVisibleActions[0].itemId, grid, record, null);
					}
				} else {
				}
			}
		} );
