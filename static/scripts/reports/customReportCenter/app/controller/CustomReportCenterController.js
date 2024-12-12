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
			requires : [],
			views :
			[
				'GCP.view.CustomReportCenterView', 'Ext.ux.gcp.PreferencesHandler','GCP.view.CustomReportClonePopUp'
			],
			refs :
			[
				{
					ref : 'customReportCenterViewRef',
					selector : 'customReportCenterViewType'
				},
				{
					ref : 'customReportCenterFilterViewRef',
					selector : 'customReportCenterViewType customReportCenterFilterViewType'
				},
				{
					ref : 'clientAutoCompleter',
					selector : 'customReportCenterViewType customReportCenterFilterViewType AutoCompleter[itemId="reportCenterClientId"]'
				},
				{
					ref : 'sellerCombo',
					selector : 'customReportCenterViewType customReportCenterFilterViewType combobox[itemId="reportCenterSellerId"]'
				},
				{
					ref : 'groupView',
					selector : 'customReportCenterViewType groupView'
				},
				{
					ref : 'smartgrid',
					selector : 'customReportCenterViewType groupView smartgrid'
				},
				{
					ref : 'btnClearPreferences',
					selector : 'customReportCenterViewType customReportCenterFilterViewType button[itemId="btnClearPreferences"]'
				},
				{
					ref : 'btnSavePreferences',
					selector : 'customReportCenterViewType customReportCenterFilterViewType button[itemId="btnSavePreferences"]'
				},
				{
					ref : 'clonePopUpRef',
					selector : 'customReportClonePopUp[itemId="clonePopUpId"]'
				},
				{
					ref : 'clonePopUpDtlRef',
					selector : 'customReportClonePopUp[itemId="clonePopUpId"]'
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
				clientFilterVal : strClient,
				clientFilterDesc : strClientDesc,
				filterDataPref : {},
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
				me.objClonePopup = Ext.create('GCP.view.CustomReportClonePopUp', {
					parent : 'customReportCenterView',
					itemId : 'clonePopUpId'
				});

				me.updateConfigs();
				me.getFavoriteReports();
				me.doApplySavedPreferences();
				me.control(
				{
					'customReportCenterViewType customReportCenterFilterViewType' :
					{
						'render' : function()
						{
							me.setInfoTooltip();
							//me.setDataForQuickFilter();
							me.setSelectedFilters();
						},
						'quickFilterChange' : function( filterJson )
						{
							me.setDataForQuickFilter( filterJson );
							me.toggleSavePrefrenceAction( true );
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
							//me.setDataForQuickFilter(me.filterJson);		
							me.toggleSavePrefrenceAction( true );
							me.doHandleGroupTabChange( groupInfo, subGroupInfo, tabPanel, newCard, oldCard );
						},
						'groupActionClick' : function( actionName, isGroupAction, maskPosition, grid,
							arrSelectedRecords )
						{
							if( isGroupAction === true )
								me.doHandleGroupActions( actionName, grid, arrSelectedRecords, 'groupAction' );
						},
						'gridRowActionClick' : function(grid, rowIndex, columnIndex,
								actionName, record) {
							me.doHandleRowActions(actionName, grid, record, rowIndex);
						},
						'gridRender' : me.doHandleLoadGridData,
						'gridPageChange' : me.doHandleLoadGridData,
						'gridSortChange' : me.doHandleLoadGridData,
						'gridPageSizeChange' : me.doHandleLoadGridData,
						'gridColumnFilterChange' : me.doHandleLoadGridData,
						'gridRowSelectionChange' : me.doHandleGridRowSelectionChange,

						'gridStateChange' : function( grid )
						{
							me.toggleSavePrefrenceAction( true );
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
					'customReportCenterViewType customReportCenterFilterViewType button[itemId="btnSavePreferences"]' :
					{
						click : function( btn, opts )
						{
							me.toggleSavePrefrenceAction( false );
							me.handleSavePreferences();
						}
					},
					'customReportCenterViewType customReportCenterFilterViewType button[itemId="btnClearPreferences"]' :
					{
						click : function( btn, opts )
						{
							me.toggleClearPrefrenceAction( false );
							me.handleClearPreferences();
						}
					},
					'customReportCenterViewType customReportCenterTitleViewType button[itemId="btnCreateReport"]' :
					{
						click : function( btn, opts )
						{
							doChooseReport( me.sellerFilterVal, me.clientFilterVal, me.clientFilterDesc );
						}
					},
					'customReportClonePopUp[itemId="clonePopUpId"]' : {
						handleCloneAction : function(btn, record) {
							me.handleCloneAction(btn, record);
						},
						closeClonePopup : function(btn) {
							me.closeClonePopup(btn);
						}
					}
				} );
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
				var arrCols = null, objCol = null, arrColPref = null, arrPref = [], objFilterPref = null;
				var groupInfo = null, subGroupInfo = null, strModule = null, filter = me
					.getCustomReportCenterFilterViewRef();
				var state = null;
				if( groupView )
				{
					state = groupView.getGroupViewState();
					groupInfo = groupView.getGroupInfo() || '{}';
					subGroupInfo = groupView.getSubGroupInfo() || {};
					var data = filter.getQuickFilterJSON();
					var financialInstitutionVal = ( data[ 'sellerCode' ] || "" );
					var clientVal = ( data[ 'clientCode' ] || "" );
					var clientDesc = ( data[ 'clientDesc' ] || "" );
					var repOrDwnld = ( data[ 'repOrDwnld' ] || "" );
					var statusCode = ( data[ 'statusCode' ] || "" );
					var reportType = ( data[ 'reportType' ] || "" );
					var repOrDwnldDesc = ( data[ 'repOrDwnldDesc' ] || "" );
					var statusFilterDesc = ( data[ 'statusCodeDesc' ] || "" );
					var reportTypeDesc = ( data[ 'reportTypeDesc' ] || "" );
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
							'pgSize' : state.grid.pageSize
						}
					} );
					arrPref.push(
					{
						"module" : "groupViewFilterPref",
						"jsonPreferences" :
						{
							'financialInstitutionVal' : financialInstitutionVal,
							'clientVal' : clientVal,
							'clientDesc' : clientDesc,
							'repOrDwnld' : repOrDwnld,
							'statusCode' : statusCode,
							'reportType' : reportType,
							'repOrDwnldDesc' : repOrDwnldDesc,
							'statusFilterDesc' : statusFilterDesc,
							'reportTypeDesc' : reportTypeDesc
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
				var me = this, filter = me.getCustomReportCenterFilterViewRef();
				data = null;
				data = filter.getQuickFilterJSON();
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
				/*if( objPref.reportType )
				{
					var btn = filter.down( 'button[code=' + objPref.reportType + ']' );
					me.setButtonCls( btn, 'reportTypeToolBar' );
					filter.reportType = btn.code;
					filter.reportTypeDesc = btn.btnDesc;
					//filter.handleQuickFilterChange();
				}*/
				if( objPref.statusCode )
				{
					var btn = filter.down( 'button[code=' + objPref.statusCode + ']' );
					me.setButtonCls( btn, 'reportStatusToolBar' );
					filter.statusCode = btn.code;
					filter.statusCodeDesc = btn.btnDesc;
					//filter.handleQuickFilterChange();
				}
				/*if( objPref.repOrDwnld )
				{
					var btn = filter.down( 'button[code=' + objPref.repOrDwnld + ']' );
					me.setButtonCls( btn, 'repOrDwnldToolBar' );
					filter.repOrDwnld = btn.code;
					filter.repOrDwnldDesc = btn.btnDesc;
					//filter.handleQuickFilterChange();
				}*/
				if( objPref.clientCode )
				{
					var clientMenu = filter.down( 'menu[itemId="clientMenu"]' );
					var clientBtn = filter.down( 'button[itemId="clientBtn"]' );
					filter.clientCode = objPref.clientCode;
					filter.clientDesc = objPref.clientDesc;

				}
				me.setDataForQuickFilter( objPref );
			},
			setButtonCls : function( btn, itemId )
			{
				var me = this, filter = me.getCustomReportCenterFilterViewRef();
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
				var maskArray = new Array(), actionMask = '', objData = null;

				if( !Ext.isEmpty( jsonData ) && !Ext.isEmpty( jsonData.d.__buttonMask ) )
					buttonMask = jsonData.d.__buttonMask;
				maskArray.push( buttonMask );
				for( var index = 0 ; index < arrSelectedRecords.length ; index++ )
				{
					objData = arrSelectedRecords[ index ];
					maskArray.push( objData.get( '__metadata' ).__rightsMap );
				}
				actionMask = doAndOperation( maskArray, 6 );
				objGroupView.handleGroupActionsVisibility( actionMask );
			},

			doHandleGroupActions : function( strAction, grid, arrSelectedRecords, strActionType )
			{
				var me = this;
				var strUrl;
				if( strAction == 'reportCenterSubmit' )
				{
					strUrl = 'loadCustomReportWidgetsData/submit.srvc?';
				}
				else if( strAction == 'reportCenterDiscard' )
				{
					strUrl = 'loadCustomReportWidgetsData/discard.srvc?';
				}
				else if( strAction == 'reportCenterEnable' )
				{
					strUrl = 'loadCustomReportWidgetsData/enable.srvc?';
				}
				else if( strAction == 'reportCenterDisable' )
				{
					strUrl = 'loadCustomReportWidgetsData/disable.srvc?';

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
								sellerId : records[ index ].data.sellerId
							} );
						}
						if( arrayJson )
							arrayJson = arrayJson.sort( function( valA, valB )
							{
								return valA.serialNo - valB.serialNo
							} );
						groupView.setLoading( true );
						strUrl = strUrl + csrfTokenName + "=" + csrfTokenValue;
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
					url : 'userpreferences/customReportCenter/preferredReports.srvc',
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

				wdgt.setLoading( true );
				Ext.Ajax.request(
				{
					url : 'userpreferences/customReportCenter/preferredReports.srvc',
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
				/*
				 * me.getFavButtonRef().setText(getLabel('favorites',
				 * 'Favorites') + "(<span class='red'>" + favLength + "</span>)");
				 * me.getFavButtonRef().accArray = me.favReport;
				 */
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
			doHandleRowActions : function(actionName, grid, record, rowIndex)
			{
				var me = this;
				if(actionName === 'btnClone')
				{
					me.showClonePopup(record);
				}
				else if(actionName === 'btnEdit')
				{
					editCustomReport( record );
				}
			},
			showClonePopup : function(record) {
				var me = this;
				if (!Ext.isEmpty(me.objClonePopup)) {
					me.objClonePopup.popupData = record;
					me.objClonePopup.show();
				} else {
					me.objClonePopup = Ext.create('GCP.view.CustomReportClonePopUp');
					me.objClonePopup.popupData = record;
					me.objClonePopup.show();
				}
					
			},
			closeClonePopup : function(btn) {
				var me = this;
				me.getClonePopUpRef().close();
				var objPanel = me.getClonePopUpDtlRef();
				objPanel.down('textfield[itemId="reportName"]').setValue("");
			},
			handleCloneAction : function(btn, record) {
				var me = this;
				var objPanel = me.getClonePopUpDtlRef();
				var groupView = me.getGroupView();
				var objGroupView = me.getGroupView();
				var newReportName = objPanel.down('textfield[itemId="reportName"]').getValue();
				if(!Ext.isEmpty(newReportName))
				{
					if( !Ext.isEmpty( groupView ) )
					{
						var me = this;
						
							var arrayJson = new Array();
							var records = [record] ;
							for( var index = 0 ; index < records.length ; index++ )
							{
								arrayJson.push(
								{
									reportName : newReportName,
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
								url : 'loadCustomReportWidgetsData/clone.srvc',
								method : 'POST',
								jsonData : Ext.encode( arrayJson ),
								success : function( jsonData )
								{
									//var jsonRes = Ext.JSON
									//		.decode(jsonData.responseText);
									groupView.setLoading( false );
									me.getSmartgrid().refreshData();
									objGroupView.handleGroupActionsVisibility( me.strDefaultMask );
									me.getClonePopUpRef().close();
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
										icon : Ext.MessageBox.ERROR
									} );
								}
							} );
						
					}
				}
				else
				{
					Ext.Msg.alert("Error", "Report Name should not be blank");
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
					var objPref = {};
					objPref[ 'sellerCode' ] = seller;
					objPref[ 'clientCode' ] = clientVal;
					objPref[ 'clientDesc' ] = clientDesc;
					objPref[ 'repOrDwnld' ] = reportOrDownload;
					objPref[ 'reportType' ] = reportType;
					objPref[ 'statusCode' ] = status;
					me.setDataForQuickFilter( objPref );
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
				if( filterView.reportType == 'FAVORITE' )
				{
					strUrl += '&$isFavouriteFilter=Y';
				}
				if( !Ext.isEmpty( filterView.clientCode ) && filterView.clientCode != 'all' )
				{
					strUrl += '&$isClientFilterSelected=Y';
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
				var objSummaryView = me.getCustomReportCenterViewRef(), objPref = null, gridModel = null, intPgSize = null;
				var colModel = null, arrCols = null;
				if( data && data.preference )
				{
					me.toggleClearPrefrenceAction( true );
					objPref = Ext.decode( data.preference );
					arrCols = objPref.gridCols || objDefPref[ mapService[ args[ 'module' ] ] ] || null;
					intPgSize = objPref.pgSize || _GridSizeTxn;
					colModel = objSummaryView.getColumns( arrCols );
					if( colModel )
					{
						gridModel =
						{
							columnModel : colModel,
							pageSize : intPgSize
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
				var me = this, filter = me.getCustomReportCenterFilterViewRef(), arrFilter = [];
				;
				var data = null;
				var me = this, filter = me.getCustomReportCenterFilterViewRef(), arrFilter = [];
				;
				if( !me.isEmptyObject( filterJson ) )
				{
					data = filterJson;
				}
				else
				{
					data = filter.getQuickFilterJSON();
				}
				if( data )
				{
					if( data[ 'sellerCode' ] )
						arrFilter.push(
						{
							paramName : 'seller',
							paramValue1 : ( data[ 'sellerCode' ] || '' ).toUpperCase(),
							operatorValue : 'eq',
							dataType : 'S'
						} );
					if( data[ 'clientCode' ] )
						arrFilter.push(
						{
							paramName : 'client',
							paramValue1 : ( data[ 'clientCode' ] || '' ),
							operatorValue : 'eq',
							dataType : 'S'
						} );
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

					if( data[ 'statusCode' ] )
						arrFilter.push(
						{
							paramName : 'reportStatus',
							paramValue1 : ( data[ 'statusCode' ] || '' ),
							operatorValue : 'eq',
							dataType : 'S'
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
								+ financialInstitutionVal + '<br/>' + getLabel( 'grid.column.company', 'Company Name' ) + ' : '
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
					var customReportCenterFilterViewRef = me.getCustomReportCenterFilterViewRef();
					form.appendChild( me.createFormField( 'INPUT', 'HIDDEN', 'clientCode',
						customReportCenterFilterViewRef.clientCode ) );
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
			}
		} );
