Ext.define( 'GCP.view.CBGrossSummaryView',
{
	extend : 'Ext.panel.Panel',
	xtype : 'cpComputationSummaryViewType',
	requires :
	[
	 	'GCP.view.CBGrossPoolInfoGridView','GCP.view.CBGrossSummaryGrid'
	],
	minHeight : 100,
	autoHeight: true,
	initComponent : function()
	{
		var me = this;
		me.items =
		[

		 	{
				xtype : 'cpComputationPoolGridViewType',
				//autoHeight: true,
				//minHeight : 50,
				//cls : 'ft-grid-header',
				//margin: '10 0 0 0',
				parent : me
			},
		 	{
				xtype : 'cpComputationSummaryGridViewType',
				//autoHeight: true,
				//minHeight : 50,
				//cls : 'ft-grid-header',
				//margin: '10 0 0 0',
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
