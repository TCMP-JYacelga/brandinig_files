Ext.define( 'GCP.view.NotionalQryBVIntSettledGridView',
{
	extend : 'Ext.panel.Panel',
	requires :
	[
		'Ext.ux.gcp.SmartGrid'
	],
	xtype : 'notionalQryBVIntSettledGridViewType',
	//cls : 'ft-grid-header',
	parent : null,
	initComponent : function()
	{
		var me = this;
		
		this.items =
		[

			{
				xtype : 'panel',
				cls : 'ft-grid-header',
				bodyCls: 'ft-grid-body',
				autoHeight: true,
				minHeight : 10,
				title : getLabel( 'lblBankIntSettled', 'Bank Interest Settled' ), 
				itemId : 'bankSettledViewItemId',
				items :
				[
					{
						xtype : 'panel',
						padding : '5 0 10 0',
						items :[{
							xtype : 'button',
							border : 0,
							itemId : 'apportionmentItemId',
							text : 'Detail View',
							cls : 'ft-button ft-button-primary ft-margin-l pull-right',
							parent : this,
							handler : function(){
								gotoNodeView( 'notionalQueryBVNodePage.srvc','INTEREST_SETTLED');
							}
						}]
						//html: '<a href="#" onclick="javascript:gotoNodeView( \'notionalQueryBVNodePage.srvc\',\'INTEREST_ACCRUED\' //);">'+getLabel( '', 'Detail View' )+'</a>'
					}
				],
				tools : []
			}
		]
		this.callParent( arguments );
	}
} );