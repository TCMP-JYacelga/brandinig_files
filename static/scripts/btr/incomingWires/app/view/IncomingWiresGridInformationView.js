Ext.define( 'GCP.view.IncomingWiresGridInformationView',
{
	extend : 'Ext.panel.Panel',
	xtype : 'incomingWiresGridInformationView',
	requires :
	[
		'Ext.panel.Panel', 'Ext.Img', 'Ext.form.Label', 'Ext.button.Button'
	],
	width : '100%',
	data : null,
	componentCls : 'xn-ribbon-body ux_panel-transparent-background',
	layout :
	{
		type : 'vbox',
		align : 'stretch'
	},
	initComponent : function()
	{
		var me = this;
		this.items =
		[
			{
				xtype : 'panel',
				itemId : 'incomingWiresSummInfoHeaderBarGridView',
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
						cls : 'cursor_pointer middleAlign icon_expand_summ',
						margin : '3 0',
						listeners :
						{
							render : function( c )
							{
								c.getEl().on( 'click', function()
								{
									this.fireEvent( 'click', c );
								}, c );
							},
							afterrender : function(c){
									me.setPrefView(c);		
							}
						}
					},
					{
						xtype : 'label',
						text : getLabel( 'summinformation', 'Summary' ),
						cls : 'x-custom-header-font',
						margin: '0 0 0 20',
						padding : '0 0 0 0'
					}
				]
			}
		];
		this.callParent( arguments );
	},

	createSummaryLowerPanelView : function( jsonData )
	{
		var me = this;
		var infoArray = this.createSummaryInfoList( jsonData );
		var summaryLowerPanel = Ext.create( 'Ext.panel.Panel',
		{
			cls : 'ux_border-top xn-pad-10',
			layout : 'hbox',
			itemId : 'infoSummaryLowerPanel',
			items : infoArray,
			hidden : true
		} );
		me.add( summaryLowerPanel );
	},
	createSummaryInfoList : function( jsonData )
	{
		var infoArray = new Array();
		infoArray.push(
		{
			xtype : 'panel',
			layout : 'vbox',
			flex : 0.37,
			margin : '0 30 0 0',
			items :
			[
				{
					xtype : 'label',
					overflowX : 'hidden',
					overflowY : 'hidden',
					width : 200,
					text : getLabel( 'lbl.incomingDrawdown', 'Incoming Drawdown' ),
					cls : 'ux_font-size14'
				},
				{
					xtype : 'panel',
					layout : 'hbox',
					padding : '6 0 0 0',
					items :
					[
						{
							xtype : 'label',
							cls : 'ux_font-size14-normal',
							itemId : 'drSumId'
						},
						{
							xtype : 'label',
							padding : '0 0 0 5',
							text : ' (',
							cls : 'ux_font-size14-normal'
						},
						{
							xtype : 'label',
							itemId : 'drCountId',
							cls : 'ux_font-size14-normal'
						},
						{
							xtype : 'label',
							text : ')',
							cls : 'ux_font-size14-normal'
						}
					]
				}
			]

		} );
		infoArray.push(
		{
			xtype : 'panel',
			layout : 'vbox',
			flex : 0.8,
			margin : '0 50 0 0',
			items :
			[
				{
					xtype : 'label',
					overflowX : 'hidden',
					overflowY : 'hidden',
					width : 200,
					text : getLabel( 'lbl.incomingWire', 'Incoming Wire' ),
					cls : 'ux_font-size14'
				},
				{
					xtype : 'panel',
					layout : 'hbox',
					padding : '6 0 0 0',
					items :
					[
						{
							xtype : 'label',
							cls : 'ux_font-size14-normal',
							itemId : 'crSumId'
						},
						{
							xtype : 'label',
							cls : 'ux_font-size14-normal',
							padding : '0 0 0 5',
							text : ' ('
						},
						{
							xtype : 'label',
							itemId : 'crCountId',
							cls : 'ux_font-size14-normal'
						},
						{
							xtype : 'label',
							cls : 'ux_font-size14-normal',
							text : ')'
						}
					]
				}
			]

		} );
		return infoArray;
	},
	setPrefView : function(img) {
		var me = this;
		var infoPanel = me.down('panel[itemId="infoSummaryLowerPanel"]');
	
		if (infoPanelCollapsed) {
			img.removeCls("icon_collapse_summ");
			img.addCls("icon_expand_summ");
			if(!Ext.isEmpty(infoPanel))	
				infoPanel.hide();
		} else {
			img.removeCls("icon_expand_summ");
			img.addCls("icon_collapse_summ");
			if(!Ext.isEmpty(infoPanel))
				infoPanel.show();
		}
	}

} );
