Ext.define( 'GCP.view.ComputationDateWiseView',
{
	extend : 'Ext.panel.Panel',
	xtype : 'computationDateWiseViewType',
	requires :
	[
		'GCP.view.ApportionmentSummaryGridView', 'GCP.view.BankInterestSummaryGridView', 'GCP.view.ComputationDetailSummaryGridView'
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
				xtype : 'computationDetailSummaryGridViewType',
				autoHeight: true,
				minHeight : 50,
				//cls : 'ft-margin-t',
				parent : me
			},
			{
				xtype : 'bankInterestSummaryGridViewType',
				autoHeight: true,
				minHeight : 50,
			//	padding:'20 0 0 0',
				parent : me,
				hidden : benefitCal == 'Y' ? false : true
			},
			{
				xtype : 'apportionmentSummaryGridViewType',
				autoHeight: true,
				minHeight : 50,
				parent : me,
				hidden : apportGridHideFlag == 'Y' ? true : false
			},
			{
				xtype : 'notionalTreeGridViewType',
				autoHeight: true,
				minHeight : 50,
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
