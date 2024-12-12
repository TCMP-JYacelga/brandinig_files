Ext.define( 'GCP.view.LmsCmtmAccountStoreGridView',
{
	extend : 'Ext.panel.Panel',
	requires :
	[
		'GCP.view.LmsCmtmAccountStoreGroupActionView', 'Ext.ux.gcp.SmartGrid', 'Ext.util.Point'
	],
	xtype : 'lmsCmtmAccountStoreGridViewType',
	cls : 'xn-ribbon  ux_panel-background',
	//bodyPadding : '2 4 2 2',
	autoHeight : true,
	width : '100%',
	parent : null,
	initComponent : function()
	{
		var me = this;
		var actionBar = Ext.create( 'GCP.view.LmsCmtmAccountStoreGroupActionView',
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
				title : getLabel( 'lbl.lmsCmtmAccountStore.summary', 'Accounts Summary' ),
				itemId : 'lmsCmtmAccountStoreDtlViewItemId',
				items :
				[
					{
						xtype : 'container',
						layout : 'hbox',
						cls : 'ux_panel-transparent-background',
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
