Ext.define( 'GCP.view.NotionalQryBVFilterGridView',
{
	extend : 'Ext.panel.Panel',
	requires :
	[
		'Ext.ux.gcp.SmartGrid'
	],
	xtype : 'notionalQryBVFilterGridViewType',
	//cls : 'ft-grid-header',
	parent : null,
	initComponent : function()
	{
		var me = this;
		
		this.items =
		[

			{
				xtype : 'panel',
				title : getLabel( 'lblAgreementSummaryChange', 'Agreement Summary Changes' ),
				itemId : 'agreementChangeSummaryViewItemId',
				cls : 'ft-grid-header ft-margin-t',
				bodyCls: 'ft-grid-body',
				hidden : (modeValue != 'readView'),
				autoHeight: true,
				minHeight : 10,
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
