/**
 * @class GCP.view.MessageFormMstInfoView
 * @extends Ext.panel.Panel
 * @author Nilesh Shinde
 */
Ext.define( 'GCP.view.MessageFormMstInfoView',
{
	extend : 'Ext.panel.Panel',
	xtype : 'messageFormMstInfoViewType',
	requires :
	[
		'Ext.panel.Panel', 'Ext.Img', 'Ext.form.Label', 'Ext.button.Button'
	],
	width : '100%',
	margin : '5 0 0 0',
	componentCls : 'xn-ribbon-body',
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
				itemId : 'infoHeaderBarItemId',
				bodyCls : 'xn-ribbon-header',
				width : '100%',
				layout :
				{
					type : 'hbox'
				},
				items :
				[
					{
						xtype : 'image',
						itemId : 'summInfoShowHideGridItemId',
						cls : 'cursor_pointer middleAlign icon_collapse_summ',
						margin : '3',
						listeners :
						{
							render : function( c )
							{
								c.getEl().on( 'click', function()
								{
									this.fireEvent( 'click', c );
								}, c );
							}
						}
					},
					{
						xtype : 'label',
						itemId : 'summDateLabelItemId',
						text : getLabel( 'summinformation', 'Summary Information' ),
						cls : 'x-custom-header-font',
						padding : '4 20 0 2'
					},
					{
						xtype : 'label',
						itemId : 'requestDateLabelItemId',
						text : 'Latest',
						cls : 'f13',
						padding : '6 5 0 5'
					},
					{
						xtype : 'button',
						border : 0,
						filterParamName : 'requestDate',
						itemId : 'requestDateItemId',// Required
						cls : 'xn-custom-arrow-button cursor_pointer w1',
						padding : '6 0 0 0',
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
					},
					{

						xtype : 'panel',
						layout : 'hbox',
						padding : '6 0 0 5',
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
										width : 75,
										fieldCls : 'h2',
										padding : '0 3 0 0',
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
										width : 75,
										fieldCls : 'h2',
										value : new Date( Ext.Date.parse( dtApplicationDate,
											strExtApplicationDateFormat ) )
									},
									{
										xtype : 'button',
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
								padding : '2 0 0 1',
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
				padding : '5 0 0 9',
				itemId : 'infoSummaryPanelView',
				layout : 'vbox',
				items :
				[
					{
						xtype : 'panel',
						itemId : 'infoSummaryMostUsedFormPanel',
						flex : 0.8,
						layout :
						{
							type : 'hbox'
						},
						items :
						[
						 	{
						 		xtype : 'label',
								overflowX : 'hidden',
								overflowY : 'hidden',
								height : 15,
								text : getLabel( 'mostUsedFrms', 'Most Used Forms' ),
								padding : '0 47 10 0'
						 	}
						
						]
						
					},
					
					{
						xtype : 'panel',
						itemId : 'infoSummaryLeastUsedFormPanel',
						flex : 0.8,
						layout :
						{
							type : 'hbox'
						},
						items : 
						[
							{
								xtype : 'label',
								overflowX : 'hidden',
								overflowY : 'hidden',
								height : 15,
								text : getLabel( 'lbl.leastUsedForms', 'Least Used Forms' ),
								padding : '0 45 10 0'
							}	
						 ]
					
					}
				
				]
			}

			
		];
		this.callParent( arguments );
	}

} );
