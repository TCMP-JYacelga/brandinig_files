Ext.define( 'GCP.view.DepositInquiryInformation',
{
	extend : 'Ext.panel.Panel',
	xtype : 'depositInquiryInformation',
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
				itemId : 'depositInquiryInfoGridView',
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
							afterrender : function( c )
							{
								me.setPrefView(c);	
							}
						}
					},
					{
						xtype : 'label',
						text : getLabel( 'summinformation', 'Summary Information' ),
						cls : 'x-custom-header-font',
						margin: '0 0 0 20'
							
						//padding : '4 0 0 0'
					}
				]
			}
		];
		this.callParent( arguments );
	},
	setPrefView : function(img) {
		var me = this;
		if (infoPanelCollapsed) {
			img.removeCls("icon_collapse_summ");
			img.addCls("icon_expand_summ");
			//panel.hide();
		} else {
			img.removeCls("icon_expand_summ");
			img.addCls("icon_collapse_summ");
			//panel.show();
		}
	},
	hideShowPanel : function() {
		var me = this;
		var panel = me.down('panel[itemId="infoSummaryLowerPanel"]');
		if (infoPanelCollapsed && !Ext.isEmpty(panel)) 
			panel.hide();
		else if(!Ext.isEmpty(panel))
			panel.show();
	},

	createSummaryLowerPanelView : function()
	{
		var me = this;
		var infoArray = this.createSummaryInfoList();
		var summaryLowerPanel = Ext.create( 'Ext.panel.Panel',
		{
			layout : 'hbox',
			itemId : 'infoSummaryLowerPanel',
			cls : 'ux_border-top xn-pad-10',
			hidden :true,
			items : infoArray
		} );
		me.add( summaryLowerPanel );
		me.hideShowPanel();
	},

	createSummaryInfoList : function()
	{
		var infoArray = new Array();

		
		infoArray.push(
		{
			xtype : 'panel',
			layout : 'vbox',
			//margin : '0 0 0 5',
			flex : 0.8,
			items :
			[
				{
					xtype : 'label',
					cls : 'ux_font-size14',
					overflowX : 'hidden',
					overflowY : 'hidden',
					width : 200,
					height : 15,
					text : getLabel( 'lblDeposits', 'Deposits' )
					//padding : '0 0 5 0'
				},
				{
					xtype : 'panel',
					layout : 'hbox',
				//	padding : '5 0 0 0',
					items :
					[
						{
							xtype : 'label',
							itemId : 'depositSummaryTotalItemId',
							cls : 'ux_font-size14-normal'
							//padding : '0 10 5 0'
						},
						
						{
							xtype : 'label',
							cls : 'ux_font-size14-normal',
							itemId : 'depositSummaryCountItemId',
							padding : '0 0 0 5'
						}
					]
				}
			]
		} );
		infoArray.push(
				{
					xtype : 'panel',
					layout : 'vbox',
					//margin : '0 20 0 0',
					flex : 0.8,
					items :
					[
						{
							xtype : 'label',
							overflowX : 'hidden',
							overflowY : 'hidden',
							width : 200,
							height : 15,
							text : getLabel( 'lblInstruments', 'Items' ),
							cls : 'ux_font-size14 '
							//padding : '0 0 5 0'
						},
						{
							xtype : 'panel',
							layout : 'hbox',
							padding : '5 0 0 0',
							items :
							[
								{
									xtype : 'label',
									itemId : 'instrumentSummaryTotalItemId',
									cls : 'ux_font-size14-normal'
									//padding : '0 10 5 0'
								},
								{
									xtype : 'label',
									cls : 'ux_font-size14-normal',
									itemId : 'instrumentSummaryCountItemId',
									padding : '0 0 0 5'
								}
							]
						}
					]
				} );


		/*infoArray.push(
		{
			xtype : 'panel',
			layout : 'vbox',
			margin : '0 28 0 0',
			//padding : '0 0 0 105',
			flex : 0.8,
			items :
			[
				{
					xtype : 'button',
					cls : 'xn-account-filter-btnmenu xn-big-button',
					arrowAlign : 'right',
					text : '<span class="button_underline thePoniter ux_font-size14-normal">' + getLabel( 'btn.refresh', 'Refresh' ) + '</span>',
					btnId : 'btnGo',
					parent : this,
					handler : function( btn, opts )
					{
						this.parent.fireEvent( 'doRetrieve', btn, opts );
					}
				}
			]
		} );*/

		return infoArray;
	}
} );
