Ext.define( 'GCP.view.BankSchedulePreGenPopup',
{
	extend : 'Ext.window.Window',
	requires :
	[
		'Ext.ux.gcp.SmartGrid'
	],
	xtype : 'bankSchedulePreGenPopup',
	width : 600,
	height : 280,
	parent : null,
	title : getLabel( 'preGenerated', 'Pre-Generated' ),
	modal : true,
	closeAction : 'hide',
	initComponent : function()
	{
		var me = this;
		this.items =
		[
			{
				xtype : 'panel',
				width : '100%',
				cls : 'xn-panel',
				itemId : 'preGeneratedId',
				items :
				[
					{
						xtype : 'container',
						layout : 'hbox',
						items :
						[
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
		this.dockedItems =
			[
				{
					xtype : 'toolbar',
					padding : '10 0 0 0',
					dock : 'bottom',
					items :
					[
						{
							xtype : 'button',
							cls : 'xn-button',
							text : getLabel( 'btnCancel', 'Cancel' ),
							itemId : 'cancelBtn',
							handler : function( btn )
							{
								me.fireEvent( 'closeBankSchedulePreGenPopup', btn );
							}
						}
					]
				}
			];
		this.callParent( arguments );
	}
} );
