Ext.define( 'GCP.view.PoolViewAppCreditInterestGrid',
{
	extend : 'Ext.panel.Panel',
	requires :
	[
		'Ext.ux.gcp.SmartGrid'
	],
	xtype : 'poolViewAppCreditInterestGridType',
	cls : 'xn-ribbon',
	bodyPadding : 0,
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
				title : getLabel( 'lblApportionmentCreditInterest', 'Apportionment Credit Interest' ),
				itemId : 'appCreditViewItemId',
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
