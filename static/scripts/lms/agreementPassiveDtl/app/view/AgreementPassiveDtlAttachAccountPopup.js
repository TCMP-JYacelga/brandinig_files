Ext.define( 'GCP.view.AgreementPassiveDtlAttachAccountPopup',
{
	extend : 'Ext.window.Window',
	xtype : 'attachAccountPopup',
	requires :
	[
		'Ext.panel.Panel', 'Ext.button.Button', 'Ext.ux.gcp.AutoCompleter'
	],
	modal : true,
	title : getLabel( 'lblLmsAddAccount', 'Attach Account' ),
	minHeight : 200,
	overflow : 'auto',
	closeAction : 'hide',
	width : 500,
	storeData : null,
	layout : 'fit',
	config : {		
		mode : null,
		identifier : null,
		fromAccSeekId : null,
		toAccSeekId : null
	},
	initComponent : function()
	{
		var me = this;
		var fromAcctNmbr;
		if(entityType == '0'){
			fromAccSeekId = 'passiveFromAccountCodeIdSeekAdmin';
			toAccSeekId = 'passiveToAccountCodeIdSeekAdmin';
		}
		else {
			fromAccSeekId = 'passiveFromAccountCodeIdSeekClient';
			toAccSeekId = 'passiveToAccountCodeIdSeekClient';
		}
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
					// button row
					{
						xtype : 'toolbar',
						padding : '5 40 10 250',
						items :
						[
							'->',
							{
								xtype : 'button',
								itemId : 'btnSave',
								text : '<span class="linkblue">Save</span>',
								cls : 'xn-account-filter-btnmenu',
								parent : this,
								handler : function( btn, opts )
								{
									this.parent.fireEvent( 'saveAction', btn, opts );
								}
							},
							{
								xtype : 'button',
								itemId : 'btnUpdate',
								text : '<span class="linkblue">Update</span>',
								cls : 'xn-account-filter-btnmenu',
								parent : this,
								handler : function( btn, opts )
								{
									this.parent.fireEvent( 'updateAction', btn, opts );
								}							},
							{
								xtype : 'image',
								src : 'static/images/icons/icon_spacer.gif',
								height : 14
							},
							{
								xtype : 'button',
								itemId : 'btnCancel',
								text : '<span class="linkblue">Cancel</span>',
								cls : 'xn-account-filter-btnmenu',
								parent : this,
								handler : function( btn, opts )
								{
									me.close();
								}
							}
						]
					},

					{
						xtype : 'label',
						cls : 'red',
						itemId : 'errorLabel',
						heigth : 10,
						margin : '0 0 10 25',
						hidden : true
					},

					// 1st row
					{
						xtype : 'container',
						layout : 'column',
						width : 450,
						margin : '0 20 10 25',
						cls : 'filter-container-cls',
						items :
						[
							{
								xtype : 'container',
								columnWidth : 0.33,
								defaults :
								{
									layout : 'vbox',
									labelAlign : 'top',
									labelSeparator : ''
								},
								cls : 'filter-container-cls',
								items :
								[
									{
										xtype : 'AutoCompleter',
										fieldCls : 'xn-form-text w14 xn-suggestion-box',
										labelCls : 'x-form-item-label x-unselectable x-form-item-label-top tdfrmLabel tdrequired',
										labelSeparator : '',
										fieldLabel : getLabel( "lblSelectAccount", "Participate Account" ),
										readOnly : pageMode == 'VIEW' ? true : false,
										name : 'attachFromAccountAutoCompleter',
										itemId : 'attachFromAccountAutoCompleter',
										cfgUrl : 'services/userseek/{0}.json',
										cfgQueryParamName : '$autofilter',
										cfgRecordCount : -1,
										cfgSeekId : fromAccSeekId,
										cfgRootNode : 'd.preferences',
										cfgDataNode1 : 'CODE',
										cfgDataNode2 : 'DESCRIPTION',
										cfgStoreFields :
										[
											'CODE', 'DESCRIPTION', 'ACCTID','CCYCODE'
										],										
										cfgExtraParams :
										[
											{
												key : '$filtercode1',
												value : sellerCode
											},
											{
												key : '$filtercode2',
												value : clientId
											},
											{
												key : '$filtercode3',
												value : multiBankFlag
											}
										]
									},
									{
										xtype : 'hidden',
										itemId : 'fromAccountId',
										name : 'fromAccountId'
									},
									{
										xtype : 'hidden',
										itemId : 'fromAccountCcy',
										name : 'fromAccountCcy'
									},
									{
										xtype : 'hidden',
										itemId : 'fromAccountDesc',
										name : 'fromAccountDesc'
									}
								]
							}
							
							
						]
					},
					// 2nd Row
					{
					
					
					
						xtype : 'container',
						layout : 'column',
						width : 500,
						margin : '0 20 10 25',
						cls : 'filter-container-cls',
						items :
						[
							
								{
								xtype : 'container',
								columnWidth : 0.33,
								defaults :
								{
									layout : 'vbox',
									labelAlign : 'top',
									labelSeparator : ''
								},
								cls : 'filter-container-cls',
								items :
								[
									{
										xtype : 'AutoCompleter',
										fieldCls : 'xn-form-text w14 xn-suggestion-box',
										labelCls : 'x-form-item-label x-unselectable x-form-item-label-top tdfrmLabel tdrequired',
										labelSeparator : '',
										fieldLabel : getLabel( "lblSelectAccount", "Contra Account" ),
										readOnly : pageMode == 'VIEW' ? true : false,
										name : 'attachToAccountAutoCompleter',
										itemId : 'attachToAccountAutoCompleter',
										cfgUrl : 'services/userseek/{0}.json',
										cfgQueryParamName : '$autofilter',
										cfgRecordCount : -1,
										cfgSeekId : toAccSeekId,
										cfgRootNode : 'd.preferences',
										cfgDataNode1 : 'CODE',
										cfgDataNode2 : 'DESCRIPTION',
										cfgStoreFields :
										[
											'CODE', 'DESCRIPTION', 'ACCTID', 'CCYCODE'
										]
									},
									{
										xtype : 'hidden',
										itemId : 'toAccountId',
										name : 'toAccountId'
									},
									{
										xtype : 'hidden',
										itemId : 'toAccountCcy',
										name : 'toAccountCcy'
									},
									{
										xtype : 'hidden',
										itemId : 'toAccountDesc',
										name : 'toAccountDesc'
									}
								]
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
								width : 500
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
