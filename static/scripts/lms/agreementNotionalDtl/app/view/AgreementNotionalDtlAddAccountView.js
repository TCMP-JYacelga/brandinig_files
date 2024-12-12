Ext.define( 'GCP.view.AgreementNotionalDtlAddAccountView',
{
	extend : 'Ext.window.Window',
	xtype : 'agreementNotionalDtlAddAccount',
	requires :
	[
		'Ext.panel.Panel', 'Ext.button.Button', 'Ext.ux.gcp.AutoCompleter'
	],
	modal : true,
	title : getLabel( 'lblLmsAddAccount', 'Account' ),
	minHeight : 290,
	overflow : 'auto',
	closeAction : 'hide',
	width : 1050,
	cls: 'ux_panel-transparent-background',
	storeData : null,
	layout : 'fit',
	initComponent : function()
	{
		var me = this;
		var seekId='notionalNominatedAccountIdMultiSeek';
		if(!Ext.isEmpty(singleEntity)&&!Ext.isEmpty(multiEntity)){
			if(singleEntity=='T'&&multiEntity=='F')
				seekId='notionalNominatedAccountIdSingleSeek';
		}
		var seekLive='notionalLiveAccountIdSeek';
		if(!Ext.isEmpty(singleEntity)&&!Ext.isEmpty(multiEntity)){
			if(singleEntity=='T'&&multiEntity=='F')
				seekLive='notionalLiveAccountIdSingleSeek';
		}
		var seekNonLive='notionalNonLiveAccountIdSeek';
		if(!Ext.isEmpty(singleEntity)&&!Ext.isEmpty(multiEntity)){
			if(singleEntity=='T'&&multiEntity=='F')
				seekNonLive='notionalNonLiveAccountIdSingleSeek';
		}
		seekId = noPostStructure == 'Y' ? seekNonLive : seekLive;
		console.log('seekId:'+seekId);
		
		//making bank interest profile conditionally mandatory
		var bankInterestProfileLabelClass = 'frmLabel';
		if(!Ext.isEmpty(structureType) && 'CB' !== structureType){
			bankInterestProfileLabelClass = bankInterestProfileLabelClass+' '+'required';
		}
		
		var apportionmentApplicableStore = Ext.create( 'Ext.data.Store',
		{
			fields :
			[
				'key', 'value'
			],
			data :
			[
				{
					"key" : "N",
					"value" : getLabel( "lblNoApplicable", "Not Applicable" )
				},
				{
					"key" : "P",
					"value" : getLabel( "lblInheritFromPool", "Inherit from Group" )
				},
				{
					"key" : "G",
					"value" : getLabel( "lblInheritFromSubgroup", "Inherit from Parent Subgroup" )
				},
				{
					"key" : "A",
					"value" : getLabel( "lblSpecifyNode", "Specify at this Node" )
				}
			]
		} );
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
				cls : 'filter-container-cls ux_panel-transparent-background',
				items :
				[
					// button row
					{
						xtype : 'toolbar',
						padding : '5 40 10 840',
						items :
						[
							'->',
							{
								xtype : 'button',
								itemId : 'btnSave',
								text : '<span><i class="fa fa-save ux_icon-padding"></i>'+getLabel('btnSave','Save')+'</span>',
								cls : 'ux_button-padding ux_button-background-color',
								parent : this,
								handler : function( btn, opts )
								{
									this.parent.fireEvent( 'saveAction', btn, opts );
								}
							},
							{
								xtype : 'button',
								itemId : 'btnUpdate',
								text : '<span><i class="fa fa-save ux_icon-padding"></i>'+getLabel('btnUpdate','Update')+'</span>',
								cls : 'ux_button-padding ux_button-background-color',
								parent : this,
								handler : function( btn, opts )
								{
									this.parent.fireEvent( 'updateAction', btn, opts );
								}							
							},
							{
								xtype : 'button',
								itemId : 'btnCancel',
								text : '<span><i class="fa fa-minus-circle ux_icon-padding"></i>'+getLabel('btnCancel','Cancel')+'</span>',
								cls : 'ux_button-padding ux_button-background-color',
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
						height : 10,
						margin : '0 0 10 0',
						hidden : true
					},
					{
						xtype : 'label',
						cls : 'green ux_font-size14',
						itemId : 'accountParentNodeItemId',
						height : 10,
						margin : '0 0 10 0'
					},
					// 1st row
					{
						xtype : 'container',						
						//width : 'auto',
						layout : 'column',
						width : 1000,
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
										fieldCls : 'xn-form-text w16 xn-suggestion-box',
										labelCls : 'x-form-item-label x-unselectable x-form-item-label-top frmLabel required',
										labelSeparator : '',
										fieldLabel : getLabel( "lblSelectAccount", "Select Account" ),
										readOnly : pageMode == 'VIEW' ? true : false,
										name : 'nodeName',
										itemId : 'nodeName',
										cfgUrl : 'services/userseek/{0}.json',
										cfgQueryParamName : '$autofilter',
										cfgRecordCount : -1,
										cfgSeekId : seekId,
										cfgRootNode : 'd.preferences',
										cfgDataNode1 : 'CODE',
										cfgDataNode2 : 'DESCRIPTION',
										cfgStoreFields :
										[
											'CODE', 'DESCRIPTION', 'CURRENCY', 'ACCOUNTID', 'CLIENT', 'BANK', 'REGID'
										],
										cfgExtraParams :
										[
											{
												key : '$filtercode1',
												value : structureType
											},
											{
												key : '$filtercode2',
												value : poolCurrency
											},
											{
												key : '$filtercode3',
												value : clientId
											},
											{
												key : '$filtercode4',
												value : multiCurFlag
											},
											{
												key : '$sellerCode',
												value : sellerCode
											}
										]
									},
									{
										xtype : 'hidden',
										itemId : 'accountId',
										name : 'accountId'
									},
									{
										xtype : 'hidden',
										itemId : 'currency',
										name : 'currency'
									},
									{
										xtype : 'hidden',
										itemId : 'client',
										name : 'client'
									},
									{
										xtype : 'hidden',
										itemId : 'bank',
										name : 'bank'
									},
									{
										xtype : 'hidden',
										itemId : 'chargeAccountId',
										name : 'chargeAccountId'
									},
									{
										xtype : 'hidden',
										itemId : 'chargeAccountName',
										name : 'chargeAccountName'
									},
									{
										xtype : 'hidden',
										itemId : 'compRegId',
										name : 'compRegId'
									}
								]
							},
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
										fieldLabel : getLabel( "lblAccountDescription", "Account Description" ),
										itemId : 'nodeDescription',
										fieldCls: 'w16',
										labelCls: 'frmLabel ux_smallmargin-top',
										name : 'nodeDescription',
										readOnly : true
									}
								]
							}
							
						]
					},

					// 2nd
					{
						xtype : 'container',
						//width : 'auto',
						layout : 'column',
						width : 1000,
						margin : '0 20 10 0',
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
										xtype : 'combobox',
										displayField : 'value',
										fieldLabel : getLabel( "lblApportionment", "Apportionment" ),
										fieldCls : 'xn-form-field inline_block',
										width : 224,
										labelCls: 'frmLabel',
										itemId : 'apportionment',
										store : apportionmentApplicableStore,
										valueField : 'key',
										readOnly : pageMode == 'VIEW' ? true : false,
										triggerBaseCls : 'xn-form-trigger',
										editable : false,
										value : 'N',
										listeners :
										{
											change : function( combo, newValue, oldValue )
											{
											}
										}
									}
								]
							},
							{
								xtype : 'container',
								columnWidth : 0.33,
								defaults :
								{
									layout : 'hbox',
									labelAlign : 'left',
									labelSeparator : ''
								},
								cls : 'filter-container-cls',
								items :
								[
									{
										xtype : 'label',
										cls : 'frmLabel',
										text : getLabel( "apportionmentNoPost", "Apportionment No Post" )
									},
									{
										xtype : 'checkbox',
										cls : 'frmLabel required',
										readOnly : pageMode == 'VIEW' ? true : false,
										itemId : 'apportionmentNoPostItemId'
									}
								]
							},
							{
								xtype : 'container',
								columnWidth : 0.34,
								defaults :
								{
									layout : 'hbox',
									labelAlign : 'left',
									labelSeparator : ''
								},
								cls : 'filter-container-cls',
								items :
								[
									{
										xtype : 'label',
										text : getLabel("lblBenefitAllocationRatio", "Allocation Ratio(%)"),
										hidden:allocationMethod == 'R' ? false : true
									},
									{
										xtype: 'textfield',
										hidden:allocationMethod == 'R' ? false : true,
										fieldCls : 'xn-valign-middle xn-form-text w16 xn-field-amount',
										labelCls : 'x-form-item-label x-unselectable x-form-item-label-top frmLabel',
										itemId: 'allocationRatio',
										name: 'allocationRatio',
										readOnly :pageMode == 'VIEW' ? true : false,
										maxLength : 6,
										enforceMaxLength : true,
										enableKeyEvents : true,
										listeners :
										{
											keydown : function( textfield, event, options )
											{
												if (event.getKey() == 110 || event.getKey() == 39 || event.getKey() == 37 || event.getKey() == 8 || event.getKey() == 190 || event.getKey() == 46 || (event.getKey() >= 48 && event.getKey() <= 57) || (event.getKey() >= 96 && event.getKey() <= 105)) {
											        return false;
											    }
												else
												{
													event.preventDefault() ;
												}
											}
										}
									}
								]
							}
						]
					},

					// 3rd row
					{
						xtype : 'container',
						//width : 'auto',
						layout : 'column',
						width : 1000,
						margin : '0 20 10 0',
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
										xtype : 'label',
										cls : bankInterestProfileLabelClass,
										text : getLabel( "lblInterestProfileCr", "Bank Interest Profile(CR)" )
									},
									{
										xtype : 'AutoCompleter',
										cls : 'autoCmplete-field',
										fieldCls : 'xn-form-text w16 xn-suggestion-box',
										labelCls : 'x-form-item-label x-unselectable x-form-item-label-top frmLabel required',
										labelSeparator : '',
										name : 'bankCreditInterestProfDesc',
										itemId : 'bankCreditInterestProfDesc',
										readOnly : pageMode == 'VIEW' ? true : false,
										cfgUrl : 'services/userseek/notionalInterestProfileBankSeek.json',
										cfgQueryParamName : '$autofilter',
										cfgRecordCount : -1,
										cfgSeekId : 'notionalInterestProfileBankSeek',
										cfgRootNode : 'd.preferences',
										cfgDataNode1 : 'CODE',
										cfgDataNode2 : 'DESCRIPTION',
										cfgStoreFields :
										[
											'CODE', 'DESCRIPTION','RECORD_KEY'
										],
										cfgExtraParams :
										[
											
										]
									},
									{
										xtype : 'hidden',
										itemId : 'creditInterestProfRecKey',
										name : 'creditInterestProfRecKey'
									}
								]
							},
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
										xtype : 'label',
										cls : 'frmLabel required',
										text : getLabel( "lblApportionmentProfileCr",
											"Apportionment Interest Profile(CR)" )
									},
									{
										xtype : 'AutoCompleter',
										cls : 'autoCmplete-field',
										labelCls : 'x-form-item-label x-unselectable x-form-item-label-top frmLabel required',
										fieldCls : 'xn-form-text w16 xn-suggestion-box',
										labelSeparator : '',
										readOnly : pageMode == 'VIEW' ? true : false,
										name : 'creditApportmentProfileDesc',
										itemId : 'creditApportmentProfileDesc',
										cfgUrl : 'services/userseek/notionalApportionmentProfileSeek.json',
										cfgQueryParamName : '$autofilter',
										cfgRecordCount : -1,
										cfgSeekId : 'notionalApportionmentProfileSeek',
										cfgRootNode : 'd.preferences',
										cfgDataNode1 : 'CODE',
										cfgDataNode2 : 'DESCRIPTION',
										cfgStoreFields :
										[
											'CODE', 'DESCRIPTION','RECORD_KEY'
										],
										cfgExtraParams :
											[
												
											]
									},
									{
										xtype : 'hidden',
										itemId : 'creditApportmentProfileRecKey',
										name : 'creditApportmentProfileRecKey'
									}
								]
							},
							{
								xtype : 'container',
								columnWidth : 0.34,
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
										xtype : 'label',
										cls : 'frmLabel required',
										text : getLabel( "lblNominatedCrAcc", "Nominated Credit Account" )
									},
									{
										xtype : 'AutoCompleter',
										cls : 'autoCmplete-field',
										fieldCls : 'xn-form-text w16 xn-suggestion-box',
										labelCls : 'x-form-item-label x-unselectable x-form-item-label-top frmLabel required',
										readOnly : pageMode == 'VIEW' ? true : false,
										labelSeparator : '',
										name : 'nominatedCreditAccDesc',
										itemId : 'nominatedCreditAccDesc',
										cfgUrl : 'services/userseek/{0}.json',
										cfgQueryParamName : '$autofilter',
										cfgRecordCount : -1,
										cfgSeekId : seekId,
										cfgRootNode : 'd.preferences',
										cfgDataNode1 : 'CODE',
										cfgDataNode2 : 'DESCRIPTION',
										cfgStoreFields :
										[
											'CODE', 'DESCRIPTION','ACCOUNTID'
										],
										cfgExtraParams :
										[
											{
												key : '$filtercode1',
												value : structureType
											},
											{
												key : '$filtercode2',
												value : poolCurrency
											},
											{
												key : '$filtercode3',
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
										itemId : 'nominatedCreditAccId',
										name : 'nominatedCreditAccId'
									}
								]
							}
						]
					},

					// 4th row
					{
						xtype : 'container',
						//width : 'auto',
						layout : 'column',
						width : 1000,
						margin : '0 20 10 0',
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
										xtype : 'label',
										cls : bankInterestProfileLabelClass,
										text : getLabel( "lblInterestProfileDr", "Bank Interest Profile(DR)" )
									},
									{
										xtype : 'AutoCompleter',
										cls : 'autoCmplete-field',
										fieldCls : 'xn-form-text w16 xn-suggestion-box',
										labelCls : 'x-form-item-label x-unselectable x-form-item-label-top frmLabel required',
										readOnly : pageMode == 'VIEW' ? true : false,
										labelSeparator : '',
										name : 'bankDebitInterestProfDesc',
										itemId : 'bankDebitInterestProfDesc',
										cfgUrl : 'services/userseek/notionalInterestProfileBankSeek.json',
										cfgQueryParamName : '$autofilter',
										cfgRecordCount : -1,
										cfgSeekId : 'notionalInterestProfileBankSeek',
										cfgRootNode : 'd.preferences',
										cfgDataNode1 : 'CODE',
										cfgDataNode2 : 'DESCRIPTION',
										cfgStoreFields :
										[
											'CODE', 'DESCRIPTION','RECORD_KEY'
										],
										cfgExtraParams :
											[
												
											]
									},
									{
										xtype : 'hidden',
										itemId : 'debitInterestProfRecKey',
										name : 'debitInterestProfRecKey'
									}
								]
							},
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
										xtype : 'label',
										cls : 'frmLabel required',
										text : getLabel( "lblApportionmentProfileDr",
											"Apportionment Interest Profile(DR)" )
									},
									{
										xtype : 'AutoCompleter',
										cls : 'autoCmplete-field',
										fieldCls : 'xn-form-text w16 xn-suggestion-box',
										readOnly : pageMode == 'VIEW' ? true : false,
										labelSeparator : '',
										name : 'debitApportmentProfileDesc',
										itemId : 'debitApportmentProfileDesc',
										cfgUrl : 'services/userseek/notionalApportionmentProfileSeek.json',
										cfgQueryParamName : '$autofilter',
										cfgRecordCount : -1,
										cfgSeekId : 'notionalApportionmentProfileSeek',
										cfgRootNode : 'd.preferences',
										cfgDataNode1 : 'CODE',
										cfgDataNode2 : 'DESCRIPTION',
										cfgStoreFields :
										[
											'CODE', 'DESCRIPTION','RECORD_KEY'
										],
										cfgExtraParams :
											[
												
											]
									},
									{
										xtype : 'hidden',
										itemId : 'debitApportmentProfileRecKey',
										name : 'debitApportmentProfileRecKey'
									}
								]
							},
							{
								xtype : 'container',
								columnWidth : 0.34,
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
										xtype : 'label',
										cls : 'frmLabel required',
										text : getLabel( "lblNominatedDrAcc", "Nominated Debit Account" )
									},
									{
										xtype : 'AutoCompleter',
										cls : 'autoCmplete-field',
										fieldCls : 'xn-form-text w16 xn-suggestion-box',
										labelCls : 'x-form-item-label x-unselectable x-form-item-label-top frmLabel required',
										readOnly : pageMode == 'VIEW' ? true : false,
										labelSeparator : '',
										name : 'nominatedDebitAccDesc',
										itemId : 'nominatedDebitAccDesc',
										cfgUrl : 'services/userseek/{0}.json',
										cfgQueryParamName : '$autofilter',
										cfgRecordCount : -1,
										cfgSeekId : seekId,
										cfgRootNode : 'd.preferences',
										cfgDataNode1 : 'CODE',
										cfgDataNode2 : 'DESCRIPTION',
										cfgStoreFields :
										[
										 	'CODE', 'DESCRIPTION','ACCOUNTID'
										],
										cfgExtraParams :
										[
											{
												key : '$filtercode1',
												value : structureType
											},
											{
												key : '$filtercode2',
												value : poolCurrency
											},
											{
												key : '$filtercode3',
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
										itemId : 'nominatedDebitAccId',
										name : 'nominatedDebitAccId'
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
								width : 1000
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
