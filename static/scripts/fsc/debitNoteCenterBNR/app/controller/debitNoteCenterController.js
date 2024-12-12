/**
 * @class GCP.controller.debitNoteCenterController
 * @extends Ext.app.Controller
 * @author Vivek Bhurke
 */

Ext.define('GCP.controller.debitNoteCenterController', {
	extend : 'Ext.app.Controller',
	requires : ['Ext.ux.gcp.PageSettingPopUp'],
	views : ['GCP.view.debitNoteCenterFilterView',
	         'GCP.view.debitNoteCenterView','GCP.view.HistoryPopup'],
	refs : [{
		ref : 'groupView',
		selector : 'debitNoteCenterView groupView'
	}, {
		ref : 'grid',
		selector : 'debitNoteCenterView groupView smartgrid'
	}, {
		ref : 'filterView',
		selector : 'debitNoteCenterView groupView filterView'
	}, {
		ref : 'debitNoteCenterView',
		selector : 'debitNoteCenterView'
	},{
		ref : 'debitNoteCenterFilterView',
		selector : 'debitNoteCenterFilterView'
	},{
	    ref:'DateMenu',
	    selector : '#DateMenu'
	},{
		ref : 'entryDateLabel',
		selector : 'debitNoteCenterFilterView label[itemId="entryDateLabel"]'
	}],
	config : {
		strPageName:'debitNoteCenter',
		strReadAllAdvancedFilterCodeUrl : 'services/userfilterslist/groupViewFilter.json',
		strGetSavedFilterUrl : 'services/userfilters/debitNoteGroupViewFilter{0}/{1}.json',
		strModifySavedFilterUrl : 'services/userfilters/debitNoteGroupViewFilter{0}/{1}.json',
		strRemoveSavedFilterUrl : 'services/userfilters/debitNoteGroupViewFilter{0}/{1}/remove.json',
		historyUrl : 'services/debitNote/history.json',
		pageSettingPopup : null,
		preferenceHandler : null,
		strDefaultMask : '000000000000000000',
		clientFilterVal : 'all',
		entryDateFilterVal : '',
		entryDateFilterLabel : '',
		dateHandler : null,
		datePickerSelectedDate : [],
		datePickerSelectedEntryAdvDate : [],
		datePickerSelectedEntryDate : [],
		dateFilterVal : '',
		filterData : [],
		advFilterData : [],
		statusFilterVal : 'all',
		statusFilterDesc : 'All',
		reportGridOrder : null,
		strLocalStorageKey : 'deposite_center_local_preferences',
		strBatchActionUrl : 'services/debitNote/{0}.json',
		objLocalData : null,
		firstLoad : false,
		entryDateChanged : false,
		localSortState : []
	},
	init : function() {
		var me = this;

		if(selectedFilterLoggerDesc == 'BUYER')
		{
			objSaveLocalStoragePref = objSaveLocalStoragePrefBuyer;
		}else if(selectedFilterLoggerDesc == 'SELLER'){
			objSaveLocalStoragePref = objSaveLocalStoragePrefSeller;
		}
		if(objSaveLocalStoragePref){
			me.objLocalData = Ext.decode(objSaveLocalStoragePref);
			var filterType = me.objLocalData && me.objLocalData.d.preferences
								&& me.objLocalData.d.preferences.tempPref 
								&& me.objLocalData.d.preferences.tempPref.filterAppliedType ? me.objLocalData.d.preferences.tempPref.filterAppliedType : {};
			
			me.filterApplied = (!Ext.isEmpty(filterType)) ? filterType : 'ALL';
			
		}
		
		me.updateConfig();
		
		$(document).on('performReportAction', function(event, actionName) {
			me.downloadReport(actionName);
		});
		
		$(document).on('performPageSettings', function(event) {
			me.showPageSettingPopup('PAGE');
		});
		
		$(document).on('wheelScroll', function(event) {
			me.handlWheelScroll();
		});
		
		$(document).on('handleSavedFilterClick', function(event) {
			me.handleSavedFilterClick();
		});
		
		$(document).on('searchActionClicked', function() {
			me.searchActionClicked(me);
		});
		
		$(document).on('saveAndSearchActionClicked', function() {
			me.saveAndSearchActionClicked(me);
		});
		
		$(document).on('resetAllFieldsEvent', function() {
			me.resetAllFields();
			me.filterCodeValue = null;
		});
		
		$(document).on('deleteFilterEvent', function(event, filterCode) {
			me.deleteFilterSet(filterCode);
		});
		
		$(document).on('filterDateChange', function(event, filterType, btn, opts) {
			if (filterType == "entryDate") {
				me.entryDateChange(btn, opts);
			} else if (filterType == "entryDateQuickFilter"){
				me.handleEntryDateChange(filterType, btn, opts);
			}
		});
		
		$(document).on("datePickPopupSelectedDate", function(event, filterType, dates) {
			if (filterType == "entryDate") {
				me.dateRangeFilterVal = '13';
				me.datePickerSelectedEntryAdvDate = dates;
				me.entryDateFilterVal = me.dateRangeFilterVal;
				me.entryDateFilterLabel = getLabel('daterange',
						'Date Range');
				me.handleEntryDateInAdvFilterChange(me.dateRangeFilterVal);
				updateToolTip('entryDate', " ("+me.entryDateFilterLabel+")");
			}
		});
		
		$(document).on('handleLoggerChangeInQuickFilter', function() {
			me.handleLoggerChangeInQuickFilter(selectedFilterLoggerDesc);
		});
		
		me.control({
			'debitNoteCenterView groupView' : {
				'groupByChange' : function(menu, groupInfo) {
//					me.doHandleStateChange();
					me.doHandleGroupByChange(menu, groupInfo);
				},
				'groupTabChange' : function(groupInfo, subGroupInfo, tabPanel,
						newCard, oldCard) {
					me.doHandleGroupTabChange(groupInfo, subGroupInfo,
							tabPanel, newCard, oldCard);
				},
				'gridRender' : me.doHandleLoadGridData,
				'gridPageChange' : me.doHandleLoadGridData,
				'gridSortChange' : me.doHandleLoadGridData,
				'gridPageSizeChange' : me.doHandleLoadGridData,
				'gridColumnFilterChange' : me.doHandleLoadGridData,
				'gridRowSelectionChange' : me.doHandleGridRowSelectionChange,
				'gridStateChange' : function(grid) {
				},
				'toggleGridPager' : function() {
				},
				'gridStoreLoad' : function(grid, store) {
					isGridLoaded = true;
					disableGridButtons(false);
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
				'render' : function() {
					me.firstTime = true;
					me.applyPreferences();
//					populateAdvancedFilterFieldValue();
//					if(selectedFilterLoggerDesc == 'BUYER'){
//						objDebitNoteCenterPref = objDNCBuyerSummaryPref;
//						if (objDebitNoteCenterPref) {
//							var objJsonData = Ext.decode(objDebitNoteCenterPref);
//							if (!Ext.isEmpty(objJsonData.d.preferences)) {
//								if (!Ext.isEmpty(objJsonData.d.preferences.GeneralSetting)) {
//									if (!Ext.isEmpty(objJsonData.d.preferences.GeneralSetting.defaultFilterCode)
//											|| (objLocalStoragePref && !Ext.isEmpty(objLocalStoragePref.filterCode))) {
//										//var advData = objJsonData.d.preferences.GeneralSetting.defaultFilterCode;
//										var advData = objLocalStoragePref && !Ext.isEmpty(objLocalStoragePref.filterCode)
//											? objLocalStoragePref.filterCode
//											: objJsonData.d.preferences.GeneralSetting.defaultFilterCode;
//										me.doHandleSavedFilterItemClick(advData);
//										me.savedFilterVal = advData;
//									} else if(objLocalStoragePref && !Ext.isEmpty(objLocalStoragePref.filterCode)){
//										me.doHandleSavedFilterItemClick(objLocalStoragePref.filterCode);
//										me.savedFilterVal = objLocalStoragePref.filterCode;
//									}
//								}
//								else
//									me.savedFilterVal = "";
//							}
//						}
//					}
//					else if(selectedFilterLoggerDesc == 'SELLER')
//					{
//						objDebitNoteCenterPref = objDNCSellerSummaryPref;
//						if (objDebitNoteCenterPref) {
//							var objJsonData = Ext.decode(objDebitNoteCenterPref);
//							if (!Ext.isEmpty(objJsonData.d.preferences)) {
//								if (!Ext.isEmpty(objJsonData.d.preferences.GeneralSetting)) {
//									if (!Ext.isEmpty(objJsonData.d.preferences.GeneralSetting.defaultFilterCode)
//											|| (objLocalStoragePref && !Ext.isEmpty(objLocalStoragePref.filterCode))) {
//										//var advData = objJsonData.d.preferences.GeneralSetting.defaultFilterCode;
//										var advData = objLocalStoragePref && !Ext.isEmpty(objLocalStoragePref.filterCode)
//											? objLocalStoragePref.filterCode
//											: objJsonData.d.preferences.GeneralSetting.defaultFilterCode;
//										me.doHandleSavedFilterItemClick(advData);
//										me.savedFilterVal = advData;
//									}else if(objLocalStoragePref && !Ext.isEmpty(objLocalStoragePref.filterCode)){
//										me.doHandleSavedFilterItemClick(objLocalStoragePref.filterCode);
//										me.savedFilterVal = objLocalStoragePref.filterCode;
//									}
//								}
//								else
//										me.savedFilterVal = "";
//							}
//						}
//					}
				},
				'gridSettingClick' : function() {
					me.showPageSettingPopup('GRID');
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
			
			'filterView' : {
				appliedFilterDelete : function(btn) {
					me.handleAppliedFilterDelete(btn);
				},
				afterrender : function() {
					me.handleClientChangeInQuickFilter();
				}
			},
			
			'filterView label[itemId="createAdvanceFilterLabel"]' : {
				'click' : function() {
					showAdvanceFilterPopup();
					me.assignSavedFilter();
				}
			},
			'filterView button[itemId="clearSettingsButton"]' : {
				'click' : function() {
					me.handleClearSettings();
				}
			},
			'debitNoteCenterFilterView  combo[itemId="quickFilterClientCombo"]' : {
				'afterrender' : function(combo, newValue, oldValue, eOpts) {
					if (!Ext.isEmpty(me.clientFilterVal)) {
						combo.setValue(me.clientFilterVal);
					}
				}
			},
			'debitNoteCenterFilterView  combo[itemId="clientCombo"]' : {
				'boxready' : function(combo, width, height, eOpts) {
					if (!Ext.isEmpty(me.clientFilterVal)) {
						combo.setValue(me.clientFilterVal);
					} else {
						combo.setValue(combo.getStore().getAt(0));
					}
				},
				'afterrender' : function(combo, newValue, oldValue, eOpts) {
					if (!Ext.isEmpty(selectedFilterClient)
							&& !Ext.isEmpty(selectedFilterClientDesc)) {
						combo.setValue(selectedFilterClient);
						me.clientFilterVal = selectedFilterClient;
						me.clientFilterDesc = selectedFilterClientDesc;
					} else {
						combo.setValue(combo.getStore().getAt(0));
						if(!combo.up('container').hidden){
							selectedFilterClient = 'all';
						}
					}
				}
			},
			'debitNoteCenterFilterView  AutoCompleter[itemId="clientAuto"]' : {
				'afterrender' : function(combo, newValue, oldValue, eOpts) {
					if (!Ext.isEmpty(selectedFilterClient)
							&& !Ext.isEmpty(selectedFilterClientDesc)) {
						combo.setValue(selectedFilterClient);
						combo.setRawValue(selectedFilterClientDesc);
						me.clientFilterVal = selectedFilterClient;
						me.clientFilterDesc = selectedFilterClientDesc;
					}
				}
			},
			'debitNoteCenterFilterView' : {
				handleSavedFilterItemClick : function(comboValue, comboDesc) {
					me.savedFilterVal = comboValue;
//					me.doHandleStateChange();
					me.doHandleSavedFilterItemClick(comboValue, comboDesc);
				}
			},
			'debitNoteCenterFilterView combo[itemId="savedFiltersCombo"]' : {
				'afterrender' : function(combo, newValue, oldValue, eOpts) {
					if (!Ext.isEmpty(me.savedFilterVal)) {
						combo.setValue(me.savedFilterVal);
					}
				}
			},	
			'debitNoteCenterFilterView combo[itemId="statusCombo"]' : {
				'select' : function(combo, selectedRecords) {
					combo.isQuickStatusFieldChange = true;
				},
				'blur' : function(combo, record) {
					if (combo.isQuickStatusFieldChange)
						me.handleStatusClick(combo);
				},
				'boxready' : function(combo, width, height, eOpts) {
					if (!Ext.isEmpty(me.statusFilterVal)
							&& 'all' != me.statusFilterVal)
						me.handleStatusFieldSync('A', me.statusFilterVal,
								me.statusFilterDesc);
				}
			},
			'debitNoteCenterFilterView component[itemId="paymentEntryDataPicker"]' : {
				render : function() {
					$('#entryDataPicker').datepick({
						monthsToShow : 1,
						changeMonth : true,
						//minDate : dtHistoryDate,
						changeYear : true,
						dateFormat : strApplicationDateFormat,
						rangeSeparator : ' to ',
						onClose : function(dates) {
							if (!Ext.isEmpty(dates)) {
								me.dateRangeFilterVal = '13';
								me.datePickerSelectedDate = dates;
								me.datePickerSelectedEntryDate = dates;
								me.dateFilterVal = me.dateRangeFilterVal;
								me.dateFilterLabel = getLabel('daterange',
										'Date Range');
								me.handleDateChange(me.dateRangeFilterVal);
								me.setDataForFilter();
								//me.applyQuickFilter();
								me.refreshData();
							}
						}
					});
					if (!Ext.isEmpty(me.savedFilterVal) || me.entryDateChanged === true) {
						if (!Ext.isEmpty(me.dateFilterLabel)) {
							me.getEntryDateLabel().setText(getLabel('date', 'Entry Date')
									+ " (" + me.dateFilterLabel + ")");
						}
						var entryDateField = $("#entryDateFrom");
						me.handleEntryDateSync('A', me.getEntryDateLabel().text, "(" + me.dateFilterLabel + ")",
								entryDateField);
					} else if (!Ext.isEmpty(me.dateFilterVal)
							&& !Ext.isEmpty(me.dateFilterLabel)) {
						me.handleDateChange(me.dateFilterVal);
					} /*else{
						// DHGCPNG44-4696 Payment->Payment Center->PDF. The filter Latest behaves differently from the way it works in Accounts.
						me.dateFilterVal = '1'; // Set to Today
						me.dateFilterLabel = getLabel('today', 'Today');
						me.handleDateChange(me.dateFilterVal);
						me.setDataForFilter();
						//me.applyQuickFilter();
						me.refreshData();
					}*/

				}
			}
			
		});
		$(document).on('handleClientChangeInQuickFilter', function(event) {
			me.handleClientChangeInQuickFilter();
		});
	},
	
	submitForm : function(strUrl, record, rowIndex) {
		var me = this;
		var viewState = record.data.identifier;
		var updateIndex = rowIndex;
		var form, inputField;
		form = document.createElement('FORM');
		form.name = 'frmMain';
		form.id = 'frmMain';
		form.method = 'POST';
		form.appendChild(me.createFormField('INPUT', 'HIDDEN',
				csrfTokenName, tokenValue));
		form.appendChild(me.createFormField('INPUT', 'HIDDEN',
				'txtRecordIndex', rowIndex));
		form.appendChild(me.createFormField('INPUT', 'HIDDEN', 'viewState',
				viewState));
		form.appendChild(me.createFormField('INPUT', 'HIDDEN', 'redirectFromGrid',
				'Y'));
		form.action = strUrl;
		//me.setFilterParameters(form);

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
	
	doHandleGridRowSelectionChange : function(groupInfo, subGroupInfo,
			objGrid, objRecord, intRecordIndex, arrSelectedRecords,
			jsonData) {
		var me = this;
		var objGroupView = me.getGroupView();
		var buttonMask = me.strDefaultMask;
		var maskArray = new Array(), actionMask = '', objData = null;;

		if (!Ext.isEmpty(jsonData)
				&& !Ext.isEmpty(jsonData.d.__buttonMask))
			buttonMask = jsonData.d.__buttonMask;

		maskArray.push(buttonMask);
		var isSameUser = true;
		
		if(!Ext.isEmpty(arrSelectedRecords))
		{
			var clientCodeFromSelectedRecord
				= arrSelectedRecords[0].raw.clientCode;
			for (var index = 0; index < arrSelectedRecords.length; index++) {
				objData = arrSelectedRecords[index];
				if(clientCodeFromSelectedRecord !== objData.raw.clientCode){
					isSameUser = false;
					break;
				}
				maskArray.push(objData.get('__metadata').__rightsMap);
			}
		}
		actionMask = doAndOperation(maskArray, 10);
		me.enableDisableGroupActions(actionMask, isSameUser);
	},
	
	enableDisableGroupActions : function(actionMask, isSameUser) {
		var me=this;		
		var objGroupView = me.getGroupView();
		var actionBar = objGroupView.down('toolbar[itemId="groupActionToolBar"]');
		var blnEnabled = false, strBitMapKey = null, arrItems = new Array();
		if (!Ext.isEmpty(actionBar) && !Ext.isEmpty(actionBar.items.items)) {
			arrItems = actionBar.items.items;
			Ext.each(arrItems, function(item) {
						strBitMapKey = parseInt(item.maskPosition,10) - 1;
						if (!Ext.isEmpty(strBitMapKey)) {
							blnEnabled = isActionEnabled(actionMask,
									strBitMapKey);

							if ((item.maskPosition === 1 && blnEnabled)) {
								blnEnabled = blnEnabled && isSameUser;
							}
							item.setDisabled(!blnEnabled);
						}
					});
		}
	},
	
	handleAppliedFilterDelete : function(btn) {
		var me = this;
		var objData = btn.data;
		var objData = btn.data;
		var quickJsonData = me.filterData;
		var advJsonData = me.advFilterData;
		if (!Ext.isEmpty(objData)) {
			var paramName = objData.paramName || objData.field;
			var reqJsonInAdv = null;
			var arrAdvJson = null;
			// adv
			var reqJsonInAdv = me.findInAdvFilterData(advJsonData, paramName);
			if (!Ext.isEmpty(reqJsonInAdv)) {
				arrAdvJson = advJsonData;
				arrAdvJson = me.removeFromAdvanceArrJson(arrAdvJson, paramName);
				me.advFilterData = arrAdvJson;
			}
			// quick
			else {
				var reqJsonInQuick = me.findInQuickFilterData(quickJsonData,
						paramName);
				if (!Ext.isEmpty(reqJsonInQuick)) {
					arrQuickJson = quickJsonData;
					arrQuickJson = me.removeFromQuickArrJson(arrQuickJson,
							paramName);
					me.filterData = arrQuickJson;
				}
			}
			me.resetFieldOnDelete(objData);
			me.refreshData();
		}
	},
	
	resetFieldOnDelete : function(objData) {
		var me = this, strFieldName;
		
		if (!Ext.isEmpty(objData))
			strFieldName = objData.paramName || objData.field;
		
		if(strFieldName === 'UniqueId'){
			$("input[type='text'][id='txtUniqueID']").val("");
		} else if(strFieldName === 'Amount'){
			$("#amountOperator").val($("#amountOperator option:first").val());
			$("#amountFieldFrom").val("");
			$("#amountFieldTo").val("");
			$(".amountTo").addClass("hidden");
			$("#msAmountLabel").text(getLabel("amount","Amount"));
			$('#amountOperator').niceSelect('update');
		} else if(strFieldName === 'EntryDate'){
			$('#entryDateFrom').val("");
			selectedEntryDate = {};
			$('label[for="EntryDateLabel"]').text(getLabel('entryDate',
				'Entry Date'));
			updateToolTip('entryDate',null);
			
			var datePickerRef = $('#entryDataPicker');
			me.dateFilterVal = '';
			me.getEntryDateLabel().setText(getLabel('date', 'Entry Date'));
			datePickerRef.val('');
			me.datePickerSelectedEntryAdvDate = [];
		} else if (strFieldName === 'actionStatus'){
			var objField = me.getDebitNoteCenterFilterView().down('combo[itemId="statusCombo"]');
			if (!Ext.isEmpty(objField)) {
				objField.selectAllValues();
				me.statusFilterVal = 'all';
			}
			
			resetAllMenuItemsInMultiSelect("#msStatus");
		} else if(strFieldName === 'CreatedBy'){
			$("#createdByOperator").val($("#createdByOperator option:first").val());
			$('#createdByOperator').niceSelect('update');
		} else if(strFieldName === 'Package'){
			resetAllMenuItemsInMultiSelect("#msProducts");
		} else if(strFieldName === 'BuyerSeller'){
			resetAllMenuItemsInMultiSelect("#dropdownClientCode");
		} else if(strFieldName === 'Client'){
			if (isClientUser()) {
				var clientComboBox = me.getDebitNoteCenterFilterView()
						.down('combo[itemId="clientCombo"]');
				me.clientFilterVal = 'all';
				selectedFilterClientDesc = "";
				selectedFilterClient = "";
				selectedClientDesc = "";
				clientComboBox.setValue(me.clientFilterVal);
				saveScreenFilters();
			} else {
				var clientComboBox = me.getDebitNoteCenterFilterView()
						.down('combo[itemId="clientAuto]');
				clientComboBox.reset();
				me.clientFilterVal = '';
				selectedFilterClientDesc = "";
				selectedFilterClient = "";
				selectedClientDesc = "";
			}
		}
	},
	
	handleClientChangeInQuickFilter : function() {
		var me = this;
		me.clientCode = selectedFilterClient;
		me.clientDesc = selectedFilterClientDesc;
		me.clientFilterVal = 
			isEmpty(selectedFilterClient) ? 'all' : selectedFilterClient;
		me.clientFilterDesc = selectedClientDesc ? selectedClientDesc : selectedFilterClientDesc;
		quickFilterClientValSelected = me.clientCode;
		quickFilterClientDescSelected = me.clientDesc;
		me.setDataForFilter();
		me.refreshData();
		setProductsMenuItems("msProducts");
		setBuyerSellerMenuItems("dropdownClientCode");
	},
	
	refreshData : function() {
		var me = this;
		var objGroupView = me.getGroupView();
		var grid = objGroupView.getGrid();
		if(!Ext.isEmpty(grid))
			grid.removeAppliedSort();
		objGroupView.refreshData();
	},
	
	updateFilterInfo : function() {
		var me = this;
		var arrInfo = generateFilterArray(me.filterData);
		if(isClientUser()) {
			var clientCombo = me.getFilterView().down("combo[itemId='clientCombo']");
			if(clientCombo.getStore().getCount() <= 1) {
				var clientFilterIndex = -1;
				arrInfo.forEach(function(appliedFilterObj, appliedFilterObjIndex) {
					if(appliedFilterObj.fieldId == "invoicePayClientCode") clientFilterIndex = appliedFilterObjIndex;
				});
				if(clientFilterIndex !== -1) {
					arrInfo.splice(clientFilterIndex, 1);
				}
			}
		}
		me.getFilterView().updateFilterInfo(arrInfo);
	},
	
	getFilterUrl : function(subGroupInfo, groupInfo) {
		var me = this;
		var strQuickFilterUrl = '';
		var strGroupQuery = (subGroupInfo && subGroupInfo.groupQuery)
		? subGroupInfo.groupQuery
		: '';
		strQuickFilterUrl = me.generateUrlWithFilterParams();
		if (!Ext.isEmpty(strGroupQuery)) {
			if (!Ext.isEmpty(strQuickFilterUrl))
				strQuickFilterUrl += ' and ' + strGroupQuery;
			else
				strQuickFilterUrl += '&$filter=' + strGroupQuery;
		}
		return strQuickFilterUrl;
	},
	
	generateUrlWithFilterParams : function() {
		var me = this;
		var filterData = me.filterData;
		var strFilter = '&$filter=';
		var strTemp = '';
		var isFilterApplied = false;
		if(!Ext.isEmpty(filterData)) {
			for ( var index = 0; index < filterData.length; index++) {
				if( filterData[index].paramName != 'validity'){
				if (isFilterApplied) {
					strTemp = strTemp + ' and ';
				}
				strTemp = strTemp + filterData[index].paramName + ' ' + filterData[index].operatorValue + ' ' + '\'' + filterData[index].paramValue1 + '\'';
				isFilterApplied = true;
			}
			}
		}
		if (isFilterApplied)
			strFilter = strFilter + strTemp;
		else
			strFilter = '';
		return strFilter;
	},
	
	setDataForFilter : function(filterData) {
		var me = this;
		var arrQuickJson = {};
		me.advFilterData = {};
		me.filterData = {};
		me.filterData = me.getQuickFilterQueryJson();
		var objJson = (!Ext.isEmpty(filterData)
				? filterData.filterBy
				: getAdvancedFilterQueryJson());

		var reqJson = me.findInAdvFilterData(objJson, "actionStatus");
		if (!Ext.isEmpty(reqJson)) {
			arrQuickJson = me.filterData;
			arrQuickJson = me.removeFromQuickArrJson(arrQuickJson,
					"actionStatus");
			me.filterData = arrQuickJson;
		}
		reqJson = me.findInAdvFilterData(objJson, "EntryDate");
		if (!Ext.isEmpty(reqJson)) {
			arrQuickJson = me.filterData;
			arrQuickJson = me.removeFromQuickArrJson(arrQuickJson, "EntryDate");
			me.filterData = arrQuickJson;
		}
		
		me.advFilterData = objJson;
		var filterCode = $("input[type='text'][id='savedFilterAs']").val();
		if (!Ext.isEmpty(filterCode))
			me.advFilterCodeApplied = filterCode;
	},
	
	doHandleGroupTabChange : function(groupInfo, subGroupInfo, tabPanel, newCard, oldCard) {
		var me = this;
		var objGroupView = me.getGroupView();
		var strModule = '', strUrl = null, args = null, strFilterCode = null;
		groupInfo = groupInfo || {};
		subGroupInfo = subGroupInfo || {};
		// TODO : Need to refactor for non us market
		if (groupInfo && _charCaptureGridColumnSettingAt === 'L') {
			args = {
				scope : me
			};
			strModule = subGroupInfo.groupCode
			strModule = strModule === 'all' ? groupInfo.groupTypeCode + '-'
					+ strModule : strModule;
			me.preferenceHandler.readModulePreferences(Ext.String.format(me.strPageName+'{0}', selectedFilterLoggerDesc),
					strModule, me.postHandleDoHandleGroupTabChange, null, me,
					false);

		} else
			me.postHandleDoHandleGroupTabChange();
	},

	postHandleDoHandleGroupTabChange : function(data, args) {
		var me = args ? args.scope : this;
		me.handleReconfigureGrid(data);
	},
	
	handleReconfigureGrid : function(data) {
		var me = this;
		var objGroupView = me.getGroupView();
		var objSummaryView = me.getDebitNoteCenterView(), gridModel = null, objData = null;
		var colModel = null, arrCols = null;
		
		if(selectedFilterLoggerDesc == 'BUYER')
			objSaveLocalStoragePref = objSaveLocalStoragePrefBuyer;
		else if(selectedFilterLoggerDesc == 'SELLER')
			objSaveLocalStoragePref = objSaveLocalStoragePrefSeller;
		
		if(objSaveLocalStoragePref)
			me.objLocalData = Ext.decode(objSaveLocalStoragePref);
		
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
		
		if (data && data.preference)
			objData = Ext.JSON.decode(data.preference)
		if (_charCaptureGridColumnSettingAt === 'L' && objData
				&& objData.gridCols) {
			arrCols = objData.gridCols;
			colModel = objSummaryView.getColumnModel(arrCols);
			if (colModel) {
				gridModel = {
					columnModel : colModel,
					pageSize : intPageSize,
					pageNo : intPageNo
				}
			}
		}
		if(!Ext.isEmpty(intPageSize) && !Ext.isEmpty(intPageNo)) {
			gridModel = gridModel ? gridModel : {};
			gridModel.pageSize = intPageSize;
			gridModel.pageNo = intPageNo;
			gridModel.storeModel = {sortState: sortState};
			
		}
		// TODO : Preferences and existing column model need to be merged
		objGroupView.reconfigureGrid(gridModel);
	},
	
	doHandleLoadGridData : function(groupInfo, subGroupInfo, grid, url, pgSize,
			newPgNo, oldPgNo, sorter, filterData) {
		var me = this;
		var objGroupView = me.getGroupView();
		var buttonMask = me.strDefaultMask;
		var arrOfParseQuickFilter = [], arrOfParseAdvFilter = [], arrOfFilteredApplied = [];
		
		//applying local preferences
		if(allowLocalPreference === 'Y')
			me.handleSaveLocalStorage();
		
		if (!$('#actionResultDiv').hasClass('ui-helper-hidden')) {
			$('#actionResultDiv').addClass('ui-helper-hidden');
			if ($('#actionResultInfoDiv').children('.row').length > 0) {
				$('#actionResultInfoDiv').children('.row').remove();
			}
		}
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
		
		var strUrl = grid.generateUrl(url, pgSize, intNewPgNo, intOldPgNo, sorter);
		var filterUrl = me.generateFilterUrl(subGroupInfo, groupInfo);
		var columnFilterUrl = me.generateColumnFilterUrl(filterData);
		
		if (!Ext.isEmpty(filterUrl)) {
			strUrl += filterUrl;
			if (!Ext.isEmpty(columnFilterUrl))
				strUrl += ' and ' + columnFilterUrl;
		} else {
			if (!Ext.isEmpty(columnFilterUrl))
				strUrl += "&$filter=" + columnFilterUrl;
		}

		if (!Ext.isEmpty(me.filterData)) {
			if (!Ext.isEmpty(me.filterData) && me.filterData.length >= 1) {
				var quickJsonData = me.filterData;
				arrOfParseQuickFilter = generateFilterArray(quickJsonData, strApplicationDateFormat);
			}
		}

		if (!Ext.isEmpty(me.advFilterData)) {
			if (!Ext.isEmpty(me.advFilterData) && me.advFilterData.length >= 1) {				
				arrOfParseAdvFilter = generateFilterArray(me.advFilterData, strApplicationDateFormat);
			}
		}

		var tempArrOfParseQuickFilter = [];
		var clientModeDesc = (selectedFilterLoggerDesc == 'SELLER' ? getLabel('seller', 'Seller') : getLabel('buyer', 'Buyer'));
		loggedInAsFilter = {"fieldId" : "loggedInAs","fieldLabel": getLabel('sellerOrBuyerr', 'View as'), "dataType":"S","operatorValue":"eq","fieldTipValue":clientModeDesc,"fieldValue" :clientModeDesc};
		tempArrOfParseQuickFilter.push(loggedInAsFilter);
		for(var index = 0; index < arrOfParseQuickFilter.length; index++)
		{
			if(arrOfParseQuickFilter[index].fieldId !== "createdBy")
			{
				tempArrOfParseQuickFilter[index + 1] = arrOfParseQuickFilter[index];
			}
			if((arrOfParseQuickFilter[index].fieldId === "Client") &&(arrOfParseQuickFilter[index].fieldValue === undefined))
			{
				tempArrOfParseQuickFilter[index + 1].fieldValue = getLabel('allCompanies','All Companies');
				tempArrOfParseQuickFilter[index + 1].fieldTipValue = getLabel('allCompanies','All Companies');
			}
		}
		
		if (arrOfParseQuickFilter && arrOfParseAdvFilter) {
			arrOfFilteredApplied = tempArrOfParseQuickFilter
					.concat(arrOfParseAdvFilter);

			if (arrOfFilteredApplied)
				me.getFilterView().updateFilterInfo(arrOfFilteredApplied);
		}

		me.filtersAppliedCount = arrOfFilteredApplied.length;
		me.reportGridOrder = strUrl;
		me.handleClearFilterButtonHideAndShow();
		grid.loadGridData(strUrl, null, null, false);

		grid.on('cellclick', function(tableView, td, cellIndex, record, tr,
				rowIndex, e) {
			var clickedColumn = tableView.getGridColumns()[cellIndex];
			var columnType = clickedColumn.colType;
			if (Ext.isEmpty(columnType)) {
				var containsCheckboxCss = (clickedColumn.cls
						.indexOf('x-column-header-checkbox') > -1)
				columnType = containsCheckboxCss
						? 'checkboxColumn'
						: '';
			}
			me.handleGridRowClick(record, grid, columnType);
		});

	},
	
	handleGridRowClick : function(record, grid, columnType) {
		if (columnType !== 'actioncontent' && columnType !== 'checkboxColumn') {
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
					if (!Ext.isEmpty(grid)
							&& !Ext.isEmpty(grid.isRowIconVisible)) {
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
		}
	},

	updateConfig : function() {
		var me = this;
		me.dateHandler = Ext.create('Ext.ux.gcp.DateUtil');
		me.preferenceHandler = Ext.create('Ext.ux.gcp.PreferencesHandler');
		me.firstLoad = true;
		populateAdvancedFilterFieldValue();
		//objLocalStoragePref = me.doGetSavedState();
	},
	
	/*Page setting handling starts here*/
	savePageSetting : function(arrPref, strInvokedFrom) {
		/* This will be get invoked from page level setting always */
		var me = this, args = {};
		if (!Ext.isEmpty(arrPref)) {
			me.preferenceHandler.savePagePreferences(Ext.String.format(me.strPageName+'{0}', selectedFilterLoggerDesc),
					arrPref, me.postHandleSavePageSetting, args, me, false);
		}
	},
	postHandleSavePageSetting : function(data, args, isSuccess) {
		var me = this, args = {};
		if (isSuccess === 'N') {
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
		} else {
			me.preferenceHandler.readPagePreferences(Ext.String.format(me.strPageName+'{0}', selectedFilterLoggerDesc),
					me.updateObjDebitNoteCenterPref, args, me, false);
		}
	},
	updateObjDebitNoteCenterPref : function(data) {
		if(selectedFilterLoggerDesc == 'BUYER'){
			objDNCBuyerSummaryPref = Ext.encode(data);
		} else if(selectedFilterLoggerDesc == 'SELLER'){
			objDNCSellerSummaryPref = Ext.encode(data);
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
				me.preferenceHandler.saveModulePreferences(Ext.String.format(me.strPageName+'{0}', selectedFilterLoggerDesc),
						strModule, objPref, me.postHandlePageGridSetting, args,
						me, false);
			} else {
				me.handleClearLocalPrefernces();
				me.preferenceHandler.savePagePreferences(Ext.String.format(me.strPageName+'{0}', selectedFilterLoggerDesc),
						arrPref, me.postHandlePageGridSetting, args, me, false);
			}
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
			me.preferenceHandler.clearPagePreferences(Ext.String.format(me.strPageName+'{0}', selectedFilterLoggerDesc),
					arrPref, me.postHandleRestorePageSetting, args, me, false);
		} else{
			me.handleClearLocalPrefernces();
			me.preferenceHandler.clearPagePreferences(Ext.String.format(me.strPageName+'{0}', selectedFilterLoggerDesc),
					arrPref, me.postHandleRestorePageSetting, null, me, false);
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
					};
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
				buttonText: {
		            ok: getLabel('btnOk', 'OK')
					},
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
				me.doDeleteLocalState();
				window.location.reload();
		} else {
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

	showPageSettingPopup : function(strInvokedFrom) {
		var me = this, objData = {}, objGroupView = me.getGroupView(), objPrefData, objGeneralSetting, objGridSetting, objColumnSetting;
		var objGroupByVal = '', objDefaultFilterVal = '', objGridSizeVal = '', objRowPerPageVal = _GridSizeTxn, strTitle = null, subGroupInfo;

		me.pageSettingPopup = null;
		
		if(selectedFilterLoggerDesc == 'BUYER')
		{
			objDebitNoteCenterPref = objDNCBuyerSummaryPref;
			arrGenericColumnModel = arrBuyerGenericColumnModel;
		}
		else if(selectedFilterLoggerDesc == 'SELLER')
		{			
			objDebitNoteCenterPref = objDNCSellerSummaryPref;
			arrGenericColumnModel = arrSellerGenericColumnModel;
		}

		if (!Ext.isEmpty(objDebitNoteCenterPref)) {
			objPrefData = Ext.decode(objDebitNoteCenterPref);
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
			: (!Ext.isEmpty(Ext.decode(arrGenericColumnModel)) ? Ext.decode(arrGenericColumnModel) : (DEBIT_NOTE_CENTER_COLUMNS || '[]'));

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
		objData["filterUrl"] = 'services/userfilterslist/debitNoteGroupViewFilter'+selectedFilterLoggerDesc+'.json';
		objData["rowPerPage"] = _AvailableGridSize;
		objData["groupByVal"] = objGroupByVal;
		objData["filterVal"] = objDefaultFilterVal;
		objData["gridSizeVal"] = objGridSizeVal;
		objData["rowPerPageVal"] = objRowPerPageVal;
		subGroupInfo = objGroupView.getSubGroupInfo() || {};
		strTitle = (strInvokedFrom === 'GRID' ? getLabel("columnSettings",
				"Column Settings")
				+ ' : ' + (subGroupInfo.groupDescription || '') : getLabel(
				"Settings", "Settings"));
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
	/*Page setting handling ends here*/
	
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

		strExtension = arrExtension[actionName];
		//:TODO strUrl needs to be change once the service is written for line items download..
		strUrl = 'services/generateDebitNoteListReport/'+selectedFilterLoggerDesc+'.' + strExtension;
		strUrl += '?$skip=1';
		
		var groupView = me.getGroupView(), subGroupInfo = groupView
		.getSubGroupInfo()
		|| {}, objPref = {}, groupInfo = groupView
		.getGroupInfo()
		|| '{}', strModule = subGroupInfo.groupCode;
		var filterUrl = me.generateFilterUrl(subGroupInfo, groupInfo);
		var filterData = me.filterData;
		var columnFilterUrl = me.generateColumnFilterUrl(filterData);
		
		if (!Ext.isEmpty(filterUrl)) {
			strUrl += filterUrl;
			if (!Ext.isEmpty(columnFilterUrl))
				strUrl += ' and ' + columnFilterUrl;
		} else {
			if (!Ext.isEmpty(columnFilterUrl))
				strUrl += "&$filter=" + columnFilterUrl;
		}
		
		//strUrl += this.generateFilterUrl();
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
		arrColumn = grid.getAllVisibleColumns();

		if (arrColumn) {
			var col = null;
			var colArray = new Array();
			for (var i = 0; i < arrColumn.length; i++) {
				col = arrColumn[i];
				if (col.dataIndex && arrDownloadReportColumn[col.dataIndex])
					colArray.push(arrDownloadReportColumn[col.dataIndex]);
			}
			if (colArray.length > 0)
				strSelect = '&$select=[' + colArray.toString() + ']';
		}
		
		var count = 0, objOfSelectedGridRecord = null, objOfGridSelected = null;
		var objGroupView = me.getGroupView();
		var arrSelectedrecordsId = [];
		if (!Ext.isEmpty(objGroupView))
			grid = objGroupView.getGrid();

		if (!Ext.isEmpty(grid)) {
			var objOfRecords = grid.getSelectedRecords();
			if (!Ext.isEmpty(objOfRecords)) {
				objOfGridSelected = grid;
				objOfSelectedGridRecord = objOfRecords;
			}
		}
		if ((!Ext.isEmpty(objOfGridSelected))
				&& (!Ext.isEmpty(objOfSelectedGridRecord))) {
			for (var i = 0; i < objOfSelectedGridRecord.length; i++) {
				arrSelectedrecordsId
						.push(objOfSelectedGridRecord[i].data.identifier);
			}
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
				csrfTokenName, csrfTokenValue));
		form.appendChild(me.createFormField('INPUT', 'HIDDEN', 'txtCurrent',
				currentPage));
		form.appendChild(me.createFormField('INPUT', 'HIDDEN', 'txtCSVFlag',
				withHeaderFlag));
		for (var i = 0; i < arrSelectedrecordsId.length; i++) {
			form.appendChild(me.createFormField('INPUT', 'HIDDEN',
					'identifier', arrSelectedrecordsId[i]));
		}
		form.action = strUrl;
		document.body.appendChild(form);
		form.submit();
		document.body.removeChild(form);
	},
	
	disableActions : function(canDisable) {
		if (canDisable)
			$('.canDisable').addClass('button-grey-effect');
		else
			$('.canDisable').removeClass('button-grey-effect');
	},
	
	assignSavedFilter : function() {
		var me = this,savedFilterCode='';
		if (me.firstTime) {
			me.firstTime = false;

			if (objDebitNoteCenterPref || objSaveLocalStoragePref) {
				var objJsonData = Ext.decode(objDebitNoteCenterPref);
				objLocalJsonData = Ext.decode(objSaveLocalStoragePref); 
				
				if (!Ext.isEmpty(objLocalJsonData.d.preferences) && (!Ext.isEmpty(objLocalJsonData.d.preferences.tempPref)) && allowLocalPreference === 'Y') {
						if(!Ext.isEmpty(objLocalJsonData.d.preferences.tempPref.advFilterCode)){
							savedFilterCode = objLocalJsonData.d.preferences.tempPref.advFilterCode;
							me.savedFilterVal = objLocalJsonData.d.preferences.tempPref.advFilterCode;
						}
						if(!Ext.isEmpty(objLocalJsonData.d.preferences.tempPref.advFilterJson)){
							me.populateSavedFilter(savedFilterCode,objLocalJsonData.d.preferences.tempPref.advFilterJson,true);
							me.handleFieldSync();
						}
				} else if (objDebitNoteCenterPref) {
					var objJsonData = Ext.decode(objDebitNoteCenterPref);
					if (!Ext.isEmpty(objJsonData.d.preferences)) {
						if (!Ext.isEmpty(objJsonData.d.preferences.GeneralSetting)) {
							if (!Ext
									.isEmpty(objJsonData.d.preferences.GeneralSetting.defaultFilterCode)) {
								var advData = objJsonData.d.preferences.GeneralSetting.defaultFilterCode;
								if (advData === me.getFilterView()
										.down('combo[itemId="savedFiltersCombo"]')
										.getValue()) {
									$("#msSavedFilter option[value='" + advData
											+ "']").attr("selected", true);
									$("#msSavedFilter").multiselect("refresh");
									me.savedFilterVal = advData;
									me.handleSavedFilterClick();
								}
							}
						}
					}
				}
			}
		}
	},
	
	doHandleGroupByChange : function(menu, groupInfo) {
		var me = this;
		if (me.previouGrouByCode === 'RECSUM_OPT_ADVFILTER') {
			me.savePrefAdvFilterCode = null;
			me.showAdvFilterCode = null;
			me.filterApplied = 'ALL';
		}
		if (groupInfo && groupInfo.groupTypeCode === 'RECSUM_OPT_ADVFILTER') {
			me.previouGrouByCode = groupInfo.groupTypeCode;
		} else
			me.previouGrouByCode = null;
	},
	handlWheelScroll:function(){
		var dateEntry='';
		var dateEnd=''
		dateEntry = this.getDateMenu();
		if(dateEntry!=undefined){
			dateEntry.close();
		}
	},
	resetAllFields : function() {
		var me = this;
		$("input[type='text'][id='txtUniqueID']").val("");
		me.getEntryDateLabel().setText(getLabel('entryDate', 'Entry Date'));
		$('#entryDataPicker').val("");
		selectedEntryDate = {};
		me.datePickerSelectedEntryAdvDate = [];
		me.dateFilterVal = '';
		$("#entryDateFrom").val("");
		$('label[for="EntryDateLabel"]').text(getLabel('entryDate', 'Entry Date'));
		updateToolTip('entryDate',null);
		resetAllMenuItemsInMultiSelect("#msProducts");
		resetAllMenuItemsInMultiSelect("#dropdownClientCode");
		$("#createdByOperator").val($("#createdByOperator option:first").val());
		resetAllMenuItemsInMultiSelect("#msStatus");
		$("#amountOperator").val($("#amountOperator option:first").val());
		$("#amountFieldFrom").val("");
		$("#amountFieldTo").val("");
		$(".amountTo").addClass("hidden");
		$("#msAmountLabel").text(getLabel("amount","Amount"));
		$("input[type='text'][id='savedFilterAs']").val("");
		$("input[type='text'][id='savedFilterAs']").prop('disabled', false);
		
		$('#msClient').val('all');
		$('#msClient').niceSelect('update');
		$('#amountOperator,#createdByOperator').niceSelect('update');
		
		$("#saveFilterChkBox").attr('checked', false);
		$("#msSavedFilter").val("");
		$("#msSavedFilter").multiselect("refresh");
		
		var objField = me.getDebitNoteCenterFilterView()
			.down('combo[itemId="statusCombo"]');
		if (!Ext.isEmpty(objField)) {
			objField.selectAllValues();
			me.statusFilterVal = 'all';
		}
	},
	
	getDateParam : function(index, dateType) {
		var me = this;
		me.dateRangeFilterVal = index;
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
				if(!Ext.isEmpty(filterDays) && filterDays !== '999'){
					fieldValue1 = Ext.Date.format(dtHistoryDate, strSqlDateFormat);
					fieldValue2 = Ext.Date.format(date, strSqlDateFormat);
					operator = 'bt';
				}
				else{
					fieldValue1 = Ext.Date.format(date, strSqlDateFormat);
					fieldValue2 = fieldValue1;
					operator = 'le';
				}
				break;
			 case '14' :
				// Last Month only
				dtJson = objDateHandler.getLastMonthStartAndEndDate(date);
				fieldValue1 = Ext.Date
						.format(dtJson.fromDate, strSqlDateFormat);
				fieldValue2 = Ext.Date.format(dtJson.toDate, strSqlDateFormat);
				operator = 'bt';
				break;	
			 case '13' :
				// Date Range
				if (!isEmpty(me.datePickerSelectedDate)) {
					if (me.datePickerSelectedDate.length == 1) {
						fieldValue1 = Ext.Date.format(
								me.datePickerSelectedDate[0], strSqlDateFormat);
						/*if(me.datePickerSelectedDate[0] < date){
							fieldValue2 = Ext.Date.format(date, strSqlDateFormat);
							operator = 'bt';
						} else {*/
							fieldValue2 = fieldValue1;
							operator = 'eq';
						//}
					} else if (me.datePickerSelectedDate.length == 2) {
						fieldValue1 = Ext.Date.format(
								me.datePickerSelectedDate[0], strSqlDateFormat);
						fieldValue2 = Ext.Date.format(
								me.datePickerSelectedDate[1], strSqlDateFormat);
						operator = 'bt';
					}
				}
				if ('entryDate' === dateType
						&& !isEmpty(me.datePickerSelectedEntryAdvDate)) {
					if (me.datePickerSelectedEntryAdvDate.length == 1) {
						fieldValue1 = Ext.Date.format(
								me.datePickerSelectedEntryAdvDate[0],
								strSqlDateFormat);
						fieldValue2 = fieldValue1;
						operator = 'eq';
					} else if (me.datePickerSelectedEntryAdvDate.length == 2) {
						fieldValue1 = Ext.Date.format(
								me.datePickerSelectedEntryAdvDate[0],
								strSqlDateFormat);
						fieldValue2 = Ext.Date.format(
								me.datePickerSelectedEntryAdvDate[1],
								strSqlDateFormat);
						operator = 'bt';
					}
				}
		}
		retObj.fieldValue1 = fieldValue1;
		retObj.fieldValue2 = fieldValue2;
		retObj.operator = operator;
		return retObj;
	},
	
	entryDateChange : function(btn, opts) {
		var me = this;
		me.entryDateFilterVal = btn.btnValue;
		me.entryDateFilterLabel = btn.text;
		me.handleEntryDateInAdvFilterChange(btn.btnValue);
	},
	
	handleEntryDateInAdvFilterChange : function(index) {
		var me = this;
		var dateToField;
		var objDateParams = me.getDateParam(index, 'entryDate');

		if (!Ext.isEmpty(me.entryDateFilterLabel)) {
			$('label[for="EntryDateLabel"]').text(getLabel('entryDate',
					'Entry Date')
					+ " (" + me.entryDateFilterLabel + ")");
		}
		var vFromDate = $.datepick.formatDate(strApplicationDateFormat, $.datepick.parseDate('yy-mm-dd', objDateParams.fieldValue1));
		var vToDate = $.datepick.formatDate(strApplicationDateFormat, $.datepick.parseDate('yy-mm-dd', objDateParams.fieldValue2));
		
		var filterOperator = objDateParams.operator;

		if (index == '13') {
			if (filterOperator == 'eq') {
				$('#entryDateFrom').datepick('setDate', vFromDate);
			} else {
				$('#entryDateFrom').datepick('setDate', [vFromDate, vToDate]);
			}
			if (filterOperator == 'eq')
				dateToField = "";
			else
				dateToField = vToDate;
			selectedEntryDate = {
				operator : filterOperator,
				fromDate : vFromDate,
				toDate : dateToField,
				dateFilterLabel : me.entryDateFilterLabel
			};
		} else {
			if (index === '1' || index === '2' || index === '12') {
				if (index === '12' && !Ext.isEmpty(filterDays) && filterDays !== '999') {
					$('#entryDateFrom').datepick('setDate', vToDate);
				} else if(index === '12'){
					$('#entryDateFrom').datepick('setDate', vFromDate);
				} else {
					$('#entryDateFrom').datepick('setDate', vFromDate);
				}
			} else {
				$('#entryDateFrom').datepick('setDate', [vFromDate, vToDate]);
			}
			if (filterOperator == 'eq')
				dateToField = "";
			else
				dateToField = vToDate;
			selectedEntryDate = {
				operator : filterOperator,
				fromDate : vFromDate,
				toDate : dateToField,
				dateFilterLabel : me.entryDateFilterLabel
			};
		}
	},
	
	generateFilterUrl : function(subGroupInfo, groupInfo) {
		var me = this;
		var strQuickFilterUrl = '', strAdvancedFilterUrl = '', strUrl = '', isFilterApplied = false;
		var strGroupQuery = (subGroupInfo && subGroupInfo.groupQuery)
				? subGroupInfo.groupQuery
				: '';

		strQuickFilterUrl = me.generateUrlWithQuickFilterParams(me);
		if (!Ext.isEmpty(strQuickFilterUrl)) {
			strUrl += '&$filter=' + strQuickFilterUrl;
			isFilterApplied = true;
		}
		var URLJson = me.generateUrlWithAdvancedFilterParams(isFilterApplied);

		var strDetailUrl = URLJson.detailFilter;
		if (!Ext.isEmpty(strDetailUrl) && strDetailUrl.indexOf(' and') == 0) {
			strDetailUrl = strDetailUrl.substring(4, strDetailUrl.length);
		}
		strAdvancedFilterUrl = URLJson.batchFilter;
		if (!Ext.isEmpty(strAdvancedFilterUrl)
				&& strAdvancedFilterUrl.indexOf(' and ') == strAdvancedFilterUrl.length
						- 5) {
			strAdvancedFilterUrl = strAdvancedFilterUrl.substring(0,
					strAdvancedFilterUrl.length - 5);
		}
		if (!Ext.isEmpty(strAdvancedFilterUrl)) {
			if (Ext.isEmpty(strUrl)) {
				strUrl = "&$filter=";
			}
			strUrl += strAdvancedFilterUrl;
			isFilterApplied = true;
		}
		if (!Ext.isEmpty(strDetailUrl)) {
			strUrl += "&$filterDetail=" + strDetailUrl;
			isFilterApplied = true;
		}
		if (!Ext.isEmpty(strGroupQuery)) {
			if (!Ext.isEmpty(strUrl))
				strUrl += ' and ' + strGroupQuery;
			else
				strUrl += '&$filter=' + strGroupQuery;
		}
		return strUrl;
	},
	
	generateUrlWithQuickFilterParams : function() {
		var me = this;
		var filterData = me.filterData;
		var isFilterApplied = false;
		var strFilter = '';
		var strTemp = '';
		var strFilterParam = '';
		for (var index = 0; index < filterData.length; index++) {
			if (isFilterApplied)
				strTemp = strTemp + ' and ';
			if (Ext.isEmpty(filterData[index].operatorValue)) {
				isFilterApplied = false;
				continue;
			}
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

				case 'in' :
					var reg = new RegExp(/[\(\)]/g);
					var objValue = filterData[index].paramValue1;
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
					
				case 'lk' :
					isFilterApplied = true;
					if (filterData[index].detailFilter
							&& filterData[index].detailFilter === 'Y') {
						strDetailUrl = strDetailUrl
								+ filterData[index].field + ' '
								+ filterData[index].operatorValue + ' ' + '\''
								+ filterData[index].value1 + '\'';
					} else {
						strTemp = strTemp + filterData[index].field + ' '
								+ filterData[index].operatorValue + ' ' + '\''
								+ filterData[index].value1 + '\'';
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
	
	generateUrlWithAdvancedFilterParams : function(blnFilterApplied) {
		var retUrl = {};
		var me = this;
		var filterData = me.advFilterData;
		var isFilterApplied = blnFilterApplied;
		var isOrderByApplied = false;
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
						&& (operator === 'bt' || operator === 'lk'
								|| operator === 'gt' || operator === 'lt')) {
					if (filterData[index].detailFilter
							&& filterData[index].detailFilter === 'Y') {
						strDetailUrl = strDetailUrl + ' and ';
					} else {
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
							isFilterApplied = true;
						} else {
							strTemp = strTemp + ',';
						}
						strTemp = strTemp + filterData[index].value1 + ' '
								+ filterData[index].value2;
						break;
					case 'lk' :
						isFilterApplied = true;
						if (filterData[index].detailFilter
								&& filterData[index].detailFilter === 'Y') {
							strDetailUrl = strDetailUrl
									+ filterData[index].field + ' '
									+ filterData[index].operator + ' ' + '\''
									+ filterData[index].value1 + '\'';
						} else {
							strTemp = strTemp + filterData[index].field + ' '
									+ filterData[index].operator + ' ' + '\''
									+ filterData[index].value1 + '\'';
						}
						break;
					case 'eq' :
						isInCondition = me.isInCondition(filterData[index]);
						if (isInCondition) {
							var reg = new RegExp(/[\(\)]/g);
							var objValue = filterData[index].value1;
							if (objValue != 'All') {
								if (isFilterApplied) {
									strTemp = strTemp + ' and ';
								} else {
									isFilterApplied = true;
								}

								if (filterData[index].detailFilter
										&& filterData[index].detailFilter === 'Y') {
									strDetailUrl = strDetailUrl
											+ filterData[index].field + ' '
											+ filterData[index].operator + ' '
											+ '\'' + objValue + '\'';
								} else if (filterData[index].dataType === 1) {
									strTemp = strTemp + filterData[index].field
											+ ' ' + filterData[index].operator
											+ ' ' + 'date\''
											+ filterData[index].value1 + '\'';
								} else if (filterData[index].field === "Reversal") {
									strTemp = strTemp
											+ "(InstrumentType eq '62' and ActionStatus eq '74')"
								} else {
									strTemp = strTemp + filterData[index].field
											+ ' ' + filterData[index].operator
											+ ' ' + '\'' + objValue + '\'';
								}
								isFilterApplied = true;
							}
						}
						if (filterData[index].field === 'InstrumentType')
							me.paymentTypeAdvFilterVal = filterData[index].value1;
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
					case 'in' :
						var reg = new RegExp(/[\(\)]/g);
						var objValue = filterData[index].value1;
						var objArray = objValue.split(',');
						if (objArray.length > 0) {
							if (objArray[0] != 'All') {
								if (isFilterApplied) {
									if (filterData[index].detailFilter
											&& filterData[index].detailFilter === 'Y') {
										strDetailUrl = strDetailUrl + ' and ';
									} else {
										strTemp = strTemp + ' and ';
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
												+ filterData[index].field
												+ ' eq ';
										strDetailUrl = strDetailUrl + '\''
												+ objArray[i] + '\'';
										if (i != objArray.length - 1)
											strDetailUrl = strDetailUrl
													+ ' or ';
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
		retUrl.batchFilter = strFilter;
		retUrl.detailFilter = strDetailUrl;
		return retUrl;
	},
	
	generateColumnFilterUrl : function(filterData) {
		var strTempUrl = '';
		var obj = null, arrValues = null;
		var arrNested = null
		// TODO: This is currently handled only for type list, to be handled for
		// rest types
		if (filterData) {
			for (var key in filterData) {
				obj = filterData[key] || {};
				arrValues = obj.value || [];
				if (obj.type === 'list') {
					Ext.each(arrValues, function(item) {
								if (item) {
									arrNested = item.split(',');
									Ext.each(arrNested, function(value) {
												strTempUrl += strTempUrl
														? ' or '
														: '';
												strTempUrl += arrSortColumn[key]
														+ ' eq \''
														+ value
														+ '\'';
											});
								}
							});
					if (strTempUrl)
						strTempUrl = '( ' + strTempUrl + ' )';
				}
			}
		}
		return strTempUrl;
	},
	
	handleSavedFilterClick : function() {
		var me = this;
		var savedFilterVal = $("#msSavedFilter").val();
		me.resetAllFields();
		me.filterCodeValue = null;

		var filterCodeRef = $("input[type='text'][id='savedFilterAs']");
		if (!Ext.isEmpty(filterCodeRef)) {
			filterCodeRef.val(savedFilterVal);
			me.savedFilterVal = savedFilterVal;
		}

		var saveFilterChkBoxRef = $("input[type='checkbox'][id='saveFilterChkBox']");
		if (!Ext.isEmpty(saveFilterChkBoxRef) && !Ext.isEmpty(savedFilterVal))
			saveFilterChkBoxRef.prop('checked', true);

		var applyAdvFilter = false;
		me.filterCodeValue = savedFilterVal;
		me.getSavedFilterData(savedFilterVal, this.populateSavedFilter,
				applyAdvFilter);
	},
	
	getSavedFilterData : function(filterCode, fnCallback, applyAdvFilter) {
		var me = this;
		var strUrl = Ext.String.format(me.strGetSavedFilterUrl, selectedFilterLoggerDesc, filterCode);
		Ext.Ajax.request({
			url : strUrl,
			method : 'GET',
			async : false,
			success : function(response) {
				if (!Ext.isEmpty(response)
						&& !Ext.isEmpty(response.responseText)) {
					var responseData = Ext
							.decode(response.responseText);
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
							buttonText: {
					            ok: getLabel('btnOk', 'OK')
								},
							cls : 't7-popup',
							icon : Ext.MessageBox.ERROR
						});
			}
		});
	},
	
	getQuickFilterQueryJson : function() {
		var me = this;
		var statusFilterValArray = [];
		var statusFilterVal = me.statusFilterVal;
		var statusFilterDiscArray = [];
		var statusFilterDisc = me.statusFilterDesc;
		var entryDateValArray = [];
		var clientFilterVal = me.clientFilterVal;
		var clientFilterDesc = me.clientFilterDesc;
		var jsonArray = [];
		var index = me.dateFilterVal;
		me.datePickerSelectedDate = me.datePickerSelectedEntryDate;
		var objDateParams = me.getDateParam(index);
		
		if (!Ext.isEmpty(index)) {
			jsonArray.push({
						paramName : 'EntryDate',
						paramValue1 : objDateParams.fieldValue1,
						paramValue2 : objDateParams.fieldValue2,
						operatorValue : objDateParams.operator,
						dataType : 'D',
						paramFieldLable : getLabel('date', 'Entry Date')
					});
		}
		
		if (statusFilterVal != null && statusFilterVal != 'All'
				&& statusFilterVal != 'all' && statusFilterVal.length >= 1) {
			statusFilterValArray = statusFilterVal.toString();

			if (statusFilterDisc != null && statusFilterDisc != 'All'
					&& statusFilterDisc != 'all'
					&& statusFilterDisc.length >= 1)
				statusFilterDiscArray = statusFilterDisc.toString();

			jsonArray.push({
						paramName : getLabel('actionStatus', 'actionStatus'),
						paramValue1 : statusFilterValArray,
						operatorValue : 'in',
						dataType : 'S',
						paramFieldLable : getLabel('lblStatus', 'Status'),
						displayType : 5,
						displayValue1 : statusFilterDiscArray
					});
		}
		
		if (!Ext.isEmpty(clientFilterVal)
				&& !Ext.isEmpty(clientFilterDesc)
				&& clientFilterVal != 'all') {
			jsonArray.push({
						paramName : 'Client',
						paramValue1 : encodeURIComponent(clientFilterVal.replace(new RegExp("'", 'g'), "\''")),
						operatorValue : 'eq',
						dataType : 'S',
						displayType : 5,
						paramFieldLable : getLabel('lblcompany', 'Company Name'),
						displayValue1 : clientFilterDesc
					});
		}

		return jsonArray;
	},
	
	populateSavedFilter : function(filterCode, filterData, applyAdvFilter) {
		var me = this;
		var fieldName = '';
		var fieldVal = '';
		var fieldSecondVal = '';
		var currentFilterData = '';
		var fieldType = '';
		var columnId = '';
		var sortByOption = '';
		var buttonText = '';
		var operatorValue = '';

		for (i = 0; i < filterData.filterBy.length; i++) {
			fieldName = filterData.filterBy[i].field;
			fieldVal = filterData.filterBy[i].value1;
			fieldSecondVal = filterData.filterBy[i].value2;
			currentFilterData = filterData.filterBy[i];
			operatorValue = filterData.filterBy[i].operator;
			if (fieldName === 'UniqueId') {
				$("input[type='text'][id='txtUniqueID']").val(fieldVal);
			} else if (fieldName === 'Amount') {
				me.setAmounts(operatorValue, fieldVal, fieldSecondVal);
			} else if (fieldName === 'CreatedBy') {
				$('#createdByOperator').val(fieldVal);
				$('#createdByOperator').niceSelect('update');
			} else if (fieldName === 'EntryDate') {
				me.dateFilterLabel = filterData.filterBy[i].dateFilterLabel;
				me.setSavedFilterDates(fieldName, currentFilterData);
			} else if (fieldName === 'actionStatus'
				|| fieldName === 'Package'
				|| fieldName === 'BuyerSeller'){
				me.checkUnCheckMenuItems(fieldName, fieldVal);
				/*if (fieldName === 'ActionStatus' && Array.isArray(fieldVal)) {
					filterData.filterBy[i].value1 = fieldVal.join(",");
				}*/
			}
		}

		if (!Ext.isEmpty(filterCode)) {
			$('#savedFilterAs').val(filterCode);
			$("#msSavedFilter option[value='" + filterCode + "']").attr(
					"selected", true);
			$("#msSavedFilter").multiselect("refresh");
			var saveFilterChkBox = $("input[type='checkbox'][id='saveFilterChkBox']");
			saveFilterChkBox.prop('checked', true);
		}
		if (applyAdvFilter) {
			me.showAdvFilterCode = filterCode;
			me.applyAdvancedFilter(filterData);
		}
	},
	
	setAmounts : function(operator, amountFromFieldValue, amountToFieldValue) {
		var amonutFieldRefFrom = $("#amountFieldFrom");
		var amountFieldRefTo = $("#amountFieldTo");

		if (!Ext.isEmpty(operator)) {
			if (!Ext.isEmpty(amountFromFieldValue)) {
				$('#amountOperator').val(operator);
				$('#amountOperator').niceSelect('update');
				amonutFieldRefFrom.val(amountFromFieldValue);
				handleAmountOperatorChange();
				if (!Ext.isEmpty(amountToFieldValue)) {
					if (operator == "bt") {
						//$("#amountFieldTo").removeClass("hidden");
						amountFieldRefTo.val(amountToFieldValue);
					}
				}
			}
		}
	},
	
	setSavedFilterDates : function(dateType, data) {
		if (!Ext.isEmpty(dateType) && !Ext.isEmpty(data)) {
			var me = this;
			var dateFilterRefFrom = null;
			/* var dateFilterRefTo = null; */
			var formattedFromDate, fromDate, toDate, formattedToDate;
			var dateOperator = data.operator;

			fromDate = data.value1;
			if (!Ext.isEmpty(fromDate))
				formattedFromDate = Ext.util.Format
						.date(Ext.Date.parse(fromDate, 'Y-m-d'),
								strExtApplicationDateFormat);

			toDate = data.value2;
			if (!Ext.isEmpty(toDate))
				formattedToDate = Ext.util.Format.date(Ext.Date.parse(toDate,
								'Y-m-d'), strExtApplicationDateFormat);

			if (dateType === 'EntryDate') {
				selectedEntryDate = {
					operator : dateOperator,
					fromDate : formattedFromDate,
					toDate : formattedToDate
				};
				dateFilterRefFrom = $('#entryDateFrom');
			}
			
			var vFromDate = $.datepick.formatDate(strApplicationDateFormat, $.datepick.parseDate('yy-mm-dd', fromDate));
			var vToDate = $.datepick.formatDate(strApplicationDateFormat, $.datepick.parseDate('yy-mm-dd', toDate));

			if(dateOperator === 'eq'){
				$(dateFilterRefFrom).val(formattedFromDate);
			} else if(dateOperator === 'bt') {
				$(dateFilterRefFrom).datepick('setDate', [formattedFromDate, formattedToDate]);
			}
			
			if (!Ext.isEmpty(me.dateFilterLabel)) {
				$('label[for="EntryDateLabel"]').text(getLabel('date', 'Entry Date')
						+ " (" + me.dateFilterLabel + ")");
			}
		}
	},
	
	applyAdvancedFilter : function(filterData) {
		var me = this, objGroupView = me.getGroupView();
		me.filterApplied = 'A';
		me.setDataForFilter(filterData);
		me.refreshData();
		if (objGroupView)
			objGroupView.toggleFilterIcon(true);
		objGroupView.setFilterToolTip(me.showAdvFilterCode || '');
	},
	
	deleteFilterSet : function(filterCode) {
		var me = this;
		var objFilterName;
		var savedFilterCombobox = me.getFilterView()
				.down('combo[itemId="savedFiltersCombo"]');
		var objComboStore = null;
		if (!Ext.isEmpty(filterCode))
			objFilterName = filterCode;
		me.filterCodeValue = null;
		me.savedFilterVal = '';
//		me.doHandleStateChange();
		if (me.savePrefAdvFilterCode == objFilterName) {
			me.advFilterData = [];
			me.filterApplied = 'A';
			me.refreshData();
		}
		if (savedFilterCombobox) {
			objComboStore = savedFilterCombobox.getStore();
			objComboStore.removeAt(objComboStore.find('filterName',
					objFilterName));
			savedFilterCombobox.setValue('');
		}
		me.deleteFilterCodeFromDb(objFilterName);
		me.sendUpdatedOrderJsonToDb();
	},
	
	deleteFilterCodeFromDb : function(objFilterName) {
		var me = this;
		if (!Ext.isEmpty(objFilterName)) {
			var strUrl = me.strRemoveSavedFilterUrl;
			strUrl = Ext.String.format(strUrl, selectedFilterLoggerDesc, objFilterName);
			Ext.Ajax.request({
						url : strUrl,
						method : 'POST',
						success : function(response) {

						},
						failure : function(response) {
							// console.log('Bad : Something went wrong with your
							// request');
						}
					});
		}
	},
	
	sendUpdatedOrderJsonToDb : function() {
		var me = this;
		var objJson = {};
		var FiterArray = [];
		$("#msSavedFilter option").each(function() {
					FiterArray.push($(this).val());
				});
		objJson.filters = FiterArray;
		var strUrl = 'services/userpreferences/debitNoteCenter{0}/groupViewAdvanceFilter.json';
		Ext.Ajax.request({
			url : Ext.String.format(strUrl, selectedFilterLoggerDesc),
			method : 'POST',
			jsonData : objJson,
			async : false,
			success : function(response) {
				me.updateSavedFilterComboInQuickFilter();
				me.resetAllFields();
			},
			failure : function() {
				// console.log("Error Occured - Addition
				// Failed");

			}

		});
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
	
	doHandleSavedFilterItemClick : function(filterCode, comboDesc) {
		var me = this;
		if (!Ext.isEmpty(filterCode)) {
			me.savePrefAdvFilterCode = filterCode;
			me.showAdvFilterCode = filterCode;
			me.resetAllFields();
			me.getSavedFilterData(filterCode, me.populateSavedFilter, true);
		}
		me.handleFieldSync();
		me.savePrefAdvFilterCode = filterCode;
		me.showAdvFilterCode = filterCode;
	},
	
	handleFieldSync : function(){
		var me = this;
		if (!Ext.isEmpty(me.dateFilterLabel)) {
			me.getEntryDateLabel().setText(getLabel('date', 'Entry Date')
					+ " (" + me.dateFilterLabel + ")");
		}
		var entryDateField = $("#entryDateFrom");
		me.handleEntryDateSync('A', me.getEntryDateLabel().text, "(" + me.dateFilterLabel + ")", entryDateField);
		
		var statusChangedValue = $("#msStatus").getMultiSelectValue();
		var statusValueDesc = [];
		$('#msStatus :selected').each(function(i, selected) {
			statusValueDesc[i] = $(selected).text();
		});
		me.handleStatusFieldSync('A', statusChangedValue, statusValueDesc.toString());
	},
	
	removeFromQuickArrJson : function(arr, key) {
		for (var ai, i = arr.length; i--;) {
			if ((ai = arr[i]) && ai.paramName == key) {
				arr.splice(i, 1);
			}
		}
		return arr;
	},
	
	updateInQuickArrJson : function(arr, key) {
		for (var ai, i = arr.length; i--;) {
			if ((ai = arr[i]) && ai.paramName == key) {
				ai.paramValue1 = ai.paramValue2;
				ai.operatorValue = "le";
			}
		}
		return arr;
	},
	
	removeFromAdvanceArrJson : function(arr, key) {
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
		}
	},
	
	handleSaveAndSearchAction : function(btn) {
		var me = this;
		var callBack = me.postDoSaveAndSearch;
		var strFilterCodeVal = null;
		var FilterCode = $("#savedFilterAs").val();
		if (Ext.isEmpty(FilterCode)) {
			paintError('#advancedFilterErrorDiv',
					'#advancedFilterErrorMessage', getLabel('filternameMsg',
							'Please Enter Filter Name'));
			return;
		} else {
			hideErrorPanel("advancedFilterErrorDiv");
			me.filterCodeValue = FilterCode;
			strFilterCodeVal = me.filterCodeValue;
		}
		me.savePrefAdvFilterCode = strFilterCodeVal;
		hideErrorPanel("advancedFilterErrorDiv");
		me.postSaveFilterRequest(me.filterCodeValue, callBack);
		me.savedFilterVal = FilterCode;
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
		me.savedFilterVal = me.filterCodeValue;
//		me.doHandleStateChange();
	},
	
	doSearchOnly : function() {
		var me = this;
		
		/*var clientComboBox = me.getDebitNoteCenterFilterView()
				.down('combo[itemId="clientCombo"]');
		if (selectedClient != null && $('#msClient').val() != 'all') {
			clientComboBox.setValue(selectedClient);
		} else if ($('#msClient').val() == 'all') {
			clientComboBox.setValue('all');
			clientFilterVal = '';
		}*/
		var entryDateLableVal = $('label[for="EntryDateLabel"]').text();
		var entryDateField = $("#entryDateFrom");
		
		var statusChangedValue = $("#msStatus").getMultiSelectValue();
		var statusValueDesc = [];
		$('#msStatus :selected').each(function(i, selected) {
			statusValueDesc[i] = $(selected).text();
		});
		
		me.applyAdvancedFilter();
		
		me.handleEntryDateSync('A', entryDateLableVal, null, entryDateField);
		me.handleStatusFieldSync('A', statusChangedValue, statusValueDesc.toString());
	},
	
	postSaveFilterRequest : function(FilterCodeVal, fncallBack) {
		var me = this;
		strUrl = Ext.String.format(me.strModifySavedFilterUrl, selectedFilterLoggerDesc, FilterCodeVal);
		var objJson;
		objJson = getAdvancedFilterValueJson(FilterCodeVal);
		Ext.Ajax.request({
			url : strUrl,
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
					strMsg = responseData.d.filters.error.errorMessage;
					imgIcon = Ext.MessageBox.ERROR;
					Ext.MessageBox.show({
								title : title,
								msg : strMsg,
								width : 200,
								buttons : Ext.MessageBox.OK,
								buttonText: {
						            ok: getLabel('btnOk', 'OK')
									},
								cls : 't7-popup',
								icon : imgIcon
							});

				}

				if (FilterCodeVal && isSuccess && isSuccess === 'Y') {
					$('#advancedFilterPopup').dialog('close');
					fncallBack.call(me);
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
							buttonText: {
					            ok: getLabel('btnOk', 'OK')
								},
							cls : 't7-popup',
							icon : Ext.MessageBox.ERROR
						});
			}
		});

	},
	
	saveAndSearchActionClicked : function(me) {
		me.handleSaveAndSearchAction();
	},
	
	handleStatusClick : function(combo) {
		var me = this;
		combo.isQuickStatusFieldChange = false;
		if(combo.isAllSelected()) {
			me.statusFilterVal = 'all';
		}else{
			me.statusFilterVal = combo.getSelectedValues();
			me.statusFilterDesc = combo.getRawValue();
		}
		me.filterApplied = 'Q';
		me.handleStatusFieldSync('Q', me.statusFilterVal, null);
		me.setDataForFilter();
		me.refreshData();
	},
	
	doHandleRowActions : function(actionName, objGrid, record, rowIndex) {
		var me = this;
		var groupView = me.getGroupView();
		var grid = groupView.getGrid();
		if (actionName === 'btnHistory') {
			me.showHistory(me.historyUrl,record.get('identifier'));
		} 
		else if (actionName === 'btnView' || actionName === 'btnEdit') {
			var strUrl = '', objFormData = {};
			if (actionName === 'btnEdit')
			{
				strUrl = 'editDebitNote.form';
			}
			else if (actionName === 'btnView')
			{
				strUrl = 'viewDebitNote.form';
			}
			me.doSubmitForm(strUrl, record, actionName); 
		}
		else if(actionName === 'reject'||actionName === 'authorize' || actionName === 'send'){
			me.doHandleGroupActions(actionName, grid, [record], 'rowAction');
		}
	},
	
	doHandleGroupActions : function(strAction, grid, arrSelectedRecords,
			strActionType, paymentFxInfo) {
		var me = this, isRekeyVerificationApplicable = false;
		var strUrl = Ext.String.format(me.strBatchActionUrl, strAction);
		if (strAction === 'verify' || strAction === 'reject') {
			me.showRejectVerifyPopUp(strAction, strUrl, grid,
					arrSelectedRecords, strActionType);
		} else if (strAction === 'submit' || strAction === 'authorize' ||strAction === 'discard' || strAction === 'send') {
			me.preHandleGroupActions(strUrl, '', grid,
								arrSelectedRecords, strActionType,
								strAction);
		} else {
			me.preHandleGroupActions(strUrl, '', grid, arrSelectedRecords,
					strActionType, strAction);
		}
	},
	
	handlePayNowAction : function(strAction, grid, arrSelectedRecords,strActionType) {
		var me = this;
		var form = document.createElement('FORM');
		// Create array of identifiers
		var strIdentifier='';
		Ext.each(arrSelectedRecords,function(value, index){
			if(index != 0)
				strIdentifier += ',';
			strIdentifier += value.data.identifier;
		});
		form.name = 'frmMain';
		form.id = 'frmMain';
		form.method = 'POST';
		form.appendChild(me.createFormField('INPUT', 'HIDDEN',
				csrfTokenName, tokenValue));
		form.appendChild(me.createFormField('INPUT', 'HIDDEN',
				'viewState', strIdentifier));
		form.appendChild(me.createFormField('INPUT', 'HIDDEN',
				'clientCode', arrSelectedRecords[0].raw.clientCode));
		form.appendChild(me.createFormField('INPUT', 'HIDDEN',
				'userMode', selectedFilterLoggerDesc));
		document.body.appendChild(form);
		form.action = "showFiancePaymentEntry.form";
		form.target = "";
		form.method = "POST";
		form.submit();
	},
	
	handleViewInvoicePOAction : function(strAction, grid, arrSelectedRecords,strActionType) {
		var me = this;
		if(arrSelectedRecords[0].data.invoicePoFlag === "P"){
			me.viewFinanceInvoiceData('viewFinancePO.form',arrSelectedRecords[0].raw);
		} else if(arrSelectedRecords[0].data.invoicePoFlag === "I"){
			me.viewFinanceInvoiceData('viewFinanceInvoice.form',arrSelectedRecords[0].raw);
		}
	},
	
	viewFinanceInvoiceData : function(strUrl, selectedRecord)
	{
		var me = this;
		var form = document.createElement('FORM');

		form.name = 'frmMain';
		form.id = 'frmMain';
		form.method = 'POST';
		form.appendChild(me.createFormField('INPUT', 'HIDDEN',
				csrfTokenName, tokenValue));
		form.appendChild(me.createFormField('INPUT', 'HIDDEN',
				'txtInvIntRefNum', selectedRecord.invoiceIntRefNo));
		form.appendChild(me.createFormField('INPUT', 'HIDDEN',
				'txtPOCenterClientCode', selectedRecord.clientCode));
		document.body.appendChild(form);
		form.action = strUrl;
		form.target = "";
		form.method = "POST";
		form.submit();
	},
	
	handleLoggerChangeInQuickFilter : function(selectedFilterLoggerDesc) {
		var me = this;
		var gridPanel = me.getDebitNoteCenterView();
		gridPanel.removeAll();
		group = gridPanel.createGroupView(selectedFilterLoggerDesc);
		gridPanel.add(group);
		me.getDebitNoteCenterFilterView('#parentContainer').down('#sellerOrBuyerrCombo').suspendEvents();
		me.getDebitNoteCenterFilterView('#parentContainer').down('#sellerOrBuyerrCombo').setValue(selectedFilterLogger);
		me.getDebitNoteCenterFilterView('#parentContainer').down('#sellerOrBuyerrCombo').resumeEvents();
		
		var savedFilterComboBox = me.getFilterView()
				.down('combo[itemId="savedFiltersCombo"]');
		me.savedFilterVal = '';
		me.localSortState = [];
		var buyerSellerPrefs;
		if(selectedFilterLoggerDesc == 'BUYER')
		{
			buyerSellerPrefs = Ext.decode(objSaveLocalStoragePrefBuyer);
		}else{
			buyerSellerPrefs = Ext.decode(objSaveLocalStoragePrefSeller);
		}
		if (!Ext.isEmpty(buyerSellerPrefs.d.preferences) && (!Ext.isEmpty(buyerSellerPrefs.d.preferences.tempPref)) &&  !Ext.isEmpty(buyerSellerPrefs.d.preferences.tempPref.advFilterJson)&&  (!Ext.isEmpty(buyerSellerPrefs.d.preferences.tempPref.advFilterJson.filterBy)) && allowLocalPreference === 'Y'  )
		{
			me.advFilterData =	buyerSellerPrefs.d.preferences.tempPref.advFilterJson.filterBy;
		}
		else
			me.advFilterData = '';
		if (!Ext.isEmpty(buyerSellerPrefs.d.preferences) && (!Ext.isEmpty(buyerSellerPrefs.d.preferences.tempPref)) &&  !Ext.isEmpty(buyerSellerPrefs.d.preferences.tempPref.advFilterCode) && allowLocalPreference === 'Y'  )
		{
			me.savedFilterVal = buyerSellerPrefs.d.preferences.tempPref.advFilterCode;
		}
		if (!Ext.isEmpty(buyerSellerPrefs.d.preferences) && (!Ext.isEmpty(buyerSellerPrefs.d.preferences.tempPref)) &&  !Ext.isEmpty(buyerSellerPrefs.d.preferences.tempPref.sorter) && allowLocalPreference === 'Y'  )
		{
			me.localSortState = buyerSellerPrefs.d.preferences.tempPref.sorter;
		}
		
//		me.advFilterData = '';
		me.getSavedFilterData(me.savedFilterVal, me.populateSavedFilter, true);
		
		if(me.savedFilterVal === "" && me.advFilterData ==="")				
		{
			me.resetAllFields();
			me.setDataForFilter();
			me.refreshData();
		}
		savedFilterComboBox.setValue(me.savedFilterVal);
	},
	
	handleClearSettings : function() {
		var me = this, objGroupView = me.getGroupView();
		var datePickerRef = $('#entryDataPicker');
		
		if (isClientUser()) {
			var clientComboBox = me.getDebitNoteCenterFilterView()
					.down('combo[itemId="clientCombo"]');
			me.clientFilterVal = 'all';
			selectedFilterClientDesc = "";
			selectedFilterClient = "";
			selectedClientDesc = "";
			clientComboBox.setValue(me.clientFilterVal);
			saveScreenFilters();
		} else {
			var clientComboBox = me.getDebitNoteCenterFilterView()
					.down('combo[itemId="clientAuto]');
			clientComboBox.reset();
			me.clientFilterVal = '';
			selectedFilterClientDesc = "";
			selectedFilterClient = "";
			selectedClientDesc = "";
		}

		var statusComboBox = me.getDebitNoteCenterFilterView()
				.down('combo[itemId="statusCombo"]');
		me.statusFilterVal = 'all';
		statusComboBox.selectAllValues();
		me.savedFilterVal = '';
		var savedFilterComboBox = me.getDebitNoteCenterFilterView()
				.down('combo[itemId="savedFiltersCombo"]');
		savedFilterComboBox.setValue(me.savedFilterVal);
		
		var entryDatePicker = me.getDebitNoteCenterFilterView()
			.down('component[itemId="entryDataPicker"]');
		me.dateFilterVal = '';
		me.dateFilterLabel = '';
		me.getEntryDateLabel().setText(getLabel('date', 'Entry Date'));
		me.handleDateChange(me.dateFilterVal);
		datePickerRef.val('');
		
		me.filterApplied = 'Q';
		if (objGroupView)
			objGroupView.toggleFilterIcon(false);
		objGroupView.setFilterToolTip('');

		me.resetAllFields();
		me.setDataForFilter();
		me.refreshData();
	},
	
	isInCondition : function(data) {
		var retValue = false;
		var reg = new RegExp(/^\((\d\d*,)*\d\d*\)$/);
		var displayType = data.displayType;
		var strValue = data.value1;
		if (displayType
				&& (displayType === 4 || displayType === 3 || displayType === 5
						|| displayType === 12 || displayType === 13 
						|| displayType === 6 || displayType === 2
						|| displayType === 8)
				&& strValue /*
							 * && strValue.match(reg)
							 */) {
			retValue = true;
		}
		return retValue;
	},
	
	handleClearFilterButtonHideAndShow : function() {
		var me = this;
		var filterView = me.getFilterView();
		if(me.filtersAppliedCount <= 1)
			filterView.down('button[itemId="clearSettingsButton"]').hide();
		else
			filterView.down('button[itemId="clearSettingsButton"]').show();
		var clientModeDesc = (selectedFilterLoggerDesc == 'SELLER' ? getLabel('seller', 'Seller') : getLabel('buyer', 'Buyer'));
		var loggedInDisplayText = Ext.String.format('{0} : {1}', getLabel('sellerOrBuyerr', 'View as'), clientModeDesc);
		if(!Ext.isEmpty(filterView.down('button[text='+loggedInDisplayText+']')))
		{
			filterView.down('button[text='+loggedInDisplayText+']').setIconCls('');
		}
	},
	
	/* State handling at local storage starts */
	doHandleStateChange : function() {
		var me = this, objState = {}, objGroupView = me.getGroupView(), grid = objGroupView.getGrid() ,subGroupInfo = null;
		if (objGroupView)
			subGroupInfo = objGroupView.getSubGroupInfo();
		objState['filterCode'] = me.savedFilterVal;
		objState['subGroupCode'] = (subGroupInfo || {}).groupCode;
		objLocalStoragePref = objState;
		me.preferenceHandler.setLocalPreferences(me.strLocalStorageKey,Ext.encode(objState));
	},
	
	doGetSavedState : function() {
		var me = this;
		return Ext.decode(me.preferenceHandler.getLocalPreferences(me.strLocalStorageKey));
	},
	
	doDeleteLocalState : function(){
		var me = this;
		me.preferenceHandler.clearLocalPreferences(me.strLocalStorageKey);
	},
	/* State handling at local storage ends */
	
	handleEntryDateChange : function(filterType, btn, opts) {
		var me = this;
		if (filterType == "entryDateQuickFilter") {
			me.dateFilterVal = btn.btnValue;
			me.dateFilterLabel = btn.text;
			me.handleDateChange(btn.btnValue);
			//me.filterAppiled = 'Q';
			me.datePickerSelectedDate = [];
			me.datePickerSelectedEntryDate = [];
			me.setDataForFilter();
			me.refreshData();
			//me.applyQuickFilter();
		}
	},
	
	handleDateChange : function(index) {
		var me = this;
		var objDateParams = me.getDateParam(index);
		var datePickerRef = $('#entryDataPicker');
		/* var toDatePickerRef = $('#entryDataToPicker'); */
		if (!Ext.isEmpty(me.dateFilterLabel)) {
			me.getEntryDateLabel().setText(getLabel('date', 'Entry Date')
					+ " (" + me.dateFilterLabel + ")");
		}

		var vFromDate = $.datepick.formatDate(strApplicationDateFormat, $.datepick.parseDate('yy-mm-dd', objDateParams.fieldValue1));
		var vToDate = $.datepick.formatDate(strApplicationDateFormat, $.datepick.parseDate('yy-mm-dd', objDateParams.fieldValue2));
		
		if (index == '13') {
			if (objDateParams.operator == 'eq') {
				datePickerRef.datepick('setDate', vFromDate);
			} else {
				datePickerRef.datepick('setDate', [vFromDate, vToDate]);
			}
		} else {
			if (index === '1' || index === '2' || index === '12') {
				if (index === '12' && !Ext.isEmpty(filterDays) && filterDays !== '999') {
					datePickerRef.datepick('setDate', vToDate);
				} else if(index === '12'){
					datePickerRef.datepick('setDate', vFromDate);
				} else {
					datePickerRef.datepick('setDate', vFromDate);
				}
			} else {
				datePickerRef.datepick('setDate', [vFromDate, vToDate]);
			}
		}
		
		selectedEntryDate = {
			operator : objDateParams.operator,
			fromDate : vFromDate,
			toDate : vToDate,
			dateFilterLabel : me.dateFilterLabel
		};

		me.handleEntryDateSync('Q', me.getEntryDateLabel().text, " ("
						+ me.dateFilterLabel + ")", datePickerRef);

	},
	
	handleEntryDateSync : function(valueChangedAt, sourceLable,
			sourceToolTipText, sourceTextRef) {
		var me = this, labelToChange, valueControlToChange, updatedDateValue;
		me.entryDateChanged = true;
		labelToChange = (valueChangedAt === 'Q')
				? $('label[for="EntryDateLabel"]')
				: me.getEntryDateLabel();
		valueControlToChange = (valueChangedAt === 'Q')
				? $('#entryDateFrom')
				: $('#entryDataPicker');
		updatedDateValue = sourceTextRef.getDateRangePickerValue();

		if (labelToChange && valueControlToChange
				&& valueControlToChange.hasClass('is-datepick')) {
			if (valueChangedAt === 'Q') {
				labelToChange.text(sourceLable);
				updateToolTip('entryDate', sourceToolTipText);
//				selectedEntryDate = {};
			} else {
				labelToChange.setText(sourceLable);
			}
			if (!Ext.isEmpty(updatedDateValue)) {
				valueControlToChange.datepick('setDate', updatedDateValue);
			}
		}
	},
	
	handleStatusFieldSync : function(type, statusData, statusDataDesc) {
		var me = this;
		if (!Ext.isEmpty(type)) {
			if (type === 'Q') {
				var objStatusField = $("#msStatus");
				var objQuickStatusField = me.getDebitNoteCenterFilterView()
						.down('combo[itemId="statusCombo"]');
				if (!Ext.isEmpty(statusData)) {
					objStatusField.val([]);
					objStatusField.val(statusData);
				} else if (Ext.isEmpty(statusData)) {
					objStatusField.val([]);
				}
				objStatusField.multiselect("refresh");
				if (objQuickStatusField.isAllSelected()) {
					me.statusFilterVal = 'all';
				}
			}
			if (type === 'A') {
				var objStatusField = me.getDebitNoteCenterFilterView()
						.down('combo[itemId="statusCombo"]');
				if (!Ext.isEmpty(statusData)) {
					me.statusFilterVal = 'all';
					objStatusField.setValue(statusData);
					objStatusField.selectedOptions = statusData;
				} else {
					objStatusField.setValue(statusData);
					me.statusFilterVal = '';
				}
			}
		}
	},
	
	checkUnCheckMenuItems : function(componentName, data) {
		var menuRef = null;
		var elementId = null;
		var me = this;
		var clientContainer = null;

		if (componentName === 'actionStatus') {
			menuRef = $("select[id='msStatus']");
			elementId = '#msStatus';
		} else if (componentName === 'Package') {
			menuRef = $("select[id='msProducts']");
			elementId = '#msProducts';
		} else if (componentName === 'BuyerSeller') {
			menuRef = $("select[id='dropdownClientCode']");
			elementId = '#dropdownClientCode';
		}

		if (!Ext.isEmpty(menuRef)) {
			var itemArray = $(elementId + " option");

			if (data === 'All') {
				$(elementId + ' option').prop('selected', true);
			} else {
				$(elementId + ' option').prop('selected', false);
				$(elementId).multiselect("refresh");
			}

			var dataArray = (typeof data == 'string') ? data.split(',') : data;

			if (componentName === 'actionStatus') {
				selectedStatusListSumm = dataArray;
				var statusField = me.getDebitNoteCenterFilterView().down('combo[itemId="statusCombo"]');
				statusField.setValue(dataArray);
				statusField.selectedOptions = dataArray;
			} else if (componentName === 'Package') {
				selectedProductTypeList = dataArray;
			} else if (componentName === 'BuyerSeller') {
				selectedBuyerSellerTypeList = dataArray;
			}
			
			for (var dataIndex = 0; dataIndex < dataArray.length; dataIndex++) {
				for (var index = 0; index < itemArray.length; index++) {
					if (dataArray[dataIndex] == itemArray[index].value) {
						$(elementId + " option[value=\""
								+ itemArray[index].value + "\"]").prop(
								"selected", true);
						break;
					}
				}
			}
			$(elementId).multiselect("refresh");
		}
	},
	showHistory : function(url,id) {
		var historyPopup = Ext.create('GCP.view.HistoryPopup', {
					historyUrl : url,
					identifier : id
				}).show();
		historyPopup.center();
	},
	handleVisualIndication : function(targetRow, targetRecord, resultData,blnUpdateRecord) {
		if (targetRow) {
			if (resultData.success === 'Y') {
				if (blnUpdateRecord) {
					targetRecord.beginEdit();
					targetRecord.set({
								actionStatus : resultData.updatedStatus,
								__metadata : {
									__rightsMap : resultData.__metadata.__rightsMap
								},
								identifier : resultData.identifier,
								isActionTaken : 'Y'
							});
					targetRecord.endEdit();
					targetRecord.commit();
				}
				targetRow.addCls('xn-success-row xn-disabled-row');
			} else {
				if (blnUpdateRecord) {
					targetRecord.beginEdit();
					targetRecord.set({
								isActionTaken : resultData.success === 'N'
										? 'Y'
										: 'N'
							});
					targetRecord.endEdit();
					targetRecord.commit();
				}
				targetRow.addCls('xn-error-row');
			}
		}
	},
	postHandleGroupAction : function(jsonData, grid, strActionType, strAction,
			records) {
		var me = this;
		var groupView = me.getGroupView();
		var msg = '', errCode = '', arrActionMsg = [], actionData, record = '', row = null, intSerialNo;
		if (!Ext.isEmpty(jsonData) && !Ext.isEmpty(jsonData.d)
				&& !Ext.isEmpty(jsonData.d.instrumentActions))
			actionData = jsonData.d.instrumentActions;
		var strActionSuccess = getLabel(strAction, 'Action Successful');
		//var warnLimit = "Warning limit exceeded!"
		Ext.each(jsonData, function(result) {
					intSerialNo = parseInt(result.serialNo,10);
					record = grid.getRecord(intSerialNo);
					row = grid.getRow(intSerialNo);
					msg = '';
					Ext.each(result.errors, function(error) {
								msg = msg + error.code + ' : '
										+ error.errorMessage + "</br>";
								errCode = error.code;
							});
					row = grid.getRow(intSerialNo);
					//me.handleVisualIndication(row, record, result, true);
					grid.deSelectRecord(record);
					row = grid.getLockedGridRow(intSerialNo);
					//me.handleVisualIndication(row, record, result, false);
					arrActionMsg.push({
								success : result.success,
								actualSerailNo : result.serialNo,
								actionTaken : 'Y',
								lastActionUrl : strAction,
								reference : Ext.isEmpty(record) ? '' : record
										.get('reference'),
								actionMessage : result.success === 'Y'
										? strActionSuccess
										: msg
							});

				});
		//groupView.setLoading(false);
		me.refreshData();
		if (!Ext.isEmpty(arrActionMsg)) {
			getRecentActionResult(arrActionMsg);
		}
		groupView.handleGroupActionsVisibility(me.strDefaultMask);
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
								serialNo : grid.getStore()
										.indexOf(records[index])
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
							url : strUrl,
							method : 'POST',
							jsonData : Ext.encode(arrayJson),
							success : function(jsonData) {
								groupView.setLoading(false);
								var jsonRes = Ext.JSON
										.decode(jsonData.responseText);
								me.postHandleGroupAction(jsonRes, grid,
										strActionType, strAction, records);
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
											buttonText: {
									            ok: getLabel('btnOk', 'OK')
												},
											cls : 't7-popup',
											icon : Ext.MessageBox.ERROR
										});
							}
						});
			}
		}
	},
	doSubmitForm : function(strUrl, record, actionName) {
		var me = this;
		var form = null;
		var actionMask = null;
		if(actionName === 'btnView')
			actionMask= me.getActionMask(record);
		form = document.createElement('FORM');
		form.name = 'frmMain';
		form.id = 'frmMain';
		form.method = 'POST';
		form.appendChild(me.createFormField('INPUT', 'HIDDEN',
				csrfTokenName, tokenValue));

		form.appendChild(me.createFormField('INPUT', 'HIDDEN', 'viewState',
				record.data.identifier));
		
		if(actionName === 'btnView'){
			form.appendChild(me.createFormField('INPUT', 'HIDDEN', 'rightsMap',
				actionMask));
		}
				
		form.action = strUrl;
		document.body.appendChild(form);
		form.submit();
		document.body.removeChild(form);
	},
	
	getActionMask : function(record){
		var me = this,grid=null,gridStore=null,jsonData,maskSize = 9,maskArray = new Array(),actionMask = '',rightsMap = '';
		grid = me.getGroupView().getGrid();
		if(!Ext.isEmpty(grid))
			gridStore = grid.getStore();
		if(!Ext.isEmpty(gridStore))
			jsonData = gridStore.proxy.reader.jsonData;
		
		if(!Ext.isEmpty(record) && !Ext.isEmpty(jsonData)){
			rightsMap=record.data.__metadata.__rightsMap;
			if (!Ext.isEmpty(jsonData.d.__buttonMask))
				buttonMask = jsonData.d.__buttonMask;
			
			maskArray.push(buttonMask);
			maskArray.push(rightsMap);
				
			actionMask = doAndOperation(maskArray, maskSize);
		}
		
		return actionMask;

	},
	showRejectVerifyPopUp : function(strAction, strUrl, grid,
			arrSelectedRecords, strActionType) {
		var me = this;
		var titleMsg = '', fieldLbl = '';
		if (strAction === 'reject') {
			fieldLbl = getLabel('userRejectRemarkPopUpTitle',
					'Please Enter Reject Remark');
			titleMsg = getLabel('userRejectRemarkPopUpFldLbl', 'Reject Remark');
		}
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
							if(Ext.isEmpty(text))
							{
								Ext.Msg.alert(getLabel('errorTitle', 'Error'), getLabel('rejectRestrictionErroMsg', 'Reject Remarks cannot be blank'));
							}
							else
							{
								me.preHandleGroupActions(strUrl, '', grid,arrSelectedRecords, strActionType,strAction);
							}
						}
					}
				});
		msgbox.textArea.enforceMaxLength = true;
		msgbox.textArea.inputEl.set({
			maxLength : 255
		});
	},
	applyPreferences : function(){
		var me = this,savedFilterCode ='';

		//applying preferences
		if(selectedFilterLoggerDesc == 'BUYER')
		{
			objDebitNoteCenterPref = objDNCBuyerSummaryPref;
			objSaveLocalStoragePref = objSaveLocalStoragePrefBuyer;
		}else if(selectedFilterLoggerDesc == 'SELLER'){
			objDebitNoteCenterPref = objDNCSellerSummaryPref;
			objSaveLocalStoragePref = objSaveLocalStoragePrefSeller;
		}
		
		if (objDebitNoteCenterPref || objSaveLocalStoragePref) {
			objJsonData = Ext.decode(objDebitNoteCenterPref);
			objLocalJsonData = Ext.decode(objSaveLocalStoragePref); 
			
			if (!Ext.isEmpty(objLocalJsonData.d.preferences) && (!Ext.isEmpty(objLocalJsonData.d.preferences.tempPref)) && allowLocalPreference === 'Y') {
				if(!Ext.isEmpty(objLocalJsonData.d.preferences.tempPref.advFilterCode)){
					savedFilterCode = objLocalJsonData.d.preferences.tempPref.advFilterCode;
					me.savedFilterVal = objLocalJsonData.d.preferences.tempPref.advFilterCode;
				}
				if(!Ext.isEmpty(objLocalJsonData.d.preferences.tempPref.advFilterJson)){
					me.populateSavedFilter(savedFilterCode,objLocalJsonData.d.preferences.tempPref.advFilterJson,true);
					me.handleFieldSync();
				}
		}
		else
			me.applySavedDefaultPreference(objJsonData);
		}
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
	/*handling of local preferences starts here*/
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
		me.localSortState = grid.getSortState();
		objSaveState['filterAppliedType'] = me.filterApplied;
		objSaveState['quickFilterJson'] = !Ext.isEmpty(me.filterData) ? me.filterData : {};
		objSaveState['subGroupCode'] = (subGroupInfo || {}).groupCode;
		objSaveState['pageSize'] = grid && !Ext.isEmpty(grid.getPageSize()) ? grid.getPageSize() : null;
		objSaveState['pageNo'] = grid && !Ext.isEmpty(grid.getCurrentPage()) ? grid.getCurrentPage() :  1;
		objSaveState['sorter'] = !Ext.isEmpty(me.localSortState) ? me.localSortState :  [];
		
		arrSaveData.push({
			"module" : "tempPref",
			"jsonPreferences" : objSaveState
		});
		
		me.saveLocalPref(arrSaveData);
	},
	saveLocalPref : function(objSaveState){
		var me = this;
		var args = {},
		pageName = me.strPageName + selectedFilterLoggerDesc,
		strLocalPrefPageName = pageName+'_TempPref';
		if (!Ext.isEmpty(objSaveState)) {
			args['tempPref'] = objSaveState;
			me.preferenceHandler.savePagePreferences(strLocalPrefPageName, objSaveState,
					me.postHandleSaveLocalPref, args, me, false);
		}
	},
	postHandleSaveLocalPref : function(data, args, isSuccess) {
		var me = this;
		var pageName = me.strPageName + selectedFilterLoggerDesc,
		strLocalPrefPageName = pageName+'_TempPref';
		var objLocalPref = {},objTemp={},objTempPref = {}, jsonSaved ={};
		if (isSuccess === 'N') {
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
	updateObjLocalPref : function (data){
		var me = this;
		if(selectedFilterLoggerDesc == 'BUYER')
		{
			objSaveLocalStoragePrefBuyer = Ext.encode(data);
		}else if(selectedFilterLoggerDesc == 'SELLER'){
			objSaveLocalStoragePrefSeller = Ext.encode(data);
		}
		objSaveLocalStoragePref = Ext.encode(data);
		me.objLocalData = Ext.decode(objSaveLocalStoragePref);
	},
	/*handling of local preferences ends here*/
	
	/*handling of clearing local preferences starts here*/
	handleClearLocalPrefernces : function(){
		var me = this;
		var args = {},
		pageName = me.strPageName + selectedFilterLoggerDesc,
		strLocalPrefPageName = pageName+'_TempPref';
		me.preferenceHandler.clearPagePreferences(strLocalPrefPageName, null,
				me.postHandleClearLocalPreference, args, me, false);
	},
	postHandleClearLocalPreference : function(data, args, isSuccess){
		var me = this;
		var args = {},
		pageName = me.strPageName + selectedFilterLoggerDesc,
		strLocalPrefPageName = pageName+'_TempPref';
		if (isSuccess === 'N') {
			Ext.MessageBox.show({
				title : getLabel('instrumentErrorPopUpTitle', 'Error'),
				msg : getLabel('localerrorMsg', 'Error while clear local setting'),
				buttons : Ext.MessageBox.OK,
				buttonText: {
		            ok: getLabel('btnOk', 'OK')
					},
				cls : 't7-popup',
				icon : Ext.MessageBox.ERROR
			});
		}
		else if(isSuccess === 'Y') {
			objSaveLocalStoragePref = '';
			me.objLocalData = '';
		}
	}
	/*handling of clearing local preferences ends here*/
});