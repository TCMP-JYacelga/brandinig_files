Ext
	.define(
		'GCP.controller.MessageBoxController',
		{
			extend : 'Ext.app.Controller',
			requires :
			[
				'GCP.view.MessageBoxGridView','Ext.ux.gcp.PageSettingPopUp'
			],
			views :
			[
				'GCP.view.MessageBoxView'
			],
			/**
			 * Array of configs to build up references to views on page.
			 */
			refs : [{
				ref : 'pageSettingPopUp',
				selector : 'pageSettingPopUp'
			},{
					ref : 'messageBoxView',
					selector : 'messageBoxView'
				},
				{
					ref : 'messageBoxGrid',
					selector : 'messageBoxView messageBoxGridView grid[itemId="gridViewMstId"]'
				},
				{
					ref : 'messageBoxGridRef',
					selector : 'messageBoxView messageBoxGridView'
				},
				{
					ref : 'messageBoxFilterView',
					selector : 'messageBoxFilterView'
				},
				{
					ref : 'messageBoxDtlView',
					selector : 'messageBoxView messageBoxGridView panel[itemId="messageBoxDtlView"]'
				},
				{
					ref : 'composeMsgId',
					selector : 'messageBoxView button[itemId="composeMsgId"]'
				},
				{
					ref : 'messageBoxGridView',
					selector : 'messageBoxView messageBoxGridView'
				},
				{
					ref : 'btnSavePreferences',
					selector : 'messageBoxView messageBoxFilterView button[itemId="btnSavePreferences"]'
				},
				{
					ref : 'btnClearPreferences',
					selector : 'messageBoxView messageBoxFilterView button[itemId="btnClearPreferences"]'
				},
				{
					ref : 'actionBarSummDtl',
					selector : 'messageBoxView messageBoxGridView messageBoxGroupActionBarView'
				},
				{
					ref : 'messageInboxStatusToolBar',
					selector : 'messageBoxView messageBoxFilterView toolbar[itemId="messageInboxStatusToolBar"]'
				},
				{
					ref : 'fromDateLabel',
					selector : 'messageBoxFilterView label[itemId="dateFilterFrom"]'
				},
				{
					ref : 'toDateLabel',
					selector : 'messageBoxFilterView label[itemId="dateFilterTo"]'
				},
				{
					ref : 'dateLabel',
					selector : 'messageBoxFilterView label[itemId="dateLabel"]'
				},
				{
					ref : 'fromEntryDate',
					selector : 'messageBoxFilterView datefield[itemId="fromDate"]'
				},
				{
					ref : 'toEntryDate',
					selector : 'messageBoxFilterView datefield[itemId="toDate"]'
				},
				{
					ref : 'dateRangeComponent',
					selector : 'messageBoxFilterView container[itemId="dateRangeComponent"]'
				},
				{
					ref : 'messageDate',
					selector : ' messageBoxFilterView button[itemId="messageDate"]'
				},
				{
					ref : 'messageBoxGridInformationView',
					selector : 'messageBoxGridInformationView'
				},
				{
					ref : 'infoSummaryLowerPanel',
					selector : 'messageBoxGridInformationView panel[itemId="infoSummaryLowerPanel"]'
				},
				{
					ref : 'searchTxnTextInput',
					selector : 'messageBoxGridView textfield[itemId="searchTxnTextField"]'
				},
				{
					ref : 'matchCriteria',
					selector : 'messageBoxGridView radiogroup[itemId="matchCriteria"]'
				},
				{
					ref : 'formDestinationFilterActionToolBarRef',
					selector : 'messageBoxFilterView toolbar[itemId="formDestinationFilterActionToolBarItemId"]'
				},
				{
					ref : 'moreFormDestinationRef',
					selector : 'messageBoxFilterView button[itemId="moreFormDestinationItemId"]'
				},
				{
					ref : 'withHeaderCheckbox',
					selector : 'messageBoxView menuitem[itemId="withHeaderId"]'
				},
				{
					ref : 'sellerClientMenuBar',
					selector : ' messageBoxFilterView panel[itemId="sellerClientMenuBar"]'
				},
				{
					ref : 'sellerMenuBar',
					selector : ' messageBoxFilterView panel[itemId="sellerMenuBar"]'
				},
				{
					ref : 'clientMenuBar',
					selector : ' messageBoxFilterView panel[itemId="clientMenuBar"]'
				},
				{
					ref : 'filterBtn',
					selector : ' messageBoxFilterView button[itemId="filterBtnId"]'
				},
				{
					ref : 'manageAlertsTab',
					selector : ' messageBoxTitleViewType button[itemId="loanCenterSiTabItemId"]'
				},
				{
					ref : 'clientLoginMenuBar',
					selector : 'messageBoxFilterView panel[itemId="clientLoginMenuBar"]'
				},
				{
				ref : 'groupView',
				selector : 'messageBoxGridView groupView'
				},
				{
					ref:'filterView',
					selector:'filterView'
				},
				{
					ref : 'entryDateLabel',
					selector : 'messageBoxFilterView label[itemId="dateLabel"]'
				}
			],
			config :
			{
				selectedMessageBox : 'alert',
				filterData : [],
				messageStatusFilterVal : 'All',
				messageStatusFilterDesc : 'All',
				filterApplied : 'ALL',
				urlGridPref : 'services/userpreferences/messageInbox/gridView.srvc?',
				urlGridFilterPref : 'services/userpreferences/messageInbox/gridViewFilter.srvc?',
				strCommonPrefUrl : 'services/userpreferences/messageInbox/gridView.json',
				dateFilterVal : defaultDateIndex,
				dateFilterFromVal : '',
				dateFilterToVal : '',
				dateFilterLabel : getDateIndexLabel(defaultDateIndex),
				formDestinationFilterVal : 'all',
				dateHandler : null,
				sellerFilterVal : sessionSellerCode,
				clientFilterVal : '',
				clientFilterDesc : '',
				arrSorter:[],
				reportGridOrder : null,
				strDefaultMask : '000000000000000000',
				dateRangeFilterVal : '13',
				datePickerSelectedDate : [],
				preferenceHandler : null,
				strPageName : 'messageInbox'
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
				var thisRef = this;
				me.preferenceHandler = Ext.create('Ext.ux.gcp.PreferencesHandler');
				me.updateConfig();
				me.dateHandler = Ext.create( 'Ext.ux.gcp.DateHandler' );
				var date = new Date(Ext.Date.parse(dtApplicationDate, strExtApplicationDateFormat));
				$(document).on('savePreference', function(event) {
						me.handleSavePreferences(event);
				});
				$(document).on('clearPreference', function(event) {
						me.handleClearPreferences(event);
				});

				$(document).on('performReportAction', function(event, actionName) {
					me.downloadReport(actionName);
				});
				$(document).on("handleComposeNewMessage",function(){
					doChooseFormMessage(me.sellerFilterVal,me.clientFilterDesc,me.clientFilterVal);
					});

				$(document).on('performPageSettings', function(event) {
								me.showPageSettingPopup('PAGE');
					});
				me.updateFilterConfig();
				me
					.control(
					{
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
						'messageBoxView' :
						{
							beforerender : function( panel, opts )
							{
								/*if(entity_type == 1)
								{
									me.getComposeMsgId().show();
								}
								else
								{
									me.getComposeMsgId().hide();
								}*/
							},
							afterrender : function( panel, opts )
							{
							}
						},
						'messageBoxView button[itemId="composeMsgId"]' :
						{
							click : function( btn, opts )
							{
								doChooseFormMessage(me.sellerFilterVal,me.clientFilterDesc,me.clientFilterVal);
							}
						},

						'messageBoxGridView groupView' : {
								/**
								 * This is to be handled if grid model changes as per group by
								 * category. Otherewise no need to catch this event. If captured
								 * then GroupView.reconfigureGrid(gridModel) should be called
								 * with gridModel as a parameter
								 */
								'groupByChange' : function(menu, groupInfo) {
									me.doHandleGroupByChange(menu, groupInfo);
								},
								'groupTabChange' : function(groupInfo, subGroupInfo, tabPanel,
										newCard, oldCard) {
									me.disablePreferencesButton("savePrefMenuBtn",false);
									me.disablePreferencesButton("clearPrefMenuBtn",false);
									me.doHandleGroupTabChange(groupInfo, subGroupInfo,
											tabPanel, newCard, oldCard);
								},
								'gridRender' : me.handleLoadGridData,
								'gridPageChange' : me.handleLoadGridData,
								'gridSortChange' : me.handleLoadGridData,
								'gridPageSizeChange' : me.handleLoadGridData,
								'gridColumnFilterChange' : me.handleLoadGridData,
								'gridRowSelectionChange' : me.doHandleGridRowSelectionChange,
								'gridStateChange' : function(grid) {
									//me.toggleSavePrefrenceAction(true);
									me.disablePreferencesButton("savePrefMenuBtn",false);
								},
								'gridRowActionClick' : function(grid, rowIndex, columnIndex,
										actionName, record) {
									me.doHandleRowActions(actionName, grid, record,rowIndex);
								},
								'groupActionClick' : function(actionName, isGroupAction,
										maskPosition, grid, arrSelectedRecords) {
									if (isGroupAction === true)
										me.handleGroupActions(actionName, grid,
												arrSelectedRecords, 'groupAction');
							},
							'gridStoreLoad' : function(grid, store) {
								me.disableActions(false);
							},
							'gridSettingClick' : function(){
								me.showPageSettingPopup('GRID');
							}
					},
						'messageBoxGridView textfield[itemId="searchTxnTextField"]' :
						{
							change : function( btn, opts )
							{
								me.searchTrasactionChange();
							}
						},
						'messageBoxGridView radiogroup[itemId="matchCriteria"]' :
						{
							change : function( btn, opts )
							{
								me.searchTrasactionChange();
							}
						},
						'messageBoxView messageBoxGridView toolbar[itemId=messageBoxGroupActionBarView_summDtl]' :
						{
							performGroupAction : function( btn, opts )
							{
								me.handleGroupActions( btn );
							}
						},
						'messageBoxFilterView' :
						{
							render : function( panel, opts )
							{
							
								if (!Ext.isEmpty(modelSelectedMst))
											me.selectedMst = modelSelectedMst;
										var useSettingsButton = me.getFilterView()
										.down('button[itemId="useSettingsbutton"]');
										if (!Ext.isEmpty(useSettingsButton)) {
											useSettingsButton.hide();
										}
									var advFilter= me.getFilterView().down(												'label[itemId="createAdvanceFilterLabel"]');
									if (!Ext.isEmpty(advFilter)) {
										advFilter.hide();
									}
								//me.loadFormDestinationDynamicFilters();
								me.setInfoTooltip();
								//me.renderFormDestinationFilter();
								me.showHideSellerClientMenuBar(entity_type);
								
								if( !Ext.isEmpty( objGridViewPref) )
									me.toggleClearPrefrenceAction(true);
							},
							filterMessageStatus : function( btn, opts )
							{
								me.toggleSavePrefrenceAction( true );
								me.handleMessageStatusType(btn);
							},
							filterFormDestination : function( btn, opts )
							{
								me.handleFormDestinationFilter( btn, opts );
							},
							dateChange : function( btn, opts )
							{
								me.dateFilterVal = btn.btnValue;
								me.dateFilterLabel = btn.text;
								me.handleDateChange( btn.btnValue );
								if( btn.btnValue !== '7' )
								{
									me.setDataForFilter();
									me.applyQuickFilter();
									me.toggleSavePrefrenceAction( true );
								}
							},
							'handleClientChange' : function(client, clientDesc) {
								me.handleClientChange(client, clientDesc);
								if(client === 'all')
								{
									me.clientFilterVal  = '';
									me.clientFilterDesc = '';
									$('#composeNewMessage').attr('disabled',true);
								}
								else
								{
									me.clientFilterVal  = client;
									me.clientFilterDesc = clientDesc;
									$('#composeNewMessage').attr('disabled',false);
								}
								me.applySeekFilter();
							},
							afterrender : function(panel, eOpts){

								/*if(me.messageStatusFilterVal != 'All'){
									panel.highlightSavedStatus(me.messageStatusFilterVal);
								}*/
								me.updateFilterFields();
							}

						},
						'messageBoxFilterView component[itemId="messageDatePicker"]' : {
							render : function() {
								$('#entryDataPicker').datepick({
											monthsToShow : 1,
											changeMonth : true,
											dateFormat : strApplicationDefaultFormat,
											changeYear : true,
											rangeSeparator : '  '+getLabel('to','to')+'  ',
											onClose : function(dates) {
												if (!Ext.isEmpty(dates)) {
													me.datePickerSelectedDate = dates;
													me.dateFilterVal = me.dateRangeFilterVal;
													me.dateFilterLabel = getLabel('daterange', 'Date Range');
													me.handleDateChange(me.dateRangeFilterVal);
													me.setDataForFilter();
													me.applyQuickFilter();
												}
											}
								}).attr('readOnly',true);;
							}
						},
						'messageBoxFilterView toolbar[itemId="dateToolBar"]' :
						{
							afterrender : function( tbar, opts )
							{
								me.updateDateFilterView();
							}
						},
						'messageBoxView messageBoxFilterView button[itemId="goBtn"]' :
						{
							click : function( btn, opts )
							{
								var frmDate = me.getFromEntryDate().getValue();
								var toDate = me.getToEntryDate().getValue();

								if( !Ext.isEmpty( frmDate ) && !Ext.isEmpty( toDate ) )
								{
									var dtParams = me.getDateParam( '7' );
									me.dateFilterFromVal = dtParams.fieldValue1;
									me.dateFilterToVal = dtParams.fieldValue2;
									me.setDataForFilter();
									me.applyQuickFilter();
									me.toggleSavePrefrenceAction( true );
								}
							}
						},
						/*'messageBoxView messageBoxFilterView button[itemId="btnSavePreferences"]' :
						{
							click : function( btn, opts )
							{
								me.toggleSavePrefrenceAction( false );
								me.handleSavePreferences();
								me.toggleClearPrefrenceAction(true);
							}
						},*/
						'messageBoxView messageBoxFilterView button[itemId="btnClearPreferences"]' : {
							click : function(btn, opts) {
								me.toggleSavePrefrenceAction(false);
								me.handleClearPreferences();
								me.toggleClearPrefrenceAction(false);
							}
						},
						'messageBoxView messageBoxGridInformationView panel[itemId="messageBoxHeaderBarGridView"] image[itemId="summInfoShowHideGridView"]' :
						{
							click : function( image )
							{
								var objAccSummInfoBar = me.getInfoSummaryLowerPanel();
								if( image.hasCls( "icon_collapse_summ" ) )
								{
									image.removeCls( "icon_collapse_summ" );
									image.addCls( "icon_expand_summ" );
									objAccSummInfoBar.hide();
								}
								else
								{
									image.removeCls( "icon_expand_summ" );
									image.addCls( "icon_collapse_summ" );
									objAccSummInfoBar.show();
								}
							}
						},
						'messageBoxGridInformationView' :
						{
							render : this.onMessageBoxSummaryInformationViewRender
						},
						'filterView button[itemId="clearSettingsButton"]' : {
							'click' : function() {
								me.handleClearSettings();
							}
						},
						'filterView' : {
							appliedFilterDelete : function(btn){
								me.handleAppliedFilterDelete(btn);
							}
						},

						'messageBoxFilterView combo[itemId="sellerCodeID"]' :
						{
							select : function( combo, record, index )
							{
								/*var objFilterPanel = me.getSellerClientMenuBar();
								var objAutocompleter = objFilterPanel.down( 'AutoCompleter[itemId="clientCodeId"]' );
								objAutocompleter.cfgUrl = 'services/userseek/adminMsgCentrClientSeek.json';
								objAutocompleter.setValue( '' );
								objAutocompleter.cfgExtraParams = [{key : '$filtercode1', value : record[0].data.CODE }];
								me.applySeekFilter();*/
							},
							change : function( combo, record, index )
							{
								if( record == null )
								{
									//me.messageStatusFilterVal = 'All';
									me.filterApplied = 'ALL';
									me.applySeekFilter();
								}
								me.sellerFilterVal = record;
								var objFilterPanel = me.getSellerClientMenuBar();
								if(entity_type == '0')
								{
									var objAutocompleter = objFilterPanel.down( 'AutoCompleter[itemId="clientCodeId"]' );
									objAutocompleter.cfgUrl = 'services/userseek/adminMsgCentrClientSeek.json';
									objAutocompleter.setValue( '' );
									objAutocompleter.cfgExtraParams = [{key : '$sellerCode', value : record }];
								}
							}
						},
						'messageBoxFilterView AutoCompleter[itemId="clientCodeId"]' : {

							select : function( combo, record, index )
							{
								var objFilterPanel = me.getSellerClientMenuBar();
								me.clientFilterVal  = record[0].data.CODE;
								me.clientFilterDesc = record[0].data.DESCR;
								me.applySeekFilter();
							},
							change : function( combo, record, index )
							{
								if( record == null && entity_type != '1')
								{
									//me.messageStatusFilterVal = 'All';
									me.clientFilterVal  = record;
									me.clientFilterDesc = record;
									me.filterApplied = 'ALL';
									me.applySeekFilter();
								}
								me.clientFilterVal  = record;
								 me.clientFilterDesc = record;
							}
						},
						'messageBoxView messageBoxFilterView button[itemId="filterBtnId"]' : {
							click : function(btn, opts) {
								me.setDataForFilter();
								me.applyQuickFilter();
							}
						},
						'messageBoxView messageBoxTitleViewType button[itemId="loanCenterSiTabItemId"]' : {
							render : function(btn, opts) {
								me.preHandleTabPermissions(btn);
							}
						}
					} );
			},

			handleReconfigureGrid : function(data) {
				var me = this;
				var objGroupView = me.getGroupView();
				var objSummaryView = me.getMessageBoxGridRef(), gridModel = null, intPgSize = null, showPager = true, heightOption = null,objData = null;
				var colModel = null, arrCols = null;
				if (data && data.preference)
					objData = Ext.JSON.decode(data.preference)
				if (_charCaptureGridColumnSettingAt === 'L' && objData
						&& objData.gridCols) {
					arrCols = objData.gridCols;
					colModel = objSummaryView.getColumnModel(arrCols);
					if (colModel) {
						gridModel = {
							columnModel : colModel							
						}
					}
				}
				// TODO : Preferences and existing column model need to be merged
				objGroupView.reconfigureGrid(gridModel);
			},

			/*Page setting handling starts here*/
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
						cls : 't7-popup',
						icon : Ext.MessageBox.ERROR
					});
				}
			},
			applyPageSetting : function(arrPref, strInvokedFrom) {
				var me = this, args = {};
				if (!Ext.isEmpty(arrPref)) {
					if (strInvokedFrom === 'GRID'
							&& _charCaptureGridColumnSettingAt === 'L') {
						/**
						 * This handling is required for non-us market
						 */
						var groupView = me.getGroupView(), subGroupInfo = groupView
								.getSubGroupInfo()
								|| {}, objPref = {}, groupInfo = groupView
								.getGroupInfo()
								|| '{}', strModule = subGroupInfo.groupCode;
						Ext.each(arrPref || [], function(pref) {
									if (pref.module === 'ColumnSetting') {
										objPref = pref.jsonPreferences;
									}
								});
						args['strInvokedFrom'] = strInvokedFrom;
						args['objPref'] = objPref;
						strModule = strModule === 'all' ? groupInfo.groupTypeCode + '-'
								+ strModule : strModule;
						me.preferenceHandler.saveModulePreferences(me.strPageName,
								strModule, objPref, me.postHandlePageGridSetting, args,
								me, false);
					} else
						me.preferenceHandler.savePagePreferences(me.strPageName,
								arrPref, me.postHandlePageGridSetting, args, me, false);
				}
			},
			restorePageSetting : function(arrPref, strInvokedFrom) {
				var me = this;
				if (strInvokedFrom === 'GRID'
						&& _charCaptureGridColumnSettingAt === 'L') {
					var groupView = me.getGroupView(), subGroupInfo = groupView
							.getSubGroupInfo()
							|| {}, objPref = {}, groupInfo = groupView.getGroupInfo()
							|| '{}', strModule = subGroupInfo.groupCode, args = {};
					strModule = strModule === 'all' ? groupInfo.groupTypeCode + '-'
							+ strModule : strModule;
					args['strInvokedFrom'] = strInvokedFrom;
					Ext.each(arrPref || [], function(pref) {
								if (pref.module === 'ColumnSetting') {
									pref.module = strModule;
									return false;
								}
							});
					me.preferenceHandler.clearPagePreferences(me.strPageName, arrPref,
							me.postHandleRestorePageSetting, args, me, false);
				} else
					me.preferenceHandler.clearPagePreferences(me.strPageName, arrPref,
							me.postHandleRestorePageSetting, null, me, false);
			},
			postHandleRestorePageSetting : function(data, args, isSuccess) {
				if (isSuccess === 'Y') {
					var me = this;
					if (args && args.strInvokedFrom === 'GRID'
							&& _charCaptureGridColumnSettingAt === 'L') {
						var objGroupView = me.getGroupView();
						if (objGroupView)
							objGroupView.reconfigureGrid(null);
					} else
						window.location.reload();
				} else {
					Ext.MessageBox.show({
						title : getLabel('instrumentErrorPopUpTitle', 'Error'),
						msg : getLabel('errorMsg', 'Error while apply/restore setting'),
						buttons : Ext.MessageBox.OK,
						cls : 't7-popup',
						icon : Ext.MessageBox.ERROR
					});
				}
			},
			postHandlePageGridSetting : function(data, args, isSuccess) {
				if (isSuccess === 'Y') {
				var me = this;
				if (args && args.strInvokedFrom === 'GRID'
						&& _charCaptureGridColumnSettingAt === 'L') {
					var objGroupView = me.getGroupView(), gridModel = null;
					if (args.objPref && args.objPref.gridCols)
						gridModel = {
							columnModel : args.objPref.gridCols
						}
					// TODO : Preferences and existing column model need to be
					// merged
					objGroupView.reconfigureGrid(gridModel);
				} else				
					window.location.reload();
				} else {
					Ext.MessageBox.show({
								title : getLabel('instrumentErrorPopUpTitle', 'Error'),
								msg : getLabel('errorMsg',
										'Error while apply/restore setting'),
								buttons : Ext.MessageBox.OK,
								cls : 't7-popup',
								icon : Ext.MessageBox.ERROR
							});
				}
			},
			showPageSettingPopup : function(strInvokedFrom) {
				var me = this, objData = {}, objGroupView = me.getGroupView(), objPrefData, objGeneralSetting, objGridSetting, objColumnSetting;
				var objGroupByVal = '', objDefaultFilterVal = '', objGridSizeVal = '', objRowPerPageVal = _GridSizeTxn, strTitle = null, subGroupInfo;

				me.pageSettingPopup = null;

				if (!Ext.isEmpty(objGridViewPref)) {
					objPrefData = Ext.decode(objGridViewPref);
					objGeneralSetting = objPrefData && objPrefData.d.preferences
							&& objPrefData.d.preferences.GeneralSetting
							? objPrefData.d.preferences.GeneralSetting
							: null;
					objGridSetting = objPrefData && objPrefData.d.preferences
							&& objPrefData.d.preferences.GridSetting
							? objPrefData.d.preferences.GridSetting
							: null;
					/**
					 * This default column setting can be taken from
					 * preferences/gridsets/uder defined( js file)
					 */
					objColumnSetting = objPrefData && objPrefData.d.preferences
							&& objPrefData.d.preferences.ColumnSetting
							&& objPrefData.d.preferences.ColumnSetting.gridCols
							? objPrefData.d.preferences.ColumnSetting.gridCols
							:(MSGINBOX_GENERIC_COLUMN_MODEL || '[]');

					if (!Ext.isEmpty(objGeneralSetting)) {
						objGroupByVal = objGeneralSetting.defaultGroupByCode;
						objDefaultFilterVal = objGeneralSetting.defaultFilterCode;
					}
					if (!Ext.isEmpty(objGridSetting)) {
						objGridSizeVal = objGridSetting.defaultGridSize;
						objRowPerPageVal = objGridSetting.defaultRowPerPage;
					}
				}
				objGroupView.cfgShowAdvancedFilterLink= false;
				objData["groupByData"] = objGroupView
						? objGroupView.cfgGroupByData
						: [];
				objData["filterUrl"] = 'services/userfilterslist/' +me.strPageName;
				objData["rowPerPage"] = _AvailableGridSize;
				objData["groupByVal"] = objGroupByVal;
				objData["filterVal"] = objDefaultFilterVal;
				objData["gridSizeVal"] = objGridSizeVal;
				objData["rowPerPageVal"] = objRowPerPageVal;
				subGroupInfo = objGroupView.getSubGroupInfo() || {};
				strTitle = (strInvokedFrom === 'GRID' ? getLabel("columnSettings",
				"Column Settings") + ' : ' + (subGroupInfo.groupDescription||'') : getLabel("Settings", "Settings"));
				me.pageSettingPopup = Ext.create('Ext.ux.gcp.PageSettingPopUp', {
							cfgPopUpData : objData,
							cfgGroupView : objGroupView,
							cfgDefaultColumnModel : objColumnSetting,
							cfgInvokedFrom : strInvokedFrom,
							title : strTitle/*,
							cfgViewOnly : _IsEmulationMode*/
						});
				me.pageSettingPopup.show();
				me.pageSettingPopup.center();
			},
			/* Applied Filters handling starts here */
					handleAppliedFilterDelete : function(btn) {
						var me = this;
						var objData = btn.data;
						var quickJsonData = me.filterData;
						if (!Ext.isEmpty(objData)) {
							var paramName = objData.paramName || objData.field;
							reqJsonInQuick = me.findInQuickFilterData(quickJsonData, paramName);
							if (!Ext.isEmpty(reqJsonInQuick)) {
								arrQuickJson = quickJsonData;
								arrQuickJson = me.removeFromQuickArrJson(arrQuickJson,
										paramName);
								me.filterData = arrQuickJson;
							}
							me.resetFieldInQuickFilterOnDelete(objData);
							me.refreshData();
						}
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
					resetFieldInQuickFilterOnDelete : function(objData) {
						var me = this, strFieldName;
						var clientFilterId;
						var messageBoxFilterView = me.getMessageBoxFilterView();
						if (!Ext.isEmpty(objData))
							strFieldName = objData.paramName || objData.field;
						
						if (strFieldName ==='MessageDate') {
							var datePickerRef = $('#entryDataPicker');
							var toDatePickerRef = $('#entryDataToPicker');
							me.dateFilterVal = defaultDateIndex;
							me.dateFilterLabel = getDateIndexLabel(defaultDateIndex);
							datePickerRef.val('');
							toDatePickerRef.val('');
							me.handleDateChange(me.dateFilterVal);
							me.filterApplied = 'Q';
						}
						if(strFieldName === 'clientCode'){
						clientFilterId=messageBoxFilterView.down('combo[itemId="clientBtn"]');
						me.clientFilterDesc='';
						me.clientFilterVal='';
						clientFilterId.setRawValue(getLabel('allCompanies', 'All companies'));
					}
				},
	/* Applied Filters handling ends here */

				handleClearSettings:function(){
					var me=this;
					var messageBoxFilterView = me.getMessageBoxFilterView();
					var objGroupView = me.getGroupView();
					var clientFilterId;
					if(entity_type != '1')
					{
							clientFilterId=messageBoxFilterView.down('AutoCompleter[itemId="clientCodeId1"]');
							me.clientFilterVal  = '';
							me.clientFilterDesc = '';
							clientFilterId.setValue(me.clientFilterDesc);
							clientFilterId.suspendEvents();
							clientFilterId.reset();
							clientFilterId.resumeEvents();
					}else{
						clientFilterId=messageBoxFilterView.down('combo[itemId="clientBtn"]');
						me.clientFilterDesc=getLabel('allCompanies', 'All companies');
						me.clientFilterVal='all';
						clientFilterId.setRawValue(getLabel('allCompanies', 'All companies'));
					}
					me.dateFilterVal = defaultDateIndex;
					me.dateFilterLabel = getDateIndexLabel(defaultDateIndex);
					me.handleDateChange(me.dateFilterVal);
					me.filterApplied = 'Q';
					me.clientFilterDesc='';
					me.clientFilterVal='';
					/*if(client_count >1){
						$("#summaryClientFilterSpan").text('All Companies');
					}
					$("#summaryClientFilter").val('');	*/
					me.filterData=[];
					me.setDataForFilter();
					objGroupView.refreshData();
			   },
			handleClientChange : function(client, clientDesc) {
				var me = this;
			},

			handleMessageStatusType : function( btn )
			{
				var me = this;
				me.toggleSavePrefrenceAction( true );
				me.getMessageInboxStatusToolBar().items.each( function( item )
				{
					item.removeCls( 'xn-custom-heighlight' );
					item.addCls( 'xn-account-filter-btnmenu' );
				} );
				btn.addCls( 'xn-custom-heighlight xn-account-filter-btnmenu' );
				me.messageStatusFilterVal = btn.btnValue;
				me.messageStatusFilterDesc = btn.btnDesc;
				me.setDataForFilter();
				me.filterApplied = 'Q';
				me.applyQuickFilter();
			},
		    updateFilterFields:function(){
				var me=this;
				var clientCodesFltId;
				var messageBoxFilterView = me.getMessageBoxFilterView();
				if (entity_type !='1') {
					clientCodesFltId = messageBoxFilterView.down('combobox[itemId=clientAutoCompleter]');
					if(undefined != me.clientCode && me.clientCode != ''){
						clientCodesFltId.suspendEvents();
						clientCodesFltId.setValue(me.clientFilterDesc);
						clientCodesFltId.resumeEvents();
					}else{
						me.clientFilterDesc = 'all';
					}

				} else {
					clientCodesFltId = messageBoxFilterView.down('combo[itemId="clientBtn"]');
					if(undefined != me.clientFilterVal && me.clientFilterVal != ''  && me.clientFilterDesc != ''){
						clientCodesFltId.setRawValue(me.clientFilterDesc);
					}
					else{
						clientCodesFltId.setRawValue(getLabel('allCompanies', 'All Companies'));
						me.clientFilterDesc = 'all';
					}
				}

				me.handleDateChange(me.dateFilterVal);
			},

			setGridInfo : function( grid )
			{
				var me = this;
				var objGroupView = me.getGroupView();
				var grid = objGroupView.getGrid();
				var summaryData;
				var dataStore=grid.getStore();
				dataStore.on( 'load', function( store, records)
				{
					var i = records.length - 1;
					if( i >= 0 )
					{
						summaryData=[{
							title:getLabel('totalMsgSum'," Total Messages"),
							amount:records[ i ].get( 'totalMsgSum' )
						},{
							title:getLabel('unreadMsgSum'," Unread Messages"),
							amount:records[ i ].get( 'unreadMsgSum' )
						}]
					}
					else
					{
						 summaryData=[{
							title:getLabel('lbl.totalMsgSum'," Total Messages"),
							amount:"# 0"
						},{
							title:getLabel('lbl.unreadMsgSum'," Unread Messages"),
							amount:"# 0"
						}]
					}
				} );
			},
			getFilterUrl : function(subGroupInfo, groupInfo)
			{
				var me = this;
				var strQuickFilterUrl = '', strUrl = '', isFilterApplied = 'false';
				var strGroupQuery = (subGroupInfo && subGroupInfo.groupQuery)
									? subGroupInfo.groupQuery
									: '';
				strQuickFilterUrl = me.generateUrlWithQuickFilterParams( this );
				if( me.filterApplied === 'ALL' || me.filterApplied === 'Q' )
				{
					strUrl += strQuickFilterUrl;
					
					if (!Ext.isEmpty(strGroupQuery)) {
						if (!Ext.isEmpty(strUrl))
							strUrl += ' and ' + strGroupQuery;
						else
							strUrl += '&$filter=' + strGroupQuery;
					}
					return strUrl;
				}

			},
			generateUrlWithQuickFilterParams : function( thisClass )
			{
				var me = this;
				var filterData = thisClass.filterData;
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
						case 'bt':
							if( filterData[ index ].dataType === 'D' )
							{
								strTemp = strTemp + filterData[ index ].paramName + ' '
									+ filterData[ index ].operatorValue + ' ' + 'date\''
									+ filterData[ index ].paramValue1 + '\'' + ' and ' + 'date\''
									+ filterData[ index ].paramValue2 + '\'';
							}
							else
							{
								strTemp = strTemp + filterData[ index ].paramName + ' '
									+ filterData[ index ].operatorValue + ' ' + '\'' + filterData[ index ].paramValue1
									+ '\'' + ' and ' + '\'' + filterData[ index ].paramValue2 + '\'';
							}
							break;
						default:
							// Default opertator is eq
							if( filterData[ index ].dataType === 'D' )
							{
								strTemp = strTemp + filterData[ index ].paramName + ' '
									+ filterData[ index ].operatorValue + ' ' + 'date\''
									+ filterData[ index ].paramValue1 + '\'';
							}
							else
							{
								strTemp = strTemp + filterData[ index ].paramName + ' '
									+ filterData[ index ].operatorValue + ' ' + '\'' + filterData[ index ].paramValue1
									+ '\'';
							}
							break;
					}
					isFilterApplied = true;
				}
				if( isFilterApplied )
					strFilter = strFilter + strTemp;
				else
					strFilter = '';
				if(entity_type =='0')
				{
					if(me.formDestinationFilterVal == 'STATUS_P')
					{
						strFilter =  strFilter + '&$showPersonalMsg=Y';
					}
				}
				return strFilter;
			},

			getMessageBoxConfiguration : function()
			{
				var me = this;
				var objConfigMap = null;
				var objWidthMap = null;
				var arrColsPref = null;
				var storeModel = null;
				var expVal = null;
				if( !Ext.isEmpty( objGridViewPref ) )
				{
					var data = Ext.decode( objGridViewPref );
					var objPref = data[ 0 ];
					me.arrSorter = objPref.sortState;
				}
				if(entity_type === '0' || client_count > 1)
				{
					expVal = '0'
						objWidthMap =
						{
							"clientDesc" : 150,
							"sentDateTxt" : 200,
							"subject" : 200,
							"trackingNo" : 200,
							"fromUser" : 200,
							"messageStatusDesc" : 200
						};
				}
				else
				{
					expVal = '1'
						objWidthMap =
						{
							"sentDateTxt" : 200,
							"subject" : 200,
							"trackingNo" : 200,
							"fromUser" : 200,
							"messageStatusDesc" : 200
						};
				}

				switch (expVal)
				{
					case '0' :
						arrColsPref =
							[
								{
									"colId" : "clientDesc",
									"colHeader" : "Company Name"
								},
								{
									"colId" : "sentDateTxt",
									"colHeader" : "Message Date Time"
								},
								{
									"colId" : "subject",
									"colHeader" : "Subject"
								},
								{
									"colId" : "trackingNo",
									"colHeader" : "Ref #"
								},
								{
									"colId" : "fromUser",
									"colHeader" : "From"
								},
								{
									"colId" : "messageStatusDesc",
									"colHeader" : "Replied"
								}
							];
						break;
					case '1' :
						arrColsPref =
							[
								{
									"colId" : "sentDateTxt",
									"colHeader" : "Message Date Time"
								},
								{
									"colId" : "subject",
									"colHeader" : "Subject"
								},
								{
									"colId" : "trackingNo",
									"colHeader" : "Ref #"
								},
								{
									"colId" : "fromUser",
									"colHeader" : "From"
								},
								{
									"colId" : "messageStatusDesc",
									"colHeader" : "Replied"
								}
							];
						break;
				}
				storeModel =
				{
					fields :
					[
						'sentDateTxt','makerStamp', 'subject', 'trackingNo', 'repliedBy', 'messageStatus', 'messageStatusDesc', 'identifier',
						'__metadata', 'totalMsgSum', 'unreadMsgSum','fromUser','formCode','formType','reply','messageRead',
						'recordKeyNo','clientDesc'
					],
					proxyUrl : 'getMessageInBoxList.srvc',
					rootNode : 'd.inbox',
					sortState : me.arrSorter,
					totalRowsNode : 'd.__count'
				};
				objConfigMap =
				{
					"objWidthMap" : objWidthMap,
					"arrColsPref" : arrColsPref,
					"storeModel" : storeModel
				};
				return objConfigMap;
			},
			doHandleGroupByChange : function(menu, groupInfo) {
					var me = this;
					if (me.previouGrouByCode === 'ADVFILTER') {
						me.savePrefAdvFilterCode = null;
						me.showAdvFilterCode = null;
						me.filterApplied = 'ALL';
					}
					if (groupInfo && groupInfo.groupTypeCode === 'ADVFILTER') {
			//			me.previouGrouByCode = groupInfo.groupTypeCode;
					} 
			//			me.previouGrouByCode = null;
				},
				doHandleGroupTabChange : function(groupInfo, subGroupInfo, tabPanel,
						newCard, oldCard) {
					var me = this;
					var objGroupView = me.getGroupView();
					var strModule = '', strUrl = null, args = null;
					groupInfo = groupInfo || {};
					subGroupInfo = subGroupInfo || {};
					if (groupInfo && groupInfo.groupTypeCode) {

							me.formDestinationFilterVal = subGroupInfo.groupCode;

					strModule = subGroupInfo.groupCode;
						args = {
							'module' : strModule
						};
						me.preferenceHandler.readModulePreferences(me.strPageName,
								strModule, me.postHandleDoHandleGroupTabChange, args, me, true);
					} else {
						objGroupView.reconfigureGrid(null);
					}
				},
			postHandleDoHandleGroupTabChange : function(data, args) {
				var me=this;
				var objGroupView = me.getGroupView();
				var objSummaryView = me.getMessageBoxGridRef(), arrSortState = new Array(), objPref = null, gridModel = null, intPgSize = null, showPager = true;
				var colModel = null, arrCols = null;

				if (data && data.preference) {
					objPref = Ext.decode(data.preference);
					if(objPref != null){
					arrCols = objPref.gridCols || null;
					intPgSize = objPref.pgSize || _GridSizeTxn;
					showPager = objPref.gridSetting
							&& !Ext.isEmpty(objPref.gridSetting.showPager)
							? objPref.gridSetting.showPager
							: true;
					heightOption = objPref.gridSetting
					&& !Ext.isEmpty(objPref.gridSetting.heightOption)
					? objPref.gridSetting.heightOption
					: null;
					colModel = objSummaryView.getColumnModel(arrCols);
					arrSortState = objPref.sortState;
					if (colModel) {
						gridModel = {
							columnModel : colModel,
							pageSize : intPgSize,
							showPagerForced : showPager,
							heightOption : heightOption,
							showCheckBoxColumn : true,
							storeModel : {
								sortState : arrSortState
							}
						};
					}
				}
				}else {
					gridModel = {
						showCheckBoxColumn : true
					};
				}

				objGroupView.reconfigureGrid(gridModel);

				},
			handleLoadGridData : function(groupInfo, subGroupInfo,grid, url, pgSize, newPgNo, oldPgNo, sorter,filterData)
			{
				var me = this;
				var strUrl = grid.generateUrl( url, pgSize, newPgNo, oldPgNo, sorter );
				var arrOfParseQuickFilter = [];
				me.setDataForFilter();
				strUrl = strUrl + me.getFilterUrl(subGroupInfo, groupInfo) + "&" + csrfTokenName + "=" + csrfTokenValue;
				me.disableActions(true); 
				//grid.loadGridData( strUrl, null );
				me.reportGridOrder = strUrl;
				grid.loadGridData(strUrl, null, null, false);
				me.setGridInfo(grid);
				objMainGrid = grid;
				var paramName = 'sellerCode';
				var reqJsonInQuick = me.findInQuickFilterData(me.filterData, paramName);
				if (!Ext.isEmpty(reqJsonInQuick)) {
					var arrQuickJson = me.filterData;
					me.filterData = me.removeFromQuickArrJson(me.filterData,paramName);
				}
								
				if(client_count == 1){
				var paramName = 'clientCode';
				var reqJsonInQuick = me.findInQuickFilterData(me.filterData, paramName);
					if (!Ext.isEmpty(reqJsonInQuick)) {
						var arrQuickJson = me.filterData;
						me.filterData = me.removeFromQuickArrJson(me.filterData,paramName);
					}
				}
			
				if(!Ext.isEmpty(me.filterData)){
					if(!Ext.isEmpty(me.filterData) && me.filterData.length >= 1){
						arrOfParseQuickFilter = generateFilterArray(me.filterData);
					}
				}

				if(arrOfParseQuickFilter) {
					me.getFilterView().updateFilterInfo(arrOfParseQuickFilter);
				}

				grid.on('cellclick', function(tableView, td, cellIndex, record, tr, rowIndex, e) {
					var clickedColumn = tableView.getGridColumns()[cellIndex];
					var columnType = clickedColumn.colType;
					if(Ext.isEmpty(columnType)) { 
						var containsCheckboxCss = (clickedColumn.cls.indexOf('x-column-header-checkbox') > -1)
						columnType = containsCheckboxCss ? 'checkboxColumn' : '';
					}
					me.handleGridRowClick(record, grid, columnType);
				});
				if("Y"==strComposeMsg)
				{
					doChooseFormMessage(me.sellerFilterVal,me.clientFilterDesc,me.clientFilterVal);
				}
			},
			
	handleGridRowClick : function(record, grid, columnType) {
		if(columnType !== 'actioncontent' && columnType !== 'checkboxColumn') {
			var me = this;
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
				me.doHandleRowActions(arrVisibleActions[0].itemId, grid, record);
			}
		} else {
		}
	},			
			setDataForFilter : function()
			{
				var me = this;
			//	me.getSearchTxnTextInput().setValue( '' );
				if( this.filterApplied === 'Q' || this.filterApplied === 'ALL' )
				{
					this.filterData = this.getQuickFilterQueryJson();
				}
			},
			applyQuickFilter : function()
			{
				var me = this;
				 var objGroupView = me.getGroupView();
				 objGroupView.refreshData();
				// me.getMessageBoxGrid().refreshData();
			},
			refreshData : function() {
				var me = this;
				var objGroupView = me.getGroupView();
				var grid = objGroupView.getGrid();
				if (grid) {
					/*if (!Ext.isEmpty(me.advSortByData)) {
						appliedSortByJson = me.getSortByJsonForSmartGrid();
						grid.removeAppliedSort();
						grid.applySort(appliedSortByJson);
					} else {
						grid.removeAppliedSort();
					}*/
				}
				grid.removeAppliedSort();
				objGroupView.refreshData();
			},
			getQuickFilterQueryJson : function()
			{
				var me = this;
				var jsonArray = [],sellerCodeValue='';
				var index = me.dateFilterVal;
				var messageInboxStatusFilterVal = me.messageStatusFilterVal;
				var objDateParams = me.getDateParam( index );
				//if(index != '12')
				//{
					jsonArray.push(
						{
							//paramName : me.getMessageDate().filterParamName,
							paramName : 'MessageDate',
							paramValue1 : objDateParams.fieldValue1,
							paramValue2 : objDateParams.fieldValue2,
							operatorValue : objDateParams.operator,
							paramIsMandatory : true,
							dataType : 'D',
							paramFieldLable : getLabel('msgDate', 'Message Date'),
                       		//displayType : 5,
                        	displayValue1 :  objDateParams.fieldValue1
						} );
				//}
				if( messageInboxStatusFilterVal != null && messageInboxStatusFilterVal != 'All' )
				{
					jsonArray.push(
					{
						paramName : me.getMessageInboxStatusToolBar().filterParamName,
						paramValue1 : encodeURIComponent(messageInboxStatusFilterVal.replace(new RegExp("'", 'g'), "\''")),
						operatorValue : 'eq',
						dataType : 'S',
						//paramFieldLable : getLabel('msgDate', 'Message Date'),
                        displayType : 5,
                        displayValue1 :  messageInboxStatusFilterVal
					} );
				}
				if(entity_type==0)
				{	
					if( me.formDestinationFilterVal != null && me.formDestinationFilterVal != 'all' )
					{
						if(me.formDestinationFilterVal != 'STATUS_P')
						{
							jsonArray.push(
							{
								paramName : 'formDestination',
								paramValue1 : encodeURIComponent(me.formDestinationFilterVal.replace(new RegExp("'", 'g'), "\''")),
								operatorValue : 'eq',
								dataType : 'S'
							} );
						}	
					}
				}
				var objOfCreateNewFilter = me.getSellerClientMenuBar();
				
				if(Ext.isEmpty(objOfCreateNewFilter))
				{
					sellerCodeValue = sessionSellerCode;
				}
				if (!Ext.isEmpty(objOfCreateNewFilter)){
					var sellerCode = objOfCreateNewFilter.down('combo[itemId="sellerCodeID"]');
					if (!Ext.isEmpty(sellerCode)) 
					{
						 sellerCodeValue = objOfCreateNewFilter.down('combo[itemId="sellerCodeID"]').getValue();
					}
				}
						if (!Ext.isEmpty(sellerCodeValue) && sellerCodeValue !== null) 
						{
							jsonArray.push({
								    paramName : 'sellerCode',
								    operatorValue : 'eq',
									paramValue1 : encodeURIComponent(sellerCodeValue.replace(new RegExp("'", 'g'), "\''")),
									dataType :'S',
									paramFieldLable : getLabel('seller','Financial Institution'),
                       				displayType : 5,
                        			displayValue1 :  sellerCodeValue
							});
							me.sellerFilterVal = sellerCodeValue;
						}
					
					/*
					var clientCode = objOfCreateNewFilter.down('AutoCompleter[itemId="clientCodeId"]');
					if (!Ext.isEmpty(clientCode)) 
					{
						var clientCodeCalue = objOfCreateNewFilter.down('AutoCompleter[itemId="clientCodeId"]').getValue();
						if (!Ext.isEmpty(clientCodeCalue) && clientCodeCalue !== null) 
						{
							jsonArray.push({
									paramName : 'clientCode',
									operatorValue : 'eq',
									paramValue1 : clientCodeCalue,
									dataType :'S'
							});
							me.clientFilterVal = clientCodeCalue;
						}
					}*/
					if (!Ext.isEmpty(me.clientFilterVal) &&  me.clientFilterVal !== null) 
					{
						jsonArray.push({
								paramName : 'clientCode',
								operatorValue : 'eq',
								paramValue1 : encodeURIComponent(me.clientFilterVal.replace(new RegExp("'", 'g'), "\''")),
								dataType :'S',
								paramFieldLable : getLabel('company', 'Company Name'),
                       			displayType : 5,
                        		displayValue1 :  me.clientFilterDesc
						});
						//me.clientFilterVal = clientCodeCalue;
					}
				
				return jsonArray;
			},
			doHandleRowActions : function(actionName, grid, record,rowIndex)
			{
				var me = this;
				var objGroupView = me.getGroupView();
				if( actionName === 'delete' || actionName === 'markUnRead' )
					me.handleGroupActions( actionName, grid, record, 'rowAction' );
				else if( actionName === 'btnView' )
				{
					viewResponseMessage(record,'Inbox');
					//objGroupView.refreshData();
				}
				else if( actionName === 'btnReply')
				{
					doReplyMessage(record,null);				
					//objGroupView.refreshData();
				}
				else if( actionName === 'btnReplyResolve')
				{
					doReplyAndResolveMessage(record,'N');				
					//objGroupView.refreshData();
				}
				else if( actionName === 'btnResolve')
				{
					doReplyAndResolveMessage(record,'Y');				
					//objGroupView.refreshData();
				}
				else if( actionName === 'btnReassign')
				{
					doReAssignMessage(record);				
					//objGroupView.refreshData();
				}					
			},
				
			doHandleGridRowSelectionChange : function(groupInfo, subGroupInfo, objGrid,
			objRecord, intRecordIndex, arrSelectedRecords, jsonData) {
					var me = this;
										
					var objGroupView = me.getGroupView();
					var buttonMask = me.strDefaultMask;
					
					var maskArray = new Array(), actionMask = '', objData = null;;

					if (!Ext.isEmpty(jsonData) && !Ext.isEmpty(jsonData.d.__buttonMask)) {
						buttonMask = jsonData.d.__buttonMask;
					}
					var isSameUser = true;
					var isDisabled = false;
					var isSubmit = false;
					var blnEnableUnreadBtn = true;
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
						if(objData.raw.messageRead == 'Y' && blnEnableUnreadBtn)
						{
							blnEnableUnreadBtn = true; 
						}
						else
						{
							blnEnableUnreadBtn = false; 
						}
					}
					actionMask = doAndOperation(maskArray, 13);
					me.enableDisableGroupActions(actionMask, isSameUser, isDisabled,
							isSubmit,blnEnableUnreadBtn);
			},
			enableValidActionsForGrid : function( grid, record, recordIndex, selectedRecords, jsonData )
			{
				var me = this;
				var buttonMask = '0000000';
				var maskArray = new Array(), actionMask = '', objData = null;

				if( !Ext.isEmpty( jsonData ) && !Ext.isEmpty( jsonData.d.__buttonMask ) )
				{
					buttonMask = jsonData.d.__buttonMask;
				}
				var isSameUser = true;
				maskArray.push( buttonMask );
				for( var index = 0 ; index < selectedRecords.length ; index++ )
				{
					objData = selectedRecords[ index ];
					maskArray.push( objData.get( '__metadata' ).__rightsMap );
					if( objData.raw.makerId === USER )
					{
						isSameUser = false;
					}
				}
				actionMask = doAndOperation( maskArray, 13 );
				me.enableDisableGroupActions( actionMask, isSameUser );
			},

			searchTrasactionChange : function()
			{
				var me = this;
				var searchValue = me.getSearchTxnTextInput().value;
				var anyMatch = me.getMatchCriteria().getValue();
				if( 'anyMatch' === anyMatch.searchOnPage )
				{
					anyMatch = false;
				}
				else
				{
					anyMatch = true;
				}

				var grid = me.getMessageBoxGrid();

				grid.view.refresh();

				// detects html tag
				var tagsRe = /<[^>]*>/gm;
				// DEL ASCII code
				var tagsProtect = '\x0f';
				// detects regexp reserved word
				var regExpProtect = /\\|\/|\+|\\|\.|\[|\]|\{|\}|\?|\$|\*|\^|\|/gm;

				if( searchValue !== null )
				{
					searchRegExp = new RegExp( searchValue, 'g' + ( anyMatch ? '' : 'i' ) );

					if( !Ext.isEmpty( grid ) )
					{
						var store = grid.store;

						store.each( function( record, idx )
						{
							var td = Ext.fly( grid.view.getNode( idx ) ).down( 'td' ), cell, matches, cellHTML;
							while( td )
							{
								cell = td.down( '.x-grid-cell-inner' );
								matches = cell.dom.innerHTML.match( tagsRe );
								cellHTML = cell.dom.innerHTML.replace( tagsRe, tagsProtect );

								if( cellHTML === '&nbsp;' )
								{
									td = td.next();
								}
								else
								{
									// populate indexes
									// array, set
									// currentIndex, and
									// replace
									// wrap matched
									// string in a span
									cellHTML = cellHTML.replace( searchRegExp, function( m )
									{
										return '<span class="xn-livesearch-match">' + m + '</span>';
									} );
									// restore protected
									// tags
									Ext.each( matches, function( match )
									{
										cellHTML = cellHTML.replace( tagsProtect, match );
									} );
									// update cell html
									cell.dom.innerHTML = cellHTML;
									td = td.next();
								}
							}
						}, me );
					}
				}
			},
			
			handleGroupActions : function(strAction, grid, arrSelectedRecords,strActionType)
			{
				var me = this;				
				var strUrl = Ext.String.format( 'MessageInbox/{0}.srvc?',strAction );
				strUrl= strUrl+ csrfTokenName + "=" + csrfTokenValue;
				this.preHandleGroupActions(strUrl, '',  grid, arrSelectedRecords,
								strActionType, strAction);
			},
			preHandleGroupActions : function(strUrl, remark, grid, arrSelectedRecords,
								strActionType, strAction) 
			{
				var me = this;
				var groupView = me.getGroupView();
				//var grid = this.getMessageBoxGrid();
				
				if( !Ext.isEmpty( groupView ) )
				{
					var arrayJson = new Array();
					var records = (arrSelectedRecords || []);
				/*	records = ( !Ext.isEmpty( records ) && Ext.isEmpty( record ) ) ? records :
					[
						record
					];*/
					if(records.length){
						for( var index = 0 ; index < records.length ; index++ )
						{
							arrayJson.push(
							{
								serialNo : grid.getStore().indexOf( records[ index ] ) + 1,
								identifier : records[ index ].data.identifier,
								userMessage : remark
							} );
						}
					}else if(records.data){
							arrayJson.push(
									{
										serialNo : grid.getStore().indexOf(records) + 1,
										identifier : records.data.identifier,
										userMessage : remark
									} );
					}
					if( arrayJson )
						arrayJson = arrayJson.sort( function( valA, valB )
						{
							return valA.serialNo - valB.serialNo
						} );
					Ext.Ajax.request(
					{
						url : strUrl,
						method : 'POST',
						jsonData : Ext.encode( arrayJson ),
						success : function( response )
						{
							var successFlag = 'Y';
							if(response.responseText){
								var data = JSON.parse(response.responseText);
								successFlag = data.d.instrumentActions[0].success; 
							}
							if (successFlag == 'N') {
								var errMsg = "";
								Ext.MessageBox.show(
								{
									title : getLabel( 'messageErrorPopUpTitle', 'Error' ),
									msg : data.d.instrumentActions[0].errors[0].errorMessage,
									buttons : Ext.MessageBox.OK,
									cls : 'ux_popup',
									icon : Ext.MessageBox.ERROR
								} );
							}
							if (successFlag == 'Y')
								{
								me.enableDisableGroupActions( '0000000', true );
								groupView.refreshData();
								}
							
							
						},
						failure : function()
						{
							var errMsg = "";
							Ext.MessageBox.show(
							{
								title : getLabel( 'messageErrorPopUpTitle', 'Error' ),
								msg : getLabel( 'messageErrorPopUpMsg', 'Error while fetching data..!' ),
								buttons : Ext.MessageBox.OK,
								cls : 'ux_popup',
								icon : Ext.MessageBox.ERROR
							} );
						}
					} );
				}

			},
		
			isRowMoreMenuVisible : function( store, record, jsonData, itmId, menu )
			{
				var me = this;
				if( !Ext.isEmpty( record.get( 'isEmpty' ) ) && record.get( 'isEmpty' ) === true )
					return false;
				var arrMenuItems = null;
				var isMenuVisible = false;
				var blnRetValue = true;
				if( !Ext.isEmpty( menu.items ) && !Ext.isEmpty( menu.items.items ) )
					arrMenuItems = menu.items.items;

				if( !Ext.isEmpty( arrMenuItems ) )
				{
					for( var a = 0 ; a < arrMenuItems.length ; a++ )
					{
						blnRetValue = me.isRowIconVisible( store, record, jsonData, itmId,
							arrMenuItems[ a ].maskPosition );
						isMenuVisible = ( isMenuVisible || blnRetValue ) ? true : false;
					}
				}
				return isMenuVisible;
			},
			enableDisableGroupActions : function(actionMask, isSameUser, isDisabled,
					isSubmitted,blnEnableUnreadBtn)
			{
				var me=this;
				var objGroupView = me.getGroupView();
				var actionBar = objGroupView.down('toolbar[itemId="groupActionToolBar"]');
				//var actionBar = this.getActionBarSummDtl();
				var blnEnabled = false, strBitMapKey = null, arrItems = new Array();
				if( !Ext.isEmpty( actionBar ) && !Ext.isEmpty( actionBar.items.items ) )
				{
					arrItems = actionBar.items.items;
					Ext.each( arrItems, function( item )
					{
						strBitMapKey = parseInt( item.maskPosition,10 ) - 1;
						if( strBitMapKey )
						{
							blnEnabled = isActionEnabled( actionMask, strBitMapKey );
							if( ( item.maskPosition === 6 && blnEnabled ) )
							{
								blnEnabled = blnEnabled && isSameUser;
							}
							else if( item.maskPosition === 7 && blnEnabled )
							{
								blnEnabled = blnEnabled && isSameUser;
							}
							else if( item.maskPosition === 4 && blnEnabled )
							{
								blnEnabled = blnEnabled && blnEnableUnreadBtn;
							}							
							item.setDisabled( !blnEnabled );
						}
					} );
				}
			},
			
		
			setInfoTooltip : function()
			{
				var me = this;
				var infotip = Ext.create( 'Ext.tip.ToolTip',
				{
					target : 'imgFilterInfoGridView',
					listeners :
					{
						beforeshow : function( tip )
						{
							var messageStatusVal = '';
							var dateFilter = me.dateFilterLabel;

							if( me.messageStatusFilterVal == 'All' && me.filterApplied == 'ALL' )
							{
								messageStatusVal = 'All';
							}
							else
							{
								messageStatusVal = me.messageStatusFilterDesc;
							}

							tip.update( 'Type' + ' : ' + messageStatusVal + '<br/>' + getLabel( 'date', 'Date' )
								+ ' : ' + dateFilter );
						}
					}
				} );
			},
			loadFormDestinationDynamicFilters : function()
			{
				var me = this;
				var formDestinationFilterActionToolBarRef = me.getFormDestinationFilterActionToolBarRef();
				var moreFormDestinationRef = me.getMoreFormDestinationRef();
				var baseItem;
				var moreItem;

				for( var i = 0 ; i < formDestinationList.length ; i++ )
				{
					if( i < 1 )
					{
						baseItem =
						{
							text : formDestinationList[ i ][ 1 ],
							btnId : 'btnItem_' + formDestinationList[ i ][ 0 ],
							btnValue : formDestinationList[ i ][ 0 ],
							parent : this,
							cls : 'f13 xn-custom',
							handler : function( btn, opts )
							{
								me.handleFormDestinationFilter( btn, opts );
							}
						};
						formDestinationFilterActionToolBarRef.insert( i + 2, baseItem );
					}
					else
					{
						moreItem =
						{
							text : formDestinationList[ i ][ 1 ],
							btnId : 'btnItem_' + formDestinationList[ i ][ 0 ],
							btnValue : formDestinationList[ i ][ 0 ],
							parent : this,
							handler : function( btn, opts )
							{
								me.handleFormDestinationFilter( btn, opts );
							}
						};
						moreFormDestinationRef.menu.add( moreItem );
					}
				}
			},
			handleFormDestinationFilter : function( btn, opts )
			{
				var me = this;
				me.toggleSavePrefrenceAction( true );
				me.getFormDestinationFilterActionToolBarRef().items.each( function( item )
				{
					item.removeCls( 'f13 xn-custom-heighlight' );
					item.addCls( 'f13 xn-custom' );
				} );
				me.getMoreFormDestinationRef().menu.items.each( function( item )
				{
					item.removeCls( 'f13 xn-custom-heighlight' );
					item.addCls( 'f13 xn-custom' );
				} );
				btn.addCls( 'f13 xn-custom-heighlight' );
				me.formDestinationFilterVal = btn.btnValue;
				me.setDataForFilter();
				me.filterApplied = 'Q';
				me.applyQuickFilter();
			},
			renderFormDestinationFilter : function()
			{
				var me = this;
				var temp = me.filterData;
				var cnt = 0 ;
				var formDestinationFilterActionToolBarRef = me.getFormDestinationFilterActionToolBarRef();
				var moreFormDestinationRef = me.getMoreFormDestinationRef();

				if( temp.length > 0 )
				{
					for(var i=0; i< temp.length ; i++ )
					{
						if(temp[ cnt ].paramName === 'formDestination' && temp[ cnt ].paramValue1 != 'all' )
						{
							me.formDestinationFilterVal = temp[ cnt ].paramValue1;
						}
					}
				}
				
				formDestinationFilterActionToolBarRef.items.each( function( item )
				{
					if(item.btnValue === me.formDestinationFilterVal )
					{
						item.addCls( 'f13 xn-custom-heighlight' );
					}
					else
					{
						item.removeCls( 'f13 xn-custom-heighlight' );
						item.addCls( 'f13 xn-custom' );
					}
				} );
				
				moreFormDestinationRef.menu.items.each( function( item )
				{
					if(item.btnValue === me.formDestinationFilterVal )
					{
						item.addCls( 'f13 xn-custom-heighlight' );
					}
					else
					{
						item.removeCls( 'f13 xn-custom-heighlight' );
						item.addCls( 'f13 xn-custom' );
					}
				} );
			},
			toggleSavePrefrenceAction : function( isVisible )
			{
				var me = this;
				var btnPref = me.getBtnSavePreferences();
				if( !Ext.isEmpty( btnPref ) )
					btnPref.setDisabled( !isVisible );
			},
			toggleClearPrefrenceAction : function(isVisible) {
				var me = this;
				var btnPref = me.getBtnClearPreferences();
				if (!Ext.isEmpty(btnPref))
					btnPref.setDisabled(!isVisible);
			},
		updateConfig : function() {
				var me = this;
				me.dateHandler = Ext.create('Ext.ux.gcp.DateUtil');
				me.preferenceHandler = Ext.create('Ext.ux.gcp.PreferencesHandler');
		},
			handleSavePreferences : function() {
			var me = this;
			//me.doSavePreferences();			
				var arrPref = me.getPreferencesToSave(false);
				if (arrPref) {
					me.preferenceHandler.savePagePreferences(me.strPageName, arrPref,
							me.postHandleSavePreferences, null, me, true);
				}
				me.disablePreferencesButton("savePrefMenuBtn",true);
				me.disablePreferencesButton("clearPrefMenuBtn",false);	
			},
			handleClearPreferences : function() {
				var me = this;
				//me.toggleSavePrefrenceAction(false);
				me.preferenceHandler.clearPagePreferences(me.strPageName, null,
				me.postHandleClearPreferences, null, me, true);
				me.disablePreferencesButton("savePrefMenuBtn",false);
				me.disablePreferencesButton("clearPrefMenuBtn",true);	
			},
			postHandleSavePreferences : function(data, args, isSuccess) {
				var me = this;
				
			},
		
		postHandleClearPreferences : function(data, args, isSuccess) {
				var me = this;
				
			},
			saveFilterPreferences : function()
			{
				var me = this;
				var strUrl = me.urlGridFilterPref;
				var advFilterCode = null;
				var objFilterPref = {};
				//var infoPanel = me.getMessageBoxGrid();
			//	var filterViewCollapsed = (me.getLoanCenterFilterView().getCollapsed() === false) ? false : true; 
			//	var infoViewCollapsed = infoPanel.down('container[itemId="summInfoShowHideGridView"]').hasCls("icon_expand_summ");
				/*if( !Ext.isEmpty( me.savePrefAdvFilterCode ) )
				{
					advFilterCode = me.savePrefAdvFilterCode;
				}*/
				var objQuickFilterPref = {};
				//objQuickFilterPref.paymentType = me.messageStatusFilterVal;
				objQuickFilterPref.dueDate = me.dateFilterVal;
				if( me.dateFilterVal === '7' )
				{
					if( !Ext.isEmpty( me.dateFilterFromVal ) && !Ext.isEmpty( me.dateFilterToVal ) )
					{
						objQuickFilterPref.entryDateFrom = me.dateFilterFromVal;
						objQuickFilterPref.entryDateTo = me.dateFilterToVal;
					}
					else
					{
						var strSqlDateFormat = 'Y-m-d';
						var frmDate = me.getEntryDateFrom().getValue();
						var toDate = me.getEntryDateTo().getValue();
						fieldValue1 = Ext.util.Format.date( frmDate, 'Y-m-d' );
						fieldValue2 = Ext.util.Format.date( toDate, 'Y-m-d' );
						objQuickFilterPref.entryDateFrom = fieldValue1;
						objQuickFilterPref.entryDateTo = fieldValue2;
					}
				}

				//objFilterPref.advFilterCode = advFilterCode;
				objFilterPref.quickFilter = objQuickFilterPref;
			//	objFilterPref.filterClientSelected = me.clientFilterVal; 
			//	objFilterPref.filterSelectedClientDesc = me.clientFilterDesc;
			//	objFilterPref.filterPanelCollapsed = filterViewCollapsed;
			//	objFilterPref.infoPanelCollapsed = infoViewCollapsed;

				if( objFilterPref )
					Ext.Ajax.request(
					{
						url : strUrl + csrfTokenName + "=" + csrfTokenValue,
						method : 'POST',
						jsonData : Ext.encode( objFilterPref ),
						success : function( response )
						{
							var data = Ext.decode( response.responseText );
							var title = getLabel( 'SaveFilterPopupTitle', 'Message' );
							if( data.d.preferences && data.d.preferences.success === 'Y' )
							{
								Ext.MessageBox.show(
								{
									title : title,
									msg : getLabel( 'prefSavedMsg', 'Preferences Saved Successfully' ),
									cls:'t7-popup',
									buttons : Ext.MessageBox.OK,
									icon : Ext.MessageBox.INFO
								} );
								me.disablePreferencesButton("savePrefMenuBtn",true);
								me.disablePreferencesButton("clearPrefMenuBtn",false);		
							}
							else if( data.d.preferences && data.d.preferences.success === 'N' && data.d.error
								&& data.d.error.errorMessage )
							{
								if( !Ext.isEmpty( me.getBtnSavePreferencesRef() ) )
//									me.toggleSavePrefrenceAction( true );
//									me.toggleClearPrefrenceAction(false);
									me.disablePreferencesButton("savePrefMenuBtn",false);
									me.disablePreferencesButton("clearPrefMenuBtn",true);	
								Ext.MessageBox.show(
								{
									title : title,
									msg : data.d.error.errorMessage,
									buttons : Ext.MessageBox.OK,
									icon : Ext.MessageBox.ERROR
								} );
							}
						},
						failure : function()
						{
							var errMsg = "";
							Ext.MessageBox.show(
							{
								title : getLabel( 'instrumentErrorPopUpTitle', 'Error' ),
								cls:'t7-popup',
								msg : getLabel( 'instrumentErrorPopUpMsg', 'Error while fetching data..!' ),
								buttons : Ext.MessageBox.OK,
								icon : Ext.MessageBox.ERROR
							} );
						}
					} );
			},	
			disablePreferencesButton: function(btnId,boolVal){
				$("#"+btnId).attr("disabled",boolVal);
				if(boolVal)
					$("#"+btnId).css("color",'grey');
				else
					$("#"+btnId).css("color",'#FFF');
			},
	getPreferencesToSave : function(localSave) {		
			var me = this;
			var groupView = me.getGroupView();
			var grid = null;
			var arrCols = null, objCol = null, arrColPref = new Array(), arrPref = [], objFilterPref = null;
			var groupInfo = null, subGroupInfo = null;
			  if(groupView){
				grid=groupView.getGrid()
				var gridState=grid.getGridState();				
				groupInfo = groupView.getGroupInfo() || '{}';
				subGroupInfo = groupView.getSubGroupInfo() || {};
				var colPrefModuleName = (subGroupInfo.groupCode === 'all') ? (groupInfo.groupTypeCode + subGroupInfo.groupCode) : subGroupInfo.groupCode;
				
						
					arrPref.push({
						"module" : "groupByPref",
						"jsonPreferences" : {
							groupCode : groupInfo.groupTypeCode,
							subGroupCode : subGroupInfo.groupCode
						}
					});
				arrPref.push({
						"module" : subGroupInfo.groupCode,
						"jsonPreferences" : {
							'gridCols' : gridState.columns,
							'pgSize' : gridState.pageSize,
							'sortState' : gridState.sortState,
							'gridSetting' : groupView.getGroupViewState().gridSetting
						}
					});
			
			}
			objFilterPref = me.getFilterPreferences();
			arrPref.push({
						"module" : "gridViewFilter",
						"jsonPreferences" : objFilterPref
					});
			return arrPref;
				
			},
			getFilterPreferences : function() {
				var me = this;
				var advFilterCode = null;
				var objFilterPref = {};
				var infoPanel = me.getMessageBoxGridInformationView();
			//	var filterViewCollapsed = (me.getMessageBoxFilterView().getCollapsed() === false) ? false : true; 
				//var infoViewCollapsed = infoPanel.down('image[itemId="summInfoShowHideGridView"]').hasCls("icon_expand_summ");
				if (!Ext.isEmpty(me.savePrefAdvFilterCode)) {
					advFilterCode = me.savePrefAdvFilterCode;
				}
				var quickPref = {};
				quickPref.messageStatus = me.messageStatusFilterVal;
				quickPref.messageDate = me.dateFilterVal;
				quickPref.formDestination = me.formDestinationFilterVal;
			//	quickPref.filterPanelCollapsed = filterViewCollapsed;
			//	quickPref.infoPanelCollapsed = infoViewCollapsed;
				if (me.dateFilterVal === '7') {
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
				objFilterPref.advFilterCode = advFilterCode;
				objFilterPref.quickFilter = quickPref;
				if (!Ext.isEmpty(me.clientFilterDesc))
				objFilterPref.filterClientSelected = me.clientFilterDesc;				
				
				return objFilterPref;
			},

		updateDateFilterView : function()
			{
				var me = this;
				var dtEntryDate = null;
				if( !Ext.isEmpty( me.dateFilterVal ) )
				{
					me.handleDateChange( me.dateFilterVal );
					if( me.dateFilterVal === '7' )
					{
						if( !Ext.isEmpty( me.dateFilterFromVal ) )
						{
							dtEntryDate = Ext.Date.parse( me.dateFilterFromVal, "Y-m-d" );
							me.getFromEntryDate().setValue( dtEntryDate );
						}
						if( !Ext.isEmpty( me.dateFilterToVal ) )
						{
							dtEntryDate = Ext.Date.parse( me.dateFilterToVal, "Y-m-d" );
							me.getToEntryDate().setValue( dtEntryDate );
						}
					}
				}

			},
			handleDateChange : function( index )
			{
				var me = this;	
				var objDateParams = me.getDateParam( index );
				var datePickerRef=$('#entryDataPicker');

				if (!Ext.isEmpty(me.dateFilterLabel)) {
					me.getDateLabel().setText( getLabel( 'messageDate', 'Message Date' ) + "(" + me.dateFilterLabel + ")" );
				}
				
				var vFromDate = Ext.util.Format.date( new Date(objDateParams.fieldValue1), 'Y-m-d' );
				var vToDate = Ext.util.Format.date( new Date(objDateParams.fieldValue2), 'Y-m-d' );
				
				
				if (index == '13') {
			if (objDateParams.operator == 'eq') {
				datePickerRef.setDateRangePickerValue(vFromDate);
			} else {
				datePickerRef.setDateRangePickerValue([
						vFromDate, vToDate]);
			}
		} else {
				if (index === '1' || index === '2') {						
							datePickerRef.setDateRangePickerValue(vFromDate);						
				} else {
					datePickerRef.setDateRangePickerValue([vFromDate, vToDate]);
				}
		}
			},
			getDateParam : function( index )
			{
				var me = this;
				var objDateHandler = me.getDateHandler();
				var strAppDate = dtApplicationDate;
				var dtFormat = strExtApplicationDateFormat;
				var date = new Date( Ext.Date.parse( strAppDate, dtFormat ) );
				var strSqlDateFormat = 'Y-m-d';
				var fieldValue1 = '', fieldValue2 = '', operator = '';
				var retObj = {};
				var dtJson = {};
				switch( index )
				{
					case '1':
						// Today
						fieldValue1 = Ext.Date.format( date, strSqlDateFormat );
						fieldValue2 = fieldValue1;
						operator = 'eq';
						break;
					case '2':
						// Yesterday
						fieldValue1 = Ext.Date.format( objDateHandler.getYesterdayDate( date ), strSqlDateFormat );
						fieldValue2 = fieldValue1;
						operator = 'eq';
						break;
					case '3':
						// This Week
						dtJson = objDateHandler.getThisWeekStartAndEndDate( date );
						fieldValue1 = Ext.Date.format( dtJson.fromDate, strSqlDateFormat );
						fieldValue2 = Ext.Date.format( dtJson.toDate, strSqlDateFormat );
						operator = 'bt';
						break;
					case '4':
						// Last Week To Date
						dtJson = objDateHandler.getLastWeekToDate( date );
						fieldValue1 = Ext.Date.format( dtJson.fromDate, strSqlDateFormat );
						fieldValue2 = Ext.Date.format( dtJson.toDate, strSqlDateFormat );
						operator = 'bt';
						break;
					case '5':
						// This Month
						dtJson = objDateHandler.getThisMonthToDate( date );
						fieldValue1 = Ext.Date.format( dtJson.fromDate, strSqlDateFormat );
						fieldValue2 = Ext.Date.format( dtJson.toDate, strSqlDateFormat );
						operator = 'bt';
						break;
					case '6':
						// Last Month To Date
						dtJson = objDateHandler.getLastMonthToDate( date );
						fieldValue1 = Ext.Date.format( dtJson.fromDate, strSqlDateFormat );
						fieldValue2 = Ext.Date.format( dtJson.toDate, strSqlDateFormat );
						operator = 'bt';
						break;
					case '7':
						// Date Range
					/*	var frmDate = me.getFromEntryDate().getValue();
						var toDate = me.getToEntryDate().getValue();
						fieldValue1 = Ext.Date.format( frmDate, strSqlDateFormat );
						fieldValue2 = Ext.Date.format( toDate, strSqlDateFormat );
						operator = 'bt';*/
						break;
					case '8':
						// This Quarter
						dtJson = objDateHandler.getQuarterToDate( date );
						fieldValue1 = Ext.Date.format( dtJson.fromDate, strSqlDateFormat );
						fieldValue2 = Ext.Date.format( dtJson.toDate, strSqlDateFormat );
						operator = 'bt';
						break;
					case '9':
						// Last Quarter To Date
						dtJson = objDateHandler.getLastQuarterToDate( date );
						fieldValue1 = Ext.Date.format( dtJson.fromDate, strSqlDateFormat );
						fieldValue2 = Ext.Date.format( dtJson.toDate, strSqlDateFormat );
						operator = 'bt';
						break;
					case '10':
						// This Year
						dtJson = objDateHandler.getYearToDate( date );
						fieldValue1 = Ext.Date.format( dtJson.fromDate, strSqlDateFormat );
						fieldValue2 = Ext.Date.format( dtJson.toDate, strSqlDateFormat );
						operator = 'bt';
						break;
					case '11':
						// Last Year To Date
						dtJson = objDateHandler.getLastYearToDate( date );
						fieldValue1 = Ext.Date.format( dtJson.fromDate, strSqlDateFormat );
						fieldValue2 = Ext.Date.format( dtJson.toDate, strSqlDateFormat );
						operator = 'bt';
						break;
					case '12':
							// Latest
						var fromDate = new Date(latestFromDate);
						var toDate = new Date(latestToDate);		
				 
						fieldValue1 = Ext.Date.format(fromDate,strSqlDateFormat);
						fieldValue2 = Ext.Date.format(toDate,strSqlDateFormat);
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
								fieldValue1 = Ext.Date.format(me.datePickerSelectedDate[0],strSqlDateFormat);
								fieldValue2 = fieldValue1;
								operator = 'eq';
							}else if (me.datePickerSelectedDate.length == 2) {
								fieldValue1 = Ext.Date.format(me.datePickerSelectedDate[0],strSqlDateFormat);
								fieldValue2 = Ext.Date.format(me.datePickerSelectedDate[1], strSqlDateFormat);
									operator = 'bt';
							}
				}
				retObj.fieldValue1 = fieldValue1;
				retObj.fieldValue2 = fieldValue2;
				retObj.operator = operator;
				return retObj;
			},
			onMessageBoxSummaryInformationViewRender : function()
			{
				var me = this;
				var accSummInfoViewRef = me.getMessageBoxGridInformationView();
				accSummInfoViewRef.createSummaryLowerPanelView();
			},
			updateFilterConfig : function()
			{
				var me = this;
				var arrJsn = new Array();
				// TODO : Localization to be handled..
				var objDateLbl =
				{
					'12' : getLabel( 'latest', 'Latest' ),
					'1' : getLabel( 'today', 'Today' ),
					'2' : getLabel( 'yesterday', 'Yesterday' ),
					'3' : getLabel( 'thisweek', 'This Week' ),
					'4' : getLabel( 'lastweek', 'Last Week To Date' ),
					'5' : getLabel( 'thismonth', 'This Month' ),
					'6' : getLabel( 'lastmonth', 'Last Month To Date' ),
					'14' :getLabel('lastmonthonly', 'Last Month Only'),
					'7' : getLabel( 'daterange', 'Date Range' ),
					'8' : getLabel( 'thisquarter', 'This Quarter' ),
					'9' : getLabel( 'lastQuarterToDate', 'Last Quarter To Date' ),
					'10' : getLabel( 'thisyear', 'This Year' ),
					'11' : getLabel( 'lastyeartodate', 'Last Year To Date' )
				};
			
				if( !Ext.isEmpty( objGridViewPref) )
				{
					var objJsonData = Ext.decode(objGridViewPref);
					var data = null;
					if(objJsonData.d.preferences.gridViewFilter)
						data = objJsonData.d.preferences.gridViewFilter;
					if(data != null){
					prefClientCode = data.filterClientSelected;					
					me.clientFilterDesc  = data.filterClientSelected;
					var strDtValue = data.quickFilter.messageDate;
					var strDtFrmValue = data.quickFilter.fromDate;
					var strDtToValue = data.quickFilter.toDate;
					var strmessageStatus = data.quickFilter.messageStatus;
					var strFormDestination = data.quickFilter.formDestination;
					filterPanelCollapsed = !Ext.isEmpty(data.quickFilter.filterPanelCollapsed) ? data.quickFilter.filterPanelCollapsed : true;
					infoPanelCollapsed = !Ext.isEmpty(data.quickFilter.infoPanelCollapsed) ? data.quickFilter.infoPanelCollapsed : true;
					
					if( !Ext.isEmpty( strDtValue ) )
					{
						me.dateFilterLabel = objDateLbl[ strDtValue ];
						me.dateFilterVal = strDtValue;
						if( strDtValue === '7' )
						{
							if( !Ext.isEmpty( strDtFrmValue ) )
								me.dateFilterFromVal = strDtFrmValue;

							if( !Ext.isEmpty( strDtToValue ) )
								me.dateFilterToVal = strDtToValue;
						}
						me.messageStatusFilterVal = !Ext.isEmpty( strmessageStatus ) ? strmessageStatus : 'All';
						me.formDestinationFilterVal = !Ext.isEmpty( strFormDestination ) ? strFormDestination : 'all';
					}
				
				}
				}
				if( !Ext.isEmpty( me.dateFilterVal ) )
				{
					var strVal1 = '', strVal2 = '', strOpt = 'eq';
					if( me.dateFilterVal !== '7' )
					{
						var dtParams = me.getDateParam( me.dateFilterVal );
						if( !Ext.isEmpty( dtParams ) && !Ext.isEmpty( dtParams.fieldValue1 ) )
						{
							strOpt = dtParams.operator;
							strVal1 = dtParams.fieldValue1;
							strVal2 = dtParams.fieldValue2;
						}
					}
					else
					{
						if( !Ext.isEmpty( me.dateFilterVal ) && !Ext.isEmpty( me.dateFilterFromVal ) )
						{
							strVal1 = me.dateFilterFromVal;

							if( !Ext.isEmpty( me.dateFilterToVal ) )
							{
								strOpt = 'bt';
								strVal2 = me.dateFilterToVal;
							}
						}
					}
					//if(me.dateFilterVal != '12')
					//{
						arrJsn.push(
							{
								paramName : 'MessageDate',
								paramValue1 : strVal1,
								paramValue2 : strVal2,
								operatorValue : strOpt,
								paramIsMandatory : true,
								dataType : 'D'
							} );
					//}
				}

				if( !Ext.isEmpty( me.messageStatusFilterVal ) && me.messageStatusFilterVal != 'All' )
				{
					arrJsn.push(
					{
						paramName : 'messageStatus',
						paramValue1 : me.messageStatusFilterVal,
						operatorValue : 'eq',
						dataType : 'S'
					} );
				}
				if( !Ext.isEmpty( me.formDestinationFilterVal ) && me.formDestinationFilterVal != 'all' )
				{
					arrJsn.push(
					{
						paramName : 'formDestination',
						paramValue1 : encodeURIComponent(me.formDestinationFilterVal.replace(new RegExp("'", 'g'), "\''")),
						operatorValue : 'eq',
						dataType : 'S'
					} );
				}
				me.filterData = arrJsn;
			
			},
			/*handleReportAction : function( btn, opts )
			{
				var me = this;
				me.downloadReport( btn.itemId );
			},*/
			downloadReport : function( actionName )
			{
				var me = this;
				//var withHeaderFlag = me.getWithHeaderCheckbox().checked;
				var withHeaderFlag =  document.getElementById("headerCheckbox").checked;
				var arrExtension =
				{
					downloadXls : 'xls',
					downloadCsv : 'csv',
					downloadPdf : 'pdf',
					downloadTsv : 'tsv',
					downloadBAl2 : 'bai2'
				};
				var currentPage = 1;
				var strExtension = '';
				var strUrl = '';
				var strSelect = '';
				var activeCard = '';
				var viscols;
				var col = null;
				var visColsStr = "";
				var colMap = new Object();
				var colArray = new Array();
				var objGroupView = me.getGroupView();

				strExtension = arrExtension[ actionName ];
				strUrl = 'services/inbox/getDynamicReport.' + strExtension;
				strUrl += '?$skip=1';
				var subGroupInfo = objGroupView.getSubGroupInfo();
				var groupInfo = objGroupView.getGroupInfo();
				var strQuickFilterUrl = me.getFilterUrl(subGroupInfo, groupInfo);
				strUrl += strQuickFilterUrl;
				var strOrderBy = me.reportGridOrder;
				if(!Ext.isEmpty(strOrderBy)){
					var orderIndex = strOrderBy.indexOf('orderby');
					if(orderIndex > 0){
						strOrderBy = strOrderBy.substring(orderIndex,strOrderBy.length);
						var indexOfamp = strOrderBy.indexOf('&$');
						if(indexOfamp > 0)
							strOrderBy = strOrderBy.substring(0,indexOfamp);
						strUrl += '&$'+strOrderBy;
					}
				}
				//var grid = me.getMessageBoxGrid();
				var grid = objGroupView.getGrid();
				viscols = grid.getAllVisibleColumns();
				for( var j = 0 ; j < viscols.length ; j++ )
				{
					col = viscols[ j ];
					if( col.dataIndex && arrSortColumn[ col.dataIndex ] )
					{
						if( colMap[ arrSortColumn[ col.dataIndex ] ] )
						{
							// ; do nothing
						}
						else
						{
							colMap[ arrSortColumn[ col.dataIndex ] ] = 1;
							colArray.push( arrSortColumn[ col.dataIndex ] );

						}
					}

				}
				if( colMap != null )
				{

					visColsStr = visColsStr + colArray.toString();
					strSelect = '&$select=[' + colArray.toString() + ']';
				}

				strUrl = strUrl + strSelect;
				
				var  objParam = {}, arrMatches, strRegex = /[?&]([^=#]+)=([^&#]*)/g;
				while (arrMatches = strRegex.exec(strUrl)) {
							objParam[arrMatches[1]] = arrMatches[2];
						}
				strUrl = strUrl.substring(0, strUrl.indexOf('?'));
				
				form = document.createElement( 'FORM' );
				form.name = 'frmMain';
				form.id = 'frmMain';
				form.method = 'POST';
				
				Object.keys(objParam).map(function(key) { 
				form.appendChild(me.createFormField('INPUT', 'HIDDEN',
						key, objParam[key]));
				});
				
				form.appendChild( me.createFormField( 'INPUT', 'HIDDEN', csrfTokenName, tokenValue ) );
				form.appendChild( me.createFormField( 'INPUT', 'HIDDEN', 'txtCurrent', currentPage ) );
				form.appendChild( me.createFormField( 'INPUT', 'HIDDEN', 'txtCSVFlag', withHeaderFlag ) );
				form.action = strUrl;
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
			showHideSellerClientMenuBar : function(entity_type)
			{
				var me = this;
				if(entity_type === '0')
				{
					me.getClientMenuBar().show();
					me.getSellerMenuBar().show();
					me.getClientLoginMenuBar().hide();
				}
				else
				{
					me.getSellerMenuBar().hide();
//					me.getClientMenuBar().hide();
					if(client_count > 1)
					{
						me.getClientLoginMenuBar().show();
				//		me.getFilterBtn().show();
					}
					else
					{
						me.getClientLoginMenuBar().hide();
					//	me.getFilterBtn().hide();
					}
					
				}
				
			},
			applySeekFilter : function()
			{
				var me = this;
				me.toggleSavePrefrenceAction( true );
				me.setDataForFilter();
				me.filterApplied = 'Q';
				me.applyQuickFilter();
			},			
			disableActions : function(canDisable) {
				if (canDisable)
					$('.canDisable').addClass('button-grey-effect');
				else
					$('.canDisable').removeClass('button-grey-effect');
			},
			preHandleTabPermissions : function() {
			var me = this;
			Ext.Ajax
						.request({
							url : 'services/inbox/getUserEventTemplateCode.json',
							method : 'POST',
							success : function(response) {
								var errorMessage = '';
								if (response.responseText== '') 
									me.getManageAlertsTab().setVisible(false);
							},
							failure : function() {
								var errMsg = "";
								Ext.MessageBox
										.show({
											title : getLabel(
													'instrumentErrorPopUpTitle',
													'Error'),
											msg : getLabel(
													'instrumentErrorPopUpMsg',
													'Error while fetching data..!'),
											buttons : Ext.MessageBox.OK,
											cls : 'ux_popup',
											icon : Ext.MessageBox.ERROR
										});
							}
						});
			}
		});	
