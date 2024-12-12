Ext.define('GCP.view.NonCMSStopFilterView', {
	extend : 'Ext.panel.Panel',
	xtype : 'nonCMSStopFilterView',
	layout : 'hbox' ,
	initComponent : function() {
		var me = this;
		
		var strAppDate = dtApplicationDate;
		var dtFormat = strExtApplicationDateFormat;
		var date = new Date(Ext.Date.parse(strAppDate, dtFormat));
		var isThisWeekHidden = false;

		if (date.getDay() === 1)
			isThisWeekHidden = true;
		
	/*	me.on('afterrender', function(panel) {
			Ext.Ajax.request({
						url : 'services/userseek/userclients.json&$sellerCode='
								+ strSellerId,
						method : "GET",
						async : false,
						success : function(response) {
							if (response && response.responseText)
								me.populateClientMenu(Ext
										.decode(response.responseText));
						},
						failure : function(response) {
							// console.log('Error Occured');
						}
					});
		}); */
		//me.on('afterrender', function(panel) {
		//	var clientBtn = me.down('button[itemId="clientBtn"]');
			/*
			 * if (clientBtn) clientBtn.setText(me.clientCode);
			 */
			// Set Default Text When Page Loads
		//	clientBtn
			//		.setText(getLabel('allCompanies', 'All companies'));
		//});
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
			itemId : 'savedFiltersContainer',
			layout : 'vbox',
			width : '25%',
			//flex : 1,
			padding : '0 30 0 0',
			items : [{
						xtype : 'label',
						itemId : 'savedFiltersLabel',
						text : getLabel('savedFilter','Saved Filters')
					}, {
						xtype : 'combo',
						valueField : 'filterName',
						displayField : 'filterName',
						queryMode : 'local',
						editable : false,
						triggerAction : 'all',
						itemId : 'savedFiltersCombo',
						mode : 'local',
						width : '100%',
						padding : '-4 0 0 0',
						emptyText : getLabel('selectfilter', 'Select Filter'),
						store : me.savedFilterStore(),
						listeners : {
							'select' : function(combo, record) {
								me.fireEvent("handleSavedFilterItemClick",
										combo.getValue(), combo.getRawValue());
							}
						}
					}]
		},{
			xtype : 'container',
			itemId : 'entryDateContainer',
			layout : 'vbox',
			width : '50%',
			padding : '0 30 0 0',
			//flex : 1,
			items : [{
						xtype : 'panel',
						itemId : 'entryDatePanel',
						layout : 'hbox',
						height : 23,
						flex : 1,
						items : [{
									xtype : 'label',
									itemId : 'dateLabel',
									text : getLabel('lblreqdate', 'Request Date'),
									padding : '0 0 12 6'	
								}, {
									xtype : 'button',
									border : 0,
									filterParamName : 'EntryDate',
									itemId : 'entryDate',
									cls : 'ui-caret-dropdown',
									listeners : {
										click:function(event){
												var menus = me.createDateFilterMenu(isThisWeekHidden);
												var xy = event.getXY();
												menus.showAt(xy[0],xy[1]+16);
												event.menu = menus;
										}
									}
								}]
					},{
						xtype : 'container',
						itemId : 'entryDateToContainer',
						layout : 'hbox',
						width : '50%',
						items : [{
							xtype : 'component',
							width : '80%',
							itemId : 'checkEntryDataPicker',
							filterParamName : 'EntryDate',
							//padding : '0 0 0 6',
							html : '<input type="text"  id="entryDataPicker" class="ft-datepicker from-date-range ui-datepicker-range-alignment">'
						},
						{
							xtype : 'component',
							cls : 'icon-calendar',
							margin : '1 0 0 0',
							html : '<span class=""><i class="fa fa-calendar"></i></span>'
						}]
					} ]
		}];
		this.callParent(arguments);
	},
	savedFilterStore : function() {
		var myStore = new Ext.data.ArrayStore({
					autoLoad : true,
					fields : ['filterName'],
					proxy : {
						type : 'ajax',
						url : 'services/userfilterslist/checkMgmtFilter.json',
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
	getClientStore : function() {
		var clientData = null;
		var objClientStore = null;
		Ext.Ajax.request({
			url : 'services/userseek/userclients.json&$sellerCode='+ strSellerId,
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
				// console.log('Error Occured');
			}
		});
		return objClientStore;
	},
	/*populateClientMenu : function(data) {
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

	},*/
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
		if (lastMonthOnlyFilter===true || me.checkInfinity(intFilterDays))
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
	/*	arrMenuItem.push({
					text : getLabel('daterange', 'Date Range'),
					btnId : 'btnDateRange',
					parent : this,
					btnValue : '7',
					handler : function(btn, opts) {
						this.parent.fireEvent('dateChange', btn, opts);
						//$(document).trigger("filterDateChange",['entryDateQuickFilter',btn,opts]);
					}
				});*/
				
			
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
			
		/* menu = Ext.create('Ext.menu.Menu', {
					items : arrMenuItem
				});	*/
		
		return dropdownMenu;

	}
	/*tools : [{
		xtype : 'container',
		itemId : 'filterClientMenuContainer',
		cls : 'depositFilterCss',
		padding : '0 0 0 5',
		left:150,
		hidden : !isClientUser(),
		items : [{
			xtype : 'label',
			margin : '3 0 0 0',
			html : '<i href="#" id="imgFilterInfo" class="icon-company largepadding"></i>'
		}, {
			xtype : 'button',
			border : 0,
			itemId : 'clientBtn',
			text : getLabel('allCompanies', 'All Companies'),
			cls : 'font_bold xn-custom-more-btn cursor_pointer x-zero-padding ux-custom-more-btn',
			menuAlign : 'b',
			menu : {
				xtype : 'menu',
				maxHeight : 180,
				width : 50,
				cls : 'ext-dropdown-menu xn-menu-noicon',
				itemId : 'clientMenu',
				items : []
			}
		}]
	}, {
		xtype : 'container',
		itemId : 'filterClientAutoCmplterCnt',
		cls : 'depositFilterCss',
		padding : '0 0 0 5',
		layout : {
			type : 'hbox'
		},
		hidden : isClientUser(),
		items : [{
			xtype : 'label',
			margin : '3 0 0 0',
			html : '<i href="#" id="imgFilterInfo" class="icon-company largepadding"></i>'
		}, {
			xtype : 'AutoCompleter',
			margin : '0 0 0 5',
			fieldCls : 'xn-form-text w12 xn-suggestion-box',
			itemId : 'clientAutoCompleter',
			name : 'clientAutoCompleter',
			cfgUrl : 'services/userseek/userclients.json',
			cfgRecordCount : -1,
			cfgRootNode : 'd.preferences',
			cfgDataNode1 : 'DESCR',
			cfgKeyNode : 'CODE',
			//value : strClientId,
			cfgQueryParamName : '$autofilter',
			listeners : {
				'select' : function(combo, record) {
					strClientId = combo.getValue();
					strClientDesc = combo.getRawValue();
					
					// me.fireEvent('clientComboSelect', combo, record);
					 
					
				},
				'change' : function(combo, newValue, oldValue, eOpts) {
					
				},
				'render' : function(combo) {
				}
			}
		}]
	}]*/
});