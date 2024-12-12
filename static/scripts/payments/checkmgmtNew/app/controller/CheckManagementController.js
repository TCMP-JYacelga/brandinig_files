Ext.define('GCP.controller.CheckManagementController', {
	extend : 'Ext.app.Controller',
	requires : ['GCP.view.NonCMSStopPayGroupGridView', 'GCP.view.HistoryPopup'],
	views : ['GCP.view.NonCMSStopPayView','GCP.view.CheckManagementResViewPopup',
	         'GCP.view.CheckManagementViewPopup','GCP.view.CheckManagementStopPayViewPopup','GCP.view.CheckManagementMultiViewPopup','Ext.ux.gcp.PageSettingPopUp'],
	/**
	 * Array of configs to build up references to views on page.
	 */
	refs : [{
				ref : 'pageSettingPopUp',
				selector : 'pageSettingPopUp'
			},{
				ref : 'nonCMSView',
				selector : 'nonCMSView'
			},
			{
				ref : 'nonCMSGridGroupView',
				selector : 'nonCMSView nonCMSGridGroupView'
			},
			{
				ref : 'groupView',
				selector : 'nonCMSGridGroupView groupView'
			},
			{
				ref : 'gridGridView',
				selector : 'checkManagementViewPopup[itemId="responseViewGrid"] container[itemId="responseItemId"]' 
			},
			{
				ref : 'stopPaySingleView',
				selector : 'checkManagementStopPayViewPopup[itemId="responseStopPayViewGrid"] container[itemId="responseItemId"]' 
			},
			{
				ref : 'chkMgmtMultiRespGrid',
				selector : 'checkManagementMultiViewPopup grid[itemId="gridChkMgmtRespItemId"]'
			},
			{
				ref : 'checkManagementMultiViewPopupId',
				selector : 'checkManagementMultiViewPopup panel[itemId="chkMgmtMultiRespGrid"]'
			},
			{
				ref : 'chkMgmtViewPopupRef',
				selector : 'checkManagementMultiViewPopup[itemId="gridChkMgmtMultiResp"]'
			},
			{
				ref : 'reasonRef',
				selector : 'checkManagementMultiViewPopup[itemId="gridChkMgmtMultiResp"] textfield[itemId="reason"]'
			},
			{
				ref : 'expirationDateRef',
				selector : 'checkManagementMultiViewPopup[itemId="gridChkMgmtMultiResp"] textfield[itemId="expirationDate"]'
			},
			{
				ref : 'replacementCheckRef',
				selector : 'checkManagementMultiViewPopup[itemId="gridChkMgmtMultiResp"] textfield[itemId="replacementCheck"]'
			},
			{
				ref : 'chkMgmtSingleViewPopupRef',
				selector : 'checkManagementViewPopup[itemId="responseViewGrid"]'
			},
			{
				ref : 'sellerClientMenuBar',
				selector : 'nonCMSView nonCMSStopFilterView panel[itemId="sellerClientMenuBar"]'
			},
			{
				ref : 'filterBtn',
				selector : 'nonCMSView nonCMSStopFilterView button[itemId="filterBtnId"]'
			}, 
			{
				ref: 'sellerField',
				selector: 'nonCMSView nonCMSStopFilterView panel combobox[itemId="checkMgtSellerCode"]'
			}, 
			{
				ref : 'chkMgmtRealTimeRespGrid',
				selector : 'checkManagementResViewPopup grid[itemId="gridChkMgmtRealTimeRespItemId"]'
			},{
				ref : 'checkManagementResViewPopupId',
				selector : 'checkManagementResViewPopup panel[itemId="chkMgmtRealTimeRespGrid"]'
			},{
				ref : 'chkMgmtViewRTPopupRef',
				selector : 'checkManagementResViewPopup[itemId="gridChkMgmtRealTimeRespItemId"]'
			},
			{
				ref : 'realTimeCanceButton',
				selector : 'checkManagementResViewPopup  button[itemId="cancelBtn"]'
			},
			{
				ref : 'realTimeContinBackgroundBtn',
				selector : 'checkManagementResViewPopup button[itemId="contInBackground"]'
			},
			{
				ref : 'chkmageButton',
				selector : 'nonCMSView[itemId="gridViewMstId"]  button[itemId="btnChkImg"]'
			},
			/*Quick Filter starts...*/
			{
				ref:'filterView',
				selector:'filterView'	
			},{
				ref:"filterButton",
				selector : "groupView button[itemId=filterButton]"
			},{
				ref:'nonCMSStopFilterView',
				selector:'nonCMSStopFilterView'
			},{
				ref : 'entryDate',
				selector : 'nonCMSStopFilterView button[itemId="entryDate"]'
			},{
				ref : 'dateLabel',
				selector : 'nonCMSStopFilterView label[itemId="dateLabel"]'
			},{
				ref : 'entryDate',
				selector : 'nonCMSStopFilterView button[itemId="entryDate"]'
			},{
				ref : 'savedFiltersCombo',
				selector : 'nonCMSStopFilterView  combo[itemId="savedFiltersCombo"]'
			}
			/*Quick Filter ends...*/
			],
	config : {
		selectedNonCMS : 'checkMgmt',
		filterData : [],
		advFilterData : [],
		objAdvFilterPopup : null,
		statusVal : null,
		moduleVal : null,
		categoryVal : null,
		subCategoryVal : null,
		copyByClicked : '',
		activeFilter : null,
		typeFilterVal : 'all',
		filterApplied : 'ALL',
		showAdvFilterCode : null,
		actionFilterVal : 'all',
		actionFilterDesc : 'all',
		typeFilterDesc : 'all',
		dateFilterVal : defaultDateIndex,
		dateRangeFilterVal : '13',
		dateFilterFromVal : '',
		dateFilterToVal : '',
		dateFilterLabel : getDateIndexLabel(defaultDateIndex),
		filterCodeValue : null,
		savePrefAdvFilterCode : null,
		urlGridPref : 'userpreferences/checkMgmt/gridView.srvc',
		urlGridFilterPref : 'userpreferences/checkMgmt/gridViewFilter.srvc',
		commonPrefUrl : 'services/userpreferences/checkMgmt.json',
		dateHandler : null,
		customizePopup:null,
		objChkMgmtRespMultiPopup : null,
		preferenceHandler:null,
		objChkMgmtRealtimeRespMultiPopup : null,
		strDefaultMask : '000000000000000000',
		reportGridOrder : null,
		datePickerSelectedDate : [],
		datePickerSelectedReqDate : [],
		datePickerSelectedCheckDate : [],
		savedFilterVal : '',
		clientFilterVal : 'all',
		clientFilterDesc : 'All Companies',
		strPageName : 'checkMgmt',
		checkDateFilterVal : '',
		requestDateFilterVal : '',
		checkDateFilterLabel : getLabel('today', 'Today'),
		requestDateFilterLabel : getLabel('lblLatest', 'Latest'),
		objLocalData : null,
		entryDateChanged : false
	},
	/**
	 * A template method that is called when your application boots. It is
	 * called before the Application's launch function is executed so gives a
	 * hook point to run any code before your Viewport is created.
	 */
	init : function() {
		var me = this;	
		me.firstLoad = true;
		me.dateHandler = Ext.create('Ext.ux.gcp.DateUtil');
		if(objSaveLocalStoragePref){
			me.objLocalData = Ext.decode(objSaveLocalStoragePref);
			var filterType = me.objLocalData && me.objLocalData.d.preferences
								&& me.objLocalData.d.preferences.tempPref 
								&& me.objLocalData.d.preferences.tempPref.filterAppliedType ? me.objLocalData.d.preferences.tempPref.filterAppliedType : {};
			me.filterApplied = (!Ext.isEmpty(filterType)) ? filterType : 'ALL';			
		}
		me.updateConfig();
		me.updateFilterConfig();
		var date = new Date(Ext.Date.parse(dtApplicationDate, strExtApplicationDateFormat));
		clientFromDate = me.dateHandler.getDateBeforeDays(date,filterDays);
		
	$(document).on('handleSavedFilterClick', function(event) {
					me.handleSavedFilterClick();
				});
		$(document).on('savePreference', function(event) {
					me.handleSavePreferences();
				});
		$(document).on('clearPreference', function(event) {
					me.handleClearPreferences();
					
				});
		$(document).on('stopAction', function(event,btn) {
					me.addStopPayRequest();
				});
		$(document).on('loadResponseSmartGrid', function(event,record) {
					me.loadResponseSmartGrid(record);
				});
		$(document).on('addNewCmsInqId', function(event,pageName) {
					 checkCutOffTime("CHENQUIRY,", "", "", "", "N");
				});
		$(document).on('addNewCmsStopPayId', function(event,pageName) {
					 checkCutOffTime("CHSTPPAY,", "", "", "", "N");
				});
		$(document).on('addNewCmsCancelStopPayId', function(event,pageName) {
			 isCancelStopPayReq = true;
			 checkCutOffTime("CHSTPPAY,", "", "", "", "N");
		});
		$(document).on('addNewCmsAdvStopPayId', function(event,pageName) {
			 isAdvStopPayReq = true;
			 me.addChkInqRequest();
			 //checkCutOffTime("CHENQUIRY,", "", "", "", "N");
		});
		
		$(document).on('performReportAction', function(event,actionName) {
					 me.handleReportAction(actionName);
				});
		$(document).on('filterDateChange',function(event, filterType, btn, opts) {
			if (filterType=="entryDateQuickFilter"){
				var savedFilterComboBox = me.getNonCMSStopFilterView().down('combo[itemId="savedFiltersCombo"]');
				if(!Ext.isEmpty(me.savedFilterVal))
					me.savedFilterVal = "";
				savedFilterComboBox.setValue(me.savedFilterVal);
				$("#msSavedFilter").val("");
				$("#msSavedFilter").multiselect("refresh");
				$("#saveFilterChkBox").attr('checked', false);
				$("input[type='text'][id='filterCode']").val("");
				me.advFilterCodeApplied = "";
				 me.handleEntryDateChange(filterType,btn,opts);
			 }
			else if (filterType=="entryDate"){
				 me.requestDateChange(btn,opts);
			 }
			else if (filterType=="checkDate"){
				 me.checkDateChange(btn,opts);
			 }
		});
		$(document).on('saveAndSearchActionClicked', function() {
					me.saveAndSearchActionClicked(me);
				});
		$(document).on('searchActionClicked', function() {
					me.searchActionClicked(me);
				});
		$(document).on('resetAllFieldsEvent', function(event, bIsClearBtnClicked) {
					me.resetAllFields(bIsClearBtnClicked);
					me.filterCodeValue = null;
				});
		$(document).on('viewFilterEvent', function(event, grid, rowIndex) {
					me.viewFilterData(grid, rowIndex);
				});
		$(document).on('editFilterEvent', function(event, grid, rowIndex) {
					me.editFilterData(grid, rowIndex);
				});
		$(document).on('deleteFilterEvent', function(event, filterCode) {
					me.deleteFilterSet(filterCode);
				});
		$(document).on('orderUpGridEvent',
				function(event, grid, rowIndex, direction) {
					me.orderUpDown(grid, rowIndex, direction)
				});
		$(document).on("datePickPopupSelectedDate",function(event, filterType, dates) {
					if (filterType == "entryDate") {
						//me.datePickerSelectedDate = dates;
						me.dateRangeFilterVal = '13';
						me.datePickerSelectedReqDate = dates;
						me.requestDateFilterVal = me.dateRangeFilterVal;
						me.requestDateFilterLabel = getLabel('daterange', 'Date Range');
						me.handleAdvFilterEntryDateChange(me.dateRangeFilterVal);
						entry_date_opt = " (" + me.requestDateFilterLabel + ")";
					}else if(filterType=="checkDate"){
						//me.datePickerSelectedDate = dates;
						me.dateRangeFilterVal = '13';
						me.datePickerSelectedCheckDate = dates;
						me.checkDateFilterVal = me.dateRangeFilterVal;
						me.checkDateFilterLabel = getLabel('daterange', 'Date Range');
						me.handleAdvFilterCheckDateChange(me.dateRangeFilterVal);
						process_date_opt = " (" +me.checkDateFilterLabel + ")";
					}
				});
		$(document).on('handleClientChangeInQuickFilter',function(isSessionClientFilter) {
			me.handleClientChangeInQuickFilter(isSessionClientFilter);
		});
		
		$(document).on('performPageSettings', function(event) {
			me.showPageSettingPopup('PAGE');
		});
		
		$(document).off('approvalConfirmed');
		$(document).on('approvalConfirmed', function(eventName, objArgs) {
			var strUrl = objArgs[0];
			var remarks = objArgs[1];
			var grid = objArgs[2];
			var arrSelectedRecords = objArgs[3];
			var strActionType = objArgs[4];
			var strAction = objArgs[5];
			me.preHandleGroupActions(strUrl, remarks, grid, arrSelectedRecords,
					strActionType, strAction);
		});
		me.objChkMgmtRealtimeRespMultiPopup = Ext.create( 'GCP.view.CheckManagementResViewPopup',
				{
					parent : 'nonCMSView',
					itemId : 'gridChkMgmtRealTimeRespItemId'
				});
		this.dateHandler = me.getController('GCP.controller.DateHandler');
		//me.updateAdvFilterConfig();
		
		me.control({
			'nonCMSView' : {
			beforerender : function(panel, opts) {
			}, 
			afterrender : function(panel, opts) {

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
		 'nonCMSGridGroupView groupView' : {
				'groupByChange' : function(menu, groupInfo) {
				},
				'groupTabChange' : function(groupInfo, subGroupInfo, tabPanel,
						newCard, oldCard) {
					me.doHandleGroupTabChange(groupInfo, subGroupInfo,
						tabPanel, newCard, oldCard);
					me.onNonCMSSummaryInformationViewRender();
					//me.toggleSavePrefrenceAction(true);
					me.disablePreferencesButton("savePrefMenuBtn", false);
					me.disablePreferencesButton("clearPrefMenuBtn", false);
					
				},
				'gridRender' : function(groupInfo, subGroupInfo, grid, url, pgSize,
							newPgNo, oldPgNo, sorter, filterData) {					
						me.doHandleLoadGridData(groupInfo, subGroupInfo, grid, url, pgSize,
							newPgNo, oldPgNo, sorter, filterData);
						me.onNonCMSSummaryInformationViewRender();
				},
				'gridPageChange' : me.doHandleLoadGridData,
				'gridSortChange' : me.doHandleLoadGridData,
				'gridPageSizeChange' : me.doHandleLoadGridData,
				'gridColumnFilterChange' : me.doHandleLoadGridData,
				'gridRowSelectionChange' : me.doHandleGridRowSelectionChange,
				'gridStateChange' : function(grid) {
					//me.toggleSavePrefrenceAction(true);
					me.disablePreferencesButton("savePrefMenuBtn", false);
				},
				'gridRowActionClick' : function(grid, rowIndex, columnIndex,
						actionName, record) {
					me.doHandleRowActions(actionName, grid, record);
				},
				'groupActionClick' : function(actionName, isGroupAction,
						maskPosition, grid, arrSelectedRecords) {
					if (isGroupAction === true)
						me.doHandleGroupActions(actionName, grid,
								arrSelectedRecords, 'groupAction');
				},
				'gridStoreLoad' : function(grid, store) {
					me.disableActions(false);
				},
				'render' : function() {
					populateAdvancedFilterFieldValue();
					me.firstTime = true;
					me.applyPreferences();
				},
				'gridSettingClick' : function(){
					me.showPageSettingPopup('GRID');
				},
				afterrender : function() {
					if (objGridViewPref) {
					}
				}
			},
			'filterView' : {
					afterrender : function(tbar, opts) {
						//me.handleDateChange(me.dateFilterVal);
					},
					beforerender : function() {
						var useSettingsButton = me.getFilterView()
								.down('button[itemId="useSettingsbutton"]');
						if (!Ext.isEmpty(useSettingsButton)) {
							useSettingsButton.hide();
						}
					},
					appliedFilterDelete : function(btn){
						me.handleAppliedFilterDelete(btn);
						}
				},
			'nonCMSStopFilterView component[itemId="checkEntryDataPicker"]' : {
				render : function() {
					$('#entryDataPicker').datepick({
								monthsToShow : 1,
								changeMonth : true,
								changeYear : true,
								minDate:dtHistoryDate,
								dateFormat : strApplicationDefaultFormat,
								rangeSeparator : ' to ',
								onClose : function(dates) {
									if (!Ext.isEmpty(dates)) {
										me.dateRangeFilterVal = '13';
										me.datePickerSelectedDate = dates;
										me.datePickerSelectedEntryDate = dates;
										me.dateFilterVal = me.dateRangeFilterVal;
										me.dateFilterLabel = getLabel('daterange', 'Date Range');
										me.handleDateChange(me.dateRangeFilterVal);
										me.filterApplied='Q';
										me.setDataForFilter();
										me.applyQuickFilter();
									}
								}
					});
					if(!Ext.isEmpty(me.savedFilterVal) || me.entryDateChanged === true) {
						var entryDateLableVal = $('label[for="requestDateLabel"]').text();
						var entryDateField = $("#entryDatePicker");
						me.handleEntryDateSync('A', entryDateLableVal, null, entryDateField);
					}
					else{
						me.dateFilterVal = defaultDateIndex; // Set to Default
						me.dateFilterLabel = getDateIndexLabel(defaultDateIndex);
						me.handleDateChange(me.dateFilterVal);
						me.setDataForFilter();
						me.applyQuickFilter();
					}
				}
			},
			'filterView label[itemId="createAdvanceFilterLabel"]' : {
				'click' : function() {
					showAdvanceFilterPopup();
					me.assignSavedFilter();
					/*if(!Ext.isEmpty(me.advFilterCodeApplied))
						{
						var applyAdvFilter = false;
						me.getSavedFilterData(me.advFilterCodeApplied, me.populateSavedFilter,
								applyAdvFilter);
						}*/
					
				}
			},
			'filterView button[itemId="clearSettingsButton"]' : {
				'click' : function() {
					me.handleClearSettings();
				}
			},
			'nonCMSStopFilterView' : {
						handleSavedFilterItemClick : function(comboValue,
								comboDesc) {
									me.savedFilterVal = comboValue;
							me.doHandleSavedFilterItemClick(comboValue);
							//me.disablePreferencesButton("savePrefMenuBtn", false);
							//me.disablePreferencesButton("clearPrefMenuBtn", false);
						}
						/*handleClientChangeInQuickFilter : function(combo) {
							me.handleClientChangeInQuickFilter(combo);
						},*/
						/*dateChange : function(btn, opts) {
								me.dateFilterVal = btn.btnValue;
								me.dateFilterLabel = btn.text;
								me.handleDateChange(btn.btnValue);
								if (btn.btnValue !== '7') {
									// TODO: To be handled
									me.filterApplied = 'Q';
									me.setDataForFilter();
									me.applyQuickFilter();
									me.disablePreferencesButton("savePrefMenuBtn", false);
									me.disablePreferencesButton("clearPrefMenuBtn", false);
									//me.toggleSavePrefrenceAction(true);
								}
							}*/
					},
			
			'nonCMSView nonCMSStopFilterView button[itemId="newFilter"]' : {
				click : function(btn, opts) {
					me.advanceFilterPopUp(btn);
				}
			},
			'nonCMSView nonCMSStopFilterView toolbar[itemId="advFilterActionToolBar"]' : {
				handleSavedFilterItemClick : me.handleFilterItemClick

			},
			'nonCMSView  button[itemId="addNewCmsStopPayId"]' :
			{
				click : function( btn, opts )
				{
					//me.addStopPayRequest();
					checkCutOffTime("CHSTPPAY,", "", "", "", "N");
				}
			},
			'nonCMSView  button[itemId="addNewCmsInqId"]' :
			{
				
				click : function( btn, opts )
				{
					 checkCutOffTime("CHENQUIRY,", "", "", "", "N");
  					 //me.addChkInqRequest();
				}
			},
			'checkManagementMultiViewPopup[itemId="gridChkMgmtMultiResp"]' :
			{
				closeChkMgmtMultiViewPopup : function(btn)
				{
					me.closeChkMgmtMultiViewPopup(btn);
				}
			},
			'checkManagementResViewPopup[itemId="gridChkMgmtRealTimeRespItemId"]' :
			{
				closeChkMgmtResViewPopup : function(btn)
				{
					me.closeChkMgmtResViewPopup(btn);
				}
			},
			'checkManagementViewPopup[itemId="responseViewGrid"]' :
			{
				stopAction : function(btn)
				{
					me.addStopPayRequest();
				}
			},
			'nonCMSView ' : {
				performReportAction : function(btn, opts) {
					//me.handleReportAction(btn, opts);
				},
				afterrender : function() {
				}
			},
			
			'nonCMSStopFilterView  combo[itemId="savedFiltersCombo"]' :{
				'afterrender' : function(combo, newValue, oldValue, eOpts) {
					if (!Ext.isEmpty(me.savedFilterVal)) {
				
						combo.setValue(me.savedFilterVal);
					}
				},
				'boxready' : function(combo, width, height, eOpts) {
					if (!Ext.isEmpty(me.savedFilterVal)) {
				
						combo.setValue(me.savedFilterVal);
					}
				}
			},
			'nonCMSView nonCMSStopFilterView button[itemId="filterBtnId"]' : {
				click : function(btn, opts) {
					me.setDataForFilter();
					me.applyQuickFilter();
				}
			},
			'checkManagementResViewPopup combobox[itemId="trackNmbr"]' : {
				change : function( combo, newValue, oldValue)
				{
					me.callCheckStatus(combo, newValue, oldValue);
				}
			}
		});
		if(showPopUp == 'Y')
		{
			var arrayJson = new Array();
			arrayJson.push({
				identifier : newrecid
			});
			me.checkStatus(arrayJson,'newRec/accept.srvc', newrecid);
		}
		
		GCP.getApplication().on(
		{
					addChkInqRequest : function( yes )
					{
						me.addChkInqRequest( yes );
					},
					addStopPayRequest : function( yes )
					{
						me.addStopPayRequest( yes );
					}
		});
		if(isAdv == 'Y')
    	{
	    	var arrayJson = new Array();
			arrayJson.push({
				identifier : newrecid
			});
			me.checkStatus(arrayJson,'newRec/accept.srvc', newrecid);
    	}
	},
	
	updateConfig : function() {
		var me = this;
		me.dateHandler = Ext.create('Ext.ux.gcp.DateUtil');
		me.preferenceHandler = Ext.create('Ext.ux.gcp.PreferencesHandler');
	},
	postReadPanelPrefrences : function (data, args, isSuccess) {
		var me = this;
		if(!Ext.isEmpty(data))
		objGridViewPref=data.preference;
	},
	handleRowIconClick : function(tableView, rowIndex, columnIndex, btn, event,
			record) {
		var me = this;
		var actionName = btn.itemId;
		if (actionName === 'submit' || actionName === 'accept'
				|| actionName === 'reject' || actionName === 'discard'
				|| actionName === 'enable' || actionName === 'disable' 
				|| actionName === 'cancel' || actionName === 'btnCancel'
				|| actionName === 'stopPay' || actionName === 'btnStopPay' || actionName === 'inquiry')
		{
				me.handleGroupActions(btn, record);
		}
		else if (actionName === 'btnHistory') {
			var recHistory = record.get('history');

			if (!Ext.isEmpty(recHistory)
					&& !Ext.isEmpty(recHistory.__deferred.uri)) {
				me.showHistory(record.get('history').__deferred.uri, record.get('identifier'));
			}
		} else if (actionName === 'btnView') {
			var type = record.get('description');
		
			if(type === 'Stop Pay' || type === 'Cancel Stop Pay')
			{
				var singleChk = record.get('singleChk');
				if(!Ext.isEmpty(singleChk) && (singleChk === 'Y'))
				{
					//show single response view
					//me.showSingleStopPayResponseView(record);					
					showSingleStopPayResPopUp(record,type);				
				}
				else
				{
					//show multiple response view
					//me.showStopPayMultipleResponseView(record);
					showMultiStopPayResPopUp(record);
				}
			}
			else if(type === 'Check Inquiry')
			{
				var singleChk = record.get('singleChk');
				if(!Ext.isEmpty(singleChk) && (singleChk === 'Y'))
				{
					//show single response view
					//me.showSingleResponseView(record);
					showSingleCheckInquiryResPopUp(record);
				}
				else
				{
					//show multiple response view
					//me.showMultipleResponseView(record);
					showMultiStopPayResPopUp(record);
				}
			}
		} else if (actionName === 'btnStopPay') {
			
			me.addStopPayRequest();
		}else if (actionName === 'btnChkImg') {
			var singleChk = record.get('singleChk');
			var status = record.get('requestState');
			var type = record.get('description');
			if(type === 'Check Inquiry' && ( status == 8 || status == 13 || status == 14 ) )
			{
				if(!Ext.isEmpty(singleChk) && (singleChk === 'Y'))
				{
					//show single check response image
					me.showCheckImage(record,'F');
				}
				else
				{
					//show multiple response image
					//me.showMultipleResponseView(record);
					showMultiStopPayResPopUp(record);
				}
			}
			else
			{	
				var chkImgbtn = me.getChkmageButton();
				chkImgbtn.hide();
			}
		}else if(actionName === 'btnChkImg1')
		{
			var type = record.get('description');
			//if(type === 'Inquiry')
			//{
				me.showCheckImage(record,'F');
			//}
		}
	},
	doHandleRowActions : function(actionName, objGrid, record) {
		var me = this;
		var groupView = me.getGroupView();
		var grid = groupView.getGrid();
		if (actionName === 'submit' || actionName === 'accept'
				|| actionName === 'reject' || actionName === 'discard'
				|| actionName === 'enable' || actionName === 'disable' || actionName === 'cancel' || actionName === 'btnCancel' || actionName === 'inquiry' )
		{
			me.doHandleGroupActions(actionName, grid, [record], 'rowAction');
		}
		else if (actionName === 'btnHistory') {
			var recHistory = record.get('history');

			if (!Ext.isEmpty(recHistory)
					&& !Ext.isEmpty(recHistory.__deferred.uri)) {
				me.showHistory(record.get('history').__deferred.uri, record.get('identifier'));
			}
		} else if (actionName === 'btnView') {
			var type = record.data.description;
		
			if(type === 'Stop Pay' || type === 'Cancel Stop Pay')
			{
				var singleChk = record.get('singleChk');
				if(!Ext.isEmpty(singleChk) && (singleChk === 'Y'))
				{
					//show single response view
					//me.showSingleStopPayResponseView(record);					
					showSingleStopPayResPopUp(record,type);					
				}
				else
				{
					//show multiple response view
					//me.showStopPayMultipleResponseView(record);
					showMultiStopPayResPopUp(record);
				}
			}
			else if(type === 'Check Inquiry')
			{
				var singleChk = record.get('singleChk');
				if(!Ext.isEmpty(singleChk) && (singleChk === 'Y'))
				{
					//show single response view
					//me.showSingleResponseView(record);
					showSingleCheckInquiryResPopUp(record);
				}
				else
				{
					//show multiple response view
					//me.showMultipleResponseView(record);
					showMultiStopPayResPopUp(record);
				}
			}
		} else if (actionName === 'btnStopPay') {
			
			me.addStopPayRequest();
		}else if (actionName === 'btnChkImg') {
			var singleChk = record.get('singleChk');
			var status = record.get('requestState');
			var type = record.get('description');
			if( ( type === 'Check Inquiry' || type === 'Stop Pay' || type === 'Cancel Stop Pay' ))
			{
				if(!Ext.isEmpty(singleChk) && (singleChk === 'Y'))
				{
					//show single check response image
					me.showCheckImage(record,'F');
				}
				else
				{
					//show multiple response image
					//me.showMultipleResponseView(record);
					showMultiStopPayResPopUp(record);
				}
			}
			else
			{	
				var chkImgbtn = me.getChkmageButton();
				chkImgbtn.hide();
			}
		}else if(actionName === 'btnChkImg1')
		{
			var type = record.get('description');
			if(type === 'Check Inquiry')
			{
				me.showCheckImage(record,'F');
			}
		}
	},	
	showHistory : function(url, id) {
		Ext.create('GCP.view.HistoryPopup', {
					//historyUrl : url+'?'+csrfTokenName+'='+csrfTokenValue,
					historyUrl:url,
					identifier : id
				}).show();
		Ext.getCmp('btnChkMgmtHistoryPopupClose').focus();
	},
	doHandleLoadGridData : function(groupInfo, subGroupInfo, grid, url, pgSize,
			newPgNo, oldPgNo, sorter, filterData) {
		var me = this;
		var objGroupView = me.getGroupView();
		var buttonMask = me.strDefaultMask;
		me.disableActions(true);
		var arrOfParseQuickFilter = [], arrOfParseAdvFilter = [], arrOfFilteredApplied = [];
		/*if (!$('#actionResultDiv').hasClass('ui-helper-hidden')) {
			$('#actionResultDiv').addClass('ui-helper-hidden');
			if ($('#actionResultInfoDiv').children('.row').length > 0) {
				$('#actionResultInfoDiv').children('.row').remove();
			}
		}*/
		
		//saving local prefrences
		if(allowLocalPreference === 'Y')
			me.handleSaveLocalStorage();
		
		objActionResult = {
			'order' : []
		};
		
		var intPageNo = me.objLocalData && me.objLocalData.d && me.objLocalData.d.preferences
				&& me.objLocalData.d.preferences.tempPref
				&& me.objLocalData.d.preferences.tempPref.pageNo
				? me.objLocalData.d.preferences.tempPref.pageNo
				: null, intOldPgNo = oldPgNo , intNewPgNo = newPgNo;
				
		if(!Ext.isEmpty(intPageNo) && me.firstLoad)	{
			intNewPgNo = intPageNo;
			intOldPgNo = intPageNo;
		}
		me.firstLoad = false;
		objGroupView.handleGroupActionsVisibility(buttonMask);
		var strUrl = grid.generateUrl(url, pgSize, intNewPgNo, intOldPgNo, sorter);
		me.reportGridOrder = strUrl;
		strUrl += me.getFilterUrl(subGroupInfo, groupInfo)+'&'+csrfTokenName+'='+csrfTokenValue;
		me.disableActions(true);
		if(allowLocalPreference === 'Y')
			me.handleSaveLocalStorage();
			
		if(!Ext.isEmpty(me.filterData)){
			if(!Ext.isEmpty(me.filterData) && me.filterData.length >= 1){
				arrOfParseQuickFilter = generateFilterArray(me.filterData);
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
		grid.loadGridData(strUrl, null, null, false);
		
		grid.on('cellclick', function(tableView, td, cellIndex, record, tr, rowIndex, e) {
			var clickedColumn = tableView.getGridColumns()[cellIndex];
			var columnType = clickedColumn.colType;
			if(Ext.isEmpty(columnType)) {
				var containsCheckboxCss = (clickedColumn.cls.indexOf('x-column-header-checkbox') > -1)
				columnType = containsCheckboxCss ? 'checkboxColumn' : '';
			}
			me.handleGridRowClick(record, grid, columnType);
		});
	},
	
	enableValidActionsForGrid : function(grid, record, recordIndex,
			selectedRecords, jsonData) {
		var me = this;
		var buttonMask = '0000000000';
		var maskArray = new Array(), actionMask = '', objData = null;;

		if (!Ext.isEmpty(jsonData) && !Ext.isEmpty(jsonData.d.__buttonMask)) {
			buttonMask = jsonData.d.__buttonMask;
		}
		var isSameUser = true;
		maskArray.push(buttonMask);
		for (var index = 0; index < selectedRecords.length; index++) {
			objData = selectedRecords[index];
			maskArray.push(objData.get('__metadata').__rightsMap);
			if (objData.raw.makerId === USER) {
				isSameUser = false;
			}

		}
		var applicable = false;
		if(record.data.description === 'Stop Pay' && !isHidden('AuthReqStopPay')){
			applicable = true;
		}
		else if(record.data.description === 'Cancel Stop Pay' && !isHidden('AuthReqCancelStop')){
			applicable = true;
		}
		else if(record.data.description === 'Check Inquiry'){
			applicable = true;
		}
		if(!applicable) isSameUser = false;
		
		actionMask = doAndOperation(maskArray, 10);
		me.enableDisableGroupActions(actionMask, isSameUser);
	},
	doHandleGroupActions : function(strAction, grid, arrSelectedRecords,
			strActionType) {
		var me = this;
		var strUrl = Ext.String.format('{0}List/{1}.srvc',
				me.selectedNonCMS, strAction);
		if (strAction === 'reject') {
			this.showRejectVerifyPopUp(strAction, strUrl, grid,
					arrSelectedRecords, strActionType);

		}
		else if(strAction === 'btnCancel')
		{
			strUrl = 'checkMgmtSingleList/cancel.srvc';
			this.preHandleDtlGroupActions(strUrl, '', arrSelectedRecords);
		}
		else {
			if ('Y' === chrApprovalConfirmationAllowed && strAction === 'accept')
				this.showApprovalConfirmationPopupView(strUrl, '', grid,
						arrSelectedRecords, strActionType, strAction);	
			else
				this.preHandleGroupActions(strUrl, '', grid, arrSelectedRecords,
					strActionType, strAction);
			
		}
		
	},
	
	handleGroupActions : function(btn, record)
	{
		var me = this;
		var strAction = !Ext.isEmpty(btn.actionName)
				? btn.actionName
				: btn.itemId;
		var strUrl = Ext.String.format('{0}List/{1}.srvc',
				me.selectedNonCMS, strAction);
		if (strAction === 'reject')
		{
			this.showRejectVerifyPopUp(strAction, strUrl, record);
		}
		else if(strAction === 'btnCancel')
		{
			strUrl = 'checkMgmtSingleList/cancel.srvc';
			this.preHandleDtlGroupActions(strUrl, '', record);
		}
		else if(strAction === 'btnStopPay')
		{
			strUrl = 'checkMgmtSingleList/stop.srvc';
			this.preHandleDtlGroupActions(strUrl, '', record);
		}
		else if(strAction === 'inquiry')
		{
			strUrl = 'checkMgmtList/inquiry.srvc';
			this.preHandleDtlGroupActions(strUrl, '', record);
		}
		else
		{
			this.preHandleGroupActions(strUrl, '', record);
		}
	},
	
	showRejectVerifyPopUp : function(strAction, strActionUrl, grid,
			arrSelectedRecords, strActionType) {
		var me = this;
		var titleMsg = '', fieldLbl = '';
		if (strAction === 'reject') {
			fieldLbl = getLabel('chkMgmtRejectRemarkPopUpTitle',
					'Please Enter Reject Remark');
			titleMsg = getLabel('chkMgmtRejectRemarkPopUpFldLbl', 'Reject Remark');
		}
		var msgbox = Ext.Msg.show({
			title : titleMsg,
			msg : fieldLbl,
			buttons : Ext.Msg.OKCANCEL,
			multiline : 4,
			cls: 't7-popup',
			width: 355,
			height : 270,
			bodyPadding : 0,
			fn : function(btn, text) {
				if (btn == 'ok') {
					me.preHandleGroupActions(strActionUrl, text,
									grid, arrSelectedRecords,
									strActionType, strAction);
				}
			}
		});
		msgbox.textArea.enforceMaxLength = true;
		msgbox.textArea.inputEl.set({
			maxLength : 255
		});
	},

	preHandleGroupActions : function(strUrl, remark, grid, arrSelectedRecords,
			strActionType, strAction) {

		var me = this;
		var groupView = me.getGroupView();
		if (!Ext.isEmpty(groupView)) {
			var me = this;
			if (!Ext.isEmpty(grid)) {
				var arrayJson = new Array();
				var records = (arrSelectedRecords || []);
				for (var index = 0; index < records.length; index++) {
					arrayJson.push({
								serialNo : grid.getStore().indexOf(records[index])
									+ 1,
							identifier : records[index].data.identifier,
							userMessage : remark
						});
				}
				
				if (arrayJson)
					arrayJson = arrayJson.sort(function(valA, valB) {
							return valA.serialNo - valB.serialNo
						});
			groupView.setLoading(true);
			Ext.Ajax.request({
						url : strUrl+'?'+csrfTokenName+'='+csrfTokenValue,
						method : 'POST',
						jsonData : Ext.encode(arrayJson),
						success : function(jsonData) {
							var jsonRes = Ext.JSON
										.decode(jsonData.responseText);
								stopRefresh = 'N';
								if(jsonRes && jsonRes.d && !jsonRes.d.auth)
								{
								me.checkStatus(jsonRes,strUrl, null );
								grid.refreshData();
								}
								groupView.setLoading(false);
								
						},
						failure : function() {
							var errMsg = "";
							Ext.MessageBox.show({
										title : getLabel(
												'instrumentErrorPopUpTitle',
												'Error'),
										msg : getLabel(
												'instrumentErrorPopUpMsg',
												'Error while fetching data..!'),
										buttons : Ext.MessageBox.OK,
										icon : Ext.MessageBox.ERROR
									});
						}
					});
	    	}
			
		}

	},
	preHandleDtlGroupActions : function(strUrl, remark, record) {

		var me = this;
		var groupView = me.getGroupView();
		var headerGrid = groupView.getGrid();
		var grid = me.getChkMgmtMultiRespGrid();
		if (!Ext.isEmpty(grid)) {
			var arrayJson = new Array();
			var records = grid.getSelectedRecords();
			records = (!Ext.isEmpty(records) && Ext.isEmpty(record))
					? records
					: [record];
			for (var index = 0; index < records.length; index++) {
				arrayJson.push({
							serialNo : grid.getStore().indexOf(records[index])
									+ 1,
							identifier : records[index].data.identifier,
							userMessage : remark
						});
			}
			if (arrayJson)
				arrayJson = arrayJson.sort(function(valA, valB) {
							return valA.serialNo - valB.serialNo
						});

			Ext.Ajax.request({
						url : strUrl+'?'+csrfTokenName+'='+csrfTokenValue,
						method : 'POST',
						jsonData : Ext.encode(arrayJson),
						success : function(response) {
							// TODO : Action Result handling to be done here
							//me.enableDisableGroupActions('0000000000', true);
							grid.refreshData();
							headerGrid.refreshData();
						},
						failure : function() {
							var errMsg = "";
							Ext.MessageBox.show({
										title : getLabel(
												'instrumentErrorPopUpTitle',
												'Error'),
										msg : getLabel(
												'instrumentErrorPopUpMsg',
												'Error while fetching data..!'),
										buttons : Ext.MessageBox.OK,
										icon : Ext.MessageBox.ERROR
									});
						}
					});
		}

	},
	isRowIconVisible : function(store, record, jsonData, itmId, maskPosition) {
		var maskSize = 11;
		var maskArray = new Array();
		var actionMask = '';
		var rightsMap = record.data.__metadata.__rightsMap;
		var buttonMask = '';
		var retValue = true;
		var bitPosition = '';
		var applicable = false;
		if(record.data.description === 'Stop Pay' && !isHidden('AuthReqStopPay')){
			applicable = true;
		}
		else if(record.data.description === 'Cancel Stop Pay' && !isHidden('AuthReqCancelStop')){
			applicable = true;
		}
		else if(record.data.description === 'Check Inquiry'){
			applicable = true;
		}
		if (!Ext.isEmpty(maskPosition)) {
			bitPosition = parseInt(maskPosition,10) - 1;
			maskSize = maskSize;
		}
		if (!Ext.isEmpty(jsonData) && !Ext.isEmpty(jsonData.d.__buttonMask))
			buttonMask = jsonData.d.__buttonMask;
		maskArray.push(buttonMask);
		maskArray.push(rightsMap);
		actionMask = doAndOperation(maskArray, maskSize);

		var isSameUser = true;
		if (record.raw.makerId === USER) {
			isSameUser = false;
		}
		if (Ext.isEmpty(bitPosition))
			return retValue;
		retValue = isActionEnabled(actionMask, bitPosition);

		if ((maskPosition === 6 && retValue)) {
			retValue = retValue && isSameUser && applicable;;
		} else if (maskPosition === 7 && retValue) {
			retValue = retValue && isSameUser && applicable;
		} else if (maskPosition === 8 && (record.data.description != 'Check Inquiry'))
		{
			retValue = false;
		}
		return retValue;
	},
	isRowMoreMenuVisible : function(store, record, jsonData, itmId, menu) {
		var me = this;
		if (!Ext.isEmpty(record.get('isEmpty'))
				&& record.get('isEmpty') === true)
			return false;
		var arrMenuItems = null;
		var isMenuVisible = false;
		var blnRetValue = true;
		if (!Ext.isEmpty(menu.items) && !Ext.isEmpty(menu.items.items))
			arrMenuItems = menu.items.items;

		if (!Ext.isEmpty(arrMenuItems)) {
			for (var a = 0; a < arrMenuItems.length; a++) {
				blnRetValue = me.isRowIconVisible(store, record, jsonData,
						itmId, arrMenuItems[a].maskPosition);
				isMenuVisible = (isMenuVisible || blnRetValue) ? true : false;
			}
		}
		return isMenuVisible;
	},
	enableDisableGroupActions : function(actionMask, isSameUser) {
		var actionBar = this.getActionBarSummDtl();
		var blnEnabled = false, strBitMapKey = null, arrItems = new Array();
		if (!Ext.isEmpty(actionBar) && !Ext.isEmpty(actionBar.items.items)) {
			arrItems = actionBar.items.items;
			Ext.each(arrItems, function(item) {
						strBitMapKey = parseInt(item.maskPosition,10) - 1;
						if (strBitMapKey) {
							blnEnabled = isActionEnabled(actionMask,
									strBitMapKey);
							if ((item.maskPosition === 6 && blnEnabled)) {
								blnEnabled = blnEnabled && isSameUser;
							} else if (item.maskPosition === 7 && blnEnabled) {
								blnEnabled = blnEnabled && isSameUser;
							}
							item.setDisabled(!blnEnabled);
						}
					});
		}
	},
	handleRowMoreMenuClick : function(tableView, rowIndex, columnIndex, btn,
			event, record) {
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
		if (!Ext.isEmpty(menu.items) && !Ext.isEmpty(menu.items.items))
			arrMenuItems = menu.items.items;
		if (!Ext.isEmpty(arrMenuItems)) {
			for (var a = 0; a < arrMenuItems.length; a++) {
				blnRetValue = me.isRowIconVisible(store, record, jsonData,
						null, arrMenuItems[a].maskPosition);
				arrMenuItems[a].setVisible(blnRetValue);
			}
		}
		menu.showAt(event.xy[0] + 5, event.xy[1] + 5);
	},
	setInfoTooltip : function() {
		var me = this;
		var infotip = Ext.create('Ext.tip.ToolTip', {
					target : 'nonCMSStopFilterView-1159_header_hd-textEl',
					listeners : {
						// Change content dynamically depending on which element
						// triggered the show.
						beforeshow : function(tip) {
							var chkMgmtTypeVal = '';
//							var chkMgmtActionVal = '';
							var dateFilter = me.dateFilterLabel;

							if (me.typeFilterVal == 'all' && me.filterApplied == 'ALL') {
								chkMgmtTypeVal = 'All';
								me.showAdvFilterCode = null;
							} else {
								chkMgmtTypeVal = me.typeFilterDesc;
							}
							var advfilter = me.showAdvFilterCode;
							if (advfilter == '' || advfilter == null)
							{
								advfilter = getLabel('none', 'None');
							}

							tip.update('Type'
									+ ' : ' + chkMgmtTypeVal + '<br/>'
									+ getLabel('lblreqdate', 'Request Date') + ' : '
									+ dateFilter + '<br/>'
								/*	+ getLabel('actions', 'Actions') + ' : '
									+ chkMgmtActionVal + '<br/>'*/
									+getLabel('advancedFilter', 'Advanced Filter') + ':'
									+ advfilter);
						}
					}
				});
	},
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
	updateDateFilterView : function() {
		var me = this;
		var dtEntryDate = null;
		if (!Ext.isEmpty(me.dateFilterVal)) {
			me.handleDateChange(me.dateFilterVal);
			if (me.dateFilterVal === '7') {
				if (!Ext.isEmpty(me.dateFilterFromVal)) {
					dtEntryDate = Ext.Date.parse(me.dateFilterFromVal, "Y-m-d");
					me.getFromEntryDate().setValue(dtEntryDate);
				}
				if (!Ext.isEmpty(me.dateFilterToVal)) {
					dtEntryDate = Ext.Date.parse(me.dateFilterToVal, "Y-m-d");
					me.getToEntryDate().setValue(dtEntryDate);
				}
			}
		}

	},
	handleDateChange : function(index) {
		var me = this;
		var objDateParams = me.getDateParam(index);
		var datePickerRef=$('#entryDataPicker');
		
		if (!Ext.isEmpty(me.dateFilterLabel)) {
			me.getDateLabel().setText(getLabel('lblreqdate', 'Request Date') + "("
					+ me.dateFilterLabel + ")");
		}
		/*var vFromDate = Ext.util.Format.date(Ext.Date.parse(objDateParams.fieldValue1, 'Y-m-d'),strExtApplicationDateFormat);
		var vToDate = Ext.util.Format.date(Ext.Date.parse(objDateParams.fieldValue2, 'Y-m-d'),strExtApplicationDateFormat);*/
		var vFromDate = Ext.Date.parse(objDateParams.fieldValue1, 'Y-m-d');
		var vToDate = Ext.Date.parse(objDateParams.fieldValue2, 'Y-m-d');
		
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
		if (objDateParams.operator == 'eq')
				dateToField = "";
			else
				dateToField = Ext.util.Format.date(vToDate,strExtApplicationDateFormat);
			
		selectedRequestDateFilter = {
				operator : objDateParams.operator,
				fromDate : Ext.util.Format.date(vFromDate,strExtApplicationDateFormat),
				toDate : dateToField,
				dateLabel : me.dateFilterLabel
			};					
		me.handleEntryDateSync('Q', me.getDateLabel().text, " (" + me.dateFilterLabel + ")", datePickerRef);
	},
	
	getDateParam : function(index,dateType) {
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
			dtJson = objDateHandler.getThisWeekToDate( date );
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
			var fromDate = new Date(Ext.Date.parse(latestFromDate, dtFormat));
			var toDate = new Date(Ext.Date.parse(latestToDate, dtFormat));
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
				if(!isEmpty(me.datePickerSelectedDate)){
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
				if('entryDate' === dateType &&!isEmpty(me.datePickerSelectedReqDate)){
					if (me.datePickerSelectedReqDate.length == 1) {
						fieldValue1 = Ext.Date.format(me.datePickerSelectedReqDate[0],
								strSqlDateFormat);
						fieldValue2 = fieldValue1;
						operator = 'eq';
					} else if (me.datePickerSelectedReqDate.length == 2) {
						fieldValue1 = Ext.Date.format(me.datePickerSelectedReqDate[0],
								strSqlDateFormat);
						fieldValue2 = Ext.Date.format(me.datePickerSelectedReqDate[1],
								strSqlDateFormat);
						operator = 'bt';
					}
				}
				if('checkDate' === dateType &&!isEmpty(me.datePickerSelectedCheckDate)){
					if (me.datePickerSelectedCheckDate.length == 1) {
						fieldValue1 = Ext.Date.format(me.datePickerSelectedCheckDate[0],
								strSqlDateFormat);
						fieldValue2 = fieldValue1;
						operator = 'eq';
					} else if (me.datePickerSelectedCheckDate.length == 2) {
						fieldValue1 = Ext.Date.format(me.datePickerSelectedCheckDate[0],
								strSqlDateFormat);
						fieldValue2 = Ext.Date.format(me.datePickerSelectedCheckDate[1],
								strSqlDateFormat);
						operator = 'bt';
					}
				}
		
		}
		// comparing with client filter condition
		/*if (Ext.Date.parse(fieldValue1, strSqlDateFormat) < clientFromDate) {
			fieldValue1 = Ext.Date.format(clientFromDate, strSqlDateFormat);
		}*/
		retObj.fieldValue1 = fieldValue1;
		retObj.fieldValue2 = fieldValue2;
		retObj.operator = operator;
		return retObj;
	},
	onNonCMSSummaryInformationViewRender : function() {
		var me = this;
		me.setGridInfoSummary();
	},
	setGridInfoSummary : function( grid )
	{
		var me = this;
		var groupView = me.getGroupView();
		var nonCMSGridRef = groupView.getGrid();
		if (!Ext.isEmpty(nonCMSGridRef))
		{
		var dataStore = nonCMSGridRef.store;
		dataStore.on( 'load', function( store, records )	
		{
			var summaryData = [];
			var ammount = "0.00 (#0)";
			var ccy="$"
			var i = records.length - 1;
			if( i >= 0 )
			{
				if(!Ext.isEmpty(records[ i ].get( 'ccySymbol' )))
				   ccy=records[ i ].get( 'ccySymbol' );
				
				if(!Ext.isEmpty(records[ i ].get( 'checkInquiryReqAmt' )))
					ammount = records[ i ].get( 'checkInquiryReqAmt' ) + " ("+records[ 0 ].get( 'checkInquiryReqCount' )+")";
				   
				summaryData.push({
					key: "Check Inquiry Request",
					value: ammount
					}) 
				ammount = ccy+" 0.00 (#0)";
				
				if(!Ext.isEmpty(records[ i ].get( 'stopPayAmt' )))
					ammount = records[ i ].get( 'stopPayAmt' ) + " ("+records[ 0 ].get( 'stopPayCount' )+")";
					
				summaryData.push({
					key: "Stop Pay Request",
					value: ammount
					})
				ammount = ccy+" 0.00 (#0)";
				if(!Ext.isEmpty(records[ i ].get( 'cancelStopReqAmt' )))
					ammount = records[ i ].get( 'cancelStopReqAmt' ) + " ("+records[ 0 ].get( 'cancelStopReqCount' )+")";
					
				summaryData.push({
					key: "Cancel Stop Pay Request",
					value: ammount
					})
			}
			else
			{
				summaryData=[{
					key: "Check Inquiry Request",
					value:ccy+" 0.00 (#0)"
				},{
					key: "Stop Pay Request",
					value:ccy+" 0.00 (#0)"
				},{
					key: "Cancel Stop Pay Request",
					value:ccy+" 0.00 (#0)"
				}]		
			}
			$('#summaryCarousal').carousel({
					data : summaryData,
					titleNode : "key",
					contentRenderer: function(value) {
						return  value.value;
					}								
			});	
		});
		}
	},
	generateInformationUrl : function() 
	{
		var me = this;
		var strUrl = 'checkMgmtInfoSummary.srvc?';
		var dtParams = me.getDateParam(me.dateFilterVal);
		var operator = dtParams.operator;
		var fieldValue1 = dtParams.fieldValue1;
		var fieldValue2 = dtParams.fieldValue2;
		
		if (!Ext.isEmpty(me.dateFilterVal)) 
		{
			if (Ext.isEmpty(dtParams.fieldValue1)) {
				fieldValue1 = me.dateFilterFromVal;
				fieldValue2 = me.dateFilterToVal;
			}
			if(!Ext.isEmpty(fieldValue1) || !Ext.isEmpty(fieldValue2))
			{
				if ("eq" === dtParams.operator) {
					strUrl = strUrl + '&$filter=' + 'EntryDate' + ' ' + operator
							+ ' ' + 'date\'' + fieldValue1 + '\'';
				} else {
					strUrl = strUrl + '&$filter=' + 'EntryDate' + ' ' + operator
							+ ' ' + 'date\'' + fieldValue1 + '\'' + ' and '
							+ 'date\'' + fieldValue2 + '\'';
				}
			}
		}
		strUrl = strUrl+'&'+csrfTokenName+'='+csrfTokenValue;
		return strUrl;
	},
	
	// This function will called only once
	updateAdvFilterConfig : function() {
		var me = this;
		if (!Ext.isEmpty(objGridViewFilter)) {
			var data = Ext.decode(objGridViewFilter);
			if (!Ext.isEmpty(data.advFilterCode)) {
				me.showAdvFilterCode = data.advFilterCode;
				me.savePrefAdvFilterCode = data.advFilterCode;
				var strUrl = 'userfilters/checkMgmtFilter/{0}.srvc';
				strUrl = Ext.String.format(strUrl, data.advFilterCode);
				Ext.Ajax.request({
					url : strUrl,
					async : false,
					method : 'GET',
					/*params :
					{
						csrfTokenName : tokenValue
					},*/
					success : function(response) {
						var responseData = Ext.decode(response.responseText);

						var applyAdvFilter = false;
						me.populateSavedFilter(data.advFilterCode,
								responseData, applyAdvFilter);
						var objOfCreateNewFilter = me.getCreateNewFilter();
						var objJson = objOfCreateNewFilter
								.getAdvancedFilterQueryJson(objOfCreateNewFilter);

						me.advFilterData = objJson;

					},
					failure : function() {
						var errMsg = "";
						Ext.MessageBox.show({
									title : getLabel(
											'instrumentErrorPopUpTitle',
											'Error'),
									msg : getLabel('instrumentErrorPopUpMsg',
											'Error while fetching data..!'),
									buttons : Ext.MessageBox.OK,
									icon : Ext.MessageBox.ERROR
								});

					}
				});
			}
		}
	},
	
	updateFilterConfig : function() {
		var me = this;
		var arrJsn = new Array();
		// TODO : Localization to be handled..
		var objDateLbl = {
			'' : getLabel('latest', 'Latest'),
			'1' : getLabel( 'today', 'Today' ),
            '2' : getLabel( 'yesterday', 'Yesterday' ),
            '3' : getLabel( 'thisweek', 'This Week' ),
            '4' : getLabel( 'lastweek', 'Last Week To Date' ),
            '5' : getLabel( 'thismonth', 'This Month' ),
            '6' : getLabel( 'lastmonth', 'Last Month To Date' ),
            '14' : getLabel('lastmonthonly', 'Last Month Only'),
           // '7' : getLabel( 'daterange', 'Date Range' ),
            '8' : getLabel( 'thisquarter', 'This Quarter' ),
            '9' : getLabel( 'lastQuarterToDate', 'Last Quarter To Date' ),
            '10' : getLabel( 'thisyear', 'This Year' ),
            '11' : getLabel( 'lastyeartodate', 'Last Year To Date' ),
			'12' : getLabel( 'latest', 'Latest' ),
			'13' : getLabel('daterange', 'Date Range')
		};				
	if (!Ext.isEmpty(objCheckManagementPref)) {
			var objJsonData = Ext.decode(objCheckManagementPref);
			var data = objJsonData.d.preferences.groupViewFilterPref;
			if (!Ext.isEmpty(data)) {
				var strDtValue = data.quickFilter.entryDate;
				var strDtFrmValue = data.quickFilter.entryDateFrom;
				var strDtToValue = data.quickFilter.entryDateTo;
				if(!Ext.isEmpty(data.filterSelectedClientCode) && data.filterSelectedClientCode !='all'){
							me.clientFilterVal = data.filterSelectedClientCode;
							me.clientFilterDesc = data.filterSelectedClientDesc;
						}
				if (!Ext.isEmpty(strDtValue)) {
					me.dateFilterLabel = objDateLbl[strDtValue];
					me.dateFilterVal = strDtValue;
					if (strDtValue === '13') {
						if (!Ext.isEmpty(strDtFrmValue))
							me.dateFilterFromVal = strDtFrmValue;
						me.datePickerSelectedDate[0]=Ext.Date.parse(strDtFrmValue, 'Y-m-d')
						if (!Ext.isEmpty(strDtToValue))
							me.dateFilterToVal = strDtToValue;
						me.datePickerSelectedDate[1]=Ext.Date.parse(strDtToValue, 'Y-m-d')
					}
				}
				
				if (!Ext.isEmpty(me.dateFilterVal)) {
					var strVal1 = '', strVal2 = '', strOpt = 'eq';
					if (me.dateFilterVal !== '13') {
						var dtParams = me.getDateParam(me.dateFilterVal);
						if (!Ext.isEmpty(dtParams)
								&& !Ext.isEmpty(dtParams.fieldValue1)) {
							strOpt = dtParams.operator;
							strVal1 = dtParams.fieldValue1;
							strVal2 = dtParams.fieldValue2;
						}
					} else {
						strOpt = 'bt';
						if (!Ext.isEmpty(me.dateFilterVal)
								&& !Ext.isEmpty(me.dateFilterFromVal)) {
							strVal1 = me.dateFilterFromVal;
		
							if (!Ext.isEmpty(me.dateFilterToVal)) {
								// strOpt = 'bt';
								strVal2 = me.dateFilterToVal;
							}
						}
					}
					if ((!Ext.isEmpty(strVal1) && (strOpt === 'eq' || strOpt === 'le'))
							|| (!Ext.isEmpty(strVal1) && !Ext.isEmpty(strVal2) && strOpt === 'bt'))
						arrJsn.push({
									paramName : 'EntryDate',
									paramValue1 : strVal1,
									paramValue2 : strVal2,
									operatorValue : strOpt,
									dataType : 'D'
								});
				}
				if (entity_type == '1') {
					$("#summaryClientFilterSpan").text(me.clientFilterDesc);
					changeClientAndRefreshGrid(me.clientFilterVal,me.clientFilterDesc)
				}else if(entity_type=='0'){
					$("#summaryClientFilter").val(me.clientFilterDesc);
					changeClientAndRefreshGrid(me.clientFilterVal,me.clientFilterDesc)
				}
				arrJsn = me.createAndSetJsonForFilterData();
				var advFilterCode = data.advFilterCode;
				me.savedFilterVal = advFilterCode;
				me.doHandleSavedFilterItemClick(advFilterCode);
			}
		}
		me.filterData = arrJsn;
	},
	createAndSetJsonForFilterData : function() {
		var me = this;
		var arrJsn = new Array();
		if (!Ext.isEmpty(me.dateFilterVal)) {
			var strVal1 = '', strVal2 = '', strOpt = 'eq';
			if (me.dateFilterVal !== '13') {
				var dtParams = me.getDateParam(me.dateFilterVal);
				if (!Ext.isEmpty(dtParams)
						&& !Ext.isEmpty(dtParams.fieldValue1)) {
					strOpt = dtParams.operator;
					strVal1 = dtParams.fieldValue1;
					strVal2 = dtParams.fieldValue2;
				}
			} else {
				strOpt = 'bt';
				if (!Ext.isEmpty(me.dateFilterVal)
						&& !Ext.isEmpty(me.dateFilterFromVal)) {
					strVal1 = me.dateFilterFromVal;

					if (!Ext.isEmpty(me.dateFilterToVal)) {
						// strOpt = 'bt';
						strVal2 = me.dateFilterToVal;
					}
				}
			}
			if ((!Ext.isEmpty(strVal1) && (strOpt === 'eq' || strOpt === 'le'))
					|| (!Ext.isEmpty(strVal1) && !Ext.isEmpty(strVal2) && strOpt === 'bt'))
				arrJsn.push({
							paramName : 'EntryDate',
							paramValue1 : strVal1,
							paramValue2 : strVal2,
							operatorValue : strOpt,
							dataType : 'D'
						});
			}	
		if (me.clientFilterVal != null && me.clientFilterVal != 'all') {
			arrJsn.push({
						paramName : 'clientCode',
						paramValue1 : encodeURIComponent(me.clientFilterVal.replace(new RegExp("'", 'g'), "\''")),
						operatorValue : 'eq',
						dataType : 'S'
					});
		}
		return arrJsn;
	},	
	postReadfilterPrefrences : function (data, args, isSuccess) {
		var me = this;
		if (data && data.preference) {
			objGridViewFilter=data.preference;
		}	
	},
	setDataForFilter : function(filterData) {
		var me = this;
		var arrQuickJson = {};
	    me.advFilterData = {};
		me.filterData = me.getQuickFilterQueryJson();
		var objJson = (!Ext.isEmpty(filterData) ? filterData.filterBy : getAdvancedFilterQueryJson());
		var reqJson = me.findInAdvFilterData(objJson, "EntryDate");
		if (!Ext.isEmpty(reqJson)) {
			arrQuickJson = me.filterData;
			arrQuickJson = me.removeFromQuickArrJson(arrQuickJson, "EntryDate");
			me.filterData = arrQuickJson;
		}
		me.advFilterData = objJson;
		var filterCode = $("input[type='text'][id='filterCode']").val();
		if(!Ext.isEmpty(filterCode))
			me.advFilterCodeApplied = filterCode;		
	},
	getQuickFilterQueryJson : function() {
		var me = this;
		
		var typeFilterVal = me.typeFilterVal;
		var jsonArray = [];
		var index = me.dateFilterVal;
		var objDateParams = me.getDateParam(index);
		if (!Ext.isEmpty(objDateParams))
		{
			jsonArray.push({
						paramName : 'EntryDate',
						paramIsMandatory : true,
						paramValue1 : objDateParams.fieldValue1,
						paramValue2 : objDateParams.fieldValue2,
						operatorValue : objDateParams.operator,
						dataType : 'D',
						paramFieldLable : getLabel('lblreqdate', 'Request Date')
					});
		}
		if (typeFilterVal != null && typeFilterVal != 'all') {
			jsonArray.push({
						paramName : me.getNonCMSTypeToolBar().filterParamName,
						paramValue1 : encodeURIComponent(typeFilterVal.replace(new RegExp("'", 'g'), "\''")),
						operatorValue : 'eq',
						dataType : 'S'
					});
		}
		var filterView = me.getFilterView();
		
		if (!Ext.isEmpty(me.clientFilterVal) && me.clientFilterVal !='all') {
			jsonArray.push({
						paramName : 'clientCode',
						paramValue1 : encodeURIComponent(me.clientFilterVal.replace(new RegExp("'", 'g'), "\''")),
						operatorValue : 'eq',
						dataType : 'S'
					});
		}
		return jsonArray;
	},
	renderTypeFilter : function() 
	{
		var me = this;
		
		if( me.typeFilterVal != 'all')
		{
			me.getNonCMSTypeToolBar().items.each(function(item) 
			{
				item.removeCls('xn-custom-heighlight');
				item.addCls('xn-account-filter-btnmenu');
				
				if ( me.typeFilterVal == item.code )
				{
					item.addCls('xn-custom-heighlight xn-account-filter-btnmenu');
				}
			});
		}
		
		me.setDataForFilter();
		if (me.typeFilterVal === 'all'){
			me.filterApplied = 'ALL';
			me.applyQuickFilter();
		} 
		else
		{
			me.applyQuickFilter();
		}
	},
	applyFilter : function() {
		var me = this;
		var groupView = me.getGroupView();
		var grid = groupView.getGrid();		
		var groupInfo = groupView.getGroupInfo() || '{}';
		var subGroupInfo = groupView.getSubGroupInfo() || {};
		if (!Ext.isEmpty(grid)) {
			var strDataUrl = grid.store.dataUrl;
			var store = grid.store;
			var strUrl = grid.generateUrl(strDataUrl, grid.pageSize, 1, 1,
					store.sorters);
			strUrl = strUrl + me.getFilterUrl(subGroupInfo, groupInfo)+'&'+csrfTokenName+'='+csrfTokenValue;
			grid.setLoading(true);
			grid.loadGridData(strUrl, me.handleAfterGridDataLoad, null);
		}
	},
	
	applyQuickFilter : function() {
		var me = this;
		var groupView = me.getGroupView();
		var grid = groupView.getGrid();		
		var groupInfo = groupView.getGroupInfo() || '{}';
		var subGroupInfo = groupView.getSubGroupInfo() || {};
		me.filterApplied = 'Q';
		// TODO : Currently both filters are in sync
		/*if (!Ext.isEmpty(grid)) {
			var strDataUrl = grid.store.dataUrl;
			var store = grid.store;
			var strUrl = grid.generateUrl(strDataUrl, grid.pageSize, 1, 1,
					store.sorters);
			strUrl = strUrl + me.getFilterUrl(subGroupInfo, groupInfo)+'&'+csrfTokenName+'='+csrfTokenValue;
			grid.setLoading(true);
			grid.loadGridData(strUrl, me.handleAfterGridDataLoad, null);
		}*/
		me.refreshData();
	},
	
	getFilterUrl : function(subGroupInfo, groupInfo) {
		var me = this;
		var strQuickFilterUrl = '', strActionStatusUrl = '', strAdvancedFilterUrl = '', strUrl = '', isFilterApplied = false;

		var strGroupQuery = (subGroupInfo && subGroupInfo.groupQuery)
								? subGroupInfo.groupQuery
								: '';
		if (me.filterApplied === 'ALL')
		{	
			strQuickFilterUrl = me.generateUrlWithQuickFilterParams(me);
			if (!Ext.isEmpty(strQuickFilterUrl)) {
				strUrl += '&$filter=' + strQuickFilterUrl;
				isFilterApplied = true;
			}
		}
		else
		{	
			strQuickFilterUrl = me.generateUrlWithQuickFilterParams(me);
			if (!Ext.isEmpty(strQuickFilterUrl)) {
				strUrl += '&$filter=' + strQuickFilterUrl;
				isFilterApplied = true;
			}
			strAdvancedFilterUrl = me.generateUrlWithAdvancedFilterParams(me);
			if (!Ext.isEmpty(strAdvancedFilterUrl))
			{
				if( strUrl == '' )
					strUrl += '&$filter=' + strAdvancedFilterUrl;
				else
					strUrl += ' and ' + strAdvancedFilterUrl;
				
				isFilterApplied = true;
			}		
		}
		if (!Ext.isEmpty(strGroupQuery)) {
			if (!Ext.isEmpty(strUrl))
				strUrl += ' and ' + strGroupQuery;
			else
				strUrl += '&$filter=' + strGroupQuery;
		if( GranularPermissionFlag == 'Y')
		{
			if( subGroupInfo.groupCode == 'STOP_PAY')
			{								
				strUrl += ' &$checkflag=' + 'stopPayFlag' + ' eq ' + ' ' + '\'Y\'';											
			}
		else if( subGroupInfo.groupCode == 'CHECK_INQUIRY')
			{
				strUrl += ' &$checkflag=' + 'checkInquiryFlag' + ' eq ' + ' ' + '\'Y\'';
			}
		else if( subGroupInfo.groupCode == 'CANCEL_STOP_PAY')
			{	
				strUrl += ' &$checkflag=' + 'cancelStopPayFlag' + ' eq ' + ' ' + '\'Y\'';
			}
			
		}
		}
		else
		{
		if( GranularPermissionFlag == 'Y' )
				{
				strUrl += ' &$checkflag='  + '('+'( '+' requestTypeFlag'+' eq ' + ' '+'\'1\' and stopPayFlag' + ' eq ' + ' ' + '\'Y\'  ) or' 
							+ '( '+' requestTypeFlag'+' eq ' + ' '+'\'2\' and checkInquiryFlag' + ' eq ' + ' ' + '\'Y\') or ' 
							+ '( '+' requestTypeFlag'+' eq ' + ' '+'\'3\' and cancelStopPayFlag' + ' eq ' + ' ' + '\'Y\') ) ' 
				}
		}
		return strUrl;
	},
	generateUrlWithQuickFilterParams : function(me) {

		var filterData = me.filterData;
		var isFilterApplied = false;
		var strFilter = '';
		var strTemp = '';
		var strFilterParam = '';
		for (var index = 0; index < filterData.length; index++) {
			if (isFilterApplied)
				strTemp = strTemp + ' and ';
			
			switch (filterData[index].operatorValue) {
				case 'bt' :
					
					if (filterData[index].dataType === 'D') {
						
						
						strTemp = strTemp + filterData[index].paramName + ' '
								+ filterData[index].operatorValue + ' '
								+ 'date\'' + filterData[index].paramValue1
								+ '\'' + ' and ' + 'date\''
								+ filterData[index].paramValue2 + '\'';
					} else {
						strTemp = strTemp + filterData[index].paramName + ' '
								+ filterData[index].operatorValue + ' ' + '\''
								+ filterData[index].paramValue1 + '\''
								+ ' and ' + '\''
								+ filterData[index].paramValue2 + '\'';
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
		if (isFilterApplied)
			strFilter = strFilter + strTemp;
		else
			strFilter = '';
		return strFilter;
	},
	generateUrlWithAdvancedFilterParams : function(me) {
		var thisClass = this;
		// var filterData = thisClass.filterData;
		var filterData = thisClass.advFilterData;
		var isFilterApplied = false;
		var isOrderByApplied = false;
		// var strFilter = '&$filter=';
		var strFilter = '';
		var strTemp = '';
		var strFilterParam = '';
		var operator = '';
		var isInCondition = false;
		var strDetailUrl = '';

		if (!Ext.isEmpty(filterData)) {
			for (var index = 0; index < filterData.length; index++) {
				isInCondition = false;
				operator = filterData[index].operator;
				if (isFilterApplied
						&& (operator === 'bt' || operator === 'eq'
								|| operator === 'lk' || operator === 'gt' || operator === 'lt' || operator === 'in'|| operator === 'ne')){
					if (filterData[index].detailFilter
							&& filterData[index].detailFilter === 'Y') {
						strDetailUrl = strDetailUrl + ' and ';
						strTemp = strTemp + strDetailUrl;
					} else {
						if(!Ext.isEmpty(strDetailUrl) && Ext.isEmpty(strTemp))
							strTemp = "";
						else
							strTemp = strTemp + ' and ';
					}	
				}
				switch (operator) {
					case 'bt' :
						isFilterApplied = true;
						if (filterData[index].dataType === 1) {
							strTemp = strTemp + filterData[index].field + ' '
									+ filterData[index].operator + ' '
									+ 'date\'' + filterData[index].value1
									+ '\'' + ' and ' + 'date\''
									+ filterData[index].value2 + '\'';
						} else {
							strTemp = strTemp + filterData[index].field + ' '
									+ filterData[index].operator + ' ' + '\''
									+ filterData[index].value1 + '\'' + ' and '
									+ '\'' + filterData[index].value2 + '\'';
						}
						break;
					case 'st' :
						if (!isOrderByApplied) {
							strTemp = strTemp + ' &$orderby=';
							isOrderByApplied = true;
						} else {
							strTemp = strTemp + ',';
						}
						strTemp = strTemp + filterData[index].value1 + ' '
								+ filterData[index].value2;
						break;
					case 'lk' :
						isFilterApplied = true;
						if(filterData[ index ].field == "CheckNum"){
							strTemp = strTemp + '(' + filterData[index].field + ' '
									+ filterData[index].operator + ' ' + '\''
									+ filterData[index].value1 + '\''+' or ('
									+ filterData[index].field + ' le '+ '\'' + filterData[index].value1 + '\'' 
									+' and CheckNumTo ge '+ '\'' 
									+ filterData[index].value1+ '\'' +'))';
							
						}else{
						strTemp = strTemp + filterData[index].field + ' '
								+ filterData[index].operator + ' ' + '\''
								+ filterData[index].value1 + '\'';
						}
						break;
					case 'eq' :
						isInCondition = this.isInCondition(filterData[index]);
						if (filterData[index].dataType === 0 && filterData[index].displayType === 6 && filterData[index].field === 'Amount'){
							isInCondition = true;
						}
						if (isInCondition) {
							var reg = new RegExp(/[\(\)]/g);
							var objValue = filterData[index].value1;
							objValue = objValue.replace(reg, '');
							var objArray = objValue.split(',');
							isFilterApplied = true;
							for (var i = 0; i < objArray.length; i++) {
								strTemp = strTemp + filterData[index].field
										+ ' ' + filterData[index].operator
										+ ' ' + '\'' + objArray[i] + '\'';
								if (i != objArray.length - 1)
									strTemp = strTemp + ' or '
							}
						}else if (filterData[index].dataType === 1 && filterData[index].displayType === 6) {
							isFilterApplied = true;
							strTemp = strTemp + filterData[index].field + ' '
									+ filterData[index].operator + ' '
									+ 'date\'' + filterData[index].value1
									+ '\'';
						}
						else{
							 isFilterApplied = false;
							}
						break;
					case 'gt' :
					case 'lt' :
						isFilterApplied = true;
						if (filterData[index].dataType === 1) {
							strTemp = strTemp + filterData[index].field + ' '
									+ filterData[index].operator + ' '
									+ 'date\'' + filterData[index].value1
									+ '\'';
						} else {
							strTemp = strTemp + filterData[index].field + ' '
									+ filterData[index].operator + ' ' + '\''
									+ filterData[index].value1 + '\'';
						}
						break;
					case 'in':
						isFilterApplied = true;
						//var arrId = null;
						var temp = filterData[ index ].value1;
						
						var arrId = temp.split(",");
						var objValue = filterData[index].value1;
						var filterFieldId = filterData[index].field;
						// objValue = objValue.replace(reg, '');
							if(filterFieldId == 'Account'){
								objValue = decodeURIComponent(objValue);
							}
						var objArray = objValue.split(',');
						var joinVal ='';
						if(filterFieldId == 'Account'){
								objArray.forEach( function(val,indx){
								joinVal = val.indexOf('^') > -1 ? val.replace(/\^/g,',') : val;
								objArray[indx]=encodeURIComponent(joinVal);
							});
						}
						if (arrId[0] != 'All') {
							if( 0 != arrId.length )
							{
							if(filterData[ index ].field == "Account"){

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
												+ filterData[index].field
												+ ' eq ';
										strDetailUrl = strDetailUrl + '\''
												+ objArray[i] + '\'';
										if (i != objArray.length - 1)
											strDetailUrl = strDetailUrl
													+ ' or ';
													blnDtlFilterApplied = true;
									} else {
										strTemp = strTemp
												+ filterData[index].field
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
							else{
								strTemp = strTemp + '(';
								for( var count = 0 ; count < arrId.length ; count++ )
								{
									if(filterData[ index ].field == "RequestState")
									{
										if( arrId[ count ] == "0.A" )
										{
											strTemp = strTemp + '(' +  filterData[ index ].field + ' eq  \'0\' and makerId ne ' + '\'' + USER  + '\'' + ' )';
										}
										else if( arrId[ count ] == "0" )
										{
											strTemp = strTemp + '(' +  filterData[ index ].field + ' eq  \'0\' and makerId eq ' + '\'' + USER  + '\'' + ' )';
										}
										else
										{
											strTemp = strTemp + filterData[ index ].field + ' eq ' + '\'' + arrId[ count ]
											+ '\'';
										}
									}
									else
									{
										strTemp = strTemp + filterData[ index ].field + ' eq ' + '\'' + arrId[ count ]
											+ '\'';
									}
									if( count != arrId.length - 1 )
									{
										strTemp = strTemp + ' or ';
									}
								}
								strTemp = strTemp + ' )';
							}
							}
						}
						break;			
					case 'ne':
						strTemp = strTemp + filterData[ index ].field + ' ' + filterData[ index ].operator
							+ ' ' + '\'' + filterData[ index ].value1 + '\'';
						break;
				}
			}
		}
		if (isFilterApplied) {
			if(Ext.isEmpty(strTemp) && strDetailUrl != "")
				strFilter = strFilter + strDetailUrl;
			else if(Ext.isEmpty(strDetailUrl) && strTemp != "")
				strFilter = strFilter + strTemp;
			else {
				if(strDetailUrl!="" && strDetailUrl.trim()=='and')
					strFilter = strFilter + strTemp;
				else
					strFilter = strFilter + strTemp +  strDetailUrl;
			}				
		} else if (isOrderByApplied)
			strFilter = strTemp;
		else
			strFilter = '';
		return strFilter;
	},
	
	isInCondition : function(data) {
		var retValue = false;
		var displayType = data.displayType;
		var strValue = data.value1;
		var reg = new RegExp(/^\((\d\d*,)*\d\d*\)$/);
		if (displayType && (displayType === 4 || displayType === 2 ) && strValue /** && strValue.match(reg)*/)
		{
			retValue = true;
		}

		return retValue;

	},
	orderUpDown : function(grid, rowIndex, direction) {
		var record = grid.getStore().getAt(rowIndex);
		
		var store = grid.getStore();
		if (!record) {
			return;
		}
		var index = rowIndex;
		if (direction < 0) {
			index--;
			if (index < 0) {
				return;
			}
			var beforeRecord = store.getAt(index);
			store.remove(beforeRecord);
			store.remove(record);

			store.insert(index, record);
			store.insert(index + 1, beforeRecord);
		} else {
			if (index >= grid.getStore().getCount() - 1) {
				return;
			}
			var currentRecord = record;
			store.remove(currentRecord);
			var afterRecord = store.getAt(index);
			store.remove(afterRecord);
			store.insert(index, afterRecord);
			store.insert(index + 1, currentRecord);
		}
		this.sendUpdatedOrederJsonToDb(store);
	},
	deleteFilterSet : function(filterCode) {

		var me = this;
		var objFilterName;
		var savedFilterCombobox = me.getFilterView().down('combo[itemId="savedFiltersCombo"]');
		var objComboStore=null;
		if (!Ext.isEmpty(filterCode))
			objFilterName = filterCode;
		me.filterCodeValue = null;

		if (this.savePrefAdvFilterCode == objFilterName) {
			this.advFilterData = [];
			me.filterApplied = 'A';
			//me.applyFilter();
			var jsonArray = [];
			jsonArray.push(me.resetDefaultDateJson());
			this.advFilterData = jsonArray;
			me.savedFilterVal = '';
			me.refreshData();
		}
		if (savedFilterCombobox) {
			objComboStore = savedFilterCombobox.getStore();
			objComboStore.removeAt(objComboStore.find('filterName',objFilterName));
			savedFilterCombobox.setValue('');
		}
		me.deleteFilterCodeFromDb(objFilterName);
		me.sendUpdatedOrederJsonToDb();
		//me.reloadFilters(store);
	},
	deleteFilterCodeFromDb : function( objFilterName )
	{
		var me = this;
		if( !Ext.isEmpty( objFilterName ) )
		{
			var strUrl = 'userfilters/checkMgmtFilter/{0}/remove.srvc?' + csrfTokenName + '=' + csrfTokenValue;
			strUrl = Ext.String.format( strUrl, objFilterName );

			Ext.Ajax.request(
			{
				url : strUrl,
				method : "POST",
				success : function( response )
				{

				},
				failure : function( response )
				{
					console.log( "Error Occured" );
				}
			} );
		}
	},
	sendUpdatedOrederJsonToDb : function(store) {
		var me = this;
		var objJson = {};
		var FiterArray = [];
		var preferenceArray = [];

		$("#msSavedFilter option").each(function() {
					FiterArray.push($(this).val());
				});
		objJson.filters = FiterArray;
		Ext.Ajax.request({
			url : 'userpreferences/checkMgmtList/chkMgmtAdvanceFilter.srvc?'+csrfTokenName+'='+csrfTokenValue,
			method : 'POST',
			jsonData : objJson,			
			async : false,
			success : function(response) {
				me.updateSavedFilterComboInQuickFilter();
				me.resetAllFields();
			},
			failure : function() {
				console.log("Error Occured - Addition Failed");

			}

		});
	},
	closeFilterPopup : function(btn) {
		var me = this;
		me.getAdvanceFilterPopup().close();
	},
	
	viewFilterData : function(grid, rowIndex) {
		var me = this;
		me.resetAllFields();
		var record = grid.getStore().getAt(rowIndex);
		var filterCode = record.data.filterName;
		//var objTabPanel = me.getAdvanceFilterTabPanel();
		var applyAdvFilter = false;
		me.getSavedFilterData(filterCode, this.populateAndDisableSavedFilter,
				applyAdvFilter);
		changeAdvancedFilterTab(1);
	},
	editFilterData : function(grid, rowIndex) {
		var me = this;
		me.resetAllFields();
		var record = grid.getStore().getAt(rowIndex);
		var filterCode = record.data.filterName;
		var filterCodeRef = $("input[type='text'][id='filterCode']");
		if (!Ext.isEmpty(filterCodeRef)) {
			filterCodeRef.val(filterCode);
			filterCodeRef.prop('disabled', true);
		}
		var applyAdvFilter = false;
		me.filterCodeValue = filterCode;
		me.getSavedFilterData(filterCode, this.populateSavedFilter,
				applyAdvFilter);
		changeAdvancedFilterTab(1);
	},
	getSavedFilterData : function(filterCode, fnCallback, applyAdvFilter) {
		var me = this;
		var objJson;
		var strUrl = 'userfilters/checkMgmtFilter/{0}.srvc';
		strUrl = Ext.String.format(strUrl, filterCode);
		Ext.Ajax.request({
					url : strUrl,
					method : 'GET',
					async : false,
					success : function(response) {
					if (!Ext.isEmpty(response)
								&& !Ext.isEmpty(response.responseText)) {
						var responseData = Ext.decode(response.responseText);

						fnCallback.call(me, filterCode, responseData,
								applyAdvFilter);
						}

					},
					failure : function() {
						var errMsg = "";
						Ext.MessageBox.show({
									title : getLabel(
											'instrumentErrorPopUpTitle',
											'Error'),
									msg : getLabel('instrumentErrorPopUpMsg',
											'Error while fetching data..!'),
									buttons : Ext.MessageBox.OK,
									icon : Ext.MessageBox.ERROR
								});
					}
				});
	},
	
	populateAndDisableSavedFilter : function(filterCode, filterData,
			applyAdvFilter) {
		var me = this;
		var currentFilterData = '';
		for (i = 0; i < filterData.filterBy.length; i++) {
			var fieldName = filterData.filterBy[i].field;
			var fieldVal = filterData.filterBy[i].value1;
			var fieldOper = filterData.filterBy[i].operator;
			currentFilterData = filterData.filterBy[i];
			
			if (fieldName === 'Reference') {
				$("#Reference").val(fieldVal);
			} else if (fieldName === 'CheckNum') {
				$("#CheckNum").val(fieldVal);
			} else if (fieldName === 'Account') {
				$("#account").val(fieldVal);
			} else if (fieldName === 'Amount') {
				$("#Amount").val(fieldVal);
			} 
			if (fieldName === 'EntryDate') {
				me.setSavedFilterEntryDate(fieldName, currentFilterData);
			}
			if (fieldName === 'CheckDate') {
				me.setSavedFilterCheckDate(fieldName, currentFilterData);
			}
		}
		$("#filterCode").val(filterCode);
		$("input[type='text'][id='Reference']").prop('disabled', true);
		$("input[type='text'][id='CheckNum']").prop('disabled', true);
		$("input[type='text'][id='Amount']").prop('disabled', true);
		$("input[type='text'][id='account']").prop('disabled', true);
		$("input[type='text'][id='filterCode']").prop('disabled', true);
	},
	handleSearchAction : function(btn) {
		var me = this;
		me.doSearchOnly();
	},
	postDoSaveAndSearch : function() {
		var me = this, objGroupView = null, savedFilterCombobox = me
				.getFilterView().down('combo[itemId="savedFiltersCombo"]');
		var objAdvSavedFilterComboBox, blnOptionPresent = false, arrValues = [];
		if (savedFilterCombobox) {
			savedFilterCombobox.getStore().reload();
			savedFilterCombobox.setValue(me.filterCodeValue);
		}
		var objAdvSavedFilterComboBox = $("#msSavedFilter");
		if (objAdvSavedFilterComboBox) {
			blnOptionPresent = $("#msSavedFilter option[value='"
					+ me.filterCodeValue + "']").length > 0;
			if (blnOptionPresent === true) {
				objAdvSavedFilterComboBox.val(me.filterCodeValue);
			} else if (blnOptionPresent === false) {
				$(objAdvSavedFilterComboBox).append($('<option>', {
							value : me.filterCodeValue,
							text : me.filterCodeValue
						}));

				if (!Ext.isEmpty(me.filterCodeValue))
					arrValues.push(me.filterCodeValue);
				objAdvSavedFilterComboBox.val(arrValues);
				objAdvSavedFilterComboBox.multiselect("refresh");
			}
		}
		me.doSearchOnly();
		objGroupView = me.getGroupView();
		objGroupView.setFilterToolTip(me.filterCodeValue || '');
	},
	doSearchOnly : function() {
		var me = this;
		var entryDateLableVal = $('label[for="requestDateLabel"]').text();
		var entryDateField = $("#entryDatePicker");
		me.handleEntryDateSync('A', entryDateLableVal, null, entryDateField);
		me.applyAdvancedFilter();
	},
	applyAdvancedFilter : function(filterData) {
		var me = this,objGroupView = me.getGroupView();
		me.filterApplied = 'A';
		me.setDataForFilter(filterData);
		//me.applyFilter();
		me.refreshData();
		if (objGroupView)
			objGroupView.toggleFilterIcon(true);
		objGroupView.setFilterToolTip(me.showAdvFilterCode || '');
		//me.resetAllFields();
	},
	searchActionClicked : function(me) {
		var me = this, objGroupView = null, savedFilterCombobox = me
				.getFilterView().down('combo[itemId="savedFiltersCombo"]');
		var SaveFilterChkBoxVal = $("input[type='checkbox'][id='saveFilterChkBox']")
				.is(':checked');
		if (SaveFilterChkBoxVal === true) {
			me.handleSaveAndSearchAction();
		} else {
			me.savedFilterVal = '';
			me.filterCodeValue = '';
			me.doSearchOnly();
			if (savedFilterCombobox)
				savedFilterCombobox.setValue('');
			objGroupView = me.getGroupView();
			objGroupView.setFilterToolTip('');
			$('#advancedFilterPopup').dialog("close");
		}
		var filterCode = $('#filterCode').val();
		me.savedFilterVal = filterCode;
		//me.doSearchOnly();
		//me.updateSavedFilterComboInQuickFilter();
	},
	saveAndSearchActionClicked : function(me) {
		me.savedFilterVal = null;	
		me.handleSaveAndSearchAction();
	},
	handleSaveAndSearchAction : function(btn) {
		var me = this;
		var callBack = this.postDoSaveAndSearch;
		var strFilterCodeVal = null;
		var FilterCode = $("#filterCode").val();
		if (Ext.isEmpty(FilterCode)) {
			//Ext.MessageBox.alert('Input', 'Enter Filter Name');
			paintError('#advancedFilterErrorDiv',
					'#advancedFilterErrorMessage', getLabel('filternameMsg',
							'Please Enter Filter Name'));
			markRequired('#filterCode');
			return;
		}else {
			hideErrorPanel("advancedFilterErrorDiv");
			me.filterCodeValue = FilterCode;
			strFilterCodeVal = me.filterCodeValue;
			me.savedFilterVal = FilterCode;
		}
		//strFilterCodeVal = FilterCode.val();
		//me.savedFilterVal = strFilterCodeVal;	
		me.savePrefAdvFilterCode = strFilterCodeVal;
		/*if (Ext.isEmpty(strFilterCodeVal)) {
			if ($('#advancedFilterErrorDiv').hasClass('ui-helper-hidden')) {
				$('#advancedFilterErrorDiv').removeClass('ui-helper-hidden');
				$('#advancedFilterErrorMessage').text(getLabel('filternameMsg',
						'Please Enter Filter Name'));
			}
		} else {
			if (!$('#advancedFilterErrorDiv').hasClass('ui-helper-hidden')) {
				$('#advancedFilterErrorDiv').addClass('ui-helper-hidden');
			}
			me.postSaveFilterRequest(strFilterCodeVal, callBack);
		}*/
		hideErrorPanel("advancedFilterErrorDiv");
		me.postSaveFilterRequest(strFilterCodeVal, callBack);
	},
	postSaveFilterRequest : function(FilterCodeVal, fncallBack) {
		var me = this;
		var strUrl = 'userfilters/checkMgmtFilter/{0}.srvc';
		strUrl = Ext.String.format(strUrl, FilterCodeVal);
		var objJson;
		objJson =  getAdvancedFilterValueJson(FilterCodeVal);
		Ext.Ajax.request({
					url : strUrl+'?'+csrfTokenName+'='+csrfTokenValue,
					method : 'POST',
					jsonData : Ext.encode(objJson),					
					success : function(response) {
						var responseData = Ext.decode(response.responseText);
						var isSuccess;
						var title, strMsg, imgIcon;
						if (responseData.d.filters
								&& responseData.d.filters.success)
							isSuccess = responseData.d.filters.success;

						if (isSuccess && isSuccess === 'N') {
							title = getLabel('instrumentSaveFilterPopupTitle',
									'Message');
							strMsg = responseData.d.error.errorMessage;
							imgIcon = Ext.MessageBox.ERROR;
							Ext.MessageBox.show({
										title : title,
										msg : strMsg,
										width : 200,
										buttons : Ext.MessageBox.OK,
										icon : imgIcon
									});

						}

						if (FilterCodeVal && isSuccess && isSuccess === 'Y') {
							$('#advancedFilterPopup').dialog('close');
							fncallBack.call(me);
							//me.reloadGridRawData();
							//me.reloadFilters(filterGrid.getStore());
							me.updateSavedFilterComboInQuickFilter();
						}
					},
					failure : function() {
						var errMsg = "";
						Ext.MessageBox.show({
									title : getLabel(
											'instrumentErrorPopUpTitle',
											'Error'),
									msg : getLabel('instrumentErrorPopUpMsg',
											'Error while fetching data..!'),
									buttons : Ext.MessageBox.OK,
									icon : Ext.MessageBox.ERROR
								});
					}
				});

	},
	reloadGridRawData : function()
	{
		var me = this;
		var strUrl = 'userfilterslist/checkMgmtFilter.srvc?';
		var gridView = me.getAdvFilterGridView();
		Ext.Ajax.request(
		{
			url : strUrl,
			method : 'GET',
			async : false, 
			success : function( response )
			{
				var decodedJson = Ext.decode( response.responseText );
				var arrJson = new Array();

				if( !Ext.isEmpty( decodedJson.d.filters ) )
				{
					for( i = 0 ; i < decodedJson.d.filters.length ; i++ )
					{
						arrJson.push(
						{
							"filterName" : decodedJson.d.filters[ i ]
						} );
					}
				}
				gridView.store.loadRawData( arrJson );
				//me.addAllSavedFilterCodeToView( decodedJson.d.filters );
			},
			failure : function( response )
			{
				// console.log("Ajax Get data Call Failed");
			}
		} );
	},
	handleRangeFieldsShowHide : function(objShow) {
		var me = this;

		var objCreateNewFilterPanel = me.getCreateNewFilter();
		var toobj = objCreateNewFilterPanel.down('numberfield[itemId="toAmt"]');
		var tolabelObj = objCreateNewFilterPanel
				.down('label[itemId="Tolabel"]');
		if (toobj && tolabelObj) {
			if (objShow) {
				toobj.show();
				tolabelObj.show();
			} else {
				toobj.hide();
				tolabelObj.hide();
			}
		}
	},
	advanceFilterPopUp : function(btn) {
		var me = this;

		var objCreateNewFilterPanel = me.getCreateNewFilter();
		var filterDetailsTab = me.getFilterDetailsTab();
		filterDetailsTab.setTitle(getLabel('createNewFilter',
				'Create New Filter'));

		var saveSearchBtn = me.getSaveSearchBtn();

		if (saveSearchBtn) {
			saveSearchBtn.show();
		}
		objCreateNewFilterPanel.resetAllFields(objCreateNewFilterPanel);
		objCreateNewFilterPanel.enableDisableFields(objCreateNewFilterPanel,
				false);
		objCreateNewFilterPanel.removeReadOnly(objCreateNewFilterPanel,
				false);
				
		me.filterCodeValue = null;

		if (!Ext.isEmpty(me.objAdvFilterPopup)) {
			me.objAdvFilterPopup.show();
			var objTabPanel = me.getAdvanceFilterTabPanel();
			objTabPanel.setActiveTab(1);
		} else {
			me.objAdvFilterPopup = Ext
					.create('GCP.view.PmtAdvancedFilterPopup');
			var objTabPanel = me.getAdvanceFilterTabPanel();
			objTabPanel.setActiveTab(1);
			me.objAdvFilterPopup.show();

		}
	},
	handleFilterItemClick : function(filterCode, btn) {

		var me = this;
		var objToolbar = me.getAdvFilterActionToolBar();

		objToolbar.items.each(function(item) {
					item.removeCls('xn-custom-heighlight');
				});
		if(!Ext.isEmpty(btn)){ 
		btn.addCls('xn-custom-heighlight');
		}

		if (!Ext.isEmpty(filterCode)) {
			var applyAdvFilter = true;
			this.getSavedFilterData(filterCode, this.populateSavedFilter,
					applyAdvFilter);
		}

		me.savePrefAdvFilterCode = filterCode;
		me.showAdvFilterCode = filterCode;
		//me.toggleSavePrefrenceAction(true);
		//me.toggleClearPrefrenceAction(true); 
	},
	populateSavedFilter : function(filterCode, filterData, applyAdvFilter) {
		var me = this;
		var currentFilterData = '';
		var operatorValue = '';
		for (i = 0; i < filterData.filterBy.length; i++) {
			var fieldName = filterData.filterBy[i].field;
			var fieldOper = filterData.filterBy[i].operator;
			var fieldVal = filterData.filterBy[i].value1;
			fieldSecondVal = filterData.filterBy[i].value2;
			currentFilterData = filterData.filterBy[i];
			operatorValue = filterData.filterBy[i].operator;
			if (fieldName === 'clientId') {
				me.checkUnCheckMenuItems(fieldName, fieldVal);
				selectedClientDesc = filterData.filterBy[i].displayValue1;
				$('#clientSelect').val(fieldVal);
				$('#clientSelect').niceSelect('update');
				resetAllMenuItemsInMultiSelect("#accountSelect");
				setAccountIdAndAccountNumber('#accountSelect');
			}
			if (fieldName === 'Reference') {
				$("#Reference").val(fieldVal);
			} else if (fieldName === 'CheckNum') {
				$("#CheckNum").val(fieldVal);
			} else if (fieldName === 'accountNumber' || fieldName ==='RequestState')  {
				me.checkUnCheckMenuItems(fieldName, fieldVal, fieldSecondVal);
			} else if (fieldName === 'Amount') {
				me.setAmounts(operatorValue, fieldVal);
			} 
						
			if (fieldName === 'EntryDate') {
				me.setSavedFilterEntryDate(fieldName, currentFilterData);
			}
			if (fieldName === 'CheckDate') {
				me.setSavedFilterCheckDate(fieldName, currentFilterData);
			}
			/*if(fieldName ==='RequestState') {			  
				  me.setStatus(fieldVal);
			}*/
		}
		if (!Ext.isEmpty(filterCode)) {
			$('#filterCode').val(filterCode);
			$("#msSavedFilter option[value='"+filterCode+"']").attr("selected",true);
			$("#msSavedFilter").multiselect("refresh");
			var saveFilterChkBox = $("input[type='checkbox'][id='saveFilterChkBox']");
			saveFilterChkBox.prop('checked', true);
		}
		if (applyAdvFilter){
			me.showAdvFilterCode = filterCode;
			me.applyAdvancedFilter(filterData);
		}
	},
	setStatus : function(fieldVal) {
	    var options = document.getElementById("statusAdvFilter").options;
		for (var i = 0, optionsLength = options.length; i < optionsLength; i++) {
			if (options[i].value == fieldVal) {
				$("#statusAdvFilter").prop('selectedIndex', i);  
			    break;
			}
		}	
	},
	setAmounts : function(operator, amountFromFieldValue, amountToFieldValue) {
		var amonutFieldRefFrom = $("#Amount");
		//var amountFieldRefTo = $("#amountFieldTo");

		if (!Ext.isEmpty(operator)) {
			if (!Ext.isEmpty(amountFromFieldValue)) {
				$('#amountOp').val(operator);
				$("#amountOp").niceSelect('update');
				amonutFieldRefFrom.val(amountFromFieldValue);
			}
		}
	},
	setSavedFilterEntryDate : function(dateType, data) {
		if (!Ext.isEmpty(dateType) && !Ext.isEmpty(data)) {
			var me = this;
			var dateFilterRef = null;
			var dateOperator = data.operator;
			var label =null;

			if (dateType === 'EntryDate') {
				dateFilterRef = $('#entryDatePicker');
				label =data.dropdownLabel;
			}

			if (dateOperator === 'eq') {
				var fromDate = data.value1;
				if (!Ext.isEmpty(fromDate)) {
					var formattedFromDate = Ext.util.Format.date(Ext.Date
									.parse(fromDate, 'Y-m-d'),
							strExtApplicationDateFormat);
					$(dateFilterRef).val(formattedFromDate);
				}

			} else if (dateOperator === 'bt') {
				var fromDate = data.value1;
				if (!Ext.isEmpty(fromDate)) {
					var formattedFromDate = Ext.util.Format.date(Ext.Date
									.parse(fromDate, 'Y-m-d'),
							strExtApplicationDateFormat);
					var toDate = data.value2;
					if (!Ext.isEmpty(toDate)) {
						var formattedToDate = Ext.util.Format.date(Ext.Date
										.parse(toDate, 'Y-m-d'),
								strExtApplicationDateFormat);
						$(dateFilterRef).setDateRangePickerValue([
								formattedFromDate, formattedToDate]);
					}
				}
			}
		
			selectedRequestDateFilter = {
				operator : dateOperator,
				fromDate : formattedFromDate,
				toDate : formattedToDate,
				dateLabel : label
			};
			$('label[for="requestDateLabel"]').text(getLabel('lblreqdate','Request Date')+ " ("
						+ selectedRequestDateFilter.dateLabel + ")");
			entry_date_opt = " (" + selectedRequestDateFilter.dateLabel + ")";				
			
		} else {
		}
	},
	setSavedFilterCheckDate : function(dateType, data) {
		if (!Ext.isEmpty(dateType) && !Ext.isEmpty(data)) {
			var me = this;
			var dateFilterRef = null;
			var dateOperator = data.operator;
			var label =null;

			if (dateType === 'CheckDate') {
				dateFilterRef = $('#checkDatePicker');
				label =data.dropdownLabel;
			}

			if (dateOperator === 'eq') {
				var fromDate = data.value1;
				if (!Ext.isEmpty(fromDate)) {
					var formattedFromDate = Ext.util.Format.date(Ext.Date
									.parse(fromDate, 'Y-m-d'),
							strExtApplicationDateFormat);
					$(dateFilterRef).val(formattedFromDate);
				}

			} else if (dateOperator === 'bt') {
				var fromDate = data.value1;
				if (!Ext.isEmpty(fromDate)) {
					var formattedFromDate = Ext.util.Format.date(Ext.Date
									.parse(fromDate, 'Y-m-d'),
							strExtApplicationDateFormat);
					var toDate = data.value2;
					if (!Ext.isEmpty(toDate)) {
						var formattedToDate = Ext.util.Format.date(Ext.Date
										.parse(toDate, 'Y-m-d'),
								strExtApplicationDateFormat);
						$(dateFilterRef).setDateRangePickerValue([
								formattedFromDate, formattedToDate]);
					}
				}
			}
			selectedCheckDateFilter = {
				operator : dateOperator,
				fromDate : formattedFromDate,
				toDate : formattedToDate,
				dateLabel : label
			};
			$('label[for="checkDateLabel"]').text(getLabel('lblchkdate','Issue Date')+ " ("
						+ selectedCheckDateFilter.dateLabel + ")");
			process_date_opt = " (" + selectedCheckDateFilter.dateLabel + ")";			
			} else {
		}
	},
	handleSavePreferences : function() {
		var me = this;
		var strUrl = me.commonPrefUrl;
		var arrPref = me.getPreferencesToSave(false);
		if (arrPref) {
				me.preferenceHandler.savePagePreferences(me.strPageName, arrPref,
				me.postHandleSavePreferences, null, me, true);
				}
			
	},
	
	disablePreferencesButton : function(btnId, boolVal) {
		$("#" + btnId).attr("disabled", boolVal);
		if (boolVal)
			$("#" + btnId).css("color", 'grey');
		else
			$("#" + btnId).css("color", '#FFF');
	},
	postHandleSavePreferences : function(data, args, isSuccess) {
						var me = this;
						if (isSuccess && isSuccess === 'Y') {
						  me.disablePreferencesButton("savePrefMenuBtn",true);
			              me.disablePreferencesButton("clearPrefMenuBtn",false);	
						}
					
						
					},
	postHandleClearPreferences : function(data, args, isSuccess) {
						var me = this;
						if (isSuccess && isSuccess === 'Y') {
							me.disablePreferencesButton("savePrefMenuBtn", false);
							me.disablePreferencesButton("clearPrefMenuBtn", true);	
						}
						
					},				
	handleClearPreferences : function() {
		var me = this;
		me.preferenceHandler.clearPagePreferences(me.strPageName, null,
					me.postHandleClearPreferences, null, me, true);
	},
	
	showCheckImage : function(record, side)
	{
		var me = this;
		if(daejaViewONESupport)
		{
			me.showDepositImageDaejaViewONE(record, side);
		}
		else
		{
			me.showCheckImageJqueryPopup(record, side);
		}
	},
	
	showDepositImageDaejaViewONE : function( record, side)
	{
		$(document).ajaxStart($.blockUI({message: '<h2><img src="static/images/backgrounds/busy.gif" class="middleAlign"/>&nbsp;Please wait...</h2>',
			css:{ height:'32px',padding:'8px 0 0 0'}})).ajaxStop($.unblockUI);
//		$(document).ajaxStart($.blockUI).ajaxStop($.unblockUI);
		var me = this;
		var id = record.get('identifier');
		var checknumber = record.get('checkNmbrFrom');
		var hostImageKey = record.get('hostImageKey');
		var strUrl = 'checkMgmtList/getCheckImage.srvc?$isDaejaViewer=Y&'+csrfTokenName + '=' + csrfTokenValue+'&identifier=' + Ext.encode(id)+'&$checkNmbr='+checknumber+'&$hostImageKey='+hostImageKey+'&$side='+side;
		
		if(document.getElementById("viewONE"))
		{
			document.getElementById("viewONE").setView(3);
			document.getElementById("viewONE").openFile(strUrl, 1);
		}
		else
		{
			addViewer('chkImageDiv', strUrl);
		}
		$( '#chkImageDiv' ).dialog(
		{
			autoOpen : false,
			height : "800",
			modal : true,
			resizable : true,
			width : "1000",
			title : getLabel('image', 'Image'),
			position: 'center',
			buttons :
			{
				"Cancel" : function()
				{
					$( this ).dialog( "close" );
				}
			},
			open: function( event, ui ) {
				$.unblockUI();
    		},
			close: function( event, ui ) {
				$.unblockUI();
			}
		} );
		$( '#chkImageDiv' ).dialog( 'open' );
	},
	
	showCheckImageJqueryPopup : function(record, side)
	{
	//	$(document).ajaxStart($.blockUI).ajaxStop($.unblockUI);
		var me = this;
		
         var groupView = me.getGroupView();
		 groupView.setLoading(true);
		var id = record.get('identifier');
		var checknumber = record.get('checkNmbrFrom');
		var hostImageKey = record.get('hostImageKey');
		var strUrl = 'checkMgmtList/getCheckImage.srvc?'+csrfTokenName + '=' + csrfTokenValue+'&identifier=' + Ext.encode(id)+'&$checkNmbr='+checknumber+'&$hostImageKey='+hostImageKey+'&$side='+side;
		$.ajax(
		{
			type : 'POST',
			//data : JSON.stringify( arrayJson ),
			url : strUrl,
			//contentType : "application/json",
			dataType : 'html',
			success : function( data )
			{
			//	$.unblockUI();
			    groupView.setLoading(false);
				var $response = $( data );

				if( $response.find( '#imageAppletDiv' ).length == 0 )
				{
					$( '#chkImageDiv' ).html( '<img width="1000" height="500" src="data:image/jpeg;base64,' + data + '"/>' );
				}
				else
				{
					$( '#chkImageDiv' ).html( $response.find( '#imageAppletDiv' ) );
				} 
				$( '#chkImageDiv' ).dialog(
				{
					bgiframe : true,
					autoOpen : false,
					height : "700",
					modal : true,
					resizable : true,
					width : "1200",
					title : getLabel('image', 'Image'),
					buttons : 
					{
						"Cancel" : function()
						{
							$( this ).dialog( "close" );
						},
						
							"Flip Over" : function()
							{
								if(modelBytes=='Front'){
									$( this ).dialog( "close" );
									me.showCheckImage(record,'B');
									 modelBytes = 'Back';
								 }
								 else
								 {
									 $( this ).dialog( "close" );
									me.showCheckImage(record,'F');
									 modelBytes = 'Front';
								 }
							}
						,
						"Print" : function()
						{
							var strFrontUrl = 'checkMgmtList/getCheckImage.srvc?'+csrfTokenName + '=' + csrfTokenValue+
							'&identifier=' + Ext.encode(id)+'&$checkNmbr='+checknumber+'&$hostImageKey='+hostImageKey+'&$side=F';
							var strBackUrl = 'checkMgmtList/getCheckImage.srvc?'+csrfTokenName + '=' + csrfTokenValue+'&identifier=' + 
							Ext.encode(id)+'&$checkNmbr='+checknumber+'&$hostImageKey='+hostImageKey+'&$side=B';
							printFrontImage(strFrontUrl,strBackUrl);
						}
					},
					open : function()
					{
						$('.ui-dialog-buttonpane').find('button:contains("Print")').css('color','#4a4a4a')
						.css('background-color','#FFF').css('margin-left','10px').css('border','1px solid #4a4a4a');
						$('.ui-dialog-buttonpane').find('button:contains("Flip Over")').css('color','#4a4a4a')
						.css('background-color','#FFF').css('margin-left','10px').css('border','1px solid #4a4a4a');
					}			
				} );

				$( '#dialogMode' ).val( '1' );
				$( '#chkImageDiv' ).dialog( 'open' );
			},
			error : function( request, status, error )
			{
				//$.unblockUI();
				groupView.setLoading(false);
				$( '#chkImageDiv' ).html( '<img src="./static/images/misc/no_image.jpg"/>' );
				$( '#chkImageDiv' ).dialog(
				{
					bgiframe : true,
					autoOpen : false,
					height : "340",
					modal : true,
					resizable : true,
					width : "300",
					zIndex: '29001',				
					title : getLabel('image', 'Image'),
					buttons : 
					{
						"Cancel" : function()
						{
							$( this ).dialog( "close" );
						}
					}
				} );
				$( '#dialogMode' ).val( '1' );
				$( '#chkImageDiv' ).dialog( 'open' );
			}
		} );

	},
	
	showResPopup : function(){
		var me = this;
		me.handleChkMgmtInqRespSmartGridConfig();
		if(!Ext.isEmpty(me.objChkMgmtRealtimeRespMultiPopup))
		{					
			/*me.objChkMgmtRealtimeRespMultiPopup.down('label[itemId="checkActSubmit"]').setText( total_records);
			me.objChkMgmtRealtimeRespMultiPopup.down('label[itemId="checkActProcess"]').setText( processed_records);			
			//me.objChkMgmtRealtimeRespMultiPopup.down( 'combobox[itemId="trackNmbr"]' ).setValue( trackNumber);
			me.objChkMgmtRealtimeRespMultiPopup.down( 'label[itemId="totCheck"]').setText(  total_checks );
			me.objChkMgmtRealtimeRespMultiPopup.down( 'label[itemId="checksProcessed"]' ).setText( total_processed);
			me.objChkMgmtRealtimeRespMultiPopup.down( 'label[itemId="checkActStat"]' ).setText( batch_status );*/
			me.objChkMgmtRealtimeRespMultiPopup.setTitle('Request in Process')  ;
			me.objChkMgmtRealtimeRespMultiPopup.show();
		}
		else
		{	
			me.objChkMgmtRealtimeRespMultiPopup = Ext.create('GCP.view.CheckManagementResViewPopup',{
				checkActSubmit     : '9999999',
				checkActProcess   : '8888889',
				trackNmbr : 'Enquiry',
				totCheck 	  : '56902',
				checksProcessed   : 'Status new',
				checkActStat		:'Host msg'
			});
			me.title = getLabel('lblcreatechkinquiry', 'New Check Inquiry');
			me.objChkMgmtRealtimeRespMultiPopup.show();
		}	
		Ext.getCmp('cancelBtn').focus();
	},
	handleChkMgmtInqRespSmartGridConfig : function()
	{
		var me = this;
		var chkMgmtRealtimeRespGrid = me.getChkMgmtRealTimeRespGrid();
		var objConfigMap = me.getChkMgmtRealtimeRespConfig();
		var arrCols = new Array();
		arrCols = me.getRTDtlColumns(objConfigMap.arrColsPref, objConfigMap.objWidthMap,"" );
		if(!Ext.isEmpty(chkMgmtRealtimeRespGrid))
			chkMgmtRealtimeRespGrid.destroy( true );
		me.handleResActivityDtlSmartGridLoad(arrCols, objConfigMap.storeModel, "");
	},
	getChkMgmtRealtimeRespConfig : function()
	{
		var me = this;
		var objConfigMap = null;
		var objWidthMap = null;
		var arrColsPref = null;
		var storeModel = null;

		objWidthMap =
		{
			"requestNmbr" : 170,	
			"account" : 190,
			"checkNmbrFrom" : 140,
			"requestType" : 150,
			"amount" : 120,
			"requestStateDesc" : 190,
			"hostMessage" : 240
		};
		arrColsPref =
		[
			{
				"colId" : "requestReference",
				"colDesc" : getLabel("trackingno","Tracking No."),
				menuDisabled : true,
				draggable : false,
				resizable: true,
				"sortable" : false
			},
			{
				"colId" : "account",
				"colDesc" : getLabel("account","Account"),
				menuDisabled : true,
				draggable : false,
				resizable: true,
				"sortable" : false
			},
			{
				"colId" : "checkNmbrFrom",
				"colDesc" : NonUSUser=== "Y" ? 
						    getLabel("chequeNmbr","Cheque Number")
						   :getLabel("checkNmbr","Check Number"),
				menuDisabled : true,
				draggable : false,
				resizable: true,
				"sortable" : false
			},
			{
				"colId" : "requestType",
				"colDesc" : getLabel("requestType","Request Type"),
				menuDisabled : true,
				draggable : false,
				resizable: true,
				"sortable" : false
			},
			{
				"colId" : "amount",
				"colDesc" : getLabel("amount","Amount"),
				"colType" : "number",
				menuDisabled : true,
				draggable : false,
				resizable: true,
				"sortable" : false
			},
			{
				"colId" : "requestStateDesc",
				"colDesc" : getLabel("requestStateDesc","Status"),
				menuDisabled : true,
				draggable : false,
				resizable: true,
				"sortable" : false
			},
			{
				"colId" : "hostMessage",
				"colDesc" : getLabel("hostMessage","Host Message"),
				menuDisabled : true,
				sortable : false,
				draggable : false,
				resizable: true
			}
			
		];
		

		storeModel =
		{
			fields :
			[
				'requestReference','account', 'checkNmbrFrom', 'requestStateDesc', 'hostMessage', 'requestType','amount','currencySymbol', 'identifier', '__metadata'
			],
			proxyUrl : 'checkManagementGridList/viewRes.srvc',
			rootNode : 'd.realTimeIntRes',
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
	getRTDtlColumns : function(arrColsPref, objWidthMap,record)
	{
		var me = this;
		var arrCols = new Array(), objCol = null, cfgCol = null;
		if(!Ext.isEmpty(arrColsPref))
		{
			for(var i = 0 ; i < arrColsPref.length ; i++)
			{
				objCol = arrColsPref[i];
				cfgCol = {};
				cfgCol.colHeader = objCol.colDesc;
				cfgCol.colId = objCol.colId;
				cfgCol.sortable = objCol.sortable;
				cfgCol.menuDisabled = objCol.menuDisabled;
				cfgCol.draggable = objCol.draggable;
				cfgCol.resizable = objCol.resizable;
				
				if(!Ext.isEmpty(objCol.colType))
				{
					cfgCol.colType = objCol.colType;
					if( cfgCol.colType === "number" )
						cfgCol.align = 'right';
				}

				cfgCol.width = !Ext.isEmpty(objWidthMap[objCol.colId]) ? objWidthMap[objCol.colId] : 120;
				cfgCol.fnColumnRenderer = me.columnRenderer;
				arrCols.push(cfgCol);
			}
		}
		return arrCols;
	},
	columnRenderer : function(value, meta, record, rowIndex, colIndex, store, view, colId) {
		var strRetValue = value;	
		meta.tdAttr = 'title="' + strRetValue + '"';
		if (colId === "col_requestType"){
			if(NonUSUser === "Y"){
				strRetValue = getLabel('lblCheckRequestType.'+record.data.requestType ,'Cheque Inquiry' );
			}
			else{
				strRetValue = value;
			}
		}
		return strRetValue;
	},
	handleResActivityDtlSmartGridLoad : function(arrCols, storeModel, parentRecord)
	{
		var me = this;
		var pgSize = null;
		var userActivityDtlGrid = null;
		pgSize = _GridSizeTxn;
		var checkManagementResViewPopupId = me.getCheckManagementResViewPopupId();
		var chkMgmtRtResponseGrid = Ext.getCmp('gridChkMgmtRealTimeRespItemId');

		if(typeof chkMgmtRtResponseGrid == 'undefined')
		{
			chkMgmtRtResponseGrid = Ext.create('Ext.ux.gcp.SmartGrid',
			{
				id : 'gridChkMgmtRealTimeRespItemId',
				itemId : 'gridChkMgmtRealTimeRespItemId',
				pageSize : 5,
				cls : 't7-grid ft-padding-bottom',
				autoDestroy : true,
				stateful : false,
				showEmptyRow : false,
				hideRowNumbererColumn : false,
				showSummaryRow : false,
				//padding : '5 0 0 0',
				showCheckBoxColumn : false,
				rowList : [5, 10, 15, 20, 25, 30],
				minHeight : 140,
				//maxHeight : 300 ,
				columnModel : arrCols,
				storeModel : storeModel,
				isRowIconVisible : me.isRowIconVisible,
				isRowMoreMenuVisible : false,
				enableColumnAutoWidth : true,
				enableColumnHeaderMenu : false,
				showSorterToolbar : _charEnableMultiSort,
				/*handleRowIconClick : function(tableView, rowIndex, columnIndex, btn, event, record)
				{
					me.handleRowIconClick(tableView, rowIndex, columnIndex, btn, event, record);
				},*/
				listeners :
				{
					render : function(grid)
					{
						me.handleResActDtlLoadGridData(grid, chkMgmtRtResponseGrid.pageSize, 1, 1, null, parentRecord );
					},
					gridPageChange : function(grid, strUrl, pageSize, newPgNo, oldPgNo, sorters)
					{	
						me.handleResActDtlLoadGridData(grid, pageSize, newPgNo, oldPgNo, sorters, parentRecord );
					},
					gridSortChange : function(grid, strUrl, pageSize, newPgNo, oldPgNo, sorters)
					{
						me.handleResActDtlLoadGridData(grid, pageSize, newPgNo, oldPgNo, sorters, parentRecord );
					},
					pagechange : function(pager, current, oldPageNum)
					{
						me.handleComboPageSizeChange(pager, current, oldPageNum);
					},
					statechange : function(grid)
					{
						//me.toggleSavePrefrenceAction(true);
					},
					boxready : function() {
						this.doLayout();	
					}
				}
			} );
			chkMgmtRtResponseGrid.view.refresh();
			checkManagementResViewPopupId.add(chkMgmtRtResponseGrid);
			checkManagementResViewPopupId.doLayout();
		}
	},
	handleResActDtlLoadGridData : function(grid, pgSize, newPgNo, oldPgNo, sorters, record)
	{
		var me = this;
		url = 'checkManagementGridList/viewRes.srvc';
		var strUrl = grid.generateUrl(url, pgSize, newPgNo, oldPgNo, sorters);
		var strUrl = strUrl + '&' + 'trackNumber=' +trackNumber + '&' +  csrfTokenName + '=' + csrfTokenValue;
		grid.loadGridData(strUrl, null);
	},
	callCheckStatus : function (combo, newValue, oldValue )//jaga
	{	
		var arrayJson = new Array();
		var store = combo.getStore();
		store.data.each(function() {
			var key = this.data['key'];
			var value = this.data['value'];
			if(key === newValue){
				trackNumber = value;
			}
			arrayJson.push({
				identifier : key
			});
		});
		this.checkStatusForCmbChange(arrayJson,'newRec/accept.srvc', newValue );
		
	},
	checkStatus : function(responseData, baseUrl, newRecId)
	{
		var me = this;
		var arrayJson = new Array();
		var arrKeyValue = new Array();
		var usrAct = baseUrl.indexOf("/");
		var subAction = baseUrl.substring((usrAct+1), baseUrl.length).trim();
		var strUrl = 'checkMgmtList/showResponse.srvc';
		var cancelBtn = me.getRealTimeCanceButton();
		var continBackground = me.getRealTimeContinBackgroundBtn();
		var responseData1 = "";
		var intervalObj;
		var intCounter = 0;
		if(null != newRecId)
		{
			arrayJson = responseData;
		}
		else		
		{
			if(responseData && responseData.d && responseData.d.instrumentActions[0].success 
			&& responseData.d.instrumentActions[0].success == 'N'){
				getRecentActionResult(responseData.d.instrumentActions);
			}
			for( i = 0 ; i < responseData.d.instrumentActions.length ; i++ )
			{
				arrayJson.push({
					identifier : responseData.d.instrumentActions[i].identifier
				});				
			}
		}
				intervalObj = setInterval(function()
				{
					if(intCounter < noOfAttemptsForChk && stopRefresh =='N'  )
					{
					Ext.Ajax.request({
									url : strUrl+'?'+csrfTokenName+'='+csrfTokenValue+'&'+'$trackNmbr='+trackNumber,
									method : 'POST',
									jsonData : Ext.encode(arrayJson),
									success : function(response) {
										responseData1 = Ext.decode(response.responseText);
										retry_required = responseData1.RETRY_REQUIRED;
										total_records = responseData1.TOTAL_RECORDS;
										processed_records  = responseData1.PROCESSED_RECORDS;
										reference = responseData1.reference;
										total_checks = responseData1.total_checks;
										total_processed = responseData1.total_processed ;
										batch_status = responseData1.batch_status;
										showPopUp =  responseData1.showPopUp;
										trackNumber = responseData1.trackNumber;
										if(responseData1 && responseData1.ARRKEYVALUE)
										arrKeyValue = responseData1.ARRKEYVALUE;
										 for (key in arrKeyValue){
											arrStoreKeyValue.push({
													key : key,
													value :  arrKeyValue[key]
												});	
											}
										if(showPopUp == 'Y' && ('accept.srvc' == subAction || 'cancel.srvc' == subAction || 'inquiry.srvc' == subAction))
										{
											me.showResPopup();
										}
										if('N' == retry_required)
										{
											stopRefresh = 'Y';
											cancelBtn.show();
											continBackground.hide();
											clearInterval(intervalObj);
										}
										else
										{
											cancelBtn.hide();
											continBackground.show();
										}
									},
									failure : function() {
										var errMsg = "";
										Ext.MessageBox.show({
													title : getLabel(
															'instrumentErrorPopUpTitle',
															'Error'),
													msg : getLabel(
															'instrumentErrorPopUpMsg',
															'Error while fetching data..!'),
													buttons : Ext.MessageBox.OK,
													icon : Ext.MessageBox.ERROR
												});
									}
								});
							arrStoreKeyValue.length = 0;
							arrKeyValue.length = 0;
						}
						else
						{
							clearInterval(intervalObj);
							cancelBtn.show();
							continBackground.hide();							
					    }
						intCounter = intCounter + 1;}, 500);
						if(stopRefresh == 'Y')
						{
							clearInterval(intervalObj);
							cancelBtn.show(); 
							continBackground.hide();
						}

	},
	checkStatusForCmbChange : function(arrayJson, baseUrl, newRecId)
	{	
		var me = this;
		var strUrl = 'checkMgmtList/showResponse.srvc';
		Ext.Ajax.request({
				url : strUrl+'?'+csrfTokenName+'='+csrfTokenValue+'&'+'$trackNmbr='+trackNumber,
				method : 'POST',
				async : false,
				jsonData : Ext.encode(arrayJson),
				success : function(response) {
					responseData1 = Ext.decode(response.responseText);
					retry_required = responseData1.RETRY_REQUIRED;
					total_records = responseData1.TOTAL_RECORDS;
					processed_records  = responseData1.PROCESSED_RECORDS;
					reference = responseData1.reference;
					total_checks = responseData1.total_checks;
					total_processed = responseData1.total_processed ;
					batch_status = responseData1.batch_status;
					showPopUp =  responseData1.showPopUp;
					trackNumber = responseData1.trackNumber;
					arrKeyValue = responseData1.ARRKEYVALUE;
					 for (key in arrKeyValue){
						arrStoreKeyValue.push({
								key : key,
								value :  arrKeyValue[key]
							});	
						}
				},
				failure : function() {
					var errMsg = "";
					Ext.MessageBox.show({
								title : getLabel(
										'instrumentErrorPopUpTitle',
										'Error'),
								msg : getLabel(
										'instrumentErrorPopUpMsg',
										'Error while fetching data..!'),
								buttons : Ext.MessageBox.OK,
								icon : Ext.MessageBox.ERROR
							});
				}
			});
			me.showResPopup();
	},
/* Sandeep End*/	
	showStopPayMultipleResponseView : function(record)
	{
		var me = this;
		me.handleChkMgmtRespSmartGridConfig(record);
		me.getReasonRef().show();
		 me.getExpirationDateRef().show();
		 me.getReplacementCheckRef().show();
		if(!Ext.isEmpty(me.objChkMgmtRespMultiPopup))
		{					
			me.objChkMgmtRespMultiPopup.down('textfield[itemId="reference"]').setValue( record.get('reference'));
			me.objChkMgmtRespMultiPopup.down('textfield[itemId="makerId"]').setValue( record.get('entryUser'));
			me.objChkMgmtRespMultiPopup.down('textfield[itemId="entryDate"]').setValue( record.get('entryDate'));
			me.objChkMgmtRespMultiPopup.down('textfield[itemId="sellerId"]').setValue( record.get('sellerId'));
			me.objChkMgmtRespMultiPopup.down('textfield[itemId="account"]').setValue( record.get('account'));
			me.objChkMgmtRespMultiPopup.down( 'textfield[itemId="reason"]' ).setValue( record.get('reason'));
			me.objChkMgmtRespMultiPopup.down( 'textfield[itemId="expirationDate"]' ).setValue(  record.get('expirationDate') );
			me.objChkMgmtRespMultiPopup.down( 'textfield[itemId="replacementCheck"]' ).setValue( record.get('expirationDate') );
			me.objChkMgmtRespMultiPopup.down( 'textfield[itemId="contactPerson"]' ).setValue( record.get('contactPerson') );
			me.objChkMgmtRespMultiPopup.down( 'textfield[itemId="phoneNmbr"]' ).setValue( record.get('phoneNmbr') );
			
			if(record.get('description') == 'Stop Pay')
			me.objChkMgmtRespMultiPopup.setTitle('Stop Pay Response')  ;
			else
			me.objChkMgmtRespMultiPopup.setTitle('Cancel Stop Pay Response')  ;
			me.objChkMgmtRespMultiPopup.show();
		}
		else
		{	
			me.objChkMgmtRespMultiPopup = Ext.create('GCP.view.CheckManagementMultiViewPopup',{
				reference : record.get('reference'),
				makerId   : record.get('entryUser'),
				entryDate : record.get('entryDate'),
				seller 	  : record.get('sellerId'),
				account   : record.get('account'),
				reason		:record.get('reason'),
				expirationDate :record.get('expirationDate'),
				replacementCheck :record.get('expirationDate'),
				contactPerson : record.get('contactPerson'),
				phoneNmbr :  record.get('phoneNmbr')
			});
			if(record.get('description') == 'Stop Pay')
			me.objChkMgmtRespMultiPopup.setTitle('Stop Pay Response')  ;
			else
			me.objChkMgmtRespMultiPopup.setTitle('Cancel Stop Pay Response')  ;
			me.objChkMgmtRespMultiPopup.show();
		}
		
	},
	handleChkMgmtRespSmartGridConfig : function( record )
	{
		var me = this;
		var chkMgmtRespGrid = me.getChkMgmtMultiRespGrid();
		var objConfigMap = me.getChkMgmtMultiRespConfig();
		var arrCols = new Array();
		arrCols = me.getActDtlColumns(objConfigMap.arrColsPref, objConfigMap.objWidthMap,record );
		if(!Ext.isEmpty(chkMgmtRespGrid))
			chkMgmtRespGrid.destroy( true );
		me.handleActivityDtlSmartGridLoad(arrCols, objConfigMap.storeModel, record);
	},
	getChkMgmtMultiRespConfig : function()
	{
		var me = this;
		var objConfigMap = null;
		var objWidthMap = null;
		var arrColsPref = null;
		var storeModel = null;

		objWidthMap =
		{
			/*"checkNmbrFrom" : 100,
			"requestStateDesc" : 120,
			"hostMessage" : 180,
			"bankReference" : 150,
			"trackingNumber" : 120*/
				
			"checkNmbrFrom" : 60,
			"requestStateDesc" : 100,
			"hostMessage" : 150,
			"trakingNumber" : 90,
			"recordKeyNo" : 90	
				
		};
		arrColsPref =
		[
			{
				"colId" : "checkNmbrFrom",
				"colHeader" : getLabel("checkNmbrFrom","Check #"),
				"dragable" : false
				//"sortable" : false
			},
			{
				"colId" : "hostMessage",
				"colHeader" : getLabel("hostMessage","Host Message"),
				"dragable" : false
			},
			{
				"colId" : "trakingNumber",
				"colHeader" : getLabel("bankReference","Bank Reference"),
				"dragable" : false
			},
			{
				"colId" : "recordKeyNo",
				"colHeader" : getLabel("trackingNumber","Tracking No."),
				"dragable" : false
			},
			{
				"colId" : "requestStateDesc",
				"colHeader" : getLabel("requestStateDesc","Status"),
				"sortable" : false,
				"dragable" : false
			}
		];
		

		storeModel =
		{
			fields :
			[
				'description', 'checkNmbrFrom', 'requestStateDesc', 'hostMessage', 'bankReference','trakingNumber','clientDescription', 'hostImageKey','hostStatus', 'availableAction', 'status', 'recordKeyNo', 'identifier', '__metadata'
			],
			proxyUrl : 'checkManagementGridList/view.srvc',
			rootNode : 'd.chkmgmtresponse',
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
	getActDtlColumns : function(arrColsPref, objWidthMap,record)
	{
		var me = this;
		var arrCols = new Array(), objCol = null, cfgCol = null;
		arrCols.push(me.createActDtlActionColumn(record))
		if(!Ext.isEmpty(arrColsPref))
		{
			for(var i = 0 ; i < arrColsPref.length ; i++)
			{
				objCol = arrColsPref[i];
				cfgCol = {};
				cfgCol.colHeader = objCol.colHeader;
				cfgCol.colId = objCol.colId;
				cfgCol.sortable = objCol.sortable;
				cfgCol.dragable = objCol.dragable;
				if(!Ext.isEmpty(objCol.colType))
				{
					cfgCol.colType = objCol.colType;
					if( cfgCol.colType === "number" )
						cfgCol.align = 'right';
				}

				cfgCol.width = !Ext.isEmpty(objWidthMap[objCol.colId]) ? objWidthMap[objCol.colId] : 120;
				cfgCol.fnColumnRenderer = me.columnRenderer;
				arrCols.push(cfgCol);
			}
		}
		return arrCols;
	},
	createActDtlActionColumn : function(record)
	{
		var me = this;
		var type = record.get('description');
		var requestState = record.get('requestState');
		if( ( type === 'Stop Pay' || type === 'Cancel Stop Pay' ) /**&& ( requestState === 3 || requestState === 6 || requestState === 8 || requestState === 13 || requestState === 14 ) )**/
				&& ( requestState === 3 || requestState === 5 || requestState === 6  || requestState === 7 
						|| requestState === 8 || requestState === 9 || requestState === 10 
						|| requestState === 13 || requestState === 14 || requestState === 16 ) )
		{
		var objCols =  [];
		
		if( GranularPermissionFlag == 'Y' )
		{	if(record.data.createCancelStopPayFlag == 'Y')
		{
			if(allowSingleCancelFromALot == 'Y')
			{
				objCols.push({
								itemId : 'btnCancel',
								text : "Cancel",
								itemLabel : getLabel('lblCancel', 'Cancel'),
								maskPosition : 1
				});
			}
			else
			{
				objCols =  [];
			}
		}
		}
		else
		{
			if(allowSingleCancelFromALot == 'Y')
			{
				objCols.push({
								itemId : 'btnCancel',
								text : "Cancel",
								itemLabel : getLabel('lblCancel', 'Cancel'),
								maskPosition : 1
				});	
			}
			else
			{
				objCols =  [];
			}
		}
		if(GranularPermissionFlag == 'Y')
		{
			if(record.data.viewChkImageFlag == 'Y')
			{
			objCols.push({
							itemId : 'btnChkImg1',
							text : "View Image",
							itemLabel : getLabel('lblviewImage', 'View Image'),
							maskPosition : 2
			});
			}
		}
		else
		{
			objCols.push({
							itemId : 'btnChkImg1',
							text : "View Image",
							itemLabel : getLabel('lblviewImage', 'View Image'),
							maskPosition : 2
				});
		}	
		
			var objActionCol =
				{
					colType : 'actioncontent',
					colId : 'viewActionDtl',
					colHeader : getLabel('action', 'Actions'),
					width : 110,
					sortable : false,
					locked : true,
					lockable : false,
					hideable : false,
					resizable : false,
					draggable : false,
					align : 'center',				
					items : objCols					
				};
		}
		else if(type === 'Check Inquiry')
		{
		var objCols =  [];
		if(GranularPermissionFlag == 'Y')
		{
			if( record.data.viewChkImageFlag == 'Y')
			{	
			objCols.push({
						itemId : 'btnChkImg1',
						text : "View Image",
						itemLabel : getLabel('lblviewImage', 'View Image'),
						maskPosition : 2
			});
			}
		}
		else
		{
		objCols.push({
						itemId : 'btnChkImg1',
						text : "View Image",
						itemLabel : getLabel('lblviewImage', 'View Image'),
						maskPosition : 2
			});
		}
			var objActionCol =
			{
				colType : 'actioncontent',
				colId : 'viewActionDtl',
				colHeader : getLabel('action', 'Actions'),
				width : 110,
				sortable : false,
				lockable : false,
				hideable : false,
				resizable : false,
				draggable : false,
				align : 'center',
				locked : true,
				items :objCols			
			};
		}
		else
		{
			var objActionCol =
			{
				colType : 'actioncontent',
				colId : 'viewActionDtl',
				colHeader : getLabel('action', 'Actions'),
				width : 110,
				sortable : false,
				lockable : false,
				hideable : false,
				resizable : false,
				draggable : false,
				align : 'center',
				locked : true,
				items :
				[
					
				]
			};
		}
		return objActionCol;
	},
	handleActivityDtlSmartGridLoad : function(arrCols, storeModel, parentRecord)
	{
		var me = this;
		var pgSize = null;
		var userActivityDtlGrid = null;
		//pgSize = _GridSizeTxn;
		pgSize = 10;
		var checkManagementMultiViewPopupId = me.getCheckManagementMultiViewPopupId();
		var chkMgmtResponseGrid = Ext.getCmp('gridChkMgmtRespItemId');

		if(typeof chkMgmtResponseGrid == 'undefined')
		{
			chkMgmtResponseGrid = Ext.create('Ext.ux.gcp.SmartGrid',
			{
				id : 'gridChkMgmtRespItemId',
				itemId : 'gridChkMgmtRespItemId',
				cls : 't7-grid ft-padding-bottom',
				pageSize : pgSize,
				autoDestroy : true,
				stateful : false,
				showEmptyRow : false,
				hideRowNumbererColumn : true,
				showSummaryRow : false,
				//padding : '5 0 0 0',
				showCheckBoxColumn : false,
				rowList : [5, 10, 25, 50, 100, 500],
				minHeight : 100,
				maxHeight : 270,
				columnModel : arrCols,
				storeModel : storeModel,
				isRowMoreMenuVisible : false,
				enableColumnHeaderMenu : false,
				showSorterToolbar : _charEnableMultiSort,
				enableColumnAutoWidth : _blnGridAutoColumnWidth,
				isRowIconVisible : me.isDtlRowIconVisible,
				handleMoreMenuItemClick : function(tableView, rowIndex, columnIndex, btn, event, record)
				{
					me.handleRowIconClick(tableView, rowIndex, columnIndex, btn, event, record);
				},
				listeners :
				{
					render : function(grid)
					{
						me.handleActDtlLoadGridData(grid, chkMgmtResponseGrid.pageSize, 1, 1, null, parentRecord );
					},
					gridPageChange : function(grid, strUrl, pageSize, newPgNo, oldPgNo, sorters)
					{	
						me.handleActDtlLoadGridData(grid, pageSize, newPgNo, oldPgNo, sorters, parentRecord );
					},
					gridSortChange : function(grid, strUrl, pageSize, newPgNo, oldPgNo, sorters)
					{
						me.handleActDtlLoadGridData(grid, pageSize, newPgNo, oldPgNo, sorters, parentRecord );
					},
					pagechange : function(pager, current, oldPageNum)
					{
						me.handleComboPageSizeChange(pager, current, oldPageNum);
					},
					statechange : function(grid)
					{
						//me.toggleSavePrefrenceAction(true);
					},
					afterrender : function(grid) {
						var view = grid.getView();
		                if (view) {
		                    view.on('refresh', function(){
		                    	//me.doLayout();
								me.callDoLayout();
		                    });
		                }
						this.doLayout();
						me.callDoLayout();
					},
					resize : function (){
						$('#stopPayMultiView').dialog("option","position","center");
					}	
				}
			} );
			chkMgmtResponseGrid.view.refresh();
			checkManagementMultiViewPopupId.add(chkMgmtResponseGrid);
			checkManagementMultiViewPopupId.doLayout();
			me.callDoLayout();
		}
	},
	callDoLayout : function(){
		var me = this;
		var groupView = me.getGroupView();
		groupView.doLayout();
	},
	handleActDtlLoadGridData : function(grid, pgSize, newPgNo, oldPgNo, sorters, record)
	{
		var me = this;
		url = 'checkManagementGridList/view.srvc';
		var id =  record.get('identifier');
		var strUrl = grid.generateUrl(url, pgSize, newPgNo, oldPgNo, sorters);
		var strUrl = strUrl + '&' + 'identifier=' + id + '&' +  csrfTokenName + '=' + csrfTokenValue;
		grid.loadGridData(strUrl, null);
	},
	showResponseView:function(strUrl, id){
		var me=this;
		  Ext.Ajax.request({
			  url : strUrl+'?'+csrfTokenName+'='+csrfTokenValue,
				method : 'POST',
				jsonData : Ext.encode(id),	
					success : function(response) {
						var data = Ext.decode(response.responseText);
						if(!Ext.isEmpty(data)){
							chkMgmtRes = data.d.chkmgmtresponse;
							var popupData=me.generateDataForCustPopupStore(chkMgmtRes);
							if(!Ext.isEmpty(me.customizePopup)){
									var customizePopupGridRef=me.getGridGridView();
										if(!Ext.isEmpty(customizePopupGridRef)){
											customizePopupGridRef.loadRawData(popupData);
										me.customizePopup.show();
										}
							}else {
											me.customizePopup = Ext.create('GCP.view.CheckManagementViewPopup',
													{
												storeData : popupData,
												itemId:'responseViewGrid'
												});
											(me.customizePopup).show();
										}
									} 
								},
					  failure : function(response) {
						  //console.log("Ajax Get account sets call failed");
						}
		  });
	},
	generateDataForCustPopupStore:function(chkMgmtRes){
		var me=this;
		var customizePopupGridRef=me.getGridGridView();
		var dataArray = new Array();
		  if(!Ext.isEmpty(chkMgmtRes)){
			  	var jsonData =chkMgmtRes;
				var count=jsonData.length;
				
				for (var index = 0; index < count; index++) {
						var requestNmbr = jsonData[index].requestNmbr;
						var checkNmbrFrom = jsonData[index].checkNmbrFrom;
						customizePopupGridRef.down( 'textfield[itemId="status"]' ).setValue( jsonData[index].requestStateDesc );
						customizePopupGridRef.down( 'textfield[itemId="trakingNumber"]' ).setValue( jsonData[index].trakingNumber );
						customizePopupGridRef.down( 'textfield[itemId="hostMessage"]' ).setValue( jsonData[index].hostMessage );
				 }
				me.disableFields();
		  }
		  return dataArray;
	},
	disableFields : function()
	{
		var me = this;
		var customizePopupGridRef=me.getGridGridView();
		customizePopupGridRef.down( 'textfield[itemId="reference"]' ).setReadOnly( true );
		customizePopupGridRef.down( 'textfield[itemId="makerId"]' ).setReadOnly( true );
		customizePopupGridRef.down( 'textfield[itemId="entryDate"]' ).setReadOnly( true );
		customizePopupGridRef.down( 'textfield[itemId="checkDate"]' ).setReadOnly( true );
		customizePopupGridRef.down( 'textfield[itemId="amount"]' ).setReadOnly( true );
		customizePopupGridRef.down( 'textfield[itemId="payee"]' ).setReadOnly( true );
		customizePopupGridRef.down( 'textfield[itemId="sellerId"]' ).setReadOnly( true );
		customizePopupGridRef.down( 'textfield[itemId="account"]' ).setReadOnly( true );
		customizePopupGridRef.down( 'textfield[itemId="checkNmbrFrom"]' ).setReadOnly( true );
		customizePopupGridRef.down( 'textfield[itemId="status"]' ).setReadOnly( true );
		customizePopupGridRef.down( 'textfield[itemId="trakingNumber"]' ).setReadOnly( true );
		customizePopupGridRef.down( 'textfield[itemId="hostMessage"]' ).setReadOnly( true );
	},
	addStopPayRequest : function(){
		var me = this;
		var strUrl = "showStopPayRequestForm.srvc";
		me.submitForm(strUrl,"StopPay");
	},

	addChkInqRequest : function(nextDay){
		var me = this;
		if( isAdvStopPayReq )
		{
			var strUrl = "showAdvStopPayRequestForm.srvc";
		}
		else
		{
			var strUrl = "showStopPayRequestForm.srvc";
		}
		
		me.submitForm(strUrl,"ChkInq",nextDay);
	},
	submitForm : function(strUrl,screenType,nextDay) {
		var me = this;
		var form, inputField;
		form = document.createElement('FORM');
		form.name = 'frmMain';
		form.id = 'frmMain';
		form.method = 'POST';
		
		var clinetFilterField = null;
		var sellerFilterField = null;
		var selectedSellerId = null;
		var selectedClientId = null;
		sellerFilterField = me.getSellerField();
		if (!Ext.isEmpty(sellerFilterField)
				&& !Ext.isEmpty(sellerFilterField.getValue())) {
			selectedSellerId = sellerFilterField.getValue();
		} else {
			selectedSellerId = strSellerId;
		}		
		clinetFilterField = me.clientFilterVal;

		if (!Ext.isEmpty(clinetFilterField) && clinetFilterField != 'all') {
			selectedClientId = clinetFilterField;
		} else {
			selectedClientId = strClientId;
		}
		form.appendChild(me.createFormField('INPUT', 'HIDDEN', 'sellerId', selectedSellerId));
		form.appendChild(me.createFormField('INPUT', 'HIDDEN', 'clientId', selectedClientId));
		me.setFilterParameters(form);
		form.appendChild(me.createFormField('INPUT', 'HIDDEN', csrfTokenName, tokenValue));
		form.appendChild(me.createFormField('INPUT', 'HIDDEN', 'PAGEMODE', "ADD"));
		form.appendChild(me.createFormField('INPUT', 'HIDDEN', 'SCREENTYPE', screenType));
		form.appendChild(me.createFormField('INPUT', 'HIDDEN', 'NEXTDAY', nextDay));
		if(isCancelStopPayReq)
		{
			form.appendChild(me.createFormField('INPUT', 'HIDDEN', 'REQUESTSUBTYPE', "NONSYSTEM"));
		}
		else
		{
			form.appendChild(me.createFormField('INPUT', 'HIDDEN', 'REQUESTSUBTYPE', "SYSTEM"));
		}
		form.action = strUrl;
		document.body.appendChild(form);
		form.submit();
	},
	createFormField : function(element, type, name, value) {
		var inputField;
		inputField = document.createElement(element);
		inputField.type = type;
		inputField.name = name;
		inputField.value = value;
		return inputField;
	},
	viewStopPayRequest : function(strUrl,record,rowIndex){
		var me = this;
		var viewState = record.data.viewState;
		var form, inputField;
		form = document.createElement('FORM');
		form.name = 'frmMain';
		form.id = 'frmMain';
		form.method = 'POST';
		form.appendChild(me.createFormField('INPUT', 'HIDDEN', csrfTokenName, tokenValue));
		form.appendChild(me.createFormField('INPUT', 'HIDDEN', 'txtRecordIndex', rowIndex));
		form.appendChild(me.createFormField('INPUT', 'HIDDEN', 'viewState',	viewState));
		form.appendChild(me.createFormField('INPUT', 'HIDDEN', 'PAGEMODE',	"View_Mode"));
		form.appendChild(me.createFormField('INPUT', 'HIDDEN', 'SCREENTYPE', "StopPay"));
		form.action = strUrl;
		document.body.appendChild(form);
		form.submit();
	},
	closeChkMgmtMultiViewPopup : function(btn)
	{
		var me = this;
		me.getChkMgmtViewPopupRef().close();
	},
	closeChkMgmtResViewPopup : function(btn)
	{
		var me = this;
		stopRefresh = 'Y'
			if(btn && btn.itemId && (btn.itemId == 'contInBackground' || btn.itemId =='cancelBtn'))
			{
				me.getChkMgmtViewRTPopupRef().close();
			}
		me.pageReload();
	},
	pageReload : function() {
		var f = document.createElement("form");
		f.setAttribute('method',"post");
		f.setAttribute('action',"checkManagement.srvc"); 
		document.body.appendChild(f); 
		f.submit();		
	},
	handleComboPageSizeChange : function(pager, current, oldPageNum) {
		var me = this;
		//me.toggleSavePrefrenceAction(true);
	},
	handleReportAction : function(actionName) {
		var me = this;
		me.downloadReport(actionName);
	},
	downloadReport : function(actionName) {
		var me = this;
		var withHeaderFlag = document.getElementById("headerCheckbox").checked;
		var arrExtension = {
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
		var temp = new Array();
		var counter = 0;
		var groupView = me.getGroupView();
		var groupInfo = groupView.getGroupInfo() || '{}';
		var subGroupInfo = groupView.getSubGroupInfo() || {};
		
		strExtension = arrExtension[actionName];
		strUrl = 'services/chkmgt/getDynamicReport.' + strExtension;
		strUrl += '?$skip=1';
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
		var groupView = me.getGroupView();
		var grid = groupView.getGrid();
		
		// cnt counter startes with 1 as 0th column are action columns. (not GRID columns)
		for (var cnt = 1; cnt < grid.columns.length ; cnt ++)
		{
			if( grid.columns[cnt].hidden == false )
			{
				temp[counter++] = grid.columns[cnt];
			}
		}
		//viscols = grid.getAllVisibleColumns();
		viscols = temp;
		for (var j = 0; j < viscols.length; j++) {
			col = viscols[j];
			if (col.dataIndex && arrDynamicReportColumn[col.dataIndex]) {
				if (colMap[arrDynamicReportColumn[col.dataIndex]]) {
					// ; do nothing
				} else {
					colMap[arrDynamicReportColumn[col.dataIndex]] = 1;
					colArray.push(arrDynamicReportColumn[col.dataIndex]);

				}
			}
		}
		if (colMap != null) {

			visColsStr = visColsStr + colArray.toString();
			strSelect = '&$select=[' + colArray.toString() + ']';
		}

		strUrl = strUrl + strSelect;
		
		var  objParam = {}, arrMatches, strRegex = /[?&]([^=#]+)=([^&#]*)/g;
				while (arrMatches = strRegex.exec(strUrl)) {
						objParam[arrMatches[1]] = arrMatches[2];
					}
				strUrl = strUrl.substring(0, strUrl.indexOf('?'));
				
		form = document.createElement('FORM');
		form.name = 'frmMain';
		form.id = 'frmMain';
		form.method = 'POST';
		
		Object.keys(objParam).map(function(key) { 
					form.appendChild(me.createFormField('INPUT', 'HIDDEN',
							key, objParam[key]));
					});
					
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
	applySeekFilter : function()
	{
		var me = this;
		//me.toggleSavePrefrenceAction( true );
		me.setDataForFilter();
		me.filterApplied = 'Q';
		me.applyQuickFilter();
	},
	renderSellerClientFilter: function() {
	    var me = this;
	    var clientFilterPanel = me.getClientFilter();
	   // var sellerFilterPanel = me.getSellerfilter();
	    var multipleSellersAvailable = false;
	    var clientsStoreData = null;
	    var storeDataSeller = null;
	    var clientSeekUrl = null;
	    var objSellerStore = null;
	    var objClientStore = null;
		Ext.Ajax.request({
	        url: 'services/userseek/CheckMgtSellerSeek.json',
	        params: {
	            filter: USER
	        },
	        method: 'POST',
	        async: false,
	        success: function(response) {
	            var data = Ext.decode(response.responseText);
	            if (!Ext.isEmpty(data)) {
	                storeDataSeller = data.d.preferences;
	            }
	        },
	        failure: function(response) {
	            // console.log("Ajax Get data Call Failed");
	        }
	    });
	    objSellerStore = Ext.create('Ext.data.Store', {
	        fields: ['CODE', 'DESCR'],
	        data: storeDataSeller,
	        reader: {
	            type: 'json',
	            root: 'd.preferences'
	        },
	        autoLoad: false

	    });
	    objSellerStore.load();
	    if (entity_type == "0") {
	        clientSeekUrl = 'adminCheckMgtCorporationSeek';
	    } else {
	        clientSeekUrl = 'clientCheckMgtCorporationSeek';
	    }


	    Ext.Ajax.request({
	        url: 'services/userseek/' + clientSeekUrl + '.json',
	        method: 'POST',
	        async: false,
	        success: function(response) {
	            var data = Ext.decode(response.responseText);
	            if (!Ext.isEmpty(data)) {
	                storeDataClient = data.d.preferences;
	            }
	        },
	        failure: function(response) {
	            // console.log("Ajax Get data Call Failed");
	        }
	    });
	    objClientStore = Ext.create('Ext.data.Store', {
	        fields: ['CODE', 'DESCR'],
	        data: storeDataClient,
	        reader: {
	            type: 'json',
	            root: 'preferences'
	        },
	        autoLoad: false

	    });
	    objClientStore.load();


	    if (objClientStore.getCount() > 1) {
	        isMultipleClientAvailable = true;
	        storeDataClient.unshift({
	            "CODE": "",
	            "DESCR": "ALL"
	        });
	    }

	    if (!Ext.isEmpty(clientFilterPanel)) {
	        clientFilterPanel.removeAll();
	    }
	    if (entity_type == "0") {
	        if (isMultipleClientAvailable) {
	            var clientTextfield = Ext.create('Ext.ux.gcp.AutoCompleter', {
	                xtype: 'AutoCompleter',
	                fieldCls: 'xn-form-text xn-suggestion-box',
					width : 200,
	                labelSeparator: '',
	                name: 'clientCode',
	                itemId: 'checkMgtClientCode',
	                cfgUrl: 'services/userseek/{0}.json',
	                cfgQueryParamName: '$autofilter',
	                cfgRecordCount: -1,
	                cfgSeekId: clientSeekUrl,
	                cfgRootNode: 'd.preferences',
	                cfgKeyNode: 'CODE',
	                cfgDataNode1: 'DESCR',
	                cfgStoreFields: ['CODE', 'DESCR'],
	                cfgProxyMethodType: 'POST',
	                padding: '0 0 0 10'
	            });
				clientTextfield.cfgExtraParams = [{
					key : '$sellerCode',
					value : strSellerId
				}];
	          /*  clientFilterPanel.add([{
	                        xtype: 'label',
	                        text: getLabel('lblclientname', 'Client Name'),
	                        cls: 'ux_font-size14',
	                        padding: '10 0 6 10'
	                    },
	                    clientTextfield
	                ]);*/
	        }
	    } else {
	    	 if (isMultipleClientAvailable) {
	        clientFilterPanel.add([{
	                xtype: 'label',
	                text: getLabel('lblclientname', 'Company Name'),
	                //cls: 'f13',
					columnWidth : 0.25,
	                padding: '4 0 0 10'
	            }, {
	                xtype: 'combobox',
	                displayField: 'DESCR',
	                fieldCls : 'xn-form-field inline_block',
					triggerBaseCls : 'xn-form-trigger',
					width : 200,
					cls: 'ux_paddingb',
	                padding: '4 0 0 10',
					filterParamName: 'sellerId',
	                itemId: 'clientFltId',
	                valueField: 'CODE',
	                name: 'clientCombo',
	                editable: false,
	                value: strClientId,
	                store: objClientStore
	            }]);
	    	 }
	    }
	},
	/* Function sets the filter Panel element values in JSON */
	setFilterParameters : function(form){
		var me = this;
		var arrJsn = {};
		var jsonArray = [];
		var typeFilterVal = me.typeFilterVal;
		var index = me.dateFilterVal;
		var objDateParams = me.getDateParam(index);
		if(!Ext.isEmpty(index) && !Ext.isEmpty(objDateParams))
		{
			jsonArray.push({
						'index' : index,
						'dateParams' : objDateParams
					});
		}
		
		var clinetFilterField = null;
		var sellerFilterField = null;
		var selectedSellerId = null;
		var selectedClientId = null;
		var selectedClientDesc = null;
		sellerFilterField = me.getSellerField();
		if (!Ext.isEmpty(sellerFilterField)
				&& !Ext.isEmpty(sellerFilterField.getValue())) {
			selectedSellerId = sellerFilterField.getValue();
		} else {
			selectedSellerId = strSellerId;
		}
		clinetFilterField = me.clientFilterVal;

		if (!Ext.isEmpty(clinetFilterField) && clinetFilterField != 'all') {
			selectedClientId = clinetFilterField;
			selectedClientDesc = me.clientFilterDesc;
		} else {
			selectedClientId = strClientId;
		}
		
		arrJsn['sellerId'] = selectedSellerId;
		arrJsn['clientId'] = selectedClientId;
		arrJsn['clientDesc'] = selectedClientDesc;
		arrJsn['checkMgtType']= typeFilterVal;
		arrJsn['dateFilter']= me.dateFilterVal;
		form.appendChild(me.createFormField('INPUT', 'HIDDEN','filterData', Ext.encode(arrJsn)));
	},
	doHandleGroupTabChange : function(groupInfo, subGroupInfo, tabPanel,
			newCard, oldCard) {
		var me = this;
		var objGroupView = me.getGroupView();
		var strModule = '', strUrl = null, args = null, strFilterCode = null;
		groupInfo = groupInfo || {};
		subGroupInfo = subGroupInfo || {};
		if (groupInfo)
		{
			args = {
				scope : me
			};
			strModule = subGroupInfo.groupCode;
			//strUrl = Ext.String.format(me.strGetModulePrefUrl, strModule);
			strUrl = me.urlGridPref +'?'+csrfTokenName+'='+csrfTokenValue;		
			me.preferenceHandler.readModulePreferences(me.strPageName,
					strModule, me.postHandleDoHandleGroupTabChange, args, me, true);			
					
		}
		else
		me.postHandleDoHandleGroupTabChange();
	},
	getSavedPreferences : function(strUrl, fnCallBack, args) {
		var me = this;
		Ext.Ajax.request({
					url : strUrl,
					method : 'GET',
					success : function(response) {
						var data = null;
						if (response && response.responseText)
							data = Ext.decode(response.responseText);
						Ext.Function.bind(fnCallBack, me);
						if (fnCallBack)
							fnCallBack(data, args);
					},
					failure : function() {
					}

				});
	},
	postHandleDoHandleGroupTabChange : function(data, args) {
		var me = args ? args.scope : this;
		var objGroupView = me.getGroupView();
		var objSummaryView = me.getNonCMSGridGroupView(), objPref = null, gridModel = null, intPgSize = null,showPager = true, heightOption = null;;
		var colModel = null, arrCols = null;
		var intPageSize = me.objLocalData && me.objLocalData.d && me.objLocalData.d.preferences
					  && me.objLocalData.d.preferences.tempPref
					  && me.objLocalData.d.preferences.tempPref.pageSize
					  ? me.objLocalData.d.preferences.tempPref.pageSize
					  : '';
		var intPageNo = me.objLocalData && me.objLocalData.d && me.objLocalData.d.preferences
						&& me.objLocalData.d.preferences.tempPref
						&& me.objLocalData.d.preferences.tempPref.pageNo
						? me.objLocalData.d.preferences.tempPref.pageNo
						: 1;
		var sortState = me.objLocalData && me.objLocalData.d && me.objLocalData.d.preferences
			&& me.objLocalData.d.preferences.tempPref
			&& me.objLocalData.d.preferences.tempPref.sorter
			? me.objLocalData.d.preferences.tempPref.sorter
			: [];
			
			
		if (data && data.preference) {
			objPref = Ext.decode(data.preference);
			//arrCols = objPref.gridCols || null;
			//intPgSize = objPref.pgSize || _GridSizeTxn;
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
			if (colModel) {
				gridModel = {
					columnModel : colModel,
					//pageSize : intPgSize,
					showPagerForced : showPager
					/*heightOption : heightOption,
					storeModel:{
					  sortState: sortState
                    }*/

				};
			}
		}
		if(!Ext.isEmpty(intPageSize) && !Ext.isEmpty(intPageNo)) {
			gridModel = gridModel ? gridModel : {};
			gridModel.pageSize = intPageSize;
			gridModel.pageNo = intPageNo;
			gridModel.storeModel = {sortState: sortState};
			
		}
		objGroupView.reconfigureGrid(gridModel);
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
		maskArray.push(buttonMask);
		
		for (var index = 0; index < arrSelectedRecords.length; index++) {
			objData = arrSelectedRecords[index];
			maskArray.push(objData.get('__metadata').__rightsMap);
			if (objData.raw.makerId === USER) {
				isSameUser = false;
			}
		}
		var applicable = false;
		if(objRecord.data.description === 'Stop Pay' && !isHidden('AuthReqStopPay')){
			applicable = true;
		}
		else if(objRecord.data.description === 'Cancel Stop Pay' && !isHidden('AuthReqCancelStop')){
			applicable = true;
		}
		else if(objRecord.data.description === 'Check Inquiry'){
			applicable = true;
		}
		if(!applicable) isSameUser = false;

		actionMask = doAndOperation(maskArray, 10);
		objGroupView.handleGroupActionsVisibility(actionMask);
	},	
	loadResponseSmartGrid : function(record){
		var me = this;
		var smartGridPanel = Ext.create( 'GCP.view.CheckManagementMultiViewPopup',{
					renderTo : 'chkMgmtMultiRespGridList'
				});
		me.handleChkMgmtRespSmartGridConfig(record);
	},
	handleEntryDateChange:function(filterType,btn,opts){
		var me=this;
		if(filterType=="entryDateQuickFilter"){
			me.dateFilterVal = btn.btnValue;
			me.dateFilterLabel = btn.text;
			me.handleDateChange(btn.btnValue);
			me.filterAppiled='Q';
			me.datePickerSelectedDate = [];
			me.setDataForFilter();
			me.applyQuickFilter();
		}
	},
	requestDateChange : function(btn, opts) {
		var me = this;
		me.requestDateFilterVal = btn.btnValue;
		me.requestDateFilterLabel = btn.text;
		me.handleAdvFilterEntryDateChange(btn.btnValue);
	},
	checkDateChange : function(btn, opts) {
		var me = this;
		me.checkDateFilterVal = btn.btnValue;
		me.checkDateFilterLabel = btn.text;
		me.handleAdvFilterCheckDateChange(btn.btnValue);
	},
	handleAdvFilterEntryDateChange : function(index) {
		var me = this;
		//var index = '13';
		var dateToField;
		var objDateParams = me.getDateParam(index, 'entryDate');
		
		if (!Ext.isEmpty(me.requestDateFilterLabel)) {
			$('label[for="requestDateLabel"]').text(getLabel('lblreqdate',
					'Request Date')
					+ " (" + me.requestDateFilterLabel + ")");
		}
		/*var vFromDate = Ext.util.Format.date(Ext.Date.parse(
						objDateParams.fieldValue1, 'Y-m-d'),
				strExtApplicationDateFormat);
		var vToDate = Ext.util.Format.date(Ext.Date.parse(
						objDateParams.fieldValue2, 'Y-m-d'),
				strExtApplicationDateFormat);*/
		var vFromDate = Ext.Date.parse(objDateParams.fieldValue1, 'Y-m-d');
		var vToDate = Ext.Date.parse(objDateParams.fieldValue2, 'Y-m-d');
		var filterOperator = objDateParams.operator;

		if (index == '13') {
			if (filterOperator == 'eq') {
				$('#entryDatePicker').setDateRangePickerValue(vFromDate);
			} else {
				$('#entryDatePicker').setDateRangePickerValue([vFromDate, vToDate]);
			}
			if (filterOperator == 'eq')
				dateToField = "";
			else
				dateToField = Ext.util.Format.date(vToDate,strExtApplicationDateFormat);
			selectedRequestDateFilter = {
				operator : filterOperator,
				fromDate : Ext.util.Format.date(vFromDate,strExtApplicationDateFormat),
				toDate : dateToField,
				dateLabel : me.requestDateFilterLabel
			};
		}else {
			if (index === '1' || index === '2') {
					$('#entryDatePicker').setDateRangePickerValue(vFromDate);
				} else {
				$('#entryDatePicker').setDateRangePickerValue([vFromDate, vToDate]);
			}
			if (filterOperator == 'eq')
				dateToField = "";
			else
				dateToField = Ext.util.Format.date(vToDate,strExtApplicationDateFormat);
			selectedRequestDateFilter = {
				operator : filterOperator,
				fromDate : Ext.util.Format.date(vFromDate,strExtApplicationDateFormat),
				toDate : dateToField,
				dateLabel : me.requestDateFilterLabel
			};
		}
	},
	handleAdvFilterCheckDateChange : function(index) {
		var me = this;
		//var index = '13';
		var dateToField;
		var objDateParams = me.getDateParam(index,'checkDate');
		
		if (!Ext.isEmpty(me.checkDateFilterLabel)) {
			$('label[for="checkDateLabel"]').text(getLabel('lblchkdate',
					'Issue Date')
					+ " (" + me.checkDateFilterLabel + ")");
		}
		
		var vFromDate = Ext.util.Format.date(Ext.Date.parse(
						objDateParams.fieldValue1, 'Y-m-d'),
				strExtApplicationDateFormat);
		var vToDate = Ext.util.Format.date(Ext.Date.parse(
						objDateParams.fieldValue2, 'Y-m-d'),
				strExtApplicationDateFormat);
		var filterOperator = objDateParams.operator;

		if (index == '13') {
			if (filterOperator == 'eq') {
				$('#checkDatePicker').setDateRangePickerValue(vFromDate);
			} else {
				$('#checkDatePicker').setDateRangePickerValue([vFromDate, vToDate]);
			}
			if (filterOperator == 'eq')
				dateToField = "";
			else
				dateToField = vToDate;
			selectedCheckDateFilter = {
				operator : filterOperator,
				fromDate : vFromDate,
				toDate : dateToField,
				dateLabel : me.checkDateFilterLabel
			};
		}else {
			if (index === '1' || index === '2') {
					$('#checkDatePicker').val(vFromDate);
				} else {
				$('#checkDatePicker').setDateRangePickerValue([vFromDate, vToDate]);
			}
			if (filterOperator == 'eq')
				dateToField = "";
			else
				dateToField = vToDate;
			selectedCheckDateFilter = {
				operator : filterOperator,
				fromDate : vFromDate,
				toDate : dateToField,
				dateLabel : me.checkDateFilterLabel
			};
		}
	},
	refreshData : function() {
		var me = this;
		var objGroupView = me.getGroupView();
		var grid = objGroupView.getGrid();
		if (grid) {
			if (!Ext.isEmpty(me.advSortByData)) {
				appliedSortByJson = me.getSortByJsonForSmartGrid();
				grid.removeAppliedSort();
				grid.applySort(appliedSortByJson);
			} else {
				grid.removeAppliedSort();
			}
		}
		objGroupView.refreshData();
	},
	resetAllFields : function(bIsClearBtnClicked) {
		var me = this;
		$("#saveFilterChkBox").attr('checked', false);
		$("input[type='text'][id='Reference']").val("");
		$("input[type='text'][id='CheckNum']").val("");
		$("input[type='text'][id='Amount']").val("");
		//$("#amountOp").val('gt');
		$("#amountOp").val($("#amountOp option:first").val());
		$('#amountOp').niceSelect('update');
		//$("input[type='text'][id='account']").val("");
		$('#account option').prop('selected', true);
		$('#account').multiselect("refresh");
		//$("#statusAdvFilter").val("All");
		$('#statusAdvFilter option').prop('selected', true);
		$('#statusAdvFilter').multiselect("refresh");
		//$("#entryDatePicker").val("");
		//$("#entryDataPicker").val("");
		$("#checkDatePicker").val("");
		selectedRequestDateFilter={};
		me.datePickerSelectedReqDate = [];
		selectedCheckDateFilter={};
		$("#accountSelect" + ' option').prop('selected', true);
		$("#accountSelect").multiselect("refresh");		
		$('#clientSelect').val("All");
		$('#clientSelect').niceSelect();
		$('#clientSelect').niceSelect('update');
		//resetAllMenuItemsInMultiSelect("#accountSelect");
		//setAccountIdAndAccountNumber("#accountSelect");
		me.datePickerSelectedCheckDate = [];
		$("input[type='text'][id='filterCode']").val("");
		$('label[for="requestDateLabel"]').text(getLabel('lblreqdate',
				'Request Date'));
		$('label[for="checkDateLabel"]').text(getLabel('lblchkdate',
				'Issue Date'));
		$("#msSavedFilter").val("");
		$("#msSavedFilter").multiselect("refresh");
		$('#saveFilterChkBox').prop('checked', false);
		markAdvFilterNameMandatory('saveFilterChkBox','filterNameId','filterCode');
		if(bIsClearBtnClicked === undefined)
			me.advFilterCodeApplied = "";
		me.dateFilterLabel = getDateIndexLabel(defaultDateIndex);
		me.dateFilterVal = defaultDateIndex;
		me.requestDateFilterVal = me.dateFilterVal;
		me.requestDateFilterLabel = me.dateFilterLabel;
		me.handleAdvFilterEntryDateChange(me.dateFilterVal);
		var entryDateLableVal = $('label[for="requestDateLabel"]').text();
		var entryDateField = $("#entryDatePicker");
		if(bIsClearBtnClicked === undefined)
			me.handleEntryDateSync('A', entryDateLableVal, null, entryDateField);
		updateToolTip('entryDate'," (Latest)");
		$("#entryDataPicker").val($("#entryDatePicker").val());
	},
	reloadFilters: function(store){
		store.reload({
								callback : function() {
									var storeGrid = filterGridStore();
									store.loadRecords(
											storeGrid.getRange(0, storeGrid
															.getCount()), {
												addRecords : false
											});

								}
							});
	},
	doHandleSavedFilterItemClick : function(filterCode) {
		var me = this;
		if (!Ext.isEmpty(filterCode)) {
			me.savePrefAdvFilterCode = filterCode
			me.showAdvFilterCode = filterCode;
			me.resetAllFields();
			me.getSavedFilterData(filterCode, this.populateSavedFilter, true);
		}
		var entryDateLableVal = $('label[for="requestDateLabel"]').text();
		var entryDateField = $("#entryDatePicker");		
		me.handleEntryDateSync('A', entryDateLableVal, null, entryDateField);
		me.savePrefAdvFilterCode = filterCode;
		me.showAdvFilterCode = filterCode;
		//me.disablePreferencesButton("savePrefMenuBtn", false);
	},
	updateSavedFilterComboInQuickFilter : function() {
		var me = this;
		var savedFilterCombobox = me.getFilterView()
				.down('combo[itemId="savedFiltersCombo"]');
				
		if (!Ext.isEmpty(savedFilterCombobox)
				&& savedFilterCombobox.getStore().find('code',
						me.filterCodeValue) >= 0) {
			savedFilterCombobox.getStore().reload();
			if (me.filterCodeValue != null) {
				me.savedFilterVal = me.filterCodeValue;
			} else {
				me.savedFilterVal = '';
			}
			savedFilterCombobox.setValue(me.savedFilterVal);
			me.filterCodeValue = null;
		}
	},
	handleClearSettings : function() {
		var me = this;
		var objGroupView = me.getGroupView();
		var datePickerRef = $('#entryDataPicker');
		if(!Ext.isEmpty(me.savedFilterVal))
			me.savedFilterVal = "";
		var savedFilterComboBox = me.getNonCMSStopFilterView()
				.down('combo[itemId="savedFiltersCombo"]');
		savedFilterComboBox.setValue(me.savedFilterVal);
		var entryDate = me.getNonCMSStopFilterView()
				.down('component[itemId="entryDataPicker"]');
		me.dateFilterVal = defaultDateIndex;
		me.dateFilterLabel = getDateIndexLabel(defaultDateIndex);
		me.advFilterData = [];		
		me.handleDateChange(me.dateFilterVal);
		me.getDateLabel().setText(getLabel('lblreqdate', 'Request Date') + "("+ me.dateFilterLabel + ")");
		datePickerRef.val('');
		me.filterApplied = 'Q';
		if (objGroupView)
			objGroupView.toggleFilterIcon(false);
		objGroupView.setFilterToolTip('');
		me.resetAllFields();
		me.setDataForFilter();
		saveLocalAccPref = undefined;
		me.refreshData();
	},
	handleClientChangeInQuickFilter : function(isSessionClientFilter) {
		var me = this;
		me.clientFilterVal = selectedFilterClient;
		me.clientFilterDesc = selectedFilterClientDesc;
		me.filterApplied = 'Q';
		me.setDataForFilter();
		if (me.clientFilterVal == 'all') {
			me.showAdvFilterCode = null;
			me.filterApplied = 'ALL';
			me.refreshData();
		} else {
			me.applyQuickFilter();
		}
	},
	getPreferencesToSave : function(localSave) {
		var me = this;
		var groupView = me.getGroupView();
		var grid = null;
		var arrCols = null, objCol = null, arrColPref = new Array(), arrPref = [], objFilterPref = null;
		var groupInfo = null, subGroupInfo = null, strModule = null;
		if (groupView) {
			grid = groupView.getGrid()
			var gridState = grid.getGridState();
			groupInfo = groupView.getGroupInfo() || '{}';
			subGroupInfo = groupView.getSubGroupInfo() || {};
			objFilterPref = me.getFilterPreferences();
			
			arrPref.push({
						"module" : "groupViewFilterPref",
						"jsonPreferences" : objFilterPref
					});
			if (groupInfo.groupTypeCode && subGroupInfo.groupCode)
			{
				arrPref.push({
					"module" : "gridView",
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
							'gridSetting' : groupView.getGroupViewState().gridSetting,
							'sortState' : gridState.sortState
						}
				});
			}
		}
		return arrPref;
	},
	getFilterPreferences : function() {
		var me = this;
		var advFilterCode = null;
		var objFilterPref = {},strSqlDateFormat = 'Y-m-d';;
		var filterPanel = me.getNonCMSStopFilterView();
		var currentFilterValue;
		if(typeof me.getSavedFiltersCombo() !== 'undefined'){
		 currentFilterValue = me.getSavedFiltersCombo().value;
		}
		if (!Ext.isEmpty(currentFilterValue)) {
			advFilterCode = currentFilterValue;
		}else{
		   advFilterCode = me.savedFilterVal;
		
		}
		var quickPref = {};
		quickPref.entryDate = me.dateFilterVal;
		if (me.dateFilterVal === '13') {
			me.dateFilterFromVal = Ext.Date.format(me.datePickerSelectedDate[0],
							strSqlDateFormat);
			me.dateFilterToVal = Ext.Date.format(me.datePickerSelectedDate[1],
							strSqlDateFormat);				
			if (me.datePickerSelectedDate.length == 1) {
				quickPref.entryDateFrom = me.dateFilterFromVal;	
			}	
			else if(me.datePickerSelectedDate.length == 2){
				quickPref.entryDateFrom = me.dateFilterFromVal;	
				quickPref.entryDateTo = me.dateFilterToVal;			
			}
		}
		objFilterPref.advFilterCode = advFilterCode;
		objFilterPref.quickFilter = quickPref;
		if (!Ext.isEmpty(me.clientFilterVal)){
			objFilterPref.filterSelectedClientCode = me.clientFilterVal;
			objFilterPref.filterSelectedClientDesc = me.clientFilterDesc;
		}	
		return objFilterPref;
	},
	isDtlRowIconVisible : function(store, record, jsonData, itmId, maskPosition) {
		var maskSize = 3;
		var maskArray = new Array();
		var actionMask = '';
		var rightsMap = record.data.__metadata.__rightsMap;
		var buttonMask = '';
		var retValue = true;
		var bitPosition = '';
		var applicable = false;
		if (!Ext.isEmpty(maskPosition)) {
			bitPosition = parseInt(maskPosition,10) - 1;
			maskSize = maskSize;
		}
		if (!Ext.isEmpty(jsonData) && !Ext.isEmpty(jsonData.d.__buttonMask))
			buttonMask = jsonData.d.__buttonMask;
		maskArray.push(buttonMask);
		maskArray.push(rightsMap);
		actionMask = doAndOperation(maskArray, maskSize);

		if (Ext.isEmpty(bitPosition))
			return retValue;
		retValue = isActionEnabled(actionMask, bitPosition);
		if ( maskPosition === 1 && record.data.status === 3 )
		{
			retValue = false;
		}
		else if ( maskPosition === 2 )// view image icon
		{
			/*if( record.data.hostImageKey != '' || record.data.availableAction == 'image' )
			{
				// either host image key is available or image keyword is there in available action
			}
			else
			{
				retValue = false;
			}*/
		}

		return retValue;
		},
		disableActions : function(canDisable) {
			if (canDisable)
				$('.canDisable').addClass('button-grey-effect');
			else
				$('.canDisable').removeClass('button-grey-effect');
		},
		showApprovalConfirmationPopupView : function(strUrl, remark, grid,
			arrSelectedRecords, strActionType, strAction) {
		var arrColumnModel = APPROVAL_CONFIRMATION_COLUMN_MODEL;
		var storeFields = ['account', 'accountName', 'checkNo', 'reason',
				'hostMessage', 'requestType', 'amount', 'entryDate',
				'description', 'checkNmbrFrom', 'reference',
				'clientDescription'];
		
		showApprovalConfirmationPopup(arrSelectedRecords, arrColumnModel,
				storeFields, [strUrl, remark, grid, arrSelectedRecords,
						strActionType, strAction]);
	},
	handleGridRowClick : function(record, grid,columnType) {
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
	findInAdvFilterData : function(arr, key) {
		var reqJson = null;
		for (var ai, i = arr.length; i--;) {
			if ((ai = arr[i]) && ai.field == key) {
				reqJson = ai;
			}
		}
		return reqJson;
	},
	removeFromAdvanceArrJson : function(arr,key){
		for (var ai, i = arr.length; i--;) {
			if ((ai = arr[i]) && ai.field == key) {
				arr.splice(i, 1);
			}
		}
		return arr;
	},
	handleAppliedFilterDelete : function(btn){
		var me = this;
		var objData = btn.data;
		var advJsonData = me.advFilterData;
		var quickJsonData = me.filterData;
		if(!Ext.isEmpty(me.savedFilterVal))
			me.savedFilterVal = "";
		var savedFilterComboBox = me.getNonCMSStopFilterView()
					.down('combo[itemId="savedFiltersCombo"]');
			savedFilterComboBox.setValue(me.savedFilterVal);
		$("#msSavedFilter").val("");
		$("#msSavedFilter").multiselect("refresh");
		$("#saveFilterChkBox").attr('checked', false);
		$("input[type='text'][id='filterCode']").val("");
		me.advFilterCodeApplied = "";
		if(!Ext.isEmpty(objData)){
			var paramName = objData.paramName || objData.field;
			var reqJsonInAdv = null;
			var arrAdvJson =null;
			//adv
			var reqJsonInAdv = me.findInAdvFilterData(advJsonData,paramName);
			if (!Ext.isEmpty(reqJsonInAdv)) {
				arrAdvJson = advJsonData;
				arrAdvJson = me
						.removeFromAdvanceArrJson(arrAdvJson,paramName);
					if (paramName === 'EntryDate')
					{
						me.dateFilterLabel  = getDateIndexLabel(defaultDateIndex);
						me.dateFilterVal  = defaultDateIndex;
						me.requestDateFilterVal  = me.dateFilterVal;
						me.handleDateChange(me.dateFilterVal);
						var objDateParams = me.getDateParam(me.dateFilterVal);
						var jsonObject = {};		
						if (!Ext.isEmpty(objDateParams.fieldValue1)) {
							jsonObject = {
										paramName : 'EntryDate',
										paramValue1 : objDateParams.fieldValue1,
										paramValue2 : objDateParams.fieldValue2,
										operatorValue : objDateParams.operator,
										dataType : 'D',
										paramFieldLable : getLabel('lblreqdate', 'Request Date')
									};
						}
						arrAdvJson.push(jsonObject);
					}
				me.advFilterData = arrAdvJson;
			}
			// quick
			else {
				var reqJsonInQuick = me.findInQuickFilterData(quickJsonData,paramName);
				if (!Ext.isEmpty(reqJsonInQuick)) {
					arrQuickJson = quickJsonData;
					arrQuickJson = me.removeFromQuickArrJson(arrQuickJson,paramName);
						if (paramName === 'EntryDate')
						{
							me.dateFilterLabel  = getDateIndexLabel(defaultDateIndex);
							me.dateFilterVal  = defaultDateIndex;
							me.requestDateFilterVal  = me.dateFilterVal;
							me.handleDateChange(me.dateFilterVal);
							var objDateParams = me.getDateParam(me.dateFilterVal);
							var jsonObject = {};		
							if (!Ext.isEmpty(objDateParams.fieldValue1)) {
								jsonObject = {
											paramName : 'EntryDate',
											paramValue1 : objDateParams.fieldValue1,
											paramValue2 : objDateParams.fieldValue2,
											operatorValue : objDateParams.operator,
											dataType : 'D',
											paramFieldLable : getLabel('lblreqdate', 'Request Date')
										};
							}
							arrQuickJson.push(jsonObject);
						}
					me.filterData = arrQuickJson;
				}
			}
			me.resetFieldInAdvAndQuickOnDelete(objData);
			me.refreshData();
		}
	},
	resetFieldInAdvAndQuickOnDelete : function(objData){
		var me = this;
		var strFieldName;
		if(!Ext.isEmpty(objData))
			strFieldName = objData.paramName || objData.field;
		if (strFieldName === 'Reference')
			$("#Reference").val("");
		else if (strFieldName === 'CheckNum')
			$("#CheckNum").val("");
		else if (strFieldName === 'Amount')
			$("#Amount").val("");
		else if (strFieldName === 'accountNumber')
		{
			$('#accountSelect option').prop('selected', true);
			$("#accountSelect").multiselect("refresh");
		}else if(strFieldName === 'RequestState'){
			$('#statusAdvFilter option').prop('selected', true);
			$('#statusAdvFilter').multiselect("refresh");
		}else if(strFieldName === 'clientId'){
			$('#clientSelect').val("All");
		}
			
		if(strFieldName === 'EntryDate')
		{
			me.dateFilterLabel  = getDateIndexLabel(defaultDateIndex);
			me.dateFilterVal  = defaultDateIndex;
			me.requestDateFilterVal  = me.dateFilterVal;
			me.handleDateChange(me.dateFilterVal);
		}
		if (strFieldName === 'CheckDate') {
			selectedCheckDateFilter={};
			me.datePickerSelectedCheckDate = [];
			$('#checkDatePicker').val("");
			$('label[for="checkDateLabel"]').text(getLabel('lblchkdate',
			'Issue Date'));
		}
	},
	handleSavedFilterClick : function() {
		var me = this;
		var savedFilterVal = $("#msSavedFilter").val();
		me.resetAllFields();
		me.filterCodeValue = null;

		var filterCodeRef = $("input[type='text'][id='filterCode']");
		if (!Ext.isEmpty(filterCodeRef)) {
			filterCodeRef.val(savedFilterVal);
		}

		var saveFilterChkBoxRef = $("input[type='checkbox'][id='saveFilterChkBox']");
		if (!Ext.isEmpty(saveFilterChkBoxRef) && !Ext.isEmpty(savedFilterVal))
			saveFilterChkBoxRef.prop('checked', true);
			markAdvFilterNameMandatory('saveFilterChkBox','filterNameId','filterCode');

		var applyAdvFilter = false;
		me.filterCodeValue = savedFilterVal;
		me.getSavedFilterData(savedFilterVal, this.populateSavedFilter,
				applyAdvFilter);
	},
	checkUnCheckMenuItems : function(componentName, data, fieldSecondVal) {
		var menuRef = null;
		var elementId = null;
		var me = this;
		var clientContainer = null;

		if (componentName === 'corporationId') {
			menuRef = $("select[id='corporationSelect']");
			elementId = '#corporationSelect';
		} else if (componentName === 'clientId') {
			menuRef = $("select[id='clientSelect']");
			elementId = '#clientSelect';
			me.clientCode = data;
		} else if (componentName === 'accountNumber') {
			menuRef = $("select[id='accountSelect']");
			elementId = '#accountSelect';
		} else if (componentName === 'actionStatus') {
			menuRef = $("select[id='actionStatus']");
			elementId = '#actionStatus';
		} else if (componentName === 'RequestState') {
			menuRef = $("select[id='statusAdvFilter']");
			elementId = '#statusAdvFilter';
		}

		if (!Ext.isEmpty(menuRef)) {
			var itemArray = $(elementId + " option");

			if (data === 'All') {
				$(elementId + ' option').prop('selected', true);
			} else {
				$(elementId + ' option').prop('selected', false);
				$(elementId).multiselect("refresh");
			}

			if (componentName === 'RequestState') 
				data = fieldSecondVal;
				
			var dataDecoded = decodeURIComponent(data);
			var dataArray = dataDecoded.split(',');

			if(!Ext.isEmpty(dataArray))
			{
				for (var dataIndex = 0; dataIndex < dataArray.length; dataIndex++) {
						for (var index = 0; index < itemArray.length; index++) {
							var dataArrayIndxVal = (dataArray[dataIndex].indexOf('^')>-1) ? dataArray[dataIndex].split('^') : dataArray[dataIndex];
							if (dataArrayIndxVal == itemArray[index].value) {
								$(elementId + " option[value=\""
										+ itemArray[index].value + "\"]").prop(
										"selected", true);
								break;
							}
						}
					}
			}
			$(elementId).multiselect("refresh");
		}
	},
	/*Page setting handling starts here*/
	showPageSettingPopup : function(strInvokedFrom) {
		var me = this, objData = {}, objGroupView = me.getGroupView(), objPrefData, objGeneralSetting, objGridSetting, objColumnSetting;
		var objGroupByVal = '', objDefaultFilterVal = '', objGridSizeVal = '', objRowPerPageVal = _GridSizeTxn,strTitle = null;

		me.pageSettingPopup = null;

		if (!Ext.isEmpty(objCheckManagementPref)) {
			objPrefData = Ext.decode(objCheckManagementPref);
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
					: (CHECKS_GENERIC_COLUMN_MODEL || '[]');

			if (!Ext.isEmpty(objGeneralSetting)) {
				objGroupByVal = objGeneralSetting.defaultGroupByCode;
				objDefaultFilterVal = objGeneralSetting.defaultFilterCode;
			}
			if (!Ext.isEmpty(objGridSetting)) {
				objGridSizeVal = objGridSetting.defaultGridSize;
				objRowPerPageVal = objGridSetting.defaultRowPerPage;
			}
		}

		objData["groupByData"] = objGroupView
				? objGroupView.cfgGroupByData
				: [];
		objData["filterUrl"] = 'services/userfilterslist/checkMgmtFilter';
		objData["rowPerPage"] = _AvailableGridSize;
		objData["groupByVal"] = objGroupByVal;
		objData["filterVal"] = objDefaultFilterVal;
		objData["gridSizeVal"] = objGridSizeVal;
		objData["rowPerPageVal"] = objRowPerPageVal;
		strTitle = (strInvokedFrom === 'GRID' ? getLabel("columnSettings",
				"Column Settings") + ' : ' + (subGroupInfo.groupDescription||'')  : getLabel("Settings", "Settings"));
		me.pageSettingPopup = Ext.create('Ext.ux.gcp.PageSettingPopUp', {
					cfgPopUpData : objData,
					cfgGroupView : objGroupView,
					cfgDefaultColumnModel : objColumnSetting,
					cfgViewOnly : _IsEmulationMode
				});
		me.pageSettingPopup.show();
		me.pageSettingPopup.center();
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
			} else {
				me.handleClearLocalPrefernces();
				me.preferenceHandler.savePagePreferences(me.strPageName,
						arrPref, me.postHandlePageGridSetting, args, me, false);
			}
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
				msg : getLabel('errorMsg', 'Error while apply/restore setting'),
				buttons : Ext.MessageBox.OK,
				cls : 't7-popup',
				icon : Ext.MessageBox.ERROR
			});
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
		{	
			me.handleClearLocalPrefernces();
			me.preferenceHandler.clearPagePreferences(me.strPageName, arrPref,
					me.postHandleRestorePageSetting, null, me, false);
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
	saveLocalPref : function(objSaveState){
		var me = this, args = {},strLocalPrefPageName = me.strPageName+'_TempPref';
		if (!Ext.isEmpty(objSaveState)) {
			args['tempPref'] = objSaveState;
			me.preferenceHandler.savePagePreferences(strLocalPrefPageName, objSaveState,
					me.postHandleSaveLocalPref, args, me, false);
		}
	},
	updateObjLocalPref : function (data){
		var me = this;
		objSaveLocalStoragePref = Ext.encode(data);
		me.objLocalData = Ext.decode(objSaveLocalStoragePref);
	},
	applyPreferences : function(){
		var me = this, objJsonData='', objLocalJsonData='',savedFilterCode ='';
		if (objCheckManagementPref || objSaveLocalStoragePref) {
						objJsonData = Ext.decode(objCheckManagementPref);
						objLocalJsonData = Ext.decode(objSaveLocalStoragePref);
						if (!Ext.isEmpty(objLocalJsonData.d.preferences) && (!Ext.isEmpty(objLocalJsonData.d.preferences.tempPref)) && allowLocalPreference === 'Y') {
								if(!Ext.isEmpty(objLocalJsonData.d.preferences.tempPref.advFilterCode)){
									savedFilterCode = objLocalJsonData.d.preferences.tempPref.advFilterCode;
									me.savedFilterVal = objLocalJsonData.d.preferences.tempPref.advFilterCode;
								}
								if(!Ext.isEmpty(objLocalJsonData.d.preferences.tempPref.advFilterJson)){
									me.populateSavedFilter(savedFilterCode,objLocalJsonData.d.preferences.tempPref.advFilterJson,true);
									me.handleFieldSync();
									//me.handleDateChange(me.dateFilterVal);
								}
						}
						else
							me.applySavedDefaultPreference(objJsonData);
						
						
						/*if (!Ext.isEmpty(objJsonData.d.preferences)
								&& Ext.isEmpty(widgetFilterUrl)) {
							if (!Ext
									.isEmpty(objJsonData.d.preferences.GeneralSetting)) {
								if (!Ext
										.isEmpty(objJsonData.d.preferences.GeneralSetting.defaultFilterCode) || (objSaveLocalStoragePref && !Ext.isEmpty(objSaveLocalStoragePref.filterCode))) {
									var advData = objSaveLocalStoragePref && !Ext.isEmpty(objSaveLocalStoragePref.filterCode) ? objSaveLocalStoragePref.filterCode : objJsonData.d.preferences.GeneralSetting.defaultFilterCode;
									me.doHandleSavedFilterItemClick(advData);
									me.savedFilterVal = advData;
								}
							} else if(objSaveLocalStoragePref && !Ext.isEmpty(objSaveLocalStoragePref.filterCode)){
									me.doHandleSavedFilterItemClick(objSaveLocalStoragePref.filterCode);
									me.savedFilterVal = objSaveLocalStoragePref.filterCode;
							}
						}*/
						
					}
	},
	handleFieldSync : function(){
		var me = this;
		var entryDateLableVal = $('label[for="requestDateLabel"]').text();
		var entryDateField = $("#entryDatePicker");
		me.handleEntryDateSync('Q', entryDateLableVal, null, entryDateField);
	},
	applySavedDefaultPreference : function(objJsonData){
		var me = this;
		if (!Ext.isEmpty(objJsonData.d.preferences)) {
			if (!Ext.isEmpty(objJsonData.d.preferences.GeneralSetting) && !Ext.isEmpty(objJsonData.d.preferences.GeneralSetting.defaultFilterCode)) {
				me.doHandleSavedFilterItemClick(objJsonData.d.preferences.GeneralSetting.defaultFilterCode);
				me.savedFilterVal = objJsonData.d.preferences.GeneralSetting.defaultFilterCode;
			}
		}
	},
	handleClearLocalPrefernces : function(){
		var me = this,args = {},strLocalPrefPageName = me.strPageName+'_TempPref';;
		me.preferenceHandler.clearPagePreferences(strLocalPrefPageName, null,
				me.postHandleClearLocalPreference, args, me, false);
	},
	postHandleClearLocalPreference : function(data, args, isSuccess){
		var me = this, args = {},strLocalPrefPageName = me.strPageName+'_TempPref';
		if (isSuccess === 'N') {
			Ext.MessageBox.show({
				title : getLabel('instrumentErrorPopUpTitle', 'Error'),
				msg : getLabel('localerrorMsg', 'Error while clear local setting'),
				buttons : Ext.MessageBox.OK,
				cls : 't7-popup',
				icon : Ext.MessageBox.ERROR
			});
		}
		else if(isSuccess === 'Y') {
			objSaveLocalStoragePref = '';
			me.objLocalData = '';
		}
	},
	/*Page setting handling ends here*/
	handleEntryDateSync : function(valueChangedAt, sourceLable, sourceToolTipText, sourceTextRef) {
		var me = this, labelToChange, valueControlToChange, updatedDateValue;
		me.entryDateChanged = true;
		labelToChange = (valueChangedAt === 'Q') ? $('label[for="requestDateLabel"]') : me.getDateLabel();
		valueControlToChange = (valueChangedAt === 'Q') ? $('#entryDatePicker') : $('#entryDataPicker');
		updatedDateValue = sourceTextRef.getDateRangePickerValue();
		
		if(labelToChange && valueControlToChange && valueControlToChange.hasClass('is-datepick')) {
			if(valueChangedAt === 'Q') {
				labelToChange.text(sourceLable);
				updateToolTip('entryDate', sourceToolTipText);
			} else {
				labelToChange.setText(sourceLable);
			}
			if(!Ext.isEmpty(updatedDateValue)) {
				valueControlToChange.setDateRangePickerValue(updatedDateValue);
			}
		}
	},
	assignSavedFilter: function(){
		var me= this,savedFilterCode='';
		if (objCheckManagementPref || objSaveLocalStoragePref) {
				var objJsonData = Ext.decode(objCheckManagementPref);
			objLocalJsonData = Ext.decode(objSaveLocalStoragePref); 
			if (!Ext.isEmpty(objLocalJsonData.d.preferences) 
					&& (!Ext.isEmpty(objLocalJsonData.d.preferences.tempPref)) && allowLocalPreference === 'Y') {
					if(!Ext.isEmpty(objLocalJsonData.d.preferences.tempPref.advFilterCode)){
						savedFilterCode = objLocalJsonData.d.preferences.tempPref.advFilterCode;
						me.savedFilterVal = objLocalJsonData.d.preferences.tempPref.advFilterCode;
					}
					if(!Ext.isEmpty(objLocalJsonData.d.preferences.tempPref.advFilterJson)){
						me.populateSavedFilter(savedFilterCode,objLocalJsonData.d.preferences.tempPref.advFilterJson,false);
						//me.handleFieldSync();
					}
			} else if (!Ext.isEmpty(objJsonData.d.preferences)){
				if (!Ext.isEmpty(objJsonData.d.preferences.GeneralSetting)) {
					if (!Ext.isEmpty(objJsonData.d.preferences.GeneralSetting.defaultFilterCode)) {
							var advData = objJsonData.d.preferences.GeneralSetting.defaultFilterCode;
						if (advData === me.getFilterView().down('combo[itemId="savedFiltersCombo"]').getValue()) {
								$("#msSavedFilter option[value='"+advData+"']").attr("selected",true);
								$("#msSavedFilter").multiselect("refresh");
								me.savedFilterVal = advData;
								me.handleSavedFilterClick();
							}
						}
					}
				}
			}
	},
/* State handling at local storage starts */
	handleSaveLocalStorage : function(){
		var me=this,arrSaveData = [], objSaveState = {},objAdvJson={},objGroupView = me.getGroupView(), grid = objGroupView.getGrid() ,subGroupInfo = null,quickFilterState = {};
		if (objGroupView)
			subGroupInfo = objGroupView.getSubGroupInfo();
		if(!Ext.isEmpty(me.savedFilterVal))
			objSaveState['advFilterCode'] = me.savedFilterVal;
		if(!Ext.isEmpty(me.advFilterData)){
			objAdvJson['filterBy'] = me.advFilterData;
			objSaveState['advFilterJson'] = objAdvJson;
		}
		objSaveState['filterAppliedType'] = me.filterApplied;
		objSaveState['quickFilterJson'] = !Ext.isEmpty(me.filterData) ? me.filterData : {};
		objSaveState['subGroupCode'] = (subGroupInfo || {}).groupCode;
		objSaveState['pageSize'] = grid && !Ext.isEmpty(grid.getPageSize()) ? grid.getPageSize() : null;
		objSaveState['pageNo'] = grid && !Ext.isEmpty(grid.getCurrentPage()) ? grid.getCurrentPage() :  1;
		objSaveState['sorter'] = grid && !Ext.isEmpty(grid.getSortState()) ? grid.getSortState() :  [];
		arrSaveData.push({
			"module" : "tempPref",
			"jsonPreferences" : objSaveState
		});
		me.saveLocalPref(arrSaveData);
	},
	postHandleSaveLocalPref : function(data, args, isSuccess) {
		var me = this,strLocalPrefPageName = me.strPageName+'_TempPref';
		var objLocalPref = {},objTemp={},objTempPref = {}, jsonSaved ={};
		if (isSuccess === 'N') {
			Ext.MessageBox.show({
				title : getLabel('instrumentErrorPopUpTitle', 'Error'),
				msg : getLabel('errorMsg', 'Error while apply/restore setting'),
				buttons : Ext.MessageBox.OK,
				cls : 't7-popup',
				icon : Ext.MessageBox.ERROR
	});
		}
		else {
			if(!Ext.isEmpty(args)){
				jsonSaved = args && args.tempPref && args.tempPref[0] && args.tempPref[0].jsonPreferences ? args.tempPref[0].jsonPreferences : {};
				objTemp['tempPref'] = jsonSaved;
				objTempPref['preferences'] = objTemp;
				objLocalPref['d'] = objTempPref;
				me.updateObjLocalPref(objLocalPref);
			}
		}
	},
	/* State handling at local storage End */
	applyPreferences : function(){
		var me = this, objJsonData='', objLocalJsonData='',savedFilterCode='';
		if (objCheckManagementPref || objSaveLocalStoragePref) {
						objJsonData = Ext.decode(objCheckManagementPref);
						objLocalJsonData = Ext.decode(objSaveLocalStoragePref);
						if (!Ext.isEmpty(objLocalJsonData.d.preferences) && (!Ext.isEmpty(objLocalJsonData.d.preferences.tempPref)) && allowLocalPreference === 'Y') {
								if(!Ext.isEmpty(objLocalJsonData.d.preferences.tempPref.advFilterCode)){
									savedFilterCode = objLocalJsonData.d.preferences.tempPref.advFilterCode;
									me.savedFilterVal = objLocalJsonData.d.preferences.tempPref.advFilterCode;
								}
								if(!Ext.isEmpty(objLocalJsonData.d.preferences.tempPref.advFilterJson)){
									me.populateSavedFilter(savedFilterCode,objLocalJsonData.d.preferences.tempPref.advFilterJson,true);
									var entryDateLableVal = $('label[for="requestDateLabel"]').text();
									var entryDateField = $("#entryDatePicker");
									me.handleEntryDateSync('A', entryDateLableVal, null, entryDateField);
								}
						}
						else
							me.applySavedDefaultPreference(objJsonData);
		}
	},
	resetDefaultDateJson : function() {
		var me = this;
		me.dateFilterLabel = getDateIndexLabel(defaultDateIndex);
		me.dateFilterVal = defaultDateIndex;
		me.handleDateChange(me.dateFilterVal);
		var objDateParams = me.getDateParam(me.dateFilterVal);
		var jsonObject = {};
		if (!Ext.isEmpty(objDateParams.fieldValue1)) {
			jsonObject = {
						field : 'EntryDate',
						paramIsMandatory : true,
						value1 : objDateParams.fieldValue1,
						value2 : objDateParams.fieldValue2,
						operator : objDateParams.operator,
						dataType : 1,
						fieldLabel : getLabel('lblreqdate','Request Date'),
						dropdownLabel : me.dateFilterLabel
					};
		}
		return jsonObject;
	}
	});
function getCheckInq( yes )
{
	GCP.getApplication().fireEvent( 'addChkInqRequest', yes );
}
function getStpCheck( yes )
{
	GCP.getApplication().fireEvent( 'addStopPayRequest', yes );
}
