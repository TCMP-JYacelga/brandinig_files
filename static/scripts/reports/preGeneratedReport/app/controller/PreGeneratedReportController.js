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
			requires : [],
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
					selector : 'preGeneratedReportViewType preGeneratedReportFilterViewType'
				},
				{
					ref : 'clientAutoCompleter',
					selector : 'preGeneratedReportViewType preGeneratedReportFilterViewType AutoCompleter[itemId="reportCenterClientId"]'
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
					ref : 'fromDateLabel',
					selector : 'preGeneratedReportViewType preGeneratedReportFilterViewType label[itemId="dateFilterFrom"]'
				}, 
				{
					ref : 'toDateLabel',
					selector : 'preGeneratedReportViewType preGeneratedReportFilterViewType label[itemId="dateFilterTo"]'
				}, 
				{
					ref : 'dateLabel',
					selector : 'preGeneratedReportViewType preGeneratedReportFilterViewType label[itemId="dateLabel"]'
				}, 
				{
					ref : 'entryDate',
					selector : 'preGeneratedReportViewType preGeneratedReportFilterViewType button[itemId="entryDate"]'
				}, 
				{
					ref : 'fromEntryDate',
					selector : 'preGeneratedReportViewType preGeneratedReportFilterViewType datefield[itemId="fromDate"]'
				}, 
				{
					ref : 'toEntryDate',
					selector : 'preGeneratedReportViewType preGeneratedReportFilterViewType datefield[itemId="toDate"]'
				}, 
				{
					ref : 'dateRangeComponent',
					selector : 'preGeneratedReportViewType preGeneratedReportFilterViewType container[itemId="dateRangeComponent"]'
				}
			],
			config :
			{
				preferenceHandler : null,
				dateHandler : null,
				dateFilterVal : '12',
				dateFilterLabel : 'Latest',
				filterData : [],
				favReport : [],
				widgetType : '01',
				reportModule : '01',
				strDefaultMask : '0000',
				strPageName : 'preGeneratedReport',
				filterDataPref : {},
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
				me.dateHandler = Ext.create('Ext.ux.gcp.DateUtil');		
				var date = new Date(Ext.Date.parse(dtApplicationDate, strExtApplicationDateFormat));
				clientFromDate = me.dateHandler.getDateBeforeDays(date,filterDays);
				
				if(!Ext.isEmpty(filterJson))
				arrFilterJson = JSON.parse(filterJson);
				me.updateConfigs();
				me.doApplySavedPreferences();
				me.getFavoriteReports();
				me.control(
				{
					'preGeneratedReportViewType preGeneratedReportFilterViewType' :
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
							if( me.getPreGeneratedReportViewRef() )
								me.getPreGeneratedReportViewRef().setLoading( true );
							me.applyQuickFilter();
						},
						'dateChange' : function(btn, opts) 
						{
							me.dateFilterVal = btn.btnValue;
							me.dateFilterLabel = btn.text;
							me.handleDateChange(btn.btnValue);
							if (btn.btnValue !== '7') {
								// TODO: To be handled
								me.setDataForQuickFilter();
								me.applyQuickFilter();
							}
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
							me.toggleSavePrefrenceAction( true );
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
					'preGeneratedReportViewType groupView smartgrid' :
					{
						'cellclick' : me.doHandleCellClick
					},
					'preGeneratedReportViewType preGeneratedReportFilterViewType button[itemId="btnSavePreferences"]' :
					{
						click : function( btn, opts )
						{
							me.toggleSavePrefrenceAction( false );
							me.handleSavePreferences();
						}
					},
					'preGeneratedReportViewType preGeneratedReportFilterViewType button[itemId="btnClearPreferences"]' :
					{
						click : function( btn, opts )
						{
							me.toggleClearPrefrenceAction( false );
							me.handleClearPreferences();
						}
					},
					'preGeneratedReportViewType preGeneratedReportTitleViewType button[itemId="btnCreateReport"]' :
					{
						click : function( btn, opts )
						{
							me.submitRequest( 'addReport' );
						}
					},
					'preGeneratedReportViewType preGeneratedReportTitleViewType toolbar[itemId="dateToolBar"]' : {
						afterrender : function(tbar, opts) {
							me.updateDateFilterView();
						}
					},
					'preGeneratedReportViewType preGeneratedReportFilterViewType button[itemId="goBtn"]' : {
						click : function(btn, opts) {
							var frmDate = me.getFromEntryDate().getValue();
							var toDate = me.getToEntryDate().getValue();

							if (!Ext.isEmpty(frmDate) && !Ext.isEmpty(toDate)) {
								var dtParams = me.getDateParam('7');
								me.dateFilterFromVal = dtParams.fieldValue1;
								me.dateFilterToVal = dtParams.fieldValue2;
								me.setDataForQuickFilter();
								me.applyQuickFilter();
								me.toggleSavePrefrenceAction(true);
							}

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
					.getPreGeneratedReportFilterViewRef();
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
					var reportType = ( data[ 'reportType' ] || "" ); // FAVORITE Filter not stored in data['reportType']
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
				var me = this, filter = me.getPreGeneratedReportFilterViewRef();
				data = null;
				data = filter.getQuickFilterJSON();
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
					strClient = objPref[ 'clientCode' ] || strClient;
					strClientDesc = objPref[ 'clientDesc' ] || strClientDesc;
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
				if( objPref.reportType )
				{
					var btn = filter.down( 'button[code=' + objPref.reportType + ']' );
					me.setButtonCls( btn, 'reportTypeToolBar' );
					filter.reportType = btn.code;
					filter.reportTypeDesc = btn.btnDesc;
					//filter.handleQuickFilterChange();
				}
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
					url : 'userpreferences/preGeneratedReport/preferredReports.srvc' ,
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
				var downloadClicked = ( e.target.tagName == 'A' && cellIndex == 0 );
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
				if(!Ext.isEmpty(widgetFilterUrl))
					{
						var strUrl='';
						var filterView = me.getPreGeneratedReportFilterViewRef();
						var strQuickFilterUrl = me.generateUrlWithQuickFilterParams( me.filterData ,widgetFilterUrl);
						if( !Ext.isEmpty( strQuickFilterUrl ) )
							strUrl += strQuickFilterUrl+" and "+widgetFilterUrl;
							else
							strUrl += "&$filter="+widgetFilterUrl;
							
						if( !Ext.isEmpty( filterView.clientCode ) && filterView.clientCode != 'all' )
							strUrl += '&$isClientFilterSelected=Y';
						widgetFilterUrl = '';
						
						if(strUrl.indexOf('generationDate')!=-1)
						strUrl=strUrl.replace('generationDate', 'EntryDate');
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
				var objSummaryView = me.getPreGeneratedReportViewRef(), objPref = null, gridModel = null, intPgSize = null;
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
				var me = this, filter = me.getPreGeneratedReportFilterViewRef(), arrFilter = [];
				;
				var data = null;
				var me = this, filter = me.getPreGeneratedReportFilterViewRef(), arrFilter = [];
				;
				if( !me.isEmptyObject( filterJson ) )
				{
					data = filterJson;
				}
				else
				{
					data = filter.getQuickFilterJSON();
				}
				var index = me.dateFilterVal;
				var objDateParams = me.getDateParam(index);
				if(index != '12')
				{
				arrFilter.push({
							paramName : me.getEntryDate().filterParamName,
							paramValue1 : objDateParams.fieldValue1,
							paramValue2 : objDateParams.fieldValue2,
							operatorValue : objDateParams.operator,
							dataType : 'D'
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
					if( data[ 'reportNameId' ] )
						arrFilter.push(
						{
							paramName : 'reportName',
							paramValue1 : ( data[ 'reportNameId' ] || '' ),
							operatorValue : 'eq',
							dataType : 'S'
						} );
				}
				me.filterData = arrFilter;
			},
			setInfoTooltip : function()
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

			},
			handleDateChange : function(index) {
				var me = this;
				var filterView = me.getPreGeneratedReportFilterViewRef();
				var fromDateLabel = me.getFromDateLabel();
				var toDateLabel = me.getToDateLabel();
				var objDateParams = me.getDateParam(index, null);
				var fromDate = me.getFromEntryDate();
				var toDate = me.getToEntryDate();

				if (fromDate && objDateParams.fieldValue1)
					fromDate.setValue(objDateParams.fieldValue1);
				if (toDate && objDateParams.fieldValue2)
					toDate.setValue(objDateParams.fieldValue2);

				if (index == '7') {
				var dtEntryDate = new Date( Ext.Date.parse( dtApplicationDate,
							strExtApplicationDateFormat ));
					me.getDateRangeComponent().show();
					me.getFromDateLabel().hide();
					me.getToDateLabel().hide();				
					me.getFromEntryDate().setValue( dtEntryDate );
					me.getToEntryDate().setValue( dtEntryDate );
					me.getFromEntryDate().setMinValue(clientFromDate);
					me.getToEntryDate().setMinValue(clientFromDate);
					
				} else {
					me.getDateRangeComponent().hide();
					me.getFromDateLabel().show();
					me.getToDateLabel().show();
				}

				if (!Ext.isEmpty(me.dateFilterLabel)) {
					me.getDateLabel().setText(getLabel('date', 'Date') + " ("
							+ me.dateFilterLabel + ")");
				}
				if (index !== '7') { 
					 vFromDate = Ext.util.Format.date(Ext.Date.parse(
									objDateParams.fieldValue1, 'Y-m-d'),
							strExtApplicationDateFormat);
					 vToDate = Ext.util.Format.date(Ext.Date.parse(
									objDateParams.fieldValue2, 'Y-m-d'),
							strExtApplicationDateFormat);
					if (index === '1' || index === '2' || index === '12') {
						if (index === '12') {
							// Do nothing for latest
							fromDateLabel.setText('' + '  ' + vFromDate);
						} else
							fromDateLabel.setText(vFromDate);

						toDateLabel.setText("");
					} else {
						fromDateLabel.setText(vFromDate + " - ");
						toDateLabel.setText(vToDate);
						me.vFromDate1 = vFromDate;
						me.vToDate1 = vToDate;
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
					case '7' :
						// Date Range
						var frmDate, toDate;
						if (!Ext.isEmpty(dateType)) {
							var objCreateNewFilterPanel = me.getCreateNewFilter();
							if (dateType == "process") {
								frmDate = objCreateNewFilterPanel
										.down('datefield[itemId=processFromDate]')
										.getValue();
								toDate = objCreateNewFilterPanel
										.down('datefield[itemId=processToDate]')
										.getValue();
							} else if (dateType == "effective") {
								frmDate = objCreateNewFilterPanel
										.down('datefield[itemId=effectiveFromDate]')
										.getValue();
								toDate = objCreateNewFilterPanel
										.down('datefield[itemId=effectiveToDate]')
										.getValue();
							} else if (dateType == "creation") {
								frmDate = objCreateNewFilterPanel
										.down('datefield[itemId=creationFromDate]')
										.getValue();
								toDate = objCreateNewFilterPanel
										.down('datefield[itemId=creationToDate]')
										.getValue();
							}

						} else {
							frmDate = me.getFromEntryDate().getValue();
							toDate = me.getToEntryDate().getValue();
						}
						frmDate = frmDate || date;
						toDate = toDate || frmDate;

						fieldValue1 = Ext.Date.format(frmDate, strSqlDateFormat);
						fieldValue2 = Ext.Date.format(toDate, strSqlDateFormat);
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
						 //fieldValue1 = Ext.Date.format(date, strSqlDateFormat);
						// fieldValue2 = fieldValue1;
						 //operator = 'le';
						break;
				}
				// comparing with client filter condition
				if (Ext.Date.parse(fieldValue1, strSqlDateFormat) < clientFromDate) {
					fieldValue1 = Ext.Date.format(clientFromDate, strSqlDateFormat);
				}
				retObj.fieldValue1 = fieldValue1;
				retObj.fieldValue2 = fieldValue2;
				retObj.operator = operator;
				return retObj;
			},
			updateDateFilterView : function() {
				var me = this;
				var dtEntryDate = null;
				var defaultToDate = new Date(Ext.Date.parse(dtApplicationDate,
						strExtApplicationDateFormat));
				var defaultFromDate = new Date(Ext.Date.parse(dtApplicationDate,
						strExtApplicationDateFormat));
				if (!Ext.isEmpty(me.dateFilterVal)) {
					me.handleDateChange(me.dateFilterVal);
					if (me.dateFilterVal === '7') {
						if (!Ext.isEmpty(me.dateFilterFromVal)) {
							dtEntryDate = Ext.Date.parse(me.dateFilterFromVal, "Y-m-d");
							me.getFromEntryDate().setValue(dtEntryDate);
						} else {
							me.getFromEntryDate().setValue(defaultFromDate);
						}
						if (!Ext.isEmpty(me.dateFilterToVal)) {
							dtEntryDate = Ext.Date.parse(me.dateFilterToVal, "Y-m-d");
							me.getToEntryDate().setValue(dtEntryDate);
						} else {
							me.getToEntryDate().setValue(defaultToDate);
						}
					} else {
						me.getFromEntryDate().setValue(defaultFromDate);
						me.getToEntryDate().setValue(defaultToDate);
					}
				}

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
					form.appendChild( me
						.createFormField( 'INPUT', 'HIDDEN', 'recordKeyNo', record.get( 'recordKeyNo' ) ) );
					form.appendChild( me.createFormField( 'INPUT', 'HIDDEN', 'schTempFileDir', record
						.get( 'schTempFileDir' ) ) );
					form
						.appendChild( me.createFormField( 'INPUT', 'HIDDEN', 'gaFileName', record.get( 'gaFileName' ) ) );
					form.appendChild( me.createFormField( 'INPUT', 'HIDDEN', 'fileName', record.get( 'fileName' ) ) );
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
