Ext.define('GCP.view.activity.popup.ActivityCreateNewAdvFilter', {
	extend : 'Ext.panel.Panel',
	xtype : 'activityCreateNewAdvFilter',
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

		var sortByStore = Ext.create('Ext.data.Store', {
					fields : ['colId', 'colDesc']
				});
		var firstThenSortByStore = Ext.create('Ext.data.Store', {
					fields : ['colId', 'colDesc']
				});
		var secondThenSortByStore = Ext.create('Ext.data.Store', {
					fields : ['colId', 'colDesc']
				});

		var amountValTypeStore = Ext.create('Ext.data.Store', {
			fields : ['amountVal', 'amountTypeDesc'],
			data : [{
						"amountVal" : "",
						"amountTypeDesc" : getLabel('select', 'Select')
					}, {
						"amountVal" : "lt",
						"amountTypeDesc" : getLabel('lessThanEqTo',
								'Greater Than')
					}, {
						"amountVal" : "gt",
						"amountTypeDesc" : getLabel('moreThanEqTo', 'Less Than')
					}, {
						"amountVal" : "eq",
						"amountTypeDesc" : getLabel('equalTo', 'Equal To')
					}, {
						"amountVal" : "range",
						"amountTypeDesc" : getLabel('amtRange', 'Amount Range')
					}]
		});
		var records = [];
		var typeCodeStore = Ext.create('Ext.data.Store', {
			fields : ['txnCategory', 'typeCodes'],
			data: records
		});


		Ext.Ajax.request({
			url : 'services/userpreferences/'+strActivityPageName+'/transactionCategories.json',
			method : "GET",
			async : false,
			success : function(response) {
				if (!Ext.isEmpty(response.responseText)) {
					var data = Ext.decode(response.responseText);
					pref = Ext.decode(data.preference);
						if(pref !== null &&  typeof (pref) !==  'undefined'){
							records.push({
								txnCategory: getLabel('all','All'),
								typeCodes: ''
							})							
							Ext.each(pref, function(obj){
								records.push({
									txnCategory: obj.txnCategory,
									typeCodes: obj.typeCodes
								})
							});
							typeCodeStore.loadData(records);
						}
				}
			}
		});

		me.items = [{
			xtype : 'container',

			layout : 'hbox',
			flex : 1,
			items : [{
						xtype : 'checkbox',
						itemId : 'debitCheckBox',
						flex : 0.5,
						cls : 'f13 ux_font-size14 ux_padding0060',
						padding : '20 0 0 0',
						labelSeparator : '',
						checked : true,
						boxLabel : getLabel('debit', 'Debit'),
						labelAlign : 'right',
						name : 'debitCheckBox'
					}, {
						xtype : 'checkbox',
						itemId : 'creditCheckBox',
						flex : 1.5,
						cls : 'f13 ux_font-size14 ux_padding0060',
						padding : '20 0 0 0',
						labelSeparator : '',
						checked : true,
						boxLabel : getLabel('credit', 'Credit'),
						labelAlign : 'right',
						name : 'creditCheckBox'
					}, {
						xtype : 'checkbox',
						itemId : 'postedTxnsCheckBox',
						flex : 1,
						cls : 'f13 ux_font-size14 ux_padding0060',
						padding : '20 0 0 0',
						labelSeparator : '',
						checked : true,
						boxLabel : getLabel('postedTxns', 'Posted Transactions'),
						labelAlign : 'right',
						name : 'postedTxnsCheckBox'
					}, {
						xtype : 'checkbox',
						itemId : 'expectedTxnsCheckBox',
						flex : 1.5,
						cls : 'f13 ux_font-size14 ux_padding0060',
						padding : '20 0 0 0',
						labelSeparator : '',
						checked : true,
						boxLabel : getLabel('expectedTxns',
								'Expected Transactions'),
						labelAlign : 'right',
						name : 'expectedTxnsCheckBox'
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
					xtype : 'container',
					layout : 'hbox',
					items : [{
								xtype : 'label',
								itemId : 'amountLabel',
								name : 'amountLabel',
								text : getLabel('amount', 'Amount'),
								cls : 'f13 ux_font-size14 ux_padding0060'
							}, {
								xtype : 'button',
								border : 0,
								itemId : 'amountTypeBtn',
								name : 'amountTypeBtn',
								amtOperator : '',
								amtIndex : '',
								cls : 'menu-disable xn-custom-arrow-button cursor_pointer',
								glyph : 'xf0d7@fontawesome',
								menu : Ext.create('Ext.menu.Menu', {
											itemId : 'amountMenu',
											items : [{
												text : getLabel('eqTo',
												'Equal To'),
													btnId : 'btnEqTo',
													btnValue : 'eq',
													parent : this,
													handler : function(btn, opts) {
														me.fireEvent(
																'amountTypeChange',
																btn);
													}
												},{
												text : getLabel('lessThan',
														'Less Than'),
												btnId : 'btnLt',
												btnValue : 'lt',
												parent : this,
												handler : function(btn, opts) {
													me.fireEvent(
															'amountTypeChange',
															btn);
												}
											}, {
												text : getLabel(
														'greaterThan',
														'Greater Than'),
												btnId : 'btnGt',
												btnValue : 'gt',
												parent : this,
												handler : function(btn, opts) {
													me.fireEvent(
															'amountTypeChange',
															btn);
												}
											},  {
												text : getLabel('amtRange',
														'Amount Range'),
												btnId : 'btnAmtRange',
												btnValue : 'bt',
												parent : this,
												handler : function(btn, opts) {
													me.fireEvent(
															'amountTypeChange',
															btn);
												}
											}]
										})

							}]
				}, {
					xtype : 'numberfield',
					hideTrigger : true,
					itemId : 'amount',
					cls : 'ux_paddingb',
					name : 'amount',
					decimalPrecision : 4,
					maxLength : 16,
					enforceMaxLength : true,
					enableKeyEvents : true,
					msgTarget : 'under'
				},{
					xtype : 'container',
					height : 25,
					itemId : 'amountRangeContainer',
					items : [{
						xtype : 'container',
						itemId : 'amountRangeComponent',
						name : 'amountRange',
						layout : 'hbox',
						hidden : true,
						items : [{
							xtype : 'numberfield',
							itemId : 'amountFrom',
							name : 'amountFrom',
							hideTrigger : true,
							width : 100,
							fieldCls : 'h2',
							cls : 'date-range-font-size',
							padding : '0 3 0 0',
							//editable : false,
							fieldIndex : 'range',
							decimalPrecision : 4,
							maxLength : 16,
							enforceMaxLength : true,
							enableKeyEvents : true,
							msgTarget : 'under',
							listeners : {
								change : function(cmp, newVal) {
									me
											.fireEvent('filterAmountRange', cmp,
													newVal);
								}
							}
						}, {
							xtype : 'numberfield',
							itemId : 'amountTo',
							name : 'amountTo',
							hideTrigger : true,
							padding : '0 3 0 0',
							//editable : false,
							width : 100,
							fieldCls : 'h2',
							cls : 'date-range-font-size',
							fieldIndex : 'range',
							decimalPrecision : 4,
							maxLength : 16,
							enforceMaxLength : true,
							enableKeyEvents : true,
							msgTarget : 'under',
							listeners : {
								change : function(cmp, newVal) {
									me
											.fireEvent('filterAmountRange', cmp,
													newVal);
								}
							}
						}]
					}, {
						xtype : 'container',
						itemId : 'amountLabelsContainer',
						layout : 'hbox',
						items : [{
									xtype : 'label',
									itemId : 'amountRangeFilterFrom',
									name : 'amountRangeFilterFrom'
								}, {
									xtype : 'label',
									itemId : 'amountRangeFilterTo',
									name : 'amountRangeFilterTo'
								}]
					}]
				}]
			}, {
				xtype : 'container',
				layout : 'vbox',
				flex : 1,
				items : [{
					xtype : 'container',
					layout : 'hbox',
					items : [{
						xtype : 'label',
						itemId : 'postingDateLbl',
						name : 'postingDateLbl',
						text : getLabel('postingDate', 'Posting Date') + "("
								+ getLabel('latest', 'Latest') + ")",
						cls : 'f13 ux_font-size14 ux_padding0060'
					}, {
						xtype : 'button',
						border : 0,
						itemId : 'postingDateBtn',
						name : 'postingDateBtn',
						dateIndex : '',
						cls : 'menu-disable xn-custom-arrow-button cursor_pointer',
						glyph : 'xf0d7@fontawesome',
						menu : me.createDateMenu('postingDateMenu')
					}]
				}, {
					xtype : 'container',
					height : 25,
					itemId : 'postingDateRangeContainer',
					items : [{
						xtype : 'container',
						itemId : 'postingDateRangeComponent',
						name : 'postingDateRange',
						layout : 'hbox',
						hidden : true,
						items : [{
							xtype : 'datefield',
							itemId : 'postingFromDate',
							name : 'postingFromDate',
							hideTrigger : true,
							width : 70,
							fieldCls : 'h2',
							cls : 'date-range-font-size',
							padding : '0 3 0 0',
							editable : false,
							fieldIndex : '7',
							listeners : {
								change : function(cmp, newVal) {
									me
											.fireEvent('filterDateRange', cmp,
													newVal);
								}
							}
						}, {
							xtype : 'datefield',
							itemId : 'postingToDate',
							name : 'postingToDate',
							hideTrigger : true,
							padding : '0 3 0 0',
							editable : false,
							width : 70,
							fieldCls : 'h2',
							cls : 'date-range-font-size',
							fieldIndex : '7',
							listeners : {
								change : function(cmp, newVal) {
									me
											.fireEvent('filterDateRange', cmp,
													newVal);
								}
							}
						}]
					}, {
						xtype : 'container',
						itemId : 'postingDateLabelsContainer',
						layout : 'hbox',
						items : [{
									xtype : 'label',
									itemId : 'postingDateFilterFrom',
									name : 'postingDateFilterFrom'
								}, {
									xtype : 'label',
									itemId : 'postingDateFilterTo',
									name : 'postingDateFilterTo'
								}]
					}]
				}]
			}, {
				xtype : 'container',
				layout : 'vbox',
				flex : 1,
				items : [{
					xtype : 'container',
					layout : 'hbox',
					items : [{
						xtype : 'label',
						itemId : 'valueDateLbl',
						name : 'valueDateLbl',
						text : getLabel('valueDate', 'Value Date') + "("
								+ getLabel('latest', 'Latest') + ")",
						cls : 'f13 ux_font-size14 ux_padding0060'
					}, {
						xtype : 'button',
						border : 0,
						itemId : 'valueDateBtn',
						name : 'valueDateBtn',
						dateIndex : '',
						cls : 'menu-disable xn-custom-arrow-button cursor_pointer',
						glyph : 'xf0d7@fontawesome',
						menu : me.createDateMenu('valueDateMenu')
					}]
				}, {
					xtype : 'container',
					height : 25,
					itemId : 'valueDateRangeContainer',
					items : [{
						xtype : 'container',
						itemId : 'valueDateRangeComponent',
						name : 'valueDateRange',
						layout : 'hbox',
						hidden : true,
						items : [{
							xtype : 'datefield',
							itemId : 'valueFromDate',
							name : 'valueFromDate',
							hideTrigger : true,
							width : 70,
							fieldCls : 'h2',
							cls : 'date-range-font-size',
							padding : '0 3 0 0',
							editable : false,
							fieldIndex : '7',
							listeners : {
								change : function(cmp, newVal) {
									me
											.fireEvent('filterDateRange', cmp,
													newVal);
								}
							}
						}, {
							xtype : 'datefield',
							itemId : 'valueToDate',
							name : 'valueToDate',
							hideTrigger : true,
							padding : '0 3 0 0',
							editable : false,
							width : 70,
							fieldCls : 'h2',
							cls : 'date-range-font-size',
							fieldIndex : '7',
							listeners : {
								change : function(cmp, newVal) {
									me
											.fireEvent('filterDateRange', cmp,
													newVal);
								}
							}
						}]
					}, {
						xtype : 'container',
						itemId : 'valueDateLabelsContainer',
						layout : 'hbox',
						items : [{
									xtype : 'label',
									itemId : 'valueDateFilterFrom',
									name : 'valueDateFilterFrom'
								}, {
									xtype : 'label',
									itemId : 'valueDateFilterTo',
									name : 'valueDateFilterTo'
								}]
					}]
				}]
			}]
		}, {
			xtype : 'container',
			cls : 'ux_padding-top-18',
			layout : 'hbox',
			flex : 1,
			items : [{
						xtype : 'textfield',
						width : 165,
						itemId : 'typeCode',
						fieldCls : 'xn-form-text w165',
						flex : 1,
						labelAlign : 'top',
						labelCls : 'f13 ux_font-size14 ux_padding0060',
						labelSeparator : '',
						name : 'typeCode',
						fieldLabel : getLabel('typeCode', 'Type Code'),
						cls : 'ux_paddingb',
						labelWidth : 150,
						enforceMaxLength : true,
						enableKeyEvents : true,
						maxLength : 20,
						msgTarget : 'under'
					}, {
						xtype : 'container',
						layout : 'vbox',
						flex : 1,
						items : [{
									xtype : 'label',
									text : getLabel("typeCodeSet",
											"Type Code Set"),
									cls : 'f13 ux_font-size14 ux_padding0060'
								}, {
									xtype : 'combo',
									itemId : 'typeCodeSetCombo',
									name : 'typeCodeSetCombo',
									queryMode : 'local',
									fieldCls : 'xn-form-field',
									triggerBaseCls : 'xn-form-trigger',
									editable : false,
									store : typeCodeStore,
									displayField : 'txnCategory',
									valueField : 'typeCodes',
									emptyText : getLabel('select', 'Select')
								}]
					}, {
						xtype : 'checkbox',
						itemId : 'hasImageCheckBox',
						flex : 1,
						cls : 'f13 ux_font-size14 ux_padding0060',
						padding : '20 0 0 0',
						labelSeparator : '',
						boxLabel : getLabel('hasImage', 'Image Available'),
						labelAlign : 'right',
						name : 'hasImageCheckBox'
					}]
		}, {
			xtype : 'container',
			cls : 'ux_padding-top-18',
			layout : 'hbox',
			flex : 1,
			items : [{
						xtype : 'textfield',
						width : 155,
						itemId : 'bankReference',
						fieldCls : 'xn-form-text w165',
						flex : 1,
						labelAlign : 'top',
						labelCls : 'f13 ux_font-size14 ux_padding0060',
						labelSeparator : '',
						name : 'bankReference',
						fieldLabel : getLabel('bankReference', 'Bank Reference'),
						cls : 'ux_paddingb',
						labelWidth : 150,
						enforceMaxLength : true,
						enableKeyEvents : true,
						maxLength : 20,
						msgTarget : 'under'
					}, {
						xtype : 'textfield',
						width : 155,
						itemId : 'customerReference',
						fieldCls : 'xn-form-text w165',
						flex : 2,
						labelAlign : 'top',
						labelCls : 'f13 ux_font-size14 ux_padding0060',
						labelSeparator : '',
						name : 'customerReference',
						fieldLabel : getLabel('customerReference',
								'Client Reference'),
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
			layout : {
				type : 'hbox'
			},
			items : [{
						xtype : 'container',
						layout : 'vbox',
						flex : 2,
						items : [{
									xtype : 'label',
									text : getLabel('notes', 'Notes'),
									cls : 'f13 ux_font-size14 ux_padding0060'
								}, {
									xtype : 'textfield',
									width : 400,
									itemId : 'notes',
									name : 'notes',
									cls : 'ux_paddingb',
									labelWidth : 150,
									maxLength : 35,
									enforceMaxLength : true,
									enableKeyEvents : true,
									msgTarget : 'under',
									maskRe : /^[a-zA-Z0-9\s]+$/
								}]
					}, {
						xtype : 'checkbox',
						itemId : 'hasAttachmentCheckBox',
						flex : 1,
						cls : 'f13 ux_font-size14 ux_padding0060',
						padding : '20 0 0 0',
						// margin : '0 0 0 20',
						labelSeparator : '',
						boxLabel : getLabel('hasAttachment', 'Attachment Available'),
						labelAlign : 'right',
						name : 'hasAttachmentCheckBox'
					}]
		}, {
			xtype : 'container',
			flex : 1,
			layout : 'hbox',
			cls : 'ux_padding-top-18',
			items : [{
				xtype : 'container',
				flex : 1,
				layout : 'vbox',
				defaults : {
					labelAlign : 'top',
					labelSeparator : ''
				},
				items : [{
					xtype : 'container',
					layout : 'column',
					width : 165,
					items : [{
								xtype : 'label',
								columnWidth : 0.50,
								padding : '0 0 6 0',
								text : getLabel("sortBy", "Sort By"),
								cls : 'ux_font-size14'
							}, {
								xtype : 'button',
								itemId : 'sortByOptionButton',
								columnWidth : 0.50,
								text : getLabel("ascending", "Ascending"),
								cls : 'xn-account-filter-btnmenu',
								textAlign : 'right',
								handler : function(btn) {
									if (btn.getText() === getLabel("ascending",
											"Ascending"))
										btn.setText(getLabel("descending",
												"Descending"));
									else if (btn.getText() === getLabel(
											"descending", "Descending"))
										btn.setText(getLabel("ascending",
												"Ascending"));
								}
							}]

				}, {
					xtype : 'combo',
					itemId : 'sortByCombo',
					multiSelect : false,
					editable : false,
					margin : '0 0 0 0',
					width : 165,
					fieldCls : 'xn-form-field',
					triggerBaseCls : 'xn-form-trigger',
					displayField : 'colDesc',
					valueField : 'colId',
					queryMode : 'local',
					value : getLabel("none", "None"),
					store : sortByStore,
					listeners : {
						'select' : function(combo, record) {
							me.fireEvent('sortByComboSelect', combo, record);
						}
					}
				}]
			}, {
				xtype : 'container',
				flex : 1,
				layout : 'vbox',
				defaults : {
					labelAlign : 'top',
					labelSeparator : ''
				},
				items : [{
					xtype : 'container',
					layout : 'column',
					width : 165,
					items : [{
								xtype : 'label',
								columnWidth : 0.50,
								padding : '0 0 6 0',
								text : getLabel("thenSortBy", "Then Sort By"),
								cls : 'ux_font-size14'
							}, {
								xtype : 'button',
								itemId : 'firstThenSortByOptionButton',
								columnWidth : 0.50,
								text : getLabel("ascending", "Ascending"),
								cls : 'xn-account-filter-btnmenu',
								textAlign : 'right',
								handler : function(btn) {
									if (btn.getText() === getLabel("ascending",
											"Ascending"))
										btn.setText(getLabel("descending",
												"Descending"));
									else if (btn.getText() === getLabel(
											"descending", "Descending"))
										btn.setText(getLabel("ascending",
												"Ascending"));
								}
							}]

				}, {
					xtype : 'combo',
					itemId : 'firstThenSortByCombo',
					multiSelect : false,
					editable : false,
					width : 165,
					fieldCls : 'xn-form-field',
					triggerBaseCls : 'xn-form-trigger',
					displayField : 'colDesc',
					valueField : 'colId',
					value : getLabel("none", "None"),
					queryMode : 'local',
					disabled : true,
					store : firstThenSortByStore,
					listeners : {
						'select' : function(combo, record) {
							me.fireEvent('firstThenSortByComboSelect', combo,
									record);
						}
					}
				}]
			}, {
				xtype : 'container',
				flex : 1,
				layout : 'vbox',
				defaults : {
					labelAlign : 'top',
					labelSeparator : ''
				},
				items : [{
					xtype : 'container',
					layout : 'column',
					width : 165,
					items : [{
								xtype : 'label',
								columnWidth : 0.50,
								padding : '0 0 6 0',
								text : getLabel("thenSortBy", "Then Sort By"),
								cls : 'ux_font-size14'
							}, {
								xtype : 'button',
								itemId : 'secondThenSortByOptionButton',
								columnWidth : 0.50,
								text : getLabel("ascending", "Ascending"),
								cls : 'xn-account-filter-btnmenu',
								textAlign : 'right',
								handler : function(btn) {
									if (btn.getText() === getLabel("ascending",
											"Ascending"))
										btn.setText(getLabel("descending",
												"Descending"));
									else if (btn.getText() === getLabel(
											"descending", "Descending"))
										btn.setText(getLabel("ascending",
												"Ascending"));
								}
							}]

				}, {
					xtype : 'combo',
					itemId : 'secondThenSortByCombo',
					multiSelect : false,
					editable : false,
					margin : '0 0 3 3',
					width : 165,
					fieldCls : 'xn-form-field',
					triggerBaseCls : 'xn-form-trigger',
					displayField : 'colDesc',
					valueField : 'colId',
					value : getLabel("none", "None"),
					queryMode : 'local',
					disabled : true,
					store : secondThenSortByStore
				}]
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
						labelPad : '0 0 10 0',
						labelCls : 'f13 ux_font-size14',
						name : 'filterCode',
						fieldLabel : getLabel('filterCode', 'Filter Name'),
						cls : 'ux_paddingb',
						labelWidth : 150,
						maxLength : 20,
						enforceMaxLength : true,
						enableKeyEvents : true,
						msgTarget : 'under',
						maskRe : /^[a-zA-Z0-9\s]+$/
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
	createDateMenu : function(dateMenuId) {
		var me = this;
		var intFilterDays = !Ext.isEmpty(filterDays)
		? parseInt(filterDays,10)
		: '';
		
		var arrMenuItem = [];		
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
				arrMenuItem.push({
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
						}
					});
		if (intFilterDays >= 60 || Ext.isEmpty(intFilterDays))
			arrMenuItem.push({
						text : getLabel('lastMonthToDate', 'Last Month To Date'),
						btnId : 'btnLastmonth',
						btnValue : '6',
						parent : this,
						handler : function(btn, opts) {
							me.fireEvent('filterDateChange', btn, opts);
						}
					});
		 if (lastMonthOnlyFilter===true ||Ext.isEmpty(intFilterDays))
		   arrMenuItem.push({
				text : getLabel('lastmonthonly', 'Last Month Only'),
				btnId : 'btnLastmonthonly',
				btnValue : '17',
				handler : function(btn, opts) {
					$(document).trigger("filterDateChange",[filterType,btn,opts]);
					updateToolTip(filterType," (Last Month Only)");
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
						}});
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
			arrMenuItem.push( {
						text : getLabel('thisyear', 'This Year'),
						btnId : 'btnLastQuarterToDate',
						btnValue : '10',
						parent : this,
						handler : function(btn, opts) {
							me.fireEvent('filterDateChange', btn, opts);
						}
					});
		if (intFilterDays >= 730 || Ext.isEmpty(intFilterDays))
			arrMenuItem.push(
					 {
						text : getLabel('lastyeartodate', 'Last Year To Date'),
						btnId : 'btnYearToDate',
						btnValue : '11',
						parent : this,
						handler : function(btn, opts) {
							me.fireEvent('filterDateChange', btn, opts);
						}
					});
		arrMenuItem.push({
						text : getLabel('daterange', 'Date Range'),
						btnId : 'btnDateRange',
						btnValue : '7',
						parent : this,
						handler : function(btn, opts) {
							me.fireEvent('filterDateChange', btn, opts);
						}
					});
		var menuItems = Ext.create('Ext.menu.Menu', {
			itemId : dateMenuId,
			items :arrMenuItem
		});
		return menuItems;
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
	getAdvancedFilterValueJsonForSearch : function(objOfCreateNewFilter) {
		var objJson = null;
		var jsonArray = [];
		var sortByOption = 'asc';
		var firstThenSortByOption = 'asc';
		var secondThenSortByOption = 'asc';

		var typeCodeVal = objOfCreateNewFilter
				.down('textfield[itemId="typeCode"]').getValue();
		if (!Ext.isEmpty(typeCodeVal)) {
			jsonArray.push({
						field : 'typeCode',
						operator : 'eq',
						value1 : typeCodeVal,
						value2 : '',
						dataType : 0
					});
		}

		var bankRefVal = objOfCreateNewFilter
				.down('textfield[itemId="bankReference"]').getValue();
		if (!Ext.isEmpty(bankRefVal)) {
			jsonArray.push({
						field : 'bankReference',
						operator : 'lk',
						value1 : bankRefVal,
						value2 : '',
						dataType : 0
					});
		}

		var clientRefVal = objOfCreateNewFilter
				.down('textfield[itemId="customerReference"]').getValue();
		if (!Ext.isEmpty(clientRefVal)) {
			jsonArray.push({
						field : 'customerReference',
						operator : 'lk',
						value1 : clientRefVal,
						value2 : '',
						dataType : 0
					});
		}

		var notesVal = objOfCreateNewFilter.down('textfield[itemId="notes"]')
				.getValue();
		if (!Ext.isEmpty(notesVal)) {
			jsonArray.push({
						field : 'noteText',
						operator : 'lk',
						value1 : notesVal,
						value2 : '',
						dataType : 0
					});
		}

		// PostingDate
		var postingDateBtnVal = null;
		var postingDateBtnRef = objOfCreateNewFilter
				.down('button[itemId="postingDateBtn"]');
		if (!Ext.isEmpty(postingDateBtnRef)) {
			postingDateBtnVal = objOfCreateNewFilter
					.down('button[itemId="postingDateBtn"]').dateIndex;
		}
		if(postingDateBtnVal == 7){
			var postingDateFrom = null;
			var postingDateTo = null;
			postingDateFrom = objOfCreateNewFilter
				.down('datefield[itemId="postingFromDate"]').getValue();
			postingDateTo = objOfCreateNewFilter
				.down('datefield[itemId="postingToDate"]').getValue();
			var value1 = Ext.util.Format.date(postingDateFrom, 'Y-m-d');
			if (!Ext.isEmpty(postingDateBtnVal)) {
				jsonArray.push({
							field : 'postingDate',
							dateIndexVal : postingDateBtnVal,
							operator : (!Ext.isEmpty(postingDateTo)) ? 'bt' : 'eq',
							value1 : Ext.util.Format.date(postingDateFrom, 'Y-m-d'),
							value2 : (!Ext.isEmpty(postingDateTo))
									? Ext.util.Format.date(postingDateTo, 'Y-m-d')
									: '',
							dataType : 1,
							displayType : 5
						});
			}
		}else if(postingDateBtnVal != 0){
			var postingDateFrom = null;
			var postingDateTo = null;
			postingDateFrom = objOfCreateNewFilter
				.down('label[itemId="postingDateFilterFrom"]').text;
			postingDateTo = objOfCreateNewFilter
				.down('label[itemId="postingDateFilterTo"]').text;	
			
			var temp1 = postingDateFrom.split('-');
			var temp2 = postingDateTo.split('-');
			postingDateFrom = temp1[0];
			if(temp2.length > 1)
				postingDateTo = temp2[1];
			else
				postingDateTo = temp2[0];
				
			if (!Ext.isEmpty(postingDateBtnVal)) {
				jsonArray.push({
							field : 'postingDate',
							dateIndexVal : postingDateBtnVal,
							operator : (!Ext.isEmpty(postingDateTo)) ? 'bt' : 'eq',
							value1 : Ext.util.Format.date(postingDateFrom, 'Y-m-d'),
							value2 : (!Ext.isEmpty(postingDateTo))
									? Ext.util.Format.date(postingDateTo, 'Y-m-d')
									: '',
							dataType : 1,
							displayType : 5
						});
			}
		}
		// ValueDate
		var valueDateBtnVal = null;
		var valueDateBtnRef = objOfCreateNewFilter
				.down('button[itemId="valueDateBtn"]');
		if (!Ext.isEmpty(valueDateBtnRef)) {
			valueDateBtnVal = objOfCreateNewFilter
					.down('button[itemId="valueDateBtn"]').dateIndex;
		}
		if(valueDateBtnVal == 7 ){
			var valueDateFrom = null;
			var valueDateTo = null;
			valueDateFrom = objOfCreateNewFilter
				.down('datefield[itemId="valueFromDate"]').getValue();
			valueDateTo = objOfCreateNewFilter
				.down('datefield[itemId="valueToDate"]').getValue();
			var value1 = Ext.util.Format.date(valueDateFrom, 'Y-m-d');
			if (!Ext.isEmpty(valueDateBtnVal)) {
				jsonArray.push({
							field : 'valueDate',
							dateIndexVal : valueDateBtnVal,
							operator : (!Ext.isEmpty(valueDateTo)) ? 'bt' : 'eq',
							value1 : Ext.util.Format.date(valueDateFrom, 'Y-m-d'),
							value2 : (!Ext.isEmpty(valueDateTo))
									? Ext.util.Format.date(valueDateTo, 'Y-m-d')
									: '',
							dataType : 1,
							displayType : 5
						});
			}
		}else if(valueDateBtnVal != 0) {
			var valueDateFrom = null;
			var valueDateTo = null;
			valueDateFrom = objOfCreateNewFilter
				.down('label[itemId="valueDateFilterFrom"]').text;
			valueDateTo = objOfCreateNewFilter
				.down('label[itemId="valueDateFilterTo"]').text;
							
			var temp1 = valueDateFrom.split('-');
			var temp2 = valueDateTo.split('-');
			valueDateFrom = temp1[0];
			if(temp2.length > 1)
				valueDateTo = temp2[1];
			else
				valueDateTo = temp2[0];
			
			if (!Ext.isEmpty(valueDateBtnVal)) {
				jsonArray.push({
							field : 'valueDate',
							dateIndexVal : valueDateBtnVal,
							operator : (!Ext.isEmpty(valueDateTo)) ? 'bt' : 'eq',
							value1 : Ext.util.Format.date(valueDateFrom, 'Y-m-d'),
							value2 : (!Ext.isEmpty(valueDateTo))
									? Ext.util.Format.date(valueDateTo, 'Y-m-d')
									: '',
							dataType : 1,
							displayType : 5
						});
			}
		}

		// type Code Set
		var typeCodeValString = objOfCreateNewFilter
				.down('combo[itemId="typeCodeSetCombo"]').getValue();
		 if (!Ext.isEmpty(typeCodeValString)) {
		 jsonArray.push({
		 field : 'typeCode',
		 operator : 'eq',
		 value1 : typeCodeValString,
		 value2 : '',
		 dataType : 0,
		 displayType : 6
		 });
		 }
		
		var debitCreditCheckedVal = '';
		var debitChecked = objOfCreateNewFilter
				.down('checkbox[itemId="debitCheckBox"]').checked;
		var creditChecked = objOfCreateNewFilter
				.down('checkbox[itemId="creditCheckBox"]').checked;
		if (debitChecked && creditChecked)
			debitCreditCheckedVal = 'D,C';
		else if (debitChecked)
			debitCreditCheckedVal = 'D';
		else if (creditChecked)
			debitCreditCheckedVal = 'C';
			
		// Amount
		var amountOperator = objOfCreateNewFilter
				.down('button[itemId="amountTypeBtn"]').amtOperator;
		if(amountOperator == "")
			amountOperator = 'eq';
		if(debitCreditCheckedVal == 'C') { // Credit Amount
		
			//console.log('amountOperator = ' + amountOperator);
		if(amountOperator == 'bt') {
			var amountFrom = objOfCreateNewFilter.down('numberfield[itemId="amountFrom"]')
				.getValue();
			var amountTo = objOfCreateNewFilter.down('numberfield[itemId="amountTo"]')
				.getValue();
			if (!Ext.isEmpty(amountFrom) && !Ext.isEmpty(amountTo) 
					&& !Ext.isEmpty(amountOperator)) {
				jsonArray.push({
					field : 'amount',
					operator : amountOperator,
					value1 : amountFrom,
					value2 : amountTo,
					dataType : 2,
					displayType : 3
				});
			}
		} else {
			var amount = objOfCreateNewFilter.down('numberfield[itemId="amount"]')
					.getValue();
			if (!Ext.isEmpty(amount) && !Ext.isEmpty(amountOperator)) {
				jsonArray.push({
						field : 'amount',
						operator : amountOperator,
						value1 : amount,
						value2 : '',
						dataType : 2,
						displayType : 3
					});
			}
		}
		} else if(debitCreditCheckedVal == 'D') { //Debit Amount
			var amountOperator = objOfCreateNewFilter
				.down('button[itemId="amountTypeBtn"]').amtOperator;
			if(amountOperator == "")
				amountOperator = 'eq';
		if(amountOperator == 'bt') {
			var amountFrom = objOfCreateNewFilter.down('numberfield[itemId="amountFrom"]')
				.getValue();
				amountFrom = amountFrom * (-1);
			var amountTo = objOfCreateNewFilter.down('numberfield[itemId="amountTo"]')
				.getValue();
				amountTo = amountTo * (-1);
			if (!Ext.isEmpty(amountFrom) && !Ext.isEmpty(amountTo) 
					&& !Ext.isEmpty(amountOperator)) {
				jsonArray.push({
					field : 'amount',
					operator : amountOperator,
					value1 : amountTo,
					value2 : amountFrom,
					dataType : 2,
					displayType : 3
				});
			}
		} else {
			var amount = objOfCreateNewFilter.down('numberfield[itemId="amount"]')
					.getValue();
					amount = amount *(-1);
			var myOpr = amountOperator;
			/*if(amountOperator == "lteqto")
				myOpr = "gteqto";
			else if(amountOperator == "gteqto")
				myOpr = "lteqto";*/
			if (!Ext.isEmpty(amount) && !Ext.isEmpty(amountOperator)) {
				jsonArray.push({
						field : 'amount',
						operator : myOpr,
						value1 : amount,
						value2 : '',
						dataType : 2,
						displayType : 3
					});
			}
		}
		} else if(debitCreditCheckedVal == 'D,C') { // Credit amount and Debit amount
			var amountOperator = objOfCreateNewFilter
				.down('button[itemId="amountTypeBtn"]').amtOperator;
			if(amountOperator == "")
				amountOperator = 'eq';
			if(amountOperator != 'eqamt' &&
				amountOperator != 'btamt' &&
				amountOperator != 'lteqtoamt' &&
				amountOperator != 'gteqtoamt')
				var tempOpr = amountOperator + 'amt';
			else
				var tempOpr = amountOperator;
		if(tempOpr == 'btamt') {
			var amountFrom = objOfCreateNewFilter.down('numberfield[itemId="amountFrom"]')
				.getValue();
			var amountTo = objOfCreateNewFilter.down('numberfield[itemId="amountTo"]')
				.getValue();
			if (!Ext.isEmpty(amountFrom) && !Ext.isEmpty(amountTo) 
					&& !Ext.isEmpty(tempOpr)) {
				jsonArray.push({
					field : 'amount',
					operator : tempOpr,
					value1 : amountFrom,
					value2 : amountTo,
					dataType : 2,
					displayType : 3
				});
			}
		} else {
			var amount = objOfCreateNewFilter.down('numberfield[itemId="amount"]')
					.getValue();
			if (!Ext.isEmpty(amount) && !Ext.isEmpty(tempOpr)) {
				jsonArray.push({
						field : 'amount',
						operator : tempOpr,
						value1 : amount,
						value2 : '',
						dataType : 2,
						displayType : 3
					});
			}
		}
		}else { // No Credit, No Debit Amount
			var amountOperator = objOfCreateNewFilter
				.down('button[itemId="amountTypeBtn"]').amtOperator;
			if(amountOperator == "")
				amountOperator = 'eq';
		if(amountOperator == 'bt') {
			var amountFrom = objOfCreateNewFilter.down('numberfield[itemId="amountFrom"]')
				.getValue();
			var amountTo = objOfCreateNewFilter.down('numberfield[itemId="amountTo"]')
				.getValue();
			if (!Ext.isEmpty(amountFrom) && !Ext.isEmpty(amountTo) 
					&& !Ext.isEmpty(amountOperator)) {
				jsonArray.push({
					field : 'amount',
					operator : amountOperator,
					value1 : amountFrom,
					value2 : amountTo,
					dataType : 2,
					displayType : 3
				});
			}
		} else {
			var amount = objOfCreateNewFilter.down('numberfield[itemId="amount"]')
					.getValue();
			if (!Ext.isEmpty(amount) && !Ext.isEmpty(amountOperator)) {
				jsonArray.push({
						field : 'amount',
						operator : amountOperator,
						value1 : amount,
						value2 : '',
						dataType : 2,
						displayType : 3
					});
			}
		}
		}
		// DebitCredit Flag
		if (!Ext.isEmpty(debitCreditCheckedVal)) {
			jsonArray.push({
						field : 'debitCreditFlag',
						operator : 'in',
						value1 : debitCreditCheckedVal,
						value2 : '',
						dataType : 0,
						displayType : 6
					});
		}

		// Posted Txns Flag
		var postedTxnsChecked = objOfCreateNewFilter
				.down('checkbox[itemId="postedTxnsCheckBox"]').checked;
		var expectedTxnsChecked = objOfCreateNewFilter
				.down('checkbox[itemId="expectedTxnsCheckBox"]').checked;				
				
		var date = new Date(Ext.Date.parse(dtApplicationDate,
				strExtApplicationDateFormat));
		valueDateFrom = Ext.Date.format(date, 'Y-m-d');
		 		
		if(postedTxnsChecked && expectedTxnsChecked){
			jsonArray.push({
				field : 'valueDate',
				operator : 'lteqtoorgt',
				value1 : Ext.util.Format.date(valueDateFrom, 'Y-m-d'),
				value2 : '',
				dataType : 1,
				displayType : 5
			});
		 }
		 else if (postedTxnsChecked) {
			jsonArray.push({
				field : 'valueDate',
				operator : 'lteqto',
				value1 : Ext.util.Format.date(valueDateFrom, 'Y-m-d'),
				value2 : '',
				dataType : 1,
				displayType : 5
			});
		 }
		 else if (expectedTxnsChecked) {
			jsonArray.push({
				field : 'valueDate',
				operator : 'gt',
				value1 : Ext.util.Format.date(valueDateFrom, 'Y-m-d'),
				value2 : '',
				dataType : 1,
				displayType : 5
			});
		 }

		// hasImage Flag
		var hasImageCheckedVal = '';
		var hasImageChecked = objOfCreateNewFilter
				.down('checkbox[itemId="hasImageCheckBox"]').checked;
		if (hasImageChecked)
			hasImageCheckedVal = 'Y';
		else
			hasImageCheckedVal = 'N';
		 /*if (!Ext.isEmpty(hasImageCheckedVal)) {
		 jsonArray.push({
		 field : 'debitCreditFlag',
		 operator : 'eq',
		 value1 : hasImageCheckedVal,
		 value2 : '',
		 dataType : 0,
		 displayType : 6
		 });
		}*/

		// hasAttachment Flag
		var hasAttachmentCheckedVal = '';
		var hasAttachmentChecked = objOfCreateNewFilter
				.down('checkbox[itemId="hasAttachmentCheckBox"]').checked;
		if (hasAttachmentChecked)
			hasAttachmentCheckedVal = 'Y';
		else
			hasAttachmentCheckedVal = 'N';
		 /*if (!Ext.isEmpty(hasAttachmentCheckedVal)) {
		 jsonArray.push({
		 field : 'debitCreditFlag',
		 operator : 'eq',
		 value1 : hasAttachmentCheckedVal,
		 value2 : '',
		 dataType : 0,
		 displayType : 6
		 });
		 }*/

		// sortBySortOption
		var buttonText = objOfCreateNewFilter
				.down('button[itemId="sortByOptionButton"]').getText();
		if (buttonText !== getLabel("ascending", "Ascending"))
			sortByOption = 'desc';

		// firstThenSortBySortOption
		var buttonText = objOfCreateNewFilter
				.down('button[itemId="firstThenSortByOptionButton"]').getText();
		if (buttonText !== getLabel("ascending", "Ascending"))
			firstThenSortByOption = 'desc';

		// secondThenSortBySortOption
		var buttonText = objOfCreateNewFilter
				.down('button[itemId="secondThenSortByOptionButton"]')
				.getText();
		if (buttonText !== getLabel("ascending", "Ascending"))
			secondThenSortByOption = 'desc';

		// Sort By
		var sortByComboValue = objOfCreateNewFilter
				.down('combo[itemId="sortByCombo"]').getValue();
		if (!Ext.isEmpty(sortByComboValue) && sortByComboValue !== "None") {
			jsonArray.push({
						field : 'sortByCombo',
						operator : 'st',
						value1 : sortByComboValue,
						value2 : sortByOption,
						dataType : 0,
						displayType : 6
					});
		}

		// First Then Sort By
		var firstThenSortByComboValue = objOfCreateNewFilter
				.down('combo[itemId="firstThenSortByCombo"]').getValue();
		if (!Ext.isEmpty(firstThenSortByComboValue)
				&& firstThenSortByComboValue !== "None") {
			jsonArray.push({
						field : 'firstThenSortByCombo',
						operator : 'st',
						value1 : firstThenSortByComboValue,
						value2 : firstThenSortByOption,
						dataType : 0,
						displayType : 6
					});
		}

		// Second Then Sort By
		var secondThenSortByComboValue = objOfCreateNewFilter
				.down('combo[itemId="secondThenSortByCombo"]').getValue();
		if (!Ext.isEmpty(secondThenSortByComboValue)
				&& secondThenSortByComboValue !== "None") {
			jsonArray.push({
						field : 'secondThenSortByCombo',
						operator : 'st',
						value1 : secondThenSortByComboValue,
						value2 : secondThenSortByOption,
						dataType : 0,
						displayType : 6
					});
		}

		objJson = jsonArray;

		return objJson;
	},
	getAdvancedFilterJsonForFiltersSave : function(FilterCodeVal,
			objOfCreateNewFilter) {
		var objJson = null;
		var jsonArray = [];
		var sortByOption = 'asc';
		var firstThenSortByOption = 'asc';
		var secondThenSortByOption = 'asc';

		var typeCodeVal = objOfCreateNewFilter
				.down('textfield[itemId="typeCode"]').getValue();
		if (!Ext.isEmpty(typeCodeVal)) {
			jsonArray.push({
						field : 'typeCode',
						operator : 'eq',
						value1 : typeCodeVal,
						value2 : '',
						dataType : 0
					});
		}

		var bankRefVal = objOfCreateNewFilter
				.down('textfield[itemId="bankReference"]').getValue();
		if (!Ext.isEmpty(bankRefVal)) {
			jsonArray.push({
						field : 'bankReference',
						operator : 'lk',
						value1 : bankRefVal,
						value2 : '',
						dataType : 0
					});
		}

		var clientRefVal = objOfCreateNewFilter
				.down('textfield[itemId="customerReference"]').getValue();
		if (!Ext.isEmpty(clientRefVal)) {
			jsonArray.push({
						field : 'customerReference',
						operator : 'lk',
						value1 : clientRefVal,
						value2 : '',
						dataType : 0
					});
		}

		var notesVal = objOfCreateNewFilter.down('textfield[itemId="notes"]')
				.getValue();
		if (!Ext.isEmpty(notesVal)) {
			jsonArray.push({
						field : 'noteText',
						operator : 'lk',
						value1 : notesVal,
						value2 : '',
						dataType : 0
					});
		}

		// PostingDate
		var postingDateBtnVal = null;
		var postingDateBtnRef = objOfCreateNewFilter
				.down('button[itemId="postingDateBtn"]');
		if (!Ext.isEmpty(postingDateBtnRef)) {
			postingDateBtnVal = objOfCreateNewFilter
					.down('button[itemId="postingDateBtn"]').dateIndex;
		}
		if(postingDateBtnVal == 7){
			var postingDateFrom = null;
			var postingDateTo = null;
			postingDateFrom = objOfCreateNewFilter
				.down('datefield[itemId="postingFromDate"]').getValue();
			postingDateTo = objOfCreateNewFilter
				.down('datefield[itemId="postingToDate"]').getValue();
			var value1 = Ext.util.Format.date(postingDateFrom, 'Y-m-d');
			if (!Ext.isEmpty(postingDateBtnVal)) {
				jsonArray.push({
							field : 'postingDate',
							dateIndexVal : postingDateBtnVal,
							operator : (!Ext.isEmpty(postingDateTo)) ? 'bt' : 'eq',
							value1 : Ext.util.Format.date(postingDateFrom, 'Y-m-d'),
							value2 : (!Ext.isEmpty(postingDateTo))
									? Ext.util.Format.date(postingDateTo, 'Y-m-d')
									: '',
							dataType : 1,
							displayType : 5
						});
			}
		}else if(postingDateBtnVal != 0) {
			var postingDateFrom = null;
			var postingDateTo = null;
			postingDateFrom = objOfCreateNewFilter
				.down('label[itemId="postingDateFilterFrom"]').text;
			postingDateTo = objOfCreateNewFilter
				.down('label[itemId="postingDateFilterTo"]').text;
							
			var temp1 = postingDateFrom.split('-');
			var temp2 = postingDateTo.split('-');
			postingDateFrom = temp1[0];
			if(temp2.length > 1)
				postingDateTo = temp2[1];
			else
				postingDateTo = temp2[0];
			
			if (!Ext.isEmpty(postingDateBtnVal)) {
				jsonArray.push({
							field : 'postingDate',
							dateIndexVal : postingDateBtnVal,
							operator : (!Ext.isEmpty(postingDateTo)) ? 'bt' : 'eq',
							value1 : Ext.util.Format.date(postingDateFrom, 'Y-m-d'),
							value2 : (!Ext.isEmpty(postingDateTo))
									? Ext.util.Format.date(postingDateTo, 'Y-m-d')
									: '',
							dataType : 1,
							displayType : 5
						});
			}
		}

		// ValueDate
		var valueDateBtnVal = null;
		var valueDateBtnRef = objOfCreateNewFilter
				.down('button[itemId="valueDateBtn"]');
		if (!Ext.isEmpty(valueDateBtnRef)) {
			valueDateBtnVal = objOfCreateNewFilter
					.down('button[itemId="valueDateBtn"]').dateIndex;
		}
		if(valueDateBtnVal == 7){
			var valueDateFrom = null;
			var valueDateTo = null;
			valueDateFrom = objOfCreateNewFilter
				.down('datefield[itemId="valueFromDate"]').getValue();
			valueDateTo = objOfCreateNewFilter
				.down('datefield[itemId="valueToDate"]').getValue();
			var value1 = Ext.util.Format.date(valueDateFrom, 'Y-m-d');
			if (!Ext.isEmpty(valueDateBtnVal)) {
				jsonArray.push({
							field : 'valueDate',
							dateIndexVal : valueDateBtnVal,
							operator : (!Ext.isEmpty(valueDateTo)) ? 'bt' : 'eq',
							value1 : Ext.util.Format.date(valueDateFrom, 'Y-m-d'),
							value2 : (!Ext.isEmpty(valueDateTo))
									? Ext.util.Format.date(valueDateTo, 'Y-m-d')
									: '',
							dataType : 1,
							displayType : 5
						});
			}
		}else if(valueDateBtnVal != 0) {
			var valueDateFrom = null;
			var valueDateTo = null;
			valueDateFrom = objOfCreateNewFilter
				.down('label[itemId="valueDateFilterFrom"]').text;
			valueDateTo = objOfCreateNewFilter
				.down('label[itemId="valueDateFilterTo"]').text;
							
			var temp1 = valueDateFrom.split('-');
			var temp2 = valueDateTo.split('-');
			valueDateFrom = temp1[0];
			if(temp2.length > 1)
				valueDateTo = temp2[1];
			else
				valueDateTo = temp2[0];
			
			if (!Ext.isEmpty(valueDateBtnVal)) {
				jsonArray.push({
							field : 'valueDate',
							dateIndexVal : valueDateBtnVal,
							operator : (!Ext.isEmpty(valueDateTo)) ? 'bt' : 'eq',
							value1 : Ext.util.Format.date(valueDateFrom, 'Y-m-d'),
							value2 : (!Ext.isEmpty(valueDateTo))
									? Ext.util.Format.date(valueDateTo, 'Y-m-d')
									: '',
							dataType : 1,
							displayType : 5
						});
			}
		}
		
		// type Code Set
		var typeCodeValString = objOfCreateNewFilter
				.down('combo[itemId="typeCodeSetCombo"]').getValue();
		// if (!Ext.isEmpty(typeCodeValString)) {
		// jsonArray.push({
		// field : 'typeCode',
		// operator : 'eq',
		// value1 : typeCodeValString,
		// value2 : '',
		// dataType : 0,
		// displayType : 6
		// });
		// }

		// sortBySortOption
		var buttonText = objOfCreateNewFilter
				.down('button[itemId="sortByOptionButton"]').getText();
		if (buttonText !== getLabel("ascending", "Ascending"))
			sortByOption = 'desc';

		// firstThenSortBySortOption
		var buttonText = objOfCreateNewFilter
				.down('button[itemId="firstThenSortByOptionButton"]').getText();
		if (buttonText !== getLabel("ascending", "Ascending"))
			firstThenSortByOption = 'desc';

		// secondThenSortBySortOption
		var buttonText = objOfCreateNewFilter
				.down('button[itemId="secondThenSortByOptionButton"]')
				.getText();
		if (buttonText !== getLabel("ascending", "Ascending"))
			secondThenSortByOption = 'desc';

		// Sort By
		var sortByComboValue = objOfCreateNewFilter
				.down('combo[itemId="sortByCombo"]').getValue();
		if (!Ext.isEmpty(sortByComboValue) && sortByComboValue !== "None") {
			jsonArray.push({
						field : 'sortByCombo',
						operator : 'st',
						value1 : sortByComboValue,
						value2 : sortByOption,
						dataType : 0,
						displayType : 6
					});
		}

		// First Then Sort By
		var firstThenSortByComboValue = objOfCreateNewFilter
				.down('combo[itemId="firstThenSortByCombo"]').getValue();
		if (!Ext.isEmpty(firstThenSortByComboValue)
				&& firstThenSortByComboValue !== "None") {
			jsonArray.push({
						field : 'firstThenSortByCombo',
						operator : 'st',
						value1 : firstThenSortByComboValue,
						value2 : firstThenSortByOption,
						dataType : 0,
						displayType : 6
					});
		}

		// Second Then Sort By
		var secondThenSortByComboValue = objOfCreateNewFilter
				.down('combo[itemId="secondThenSortByCombo"]').getValue();
		if (!Ext.isEmpty(secondThenSortByComboValue)
				&& secondThenSortByComboValue !== "None") {
			jsonArray.push({
						field : 'secondThenSortByCombo',
						operator : 'st',
						value1 : secondThenSortByComboValue,
						value2 : secondThenSortByOption,
						dataType : 0,
						displayType : 6
					});
		}

		// Amount
		var debitCreditCheckedVal = '';
		var debitChecked = objOfCreateNewFilter
				.down('checkbox[itemId="debitCheckBox"]').checked;
		var creditChecked = objOfCreateNewFilter
				.down('checkbox[itemId="creditCheckBox"]').checked;
		if (debitChecked && creditChecked)
			debitCreditCheckedVal = 'D,C';
		else if (debitChecked)
			debitCreditCheckedVal = 'D';
		else if (creditChecked)
			debitCreditCheckedVal = 'C';
		
		if(debitCreditCheckedVal == 'C') { // Credit Amount
		var amountOperator = objOfCreateNewFilter
				.down('button[itemId="amountTypeBtn"]').amtOperator;
		if(amountOperator == "")
			amountOperator = 'eq';
			//console.log('amountOperator = ' + amountOperator);
		if(amountOperator == 'bt') {
			var amountFrom = objOfCreateNewFilter.down('numberfield[itemId="amountFrom"]')
				.getValue();
			var amountTo = objOfCreateNewFilter.down('numberfield[itemId="amountTo"]')
				.getValue();
			if (!Ext.isEmpty(amountFrom) && !Ext.isEmpty(amountTo) 
					&& !Ext.isEmpty(amountOperator)) {
				jsonArray.push({
					field : 'amount',
					operator : amountOperator,
					value1 : amountFrom,
					value2 : amountTo,
					dataType : 2,
					displayType : 3
				});
			}
		} else {
			var amount = objOfCreateNewFilter.down('numberfield[itemId="amount"]')
					.getValue();
			if (!Ext.isEmpty(amount) && !Ext.isEmpty(amountOperator)) {
				jsonArray.push({
						field : 'amount',
						operator : amountOperator,
						value1 : amount,
						value2 : '',
						dataType : 2,
						displayType : 3
					});
			}
		}
		} else if(debitCreditCheckedVal == 'D') { //Debit Amount
			var amountOperator = objOfCreateNewFilter
				.down('button[itemId="amountTypeBtn"]').amtOperator;
			if(amountOperator == "")
				amountOperator = 'eq';
		if(amountOperator == 'bt') {
			var amountFrom = objOfCreateNewFilter.down('numberfield[itemId="amountFrom"]')
				.getValue();
				amountFrom = amountFrom * (-1);
			var amountTo = objOfCreateNewFilter.down('numberfield[itemId="amountTo"]')
				.getValue();
				amountTo = amountTo * (-1);
			if (!Ext.isEmpty(amountFrom) && !Ext.isEmpty(amountTo) 
					&& !Ext.isEmpty(amountOperator)) {
				jsonArray.push({
					field : 'amount',
					operator : amountOperator,
					value1 : amountTo,
					value2 : amountFrom,
					dataType : 2,
					displayType : 3
				});
			}
		} else {
			var amount = objOfCreateNewFilter.down('numberfield[itemId="amount"]')
					.getValue();
					amount = amount *(-1);
			var myOpr = amountOperator;
			/*if(amountOperator == "lteqto")
				myOpr = "gteqto";
			else if(amountOperator == "gteqto")
				myOpr = "lteqto";*/
			if (!Ext.isEmpty(amount) && !Ext.isEmpty(amountOperator)) {
				jsonArray.push({
						field : 'amount',
						operator : myOpr,
						value1 : amount,
						value2 : '',
						dataType : 2,
						displayType : 3
					});
			}
		}
		} else if(debitCreditCheckedVal == 'D,C') { // Credit amount and Debit amount
			var amountOperator = objOfCreateNewFilter
				.down('button[itemId="amountTypeBtn"]').amtOperator;
			if(amountOperator == "")
			amountOperator = 'eq';
			if(amountOperator != 'eqamt' &&
				amountOperator != 'btamt' &&
				amountOperator != 'lteqtoamt' &&
				amountOperator != 'gteqtoamt')
				var tempOpr = amountOperator + 'amt';
			else
				var tempOpr = amountOperator;
		if(tempOpr == 'btamt') {
			var amountFrom = objOfCreateNewFilter.down('numberfield[itemId="amountFrom"]')
				.getValue();
			var amountTo = objOfCreateNewFilter.down('numberfield[itemId="amountTo"]')
				.getValue();
			if (!Ext.isEmpty(amountFrom) && !Ext.isEmpty(amountTo) 
					&& !Ext.isEmpty(tempOpr)) {
				jsonArray.push({
					field : 'amount',
					operator : tempOpr,
					value1 : amountFrom,
					value2 : amountTo,
					dataType : 2,
					displayType : 3
				});
			}
		} else {
			var amount = objOfCreateNewFilter.down('numberfield[itemId="amount"]')
					.getValue();
			if (!Ext.isEmpty(amount) && !Ext.isEmpty(tempOpr)) {
				jsonArray.push({
						field : 'amount',
						operator : tempOpr,
						value1 : amount,
						value2 : '',
						dataType : 2,
						displayType : 3
					});
			}
		}
		}else { // No Credit, No Debit Amount
			var amountOperator = objOfCreateNewFilter
				.down('button[itemId="amountTypeBtn"]').amtOperator;
				if(amountOperator == "")
			amountOperator = 'eq';
		if(amountOperator == 'bt') {
			var amountFrom = objOfCreateNewFilter.down('numberfield[itemId="amountFrom"]')
				.getValue();
			var amountTo = objOfCreateNewFilter.down('numberfield[itemId="amountTo"]')
				.getValue();
			if (!Ext.isEmpty(amountFrom) && !Ext.isEmpty(amountTo) 
					&& !Ext.isEmpty(amountOperator)) {
				jsonArray.push({
					field : 'amount',
					operator : amountOperator,
					value1 : amountFrom,
					value2 : amountTo,
					dataType : 2,
					displayType : 3
				});
			}
		} else {
			var amount = objOfCreateNewFilter.down('numberfield[itemId="amount"]')
					.getValue();
			if (!Ext.isEmpty(amount) && !Ext.isEmpty(amountOperator)) {
				jsonArray.push({
						field : 'amount',
						operator : amountOperator,
						value1 : amount,
						value2 : '',
						dataType : 2,
						displayType : 3
					});
			}
		}
		}
		
		// Debit Flag
		var debitCheckedVal = '';
		var debitChecked = objOfCreateNewFilter
				.down('checkbox[itemId="debitCheckBox"]').checked;
		if (debitChecked)
			debitCheckedVal = 'Y';
		else
			debitCheckedVal = 'N';
		if (!Ext.isEmpty(debitCheckedVal)) {
			jsonArray.push({
						field : 'debitFlag',
						operator : 'eq',
						value1 : debitCheckedVal,
						value2 : '',
						dataType : 0,
						displayType : 6
					});
		}

		// Credit Flag
		var creditCheckedVal = '';
		var creditChecked = objOfCreateNewFilter
				.down('checkbox[itemId="creditCheckBox"]').checked;
		if (creditChecked)
			creditCheckedVal = 'Y';
		else
			creditCheckedVal = 'N';
		if (!Ext.isEmpty(creditCheckedVal)) {
			jsonArray.push({
						field : 'creditFlag',
						operator : 'eq',
						value1 : creditCheckedVal,
						value2 : '',
						dataType : 0,
						displayType : 6
					});
		}

		// Posted Txns Flag
		var postedTxnsCheckedVal = '';
		var postedTxnsChecked = objOfCreateNewFilter
				.down('checkbox[itemId="postedTxnsCheckBox"]').checked;
		if (postedTxnsChecked)
			postedTxnsCheckedVal = 'Y';
		else
			postedTxnsCheckedVal = 'N';
		if (!Ext.isEmpty(postedTxnsCheckedVal)) {
			jsonArray.push({
						field : 'postedTxnsFlag',
						operator : 'lteqto',
						value1 : postedTxnsCheckedVal,
						value2 : '',
						dataType : 0,
						displayType : 6
					});
		}

		// Expected Txns Flag
		var expectedTxnsCheckedVal = '';
		var expectedTxnsChecked = objOfCreateNewFilter
				.down('checkbox[itemId="expectedTxnsCheckBox"]').checked;
		if (expectedTxnsChecked)
			expectedTxnsCheckedVal = 'Y';
		else
			expectedTxnsCheckedVal = 'N';
		if (!Ext.isEmpty(expectedTxnsCheckedVal)) {
			jsonArray.push({
						field : 'expectedTxnsFlag',
						operator : 'gt',
						value1 : expectedTxnsCheckedVal,
						value2 : '',
						dataType : 0,
						displayType : 6
					});
		}

		//hasImageFlag
		var hasImageCheckedVal = '';
		var hasImageChecked = objOfCreateNewFilter
				.down('checkbox[itemId="hasImageCheckBox"]').checked;
		if (hasImageChecked)
			hasImageCheckedVal = 'Y';
		else
			hasImageCheckedVal = 'N';
		if (!Ext.isEmpty(hasImageCheckedVal)) {
			jsonArray.push({
						field : 'hasImageFlag',
						operator : 'eq',
						value1 : hasImageCheckedVal,
						value2 : '',
						dataType : 0,
						displayType : 6
					});
		}
		
		// hasAttachmentFlag
		var hasAttachmentCheckedVal = '';
		var hasAttachmentChecked = objOfCreateNewFilter
				.down('checkbox[itemId="hasAttachmentCheckBox"]').checked;
		if (hasAttachmentChecked)
			hasAttachmentCheckedVal = 'Y';
		else
			hasAttachmentCheckedVal = 'N';
		if (!Ext.isEmpty(hasAttachmentCheckedVal)) {
			jsonArray.push({
						field : 'hasAttachmentFlag',
						operator : 'eq',
						value1 : hasAttachmentCheckedVal,
						value2 : '',
						dataType : 0,
						displayType : 6
					});
		}

		objJson = {};
		objJson.filterBy = jsonArray;
		if (FilterCodeVal && !Ext.isEmpty(FilterCodeVal))
			objJson.filterCode = FilterCodeVal;

		return objJson;
	},
	setAmounts : function(objOfCreateNewFilter, operator, data1, data2) {
		var amonutFieldRef = null;
		if (!Ext.isEmpty(operator)) {
			if(operator == 'eqamt')
				operator = 'eq';
			else if(operator == 'gteqtoamt')
				operator = 'gteqto';
			else if(operator == 'lteqtoamt')
				operator = 'lteqto';
			else if(operator == 'btamt')
				operator = 'bt';

			objOfCreateNewFilter
				.down('button[itemId="amountTypeBtn"]')
					.amtOperator = operator;

			var menuItems = objOfCreateNewFilter
					.down('menu[itemId="amountMenu"]');
			var itemMenu = menuItems.down("[btnValue=" + operator + "]")
			if (!Ext.isEmpty(itemMenu)) {
				var textVal = itemMenu.text;
				objOfCreateNewFilter.down('label[itemId="amountLabel"]')
						.setText(getLabel('amount', 'Amount') + "(" + textVal
								+ ")");
			}
			if(operator == 'bt' || operator == 'btamt'){
				objOfCreateNewFilter.down('numberfield[itemId="amount"]').hide();
				objOfCreateNewFilter.down('container[itemId="amountRangeComponent"]').show();
				amonutFromFieldRef = objOfCreateNewFilter
					.down('numberfield[itemId="amountFrom"]');
				amonutToFieldRef = objOfCreateNewFilter
					.down('numberfield[itemId="amountTo"]');

				if (!Ext.isEmpty(data1) && !Ext.isEmpty(data2)){
				amonutFromFieldRef.setValue(data1);
				amonutToFieldRef.setValue(data2);
				}
			}
			else{
				objOfCreateNewFilter.down('container[itemId="amountRangeComponent"]').hide();
				objOfCreateNewFilter.down('numberfield[itemId="amount"]').show();
				amonutFieldRef = objOfCreateNewFilter
					.down('numberfield[itemId="amount"]');

			if (!Ext.isEmpty(data1))
				amonutFieldRef.setValue(data1);
			}
		}
	},
	resetErrors : function(objOfCreateNewFilter) {
		var errorlabel = objOfCreateNewFilter
				.down('label[itemId="errorLabel"]');
		errorlabel.setText("");
		errorlabel.hide();
	},
	setCheckBoxes : function(objCreateNewFilterPanel, fieldName, fieldVal) {
		var boolVal = false;
		if (fieldVal == 'Y')
			boolVal = true;
		if (fieldName === 'debitFlag') {
			objCreateNewFilterPanel.down('checkbox[itemId="debitCheckBox"]')
					.setValue(boolVal);
		} else if (fieldName === 'creditFlag') {
			objCreateNewFilterPanel.down('checkbox[itemId="creditCheckBox"]')
					.setValue(boolVal);
		} else if (fieldName === 'postedTxnsFlag') {

			objCreateNewFilterPanel
					.down('checkbox[itemId="postedTxnsCheckBox"]')
					.setValue(boolVal);
		} else if (fieldName === 'expectedTxnsFlag') {
			objCreateNewFilterPanel
					.down('checkbox[itemId="expectedTxnsCheckBox"]')
					.setValue(boolVal);
		} else if (fieldName === 'hasImageFlag') {
			objCreateNewFilterPanel.down('checkbox[itemId="hasImageCheckBox"]')
					.setValue(boolVal);
		} else if (fieldName === 'hasAttachmentFlag') {
			objCreateNewFilterPanel
					.down('checkbox[itemId="hasAttachmentCheckBox"]')
					.setValue(boolVal);
		}
	},
	getDateParam : function(objCreateNewFilterPanel, index, dateType,
			dateHandler) {
		var me = this;
		var objDateHandler = dateHandler;
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
				// Date Range
				var frmDate, toDate;
				if (!Ext.isEmpty(dateType)) {

					if (dateType == "posting") {
						frmDate = objCreateNewFilterPanel
								.down('datefield[itemId=postingFromDate]')
								.getValue();
						toDate = objCreateNewFilterPanel
								.down('datefield[itemId=postingToDate]')
								.getValue();
					} else if (dateType == "value") {
						frmDate = objCreateNewFilterPanel
								.down('datefield[itemId=valueFromDate]')
								.getValue();
						toDate = objCreateNewFilterPanel
								.down('datefield[itemId=valueToDate]')
								.getValue();
					}
				} else {
					frmDate = me.getFromEntryDate().getValue();
					toDate = me.getToEntryDate().getValue();
				}
				frmDate = frmDate || date;
				toDate = toDate || frmDate;

				fieldValue1 = Ext.Date.format(frmDate, strSqlDateFormat);
				fieldValue2 = Ext.Date.format(toDate, strSqlDateFormat);
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
				// fieldValue1 = Ext.Date.format(date, strSqlDateFormat);
				// fieldValue2 = fieldValue1;
				// operator = 'le';
				break;
		}
		retObj.fieldValue1 = fieldValue1;
		retObj.fieldValue2 = fieldValue2;
		retObj.operator = operator;
		return retObj;
	},
	resetAllFields : function(objCreateNewFilterPanel) {
		var me = this;

		objCreateNewFilterPanel.down('textfield[itemId="typeCode"]').reset();

		objCreateNewFilterPanel.down('textfield[itemId="bankReference"]')
				.reset();
		objCreateNewFilterPanel.down('textfield[itemId="customerReference"]')
				.reset();

		objCreateNewFilterPanel.down('textfield[itemId="notes"]').reset();

		objCreateNewFilterPanel.down('label[itemId="postingDateLbl"]')
				.setText(getLabel('postingDate', 'Posting Date') + "(Latest)");

		objCreateNewFilterPanel
				.down('container[itemId="postingDateRangeComponent"]').hide();

		objCreateNewFilterPanel.down('label[itemId="postingDateFilterFrom"]')
				.setText("");
		objCreateNewFilterPanel.down('label[itemId="postingDateFilterTo"]')
				.setText("");

		objCreateNewFilterPanel.down('label[itemId="valueDateLbl"]')
				.setText(getLabel('valueDate', 'Value Date') + "(Latest)");
		objCreateNewFilterPanel.down('label[itemId="valueDateFilterFrom"]')
				.setText("");
		objCreateNewFilterPanel.down('label[itemId="valueDateFilterTo"]')
				.setText("");

		objCreateNewFilterPanel.down('datefield[itemId="postingFromDate"]')
				.reset();
		objCreateNewFilterPanel.down('datefield[itemId="postingToDate"]')
				.reset();

		objCreateNewFilterPanel.down('datefield[itemId="valueFromDate"]')
				.reset();
		objCreateNewFilterPanel.down('datefield[itemId="valueToDate"]').reset();

		objCreateNewFilterPanel.down('combo[itemId="typeCodeSetCombo"]')
				.reset();
		objCreateNewFilterPanel.down('combo[itemId="sortByCombo"]').reset();
		objCreateNewFilterPanel.down('combo[itemId="firstThenSortByCombo"]')
				.reset();
		objCreateNewFilterPanel.down('combo[itemId="secondThenSortByCombo"]')
				.reset();

		objCreateNewFilterPanel.down('numberfield[itemId="amount"]').reset();
		objCreateNewFilterPanel.down('numberfield[itemId="amountFrom"]').reset();
		objCreateNewFilterPanel.down('numberfield[itemId="amountTo"]').reset();
		
		objCreateNewFilterPanel.down('checkbox[itemId="debitCheckBox"]')
				.setValue(true);
		objCreateNewFilterPanel.down('checkbox[itemId="creditCheckBox"]')
				.setValue(true);
		objCreateNewFilterPanel.down('checkbox[itemId="postedTxnsCheckBox"]')
				.setValue(true);
		objCreateNewFilterPanel.down('checkbox[itemId="expectedTxnsCheckBox"]')
				.setValue(true);

		objCreateNewFilterPanel.down('checkbox[itemId="hasImageCheckBox"]')
				.setValue(false);
		objCreateNewFilterPanel
				.down('checkbox[itemId="hasAttachmentCheckBox"]')
				.setValue(false);

		objCreateNewFilterPanel.down('textfield[itemId="filterCode"]').reset();
	},
	setSavedFilterDates : function(fieldName, objCreateNewFilterPanel, data,
			formattedFromDate, formattedToDate) {
		if (!Ext.isEmpty(data)) {
			var me = this;
			var dateFilterFromRef = null;
			var dateFilterToRef = null;
			var menuRef = null;
			var dateOperator = data.operator;
			var dateIndexVal = data.dateIndexVal;

			var dateLbl = '';
			var fromDateField = '';
			var fromDateFieldLbl = '';
			var toDateField = '';
			var toDateFieldLbl = '';
			var menuItems = null;

			if (!Ext.isEmpty(dateIndexVal)) {

				if (fieldName == 'postingDate') {
					dateLbl = objCreateNewFilterPanel
							.down('label[itemId="postingDateLbl"]');
					fromDateField = objCreateNewFilterPanel
							.down('datefield[itemId="postingFromDate"]');
					toDateField = objCreateNewFilterPanel
							.down('datefield[itemId="postingToDate"]');
					fromDateFieldLbl = objCreateNewFilterPanel
							.down('label[itemId="postingDateFilterFrom"]');
					toDateFieldLbl = objCreateNewFilterPanel
							.down('label[itemId="postingDateFilterTo"]');
					menuItems = objCreateNewFilterPanel
							.down('menu[itemId="postingDateMenu"]');
				} else if (fieldName == 'valueDate') {
					dateLbl = objCreateNewFilterPanel
							.down('label[itemId="valueDateLbl"]');
					fromDateField = objCreateNewFilterPanel
							.down('datefield[itemId="valueFromDate"]');
					toDateField = objCreateNewFilterPanel
							.down('datefield[itemId="valueToDate"]');
					fromDateFieldLbl = objCreateNewFilterPanel
							.down('label[itemId="valueDateFilterFrom"]');
					toDateFieldLbl = objCreateNewFilterPanel
							.down('label[itemId="valueDateFilterTo"]');
					menuItems = objCreateNewFilterPanel
							.down('menu[itemId="valueDateMenu"]');
				}

				var itemMenu = menuItems
						.down("[btnValue=" + dateIndexVal + "]")
				if (!Ext.isEmpty(itemMenu)) {
					var textVal = itemMenu.text;

					if (fieldName == 'valueDate') {
						dateLbl.setText(getLabel('valueDate', 'Value Date')
								+ "(" + textVal + ")");
					} else if (fieldName == 'postingDate') {
						dateLbl.setText(getLabel('postingDate', 'Posting Date')
								+ "(" + textVal + ")");
					}

				}
				if (dateIndexVal === '0') {
					fromDateField.setValue("");
					toDateField.setValue("");
				} else {
					if (dateIndexVal != 7) {
						fromDateFieldLbl.setText(formattedFromDate);
						toDateFieldLbl.setText("-" + formattedToDate);
					} else {
						fromDateField.setValue(formattedFromDate);
						toDateField.setValue(formattedToDate);
					}
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

		objCreateNewFilterPanel.down('textfield[itemId="typeCode"]')
				.setDisabled(boolVal);
		objCreateNewFilterPanel.down('textfield[itemId="bankReference"]')
				.setDisabled(boolVal);
		objCreateNewFilterPanel.down('textfield[itemId="customerReference"]')
				.setDisabled(boolVal);
		objCreateNewFilterPanel.down('textfield[itemId="notes"]')
				.setDisabled(boolVal);
		objCreateNewFilterPanel.down('textfield[itemId="filterCode"]')
		.setDisabled(boolVal);

		objCreateNewFilterPanel.down('datefield[itemId="postingFromDate"]')
				.setDisabled(boolVal);
		objCreateNewFilterPanel.down('datefield[itemId="postingToDate"]')
				.setDisabled(boolVal);
		objCreateNewFilterPanel.down('datefield[itemId="valueFromDate"]')
				.setDisabled(boolVal);
		objCreateNewFilterPanel.down('datefield[itemId="valueToDate"]')
				.setDisabled(boolVal);

		objCreateNewFilterPanel.down('combo[itemId="typeCodeSetCombo"]')
				.setDisabled(boolVal);
		objCreateNewFilterPanel.down('combo[itemId="sortByCombo"]')
				.setDisabled(boolVal);
		objCreateNewFilterPanel.down('combo[itemId="firstThenSortByCombo"]')
				.setDisabled(boolVal);
		objCreateNewFilterPanel.down('combo[itemId="secondThenSortByCombo"]')
				.setDisabled(boolVal);

		objCreateNewFilterPanel.down('numberfield[itemId="amount"]')
				.setDisabled(boolVal);
		objCreateNewFilterPanel.down('numberfield[itemId="amountFrom"]')
				.setDisabled(boolVal);
		objCreateNewFilterPanel.down('numberfield[itemId="amountTo"]')
				.setDisabled(boolVal);

		objCreateNewFilterPanel.down('button[itemId="sortByOptionButton"]')
		.setDisabled(boolVal);
		objCreateNewFilterPanel.down('button[itemId="firstThenSortByOptionButton"]')
		.setDisabled(boolVal);
		objCreateNewFilterPanel.down('button[itemId="secondThenSortByOptionButton"]')
		.setDisabled(boolVal);
		
		objCreateNewFilterPanel.down('checkbox[itemId="debitCheckBox"]')
				.setDisabled(boolVal);
		objCreateNewFilterPanel.down('checkbox[itemId="creditCheckBox"]')
				.setDisabled(boolVal);
		objCreateNewFilterPanel.down('checkbox[itemId="postedTxnsCheckBox"]')
				.setDisabled(boolVal);
		objCreateNewFilterPanel.down('checkbox[itemId="expectedTxnsCheckBox"]')
				.setDisabled(boolVal);
		objCreateNewFilterPanel.down('checkbox[itemId="hasImageCheckBox"]')
				.setDisabled(boolVal);
		objCreateNewFilterPanel
				.down('checkbox[itemId="hasAttachmentCheckBox"]')
				.setDisabled(boolVal);
	},
	removeReadOnly : function(objCreateNewFilterPanel, boolVal) {
		var me = this;

		objCreateNewFilterPanel.down('textfield[itemId="typeCode"]')
				.setReadOnly(boolVal);
		objCreateNewFilterPanel.down('textfield[itemId="bankReference"]')
				.setReadOnly(boolVal);
		objCreateNewFilterPanel.down('textfield[itemId="customerReference"]')
				.setReadOnly(boolVal);
		objCreateNewFilterPanel.down('textfield[itemId="notes"]')
				.setReadOnly(boolVal);
		objCreateNewFilterPanel.down('textfield[itemId="filterCode"]')
				.setReadOnly(boolVal);

		objCreateNewFilterPanel.down('datefield[itemId="postingFromDate"]')
				.setReadOnly(boolVal);
		objCreateNewFilterPanel.down('datefield[itemId="postingToDate"]')
				.setReadOnly(boolVal);
		objCreateNewFilterPanel.down('datefield[itemId="valueFromDate"]')
				.setReadOnly(boolVal);
		objCreateNewFilterPanel.down('datefield[itemId="valueToDate"]')
				.setReadOnly(boolVal);

		objCreateNewFilterPanel.down('combo[itemId="typeCodeSetCombo"]')
				.setDisabled(boolVal);
		objCreateNewFilterPanel.down('combo[itemId="sortByCombo"]')
				.setDisabled(boolVal);
		objCreateNewFilterPanel.down('combo[itemId="firstThenSortByCombo"]')
				.setDisabled(boolVal);
		objCreateNewFilterPanel.down('combo[itemId="secondThenSortByCombo"]')
				.setDisabled(boolVal);

		objCreateNewFilterPanel.down('numberfield[itemId="amount"]')
				.setReadOnly(boolVal);
		objCreateNewFilterPanel.down('numberfield[itemId="amountFrom"]')
				.setReadOnly(boolVal);
		objCreateNewFilterPanel.down('numberfield[itemId="amountTo"]')
				.setReadOnly(boolVal);

		objCreateNewFilterPanel.down('checkbox[itemId="debitCheckBox"]')
				.setReadOnly(boolVal);
		objCreateNewFilterPanel.down('checkbox[itemId="creditCheckBox"]')
				.setReadOnly(boolVal);
		objCreateNewFilterPanel.down('checkbox[itemId="postedTxnsCheckBox"]')
				.setReadOnly(boolVal);
		objCreateNewFilterPanel.down('checkbox[itemId="expectedTxnsCheckBox"]')
				.setReadOnly(boolVal);
		objCreateNewFilterPanel.down('checkbox[itemId="hasImageCheckBox"]')
				.setReadOnly(boolVal);
		objCreateNewFilterPanel
				.down('checkbox[itemId="hasAttachmentCheckBox"]')
				.setReadOnly(boolVal);

	}
});