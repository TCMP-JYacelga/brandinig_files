Ext.define('GCP.view.LoanInvoiceFilterView', {
	extend : 'Ext.panel.Panel',
	xtype : 'loanInvoiceNewFilterViewType',
	requires : [],
	layout : 'vbox',
	initComponent : function() {
		var me = this;
		var strAppDate = dtApplicationDate;
		var dtFormat = strExtApplicationDateFormat;
		var date = new Date(Ext.Date.parse(strAppDate, dtFormat));

		invoiceSummary = this;
		var clientStore = Ext.create('Ext.data.Store', {
					fields : ['CODE', 'DESCR']
				});
		
		Ext.Ajax.request({
			url : 'services/userseek/userclients.json',
			method : 'POST',
			async : false,
			success : function(response) {
				var responseData = Ext.decode(response.responseText);
				var data = responseData.d.preferences;
				if (clientStore) {
					clientStore.removeAll();
					var count = data.length;
					if (count > 1) {
						clientStore.add({
									'CODE' : 'all',
									'DESCR' : 'All Companies'
								});
					}
					for (var index = 0; index < count; index++) {
						var record = {
							'CODE' : data[index].CODE,
							'DESCR' : data[index].DESCR
						}
						clientStore.add(record);
					}
				}
			},
			failure : function() {
			}
		});		
		
		me.on('afterrender', function(panel) {
					Ext.Ajax.request({
								url : 'services/userseek/userclients.json',
								method : "POST",
								async : false,
								success : function(response) {
									if (response && response.responseText)
										me.addDataToClientCombo(Ext
												.decode(response.responseText));
								},
								failure : function(response) {
									// console.log('Error Occured');
								}
							});
				});
		me.on('afterrender', function(panel) {
					var clientCombo = me.down('combo[itemId="clientCombo"]');
					// Set Default Text When Page Loads
					clientCombo.setRawValue(getLabel('allCompanies',
							'All companies'));
				});
		this.items = [{
			xtype : 'container',
			itemId : 'filterClientMenuContainer',
			width : '25%',
			padding : '0 30 0 0',
			layout : 'vbox',
			hidden : ((clientStore.getCount() < 2) || !isClientUser()) ? true : false,
			items : [{
						xtype : 'label',
						text : getLabel('lblcompany', 'Company Name')
					}, {
						xtype : 'combo',
						valueField : 'CODE',
						displayField : 'DESCR',
						queryMode : 'local',
						itemId : 'clientCombo',
						triggerAction : 'all',
						triggerBaseCls : 'xn-form-trigger',
						editable : false,
						store : clientStore,
						width : '100%',
						padding : '-4 0 0 0',
						menuAlign : 'b',
						listeners : {
							'select' : function(combo, record) {
								var code = combo.getValue();
								me.clientCode = code;
								me.fireEvent("handleClientChange", code, combo
												.getRawValue(), '');
							}
						}
					}]
		}, {
			xtype : 'container',
			width : '100%',
			itemId : 'filterContainer',
			layout : 'hbox',
			// hidden : isClientUser(),
			items : [{
				xtype : 'container',
				itemId : 'savedFiltersContainer',
				layout : 'vbox',
				width : '25%',
				padding : '0 30 0 0',
				items : [{
							xtype : 'label',
							itemId : 'savedFiltersLabel',
							text : getLabel('savedFilter', 'Saved Filters')
						}, {
							xtype : 'combo',
							valueField : 'filterName',
							displayField : 'filterName',
							triggerBaseCls : 'xn-form-trigger',
							width : '100%',
							padding : '-4 0 0 0',
							queryMode : 'local',
							editable : false,
							triggerAction : 'all',
							itemId : 'savedFiltersCombo',
							mode : 'local',
							emptyText : getLabel('selectfilter',
									'Select Filter'),
							store : me.savedFilterStore(),
							listeners : {
								'select' : function(combo, record) {
									me.fireEvent("handleSavedFilterItemClick",
											combo.getValue(), combo
													.getRawValue());
								}
							}
						}]

			}, {
				xtype : 'container',
				itemId : 'filterClientAutoCmplterCnt',
				layout : 'vbox',
				width : '25%',
				padding : '0 30 0 0',
				hidden :(isClientUser()) ? true : false,
				items : [{
							xtype : 'label',
							text : getLabel("Client", "Client"),
							margin : '0 0 0 6'
						}, {
							xtype : 'AutoCompleter',
							padding : '-4 0 0 0',
							width : '100%',
							triggerBaseCls : 'xn-form-trigger',
							itemId : 'clientAutoCompleter',
							cfgTplCls : 'xn-autocompleter-t7',
							name : 'clientAutoCompleter',
							cfgUrl : 'services/userseek/userclients.json',
							cfgRecordCount : -1,
							cfgRootNode : 'd.preferences',
							cfgDataNode1 : 'DESCR',
							enableQueryParam : false,
							cfgKeyNode : 'CODE',
							// value : strClient,
							cfgQueryParamName : '$autofilter',
							listeners : {
								'select' : function(combo, record) {
									strClient = combo.getValue();
									strClientDescr = combo.getRawValue();
									me.fireEvent('handleClientChange',
											strClient, strClientDescr);
								},
								'change' : function(combo, newValue, oldValue,
										eOpts) {
									if (Ext.isEmpty(newValue)) {
										me.fireEvent('handleClientChange');
									}
								},
								'render' : function(combo) {
									combo.listConfig.width = 200;
								}
							}
						}]
			}, {
				xtype : 'container',
				// itemId : 'entryDateContainer',
				layout : 'vbox',
				width : '40%',
				padding : '0 0 0 0',
				items : [{
					xtype : 'panel',
					// itemId : 'entryDatePanel',
					layout : 'hbox',
					height : 23,
					items : [{
								xtype : 'label',
								itemId : 'entryDateLabel',
								text : getLabel('lblPayDueDate','Payment Due Date'),
								padding : '0 0 12 6'
							}, {
								xtype : 'button',
								border : 0,
								filterParamName : 'dueDate',
								itemId : 'entryDate',// Required
								cls : 'ui-caret-dropdown',
								listeners : {
									click : function(event) {
										var menus = me
												.createDateFilterMenu(this);
										var xy = event.getXY();
										menus.showAt(xy[0], xy[1] + 16);
										event.menu = menus;
									}
								}
							}]
				}, {
					xtype : 'container',
					layout : 'hbox',
					width : '90%',
					items : [{
						xtype : 'component',
						itemId : 'pmtDueDataPicker',
						// height : 40,
						filterParamName : 'dueDate',
						html : '<input type="text"  id="entryDataPicker" class="ft-datepicker from-date-range ui-datepicker-range-alignment">'
					}, {
						xtype : 'component',
						cls : 'icon-calendar',
						margin : '1 0 0 0',
						html : '<span class=""><i class="fa fa-calendar"></i></span>'
					}]
				}]
			}]
		}

		// {
		// xtype : 'container',
		// itemId : 'savedFiltersContainer',
		// layout : 'vbox',
		// width : '30%',
		// items : [{
		// xtype : 'label',
		// itemId : 'savedFiltersLabel',
		// text : 'Saved Filters'
		// }, {
		// xtype : 'combo',
		// valueField : 'filterName',
		// displayField : 'filterName',
		// triggerBaseCls : 'xn-form-trigger',
		// queryMode : 'local',
		// editable : false,
		// triggerAction : 'all',
		// itemId : 'savedFiltersCombo',
		// mode : 'local',
		// emptyText : getLabel('selectfilter', 'Select Filter'),
		// store : me.savedFilterStore(),
		// listeners : {
		// 'select' : function(combo, record) {
		// me.fireEvent("handleSavedFilterItemClick",
		// combo.getValue(), combo.getRawValue());
		// }
		// }
		// }]
		// }
		]
		this.callParent(arguments);
	},
	doResetInformatinFilter : function() {
		var me = this;
		var btn = me.down('button[itemId="infoAllBtn"]');
		if (btn)
			btn.addCls('xn-custom-heighlight');
		btn = me.down('button[itemId="infoNewBtn"]');
		if (btn)
			btn.removeCls('xn-custom-heighlight');
	},
	checkInfinity : function(intFilterDays) {
		if ( Ext.isEmpty(intFilterDays)) {
			return true;
		}
	},
	createDateFilterMenu : function(buttonIns) {
		var me = this;
		var menu = null;
		var arrMenuItem = [];

		arrMenuItem.push({
					text : getLabel('latest', 'Latest'),
					btnId : 'latest',
					parent : this,
					btnValue : '12',
					handler : function(btn, opts) {
						me.doResetInformatinFilter();
						this.parent.fireEvent('dateChange', btn, opts);
					}
				});

		if (intFilterDays >= 1 || me.checkInfinity(intFilterDays))
			arrMenuItem.push({
						text : getLabel('today', 'Today'),
						btnId : 'btnToday',
						btnValue : '1',
						parent : this,
						handler : function(btn, opts) {
							me.doResetInformatinFilter();
							this.parent.fireEvent('dateChange', btn, opts);
						}
					});
		if (intFilterDays >= 2 || me.checkInfinity(intFilterDays))
			arrMenuItem.push({
						text : getLabel('yesterday', 'Yesterday'),
						btnId : 'btnYesterday',
						btnValue : '2',
						parent : this,
						handler : function(btn, opts) {
							me.doResetInformatinFilter();
							this.parent.fireEvent('dateChange', btn, opts);
						}
					});
		if (intFilterDays >= 7 || me.checkInfinity(intFilterDays))
			arrMenuItem.push({
						text : getLabel('thisweek', 'This Week'),
						btnId : 'btnThisweek',
						btnValue : '3',
						parent : this,
						handler : function(btn, opts) {
							me.doResetInformatinFilter();
							this.parent.fireEvent('dateChange', btn, opts);
						}
					});
		if (intFilterDays >= 14 || me.checkInfinity(intFilterDays))
			arrMenuItem.push({
						text : getLabel('lastweektodate', 'Last Week To Date'),
						btnId : 'btnLastweek',
						parent : this,
						btnValue : '4',
						handler : function(btn, opts) {
							me.doResetInformatinFilter();
							this.parent.fireEvent('dateChange', btn, opts);
						}
					});
		if (intFilterDays >= 30 || me.checkInfinity(intFilterDays))
		{
			arrMenuItem.push({
						text : getLabel('thismonth', 'This Month'),
						btnId : 'btnThismonth',
						parent : this,
						btnValue : '5',
						handler : function(btn, opts) {
							me.doResetInformatinFilter();
							this.parent.fireEvent('dateChange', btn, opts);
						}
					});
		}
		if (intFilterDays >= 60 || me.checkInfinity(intFilterDays))
			arrMenuItem.push({
						text : getLabel('lastMonthToDate', 'Last Month To Date'),
						btnId : 'btnLastmonth',
						btnValue : '6',
						parent : this,
						handler : function(btn, opts) {
							me.doResetInformatinFilter();
							this.parent.fireEvent('dateChange', btn, opts);
						}
					});
			if (lastMonthOnlyFilter===true || me.checkInfinity(intFilterDays))
		{
			arrMenuItem.push({
						text : getLabel('lastmonthonly', 'Last Month Only'),
						btnId : 'btnLastmonthonly',
						parent : this,
						btnValue : '14',
						handler : function(btn, opts) {
							me.doResetInformatinFilter();
							this.parent.fireEvent('dateChange', btn, opts);
						}
					});
		}
		if (intFilterDays >= 180 || me.checkInfinity(intFilterDays))
			arrMenuItem.push({
						text : getLabel('lastQuarterToDate',
								'Last Quarter To Date'),
						btnId : 'btnQuarterToDate',
						btnValue : '9',
						parent : this,
						handler : function(btn, opts) {
							me.doResetInformatinFilter();
							this.parent.fireEvent('dateChange', btn, opts);
						}
					});
		if (intFilterDays >= 365 || me.checkInfinity(intFilterDays))
			arrMenuItem.push({
						text : getLabel('thisyear', 'This Year'),
						btnId : 'btnLastQuarterToDate',
						btnValue : '10',
						parent : this,
						handler : function(btn, opts) {
							me.doResetInformatinFilter();
							this.parent.fireEvent('dateChange', btn, opts);
						}
					});
		if (intFilterDays >= 730 || me.checkInfinity(intFilterDays))
			arrMenuItem.push({
						text : getLabel('lastyeartodate', 'Last Year To Date'),
						btnId : 'btnYearToDate',
						parent : this,
						btnValue : '11',
						handler : function(btn, opts) {
							me.doResetInformatinFilter();
							this.parent.fireEvent('dateChange', btn, opts);
						}
					});
		menu = Ext.create('Ext.menu.Menu', {
					cls : 'ext-dropdown-menu',
					listeners : {
						hide : function(event) {
							buttonIns.addCls('ui-caret-dropdown');
							buttonIns.removeCls('action-down-hover');
						}
					},
					items : arrMenuItem
				});
		return menu;
	},
	addDataToClientCombo : function(data) {
		var me = this;
		var clientMenu = [];
		var clientCombobox = me.down('combo[itemId="clientCombo"]');
		var filterClientMenuContainer = me
				.down('container[itemId="filterClientMenuContainer"]');
		var clientArray = data.d.preferences || [];
		clientMenu.push({
					text : getLabel('allCompanies', 'All companies'),
					DESCR : getLabel('allCompanies', 'All companies'),
					CODE : 'all',
					handler : function(btn, opts) {
						clientCombobox.setText(btn.text);
						me.clientCode = btn.CODE;
					}
				});

		Ext.each(clientArray, function(client) {
			clientMenu.push({
				text : client.DESCR,
				CODE : client.CODE,
				DESCR : client.DESCR,
				handler : function(btn, opts) {
					clientBtn.setText(btn.text);
					me.clientCode = btn.CODE;
					me.fireEvent('handleClientChange', btn.CODE, btn.DESCR, '');
				}
			});
		});
		if (null != clientArray && clientArray.length <= 1) {
			filterClientMenuContainer.hide();
		} else {
			clientCombobox.getStore().loadData(clientMenu);
		}
	},
	savedFilterStore : function() {
		var myStore = new Ext.data.ArrayStore({
					autoLoad : true,
					fields : ['filterName'],
					proxy : {
						type : 'ajax',
						url : 'userfilterslist/invoiceGridFilter.srvc?'
								+ csrfTokenName + "=" + csrfTokenValue,
						reader : {
							type : 'json',
							root : 'd.filters'
						}
					},
					listeners : {
						load : function(store, records, success, opts) {
							store.each(function(record) {
										record.set('filterName', record.raw);
									});
						}
					}
				})
		return myStore;
	}

});
