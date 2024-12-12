/**
 * @class InvestmentCenterFilterView
 * @extends Ext.panel.Panel
 * @author Vaidehi
 */
Ext.define( 'GCP.view.InvestmentCenterFilterView',
	{
		extend : 'Ext.panel.Panel',
		xtype : 'investmentCenterFilterView',
		requires : [],
		width : '100%',
		componentCls : 'gradiant_back',
		collapsible : true,
		cls : 'xn-ribbon',
		layout :
		{
			type : 'vbox',
			align : 'stretch'
		},
		initComponent : function()
		{

			var menuItems =
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
			this.items =
			[
				{
					xtype : 'panel',
					cls : 'ux_paddingtb',
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
									text : 'Type',
									cls : 'f13 ux_payment-type',
									flex : 1
								},
								{
									xtype : 'toolbar',
									padding : '6 0 0 10',
									itemId : 'investmentTypeToolBar',
									cls : 'xn-toolbar-small',
									filterParamName : 'investmentType',
									width : '100%',
									// enableOverflow : true,
									border : false,
									componentCls : 'xn-btn-default-toolbar-small xn-custom-more-toolbar',
									items :
									[
										{
											text : getLabel( 'all', 'All' ),
											code : 'all',
											btnDesc : 'all',
											btnId : 'allInvestmentType',
											parent : this,
											cls : 'f13 xn-custom-heighlight',
											handler : function( btn, opts )
											{
												this.parent.fireEvent( 'filterType', btn, opts );
											}
										},
										{
											text : getLabel( 'investment', 'Investment' ),
											code : 'P',
											btnDesc : 'investment',
											btnId : 'investmentType',
											parent : this,
											handler : function( btn, opts )
											{
												this.parent.fireEvent( 'filterType', btn, opts );
											}
										},
										{
											text : getLabel( 'redemption', 'Redemption' ),
											code : 'R',
											btnDesc : 'redemption',
											btnId : 'redemptionType',
											parent : this,
											handler : function( btn, opts )
											{
												this.parent.fireEvent( 'filterType', btn, opts );
											}
										}
									]

								}
							]
						},
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
											text : 'Request  Date (Date Range)',
											cls : 'f13 ux_payment-type'
										},
										{
											xtype : 'button',
											border : 0,
											filterParamName : 'requestDate',
											itemId : 'requestDate',// Required
											cls : 'menu-disable xn-custom-arrow-button cursor_pointer ux_margint',
											glyph : 'xf0d7@fontawesome',
											padding : '6 0 0 0',
											menu : Ext.create( 'Ext.menu.Menu',
											{
												items : menuItems

											} )

										}
									]
								},
								{
									xtype : 'panel',
									layout : 'hbox',
									padding : '3 0 0 8',
									items :
									[
										{
											xtype : 'container',
											itemId : 'dateRangeComponent',
											layout : 'hbox',
											hidden : false,
											items :
											[
												{
													xtype : 'datefield',
													itemId : 'fromDate',
													hideTrigger : true,
													width : 75,
													fieldCls : 'h2',
													padding : '0 3 0 0',
													editable : false,
													// emptyText
													// :
													// getLabel('instrumentAdvFltFromDate',
													// 'From
													// Date'),
													// submitEmptyText
													// :
													// false,
													value : new Date( Ext.Date.parse( dtApplicationDate,
														strExtApplicationDateFormat ) )
												},
												{
													xtype : 'datefield',
													itemId : 'toDate',
													hideTrigger : true,
													padding : '0 3 0 0',
													editable : false,
													width : 75,
													fieldCls : 'h2',
													// emptyText
													// :
													// getLabel('instrumentAdvFltToDate',
													// 'To
													// Date'),
													// submitEmptyText
													// :
													// false,
													value : new Date( Ext.Date.parse( dtApplicationDate,
														strExtApplicationDateFormat ) )
												},
												{
													xtype : 'button',
													text : getLabel( 'goBtnText', 'Go' ),
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
							itemId : 'advFilterPanel',
							cls : 'xn-filter-toolbar ux_paddingtl',
							flex : 0.8,
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
											text : getLabel( 'advFilters', 'Advance Filters' ),
											cls : 'f13 ux_font-size14'
										},
										{
											xtype : 'button',
											itemId : 'newFilter',
											text : '<span class="button_underline thePoniter ux_font-size14-normal">' + getLabel( 'createNewFilter', 'Create New Filter' )
												+ '</span>',
											cls : 'xn-account-filter-btnmenu xn-small-button',
											margin : '0 0 0 10'
										}
									]
								},
								{
									xtype : 'toolbar',
									itemId : 'advFilterActionToolBar',
									cls : 'xn-toolbar-small',
									padding : '5 0 0 0',
									width : '100%',
									enableOverflow : true,
									border : false,
									// componentCls :
									// 'xn-btn-default-toolbar-small
									// xn-custom-more-toolbar',
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
			[	{
					xtype : 'label',
					text  : getLabel('preferences','Preferences : '),
					cls : 'xn-account-filter-btnmenu'
			 	},{
					xtype : 'button',
					itemId : 'btnClearPreferences',
					disabled : true,
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
					text : getLabel( 'savePreferences', 'Save' ),
					cls : 'xn-account-filter-btnmenu',
					margin : '0 20 0 0',
					textAlign : 'right',
					width : 30
			}
		]
	} );
