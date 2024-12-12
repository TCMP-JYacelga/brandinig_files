Ext.define('GCP.view.IncomingWiresFilterView', {
	extend : 'Ext.panel.Panel',
	xtype : 'incomingWiresFilterView',
	requires : ['Ext.ux.gcp.AutoCompleter'],
	layout : {
		type : 'vbox'
	},
	initComponent : function() {
	var me = this;strUrl='';
	
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
										'DESCR' : getLabel('allCompanies', 'All Companies')
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
	
	var strAppDate = dtApplicationDate;
	var dtFormat = strExtApplicationDateFormat;
	var date = new Date(Ext.Date.parse(strAppDate, dtFormat));
	var isThisWeekHidden = false;

	if (date.getDay() === 1)
			isThisWeekHidden = true;
	
		this.items = [/*{
			xtype : 'container',
			itemId : 'clientContainer',
			layout : 'vbox',
			flex : 1,
			items : [{
						xtype : 'label',
						text : getLabel("batchColumnClient", "Client"),
						flex : 1,
						margin : '0 0 0 6'
					}, {
						xtype : 'combo',
						valueField : 'CODE',
						displayField : 'DESCR',
						queryMode : 'local',
						width : '70%',
						editable : false,
						triggerAction : 'all',
						itemId : 'quickFilterClientCombo',
						mode : 'local',
						padding : '0 0 0 6',
						emptyText : getLabel('selectclient', 'Select Client'),
						store : me.getClientStore(),
						listeners : {
							'select' : function(combo, record) {
								me.fireEvent("handleClientChangeInQuickFilter",
										combo);
							}
						}
					}]
		},*/{
			xtype : 'container',
			layout : 'vbox',
			hidden : ((clientStore.getCount() < 2) || !isClientUser()) ? true : false,//If count is one or admin then hide
			width : '25%',
			padding : '0 30 0 0',
			items : [{
						xtype : 'label',
						itemId : 'savedFiltersLabel',
						text : getLabel('lblcompany', 'Company Name')
					}, {
						xtype : 'combo',
						displayField : 'DESCR',
						valueField : 'CODE',
						queryMode : 'local',
						editable : false,
						triggerAction : 'all',
						width : '100%',
						padding : '-4 0 0 0',
						itemId : 'clientCombo',
						mode : 'local',
						emptyText : getLabel('selectCompany', 'Select Company'),
						store : clientStore,
						listeners : {
							'select' : function(combo, record) {
								selectedFilterClientDesc = combo.getRawValue();
								selectedFilterClient = combo.getValue();
								selectedClientDesc = combo.getRawValue();
								changeClientAndRefreshGrid(combo.getValue(), combo.getRawValue());
							},
							boxready : function(combo, width, height, eOpts) {
								combo.setValue(combo.getStore().getAt(0));
							}
						}
					}]
		},{
			xtype : 'container',
			layout : 'vbox',
			hidden : (isClientUser()) ? true : false,//If not admin then hide
			width : '25%',
			padding : '0 25 0 0',
			items : [{
						xtype : 'label',
						itemId : 'savedFiltersLabel',
						text : getLabel('lblcompany', 'Company Name')
					}, {
							xtype : 'AutoCompleter',
							width : 255,
							matchFieldWidth : true,
							name : 'clientCombo',
							itemId : 'clientAuto',
							cfgUrl : "services/userseek/userclients.json",
							padding : '-4 0 0 0',
							cfgQueryParamName : '$autofilter',
							cfgRecordCount : -1,
							cfgSeekId : 'userclients',
							cfgKeyNode : 'CODE',
							cfgRootNode : 'd.preferences',
							cfgDataNode1 : 'DESCR',
							emptyText : getLabel('searchByCompany', 'Enter Keyword or %'),
							enableQueryParam:false,
							cfgProxyMethodType : 'POST',
							listeners : {
								'select' : function(combo, record) {
									selectedFilterClientDesc = combo.getRawValue();
									selectedFilterClient = combo.getValue();
									selectedClientDesc = combo.getRawValue();
									$(document).trigger("handleClientChangeInQuickFilter",
											false);
								},
								'change' : function(combo, record) {
									if(Ext.isEmpty(combo.getValue())){
									selectedFilterClientDesc = "";
									selectedFilterClient = "";
									selectedClientDesc = "";
									$(document).trigger("handleClientChangeInQuickFilter",
											false);
									}
								}
							}
						}]
		},
		{
			xtype : 'container',
			itemId : 'filterParentContainer',
			width : '100%',
			layout : 'hbox',
			items : [{
				xtype : 'container',
				itemId : 'savedFiltersContainer',
				layout : 'vbox',
				width : '25%',
				padding : '0 30 0 0',
				items : [{
							xtype : 'label',
							itemId : 'savedFiltersLabel',
							text : getLabel('savedFilters', 'Saved Filters')
						}, {
							xtype : 'combo',
							valueField : 'filterName',
							displayField : 'filterName',
							queryMode : 'local',
							editable : false,
							triggerAction : 'all',
							width : '100%',
							padding : '-4 0 0 0',
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
			},{
				xtype : 'container',
				layout : 'vbox',
				padding: '0 30 0 0',
				items : [{
					xtype : 'label',
					text : getLabel("lblSendingBank", "Sending Bank")
				}, {
					xtype : 'AutoCompleter',
					width : 230,
					matchFieldWidth : true,
					name : 'sendingBank',
					itemId : 'sendingBankLst',
					cfgUrl : 'services/userseek/sendingBankSeek.json',
					padding : '-4 0 0 0',
					cfgQueryParamName : '$autofilter',
					cfgRecordCount : -1,
					cfgSeekId : 'receiverNamesList',
					cfgKeyNode : 'CODE',
					cfgRootNode : 'd.preferences',
					cfgDataNode1 : 'DESCR',
					emptyText : getLabel('searchBySendingBank', 'Enter Keyword or %'),
					enableQueryParam:false,
					cfgProxyMethodType : 'POST'
				}]
			},{
			xtype : 'container',
			itemId : 'entryDateContainer',
			layout : 'vbox',
			width : '50%',
			padding : '0 30 0 0',
			items : [{
						xtype : 'panel',
						itemId : 'entryDatePanel',
						height : 23,
						flex : 1,
						layout : 'hbox',
						items : [{
									xtype : 'label',
									itemId : 'dateLabel',
									text : getLabel('lblreqdate', 'Request Date')
								}, {
									xtype : 'button',
									border : 0,
									filterParamName : 'EntryDate',
									itemId : 'entryDate',
									cls : 'ui-caret',
									listeners : {
										click:function(event){
												var menus = me.createDateFilterMenu(isThisWeekHidden);
												var xy = event.getXY();
												menus.showAt(xy[0],xy[1]+16);
												event.menu = menus;
										}
									}
								}]
					}, {
						xtype : 'container',
						itemId : 'entryDateToContainer',
						layout : 'hbox',
						width : '50%',
						items : [{
							xtype : 'component',
							width : '84%',
							itemId : 'checkEntryDataPicker',
							filterParamName : 'EntryDate',
							html : '<input type="text"  id="entryDataPicker" class="ft-datepicker from-date-range ui-datepicker-range-alignment">'
						}, {
							xtype : 'component',
							cls : 'icon-calendar',
							margin : '1 0 0 0',
							html : '<span class=""><i class="fa fa-calendar"></i></span>'
						}/*, {
							xtype : 'component',
							itemId : 'dateToLbl',
							cls : 'toDateText',
							margin : '1 0 0 -9',
							html : '<span class=""> to </span>'
						}, {
							xtype : 'component',
							width : '35%',
							itemId : 'paymentEntryToDataPicker',
							filterParamName : 'EntryToDate',
							html : '<input type="text"  id="entryDataToPicker" placeholder="'
									+ strApplicationDateFormat
									+ '" class="ft-datepicker to-date-range ui-datepicker-range-alignment">'
						}, {
							xtype : 'component',
							cls : 'to-icon-calendar',
							margin : '1 0 0 0',
							html : '<span class=""><i class="fa fa-calendar"></i></span>'
						}*/]
					}
					]
		}]
		}];
		this.callParent(arguments);
	},
	highlightSavedFilter : function(strFilterCode) {
		var me = this;
		var objToolbar = me.down('toolbar[itemId="advFilterActionToolBar"]');
		if (objToolbar) {
		
			objToolbar.items.each(function(item) {
						item.removeCls('xn-custom-heighlight');
						
						if (item.itemId === strFilterCode)
							item.addCls('xn-custom-heighlight');
					});
		}
	},
	getClientStore : function() {
		var clientData = null;
		var objClientStore = null;
		Ext.Ajax.request({
			url : 'services/userseek/userclients.json&$sellerCode=' + sessionSellerCode,
			async : false,
			method : "POST",
			success : function(response) {
				if (!Ext.isEmpty(response.responseText)) {
					var data = Ext.decode(response.responseText);
					if (data && data.d) {
						clientData = data.d.preferences;
						objClientStore = Ext.create('Ext.data.Store', {
									fields : ['CODE', 'DESCR'],
									data : clientData,
									reader : {
										type : 'json',
										root : 'd.preferences'
									},
									autoLoad : true,
									listeners : {
										load : function() {
											this.insert(0, {
														CODE : 'all',
														DESCR : getLabel(
																'allCompanies',
																'All companies')
													});
										}
									}
								});
						objClientStore.load();
					}
				}
			},
			failure : function(response) {
			}
		});
		return objClientStore;
	},
	getSendingBankStore : function() {
		var sendingBankdata = null;
		var objSendingBankStore = null;
		Ext.Ajax.request({
			url : 'services/userseek/sendingBankSeek.json?&$filtercode1=' + code1,
			async : false,
			method : "GET",
			success : function(response) {
				if (!Ext.isEmpty(response.responseText)) {
					var data = Ext.decode(response.responseText);
					if (data && data.d) {
						sendingBankdata = data.d.preferences;
						objSendingBankStore = Ext.create('Ext.data.Store', {
									fields : ['CODE', 'DESCR'],
									data : sendingBankdata,
									reader : {
										type : 'json',
										root : 'd.preferences'
									},
									autoLoad : true,
									listeners : {
										load : function() {
											this.insert(0, {
														CODE : 'all',
														DESCR : getLabel(
																'all',
																'All')
													});
										}
									}
								});
						objSendingBankStore.load();
					}
				}
			},
			failure : function(response) {
			}
		});
		return objSendingBankStore;
	},
	savedFilterStore : function() {
		var myStore = new Ext.data.ArrayStore({
					autoLoad : true,
					fields : ['filterName'],
					proxy : {
						type : 'ajax',
						url : 'services/userfilterslist/incomingWireFilter.json',
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
	},
	populateClientMenu : function(data) {
		var me = this;
		var clientMenu = me.down('menu[itemId="clientMenu"]');
		var clientBtn = me.down('button[itemId="clientBtn"]');
		var filterClientMenuContainer = me
				.down('container[itemId="filterClientMenuContainer"]');
		var clientArray = data.d.preferences || [];
		clientMenu.add({
					text : getLabel('allCompanies', 'All companies'),
					btnDesc : getLabel('allCompanies', 'All companies'),
					code : 'all',
					handler : function(btn, opts) {
						clientBtn.setText(btn.text);
						me.clientCode = btn.code;
						me.fireEvent('handleClientChange', btn.code,
								btn.btnDesc);
					}
				});

		Ext.each(clientArray, function(client) {

					clientMenu.add({
								text : client.DESCR,
								code : client.CODE,
								btnDesc : client.DESCR,
								handler : function(btn, opts) {
									clientBtn.setText(btn.text);
									me.clientCode = btn.code;
									me.fireEvent('handleClientChange',
											btn.code, btn.btnDesc);
								}
							});
				});
		if (null != clientArray && clientArray.length <= 1) {
			filterClientMenuContainer.hide();
		}

	},
	checkInfinity : function(intFilterDays)
	{
		if(intFilterDays == '0' || Ext.isEmpty(intFilterDays))
			{ 
				return true;
			}		
	},
	createDateFilterMenu : function(isThisWeekHidden) {
		var me = this;
		var menu = null;
		var intFilterDays = filterDays ? filterDays : '';
		var arrMenuItem = [];

		arrMenuItem.push({
					text : getLabel('latest', 'Latest'),
					btnId : 'btnLatest',
					btnValue : '12',
					parent : this,
					handler : function(btn, opts) {
						//this.parent.fireEvent('dateChange', btn, opts);
						$(document).trigger("filterDateChange",['entryDateQuickFilter',btn,opts]);
					}
				});
		arrMenuItem.push({
					text : getLabel('today', 'Today'),
					btnId : 'btnToday',
					btnValue : '1',
					parent : this,
					handler : function(btn, opts) {
						//this.parent.fireEvent('dateChange', btn, opts);
						$(document).trigger("filterDateChange",['entryDateQuickFilter',btn,opts]);
					}
				});
		if (intFilterDays >= 2 || me.checkInfinity(intFilterDays))
			arrMenuItem.push({
						text : getLabel('yesterday', 'Yesterday'),
						btnId : 'btnYesterday',
						btnValue : '2',
						parent : this,
						handler : function(btn, opts) {
							//this.parent.fireEvent('dateChange', btn, opts);
							$(document).trigger("filterDateChange",['entryDateQuickFilter',btn,opts]);
						}
					});
		if (intFilterDays >= 7 || me.checkInfinity(intFilterDays))
			arrMenuItem.push({
						text : getLabel('thisweek', 'This Week'),
						btnId : 'btnThisweek',
						btnValue : '3',
						parent : this,
						handler : function(btn, opts) {
							//this.parent.fireEvent('dateChange', btn, opts);
							$(document).trigger("filterDateChange",['entryDateQuickFilter',btn,opts]);
						}
					});
		if (intFilterDays >= 14 || me.checkInfinity(intFilterDays))
			arrMenuItem.push({
						text : getLabel('lastweektodate', 'Last Week To Date'),
						btnId : 'btnLastweek',
						parent : this,
						btnValue : '4',
						handler : function(btn, opts) {
							//this.parent.fireEvent('dateChange', btn, opts);
							$(document).trigger("filterDateChange",['entryDateQuickFilter',btn,opts]);
						}
					});
		if (intFilterDays >= 30 || me.checkInfinity(intFilterDays))
			arrMenuItem.push({
						text : getLabel('thismonth', 'This Month'),
						btnId : 'btnThismonth',
						parent : this,
						btnValue : '5',
						handler : function(btn, opts) {
							//this.parent.fireEvent('dateChange', btn, opts);
							$(document).trigger("filterDateChange",['entryDateQuickFilter',btn,opts]);
						}
					});
		if (intFilterDays >= 60 || me.checkInfinity(intFilterDays))
			arrMenuItem.push({
						text : getLabel('lastMonthToDate', 'Last Month To Date'),
						btnId : 'btnLastmonth',
						btnValue : '6',
						parent : this,
						handler : function(btn, opts) {
							//this.parent.fireEvent('dateChange', btn, opts);
							$(document).trigger("filterDateChange",['entryDateQuickFilter',btn,opts]);
						}
					});
		if (intFilterDays >= 30 || me.checkInfinity(intFilterDays))
			arrMenuItem.push({
						text : getLabel('lastmonthonly', 'Last Month Only'),
						btnId : 'btnLastmonthonly',
						parent : this,
						btnValue : '14',
						handler : function(btn, opts) {
							//this.parent.fireEvent('dateChange', btn, opts);
							$(document).trigger("filterDateChange",['entryDateQuickFilter',btn,opts]);
						}
					});
		if (intFilterDays >= 90 || me.checkInfinity(intFilterDays))
			arrMenuItem.push({
						text : getLabel('thisquarter', 'This Quarter'),
						btnId : 'btnLastMonthToDate',
						btnValue : '8',
						parent : this,
						handler : function(btn, opts) {
							//this.parent.fireEvent('dateChange', btn, opts);
							$(document).trigger("filterDateChange",['entryDateQuickFilter',btn,opts]);
						}
					});
		if (intFilterDays >= 180 || me.checkInfinity(intFilterDays))
			arrMenuItem.push({
						text : getLabel('lastQuarterToDate',
								'Last Quarter To Date'),
						btnId : 'btnQuarterToDate',
						btnValue : '9',
						parent : this,
						handler : function(btn, opts) {
							//this.parent.fireEvent('dateChange', btn, opts);
							$(document).trigger("filterDateChange",['entryDateQuickFilter',btn,opts]);
						}
					});
		if (intFilterDays >= 365 || me.checkInfinity(intFilterDays))
			arrMenuItem.push({
						text : getLabel('thisyear', 'This Year'),
						btnId : 'btnLastQuarterToDate',
						btnValue : '10',
						parent : this,
						handler : function(btn, opts) {
							//this.parent.fireEvent('dateChange', btn, opts);
							$(document).trigger("filterDateChange",['entryDateQuickFilter',btn,opts]);
						}
					});
		if (intFilterDays >= 730 || me.checkInfinity(intFilterDays))
			arrMenuItem.push({
						text : getLabel('lastyeartodate', 'Last Year To Date'),
						btnId : 'btnYearToDate',
						parent : this,
						btnValue : '11',
						handler : function(btn, opts) {
							//this.parent.fireEvent('dateChange', btn, opts);
							$(document).trigger("filterDateChange",['entryDateQuickFilter',btn,opts]);
						}
					});
		
		var dropdownMenu = Ext.create('Ext.menu.Menu', {
		itemId : 'DateMenu',
		cls : 'ext-dropdown-menu',
		items : arrMenuItem,
		listeners : {
				hide:function(event) {
					this.addCls('ui-caret-dropdown');
					this.removeCls('action-down-hover');
				}
			}
		});
		/*menu = Ext.create('Ext.menu.Menu', {
					items : arrMenuItem
				});*/
		return dropdownMenu;
	}
});