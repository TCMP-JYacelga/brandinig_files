Ext.define( 'GCP.view.InvestmentCenterGridInformationView',
{
	extend : 'Ext.panel.Panel',
	xtype : 'investmentCenterGridInformationView',
	requires :
	[
		'Ext.panel.Panel', 'Ext.Img', 'Ext.form.Label', 'Ext.button.Button'
	],
	width : '100%',
	componentCls : 'xn-ribbon-body ux_panel-transparent-background',
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
				itemId : 'investmentCenterSummInfoHeaderBarGridView',
				//bodyCls : 'xn-ribbon-header',
				bodyCls : 'xn-ribbon ux_panel-transparent-background ux_header-pad',
				width : '100%',
				layout :
				{
					type : 'hbox'
				},
				items :
				[
					{
						xtype : 'container',
						itemId : 'summInfoShowHideGridView',
						cls : 'cursor_pointer middleAlign icon_collapse_summ',
						margin : '3 0',
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
						itemId : 'gridInfoDateLabel',
						text : getLabel( 'summinformation', 'Summary Information' ),
						cls : 'x-custom-header-font',
						margin: '0 0 0 20',
						padding : '0 0 0 2'
					}
				]
			}
		];
		this.callParent( arguments );
	},

	createSummaryLowerPanelView : function()
	{
		var me = this;
		var balanceArray = this.createTypeCodesList();
		var summaryLowerPanel = Ext.create( 'Ext.panel.Panel',
		{
			layout : 'hbox',
			itemId : 'infoSummaryLowerPanel',
			cls : 'ux_border-top xn-pad-10',
			items : balanceArray
		} );
		me.add( summaryLowerPanel );
	},
	createTypeCodesList : function()
	{
		var balanceArray = new Array();
		balanceArray.push(
		{
			xtype : 'panel',
			flex : 0.37,
			layout : 'vbox',
			margin : '0 30 0 0',
			items :
			[
				{
					xtype : 'label',
					overflowX : 'hidden',
					overflowY : 'hidden',
					width : 200,
					height : 15,
					text : 'Investment Request',
					cls : 'ux_font-size14'
				},
				{
					xtype : 'panel',
					layout : 'hbox',
					items :
					[
						{
							xtype : 'label',
							itemId : 'investmentCountId',
							cls : 'ux_font-size14-normal',
							padding : '5 0 0 0'
						},
						{
							xtype : 'label',
							itemId : 'investmentCommaLbl',
							cls : 'ux_font-size14-normal',
							padding : '5 0 0 0',
							text:','
						},
						{
							xtype : 'label',
							itemId : 'investmentAmtLbl',
							cls : 'ux_font-size14-normal',
							padding : '5 0 0 0',
							text:'Amt'
						},
						{
							xtype : 'label',
							itemId : 'investmentSummaryId',
							cls : 'ux_font-size14-normal'
						}
					]
				}
			]

		} );

		balanceArray.push(
		{
			xtype : 'panel',
			layout : 'vbox',
			flex : 0.8,
			margin : '0 20 0 0',
			items :
			[
				{
					xtype : 'label',
					overflowX : 'hidden',
					overflowY : 'hidden',
					width : 200,
					height : 15,

					text : 'Redemption Request',
					cls : 'ux_font-size14'
				},
				{
					xtype : 'panel',
					layout : 'hbox',
					padding : '5 0 0 0',
					items :
					[
						{
							xtype : 'label',
							itemId : 'redemptionCountId',
							cls : 'ux_font-size14-normal'
						},
						{
							xtype : 'label',
							itemId : 'redemptionCommaLbl',
							cls : 'ux_font-size14-normal',
							text:','
						},
						{
							xtype : 'label',
							itemId : 'redemptionAmtLbl',
							cls : 'ux_font-size14-normal',
							text:'Amt'
						},
						{
							xtype : 'label',
							itemId : 'redemptionSummaryId',
							cls : 'ux_font-size14-normal'
						}
					]
				}
			]

		} );

		return balanceArray;
	}

} );
