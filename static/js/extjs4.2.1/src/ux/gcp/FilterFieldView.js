Ext.define('Ext.ux.gcp.FilterFieldView',
{
	extend : 'Ext.panel.Panel',
	requires : ['Ext.form.field.ComboBox', 'Ext.button.Button',
				'Ext.form.field.ComboBox', 'Ext.form.field.Date', 'Ext.form.field.Number',
				'Ext.form.Panel', 'Ext.menu.CheckItem', 'Ext.form.field.Hidden',
				'Ext.ux.gcp.AutoCompleter'],
	xtype : 'AdvancedFilterView',
	id : 'advancedfilterview',
	filterModel : null,
	filterJson : null,
	header : true,
	minHeight : 100,
	closable : false,
	closeAction : 'hide',
	collapsible : true,
	hidden : true,
	parent : null,
	componentCls : 'xn-panel',
	title : getLabel('advancedFilterTitle', 'Advanced Filter'),
	initComponent : function() {
		var me = this;
		var filterJson;
		if (this.filterModel) {
			this.filterJson = Ext.decode(JSON
					.stringify(this.filterModel.modelItems[0]));
		}
		me.configureItems(me.filterJson);
		this.items = [{
					xtype : 'form',
					id : 'advancedFilterForm',
					header : false,
					height : 'auto',
					width : '100%',
					layout : 'vbox'
				}];
		this.callParent();
	},
	configureItems : function(filterJson) {
		var me = this;
		var arrMenuItems = [];
		var isFirst = true;
		if (filterJson) {
			var filterData = filterJson.filterParameter;
			if (filterData) {
				for (var key in filterData) {
					if (filterData.hasOwnProperty(key)) {
						var obj = filterData[key];
						var item = new Ext.menu.CheckItem({
									text : obj.fieldLabel,
									name : key,
									itemId : key,
									listeners : {
										checkchange : function(item, checked) {
											me.handleAddRemoveField(item,checked);
										},
										click : function(item) {
											item.ownerCt.hide();
										}

									}
								});
						if (!Ext.isEmpty(item))
							arrMenuItems.push(item);
					}
				}
			}
		}

		var objToolbar = Ext.create('Ext.toolbar.Toolbar', {
					dock : 'bottom',
					displayInfo : true,
					padding : '5 5 5 5',
					items : ['->', {
								xtype : 'button',
								cls : 'xn-button',
								overCls : 'xn-button-hover',
								btnId : 'btnAddField',
								text : getLabel('btnAddField', 'Add Field'),
								menu : Ext.create('Ext.menu.Menu', {
											width : 150,
											maxHeight : 200,
											items : arrMenuItems
										}),
								handler : function(btn) {
								}
							}, {
								xtype : 'button',
								cls : 'xn-button',
								overCls : 'xn-button-hover',
								id : 'btnSaveAs',
								hidden : true,
								text : getLabel('btnSaveAs', 'Save As'),
								handler : function(btn) {
									me.parent.fireEvent('handleActionSaveAs', btn);
								}
							}, {
								xtype : 'button',
								cls : 'xn-button',
								overCls : 'xn-button-hover',
								btnId : 'btnSaveAndSearch',
								text : getLabel('btnSaveAndSearch',
										'Save And Search'),
								handler : function(btn) {
									me.parent.fireEvent('handleActionSaveAndSearch',
											btn);
								}
							}, {
								xtype : 'button',
								cls : 'xn-button',
								overCls : 'xn-button-hover',
								btnId : 'btnSaveAs',
								text : getLabel('btnSearch', 'Search'),
								handler : function(btn) {
									me.parent.fireEvent('handleActionSearch', btn);
								}
							}, {
								xtype : 'hiddenfield',
								id : 'filterCode'
							}]
				});
		this.dockedItems = [objToolbar];
		this.doLayout();
	},
	handleAddRemoveField : function(item, isChecked) {
		if (isChecked) {
			this.addFilterRow(item.itemId);

		}else {
			var rowId = item.itemId + '_row';
			this.deleteFilterRow(rowId);
		}
	},
	addFilterRow : function(fieldId) {
		var obj = this;
		var objCfgJson = obj.filterJson.filterParameter;
		var rowJson;
		var conditionType, displayType;
		var objPanel, objCriteriaField, objOptField, objDeleteBtn, arrOpt, rowId, objValueField;
		var advFilterForm = obj.down('form');
		if (objCfgJson) {
			rowJson = objCfgJson[fieldId];
			if (rowJson) {
				rowId = fieldId + '_row';
				conditionType = rowJson.conditionType;
				displayType = rowJson.displayType;
				arrOpt = obj.getOperators(conditionType, displayType);
				objCriteriaField = obj.createCriteriaField(fieldId, rowJson);
				objOptField = obj.createOperatorsField(fieldId, arrOpt);
				objDeleteBtn = obj.createDeleteButton(fieldId);
				objValueField = obj.createValueFields(fieldId, rowJson);
				objPanel = Ext.create('Ext.panel.Panel', {
							itemId : rowId,
							header : false,
							width : '100%',
							border : 0,
							layout : 'hbox',
							items : [objCriteriaField, objOptField,
									objValueField],
							dockedItems : [{
										xtype : 'toolbar',
										dock : 'right',
										layout : 'hbox',
										items : [objDeleteBtn]
									}]
						});
				if (advFilterForm)
					advFilterForm.add(objPanel);

			}
		}

	},
	getField : function(fldId, objJson) {
		var displayType = objJson.displayType;
		var fldMaxLength = objJson.maxLength;
		var isReadOnly = !Ext.isEmpty(objJson.readOnly)
				? objJson.readOnly
				: false;
		var defaultValue = !Ext.isEmpty(objJson.defaultValue)
				? objJson.defaultValue
				: '';
		var optValues = objJson.options;
		var urlDetails = objJson.urlDetails;
		var field = null;
		switch (displayType) {
			// TextBox
			case 0 :
				field = this.createTextField(fldId, fldMaxLength, defaultValue,
						isReadOnly);
				break;
			// TextArea
			case 1 :
				break;
			// AmountBox
			case 2 :
				field = this.createAmountField(fldId, fldMaxLength, isReadOnly);
				break;
			// NumberBox
			case 3 :
				break;
			// ComboBox
			case 4 :
				field = this.createComboField(fldId, defaultValue, optValues,
						urlDetails);
				break;
			// DateBox
			case 5 :
				field = this.createDateField(fldId, fldMaxLength, isReadOnly);
				break;
			// SuggetionBox
			case 6 :
				field = this.createSuggestionBox(fldId, defaultValue,
						urlDetails);
				break;
		}
		return field;

	},
	getOperators : function(conditionType, displayType) {
		var retArray = [];
		if (conditionType === 0 && displayType === 4) {
			retArray.push({
						key : 'eq',
						value : getLabel('optEqual', 'Equal')
					});
		} else if (conditionType === 0) {
			retArray.push({
						key : 'lk',
						value : getLabel('optContains', 'Contains')
					});
			retArray.push({
						key : 'eq',
						value : getLabel('optEqual', 'Equal')
					});
		}
		if (conditionType === 1 && displayType === 5) {
			retArray.push({
						key : 'bt',
						value : getLabel('optRange', 'Range')
					});
			retArray.push({
						key : 'lt',
						value : getLabel('optBefore', 'Before')
					});
			retArray.push({
						key : 'gt',
						value : getLabel('optAfter', 'After')
					});
			retArray.push({
						key : 'eq',
						value : getLabel('optEqual', 'Equal')
					});

		} else if (conditionType === 1) {
			retArray.push({
						key : 'bt',
						value : getLabel('optRange', 'Range')
					});
			retArray.push({
						key : 'gt',
						value : getLabel('optGreaterThan', 'Greater Than')
					});
			retArray.push({
						key : 'lt',
						value : getLabel('optLessThan', 'Less Than')
					});
			retArray.push({
						key : 'eq',
						value : getLabel('optEqual', 'Equal')
					});
		}
		return retArray;
	},
	createCriteriaField : function(fieldId, cfgJson) {
		var queryParamName = cfgJson.filterParamName;
		var strLbl = cfgJson.fieldLabel;
		var itemId = fieldId + "_criteria";
		var item = Ext.create('Ext.form.Label', {
					itemId : itemId,
					name : itemId,
					text : strLbl,
					cls : 'w14',
					filterParamName : queryParamName,
					margin : '12 10 0 50'
				});
		return item;
	},
	createOperatorsField : function(fieldId, objData) {
		var itemId = fieldId + "_operator";
		var toValueId, toValueLabelId;
		toValueId = fieldId + '_value2';
		toValueLabelId = fieldId + '_tovaluelabel'
		var me = this;
		var objStore = null;
		if (objData && objData.length > 0) {
			objStore = Ext.create('Ext.data.Store', {
						fields : ['key', 'value'],
						data : objData && objData.length > 0 ? objData : [],
						//Overrided as load event has removed in 4.2.0
						loadRawData : function(data, append) {
							 var me      = this,
								 result  = me.proxy.reader.read(data),
								 records = result.records;

							 if (result.success) {
								 me.totalCount = result.total;
								 me.loadRecords(records, append ? me.addRecordsOptions : undefined);
								 me.fireEvent('load', me, records, true);
							 }
						 }
					});
		}
		var item = Ext.create('Ext.form.field.ComboBox', {
					displayField : 'value',
					valueField : 'key',
					margin : '10 10 0 10',
					itemId : itemId,
					name : itemId,
					editable : false,
					fieldCls : 'xn-form-field w8',
					triggerBaseCls : 'xn-form-trigger',
					store : objStore,
					listeners : {
						change : function(combo, newValue, oldValue) {
							me.parent.fireEvent("handleRangeFieldsShowHide",
									toValueId, toValueLabelId,
									newValue === 'bt' ? true : false);
						}

					}
				});
		if (objStore && objStore.getTotalCount() > 0)
			item.setValue(objStore.getAt(0).get('key'));
		return item;

	},
	createDeleteButton : function(fieldId) {
		var me = this;
		var itemId = fieldId + "_delete";
		var rowId = fieldId + "_row";
		var item = Ext.create('Ext.button.Button', {
					btnId : itemId,
					text : 'X',
					cls : 'xn-button',
					margin : '10 10 0 10',
					overCls : 'xn-button-hover',
					handler : function(btn) {
						me.handleRowDelete(btn, rowId);
					}
				});
		return item;
	},
	createValueFields : function(mainId, cfgJson) {
		var conditionType = cfgJson.conditionType;
		var displayType = cfgJson.displayType;
		var objField = null;
		var fieldId1, fieldId2, ccyFieldId;
		fieldId1 = mainId + '_value1';
		fieldId2 = mainId + '_value2';
		ccyFieldId = mainId + '_ccy';

		objField = Ext.create('Ext.panel.Panel', {
					header : false,
					width : '100%',
					border : 0,
					layout : 'hbox',
					margin : '10 10 0 30'
				});
		if (conditionType === 0) // EQUAL,CONTAINS
		{
			var objItem = this.getField(fieldId1, cfgJson);
			objField.add(objItem);

		} else if (conditionType === 1) // RANGE
		{
			var objCcyField = null;
			var objFormField = this.getField(fieldId1, cfgJson);
			var objToField = this.getField(fieldId2, cfgJson);
			var objLabel = Ext.create('Ext.form.Label', {
						text : 'To',
						name : mainId + '_tovaluelabel',
						cls : 'w1',
						margin : '8 5 0 5'
					});
			if (displayType === 2) // Amount Field
			{
				fieldId1 = mainId + '_ccy';
				objCcyField = this.createCurrencyField(fieldId1, cfgJson)
				objField.add(objCcyField);
			}
			if (displayType === 5) // DateField
			{
				fieldId1 = mainId + '_value1';
				fieldId2 = mainId + '_value2';
				objFormField.vtype = 'daterange';
				objFormField.endDateField = fieldId2;
				objToField.vtype = 'daterange';
				objToField.startDateField = fieldId1;
				objToField.on('change', function(field, newValue, oldValue) {
							if (Ext.isEmpty(newValue)) {
								Ext.form.field.VTypes
										.daterange(newValue, field);
							}
						});

			}
			objField.add(objFormField);
			objField.add(objLabel);
			objField.add(objToField);

		}
		return objField;
	},
	createTextField : function(fldId, fldMaxLength, defaultValue, isReadOnly) {
		var field = Ext.create('Ext.form.TextField', {
					fieldCls : 'xn-valign-middle xn-form-text w12',
					allowBlank : true,
					margin : '0 4 4 4',
					itemId : fldId,
					name : fldId,
					maxLength : fldMaxLength,
					readOnly : isReadOnly,
					value : defaultValue
				});
		return field;
	},
	createAmountField : function(fldId, fldMaxLength, defaultValue, isReadOnly) {
		var field = Ext.create('Ext.form.field.Number', {
					fieldCls : 'xn-valign-middle xn-form-text w12 xn-field-amount',
					allowBlank : true,
					margin : '0 4 4 4',
					itemId : fldId,
					name : fldId,
					maxLength : fldMaxLength,
					readOnly : isReadOnly,
					hideTrigger : true,
					value : defaultValue
				});
		return field;
	},
	createComboField : function(fldId, defaultValue, optionsValue, urlDetails) {
		var objStore = null;
		var strDisplayField, strValueField;
		if (optionsValue && optionsValue.length > 0) {
			objStore = Ext.create('Ext.data.Store', {
						fields : ['key', 'value'],
						data : optionsValue && optionsValue.length > 0
								? optionsValue
								: []
					});
			strDisplayField = 'value';
			strValueField = 'key';
		} else {
			var arrayField = [];
			var node1 = urlDetails.cfgDataNode1, node2 = urlDetails.cfgDataNode2;
			if (!Ext.isEmpty(node1))
				arrayField.push(node1);
			if (!Ext.isEmpty(node2))
				arrayField.push(node2);
			var cfgUrl = 'services/userseek/{0}.json'
			var strUrl = Ext.String.format(cfgUrl, urlDetails.cfgSeekId);
			objStore = Ext.create('Ext.data.Store', {
						fields : arrayField,
						proxy : {
							type : 'ajax',
							autoLoad : true,
							url : strUrl,
							noCache : false,
							pageParam : false, // to remove param "page"
							startParam : false, // to remove param "start"
							limitParam : false, // to remove param "limit"
							reader : {
								type : 'json',
								root : this.cfgRootNode
							}
						}
					});
			strDisplayField = node1;
			strValueField = node2;
		}
		var field = Ext.create('Ext.form.field.ComboBox', {
					displayField : strDisplayField,
					valueField : strValueField,
					itemId : fldId,
					name : fldId,
					editable : false,
					fieldCls : 'xn-form-field w12',
					triggerBaseCls : 'xn-form-trigger',
					value : defaultValue,
					store : objStore,
					width : 'auto',
					margin : '0 4 4 4'
				});
		return field;
	},
	createDateField : function(fldId, fldMaxLength, isReadOnly) {
		var field = Ext.create('Ext.form.field.Date', {
					fieldCls : 'xn-valign-middle xn-form-text w12',
					allowBlank : true,
					margin : '0 4 4 4',
					itemId : fldId,
					name : fldId,
					editable : !isReadOnly,
					hideTrigger : true,
					showToday : false,
					format : strExtApplicationDateFormat
							? strExtApplicationDateFormat
							: 'd/m/Y',
					onExpand : function() {
						var strAppDate = dtApplicationDate;
						var dtFormat = strExtApplicationDateFormat;
						var date = new Date(Ext.Date
								.parse(strAppDate, dtFormat));
						var value = this.getValue();
						date = Ext.isDate(date) ? date : new Date();
						this.picker.setValue(Ext.isDate(value) ? value : date);
					}
				});
		return field;
	},
	createSuggestionBox : function(fldId, defaultValue, urlDetails) {
		var field = Ext.create('Ext.ux.gcp.AutoCompleter', {
					margin : '0 4 4 4',
					name : fldId,
					itemId : fldId,
					cfgSeekId : urlDetails.seekId,
					cfgRootNode : urlDetails.rootNode,
					cfgDataNode1 : urlDetails.col1Node,
					cfgDataNode2 : urlDetails.col2Node,
					cfgDataNode3 : urlDetails.col3Node,
					cfgDataNode4 : urlDetails.col4Node
				});
		return field;
	},
	createCurrencyField : function(fldId, congifJson) {
		var urlDetails = congifJson.urlDetails;
		var objStore = null;
		var arrayField = [];
		var node1 = urlDetails.col1Node, node2 = urlDetails.col2Node, rootNode = urlDetails.rootNode;
		if (!Ext.isEmpty(node1))
			arrayField.push(node1);
		if (!Ext.isEmpty(node2))
			arrayField.push(node2);
		var cfgUrl = 'services/userseek/{0}.json'
		var strUrl = Ext.String.format(cfgUrl, urlDetails.seekId);
		objStore = Ext.create('Ext.data.Store', {
					fields : arrayField,
					proxy : {
						type : 'ajax',
						autoLoad : true,
						url : strUrl,
						noCache : false,
						pageParam : false, // to remove param "page"
						startParam : false, // to remove param "start"
						limitParam : false, // to remove param "limit"
						reader : {
							type : 'json',
							root : rootNode
						}
					}
				});
		var field = Ext.create('Ext.form.field.ComboBox', {
					displayField : node2,
					valueField : node1,
					itemId : fldId,
					name : fldId,
					editable : false,
					fieldCls : 'xn-form-field w3',
					triggerBaseCls : 'xn-form-trigger',
					store : objStore,
					width : 52,
					margin : '0 4 4 4',
					emptyText : 'CCY'
				});
		return field;
		
	},
	handleRowDelete : function(btn, rowId) {
		var me = this;
		var itemId = rowId.substr(0, rowId.indexOf('_row'));
		me.handleFieldMenuCheckUncheck(itemId, false);
		me.deleteFilterRow(rowId);
	},
	handleFieldMenuCheckUncheck : function(menuId, isChecked) {
		var objAdv = this;
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
	deleteFilterRow : function(rowId) {
		var itemId = rowId.substr(0, rowId.indexOf('_row'));
		var me = this;
		var advFilterForm = me.down('form');
		var objForn = advFilterForm.getForm();
		var row = advFilterForm.down('panel[itemId="' + rowId + '"]');
		if (row)
		{
			var objFromField = objForn.findField(itemId+'_value1');
			var objToField = objForn.findField(itemId+'_value2');
			var objOtField = objForn.findField(itemId+'_operator');
			var objCcyField = objForn.findField(itemId+'_ccy');
			if(objFromField)
				objFromField.destroy(true);
			if(objToField)
				objToField.destroy(true);
			if(objOtField)
				objOtField.destroy(true);
			if(objCcyField)
				objCcyField.destroy(true);
			row.destroy(true);
		}
	}
});