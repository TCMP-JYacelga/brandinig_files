Ext.define( 'GCP.view.BankProcessingQueueGridView',
{
	extend : 'Ext.panel.Panel',
	requires :
	[
		'GCP.view.BankProcessingQueueGroupActionBarView', 'Ext.ux.gcp.SmartGrid'
	],
	xtype : 'bankProcessingQueueGridView',
	cls : 'xn-panel',
	bodyPadding : '2 4 2 2',
	autoHeight : true,
	width : '100%',
	parent : null,
	initComponent : function()
	{
		var me = this;

		var actionBar = Ext.create( 'GCP.view.BankProcessingQueueGroupActionBarView',
		{
			itemId : 'bankProcessingQueueGroupActionBarView_summDtl',
			id : 'bankProcessingQueueGroupActionBarView_summDtl',
			height : 21,
			width : '100%',
			margin : '1 0 0 0',
			parent : me
		} );
		this.items =
		[
			{
				xtype : 'container',
				layout : 'hbox',
				width : '100%',
				items :
				[
					{
						xtype : 'container',
						layout : 'hbox',
						margin : '6 0 3 0',
						flex : 1,
						items :
						[
							{
								xtype : 'label',
								text : '',
								flex : 1
							},
							{
								xtype : 'container',
								layout : 'hbox',
								cls : 'rightfloating',
								items :
								[
									{
										xtype : 'button',
										border : 0,
										itemId : 'btnSearchOnPage',
										text : '',//getLabel( 'searchOnPage', 'Search on Page' ),
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
										itemId : 'searchTxnTextField',
										cls : 'w10',
										hidden: true,
										padding : '0 0 0 5'
									}
								]
							}
						]
					}
				]
			},
			{
				xtype : 'panel',
				collapsible : true,
				width : '100%',
				cls : 'xn-panel',
				title : getLabel( 'lblSummary', 'Summary' ),
				itemId : 'bankProcessingQueueDtlView',
				items :
				[
					{
						xtype : 'container',
						layout : 'hbox',
						items :
						[
							{
								xtype : 'label',
								text : getLabel( 'actions', 'Actions' ) + ':',
								cls : 'font_bold',
								padding : '5 0 0 3'
							}, actionBar,
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
