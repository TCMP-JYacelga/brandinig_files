Ext.define( 'GCP.view.InstrumentInquiryInformation',
{
	extend : 'Ext.panel.Panel',
	xtype : 'instrumentInquiryInformation',
	padding : '12 0 0 0',
	requires :
	[
		'Ext.panel.Panel', 'Ext.Img', 'Ext.form.Label', 'Ext.button.Button', 'Ext.ux.gcp.AutoCompleter'
	],
	width : '100%',
	data : null,
	componentCls : 'gradiant_back',
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
				itemId : 'instrumentInquiryInfoGridView',
				cls : 'xn-ribbon ux_border-bottom',
				padding : '7 5 5 11',
				width : '100%',
				layout :
				{
					type : 'hbox'
				},
				items :
				[
					{
						xtype : 'image',
						itemId : 'summInfoShowHideGridView',
						margin : '5 0 0 0',
						cls : 'cursor_pointer middleAlign icon_expand_summ',
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
						text : getLabel( 'summinformation', 'Summary Information' ),
						cls : 'x-custom-header-font',
						margin : '5 0 0 0'
					},
					{
						xtype : 'AutoCompleter',
						matchFieldWidth : true,
						cls : 'autoCmplete-field ux_hide-image',
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
						],
						padding : '4 0 0 0',
						margin : '0 0 0 10'
					} 
				]
			}
		];
		this.callParent( arguments );
	},

	createSummaryLowerPanelView : function()
	{
		var me = this;
		var infoArray = this.createSummaryInfoList();
		var summaryLowerPanel = Ext.create( 'Ext.panel.Panel',
		{
			cls : 'ux_largepadding',
			layout : 'hbox',
			itemId : 'infoSummaryLowerPanel',
			items : infoArray,
			hidden : true
		} );
		me.add( summaryLowerPanel );
	},

	createSummaryInfoList : function()
	{
		var infoArray = new Array();

		infoArray.push(
		{
			xtype : 'panel',
			layout : 'vbox',
			//margin : '0 12 0 0',
			flex : 0.8,
			items :
			[
				{
					xtype : 'label',
					overflowX : 'hidden',
					overflowY : 'hidden',
					width : 250,
					//text : 'Total Checks',
					text : ' Deposit Amount',
					cls : 'ux_font-size14',
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
							itemId : 'totalChecksTotalItemId'
							//padding : '0 10 0 0'
						}
//						{
//							xtype : 'label',
//							cls : 'ux_font-size14-normal',
//							itemId : 'totalChecksCountItemId',
//							padding : '0 10 0 5'
//						}
					]
				}
			]
		} );

		infoArray.push(
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
				//	text : 'Paid Checks',
					text : 'Item Count',
					cls : 'ux_font-size14',
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
					 			itemId : 'totalChecksCountItemId'
					 	}
//						{
//							xtype : 'label',
//							itemId : 'paidChecksTotalItemId',
//							cls : 'ux_font-size14-normal',
//							//padding : '0 10 0 0'
//						},
//						{
//							xtype : 'label',
//							cls : 'ux_font-size14-normal',
//							itemId : 'paidChecksCountItemId',
//							padding : '0 10 0 5'
//						}
					]
				}
			]
		} );

		
			infoArray.push(
				{
					xtype : 'panel',
					layout : 'vbox',
				//	margin : '0 0 0 35',
					flex : 0.8
					
				}
				);
//		infoArray.push(
//		{
//			xtype : 'panel',
//			layout : 'vbox',
//			margin : '0 130 0 0',
//			flex : 0.5,
//			items :
//			[
//				{
//					xtype : 'label',
//					overflowX : 'hidden',
//					overflowY : 'hidden',
//					width : 200,
//					text : getLabel( 'lbl.unpaid.checks', 'Unpaid Checks' ),
//					cls : 'ux_font-size14',
//					padding : '0 0 6 48'
//				},
//				{
//					xtype : 'panel',
//					layout : 'hbox',
//					padding : '0 0 0 54',
//					items :
//					[
//						{
//							xtype : 'label',
//							itemId : 'unPaidChecksTotalItemId',
//							cls : 'ux_font-size14-normal',
//							//padding : '0 10 0 0'
//						},
//						{
//							xtype : 'label',
//							cls : 'ux_font-size14-normal',
//							itemId : 'unPaidChecksCountItemId',
//							padding : '0 10 0 5'
//						}
//					]
//				}
//			]
//		} );

		return infoArray;
	}
} );
