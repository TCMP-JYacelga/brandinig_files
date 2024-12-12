Ext.define( 'GCP.view.BankSchedulePreGenPopup',
{
	extend : 'Ext.window.Window',
	requires :
	[
		'Ext.ux.gcp.SmartGrid'
	],
	xtype : 'bankSchedulePreGenPopup',
	width : 550,
	autoHeight : true,
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
				cls : 'xn-ribbon',
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
		this.buttons =
			[	{
					xtype : 'button',
					cls : 'ux_button-background-color ux_button-padding',
					glyph : 'xf056@fontawesome',
					text : '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;'+getLabel( 'btnCancel', 'Cancel' ),
					itemId : 'cancelBtn',
					handler : function( btn )
					{
						me.close();
					}
				}
			];
		this.callParent( arguments );
	}
} );
