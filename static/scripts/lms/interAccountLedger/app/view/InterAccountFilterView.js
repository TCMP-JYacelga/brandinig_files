Ext.define( 'GCP.view.InterAccountFilterView',
{
	extend : 'Ext.panel.Panel',
	xtype : 'interAccountFilterView',
	requires :
	[
	 	'GCP.view.InterAccountLedgerGroupView'
	],
	width : '100%',
	autoHeight : true,
	initComponent : function()
	{
		var me = this;
		me.items =
		[
			{
				xtype : 'interAccountLedgerGroupView',
				width : 'auto',
				margin : '0 0 12 0'
			}
		];
		me.on( 'resize', function()
		{
			me.doLayout();
		} );
		me.callParent( arguments );
	}
	
} );
