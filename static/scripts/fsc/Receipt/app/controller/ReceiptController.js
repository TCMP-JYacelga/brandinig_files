Ext.define('GCP.controller.ReceiptController', {
	extend : 'Ext.app.Controller',
	requires : ['Ext.ux.gcp.DateUtil','Ext.ux.gcp.PageSettingPopUp','GCP.view.HistoryPopup'],
	views : ['GCP.view.HistoryPopup', 'GCP.view.ReceiptFilterView',
	         'GCP.view.ReceiptView'],
	refs : [{
		ref : 'groupView',
		selector : 'receiptView groupView'
	},{
		ref : 'pageSettingPopUp',
		selector : 'pageSettingPopUp'
	}, {
		ref : 'grid',
		selector : 'receiptView groupView smartgrid'
	}, {
		ref : 'filterView',
		selector : 'receiptView groupView filterView'
	}, {
		ref : 'receiptView',
		selector : 'receiptView'
	},{
		ref:'receiptFilterView',
		selector : 'receiptFilterView'
	}],
	config : {
		strPageName:'receipt{0}',
		pageSettingPopup : null,
		isCompanySelected : false,
		//preferenceHandler : null,
		strDefaultMask : '000000000000000000',
		userStatusPrefCode :'',
		userStatusPrefDesc :'',
		receiptDateFilterVal:'',
		receiptDateFilterLabel:getLabel('today', 'Today'),
		datePickerSelectedReceiptAdvDate : [],
		dateFilterLabel : '',
		dateFilterVal : '',
		dateRangeFilterVal : '13',
		dateHandler : null,
		strReadAllAdvancedFilterCodeUrl : 'services/userfilterslist/ReceiptAdvFilter{0}.json',
		strGetSavedFilterUrl : 'services/userfilters/ReceiptAdvFilter{0}/{1}.json',
		strModifySavedFilterUrl : 'services/userfilters/ReceiptAdvFilter{0}/{1}.json',
		strRemoveSavedFilterUrl : 'services/userfilters/ReceiptAdvFilter{0}/{1}/remove.json',
		filterData : [],
		advFilterData : [],
		advSortByData : [],
		filtersAppliedCount : 1,
		receiptNumberVal : null,
		reportGridOrder : null,
		filterCodeValue:''
	},
	init : function() {
		var me = this;
		$(document).on("handleEntryAction",function(){
			me.handleEntryAction();
		});
		$(document).on('handleGroupActions', function(event,strUrl, remark,grid, arrSelectedRecords) {
									me.handleGroupActions(strUrl, remark,grid, [arrSelectedRecords]);
		});
		$(document).on('handleGroupActionsVisibility', function(event,actionMask) {
									me.handleGroupActionsVisibility(actionMask);
		});
		$(document).on('performPageSettings', function(event) {
					me.showPageSettingPopup('PAGE');
				});
		$(document).on('datePickPopupSelectedDate',function(event, filterType, dates){
			me.dateRangeFilterVal = '13';
			me.datePickerSelectedReceiptAdvDate = dates;
			me.receiptDateFilterVal = me.dateRangeFilterVal;
			me.receiptDateFilterLabel = getLabel('daterange',
					'Date Range');
			me.handleReceiptDateChange(me.dateRangeFilterVal);
			updateToolTip('receiptDate','('+me.receiptDateFilterLabel+')');
		});
		
		//handling triggered events
		$(document).on('filterDateChange',
				function(event, filterType, btn, opts) {
						me.receiptDateChange(btn, opts);
				});
		$(document).on('resetAllFieldsEvent', function() {
			me.resetAllFields();
		});
		$(document).on('searchActionClicked', function() {
			me.searchActionClicked(me);
		});
		$(document).on('performReportAction', function(event, actionName) {
			me.downloadReport(actionName);
		});
		$(document).on('handleSavedFilterClick', function(event) {
			me.handleSavedFilterClick();
		});
		$(document).on('deleteFilterEvent', function(event, filterCode) {
			me.deleteFilterSet(filterCode);
		});
		$(document).on('handleLoggerChangeInQuickFilter', function() {
			me.handleLoggerChangeInQuickFilter(selectedFilterLoggerDesc);
		});
		$(document).on('handleClientChangeInQuickFilter',
				function(isSessionClientFilter) {
					me.handleClientChangeInQuickFilter(isSessionClientFilter);
				});
		me.updateConfig();
		me.control({
			'receiptView groupView' : {
				'groupTabChange' : me.doHandleGroupTabChange,
				'gridRender' : me.doHandleLoadGridData,
				'gridPageChange' : me.doHandleLoadGridData,
				'gridSortChange' : me.doHandleLoadGridData,
				'gridPageSizeChange' : me.doHandleLoadGridData,
				'gridColumnFilterChange' : me.doHandleLoadGridData,
				//'gridRowSelectionChange' : me.doHandleGridRowSelectionChange,
				//'gridSettingClick' : function(){
				//	me.showPageSettingPopup('GRID');
				//},
				'gridRowActionClick' : function(grid, rowIndex, columnIndex, actionName, record) {
					me.doHandleRowIconClick(actionName, grid, record, rowIndex);
				},
				'groupActionClick' : function(actionName, isGroupAction, maskPosition, grid, arrSelectedRecords) {
					if (isGroupAction === true){
						me.doHandleGroupActions(actionName, grid, arrInnerSelectedRecords, 'groupAction');
					}	
				},
				'gridStoreLoad' : function(grid, store) {
					me.disableActions(false);
				},
				'render' : function(){
					populateAdvancedFilterFieldValue();
					if(selectedFilterLoggerDesc == 'BUYER')
					{
						objReceiptSummaryPref = objReceiptBuyerSummaryPref;
						if (objReceiptSummaryPref) {
							var objJsonData = Ext.decode(objReceiptSummaryPref);
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
					}else if(selectedFilterLoggerDesc == 'SELLER')
					{
						objReceiptSummaryPref = objReceiptSellerSummaryPref;
						if (objReceiptSummaryPref) {
							var objJsonData = Ext.decode(objReceiptSummaryPref);
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
				},
				'childGridRowSelectionChanged' : function(innerGrid, record, index, selectedRecords, jsonData, action) {
					console.log(innerGrid);
				},
				'gridSettingClick' : function() {
					me.showPageSettingPopup('GRID');
				}
			},
			'receiptView groupView smartgrid' : {
				'beforeselect' : function(me, record, index, eOpts) {
					return false;
				}
			},
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
			'filterView label[itemId="createAdvanceFilterLabel"]' : {
				
				'click' : function() {
					getAdvancedFilterPopup('advanceFilterPurchaseOrder.form', 'filterForm');
					//me.assignSavedFilter();
				}
			},
			'filterView':{
				appliedFilterDelete : function(btn) {
					me.handleAppliedFilterDelete(btn);
				},
				afterrender : function() {
					me.handleClientChangeInQuickFilter();
				}
			},
			'filterView button[itemId="clearSettingsButton"]' : {
				'click' : function() {
					me.handleClearSettings();
				}
			},
			'receiptFilterView combo[itemId="savedFiltersCombo"]' :{
				handleSavedFilterItemClick : function(comboValue, comboDesc) {
					me.savedFilterVal = comboValue;
					me.doHandleStateChange();
					me.doHandleSavedFilterItemClick(comboValue, comboDesc);
				}
			},
			'receiptFilterView combo[itemId="statusFilter"]' : {
				'select' : function(combo, selectedRecords) {
					combo.isQuickStatusFieldChange = true;
				},
				'blur' : function(combo, record) {
					if (combo.isQuickStatusFieldChange)
						me.handleStatusClick(combo);
				}
			},
			'receiptFilterView textfield[itemId="receiptNumber"]' : {
				'blur' : function( textfield, e, eOpts) {
					if (textfield.rawValue != "%" && textfield.rawValue != me.receiptNumberVal)
						me.handleReceiptNumberTextChange(textfield);
				}
			},
			'receiptFilterView textfield[itemId="clientComboAuto"]' : {
				'boxready' : function(combo, width, height, eOpts) {
					if (!Ext.isEmpty(me.clientFilterVal)) {
						combo.setValue(me.clientFilterVal);
						combo.setRawValue(me.clientFilterDesc);
						selectedFilterClient = me.clientFilterVal;
						selectedFilterClientDesc = me.clientFilterDesc;
						clientCode =  me.clientFilterVal;
						
					} 
				}
			},
			'receiptFilterView textfield[itemId="clientCombo"]' : {
				'boxready' : function(combo, width, height, eOpts) {
					if (!Ext.isEmpty(me.clientFilterVal)) {
						combo.setValue(me.clientFilterVal);
						combo.setRawValue(me.clientFilterDesc);
						selectedFilterClient = me.clientFilterVal;
						selectedFilterClientDesc = me.clientFilterDesc;
						clientCode =  me.clientFilterVal;
						
					} 
				}
			}
		});
	},
	doHandleRowIconClick : function(actionName, grid, record, rowIndex) {
		//console.log("Row action of parent grid");
		var me = this;
		var groupView = me.getGroupView();
		var grid = groupView.getGrid();

			var strUrl = '';
			if (actionName === 'btnClose')
			{
				strUrl = 'closeReceipt.form';
			} else if (actionName === 'btnView')
			{
				strUrl = 'invoiceReceiptView.form';
			}else if (actionName === 'btnManualMatch')
			{
				strUrl = 'showReceiptManualMatchForm.form';
			}
			 
			me.submitForm(strUrl, record, actionName); 
		
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
		if (strUrl === 'invoiceReceiptView.form'){
			form.appendChild(me.createFormField('INPUT', 'HIDDEN','loginMode', selectedFilterLoggerDesc));
			form.appendChild(me.createFormField('INPUT', 'HIDDEN','txtRecordIndex', rowIndex));
			form.appendChild(me.createFormField('INPUT', 'HIDDEN', 'redirectFromGrid','Y'));		
		}
		form.appendChild(me.createFormField('INPUT', 'HIDDEN', 'CLOSE_URL','invoiceReceipt.form'));
		form.appendChild(me.createFormField('INPUT', 'HIDDEN',csrfTokenName, tokenValue));
		form.appendChild(me.createFormField('INPUT', 'HIDDEN', 'viewState',viewState));		
		form.action = strUrl;
		document.body.appendChild(form);
		form.submit();
		document.body.removeChild(form);
	},
	showPageSettingPopup : function(strInvokedFrom) {
		var me = this, objData = {}, objGroupView = me.getGroupView(), objPrefData, objGeneralSetting, objGridSetting, objColumnSetting;
		var objGroupByVal = '', objDefaultFilterVal = '', objGridSizeVal = '', objRowPerPageVal = _GridSizeTxn, strTitle = null, subGroupInfo;
		me.pageSettingPopup = null;
		if(selectedFilterLoggerDesc == 'BUYER')
		{
			objReceiptSummaryPref = objReceiptBuyerSummaryPref;
			arrGenericColumnModel = arrBuyerGenericColumnModel;
		}
		else if(selectedFilterLoggerDesc == 'SELLER')
		{			
			objReceiptSummaryPref = objReceiptSellerSummaryPref;
			arrGenericColumnModel = arrSellerGenericColumnModel;
		}
		if (!Ext.isEmpty(objReceiptSummaryPref)) {
			objPrefData = Ext.decode(objReceiptSummaryPref);
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
					: (Ext.isEmpty(Ext.decode(arrGenericColumnModel)) ? RECEIPT_COLUMNS || [] : Ext.decode(arrGenericColumnModel));
					
			
			
			if (!Ext.isEmpty(objGeneralSetting)) {
				objGroupByVal = objGeneralSetting.defaultGroupByCode;
				objDefaultFilterVal = objGeneralSetting.defaultFilterCode;
			}
			if (!Ext.isEmpty(objGridSetting)) {
				objGridSizeVal = objGridSetting.defaultGridSize;
				objRowPerPageVal = objGridSetting.defaultRowPerPage;
			}
		}
		if(objColumnSetting === undefined)
			objColumnSetting = RECEIPT_COLUMNS;
		
		objData["groupByData"] = objGroupView
				? objGroupView.cfgGroupByData
				: [];
		objData["filterUrl"] = 'services/userfilterslist/ReceiptAdvFilter'+selectedFilterLoggerDesc+'.json';
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
	handleEntryAction : function() {
		var me = this;
		var form = document.createElement('FORM');
		form.name = 'frmMain';
		form.id = 'frmMain';
		form.method = 'POST';
		form.appendChild(me.createFormField('INPUT', 'HIDDEN',
				csrfTokenName, tokenValue));
		//Populate client ID in case of single client
		if(isClientUser()) {
			var clientCombo = me.getFilterView().down("combo[itemId='clientCombo']");
			if(clientCombo.getStore().getCount() === 1) {
				form.appendChild(me.createFormField('INPUT', 'HIDDEN',
						'clientId', selectedFilterClient));
			}
		}
		if(selectedFilterClient !='ALL')
			form.appendChild(me.createFormField('INPUT', 'HIDDEN',
							'clientId', selectedFilterClient));
		form.appendChild(me.createFormField('INPUT', 'HIDDEN',
						'loginMode', selectedFilterLoggerDesc));
		
		
		document.body.appendChild(form);
		form.action = "receiptEntry.form";
		form.target = "";
		form.method = "POST";
		form.submit();
	},
		
	applyFilter : function() {
		var me = this;
		
		var objGroupView = me.getGroupView();
		var groupInfo = objGroupView.getGroupInfo();
		var subGroupInfo = objGroupView.getSubGroupInfo();
		var grid = me.getGrid();
		if (!Ext.isEmpty(grid)) {
			var strDataUrl = grid.store.dataUrl;
			var store = grid.store;
			var strUrl = grid.generateUrl(strDataUrl, grid.pageSize, 1, 1, store.sorters);
			strUrl = strUrl + me.getFilterUrl() + "&" + csrfTokenName + "=" + csrfTokenValue;
			if(!Ext.isEmpty(me.filterValidityName) && "ALL" !== me.filterValidityName){
				strUrl += "&validity=" +me.filterValidityName;
			}
			grid.loadGridData(strUrl, me.handleAfterGridDataLoad);
		}
		me.updateFilterInfo();
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
						if (isFilterApplied) {
							strTemp = strTemp + ' and ';
						}
						if(filterData[index].operatorValue=='statusFilterOp'){
								var objValue = filterData[index].paramValue1;
								var objArray = objValue.split(',');
								if( objArray.length >= 1 )
								{
									strTemp = strTemp + "(";
								}
								for (var i = 0; i < objArray.length; i++) {
										if(objArray[i] == 12){
											strTemp = strTemp + "((requestState eq '0' or requestState eq '1') and isSubmitted eq 'Y')";
										}
										else if(objArray[i] == 3){
											strTemp = strTemp + "(requestState eq '3' and validFlag eq 'Y')";
										}
										else if(objArray[i] == 11){
											strTemp = strTemp + "(requestState eq '3' and validFlag eq 'N')";
										}
										else if(objArray[i] == 0 || objArray[i] == 1){
											strTemp = strTemp + "(requestState eq '"+objArray[i]+"' and isSubmitted eq 'N')";
										}
										else{
											strTemp = strTemp + "(requestState eq '"+objArray[i]+"')";
										}
										if(i != (objArray.length -1)){
											strTemp = strTemp + ' or ';
										}
								
								}
								if( objArray.length >= 1 )
								{
									strTemp = strTemp + ")";
									isFilterApplied = true;
								}
								
						}
						else
							{
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
			me.preferenceHandler.readModulePreferences(Ext.String.format(me.strPageName, selectedFilterLoggerDesc),
					strModule, me.postHandleDoHandleGroupTabChange, null, me,
					false);

		} else
			me.postHandleDoHandleGroupTabChange();
	},

	postHandleDoHandleGroupTabChange : function(data, args) {
		var me = this;
		var objGroupView = me.getGroupView();
		var objSummaryView = me.getReceiptView(), objPref = null, gridModel = null, intPgSize = null,showPager = true, heightOption = null;
		var colModel = null, arrCols = null;
		if (data && data.preference) {
			objPref = Ext.decode(data.preference);
			arrCols = objPref.gridCols || null;
			intPgSize = objPref.pgSize || _GridSizeMaster;
			colModel = objSummaryView.getColumnModel(arrCols);
			showPager = objPref.gridSetting && !Ext.isEmpty(objPref.gridSetting.showPager) ? objPref.gridSetting.showPager : true;
			heightOption = objPref.gridSetting && !Ext.isEmpty(objPref.gridSetting.heightOption) ? objPref.gridSetting.heightOption : null;
			if (colModel) {
				gridModel = {
					columnModel : colModel,
					//pageSize : intPgSize,
					showPagerForced : showPager,
					heightOption : heightOption,
					storeModel:{
						sortState:objPref.sortState
					}
				};
			}
		}
		objGroupView.reconfigureGrid(gridModel);
	},

	doHandleLoadGridData : function(groupInfo, subGroupInfo, grid, url, pgSize, newPgNo, oldPgNo, sorter, filterData) {
		var me = this;
		arrInnerSelectedRecords = [];
		var objGroupView = me.getGroupView();
		var column=grid.columns[0];
		var arrOfParseQuickFilter = [], arrOfParseAdvFilter = [], arrOfFilteredApplied = [], tempArrOfParseQuickFilter = [];
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
				arrOfParseQuickFilter = generateFilterArray(quickJsonData, strApplicationDateFormat);
			}
		}
		
		if (!Ext.isEmpty(me.advFilterData)) {
			if (!Ext.isEmpty(me.advFilterData) && me.advFilterData.length >= 1) {				
				arrOfParseAdvFilter = generateFilterArray(me.advFilterData, strApplicationDateFormat);
			}
		}
		
		//logged in as
		var clientModeDesc = (selectedFilterLoggerDesc == 'SELLER' ? getLabel('seller', 'Seller') : getLabel('buyer', 'Buyer'));
		loggedInAsFilter = {"fieldId" : "loggedInAs","fieldLabel": getLabel('sellerOrBuyerr', 'View as'), "dataType":"S","operatorValue":"eq","fieldTipValue":clientModeDesc,"fieldValue" :clientModeDesc};
		tempArrOfParseQuickFilter.push(loggedInAsFilter);
		
		
		for(var index = 0; index < arrOfParseQuickFilter.length; index++)
		{
			tempArrOfParseQuickFilter[index+1] = arrOfParseQuickFilter[index]
		}
		
		if (arrOfParseQuickFilter && arrOfParseAdvFilter) {
			arrOfFilteredApplied = tempArrOfParseQuickFilter
					.concat(arrOfParseAdvFilter);
		}
		
		if (arrOfFilteredApplied){
			me.getFilterView().updateFilterInfo(arrOfFilteredApplied);
		}
		
		
		
		me.disableActions(true);
		var columns=grid.columns;
		Ext.each(columns, function(col) {
			col.disabled = true;
	        if(col.dataIndex == "reconReceiptState" || col.dataIndex == 'liquidationState'){
	        	col.sortable=false;
	        }
        });
		me.filtersAppliedCount = arrOfFilteredApplied.length;
		me.handleClearFilterButtonHideAndShow();
		me.reportGridOrder = strUrl;
		grid.loadGridData(strUrl, null, null, false);
		//objGroupView.handleGroupActionsVisibility(me.strDefaultMask);

		grid.on('cellclick', function(tableView, td, cellIndex, record, tr, rowIndex, e) {
			var clickedColumn = tableView.getGridColumns()[cellIndex];
			var columnType = clickedColumn.colType;
			if (Ext.isEmpty(columnType)) {
				if(clickedColumn.cls){
					var containsCheckboxCss = (clickedColumn.cls.indexOf('x-column-header-checkbox') > -1)
					columnType = containsCheckboxCss ? 'checkboxColumn' : '';
				}
				else{
					columnType='rowexpand';
				}
			}
			if(columnType !== 'actioncontent' && columnType !== 'checkboxColumn'  && columnType !== 'rowexpand') {
				me.handleGridRowClick(record, grid, columnType);
			}
		});
		grid.on('expanderClicked', function(view, cell, rowIndex, cellIndex, e, record){
			grid.handleRowExpand(record, grid, rowIndex);
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
				me.doHandleRowIconClick(arrVisibleActions[0].itemId, grid, record);
			}
		}
	},

	updateConfig : function() {
		var me = this;
		me.dateHandler = Ext.create('Ext.ux.gcp.DateUtil');
		me.preferenceHandler = Ext.create('Ext.ux.gcp.PreferencesHandler');
	},

	createFormField : function(element, type, name, value) {
		var inputField;
		inputField = document.createElement(element);
		inputField.type = type;
		inputField.name = name;
		inputField.value = value;
		return inputField;
	},
	disableActions : function(canDisable) {
		if (canDisable)
			$('.canDisable').addClass('button-grey-effect');
		else
			$('.canDisable').removeClass('button-grey-effect');
	},
	
	receiptDateChange : function(btn, opts) {
		var me = this;
		me.receiptDateFilterVal = btn.btnValue;
		me.receiptDateFilterLabel = btn.text;
		me.handleReceiptDateChange(btn.btnValue);
	},
	
	handleReceiptDateChange : function(index) {
		var me = this;
		var dateToField;
		var objDateParams = me.getDateParam(index, 'receiptDate');
		//appending the selected dropdown text to the date field
		if (!Ext.isEmpty(me.receiptDateFilterLabel)) {
			$('label[for="receiptDateLabel"]').text(getLabel("receiptDateLabel","Receipt Date")+" (" + me.receiptDateFilterLabel + ")");
		}
		
		var vFromDate = $.datepick.formatDate(strApplicationDateFormat, $.datepick.parseDate('yy-mm-dd', objDateParams.fieldValue1));
		var vToDate = $.datepick.formatDate(strApplicationDateFormat, $.datepick.parseDate('yy-mm-dd', objDateParams.fieldValue2));
		var filterOperator = objDateParams.operator;

		if (index == '13') {
			if (filterOperator == 'eq') {
				$('#receiptDate').datepick('setDate', vFromDate);
			} else {
				$('#receiptDate').datepick('setDate', [vFromDate, vToDate]);
			}
			if (filterOperator == 'eq')
				dateToField = "";
			else
				dateToField = vToDate;
			selectedReceiptDate = {
				operator : filterOperator,
				fromDate : vFromDate,
				toDate : dateToField
			};
		} else {
			if (index === '1' || index === '2' || index === '12') {
				if (index === '12' && !Ext.isEmpty(filterDays) && filterDays !== '999') {
					$('#receiptDate').datepick('setDate', vToDate);
				} else if(index === '12'){
					$('#receiptDate').datepick('setDate', vFromDate);
				}else {
					$('#receiptDate').datepick('setDate', vFromDate);

				}
			} else {
				$('#receiptDate').datepick('setDate', [vFromDate, vToDate]);

			}
			if (filterOperator == 'eq')
				dateToField = "";
			else
				dateToField = vToDate;
			selectedReceiptDate = {
				operator : filterOperator,
				fromDate : vFromDate,
				toDate : dateToField
			};
		}
		
	},
		getDateParam : function(index, dateType) {
		var me = this;
		me.dateRangeFilterVal = index;
		var objDateHandler = this.getDateHandler();
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
				// Widget Date Filter
				if (!isEmpty(me.datePickerSelectedEntryAdvDate)) {
					if (me.datePickerSelectedEntryAdvDate.length == 1) {
						fieldValue1 = me.datePickerSelectedEntryAdvDate[0];
						fieldValue2 = fieldValue1;
						operator = 'eq';
					} else if (me.datePickerSelectedEntryAdvDate.length == 2) {
						fieldValue1 = me.datePickerSelectedEntryAdvDate[0];
						fieldValue2 = me.datePickerSelectedEntryAdvDate[1];
						if (fieldValue1 == fieldValue2)
							operator = 'eq';
						else
							operator = 'bt';
					}
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
				
				if ('receiptDate' === dateType
						&& !isEmpty(me.datePickerSelectedReceiptAdvDate)) {
					if (me.datePickerSelectedReceiptAdvDate.length == 1) {
						fieldValue1 = Ext.Date.format(
								me.datePickerSelectedReceiptAdvDate[0],
								strSqlDateFormat);
						fieldValue2 = fieldValue1;
						operator = 'eq';
					} else if (me.datePickerSelectedReceiptAdvDate.length == 2) {
						fieldValue1 = Ext.Date.format(
								me.datePickerSelectedReceiptAdvDate[0],
								strSqlDateFormat);
						fieldValue2 = Ext.Date.format(
								me.datePickerSelectedReceiptAdvDate[1],
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
	
	//reseting all the fields
	resetAllFields : function() {
		var me = this;
	
		$("#saveFilterChkBox").attr('checked', false);
		me.datePickerSelectedReceiptAdvDate = [];
		selectedReceiptDate={};
		$('#receiptDate').val("");
		$('label[for="receiptDateLabel"]').text(getLabel("receiptDate","Receipt Date"));
		updateToolTip('receiptDate',null);
		$("#txtReceipt").val("");
		$("#txtStatus").val("");
		$("#msClient").val($("#msClient option:first").val());
		$("#dropdownClientCodeDescription").val("");
		$("#dropdownClientCode").val("");
		$("#receiptReconcilableAmountOperator").val($("#receiptReconcilableAmountOperator option:first").val());	
		$("#amountOperator").val($("#amountOperator option:first").val());	
		$("#txtAmount").val("");
		$("#txtReconcilableAmount").val("");
		$("#receiptAmountFieldTo").val("");
		$("#amountTo").addClass('hidden');
		$("#msAmountLabel").text(getLabel("receiptAmount","Receipt Amount"));
		$("#msReconciliationAmountLabel").text(getLabel("reconAmount","Receipt Reconciliation Amount"));
		$("#receiptReconcilableAmountFieldTo").val("");
		$("#reconcilableamountTo").addClass('hidden');
		$("#createdBy").val($("#createdBy option:first").val());
		$("input[type='text'][id='savedFilterAs']").val("");
		$("#msSavedFilter").val("");
		$("#msSavedFilter").multiselect("refresh");
		$('#amountOperator').niceSelect('update');
		resetAllMenuItemsInMultiSelect("#liquidationStatus");
		$('#receiptReconcilableAmountOperator').niceSelect('update');
		$("#txtStatus").niceSelect('update');
		$("#msClient").niceSelect('update');
	},
	searchActionClicked : function(me) {
		var me = this, objGroupView = null, savedFilterCombobox = me
				.getFilterView().down('combo[itemId="savedFiltersCombo"]');
		var SaveFilterChkBoxVal = $("input[type='checkbox'][id='saveFilterChkBox']")
				.is(':checked');
		if (SaveFilterChkBoxVal === true) {
			me.handleSaveAndSearchAction();
		} else {
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
		me.doHandleStateChange();
	},
	handleGroupActions : function(strUrl, remark,grid, arrSelectedRecords) {
		var me = this;
		if(strUrl == 'invoiceReconView.form') {
			me.submitForm(strUrl, arrSelectedRecords[0], 'view'); 
		} else {
			var arrayJson = new Array();
			var records = (arrSelectedRecords || []);
			for (var index = 0; index < records.length; index++) {
				arrayJson.push({
							serialNo : grid.getStore().indexOf(records[index])+ 1,
							identifier : records[index].data.parentIdentifier,
							userMessage : remark,
							childIdentifier :records[index].data.identifier,
							selectedClient : selectedFilterClient
						});
			}
			if (arrayJson)
				arrayJson = arrayJson.sort(function(valA, valB) {
							return valA.serialNo - valB.serialNo
						});
	
			Ext.Ajax.request({
						url : strUrl +'?'+csrfTokenName+'='+ tokenValue,
						method : 'POST',
						jsonData : Ext.encode(arrayJson),
						success : function(response) {
							// TODO : Action Result handling to be done here
							groupView.refreshData();
							// me.applyFilter();
							var errorMessage = '';
							if (response.responseText != '[]') {
								var jsonData = Ext
										.decode(response.responseText);
								jsonData = jsonData.d ? jsonData.d : jsonData;		
								/*Ext.each(jsonData[0].errors, function(error,
												index) {
											errorMessage = errorMessage
													+ error.errorMessage
													+ "<br/>";
										});*/
								if(!Ext.isEmpty(jsonData))
								{
									for(var i =0 ; i<jsonData.length;i++ )
									{
										var arrError = jsonData[i].errors;
										if(!Ext.isEmpty(arrError))
										{
											for(var j =0 ; j< arrError.length; j++)
											{
												for(var j = 0 ; j< arrError.length; j++)
												{
													errorMessage = errorMessage + arrError[j].code +' : '+ arrError[j].errorMessage+"<br/>";
												}
											}
										}
										
									}
									if('' != errorMessage && null != errorMessage)
									{
									 //Ext.Msg.alert("Error",errorMessage);
										Ext.MessageBox.show({
											title : getLabel('errorTitle','Error'),
											msg : errorMessage,
											buttons : Ext.MessageBox.OK,
											buttonText: {
									            ok: getLabel('btnOk', 'OK')
												},
											cls : 'ux_popup',
											icon : Ext.MessageBox.ERROR
										});
									} 
								}	
							}
						},
						failure : function() {
							var errMsg = "";
							Ext.MessageBox.show({
										title : getLabel('errorTitle', 'Error'),
										msg : getLabel('errorPopUpMsg',
												'Error while fetching data..!'),
										buttons : Ext.MessageBox.OK,
										buttonText: {
								            ok: getLabel('btnOk', 'OK')
											},
										icon : Ext.MessageBox.ERROR
									});
						}
					});
			}
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
							// filterGrid.getStore().reload();
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
	
	doSearchOnly : function() {
		var me = this;
		var statusChangedValue = $("#liquidationStatus").getMultiSelectValue();
		var statusValueDesc = [];
		$('#liquidationStatus :selected').each(function(i, selected) {
					statusValueDesc[i] = $(selected).text();
				});

		me.handleStatusFieldSync('A', statusChangedValue, statusValueDesc.toString());
		
		//receipt number
		var receiptNumber = $("#txtReceipt").val();
		me.handleReceiptNumberSync('A' , receiptNumber);
		
		var companyNameChangedValue = $("#msClient").getMultiSelectValue();
		var comapnyNameValueDesc = [];
		$('#msClient :selected').each(function(i, selected) {
			comapnyNameValueDesc[i] = $(selected).text();
				});
		me.handleCompanyNameFieldSync('A', companyNameChangedValue, comapnyNameValueDesc.toString());
		me.applyAdvancedFilter();
	},
	
	//syncing status with quick filter
	handleStatusFieldSync : function(type, statusData, statusDataDesc) {
		var me = this;
		if (!Ext.isEmpty(type)) {
			if (type === 'Q') {
				var objStatusField = $("#liquidationStatus");
				var objQuickStatusField = me.getFilterView()
						.down('combo[itemId="statusFilter"]');
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
				var objStatusField = me.getFilterView()
						.down('combo[itemId="statusFilter"]');
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
	//applying advanced filter
	applyAdvancedFilter : function(filterData) {
		var me = this, objGroupView = me.getGroupView();
		me.filterApplied = 'A';
		me.setDataForFilter(filterData);
		me.refreshData();
		if (objGroupView)
			objGroupView.toggleFilterIcon(true);
		objGroupView.setFilterToolTip(me.showAdvFilterCode || '');
	},
	
	//set data for filter
	
	setDataForFilter : function(filterData) {
		var me = this;
		var arrQuickJson = {};
		me.advFilterData = {};
		me.filterData = {};
		me.filterData = me.getQuickFilterQueryJson();
		var objJson = (!Ext.isEmpty(filterData)
				? filterData.filterBy
				: getAdvancedFilterQueryJson());
		
		var reqJson = me.findInAdvFilterData(objJson, "Client");
		if (!Ext.isEmpty(reqJson)) {
			arrQuickJson = me.filterData;
			arrQuickJson = me.removeFromQuickArrJson(arrQuickJson, "Client");
			me.filterData = arrQuickJson;
		}
		
		var reqJson = me.findInAdvFilterData(objJson, "ReceiptReference");
		if (!Ext.isEmpty(reqJson)) {
			arrQuickJson = me.filterData;
			arrQuickJson = me.removeFromQuickArrJson(arrQuickJson, "ReceiptReference");
			me.filterData = arrQuickJson;
		}
		
		reqJson = me.findInAdvFilterData(objJson, "LiquidationStatus");
		if (!Ext.isEmpty(reqJson)) {
			arrQuickJson = me.filterData;
			arrQuickJson = me.removeFromQuickArrJson(arrQuickJson,
					"LiquidationStatus");
			me.filterData = arrQuickJson;
		}
		
		me.advFilterData = objJson;
		var filterCode = $("input[type='text'][id='savedFilterAs']").val();
		if (!Ext.isEmpty(filterCode))
			me.advFilterCodeApplied = filterCode;

	},
	
	//get quick filter query json
	getQuickFilterQueryJson : function() {
		var me = this;
		var statusFilterValArray = [];
		var statusFilterVal = me.statusFilterVal;
		var statusFilterDiscArray = [];
		var statusFilterDisc = me.statusFilterDesc;
		var clientFilterVal = me.clientFilterVal;
		var clientFilterDesc = me.clientFilterDesc;
		var jsonArray = [];
		
		if (!Ext.isEmpty(clientFilterVal) && (clientFilterVal != 'all' && clientFilterVal != 'ALL' && clientFilterVal != 'All Companies')) {
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
		
		if (statusFilterVal != null && statusFilterVal != 'All'
				&& statusFilterVal != 'all' && statusFilterVal.length >= 1) {
			statusFilterValArray = statusFilterVal.toString();

			if (statusFilterDisc != null && statusFilterDisc != 'All'
					&& statusFilterDisc != 'all'
					&& statusFilterDisc.length >= 1)
				statusFilterDiscArray = statusFilterDisc.toString();

			jsonArray.push({
						paramName : 'LiquidationStatus',	
						paramValue1 : statusFilterValArray,
						operatorValue : 'in',
						dataType : 'S',
						paramFieldLable : getLabel('lblStatus', 'Status'),
						displayType : 5,
						displayValue1 : statusFilterDiscArray
					});
			}
			
			if (me.receiptNumberVal != null && !Ext.isEmpty(me.receiptNumberVal)) {
				jsonArray.push({
					field : 'ReceiptReference',
					paramName : 'ReceiptReference',
					operatorValue : 'lk',
					value1 : encodeURIComponent(me.receiptNumberVal.toUpperCase().replace(new RegExp("'", 'g'), "\''")),
					value2 : '',
					dataType : 'S',
					displayType : 5,
					fieldLabel :  getLabel('receiptNumber','Receipt Number'),
					displayValue1 : me.receiptNumberVal
				});
			}
		
		return jsonArray;
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
	removeFromQuickArrJson : function(arr, key) {
		for (var ai, i = arr.length; i--;) {
			if ((ai = arr[i]) && ai.paramName == key) {
				arr.splice(i, 1);
			}
		}
		return arr;
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
	
	//update saved filter combo in quick filter
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
	
	generateFilterUrl : function(subGroupInfo, groupInfo) {
		var me = this;
		var strQuickFilterUrl = '', strAdvancedFilterUrl = '', strUrl = '', isFilterApplied = false ,strClientFilterUrl='';
		var strGroupQuery = (subGroupInfo && subGroupInfo.groupQuery)
				? subGroupInfo.groupQuery
				: '';
		var filterData = me.filterData;
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
		//if client code not present in quick filter fetch from adv filter
		if(strUrl.indexOf('&$clientFilter') < 0){
			filterData = me.advFilterData;
			for (var index = 0; index < filterData.length; index++) {
			if(filterData[index].field === "Client")
					strClientFilterUrl = filterData[index].value1;
			}
			if (!Ext.isEmpty(strClientFilterUrl)) {
				strUrl += '&$clientFilter=' + strClientFilterUrl;
				isClientFilterApplied = true;
			}
		}
		
		return strUrl;
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
				if(filterData[index].field === "Client")
					continue;
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
						var objArray = null;
						var objValue = filterData[index].value1;
						if(Array.isArray(objValue))
						{
							objArray = filterData[index].value1;
						}
						else
						{
							if(objValue != undefined)
							objArray = objValue.split(',');
						}
						//var objArray = objValue.split(',');
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
									}else if(filterData[index].field === 'Beneficiary'){
										strTemp = strTemp
												+ 'DrawerCode'
												+ ' eq ';
										strTemp = strTemp + '\'' + objArray[i]
												+ '\'';
										strTemp+=' or ClientCode eq '+ '\'' + objArray[i]
												+ '\'';
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
	handleSavedFilterClick : function() {
		var me = this;
		var savedFilterVal = $("#msSavedFilter").val();
		me.resetAllFields();
		me.filterCodeValue = null;

		var filterCodeRef = $("input[type='text'][id='savedFilterAs']");
		if (!Ext.isEmpty(filterCodeRef)) {
			filterCodeRef.val(savedFilterVal);
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
							            ok: getLabel('btnOk','Ok')
							        },
									cls : 't7-popup',
									icon : Ext.MessageBox.ERROR
								});
					}
				});
	},
	
	populateSavedFilter : function(filterCode, filterData, applyAdvFilter) {
		var me = this;
		var fieldName = '';
		var fieldVal = '';
		var fieldSecondVal = '';
		var currentFilterData = '';
		var fieldType = '';
		var columnId = '';
	
		var buttonText = '';
		var operatorValue = '';
		var isPayCategoryFieldPresent = false;
		var objSellerAutoComp = null;
		if (!Ext.isEmpty(filterData.sellerValue)) {
			objSellerAutoComp = $("input[type='text'][id='sellerAutocomplete']");
			if (!$(objSellerAutoComp).is(":visible"))
				objSellerAutoComp.val(filterData.sellerValue);
		}
		for (i = 0; i < filterData.filterBy.length; i++) {
			fieldName = filterData.filterBy[i].field;
			fieldVal = filterData.filterBy[i].value1;
			fieldSecondVal = filterData.filterBy[i].value2;
			currentFilterData = filterData.filterBy[i];
			operatorValue = filterData.filterBy[i].operator;
			
			if (fieldName === 'ReceiptReference') {
				$("#txtReceipt").val(fieldVal);
			} 
			else if (fieldName === 'ReceiptAmount' || fieldName === 'ReceiptReconciableAmount') {
				me.setAmounts(operatorValue, fieldVal, fieldSecondVal , fieldName);
			} 
			else if (fieldName === 'ReceiptDate') {
				me.setSavedFilterDates(fieldName, currentFilterData);
			} 
			else if (fieldName === 'LiquidationStatus') {
				me.checkUnCheckMenuItems(fieldName, fieldVal);
				if (fieldName === 'LiquidationStatus' && Array.isArray(fieldVal)) {
					filterData.filterBy[i].value1 = fieldVal.join(",");
				}
			}
			else if (fieldName === 'Beneficiary') {
				$('#dropdownClientCode').val(fieldVal);
				$("#dropdownClientCodeDescription").val(filterData.filterBy[i].displayValue1);
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
	setSavedFilterDates : function(dateType, data) {
		if (!Ext.isEmpty(dateType) && !Ext.isEmpty(data)) {
			var me = this;
			var dateFilterRefFrom = null;
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

			if (dateType === 'ReceiptDate') {
				selectedReceiptDate = {
					operator : dateOperator,
					fromDate : formattedFromDate,
					toDate : formattedToDate
				};
				dateFilterRefFrom = $('#receiptDate');
				/* dateFilterRefTo = $('#creationDateTo'); */
			} 
			if (dateOperator === 'eq'||dateOperator === 'lt'||dateOperator === 'gt') {
					$(dateFilterRefFrom).val(formattedFromDate);
				}
			else if (dateOperator === 'bt') {
						$(dateFilterRefFrom).datepick('setDate', [formattedFromDate, formattedToDate]);
					}
		}
	},	
	setAmounts : function(operator, amountFromFieldValue, amountToFieldValue ,  fieldName) {
		var amonutFieldRefFrom = $("#txtAmount");
		var amountFieldRefTo = $("#receiptAmountFieldTo");
		
		var amonutReconcialbleFieldRefFrom = $("#txtReconcilableAmount");
		var amountReconciableFieldRefTo = $("#receiptReconcilableAmountFieldTo");
		
		if (!Ext.isEmpty(operator)) {
			if (!Ext.isEmpty(amountFromFieldValue)) {

				if(fieldName === 'ReceiptAmount'){
					
					$('#amountOperator').val(operator);
					$('#amountOperator').niceSelect('update');
					amonutFieldRefFrom.val(amountFromFieldValue);
					
					if (!Ext.isEmpty(amountToFieldValue)) {
						if (operator == "bt") {
							$("#txtAmount").removeClass("hidden");
							amountFieldRefTo.val(amountToFieldValue);
							$('#amountTo').removeClass('hidden');
						}else{
							amountFieldRefTo.addClass('hidden');
							$('#amountTo').addClass('hidden');
						}
					}
				}
				else if(fieldName === "ReceiptReconciableAmount"){
					
					$('#receiptReconcilableAmountOperator').val(operator);
					$('#receiptReconcilableAmountOperator').niceSelect('update');
					amonutReconcialbleFieldRefFrom.val(amountFromFieldValue);
					
					if (!Ext.isEmpty(amountToFieldValue)) {
						if (operator == "bt") {
							$("#txtReconcilableAmount").removeClass("hidden");
							amountReconciableFieldRefTo.val(amountToFieldValue);
							$('#reconcilableamountTo').removeClass('hidden');
						}else{
							amountReconciableFieldRefTo.addClass('hidden');
							$('#reconcilableamountTo').addClass('hidden');
						}
					}
				}
			}
		}
	},
	
	//handle filter delete on quick filter
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
	removeFromAdvanceArrJson : function(arr, key) {
		for (var ai, i = arr.length; i--;) {
			if ((ai = arr[i]) && ai.field == key) {
				arr.splice(i, 1);
			}
		}
		return arr;
	},
	resetFieldOnDelete : function(objData) {
		var me = this, strFieldName;
		
		if (!Ext.isEmpty(objData))
			strFieldName = objData.paramName || objData.field;
		
		if(strFieldName === 'ReceiptReference'){
			//adv filter
			$("#txtReceipt").val("");
			
			//quick filter
			var receiptNumberTextField = me.getReceiptFilterView()
			.down('textfield[itemId="receiptNumber"]');
			if(!Ext.isEmpty(receiptNumberTextField)){
				receiptNumberTextField.reset();
				me.receiptNumberVal = null;
			}
			
		}else if(strFieldName === 'ReceiptAmount'){
			$("#txtAmount").val("");
			$("#receiptAmountFieldTo").val("");
			$("#amountOperator").val($("#amountOperator option:first").val());	
			$('#amountOperator').niceSelect('update');
		} else if(strFieldName === 'ReceiptReconciableAmount'){
			$("#txtReconcilableAmount").val("");
			$("#receiptReconcilableAmountFieldTo").val("");
			$("#receiptReconcilableAmountOperator").val($("#amountOperator option:first").val());	
			$('#receiptReconcilableAmountOperator').niceSelect('update');
		} else if(strFieldName === 'ReceiptDate'){
			$("#receiptDate").val("");
			updateToolTip('receiptDate',null);
		} else if(strFieldName === 'LiquidationStatus'){
			$("#liquidationStatus").val("");
			$("#liquidationStatus").multiselect("refresh");
			var statusComboBox = me.getReceiptFilterView().down('combo[itemId="statusFilter"]');
			me.statusFilterVal = 'all';
			statusComboBox.selectAllValues();
		}else if(strFieldName === 'Beneficiary'){
			$('#dropdownClientCode').val("");
				$("#dropdownClientCodeDescription").val("");
		}else if(strFieldName === 'Client'){
			var clientFieldCombo  = me.getReceiptFilterView().down('combo[itemId="clientCombo"]');
			clientFieldCombo.setValue('');
			clientFieldCombo.setRawValue('');
			
			var clientFieldAuto = me.getReceiptFilterView().down('combo[itemId="clientComboAuto"]');
			clientFieldAuto.setValue('');
			clientFieldAuto.setRawValue('');
		}		
		me.savedFilterVal = '';
	},
	doHandleSavedFilterItemClick : function(filterCode, comboDesc) {
		var me = this;
		if (!Ext.isEmpty(filterCode)) {
			me.savePrefAdvFilterCode = filterCode;
			me.showAdvFilterCode = filterCode;
			me.resetAllFields();
			me.getSavedFilterData(filterCode, me.populateSavedFilter, true);
		}
		me.savePrefAdvFilterCode = filterCode;
		me.showAdvFilterCode = filterCode;
	},
	handleGroupActionsVisibility : function(actionMask) {
		var me = this;
		var actionBar = me.getGroupView().down('toolbar[itemId="groupActionToolBar"]');
		var blnEnabled = false, strBitMapKey = null, arrItems = new Array();
		if (!Ext.isEmpty(actionBar) && !Ext.isEmpty(actionBar.items)
				&& !Ext.isEmpty(actionBar.items.items)) {
			arrItems = actionBar.items.items;
			var isSameUser = true;
			if(arrInnerSelectedRecords.length > 0){
				if (arrInnerSelectedRecords[0].raw.makerId === USER) {
					isSameUser = false;
				}
			}
			Ext.each(arrItems, function(item) {
						strBitMapKey = parseInt(item.maskPosition,10) - 1;
						if (!Ext.isEmpty(strBitMapKey)) {
							blnEnabled = isActionEnabled(actionMask,
									strBitMapKey) && isSameUser;
							item.setDisabled(!blnEnabled);
						}
					});
		}
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
		var strUrl = 'services/userpreferences/reconReceipt{0}/groupViewAdvanceFilter.json';
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
	handleStatusClick : function(combo) {
		var me = this;
		combo.isQuickStatusFieldChange = false;
		if(combo.isAllSelected()) {
			me.statusFilterVal = 'all';
		}else{
			me.statusFilterVal = combo.getSelectedValues();
			me.statusFilterDesc = combo.getRawValue();
		}
		me.handleStatusFieldSync('Q', me.statusFilterVal, null);
		me.filterApplied = 'Q';
		me.setDataForFilter();
		me.refreshData();
	},
	handleClearSettings : function() {
		var me = this, objGroupView = me.getGroupView();
		
		var statusComboBox = me.getReceiptView()
				.down('combo[itemId="statusFilter"]');
		me.statusFilterVal = 'all';
		statusComboBox.selectAllValues();
		
		me.savedFilterVal = '';
		
		var savedFilterComboBox = me.getReceiptView()
				.down('combo[itemId="savedFiltersCombo"]');
		savedFilterComboBox.setValue(me.savedFilterVal);
		
		//setting receipt number empty
		var receiptNumberTextField = me.getReceiptFilterView()
		.down('textfield[itemId="receiptNumber"]');
		if(!Ext.isEmpty(receiptNumberTextField)){
			receiptNumberTextField.reset();
			me.receiptNumberVal = null;
		}
		
		
		//setting company name as empty
		if (isClientUser()) {
			var clientComboBox = me.getReceiptFilterView()
					.down('combo[itemId="clientCombo"]');
			me.clientFilterVal = 'All Companies';
			selectedFilterClientDesc = "";
			selectedFilterClient = "";
			selectedClientDesc = "";
			clientComboBox.setValue(me.clientFilterVal);
		} else {
			var clientComboBox = me.getReceiptFilterView()
					.down('combo[itemId="clientComboAuto]');
			clientComboBox.reset();
			me.clientFilterVal = '';
			selectedFilterClientDesc = "";
			selectedFilterClient = "";
			selectedClientDesc = "";
		}

		me.filterApplied = 'Q';
		if (objGroupView)
			objGroupView.toggleFilterIcon(false);
		objGroupView.setFilterToolTip('');

		me.resetAllFields();
		me.setDataForFilter();
		me.refreshData();
	},
	handleLoggerChangeInQuickFilter : function(selectedFilterLoggerDesc) {
		var me = this;
		var gridPanel = me.getReceiptView();
		gridPanel.removeAll();
		group = gridPanel.createGroupView(selectedFilterLoggerDesc);
		gridPanel.add(group);
		me.getReceiptFilterView('#parentContainer').down('#sellerOrBuyerrCombo').suspendEvents();
		me.getReceiptFilterView('#parentContainer').down('#sellerOrBuyerrCombo').setValue(selectedFilterLogger);
		me.getReceiptFilterView('#parentContainer').down('#sellerOrBuyerrCombo').resumeEvents();
		
		var savedFilterComboBox = me.getFilterView()
				.down('combo[itemId="savedFiltersCombo"]');
		
		me.advFilterData = '';
		me.getSavedFilterData(me.savedFilterVal, me.populateSavedFilter, true);
		
		if(me.savedFilterVal === "")				
		{
			me.resetAllFields();
			me.setDataForFilter();
			me.refreshData();
		}
		savedFilterComboBox.setValue(me.savedFilterVal);
	},
	handleClientChangeInQuickFilter : function() {
		var me = this;
		me.clientCode = selectedFilterClient;
		me.clientDesc = selectedFilterClientDesc;
		me.clientFilterVal = 
			isEmpty(selectedFilterClient) ? 'All Companies' : selectedFilterClient;
		me.clientFilterDesc = selectedFilterClientDesc;
		quickFilterClientValSelected = me.clientCode;
		quickFilterClientDescSelected = me.clientDesc;
		me.handleCompanyNameFieldSync('Q' , me.clientFilterVal , me.clientFilterDesc);
		me.setDataForFilter();
		me.applyQuickFilter();
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
			filterView.down('button[text='+loggedInDisplayText+']').addCls('no-close-icon');
			filterView.down('button[text='+loggedInDisplayText+']').setIconCls('');
		}
	},
	handleReceiptNumberTextChange : function(textfield) {
		var me = this;
		me.receiptNumberVal = textfield.rawValue;
		me.handleReceiptNumberSync('Q' ,me.receiptNumberVal);
		me.filterApplied = 'Q';
		me.setDataForFilter();
		me.refreshData();
	},
	
	handleReceiptNumberSync : function(type , changedReceiptNumber){
		var me = this;
		if (!Ext.isEmpty(type)) {
			if (type === 'Q') {
				var advFilterReceiptNumberField = $("#txtReceipt");
				var quickFilterReceiptNumberField = me.getReceiptFilterView().down('textfield[itemId="receiptNumber"]');
				
				if(!Ext.isEmpty(changedReceiptNumber)){
					advFilterReceiptNumberField.val('');
					advFilterReceiptNumberField.val(changedReceiptNumber);
				}else if(Ext.isEmpty(changedReceiptNumber)){
					advFilterReceiptNumberField.val('');
				}
			}
			if(type === 'A'){
				var advFilterReceiptNumberField = $("#txtReceipt");
				var quickFilterReceiptNumberField = me.getReceiptFilterView().down('textfield[itemId="receiptNumber"]');
				
				if(!Ext.isEmpty(changedReceiptNumber)){
					quickFilterReceiptNumberField.setValue('');
					quickFilterReceiptNumberField.setValue(changedReceiptNumber);
				}else if(Ext.isEmpty(changedReceiptNumber)){
					quickFilterReceiptNumberField.setValue('');
				}
			}
		}
	},
	
	handleCompanyNameFieldSync : function(type, companyData, companyDataDesc){
		var me = this;
		if (!Ext.isEmpty(type)) {
			if (type === 'Q') {
				var objClientField = $("#msClient");
				if (!Ext.isEmpty(companyData)) {
					objClientField.val([]);
					objClientField.val(companyData);
				} else if (Ext.isEmpty(companyData)) {
					objClientField.val([]);
				}
				objClientField.niceSelect("update");
				
			}
			if (type === 'A') {
				var objClientField = me.getReceiptFilterView().down('combo[itemId="clientCombo"]');
				var objClientFieldAuto = me.getReceiptFilterView().down('combo[itemId="clientComboAuto"]');
				if(!Ext.isEmpty(objClientField)|| !Ext.isEmpty(objClientFieldAuto)){
					if (!Ext.isEmpty(companyData) && (companyData[0] != 'all') ) {
						me.clientFilterVal = 'All Companies';
						objClientField.setValue(companyData);
						objClientField.selectedOptions = companyData;
						objClientFieldAuto.setValue(companyData);
						objClientFieldAuto.setRawValue(companyDataDesc);
						objClientFieldAuto.selectedOptions = companyData;
					} else {
						objClientField.setValue(['All Companies']);
						me.clientFilterVal = 'All Companies';
					}
				}
			}
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
				me.preferenceHandler.saveModulePreferences(Ext.String.format(me.strPageName, selectedFilterLoggerDesc),
						strModule, objPref, me.postHandlePageGridSetting, args,
						me, false);
			} else {
				me.preferenceHandler.savePagePreferences(Ext.String.format(me.strPageName, selectedFilterLoggerDesc),
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
				buttonText: {
		            ok: getLabel('btnOk', 'OK')
					},
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
			me.preferenceHandler.clearPagePreferences(Ext.String.format(me.strPageName, selectedFilterLoggerDesc), arrPref,
					me.postHandleRestorePageSetting, args, me, false);
		} else
			me.preferenceHandler.clearPagePreferences(Ext.String.format(me.strPageName, selectedFilterLoggerDesc), arrPref,
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
			} else{
				me.doDeleteLocalState();
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
	
	savePageSetting : function(arrPref, strInvokedFrom) {
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
					me.updateObjReceiptSummaryPref, args, me, false);
		}
	},
	updateObjReceiptSummaryPref : function(data) {
		objReceiptSummaryPref = Ext.encode(data);
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
		strUrl = 'services/generateInvoiceReceiptCenterReport/'+selectedFilterLoggerDesc+'.' + strExtension;
		strUrl += '?$skip=1';
		me.setDataForFilter();		
		//var filterUrl = me.generateFilterUrl();
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
	doDeleteLocalState : function(){
		var me = this;

	},
	doHandleGroupActions : function(strAction, grid, arrSelectedRecords, strActionType) {
		var me = this;
		var strUrl = Ext.String.format('services/invoiceReceiptList/{0}', strAction);
		if (strAction === 'reject') {
			this.showRejectVerifyPopUp(strAction, strUrl, grid,
					arrSelectedRecords, strActionType);

		} else {
			this.handleGroupActions(strUrl, '', grid, arrSelectedRecords,
					strActionType, strAction);
		}
		$(document).trigger("handleGroupActionsVisibility",['00000000']);
	}
});