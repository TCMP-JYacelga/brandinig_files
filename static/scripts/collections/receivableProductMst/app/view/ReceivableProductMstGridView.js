/**
 * @class ReceivableProductMstGridView
 * @extends Ext.panel.Panel
 * @author Archana Shirude
 */

Ext.define( 'GCP.view.ReceivableProductMstGridView',
{
	extend : 'Ext.panel.Panel',
	requires :
	[
		'GCP.view.ReceivableProductMstGroupActionView', 'Ext.ux.gcp.SmartGrid', 'Ext.util.Point'
	],
	xtype : 'receivableProductMstGridViewType',
	cls : 'xn-ribbon',
	autoHeight : true,
	width : '100%',
	parent : null,
	initComponent : function()
	{
		var me = this;
		var actionBar = Ext.create( 'GCP.view.ReceivableProductMstGroupActionView',
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
				bodyCls: 'x-portlet ux_no-padding',
				title : getLabel( 'summary', 'Summary' ),
				itemId : 'receivableProductMstDtlViewItemId',
				items :
				[
					{
						xtype : 'container',
						layout : 'hbox',
						cls: 'ux_panel-transparent-background ux_border-top',
						items :
						[
							{
								xtype : 'label',
								text : getLabel( 'actions', 'Actions' ) + ':',
								cls : 'ux_font-size14',
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
