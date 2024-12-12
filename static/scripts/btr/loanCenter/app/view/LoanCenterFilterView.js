Ext.define( 'GCP.view.LoanCenterFilterView',
{
	extend : 'Ext.panel.Panel',
	xtype : 'loanCenterFilterViewType',
	requires :  ['Ext.panel.Panel', 'Ext.form.Label', 'Ext.menu.Menu',
			'Ext.form.field.Date', 'Ext.picker.Date',
			'Ext.container.Container', 'Ext.toolbar.Toolbar',
			'Ext.button.Button'],
	width : '100%',
	componentCls : 'gradiant_back',	
	cls : 'xn-ribbon',
	layout :
	{
		type : 'vbox',
		align : 'stretch'
	},
	initComponent : function()
	{
		var me = this;
		loanCenterView = this;
		this.items =
		[
			{
				xtype : 'panel',
				cls : 'ux_paddingtb',
				layout : 'hbox',
				items :
				[
					/*{
						xtype : 'panel',
						cls : 'xn-filter-toolbar',
						flex : 0.85,
						layout :
						{
							type : 'vbox'
						},
						items :
						[
							{
								xtype : 'label',
								text : getLabel( 'type', 'Type' ),
								cls : 'f13 ux_payment-type',
								flex : 1
							},
							{
								xtype : 'toolbar',
								padding : '6 0 0 10',
								itemId : 'loanCenterTypeToolBarItemId',
								filterParamName : 'paymentType',
								cls : 'xn-toolbar-small',
								flex: 1,
								border : false,
								componentCls : 'xn-btn-default-toolbar-small xn-custom-more-toolbar',
								items :
								[
									{
										text : getLabel( 'all', 'All' ),
										code : 'all',
										btnId : 'allType',
										btnValue : 'all',
										parent : this,
										cls : 'f13 xn-custom-heighlight',
										handler : function( btn, opts )
										{
											this.parent.fireEvent( 'filterType', btn, opts );
										}
									},
									{
										border : 0,
										text : getLabel( 'lbl.payDown', 'Paydown' ),
										btnId : 'payDownType',
										btnValue :
										[
											'P', 'F'
										],
										parent : this,
										cls : 'xn-account-filter-btnmenu cursor_pointer',
										padding : '4 0 0 5',
										handler : function( btn, opts )
										{
											this.parent.fireEvent( 'filterType', btn, opts );
										}
									},
									{
										border : 0,
										text : getLabel( 'lbl.advance', 'Advance' ),
										btnId : 'payAdvanceType',
										btnValue : 'D',
										parent : this,
										cls : 'xn-account-filter-btnmenu cursor_pointer',
										padding : '4 0 0 5',
										handler : function( btn, opts )
										{
											this.parent.fireEvent( 'filterType', btn, opts );
										}
									},
									{
										border : 0,
										text : getLabel( 'lbl.payInvoice', 'Pay Invoice' ),
										hidden : isSiTabSelected == 'Y' ? true : false,
										btnId : 'payInvoiceType',
										btnValue : 'I',
										parent : this,
										cls : 'xn-account-filter-btnmenu cursor_pointer',
										padding : '4 0 0 5',
										handler : function( btn, opts )
										{
											this.parent.fireEvent( 'filterType', btn, opts );
										}
									}
								]
							}
						]
					},*/
					{
						xtype : 'panel',
						cls : 'xn-filter-toolbar ux_normalmargin-left',
						layout : 'vbox',
						flex : 0.7,
						items :
						[
							{
								xtype : 'panel',
								layout : 'hbox',
								items :
								[
									{
										xtype : 'label',
										itemId : 'requestDateLabelItemId',
										text : 'Request  Date (Date Range)',
										cls : 'f13 ux_payment-type'
									},
									{
										xtype : 'button',
										border : 0,
										filterParamName : 'requestDate',
										itemId : 'requestDateItemId',// Required
										cls : 'menu-disable xn-custom-arrow-button cursor_pointer ux_margint',
										glyph : 'xf0d7@fontawesome',
										padding : '6 0 0 3',
										arrowAlign : 'right',
										menu : me.createDateFilterMenu()
										
									}
								]
							},
							{
								xtype : 'panel',
								layout : 'hbox',
								padding : '6 0 0 9',
								items :
								[
									{
										xtype : 'container',
										itemId : 'dateRangeComponentItemId',
										layout : 'hbox',
										hidden : true,
										items :
										[
											{
												xtype : 'datefield',
												itemId : 'fromDateFieldItemId',
												hideTrigger : true,
												width : 80,
												fieldCls : 'h2',
												format : !Ext
															.isEmpty(strExtApplicationDateFormat)
															? strExtApplicationDateFormat
															: 'm/d/Y',
												padding : '0 3 0 0',
												parent : me,
												vtype : '',
												endDateField : 'toDateFieldItemId',
												editable : false,
												value : new Date( Ext.Date.parse( dtApplicationDate,
													strExtApplicationDateFormat ) )
											},
											{
												xtype : 'datefield',
												itemId : 'toDateFieldItemId',
												hideTrigger : true,
												padding : '0 3 0 0',
												editable : false,
												width : 80,
													format : !Ext
														.isEmpty(strExtApplicationDateFormat)
														? strExtApplicationDateFormat
														: 'm/d/Y',
												parent : me,
												vtype : '',
												startDateField : 'fromDateFieldItemId',
												fieldCls : 'h2',
												value : new Date( Ext.Date.parse( dtApplicationDate,
													strExtApplicationDateFormat ) )
											},
											{
												xtype : 'button',
												cls : 'ux_button-background-color ux_button-padding',
												text : getLabel( 'goBtnText', 'Go' ),
												itemId : 'goBtnItemId',
												height : 22
											}
										]
									},
									{
										xtype : 'toolbar',
										itemId : 'dateToolBarItemId',
										cls : 'xn-toolbar-small',
										padding : '0 0 0 1',
										items :
										[
											{
												xtype : 'label',
												itemId : 'dateFilterFromLabelItemId',
												text : dtApplicationDate
											},
											{
												xtype : 'label',
												itemId : 'dateFilterToLabelItemId',
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
						itemId : 'advFilterPanelItemId',
						cls : 'xn-filter-toolbar',
						flex : 0.9,
						layout :
						{
							type : 'vbox'
						},
						items :
						[
							{
								xtype : 'panel',
								cls : 'ux_paddingtl',
								layout :
								{
									type : 'hbox'
								},
								items :
								[
									{
										xtype : 'label',
										text : getLabel( 'advFilters', 'Advance Filters' ),
										cls : 'f13 ux_font-size14'
									},
									{
										xtype : 'button',
										itemId : 'newFilterItemId',
										text : '<span class="button_underline">'
											+ getLabel( 'createNewFilter', 'Create New Filter' ) + '</span>',
										cls : 'xn-account-filter-btnmenu xn-small-button',
										margin : '0 0 0 10'
									}
								]
							},
							{
								xtype : 'toolbar',
								itemId : 'advFilterActionToolBarItemId',
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
					if (clientBtn)
						clientBtn.setText(getLabel('allCompanies', 'All companies'));
					if(!Ext.isEmpty(strClientDescr))		
						clientBtn.setText(strClientDescr);
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
				&& Ext.isEmpty(objClientParameters[''])
				&& objClientParameters['filterDays'] !== 0
				? parseInt(objClientParameters['filterDays'],10)
				: '';
				
		var arrMenuItem = [
				];
		
		arrMenuItem.push({
			text : getLabel('latest', 'Latest'),
			btnId : 'btnLatest',
			btnValue : '12',
			parent : this,
			handler : function(btn, opts) {
				me.doResetInformatinFilter();
				$(document).trigger("filterDateChange",['entryDateQuickFilter',btn,opts]);
			}
		});

		arrMenuItem.push({
					text : getLabel('latest', 'Latest'),
					btnId : 'btnLatest',
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
						var field = me.down('datefield[itemId="fromDateFieldItemId"]');						
						if (field)
							field.setValue('');
						field = me.down('datefield[itemId="toDateFieldItemId"]');
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
		var objToolbar = me.down('toolbar[itemId="advFilterActionToolBarItemId"]');
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
					if(client.CODE === strClientCode && 'undefined' != client.CODE)
						strClientDesc = client.DESCR;
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
		//left:30,
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
		cls : 'paymentqueuespacer ',
		padding : '0 0 0 5',
		//left : 85,
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
					strClientDescr = combo.getRawValue();
					me.fireEvent('handleClientChange',
											strClient, strClientDescr);
				},
				'change' : function(combo, newValue, oldValue, eOpts) {
					if (Ext.isEmpty(newValue)) {
						pmtSummaryView.fireEvent('handleClientChange');
					}
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
			itemId : 'btnSavePreferencesItemId',
			disabled : true,
			text : getLabel( 'saveFilter', 'Save' ),
			cls : 'xn-account-filter-btnmenu',
			textAlign : 'right',
			width : 30,
			margin : '0 20 0 0'
		}
	]
} );
