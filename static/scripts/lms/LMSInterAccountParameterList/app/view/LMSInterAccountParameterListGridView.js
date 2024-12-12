Ext.define( 'GCP.view.LMSInterAccountParameterListGridView',
{
	extend : 'Ext.panel.Panel',
	requires :
	[
		'Ext.ux.gcp.SmartGrid', 'GCP.view.LMSInterAccountParameterListActionBarView', 'Ext.panel.Panel'
	],
	xtype : 'lmsInterAccountParameterListGridView',
	cls : 'ft-grid-header',
	width : '100%',
	initComponent : function()
	{
		var me = this;
		var arrTBarItem = [];
		arrTBarItem.push({
						xtype : 'label',
						text : getLabel('lms.grid.actions', 'Actions: '),
						cls : 'ft-batch-action ft-batch-action-img',
						padding : '5 0 0 25'
						//width : 100
					});
		var actionBar = Ext.create( 'GCP.view.LMSInterAccountParameterListActionBarView',
		{
			itemId : 'groupActionBarView',
			height : 21,
			width : '100%',
			margin : '3 0 0 0',
			parent : me
		} );
		
		arrTBarItem.push(actionBar);
		this.items =
		[
			{
				xtype : 'container',
				layout : 'hbox',
				flex : 1,
				items :
				[
					{
						xtype : 'container',
						layout : 'hbox',
						cls : 'rightfloating',
						items : []

					}
				]
			},{
				xtype : 'panel',
				title : getLabel( 'interAccountSummary', 'Inter Account Summary ' ),
				itemId : 'interAccountSummaryItemId',
				bodyCls: 'gradiant_back',
				autoHeight: true,
				minHeight : 10,
				items :
				[
					{
						xtype : 'container',
						layout : 'hbox',
						items :
						[
						{
								xtype : 'panel',
								width : '100%',
								cls : 'xn-panel',
								autoHeight : true,
								margin : '5 0 0 0',
								itemId : 'lmsInterAccountParameterListDtlView',
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
				],
				tools : [{
					xtype : 'container',
					padding : '5 10 0 0',
					layout : 'hbox',
					titlePosition: 1,
					items : [{
						xtype : 'label',
						border : 0,
						itemId : 'lmsInterAccountParameterList',										
						parent : this,				
						html: '<a href="#" onclick="">'+""+'</a>'
					}]
				}]
			}
			
		];
		this.callParent( arguments );
	}

} );
