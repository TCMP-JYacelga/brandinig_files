/**
 * @class GCP.controller.JobMonitorController
 * @extends Ext.app.Controller
 * @author Naresh Mahajan
 */

/**
 * This controller is prime controller in Bank Schedule which handles all
 * measure events fired from GroupView. This controller has important
 * functionality like on any change on grid status or quick filter change, it
 * forms required URL and gets data which is then shown on Summary Grid.
 */

Ext.define('GCP.controller.JobMonitorController', {
	extend : 'Ext.app.Controller',
	requires : [],
	views : ['GCP.view.JobMonitorGridInformationView','GCP.view.JobMonitorFilterView','GCP.view.JobMonitorViewPopup'],
	refs : [{
				ref : 'jobMonitorView',
				selector : 'jobMonitorView'
			},{
				ref : 'jobMonitorFilterView',
				selector : 'jobMonitorView jobMonitorFilterView'
			},{
				ref : 'sellerCombo',
				selector : 'jobMonitorView jobMonitorFilterView combobox[itemId="reportCenterSellerId"]'
			},{
				ref : 'groupView',
				selector : 'jobMonitorView groupView'
			},{
				ref : 'btnClearPreferences',
				selector : 'jobMonitorView jobMonitorFilterView button[itemId="btnClearPreferences"]'
			},{
				ref : 'btnSavePreferences',
				selector : 'jobMonitorView jobMonitorFilterView button[itemId="btnSavePreferences"]'
			},{
				ref : 'schedulingTypeLabel',
				selector : 'jobMonitorView jobMonitorFilterView label[itemId="schedulingTypeValue"]'
			},{
				ref : 'clientFilterPanel',
				selector : 'jobMonitorView jobMonitorFilterView container[itemId="clientFilterPanel"]'
			},{
				ref : 'clientAutoCompleter',
				selector : 'jobMonitorView jobMonitorFilterView AutoCompleter[itemId="reportCenterClientId"]'
			},
			{
				ref : 'fromDateLabel',
				selector : 'jobMonitorView jobMonitorFilterView label[itemId="dateFilterFrom"]'
			}, 
			{
				ref : 'toDateLabel',
				selector : 'jobMonitorView jobMonitorFilterView label[itemId="dateFilterTo"]'
			}, 
			{
				ref : 'dateLabel',
				selector : 'jobMonitorView jobMonitorFilterView label[itemId="dateLabel"]'
			}, 
			{
				ref : 'entryDate',
				selector : 'jobMonitorView jobMonitorFilterView button[itemId="entryDate"]'
			}, 
			{
				ref : 'fromEntryDate',
				selector : 'jobMonitorView jobMonitorFilterView datefield[itemId="fromDate"]'
			}, 
			{
				ref : 'toEntryDate',
				selector : 'jobMonitorView jobMonitorFilterView datefield[itemId="toDate"]'
			}, 
			{
				ref : 'dateRangeComponent',
				selector : 'jobMonitorView jobMonitorFilterView container[itemId="dateRangeComponent"]'
			},
			{
				ref : 'advanceFilterPopup',
				selector : 'jobMonitorAdvFilterPopup'
			}, {
				ref : 'saveSearchBtn',
				selector : 'jobMonitorAdvFilterPopup jobMonitorCreateNewAdvFilter button[itemId="saveAndSearchBtn"]'
			}, {
				ref : 'filterDetailsTab',
				selector : 'jobMonitorAdvFilterPopup panel[itemId="filterDetailsTab"]'
			}, {
				ref : 'savedFiltersToolBar',
				selector : 'jobMonitorView jobMonitorFilterView toolbar[itemId="advFilterActionToolBar"]'
			}, {
				ref : 'advFilterGridView',
				selector : 'jobMonitorAdvFilterPopup  jobMonitorAdvFilterGridView'	
			},{
				ref : 'txtSearchRefKey',
				selector : 'jobMonitorViewPopup  textfield[itemId=txtSearchRefKey]'
			},{
				ref : 'txtErrorReason',
				selector : 'jobMonitorViewPopup  textfield[itemId=txtErrorReason]'
			}
		],
	config : {
		dateHandler : null,
		dateFilterVal : '12',
		widgetType : '01',
		reportModule : '01',
		preferenceHandler : null,
		strDefaultMask : '0000',
		filterData : [],
		favReport : [],
		strPageName : 'jobMonitor',
		filterDataPref : {},
		initialSmartGridRender : true,
		entityType : 'BANK',
		dateFilterVal : '12',
		strReadAllAdvancedFilterCodeUrl : 'userfilterslist/jobMonitor.srvc',
		strGetSavedFilterUrl : 'userfilters/jobMonitor/{0}.srvc',
		cfgSellerGroupByUrl : 'services/grouptype/jobMonitor/groupBy.srvc?&'+csrfTokenName+'='+tokenValue+'&$filter=seller eq '+'\''+'{0}' + '\' and seller eq '+'\''+'{1}' + '\'&$filterscreen=BANKMODE',
		cfgSellerClientGroupByUrl : 'services/grouptype/jobMonitor/groupBy.srvc?&'+csrfTokenName+'='+tokenValue+'&$filter=seller eq '+'\''+'{0}' + '\' and client eq '+'\''+'{1}' 
		+ '\' and client lk '+'\''+'{2}' 
		+ '\' and seller eq '+'\''+'{3}' +'\'&$filterscreen=BANKCLIENTMODE'
	},
	/**
	 * A template method that is called when your application boots. It is
	 * called before the Application's launch function is executed so gives a
	 * hook point to run any code before your Viewport is created.
	 */
	init : function() {
		var me = this;
		me.dateHandler = Ext.create('Ext.ux.gcp.DateUtil');		
		var date = new Date(Ext.Date.parse(dtApplicationDate, strExtApplicationDateFormat));
		clientFromDate = me.dateHandler.getDateBeforeDays(date,filterDays);
		me.updateConfigs();			
		me.doApplySavedPreferences();
		me.control({
			'jobMonitorView jobMonitorFilterView' : {	
				'render' : function() {
					me.setInfoTooltip();
					if(enableStatusRetry == 'Y') {
					    var filter = me.getJobMonitorFilterView();
					    filter.statusCode = "Y";
					    filter.statusCodeDesc = "Retry";
					  }      
					me.setDataForQuickFilter();
					me.setSelectedButtons();
					me.readAllAdvancedFilterCode();
					if(!Ext.isEmpty(defaultDateFilter)) {
						me.dateFilterVal = defaultDateFilter;
						me.dateFilterLabel = getLabel("daterange."+me.dateFilterVal,"Date Range");
					}
					me.handleDateChange(me.dateFilterVal);
				},
				'quickFilterChange' : function(filterJson) {
					me.setDataForQuickFilter(me.filterJson);
					//if (me.getReportCenterView())
					//	me.getReportCenterView().setLoading(true);
					me.applyQuickFilter();
				},
				'refreshGroupByTabs': function(seller, client){
					me.refreshGroupByTabs(seller, client); 
				},
				'handleClientChange' : function(clientCode, clientDesc) {
					me.setDataForQuickFilter();
					me.applyQuickFilter();
				},
				'filterScheduleType' : function(btn, opts){
					me.toggleSavePrefrenceAction(true);
					me.handleSchedulingType(btn);
				},
				'filterEntityType' : function(entityType){
					me.filterEntityType(entityType);
				},
				'filterClient' : function(clientCode, clientDesc){
					me.filterClient(clientCode, clientDesc);
				},
				'dateChange' : function(btn, opts) 
				{
					me.dateFilterVal = btn.btnValue;
					me.dateFilterLabel = btn.text;
					me.handleDateChange(btn.btnValue);
					/*if (btn.btnValue !== '7') {
								// TODO: To be handled
						me.setDataForQuickFilter();
						me.applyQuickFilter();
					}*/
				},
				'handleSavedFilterItemClick' : function(strFilterCode, btn) {
					me.doHandleSavedFilterItemClick(strFilterCode, btn);
				},
				'moreAdvancedFilterClick' : function(btn) {
					me.handleMoreAdvFilterSet(btn.itemId);
				}
			},
			'jobMonitorView groupView' : {
				'render' : function(){
					me.refreshGroupByTabs(strSeller, strClient);
				},
				'groupTabChange' : function(groupInfo, subGroupInfo, tabPanel,
						newCard, oldCard) {	
					me.setDataForQuickFilter(me.filterJson);	
					me.toggleSavePrefrenceAction(true);
					me.doHandleGroupTabChange(groupInfo, subGroupInfo,
							tabPanel, newCard, oldCard);
				},			
				'groupActionClick' : function(actionName, isGroupAction,
						maskPosition, grid, arrSelectedRecords) {
					if (isGroupAction === true)
						me.doHandleGroupActions(actionName, grid,
								arrSelectedRecords, 'groupAction');
				},
				'gridRender' : me.doHandleLoadGridData,
				'gridPageChange' : me.doHandleLoadGridData,
				'gridSortChange' : me.doHandleLoadGridData,
				'gridPageSizeChange' : me.doHandleLoadGridData,
				'gridColumnFilterChange' : me.doHandleLoadGridData,
				'gridRowSelectionChange' : me.doHandleGridRowSelectionChange,
				
				'gridStateChange' : function(grid) {
					me.toggleSavePrefrenceAction(true);
				},
				
				'gridRowActionClick' : function(grid, rowIndex, columnIndex,
						actionName, record) {
					me.doHandleRowActions(actionName, grid, record, rowIndex);
				}
			},
			'jobMonitorView jobMonitorFilterView button[itemId="btnSavePreferences"]' : {
				click : function(btn, opts) {
					me.toggleSavePrefrenceAction(false);
					me.handleSavePreferences();
				}
			},
			'jobMonitorView jobMonitorFilterView button[itemId="btnClearPreferences"]' : {
				click : function(btn, opts) {
					me.toggleClearPrefrenceAction(false);
					me.handleClearPreferences();
				}
			},
			'jobMonitorView groupView smartgrid' : {
				'afterrender' : function(){
						var isShowClientCol = me.entityType == 'BANK' ? false : true;
						me.hideShowClientColumn(isShowClientCol);
				}
			},
			'jobMonitorView jobMonitorFilterView toolbar[itemId="dateToolBar"]' : {
					afterrender : function(tbar, opts) {
						me.updateDateFilterView();
					}
			},
			'jobMonitorView jobMonitorFilterView button[itemId="goBtn"]' : {
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
			},
			'jobMonitorViewPopup' : {
				verifyMessage : function(record){
					me.verifyMessage(record);
				}
			},
			'jobMonitorView jobMonitorFilterView  panel[itemId="advFilterPanel"]  button[itemId="newFilter"]' : {
				'click' : function(btn, opts) {
					me.showAdvanceFilterPopup();
				}
			},
			'jobMonitorAdvFilterPopup jobMonitorCreateNewAdvFilter' : {
				'handleSearchAction' : function(btn) {
					me.applyAdvancedFilter(btn);
				},
				'handleSaveAndSearchAction' : function(btn) {
					me.handleSaveAndSearchAdvFilter(btn);
				},
				'closeFilterPopup' : function(btn) {
					me.closeFilterPopup(btn);
				}
			},
			'jobMonitorAdvFilterPopup jobMonitorAdvFilterGridView' : {
				'orderUpEvent' : me.orderUpDown,
				'deleteFilterEvent' : me.deleteFilterSet,
				'viewFilterEvent' : me.viewFilterData,
				'editFilterEvent' : me.editFilterData,
				'filterSearchEvent' : me.searchFilterData
			}
		});	
	},
	verifyMessage : function(record){
		if(record.data.channelName == 'MQ' || record.data.channelName == 'Message' || record.data.channelName == 'HOST'){
			this.verifyMessageMQ(record);
		}
		else{
			this.verifyMessageFromFTP(record);
		}
	},
	verifyMessageFromFTP : function(record){
		var strUrl = "viewJobMonitorMessage.srvc";
		strUrl = Ext.String.format(strUrl, 'U');
		var me = this;
		var viewState = record.data.identifier;
		var interfaceType = 'U';
		var form, inputField;
		form = document.createElement('FORM');
		form.name = 'frmMain';
		form.id = 'frmMain';
		form.method = 'POST';
		
		form.appendChild(me.createFormField('INPUT', 'HIDDEN',
				csrfTokenName, tokenValue));
		form.appendChild(me.createFormField('INPUT', 'HIDDEN','viewState', viewState));
		form.appendChild(me.createFormField('INPUT', 'HIDDEN','interfaceType', interfaceType));
		form.appendChild(me.createFormField('INPUT', 'HIDDEN','onlyFileName', record.data.mediaDetails));
		form.action = strUrl;
		document.body.appendChild(form);
		form.submit();
	},
	verifyMessageMQ : function(record){
		var strUrl = "viewJobMonitorMessageMQ.srvc";
		strUrl = Ext.String.format(strUrl, 'U');
		var me = this;
		var viewState = record.data.identifier;
		var fileName = record.data.jobSrcName;
		fileName = fileName +".txt";
		var form, inputField;
		form = document.createElement('FORM');
		form.name = 'frmMain';
		form.id = 'frmMain';
		form.method = 'POST';
		
		form.appendChild(me.createFormField('INPUT', 'HIDDEN',
				csrfTokenName, tokenValue));
		form.appendChild(me.createFormField('INPUT', 'HIDDEN','viewState', viewState));
		form.appendChild(me.createFormField('INPUT', 'HIDDEN','fileName', fileName));
		form.action = strUrl;
		document.body.appendChild(form);
		form.submit();
	},
	/*Advance Filter Popup*/
	showAdvanceFilterPopup : function() {
		var me = this, filter = me.getJobMonitorFilterView();
		me.filterCodeValue = null;
		var data = filter.getQuickFilterJSON(me.processingQueueTypeCode);
		if (Ext.isEmpty(me.advanceFilterPopup)) {
			me.createAdvanceFilterPopup();
		}
		var objCreateNewFilterPanel = me.getAdvanceFilterPopup()
				.down('jobMonitorCreateNewAdvFilter');
		me.advanceFilterPopup.sellerVal = data['sellerCode'];
		me.advanceFilterPopup.show();
		me.advanceFilterPopup.down('tabpanel').setActiveTab(1);
	},
	createAdvanceFilterPopup : function() {
		var me = this, filter = me.getJobMonitorFilterView();
		var data = filter.getQuickFilterJSON(me.processingQueueTypeCode);
		me.advanceFilterPopup = Ext.create(
				'GCP.view.JobMonitorAdvFilterPopup');
	},
	closeFilterPopup : function(btn) {
		var me = this;
		var advFilterPopup = me.getAdvanceFilterPopup();
		advFilterPopup.close();
	},
	applyAdvancedFilter : function() {
		var me = this, objGroupView = me.getGroupView();
		me.strFilterApplied = 'A';
		me.setDataForAdvanceFilter();
		var groupView = me.getGroupView();
		groupView.down('smartgrid').refreshData();
		//me.handleGridReconfigure();
		//me.loadPaymentQueueStatus(data['statusCode']);
		//me.updateAdvActionToolbar();
		me.closeFilterPopup();
	},
	setDataForAdvanceFilter : function() {
		var me = this;
		var objCreateNewAdvFilter = me.getAdvanceFilterPopup()
				.down('jobMonitorCreateNewAdvFilter');
		var objJson = objCreateNewAdvFilter.getAdvancedFilterValueJson(
				me.filterCodeValue, objCreateNewAdvFilter);
		me.advFilterData = objJson.filterBy;
		
		//me.overrideValuesOfQuickFilter(me.advFilterData);
	},
	overrideValuesOfQuickFilter : function(advFilterData) {
		var me = this;
		var sellerCombo = me.getFilterUpperPanel()
				.down('combobox[itemId="paymentQueueSellerId"]');
		var clientAutoCompleter = me.getFilterUpperPanel()
				.down('combobox[itemId="bankProcessingQueueClientId"]');
		for (var i = 0; i < advFilterData.length; i++) {
			if (advFilterData[i].field === 'seller'
					&& advFilterData[i].value1 != ''
					&& advFilterData[i].value1 != null)
				sellerCombo.setValue(advFilterData[i].value1);
			if (advFilterData[i].field === 'clientName'
					&& advFilterData[i].value1 != ''
					&& advFilterData[i].value1 != null)
				clientAutoCompleter.setValue(advFilterData[i].value1);
		}
	},
	handleSaveAndSearchAdvFilter : function(btn) {
		var me = this;
		var objCreateNewFilterPanel = me.getAdvanceFilterPopup()
				.down('jobMonitorCreateNewAdvFilter');
		var advGridView = me.getAdvanceFilterPopup()
				.down('jobMonitorAdvFilterGridView');
		if (me.filterCodeValue === null) {
			var filterCode = objCreateNewFilterPanel
					.down('textfield[itemId="filterCode"]');
			var filterCodeVal = filterCode.getValue();
			me.filterCodeValue = filterCodeVal;
		} else {
			var filterCodeVal = me.filterCodeValue;
		}

		var callBack = this.postDoSaveAndSearch;
		if (Ext.isEmpty(filterCodeVal)) {
			var errorlabel = objCreateNewFilterPanel
					.down('label[itemId="errorLabel"]');
			errorlabel.setText(getLabel('filternameMsg',
					'Please Enter Filter Name'));
			errorlabel.show();
		} else {
			me.postSaveFilterRequest(filterCodeVal, callBack);
			me.getAllSavedAdvFilterCode();
		}
	},
	postDoSaveAndSearch : function() {
		var me = this;
		me.applyAdvancedFilter();
	},
	postSaveFilterRequest : function(filterCodeVal, fncallBack) {
		var me = this;
		var strUrl = 'userfilters/jobMonitor/{0}.srvc?';		
		strUrl = Ext.String.format(strUrl, filterCodeVal);
		var objJson;
		var objCreateNewFilterPanel = me.getAdvanceFilterPopup()
				.down('jobMonitorCreateNewAdvFilter');
		objJson = objCreateNewFilterPanel.getAdvancedFilterValueJson(filterCodeVal, objCreateNewFilterPanel);
		Ext.Ajax.request({
			url : strUrl + csrfTokenName + "=" + csrfTokenValue,
			method : 'POST',
			jsonData : Ext.encode(objJson),
			success : function(response) {
				var responseData = Ext.decode(response.responseText);
				var isSuccess;
				var title, strMsg, imgIcon;
				if (responseData.d.filters && responseData.d.filters.success)
					isSuccess = responseData.d.filters.success;

				if (isSuccess && isSuccess === 'N') {
					title = getLabel('bankProcessingQueuePopupTitle', 'Message');
					strMsg = responseData.d.filters.error.errorMessage;
					imgIcon = Ext.MessageBox.ERROR;
					Ext.MessageBox.show({
								title : title,
								msg : strMsg,
								width : 200,
								buttons : Ext.MessageBox.OK,
								icon : imgIcon
							});

				}
				if (filterCodeVal && isSuccess && isSuccess === 'Y') {
					fncallBack.call(me);
					me.reloadGridRawData();
				}
			},
			failure : function() {
				var errMsg = "";
				Ext.MessageBox.show({
							title : getLabel(
									'bankProcessingQueueErrorPopUpTitle',
									'Error'),
							msg : getLabel('investCenterErrorPopUpMsg',
									'Error while fetching data..!'),
							buttons : Ext.MessageBox.OK,
							icon : Ext.MessageBox.ERROR
						});
			}
		});
	},
	getAllSavedAdvFilterCode : function(panel) {
		var me = this;
		var filterView = me.getJobMonitorFilterView();
		var strUrl = me.strReadAllAdvancedFilterCodeUrl;
		Ext.Ajax.request({
					url : strUrl ,
					headers: objHdrCsrfParams,
					method : 'GET',
					success : function(response) {
						var responseData = Ext.decode(response.responseText);

						var arrFilters = [];
						var filterData = responseData.d.filters;
						if (filterData) {
							arrFilters = filterData;
						}
						if (filterView)
							filterView.addAllSavedFilterCodeToView(arrFilters);

					},
					failure : function(response) {
						console
								.log('Bad : Something went wrong with your request');
					}
				});
	},
	orderUpDown : function(grid, rowIndex, direction) {
		var record = grid.getStore().getAt(rowIndex);
		var filterName = record.data.filterName;
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
		// Commented because service is not available
		// this.sendUpdatedOrderJsonToDb(store);
	},
	deleteFilterCodeFromDb : function(store, filterName) {
		var me = this;
		var preferenceArray = [];
		store.each(function(rec) {
					var singleFilterSet = rec.raw;
					preferenceArray.push(singleFilterSet);
				});
		var objJson = {};
		var FiterArray = [];
		for (i = 0; i < preferenceArray.length; i++) {
			FiterArray.push(preferenceArray[i].filterName);
		}
		objJson.filters = FiterArray;
		var strUrl = 'userfilters/jobMonitor/{0}/remove.srvc';
		strUrl = Ext.String.format(strUrl, filterName);
		Ext.Ajax.request({
					url : strUrl + '?' + csrfTokenName + "=" + csrfTokenValue,
					method : 'POST',
					jsonData : objJson,
					async : false,
					success : function(response) {
						me.updateAdvActionToolbar();
					},
					failure : function() {
						// console.log("Error Occured - Addition
						// Failed");
					}
				});
	},
	updateAdvActionToolbar : function() {
		var me = this;
		var filterView = me.getJobMonitorFilterView();
		var queueType = (me.processingQueueTypeCode != 'CW') ? me.processingQueueTypeCode : 'A'; 
		var strUrl = Ext.String.format(me.strReadAllAdvancedFilterCodeUrl, queueType);
		Ext.Ajax.request({
					url :  strUrl ,
					headers: objHdrCsrfParams,
					method : 'GET',
					success : function(response) {
						var responseData = Ext.decode(response.responseText);
						var filters = responseData.d;
						if (filterView)
							filterView
									.addAllSavedFilterCodeToView(filters.filters);
					},
					failure : function() {
						// console.log("Error Occured - Addition
						// Failed");
					}
				});
	},
	deleteFilterSet : function(grid, rowIndex) {
		var me = this;
		var record = grid.getStore().getAt(rowIndex);
		var objFilterName = record.data.filterName;
		grid.getStore().remove(record);
		if (me.savePrefAdvFilterCode == record.data.filterName) {
			me.advFilterData = [];
			me.filterApplied = 'A';
			me.refreshData();
			me.closeFilterPopup();
		}
		var store = grid.getStore();
		me.deleteFilterCodeFromDb(store, objFilterName);
	},
	viewFilterData : function(grid, rowIndex) {
		var me = this;
		var objCreateNewFilterPanel = me.getAdvanceFilterPopup()
				.down('jobMonitorCreateNewAdvFilter');
		var filterDetailsTab = me.getFilterDetailsTab();
		filterDetailsTab.setTitle(getLabel('filterDetails', 'Filter Details'));
		objCreateNewFilterPanel.resetAllFields(objCreateNewFilterPanel);
		objCreateNewFilterPanel.enableDisableFields(objCreateNewFilterPanel,
				true);
		var record = grid.getStore().getAt(rowIndex);
		var filterCode = record.data.filterName;
		var objTabPanel = me.getAdvanceFilterPopup().down('tabpanel');
		var applyAdvFilter = false;
		var filterView = me.getJobMonitorFilterView();
		me.getSaveSearchBtn().hide();
		objCreateNewFilterPanel.down('textfield[itemId="filterCode"]')
				.setValue(filterCode);
		objCreateNewFilterPanel.down('textfield[itemId="filterCode"]')
				.setDisabled(true);
		me.getSavedFilterData(filterCode, this.populateSavedFilter,
				applyAdvFilter);
		objTabPanel.setActiveTab(1);
	},
	getSavedFilterData : function(filterCode, fnCallback, applyAdvFilter) {
		var me = this;
		var objJson;	
		var strUrl = Ext.String.format(me.strGetSavedFilterUrl, filterCode);
		Ext.Ajax.request({
					url : strUrl ,
					headers: objHdrCsrfParams,
					method : 'GET',
					success : function(response) {
						var responseData = Ext.decode(response.responseText);
						if (typeof responseData != 'object') {
							responseData = JSON.parse(responseData);
						}
						fnCallback.call(me, filterCode, responseData,
								applyAdvFilter);
					},
					failure : function() {
						var errMsg = "";
						Ext.MessageBox.show({
									title : getLabel('errorTitle', 'Error'),
									msg : getLabel('investCenterErrorPopUpMsg',
											'Error while fetching data..!'),
									buttons : Ext.MessageBox.OK,
									icon : Ext.MessageBox.ERROR
								});
					}
				});
	},
	editFilterData : function(grid, rowIndex) {
		var me = this;
		var objCreateNewFilterPanel = me.getAdvanceFilterPopup()
				.down('jobMonitorCreateNewAdvFilter');
		var filterDetailsTab = me.getFilterDetailsTab();
		filterDetailsTab.setTitle(getLabel('filterDetails', 'Filter Details'));

		var saveSearchBtn = me.getSaveSearchBtn();

		if (saveSearchBtn) {
			saveSearchBtn.show();
		}
		objCreateNewFilterPanel.resetAllFields(objCreateNewFilterPanel);
		objCreateNewFilterPanel.enableDisableFields(objCreateNewFilterPanel,
				false);
		objCreateNewFilterPanel.removeReadOnly(objCreateNewFilterPanel, false);

		var record = grid.getStore().getAt(rowIndex);
		var filterCode = record.data.filterName;

		objCreateNewFilterPanel.down('textfield[itemId="filterCode"]')
				.setValue(filterCode);
		objCreateNewFilterPanel.down('textfield[itemId="filterCode"]')
				.setDisabled(true);
		var objTabPanel = me.getAdvanceFilterPopup().down('tabpanel');
		var applyAdvFilter = false;

		me.getSaveSearchBtn().show();

		me.filterCodeValue = filterCode;

		me.getSavedFilterData(filterCode, me.populateSavedFilter,
				applyAdvFilter);

		objTabPanel.setActiveTab(1);

	},
	populateSavedFilter : function(filterCode, filterData, applyAdvFilter) {
		var me = this;
		var objCreateNewFilterPanel = me.getAdvanceFilterPopup()
				.down('jobMonitorCreateNewAdvFilter');
		objCreateNewFilterPanel.resetAllFields(objCreateNewFilterPanel);
		var fieldName;
		var fieldOper;
		var fieldVal;
		var fieldType;
		var fieldVal2;
		for (i = 0; i < filterData.filterBy.length; i++) {
			fieldName = filterData.filterBy[i].field;

			fieldOper = filterData.filterBy[i].operator;

			fieldVal = filterData.filterBy[i].value1;

			fieldVal2 = filterData.filterBy[i].value2;

			if (fieldName === 'fileName')
				fieldType = 'textfield';
			else  if(fieldName === 'status')
				fieldType = 'combobox';
			if (fieldType != 'datefield') {
				var fieldObj = objCreateNewFilterPanel.down('' + fieldType
						+ '[itemId="' + fieldName + 'FilterItemId"]');
				fieldObj.setValue(fieldVal);
				} else {
				for (j = 0; j < 2; j++) {
					if (j === 0) {
						var fieldObj = objCreateNewFilterPanel.down(''
								+ fieldType + '[itemId="' + fieldName
								+ 'FrmFilterItemId"]');
						fieldObj.setValue(fieldVal);
					} else {
						var fieldObj = objCreateNewFilterPanel.down(''
								+ fieldType + '[itemId="' + fieldName
								+ 'ToFilterItemId"]');
						fieldObj.setValue(fieldVal2);
					}

				}
			}
		}
		objCreateNewFilterPanel.down('textfield[itemId="filterCode"]').setValue(filterCode);		
		if (applyAdvFilter)
			me.applyAdvancedFilter();
	},
	searchFilterData : function(filterCode) {
		var me = this;
		var emptyBtn = '';
		var currentBtn = '';
		var filterPresentOnToolbar = false;
		if (!Ext.isEmpty(filterCode)) {
			var objToolbar = me.getSavedFiltersToolBar();
			var filterView = me.getJobMonitorFilterView();
			if (filterView)
				filterView.highlightSavedFilter(filterCode);
			if (!Ext.isEmpty(objToolbar)) {
				var tbarItems = objToolbar.items.items;
				if (tbarItems.length >= 1) {
					for (var index = 0; index < 2; index++) {
						currentBtn = tbarItems[index];
						if (currentBtn) {
							if (currentBtn.itemId === filterCode) {
								filterPresentOnToolbar = true;
								me.doHandleSavedFilterItemClick(filterCode,
										currentBtn, true);
							}
						}
					}
				}

				if (!filterPresentOnToolbar) {
					me
							.doHandleSavedFilterItemClick(filterCode, emptyBtn,
									false);
				}

			}
		}
	},
	doHandleSavedFilterItemClick : function(filterCode, btn) {
		var me = this;
		if (Ext.isEmpty(me.advanceFilterPopup)) {
			me.createAdvanceFilterPopup();
		}
		var objCreateNewFilterPanel = me.getAdvanceFilterPopup()
				.down('jobMonitorCreateNewAdvFilter');
		if (!Ext.isEmpty(filterCode)) {
			objCreateNewFilterPanel.down('textfield[itemId="filterCode"]')
					.setValue(filterCode);
			objCreateNewFilterPanel.down('textfield[itemId="filterCode"]')
					.setDisabled(true);
			me.getSavedFilterData(filterCode, me.populateSavedFilter, true);
		}
		me.savePrefAdvFilterCode = filterCode;
		me.filterCodeValue = filterCode;
	},
	readAllAdvancedFilterCode : function() {
		var me = this;
		var filterView = me.getJobMonitorFilterView();		
		var queueType = (me.processingQueueTypeCode != 'CW') ? me.processingQueueTypeCode : 'A'; 
		var strUrl = Ext.String.format(me.strReadAllAdvancedFilterCodeUrl, queueType);
		Ext.Ajax.request({
					url :  strUrl ,
					headers: objHdrCsrfParams,
					success : function(response) {
						var arrFilters = [];
						if (response && response.responseText) {
							var data = Ext.decode(response.responseText);
							if (data && data.d && data.d.filters) {
								arrFilters = data.d.filters;
							}
						}
						if (filterView)
							filterView.addAllSavedFilterCodeToView(arrFilters);
					},
					failure : function(response) {
						// console.log('Bad : Something went wrong with your
						// request');
					}
				});
	},
	handleMoreAdvFilterSet : function(btnId) {
		var me = this;
		var objTabPanel = null;
		var filterDetailsTab = null;
		var clientContainer = null;
		if (Ext.isEmpty(me.advanceFilterPopup)) {
			me.createAdvanceFilterPopup();
		}

		me.advanceFilterPopup.show();
		objTabPanel = me.getAdvanceFilterPopup().down('tabpanel');
		objTabPanel.setActiveTab(0);
		// commented beacause currently not present
		/*
		 * if (!Ext.isEmpty(objTabPanel)) clientContainer =
		 * objTabPanel.getTabBar() .down('container[itemId=clientContainer]');
		 * if (!Ext.isEmpty(objTabPanel)) clientContainer.setVisible(false);
		 */
		filterDetailsTab = me.getFilterDetailsTab();
		filterDetailsTab.setTitle(getLabel('filterDetails', 'Filter Details'));
	},
	/* End Advance Filter Popup*/
	filterEntityType : function(entityType){
		var me = this;
		me.entityType = entityType;
		var filterView = me.getJobMonitorFilterView();
		if(entityType === 'BANK'){
			filterView.clientCode = null;
			me.hideClientPanel();
			me.clientFilterVal = null;
			me.clientFilterDesc = null;
			//me.filterClient(null, null);
		}
		else if(entityType === 'BANK_CLIENT'){
			filterView.clientCode = 'ALL';
			var clientAutoCompleter = me.getClientAutoCompleter();
			clientAutoCompleter.store.loadRawData({
																"d" : {
																	"preferences" : [{
																				"CODE" : 'ALL',
																				"DESCR" : getLabel('all','ALL')
																			}]
																}
															});
			clientAutoCompleter.setValue('ALL');
			me.clientFilterVal = 'ALL';
			me.clientFilterDesc = getLabel('all','ALL');
			me.showClientpanel();
			//me.filterClient('ALL','ALL');
		}
		var client = null;
		if(me.entityType == 'BANK_CLIENT')
		{
			client = 'ALL';
		}
		me.refreshGroupByTabs(strSeller,client);
	},
	hideClientPanel : function(){
		var me = this;
		var clientFilterPanel = me.getClientFilterPanel();
		if (!Ext.isEmpty(clientFilterPanel)) {
			clientFilterPanel.hide();
		}
	},
	showClientpanel : function(){
		var me = this;
		var clientFilterPanel = me.getClientFilterPanel();
		if (!Ext.isEmpty(clientFilterPanel)) {
			clientFilterPanel.show();
		}
	},
	hideShowClientColumn : function(isShowClientColumn){
		var me = this;
		var groupView = me.getGroupView();
		if(null != groupView.down('smartgrid'))
		{
			var columnModel = groupView.down('smartgrid').getAllColumns();
			var i = 0;
			for( i = 0; i < columnModel.length; i++){
				var column = columnModel[i];
				if(column.itemId == 'col_entityDesc'){
					if(isShowClientColumn)
						column.show();
					else
						column.hide();
				}
			}
		}
	},
	filterClient : function(clientCode, clientDesc){
		var me = this;
		var isShowClientColumn = (clientCode == null ? false : true);
		me.clientFilterVal = clientCode;
		me.clientFilterDesc = clientDesc;
					
		var groupView = me.getGroupView();
		if(null != groupView.down('smartgrid'))
		{
			var columnModel = groupView.down('smartgrid').getAllColumns();
			var i = 0;
			for( i = 0; i < columnModel.length; i++){
				var column = columnModel[i];
				if(column.itemId == 'col_entityDesc'){
					if(isShowClientColumn)
						column.show();
					else
						column.hide();
				}
			}
		}
		me.setDataForQuickFilter();
		me.applyQuickFilter();	
	},
	refreshGroupByTabs: function(seller, client)
	{
		var me = this;
		var strUrl = Ext.String.format(me.cfgSellerGroupByUrl, seller, seller);
		if( !Ext.isEmpty( client ) )
		{
			strUrl = Ext.String.format( me.cfgSellerClientGroupByUrl, seller, client, client, seller );
		}
		me.getGroupView().loadGroupByMenus(strUrl);
	},
	setSelectedButtons : function() {
		var me = this, filter = me.getJobMonitorFilterView();
		var objPref = null;
		objPref = me.filterDataPref;
		if(objPref.statusCode){
			var btn = filter.down('button[code='+objPref.statusCode+']');	
			me.setButtonCls(btn, 'reportStatusToolBar');
			filter.statusCode = btn.code;
			filter.statusCodeDesc = btn.btnDesc;
			//filter.handleQuickFilterChange();
		}
		if(objPref.repOrDwnld){
			var btn = filter.down('button[code='+objPref.repOrDwnld+']');	
			me.setButtonCls(btn, 'schedulingTypeToolBar');
			filter.repOrDwnld = btn.code;
			filter.repOrDwnldDesc = btn.btnDesc;
			//filter.handleQuickFilterChange();
		}
		me.setDataForQuickFilter(objPref);
	},
	handleSchedulingType : function(btn) {
		var me = this;
		me.toggleSavePrefrenceAction(true);
		me.setDataForQuickFilter();
		me.applyQuickFilter();
	},
	setButtonCls : function(btn, itemId) {
		var me = this, filter = me.getJobMonitorFilterView();
		filter.down('toolbar[itemId='+ itemId +']').items.each(function(
						item) {
					item.removeCls('xn-custom-heighlight');
				});
		btn.addCls('xn-custom-heighlight');
	},
	applyQuickFilter : function() {
		var me = this;
		var groupView = me.getGroupView();
		me.strFilterApplied = 'Q';
		groupView.down('smartgrid').refreshData();
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
	setDataForQuickFilter : function(filterJson) {
		var me = this, filter = me.getJobMonitorFilterView(), arrFilter = [];
		var data = filterJson || filter.getQuickFilterJSON();
		var index = me.dateFilterVal;
		var objDateParams = me.getDateParam(index);
		if(index != '12')
		{
			arrFilter.push({
				paramName : 'jobDate',
				paramValue1 : objDateParams.fieldValue1,
				paramValue2 : objDateParams.fieldValue2,
				operatorValue : objDateParams.operator,
				dataType : 'D'
				});
		}
		if (data) {			
			if (data['clientCode'])
				arrFilter.push({
							paramName : 'entity_code',
							paramValue1 : (data['clientCode'] || ''),
							operatorValue : 'lk',
							dataType : 'S'
						});
			if (data['repOrDwnld'])
				arrFilter.push({
							paramName : 'repOrDwnld',
							paramValue1 : (data['repOrDwnld'] || ''),
							operatorValue : 'eq',
							dataType : 'S'
						});			
			if (data['srcName'])
				arrFilter.push({
							paramName : 'srcName',
							paramValue1 : (data['srcName'] || ''),
							operatorValue : 'eq',
							dataType : 'S'
						});
			if (data['scheduleMode'])
				arrFilter.push({
							paramName : 'scheduleMode',
							paramValue1 : (data['scheduleMode'] || ''),
							operatorValue : 'eq',
							dataType : 'S'
						});
			if (data['fileName'])
				arrFilter.push({
							paramName : 'fileName',
							paramValue1 : (data['fileName'] || ''),
							operatorValue : 'lk',
							dataType : 'S'
						});
			if (data['status'])
				arrFilter.push({
							paramName : 'status',
							paramValue1 : (data['status'] || ''),
							operatorValue : 'eq',
							dataType : 'S'
						});
			if (data['retryStatus'])
				arrFilter.push({
							paramName : 'retryStatus',
							paramValue1 : (data['retryStatus'] || ''),
							operatorValue : 'eq',
							dataType : 'S'
						});
			if (data['jobId'])
				arrFilter.push({
							paramName : 'jobId',
							paramValue1 : (data['jobId'] || ''),
							operatorValue : 'eq',
							dataType : 'S'
						});
		}
		me.filterData = arrFilter;
	},
	updateConfigs : function() {
		var me = this;
		me.preferenceHandler = Ext.create('Ext.ux.gcp.PreferencesHandler');
	},	
	doHandleLoadGridData : function(groupInfo, subGroupInfo, grid, url, pgSize,
			newPgNo, oldPgNo, sorter) {		
		var me = this;
		var objGroupView = me.getGroupView();
		var buttonMask = me.strDefaultMask;
		url = url + me.widgetType + '.srvc';
		objGroupView.handleGroupActionsVisibility(buttonMask);
		var strUrl = grid.generateUrl(url, pgSize, newPgNo, oldPgNo, sorter);
		if(!Ext.isEmpty(me.getSellerCombo()) && !Ext.isEmpty(me.getSellerCombo().getValue()))
		{
			strUrl +='&$seller='+me.getSellerCombo().getValue();
		}
		else
		{
			strUrl +='&$seller='+strSeller;
		}
		strUrl += me.generateFilterUrl(groupInfo, subGroupInfo);
		strUrl = strUrl + "&" + csrfTokenName + "=" + csrfTokenValue;
		grid.loadGridData(strUrl, null, null, false);
	},
	generateFilterUrl : function(groupInfo, subGroupInfo) {
		var me = this;
		var filterView = me.getJobMonitorFilterView();
		var data = filterView.getQuickFilterJSON();	
		var strQuickFilterUrl = '', strWidgetFilterUrl = '', strUrl = '', isFilterApplied = false;
		strQuickFilterUrl = me.generateUrlWithQuickFilterParams(me.filterData);
		if (me.strFilterApplied === 'A') {
			strAdvancedFilterUrl = me.generateUrlWithAdvancedFilterParams(me);
			if(Ext.isEmpty(strQuickFilterUrl))
			{
				strAdvancedFilterUrl = '&$filter='+strAdvancedFilterUrl;
			}
			if (!Ext.isEmpty(strAdvancedFilterUrl)) {
				if(!Ext.isEmpty(strQuickFilterUrl))
				{
					strQuickFilterUrl = strQuickFilterUrl + ' and ' + strAdvancedFilterUrl;
				}
				else
				{
					strQuickFilterUrl = strAdvancedFilterUrl;
				}
				isFilterApplied = true;
			}
		}
				
		strWidgetFilterUrl = me.generateWidgetUrl(groupInfo, subGroupInfo);
		if (!Ext.isEmpty(strQuickFilterUrl)) {
				strUrl += strQuickFilterUrl;
				isFilterApplied = true;
			}
		if (!Ext.isEmpty(strWidgetFilterUrl)) {
				if (isFilterApplied)
					strUrl += ' and ' + strWidgetFilterUrl;
				else
					strUrl += '&$filter=' + strWidgetFilterUrl;
			}
		if(filterView.repOrDwnld == 'FAVORITE'){
			strUrl += '&$isFavouriteFilter=Y';
		}
		if(!Ext.isEmpty(filterView.entityType) && filterView.entityType == 'BANK_CLIENT'){
			strUrl += '&$isClientFilterSelected=Y';
		}
		else if(!Ext.isEmpty(filterView.entityType) && filterView.entityType == 'BANK'){
			strUrl;
		}
		else if (data) {			
			if (data['clientDesc'])
				{
					strUrl += '&$isClientFilterSelected=Y';
				}
		}
		
		return strUrl;
	},
	generateUrlWithQuickFilterParams : function(urlFilterData) {
		var me = this;
		var filterData = urlFilterData;
		var isFilterApplied = false;
		var strFilter = '&$filter=';
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
		if (isFilterApplied)
			strFilter += strTemp;
		else
			strFilter = '';
		return strFilter;
	},
	doHandleRowActions : function(strAction, grid, record, rowIndex){
		var me = this;
		var strUrl ;
		var records = [record];
		if(strAction == 'btnViewError')
		{
			var popup = Ext.create('GCP.view.JobMonitorViewPopup', {
					modelData : record,
					isErrorPopup : true
			});
			popup.show();
		}
		else if(strAction == 'btnViewSuccess')
		{
			var popup = Ext.create('GCP.view.JobMonitorViewPopup', {
					modelData : record,
					isErrorPopup : false
			});
			popup.show();
		}
		else if(strAction == 'btnReUpload')
		{
			me.preHandleGroupActions('jobMonitor/reUpload.srvc', '', grid, records,
					'', '');
		}
		else if(strAction == 'btnDownload')
		{
			me.verifyMessage(record);
		}
		else if (strAction === 'btnViewErrReport') {    
			me.showErrorReport(record);
		}
		else if(strAction == 'btnRetry')
		{
			me.preHandleGroupActions('jobMonitor/retry.srvc', '', grid, records,
					'', '');
		}
	},
	editAction : function(record, rowIndex) {
		var me = this;
		var strUrl;
		strUrl = "editJobMonitor.srvc";
		me.editJobMonitorRecord(strUrl, record, rowIndex);
	},
	editJobMonitorRecord : function(strUrl, record, rowIndex) {
		var me = this;
		var viewState = record.get('viewState');
		var schSrcId = record
				.get('schSrcId');
		var form, inputField;
		form = document.createElement('FORM');
		form.name = 'frmMain';
		form.id = 'frmMain';
		form.method = 'POST';
		form.appendChild(me.createFormField('INPUT', 'HIDDEN',
				csrfTokenName, tokenValue));
		form.appendChild(me.createFormField('INPUT', 'HIDDEN','schSrcId', schSrcId));
		form.appendChild(me.createFormField('INPUT', 'HIDDEN', 'schEntityType',	record.get('schEntityType')));
		form.appendChild(me.createFormField('INPUT', 'HIDDEN', 'schEntityCode',	record.get('schEntityCode')));
		form.action = strUrl;
		document.body.appendChild(form);
		form.submit();
	},
	showErrorReport : function(record) {
		var me = this;
		var strUrl = 'services/jobMonitor/getUploadErrorReport.pdf'
		form = document.createElement( 'FORM' );
		form.name = 'frmMain';
		form.id = 'frmMain';
		form.method = 'POST';
		form.appendChild( me.createFormField( 'INPUT', 'HIDDEN', csrfTokenName, tokenValue ) );
		form.appendChild( me.createFormField( 'INPUT', 'HIDDEN', 'taskid', record.get("jobId") ) );
		form.appendChild( me.createFormField( 'INPUT', 'HIDDEN', 'client', "BANK" ) );
		form.action = strUrl;
		document.body.appendChild( form );
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
	generateWidgetUrl : function(groupInfo, subGroupInfo) {
		if(subGroupInfo.groupCode != 'all'){
			var strWidgetFilter = 'reportModule' + ' eq ' + '\'' + subGroupInfo.groupCode + '\'';
		}else{
			var strWidgetFilter = '';//'reportModule' + ' eq ' + '\'' + '%' + '\'';
		}
		
		return strWidgetFilter;
	},
	doHandleGroupTabChange : function(groupInfo, subGroupInfo, tabPanel,
			newCard, oldCard) {	
		var me = this;
		me.widgetType = subGroupInfo.groupCode;
		me.reportModule = subGroupInfo.groupCode;	
		var objGroupView = me.getGroupView();
		var strModule = '', strUrl = null, args = null;
		groupInfo = groupInfo || {};
		subGroupInfo = subGroupInfo || {};

		if (groupInfo && groupInfo.groupTypeCode) {
				strModule = subGroupInfo.groupCode
			args = {
				'module' : strModule
			};
			me.preferenceHandler.readModulePreferences(me.strPageName,
					strModule, me.postDoHandleGroupTabChange, args, me, true);
		} else {
			objGroupView.reconfigureGrid(null);
		}
	},	
	postDoHandleGroupTabChange : function(data, args, isSuccess) {
		var me = this;
		var objGroupView = me.getGroupView();
		var objSummaryView = me.getJobMonitorView(), objPref = null, gridModel = null, intPgSize = null;
		var colModel = null, arrCols = null;
		if (data && data.preference) {
			me.toggleClearPrefrenceAction(true);
			objPref = Ext.decode(data.preference);
			arrCols = objPref.gridCols
					|| objDefPref[mapService[args['module']]] || null;
			intPgSize = objPref.pgSize || _GridSizeTxn;
			colModel = objSummaryView.getColumns(arrCols);
			if (colModel) {
				gridModel = {
					columnModel : colModel,
					pageSize : intPgSize
				};
			}
		}
		objGroupView.reconfigureGrid(gridModel);
	},
	toggleClearPrefrenceAction : function(isVisible) {
		var me = this;
		var btnPref = me.getBtnClearPreferences();
		if (!Ext.isEmpty(btnPref))
			btnPref.setDisabled(!isVisible);
	},	
	setInfoTooltip : function() {
			var me = this, filter = me.getJobMonitorFilterView(), arrFilter = [];
			Ext.create('Ext.tip.ToolTip', {
				target : 'imgFilterInfoStdView',
				listeners : {
					'beforeshow' : function(tip) {
						var repOrDwnldDesc1, statusFilter1;
						var data = filter.getQuickFilterJSON();
						var financialInstitutionVal = data['sellerCode'];
						var clientVal = (data['clientDesc'] || getLabel(
								'none', 'None'));
						var repOrDwnldDesc1 = (filter.repOrDwnldDesc == null ? getLabel('all','All') : filter.repOrDwnldDesc);
						/*switch(repOrDwnldDesc)
						{
							case 'R' : repOrDwnldDesc1 = "Report"; break;
							case 'U' : repOrDwnldDesc1 = "Uploads"; break;
							case 'D' : repOrDwnldDesc1 = "Downloads"; break;
							case 'FAVORITE' : repOrDwnldDesc1 = "Favourites"; break;
							default : repOrDwnldDesc1 = "All"
						}*/
						
						var statusFilter = (data['statusCode'] || getLabel(
								'all', 'All'));
						switch(statusFilter)
						{
							case 'ACTIVE' : statusFilter1 = "Active"; break;
							case 'DRAFT' : statusFilter1 = "Drafts"; break;
							default : statusFilter1 = "All"; break;
						}
						tip.update(getLabel('financialInstitution',
								'Financial Insitution')
								+ ' : '
								+ financialInstitutionVal
								+ '<br/>'
								+ getLabel('client', 'Client')
								+ ' : '
								+ clientVal
								+ '<br/>'
								+ getLabel( 'schedulingType', 'Scheduling Type' )
								+ ' : '
								+ repOrDwnldDesc1
								+ '<br/>'
								+ getLabel('status', 'Status')
								+ ' : '
								+ statusFilter1);
					}
				}
			});

	},
	doHandleGroupActions : function(strAction, grid, arrSelectedRecords,
			strActionType) {
		
		
	},
	preHandleGroupActions : function(strUrl, remark, grid, arrSelectedRecords,
			strActionType, strAction) {
		var me = this;
		var groupView = me.getGroupView();
		var objGroupView = me.getGroupView();
		if (!Ext.isEmpty(groupView)) {
			var me = this;
			if (!Ext.isEmpty(grid)) {
				var arrayJson = new Array();
				var records = (arrSelectedRecords || []);
				for (var index = 0; index < records.length; index++) {
					arrayJson.push({
								identifier : records[index].data.identifier
							});
				}
				if (arrayJson)
					arrayJson = arrayJson.sort(function(valA, valB) {
								return valA.serialNo - valB.serialNo
							});
				groupView.setLoading(true);
				Ext.Ajax.request({
							url : strUrl,
							method : 'POST',
							jsonData : Ext.encode(arrayJson),
							success : function(jsonData) {
								//var jsonRes = Ext.JSON
								//		.decode(jsonData.responseText);
								groupView.setLoading(false);
								groupView.down('smartgrid').refreshData();
								objGroupView.handleGroupActionsVisibility(me.strDefaultMask);
							},
							failure : function() {
								var errMsg = "";
								groupView.setLoading(false);
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
	
	// ** Preference Handling Save/Clear ** 
	
	handleClearPreferences : function() {
		var me = this;
		me.toggleSavePrefrenceAction(false);
		var arrPref = me.getPreferencesToSave(false);
		me.preferenceHandler.clearPagePreferences(me.strPageName, null,
				me.postHandleClearPreferences, null, me, true);
	},
	handleSavePreferences : function() {
		var me = this;
		var arrPref = me.getPreferencesToSave(false);
		if (arrPref) {
			me.preferenceHandler.savePagePreferences(me.strPageName, arrPref,
					me.postHandleSavePreferences, null, me, true);
		}
	},
	getPreferencesToSave : function(localSave) {
		var me = this;
		var groupView = me.getGroupView();
		var grid = null;
		var arrCols = null, objCol = null, arrColPref = null, arrPref = [], objFilterPref = null;
		var groupInfo = null, subGroupInfo = null, strModule = null, filter = me.getJobMonitorFilterView();
		var state = null;
		if (groupView) {
			state = groupView.getGroupViewState();
			groupInfo = groupView.getGroupInfo() || '{}';
			subGroupInfo = groupView.getSubGroupInfo() || {};
			var data = filter.getQuickFilterJSON();
			var financialInstitutionVal = (data['sellerCode'] || "");
			var clientVal = (data['clientDesc'] || "");
			var repOrDwnldDesc = (data['repOrDwnldDesc'] || "");
			var statusFilter = (data['repOrDwnld'] || "");
			var reportTypeDesc = (data['statusCode'] || "");
			strModule = state.groupCode
			arrPref.push({
						"module" : "groupByPref",
						"jsonPreferences" : {
							groupCode : state.groupCode,
							subGroupCode : state.subGroupCode
						}
					});
			arrPref.push({
						"module" : strModule,
						"jsonPreferences" : {
							'gridCols' : state.grid.columns,
							'pgSize' : state.grid.pageSize
						}
					});
			arrPref.push({
						"module" : "groupViewFilterPref",
						"jsonPreferences" : {
							'financialInstitutionVal' : financialInstitutionVal,
							'clientVal' : clientVal,
							'repOrDwnldDesc' : repOrDwnldDesc,
							'statusFilter' : statusFilter,
							'reportTypeDesc' : reportTypeDesc
						}
					});
		}
		return arrPref;
	},
	postHandleSavePreferences : function(data, args, isSuccess) {
		var me = this;
		if (isSuccess === 'N') {
			if (!Ext.isEmpty(me.getBtnSavePreferences()))
				me.toggleSavePrefrenceAction(true);
		} else {
			me.toggleClearPrefrenceAction(true);
		}
	},
	toggleSavePrefrenceAction : function(isVisible) {
		var me = this;
		var btnPref = me.getBtnSavePreferences();
		if (!Ext.isEmpty(btnPref))
			btnPref.setDisabled(!isVisible);
	},	
	// *****End*********
	// ****Filter Persistency***
	doSavePreferenceToLocale : function() {
		var me = this, filter = me.getJobMonitorFilterView(); data = null;
		data = filter.getQuickFilterJSON();
		me.preferenceHandler.setLocalPreferences(me.strPageName, data);
	},
	doApplySavedPreferences : function() {
		var me = this, filter = me.getJobMonitorFilterView();
		var objPref = null;
		objPref = me.preferenceHandler.getLocalPreferences(me.strPageName);
		if (objPref) {
			strSeller = objPref['sellerCode'] || strSeller;
			strClient = objPref['clientCode'] || strClient;
			strClientDesc = objPref['clientDesc'] || strClientDesc;		
			me.filterDataPref = objPref;
			me.setDataForQuickFilter(objPref);
			me.preferenceHandler.setLocalPreferences(me.strPageName, null);
		}
	},
	doHandleGridRowSelectionChange : function(groupInfo, subGroupInfo, objGrid,
			objRecord, intRecordIndex, arrSelectedRecords, jsonData) {
		var me = this;
		var buttonMask = me.strDefaultMask;
		var objGroupView = me.getGroupView();
		var maskArray = new Array(), actionMask = '', objData = null;
		
		if( !Ext.isEmpty( jsonData ) && !Ext.isEmpty( jsonData.d.__buttonMask ) )
			buttonMask = jsonData.d.__buttonMask;
		maskArray.push( buttonMask );
		for( var index = 0 ; index < arrSelectedRecords.length ; index++ )
		{
			maskArray.push( objData.get( '__metadata' ).__rightsMap );
		}
		actionMask = doAndOperation( maskArray, 5);
		objGroupView.handleGroupActionsVisibility(actionMask);
	},	
	isPregeneratedRowIconVisible : function( store, record, jsonData, itmId, maskPosition )
	{
		return true;
	},
	
	handleDateChange : function(index) {
				var me = this;
				var filterView = me.getJobMonitorFilterView();
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
			generateUrlWithAdvancedFilterParams : function(me) {
						var thisClass = this;
						// var filterData = thisClass.filterData;
						var filterData = thisClass.advFilterData;
						var isFilterApplied = false;
						var isOrderByApplied = false;
						// advance filter will always get combined with quick filter hence
						// commented $filter
						// var strFilter = '&$filter=';
						var strFilter = '';
						var strTemp = '';
						var strFilterParam = '';
						var operator = '';
						var isInCondition = false;

						if (!Ext.isEmpty(filterData)) {
							for (var index = 0; index < filterData.length; index++) {
								isInCondition = false;
								operator = filterData[index].operator;
								if (isFilterApplied
										&& (operator === 'bt' || operator === 'eq'
												|| operator === 'le' || operator === 'ge'
												|| operator === 'lk' || operator === 'gt' || operator === 'lt'))
									strTemp = strTemp + ' and ';
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
										strTemp = strTemp + filterData[index].field + ' '
												+ filterData[index].operator + ' ' + '\''
												+ filterData[index].value1 + '\'';
										break;
									case 'eq' :
										isInCondition = this.isInCondition(filterData[index]);
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
											break;
										}
									case 'gt' :
									case 'lt' :
									case 'ge' :
									case 'le' :
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
								}
							}
						}
						if (isFilterApplied) {
							strFilter = strFilter + strTemp;
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
						if (displayType && displayType === 4 && strValue && strValue.match(reg)) {
							retValue = true;
						}

						return retValue;

				},
				reloadGridRawData : function() {
					var me = this;
					var gridView = me.getAdvFilterGridView();
					var filterView = me.getJobMonitorFilterView();
					var strUrl = Ext.String.format(me.strReadAllAdvancedFilterCodeUrl);
					Ext.Ajax.request({
						url : strUrl ,
						headers: objHdrCsrfParams,
						method : 'GET',
						success : function(response) {
							var decodedJson = Ext.decode(response.responseText);
							var arrJson = new Array();

							if (!Ext.isEmpty(decodedJson.d.filters)) {
								for (i = 0; i < decodedJson.d.filters.length; i++) {
									arrJson.push({
												"filterName" : decodedJson.d.filters[i]
											});
								}
							}
							gridView.loadRawData(arrJson);
							if (filterView)
								filterView
										.addAllSavedFilterCodeToView(decodedJson.d.filters);
						},
						failure : function(response) {
							// console.log("Ajax Get data Call Failed");
						}

					});
				}
});