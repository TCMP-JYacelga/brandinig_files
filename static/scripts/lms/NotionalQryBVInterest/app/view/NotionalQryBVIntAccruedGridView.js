Ext.define( 'GCP.view.NotionalQryBVIntAccruedGridView',
{
	extend : 'Ext.panel.Panel',
	requires :
	[
		'Ext.ux.gcp.SmartGrid'
	],
	xtype : 'notionalQryBVIntAccruedGridViewType',
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
				minHeight : '100',
				height : 'auto',
				title : getLabel( 'lblBankIntAccrued', 'Bank Interest Accrued' ), 
				itemId : 'bankAccruedViewItemId',
				//layout : 'vbox',
				items :
				[
					{
						xtype : 'panel',
						padding : '5 0 10 0',
						items :[{
							xtype : 'button',
							border : 0,
							itemId : 'accruedItemId',
							text : 'Detail View',
							cls : 'ft-button ft-button-primary ft-margin-l pull-right',
							parent : this,
							handler : function(){
								gotoNodeView( 'notionalQueryBVNodePage.srvc','INTEREST_ACCRUED');
							}
						}]
						//html: '<a href="#" onclick="javascript:gotoNodeView( \'notionalQueryBVNodePage.srvc\',\'INTEREST_ACCRUED\' //);">'+getLabel( '', 'Detail View' )+'</a>'
					}
				],
				tools : [{
					xtype : 'container',
					//padding : '5 10 0 0',
					layout : 'hbox',
					items : []
				}]
			}
		]
		
		this.callParent( arguments );
	}
} );
