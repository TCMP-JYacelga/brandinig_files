/**
 * @class GCP.controller.PaymentQueueSummaryController
 * @extends Ext.app.Controller
 * @author Shraddha Chauhan, Vinay Thube, Anil Pahane
 */
Ext.define('GCP.controller.PaymentQueueSummaryController', {
	extend : 'Ext.app.Controller',
	requires : ['GCP.view.PaymentQueueGridView', 'Ext.ux.gcp.DateUtil'],
	views : ['GCP.view.PaymentQueueFilterView',
			'GCP.view.PaymentQueueSummaryView',
			'GCP.view.PaymentQueueAdvFilterPopup', 'GCP.view.HistoryPopup',
			'GCP.view.PaymentQueueChangeDatePopup',
			'Ext.ux.gcp.PreferencesHandler', 'GCP.view.PaymentQueueRemarkPopup'],
	refs : [{
				ref : 'paymentQueueFilterView',
				selector : 'paymentQueueSummaryView paymentQueueFilterView'
			},
			{
				ref : 'paymentQueueCreateNewAdvFilter',
				selector : 'paymentQueueAdvFilterPopup paymentQueueCreateNewAdvFilter'
			}, {
				ref : 'filterUpperPanel',
				selector : 'paymentQueueSummaryView paymentQueueFilterView panel[itemId="filterUpperPanel"]'
			}, {
				ref : 'filterLowerPanel',
				selector : 'paymentQueueSummaryView paymentQueueFilterView panel[itemId="filterLowerPanel"]'
			}, {
				ref : 'statusToolbar',
				selector : 'paymentQueueSummaryView paymentQueueFilterView panel[itemId="filterLowerPanel"] toolbar[itemId="queueSubTypeToolBar"]'
			}, {
				ref : 'paymentQueueGridView',
				selector : 'paymentQueueGridView[itemId="paymentQueueBatchGrid"]'
			}, {
				ref : 'summaryView',
				selector : 'paymentQueueSummaryView'
			}, {
				ref : 'actionResult',
				selector : 'paymentQueueActionResult'
			}, {
				ref : 'fromDateLabel',
				selector : 'paymentQueueAdvFilterPopup paymentQueueCreateNewAdvFilter label[itemId="dateFilterFrom"]'
			}, 
			{
				ref : 'toDateLabel',
				selector : 'paymentQueueAdvFilterPopup paymentQueueCreateNewAdvFilter label[itemId="dateFilterTo"]'
			}, 
			{
				ref : 'dateLabel',
				selector : 'paymentQueueAdvFilterPopup paymentQueueCreateNewAdvFilter label[itemId="dateLabel"]'
			}, 
			{
				ref : 'entryDate',
				selector : 'paymentQueueAdvFilterPopup paymentQueueCreateNewAdvFilter button[itemId="entryDate"]'
			}, 
			{
				ref : 'fromEntryDate',
				selector : 'paymentQueueAdvFilterPopup paymentQueueCreateNewAdvFilter datefield[itemId="creationDateFrmFilterItemId"]'
			}, 
			{
				ref : 'toEntryDate',
				selector : 'paymentQueueAdvFilterPopup paymentQueueCreateNewAdvFilter datefield[itemId="creationDateToFilterItemId"]'
			}, 
			{
				ref : 'dateRangeComponent',
				selector : 'paymentQueueAdvFilterPopup paymentQueueCreateNewAdvFilter container[itemId="dateRangeComponent"]'
			},
			{
				ref : 'advanceFilterPopup',
				selector : 'paymentQueueAdvFilterPopup'
			}, {
				ref : 'saveSearchBtn',
				selector : 'paymentQueueAdvFilterPopup paymentQueueCreateNewAdvFilter button[itemId="saveAndSearchBtn"]'
			}, {
				ref : 'filterDetailsTab',
				selector : 'paymentQueueAdvFilterPopup panel[itemId="filterDetailsTab"]'
			}, {
				ref : 'savedFiltersToolBar',
				selector : 'paymentQueueSummaryView paymentQueueFilterView toolbar[itemId="advFilterActionToolBar"]'
			}, {
				ref : 'advFilterGridView',
				selector : 'paymentQueueAdvFilterPopup  paymentQueueAdvFilterGridView'
			}, {
				ref : 'withHeaderCheckboxRef',
				selector : 'paymentQueueSummaryView menuitem[itemId="withHeaderId"]'
			},	{
				ref : 'btnClearPreferences',
				selector : 'paymentQueueSummaryView paymentQueueFilterView button[itemId="btnClearPreferences"]'
			},{
				ref : 'btnSavePreferences',
				selector : 'paymentQueueSummaryView paymentQueueFilterView button[itemId="btnSavePreferences"]'
			},{
				ref : 'paymentQueueGroupView',
				selector : 'paymentQueueGridView[itemId="paymentQueueBatchGrid"] groupView'
			},
			{
				ref : 'btnClearAdvFilter',
				selector : 'paymentQueueSummaryView paymentQueueFilterView  panel[itemId="advFilterPanel"]  button[itemId="btnClearAdvFilter"]'
			}],
	config : {
		filterData : [],
		advFilterData : [],
		strFilterApplied : 'Q',
		savePrefAdvFilterCode : null,
		processingQueueTypeCode : strPaymentQueueType,
		processingQueueTypeDesc : getLabel('verify','Verify'),
		processingQueueSourceType : 'B',
		strStatusCountUrl : 'services/getBankProcessingQueueStatusCounts.srvc',
		strViewBatchUrl : 'viewBankProcessingQueue.srvc',
		strGetSavedFilterUrl : 'userfilters/bankProcessingQueue{0}/{1}.srvc',
		strReadAllAdvancedFilterCodeUrl : 'userfilterslist/bankProcessingQueue{0}.srvc',
		strExportUrl : 'services/getBankProcessingQueueList/getBankProcessingQueueDynamicReport.{0}',
		strGetModulePrefUrl : 'services/userpreferences/paymentqueue{0}/{1}.json',
		strCommonPrefUrl : 'services/userpreferences/paymentqueue{0}.json',
		strDefaultMask : '0000000000000000',
		intMaskSize : 16,
		filterCodeValue : null,
		advanceFilterPopup : null,
		preferenceHandler : null,
		strPrefPageKey : 'paymentQueue',
		objPrefJson : null,
		strPageName : 'paymentQueue',
		selectedTabInfo : 'all',
		reportGridOrder : null,
		dateFilterVal : '12',
		dateFilterLabel : null
	},
	init : function() {
		var me = this;
		me.dateHandler = Ext.create('Ext.ux.gcp.DateUtil');		
		var date = new Date(Ext.Date.parse(dtApplicationDate, strExtApplicationDateFormat));
		clientFromDate = me.dateHandler.getDateBeforeDays(date,filterDays);
		me.createPrefInstance();
		me.doApplySavedPreferences();
		me.updateConfig();
		$(document).on('dateChange', function(event,btn, opts) {
			me.dateFilterVal = btn.btnValue;
			me.dateFilterLabel = btn.text;
			me.handleDateChange(btn.btnValue);
			
		});
		me.control({
			'paymentQueueTitleView' : {
				'performReportAction' : function(btn) {
					 me.handleReportAction(btn);
				}
			},
			'paymentQueueSummaryView' : {
				'performReportAction' : function(btn) {
					 me.handleReportAction(btn);
				}
			},			
			'paymentQueueGridView[itemId="paymentQueueBatchGrid"]' : {
				'render' : function(panel) {
					me.handleGridReconfigure();
					me.toggleSavePrefrenceAction(true);
					me.setDataForQuickFilter(me.filterData);
					me.strFilterApplied = 'Q';
					me.applyQuickFilter();
					if (objPaymentQueuePref) {
						var objJsonData = Ext.decode(objPaymentQueuePref);
						objGroupByPref = objJsonData.d.preferences[me.processingQueueTypeCode];
						if (!Ext.isEmpty(objGroupByPref)) {
							me.toggleSavePrefrenceAction(false);
							me.toggleClearPrefrenceAction(true);
						}
					}
				}
			},
			'paymentQueueGridView[itemId="paymentQueueBatchGrid"] groupView' : {
				
				'groupTabChange' : function(groupInfo, subGroupInfo,
						tabPanel, newCard, oldCard) {
					//me.disablePreferencesButton("savePrefMenuBtn",false);
					//me.disablePreferencesButton("clearPrefMenuBtn",false);		
					//me.toggleSavePrefrenceAction(true);
					me.doHandleGroupTabChange(groupInfo, subGroupInfo,
							tabPanel, newCard, oldCard);
				},
				'gridRender' : function(groupInfo, subGroupInfo, objGrid,
								strDataUrl, pageSize, intNewPgNo, intOldPgNo, jsonSorter) {
					me.handleLoadGridData(objGrid,strDataUrl,
							pageSize, 1, 1, null);
							//console.log(objGrid.getDockedComponent());
							//var topcontainer = objGrid.getDockedItems('container[dock="top"]');
							//var label = topcontainer[0].down('label');
				},
				'gridPageChange' : function(groupInfo, subGroupInfo, objGrid,
								strDataUrl, pageSize, intNewPgNo, intOldPgNo, jsonSorter) {
					me.handleLoadGridData(objGrid, strDataUrl, pageSize,
							intNewPgNo, intOldPgNo, jsonSorter);
				},
				'gridSortChange' : function(groupInfo, subGroupInfo, objGrid,
								strDataUrl, pageSize, intNewPgNo, intOldPgNo, jsonSorter) {
					me.handleLoadGridData(objGrid, strDataUrl, pageSize,
							intNewPgNo, intOldPgNo, jsonSorter);
				},
				'gridRowSelectionChange' : function(groupInfo, subGroupInfo, objGrid,
								objRecord, intRecordIndex, arrSelectedRecords, jsonData) {
					me.doHandleGridRowSelectionChange(objGrid, objRecord,
							intRecordIndex, arrSelectedRecords, jsonData);
				},
				'gridRowActionClick' : function( grid, rowIndex,
							columnIndex, strAction, record, event) {
					me.doHandleRowIconClick(grid, rowIndex, columnIndex,
							strAction, event, record)
				},
				'groupActionClick' : function(actionName, isGroupAction,
						maskPosition, grid, arrSelectedRecords) {
						me.handleGroupActions(actionName, null,
							'groupAction', null);
						}
			},
			/*----------Filter section starts............*/
			'paymentQueueSummaryView paymentQueueFilterView' : {
				'render' : function() {
					var statusCode = me.objPrefJson
							? me.objPrefJson.statusCode
							: null;
					me.loadPaymentQueueStatus(statusCode);
					me.setInfoTooltip();
					me.readAllAdvancedFilterCode();
				},
				'quickFilterChange' : function(filterJson) {
					/*me.setDataForQuickFilter(filterJson);
					if (me.getSummaryView())
						me.getSummaryView().setLoading(true);
					me.loadPaymentQueueStatus(filterJson['statusCode']);
					*/
					me.setDataForQuickFilter(me.filterData);
					if (me.getSummaryView())
						me.getSummaryView().setLoading(true);
					me.loadPaymentQueueStatus();
					me.handleGridReconfigure();
					me.updateConfig();
					me.hideActionBar();
					me.toggleSavePrefrenceAction(true);
					me.updateAdvActionToolbar();
					
					//me.applyQuickFilter();
				},
				'quickStatusFilterChange' : function(filterJson) {
					me.setDataForQuickFilter(filterJson);
					if (me.getSummaryView())
						me.getSummaryView().setLoading(true);
					me.loadPaymentQueueStatus(filterJson['statusCode']);
					me.applyQuickFilter();
				},
				'paymentQueueChange' : function(strCode, strDesc) {
					me.processingQueueTypeCode = strCode;
					me.processingQueueTypeDesc = strDesc;
					me.resetClientFilterField();
					me.advFilterData = null;
					me.filterData = null; 
					me.setDataForQuickFilter(me.filterData);
					if (me.getSummaryView())
						me.getSummaryView().setLoading(true);
					me.loadPaymentQueueStatus();
					me.handleGridReconfigure();
					me.updateConfig();
					me.hideActionBar();
					me.toggleSavePrefrenceAction(true);
					me.updateAdvActionToolbar();
				},
				'processingQueueChange' : function(strCode, strDesc) {
					me.processingQueueTypeCode = strCode;
					me.processingQueueTypeDesc = strDesc;
					me.resetClientFilterField();
					me.advFilterData = null;
					me.filterData = null; 
				    var filterView = me.getPaymentQueueFilterView();
                    filterView.handleQuickFilterChange()
					var objToolbar = me.getSavedFiltersToolBar();
					if (objToolbar.items && objToolbar.items.length > 0)
						objToolbar.removeAll();
					me.toggleClearAdvFilterAction(false);
				},
				'handleSavedFilterItemClick' : function(strFilterCode, btn) {
				    me.resetQuickFilter();
					me.doHandleSavedFilterItemClick(strFilterCode, btn);
				},
				'moreAdvancedFilterClick' : function(btn) {
					me.handleMoreAdvFilterSet(btn.itemId);
				},
				'clearAdvFilter' : function(filterJson) 
				{
					me.toggleClearAdvFilterAction(false);
					me.resetQuickFilter();
					me.strFilterApplied='Q';
					me.advFilterData = null;
					creationdate1=null;
					creationdate2=null;
				   /*	me.setDataForQuickFilter(filterJson);
					if (me.getSummaryView())
						me.getSummaryView().setLoading(true);
					me.loadPaymentQueueStatus(filterJson['statusCode']);*/
					me.setDataForQuickFilter(me.filterData);
					if (me.getSummaryView())
						me.getSummaryView().setLoading(true);
					me.loadPaymentQueueStatus();
					me.handleGridReconfigure();
					me.updateConfig();
					me.hideActionBar();
					me.toggleSavePrefrenceAction(true);
					me.updateAdvActionToolbar();
				}
			},
			'paymentQueueSummaryView paymentQueueFilterView  panel[itemId="advFilterPanel"]  button[itemId="newFilter"]' : {
				'click' : function(btn, opts) {
					me.showAdvanceFilterPopup();
				}
			},
			'paymentQueueAdvFilterPopup paymentQueueCreateNewAdvFilter' : {
				'handleSearchAction' : function(btn) {
					me.toggleClearAdvFilterAction(true);
					me.applyAdvancedFilter(btn);
				},
				'handleSaveAndSearchAction' : function(btn) {
					me.toggleClearAdvFilterAction(true);
					me.handleSaveAndSearchAdvFilter(btn);
				},
				'closeFilterPopup' : function(btn) {
					me.closeFilterPopup(btn);
				}
			},
			'paymentQueueAdvFilterPopup paymentQueueAdvFilterGridView' : {
				'orderUpEvent' : me.orderUpDown,
				'deleteFilterEvent' : me.deleteFilterSet,
				'viewFilterEvent' : me.viewFilterData,
				'editFilterEvent' : me.editFilterData,
				'filterSearchEvent' : me.searchFilterData
			},
			'paymentQueueSummaryView paymentQueueFilterView button[itemId="btnSavePreferences"]' : {
				click : function(btn, opts) {
					me.toggleSavePrefrenceAction(false);
					me.handleSavePreferences();
				}
			},
			'paymentQueueSummaryView paymentQueueFilterView button[itemId="btnClearPreferences"]' : {
				click : function(btn, opts) {
					me.toggleClearPrefrenceAction(false);
					me.handleClearPreferences();
				}
			}
				/*----------Filter section ends............*/
		});
	},
	
	doHandleGroupTabChange : function(groupInfo, subGroupInfo, tabPanel,
			newCard, oldCard) {
		var me = this;
		var objGroupView = me.getPaymentQueueGridView();
		var strModule = '', strUrl = null, args = null, strFilterCode = null;
		groupInfo = groupInfo || {};
		subGroupInfo = subGroupInfo || {};
		if (groupInfo) {
				args = {
					scope : me
				};
				strModule = subGroupInfo.groupCode;
				me.selectedTabInfo = subGroupInfo; 
				strUrl = Ext.String.format(me.strGetModulePrefUrl, me.processingQueueTypeCode, strModule);
				me.getSavedPreferences(strUrl,
						me.postHandleDoHandleGroupTabChange, args);
		}
	},
	getSavedPreferences : function(strUrl, fnCallBack, args) {
		var me = this;
		var data = null;
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
						Ext.Function.bind(fnCallBack, me);
						if (fnCallBack)
							fnCallBack(data, args);					
					}

				});
	},
	postHandleDoHandleGroupTabChange : function(data, args) {
		var me = args.scope;
		var objPref = null, gridModel = null, intPgSize = null, showPager = true, heightOption = null;
		var colModel = null, arrCols = null;
		var objGroupView = me.getPaymentQueueGroupView();
		var objGridView = me.getPaymentQueueGridView();
		if (data && data.preference) {
			objPref = Ext.decode(data.preference);
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
			colModel = objGridView.getGroupColumns(arrCols, me.processingQueueTypeCode);
			if (colModel) {
				gridModel = {
					columnModel : colModel,
					pageSize : intPgSize,
					showPagerForced : showPager,
					heightOption : heightOption,
					storeModel : {
						sortState : objPref.sortState
					}
				}
			}
		}
		objGroupView.reconfigureGrid(gridModel);
	},
	hideActionBar : function () {
		var me = this;	
		var actionBar = me.getActionResult();
		actionBar.hide();	
	},
	createPrefInstance : function() {
		var me = this;
		me.preferenceHandler = Ext.create('Ext.ux.gcp.PreferencesHandler');
	},
	updateConfig : function() {
		var me = this;
		var filterView = me.getPaymentQueueFilterView();
			if(!Ext.isEmpty(clientAutoCompleter))
				me.resetClientFilterField();
			if (filterView)
				filterView.highlightSavedFilter("");	
		if (!Ext.isEmpty(objPaymentQueuePref)) {
			var objJsonData = Ext.decode(objPaymentQueuePref);
			var objPref = objJsonData.d.preferences[me.processingQueueTypeCode];
			var clientAutoCompleter = me.getFilterUpperPanel();
			if (!Ext.isEmpty(objPref)){
				objPref = objPref[0].jsonPreferences.quickFilter;
				if (objPref) {
					strSeller = objPref['sellerCode'] || strSeller;
					strClient = objPref['clientCode'] || strClient;
					strClientDesc = objPref['clientDesc'] || strClientDesc;
					me.setDataForQuickFilter(objPref);
					me.filterData = objPref;
					me.objPrefJson = objPref;
					if(!Ext.isEmpty(clientAutoCompleter))
						clientAutoCompleter.down('AutoCompleter[itemId="bankProcessingQueueClientId"]').setValue(strClientDesc);
				}
				var filterCode = objJsonData.d.preferences[me.processingQueueTypeCode][0].jsonPreferences.advFilterCode;
				if(!Ext.isEmpty(filterCode)){
					me.searchFilterData(filterCode);
				}
				var columnModel = objJsonData.d.preferences[me.processingQueueTypeCode][0].jsonPreferences.gridCols;
				paymentPref = columnModel;
			}
		}
	},
	resetClientFilterField : function() {
		var me = this;
		var filter = me.getFilterUpperPanel();
		var clientAutocompleter = filter.down('AutoCompleter[itemId="bankProcessingQueueClientId"]');
		clientAutocompleter.clearValue()
	},
	doApplySavedPreferences : function() {
		var me = this;
		var objPref = null;
		objPref = me.preferenceHandler.getLocalPreferences(me.strPrefPageKey);
		me.processingQueueTypeCode = strPaymentQueueType;
		if (objPref) {
			me.processingQueueTypeCode = strPaymentQueueType = objPref['queueType']
					|| strPaymentQueueType;
			strSeller = objPref['sellerCode'] || strSeller;
			strClient = objPref['clientCode'] || strClient;
			strClientDesc = objPref['clientDesc'] || strClientDesc;
			me.setDataForQuickFilter(objPref);
			me.objPrefJson = objPref;
			me.preferenceHandler.setLocalPreferences(me.strPrefPageKey, null);			
		}
	},
	doSavePreferenceToLocale : function() {
		var me = this, filter = me.getPaymentQueueFilterView(), data = null;
		data = filter.getQuickFilterJSON(me.processingQueueTypeCode);
		
		me.preferenceHandler.setLocalPreferences(me.strPrefPageKey, data);
	},
	handleGridReconfigure : function() {
		var me = this;
		var gridView = null;
		gridView = me.getPaymentQueueGridView();
		gridView.reconfigureGroup(me.processingQueueTypeCode);
	},
	handleLoadGridData : function(grid, url, pgSize, newPgNo, oldPgNo, sorter) {
		var me = this, summaryView = me.getSummaryView(), groupView = me
				.getPaymentQueueGroupView();;
		var strUrl = url;
		var columns=grid.columns;
		Ext.each(columns, function(col) {
	        if(col.dataIndex=="statusDesc" ){
	        	col.sortable=false;
	        }
        }); 
		me.setDataForQuickFilter(me.objPrefJson);
		me.objPrefJson = null;
		// TODO : Service should be same
		if (!Ext.isEmpty(me.processingQueueTypeCode)
				&& 'R' == me.processingQueueTypeCode) {
			strUrl = 'getBankProcessingRepairQueueList.srvc';
		}
		strUrl = grid.generateUrl(strUrl, pgSize, newPgNo, oldPgNo, sorter);
		strUrl = strUrl + me.getFilterUrl();
		strUrl += "&$batchInstFltr=" + me.processingQueueSourceType;
		strUrl += "&$queueTypeFltr=" + me.processingQueueTypeCode;	
		strUrl += "&" + csrfTokenName + "=" + csrfTokenValue;
		if (Ext.isEmpty(summaryView.loadMask))
			summaryView.setLoading(true);
		if (groupView)
			groupView.handleGroupActionsVisibility(me.strDefaultMask);
		me.reportGridOrder = strUrl;
		grid.loadGridData(strUrl, me.postHandleLoadGridData, null, false, me);
	},
	postHandleLoadGridData : function() {
		var me = this, summaryView = me.getSummaryView();
		if (summaryView) {
			summaryView.setLoading(false);
		}
	},
	doHandleGridRowSelectionChange : function(grid, record, recordIndex,
			selectedRecords, jsonData) {
		var me = this, buttonMask = me.strDefaultMask;
		var maskArray = new Array(), actionMask = '', objData = null;;
		var groupView = me.getPaymentQueueGroupView();

		if (!Ext.isEmpty(jsonData) && !Ext.isEmpty(jsonData.d.__buttonMask)) {
			buttonMask = jsonData.d.__buttonMask;
		}
		maskArray.push(buttonMask);
		for (var index = 0; index < selectedRecords.length; index++) {
			objData = selectedRecords[index];
			maskArray.push(objData.get('__metadata').__rightsMap);
		}
		actionMask = doAndOperation(maskArray, me.intMaskSize);
		if (groupView)
			groupView.handleGroupActionsVisibility(actionMask);
	},
	doHandleRowIconClick : function(tableView, rowIndex, columnIndex,
			actionName, event, record) {
		var me = this;
		var popup = null, strActionUrl = '';
		if (actionName === 'btnHistory') {
			var recHistory = record.get('history');
			if (!Ext.isEmpty(recHistory)
					&& !Ext.isEmpty(recHistory.__deferred.uri)) {
				me.showHistory(record.get('history').__deferred.uri, record
								.get('identifier'));
			}
		} else if (actionName === 'btnView') {
			me.doSavePreferenceToLocale();
			var updateIndex = rowIndex;
			var strUrl = '', objFormData = {};
			strUrl = me.strViewBatchUrl;
			objFormData.strPhdnumber = record.get('pirNmbr') || '';
			objFormData.strIdentifier = record.get('identifier');
			objFormData.strProduct = record.get('product');
			objFormData.strInternalTxnNmbr = record.raw.internalTxnNmbr;
			objFormData.strQueueSubType = record.raw.queueSubType;
			if (!Ext.isEmpty(strUrl))
				me.doSubmitForm(strUrl, objFormData);
			//if(me.processingQueueTypeCode === 'CW'){
			//	readPaymentPaymentQueueHeader(strPirNumber);
			//}	
		} else if (actionName === 'btnAddRemark'
				|| actionName === 'btnViewRemark') {
			strActionUrl = Ext.String
					.format('{0}?&$batchInstFltr={1}&{2}={3}', record
									.get('remark').__deferred.uri,
							me.processingQueueSourceType, csrfTokenName,
							csrfTokenValue);
			popup = Ext.create('GCP.view.PaymentQueueRemarkPopup', {
						strRemark : record.get('makerRemark') || null,
						strAction : actionName === 'btnAddRemark'
								? 'ADD'
								: 'VIEW'
					});
			popup.show();
			popup.on('addRemark', function(strRemark) {
						me.preHandleGroupActions(strActionUrl, strRemark,
								record, null, actionName);
					});

		} else {
			me.handleGroupActions(actionName, null, 'rowAction', record);
		}
	},
	doHandleSaveMakerRemark : function(strRemark, record) {
		record.beginEdit();
		record.set({
					makerRemark : strRemark
				});
		record.endEdit();
		record.commit();
	},
	doSubmitForm : function(strUrl, formData) {
		var me = this;
		var form = null;
		form = document.createElement('FORM');
		form.name = 'frmMain';
		form.id = 'frmMain';
		form.method = 'POST';
		form.appendChild(me.createFormField('INPUT', 'HIDDEN',
				csrfTokenName, csrfTokenValue));
		form.appendChild(me.createFormField('INPUT', 'HIDDEN', 'txtPirNumber',
				formData.strPhdnumber));
		form.appendChild(me.createFormField('INPUT', 'HIDDEN', 'txtIdentifier',
				formData.strIdentifier));
		form.appendChild(me.createFormField('INPUT', 'HIDDEN', 'txtQueueType',
				me.processingQueueTypeCode));
		form.appendChild(me.createFormField('INPUT', 'HIDDEN', 'txtProduct',
				formData.strProduct));
		form.appendChild(me.createFormField('INPUT', 'HIDDEN', 'txtInternalTxnNmbr',
				formData.strInternalTxnNmbr));
		if(!Ext.isEmpty(formData.strQueueSubType)) {
			form.appendChild(me.createFormField('INPUT', 'HIDDEN', 'txtQueueSubType',
					formData.strQueueSubType));
		}
		
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
	showHistory : function(url, identifier) {
		Ext.create('GCP.view.HistoryPopup', {
					historyUrl : url + '?' + csrfTokenName + '='
							+ csrfTokenValue,
					identifier : identifier
				}).show();
	},
	handleGroupActions : function(strAction, opts, strActionType, record) {
		var me = this;
		var strUrl = me.getGridActionUrl(strAction);
		
		if((me.processingQueueTypeCode === 'L' || me.processingQueueTypeCode === 'C' || me.processingQueueTypeCode === 'W' || me.processingQueueTypeCode === 'D' || me.processingQueueTypeCode === 'R') && strAction === 'changeDate'){
			me.captureChangeDate(strAction, strUrl, record, strActionType);
		}
		else if (strAction == 'accept') {
			me.preHandleGroupActions(strUrl, '',record, strActionType, strAction);			
		}
		else{
			me.captureRemark(strAction, strUrl, record, strActionType);
		}		
	},
	captureRemark : function(strAction, strActionUrl, record, strActionType) {
		var me = this;
		if(strActionType === 'groupAction'){
		var fieldLbl = getLabel('paymentQueue.field.lbl.remark',
				'Please enter remark'), titleMsg = getLabel(
				'paymentQueue.lbl.remark', 'Remark');
		var msgbox = Ext.Msg.show({
					title : titleMsg,
					msg : fieldLbl,
					buttons : Ext.Msg.OKCANCEL,
					multiline : 4,
					cls:'t7-popup',
					width: 355,
					height : 270,
					bodyPadding : 0,
					fn : function(btn, text) {
						if (btn == 'ok') {
							me.preHandleGroupActions(strActionUrl, text,
									record, strActionType, strAction);
						}
					}
				});
		msgbox.textArea.enforceMaxLength = true;
		msgbox.textArea.inputEl.set({
			maxLength : 255
		});
		}else{		
			var	popup = Ext.create('GCP.view.PaymentQueueRemarkPopup', {
							strRemark : record.get('makerRemark') || null,
							strAction : 'ADD'
						});
				popup.show();
				popup.on('addRemark', function(strRemark) {
							me.preHandleGroupActions(strActionUrl, strRemark,
									record, 'rowAction', strAction);
					});	
		}				
	},
	captureChangeDate : function(strAction, strUrl, record, strActionType) {
		var me = this;
		var groupView = me.getPaymentQueueGroupView();
		var grid = groupView.down('smartgrid'), popup = null;
		var records = grid.getSelectedRecords();
		var intInstrumentCount = 0, intBatchCount = 0;
		records = (!Ext.isEmpty(records) && Ext.isEmpty(record))
				? records
				: [record];

		Ext.each(records, function(rec) {
					intInstrumentCount += parseInt(rec.get("totalTxns"),10);
				});
		intBatchCount = records.length;
		popup = Ext.create('GCP.view.PaymentQueueChangeDatePopup', {
					'batchCount' : intBatchCount,
					'instCount' : intInstrumentCount
				});
		popup.show();
		popup.on('queueDateChange', function(strDate, strRemark) {
					me.preHandleGroupActions(strUrl, strRemark, record,
							strActionType, strAction, strDate);
				});
	},
	preHandleGroupActions : function(strUrl, remark, record, strActionType,
			strAction, changedDate) {
		var me = this;
		var groupView = me.getPaymentQueueGroupView();
		var grid = groupView.down('smartgrid'), objJson = null;
		if (!Ext.isEmpty(grid)) {
			var arrayJson = new Array();
			var records = grid.getSelectedRecords();
			records = (!Ext.isEmpty(records) && Ext.isEmpty(record))
					? records
					: [record];
			for (var index = 0; index < records.length; index++) {
				objJson = {
					serialNo : grid.getStore().indexOf(records[index]) + 1,
					identifier : records[index].data.identifier,
					userMessage : remark
				}
				if (changedDate)
					objJson['recalcOffsetDateFlag'] = changedDate;
				arrayJson.push(objJson);
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
						success : function(response) {
							groupView.setLoading(false);
							var jsonRes = Ext.JSON
									.decode(response.responseText);
							me.postHandleGroupAction(jsonRes, strActionType,
									strAction, record);
						},
						failure : function() {
							groupView.setLoading(false);
							var errMsg = "";
							Ext.MessageBox.show({
										title : getLabel(
												'paymentQueue.error.title',
												'Error'),
										msg : getLabel(
												'paymentQueue.error.msg',
												'Error while fetching data..!'),
										buttons : Ext.MessageBox.OK,
										icon : Ext.MessageBox.ERROR
									});
						}
					});
		}

	},
	postHandleGroupAction : function(jsonData, strActionType, strAction,
			records) {
		var me = this;
		var msg = '', strIsProductCutOff = 'N', errCode = '', actionMsg = [], actionData = [], record = '';
		var gridView = me.getPaymentQueueGridView();
		var grid = gridView.getGrid();
		var strActionSuccess = getLabel('instrumentActionPopUpSuccessMsg',
				'Action Successful');
		var warnLimit = getLabel('warningLimit', 'Warning limit exceeded!');
		var filter = me.getPaymentQueueFilterView();
		var data = filter.getQuickFilterJSON(me.processingQueueTypeCode);

		if (!Ext.isEmpty(jsonData) && !Ext.isEmpty(jsonData.d)
				&& !Ext.isEmpty(jsonData.d.instrumentActions))
			actionData = jsonData.d.instrumentActions;
		Ext.each(actionData, function(result) {
					record = grid.store.getAt(parseInt(result.serialNo,10) - 1);
					msg = '';
					strIsProductCutOff = 'N';
					Ext.each(result.errors, function(error) {
								msg = msg + error.code + ' : '
										+ error.errorMessage + '<br/>';
								errCode = error.code;
								if (!Ext.isEmpty(errCode)
										&& errCode.substr(0, 4) === 'WARN')
									strIsProductCutOff = 'Y';
							});

					actionMsg.push({
								success : result.success,
								actualSerailNo : result.serialNo,
								isProductCutOff : strIsProductCutOff,
								actionTaken : 'N',
								reference : Ext.isEmpty(record) ? '' : record
										.get('pirNmbr'),
								actionMessage : result.success === 'Y'
										? strActionSuccess
										: (result.success === 'W02'
												? warnLimit
												: msg)
							});

				});
		if (!Ext.isEmpty(actionMsg)) {
			var actionResult = me.getActionResult();
			if (actionResult)
				actionResult.addRecords(actionMsg);
			actionResult.show();
		}
		me.loadPaymentQueueStatus(data['statusCode']);
		gridView.refreshGroupView();
	},
	getGridActionUrl : function(strAction) {
		var me = this, strQueueType = null;
		if (me.processingQueueTypeCode == 'D')
			strQueueType = "debitQueue";
		else if (me.processingQueueTypeCode == 'C')
			strQueueType = "clearingQueue";
		else if (me.processingQueueTypeCode == 'R')
			strQueueType = "repairQueue";
		else if (me.processingQueueTypeCode == 'W')
			strQueueType = "warehouseQueue";
		else if (me.processingQueueTypeCode == 'L')
			strQueueType = "liquidationQueue";
		else
			strQueueType = "verificationQueue";
		return Ext.String.format(
				'{0}List/{1}.srvc?&$batchInstFltr={2}&{3}={4}', strQueueType,
				strAction, me.processingQueueSourceType, csrfTokenName,
				csrfTokenValue);
	},
	getFilterUrl : function() {
		var me = this;
		var strQuickFilterUrl = '', strActionStatusUrl = '', strAdvancedFilterUrl = '', strUrl = '', isFilterApplied = false;
		// Always taking Quick filter hence condition commented
		/*
		 * if( me.strFilterApplied === 'ALL' || me.strFilterApplied === 'Q' ) {
		 */
		strQuickFilterUrl = me.generateUrlWithQuickFilterParams(me);
		if (!Ext.isEmpty(strQuickFilterUrl)) {
			strUrl = strQuickFilterUrl;
			isFilterApplied = true;
		}
		/*
		 * } else
		 */
		// if advance filter applied then append it with quick filter in the
		// final url
		if (me.strFilterApplied === 'A') {
			strAdvancedFilterUrl = me.generateUrlWithAdvancedFilterParams(me);
			if (!Ext.isEmpty(strAdvancedFilterUrl)) {
				strUrl = strQuickFilterUrl + ' and ' + strAdvancedFilterUrl;
				isFilterApplied = true;
			}
		}
		
		var groupFilter = me.selectedTabInfo;
		groupFilter = groupFilter['groupQuery'];
		if(!Ext.isEmpty(groupFilter)) {
			strUrl = strUrl + ' and ' + groupFilter;
		}
		return strUrl;
	},
	generateUrlWithQuickFilterParams : function(thisClass) {
		var filterData = thisClass.filterData;
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
		var quickFilter = thisClass.filterData;
		var isClientIncludedInQuick = false;
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
		
		quickFilter.forEach(function(filterItem) {
			if(filterItem.paramName === 'clientName') {
				isClientIncludedInQuick = true;
			}
		});
		
		if (!Ext.isEmpty(filterData)) {
			for (var index = 0; index < filterData.length; index++) {
				if(filterData[index].field == 'seller'){
                    continue;
                }
				if(filterData[index].field == 'errorClassification' && thisClass.processingQueueTypeCode !='D'){
                    continue;
                }								
				if(!isClientIncludedInQuick || filterData[index].field !== 'clientName') {
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
	handleReportAction : function(btn, opts) {
		var me = this;
		me.downloadReport(btn.itemId);
	},
	downloadReport : function(actionName) {
		var me = this;
		var withHeaderFlag = me.getWithHeaderCheckboxRef().checked;
		var currentPage = 1, strExtension = '', strUrl = '', strSelect = '', viscols, col = null, visColsStr = "", colMap = new Object(), colArray = new Array(), strQuickFilterUrl = null;
		var arrExtension = {
			downloadXls : 'xls',
			downloadCsv : 'csv',
			processingQReportPdf : 'pdf',
			downloadTsv : 'tsv'			
		};
		var gridView = me.getPaymentQueueGridView();
		var grid = gridView.getGrid();
		strExtension = arrExtension[actionName];
		strUrl = Ext.String.format(me.strExportUrl, strExtension);
		strUrl += '?$skip=1';
		strUrl += "&$batchInstFltr=" + me.processingQueueSourceType;
		//processingQueueTypeCode
		strUrl += '&$queueTypeFltr=' + me.processingQueueTypeCode;
		
		//strQuickFilterUrl = me.generateUrlWithQuickFilterParams(this);
		//strUrl += strQuickFilterUrl;
		strUrl += me.getFilterUrl();
		var strOrderBy = me.reportGridOrder;
		if (!Ext.isEmpty(strOrderBy)) {
			var orderIndex = strOrderBy.indexOf('orderby');
			if (orderIndex > 0) {
				strOrderBy = strOrderBy.substring(orderIndex,
						strOrderBy.length);
				var indexOfamp = strOrderBy.indexOf('&$');
				if (indexOfamp > 0)
					strOrderBy = strOrderBy.substring(0, indexOfamp);
				strUrl += '&$' + strOrderBy;
			}
		}	
		
		viscols = grid.getAllVisibleColumns();
		for (var j = 0; j < viscols.length; j++) {
			col = viscols[j];
			if (col.dataIndex && arrSortColumn[col.dataIndex]) {
				if (colMap[arrSortColumn[col.dataIndex]]) {
					// ; do nothing
				} else {
					colMap[arrSortColumn[col.dataIndex]] = 1;
					colArray.push(arrSortColumn[col.dataIndex]);

				}
			}

		}
		if (colMap != null) {
			visColsStr = visColsStr + colArray.toString();
			strSelect = '&$select=[' + colArray.toString() + ']';
		}

		strUrl = strUrl + strSelect;
		form = document.createElement('FORM');
		form.name = 'frmMain';
		form.id = 'frmMain';
		form.method = 'POST';
		form.appendChild(me.createFormField('INPUT', 'HIDDEN',
				csrfTokenName, csrfTokenValue));
		form.appendChild(me.createFormField('INPUT', 'HIDDEN', 'txtCurrent',
				currentPage));
		form.appendChild(me.createFormField('INPUT', 'HIDDEN', 'txtCSVFlag',
				withHeaderFlag));
		form.action = strUrl;
		document.body.appendChild(form);
		form.submit();
		document.body.removeChild(form);
	},
	/** ************* filter ********** */
	showAdvanceFilterPopup : function() {
		var me = this, filter = me.getPaymentQueueFilterView();
		var filterDetailsTab = me.getFilterDetailsTab();
		me.filterCodeValue = null;
		var data = filter.getQuickFilterJSON(me.processingQueueTypeCode);
		if (Ext.isEmpty(me.advanceFilterPopup)) {
			me.createAdvanceFilterPopup();
		}
		me.reloadGridRawData();
		var objCreateNewFilterPanel = me.getAdvanceFilterPopup()
				.down('paymentQueueCreateNewAdvFilter');
		objCreateNewFilterPanel.resetAllFields(objCreateNewFilterPanel);
		me.advanceFilterPopup.sellerVal = data['sellerCode'];
		me.advanceFilterPopup.queueType = data['queueType'];
		objCreateNewFilterPanel.hideShowFields(objCreateNewFilterPanel,
				data['queueType']);
		objCreateNewFilterPanel.enableDisableFields(objCreateNewFilterPanel,
				false);
		if(!Ext.isEmpty(data['queueType']) && data['queueType']=='D' )
		{
			objCreateNewFilterPanel.selectDebitBatchStatus(objCreateNewFilterPanel,
					data['queueType']);
		}
		if(filterDetailsTab){
			filterDetailsTab.setTitle(getLabel('createNewFilter', 'Create New Filter'));
		}
		me.getSaveSearchBtn().show();
		me.advanceFilterPopup.show();
		me.advanceFilterPopup.down('tabpanel').setActiveTab(1);
		me.dateFilterVal = defaultDateFilter;
		/*me.dateFilterLabel = getLabel('today', 'Today');*/
		me.dateFilterLabel = getLabel("daterange."+me.dateFilterVal,"Date Range");
		me.handleDateChange(me.dateFilterVal);
	},
	createAdvanceFilterPopup : function() {
		var me = this, filter = me.getPaymentQueueFilterView();
		var data = filter.getQuickFilterJSON(me.processingQueueTypeCode);
		me.advanceFilterPopup = Ext.create(
				'GCP.view.PaymentQueueAdvFilterPopup', {
					sellerVal : data['sellerCode'],
					queueType : data['queueType']
				});
	},
	getPaymentQueueStatusUrl : function() {
		var me = this, filter = me.getPaymentQueueFilterView();
		var sellerAddedAlready = null;
		var data = filter.getQuickFilterJSON(me.processingQueueTypeCode);
		var extraFilters = '&$sourceType=' + me.processingQueueSourceType;
        if (me.strFilterApplied === 'A') {
        var strAdvancedFilterUrl = me.generateUrlWithAdvancedFilterParams(me);
        if(strAdvancedFilterUrl.indexOf(data['sellerCode']) != -1){
        sellerAddedAlready = 'T';
        }
        }
		if (data['sellerCode'] && sellerAddedAlready != 'T') {
			extraFilters = extraFilters + '&$seller=' + data['sellerCode'];
		}
		if (data['clientCode']) {
			extraFilters = extraFilters + '&$clientName=' + data['clientCode'];
		}
		if (me.processingQueueTypeCode) {
			extraFilters = extraFilters + '&$queueType='
					+ me.processingQueueTypeCode;
		}
		return extraFilters;
	},
	loadPaymentQueueStatus : function(strSelectedStatus) {
		var me = this;
		me.setDataForQuickFilter(me.objPrefJson);
		var filterView = me.getPaymentQueueFilterView();
		if(me.processingQueueTypeCode == 'W')
			{
			var clientAutoCompleter = me.getFilterUpperPanel()
			.down('combobox[itemId="bankProcessingQueueClientId"]');
			 clientAutoCompleter.cfgUrl ='services/userseek/BankProcessingQueueWHClient.json';
			 
			}
		else
			{
			var clientAutoCompleter = me.getFilterUpperPanel()
			.down('combobox[itemId="bankProcessingQueueClientId"]');
			 clientAutoCompleter.cfgUrl = 'services/userseek/BankProcessingQueueClient.json';
			 
			}
		if(me.processingQueueTypeCode != 'Q' && me.processingQueueTypeCode != 'CW'){
			var filterData = me.filterData;
			var filterUrl = null;
			var newFilterData = [];
			for(var i=0;i<filterData.length;i++){
				if(filterData[i].paramName != 'queueSubType'){
					newFilterData.push(filterData[i]);
				}
			}
			me.filterData = newFilterData;
			filterUrl = me.getFilterUrl();
			me.filterData = filterData;
			Ext.Ajax.request({
						url : me.strStatusCountUrl + '?&' + me.getPaymentQueueStatusUrl() + filterUrl,
						headers: objHdrCsrfParams,
						method : "GET",
						async : false,
						success : function(response) {
							if (!Ext.isEmpty(response.responseText)) {
								var data = Ext.decode(response.responseText);
								var arrItems = [];
								if (data && data.d && data.d.queueCounts)
									arrItems = data.d.queueCounts;
								if (filterView)
									filterView.loadPaymentStatus(arrItems,
											me.processingQueueTypeCode,
											strSelectedStatus);
							}

						},
						failure : function(response) {
						}
				});
		}		
	},
	setDataForQuickFilter : function(filterJson) {
		var me = this, filter = me.getPaymentQueueFilterView(), arrFilter = [];
		var data = filterJson || filter.getQuickFilterJSON(me.processingQueueTypeCode);
		if (data) {
			if(!data['queueType']){
				data['queueType'] = strPaymentQueueType;
			}
			if((data['queueType']  && data['queueType'] == 'D') && !Ext.isEmpty(debitBatchStatus) && debitBatchStatus !='All')
			{	if(me.strFilterApplied != 'A')
					arrFilter.push({
						paramName : 'status',
							operatorValue : 'eq',
							paramValue1 : debitBatchStatus,
							dataType : 'S'
					});
			}
			arrFilter.push({
						paramName : 'queueType',
						paramValue1 : (data['queueType'] || 'V'),
						operatorValue : 'eq',
						dataType : 'S'
					});
			arrFilter.push({
						paramName : 'sourceType',
						paramValue1 : 'B',
						operatorValue : 'eq',
						dataType : 'S'
					});
			if (data['sellerCode'])
				arrFilter.push({
							paramName : 'seller',
							paramValue1 : (data['sellerCode'] || '')
									.toUpperCase(),
							operatorValue : 'eq',
							dataType : 'S'
						});
			if (data['statusCode']) {
				arrFilter.push({
							paramName : 'queueSubType',
							paramValue1 : (data['statusCode']),
							operatorValue : 'eq',
							dataType : 'S'
						});
			}
			if (data['clientCode'])
				arrFilter.push({
							paramName : 'clientName',
							paramValue1 : encodeURIComponent((data['clientCode'] || '').replace(new RegExp("'", 'g'), "\''")),
							operatorValue : 'lk',
							dataType : 'S'
						});
			if ( data['creationDate1'] == null && data['creationDate2'] == null ){
				var objDateParams = me.getDateParam(defaultDateFilter, null);
				arrFilter.push({
							paramName : 'creationDate',
							paramValue1 : objDateParams.fieldValue1,
							paramValue2 : objDateParams.fieldValue2,
							operatorValue : 'bt',
							dataType : 'D'
						});
			}
						
		}
		me.filterData = arrFilter;
	},
	setDataForAdvanceFilter : function() {
		var me = this;
		var objCreateNewAdvFilter = me.getAdvanceFilterPopup()
				.down('paymentQueueCreateNewAdvFilter');
		var objJson = objCreateNewAdvFilter.getAdvancedFilterValueJson(
				me.filterCodeValue, objCreateNewAdvFilter);
		me.advFilterData = objJson.filterBy;
		me.overrideValuesOfQuickFilter(me.advFilterData);
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
	setInfoTooltip : function() {
		var me = this, filter = me.getPaymentQueueFilterView(), arrFilter = [];;
		Ext.create('Ext.tip.ToolTip', {
					target : 'imgFilterInfoStdView',
					listeners : {
						'beforeshow' : function(tip) {
							var data = filter.getQuickFilterJSON(me.processingQueueTypeCode);
							var financialInstitutionVal = data['sellerCode'];
							var clientVal = (data['clientCode'] || getLabel(
									'none', 'None'));
							var statusFilter = (data['statusDesc'] || getLabel(
									'none', 'None'));
							var advfilter = (me.filterCodeValue || getLabel(
									'none', 'None'));
							tip.update(getLabel('lblfinancialinstitution',
									'Financial Insitution')
									+ ' : '
									+ financialInstitutionVal
									+ '<br/>'
									+ getLabel('client', 'Company Name')
									+ ' : '
									+ clientVal
									+ '<br/>'
									+ getLabel('status', 'Status')
									+ ' : '
									+ statusFilter
									+ '<br/>'
									+ getLabel('lbladvancedfilter',
											'Advanced Filter')
									+ ':'
									+ advfilter);
						}
					}
				});

	},
	applyQuickFilter : function() {
		var me = this;
		var gridView = me.getPaymentQueueGridView();
		var filterView = me.getPaymentQueueFilterView();
		filterView.highlightSavedFilter(null);
		gridView.refreshGroupView();
	},
	closeFilterPopup : function(btn) {
		var me = this;
		var advFilterPopup = me.getAdvanceFilterPopup();
		advFilterPopup.close();
	},
	applyAdvancedFilter : function() {
		var me = this, filter = me.getPaymentQueueFilterView();
		var data = filter.getQuickFilterJSON(me.processingQueueTypeCode);
		var objGroupView = me.getPaymentQueueGroupView();
		me.strFilterApplied = 'A';
		me.setDataForAdvanceFilter();
		objGroupView.reconfigureGrid(me.processingQueueTypeCode);
		//me.handleGridReconfigure();
		me.loadPaymentQueueStatus(data['statusCode']);
		me.updateAdvActionToolbar();
		me.closeFilterPopup();
	},
	handleSaveAndSearchAdvFilter : function(btn) {
		var me = this;
		var objCreateNewFilterPanel = me.getAdvanceFilterPopup()
				.down('paymentQueueCreateNewAdvFilter');
		var advGridView = me.getAdvanceFilterPopup()
				.down('paymentQueueAdvFilterGridView');
		if ((me.filterCodeValue === null) || (Ext.isEmpty(filterCodeVal)))  {
			var filterCode = objCreateNewFilterPanel
					.down('textfield[itemId="filterCode"]');
			var filterCodeVal = filterCode.getValue();
			me.filterCodeValue = filterCodeVal;
		} else {
			var filterCodeVal = me.filterCodeValue;
		}
		var errorlabel = objCreateNewFilterPanel
		.down('label[itemId="errorLabel"]');
        var isHiddenError=errorlabel.isHidden();
		var callBack = this.postDoSaveAndSearch;
		if (Ext.isEmpty(filterCodeVal)) {
			errorlabel.setText(getLabel('filternameMsg',
					'Please Enter Filter Name'));
			errorlabel.show();
		} else {
			if(!isHiddenError)
			 {
			  errorlabel.hide();
			 }
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
		var strUrl = 'userfilters/bankProcessingQueue{0}/{1}.srvc?';		
		var queueType = (me.processingQueueTypeCode != 'CW') ? me.processingQueueTypeCode : 'A'; 
		strUrl = Ext.String.format(strUrl, queueType, filterCodeVal);
		var objJson;
		var objCreateNewFilterPanel = me.getAdvanceFilterPopup()
				.down('paymentQueueCreateNewAdvFilter');
		objJson = objCreateNewFilterPanel.getAdvancedFilterValueJson(
				filterCodeVal, objCreateNewFilterPanel);
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
					title = getLabel('investCenterFilterPopupTitle', 'Message');
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
									'lblerror',
									'Error'),
							msg : getLabel('lblerrordata',
									'Error while fetching data..!'),
							buttons : Ext.MessageBox.OK,
							icon : Ext.MessageBox.ERROR
						});
			}
		});
	},
	reloadGridRawData : function() {
		var me = this;
		var createAdvFilterView=me.getPaymentQueueCreateNewAdvFilter();
		var data=arrBatchStatusData[me.processingQueueTypeCode];
		if(createAdvFilterView)
			createAdvFilterView.reloadBatchStatus(data);
		var gridView = me.getAdvFilterGridView();
		var filterView = me.getPaymentQueueFilterView();
		var queueType = (me.processingQueueTypeCode != 'CW') ? me.processingQueueTypeCode : 'A'; 
		var strUrl = Ext.String.format(me.strReadAllAdvancedFilterCodeUrl, queueType);
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
				if(gridView)
					gridView.loadRawData(arrJson);
				if (filterView)
					filterView
							.addAllSavedFilterCodeToView(decodedJson.d.filters);
			},
			failure : function(response) {
				// console.log("Ajax Get data Call Failed");
			}

		});
	},
	getAllSavedAdvFilterCode : function(panel) {
		var me = this;
		var filterView = me.getPaymentQueueFilterView();
		var queueType = (me.processingQueueTypeCode != 'CW') ? me.processingQueueTypeCode : 'A'; 
		var strUrl = Ext.String.format(me.strReadAllAdvancedFilterCodeUrl, queueType);
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
		var strUrl = 'userfilters/bankProcessingQueue{0}/{1}/remove.srvc';
		var queueType = (me.processingQueueTypeCode != 'CW') ? me.processingQueueTypeCode : 'A'; 
		strUrl = Ext.String.format(strUrl, queueType, filterName);
		Ext.Ajax.request({
					url : strUrl + '?&' + csrfTokenName + "=" + csrfTokenValue,
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
		var filterView = me.getPaymentQueueFilterView();
		var queueType = (me.processingQueueTypeCode != 'CW') ? me.processingQueueTypeCode : 'A'; 
		var strUrl = Ext.String.format(me.strReadAllAdvancedFilterCodeUrl, queueType);
		Ext.Ajax.request({
					url :  strUrl,
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
			me.closeFilterPopup();
		}
		var store = grid.getStore();
		me.deleteFilterCodeFromDb(store, objFilterName);
	},
	viewFilterData : function(grid, rowIndex) {
		var me = this;
		var objCreateNewFilterPanel = me.getAdvanceFilterPopup()
				.down('paymentQueueCreateNewAdvFilter');
		var filterDetailsTab = me.getFilterDetailsTab();
		filterDetailsTab.setTitle(getLabel('filterDetails', 'Filter Details'));
		objCreateNewFilterPanel.resetAllFields(objCreateNewFilterPanel);
		objCreateNewFilterPanel.enableDisableFields(objCreateNewFilterPanel,
				true);
		var record = grid.getStore().getAt(rowIndex);
		var filterCode = record.data.filterName;
		var objTabPanel = me.getAdvanceFilterPopup().down('tabpanel');
		var applyAdvFilter = false;
		var filterView = me.getPaymentQueueFilterView();
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
		var queueType = (me.processingQueueTypeCode != 'CW') ? me.processingQueueTypeCode : 'A'; 
		var strUrl = Ext.String.format(me.strGetSavedFilterUrl, queueType, filterCode);
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
									title : getLabel('lblerror', 'Error'),
									msg : getLabel('lblerrordata',
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
				.down('paymentQueueCreateNewAdvFilter');
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
		objCreateNewFilterPanel.hideShowFields(objCreateNewFilterPanel,objCreateNewFilterPanel.queueType);

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
				.down('paymentQueueCreateNewAdvFilter');
		objCreateNewFilterPanel.resetAllFields(objCreateNewFilterPanel);
		objCreateNewFilterPanel.hideShowFields(objCreateNewFilterPanel,me.processingQueueTypeCode);
		objCreateNewFilterPanel.down('textfield[itemId="filterCode"]').setValue(filterCode);
		objCreateNewFilterPanel.down('textfield[itemId="filterCode"]').setDisabled(true);
		var fieldName;
		var fieldOper;
		var fieldVal;
		var fieldType;
		var fieldVal2;
		var fieldObj;
		for (i = 0; i < filterData.filterBy.length; i++) {
			fieldName = filterData.filterBy[i].field;

			fieldOper = filterData.filterBy[i].operator;

			fieldVal = filterData.filterBy[i].value1;

			fieldVal2 = filterData.filterBy[i].value2;

			if (fieldName === 'fileName' || fieldName === 'reference'
					|| fieldName === 'batchAmount' || fieldName === 'pirNmbr'
					|| fieldName === 'totalTxns' || fieldName === 'instAmount'
					|| fieldName === 'receiverName' || fieldName === 'dealref')
				fieldType = 'textfield';
			else if (fieldName === 'crossCurrency')
				fieldType = 'radiogroup';
			else if (fieldName === 'paymentPkgName'
					|| fieldName === 'clientName' || fieldName === 'makerId'
					|| fieldName === 'productCode'
					|| fieldName === 'debitAccount' || fieldName === 'branchCode')
				fieldType = 'AutoCompleter';
			else if (fieldName === 'creationDate'
					|| fieldName === 'processDate'
					|| fieldName === 'effectiveDate')
				fieldType = 'datefield';
			else
				fieldType = 'combobox';
			if(fieldType == 'radiogroup' && fieldName === 'crossCurrency')
			{
				objCreateNewFilterPanel.down( 'radiogroup[itemId="currencyRadioGroup"]' ).setValue(
						{
							crossCurrency : fieldVal
						} );
			}
			else if (fieldType != 'datefield') {
				fieldObj = objCreateNewFilterPanel.down('' + fieldType
						+ '[itemId="' + fieldName + 'FilterItemId"]');
				fieldObj.setValue(fieldVal);

				if(fieldName === 'batchAmount' || fieldName === 'totalTxns' || fieldName === 'instAmount')
				{
					fieldObj = objCreateNewFilterPanel.down('' + fieldType
							+ '[itemId="' + fieldName + 'OptFilterItemId"]');
					fieldObj.setValue(fieldOper);
				}
			} else {
				for (j = 0; j < 2; j++) {
					if (j === 0) {
						fieldObj = objCreateNewFilterPanel.down(''
								+ fieldType + '[itemId="' + fieldName
								+ 'FrmFilterItemId"]');
						fieldObj.setValue(fieldVal);
					} else {
						fieldObj = objCreateNewFilterPanel.down(''
								+ fieldType + '[itemId="' + fieldName
								+ 'ToFilterItemId"]');
						fieldObj.setValue(fieldVal2);
					}
				}
				if(fieldName === 'creationDate')
				{
					me.dateFilterVal = filterData.filterBy[i].dateIndex;
					me.dateFilterLabel = filterData.filterBy[i].dropdownLabel;
					if(Ext.isEmpty(me.dateFilterVal))
					{
						me.dateFilterVal='7';
						me.dateFilterLabel=getLabel('daterange', 'Date Range');
					}
					if (me.dateFilterVal == '7') {
							me.getDateRangeComponent().show();
							me.getFromDateLabel().hide();
							me.getToDateLabel().hide();	
						} else {
							me.getDateRangeComponent().hide();
							me.getFromDateLabel().show();
							me.getToDateLabel().show();
						}

						if (!Ext.isEmpty(me.dateFilterLabel)) {
							me.getDateLabel().setText(getLabel('creationDate', 'Creation Date') + " ("
									+ me.dateFilterLabel + ")");
						}
						if (me.dateFilterVal !== '7') { 
							 vFromDate = Ext.util.Format.date(Ext.Date.parse(fieldVal, 'Y-m-d'),
									strExtApplicationDateFormat);
							 vToDate = Ext.util.Format.date(Ext.Date.parse(fieldVal2, 'Y-m-d'),
									strExtApplicationDateFormat);
							if (me.dateFilterVal === '1' || me.dateFilterVal === '2') {
									me.getFromDateLabel().setText(vFromDate);

								me.getToDateLabel().setText("");
							} else {
								me.getFromDateLabel().setText(vFromDate + " - ");
								me.getToDateLabel().setText(vToDate);
							}
						}
				}
			}
		}
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
			var filterView = me.getPaymentQueueFilterView();
			if (filterView)
				filterView.highlightSavedFilter(filterCode);
			if (!Ext.isEmpty(objToolbar)) {
				var tbarItems = objToolbar.items.items;
				if (tbarItems.length >= 1) {
					for (var index = 0; index < 5; index++) {
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
		me.toggleClearAdvFilterAction(true);
		if (Ext.isEmpty(me.advanceFilterPopup)) {
			me.createAdvanceFilterPopup();
		}
		var objCreateNewFilterPanel = me.getAdvanceFilterPopup()
				.down('paymentQueueCreateNewAdvFilter');
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
		var filterView = me.getPaymentQueueFilterView();		
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
		me.reloadGridRawData();
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
	
		// ** Preference Handling Save/Clear ** 
	
	handleClearPreferences : function() {
		var me = this;
		me.toggleSavePrefrenceAction(false);
		var arrPref = me.getPreferencesToSave(false);
		//me.preferenceHandler.clearModulePreferences(me.strPageName, me.processingQueueTypeCode, null,
		//		me.postHandleClearPreferences, null, me, true);
		var objGroupView =  me.getPaymentQueueGroupView();		
		var subGroupInfo = objGroupView.getSubGroupInfo() || {};
		var strModule = subGroupInfo.groupCode;
		var strUrl = Ext.String.format(me.strCommonPrefUrl, me.processingQueueTypeCode);		
		
		if (arrPref) {
			Ext.Ajax.request({
				url : strUrl + "?$clear=true",
				method : 'POST',
				jsonData : Ext.encode(arrPref),
				success : function(response) {
					var responseData = Ext.decode(response.responseText);
					var isSuccess;
					var title, strMsg, imgIcon;
					if (responseData.d.preferences
							&& responseData.d.preferences.success)
						isSuccess = responseData.d.preferences.success;
					if (isSuccess && isSuccess === 'N') {
						title = getLabel('SaveFilterPopupTitle', 'Message');
						strMsg = responseData.d.preferences.error.errorMessage;
						imgIcon = Ext.MessageBox.ERROR;
						Ext.MessageBox.show({
									title : title,
									msg : strMsg,
									width : 200,
									buttons : Ext.MessageBox.OK,
									cls : 't7-popup',
									icon : imgIcon
								});

					} else {
						// me.toggleSavePrefrenceAction(true);
						Ext.MessageBox.show({
									title : title,
									msg : getLabel('prefClearedMsg',
											'Preferences Cleared Successfully'),
									buttons : Ext.MessageBox.OK,
									cls : 't7-popup',
									icon : Ext.MessageBox.INFO,
									fn : function(buttonId) {
										if (buttonId === "ok") {
											window.location.reload();
										}
									}
								});
					}

				},
				failure : function() {
					var errMsg = "";
					Ext.MessageBox.show({
								title : getLabel('instrumentErrorPopUpTitle',
										'Error'),
								msg : getLabel('instrumentErrorPopUpMsg',
										'Error while fetching data..!'),
								buttons : Ext.MessageBox.OK,
								cls : 't7-popup',
								icon : Ext.MessageBox.ERROR
							});
				}
			});
		}		
	},
	handleSavePreferences : function() {
		var me = this;
		//var arrPref = me.getPreferencesToSave(false);
		/*if (arrPref) {
			me.preferenceHandler.saveModulePreferences(me.strPageName, me.processingQueueTypeCode, arrPref,
					me.postHandleSavePreferences, null, me, true);
		}*/
		var groupPref = me.getgroupPref();
		var strModule = subGroupInfo.groupCode;
		var strUrl = Ext.String.format(me.strCommonPrefUrl, me.processingQueueTypeCode);
		if (groupPref) {
			Ext.Ajax.request({
						url : strUrl,
						method : 'POST',
						jsonData : Ext.encode(groupPref),
						success : function(response) {
							var responseData = Ext
									.decode(response.responseText);
							var isSuccess;
							var title, strMsg, imgIcon;
							if (responseData.d.preferences
									&& responseData.d.preferences.success)
								isSuccess = responseData.d.preferences.success;
							if (isSuccess && isSuccess === 'N') {
								title = getLabel('SaveFilterPopupTitle',
										'Message');
								strMsg = responseData.d.preferences.error.errorMessage;
								imgIcon = Ext.MessageBox.ERROR;
								Ext.MessageBox.show({
											title : title,
											msg : strMsg,
											width : 200,
											buttons : Ext.MessageBox.OK,
											cls : 't7-popup',
											icon : imgIcon
										});

							} else {
								me.toggleClearPrefrenceAction(true);
								Ext.MessageBox.show({
											title : title,
											msg : getLabel('prefSavedMsg',
													'Preferences Saved Successfully'),
											buttons : Ext.MessageBox.OK,
											cls : 't7-popup',
											icon : Ext.MessageBox.INFO
										});
							//	me.disablePreferencesButton("savePrefMenuBtn",
							//			true);
							//	me.disablePreferencesButton("clearPrefMenuBtn",
							//			false);
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
										cls : 't7-popup',
										icon : Ext.MessageBox.ERROR
									});
						}
					});
		}
	},
	getgroupPref : function () {
		var me = this;
		var groupPref = [];
		var groupView = me.getPaymentQueueGroupView();
		if (groupView) {
			state = groupView.getGroupViewState();
			groupInfo = groupView.getGroupInfo() || '{}';
			subGroupInfo = groupView.getSubGroupInfo() || {};
			if (groupInfo.groupTypeCode && subGroupInfo.groupCode) {
					groupPref.push({
								"module" : "groupByPref",
								"jsonPreferences" : {
									groupCode : groupInfo.groupTypeCode,
									subGroupCode : subGroupInfo.groupCode
								}
							});
					groupPref.push({
								"module" : subGroupInfo.groupCode,
								"jsonPreferences" : {
									'gridCols' : state.grid.columns,
									'pgSize' : state.grid.pageSize,
									'gridSetting' : state.gridSetting,
									'sortState' : state.grid.sortState
								}
							});
			}
		}
		return groupPref;
	},
	getPreferencesToSave : function(localSave) {
		var me = this;
		var arrPref = [];
		var arrCols = [];
		var arrColPref = null;
		var filter = me.getPaymentQueueFilterView();
		var data = filter.getQuickFilterJSON(me.processingQueueTypeCode);
		var advFilterCode = me.filterCodeValue ? me.filterCodeValue : '';
		var paymentQueueGroupView = me.getPaymentQueueGroupView();
		var state = paymentQueueGroupView.getGroupViewState();
		var groupInfo = paymentQueueGroupView.getGroupInfo() || '{}';
		var subGroupInfo = paymentQueueGroupView.getSubGroupInfo() || {};
		arrCols = state.grid.columns;
		arrColPref = new Array();
		for (var j = 0; j < arrCols.length; j++) {
			objCol = arrCols[j];
			if (!Ext.isEmpty(objCol) && !Ext.isEmpty(objCol.itemId)
					&& objCol.itemId.startsWith('col_')
					&& !Ext.isEmpty(objCol.xtype)
					&& objCol.colType != 'actioncontent' && !Ext.isEmpty(objCol.dataIndex))
				arrColPref.push({
							colId : objCol.dataIndex,
							colHeader : objCol.text,
							hidden : objCol.hidden,
							colType : objCol.colType,
							width : objCol.width
						});
		}
		/*
		 * arrPref.push({ "module" : me.processingQueueTypeCode,
		 * "jsonPreferences" : { 'gridCols' : state.grid.columns, 'pgSize' :
		 * state.grid.pageSize, 'gridSetting' : state.gridSetting, 'sortState' :
		 * state.grid.sortState, 'advFilterCode' : advFilterCode, 'quickFilter' :
		 * data } });
		 */
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
						'gridCols' : state.grid.columns,
						'pgSize' : state.grid.pageSize,
						'gridSetting' : state.gridSetting,
						'sortState' : state.grid.sortState,
						'advFilterCode' : advFilterCode,
						'quickFilter' : data
					}
				});
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
	postHandleClearPreferences : function(data, args, isSuccess) {
		var me = this;
		if (isSuccess === 'Y') {
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
	toggleClearPrefrenceAction : function(isVisible) {
		var me = this;
		var btnPref = me.getBtnClearPreferences();
		if (!Ext.isEmpty(btnPref))
			btnPref.setDisabled(!isVisible);
	},
	toggleClearAdvFilterAction : function(isVisible) {
		var me = this;
		var btnClear = me.getBtnClearAdvFilter();
		if (!Ext.isEmpty(btnClear))
			btnClear.setDisabled(!isVisible);
	},
	
	handleDateChange : function(index) {
		var me = this;		
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
			me.getDateLabel().setText(getLabel('creationDate', 'Creation Date') + " ("
					+ me.dateFilterLabel + ")");
		}
		//if (index !== '7') { 
			 vFromDate = Ext.util.Format.date(Ext.Date.parse(
							objDateParams.fieldValue1, 'Y-m-d'),
					strExtApplicationDateFormat);
			 vToDate = Ext.util.Format.date(Ext.Date.parse(
							objDateParams.fieldValue2, 'Y-m-d'),
					strExtApplicationDateFormat);
			if (index === '1' || index === '2') {// || index === '12'
				//if (index === '12') {
					// Do nothing for latest
					//fromDateLabel.setText('' + '  ' + vFromDate);
				//} else
					fromDateLabel.setText(vFromDate);

				toDateLabel.setText("");
			} else {
				fromDateLabel.setText(vFromDate + " - ");
				toDateLabel.setText(vToDate);
				me.vFromDate1 = vFromDate;
				me.vToDate1 = vToDate;
			}
		//}
		selectedEntryDate = {				
				dateLabel : me.dateFilterLabel,
				dateIndex : me.dateFilterVal
			};
	},
	getDateParam : function(index, dateType) {
		var me = this;
		var objDateHandler = !Ext.isEmpty(me.dateHandler)? me.dateHandler : me.getDateHandler();		
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
				label = 'Today';
				break;
			case '2' :
				// Yesterday
				fieldValue1 = Ext.Date.format(objDateHandler
								.getYesterdayDate(date), strSqlDateFormat);
				fieldValue2 = fieldValue1;
				operator = 'eq';
				label = 'Yesterday';
				break;
			case '3' :
				// This Week
				dtJson = objDateHandler.getThisWeekToDate(date);
				fieldValue1 = Ext.Date
						.format(dtJson.fromDate, strSqlDateFormat);
				fieldValue2 = Ext.Date.format(dtJson.toDate, strSqlDateFormat);
				operator = 'bt';
				label = 'This Week';
				break;
			case '4' :
				// Last Week To Date
				dtJson = objDateHandler.getLastWeekToDate(date);
				fieldValue1 = Ext.Date
						.format(dtJson.fromDate, strSqlDateFormat);
				fieldValue2 = Ext.Date.format(dtJson.toDate, strSqlDateFormat);
				operator = 'bt';
				label = 'Last Week To Date';
				break;
			case '5' :
				// This Month
				dtJson = objDateHandler.getThisMonthToDate(date);
				fieldValue1 = Ext.Date
						.format(dtJson.fromDate, strSqlDateFormat);
				fieldValue2 = Ext.Date.format(dtJson.toDate, strSqlDateFormat);
				operator = 'bt';
				label = 'This Month';
				break;
			case '6' :
				// Last Month To Date
				dtJson = objDateHandler.getLastMonthToDate(date);
				fieldValue1 = Ext.Date
						.format(dtJson.fromDate, strSqlDateFormat);
				fieldValue2 = Ext.Date.format(dtJson.toDate, strSqlDateFormat);
				operator = 'bt';
				label = 'Last Month To Date';
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
				label = 'This Quarter';
				break;
			case '9' :
				// Last Quarter To Date
				dtJson = objDateHandler.getLastQuarterToDate(date);
				fieldValue1 = Ext.Date
						.format(dtJson.fromDate, strSqlDateFormat);
				fieldValue2 = Ext.Date.format(dtJson.toDate, strSqlDateFormat);
				operator = 'bt';
				label = 'Last Quarter To Date';
				break;
			case '10' :
				// This Year
				dtJson = objDateHandler.getYearToDate(date);
				fieldValue1 = Ext.Date
						.format(dtJson.fromDate, strSqlDateFormat);
				fieldValue2 = Ext.Date.format(dtJson.toDate, strSqlDateFormat);
				operator = 'bt';
				label = 'This Year';
				break;
			case '11' :
				// Last Year To Date
				dtJson = objDateHandler.getLastYearToDate(date);
				fieldValue1 = Ext.Date
						.format(dtJson.fromDate, strSqlDateFormat);
				fieldValue2 = Ext.Date.format(dtJson.toDate, strSqlDateFormat);
				operator = 'bt';
				label = 'Last Year To Date';
				break;
			case '12' :
				// Latest
				var fromDate = new Date(Ext.Date.parse(latestFromDate, dtFormat));
				var toDate = new Date(Ext.Date.parse(latestToDate, dtFormat));
				fieldValue1 = Ext.Date.format(fromDate,strSqlDateFormat);
				fieldValue2 = Ext.Date.format(toDate,strSqlDateFormat);
				operator = 'bt';
				label = 'Latest';
				break;
		}
		// comparing with client filter condition
		if (Ext.Date.parse(fieldValue1, strSqlDateFormat) < clientFromDate) {
			fieldValue1 = Ext.Date.format(clientFromDate, strSqlDateFormat);
		}
		retObj.fieldValue1 = fieldValue1;
		retObj.fieldValue2 = fieldValue2;
		retObj.operator = operator;
		retObj.label = label;
		return retObj;
	},
	resetQuickFilter : function() {
        var me = this;
        me.getFilterUpperPanel().down('combobox[itemId=\'paymentQueueSellerId\']').setValue(strSeller);
        me.getFilterUpperPanel().down('combobox[itemId=\'bankProcessingQueueClientId\']').setValue('');
    }
	// *****End*********
	
		/*----------Filter functions ends............*/
});