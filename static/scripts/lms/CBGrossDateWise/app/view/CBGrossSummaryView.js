Ext.define( 'GCP.view.CBGrossSummaryView',
{
	extend : 'Ext.panel.Panel',
	xtype : 'cpComputationSummaryViewType',
	requires :
	[
	 	'GCP.view.CBGrossSummaryGrid','GCP.view.BankInterestSummaryGridView'
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
				xtype : 'cpComputationSummaryGridViewType',
			//	autoHeight: true,
			//	minHeight : 50,
				parent : me
			},
			{
				xtype : 'bankInterestSummaryGridViewType',
			//	autoHeight: true,
			//	minHeight : 50,
				parent : me,
				hidden : benefitCal == 'Y' ? false : true
			},
			{
				xtype : 'apportionmentSummaryGridViewType',
			//	autoHeight: true,
			//	minHeight : 50,
				parent : me,
				hidden : apportGridHideFlag == 'Y' ? true : false
			},
			{
				xtype : 'notionalTreeGridViewType',
			//	autoHeight: true,
			//	minHeight : 50,
				hidden : true,
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
