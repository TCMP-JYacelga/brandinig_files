Ext.define( 'GCP.view.NotionalQryBVFilterView',
{
	extend : 'Ext.panel.Panel',
	xtype : 'notionalQryBVFilterViewType',
	requires :
	[
	 	'GCP.view.NotionalQryBVFilterGridView'
	],
	autoHeight : true,
	//minHeight : 200,
	initComponent : function()
	{
		var me = this;
		me.items =
		[

		 	{
				xtype : 'notionalQryBVFilterGridViewType',
				autoHeight : true,
				minHeight : 10,
				parent : me
			}
		];
		me.on( 'resize', function()
		{
			me.doLayout();
		} );
		me.callParent( arguments );
	}
} );
