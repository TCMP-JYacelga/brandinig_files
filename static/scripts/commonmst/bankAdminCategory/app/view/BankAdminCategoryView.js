/**
 * @class GCP.view.BankAdminCategoryView
 * @extends Ext.panel.Panel
 * @author Nilesh Shinde
 */
Ext.define( 'GCP.view.BankAdminCategoryView',
{
	extend : 'Ext.panel.Panel',
	xtype : 'bankAdminCategoryViewType',
	requires :
	[
		'GCP.view.BankAdminCategoryGridView', 'GCP.view.BankAdminCategoryFilterView'
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
						text : getLabel( 'lbl.bankAdminCategory.title', 'Bank Admin Roles' ),
						cls : 'page-heading'
					},
					{
						xtype : 'label',
						flex : 19
					}
				]
			},
			{
				xtype : 'bankAdminCategoryFilterViewType',
				width : '100%',
				margin : '0 0 12 0',
				title : getLabel( 'filterBy', 'Filter By: ' )+'<img id="imgFilterInfo" class="largepadding icon-information">'

			},
			{
				xtype : 'panel',
				margin : '0 0 12 0',
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
						text : getLabel( 'lbl.bankAdminCategory.bankRole', 'Create Bank Admin Role' ),
						cls : 'cursor_pointer ux_button-background ux_button-padding ux_button-background-color ux_button-s',
						glyph: 'xf055@fontawesome',
						disabled : !canEdit,
						handler : function()
						{						
							if(canEdit)
							{
							addBankAdminCategoryRole();
							}
						}
					}
				]
			},
			{
				xtype : 'bankAdminCategoryGridViewType',
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
