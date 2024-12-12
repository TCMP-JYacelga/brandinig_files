Ext.define( 'GCP.view.LoanInvoiceFilterView',
	{
		extend : 'Ext.panel.Panel',
		xtype : 'loanInvoiceNewFilterViewType',
		requires : [],
		width : '100%',
		componentCls : 'gradiant_back',		
  		cls : 'xn-ribbon ux_border-bottom',
		layout :
		{
			type : 'vbox',
			align : 'stretch'
		},
		initComponent : function()
		{
			var me = this;
			invoiceSummary = this;
			this.items =
			[
				{
					xtype : 'panel',
					layout : 'hbox',
					cls : 'ux_largepadding',
					items :
					[
						{
							xtype : 'panel',
							cls : 'xn-filter-toolbar',
							layout : 'vbox',
							flex : 0.8,
							items :
							[
								{
									xtype : 'panel',
									layout : 'hbox',
									items :
									[
										{
											xtype : 'label',
											itemId : 'dateLabel',
											text : 'Payment Due (Date Range)',
											cls : 'f13 ux_font-size14',
											padding : '0 0 6 0'
										},
										{
											xtype : 'button',
											border : 0,
											filterParamName : 'dueDate',
											itemId : 'entryDate',// Required
											cls : 'menu-disable xn-custom-arrow-button cursor_pointer ux_margint',
											glyph : 'xf0d7@fontawesome',
											margin : '0 0 0 0',
											menu : me.createDateFilterMenu()
											
										}
									]
								},
								{
									xtype : 'panel',
									layout : 'hbox',
									padding : '6 0 0 5',
									items :
									[
										{
											xtype : 'container',
											itemId : 'dateRangeComponent',
											layout : 'hbox',
											hidden : true,
											items :
											[
												{
													xtype : 'datefield',
													itemId : 'fromDate',
													hideTrigger : true,
													width : 80,
													fieldCls : 'h2',
													padding : '0 3 0 0',
													editable : false,
													vtype : '',
													endDateField : 'toDate',
													value : new Date( Ext.Date.parse( dtApplicationDate,
														strExtApplicationDateFormat ) )
												},
												{
													xtype : 'datefield',
													itemId : 'toDate',
													hideTrigger : true,
													padding : '0 3 0 0',
													editable : false,
													width : 80,
													fieldCls : 'h2',
													vtype : '',
													startDateField : 'fromDate',
													value : new Date( Ext.Date.parse( dtApplicationDate,
														strExtApplicationDateFormat ) )
												},
												{
													xtype : 'button',
													text : getLabel( 'goBtnText', 'Go' ),
													cls : 'ux_button-background-color ux_padding',
													itemId : 'goBtn',
													height : 22
												}
											]
										},
										{
											xtype : 'toolbar',
											itemId : 'dateToolBar',
											cls : 'xn-toolbar-small',
											padding : '2 0 0 1',
											items :
											[
												{
													xtype : 'label',
													itemId : 'dateFilterFrom',
													text : dtApplicationDate
												},
												{
													xtype : 'label',
													itemId : 'dateFilterTo',
													text : dtApplicationDate
												}
											]
										}
									]
								}
							]
						},
						{
							xtype : 'panel',
							cls : 'xn-filter-toolbar',
							flex : 0.8
							
						},
						{
							xtype : 'panel',
							itemId : 'advFilterPanel',
							cls : 'xn-filter-toolbar ux_normalmargin-left ', 
							flex : 0.9,
							layout :
							{
								type : 'vbox'
							},
							items :
							[
								{
									xtype : 'panel',
									layout :
									{
										type : 'hbox'
									},
									items :
									[
										{
											xtype : 'label',
											text : getLabel( 'advFilters', 'Advance Filter' ),
											cls : 'f13 ux_font-size14'
											//padding : '0 0 6 0'
										},
										{
											xtype : 'button',
											itemId : 'newFilter',
											text : '<span class="button_underline">' + getLabel( 'createNewFilter', 'Create New Filter' )
												+ '</span>',
											cls : 'xn-account-filter-btnmenu xn-small-button',
											width : 120
										}
									]
								},
								{
									xtype : 'toolbar',
									itemId : 'advFilterActionToolBar',
									cls : 'xn-toolbar-small',
									width : '100%',
									enableOverflow : true,
									border : false,
									items : []
								}
							]
						}
					]
				}
			];
			me.on('afterrender', function(panel) {
						Ext.Ajax.request({
									url : 'services/userseek/userclients.json',
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
						// Set Default Text When Page Loads
						clientBtn
								.setText(getLabel('allCompanies', 'All companies'));
					});
			this.callParent( arguments );
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
	checkInfinity : function(intFilterDays)
	{
		if(intFilterDays == '0' || Ext.isEmpty(intFilterDays))
			{ 
				return true;
			}		
	},
		createDateFilterMenu : function() {
		var me = this;
		var menu = null;
		
		var intFilterDays = objClientParameters
				&& !Ext.isEmpty(objClientParameters['filterDays'])
				&& objClientParameters['filterDays'] !== 0
				? parseInt(objClientParameters['filterDays'],10)
				: '';
				
				
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
		if (intFilterDays >= 90 || me.checkInfinity(intFilterDays))
			arrMenuItem.push({
						text : getLabel('thisquarter', 'This Quarter'),
						btnId : 'btnLastMonthToDate',
						btnValue : '8',
						parent : this,
						handler : function(btn, opts) {
							me.doResetInformatinFilter();
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
		arrMenuItem.push({
					text : getLabel('daterange', 'Date Range'),
					btnId : 'btnDateRange',
					parent : this,
					btnValue : '7',
					handler : function(btn, opts) {
						var field = me.down('datefield[itemId="fromDate"]');
						if (field)
							field.setValue('');
						field = me.down('datefield[itemId="toDate"]');
						if (field)
							field.setValue('');
						this.parent.fireEvent('dateChange', btn, opts);

					}
				});

		menu = Ext.create('Ext.menu.Menu', {
					items : arrMenuItem
				});
		return menu;
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
		tools :
		[	{
		xtype : 'container',
		itemId : 'filterClientMenuContainer',
		cls : 'paymentqueuespacer',
		padding : '0 0 0 5',
		left:150,
		hidden : !isClientUser(),
		items : [{
			xtype : 'label',
			margin : '4 0 0 0',
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
		cls : 'paymentqueuespacer',
		padding : '0 0 0 5',
		layout : {
			type : 'hbox'
		},
		hidden : isClientUser(),
		items : [{
			xtype : 'label',
			margin : '4 0 0 0',
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
			//value : strClient,
			cfgQueryParamName : '$autofilter',
			listeners : {
				'select' : function(combo, record) {
					strClient = combo.getValue();
					strClientDesc = combo.getRawValue();
					me.fireEvent('clientComboSelect', combo, record);
					
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
				text : getLabel( 'saveFilter', 'Save' ),
				cls : 'xn-account-filter-btnmenu',
				textAlign : 'right',
				width : 30
			}
		]
	} );
