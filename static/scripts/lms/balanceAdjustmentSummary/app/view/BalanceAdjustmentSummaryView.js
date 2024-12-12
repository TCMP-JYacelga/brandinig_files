/**
 * @class GCP.view.BalanceAdjustmentSummaryView
 * @extends Ext.panel.Panel
 * @author Archana Shirude
 */
Ext.define( 'GCP.view.BalanceAdjustmentSummaryView',
{
	extend : 'Ext.container.Container',
	xtype : 'balanceAdjustmentSummaryViewType',
	requires :
	[
		'GCP.view.BalanceAdjustmentSummaryGridView','GCP.view.BalanceAdjustmentSummaryFilterView'
	],
	width : '100%',
	autoHeight : true,
	minHeight : 600,
	initComponent : function()
	{
		var me = this;
		me.items =
		[
			{
				xtype : 'panel',
				width : '100%',
				baseCls : 'page-heading ux_extralargepadding-bottom',
				defaults :
				{
					style :
					{
						padding : '0 0 0 4px'
					}
				},
				layout :
				{
					type : 'hbox'
				},
				items :
				[
					{
						xtype : 'label',
						text : getLabel( 'lbl.lms.balanceAdjustmentSummary', 'Balance Adjustment Summary' ),
						cls : 'page-heading'
					}
				]
			},
			{
				xtype : 'balanceAdjustmentSummaryFilterViewType',
				width : '100%',
				margin : '0 0 12 0',
				title : getLabel( 'filterBy', 'Filter By: ' )
					+ '&nbsp;<img id="imgFilterInfoGridView" class="largepadding icon-information"/>'

			},
			{
				xtype : 'toolbar',
				cls : ' ux_panel-background',
				flex : 1,
				margin: '0 0 12 0',
				layout :
				{
					type : 'hbox'
				},
				items :
				[
					
					{
						xtype : 'button',
						itemId : 'createNewItemId',
						parent : this,						
						glyph : 'xf055@fontawesome',
						cls : 'cursor_pointer ux_button-background ux_button-padding ux_button-background-color ux_button-s',
						text : getLabel( 'lms.balanceAdjustment.createNew', 'Create New Balance Adjustment' ),
						hidden : canEdit == false ? true : false,
						handler : function()
						{
							if(canEdit)
							this.fireEvent( 'addNewBalanceAdjustmentEvent');
						}
					}
				]
			},
			{
				xtype : 'balanceAdjustmentSummaryGridViewType',
				width : '100%',
				parent : me
			}
		];
		me.on( 'resize', function()
		{
			me.doLayout();
		} );
		me.callParent( arguments );
	}
} );
