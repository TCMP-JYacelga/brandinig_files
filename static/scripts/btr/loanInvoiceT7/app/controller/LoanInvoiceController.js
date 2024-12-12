Ext.define('GCP.controller.LoanInvoiceController', {
	extend : 'Ext.app.Controller',
	requires : ['GCP.view.LoanInvoiceGridView', 'Ext.ux.gcp.PreferencesHandler'],
	views : ['GCP.view.LoanInvoiceView',
			'GCP.view.LoanInvoiceAdvancedFilterPopup',
			'GCP.view.LoanInvoiceViewPayment',
			'GCP.view.LoanInvoicePayPayment', 'GCP.view.LoanInvoiceViewInfo'],
	/**
	 * Array of configs to build up references to views on page.
	 */
	refs : [{
				ref : 'loanInvoiceNewViewRef',
				selector : 'loanInvoiceNewViewType'
			}, {
				ref : 'loanInvoiceNewFilterViewType',
				selector : 'loanInvoiceNewFilterViewType'
			}, {
				ref : 'loanInvoiceNewGridViewRef',
				selector : 'loanInvoiceNewViewType loanInvoiceNewGridViewType'
			}, {
				ref : 'loanInvoiceNewDtlViewRef',
				selector : 'loanInvoiceNewViewType loanInvoiceNewGridViewType panel[itemId="loanInvoiceNewDtlViewItemId"]'
			}, {
				ref : 'loanInvoiceViewPayDtlRef',
				selector : 'loanInvoiceViewPaymentType panel[itemId="loanInvoiceViewPaymentItemId"]'
			}, {
				ref : 'loanInvoiceNewGridRef',
				selector : 'loanInvoiceNewViewType loanInvoiceNewGridViewType grid[itemId="gridViewMstItemId"]'
			}, {
				ref : 'loanInvoiceViewPaymentGridRef',
				selector : 'loanInvoiceViewPaymentType grid[itemId="gridViewPayItemId"]'
			}, {
				ref : 'matchCriteria',
				selector : 'loanInvoiceNewGridViewType radiogroup[itemId="matchCriteria"]'
			}, {
				ref : 'searchTxnTextInput',
				selector : 'loanInvoiceNewGridViewType textfield[itemId="searchTxnTextField"]'
			}, {
				ref : 'actionBarSummDtl',
				selector : 'loanInvoiceNewViewType loanInvoiceNewGridViewType loanInvoiceNewGroupActionBarViewType'
			}, {
				ref : 'btnSavePreferences',
				selector : 'loanInvoiceNewFilterViewType button[itemId="btnSavePreferences"]'
			}, {
				ref : 'btnClearPreferences',
				selector : 'loanInvoiceNewFilterViewType button[itemId="btnClearPreferences"]'
			}, {
				ref : 'fromDateLabel',
				selector : 'loanInvoiceNewFilterViewType label[itemId="dateFilterFrom"]'
			}, {
				ref : 'toDateLabel',
				selector : 'loanInvoiceNewFilterViewType label[itemId="dateFilterTo"]'
			}, {
				ref : 'dateLabel',
				selector : 'loanInvoiceNewFilterViewType label[itemId="dateLabel"]'
			}, {
				ref : 'fromEntryDate',
				selector : 'loanInvoiceNewFilterViewType datefield[itemId="fromDate"]'
			}, {
				ref : 'toEntryDate',
				selector : 'loanInvoiceNewFilterViewType datefield[itemId="toDate"]'
			}, {
				ref : 'dateRangeComponent',
				selector : 'loanInvoiceNewFilterViewType container[itemId="dateRangeComponent"]'
			}, {
				ref : 'loanInvoiceTypeToolBar',
				selector : 'loanInvoiceNewFilterViewType toolbar[itemId="loanInvoiceTypeToolBar"]'
			}, {
				ref : 'entryDate',
				selector : 'loanInvoiceNewFilterViewType button[itemId="entryDate"]'
			}, {
				ref : 'advFilterActionToolBar',
				selector : 'loanInvoiceNewFilterViewType toolbar[itemId="advFilterActionToolBar"]'
			}, {
				ref : 'productActionToolBar',
				selector : 'loanInvoiceNewGridViewType toolbar[itemId="paymentActionToolBar"]'
			}, {
				ref : 'loanInvoiceNewGridInformationViewRef',
				selector : 'loanInvoiceNewGridInformationViewType'
			}, {
				ref : 'infoSummaryLowerPanel',
				selector : 'loanInvoiceNewGridInformationViewType panel[itemId="infoSummaryLowerPanel"]'
			}, {
				ref : 'advanceFilterPopup',
				selector : 'loanInvoiceAdvancedFilterPopupType[itemId="gridViewAdvancedFilter"]'
			}, {
				ref : 'loanInvoiceNewPaymentRef',
				selector : 'loanInvoiceNewPaymentPopupType[itemId="gridNewPayment"]'
			}, {
				ref : 'loanInvoiceViewInfoDtlRef',
				selector : 'loanInvoiceViewInfoType[itemId="viewInfoPopupId"] panel[itemId="loanInvoiceViewInfoItemId"]'
			}, {
				ref : 'loanInvoiceViewInfoRef',
				selector : 'loanInvoiceViewInfoType[itemId="viewInfoPopupId"]'
			}, {
				ref : 'loanInvoiceViewPaymentRef',
				selector : 'loanInvoiceViewPaymentType[itemId="gridViewPayment"]'
			}, {
				ref : 'advanceFilterTabPanel',
				selector : 'loanInvoiceAdvancedFilterPopupType[itemId="gridViewAdvancedFilter"] tabpanel[itemId="advancedFilterTab"] '
			}, {
				ref : 'createNewFilter',
				selector : 'loanInvoiceAdvancedFilterPopupType[itemId="gridViewAdvancedFilter"] loanInvoiceCreateNewAdvFilterType'
			}, {
				ref : 'advFilterGridView',
				selector : 'loanInvoiceAdvancedFilterPopupType[itemId="gridViewAdvancedFilter"] loanInvoiceSummaryAdvFilterGridViewType'
			}, {
				ref : 'saveSearchBtn',
				selector : 'loanInvoiceAdvancedFilterPopupType[itemId="gridViewAdvancedFilter"] loanInvoiceCreateNewAdvFilterType button[itemId="saveAndSearchBtn"]'
			}, {
				ref : 'filterDetailsTab',
				selector : 'loanInvoiceAdvancedFilterPopupType[itemId="gridViewAdvancedFilter"] tabpanel[itemId="advancedFilterTab"] panel[itemId="filterDetailsTab"]'
			}, {
				ref : 'createNewPayment',
				selector : 'loanInvoiceNewPaymentPopupType[itemId="gridNewPayment"] loanInvoiceNewPaymentType'
			}, {
				ref : 'loanAccountLabel',
				selector : 'loanInvoiceNewPaymentPopupType loanInvoiceNewPaymentType label[itemId="loanAccountLbl"]'
			}, {
				ref : 'invoiceLabel',
				selector : 'loanInvoiceNewPaymentPopupType loanInvoiceNewPaymentType label[itemId="invoiceLbl"]'
			}, {
				ref : 'withHeaderCheckbox',
				selector : 'loanInvoiceNewViewType menuitem[itemId="withHeaderId"]'
			}, {
				ref : 'loanCenterInvoiceTabRef',
				selector : 'loanInvoiceNewViewType loanInvoiceTitleViewType button[itemId="loanCenterInvoiceTabItemId"]'
			}, {
				ref : 'groupView',
				selector : 'loanInvoiceNewGridViewType groupView'
			}, {
				ref : 'filterView',
				selector : 'filterView'
			}, {
				ref : 'entryDateLabel',
				selector : 'loanInvoiceNewFilterViewType label[itemId="entryDateLabel"]'
			}],
	config : {
		savePrefAdvFilterCode : null,
		filterCodeValue : null,
		objAdvFilterPopup : null,
		objViewPayPopup : null,
		objNewPayPopup : null,
		objViewInfoPopup : null,
		advFilterCodeApplied : null,
		filterData : [],
		advFilterData : [],
		filterApplied : 'ALL',
		// urlGridPref : 'userpreferences/invoiceGridFilter/gridView.srvc?',
		// urlGridFilterPref :
		// 'userpreferences/invoiceGridFilter/gridViewFilter.srvc?',
		// commonPrefUrl : 'services/userpreferences/invoiceGridFilter.json',
		strGetModulePrefUrl : 'services/userpreferences/invoiceGridFilter/{0}.json',
		showAdvFilterCode : null,
		dateFilterVal : '1',
		dateFilterFromVal : '',
		dateFilterToVal : '',
		datePickerSelectedEffectiveAdvDate : [],
		dateFilterLabel : getLabel('today', 'Today'),
		dateHandler : null,
		clientCode : null,
		clientDesc : '',
		arrSorter : [],
		dateRangeFilterVal : '7',
		datePickerSelectedDate : [],
		reportOrderByURL : null,
		entryDateChanged : false,
		strDefaultMask : '000000000000000000',
		strPageName : 'invoiceGridFilter'
	},
	/**
	 * A template method that is called when your application boots. It is
	 * called before the Application's launch function is executed so gives a
	 * hook point to run any code before your Viewport is created.
	 */
	init : function() {
		var me = this;
		var tbarSubTotal = null;
		var btnClearPref = me.getBtnClearPreferences();
		me.dateHandler = Ext.create('Ext.ux.gcp.DateUtil');
		var date = new Date(Ext.Date.parse(dtApplicationDate,
				strExtApplicationDateFormat));
		clientFromDate = me.dateHandler.getDateBeforeDays(date, filterDays);
		me.updateConfig();
		if (btnClearPref) {
			btnClearPref.setEnabled(false);
		}
		me.objAdvFilterPopup = Ext.create(
				'GCP.view.LoanInvoiceAdvancedFilterPopup', {
					parent : 'loanInvoiceNewViewType',
					itemId : 'gridViewAdvancedFilter',
					filterPanel : {
						xtype : 'loanInvoiceCreateNewAdvFilterType',
						margin : '4 0 0 0',
						callerParent : 'loanInvoiceNewViewType'
					}
				});

		me.objViewPayPopup = Ext.create('GCP.view.LoanInvoiceViewPayment', {
					parent : 'loanInvoiceNewViewType',
					itemId : 'gridViewPayment'

				});
		me.objNewPayPopup = Ext.create('GCP.view.LoanInvoicePayPaymentPopup', {
					parent : 'loanInvoiceNewViewType',
					itemId : 'gridNewPayment'
				});

		me.objViewInfoPopup = Ext.create('GCP.view.LoanInvoiceViewInfo', {
					parent : 'loanInvoiceNewViewType',
					itemId : 'viewInfoPopupId'
				});

		this.dateHandler = Ext.create('Ext.ux.gcp.DateHandler');
		me.updateFilterConfig();
		// me.updateAdvFilterConfig();
		$(document).on('searchActionClicked', function() {
					me.handleSearchActionGridView(me);
				});
		$(document).on('saveAndSearchActionClicked', function() {
					me.handleSaveAndSearchGridAction(me);
				});
		$(document).on('resetAllFieldsEvent', function() {
					me.resetAllFields();
					me.filterCodeValue = null;
				});
		$(document).on('deleteFilterEvent', function(event, filterCode) {
					me.deleteFilterSet(filterCode);
				});
		$(document).on('orderUpGridEvent',
				function(event, grid, rowIndex, direction) {
					me.orderUpDown(grid, rowIndex, direction)
				});
		$(document).on('viewFilterEvent', function(event, grid, rowIndex) {
					me.viewFilterData(grid, rowIndex);
				});
		$(document).on('editFilterEvent', function(event, grid, rowIndex) {
					me.editFilterData(grid, rowIndex);
				});
		$(document).on('performReportAction', function(event, actionName) {
					me.downloadReport(actionName);
				});
		$(document).on('savePreference', function(event) {
					// me.toggleSavePrefrenceAction(false);
					me.handleSavePreferences(event);
				});
		$(document).on('clearPreference', function(event) {
					me.handleClearPreferences(event);
				});
		$(document).off('approvalConfirmed');
		$(document).on('approvalConfirmed', function(eventName, objArgs) {
					var strUrl = objArgs[0];
					var remarks = objArgs[1];
					var arrSelectedRecords = objArgs[2];
					me.preHandleGroupActions(strUrl, remarks,
							arrSelectedRecords);
				});
		$(document).on('handleSavedFilterClick', function(event) {
					me.handleSavedFilterClick();
				});
		$(document).on('performPageSettings', function(event) {
					me.showPageSettingPopup('PAGE');
				});
		$(document).on('filterDateChange',function(event, filterType, btn, opts) {
					if (filterType=="entryDate"){
						 me.paymentDateChange(btn,opts);
					 }
				});
		$(document).on("datePickPopupSelectedDate",
				function(event, filterType, dates) {
						me.dateRangeFilterVal = '13';
						me.datePickerSelectedEffectiveAdvDate = dates;
						me.payDueDateFilterLabel = getLabel('daterange', 'Date Range');
						me.handleAdvPayDueDateChange(me.dateRangeFilterVal);
						entry_date_opt = me.payDueDateFilterLabel;
				});
		me.control({
			'pageSettingPopUp' : {
				'applyPageSetting' : function(popup, data, strInvokedFrom) {
					me.applyPageSetting(data, strInvokedFrom);
				},
				'savePageSetting' : function(popup, data, strInvokedFrom) {
					me.savePageSetting(data, strInvokedFrom);
				},
				'restorePageSetting' : function(popup, strInvokedFrom) {
					me.restorePageSetting();
				}
			},
			'loanInvoiceAdvancedFilterPopupType[itemId="gridViewAdvancedFilter"] loanInvoiceCreateNewAdvFilterType' : {
				closeGridViewFilterPopup : function(btn) {
					me.closeGridViewFilterPopup(btn);
				}
			},
			'loanInvoiceNewPaymentPopupType[itemId="gridNewPayment"] loanInvoiceNewPaymentType' : {
				closeNewPaymentPopup : function(btn) {
					me.closeNewPaymentPopup(btn);
				}
			},
			'loanInvoiceViewPaymentType[itemId="gridViewPayment"]' : {
				closeViewPayPopup : function(btn) {
					me.closeViewPayPopup(btn);
				}
			},
			'loanInvoiceViewInfoType[itemId="viewInfoPopupId"]' : {
				closeViewInfoPopup : function(btn) {
					me.closeViewInfoPopup(btn);
				}
			},
			'loanInvoiceNewFilterViewType component[itemId="pmtDueDataPicker"]' : {
				render : function() {
					$('#entryDataPicker').datepick({
						monthsToShow : 1,
						changeMonth : true,
						changeYear : true,
						rangeSeparator : ' to ',
						minDate:dtHistoryDate,
						onClose : function(dates) {
							if (!Ext.isEmpty(dates)) {
								//me.dateRangeFilterVal = '13';
								var blnDateFilterPresent = false;
								me.datePickerSelectedDate = dates;
								me.dateFilterVal = me.dateRangeFilterVal;
								me.dateFilterLabel = getLabel('daterange',
										'Date Range');
								me.handleDateChange(me.dateRangeFilterVal);
								me.resetSavedFilterCombo();
								me.setDataForFilter();
								
								$.each(me.filterData, function(index, cfgFilter) {
									if(null!=cfgFilter && cfgFilter !=undefined)
									{
										if(null!=cfgFilter && cfgFilter !=undefined)
										{															
											if(cfgFilter.paramName == "dueDate")
											{
												blnDateFilterPresent = true;
											}								
										}
									}
								});		
								if(blnDateFilterPresent)
								{
									$.each(me.advFilterData, function(index, cfgFilter) {
										if(null!=cfgFilter && cfgFilter !=undefined)
										{
											if(null!=cfgFilter && cfgFilter !=undefined)
											{															
												if(cfgFilter.field == "InvoiceDueDate")
												{
													me.advFilterData.splice(index, 1);
												}								
											}
										}
									});			
								}								
								me.applyQuickFilter();
								// me.toggleSavePrefrenceAction(true);
								me.disablePreferencesButton("savePrefMenuBtn",
										false);
							}
						}
					}).attr('readOnly', true);
					
					if (!Ext.isEmpty(me.savedFilterVal) || me.entryDateChanged === true) {
						var entryDateLableVal = $('label[for="entryDateLabel"]').text();
						var entryDateField = $("#paymentDueDateAdv");
						me.handleEntryDateSync('A', entryDateLableVal, null, entryDateField);
					}else{
						me.dateFilterVal = '1';
						me.dateFilterLabel = getDateIndexLabel(me.dateFilterVal);
						me.handleDateChange(me.dateFilterVal);
						me.resetSavedFilterCombo();
						me.setDataForFilter();
						me.applyQuickFilter();
					}
					
				}
			},
			/*
			 * 'loanInvoiceAdvancedFilterPopupType[itemId="gridViewAdvancedFilter"]
			 * loanInvoiceSummaryAdvFilterGridViewType' : { orderUpGridEvent :
			 * me.orderUpDown, deleteGridFilterEvent : me.deleteFilterSet,
			 * viewGridFilterEvent : me.viewFilterData, editGridFilterEvent :
			 * me.editFilterData },
			 */
			'filterView button[itemId="clearSettingsButton"]' : {
				'click' : function() {
					me.handleClearSettings();
				}
			},
			'filterView label[itemId="createAdvanceFilterLabel"]' : {
				'click' : function() {
					showAdvanceFilterPopup();
					me.assignSavedFilter();
				}
			},
			'loanInvoiceNewGridViewType groupView' : {
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
					// me.disablePreferencesButton("savePrefMenuBtn",false);
					// me.disablePreferencesButton("clearPrefMenuBtn",false);
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
					me.disablePreferencesButton("savePrefMenuBtn", false);
				},
				'gridRowActionClick' : function(grid, rowIndex, columnIndex,
						actionName, record) {
					me.doHandleRowActions(actionName, grid, record, rowIndex);
				},
				'groupActionClick' : function(actionName, isGroupAction,
						maskPosition, grid, arrSelectedRecords) {
					if (isGroupAction === true)
						me.handleGroupActions(actionName, grid,
								arrSelectedRecords, 'groupAction');
				},
				'render' : function() {
					populateAdvancedFilterFieldValue();
					me.applyPreferences();
					// if (objDefaultGridViewPref) {
					// var objJsonData = Ext.decode(objDefaultGridViewPref);
					// if (objJsonData.advFilterCode) {
					// me.savedFilterVal = objJsonData.advFilterCode;
					// me.filterCodeValue = objJsonData.advFilterCode;
					// me.doHandleSavedFilterItemClick(me.savedFilterVal);
					// }
					// }
					/*me.firstTime = true;
					if (objInvoicePref) {
						var objJsonData = Ext.decode(objInvoicePref);
						if (!Ext.isEmpty(objJsonData.d.preferences)) {
							if (!Ext
									.isEmpty(objJsonData.d.preferences.GeneralSetting)) {
								if (!Ext
										.isEmpty(objJsonData.d.preferences.GeneralSetting.defaultFilterCode)) {
									var advData = objJsonData.d.preferences.GeneralSetting.defaultFilterCode;
									me.doHandleSavedFilterItemClick(advData);
									me.savedFilterVal = advData;
								}
							}
						}
					}*/
				},
				'gridSettingClick' : function() {
					me.showPageSettingPopup('GRID');
				}
			},
			/*
			 * 'loanInvoiceNewGridViewType smartgrid' : { render : function(
			 * grid ) { me.handleLoadGridData( grid, grid.store.dataUrl,
			 * grid.pageSize, 1, 1, grid.store.sorters ); }, gridPageChange :
			 * me.handleLoadGridData, gridSortChange : me.handleLoadGridData,
			 * gridRowSelectionChange : function( grid, record, recordIndex,
			 * records, jsonData ) { me.enableValidActionsForGrid( grid, record,
			 * recordIndex, records, jsonData ); }, statechange : function(grid) {
			 * me.toggleSavePrefrenceAction(true);
			 * me.toggleClearPrefrenceAction(true); }, pagechange :
			 * function(pager, current, oldPageNum) {
			 * me.toggleSavePrefrenceAction(true);
			 * me.toggleClearPrefrenceAction(true); } },
			 */
			'loanInvoiceNewGridViewType textfield[itemId="searchTxnTextField"]' : {
				change : function(btn, opts) {
					me.searchTrasactionChange();
				}
			},
			'loanInvoiceNewGridViewType radiogroup[itemId="matchCriteria"]' : {
				change : function(btn, opts) {
					me.searchTrasactionChange();
				}
			},
			'loanInvoiceNewViewType loanInvoiceNewGridViewType toolbar[itemId=loanInvoiceNewGroupActionBarView_summDtlItemId]' : {
				performGroupAction : function(btn, opts) {
					me.handleGroupActions(btn);
				}
			},
			'loanInvoiceNewFilterViewType' : {
				render : function(panel, opts) {
					if (!Ext.isEmpty(modelSelectedMst))
						me.selectedMst = modelSelectedMst;
					var useSettingsButton = me.getFilterView()
							.down('button[itemId="useSettingsbutton"]');
					if (!Ext.isEmpty(useSettingsButton)) {
						useSettingsButton.hide();
					}
					me.setInfoTooltip();
				//	me.getAllSavedAdvFilterCode(panel);
				},
				expand : function(panel) {
					me.toggleSavePrefrenceAction(true);
					me.toggleClearPrefrenceAction(true);
				},
				collapse : function(panel) {
					me.toggleSavePrefrenceAction(true);
					me.toggleClearPrefrenceAction(true);
				},
				dateChange : function(btn, opts) {
					var me=this;
					me.dateFilterVal = btn.btnValue;
					me.dateFilterLabel = btn.text;
					me.resetSavedFilterCombo();
					me.handleDateChange(btn.btnValue);

						me.filterApplied = 'Q';
						me.setDataForFilter();
						me.applyQuickFilter();

				},
				handleClientChange : function(clientCode, clientDesc) {
					me.clientCode = clientCode;
					me.clientDesc = clientDesc;
					me.resetSavedFilterCombo();
					me.filterApplied = 'Q';
					me.setDataForFilter();
					me.applyQuickFilter();
					me.disablePreferencesButton("savePrefMenuBtn", false);
					me.disablePreferencesButton("clearPrefMenuBtn", false);
				},
				handleSavedFilterItemClick : function(comboValue, comboDesc) {
					me.savedFilterVal = comboValue;
					me.doHandleSavedFilterItemClick(comboValue);
				},
				afterrender : function(panel, opts) {
					/*
					 * if(me.filterCodeValue != null) {
					 * me.handleFilterItemClick( me.filterCodeValue, null );
					 * panel.highlightSavedFilter(me.filterCodeValue); }
					 */
					me.updateFilterFields();
					// me.handleDateChange(me.dateFilterVal);
				}
			},
			'loanInvoiceNewFilterViewType toolbar[itemId="dateToolBar"]' : {
				afterrender : function(tbar, opts) {
					me.updateDateFilterView();
				}
			},
			'loanInvoiceNewFilterViewType combo[itemId="savedFiltersCombo"]' : {
				'afterrender' : function(combo, newValue, oldValue, eOpts) {
					if (!Ext.isEmpty(me.savedFilterVal)) {
						Ext.Ajax.request({
									url : 'userfilterslist/invoiceGridFilter.srvc',
									headers: objHdrCsrfParams,
									success : function(response) {
										var responseData = Ext.decode(response.responseText);
										var arrFilters = [];
										var filterData = responseData.d.filters;
										if (filterData) {
											arrFilters = filterData;
											if(arrFilters.indexOf(me.savedFilterVal)>-1)
											{
												combo.setValue(me.savedFilterVal);
											}		
										}						
									},
									failure : function(response) {
										console
												.log('Bad : Something went wrong with your request');
									}
								});					
					}
				}
			},
			'loanInvoiceNewFilterViewType button[itemId="goBtn"]' : {
				click : function(btn, opts) {
					var frmDate = me.getFromEntryDate().getValue();
					var toDate = me.getToEntryDate().getValue();

					if (!Ext.isEmpty(frmDate) && !Ext.isEmpty(toDate)) {
						var dtParams = me.getDateParam('7',null);
						me.dateFilterFromVal = dtParams.fieldValue1;
						me.dateFilterToVal = dtParams.fieldValue2;
						me.setDataForFilter();
						me.applyQuickFilter();
						me.toggleSavePrefrenceAction(true);
						me.toggleClearPrefrenceAction(true);
					}
				}
			},
			'loanInvoiceNewViewType loanInvoiceNewGridInformationViewType panel[itemId="loanInvoiceNewSummInfoHeaderBarGridViewItemId"] container[itemId="summInfoShowHideGridView"]' : {
				click : function(image) {
					var objAccSummInfoBar = me.getInfoSummaryLowerPanel();
					if (image.hasCls("icon_collapse_summ")) {
						image.removeCls("icon_collapse_summ");
						image.addCls("icon_expand_summ");
						objAccSummInfoBar.hide();
					} else {
						image.removeCls("icon_expand_summ");
						image.addCls("icon_collapse_summ");
						objAccSummInfoBar.show();
					}
				}
			},
			'loanInvoiceNewGridInformationViewType' : {
				render : this.onLoanInvoiceNewInformationViewRender
			},
			/*'render' : function() {
				populateAdvancedFilterFieldValue();
				me.firstTime = true;
				if (objInvoicePref) {
					var objJsonData = Ext.decode(objInvoicePref);
					if (!Ext.isEmpty(objJsonData.d.preferences)) {
						if (!Ext
								.isEmpty(objJsonData.d.preferences.GeneralSetting)) {
							if (!Ext
									.isEmpty(objJsonData.d.preferences.GeneralSetting.defaultFilterCode)) {
								var advData = objJsonData.d.preferences.GeneralSetting.defaultFilterCode;
								me.doHandleSavedFilterItemClick(advData);
								me.savedFilterVal = advData;
							}
						}
					}
				}
			},*/
			'filterView' : {
				appliedFilterDelete : function(btn) {
					me.resetSavedFilterCombo();
					me.handleAppliedFilterDelete(btn);
				}
			}
		});
		//setStatusDropDownItems("#statusAdv");
	},
	updateConfig : function() {
		var me = this;
		me.dateHandler = Ext.create('Ext.ux.gcp.DateUtil');
		me.preferenceHandler = Ext.create('Ext.ux.gcp.PreferencesHandler');
		// me.disablePreferencesButton("savePrefMenuBtn",false);
		// me.disablePreferencesButton("clearPrefMenuBtn",true);
	},
	doHandleGroupByChange : function(menu, groupInfo) {
		var me = this;
		if (me.previouGrouByCode === 'LONINVOICE_OPT_ADVFILTER') {
			me.savePrefAdvFilterCode = null;
			me.showAdvFilterCode = null;
			me.filterApplied = 'ALL';
		}
		if (groupInfo && groupInfo.groupTypeCode === 'LONINVOICE_OPT_ADVFILTER') {
			me.previouGrouByCode = groupInfo.groupTypeCode;
		}
		// me.previouGrouByCode = null;
	},
	disablePreferencesButton : function(btnId, boolVal) {
		$("#" + btnId).attr("disabled", boolVal);
		if (boolVal) {
			$("#" + btnId).css("color", 'grey');
			$("#" + btnId).css('cursor', 'default').removeAttr('href');
			$("#" + btnId).css('pointer-events', 'none');
		} else {
			$("#" + btnId).css("color", '#FFF');
			$("#" + btnId).css('cursor', 'pointer').attr('href', '#');
			$("#" + btnId).css('pointer-events', 'all');
		}
	},
	updateFilterFields : function() {
		var me = this;
		var clientCodesFltId;
		var loanInvoiceNewFilterViewType = me.getLoanInvoiceNewFilterViewType();
		if (!isClientUser()) {
			clientCodesFltId = loanInvoiceNewFilterViewType
					.down('combobox[itemId=clientAutoCompleter]');
			if (undefined != me.clientCode && me.clientCode != '') {
				clientCodesFltId.suspendEvents();
				clientCodesFltId.setValue(me.clientDesc);
				clientCodesFltId.resumeEvents();
			} else {
				me.clientCode = 'all';
			}

		} else {
			clientCodesFltId = loanInvoiceNewFilterViewType
					.down('combo[itemId="clientCombo"]');
			if (undefined != me.clientCode && me.clientCode != ''
					&& me.clientDesc != '') {
				clientCodesFltId.setRawValue(me.clientDesc);
			} else {
				clientCodesFltId.setRawValue(getLabel('allCompanies',
						'All Companies'));
				me.clientCode = 'all';
			}
		}

		if (me.filterCodeValue != null) {
			var savedFilterCombo = loanInvoiceNewFilterViewType
					.down('combo[itemId="savedFiltersCombo"]');
			savedFilterCombo.setValue(me.filterCodeValue);
		}
		//me.handleDateChange(me.dateFilterVal);
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
			if (groupInfo.groupTypeCode === 'LONINVOICE_OPT_ADVFILTER')
			{
				strFilterCode = subGroupInfo.groupCode;
				if (strFilterCode !== 'all')
				{
					if (!Ext.isEmpty(strFilterCode))
					{
						me.savePrefAdvFilterCode = strFilterCode;
						var savedFiltersComboVal= me.getFilterView().down('combo[itemId="savedFiltersCombo"]');
						savedFiltersComboVal.setRawValue(strFilterCode);									
						me.showAdvFilterCode = strFilterCode;
						me.doHandleSavedFilterItemClick(strFilterCode);
					}
				} else
				{
					me.savePrefAdvFilterCode = null;
					me.showAdvFilterCode = null;
					me.filterApplied = 'ALL';
					me.advFilterData = [];
				}
			}
		}
		if (groupInfo && _charCaptureGridColumnSettingAt === 'L')
		{
			args = {
				scope : me
			};
			strModule = subGroupInfo.groupCode
			strModule = strModule === 'all'? groupInfo.groupTypeCode+'-'+strModule : strModule;
			me.preferenceHandler.readModulePreferences(me.strPageName,strModule,me.postHandleDoHandleGroupTabChange, null, me, false);
		}
		else 
		{	
			me.postHandleDoHandleGroupTabChange();
		}	
	},
	handleClearSettings : function() {
		var me = this;
		var datePickerRef = $('#entryDataPicker');
		var toDatePickerRef = $('#entryDataToPicker');
		var loanInvoiceNewFilterViewType = me.getLoanInvoiceNewFilterViewType();
		if (!isClientUser()) {
			clientFilterId = loanInvoiceNewFilterViewType
					.down('AutoCompleter[itemId="clientAutoCompleter"]');
			me.clientCode = "";
			me.clientDesc = "";
			clientFilterId.suspendEvents();
			clientFilterId.reset();
			clientFilterId.resumeEvents();
		} else {
			clientFilterId = loanInvoiceNewFilterViewType.down('combo[itemId="clientCombo"]');
			me.clientDesc = getLabel('allCompanies', 'All companies');
			me.clientCode = 'all';
			clientFilterId.setRawValue(getLabel('allCompanies', 'All companies'));
		}
		me.dateFilterVal = '1';
		me.savedFilterVal = '';
		var savedFilterComboBox = loanInvoiceNewFilterViewType
				.down('combo[itemId="savedFiltersCombo"]');
		savedFilterComboBox.setValue(me.savedFilterVal);
		me.dateFilterLabel = getLabel('today', 'Today');
		me.handleDateChange(me.dateFilterVal);
		//me.getEntryDateLabel().setText(getLabel('lblPayDueDate','Payment Due'));
		//datePickerRef.val('');
		//toDatePickerRef.val('');
		me.filterApplied = 'Q';
		me.filterData = [];
		me.handleClearAppliedFilterDelete();
		me.resetAllFields();
		me.setDataForFilter();
		me.refreshData();
	},
	doHandleSavedFilterItemClick : function(filterCode) {
		var me = this;
		if (!Ext.isEmpty(filterCode)) {
			me.getSavedFilterData(filterCode, me.populateSavedFilter, true);
		}
		var entryDateLableVal = $('label[for="entryDateLabel"]').text();
		var entryDateField = $("#paymentDueDateAdv");
		var clientComboBox = me.getLoanInvoiceNewFilterViewType().down('combo[itemId="clientCombo"]');
		me.clientCode = 'all';
		me.clientDesc = '';
		clientComboBox.setValue(me.clientCode);
		me.savePrefAdvFilterCode = filterCode;
		me.showAdvFilterCode = filterCode;
		me.disablePreferencesButton("savePrefMenuBtn", false);
		me.handleEntryDateSync('A', entryDateLableVal, null, entryDateField);
		// me.toggleSavePrefrenceAction(true);
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
	postHandleDoHandleGroupTabChange : function(data, args, isSuccess) {
		var me = this;
		var me = args ? args.scope : this;
		me.handleReconfigureGrid(data);
		// var objGroupView = me.getGroupView();
		// var objSummaryView = me.getLoanInvoiceNewGridViewRef(), arrSortState
		// = new Array(), objPref = null, gridModel = null, intPgSize = null;
		// var colModel = null, arrCols = null;
		// if (data && data.preference) {
		// objPref = data;
		// showPager = objPref.gridSetting
		// && !Ext.isEmpty(objPref.gridSetting.showPager)
		// ? objPref.gridSetting.showPager
		// : true;
		// objPref = Ext.decode(data.preference);
		// arrCols = objPref.gridCols || null;
		// intPgSize = objPref.pgSize || _GridSizeTxn;
		// colModel = objSummaryView.getColumnModel(arrCols);
		// if (colModel) {
		// gridModel = {
		// columnModel : colModel,
		// pageSize : intPgSize,
		// showPagerForced : showPager,
		// storeModel : {
		// sortState : objPref.sortState
		// }
		// };
		// }
		// }
		// objGroupView.reconfigureGrid(gridModel);
	},

	handleTabAction : function() {
		var me = this;
		var btn;
		btn = me.getLoanCenterInvoiceTabRef();
		// btn.addCls( 'xn-custom-heighlight' );
	},
	handleSaveAndSearchGridAction : function(btn) {
		var me = this;
		var callBack = me.postDoSaveAndSearch;
		var strFilterCodeVal = null;
		if (me.filterCodeValue === null) {
			var FilterCode = $("#saveFilterAs").val();
			if (Ext.isEmpty(FilterCode)) {
				paintError('#advancedFilterErrorDiv',
						'#advancedFilterErrorMessage', getLabel(
								'filternameMsg', 'Please Enter Filter Name'));
				return;
			} else {
				hideErrorPanel("advancedFilterErrorDiv");
				me.filterCodeValue = FilterCode;
				strFilterCodeVal = me.filterCodeValue;
			}
		} else {
			strFilterCodeVal = me.filterCodeValue;
		}
		if (Ext.isEmpty(strFilterCodeVal)) {
			paintError('#advancedFilterErrorDiv',
					'#advancedFilterErrorMessage', getLabel('filternameMsg',
							'Please Enter Filter Name'));
			return;
		} else {
			hideErrorPanel("advancedFilterErrorDiv");
			me.postSaveFilterRequest(me.filterCodeValue, callBack);
		}
	},
	closeGridViewFilterPopup : function(btn) {
		var me = this;
		me.getAdvanceFilterPopup().close();
	},
	closeViewPayPopup : function(btn) {
		var me = this;
		me.getLoanInvoiceViewPaymentRef().close();
	},
	closeViewInfoPopup : function(btn) {
		var me = this;
		me.getLoanInvoiceViewInfoRef().close();
	},
	closeNewPaymentPopup : function(btn) {
		var me = this;
		me.getLoanInvoiceNewPaymentRef().close();
	},
	postSaveFilterRequest : function(FilterCodeVal, fncallBack) {
		var me = this;
		var strUrl = 'userfilters/invoiceGridFilter/{0}.srvc?';
		strUrl = Ext.String.format(strUrl, FilterCodeVal);
		var objJson;
		objJson = getAdvancedFilterValueJson(FilterCodeVal);
		// objJson = objOfCreateNewFilter.getAdvancedFilterValueJson(
		// FilterCodeVal);
		Ext.Ajax.request({
					url : strUrl + csrfTokenName + "=" + csrfTokenValue,
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
							title = getLabel('filterPopupTitle', 'Message');
							strMsg = responseData.d.error.errorMessage;
							imgIcon = Ext.MessageBox.ERROR;
							Ext.MessageBox.show({
										title : title,
										msg : strMsg,
										width : 200,
										cls : 't7-popup',
										buttons : Ext.MessageBox.OK,
										icon : imgIcon
									});

						}

						if (FilterCodeVal && isSuccess && isSuccess === 'Y') {
							// objFilterCode.setValue(filterCode);
							// me.setAdvancedFilterTitle(filterCode);
							$('#advancedFilterPopup').dialog('close');
							fncallBack.call(me);
							// me.reloadFilters(filterGrid.getStore());
							me.updateSavedFilterComboInQuickFilter();
						}
					},
					failure : function() {
						var errMsg = "";
						Ext.MessageBox.show({
									title : getLabel('filterPopupTitle',
											'Error'),
									msg : getLabel('filterPopupMsg',
											'Error while fetching data..!'),
									buttons : Ext.MessageBox.OK,
									icon : Ext.MessageBox.ERROR
								});
					}
				});

	},
	postDoSaveAndSearch : function() {
		// var me = this;
		// me.doAdvSearchOnly();
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
		me.applyAdvancedFilter();
		objGroupView = me.getGroupView();
		objGroupView.setFilterToolTip(me.filterCodeValue || '');
	},
	handleSaveAndSearchAction : function(btn) {
		var me = this;
		var callBack = this.postDoSaveAndSearch;
		var strFilterCodeVal = null;
		var FilterCode = $("#saveFilterAs").val();
		if (Ext.isEmpty(FilterCode)) {
			paintError('#advancedFilterErrorDiv',
					'#advancedFilterErrorMessage', getLabel('filternameMsg',
							'Please Enter Filter Name'));
			return;
		} else {
			hideErrorPanel("advancedFilterErrorDiv");
			$('#advancedFilterPopup').dialog("close");
			me.filterCodeValue = FilterCode;
			strFilterCodeVal = me.filterCodeValue;
			me.savedFilterVal = FilterCode;
		}
		me.savePrefAdvFilterCode = strFilterCodeVal;
		hideErrorPanel("advancedFilterErrorDiv");
		var clientComboBox = me.getLoanInvoiceNewFilterViewType().down('combo[itemId="clientCombo"]');
		me.clientCode = 'all';
		me.clientDesc = '';
		clientComboBox.setValue(me.clientCode);
		var entryDateLableVal = $('label[for="entryDateLabel"]').text();
		var entryDateField = $("#paymentDueDateAdv");
		me.handleEntryDateSync('A', entryDateLableVal, null, entryDateField);			
		me.postSaveFilterRequest(strFilterCodeVal, callBack);
	},
	handleSearchActionGridView : function(btn) {
		var me = this, objGroupView = null, savedFilterCombobox = me
				.getFilterView().down('combo[itemId="savedFiltersCombo"]');
		var SaveFilterChkBoxVal = $("input[type='checkbox'][id='saveFilterChkBox']")
				.is(':checked');
		if (SaveFilterChkBoxVal === true) {
			me.handleSaveAndSearchAction();
		} else {
			me.savedFilterVal = '';
			me.filterCodeValue = '';
			me.doAdvSearchOnly();
			if (savedFilterCombobox)
				savedFilterCombobox.setValue('');
			objGroupView = me.getGroupView();
			objGroupView.setFilterToolTip('');
			$('#advancedFilterPopup').dialog("close");
		}
	},
	doAdvSearchOnly : function() {
		var me = this;
		var clientComboBox = me.getLoanInvoiceNewFilterViewType().down('combo[itemId="clientCombo"]');
		me.clientCode = 'all';
		me.clientDesc = '';
		clientComboBox.setValue(me.clientCode);
		var entryDateLableVal = $('label[for="entryDateLabel"]').text();
		var entryDateField = $("#paymentDueDateAdv");
		me.handleEntryDateSync('A', entryDateLableVal, null, entryDateField);
		me.applyAdvancedFilter();
	},
	applyAdvancedFilter : function() {
		var me = this;
		var blnDateFilterPresent = false;
		me.filterApplied = 'A';
		me.setDataForFilter();
		
		$.each(me.advFilterData, function(index, cfgFilter) {
			if(null!=cfgFilter && cfgFilter !=undefined)
			{			
				if(null!=cfgFilter && cfgFilter !=undefined)
				{															
					if(cfgFilter.field == "InvoiceDueDate")
					{
						blnDateFilterPresent = true;
					}								
				}
			}
		});		
		if(blnDateFilterPresent)
		{				
			$.each(me.filterData, function(index, cfgFilter) {
			
				if(null!=cfgFilter && cfgFilter !=undefined)
				{
					if(null!=cfgFilter && cfgFilter !=undefined)
					{															
						if(cfgFilter.paramName == "dueDate")
						{
							me.filterData.splice(index, 1);
						}								
					}
				}
			});			
		}			
		me.refreshData();
	},
	handleAfterGridDataLoad : function(grid, jsonData) {
		var me = grid.ownerCt;
		me.setLoading(false);
	},
	setDataForFilter : function() {
		// var me = this;
		// // me.getSearchTxnTextInput().setValue( '' );
		// if (this.filterApplied === 'Q' || this.filterApplied === 'ALL') {
		// if (this.filterApplied === 'ALL') {
		// var str = "allType";
		// }
		// this.filterData = this.getQuickFilterQueryJson();
		// me.advFilterData = {};
		// } else if (this.filterApplied === 'A') {
		// var objOfCreateNewFilter = this.getCreateNewFilter();
		// var objJson = getAdvancedFilterQueryJson();
		// this.advFilterData = objJson;
		// var filterCode = $("input[type='text'][id='saveFilterAs']").val();
		// this.advFilterCodeApplied = filterCode;
		// }
		var me = this;
		// me.getSearchTxnTextInput().setValue( '' );
		if (this.filterApplied === 'Q' || this.filterApplied === 'ALL') {
			//this.filterData = this.getQuickFilterQueryJson();
			this.filterData = {};
			var objJson = getAdvancedFilterQueryJson();
			reqJson = me.findInAdvFilterData(objJson, "InvoiceDueDate");
			if (!Ext.isEmpty(reqJson)) {
				arrQuickJson = objJson;
				arrQuickJson = me.removeFromQuickArrJson(arrQuickJson, "InvoiceDueDate");
				me.advFilterData = arrQuickJson;
			}
			if (me.clientCode !== null)
			{
				var objJson = getAdvancedFilterQueryJson();
				if(me.clientCode!='all')
				{	
					objJson.push({
						field : 'clientCode',
						operator : 'in',
						value1 : encodeURIComponent(me.clientCode.replace(new RegExp("'", 'g'), "\''")),
						value2 : '',
						dataType : 0,
						displayType : 11,
						detailFilter : 'Y',
						fieldLabel : getLabel('lblClient','Company Name'),
						displayValue1 : me.clientDesc
					});
				}	
				me.advFilterData = objJson;
			}	
			
		} else if (this.filterApplied === 'A') {
			var objJson = getAdvancedFilterQueryJson();
			/*if (me.clientCode != null && !Ext.isEmpty(me.clientCode)
					&& me.clientCode != 'all' && 'undefined' != me.clientCode)
				objJson.push({
							paramName : 'clientCode',
							paramValue1 : encodeURIComponent(me.clientCode.replace(new RegExp("'", 'g'), "\''")),
							operatorValue : 'eq',
							dataType : 'S'
						});*/
			this.advFilterData = objJson;
			var filterCode = $("input[type='text'][id='saveFilterAs']").val();
			this.advFilterCodeApplied = filterCode;
		}
	},
	/* Page setting handling starts here */
	savePageSetting : function(arrPref, strInvokedFrom) {
		/* This will be get invoked from page level setting always */
		var me = this, args = {};
		if (!Ext.isEmpty(arrPref)) {
			me.preferenceHandler.savePagePreferences(me.strPageName, arrPref,
					me.postHandleSavePageSetting, args, me, false);
		}
	},
	postHandleSavePageSetting : function(data, args, isSuccess) {
		var me = this, args = {};
		if (isSuccess === 'N') {
			Ext.MessageBox.show({
				title : getLabel('instrumentErrorPopUpTitle', 'Error'),
				msg : getLabel('errorMsg', 'Error while apply/restore setting'),
				buttons : Ext.MessageBox.OK,
				cls : 't7-popup',
				icon : Ext.MessageBox.ERROR
			});
		} else {
			me.preferenceHandler.readPagePreferences(me.strPageName,
					me.updateObjLoanSummaryPref, args, me, false);
		}
	},
	updateObjLoanSummaryPref : function(data) {
		objInvoicePref = Ext.encode(data);
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
				me.loadSummaryPage();
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
	postHandleRestorePageSetting : function(data, args, isSuccess) {
		if (isSuccess === 'Y') {
			var me = this;
			if (args && args.strInvokedFrom === 'GRID'
					&& _charCaptureGridColumnSettingAt === 'L') {
				var objGroupView = me.getGroupView();
				if (objGroupView)
					objGroupView.reconfigureGrid(null);
			} else
				me.loadSummaryPage();
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
		var me = this, objData = {}, objGroupView = me.getGroupView(), objPrefData, objGeneralSetting, objGridSetting, objColumnSetting;
		var objGroupByVal = '', objDefaultFilterVal = '', objGridSizeVal = '', objRowPerPageVal = _GridSizeMaster, strTitle = null, subGroupInfo;

		me.pageSettingPopup = null;

		if (!Ext.isEmpty(objInvoicePref)) {
			objPrefData = Ext.decode(objInvoicePref);
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
					: (LOAN_INVOICE_GENERIC_COLUMN_MODEL || '[]');

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
		objData["filterUrl"] = 'services/userfilterslist/invoiceGridFilter.srvc?'
				+ csrfTokenName + "=" + csrfTokenValue;
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
			cfgInvokedFrom : strInvokedFrom,
			title : strTitle,
			cfgViewOnly : _IsEmulationMode
				// ,cfgHideGroupBy : true
			});
		me.pageSettingPopup.show();
		me.pageSettingPopup.center();
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
	removeFromAdvanceArrJson : function(arr, key) {
		for (var ai, i = arr.length; i--;) {
			if ((ai = arr[i]) && ai.field == key) {
				arr.splice(i, 1);
			}
		}
		return arr;
	},
	handleAppliedFilterDelete : function(btn) {
		var me = this;
		var objData = btn.data;
		var advJsonData = me.advFilterData;
		var quickJsonData = me.filterData;
		if (!Ext.isEmpty(objData)) {
			var paramName = objData.paramName || objData.field;
			var reqJsonInAdv = null;
			var arrAdvJson = null;
			// adv
			var reqJsonInAdv = me.findInAdvFilterData(advJsonData, paramName);
			if (!Ext.isEmpty(reqJsonInAdv)) {
				arrAdvJson = advJsonData;
				arrAdvJson = me.removeFromAdvanceArrJson(arrAdvJson, paramName);
				if (paramName === 'dueDate' || paramName === 'InvoiceDueDate')
					{
						me.dateFilterLabel  = getLabel('today', 'Today');
						me.dateFilterVal  = '1';
						me.handleDateChange(me.dateFilterVal);
						var objDateParams = me.getDateParam(me.dateFilterVal);
						var jsonObject = {};		
						if (!Ext.isEmpty(objDateParams.fieldValue1)) {
							jsonObject = {
										field : 'InvoiceDueDate',
										paramIsMandatory : true,
										value1 : objDateParams.fieldValue1,
										value2 : objDateParams.fieldValue2,
										operator : objDateParams.operator,
										dataType : 1,
										fieldLabel : getLabel('lblPayDueDate','Payment Due Date'),
										dropdownLabel : me.dateFilterLabel
									};
						}
						arrAdvJson.push(jsonObject);
					}
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
			me.resetFieldInAdvAndQuickOnDelete(objData);
			me.refreshData();
		}
	},
	getQuickFilterQueryJson : function() {
		var me = this;
		var jsonArray = [];
		var index = me.dateFilterVal;
		var objDateParams = me.getDateParam(index,null);
//		if (index != '12') {
			jsonArray.push({
						paramName : me.getEntryDate().filterParamName,
						paramIsMandatory : true,
						paramValue1 : objDateParams.fieldValue1,
						paramValue2 : objDateParams.fieldValue2,
						operatorValue : objDateParams.operator,
						dataType : 'D',
						displayType : 6,
						paramFieldLable : getLabel('lblPayDueDate','Payment Due Date')
					});
//		}
		if (me.clientCode != null && !Ext.isEmpty(me.clientCode)
				&& me.clientCode != 'all')
			jsonArray.push({
						paramName : 'clientCode',
						paramValue1 : encodeURIComponent(me.clientCode.replace(new RegExp("'", 'g'), "\''")),
						operatorValue : 'eq',
						dataType : 'S',
						displayType : 5,
						paramFieldLable : getLabel('lblcompany', 'Company Name'),
						displayValue1 : me.clientDesc						
					});
		return jsonArray;
	},
	applyQuickFilter : function() {
		var me = this;
		var objGroupView = me.getGroupView();
		var groupInfo = objGroupView.getGroupInfo();
		me.filterApplied = 'Q';
		if (groupInfo && groupInfo.groupTypeCode === 'LONINVOICE_OPT_ADVFILTER') {
			objGroupView.setActiveTab('all');
		} else {

			me.refreshData();
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
	handleViewPaySmartGridConfig : function(record) {
		var me = this;
		var loanInvoiceViewPayGrid = me.getLoanInvoiceViewPaymentGridRef();
		var objConfigMap = me.getLoanInvoiceViewPaymentConfiguration();
		var arrCols = new Array();
		arrCols = me.getViewPaymentColumns(objConfigMap.arrColsPref,
				objConfigMap.objWidthMap);
		if (!Ext.isEmpty(loanInvoiceViewPayGrid))
			loanInvoiceViewPayGrid.destroy(true);
		me.handleViewPaySmartGridLoading(arrCols, objConfigMap.storeModel,
				record);
	},
	handleViewPaySmartGridLoading : function(arrCols, storeModel, record) {
		var me = this;
		var pgSize = null;
		var alertSummaryGrid = null;
		var invoiceNmbr = record.get('invoiceNumber');
		pgSize = 10;
		loanInvoiceViewPayGrid = Ext.create('Ext.ux.gcp.SmartGrid', {
			id : 'gridViewPayItemId',
			itemId : 'gridViewPayItemId',
			// height : 200,
			//scroll : 'vertical',
			maxHeight : 420,
			pageSize : pgSize,
			autoDestroy : true,
			stateful : false,
			showEmptyRow : false,
			showSummaryRow : false,
			// padding : '5 0 0 0',
			showCheckBoxColumn : false,
			hideRowNumbererColumn : true,
			enableActionMenu : false,
			showPager : true,
			showAllRecords : false,
			enableColumnHeaderMenu : false,
			rowList : [10, 25, 50, 100, 200, 500],
			minHeight : 140,
			columnModel : arrCols,
			storeModel : storeModel,
			isRowIconVisible : me.isRowIconVisible,
			isRowMoreMenuVisible : me.isRowMoreMenuVisible,
			handleRowMoreMenuClick : me.handleRowMoreMenuClick,

			handleRowIconClick : function(tableView, rowIndex, columnIndex,
					btn, event, record) {
				me.handleRowIconClick(tableView, rowIndex, columnIndex, btn,
						event, record);
			},
			handleRowMoreMenuItemClick : function(menu, event) {
				var dataParams = menu.ownerCt.dataParams;
				me.handleRowIconClick(dataParams.view, dataParams.rowIndex,
						dataParams.columnIndex, this, event, dataParams.record);
			},
			listeners : {
				render : function(loanInvoiceViewPayGrid) {
					me.handleViewPaymentLoadGridData(loanInvoiceViewPayGrid,
							invoiceNmbr, loanInvoiceViewPayGrid.store.dataUrl,
							loanInvoiceViewPayGrid.pageSize, 1, 1, null);
				},
				gridSortChange : function(loanInvoiceViewPayGrid, strDataUrl,
						intPgSize, intNewPgNo, intOldPgNo, jsonSorter, record) {
					me.handleViewPaymentLoadGridData(loanInvoiceViewPayGrid,
							invoiceNmbr, loanInvoiceViewPayGrid.store.dataUrl,
							loanInvoiceViewPayGrid.pageSize, intNewPgNo,
							intOldPgNo, jsonSorter);
				},
				gridPageChange : function(loanInvoiceViewPayGrid, strDataUrl,
						intPgSize, intNewPgNo, intOldPgNo, jsonSorter) {
					me.handleViewPaymentLoadGridData(loanInvoiceViewPayGrid,
							invoiceNmbr, loanInvoiceViewPayGrid.store.dataUrl,
							loanInvoiceViewPayGrid.pageSize, intNewPgNo,
							intOldPgNo, jsonSorter);
				},
				statechange : function(loanInvoiceViewPayGrid) {
					me.toggleSavePrefrenceAction(true);
					me.toggleClearPrefrenceAction(true);
				},
				pagechange : function(pager, current, oldPageNum) {
					me.toggleSavePrefrenceAction(true);
					me.toggleClearPrefrenceAction(true);
				}
			}
		});

		var loanInvoiceViewPayDtl = me.getLoanInvoiceViewPayDtlRef();
		loanInvoiceViewPayDtl.add(loanInvoiceViewPayGrid);
		loanInvoiceViewPayDtl.doLayout();
		// me.handleViewPaymentLoadGridData( loanInvoiceViewPayGrid,
		// invoiceNmbr, null );
	},
	doHandleRowActions : function(actionName, grid, record, rowIndex) {
		var me = this;
		if (actionName === 'accept' || actionName === 'reject'
				|| actionName === 'discard' || actionName === 'pay')
			me.handleGroupActions(actionName, grid, record, 'rowAction');
		else if (actionName === 'btnHistory') {
			var recHistory = record.get('history');
			if (!Ext.isEmpty(recHistory)
					&& !Ext.isEmpty(recHistory.__deferred.uri)) {
				me.showHistory(record.get('invoiceNumber'), record
								.get('history').__deferred.uri, record
								.get("identifier"));
			}
		} else if (actionName === 'btnView') {
			showloanInvoiceInfoPopup(record);
		} else if (actionName === 'btnViewPayment') {
			me.viewPaymentPopUp(record);
		}
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
		form.action = strUrl;
		document.body.appendChild(form);
		form.submit();
	},
	loadSummaryPage : function()
	{	
			submitForm('loanInvoiceCenter.srvc');
	},	
	showHistory : function(invoiceNumber, url, id) {
		/* url = url + '?$invoiceNmbr='+ invoiceNumber; */
		Ext.create('GCP.view.HistoryPopup', {
					historyUrl : url + '?'+csrfTokenName+'=' + tokenValue,
					invoiceNumber : invoiceNumber,
					identifier : id
				}).show();
	},
	createFormField : function(element, type, name, value) {
		var inputField;
		inputField = document.createElement(element);
		inputField.type = type;
		inputField.name = name;
		inputField.value = value;
		return inputField;
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

		strExtension = arrExtension[actionName];
		strUrl = 'services/loanInvoice/getDynamicReport.' + strExtension;
		strUrl += '?$skip=1';
		var objGroupView = me.getGroupView();
		var strQuickFilterUrl = me.getFilterUrl();
		strUrl += strQuickFilterUrl;

		var strOrderBy = me.reportOrderByURL;
		if (!Ext.isEmpty(strOrderBy)) {
			var orderIndex = strOrderBy.indexOf('orderby');
			if (orderIndex > 0) {
				strOrderBy = strOrderBy
						.substring(orderIndex, strOrderBy.length);
				var indexOfamp = strOrderBy.indexOf('&$');
				if (indexOfamp > 0)
					strOrderBy = strOrderBy.substring(0, indexOfamp);
				strUrl += '&$' + strOrderBy;
			}
		}

		var grid = objGroupView.getGrid();
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
			strSelect = '&$select=[' + colArray.toString() + ']';
		}

		strUrl = strUrl + strSelect;

		var objParam = {}, arrMatches, strRegex = /[?&]([^=#]+)=([^&#]*)/g;
		while (arrMatches = strRegex.exec(strUrl)) {
			objParam[arrMatches[1]] = arrMatches[2];
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
		strUrl = strUrl.substring(0, strUrl.indexOf('?'));
		form = document.createElement('FORM');
		form.name = 'frmMain';
		form.id = 'frmMain';
		form.method = 'POST';

		Object.keys(objParam).map(function(key) {
			form.appendChild(me.createFormField('INPUT', 'HIDDEN', key,
					objParam[key]));
		});

		form.appendChild(me.createFormField('INPUT', 'HIDDEN',
				csrfTokenName, tokenValue));
		form.appendChild(me.createFormField('INPUT', 'HIDDEN', 'txtCurrent',
				currentPage));
		form.appendChild(me.createFormField('INPUT', 'HIDDEN', 'txtCSVFlag',
				withHeaderFlag));
		for (var i = 0; i < arrSelectedrecordsId.length; i++) {
			form.appendChild(me.createFormField('INPUT', 'HIDDEN',
					'identifierGrid', arrSelectedrecordsId[i]));
		}
		form.action = strUrl;
		document.body.appendChild(form);
		form.submit();
		document.body.removeChild(form);
	},
	getLoanInvoiceViewPaymentConfiguration : function() {
		var me = this;
		var objConfigMap = null;
		var objWidthMap = null;
		var arrColsPref = null;
		var storeModel = null;

		objWidthMap = {
			"debitAccNo" : 200,
			"requestedAmnt" : 180,
			"requestDate" : 160,
			"makerId" : 160,
			"requestStatusDesc" : 180
		};
		arrColsPref = [{
					"colId" : "debitAccNo",
					"colHeader" : getLabel('PaymentAcct', 'Payment Account')
				}, {
					"colId" : "requestedAmnt",
					"colHeader" : getLabel('amount', 'Amount'),
					"colType" : "number"
				}, {
					"colId" : "requestDate",
					"colHeader" : getLabel('date', 'Date')
				}, {
					"colId" : "makerId",
					"colHeader" : getLabel('HistoryMstMaker', 'Maker')
				}, {
					"colId" : "requestStatusDesc",
					"colHeader" : getLabel('Status', 'Status')
				}];

		storeModel = {
			fields : ['debitAccNo', 'requestedAmnt', 'requestDate', 'makerId',
					'requestStatusDesc'],
			proxyUrl : 'getLoanInvoiceViewPayList.srvc',
			rootNode : 'd.loanCenterTxn',
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
	setGridInfo : function(grid) {
		var me = this;
		var ObjGroupView = me.getGroupView();
		var grid = ObjGroupView.getGrid();
		var summaryData;
		var dataStore = grid.getStore();
		dataStore.on('load', function(store, records) {
					var i = records.length - 1;
					if (i >= 0) {
						summaryData = [{
							title : getLabel('invoiceOutstanding',
									"Invoices Outstanding"),
							amount : records[i].get('outStandingSum') + " (#"
									+ records[i].get('outStandingCount') + ")"
						}, {
							title : getLabel('overdueInvoices',
									"Overdue Invoices"),
							amount : records[i].get('overDueSum') + " (#"
									+ records[i].get('overDueCount') + ")"
						}, {
							title : getLabel('pmttAwaitingApproval',
									"Payment Awaiting Approval"),
							amount : records[i].get('pendingSum') + " (#"
									+ records[i].get('pendingCount') + ")"
						}]
					} else {
						summaryData = [{
							title : getLabel('invoiceOutstanding',
									"Invoices Outstanding"),
							amount : "$0.000 (#0)"
						}, {
							title : getLabel('overdueInvoices',
									"Overdue Invoices"),
							amount : "$0.000 (#0)"
						}, {
							title : getLabel('pmttAwaitingApproval',
									"Payment Awaiting Approval"),
							amount : "$0.000 (#0)"
						}]
					}

					$('#summaryCarousal').carousel({
								data : summaryData,
								titleNode : "title",
								contentNode : "amount"
							});
				});
	},
	handleReconfigureGrid : function(data) {
		var me = this;
		var objGroupView = me.getGroupView();
		var objSummaryView = me.getLoanInvoiceNewGridViewRef(), gridModel = null, objData = null;
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
	handleLoadGridData : function(groupInfo, subGroupInfo, grid, url, pgSize,
			newPgNo, oldPgNo, sorter, filterData) {
		var me = this;
		var objLableFound = false;
		var objFilterArray = [];
		var arrOfParseQuickFilter = [], arrOfParseAdvFilter = [], arrOfFilteredApplied = [];
		var strModule = '', args = null;
		var objGroupView = me.getGroupView();
		var buttonMask = me.strDefaultMask;
		
		//saving local prefrences
		if(allowLocalPreference === 'Y')
			me.handleSaveLocalStorage();
		
		objGroupView.handleGroupActionsVisibility(buttonMask);
		var strUrl = grid.generateUrl(url, pgSize, newPgNo, oldPgNo, sorter);

		// me.setDataForFilter();
		strUrl += me.getFilterUrl(subGroupInfo, groupInfo) + "&"
				+ csrfTokenName + "=" + csrfTokenValue;

		if (!Ext.isEmpty(me.filterData)) {
			if (!Ext.isEmpty(me.filterData) && me.filterData.length >= 1) {
				arrOfParseQuickFilter = generateFilterArray(me.filterData);
			}
		}

		if (!Ext.isEmpty(me.advFilterData)) {
			if (!Ext.isEmpty(me.advFilterData) && me.advFilterData.length >= 1) {
				arrOfParseAdvFilter = generateFilterArray(me.advFilterData);
			}
		}
		if (arrOfParseQuickFilter && arrOfParseAdvFilter)
		{
			arrOfFilteredApplied = arrOfParseQuickFilter.concat(arrOfParseAdvFilter);
			me.getFilterView().updateFilterInfo(arrOfFilteredApplied);
		}

		me.reportGridOrder = strUrl;
		// me.reportOrderByURL = strUrl;
		grid.loadGridData(strUrl, null, null, false);
		me.setGridInfo();

		grid.on('itemdblclick', function(dataView, record, item, rowIndex,
						eventObj) {
					me.handleGridRowClick(record, grid);
				});
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
				me
						.doHandleRowActions(arrVisibleActions[0].itemId, grid,
								record);
			}
		}
	},
	resetFieldInAdvAndQuickOnDelete : function(objData) {
		var me = this, strFieldName;
		if (!Ext.isEmpty(objData))
			strFieldName = objData.paramName || objData.field;
		if (strFieldName === 'InvoiceNumber')
		{
			$("#invoiceNumber").val("");
		}
		else if (strFieldName === 'ObligationIdAct')
		{
			$("#obligationIdAct").val("");
		}
		else if (strFieldName === 'Status')
		{
			$('#statusAdv option').prop('selected', true);
			$('#statusAdv').multiselect("refresh");
		} 
		else if(strFieldName === 'dueDate' || strFieldName === 'InvoiceDueDate'){
			me.dateFilterVal = '1';
			me.dateFilterLabel = getLabel('today', 'Today');
			me.getEntryDateLabel().setText(getLabel('lblPayDueDate','Payment Due Date'));
			me.handleDateChange(me.dateFilterVal);
			//$('#entryDataPicker').val('');
			//$('#paymentDueDateAdv').val('');
		}	
		else if(strFieldName ==='clientCode'){					
			if(isClientUser()){
				var clientComboBox = me.getLoanInvoiceNewFilterViewType().down('combo[itemId="clientCombo"]');
				me.clientCode = 'all';
				me.clientDesc = '';
				clientComboBox.setValue(me.clientCode);
			} else {
				var clientComboBox = me.getLoanInvoiceNewFilterViewType().down('AutoCompleter[itemId="clientAutoCompleter"]');
				clientComboBox.reset();
				me.clientCode = 'all';
				me.clientDesc = '';
			}
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
			me.savedFilterVal = savedFilterVal;
		}

		var saveFilterChkBoxRef = $("input[type='checkbox'][id='saveFilterChkBox']");
		if (!Ext.isEmpty(saveFilterChkBoxRef) && !Ext.isEmpty(savedFilterVal))
			saveFilterChkBoxRef.prop('checked', true);
		markAdvFilterNameMandatory('saveFilterChkBox','advFilterNameLabel','saveFilterAs');

		var applyAdvFilter = false;
		me.filterCodeValue = savedFilterVal;
		me.getSavedFilterData(savedFilterVal, this.populateSavedFilter,
				applyAdvFilter);
	},
	getFilterUrl : function(subGroupInfo, groupInfo) {
		var me = this;
		var strQuickFilterUrl = '', strAdvFilterUrl = '', strUrl = '', isFilterApplied = 'false';
		var strGroupQuery = (subGroupInfo && subGroupInfo.groupQuery)
				? subGroupInfo.groupQuery
				: '';
		if (me.filterApplied === 'ALL')
		{	
			strQuickFilterUrl = me.generateUrlWithQuickFilterParams(me);
			if (!Ext.isEmpty(strQuickFilterUrl)) {
				strUrl += '&$filter=' + strQuickFilterUrl;
				//isFilterApplied = true;
			}
		}
		else
		{	
			strQuickFilterUrl = me.generateUrlWithQuickFilterParams(me);
			if (!Ext.isEmpty(strQuickFilterUrl)) {
				strUrl += '&$filter=' + strQuickFilterUrl;
				//isFilterApplied = true;
			}
			strAdvFilterUrl = me.generateUrlWithAdvancedFilterParams(me);
			if (!Ext.isEmpty(strAdvFilterUrl))
			{
				if( strUrl == '' )
					strUrl += '&$filter=' + strAdvFilterUrl;
				else
					strUrl += ' and ' + strAdvFilterUrl;
				
				//isFilterApplied = true;
			}
			
			if (!Ext.isEmpty(strGroupQuery)) {
				if (!Ext.isEmpty(strUrl))
					strUrl += ' and ' + strGroupQuery;
				else
					strUrl += '&$filter=' + strGroupQuery;
			}	
		}
		return strUrl;
	},
	generateUrlWithQuickFilterParams : function(thisClass) {
		var filterData = thisClass.filterData;
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
								|| operator === 'lk' || operator === 'gt' || operator === 'lt' || operator === 'in'))
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
						if (arrId[0] != 'All') {
							if( 0 != arrId.length )
							{
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
						break;
				}
			}
		}
		if (isFilterApplied) {
			strFilter = strFilter + strTemp;
		} else if (isOrderByApplied) {
			strFilter = strTemp;
		} else {
			strFilter = '';
		}
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
	generateActionStatusUrl : function() {
		var me = this;
		var strRetValue = '';
		var arrActionStatus = me.arrActionStatus;
		if (!Ext.isEmpty(arrActionStatus)) {
			for (var i = 0; i < arrActionStatus.length; i++) {
				if (i == 0)
					strRetValue += Ext.String.format("ActionStatus eq '{0}'",
							arrActionStatus[i]);
				else
					strRetValue += Ext.String.format(
							" or ActionStatus eq '{0}'", arrActionStatus[i]);
			}
		}
		if (!Ext.isEmpty(strRetValue))
			strRetValue = '(' + strRetValue + ')';
		return strRetValue;
	},
	generateUrlWithFilterParams : function(thisClass) {
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
	orderUpDown : function(grid, rowIndex, direction) {
		var record = grid.getStore().getAt(rowIndex);
		if (!record) {
			return;
		}
		var index = rowIndex;
		if (direction < 0) {
			index--;
			if (index < 0) {
				return;
			}
		} else {
			index++;
			if (index >= grid.getStore().getCount()) {
				return;
			}
		}
		var store = grid.getStore();
		store.remove(record);
		store.insert(index, record);

		this.sendUpdatedOrderJsonToDb(store);
	},
	sendUpdatedOrderJsonToDb : function(store) {
		var me = this;
		var preferenceArray = [];
		var objJson = {};
		var FiterArray = [];
		// store.each(function(rec) {
		// var singleFilterSet = rec.get('filterName');
		// preferenceArray.push(singleFilterSet);
		// });
		// var objJson = {};
		// objJson.filters = preferenceArray;
		$("#msSavedFilter option").each(function() {
					FiterArray.push($(this).val());
				});
		objJson.filters = FiterArray;
		Ext.Ajax.request({
			url : 'userpreferences/invoiceGridFilter/gridViewAdvanceFilter.srvc?'
					+ csrfTokenName + "=" + csrfTokenValue,
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
		if (!Ext.isEmpty(savedFilterCombobox)) {
			// me.reloadFilters(savedFilterCombobox.getStore());
			// savedFilterCombobox.getStore().reload();
			if (me.filterCodeValue != null) {
				me.savedFilterVal = me.filterCodeValue;
			} else {
				me.savedFilterVal = '';
			}
			savedFilterCombobox.setValue(me.savedFilterVal);
			me.filterCodeValue = null;
		}
	},
	updateAdvActionToolbar : function() {
		var me = this;
		Ext.Ajax.request({
			url : 'userpreferences/invoiceGridFilter/gridViewAdvanceFilter.srvc',
			headers: objHdrCsrfParams,
			method : 'GET',
			success : function(response) {
				var responseData = Ext.decode(response.responseText);
				var filters = JSON.parse(responseData.preference);
				me.addAllSavedFilterCodeToView(filters.filters);
			},
			failure : function() {
				console.log("Error Occured - Addition Failed");
			}
		});
	},
	getAllSavedAdvFilterCode : function(panel) {
		var me = this;
		var advFilterCode = me.advFilterCodeApplied;
		Ext.Ajax.request({
					url : 'userfilterslist/invoiceGridFilter.srvc',
					headers: objHdrCsrfParams,
					async : false,
					success : function(response) {
						var responseData = Ext.decode(response.responseText);
						var arrFilters = [];
						var filterData = responseData.d.fireloadFilterslters;
						if (filterData) {
							arrFilters = filterData;
						}
						me.advFilterCodeApplied = advFilterCode;
						// me.addAllSavedFilterCodeToView( arrFilters );
					},
					failure : function(response) {
						console
								.log('Bad : Something went wrong with your request');
					}
				});
	},
	getAllSavedAdvTooBarCode : function() {
		var me = this;
		Ext.Ajax.request({
					url : 'userfilterslist/invoiceGridFilter.srvc',
					headers: objHdrCsrfParams,
					success : function(response) {
						var responseData = Ext.decode(response.responseText);
						var arrFilters = [];
						var filterData = responseData.d.filters;
						if (filterData) {
							arrFilters = filterData;
						}
						me.addAllSavedFilterCodeToView(arrFilters);
					},
					failure : function(response) {
						console
								.log('Bad : Something went wrong with your request');
					}
				});
	},
	/*
	 * addAllSavedFilterCodeToView : function( arrFilters ) { var me = this; var
	 * objToolbar = this.getAdvFilterActionToolBar();
	 * 
	 * if( objToolbar.items && objToolbar.items.length > 0 )
	 * objToolbar.removeAll(); if( arrFilters && arrFilters.length > 0 ) { var
	 * count = arrFilters.length; if( count > 2 ) count = 2; var toolBarItems =
	 * []; var item; for( var i = 0 ; i < count ; i++ ) { var btnCls =
	 * 'cursor_pointer xn-account-filter-btnmenu'; if(arrFilters[ i ] ===
	 * me.filterCodeValue) btnCls = 'xn-custom-heighlight'; item = Ext.create(
	 * 'Ext.Button', { cls : btnCls, itemId : arrFilters[ i ], tooltip :
	 * arrFilters[ i ], text : Ext.util.Format.ellipsis( arrFilters[ i ], 11 ),
	 * handler : function( btn, opts ) { /* objSavedFilter.fireEvent(
	 * 'handleSavedFilterItemClick', btn.itemId); // //
	 * me.handleFilterItemClick(btn.itemId); objToolbar.fireEvent(
	 * 'handleSavedFilterItemClick', btn.itemId, btn ); } } );
	 * toolBarItems.push( item ); } item = Ext.create( 'Ext.Button', { cls :
	 * 'cursor_pointer xn-account-filter-btnmenu', text : '<span
	 * class="button_underline">' + getLabel( 'moreText', 'more' ) + '&nbsp;>>' + '</span>',
	 * itemId : 'AdvMoreBtn', handler : function( btn, opts ) {
	 * me.handleMoreAdvFilterSet( btn.itemId ); } } ); var imgItem = Ext.create(
	 * 'Ext.Img', { src : 'static/images/icons/icon_spacer.gif', cls :
	 * 'ux_hide-image', height : 16, padding : '0 3 0 3' } );
	 * 
	 * toolBarItems.push( imgItem ); toolBarItems.push( item );
	 * objToolbar.removeAll(); objToolbar.add( toolBarItems ); } },
	 */
	handleMoreAdvFilterSet : function(btnId) {
		var me = this;
		if (!Ext.isEmpty(me.objAdvFilterPopup)) {
			me.objAdvFilterPopup.show();
			var objTabPanel = me.getAdvanceFilterTabPanel();
			objTabPanel.setActiveTab(0);
			var filterDetailsTab = me.getFilterDetailsTab();
			filterDetailsTab.setTitle(getLabel('filterDetails',
					'Filter Details'));
		} else {
			me.objAdvFilterPopup = Ext
					.create('GCP.view.LoanInvoiceAdvancedFilterPopup');
			var objTabPanel = me.getAdvanceFilterTabPanel();
			objTabPanel.setActiveTab(0);
			me.objAdvFilterPopup.show();
			var filterDetailsTab = me.getFilterDetailsTab();
			filterDetailsTab.setTitle(getLabel('filterDetails',
					'Filter Details'));
		}
	},
	handleFilterItemClick : function(filterCode) {
		var me = this;
		/*
		 * var objToolbar = me.getAdvFilterActionToolBar(); me.filterCodeValue =
		 * filterCode; objToolbar.items.each( function( item ) { item.removeCls(
		 * 'xn-custom-heighlight' ); } ); //if(!Ext.isEmpty(btn)) // btn.addCls(
		 * 'xn-custom-heighlight' );
		 */
		if (!Ext.isEmpty(filterCode)) {
			var applyAdvFilter = true;
			this.getSavedFilterData(filterCode, this.populateSavedFilter,
					applyAdvFilter);
		}
		me.savePrefAdvFilterCode = filterCode;
		me.showAdvFilterCode = filterCode;
		me.toggleSavePrefrenceAction(true);
		me.toggleClearPrefrenceAction(true);
	},
	getSavedFilterData : function(filterCode, fnCallback, applyAdvFilter) {
		var me = this;
		var objOfCreateNewFilter = me.getCreateNewFilter();
		var objJson;
		var strUrl = 'userfilters/invoiceGridFilter/{0}.srvc';
		strUrl = Ext.String.format(strUrl, filterCode);
		Ext.Ajax.request({
					url : strUrl,
					headers: objHdrCsrfParams,
					method : 'GET',
					async : false,
					success : function(response) {
						if (response && !Ext.isEmpty(response.responseText)) {
							var responseData = Ext
									.decode(response.responseText);
							fnCallback.call(me, filterCode, responseData,
									applyAdvFilter);
						}
					},
					failure : function() {
						var errMsg = "";
						Ext.MessageBox.show({
									title : getLabel('filterPopupTitle',
											'Error'),
									msg : getLabel('filterPopupMsg',
											'Error while fetching data..!'),
									buttons : Ext.MessageBox.OK,
									icon : Ext.MessageBox.ERROR
								});
					}
				});
	},
	populateSavedFilter : function(filterCode, filterData, applyAdvFilter) {
		var me = this;
		me.resetAllFields();
		var objCreateNewFilterPanel = me.getCreateNewFilter();

		for (i = 0; i < filterData.filterBy.length; i++) {
			var fieldName = filterData.filterBy[i].field;

			var fieldOper = filterData.filterBy[i].operator;

			var fieldVal = filterData.filterBy[i].value1;

			if (fieldName === "InvoiceNumber") {
				$('#invoiceNumber').val(fieldVal);
			} 
			else if (fieldName === "ObligationIdAct")
			{
				$('#obligationIdAct').val(fieldVal);
			}
			else if (fieldName === "InvoiceDueDate")
			{
				if (!Ext.isEmpty(fieldVal)) 
				{
					fieldVal = Ext.util.Format.date(Ext.Date.parse(fieldVal, 'Y-m-d'),strExtApplicationDateFormat);
				}				
				var fieldValToDate = filterData.filterBy[i].value2;
				var label = filterData.filterBy[i].dropdownLabel;
				if (!Ext.isEmpty(fieldValToDate)) 
				{
					fieldValToDate = Ext.util.Format.date(Ext.Date.parse(fieldValToDate, 'Y-m-d'),strExtApplicationDateFormat);
				}
				if (fieldOper === 'eq')
				{
					$('#paymentDueDateAdv').val(fieldVal);
					$('#entryDataPicker').val(fieldVal);
				}
				else if (fieldOper === 'bt')
				{
					$('#paymentDueDateAdv').datepick('setDate', [fieldVal, fieldValToDate]);
					$('#entryDataPicker').datepick('setDate', [fieldVal, fieldValToDate]);
				}	
				selectedPaymentDueDate = {
						operator : fieldOper,
						fromDate : fieldVal,
						toDate : fieldValToDate,
						dateLabel : label
					};
				$('label[for="entryDateLabel"]').text(getLabel('lblPayDueDate', 'Payment Due Date')
					+ " (" + selectedPaymentDueDate.dateLabel + ")");
				entry_date_opt = label;
			}
			else if (fieldName === "Status")
			{
				me.checkUnCheckMenuItems(fieldName, fieldVal);
			}
			else if (fieldName === "clientCode")
			{
				var loanInvoiceNewFilterViewType = me.getLoanInvoiceNewFilterViewType();
				var selectedFilterClient = fieldVal;
                var selectedClientDesc = filterData.filterBy[i].displayValue1;
				me.clientFilterVal = selectedFilterClient;
				me.clientDesc = selectedClientDesc;
				me.clientCode = selectedFilterClient;
				var clientComboBox = loanInvoiceNewFilterViewType.down('AutoCompleter[itemId="clientAutoCompleter"]');
				clientComboBox.setValue(selectedFilterClient);
				clientComboBox.setRawValue(selectedClientDesc);
			}
		}
		if (!Ext.isEmpty(filterCode)) {
			$('#saveFilterAs').val(filterCode);
			$("#msSavedFilter option[value='" + filterCode + "']").attr(
					"selected", true);
			$("#msSavedFilter").multiselect("refresh");
			var saveFilterChkBox = $("input[type='checkbox'][id='saveFilterChkBox']");
			saveFilterChkBox.prop('checked', true);
			markAdvFilterNameMandatory('saveFilterChkBox','advFilterNameLabel','saveFilterAs');
		}
		if (applyAdvFilter) {
			me.filterApplied = 'A';
			me.setDataForFilter();
			me.applyAdvancedFilter();
		}
	},
	checkUnCheckMenuItems : function(componentName, data) {
		var menuRef = null;
		var elementId = null;
		var me = this;
		var clientContainer = null;

		if (componentName === 'Status') {
			menuRef = $("select[id='statusAdv']");
			elementId = '#statusAdv';
		}

		if (!Ext.isEmpty(menuRef)) {
			var itemArray = $(elementId + " option");

			if (data === 'All') {
				$(elementId + ' option').prop('selected', true);
			} else {
				$(elementId + ' option').prop('selected', false);
				$(elementId).multiselect("refresh");
			}

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
	editFilterData : function(grid, rowIndex) {
		var me = this;
		me.resetAllFields();
		me.filterCodeValue = null;
		var record = grid.getStore().getAt(rowIndex);
		var filterCode = record.data.filterName;

		var filterCodeRef = $("input[type='text'][id='saveFilterAs']");
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
	deleteFilterSet : function(filterCode) {
		var me = this;
		var objFilterName;
		var savedFilterCombobox = me.getFilterView()
				.down('combo[itemId="savedFiltersCombo"]');
		var objComboStore = null;
		if (!Ext.isEmpty(filterCode))
			objFilterName = filterCode;
		me.filterCodeValue = null;

		if (this.savePrefAdvFilterCode == objFilterName) {
			this.advFilterData = [];
			me.filterApplied = 'A';
			// me.applyFilter();
			var jsonArray = [];
			jsonArray.push(me.resetDefaultDateJson());
			this.advFilterData = jsonArray;
			me.savedFilterVal = '';
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
	deleteFilterCodeFromDb : function(objFilterName, advGridstore) {
		var me = this;
		var strURL = 'userfilters/invoiceGridFilter/{0}/remove.srvc?';
		if (!Ext.isEmpty(objFilterName)) {
			var strUrl = strURL + csrfTokenName + '=' + csrfTokenValue;
			strUrl = Ext.String.format(strUrl, objFilterName);

			Ext.Ajax.request({
						url : strUrl,
						method : "POST",
						success : function(response) {
							// me.getAllSavedAdvFilterCode();
							me.sendUpdatedOrderJsonToDb(advGridstore);
							// me.reloadFilters(advGridstore);
						},
						failure : function(response) {
							console.log("Error Occured");
						}
					});
		}
	},
	reloadFilters : function(store) {
		store.reload({
					callback : function() {
						var storeGrid = filterGridStore();
						store.loadRecords(storeGrid.getRange(0, storeGrid
												.getCount()), {
									addRecords : false
								});

					}
				});
	},
	viewFilterData : function(grid, rowIndex) {
		var me = this;
		me.resetAllFields();
		me.filterCodeValue = null;
		var record = grid.getStore().getAt(rowIndex);
		var filterCode = record.data.filterName;
		var applyAdvFilter = false;
		me.getSavedFilterData(filterCode, this.populateSavedFilter,
				applyAdvFilter);
		changeAdvancedFilterTab(1);
	},
	populateAndDisableSavedFilter : function(filterCode, filterData,
			applyAdvFilter) {
		var me = this;
		var objCreateNewFilterPanel = me.getCreateNewFilter();
		for (i = 0; i < filterData.filterBy.length; i++) {
			var fieldName = filterData.filterBy[i].field;

			var fieldVal = filterData.filterBy[i].value1;

			var fieldOper = filterData.filterBy[i].operator;
			
			if (fieldName === "InvoiceNumber") {
				$('#invoiceNumber').val(fieldVal);
			} 
			else if (fieldName === "ObligationIdAct")
			{
				$('#obligationIdAct').val(fieldVal);
			}
			else if (fieldName === "InvoiceDueDate")
			{
				if (!Ext.isEmpty(fieldVal)) 
				{
					fieldVal = Ext.util.Format.date(Ext.Date.parse(fieldVal, 'Y-m-d'),strExtApplicationDateFormat);
				}				
				var fieldValToDate = filterData.filterBy[i].value2;
				var label = filterData.filterBy[i].dropdownLabel;
				if (!Ext.isEmpty(fieldValToDate)) 
				{
					fieldValToDate = Ext.util.Format.date(Ext.Date.parse(fieldValToDate, 'Y-m-d'),strExtApplicationDateFormat);
				}
				if (fieldOper === 'eq')
				{
					$('#paymentDueDateAdv').val(fieldVal);
					$('#entryDataPicker').val(fieldVal);
				}
				else if (fieldOper === 'bt')
				{
					$('#paymentDueDateAdv').datepick('setDate', [fieldVal, fieldValToDate]);
					$('#entryDataPicker').datepick('setDate', [fieldVal, fieldValToDate]);
				}	
				selectedPaymentDueDate = {
						operator : fieldOper,
						fromDate : fieldVal,
						toDate : fieldValToDate,
						dateLabel : label
					};
				$('label[for="entryDateLabel"]').text(getLabel('lblPayDueDate', 'Payment Due Date')
					+ " (" + selectedPaymentDueDate.dateLabel + ")");
				entry_date_opt = label;
			}
			else if (fieldName === "Status")
			{
				me.checkUnCheckMenuItems(fieldName, fieldVal);
			}

			if (fieldName === 'filterCode') {
				var fieldType = 'textfield';
			} else if (fieldName === 'Status' || fieldName === 'InvoiceNumber'
					|| fieldName === 'ObligationIdAct') {
				var fieldType = 'combobox';
			} else if (fieldName === 'InvoiceDueDate') {
				var fieldType = 'datefield';
			}
			var fieldObj = objCreateNewFilterPanel.down('' + fieldType
					+ '[itemId="' + fieldName + '"]');

			//fieldObj.setValue(fieldVal);

		}
		objCreateNewFilterPanel.down('datefield[itemId="InvoiceDueDate"]')
				.setReadOnly(true);
		objCreateNewFilterPanel.down('textfield[itemId="InvoiceNumber"]')
				.setReadOnly(true);
		objCreateNewFilterPanel.down('textfield[itemId="ObligationIdAct"]')
				.setReadOnly(true);
		objCreateNewFilterPanel.down('combobox[itemId="Status"]')
				.setReadOnly(true);
		objCreateNewFilterPanel.down('textfield[itemId="filterCode"]')
				.setReadOnly(true);
				
		if (!Ext.isEmpty(filterCode)) {
			$('#savedFilterAs').val(filterCode);
		}
		
		if (!Ext.isEmpty(filterCode)) {
			$('#saveFilterAs').val(filterCode);
			$("#msSavedFilter option[value='" + filterCode + "']").attr(
					"selected", true);
			$("#msSavedFilter").multiselect("refresh");
			var saveFilterChkBox = $("input[type='checkbox'][id='saveFilterChkBox']");
			saveFilterChkBox.prop('checked', true);
			markAdvFilterNameMandatory('saveFilterChkBox','advFilterNameLabel','saveFilterAs');
		}
		if (applyAdvFilter) {
			//me.filterApplied = 'A';
			//me.setDataForFilter();
			me.applyAdvancedFilter();
		}
	},
	advanceFilterPopUp : function(btn) {
		var me = this;
		var objCreateNewFilterPanel = me.getCreateNewFilter();
		var filterDetailsTab = me.getFilterDetailsTab();
		filterDetailsTab.setTitle('Create New Filter');

		var saveSearchBtn = me.getSaveSearchBtn();
		if (saveSearchBtn) {
			saveSearchBtn.show();
		}
		objCreateNewFilterPanel.resetAllFields(objCreateNewFilterPanel);
		objCreateNewFilterPanel.enableDisableFields(objCreateNewFilterPanel,
				false);
		objCreateNewFilterPanel.removeReadOnly(objCreateNewFilterPanel, false);

		me.filterCodeValue = null;

		if (!Ext.isEmpty(me.objAdvFilterPopup)) {
			me.objAdvFilterPopup.show();
			var objTabPanel = me.getAdvanceFilterTabPanel();
			objTabPanel.setActiveTab(1);
		} else {
			me.objAdvFilterPopup = Ext
					.create('GCP.view.LoanInvoiceAdvancedFilterPopup');
			var objTabPanel = me.getAdvanceFilterTabPanel();
			objTabPanel.setActiveTab(1);
			me.objAdvFilterPopup.show();
		}
	},
	handleViewPaymentLoadGridData : function(grid, invoiceNmbr, url, pgSize,
			newPgNo, oldPgNo, sorter) {
		var me = this;
		var strUrl = grid.generateUrl(url, pgSize, newPgNo, oldPgNo, sorter);
		strUrl += '&$argString=' + invoiceNmbr + "&" + csrfTokenName + "="
				+ csrfTokenValue;
		grid.loadGridData(strUrl, null);
	},
	viewPaymentPopUp : function(record) {
		var me = this;
		me.handleViewPaySmartGridConfig(record);
		if (!Ext.isEmpty(me.objViewPayPopup)) {
			me.objViewPayPopup.show();
		} else {
			me.objViewPayPopup = Ext.create('GCP.view.LoanInvoiceViewPayment');
			me.objViewPayPopup.show();
		}
		Ext.getCmp("cancelBtn").focus();
	},
	newPaymentPopUp : function(record) {
		var me = this;
		me.getNewPaymentPopupValue(record);
		if (!Ext.isEmpty(me.objNewPayPopup)) {
			me.objNewPayPopup.show();
		} else {
			me.objNewPayPopup = Ext
					.create('GCP.view.LoanInvoicePayPaymentPopup');
			me.objNewPayPopup.show();
		}
	},
	getNewPaymentPopupValue : function(record) {
		var me = this;
		var objCreateNewPaymentPanel = me.getCreateNewPayment();
		me.getLoanAccountLabel().setText("Loan A/C :\t\t"
				+ record.get('accountNumber'));
		me.getInvoiceLabel().setText("Invoice For Installmet/Interest# : "
				+ record.get('invoiceNumber') + " , Dated :"
				+ record.get('dateOfNote') + " , Due Date :"
				+ record.get('dueDate'));
		objCreateNewPaymentPanel.down('textfield[itemId="currentAmt"]')
				.setValue(record.get('amountDue'));
		objCreateNewPaymentPanel.down('textfield[itemId="pastAmountDue"]')
				.setValue(record.get('amtPastDue'));
		objCreateNewPaymentPanel.down('textfield[itemId="totalAmount"]')
				.setValue(record.get('totalAmtDue'));
		objCreateNewPaymentPanel.down('textfield[itemId="accountNumber"]')
				.setValue(record.get('accountNumber'));
		objCreateNewPaymentPanel.down('textfield[itemId="invoiceNumber"]')
				.setValue(record.get('invoiceNumber'));
		objCreateNewPaymentPanel.down('textfield[itemId="routingNumber"]')
				.setValue(record.get('routingNumber'));
	},
	doHandleGridRowSelectionChange : function(groupInfo, subGroupInfo, objGrid,
			objRecord, intRecordIndex, arrSelectedRecords, jsonData) {
		var me = this;
		var objGroupView = me.getGroupView();
		var buttonMask = me.strDefaultMask;
		var blnAuthInstLevel = false;
		var maskArray = new Array(), actionMask = '', objData = null;;

		if (!Ext.isEmpty(jsonData) && !Ext.isEmpty(jsonData.d.__buttonMask))
			buttonMask = jsonData.d.__buttonMask;

		var isSameUser = true;
		var isDisabled = false;
		var isSubmitted = false;
		maskArray.push(buttonMask);
		for (var index = 0; index < arrSelectedRecords.length; index++) {
			objData = arrSelectedRecords[index];
			maskArray.push(objData.get('__metadata').__rightsMap);
			if (objData.raw.makerId === USER) {
				isSameUser = false;
			}
		}
		actionMask = doAndOperation(maskArray, 10);
		me.enableDisableGroupActions(actionMask, isSameUser, isDisabled,
				isSubmitted);
		// objGroupView.handleGroupActionsVisibility(actionMask);
	},
	searchTrasactionChange : function() {
		var me = this;
		var searchValue = me.getSearchTxnTextInput().value;
		var anyMatch = me.getMatchCriteria().getValue();
		if ('anyMatch' === anyMatch.searchOnPage) {
			anyMatch = false;
		} else {
			anyMatch = true;
		}

		var grid = me.getLoanInvoiceNewGridRef();
		grid.view.refresh();

		// detects html tag
		var tagsRe = /<[^>]*>/gm;
		// DEL ASCII code
		var tagsProtect = '\x0f';
		// detects regexp reserved word
		var regExpProtect = /\\|\/|\+|\\|\.|\[|\]|\{|\}|\?|\$|\*|\^|\|/gm;

		if (searchValue !== null) {
			searchRegExp = new RegExp(searchValue, 'g' + (anyMatch ? '' : 'i'));

			if (!Ext.isEmpty(grid)) {
				var store = grid.store;

				store.each(function(record, idx) {
					var td = Ext.fly(grid.view.getNode(idx)).down('td'), cell, matches, cellHTML;
					while (td) {
						cell = td.down('.x-grid-cell-inner');
						matches = cell.dom.innerHTML.match(tagsRe);
						cellHTML = cell.dom.innerHTML.replace(tagsRe,
								tagsProtect);

						if (cellHTML === '&nbsp;') {
							td = td.next();
						} else {
							// populate indexes array, set
							// currentIndex, and
							// replace
							// wrap matched string in a span
							cellHTML = cellHTML.replace(searchRegExp, function(
											m) {
										return '<span class="xn-livesearch-match">'
												+ m + '</span>';
									});
							// restore protected tags
							Ext.each(matches, function(match) {
								cellHTML = cellHTML.replace(tagsProtect, match);
							});
							// update cell html
							cell.dom.innerHTML = cellHTML;
							td = td.next();
						}
					}
				}, me);
			}
		}
	},
	handleGroupActions : function(strAction, grid, record, strActionType) {
		var me = this;
		// var strAction = !Ext.isEmpty( btn.actionName ) ? btn.actionName :
		// btn.itemId;
		var strUrl = Ext.String.format('LoanInvoice/{0}.srvc?', strAction);
		strUrl = strUrl + csrfTokenName + "=" + csrfTokenValue;
		if (strAction === 'reject') {
			this.showRejectVerifyPopUp(strAction, strUrl, record);
		} else if (strAction === 'pay') {
			payInvoice(record);
		} else {
			if ('Y' === chrApprovalConfirmationAllowed
					&& strAction === 'accept')
				this.showApprovalConfirmationView(strUrl, '', record);
			else
				this.preHandleGroupActions(strUrl, '', record);
		}
	},
		showRejectVerifyPopUp : function(strAction, strActionUrl, record) {
			var me = this;
			var titleMsg = '', fieldLbl = '';
			if (strAction === 'reject') {
				fieldLbl = getLabel('rejectRemarkPopUpTitle','Please Enter Reject Remark');
				titleMsg = getLabel('rejectRemarkPopUpFldLbl', 'Reject Remark');
			}
			var msgbox = Ext.Msg.show(
					{
						title : titleMsg,
						msg : fieldLbl,
						buttons : Ext.Msg.OKCANCEL,
						multiline : 4,
						bodyPadding : 0,
						cls:'t7-popup',
						width: 355,
						height : 270,
						fn : function(btn, text) {
							if (btn == 'ok') {
								me.preHandleGroupActions(strActionUrl, text,record);
							}
						}
					});
			msgbox.textArea.enforceMaxLength = true;
			msgbox.textArea.inputEl.set({
						maxLength : 255
					});
		},
		preHandleGroupActions : function(strUrl, remark, record) {

		var me = this;
		var grid = this.getLoanInvoiceNewGridRef();
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
						url : strUrl,
						method : 'POST',
						jsonData : Ext.encode(arrayJson),
						success : function(response) {
							// TODO : Action Result handling to be done
							// here
							me.enableDisableGroupActions('000', true);
							// grid.refreshData();
							me.refreshData();
						},
						failure : function() {
							var errMsg = "";
							Ext.MessageBox.show({
										title : getLabel('filterPopupTitle',
												'Error'),
										msg : getLabel('filterPopupMsg',
												'Error while fetching data..!'),
										buttons : Ext.MessageBox.OK,
										icon : Ext.MessageBox.ERROR
									});
						}
					});
		}

	},
	/*
	 * isRowIconVisible : function( store, record, jsonData, itmId, maskPosition ) {
	 * var maskSize = 11; var maskArray = new Array(); var actionMask = ''; var
	 * rightsMap = record.data.__metadata.__rightsMap; var buttonMask = ''; var
	 * retValue = true; var bitPosition = ''; if( !Ext.isEmpty( maskPosition ) ) {
	 * bitPosition = parseInt( maskPosition ) - 1; maskSize = maskSize; } if(
	 * !Ext.isEmpty( jsonData ) && !Ext.isEmpty( jsonData.d.__buttonMask ) )
	 * buttonMask = jsonData.d.__buttonMask; maskArray.push( buttonMask );
	 * maskArray.push( rightsMap ); actionMask = doAndOperation( maskArray,
	 * maskSize );
	 * 
	 * var isSameUser = true; if( record.raw.makerId === USER ) { isSameUser =
	 * false; } if( Ext.isEmpty( bitPosition ) ) return retValue; retValue =
	 * isActionEnabled( actionMask, bitPosition );
	 * 
	 * if( ( maskPosition === 6 && retValue ) ) { retValue = retValue &&
	 * isSameUser; } else if( maskPosition === 7 && retValue ) { retValue =
	 * retValue && isSameUser; } return retValue; },
	 */
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
	enableDisableGroupActions : function(actionMask, isSameUser, isDisabled,
			isSubmitted) {
		var me = this;
		var objGroupView = me.getGroupView();
		var actionBar = objGroupView
				.down('toolbar[itemId="groupActionToolBar"]');
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
							} else if (item.maskPosition === 8 && blnEnabled) {
								blnEnabled = blnEnabled && isDisabled;
							} else if (item.maskPosition === 9 && blnEnabled) {
								blnEnabled = blnEnabled && !isDisabled;
							} else if (item.maskPosition === 10 && blnEnabled) {
								blnEnabled = blnEnabled
										&& (isSubmitted != undefined && !isSubmitted);
							}
							item.setDisabled(!blnEnabled);
						}
					});
		}
	},
	/*
	 * getColumns : function( arrColsPref, objWidthMap ) { var me = this; var
	 * arrCols = new Array(), objCol = null, cfgCol = null; arrCols.push(
	 * me.createGroupActionColumn() ); arrCols.push( me.createActionColumn() );
	 * if( !Ext.isEmpty( arrColsPref ) ) { for( var i = 0 ; i <
	 * arrColsPref.length ; i++ ) { objCol = arrColsPref[ i ]; cfgCol = {};
	 * cfgCol.colHeader = objCol.colHeader; cfgCol.colId = objCol.colId;
	 * cfgCol.hidden = objCol.hidden; cfgCol.locked = objCol.locked; if(
	 * !Ext.isEmpty( objCol.hidden ) ) { cfgCol.hidden = objCol.hidden; }
	 * 
	 * if( !Ext.isEmpty( objCol.colType ) ) { cfgCol.colType = objCol.colType;
	 * if( cfgCol.colType === "number" ) cfgCol.align = 'right'; } if(
	 * objCol.colId === 'invoiceNumber' ) { cfgCol.width = 190;
	 * cfgCol.fnSummaryRenderer = function( value, summaryData, dataIndex, colId ) {
	 * var strRet = ''; var grid = me.getLoanInvoiceNewGridRef(); if(
	 * !Ext.isEmpty( grid ) && !Ext.isEmpty( grid.store ) ) { var data =
	 * grid.store.proxy.reader.jsonData; if( data && data.d && data.d.__subTotal ) {
	 * strSubTotal = data.d.__subTotal; } } if( null != strSubTotal &&
	 * strSubTotal != ' ' ) { strRet = getLabel( 'subTotal', 'Sub Total' ); }
	 * return strRet; } } if( objCol.colId === 'paidAmount' ) { cfgCol.align =
	 * 'right'; cfgCol.width = 100; cfgCol.fnSummaryRenderer = function( value,
	 * summaryData, dataIndex, colId ) { var grid =
	 * me.getLoanInvoiceNewGridRef(); if( !Ext.isEmpty( grid ) && !Ext.isEmpty(
	 * grid.store ) ) { var data = grid.store.proxy.reader.jsonData; if( data &&
	 * data.d && data.d.__subTotal ) { if( data.d.__subTotal != ' ' ) strRet =
	 * data.d.__subTotal; } } return strRet; } } if( objCol.colId ===
	 * 'amountDue' ) { cfgCol.align = 'right'; } cfgCol.width = !Ext.isEmpty(
	 * objCol.width ) ? objCol.width : 120; if(cfgCol.width === 120)
	 * cfgCol.width = !Ext.isEmpty( objWidthMap[ objCol.colId ] ) ? objWidthMap[
	 * objCol.colId ] : 120;
	 * 
	 * cfgCol.fnColumnRenderer = me.columnRenderer; arrCols.push( cfgCol ); } }
	 * return arrCols; },
	 */
	getViewPaymentColumns : function(arrColsPref, objWidthMap) {
		var me = this;
		var arrCols = new Array(), objCol = null, cfgCol = null;
		if (!Ext.isEmpty(arrColsPref)) {
			for (var i = 0; i < arrColsPref.length; i++) {
				objCol = arrColsPref[i];
				cfgCol = {};
				cfgCol.colHeader = objCol.colHeader;
				cfgCol.colId = objCol.colId;
				cfgCol.draggable =false;
				cfgCol.resizable =false;
				if(objCol.colId =='requestStatusDesc')
					cfgCol.sortable =false;
				if (!Ext.isEmpty(objCol.colType)) {
					cfgCol.colType = objCol.colType;
					if (cfgCol.colType === "number")
						cfgCol.align = 'right';
				}

				cfgCol.width = !Ext.isEmpty(objWidthMap[objCol.colId])
						? objWidthMap[objCol.colId]
						: 120;

				cfgCol.fnColumnRenderer = me.columnRenderer;
				arrCols.push(cfgCol);
			}
		}
		return arrCols;
	},
	columnRenderer : function(value, meta, record, rowIndex, colIndex, store,
			view, colId) {
		var strRetValue = "";
		strRetValue = value;
		if (!Ext.isEmpty(value))
			meta.tdAttr = 'title="' + value + '"';
		return strRetValue;
	},
	createGroupActionColumn : function() {
		var me = this;
		var objActionCol = {
			colType : 'actioncontent',
			colId : 'groupaction',
			width : 80,
			align : 'right',
			locked : true,
			items : [{
						itemId : 'pay',
						text : 'Pay Invoice',
						toolTip : getLabel('actionPay', 'Pay Invoice'),
						maskPosition : 1
					}]
		};
		return objActionCol;
	},
	createActionColumn : function() {
		var me = this;
		var objActionCol = {
			colType : 'actioncontent',
			colId : 'action',
			width : 80,
			align : 'right',
			locked : true,
			sortable : false,
			items : [{
						itemId : 'btnView',
						itemCls : 'grid-row-action-icon icon-view',
						toolTip : getLabel('viewRecordToolTip', 'View Record'),
						maskPosition : 2
					}, {
						itemId : 'btnViewPayment',
						itemCls : 'grid-row-action-icon icon-clone',
						itemLabel : getLabel('actionViewPayment',
								'View Payment'),
						toolTip : getLabel('viewPaymentToolTip', 'View Payment'),
						maskPosition : 2
					}]
		};
		return objActionCol;
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
					target : 'imgFilterInfoGridView',
					listeners : {
						// Change content dynamically depending on which
						// element
						// triggered the show.
						beforeshow : function(tip) {
							var dateFilter = me.dateFilterLabel;
							var client = '';
							var advfilter = me.showAdvFilterCode;
							if (advfilter == '' || advfilter == null) {
								advfilter = getLabel('none', 'None');
							}
							if ((me.clientDesc == "" || me.clientDesc == null)
									&& entityType == 0)
								client = 'None';
							else if ((me.clientDesc == "" || me.clientDesc == null)
									&& entityType == 1)
								client = 'All Companies';
							else
								client = me.clientDesc;
							tip
									.update(getLabel('grid.column.company',
											'Company Name')
											+ ' : '
											+ client
											+ '<br>'
											+ getLabel('date', 'Date')
											+ ' : '
											+ dateFilter
											+ '<br/>'
											+ getLabel('advancedFilter',
													'Advance Filter')
											+ ':'
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
		var objDateParams = me.getDateParam(index,null);
		var datePickerRef = $('#entryDataPicker');
		if (!Ext.isEmpty(me.dateFilterLabel)) {
			me.getEntryDateLabel().setText(getLabel('lblPayDueDate','Payment Due Date')
					+ " (" + me.dateFilterLabel + ")");
		}
		
		var vFromDate = Ext.util.Format.date(Ext.Date.parse(
						objDateParams.fieldValue1, 'Y-m-d'),
				strExtApplicationDateFormat);
		var vToDate = Ext.util.Format.date(Ext.Date.parse(
						objDateParams.fieldValue2, 'Y-m-d'),
				strExtApplicationDateFormat);
		if (index == '13')
		{
			if (objDateParams.operator == 'eq')
			{
				datePickerRef.datepick('setDate', vFromDate);
			} 
			else
			{
				datePickerRef.datepick('setDate', [vFromDate, vToDate]);
			}
		} else
		{
			if (index === '1' || index === '2')
			{
				datePickerRef.datepick('setDate', vFromDate);
			}
			else 
			{
				datePickerRef.datepick('setDate', [vFromDate, vToDate]);
			}
		}
		if (objDateParams.operator == 'eq')
				dateToField = "";
			else
				dateToField = vToDate;
			
		selectedPaymentDueDate = {
				operator : objDateParams.operator,
				fromDate : vFromDate,
				toDate : dateToField,
				dateLabel : me.dateFilterLabel
			};
		me.handleEntryDateSync('Q', me.getEntryDateLabel().text, " (" + me.dateFilterLabel + ")", datePickerRef);
	},
	handleEntryDateSync : function(valueChangedAt, sourceLable,
			sourceToolTipText, sourceTextRef)
	{
		var me = this, labelToChange, valueControlToChange, updatedDateValue;
		me.entryDateChanged = true;		
		labelToChange = (valueChangedAt === 'Q') ? $('label[for="entryDateLabel"]') : me.getEntryDateLabel();
		valueControlToChange = (valueChangedAt === 'Q') ? $('#paymentDueDateAdv') : $('#entryDataPicker');
		updatedDateValue = sourceTextRef.getDateRangePickerValue();
		if(labelToChange && valueControlToChange) {
			if(valueChangedAt === 'Q') {
				labelToChange.text(sourceLable);
				updateToolTip('entryDate', sourceToolTipText);
			}else {
				labelToChange.setText(sourceLable);
			}
			if(!Ext.isEmpty(updatedDateValue)) {
				valueControlToChange.datepick('setDate', updatedDateValue);
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
			if(null!=dateType && 'paymentDueDateAdv' === dateType && !isEmpty(me.datePickerSelectedEffectiveAdvDate))
			{
					if (me.datePickerSelectedEffectiveAdvDate.length == 1) {
						fieldValue1 = Ext.Date.format(me.datePickerSelectedEffectiveAdvDate[0],
								strSqlDateFormat);
						fieldValue2 = fieldValue1;
						operator = 'eq';
					} else if (me.datePickerSelectedEffectiveAdvDate.length == 2) {
						fieldValue1 = Ext.Date.format(me.datePickerSelectedEffectiveAdvDate[0],
								strSqlDateFormat);
						fieldValue2 = Ext.Date.format(me.datePickerSelectedEffectiveAdvDate[1],
								strSqlDateFormat);
						operator = 'bt';
					}
			}	
			else
			{
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
		}

		retObj.fieldValue1 = fieldValue1;
		retObj.fieldValue2 = fieldValue2;
		retObj.operator = operator;
		return retObj;
	},
	onLoanInvoiceNewInformationViewRender : function() {
		var me = this;
		var accSummInfoViewRef = me.getLoanInvoiceNewGridInformationViewRef();
		accSummInfoViewRef.createSummaryLowerPanelView();
	},
	handleSavePreferences : function() {
		var me = this;
		var arrPref = me.getPreferencesToSave(false);
		if (arrPref) {
			me.preferenceHandler.savePagePreferences(me.strPageName, arrPref,
					me.postHandleSavePreferences, null, me, true);
		}
		me.disablePreferencesButton("savePrefMenuBtn", true);
		me.disablePreferencesButton("clearPrefMenuBtn", false);
	},
	handleClearPreferences : function() {
		var me = this;
		me.preferenceHandler.clearPagePreferences(me.strPageName, null,
				me.postHandleClearPreferences, null, me, true);
		me.disablePreferencesButton("savePrefMenuBtn", false);
		me.disablePreferencesButton("clearPrefMenuBtn", true);
	},
	postHandleClearPreferences : function(data, args, isSuccess) {
		var me = this;
	},
	paymentDateChange : function(btn, opts) {
		var me = this;
		me.payDueDateFilterVal = btn.btnValue;
		me.payDueDateFilterLabel = btn.text;
		me.handleAdvPayDueDateChange(btn.btnValue);
	},
	handleAdvPayDueDateChange : function(index) {
		var me = this;
		var dateToField;
		var objDateParams = me.getDateParam(index, 'paymentDueDateAdv');

		if (!Ext.isEmpty(me.payDueDateFilterLabel)) {
			$('label[for="entryDateLabel"]').text(getLabel('lblPayDueDate', 'Payment Due Date')
					+ " (" + me.payDueDateFilterLabel + ")");
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
				$('#paymentDueDateAdv').datepick('setDate', vFromDate);
			} else {
				$('#paymentDueDateAdv').datepick('setDate', [vFromDate, vToDate]);
			}
			if (filterOperator == 'eq')
				dateToField = "";
			else
				dateToField = vToDate;
			selectedPaymentDueDate = {
				operator : filterOperator,
				fromDate : vFromDate,
				toDate : dateToField,
				dateLabel : me.payDueDateFilterLabel
			};
		} else {
			if (index === '1' || index === '2') {
				$('#paymentDueDateAdv').datepick('setDate', vFromDate);
			} else {
				$('#paymentDueDateAdv').datepick('setDate', [vFromDate, vToDate]);
				$('#entryDataPicker').datepick('setDate', [vFromDate, vToDate]);
			}
			if (filterOperator == 'eq')
				dateToField = "";
			else
				dateToField = vToDate;
			selectedPaymentDueDate = {
				operator : filterOperator,
				fromDate : vFromDate,
				toDate : dateToField,
				dateLabel : me.payDueDateFilterLabel
			};
		}
	},
	getPreferencesToSave : function(localSave) {
		var me = this;
		var groupView = me.getGroupView();
		var grid = null;
		var objPref = {};
		var arrCols = null, objCol = null, arrColPref = null, arrPref = [], arrPref1 = [], objFilterPref = null;
		var groupInfo = null, subGroupInfo = null;
		/*
		 * var infoPanel = me.getLoanInvoiceNewGridInformationViewRef();
		 * 
		 * var filterViewCollapsed =
		 * (me.getLoanInvoiceNewFilterViewType().getCollapsed() === false) ?
		 * false : true; var infoViewCollapsed =
		 * infoPanel.down('container[itemId="summInfoShowHideGridView"]').hasCls("icon_expand_summ");
		 */

		if (groupView) {
			grid = groupView.getGrid();
			var gridState = grid.getGridState();
			groupInfo = groupView.getGroupInfo() || '{}';
			subGroupInfo = groupView.getSubGroupInfo() || {};

			// TODO : Save Active tab for group by "Advanced Filter" to be
			// discuss
			if (groupInfo.groupTypeCode && subGroupInfo.groupCode
					&& groupInfo.groupTypeCode !== 'LONINVOICE_OPT_ADVFILTER') {
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
								'sortState' : gridState.sortState
							}
						});

			}
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
		// var strUrl = me.urlGridFilterPref;
		var advFilterCode = null;
		var infoPanel = me.getLoanInvoiceNewGridInformationViewRef();
		var objFilterPref = {};
		// var filterViewCollapsed =
		// (me.getLoanInvoiceNewFilterViewType().getCollapsed() === false) ?
		// false : true;
		// var infoViewCollapsed =
		// infoPanel.down('container[itemId="summInfoShowHideGridView"]').hasCls("icon_expand_summ");
		if (!Ext.isEmpty(me.savePrefAdvFilterCode)) {
			advFilterCode = me.savePrefAdvFilterCode;
		}
		var objQuickFilterPref = {};
		objQuickFilterPref.entryDate = me.dateFilterVal;
		if (me.dateFilterVal === '7') {
			if (!Ext.isEmpty(me.dateFilterFromVal)
					&& !Ext.isEmpty(me.dateFilterToVal)) {

				objQuickFilterPref.fromDate = me.dateFilterFromVal;
				objQuickFilterPref.toDate = me.dateFilterToVal;
			} else {
				var strSqlDateFormat = 'Y-m-d';
				var frmDate = me.getFromEntryDate().getValue();
				var toDate = me.getToEntryDate().getValue();
				fieldValue1 = Ext.util.Format.date(frmDate, 'Y-m-d');
				fieldValue2 = Ext.util.Format.date(toDate, 'Y-m-d');
				objQuickFilterPref.fromDate = fieldValue1;
				objQuickFilterPref.toDate = fieldValue2;
			}
		}

		objFilterPref.advFilterCode = advFilterCode;
		objFilterPref.quickFilter = objQuickFilterPref;
		objFilterPref.filterClientSelected = me.clientCode;
		objFilterPref.filterClientDesc = me.clientDesc;
		if (!Ext.isEmpty(me.dateFilterVal)) {
			objFilterPref.dateIndex = me.dateFilterVal;
		}
		return objFilterPref;
	},
	saveFilterPreferences : function() {
		var me = this;
		var strUrl = me.urlGridFilterPref;
		var advFilterCode = null;
		var infoPanel = me.getLoanInvoiceNewGridInformationViewRef();
		var objFilterPref = {};
		// var filterViewCollapsed =
		// (me.getLoanInvoiceNewFilterViewType().getCollapsed() === false) ?
		// false : true;
		// var infoViewCollapsed =
		// infoPanel.down('container[itemId="summInfoShowHideGridView"]').hasCls("icon_expand_summ");
		if (!Ext.isEmpty(me.savePrefAdvFilterCode)) {
			advFilterCode = me.savePrefAdvFilterCode;
		}
		var objQuickFilterPref = {};
		objQuickFilterPref.entryDate = me.dateFilterVal;
		if (me.dateFilterVal === '7') {
			if (!Ext.isEmpty(me.dateFilterFromVal)
					&& !Ext.isEmpty(me.dateFilterToVal)) {

				objQuickFilterPref.fromDate = me.dateFilterFromVal;
				objQuickFilterPref.toDate = me.dateFilterToVal;
			} else {
				var strSqlDateFormat = 'Y-m-d';
				var frmDate = me.getFromEntryDate().getValue();
				var toDate = me.getToEntryDate().getValue();
				fieldValue1 = Ext.util.Format.date(frmDate, 'Y-m-d');
				fieldValue2 = Ext.util.Format.date(toDate, 'Y-m-d');
				objQuickFilterPref.fromDate = fieldValue1;
				objQuickFilterPref.toDate = fieldValue2;
			}
		}

		objFilterPref.advFilterCode = advFilterCode;
		objFilterPref.quickFilter = objQuickFilterPref;
		objFilterPref.filterClientSelected = me.clientCode;
		objFilterPref.filterClientDesc = me.clientDesc;
		// objFilterPref.filterPanelCollapsed = filterViewCollapsed;
		// objFilterPref.infoPanelCollapsed = infoViewCollapsed;

		if (objFilterPref)
			Ext.Ajax.request({
						url : strUrl + csrfTokenName + "=" + csrfTokenValue,
						method : 'POST',
						jsonData : Ext.encode(objFilterPref),
						success : function(response) {
							var data = Ext.decode(response.responseText);
							var title = getLabel('SaveFilterPopupTitle',
									'Message');
							if (data.d.preferences
									&& data.d.preferences.success === 'Y') {
								Ext.MessageBox.show({
											title : title,
											msg : getLabel('prefSavedMsg',
													'Preferences Saved Successfully'),
											buttons : Ext.MessageBox.OK,
											cls : "t7-popup",
											icon : Ext.MessageBox.INFO
										});
								me.disablePreferencesButton("savePrefMenuBtn",
										true);
								me.disablePreferencesButton("clearPrefMenuBtn",
										false);
							} else if (data.d.preferences
									&& data.d.preferences.success === 'N'
									&& data.d.error
									&& data.d.error.errorMessage) {
								if (!Ext.isEmpty(me.getBtnSavePreferences()))
									me.disablePreferencesButton(
											"savePrefMenuBtn", true);
								Ext.MessageBox.show({
											title : title,
											msg : data.d.error.errorMessage,
											cls : 't7-popup',
											buttons : Ext.MessageBox.OK,
											icon : Ext.MessageBox.ERROR
										});
							}
						},
						failure : function() {
							var errMsg = "";
							Ext.MessageBox.show({
										title : getLabel('filterPopupTitle',
												'Error'),
										msg : getLabel('filterPopupMsg',
												'Error while fetching data..!'),
										buttons : Ext.MessageBox.OK,
										cls : 't7-popup',
										icon : Ext.MessageBox.ERROR
									});
						}
					});
	},
	/*
	 * clearWidgetPreferences : function() { var me = this, objPref = {},
	 * arrCols = null, objCol = null,objWdgtPref = null; var strUrl =
	 * me.commonPrefUrl+"?$clear=true"; var objGroupView=me.getGroupView(); var
	 * grid = objGroupView.getGrid(); var arrColPref = new Array(); var arrPref =
	 * new Array(); if (!Ext.isEmpty(grid)) { arrCols =
	 * grid.headerCt.getGridColumns(); for (var j = 0; j < arrCols.length; j++) {
	 * objCol = arrCols[ j ]; if( !Ext.isEmpty( objCol ) && !Ext.isEmpty(
	 * objCol.itemId ) && objCol.itemId.startsWith( 'col_' ) && !Ext.isEmpty(
	 * objCol.xtype ) && objCol.xtype !== 'actioncolumn' && objCol.itemId !==
	 * 'col_textaction' && objCol.dataIndex != null) arrColPref.push( { colId :
	 * objCol.dataIndex, colHeader : objCol.text, colHidden : objCol.hidden } ); }
	 * objWdgtPref = {}; objWdgtPref.pgSize = grid.pageSize;
	 * objWdgtPref.gridCols = arrColPref; arrPref.push({ "module" : "",
	 * "jsonPreferences" : objWdgtPref }); } if (arrPref) { Ext.Ajax.request({
	 * url : strUrl, method : 'POST', //jsonData : Ext.encode(arrPref), success :
	 * function(response) { var responseData = Ext
	 * .decode(response.responseText); var isSuccess; var title, strMsg,
	 * imgIcon; if (responseData.d.preferences &&
	 * responseData.d.preferences.success) isSuccess =
	 * responseData.d.preferences.success; if (isSuccess && isSuccess === 'N') {
	 * if (!Ext.isEmpty(me.getBtnSavePreferences()))
	 * me.toggleSavePrefrenceAction(true); title =
	 * getLabel('SaveFilterPopupTitle', 'Message'); strMsg =
	 * responseData.d.preferences.error.errorMessage; imgIcon =
	 * Ext.MessageBox.ERROR; Ext.MessageBox.show({ title : title, msg : strMsg,
	 * width : 200, cls:'t7-popup', buttons : Ext.MessageBox.OK, icon : imgIcon
	 * }); } else { Ext.MessageBox.show( { title : title, msg : getLabel(
	 * 'prefClearedMsg', 'Preferences Cleared Successfully' ), buttons :
	 * Ext.MessageBox.OK, cls : 't7_popup', icon : Ext.MessageBox.INFO } );
	 * me.disablePreferencesButton("savePrefMenuBtn",false);
	 * me.disablePreferencesButton("clearPrefMenuBtn",true); } }, failure :
	 * function() { var errMsg = ""; Ext.MessageBox.show({ title : getLabel(
	 * 'instrumentErrorPopUpTitle', 'Error'), msg : getLabel(
	 * 'instrumentErrorPopUpMsg', 'Error while fetching data..!'),
	 * cls:'t7-popup', buttons : Ext.MessageBox.OK, icon : Ext.MessageBox.ERROR
	 * }); } }); } },
	 */
	updateFilterConfig : function() {
		var me = this;
		var arrJsn = new Array();
		// TODO : Localization to be handled..
		var objDateLbl = {
			'12' : getLabel('latest', 'Latest'),
			'1' : getLabel('today', 'Today'),
			'2' : getLabel('yesterday', 'Yesterday'),
			'3' : getLabel('thisweek', 'This Week'),
			'4' : getLabel('lastweek', 'Last Week To Date'),
			'5' : getLabel('thismonth', 'This Month'),
			'6' : getLabel('lastmonth', 'Last Month To Date'),
			'14' : getLabel('lastmonthonly', 'Last Month Only'),
			'7' : getLabel('daterange', 'Date Range'),
			'8' : getLabel('thisquarter', 'This Quarter'),
			'9' : getLabel('lastQuarterToDate', 'Last Quarter To Date'),
			'10' : getLabel('thisyear', 'This Year'),
			'11' : getLabel('lastyeartodate', 'Last Year To Date')
		};

		if (!Ext.isEmpty(objInvoicePref)) // objDefaultGridViewPref
		{
			var objJsonData = Ext.decode(objInvoicePref);
			var data = objJsonData.d.preferences.gridViewFilter;
			if (data != 'undefined' && !Ext.isEmpty(data)) {
				// data = data[1].jsonPreferences;
				var strDtValue = data.quickFilter.entryDate;
				var strDtFrmValue = data.quickFilter.fromDate;
				var strDtToValue = data.quickFilter.toDate;
				filterRibbonCollapsed = !Ext.isEmpty(data.filterPanelCollapsed)
						? data.filterPanelCollapsed
						: true;
				infoRibbonCollapsed = !Ext.isEmpty(data.infoPanelCollapsed)
						? data.infoPanelCollapsed
						: true;
				if (!Ext.isEmpty(data.filterClientSelected)
						&& data.filterClientSelected != 'all') {
					me.clientCode = data.filterClientSelected;
					me.clientDesc = data.filterClientDesc;
				}
				me.filterCodeValue = data.advFilterCode;
			}
			if (!Ext.isEmpty(strDtValue)) {
				me.dateFilterLabel = objDateLbl[strDtValue];
				me.dateFilterVal = strDtValue;
				if (strDtValue === '7') {
					if (!Ext.isEmpty(strDtFrmValue))
						me.dateFilterFromVal = strDtFrmValue;

					if (!Ext.isEmpty(strDtToValue))
						me.dateFilterToVal = strDtToValue;
				}
			}
			if (!Ext.isEmpty(me.dateFilterVal)) {
				var strVal1 = '', strVal2 = '', strOpt = 'eq';
				if (me.dateFilterVal !== '7') {
					var dtParams = me.getDateParam(me.dateFilterVal,null);
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
//				if (me.dateFilterVal != '12') {
					arrJsn.push({
						paramFieldLable : getLabel('lblPayDueDate','Payment Due Date'),
						paramName : 'dueDate',
						paramIsMandatory : true,
						paramValue1 : strVal1,
						paramValue2 : strVal2,
						operatorValue : strOpt,
						dataType : 'D'
					});
//				}				
			}

			me.filterData = arrJsn;
		}
	},
	// This function will called only once
	updateAdvFilterConfig : function() {
		var me = this;
		if (!Ext.isEmpty(objDefaultGridViewPref)) {
			var data = Ext.decode(objDefaultGridViewPref);
			if (!Ext.isEmpty(data.advFilterCode)) {
				me.showAdvFilterCode = data.advFilterCode;
				me.savePrefAdvFilterCode = data.advFilterCode;
				var strUrl = 'userfilters/invoiceGridFilter/{0}.srvc';
				strUrl = Ext.String.format(strUrl, data.advFilterCode);
				Ext.Ajax.request({
					url : strUrl ,
					headers: objHdrCsrfParams,
					async : false,
					method : 'GET',
					success : function(response) {
						var responseData = Ext.decode(response.responseText);
						var applyAdvFilter = false;
						me.populateSavedFilter(data.advFilterCode,
								responseData, applyAdvFilter);
						var objOfCreateNewFilter = me.getCreateNewFilter();
						var objJson = objOfCreateNewFilter
								.getAdvancedFilterQueryJson(objOfCreateNewFilter);

						me.advFilterData = objJson;
						me.advFilterCodeApplied = data.advFilterCode;
						me.savePrefAdvFilterCode = '';
						me.filterApplied = 'A';
					},
					failure : function() {
						var errMsg = "";
						Ext.MessageBox.show({
									title : getLabel('filterPopupTitle',
											'Error'),
									msg : getLabel('filterPopupMsg',
											'Error while fetching data..!'),
									buttons : Ext.MessageBox.OK,
									icon : Ext.MessageBox.ERROR
								});
					}
				});
			}
		}
	},
	reloadGridRawData : function() {
		var me = this;
		var gridView = me.getAdvFilterGridView();
		Ext.Ajax.request({
					url : 'userfilterslist/invoiceGridFilter.srvc',
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
						me.addAllSavedFilterCodeToView(decodedJson.d.filters);
					},
					failure : function(response) {
						// console.log("Ajax Get data Call Failed");
					}
				});
	},
	resetAllFields : function() {
		var me = this;
		$('#invoiceNumber').val("");
		$('#obligationIdAct').val("");
		//$('#paymentDueDateAdv').val("");
		$('#saveFilterChkBox').attr('checked',false);
		markAdvFilterNameMandatory('saveFilterChkBox','advFilterNameLabel','saveFilterAs');
		$('#statusAdv option').prop('selected', true);
		$('#statusAdv').multiselect("refresh");
		$("input[type='text'][id='saveFilterAs']").val("");
		$("input[type='text'][id='saveFilterAs']").prop('disabled', false);
		$("#msSavedFilter").val("");
		$("#msSavedFilter").multiselect("refresh");
		me.datePickerSelectedEffectiveAdvDate = [];
		selectedPaymentDueDate = {};
		me.resetAdvPmtDueDate();
	},
	resetAdvPmtDueDate: function(){
		var me = this;
		var formattedFromDate;
		var objDateParams = me.getDateParam('1');
		var vFromDate = objDateParams.fieldValue1;
		var dateFilterRef = $('#paymentDueDateAdv');
		if (!Ext.isEmpty(vFromDate)) {
			formattedFromDate = Ext.util.Format.date(Ext.Date.parse(vFromDate, 'Y-m-d'), strExtApplicationDateFormat);
			$(dateFilterRef).val(formattedFromDate);
		}
		selectedPaymentDueDate = {
				operator : 'eq',
				fromDate : formattedFromDate,
				toDate : formattedFromDate,
				dateLabel : 'Today'
			};
		
		$('label[for="entryDateLabel"]').text(getLabel('lblPayDueDate', 'Payment Due Date')
					+ " (" + selectedPaymentDueDate.dateLabel + ")");
				entry_date_opt = 'Today';
	},
	showApprovalConfirmationView : function(strUrl, remark, arrSelectedRecords) {
		// var grid = this.getLoanInvoiceNewGridRef();
		var arrColumnModel = APPROVAL_CONFIRMATION_COLUMN_MODEL;
		var storeFields = ['invoiceNumber', 'clientId', 'clientDesc',
				'dueDate', 'amountDueDesc', 'paidAmount'];
		showApprovalConfirmationPopup([arrSelectedRecords], arrColumnModel,
				storeFields, [strUrl, remark, arrSelectedRecords]);
	},
	handleClearAppliedFilterDelete : function() {
		var me = this;
		var advJsonData = me.advFilterData;
		var quickJsonData = me.filterData;
		for (var ai, i = advJsonData.length; i--;) {
			paramName = advJsonData[i].field;
			arrAdvJson = advJsonData;
			arrAdvJson = me.removeFromAdvanceArrJson(arrAdvJson, paramName);
			me.advFilterData = arrAdvJson;
		}

		for (var ai, i = quickJsonData.length; i--;) {
			paramName = quickJsonData[i].field;
			arrQuickJson = quickJsonData;
			arrQuickJson = me.removeFromAdvanceArrJson(arrQuickJson, paramName);
			me.advFilterData = arrQuickJson;
		}
	},
	resetSavedFilterCombo : function() {
		var me = this;
		me.savedFilterVal = "";
		var savedFilterComboBox = me.getLoanInvoiceNewFilterViewType().down('combo[itemId="savedFiltersCombo"]');
		if (!Ext.isEmpty(savedFilterComboBox))			
			savedFilterComboBox.setValue(me.savedFilterVal);
		$("#msSavedFilter").val("");
		$("#msSavedFilter").multiselect("refresh");
		$("#saveFilterChkBox").attr('checked', false);
		$("input[type='text'][id='saveFilterAs']").val("");
		me.advFilterCodeApplied = "";
	},
	assignSavedFilter: function(){
		var me= this;
		var savedFilterCode='';
		me.resetAllFields();
		
			if (objInvoicePref || objSaveLocalStoragePref) {
						var objJsonData = Ext.decode(objInvoicePref);
					objLocalJsonData = Ext.decode(objSaveLocalStoragePref);
					if (!Ext.isEmpty(objLocalJsonData.d.preferences) 
							&& (!Ext.isEmpty(objLocalJsonData.d.preferences.tempPref)) && allowLocalPreference === 'Y') {
							if(!Ext.isEmpty(objLocalJsonData.d.preferences.tempPref.advFilterCode)){
								savedFilterCode = objLocalJsonData.d.preferences.tempPref.advFilterCode;
								me.savedFilterVal = objLocalJsonData.d.preferences.tempPref.advFilterCode;
							}
							if(!Ext.isEmpty(objLocalJsonData.d.preferences.tempPref.advFilterJson)){
								me.populateAndDisableSavedFilter(savedFilterCode,objLocalJsonData.d.preferences.tempPref.advFilterJson,false);
							}
					} else if (!Ext.isEmpty(objJsonData.d.preferences)){
						if (!Ext.isEmpty(objJsonData.d.preferences.GeneralSetting)) {
							if (!Ext.isEmpty(objJsonData.d.preferences.GeneralSetting.defaultFilterCode)) {
								var advData = objJsonData.d.preferences.GeneralSetting.defaultFilterCode;
								if (advData === me.getFilterView().down('combo[itemId="savedFiltersCombo"]').getValue()) {
									$("#msSavedFilter option[value='" + advData + "']").attr("selected", true);
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
	saveLocalPref : function(objSaveState){
		var me = this, args = {},strLocalPrefPageName = me.strPageName+'_TempPref';
		if (!Ext.isEmpty(objSaveState)) {
			args['tempPref'] = objSaveState;
			me.preferenceHandler.savePagePreferences(strLocalPrefPageName, objSaveState,
					me.postHandleSaveLocalPref, args, me, false);
		}
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
			if(args && args.tempPref){
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
	/* State handling at local storage End */
	applyPreferences : function(){
		var me = this, objJsonData='', objLocalJsonData='',savedFilterCode='';
		if (objInvoicePref || objSaveLocalStoragePref) {
						objJsonData = Ext.decode(objInvoicePref);
						objLocalJsonData = Ext.decode(objSaveLocalStoragePref); 
						
						if (!Ext.isEmpty(objLocalJsonData.d.preferences) && (!Ext.isEmpty(objLocalJsonData.d.preferences.tempPref)) && allowLocalPreference === 'Y') {
								if(!Ext.isEmpty(objLocalJsonData.d.preferences.tempPref.advFilterCode)){
									savedFilterCode = objLocalJsonData.d.preferences.tempPref.advFilterCode;
									me.savedFilterVal = objLocalJsonData.d.preferences.tempPref.advFilterCode;
								}
								if(!Ext.isEmpty(objLocalJsonData.d.preferences.tempPref.advFilterJson)){
									me.populateSavedFilter(savedFilterCode,objLocalJsonData.d.preferences.tempPref.advFilterJson,true);
									var entryDateLableVal = $('label[for="entryDateLabel"]').text();
									var entryDateField = $("#paymentDueDateAdv");
									me.handleEntryDateSync('A', entryDateLableVal, null, entryDateField);
									if (me.clientCode !== null)
									{
										var objJson = getAdvancedFilterQueryJson();
										if(me.clientCode !== 'all')
										{	
											objJson.push({
												field : 'clientCode',
												operator : 'in',
												value1 : encodeURIComponent(me.clientCode.replace(new RegExp("'", 'g'), "\''")),
												value2 : '',
												dataType : 0,
												displayType : 11,
												detailFilter : 'Y',
												fieldLabel : getLabel('lblClient','Company Name'),
												displayValue1 : me.clientDesc
											});
										}	
										me.advFilterData = objJson;
									}
								}
						}
						else
							me.applySavedDefaultPreference(objJsonData);
		}	
	},
	applySavedDefaultPreference : function(objJsonData){
		var me = this;
						if (!Ext.isEmpty(objJsonData.d.preferences)) {
							if (!Ext
									.isEmpty(objJsonData.d.preferences.GeneralSetting)) {
								if (!Ext
										.isEmpty(objJsonData.d.preferences.GeneralSetting.defaultFilterCode)) {
									var advData = objJsonData.d.preferences.GeneralSetting.defaultFilterCode;
									me.doHandleSavedFilterItemClick(advData);
									me.savedFilterVal = advData;
								}
							}
						}
	},
	resetDefaultDateJson : function() {
		var me = this;
		me.dateFilterVal  = '1';
		me.handleDateChange(me.dateFilterVal);
		var objDateParams = me.getDateParam(me.dateFilterVal);
		var jsonObject = {};
		if (!Ext.isEmpty(objDateParams.fieldValue1)) {
			jsonObject = {
						field : 'InvoiceDueDate',
						paramIsMandatory : true,
						value1 : objDateParams.fieldValue1,
						value2 : objDateParams.fieldValue2,
						operator : objDateParams.operator,
						dataType : 1,
						fieldLabel : getLabel('lblPayDueDate','Payment Due Date'),
						dropdownLabel : 'Today'
					};
		}
		return jsonObject;
	}
});
