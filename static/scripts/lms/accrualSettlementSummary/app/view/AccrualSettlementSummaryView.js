Ext.define( 'GCP.view.AccrualSettlementSummaryView',
{
	extend : 'Ext.panel.Panel',
	xtype : 'accrualSettlementSummaryViewType',
	requires :
	[
		'GCP.view.AccrualSettlementSummaryGridView'
	],
	//width : '100%',
	autoHeight : true,
	//minHeight : 400,
	initComponent : function()
	{
		var me = this;
		me.items =
		[
			{
				xtype : 'accrualSettlementSummaryGridViewType',
				cls :'ft-margin-t ft-grid-header',
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
