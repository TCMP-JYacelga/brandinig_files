Ext.define( 'GCP.view.CBDebitGrossSummaryGrid',
{
	extend : 'Ext.panel.Panel',
	requires :
	[
		'Ext.ux.gcp.SmartGrid'
	],
	xtype : 'cpComputationSummaryGridViewType',
	cls : 'ft-margin-t ft-grid-header',
	parent : null,
	initComponent : function()
	{
		var me = this;
		
		this.items =
		[

			{
				xtype : 'panel',
				title : getLabel( 'lblComputationSummaryDate', 'Computation Summary Date' ),
				itemId : 'computationSummaryViewItemId',
				bodyCls: 'gradiant_back ft-grid-body',
				autoHeight: true,
				minHeight : 'auto',
				items :
				[
				]
			}
		]
		this.callParent( arguments );
	}
} );
