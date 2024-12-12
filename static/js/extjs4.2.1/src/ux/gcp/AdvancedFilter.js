Ext.define('Ext.ux.gcp.AdvancedFilter',
{
	extend : 'Ext.panel.Panel',
	xtype : 'advancedfilter',
	requires : ['Ext.ux.gcp.SavedFilterView','Ext.ux.gcp.FilterFieldView'],
	header : false,
	width : '100%',
	border : false,
	layout : 'vbox',
	autoHeight : true,
	getFilterUrl : null,
	saveFilterUrl : null,
	filterModel : null,
	savefilterview : null,
	advancedfilterview : null,
	
	initComponent : function() {
		
		var me = this;
		var savefilterview = null;
		var advancedfilterview = null;
		savefilterview =  Ext.create('Ext.ux.gcp.SavedFilterView',{
						 getFilterUrl : this.getFilterUrl,
						 width : '100%',
						 parent : this
		});
		advancedfilterview = Ext.create('Ext.ux.gcp.FilterFieldView',{
						 filterModel : this.filterModel,
						 width : '100%',
						 parent : this
		});
		this.savefilterview=savefilterview;
		this.advancedfilterview=advancedfilterview;
		
		this.items = [savefilterview,advancedfilterview];
		
		this.on('handleShowAdvancedFilterAction','toggleAdvancedFilterVisibility');
		this.on('handleResetFilterAction' ,'handleResetFilterAction');
		this.on('handleSavedFilterItemClick','handleSavedFilterItemClick');
		this.on('handleActionSaveAs','doSaveAs');
		this.on('handleActionSaveAndSearch','doSaveAndSearch');
		this.on('handleActionSearch','doSearchOnly');
		this.on('handleRangeFieldsShowHide','handleRangeFieldsShowHide');
		
		Ext.apply(Ext.form.field.VTypes, {
				daterange : function(val, field) {
					var date = field.parseDate(val);

					if (!date) {
						// return false;
					}
					if (field.startDateField
							&& (!this.dateRangeMax || Ext.isEmpty(date) || (date
									.getTime() != this.dateRangeMax.getTime()))) {
						var start = field.up('form').down('datefield[itemId="'
								+ field.startDateField + '"]');
						start.setMaxValue(date);
						start.validate();
						this.dateRangeMax = date;
					} else if (field.endDateField
							&& (!this.dateRangeMin || Ext.isEmpty(date) || (date
									.getTime() != this.dateRangeMin.getTime()))) {
						var end = field.up('form').down('datefield[itemId="'
							+ field.endDateField + '"]');
						end.setMinValue(date);
						end.validate();
						this.dateRangeMin = date;
					}

					return true;
				},
				daterangeText : 'Start date must be less than end date'

			});
		
		this.callParent();
	},
	getAllSaveFilter : function()
	{
		var me = this;
		Ext.Ajax.request({
					url : me.getFilterUrl,
					success : function(response) {
						var responseData = Ext.decode(response.responseText);
						var arrFilters = [];
						var filterData = responseData.d.filters;
						if (filterData) {
							arrFilters = filterData;
						}
						me.savefilterview.addAllSavedFilterCodeToView(arrFilters);

					},
					failure : function(response) {
						console
								.log('Bad : Something went wrong with your request');
					}
		});
	},
	toggleAdvancedFilterVisibility : function()
	{
		var objAdvFlt = this.advancedfilterview;
		var objFltFrm = Ext.getCmp('advancedFilterForm');
		if (objAdvFlt) {
			objAdvFlt.isHidden() ? objAdvFlt.show() : objAdvFlt.hide();
		}
		if (objAdvFlt && objFltFrm && objFltFrm.items.length == 0) {
			var objMenu = objAdvFlt.down('toolbar menu');
			if (objMenu && objMenu.items.length > 0) {
				var firstItem = objMenu.items.items[0];
				if (firstItem) {
					objAdvFlt.addFilterRow(firstItem.itemId);
					firstItem.checked = true;
					if (firstItem.hasCls('x-menu-item-unchecked')) {
						firstItem.removeCls('x-menu-item-unchecked');
						firstItem.addCls('x-menu-item-checked');
					}
				}
			}

		}
		this.enableDisableSaveAsButton();
	},
	handleRangeFieldsShowHide : function(fieldId, fieldLabelId, blnShow) {
		var objAdvFlt = this.advancedfilterview;
		var objFlt = objAdvFlt.down('form');
		var objForm = objFlt.getForm();
		var objField = objForm.findField(fieldId);
		var objLabelField = objFlt.down('label[name="' + fieldLabelId + '"]');
		if (objField && objLabelField) {
			if (blnShow) {
				objField.show();
				objLabelField.show();
			} else {
				objField.setValue('');
				objField.hide();
				objLabelField.hide();
			}
		}
	},
	handleResetFilterAction : function() {
		var me = this;
		var obj = this.advancedfilterview;
		me.resetAdvancedFilter();
		if (obj) {
			obj.hide();
			this.fireEvent('resetAdvancedFilter');
		}
	},
	resetAdvancedFilter : function() {
		var objAdvFlt = this.advancedfilterview;
		var objFltFrm = objAdvFlt.down('form');
		var advtoolbar = objAdvFlt.down('toolbar');
		//var objFilterCode =  advtoolbar.getComponent('filterCode');
		var objFilterCode =  Ext.getCmp('filterCode');
		Ext.each(objFltFrm.query('[isFormField]'), function(formField){
			if(formField.ownerCt)
				formField.ownerCt.remove(formField);
		});
		objFltFrm.removeAll(true);
		objAdvFlt.setTitle(getLabel('advancedFilter', 'Advanced Filter'));
		objFilterCode.setValue('');
		this.resetSelectedCriteria();
		if (objAdvFlt && objFltFrm && objFltFrm.items.length == 0) {
			var objMenu = objAdvFlt.down('toolbar menu');
			if (objMenu && objMenu.items.length > 0) {
				var firstItem = objMenu.items.items[0];
				if (firstItem) {
					objAdvFlt.addFilterRow(firstItem.itemId);
					firstItem.checked = true;
					if (firstItem.hasCls('x-menu-item-unchecked')) {
						firstItem.removeCls('x-menu-item-unchecked');
						firstItem.addCls('x-menu-item-checked');
					}
				}
			}

		}
		this.enableDisableSaveAsButton();
	},
	resetSelectedCriteria : function() {
		var objAdvFlt = this.advancedfilterview;
		var objMenu = objAdvFlt.down('toolbar menu');
		if (objMenu) {
			var items = objMenu.items.items;
			if (items) {
				Ext.each(items, function(item) {
							if (item.checked) {
								item.checked = false;
								if (item.hasCls('x-menu-item-checked')) {
									item.removeCls('x-menu-item-checked');
									item.addCls('x-menu-item-unchecked');
								}
							}
						});
			}
		}
	},
	handleSavedFilterItemClick : function(filterCode) {
		var obj = this.advancedfilterview;
		var applyAdvFilter = true;
		if (!Ext.isEmpty(filterCode)) {
			obj.show();
			this.getSavedFilterData(filterCode, this.populateSavedFilter,
					applyAdvFilter);
		}
	},
	getSavedFilterData : function(filterCode, fnCallback, applyAdvFilter) {
		var me = this;
		var objAdv = this.advancedfilterview;
		var objJson;
		var strUrl = me.saveFilterUrl;
		strUrl = Ext.String.format(strUrl, filterCode);
		objAdv.setLoading(true);
		Ext.Ajax.request({
					url : strUrl,
					method : 'GET',
					success : function(response) {
						var responseData = Ext.decode(response.responseText);
						fnCallback.call(me, filterCode, responseData,
								applyAdvFilter);
						objAdv.setLoading(false);
					},
					failure : function() {
						objAdv.setLoading(false);
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
	populateSavedFilter : function(filtercode, filterData, applyAdvFilter) {
		var objFilterBy;
		var me = this;
		var objAdvFlt = this.advancedfilterview;
		var objAdvFltForm = objAdvFlt.down('form');
		//var advtoolbar = objAdvFlt.down('toolbar');
		//var objFilterCode =  advtoolbar.getComponent('filterCode');
		var objFilterCode = Ext.getCmp('filterCode');
		var title = getLabel('advancedFilter', 'Advanced Filter');
		// Clearing the selected field from add field button
		this.resetSelectedCriteria();

		if (filterData && filterData.filterBy) {
			if (objAdvFlt.isHidden())
				objAdvFlt.show();
				
			Ext.each(objAdvFltForm.query('[isFormField]'), function(formField){
			formField.ownerCt.remove(formField);
			});
			
			objAdvFltForm.removeAll();
			if (objFilterCode)
				objFilterCode.setValue(filtercode);
			objFilterBy = filterData.filterBy;
			Ext.each(objFilterBy, function(node) {
						if (node.field)
							objAdvFlt.addFilterRow(node.field);
					});
			this.setAdvancedFilerValues(objFilterBy);
		}
		if (filtercode) {
			objAdvFlt.setTitle(title + ' | ' + filtercode);
		}
		this.enableDisableSaveAsButton();
		var filterdata = this.getAdvancedFilterJson('QUERY_JSON');
		if (objAdvFlt && applyAdvFilter) {
			this.fireEvent('applyAdvancedFilter',this,filterdata);
		}

	},
	setAdvancedFilerValues : function(valueJson) {
		var objField, objCcyField, isCCyField = false, ccyFieldVaue = '';
		var strField, fieldId, fieldValue;
		var objAdvFlt = this.advancedfilterview;
		var objAdvFltForm = objAdvFlt.down('form');
		var objForm = objAdvFltForm.getForm();
		var me = this;
		Ext.each(valueJson, function(node) {
					strField = node.field;
					if (strField) {
						fieldId = Ext.String.format('{0}_operator', strField);
						fieldValue = node.operator
						me.setFormFieldValue(objForm, fieldId, fieldValue);

						fieldId = Ext.String.format('{0}_value1', strField);
						fieldValue = node.value1;
						me.setFormFieldValue(objForm, fieldId, fieldValue);

						fieldId = Ext.String.format('{0}_value2', strField);
						fieldValue = node.value2;
						me.setFormFieldValue(objForm, fieldId, fieldValue);

						fieldId = Ext.String.format('{0}_ccy', strField);
						fieldValue = node.value1;
						objField = objForm.findField(fieldId);
						if (objField && !isCCyField) {
							objCcyField = objField;
							isCCyField = true;
						}
						if (strField === 'currency')
							ccyFieldVaue = fieldValue;
						me.handleFieldMenuCheckUncheck(strField, true);
					}
				});
		if (objCcyField)
			objCcyField.setValue(ccyFieldVaue);
	},
	setFormFieldValue : function(objForm, fieldName, value) {
		var objField = objForm.findField(fieldName);
		if (objField) {
			objField.setValue(value);
		}
	},
	handleFieldMenuCheckUncheck : function(menuId, isChecked) {
		var objAdv = this.advancedfilterview;
		var itemId = Ext.String.format('toolbar menucheckitem[itemId="{0}"]',
				menuId);
		var menuItem = objAdv.down(itemId);
		if (menuItem) {
			if (isChecked) {
				menuItem.removeCls('x-menu-item-unchecked');
				menuItem.addCls('x-menu-item-checked');
			} else {
				menuItem.removeCls('x-menu-item-checked');
				menuItem.addCls('x-menu-item-unchecked');
			}
			menuItem.checked = isChecked;
		}
	},
	enableDisableSaveAsButton : function() {
		var hiddenFilterCode = Ext.getCmp('filterCode');
		var filterCode = hiddenFilterCode.getValue();
		var btnSaveAs = Ext.getCmp('btnSaveAs');
		if (filterCode)
			btnSaveAs.show();
		else
			btnSaveAs.hide();

	},
	doSaveAs : function() {
		if (this.checkIsRowExist())
		{	
			this.captureFilterCode(this.getAllSaveFilter);
		}
	},
	doSaveAndSearch : function() {
		if (this.checkIsRowExist()) {
			var objFilterCode = Ext.getCmp('filterCode');
			var callBack = this.postDoSaveAndSearch;
			if (objFilterCode) {
				var strFilterCode = objFilterCode.getValue();
				if (Ext.isEmpty(strFilterCode))
					this.captureFilterCode(callBack);
				else
					this.postSaveFilterRequest(strFilterCode, callBack);
			}
		}
	},
	postDoSaveAndSearch : function() {
		this.enableDisableSaveAsButton();
		this.getAllSaveFilter();
		this.doSearchOnly();
	},
	doSearchOnly : function() {
		if (this.checkIsRowExist()) {
			var obj = this.advancedfilterview;
			var filterdata = this.getAdvancedFilterJson('QUERY_JSON');
			if (obj)
			{
				this.fireEvent('applyAdvancedFilter',this,filterdata);
			}
		}
	},
	checkIsRowExist : function() {
		var objAdvFlt = this.advancedfilterview;
		var objFltFrm = objAdvFlt.down('form');
		var retValue = true;
		if (objFltFrm && objFltFrm.items && objFltFrm.items.length === 0) {
			Ext.Msg.show({
						title : getLabel('criteriaErrorTitle', 'Error'),
						msg : getLabel('criteriaErrorMsg',
								'At least one criteria should be present..!'),
						buttons : Ext.Msg.OK,
						width : 300
					});

			retValue = false;
		}
		return retValue;
	},
	captureFilterCode : function(fnCallBack) {
		var me = this;
		Ext.create('Ext.window.Window', {
			title : getLabel('titleFilterCode', 'Filter Code'),
			width : 300,
			items : [{
						xtype : 'textfield',
						itemId : 'filterCode',
						fieldLabel : getLabel('lblFilterCode', 'Filter Code'),
						maxLength : 20,
						regex : /[a-zA-Z0-9]+/,
						regexText : 'Special Characters are not allowed..!',
						listeners : {
							blur : function() {

								this.setValue(this.getValue().trim());
							}
						}
					}],
			buttons : [{
				text : getLabel('btnOk', 'Ok'),
				handler : function(btn) {
					var objWindow = this.ownerCt.ownerCt;
					var objTxt = objWindow
							.down('textfield[itemId="filterCode"]');
					var strFilterCode = objTxt.getValue();
					if (Ext.isEmpty(strFilterCode) || !objTxt.isValid())
						return false;
					else {

						me.postSaveFilterRequest(strFilterCode, fnCallBack);
						objWindow.close();

					}
				}
			}]
		}).show();
	},
	postSaveFilterRequest : function(filtercode, fnCallback) {
		var objFilterCode = Ext.getCmp('filterCode');
		var me = this;
		var objJson;
		var strUrl = me.saveFilterUrl;
		objJson = this.getAdvancedFilterJson('VALUE_JSON');
		strUrl = Ext.String.format(strUrl, filtercode);
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
							title = getLabel('SaveFilterPopupTitle',
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
						if (objFilterCode && isSuccess && isSuccess === 'Y') {
							objFilterCode.setValue(filtercode);
							me.setAdvancedFilterTitle(filtercode);
							fnCallback.call(me);
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
	getAdvancedFilterJson : function(strJsonType) {
		var objJson = null;
		var objAdvFlt = this.advancedfilterview;
		var objForm = objAdvFlt.down('form').getForm();
		var arrCriteria = this.getSelectedCriteriaList();
		var objFilterJson = objAdvFlt.filterJson.filterParameter;
		var strCriteria, objFieldJson;
		var strFieldName, strValue1, strValue2, strOperator, objField, strDataType, strDisplayType;
		var jsonArray = [];
		var idOperator, idValue1, idValue2, idCcy;
		var objFilterCode = Ext.getCmp('filterCode');
		if (arrCriteria && objFilterJson) {
			for (var i = 0; i < arrCriteria.length; i++) {
				strValue1 = '';
				strValue2 = '';
				strOperator = '';
				strCriteria = arrCriteria[i];
				idOperator = Ext.String.format('{0}_operator', strCriteria);
				idValue1 = Ext.String.format('{0}_value1', strCriteria);
				idValue2 = Ext.String.format('{0}_value2', strCriteria);
				objFieldJson = objFilterJson[strCriteria];
				if (objFieldJson) {
					strDataType = objFieldJson.dataType;
					strDisplayType = objFieldJson.displayType;
					strOperator = this.getFormFieldValue(objForm, idOperator);
					if (objFieldJson.conditionType === 0) {
						strValue1 = this.getFormFieldValue(objForm, idValue1);

					} else if (objFieldJson.conditionType === 1) {
						strValue1 = this.getFormFieldValue(objForm, idValue1);
						strValue2 = this.getFormFieldValue(objForm, idValue2);
					}
					if (strDataType === 1) {
						if (!Ext.isEmpty(strValue1))
							strValue1 = Ext.util.Format
									.date(strValue1, 'Y-m-d');
						if (!Ext.isEmpty(strValue2))
							strValue2 = Ext.util.Format
									.date(strValue2, 'Y-m-d')
					}
					strValue1 = Ext.isEmpty(strValue1) ? "" : strValue1;
					strValue2 = Ext.isEmpty(strValue2) ? "" : strValue2;

					if (strJsonType === 'QUERY_JSON') {
						strFieldName = objFieldJson.queryParamName;
						jsonArray.push({
									field : strFieldName,
									operator : strOperator,
									value1 : strValue1,
									value2 : strValue2,
									dataType : strDataType,
									displayType : strDisplayType
								});
					}
					if (strJsonType === 'VALUE_JSON') {
						strFieldName = strCriteria;
						jsonArray.push({
									field : strFieldName,
									operator : strOperator,
									value1 : strValue1,
									value2 : strValue2
								});
					}
					if (strDisplayType === 2)// for amount box
					{
						idCcy = Ext.String.format('{0}_ccy', strCriteria);
						var ccyJson = this.createCcyJson(strJsonType, objForm,
								idCcy);
						jsonArray.push(ccyJson);
					}
				}
			}
			if (strJsonType === 'QUERY_JSON')
				objJson = jsonArray;
			if (strJsonType === 'VALUE_JSON') {
				var filterCode = '';
				objJson = {};
				objJson.filterBy = jsonArray;
				if (objFilterCode && !Ext.isEmpty(objFilterCode.getValue()))
					filterCode = objFilterCode.getValue();

				objJson.filterCode = filterCode;
			}
		}
		return objJson;

	},
	getSelectedCriteriaList : function() {
		var arrSelected = [];
		var objAdvFlt = this.advancedfilterview;
		var objMenu = objAdvFlt.down('toolbar menu');
		if (objMenu) {
			var items = objMenu.items.items;
			if (items) {
				Ext.each(items, function(item) {
							if (item.checked) {
								arrSelected.push(item.itemId);
							}
						});
			}
		}
		return arrSelected;

	},
	getFormFieldValue : function(objForm, fieldName) {
		var objField = objForm.findField(fieldName);
		var retValue = "";
		if (objField) {
			retValue = objField.getValue();
		}
		return retValue;
	},
	createCcyJson : function(strJsonType, objForm, fieldName) {
		var objJson = {};
		var strValue1 = this.getFormFieldValue(objForm, fieldName);
		strValue1 = Ext.isEmpty(strValue1) ? "" : strValue1;
		if (strJsonType === 'QUERY_JSON') {
			objJson.field = 'Currency';
			objJson.dataType = '0';
		} else if (strJsonType === 'VALUE_JSON') {
			objJson.field = 'currency';
		}

		objJson.operator = 'eq';
		objJson.value1 = strValue1;
		objJson.value2 = '';
		return objJson;

	},
	setAdvancedFilterTitle : function(filterCode) {
		var objAdv = this.advancedfilterview;
		var title = getLabel('advancedFilter', 'Advanced Filter');
		if (filterCode)
			objAdv.setTitle(title + ' | ' + filterCode);

	},
	generateUrlWithAdvancedFilterParams : function(filterdata)
	{
		var thisClass = this;
		var filterData = filterdata;
		var isFilterApplied = false;
		var isOrderByApplied = false;
		var strFilter = '&$filter=';
		var strTemp = '';
		var strFilterParam = '';
		var operator = '';
		var isInCondition = false;

		/*var objEntity = null;
		var filterBar = this.getBatchFilterBar();
		if (!Ext.isEmpty(filterBar.getEntityFilterCombo().filterParamName)) {
			objEntity = {
				field : filterBar.getEntityFilterCombo().filterParamName,
				value1 : filterBar.getEntityFilterCombo().getValue(),
				operator : 'eq',
				dataType : 0
			};
		}
		// Added entity filter to the advanced filter query JSON
		if (!Ext.isEmpty(objEntity) && !Ext.isEmpty(filterData))
			filterData.splice(0, 0, objEntity);*/
			
		if (!Ext.isEmpty(filterData)) {
			for (var index = 0; index < filterData.length; index++) {
				isInCondition = false;
				operator = filterData[index].operator;
				if (isFilterApplied
						&& (operator === 'bt' || operator === 'eq'
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
	setVisibility : function (isVisible)
	{
		var objAdvFlt = this.advancedfilterview;
		var objFltFrm = Ext.getCmp('advancedFilterForm');
		if (objAdvFlt) {
			objAdvFlt.setVisible(isVisible);
		}
	}
	
	
});