Ext.define( 'GCP.view.AccrualSettlementDtWiseBreakGridView',
{
	extend : 'Ext.panel.Panel',
	requires :
	[
		'Ext.ux.gcp.SmartGrid'
	],
	xtype : 'accrualSettlementDtWiseBreakGridViewType',
	cls : 'ft-margin-t ft-grid-header',
	parent : null,
	initComponent : function()
	{
		var me = this;

		this.items =
		[
			{
				xtype : 'panel',
				title : getLabel( 'lblDatewiseBreakup', 'Datewise Breakup' ), 
				itemId : 'dateWiseBreakupItemId',
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
