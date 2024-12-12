Ext.define('GCP.controller.PaymentInstQuerySummaryController', {
	extend : 'Ext.app.Controller',
	requires : ['GCP.view.PaymentInstQueryGridView', 'Ext.ux.gcp.DateUtil'],
	views : ['GCP.view.PaymentInstQueryFilterView',
			'GCP.view.PaymentInstQuerySummaryView',
			'GCP.view.PaymentInstQueryAdvFilterPopup',
			'Ext.ux.gcp.PreferencesHandler'],
	refs : [{
				ref : 'paymentInstQueryFilterView',
				selector : 'paymentInstQuerySummaryView paymentInstQueryFilterView'
			}, {
				ref : 'filterUpperPanel',
				selector : 'paymentInstQuerySummaryView paymentInstQueryFilterView panel[itemId="filterUpperPanel"]'
			}, {
				ref : 'paymentInstQueryGridView',
				selector : 'paymentInstQueryGridView[itemId="paymentInstQueryBatchGrid"]'
			}, {
				ref : 'summaryView',
				selector : 'paymentInstQuerySummaryView'
			}, {
				ref : 'advanceFilterPopup',
				selector : 'paymentInstQueryAdvFilterPopup'
			}, {
				ref : 'saveSearchBtn',
				selector : 'paymentInstQueryAdvFilterPopup paymentInstQueryCreateNewAdvFilter button[itemId="saveAndSearchBtn"]'
			},{
				ref : 'clientNameFilter',
				selector : 'paymentInstQueryAdvFilterPopup paymentInstQueryCreateNewAdvFilter button[itemId="clientNameFilterItemId"]'
			}, {
				ref : 'filterDetailsTab',
				selector : 'paymentInstQueryAdvFilterPopup panel[itemId="filterDetailsTab"]'
			}, {
				ref : 'savedFiltersToolBar',
				selector : 'paymentInstQuerySummaryView paymentInstQueryFilterView toolbar[itemId="advFilterActionToolBar"]'
			}, {
				ref : 'advFilterGridView',
				selector : 'paymentInstQueryAdvFilterPopup  paymentInstQueryAdvFilterGridView'
			}, {
				ref : 'withHeaderCheckboxRef',
				selector : 'paymentInstQuerySummaryView menuitem[itemId="withHeaderId"]'
			},	{
				ref : 'btnClearPreferences',
				selector : 'paymentInstQuerySummaryView paymentInstQueryFilterView button[itemId="btnClearPreferences"]'
			},{
				ref : 'btnSavePreferences',
				selector : 'paymentInstQuerySummaryView paymentInstQueryFilterView button[itemId="btnSavePreferences"]'
			},{
				ref : 'paymentInstQueryGroupView',
				selector : 'paymentInstQueryGridView[itemId="paymentInstQueryBatchGrid"] groupView'
			},{
                ref : 'btnClearAdvFilter',
                selector : 'paymentInstQuerySummaryView paymentInstQueryFilterView  panel[itemId="advFilterPanel"]  button[itemId="btnClearAdvFilter"]'
            },{
                ref : 'creationDateFilterLabel',
                selector : 'paymentInstQueryFilterView  label[itemId="creationDateFilterLabel"]'
             },{
                ref : 'creationDateAdvFilterLabel',
                selector : 'paymentInstQueryCreateNewAdvFilter  label[itemId="creationDateAdvFilterLabel"]'
             },{
                ref : 'debitDateFilterLabel',
                selector : 'paymentInstQueryCreateNewAdvFilter  label[itemId="debitDateFilterLabel"]'
             },{
                ref : 'effectiveDateFilterLabel',
                selector : 'paymentInstQueryCreateNewAdvFilter  label[itemId="effectiveDateFilterLabel"]'
             },{
                ref : 'processingDateFilterLabel',
                selector : 'paymentInstQueryCreateNewAdvFilter  label[itemId="processingDateFilterLabel"]'
             },{
                ref : 'instrumentDateFilterLabel',
                selector : 'paymentInstQueryCreateNewAdvFilter  label[itemId="instrumentDateFilterLabel"]'
             },{
                ref : 'liqDateDateFilterLabel',
                selector : 'paymentInstQueryCreateNewAdvFilter  label[itemId="liqDateDateFilterLabel"]'
             },{
                ref : 'requestAdvFilterDateLabel',
                selector : 'paymentInstQueryCreateNewAdvFilter  label[itemId="requestDateAdvFilterLabel"]'
             }],
	config : {
		filterData : [],
		advFilterData : [],
		strFilterApplied : 'Q',
		savePrefAdvFilterCode : null,
		processingQueueTypeCode : strPaymentQueueType,
		processingQueueTypeDesc : getLabel('instrument','Instrument'),
		processingQueueSourceType : 'B',
		strStatusCountUrl : 'services/getBankProcessingQueueStatusCounts.srvc',
		strViewBatchUrl : 'viewPaymentInstQuery.srvc',
		strGetSavedFilterUrl : 'userfilters/bankProcessingQueue{0}/{1}.srvc',
		strReadAllAdvancedFilterCodeUrl : 'userfilterslist/bankProcessingQueue{0}.srvc',
		strExportUrl : 'services/getBankProcessingQueueList/getBankProcessingQueueDynamicReport.{0}',
		strGetModulePrefUrl : 'services/userpreferences/paymentInstQuery{0}/{1}.json',
		strCommonPrefUrl : 'services/userpreferences/paymentInstQuery{0}.json',
		strDefaultMask : '0000000000000000',
		intMaskSize : 16,
		filterCodeValue : null,
		advanceFilterPopup : null,
		preferenceHandler : null,
		strPrefPageKey : 'paymentInstQuery',
		objPrefJson : null,
		strPageName : 'paymentInstQuery',
		selectedTabInfo : 'all',
		reportGridOrder : null,
		dateHandler:null,
		dateFilterVal : defaultDateIndex,
		dateFilterLabel : getDateIndexLabel(defaultDateIndex),
		firstLoad : false
	},
	init : function() {
		var me = this;
		me.createPrefInstance();
		me.firstLoad = true;
		if(objSaveLocalStoragePref){
			me.objLocalData = Ext.decode(objSaveLocalStoragePref);

			objadvFilterPref = me.objLocalData 
								&& me.objLocalData.d.preferences && me.objLocalData.d.preferences.tempPref
								&& me.objLocalData.d.preferences.tempPref.advanceFilterJson ? me.objLocalData.d.preferences.tempPref.advanceFilterJson : {};
			if (!$.isEmptyObject(objadvFilterPref)) {
				me.advFilterData = objadvFilterPref;
				me.strFilterApplied = 'A';
			}
			objQuickPref = me.objLocalData && me.objLocalData.d.preferences
								&& me.objLocalData.d.preferences.tempPref 
								&& me.objLocalData.d.preferences.tempPref.quickFilterJson ? me.objLocalData.d.preferences.tempPref.quickFilterJson : {};
			
			me.objPrefJson = me.filterData = (!Ext.isEmpty(objQuickPref)) ? objQuickPref : [];
		}
		me.doApplySavedPreferences();
		me.updateConfig();
	    me.dateHandler = Ext.create('Ext.ux.gcp.DateUtil');
        $(document).on('filterDateChange',
           function(event, filterType, btn, opts) {
                me.dateFilterVal = btn.btnValue;
                me.dateFilterLabel = btn.text;
                me.handleDateChange(btn.btnValue,filterType);
         });
		me.control({
			'paymentInstQueryTitleView' : {
				'performReportAction' : function(btn) {
					 me.handleReportAction(btn);
				}
			},
			'paymentInstQuerySummaryView' : {
				'performReportAction' : function(btn) {
					 me.handleReportAction(btn);
				}
			},
			'paymentInstQueryGridView[itemId="paymentInstQueryBatchGrid"]' : {
				'render' : function(panel) {
					me.handleGridReconfigure();
					me.toggleSavePrefrenceAction(true);
					me.setDataForQuickFilter(me.filterData);
					me.applyQuickFilter();
					if (!Ext.isEmpty(me.advFilterData)) { me.strFilterApplied = 'A'; }
					if (objPaymentInstQueryPref) {
						var objJsonData = Ext.decode(objPaymentInstQueryPref);
						objGroupByPref = objJsonData.d.preferences[me.processingQueueTypeCode];
						if (!Ext.isEmpty(objGroupByPref)) {
							me.toggleSavePrefrenceAction(false);
							me.toggleClearPrefrenceAction(true);
						}
					}
					if(!Ext.isEmpty(me.filterData)) me.applyFilterDataInQuickFilter(me.filterData);
				}
			},
			'paymentInstQueryGridView[itemId="paymentInstQueryBatchGrid"] groupView' : {
				'groupTabChange' : function(groupInfo, subGroupInfo, tabPanel, newCard, oldCard) {
					me.doHandleGroupTabChange(groupInfo, subGroupInfo, tabPanel, newCard, oldCard);
				},
				'gridRender' : function(groupInfo, subGroupInfo, objGrid, strDataUrl, pageSize, intNewPgNo, intOldPgNo, jsonSorter) {
					me.handleLoadGridData(objGrid, strDataUrl, pageSize, 1, 1, null);
				},
				'gridPageChange' : function(groupInfo, subGroupInfo, objGrid, strDataUrl, pageSize, intNewPgNo, intOldPgNo,	jsonSorter) {
					me.handleLoadGridData(objGrid, strDataUrl, pageSize, intNewPgNo, intOldPgNo, jsonSorter);
				},
				'gridSortChange' : function(groupInfo, subGroupInfo, objGrid, strDataUrl, pageSize, intNewPgNo, intOldPgNo, jsonSorter) {
					me.handleLoadGridData(objGrid, strDataUrl, pageSize, intNewPgNo, intOldPgNo, jsonSorter);
				},
				'gridRowSelectionChange' : function(groupInfo, subGroupInfo, objGrid, objRecord, intRecordIndex, arrSelectedRecords, jsonData) {
					me.doHandleGridRowSelectionChange(objGrid, objRecord, intRecordIndex, arrSelectedRecords, jsonData);
				},
				'gridRowActionClick' : function(grid, rowIndex, columnIndex, strAction, record, event) {
					me.doHandleRowIconClick(grid, rowIndex, columnIndex, strAction, event, record);
				},
				'groupActionClick' : function(actionName, isGroupAction, maskPosition, grid, arrSelectedRecords) {
					me.handleGroupActions(actionName, null, 'groupAction', null);
				}
			},
			'paymentInstQuerySummaryView paymentInstQueryFilterView' : {
				'render' : function() {
					var statusCode = me.objPrefJson
							? me.objPrefJson.statusCode
							: null;
					me.setInfoTooltip();
					me.readAllAdvancedFilterCode();
				},
				'quickFilterChange' : function(filterJson) {
					me.advFilterData = [];
					me.setpaymentPref();
				   	me.setDataForQuickFilter(filterJson);
					if (me.getSummaryView()) {
						me.getSummaryView().setLoading(true);
					}
					me.setDataForQuickFilter(me.filterData);
					if (me.getSummaryView()) {
						me.getSummaryView().setLoading(true);
					}
					me.handleGridReconfigure();
					me.updateConfig();
					me.toggleSavePrefrenceAction(true);
					me.updateAdvActionToolbar();
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
                    if (me.getSummaryView())
                        me.getSummaryView().setLoading(true);
                    me.handleGridReconfigure();
                    me.updateConfig();
                    me.toggleSavePrefrenceAction(true);
                    me.updateAdvActionToolbar();
                }
			},
			'paymentInstQuerySummaryView paymentInstQueryFilterView  panel[itemId="advFilterPanel"]  button[itemId="newFilter"]' : {
				'click' : function(btn, opts) {
					me.showAdvanceFilterPopup();
				}
			},
			'paymentInstQueryAdvFilterPopup paymentInstQueryCreateNewAdvFilter' : {
			     render : function() {
                    $('#creationDateAdvFilterPicker').datepick({
                        monthsToShow : 1,
                        changeMonth : true,
                        changeYear : true,
                        dateFormat : strApplicationDateFormat,
                        rangeSeparator : ' to ',
                        onClose : function(dates) {
                            if (!Ext.isEmpty(dates)) {
                                me.datePickerSelectedDate = dates;
                                me.datePickerSelectedRequestDate = dates;
                                me.dateFilterVal = '13';
                                me.dateFilterLabel = getDateIndexLabel(me.dateFilterVal);
                                me.handleDateChange(me.dateFilterVal,'creationDateAdvFilter');
                            }
                        }
                    });
                    $('#debitDateFilterPicker').datepick({
                        monthsToShow : 1,
                        changeMonth : true,
                        changeYear : true,
                        dateFormat : strApplicationDateFormat,
                        rangeSeparator : ' to ',
                        onClose : function(dates) {
                            if (!Ext.isEmpty(dates)) {
                                me.datePickerSelectedDate = dates;
                                me.datePickerSelectedRequestDate = dates;
                                me.dateFilterVal = '13';
                                me.dateFilterLabel = getDateIndexLabel(me.dateFilterVal);
                                me.handleDateChange(me.dateFilterVal,'debitDateFilter');
                            }
                        }
                    });
                    $('#effectiveDateFilterPicker').datepick({
                        monthsToShow : 1,
                        changeMonth : true,
                        changeYear : true,
                        dateFormat : strApplicationDateFormat,
                        rangeSeparator : ' to ',
                        onClose : function(dates) {
                            if (!Ext.isEmpty(dates)) {
                                me.datePickerSelectedDate = dates;
                                me.datePickerSelectedRequestDate = dates;
                                me.dateFilterVal = '13';
                                me.dateFilterLabel = getDateIndexLabel(me.dateFilterVal);
                                me.handleDateChange(me.dateFilterVal,'effectiveDateFilter');
                            }
                        }
                    });
                    $('#processingDateFilterPicker').datepick({
                        monthsToShow : 1,
                        changeMonth : true,
                        changeYear : true,
                        dateFormat : strApplicationDateFormat,
                        rangeSeparator : ' to ',
                        onClose : function(dates) {
                            if (!Ext.isEmpty(dates)) {
                                me.datePickerSelectedDate = dates;
                                me.datePickerSelectedRequestDate = dates;
                                me.dateFilterVal = '13';
                                me.dateFilterLabel = getDateIndexLabel(me.dateFilterVal);
                                me.handleDateChange(me.dateFilterVal,'processingDateFilter');
                            }
                        }
                    });
                    $('#instrumentDateFilterPicker').datepick({
                        monthsToShow : 1,
                        changeMonth : true,
                        changeYear : true,
                        dateFormat : strApplicationDateFormat,
                        rangeSeparator : ' to ',
                        onClose : function(dates) {
                            if (!Ext.isEmpty(dates)) {
                                me.datePickerSelectedDate = dates;
                                me.datePickerSelectedRequestDate = dates;
                                me.dateFilterVal = '13';
                                me.dateFilterLabel = getDateIndexLabel(me.dateFilterVal);
                                me.handleDateChange(me.dateFilterVal,'instrumentDateFilter');
                            }
                        }
                    });
                    $('#liqDateDateFilterPicker').datepick({
                        monthsToShow : 1,
                        changeMonth : true,
                        changeYear : true,
                        dateFormat : strApplicationDateFormat,
                        rangeSeparator : ' to ',
                        onClose : function(dates) {
                            if (!Ext.isEmpty(dates)) {
                                me.datePickerSelectedDate = dates;
                                me.datePickerSelectedRequestDate = dates;
                                me.dateFilterVal = '13';
                                me.dateFilterLabel = getDateIndexLabel(me.dateFilterVal);
                                me.handleDateChange(me.dateFilterVal,'liqDateDateFilter');
                            }
                        }
                    });
                    $('#requestDateAdvFilterPicker').datepick({
                        monthsToShow : 1,
                        changeMonth : true,
                        changeYear : true,
                        dateFormat : strApplicationDateFormat,
                        rangeSeparator : ' to ',
                        onClose : function(dates) {
                            if (!Ext.isEmpty(dates)) {
                                me.datePickerSelectedDate = dates;
                                me.datePickerSelectedRequestDate = dates;
                                me.dateFilterVal = '13';
                                me.dateFilterLabel = getDateIndexLabel(me.dateFilterVal);
                                me.handleDateChange(me.dateFilterVal,'requestDateAdvFilter');
                            }
                        }
                    });
                    me.handleDateChange(me.dateFilterVal,'creationDateAdvFilter');
                },
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
			'paymentInstQueryAdvFilterPopup paymentInstQueryAdvFilterGridView' : {
				'orderUpEvent' : me.orderUpDown,
				'deleteFilterEvent' : me.deleteFilterSet,
				'viewFilterEvent' : me.viewFilterData,
				'editFilterEvent' : me.editFilterData,
				'filterSearchEvent' : me.searchFilterData
			},
			'paymentInstQuerySummaryView paymentInstQueryFilterView button[itemId="btnSavePreferences"]' : {
				click : function(btn, opts) {
					me.toggleSavePrefrenceAction(false);
					me.handleSavePreferences();
				}
			},
			'paymentInstQuerySummaryView paymentInstQueryFilterView button[itemId="btnClearPreferences"]' : {
				click : function(btn, opts) {
					me.toggleClearPrefrenceAction(false);
					me.handleClearPreferences();
				}
			},'paymentInstQuerySummaryView paymentInstQueryFilterView component[itemId="paymentRequestDataPicker"]' : {
                render : function() {
                    $('#creationDateFilterPicker').datepick({
                        monthsToShow : 1,
                        changeMonth : true,
                        changeYear : true,
                        dateFormat : strApplicationDateFormat,
                        rangeSeparator : ' to ',
                        onClose : function(dates) {
                            if (!Ext.isEmpty(dates)) {
                                me.datePickerSelectedDate = dates;
                                me.datePickerSelectedRequestDate = dates;
                                me.dateFilterVal = '13';
                                me.dateFilterLabel = getDateIndexLabel(me.dateFilterVal);
                                me.handleDateChange(me.dateFilterVal,'creationDateFilter');
                            }
                        }
                    });
                    me.handleDateChange(me.dateFilterVal,'creationDateFilter');
                }
            }
		});
	},
	doHandleGroupTabChange : function(groupInfo, subGroupInfo, tabPanel,
			newCard, oldCard) {
		var me = this;
		var objGroupView = me.getPaymentInstQueryGridView();
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
			}
		});
		Ext.Function.bind(fnCallBack, me);
						if (fnCallBack)
							fnCallBack(data, args);
	},
	postHandleDoHandleGroupTabChange : function(data, args) {
		var me = args.scope;
		var objPref = null, gridModel = null, intPgSize = null, showPager = true, heightOption = null;
		var colModel = null, arrCols = null;
		var objGroupView = me.getPaymentInstQueryGroupView();
		var objGridView = me.getPaymentInstQueryGridView();
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
	createPrefInstance : function() {
		var me = this;
		me.preferenceHandler = Ext.create('Ext.ux.gcp.PreferencesHandler');
	},
	updateConfig : function() {
		var me = this;
		var filterView = me.getPaymentInstQueryFilterView();
		if(!Ext.isEmpty(clientAutoCompleter))
			me.resetClientFilterField();
		if (filterView)
			filterView.highlightSavedFilter("");
		if (!Ext.isEmpty(objPaymentInstQueryPref)) {
			var objJsonData = Ext.decode(objPaymentInstQueryPref);
			var objPref = objJsonData.d.preferences[me.processingQueueTypeCode];
			var clientAutoCompleter = me.getFilterUpperPanel();
			if (!Ext.isEmpty(objPref)) {
				objPref = objPref[0].jsonPreferences.quickFilter;
				if (objPref) {
					strSeller = objPref['sellerCode'] || strSeller;
					strClient = objPref['clientCode'] || strClient;
					strClientDesc = objPref['clientDesc'] || strClientDesc;
					dtCreationDateFrom = objPref['creationDate1'] || dtApplicationDate;
					dtCreationDateTo = objPref['creationDate2'] || dtApplicationDate;
					me.setDataForQuickFilter(objPref);
					me.filterData = objPref;
					me.objPrefJson = objPref;
					if (!Ext.isEmpty(clientAutoCompleter))
						clientAutoCompleter.down('AutoCompleter[itemId="bankProcessingQueueClientId"]').setValue(
								strClientDesc);
				}
				var filterCode = objJsonData.d.preferences[me.processingQueueTypeCode][0].jsonPreferences.advFilterCode;
				if (!Ext.isEmpty(filterCode)) {
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
		clientAutocompleter.clearValue();
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
			selectedEntryDate = objPref['creationDate2'] || {'operator': "eq" ,'fromDate':dtApplicationDate}; 
			me.setDataForQuickFilter(objPref);
			me.objPrefJson = objPref;
			me.preferenceHandler.setLocalPreferences(me.strPrefPageKey, null);
		}
	},
	doSavePreferenceToLocale : function() {
		var me = this, filter = me.getPaymentInstQueryFilterView(), data = null;
		data = filter.getQuickFilterJSON(me.processingQueueTypeCode);
		me.preferenceHandler.setLocalPreferences(me.strPrefPageKey, data);
	},
	handleGridReconfigure : function() {
		var me = this;
		var gridView = null;
		gridView = me.getPaymentInstQueryGridView();
		gridView.reconfigureGroup(me.processingQueueTypeCode);
	},
	handleLoadGridData : function(grid, url, pgSize, newPgNo, oldPgNo, sorter) {
		var me = this, summaryView = me.getSummaryView(), groupView = me
				.getPaymentInstQueryGroupView();
		if(allowLocalPreference === 'Y' && !me.firstLoad)
			me.handleSaveLocalStorage();
		var strUrl = url;
		var columns=grid.columns;
		Ext.each(columns, function(col) {
	        if(col.dataIndex=="statusDesc" ){
	        	col.sortable=false;
	        }
        });
		me.setDataForQuickFilter(me.objPrefJson);
		me.objPrefJson = null;
		me.firstLoad = false;
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
		var groupView = me.getPaymentInstQueryGroupView();

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
		if (actionName === 'btnView') {
			//me.doSavePreferenceToLocale();
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
		form.appendChild(me.createFormField('INPUT', 'HIDDEN',csrfTokenName, csrfTokenValue));
		form.appendChild(me.createFormField('INPUT', 'HIDDEN', 'txtPirNumber', formData.strPhdnumber));
		form.appendChild(me.createFormField('INPUT', 'HIDDEN', 'txtIdentifier', formData.strIdentifier));
		form.appendChild(me.createFormField('INPUT', 'HIDDEN', 'txtQueueType', me.processingQueueTypeCode));
		form.appendChild(me.createFormField('INPUT', 'HIDDEN', 'txtProduct', formData.strProduct));
		form.appendChild(me.createFormField('INPUT', 'HIDDEN', 'txtInternalTxnNmbr', formData.strInternalTxnNmbr));
		if(!Ext.isEmpty(formData.strQueueSubType)) {
			form.appendChild(me.createFormField('INPUT', 'HIDDEN', 'txtQueueSubType', formData.strQueueSubType));
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
	getFilterUrl : function() {
		var me = this;
		var strQuickFilterUrl = '', strActionStatusUrl = '', strAdvancedFilterUrl = '', strUrl = '', isFilterApplied = false;
		strQuickFilterUrl = me.generateUrlWithQuickFilterParams(me);
		if (!Ext.isEmpty(strQuickFilterUrl)) {
			strUrl = strQuickFilterUrl;
			isFilterApplied = true;
		}
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
		var isCreationDateIncludedInQuick = false;
		var filterData = thisClass.advFilterData;
		var isFilterApplied = false;
		var isOrderByApplied = false;
		var strFilter = '';
		var strTemp = '';
		var strFilterParam = '';
		var operator = '';
		var isInCondition = false;
		quickFilter.forEach(function(filterItem) {
			if(filterItem.paramName === 'clientName') {
				isClientIncludedInQuick = true;
			}
			if(filterItem.paramName === 'creationDate') {
				isCreationDateIncludedInQuick = true;
			}
		});
		if (!Ext.isEmpty(filterData)) {
			for (var index = 0; index < filterData.length; index++) {
				if ((!isClientIncludedInQuick || filterData[index].field !== 'clientName')
			                            && (!isCreationDateIncludedInQuick || filterData[index].field !== 'creationDate')) {
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
									strTemp = strTemp + ' or ';
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
        var currentPage = 1, strExtension = '', strUrl = '', strSelect = '', viscols, col = null, visColsStr = "", colMap = new Object(), colArray = new Array(), strQuickFilterUrl = null;
        var arrExtension = {
            downloadXls : 'xls',
            downloadCsv : 'csv',
            processingQReportPdf : 'pdf',
            downloadTsv : 'tsv'
        };
        var gridView = me.getPaymentInstQueryGridView();
        var grid = gridView.getGrid();
        strExtension = arrExtension[actionName];
        strUrl = 'services/generatePaymentReport';
        strUrl += '?$skip=1';
        strUrl += "&$batchInstFltr=" + me.processingQueueSourceType;
        strUrl += '&$queueTypeFltr=' + me.processingQueueTypeCode;
        strUrl += me.getFilterUrl();
        strUrl += '&$strExtension=' +strExtension;
        var strOrderBy = me.reportGridOrder;
        if (!Ext.isEmpty(strOrderBy)) {
            var orderIndex = strOrderBy.indexOf('orderby');
            if (orderIndex > 0) {
                strOrderBy = strOrderBy.substring(orderIndex, strOrderBy.length);
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
        form.appendChild(me.createFormField('INPUT', 'HIDDEN', csrfTokenName, csrfTokenValue));
        form.appendChild(me.createFormField('INPUT', 'HIDDEN', 'txtCurrent', currentPage));
        form.action = strUrl;
        document.body.appendChild(form);
        form.submit();
        document.body.removeChild(form);
    },
    showAdvanceFilterPopup : function() {
		var me = this, filter = me.getPaymentInstQueryFilterView();
		var filterDetailsTab = me.getFilterDetailsTab();
		me.filterCodeValue = null;
		var data = filter.getQuickFilterJSON(me.processingQueueTypeCode);
		if (Ext.isEmpty(me.advanceFilterPopup)) {
			me.createAdvanceFilterPopup();
		}
		var objCreateNewFilterPanel = me.getAdvanceFilterPopup().down('paymentInstQueryCreateNewAdvFilter');
		objCreateNewFilterPanel.resetAllFields(objCreateNewFilterPanel);
		me.advanceFilterPopup.sellerVal = data['sellerCode'];
		objCreateNewFilterPanel.enableDisableFields(objCreateNewFilterPanel, false);
		if (filterDetailsTab) {
			filterDetailsTab.setTitle(getLabel('createNewFilter', 'Create New Filter'));
		}
		if(!Ext.isEmpty(data.clientDesc)){
		      objCreateNewFilterPanel.down('combobox[itemId="clientNameFilterItemId"]').setValue(data.clientDesc);
		}
		if(!Ext.isEmpty(data.cwInstNmbr)){
		      objCreateNewFilterPanel.down('textfield[itemId="cwInstNmbrFilterItemId"]').setValue(data.cwInstNmbr);
		}
        var formattedFromDate = $.datepick.formatDate(strApplicationDateFormat, $.datepick.parseDate('yy-mm-dd', data.creationDate.fromDate));
        var formattedToDate = $.datepick.formatDate(strApplicationDateFormat, $.datepick.parseDate('yy-mm-dd', data.creationDate.toDate));
        if (data.creationDate.operator == 'eq') {
             $('#creationDateAdvFilterPicker').datepick('setDate', formattedFromDate);
        } else {
             $('#creationDateAdvFilterPicker').datepick('setDate', [formattedFromDate, formattedToDate]);
        }
		me.getSaveSearchBtn().show();
		me.advanceFilterPopup.show();
		me.advanceFilterPopup.down('tabpanel').setActiveTab(1);
	},
	
	createAdvanceFilterPopup : function() {
		var me = this, filter = me.getPaymentInstQueryFilterView();
		var data = filter.getQuickFilterJSON(me.processingQueueTypeCode);
		me.advanceFilterPopup = Ext.create(
				'GCP.view.PaymentInstQueryAdvFilterPopup', {
					sellerVal : data['sellerCode'],
					queueType : data['queueType']
				});
	},
	getPaymentInstQueryStatusUrl : function() {
		var me = this, filter = me.getPaymentInstQueryFilterView();
		var data = filter.getQuickFilterJSON(me.processingQueueTypeCode);
		var extraFilters = '&$sourceType=' + me.processingQueueSourceType;

		if (data['sellerCode']) {
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
	loadPaymentInstQueryStatus : function(strSelectedStatus) {
		var me = this;
		var filterView = me.getPaymentInstQueryFilterView();
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
			Ext.Ajax.request({
						url : me.strStatusCountUrl + '?&' + me.getPaymentInstQueryStatusUrl(),
						headers: objHdrCsrfParams,
						method : "GET",
						async : false,
						success : function(response) {
							if (!Ext.isEmpty(response.responseText)) {
								var data = Ext.decode(response.responseText);
								var arrItems = [];
								if (data && data.d && data.d.queueCounts)
									arrItems = data.d.queueCounts;
							}

						},
						failure : function(response) {
						}
				});
		}
	},
	setDataForQuickFilter : function(filterJson) {
		var me = this, filter = me.getPaymentInstQueryFilterView(), arrFilter = [];;
		var data = filterJson || filter.getQuickFilterJSON(me.processingQueueTypeCode);
		if (filterJson && !Ext.isEmpty(filterJson[0])) {
			arrFilter = filterJson;
		}
		else {
			if(!data['queueType']){
				data['queueType'] = strPaymentQueueType;
			}
//			arrFilter.push({
//						paramName : 'queueType',
//						paramValue1 : (data['queueType'] || 'V'),
//						operatorValue : 'eq',
//						dataType : 'S'
//					});
//			arrFilter.push({
//						paramName : 'sourceType',
//						paramValue1 : 'B',
//						operatorValue : 'eq',
//						dataType : 'S'
//					});
			if (data['sellerCode'])
				arrFilter.push({
							paramName : 'seller',
							paramValue1 : (data['sellerCode'] || '')
									.toUpperCase(),
							operatorValue : 'eq',
							dataType : 'S'
						});
//			if (data['statusCode']) {
//				arrFilter.push({
//							paramName : 'queueSubType',
//							paramValue1 : (data['statusCode']),
//							operatorValue : 'eq',
//							dataType : 'S'
//						});
//			}
			if (data['clientCode'] || data['clientName'])
				arrFilter.push({
							paramName : 'clientName',
							paramValue1 : encodeURIComponent((data['clientCode'] || '').replace(new RegExp("'", 'g'), "\''")),
							operatorValue : 'lk',
							dataType : 'S'
						});
		    if (!Ext.isEmpty(selectedEntryDate) && !Ext.isEmpty(selectedEntryDate.fromDate)) {
                arrFilter.push({
                            paramName : 'creationDate',
                            paramIsMandatory : true,
                            paramValue1 : selectedEntryDate.fromDate,
                            paramValue2 : selectedEntryDate.toDate,
                            operatorValue : selectedEntryDate.operator,
                            dataType : 'D',
                            paramFieldLable : selectedEntryDate.dateLabel
                        });
            }
            if(!Ext.isEmpty(data['cwInstNmbr'])){
                arrFilter.push({
                        paramName : 'cwInstNmbr',
                        operatorValue : 'eq',
                        paramValue1 : data['cwInstNmbr'],
                });
            }
		}
		me.filterData = arrFilter;
	},
	setDataForAdvanceFilter : function() {
		var me = this;
		var objCreateNewAdvFilter = me.getAdvanceFilterPopup()
				.down('paymentInstQueryCreateNewAdvFilter');
		var objJson = objCreateNewAdvFilter.getAdvancedFilterValueJson(
				me.filterCodeValue, objCreateNewAdvFilter);
		me.advFilterData = objJson.filterBy;
		me.overrideValuesOfQuickFilter(me.advFilterData);
	},
	overrideValuesOfQuickFilter : function(advFilterData) {
		var me = this;
		var sellerCombo = me.getFilterUpperPanel()
				.down('combobox[itemId="paymentInstQuerySellerId"]');
		var clientAutoCompleter = me.getFilterUpperPanel()
				.down('combobox[itemId="bankProcessingQueueClientId"]');
		var instNumberField	= me.getFilterUpperPanel().down('textfield[itemId="cwInstNmbrFilterItemId"]');
		for (var i = 0; i < advFilterData.length; i++) {
			if (advFilterData[i].field === 'seller'
					&& advFilterData[i].value1 != ''
					&& advFilterData[i].value1 != null)
				sellerCombo.setValue(advFilterData[i].value1);
			if (advFilterData[i].field === 'clientName'
					&& advFilterData[i].value1 != ''
					&& advFilterData[i].value1 != null)
				clientAutoCompleter.setValue(advFilterData[i].value1);
			if (advFilterData[i].field === 'creationDate'
				&& advFilterData[i].value1 != ''&& advFilterData[i].value1 != null) {
				   if (!Ext.isEmpty(advFilterData[i].paramFieldLable)) {
                        me.getCreationDateFilterLabel().setText(getLabel('creationDateFilter', 'Request Date') + " (" +advFilterData[i].paramFieldLable + ")");
                   }else{
                        me.getCreationDateFilterLabel().setText(getLabel('creationDateFilter', 'Request Date'));
                   }
                   var formattedFromDate = $.datepick.formatDate(strApplicationDateFormat, $.datepick.parseDate('yy-mm-dd', advFilterData[i].value1));
                   var formattedToDate = $.datepick.formatDate(strApplicationDateFormat, $.datepick.parseDate('yy-mm-dd', advFilterData[i].value2));
                    if (advFilterData[i].operator == 'eq') {
                        $('#creationDateFilterPicker').datepick('setDate', formattedFromDate);
                    } else {
                         $('#creationDateFilterPicker').datepick('setDate', [formattedFromDate, formattedToDate]);
                    }
                    selectedEntryDate = {
                         operator : advFilterData[i].operator,
                         fromDate : advFilterData[i].value1,
                         toDate : advFilterData[i].value2,
                         dateLabel : advFilterData[i].paramFieldLable
                    };
             }
             if(advFilterData[i].field === 'cwInstNmbr'
                    && advFilterData[i].value1 != ''
                    && advFilterData[i].value1 != null) {
                    instNumberField.setValue(advFilterData[i].value1);
             }
		}
	},
	setInfoTooltip : function() {
		var me = this, filter = me.getPaymentInstQueryFilterView(), arrFilter = [];;
		Ext.create('Ext.tip.ToolTip', {
					target : 'imgFilterInfoStdView',
					listeners : {
						'beforeshow' : function(tip) {
							var data = filter.getQuickFilterJSON(me.processingQueueTypeCode);
							var financialInstitutionVal = data['sellerCode'];
							var clientVal = (data['clientCode'] || getLabel(
									'none', 'None'));
							var advfilter = (me.filterCodeValue || getLabel(
									'none', 'None'));
						    var creationDate =  data['creationDate'].fromDate ;
						    if(!Ext.isEmpty(data['creationDate'].toDate)){
						      creationDate = creationDate + " to " + data['creationDate'].toDate;
						    }
						    var cwInstNmbr = (data['cwInstNmbr'] || getLabel(
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
									+ getLabel('creationDateFilter', 'Creation Date')
                                    + ' : '
                                    + creationDate
                                    + '<br/>'
                                    + getLabel('instnmbr', 'Instrument Number')
                                    + ' : '
                                    + cwInstNmbr
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
		var gridView = me.getPaymentInstQueryGridView();
		me.strFilterApplied = 'Q';
		var filterView = me.getPaymentInstQueryFilterView();
		filterView.highlightSavedFilter(null);
		gridView.refreshGroupView();
	},
	closeFilterPopup : function(btn) {
		var me = this;
		var advFilterPopup = me.getAdvanceFilterPopup();
		advFilterPopup.close();
	},
	applyAdvancedFilter : function() {
		var me = this, filter = me.getPaymentInstQueryFilterView();
		var data = filter.getQuickFilterJSON(me.processingQueueTypeCode);
		var objGroupView = me.getPaymentInstQueryGroupView();
		me.strFilterApplied = 'A';
		me.setDataForAdvanceFilter();
		me.handleSaveLocalStorage();
		me.setpaymentPref();
		me.handleGridReconfigure();
		me.updateAdvActionToolbar();
		me.closeFilterPopup();
	},
	handleSaveAndSearchAdvFilter : function(btn) {
		var me = this;
		var objCreateNewFilterPanel = me.getAdvanceFilterPopup()
				.down('paymentInstQueryCreateNewAdvFilter');
		var advGridView = me.getAdvanceFilterPopup()
				.down('paymentInstQueryAdvFilterGridView');
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
				.down('paymentInstQueryCreateNewAdvFilter');
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
		var gridView = me.getAdvFilterGridView();
		var filterView = me.getPaymentInstQueryFilterView();
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
				gridView.loadRawData(arrJson);
				if (filterView) {
					filterView.addAllSavedFilterCodeToView(decodedJson.d.filters);
				}
			},
			failure : function(response) {
			}
		});
	},
	getAllSavedAdvFilterCode : function(panel) {
		var me = this;
		var filterView = me.getPaymentInstQueryFilterView();
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
				if (filterView) {
					filterView.addAllSavedFilterCodeToView(arrFilters);
				}
			},
			failure : function(response) {
				console.log('Bad : Something went wrong with your request');
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
					}
				});
	},
	updateAdvActionToolbar : function() {
		var me = this;
		var filterView = me.getPaymentInstQueryFilterView();
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
				.down('paymentInstQueryCreateNewAdvFilter');
		var filterDetailsTab = me.getFilterDetailsTab();
		filterDetailsTab.setTitle(getLabel('filterDetails', 'Filter Details'));
		objCreateNewFilterPanel.resetAllFields(objCreateNewFilterPanel);
		objCreateNewFilterPanel.enableDisableFields(objCreateNewFilterPanel,
				true);
		var record = grid.getStore().getAt(rowIndex);
		var filterCode = record.data.filterName;
		var objTabPanel = me.getAdvanceFilterPopup().down('tabpanel');
		var applyAdvFilter = false;
		var filterView = me.getPaymentInstQueryFilterView();
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
				fnCallback.call(me, filterCode, responseData, applyAdvFilter);
			},
			failure : function() {
				var errMsg = "";
				Ext.MessageBox.show({
					title : getLabel('lblerror', 'Error'),
					msg : getLabel('lblerrordata', 'Error while fetching data..!'),
					buttons : Ext.MessageBox.OK,
					icon : Ext.MessageBox.ERROR
				});
			}
		});
	},
	editFilterData : function(grid, rowIndex) {
		var me = this;
		var objCreateNewFilterPanel = me.getAdvanceFilterPopup().down('paymentInstQueryCreateNewAdvFilter');
		var filterDetailsTab = me.getFilterDetailsTab();
		filterDetailsTab.setTitle(getLabel('filterDetails', 'Filter Details'));
		var saveSearchBtn = me.getSaveSearchBtn();
		if (saveSearchBtn) {
			saveSearchBtn.show();
		}
		objCreateNewFilterPanel.resetAllFields(objCreateNewFilterPanel);
		objCreateNewFilterPanel.enableDisableFields(objCreateNewFilterPanel, false);
		objCreateNewFilterPanel.removeReadOnly(objCreateNewFilterPanel, false);
		var record = grid.getStore().getAt(rowIndex);
		var filterCode = record.data.filterName;
		objCreateNewFilterPanel.down('textfield[itemId="filterCode"]').setValue(filterCode);
		objCreateNewFilterPanel.down('textfield[itemId="filterCode"]').setDisabled(true);
		var objTabPanel = me.getAdvanceFilterPopup().down('tabpanel');
		var applyAdvFilter = false;
		me.getSaveSearchBtn().show();
		me.filterCodeValue = filterCode;
		me.getSavedFilterData(filterCode, me.populateSavedFilter, applyAdvFilter);
		objTabPanel.setActiveTab(1);
	},
	populateSavedFilter : function(filterCode, filterData, applyAdvFilter) {
		var me = this;
		var objCreateNewFilterPanel = me.getAdvanceFilterPopup()
				.down('paymentInstQueryCreateNewAdvFilter');
		objCreateNewFilterPanel.resetAllFields(objCreateNewFilterPanel);
		objCreateNewFilterPanel.down('textfield[itemId="filterCode"]').setValue(filterCode);
		objCreateNewFilterPanel.down('textfield[itemId="filterCode"]').setDisabled(true);
		var fieldName;
		var fieldOper;
		var fieldVal;
		var fieldType;
		var fieldVal2;
		var fieldObj;
		var currentFilterData = '';
		for (i = 0; i < filterData.filterBy.length; i++) {
			fieldName = filterData.filterBy[i].field;
			fieldOper = filterData.filterBy[i].operator;
			fieldVal = filterData.filterBy[i].value1;
			fieldVal2 = filterData.filterBy[i].value2;
            currentFilterData = filterData.filterBy[i];
			if (fieldName === 'batchReference'
					|| fieldName === 'instAmount' || fieldName === 'cwInstNmbr'
					|| fieldName === 'pirNmbr' || fieldName === 'receiverName'
					|| fieldName === 'utrNmbr')
				fieldType = 'textfield';
			else if (fieldName === 'crossCurrency')
				fieldType = 'radiogroup';
			else if (fieldName === 'paymentPkgName'
					|| fieldName === 'clientName' || fieldName === 'paymentLocation'
					|| fieldName === 'productCode'|| fieldName === 'pickupLocation'
					|| fieldName === 'sendingAcc' || fieldName === 'clientOffice'
					|| fieldName === 'entryBranch' || fieldName === 'printBranch'
					|| fieldName === 'liqBranch' || fieldName === 'cancelBranch' 	
					|| fieldName === 'receiverCode')
				fieldType = 'AutoCompleter';
			else if (  fieldName === 'creationDate'
					|| fieldName === 'processDate'|| fieldName ==='clientDrDate'
					|| fieldName === 'effectiveDate'|| fieldName === 'instDate'
					|| fieldName === 'liqDate'||fieldName === 'requestDate' ){
				fieldType = 'datefield';
		    }
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
			}else if(fieldType == 'datefield'){
			    me.setSavedFilterDates(fieldName, currentFilterData);
			} 				
		    else {
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
			var filterView = me.getPaymentInstQueryFilterView();
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
		me.toggleClearAdvFilterAction(true);
		if (Ext.isEmpty(me.advanceFilterPopup)) {
			me.createAdvanceFilterPopup();
		}
		var objCreateNewFilterPanel = me.getAdvanceFilterPopup()
				.down('paymentInstQueryCreateNewAdvFilter');
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
		var filterView = me.getPaymentInstQueryFilterView();
		var queueType = (me.processingQueueTypeCode != 'CW') ? me.processingQueueTypeCode : 'A';
		var strUrl = Ext.String.format(me.strReadAllAdvancedFilterCodeUrl, queueType);
		Ext.Ajax.request({
					url :  strUrl + "?&"
							+ csrfTokenName + "=" + csrfTokenValue,
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
		filterDetailsTab = me.getFilterDetailsTab();
		filterDetailsTab.setTitle(getLabel('filterDetails', 'Filter Details'));
	},
	handleClearPreferences : function() {
		var me = this;
		me.toggleSavePrefrenceAction(false);
		var arrPref = me.getPreferencesToSave(false);
		var objGroupView =  me.getPaymentInstQueryGroupView();
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
		var groupView = me.getPaymentInstQueryGroupView();
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
		var filter = me.getPaymentInstQueryFilterView();
		var data = filter.getQuickFilterJSON(me.processingQueueTypeCode);
		var advFilterCode = me.filterCodeValue ? me.filterCodeValue : '';
		var paymentInstQueryGroupView = me.getPaymentInstQueryGroupView();
		var state = paymentInstQueryGroupView.getGroupViewState();
		var groupInfo = paymentInstQueryGroupView.getGroupInfo() || '{}';
		var subGroupInfo = paymentInstQueryGroupView.getSubGroupInfo() || {};
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
	setpaymentPref : function() {
		var me = this;
		var paymentInstQueryGroupView = me
				.getPaymentInstQueryGroupView();
		var state = paymentInstQueryGroupView
				.getGroupViewState();
		paymentPref = state.grid.columns;
	},
	resetQuickFilter : function() {
	    var me = this;
        me.getFilterUpperPanel().down('combobox[itemId=\'paymentInstQuerySellerId\']').setValue(strSeller);
        me.getFilterUpperPanel().down('combobox[itemId=\'bankProcessingQueueClientId\']').setValue('');
        me.getFilterUpperPanel().down('textfield[itemId="cwInstNmbrFilterItemId"]').setValue('');
        me.handleDateChange(defaultDateIndex,'creationDateFilter');
    },
    handleDateChange : function(index,filterType) {
        var datePickerRef = $('#'+filterType+'Picker');
        var me = this,dateToField;
        var objDateParams = me.getDateParam(index);
        if (!Ext.isEmpty(me.dateFilterLabel)) {
            var filterOperator = objDateParams.operator;
            var vFromDate = $.datepick.formatDate(strApplicationDateFormat, $.datepick.parseDate('yy-mm-dd', objDateParams.fieldValue1));
            var vToDate = $.datepick.formatDate(strApplicationDateFormat, $.datepick.parseDate('yy-mm-dd', objDateParams.fieldValue2));
            if (index == '13') {
                if (objDateParams.operator == 'eq') {
                    datePickerRef.datepick('setDate', vFromDate);
                } else {
                    datePickerRef.datepick('setDate', [vFromDate, vToDate]);
                }
            }
            else {
                if (index === '1' || index === '2') {
                    datePickerRef.datepick('setDate', vFromDate);
                } else {
                    datePickerRef.datepick('setDate', [vFromDate, vToDate]);
                }
            }
            if (filterOperator == 'eq')
                dateToField = "";
            else
                dateToField = objDateParams.fieldValue2;
            me.setSelectedFilterDateAndLbl(filterType,filterOperator,objDateParams,dateToField);
        }
    }, getDateParam : function(index) {
        var me = this;
        var objDateHandler = me.dateHandler;
        var strAppDate = dtApplicationDate;
        var dtFormat = strExtApplicationDateFormat;
        var date = new Date(Ext.Date.parse(strAppDate, dtFormat));
        var strSqlDateFormat = 'Y-m-d';
        var fieldValue1 = '', fieldValue2 = '', operator = '',label = '';
        var retObj = {};
        var dtJson = {};
        switch (index) {
            case '1' :
                // Today
                fieldValue1 = Ext.Date.format(date, strSqlDateFormat);
                fieldValue2 = fieldValue1;
                operator = 'eq';
                label = getDateIndexLabel(index);
                break;
            case '2' :
                // Yesterday
                fieldValue1 = Ext.Date.format(objDateHandler.getYesterdayDate(date), strSqlDateFormat);
                fieldValue2 = fieldValue1;
                operator = 'eq';
                label = getDateIndexLabel(index);
                break;
            case '3' :
                // This Week
                dtJson = objDateHandler.getThisWeekToDate(date);
                fieldValue1 = Ext.Date.format(dtJson.fromDate, strSqlDateFormat);
                fieldValue2 = Ext.Date.format(dtJson.toDate, strSqlDateFormat);
                operator = 'bt';
                label = getDateIndexLabel(index);
                break;
            case '4' :
                // Last Week To Date
                dtJson = objDateHandler.getLastWeekToDate(date);
                fieldValue1 = Ext.Date.format(dtJson.fromDate, strSqlDateFormat);
                fieldValue2 = Ext.Date.format(dtJson.toDate, strSqlDateFormat);
                operator = 'bt';
                label = getDateIndexLabel(index);
                break;
            case '5' :
                // This Month
                dtJson = objDateHandler.getThisMonthToDate(date);
                fieldValue1 = Ext.Date.format(dtJson.fromDate, strSqlDateFormat);
                fieldValue2 = Ext.Date.format(dtJson.toDate, strSqlDateFormat);
                operator = 'bt';
                label = getDateIndexLabel(index);
                break;
            case '6' :
                // Last Month To Date
                dtJson = objDateHandler.getLastMonthToDate(date);
                fieldValue1 = Ext.Date.format(dtJson.fromDate, strSqlDateFormat);
                fieldValue2 = Ext.Date.format(dtJson.toDate, strSqlDateFormat);
                operator = 'bt';
                label = getDateIndexLabel(index);
                break;
            case '8' :
                // This Quarter
                dtJson = objDateHandler.getQuarterToDate(date);
                fieldValue1 = Ext.Date.format(dtJson.fromDate, strSqlDateFormat);
                fieldValue2 = Ext.Date.format(dtJson.toDate, strSqlDateFormat);
                operator = 'bt';
                label = getDateIndexLabel(index);
                break;
            case '9' :
                // Last Quarter To Date
                dtJson = objDateHandler.getLastQuarterToDate(date);
                fieldValue1 = Ext.Date.format(dtJson.fromDate, strSqlDateFormat);
                fieldValue2 = Ext.Date.format(dtJson.toDate, strSqlDateFormat);
                operator = 'bt';
                label = getDateIndexLabel(index);
                break;
            case '10' :
                // This Year
                dtJson = objDateHandler.getYearToDate(date);
                fieldValue1 = Ext.Date.format(dtJson.fromDate, strSqlDateFormat);
                fieldValue2 = Ext.Date.format(dtJson.toDate, strSqlDateFormat);
                operator = 'bt';
                label = getDateIndexLabel(index);
                break;
            case '11' :
                // Last Year To Date
                dtJson = objDateHandler.getLastYearToDate(date);
                fieldValue1 = Ext.Date.format(dtJson.fromDate, strSqlDateFormat);
                fieldValue2 = Ext.Date.format(dtJson.toDate, strSqlDateFormat);
                operator = 'bt';
                label = getDateIndexLabel(index);
                break;
             case '14' :
                // Last Month only
                dtJson = objDateHandler.getLastMonthStartAndEndDate(date);
                fieldValue1 = Ext.Date.format(dtJson.fromDate, strSqlDateFormat);
                fieldValue2 = Ext.Date.format(dtJson.toDate, strSqlDateFormat);
                operator = 'bt';
                label = getDateIndexLabel(index);
                break;
             case '13' :
                 // Date Range
                 if (!isEmpty(me.datePickerSelectedDate)) {
                        if (me.datePickerSelectedDate.length == 1) {
                            fieldValue1 = Ext.Date.format(me.datePickerSelectedDate[0], strSqlDateFormat);
                            fieldValue2 = fieldValue1;
                            operator = 'eq';
                            label = getDateIndexLabel(index);
                        } else if (me.datePickerSelectedDate.length == 2) {
                            fieldValue1 = Ext.Date.format(me.datePickerSelectedDate[0], strSqlDateFormat);
                            fieldValue2 = Ext.Date.format(me.datePickerSelectedDate[1], strSqlDateFormat);
                            operator = 'bt';
                            label = getDateIndexLabel(index);
                        }
                    }
                 break;
             case '12' :
                 // Latest
                    var fromDate = new Date(Ext.Date.parse(latestFromDate, dtFormat));
                    var toDate = new Date(Ext.Date.parse(latestToDate, dtFormat));
                    fieldValue1 = Ext.Date.format(fromDate, strSqlDateFormat);
                    fieldValue2 = Ext.Date.format(toDate, strSqlDateFormat);
                    operator = 'bt';
                    label = getDateIndexLabel(index);
                    break;
        }
        retObj.fieldValue1 = fieldValue1;
        retObj.fieldValue2 = fieldValue2;
        retObj.operator = operator;
        retObj.label = label;
        return retObj;
    },setSelectedFilterDateAndLbl : function(filterType,filterOperator,objDateParams,dateToField){
        var me = this;
        me.updateToolTip(filterType,  " (" + objDateParams.label + ")");
        if('creationDateAdvFilter' === filterType){
            selectedCreationDateAdv = {
            operator : filterOperator,
            fromDate : objDateParams.fieldValue1,
            toDate : dateToField,
            paramFieldLable : objDateParams.label
         };
         me.getCreationDateAdvFilterLabel().setText(getLabel(filterType, 'Creation Date') + " (" + objDateParams.label + ")");
        }else if('creationDateFilter' === filterType){
            selectedEntryDate = {
            operator : filterOperator,
            fromDate : objDateParams.fieldValue1,
            toDate : dateToField,
            dateLabel : objDateParams.label
         };
          me.getCreationDateFilterLabel().setText(getLabel(filterType, 'Creation Date') + " (" + objDateParams.label + ")");
        }
        else if('debitDateFilter' === filterType){
            selectedDebitDate = {
            operator : filterOperator,
            fromDate : objDateParams.fieldValue1,
            toDate : dateToField,
            paramFieldLable : objDateParams.label
         };
         me.getDebitDateFilterLabel().setText(getLabel(filterType, 'Debit Date') + " (" + objDateParams.label + ")");
        }
        else if('effectiveDateFilter' === filterType){
            selectedEffectiveDate = {
            operator : filterOperator,
            fromDate : objDateParams.fieldValue1,
            toDate : dateToField,
            paramFieldLable :objDateParams.label
         };
          me.getEffectiveDateFilterLabel().setText(getLabel(filterType, 'Effective Date') + " (" + objDateParams.label + ")");
        }
        else if('processingDateFilter' === filterType){
            selectedProcessingDate = {
            operator : filterOperator,
            fromDate : objDateParams.fieldValue1,
            toDate : dateToField,
            paramFieldLable : objDateParams.label
         };
         me.getProcessingDateFilterLabel().setText(getLabel(filterType, 'Processing Date') + " (" + objDateParams.label + ")");
        }
        else if('instrumentDateFilter' === filterType){
            selectedInstrumentDate = {
            operator : filterOperator,
            fromDate : objDateParams.fieldValue1,
            toDate : dateToField,
            paramFieldLable : objDateParams.label
         };
         me.getInstrumentDateFilterLabel().setText(getLabel(filterType, 'Instrument Date') + " (" + objDateParams.label + ")");
        }
        else if('liqDateDateFilter' === filterType){
            selectedLiqDate = {
            operator : filterOperator,
            fromDate : objDateParams.fieldValue1,
            toDate : dateToField,
            paramFieldLable : objDateParams.label
         };
          me.getLiqDateDateFilterLabel().setText(getLabel(filterType, 'Liquidation Date') + " (" + objDateParams.label + ")");
        }
        else if('requestDateAdvFilter' === filterType){
            selectedRequestDate = {
            operator : filterOperator,
            fromDate : objDateParams.fieldValue1,
            toDate : dateToField,
            paramFieldLable : objDateParams.label
         };
          me.getRequestAdvFilterDateLabel().setText(getLabel(filterType, 'Request Date') + " (" + objDateParams.label + ")");
        }

    },setSavedFilterDates : function(fieldName, data) {
        if (!Ext.isEmpty(fieldName) && !Ext.isEmpty(data)) {
            var me = this;
            var dateFilterRefFrom = null;
            /* var dateFilterRefTo = null; */
            var formattedFromDate, fromDateVal, toDateVal, formattedToDate;
            var dateOperator = data.operator;
            var label =data.paramFieldLable;
            fromDateVal = data.value1;
            toDateVal = data.value2;
            formattedFromDate = $.datepick.formatDate(strApplicationDateFormat, $.datepick.parseDate('yy-mm-dd', fromDateVal));
            formattedToDate = $.datepick.formatDate(strApplicationDateFormat, $.datepick.parseDate('yy-mm-dd', toDateVal));
            if (fieldName === 'creationDate') {
                selectedCreationDateAdv = {
                    operator : dateOperator,
                    fromDate : fromDateVal,
                    toDate : toDateVal,
                    paramFieldLable :label
                };
                dateFilterRefFrom = $('#creationDateAdvFilterPicker');
                if (!Ext.isEmpty(label)) {
                    me.getCreationDateAdvFilterLabel().setText(getLabel('creationDateAdvFilter', 'Creation Date') + " (" + label + ")");
                    me.updateToolTip('creationDateAdvFilter',  " (" + label + ")");
                }else{
                      me.getCreationDateAdvFilterLabel().setText(getLabel('creationDateAdvFilter', 'Creation Date'));
                }
            }else if (fieldName === 'clientDrDate') {
                selectedCreationDateAdv = {
                    operator : dateOperator,
                    fromDate : fromDateVal,
                    toDate : toDateVal,
                    paramFieldLable :label
                };
                dateFilterRefFrom = $('#debitDateFilterPicker');
                if (!Ext.isEmpty(label)) {
                    me.getCreationDateFilterLabel().setText(getLabel('debitDateFilter', 'Debit Date') + " (" + label + ")");
                    me.updateToolTip('debitDateFilter',  " (" + label + ")");
                }else{
                    me.getCreationDateFilterLabel().setText(getLabel('debitDateFilter', 'Debit Date'));
                }
            }
             else if (fieldName === 'effectiveDate') {
                selectedEffectiveDate = {
                    operator : dateOperator,
                    fromDate : fromDateVal,
                    toDate : toDateVal,
                    paramFieldLable :label
                };
                dateFilterRefFrom = $('#effectiveDateFilterPicker');
                if (!Ext.isEmpty(label)) {
                    me.getEffectiveDateFilterLabel().setText(getLabel('effectiveDateFilter', 'Effective Date') + " (" + label + ")");
                    me.updateToolTip('effectiveDateFilter',  " (" + label + ")");
                }else{
                    me.getEffectiveDateFilterLabel().setText(getLabel('effectiveDateFilter', 'Effective Date'));
                }
            }else if (fieldName === 'processDate') {
                selectedProcessingDate = {
                    operator : dateOperator,
                    fromDate : fromDateVal,
                    toDate : toDateVal,
                    paramFieldLable :label
                };
                dateFilterRefFrom = $('#processingDateFilterPicker');
                if (!Ext.isEmpty(label)) {
                    me.getProcessingDateFilterLabel().setText(getLabel('processingDateFilter', 'Processing Date') + " (" + me.dateFilterLabel + ")");
                    me.updateToolTip('processingDateFilter',  " (" + label + ")");
                }else{
                    me.getProcessingDateFilterLabel().setText(getLabel('processingDateFilter', 'Processing Date'));
                }
            }else if (fieldName === 'instDate') {
                selectedInstrumentDate = {
                    operator : dateOperator,
                    fromDate : fromDateVal,
                    toDate : toDateVal,
                    paramFieldLable :label
                };
                dateFilterRefFrom = $('#instrumentDateFilterPicker');
                if (!Ext.isEmpty(label)) {
                    me.getInstrumentDateFilterLabel().setText(getLabel('instrumentDateFilter', 'Instrument Date') + " (" + label + ")");
                    me.updateToolTip('instrumentDateFilter',  " (" + label + ")");
                }else{
                    me.getInstrumentDateFilterLabel().setText(getLabel('instrumentDateFilter', 'Instrument Date'));
                }
            } else if (fieldName === 'liqDate') {
                selectedLiqDate = {
                    operator : dateOperator,
                    fromDate : fromDateVal,
                    toDate : toDateVal,
                    paramFieldLable :label
                };
                dateFilterRefFrom = $('#liqDateDateFilterPicker');
                if (!Ext.isEmpty(label)) {
                    me.getLiqDateDateFilterLabel().setText(getLabel('liqDateDateFilter', 'Liquidation Date') + " (" + label + ")");
                    me.updateToolTip('liqDateDateFilter',  " (" + label + ")");
                }else{
                      me.getLiqDateDateFilterLabel().setText(getLabel('liqDateDateFilter', 'Liquidation Date'));
                }
            }
            else if (fieldName === 'requestDate') {
                selectedRequestDate = {
                    operator : dateOperator,
                    fromDate : fromDateVal,
                    toDate : toDateVal,
                    paramFieldLable :label
                };
                dateFilterRefFrom = $('#requestDateAdvFilterPicker');
                if (!Ext.isEmpty(label)) {
                    me.getRequestAdvFilterDateLabel().setText(getLabel('requestDateAdvFilter', 'Request Date') + " (" + label + ")");
                    me.updateToolTip('requestDateAdvFilter',  " (" + label + ")");
                }else{
                    me.getRequestAdvFilterDateLabel().setText(getLabel('requestDateAdvFilter', 'Request Date'));
                }
            }
            if (dateOperator === 'eq' || dateOperator === 'le') {
                    $(dateFilterRefFrom).val(formattedFromDate);
            }
            else if (dateOperator === 'bt') {
                        $(dateFilterRefFrom).datepick('setDate', [formattedFromDate, formattedToDate]);
            }
        }
    },
    updateToolTip :function (filterType,date_option){
        if(filterType === 'creationDateAdvFilter')
            creation_Adv_date_opt = date_option;
        else if(filterType === 'creationDateFilter')
            creation_date_opt = date_option;
        else if(filterType === 'debitDateFilter')
            debit_date_opt = date_option;
        else if(filterType === 'effectiveDateFilter')
            effecive_date_opt = date_option;
        else if(filterType === 'processingDateFilter')
            process_date_opt = date_option;
        else if(filterType === 'instrumentDateFilter')
            inst_date_opt = date_option;
        else if(filterType === 'liqDateDateFilter')
            liq_date_opt = date_option;
        else if(filterType === 'requestDateAdvFilter')
           request_date_opt = date_option;
    },
    handleSaveLocalStorage : function(){
		var me=this,arrSaveData = [], objSaveState = {}, grid = me.getPaymentInstQueryGridView().getGrid();
		objSaveState['quickFilterJson'] = !Ext.isEmpty(me.filterData) ? me.filterData : {};
		objSaveState['advanceFilterJson']= !Ext.isEmpty(me.advFilterData) ? me.advFilterData : {};
		objSaveState['pageSize'] = grid && !Ext.isEmpty(grid.getPageSize()) ? grid.getPageSize() : null;
		objSaveState['pageNo'] = grid && !Ext.isEmpty(grid.getCurrentPage()) ? grid.getCurrentPage() :  1;
		objSaveState['sorter'] = grid && !Ext.isEmpty(grid.getSortState()) ? grid.getSortState() :  [];
		
		arrSaveData.push({
			"module" : "tempPref",
			"jsonPreferences" : objSaveState
		});
		
		me.saveLocalPref(arrSaveData);
	},
	saveLocalPref : function(objSaveState){
		var me = this, args = {}, strLocalPrefPageName = me.strPrefPageKey + '_TempPref';
		me.preferenceHandler = Ext.create('Ext.ux.gcp.PreferencesHandler');
		if (!Ext.isEmpty(objSaveState)) {
			args['tempPref'] = objSaveState;
			me.preferenceHandler.savePagePreferences(strLocalPrefPageName, objSaveState,me.postHandleSaveLocalPref, args, me, false);
		}
	},
	postHandleSaveLocalPref : function(data, args, isSuccess) {
		var me = this;
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
	updateObjLocalPref : function (data){
		var me = this;
		objSaveLocalStoragePref = Ext.encode(data);
		me.objLocalData = Ext.decode(objSaveLocalStoragePref);
	},
	applyFilterDataInQuickFilter : function(advFilterData) {
		var me = this;
		var sellerCombo = me.getFilterUpperPanel()
				.down('combobox[itemId="paymentInstQuerySellerId"]');
		var clientAutoCompleter = me.getFilterUpperPanel()
				.down('combobox[itemId="bankProcessingQueueClientId"]');
		var instNumberField  = me.getFilterUpperPanel().down('textfield[itemId="cwInstNmbrFilterItemId"]');
		for (var i = 0; i < advFilterData.length; i++) {
			if (advFilterData[i].paramName === 'seller'
					&& advFilterData[i].paramValue1 != ''
					&& advFilterData[i].paramValue1 != null)
				sellerCombo.setValue(advFilterData[i].paramValue1);
			if (advFilterData[i].paramName === 'clientName'
					&& advFilterData[i].paramValue1 != ''
					&& advFilterData[i].paramValue1 != null)
				clientAutoCompleter.setValue(decodeURIComponent(advFilterData[i].paramValue1));
			if (advFilterData[i].paramName === 'creationDate'
				&& advFilterData[i].paramValue1 != ''&& advFilterData[i].paramValue1 != null) {
				if (!Ext.isEmpty(advFilterData[i].paramFieldLable)) {
                    me.getCreationDateFilterLabel().setText(getLabel('creationDateFilter', 'Request Date') + " (" +advFilterData[i].paramFieldLable + ")");
               }else{
                    me.getCreationDateFilterLabel().setText(getLabel('creationDateFilter', 'Request Date'));
               }
               var formattedFromDate = $.datepick.formatDate(strApplicationDateFormat, $.datepick.parseDate('yy-mm-dd', advFilterData[i].paramValue1));
               var formattedToDate = $.datepick.formatDate(strApplicationDateFormat, $.datepick.parseDate('yy-mm-dd', advFilterData[i].paramValue2));
                if (advFilterData[i].operatorValue == 'eq') {
                    $('#creationDateFilterPicker').datepick('setDate', formattedFromDate);
                } else {
                     $('#creationDateFilterPicker').datepick('setDate', [formattedFromDate, formattedToDate]);
                }
                selectedEntryDate = {
                     operator : advFilterData[i].operatorValue,
                     fromDate : advFilterData[i].paramValue1,
                     toDate : advFilterData[i].paramValue2,
                     dateLabel : advFilterData[i].paramFieldLable
                };
			}
			if(advFilterData[i].paramName === 'cwInstNmbr'
                    && advFilterData[i].paramValue1 != ''
                    && advFilterData[i].paramValue1 != null) {
                    instNumberField.setValue(advFilterData[i].paramValue1);
             }
		}
	},
});