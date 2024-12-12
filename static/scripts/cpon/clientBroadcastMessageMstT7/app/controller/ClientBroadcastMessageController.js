Ext
		.define(
				'GCP.controller.ClientBroadcastMessageController',
				{
					extend : 'Ext.app.Controller',
					requires : ['Ext.ux.gcp.PageSettingPopUp'],
					views : [ 'GCP.view.ClientBroadcastMessageView','GCP.view.ClientBroadcastMessageGridView','Ext.ux.gcp.PreferencesHandler','Ext.tip.ToolTip'],
					/**
					 * Array of configs to build up references to views on page.
					 */
					refs : [{
								ref : 'pageSettingPopUp',
								selector : 'pageSettingPopUp'
							},
							{
								ref : 'clientBroadcastMessageView',
								selector : 'clientBroadcastMessageView'
							},
							{
								ref : 'filterView',
								selector : ' clientBroadcastMessageFilterView'
							},							
							{
								ref : 'specificFilterPanel',
								selector : ' clientBroadcastMessageFilterView panel[itemId="specificFilter"]'
							},							
							{
								ref : 'clientBroadcastMessageGridView',
								selector : 'clientBroadcastMessageView clientBroadcastMessageGridView'
							},							
							{
								ref : 'clientSetupDtlView',
								selector : 'clientBroadcastMessageView clientBroadcastMessageGridView panel[itemId="clientSetupDtlView"]'
							},
							/*{
								ref : 'withHeaderCheckboxRef',
								selector : 'clientBroadcastMessageTitleView menuitem[itemId="withHeaderId"]'
							},	*/						
							{
								ref : 'fromDateLabel',
								selector : ' clientBroadcastMessageFilterView label[itemId="dateFilterFrom"]'
							}, {
								ref : 'toDateLabel',
								selector : ' clientBroadcastMessageFilterView label[itemId="dateFilterTo"]'
							}, {
								ref : 'dateLabel',
								selector : ' clientBroadcastMessageFilterView label[itemId="dateLabel"]'
							}, {
								ref : 'fromEntryDate',
								selector : ' clientBroadcastMessageFilterView datefield[itemId="fromDate"]'
							}, {
								ref : 'toEntryDate',
								selector : ' clientBroadcastMessageFilterView datefield[itemId="toDate"]'
							}, {
								ref : 'dateRangeComponent',
								selector : ' clientBroadcastMessageFilterView container[itemId="dateRangeComponent"]'
							}, {
								ref : 'entryDate',
								selector : ' clientBroadcastMessageFilterView button[itemId="entryDate"]'
							}, 							
							{
								ref : 'clientBroadcastMessageGrid',
								selector : 'clientBroadcastMessageView clientBroadcastMessageGridView grid[itemId="gridViewMstId"]'
							},							
							{
								ref : 'grid',
								selector : 'clientBroadcastMessageGridView smartgrid'
							},
							{
								ref : "fileStatusFilter",
								selector : ' clientBroadcastMessageFilterView combo[itemId="fileStatus"]'
							},
							{
								ref : "clientAutoCompleter",
								selector : 'clientBroadcastMessageFilterView textfield[itemId="clientAutoCompleter"]'
							},
							{
								ref : "messageCompleter",
								selector : ' clientBroadcastMessageFilterView textfield[itemId="messageCompleter"]'
							},
							{
								ref : 'brodDate',
								selector : ' clientBroadcastMessageFilterView button[itemId="brodDate"]'
							},							
							{
								ref : 'btnSavePreferences',
								selector : ' clientBroadcastMessageFilterView button[itemId="btnSavePreferences"]'
							}, {
								ref : 'btnClearPreferences',
								selector : ' clientBroadcastMessageFilterView button[itemId="btnClearPreferences"]'
							},
							{
							ref : 'groupView',
							selector : 'clientBroadcastMessageGridView groupView'
							},
							{
								ref:'filterViewRef',
								selector:'filterView'	
							},
							{
								ref:"filterButton",
								selector : "groupView button[itemId=filterButton]"
							}
					],
					config : {
						tokenTypeFilterDesc : null,
						statusFilterVal : null,
						dateFilterVal : '12',
						dateFilterFromVal : '',
						dateFilterToVal : '',	
						dateFilterLabel : getLabel('latest','Latest'),	
						dateHandler : null,						
						strCommonPrefUrl : 'services/userpreferences/clientBroadcastMsg.json',
						filterData : [],
						arrSorter:[],
						reportOrderByURL : null,
						subjectfilterDesc : '',
						subjectfilter : '',
						clientCode : '',
						clientDesc : '',
						datePickerSelectedDate : [],
						dateRangeFilterVal : '13',
						dateLabelVar : '',
						strPageName : 'clientBroadcastMsg',
						preferenceHandler : null

					},
					/**
					 * A template method that is called when your application
					 * boots. It is called before the Application's launch
					 * function is executed so gives a hook point to run any
					 * code before your Viewport is created.
					 */
					init : function() {
						var me = this;
						me.preferenceHandler = Ext.create('Ext.ux.gcp.PreferencesHandler');
						this.dateHandler = me.getController('GCP.controller.DateHandler');
						me.updateConfig();
						$(document).on('savePreference', function(event) {		
						me.handleSavePreferences();
						});
						$(document).on('clearPreference', function(event) {
								me.handleClearPreferences();
						});
						
						$(document).on('performReportAction', function(event, actionName) {
							me.downloadReport(actionName);
						});	
						$(document).on('performPageSettings', function(event) {
						me.showPageSettingPopup('PAGE');
						});
						me.updateFilterConfig();
						me
								.control({
									
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
									'clientBroadcastMessageView' : {
										'render' : function(panel) {		
										if(!Ext.isEmpty(objGridViewPref) || !Ext.isEmpty(objGridViewFilter) || !Ext.isEmpty(objPanelsPref))
											//me.toggleClearPrefrenceAction(true);
											//me.toggleSavePrefrenceAction(true);	
											me.disablePreferencesButton("savePrefMenuBtn",false);
											me.disablePreferencesButton("clearPrefMenuBtn",true);
															
										}									
									},
									/*'clientBroadcastMessageTitleView' : {
										performReportAction : function( btn, opts )
										{
											me.handleReportAction( btn, opts );
										}										
									},     */      
									' clientBroadcastMessageFilterView button[itemId="btnFilter"]' : {
										click : function(btn, opts) {
											me.setDataForFilter();
											me.applyFilter();
											me.toggleSavePrefrenceAction(true);
										}
									},									
									'clientBroadcastMessageView clientBroadcastMessageGridView panel[itemId="clientSetupDtlView"]' : {
										render : function() {
											me.handleGridHeader();											
										//	me.updateFilterConfig();		
										}
									},	
									'clientBroadcastMessageFilterView component[itemId="broadcastMsgEntryDatePicker"]' : 									{
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
															me.applyFilter();
															me.disablePreferencesButton("savePrefMenuBtn",false);
														}
													}
											});
								}	
							},
									' clientBroadcastMessageFilterView' : {
										render : function() {
												//if (!Ext.isEmpty(modelSelectedMst))
												//me.selectedMst = modelSelectedMst;
												var useSettingsButton = me.getFilterViewRef()
												.down('button[itemId="useSettingsbutton"]');
												if (!Ext.isEmpty(useSettingsButton))
												{
													useSettingsButton.hide();
												}
												var advFilter= me.getFilterViewRef().down(												'label[itemId="createAdvanceFilterLabel"]');
												if (!Ext.isEmpty(advFilter)) {
													advFilter.hide();
												}
											me.setInfoTooltip();
											me.setFilterRetainedValues();
											me.handleSpecificFilter();
										},									
										dateChange : function(btn, opts) {
											me.dateFilterVal = btn.btnValue;
											me.dateFilterLabel = btn.text;
											me.handleDateChange(btn.btnValue);
											if (btn.btnValue !== '7') {
												me.setDataForFilter();
												me.applyFilter();
											}
											me.disablePreferencesButton("savePrefMenuBtn",false);
											me.disablePreferencesButton("clearPrefMenuBtn",true);
										},
										afterrender : function( panel, opts )
										{
											me.updateFilterFields();
										}
									},	
									' clientBroadcastMessageFilterView button[itemId="goBtn"]' :
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
												me.applyFilter();
												me.toggleSavePrefrenceAction( true );
											}
										}
									},									
								'clientBroadcastMessageGridView groupView' : {
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
									me.doHandleGroupTabChange(groupInfo, subGroupInfo,
											tabPanel, newCard, oldCard);
									me.disablePreferencesButton("savePrefMenuBtn",false);
									me.disablePreferencesButton("clearPrefMenuBtn",false);	
								},
								'gridRender' : me.handleLoadGridData,
								'gridPageChange' : me.handleLoadGridData,
								'gridSortChange' : me.handleLoadGridData,
								'gridPageSizeChange' : me.handleLoadGridData,
								'gridColumnFilterChange' : me.handleLoadGridData,
								//'gridRowSelectionChange' : me.doHandleGridRowSelectionChange,
								'gridStateChange' : function(grid) {
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
								'gridSettingClick' : function(){
									me.showPageSettingPopup('GRID');
								}
					},
									'clientBroadcastMessageFilterView' : {
										handleClientChange : function(clientCode, clientDesc) {
											me.clientCode = clientCode;
											me.clientDesc = clientDesc;
											me.setDataForFilter();
											me.applyFilter();
											//me.toggleSavePrefrenceAction(true);
											me.disablePreferencesButton("savePrefMenuBtn",false);
											me.disablePreferencesButton("clearPrefMenuBtn",false);
										},
										handleSubjectChange : function(subfilter, subDesc) {
											if(me.subjectfilterDesc !=  subDesc){
											me.subjectfilter = subfilter;
											me.subjectfilterDesc = subDesc;
											me.setDataForFilter();
											me.applyFilter();
											//me.toggleSavePrefrenceAction(true);
											me.disablePreferencesButton("savePrefMenuBtn",false);
											me.disablePreferencesButton("clearPrefMenuBtn",false);
											}
										}										
									},									
								' clientBroadcastMessageFilterView datefield[itemId="fromDate"]' :
								{		
									select : function()
									{
										if(!Ext.isEmpty(me.getToEntryDate().getValue()))
										me.getToEntryDate().setMinValue(me.getFromEntryDate().getValue());
									}
								},
								' clientBroadcastMessageFilterView toolbar[itemId="dateToolBar"]' :
								{
									afterrender : function( tbar, opts )
									{
										me.updateDateFilterView();
									}
								}
							
								});
					},
					updateFilterFields : function(){
						var me=this;
						var clientCodesFltId;
						var clientBroadcastMessageFilterView = me.getFilterView();
						clientCodesFltId = clientBroadcastMessageFilterView.down('combo[itemId="clientAutoCompleter"]');
							if(undefined != me.clientFilter && me.clientFilter != ''){	
								clientCodesFltId.setRawValue(me.clientFilter);			
							}	
							else{	
								clientCodesFltId.setRawValue(getLabel('allCompanies', 'All Companies'));
								me.clientFilter = 'all';
							}
						
						
						if(me.subjectFilter != null) { 
							var subjectFilterCombo=clientBroadcastMessageFilterView.down('combo[itemId="messageCompleter"]');
								subjectFilterCombo.setValue(me.subjectFilter);
						}	
						me.handleDateChange(me.dateFilterVal);
					
					},
					setFilterRetainedValues : function() {
						var me = this;
						me.dateLabelVar = me.getDateLabel();										
						var filterView = me.getSpecificFilterPanel();
					},
					handleSpecificFilter : function() {
						var me = this;
					},
					disablePreferencesButton: function(btnId,boolVal){
						$("#"+btnId).attr("disabled",boolVal);
						if(boolVal)
							$("#"+btnId).css("color",'grey');
						else
							$("#"+btnId).css("color",'#FFF');
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
				doHandleGroupTabChange : function(groupInfo, subGroupInfo, tabPanel,newCard, oldCard)
				{
					var me = this;
					var objGroupView = me.getGroupView();
					var strModule = '', strUrl = null, args = null;
					groupInfo = groupInfo || {};
					subGroupInfo = subGroupInfo || {};
					if (groupInfo && groupInfo.groupTypeCode) {
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
					handleClearSettings:function()
						{
						var me=this;
						var filterView = me.getFilterView();
						
						
							clientFilterId=filterView.down('combo[itemId="clientAutoCompleter"]');
							me.clientDesc=getLabel('allCompanies', 'All Companies');
							me.clientCode='all';
							clientFilterId.setRawValue(getLabel('allCompanies', 'All Companies'));	
						

						var entryDatePicker = me.getFilterView()
								.down('component[itemId="entryDataPicker"]');
						me.dateFilterVal = '12';
						me.dateFilterLabel = getLabel('latest', 'Latest');
						me.handleDateChange(me.dateFilterVal);
						
						var subjectFilter = me.getFilterView()
								.down('AutoCompleter[itemId="messageCompleter"]');								
						me.subjectFilter = "";
						me.subjectFilterDesc = "";
						subjectFilter.suspendEvents();
						subjectFilter.reset();
						subjectFilter.resumeEvents();
						
						me.filterApplied = 'Q';
						me.clientFilterDesc='';
						me.clientFilterVal='';
						
							$("#summaryClientFilterSpan").text(getLabel('allCompanies', 'All Companies'));
							$("#summaryClientFilter").val('');	
						me.filterData=[];
						me.setDataForFilter();
						//me.refreshData();						
					  me.getGroupView().refreshData();
					},
			postHandleDoHandleGroupTabChange : function(data, args) {
				var me=this; 
				var objGroupView = me.getGroupView();
				var objSummaryView = me.getClientBroadcastMessageGridView(), arrSortState = new Array(), objPref = null, gridModel = null, intPgSize = null, showPager = true;
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
							showCheckBoxColumn : false,
							storeModel : {
								sortState : arrSortState
							}
						};
					}
					}
				} else {
					gridModel = {
						showCheckBoxColumn : false
					};
				}
				objGroupView.reconfigureGrid(gridModel);
	
			},
			
					handleGridHeader : function() {
						var me = this;
					},

					handleLoadGridData : function(groupInfo, subGroupInfo,grid, url, pgSize, newPgNo, oldPgNo, sorter,filterData) 
						{
						var me = this; 
						me.setDataForFilter();
						var arrOfParseQuickFilter = [];
						var strUrl = grid.generateUrl(url, pgSize, newPgNo,oldPgNo, sorter);
						strUrl = strUrl + me.getFilterUrl(subGroupInfo, groupInfo);
						
							var paramName = 'clientId';
									var reqJsonInQuick = me.findInQuickFilterData(me.filterData, paramName);
									if (!Ext.isEmpty(reqJsonInQuick)) {
										var arrQuickJson = me.filterData;
										me.filterData = me.removeFromQuickArrJson(me.filterData,paramName);
									}
						
							
							
							if(!Ext.isEmpty(me.filterData)){
								if(!Ext.isEmpty(me.filterData) && me.filterData.length >= 1){
									arrOfParseQuickFilter = generateFilterArray(me.filterData);
								}
							}
							
							if(arrOfParseQuickFilter) {
								me.getFilterViewRef().updateFilterInfo(arrOfParseQuickFilter);
							}
									
						me.reportOrderByURL = strUrl;
						grid.loadGridData(strUrl, null, null, false);
						grid.on('cellclick', function(tableView, td, cellIndex, record, tr, rowIndex, e) {
							var clickedColumn = tableView.getGridColumns()[cellIndex];
							var columnType = clickedColumn.colType;
							var downloadAttachment = false;
							var IconLinkClicked = (e.target.tagName == 'I');	
							if(IconLinkClicked){
								var clickedId = e.target.id;
								if(clickedId == "downloadAttachment"){
									downloadAttachment = true;
								}
							}
							if(Ext.isEmpty(columnType)) {
								var containsCheckboxCss = (clickedColumn.cls.indexOf('x-column-header-checkbox') > -1)
								columnType = containsCheckboxCss ? 'checkboxColumn' : '';
							}
							me.handleGridRowClick(record, grid, columnType, downloadAttachment);
						});
						},
						handleGridRowClick : function(record, grid, columnType, downloadAttachment) {
							if(columnType !== 'actioncontent' && columnType !== 'checkboxColumn' ){
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
									if(!Ext.isEmpty(downloadAttachment) 
											&& downloadAttachment){
										me.doHandleRowActions(arrVisibleActions[1].itemId, grid, record);
									} else {
										me.doHandleRowActions(arrVisibleActions[0].itemId, grid, record);
									}
								}
							} else {
							}
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
	showPageSettingPopup : function(strInvokedFrom) {
		var me = this, objData = {}, objGroupView = me.getGroupView(), objPrefData, objGeneralSetting, objGridSetting, objColumnSetting, strTitle = null, subGroupInfo;
		var objGroupByVal = '', objDefaultFilterVal = '', objGridSizeVal = '', objRowPerPageVal = _GridSizeMaster;

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
					: (CLIENT_BROADCAST_COLUMN_MODEL || '[]');

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
				"Column Settings") + ' : ' + (subGroupInfo.groupDescription||'')  : getLabel("Settings", "Settings"));
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
	handleAppliedFilterDelete : function(btn){
		var me = this;
		var objData = btn.data;
		var quickJsonData = me.filterData;
		if(!Ext.isEmpty(objData)){
			var paramName = objData.paramName || objData.field;
				reqJsonInQuick = me.findInQuickFilterData(quickJsonData,paramName);
				if (!Ext.isEmpty(reqJsonInQuick)) {
					arrQuickJson = quickJsonData;
					arrQuickJson = me.removeFromQuickArrJson(arrQuickJson,paramName);
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
	resetFieldInQuickFilterOnDelete : function(objData){
		var me = this,strFieldName;
		strFieldName = objData.paramName || objData.field;
		if (strFieldName ==='brodSubject') {
			me.getMessageCompleter().setValue('');
		}
		if (strFieldName ==='brodDate') {
			var datePickerRef = $('#entryDataPicker');
			var toDatePickerRef = $('#entryDataToPicker');
			me.dateFilterVal = '12';

			me.dateFilterLabel = getLabel('latest', 'Latest');
							
			datePickerRef.val('');
			toDatePickerRef.val('');
			me.handleDateChange(me.dateFilterVal);
			me.filterApplied = 'Q';
		}
		if (strFieldName ==='htmlFileDesc') {
			me.getClientAutoCompleter().setRawValue(getLabel('allCompanies', 'All Companies'));
		}
		
		
	},
	/*Applied Filters handling ends here*/
	/*Page setting handling ends here*/
					/*filenameFun : function(record)
					{
						var filename = record.get('uploadFileName');
						console.log(filename);
					},*/
					getFilterUrl : function(subGroupInfo, groupInfo) {
						var me = this; 
						var strQuickFilterUrl = '',strUrl = '';
						var strGroupQuery = (subGroupInfo && subGroupInfo.groupQuery)
									? subGroupInfo.groupQuery
									: '';
						strQuickFilterUrl = me.generateUrlWithFilterParams(this);
						if (!Ext.isEmpty(strGroupQuery))
						{
							if( Ext.isEmpty( strQuickFilterUrl ) )
							{
								strUrl += '&$filter=' + strGroupQuery;								
								isFilterApplied = true;
							}
							else{
							if (!Ext.isEmpty(strQuickFilterUrl))
							 {								
								strUrl += strQuickFilterUrl + ' and '+strGroupQuery ;
								
							 }
							}
						}
					else{
						if (!Ext.isEmpty(strQuickFilterUrl))
							strUrl += strQuickFilterUrl;
						}
						
						
						return strUrl;
					},					
					generateUrlWithFilterParams : function(thisClass) {
						var filterData = thisClass.filterData;
						var isFilterApplied = false;
						var strFilter = '&$filter=';
						var strTemp = '';
						var strFilterParam = '';
						for ( var index = 0; index < filterData.length; index++) {
							if (isFilterApplied)
								strTemp = strTemp + ' and ';
							switch (filterData[index].operatorValue) {
							case 'bt':
								strTemp = strTemp + filterData[index].paramName
										+ ' ' + filterData[index].operatorValue
										+ ' ' + '\''
										+ filterData[index].paramValue1 + '\''
										+ ' and ' + '\''
										+ filterData[index].paramValue2 + '\'';
								break;
							case 'in':
								var arrId = filterData[index].paramValue1;
								if (0 != arrId.length) {
									strTemp = strTemp + '(';
									for ( var count = 0; count < arrId.length; count++) {
										strTemp = strTemp
												+ filterData[index].paramName
												+ ' eq ' + '\'' + arrId[count]
												+ '\'';
										if (count != arrId.length - 1) {
											strTemp = strTemp + ' or ';
										}
									}
									strTemp = strTemp + ' ) ';
								}
								break;
							default:
								// Default opertator is eq
								strTemp = strTemp + filterData[index].paramName
										+ ' ' + filterData[index].operatorValue
										+ ' ' + '\''
										+ filterData[index].paramValue1 + '\'';
								break;
							}
							isFilterApplied = true;
						}
						if (isFilterApplied)
							strFilter = strFilter + strTemp;
						else
							strFilter = '';
						return strFilter;
					},

					applyFilter : function() {
							var me = this;
							var objGroupView = me.getGroupView();
							var groupInfo = objGroupView.getGroupInfo();
							me.refreshData();
						},
						refreshData : function() {
							var me = this;
							var objGroupView = me.getGroupView();
							var grid = objGroupView.getGrid();
							if (grid) {
							}
							grid.removeAppliedSort();
							objGroupView.refreshData();
						}, 
					handleSmartGridConfig : function() {
						var me = this;
						var data;
						var objConfigMap = me.getClientBroadcastMessageGridConfiguration();
						var bankReportGrid = me.getClientBroadcastMessageGrid();
						if( Ext.isEmpty( bankReportGrid ) )
						{
							if( !Ext.isEmpty( objGridViewPref ) )
							{
								data = Ext.decode( objGridViewPref );
								arrColsPref = data.gridCols;
								arrCols = me.getColumns( arrColsPref, objConfigMap.objWidthMap );
								pgSize = !Ext.isEmpty( data.pgSize ) ? parseInt( data.pgSize,10 ) :10;
								me.handleSmartGridLoading( arrCols, objConfigMap.storeModel, pgSize );
							}
							else if( objConfigMap.arrColsPref )
							{
								arrCols = me.getColumns( objConfigMap.arrColsPref, objConfigMap.objWidthMap );
								pgSize = 10;
								me.handleSmartGridLoading( arrCols, objConfigMap.storeModel, pgSize );
							}
						}
						else
						{
							var arrCols = new Array();
							if (!Ext.isEmpty(bankReportGrid))
								bankReportGrid.destroy(true);

							arrCols = me.getColumns(objConfigMap.arrColsPref,
									objConfigMap.objWidthMap);
							me.handleSmartGridLoading(arrCols,
									objConfigMap.storeModel);
						}
					},

					handleSmartGridLoading : function(arrCols, storeModel,pSize) {
						var me = this;
						var pgSize;
						pgSize = pSize || 10;
						uokenFilesGrid = Ext.create('Ext.ux.gcp.SmartGrid', {
							id : 'gridViewMstId',
							itemId : 'gridViewMstId',
							pageSize : pgSize,
							stateful : false,
							showCheckBoxColumn : false,
							showEmptyRow : false,
							padding : '5 10 10 10',
							rowList : _AvailableGridSize,
							minHeight : 0,
							columnModel : arrCols,
							storeModel : storeModel,
							isRowIconVisible : me.isRowIconVisible,
							handleRowMoreMenuClick : me.handleRowMoreMenuClick,

							handleRowIconClick : function(tableView, rowIndex,
									columnIndex, btn, event, record) {
								me.handleRowIconClick(tableView, rowIndex,
										columnIndex, btn, event, record);
							},

							handleMoreMenuItemClick : function(grid, rowIndex,
									cellIndex, menu, event, record) {
								var dataParams = menu.dataParams;
								me.handleRowIconClick(dataParams.view,
										dataParams.rowIndex,
										dataParams.columnIndex, menu, null,
										dataParams.record);
							}
						});

						var clntSetupDtlView = me.getClientSetupDtlView();
						clntSetupDtlView.add(uokenFilesGrid);
						clntSetupDtlView.doLayout();
					},

					handleRowIconClick : function(tableView, rowIndex,
							columnIndex, btn, event, record) {
						var me = this;					
					},

					isRowIconVisible : function(store, record, jsonData, itmId,
							maskPosition) {
						return retValue;
					},

					getColumns : function(arrColsPref, objWidthMap) {
						var me = this;
						var arrCols = new Array(), objCol = null, cfgCol = null;
						// arrCols.push(me.createActionColumn())
						if (!Ext.isEmpty(arrColsPref)) {
							for ( var i = 0; i < arrColsPref.length; i++) {
								objCol = arrColsPref[i];
								cfgCol = {};
								cfgCol.colHeader = objCol.colHeader;
								cfgCol.colId = objCol.colId;
								cfgCol.hidden = objCol.hidden;
								cfgCol.locked = objCol.locked;
								if (!Ext.isEmpty(objCol.colType)) {
									cfgCol.colType = objCol.colType;
									if (cfgCol.colType === "number")
										cfgCol.align = 'right';
								}
								if(cfgCol.colId=='uploadFileName')
								{
									cfgCol.align = 'center';
								}								
								cfgCol.width = !Ext
										.isEmpty(objWidthMap[objCol.colId]) ? objWidthMap[objCol.colId]
										: 120;										
								cfgCol.fnColumnRenderer = me.columnRenderer;
								arrCols.push(cfgCol);
							}
						}
						return arrCols;
					},

					handleRowMoreMenuClick : function(tableView, rowIndex,
							columnIndex, btn, event, record) {
						var me = this;
						var menu = btn.menu;
						var arrMenuItems = null;
						var blnRetValue = true;
						var store = tableView.store;
						var jsonData = store.proxy.reader.jsonData;

						btn.menu.dataParams = {
							'record' : record,
							'rowIndex' : rowIndex,
							'columnIndex' : columnIndex,
							'view' : tableView
						};
						if (!Ext.isEmpty(menu.items)
								&& !Ext.isEmpty(menu.items.items))
							arrMenuItems = menu.items.items;
						if (!Ext.isEmpty(arrMenuItems)) {
							for ( var a = 0; a < arrMenuItems.length; a++) {
								blnRetValue = me.isRowIconVisible(store,
										record, jsonData, null,
										arrMenuItems[a].maskPosition);
								arrMenuItems[a].setVisible(blnRetValue);
							}
						}
						menu.showAt(event.xy[0] + 5, event.xy[1] + 5);
					},


					columnRenderer : function(value, meta, record, rowIndex,
							colIndex, store, view, colId) {
						var strRetValue = "";			
						if (colId == 'col_displayLevel') {						
							strRetValue = '<font color="red">'+ value +'</font>';
						}
						else if (colId == 'col_messageName') {
								if (!Ext.isEmpty(record.data.textorHtmlDesc))
								{
									var htmlPathVal = record.data.textorHtmlDesc;									
									strRetValue =  value + '&nbsp; <a class="ux_font-size14-normal button_underline" href="javascript:downloadView(\''+htmlPathVal+'\')"></a>';
								}
						        else if(!Ext.isEmpty(record.data.messageBody))
								{
									var details = record.data.messageBody;
									details = details.replace(/([']|\\)/g, "\\$1");
									details = getDecodedValue(subject);
									//var popupTitle = record.data.messageName+' , '+record.data.startDateTime;
									var subject = record.data.messageName;
									subject = subject = getDecodedValue(subject);
									var popupTitle = getLabel('messageTilte', 'Message');
									strRetValue =  value + '&nbsp; <a class="ux_font-size14-normal button_underline" href="javascript:showMsgPopup(\'' + popupTitle + '\', \'' + details + '\', \'' + subject + '\')";></a>';
								}
								else {
									strRetValue = value;
								}								
						}
						else if (colId == 'col_uploadFileName')
						{
								if (!Ext.isEmpty(record.data.uploadFileName))
								{
									strRetValue = '<a href="#"  ><i class="fa fa-paperclip fa-rotate-90 fa-lg"/></a>';
								}
						}
						else {
							strRetValue = value;
						}						
						return strRetValue;
					},
					postReadPanelPrefrences : function (data, args, isSuccess) {
						var me = this;
						if(!Ext.isEmpty(data))
						objGridViewPref=data.preference;
					},									
					updateFilterConfig : function() {
						var me = this;
						var arrJsn = new Array();
						me.preferenceHandler = Ext.create('Ext.ux.gcp.PreferencesHandler');
						var	args = {
								'module' : 'panels'
							};
						// TODO : Localization to be handled..
						var objDateLbl = {
							
							'12' : getLabel( 'latest', 'Latest' ),
							'1' : getLabel( 'today', 'Today' ),
				            '2' : getLabel( 'yesterday', 'Yesterday' ),
				            '3' : getLabel( 'thisweek', 'This Week' ),
				            '4' : getLabel( 'lastweek', 'Last Week To Date' ),
				            '5' : getLabel( 'thismonth', 'This Month' ),
				            '6' : getLabel( 'lastmonth', 'Last Month To Date' ),
				            '7' : getLabel( 'daterange', 'Date Range' ),
				            '8' : getLabel( 'thisquarter', 'This Quarter' ),
				            '9' : getLabel( 'lastQuarterToDate', 'Last Quarter To Date' ),
				            '10' : getLabel( 'thisyear', 'This Year' ),
				            '11' : getLabel( 'lastyeartodate', 'Last Year To Date' )
						};
						if (Ext.isEmpty(objGridViewFilter)){
							me.preferenceHandler.readModulePreferences('clientBroadcastMsg',
									'gridViewFilter', me.postReadfilterPrefrences, args, me, true);
						}								
						if (!Ext.isEmpty(objGridViewFilter)) {
							var objJsonData = Ext.decode(objGridViewPref);
							var data = null;
							if(objJsonData.d.preferences.gridViewFilter)
								data = objJsonData.d.preferences.gridViewFilter;
								if(data != null && !Ext.isEmpty(data))
								{
									var strDtValue = data.dateIndex;
									var strDtFrmValue = data.fromDate;
									var strDtToValue = data.toDate;
									if (!Ext.isEmpty(strDtValue)) {
										me.dateFilterLabel = objDateLbl[strDtValue];
										me.dateFilterVal = strDtValue;
										if (strDtValue === '7') {
											if (!Ext.isEmpty(strDtFrmValue))
											{
												me.dateFilterFromVal = strDtFrmValue;
												me.getFromEntryDate().setValue(strDtFrmValue);
											}
											if (!Ext.isEmpty(strDtToValue))
											{
												me.dateFilterToVal = strDtToValue;
												me.getToEntryDate().setValue(strDtToValue);
											}
											me.getDateRangeComponent().show();
										}	
										var dateLabel = me.getDateLabel();
										if(Ext.isEmpty(dateLabel))
										{
											dateLabel = me.dateLabelVar;
										}
										else
										dateLabel.setText(getLabel('lblMessageDate', 'Broadcast Date') + " ("
									+ me.dateFilterLabel+ ")");		
									}								
								//}
								me.preferenceHandler.readModulePreferences(me.strPageName,
					'brodcastMsgFilterPref', me.postReadfilterPrefrences, args, me, true);	
					
							}
							}
						if (!Ext.isEmpty(me.dateFilterVal)) {
							var strVal1 = '', strVal2 = '', strOpt = 'eq';
							if (me.dateFilterVal !== '7') {
								var dtParams = me.getDateParam(me.dateFilterVal);
								if (!Ext.isEmpty(dtParams)
										&& !Ext.isEmpty(dtParams.fieldValue1)) {
									strOpt = dtParams.operator;
									strVal1 = dtParams.fieldValue1;
									strVal2 = dtParams.fieldValue2;
								}
							} else {
								if (!Ext.isEmpty(me.dateFilterVal)
										&& !Ext.isEmpty(me.dateFilterFromVal)) {
									strVal1 = me.dateFilterFromVal;

									if (!Ext.isEmpty(me.dateFilterToVal)) {
										strOpt = 'bt';
										strVal2 = me.dateFilterToVal;
									}
								}
							}
							//if(me.dateFilterVal != '12')
							//{
								arrJsn.push({
											paramName : 'EntryDate',
											paramValue1 : strVal1,
											paramValue2 : strVal2,
											operatorValue : strOpt,
											paramIsMandatory : true,
											dataType : 'D'
										});
							//}
						}
						me.handleDateChange(me.dateFilterVal);
						me.filterData = arrJsn;
					},					
					postReadfilterPrefrences : function (data, args, isSuccess) {
					var me = this;
					if (data && data.preference) {
						objPref = Ext.decode(data.preference);
						me.clientFilter = objPref.clientName;
						me.subjectFilter = objPref.msgFilter;						
					}	
	},
					getClientBroadcastMessageGridConfiguration : function() {
						var me = this;
						var objConfigMap = null;
						var objWidthMap = null;
						var arrColsPref = null;
						var storeModel = null;
						if( !Ext.isEmpty( objGridViewPref ) )
						{
							var data = Ext.decode( objGridViewPref );
							me.arrSorter = data.sortState;
						}						
						objWidthMap = {
								"displayLevel" : 110,
								"startDateTime" : 100,
								"endDate" : 100,
								"messageName" : 180,
								"messageBody" : 240,
								"uploadFileName" : 100,
								"htmlFileDesc" : 120
						};

						arrColsPref = [ {
							"colId" : "displayLevel",
							"colHeader" : getLabel('lblmessageType','Message Type')
						},{
							"colId" : "startDateTime",
							"colHeader" :  getLabel('lblDate','StartDate')
						},
							{
							"colId" : "endDateTime",
							"colHeader" :  getLabel('lblDate','EndDate')
						},{
							"colId" : "messageName",
							"colHeader" :  getLabel('lblSubject','Subject')
						},{
							"colId" : "messageBody",
							"colHeader" :  getLabel('lblMessage','Message')
						},{
							"colId" : "uploadFileName",
							"colHeader" :  getLabel('lblAttachment','Attachment')
						}
						/*,{
							"colId" : "htmlFileDesc",
							"colHeader" : getLabel('lblClient','Client')
						}*/
						];

						storeModel = {
							fields : [ 'identifier','htmlFileDesc', 'messageBody','messageName','startDateTime','endDateTime',
									'displayLevel', 'primaryKey', 'textorHtmlDesc', 'uploadFileName',
									'version', 'recordKeyNo', 'htmlFileName', 'broadcastId', '__metadata'
									],
							proxyUrl : 'cpon/clientBroadcastMessage.json',
						 rootNode : 'd.profile',
						 sortState : me.arrSorter,
						 totalRowsNode : 'd.__count'
						};

						objConfigMap = {
							"objWidthMap" : objWidthMap,
							"arrColsPref" : arrColsPref,
							"storeModel" : storeModel
						};
						return objConfigMap;
					},										
					setDataForFilter : function() {
						var me = this;
							me.filterData = me.getQuickFilterQueryJson();
					},
					doHandleRowActions : function(actionName, grid, record,rowIndex)
					{
						var me = this;
						var strRetValue = "";	
						var objGroupView = me.getGroupView();
						if (actionName === 'btnView') {
							 if(!Ext.isEmpty(record.data.messageBody))
								{
									var details = record.data.messageBody;
							details = details.replace(/([']|\\)/g, "\\$1");
							details = getDecodedValue(details);
							//var popupTitle = record.data.messageName+' , '+record.data.startDateTime;
							var subject = record.data.messageName;
							subject = getDecodedValue(subject);
							var popupTitle = getLabel('messageTilte', 'Message');
							showMsgPopup(popupTitle,details,subject);
								}
							 if (!Ext.isEmpty(record.data.textorHtmlDesc))
								{
									var htmlPathVal = record.data.textorHtmlDesc;									
									downloadView(htmlPathVal);
								}							 
						}	
						else if (actionName === 'btnDownload') {
							 if (!Ext.isEmpty(record.data.uploadFileName))
								{
									strFileName=record.data.uploadFileName;
									downloadAttachmentFile(strFileName);
								}
						}						
					},
					getQuickFilterQueryJson : function() {
						var me = this; var filterDateValue;
						var clientFilter = me.getClientAutoCompleter();
						var subjectFilter = me.getMessageCompleter();
						
						/*var clientFilter = me.getClientAutoCompleter().getValue();
						var subjectFilter = me.getMessageCompleter().getValue();*/
						if(Ext.isEmpty(clientFilter ))
						{
							clientFilter = me.clientFilter;
							var desc = me.clientFilterDesc;
						}
						else
						clientFilter = me.getClientAutoCompleter().getValue();
						if(Ext.isEmpty(subjectFilter ))
						{
							subjectFilter = me.subjectFilter;
							var sdesc = me.subjectFilterDesc;
						}
						else
						subjectFilter = me.getMessageCompleter().getValue();
						
						
						var jsonArray = [];
						var index = me.dateFilterVal;
						var objDateParams = me.getDateParam( index );
						/*var filterDate=me.getBrodDate();
						if(Ext.isEmpty(filterDate))
						filterDateValue = 'brodDate';
						else
						filterDateValue = filterDate.filterParamName;*/
							jsonArray.push(
									{
										paramName : 'brodDate',
										paramIsMandatory : true,
										paramValue1 : objDateParams.fieldValue1,
										paramValue2 : objDateParams.fieldValue2,
										operatorValue : objDateParams.operator,
										dataType : 'D',
										paramFieldLable : getLabel('lblMessageDate', 'Broadcast Date')
									} );
						if (clientFilter != null && clientFilter != '' && clientFilter!=getLabel("allCompanies","All companies") 
									&& clientFilter!=getLabel("allCompanies","All companies") ) {
							jsonArray.push({
										paramName : 'htmlFileDesc',
										paramValue1 : encodeURIComponent(clientFilter.toLowerCase().replace(new RegExp("'", 'g'), "\''")),										
										operatorValue : 'eq',
										dataType : 'S',
										paramFieldLable : getLabel('client', 'Company Name'),
				                        displayType : 5,
				                        displayValue1 : clientFilter
									});
						}	
						if (subjectFilter != null && subjectFilter != '' && subjectFilter!='All') {
							jsonArray.push({
										paramName : 'brodSubject',
										paramValue1 : encodeURIComponent(subjectFilter.toLowerCase().replace(new RegExp("'", 'g'), "\''")),
										operatorValue : 'lk',
										dataType : 'S',
										paramFieldLable : getLabel('lblSubject', 'Subject'),
				                        displayType : 5,
				                        displayValue1 : subjectFilter
									});
						}							
						return jsonArray;
					},				
					setInfoTooltip : function() {
						var me = this;
						var infotip = Ext
								.create(
										'Ext.tip.ToolTip',
										{
											target : 'imgFilterInfoGridView',
											listeners : {
												// Change content dynamically
												// depending on which element
												// triggered the show.
												beforeshow : function(tip) {
													var strUserId = '';
													var strFileName = '';													
													var fileFilterView = me
															.getSpecificFilterPanel();
													var fileName = fileFilterView
															.down('textfield[itemId="messageCompleter"]');	
													var clContainer = me.getFilterView()
															.down('container[itemId="filterCorporationContainer"]');	
													var objUserId = me.getClientAutoCompleter();
												var dateFilter = me.dateFilterLabel;
													if (!Ext.isEmpty(fileName)
															&& !Ext.isEmpty(fileName.getValue())) {
														strFileName = fileName.getValue();
													} else {
														strFileName = getLabel('none', 'None');
													}
													if (!Ext.isEmpty(objUserId)
															&& !Ext.isEmpty(objUserId.getValue())) {
														strUserId = objUserId.getValue();
													}
													else
													{
														if(clContainer.isVisible())
														{
															strUserId = getLabel(
																'none', 'None');
														}	
														else
														{
															strUserId = strClientDesc;
														}		
													}	

													tip.update(getLabel('client', 'Company Name')
																	+ ' : '
																	+ strUserId
																	+ '<br/>'
																	+getLabel('lblSubject', 'Subject')
																	+ ' : '
																	+ strFileName
																	+ '<br/>'
																	+getLabel( 'lblMessageDate', 'Broadcast Date' )
																	+ ' : ' + dateFilter);
												}
											}
										});
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
					handleDateChange : function(index) {
								var me = this;
								var objDateParams = me.getDateParam(index);
								var datePickerRef=$('#entryDataPicker');
								
								if (!Ext.isEmpty(me.dateFilterLabel)) {
								
							/*		me.getDateLabel().setText(getLabel('lblMessageDate', 'Message Date') + " ("
									+ me.dateFilterLabel + ")");*/
									var dateLabel = me.getDateLabel();
										if(Ext.isEmpty(dateLabel))
										{
											dateLabel = me.dateLabelVar;
										}
										else
										dateLabel.setText(getLabel('lblMessageDate', 'Broadcast Date') + " ("
									+ me.dateFilterLabel+ ")");		
									
								}
								
								var vFromDate = Ext.util.Format.date(Ext.Date.parse(objDateParams.fieldValue1, 'Y-m-d'),strExtApplicationDateFormat);
								var vToDate = Ext.util.Format.date(Ext.Date.parse(objDateParams.fieldValue2, 'Y-m-d'),strExtApplicationDateFormat);
							
								if (index == '13')
				{
					if (objDateParams.operator == 'eq')
						datePickerRef.val(vFromDate);
					else
						datePickerRef.val([vFromDate+' to '+vToDate]);
				} 
				else 
				{
					if (index === '1' || index === '2' || index === '12') 
					{
						if (index === '12') 
							datePickerRef.val([vFromDate+' to '+vToDate]);
						else
							datePickerRef.val(vFromDate);
				} 
				else
					datePickerRef.val([vFromDate+' to '+vToDate]);		
		}
						},
					getDateParam : function(index) {
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
								dtJson = objDateHandler.getThisWeekStartAndEndDate(date);
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
								var frmDate = me.getFromEntryDate().getValue();
								var toDate = me.getToEntryDate().getValue();
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
								var fromDate = new Date(Ext.Date.parse(latestFromDate, dtFormat));
								var toDate = new Date(Ext.Date.parse(latestToDate, dtFormat));		
								fieldValue1 = Ext.Date.format(fromDate,strSqlDateFormat);
								fieldValue2 = Ext.Date.format(toDate, strSqlDateFormat);
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
	/*----------------------------Reports Handling----------------------------*/					
					handleReportAction : function(btn, opts) {
						var me = this;
						me.downloadReport(btn.itemId);
					},
					downloadReport : function(actionName) {
						var me = this;
						var withHeaderFlag = document.getElementById("headerCheckbox").checked;
						var arrExtension = {
							downloadXls : 'xls',
							downloadCsv : 'csv',
							loanDownloadPdf : 'pdf',
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

						strExtension = arrExtension[actionName];
						strUrl = 'services/getBroadCastMessageList/getBroadCastMessageDynamicReport.'
								+ strExtension;
						strUrl += '?$skip=1';
						var objGroupView = me.getGroupView();
						var subGroupInfo = objGroupView.getSubGroupInfo();
						var groupInfo = objGroupView.getGroupInfo();
						var strQuickFilterUrl = me.getFilterUrl(subGroupInfo, groupInfo);
						strUrl += strQuickFilterUrl;
						var strOrderBy = me.reportOrderByURL;
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
						var grid = me.getGrid();
						viscols = grid.getAllVisibleColumns();
						for (var j = 0; j < viscols.length; j++) {
							col = viscols[j];
							if (col.dataIndex && arrSortColumnReport[col.dataIndex]) {
								if (colMap[arrSortColumnReport[col.dataIndex]]) {
									// ; do nothing
								} else {
									colMap[arrSortColumnReport[col.dataIndex]] = 1;
									colArray.push(arrSortColumnReport[col.dataIndex]);

								}
							}

						}
						if (colMap != null) {

							visColsStr = visColsStr + colArray.toString();
                            strSelect = '&$select=' + colArray.toString();
						}

						strUrl = strUrl + strSelect;
						form = document.createElement('FORM');
						form.name = 'frmMain';
						form.id = 'frmMain';
						form.method = 'POST';
						form.appendChild(me.createFormField('INPUT', 'HIDDEN',
								csrfTokenName, tokenValue));
						form.appendChild(me.createFormField('INPUT', 'HIDDEN', 'txtCurrent',
								currentPage));
						form.appendChild(me.createFormField('INPUT', 'HIDDEN', 'txtCSVFlag',
								withHeaderFlag));
						form.action = strUrl;
						document.body.appendChild(form);
						form.submit();
						document.body.removeChild(form);
					},	
					createFormField : function(element, type, name, value) {
						var inputField;
						inputField = document.createElement(element);
						inputField.type = type;
						inputField.name = name;
						inputField.value = value;
						return inputField;
					},					
					/*----------------------------Preferences Handling Starts----------------------------*/
					toggleSavePrefrenceAction : function(isVisible) {
						var me = this;
						var btnPref = me.getBtnSavePreferences();
						if (!Ext.isEmpty(btnPref))
							btnPref.setDisabled(!isVisible);
					},
					toggleClearPrefrenceAction : function(isVisible) {
						var me = this;
						var btnPref = me.getBtnClearPreferences();
						if (!Ext.isEmpty(btnPref))
							btnPref.setDisabled(!isVisible);
					},				
				
					handleSavePreferences : function()
						{
							var me = this;
							/*if($("#savePrefMenuBtn").attr('disabled')) 
								event.preventDefault();
							else
								me.doSavePreferences();*/
								var arrPref = me.getPreferencesToSave(false);
								if (arrPref) {
									me.preferenceHandler.savePagePreferences(me.strPageName, arrPref,
											me.postHandleSavePreferences, null, me, true);
								}
								me.disablePreferencesButton("savePrefMenuBtn",true);
								me.disablePreferencesButton("clearPrefMenuBtn",false);	
						},
					postHandleSavePreferences : function(data, args, isSuccess) {
						var me = this;						
					},
					updateConfig : function() {
						var me = this;
						me.dateHandler = Ext.create('Ext.ux.gcp.DateUtil');
						me.preferenceHandler = Ext.create('Ext.ux.gcp.PreferencesHandler');
						me.disablePreferencesButton("savePrefMenuBtn",true);
						me.disablePreferencesButton("clearPrefMenuBtn",false);	
					},
					handleClearPreferences : function() {
							var me = this;						
							/*if($("#clearPrefMenuBtn").attr('disabled')) 
								event.preventDefault();
							else
							{
								me.doClearPreferences();
							}*/
							me.preferenceHandler.clearPagePreferences(me.strPageName, null,
							me.postHandleClearPreferences, null, me, true);
							me.disablePreferencesButton("savePrefMenuBtn",false);
							me.disablePreferencesButton("clearPrefMenuBtn",true);
						},
					postHandleClearPreferences : function(data, args, isSuccess) {
						var me = this;
						if (isSuccess === 'Y') {
							//me.toggleSavePrefrenceAction(true);
						} else {
							//me.toggleClearPrefrenceAction(false);
						}
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
						var objFilterPref = {};
						//objFilterPref.clientName = me.getClientAutoCompleter().getRawValue();
						 var clientFilter = me.getClientAutoCompleter();						
						if(Ext.isEmpty(clientFilter ))
						{
							objFilterPref.clientName = me.clientFilter;
							var desc = me.clientFilterDesc;
						}
						else											
						objFilterPref.clientName = me.getClientAutoCompleter().getRawValue();
						
						var subjectFilter = me.getMessageCompleter();
						if(Ext.isEmpty( subjectFilter))
						{
							objFilterPref.msgFilter = me.subjectFilter;
							var desc = me.clientFilterDesc;
						}
						else
						objFilterPref.msgFilter = me.getMessageCompleter().getValue();
						
						if( me.dateFilterVal === '7' )
						{

							if( !Ext.isEmpty( me.dateFilterFromVal ) && !Ext.isEmpty( me.dateFilterToVal ) )
							{
								objFilterPref.fromDate = me.dateFilterFromVal;
								objFilterPref.toDate = me.dateFilterToVal;	
							}
							else
							{
								var strSqlDateFormat = 'Y-m-d';
								var frmDate = me.getFromEntryDate().getValue();
								var toDate = me.getToEntryDate().getValue();
								fieldValue1 = Ext.util.Format.date( frmDate, 'Y-m-d' );
								fieldValue2 = Ext.util.Format.date( toDate, 'Y-m-d' );
								objFilterPref.fromDate = fieldValue1;
								objFilterPref.toDate = fieldValue2;												
							}							
						}
						if(!Ext.isEmpty(me.dateFilterVal))	
						{
							objFilterPref.dateIndex = me.dateFilterVal;	
						}	
						return objFilterPref;
					}

					/*----------------------------Preferences Handling Ends----------------------------*/					

				});
function showMsgPopup(popupTitle, txtId, subject) {
	
	$('#broadcastViewPopup').dialog({
		autoOpen : false,
		width: 550,
		title : popupTitle,
	    modal : true,
	    resizable: false,
	    draggable: false,
	  open:function(){
		  $('#subjectID').text(subject);
		  $('#viewMsg').val(txtId);
	  }
	});
	$('#broadcastViewPopup').dialog("open");	
}
function getDecodedValue(str)
{
	var parser = new DOMParser;
	var dom = parser.parseFromString(
	    '<!doctype html><body>' + str,
	    'text/html');
	var decodedString = dom.body.textContent;
	return decodedString ;
}
function downloadView(htmlUrl, broadcastId, bIsDynamicHtmlMode)
{
	if(bIsDynamicHtmlMode){
		Ext.Ajax.request({
			url : 'downloadHtmlFile.srvc?'+csrfTokenName + '=' + csrfTokenValue + '&$brodcastId='+ broadcastId,
			method : 'POST',
			contentType: 'text/html',
			success : function(response) {
				htmlContent = response.responseText;
				var win = window.open("","Ratting","left=250,top=180,width=600,height=400,0,status=0,");
				win.document.title = 'Broadcast Message';
				win.document.body.innerHTML = htmlContent;
			}});
	}else if(!Ext.isEmpty(htmlUrl)){
		 window.open(htmlUrl,"Ratting","left=250,top=180,width=600,height=400,0,status=0,");
	}
}

function downloadAttachmentFile(strFileName)
{
		var frm = document.getElementById('clientDownloadNewsForm');
		var me = this;
		frm.target = "downloadWin";
		frm.action = "clientDownloadNewsAttachment.form";
		frm.appendChild(me.createFormField('INPUT', 'HIDDEN',
				csrfTokenName, tokenValue));
		document.getElementById('downloadFileName').value = strFileName;
		frm.submit();
}