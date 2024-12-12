Ext.define( 'GCP.view.AgreementNotionalDtlAddSubgroupView',
{
	extend : 'Ext.window.Window',
	xtype : 'agreementNotionalDtlAddSubgroupViewType',
	requires :
	[
		'Ext.panel.Panel', 'Ext.button.Button', 'Ext.ux.gcp.AutoCompleter'
	],
	modal : true,
	title : getLabel( 'lblLmsAddSubgroup', 'Subgroup Details' ),
	minHeight : 270,
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
		var sgApportionmentStoreForGrp = Ext.create( 'Ext.data.Store',
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
								itemId : 'sgBtnSaveItemId',
								text : '<span><i class="fa fa-save ux_icon-padding"></i>' + getLabel( 'btnSave', 'Save' ) + '</span>',
								cls : 'ux_button-padding ux_button-background-color',
								parent : this,
								handler : function( btn, opts )
								{
									this.parent.fireEvent( 'saveSubgroupAction', btn, opts );
								}
							},
							{
								xtype : 'button',
								itemId : 'sgBtnUpdateItemId',
								text : '<span><i class="fa fa-save ux_icon-padding"></i>' + getLabel( 'btnUpdate', 'Update' ) + '</span>',
								cls : 'ux_button-padding ux_button-background-color',
								parent : this,
								handler : function( btn, opts )
								{
									this.parent.fireEvent( 'updateSubgroupAction', btn, opts );
								}
							},
							{
								xtype : 'button',
								itemId : 'sgBtnCancelItemId',
								text : '<span><i class="fa fa-minus-circle ux_icon-padding"></i>' + getLabel( 'btnCancel', 'Cancel' ) + '</span>',
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
						itemId : 'errorLabelItemId',
						heigth : 10,
						margin : '0 0 10 0',
						hidden : true
					},
					{
						xtype : 'label',
						cls : 'green ux_font-size14',
						itemId : 'subGrpParentNodeItemId',
						heigth : 10,
						margin : '0 0 10 0'
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
										xtype : 'textfield',
										itemId : 'subgroupCodeItemId',
										labelCls: 'frmLabel required',
										fieldCls: 'w16',
										maxLength : 20,
										enforceMaxLength : true,
										fieldLabel : getLabel( "lblSubgroupCode", "Subgroup Code" ),
										listeners: 
										{
										    change: function(field, newValue, oldValue) 
										    {
										        field.setValue(newValue.toUpperCase());
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
									layout : 'vbox',
									labelAlign : 'top',
									labelSeparator : ''
								},
								cls : 'filter-container-cls',
								items :
								[
									{
										xtype : 'textfield',
										itemId : 'subgroupDescItemId',
										labelCls: 'frmLabel required',
										fieldCls: 'w16',
										maxLength : 120,
										enforceMaxLength : true,
										fieldLabel : getLabel( "lblSubgroupDesc", "Subgroup Description" )
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
										xtype : 'combobox',
										itemId : 'sgApportmentItemId',
										store : sgApportionmentStoreForGrp,
										valueField : 'key',
										displayField : 'value',
										labelCls: 'frmLabel',
										width : 224,
										fieldLabel : getLabel( "lblApportionment", "Apportionment" ),
										fieldCls : 'xn-form-field inline_block',
										triggerBaseCls : 'xn-form-trigger',
										readOnly : pageMode == 'VIEW' ? true : false,
										value : 'N',
										editable : false,
										queryMode: 'local',
										listeners :
										{
											change : function( combo, newValue, oldValue )
											{

											}
										}
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
										cls : 'frmLabel',
										text : getLabel( "apportionmentNoPost", "Apportionment No Post" )
									},
									{
										xtype : 'checkbox',
										cls : 'frmLabel required',
										readOnly : pageMode == 'VIEW' ? true : false,
										itemId : 'sgApportionmentNoPostItemId'
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
										cls : 'frmLabel required',
										text : getLabel( "lblApportionmentProfileCr",
											"Apportionment Interest Profile (CR)" )
									},
									{
										xtype : 'AutoCompleter',
										itemId : 'sgApportmentCrIntProfileDescItemId',
										fieldCls : 'xn-form-text w16 xn-suggestion-box',
										cls : 'autoCmplete-field',
										labelSeparator : '',
										cfgUrl : 'services/userseek/notionalApportionmentProfileSeek.json',
										cfgQueryParamName : '$autofilter',
										readOnly : pageMode == 'VIEW' ? true : false,
										cfgRecordCount : -1,
										cfgSeekId : 'notionalApportionmentProfileSeek',
										cfgRootNode : 'd.preferences',
										cfgDataNode1 : 'CODE',
										cfgDataNode2 : 'DESCRIPTION',
										cfgStoreFields :
										[
											'CODE', 'DESCRIPTION', 'RECORD_KEY'
										],
										cfgExtraParams :
										[
											{
												key : '$sellerCode',
												value : sellerCode
											},
											{
												key : '$filtercode1',
												value : 'C'
											},
											{
												key : '$filtercode2',
												value : 'C'
											},
											{
												key : '$filtercode3',
												value : poolCurrency
											}
										]
									},
									{
										xtype : 'hidden',
										itemId : 'creditApportmentProfileRecKeyItemId'
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
										text : getLabel( "lblNominatedCrAcc", "Nominated Credit Account" )
									},
									{
										xtype : 'AutoCompleter',
										itemId : 'sgNominatedCrAccDescItemId',
										cls : 'autoCmplete-field',
										fieldCls : 'xn-form-text w16 xn-suggestion-box',
										labelSeparator : '',
										cfgUrl : 'services/userseek/{0}.json',
										cfgQueryParamName : '$autofilter',
										cfgRecordCount : -1,
										cfgSeekId :seekId,
										readOnly : pageMode == 'VIEW' ? true : false,
										cfgRootNode : 'd.preferences',
										cfgDataNode1 : 'CODE',
										cfgDataNode2 : 'DESCRIPTION',
										cfgStoreFields :
										[
											'CODE', 'DESCRIPTION', 'CURRENCY','ACCOUNTID'
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
										itemId : 'nominatedCreditAccIdItemId'
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
										text : getLabel( "lblContraCrAcc", "Contra Credit Account" )
									},
									{
										xtype : 'AutoCompleter',
										itemId : 'sgContraCrAccDescItemId',
										cls : 'autoCmplete-field',
										fieldCls : 'xn-form-text w16 xn-suggestion-box',
										labelSeparator : '',
										cfgUrl : 'services/userseek/{0}.json',
										cfgQueryParamName : '$autofilter',
										cfgRecordCount : -1,
										cfgSeekId :seekIdContra,
										readOnly : pageMode == 'VIEW' ? true : false,
										cfgRootNode : 'd.preferences',
										cfgDataNode1 : 'CODE',
										cfgDataNode2 : 'DESCRIPTION',
										cfgStoreFields :
										[
											'CODE', 'DESCRIPTION', 'CURRENCY','ACCOUNTID'
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
										itemId : 'contraCreditAccIdItemId'
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
										cls : 'frmLabel required',
										text : getLabel( "lblApportionmentProfileDr",
											"Apportionment Interest Profile (DR)" )
									},
									{
										xtype : 'AutoCompleter',
										itemId : 'sgApportmentDrIntProfileDescItemId',
										cls : 'autoCmplete-field',
										fieldCls : 'xn-form-text w16 xn-suggestion-box',
										labelSeparator : '',
										cfgUrl : 'services/userseek/notionalApportionmentProfileSeek.json',
										cfgQueryParamName : '$autofilter',
										cfgRecordCount : -1,
										cfgSeekId : 'notionalApportionmentProfileSeek',
										readOnly : pageMode == 'VIEW' ? true : false,
										cfgRootNode : 'd.preferences',
										cfgDataNode1 : 'CODE',
										cfgDataNode2 : 'DESCRIPTION',
										cfgStoreFields :
										[
											'CODE', 'DESCRIPTION', 'RECORD_KEY'
										],
										cfgExtraParams :
										[
											{
												key : '$sellerCode',
												value : sellerCode
											},
											{
												key : '$filtercode1',
												value : 'C'
											},
											{
												key : '$filtercode2',
												value : 'D'
											},
											{
												key : '$filtercode3',
												value : poolCurrency
											}
										]
									},
									{
										xtype : 'hidden',
										itemId : 'debitApportmentProfileRecKeyItemId'
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
										text : getLabel( "lblNominatedDrAcc", "Nominated Debit Account" )
									},
									{
										xtype : 'AutoCompleter',
										itemId : 'sgNominatedDrAccDescItemId',
										cls : 'autoCmplete-field',
										fieldCls : 'xn-form-text w16 xn-suggestion-box',
										labelSeparator : '',
										cfgUrl : 'services/userseek/{0}.json',
										cfgQueryParamName : '$autofilter',
										cfgRecordCount : -1,
										cfgSeekId : seekId,
										readOnly : pageMode == 'VIEW' ? true : false,
										cfgRootNode : 'd.preferences',
										cfgDataNode1 : 'CODE',
										cfgDataNode2 : 'DESCRIPTION',
										cfgStoreFields :
										[
											'CODE', 'DESCRIPTION', 'CURRENCY','ACCOUNTID'
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
										itemId : 'nominatedDebitAccIdItemId'
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
										text : getLabel( "lblContraDrAcc", "Contra Debit Account" )
									},
									{
										xtype : 'AutoCompleter',
										itemId : 'sgContraDrAccDescItemId',
										cls : 'autoCmplete-field',
										fieldCls : 'xn-form-text w16 xn-suggestion-box',
										labelSeparator : '',
										cfgUrl : 'services/userseek/{0}.json',
										cfgQueryParamName : '$autofilter',
										cfgRecordCount : -1,
										cfgSeekId : seekIdContra,
										readOnly : pageMode == 'VIEW' ? true : false,
										cfgRootNode : 'd.preferences',
										cfgDataNode1 : 'CODE',
										cfgDataNode2 : 'DESCRIPTION',
										cfgStoreFields :
										[
											'CODE', 'DESCRIPTION', 'CURRENCY','ACCOUNTID'
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
										itemId : 'contraDebitAccIdItemId'
									}
								]
							}
						]
					},
						// 5th
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
											itemId : 'creditLimitItemId',
											labelCls: 'frmLabel',
											fieldCls : 'xn-valign-middle xn-form-text w16 xn-field-amount',
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
											text : getLabel( "lblChargeAccount", "Charge Account" )
										},
										{
											xtype : 'AutoCompleter',
											itemId : 'sgChargeAccountDescItemId',
											fieldCls : 'xn-form-text w16 xn-suggestion-box',
											cls : 'autoCmplete-field',
											labelSeparator : '',
											cfgUrl : 'services/userseek/notionalChargeAccountIdSeek.json',
											cfgQueryParamName : '$autofilter',
											cfgRecordCount : -1,
											cfgSeekId : 'notionalChargeAccountIdSeek',
											readOnly : pageMode == 'VIEW' ? true : false,
											cfgRootNode : 'd.preferences',
											cfgDataNode1 : 'CODE',
											cfgDataNode2 : 'DESCRIPTION',
											cfgStoreFields :
											[
												'CODE', 'DESCRIPTION', 'CURRENCY','ACCOUNTID'
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
											itemId : 'chargeAccountIdItemId'
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
