Ext.define( 'GCP.view.AccrualSettlementSummaryGridView',
{
	extend : 'Ext.panel.Panel',
	requires :
	[
		'Ext.ux.gcp.SmartGrid'
	],
	xtype : 'accrualSettlementSummaryGridViewType',
	cls : 'ft-grid-header',
	parent : null,
	initComponent : function()
	{
		var me = this;

		this.items =
		[
			{
				xtype : 'panel',
				title : queryType == '2' ? getLabel( 'lblAccrualSummaryPeriod', 'Accrual Summary Period' ) + ' From  ' + fromDate
					+ ' To  ' + toDate : getLabel( 'lblSettlementSummaryPeriod', 'Settlement Summary Period' ) + ' From  ' + fromDate
					+ ' To  ' + toDate ,
				itemId : 'accrualPoolViewItemId',
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
