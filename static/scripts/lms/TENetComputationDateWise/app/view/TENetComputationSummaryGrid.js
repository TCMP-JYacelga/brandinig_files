Ext.define( 'GCP.view.TENetComputationSummaryGrid',
{
	extend : 'Ext.panel.Panel',
	requires :
	[
		'Ext.ux.gcp.SmartGrid'
	],
	xtype : 'cpComputationSummaryGridViewType',
	cls : 'ft-grid-header ft-margin-t',
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
				minHeight : 50,
				items :
				[
				]
			}
		]
		this.callParent( arguments );
	}
} );
