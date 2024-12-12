Ext.define( 'GCP.view.PassThruFileACHBatchDetailGridView',
{
	extend : 'Ext.panel.Panel',
	requires :
	[
		'Ext.ux.gcp.SmartGrid'
	],
	xtype : 'passThruFileACHBatchDetailGridType',
	autoHeight : true,
	width : '100%',
	parent : null,
	initComponent : function()
	{
		var me = this;
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
						cls : 'ux_hide-image',
						//margin : '6 0 3 0',
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
										text : getLabel( 'searchOnPage', 'Search on Page' ),
										cls : 'xn-custom-button cursor_pointer',
										padding : '0 0 0 3',
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
															boxLabel : getLabel( 'exactMatch',
																'Exact Match' ),
															name : 'searchOnPage',
															inputValue : 'exactMatch'
														},
														{
															boxLabel : getLabel( 'anyMatch',
																'Any Match' ),
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
				cls : 'xn-ribbon ux_border-bottom',
				title : getLabel( 'batchDetails', 'Batch Details' ),
				itemId : 'passThruFileACHBatchDtlViewItemId'
			}
		];
		this.callParent( arguments );
	}
} );
