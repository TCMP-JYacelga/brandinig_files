/**
 * @class GCP.view.BankAdminUserView
 * @extends Ext.panel.Panel
 * @author Archana Shirude
 */
Ext.define( 'GCP.view.BankAdminUserView',
{
	extend : 'Ext.panel.Panel',
	xtype : 'bankAdminUserViewType',
	requires :
	[
		'GCP.view.BankAdminUserGridView', 'GCP.view.BankAdminUserFilterView'
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
				cls : 'ux_panel-background',
				margin : '0 0 12 0',
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
						text : getLabel( 'lbl.bankAdminUser.title', 'Bank Admin Users' ),
						cls : 'page-heading'
					},
					{
						xtype : 'label',
						flex : 19
					}
				]
			},
			{
				xtype : 'bankAdminUserFilterViewType',
				width : '100%',
				margin : '0 0 0 0',
				collapsible : true,				
				title : getLabel('filterBy', 'Filter By: ') + '&nbsp;<span id="imgFilterInfoGridView" class="largepadding icon-information"></span>'
			},
			{
				xtype : 'panel',
				margin : '0 0 12 0',
				layout :
				{
					type : 'hbox'
				},
				hidden : ADMINSSO == 'Y' ? true : false,
				items :
				[
				 {
						xtype : 'toolbar',
						cls : 'ux_panel-background',					
						flex : 1,
						items : [ {
							xtype : 'button',
							border : 0,
							itemId : 'createNewItemId',							
							cls : 'cursor_pointer ux_button-background ux_button-padding ux_button-background-color ux_button-s',
							parent : this,
							glyph : 'xf055@fontawesome',
							text :getLabel( 'lbl.bankAdminUser.createUser', 'Create Bank Admin User' ),
							disabled : !canEdit,
							hidden : hostUserOnBoarding == 'N' ? false : true,
							handler : function()
							{
								if(canEdit) {
								showBankAdminUserAddRole();
								}
							}
						} ]

					
				 }
				]
			},
			{
				xtype : 'bankAdminUserGridViewType',
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
