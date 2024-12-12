Ext.define( 'GCP.view.AgentSetupSummaryGridView',
{
	extend : 'Ext.panel.Panel',
	requires :
	[
		'Ext.ux.gcp.SmartGrid', 'GCP.view.AgentSetupSummaryActionBarView', 'Ext.panel.Panel'
	],
	xtype : 'agentSetupSummaryGridView',
	width : '100%',
	initComponent : function()
	{
		var me = this;
		var actionBar = Ext.create( 'GCP.view.AgentSetupSummaryActionBarView',
		{
			itemId : 'groupActionBarView',
			height : 21,
			width : '100%',
			margin : '1 0 0 0',
			parent : me
		} );
		this.items =
		[
			{
				xtype : 'container',
				layout : 'hbox',
				cls: 'ux_panel-background',
				flex : 1,
				items :
				[
					{
						xtype : 'toolbar',
						itemId : 'btnCreateNewToolBar',
						cls : 'ux_extralargemargin-bottom ux_panel-background',
						flex : 1,
						hidden : !canEdit,
						items : []
					},
					{
						xtype : 'container',
						layout : 'hbox',
						cls : 'rightfloating',
						items : []

					}
				]
			},
			{
				xtype : 'panel',
				width : '100%',				
				cls : 'xn-ribbon ux_panel-transparent-background',
				collapsible :true,
				autoHeight : true,
				bodyCls: 'x-portlet ux_no-padding',
				title : getLabel('agentSetup','Agent Setup'),
				itemId : 'agentSetupSummaryDtlView',
				items :
				[
					{
						xtype : 'container',
						layout : 'hbox',
						cls : 'ux_panel-transparent-background ux_border-top',
						items :
						[
							{
								xtype : 'label',
								text : getLabel( 'actions', 'Actions' ) + ':',
								cls : 'ux_font-size14',
								padding : '5 0 5 10'
							}, actionBar,
							{
								xtype : 'label',
								text : '',
								flex : 1
							}
						]

					}
				]
			}
		];
		this.callParent( arguments );
	}

} );
