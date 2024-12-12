Ext.define('GCP.view.IncomingWiresFilterView', {
	extend : 'Ext.panel.Panel',
	xtype : 'incomingWiresFilterView',
	requires : [],
	width : '100%',
	margin : '0 0 10 0',
	componentCls : 'gradiant_back',
	title : getLabel('filterBy', 'Filter By: '),
	cls : 'xn-ribbon ux_border-bottom',
	layout : {
		type : 'vbox',
		align : 'stretch'
	},
	initComponent : function() {
	var me = this;
	
	var strAppDate = dtApplicationDate;
	var dtFormat = strExtApplicationDateFormat;
	var date = new Date(Ext.Date.parse(strAppDate, dtFormat));
	var isThisWeekHidden = false;

	if (date.getDay() === 1)
		isThisWeekHidden = true;
	
	pmtSummaryView = this;
	me.on('afterrender', function(panel) {
					Ext.Ajax.request({
								url : 'services/userseek/userclients.json&$sellerCode='
										+ strSeller,
								method : "POST",
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
				});
		me.on('afterrender', function(panel) {
					var clientBtn = me.down('button[itemId="clientBtn"]');
					/*
					 * if (clientBtn) clientBtn.setText(me.clientCode);
					 */
					// Set Default Text When Page Loads
					clientBtn
							.setText(getLabel('allCompanies', 'All companies'));
				});
	 var objSellerStore = Ext.create('Ext.data.Store', {
             fields: ['sellerCode', 'description'],
             proxy: {
                 type: 'ajax',
                 autoLoad: true,
                 url: 'services/sellerListFltr.json'
             }
         });
	  var objClientStore = Ext.create('Ext.data.Store', {
		   fields: ['clientId', 'clientDescription'],
		   proxy: {
			   type: 'ajax',
			   autoLoad: true,
			   url: 'services/clientList.json'
		   }
	   });
		this.items = [{
			xtype : 'panel',
			cls : 'ux_paddingtb',
			layout : 'hbox',
			itemId : 'sellerClientMenuBar',
			items : [/*{
				xtype : 'panel',
				cls : 'xn-filter-toolbar',
				itemId : 'sellerMenuBar',
				layout : 'vbox',
				align : 'stretch',
				flex : 0.8,
				cls:' ux_largepadding-left',
				padding : '4 0 0 0',
				items : [{
							xtype : 'label',
							text : getLabel('seller', 'Financial Institution'),
							cls : 'f13 ux_font-size14',
							//flex : 1,
							padding : '0 0 6 0'
						}, {
								xtype : 'combo',
								width : 200,
								displayField : 'description',
								fieldCls : 'xn-form-field inline_block',
								triggerBaseCls : 'xn-form-trigger',
								filterParamName : 'sellerCode',
								itemId : 'bankSellerId',
								valueField : 'sellerCode',
								name : 'seller',
								editable : false,
								store : objSellerStore,
								listeners : {
	                                'render' : function(combo, record) {
	                                                combo.setValue(sessionSellerCode);     
	                                                combo.store.load();
	                                }
								}
							}]
			},{
				xtype : 'panel',
				cls : 'xn-filter-toolbar',
				itemId : 'clientMenuBar',
				layout : 'vbox',
				padding : '4 0 0 0',
				flex : 1.7,
				items : [{
							xtype : 'label',
							text : getLabel('client', 'Client'),
							cls : 'f13 ux_font-size14',
							padding : '0 0 6 0'
							//flex : 1,
						}, {
							xtype : 'panel',
							layout : 'hbox',
							//padding : '6 0 0 10',
							items : [{
								xtype : 'AutoCompleter',
								matchFieldWidth : true,
								cls : 'ux_largepadding-left ux_extralargepadding-bottom',
								fieldCls : 'xn-form-text w10_3 xn-suggestion-box',
								labelSeparator : '',
								name : 'client',
								itemId : 'clientCodeId',
								cfgUrl : 'services/userseek/incomingAdminUserClientSeek.json',
								cfgQueryParamName : '$autofilter',
								cfgRecordCount : -1,
								cfgSeekId : 'clientSeek',
								cfgRootNode : 'd.preferences',
								cfgKeyNode : 'CODE',
								cfgDataNode1 : 'DESCR',
								cfgStoreFields : ['CODE', 'DESCR']

							}]
						}
						]
			},
			{

				xtype : 'panel',
				layout : 'hbox',
				cls:'xn-filter-toolbar',
				itemId : 'clientLoginMenuBar',
				items : [{
					xtype : 'panel',
					padding:'10px',
					cls : 'xn-filter-toolbar',
					itemId : 'clientLoginBar',
					layout : 'vbox',
					align : 'stretch',
					flex : 0.8,
					cls:' ux_largepadding-left',
					items : [{
								xtype : 'label',
								text : getLabel('client', 'Client'),
								cls : 'f13 ux_payment-type'
								//flex : 1,
							}, {
									xtype : 'combo',
									width : 200,
									displayField : 'clientDescription',
									fieldCls : 'xn-form-field inline_block',
									triggerBaseCls : 'xn-form-trigger',
									itemId : 'clientCodeComboId',
									filterParamName : 'clientId',
									valueField : 'clientId',
									name : 'clientId',
									editable : false,
									store : objClientStore,
									listeners : {
		                                'render' : function(combo, record) {
		                                                combo.setValue(sessionClientCode);     
		                                                combo.store.load();
		                                }
									}
							}]
				}]
		}*/]
			},
			{
			xtype : 'panel',
			cls : 'xn-filter-toolbar',
			layout : 'hbox',
			padding : '0 0 10 0',
			items : [{
				xtype : 'panel',
				cls : 'xn-filter-toolbar',
				flex : 0.8,
				layout : {
					type : 'vbox'
				},
				items : [{
							xtype : 'label',
							text : 'Sending Bank',
							cls : 'f13 ux_payment-type',
							flex : 1
						}, {
							xtype : 'toolbar',
							padding : '6 0 0 10',
							itemId : 'incomingWiresTypeToolBar',
							cls : 'xn-toolbar-small',
							filterParamName : 'type',
							width : '100%',
							//enableOverflow : true,
							border : false,
							componentCls : 'xn-btn-default-toolbar-small xn-custom-more-toolbar',
							items : [{
								text : getLabel('select', 'All'),
								code : 'all',
								btnId : 'allPaymentType',
								btnDesc : 'all',
								parent : this,
								cls : 'f13 xn-custom-heighlight',
								handler : function(btn, opts) {
									this.parent.fireEvent('filterType',
											btn, opts);
								}
							},
							{
								xtype : 'label',
								itemId : 'oneBankType',
								text : getLabel('byBank', 'By Bank'),
								cls : 'f13 ux_font-size14'
							}
							]
						}]
			
			},{
				xtype : 'panel',
				cls : 'xn-filter-toolbar',
				layout : 'vbox',
				flex : 0.8,
				items : [{
					xtype : 'panel',
					layout : 'hbox',
					items : [{
								xtype : 'label',
								itemId : 'dateLabel',
								text : getLabel('requestDate', 'Request Date'),
								cls : 'f13 ux_font-size14',
								padding : '0 0 0 7'
							}, {
								xtype : 'button',
								border : 0,
								filterParamName : 'EntryDate',
								itemId : 'entryDate',// Required
								cls : 'menu-disable xn-custom-arrow-button cursor_pointer',
								glyph : 'xf0d7@fontawesome',
								padding : '0 0 0 0',
								menu : me.createDateFilterMenu(isThisWeekHidden)

							}]
				}, {
					xtype : 'panel',
					layout : 'hbox',
					padding : '6 0 0 6',
					items : [{
								xtype : 'container',
								itemId : 'dateRangeComponent',
								layout : 'hbox',
								hidden : true,
								items : [{
											xtype : 'datefield',
											itemId : 'fromDate',
											hideTrigger : true,
											width : 80,
											fieldCls : 'h2',
											padding : '0 3 0 0',
											editable : false,
											value : new Date(Ext.Date.parse(dtApplicationDate, strExtApplicationDateFormat))
										}, {
											xtype : 'datefield',
											itemId : 'toDate',
											hideTrigger : true,
											padding : '0 3 0 0',
											editable : false,
											width : 80,
											fieldCls : 'h2',
											value : new Date(Ext.Date.parse(dtApplicationDate, strExtApplicationDateFormat))
										}, {
											xtype : 'button',
											cls : 'ux_button-background-color ux_button-padding',
											text : getLabel('goBtnText', 'Go'),
											itemId : 'goBtn',
											height : 22
										}]
							}, {
								xtype : 'toolbar',
								itemId : 'dateToolBar',
								cls : 'xn-toolbar-small',
								padding : '2 0 0 1',
								items : [{
											xtype : 'label',
											itemId : 'dateFilterFrom',
											text : dtApplicationDate
										}, {
											xtype : 'label',
											itemId : 'dateFilterTo'
										}]
							}]
				}]
			},
			{
				xtype : 'panel',
				itemId : 'advFilterPanel',
				cls : 'xn-filter-toolbar ux_paddingtl',
				flex : 0.9,
				layout : {
					type : 'vbox'
				},
				items : [{
					xtype : 'panel',
					layout : {
						type : 'hbox'
					},
					items : [{
								xtype : 'label',
								text : getLabel('advFilters',
										'Advance Filters'),
								cls : 'f13 ux_font-size14'
							}, {
								xtype : 'image',
								src : 'static/images/icons/icon_spacer.gif',
								cls : 'ux_hide-image',
								height : 18

							}, {
								xtype : 'button',
								itemId : 'newFilter',
								text : '<span class="button_underline">'
										+ getLabel('createNewFilter',
												'Create New Filter')
										+ '</span>',
								cls : 'xn-account-filter-btnmenu xn-small-button',
								margin : '0 0 0 10'
							}]
				}, {
					xtype : 'toolbar',
					itemId : 'advFilterActionToolBar',
					cls : 'xn-toolbar-small',
					padding : '6 0 0 0',
					width : '100%',
					enableOverflow : true,
					border : false,
					items : []
				}]
			}]
		}

		];
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
						this.parent.fireEvent('dateChange', btn, opts);
					}
				});
		arrMenuItem.push({
					text : getLabel('today', 'Today'),
					btnId : 'btnToday',
					btnValue : '1',
					parent : this,
					handler : function(btn, opts) {
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
							this.parent.fireEvent('dateChange', btn, opts);
						}
					});
		if (intFilterDays >= 30 || me.checkInfinity(intFilterDays))
			arrMenuItem.push({
						text : getLabel('thismonth', 'This Month'),
						btnId : 'btnThismonth',
						parent : this,
						btnValue : '5',
						handler : function(btn, opts) {
							this.parent.fireEvent('dateChange', btn, opts);
						}
					});
		if (intFilterDays >= 60 || me.checkInfinity(intFilterDays))
			arrMenuItem.push({
						text : getLabel('lastMonthToDate', 'Last Month To Date'),
						btnId : 'btnLastmonth',
						btnValue : '6',
						parent : this,
						handler : function(btn, opts) {
							this.parent.fireEvent('dateChange', btn, opts);
						}
					});
		if (intFilterDays >= 90 || me.checkInfinity(intFilterDays))
			arrMenuItem.push({
						text : getLabel('thisquarter', 'This Quarter'),
						btnId : 'btnLastMonthToDate',
						btnValue : '8',
						parent : this,
						handler : function(btn, opts) {
							this.parent.fireEvent('dateChange', btn, opts);
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
							this.parent.fireEvent('dateChange', btn, opts);
						}
					});
		arrMenuItem.push({
					text : getLabel('daterange', 'Date Range'),
					btnId : 'btnDateRange',
					parent : this,
					btnValue : '7',
					handler : function(btn, opts) {
						this.parent.fireEvent('dateChange', btn, opts);

					}
				});
		menu = Ext.create('Ext.menu.Menu', {
					items : arrMenuItem
				});
		return menu;

	},
	tools : [{
		xtype : 'container',
		itemId : 'filterClientMenuContainer',
		cls : 'depositFilterCss',
		padding : '0 0 0 5',
		left:150,
		hidden : !isClientUser(),
		items : [{
			xtype : 'label',
			html : '<img id="imgFilterInfo" class="icon-company"/>'
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
			html : '<img id="imgFilterInfo" class="icon-company"/>'
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
			value : strClient,
			cfgQueryParamName : '$autofilter',
			listeners : {
				'select' : function(combo, record) {
					strClient = combo.getValue();
					strClientDesc = combo.getRawValue();
					/*
					 * me.fireEvent('clientComboSelect', combo, record);
					 */
					pmtSummaryView.fireEvent('handleClientChange', strClient,
							strClientDesc);
				},
				'change' : function(combo, newValue, oldValue, eOpts) {
					if (Ext.isEmpty(newValue)) {
						pmtSummaryView.fireEvent('handleClientChange');
					}
				},
				'render' : function(combo) {
					combo.store.loadRawData({
								"d" : {
									"preferences" : [{
												"CODE" : strClient,
												"DESCR" : strClientDesc
											}]
								}
							});
					combo.listConfig.width = 200;
					combo.suspendEvents();
					combo.setValue(strClient);
					combo.resumeEvents();
				}
			}
		}]
	},{
				xtype : 'label',
				text  : getLabel('preferences','Preferences : '),
				cls : 'xn-account-filter-btnmenu'
			 },{
				xtype : 'button',
				itemId : 'btnClearPreferences',
				disabled : false,
				text : getLabel('clearFilter', 'Clear'),
				cls : 'xn-account-filter-btnmenu',
				textAlign : 'right',
				width : 40
			},{
				xtype : 'image',
				src : 'static/images/icons/icon_spacer.gif',
				height : 18
			},{
				xtype : 'button',
				itemId : 'btnSavePreferences',
				disabled : true,
				text : getLabel('saveFilter', 'Save'),
				cls : 'xn-account-filter-btnmenu',
				textAlign : 'right',
				width : 30,
				margin : '0 20 0 0'
			}]
});