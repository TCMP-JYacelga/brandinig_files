Ext.define('GCP.controller.InvoiceFinanceSummaryController', {
	extend : 'Ext.app.Controller',
	requires : ['Ext.ux.gcp.DateUtil', 'Ext.ux.gcp.PageSettingPopUp'],
	views : ['GCP.view.InvoiceFinanceSummaryView', 	'Ext.tip.ToolTip'],
	refs : [{
				ref : 'pageSettingPopUp',
				selector : 'pageSettingPopUp'
			}, {
				ref : 'pOSummaryView',
				selector : 'pOSummaryView'
			}, {
				ref : 'groupView',
				selector : 'pOSummaryView groupView'
			},
			/* Quick Filter starts... */
			{
				ref : 'filterView',
				selector : 'filterView'
			},{
				ref : 'pOSummaryFilterView',
				selector : 'pOSummaryFilterView'
			}, {
				ref : 'quickFilterClientCombo',
				selector : 'pOSummaryFilterView combo[itemId="quickFilterClientCombo"]'
			},{
			    ref:'DateMenu',
			    selector : '#DateMenu'
			}
	/* Quick Filter ends... */
	],
	config : {
		/* Filter Ribbon Configs Starts */
		strReadAllAdvancedFilterCodeUrl : 'services/userfilterslist/POCenterGroupViewFilter{0}.json',
		strPageName : 'invoiceFinanceCenter{0}',
		strGetModulePrefUrl : 'services/userpreferences/invoiceCenter{0}/{1}.json',
		strBatchActionUrl : 'services/invoiceFinance/{0}.json',
		strDefaultMask : '000000000000000000',
		intMaskSize : 13,
		strLocalStorageKey : 'page_invoice_center',

		datePickerSelectedDate : [],
		datePickerSelectedPOAdvDate : [],
		dateFilterLabel : getLabel('latest', 'Latest'),
		dateFilterVal : '',
		dateRangeFilterVal : '13',
		statusFilterVal : 'all',
		statusFilterDesc : 'All',
		savedFilterVal : '',
		filterData : [],
		advFilterData : [],
		advSortByData : [],
		filterApplied : 'ALL',
		dateHandler : null,
		filterCodeValue : null,
		showAdvFilterCode : null,
		
		previouGrouByCode : null,
		reportGridOrder : null,
		clientFilterVal : (Ext.isEmpty(selectedFilterClient) ?  'all' : selectedFilterClient),
		clientFilterDesc : getLabel('selectedFilterClient', selectedFilterClientDesc),
		advFilterSelectedClientDesc : null,

		savePrefAdvFilterCode : null,
		localPreHandler : null,
		advFilterCodeApplied : null,
		EntryDateFilterVal : '',
		processDateFilterVal : '',
		advFilterProcessSelected : {},
		pageSettingPopup : null
		/* Filter Ribbon Configs Ends */
	},
	init : function() {
		var me = this;
		me.preferenceHandler = Ext.create('Ext.ux.gcp.PreferencesHandler');
		me.dateHandler = Ext.create('Ext.ux.gcp.DateUtil');
		
		if (!Ext.isEmpty(filterJson))
			arrFilterJson = JSON.parse(filterJson);
		$("#savePrefMenuBtn").attr('disabled', true);
		$("#clearPrefMenuBtn").attr('disabled', true);
		$(document).on('wheelScroll', function(event) {
					me.handlWheelScroll();
				});
		$(document).on('performReportAction', function(event, actionName) {
					me.downloadReport(actionName);
				});

		$(document).on('performPageSettings', function(event) {
					me.showPageSettingPopup('PAGE');
				});

		$(document).on('deleteFilterEvent', function(event, filterCode) {
					me.deleteFilterSet(filterCode);
				});
		$(document).on('resetAllFieldsEvent', function() {
					me.resetAllFields();
					me.filterCodeValue = null;
				});
		$(document).on('handleClientChangeInQuickFilter',
				function(isSessionClientFilter) {
					me.handleClientChangeInQuickFilter(isSessionClientFilter);
					setClientCodeMenuItems("dropdownClientCode");
					setProductMenuItems("dropdownProduct");
				});
		$(document).on('handleLoggerChangeInQuickFilter',
				function() {
					me.handleLoggerChangeInQuickFilter(selectedFilterLoggerDesc);
				});
		/*$(document).on('handlePOverifyAction',
				function(event, strUrl, arrSelectedRecords, strAction) {
					var strActionType = null, grid;
					var groupView = me.getGroupView();
					var grid = groupView.getGrid();
					var objOfRecords = grid.getSelectedRecords();
					me.preHandleGroupActions(strUrl, '', grid, arrSelectedRecords,
					strActionType, strAction);
				});*/
		me.control({
			'pageSettingPopUp' : {
				'applyPageSetting' : function(popup, data, strInvokedFrom) {
					me.applyPageSetting(data, strInvokedFrom);
				},
				'savePageSetting' : function(popup, data, strInvokedFrom) {
					me.savePageSetting(data, strInvokedFrom);
				},
				'restorePageSetting' : function(popup, data, strInvokedFrom) {
					me.restorePageSetting(data, strInvokedFrom);
				}
			},
			'pOSummaryView groupView' : {
				'groupTabChange' : function(groupInfo, subGroupInfo, tabPanel,
						newCard, oldCard) {
							me.doHandleStateChange();
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
						/*if(selectedFilterLoggerDesc == 'BUYER')
						{
							objPOSummaryPref = objPOBuyerSummaryPref;
							if (objPOSummaryPref) {
								var objJsonData = Ext.decode(objPOSummaryPref);
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
									else
										me.savedFilterVal = "";
								}
						}
					}
					else if(selectedFilterLoggerDesc == 'SELLER')
					{
						objPOSummaryPref = objPOSellerSummaryPref;
						if (objPOSummaryPref) {
							var objJsonData = Ext.decode(objPOSummaryPref);
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
								else
										me.savedFilterVal = "";
							}
						}
					}*/
				},
				'gridSettingClick' : function() {
					me.showPageSettingPopup('GRID');
				}
			},
			'pOSummaryFilterView' : {
				beforerender : function() {
					var useSettingsButton = me.getFilterView()
							.down('button[itemId="useSettingsbutton"]');
					if (!Ext.isEmpty(useSettingsButton)) {
						useSettingsButton.hide();
					}
				},
				afterrender : function(tbar, opts) {
					// me.handleDateChange(me.dateFilterVal);
				}
			},
			'filterView' : {
				appliedFilterDelete : function(btn) {
					me.handleAppliedFilterDelete(btn);
				}
			},
			'filterView button[itemId="clearSettingsButton"]' : {
				'click' : function() {
					me.handleClearSettings();
				}
			},
			'pOSummaryFilterView  combo[itemId="quickFilterClientCombo"]' : {
				'afterrender' : function(combo, newValue, oldValue, eOpts) {
					if (!Ext.isEmpty(me.clientFilterVal)) {
						combo.setValue(me.clientFilterVal);
					}
				}
			},
			'pOSummaryFilterView  combo[itemId="clientCombo"]' : {
				'boxready' : function(combo, width, height, eOpts) {
					if (!Ext.isEmpty(me.clientFilterDesc)) {
						combo.setValue(me.clientFilterDesc);
						$('#msClient').val(me.clientFilterVal);
					} else {
						combo.setValue(combo.getStore().getAt(0));
						$('#msClient').val(combo.getStore().getAt(0));
					}
				}
			},
			'pOSummaryFilterView  combo[itemId="clientAuto"]' : {
				'boxready' : function(combo, width, height, eOpts) {
					if (!Ext.isEmpty(me.clientFilterDesc)) {
						combo.setValue(me.clientFilterDesc);
						
					} 
				}
			},
			'pOSummaryFilterView  combo[itemId="poFinRefAuto"]' : {
				'boxready' : function(combo, width, height, eOpts) {
					if (!Ext.isEmpty(me.clientFilterDesc)) {
						//combo.setValue(me.clientFilterDesc);
						
					} 
				},
				'select' : function(combo, record) {
					me.handleReferenceChangeInQuickFilter(combo.getValue());
				},
				'render' : function() {
					me.setDataForFilter();
					me.applyQuickFilter();
				}
			}

		});
	},
	handleReconfigureGrid : function(data) {
		var me = this;
		var objGroupView = me.getGroupView();
		var objSummaryView = me.getPOSummaryView(), gridModel = null, objData = null;
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
		objGroupView.reconfigureGrid(gridModel);
	},

	/* Page setting handling starts here */
	savePageSetting : function(arrPref, strInvokedFrom) {
		/* This will be get invoked from page level setting always */
		var me = this, args = {};
		if (!Ext.isEmpty(arrPref)) {
			me.preferenceHandler.savePagePreferences(Ext.String.format(me.strPageName, selectedFilterLoggerDesc), arrPref,
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
				buttonText: {
		            ok: getLabel('btnOk', 'OK')
					},
				cls : 't7-popup',
				icon : Ext.MessageBox.ERROR
			});
		} else {
			me.preferenceHandler.readPagePreferences(Ext.String.format(me.strPageName, selectedFilterLoggerDesc),
					me.updateObjPaymentSummaryPref, args, me, false);
		}
	},
	updateObjPaymentSummaryPref : function(data) {
		objPaymentSummaryPref = Ext.encode(data);
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
				me.preferenceHandler.saveModulePreferences(Ext.String.format(me.strPageName, selectedFilterLoggerDesc),
						strModule, objPref, me.postHandlePageGridSetting, args,
						me, false);
			} else {
				me.preferenceHandler.savePagePreferences(Ext.String.format(me.strPageName, selectedFilterLoggerDesc),
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
			me.preferenceHandler.clearPagePreferences(Ext.String.format(me.strPageName, selectedFilterLoggerDesc), arrPref,
					me.postHandleRestorePageSetting, args, me, false);
		} else
			me.preferenceHandler.clearPagePreferences(Ext.String.format(me.strPageName, selectedFilterLoggerDesc), arrPref,
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
			} else{
				window.location.reload();
			}
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
			objPOSummaryPref = objPOBuyerSummaryPref;
			arrGenericColumnModel = arrBuyerGenericColumnModel;
		}
		else if(selectedFilterLoggerDesc == 'SELLER')
		{			
			objPOSummaryPref = objPOSellerSummaryPref;
			arrGenericColumnModel = arrSellerGenericColumnModel;
		}
		if (!Ext.isEmpty(objPOSummaryPref)) {
			objPrefData = Ext.decode(objPOSummaryPref);
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
					: Ext.decode(me.getJsonObj(arrGenericColumnModel) || '[]');

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
		objData["filterUrl"] = 'services/userfilterslist/InvoiceCenterGroupViewFilter'+selectedFilterLoggerDesc+'.json';
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
	/* Page setting handling ends here */

	/* State handling at local storage starts */
	doHandleStateChange : function() {
	
	},
	/* State handling at local storage ends */
	doHandleGroupTabChange : function(groupInfo, subGroupInfo, tabPanel,
			newCard, oldCard) {
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
			me.preferenceHandler.readModulePreferences(Ext.String.format(me.strPageName, selectedFilterLoggerDesc),
					strModule, me.postHandleDoHandleGroupTabChange, null, me,
					false);

		} else
			me.postHandleDoHandleGroupTabChange();

	},
	getJsonObj : function(jsonObject) {
		var jsonObj ='';
		if(jsonObject  instanceof Object ==false)
			jsonObj =JSON.parse(jsonObject);
		if(jsonObject  instanceof Array)
			jsonObj =jsonObject;
		for (var i = 0; i < jsonObj.length; i++) {
			jsonObj[i].colDesc =  getLabel(jsonObj[i].colId,jsonObj[i].colDesc);
			jsonObj[i].colHeader =  getLabel(jsonObj[i].colId,jsonObj[i].colHeader);;
		}
		if(jsonObject  instanceof Object ==false)
			jsonObj = JSON.stringify(jsonObj)
		return jsonObj;
	},
	postHandleDoHandleGroupTabChange : function(data, args) {
		var me = args ? args.scope : this;
		me.handleReconfigureGrid(data);
	},
	doHandleLoadGridData : function(groupInfo, subGroupInfo, grid, url, pgSize,
			newPgNo, oldPgNo, sorter, filterData) { 
		var me = this;
		var objGroupView = me.getGroupView();
		var buttonMask = me.strDefaultMask;
		var arrOfParseQuickFilter = [], arrOfParseAdvFilter = [], arrOfFilteredApplied = [];
		if (!$('#actionResultDiv').hasClass('ui-helper-hidden')) {
			$('#actionResultDiv').addClass('ui-helper-hidden');
			if ($('#actionResultInfoDiv').children('.row').length > 0) {
				$('#actionResultInfoDiv').children('.row').remove();
			}
		}
		objActionResult = {
			'order' : []
		};
		objGroupView.handleGroupActionsVisibility(buttonMask);
		var strUrl = grid.generateUrl(url, pgSize, newPgNo, oldPgNo, sorter);
		
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
				var reqJsonInQuick = me.findInQuickFilterData(quickJsonData,
						'Seller');
				if (!Ext.isEmpty(reqJsonInQuick)) {
					arrQuickJson = quickJsonData;
					arrQuickJson = me.removeFromQuickArrJson(arrQuickJson,
							'Seller');
					quickJsonData = arrQuickJson;
				}
				
				reqJsonInQuick = me.findInQuickFilterData(quickJsonData,
						'EntryDate');
				if(!Ext.isEmpty(filterDays) && filterDays !== '999' && me.dateFilterVal === '12'){
					if (!Ext.isEmpty(reqJsonInQuick)) {
						//reqJsonInQuick.paramValue1 = reqJsonInQuick.paramValue2;
						arrQuickJson = quickJsonData;
						arrQuickJson = me.updateInQuickArrJson(arrQuickJson,
								'EntryDate');
						quickJsonData = arrQuickJson;
					}
				}
				arrOfParseQuickFilter = generateFilterArray(quickJsonData, strApplicationDateFormat);
			}
		}

		if (!Ext.isEmpty(me.advFilterData)) {
			if (!Ext.isEmpty(me.advFilterData) && me.advFilterData.length >= 1) {				
				arrOfParseAdvFilter = generateFilterArray(me.advFilterData, strApplicationDateFormat);
			}
		}
		
		var tempArrOfParseQuickFilter = [];
		var clientModeDesc = (selectedFilterLoggerDesc == 'SELLER' ? getLabel('Seller', 'Seller') :getLabel('Buyer', 'Buyer') );
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
				tempArrOfParseQuickFilter[index + 1].fieldValue ="All Companies";
				tempArrOfParseQuickFilter[index + 1].fieldTipValue ="All Companies";
			}
		}
		if (arrOfParseQuickFilter && arrOfParseAdvFilter) {
			arrOfFilteredApplied = tempArrOfParseQuickFilter
					.concat(arrOfParseAdvFilter);
		 			
		if (arrOfFilteredApplied)
				me.getFilterView().updateFilterInfo(arrOfFilteredApplied);
		}
		
		
		me.filtersAppliedCount = arrOfFilteredApplied.length;
		me.handleClearFilterButtonHideAndShow();
		me.reportGridOrder = strUrl;
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
				me
						.doHandleRowActions(arrVisibleActions[0].itemId, grid,
								record);
			}
		} else {
		}
	},
	doHandleGridRowSelectionChange : function(groupInfo, subGroupInfo, objGrid,
			objRecord, intRecordIndex, arrSelectedRecords, jsonData) {var me = this;
		var objGroupView = me.getGroupView();
		var buttonMask = me.strDefaultMask;
		var blnAuthInstLevel = false;
		var maskArray = new Array(), actionMask = '', objData = null;;

		if (!Ext.isEmpty(jsonData)
				&& !Ext.isEmpty(jsonData.d.__buttonMask))
			buttonMask = jsonData.d.__buttonMask;

		maskArray.push(buttonMask);
		var isCrossCcy = false;
		for (var index = 0; index < arrSelectedRecords.length; index++) {
			objData = arrSelectedRecords[index];
			maskArray.push(objData.get('__metadata').__rightsMap);
		}
		actionMask = doAndOperation(maskArray, me.intMaskSize);
		objGroupView.handleGroupActionsVisibility(actionMask);
		// me.enableNachaDownloadOption(arrSelectedRecords);
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
	generateFilterUrl : function(subGroupInfo, groupInfo) {
		var me = this;
		var strQuickFilterUrl = '', strAdvancedFilterUrl = '', strUrl = '', isFilterApplied = false; 
		var isClientFilterApplied = false;
		var strClientFilterUrl='';
		var strGroupQuery = (subGroupInfo && subGroupInfo.groupQuery)
				? subGroupInfo.groupQuery
				: '';

		strQuickFilterUrl = me.generateUrlWithQuickFilterParams(me);
		var filterData = me.filterData;
		if (!Ext.isEmpty(strQuickFilterUrl)) {
			strUrl += '&$filter=' + strQuickFilterUrl;
			isFilterApplied = true;
		}
		if (!Ext.isEmpty(strGroupQuery)) {
			if (!Ext.isEmpty(strUrl))
				strUrl += ' and ' + strGroupQuery;
			else
				strUrl += '&$filter=' + strGroupQuery;
		}
		for (var index = 0; index < filterData.length; index++) {
			if(filterData[index].paramName === "Client")
			{
					strClientFilterUrl = filterData[index].paramValue1;
			}
			if (!Ext.isEmpty(strClientFilterUrl)) {
				strUrl += '&$clientFilter=' + strClientFilterUrl;
				isClientFilterApplied = true;
			}
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
			if(filterData[index].paramName === "Client")
					continue;
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
					// objValue = objValue.replace(reg, '');
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
	doHandleGroupActions : function(strAction, grid, arrSelectedRecords,
			strActionType) {
		var me = this;
		strUrl = Ext.String.format(me.strBatchActionUrl, strAction);
		
		if (strAction === 'reject') {
			me.showRejectVerifyPopUp(strAction, strUrl, grid, arrSelectedRecords, strActionType);
		} else if (strAction === 'submit' || strAction === 'authourize' || strAction === 'send') {
				me.preHandleGroupActions(strUrl, '',
								grid, arrSelectedRecords,
								strActionType, strAction);

		} else {
			me.preHandleGroupActions(strUrl, '', grid, arrSelectedRecords,
					strActionType, strAction);
		}

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
								groupView.refreshData();
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
	postHandleGroupAction : function(jsonData, grid, strActionType, strAction,
			records) {
		var me = this;
		var groupView = me.getGroupView();
		var msg = '', strIsProductCutOff = 'N', errCode = '', arrActionMsg = [], actionData, record = '', row = null, intSerialNo, arrMsg;
		if (!Ext.isEmpty(jsonData) && !Ext.isEmpty(jsonData.d)
				&& !Ext.isEmpty(jsonData.d.instrumentActions))
			actionData = jsonData.d.instrumentActions;
		var strIsRollover = 'N', strIsReject = 'N', strIsDiscard = 'N';
		var strActionSuccess = getLabel(strAction, 'Action Successful');
		actionData = jsonData;
		Ext.each(actionData, function(result) {
			msg = '';
			intSerialNo = parseInt(result.serialNo,10);
			record = grid.getRecord(intSerialNo);
			row = grid.getRow(intSerialNo);
			Ext.each(result.errors, function(error) {
				msg = msg + error.code + ' : ' + error.errorMessage;
				errCode = error.code;
				if (!Ext.isEmpty(errCode))
					strIsProductCutOff = 'Y';
				if (errCode.indexOf('SHOWPOPUP') != -1) {
					showPopup = 'Y';
				}
			});
			
				row = grid.getRow(intSerialNo);
				grid.deSelectRecord(record);
				arrActionMsg.push({
							success : result.success,
							actualSerailNo : result.serialNo,
							actionTaken : 'Y',
							lastActionUrl : strAction,
							reference : Ext.isEmpty(record) ? '' : record
									.get('invoiceNumber'),
							actionMessage : result.success === 'Y'
									? strActionSuccess
									: msg
						});
			
		});
		/*
		 * if (!Ext.isEmpty(arrActionMsg) && errorPanel) {
		 * errorPanel.loadResultData(arrActionMsg); errorPanel.show(); }
		 */
		//me.hideQuickFilter();
		arrMsg = (me.populateActionResult(arrActionMsg) || null);
		if (!Ext.isEmpty(arrMsg)) {
			getRecentActionResult(arrMsg);
		}
		groupView.handleGroupActionsVisibility(me.strDefaultMask);
		groupView.setLoading(false);

	},
	populateActionResult : function(arrActionMsg) {
		var me = this, arrResult = [];
		if (!Ext.isEmpty(objActionResult)) {
			Ext.each((arrActionMsg || []), function(cfgMsg) {
				if (!Ext.Array.contains(objActionResult.order,
						cfgMsg.actualSerailNo))
					objActionResult.order.push(cfgMsg.actualSerailNo);
				objActionResult[cfgMsg.actualSerailNo] = me.cloneObject(cfgMsg);
			});

			Ext.each((objActionResult.order || []), function(key) {
						if (objActionResult[key]) {
							arrResult.push(objActionResult[key]);
						}
					});
		}
		return arrResult;
	},
	doHandleRowActions : function(actionName, objGrid, record) {
		var me = this;
		var groupView = me.getGroupView();
		var grid = groupView.getGrid();
		if (actionName === 'submit' || actionName === 'discard'
				|| actionName === 'verify' || actionName === 'authourize'
				|| actionName === 'send' || actionName === 'reject'
				) {
			me.doHandleGroupActions(actionName, grid, [record], 'rowAction');
		} else if (actionName === 'btnHistory') {
			var recHistory = record.get('history');
			if (!Ext.isEmpty(recHistory)
					&& !Ext.isEmpty(recHistory.__deferred.uri)) {
				me.showHistory(record.get('history').__deferred.uri);
			}
		}
		if (actionName != 'authourize' && actionName != 'reject' && actionName != 'discard' && actionName != 'send'){
			if (actionName === 'btnEdit')
			{
				strUrl = 'editInvoiceFinance.form';
			}
			else if (actionName === 'btnView')
			{
				strUrl = 'viewInvoiceFinance.form';
			}
			me.doSubmitForm(strUrl, record, actionName); 
		}
	},
	createFormField : function(element, type, name, value) {
		var inputField;
		inputField = document.createElement(element);
		inputField.type = type;
		inputField.name = name;
		inputField.value = value;
		return inputField;
	},

	/*----------------------------Summary Ribbon Handling Starts----------------------------*/
	
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
		me.doHandleStateChange();
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
		//me.deleteFilterCodeFromDb(objFilterName);
		// store.reload();
	},
	searchFilterData : function(filterCode) {
		var me = this;
		var emptyBtn = '';
		var currentBtn = '';
		var filterPresentOnToolbar = false;
		if (!Ext.isEmpty(filterCode)) {
			var filterView = me.getPaymentSummaryFilterView();
			if (filterView)
				filterView.highlightSavedFilter(filterCode);
		}
	},
	setDataForFilter : function(filterData) {
		var me = this;
		var arrQuickJson = {};
		me.filterData = {};
		me.filterData = me.getQuickFilterQueryJson();
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
	getQuickFilterQueryJson : function() {
		var me = this;
		var financeReference = me.financeReference;
		var clientFilterVal = me.clientFilterVal;
		var clientFilterDesc = me.clientFilterDesc;
		var jsonArray = [];
		
		if (!Ext.isEmpty(clientFilterVal) && clientFilterVal != 'all') {
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
		if (!Ext.isEmpty(financeReference)) {
			jsonArray.push({
						paramName : 'invReferenceNmbr',
						paramValue1 : encodeURIComponent(financeReference.replace(new RegExp("'", 'g'), "\''")),
						operatorValue : 'lk',
						dataType : 'S',
						displayType : 5,
						paramFieldLable : getLabel('reference', 'Loan Reference'),
						displayValue1 : financeReference
					});
		}
		return jsonArray;
	},
	applyQuickFilter : function() {
		var me = this;
		var objGroupView = me.getGroupView();
		var groupInfo = objGroupView.getGroupInfo();
		me.filterApplied = 'Q';
		objGroupView.setFilterToolTip('');
		if (objGroupView)
			objGroupView.toggleFilterIcon(true);
		if (groupInfo && groupInfo.groupTypeCode === 'PAYSUM_OPT_ADVFILTER') {
			objGroupView.setActiveTab('all');
		} else {

			me.refreshData();
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
	isInCondition : function(data) {
		var retValue = false;
		var reg = new RegExp(/^\((\d\d*,)*\d\d*\)$/);
		var displayType = data.displayType;
		var strValue = data.value1;
		if (displayType
				&& (displayType === 4 || displayType === 3 || displayType === 5
						|| displayType === 12 || displayType === 13 
						|| displayType === 6 || displayType === 2)
				&& strValue /*
							 * && strValue.match(reg)
							 */) {
			retValue = true;
		}
		return retValue;
	},
	getSortByJsonForSmartGrid : function() {
		var me = this;
		var jsonArray = [];
		var sortDirection = '';
		var fieldId = '';
		var sortOrder = '';
		var sortByData = me.advSortByData;
		if (!Ext.isEmpty(sortByData)) {
			for (var index = 0; index < sortByData.length; index++) {
				fieldId = sortByData[index].value1;
				sortOrder = sortByData[index].value2;

				if (sortOrder != 'asc')
					sortDirection = 'DESC';
				else
					sortDirection = 'ASC';

				jsonArray.push({
							property : fieldId,
							direction : sortDirection,
							root : 'data'
						});
			}

		}
		return jsonArray;
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
		//me.hideQuickFilter();
		$('#entryDataPicker').removeAttr('disabled', 'disabled');
	},
	handleReferenceChangeInQuickFilter : function(reference){
		var me = this;
		me.financeReference = reference;
		me.filterApplied = 'Q';
		me.setDataForFilter();
		me.applyQuickFilter();
	},
	/*----------------------------Summary Ribbon Handling Ends----------------------------*/
	
	/*--------------------Quick Filter Start------------------------*/
	handleClientChangeInQuickFilter : function(isSessionClientFilter) {
		var me = this;
		if (isSessionClientFilter)
			me.clientFilterVal = selectedFilterClient;
		else
			me.clientFilterVal = isEmpty(selectedClient)
					? 'all'
					: selectedClient;
		me.clientFilterDesc = selectedClientDesc;// combo.getRawValue();
		quickFilterClientValSelected = me.clientFilterVal;
		quickFilterClientDescSelected = me.clientFilterDesc;
		me.filterApplied = 'Q';
		me.setDataForFilter();
		if (me.clientFilterVal === 'all') {
			me.showAdvFilterCode = null;
			me.filterApplied = 'ALL';
			me.refreshData();

		} else {
			me.applyQuickFilter();
		}
	},
	handleLoggerChangeInQuickFilter : function(selectedFilterLoggerDesc) {
		var me = this;
		var gridPanel = me.getPOSummaryView();
		gridPanel.removeAll();
		group = gridPanel.createGroupView(selectedFilterLoggerDesc);
		gridPanel.add(group);
		me.getPOSummaryFilterView('#parentContainer').down('#sellerOrBuyerrCombo').suspendEvents();
		me.getPOSummaryFilterView('#parentContainer').down('#sellerOrBuyerrCombo').setValue(selectedFilterLogger);
		me.getPOSummaryFilterView('#parentContainer').down('#sellerOrBuyerrCombo').resumeEvents();
	},
	/*--------------------Quick Filter End--------------------------*/
	handleAppliedFilterDelete : function(btn) {
		var me = this;
		var objData = btn.data;
		var quickJsonData = me.filterData;
		if (!Ext.isEmpty(objData)) {
			var paramName = objData.paramName || objData.field;
			// quick
			var reqJsonInQuick = me.findInQuickFilterData(quickJsonData,
						paramName);
			if (!Ext.isEmpty(reqJsonInQuick)) {
				arrQuickJson = quickJsonData;
				arrQuickJson = me.removeFromQuickArrJson(arrQuickJson,
							paramName);
				me.filterData = arrQuickJson;
			}
			me.resetFieldInAdvAndQuickOnDelete(objData);
			me.refreshData();
		}
	},
	handleStatusFieldSync : function(type, statusData, statusDataDesc) {
		var me = this;
		if (!Ext.isEmpty(type)) {
			if (type === 'Q') {
				var objStatusField = $("#pOStatus");
				var objQuickStatusField = me.getPOSummaryFilterView()
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
				var objStatusField = me.getPOSummaryFilterView()
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
	cloneObject : function(obj) {
		return JSON.parse(JSON.stringify(obj));
	},
	resetFieldInAdvAndQuickOnDelete : function(objData) {
		var me = this, strFieldName;
		if (!Ext.isEmpty(objData))
			strFieldName = objData.paramName || objData.field;
		
		if (strFieldName === 'invReferenceNmbr') {
			$("input[name='poFinRefCombo']").val("");
		}
		else if (strFieldName === 'Client') {
			if (isClientUser()) {
				var clientComboBox = me.getPOSummaryFilterView()
						.down('combo[itemId="clientCombo"]');
				me.clientFilterVal = 'all';
				selectedFilterClientDesc = "";
				selectedFilterClient = "";
				selectedClientDesc = "";
				clientComboBox.setValue(me.clientFilterVal);
				setClientCodeMenuItems("dropdownClientCode");
				setProductMenuItems("dropdownProduct");
			} else {
				var clientComboBox = me.getPOSummaryFilterView()
						.down('combo[itemId="clientAuto]');
				clientComboBox.reset();
				me.clientFilterVal = '';
				selectedFilterClientDesc = "";
				selectedFilterClient = "";
			}
		}
	},
	showRejectVerifyPopUp : function(strAction, strActionUrl, grid, 	arrSelectedRecords, strActionType) {
		var me = this;
		var titleMsg = '', fieldLbl = '';
		if (strAction === 'reject') {
			fieldLbl = getLabel('PORemarkPopUpTitle',
					'Please enter return remark');
			titleMsg = getLabel('PORemarkPopUpFldLbl',
					'Return Remark');
		}
		var msgbox = Ext.Msg.show({
					title : titleMsg,
					msg : fieldLbl,
					buttons : Ext.Msg.OKCANCEL,
					multiline : 4,
					cls : 't7-popup',
					width: 355,
					height : 270,
					bodyPadding : 0,
					fn : function(btn, text) {
						if (btn == 'ok') {
							me.preHandleGroupActions(strActionUrl, text, grid,
									arrSelectedRecords, strActionType,
									strAction);
						}
					}
				});
		msgbox.textArea.enforceMaxLength = true;
		msgbox.textArea.inputEl.set({
					maxLength : 255
				});
	},
	handleClearSettings : function() {
		var me = this, objGroupView = me.getGroupView();
		if (isClientUser()) {
			var clientComboBox = me.getPOSummaryFilterView()
					.down('combo[itemId="clientCombo"]');
			me.clientFilterVal = 'all';
			me.financeReference = '';
			selectedFilterClientDesc = "";
			selectedFilterClient = "";
			selectedClientDesc = "";
			clientComboBox.setValue(me.clientFilterVal);
			setClientCodeMenuItems("dropdownClientCode");
			setProductMenuItems("dropdownProduct");
		} else {
			var clientComboBox = me.getPOSummaryFilterView()
					.down('combo[itemId="clientAuto]');
			clientComboBox.reset();
			me.clientFilterVal = '';
			me.financeReference = '';
			selectedFilterClientDesc = "";
			selectedFilterClient = "";
			selectedClientDesc = "";
		}
		me.filterApplied = 'Q';
		if (objGroupView)
			objGroupView.toggleFilterIcon(false);
		objGroupView.setFilterToolTip('');

		$("#summaryClientFilter").val('');
		$("input[name='poFinRefCombo']").val("");
		me.setDataForFilter();
		me.refreshData();

	},
	
		downloadReport : function(actionName) {
			var me = this;
			var withHeaderFlag = document.getElementById("headerCheckbox").checked;
			var arrExtension = {
				downloadXls : 'xls',
				downloadCsv : 'csv',
				downloadPdf : 'pdf',
				downloadTsv : 'tsv'
			};
			var currentPage = 1;
			var strExtension = '';
			var strUrl = '';
			var strSelect = '';
			var activeCard = '';
		
			strExtension = arrExtension[actionName];
			strUrl = 'services/invoiceFinCenterReport/'+selectedFilterLoggerDesc+'.'+strExtension;
			strUrl += '?$skip=1';
			filterData = me.filterData;
			//strUrl += this.getFilterUrl();
			//var filterUrl = me.generateFilterUrl();
			var groupView = me.getGroupView(), subGroupInfo = groupView
				.getSubGroupInfo()
				|| {}, objPref = {}, groupInfo = groupView
				.getGroupInfo()
				|| '{}', strModule = subGroupInfo.groupCode;
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
			if(!Ext.isEmpty(me.filterValidityName) && "ALL" !== me.filterValidityName){
					strUrl += "&validity=" +me.filterValidityName;
				}
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
		handleClearFilterButtonHideAndShow : function()
		{
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
		doSubmitForm : function(strUrl, record, actionName) {
			var me = this;
			var form = null;
			form = document.createElement('FORM');
			form.name = 'frmMain';
			form.id = 'frmMain';
			form.method = 'POST';
			form.appendChild(me.createFormField('INPUT', 'HIDDEN',
					csrfTokenName, tokenValue));

			form.appendChild(me.createFormField('INPUT', 'HIDDEN', 'txtFinIntRefNum',
					record.data.invoiceFinIntRefNmbr));
			form.appendChild(me.createFormField('INPUT', 'HIDDEN', 'viewState',
					record.data.identifier));
			form.appendChild(me.createFormField('INPUT', 'HIDDEN', 'txtInvoiceCenterClientCode',
					(!Ext.isEmpty(selectedClient) ? selectedClient : strClient)));
			form.appendChild(me.createFormField('INPUT', 'HIDDEN', 'txtPOCenterClientCode',	record.data.company));
					
			form.action = strUrl;
			document.body.appendChild(form);
			form.submit();
			document.body.removeChild(form);
		},
		showHistory : function(url) {
			var historyPopup = Ext.create('GCP.view.HistoryPopup', {
						historyUrl : url
					}).show();
			historyPopup.center();
		}
});
