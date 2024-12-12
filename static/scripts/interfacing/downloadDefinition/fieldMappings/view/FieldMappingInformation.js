Ext.define( 'GCP.view.FieldMappingInformation',
{
	extend : 'Ext.panel.Panel',
	xtype : 'fieldMappingInformation',
	requires :
	[
		'Ext.panel.Panel'
	],
	width : '100%',
	padding : '12 0 12 0',
	data : null,
	componentCls : 'gradiant_back',
	layout :
	{
		type : 'vbox',
		align : 'stretch'
	},

	initComponent : function()
	{
		var me = this;
		this.items =
		[
			{
				xtype : 'panel',
				itemId : 'upldFieldMappingInfoView',				
				width : '100%',
				cls : 'ux_largepadding',
				layout :
				{
					type : 'hbox'
				},
				items :
				[
					{
						xtype : 'panel',
						cls : 'xn-filter-toolbar',
						flex : 0.8,
						layout : {
							type : 'vbox'
						},
						items : [{
									xtype : 'label',
									text : getLabel('lblview','View'),
									cls : 'ux_font-size14-normal',
									flex : 1
								}, {
									xtype : 'toolbar',
									itemId : 'fieldMappingInfoToolBar',
									cls : 'xn-toolbar-small',									
									width : '100%',
									//enableOverflow : true,
									border : false,
									componentCls : 'xn-btn-default-toolbar-small xn-custom-more-toolbar',
									items : [
									         {
												xtype : 'button',
												itemId : 'btnFileFields',
												name: 'FILE',
												text : '<span class="button_underline">'
														+ getLabel('lblfilefields', 'File Fields')
														+ '</span>',
												cls : 'xn-account-filter-btnmenu xn-small-button',
												margin : '6 0 0 0',
												handler : function() 
												{
													me.fireEvent('openFilterFieldsGrid', this);						
												}
											},
											{
												xtype : 'button',
												itemId : 'btnModelFields',
												name: 'MODEL',
												text : '<span class="button_underline">'
														+ getLabel('lblstandardfields', 'Standard Fields')
														+ '</span>',
												cls : 'xn-account-filter-btnmenu xn-small-button',
												margin : '8 0 0 0',
												handler : function() 
												{
													me.fireEvent('openFilterFieldsGrid', this);						
												}
											},											
											{
												xtype : 'button',
												itemId : 'btnCustomFields',
												name: 'CUSTOM',
												text : '<span class="button_underline">'
														+ getLabel('lblcustomfields', 'Custom Fields')
														+ '</span>',
												cls : 'xn-account-filter-btnmenu xn-small-button',
												margin : '8 0 0 0',
												handler : function() 
												{
													me.fireEvent('openFilterFieldsGrid', this);						
												}
											}
										]
								}]
					}, 
					{
						xtype : 'panel',
						itemId : 'advFilterPanel',
						cls : 'xn-filter-toolbar',
						flex : 0.5,
						hidden : pageMode == 'View' ? true : false,
						layout : {
							type : 'vbox'
						},
						items : [{
									xtype : 'label',
									text : getLabel('lblEdit', 'Edit'),
									cls : 'ux_font-size14-normal',
									padding : '6 0 0 5'
								}, {
									xtype : 'toolbar',
									itemId : 'fieldMappingFieldsToolBar',
									layout : {
										type : 'hbox'
									},
									items : [
												{
													xtype : 'button',
													itemId : 'btnFieldMapping',
													name: 'FIELDMAPPING',
													text : '<span class="button_underline">'
															+ getLabel('lblfieldmapping', 'Field Mapping')
															+ '</span>',
													cls : 'xn-account-filter-btnmenu xn-small-button',
													margin : '8 0 0 0',
													handler : function() 
													{
														me.fireEvent('openFieldMappingGrid', this);		
													
													}
												}
											]
								}]
					}
					
				]
			}
		];
		this.callParent( arguments );
	}

} );
