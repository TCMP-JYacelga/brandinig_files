Ext.define( 'GCP.view.SweepTxnGridView',
{
	extend : 'Ext.panel.Panel',
	requires :
	[
	 	'GCP.view.SweepTxnGroupActionView', 'Ext.ux.gcp.SmartGrid','Ext.util.Point', 'Ext.panel.Panel'
	],
	xtype : 'sweepTxnGridViewType',
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
			text : getLabel('actions', 'Actions: '),
			cls : 'ft-batch-action ft-batch-action-img',
			padding : '5 0 0 25'
			//width : 100
		});
		var actionBar = Ext.create( 'GCP.view.SweepTxnGroupActionView',
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
				//collapsible : true,
				title : getLabel('sweepTransactions', 'SWEEP TRANSACTIONS'),
				cls : 'xn-ribbon ux_panel-transparent-background',
				bodyCls: 'gradiant_back',
				itemId : 'sweepTxnDtlViewItemId',
				items :
				[
					{
						xtype : 'container',
						layout : 'hbox',
						cls : 'ux_panel-transparent-background ux_border-top',
						items :
						[
							{
							xtype : 'panel',
							width : '100%',
							cls : 'xn-panel',
							autoHeight : true,
							margin : '5 0 0 0',
							itemId : 'sweepTxnListDtlView',
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
