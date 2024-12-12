Ext.define( 'GCP.view.AgreementNotionalDtlGridView',
{
	extend : 'Ext.panel.Panel',
	requires :
	[
	 	'Ext.data.*','Ext.grid.*','Ext.util.*','Ext.tree.*','Ext.ux.CheckColumn'
	],
	xtype : 'agreementNotionalDtlGridViewType',
	cls : 'xn-ribbon ux_panel-transparent-background',
	autoHeight : true,
	bodyCls: 'x-portlet ux_no-padding',
	width : '100%',
	collapsible: true,
	parent : null,
	title :getLabel('agreementStructuralView','Agreement Structural View'),
	initComponent : function()
	{
		var actionBar = Ext.create( 'GCP.view.AgreementNotionalDtlGroupActionView',
				{
					itemId : 'groupActionBarItemId',
					height : 21,
					width : '100%',
					margin : '1 0 0 0',
					parent : me
				} );
		var me = this;
		this.items =
		[
			{
				xtype : 'container',
				layout : 'hbox',
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
		];
		this.callParent( arguments );
	}
} );
