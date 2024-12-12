Ext.define( 'GCP.view.AgreementHybridDtlAttachAgreementPopup',
{
	extend : 'Ext.window.Window',
	xtype : 'attachAgreementPopup',
	requires :
	[
		'Ext.panel.Panel', 'Ext.button.Button', 'Ext.ux.gcp.AutoCompleter'
	],
	modal : true,
	title : getLabel( 'lblLmsAddAccount', 'Attach Agreement' ),
	minHeight : 200,
	overflow : 'auto',
	closeAction : 'hide',
	width : 500,
	storeData : null,
	layout : 'fit',
	
	config : {		
		mode : null,
		identifier : null
	},
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
				//width : 'auto',
				layout : 'hbox',
				cls : 'filter-container-cls',
				items :
				[
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
						//width : 450,
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
										cls : 'autoCmplete-field',
										labelCls : 'frmLabel',
										fieldCls : 'form-control',labelSeparator : '',
										fieldLabel : getLabel( "lblSelectAgreement", "Select Agreement" ),
										readOnly : pageMode == 'VIEW' ? true : false,
										name : 'attachAgreementAutoCompleter',
										itemId : 'attachAgreementAutoCompleter',
										cfgUrl : 'services/userseek/hybridAgreementCodeIdSeek.json',
										cfgQueryParamName : '$autofilter',
										cfgRecordCount : -1,
										cfgSeekId : 'hybridAgreementCodeIdSeek',
										cfgRootNode : 'd.preferences',
										cfgDataNode1 : 'CODE',
										cfgDataNode2 : 'DESCRIPTION',
										cfgStoreFields :
										[
											'CODE', 'DESCRIPTION', 'RECKEY'
										],
										cfgExtraParams :
										[
											{
												key : '$filtercode1',
												value : parentRecordKeyNo
											},
											{
												key : '$filtercode2',
												value : clientId
											},
											{
												key : '$sellerCode',
												value : sellerCode
											}
										]
										
									},
									{
										xtype : 'hidden',
										itemId : 'agreementId',
										name : 'agreementId'
									}									
								]
							}
							
							
						]
					},
					// 2nd Row
					{
					
					
					
						xtype : 'container',						
						layout : 'column',
						//width : 500,
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
										xtype : 'textfield',
										fieldLabel : getLabel( "lblAccountDescription", "Agreement Description" ),
										itemId : 'agreementDescription',
										name : 'agreementDescription',
										fieldCls : 'form-control',
										labelCls : 'frmLabel',
										readOnly : true
									},									
									{
										xtype: 'textfield',
										fieldLabel : getLabel("lblPriority", "Priority"),
										hidden:	me.mode == 'EDIT' ? false : true ,
										fieldCls : 'xn-valign-middle xn-form-text w10 xn-field-amount',
										labelCls : 'x-form-item-label x-unselectable x-form-item-label-top tdfrmLabel',
										itemId: 'priority',
										name: 'priority',
										readOnly :pageMode == 'VIEW' ? true : false,
										maxLength : 10,
										enforceMaxLength : true,
										enableKeyEvents : true,
										listeners :
										{
											keydown : function( textfield, event, options )
											{
												if (event.getKey() == 46 || (event.getKey() >= 48 && event.getKey() <= 57)) {
											        return false;
											    }
												else
												{
													textfield.setValue('') ;
												}
											}
										}
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
								cls : 'page-heading-bottom-border'
								//width : 500
							//padding : '4 0 0 0'
							}
						]
					}
				]
			}
		];
		this.bbar = [{
								
								xtype : 'button',
								itemId : 'btnCancel',
								text : '<span >Cancel</span>',
								cls : 'ft-button ft-button-light',
								parent : this,
								handler : function( btn, opts )
								{
									this.parent.close();
								}
							},'->', {
								xtype : 'button',
								itemId : 'btnSave',
								text : '<span >Save</span>',
								cls : 'ft-button ft-margin-l ft-button-primary',
								parent : this,
								handler : function( btn, opts )
								{
									this.parent.fireEvent( 'saveAction', btn, opts );
								}
							},
							{
								xtype : 'button',
								itemId : 'btnUpdate',
								text : '<span >Update</span>',
								cls : 'ft-button ft-margin-l ft-button-primary',
								parent : this,
								handler : function( btn, opts )
								{
									this.parent.fireEvent( 'updateAction', btn, opts );
								}							},
							{
								xtype : 'image',
								src : 'static/images/icons/icon_spacer.gif',
								height : 14
							}
							],

		this.callParent( arguments );
	}
} );
