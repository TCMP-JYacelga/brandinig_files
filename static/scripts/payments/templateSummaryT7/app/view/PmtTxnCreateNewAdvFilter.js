Ext.define('GCP.view.PmtTxnCreateNewAdvFilter', {
	extend : 'Ext.form.Panel',
	xtype : 'pmtTxnCreateNewAdvFilter',
	requires : ['Ext.data.Store', 'Ext.button.Button',
			'Ext.container.Container', 'Ext.form.Label', 'Ext.form.field.Date',
			'Ext.form.field.Text', 'Ext.form.field.ComboBox',
			'Ext.layout.container.HBox', 'Ext.form.field.Number',
			'Ext.toolbar.Toolbar', 'Ext.ux.gcp.AutoCompleter','Ext.ux.gcp.DateUtil'],
	callerParent : null,
	cls : 'filter-container-cls',
	config : {
		creationDateFilterVal : '',
		creationDateFilterLabel : '',
		dateHandler : null,
		effectiveDateFilterVal : null,
		effectiveDateFilterLabel : null,
		allBankProductItemChecked : true,
		allBankProductItemUnChecked : false,
		allSendingAccountItemChecked : true,
		allSendingAccountItemUnChecked : false
	},
	initComponent : function() {
		var me = this;
		me.dateHandler  = Ext.create('Ext.ux.gcp.DateUtil');
		
			var sortByOpts = Ext.create('Ext.data.Store', {
					fields : ['colId', 'colDesc'],
					data : []
				});

		var menuItems = [{
					text : getLabel('today', 'Today'),
					btnId : 'btnToday',
					btnValue : '1',
					parent : this,
					handler : function(btn, opts) {
						this.parent.dateChange(btn, opts);
					}
				}, {
					text : getLabel('yesterday', 'Yesterday'),
					btnId : 'btnYesterday',
					btnValue : '2',
					parent : this,
					handler : function(btn, opts) {
						this.parent.dateChange(btn, opts);
					}
				}, {
					text : getLabel('thisweek', 'This Week'),
					btnId : 'btnThisweek',
					btnValue : '3',
					parent : this,
					handler : function(btn, opts) {
						this.parent.dateChange(btn, opts);
					}
				}, {
					text : getLabel('lastweektodate', 'Last Week To Date'),
					btnId : 'lastweektodate',
					btnValue : '4',
					parent : this,
					handler : function(btn, opts) {
						this.parent.dateChange(btn, opts);
					}
				}, {
					text : getLabel('thismonth', 'This Month'),
					btnId : 'thismonth',
					btnValue : '5',
					parent : this,
					handler : function(btn, opts) {
						this.parent.dateChange(btn, opts);
					}
				}, {
					text : getLabel('lastMonthToDate', 'Last Month To Date'),
					btnId : 'lastMonthToDate',
					btnValue : '6',
					parent : this,
					handler : function(btn, opts) {
						this.parent.dateChange(btn, opts);
					}
				}, {
					text : getLabel('thisquarter', 'This Quarter'),
					btnId : 'thisquarter',
					btnValue : '8',
					parent : this,
					handler : function(btn, opts) {
						this.parent.dateChange(btn, opts);
					}
				}, {
					text : getLabel('lastQuarterToDate', 'Last Quarter To Date'),
					btnId : 'lastQuarterToDate',
					btnValue : '9',
					parent : this,
					handler : function(btn, opts) {
						this.parent.dateChange(btn, opts);
					}
				}, {
					text : getLabel('thisyear', 'This Year'),
					btnId : 'thisyear',
					parent : this,
					btnValue : '10',
					handler : function(btn, opts) {
						this.parent.dateChange(btn, opts);
					}
				}, {
					text : getLabel('lastyeartodate', 'Last Year To Date'),
					btnId : 'lastyeartodate',
					btnValue : '11',
					parent : this,
					handler : function(btn, opts) {
						this.parent.dateChange(btn, opts);
					}
				}, {
					text : getLabel('daterange', 'Date Range'),
					btnId : 'daterange',
					btnValue : '7',
					parent : this,
					handler : function(btn, opts) {
						this.parent.dateChange(btn, opts);
					}
				}];

		me.items = [{
			xtype : 'container',
			cls : 'filter-container-cls',
			width : 'auto',
			itemId : 'parentContainer',
			layout : 'hbox',
			defaults : {
				margin : '3 5 0 5'
			},
			items : [{
				xtype : 'container',
				flex : 1,
				layout : 'vbox',
				defaults : {
					padding : 3,
					labelAlign : 'top',
					labelSeparator : ''
				},
				items : [{
							xtype : 'AutoCompleter',
							fieldCls : 'xn-form-text w12 xn-suggestion-box',
							fieldLabel : getLabel("batchColumnClient", "Company Name"),
							name : 'Client',
							itemId : 'Client',
							cfgUrl : 'services/userseek/userclients.json',
							cfgQueryParamName : 'autofilter',
							cfgRecordCount : -1,
							cfgSeekId : 'clientId',
							cfgRootNode : 'd.preferences',
							cfgDataNode1 : 'CODE',
							cfgDataNode2 : 'DESCR',
							cfgKeyNode : 'CODE'
						}, {
							xtype : 'container',
							layout : 'hbox',
							items : [{
								xtype : 'label',
								itemId : 'creationDateLbl',
								text : getLabel('creationDate', 'Creation Date'),
								cls : 'f13',
								padding : '5 0 0 2'
							}, {
								xtype : 'button',
								border : 0,
								itemId : 'creationDateBtn',
								cls : 'xn-custom-arrow-button cursor_pointer w1',
								padding : '6 0 0 0',
								menu : Ext.create('Ext.menu.Menu', {
											itemId : 'creationDateMenu',
											items : menuItems
										})

							}]
						}, {
							xtype : 'container',
							itemId : 'creationDate',
							height : 25,
							padding : '3 0 5 6',
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
													fieldIndex : '7'
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
													fieldIndex : '7'
												}]
									}, {
										xtype : 'container',
										layout : 'hbox',
										padding : '0 0 0 3',
										items : [{
													xtype : 'label',
													itemId : 'dateFilterFrom'
												}, {
													xtype : 'label',
													itemId : 'dateFilterTo'
												}]
									}]
						}, {
							xtype : 'container',
							layout : 'vbox',
							items : [{
								xtype : 'label',
								text : getLabel("sendingAcctNo","Sending Account"),
								cls : 'f13',
								padding : '0 0 0 3'
							}, {
								xtype : 'container',
								layout : 'hbox',
								itemId : 'sendingAccountContainer',
								items : [{
											xtype : 'textfield',
											itemId : 'AccountNo',
											name : 'AccountNo',
											value : getLabel('all', 'All')
										}, {
											xtype : 'button',
											border : 0,
											itemId : 'sendingAccountDropDown',
											cls : 'xn-custom-arrow-button cursor_pointer w1',
											padding : '4 0 0 0',
											menuAlign : 'tr-br',
											menu : Ext.create('Ext.menu.Menu',
													{
														itemId : 'sendingAccountMenu',
														width : 220,
														maxHeight : 200,
														items : []
													})
										}]
							}]
						}, {
							xtype : 'numberfield',
							padding : '8 3 3 3',
							hideTrigger : true,
							fieldLabel : getLabel('amount', 'Amount'),
							itemId : 'Amount',
							name : 'Amount'
						},{
							xtype : 'AutoCompleter',
							padding : '6 3 3 3',
							fieldCls : 'xn-form-text w12 xn-suggestion-box',
							fieldLabel : getLabel("batchColumnChannel",
									"Channel"),
							itemId : 'Channel',
							name : 'Channel',
							cfgUrl : 'services/userseek/channelcodes.json',
							cfgQueryParamName : 'autofilter',
							cfgRecordCount : -1,
							cfgSeekId : 'channelId',
							cfgRootNode : 'd.preferences',
							cfgDataNode1 : 'CODE',
							cfgDataNode2 : 'DESCR',
							cfgKeyNode : 'CODE'
						}, {
							xtype : 'textfield',
							padding : '4 3 3 3',
							fieldLabel : getLabel("checkNumber", "Check Number"),
							itemId : 'MicrNo',
							name : 'MicrNo'
						},
						{
							xtype : 'container',
							layout : 'column',
							padding : '6 0 0 0',
							width : 150,
							items : [{
								xtype : 'label',
								columnWidth : 0.50,
								padding : '0 0 0 3',
								text : getLabel("sortBy","Sort By")
							}, {
								xtype : 'button',
								itemId : 'sortByOptionButton',
								columnWidth : 0.50,
								text : getLabel("ascending", "Ascending"),
								cls : 'xn-account-filter-btnmenu',
								textAlign : 'right',
								handler: function(btn) {
         if(btn.getText() === getLabel("ascending", "Ascending"))
          btn.setText(getLabel("descending", "Descending"));
         else if(btn.getText() === getLabel("descending", "Descending")) 
          btn.setText(getLabel("ascending", "Ascending"));
        }
							}]

						}, {
							xtype : 'combo',
							itemId : 'sortByCombo',
							multiSelect : false,
							editable : false,
							margin : '0 0 3 3',
							width : 142,
							fieldCls : 'xn-form-field',
							triggerBaseCls : 'xn-form-trigger',
							displayField : 'colDesc',
							valueField : 'colId',
							emptyText : getLabel("none", "None"),
							queryMode : 'local',
							store : sortByOpts
						},
						{
							xtype : 'container',
							layout : 'column',
							padding : '6 0 0 0',
							width : 150,
							items : [{
										xtype : 'label',
										columnWidth : 0.50,
										padding : '0 0 0 3',
										text : getLabel("thenSortBy",
												"Then Sort By")
									}, {
										xtype : 'button',
										itemId : 'thirdThenSortByOptionButton',
										columnWidth : 0.50,
										text : getLabel("ascending",
												"Ascending"),
										cls : 'xn-account-filter-btnmenu',
										textAlign : 'right',
										handler: function(btn) {
         if(btn.getText() === getLabel("ascending", "Ascending"))
          btn.setText(getLabel("descending", "Descending"));
         else if(btn.getText() === getLabel("descending", "Descending")) 
          btn.setText(getLabel("ascending", "Ascending"));
        }
									}]

						}, {
							xtype : 'combo',
							itemId : 'thirdThenSortByCombo',
							multiSelect : false,
							editable : false,
							margin : '0 0 3 3',
							width : 142,
							fieldCls : 'xn-form-field',
							triggerBaseCls : 'xn-form-trigger',
							displayField : 'colDesc',
							valueField : 'colId',
							emptyText : getLabel("none", "None"),
							queryMode : 'local',
							store : sortByOpts
						}]
			}, {
				xtype : 'container',
				// columnWidth: 0.33,
				flex : 1,
				layout : 'vbox',
				defaults : {
					padding : 3,
					labelAlign : 'top',
					labelSeparator : ''
				},
				items : [{
							xtype : 'textfield',
							fieldLabel : getLabel("myProduct", "My Product"),
							itemId : 'ProductType',
							disabled : true,
							name : 'ProductType'
						}, {
							xtype : 'container',
							layout : 'hbox',
							items : [{
										xtype : 'label',
										itemId : 'processLbl',
										text : getLabel('processDate',
												'Process Date'),
										cls : 'f13',
										padding : '4 0 0 2'
									}, {
										xtype : 'button',
										border : 0,
										itemId : 'processDateBtn',
										cls : 'xn-custom-arrow-button cursor_pointer w1',
										padding : '5 0 0 0',
										menu : Ext.create('Ext.menu.Menu', {
													itemId : 'processDateMenu',
													items : menuItems
												})

									}]
						}, {
							xtype : 'container',
							padding : '0 0 2 5',

							height : 25,
							itemId : 'processDate',
							items : [{
										xtype : 'container',
										itemId : 'dateRangeComponent',
										layout : 'hbox',
										hidden : true,
										items : [{
													xtype : 'datefield',
													itemId : 'processFromDate',
													hideTrigger : true,
													width : 70,
													fieldCls : 'h2',
													cls : 'date-range-font-size',
													padding : '0 3 0 0',
													editable : false
												}, {
													xtype : 'datefield',
													itemId : 'processToDate',
													hideTrigger : true,
													padding : '0 3 0 0',
													editable : false,
													width : 70,
													fieldCls : 'h2',
													cls : 'date-range-font-size'
												}]
									}, {
										xtype : 'container',
										layout : 'hbox',
										padding : '0 0 0 3',
										items : [{
													xtype : 'label',
													itemId : 'dateFilterFrom'
												}, {
													xtype : 'label',
													itemId : 'dateFilterTo'
												}]
									}]
						}, {

							xtype : 'textfield',
							fieldLabel : getLabel("receiverAcctNo",
									"Receiver Account"),
							itemId : 'ReceiverAccount',
							name : 'ReceiverAccount'
						},
						{
							xtype : 'textfield',
							fieldLabel : getLabel("batchAdvFltFileName",
									"File Name"),
							itemId : 'FileName',
							name : 'FileName'
						}, {
							xtype : 'AutoCompleter',
							fieldCls : 'xn-form-text w12 xn-suggestion-box',
							fieldLabel : getLabel("batchPopUpTemplateName",
									"Template Name"),
							itemId : 'TemplateName',
							name : 'TemplateName',
							cfgUrl : 'services/paymenttemplates.json',
							cfgRecordCount : -1,
							cfgSeekId : 'templateId',
							cfgRootNode : 'd.paymenttemplates',
							cfgDataNode1 : 'clientReference',
							cfgKeyNode : 'clientReference'
						}, {
							xtype : 'AutoCompleter',
							fieldCls : 'xn-form-text w12 xn-suggestion-box',
							fieldLabel : getLabel("entryUser", "Entry User"),
							itemId : 'Maker',
							name : 'Maker',
							cfgUrl : 'services/userseek/corpuser.json',
							cfgQueryParamName : '$autofilter',
							cfgRecordCount : -1,
							cfgSeekId : 'entryUserId',
							cfgRootNode : 'd.preferences',
							cfgDataNode1 : 'CODE',
							cfgDataNode2 : 'DESCR',
							cfgKeyNode : 'CODE'
						}, {
							xtype : 'container',
							layout : 'column',
							padding : '6 0 0 0',
							width : 150,
							items : [{
										xtype : 'label',
										columnWidth : 0.50,
										padding : '0 0 0 3',
										text : getLabel("thenSortBy",
												"Then Sort By")
									}, {
										xtype : 'button',
										itemId : 'firstThenSortByOptionButton',
										columnWidth : 0.50,
										text : getLabel("ascending",
												"Ascending"),
										cls : 'xn-account-filter-btnmenu',
										textAlign : 'right',
										handler: function(btn) {
         if(btn.getText() === getLabel("ascending", "Ascending"))
          btn.setText(getLabel("descending", "Descending"));
         else if(btn.getText() === getLabel("descending", "Descending")) 
          btn.setText(getLabel("ascending", "Ascending"));
        }
									}]

						}, {
							xtype : 'combo',
							itemId : 'firstThenSortByCombo',
							multiSelect : false,
							editable : false,
							margin : '0 0 3 3',
							width : 142,
							fieldCls : 'xn-form-field',
							triggerBaseCls : 'xn-form-trigger',
							displayField : 'colDesc',
							valueField : 'colId',
							emptyText : getLabel("none", "None"),
							queryMode : 'local',
							store : sortByOpts
						} ]
			}, {
				xtype : 'container',
				flex : 1,
				parent : this,
				itemId : "productContainer",
				layout : 'vbox',
				defaults : {
					padding : 3,
					labelAlign : 'top',
					labelSeparator : ''
				},
				items : [{
					xtype : 'container',
					layout : 'vbox',
					items : [{
								xtype : 'label',
								text : getLabel("BankProduct", "Bank Product"),
								cls : 'f13',
								padding : '3 0 0 3'
							}, {
								xtype : 'container',
								layout : 'hbox',
								itemId : 'bankProductContainer',
								items : [{
											xtype : 'textfield',
											itemId : 'BankProduct',
											name : 'BankProduct',
											value : getLabel('all', 'All')
										}, {
											xtype : 'button',
											border : 0,
											itemId : 'bankProductBtn',
											cls : 'xn-custom-arrow-button cursor_pointer w1',
											padding : '5 0 0 0',
											menuAlign : 'tr-br',
											menu : Ext.create('Ext.menu.Menu',
													{
														itemId : 'bankProductMenu',
														width : 220,
														maxHeight : 200,
														items : []
													})
										}]
							}]
				}, {
					xtype : 'container',
					layout : 'hbox',
					items : [{
						xtype : 'label',
						itemId : 'effectiveDateLbl',
						text : getLabel('batchColumnEffectiveDate',
								'Effective Date'),
						cls : 'f13',
						padding : '8 0 0 3'
					}, {
						xtype : 'button',
						border : 0,
						itemId : 'effectiveDateBtn',
						cls : 'xn-custom-arrow-button cursor_pointer w1',
						padding : '8 0 0 0',
						menu : Ext.create('Ext.menu.Menu', {
									itemId : 'effectiveDateMenu',
									items : menuItems
								})

					}]
				}, {
					xtype : 'container',
					padding : '2 0 5 5',
					height : 25,
					itemId : 'effectiveDate',
					items : [{
								xtype : 'container',
								itemId : 'dateRangeComponent',
								layout : 'hbox',
								hidden : true,
								items : [{
											xtype : 'datefield',
											itemId : 'effectiveFromDate',
											hideTrigger : true,
											width : 70,
											fieldCls : 'h2',
											cls : 'date-range-font-size',
											padding : '0 3 0 0',
											editable : false
										}, {
											xtype : 'datefield',
											itemId : 'effectiveToDate',
											hideTrigger : true,
											padding : '0 3 0 0',
											editable : false,
											width : 70,
											fieldCls : 'h2',
											cls : 'date-range-font-size'
										}]
							}, {
								xtype : 'container',
								layout : 'hbox',
								padding : '0 0 0 3',
								items : [{
											xtype : 'label',
											itemId : 'dateFilterFrom'
										}, {
											xtype : 'label',
											itemId : 'dateFilterTo'
										}]
							}]
				}, {
					xtype : 'textfield',
					fieldLabel : getLabel("receivingAcctName",
							"Receiving Account Name"),
					itemId : 'ReceiverName',
					name : 'ReceiverName'
				}, {
					xtype : 'AutoCompleter',
					fieldCls : 'xn-form-text w12 xn-suggestion-box',
					fieldLabel : getLabel("typeofTxn", "Type of Transaction"),
					itemId : 'InstrumentType',
					name : 'InstrumentType',
					cfgUrl : 'services/instrumentType.json',
					cfgQueryParamName : '$autofilter',
					cfgRecordCount : -1,
					cfgSeekId : 'entryUserId',
					cfgRootNode : 'd.instrumentType',
					cfgDataNode1 : 'instTypeDescription',
					cfgDataNode2 : 'instTypeCode',
					cfgKeyNode : 'instTypeDescription'
				}, {
					xtype : 'textfield',
					fieldLabel : getLabel("batchColumnClientReference",
							"Payment Reference"),
					itemId : 'ClientReference',
					name : 'ClientReference'
				}, {
					xtype : 'textfield',
					itemId : 'saveFilterAs',
					name : 'saveFilterAs',
					fieldLabel : getLabel('saveFilterAs', 'Save Filter As'),
					labelWidth : 150,
					enforceMaxLength : true,
					enableKeyEvents : true,
					maxLength : 20,
					msgTarget : 'under'
				},{
							xtype : 'container',
							layout : 'column',
							padding : '6 0 0 0',
							width : 150,
							items : [{
										xtype : 'label',
										columnWidth : 0.50,
										padding : '0 0 0 3',
										text : getLabel("thenSortBy", "Then Sort By")
									},
									
										{
										xtype : 'button',
										itemId : 'secondThenSortByOptionButton',
										columnWidth : 0.50,
										text : getLabel("ascending",
												"Ascending"),
										cls : 'xn-account-filter-btnmenu',
										textAlign : 'right',
										handler: function(btn) {
         if(btn.getText() === getLabel("ascending", "Ascending"))
          btn.setText(getLabel("descending", "Descending"));
         else if(btn.getText() === getLabel("descending", "Descending")) 
          btn.setText(getLabel("ascending", "Ascending"));
        }
									}]

						}, {
							xtype : 'combo',
							itemId : 'secondThenSortByCombo',
							multiSelect : false,
							editable : false,
							margin : '0 0 3 3',
							width : 142,
							fieldCls : 'xn-form-field',
							triggerBaseCls : 'xn-form-trigger',
							displayField : 'colDesc',
							valueField : 'colId',
							emptyText : getLabel("none", "None"),
							queryMode : 'local',
							store : sortByOpts
						}]
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
								cls : 'xn-button',
								text : getLabel('btnSearch', 'Search'),
								itemId : 'searchBtn',
								handler : function(btn) {
									me.fireEvent('handleSearchAction');
								}
							}, {
								xtype : 'button',
								cls : 'xn-button',
								text : getLabel('btnSaveAndSearch',
										'Save And Search'),
								itemId : 'saveAndSearchBtn',
								handler : function(btn) {
									me
											.fireEvent('handleSaveAndSearchGridAction');
								}
							}, {
								xtype : 'button',
								cls : 'xn-button',
								text : getLabel('btnCancel', 'Cancel'),
								itemId : 'cancelBtn',
								handler : function(btn) {
									me.fireEvent('closeFilterPopup');
								}
							}]
				}]

		this.callParent(arguments);
	},
	addColumnsToSortCombos:function(objCreateNewFilterPanel){
		var me=this;
		var sortByComboRef=objCreateNewFilterPanel.down('combo[itemId="sortByCombo"]');
		if(!Ext.isEmpty(sortByComboRef)){
			var columns=objDefaultTxnViewPref[0].gridCols;
			sortByComboRef.getStore().loadData(columns);
		}
	},
	addSendingAccountsMenuItems : function() {
		var me = this;
		var menuRef = me.down('menu[itemId=sendingAccountMenu]');
		Ext.Ajax.request({
					url : 'services/userseek/debitaccounts.json',
					method : 'GET',
					success : function(response) {
						var responseData = Ext.decode(response.responseText);
						var data = responseData.d.preferences;
						me.loadSendingAccountMenu(data, menuRef);
					},
					failure : function() {
						// console.log("Error Occured - Addition Failed");

					}
				});
	},
	addBankProductsMenuItems : function() {
		var me = this;
		var menuRef = me.down('menu[itemId=bankProductMenu]');
		Ext.Ajax.request({
					url : 'services/userseek/bankproducts.json?$top=-1',
					method : 'GET',
					success : function(response) {
						var responseData = Ext.decode(response.responseText);
						var data = responseData.d.preferences;
						me.loadBankProductMenu(data, menuRef);
					},
					failure : function() {
						// console.log("Error Occured - Addition Failed");

					}
				});
	},
	setSortByComboFields : function(objCreateNewFilterPanel, fieldName, columnId,buttonText,disableFlag) {
		if (!Ext.isEmpty(fieldName)) {
			if (fieldName === 'SortBy') {
				//sortBySortOptionButton
				if(!Ext.isEmpty(buttonText)){
				var sortByButtonRef= objCreateNewFilterPanel.down('button[itemId="sortByOptionButton"]');
				if(!Ext.isEmpty(sortByButtonRef))
				sortByButtonRef.setText(buttonText);
				sortByButtonRef.setDisabled(disableFlag);
				}
				
				// Sort By
				if(!Ext.isEmpty(columnId)){
				var sortByComboRef = objCreateNewFilterPanel.down('combo[itemId="sortByCombo"]');
				if (!Ext.isEmpty(sortByComboRef)) {
					sortByComboRef.setValue(columnId);
					sortByComboRef.setReadOnly(disableFlag);
				}
				}

			} else if (fieldName === 'FirstThenSortBy') {
				// firstThenSortBySortOption
				if(!Ext.isEmpty(buttonText)){
				var thenSortByButtonRef = objCreateNewFilterPanel.down('button[itemId="firstThenSortByOptionButton"]');
				if(!Ext.isEmpty(thenSortByButtonRef))
				thenSortByButtonRef.setText(buttonText);
				thenSortByButtonRef.setDisabled(disableFlag);
				}

				// First Then Sort By
					if(!Ext.isEmpty(columnId)){
				var firstThenSortByCombo = objCreateNewFilterPanel.down('combo[itemId="firstThenSortByCombo"]');
					if (!Ext.isEmpty(firstThenSortByCombo)) {
					firstThenSortByCombo.setValue(columnId);
					firstThenSortByCombo.setReadOnly(disableFlag);
				}
					}

			} else if (fieldName === 'SecondThenSortBy') {
				// secondThenSortBySortOption
				if(!Ext.isEmpty(buttonText)){
				var thenSortByButtonRef = objCreateNewFilterPanel.down('button[itemId="secondThenSortByOptionButton"]');
				if(!Ext.isEmpty(thenSortByButtonRef))
				thenSortByButtonRef.setText(buttonText);
				thenSortByButtonRef.setDisabled(disableFlag);
				}
				
				// Second Then Sort By
					if(!Ext.isEmpty(columnId)){
				var secondThenSortByComboRef = objCreateNewFilterPanel.down('combo[itemId="secondThenSortByCombo"]');
				if (!Ext.isEmpty(secondThenSortByComboRef)) {
					secondThenSortByComboRef.setValue(columnId);
					secondThenSortByComboRef.setReadOnly(disableFlag);
				}
					}
			} else if (fieldName === 'ThirdThenSortBy') {
				// thirdThenSortBySortOption
				if(!Ext.isEmpty(buttonText)){
				var thenSortByButtonRef = objCreateNewFilterPanel.down('button[itemId="thirdThenSortByOptionButton"]');
				if(!Ext.isEmpty(thenSortByButtonRef))
				thenSortByButtonRef.setText(buttonText);
				thenSortByButtonRef.setDisabled(disableFlag);
				}
				
				// Third Then Sort By
					if(!Ext.isEmpty(columnId)){
				var thirdThenSortByComboRef = objCreateNewFilterPanel.down('combo[itemId="thirdThenSortByCombo"]');
				if (!Ext.isEmpty(thirdThenSortByComboRef)) {
					thirdThenSortByComboRef.setValue(columnId);
					thirdThenSortByComboRef.setReadOnly(disableFlag);
				}
					}
			}
		}
	},
	setSavedFilterDates : function(objCreateNewFilterPanel, dateType, data,
			menuDisableFlag) {
		if (!Ext.isEmpty(dateType) && !Ext.isEmpty(data)) {
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

			menuRef.setDisabled(menuDisableFlag);
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
	checkUnCheckMenuItems : function(advFilterPanelViewRef, componentName,
			data, enableDisableFlag) {
		var menuRef = '';
		if (componentName === 'BankProduct') {
			menuRef = advFilterPanelViewRef
					.down('menu[itemId=bankProductMenu]');
		} else {
			menuRef = advFilterPanelViewRef
					.down('menu[itemId=sendingAccountMenu]');
		}

		var itemArray = menuRef.items.items;

		if (data === 'All') {
			for (var index = 0; index < itemArray.length; index++) {
				itemArray[index].setChecked(true);
				itemArray[index].setDisabled(enableDisableFlag);
			}
		} else {
			for (var index = 0; index < itemArray.length; index++) {
				itemArray[index].setChecked(false);
				itemArray[index].setDisabled(enableDisableFlag);
			}

			var dataArray = data.split(',');
			for (var dataIndex = 0; dataIndex < dataArray.length; dataIndex++) {
				for (var index = 1; index < itemArray.length; index++) {
					if (dataArray[dataIndex] == itemArray[index].text) {
						itemArray[index].setChecked(true);
						itemArray[index].setDisabled(enableDisableFlag);
					}
				}
			}

		}
	},
	loadSendingAccountMenu : function(data, menuRef) {
		var me = this;
		if (!Ext.isEmpty(data)) {
			var count = data.length;
			if (count > 0) {
				menuRef.add({
					xtype : 'menucheckitem',
					text : getLabel('all', 'All'),
					checked : true,
					listeners : {
						checkchange : function(item, checked) {
							me.sendingAccMenuAllHandler(item, checked, menuRef);
						}
					}
				});

				for (var index = 0; index < count; index++) {
					menuRef.add({
								xtype : 'menucheckitem',
								text : data[index].CODE,
								checked : true,
								listeners : {
									checkchange : function(item, checked) {
										me.updateSendingAccountTextField(item,
												checked, menuRef);
									}
								}
							});

				}
			}
		}
	},
	loadBankProductMenu : function(data, menuRef) {
		var me = this;
		if (!Ext.isEmpty(data)) {
			var count = data.length;
			if (count > 0) {
				menuRef.add({
							xtype : 'menucheckitem',
							text : getLabel('all', 'All'),
							checked : true,
							listeners : {
								checkchange : function(item, checked) {
									me.bankProductMenuAllHandler(item, checked,
											menuRef);
								}
							}
						});

				for (var index = 0; index < count; index++) {
					menuRef.add({
								xtype : 'menucheckitem',
								text : data[index].CODE,
								checked : true,
								listeners : {
									checkchange : function(item, checked) {
										me.updateBankProductTextField(item,
												checked, menuRef);
									}
								}
							});

				}
			}
		}
	},
	sendingAccMenuAllHandler : function(item, checked, menuRef) {
		var me = this;
		var sendingAccountTextField = me
				.down('container[itemId="sendingAccountContainer"] textfield[itemId="AccountNo"]');
		var itemArray = menuRef.items.items;
		if (checked) {
			me.allSendingAccountItemChecked = true;
			for (var index = 1; index < itemArray.length; index++) {
				itemArray[index].setChecked(true);
			}
			if (!Ext.isEmpty(sendingAccountTextField)) {
				sendingAccountTextField.setValue(getLabel('all', 'All'));
			}
		} else if (!me.allSendingAccountItemUnChecked && !checked) {
			me.allSendingAccountItemChecked = false;
			me.allSendingAccountItemUnChecked = false;
			for (var index = 1; index < itemArray.length; index++) {
				sendingAccountTextField.setValue('');
				itemArray[index].setChecked(false);
			}
		} else {
			me.allSendingAccountItemUnChecked = false;
		}
	},
	bankProductMenuAllHandler : function(item, checked, menuRef) {
		var me = this;
		var myProductTextField = me
				.down('container[itemId="bankProductContainer"] textfield[itemId="BankProduct"]');
		var itemArray = menuRef.items.items;
		if (checked) {
			me.allBankProductItemChecked = true;
			for (var index = 1; index < itemArray.length; index++) {
				itemArray[index].setChecked(true);
			}

			if (!Ext.isEmpty(myProductTextField)) {
				myProductTextField.setValue(getLabel('all', 'All'));
			}

		} else if (!me.allBankProductItemUnChecked && !checked) {
			me.allBankProductItemChecked = false;
			me.allBankProductItemUnChecked = false;
			for (var index = 1; index < itemArray.length; index++) {
				myProductTextField.setValue('');
				itemArray[index].setChecked(false);
			}
		} else {
			me.allBankProductItemUnChecked = false;
		}
	},
	updateSendingAccountTextField : function(item, checked, menuRef) {
		var me = this;
		var maxCountReach = false;
		if (!Ext.isEmpty(menuRef)) {
			var itemArray = menuRef.items.items;
			var itemArrayLength = itemArray.length;
			var sendingAccountTextField = me
					.down('container[itemId="sendingAccountContainer"] textfield[itemId="AccountNo"]');
			var textFieldData = '';

			if (!me.allSendingAccountItemChecked && checked) {
				me.allSendingAccountItemUnChecked = false;
				var count = 1;
				for (var index = 1; index < itemArrayLength; index++) {
					if (itemArray[index].checked) {
						textFieldData += itemArray[index].text + ',';
						count++;
					}
				}
				if (count == itemArrayLength) {
					maxCountReach = true;
				}

			} else if (me.allSendingAccountItemChecked && !checked) {
				if (itemArray[0].checked) {
					me.allSendingAccountItemUnChecked = true;
					me.allSendingAccountItemChecked = false;
					itemArray[0].setChecked(false);
				}

				for (var index = 1; index < itemArrayLength; index++) {
					if (itemArray[index].checked) {
						textFieldData += itemArray[index].text + ',';
					}
				}
			} else if (!me.allSendingAccountItemChecked && !checked) {
				me.allSendingAccountItemUnChecked = false;
				for (var index = 1; index < itemArrayLength; index++) {
					if (itemArray[index].checked) {
						textFieldData += itemArray[index].text + ',';
					}
				}
			}

			if (maxCountReach) {
				itemArray[0].setChecked(true);
			} else {
				var commaSeparatedString = textFieldData.substring(0,
						(textFieldData.length - 1));
				sendingAccountTextField.setValue('');
				sendingAccountTextField.setValue(commaSeparatedString);
			}
		}
	},
	updateBankProductTextField : function(item, checked, menuRef) {
		var me = this;
		var maxCountReach = false;

		if (!Ext.isEmpty(menuRef)) {
			var itemArray = menuRef.items.items;
			var itemArrayLength = itemArray.length;
			var myProductTextField = me
					.down('container[itemId="bankProductContainer"] textfield[itemId="BankProduct"]');
			var textFieldData = '';

			if (!me.allBankProductItemChecked && checked) {
				me.allBankProductItemUnChecked = false;
				var count = 1;
				for (var index = 1; index < itemArrayLength; index++) {
					if (itemArray[index].checked) {
						textFieldData += itemArray[index].text + ',';
						count++;
					}
				}
				if (count == itemArrayLength) {
					maxCountReach = true;
				}

			} else if (me.allBankProductItemChecked && !checked) {
				if (itemArray[0].checked) {
					me.allBankProductItemUnChecked = true;
					me.allBankProductItemChecked = false;
					itemArray[0].setChecked(false);
				}

				for (var index = 1; index < itemArrayLength; index++) {
					if (itemArray[index].checked) {
						textFieldData += itemArray[index].text + ',';
					}
				}
			} else if (!me.allBankProductItemChecked && !checked) {
				me.allBankProductItemUnChecked = false;
				for (var index = 1; index < itemArrayLength; index++) {
					if (itemArray[index].checked) {
						textFieldData += itemArray[index].text + ',';
					}
				}
			}

			if (maxCountReach) {
				itemArray[0].setChecked(true);
			} else {
				var commaSeparatedString = textFieldData.substring(0,
						(textFieldData.length - 1));
				myProductTextField.setValue('');
				myProductTextField.setValue(commaSeparatedString);
			}
		}
	},
	dateChange : function(btn, opts) {
		var me = this;
		if (btn.parentMenu.itemId == "processDateMenu")
			me.processFilterDateChange(btn, opts);
		if (btn.parentMenu.itemId == "effectiveDateMenu")
			me.effectiveFilterDateChange(btn, opts);
		if (btn.parentMenu.itemId == "creationDateMenu")
			me.creationFilterDateChange(btn, opts);
	},
	processFilterDateChange : function(btn, opts) {
		var me = this;
		me.dateFilterVal = btn.btnValue;
		me.dateFilterLabel = btn.text;
		me.handleProcessDateChange(btn.btnValue);
	},
	effectiveFilterDateChange : function(btn, opts) {
		var me = this;
		me.effectiveDateFilterVal = btn.btnValue;
		me.effectiveDateFilterLabel = btn.text;
		me.handleEffectiveDateChange(btn.btnValue);
	},
	handleProcessDateChange : function(index) {
		var me = this;
		var processDateRangeComponent = me
				.down('container[itemId=processDate] container[itemId="dateRangeComponent"]');
		var processDateLabel = me.down('label[itemId=processLbl]');
		var fromDateLabel = me
				.down('container[itemId=processDate] label[itemId="dateFilterFrom"]');
		var toDateLabel = me
				.down('container[itemId=processDate] label[itemId=dateFilterTo]');

		var dateRangeFromDateRef = me
				.down('datefield[itemId="processFromDate"]');
		var dateRangeToDateRef = me.down('datefield[itemId="processToDate"]');
		var objDateParams = me.getDateParam(index, dateRangeFromDateRef,
				dateRangeToDateRef);

		if (index == '7') {
			fromDateLabel.hide();
			toDateLabel.hide();
			processDateRangeComponent.show();
			dateRangeFromDateRef.setVisible(true);
			dateRangeToDateRef.setVisible(true);
		} else {
			processDateRangeComponent.hide();
			fromDateLabel.show();
			toDateLabel.show();
		}

		if (!Ext.isEmpty(me.dateFilterLabel)) {
			processDateLabel.setText(getLabel('processDate', 'Process Date')
					+ " (" + me.dateFilterLabel + ")");
		}

		if (index !== '7') {
			var vFromDate = Ext.util.Format.date(Ext.Date.parse(
							objDateParams.fieldValue1, 'Y-m-d'),
					strExtApplicationDateFormat);
			var vToDate = Ext.util.Format.date(Ext.Date.parse(
							objDateParams.fieldValue2, 'Y-m-d'),
					strExtApplicationDateFormat);

			if (index === '1' || index === '2') {
				fromDateLabel.setText(vFromDate);
				toDateLabel.setText("");

				me.ribbonFromDate = vFromDate;
				me.ribbonToDate = vToDate;
			} else {
				fromDateLabel.setText(vFromDate + " - ");
				toDateLabel.setText(vToDate);

				me.ribbonFromDate = vFromDate + " - ";
				me.ribbonToDate = vToDate;
			}
		}
	},
	handleEffectiveDateChange : function(index) {
		var me = this;
		var effectiveDateRangeComponent = me
				.down('container[itemId=effectiveDate] container[itemId="dateRangeComponent"]');
		var effectiveDateLabel = me.down('label[itemId=effectiveDateLbl]');
		var fromDateLabel = me
				.down('container[itemId=effectiveDate] label[itemId="dateFilterFrom"]');
		var toDateLabel = me
				.down('container[itemId=effectiveDate] label[itemId="dateFilterTo"]');

		var dateRangeFromDateRef = me
				.down('datefield[itemId="effectiveFromDate"]');
		var dateRangeToDateRef = me.down('datefield[itemId="effectiveToDate"]');
		var objDateParams = me.getDateParam(index, dateRangeFromDateRef,
				dateRangeToDateRef);

		if (index == '7') {
			effectiveDateRangeComponent.show();
			dateRangeFromDateRef.setVisible(true);
			dateRangeToDateRef.setVisible(true);
			fromDateLabel.hide();
			toDateLabel.hide();
		} else {
			effectiveDateRangeComponent.hide();
			fromDateLabel.show();
			toDateLabel.show();
		}

		if (!Ext.isEmpty(me.effectiveDateFilterLabel)) {
			effectiveDateLabel.setText(getLabel('batchColumnEffectiveDate',
					'Effective Date')
					+ " (" + me.effectiveDateFilterLabel + ")");
		}
		if (index !== '7') {
			var vFromDate = Ext.util.Format.date(Ext.Date.parse(
							objDateParams.fieldValue1, 'Y-m-d'),
					strExtApplicationDateFormat);
			var vToDate = Ext.util.Format.date(Ext.Date.parse(
							objDateParams.fieldValue2, 'Y-m-d'),
					strExtApplicationDateFormat);
			if (index === '1' || index === '2') {
				fromDateLabel.setText(vFromDate);
				toDateLabel.setText("");
			} else {
				fromDateLabel.setText(vFromDate + " - ");
				toDateLabel.setText(vToDate);
			}
		}
	},
	creationFilterDateChange : function(btn, opts) {
		var me = this;
		me.creationDateFilterVal = btn.btnValue;
		me.creationDateFilterLabel = btn.text;
		me.handleCreationDateChange(btn.btnValue);
	},
	handleCreationDateChange : function(index) {
		var me = this;
		var creationDateRangeComponent = me
				.down('container[itemId=creationDate] container[itemId="dateRangeComponent"]');
		var fromDateLabel = me
				.down('container[itemId=creationDate] label[itemId="dateFilterFrom"]');
		var toDateLabel = me
				.down('container[itemId=creationDate] label[itemId="dateFilterTo"]');
		var creationDateLabel = me.down('label[itemId=creationDateLbl]');
		var dateRangeFromDateRef = me
				.down('datefield[itemId="creationFromDate"]');
		var dateRangeToDateRef = me.down('datefield[itemId="creationToDate"]');
		var objDateParams = me.getDateParam(index, dateRangeFromDateRef,
				dateRangeToDateRef);

		if (index == '7') {
			creationDateRangeComponent.show();
			dateRangeFromDateRef.setVisible(true);
			dateRangeToDateRef.setVisible(true);
			fromDateLabel.hide();
			toDateLabel.hide();
		} else {
			creationDateRangeComponent.hide();
			fromDateLabel.show();
			toDateLabel.show();
		}

		if (!Ext.isEmpty(creationDateLabel)) {
			creationDateLabel.setText(getLabel('creationDate', 'Creation Date')
					+ " (" + me.creationDateFilterLabel + ")");
		}
		if (index !== '7') {
			var vFromDate = Ext.util.Format.date(Ext.Date.parse(
							objDateParams.fieldValue1, 'Y-m-d'),
					strExtApplicationDateFormat);
			var vToDate = Ext.util.Format.date(Ext.Date.parse(
							objDateParams.fieldValue2, 'Y-m-d'),
					strExtApplicationDateFormat);
			if (index === '1' || index === '2') {
				fromDateLabel.setText(vFromDate);
				toDateLabel.setText("");
			} else {
				fromDateLabel.setText(vFromDate + " - ");
				toDateLabel.setText(vToDate);
			}
		}
	},
	getDateParam : function(index, dateRangeFromDateRef, dateRangeToDateRef) {
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
			case '7' :
				// Date Range
				if (!Ext.isEmpty(dateRangeFromDateRef)
						&& !Ext.isEmpty(dateRangeToDateRef)) {
					var frmDate = dateRangeFromDateRef.getValue();
					var toDate = dateRangeToDateRef.getValue();
					fieldValue1 = Ext.Date.format(frmDate, strSqlDateFormat);
					fieldValue2 = Ext.Date.format(toDate, strSqlDateFormat);
					operator = 'bt';
				}
				break;
			case '6' :
				// Last Month To Date
				dtJson = objDateHandler.getLastMonthToDate(date);
				fieldValue1 = Ext.Date
						.format(dtJson.fromDate, strSqlDateFormat);
				fieldValue2 = Ext.Date.format(dtJson.toDate, strSqlDateFormat);
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
		}
		retObj.fieldValue1 = fieldValue1;
		retObj.fieldValue2 = fieldValue2;
		retObj.operator = operator;
		return retObj;
	},
	getAdvancedFilterSortByJson:function(objOfCreateNewFilter){
		var objJson = null;
		var jsonArray = [];
		var sortByOption='asc';
		var firstThenSortByOption='asc';
		var secondThenSortByOption='asc';
		var thirdThenSortByOption='asc';
		
		//sortBySortOption
		var buttonText=objOfCreateNewFilter.down('button[itemId="sortByOptionButton"]').getText();
		if(buttonText!==getLabel("ascending","Ascending"))
		sortByOption='desc';
		
		//firstThenSortBySortOption
		var buttonText=objOfCreateNewFilter.down('button[itemId="firstThenSortByOptionButton"]').getText();
		if(buttonText!==getLabel("ascending","Ascending"))
		firstThenSortByOption='desc';
		
		//secondThenSortBySortOption
		var buttonText=objOfCreateNewFilter.down('button[itemId="secondThenSortByOptionButton"]').getText();
		if(buttonText!==getLabel("ascending","Ascending"))
		secondThenSortByOption='desc';		
		
		//thirdThenSortBySortOption
		var buttonText=objOfCreateNewFilter.down('button[itemId="thirdThenSortByOptionButton"]').getText();
		if(buttonText!==getLabel("ascending","Ascending"))
		thirdThenSortByOption='desc';		
		
		
		
		// Sort By
		var sortByCombo = objOfCreateNewFilter.down('combo[itemId="sortByCombo"]').getValue();
		if (!Ext.isEmpty(sortByCombo)) {
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
		var firstThenSortByCombo = objOfCreateNewFilter.down('combo[itemId="firstThenSortByCombo"]').getValue();
		if (!Ext.isEmpty(firstThenSortByCombo)) {
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
		var secondThenSortByCombo = objOfCreateNewFilter.down('combo[itemId="secondThenSortByCombo"]').getValue();
		if (!Ext.isEmpty(secondThenSortByCombo)) {
			jsonArray.push({
						field : 'ThenSortBy',
						operator : 'st',
						value1 : secondThenSortByCombo,
						value2 : secondThenSortByOption,
						dataType : 0,
						displayType : 6
					});
		}
		
		// Third Then Sort By
		var thirdThenSortByCombo = objOfCreateNewFilter.down('combo[itemId="thirdThenSortByCombo"]').getValue();
		if (!Ext.isEmpty(thirdThenSortByCombo)) {
			jsonArray.push({
						field : 'ThenSortBy',
						operator : 'st',
						value1 : thirdThenSortByCombo,
						value2 : thirdThenSortByOption,
						dataType : 0,
						displayType : 6
					});
		}
		
		objJson = jsonArray;
		return objJson;
		
	},
	getAdvancedFilterQueryJson : function(objOfCreateNewFilter) {
		var objJson = null;
		var jsonArray = [];

		// Client
		var client = objOfCreateNewFilter
				.down('AutoCompleter[itemId="Client"]').getValue();
		if (!Ext.isEmpty(client)) {
			jsonArray.push({
						field : 'Client',
						operator : 'eq',
						value1 : client,
						value2 : '',
						dataType : 0,
						displayType : 6
					});
		}

		// paymentReference
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

		// Product Type
		var ProductType = objOfCreateNewFilter
				.down('textfield[itemId="ProductType"]').getValue();
		if (!Ext.isEmpty(ProductType)) {
			jsonArray.push({
						field : 'ProductType',
						operator : 'lk',
						value1 : ProductType,
						value2 : '',
						dataType : 0,
						displayType : 0
					});
		}

		// Bank Product
		var bankProduct = objOfCreateNewFilter
				.down('textfield[itemId="BankProduct"]').getValue();
		if (!Ext.isEmpty(bankProduct)) {
			jsonArray.push({
						field : 'BankProduct',
						operator : 'in',
						value1 : bankProduct,
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

		// Amount
		var amount = objOfCreateNewFilter.down('numberfield[itemId="Amount"]')
				.getValue();
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

		// receiver account #
		var receiverAcctNo = objOfCreateNewFilter
				.down('textfield[itemId="ReceiverAccount"]').getValue();
		if (!Ext.isEmpty(receiverAcctNo)) {
			jsonArray.push({
						field : 'ReceiverAccount',
						operator : 'lk',
						value1 : receiverAcctNo,
						value2 : '',
						dataType : 0,
						displayType : 0
					});
		}

		// reciever account Name
		var receiverAcctName = objOfCreateNewFilter.down('textfield[itemId="ReceiverName"]').getValue();
		if (!Ext.isEmpty(receiverAcctName)) {
			jsonArray.push({
						field : 'ReceiverName',
						operator : 'lk',
						value1 : receiverAcctName,
						value2 : '',
						dataType : 0,
						displayType : 0
					});
		}

		// channel
		var channel = objOfCreateNewFilter.down('AutoCompleter[itemId="Channel"]').getValue();
		if (!Ext.isEmpty(channel)) {
			jsonArray.push({
						field : 'Channel',
						operator : 'eq',
						value1 : channel,
						value2 : '',
						dataType : 0,
						displayType : 6
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

		// Type Of transaction
		//Value is passed by filter ribbon transactiob type as both are in sync
		/*var typeOfTransaction = objOfCreateNewFilter
				.down('AutoCompleter[itemId="InstrumentType"]').getValue();
		if (!Ext.isEmpty(typeOfTransaction)) {
			jsonArray.push({
						field : 'InstrumentType',
						operator : 'eq',
						value1 : typeOfTransaction,
						value2 : '',
						dataType : 0,
						displayType : 6
					});
		}*/

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
						displayType : 6
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
						displayType : 6
					});
		}

		// check number
		var checkNumber = objOfCreateNewFilter
				.down('textfield[itemId="MicrNo"]').getValue();
		if (!Ext.isEmpty(checkNumber)) {
			jsonArray.push({
						field : 'MicrNo',
						operator : 'lk',
						value1 : checkNumber,
						value2 : '',
						dataType : 0,
						displayType : 0
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

		// Process Date
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

		objJson = jsonArray;
		return objJson;
	},
	getAdvancedFilterValueJson : function(FilterCodeVal, objOfCreateNewFilter) {
		var objJson = null;
		var jsonArray = [];
		var sortByOption='asc';
		var firstThenSortByOption='asc';
		var secondThenSortByOption='asc';	
		var thirdThenSortByOption='asc';

		// Client
		var client = objOfCreateNewFilter
				.down('AutoCompleter[itemId="Client"]').getValue();
		if (!Ext.isEmpty(client)) {
			jsonArray.push({
						field : 'Client',
						operator : 'eq',
						value1 : client,
						value2 : '',
						dataType : 0,
						displayType : 6
					});
		}

		// paymentReference
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

		// Product Type
		var ProductType = objOfCreateNewFilter
				.down('textfield[itemId="ProductType"]').getValue();
		if (!Ext.isEmpty(ProductType)) {
			jsonArray.push({
						field : 'ProductType',
						operator : 'lk',
						value1 : ProductType,
						value2 : '',
						dataType : 0,
						displayType : 0
					});
		}

		// Bank Product
		var bankProduct = objOfCreateNewFilter
				.down('textfield[itemId="BankProduct"]').getValue();
		if (!Ext.isEmpty(bankProduct)) {
			jsonArray.push({
						field : 'BankProduct',
						operator : 'in',
						value1 : bankProduct,
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

		// Amount
		var amount = objOfCreateNewFilter.down('numberfield[itemId="Amount"]')
				.getValue();
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

		// receiver account #
		var receiverAcctNo = objOfCreateNewFilter
				.down('textfield[itemId="ReceiverAccount"]').getValue();
		if (!Ext.isEmpty(receiverAcctNo)) {
			jsonArray.push({
						field : 'ReceiverAccount',
						operator : 'lk',
						value1 : receiverAcctNo,
						value2 : '',
						dataType : 0,
						displayType : 0
					});
		}

		// Receiving Account Name
		var receiverAcctName = objOfCreateNewFilter.down('textfield[itemId="ReceiverName"]').getValue();
		if (!Ext.isEmpty(receiverAcctName)) {
			jsonArray.push({
						field : 'ReceiverName',
						operator : 'lk',
						value1 : receiverAcctName,
						value2 : '',
						dataType : 0,
						displayType : 0
					});
		}

		// channel
		var channel = objOfCreateNewFilter
				.down('AutoCompleter[itemId="Channel"]').getValue();
		if (!Ext.isEmpty(channel)) {
			jsonArray.push({
						field : 'Channel',
						operator : 'eq',
						value1 : channel,
						value2 : '',
						dataType : 0,
						displayType : 6
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

		// Type Of transaction
		var typeOfTransaction = objOfCreateNewFilter
				.down('AutoCompleter[itemId="InstrumentType"]').getValue();
		if (!Ext.isEmpty(typeOfTransaction)) {
			jsonArray.push({
						field : 'InstrumentType',
						operator : 'eq',
						value1 : typeOfTransaction,
						value2 : '',
						dataType : 0,
						displayType : 6
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
						displayType : 6
					});
		}

		// Entry User
		var entryUser = objOfCreateNewFilter
				.down('AutoCompleter[itemId="Maker"]').getValue();
		if (!Ext.isEmpty(entryUser)) {
			jsonArray.push({
						field : 'Maker',
						operator : 'lk',
						value1 : entryUser,
						value2 : '',
						dataType : 0,
						displayType : 6
					});
		}
		
		//sortBySortOption
		var buttonText=objOfCreateNewFilter.down('button[itemId="sortByOptionButton"]').getText();
		if(buttonText!==getLabel("ascending","Ascending"))
		 sortByOption='desc';
		
		//firstThenSortBySortOption
		var buttonText=objOfCreateNewFilter.down('button[itemId="firstThenSortByOptionButton"]').getText();
		if(buttonText!==getLabel("ascending","Ascending"))
		firstThenSortByOption='desc';
		
		//secondThenSortBySortOption
		var buttonText=objOfCreateNewFilter.down('button[itemId="secondThenSortByOptionButton"]').getText();
		if(buttonText!==getLabel("ascending","Ascending"))
		secondThenSortByOption='desc';		
		
		//secondThenSortBySortOption
		var buttonText=objOfCreateNewFilter.down('button[itemId="thirdThenSortByOptionButton"]').getText();
		if(buttonText!==getLabel("ascending","Ascending"))
		thirdThenSortByOption='desc';		
		
		
		// Sort By
		var sortByCombo = objOfCreateNewFilter.down('combo[itemId="sortByCombo"]').getValue();
		if (!Ext.isEmpty(sortByCombo)) {
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
		var firstThenSortByCombo = objOfCreateNewFilter.down('combo[itemId="firstThenSortByCombo"]').getValue();
		if (!Ext.isEmpty(firstThenSortByCombo)) {
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
		var secondThenSortByCombo = objOfCreateNewFilter.down('combo[itemId="secondThenSortByCombo"]').getValue();
		if (!Ext.isEmpty(secondThenSortByCombo)) {
			jsonArray.push({
						field : 'SecondThenSortBy',
						operator : 'st',
						value1 : secondThenSortByCombo,
						value2 : secondThenSortByOption,
						dataType : 0,
						displayType : 6
					});
		}
		
		// Third Then Sort By
		var thirdThenSortByCombo = objOfCreateNewFilter.down('combo[itemId="thirdThenSortByCombo"]').getValue();
		if (!Ext.isEmpty(thirdThenSortByCombo)) {
			jsonArray.push({
						field : 'ThirdThenSortBy',
						operator : 'st',
						value1 : thirdThenSortByCombo,
						value2 : thirdThenSortByOption,
						dataType : 0,
						displayType : 6
					});
		}
		

		// check number
		var checkNumber = objOfCreateNewFilter
				.down('textfield[itemId="MicrNo"]').getValue();
		if (!Ext.isEmpty(checkNumber)) {
			jsonArray.push({
						field : 'MicrNo',
						operator : 'lk',
						value1 : checkNumber,
						value2 : '',
						dataType : 0,
						displayType : 0
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

		// Process Date
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

		objJson = {};
		objJson.filterBy = jsonArray;
		if (FilterCodeVal && !Ext.isEmpty(FilterCodeVal))
			objJson.filterCode = FilterCodeVal;
		return objJson;
	},
	setPreloadsOnAdvanceFilter:function(objCreateNewFilterPanel,paymentTypeDesc){
			if(!Ext.isEmpty(paymentTypeDesc))
			objCreateNewFilterPanel.down('AutoCompleter[itemId="InstrumentType"]').setValue(paymentTypeDesc);
	},
	resetAllFields : function(objCreateNewFilterPanel) {
		var me = this;
		objCreateNewFilterPanel.down('AutoCompleter[itemId="Client"]').reset();
		objCreateNewFilterPanel.down('textfield[itemId="BankProduct"]').reset();
		objCreateNewFilterPanel.down('textfield[itemId="ClientReference"]')
				.reset();
		objCreateNewFilterPanel.down('textfield[itemId="AccountNo"]').reset();
		objCreateNewFilterPanel.down('numberfield[itemId="Amount"]').reset();
		objCreateNewFilterPanel.down('textfield[itemId="ReceiverAccount"]')
				.reset();
		objCreateNewFilterPanel.down('textfield[itemId="ReceiverName"]')
				.reset();
		objCreateNewFilterPanel.down('AutoCompleter[itemId="Channel"]').reset();
		objCreateNewFilterPanel.down('textfield[itemId="FileName"]').reset();
		objCreateNewFilterPanel.down('AutoCompleter[itemId="InstrumentType"]')
				.reset();
		objCreateNewFilterPanel.down('AutoCompleter[itemId="TemplateName"]')
				.reset();
		objCreateNewFilterPanel.down('AutoCompleter[itemId="Maker"]').reset();
		objCreateNewFilterPanel.down('textfield[itemId="MicrNo"]').reset();
		objCreateNewFilterPanel.down('textfield[itemId="saveFilterAs"]')
				.reset();

		objCreateNewFilterPanel.down('label[itemId="processLbl"]')
				.setText(getLabel('processDate', 'Process Date'));
		objCreateNewFilterPanel
				.down('container[itemId=processDate] label[itemId="dateFilterFrom"]')
				.setText('');
		objCreateNewFilterPanel
				.down('container[itemId=processDate] label[itemId="dateFilterTo"]')
				.setText('');
		objCreateNewFilterPanel
				.down('container[itemId=processDate] datefield[itemId="processFromDate"]')
				.setVisible(false);
		objCreateNewFilterPanel
				.down('container[itemId=processDate] datefield[itemId="processToDate"]')
				.setVisible(false);

		objCreateNewFilterPanel
				.down('label[itemId="effectiveDateLbl"]')
				.setText(getLabel('batchColumnEffectiveDate', 'Effective Date'));
		objCreateNewFilterPanel
				.down('container[itemId=effectiveDate] label[itemId="dateFilterFrom"]')
				.setText('');
		objCreateNewFilterPanel
				.down('container[itemId=effectiveDate] label[itemId="dateFilterTo"]')
				.setText('');
		objCreateNewFilterPanel
				.down('container[itemId=effectiveDate] datefield[itemId="effectiveFromDate"]')
				.setVisible(false);
		objCreateNewFilterPanel
				.down('container[itemId=effectiveDate] datefield[itemId="effectiveToDate"]')
				.setVisible(false);

		objCreateNewFilterPanel.down('label[itemId="creationDateLbl"]')
				.setText(getLabel('creationDate', 'Creation Date'));
		objCreateNewFilterPanel
				.down('container[itemId=creationDate] label[itemId="dateFilterFrom"]')
				.setText('');
		objCreateNewFilterPanel
				.down('container[itemId=creationDate] label[itemId="dateFilterTo"]')
				.setText('');
		objCreateNewFilterPanel
				.down('container[itemId=creationDate] datefield[itemId="creationFromDate"]')
				.setVisible(false);
		objCreateNewFilterPanel
				.down('container[itemId=creationDate] datefield[itemId="creationToDate"]')
				.setVisible(false);

		objCreateNewFilterPanel.down('label[itemId="errorLabel"]').setText('');
		
		objCreateNewFilterPanel.down('combo[itemId="sortByCombo"]').reset();
		objCreateNewFilterPanel.down('combo[itemId="firstThenSortByCombo"]').reset();
		objCreateNewFilterPanel.down('combo[itemId="secondThenSortByCombo"]').reset();
		objCreateNewFilterPanel.down('combo[itemId="thirdThenSortByCombo"]').reset();
		objCreateNewFilterPanel.down('button[itemId="sortByOptionButton"]').setText(getLabel("ascending","Ascending"));
		objCreateNewFilterPanel.down('button[itemId="firstThenSortByOptionButton"]').setText(getLabel("ascending","Ascending"));
	    objCreateNewFilterPanel.down('button[itemId="secondThenSortByOptionButton"]').setText(getLabel("ascending","Ascending"));
	    objCreateNewFilterPanel.down('button[itemId="thirdThenSortByOptionButton"]').setText(getLabel("ascending","Ascending"));
		

		var bankProductMenu = objCreateNewFilterPanel
				.down('menu[itemId=bankProductMenu]');
		me.resetMenuItems(bankProductMenu);
		var sendingMenu = objCreateNewFilterPanel
				.down('menu[itemId=sendingAccountMenu]');
		me.resetMenuItems(sendingMenu);
	},
	resetMenuItems : function(menuRef) {
		var me = this;
		if (!Ext.isEmpty(menuRef)) {
			var itemArray = menuRef.items.items;
			for (var index = 0; index < itemArray.length; index++) {
				itemArray[index].setChecked(true);
				itemArray[index].setDisabled(false);
			}
		}
	},
	enableDisableFields : function(objCreateNewFilterPanel, boolVal) {
		objCreateNewFilterPanel.down('AutoCompleter[itemId="Client"]')
				.setDisabled(boolVal);
		objCreateNewFilterPanel.down('textfield[itemId="BankProduct"]')
				.setDisabled(boolVal);
		objCreateNewFilterPanel.down('textfield[itemId="ClientReference"]')
				.setDisabled(boolVal);
		objCreateNewFilterPanel.down('textfield[itemId="AccountNo"]')
				.setDisabled(boolVal);
		objCreateNewFilterPanel.down('numberfield[itemId="Amount"]')
				.setDisabled(boolVal);
		objCreateNewFilterPanel.down('textfield[itemId="ReceiverAccount"]')
				.setDisabled(boolVal);
		objCreateNewFilterPanel.down('textfield[itemId="ReceiverName"]')
				.setDisabled(boolVal);
		objCreateNewFilterPanel.down('AutoCompleter[itemId="Channel"]')
				.setDisabled(boolVal);
		objCreateNewFilterPanel.down('textfield[itemId="FileName"]')
				.setDisabled(boolVal);
		objCreateNewFilterPanel.down('AutoCompleter[itemId="InstrumentType"]')
				.setDisabled(boolVal);
		objCreateNewFilterPanel.down('AutoCompleter[itemId="TemplateName"]')
				.setDisabled(boolVal);
		objCreateNewFilterPanel.down('AutoCompleter[itemId="Maker"]')
				.setDisabled(boolVal);
		objCreateNewFilterPanel.down('textfield[itemId="MicrNo"]')
				.setDisabled(boolVal);
		objCreateNewFilterPanel.down('textfield[itemId="saveFilterAs"]')
				.setDisabled(boolVal);

		objCreateNewFilterPanel.down('menu[itemId="creationDateMenu"]')
				.setDisabled(boolVal);
		objCreateNewFilterPanel.down('menu[itemId="processDateMenu"]')
				.setDisabled(boolVal);
		objCreateNewFilterPanel.down('menu[itemId="effectiveDateMenu"]')
				.setDisabled(boolVal);

		objCreateNewFilterPanel
				.down('container[itemId=processDate] label[itemId="dateFilterFrom"]')
				.setDisabled(boolVal);
		objCreateNewFilterPanel
				.down('container[itemId=processDate] label[itemId="dateFilterTo"]')
				.setDisabled(boolVal);
		objCreateNewFilterPanel
				.down('container[itemId=effectiveDate] label[itemId="dateFilterFrom"]')
				.setDisabled(boolVal);
		objCreateNewFilterPanel
				.down('container[itemId=effectiveDate] label[itemId="dateFilterTo"]')
				.setDisabled(boolVal);
		objCreateNewFilterPanel
				.down('container[itemId=creationDate] label[itemId="dateFilterFrom"]')
				.setDisabled(boolVal);
		objCreateNewFilterPanel
				.down('container[itemId=creationDate] label[itemId="dateFilterTo"]')
				.setDisabled(boolVal);
				
		objCreateNewFilterPanel.down('combo[itemId="sortByCombo"]').setReadOnly(boolVal);
		objCreateNewFilterPanel.down('combo[itemId="firstThenSortByCombo"]').setReadOnly(boolVal);
		objCreateNewFilterPanel.down('combo[itemId="secondThenSortByCombo"]').setReadOnly(boolVal);
		objCreateNewFilterPanel.down('combo[itemId="thirdThenSortByCombo"]').setReadOnly(boolVal);
		objCreateNewFilterPanel.down('button[itemId="sortByOptionButton"]').setDisabled(boolVal);
		objCreateNewFilterPanel.down('button[itemId="firstThenSortByOptionButton"]').setDisabled(boolVal);
		objCreateNewFilterPanel.down('button[itemId="secondThenSortByOptionButton"]').setDisabled(boolVal);
		objCreateNewFilterPanel.down('button[itemId="thirdThenSortByOptionButton"]').setDisabled(boolVal);
		

	},
	removeReadOnly : function(objCreateNewFilterPanel, boolVal) {
		objCreateNewFilterPanel.down('AutoCompleter[itemId="Client"]')
				.setReadOnly(boolVal);
		objCreateNewFilterPanel.down('textfield[itemId="BankProduct"]')
				.setReadOnly(boolVal);
		objCreateNewFilterPanel.down('textfield[itemId="ClientReference"]')
				.setReadOnly(boolVal);
		objCreateNewFilterPanel.down('textfield[itemId="AccountNo"]')
				.setReadOnly(boolVal);
		objCreateNewFilterPanel.down('numberfield[itemId="Amount"]')
				.setReadOnly(boolVal);
		objCreateNewFilterPanel.down('textfield[itemId="ReceiverAccount"]')
				.setReadOnly(boolVal);
		objCreateNewFilterPanel.down('textfield[itemId="ReceiverName"]')
				.setReadOnly(boolVal);
		objCreateNewFilterPanel.down('AutoCompleter[itemId="Channel"]')
				.setReadOnly(boolVal);
		objCreateNewFilterPanel.down('textfield[itemId="FileName"]')
				.setReadOnly(boolVal);
		objCreateNewFilterPanel.down('AutoCompleter[itemId="InstrumentType"]')
				.setReadOnly(boolVal);
		objCreateNewFilterPanel.down('AutoCompleter[itemId="TemplateName"]')
				.setReadOnly(boolVal);
		objCreateNewFilterPanel.down('AutoCompleter[itemId="Maker"]')
				.setReadOnly(boolVal);
		objCreateNewFilterPanel.down('textfield[itemId="MicrNo"]')
				.setReadOnly(boolVal);
		objCreateNewFilterPanel.down('textfield[itemId="saveFilterAs"]')
				.setReadOnly(boolVal);
				
		objCreateNewFilterPanel.down('combo[itemId="sortByCombo"]').setReadOnly(boolVal);
		objCreateNewFilterPanel.down('combo[itemId="firstThenSortByCombo"]').setReadOnly(boolVal);
		objCreateNewFilterPanel.down('combo[itemId="secondThenSortByCombo"]').setReadOnly(boolVal);
		objCreateNewFilterPanel.down('combo[itemId="thirdThenSortByCombo"]').setReadOnly(boolVal);
	}

});
