Ext.define( 'GCP.view.AgreementNotionalDtlAddPoolView',
{
	extend : 'Ext.window.Window',
	xtype : 'agreementNotionalDtlAddPool',
	requires :
	[
		'Ext.panel.Panel', 'Ext.button.Button', 'Ext.ux.gcp.AutoCompleter'
	],
	modal : true,
	title : getLabel('lblLmsPoolAccount', 'Group Details'),
	minHeight : 300,
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
		var seekIdContra='notionalContraAccountIdMultiSeek';
		if(!Ext.isEmpty(singleEntity)&&!Ext.isEmpty(multiEntity)){
			if(singleEntity=='T'&&multiEntity=='F')
				seekIdContra='notionalContraAccountIdSingleSeek';
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
				itemId : 'addPoolAccountItemId',
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
								itemId : 'btnPoolUpdate',
								text : '<span><i class="fa fa-save ux_icon-padding"></i>'+getLabel('btnUpdate','Update')+'</span>',
								cls : 'ux_button-padding ux_button-background-color',					
								parent : this,
								handler : function(btn, opts) {
									this.parent.fireEvent('updateAction', btn, opts);
								}
							},
							{
								xtype : 'button',
								itemId : 'btnPoolCancel',
								text : '<span><i class="fa fa-minus-circle ux_icon-padding"></i>'+getLabel('btnCancel','Cancel')+'</span>',
								cls : 'ux_button-padding ux_button-background-color',					
								parent : this,
								handler : function(btn, opts) {
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
						margin : '0 0 10 0',
						hidden : true
					},

					// 1st row
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
										xtype: 'textfield',
										fieldLabel: getLabel("lblGroupId", "Group Id"),
										labelCls : 'x-form-item-label x-unselectable x-form-item-label-top frmLabel required',
										itemId: 'nodeName',
										fieldCls: 'w16',
										name: 'nodeName',
										readOnly :pageMode == 'VIEW' ? true : false
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
										xtype: 'textfield',
										fieldLabel: getLabel("lblGroupDescription", "Group Description"),	
										labelCls : 'x-form-item-label x-unselectable x-form-item-label-top frmLabel required',
										itemId: 'nodeDescription',
										fieldCls: 'w16',
										name: 'nodeDescription',
										readOnly :pageMode == 'VIEW' ? true : false
									}
								]
							}
						]
					},
					// 2nd row
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
										cls : (structureType == 'CB' && structureSubType == '3') ? 'frmLabel' : 'frmLabel required',
										text : getLabel( "lblInterestProfileCr", "Bank Interest Profile (CR)")
									},
									{
										xtype : 'AutoCompleter',
										cls : 'autoCmplete-field',
										fieldCls : 'xn-form-text w16 xn-suggestion-box',
										labelCls : 'x-form-item-label x-unselectable x-form-item-label-top frmLabel required',
										labelSeparator : '',
										name : 'creditInterestProfDesc',
										readOnly :pageMode == 'VIEW' ? true : false,
										itemId : 'creditInterestProfDesc',
										cfgUrl : 'services/userseek/notionalInterestProfileSeek.json',
										cfgQueryParamName : '$autofilter',
										cfgRecordCount : -1,
										cfgSeekId : 'notionalInterestProfileSeek',
										cfgRootNode : 'd.preferences',
										cfgDataNode1 : 'CODE',
										cfgDataNode2 : 'DESCRIPTION',
										cfgStoreFields :
											[
												'CODE', 'DESCRIPTION','RECORD_KEY'
											],
										cfgExtraParams :
											[
												{
													key : '$sellerCode',
													value : sellerCode
												},
												{
													key : '$filtercode1',
													value : 'B'
												},
												{
													key : '$filtercode2',
													value : 'C'
												},
												{
													key : '$filtercode3',
													value : structureType
												},
												{
													key : '$filtercode4',
													value : poolCurrency
												}
											]
									},
									{
										xtype : 'hidden',
										itemId : 'creditInterestProfRecKey',
										name :'creditInterestProfRecKey'
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
										text : getLabel( "lblNominatedCrAcc", "Nominated Credit Account")
									},
									{
										xtype : 'AutoCompleter',
										cls : 'autoCmplete-field',
										fieldCls : 'xn-form-text w16 xn-suggestion-box',
										labelCls : 'x-form-item-label x-unselectable x-form-item-label-top frmLabel required',
										labelSeparator : '',
										name : 'nominatedCreditAccDesc',
										itemId : 'nominatedCreditAccDesc',
										readOnly :pageMode == 'VIEW' ? true : false,
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
										name :'nominatedCreditAccId'
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
										text : getLabel( "lblContraCrAcc","Contra Credit Account")
									},
									{
										xtype : 'AutoCompleter',
										cls : 'autoCmplete-field',
										fieldCls : 'xn-form-text w16 xn-suggestion-box',
										labelCls : 'x-form-item-label x-unselectable x-form-item-label-top frmLabel required',
										labelSeparator : '',
										name : 'contraCreditAccDesc',
										itemId : 'contraCreditAccDesc',
										readOnly :pageMode == 'VIEW' ? true : false,
										cfgUrl : 'services/userseek/{0}.json',
										cfgQueryParamName : '$autofilter',
										cfgRecordCount : -1,
										cfgSeekId : seekIdContra,
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
										itemId : 'contraCreditAccId',
										name :'contraCreditAccId'
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
										cls : (structureType == 'CB' && structureSubType == '4') ? 'frmLabel' : 'frmLabel required',
										text : getLabel( "lblInterestProfileDr", "Bank Interest Profile (DR)")
									},
									{
										xtype : 'AutoCompleter',
										cls : 'autoCmplete-field',
										fieldCls : 'xn-form-text w16 xn-suggestion-box',
										labelCls : 'x-form-item-label x-unselectable x-form-item-label-top frmLabel required',
										labelSeparator : '',
										name : 'debitInterestProfDesc',
										itemId : 'debitInterestProfDesc',
										readOnly :pageMode == 'VIEW' ? true : false,
										cfgUrl : 'services/userseek/notionalInterestProfileSeek.json',
										cfgQueryParamName : '$autofilter',
										cfgRecordCount : -1,
										cfgSeekId : 'notionalInterestProfileSeek',
										cfgRootNode : 'd.preferences',
										cfgDataNode1 : 'CODE',
										cfgDataNode2 : 'DESCRIPTION',
										cfgStoreFields :
											[
												'CODE', 'DESCRIPTION','RECORD_KEY'
											],
										cfgExtraParams :
											[
												{
													key : '$sellerCode',
													value : sellerCode
												},
												{
													key : '$filtercode1',
													value : 'B'
												},
												{
													key : '$filtercode2',
													value : 'D'
												},
												{
													key : '$filtercode3',
													value : structureType
												},
												{
													key : '$filtercode4',
													value : poolCurrency
												}
											]
									},
									{
										xtype : 'hidden',
										itemId : 'debitInterestProfRecKey',
										name :'debitInterestProfRecKey'
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
										text : getLabel( "lblNominatedDrAcc", "Nominated Debit Account")
									},
									{
										xtype : 'AutoCompleter',
										cls : 'autoCmplete-field',
										fieldCls : 'xn-form-text w16 xn-suggestion-box',
										labelCls : 'x-form-item-label x-unselectable x-form-item-label-top frmLabel required',
										labelSeparator : '',
										readOnly :pageMode == 'VIEW' ? true : false,
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
										name :'nominatedDebitAccId'
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
										text : getLabel( "lblContraDrAcc","Contra Debit Account")
									},
									{
										xtype : 'AutoCompleter',
										cls : 'autoCmplete-field',
										fieldCls : 'xn-form-text w16 xn-suggestion-box',
										labelCls : 'x-form-item-label x-unselectable x-form-item-label-top frmLabel required',
										labelSeparator : '',
										readOnly :pageMode == 'VIEW' ? true : false,
										name : 'contraDebitAccDesc',
										itemId : 'contraDebitAccDesc',
										cfgUrl : 'services/userseek/{0}.json',
										cfgQueryParamName : '$autofilter',
										cfgRecordCount : -1,
										cfgSeekId : seekIdContra,
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
										itemId : 'contraDebitAccId',
										name :'contraDebitAccId'
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
							
							/*{
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
										xtype : 'numberfield',
										itemId : 'creditLimit',
										fieldCls : 'xn-valign-middle xn-form-text w16 xn-field-amount',
										labelCls: 'frmLabel',
										readOnly : pageMode == 'VIEW' ? true : false,
										fieldLabel : getLabel( "lblCreditLimit", "Limit" ),
										maxLength : 21,
										enforceMaxLength : true,
										enableKeyEvents : true
									}
								]
							},*///FTGCPBDB-4643
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
										text : getLabel( "lblChargeAccount", "Charge Account" )
									},
									{
										xtype : 'AutoCompleter',
										cls : 'autoCmplete-field',
										fieldCls : 'xn-form-text w16 xn-suggestion-box',
										labelCls : 'x-form-item-label x-unselectable x-form-item-label-top frmLabel required',
										labelSeparator : '',
										readOnly :pageMode == 'VIEW' ? true : false,
										name : 'chargeAccountName',
										itemId : 'chargeAccountName',
										cfgUrl : 'services/userseek/notionalChargeAccountIdSeek.json',
										cfgQueryParamName : '$autofilter',
										cfgRecordCount : -1,
										cfgSeekId : 'notionalChargeAccountIdSeek',
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
										itemId : 'chargeAccountId',
										name :'chargeAccountId'
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
