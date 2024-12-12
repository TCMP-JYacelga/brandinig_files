Ext.define( 'GCP.view.AccrualSettlementDetailView',
{
	extend : 'Ext.panel.Panel',
	xtype : 'accrualSettlementDetailViewType',
	requires :
	[
	 	'GCP.view.AccrualSettlementDetailGridView','GCP.view.AccrualSettlementDtWiseBreakGridView'
	],
	//width : '100%',
	autoHeight : true,
	minHeight : 400,
	initComponent : function()
	{
		var me = this;
		me.items =
		[
			{
				xtype : 'accrualSettlementDetailGridViewType',
				autoHeight: true,
				minHeight : 50,
				parent : me
			}, 
			{
				xtype : 'accrualSettlementDtWiseBreakGridViewType',
				autoHeight: true,
				minHeight : 50,
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
