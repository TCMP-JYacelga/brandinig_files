Ext.define( 'GCP.view.CBCreditGrossDateWiseView',
{
	extend : 'Ext.panel.Panel',
	xtype : 'cbCreditGrossDateWiseViewType',
	requires :
	[
		'GCP.view.CBCreditGrossDetailGridView','GCP.view.CBCreditGrossBankInterestGridView',
		'GCP.view.CBCreditGrossApportionmentGridView', 'GCP.view.CBCreditGrossAppliedAccBankIntGridView'
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
				xtype : 'cbCreditGrossDetailGridViewType',
				autoHeight: true,
				minHeight : 50,
				parent : me
			},
			{
				xtype : 'cbCreditGrossBankInterestGridViewType',
				autoHeight: true,
				minHeight : 50,
				margin:'10 0 0 0',
				parent : me,
				hidden : benefitCal == 'Y' ? false : true
			},
			{
				xtype : 'cbCreditGrossAppliedAccBankIntGridViewType',
				autoHeight: true,
				minHeight : 50,
				parent : me,
				margin:'10 0 0 0'
			},
			{
				xtype : 'cbCreditGrossApportionmentGridViewType',
				autoHeight: true,
				minHeight : 50,
				parent : me,
				hidden : apportGridHideFlag == 'Y' ? true : false,
				margin:'10 0 0 0'
			},
			{
				xtype : 'notionalTreeGridViewType',
				hidden : true,
				autoHeight: true,
				minHeight : 50,
				parent : me,
				margin:'10 0 0 0'
			}
		];
		me.on( 'resize', function()
		{
			me.doLayout();
		} );
		me.callParent( arguments );
	}
} );
