/**
 * @class GCP.controller.loanRepaymentController
 * @extends Ext.app.Controller
 * @author Vivek Bhurke
 */

Ext.define('GCP.controller.loanRepaymentController', {
	extend : 'Ext.app.Controller',
	requires : ['Ext.ux.gcp.PageSettingPopUp'],
	views : ['GCP.view.loanRepaymentFilterView',
	         'GCP.view.loanRepaymentView'],
	refs : [{
		ref : 'groupView',
		selector : 'loanRepaymentView groupView'
	}, {
		ref : 'grid',
		selector : 'loanRepaymentView groupView smartgrid'
	}, {
		ref : 'filterView',
		selector : 'loanRepaymentView groupView filterView'
	}, {
		ref : 'loanRepaymentView',
		selector : 'loanRepaymentView'
	},{
		ref : 'loanRepaymentFilterView',
		selector : 'loanRepaymentFilterView'
	},{
	    ref:'DateMenu',
	    selector : '#DateMenu'
	}],
	config : {
		strPageName:'loanRepaymentCenter',
		strReadAllAdvancedFilterCodeUrl : 'services/userfilterslist/groupViewFilter.json',
		strGetSavedFilterUrl : 'services/userfilters/loanRepayGroupViewFilter{0}/{1}.json',
		strModifySavedFilterUrl : 'services/userfilters/loanRepayGroupViewFilter{0}/{1}.json',
		strRemoveSavedFilterUrl : 'services/userfilters/loanRepayGroupViewFilter{0}/{1}/remove.json',
		pageSettingPopup : null,
		preferenceHandler : null,
		strDefaultMask : '000000000000000000',
		clientFilterVal : 'all',
		dueDateFilterVal : '',
		dueDateFilterLabel : '',
		loanReleaseDateFilterVal : '',
		loanReleaseDateFilterLabel : '',
		loanDueDateFilterVal : '',
		loanDueDateFilterLabel : '',
		dateHandler : null,
		datePickerSelectedDate : [],
		datePickerSelectedDueAdvDate : [],
		datePickerSelectedLoanReleaseAdvDate : [],
		datePickerSelectedLoanDueAdvDate : [],
		savedFilterVal : '',
		filterData : [],
		filterCode : '',
		advFilterData : [],
		statusFilterVal : 'all',
		statusFilterDesc : 'All',
		reportGridOrder : null,
		loanReferenceVal : null,
		clientname : null,
		strLocalStorageKey : 'loan_repayment_center_local_preferences',
		firstLoad : false,
		statusVal : '',
		paramVal : '',
		advFilterCode : '',
		compNameFilterValue : []
	},
	init : function() {
		var me = this;
		me.firstLoad = true;
		me.preferenceHandler = Ext.create('Ext.ux.gcp.PreferencesHandler');
		if(objSaveLocalStoragePref){
			me.objLocalData = Ext.decode(objSaveLocalStoragePref);
			var filterType = me.objLocalData && me.objLocalData.d.preferences
								&& me.objLocalData.d.preferences.tempPref 
								&& me.objLocalData.d.preferences.tempPref.quickFilterJson ? me.objLocalData.d.preferences.tempPref.quickFilterJson : {};			
			me.filterData = (!Ext.isEmpty(filterType)) ? filterType : [];
			
		}
		populateAdvancedFilterFieldValue();
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
			if (filterType == "dueDate") {
				me.dueDateChange(btn, opts);
			} else if (filterType == "loanReleaseDate") {
				me.loanReleaseDateChange(btn, opts);
			} else if (filterType == "loanDueDate") {
				me.loanDueDateChange(btn, opts);
			}
		});
		
		$(document).on("datePickPopupSelectedDate", function(event, filterType, dates) {
			if (filterType == "dueDateFrom") {
				me.dateRangeFilterVal = '13';
				me.datePickerSelectedDueAdvDate = dates;
				me.dueDateFilterVal = me.dateRangeFilterVal;
				me.dueDateFilterLabel = getLabel('daterange','Date Range');
				me.handleDueDateInAdvFilterChange(me.dateRangeFilterVal);
				updateToolTip('dueDate', " ("+me.dueDateFilterLabel+")");
			} else if (filterType == "loanReleaseDateFrom") {
				me.dateRangeFilterVal = '13';
				me.datePickerSelectedLoanReleaseAdvDate = dates;
				me.loanReleaseDateFilterVal = me.dateRangeFilterVal;
				me.loanReleaseDateFilterLabel = getLabel('daterange',
						'Date Range');
				me.handleLoanReleaseDateInAdvFilterChange(me.dateRangeFilterVal);
				updateToolTip('loanReleaseDate', " ("+me.loanReleaseDateFilterLabel+")");
			} else if (filterType == "loanDueDateFrom") {
				me.dateRangeFilterVal = '13';
				me.datePickerSelectedLoanDueAdvDate = dates;
				me.loanDueDateFilterVal = me.dateRangeFilterVal;
				me.loanDueDateFilterLabel = getLabel('daterange',
						'Date Range');
				me.handleLoanDueDateInAdvFilterChange(me.dateRangeFilterVal);
				updateToolTip('loanDueDate', " ("+me.loanDueDateFilterLabel+")");
			}
		});
		
		$(document).on('handleLoggerChangeInQuickFilter', function() {
			me.handleLoggerChangeInQuickFilter(selectedFilterLoggerDesc);
		});
		
		me.control({
			'loanRepaymentView groupView' : {
				'groupByChange' : function(menu, groupInfo) {
					me.doHandleStateChange();
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
					
					var me = this;
					me.firstTime = true;
					//populateAdvancedFilterFieldValue();
					me.applyPreferences();
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
			'loanRepaymentFilterView  combo[itemId="quickFilterClientCombo"]' : {
				'select' : function (combo, width, height, eOpts){
						me.handleCompanyNameChange(combo);
				},
				'afterrender' : function(combo, newValue, oldValue, eOpts) {
					if (!Ext.isEmpty(me.clientFilterVal)) {
						combo.setValue(me.clientFilterVal);
					}
				},
				'boxready' : function(combo, width, height, eOpts){
					if(!Ext.isEmpty(me.clientFilterVal))
					{
						combo.setValue(me.clientFilterVal);
					}
				}
			},
			'loanRepaymentFilterView  combo[itemId="clientCombo"]' : {
				'select' : function (combo, width, height, eOpts){
						me.handleCompanyNameChange(combo);
				},'afterrender' : function(combo, newValue, oldValue, eOpts) {
					if (!Ext.isEmpty(me.clientFilterVal)) {
						combo.setValue(me.clientFilterVal);
					}
				},
				'boxready' : function(combo, width, height, eOpts) {
					if (!Ext.isEmpty(me.clientFilterVal)) {
						combo.setValue(me.clientFilterVal);
					}
				}
			},
			'loanRepaymentFilterView AutoCompleter[itemId="clientAuto"]' : {
				'select' : function (combo, width, height, eOpts){
					me.handleCompanyNameChange(combo);
				},
				'boxready' : function(combo, width, height, eOpts) {
					if(me.clientFilterVal == 'all')
					{
						me.clientFilterVal = '';
					}
					if (!Ext.isEmpty(me.clientFilterVal)) {
						combo.setValue(me.clientFilterVal);
						combo.setRawValue(me.clientFilterDesc);
					}
				}
				
			},
			'loanRepaymentFilterView' : {
				handleSavedFilterItemClick : function(comboValue, comboDesc) {
					me.savedFilterVal = comboValue;
					me.doHandleStateChange();
					me.doHandleSavedFilterItemClick(comboValue, comboDesc);
				}
			},
			/*'loanRepaymentFilterView combo[itemId="sellerOrBuyerrCombo"]':{
				'select' : function(combo, newValue, oldValue, eOpts) {
					if (!Ext.isEmpty(me.savedFilterVal)) {
						me.savedFilterVal = "";
					}
				}
			},*/
			'loanRepaymentFilterView combo[itemId="statusCombo"]' : {
				'select' : function(combo, selectedRecords) {
					combo.isQuickStatusFieldChange = true;
				},
				'blur' : function(combo, record) {
					if (combo.isQuickStatusFieldChange)
						me.handleStatusClick(combo);
				},
				//
				boxready : function(combo, width, height, eOpts){
					if (!Ext.isEmpty(me.statusFilterDesc) && me.statusFilterDesc != 'All' && me.statusFilterDesc != 'all' && 
						!Ext.isEmpty(me.statusFilterVal) && me.statusFilterVal != 'All' && me.statusFilterVal != 'all') {
						var tempArr = new Array();
						tempArr = me.statusFilterVal.split(",");
						if(!Ext.isEmpty(tempArr)){
						//me.statusFilterVal = 'all';
						combo.setValue(tempArr);
						combo.selectedOptions = tempArr;
						}
						else{
							combo.setValue(tempArr);
							me.statusFilterVal = '';
						}
				}
				}
				//
			/*	'boxready' : function(combo, width, height, eOpts){
					if(!Ext.isEmpty(me.statusVal))
					{
						combo.setValue(me.paramVal);
						combo.selectedOptions = me.paramVal;
					}
				/*	else if()
					{
						
					}
				}*/
			},
			'loanRepaymentFilterView textfield[itemId="loanReferenceTextField"]' : {
				'blur' : function( textfield, e, eOpts) {
					if (!Ext.isEmpty(textfield.rawValue) 
							&& textfield.rawValue != "%"
							&& textfield.rawValue != me.loanReferenceVal)
						me.handleLoanRefTextChange(textfield);
				},
				'boxready' : function(combo, width, height, eOpts){
					if(!Ext.isEmpty(me.loanReferenceVal))
					{
						combo.setValue(me.loanReferenceVal);
					}
				}
			}
			
		});
		$(document).on('handleClientChangeInQuickFilter', function(event) {
			me.handleClientChangeInQuickFilter();
		});
	},
	
	handleSavedFilterFieldSync : function(){
		var me  = this;
		var simpleFilterCombo = me.getFilterView().down('combo[itemId="savedFiltersCombo"]');
		simpleFilterCombo.setValue(me.filterCode);
	},
	
	populateTempFilter : function (filterData){
		var me = this;
					var fieldName = '';
					var fieldVal = '';
					var fieldSecondVal = '';
					var operatorValue = '';
					var valueArray = '';
					var dispval = '';
					var paramVal1 = '';
					var advFilterCode = '';
					for (i = 0; i < filterData.length; i++) {
						fieldName = filterData[i].paramName;
						fieldVal = filterData[i].value1;
						fieldSecondVal = filterData[i].paramValue2;
						operatorValue = filterData[i].operatorValue;
						valueArray = filterData[i].valueArray;
						paramVal1 = filterData[i].paramValue1;
						dispval = filterData[i].displayValue1;
						advFilterCode = advFilterCode;
					
					if(fieldName == 'Client')
					{
						me.clientFilterVal = paramVal1;
						me.clientFilterDesc = dispval;
						selectedFilterClient = me.clientFilterVal;
						selectedFilterClientDesc = me.clientFilterDesc;
						selectedClientDesc = me.clientFilterDesc;
						me.compNameFilterValue = valueArray;
						/*var clientComboBox = me.getLoanRepaymentFilterView().down('combo[itemId="clientAuto]');
						clientComboBox.setValue(dispval);
						var compNameComboBox = me.getFilterView().down("combo[itemId='clientCombo']");
						compNameComboBox.setValue(dispval);*/
						
						
					}
					else if(fieldName == 'LoanReference')
					{
						me.loanReferenceVal = dispval;
						var loanReference = me.getLoanRepaymentFilterView().down('textfield[itemId="loanReferenceTextField"]');
						loanReference.setValue(dispval);
					}
					/*else if(me.advFilterCode != '' && !Ext.isEmpty(me.advFilterCode))
					{
						var savedFilterComboBox = me.getLoanRepaymentFilterView().down('combo[itemId="savedFiltersCombo"]');
						savedFilterComboBox.setValue(me.advFilterCode);
					}*/
					else if(me.savedFilterVal != '' && !Ext.isEmpty(me.savedFilterVal))
					{
						var savedFilterComboBox = me.getLoanRepaymentFilterView().down('combo[itemId="savedFiltersCombo"]');
						savedFilterComboBox.setValue(me.savedFilterVal);
					}
					else if(fieldName == 'PartPaid'){
						me.statusFilterVal = '101';
						me.statusFilterDesc = dispval;
					}
					else if(fieldName == 'PayPending') 
					{
						me.statusFilterVal = '102';
						me.statusFilterDesc = dispval;
					}
					}
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
	
	handleGroupActions : function(strUrl, remark,grid, arrSelectedRecords) {
		var me = this;
		var groupView = me.getGroupView();
		if (!Ext.isEmpty(groupView)) {
			var arrayJson = new Array();
			var records = (arrSelectedRecords || []);
			for (var index = 0; index < records.length; index++) {
				arrayJson.push({
							serialNo : grid.getStore().indexOf(records[index])
									+ 1,
							identifier : records[index].data.identifier,
							userMessage : remark,
							recordDesc : records[index].data.scmProductName
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
							// TODO : Action Result handling to be done here
							groupView.refreshData();
							var errorMessage = '';
							if (response.responseText != '[]') {
								var jsonData = Ext
										.decode(response.responseText);
								jsonData = jsonData.d ? jsonData.d : jsonData;		
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

	doHandleRowIconClick : function(actionName, grid, record, rowIndex) {
		var me = this;
		if(actionName === 'payNow') {
			me.handlePayNowAction(actionName, grid, [record],rowIndex);
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
		form.appendChild(me.createFormField('INPUT', 'HIDDEN', 'redirectFromGrid',
				'Y'));
		form.action = strUrl;
		//me.setFilterParameters(form);

		document.body.appendChild(form);
		form.submit();
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
		
		if(strFieldName === 'LoanReference'){
			$("input[type='text'][id='txtLoanReference']").val("");
			var objField = me.getLoanRepaymentFilterView()
				.down('textfield[itemId="loanReferenceTextField"]');
			if (!Ext.isEmpty(objField)) {
				objField.reset();
				me.loanReferenceVal = null;
			}
		}else if(strFieldName === 'InvoiceNumber'){
			$("input[type='text'][id='txtInvoice']").val("");
		} else if(strFieldName === 'LoanAmount'){
			$("#loanAmountOperator").val($("#loanAmountOperator option:first").val());
			$("#loanAmountFieldFrom").val("");
			$("#loanAmountFieldTo").val("");
			$(".loanAmountTo").addClass("hidden");
			$("#msLoanAmountLabel").text(getLabel("loanAmount","Loan Amount"));
			$('#loanAmountOperator').niceSelect('update');
		} else if(strFieldName === 'LoanOSAmount'){
			$("#loanOSAmountOperator").val($("#loanOSAmountOperator option:first").val());
			$("#loanOSAmountFieldFrom").val("");
			$("#loanOSAmountFieldTo").val("");
			$(".loanOSAmountTo").addClass("hidden");
			$("#msLoanOSAmountLabel").text(getLabel("loanOSAmount","Loan O/S Amount"));
			$('#loanOSAmountOperator').niceSelect('update');
		} else if(strFieldName === 'DueDate'){
			$('#dueDateFrom').val("");
			selectedDueDate = {};
			$('label[for="DueDateLabel"]').text(getLabel('invoiceDueDate',
				'Invoice Due Date'));
			updateToolTip('dueDate',null);
		} else if(strFieldName === 'LoanReleaseDate'){
			$("#loanReleaseDateFrom").val("");
			selectedLoanReleaseDate = {};
			$('label[for="LoanReleaseDateLabel"]').text(getLabel('loanReleaseDate',
				'Loan Release Date'));
			updateToolTip('loanReleaseDate',null);
		} else if(strFieldName === 'LoanDueDate'){
			$("#loanDueDateFrom").val("");
			selectedLoanDueDate = {};
			$('label[for="LoanDueDateLabel"]').text(getLabel('loanDueDate',
				'Loan Due Date'));
			updateToolTip('loanDueDate',null);
		} else if(strFieldName === 'PayPending'
			|| strFieldName === 'PartPaid'){
			var objField = me.getLoanRepaymentFilterView()
				.down('combo[itemId="statusCombo"]');
			if (!Ext.isEmpty(objField)) {
				objField.selectAllValues();
				me.statusFilterVal = 'all';
			}
		} else if(strFieldName === 'DocumentType'){
			$("#documentTypeOperator").val($("#documentTypeOperator option:first").val());
			$('#documentTypeOperator').niceSelect('update');
		}
	},
	
	handleClientChangeInQuickFilter : function() {
		var me = this;
		me.clientCode = selectedFilterClient;
		me.clientDesc = selectedFilterClientDesc;
		me.clientFilterVal = 
			isEmpty(selectedFilterClient) ? 'all' : selectedFilterClient;
		me.clientFilterDesc = selectedClientDesc;
		quickFilterClientValSelected = me.clientCode;
		quickFilterClientDescSelected = me.clientDesc;
		me.setDataForFilter();
		me.applyFilter();
	},
	
	refreshData : function() {
		var me = this;
		var objGroupView = me.getGroupView();
		var grid = objGroupView.getGrid();
		if(!Ext.isEmpty(grid))
			grid.removeAppliedSort();
		objGroupView.refreshData();
	},
	applyFilter : function() {
		var me = this;
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
		var objSummaryView = me.getLoanRepaymentView(), gridModel = null, objData = null;
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
		
		if (data && data.preference)
			objData = Ext.JSON.decode(data.preference)
		if (_charCaptureGridColumnSettingAt === 'L' && objData
				&& objData.gridCols) {
			arrCols = objData.gridCols;
			colModel = objSummaryView.getColumnModel(arrCols);
			showPager = objData.gridSetting && !Ext.isEmpty(objData.gridSetting.showPager) ? objData.gridSetting.showPager : true;
			heightOption = objData.gridSetting && !Ext.isEmpty(objData.gridSetting.heightOption) ? objData.gridSetting.heightOption : null; 
			if (colModel) {
				gridModel = {					
					columnModel : colModel,
					pageSize : intPageSize,
					pageNo : intPageNo,
					showPagerForced : showPager,
					heightOption : heightOption 
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
		var me = this, args = {},strLocalPrefPageName = Ext.String.format(me.strPageName+'{0}', selectedFilterLoggerDesc)+'_TempPref';
		if (!Ext.isEmpty(objSaveState)) {
			args['tempPref'] = objSaveState;
			me.preferenceHandler.savePagePreferences(strLocalPrefPageName, objSaveState,
					me.postHandleSaveLocalPref, args, me, false);
		}
	},
	postHandleSaveLocalPref : function(data, args, isSuccess) {
		var me = this,strLocalPrefPageName = Ext.String.format(me.strPageName+'{0}', selectedFilterLoggerDesc)+'_TempPref';
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
		}else {
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
		
		if(selectedFilterLoggerDesc == 'BUYER'){
			objSaveLocalStoragePrefBuyer = objSaveLocalStoragePref;
		} else if(selectedFilterLoggerDesc == 'SELLER'){
			objSaveLocalStoragePrefSeller = objSaveLocalStoragePref;
		}
		me.objLocalData = Ext.decode(objSaveLocalStoragePref);
	},
	doHandleLoadGridData : function(groupInfo, subGroupInfo, grid, url, pgSize,
			newPgNo, oldPgNo, sorter, filterData) {
		var me = this;
		var objGroupView = me.getGroupView();
		var buttonMask = me.strDefaultMask;
		var arrOfParseQuickFilter = [], arrOfParseAdvFilter = [], arrOfFilteredApplied = [];
		
		if(allowLocalPreference === 'Y')
			me.handleSaveLocalStorage();
			
		var intPageNo = me.objLocalData.d && me.objLocalData.d.preferences
		&& me.objLocalData.d.preferences.tempPref
		&& me.objLocalData.d.preferences.tempPref.pageNo
		? me.objLocalData.d.preferences.tempPref.pageNo
		: null, intOldPgNo = oldPgNo , intNewPgNo = newPgNo;
		
		if(!Ext.isEmpty(intPageNo) && me.firstLoad)	{
			intNewPgNo = intPageNo;
			intOldPgNo = intPageNo;
		}
		
		me.firstLoad = false;
		
		if (!$('#actionResultDiv').hasClass('ui-helper-hidden')) {
			$('#actionResultDiv').addClass('ui-helper-hidden');
			if ($('#actionResultInfoDiv').children('.row').length > 0) {
				$('#actionResultInfoDiv').children('.row').remove();
			}
		}
		objActionResult = {
			'order' : []
		};
		//objGroupView.handleGroupActionsVisibility(buttonMask);
		var strUrl = grid.generateUrl(url, pgSize, intNewPgNo, intOldPgNo, sorter);
		var filterUrl = me.generateFilterUrl(subGroupInfo, groupInfo);
		var columnFilterUrl = me.generateColumnFilterUrl(filterData);
		
		me.disableActions(true);
		
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
		
		var columns = grid.columns;
		Ext.each(columns, function(col) {
	        if(col.dataIndex=="buyerSeller"){
	        	col.sortable=false;
	        }
	        if(col.dataIndex=="payments"){
	        	col.sortable=false;
	        }
        });

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
				me.doHandleRowIconClick(arrVisibleActions[0].itemId, grid, record);
			}
		}
	},

	updateConfig : function() {
		var me = this;
		me.dateHandler = Ext.create('Ext.ux.gcp.DateUtil');
		me.preferenceHandler = Ext.create('Ext.ux.gcp.PreferencesHandler');
		objLocalStoragePref = me.doGetSavedState();
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
					me.updateObjLoanRepaymentCenterPref, args, me, false);
		}
	},
	updateObjLoanRepaymentCenterPref : function(data) {
		if(selectedFilterLoggerDesc == 'BUYER'){
			objLRCBuyerSummaryPref = Ext.encode(data);
		} else if(selectedFilterLoggerDesc == 'SELLER'){
			objLRCSellerSummaryPref = Ext.encode(data);
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
	handleClearLocalPrefernces : function(){
		var me = this,args = {},pageName = me.strPageName + selectedFilterLoggerDesc;
		var strLocalPrefPageName = pageName+'_TempPref';
		
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
		} else
		{
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
			objLoanRepaymentCenterPref = objLRCBuyerSummaryPref;
			arrGenericColumnModel = arrBuyerGenericColumnModel;
		}
		else if(selectedFilterLoggerDesc == 'SELLER')
		{			
			objLoanRepaymentCenterPref = objLRCSellerSummaryPref;
			arrGenericColumnModel = arrSellerGenericColumnModel;
		}

		if (!Ext.isEmpty(objLoanRepaymentCenterPref)) {
			objPrefData = Ext.decode(objLoanRepaymentCenterPref);
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
			: (!Ext.isEmpty(Ext.decode(arrGenericColumnModel)) ? Ext.decode(arrGenericColumnModel) : (LOAN_REPAYMENT_CENTER_COLUMNS || '[]'));

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
		objData["filterUrl"] = 'services/userfilterslist/loanRepayGroupViewFilter'+selectedFilterLoggerDesc+'.json';
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
		strUrl = 'services/generateLoanRepaymentListReport/'+selectedFilterLoggerDesc+'.' + strExtension;
		strUrl += '?$skip=1';
		var groupView = me.getGroupView(), subGroupInfo = groupView
		.getSubGroupInfo()
		|| {}, objPref = {}, groupInfo = groupView
		.getGroupInfo()
		|| '{}', strModule = subGroupInfo.groupCode;
		var filterUrl = me.generateFilterUrl(subGroupInfo,groupInfo);
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
	assignSavedFilter : function() {
		var me = this, savedFilterCode='';
		if (me.firstTime) {
			me.firstTime = false;

			if (objLoanRepaymentCenterPref || objSaveLocalStoragePref) {
				var objJsonData = Ext.decode(objLoanRepaymentCenterPref);
				objLocalJsonData = Ext.decode(objSaveLocalStoragePref); 
				if (!Ext.isEmpty(objLocalJsonData.d.preferences) && (!Ext.isEmpty(objLocalJsonData.d.preferences.tempPref)) && allowLocalPreference === 'Y') {
						if(!Ext.isEmpty(objLocalJsonData.d.preferences.tempPref.advFilterCode)){
							savedFilterCode = objLocalJsonData.d.preferences.tempPref.advFilterCode;
							me.savedFilterVal = objLocalJsonData.d.preferences.tempPref.advFilterCode;
						}
						if(!Ext.isEmpty(objLocalJsonData.d.preferences.tempPref.advFilterJson)){
							me.populateSavedFilter(savedFilterCode,objLocalJsonData.d.preferences.tempPref.advFilterJson,true);
						//	me.handleFieldSync();
						}
				}else if (!Ext.isEmpty(objJsonData.d.preferences)) {
					if (!Ext.isEmpty(objJsonData.d.preferences.GeneralSetting)) {
						if (!Ext.isEmpty(objJsonData.d.preferences.GeneralSetting.defaultFilterCode)) {
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
		$("input[type='text'][id='txtLoanReference']").val("");
		$("input[type='text'][id='txtInvoice']").val("");
		selectedDueDate = {};
		selectedLoanReleaseDate = {};
		selectedLoanDueDate = {};
		$('#dueDateFrom').val("");
		$("#loanReleaseDateFrom").val("");
		$("#loanDueDateFrom").val("");
		$("input[type='text'][id='savedFilterAs']").val("");
		$("input[type='text'][id='savedFilterAs']").prop('disabled', false);
		updateToolTip('dueDate',null);
		updateToolTip('loanDueDate',null);
		updateToolTip('loanReleaseDate',null);
		
		$("#loanAmountOperator").val($("#loanAmountOperator option:first").val());
		$("#loanOSAmountOperator").val($("#loanOSAmountOperator option:first").val());
		$("#documentTypeOperator").val($("#documentTypeOperator option:first").val());
		$("#loanAmountFieldFrom").val("");
		$("#loanAmountFieldTo").val("");
		$("#loanAmountFieldTo").addClass("hidden");
		$(".loanAmountTo").addClass("hidden");
		$("#msLoanAmountLabel").text(getLabel("loanAmount","Loan Amount"));
		$("#loanOSAmountFieldFrom").val("");
		$("#loanOSAmountFieldTo").val("");
		$(".loanOSAmountTo").addClass("hidden");
		$("#msLoanOSAmountLabel").text(getLabel("loanOSAmount","Loan O/S Amount"));
		
		$("input[type='text'][id='savedFilterAs']").val("");
		$("input[type='text'][id='savedFilterAs']").prop('disabled', false);
		$('label[for="LoanReleaseDateLabel"]').text(getLabel('loanReleaseDate',
				'Loan Release Date'));
		$('label[for="DueDateLabel"]').text(getLabel('invoiceDueDate',
				'Invoice Due Date'));
		$('label[for="LoanDueDateLabel"]').text(getLabel('loanDueDate',
				'Loan Due Date'));
		
		$('#msClient').val('all');
		$('#msClient').niceSelect('update');
		$('#loanAmountOperator,#loanOSAmountOperator,#documentTypeOperator').niceSelect('update');
		
		$("#saveFilterChkBox").attr('checked', false);
		$("#msSavedFilter").val("");
		$("#msSavedFilter").multiselect("refresh");
		var objField = me.getLoanRepaymentFilterView()
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
				if(!Ext.isEmpty(filterDays) && filterDays !== '999'){
					fieldValue1 = Ext.Date.format(dtHistoryDate, strSqlDateFormat);
					fieldValue2 = Ext.Date.format(date, strSqlDateFormat);
					operator = 'bt';
					label = 'Latest';
				}
				else{
					fieldValue1 = Ext.Date.format(date, strSqlDateFormat);
					fieldValue2 = fieldValue1;
					operator = 'le';
					label = 'Latest';
				}
				break;
			 case '14' :
				// Last Month only
				dtJson = objDateHandler.getLastMonthStartAndEndDate(date);
				fieldValue1 = Ext.Date
						.format(dtJson.fromDate, strSqlDateFormat);
				fieldValue2 = Ext.Date.format(dtJson.toDate, strSqlDateFormat);
				operator = 'bt';
				label = 'Last Month only';
				break;	
			 case '13' :
				// Date Range
				if (!isEmpty(me.datePickerSelectedDate)) {
					if (me.datePickerSelectedDate.length == 1) {
						fieldValue1 = Ext.Date.format(
								me.datePickerSelectedDate[0], strSqlDateFormat);
						fieldValue2 = fieldValue1;
						operator = 'eq';
						label = 'Date Range';
					} else if (me.datePickerSelectedDate.length == 2) {
						fieldValue1 = Ext.Date.format(
								me.datePickerSelectedDate[0], strSqlDateFormat);
						fieldValue2 = Ext.Date.format(
								me.datePickerSelectedDate[1], strSqlDateFormat);
						operator = 'bt';
						label = 'Date Range';
					}
				}
				if ('dueDate' === dateType
						&& !isEmpty(me.datePickerSelectedDueAdvDate)) {
					if (me.datePickerSelectedDueAdvDate.length == 1) {
						fieldValue1 = Ext.Date.format(
								me.datePickerSelectedDueAdvDate[0],
								strSqlDateFormat);
						fieldValue2 = fieldValue1;
						operator = 'eq';
						label = 'Date Range';
					} else if (me.datePickerSelectedDueAdvDate.length == 2) {
						fieldValue1 = Ext.Date.format(
								me.datePickerSelectedDueAdvDate[0],
								strSqlDateFormat);
						fieldValue2 = Ext.Date.format(
								me.datePickerSelectedDueAdvDate[1],
								strSqlDateFormat);
						operator = 'bt';
						label = 'Date Range';
					}
				}
				if ('loanReleaseDate' === dateType
						&& !isEmpty(me.datePickerSelectedLoanReleaseAdvDate)) {
					if (me.datePickerSelectedLoanReleaseAdvDate.length == 1) {
						fieldValue1 = Ext.Date.format(
								me.datePickerSelectedLoanReleaseAdvDate[0],
								strSqlDateFormat);
						fieldValue2 = fieldValue1;
						operator = 'eq';
						label = 'Date Range';
					} else if (me.datePickerSelectedLoanReleaseAdvDate.length == 2) {
						fieldValue1 = Ext.Date.format(
								me.datePickerSelectedLoanReleaseAdvDate[0],
								strSqlDateFormat);
						fieldValue2 = Ext.Date.format(
								me.datePickerSelectedLoanReleaseAdvDate[1],
								strSqlDateFormat);
						operator = 'bt';
						label = 'Date Range';
					}
				}
				if ('loanDueDate' === dateType
						&& !isEmpty(me.datePickerSelectedLoanDueAdvDate)) {
					if (me.datePickerSelectedLoanDueAdvDate.length == 1) {
						fieldValue1 = Ext.Date.format(
								me.datePickerSelectedLoanDueAdvDate[0],
								strSqlDateFormat);
						fieldValue2 = fieldValue1;
						operator = 'eq';
						label = 'Date Range';
					} else if (me.datePickerSelectedLoanDueAdvDate.length == 2) {
						fieldValue1 = Ext.Date.format(
								me.datePickerSelectedLoanDueAdvDate[0],
								strSqlDateFormat);
						fieldValue2 = Ext.Date.format(
								me.datePickerSelectedLoanDueAdvDate[1],
								strSqlDateFormat);
						operator = 'bt';
						label = 'Date Range';
					}
				}
		}
		retObj.fieldValue1 = fieldValue1;
		retObj.fieldValue2 = fieldValue2;
		retObj.operator = operator;
		retObj.label = label;
		return retObj;
	},
	
	dueDateChange : function(btn, opts) {
		var me = this;
		me.dueDateFilterVal = btn.btnValue;
		me.dueDateFilterLabel = btn.text;
		me.handleDueDateInAdvFilterChange(btn.btnValue);
	},
	
	loanReleaseDateChange : function(btn, opts) {
		var me = this;
		me.loanReleaseDateFilterVal = btn.btnValue;
		me.loanReleaseDateFilterLabel = btn.text;
		me.handleLoanReleaseDateInAdvFilterChange(btn.btnValue);
	},
	
	loanDueDateChange : function(btn, opts) {
		var me = this;
		me.loanDueDateFilterVal = btn.btnValue;
		me.loanDueDateFilterLabel = btn.text;
		me.handleLoanDueDateInAdvFilterChange(btn.btnValue);
	},
	
	handleDueDateInAdvFilterChange : function(index) {
		var me = this;
		var dateToField;
		var objDateParams = me.getDateParam(index, 'dueDate');

		if (!Ext.isEmpty(me.dueDateFilterLabel)) {
			$('label[for="DueDateLabel"]').text(getLabel('invoiceDueDate',
					'Invoice Due Date')
					+ " (" + me.dueDateFilterLabel + ")");
		}
		var vFromDate = $.datepick.formatDate(strApplicationDateFormat, $.datepick.parseDate('yy-mm-dd', objDateParams.fieldValue1));
		var vToDate = $.datepick.formatDate(strApplicationDateFormat, $.datepick.parseDate('yy-mm-dd', objDateParams.fieldValue2));
		
		var filterOperator = objDateParams.operator;

		if (index == '13') {
			if (filterOperator == 'eq') {
				$('#dueDateFrom').datepick('setDate', vFromDate);
			} else {
				$('#dueDateFrom').datepick('setDate', [vFromDate, vToDate]);
			}
			if (filterOperator == 'eq')
				dateToField = "";
			else
				dateToField = vToDate;
			selectedDueDate = {
				operator : filterOperator,
				fromDate : vFromDate,
				toDate : dateToField,
				dateLabel : objDateParams.label
			};
		} else {
			if (index === '1' || index === '2' || index === '12') {
				if (index === '12' && !Ext.isEmpty(filterDays) && filterDays !== '999') {
					$('#dueDateFrom').datepick('setDate', vToDate);
				} else if(index === '12'){
					$('#dueDateFrom').datepick('setDate', vFromDate);
				} else {
					$('#dueDateFrom').datepick('setDate', vFromDate);
				}
			} else {
				$('#dueDateFrom').datepick('setDate', [vFromDate, vToDate]);
			}
			if (filterOperator == 'eq')
				dateToField = "";
			else
				dateToField = vToDate;
			selectedDueDate = {
				operator : filterOperator,
				fromDate : vFromDate,
				toDate : dateToField,
				dateLabel : objDateParams.label
			};
		}
	},
	
	handleLoanReleaseDateInAdvFilterChange : function(index) {
		var me = this;
		var dateToField;
		var objDateParams = me.getDateParam(index, 'loanReleaseDate');

		if (!Ext.isEmpty(me.loanReleaseDateFilterLabel)) {
			$('label[for="LoanReleaseDateLabel"]').text(getLabel('loanReleaseDate',
					'Loan Release Date')
					+ " (" + me.loanReleaseDateFilterLabel + ")");
		}
		var vFromDate = $.datepick.formatDate(strApplicationDateFormat, $.datepick.parseDate('yy-mm-dd', objDateParams.fieldValue1));
		var vToDate = $.datepick.formatDate(strApplicationDateFormat, $.datepick.parseDate('yy-mm-dd', objDateParams.fieldValue2));
		
		var filterOperator = objDateParams.operator;

		if (index == '13') {
			if (filterOperator == 'eq') {
				$('#loanReleaseDateFrom').datepick('setDate', vFromDate);
			} else {
				$('#loanReleaseDateFrom').datepick('setDate', [vFromDate, vToDate]);
			}
			if (filterOperator == 'eq')
				dateToField = "";
			else
				dateToField = vToDate;
			selectedLoanReleaseDate = {
				operator : filterOperator,
				fromDate : vFromDate,
				toDate : dateToField,
				dateLabel : objDateParams.label
			};
		} else {
			if (index === '1' || index === '2' || index === '12') {
				if (index === '12' && !Ext.isEmpty(filterDays) && filterDays !== '999') {
					$('#loanReleaseDateFrom').datepick('setDate', vToDate);
				} else if(index === '12'){
					$('#loanReleaseDateFrom').datepick('setDate', vFromDate);
				} else {
					$('#loanReleaseDateFrom').datepick('setDate', vFromDate);
				}
			} else {
				$('#loanReleaseDateFrom').datepick('setDate', [vFromDate, vToDate]);
			}
			if (filterOperator == 'eq')
				dateToField = "";
			else
				dateToField = vToDate;
			selectedLoanReleaseDate = {
				operator : filterOperator,
				fromDate : vFromDate,
				toDate : dateToField,
				dateLabel : objDateParams.label
			};
		}
	},
	
	handleLoanDueDateInAdvFilterChange : function(index) {
		var me = this;
		var dateToField;
		var objDateParams = me.getDateParam(index, 'loanDueDate');

		if (!Ext.isEmpty(me.loanDueDateFilterLabel)) {
			$('label[for="LoanDueDateLabel"]').text(getLabel('loanDueDate',
					'Loan Due Date')
					+ " (" + me.loanDueDateFilterLabel + ")");
		}
		var vFromDate = $.datepick.formatDate(strApplicationDateFormat, $.datepick.parseDate('yy-mm-dd', objDateParams.fieldValue1));
		var vToDate = $.datepick.formatDate(strApplicationDateFormat, $.datepick.parseDate('yy-mm-dd', objDateParams.fieldValue2));
		
		var filterOperator = objDateParams.operator;

		if (index == '13') {
			if (filterOperator == 'eq') {
				$('#loanDueDateFrom').datepick('setDate', vFromDate);
			} else {
				$('#loanDueDateFrom').datepick('setDate', [vFromDate, vToDate]);
			}
			if (filterOperator == 'eq')
				dateToField = "";
			else
				dateToField = vToDate;
			selectedLoanDueDate = {
				operator : filterOperator,
				fromDate : vFromDate,
				toDate : dateToField,
				dateLabel : objDateParams.label
			};
		} else {
			if (index === '1' || index === '2' || index === '12') {
				if (index === '12' && !Ext.isEmpty(filterDays) && filterDays !== '999') {
					$('#loanDueDateFrom').datepick('setDate', vToDate);
				} else if(index === '12'){
					$('#loanDueDateFrom').datepick('setDate', vFromDate);
				} else {
					$('#loanDueDateFrom').datepick('setDate', vFromDate);
				}
			} else {
				$('#loanDueDateFrom').datepick('setDate', [vFromDate, vToDate]);
			}
			if (filterOperator == 'eq')
				dateToField = "";
			else
				dateToField = vToDate;
			selectedLoanDueDate = {
				operator : filterOperator,
				fromDate : vFromDate,
				toDate : dateToField,
				dateLabel : objDateParams.label
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
		}

		var saveFilterChkBoxRef = $("input[type='checkbox'][id='saveFilterChkBox']");
		if (!Ext.isEmpty(saveFilterChkBoxRef) && !Ext.isEmpty(savedFilterVal))
			saveFilterChkBoxRef.prop('checked', true);

		var applyAdvFilter = false;
		me.filterCodeValue = savedFilterVal;
		me.savedFilterVal = me.filterCodeValue;
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

		if (statusFilterVal != null && statusFilterVal != 'All'
				&& statusFilterVal != 'all' && statusFilterVal.length >= 1) {
			statusFilterValArray = statusFilterVal.toString();

			if (statusFilterDisc != null && statusFilterDisc != 'All'
					&& statusFilterDisc != 'all'
					&& statusFilterDisc.length >= 1)
				statusFilterDiscArray = statusFilterDisc.toString();

			if(statusFilterDiscArray === getLabel('PaymentPending', 'Payment Pending')){
 				jsonArray.push({
					paramName : getLabel('payPending', 'PayPending'),
					paramValue1 : '1',
					operatorValue : 'eq',
					dataType : 'S',
					paramFieldLable : getLabel('lblStatus', 'Status'),
					displayType : 5,
					displayValue1 : statusFilterDiscArray
				});
			}else if(statusFilterDiscArray === getLabel('PartiallyPaid', 'Partially Paid')){
 				jsonArray.push({
					paramName : getLabel('partPaid', 'PartPaid'),
					paramValue1 : '1',
					operatorValue : 'eq',
					dataType : 'S',
					paramFieldLable : getLabel('lblStatus', 'Status'),
					displayType : 5,
					displayValue1 : statusFilterDiscArray
				});
			}
		}
		
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
		if (me.loanReferenceVal != null) {
			jsonArray.push({
				field : 'LoanReference',
				paramName : 'LoanReference',
				operatorValue : 'lk',
				value1 : encodeURIComponent(me.loanReferenceVal.toUpperCase().replace(new RegExp("'", 'g'), "\''")),
				value2 : '',
				dataType : 'S',
				displayType : 5,
				fieldLabel : getLabel('loanReference','Loan Reference'),
				displayValue1 : me.loanReferenceVal
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
		var disp1 = '';

		for (i = 0; i < filterData.filterBy.length; i++) {
			fieldName = filterData.filterBy[i].field;
			fieldVal = filterData.filterBy[i].value1;
			fieldSecondVal = filterData.filterBy[i].value2;
			currentFilterData = filterData.filterBy[i];
			operatorValue = filterData.filterBy[i].operator;
			disp1 = filterData.filterBy[i].value1;
			if (fieldName === 'LoanReference') {
				$("input[type='text'][id='txtLoanReference']").val(fieldVal);
			} else if (fieldName === 'InvoiceNumber') {
				$("input[type='text'][id='txtInvoice']").val(filterData.filterBy[i].displayValue1);
			} else if (fieldName === 'LoanAmount') {
				me.setLoanAmounts(operatorValue, fieldVal, fieldSecondVal);
			} else if (fieldName === 'LoanOSAmount') {
				me.setLoanOSAmounts(operatorValue, fieldVal, fieldSecondVal);
			} else if (fieldName === 'DocumentType') {
				$('#documentTypeOperator').val(disp1);
				$('#documentTypeOperator').niceSelect('update');
			}

			if (fieldName === 'DueDate'
				|| fieldName === 'LoanReleaseDate'
					|| fieldName === 'LoanDueDate') {
				me.setSavedFilterDates(fieldName, currentFilterData);
			}
		}

		if (!Ext.isEmpty(filterCode)) {
			me.filterCode = filterCode;
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
	
	setLoanAmounts : function(operator, amountFromFieldValue, amountToFieldValue) {
		var amonutFieldRefFrom = $("#loanAmountFieldFrom");
		var amountFieldRefTo = $("#loanAmountFieldTo");

		if (!Ext.isEmpty(operator)) {
			if (!Ext.isEmpty(amountFromFieldValue)) {
				$('#loanAmountOperator').val(operator);
				$("#loanAmountOperator").niceSelect('update');
				amonutFieldRefFrom.val(amountFromFieldValue);
				if (!Ext.isEmpty(amountToFieldValue)) {
					if (operator == "bt") {
						$("#loanAmountFieldFrom").removeClass("hidden");
						$("#loanAmountFieldTo").removeClass("hidden"); 
						$(".loanAmountTo").removeClass("hidden"); 
						$("#loanAmountFieldToLabel").text("Loan Amount To");
						$("#msLoanAmountLabel").text(getLabel("amountFrom","Loan Amount From"));
						amountFieldRefTo.val(amountToFieldValue);
					}
					else
					{
						$('.loanAmountTo').val('');
						$(".loanAmountTo").addClass("hidden");
						$("#loanAmountFieldToLabel").text("");
						$("#msLoanAmountLabel").text(getLabel("amount","Loan Amount"));
					}
				}
			}
		}
	},
	
	setLoanOSAmounts : function(operator, amountFromFieldValue, amountToFieldValue) {
		var amonutFieldRefFrom = $("#loanOSAmountFieldFrom");
		var amountFieldRefTo = $("#loanOSAmountFieldTo");

		if (!Ext.isEmpty(operator)) {
			if (!Ext.isEmpty(amountFromFieldValue)) {
				$('#loanOSAmountOperator').val(operator);
				$("#loanOSAmountOperator").niceSelect('update');
				amonutFieldRefFrom.val(amountFromFieldValue);
				if (!Ext.isEmpty(amountToFieldValue)) {
					if (operator == "bt") {
						$("#loanOSAmountFieldFrom").removeClass("hidden");
						$("#loanOSAmountFieldTo").removeClass("hidden"); 
						$(".loanOSAmountTo").removeClass("hidden"); 
						$("#loanOSAmountFieldToLabel").text("Loan Amount To");
						$("#msLoanOSAmountLabel").text(getLabel("amountFrom","Loan O/S Amount From"));
						amountFieldRefTo.val(amountToFieldValue);
					}
					else
					{
						$('.loanOSAmountTo').val('');
						$(".loanOSAmountTo").addClass("hidden");
						$("#loanOSAmountFieldToLabel").text("");
						$("#msLoanOSAmountLabel").text(getLabel("amount","Loan O/S Amount"));
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

			if (dateType === 'DueDate') {
				selectedDueDate = {
					operator : dateOperator,
					fromDate : formattedFromDate,
					toDate : formattedToDate,
					dateLabel : data.dropdownLabel
				};
				dateFilterRefFrom = $('#dueDateFrom');
				$('label[for="DueDateLabel"]').text(getLabel('invoiceDueDate',
					'Invoice Due Date')
					+ " (" + selectedDueDate.dateLabel + ")");
				
				
			} else if (dateType === 'LoanReleaseDate') {
				selectedLoanReleaseDate = {
					operator : dateOperator,
					fromDate : formattedFromDate,
					toDate : formattedToDate,
					dateLabel : data.dropdownLabel
				};
				dateFilterRefFrom = $('#loanReleaseDateFrom');
				$('label[for="LoanReleaseDateLabel"]').text(getLabel('loanReleaseDate',
					'Loan Release Date')
					+ " (" + selectedLoanReleaseDate.dateLabel + ")");
			} else if (dateType === 'LoanDueDate') {
				selectedLoanDueDate = {
					operator : dateOperator,
					fromDate : formattedFromDate,
					toDate : formattedToDate,
					dateLabel : data.dropdownLabel
				};
				dateFilterRefFrom = $('#loanDueDateFrom');
				$('label[for="LoanDueDateLabel"]').text(getLabel('loanDueDate',
					'Loan Due Date')
					+ " (" + selectedLoanDueDate.dateLabel + ")");
			}

			if(dateOperator === 'eq'){
				$(dateFilterRefFrom).val(formattedFromDate);
			} else if(dateOperator === 'bt') {
				$(dateFilterRefFrom).datepick('setDate', [formattedFromDate, formattedToDate]);
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
		var strUrl = 'services/userpreferences/loanRepaymentCenter{0}/groupViewAdvanceFilter.json';
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
			me.savedFilterVal = filterCode;
			me.resetAllFields();
			me.getSavedFilterData(filterCode, me.populateSavedFilter, true);
		}
		me.savePrefAdvFilterCode = filterCode;
		me.showAdvFilterCode = filterCode;
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
		isError = false;
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
			var filterName = $('#savedFilterAs').val();
			var SaveFilterChkBoxVal = $("input[type='checkbox'][id='saveFilterChkBox']")
				.is(':checked');
			if(Ext.isEmpty(filterName) && SaveFilterChkBoxVal == true)
                	isError = true;
			return;
		} else {
			isError = false;
			hideErrorPanel("advancedFilterErrorDiv");
			me.filterCodeValue = FilterCode;
			strFilterCodeVal = me.filterCodeValue;
			me.savedFilterVal = me.filterCodeValue; 
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
	
	doSearchOnly : function() {
		var me = this;
		var clientComboBox = me.getLoanRepaymentFilterView()
				.down('combo[itemId="clientCombo"]');
		if (selectedClient != null && $('#msClient').val() != 'all') {
			clientComboBox.setValue(selectedClient);
		} else if ($('#msClient').val() == 'all') {
			clientComboBox.setValue('all');
			clientFilterVal = '';
		}
		me.applyAdvancedFilter();
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
		me.setDataForFilter();
		me.refreshData();
	},
	
	handleLoanRefTextChange : function(textfield) {
		var me = this;
		me.loanReferenceVal = textfield.rawValue;
		me.filterApplied = 'Q';
		me.setDataForFilter();
		me.refreshData();
	},
	
	handleCompanyNameChange : function(company){
		var me  = this;
		me.clientname = company.rawValue;
		me.filterApplied = 'Q';
		me.setDataForFilter();
		me.refreshData();
	},
	
	doHandleRowActions : function(actionName, objGrid, record, rowIndex) {
		var me = this;
		var groupView = me.getGroupView();
		var grid = groupView.getGrid();
		me.doHandleGroupActions(actionName, grid, [record], 'rowAction');
	},
	
	doHandleGroupActions : function(strAction, grid, arrSelectedRecords,
			strActionType) {
		var me = this;
		
		if(strAction === 'payNow') {
			me.handlePayNowAction(strAction, grid, arrSelectedRecords,strActionType);
		} else if(strAction === 'viewInvoice' || strAction === 'viewPO'){
			me.handleViewInvoicePOAction(strAction, grid, arrSelectedRecords,strActionType);
		} else if(strAction === 'viewInvoiceNumber'){
			
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
				'clientCode', arrSelectedRecords[0].raw.companyId));
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
		populateAdvancedFilterFieldValue();
		var gridPanel = me.getLoanRepaymentView();
		gridPanel.removeAll();
		group = gridPanel.createGroupView(selectedFilterLoggerDesc);
		gridPanel.add(group);
		me.getLoanRepaymentFilterView('#parentContainer').down('#sellerOrBuyerrCombo').suspendEvents();
		me.getLoanRepaymentFilterView('#parentContainer').down('#sellerOrBuyerrCombo').setValue(selectedFilterLogger);
		me.getLoanRepaymentFilterView('#parentContainer').down('#sellerOrBuyerrCombo').resumeEvents();
		me.savedFilterVal = '';
		me.advFilterData = '';
		var savedFilterComboBox = me.getFilterView()
				.down('combo[itemId="savedFiltersCombo"]');
		
		me.advFilterData = '';
		var savedFilterComboBox = me.getLoanRepaymentFilterView()
				.down('combo[itemId="savedFiltersCombo"]');
		var buyerSellerPref={} ,args={};
		
		me.loanReferenceVal = null;
		me.statusFilterVal = '';
		me.savedFilterVal ="";
		me.filterCode = "";
		selectedDueDate = {};
		selectedLoanReleaseDate= {};
		selectedLoanDueDate = {};
		
		//Ext.String.format(me.strPageName+'{0}', selectedFilterLoggerDesc)+'_TempPref';
		var pageName = Ext.String.format(me.strPageName+'{0}', selectedFilterLoggerDesc),strLocalPrefPageName = pageName+'_TempPref';
		me.preferenceHandler.readPagePreferences(strLocalPrefPageName,
				me.updateObjLocalPref, args, me, false);
		if(selectedFilterLoggerDesc =='BUYER'){
			buyerSellerPref = Ext.decode(objSaveLocalStoragePrefBuyer);
		}else
		{
			buyerSellerPref =  Ext.decode(objSaveLocalStoragePrefSeller);
		}
		if(buyerSellerPref.d.preferences && buyerSellerPref.d.preferences.tempPref && buyerSellerPref.d.preferences.tempPref.advFilterJson && allowLocalPreference === 'Y')
		{
			me.advFilterData =buyerSellerPref.d.preferences.tempPref.advFilterJson.filterBy;
			if(buyerSellerPref.d.preferences.tempPref.advFilterCode){
				me.savedFilterVal = buyerSellerPref.d.preferences.tempPref.advFilterCode;
			}
			else{
				me.savedFilterVal = "";
			}
		}
		
		
		if (!Ext.isEmpty(buyerSellerPref.d.preferences) && (!Ext.isEmpty(buyerSellerPref.d.preferences.tempPref)) &&  !Ext.isEmpty(buyerSellerPref.d.preferences.tempPref.sorter) && allowLocalPreference === 'Y'  )
		{
			me.localSortState = buyerSellerPref.d.preferences.tempPref.sorter;
		}
		me.getSavedFilterData(me.savedFilterVal, me.populateSavedFilter, true);
		
		if(me.savedFilterVal === "")				
		{
			me.resetAllFields();
			me.refreshData();
			me.setDataForFilter();
			//me.refreshData();
		}
		savedFilterComboBox.setValue(me.savedFilterVal);
		
		if (!Ext.isEmpty(buyerSellerPref.d.preferences) && (!Ext.isEmpty(buyerSellerPref.d.preferences.tempPref)) &&  !Ext.isEmpty(buyerSellerPref.d.preferences.tempPref.quickFilterJson) && allowLocalPreference === 'Y'  )
		{
			me.populateQuickFilterValues(buyerSellerPref.d.preferences.tempPref.quickFilterJson);
			me.setDataForFilter();
		}
		
		me.applyPreferences();
	},
	populateQuickFilterValues  : function(filterData){
		var me = this;
		var fieldName = '';
		for (i = 0; i < filterData.length; i++) {
			fieldName = filterData[i].field || filterData[i].paramName;
			if (fieldName === 'LoanReference') {
				me.loanReferenceVal = filterData[i].displayValue1;
			}
			else
			{
				if(fieldName == 'PartPaid'){
						me.statusFilterVal = '101';
						me.statusFilterDesc = filterData[i].displayValue1;
				}
				else if(fieldName == 'PayPending') 
				{
						me.statusFilterVal = '102';
						me.statusFilterDesc = filterData[i].displayValue1;
				}
			}
		}
		
	},
	applyPreferences : function(){
		var me = this;
		if(selectedFilterLoggerDesc == 'BUYER'){
						var objLocalJsonData='',savedFilterCode='';
						objLoanRepaymentCenterPref = objLRCBuyerSummaryPref;
						objLocalJsonData = Ext.decode(objSaveLocalStoragePref);
						if (objLoanRepaymentCenterPref) {
							
							var objJsonData = Ext.decode(objLoanRepaymentCenterPref);
							
							if (!Ext.isEmpty(objJsonData.d.preferences)) {
								if (!Ext.isEmpty(objJsonData.d.preferences.GeneralSetting)) {
									if (!Ext.isEmpty(objJsonData.d.preferences.GeneralSetting.defaultFilterCode)
											|| (objLocalStoragePref && !Ext.isEmpty(objLocalStoragePref.filterCode))) {
										var advData = objJsonData.d.preferences.GeneralSetting.defaultFilterCode;
										var advData = objLocalStoragePref && !Ext.isEmpty(objLocalStoragePref.filterCode)
											? objLocalStoragePref.filterCode
											: objJsonData.d.preferences.GeneralSetting.defaultFilterCode;
										me.doHandleSavedFilterItemClick(advData);
										me.savedFilterVal = advData;
										$("#msSavedFilter option[value='" + me.savedFilterVal + "']").attr(
									"selected", true);
									$("#msSavedFilter").multiselect("refresh");
									} else if(objLocalStoragePref && !Ext.isEmpty(objLocalStoragePref.filterCode)){
										me.doHandleSavedFilterItemClick(objLocalStoragePref.filterCode);
										me.savedFilterVal = objLocalStoragePref.filterCode;
									}
								}
									
							}
						}
						if(objSaveLocalStoragePref)		
						{
							if(!Ext.isEmpty(objLocalJsonData.d.preferences) && (!Ext.isEmpty(objLocalJsonData.d.preferences.tempPref)) && allowLocalPreference === 'Y')
							{
								if(!Ext.isEmpty(objLocalJsonData.d.preferences.tempPref.advFilterCode)){
									savedFilterCode = objLocalJsonData.d.preferences.tempPref.advFilterCode;
									me.savedFilterVal = objLocalJsonData.d.preferences.tempPref.advFilterCode;
									$("#msSavedFilter option[value='" + me.savedFilterVal + "']").attr(
									"selected", true);
									$("#msSavedFilter").multiselect("refresh");
								}
								if(!Ext.isEmpty(objLocalJsonData.d.preferences.tempPref.advFilterJson)){
									me.populateSavedFilter(savedFilterCode,objLocalJsonData.d.preferences.tempPref.advFilterJson,true);
									me.handleSavedFilterFieldSync();
								}
								if(!Ext.isEmpty(objLocalJsonData.d.preferences.tempPref.quickFilterJson))
								{
									var quickPref = objLocalJsonData.d.preferences.tempPref.quickFilterJson;
									me.advFilterCode = objLocalJsonData.d.preferences.tempPref.advFilterCode;
									me.populateTempFilter(objLocalJsonData.d.preferences.tempPref.quickFilterJson);
								}
								else
									me.savedFilterVal = "";
							}
							
					}
				}
				else if(selectedFilterLoggerDesc == 'SELLER')
				{
					var objLocalJsonData='',savedFilterCode=''; 
					objLoanRepaymentCenterPref = objLRCSellerSummaryPref;
					objLocalJsonData = Ext.decode(objSaveLocalStoragePref);
					if (objLoanRepaymentCenterPref) {
						
						var objJsonData = Ext.decode(objLoanRepaymentCenterPref);
						objLocalJsonData = Ext.decode(objSaveLocalStoragePref);
						
						if (!Ext.isEmpty(objJsonData.d.preferences)) {
							if (!Ext.isEmpty(objJsonData.d.preferences.GeneralSetting)) {
								if (!Ext.isEmpty(objJsonData.d.preferences.GeneralSetting.defaultFilterCode)
										|| (objLocalStoragePref && !Ext.isEmpty(objLocalStoragePref.filterCode))) {
									var advData = objJsonData.d.preferences.GeneralSetting.defaultFilterCode;
									var advData = objLocalStoragePref && !Ext.isEmpty(objLocalStoragePref.filterCode)
										? objLocalStoragePref.filterCode
										: objJsonData.d.preferences.GeneralSetting.defaultFilterCode;
									me.doHandleSavedFilterItemClick(advData);
									me.savedFilterVal = advData;
								}else if(objLocalStoragePref && !Ext.isEmpty(objLocalStoragePref.filterCode)){
									me.doHandleSavedFilterItemClick(objLocalStoragePref.filterCode);
									me.savedFilterVal = objLocalStoragePref.filterCode;
								}
							}
						}
						if(objSaveLocalStoragePref)		
						{
						if(!Ext.isEmpty(objLocalJsonData.d.preferences) && (!Ext.isEmpty(objLocalJsonData.d.preferences.tempPref)) && allowLocalPreference === 'Y')
						{
							if(!Ext.isEmpty(objLocalJsonData.d.preferences.tempPref.advFilterCode)){
								savedFilterCode = objLocalJsonData.d.preferences.tempPref.advFilterCode;
								me.savedFilterVal = objLocalJsonData.d.preferences.tempPref.advFilterCode;
							}
							if(!Ext.isEmpty(objLocalJsonData.d.preferences.tempPref.advFilterJson)){
								me.populateSavedFilter(savedFilterCode,objLocalJsonData.d.preferences.tempPref.advFilterJson,true);
								me.handleSavedFilterFieldSync();
							}
							if(!Ext.isEmpty(objLocalJsonData.d.preferences.tempPref.quickFilterJson))
							{
								var quickPref = objLocalJsonData.d.preferences.tempPref.quickFilterJson;
								//me.advFilterCode = objLocalJsonData.d.preferences.tempPref.advFilterCode;
								me.populateTempFilter(objLocalJsonData.d.preferences.tempPref.quickFilterJson);
							}
							else
							me.savedFilterVal = "";
						}
						
					}
					}
				}
	},
	
	handleClearSettings : function() {
		var me = this, objGroupView = me.getGroupView();
		
		if (isClientUser()) {
			var clientComboBox = me.getLoanRepaymentFilterView()
					.down('combo[itemId="clientCombo"]');
			me.clientFilterVal = 'all';
			selectedFilterClientDesc = "";
			selectedFilterClient = "";
			selectedClientDesc = "";
			clientComboBox.setValue(me.clientFilterVal);
		} else {
			var clientComboBox = me.getLoanRepaymentFilterView()
					.down('combo[itemId="clientAuto]');
			clientComboBox.reset();
			me.clientFilterVal = '';
			selectedFilterClientDesc = "";
			selectedFilterClient = "";
			selectedClientDesc = "";
		}

		var statusComboBox = me.getLoanRepaymentFilterView()
				.down('combo[itemId="statusCombo"]');
		me.statusFilterVal = 'all';
		statusComboBox.selectAllValues();
		
		me.savedFilterVal = '';
		
		var savedFilterComboBox = me.getLoanRepaymentFilterView()
				.down('combo[itemId="savedFiltersCombo"]');
		savedFilterComboBox.setValue(me.savedFilterVal);
		
		var loanReferenceTextField = me.getLoanRepaymentFilterView()
			.down('textfield[itemId="loanReferenceTextField"]');
		loanReferenceTextField.reset();
		me.loanReferenceVal = null;

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
	}
	/* State handling at local storage ends */
});