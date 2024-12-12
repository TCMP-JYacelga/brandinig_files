Ext.define( 'GCP.view.LoanCenterGridInformationView',
{
	extend : 'Ext.panel.Panel',
	xtype : 'loanCenterGridInformationViewType',
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
		var me = this;
		this.items =
		[
			{
				xtype : 'panel',
				itemId : 'loanCenterSummInfoHeaderBarGridViewItemId',
				//bodyCls : 'xn-ribbon-header',
				bodyCls : 'xn-ribbon ux_panel-transparent-background ux_header-pad',
				hidden : isSiTabSelected == 'Y' ? true : false,
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
						margin : '3 0 0 0',
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
						itemId : 'summDateLabel',
						text : getLabel( 'summinformation', 'Summary' ),
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
			cls : 'ux_border-top xn-pad-10',
			itemId : 'infoSummaryLowerPanel',
			hidden : true,
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
			flex : 0.8,
			layout :
			{
				type : 'vbox'
			},
			//margin : '0 80 0 0',
			items :
			[
				{
					xtype : 'label',
					overflowX : 'hidden',
					overflowY : 'hidden',
					text : getLabel( 'lblTotalPaydownOutstanding', 'Total Paydown Requests' ),
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
							itemId : 'loanPaydownAmntItemId',
							cls : 'ux_font-size14-normal'
						},
						{
							xtype : 'label',
							cls : 'ux_font-size14-normal',
							padding : '0 0 0 5',
							text : '  (#'
						},
						{
							xtype : 'label',
							itemId : 'loanPaydownCountItemId',
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

	/*	balanceArray.push(
				{
					xtype : 'panel',
					flex : 0.6,
					layout :
					{
						type : 'vbox'
					},
					items : []
				} );*/
		balanceArray.push(
				{
					xtype : 'panel',
					flex : 0.8,
					cls : 'ux_extralargemargin-left',
					layout :
					{
						type : 'vbox'
					},
					//margin : '0 80 0 0',
					items :
					[
						{
							xtype : 'label',
							overflowX : 'hidden',
							overflowY : 'hidden',
							text : getLabel( 'lblTotalAdvanceOutstanding', 'Total Advance Requests' ),
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
									itemId : 'loanAdvanceAmntItemId',
									cls : 'ux_font-size14-normal'
								},
								{
									xtype : 'label',
									cls : 'ux_font-size14-normal',
									padding : '0 0 0 5',
									text : '  (#'
								},
								{
									xtype : 'label',
									itemId : 'loanAdvanceCountItemId',
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

	/*	balanceArray.push(
		{
			xtype : 'panel',
			flex : 0.5,
			layout :
			{
				type : 'vbox'
			},
			items : []
		} );
*/
		balanceArray.push(
		{
			xtype : 'panel',
			flex : 0.9,
			layout :
			{
				type : 'vbox'
			},
			//margin : '0 80 0 0',
			items :
			[
				{
					xtype : 'label',
					overflowX : 'hidden',
					overflowY : 'hidden',
					width : 200,
					text : getLabel( 'lblTotalInvoicesOutstanding', 'Total Pay Invoice Requests' ),
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
							itemId : 'loanInvoicesAmntItemId',
							cls : 'ux_font-size14-normal'
						},
						{
							xtype : 'label',
							cls : 'ux_font-size14-normal',
							padding : '0 0 0 5',
							text : '  (#'
						},
						{
							xtype : 'label',
							itemId : 'loanInvoicesCountItemId',
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
		return balanceArray;
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
