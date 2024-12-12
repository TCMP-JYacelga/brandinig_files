Ext.define( 'GCP.view.CurrencyRateMstView',
{
	extend : 'Ext.container.Container',
	xtype : 'currencyRateMstViewType',
	requires :
	[
		'Ext.container.Container', 'GCP.view.CurrencyRateMstTitleView', 'GCP.view.CurrencyRateMstFilterView', ,
		'Ext.ux.gcp.GroupView'
	],
	width : '100%',
	autoHeight : true,
	//minHeight : 600,
	initComponent : function()
	{
		var me = this;
//		var groupView = me.handleSmartGridConfig();
		me.items =
		[
			{
				xtype : 'currencyRateMstTitleViewType',
				width : '100%',
				padding : '10 0 10 0',
				cls : 'ux_no-border'
			},
			{
				xtype : 'currencyRateMstFilterViewType',
				width : '100%',
				margin : '12 0 0 0',
				title : getLabel( 'filterBy', 'Filter By: ' ) + 
						'<img id="imgFilterInfo" class="largepadding icon-information">' + '</span>'
			},
			{
				xtype : 'container',
				layout :
				{
					type : 'hbox'
				},
				hidden : canEdit == true ? false : true,
				width : '100%',
				cls : 'ux_extralargepaddingtb',
				//margin : '6 0 3 0',
				items :
				[
					{
						xtype : 'container',
						flex : 1,
						layout :
						{
							type : 'hbox',
							pack : 'start'
						},
						items :
						[
							{
								xtype : 'button',
								text : getLabel( "lbl.create.currencyRates", "Create FX Rates" ),
								cls : 'ux_font-size14 xn-content-btn ux-button-s ',
								glyph : 'xf055@fontawesome',
								parent : this,
								itemId : 'btnCreateCurrencyRatesItemId'
							}
						]
					}
				]
			},  {
				xtype : 'currencyRateMstGridViewType',
				width : '100%'
			}
		];

		me.on( 'resize', function()
		{
			me.doLayout();
		} );
		me.callParent( arguments );
	}
} );
