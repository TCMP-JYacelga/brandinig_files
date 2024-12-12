Ext.define( 'GCP.view.LMSInterestProfileEntryToolBarView',
{
	extend : 'Ext.panel.Panel',
	xtype : 'lmsInterestProfileEntryToolBarViewType',
	requires :
	[
		'Ext.panel.Panel', 'Ext.button.Button', 'Ext.ux.gcp.AutoCompleter','Ext.toolbar.Spacer'
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
								cls: 'ux_no-padding ux_panel-background',
								items :
								[
									{
										xtype : 'button',
										itemId : 'btnCancel',
										text : '<i class="fa fa-minus-circle ux_icon-padding"></i>'+getLabel('cancel','Cancel'),
										cls : 'inline_block ux_button-padding ux_button-background-color ',
										parent : this,
										disabled : false,
										hidden : !showCancel
									}
									,'->',
									{
										xtype : 'button',
										itemId : 'btnSave',
										text : '<i class="fa fa-save ux_icon-padding"></i>'+getLabel('save','Save'),
										cls : 'inline_block ux_button-padding ux_button-background-color',
										parent : this,
										hidden : (pageMode == 'view')
									},
									
									{
										xtype : 'button',
										itemId : 'btnSubmit',
										text : '<i class="fa fa-check-circle ux_icon-padding"></i>'+getLabel('submit','Submit'),
										cls : 'inline_block ux_button-padding ux_button-background-color',
										parent : this,
										hidden : (pageMode == 'view')
									}
								]
								}
						
		//main Container
		];
		this.callParent( arguments );
	}
} );
