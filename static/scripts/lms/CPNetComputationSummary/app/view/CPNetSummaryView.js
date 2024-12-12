Ext.define( 'GCP.view.CPNetSummaryView',
{
	extend : 'Ext.panel.Panel',
	xtype : 'cpNetSummaryViewType',
	requires :
	[
	 	'GCP.view.CPNetPoolGridView', 'GCP.view.CPNetSummaryGridView'
	],
	autoHeight: true,
	minHeight : 400,
	initComponent : function()
	{
		var me = this;
		me.items =
		[

		 	{
				xtype : 'cpNetPoolGridViewType',
			//	autoHeight: true,
			//	minHeight : 50,
				parent : me
			},
			{
				xtype : 'cpNetSummaryGridViewType',
			//	autoHeight: true,
			//	minHeight : 50,
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
