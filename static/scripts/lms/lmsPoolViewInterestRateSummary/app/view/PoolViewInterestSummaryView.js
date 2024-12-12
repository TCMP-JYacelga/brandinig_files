Ext.define( 'GCP.view.PoolViewInterestSummaryView',
{
	extend : 'Ext.panel.Panel',
	xtype : 'poolViewInterestSummaryViewType',
	requires :
	[
	 	'GCP.view.PoolViewAppCreditInterestGrid','GCP.view.PoolViewAppDebitInterestGrid',
	 	'GCP.view.PoolViewCreditInterestGrid','GCP.view.PoolViewDebitInterestGrid'
	],
	width : '100%',
	autoHeight : true,
	minHeight : 400,
	border: 0,
	initComponent : function()
	{
		var me = this;
		me.items =
		[
			{
				xtype : 'poolViewCreditInterestGridType',
				hidden : (creditBankProfile == null || creditBankProfile == '') ? true : false,
				width : '100%',
				cls : 'ft-grid-header',
				margin : '0 0 10 0',
				parent : me
			 },
			 {
				xtype : 'poolViewDebitInterestGridType',
				hidden : (debitBankProfile == null || debitBankProfile == '') ? true : false,
				width : '100%',
				cls : 'ft-grid-header',
				margin : '0 0 10 0',
				parent : me
			 },
		 	 {
				xtype : 'poolViewAppCreditInterestGridType',
				hidden : (creditApportionmentProfile == null || creditApportionmentProfile == '') ? true : false,
				width : '100%',
				cls : 'ft-grid-header',
				margin : '0 0 10 0',
				parent : me
			 },
			 {
				xtype : 'poolViewAppDebitInterestGridType',
				hidden : (debitApportionmentProfile == null || debitApportionmentProfile == '') ? true : false,
				width : '100%',
				cls : 'ft-grid-header',
				margin : '0 0 10 0',
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
