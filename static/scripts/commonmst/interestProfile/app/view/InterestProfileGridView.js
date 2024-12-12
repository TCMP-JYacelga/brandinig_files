Ext.define( 'GCP.view.InterestProfileGridView',
{
	extend : 'Ext.panel.Panel',
	requires :
	[
		'Ext.ux.gcp.SmartGrid', 'GCP.view.InterestProfileActionBarView', 'Ext.panel.Panel'
	],
	xtype : 'interestProfileGridView',
	width : '100%',
	initComponent : function()
	{
		var me = this;
		var actionBar = Ext.create( 'GCP.view.InterestProfileActionBarView',
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
				title : getLabel('interestProfiles','Interest Profiles'),
				itemId : 'interestProfileDtlView',
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
