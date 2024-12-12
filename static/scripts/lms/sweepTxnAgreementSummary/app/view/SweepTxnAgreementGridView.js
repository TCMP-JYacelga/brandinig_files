Ext.define( 'GCP.view.SweepTxnAgreementGridView',
{
	extend : 'Ext.panel.Panel',
	requires :
	[
	 	'GCP.view.SweepTxnAgreementGroupActionView', 'Ext.ux.gcp.SmartGrid','Ext.util.Point', 'Ext.panel.Panel'
	],
	xtype : 'sweepTxnAgreementGridViewType',
	//cls : 'xn-panel',
	//bodyPadding : '2 4 2 2',
	autoHeight : true,
	width : '100%',
	parent : null,
	cls : 'ft-margin-large-t ft-grid-header',
	initComponent : function()
	{
		var me = this;
		var arrTBarItem = [];
		arrTBarItem.push({
						xtype : 'label',
						//text : getLabel('actions', 'Actions: '),
						cls : 'ft-batch-action ft-batch-action-img',
						padding : '5 0 0 25'
					//	width : 100
					});
		var actionBar = Ext.create( 'GCP.view.SweepTxnAgreementGroupActionView',
				{
					itemId : 'groupActionBarItemId',
					height : 21,
					width : '100%',
					margin : '1 0 0 0',
					parent : me
				} );
		
		arrTBarItem.push(actionBar);
		
		this.items =
		[
			{
				xtype : 'panel',
				width : '100%',
				title : getLabel('sweepAgreements', 'SWEEP AGREEMENTS'),
				bodyCls: 'gradiant_back',
				itemId : 'sweepTxnAgreementDtlViewItemId',
				items :
				[
					{
						xtype : 'container',
						layout : 'hbox',
						items :
						[{
							xtype : 'panel',
							width : '100%',
							cls : 'xn-panel',
							autoHeight : true,
							margin : '5 0 0 0',
							itemId : 'sweepTxnAgreementListDtlView',
							items :
							[
								{
									xtype : 'container',
									layout : 'hbox',
									flex : 1,
									margin : '5 0 0 0',
					                items : arrTBarItem
			
								}
							]
						}
						]

					}
				]
			}
		];
		this.callParent( arguments );
	}
} );
