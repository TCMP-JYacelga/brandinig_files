Ext.define( 'GCP.view.CBNetComputationSummaryGrid',
{
	extend : 'Ext.panel.Panel',
	requires :
	[
		'Ext.ux.gcp.SmartGrid'
	],
	xtype : 'cpComputationSummaryGridViewType',
	parent : null,
	cls : 'ft-margin-t ft-grid-header',
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
				//minHeight : 'auto',
				items :
				[
				]
			}
		]
		this.callParent( arguments );
	}
} );
