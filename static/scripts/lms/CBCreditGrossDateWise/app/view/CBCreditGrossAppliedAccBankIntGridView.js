Ext.define( 'GCP.view.CBCreditGrossAppliedAccBankIntGridView',
{
	extend : 'Ext.panel.Panel',
	requires :
	[
		'Ext.ux.gcp.SmartGrid'
	],
	xtype : 'cbCreditGrossAppliedAccBankIntGridViewType',
	cls : 'ft-margin-t ft-grid-header',
	parent : null,
	initComponent : function()
	{
		var me = this;

		this.items =
		[
			{
				xtype : 'panel',
				title : getLabel( 'lblAppliedAccountLevelBankInterest', 'Applied Account Level Bank Interest' ), 
				itemId : 'appliedAccountLevelBankInterestItemId',
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
