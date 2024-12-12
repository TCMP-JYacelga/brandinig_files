/**
 * @class GCP.view.BankAdminCategoryHistoryView
 * @extends Ext.panel.Panel
 * @author Nilesh Shinde
 */

Ext.define( 'GCP.view.BankAdminCategoryGridView',
{
	extend : 'Ext.panel.Panel',
	requires :
	[
		'GCP.view.BankAdminCategoryGroupActionView', 'Ext.ux.gcp.SmartGrid', 'Ext.util.Point'
	],
	xtype : 'bankAdminCategoryGridViewType',
	cls : 'xn-ribbon',
	autoHeight : true,
	width : '100%',
	parent : null,
	initComponent : function()
	{
		var me = this;
		var actionBar = Ext.create( 'GCP.view.BankAdminCategoryGroupActionView',
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
				title : getLabel( 'lbl.bankAdminCategory.title', 'Summary' ),
				itemId : 'bankAdminCategoryDtlViewItemId',
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
