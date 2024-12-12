/**
 * @class GCP.view.ReceivableProductMstView
 * @extends Ext.panel.Panel
 * @author Archana Shirude
 */
Ext.define( 'GCP.view.ReceivableProductMstView',
{
	extend : 'Ext.panel.Panel',
	xtype : 'receivableProductMstViewType',
	requires :
	[
		'GCP.view.ReceivableProductMstGridView', 'GCP.view.ReceivableProductMstFilterView'
	],
	width : '100%',
	autoHeight : true,
	cls: 'ux_panel-background',
	initComponent : function()
	{
		var me = this;
		me.items =
		[
			{
				xtype : 'panel',
				width : '100%',
				margin: '0 0 12 0',
				cls : 'ux_panel-background',
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
						text : getLabel( 'prdName', 'Receivable Product' ),
						cls : 'page-heading'
					},
					{
						xtype : 'label',
						flex : 19
					}
				]
			},
			{
				xtype : 'receivableProductMstFilterViewType',
				width : '100%',
				margin : '0 0 12 0',
			    title : getLabel( 'filterBy', 'Filter By: ' )+
				'<img id="imgFilterInfo" class="largepadding icon-information"/>'

			},
			{
				xtype : 'toolbar',
				cls : ' ux_panel-background',
				margin : '0 0 12 0',
				layout :
				{
					type : 'hbox'
				},
				items :
				[
					{
						xtype : 'button',
						itemId : 'createNewProductItemId',
						parent : this,						
						text : getLabel( 'prdName', 'Receivable Product' ),
						cls : 'cursor_pointer ux_button-background ux_button-padding ux_button-background-color ux_button-s ux_font-size14',
						glyph: 'xf055@fontawesome',
						hidden : !ACCESSNEW,
						handler:function()
						{						
							if(ACCESSNEW)
							{
								me.fireEvent('createNewReceivableProduct',this)							}
						}
					}
				]
			},
			{
				xtype : 'receivableProductMstGridViewType',
				width : '100%',
				margin : '0 0 12 0',
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
