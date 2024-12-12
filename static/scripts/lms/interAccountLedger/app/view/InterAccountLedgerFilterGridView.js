Ext.define( 'GCP.view.InterAccountLedgerFilterGridView',
{
	extend : 'Ext.panel.Panel',
	requires :
	[
		'Ext.ux.gcp.SmartGrid'
	],
	xtype : 'interAccountLedgerFilterGridViewType',
	//cls : 'xn-ribbon',
	bodyPadding : '2 4 2 2',
	autoHeight : true,
	parent : null,
	initComponent : function()
	{
		var me = this;
		
		this.items =
		[

			{
				xtype : 'panel',			
				title : getLabel( 'lblAgreementSummaryChange', 'Summary' ),
				itemId : 'ledgerSummaryViewItemId',
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
