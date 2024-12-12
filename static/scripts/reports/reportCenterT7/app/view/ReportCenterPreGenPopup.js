Ext.define( 'GCP.view.ReportCenterPreGenPopup',
{
	extend : 'Ext.window.Window',
	requires :
	[
		'Ext.ux.gcp.SmartGrid'
	],
	xtype : 'reportCenterPreGenPopup',
	width : 550,
	autoHeight : true,
	parent : null,
	title : getLabel( 'preGenerated', 'Pre-Generated' ),
	modal : true,
	cls:'t7-popup',
	closeAction : 'hide',
	initComponent : function()
	{
		var me = this;
		this.items =
		[
			{
				xtype : 'panel',
				width : '100%',
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
					text : getLabel( 'btnCancel', 'Cancel' ),
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
