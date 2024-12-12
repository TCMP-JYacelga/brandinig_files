Ext.define( 'GCP.view.CBNetComputationSummaryView',
{
	extend : 'Ext.panel.Panel',
	xtype : 'cpComputationSummaryViewType',
	requires :
	[
	 	'GCP.view.CBNetComputationPoolInfoGridView','GCP.view.CBNetComputationSummaryGrid'
	],
	autoHeight : true,
	minHeight : 400,
	initComponent : function()
	{
		var me = this;
		me.items =
		[

		 	{
				xtype : 'cpComputationPoolGridViewType',
				//cls : 'ft-grid-header',
				//bodyCls: 'ft-grid-body',
				//margin: '10 0 0 0',
				//autoHeight: true,
				//minHeight : 50,
				parent : me
			},
		 	{
				xtype : 'cpComputationSummaryGridViewType',
				//cls : 'ft-grid-header',
				//bodyCls: 'ft-grid-body',
				//margin: '10 0 0 0',
				//autoHeight: true,
				//minHeight : 50,
				//padding:'20 0 0 0',
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
