Ext.define( 'GCP.view.CurrencyRateMstGridView',
{
	extend : 'Ext.panel.Panel',
	requires :
	[
		'Ext.ux.gcp.SmartGrid', 'GCP.view.CurrencyRateMstGroupActionBarView', 'Ext.panel.Panel'
	],
	xtype : 'currencyRateMstGridViewType',
	width : '100%',
	cls : 'xn-ribbon',
	initComponent : function()
	{
		var me = this;
		
		var actionBar = Ext.create( 'GCP.view.CurrencyRateMstGroupActionBarView',
		{
			itemId : 'currencyRateMstGroupActionBarView_clientDtl',
			height : 21,
			width : '100%',
			cls : 'xn-ribbon ux_header-width ux_panel-transparent-background',
			padding : '4 0 0 0',
			parent : me
		} );
		
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
				itemId : 'currencyRateMstDtlViewItemId',
				title : getLabel('fxRateList', 'FX Rates List'),
				collapsible : true,
				cls : 'xn-ribbon ux_panel-transparent-background',
				items :
				[{
					xtype : 'container',
					cls: 'ux_largepaddinglr ux_no-padding ux_no-margin x-portlet ux_border-top ux_panel-transparent-background',
					layout : 'hbox',
					items :
					[{
						xtype : 'label',
						text : getLabel( 'actions', 'Actions' ) + ':',
						cls : 'action_label ux-ActionLabel',
						padding : '5 0 0 3'
					}, actionBar,{
						xtype : 'label',
						text : '',
						flex : 1
					}]
				}]
			}];
			this.callParent( arguments );
	}

} );
