Ext.define( 'GCP.view.PoolViewCreditInterestGrid',
{
	extend : 'Ext.panel.Panel',
	requires :
	[
		'Ext.ux.gcp.SmartGrid'
	],
	xtype : 'poolViewCreditInterestGridType',
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
				title : getLabel( 'lblBankCreditInterest', 'Bank Credit Interest' ),
				itemId : 'bankCreditViewItemId',
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
