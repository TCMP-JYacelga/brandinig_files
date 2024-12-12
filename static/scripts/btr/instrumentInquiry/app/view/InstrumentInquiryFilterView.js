Ext.define( 'GCP.view.InstrumentInquiryFilterView',
{
	extend : 'Ext.panel.Panel',
	xtype : 'instrumentInquiryFilterView',
	requires : [],
	width : '100%',
	componentCls : 'gradiant_back',
	collapsible : true,
	collapsed: true,
	cls : 'xn-ribbon ux_border-bottom',
	layout :
	{
		type : 'vbox',
		align : 'stretch'
	},
	initComponent : function()
	{
		var me=this;
		
		this.items =
		[
			{
				xtype : 'panel',
				cls : 'ux_largepadding',
				layout : 'hbox',
				items :
				[
					{
						xtype : 'panel',
						cls : 'xn-filter-toolbar',
						flex : 0.8,
						layout :
						{
							type : 'vbox'
						},
						items :
						[
							{
								xtype : 'label',
								text : getLabel( 'status', 'Deposit Ticket' ),
								cls : 'ux_font-size14',
								flex : 1,
								padding : '0 0 6 0'
							},
							{
								xtype : 'AutoCompleter',
								matchFieldWidth : true,
								cls : 'autoCmplete-field ',
								fieldCls : 'w11 xn-suggestion-box',
								labelSeparator : '',
								name : 'depSlipId',
								itemId : 'depSlipIdItemId',
								value : depSlipNmbr,
								cfgUrl : 'services/userseek/clientDepositSlipNoSeek.json',
								cfgQueryParamName : '$autofilter',
								cfgRecordCount : -1,
								cfgSeekId : 'depSlipId',
								cfgRootNode : 'd.preferences',
								cfgKeyNode : 'CODE',
								cfgDataNode1 : 'DESCRIPTION',
								cfgStoreFields :
								[
									'CODE', 'DESCRIPTION'
								]
							} 
						/*	{
								xtype : 'toolbar',
								padding : '0 0 6 0',
								itemId : 'instrumentInqStatusToolBar',
								filterParamName : 'instrumentStatus',
								cls : 'xn-toolbar-small',
								border : false,
								componentCls : 'xn-btn-default-toolbar-small xn-custom-more-toolbar',
								items :
								[
									{
										text : getLabel( 'all', 'All' ),
										code : 'all',
										btnId : 'allInstrumentStatus',
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
										text : getLabel( 'paid', 'Paid' ),
										btnId : 'paidInstrumentStatus',
										btnValue : 'P',
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
										text : getLabel( 'lbl.unpaid', 'Unpaid' ),
										btnId : 'unPaidInstrumentStatus',
										btnValue : 'U',
										parent : this,
										cls : 'xn-account-filter-btnmenu cursor_pointer',
										padding : '4 0 0 5',
										handler : function( btn, opts )
										{
											this.parent.fireEvent( 'filterType', btn, opts );
										}
									}
								]
							}*/
						]
					},
					{
						xtype : 'panel',
						cls : 'xn-filter-toolbar',
						padding : '0 0 0 13',
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
										text : getLabel( 'lblChkDate', 'Item Date' ),
										cls : ' ux_font-size14',
										padding : '0 0 6 0'
									},
									{
										xtype : 'button',
										border : 0,
										filterParamName : 'instrumentDate',
										itemId : 'instrumentDateItemId',// Required
										cls : 'menu-disable xn-custom-arrow-button cursor_pointer ux_margint',
										glyph : 'xf0d7@fontawesome',
										margin : '0 0 0 0',
										menu : Ext.create( 'Ext.menu.Menu',
										{
											items :
											[
												{
													text : getLabel( 'latest', 'Latest' ),
													btnId : 'btnLatest',
													btnValue : '12',
													parent : this,
													handler : function( btn, opts )
													{
														this.parent.fireEvent( 'dateChange', btn, opts );
													}
												},
												{
													text : getLabel( 'today', 'Today' ),
													btnId : 'btnToday',
													btnValue : '1',
													parent : this,
													handler : function( btn, opts )
													{
														this.parent.fireEvent( 'dateChange', btn, opts );
													}
												},
												{
													text : getLabel( 'yesterday', 'Yesterday' ),
													btnId : 'btnYesterday',
													btnValue : '2',
													parent : this,
													handler : function( btn, opts )
													{
														this.parent.fireEvent( 'dateChange', btn, opts );
													}
												},
												{
													text : getLabel( 'thisweek', 'This Week' ),
													btnId : 'btnThisweek',
													btnValue : '3',
													parent : this,
													handler : function( btn, opts )
													{
														this.parent.fireEvent( 'dateChange', btn, opts );
													}
												},
												{
													text : getLabel( 'lastweektodate', 'Last Week To Date' ),
													btnId : 'btnLastweek',
													parent : this,
													btnValue : '4',
													handler : function( btn, opts )
													{
														this.parent.fireEvent( 'dateChange', btn, opts );
													}
												},
												{
													text : getLabel( 'thismonth', 'This Month' ),
													btnId : 'btnThismonth',
													parent : this,
													btnValue : '5',
													handler : function( btn, opts )
													{
														this.parent.fireEvent( 'dateChange', btn, opts );
													}
												},
												{
													text : getLabel( 'lastMonthToDate', 'Last Month To Date' ),
													btnId : 'btnLastmonth',
													btnValue : '6',
													parent : this,
													handler : function( btn, opts )
													{
														this.parent.fireEvent( 'dateChange', btn, opts );
													}
												},
												{
													text : getLabel( 'thisquarter', 'This Quarter' ),
													btnId : 'btnLastMonthToDate',
													btnValue : '8',
													parent : this,
													handler : function( btn, opts )
													{
														this.parent.fireEvent( 'dateChange', btn, opts );
													}
												},
												{
													text : getLabel( 'lastQuarterToDate', 'Last Quarter To Date' ),
													btnId : 'btnQuarterToDate',
													btnValue : '9',
													parent : this,
													handler : function( btn, opts )
													{
														this.parent.fireEvent( 'dateChange', btn, opts );
													}
												},
												{
													text : getLabel( 'thisyear', 'This Year' ),
													btnId : 'btnLastQuarterToDate',
													btnValue : '10',
													parent : this,
													handler : function( btn, opts )
													{
														this.parent.fireEvent( 'dateChange', btn, opts );
													}
												},
												{
													text : getLabel( 'lastyeartodate', 'Last Year To Date' ),
													btnId : 'btnYearToDate',
													parent : this,
													btnValue : '11',
													handler : function( btn, opts )
													{
														this.parent.fireEvent( 'dateChange', btn, opts );
													}
												},
												{
													text : getLabel( 'daterange', 'Date Range' ),
													btnId : 'btnDateRange',
													parent : this,
													btnValue : '7',
													handler : function( btn, opts )
													{
														this.parent.fireEvent( 'dateChange', btn, opts );
													}
												}
											]
										} )

									}
								]
							},
							{
								xtype : 'panel',
								layout : 'hbox',
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
												//emptyText : getLabel('instrumentAdvFltFromDate',
												//'From Date'),
												//submitEmptyText : false,
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
												//emptyText : getLabel('instrumentAdvFltToDate',
												//'To Date'),
												//submitEmptyText : false,
												value : new Date( Ext.Date.parse( dtApplicationDate,
													strExtApplicationDateFormat ) )
											},
											{
												xtype : 'button',
												text : getLabel( 'goBtnText', 'Go' ),
												cls : 'ux_button-background-color ux_button-padding',
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
												itemId : 'dateFilterTo'
											}
										]
									}
								]
							}
						]
					},
					{
						xtype : 'panel',
						itemId : 'advFilterPanel',
						cls : 'xn-filter-toolbar',
						//padding : '0 0 0 6',
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
										text : getLabel( 'advFilters', 'Advanced Filters' ),
										cls : 'f13 ux_font-size14',
										padding : '0 0 6 0'
									},
									{
										xtype : 'button',
										itemId : 'newFilter',
										text : '<span class="button_underline">'
											+ getLabel( 'createNewFilter', 'Create New Filter' ) + '</span>',
										cls : 'xn-account-filter-btnmenu xn-small-button',
										width : 120
									},
									{
										xtype : 'button',
										cls : 'xn-button ux_button-background-color ux_button-padding',
										arrowAlign : 'right',
										hidden : true,
										text : getLabel( 'btnGo', 'GO' ),
										btnId : 'btnGo',
										parent : this,
										handler : function( btn, opts )
										{
											this.parent.fireEvent( 'doRetrieve', btn, opts );
										}
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
								//componentCls : 'xn-btn-default-toolbar-small xn-custom-more-toolbar',
								items : []

							}
						]
					}
				]
			}

		];
		this.callParent( arguments );
	},
	tools :
	[	
		{
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
			margin : '0 18 0 0',
			width : 30
		}
	]
} );
