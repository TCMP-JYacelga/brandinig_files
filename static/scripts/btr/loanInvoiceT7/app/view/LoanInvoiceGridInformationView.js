Ext.define( 'GCP.view.LoanInvoiceGridInformationView',
{
	extend : 'Ext.panel.Panel',
	xtype : 'loanInvoiceNewGridInformationViewType',
	requires :
	[
		'Ext.panel.Panel', 'Ext.Img', 'Ext.form.Label', 'Ext.button.Button'
	],
	width : '100%',
	padding : '12 0 12 0',
	componentCls : 'gradiant_back',
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
				itemId : 'loanInvoiceNewSummInfoHeaderBarGridViewItemId',
				//cls : 'xn-ribbon ux_border-bottom',
				bodyCls : 'xn-ribbon ux_panel-transparent-background ux_header-pad',
				//padding : '9 5 7 10',
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
	setPrefView : function(img) {
		var me = this;
		var panel = me.down('panel[itemId="infoSummaryLowerPanel"]');

		if (infoRibbonCollapsed) {
			img.removeCls("icon_collapse_summ");
			img.addCls("icon_expand_summ");
			panel.hide();
		} else {
			img.removeCls("icon_expand_summ");
			img.addCls("icon_collapse_summ");
			panel.show();
		}
	},

	createSummaryLowerPanelView : function()
	{
		var me = this;
		var balanceArray = this.createTypeCodesList();
		var summaryLowerPanel = Ext.create( 'Ext.panel.Panel',
		{
			cls : 'ux_largepadding ux_border-top',
			layout : 'hbox',
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
			layout : 'vbox',
			//margin : '0 80 0 0',
			flex : 0.8,
			items :
			[
				{
					xtype : 'label',
					overflowX : 'hidden',
					overflowY : 'hidden',
					width : 200,
					text : 'Invoices Outstanding',
					cls : 'ux_font-size14',
					padding : '0 0 6 0'
				},
				{
					xtype : 'panel',
					layout : 'hbox',
					margin : '0 80 0 0',
					items :
					[
						{
							xtype : 'label',
							cls : 'ux_font-size14-normal',
							itemId : 'outstandingSummaryId'
						},
						{
							xtype : 'label',
							cls : 'ux_font-size14-normal',
							padding : '0 0 0 5',
							text : ' (#'
						},
						{
							xtype : 'label',
							cls : 'ux_font-size14-normal',
							itemId : 'outstandingCountId'
							//padding : '0 10 5 0'
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
		balanceArray.push(
		{
			xtype : 'panel',
			layout : 'vbox',
			flex : 0.8,
			items :
			[
				{
					xtype : 'label',
					overflowX : 'hidden',
					overflowY : 'hidden',
					width : 200,
					text : 'Overdue Invoices',
					cls : 'ux_font-size14',
					padding : '0 0 6 0'
				},
				{
					xtype : 'panel',
					layout : 'hbox',
					margin : '0 80 0 0',
					items :
					[
						{
							xtype : 'label',
							cls : 'ux_font-size14-normal',
							itemId : 'overdueSummaryId'
						},
						{
							xtype : 'label',
							cls : 'ux_font-size14-normal',
							padding : '0 0 0 5',
							text : ' (#'
						},
						{
							xtype : 'label',
							cls : 'ux_font-size14-normal',
							itemId : 'overdueCountId'
							//padding : '0 10 5 0'
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
		balanceArray.push(
		{
			xtype : 'panel',
			layout : 'vbox',
			cls : 'ux_normalmargin-left',
			flex : 0.9,
			items :
			[
				{
					xtype : 'label',
					overflowX : 'hidden',
					overflowY : 'hidden',
					width : 200,
					cls : 'ux_font-size14 ',
					text : 'Payment Awaiting Approval',
					padding : '0 0 6 0'
				},
				{
					xtype : 'panel',
					layout : 'hbox',
					items :
					[
						{
							xtype : 'label',
							cls : 'ux_font-size14-normal',
							itemId : 'pendingSummaryId'
						},
						{
							xtype : 'label',
							cls : 'ux_font-size14-normal',
							padding : '0 0 0 5',
							text : ' (#'
						},
						{
							xtype : 'label',
							cls : 'ux_font-size14-normal',
							itemId : 'pendingCountId'
							//padding : '0 10 5 0'
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
	}
} );
