Ext.define( 'GCP.view.BankAdminUserGridView',
{
	extend : 'Ext.panel.Panel',
	requires :
	[
		'GCP.view.BankAdminUserGroupActionView', 'Ext.ux.gcp.SmartGrid', 'Ext.util.Point'
	],
	xtype : 'bankAdminUserGridViewType',
	cls : 'xn-ribbon ux_panel-transparent-background',
	autoHeight : true,
	width : '100%',
	parent : null,
	initComponent : function()
	{
		var me = this;
		var actionBar = Ext.create( 'GCP.view.BankAdminUserGroupActionView',
		{
			itemId : 'groupActionBarItemId',
			height : 21,
			width : '100%',
			margin : '1 0 0 0',
			parent : me
		} );
		this.items =
		[
			{
				xtype : 'panel',
				collapsible : true,
				width : '100%',
				cls : 'xn-ribbon ux_panel-transparent-background',
				bodyCls : 'x-portlet ux_no-padding',
				title : getLabel( 'lbl.bankAdminUser.title', 'Bank Admin Users' ),
				itemId : 'bankAdminUserDtlViewItemId',
				items :
				[
					{
						xtype : 'container',
						layout : 'hbox',
						cls: 'ux_border-top',
						items :
						[
							{
								xtype : 'label',
								text : getLabel( 'actions', 'Actions' ) + ':',
								cls : 'ux_font-size14 ux-ActionLabel',
								padding : '5 0 0 10'
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
