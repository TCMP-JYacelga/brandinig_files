Ext.define( 'GCP.view.LmsCmtmAccountStoreEditAddrView',
{
	extend : 'Ext.window.Window',
	xtype : 'lmsCmtmAccountStoreEditAddrViewType',
	requires :
	[
		'Ext.panel.Panel', 'Ext.button.Button', 'Ext.ux.gcp.AutoCompleter'
	],
	modal : true,
	title : getLabel( 'lbl.lmsCmtmAccountStore.addressPopupTitle', 'Edit Account Address' ),
	overflow : 'auto',
	closeAction : 'hide',
	width : 420,
	resizable : false,
	storeData : null,
	layout : 'fit',
	initComponent : function()
	{
		var me = this;

		this.items =
		[
			{
				xtype : 'hidden',
				name : csrfTokenName,
				value : csrfTokenValue
			},
			{
				xtype : 'container',
				width : 'auto',
				layout : 'vbox',
				cls : 'filter-container-cls',
				items :
				[
					{
						xtype : 'label',
						cls : 'red',
						itemId : 'errorLabelItemId',
						heigth : 10,
						margin : '0 0 10 25',
						hidden : true
					},

					// 1st row
					{
						xtype : 'container',
						layout : 'column',
						width : 350,
						margin : '20 20 0 20',
						cls : 'filter-container-cls',
						items :
						[
							{
								xtype : 'container',
								columnWidth : 0.50,
								layout : 'hbox',
								cls : 'filter-container-cls',
								items :
								[
									{
										xtype : 'label',
										text : getLabel( "lbl.lmsCmtmAccountStore.cmtmAccountNmbr",
											"TMAM Account Number" )
									}
								]
							},
							{
								xtype : 'container',
								columnWidth : 0.50,
								layout : 'hbox',
								cls : 'filter-container-cls',
								items :
								[
									{
										xtype : 'textfield',
										itemId : 'cmtmAccountNmbrItemId',
										readonly : true
									}
								]
							}
						]
					},

					// 2nd row
					{
						xtype : 'container',
						layout : 'column',
						width : 350,
						margin : '20 20 0 20',
						cls : 'filter-container-cls',
						items :
						[
							{
								xtype : 'container',
								columnWidth : 0.50,
								layout : 'hbox',
								cls : 'filter-container-cls',
								items :
								[
									{
										xtype : 'label',
										text : getLabel( "lbl.lmsCmtmAccountStore.statementAddress",
											"Statement Address" )
									}
								]
							},
							{
								xtype : 'container',
								columnWidth : 0.50,
								layout : 'hbox',
								cls : 'filter-container-cls',
								items :
								[
									{
										xtype : 'textareafield',
										itemId : 'addressItemId',
										maxLength : 255,
										enforceMaxLength : true,
										fieldCls : 'w14'

									}
								]
							}
						]
					},
					{
						xtype : 'container',
						layout : 'column',
						width : 350,
						margin : '20 20 0 20',
						cls : 'filter-container-cls',
						items :
						[
							{
								xtype : 'container',
								columnWidth : 0.50,
								layout : 'hbox',
								cls : 'filter-container-cls',
								items :
								[
									{
										xtype : 'label',
										text : getLabel( "lbl.lmsCmtmAccountStore.postalCode",
											"Postal Code" )
									}
								]
							},
							{
								xtype : 'container',
								columnWidth : 0.50,
								layout : 'hbox',
								cls : 'filter-container-cls',
								items :
								[
									{
										xtype : 'textfield',
										itemId : 'postalCodeItemId',
										maxLength : 10,
										enforceMaxLength : true,
										readonly : true
									}
								]
							}
						]
					},

					// button row
					{
						xtype : 'toolbar',
						padding : '5 0 10 150',
						items :
						[
							'->',
							{
								xtype : 'button',
								itemId : 'btnSaveItemId',
								text : '<span class="linkblue">' + getLabel( 'save', 'Save' ) + '</span>',
								cls : 'xn-account-filter-btnmenu',
								parent : this,
								handler : function( btn, opts )
								{
									this.parent.fireEvent( 'saveClientAddress', btn, opts );
								}
							},
							{
								xtype : 'image',
								src : 'static/images/icons/icon_spacer.gif',
								height : 14
							},
							{
								xtype : 'button',
								itemId : 'btnCancelItemId',
								text : '<span class="linkblue">' + getLabel( 'cancel', 'Cancel' ) + '</span>',
								cls : 'xn-account-filter-btnmenu',
								parent : this,
								handler : function( btn, opts )
								{
									me.close();
								}
							}
						]
					},

					// bottom border row
					{
						xtype : 'container',
						layout : 'hbox',
						defaults :
						{
							padding : 2,
							labelAlign : 'top',
							labelSeparator : ''
						},
						items :
						[
							{
								xtype : 'label',
								cls : 'page-heading-bottom-border',
								width : 420
							//padding : '4 0 0 0'
							}
						]
					}
				]
			}
		];

		this.callParent( arguments );
	}
} );
