Ext.define( 'GCP.view.AgentSetupDesignatedPersonEntryDtlToolBarView',
{
	extend : 'Ext.panel.Panel',
	xtype : 'agentSetupDesignatedPersonEntryDtlToolBarViewType',
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
	cls : 'ux_panel-transparent-background',
	bodyCls: 'ux_extralargepadding-bottom',
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
						itemId : 'addPersonButton',
						text : '<i class="fa fa-plus-circle ux_icon-padding"></i>'+getLabel('addPerson','Add'),
						cls : 'inline_block ux_button-padding ux_button-background-color',
						hidden : !( isUpdate && ( pageMode != 'VIEW' ) ),
						parent : this,
						disabled : !( isUpdate && ( pageMode != 'VIEW' ) ),
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
						itemId : 'deletePersonButton',
						text : '<i class="fa fa-minus-circle ux_icon-padding"></i>'+getLabel('deletePerson','Delete'),
						parent : this,
						disabled : !( isUpdate && ( pageMode != 'VIEW' ) ),
						hidden : !( isUpdate && ( pageMode != 'VIEW' ) ),
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
