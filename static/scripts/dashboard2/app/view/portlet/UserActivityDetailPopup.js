Ext.define( 'Cashweb.view.portlet.UserActivityDetailPopup',
{
	extend : 'Ext.window.Window',
	requires :
	[
		'Ext.ux.gcp.SmartGrid','Ext.window.Window'
	],
	xtype : 'userActivityDetailPopup',
	width : 770,
	maxHeight: 550,
	minHeight:156,
	resizable: false,
	draggable: false,
	autoHeight : true,
	parent : null,
	user_code : null,
	user_name : null,
	login_time : null,
	logout_time : null,
	title : getLabel('lbluseractdtl', 'User Activity Detail' ),
	modal : true,
	closeAction : 'hide',
	cls : 'xn-popup',
	listeners : {
		'resize' : function(){
			this.center();
		}
	},
	initComponent : function()
	{
		var me = this;
		this.items =
		[
			{
				xtype : 'container',
				layout : 'column',
				width : '100%',
				items : [{
					xtype : 'container',
					columnWidth : 0.3326,		
					layout : {
						type : 'hbox'
					},
					items : [{								
								xtype : 'label',
								text :  (clientSso == 'Y' && autousrcode != 'PRODUCT') ? getLabel('lbluseridsso','SSO User ID : ') : getLabel('lbluserid','Login ID : ') + " ",
								padding : '6 0 0 0'
							},
							{								
								xtype : 'label',
								itemId : (clientSso == 'Y' && autousrcode != 'PRODUCT') ? 'usercodesso' : 'usercode',
								text : this.user_code,
								style : {
									  fontWeight: 'normal'
								},
							//	width : '150',
								padding : '6 0 0 0'
							}
						]
				 },
				 {
					xtype : 'container',
					columnWidth : 0.3326,		
					layout : {
						type : 'hbox'
					},
					items : [{								
								xtype : 'label',
								text : getLabel('lblusername','User Name : '),
								padding : '6 0 0 0'
							},
							{								
								xtype : 'label',
								itemId : 'username',
								text : this.user_name,
								style : {
									  fontWeight: 'normal'
								},
							//	width : '150',
								padding : '6 0 0 0'
							}
						]
				 },
				 {
					xtype : 'container',
					columnWidth : 0.3326,		
					layout : {
						type : 'hbox'
					},
					items : [{								
								xtype : 'label',
								text : getLabel('lbluserCategory','User Category : '),
								padding : '6 0 0 0'
							},
							{								
								xtype : 'label',
								itemId : 'userCategory',
								text : this.user_category,
								style : {
									  fontWeight: 'normal'
								},
							//	width : '150',
								padding : '6 0 0 0'
							}
						]
				 },
				 {
						xtype : 'container',
						columnWidth : 0.3326,		
						layout : {
							type : 'hbox'
						},
						items : [{								
									xtype : 'label',
									text : getLabel('lbllogintime','Last Login Time : '),
									padding : '6 0 0 0'
								},
								{								
									xtype : 'label',
									itemId : 'logintime',
									text : this.login_time,
									style : {
										  fontWeight: 'normal'
									},
								//	width : '150',
									padding : '6 0 0 0'
								}
							]
				 },
				 {
					xtype : 'container',
					columnWidth : 0.3600,		
					layout : {
						type : 'hbox'
					},
					items : [{								
								xtype : 'label',
								text : getLabel('lbllogouttime','Last Logout Time : '),
								padding : '6 0 0 0'
							},
							{								
								xtype : 'label',
								itemId : 'logouttime',
								text : this.logout_time,
								style : {
									  fontWeight: 'normal'
								},
							//	width : '150',
								padding : '6 0 0 0'
							}
						]
				 },
				 {
					xtype : 'container',
					columnWidth : 0.3326,		
					layout : {
						type : 'hbox'
					},
					items : [{								
								xtype : 'label',
								text : getLabel('lbluserType1','User Type : '),
								padding : '6 0 0 0'
							},
							{								
								xtype : 'label',
								itemId : 'userType',
								text : this.user_type,
								style : {
									  fontWeight: 'normal'
								},
							//	width : '150',
								padding : '6 0 0 0'
							}
						]
				 },
				 {
					xtype : 'container',
					columnWidth : 0.3326,		
					layout : {
						type : 'hbox'
					},
					items : [{								
								xtype : 'label',
								text : getLabel('lblclient','Client : '),
								padding : '6 0 0 0'
							},
							{								
								xtype : 'label',
								itemId : 'clientName',
								text : this.client_name,
								style : {
									  fontWeight: 'normal'
								},
							//	width : '150',
								padding : '6 0 0 0'
							}
						]
				 }]
			},			
			{
				xtype : 'panel',
			//	width : '100%',
			//	cls : 'xn-panel',
				itemId : 'activityDtlId',
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
				//	padding : '10 0 0 0',
					dock : 'bottom',
				//	padding : '0 0 0 20',
				//	cls : 'ux_extralargepadding-bottom',
					cls: 'x-toolbar-footer',
					items :
					['->',
						{
							xtype : 'button',
						//	glyph : 'xf056@fontawesome',
							text : getLabel( 'btnClose', 'Close' ),
							itemId : 'cancelBtn',
							handler : function(btn)
							{
								me.close();
							}
						}
					]
				}
			];
		this.callParent( arguments );
	}
} );
