Ext.define( 'GCP.view.PoolViewDebitInterestGrid',
{
	extend : 'Ext.panel.Panel',
	requires :
	[
		'Ext.ux.gcp.SmartGrid'
	],
	xtype : 'poolViewDebitInterestGridType',
	cls : 'xn-ribbon',
	bodyPadding : '0',
	autoHeight : true,
	width : '100%',
	parent : null,
	initComponent : function()
	{
		var me = this;
		
		this.items =
		[

			{
				xtype : 'panel',
				collapsible : false,
				width : '100%',
				cls : 'xn-ribbon',
				bodyCls: 'ft-grid-body',
				title : getLabel( 'lblBankDebitInterest', 'Bank Debit Interest' ),
				itemId : 'bankDebitViewItemId',
				items :
				[
					{
						xtype : 'container',
						layout : 'hbox',
						items :
						[
						]

					}
				]
			}
		]
		this.callParent( arguments );
	}
} );
