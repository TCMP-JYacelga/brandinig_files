Ext.define( 'GCP.view.UserActivityModuleViewPopup',
{
	extend : 'Ext.window.Window',
	requires :
	[
		'Ext.ux.gcp.SmartGrid'
	],
	xtype : 'userActivityModuleViewPopup',
	width : 1000,
	autoHeight : true,
	parent : null,
	user_code : null,
	user_name : null,
	login_time : null,
	logout_time : null,
	title : getLabel('lbluseractdtl', 'Activity Detail' ),
	modal : true,
	closeAction : 'hide',
	cls : 't7-popup',
	initComponent : function()
	{
		var me = this;
		this.items =
		[
			{
				xtype : 'container',
				layout : 'hbox',
				width : '100%',
				items : [{
					xtype : 'panel',					
					flex : 0.8,
					layout : {
						type : 'vbox'
					},
					items : [{
								xtype : 'container',
								layout : {
									type : 'hbox'
								},
								items : [{								
											xtype : 'label',
											text : getLabel('lbluserid','User Id :'),
											cls : 'f13 ux_font-size14',
											flex : 1,
											padding : '6 0 0 8'
										},
										{								
											xtype : 'label',
											text : this.user_code,
											cls : 'ux_font-size14-normal',
											width : '150',
											padding : '6 0 0 8'
										}
									]
							 },
							 {
								xtype : 'container',
								layout : {
									type : 'hbox'
								},
								items : [{								
											xtype : 'label',
											text : getLabel('lblusername','User Name :'),
											cls : 'f13 ux_font-size14',
											flex : 1,
											padding : '6 0 0 8'
										},
										{								
											xtype : 'label',
											text : this.user_name,
											cls : 'ux_font-size14-normal',
											width : '150',
											padding : '6 0 0 8'
										}
									]
							 }
							]
				},
				{
					xtype : 'panel',					
					flex : 0.8,
					cls : 'rightfloating',
					layout : {
						type : 'vbox'
					},
					items : [{
								xtype : 'container',
								layout : {
									type : 'hbox'
								},
								items : [{								
											xtype : 'label',
											text : getLabel('lbllogintime','Login Time :'),
											cls : 'f13 ux_font-size14',
											flex : 1,
											padding : '6 0 0 8'
										},
										{								
											xtype : 'label',
											text : this.login_time,
											cls : 'ux_font-size14-normal',
											width : '150',
											padding : '6 0 0 8'
										}
									]
							 },
							 {
								xtype : 'container',
								layout : {
									type : 'hbox'
								},
								items : [{								
											xtype : 'label',
											text : getLabel('lbllogouttime','Logout Time :'),
											cls : 'f13 ux_font-size14',
											flex : 1,
											padding : '6 0 0 8'
										},
										{								
											xtype : 'label',
											text : this.logout_time,
											cls : 'ux_font-size14-normal',
											width : '150',
											padding : '6 0 0 8'
										}
									]
							 }
							]
				}
				]
			},			
			{
				xtype : 'panel',
				width : '100%',
				cls : 'xn-panel',
				itemId : 'moduleActivityDtlId',
				items :
				[
					{
						xtype : 'container',
						layout : 'hbox',
						items :
						[
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
		this.dockedItems =
			[
				{
					xtype : 'toolbar',
					padding : '0 0 0 20',
					dock : 'bottom',
					cls : 'ux_extralargepadding-bottom',
					items :
					[
						{
							xtype : 'button',
							cls : 'xn-button ux_button-background-color ux_cancel-button',
							glyph : 'xf056@fontawesome',
							text : getLabel( 'btnCancel', 'Cancel' ),
							itemId : 'cancelBtn',
							handler : function(btn)
							{
								me.fireEvent('closeUserActivityModulePopup', btn);
							}
						}
					]
				}
			];
		this.callParent( arguments );
	}
} );
