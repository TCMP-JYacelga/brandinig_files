/**
 * @class GCP.controller.PreGeneratedReportController
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
		'GCP.controller.PreGeneratedReportController',
		{
			extend : 'Ext.app.Controller',
			requires : ['Ext.ux.gcp.PageSettingPopUp'],
			views :
			[
				'GCP.view.PreGeneratedReportView', 'Ext.ux.gcp.PreferencesHandler'
			],
			refs :
			[
				{
					ref : 'preGeneratedReportViewRef',
					selector : 'preGeneratedReportViewType'
				},
				{
					ref : 'preGeneratedReportFilterViewRef',
					selector : 'preGeneratedReportFilterViewType'
				},
				{
					ref : 'clientAutoCompleter',
					selector : 'preGeneratedReportFilterViewType AutoCompleter[itemId="clientCodeId"]'
				},
				{
					ref : 'sellerCombo',
					selector : 'preGeneratedReportViewType preGeneratedReportFilterViewType combobox[itemId="reportCenterSellerId"]'
				},
				{
					ref : 'groupView',
					selector : 'preGeneratedReportViewType groupView'
				},
				{
					ref : 'smartgrid',
					selector : 'preGeneratedReportViewType groupView smartgrid'
				},
				{
					ref : 'btnClearPreferences',
					selector : 'preGeneratedReportViewType preGeneratedReportFilterViewType button[itemId="btnClearPreferences"]'
				},
				{
					ref : 'btnSavePreferences',
					selector : 'preGeneratedReportViewType preGeneratedReportFilterViewType button[itemId="btnSavePreferences"]'
				},
				{
					ref:'filterView',
					selector:'filterView'	
				},
				{
					ref : 'dateLabel',
					selector : 'preGeneratedReportFilterViewType label[itemId="dateLabel"]'
				}, 
				{
					ref : 'entryDate',
					selector : 'preGeneratedReportFilterViewType button[itemId="entryDate"]'
				},
				{
				ref : 'pageSettingPopUp',
				selector : 'pageSettingPopUp'
			}],
			config :
			{
				preferenceHandler : null,
				filterData : [],
				favReport : [],
				widgetType : '01',
				reportModule : '01',
				strDefaultMask : '000',
				strPageName : 'preGeneratedReport',
				filterDataPref : {},
				dateHandler : null,
				dateFilterLabel : getLabel('latest', 'Latest'),
				dateFilterVal : '12',
				dateFilterFromVal : '',
				dateFilterToVal : '',
				datePickerSelectedDate : [],
				firstTimeDateAccess: true,
				strGetModulePrefUrl : 'services/userpreferences/preGeneratedReport/{0}.json',
				cfgGroupByUrl : 'services/grouptype/preGeneratedReport/groupBy.srvc?&$filter=seller eq ' + '\'' + '\'' + strSeller + '\'' + '\' and client eq ' + '\'' + '{0}'
					+ '\'' + ' and seller eq ' + '\'' + strSeller + '\'' + '&$filterscreen=CLIENT'
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
				me.clientFilterVal = strClient;
				me.clientFilterDesc=strClientDesc;
				me.dateHandler = Ext.create('Ext.ux.gcp.DateUtil');
				me.updateConfigs();
				me.firstTimeDateAccess=true;
				me.getFavoriteReports();
				me.doApplySavedPreferences();
				$(document).on('savePreference', function(event) {		
						me.handleSavePreferences();
				});
				$(document).on('clearPreference', function(event) {
						me.handleClearPreferences();
				});
				$(document).on('handleClientChangeInQuickFilter',function(isSessionClientFilter) {
					me.handleClientChangeInQuickFilter(isSessionClientFilter);
				});
				$(document).on('performPageSettings', function(event) 
				{
					me.showPageSettingPopup('PAGE');
				});
				me.control(
				{
					'preGeneratedReportFilterViewType' :
					{
						'afterrender' : function()
						{
							//me.setInfoTooltip();
							if(!Ext.isEmpty(filterJson))
							{
								me.setQuickDateValue();
							}
							me.setDataForQuickFilter(filterJson);
							me.handleDateChange(me.dateFilterVal);
							me.setSelectedFilters();
						},
						'beforerender':function(){
							var useSettingsButton = me.getFilterView()
								.down('button[itemId="useSettingsbutton"]');
								if (!Ext.isEmpty(useSettingsButton))
								{
									useSettingsButton.hide();
								}
						},
						'quickFilterChange' : function( )
						{
						     var filterJson= me.getQuickFilterJSON();
							me.setDataForQuickFilter( filterJson );
							me.toggleSavePrefrenceAction( true );
							if( me.getPreGeneratedReportViewRef() )
								me.getPreGeneratedReportViewRef().setLoading( true );
							me.applyQuickFilter();
						},
						dateChange : function(btn, opts) {
							me.dateFilterVal = btn.btnValue;
							me.dateFilterLabel = btn.text;
							me.handleDateChange(btn.btnValue);
							me.firstTimeDateAccess = false;
							if (btn.btnValue !== '7') {
								me.setDataForQuickFilter();
								me.applyQuickFilter();
							}
						}
					},
					'preGeneratedReportFilterViewType component[itemId="entryDatePickerQuick"]' : {
						render : function() {
						
							$('#entryDatePickerQuickText').datepick({
								monthsToShow : 1,
								changeMonth : true,
								changeYear : true,
								dateFormat : strApplicationDateFormat,
								rangeSeparator : ' to ',
								onClose : function(dates) {
									if (!Ext.isEmpty(dates)) {
										me.firstTimeDateAccess = false;
										me.datePickerSelectedDate = dates;
										me.dateFilterVal = '13';
										me.dateFilterLabel = getLabel('daterange','Date Range');
										me.handleDateChange(me.dateFilterVal);
										me.setDataForQuickFilter();
										me.applyQuickFilter();
										// me.toggleSavePrefrenceAction(true);
									}
								}
							});
						}
					},
					'preGeneratedReportViewType' :
					{
						'deleteFavoriteRep' : me.deleteFavoriteRep,
						'addFavoriteRep' : me.addFavoriteRep
					},
					'preGeneratedReportViewType groupView' :
					{
						'groupTabChange' : function( groupInfo, subGroupInfo, tabPanel, newCard, oldCard )
						{
							//me.setDataForQuickFilter(me.filterJson);
							me.doHandleGroupTabChange( groupInfo, subGroupInfo, tabPanel, newCard, oldCard );
							me.disablePreferencesButton("savePrefMenuBtn",false);
							me.disablePreferencesButton("clearPrefMenuBtn",false);			
						},
						'gridRowActionClick' : function(grid, rowIndex, columnIndex,
								actionName, record) {
							me.doHandleRowIconClick(actionName, grid, record, rowIndex);
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
									me.toggleSavePrefrenceAction( false );
									me.toggleClearPrefrenceAction( true );
								}
							}
						}
					},
					'preGeneratedReportViewType groupView smartgrid' :
					{
						'cellclick' : me.doHandleCellClick
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
					'preGeneratedReportViewType preGeneratedReportTitleViewType button[itemId="btnCreateReport"]' :
					{
						click : function( btn, opts )
						{
							me.submitRequest( 'addReport' );
						}
					},
					'pageSettingPopUp' : {
						'applyPageSetting' : function(popup, data,strInvokedFrom) {
							me.applyPageSetting(data,strInvokedFrom);
						},
						'savePageSetting' : function(popup, data,strInvokedFrom) {
							me.savePageSetting(data,strInvokedFrom);
						},
						'restorePageSetting' : function(popup,data,strInvokedFrom) {
							me.restorePageSetting(data,strInvokedFrom);
						}
					}, 
					// This will set Report / Download to All By Default
					'preGeneratedReportFilterViewType combo[itemId="repOrDwnldToolBar"]' : {
						'boxready' : function(combo, width, height, eOpts) {
							var filter = me.getPreGeneratedReportFilterViewRef();
							if (!Ext.isEmpty(filter.repOrDwnld)) {
								combo.setValue(filter.repOrDwnld);
							} else {
								combo.setValue(combo.getStore().getAt(0));
							}
						}
					}
				} );
			},
			handleClientChangeInQuickFilter : function(isSessionClientFilter) {
				var me = this;
				me.clientFilterVal = selectedFilterClient;
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
				me.toggleSavePrefrenceAction( false );
				var arrPref = me.getPreferencesToSave( false );
				me.preferenceHandler.clearPagePreferences( me.strPageName, null, me.postHandleClearPreferences, null,
					me, true );
				me.disablePreferencesButton("savePrefMenuBtn",false);
				me.disablePreferencesButton("clearPrefMenuBtn",true);
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
				me.disablePreferencesButton("savePrefMenuBtn",true);
				me.disablePreferencesButton("clearPrefMenuBtn",false);	
			},
			disablePreferencesButton: function(btnId,boolVal){
				$("#"+btnId).attr("disabled",boolVal);
				if(boolVal)
					{
						$("#"+btnId).css("color",'grey');			
						$("#"+btnId).css('cursor','default').removeAttr('href');
						$("#"+btnId).css('pointer-events','none');
					}
				else
					{
						$("#"+btnId).css("color",'#FFF');
						$("#"+btnId).css('cursor','pointer').attr('href','#');
						$("#"+btnId).css('pointer-events','all');				
					}
			},
			getPreferencesToSave : function( localSave )
			{
				var me = this;
				var groupView = me.getGroupView();
				var grid = null;
				var arrCols = null, objCol = null, arrColPref = null, arrPref = [], objFilterPref = null;
				var groupInfo = null, subGroupInfo = null, strModule = null, filter = me
					.getPreGeneratedReportFilterViewRef();
				var state = null;
				if( groupView )
				{
					state = groupView.getGroupViewState();
					groupInfo = groupView.getGroupInfo() || '{}';
					subGroupInfo = groupView.getSubGroupInfo() || {};
					var data = me.getQuickFilterJSON();
					var financialInstitutionVal = ( data[ 'sellerCode' ] || "" );
					var clientVal=me.clientFilterVal;
					var clientDesc=me.clientFilterDesc;
					//var clientVal = ( data[ 'clientCode' ] || "" );
					//var clientDesc = ( data[ 'clientDesc' ] || "" );
					var repOrDwnld = ( data[ 'repOrDwnld' ] || "" );
					//var statusCode = ( data[ 'statusCode' ] || "" );
					var reportType = ( data[ 'reportType' ] || "" ); // FAVORITE Filter not stored in data['reportType']
					var repOrDwnldDesc = ( data[ 'repOrDwnldDesc' ] || "" );
					var statusFilterDesc = ( data[ 'statusCodeDesc' ] || "" );
					var reportTypeDesc = ( data[ 'reportTypeDesc' ] || "" );
					strModule = state.groupCode
					
					var quickPref = {};
					quickPref.entryDate = me.dateFilterVal;
					if (me.dateFilterVal === '13') {
						if (!Ext.isEmpty(me.dateFilterFromVal)
								&& !Ext.isEmpty(me.dateFilterToVal)) {
							quickPref.entryDateFrom = me.dateFilterFromVal;
							quickPref.entryDateTo = me.dateFilterToVal;
						} else {
							var strSqlDateFormat = 'Y-m-d';
							var frmDate = me.getFromEntryDate().getValue();
							var toDate = me.getToEntryDate().getValue();
							fieldValue1 = Ext.util.Format.date(frmDate, 'Y-m-d');
							fieldValue2 = Ext.util.Format.date(toDate, 'Y-m-d');
							quickPref.entryDateFrom = fieldValue1;
							quickPref.entryDateTo = fieldValue2;
						}
					}	
					
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
							//'statusCode' : statusCode,
							'reportType' : reportType,
							'repOrDwnldDesc' : repOrDwnldDesc,
							'statusFilterDesc' : statusFilterDesc,
							'reportTypeDesc' : reportTypeDesc,
							'quickEntryDate' : quickPref,
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
				me.toggleSavePrefrenceAction( false );
				if( isSuccess === 'N' )
				{
				}
				else
				{
					me.toggleClearPrefrenceAction( false );
					me.toggleSavePrefrenceAction( true );
				}
			},
			postHandleSavePreferences : function( data, args, isSuccess )
			{
				var me = this;
				if( isSuccess === 'N' )
				{
					if( !Ext.isEmpty( me.getBtnSavePreferences() ) )
						me.toggleSavePrefrenceAction( true );
				}
				else
				{
					me.toggleClearPrefrenceAction( true );
				}
			},
			toggleSavePrefrenceAction : function( isVisible )
			{
				var me = this;
				var btnPref = me.getBtnSavePreferences();
				if( !Ext.isEmpty( btnPref ) )
					btnPref.setDisabled( !isVisible );
			},
			toggleClearPrefrenceAction : function( isVisible )
			{
				var me = this;
				var btnPref = me.getBtnClearPreferences();
				if( !Ext.isEmpty( btnPref ) )
					btnPref.setDisabled( !isVisible );
			},
			//End of prefrence handling

			doSavePreferenceToLocale : function()
			{
				var me = this, filter = me.getPreGeneratedReportFilterViewRef();
				data = null;
				data = me.getQuickFilterJSON();
				me.preferenceHandler.setLocalPreferences( me.strPageName, data );
			},
			doApplySavedPreferences : function()
			{
				var me = this, filter = me.getPreGeneratedReportFilterViewRef();
				var objPref = null;
				objPref = me.preferenceHandler.getLocalPreferences( me.strPageName );
				if( objPref )
				{
					strSeller = objPref[ 'sellerCode' ] || strSeller;
					//strClient = objPref[ 'clientCode' ] || strClient;
					//strClientDesc = objPref[ 'clientDesc' ] || strClientDesc;
					me.filterDataPref = objPref;
					me.setDataForQuickFilter( objPref );
					me.preferenceHandler.setLocalPreferences( me.strPageName, null );
				}
			},
			setSelectedFilters : function()
			{
				var me = this, filter = me.getPreGeneratedReportFilterViewRef();
				var objPref = null;
				objPref = me.filterDataPref;
					if(objPref.reportType){
						 var reportTypeCombo=filter.down('combobox[itemId="reportTypeToolBar"]');	
							reportTypeCombo.setValue(objPref.reportType);
							filter.reportType = objPref.reportType;
							filter.reportTypeDesc = objPref.reportTypeDesc;
						}
						if(objPref.statusCode){
							var reportStatusCombo=filter.down('combobox[itemId="reportStatusToolBar"]');
							reportStatusCombo.setValue(objPref.statusCode);
							filter.statusCode = objPref.statusCode;
							filter.statusCodeDesc = objPref.statusFilterDesc;
						}
						if(objPref.repOrDwnld){
							var reportDownloadId=filter.down('combobox[itemId="repOrDwnldToolBar"]');
							reportDownloadId.setValue(objPref.repOrDwnld);
							filter.repOrDwnld =objPref.repOrDwnld;
							filter.repOrDwnldDesc = objPref.repOrDwnldDesc;
						}
				//me.setDataForQuickFilter( objPref );
			},
			setButtonCls : function( btn, itemId )
			{
				var me = this, filter = me.getPreGeneratedReportFilterViewRef();
				filter.down( 'toolbar[itemId=' + itemId + ']' ).items.each( function( item )
				{
					item.removeCls( 'xn-custom-heighlight' );
				} );
				btn.addCls( 'xn-custom-heighlight' );
			},

			doHandleGridRowSelectionChange : function( groupInfo, subGroupInfo, objGrid, objRecord, intRecordIndex,
				arrSelectedRecords, jsonData )
			{
				var me = this;
				var buttonMask = me.strDefaultMask;
				var objGroupView = me.getGroupView();
				var maskArray = new Array(), actionMask = '', objData = null,actionMaskStr = null ;
				var bankReportCode = '' ;
				if( !Ext.isEmpty( jsonData ) && !Ext.isEmpty( jsonData.d.__buttonMask ) )
					buttonMask = jsonData.d.__buttonMask;
				maskArray.push( buttonMask );
				for( var index = 0 ; index < arrSelectedRecords.length ; index++ )
				{
					objData = arrSelectedRecords[ index ];
					actionMaskStr = objData.get( '__metadata' ).__rightsMap ;
					if(index == 0)
					{
						bankReportCode = objData.get( 'srcName' ) ;
					}
					if(objData.get( 'moduleCode' ) == '15' && objData.get( 'srcName' ) != bankReportCode)
					{
						 actionMaskStr = me.setCharAt( actionMaskStr, 1, "0" );
					}
					maskArray.push( actionMaskStr );
				}
				actionMask = doAndOperation( maskArray, 3 );
				objGroupView.handleGroupActionsVisibility( actionMask );
			},
			setCharAt : function(str, index, chr ) 
			{
				if(index > str.length-1) return str;
				return str.substr(0,index) + chr + str.substr(index+1);
			},
			doHandleGroupActions : function( strAction, grid, arrSelectedRecords, strActionType )
			{
				var me = this;
				var strUrl;
				if( strAction == 'reportCenterSubmit' )
				{
					strUrl = 'loadPreGeneratedReportWidgetsData/submit.srvc?';
				}
				else if( strAction == 'reportCenterDiscard' )
				{
					strUrl = 'loadPreGeneratedReportWidgetsData/discard.srvc?';
				}
				else if( strAction == 'reportCenterEnable' )
				{
					strUrl = 'loadPreGeneratedReportWidgetsData/enable.srvc?';
				}
				else if( strAction == 'reportCenterDisable' )
				{
					strUrl = 'loadPreGeneratedReportWidgetsData/disable.srvc?';
				}
				else if(strAction == 'actionExport')
				{
				}
				if( strAction == 'reportCenterDisable' )
				{
					Ext.MessageBox.confirm( 'Disable', 'Are you sure disable your Schedules  too?', function( btn )
					{
						if( btn === 'yes' )
						{
							me.preHandleGroupActions( strUrl, '', grid, arrSelectedRecords, strActionType, strAction )
						}
					} );
				}
				else if(strAction == 'actionView')
				{
					strUrl = "viewPreGeneratedReport.srvc";
					me.submitExportRequest(arrSelectedRecords,strUrl,strAction);
				}
				else if(strAction != 'actionExport')
				{
					me.preHandleGroupActions( strUrl, '', grid, arrSelectedRecords, strActionType, strAction );
				}
				if(strAction == 'actionExport')
				{
					strUrl = "exportPreGeneratedReport.srvc";
					me.submitExportRequest(arrSelectedRecords,strUrl,strAction);
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
								sellerId : records[ index ].data.sellerId
							} );
						}
						if( arrayJson )
							arrayJson = arrayJson.sort( function( valA, valB )
							{
								return valA.serialNo - valB.serialNo
							} );
						groupView.setLoading( true );
						Ext.Ajax.request(
						{
							url : strUrl,
							method : 'POST',
							jsonData : Ext.encode( arrayJson ),
							success : function( jsonData )
							{
								//var jsonRes = Ext.JSON
								//		.decode(jsonData.responseText);
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

				wdgt.setLoading( true );

				Ext.Ajax.request(
				{
					url : 'userpreferences/preGeneratedReport/preferredReports.srvc',
					method : 'POST',
					jsonData : newReportset,
					success : function( response )
					{
						wdgt.setLoading( false );
					},
					failure : function()
					{
					}
				} );

				var favLength = me.favReport.length;
				
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

				wdgt.setLoading( true );
				Ext.Ajax.request(
				{
					url : 'userpreferences/preGeneratedReport/preferredReports.srvc',
					method : 'POST',
					jsonData : newReportset,
					success : function( response )
					{
						wdgt.setLoading( false );
					},
					failure : function()
					{
					}

				} );
				var favLength = me.favReport.length;
			},

			getFavoriteReports : function()
			{
				var me = this;
				Ext.Ajax.request(
				{
					url : 'userpreferences/preGeneratedReport/preferredReports.srvc',
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
			doHandleRowIconClick : function(actionName, objGrid, record, rowIndex) {
				var me = this;
				if (actionName === 'btnGenrate')
					{
					me.submitRequest( 'Download', record )
				}
				else if(actionName === 'btnExport')
				{
					me.submitRequest( 'Export', record )
				}
				else if(actionName === 'btnView')
				{
					me.submitRequest( 'ROWVIEW', record )
				}
			},
			doHandleCellClick : function( view, td, cellIndex, record, tr, rowIndex, e, eOpts )
			{
				var me = this;
				var clickedColumn = view.getGridColumns()[cellIndex];
				var columnType = clickedColumn.colType;
				var columnId = clickedColumn.itemId;
				var downloadClicked = null;
				if(columnType !== 'actioncontent' && columnType !== 'checkboxColumn' && columnId) 
				{
					downloadClicked = true;
				}
				else
				{
					downloadClicked = ( e.target.tagName == 'A' && cellIndex == 0 );
				}
				
				if( downloadClicked )
				{
					me.submitRequest( 'Download', record );
				}
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
				var objDateLbl = {
					'' : getLabel('latest', 'Latest'),
					'1' : getLabel('today', 'Today'),
					'2' : getLabel('yesterday', 'Yesterday'),
					'3' : getLabel('thisweek', 'This Week'),
					'4' : getLabel('lastweektodate', 'Last Week To Date'),
					'5' : getLabel('thismonth', 'This Month'),
					'6' : getLabel('lastMonthToDate', 'Last Month To Date'),
					'14' : getLabel('lastmonthonly', 'Last Month Only'),
					'8' : getLabel('thisquarter', 'This Quarter'),
					'9' : getLabel('lastQuarterToDate', 'Last Quarter To Date'),
					'10' : getLabel('thisyear', 'This Year'),
					'11' : getLabel('lastyeartodate', 'Last Year To Date'),
					'12' : getLabel('latest', 'Latest'),
					'13' : getLabel('daterange', 'Date Range')

				};
				me.preferenceHandler = Ext.create( 'Ext.ux.gcp.PreferencesHandler' );
				if( !Ext.isEmpty( objGridViewFilterPref ) )
				{
					var data = Ext.decode( objGridViewFilterPref );
					var clientVal = data.clientVal;
					var clientDesc = data.clientDesc;
					var reportOrDownload = data.repOrDwnld;
					var status = data.statusCode;
					var seller = data.financialInstitutionVal;
					var reportType = data.reportType;
					
					var quickPref = data.quickEntryDate;
					if (!Ext.isEmpty(quickPref)) {						
						var strDtValue = quickPref.entryDate;
						var strDtFrmValue = quickPref.entryDateFrom;
						var strDtToValue = quickPref.entryDateTo;
	
						if (!Ext.isEmpty(strDtValue)) {
							me.dateFilterLabel = objDateLbl[strDtValue];
							me.dateFilterVal = strDtValue;
						
							if (strDtValue === '13') {
								if (!Ext.isEmpty(strDtFrmValue)){
									me.dateFilterFromVal = strDtFrmValue;
									me.datePickerSelectedDate[0]=Ext.Date.parse(strDtFrmValue, 'Y-m-d');
								}
								if (!Ext.isEmpty(strDtToValue)){
									me.dateFilterToVal = strDtToValue;
									me.datePickerSelectedDate[1]=Ext.Date.parse(strDtToValue, 'Y-m-d')
								}
							}
							else
							{
								var dtParams = me.getDateParam(strDtValue);
								if (!Ext.isEmpty(dtParams)
										&& !Ext.isEmpty(dtParams.fieldValue1)) {
									me.dateFilterFromVal = dtParams.fieldValue1;
									me.dateFilterToVal = dtParams.fieldValue2;
								}
							}
						}
					}
					
					
					var objPref = {};
					objPref[ 'sellerCode' ] = seller;
					objPref[ 'clientCode' ] = clientVal;
					objPref[ 'clientDesc' ] = clientDesc;
					objPref[ 'repOrDwnld' ] = reportOrDownload;
					objPref[ 'reportType' ] = reportType;
					objPref[ 'statusCode' ] = status;
					me.clientFilterVal = data.filterSelectedClientCode;
					me.clientFilterDesc = data.filterSelectedClientDesc;
					me.setDataForQuickFilter( objPref );
					if (entity_type == '1') {
						$("#summaryClientFilterSpan").text(me.clientFilterDesc);
						changeClientAndRefreshGrid(me.clientFilterVal,me.clientFilterDesc)
					}else if(entity_type=='0'){
						$("#summaryClientFilter").val(me.clientFilterDesc);
						changeClientAndRefreshGrid(me.clientFilterVal,me.clientFilterDesc)
					}
					me.filterDataPref = objPref;
					/* Set Filter Elements Value Of Filter Panle */

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
							if (!Ext.isEmpty(me.filterData) && me.filterData.length >= 1) {
								var quickJsonData = me.filterData;
								var reqJsonInQuick = me.findInQuickFilterData(quickJsonData,'seller');
								if (!Ext.isEmpty(reqJsonInQuick)) 
								{
									arrQuickJson = quickJsonData;
									arrQuickJson = me.removeFromQuickArrJson(arrQuickJson,'seller');
									quickJsonData = arrQuickJson;
								}
								arrOfParseQuickFilter = generateFilterArray(quickJsonData,strApplicationDateFormat);
							}
						}

						if (!Ext.isEmpty(me.advFilterData)) {
							if (!Ext.isEmpty(me.advFilterData) && me.advFilterData.length >= 1) {				
								arrOfParseAdvFilter = generateFilterArray(me.advFilterData);
							}
						}

						if (arrOfParseQuickFilter && arrOfParseAdvFilter) {
							arrOfFilteredApplied = arrOfParseQuickFilter
									.concat(arrOfParseAdvFilter);
								
							if (arrOfFilteredApplied)
								me.getFilterView().updateFilterInfo(arrOfFilteredApplied);
						}
				grid.loadGridData( strUrl, null, null, false );
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
			removeFromQuickArrJson : function(arr, key) {
				for (var ai, i = arr.length; i--;) {
					if ((ai = arr[i]) && ai.paramName == key) {
						arr.splice(i, 1);
					}
				}
				return arr;
			},

			generateFilterUrl : function( groupInfo, subGroupInfo )
			{
				var me = this;
				if(!Ext.isEmpty(widgetFilterUrl))
					{
						var strUrl='';
						if(widgetFilterUrl.indexOf('generationDate')!=-1)
						widgetFilterUrl=widgetFilterUrl.replace('generationDate', 'EntryDate');
						var filterView = me.getPreGeneratedReportFilterViewRef();
						var strQuickFilterUrl = me.generateUrlWithQuickFilterParams( me.filterData ,widgetFilterUrl);
						if( !Ext.isEmpty( strQuickFilterUrl ) )
							strUrl += strQuickFilterUrl+" and "+widgetFilterUrl;
							else
							strUrl += "&$filter="+widgetFilterUrl;
						if( !Ext.isEmpty( filterView))
						{
						if( !Ext.isEmpty( me.clientFilterVal ) && me.clientFilterVal != 'all' )
							strUrl += '&$isClientFilterSelected=Y';
						}
						widgetFilterUrl = '';
						return strUrl;
					}	
					
				var filterView = me.getPreGeneratedReportFilterViewRef();
				var strQuickFilterUrl = '', strWidgetFilterUrl = '', strUrl = '', isFilterApplied = false, isFavouriteFilter = false;
				strQuickFilterUrl = me.generateUrlWithQuickFilterParams( me.filterData,widgetFilterUrl );
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
				if( !Ext.isEmpty( filterView) && filterView.reportType == 'FAVORITE' )
				{
					strUrl += '&$isFavouriteFilter=Y';
				}
				if( !Ext.isEmpty( filterView) && !Ext.isEmpty( me.clientFilterVal ) && me.clientFilterVal != 'all' )
				{
					strUrl += '&$isClientFilterSelected=Y';
				}
				if( strDownloadFilter == 'D' )
				{
					strUrl += '&$isDownloadFilter=D';
				}
				return strUrl;
			},
			generateUrlWithQuickFilterParams : function( urlFilterData,widgetFilterUrl )
			{
				var me = this;
				var filterData = urlFilterData;
				var isFilterApplied = false;
				var strFilter = '&$filter=';
				var strTemp='';
				var strFilterParam = '';
				for( var index = 0 ; index < filterData.length ; index++ )
				{
					if(widgetFilterUrl.indexOf(filterData[ index ].paramName)!=-1)
					continue;
					if( isFilterApplied )
						strTemp = strTemp + ' and ';
					switch( filterData[ index ].operatorValue )
					{
						case 'bt' :
								if (filterData[index].dataType === 'D') {

									strTemp = strTemp + filterData[index].paramName + ' '
											+ filterData[index].operatorValue + ' '
											+ 'date\'' + filterData[index].paramValue1
											+ '\'' + ' and ' + 'date\''
											+ filterData[index].paramValue2 + '\'';
								} 
								else 
								{
									strTemp = strTemp + filterData[index].paramName + ' '
											+ filterData[index].operatorValue + ' ' + '\''
											+ filterData[index].paramValue1 + '\''
											+ ' and ' + '\''
											+ filterData[index].paramValue2 + '\'';
								}
								break;
						case 'lk':
								isFilterApplied = true;
								if (filterData[index].dataType === 'D') {
										strTemp = strTemp + filterData[index].paramName + ' '
										+ filterData[index].operatorValue + ' '
										+ 'date\'' + filterData[index].paramValue1
										+ '\'';
										}
								else
								{
										strTemp = strTemp + filterData[ index ].paramName + ' ' + filterData[ index ].operatorValue
										+ ' ' + '\'' + filterData[ index ].paramValue1 + '\'';
								}
							break;
						case 'in' :
							var reg = new RegExp(/[\(\)]/g);
							var objValue = filterData[index].paramValue1;
							// objValue = objValue.replace(reg, '');
							var objArray = objValue.split(',');
							if (objArray.length > 0) {
								if (objArray[0] != 'All') {
									if (isFilterApplied) {
										if (filterData[index].detailFilter
												&& filterData[index].detailFilter === 'Y') {
											strDetailUrl = strDetailUrl + ' and ';
										} else {
											// strTemp = strTemp + ' and ';
											strTemp = strTemp;
										}
									} else {
										isFilterApplied = true;
									}

									if (filterData[index].detailFilter
											&& filterData[index].detailFilter === 'Y') {
										strDetailUrl = strDetailUrl + '(';
									} else {
										strTemp = strTemp + '(';
									}
									for (var i = 0; i < objArray.length; i++) {
										if (filterData[index].detailFilter
												&& filterData[index].detailFilter === 'Y') {
											strDetailUrl = strDetailUrl
													+ filterData[index].paramName
													+ ' eq ';
											strDetailUrl = strDetailUrl + '\''
													+ objArray[i] + '\'';
											if (i != objArray.length - 1)
												strDetailUrl = strDetailUrl + ' or ';
										} else {
											strTemp = strTemp
													+ filterData[index].paramName
													+ ' eq ';
											strTemp = strTemp + '\'' + objArray[i]
													+ '\'';
											if (i != objArray.length - 1)
												strTemp = strTemp + ' or ';

										}
									}
									if (filterData[index].detailFilter
											&& filterData[index].detailFilter === 'Y') {
										strDetailUrl = strDetailUrl + ')';
									} else {
										strTemp = strTemp + ')';
									}
								}
							}
							break;
						default :
								// Default opertator is eq
								if (filterData[index].dataType === 'D') {

									strTemp = strTemp + filterData[index].paramName + ' '
											+ filterData[index].operatorValue + ' '
											+ 'date\'' + filterData[index].paramValue1
											+ '\'';
								} else {

									strTemp = strTemp + filterData[index].paramName + ' '
											+ filterData[index].operatorValue + ' ' + '\''
											+ filterData[index].paramValue1 + '\'';
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
							'module' : strModule
						};
						strModule = subGroupInfo.groupCode;						
						me.preferenceHandler.readModulePreferences(me.strPageName,
						strModule, me.postDoHandleGroupTabChange, args, me, true);
					}
				}
			},
			postDoHandleGroupTabChange : function( data, args, isSuccess )
			{
				//var me = args.scope;
				//var objGroupView = me.getGroupView();
				var me = this;
				var objGroupView = me.getGroupView();
				var objSummaryView = me.getPreGeneratedReportViewRef(), objPref = null, gridModel = null, intPgSize = null,showPager = true, heightOption = null;
				var colModel = null, arrCols = null;
				if( data && data.preference )
				{					
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
				var me = this, filter = me.getPreGeneratedReportFilterViewRef(), arrFilter = [];
				var data = null;
				if( !me.isEmptyObject( filterJson ) && !Ext.isEmpty( widgetFilterUrl))
				{
					data = me.getWidgetFilterJSON(filterJson);
				}
				else
				{
					data = me.getQuickFilterJSON();
				}
				
				if (filterJson && !Ext.isEmpty( filterJson.clientCode) && filterJson.clientCode !='all') {
						arrFilter.push({
									paramName : 'client',
									paramValue1 :  encodeURIComponent(filterJson.clientCode.replace(new RegExp("'", 'g'), "\''")),
									operatorValue : 'eq',
									dataType : 'S',
									displayType : 5,
									paramFieldLable : getLabel('lblcompany', 'Company Name'),
									displayValue1 : filterJson.clientDesc
								});
				}
				if( data )
				{
					if( data[ 'sellerCode' ] )
						arrFilter.push(
						{
							paramName : 'seller',
							paramValue1 : ( data[ 'sellerCode' ] || '' ).toUpperCase(),
							operatorValue : 'eq',
							dataType : 'S',
							paramFieldLable : getLabel('seller','Seller')
						} );
					if( data[ 'repOrDwnld' ] )
					{
						var repOrDownload = ( data[ 'repOrDwnld' ] || '' );
						/*if(repOrDownload && repOrDownload === 'D')
							repOrDownload = 'Downloads';
						else
							repOrDownload = 'Reports';*/				

						arrFilter.push(
						{
							paramName : 'repOrDwnld',
							paramValue1 : encodeURIComponent(repOrDownload.replace(new RegExp("'", 'g'), "\''")),
							operatorValue : 'eq',
							dataType : 'S',
							displayType : 5,
							paramFieldLable : getLabel('reportsOrdownloads', 'Reports / Downloads'),
							displayValue1 : repOrDownload === 'D' ? 'Downloads' :'Reports'
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

					if( data[ 'statusCode' ] )
						arrFilter.push(
						{
							paramName : 'reportStatus',
							paramValue1 : ( data[ 'statusCode' ] || '' ),
							operatorValue : 'eq',
							dataType : 'S'
						} );
					if( data[ 'reportName' ] )
						arrFilter.push(
						{
							paramName : 'srcDescription',
							paramValue1 : ( data[ 'reportName' ] || '' ),
							operatorValue : 'eq',
							dataType : 'S',
							paramFieldLable : getLabel('reportName', 'Report Name')
						} );
					if( filterJson ){
						if(Ext.isEmpty( filterJson.clientCode) ){
							if(data['clientCode'] && data['clientDesc']){
								arrFilter.push({
									paramName : 'client',
									paramValue1 :  data['clientCode'],
									operatorValue : 'eq',
									dataType : 'S',
									displayType : 5,
									paramFieldLable : getLabel('lblcompany', 'Company Name'),
									displayValue1 : data['clientDesc']
								});
							}
						}
					} else if(data['clientCode'] && data['clientDesc']){
						arrFilter.push({
									paramName : 'client',
									paramValue1 :  data['clientCode'],
									operatorValue : 'eq',
									dataType : 'S',
									displayType : 5,
									paramFieldLable : getLabel('lblcompany', 'Company Name'),
									displayValue1 : data['clientDesc']
								});
					}
					 if(data['reportModule'] && data['reportModuleDesc']){
							arrFilter.push({
										paramName : 'reportModule',
										paramValue1 :  data['reportModule'],
										operatorValue : 'in',
										dataType : 'S',
										displayType : 5,
										paramFieldLable : getLabel('Module', 'Module'),
										displayValue1 : data['reportModuleDesc']
									});
						}
				}
				if (!Ext.isEmpty(me.dateFilterVal)) {
					var strVal1 = '', strVal2 = '', strOpt = 'eq';
					/*
					 * if (me.dateFilterVal === '12') { // do nothing. } else
					 */
					 var objDateParams = me.getDateParam(me.dateFilterVal);
						strOpt = objDateParams.operator;
						strVal1 = objDateParams.fieldValue1;
						strVal2 = objDateParams.fieldValue2;

					 if (me.dateFilterVal !== '13') {
						if (!Ext.isEmpty(objDateParams)&& !Ext.isEmpty(strVal1)) 
						{
							arrFilter.push({
								paramName : 'EntryDate',
								paramValue1 : strVal1,
								paramValue2 : strVal2,
								operatorValue : strOpt,
								dataType : 'D',
								paramFieldLable : getLabel('Generationdate', 'Generation Date')
							});
						}
					} else {
						arrFilter.push({
							paramName : 'EntryDate',
							paramValue1 : strVal1,
							paramValue2 : strVal2,
							operatorValue : strOpt,
							dataType : 'D',
							paramFieldLable : getLabel('date', 'Generation Date')
						});
					}
				}
				me.filterData = arrFilter;
			},
			setQuickDateValue : function()
			{
				var me = this;
				var objDateLbl = {
						'' : getLabel('latest', 'Latest'),
						'1' : getLabel('today', 'Today'),
						'2' : getLabel('yesterday', 'Yesterday'),
						'3' : getLabel('thisweek', 'This Week'),
						'4' : getLabel('lastweektodate', 'Last Week To Date'),
						'5' : getLabel('thismonth', 'This Month'),
						'6' : getLabel('lastMonthToDate', 'Last Month To Date'),
						'14' : getLabel('lastmonthonly', 'Last Month Only'),
						'8' : getLabel('thisquarter', 'This Quarter'),
						'9' : getLabel('lastQuarterToDate', 'Last Quarter To Date'),
						'10' : getLabel('thisyear', 'This Year'),
						'11' : getLabel('lastyeartodate', 'Last Year To Date'),
						'12' : getLabel('latest', 'Latest'),
						'13' : getLabel('daterange', 'Date Range')

					};
				var arrFilterJson = JSON.parse(filterJson);
				for (var i = 0; i < arrFilterJson.length; i++) {
					if (arrFilterJson[i].field === 'generationDate') {
						me.dateFilterLabel = objDateLbl[arrFilterJson[i].displayType];
						me.dateFilterVal = ""+arrFilterJson[i].displayType;
						if (me.dateFilterVal == '7'
								&& !Ext.isEmpty(arrFilterJson[i].value1))
							me.datePickerSelectedDate = [
									arrFilterJson[i].value1, arrFilterJson[i].value2];
					}
				}
			},
			getWidgetFilterJSON : function( filterJson )
			{
					var me = this, filter = me.getPreGeneratedReportFilterViewRef();
					var filterJson1 = {};
					var field = null, strValue = null;

					strValue = strSeller;
					filterJson1[ 'sellerCode' ] = strValue;
					 var arrFilterJson = JSON.parse(filterJson);
						for (var i = 0; i < arrFilterJson.length; i++) {
							if (arrFilterJson[i].field === 'client') {
								filterJson1[ 'clientCode' ] = arrFilterJson[i].value1;
								filterJson1[ 'clientDesc' ] = arrFilterJson[i].value2;
								var filterView=me.getPreGeneratedReportFilterViewRef();
								var clientComboBox = filterView.down('combo[itemId="clientCombo"]');
								clientComboBox.setValue(filterJson1[ 'clientCode' ]);
							}
							if(arrFilterJson[i].field === 'reportModule')
							{
								filterJson1[ 'reportModule' ] = arrFilterJson[i].value1;
								filterJson1[ 'reportModuleDesc' ] = arrFilterJson[i].value2;
							}
					}
						
			 return filterJson1;
			},
			getQuickFilterJSON : function()
				{
						var me = this, filter = me.getPreGeneratedReportFilterViewRef();
						var filterJson = {};
						var field = null, strValue = null;

						strValue = strSeller;
						filterJson[ 'sellerCode' ] = strValue;
						if(!Ext.isEmpty(filter)){
						if( !isClientUser )
						{
							field = filter.down( 'combobox[itemId="clientCodeId"]' );
							strValue = field ? field.getValue() : '';
							filterJson[ 'clientCode' ] = strValue;
							strValue = field ? field.getRawValue() : '';
							filterJson[ 'clientDesc' ] = strValue;
						}
						else
						{
							if( !Ext.isEmpty( filter.clientCode ) && filter.clientCode != 'all' )
								filterJson[ 'clientCode' ] = filter.clientCode;
							filterJson[ 'clientDesc' ] = filter.clientDesc;
						}
						if(Ext.isEmpty( filter.clientCode ) && Ext.isEmpty( filterJson[ 'clientDesc' ]))
						{
							if(!Ext.isEmpty( me.clientFilterVal))
								filterJson[ 'clientCode' ] = me.clientFilterVal;
							if(!Ext.isEmpty( me.clientFilterDesc))
								filterJson[ 'clientDesc' ] = me.clientFilterDesc;						
						}
						filterJson[ 'statusCode' ] = ( filter.statusCode != 'All' ) ? filter.statusCode : null;
						filterJson[ 'statusCodeDesc' ] = filter.statusCodeDesc;
						filterJson[ 'repOrDwnld' ] = ( filter.repOrDwnld != 'All' ) ? filter.repOrDwnld : null;
						filterJson[ 'repOrDwnldDesc' ] = filter.repOrDwnldDesc;
						filterJson[ 'reportType' ] = ( filter.reportType != 'All' && filter.reportType != 'FAVORITE' ) ? filter.reportType : null;
						filterJson[ 'reportTypeDesc' ] = filter.reportTypeDesc;
						filterJson[ 'reportName' ] = ( filter.reportNameFilter != 'All' ) ? filter.reportNameFilter : null;
					    }else{
						   filterJson[ 'clientCode' ] = strClient;
						   filterJson[ 'clientDesc' ] = strClientDesc;
						}
						if (!Ext.isEmpty(me.filterData))
						{
							var filterData = me.filterData;
							for( var index = 0 ; index < filterData.length ; index++ )
							{
								if(filterData[ index ].paramName === 'reportModule')
								{
									filterJson[ 'reportModule' ] = filterData[ index ].paramValue1;
									filterJson[ 'reportModuleDesc' ] = filterData[ index ].displayValue1;
								}
							}
						}
						return filterJson;
				},
			handleDateChange : function(index) {
				var me = this;
				var filterView = me.getPreGeneratedReportFilterViewRef();
				var objDateParams = me.getDateParam(index, null);
				var datePickerRef = $('#entryDatePickerQuickText');

				if (!Ext.isEmpty(me.dateFilterLabel)) {
					me.getDateLabel().setText(getLabel('date', 'Generation Date') + " ("
							+ me.dateFilterLabel + ")");
				}
				var vFromDate = $.datepick.formatDate(strApplicationDateFormat,
				$.datepick.parseDate('yyyy-mm-dd', objDateParams.fieldValue1));
				var vToDate = $.datepick.formatDate(strApplicationDateFormat,
				$.datepick.parseDate('yyyy-mm-dd', objDateParams.fieldValue2));

				me.dateFilterFromVal = objDateParams.fieldValue1;
				me.dateFilterToVal = objDateParams.fieldValue2;
				if (index == '13') {
					if (objDateParams.operator == 'eq') {
						datePickerRef.val('');
						datePickerRef.datepick('setDate', vFromDate);
					} else {
						datePickerRef.val('');
						datePickerRef.datepick('setDate', [vFromDate, vToDate]);
					}
				} else {
					if (index === '1' || index === '2') {
							datePickerRef.val('');
							datePickerRef.datepick('setDate', vFromDate);
					} else {
						datePickerRef.val('');
						datePickerRef.datepick('setDate', [vFromDate, vToDate]);
					}
				}
			},
			getDateParam : function(index, dateType) {
				var me = this;
				var objDateHandler = me.getDateHandler();
				var strAppDate = dtApplicationDate;
				var dtFormat = strExtApplicationDateFormat;
				var date = new Date(Ext.Date.parse(strAppDate, dtFormat));
				var strSqlDateFormat = 'Y-m-d';
				var fieldValue1 = '', fieldValue2 = '', operator = '';
				var retObj = {};
				var dtJson = {};
				switch (index) {
					case '1' :
						// Today
						fieldValue1 = Ext.Date.format(date, strSqlDateFormat);
						fieldValue2 = fieldValue1;
						operator = 'eq';
						break;
					case '2' :
						// Yesterday
						fieldValue1 = Ext.Date.format(objDateHandler
										.getYesterdayDate(date), strSqlDateFormat);
						fieldValue2 = fieldValue1;
						operator = 'eq';
						break;
					case '3' :
						// This Week
						dtJson = objDateHandler.getThisWeekToDate(date);
						fieldValue1 = Ext.Date
								.format(dtJson.fromDate, strSqlDateFormat);
						fieldValue2 = Ext.Date.format(dtJson.toDate, strSqlDateFormat);
						operator = 'bt';
						break;
					case '4' :
						// Last Week To Date
						dtJson = objDateHandler.getLastWeekToDate(date);
						fieldValue1 = Ext.Date
								.format(dtJson.fromDate, strSqlDateFormat);
						fieldValue2 = Ext.Date.format(dtJson.toDate, strSqlDateFormat);
						operator = 'bt';
						break;
					case '5' :
						// This Month
						dtJson = objDateHandler.getThisMonthToDate(date);
						fieldValue1 = Ext.Date
								.format(dtJson.fromDate, strSqlDateFormat);
						fieldValue2 = Ext.Date.format(dtJson.toDate, strSqlDateFormat);
						operator = 'bt';
						break;
					case '6' :
						// Last Month To Date
						dtJson = objDateHandler.getLastMonthToDate(date);
						fieldValue1 = Ext.Date
								.format(dtJson.fromDate, strSqlDateFormat);
						fieldValue2 = Ext.Date.format(dtJson.toDate, strSqlDateFormat);
						operator = 'bt';
						break;
					case '8' :
						// This Quarter
						dtJson = objDateHandler.getQuarterToDate(date);
						fieldValue1 = Ext.Date
								.format(dtJson.fromDate, strSqlDateFormat);
						fieldValue2 = Ext.Date.format(dtJson.toDate, strSqlDateFormat);
						operator = 'bt';
						break;
					case '9' :
						// Last Quarter To Date
						dtJson = objDateHandler.getLastQuarterToDate(date);
						fieldValue1 = Ext.Date
								.format(dtJson.fromDate, strSqlDateFormat);
						fieldValue2 = Ext.Date.format(dtJson.toDate, strSqlDateFormat);
						operator = 'bt';
						break;
					case '10' :
						// This Year
						dtJson = objDateHandler.getYearToDate(date);
						fieldValue1 = Ext.Date
								.format(dtJson.fromDate, strSqlDateFormat);
						fieldValue2 = Ext.Date.format(dtJson.toDate, strSqlDateFormat);
						operator = 'bt';
						break;
					case '11' :
						// Last Year To Date
						dtJson = objDateHandler.getLastYearToDate(date);
						fieldValue1 = Ext.Date
								.format(dtJson.fromDate, strSqlDateFormat);
						fieldValue2 = Ext.Date.format(dtJson.toDate, strSqlDateFormat);
						operator = 'bt';
						break;
					case '12' :
						// Latest
						var fromDate = new Date(Ext.Date.parse(from_date_admin, dtFormat));
					    var toDate = new Date(Ext.Date.parse(to_date_admin, dtFormat));		
						 
						fieldValue1 = Ext.Date.format(
									fromDate,
									strSqlDateFormat);
						fieldValue2 = Ext.Date.format(
									toDate,
									strSqlDateFormat);
						operator = 'bt';
						break;
					case '14' :
					    //last month only
						dtJson = objDateHandler.getLastMonthStartAndEndDate(date);
						fieldValue1 = Ext.Date
								.format(dtJson.fromDate, strSqlDateFormat);
						fieldValue2 = Ext.Date.format(dtJson.toDate, strSqlDateFormat);
						operator = 'bt';
						break;
					case '13' :
						// Date Range
						if (me.datePickerSelectedDate.length == 1) {
							fieldValue1 = Ext.Date.format(me.datePickerSelectedDate[0],
									strSqlDateFormat);
							fieldValue2 = fieldValue1;
							operator = 'eq';
						} else if (me.datePickerSelectedDate.length == 2) {
							fieldValue1 = Ext.Date.format(me.datePickerSelectedDate[0],
									strSqlDateFormat);
							fieldValue2 = Ext.Date.format(me.datePickerSelectedDate[1],
									strSqlDateFormat);
							operator = 'bt';
						}
				}
				retObj.fieldValue1 = fieldValue1;
				retObj.fieldValue2 = fieldValue2;
				retObj.operator = operator;
				return retObj;
			},
			/*setInfoTooltip : function()
			{
				var me = this, filter = me.getPreGeneratedReportFilterViewRef(), arrFilter = [];
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
								+ financialInstitutionVal + '<br/>' + getLabel( 'client', 'Client' ) + ' : '
								+ clientVal + '<br/>' + getLabel( 'repOrDwnld', 'Report or Upload' ) + ' : '
								+ repOrDwnldDesc + '<br/>' + getLabel( 'repOrDwnldType', 'Report Type' ) + ' : '
								+ reportTypeDesc + '<br/>' + getLabel( 'status', 'Status' ) + ' : ' + statusFilter );
						}
					}
				} );

			},*/
			submitExportRequest : function(selectedRecord,strUrl,strAction)
			{
				var me = this;
				var preGenId = null ;
				var exportType = 'MERGE' ;
				form = document.createElement( 'FORM' );
				form.name = 'frmMain';
				form.id = 'frmMain';
				form.method = 'POST';
				//strUrl = "exportPreGeneratedReport.srvc";
				var records = ( selectedRecord || [] );
				var pregenArray = [] ;
				for( var index = 0 ; index < records.length ; index++ )
				{
					pregenArray.push(records[ index ].data.recordKeyNo)
					if(strAction == 'actionExport' && records[ index ].data.fileExtension != 'TXT')
					{
						exportType = 'ZIP' ;
					}
				}
				if(exportType == 'MERGE' && strUrl == 'viewPreGeneratedReport.srvc')
				{
					form.target="_blank";
				}
				preGenId = pregenArray.join();
				form.appendChild( me.createFormField( 'INPUT', 'HIDDEN', 'preGenId', preGenId ) );
				form.appendChild( me.createFormField( 'INPUT', 'HIDDEN', 'exportType', exportType ) );
				form.appendChild( me.createFormField( 'INPUT', 'HIDDEN', 'clientCode', records[0].data.entityCode ) );
				form.appendChild( me.createFormField( 'INPUT', 'HIDDEN', csrfTokenName, csrfTokenValue ) );
				form.action = strUrl;
				document.body.appendChild( form );
				form.submit();
				document.body.removeChild( form );
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
					var preGeneratedReportFilterViewRef = me.getPreGeneratedReportFilterViewRef();
					form.appendChild( me.createFormField( 'INPUT', 'HIDDEN', 'clientCode',
						preGeneratedReportFilterViewRef.clientCode ) );
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
					strUrl = "downldPreGeneratedReport.srvc";
					//form.appendChild( me.createFormField( 'INPUT', 'HIDDEN', 'recordKeyNo', record.get( 'recordKeyNo' ) ) );
					//form.appendChild( me.createFormField( 'INPUT', 'HIDDEN', 'schTempFileDir', record.get( 'schTempFileDir' ) ) );
					//form.appendChild( me.createFormField( 'INPUT', 'HIDDEN', 'gaFileName', record.get( 'gaFileName' ) ) );
					//form.appendChild( me.createFormField( 'INPUT', 'HIDDEN', 'fileName', record.get( 'fileName' ) ) );
					form.appendChild( me.createFormField( 'INPUT', 'HIDDEN', 'exportType', str ) );
					form.appendChild( me.createFormField( 'INPUT', 'HIDDEN', 'viewState', record.get( 'viewState' )  ) );
				}
				else if( str == 'Export' )
				{
					strUrl = "downldPreGeneratedReport.srvc";
					//form.appendChild( me.createFormField( 'INPUT', 'HIDDEN', 'recordKeyNo', record.get( 'recordKeyNo' ) ) );
					//form.appendChild( me.createFormField( 'INPUT', 'HIDDEN', 'schTempFileDir', record.get( 'schTempFileDir' ) ) );
					//form.appendChild( me.createFormField( 'INPUT', 'HIDDEN', 'gaFileName', record.get( 'gaFileName' ) ) );
					//form.appendChild( me.createFormField( 'INPUT', 'HIDDEN', 'fileName', record.get( 'fileName' ) ) );
					form.appendChild( me.createFormField( 'INPUT', 'HIDDEN', 'exportType', str ) );
					form.appendChild( me.createFormField( 'INPUT', 'HIDDEN', 'viewState', record.get( 'viewState' )) );
				}
				else if( str == 'ROWVIEW' )
				{
					strUrl = "viewPreGeneratedReport.srvc";
					var preGenId = null ;
					var exportType = 'MERGE' ;
					var pregenArray = [] ;
					pregenArray.push(record.data.recordKeyNo)
					if(exportType == 'MERGE' && strUrl == 'viewPreGeneratedReport.srvc')
					{
						form.target="_blank";
					}
					preGenId = pregenArray.join();
					form.appendChild( me.createFormField( 'INPUT', 'HIDDEN', 'preGenId', preGenId ) );
					form.appendChild( me.createFormField( 'INPUT', 'HIDDEN', 'exportType', exportType ) );
					form.appendChild( me.createFormField( 'INPUT', 'HIDDEN', 'clientCode', record.data.entityCode ) );
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
            handleClearSettings:function(){
					 var me=this;
					 var filterView=me.getPreGeneratedReportFilterViewRef();
					 var reportDownloadId=filterView.down('combobox[itemId="repOrDwnldToolBar"]');
					 reportDownloadId.suspendEvents();
					 reportDownloadId.setValue("All");
					 reportDownloadId.resumeEvents();
					 filterView.repOrDwnld = '';
					 me.filterData=[];
					 me.firstTimeDateAccess = true;
					 /*var entryDatePicker = filterView.down('component[itemId="entryDataPicker"]');
					 me.dateFilterVal = '12';
					 me.dateFilterLabel = getLabel('latest', 'Latest');
					 me.handleDateChange(me.dateFilterVal);*/
					 me.datePickerSelectedDate = "";
					 me.dateFilterVal = '12'; // Set to Latest
					 me.dateFilterLabel = getLabel('latest', 'Latest');
					 var datePickerRef = $('#entryDatePickerQuickText');
					 me.dateFilterVal = '';
					 me.getDateLabel().setText(getLabel('date', 'Generation Date'));
					 datePickerRef.val('');
					
					 var reportNameId = filterView.down('combobox[itemId="reportNameId"]');
					 reportNameId.suspendEvents();
					 reportNameId.setValue("");
					 reportNameId.resumeEvents();
					 filterView.reportNameFilter='';
					 
					 /*var clientCombo = filterView.down('combobox[itemId="clientCombo"]');
					 clientCombo.suspendEvents();
					 clientCombo.setValue("");
					 clientCombo.resumeEvents();
					 filterView.clientCode = '';
					 filterView.clientDesc = '';*/
					 if (isClientUser()) {
						var clientComboBox = filterView.down('combo[itemId="clientCombo"]');
						filterView.clientCode = 'all';
					 	filterView.clientDesc = '';
						clientComboBox.suspendEvents();
						clientComboBox.setValue(filterView.clientCode);
						clientComboBox.resumeEvents();
					} else {
						var clientComboBox = me.getDebitNoteCenterFilterView()
								.down('combo[itemId="clientAuto]');
						clientComboBox.reset();
						filterView.clientCode = '';
					 	filterView.clientDesc = '';
					}
					 
					 me.filterApplied = 'Q';
					 var groupView = me.getGroupView();
					 groupView.down('smartgrid').refreshData();
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
	savePageSetting : function(arrPref, strInvokedFrom) { 
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
					{
						//window.location.reload();
						me.preferenceHandler.readPagePreferences(me.strPageName,
							me.postDoHandleReadPagePrefNew, null, me, true);
	
						if (objGroupView)
							objGroupView.destroy(true);
						if (me.getPreGeneratedReportViewRef()) 
						{
							objGroupView =me.getPreGeneratedReportViewRef().createGroupView();
							me.getPreGeneratedReportViewRef().add(objGroupView);
						
						}
					}
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
					{
						//window.location.reload();
						me.preferenceHandler.readPagePreferences(me.strPageName,
							me.postDoHandleReadPagePrefNew, null, me, true);
		
						if (objGroupView)
							objGroupView.destroy(true);
						if (me.getPreGeneratedReportViewRef()) 
						{
							objGroupView =me.getPreGeneratedReportViewRef().createGroupView();
							me.getPreGeneratedReportViewRef().add(objGroupView);
						
						}
					}
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
	
						if (!Ext.isEmpty(objpregenPreferencesPref))
						{
							//Replace as per screen saved preferences
							objPrefData = Ext.decode(objpregenPreferencesPref); //Replace as per screen saved preferences
							
							objGeneralSetting = objPrefData && objPrefData.d.preferences &&
							objPrefData.d.preferences.GeneralSetting ? objPrefData.d.preferences.GeneralSetting : null;
							
							objGridSetting = objPrefData && objPrefData.d.preferences && 
							objPrefData.d.preferences.GridSetting ? objPrefData.d.preferences.GridSetting : null;
							/**
							 * This default column setting can be taken from
							 * preferences/gridsets/under defined( js file)
							 */
							objColumnSetting = objPrefData && objPrefData.d.preferences && objPrefData.d.preferences.ColumnSetting
									&& objPrefData.d.preferences.ColumnSetting.gridCols ? objPrefData.d.preferences.ColumnSetting.gridCols
									: (REPORT_GENERIC_COLUMN_MODEL || '[]'); 
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
									title : strTitle
								});
						me.pageSettingPopup.show();
						me.pageSettingPopup.center();
		},
		postDoHandleReadPagePrefNew : function(data, args, isSuccess) {
			var me = this;
			if (isSuccess === 'Y') {
				if (!Ext.isEmpty(data)) 
				{				
					objpregenPreferencesPref = Ext.encode(data);
				}
			}
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
				var arrAdvJson = null;
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
			var filterView = me.getPreGeneratedReportFilterViewRef();
			if(!Ext.isEmpty(objData))
				strFieldName = objData.paramName || objData.field;
		 
			if(strFieldName === 'EntryDate' )
			{
					/*var entryDatePicker = filterView.down('component[itemId="entryDataPicker"]');
					 me.dateFilterVal = '12';
					 me.dateFilterLabel = getLabel('latest', 'Latest');
					 me.handleDateChange(me.dateFilterVal);
					 me.datePickerSelectedDate = "";*/
					 var datePickerRef = $('#entryDatePickerQuickText');
					 me.dateFilterVal = '';
					 me.getDateLabel().setText(getLabel('date', 'Generation Date'));
					 datePickerRef.val('');
			}
			
			if(strFieldName === 'repOrDwnld' )
			{
				    var reportDownloadId=filterView.down('combobox[itemId="repOrDwnldToolBar"]');
					 reportDownloadId.suspendEvents();
					 reportDownloadId.setValue("All");
					 reportDownloadId.resumeEvents();
					 filterView.repOrDwnld = '';
			}
			else if(strFieldName === 'reportName')
			{
					var reportNameId = filterView.down('combobox[itemId="reportNameId"]');
					 reportNameId.suspendEvents();
					 reportNameId.setValue("");
					 reportNameId.resumeEvents();
					 filterView.reportNameFilter='';
			}
			else if(strFieldName ==='client')
			{			
				/*if(isClientUser())
				{
					var clientComboBox = me.getPreGeneratedReportFilterViewRef().down('combo[itemId="clientCombo"]');
					filterView.clientCode = 'ALL';
					filterView.clientDesc = '';
					clientComboBox.setRawValue(getLabel('allCompanies', 'All companies'));	
				} 
				else 
				{
					var clientComboBox = me.getPreGeneratedReportFilterViewRef().down('combo[itemId="clientCodeId]');
					clientComboBox.reset();
					filterView.clientCode = '';
					filterView.clientDesc = '';
				}*/
				if (isClientUser()) {
					var clientComboBox = filterView.down('combo[itemId="clientCombo"]');
					filterView.clientCode = 'all';
				 	filterView.clientDesc = '';
					clientComboBox.suspendEvents();
					clientComboBox.setValue(filterView.clientCode);
					clientComboBox.resumeEvents();
				} else {
					var clientComboBox = me.getDebitNoteCenterFilterView()
							.down('combo[itemId="clientAuto]');
					clientComboBox.reset();
					filterView.clientCode = '';
				 	filterView.clientDesc = '';
				}
			}
		},
		refreshData : function() {
			var me = this;
			var objGroupView = me.getGroupView();
			objGroupView.getGrid().removeAppliedSort();
			objGroupView.refreshData();
		}
		} );