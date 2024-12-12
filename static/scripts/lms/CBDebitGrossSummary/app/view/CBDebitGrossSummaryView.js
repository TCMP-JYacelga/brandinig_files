Ext.define( 'GCP.view.CBDebitGrossSummaryView',
{
	extend : 'Ext.panel.Panel',
	xtype : 'cpComputationSummaryViewType',
	requires :
	[
	 	'GCP.view.CBDebitGrossPoolInfoGridView','GCP.view.CBDebitGrossSummaryGrid'
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
				//autoHeight: true,
				//minHeight : 50,
				parent : me
			},
		 	{
				xtype : 'cpComputationSummaryGridViewType',
				//autoHeight: true,
				//minHeight : 50,
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
