Ext.define( 'GCP.view.LMSInterestProfileEntryDtlToolBarView',
{
	extend : 'Ext.panel.Panel',
	xtype : 'lmsInterestProfileEntryDtlToolBarViewType',
	requires :
	[
		'Ext.panel.Panel', 'Ext.button.Button', 'Ext.ux.gcp.AutoCompleter'
	],
	modal : true,
	//height : 30,
	overflow : 'auto',
	closeAction : 'hide',
	width : '100%',
	storeData : null,
	layout : 'fit',
	cls : 'ux_panel-background ux_extralargepadding-bottom',
	initComponent : function()
	{
		var me = this;
		this.items =
		[			
			{
				xtype : 'toolbar',
				items :
				[
					{
						xtype : 'button',
						itemId : 'addSlabButton',
						text : '<i class="fa fa-plus-circle ux_icon-padding"></i>'+getLabel('addSlab','Add Slab'),
						cls : 'inline_block ux_button-padding ux_button-background-color',
						hidden : !( isUpdate && ( pageMode != 'view' ) ),
						parent : this,
						disabled : !( isUpdate && ( pageMode != 'view' ) ),
						handler : function()
						{
							this.parent.fireEvent( "addNewRow" );
						}
					},
					{
						xtype : 'tbspacer',
						width : 20
					},
					{
						xtype : 'button',
						itemId : 'deleteSlabButton',
						text : '<i class="fa fa-minus-circle ux_icon-padding"></i>'+getLabel('deleteSlab','Delete Slab'),
						parent : this,
						disabled : !( isUpdate && ( pageMode != 'view' ) ),
						hidden : !( isUpdate && ( pageMode != 'view' ) ),
						cls : 'inline_block ux_button-padding ux_button-background-color',
						handler : function( btn, opts )
						{
							this.parent.fireEvent( 'deleteDetailAction', btn, opts );
						}
					}
				]
			}
						
		//main Container
		];
		this.callParent( arguments );
	}
} );
