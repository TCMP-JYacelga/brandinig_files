Ext.define('GCP.view.PmtCreateNewAdvFilter', {
	extend : 'Ext.panel.Panel',
	xtype : 'pmtCreateNewAdvFilter',
	requires : ['Ext.data.Store', 'Ext.form.field.Number',
			'Ext.form.RadioGroup', 'Ext.container.Container',
			'Ext.layout.container.VBox', 'Ext.layout.container.HBox',
			'Ext.form.Label', 'Ext.form.field.Text', 'Ext.button.Button',
			'Ext.menu.Menu', 'Ext.form.field.Date',
			'Ext.layout.container.Column', 'Ext.form.field.ComboBox',
			'Ext.toolbar.Toolbar', 'Ext.ux.gcp.AutoCompleter'],
	callerParent : null,
	cls : 'filter-container-cls',
	minHeight : 390,
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

		var menuItems = [{
					text : getLabel('today', 'Today'),
					btnId : 'btnToday',
					btnValue : '1',
					parent : this,
					handler : function(btn, opts) {
						if (me.callerParent == 'pmtGridView') {
							me.fireEvent('gridFilterDateChange', btn, opts);
						} else if (me.callerParent == 'pmtstdView') {
							me.fireEvent('filterDateChange', btn, opts);
						}
					}
				}, {
					text : getLabel('yesterday', 'Yesterday'),
					btnId : 'btnYesterday',
					btnValue : '2',
					parent : this,
					handler : function(btn, opts) {
						if (me.callerParent == 'pmtGridView') {
							me.fireEvent('gridFilterDateChange', btn, opts);
						} else if (me.callerParent == 'pmtstdView') {
							me.fireEvent('filterDateChange', btn, opts);
						}
					}
				}, {
					text : getLabel('thisweek', 'This Week'),
					btnId : 'btnThisweek',
					btnValue : '3',
					parent : this,
					handler : function(btn, opts) {
						if (me.callerParent == 'pmtGridView') {
							me.fireEvent('gridFilterDateChange', btn, opts);
						} else if (me.callerParent == 'pmtstdView') {
							me.fireEvent('filterDateChange', btn, opts);
						}
					}
				}, {
					text : getLabel('lastweektodate', 'Last Week To Date'),
					btnId : 'btnLastweek',
					btnValue : '4',
					parent : this,
					handler : function(btn, opts) {
						if (me.callerParent == 'pmtGridView') {
							me.fireEvent('gridFilterDateChange', btn, opts);
						} else if (me.callerParent == 'pmtstdView') {
							me.fireEvent('filterDateChange', btn, opts);
						}
					}
				}, {
					text : getLabel('thismonth', 'This Month'),
					btnId : 'btnThismonth',
					btnValue : '5',
					parent : this,
					handler : function(btn, opts) {
						if (me.callerParent == 'pmtGridView') {
							me.fireEvent('gridFilterDateChange', btn, opts);
						} else if (me.callerParent == 'pmtstdView') {
							me.fireEvent('filterDateChange', btn, opts);
						}
					}
				}, {
					text : getLabel('lastMonthToDate', 'Last Month To Date'),
					btnId : 'btnLastmonth',
					btnValue : '6',
					parent : this,
					handler : function(btn, opts) {
						if (me.callerParent == 'pmtGridView') {
							me.fireEvent('gridFilterDateChange', btn, opts);
						} else if (me.callerParent == 'pmtstdView') {
							me.fireEvent('filterDateChange', btn, opts);
						}
					}
				}, {
					text : getLabel('thisquarter', 'This Quarter'),
					btnId : 'btnLastMonthToDate',
					btnValue : '8',
					parent : this,
					handler : function(btn, opts) {
						if (me.callerParent == 'pmtGridView') {
							me.fireEvent('gridFilterDateChange', btn, opts);
						} else if (me.callerParent == 'pmtstdView') {
							me.fireEvent('filterDateChange', btn, opts);
						}
					}
				}, {
					text : getLabel('lastQuarterToDate', 'Last Quarter To Date'),
					btnId : 'btnQuarterToDate',
					btnValue : '9',
					parent : this,
					handler : function(btn, opts) {
						if (me.callerParent == 'pmtGridView') {
							me.fireEvent('gridFilterDateChange', btn, opts);
						} else if (me.callerParent == 'pmtstdView') {
							me.fireEvent('filterDateChange', btn, opts);
						}
					}
				}, {
					text : getLabel('thisyear', 'This Year'),
					btnId : 'btnLastQuarterToDate',
					btnValue : '10',
					parent : this,
					handler : function(btn, opts) {
						if (me.callerParent == 'pmtGridView') {
							me.fireEvent('gridFilterDateChange', btn, opts);
						} else if (me.callerParent == 'pmtstdView') {
							me.fireEvent('filterDateChange', btn, opts);
						}
					}
				}, {
					text : getLabel('lastyeartodate', 'Last Year To Date'),
					btnId : 'btnYearToDate',
					btnValue : '11',
					parent : this,
					handler : function(btn, opts) {
						if (me.callerParent == 'pmtGridView') {
							me.fireEvent('gridFilterDateChange', btn, opts);
						} else if (me.callerParent == 'pmtstdView') {
							me.fireEvent('filterDateChange', btn, opts);
						}
					}
				}, {
					text : getLabel('daterange', 'Date Range'),
					btnId : 'btnDateRange',
					btnValue : '7',
					parent : this,
					handler : function(btn, opts) {
						if (me.callerParent == 'pmtGridView') {
							me.fireEvent('gridFilterDateChange', btn, opts);
						} else if (me.callerParent == 'pmtstdView') {
							me.fireEvent('filterDateChange', btn, opts);
						}
					}
				}];

		me.items = [{
			xtype : 'container',
			layout : 'hbox',
			padding : '0 0 0 5',
			items : [{
				xtype : 'container',
				flex : 2,
				layout : 'vbox',
				items : [{
					xtype : 'container',
					items : [{
						xtype : 'radiogroup',
						itemId : 'batchRadioGroup',
						items : [{
									boxLabel : getLabel('batchTabTitle',
											'Batch'),
									name : 'Batch',
									width : 60,
									checked : true,
									inputValue : 'B'
								}, {
									boxLabel : getLabel('instrument',
											'Instrument'),
									name : 'Batch',
									width : 90,
									inputValue : 'I'
								}]
					}]
				}]
			}, {
				xtype : 'container',
				flex : 1,
				layout : 'vbox',
				items : [{
					xtype : 'container',
					items : [{
						xtype : 'radiogroup',
						itemId : 'currencyRadioGroup',
						items : [{
									boxLabel : getLabel('all', 'All'),
									name : 'CrossCurrency',
									inputValue : 'All',
									width : 60,
									checked : true
								}, {
									boxLabel : getLabel('crossCurrency',
											'Cross Currency'),
									name : 'CrossCurrency',
									width : 110,
									inputValue : 'Y'
								}]
					}]
				}]
			}]

		}, {
			xtype : 'container',
			layout : 'hbox',
			padding : '0 0 0 5',
			items : [{
						xtype : 'container',
						flex : 2,
						items : [{
									xtype : 'radiogroup',
									itemId : 'productCategoryRadioGroup',
									// columns : [60, 90, 90, 90, 90, 90],
									items : []
								}]
					}, {
						xtype : 'container',
						flex : 1,
						items : [{
							xtype : 'radiogroup',
							itemId : 'CreditDebitFlag',
							items : [{
										boxLabel : getLabel('all', 'All'),
										name : 'CreditDebitFlag',
										inputValue : 'All',
										width : 60,
										checked : true
									}, {
										boxLabel : getLabel('debit', 'Debit'),
										name : 'CreditDebitFlag',
										width : 60,
										inputValue : 'D'
									}, {
										boxLabel : getLabel('credit', 'Credit'),
										name : 'CreditDebitFlag',
										width : 60,
										inputValue : 'C'
									}]
						}]
					}]

		}, {
			xtype : 'container',
			cls : 'ux_padding-top-18',
			layout : 'hbox',
			items : [{
				xtype : 'container',
				layout : 'vbox',
				flex : 1,
				items : [{
					xtype : 'label',
					text : getLabel("sendingAcctNo",
							"Sending Account"),
					cls : 'f13 ux_font-size14 ux_padding0060'
				}, {
					xtype : 'container',
					layout : 'hbox',
					itemId : 'sendingAccountContainer',
					items : [{
						xtype : 'textfield',
						itemId : 'AccountNo',
						width : 145,
						height : 25,
						fieldCls : 'ux_no-border-right',
						name : 'AccountNo',
						readOnly : true,
						value : getLabel('all', 'All')
					}, {
						xtype : 'button',
						border : 0,
						itemId : 'sendingAccountDropDown',
						cls: 'menu-disable xn-custom-arrow-button cursor_pointer ux_dropdown',
						height : 25,
						glyph:'xf0d7@fontawesome',
						padding : '6 0 0 0',
						menuAlign : 'tr-br',
						menu : Ext.create('Ext.menu.Menu', {
									itemId : 'sendingAccountMenu',
									width : 220,
									maxHeight : 200,
									items : []
								})
					}]
				}]
			},
			{
				xtype : 'AutoCompleter',
				flex : 1,
				fieldCls : 'xn-form-text w165 xn-suggestion-box',
				cls : 'ux_paddingb',
				labelAlign : 'top',
				labelSeparator : '',
				fieldLabel : getLabel("batchPopUpTemplateName", "Template Name"),
				itemId : 'TemplateName',
				name : 'TemplateName',
				cfgUrl : 'services/paymenttemplates.json',
				cfgRecordCount : -1,
				cfgSeekId : 'TemplateName',
				cfgRootNode : 'd.paymenttemplates',
				cfgDataNode1 : 'clientReference',
				cfgKeyNode : 'clientReference'
			},{
				xtype : 'container',
				layout : 'vbox',
				flex : 1,
				items : [{
					xtype : 'label',
					text : getLabel('products', 'Products'),
					cls : 'f13 ux_font-size14 ux_padding0060'
				}, {
					xtype : 'container',
					layout : 'hbox',
					itemId : 'myProductContainer',
					items : [{
								xtype : 'textfield',
								width : 145,
								height : 25,
							//	name : 'AccountNo',
								fieldCls : 'ux_no-border-right',
								itemId : 'ProductType',
								readOnly : true,
								productCodesData:'',
								name : 'ProductType',
								value : getLabel('all', 'All')
							}, {
								xtype : 'button',
								border : 0,
								itemId : 'myProductBtn',
								cls: 'menu-disable xn-custom-arrow-button cursor_pointer ux_dropdown',
								height : 25,
								glyph:'xf0d7@fontawesome',
								padding : '6 0 0 0',
								menuAlign : 'tr-br',
								menu : Ext.create('Ext.menu.Menu', {
											itemId : 'myProductMenu',
											width : 220,
											maxHeight : 200,
											items : []
										})
							}]
				}]
			}]
		}, {
			xtype : 'container',
			cls : 'ux_padding-top-18',
			layout : 'hbox',
			items : [{
				xtype : 'container',
				layout : 'vbox',
				flex : 1,
				items : [{
							xtype : 'label',
							text : getLabel('status', 'Status'),
							cls : 'f13 ux_font-size14 ux_padding0060'
						}, {
							xtype : 'container',
							layout : 'hbox',
							items : [{
								xtype : 'textfield',
								width : 145,
								height : 25,
							//	name : 'AccountNo',
								fieldCls : 'ux_no-border-right',
								itemId : 'Status',
								name : 'Status',
								codeValue : null,
								readOnly : true,
								value : getLabel('all', 'All')
							}, {
								xtype : 'button',
								border : 0,
								itemId : 'statusDropDown',
								cls: 'menu-disable xn-custom-arrow-button cursor_pointer ux_dropdown',
								height : 25,
								glyph:'xf0d7@fontawesome',
								padding : '6 0 0 0',
								menuAlign : 'tr-br',
								menu : Ext.create('Ext.menu.Menu', {
											itemId : 'statusMenu',
											width : 220,
											maxHeight : 200,
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
							text : getLabel('pendingAction', 'Pending Action'),
							cls : 'f13 ux_font-size14 ux_padding0060'
						}, {
							xtype : 'container',
							layout : 'hbox',
							itemId : 'pendingActionContainer',
							items : [{
								xtype : 'textfield',
								width : 145,
								height : 25,
							//	name : 'AccountNo',
								fieldCls : 'ux_no-border-right',
								itemId : 'Pending',
								name : 'Pending Action',
								codeValue : null,
								readOnly : true,
								value : getLabel('all', 'All')
							}, {
								xtype : 'button',
								border : 0,
								itemId : 'pendignActionDropDown',
								cls: 'menu-disable xn-custom-arrow-button cursor_pointer ux_dropdown',
								height : 25,
								glyph:'xf0d7@fontawesome',
								padding : '6 0 0 0',
								menuAlign : 'tr-br',
								menu : Ext.create('Ext.menu.Menu', {
											itemId : 'pendingActionMenu',
											width : 220,
											maxHeight : 200,
											items : []
										})
							}]
						}]
			}, 
			{
				xtype : 'textfield',
				flex : 1,
				labelAlign : 'top',
				labelSeparator : '',
				fieldCls : 'xn-form-text w165',
				cls : 'ux_paddingb',
				fieldLabel : getLabel("batchColumnClientReference",
						"Payment Reference"),
				itemId : 'ClientReference',
				name : 'ClientReference'
			}]
		}, {
			xtype : 'container',
			cls : 'ux_padding-top-18',
			layout : 'hbox',
			items : [
			{
				xtype : 'AutoCompleter',
				flex : 1,
				fieldCls : 'xn-form-text w165 xn-suggestion-box',
				cls : 'ux_paddingb',
				fieldLabel : getLabel("entryUser", "Entry User"),
				labelAlign : 'top',
				labelSeparator : '',
				itemId : 'Maker',
				name : 'Maker',
				cfgUrl : 'services/userseek/corpuser.json',
				cfgQueryParamName : '$autofilter',
				cfgRecordCount : -1,
				cfgSeekId : 'Maker',
				cfgRootNode : 'd.preferences',
				cfgDataNode1 : 'CODE',
				cfgDataNode2 : 'DESCR',
				cfgKeyNode : 'CODE'
			},
					{
				xtype : 'container',
				layout : 'vbox',
				flex : 1,
				items : [{
					xtype : 'container',
					layout : 'hbox',
					items : [{
						xtype : 'label',
						itemId : 'creationDateLbl',
						name : 'creationDateLbl',
						text : getLabel('creationDate', 'Creation Date'),
						cls : 'f13 ux_font-size14 ux_padding0060'
					}, {
						xtype : 'button',
						border : 0,
						itemId : 'creationDateBtn',
						name : 'creationDateBtn',
						cls: 'menu-disable xn-custom-arrow-button cursor_pointer',
						glyph:'xf0d7@fontawesome',
						padding : '6 0 0 3',
						menu : Ext.create('Ext.menu.Menu', {
									itemId : 'creationDateMenu',
									items : menuItems
								})

					}]
				}, {
					xtype : 'container',
					height : 25,
					itemId : 'creationDate',
					items : [{
						xtype : 'container',
						itemId : 'dateRangeComponent',
						name : 'creationDateRange',
						layout : 'hbox',
						hidden : true,
						items : [{
							xtype : 'datefield',
							itemId : 'creationFromDate',
							name : 'creationFromDate',
							hideTrigger : true,
							width : 70,
							fieldCls : 'h2',
							cls : 'date-range-font-size',
							padding : '0 3 0 0',
							editable : false,
							fieldIndex : '7',
							listeners : {
								change : function(cmp, newVal) {
									if (me.callerParent == 'pmtGridView') {
										me.fireEvent('gridFilterDateRange',
												cmp, newVal);
									} else if (me.callerParent == 'pmtstdView') {
										me.fireEvent('filterDateRange', cmp,
												newVal);
									}
								}
							}
						}, {
							xtype : 'datefield',
							itemId : 'creationToDate',
							name : 'creationToDate',
							hideTrigger : true,
							padding : '0 3 0 0',
							editable : false,
							width : 70,
							fieldCls : 'h2',
							cls : 'date-range-font-size',
							fieldIndex : '7',
							listeners : {
								change : function(cmp, newVal) {
									if (me.callerParent == 'pmtGridView') {
										me.fireEvent('gridFilterDateRange',
												cmp, newVal);
									} else if (me.callerParent == 'pmtstdView') {
										me.fireEvent('filterDateRange', cmp,
												newVal);
									}
								}
							}
						}]
					}, {
						xtype : 'container',
						itemId : 'CreateDate',
						layout : 'hbox',
						items : [{
									xtype : 'label',
									itemId : 'dateFilterFrom',
									name : 'dateFilterFrom'
								}, {
									xtype : 'label',
									itemId : 'dateFilterTo',
									name : 'dateFilterTo'
								}]
					}]
				}]
			},{
					xtype : 'container',
					padding : '28 0 0 0',
					flex:1,
					items:[
					{
						xtype : 'button',
						itemId : 'criteriaMoreButton',
						width : 105,
						region : 'east',
						iconCls : 'icon-expand-rounded ux_verysmallmargin-top',
						iconAlign:'right',
						cls : 'cursor_pointer xn-account-filter-btnmenu',
						componentCls : 'linkblue',
						collapsed : true,
						text:'More Criteria',
						textAlign:'left',
						handler : function(btn) {
							me.toggleView(btn.itemId,btn.collapsed);
						}
				}]
			}]
		}, 
		{
			xtype:'container',
			itemId:'criteriaPanel',
			cls : 'ux_padding-top-18',
			hidden:true,
			items:[{
			xtype : 'container',
			layout : 'hbox',
			items : [{
						xtype : 'AutoCompleter',
						flex : 1,
						labelAlign : 'top',
						labelSeparator : '',
						fieldCls : 'xn-form-text w165 xn-suggestion-box',
						cls : 'ux_paddingb',
						fieldLabel : getLabel('receiverId', 'Receiver Id'),
						itemId : 'ReceiverId',
						name : 'ReceiverId',
						// cfgUrl : 'services/userseek/BENEFICIARYSEEK.json',
						cfgQueryParamName : '$autofilter',
						cfgRecordCount : -1,
						cfgSeekId : 'ReceiverId',
						cfgRootNode : 'd.preferences',
						cfgDataNode1 : 'CODE',
						cfgDataNode2 : 'DESCR',
						cfgKeyNode : 'CODE'
					},{
						xtype : 'textfield',
						flex : 1,
						labelAlign : 'top',
						labelSeparator : '',
						fieldCls : 'xn-form-text w165',
						cls : 'ux_paddingb',
						fieldLabel : getLabel("instrumentsColumnReceiverName",
								"Receiver Name"),
						itemId : 'ReceiverName',
						name : 'ReceiverName',
						disabled : true
					},{
						xtype : 'textfield',
						flex : 1,
						labelAlign : 'top',
						labelSeparator : '',
						fieldCls : 'xn-form-text w165',
						cls : 'ux_paddingb',
						fieldLabel : getLabel("checkNumber", "Check Number"),
						itemId : 'CheckNumber',
						name : 'CheckNumber'
					}]
		},{
			xtype : 'container',
			cls : 'ux_padding-top-18',
			layout : 'hbox',
			items : [{
						xtype : 'AutoCompleter',
						fieldCls : 'xn-form-text w165 xn-suggestion-box',
						cls : 'ux_paddingb',
						flex : 1,
						labelAlign : 'top',
						labelSeparator : '',
						fieldLabel : getLabel("batchColumnChannel", "Channel"),
						itemId : 'Channel',
						name : 'Channel',
						cfgUrl : 'services/userseek/channelcodes.json',
						cfgQueryParamName : '$autofilter',
						cfgRecordCount : -1,
						cfgSeekId : 'Channel',
						cfgRootNode : 'd.preferences',
						cfgDataNode1 : 'CODE',
						cfgDataNode2 : 'DESCR',
						cfgKeyNode : 'CODE'

					},{
						xtype : 'AutoCompleter',
						flex : 1,
						labelAlign : 'top',
						labelSeparator : '',
						fieldCls : 'xn-form-text w165 xn-suggestion-box',
						cls : 'ux_paddingb',
						fieldLabel : getLabel("batchAdvFltFileName",
								"File Name"),
						itemId : 'FileName',
						name : 'FileName',
						cfgUrl : 'services/userseek/fileName.json',
						cfgQueryParamName : '$autofilter',
						cfgRecordCount : -1,
						cfgSeekId : 'FileName',
						cfgRootNode : 'd.preferences',
						cfgDataNode1 : 'CODE',
						cfgDataNode2 : 'DESCR',
						cfgKeyNode : 'CODE'
					},{
						xtype : 'container',
						layout : 'vbox',
						flex : 1,
						items : [{
							xtype : 'label',
							text : getLabel("companyId", "Company Id"),
							cls : 'f13 ux_font-size14 ux_padding0060'
						}, {
							xtype : 'container',
							layout : 'hbox',
							itemId : 'companyIdContainer',
							items : [{
								xtype : 'textfield',
								width : 145,
								height : 25,
								fieldCls : 'ux_no-border-right',
								itemId : 'CompanyID',
								name : 'CompanyID',
								readOnly : true,
								value : getLabel('all', 'All')
							}, {
								xtype : 'button',
								border : 0,
								itemId : 'companyIdDropDown',
								cls: 'menu-disable xn-custom-arrow-button cursor_pointer ux_dropdown',
								height : 25,
								glyph:'xf0d7@fontawesome',
								menuAlign : 'tr-br',
								menu : Ext.create(
										'Ext.menu.Menu', {
											itemId : 'companyIdMenu',
											width : 220,
											maxHeight : 200,
											items : []
										})
							}]
						}]
					}]
		},{
			xtype : 'container',
			cls : 'ux_padding-top-18',
			layout : 'hbox',
			items : [{
				xtype : 'numberfield',
				hideTrigger : true,
				flex : 1,
				labelAlign : 'top',
				labelSeparator : '',
				fieldLabel : getLabel('amountGreaterThan',
						'Amount Greater Than'),
				itemId : 'AmountGreaterThan',
				fieldCls : 'xn-field-amount w165',
				cls : 'ux_paddingb',
				name : 'Amount'
			},{
				xtype : 'numberfield',
				hideTrigger : true,
				flex : 1,
				labelAlign : 'top',
				labelSeparator : '',
				fieldLabel : getLabel('amountLessThan', 'Amount Less Than'),
				itemId : 'AmountLessThan',
				fieldCls : 'xn-field-amount w165',
				cls : 'ux_paddingb',
				name : 'Amount'
			},{
				xtype : 'numberfield',
				hideTrigger : true,
				flex : 1,
				labelAlign : 'top',
				labelSeparator : '',
				fieldLabel : getLabel('amountEqualTo', 'Amount Equal To'),
				itemId : 'AmountEqualTo',
				fieldCls : 'xn-field-amount w165',
				cls : 'ux_paddingb',
				name : 'Amount'
			}
			 ]
		},{
			xtype : 'container',
			cls : 'ux_padding-top-18',
			layout : 'hbox',
			items : [{
				xtype : 'container',
				layout : 'vbox',
				flex : 1,
				items : [{
					xtype : 'container',
					layout : 'hbox',
					items : [{
								xtype : 'label',
								itemId : 'processLbl',
								text : getLabel('processDate', 'Process Date'),
								cls : 'f13 ux_font-size14 ux_padding0060'
							}, {
								xtype : 'button',
								border : 0,
								itemId : 'processDateBtn',
								cls: 'menu-disable xn-custom-arrow-button cursor_pointer',
								glyph:'xf0d7@fontawesome',
								padding : '6 0 0 3',
								menu : Ext.create('Ext.menu.Menu', {
											itemId : 'processDateMenu',
											items : menuItems
										})

							}]
				}, {
					xtype : 'container',
					itemId : 'processDate',
					height : 25,
					layout : 'vbox',
					items : [{
						xtype : 'container',
						itemId : 'dateRangeComponent',
						name : 'processDateRange',
						layout : 'hbox',
						hidden : true,
						items : [{
							xtype : 'datefield',
							itemId : 'processFromDate',
							name : 'processFromDate',
							hideTrigger : true,
							width : 70,
							fieldCls : 'h2',
							cls : 'date-range-font-size',
							padding : '0 3 0 0',
							editable : false,
							fieldIndex : '7',
							listeners : {
								change : function(cmp, newVal) {
									if (me.callerParent == 'pmtGridView') {
										me.fireEvent('gridFilterDateRange',
												cmp, newVal);
									} else if (me.callerParent == 'pmtstdView') {
										me.fireEvent('filterDateRange', cmp,
												newVal);
									}
								}
							}
						}, {
							xtype : 'datefield',
							itemId : 'processToDate',
							name : 'processToDate',
							hideTrigger : true,
							padding : '0 3 0 0',
							editable : false,
							width : 70,
							fieldCls : 'h2',
							cls : 'date-range-font-size',
							fieldIndex : '7',
							listeners : {
								change : function(cmp, newVal) {
									if (me.callerParent == 'pmtGridView') {
										me.fireEvent('gridFilterDateRange',
												cmp, newVal);
									} else if (me.callerParent == 'pmtstdView') {
										me.fireEvent('filterDateRange', cmp,
												newVal);
									}
								}
							}
						}]
					}, {
						xtype : 'container',
						layout : 'hbox',
						itemId : 'EntryDate',
						padding : '0 0 0 3',
						items : [{
									xtype : 'label',
									itemId : 'dateFilterFrom',
									name : 'dateFilterFrom'
								}, {
									xtype : 'label',
									itemId : 'dateFilterTo',
									name : 'dateFilterTo'
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
						itemId : 'effectiveDateLbl',
						name : 'effectiveDateLbl',
						text : getLabel('batchColumnEffectiveDate',
								'Effective Date'),
						cls : 'f13 ux_font-size14 ux_padding0060'
					}, {
						xtype : 'button',
						border : 0,
						itemId : 'effectiveDateBtn',
						name : 'effectiveDateBtn',
						cls: 'menu-disable xn-custom-arrow-button cursor_pointer',
						glyph:'xf0d7@fontawesome',
						padding : '6 0 0 3',
						menu : Ext.create('Ext.menu.Menu', {
									itemId : 'effectiveDateMenu',
									items : menuItems
								})

					}]
				}, {
					xtype : 'container',
					itemId : 'effectiveDate',
					height : 25,
					layout : 'vbox',
					items : [{
						xtype : 'container',
						itemId : 'dateRangeComponent',
						name : 'effectiveDateRange',
						layout : 'hbox',
						hidden : true,
						items : [{
							xtype : 'datefield',
							itemId : 'effectiveFromDate',
							name : 'effectiveFromDate',
							hideTrigger : true,
							width : 70,
							fieldCls : 'h2',
							cls : 'date-range-font-size',
							padding : '0 3 0 0',
							editable : false,
							fieldIndex : '7',
							listeners : {
								change : function(cmp, newVal) {
									if (me.callerParent == 'pmtGridView') {
										me.fireEvent('gridFilterDateRange',
												cmp, newVal);
									} else if (me.callerParent == 'pmtstdView') {
										me.fireEvent('filterDateRange', cmp,
												newVal);
									}
								}
							}
						}, {
							xtype : 'datefield',
							itemId : 'effectiveToDate',
							name : 'effectiveToDate',
							hideTrigger : true,
							padding : '0 3 0 0',
							editable : false,
							width : 70,
							fieldCls : 'h2',
							cls : 'date-range-font-size',
							fieldIndex : '7',
							listeners : {
								change : function(cmp, newVal) {
									if (me.callerParent == 'pmtGridView') {
										me.fireEvent('gridFilterDateRange',
												cmp, newVal);
									} else if (me.callerParent == 'pmtstdView') {
										me.fireEvent('filterDateRange', cmp,
												newVal);
									}
								}
							}
						}]
					}, {
						xtype : 'container',
						layout : 'hbox',
						itemId : 'ActivationDate',
						name : 'ActivationDate',
						padding : '0 0 0 3',
						items : [{
									xtype : 'label',
									itemId : 'dateFilterFrom',
									name : 'dateFilterFrom'
								}, {
									xtype : 'label',
									itemId : 'dateFilterTo',
									name : 'dateFilterTo'
								}]
					}]
				}]
			}, {
				xtype : 'container',
				flex : 1
			}]
		},{
			xtype : 'container',
			padding : '18 0 0 0',
			layout : 'hbox',
			items : [{
				xtype : 'container',
				flex : 1,
				items : [{
					xtype : 'radiogroup',
					itemId : 'confidential',
					items : [{
								boxLabel : getLabel('all', 'All'),
								name : 'Confidential',
								inputValue : 'All',
								width : 60,
								checked : true
							}, {
								boxLabel : getLabel('iconBatchConfidential',
										'Confidential'),
								name : 'Confidential',
								width : 100,
								inputValue : 'Y'
							}]
				}]
			}, {
				xtype : 'container',
				flex : 1,
				items : [{
					xtype : 'radiogroup',
					itemId : 'Prenote',
					items : [{
								boxLabel : getLabel('all', 'All'),
								name : 'Prenote',
								inputValue : 'All',
								width : 60,
								checked : true
							}, {
								boxLabel : getLabel('withPreNotes',
										'with Pre-Notes'),
								name : 'Prenote',
								width : 110,
								inputValue : 'Y'
							}]
				}]
			}, {
					xtype : 'container',
					flex:1,
					items:[
					{
						xtype : 'button',
						itemId : 'criteriaLessButton',
						width : 95,
						margin : '0 0 0 0',
						region : 'east',
						iconCls : 'icon-collapse-rounded ux_verysmallmargin-top',
						iconAlign:'right',
						cls : 'cursor_pointer xn-account-filter-btnmenu',
						componentCls : 'linkblue',
						collapsed : true,
						text:'Less Criteria',
						textAlign:'left',
						handler : function(btn) {
							me.toggleView(btn.itemId,btn.collapsed);
						}
				}]
			}]
		}]
		}, {
			xtype : 'container',
			margin : '18 0 0 0',
			cls : 'ux_border-top-d0',
			layout : 'hbox',
			items : [{
				xtype : 'container',
				cls : 'ux_largepadding-top',
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
								cls : 'ux_font-size14',
								text : getLabel("sortBy", "Sort By")
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
							if (me.callerParent == 'pmtGridView') {
								me.fireEvent('gridSortByComboSelect', combo,
										record);
							} else if (me.callerParent == 'pmtstdView') {
								me
										.fireEvent('sortByComboSelect', combo,
												record);
							}
						}
					}
				}]
			}, {
				xtype : 'container',
				cls : 'ux_largepadding-top',
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
								cls : 'ux_font-size14',
								text : getLabel("thenSortBy", "Then Sort By")
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
							if (me.callerParent == 'pmtGridView') {
								me.fireEvent('gridFirstThenSortByComboSelect',
										combo, record);
							} else if (me.callerParent == 'pmtstdView') {
								me.fireEvent('firstThenSortByComboSelect',
										combo, record);
							}
						}
					}
				}]
			}, {
				xtype : 'container',
				cls : 'ux_largepadding-top',
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
								cls : 'ux_font-size14',
								text : getLabel("thenSortBy", "Then Sort By")
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
			padding : '18 0 0 0',
			items : [{
						xtype : 'textfield',
						itemId : 'filterCode',
						flex : 1,
						labelAlign : 'top',
						labelSeparator : '',
						name : 'filterCode',
						fieldLabel : getLabel('saveFilterAs', 'Save Filter As'),
						width : 165,
						cls : 'ux_paddingb',
						labelWidth : 150,
						enforceMaxLength : true,
						enableKeyEvents : true,
						maxLength : 20,
						msgTarget : 'under'
					}]
		}]

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
						glyph : 'xf002@fontawesome',
						text : getLabel('btnSearch', 'Search'),
						itemId : 'searchBtn',
						handler : function(btn) {
							if (me.callerParent == 'pmtGridView') {
								me.fireEvent('handleSearchActionGridView', btn);
							} else if (me.callerParent == 'pmtstdView') {
								me.fireEvent('handleSearchAction', btn);
							}
						}
					}, {
						xtype : 'button',
						cls : 'xn-button ux_button-background-color ux_save-search-button',
						glyph : 'xf00e@fontawesome',
						text : getLabel('btnSaveAndSearch', 'Save and Search'),
						itemId : 'saveAndSearchBtn',
						handler : function(btn) {
							if (me.callerParent == 'pmtGridView') {
								me.fireEvent('handleSaveAndSearchGridAction',
										btn);
							} else if (me.callerParent == 'pmtstdView') {
								me.fireEvent('handleSaveAndSearchAction', btn);
							}

						}
					}, {
						xtype : 'button',
						cls : 'xn-button ux_button-background-color ux_cancel-button',
						glyph : 'xf00d@fontawesome',
						text : getLabel('btnCancel', 'Cancel'),
						itemId : 'cancelBtn',
						handler : function(btn) {
							var popup = me
									.up('window[itemId="stdViewAdvancedFilter"]');
							if (popup)
								popup.close();
							/*
							 * if (me.callerParent == 'pmtGridView') {
							 * me.fireEvent('closeGridViewFilterPopup', btn); }
							 * else if (me.callerParent == 'pmtstdView') {
							 * me.fireEvent('closeFilterPopup', btn); }
							 */

						}
					},'->']
				}]

		this.callParent(arguments);
	},

	getAdvancedFilterValueJson : function(FilterCodeVal, objOfCreateNewFilter) {
		var objJson = null;
		var sortByOption = 'asc';
		var firstThenSortByOption = 'asc';
		var secondThenSortByOption = 'asc';
		var jsonArray = [];
		var clientContainer = objOfCreateNewFilter
				.up('tabpanel[itemId=advancedFilterTab]').getTabBar()
				.down('container[itemId=clientContainer]');

		// Seller
		if ((!Ext.isEmpty(clientContainer))
				&& (!Ext.isEmpty(clientContainer
						.down('AutoCompleter[itemId="sellerAutoCompleter"]'))))
			var seller = clientContainer
					.down('AutoCompleter[itemId="sellerAutoCompleter"]')
					.getValue();

		// Client
		var client = clientContainer.down('textfield[itemId="Client"]')
				.getValue();
		if (!Ext.isEmpty(client)) {
			jsonArray.push({
						field : 'Client',
						operator : 'in',
						value1 : client,
						value2 : '',
						dataType : 0,
						displayType : 6
					});
		}

		// Product Category
		var productCategoryValue = objOfCreateNewFilter
				.down('radiogroup[itemId="productCategoryRadioGroup"]')
				.getValue().ProductCategory;
		if (!Ext.isEmpty(productCategoryValue)) {
			jsonArray.push({
						field : 'ProductCategory',
						operator : 'eq',
						value1 : productCategoryValue,
						value2 : '',
						dataType : 0,
						displayType : 4
					});
		}

		// Currency
		var currencyValue = objOfCreateNewFilter
				.down('radiogroup[itemId="currencyRadioGroup"]').getValue().CrossCurrency;
		if (!Ext.isEmpty(currencyValue)) {
			jsonArray.push({
						field : 'CrossCurrency',
						operator : 'eq',
						value1 : currencyValue,
						value2 : '',
						dataType : 0,
						displayType : 4
					});
		}

		// Confidential
		var confidentialValue = objOfCreateNewFilter
				.down('radiogroup[itemId="confidential"]').getValue().Confidential;
		if (!Ext.isEmpty(confidentialValue)) {
			jsonArray.push({
						field : 'Confidential',
						operator : 'eq',
						value1 : confidentialValue,
						value2 : '',
						dataType : 0,
						displayType : 4
					});
		}

		// CreditDebitFlag
		var CreditDebitFlagValue = objOfCreateNewFilter
				.down('radiogroup[itemId="CreditDebitFlag"]').getValue().CreditDebitFlag;
		if (!Ext.isEmpty(CreditDebitFlagValue)) {
			jsonArray.push({
						field : 'CreditDebitFlag',
						operator : 'eq',
						value1 : CreditDebitFlagValue,
						value2 : '',
						dataType : 0,
						displayType : 4
					});
		}

		// Prenote
		var PrenoteValue = objOfCreateNewFilter
				.down('radiogroup[itemId="Prenote"]').getValue().Prenote;
		if (!Ext.isEmpty(CreditDebitFlagValue)) {
			jsonArray.push({
						field : 'Prenote',
						operator : 'eq',
						value1 : PrenoteValue,
						value2 : '',
						dataType : 0,
						displayType : 4
					});
		}

		// Status
		var StatusCodeValString = objOfCreateNewFilter
				.down('textfield[itemId="Status"]').codeValue;
		if (!Ext.isEmpty(StatusCodeValString)) {
			jsonArray.push({
						field : 'ActionStatus',
						operator : 'in',
						value1 : StatusCodeValString,
						value2 : '',
						dataType : 0,
						displayType : 6
					});
		}

		// Pending Action
		var PendingCodeValString = objOfCreateNewFilter
				.down('textfield[itemId="Pending"]').codeValue;
		if (!Ext.isEmpty(PendingCodeValString)) {
			jsonArray.push({
						field : 'PendingAction',
						operator : 'in',
						value1 : PendingCodeValString,
						value2 : '',
						dataType : 0,
						displayType : 6
					});
		}

		// Products
		var ProductType = objOfCreateNewFilter
				.down('textfield[itemId="ProductType"]').getValue();
		if (!Ext.isEmpty(ProductType)) {
			jsonArray.push({
						field : 'ProductType',
						operator : 'in',
						value1 : ProductType,
						value2 : '',
						dataType : 0,
						displayType : 6
					});
		}

		// sending account #
		var sendingAcctNo = objOfCreateNewFilter
				.down('textfield[itemId="AccountNo"]').getValue();
		if (!Ext.isEmpty(sendingAcctNo)) {
			jsonArray.push({
						field : 'AccountNo',
						operator : 'in',
						value1 : sendingAcctNo,
						value2 : '',
						dataType : 0,
						displayType : 0
					});
		}

		// Company Id (pending inputs)

		// receiver Id (pending inputs)

		// Amount greater than
		var amount = objOfCreateNewFilter
				.down('numberfield[itemId="AmountGreaterThan"]').getValue();
		if (!Ext.isEmpty(amount)) {
			jsonArray.push({
						field : 'Amount',
						operator : 'gt',
						value1 : amount,
						value2 : '',
						dataType : 2,
						displayType : 3
					});
		}

		// Amount less than
		var amount = objOfCreateNewFilter
				.down('numberfield[itemId="AmountLessThan"]').getValue();
		if (!Ext.isEmpty(amount)) {
			jsonArray.push({
						field : 'Amount',
						operator : 'lt',
						value1 : amount,
						value2 : '',
						dataType : 2,
						displayType : 3
					});
		}

		// Amount Equal To
		var amount = objOfCreateNewFilter
				.down('numberfield[itemId="AmountEqualTo"]').getValue();
		if (!Ext.isEmpty(amount)) {
			jsonArray.push({
						field : 'Amount',
						operator : 'eq',
						value1 : amount,
						value2 : '',
						dataType : 2,
						displayType : 3
					});
		}

		// Client or Payment Reference
		var PaymentRef = objOfCreateNewFilter
				.down('textfield[itemId="ClientReference"]').getValue();
		if (!Ext.isEmpty(PaymentRef)) {
			jsonArray.push({
						field : 'ClientReference',
						operator : 'lk',
						value1 : PaymentRef,
						value2 : '',
						dataType : 0,
						displayType : 0
					});
		}

		// Channel
		var Channel = objOfCreateNewFilter
				.down('AutoCompleter[itemId="Channel"]').getValue();
		if (!Ext.isEmpty(Channel)) {
			jsonArray.push({
						field : 'Channel',
						operator : 'eq',
						value1 : Channel,
						value2 : '',
						dataType : 0,
						displayType : 4
					});
		}

		// Entry User
		var entryUser = objOfCreateNewFilter
				.down('AutoCompleter[itemId="Maker"]').getValue();
		if (!Ext.isEmpty(entryUser)) {
			jsonArray.push({
						field : 'Maker',
						operator : 'eq',
						value1 : entryUser,
						value2 : '',
						dataType : 0,
						displayType : 4
					});
		}

		// File Name
		var fileName = objOfCreateNewFilter
				.down('textfield[itemId="FileName"]').getValue();
		if (!Ext.isEmpty(fileName)) {
			jsonArray.push({
						field : 'FileName',
						operator : 'lk',
						value1 : fileName,
						value2 : '',
						dataType : 0,
						displayType : 0
					});
		}

		// Template Name
		var templateName = objOfCreateNewFilter
				.down('AutoCompleter[itemId="TemplateName"]').getValue();
		if (!Ext.isEmpty(templateName)) {
			jsonArray.push({
						field : 'TemplateName',
						operator : 'eq',
						value1 : templateName,
						value2 : '',
						dataType : 0,
						displayType : 4
					});
		}

		// EntryDate
		var fromField = objOfCreateNewFilter
				.down('container[itemId=processDate] label[itemId="dateFilterFrom"]');
		var toField = objOfCreateNewFilter
				.down('container[itemId=processDate] label[itemId="dateFilterTo"]');
		var processFromDate = (!Ext.isEmpty(fromField.text))
				? (fromField.text.substring(0, fromField.text.length - 3))
				: objOfCreateNewFilter
						.down('container[itemId=processDate] datefield[itemId="processFromDate"]')
						.getValue();
		var processToDate = (!Ext.isEmpty(toField.text))
				? toField.text
				: objOfCreateNewFilter
						.down('container[itemId=processDate] datefield[itemId="processToDate"]')
						.getValue();
		if (!Ext.isEmpty(processFromDate)) {
			jsonArray.push({
						field : 'EntryDate',
						operator : (!Ext.isEmpty(processToDate)) ? 'bt' : 'eq',
						value1 : Ext.util.Format.date(processFromDate, 'Y-m-d'),
						value2 : (!Ext.isEmpty(processToDate))
								? Ext.util.Format.date(processToDate, 'Y-m-d')
								: '',
						dataType : 1,
						displayType : 5
					});
		}

		// Effective Date
		var fromEffective = objOfCreateNewFilter
				.down('container[itemId=effectiveDate] label[itemId="dateFilterFrom"]');
		var toEffective = objOfCreateNewFilter
				.down('container[itemId=effectiveDate] label[itemId="dateFilterTo"]');

		var effectiveFromDate = (!Ext.isEmpty(fromEffective.text))
				? (fromEffective.text.substring(0, fromEffective.text.length
								- 3))
				: objOfCreateNewFilter
						.down('container[itemId=effectiveDate] datefield[itemId="effectiveFromDate"]')
						.getValue();
		var effectiveToDate = (!Ext.isEmpty(toEffective.text))
				? toEffective.text
				: objOfCreateNewFilter
						.down('container[itemId=effectiveDate] datefield[itemId="effectiveToDate"]')
						.getValue();
		if (!Ext.isEmpty(effectiveFromDate)) {
			jsonArray.push({
						field : 'ActivationDate',
						operator : (!Ext.isEmpty(effectiveToDate))
								? 'bt'
								: 'eq',
						value1 : Ext.util.Format.date(effectiveFromDate,
								'Y-m-d'),
						value2 : (!Ext.isEmpty(effectiveToDate))
								? Ext.util.Format
										.date(effectiveToDate, 'Y-m-d')
								: '',
						dataType : 1,
						displayType : 5
					});
		}

		// Creation Date
		var fromCreation = objOfCreateNewFilter
				.down('container[itemId=creationDate] label[itemId="dateFilterFrom"]');
		var toCreation = objOfCreateNewFilter
				.down('container[itemId=creationDate] label[itemId="dateFilterTo"]');

		var creationFromDate = (!Ext.isEmpty(fromCreation.text))
				? (fromCreation.text.substring(0, fromCreation.text.length - 3))
				: objOfCreateNewFilter
						.down('container[itemId=creationDate] datefield[itemId="creationFromDate"]')
						.getValue();
		var creationToDate = (!Ext.isEmpty(toCreation.text))
				? toCreation.text
				: objOfCreateNewFilter
						.down('container[itemId=creationDate] datefield[itemId="creationToDate"]')
						.getValue();
		if (!Ext.isEmpty(creationFromDate)) {
			jsonArray.push({
						field : 'CreateDate',
						operator : (!Ext.isEmpty(creationToDate)) ? 'bt' : 'eq',
						value1 : Ext.util.Format
								.date(creationFromDate, 'Y-m-d'),
						value2 : (!Ext.isEmpty(creationToDate))
								? Ext.util.Format.date(creationToDate, 'Y-m-d')
								: '',
						dataType : 1,
						displayType : 5
					});
		}

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
		var sortByCombo = objOfCreateNewFilter
				.down('combo[itemId="sortByCombo"]').getValue();
		if (!Ext.isEmpty(sortByCombo) && sortByCombo !== "None") {
			jsonArray.push({
						field : 'SortBy',
						operator : 'st',
						value1 : sortByCombo,
						value2 : sortByOption,
						dataType : 0,
						displayType : 6
					});
		}

		// First Then Sort By
		var firstThenSortByCombo = objOfCreateNewFilter
				.down('combo[itemId="firstThenSortByCombo"]').getValue();
		if (!Ext.isEmpty(firstThenSortByCombo)
				&& firstThenSortByCombo !== "None") {
			jsonArray.push({
						field : 'FirstThenSortBy',
						operator : 'st',
						value1 : firstThenSortByCombo,
						value2 : firstThenSortByOption,
						dataType : 0,
						displayType : 6
					});
		}

		// Second Then Sort By
		var secondThenSortByCombo = objOfCreateNewFilter
				.down('combo[itemId="secondThenSortByCombo"]').getValue();
		if (!Ext.isEmpty(secondThenSortByCombo)
				&& secondThenSortByCombo !== "None") {
			jsonArray.push({
						field : 'SecondThenSortBy',
						operator : 'st',
						value1 : secondThenSortByCombo,
						value2 : secondThenSortByOption,
						dataType : 0,
						displayType : 6
					});
		}

		objJson = {};
		objJson.filterBy = jsonArray;
		if (FilterCodeVal && !Ext.isEmpty(FilterCodeVal))
			objJson.filterCode = FilterCodeVal;
		if (!Ext.isEmpty(seller))
			objJson.sellerValue = seller;
		return objJson;
	},
	getAdvancedFilterSortByJson : function(objOfCreateNewFilter) {
		var objJson = null;
		var jsonArray = [];
		var sortByOption = 'asc';
		var firstThenSortByOption = 'asc';
		var secondThenSortByOption = 'asc';

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
		var sortByCombo = objOfCreateNewFilter
				.down('combo[itemId="sortByCombo"]').getValue();
		if (!Ext.isEmpty(sortByCombo) && sortByCombo !== "None") {
			jsonArray.push({
						field : 'SortBy',
						operator : 'st',
						value1 : sortByCombo,
						value2 : sortByOption,
						dataType : 0,
						displayType : 6
					});
		}

		// First Then Sort By
		var firstThenSortByCombo = objOfCreateNewFilter
				.down('combo[itemId="firstThenSortByCombo"]').getValue();
		if (!Ext.isEmpty(firstThenSortByCombo)
				&& firstThenSortByCombo !== "None") {
			jsonArray.push({
						field : 'ThenSortBy',
						operator : 'st',
						value1 : firstThenSortByCombo,
						value2 : firstThenSortByOption,
						dataType : 0,
						displayType : 6
					});
		}

		// Second Then Sort By
		var secondThenSortByCombo = objOfCreateNewFilter
				.down('combo[itemId="secondThenSortByCombo"]').getValue();
		if (!Ext.isEmpty(secondThenSortByCombo)
				&& secondThenSortByCombo !== "None") {
			jsonArray.push({
						field : 'ThenSortBy',
						operator : 'st',
						value1 : secondThenSortByCombo,
						value2 : secondThenSortByOption,
						dataType : 0,
						displayType : 6
					});
		}

		objJson = jsonArray;
		return objJson;

	},
	getAdvancedFilterQueryJson : function(objOfCreateNewFilter) {
		var objJson = null;
		var clientContainer = objOfCreateNewFilter
				.up('tabpanel[itemId=advancedFilterTab]').getTabBar()
				.down('container[itemId=clientContainer]');
		var jsonArray = [];

		// Client
		var client = clientContainer.down('textfield[itemId="Client"]')
				.getValue();
		
		var clientCodesData = clientContainer.down('textfield[itemId="Client"]').clientCodesData;		
		
		if (!Ext.isEmpty(clientCodesData)) {
			jsonArray.push({
						field : 'Client',
						operator : 'in',
						value1 : clientCodesData,
						value2 : '',
						dataType : 0,
						displayType : 6
					});
		}

		// Currency
		var currencyValue = objOfCreateNewFilter
				.down('radiogroup[itemId="currencyRadioGroup"]').getValue().CrossCurrency;
		if (!Ext.isEmpty(currencyValue)) {
			jsonArray.push({
						field : 'CrossCurrency',
						operator : 'eq',
						value1 : currencyValue,
						value2 : '',
						dataType : 0,
						displayType : 4
					});
		}
		
		// Check Number
		var checkValue = objOfCreateNewFilter
				.down('textfield[itemId="CheckNumber"]').getValue();
		if (!Ext.isEmpty(checkValue)) {
			jsonArray.push({
						field : 'MicrNo',
						operator : 'lk',
						value1 : checkValue,
						value2 : '',
						dataType : 0,
						displayType : 0
					});
		}
		
		// Confidential
		var confidentialValue = objOfCreateNewFilter
				.down('radiogroup[itemId="confidential"]').getValue().Confidential;
		if (!Ext.isEmpty(confidentialValue)) {
			jsonArray.push({
						field : 'Confidential',
						operator : 'eq',
						value1 : confidentialValue,
						value2 : '',
						dataType : 0,
						displayType : 4
					});
		}

		// CreditDebitFlag
		var CreditDebitFlagValue = objOfCreateNewFilter
				.down('radiogroup[itemId="CreditDebitFlag"]').getValue().CreditDebitFlag;
		if (!Ext.isEmpty(CreditDebitFlagValue)) {
			jsonArray.push({
						field : 'CreditDebitFlag',
						operator : 'eq',
						value1 : CreditDebitFlagValue,
						value2 : '',
						dataType : 0,
						displayType : 4
					});
		}

		// Prenote
		var PrenoteValue = objOfCreateNewFilter
				.down('radiogroup[itemId="Prenote"]').getValue().Prenote;
		if (!Ext.isEmpty(CreditDebitFlagValue)) {
			jsonArray.push({
						field : 'Prenote',
						operator : 'eq',
						value1 : PrenoteValue,
						value2 : '',
						dataType : 0,
						displayType : 4
					});
		}

		// Status
		var StatusCodeValString = objOfCreateNewFilter
				.down('textfield[itemId="Status"]').codeValue;
		if (!Ext.isEmpty(StatusCodeValString)) {
			jsonArray.push({
						field : 'ActionStatus',
						operator : 'in',
						value1 : StatusCodeValString,
						value2 : '',
						dataType : 0,
						displayType : 6
					});
		}

		// Pending Action
		var PendingCodeValString = objOfCreateNewFilter
				.down('textfield[itemId="Pending"]').codeValue;
		if (!Ext.isEmpty(PendingCodeValString)) {
			jsonArray.push({
						field : 'PendingAction',
						operator : 'in',
						value1 : PendingCodeValString,
						value2 : '',
						dataType : 0,
						displayType : 6
					});
		}

		// Products
		var ProductType = objOfCreateNewFilter
				.down('textfield[itemId="ProductType"]').getValue();
				
		var productCodesData = objOfCreateNewFilter
				.down('textfield[itemId="ProductType"]').productCodesData;				
				
		if (!Ext.isEmpty(productCodesData)) {
			jsonArray.push({
						field : 'ProductType',
						operator : 'in',
						value1 : productCodesData,
						value2 : '',
						dataType : 0,
						displayType : 6
					});
		}

		// sending account #
		var sendingAcctNo = objOfCreateNewFilter
				.down('textfield[itemId="AccountNo"]').getValue();
		if (!Ext.isEmpty(sendingAcctNo)) {
			jsonArray.push({
						field : 'AccountNo',
						operator : 'in',
						value1 : sendingAcctNo,
						value2 : '',
						dataType : 0,
						displayType : 0
					});
		}

		// Company Id (pending inputs)

		// receiver Id (pending inputs)

		// Amount greater than
		var amount = objOfCreateNewFilter
				.down('numberfield[itemId="AmountGreaterThan"]').getValue();
		if (!Ext.isEmpty(amount)) {
			jsonArray.push({
						field : 'Amount',
						operator : 'gt',
						value1 : amount,
						value2 : '',
						dataType : 2,
						displayType : 3
					});
		}

		// Amount less than
		var amount = objOfCreateNewFilter
				.down('numberfield[itemId="AmountLessThan"]').getValue();
		if (!Ext.isEmpty(amount)) {
			jsonArray.push({
						field : 'Amount',
						operator : 'lt',
						value1 : amount,
						value2 : '',
						dataType : 2,
						displayType : 3
					});
		}

		// Amount Equal To
		var amount = objOfCreateNewFilter
				.down('numberfield[itemId="AmountEqualTo"]').getValue();
		if (!Ext.isEmpty(amount)) {
			jsonArray.push({
						field : 'Amount',
						operator : 'eq',
						value1 : amount,
						value2 : '',
						dataType : 2,
						displayType : 3
					});
		}

		// Client or Payment Reference
		var PaymentRef = objOfCreateNewFilter
				.down('textfield[itemId="ClientReference"]').getValue();
		if (!Ext.isEmpty(PaymentRef)) {
			jsonArray.push({
						field : 'ClientReference',
						operator : 'lk',
						value1 : PaymentRef,
						value2 : '',
						dataType : 0,
						displayType : 0
					});
		}

		// Channel
		var Channel = objOfCreateNewFilter
				.down('AutoCompleter[itemId="Channel"]').getValue();
		if (!Ext.isEmpty(Channel)) {
			jsonArray.push({
						field : 'Channel',
						operator : 'eq',
						value1 : Channel,
						value2 : '',
						dataType : 0,
						displayType : 4
					});
		}

		// Entry User
		var entryUser = objOfCreateNewFilter
				.down('AutoCompleter[itemId="Maker"]').getValue();
		if (!Ext.isEmpty(entryUser)) {
			jsonArray.push({
						field : 'Maker',
						operator : 'eq',
						value1 : entryUser,
						value2 : '',
						dataType : 0,
						displayType : 4
					});
		}

		// File Name
		var fileName = objOfCreateNewFilter
				.down('textfield[itemId="FileName"]').getValue();
		if (!Ext.isEmpty(fileName)) {
			jsonArray.push({
						field : 'FileName',
						operator : 'lk',
						value1 : fileName,
						value2 : '',
						dataType : 0,
						displayType : 0
					});
		}

		// Template Name
		var templateName = objOfCreateNewFilter
				.down('AutoCompleter[itemId="TemplateName"]').getValue();
		if (!Ext.isEmpty(templateName)) {
			jsonArray.push({
						field : 'TemplateName',
						operator : 'eq',
						value1 : templateName,
						value2 : '',
						dataType : 0,
						displayType : 4
					});
		}

		// Effective Date
		var fromEffective = objOfCreateNewFilter
				.down('container[itemId=effectiveDate] label[itemId="dateFilterFrom"]');
		var toEffective = objOfCreateNewFilter
				.down('container[itemId=effectiveDate] label[itemId="dateFilterTo"]');

		var effectiveFromDate = (!Ext.isEmpty(fromEffective.text))
				? (fromEffective.text.substring(0, fromEffective.text.length
								- 3))
				: objOfCreateNewFilter
						.down('container[itemId=effectiveDate] datefield[itemId="effectiveFromDate"]')
						.getValue();
		var effectiveToDate = (!Ext.isEmpty(toEffective.text))
				? toEffective.text
				: objOfCreateNewFilter
						.down('container[itemId=effectiveDate] datefield[itemId="effectiveToDate"]')
						.getValue();
		if (!Ext.isEmpty(effectiveFromDate)) {
			jsonArray.push({
						field : 'ActivationDate',
						operator : (!Ext.isEmpty(effectiveToDate))
								? 'bt'
								: 'eq',
						value1 : Ext.util.Format.date(effectiveFromDate,
								'Y-m-d'),
						value2 : (!Ext.isEmpty(effectiveToDate))
								? Ext.util.Format
										.date(effectiveToDate, 'Y-m-d')
								: '',
						dataType : 1,
						displayType : 5
					});
		}

		// Creation Date
		var fromCreation = objOfCreateNewFilter
				.down('container[itemId=creationDate] label[itemId="dateFilterFrom"]');
		var toCreation = objOfCreateNewFilter
				.down('container[itemId=creationDate] label[itemId="dateFilterTo"]');

		var creationFromDate = (!Ext.isEmpty(fromCreation.text))
				? (fromCreation.text.substring(0, fromCreation.text.length - 3))
				: objOfCreateNewFilter
						.down('container[itemId=creationDate] datefield[itemId="creationFromDate"]')
						.getValue();
		var creationToDate = (!Ext.isEmpty(toCreation.text))
				? toCreation.text
				: objOfCreateNewFilter
						.down('container[itemId=creationDate] datefield[itemId="creationToDate"]')
						.getValue();
		if (!Ext.isEmpty(creationFromDate)) {
			jsonArray.push({
						field : 'CreateDate',
						operator : (!Ext.isEmpty(creationToDate)) ? 'bt' : 'eq',
						value1 : Ext.util.Format
								.date(creationFromDate, 'Y-m-d'),
						value2 : (!Ext.isEmpty(creationToDate))
								? Ext.util.Format.date(creationToDate, 'Y-m-d')
								: '',
						dataType : 1,
						displayType : 5
					});
		}

		objJson = jsonArray;
		return objJson;
	},
	setAmounts : function(objOfCreateNewFilter, operator, data) {
		var amonutFieldRef = null;
		if (!Ext.isEmpty(operator)) {
			if (operator === "gt")
				amonutFieldRef = objOfCreateNewFilter
						.down('numberfield[itemId="AmountGreaterThan"]');
			else if (operator === "lt")
				amonutFieldRef = objOfCreateNewFilter
						.down('numberfield[itemId="AmountLessThan"]');
			else
				amonutFieldRef = objOfCreateNewFilter
						.down('numberfield[itemId="AmountEqualTo"]');

			if (!Ext.isEmpty(data))
				amonutFieldRef.setValue(data);
		}
	},
	checkUnCheckMenuItems : function(objOfCreateNewFilter, componentName, data) {
		var menuRef = null;
		var me = this;
		var actionsMenu = false;
		var clientContainer = null;

		if (componentName === 'ProductType') {
			menuRef = objOfCreateNewFilter.down('menu[itemId=myProductMenu]');
		} else if (componentName === 'ActionStatus') {
			actionsMenu = true;
			menuRef = objOfCreateNewFilter.down('menu[itemId=statusMenu]');
		} else if (componentName === 'PendingAction') {
			actionsMenu = true;
			menuRef = objOfCreateNewFilter
					.down('menu[itemId=pendingActionMenu]');
		} else if (componentName === 'CompanyId') {
			menuRef = objOfCreateNewFilter.down('menu[itemId=companyIdMenu]');
		} else if (componentName === 'Client') {
			clientContainer = objOfCreateNewFilter
					.up('tabpanel[itemId=advancedFilterTab]').getTabBar()
					.down('container[itemId=clientContainer]');
			if (!Ext.isEmpty(clientContainer)) {
				menuRef = clientContainer.down('menu[itemId="clientMenu"]');
			}
		} else {
			menuRef = objOfCreateNewFilter
					.down('menu[itemId=sendingAccountMenu]');
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

		var clientContainer = objOfCreateNewFilter
				.up('tabpanel[itemId=advancedFilterTab]').getTabBar()
				.down('container[itemId=clientContainer]');
		if (!Ext.isEmpty(clientContainer)) {
			var clientMenuRef = clientContainer
					.down('menu[itemId="clientMenu"]');
			if (!Ext.isEmpty(clientMenuRef)) {
				itemArray = clientMenuRef.items.items;
				if (!Ext.isEmpty(itemArray)) {
					for (var index = 0; index < itemArray.length; index++) {
						itemArray[index].setDisabled(enableDisableFlag);
					}
				}
			}
		}

		var productMenuRef = objOfCreateNewFilter
				.down('menu[itemId=myProductMenu]');
		if (!Ext.isEmpty(productMenuRef)) {
			itemArray = productMenuRef.items.items;
			if (!Ext.isEmpty(itemArray)) {
				for (var index = 0; index < itemArray.length; index++) {
					itemArray[index].setDisabled(enableDisableFlag);
				}
			}
		}

		var statusMenuRef = objOfCreateNewFilter
				.down('menu[itemId=statusMenu]');
		if (!Ext.isEmpty(statusMenuRef)) {
			itemArray = statusMenuRef.items.items;
			if (!Ext.isEmpty(itemArray)) {
				for (var index = 0; index < itemArray.length; index++) {
					itemArray[index].setDisabled(enableDisableFlag);
				}
			}
		}

		var pendingActionMenuRef = objOfCreateNewFilter
				.down('menu[itemId=pendingActionMenu]');
		if (!Ext.isEmpty(pendingActionMenuRef)) {
			itemArray = pendingActionMenuRef.items.items;
			if (!Ext.isEmpty(itemArray)) {
				for (var index = 0; index < itemArray.length; index++) {
					itemArray[index].setDisabled(enableDisableFlag);
				}
			}
		}

		var companyIdMenuRef = objOfCreateNewFilter
				.down('menu[itemId=companyIdMenu]');
		if (!Ext.isEmpty(companyIdMenuRef)) {
			itemArray = companyIdMenuRef.items.items;
			if (!Ext.isEmpty(itemArray)) {
				for (var index = 0; index < itemArray.length; index++) {
					itemArray[index].setDisabled(enableDisableFlag);
				}
			}
		}

		var sendingAccountMenuRef = objOfCreateNewFilter
				.down('menu[itemId=sendingAccountMenu]');
		if (!Ext.isEmpty(sendingAccountMenuRef)) {
			itemArray = sendingAccountMenuRef.items.items;
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
			var pFromDate = objCreateNewFilterPanel
					.down('datefield[itemId="processFromDate"]');
			if (typeof fromDate === 'string')
				fromDate = fromDate.replace(' - ', '');
			pFromDate.suspendEvents();
			pFromDate.setValue(fromDate);
			pFromDate.resumeEvents();
			toDate = toDate || fromDate;
			var pToDate = objCreateNewFilterPanel
					.down('datefield[itemId="processToDate"]');
			pToDate.suspendEvents();
			pToDate.setValue(toDate);
			pToDate.resumeEvents();

		}
		if (!Ext.isEmpty(paymentTypeCode))
			this.setRadioGroupValues(this, "ProductCategory", paymentTypeCode);
	},
	resetAllFields : function(objCreateNewFilterPanel) {
		var me = this;
		var clientContainer = objCreateNewFilterPanel
				.up('tabpanel[itemId=advancedFilterTab]').getTabBar()
				.down('container[itemId=clientContainer]');
		var clientMenuRef = clientContainer.down('menu[itemId=clientMenu]');
		clientContainer.down('textfield[itemId="Client"]').reset();

		objCreateNewFilterPanel.down('textfield[itemId="ClientReference"]')
				.reset();

		objCreateNewFilterPanel.down('textfield[itemId="ProductType"]').reset();
		objCreateNewFilterPanel.down('textfield[itemId="AccountNo"]').reset();
		objCreateNewFilterPanel.down('textfield[itemId="Status"]').reset();
		objCreateNewFilterPanel.down('textfield[itemId="Pending"]').reset();
		objCreateNewFilterPanel.down('textfield[itemId="CompanyID"]').reset();

		objCreateNewFilterPanel.down('label[itemId="processLbl"]')
				.setText(getLabel('processDate', 'Process Date'));
		objCreateNewFilterPanel
				.down('container[itemId=processDate] label[itemId="dateFilterFrom"]')
				.setText('');
		objCreateNewFilterPanel
				.down('container[itemId=processDate] label[itemId="dateFilterTo"]')
				.setText('');

		if (!Ext.isEmpty(objCreateNewFilterPanel
				.down('container[name="processDateRange"]')))
			objCreateNewFilterPanel.down('container[name="processDateRange"]')
					.setVisible(false);

		if (!Ext.isEmpty(objCreateNewFilterPanel
				.down('container[name="effectiveDateRange"]')))
			objCreateNewFilterPanel
					.down('container[name="effectiveDateRange"]')
					.setVisible(false);

		if (!Ext.isEmpty(objCreateNewFilterPanel
				.down('container[name="creationDateRange"]')))
			objCreateNewFilterPanel.down('container[name="creationDateRange"]')
					.setVisible(false);

		if (!Ext.isEmpty(objCreateNewFilterPanel
				.down('container[name="EntryDate"]')))
			objCreateNewFilterPanel.down('container[name="EntryDate"]')
					.setVisible(true);

		if (!Ext.isEmpty(objCreateNewFilterPanel
				.down('container[name="ActivationDate"]')))
			objCreateNewFilterPanel.down('container[name="ActivationDate"]')
					.setVisible(true);

		if (!Ext.isEmpty(objCreateNewFilterPanel
				.down('container[name="CreateDate"]')))
			objCreateNewFilterPanel.down('container[name="CreateDate"]')
					.setVisible(true);

		objCreateNewFilterPanel.down('AutoCompleter[itemId="ReceiverId"]')
				.reset();
		objCreateNewFilterPanel.down('AutoCompleter[itemId="FileName"]')
				.reset();
		objCreateNewFilterPanel.down('AutoCompleter[itemId="TemplateName"]')
				.reset();
		objCreateNewFilterPanel.down('AutoCompleter[itemId="Maker"]').reset();
		objCreateNewFilterPanel.down('AutoCompleter[itemId="Channel"]').reset();

		objCreateNewFilterPanel
				.down('label[itemId="effectiveDateLbl"]')
				.setText(getLabel('batchColumnEffectiveDate', 'Effective Date'));
		objCreateNewFilterPanel
				.down('container[itemId=effectiveDate] label[itemId="dateFilterFrom"]')
				.setText('');
		objCreateNewFilterPanel
				.down('container[itemId=effectiveDate] label[itemId="dateFilterTo"]')
				.setText('');

		objCreateNewFilterPanel.down('label[itemId="creationDateLbl"]')
				.setText(getLabel('creationDate', 'Creation Date'));
		objCreateNewFilterPanel
				.down('container[itemId=creationDate] label[itemId="dateFilterFrom"]')
				.setText('');
		objCreateNewFilterPanel
				.down('container[itemId=creationDate] label[itemId="dateFilterTo"]')
				.setText('');
		objCreateNewFilterPanel.down('numberfield[itemId="AmountGreaterThan"]')
				.reset();
		objCreateNewFilterPanel.down('numberfield[itemId="AmountLessThan"]')
				.reset();
		objCreateNewFilterPanel.down('numberfield[itemId="AmountEqualTo"]')
				.reset();
		objCreateNewFilterPanel.down('textfield[itemId="filterCode"]').reset();

		objCreateNewFilterPanel.down('combo[itemId="sortByCombo"]').reset();
		objCreateNewFilterPanel.down('combo[itemId="firstThenSortByCombo"]')
				.reset();
		objCreateNewFilterPanel.down('combo[itemId="secondThenSortByCombo"]')
				.reset();
		objCreateNewFilterPanel.down('button[itemId="sortByOptionButton"]')
				.setText(getLabel("ascending", "Ascending"));
		objCreateNewFilterPanel
				.down('button[itemId="firstThenSortByOptionButton"]')
				.setText(getLabel("ascending", "Ascending"));
		objCreateNewFilterPanel
				.down('button[itemId="secondThenSortByOptionButton"]')
				.setText(getLabel("ascending", "Ascending"));

		objCreateNewFilterPanel.down('label[itemId="errorLabel"]').setText('');

		var myProductMenu = objCreateNewFilterPanel
				.down('menu[itemId=myProductMenu]');
		objCreateNewFilterPanel.resetMenuItems(myProductMenu);
		var sendingMenu = objCreateNewFilterPanel
				.down('menu[itemId=sendingAccountMenu]');
		objCreateNewFilterPanel.resetMenuItems(sendingMenu);
		var statusMenu = objCreateNewFilterPanel
				.down('menu[itemId=statusMenu]');
		objCreateNewFilterPanel.resetMenuItems(statusMenu);
		var pendingActionMenu = objCreateNewFilterPanel
				.down('menu[itemId=pendingActionMenu]');
		objCreateNewFilterPanel.resetMenuItems(pendingActionMenu);
		var sendingAccountMenu = objCreateNewFilterPanel
				.down('menu[itemId=sendingAccountNameMenu]');
		objCreateNewFilterPanel.resetMenuItems(sendingAccountMenu);
		var companyIdMenu = objCreateNewFilterPanel
				.down('menu[itemId=companyIdMenu]');
		objCreateNewFilterPanel.resetMenuItems(companyIdMenu);

		objCreateNewFilterPanel.resetMenuItems(clientMenuRef);

		var batchRadioGroup = objCreateNewFilterPanel
				.down('radiogroup[itemId=batchRadioGroup]');
		if (!Ext.isEmpty(batchRadioGroup)) {
			batchRadioGroup.reset();
		}

		var currencyRadioGroup = objCreateNewFilterPanel
				.down('radiogroup[itemId=currencyRadioGroup]');
		if (!Ext.isEmpty(currencyRadioGroup)) {
			currencyRadioGroup.reset();
		}

		var confidentialRadioGroup = objCreateNewFilterPanel
				.down('radiogroup[itemId=confidential]');
		if (!Ext.isEmpty(confidentialRadioGroup)) {
			confidentialRadioGroup.reset();
		}

		var CreditDebitFlagRadioGroup = objCreateNewFilterPanel
				.down('radiogroup[itemId=CreditDebitFlag]');
		if (!Ext.isEmpty(CreditDebitFlagRadioGroup)) {
			CreditDebitFlagRadioGroup.reset();
		}

		var PrenoteRadioGroup = objCreateNewFilterPanel
				.down('radiogroup[itemId=Prenote]');
		if (!Ext.isEmpty(PrenoteRadioGroup)) {
			PrenoteRadioGroup.reset();
		}
	},
	setRadioGroupValues : function(objCreateNewFilterPanel, fieldName, fieldVal) {
		var me = this;
		if (!Ext.isEmpty(fieldName)) {
			var radioGroupRef = null;

			if (fieldName === 'ProductCategory') {
				radioGroupRef = objCreateNewFilterPanel
						.down('radiogroup[itemId=productCategoryRadioGroup]');
				if (!Ext.isEmpty(radioGroupRef)) {
					if (!Ext.isEmpty(fieldVal)) {
						radioGroupRef.setValue({
									ProductCategory : fieldVal
								});
					}
				}
			}

			if (fieldName === 'CrossCurrency') {
				radioGroupRef = objCreateNewFilterPanel
						.down('radiogroup[itemId=currencyRadioGroup]');
				if (!Ext.isEmpty(radioGroupRef)) {
					if (!Ext.isEmpty(fieldVal))
						radioGroupRef.setValue({
									CrossCurrency : fieldVal
								});
				}
			}

			if (fieldName === 'CreditDebitFlag') {
				radioGroupRef = objCreateNewFilterPanel
						.down('radiogroup[itemId=CreditDebitFlag]');
				if (!Ext.isEmpty(radioGroupRef)) {
					if (!Ext.isEmpty(fieldVal))
						radioGroupRef.setValue({
									CreditDebitFlag : fieldVal
								});
				}
			}

			if (fieldName === 'Prenote') {
				radioGroupRef = objCreateNewFilterPanel
						.down('radiogroup[itemId=Prenote]');
				if (!Ext.isEmpty(radioGroupRef)) {
					if (!Ext.isEmpty(fieldVal))
						radioGroupRef.setValue({
									Prenote : fieldVal
								});
				}
			}

			if (fieldName === 'Confidential') {
				radioGroupRef = objCreateNewFilterPanel
						.down('radiogroup[itemId=confidential]');
				if (!Ext.isEmpty(radioGroupRef)) {
					if (!Ext.isEmpty(fieldVal))
						radioGroupRef.setValue({
									Confidential : fieldVal
								});
				}
			}

		}
	},
	setSortByComboFields : function(objCreateNewFilterPanel, fieldName,
			columnId, buttonText, disableFlag) {
		if (!Ext.isEmpty(fieldName)) {

			if (fieldName === 'SortBy') {
				// sortBySortOptionButton
				if (!Ext.isEmpty(buttonText)) {
					var sortByButtonRef = objCreateNewFilterPanel
							.down('button[itemId="sortByOptionButton"]');
					if (!Ext.isEmpty(sortByButtonRef))
						sortByButtonRef.setText(buttonText);
					sortByButtonRef.setDisabled(disableFlag);
				}

				// Sort By
				if (!Ext.isEmpty(columnId)) {
					var sortByComboRef = objCreateNewFilterPanel
							.down('combo[itemId="sortByCombo"]');
					if (!Ext.isEmpty(sortByComboRef)) {
						sortByComboRef.setValue(columnId);
						sortByComboRef.setReadOnly(disableFlag);
					}
				}

			} else if (fieldName === 'FirstThenSortBy') {
				// firstThenSortBySortOption
				if (!Ext.isEmpty(buttonText)) {
					var thenSortByButtonRef = objCreateNewFilterPanel
							.down('button[itemId="firstThenSortByOptionButton"]');
					if (!Ext.isEmpty(thenSortByButtonRef))
						thenSortByButtonRef.setText(buttonText);
					thenSortByButtonRef.setDisabled(disableFlag);
				}

				// First Then Sort By
				if (!Ext.isEmpty(columnId)) {
					var firstThenSortByCombo = objCreateNewFilterPanel
							.down('combo[itemId="firstThenSortByCombo"]');
					if (!Ext.isEmpty(firstThenSortByCombo)) {
						firstThenSortByCombo.setValue(columnId);
						firstThenSortByCombo.setReadOnly(disableFlag);
					}
				}

			} else if (fieldName === 'SecondThenSortBy') {
				// secondThenSortBySortOption
				if (!Ext.isEmpty(buttonText)) {
					var thenSortByButtonRef = objCreateNewFilterPanel
							.down('button[itemId="secondThenSortByOptionButton"]');
					if (!Ext.isEmpty(thenSortByButtonRef))
						thenSortByButtonRef.setText(buttonText);
					thenSortByButtonRef.setDisabled(disableFlag);
				}

				// Second Then Sort By
				if (!Ext.isEmpty(columnId)) {
					var secondThenSortByComboRef = objCreateNewFilterPanel
							.down('combo[itemId="secondThenSortByCombo"]');
					if (!Ext.isEmpty(secondThenSortByComboRef)) {
						secondThenSortByComboRef.setValue(columnId);
						secondThenSortByComboRef.setReadOnly(disableFlag);
					}
				}
			}
		}
	},
	setSavedFilterDates : function(objCreateNewFilterPanel, dateType, data,
			menuDisableFlag) {
		if (!Ext.isEmpty(dateType) && !Ext.isEmpty(data)) {
			var me = this;
			var dateFilterFromRef = null;
			var dateFilterToRef = null;
			var menuRef = null;
			var dateOperator = data.operator;

			if (dateType === 'CreateDate') {
				dateFilterFromRef = objCreateNewFilterPanel
						.down('container[itemId=creationDate] label[itemId="dateFilterFrom"]');
				dateFilterToRef = objCreateNewFilterPanel
						.down('container[itemId=creationDate] label[itemId="dateFilterTo"]');
				menuRef = objCreateNewFilterPanel
						.down('menu[itemId="creationDateMenu"]');

			} else if (dateType === 'EntryDate') {
				dateFilterFromRef = objCreateNewFilterPanel
						.down('container[itemId=processDate] label[itemId="dateFilterFrom"]');
				dateFilterToRef = objCreateNewFilterPanel
						.down('container[itemId=processDate] label[itemId="dateFilterTo"]');
				menuRef = objCreateNewFilterPanel
						.down('menu[itemId="processDateMenu"]');

			} else if (dateType === 'ActivationDate') {
				dateFilterFromRef = objCreateNewFilterPanel
						.down('container[itemId=effectiveDate] label[itemId="dateFilterFrom"]');
				dateFilterToRef = objCreateNewFilterPanel
						.down('container[itemId=effectiveDate] label[itemId="dateFilterTo"]');
				menuRef = objCreateNewFilterPanel
						.down('menu[itemId="effectiveDateMenu"]');
			}

			if (dateOperator === 'eq') {
				var fromDate = data.value1;
				if (!Ext.isEmpty(fromDate)) {
					var formattedFromDate = Ext.util.Format.date(Ext.Date
									.parse(fromDate, 'Y-m-d'),
							strExtApplicationDateFormat);
					dateFilterFromRef.setText(formattedFromDate);
					dateFilterFromRef.show();
				}

			} else if (dateOperator === 'bt') {
				var fromDate = data.value1;
				if (!Ext.isEmpty(fromDate)) {
					var formattedFromDate = Ext.util.Format.date(Ext.Date
									.parse(fromDate, 'Y-m-d'),
							strExtApplicationDateFormat);
					dateFilterFromRef.setText(formattedFromDate + " - ");
					dateFilterFromRef.show();
				}

				var toDate = data.value2;
				if (!Ext.isEmpty(toDate)) {
					var formattedToDate = Ext.util.Format.date(Ext.Date.parse(
									toDate, 'Y-m-d'),
							strExtApplicationDateFormat);
					dateFilterToRef.setText(formattedToDate);
					dateFilterToRef.show();
				}
			}
		} else {
			// console.log("Error Occured - date filter details found empty");
		}
	},
	disableAllDatesMenu : function(objCreateNewFilterPanel, disableFlag) {
		var me = this;
		var creationDateMenuRef = objCreateNewFilterPanel
				.down('menu[itemId="creationDateMenu"]');
		var processDateMenuRef = objCreateNewFilterPanel
				.down('menu[itemId="processDateMenu"]');
		var effectiveDateMenuRef = objCreateNewFilterPanel
				.down('menu[itemId="effectiveDateMenu"]');

		if (!Ext.isEmpty(creationDateMenuRef))
			creationDateMenuRef.setDisabled(disableFlag);

		if (!Ext.isEmpty(processDateMenuRef))
			processDateMenuRef.setDisabled(disableFlag);

		if (!Ext.isEmpty(effectiveDateMenuRef))
			effectiveDateMenuRef.setDisabled(disableFlag);

	},
	resetMenuItems : function(menuRef) {
		if (!Ext.isEmpty(menuRef)) {
			var itemArray = menuRef.items.items;
			for (var index = 0; index < itemArray.length; index++) {
				itemArray[index].setChecked(true);
				itemArray[index].setDisabled(false);
			}
		}
	},
	enableDisableFields : function(objCreateNewFilterPanel, boolVal) {
		var clientContainer = objCreateNewFilterPanel
				.up('tabpanel[itemId=advancedFilterTab]').getTabBar()
				.down('container[itemId=clientContainer]');
		clientContainer.down('textfield[itemId="Client"]').setDisabled(boolVal);

		objCreateNewFilterPanel.down('textfield[itemId="ClientReference"]')
				.setDisabled(boolVal);

		objCreateNewFilterPanel.down('textfield[itemId="ProductType"]')
				.setDisabled(boolVal);
		objCreateNewFilterPanel.down('textfield[itemId="AccountNo"]')
				.setDisabled(boolVal);
		objCreateNewFilterPanel.down('textfield[itemId="Status"]')
				.setDisabled(boolVal);
		objCreateNewFilterPanel.down('textfield[itemId="Pending"]')
				.setDisabled(boolVal);
		objCreateNewFilterPanel.down('textfield[itemId="CompanyID"]')
				.setDisabled(boolVal);

		objCreateNewFilterPanel.down('AutoCompleter[itemId="Maker"]')
				.setDisabled(boolVal);
		objCreateNewFilterPanel.down('AutoCompleter[itemId="ReceiverId"]')
				.setDisabled(boolVal);
		objCreateNewFilterPanel.down('AutoCompleter[itemId="FileName"]')
				.setDisabled(boolVal);
		objCreateNewFilterPanel.down('AutoCompleter[itemId="TemplateName"]')
				.setDisabled(boolVal);
		objCreateNewFilterPanel.down('AutoCompleter[itemId="Channel"]')
				.setDisabled(boolVal);

		objCreateNewFilterPanel
				.down('container[itemId=effectiveDate] label[itemId="dateFilterFrom"]')
				.setDisabled(boolVal);
		objCreateNewFilterPanel
				.down('container[itemId=effectiveDate] label[itemId="dateFilterTo"]')
				.setDisabled(boolVal);

		objCreateNewFilterPanel.down('menu[itemId="creationDateMenu"]')
				.setDisabled(boolVal);
		objCreateNewFilterPanel.down('menu[itemId="processDateMenu"]')
				.setDisabled(boolVal);
		objCreateNewFilterPanel.down('menu[itemId="effectiveDateMenu"]')
				.setDisabled(boolVal);

		objCreateNewFilterPanel
				.down('container[itemId=creationDate] label[itemId="dateFilterFrom"]')
				.setDisabled(boolVal);
		objCreateNewFilterPanel
				.down('container[itemId=creationDate] label[itemId="dateFilterTo"]')
				.setDisabled(boolVal);
		objCreateNewFilterPanel.down('numberfield[itemId="AmountGreaterThan"]')
				.setDisabled(boolVal);
		objCreateNewFilterPanel.down('numberfield[itemId="AmountLessThan"]')
				.setDisabled(boolVal);
		objCreateNewFilterPanel.down('numberfield[itemId="AmountEqualTo"]')
				.setDisabled(boolVal);
		objCreateNewFilterPanel.down('textfield[itemId="filterCode"]')
				.setDisabled(boolVal);

		objCreateNewFilterPanel.down('combo[itemId="sortByCombo"]')
				.setReadOnly(boolVal);
		objCreateNewFilterPanel.down('combo[itemId="firstThenSortByCombo"]')
				.setReadOnly(boolVal);
		objCreateNewFilterPanel.down('combo[itemId="secondThenSortByCombo"]')
				.setReadOnly(boolVal);
		objCreateNewFilterPanel.down('button[itemId="sortByOptionButton"]')
				.setDisabled(boolVal);
		objCreateNewFilterPanel
				.down('button[itemId="firstThenSortByOptionButton"]')
				.setDisabled(boolVal);
		objCreateNewFilterPanel
				.down('button[itemId="secondThenSortByOptionButton"]')
				.setDisabled(boolVal);

		var productCategoryRadioGroup = objCreateNewFilterPanel
				.down('radiogroup[itemId=productCategoryRadioGroup]');
		if (!Ext.isEmpty(productCategoryRadioGroup))
			productCategoryRadioGroup.setDisabled(boolVal);

		var currencyRadioGroup = objCreateNewFilterPanel
				.down('radiogroup[itemId=currencyRadioGroup]');
		if (!Ext.isEmpty(currencyRadioGroup))
			currencyRadioGroup.setDisabled(boolVal);

		var confidentialRadioGroup = objCreateNewFilterPanel
				.down('radiogroup[itemId=confidential]');
		if (!Ext.isEmpty(confidentialRadioGroup))
			confidentialRadioGroup.setDisabled(boolVal);

		var CreditDebitFlagRadioGroup = objCreateNewFilterPanel
				.down('radiogroup[itemId=CreditDebitFlag]');
		if (!Ext.isEmpty(CreditDebitFlagRadioGroup))
			CreditDebitFlagRadioGroup.setDisabled(boolVal);

		var PrenoteRadioGroup = objCreateNewFilterPanel
				.down('radiogroup[itemId=Prenote]');
		if (!Ext.isEmpty(PrenoteRadioGroup))
			PrenoteRadioGroup.setDisabled(boolVal);
	},
	toggleView: function(btnId,collapsedState){
		var me = this;
		var advancedFilterTab = me.up('panel[itemId="advancedFilterTab"]');
		var advFilterPopUp = me.up('pmtAdvancedFilterPopup');

		var criteriaPanel = me.down('container[itemId="criteriaPanel"]');
		var tempOppositeState= !collapsedState;
		var criteriaMoreButton = me.down('button[itemId="criteriaMoreButton"]');
		var criteriaLessButton = me.down('button[itemId="criteriaLessButton"]');
		
		criteriaMoreButton.collapsed=tempOppositeState;
		criteriaLessButton.collapsed=tempOppositeState;

		var strCls = tempOppositeState === true	? 'icon-expand-rounded ux_verysmallmargin-top' : 'icon-collapse-rounded ux_verysmallmargin-top';
		
		if(!tempOppositeState){
			criteriaPanel.show();
			criteriaMoreButton.setText('Less Criteria');
		}
		else{
			criteriaPanel.hide();
			criteriaMoreButton.setText('More Criteria');
		}
		
		criteriaMoreButton.setIconCls(strCls);							
		criteriaLessButton.setIconCls(strCls);							
	},
	removeReadOnly : function(objCreateNewFilterPanel, boolVal) {
		var radioItemsCount = 0;
		var me = this;
		var clientContainer = objCreateNewFilterPanel
				.up('tabpanel[itemId=advancedFilterTab]').getTabBar()
				.down('container[itemId=clientContainer]');
		clientContainer.down('textfield[itemId="Client"]').setReadOnly(boolVal);

		objCreateNewFilterPanel.down('textfield[itemId="ClientReference"]')
				.setReadOnly(boolVal);

		objCreateNewFilterPanel.down('textfield[itemId="ProductType"]')
				.setReadOnly(boolVal);
		objCreateNewFilterPanel.down('textfield[itemId="AccountNo"]')
				.setReadOnly(boolVal);
		objCreateNewFilterPanel.down('textfield[itemId="Status"]')
				.setReadOnly(boolVal);
		objCreateNewFilterPanel.down('textfield[itemId="Pending"]')
				.setReadOnly(boolVal);
		objCreateNewFilterPanel.down('textfield[itemId="CompanyID"]')
				.setReadOnly(boolVal);

		objCreateNewFilterPanel.down('AutoCompleter[itemId="FileName"]')
				.setReadOnly(boolVal);
		objCreateNewFilterPanel.down('AutoCompleter[itemId="Maker"]')
				.setReadOnly(boolVal);
		objCreateNewFilterPanel.down('AutoCompleter[itemId="TemplateName"]')
				.setReadOnly(boolVal);
		objCreateNewFilterPanel.down('AutoCompleter[itemId="ReceiverId"]')
				.setReadOnly(boolVal);
		objCreateNewFilterPanel.down('AutoCompleter[itemId="Channel"]')
				.setReadOnly(boolVal);

		objCreateNewFilterPanel.down('textfield[itemId="filterCode"]')
				.setReadOnly(boolVal);
		objCreateNewFilterPanel.down('numberfield[itemId="AmountGreaterThan"]')
				.setReadOnly(boolVal);
		objCreateNewFilterPanel.down('numberfield[itemId="AmountLessThan"]')
				.setReadOnly(boolVal);
		objCreateNewFilterPanel.down('numberfield[itemId="AmountEqualTo"]')
				.setReadOnly(boolVal);
		objCreateNewFilterPanel.down('AutoCompleter[itemId="Channel"]')
				.setReadOnly(boolVal);

		objCreateNewFilterPanel.down('combo[itemId="sortByCombo"]')
				.setReadOnly(boolVal);
		objCreateNewFilterPanel.down('combo[itemId="firstThenSortByCombo"]')
				.setReadOnly(boolVal);
		objCreateNewFilterPanel.down('combo[itemId="secondThenSortByCombo"]')
				.setReadOnly(boolVal);

		var productCategoryRadioGroup = objCreateNewFilterPanel
				.down('radiogroup[itemId=productCategoryRadioGroup]');
		if (!Ext.isEmpty(productCategoryRadioGroup)) {
			radioItemsCount = productCategoryRadioGroup.items.items.length;
			for (var index = 0; index < radioItemsCount; index++) {
				productCategoryRadioGroup.items.items[index]
						.setReadOnly(boolVal);
			}
		}

		var currencyRadioGroup = objCreateNewFilterPanel
				.down('radiogroup[itemId=currencyRadioGroup]');
		if (!Ext.isEmpty(currencyRadioGroup)) {
			radioItemsCount = currencyRadioGroup.items.items.length;
			for (var index = 0; index < radioItemsCount; index++) {
				currencyRadioGroup.items.items[index].setReadOnly(boolVal);
			}
		}

		var confidentialRadioGroup = objCreateNewFilterPanel
				.down('radiogroup[itemId=confidential]');
		if (!Ext.isEmpty(confidentialRadioGroup)) {
			radioItemsCount = confidentialRadioGroup.items.items.length;
			for (var index = 0; index < radioItemsCount; index++) {
				confidentialRadioGroup.items.items[index].setReadOnly(boolVal);
			}
		}

		var CreditDebitFlagRadioGroup = objCreateNewFilterPanel
				.down('radiogroup[itemId=CreditDebitFlag]');
		if (!Ext.isEmpty(CreditDebitFlagRadioGroup)) {
			radioItemsCount = CreditDebitFlagRadioGroup.items.items.length;
			for (var index = 0; index < radioItemsCount; index++) {
				CreditDebitFlagRadioGroup.items.items[index]
						.setReadOnly(boolVal);
			}
		}

		var PrenoteRadioGroup = objCreateNewFilterPanel
				.down('radiogroup[itemId=Prenote]');
		if (!Ext.isEmpty(PrenoteRadioGroup)) {
			radioItemsCount = PrenoteRadioGroup.items.items.length;
			for (var index = 0; index < radioItemsCount; index++) {
				PrenoteRadioGroup.items.items[index].setReadOnly(boolVal);
			}
		}

		me.disableAllDatesMenu(objCreateNewFilterPanel, boolVal);
		me.disableAllMenuItems(objCreateNewFilterPanel, boolVal);
	}
})