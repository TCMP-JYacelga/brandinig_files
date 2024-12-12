Ext.define( 'GCP.view.CBGrossPoolInfoGridView',
{
	extend : 'Ext.panel.Panel',
	requires :
	[
		'Ext.ux.gcp.SmartGrid'
	],
	xtype : 'cpComputationPoolGridViewType',
	parent : null,
	cls : ' ft-margin-t ft-grid-header',
	initComponent : function()
	{
		var me = this;
		this.items =
		[
			{
				xtype : 'panel',
				title : getLabel( 'lblComputationSummaryPeriod', 'Computation Summary Period' ) + ' From Date: ' + fromDate + ' TO Date: ' + toDate, 
				itemId : 'computationPoolViewItemId',
				bodyCls: 'gradiant_back ft-grid-body',
				autoHeight: true,
				minHeight : 50,
				items :
				[
				]
			}
		]
		this.callParent( arguments );
	}
} );
