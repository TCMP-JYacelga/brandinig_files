Ext.define( 'GCP.view.CBCreditGrossDetailGridView',
{
	extend : 'Ext.panel.Panel',
	requires :
	[
		'Ext.ux.gcp.SmartGrid'
	],
	xtype : 'cbCreditGrossDetailGridViewType',
	cls : 'ft-grid-header ft-margin-t',
	parent : null,
	initComponent : function()
	{
		var me = this;

		this.items =
		[
			{
				xtype : 'panel',
				title : getLabel( 'lblComputationDetail', 'Computation Detail' ), 
				itemId : 'computationDetailItemId',
				bodyCls: 'gradiant_back  ft-grid-body',
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
