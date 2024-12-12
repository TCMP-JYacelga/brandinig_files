Ext.define('GCP.controller.InvoiceReconController', {
	extend : 'Ext.app.Controller',
	requires : ['Ext.ux.gcp.DateUtil','Ext.ux.gcp.PageSettingPopUp','GCP.view.HistoryPopup'],
	views : ['GCP.view.HistoryPopup', 'GCP.view.InvoiceReconFilterView',
	         'GCP.view.InvoiceReconView'],
	refs : [{
		ref : 'groupView',
		selector : 'invoiceReconView groupView'
	},{
		ref : 'pageSettingPopUp',
		selector : 'pageSettingPopUp'
	}, {
		ref : 'grid',
		selector : 'invoiceReconView groupView smartgrid'
	}, {
		ref : 'filterView',
		selector : 'invoiceReconView groupView filterView'
	}, {
		ref : 'invoiceReconView',
		selector : 'invoiceReconView'
	},{
		ref:'invoiceReconFilterView',
		selector : 'invoiceReconFilterView'
	}],
	config : {
		strPageName:'invRecon{0}',
		pageSettingPopup : null,
		isCompanySelected : false,
		//preferenceHandler : null,
		strDefaultMask : '000000000000000000',
		userStatusPrefCode :'',
		userStatusPrefDesc :'',
		invoiceDateFilterVal:'',
		invoiceDateFilterLabel:getLabel('today', 'Today'),
		datePickerSelectedInvoiceAdvDate : [],
		dateFilterLabel : '',
		dateFilterVal : '',
		dateRangeFilterVal : '13',
		dateHandler : null,
		strReadAllAdvancedFilterCodeUrl : 'services/userfilterslist/InvoiceAdvFilter{0}.json',
		strGetSavedFilterUrl : 'services/userfilters/InvoiceAdvFilter{0}/{1}.json',
		strModifySavedFilterUrl : 'services/userfilters/InvoiceAdvFilter{0}/{1}.json',
		strRemoveSavedFilterUrl : 'services/userfilters/InvoiceAdvFilter{0}/{1}/remove.json',
		filterData : [],
		advFilterData : [],
		advSortByData : [],
		filtersAppliedCount : 1,
		invoiceNumberVal : null,
		filterCodeValue:''
	},
	init : function() {
		var me = this;
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
			me.datePickerSelectedInvoiceAdvDate = dates;
			me.invoiceDateFilterVal = me.dateRangeFilterVal;
			me.invoiceDateFilterLabel = getLabel('daterange',
					'Date Range');
			me.handleInvoiceDateChange(me.dateRangeFilterVal);
			updateToolTip('invoiceDate','('+me.invoiceDateFilterLabel+')');
		});
		$(document).on('resetAllFieldsEvent', function() {
			me.resetAllFields();
		});
		$(document).on('performReportAction', function(event, actionName) {
			me.downloadReport(actionName);
		});
		//handling triggered events
		$(document).on('filterDateChange',
				function(event, filterType, btn, opts) {
						me.invoiceDateChange(btn, opts);
				});
		
		$(document).on('searchActionClicked', function() {
			me.searchActionClicked(me);
		});
		$(document).on('deleteFilterEvent', function(event, filterCode) {
			me.deleteFilterSet(filterCode);
		});
		$(document).on('handleSavedFilterClick', function(event) {
			me.handleSavedFilterClick();
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
			'invoiceReconView groupView' : {
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
					
				},
				'render' : function(){
					 populateAdvancedFilterFieldValue();
					if(selectedFilterLoggerDesc == 'BUYER')
					{
						objInvoiceSummaryPref = objInvReconBuyerSummaryPref;
						if (objInvoiceSummaryPref) {
							var objJsonData = Ext.decode(objInvoiceSummaryPref);
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
						objInvoiceSummaryPref = objInvReconSellerSummaryPref;
						if (objInvoiceSummaryPref) {
							var objJsonData = Ext.decode(objInvoiceSummaryPref);
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
			'invoiceReconView groupView smartgrid' : {
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
			'invoiceReconFilterView textfield[itemId="invoiceNumber"]' : {
				'blur' : function( textfield, e, eOpts) {
					if (textfield.rawValue != "%" && textfield.rawValue != me.invoiceNumberVal)
						me.handleInvoiceNumberTextChange(textfield);
				}
			},
			'invoiceReconFilterView combo[itemId="statusFilter"]' : {
				'select' : function(combo, selectedRecords) {
					combo.isQuickStatusFieldChange = true;
				},
				'blur' : function(combo, record) {
					if (combo.isQuickStatusFieldChange)
						me.handleStatusClick(combo);
				}
			},
			'invoiceReconFilterView combo[itemId="savedFiltersCombo"]' :{
				handleSavedFilterItemClick : function(comboValue, comboDesc) {
					me.savedFilterVal = comboValue;
					me.doHandleStateChange();
					me.doHandleSavedFilterItemClick(comboValue, comboDesc);
				}
			},
			'invoiceReconFilterView combo[itemId="clientComboAuto"]' : {
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
			'invoiceReconFilterView combo[itemId="clientCombo"]' : {
				'boxready' : function(combo, width, height, eOpts) {
					if (!Ext.isEmpty(me.clientFilterVal)) {
						combo.setValue(me.clientFilterVal);
						combo.setRawValue(me.clientFilterDesc);
						selectedFilterClient = me.clientFilterVal;
						selectedFilterClientDesc = me.clientFilterDesc;
						clientCode =  me.clientFilterVal;
						
					} else {
						combo.setValue(combo.getStore().getAt(0));
					}
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
			}
		});
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
	handleInvoiceNumberTextChange : function(textfield) {
		var me = this;
		me.invoiceNumberVal = textfield.rawValue;
		me.handleInvoiceNumberSync('Q' ,me.invoiceNumberVal);
		me.filterApplied = 'Q';
		me.setDataForFilter();
		me.refreshData();
	},

	
	doHandleRowIconClick : function(actionName, grid, record, rowIndex) {
		//console.log("Row action of parent grid");
		var me = this;
		var groupView = me.getGroupView();
		var grid = groupView.getGrid();

			var strUrl = '',arrSelectedRecord=[];
			if (actionName === 'btnClose')
			{
				arrSelectedRecord.push(record);
				me.doHandleGroupActions('closeInvocieRecon', grid, arrSelectedRecord, 'rowAction');
			}else{
				if (actionName === 'btnView')
				{
					strUrl = 'invoiceReconView.form';
				}else if (actionName === 'btnManualMatch')
				{
					strUrl = 'showManualMatchForm.form';
				}
				 
				me.submitForm(strUrl, record, actionName); 
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
		if (strUrl === 'invoiceReconView.form'){
			form.appendChild(me.createFormField('INPUT', 'HIDDEN','txtRecordIndex', rowIndex));
			form.appendChild(me.createFormField('INPUT', 'HIDDEN', 'redirectFromGrid','Y'));		
		}
		form.appendChild(me.createFormField('INPUT', 'HIDDEN', 'CLOSE_URL','invoiceRecon.form'));
		form.appendChild(me.createFormField('INPUT', 'HIDDEN',csrfTokenName, tokenValue));
		form.appendChild(me.createFormField('INPUT', 'HIDDEN', 'viewState',viewState));		
		form.appendChild(me.createFormField('INPUT', 'HIDDEN', 'loggedinClient',selectedFilterClient));
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
			objInvReconSummaryPref = objInvReconBuyerSummaryPref;
			arrGenericColumnModel = arrBuyerGenericColumnModel;
		}
		else if(selectedFilterLoggerDesc == 'SELLER')
		{			
			objInvReconSummaryPref = objInvReconSellerSummaryPref;
			arrGenericColumnModel = arrSellerGenericColumnModel;
		}
		if (!Ext.isEmpty(objInvReconSummaryPref)) {
			objPrefData = Ext.decode(objInvReconSummaryPref);
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
					: (Ext.isEmpty(Ext.decode(arrGenericColumnModel)) ? INV_RECON_COLUMNS || [] : Ext.decode(arrGenericColumnModel || '[]'));
			
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
			objColumnSetting = INV_RECON_COLUMNS;
		
		objData["groupByData"] = objGroupView
				? objGroupView.cfgGroupByData
				: [];
		objData["filterUrl"] = 'services/userfilterslist/InvoiceAdvFilter'+selectedFilterLoggerDesc+'.json';
		
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
		var objSummaryView = me.getInvoiceReconView(), objPref = null, gridModel = null, intPgSize = null,showPager = true, heightOption = null;
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
		var strUrl = grid.generateUrl(url, pgSize, newPgNo, oldPgNo, sorter); + "&" + csrfTokenName + "=" + csrfTokenValue;
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

		var columns=grid.columns;
		Ext.each(columns, function(col) {
	        if(col.dataIndex=="reconInvoiceState"){
	        	col.sortable=false;
	        }
        });
		me.filtersAppliedCount = arrOfFilteredApplied.length;
		me.handleClearFilterButtonHideAndShow();
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
	handleGroupActions : function(strUrl, remark,grid, arrSelectedRecords) {
		var me = this;
		var groupView = me.getGroupView();
		if(strUrl == 'invoiceReceiptView.form') {
			me.submitForm(strUrl, arrSelectedRecords[0], 'view'); 
		} else {
		var arrayJson = new Array();
		var records = (arrSelectedRecords || []);
		for (var index = 0; index < records.length; index++) {
			arrayJson.push({
						serialNo : grid.getStore().indexOf(records[index])
								+ 1,
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
					url : strUrl+'?'+csrfTokenName+'='+tokenValue,
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
		objJson = getInvoiceAdvancedFilterValueJson(FilterCodeVal);
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
					me.updateObjInvoiceSummaryPref, args, me, false);
		}
	},
	updateObjInvoiceSummaryPref : function(data) {
		objInvoiceSummaryPref = Ext.encode(data);
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
	doDeleteLocalState : function(){
		var me = this;

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
		generateFilterUrl : function(subGroupInfo, groupInfo) {
		var me = this;
		var strQuickFilterUrl = '', strAdvancedFilterUrl = '', strUrl = '', isFilterApplied = false ,strClientFilterUrl='';;
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
	},	generateUrlWithAdvancedFilterParams : function(blnFilterApplied) {
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
	doHandleGroupActions : function(strAction, grid, arrSelectedRecords, strActionType) {
		var me = this;
		var strUrl = Ext.String.format('services/invoiceReconsList/{0}', strAction);
		if (strAction === 'reject') {
			this.showRejectVerifyPopUp(strAction, strUrl, grid,
					arrSelectedRecords, strActionType);

		} else {
			this.handleGroupActions(strUrl, '', grid, arrSelectedRecords,
					strActionType, strAction);
		}
		$(document).trigger("handleGroupActionsVisibility",['00000000']);
	},
	invoiceDateChange : function(btn, opts) {
		var me = this;
		me.invoiceDateFilterVal = btn.btnValue;
		me.invoiceDateFilterLabel = btn.text;
		me.handleInvoiceDateChange(btn.btnValue);
	},
	handleInvoiceDateChange : function(index) {
		var me = this;
		var dateToField;
		var objDateParams = me.getDateParam(index, 'invoiceDate');
		//appending the selected dropdown text to the date field
		if (!Ext.isEmpty(me.invoiceDateFilterLabel)) {
			$('label[for="invoiceDateLabel"]').text(getLabel("invoiceDateLabel","Invoice Date")+" (" + me.invoiceDateFilterLabel + ")");
		}
		
		var vFromDate = $.datepick.formatDate(strApplicationDateFormat, $.datepick.parseDate('yy-mm-dd', objDateParams.fieldValue1));
		var vToDate = $.datepick.formatDate(strApplicationDateFormat, $.datepick.parseDate('yy-mm-dd', objDateParams.fieldValue2));
		var filterOperator = objDateParams.operator;

		if (index == '13') {
			if (filterOperator == 'eq') {
				$('#invoiceDate').datepick('setDate', vFromDate);
			} else {
				$('#invoiceDate').datepick('setDate', [vFromDate, vToDate]);
			}
			if (filterOperator == 'eq')
				dateToField = "";
			else
				dateToField = vToDate;
			selectedInvoiceDate = {
				operator : filterOperator,
				fromDate : vFromDate,
				toDate : dateToField
			};
		} else {
			if (index === '1' || index === '2' || index === '12') {
				if (index === '12' && !Ext.isEmpty(filterDays) && filterDays !== '999') {
					$('#invoiceDate').datepick('setDate', vToDate);
				} else if(index === '12'){
					$('#invoiceDate').datepick('setDate', vFromDate);
				}else {
					$('#invoiceDate').datepick('setDate', vFromDate);

				}
			} else {
				$('#invoiceDate').datepick('setDate', [vFromDate, vToDate]);

			}
			if (filterOperator == 'eq')
				dateToField = "";
			else
				dateToField = vToDate;
			selectedInvoiceDate = {
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
				
				if ('invoiceDate' === dateType
						&& !isEmpty(me.datePickerSelectedInvoiceAdvDate)) {
					if (me.datePickerSelectedInvoiceAdvDate.length == 1) {
						fieldValue1 = Ext.Date.format(
								me.datePickerSelectedInvoiceAdvDate[0],
								strSqlDateFormat);
						fieldValue2 = fieldValue1;
						operator = 'eq';
					} else if (me.datePickerSelectedInvoiceAdvDate.length == 2) {
						fieldValue1 = Ext.Date.format(
								me.datePickerSelectedInvoiceAdvDate[0],
								strSqlDateFormat);
						fieldValue2 = Ext.Date.format(
								me.datePickerSelectedInvoiceAdvDate[1],
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
	postSaveFilterRequest : function(FilterCodeVal, fncallBack) {
		var me = this;
		strUrl = Ext.String.format(me.strModifySavedFilterUrl, selectedFilterLoggerDesc, FilterCodeVal);
		var objJson;
		objJson = getInvoiceAdvancedFilterValueJson(FilterCodeVal);
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
		
		//Invoice number
		var invoiceNumber = $("#txtInvoice").val();
		me.handleInvoiceNumberSync('A' , invoiceNumber);
		
		
		me.applyAdvancedFilter();
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
	
	setDataForFilter : function(filterData) {
		var me = this;
		var arrQuickJson = {};
		me.advFilterData = {};
		me.filterData = {};
		me.filterData = me.getInvoiceQuickFilterQueryJson();
		var objJson = (!Ext.isEmpty(filterData)
				? filterData.filterBy
				: getInvoiceAdvancedFilterQueryJson());
		
		
		reqJson = me.findInAdvFilterData(objJson, "invoiceNumber");
		if (!Ext.isEmpty(reqJson)) {
			arrQuickJson = me.filterData;
			arrQuickJson = me.removeFromQuickArrJson(arrQuickJson,
					"invoiceNumber");
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
	getInvoiceQuickFilterQueryJson : function() {
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
			
			if (me.invoiceNumberVal != null && !Ext.isEmpty(me.invoiceNumberVal)) {
				jsonArray.push({
					field : 'invoiceNumber',
					paramName : 'invoiceNumber',
					operatorValue : 'lk',
					value1 : encodeURIComponent(me.invoiceNumberVal.toUpperCase().replace(new RegExp("'", 'g'), "\''")),
					value2 : '',
					dataType : 'S',
					displayType : 5,
					fieldLabel :  getLabel('invoiceNumber','Invoice Number'),
					displayValue1 : me.invoiceNumberVal
				});
			}
		
		return jsonArray;
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
							            ok: getLabel('btnOk', 'OK')
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
		
		for (i = 0; i < filterData.filterBy.length; i++) {
			fieldName = filterData.filterBy[i].field;
			fieldVal = filterData.filterBy[i].value1;
			fieldSecondVal = filterData.filterBy[i].value2;
			currentFilterData = filterData.filterBy[i];
			operatorValue = filterData.filterBy[i].operator;
			
			if (fieldName === 'invoiceNumber') {
				$("#txtInvoice").val(fieldVal);
			} 
			else if (fieldName === 'invoiceAmount' || fieldName === 'netReceivableAmount') {
				me.setAmounts(operatorValue, fieldVal, fieldSecondVal , fieldName);
			} 
			else if (fieldName === 'invoiceDate') {
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

			if (dateType === 'invoiceDate') {
				selectedInvoiceDate = {
					operator : dateOperator,
					fromDate : formattedFromDate,
					toDate : formattedToDate
				};
				dateFilterRefFrom = $('#invoiceDate');
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
		var amountFieldRefTo = $("#amountFieldTo");
		
		var netReceivableFieldRefFrom = $("#txtNetAmount");
		var netReceivableFieldRefTo = $("#netReceivableAmountFieldTo");
		
		
		if (!Ext.isEmpty(operator)) {
			if (!Ext.isEmpty(amountFromFieldValue)) {

				if(fieldName === 'invoiceAmount'){
					
					$('#amountOperator').val(operator);
					$('#amountOperator').niceSelect('update');
					amonutFieldRefFrom.val(amountFromFieldValue);
					
					if (!Ext.isEmpty(amountToFieldValue)) {
						if (operator == "bt") {
							amountFieldRefTo.val(amountToFieldValue);
							$('#invoiceAmountTo').removeClass('hidden');
						}else{
							amountFieldRefTo.addClass('hidden');
							$('#invoiceAmountTo').addClass('hidden');
						}
					}
				}
				else if(fieldName === "netReceivableAmount"){
					
					$('#invoiceReceivableAmountOperator').val(operator);
					$('#invoiceReceivableAmountOperator').niceSelect('update');
					netReceivableFieldRefFrom.val(amountFromFieldValue);
					
					if (!Ext.isEmpty(amountToFieldValue)) {
						if (operator == "bt") {
							netReceivableFieldRefTo.val(amountToFieldValue);
							$('#netReceivableAmountTo').removeClass('hidden');
						}else{
							netReceivableFieldRefTo.addClass('hidden');
							$('#netReceivableAmountTo').addClass('hidden');
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
		
		if(strFieldName === 'invoiceNumber'){
			//adv filter
			$("#txtInvoice").val("");
			
			//quick filter
			var invoiceNumberTextField = me.getInvoiceReconFilterView()
			.down('textfield[itemId="invoiceNumber"]');
			if(!Ext.isEmpty(invoiceNumberTextField)){
				invoiceNumberTextField.reset();
				me.invoiceNumberVal = null;
			}
			
		}else if(strFieldName === 'invoiceAmount'){
			$("#txtAmount").val("");
			$("#amountFieldTo").val("");
			$("#amountOperator").val($("#amountOperator option:first").val());	
			$('#amountOperator').niceSelect('update');
		} else if(strFieldName === 'netReceivableAmount'){
			$("#txtNetAmount").val("");
			$("#netReceivableAmountFieldTo").val("");
			$("#invoiceReceivableAmountOperator").val($("#amountOperator option:first").val());	
			$('#invoiceReceivableAmountOperator').niceSelect('update');
		} else if(strFieldName === 'invoiceDate'){
			$("#invoiceDate").val("");
			updateToolTip('invoiceDate',null);
		} else if(strFieldName === 'LiquidationStatus'){
			$("#liquidationStatus").val("");
			$("#liquidationStatus").multiselect("refresh");
			var statusComboBox = me.getInvoiceReconFilterView().down('combo[itemId="statusFilter"]');
			me.statusFilterVal = 'all';
			statusComboBox.selectAllValues();
		}else if(strFieldName === 'Beneficiary'){
			$('#dropdownClientCode').val("");
				$("#dropdownClientCodeDescription").val("");
		}else if(strFieldName === 'scmMyProduct'){
			$("#dropdownProduct").val("");
			$("#dropdownProductDesc").val("");
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
		strUrl = 'services/generateInvoiceReconCenterReport/'+selectedFilterLoggerDesc+'.' + strExtension;
		strUrl += '?$skip=1';
		
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
	
	showRejectVerifyPopUp : function(strAction, strUrl, grid,
			arrSelectedRecords, strActionType) {
		var me = this;
		var titleMsg = '', fieldLbl = '';
		if (strAction === 'reject') {
			titleMsg = getLabel('userRejectRemarkPopUpTitle',
					'Please Enter Reject Remark');
			fieldLbl = getLabel('userRejectRemarkPopUpFldLbl', 'Reject Remark');
		}
		Ext.Msg.show({
					title : titleMsg,
					msg : fieldLbl,
					buttons : Ext.Msg.OKCANCEL,
					multiline : 4,
					cls:'t7-popup',
					style : {
						height : 400
					},
					bodyPadding : 0,
					fn : function(btn, text) {
						if (btn == 'ok') {
							if(Ext.isEmpty(text))
							{
								Ext.Msg.alert(getLabel('errorTitle', 'Error'), getLabel('rejectRestrictionErroMsg', 'Reject Remarks cannot be blank'));
							}
							else
							{
								me.handleGroupActions(strUrl, text, grid, arrSelectedRecords);
							}
						}
					}
				});
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

			if (dateType === 'CreateDate') {
				selectedCreationDate = {
					operator : dateOperator,
					fromDate : formattedFromDate,
					toDate : formattedToDate
				};
				dateFilterRefFrom = $('#creationDateFrom');
				/* dateFilterRefTo = $('#creationDateTo'); */
			} else if (dateType === 'EntryDate') {
				selectedEntryDate = {
					operator : dateOperator,
					fromDate : formattedFromDate,
					toDate : formattedToDate
				};
				dateFilterRefFrom = $('#entryDateFrom');
			} else if (dateType === 'ValueDate') {
				selectedProcessDate = {
					operator : dateOperator,
					fromDate : formattedFromDate,
					toDate : formattedToDate
				};
				dateFilterRefFrom = $('#processDateFrom');
				/* dateFilterRefTo = $('#processDateTo'); */
			} else if (dateType === 'ActivationDate') {
				selectedEffectiveDate = {
					operator : dateOperator,
					fromDate : formattedFromDate,
					toDate : formattedToDate
				};
				dateFilterRefFrom = $('#effectiveDateFrom');
				/* dateFilterRefTo = $('#effectiveDateTo'); */
			}


			if (dateOperator === 'eq') {
					$(dateFilterRefFrom).val(formattedFromDate);
				}
			else if (dateOperator === 'bt') {
						$(dateFilterRefFrom).datepick('setDate', [formattedFromDate, formattedToDate]);
						/*$(dateFilterRefTo).setDateRangePickerValue(formattedToDate);*/
					}
		} else {
			// console.log("Error Occured - date filter details found empty");
		}
	},
	checkUnCheckMenuItems : function(componentName, data) {
		var menuRef = null;
		var elementId = null;
		var me = this;
		var clientContainer = null;

		if (componentName === 'Product') {
			menuRef = $("select[id='dropdownProduct']");
			elementId = '#dropdownProduct';
		} else if (componentName === 'Beneficiary') {
			menuRef = $("select[id='dropdownClientCode']");
			elementId = '#dropdownClientCode';
		} else if (componentName === 'LiquidationStatus') {
			menuRef = $("select[id='liquidationStatus']");
			elementId = '#liquidationStatus';
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
	//reseting all the fields
	resetAllFields : function() {
		var me = this;
	
		$("#saveFilterChkBox").attr('checked', false);
		me.datePickerSelectedInvoiceAdvDate = [];
		selectedInvoiceDate={};
		$('#invoiceDate').val("");
		$('label[for="invoiceDateLabel"]').text(getLabel("invoiceDateLabel","Invoice Date"));
		updateToolTip('invoiceDate',null);
		$("#txtInvoice").val("");
		$("#liquidationStatus").val("");
		$("#msClient").val($("#msClient option:first").val());
		$("#dropdownClientCodeDescription").val("");
		$("#dropdownClientCode").val("");
		$("#dropdownProduct").val("");
		$("#dropdownProductDesc").val("");
		$("#invoiceReceivableAmountOperator").val($("#invoiceReceivableAmountOperator option:first").val());	
		$("#amountOperator").val($("#amountOperator option:first").val());	
		$("#txtAmount").val("");
		$("#amountFieldTo").val("");
		$("#invoiceAmountTo").addClass('hidden');
		$("#txtNetAmount").val("");
		$("#netReceivableAmountFieldTo").val("");
		$("#netReceivableAmountTo").addClass('hidden');
		$("#invoiceAmountLabel").text(getLabel("invoiceAmountLabel","Invoice Amount"));
		$("#netReceivableAmountLabel").text(getLabel("netReceivableAmountLabel","Net Reveivable Amount"));
		$("input[type='text'][id='savedFilterAs']").val("");
		$("#msSavedFilter").val("");
		$("#msSavedFilter").multiselect("refresh");
		$('#amountOperator').niceSelect('update');
		resetAllMenuItemsInMultiSelect("#liquidationStatus");
		$('#invoiceReceivableAmountOperator').niceSelect('update');
		$("#liquidationStatus").niceSelect('update');
		$("#msClient").niceSelect('update');
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
		var strUrl = 'services/userpreferences/invRecon{0}/groupViewAdvanceFilter.json';
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
	handleClientChangeInQuickFilter : function() {
		var me = this;
		me.clientCode = selectedFilterClient;
		me.clientDesc = selectedFilterClientDesc;
		me.clientFilterVal = 
			isEmpty(selectedFilterClient) ? 'All Companies' : selectedFilterClient;
		me.clientFilterDesc = selectedFilterClientDesc;
		quickFilterClientValSelected = me.clientCode;
		quickFilterClientDescSelected = me.clientDesc;
		selectedFilterClient = me.clientCode;
		clientCode =  me.clientCode;
		me.setDataForFilter();
		me.applyQuickFilter();
	},
	handleClearSettings : function() {
		var me = this, objGroupView = me.getGroupView();
		
		var statusComboBox = me.getInvoiceReconFilterView()
				.down('combo[itemId="statusFilter"]');
		me.statusFilterVal = 'all';
		statusComboBox.selectAllValues();
		
		me.savedFilterVal = '';
		
		var savedFilterComboBox = me.getInvoiceReconFilterView()
				.down('combo[itemId="savedFiltersCombo"]');
		savedFilterComboBox.setValue(me.savedFilterVal);
		
		//setting invoice number empty
		var invoiceNumberTextField = me.getInvoiceReconFilterView()
		.down('textfield[itemId="invoiceNumber"]');
		if(!Ext.isEmpty(invoiceNumberTextField)){
			invoiceNumberTextField.reset();
			me.invoiceNumberVal = null;
		}
		
		
		//setting company name as empty
		if (isClientUser()) {
			var clientComboBox = me.getInvoiceReconFilterView()
					.down('combo[itemId="clientCombo"]');
			me.clientFilterVal = 'All Companies';
			selectedFilterClientDesc = "";
			selectedFilterClient = "";
			selectedClientDesc = "";
			clientComboBox.setValue(me.clientFilterVal);
		} else {
			var clientComboBox = me.getInvoiceReconFilterView()
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
	
	handleInvoiceNumberSync : function(type , changedInvoiceNumber){
		var me = this;
		if (!Ext.isEmpty(type)) {
			if (type === 'Q') {
				var advFilterInvoiceNumberField = $("#txtInvoice");
				var quickFilterInvoiceNumberField = me.getInvoiceReconFilterView().down('textfield[itemId="invoiceNumber"]');
				
				if(!Ext.isEmpty(changedInvoiceNumber)){
					advFilterInvoiceNumberField.val('');
					advFilterInvoiceNumberField.val(changedInvoiceNumber);
				}else if(Ext.isEmpty(changedInvoiceNumber)){
					advFilterInvoiceNumberField.val('');
				}
			}
			if(type === 'A'){
				var advFilterInvoiceNumberField = $("#txtInvoice");
				var quickFilterInvoiceNumberField = me.getInvoiceReconFilterView().down('textfield[itemId="invoiceNumber"]');
				
				if(!Ext.isEmpty(changedInvoiceNumber)){
					quickFilterInvoiceNumberField.setValue('');
					quickFilterInvoiceNumberField.setValue(changedInvoiceNumber);
				}else if(Ext.isEmpty(changedInvoiceNumber)){
					quickFilterInvoiceNumberField.setValue('');
				}
			}
		}
	},
	handleLoggerChangeInQuickFilter : function(selectedFilterLoggerDesc) {
		var me = this;
		var gridPanel = me.getInvoiceReconView();
		gridPanel.removeAll();
		group = gridPanel.createGroupView(selectedFilterLoggerDesc);
		gridPanel.add(group);
		me.getInvoiceReconFilterView('#parentContainer').down('#sellerOrBuyerrCombo').suspendEvents();
		me.getInvoiceReconFilterView('#parentContainer').down('#sellerOrBuyerrCombo').setValue(selectedFilterLogger);
		me.getInvoiceReconFilterView('#parentContainer').down('#sellerOrBuyerrCombo').resumeEvents();
		
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
	hideQuickFilter : function(){
		
	}
});