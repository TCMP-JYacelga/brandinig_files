Ext.define('GCP.view.PositivePayIssuanceCreateNewAdvFilter', {
	extend : 'Ext.panel.Panel',
	xtype : 'positivePayIssuanceCreateNewAdvFilter',
	requires : ['Ext.data.Store', 'Ext.form.field.Number',
			'Ext.form.RadioGroup', 'Ext.container.Container',
			'Ext.layout.container.VBox', 'Ext.layout.container.HBox',
			'Ext.form.Label', 'Ext.form.field.Text', 'Ext.button.Button',
			'Ext.menu.Menu', 'Ext.form.field.Date',
			'Ext.layout.container.Column', 'Ext.form.field.ComboBox',
			'Ext.toolbar.Toolbar', 'Ext.ux.gcp.AutoCompleter'],
	cls : 'filter-container-cls',

	initComponent : function() {
		var me = this;
		 var intFilterDays = !Ext.isEmpty(filterDays)
		? parseInt(filterDays,10)
		: '';
		var arrMenuItem = [];
		if (intFilterDays >= 1 || Ext.isEmpty(intFilterDays))
			arrMenuItem.push({
						text : getLabel('today', 'Today'),
						btnId : 'btnToday',
						btnValue : '1',
						parent : this,
						handler : function(btn, opts) {
							me.fireEvent('filterDateChange', btn, opts);
						}
					});	
			if (intFilterDays >= 2 || Ext.isEmpty(intFilterDays))
			arrMenuItem.push( {
						text : getLabel('yesterday', 'Yesterday'),
						btnId : 'btnYesterday',
						btnValue : '2',
						parent : this,
						handler : function(btn, opts) {
							me.fireEvent('filterDateChange', btn, opts);
						}
					});
		
		if (intFilterDays >= 7 || Ext.isEmpty(intFilterDays))
				arrMenuItem.push({
						text : getLabel('thisweek', 'This Week'),
						btnId : 'btnThisweek',
						btnValue : '3',
						parent : this,
						handler : function(btn, opts) {
							me.fireEvent('filterDateChange', btn, opts);
						}
					});
		if (intFilterDays >= 14 || Ext.isEmpty(intFilterDays))
				arrMenuItem.push( {
						text : getLabel('lastweektodate', 'Last Week To Date'),
						btnId : 'btnLastweek',
						btnValue : '4',
						parent : this,
						handler : function(btn, opts) {
							me.fireEvent('filterDateChange', btn, opts);
						}
					});
		if (intFilterDays >= 30 || Ext.isEmpty(intFilterDays))
			arrMenuItem.push( {
						text : getLabel('thismonth', 'This Month'),
						btnId : 'btnThismonth',
						btnValue : '5',
						parent : this,
						handler : function(btn, opts) {
							me.fireEvent('filterDateChange', btn, opts);
						}});
		if (intFilterDays >= 60 || Ext.isEmpty(intFilterDays))
			arrMenuItem.push( {
						text : getLabel('lastMonthToDate', 'Last Month To Date'),
						btnId : 'btnLastmonth',
						btnValue : '6',
						parent : this,
						handler : function(btn, opts) {
							me.fireEvent('filterDateChange', btn, opts);
						}
					});
		 if (lastMonthOnlyFilter===true || Ext.isEmpty(intFilterDays))
		   arrMenuItem.push({
					text : getLabel('lastmonthonly', 'Last Month Only'),
					btnId : 'btnLastmonthonly',
					btnValue : '14',
					handler : function(btn, opts) {
						me.fireEvent('filterDateChange', btn, opts);
					}
				});
		if (intFilterDays >= 90 || Ext.isEmpty(intFilterDays))
			arrMenuItem.push({
						text : getLabel('thisquarter', 'This Quarter'),
						btnId : 'btnLastMonthToDate',
						btnValue : '8',
						parent : this,
						handler : function(btn, opts) {
							me.fireEvent('filterDateChange', btn, opts);
						}
					} );
		if (intFilterDays >= 180 || Ext.isEmpty(intFilterDays))
			arrMenuItem.push( {
						text : getLabel('lastQuarterToDate',
								'Last Quarter To Date'),
						btnId : 'btnQuarterToDate',
						btnValue : '9',
						parent : this,
						handler : function(btn, opts) {
							me.fireEvent('filterDateChange', btn, opts);
						}
					});
		if (intFilterDays >= 365 || Ext.isEmpty(intFilterDays))
			arrMenuItem.push({
						text : getLabel('thisyear', 'This Year'),
						btnId : 'btnLastQuarterToDate',
						btnValue : '10',
						parent : this,
						handler : function(btn, opts) {
							me.fireEvent('filterDateChange', btn, opts);
						}
					});
		if (intFilterDays >= 730 || Ext.isEmpty(intFilterDays))
			arrMenuItem.push( {
						text : getLabel('lastyeartodate', 'Last Year To Date'),
						btnId : 'btnYearToDate',
						btnValue : '11',
						parent : this,
						handler : function(btn, opts) {
							me.fireEvent('filterDateChange', btn, opts);
						}
					});
					
					arrMenuItem.push( {
						text : getLabel('daterange', 'Date Range'),
						btnId : 'btnDateRange',
						btnValue : '7',
						parent : this,
						handler : function(btn, opts) {
							me.fireEvent('filterDateChange', btn, opts);
						}
					});
		var menuItems = Ext.create('Ext.menu.Menu', {
			itemId : 'issuanceDateMenu',
			items : arrMemuItem
		});

		var amountValTypeStore = Ext.create('Ext.data.Store', {
					fields : ['amountVal', 'amountTypeDesc'],
					data : [{
								"amountVal" : "",
								"amountTypeDesc" : getLabel('select', 'Select')
							}, {
								"amountVal" : "gt",
								"amountTypeDesc" : getLabel('greaterThan',
										'Greater Than')
							}, {
								"amountVal" : "lt",
								"amountTypeDesc" : getLabel('lessThan',
										'Less Than')
							}, {
								"amountVal" : "eq",
								"amountTypeDesc" : getLabel('equalTo',
										'Equal To')
							}]
				});

		var statusValTypeStore = Ext.create('Ext.data.Store', {
					fields : ['statusVal', 'statusDesc'],
					data : [{
								"statusVal" : "",
								"statusDesc" : "All"
							}, {
								"statusVal" : "0",
								"statusDesc" : "Pending Approval"
							}, {
								"statusVal" : "1",
								"statusDesc" : "Approved"
							}, {
								"statusVal" : "2",
								"statusDesc" : "Rejected"
							},{
								"statusVal" : "0.A",
								"statusDesc" : "Pending My Approval"
							}]
				});

		me.items = [{
			xtype : 'container',
			cls : 'ux_padding-top-18',
			layout : 'hbox',
			flex : 1,
			items : [{
				xtype : 'container',
				layout : 'vbox',
				flex : 1,
				items : [{
							xtype : 'label',
							text : getLabel("corporation", "Corporation"),
							cls : 'f13 ux_font-size14 ux_padding0060'
						}, {
							xtype : 'container',
							layout : 'hbox',
							itemId : 'corporationContainer',
							items : [{
										xtype : 'textfield',
										itemId : 'corporationText',
										width : 145,
										height : 25,
										name : 'corporation',
										fieldCls : 'ux_no-border-right xn-form-field',
										readOnly : true
										
									}, {
										xtype : 'button',
										border : 0,
										height : 25,
										itemId : 'corporationDropDown',
										cls : 'menu-disable xn-custom-arrow-button cursor_pointer ux_dropdown',
										iconCls : 'black',
										glyph : 'xf0d7@fontawesome',
										padding : '6 0 0 0',
										menuAlign : 'tr-br',
										menu : Ext.create('Ext.menu.Menu', {
													itemId : 'corporationMenu',
													width : 165,
													maxHeight : 200,
													defaultAlign:'tr-br',
													items : []
												})
									}]
						}]
			}, {
				xtype : 'container',
				layout : 'vbox',
				flex : 1,
				items : [{
							xtype : 'label',
							text : getLabel("client", "Company Name"),
							cls : 'f13 ux_font-size14 ux_padding0060'
						}, {
							xtype : 'container',
							layout : 'hbox',
							itemId : 'clientContainer',
							items : [{
										xtype : 'textfield',
										itemId : 'clientText',
										width : 145,
										height : 25,
										name : 'client',
										fieldCls : 'ux_no-border-right xn-form-field',
										readOnly : true
										
									}, {
										xtype : 'button',
										border : 0,
										height : 25,
										itemId : 'clientDropDown',
										cls : 'menu-disable xn-custom-arrow-button cursor_pointer ux_dropdown',
										iconCls : 'black',
										glyph : 'xf0d7@fontawesome',
										padding : '6 0 0 0',
										menuAlign : 'tr-br',
										handler : function(btn, opts) {
											me
													.fireEvent(
															'clickHandleForClientMenuAdvFilter',
															btn, opts);
										},
										menu : Ext.create('Ext.menu.Menu', {
													itemId : 'clientMenu',
													width : 165,
													maxHeight : 200,
													defaultAlign:'tr-br',
													items : []
												})
									}]
						}]
			}, {
				xtype : 'container',
				layout : 'vbox',
				flex : 1,
				items : [{
							xtype : 'label',
							text : getLabel("account", "Account"),
							cls : 'f13 ux_font-size14 ux_padding0060'
						}, {
							xtype : 'container',
							layout : 'hbox',
							itemId : 'accountContainer',
							items : [{
										xtype : 'textfield',
										itemId : 'accountText',
										width : 145,
										height : 25,
										name : 'account',
										fieldCls : 'ux_no-border-right xn-form-field',
										readOnly : true
										
									}, {
										xtype : 'button',
										border : 0,
										height : 25,
										itemId : 'accountDropDown',
										cls : 'menu-disable xn-custom-arrow-button cursor_pointer ux_dropdown',
										iconCls : 'black',
										glyph : 'xf0d7@fontawesome',
										padding : '6 0 0 0',
										menuAlign : 'tr-br',
										handler : function(btn, opts) {
											me
													.fireEvent(
															'clickHandleForAccountMenuAdvFilter',
															btn, opts);
										},
										menu : Ext.create('Ext.menu.Menu', {
													itemId : 'accountMenu',
													width : 165,
													maxHeight : 200,
													defaultAlign:'tr-br',
													items : []
												})
									}]
						}]
			}]
		}, {
			xtype : 'container',
			cls : 'ux_padding-top-18',
			layout : 'hbox',
			flex : 1,
			items : [{
				xtype : 'container',
				layout : 'vbox',
				flex : 1,
				items : [{
							xtype : 'label',
							text : getLabel("issueDate", "Issuance Date"),
							cls : 'f13 ux_font-size14 ux_padding0060'
						}, {
							xtype : 'container',
							layout : 'hbox',
							itemId : 'issuDateContainer',
							items : [{
										xtype : 'textfield',
										itemId : 'issueDateText',
										width : 145,
										height : 25,
										name : 'issueDate',
										fieldCls : 'ux_no-border-right xn-form-field',
										readOnly : true,
										value : getLabel('latest', 'Latest')
									}, {
										xtype : 'button',
										border : 0,
										height : 25,
										itemId : 'issueDateDropDown',
										dateIndex : '',
										cls : 'menu-disable xn-custom-arrow-button cursor_pointer ux_dropdown',
										iconCls : 'black',
										glyph : 'xf0d7@fontawesome',
										padding : '6 0 0 0',
										menuAlign : 'tr-br',
										menu : menuItems
									}]
						}]
			}, {
				xtype : 'datefield',
				itemId : 'issueDateFrom',
				name : 'issueDateFrom',
				hideTrigger : true,
				width : 165,
				flex : 1,
				fieldCls : 'xn-form-text w165',
				labelAlign : 'top',
				labelSeparator : '',
				labelCls : 'f13 ux_font-size14 ux_padding0060',
				fieldLabel : getLabel('dateRangeFrom', 'Date Range From'),
				cls : 'date-range-font-size',
				padding : '0 3 0 0',
				editable : false,
				fieldIndex : '7',
				listeners : {
					change : function(cmp, newVal) {
						me.fireEvent('filterDateRange', cmp, newVal);
					}
				}
			}, {
				xtype : 'datefield',
				itemId : 'issueDateTo',
				name : 'issueDateTo',
				hideTrigger : true,
				width : 165,
				flex : 1,
				fieldCls : 'xn-form-text w165',
				labelCls : 'f13 ux_font-size14 ux_padding0060',
				labelAlign : 'top',
				labelSeparator : '',
				fieldLabel : getLabel('dateRangeTo', 'Date Range To'),
				cls : 'date-range-font-size',
				padding : '0 3 0 0',
				editable : false,
				fieldIndex : '7',
				listeners : {
					change : function(cmp, newVal) {
						me.fireEvent('filterDateRange', cmp, newVal);
					}
				}
			}]
		}, {
			xtype : 'container',
			cls : 'ux_padding-top-18',
			layout : 'hbox',
			flex : 1,
			items : [{
						xtype : 'container',
						layout : 'vbox',
						flex : 1,
						items : [{
									xtype : 'label',
									text : getLabel("status", "Action Status"),
									cls : 'f13 ux_font-size14 ux_padding0060'
								}, {
									xtype : 'container',
									layout : 'hbox',
									itemId : 'statusContainer',
									items : [{
												xtype : 'combo',
												itemId : 'actionStatus',
												name : 'actionStatus',
												queryMode : 'local',
												editable : false,
												fieldCls : 'xn-form-field',
												triggerBaseCls : 'xn-form-trigger',
												store : statusValTypeStore,
												displayField : 'statusDesc',
												valueField : 'statusVal',
												value : getLabel('all', 'All')
											}]
								}]
					}, {
						xtype : 'container',
						layout : 'vbox',
						flex : 1,
						items : [{
									xtype : 'label',
									text : getLabel("txnStatus",
											"Transaction Status"),
									cls : 'f13 ux_font-size14 ux_padding0060'
								}, {
									xtype : 'container',
									layout : 'hbox',
									itemId : 'txnStatusContainer',
									items : [{
												xtype : 'combo',
												itemId : 'txnStatus',
												name : 'txnStatus',
												queryMode : 'local',
												fieldCls : 'xn-form-field',
												triggerBaseCls : 'xn-form-trigger',
												editable : false,
												// store : statusValTypeStore,
												displayField : 'statusDesc',
												valueField : 'statusVal',
												value : getLabel('all', 'All')
											}]
								}]
					}, {
						xtype : 'textfield',
						width : 165,
						itemId : 'fileName',
						fieldCls : 'xn-form-text w165',
						flex : 1,
						labelAlign : 'top',
						labelCls : 'f13 ux_font-size14 ux_padding0060',
						labelSeparator : '',
						name : 'fileName',
						fieldLabel : getLabel('fileName', 'File Name'),
						cls : 'ux_paddingb',
						labelWidth : 150,
						enforceMaxLength : true,
						enableKeyEvents : true,
						maxLength : 20,
						msgTarget : 'under'
					}]
		}, {
			xtype : 'container',
			cls : 'ux_padding-top-18',
			layout : 'hbox',
			flex : 1,
			items : [{
				xtype : 'container',
				layout : 'vbox',
				flex : 1,
				items : [{
							xtype : 'label',
							text : getLabel("amountCondition",
									"Amount Condition"),
							cls : 'f13 ux_font-size14 ux_padding0060'
						}, {
							xtype : 'container',
							layout : 'hbox',
							itemId : 'amountConditionContainer',
							items : [{
										xtype : 'combo',
										itemId : 'amountConditionCombo',
										store : amountValTypeStore,
										queryMode : 'local',
										fieldCls : 'xn-form-field',
										editable : false,
										triggerBaseCls : 'xn-form-trigger',
										displayField : 'amountTypeDesc',
										valueField : 'amountVal',
										value : getLabel('select', 'Select'),
										listeners:{
											'select': function(combo, records, eOpts ){
												me.fireEvent('setEnabledAmount',records);
											}
										}
									}]
						}]
			}, {
				xtype : 'numberfield',
				hideTrigger : true,
				flex : 1,
				itemId : 'amount',
				labelAlign : 'top',
				labelSeparator : '',
				fieldLabel : getLabel('amount', 'Amount'),
				fieldCls : 'xn-field-amount w165',
				cls : 'ux_paddingb',
				name : 'amount',
				decimalPrecision : 4,
				maxLength : 16,
				disabled : true,
				enforceMaxLength : true,
				enableKeyEvents : true,
				msgTarget : 'under'
			}, {
				xtype : 'checkbox',
				itemId : 'voidCheckBox',
				flex : 1,
				cls : 'f13 ux_font-size14 ux_padding0060',
				padding : '20 0 0 0',
				labelSeparator : '',
				boxLabel : getLabel('void', 'Void'),
				labelAlign : 'right',
				name : 'void'
			}]
		}, {
			xtype : 'container',
			cls : 'ux_padding-top-18',
			layout : {
				type : 'hbox'
			},
			items : [{
						xtype : 'textfield',
						margin : '0 70 0 0',
						// width : 265,
						flex : 1,
						itemId : 'payeeName',
						fieldCls : 'xn-form-text',
						labelAlign : 'top',
						labelCls : 'f13 ux_font-size14 ux_padding0060',
						defaultAlign : 'right',
						labelSeparator : '',
						name : 'payeeName',
						fieldLabel : getLabel('payee', 'Payee'),
						cls : 'ux_paddingb',
						labelWidth : 150,
						maxLength : 35,
						enforceMaxLength : true,
						enableKeyEvents : true,
						msgTarget : 'under',
						maskRe :/^[a-zA-Z0-9\s]+$/
					}]
		}, {
			xtype : 'container',
			cls : 'ux_padding-top-18',
			layout : {
				type : 'hbox'
			},
			items : [{
						xtype : 'textfield',
						margin : '0 70 0 0',
						// width : 265,
						flex : 1,
						itemId : 'description',
						fieldCls : 'xn-form-text',
						labelAlign : 'top',
						labelCls : 'f13 ux_font-size14 ux_padding0060',
						defaultAlign : 'right',
						labelSeparator : '',
						name : 'description',
						fieldLabel : getLabel('description', 'Description'),
						cls : 'ux_paddingb',
						labelWidth : 150,
						maxLength : 35,
						enforceMaxLength : true,
						enableKeyEvents : true,
						msgTarget : 'under',
						maskRe :/^[a-zA-Z0-9\s]+$/
					}]
		}, {
			xtype : 'container',
			cls : 'ux_padding-top-18',
			layout : {
				type : 'hbox'
			},
			items : [{
						xtype : 'textfield',
						margin : '0 70 0 0',
						width : 165,
						itemId : 'filterCode',
						fieldCls : 'xn-form-text',
						labelAlign : 'top',
						defaultAlign : 'right',
						labelSeparator : '',
						labelCls : 'f13 ux_font-size14 ux_padding0060',
						name : 'filterCode',
						fieldLabel : getLabel('filterCode', 'Filter Name'),
						cls : 'ux_paddingb',
						labelWidth : 150,
						maxLength : 20,
						enforceMaxLength : true,
						enableKeyEvents : true,
						msgTarget : 'under',
						maskRe :/^[a-zA-Z0-9\s]+$/
					}]
		}];

		me.dockedItems = [{
					xtype : 'container',
					height : 10,
					dock : 'top',
					items : [{
								xtype : 'label',
								cls : 'red',
								itemId : 'errorLabel',
								hidden : true
							}]
				}, {
					xtype : 'toolbar',
					padding : '10 0 0 0',
					dock : 'bottom',
					items : ['->', {
						xtype : 'button',
						cls : 'xn-button ux_button-background-color ux_search-button',
						text : getLabel('btnSearch', 'Search'),
						glyph : 'xf002@fontawesome',
						itemId : 'searchBtn',
						handler : function(btn) {
							me.fireEvent('handleSearchAction', btn);
						}
					}, {
						xtype : 'button',
						cls : 'xn-button ux_button-background-color ux_save-search-button',
						glyph : 'xf00e@fontawesome',
						text : getLabel('btnSaveAndSearch', 'Save and Search'),
						itemId : 'saveAndSearchBtn',
						handler : function(btn) {
							me.fireEvent('handleSaveAndSearchAction', btn);

						}
					}, {
						xtype : 'button',
						cls : 'xn-button ux_button-background-color ux_cancel-button',
						glyph : 'xf056@fontawesome',
						text : getLabel('btnCancel', 'Cancel'),
						itemId : 'cancelBtn',
						handler : function(btn) {
							me.fireEvent('closeFilterPopup', btn);

						}
					}, '->']
				}]

		this.callParent(arguments);
	},
	setValueComboTextFields : function(objOfCreateNewFilter, fieldName,
			fieldType, fieldVal) {

		var fieldObj = objOfCreateNewFilter.down('' + fieldType + '[itemId="'
				+ fieldName + '"]');

		if (!Ext.isEmpty(fieldObj)) {
			if (fieldType == "label")
				fieldObj.setText(fieldVal);
			else
				fieldObj.setValue(fieldVal);
		}
	},
	getAdvancedFilterValueJson : function(FilterCodeVal, objOfCreateNewFilter,
			forSavePurpose) {
		var objJson = null;
		var jsonArray = [];

		// Corporation
		if ((!Ext.isEmpty(objOfCreateNewFilter))
				&& (!Ext.isEmpty(objOfCreateNewFilter
						.down('menu[itemId="corporationMenu"]')))) {
			var corporationMenuRef = objOfCreateNewFilter
					.down('menu[itemId="corporationMenu"]');

			var itemArray = corporationMenuRef.items.items;
			var corporationValues = '';
			for (var index = 0; index < itemArray.length; index++) {
				if (itemArray[index].checked) {
					if (Ext.isEmpty(corporationValues))
						corporationValues = itemArray[index].codeVal;
					else
						corporationValues = corporationValues + ","
								+ itemArray[index].codeVal;
				}
			}
		}
		if (!Ext.isEmpty(corporationValues)) {
			jsonArray.push({
						field : 'corporationId',
						operator : 'in',
						value1 : encodeURIComponent(corporationValues.replace(new RegExp("'", 'g'), "\''")),
						value2 : '',
						dataType : 0,
						displayType : 6
					});
		}

		// Client
		if ((!Ext.isEmpty(objOfCreateNewFilter))
				&& (!Ext.isEmpty(objOfCreateNewFilter
						.down('menu[itemId="clientMenu"]')))) {

			var clientMenuRef = objOfCreateNewFilter
					.down('menu[itemId="clientMenu"]');

			var itemArray = clientMenuRef.items.items;
			var clientValues = '';
			for (var index = 0; index < itemArray.length; index++) {
				if (itemArray[index].checked) {
					if (Ext.isEmpty(clientValues))
						clientValues = itemArray[index].codeVal;
					else
						clientValues = clientValues + ","
								+ itemArray[index].codeVal;
				}
			}
			if (Ext.isEmpty(clientValues)) {
			
			clientValues = FilterCodeVal;
			}
			
		
		}
		if (!Ext.isEmpty(clientValues)) {
			jsonArray.push({
						field : 'clientId',
						operator : 'in',
						value1 : encodeURIComponent(clientValues.replace(new RegExp("'", 'g'), "\''")),
						value2 : '',
						dataType : 0,
						displayType : 6
					});
		}

		// Account

		if ((!Ext.isEmpty(objOfCreateNewFilter))
				&& (!Ext.isEmpty(objOfCreateNewFilter
						.down('menu[itemId="accountMenu"]')))) {

			var accountMenuRef = objOfCreateNewFilter
					.down('menu[itemId="accountMenu"]');

			var itemArray = accountMenuRef.items.items;
			var accountValues = '';
			for (var index = 0; index < itemArray.length; index++) {
				if (itemArray[index].checked) {
					if (Ext.isEmpty(accountValues))
						accountValues = itemArray[index].codeVal;
					else
						accountValues = accountValues + ","
								+ itemArray[index].codeVal;
				}
			}

		}
		if (!Ext.isEmpty(accountValues)) {
			jsonArray.push({
						field : 'accountNumber',
						operator : 'in',
						value1 : encodeURIComponent(accountValues.replace(new RegExp("'", 'g'), "\''")),
						value2 : '',
						dataType : 0,
						displayType : 6
					});
		}

		// IssueDate
		var issueDateBtnVal = null;
		var issuedateBtnRef = objOfCreateNewFilter
				.down('button[itemId="issueDateDropDown"]');
		if (!Ext.isEmpty(issuedateBtnRef)) {
			issueDateBtnVal = objOfCreateNewFilter
				.down('button[itemId="issueDateDropDown"]').dateIndex;
		}
		var issueDateFrom = objOfCreateNewFilter
				.down('datefield[itemId="issueDateFrom"]').getValue();
		var issueDateTo = objOfCreateNewFilter
				.down('datefield[itemId="issueDateTo"]').getValue();

		if (!Ext.isEmpty(issueDateFrom)) {

			if (!Ext.isEmpty(issueDateBtnVal)) {
				jsonArray.push({
							field : 'issuanceDate',
							dateIndexVal : issueDateBtnVal,
							operator : (!Ext.isEmpty(issueDateTo))
									? 'bt'
									: 'eq',
							value1 : Ext.util.Format.date(issueDateFrom,
									'Y-m-d'),
							value2 : (!Ext.isEmpty(issueDateTo))
									? Ext.util.Format
											.date(issueDateTo, 'Y-m-d')
									: '',
							dataType : 1,
							displayType : 5
						});
			}

		}

		// Status
		var statusCodeValString = objOfCreateNewFilter
				.down('combo[itemId="actionStatus"]').getValue();
		if (!Ext.isEmpty(statusCodeValString)) {
			jsonArray.push({
						field : 'actionStatus',
						operator : 'eq',
						value1 : statusCodeValString,
						value2 : '',
						dataType : 0,
						displayType : 6
					});
		}

		// Txn Status
		var txnStatusCodeValString = objOfCreateNewFilter
				.down('combo[itemId="txnStatus"]').getValue();
		if (!Ext.isEmpty(txnStatusCodeValString)) {
			jsonArray.push({
						field : 'txnStatus',
						operator : 'eq',
						value1 : txnStatusCodeValString,
						value2 : '',
						dataType : 0,
						displayType : 6
					});
		}

		// File Name
		var fileNameVal = objOfCreateNewFilter
				.down('textfield[itemId="fileName"]').getValue();
		if (!Ext.isEmpty(fileNameVal)) {
			jsonArray.push({
						field : 'fileName',
						operator : 'lk',
						value1 : encodeURIComponent(fileNameVal.replace(new RegExp("'", 'g'), "\''")),
						value2 : '',
						dataType : 0,
						displayType : 6
					});
		}

		// Void Flag
		var voidChecked = objOfCreateNewFilter
				.down('checkbox[itemId="voidCheckBox"]').checked;
		if (voidChecked)
			voidCheckedVal = 'Y';
		else
			voidCheckedVal = 'N';
		if (!Ext.isEmpty(voidCheckedVal)) {
			jsonArray.push({
						field : 'voidIndicator',
						operator : 'eq',
						value1 : voidCheckedVal,
						value2 : '',
						dataType : 0,
						displayType : 6
					});
		}

		// Amount
		var amountConditionVal = objOfCreateNewFilter
				.down('combo[itemId="amountConditionCombo"]').getValue();
		var amount = objOfCreateNewFilter.down('numberfield[itemId="amount"]')
				.getValue();
		if (!Ext.isEmpty(amount) && !Ext.isEmpty(amountConditionVal)) {
			jsonArray.push({
						field : 'amount',
						operator : amountConditionVal,
						value1 : amount,
						value2 : '',
						dataType : 2,
						displayType : 3
					});
		}

		// Payee
		var payeeVal = objOfCreateNewFilter.down('textfield[itemId="payeeName"]')
				.getValue();
		if (!Ext.isEmpty(payeeVal)) {
			jsonArray.push({
						field : 'payeeName',
						operator : 'lk',
						value1 : encodeURIComponent(payeeVal.replace(new RegExp("'", 'g'), "\''")),
						value2 : '',
						dataType : 0,
						displayType : 0
					});
		}

		// Description
		var descr = objOfCreateNewFilter
				.down('textfield[itemId="description"]').getValue();
		if (!Ext.isEmpty(descr)) {
			jsonArray.push({
						field : 'description',
						operator : 'lk',
						value1 : encodeURIComponent(descr.replace(new RegExp("'", 'g'), "\''")),
						value2 : '',
						dataType : 0,
						displayType : 0
					});
		}

		if (forSavePurpose) {
			objJson = {};
			objJson.filterBy = jsonArray;
			if (FilterCodeVal && !Ext.isEmpty(FilterCodeVal))
				objJson.filterCode = FilterCodeVal;
			if (!Ext.isEmpty(sessionSellerCode))
				objJson.sellerValue = sessionSellerCode;
		} else
			objJson = jsonArray;

		return objJson;
	},
	setAmounts : function(objOfCreateNewFilter, operator, data) {
		var amonutFieldRef = null;
		var amountConditionComboRef = null;
		if (!Ext.isEmpty(operator)) {
			amountConditionComboRef = objOfCreateNewFilter
					.down('combo[itemId="amountConditionCombo"]');

			amonutFieldRef = objOfCreateNewFilter
					.down('numberfield[itemId="amount"]');

			if (!Ext.isEmpty(data))
				amonutFieldRef.setValue(data);

			if (!Ext.isEmpty(operator))
				amountConditionComboRef.setValue(operator);
		}
	},
	checkUnCheckMenuItems : function(objOfCreateNewFilter, componentName, data) {
		var menuRef = null;
		var me = this;
		var actionsMenu = true;
		var clientContainer = null;

		if (componentName === 'corporation') {
			menuRef = objOfCreateNewFilter.down('menu[itemId=corporationMenu]');
		} else if (componentName === 'client') {
			menuRef = objOfCreateNewFilter.down('menu[itemId=clientMenu]');
		} else if (componentName === 'account') {
			menuRef = objOfCreateNewFilter.down('menu[itemId=accountMenu]');
		}

		if (!Ext.isEmpty(menuRef)) {
			var itemArray = menuRef.items.items;

			if (data === 'All') {
				for (var index = 0; index < itemArray.length; index++) {
					itemArray[index].setChecked(true);
				}
			} else {
				for (var index = 0; index < itemArray.length; index++) {
					itemArray[index].setChecked(false);
				}

				var dataArray = data.split(',');
				if (actionsMenu) {
					for (var dataIndex = 0; dataIndex < dataArray.length; dataIndex++) {
						for (var index = 1; index < itemArray.length; index++) {
							if (dataArray[dataIndex] == itemArray[index].codeVal) {
								itemArray[index].setChecked(true);
							}
						}
					}
				} else {
					for (var dataIndex = 0; dataIndex < dataArray.length; dataIndex++) {
						for (var index = 1; index < itemArray.length; index++) {
							if (dataArray[dataIndex] == itemArray[index].text) {
								itemArray[index].setChecked(true);
							}
						}
					}
				}
			}
		}
	},
	disableAllMenuItems : function(objOfCreateNewFilter, enableDisableFlag) {
		var me = this;
		var itemArray = null;

		var corporationMenuRef = objOfCreateNewFilter
				.down('menu[itemId=corporationMenu]');
		if (!Ext.isEmpty(corporationMenuRef)) {
			itemArray = corporationMenuRef.items.items;
			if (!Ext.isEmpty(itemArray)) {
				for (var index = 0; index < itemArray.length; index++) {
					itemArray[index].setDisabled(enableDisableFlag);
				}
			}
		}

		var clientMenuRef = objOfCreateNewFilter
				.down('menu[itemId=clientMenu]');
		if (!Ext.isEmpty(clientMenuRef)) {
			itemArray = clientMenuRef.items.items;
			if (!Ext.isEmpty(itemArray)) {
				for (var index = 0; index < itemArray.length; index++) {
					itemArray[index].setDisabled(enableDisableFlag);
				}
			}
		}

		var accountMenuRef = objOfCreateNewFilter
				.down('menu[itemId=accountMenu]');
		if (!Ext.isEmpty(accountMenuRef)) {
			itemArray = accountMenuRef.items.items;
			if (!Ext.isEmpty(itemArray)) {
				for (var index = 0; index < itemArray.length; index++) {
					itemArray[index].setDisabled(enableDisableFlag);
				}
			}
		}
	},
	setPreloadsOnAdvanceFilter : function(objCreateNewFilterPanel,
			dateFilterVal, fromDate, toDate, dateLabel, paymentTypeCode) {
		if (!Ext.isEmpty(dateFilterVal)) {
			var dateFilterLabel = '(' + dateLabel + ')';
			objCreateNewFilterPanel.down('label[itemId="processLbl"]')
					.setText(getLabel('processDate', 'Process Date') + ' '
							+ dateFilterLabel);

			if (dateFilterVal !== '7') {
				objCreateNewFilterPanel
						.down('container[name="processDateRange"]')
						.setVisible(false);

				if (dateFilterVal === '1' || dateFilterVal === '2') {

					objCreateNewFilterPanel
							.down('container[itemId=processDate] label[itemId="dateFilterFrom"]')
							.show();
					objCreateNewFilterPanel
							.down('container[itemId=processDate] label[itemId="dateFilterTo"]')
							.hide();
					objCreateNewFilterPanel
							.down('container[itemId=processDate] label[itemId="dateFilterFrom"]')
							.setText(fromDate);
				} else {
					objCreateNewFilterPanel
							.down('container[itemId=processDate] label[itemId="dateFilterFrom"]')
							.show();
					objCreateNewFilterPanel
							.down('container[itemId=processDate] label[itemId="dateFilterTo"]')
							.show();
					objCreateNewFilterPanel
							.down('container[itemId=processDate] label[itemId="dateFilterFrom"]')
							.setText(fromDate);
					objCreateNewFilterPanel
							.down('container[itemId=processDate] label[itemId="dateFilterTo"]')
							.setText(toDate);
				}
			} else {

				objCreateNewFilterPanel
						.down('container[itemId=processDate] label[itemId="dateFilterFrom"]')
						.hide();
				objCreateNewFilterPanel
						.down('container[itemId=processDate] label[itemId="dateFilterTo"]')
						.hide();
				objCreateNewFilterPanel
						.down('container[name="processDateRange"]')
						.setVisible(true);

				objCreateNewFilterPanel
						.down('datefield[itemId="processFromDate"]')
						.setValue(fromDate);
				objCreateNewFilterPanel
						.down('datefield[itemId="processToDate"]')
						.setValue(toDate);
			}

		}
		if (!Ext.isEmpty(paymentTypeCode))
			this.setRadioGroupValues(this, "ProductCategory", paymentTypeCode);
	},
	resetAllFields : function(objCreateNewFilterPanel) {
		var me = this;

		objCreateNewFilterPanel.down('textfield[itemId="corporationText"]')
				.reset();

		objCreateNewFilterPanel.down('textfield[itemId="clientText"]').reset();
		objCreateNewFilterPanel.down('textfield[itemId="accountText"]').reset();

		objCreateNewFilterPanel.down('textfield[itemId="issueDateText"]')
				.setValue(getLabel('latest', 'Latest'));
		objCreateNewFilterPanel.down('datefield[itemId="issueDateFrom"]')
				.reset();
		objCreateNewFilterPanel.down('datefield[itemId="issueDateTo"]').reset();

		objCreateNewFilterPanel.down('combo[itemId="actionStatus"]').reset();
		objCreateNewFilterPanel.down('combo[itemId="txnStatus"]').reset();
		objCreateNewFilterPanel.down('textfield[itemId="fileName"]').reset();

		objCreateNewFilterPanel.down('combo[itemId="amountConditionCombo"]')
				.reset();
		objCreateNewFilterPanel.down('numberfield[itemId="amount"]').reset();

		objCreateNewFilterPanel.down('checkbox[itemId="voidCheckBox"]')
				.setValue(false);

		objCreateNewFilterPanel.down('textfield[itemId="payeeName"]').reset();
		objCreateNewFilterPanel.down('textfield[itemId="description"]').reset();
		objCreateNewFilterPanel.down('textfield[itemId="filterCode"]').reset();

		var corporationMenu = objCreateNewFilterPanel
				.down('menu[itemId=corporationMenu]');
		objCreateNewFilterPanel.resetMenuItems(corporationMenu);
		var clientMenu = objCreateNewFilterPanel
				.down('menu[itemId=clientMenu]');
		objCreateNewFilterPanel.resetMenuItems(clientMenu);
		var accountMenu = objCreateNewFilterPanel
				.down('menu[itemId=accountMenu]');
		objCreateNewFilterPanel.resetMenuItems(accountMenu);

	},
	setSavedFilterDates : function(objCreateNewFilterPanel, data,
			formattedFromDate, formattedToDate) {
		if (!Ext.isEmpty(data)) {
			var me = this;
			var dateFilterFromRef = null;
			var dateFilterToRef = null;
			var menuRef = null;
			var dateOperator = data.operator;
			var dateIndexVal = data.dateIndexVal;

			if (!Ext.isEmpty(dateIndexVal)) {
				var issueDateText = objCreateNewFilterPanel
						.down('textfield[itemId="issueDateText"]');
				var fromDateField = objCreateNewFilterPanel
						.down('datefield[itemId="issueDateFrom"]');
				var toDateField = objCreateNewFilterPanel
						.down('datefield[itemId="issueDateTo"]');
				var issueDateDropDownRef = objCreateNewFilterPanel
						.down('button[itemId="issueDateDropDown"]');
				var menuItems = objCreateNewFilterPanel
						.down('menu[itemId="issuanceDateMenu"]');

				var itemMenu = menuItems
						.down("[btnValue=" + dateIndexVal + "]")
				if (!Ext.isEmpty(itemMenu)) {
					var textVal = itemMenu.text;
					issueDateText.setValue(textVal);
				}
				if (dateIndexVal === '1' || dateIndexVal === '2') {
					fromDateField.setValue(formattedFromDate);
					toDateField.setValue("");
				} else {
					fromDateField.setValue(formattedFromDate);
					toDateField.setValue(formattedToDate);
				}
			}

		} else {
			// console.log("Error Occured - date filter details found empty");
		}
	},
	disableAllDatesMenu : function(objCreateNewFilterPanel, disableFlag) {
		var me = this;
		var issueDateDropDownRef = objCreateNewFilterPanel
				.down('button[itemId="issueDateDropDown"]');

		if (!Ext.isEmpty(issueDateDropDownRef))
			issueDateDropDownRef.setDisabled(disableFlag);
	},
	resetMenuItems : function(menuRef) {
		if (!Ext.isEmpty(menuRef)) {
			var itemArray = menuRef.items.items;
			for (var index = 0; index < itemArray.length; index++) {
				itemArray[index].setChecked(false);
				itemArray[index].setDisabled(false);
			}
		}
	},
	enableDisableFields : function(objCreateNewFilterPanel, boolVal) {
		var me = this;
		objCreateNewFilterPanel.down('textfield[itemId="corporationText"]')
				.setDisabled(boolVal);

		objCreateNewFilterPanel.down('textfield[itemId="clientText"]')
				.setDisabled(boolVal);
		objCreateNewFilterPanel.down('textfield[itemId="accountText"]')
				.setDisabled(boolVal);

		objCreateNewFilterPanel.down('textfield[itemId="issueDateText"]')
				.setDisabled(boolVal);
		objCreateNewFilterPanel.down('datefield[itemId="issueDateFrom"]')
				.setDisabled(boolVal);
		objCreateNewFilterPanel.down('datefield[itemId="issueDateTo"]')
				.setDisabled(boolVal);

		objCreateNewFilterPanel.down('combo[itemId="actionStatus"]')
				.setDisabled(boolVal);
		objCreateNewFilterPanel.down('combo[itemId="txnStatus"]')
				.setDisabled(boolVal);
		objCreateNewFilterPanel.down('textfield[itemId="fileName"]')
				.setDisabled(boolVal);

		objCreateNewFilterPanel.down('combo[itemId="amountConditionCombo"]')
				.setDisabled(boolVal);
		objCreateNewFilterPanel.down('numberfield[itemId="amount"]')
				.setDisabled(boolVal);

		objCreateNewFilterPanel.down('checkbox[itemId="voidCheckBox"]')
				.setDisabled(boolVal);

		objCreateNewFilterPanel.down('textfield[itemId="payeeName"]')
				.setDisabled(boolVal);
		objCreateNewFilterPanel.down('textfield[itemId="description"]')
				.setDisabled(boolVal);
	},
	removeReadOnly : function(objCreateNewFilterPanel, boolVal) {
		var radioItemsCount = 0;
		var me = this;
		objCreateNewFilterPanel.down('textfield[itemId="corporationText"]')
				.setReadOnly(true);

		objCreateNewFilterPanel.down('textfield[itemId="clientText"]')
				.setReadOnly(true);
		objCreateNewFilterPanel.down('textfield[itemId="accountText"]')
				.setReadOnly(true);

		objCreateNewFilterPanel.down('textfield[itemId="issueDateText"]')
				.setReadOnly(true);

		objCreateNewFilterPanel.down('datefield[itemId="issueDateFrom"]')
				.setReadOnly(true);
		objCreateNewFilterPanel.down('datefield[itemId="issueDateTo"]')
				.setReadOnly(true);

		objCreateNewFilterPanel.down('combo[itemId="actionStatus"]')
				.setReadOnly(boolVal);
		objCreateNewFilterPanel.down('combo[itemId="txnStatus"]')
				.setReadOnly(boolVal);
		objCreateNewFilterPanel.down('textfield[itemId="fileName"]')
				.setReadOnly(boolVal);

		objCreateNewFilterPanel.down('combo[itemId="amountConditionCombo"]')
				.setReadOnly(boolVal);
		objCreateNewFilterPanel.down('numberfield[itemId="amount"]')
				.setReadOnly(boolVal);

		objCreateNewFilterPanel.down('checkbox[itemId="voidCheckBox"]')
				.setReadOnly(boolVal);

		objCreateNewFilterPanel.down('textfield[itemId="payeeName"]')
				.setReadOnly(boolVal);
		objCreateNewFilterPanel.down('textfield[itemId="description"]')
				.setReadOnly(boolVal);

		me.disableAllDatesMenu(objCreateNewFilterPanel, boolVal);
		me.disableAllMenuItems(objCreateNewFilterPanel, boolVal);
	}
});