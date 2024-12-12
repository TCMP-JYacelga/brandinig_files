Ext.define( 'GCP.view.InterAccountPositionView',
{
	extend : 'Ext.panel.Panel',
	xtype : 'interAccountPositionView',
	requires :
	[
	 	'GCP.view.InterAccountPositionGroupView'
	],
	width : '100%',
	autoHeight : true,
	initComponent : function()
	{
		var me = this;
		me.items =
		[
			{
				xtype : 'interAccountPositionGroupView',
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
