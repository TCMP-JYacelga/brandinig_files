/**
 * @class GCP.view.BalanceAdjustmentDtlView
 * @extends Ext.panel.Panel
 * @author Archana Shirude
 */
Ext.define( 'GCP.view.BalanceAdjustmentDtlView',
{
	extend : 'Ext.panel.Panel',
	xtype : 'balanceAdjustmentDtlViewType',
	requires :
	[
		'GCP.view.BalanceAdjustmentDtlGridView'
	],
	width : '100%',
	autoHeight : true,
	initComponent : function()
	{
		var me = this;
		me.items =
		[
			
			{
				xtype : 'panel',
				layout :
				{
					type : 'hbox'
				},
				items :
				[
					{
						xtype : 'button',
						itemId : 'addbtn',
						name : 'Add',
						margin : '7 0 5 0',
						text : '<i class="fa fa-plus-circle ux_icon-padding"></i>' + getLabel( 'add', 'Add' ),
						cls : 'inline_block ux_button-padding ux_button-background-color'
					},
					{
						xtype : 'tbspacer',
						width : 20
					},
					{
						xtype : 'button',
						itemId : 'deletebtn',
						name : 'Delete',
						margin : '7 0 5 0',
						text : '<i class="fa fa-minus-circle ux_icon-padding"></i>' + getLabel( 'delete', 'Delete' ),
						cls : 'inline_block ux_button-padding ux_button-background-color'
					}
				]
			},
			{
				xtype : 'balanceAdjustmentDetailGridViewType',
				width : '100%',
				margin : '0 0 5 0'
			}
		];
		me.on( 'resize', function()
		{
			me.doLayout();
		} );
		me.callParent( arguments );
	}
} );
