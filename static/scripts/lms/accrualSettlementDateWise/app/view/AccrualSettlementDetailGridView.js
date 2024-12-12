Ext.define( 'GCP.view.AccrualSettlementDetailGridView',
{
	extend : 'Ext.panel.Panel',
	requires :
	[
		'Ext.ux.gcp.SmartGrid'
	],
	xtype : 'accrualSettlementDetailGridViewType',
	cls : 'ft-margin-t ft-grid-header',
	parent : null,
	initComponent : function()
	{
		var me = this;

		this.items =
		[
			{
				xtype : 'panel',
				title : queryType == '2' ? getLabel( 'lblAccrualSummaryPeriod', 'Accrual Detail' ) : getLabel( 'lblSettlementSummaryPeriod', 'Settlement Detail' ), 
				itemId : 'accrualSettlementDetailItemId',
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
