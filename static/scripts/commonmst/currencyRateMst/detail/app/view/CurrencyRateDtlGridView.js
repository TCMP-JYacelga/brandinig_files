Ext.define( 'GCP.view.CurrencyRateDtlGridView',
{
	extend : 'Ext.panel.Panel',
	requires :
	[
		'Ext.ux.gcp.SmartGrid', 'Ext.panel.Panel'
	],
	xtype : 'currencyRateDtlGridViewType',
	width : '100%',
	cls : 'xn-ribbon',
	initComponent : function()
	{
		var me = this;

		this.items =
		[
			{
				xtype : 'container',
				layout : 'hbox',
				flex : 1,
				cls : 'ux_panel-background ux_extralargepadding-top',
				items :
				[
					{
						xtype : 'toolbar',
						itemId : 'btnCreateNewToolBar',
						cls : ' ux_panel-background',
						flex : 1,
						margin : '0 0 12 0',
						items : []
					},

					{
						xtype : 'container',
						layout : 'hbox',
						//cls : 'rightfloating',
						cls : 'rightfloating ux_hide-image',
						items :
						[
							{
								xtype : 'button',
								border : 0,
								itemId : 'btnSearchOnPage',
								text : getLabel( 'searchOnPage', 'Search on Page' ),
								cls : 'xn-custom-button cursor_pointer',
								padding : '5 0 0 3',
								menu : Ext.create( 'Ext.menu.Menu',
								{
									itemId : 'menu',
									items :
									[
										{
											xtype : 'radiogroup',
											itemId : 'matchCriteria',
											vertical : true,
											columns : 1,
											items :
											[
												{
													boxLabel : getLabel( 'exactMatch', 'Exact Match' ),
													name : 'searchOnPage',
													inputValue : 'exactMatch'
												},
												{
													boxLabel : getLabel( 'anyMatch', 'Any Match' ),
													name : 'searchOnPage',
													inputValue : 'anyMatch',
													checked : true
												}
											]

										}
									]
								} )
							},
							{
								xtype : 'textfield',
								itemId : 'searchTextField',
								cls : 'w10',
								padding : '0 0 0 5'
							}
						]
					}
				]
			},

			{
				xtype : 'panel',
				width : '100%',
				autoHeight : true,
				itemId : 'currencyRateDtlDetaillViewItemId',
				title : getLabel('fxRateList', 'FX Rates List'),
				collapsible : true,
				items :
				[
					{
						xtype : 'container',
						layout : 'hbox',
						itemId : 'gridHeader',
						items : []
					},
					{
						xtype : 'container',
						//padding : '4 0 0 0',
						cls : 'ux_largepaddinglr ux_border-top ux_panel-transparent-background',
						layout : 'hbox',
						items :
						[
							{
								xtype : 'label',
								text : getLabel( 'actions', 'Actions' ) + ':',
								cls : 'action_label ux-ActionLabel',
								padding : '5 0 0 3'
							},
							{
								xtype : 'label',
								text : '',
								flex : 1
							}
						]
					}
				]
			}
		];

		this.callParent( arguments );
	}

} );
