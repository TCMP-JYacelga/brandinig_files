Ext.define( 'GCP.view.PassThruFileACHBatchFilterView',
{
	extend : 'Ext.panel.Panel',
	xtype : 'passThruFileACHBatchFilterViewType',
	requires : [],
	width : '100%',
	//padding : '0 0 12 0',
	componentCls : 'gradiant_back',
	collapsible : true,
	cls : 'xn-ribbon ux_border-bottom',
	layout :
	{
		type : 'vbox',
		align : 'stretch'
	},
	initComponent : function()
	{
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
										text : getLabel( 'effectiveEntryDateRange', 'Effective Entry Date (Date Range)' ),
										cls : 'f13 ux_font-size14',
										padding : '0 0 6 0'
									},
									{
										xtype : 'button',
										border : 0,
										filterParamName : 'effectiveEntryDate',
										itemId : 'entryDate',// Required
										cls : 'menu-disable xn-custom-arrow-button cursor_pointer',
										glyph : 'xf0d7@fontawesome',
										margin : '0 0 0 0',
										menu : Ext.create( 'Ext.menu.Menu',
										{
											items :
											[
												{
													text : getLabel('latest', 'Latest'),
													btnId : 'btnLatest',
													btnValue : '12',
													parent : this,
													handler : function(btn, opts) {
														this.parent.fireEvent('dateChange',
																btn, opts);
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
												width : 75,
												fieldCls : 'h2',
												padding : '0 3 0 0',
												editable : false,
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
								layout :
								{
									type : 'hbox'
								},
								items :
								[
									{
										xtype : 'label',
										text : getLabel( 'advFilters', 'Advanced Filters' ),
										cls : 'f13 ux_font-size14'
									},
									{
										xtype : 'button',
										itemId : 'newFilter',
										text : '<span class="button_underline">'
											+ getLabel( 'createNewFilter', 'Create New Filter' ) + '</span>',
										cls : 'xn-account-filter-btnmenu xn-small-button',
										width : 120
									}
								]
							},
							{
								xtype : 'toolbar',
								itemId : 'advFilterActionToolBar',
								cls : 'xn-toolbar-small',
								padding : '5 0 0 1',
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
	[
		{
			xtype : 'button',
			itemId : 'btnSavePreferences',
			icon : 'static/images/icons/save.gif',
			disabled : true,
			text : getLabel( 'saveFilter', 'Save Preference' ),
			cls : 'xn-account-filter-btnmenu',
			textAlign : 'right',
			width : 120
		}
	]
} );
