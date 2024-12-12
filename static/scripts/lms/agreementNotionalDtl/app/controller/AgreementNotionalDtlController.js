Ext.define( 'Pool.model',
{
	extend : 'Ext.data.Model',
	fields :
	[
		{
			name : 'nodeDescription',
			type : 'string'
		},
		{
			name : 'client',
			type : 'string'
		},
		{
			name : 'bank',
			type : 'string'
		},
		{
			name : 'chargeAccount',
			type : 'string'
		},
		{
			name : 'bankCreditInterestProfDesc',
			type : 'string'
		},
		{
			name : 'bankDebitInterestProfDesc',
			type : 'string'
		},
		{
			name : 'nominatedCreditAccDesc',
			type : 'string'
		},
		{
			name : 'nominatedDebitAccDesc',
			type : 'string'
		},
		{
			name : 'contraCreditAccDesc',
			type : 'string'
		},
		{
			name : 'contraDebitAccDesc',
			type : 'string'
		},
		{
			name : 'creditApportmentProfileDesc',
			type : 'string'
		},
		{
			name : 'debitApportmentProfileDesc',
			type : 'string'
		},
		{
			name : 'parentNodeId',
			type : 'string'
		},
		{
			name : 'nodeId',
			type : 'string'
		},
		{
			name : 'accountId',
			type : 'string'
		},
		{
			name : 'allocationRatio',
			type : 'string'
		},
		{
			name : 'nodeType',
			type : 'string'
		},
		{
			name : 'creditApportmentProfileRecKey',
			type : 'string'
		},
		{
			name : 'debitApportmentProfileRecKey',
			type : 'string'
		},
		{
			name : 'creditInterestProfRecKey',
			type : 'string'
		},
		{
			name : 'debitInterestProfRecKey',
			type : 'string'
		},
		{
			name : 'nominatedCreditAccId',
			type : 'string'
		},
		{
			name : 'nominatedDebitAccId',
			type : 'string'
		},
		{
			name : 'contraCreditAccId',
			type : 'string'
		},
		{
			name : 'contraDebitAccId',
			type : 'string'
		},
		{
			name : 'apportionment',
			type : 'string'
		},
		{
			name : 'apportionmentDesc',
			type : 'string'
		},
		{
			name : 'apportionmentType',
			type : 'string'
		},
		{
			name : 'apportionmentTypeDesc',
			type : 'string'
		},
		{
			name : 'chargeAccId',
			type : 'string'
		},
		{
			name : 'nodeCurrency',
			type : 'string'
		},
		{
			name : 'hierarchyLevel',
			type : 'string'
		},
		{
			name : 'nodeName',
			type : 'string'
		},
		{
			name : 'parentRecordKey',
			type : 'string'
		},
		{
			name : 'creditLimit',
			type : 'string'
		},
		{
			name : 'benefitAllocationRatio',
			type : 'string'
		}

	]
} );
Ext
	.define(
		'GCP.controller.AgreementNotionalDtlController',
		{
			extend : 'Ext.app.Controller',
			requires :
			[
				'GCP.view.AgreementNotionalDtlGridView', 'Ext.grid.*', 'Ext.util.*', 'Ext.tree.*',
				'Ext.ux.CheckColumn', 'GCP.view.AgreementNotionalDtlAddAccountView',
				'GCP.view.AgreementNotionalDtlAddSubgroupView', 'GCP.view.AgreementNotionalDtlAddPoolView'
			],
			views :
			[
				'GCP.view.AgreementNotionalDtlView'
			],
			/**
			 * Array of configs to build up references to views on page.
			 */
			refs :
			[
				{
					ref : 'agreementNotionalDtlViewRef',
					selector : 'agreementNotionalDtlViewType'
				},
				{
					ref : 'dtlTreeGridRef',
					selector : 'agreementNotionalDtlViewType agreementNotionalDtlGridViewType'
				},
				{
					ref : 'addSubgroupBtnRef',
					selector : 'agreementNotionalDtlViewType agreementNotionalDtlGroupActionViewType button[itemId="addSubgroupBtnItemId"]'
				},
				{
					ref : 'addAccountBtnRef',
					selector : 'agreementNotionalDtlViewType agreementNotionalDtlGroupActionViewType button[itemId="addAccountBtnItemId"]'
				},
				{
					ref : 'deleteBtnRef',
					selector : 'agreementNotionalDtlViewType agreementNotionalDtlGroupActionViewType button[itemId="deleteBtnItemId"]'
				},
				{
					ref : 'editBtnRef',
					selector : 'agreementNotionalDtlViewType agreementNotionalDtlGroupActionViewType button[itemId="editBtnItemId"]'
				},
				{
					ref : 'btnSaveAccountRef',
					selector : 'agreementNotionalDtlAddAccount[itemId=addAccountPopupId] button[itemId="btnSave"]'
				},
				{
					ref : 'btnUpdateAccountRef',
					selector : 'agreementNotionalDtlAddAccount[itemId=addAccountPopupId] button[itemId="btnUpdate"]'
				},
				{
					ref : 'btnUpdatePoolAccountRef',
					selector : 'agreementNotionalDtlAddPool[itemId=addPoolPopupId] button[itemId="btnPoolUpdate"]'
				},
				{
					ref : 'sgBtnSaveRef',
					selector : 'agreementNotionalDtlAddSubgroupViewType [itemId="addSubgroupPopupItemId"] button[itemId="sgBtnSaveItemId"]'
				},
				{
					ref : 'sgBtnUpdateRef',
					selector : 'agreementNotionalDtlAddSubgroupViewType [itemId="addSubgroupPopupItemId"] button[itemId="sgBtnUpdateItemId"]'
				}

			],
			config :
			{
				prev_record : null,
				parentRecordId : null,
				addAccountPopup : null,
				addSubgroupPopup : null,
				addPoolPopup : null,
				apportionmentNotApplicableStore : null,
				sgApportionmentStoreForSubGrp : null,
				sgApportionmentStoreForGrp : null
			},
			/**
			 * A template method that is called when your application boots. It
			 * is called before the Application's launch function is executed so
			 * gives a hook point to run any code before your Viewport is
			 * created.
			 */
			init : function()
			{
				var me = this;
				me.apportionmentNotApplicableStore = Ext.create( 'Ext.data.Store',
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
								"key" : "A",
								"value" : getLabel( "lblSpecifyNode", "Specify at this Node" )
							}
						]
					} );
				
					me.sgApportionmentStoreForSubGrp = Ext.create( 'Ext.data.Store',
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
									"key" : "B",
									"value" : getLabel( "lblInheritFromParentSubgroup", "Inherit from Parent Subgroup" )
								},
								{
									"key" : "G",
									"value" : getLabel( "lblSpecifyNode", "Specify at this Node" )
								}
							]
						} );
						me.sgApportionmentStoreForGrp = Ext.create( 'Ext.data.Store',
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
				me.addPoolPopup = Ext.create( 'GCP.view.AgreementNotionalDtlAddPoolView',
				{
					parent : 'agreementNotionalDtlViewType',
					itemId : 'addPoolPopupId'
				} );
				me.addAccountPopup = Ext.create( 'GCP.view.AgreementNotionalDtlAddAccountView',
				{
					parent : 'agreementNotionalDtlViewType',
					itemId : 'addAccountPopupId'
				} );
				me.addSubgroupPopup = Ext.create( 'GCP.view.AgreementNotionalDtlAddSubgroupView',
				{
					parent : 'agreementNotionalDtlViewType',
					itemId : 'addSubgroupPopupItemId'
				} );
				me
					.control(
					{
						'agreementNotionalDtlViewType' :
						{
							render : function( panel )
							{
								me.handleTreeGridConfig();
							}
						},
						'agreementNotionalDtlGridViewType toolbar[itemId=groupActionBarItemId]' :
						{
							addSubgroupAction : function( btn, opts )
							{
								me.addSubGroupNode( btn );
							},
							addAccountAction : function( btn, opts )
							{
								me.addAccountNode( btn );
							},
							deleteAction : function( btn, opts )
							{
								me.deleteNode( btn );
							},
							editViewAction : function( btn, opts )
							{
								me.editViewNode( btn );
							}
						},
						'agreementNotionalDtlAddAccount[itemId=addAccountPopupId]' :
						{
							saveAction : function( btn, opts )
							{
								me.saveAccountDetails();
							},
							updateAction : function( btn, opts )
							{
								me.updateAccountDetails();
							}
						},
						'agreementNotionalDtlAddSubgroupViewType[itemId="addSubgroupPopupItemId"]' :
						{
							saveSubgroupAction : function( btn, opts )
							{
								me.saveSubgroupNodeDetails();
							},
							updateSubgroupAction : function( btn, opts )
							{
								me.updateSubgroupNodeDetails();
							}
						},
						'agreementNotionalDtlAddSubgroupViewType[itemId="addSubgroupPopupItemId"] combobox[itemId="sgApportmentItemId"]' :
						{
							change : function( combo, newValue, oldValue )
							{
								me.enableDisableSubgroupFieldList();
								me.getSubGrpProfileValue( newValue, 'S', me.parentRecordId );
							}
						},
						'agreementNotionalDtlAddAccount[itemId="addAccountPopupId"] combobox[itemId="apportionment"]' :
						{
							change : function( combo, newValue, oldValue )
							{
								me.enableDisableAccountFieldList();
								me.getProfileValue( newValue, 'A' );
							}
						},
						'agreementNotionalDtlAddPool[itemId=addPoolPopupId]' :
						{
							updateAction : function( btn, opts )
							{
								me.updatePoolAccountDetails();
							}
						},
						'agreementNotionalDtlAddAccount[itemId="addAccountPopupId"] AutoCompleter[itemId="nodeName"]' :
						{
							keypress : function( text )
							{
								me.addAccountPopup.down( 'hidden[itemId="accountId"]' ).setValue( '' );
							},
							select : function( combo, record, index )
							{
								me.addAccountPopup.down( 'hidden[itemId="accountId"]' ).setValue(
									record[ 0 ].data.ACCOUNTID );
								me.addAccountPopup.down( 'textfield[itemId="nodeDescription"]' ).setValue(
									record[ 0 ].data.DESCRIPTION );
								me.addAccountPopup.down( 'hidden[itemId="currency"]' ).setValue(
									record[ 0 ].data.CURRENCY );
								me.addAccountPopup.down( 'hidden[itemId="client"]' ).setValue( record[ 0 ].data.CLIENT );
								me.addAccountPopup.down( 'hidden[itemId="bank"]' ).setValue( record[ 0 ].data.BANK );
								me.addAccountPopup.down( 'hidden[itemId="compRegId"]' ).setValue(
									record[ 0 ].data.REGID );

								if( !me.addAccountPopup.down( 'textfield[itemId="nominatedDebitAccDesc"]' )
									.isDisabled() )
								{
									me.addAccountPopup.down( 'textfield[itemId="nominatedDebitAccDesc"]' ).setValue(
										record[ 0 ].data.CODE );
									me.addAccountPopup.down( 'hidden[itemId="nominatedDebitAccId"]' ).setValue(
										record[ 0 ].data.ACCOUNTID );
								}
								if( !me.addAccountPopup.down( 'textfield[itemId="nominatedCreditAccDesc"]' )
									.isDisabled() )
								{
									me.addAccountPopup.down( 'textfield[itemId="nominatedCreditAccDesc"]' ).setValue(
										record[ 0 ].data.CODE );
									me.addAccountPopup.down( 'hidden[itemId="nominatedCreditAccId"]' ).setValue(
										record[ 0 ].data.ACCOUNTID );
								}

								var objAutocompleter = me.addAccountPopup
									.down( 'AutoCompleter[itemId="bankCreditInterestProfDesc"]' );
								objAutocompleter.cfgExtraParams =
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
										value : structureType
									},
									{
										key : '$filtercode3',
										value : record[ 0 ].data.CURRENCY
									},
									{
										key : '$filtercode4',
										value : me.getFromStore( 1, 'creditInterestProfRecKey' )
									}
								];
								var objAutocompleter = me.addAccountPopup
									.down( 'AutoCompleter[itemId="creditApportmentProfileDesc"]' );
								objAutocompleter.cfgExtraParams =
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
										value : record[ 0 ].data.CURRENCY
									}
								];
								var objAutocompleter = me.addAccountPopup
									.down( 'AutoCompleter[itemId="bankDebitInterestProfDesc"]' );
								objAutocompleter.cfgExtraParams =
								[
									{
										key : '$sellerCode',
										value : sellerCode
									},
									{
										key : '$filtercode1',
										value : 'D'
									},
									{
										key : '$filtercode2',
										value : structureType
									},
									{
										key : '$filtercode3',
										value : record[ 0 ].data.CURRENCY
									},
									{
										key : '$filtercode4',
										value : me.getFromStore( 1, 'debitInterestProfRecKey' )
									}
								];
								var objAutocompleter = me.addAccountPopup
									.down( 'AutoCompleter[itemId="debitApportmentProfileDesc"]' );
								objAutocompleter.cfgExtraParams =
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
										value : record[ 0 ].data.CURRENCY
									}
								];
							}
						},
						'agreementNotionalDtlAddPool[itemId="addPoolPopupId"] AutoCompleter[itemId="creditInterestProfDesc"]' :
						{
							keypress : function( text )
							{
								me.addPoolPopup.down( 'hidden[itemId="creditInterestProfRecKey"]' ).setValue( '' );
							},
							select : function( combo, record, index )
							{
								me.addPoolPopup.down( 'hidden[itemId="creditInterestProfRecKey"]' ).setValue(
									record[ 0 ].data.RECORD_KEY );
							}
						},
						'agreementNotionalDtlAddAccount[itemId="addAccountPopupId"] AutoCompleter[itemId="bankCreditInterestProfDesc"]' :
						{
							keypress : function( text )
							{
								me.addAccountPopup.down( 'hidden[itemId="creditInterestProfRecKey"]' ).setValue( '' );
							},
							select : function( combo, record, index )
							{
								me.addAccountPopup.down( 'hidden[itemId="creditInterestProfRecKey"]' ).setValue(
									record[ 0 ].data.RECORD_KEY );
							}
						},
						'agreementNotionalDtlAddAccount[itemId="addAccountPopupId"] AutoCompleter[itemId="creditApportmentProfileDesc"]' :
						{
							keypress : function( text )
							{
								me.addAccountPopup.down( 'hidden[itemId="creditApportmentProfileRecKey"]' ).setValue(
									'' );
							},
							select : function( combo, record, index )
							{
								me.addAccountPopup.down( 'hidden[itemId="creditApportmentProfileRecKey"]' ).setValue(
									record[ 0 ].data.RECORD_KEY );
							}
						},
						'agreementNotionalDtlAddAccount[itemId="addAccountPopupId"] AutoCompleter[itemId="nominatedCreditAccDesc"]' :
						{
							keypress : function( text )
							{
								me.addAccountPopup.down( 'hidden[itemId="nominatedCreditAccId"]' ).setValue( '' );
							},
							select : function( combo, record, index )
							{
								me.addAccountPopup.down( 'hidden[itemId="nominatedCreditAccId"]' ).setValue(
									record[ 0 ].data.ACCOUNTID );

								/*if( !me.addAccountPopup.down( 'textfield[itemId="nominatedDebitAccDesc"]' )
									.isDisabled() )
								{
									me.addAccountPopup.down( 'textfield[itemId="nominatedDebitAccDesc"]' ).setValue(
										record[ 0 ].data.CODE );
									me.addAccountPopup.down( 'hidden[itemId="nominatedDebitAccId"]' ).setValue(
										record[ 0 ].data.ACCOUNTID );
								}*/

							}
						},
						'agreementNotionalDtlAddPool[itemId="addPoolPopupId"] AutoCompleter[itemId="nominatedCreditAccDesc"]' :
						{
							keypress : function( text )
							{
								me.addPoolPopup.down( 'hidden[itemId="nominatedCreditAccId"]' ).setValue( '' );
							},
							select : function( combo, record, index )
							{
								me.addPoolPopup.down( 'hidden[itemId="nominatedCreditAccId"]' ).setValue(
									record[ 0 ].data.ACCOUNTID );
								if( !me.addPoolPopup.down( 'textfield[itemId="contraCreditAccDesc"]' ).isDisabled() )
								{
									me.addPoolPopup.down( 'textfield[itemId="contraCreditAccDesc"]' ).setValue(
										record[ 0 ].data.CODE );
									me.addPoolPopup.down( 'hidden[itemId="contraCreditAccId"]' ).setValue(
										record[ 0 ].data.ACCOUNTID );
								}
								if( !me.addPoolPopup.down( 'textfield[itemId="nominatedDebitAccDesc"]' ).isDisabled() )
								{
									me.addPoolPopup.down( 'textfield[itemId="nominatedDebitAccDesc"]' ).setValue(
										record[ 0 ].data.CODE );
									me.addPoolPopup.down( 'hidden[itemId="nominatedDebitAccId"]' ).setValue(
										record[ 0 ].data.ACCOUNTID );
								}

								if( !me.addPoolPopup.down( 'textfield[itemId="contraDebitAccDesc"]' ).isDisabled() )
								{
									me.addPoolPopup.down( 'textfield[itemId="contraDebitAccDesc"]' ).setValue(
										record[ 0 ].data.CODE );
									me.addPoolPopup.down( 'hidden[itemId="contraDebitAccId"]' ).setValue(
										record[ 0 ].data.ACCOUNTID );
								}

								if( !me.addPoolPopup.down( 'textfield[itemId="chargeAccountName"]' ).isDisabled() )
								{
									me.addPoolPopup.down( 'textfield[itemId="chargeAccountName"]' ).setValue(
										record[ 0 ].data.CODE );
									me.addPoolPopup.down( 'hidden[itemId="chargeAccountId"]' ).setValue(
										record[ 0 ].data.ACCOUNTID );
								}
							}
						},
						'agreementNotionalDtlAddPool[itemId="addPoolPopupId"] AutoCompleter[itemId="debitInterestProfDesc"]' :
						{
							keypress : function( text )
							{
								me.addPoolPopup.down( 'hidden[itemId="debitInterestProfRecKey"]' ).setValue( '' );
							},
							select : function( combo, record, index )
							{
								me.addPoolPopup.down( 'hidden[itemId="debitInterestProfRecKey"]' ).setValue(
									record[ 0 ].data.RECORD_KEY );
							}
						},
						'agreementNotionalDtlAddAccount[itemId="addAccountPopupId"] AutoCompleter[itemId="bankDebitInterestProfDesc"]' :
						{
							keypress : function( text )
							{
								me.addAccountPopup.down( 'hidden[itemId="debitInterestProfRecKey"]' ).setValue( '' );
							},
							select : function( combo, record, index )
							{
								me.addAccountPopup.down( 'hidden[itemId="debitInterestProfRecKey"]' ).setValue(
									record[ 0 ].data.RECORD_KEY );
							}
						},
						'agreementNotionalDtlAddAccount[itemId="addAccountPopupId"] AutoCompleter[itemId="debitApportmentProfileDesc"]' :
						{
							keypress : function( text )
							{
								me.addAccountPopup.down( 'hidden[itemId="debitApportmentProfileRecKey"]' )
									.setValue( '' );
							},
							select : function( combo, record, index )
							{
								me.addAccountPopup.down( 'hidden[itemId="debitApportmentProfileRecKey"]' ).setValue(
									record[ 0 ].data.RECORD_KEY );
							}
						},
						'agreementNotionalDtlAddAccount[itemId="addAccountPopupId"] AutoCompleter[itemId="nominatedDebitAccDesc"]' :
						{
							keypress : function( text )
							{
								me.addAccountPopup.down( 'hidden[itemId="nominatedDebitAccId"]' ).setValue( '' );
							},
							select : function( combo, record, index )
							{
								me.addAccountPopup.down( 'hidden[itemId="nominatedDebitAccId"]' ).setValue(
									record[ 0 ].data.ACCOUNTID );
							}
						},
						'agreementNotionalDtlAddPool[itemId="addPoolPopupId"] AutoCompleter[itemId="nominatedDebitAccDesc"]' :
						{
							keypress : function( text )
							{
								me.addPoolPopup.down( 'hidden[itemId="nominatedDebitAccId"]' ).setValue( '' );
							},
							select : function( combo, record, index )
							{
								me.addPoolPopup.down( 'hidden[itemId="nominatedDebitAccId"]' ).setValue(
									record[ 0 ].data.ACCOUNTID );
								if( !me.addPoolPopup.down( 'textfield[itemId="contraDebitAccDesc"]' ).isDisabled() )
								{
									me.addPoolPopup.down( 'textfield[itemId="contraDebitAccDesc"]' ).setValue(
										record[ 0 ].data.CODE );
									me.addPoolPopup.down( 'hidden[itemId="contraDebitAccId"]' ).setValue(
										record[ 0 ].data.ACCOUNTID );
								}
							}
						},
						'agreementNotionalDtlAddPool[itemId="addPoolPopupId"] AutoCompleter[itemId="contraCreditAccDesc"]' :
						{
							keypress : function( text )
							{
								me.addPoolPopup.down( 'hidden[itemId="contraCreditAccId"]' ).setValue( '' );
							},
							select : function( combo, record, index )
							{
								me.addPoolPopup.down( 'hidden[itemId="contraCreditAccId"]' ).setValue(
									record[ 0 ].data.ACCOUNTID );
								
								/*if(!me.addPoolPopup.down( 'textfield[itemId="contraDebitAccDesc"]' ).isDisabled())
								{
									me.addPoolPopup.down( 'textfield[itemId="contraDebitAccDesc"]' ).setValue(
										record[ 0 ].data.CODE );
									me.addPoolPopup.down( 'hidden[itemId="contraDebitAccId"]' ).setValue(
											record[ 0 ].data.ACCOUNTID );
							}*/
							}
						},
						'agreementNotionalDtlAddPool[itemId="addPoolPopupId"] AutoCompleter[itemId="contraDebitAccDesc"]' :
						{
							keypress : function( text )
							{
								me.addPoolPopup.down( 'hidden[itemId="contraDebitAccId"]' ).setValue( '' );
							},
							select : function( combo, record, index )
							{
								me.addPoolPopup.down( 'hidden[itemId="contraDebitAccId"]' ).setValue(
									record[ 0 ].data.ACCOUNTID );
							}
						},
						'agreementNotionalDtlAddPool[itemId="addPoolPopupId"] AutoCompleter[itemId="chargeAccountName"]' :
						{
							keypress : function( text )
							{
								me.addPoolPopup.down( 'hidden[itemId="chargeAccountId"]' ).setValue( '' );
							},
							select : function( combo, record, index )
							{
								me.addPoolPopup.down( 'hidden[itemId="chargeAccountId"]' ).setValue(
									record[ 0 ].data.ACCOUNTID );
								/*if( !me.addPoolPopup.down( 'textfield[itemId="nominatedCreditAccDesc"]' ).isDisabled() )
								{
									me.addPoolPopup.down( 'textfield[itemId="nominatedCreditAccDesc"]' ).setValue(
										record[ 0 ].data.CODE );
									me.addPoolPopup.down( 'hidden[itemId="nominatedCreditAccId"]' ).setValue(
										record[ 0 ].data.ACCOUNTID );
								}*/

							}
						},
						'agreementNotionalDtlAddSubgroupViewType[itemId="addSubgroupPopupItemId"] AutoCompleter[itemId="sgChargeAccountDescItemId"]' :
						{
							keypress : function( text )
							{
								me.addSubgroupPopup.down( 'hidden[itemId="chargeAccountIdItemId"]' ).setValue( '' );
							},
							select : function( combo, record, index )
							{
								me.addSubgroupPopup.down( 'hidden[itemId="chargeAccountIdItemId"]' ).setValue(
									record[ 0 ].data.ACCOUNTID );
								/*if( !me.addSubgroupPopup.down( 'textfield[itemId="sgNominatedCrAccDescItemId"]' )
									.isDisabled() )
								{
									me.addSubgroupPopup.down( 'textfield[itemId="sgNominatedCrAccDescItemId"]' )
										.setValue( record[ 0 ].data.CODE );
									me.addSubgroupPopup.down( 'hidden[itemId="nominatedCreditAccIdItemId"]' ).setValue(
										record[ 0 ].data.ACCOUNTID );
								}*/
							}
						},
						'agreementNotionalDtlAddSubgroupViewType[itemId="addSubgroupPopupItemId"] AutoCompleter[itemId="sgApportmentCrIntProfileDescItemId"]' :
						{
							keypress : function( text )
							{
								me.addSubgroupPopup.down( 'hidden[itemId="creditApportmentProfileRecKeyItemId"]' )
									.setValue( '' );
							},
							select : function( combo, record, index )
							{
								me.addSubgroupPopup.down( 'hidden[itemId="creditApportmentProfileRecKeyItemId"]' )
									.setValue( record[ 0 ].data.RECORD_KEY );
							}
						},
						'agreementNotionalDtlAddSubgroupViewType[itemId="addSubgroupPopupItemId"] AutoCompleter[itemId="sgNominatedCrAccDescItemId"]' :
						{
							keypress : function( text )
							{
								me.addSubgroupPopup.down( 'hidden[itemId="nominatedCreditAccIdItemId"]' ).setValue( '' );
							},
							select : function( combo, record, index )
							{
								me.addSubgroupPopup.down( 'hidden[itemId="nominatedCreditAccIdItemId"]' ).setValue(
									record[ 0 ].data.ACCOUNTID );
								if( !me.addSubgroupPopup.down( 'textfield[itemId="sgContraCrAccDescItemId"]' )
									.isDisabled() )
								{
									me.addSubgroupPopup.down( 'textfield[itemId="sgContraCrAccDescItemId"]' ).setValue(
										record[ 0 ].data.CODE );
									me.addSubgroupPopup.down( 'hidden[itemId="contraCreditAccIdItemId"]' ).setValue(
										record[ 0 ].data.ACCOUNTID );
								}

							}
						},
						'agreementNotionalDtlAddSubgroupViewType[itemId="addSubgroupPopupItemId"] AutoCompleter[itemId="sgContraCrAccDescItemId"]' :
						{
							keypress : function( text )
							{
								me.addSubgroupPopup.down( 'hidden[itemId="contraCreditAccIdItemId"]' ).setValue( '' );
							},
							select : function( combo, record, index )
							{
								me.addSubgroupPopup.down( 'hidden[itemId="contraCreditAccIdItemId"]' ).setValue(
									record[ 0 ].data.ACCOUNTID );
							}
						},
						'agreementNotionalDtlAddSubgroupViewType[itemId="addSubgroupPopupItemId"] AutoCompleter[itemId="sgApportmentDrIntProfileDescItemId"]' :
						{
							keypress : function( text )
							{
								me.addSubgroupPopup.down( 'hidden[itemId="debitApportmentProfileRecKeyItemId"]' )
									.setValue( '' );
							},
							select : function( combo, record, index )
							{
								me.addSubgroupPopup.down( 'hidden[itemId="debitApportmentProfileRecKeyItemId"]' )
									.setValue( record[ 0 ].data.RECORD_KEY );
							}
						},
						'agreementNotionalDtlAddSubgroupViewType[itemId="addSubgroupPopupItemId"] AutoCompleter[itemId="sgNominatedDrAccDescItemId"]' :
						{
							keypress : function( text )
							{
								me.addSubgroupPopup.down( 'hidden[itemId="nominatedDebitAccIdItemId"]' ).setValue( '' );
							},
							select : function( combo, record, index )
							{
								me.addSubgroupPopup.down( 'hidden[itemId="nominatedDebitAccIdItemId"]' ).setValue(
									record[ 0 ].data.ACCOUNTID );
								if( !me.addSubgroupPopup.down( 'textfield[itemId="sgContraDrAccDescItemId"]' )
									.isDisabled() )
								{
									me.addSubgroupPopup.down( 'textfield[itemId="sgContraDrAccDescItemId"]' ).setValue(
										record[ 0 ].data.CODE );
									me.addSubgroupPopup.down( 'hidden[itemId="contraDebitAccIdItemId"]' ).setValue(
										record[ 0 ].data.ACCOUNTID )
								}
							}
						},
						'agreementNotionalDtlAddSubgroupViewType[itemId="addSubgroupPopupItemId"] AutoCompleter[itemId="sgContraDrAccDescItemId"]' :
						{
							keypress : function( text )
							{
								me.addSubgroupPopup.down( 'hidden[itemId="contraDebitAccIdItemId"]' ).setValue( '' );
							},
							select : function( combo, record, index )
							{
								me.addSubgroupPopup.down( 'hidden[itemId="contraDebitAccIdItemId"]' ).setValue(
									record[ 0 ].data.ACCOUNTID );
							}
						}
					} );
			},

			addSubGroupNode : function()
			{
				var me = this;
				if( !Ext.isEmpty( me.addSubgroupPopup ) )
				{
					me.addSubgroupPopup.destroy();
				}
				me.addSubgroupPopup = Ext.create( 'GCP.view.AgreementNotionalDtlAddSubgroupView',
				{
					parent : 'agreementNotionalDtlViewType',
					itemId : 'addSubgroupPopupItemId'
				} );
				me.parentRecordId = me.prev_record.get( 'nodeId' );
				
				/*if( me.parentRecordId != 1 )
				{
					me.addSubgroupPopup.down( 'combobox[itemId="sgApportmentItemId"]' ).store = me.sgApportionmentStoreForSubGrp;	
				}*/
				
				var temp = null;
				temp = me.addSubgroupPopup.down( 'combobox[itemId="sgApportmentItemId"]' );

				if( me.parentRecordId == 1 )
				{
					temp.store.loadData( me.sgApportionmentStoreForGrp.getRange(), false );
				}
				else
				{
					temp.store.loadData( me.sgApportionmentStoreForSubGrp.getRange(), false );
				}	
				me.addSubgroupPopup.down( 'button[itemId="sgBtnSaveItemId"]' ).show();
				me.addSubgroupPopup.down( 'button[itemId="sgBtnUpdateItemId"]' ).hide();
				me.addSubgroupPopup.down( 'label[itemId="errorLabelItemId"]' ).setText( '' );
				me.addSubgroupPopup.down( 'label[itemId="subGrpParentNodeItemId"]' ).setText(
						getLabel('parentNode','Parent Node : ') + me.prev_record.get( 'nodeName' ) );
				me.enableDisableSubgroupFieldList();
			
					me.addSubgroupPopup.down( 'textfield[itemId="sgNominatedDrAccDescItemId"]' ).setValue(
						me.prev_record.get( 'nominatedDebitAccDesc' ) );
					me.addSubgroupPopup.down( 'hidden[itemId="nominatedDebitAccIdItemId"]' ).setValue(
						me.prev_record.get( 'nominatedDebitAccId' ) );
				
			
					me.addSubgroupPopup.down( 'textfield[itemId="sgNominatedCrAccDescItemId"]' ).setValue(
						me.prev_record.get( 'nominatedCreditAccDesc' ) );
					me.addSubgroupPopup.down( 'hidden[itemId="nominatedCreditAccIdItemId"]' ).setValue(
						me.prev_record.get( 'nominatedCreditAccId' ) );
			
				if( !me.addSubgroupPopup.down( 'textfield[itemId="sgChargeAccountDescItemId"]' ).isDisabled() )
				{
					me.addSubgroupPopup.down( 'textfield[itemId="sgChargeAccountDescItemId"]' ).setValue(
						me.prev_record.get( 'chargeAccount' ) );
					me.addSubgroupPopup.down( 'hidden[itemId="chargeAccountIdItemId"]' ).setValue(
						me.prev_record.get( 'chargeAccId' ) );
				}

				me.addSubgroupPopup.show();
			},
			enableDisableSubgroupFieldList : function()
			{
				var me = this;
				var apportionment = me.addSubgroupPopup.down( 'textfield[itemId="sgApportmentItemId"]' ).getValue();
				me.addSubgroupPopup.down( 'textfield[itemId="sgApportmentItemId"]' ).setDisabled(
					me.getFieldBooleanValue( subgroupFieldList[ 0 ].apportionment ) );
				me.addSubgroupPopup.down( 'textfield[itemId="sgApportmentItemId"]' ).addClass(
					me.getFieldClsValue( subgroupFieldList[ 0 ].apportionment ) );
				me.addSubgroupPopup.down( 'textfield[itemId="sgApportmentCrIntProfileDescItemId"]' ).setDisabled(
					me.getFieldBooleanValue( subgroupFieldList[ 1 ].appotionmentCrditIntProfile ) );
				me.addSubgroupPopup.down( 'textfield[itemId="sgApportmentCrIntProfileDescItemId"]' ).addClass(
					me.getFieldClsValue( subgroupFieldList[ 1 ].appotionmentCrditIntProfile ) );
				me.addSubgroupPopup.down( 'textfield[itemId="sgApportmentDrIntProfileDescItemId"]' ).setDisabled(
					me.getFieldBooleanValue( subgroupFieldList[ 2 ].apportionmentDebitIntProfile ) );
				me.addSubgroupPopup.down( 'textfield[itemId="sgApportmentDrIntProfileDescItemId"]' ).addClass(
					me.getFieldClsValue( subgroupFieldList[ 2 ].apportionmentDebitIntProfile ) );
				me.addSubgroupPopup.down( 'textfield[itemId="sgNominatedCrAccDescItemId"]' ).setDisabled(
					me.getFieldBooleanValue( subgroupFieldList[ 3 ].nominatedCreditAccount ) );
				me.addSubgroupPopup.down( 'textfield[itemId="sgNominatedCrAccDescItemId"]' ).addClass(
					me.getFieldClsValue( subgroupFieldList[ 3 ].nominatedCreditAccount ) );
				me.addSubgroupPopup.down( 'textfield[itemId="sgNominatedDrAccDescItemId"]' ).setDisabled(
					me.getFieldBooleanValue( subgroupFieldList[ 4 ].nominatedDebitAccount ) );
				me.addSubgroupPopup.down( 'textfield[itemId="sgNominatedDrAccDescItemId"]' ).addClass(
					me.getFieldClsValue( subgroupFieldList[ 4 ].nominatedDebitAccount ) );
				me.addSubgroupPopup.down( 'textfield[itemId="sgContraCrAccDescItemId"]' ).setDisabled(
					me.getFieldBooleanValue( subgroupFieldList[ 5 ].contraCreditAccount ) );
				me.addSubgroupPopup.down( 'textfield[itemId="sgContraCrAccDescItemId"]' ).addClass(
					me.getFieldClsValue( subgroupFieldList[ 5 ].contraCreditAccount ) );
				me.addSubgroupPopup.down( 'textfield[itemId="sgContraDrAccDescItemId"]' ).setDisabled(
					me.getFieldBooleanValue( subgroupFieldList[ 6 ].contraDebitAccount ) );
				me.addSubgroupPopup.down( 'textfield[itemId="sgContraDrAccDescItemId"]' ).addClass(
					me.getFieldClsValue( subgroupFieldList[ 6 ].contraDebitAccount ) );
				me.addSubgroupPopup.down( 'textfield[itemId="sgChargeAccountDescItemId"]' ).setDisabled(
					me.getFieldBooleanValue( subgroupFieldList[ 7 ].chargeAccount ) );
				me.addSubgroupPopup.down( 'textfield[itemId="sgChargeAccountDescItemId"]' ).addClass(
					me.getFieldClsValue( subgroupFieldList[ 7 ].chargeAccount ) );
				me.addSubgroupPopup.down( 'checkbox[itemId="sgApportionmentNoPostItemId"]' ).setDisabled(
					me.getFieldBooleanValue( subgroupFieldList[ 8 ].apportionmentNoPost ) );
				me.addSubgroupPopup.down( 'checkbox[itemId="sgApportionmentNoPostItemId"]' ).addClass(
					me.getFieldClsValue( subgroupFieldList[ 8 ].apportionmentNoPost ) );
				//FTGCPBDB-4643
				/*me.addSubgroupPopup.down( 'textfield[itemId="creditLimitItemId"]' ).setDisabled(
					me.getFieldBooleanValue( subgroupFieldList[ 9 ].creditLimit ) );
				me.addSubgroupPopup.down( 'textfield[itemId="creditLimitItemId"]' ).addClass(
					me.getFieldClsValue( subgroupFieldList[ 9 ].creditLimit ) );*/

				if( structureType == NotionalStructureType.Combination )
				{
					switch( structureSubType )
					{
						case '1':
							if( apportionment == 'G' || apportionment == 'P' || apportionment == 'B' )
							{
								me.addSubgroupPopup.down( 'checkbox[itemId="sgApportionmentNoPostItemId"]' )
									.setDisabled( false );
								me.addSubgroupPopup.down( 'checkbox[itemId="sgApportionmentNoPostItemId"]' )
									.removeClass( 'field-disable-cls' );
								me.addSubgroupPopup.down( 'textfield[itemId="sgApportmentCrIntProfileDescItemId"]' )
									.setDisabled( false );
								me.addSubgroupPopup.down( 'textfield[itemId="sgApportmentCrIntProfileDescItemId"]' )
									.removeClass( 'field-disable-cls' );
								me.addSubgroupPopup.down( 'textfield[itemId="sgApportmentCrIntProfileDescItemId"]' )
									.setValue( '' );
								me.addSubgroupPopup.down( 'hidden[itemId="creditApportmentProfileRecKeyItemId"]' )
									.setValue( '' );
								me.addSubgroupPopup.down( 'textfield[itemId="sgApportmentDrIntProfileDescItemId"]' )
									.setDisabled( false );
								me.addSubgroupPopup.down( 'textfield[itemId="sgApportmentDrIntProfileDescItemId"]' )
									.removeClass( 'field-disable-cls' );
								me.addSubgroupPopup.down( 'textfield[itemId="sgApportmentDrIntProfileDescItemId"]' )
									.setValue( '' );
								me.addSubgroupPopup.down( 'hidden[itemId="debitApportmentProfileRecKeyItemId"]' )
									.setValue( '' );
								me.addSubgroupPopup.down( 'textfield[itemId="sgNominatedCrAccDescItemId"]' )
									.setDisabled( false );
								me.addSubgroupPopup.down( 'textfield[itemId="sgNominatedCrAccDescItemId"]' )
									.removeClass( 'field-disable-cls' );
								me.addSubgroupPopup.down( 'textfield[itemId="sgNominatedCrAccDescItemId"]' ).setValue(
									'' );
								me.addSubgroupPopup.down( 'hidden[itemId="nominatedCreditAccIdItemId"]' ).setValue( '' );
								me.addSubgroupPopup.down( 'textfield[itemId="sgNominatedDrAccDescItemId"]' )
									.setDisabled( false );
								me.addSubgroupPopup.down( 'textfield[itemId="sgNominatedDrAccDescItemId"]' )
									.removeClass( 'field-disable-cls' );
								me.addSubgroupPopup.down( 'textfield[itemId="sgNominatedDrAccDescItemId"]' ).setValue(
									'' );
								me.addSubgroupPopup.down( 'hidden[itemId="nominatedDebitAccIdItemId"]' ).setValue( '' );
							}
							break;
						case '2':
							if( apportionment == 'G' || apportionment == 'P' || apportionment == 'B'  )
							{
								me.addSubgroupPopup.down( 'checkbox[itemId="sgApportionmentNoPostItemId"]' )
									.setDisabled( false );
								me.addSubgroupPopup.down( 'checkbox[itemId="sgApportionmentNoPostItemId"]' )
									.removeClass( 'field-disable-cls' );
								me.addSubgroupPopup.down( 'textfield[itemId="sgApportmentCrIntProfileDescItemId"]' )
									.setDisabled( false );
								me.addSubgroupPopup.down( 'textfield[itemId="sgApportmentCrIntProfileDescItemId"]' )
									.removeClass( 'field-disable-cls' );
								me.addSubgroupPopup.down( 'textfield[itemId="sgApportmentCrIntProfileDescItemId"]' )
									.setValue( '' );
								me.addSubgroupPopup.down( 'hidden[itemId="creditApportmentProfileRecKeyItemId"]' )
									.setValue( '' );
								me.addSubgroupPopup.down( 'textfield[itemId="sgApportmentDrIntProfileDescItemId"]' )
									.setDisabled( false );
								me.addSubgroupPopup.down( 'textfield[itemId="sgApportmentDrIntProfileDescItemId"]' )
									.removeClass( 'field-disable-cls' );
								me.addSubgroupPopup.down( 'textfield[itemId="sgApportmentDrIntProfileDescItemId"]' )
									.setValue( '' );
								me.addSubgroupPopup.down( 'hidden[itemId="debitApportmentProfileRecKeyItemId"]' )
									.setValue( '' );
								me.addSubgroupPopup.down( 'textfield[itemId="sgNominatedCrAccDescItemId"]' )
									.setDisabled( false );
								me.addSubgroupPopup.down( 'textfield[itemId="sgNominatedCrAccDescItemId"]' )
									.removeClass( 'field-disable-cls' );
								me.addSubgroupPopup.down( 'textfield[itemId="sgNominatedCrAccDescItemId"]' ).setValue(
									'' );
								me.addSubgroupPopup.down( 'hidden[itemId="nominatedCreditAccIdItemId"]' ).setValue( '' );
								me.addSubgroupPopup.down( 'textfield[itemId="sgNominatedDrAccDescItemId"]' )
									.setDisabled( false );
								me.addSubgroupPopup.down( 'textfield[itemId="sgNominatedDrAccDescItemId"]' )
									.removeClass( 'field-disable-cls' );
								me.addSubgroupPopup.down( 'textfield[itemId="sgNominatedDrAccDescItemId"]' ).setValue(
									'' );
								me.addSubgroupPopup.down( 'hidden[itemId="nominatedDebitAccIdItemId"]' ).setValue( '' );
							}
							break;
						case '4':
							if( apportionment == 'G' || apportionment == 'P' || apportionment == 'B'  )
							{
								me.addSubgroupPopup.down( 'checkbox[itemId="sgApportionmentNoPostItemId"]' )
									.setDisabled( false );
								me.addSubgroupPopup.down( 'checkbox[itemId="sgApportionmentNoPostItemId"]' )
									.removeClass( 'field-disable-cls' );
								me.addSubgroupPopup.down( 'textfield[itemId="sgApportmentCrIntProfileDescItemId"]' )
									.setDisabled( false );
								me.addSubgroupPopup.down( 'textfield[itemId="sgApportmentCrIntProfileDescItemId"]' )
									.removeClass( 'field-disable-cls' );
								me.addSubgroupPopup.down( 'textfield[itemId="sgApportmentCrIntProfileDescItemId"]' )
									.setValue( '' );
								me.addSubgroupPopup.down( 'hidden[itemId="creditApportmentProfileRecKeyItemId"]' )
									.setValue( '' );
								me.addSubgroupPopup.down( 'textfield[itemId="sgNominatedCrAccDescItemId"]' )
									.setDisabled( false );
								me.addSubgroupPopup.down( 'textfield[itemId="sgNominatedCrAccDescItemId"]' )
									.removeClass( 'field-disable-cls' );
								me.addSubgroupPopup.down( 'textfield[itemId="sgNominatedCrAccDescItemId"]' ).setValue(
									'' );
								me.addSubgroupPopup.down( 'hidden[itemId="nominatedCreditAccIdItemId"]' ).setValue( '' );
							}
							break;
						case '3':
							if( apportionment == 'G' || apportionment == 'P' || apportionment == 'B' )
							{
								me.addSubgroupPopup.down( 'checkbox[itemId="sgApportionmentNoPostItemId"]' )
									.setDisabled( false );
								me.addSubgroupPopup.down( 'checkbox[itemId="sgApportionmentNoPostItemId"]' )
									.removeClass( 'field-disable-cls' );
								me.addSubgroupPopup.down( 'textfield[itemId="sgApportmentDrIntProfileDescItemId"]' )
									.setDisabled( false );
								me.addSubgroupPopup.down( 'textfield[itemId="sgApportmentDrIntProfileDescItemId"]' )
									.removeClass( 'field-disable-cls' );
								me.addSubgroupPopup.down( 'textfield[itemId="sgApportmentDrIntProfileDescItemId"]' )
									.setValue( '' );
								me.addSubgroupPopup.down( 'hidden[itemId="debitApportmentProfileRecKeyItemId"]' )
									.setValue( '' );
								me.addSubgroupPopup.down( 'textfield[itemId="sgNominatedDrAccDescItemId"]' )
									.setDisabled( false );
								me.addSubgroupPopup.down( 'textfield[itemId="sgNominatedDrAccDescItemId"]' )
									.removeClass( 'field-disable-cls' );
								me.addSubgroupPopup.down( 'textfield[itemId="sgNominatedDrAccDescItemId"]' ).setValue(
									'' );
								me.addSubgroupPopup.down( 'hidden[itemId="nominatedDebitAccIdItemId"]' ).setValue( '' );
							}
							break;
						case '5':
							break;
					}
				}
			},
			getProfileValue : function( comboValue, nodeType )
			{
				var me = this;

				if( nodeType == 'A' )
				{
					if( comboValue == "P" )
					{
						if( !me.addAccountPopup.down( 'textfield[itemId="creditApportmentProfileDesc"]' ).isDisabled() )
						{
							me.addAccountPopup.down( 'hidden[itemId="creditApportmentProfileRecKey"]' ).setValue(
								me.getFromStore( 1, 'creditInterestProfRecKey' ) );
							me.addAccountPopup.down( 'textfield[itemId="creditApportmentProfileDesc"]' ).setValue(
								me.getFromStore( 1, 'bankCreditInterestProfDesc' ) );
						}
						if( !me.addAccountPopup.down( 'textfield[itemId="debitApportmentProfileDesc"]' ).isDisabled() )
						{
							me.addAccountPopup.down( 'hidden[itemId="debitApportmentProfileRecKey"]' ).setValue(
								me.getFromStore( 1, 'debitInterestProfRecKey' ) );
							me.addAccountPopup.down( 'textfield[itemId="debitApportmentProfileDesc"]' ).setValue(
								me.getFromStore( 1, 'bankDebitInterestProfDesc' ) );
						}
						
						if(!me.addAccountPopup.down( 'textfield[itemId="nominatedCreditAccDesc"]' ).isDisabled())
						{
						me.addAccountPopup.down( 'hidden[itemId="nominatedCreditAccId"]' ).setValue(
									me.addAccountPopup.down( 'hidden[itemId="accountId"]' ).getValue( ));
						me.addAccountPopup.down( 'textfield[itemId="nominatedCreditAccDesc"]' ).setValue(
									me.addAccountPopup.down( 'textfield[itemId="nodeName"]' ).getValue( ));
						}
						
						if(!me.addAccountPopup.down( 'textfield[itemId="nominatedDebitAccDesc"]' ).isDisabled())
						{
						me.addAccountPopup.down( 'hidden[itemId="nominatedDebitAccId"]' ).setValue(
									me.addAccountPopup.down( 'hidden[itemId="accountId"]' ).getValue( ));		
						me.addAccountPopup.down( 'textfield[itemId="nominatedDebitAccDesc"]' ).setValue(
									me.addAccountPopup.down( 'textfield[itemId="nodeName"]' ).getValue( ));
						}

						me.addAccountPopup.down( 'textfield[itemId="creditApportmentProfileDesc"]' ).setReadOnly( true );
						me.addAccountPopup.down( 'textfield[itemId="debitApportmentProfileDesc"]' ).setReadOnly( true );
					}
					else if( comboValue == "G" )
					{
						if( !me.addAccountPopup.down( 'textfield[itemId="creditApportmentProfileDesc"]' ).isDisabled() )
						{
							me.addAccountPopup.down( 'hidden[itemId="creditApportmentProfileRecKey"]' ).setValue(
								me.getFromStore( me.parentRecordId, 'creditApportmentProfileRecKey' ) );
							me.addAccountPopup.down( 'textfield[itemId="creditApportmentProfileDesc"]' ).setValue(
								me.getFromStore( me.parentRecordId, 'creditApportmentProfileDesc' ) );
						}

						if( !me.addAccountPopup.down( 'textfield[itemId="creditApportmentProfileDesc"]' ).isDisabled() )
						{
							me.addAccountPopup.down( 'hidden[itemId="debitApportmentProfileRecKey"]' ).setValue(
								me.getFromStore( me.parentRecordId, 'debitApportmentProfileRecKey' ) );
							me.addAccountPopup.down( 'textfield[itemId="debitApportmentProfileDesc"]' ).setValue(
								me.getFromStore( me.parentRecordId, 'debitApportmentProfileDesc' ) );
						}
						
						if(!me.addAccountPopup.down( 'textfield[itemId="nominatedCreditAccDesc"]' ).isDisabled())
						{
						me.addAccountPopup.down( 'hidden[itemId="nominatedCreditAccId"]' ).setValue(
								me.getFromStore( me.parentRecordId, 'nominatedCreditAccId' ) );
						me.addAccountPopup.down( 'textfield[itemId="nominatedCreditAccDesc"]' ).setValue(
								me.getFromStore( me.parentRecordId, 'nominatedCreditAccDesc' ) );
						}
						
						if(!me.addAccountPopup.down( 'textfield[itemId="nominatedDebitAccDesc"]' ).isDisabled())
						{
						me.addAccountPopup.down( 'hidden[itemId="nominatedDebitAccId"]' ).setValue(
								me.getFromStore( me.parentRecordId, 'nominatedDebitAccId' ) );
						me.addAccountPopup.down( 'textfield[itemId="nominatedDebitAccDesc"]' ).setValue(
								me.getFromStore( me.parentRecordId, 'nominatedDebitAccDesc' ) );
						}

						me.addAccountPopup.down( 'textfield[itemId="creditApportmentProfileDesc"]' ).setReadOnly( true );
						me.addAccountPopup.down( 'textfield[itemId="debitApportmentProfileDesc"]' ).setReadOnly( true );
					}
					else if( comboValue == "A" )
					{
						me.addAccountPopup.down( 'textfield[itemId="creditApportmentProfileDesc"]' )
							.setReadOnly( false );
						me.addAccountPopup.down( 'textfield[itemId="debitApportmentProfileDesc"]' ).setReadOnly( false );
						
						me.addAccountPopup.down( 'hidden[itemId="nominatedCreditAccId"]' ).setValue(
								me.addAccountPopup.down( 'hidden[itemId="accountId"]' ).getValue( ));
						me.addAccountPopup.down( 'textfield[itemId="nominatedCreditAccDesc"]' ).setValue(
								me.addAccountPopup.down( 'textfield[itemId="nodeName"]' ).getValue( ));
								
						me.addAccountPopup.down( 'hidden[itemId="nominatedDebitAccId"]' ).setValue(
								me.addAccountPopup.down( 'hidden[itemId="accountId"]' ).getValue( ));		
						me.addAccountPopup.down( 'textfield[itemId="nominatedDebitAccDesc"]' ).setValue(
								me.addAccountPopup.down( 'textfield[itemId="nodeName"]' ).getValue( ));
					}
					// Not Applicable
					else if(comboValue == "N" ) {
						
						me.addAccountPopup.down( 'hidden[itemId="creditApportmentProfileRecKey"]' )
						.setValue( '' );
					me.addAccountPopup.down( 'textfield[itemId="creditApportmentProfileDesc"]' )
						.setValue( '' );
					
					me.addAccountPopup.down( 'hidden[itemId="debitApportmentProfileRecKey"]' ).setValue(
						'' );
					me.addAccountPopup.down( 'textfield[itemId="debitApportmentProfileDesc"]' )
						.setValue( '' );						

					me.addAccountPopup.down( 'textfield[itemId="debitApportmentProfileDesc"]' )
					.setReadOnly( true );
					me.addAccountPopup.down( 'textfield[itemId="creditApportmentProfileDesc"]' )
					.setReadOnly( true );
					}
				}
				else if( nodeType == 'S' )
				{
					if( comboValue == "P" )
					{
						if( !me.addSubgroupPopup.down( 'textfield[itemId="sgApportmentCrIntProfileDescItemId"]' )
							.isDisabled() )
						{
							me.addSubgroupPopup.down( 'hidden[itemId="creditApportmentProfileRecKeyItemId"]' )
								.setValue( me.getFromStore( 1, 'creditInterestProfRecKey' ) );
							me.addSubgroupPopup.down( 'textfield[itemId="sgApportmentCrIntProfileDescItemId"]' )
								.setValue( me.getFromStore( 1, 'bankCreditInterestProfDesc' ) );
						}

						if( !me.addSubgroupPopup.down( 'textfield[itemId="sgApportmentDrIntProfileDescItemId"]' )
							.isDisabled() )
						{
							me.addSubgroupPopup.down( 'hidden[itemId="debitApportmentProfileRecKeyItemId"]' ).setValue(
								me.getFromStore( 1, 'debitInterestProfRecKey' ) );
							me.addSubgroupPopup.down( 'textfield[itemId="sgApportmentDrIntProfileDescItemId"]' )
								.setValue( me.getFromStore( 1, 'bankDebitInterestProfDesc' ) );
						}

						me.addSubgroupPopup.down( 'textfield[itemId="sgApportmentCrIntProfileDescItemId"]' )
							.setReadOnly( true );
						me.addSubgroupPopup.down( 'textfield[itemId="sgApportmentDrIntProfileDescItemId"]' )
							.setReadOnly( true );

						if( !me.addSubgroupPopup.down( 'textfield[itemId="sgNominatedDrAccDescItemId"]' ).isDisabled() )
						{
							me.addSubgroupPopup.down( 'textfield[itemId="sgNominatedDrAccDescItemId"]' ).setValue(
								me.getFromStore( 1, 'nominatedDebitAccDesc' ) );
							me.addSubgroupPopup.down( 'hidden[itemId="nominatedDebitAccIdItemId"]' ).setValue(
								me.getFromStore( 1, 'nominatedDebitAccId' ) );
						}

						if( !me.addSubgroupPopup.down( 'textfield[itemId="sgNominatedCrAccDescItemId"]' ).isDisabled() )
						{
							me.addSubgroupPopup.down( 'textfield[itemId="sgNominatedCrAccDescItemId"]' ).setValue(
								me.getFromStore( 1, 'nominatedCreditAccDesc' ) );
							me.addSubgroupPopup.down( 'hidden[itemId="nominatedCreditAccIdItemId"]' ).setValue(
								me.getFromStore( 1, 'nominatedCreditAccId' ) );
						}

						if( !me.addSubgroupPopup.down( 'textfield[itemId="sgContraCrAccDescItemId"]' ).isDisabled() )
						{
							me.addSubgroupPopup.down( 'textfield[itemId="sgContraCrAccDescItemId"]' ).setValue(
								me.getFromStore( 1, 'contraCreditAccDesc' ) );
							me.addSubgroupPopup.down( 'hidden[itemId="contraCreditAccIdItemId"]' ).setValue(
								me.getFromStore( 1, 'contraCreditAccId' ) );
						}

						if( !me.addSubgroupPopup.down( 'textfield[itemId="sgContraCrAccDescItemId"]' ).isDisabled() )
						{
							me.addSubgroupPopup.down( 'textfield[itemId="sgContraDrAccDescItemId"]' ).setValue(
								me.getFromStore( 1, 'contraDebitAccDesc' ) );
							me.addSubgroupPopup.down( 'hidden[itemId="contraDebitAccIdItemId"]' ).setValue(
								me.getFromStore( 1, 'contraDebitAccId' ) );
						}

						if( !me.addSubgroupPopup.down( 'textfield[itemId="sgChargeAccountDescItemId"]' ).isDisabled() )
						{
							me.addSubgroupPopup.down( 'textfield[itemId="sgChargeAccountDescItemId"]' ).setValue(
								me.getFromStore( 1, 'chargeAccount' ) );
							me.addSubgroupPopup.down( 'hidden[itemId="chargeAccountIdItemId"]' ).setValue(
								me.getFromStore( 1, 'chargeAccId' ) );
						}

					}
					else if( comboValue == "G" )
					{
						me.addSubgroupPopup.down( 'textfield[itemId="sgApportmentCrIntProfileDescItemId"]' )
							.setReadOnly( false );
						me.addSubgroupPopup.down( 'textfield[itemId="sgApportmentDrIntProfileDescItemId"]' )
							.setReadOnly( false );
					}
				}
			},
			getSubGrpProfileValue : function( comboValue, nodeType, parentRecordId )
			{
				var me = this;

					if( comboValue == "P" )
					{
						if( !me.addSubgroupPopup.down( 'textfield[itemId="sgApportmentCrIntProfileDescItemId"]' )
							.isDisabled() )
						{
							me.addSubgroupPopup.down( 'hidden[itemId="creditApportmentProfileRecKeyItemId"]' )
								.setValue( me.getFromStore( 1, 'creditInterestProfRecKey' ) );
							me.addSubgroupPopup.down( 'textfield[itemId="sgApportmentCrIntProfileDescItemId"]' )
								.setValue( me.getFromStore( 1, 'bankCreditInterestProfDesc' ) );
						}

						if( !me.addSubgroupPopup.down( 'textfield[itemId="sgApportmentDrIntProfileDescItemId"]' )
							.isDisabled() )
						{
							me.addSubgroupPopup.down( 'hidden[itemId="debitApportmentProfileRecKeyItemId"]' ).setValue(
								me.getFromStore( 1, 'debitInterestProfRecKey' ) );
							me.addSubgroupPopup.down( 'textfield[itemId="sgApportmentDrIntProfileDescItemId"]' )
								.setValue( me.getFromStore( 1, 'bankDebitInterestProfDesc' ) );
						}

						me.addSubgroupPopup.down( 'textfield[itemId="sgApportmentCrIntProfileDescItemId"]' )
							.setReadOnly( true );
						me.addSubgroupPopup.down( 'textfield[itemId="sgApportmentDrIntProfileDescItemId"]' )
							.setReadOnly( true );

						if( !me.addSubgroupPopup.down( 'textfield[itemId="sgNominatedDrAccDescItemId"]' ).isDisabled() )
						{
							me.addSubgroupPopup.down( 'textfield[itemId="sgNominatedDrAccDescItemId"]' ).setValue(
								me.getFromStore( 1, 'nominatedDebitAccDesc' ) );
							me.addSubgroupPopup.down( 'hidden[itemId="nominatedDebitAccIdItemId"]' ).setValue(
								me.getFromStore( 1, 'nominatedDebitAccId' ) );
						}

						if( !me.addSubgroupPopup.down( 'textfield[itemId="sgNominatedCrAccDescItemId"]' ).isDisabled() )
						{
							me.addSubgroupPopup.down( 'textfield[itemId="sgNominatedCrAccDescItemId"]' ).setValue(
								me.getFromStore( 1, 'nominatedCreditAccDesc' ) );
							me.addSubgroupPopup.down( 'hidden[itemId="nominatedCreditAccIdItemId"]' ).setValue(
								me.getFromStore( 1, 'nominatedCreditAccId' ) );
						}

						if( !me.addSubgroupPopup.down( 'textfield[itemId="sgContraCrAccDescItemId"]' ).isDisabled() )
						{
							me.addSubgroupPopup.down( 'textfield[itemId="sgContraCrAccDescItemId"]' ).setValue(
								me.getFromStore( 1, 'contraCreditAccDesc' ) );
							me.addSubgroupPopup.down( 'hidden[itemId="contraCreditAccIdItemId"]' ).setValue(
								me.getFromStore( 1, 'contraCreditAccId' ) );
						}

						if( !me.addSubgroupPopup.down( 'textfield[itemId="sgContraCrAccDescItemId"]' ).isDisabled() )
						{
							me.addSubgroupPopup.down( 'textfield[itemId="sgContraDrAccDescItemId"]' ).setValue(
								me.getFromStore( 1, 'contraDebitAccDesc' ) );
							me.addSubgroupPopup.down( 'hidden[itemId="contraDebitAccIdItemId"]' ).setValue(
								me.getFromStore( 1, 'contraDebitAccId' ) );
						}

						if( !me.addSubgroupPopup.down( 'textfield[itemId="sgChargeAccountDescItemId"]' ).isDisabled() )
						{
							me.addSubgroupPopup.down( 'textfield[itemId="sgChargeAccountDescItemId"]' ).setValue(
								me.getFromStore( 1, 'chargeAccount' ) );
							me.addSubgroupPopup.down( 'hidden[itemId="chargeAccountIdItemId"]' ).setValue(
								me.getFromStore( 1, 'chargeAccId' ) );
						}

					}
					else if( comboValue == "G" )
					{
						me.addSubgroupPopup.down( 'textfield[itemId="sgApportmentCrIntProfileDescItemId"]' )
							.setReadOnly( false );
						me.addSubgroupPopup.down( 'textfield[itemId="sgApportmentDrIntProfileDescItemId"]' )
							.setReadOnly( false );
						
						if( !me.addSubgroupPopup.down( 'textfield[itemId="sgNominatedDrAccDescItemId"]' ).isDisabled() )
						{
							me.addSubgroupPopup.down( 'textfield[itemId="sgNominatedDrAccDescItemId"]' ).setValue(
								me.getFromStore( parentRecordId, 'nominatedDebitAccDesc' ) );
							me.addSubgroupPopup.down( 'hidden[itemId="nominatedDebitAccIdItemId"]' ).setValue(
								me.getFromStore( parentRecordId, 'nominatedDebitAccId' ) );
					}

						if( !me.addSubgroupPopup.down( 'textfield[itemId="sgNominatedCrAccDescItemId"]' ).isDisabled() )
						{
							me.addSubgroupPopup.down( 'textfield[itemId="sgNominatedCrAccDescItemId"]' ).setValue(
								me.getFromStore( parentRecordId, 'nominatedCreditAccDesc' ) );
							me.addSubgroupPopup.down( 'hidden[itemId="nominatedCreditAccIdItemId"]' ).setValue(
								me.getFromStore( parentRecordId, 'nominatedCreditAccId' ) );
						}
					}
					// Inherit from Parent Subgroup
					else if( comboValue == "B" )
					{
						if( !me.addSubgroupPopup.down( 'textfield[itemId="sgApportmentCrIntProfileDescItemId"]' )
							.isDisabled() )
						{
							me.addSubgroupPopup.down( 'hidden[itemId="creditApportmentProfileRecKeyItemId"]' )
								.setValue( me.getFromStore( parentRecordId, 'creditApportmentProfileRecKey' ) );
							me.addSubgroupPopup.down( 'textfield[itemId="sgApportmentCrIntProfileDescItemId"]' )
								.setValue( me.getFromStore( parentRecordId, 'creditApportmentProfileDesc' ) );
						}

						if( !me.addSubgroupPopup.down( 'textfield[itemId="sgApportmentDrIntProfileDescItemId"]' )
							.isDisabled() )
						{
							me.addSubgroupPopup.down( 'hidden[itemId="debitApportmentProfileRecKeyItemId"]' ).setValue(
								me.getFromStore( parentRecordId, 'debitApportmentProfileRecKey' ) );
							me.addSubgroupPopup.down( 'textfield[itemId="sgApportmentDrIntProfileDescItemId"]' )
								.setValue( me.getFromStore( parentRecordId, 'debitApportmentProfileDesc' ) );
						}

						me.addSubgroupPopup.down( 'textfield[itemId="sgApportmentCrIntProfileDescItemId"]' )
							.setReadOnly( true );
						me.addSubgroupPopup.down( 'textfield[itemId="sgApportmentDrIntProfileDescItemId"]' )
							.setReadOnly( true );

						if( !me.addSubgroupPopup.down( 'textfield[itemId="sgNominatedDrAccDescItemId"]' ).isDisabled() )
						{
							me.addSubgroupPopup.down( 'textfield[itemId="sgNominatedDrAccDescItemId"]' ).setValue(
								me.getFromStore( parentRecordId, 'nominatedDebitAccDesc' ) );
							me.addSubgroupPopup.down( 'hidden[itemId="nominatedDebitAccIdItemId"]' ).setValue(
								me.getFromStore( parentRecordId, 'nominatedDebitAccId' ) );
						}

						if( !me.addSubgroupPopup.down( 'textfield[itemId="sgNominatedCrAccDescItemId"]' ).isDisabled() )
						{
							me.addSubgroupPopup.down( 'textfield[itemId="sgNominatedCrAccDescItemId"]' ).setValue(
								me.getFromStore( parentRecordId, 'nominatedCreditAccDesc' ) );
							me.addSubgroupPopup.down( 'hidden[itemId="nominatedCreditAccIdItemId"]' ).setValue(
								me.getFromStore( parentRecordId, 'nominatedCreditAccId' ) );
						}

						if( !me.addSubgroupPopup.down( 'textfield[itemId="sgContraCrAccDescItemId"]' ).isDisabled() )
						{
							me.addSubgroupPopup.down( 'textfield[itemId="sgContraCrAccDescItemId"]' ).setValue(
								me.getFromStore( parentRecordId, 'contraCreditAccDesc' ) );
							me.addSubgroupPopup.down( 'hidden[itemId="contraCreditAccIdItemId"]' ).setValue(
								me.getFromStore( parentRecordId, 'contraCreditAccId' ) );
						}

						if( !me.addSubgroupPopup.down( 'textfield[itemId="sgContraCrAccDescItemId"]' ).isDisabled() )
						{
							me.addSubgroupPopup.down( 'textfield[itemId="sgContraDrAccDescItemId"]' ).setValue(
								me.getFromStore( parentRecordId, 'contraDebitAccDesc' ) );
							me.addSubgroupPopup.down( 'hidden[itemId="contraDebitAccIdItemId"]' ).setValue(
								me.getFromStore( parentRecordId, 'contraDebitAccId' ) );
						}

						if( !me.addSubgroupPopup.down( 'textfield[itemId="sgChargeAccountDescItemId"]' ).isDisabled() )
						{
							me.addSubgroupPopup.down( 'textfield[itemId="sgChargeAccountDescItemId"]' ).setValue(
								me.getFromStore( parentRecordId, 'chargeAccount' ) );
							me.addSubgroupPopup.down( 'hidden[itemId="chargeAccountIdItemId"]' ).setValue(
								me.getFromStore( parentRecordId, 'chargeAccId' ) );
						}
				}
					// Set to Not Applicable
					else if ( comboValue == "N") {
						
								me.addSubgroupPopup.down( 'hidden[itemId="creditApportmentProfileRecKeyItemId"]' )
									.setValue( '' );
								me.addSubgroupPopup.down( 'textfield[itemId="sgApportmentCrIntProfileDescItemId"]' )
									.setValue( '' );
								
								me.addSubgroupPopup.down( 'hidden[itemId="debitApportmentProfileRecKeyItemId"]' ).setValue(
									'' );
								me.addSubgroupPopup.down( 'textfield[itemId="sgApportmentDrIntProfileDescItemId"]' )
									.setValue( '' );						

							me.addSubgroupPopup.down( 'textfield[itemId="sgApportmentCrIntProfileDescItemId"]' )
								.setReadOnly( true );
							me.addSubgroupPopup.down( 'textfield[itemId="sgApportmentDrIntProfileDescItemId"]' )
								.setReadOnly( true );
						
					}
			},
			enableDisableAccountFieldList : function()
			{
				var me = this;
				var apportionment = me.addAccountPopup.down( 'textfield[itemId="apportionment"]' ).getValue();

				me.addAccountPopup.down( 'textfield[itemId="apportionment"]' ).setDisabled(
					me.getFieldBooleanValue( accountFieldList[ 0 ].apportionment ) );
				me.addAccountPopup.down( 'textfield[itemId="apportionment"]' ).addClass(
					me.getFieldClsValue( accountFieldList[ 0 ].apportionment ) );
				me.addAccountPopup.down( 'textfield[itemId="bankDebitInterestProfDesc"]' ).setDisabled(
					me.getFieldBooleanValue( accountFieldList[ 1 ].bankDebitInterestProfDesc ) );
				me.addAccountPopup.down( 'textfield[itemId="bankDebitInterestProfDesc"]' ).addClass(
					me.getFieldClsValue( accountFieldList[ 1 ].bankDebitInterestProfDesc ) );
				me.addAccountPopup.down( 'textfield[itemId="bankCreditInterestProfDesc"]' ).setDisabled(
					me.getFieldBooleanValue( accountFieldList[ 2 ].bankCreditInterestProfDesc ) );
				me.addAccountPopup.down( 'textfield[itemId="bankCreditInterestProfDesc"]' ).addClass(
					me.getFieldClsValue( accountFieldList[ 2 ].bankCreditInterestProfDesc ) );
				me.addAccountPopup.down( 'textfield[itemId="debitApportmentProfileDesc"]' ).setDisabled(
					me.getFieldBooleanValue( accountFieldList[ 3 ].debitApportmentProfileDesc ) );
				me.addAccountPopup.down( 'textfield[itemId="debitApportmentProfileDesc"]' ).addClass(
					me.getFieldClsValue( accountFieldList[ 3 ].debitApportmentProfileDesc ) );
				me.addAccountPopup.down( 'textfield[itemId="creditApportmentProfileDesc"]' ).setDisabled(
					me.getFieldBooleanValue( accountFieldList[ 4 ].creditApportmentProfileDesc ) );
				me.addAccountPopup.down( 'textfield[itemId="creditApportmentProfileDesc"]' ).addClass(
					me.getFieldClsValue( accountFieldList[ 4 ].creditApportmentProfileDesc ) );
				me.addAccountPopup.down( 'textfield[itemId="nominatedCreditAccDesc"]' ).setDisabled(
					me.getFieldBooleanValue( accountFieldList[ 5 ].nominatedCreditAccDesc ) );
				me.addAccountPopup.down( 'textfield[itemId="nominatedCreditAccDesc"]' ).addClass(
					me.getFieldClsValue( accountFieldList[ 5 ].nominatedCreditAccDesc ) );
				me.addAccountPopup.down( 'textfield[itemId="nominatedDebitAccDesc"]' ).setDisabled(
					me.getFieldBooleanValue( accountFieldList[ 6 ].nominatedDebitAccDesc ) );
				me.addAccountPopup.down( 'textfield[itemId="nominatedDebitAccDesc"]' ).addClass(
					me.getFieldClsValue( accountFieldList[ 6 ].nominatedDebitAccDesc ) );
				me.addAccountPopup.down( 'checkbox[itemId="apportionmentNoPostItemId"]' ).setDisabled(
					me.getFieldBooleanValue( accountFieldList[ 7 ].apportionmentNoPost ) );
				me.addAccountPopup.down( 'checkbox[itemId="apportionmentNoPostItemId"]' ).addClass(
					me.getFieldClsValue( accountFieldList[ 7 ].apportionmentNoPost ) );

				if( structureType == NotionalStructureType.Combination )
				{
					switch( structureSubType )
					{
						case '1':
							if( apportionment == 'G' || apportionment == 'P' || apportionment == 'A' )
							{
								me.addAccountPopup.down( 'checkbox[itemId="apportionmentNoPostItemId"]' ).setDisabled(
									false );
								me.addAccountPopup.down( 'checkbox[itemId="apportionmentNoPostItemId"]' ).removeClass(
									'field-disable-cls' );
								me.addAccountPopup.down( 'textfield[itemId="debitApportmentProfileDesc"]' )
									.setDisabled( false );
								me.addAccountPopup.down( 'textfield[itemId="debitApportmentProfileDesc"]' )
									.removeClass( 'field-disable-cls' );
								me.addAccountPopup.down( 'textfield[itemId="debitApportmentProfileDesc"]' ).setValue(
									'' );
								me.addAccountPopup.down( 'hidden[itemId="debitApportmentProfileRecKey"]' )
									.setValue( '' );
								me.addAccountPopup.down( 'textfield[itemId="creditApportmentProfileDesc"]' )
									.setDisabled( false );
								me.addAccountPopup.down( 'textfield[itemId="creditApportmentProfileDesc"]' )
									.removeClass( 'field-disable-cls' );
								me.addAccountPopup.down( 'textfield[itemId="creditApportmentProfileDesc"]' ).setValue(
									'' );
								me.addAccountPopup.down( 'hidden[itemId="creditApportmentProfileRecKey"]' ).setValue(
									'' );
								me.addAccountPopup.down( 'textfield[itemId="nominatedCreditAccDesc"]' ).setDisabled(
									false );
								me.addAccountPopup.down( 'textfield[itemId="nominatedCreditAccDesc"]' ).removeClass(
									'field-disable-cls' );
								me.addAccountPopup.down( 'textfield[itemId="nominatedCreditAccDesc"]' ).setValue( '' );
								me.addAccountPopup.down( 'hidden[itemId="nominatedCreditAccId"]' ).setValue( '' );
								me.addAccountPopup.down( 'textfield[itemId="nominatedDebitAccDesc"]' ).setDisabled(
									false );
								me.addAccountPopup.down( 'textfield[itemId="nominatedDebitAccDesc"]' ).removeClass(
									'field-disable-cls' );
								me.addAccountPopup.down( 'textfield[itemId="nominatedDebitAccDesc"]' ).setValue( '' );
								me.addAccountPopup.down( 'hidden[itemId="nominatedDebitAccId"]' ).setValue( '' );
							}
								me.addAccountPopup.down( 'textfield[itemId="bankDebitInterestProfDesc"]' ).setDisabled(true);
								me.addAccountPopup.down( 'textfield[itemId="bankDebitInterestProfDesc"]' ).addClass('field-disable-cls');
								me.addAccountPopup.down( 'textfield[itemId="bankCreditInterestProfDesc"]' ).setDisabled(true);
								me.addAccountPopup.down( 'textfield[itemId="bankCreditInterestProfDesc"]' ).addClass('field-disable-cls');
							break;
						case '2':
							if( apportionment == 'G' || apportionment == 'P' || apportionment == 'A' )
							{
								me.addAccountPopup.down( 'checkbox[itemId="apportionmentNoPostItemId"]' ).setDisabled(
									false );
								me.addAccountPopup.down( 'checkbox[itemId="apportionmentNoPostItemId"]' ).removeClass(
									'field-disable-cls' );
								me.addAccountPopup.down( 'textfield[itemId="debitApportmentProfileDesc"]' )
									.setDisabled( false );
								me.addAccountPopup.down( 'textfield[itemId="debitApportmentProfileDesc"]' )
									.removeClass( 'field-disable-cls' );
								me.addAccountPopup.down( 'textfield[itemId="debitApportmentProfileDesc"]' ).setValue(
									'' );
								me.addAccountPopup.down( 'hidden[itemId="debitApportmentProfileRecKey"]' )
									.setValue( '' );
								me.addAccountPopup.down( 'textfield[itemId="creditApportmentProfileDesc"]' )
									.setDisabled( false );
								me.addAccountPopup.down( 'textfield[itemId="creditApportmentProfileDesc"]' )
									.removeClass( 'field-disable-cls' );
								me.addAccountPopup.down( 'textfield[itemId="creditApportmentProfileDesc"]' ).setValue(
									'' );
								me.addAccountPopup.down( 'hidden[itemId="creditApportmentProfileRecKey"]' ).setValue(
									'' );
								me.addAccountPopup.down( 'textfield[itemId="nominatedCreditAccDesc"]' ).setDisabled(
									false );
								me.addAccountPopup.down( 'textfield[itemId="nominatedCreditAccDesc"]' ).removeClass(
									'field-disable-cls' );
								me.addAccountPopup.down( 'textfield[itemId="nominatedCreditAccDesc"]' ).setValue( '' );
								me.addAccountPopup.down( 'hidden[itemId="nominatedCreditAccId"]' ).setValue( '' );
								me.addAccountPopup.down( 'textfield[itemId="nominatedDebitAccDesc"]' ).setDisabled(
									false );
								me.addAccountPopup.down( 'textfield[itemId="nominatedDebitAccDesc"]' ).removeClass(
									'field-disable-cls' );
								me.addAccountPopup.down( 'textfield[itemId="nominatedDebitAccDesc"]' ).setValue( '' );
								me.addAccountPopup.down( 'hidden[itemId="nominatedDebitAccId"]' ).setValue( '' );
							}
							break;
						case '4':
							if( apportionment == 'G' || apportionment == 'P' || apportionment == 'A' )
							{
								me.addAccountPopup.down( 'checkbox[itemId="apportionmentNoPostItemId"]' ).setDisabled(
									false );
								me.addAccountPopup.down( 'checkbox[itemId="apportionmentNoPostItemId"]' ).removeClass(
									'field-disable-cls' );
								me.addAccountPopup.down( 'textfield[itemId="creditApportmentProfileDesc"]' )
									.setDisabled( false );
								me.addAccountPopup.down( 'textfield[itemId="creditApportmentProfileDesc"]' )
									.removeClass( 'field-disable-cls' );
								me.addAccountPopup.down( 'textfield[itemId="creditApportmentProfileDesc"]' ).setValue(
									'' );
								me.addAccountPopup.down( 'hidden[itemId="creditApportmentProfileRecKey"]' ).setValue(
									'' );
								me.addAccountPopup.down( 'textfield[itemId="nominatedCreditAccDesc"]' ).setDisabled(
									false );
								me.addAccountPopup.down( 'textfield[itemId="nominatedCreditAccDesc"]' ).removeClass(
									'field-disable-cls' );
								me.addAccountPopup.down( 'textfield[itemId="nominatedCreditAccDesc"]' ).setValue( '' );
								me.addAccountPopup.down( 'hidden[itemId="nominatedCreditAccId"]' ).setValue( '' );
							}
							break;
						case '3':
							if( apportionment == 'G' || apportionment == 'P' || apportionment == 'A' )
							{
								me.addAccountPopup.down( 'checkbox[itemId="apportionmentNoPostItemId"]' ).setDisabled(
									false );
								me.addAccountPopup.down( 'checkbox[itemId="apportionmentNoPostItemId"]' ).removeClass(
									'field-disable-cls' );
								me.addAccountPopup.down( 'textfield[itemId="debitApportmentProfileDesc"]' )
									.setDisabled( false );
								me.addAccountPopup.down( 'textfield[itemId="debitApportmentProfileDesc"]' )
									.removeClass( 'field-disable-cls' );
								me.addAccountPopup.down( 'textfield[itemId="debitApportmentProfileDesc"]' ).setValue(
									'' );
								me.addAccountPopup.down( 'hidden[itemId="debitApportmentProfileRecKey"]' )
									.setValue( '' );
								me.addAccountPopup.down( 'textfield[itemId="nominatedDebitAccDesc"]' ).setDisabled(
									false );
								me.addAccountPopup.down( 'textfield[itemId="nominatedDebitAccDesc"]' ).removeClass(
									'field-disable-cls' );
								me.addAccountPopup.down( 'textfield[itemId="nominatedDebitAccDesc"]' ).setValue( '' );
								me.addAccountPopup.down( 'hidden[itemId="nominatedDebitAccId"]' ).setValue( '' );
							}
							break;
						case '5':
							break;
					}
				}
			},
			addAccountNode : function()
			{
				var me = this;
				if( !Ext.isEmpty( me.addAccountPopup ) )
				{
					me.addAccountPopup.destroy();
				}
				me.addAccountPopup = Ext.create( 'GCP.view.AgreementNotionalDtlAddAccountView',
				{
					parent : 'agreementNotionalDtlViewType',
					itemId : 'addAccountPopupId'
				} );
				me.setAccountInterstProfileParameter();
				me.parentRecordId = me.prev_record.get( 'nodeId' );

				me.addAccountPopup.down( 'button[itemId="btnSave"]' ).show();
				me.addAccountPopup.down( 'button[itemId="btnUpdate"]' ).hide();
				me.addAccountPopup.down( 'label[itemId="errorLabel"]' ).setText( '' );
				me.addAccountPopup.down( 'label[itemId="accountParentNodeItemId"]' ).setText(
					getLabel('parentNode','Parent Node : ') + me.prev_record.get( 'nodeName' ) );
				// following store for Apportionment combobox on Account popup.
				// this store will be set when subgroup( where account will be inserted) level apportionment is set to "Not applicable".
				if( me.prev_record.data.apportionment == 'N' || me.prev_record.data.nodeType == 'P')
				{
					me.addAccountPopup.down( 'combobox[itemId="apportionment"]' ).store = me.apportionmentNotApplicableStore;
				}
				me.enableDisableAccountFieldList();
				me.addAccountPopup.show();
			},
			setAccountInterstProfileParameter : function()
			{
				var me = this;
				var objAutocompleter = me.addAccountPopup.down( 'AutoCompleter[itemId="bankCreditInterestProfDesc"]' );
				objAutocompleter.cfgExtraParams =
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
						value : structureType
					},
					{
						key : '$filtercode3',
						value : me.prev_record.data.nodeCurrency
					},
					{
						key : '$filtercode4',
						value : me.getFromStore( 1, 'creditInterestProfRecKey' )
					}
				];
				var objAutocompleter = me.addAccountPopup.down( 'AutoCompleter[itemId="creditApportmentProfileDesc"]' );
				objAutocompleter.cfgExtraParams =
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
						value : me.prev_record.data.nodeCurrency
					},
					{
						key : '$filtercode4',
						value : me.prev_record.data.nodeCurrency
					}
				];
				var objAutocompleter = me.addAccountPopup.down( 'AutoCompleter[itemId="bankDebitInterestProfDesc"]' );
				objAutocompleter.cfgExtraParams =
				[
					{
						key : '$sellerCode',
						value : sellerCode
					},
					{
						key : '$filtercode1',
						value : 'D'
					},
					{
						key : '$filtercode2',
						value : structureType
					},
					{
						key : '$filtercode3',
						value : me.prev_record.data.nodeCurrency
					},
					{
						key : '$filtercode4',
						value : me.getFromStore( 1, 'debitInterestProfRecKey' )
					}
				];
				var objAutocompleter = me.addAccountPopup.down( 'AutoCompleter[itemId="debitApportmentProfileDesc"]' );
				objAutocompleter.cfgExtraParams =
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
						value : me.prev_record.data.nodeCurrency
					},
					{
						key : '$filtercode4',
						value : me.prev_record.data.nodeCurrency
					}
				];
			},
			enableDisablePoolField : function()
			{
				var me = this;
				var debitPrfDisbaled = false;
				var creditPrfDisbaled = false;
				me.addPoolPopup.down( 'textfield[itemId="chargeAccountName"]' ).setDisabled(
					me.getFieldBooleanValue( poolFieldList[ 0 ].chargeAccount ) );
				me.addPoolPopup.down( 'textfield[itemId="chargeAccountName"]' ).addClass(
					me.getFieldClsValue( poolFieldList[ 0 ].chargeAccount ) );
				if(structureType == 'CB' && structureSubType == '3'){
					creditPrfDisbaled = 'true';
				}
				me.addPoolPopup.down( 'textfield[itemId="creditInterestProfDesc"]' ).setDisabled(
					me.getFieldBooleanValue( creditPrfDisbaled ) );
				me.addPoolPopup.down( 'textfield[itemId="creditInterestProfDesc"]' ).addClass(
					me.getFieldClsValue( creditPrfDisbaled ) );
				if(structureType == 'CB' && structureSubType == '4'){
					debitPrfDisbaled = 'true';
				}
				me.addPoolPopup.down( 'textfield[itemId="debitInterestProfDesc"]' ).setDisabled(
					me.getFieldBooleanValue( debitPrfDisbaled ) );
				me.addPoolPopup.down( 'textfield[itemId="debitInterestProfDesc"]' ).addClass(
					me.getFieldClsValue( debitPrfDisbaled ) );
				me.addPoolPopup.down( 'textfield[itemId="nominatedCreditAccDesc"]' ).setDisabled(
					me.getFieldBooleanValue( poolFieldList[ 3 ].nominatedCreditAccount ) );
				me.addPoolPopup.down( 'textfield[itemId="nominatedCreditAccDesc"]' ).addClass(
					me.getFieldClsValue( poolFieldList[ 3 ].nominatedCreditAccount ) );
				me.addPoolPopup.down( 'textfield[itemId="nominatedDebitAccDesc"]' ).setDisabled(
					me.getFieldBooleanValue( poolFieldList[ 4 ].nominatedDebitAccount ) );
				me.addPoolPopup.down( 'textfield[itemId="nominatedDebitAccDesc"]' ).addClass(
					me.getFieldClsValue( poolFieldList[ 4 ].nominatedDebitAccount ) );
				me.addPoolPopup.down( 'textfield[itemId="contraCreditAccDesc"]' ).setDisabled(
					me.getFieldBooleanValue( poolFieldList[ 5 ].contraCreditAccount ) );
				me.addPoolPopup.down( 'textfield[itemId="contraCreditAccDesc"]' ).addClass(
					me.getFieldClsValue( poolFieldList[ 5 ].contraCreditAccount ) );
				me.addPoolPopup.down( 'textfield[itemId="contraDebitAccDesc"]' ).setDisabled(
					me.getFieldBooleanValue( poolFieldList[ 6 ].contraDebitAccount ) );
				me.addPoolPopup.down( 'textfield[itemId="contraDebitAccDesc"]' ).addClass(
					me.getFieldClsValue( poolFieldList[ 6 ].contraDebitAccount ) );
				//FTGCPBDB-4643
				/*me.addPoolPopup.down( 'textfield[itemId="creditLimit"]' ).setDisabled(
					me.getFieldBooleanValue( poolFieldList[ 7 ].creditLimit ) );
				me.addPoolPopup.down( 'textfield[itemId="creditLimit"]' ).addClass(
					me.getFieldClsValue( poolFieldList[ 7 ].creditLimit ) );*/
			},
			getFieldBooleanValue : function( value )
			{
				if( value == 'true' )
					return true;
				else
					return false;
			},
			getFieldClsValue : function( value )
			{
				if( value == 'true' )
					return 'field-disable-cls';
				else
					return '';
			},
			updateAccountDetails : function()
			{
				var me = this;
				var mandatoryFieldsArray = new Array();
				var validateFieldsArray = new Array();
				var i = 0;

				var objapportionmentNoPost =
				{
					'0' : getLabel( "lblNoApplicable", "No Applicable" ),
					'1' : getLabel( "lblApplicable", "Applicable" ),
					'2' : getLabel( "lblApplicablePost", "Applicable with No post" )
				}

				var objapportionment =
				{
					'N' : getLabel( "lblNoApplicable", "Not Applicable" ),
					'P' : getLabel( "lblInheritFromPool", "Inherit from Group" ),
					'A' : getLabel( "lblSpecifyNode", "Specify at this Node" ),
					'G' : getLabel( "lblInheritFromSubgroup", "Inherit from Parent Subgroup" )
				}

				var nodeName = me.addAccountPopup.down( 'textfield[itemId="nodeName"]' );
				var bankCreditInterestProfDesc = me.addAccountPopup
					.down( 'textfield[itemId="bankCreditInterestProfDesc"]' );
				var creditApportmentProfileDesc = me.addAccountPopup
					.down( 'textfield[itemId="creditApportmentProfileDesc"]' );
				var nominatedCreditAccDesc = me.addAccountPopup.down( 'textfield[itemId="nominatedCreditAccDesc"]' );
				var bankDebitInterestProfDesc = me.addAccountPopup
					.down( 'textfield[itemId="bankDebitInterestProfDesc"]' );
				var debitApportmentProfileDesc = me.addAccountPopup
					.down( 'textfield[itemId="debitApportmentProfileDesc"]' );
				var nominatedDebitAccDesc = me.addAccountPopup.down( 'textfield[itemId="nominatedDebitAccDesc"]' );
				var apportionment = me.addAccountPopup.down( 'combobox[itemId="apportionment"]' ).getValue();
				var allocationRatio = me.addAccountPopup.down( 'textfield[itemId="allocationRatio"]' );
				
				mandatoryFieldsArray[ i++ ] = nodeName;
				if(autoGenBnkInstProfFlag!='Y' && (!Ext.isEmpty(structureType) && 'CB' !== structureType))
				{
					mandatoryFieldsArray[ i++ ] = bankCreditInterestProfDesc;
					mandatoryFieldsArray[ i++ ] = bankDebitInterestProfDesc;
				}
				mandatoryFieldsArray[ i++ ] = creditApportmentProfileDesc;
				mandatoryFieldsArray[ i++ ] = nominatedCreditAccDesc;
				mandatoryFieldsArray[ i++ ] = debitApportmentProfileDesc;
				mandatoryFieldsArray[ i++ ] = nominatedDebitAccDesc;

				if( me.checkMandatoryFields( mandatoryFieldsArray, me.addAccountPopup
					.down( 'label[itemId="errorLabel"]' ) ) )
				{
					return false;
				}

				var creditInterestProfRecKey = me.addAccountPopup.down( 'hidden[itemId="creditInterestProfRecKey"]' );
				var creditApportmentProfileRecKey = me.addAccountPopup
					.down( 'hidden[itemId="creditApportmentProfileRecKey"]' );
				var nominatedCreditAccId = me.addAccountPopup.down( 'hidden[itemId="nominatedCreditAccId"]' );
				var debitInterestProfRecKey = me.addAccountPopup.down( 'hidden[itemId="debitInterestProfRecKey"]' )
				var debitApportmentProfileRecKey = me.addAccountPopup
					.down( 'hidden[itemId="debitApportmentProfileRecKey"]' );
				var nominatedDebitAccId = me.addAccountPopup.down( 'hidden[itemId="nominatedDebitAccId"]' );
				i = 0;
				validateFieldsArray[ i++ ] = nodeName;
				if(autoGenBnkInstProfFlag!='Y' && (!Ext.isEmpty(structureType) && 'CB' !== structureType))
				{
					validateFieldsArray[ i++ ] = creditInterestProfRecKey;
					validateFieldsArray[ i++ ] = debitInterestProfRecKey;
				}
				validateFieldsArray[ i++ ] = creditApportmentProfileRecKey;
				validateFieldsArray[ i++ ] = nominatedCreditAccId;
				validateFieldsArray[ i++ ] = debitApportmentProfileRecKey;
				validateFieldsArray[ i++ ] = nominatedDebitAccId;

				if( me.validateMandatoryFields( mandatoryFieldsArray, validateFieldsArray, me.addAccountPopup
					.down( 'label[itemId="errorLabel"]' ) ) )
				{
					return false;
				}

				me.prev_record.set( 'apportionmentDesc', objapportionment[ apportionment ] );
				me.prev_record.set( 'apportionment', apportionment );
				me.prev_record.set( 'creditInterestProfRecKey', creditInterestProfRecKey.getValue() );
				me.prev_record.set( 'creditApportmentProfileRecKey', creditApportmentProfileRecKey.getValue() );
				me.prev_record.set( 'nominatedCreditAccId', nominatedCreditAccId.getValue() );
				me.prev_record.set( 'debitInterestProfRecKey', debitInterestProfRecKey.getValue() );
				me.prev_record.set( 'debitApportmentProfileRecKey', debitApportmentProfileRecKey.getValue() );
				me.prev_record.set( 'nominatedDebitAccId', nominatedDebitAccId.getValue() );
				me.prev_record.set( 'bankCreditInterestProfDesc', bankCreditInterestProfDesc.getValue() );
				me.prev_record.set( 'creditApportmentProfileDesc', creditApportmentProfileDesc.getValue() );
				me.prev_record.set( 'nominatedCreditAccDesc', nominatedCreditAccDesc.getValue() );
				me.prev_record.set( 'bankDebitInterestProfDesc', bankDebitInterestProfDesc.getValue() );
				me.prev_record.set( 'debitApportmentProfileDesc', debitApportmentProfileDesc.getValue() );
				me.prev_record.set( 'nominatedDebitAccDesc', nominatedDebitAccDesc.getValue() );
				me.prev_record.set( 'allocationRatio', allocationRatio.getValue() );
				
				var apportionmentNoPost = me.addAccountPopup.down( 'checkbox[itemId="apportionmentNoPostItemId"]' );
				var apportionmentNoPostDesc;
				if( apportionmentNoPost.isDisabled() )
				{
					apportionmentNoPost = 0;
					apportionmentNoPostDesc = objapportionmentNoPost[ apportionmentNoPost ];
				}
				else
				{
					if( apportionmentNoPost.getValue() == true )
					{
						apportionmentNoPost = 2;
						apportionmentNoPostDesc = objapportionmentNoPost[ apportionmentNoPost ];
					}
					else
					{
						apportionmentNoPost = 1;
						apportionmentNoPostDesc = objapportionmentNoPost[ apportionmentNoPost ];
					}
				}
				me.prev_record.set( 'apportionmentType', apportionmentNoPost );
				me.prev_record.set( 'apportionmentTypeDesc', apportionmentNoPostDesc );

				me.addAccountPopup.close();
			},

			updatePoolAccountDetails : function()
			{
				var me = this;
				var mandatoryFieldsArray = new Array();
				var validateFieldsArray = new Array();
				var i = 0;

				var nodeName = me.addPoolPopup.down( 'textfield[itemId="nodeName"]' );
				var nodeDescription = me.addPoolPopup.down( 'textfield[itemId="nodeDescription"]' );
				var chargeAccountName = me.addPoolPopup.down( 'textfield[itemId="chargeAccountName"]' );
				var creditInterestProfDesc = me.addPoolPopup.down( 'textfield[itemId="creditInterestProfDesc"]' );
				var contraCreditAccDesc = me.addPoolPopup.down( 'textfield[itemId="contraCreditAccDesc"]' );
				var nominatedCreditAccDesc = me.addPoolPopup.down( 'textfield[itemId="nominatedCreditAccDesc"]' );
				var debitInterestProfDesc = me.addPoolPopup.down( 'textfield[itemId="debitInterestProfDesc"]' );
				var contraDebitAccDesc = me.addPoolPopup.down( 'textfield[itemId="contraDebitAccDesc"]' );
				var nominatedDebitAccDesc = me.addPoolPopup.down( 'textfield[itemId="nominatedDebitAccDesc"]' );
				//var creditLimit = me.addPoolPopup.down( 'textfield[itemId="creditLimit"]' );//FTGCPBDB-4643

				mandatoryFieldsArray[ i++ ] = nodeName;
				mandatoryFieldsArray[ i++ ] = nodeDescription;
				mandatoryFieldsArray[ i++ ] = chargeAccountName;
				if(autoGenBnkInstProfFlag!='Y')
				{
					mandatoryFieldsArray[ i++ ] = creditInterestProfDesc;
					if(structureType != 'CB' && structureSubType != '4'){
						mandatoryFieldsArray[ i++ ] = debitInterestProfDesc;
					}
				}
				mandatoryFieldsArray[ i++ ] = contraCreditAccDesc;
				mandatoryFieldsArray[ i++ ] = nominatedCreditAccDesc;
				mandatoryFieldsArray[ i++ ] = contraDebitAccDesc;
				mandatoryFieldsArray[ i++ ] = nominatedDebitAccDesc;

				if( me
					.checkMandatoryFields( mandatoryFieldsArray, me.addPoolPopup.down( 'label[itemId="errorLabel"]' ) ) )
				{
					return false;
				}

				var creditInterestProfRecKey = me.addPoolPopup.down( 'hidden[itemId="creditInterestProfRecKey"]' );
				var debitInterestProfRecKey = me.addPoolPopup.down( 'hidden[itemId="debitInterestProfRecKey"]' );
				var nominatedCreditAccId = me.addPoolPopup.down( 'hidden[itemId="nominatedCreditAccId"]' );
				var nominatedDebitAccId = me.addPoolPopup.down( 'hidden[itemId="nominatedDebitAccId"]' );
				var contraDebitAccId = me.addPoolPopup.down( 'hidden[itemId="contraDebitAccId"]' );
				var contraCreditAccId = me.addPoolPopup.down( 'hidden[itemId="contraCreditAccId"]' )
				var chargeAccId = me.addPoolPopup.down( 'hidden[itemId="chargeAccountId"]' );

				i = 0;
				validateFieldsArray[ i++ ] = nodeName;
				validateFieldsArray[ i++ ] = nodeDescription;
				validateFieldsArray[ i++ ] = chargeAccId;
				if(autoGenBnkInstProfFlag!='Y')
				{
					validateFieldsArray[ i++ ] = creditInterestProfRecKey;
					validateFieldsArray[ i++ ] = debitInterestProfRecKey;
				}
				validateFieldsArray[ i++ ] = contraCreditAccId;
				validateFieldsArray[ i++ ] = nominatedCreditAccId;
				validateFieldsArray[ i++ ] = contraDebitAccId;
				validateFieldsArray[ i++ ] = nominatedDebitAccId;

				if( me.validateMandatoryFields( mandatoryFieldsArray, validateFieldsArray, me.addPoolPopup
					.down( 'label[itemId="errorLabel"]' ) ) )
				{
					return false;
				}

				me.prev_record.set( 'creditInterestProfRecKey', creditInterestProfRecKey.getValue() );
				me.prev_record.set( 'bankCreditInterestProfDesc', creditInterestProfDesc.getValue() );
				me.prev_record.set( 'debitInterestProfRecKey', debitInterestProfRecKey.getValue() );
				me.prev_record.set( 'bankDebitInterestProfDesc', debitInterestProfDesc.getValue() );
				me.prev_record.set( 'nominatedCreditAccId', nominatedCreditAccId.getValue() );
				me.prev_record.set( 'nominatedCreditAccDesc', nominatedCreditAccDesc.getValue() );
				me.prev_record.set( 'nominatedDebitAccId', nominatedDebitAccId.getValue() );
				me.prev_record.set( 'nominatedDebitAccDesc', nominatedDebitAccDesc.getValue() );
				me.prev_record.set( 'contraDebitAccId', contraDebitAccId.getValue() );
				me.prev_record.set( 'contraDebitAccDesc', contraDebitAccDesc.getValue() );
				me.prev_record.set( 'contraCreditAccId', contraCreditAccId.getValue() );
				me.prev_record.set( 'contraCreditAccDesc', contraCreditAccDesc.getValue() );
				me.prev_record.set( 'chargeAccId', chargeAccId.getValue() );
				me.prev_record.set( 'chargeAccount', chargeAccountName.getValue() );
				me.prev_record.set( 'nodeName', nodeName.getValue() );
				me.prev_record.set( 'nodeDescription', nodeDescription.getValue() );
				//me.prev_record.set( 'creditLimit', creditLimit.getValue() );//FTGCPBDB-4643

				me.addPoolPopup.close();
			},

			saveAccountDetails : function()
			{
				var objapportionmentNoPost =
				{
					'0' : getLabel( "lblNoApplicable", "No Applicable" ),
					'1' : getLabel( "lblApplicable", "Applicable" ),
					'2' : getLabel( "lblApplicablePost", "Applicable with No post" )
				}
				var objapportionment =
				{
					'N' : getLabel( "lblNoApplicable", "Not Applicable" ),
					'P' : getLabel( "lblInheritFromPool", "Inherit from Group" ),
					'A' : getLabel( "lblSpecifyNode", "Specify at this Node" ),
					'G' : getLabel( "lblInheritFromSubgroup", "Inherit from Parent Subgroup" )
				}
				var me = this;
				var mandatoryFieldsArray = new Array();
				var validateFieldsArray = new Array();
				var i = 0;
				maxNodeId = parseInt( maxNodeId,10 ) + 1;
				var nodeName = me.addAccountPopup.down( 'textfield[itemId="nodeName"]' );
				var bankCreditInterestProfDesc = me.addAccountPopup
					.down( 'textfield[itemId="bankCreditInterestProfDesc"]' );
				var creditApportmentProfileDesc = me.addAccountPopup
					.down( 'textfield[itemId="creditApportmentProfileDesc"]' );
				var nominatedCreditAccDesc = me.addAccountPopup.down( 'textfield[itemId="nominatedCreditAccDesc"]' );
				var bankDebitInterestProfDesc = me.addAccountPopup
					.down( 'textfield[itemId="bankDebitInterestProfDesc"]' );
				var debitApportmentProfileDesc = me.addAccountPopup
					.down( 'textfield[itemId="debitApportmentProfileDesc"]' );
				var nominatedDebitAccDesc = me.addAccountPopup.down( 'textfield[itemId="nominatedDebitAccDesc"]' );
				var companyRegId = me.addAccountPopup.down( 'hidden[itemId="compRegId"]' );

				mandatoryFieldsArray[ i++ ] = nodeName;
				if(autoGenBnkInstProfFlag!='Y' && (!Ext.isEmpty(structureType) && 'CB' !== structureType))
				{
					mandatoryFieldsArray[ i++ ] = bankCreditInterestProfDesc;
					mandatoryFieldsArray[ i++ ] = bankDebitInterestProfDesc;
				}
				mandatoryFieldsArray[ i++ ] = creditApportmentProfileDesc;
				mandatoryFieldsArray[ i++ ] = nominatedCreditAccDesc;
				mandatoryFieldsArray[ i++ ] = debitApportmentProfileDesc;
				mandatoryFieldsArray[ i++ ] = nominatedDebitAccDesc;
				if(loanTracking == 'Y'){
					mandatoryFieldsArray[ i++ ] = companyRegId;
				}

				if( me.checkMandatoryFields( mandatoryFieldsArray, me.addAccountPopup
					.down( 'label[itemId="errorLabel"]' ) ) )
				{
					return false;
				}

				var creditInterestProfRecKey = me.addAccountPopup.down( 'hidden[itemId="creditInterestProfRecKey"]' );
				var creditApportmentProfileRecKey = me.addAccountPopup
					.down( 'hidden[itemId="creditApportmentProfileRecKey"]' );
				var nominatedCreditAccId = me.addAccountPopup.down( 'hidden[itemId="nominatedCreditAccId"]' );
				var debitInterestProfRecKey = me.addAccountPopup.down( 'hidden[itemId="debitInterestProfRecKey"]' );
				var debitApportmentProfileRecKey = me.addAccountPopup
					.down( 'hidden[itemId="debitApportmentProfileRecKey"]' );
				var nominatedDebitAccId = me.addAccountPopup.down( 'hidden[itemId="nominatedDebitAccId"]' );
				var accountId = me.addAccountPopup.down( 'hidden[itemId="accountId"]' );
				i = 0;
				validateFieldsArray[ i++ ] = accountId;
				if(autoGenBnkInstProfFlag!='Y' && (!Ext.isEmpty(structureType) && 'CB' !== structureType))
				{
					validateFieldsArray[ i++ ] = creditInterestProfRecKey;
					validateFieldsArray[ i++ ] = debitInterestProfRecKey;
				}
				validateFieldsArray[ i++ ] = creditApportmentProfileRecKey;
				validateFieldsArray[ i++ ] = nominatedCreditAccId;
				validateFieldsArray[ i++ ] = debitApportmentProfileRecKey;
				validateFieldsArray[ i++ ] = nominatedDebitAccId;

				if( me.validateMandatoryFields( mandatoryFieldsArray, validateFieldsArray, me.addAccountPopup
					.down( 'label[itemId="errorLabel"]' ) ) )
				{
					return false;
				}

				var nodeDesc = me.addAccountPopup.down( 'textfield[itemId="nodeDescription"]' ).getValue();
				var apportionment = me.addAccountPopup.down( 'combobox[itemId="apportionment"]' ).getValue();
				var client = me.addAccountPopup.down( 'hidden[itemId="client"]' ).getValue();
				var bank = me.addAccountPopup.down( 'hidden[itemId="bank"]' ).getValue();
				var chargeAccount = me.addAccountPopup.down( 'hidden[itemId="chargeAccountName"]' ).getValue();
				var chargeAccId = me.addAccountPopup.down( 'hidden[itemId="chargeAccountId"]' ).getValue();
				var nodeCurrency = me.addAccountPopup.down( 'hidden[itemId="currency"]' ).getValue();
				var parentNodeId = me.prev_record.get( 'nodeId' );
				var parentRecordKey = me.prev_record.get( 'parentRecordKey' );
				var allocationRatio = me.addAccountPopup.down( 'textfield[itemId="allocationRatio"]' ).getValue();
				var apportionmentDesc = objapportionment[ apportionment ];
				var apportionmentNoPost = me.addAccountPopup.down( 'checkbox[itemId="apportionmentNoPostItemId"]' );
				var apportionmentNoPostDesc;
				if( apportionmentNoPost.isDisabled() )
				{
					apportionmentNoPost = 0;
					apportionmentNoPostDesc = objapportionmentNoPost[ apportionmentNoPost ];
				}
				else
				{
					if( apportionmentNoPost.getValue() == true )
					{
						apportionmentNoPost = 2;
						apportionmentNoPostDesc = objapportionmentNoPost[ apportionmentNoPost ];
					}
					else
					{
						apportionmentNoPost = 1;
						apportionmentNoPostDesc = objapportionmentNoPost[ apportionmentNoPost ];
					}
				}

				me.prev_record.insertChild( 2,
				{
					nodeName : nodeName.getValue(),
					leaf : true,
					iconCls : 'task',
					nodeDescription : nodeDesc,
					nodeId : maxNodeId,
					parentNodeId : parentNodeId,
					allocationRatio : allocationRatio,
					nodeType : 'A',
					creditApportmentProfileRecKey : creditApportmentProfileRecKey.getValue(),
					debitApportmentProfileRecKey : debitApportmentProfileRecKey.getValue(),
					creditInterestProfRecKey : creditInterestProfRecKey.getValue(),
					debitInterestProfRecKey : debitInterestProfRecKey.getValue(),
					nominatedCreditAccId : nominatedCreditAccId.getValue(),
					nominatedDebitAccId : nominatedDebitAccId.getValue(),
					apportionmentDesc : apportionmentDesc,
					parentRecordKey : parentRecordKey,
					client : client,
					bank : bank,
					chargeAccId : chargeAccId,
					chargeAccount : chargeAccount,
					bankCreditInterestProfDesc : bankCreditInterestProfDesc.getValue(),
					bankDebitInterestProfDesc : bankDebitInterestProfDesc.getValue(),
					nominatedCreditAccDesc : nominatedCreditAccDesc.getValue(),
					nominatedDebitAccDesc : nominatedDebitAccDesc.getValue(),
					apportionment : apportionment,
					creditApportmentProfileDesc : creditApportmentProfileDesc.getValue(),
					debitApportmentProfileDesc : debitApportmentProfileDesc.getValue(),
					nodeCurrency : nodeCurrency,
					apportionmentType : apportionmentNoPost,
					apportionmentTypeDesc : apportionmentNoPostDesc,
					accountId : accountId.getValue()
				} );

				me.addAccountPopup.close();
			},

			updateSubgroupNodeDetails : function()
			{
				var me = this;
				var mandatoryFieldsArray = new Array();
				var validateFieldsArray = new Array();
				var i = 0;
				var objapportionmentNoPost =
				{
					'0' : getLabel( "lblNoApplicable", "No Applicable" ),
					'1' : getLabel( "lblApplicable", "Applicable" ),
					'2' : getLabel( "lblApplicablePost", "Applicable with No post" )
				}
				var objapportionment =
				{
					'N' : getLabel( "lblNoApplicable", "Not Applicable" ),
					'G' : getLabel( "lblSpecifyNode", "Specify at this Node" ),
					'P' : getLabel( "lblInheritFromPool", "Inherit From Group" )
				}

				mandatoryFieldsArray[ i++ ] = me.addSubgroupPopup.down( 'textfield[itemId="subgroupCodeItemId"]' );
				mandatoryFieldsArray[ i++ ] = me.addSubgroupPopup.down( 'textfield[itemId="subgroupDescItemId"]' );
				mandatoryFieldsArray[ i++ ] = me.addSubgroupPopup
					.down( 'textfield[itemId="sgApportmentCrIntProfileDescItemId"]' );
				mandatoryFieldsArray[ i++ ] = me.addSubgroupPopup
					.down( 'textfield[itemId="sgNominatedCrAccDescItemId"]' );
				mandatoryFieldsArray[ i++ ] = me.addSubgroupPopup.down( 'textfield[itemId="sgContraCrAccDescItemId"]' );
				mandatoryFieldsArray[ i++ ] = me.addSubgroupPopup
					.down( 'textfield[itemId="sgApportmentDrIntProfileDescItemId"]' );
				mandatoryFieldsArray[ i++ ] = me.addSubgroupPopup
					.down( 'textfield[itemId="sgNominatedDrAccDescItemId"]' );
				mandatoryFieldsArray[ i++ ] = me.addSubgroupPopup.down( 'textfield[itemId="sgContraDrAccDescItemId"]' );
				mandatoryFieldsArray[ i++ ] = me.addSubgroupPopup
					.down( 'textfield[itemId="sgChargeAccountDescItemId"]' );

				if( me.checkMandatoryFields( mandatoryFieldsArray, me.addSubgroupPopup
					.down( 'label[itemId="errorLabelItemId"]' ) ) )
				{
					return false;
				}

				var creditApportmentProfileRecKey = me.addSubgroupPopup
					.down( 'hidden[itemId="creditApportmentProfileRecKeyItemId"]' );
				var nominatedCreditAccId = me.addSubgroupPopup.down( 'hidden[itemId="nominatedCreditAccIdItemId"]' );
				var contraCreditAccId = me.addSubgroupPopup.down( 'hidden[itemId="contraCreditAccIdItemId"]' );
				var debitApportmentProfileRecKey = me.addSubgroupPopup
					.down( 'hidden[itemId="debitApportmentProfileRecKeyItemId"]' )
				var nominatedDebitAccId = me.addSubgroupPopup.down( 'hidden[itemId="nominatedDebitAccIdItemId"]' );
				var contraDebitAccId = me.addSubgroupPopup.down( 'hidden[itemId="contraDebitAccIdItemId"]' );
				var chargeAccountId = me.addSubgroupPopup.down( 'hidden[itemId="chargeAccountIdItemId"]' );
				i = 0;
				validateFieldsArray[ i++ ] = me.addSubgroupPopup.down( 'textfield[itemId="subgroupCodeItemId"]' );
				validateFieldsArray[ i++ ] = me.addSubgroupPopup.down( 'textfield[itemId="subgroupDescItemId"]' );
				validateFieldsArray[ i++ ] = creditApportmentProfileRecKey;
				validateFieldsArray[ i++ ] = nominatedCreditAccId;
				validateFieldsArray[ i++ ] = contraCreditAccId;
				validateFieldsArray[ i++ ] = debitApportmentProfileRecKey;
				validateFieldsArray[ i++ ] = nominatedDebitAccId;
				validateFieldsArray[ i++ ] = contraDebitAccId;
				validateFieldsArray[ i++ ] = chargeAccountId;

				if( me.validateMandatoryFields( mandatoryFieldsArray, validateFieldsArray, me.addSubgroupPopup
					.down( 'label[itemId="errorLabelItemId"]' ) ) )
				{
					return false;
				}

				me.prev_record.set( 'nodeName', me.addSubgroupPopup.down( 'textfield[itemId="subgroupCodeItemId"]' )
					.getValue() );
				me.prev_record.set( 'nodeDescription', me.addSubgroupPopup.down(
					'textfield[itemId="subgroupDescItemId"]' ).getValue() );
				me.prev_record.set( 'apportionmentDesc', objapportionment[ me.addSubgroupPopup.down(
					'combobox[itemId="sgApportmentItemId"]' ).getValue() ] );
				me.prev_record.set( 'apportionment', me.addSubgroupPopup.down( 'combobox[itemId="sgApportmentItemId"]' )
					.getValue() );
				me.prev_record.set( 'creditApportmentProfileRecKey', creditApportmentProfileRecKey.getValue() );
				me.prev_record.set( 'creditApportmentProfileDesc', me.addSubgroupPopup.down(
					'textfield[itemId="sgApportmentCrIntProfileDescItemId"]' ).getValue() );
				me.prev_record.set( 'nominatedCreditAccId', nominatedCreditAccId.getValue() );
				me.prev_record.set( 'nominatedCreditAccDesc', me.addSubgroupPopup.down(
					'textfield[itemId="sgNominatedCrAccDescItemId"]' ).getValue() );
				me.prev_record.set( 'contraCreditAccId', contraCreditAccId.getValue() );
				me.prev_record.set( 'contraCreditAccDesc', me.addSubgroupPopup.down(
					'textfield[itemId="sgContraCrAccDescItemId"]' ).getValue() );
				me.prev_record.set( 'debitApportmentProfileRecKey', debitApportmentProfileRecKey.getValue() );
				me.prev_record.set( 'debitApportmentProfileDesc', me.addSubgroupPopup.down(
					'textfield[itemId="sgApportmentDrIntProfileDescItemId"]' ).getValue() );
				me.prev_record.set( 'nominatedDebitAccId', nominatedDebitAccId.getValue() );
				me.prev_record.set( 'nominatedDebitAccDesc', me.addSubgroupPopup.down(
					'textfield[itemId="sgNominatedDrAccDescItemId"]' ).getValue() );
				me.prev_record.set( 'contraDebitAccId', contraDebitAccId.getValue() );
				me.prev_record.set( 'contraDebitAccDesc', me.addSubgroupPopup.down(
					'textfield[itemId="sgContraDrAccDescItemId"]' ).getValue() );
				me.prev_record.set( 'chargeAccount', me.addSubgroupPopup.down(
					'textfield[itemId="sgChargeAccountDescItemId"]' ).getValue() );
				me.prev_record.set( 'chargeAccountId', chargeAccountId.getValue() );
				/*me.prev_record.set( 'creditLimit', me.addSubgroupPopup.down( 'textfield[itemId="creditLimitItemId"]' )
					.getValue() );*///FTGCPBDB-4643
				var apportionmentNoPost = me.addSubgroupPopup.down( 'checkbox[itemId="sgApportionmentNoPostItemId"]' );
				var apportionmentNoPostDesc;
				if( apportionmentNoPost.isDisabled() )
				{
					apportionmentNoPost = 0;
					apportionmentNoPostDesc = objapportionmentNoPost[ apportionmentNoPost ];
				}
				else
				{
					if( apportionmentNoPost.getValue() == true )
					{
						apportionmentNoPost = 2;
						apportionmentNoPostDesc = objapportionmentNoPost[ apportionmentNoPost ];
					}
					else
					{
						apportionmentNoPost = 1;
						apportionmentNoPostDesc = objapportionmentNoPost[ apportionmentNoPost ];
					}
				}
				me.prev_record.set( 'apportionmentType', apportionmentNoPost );
				me.prev_record.set( 'apportionmentTypeDesc', apportionmentNoPostDesc );
				me.addSubgroupPopup.close();
			},

			saveSubgroupNodeDetails : function()
			{
				var me = this;
				var mandatoryFieldsArray = new Array();
				var validateFieldsArray = new Array();
				var i = 0;
				var objapportionment =
				{
					'N' : getLabel( "lblNoApplicable", "No Applicable" ),
					'G' : getLabel( "lblSpecifyNode", "Specify at this Node" ),
					'P' : getLabel( "lblInheritFromPool", "Inherit From Group" )
				}
				var objapportionmentNoPost =
				{
					'0' : getLabel( "lblNoApplicable", "No Applicable" ),
					'1' : getLabel( "lblApplicable", "Applicable" ),
					'2' : getLabel( "lblApplicablePost", "Applicable with No post" )
				}
				var nodeName = me.addSubgroupPopup.down( 'textfield[itemId="subgroupCodeItemId"]' );
				var nodeDesc = me.addSubgroupPopup.down( 'textfield[itemId="subgroupDescItemId"]' );
				var apportionment = me.addSubgroupPopup.down( 'combobox[itemId="sgApportmentItemId"]' );
				var apportionmentDesc = objapportionment[ apportionment.getValue() ];
				var creditApportmentProfileDesc = me.addSubgroupPopup
					.down( 'textfield[itemId="sgApportmentCrIntProfileDescItemId"]' );
				var creditApportmentProfileRecKey = me.addSubgroupPopup
					.down( 'hidden[itemId="creditApportmentProfileRecKeyItemId"]' );
				var nominatedCreditAccDesc = me.addSubgroupPopup
					.down( 'textfield[itemId="sgNominatedCrAccDescItemId"]' );
				var nominatedCreditAccId = me.addSubgroupPopup.down( 'hidden[itemId="nominatedCreditAccIdItemId"]' );
				var contraCreditAccDesc = me.addSubgroupPopup.down( 'textfield[itemId="sgContraCrAccDescItemId"]' );
				var contraCreditAccId = me.addSubgroupPopup.down( 'hidden[itemId="contraCreditAccIdItemId"]' );
				var debitApportmentProfileDesc = me.addSubgroupPopup
					.down( 'textfield[itemId="sgApportmentDrIntProfileDescItemId"]' );
				var debitApportmentProfileRecKey = me.addSubgroupPopup
					.down( 'hidden[itemId="debitApportmentProfileRecKeyItemId"]' );
				var nominatedDebitAccDesc = me.addSubgroupPopup.down( 'textfield[itemId="sgNominatedDrAccDescItemId"]' );
				var nominatedDebitAccId = me.addSubgroupPopup.down( 'hidden[itemId="nominatedDebitAccIdItemId"]' );
				var contraDebitAccDesc = me.addSubgroupPopup.down( 'textfield[itemId="sgContraDrAccDescItemId"]' );
				var contraDebitAccId = me.addSubgroupPopup.down( 'hidden[itemId="contraDebitAccIdItemId"]' );
				var chargeAccountDesc = me.addSubgroupPopup.down( 'textfield[itemId="sgChargeAccountDescItemId"]' );
				var chargeAccountId = me.addSubgroupPopup.down( 'hidden[itemId="chargeAccountIdItemId"]' );
				//var creditLimit = me.addSubgroupPopup.down( 'textfield[itemId="creditLimitItemId"]' );//FTGCPBDB-4643
				var apportionmentNoPost = me.addSubgroupPopup.down( 'checkbox[itemId="sgApportionmentNoPostItemId"]' );
				var apportionmentNoPostDesc;
				if( apportionmentNoPost.isDisabled() )
				{
					apportionmentNoPost = 0;
					apportionmentNoPostDesc = objapportionmentNoPost[ apportionmentNoPost ];
				}
				else
				{
					if( apportionmentNoPost.getValue() == true )
					{
						apportionmentNoPost = 2;
						apportionmentNoPostDesc = objapportionmentNoPost[ apportionmentNoPost ];
					}
					else
					{
						apportionmentNoPost = 1;
						apportionmentNoPostDesc = objapportionmentNoPost[ apportionmentNoPost ];
					}
				}
				maxNodeId = parseInt( maxNodeId,10 ) + 1;
				var parentNodeId = me.prev_record.get( 'nodeId' );
				var parentRecordKey = me.prev_record.get( 'parentRecordKey' );

				mandatoryFieldsArray[ i++ ] = nodeName;
				mandatoryFieldsArray[ i++ ] = nodeDesc;
				mandatoryFieldsArray[ i++ ] = creditApportmentProfileDesc;
				mandatoryFieldsArray[ i++ ] = nominatedCreditAccDesc;
				mandatoryFieldsArray[ i++ ] = contraCreditAccDesc;
				mandatoryFieldsArray[ i++ ] = debitApportmentProfileDesc;
				mandatoryFieldsArray[ i++ ] = nominatedDebitAccDesc;
				mandatoryFieldsArray[ i++ ] = contraDebitAccDesc;
				mandatoryFieldsArray[ i++ ] = chargeAccountDesc;

				if( me.checkMandatoryFields( mandatoryFieldsArray, me.addSubgroupPopup
					.down( 'label[itemId="errorLabelItemId"]' ) ) )
				{
					return false;
				}
				i = 0;
				validateFieldsArray[ i++ ] = nodeName;
				validateFieldsArray[ i++ ] = nodeDesc;
				validateFieldsArray[ i++ ] = creditApportmentProfileRecKey;
				validateFieldsArray[ i++ ] = nominatedCreditAccId;
				validateFieldsArray[ i++ ] = contraCreditAccId;
				validateFieldsArray[ i++ ] = debitApportmentProfileRecKey;
				validateFieldsArray[ i++ ] = nominatedDebitAccId;
				validateFieldsArray[ i++ ] = contraDebitAccId;
				validateFieldsArray[ i++ ] = chargeAccountId;

				if( me.validateMandatoryFields( mandatoryFieldsArray, validateFieldsArray, me.addSubgroupPopup
					.down( 'label[itemId="errorLabelItemId"]' ) ) )
				{
					return false;
				}

				me.prev_record.insertChild( 2,
				{
					nodeName : nodeName.getValue(),
					iconCls : 'task-folder',
					leaf : false,
					expanded : true,
					nodeDescription : nodeDesc.getValue(),
					nodeId : maxNodeId,
					parentNodeId : parentNodeId,
					allocationRatio : '',
					nodeType : 'G',
					creditApportmentProfileRecKey : creditApportmentProfileRecKey.getValue(),
					debitApportmentProfileRecKey : debitApportmentProfileRecKey.getValue(),
					nominatedCreditAccId : nominatedCreditAccId.getValue(),
					nominatedDebitAccId : nominatedDebitAccId.getValue(),
					contraCreditAccId : contraCreditAccId.getValue(),
					contraDebitAccId : contraDebitAccId.getValue(),
					apportionment : apportionment.getValue(),
					parentRecordKey : parentRecordKey,
					creditApportmentProfileDesc : creditApportmentProfileDesc.getValue(),
					debitApportmentProfileDesc : debitApportmentProfileDesc.getValue(),
					nominatedCreditAccDesc : nominatedCreditAccDesc.getValue(),
					nominatedDebitAccDesc : nominatedDebitAccDesc.getValue(),
					contraCreditAccDesc : contraCreditAccDesc.getValue(),
					contraDebitAccDesc : contraDebitAccDesc.getValue(),
					apportionmentDesc : apportionmentDesc,
					nodeCurrency : poolCurrency,
					chargeAccId : chargeAccountId.getValue(),
					chargeAccount : chargeAccountDesc.getValue(),
					//creditLimit : creditLimit.getValue(),//FTGCPBDB-4643
					apportionmentType : apportionmentNoPost,
					apportionmentTypeDesc : apportionmentNoPostDesc
				} );

				me.addSubgroupPopup.close();
			},

			checkMandatoryFields : function( mandatoryFieldsArray, errorLabelObj )
			{
				var me = this;
				var fieldValue = null;
				var isMandatoryError = false;
				for( var i = 0 ; i < mandatoryFieldsArray.length ; i++ )
				{
					if( !mandatoryFieldsArray[ i ].isDisabled() )
					{
						fieldValue = mandatoryFieldsArray[ i ].getValue();
						if( mandatoryFieldsArray[ i ].itemId == 'compRegId'
							&& ( fieldValue == null || fieldValue.trim() == '' ) )
						{
							isMandatoryError = true;
							me.showCompRegIdError( errorLabelObj );
							break;
						}
						else if( fieldValue == null || fieldValue.trim() == '' )
						{
							isMandatoryError = true;
							me.showMandatoryError( errorLabelObj );
							break;
						}
					}
				}
				return isMandatoryError;
			},
			validateMandatoryFields : function( mandatoryFieldsArray, validFieldsArray, errorLabelObj )
			{
				var me = this;
				var fieldValue = null;
				var isValidationError = false;
				for( var i = 0 ; i < mandatoryFieldsArray.length && i < validFieldsArray.length ; i++ )
				{
					if( !mandatoryFieldsArray[ i ].isDisabled() && mandatoryFieldsArray[ i ].itemId != 'compRegId' )
					{
						fieldValue = validFieldsArray[ i ].getValue();
						if( fieldValue == null || fieldValue.trim() == '' )
						{
							isValidationError = true;
							me.showValidationError( errorLabelObj );
							break;
						}
					}
				}
				return isValidationError;
			},
			deleteNode : function()
			{
				var me = this;
				var nodeType = me.prev_record.get( 'nodeType' );			

				if( nodeType == 'G' )
				{
					Ext.Msg.show({
                        title: 'Delete Node',
                        msg:  'You are about to Delete Subgroup "'
    						+ me.prev_record.get( 'nodeName' ) + '" and Its Children. Do you want to Continue.....?',
                        buttons: Ext.Msg.YESNO,
                        icon: Ext.Msg.WARNING,
                        cls : 'ux_popup',
                        fn: function(btn) {
                        	if( btn === 'yes' )
    						{
    							me.prev_record.remove( true );
    						}
                          }
                     });			
				}
				else if( nodeType == 'A' )
				{
					Ext.Msg.show({
                        title: 'Delete Node',
                        msg:  'You are about to Delete Account "'
						+ me.prev_record.get( 'nodeName' ) + '". Do you want to Continue.....?',
                        buttons: Ext.Msg.YESNO,
                        icon: Ext.Msg.WARNING,
                        cls : 'ux_popup',
                        fn: function(btn) {
                        	if( btn === 'yes' )
    						{
    							me.prev_record.remove( true );
    						}
                          }
                     });		
				}

			},

			editViewNode : function()
			{
				var me = this;
				var nodeType = me.prev_record.data.nodeType;
				me.parentRecordId = me.prev_record.get( 'parentId' );
				if( nodeType == 'A' )
				{
					me.enableDisableAccountFieldList();
					me.setAccountInterstProfileParameter();

					if( Ext.isEmpty( me.addAccountPopup ) )
					{
						me.addAccountPopup = Ext.create( 'GCP.view.AgreementNotionalDtlAddAccountView' );
					}
					me.addAccountPopup.down( 'label[itemId="errorLabel"]' ).setText( '' );
					me.addAccountPopup.down( 'textfield[itemId="nodeName"]' ).setValue( me.prev_record.data.nodeName );
					me.addAccountPopup.down( 'textfield[itemId="nodeDescription"]' ).setValue(
						me.prev_record.data.nodeDescription );
					me.addAccountPopup.down( 'combobox[itemId="apportionment"]' ).setValue(
						me.prev_record.data.apportionment );
					me.addAccountPopup.down( 'hidden[itemId="creditInterestProfRecKey"]' ).setValue(
						me.prev_record.data.creditInterestProfRecKey );
					me.addAccountPopup.down( 'hidden[itemId="creditApportmentProfileRecKey"]' ).setValue(
						me.prev_record.data.creditApportmentProfileRecKey );
					me.addAccountPopup.down( 'hidden[itemId="nominatedCreditAccId"]' ).setValue(
						me.prev_record.data.nominatedCreditAccId );
					me.addAccountPopup.down( 'hidden[itemId="debitInterestProfRecKey"]' ).setValue(
						me.prev_record.data.debitInterestProfRecKey );
					me.addAccountPopup.down( 'hidden[itemId="debitApportmentProfileRecKey"]' ).setValue(
						me.prev_record.data.debitApportmentProfileRecKey );
					me.addAccountPopup.down( 'hidden[itemId="nominatedDebitAccId"]' ).setValue(
						me.prev_record.data.nominatedDebitAccId );
					me.addAccountPopup.down( 'textfield[itemId="bankCreditInterestProfDesc"]' ).setValue(
						me.prev_record.data.bankCreditInterestProfDesc );
					me.addAccountPopup.down( 'textfield[itemId="creditApportmentProfileDesc"]' ).setValue(
						me.prev_record.data.creditApportmentProfileDesc );
					me.addAccountPopup.down( 'textfield[itemId="nominatedCreditAccDesc"]' ).setValue(
						me.prev_record.data.nominatedCreditAccDesc );
					me.addAccountPopup.down( 'textfield[itemId="bankDebitInterestProfDesc"]' ).setValue(
						me.prev_record.data.bankDebitInterestProfDesc );
					me.addAccountPopup.down( 'textfield[itemId="debitApportmentProfileDesc"]' ).setValue(
						me.prev_record.data.debitApportmentProfileDesc );
					me.addAccountPopup.down( 'textfield[itemId="nominatedDebitAccDesc"]' ).setValue(
						me.prev_record.data.nominatedDebitAccDesc );
					me.addAccountPopup.down( 'textfield[itemId="allocationRatio"]' ).setValue(
						me.prev_record.data.allocationRatio );
					me.addAccountPopup.down( 'hidden[itemId="accountId"]' ).setValue( me.prev_record.data.accountId );
					me.addAccountPopup.down( 'hidden[itemId="client"]' ).setValue( me.prev_record.data.client );
					me.addAccountPopup.down( 'hidden[itemId="bank"]' ).setValue( me.prev_record.data.bank );
					me.addAccountPopup.down( 'hidden[itemId="chargeAccountName"]' ).setValue(
						me.prev_record.data.chargeAccount );
					me.addAccountPopup.down( 'hidden[itemId="chargeAccountId"]' ).setValue(
						me.prev_record.data.chargeAccId );
					me.addAccountPopup.down( 'hidden[itemId="currency"]' ).setValue( me.prev_record.data.nodeCurrency );
					if( me.prev_record.data.apportionmentType == 2 )
					{
						me.addAccountPopup.down( 'checkbox[itemId="apportionmentNoPostItemId"]' ).setValue( true );
					}
					if( pageMode == 'VIEW' )
					{
						me.getBtnSaveAccountRef().hide();
						me.getBtnUpdateAccountRef().hide();
					}
					else
					{
						me.getBtnSaveAccountRef().hide();
						me.getBtnUpdateAccountRef().show();
						if( pageMode == 'PRIOR_EDIT' )
						{
							me.addAccountPopup.down( 'combobox[itemId="apportionment"]' ).setReadOnly( true );
							me.addAccountPopup.down( 'checkbox[itemId="apportionmentNoPostItemId"]' )
								.setReadOnly( true );
							me.addAccountPopup.down( 'textfield[itemId="nominatedCreditAccDesc"]' ).setReadOnly( true );
							me.addAccountPopup.down( 'textfield[itemId="nominatedDebitAccDesc"]' ).setReadOnly( true );
						}
					}
					me.addAccountPopup.down( 'textfield[itemId="nodeName"]' ).setReadOnly( true );
					me.addAccountPopup.down( 'label[itemId="accountParentNodeItemId"]' ).setText(
							getLabel('parentNode','Parent Node : ') + me.getFromStore( me.parentRecordId, 'nodeName' ) );
					me.addAccountPopup.show();
				}
				else if( nodeType == 'P' )
				{
					me.enableDisablePoolField();
					if( Ext.isEmpty( me.addPoolPopup ) )
					{
						me.addPoolPopup = Ext.create( 'GCP.view.AgreementNotionalDtlAddPoolView' );
					}
					me.addPoolPopup.down( 'label[itemId="errorLabel"]' ).setText( '' );
					me.addPoolPopup.down( 'textfield[itemId="nodeName"]' ).setValue( me.prev_record.data.nodeName );
					me.addPoolPopup.down( 'textfield[itemId="nodeDescription"]' ).setValue(
						me.prev_record.data.nodeDescription );
					me.addPoolPopup.down( 'hidden[itemId="creditInterestProfRecKey"]' ).setValue(
						me.prev_record.data.creditInterestProfRecKey );
					me.addPoolPopup.down( 'textfield[itemId="creditInterestProfDesc"]' ).setValue(
						me.prev_record.data.bankCreditInterestProfDesc );
					me.addPoolPopup.down( 'hidden[itemId="debitInterestProfRecKey"]' ).setValue(
						me.prev_record.data.debitInterestProfRecKey );
					me.addPoolPopup.down( 'textfield[itemId="debitInterestProfDesc"]' ).setValue(
						me.prev_record.data.bankDebitInterestProfDesc );
					me.addPoolPopup.down( 'hidden[itemId="nominatedCreditAccId"]' ).setValue(
						me.prev_record.data.nominatedCreditAccId );
					me.addPoolPopup.down( 'textfield[itemId="nominatedCreditAccDesc"]' ).setValue(
						me.prev_record.data.nominatedCreditAccDesc );
					me.addPoolPopup.down( 'hidden[itemId="nominatedDebitAccId"]' ).setValue(
						me.prev_record.data.nominatedDebitAccId );
					me.addPoolPopup.down( 'textfield[itemId="nominatedDebitAccDesc"]' ).setValue(
						me.prev_record.data.nominatedDebitAccDesc );
					me.addPoolPopup.down( 'hidden[itemId="contraCreditAccId"]' ).setValue(
						me.prev_record.data.contraCreditAccId );
					me.addPoolPopup.down( 'textfield[itemId="contraCreditAccDesc"]' ).setValue(
						me.prev_record.data.contraCreditAccDesc );
					me.addPoolPopup.down( 'hidden[itemId="contraDebitAccId"]' ).setValue(
						me.prev_record.data.contraDebitAccId );
					me.addPoolPopup.down( 'textfield[itemId="contraDebitAccDesc"]' ).setValue(
						me.prev_record.data.contraDebitAccDesc );

					me.addPoolPopup.down( 'textfield[itemId="chargeAccountName"]' ).setValue(
						me.prev_record.data.chargeAccount );
					me.addPoolPopup.down( 'hidden[itemId="chargeAccountId"]' ).setValue(
						me.prev_record.data.chargeAccId );
					/*me.addPoolPopup.down( 'textfield[itemId="creditLimit"]' )
						.setValue( me.prev_record.data.creditLimit );*///FTGCPBDB-4643

					if( pageMode == 'VIEW' )
					{
						me.getBtnUpdatePoolAccountRef().hide();
					}
					else
					{
						me.getBtnUpdatePoolAccountRef().show();
						if( pageMode == 'PRIOR_EDIT' )
						{
							me.addPoolPopup.down( 'textfield[itemId="chargeAccountName"]' ).setReadOnly( true );
							me.addPoolPopup.down( 'textfield[itemId="nominatedCreditAccDesc"]' ).setReadOnly( true );
							me.addPoolPopup.down( 'textfield[itemId="nominatedDebitAccDesc"]' ).setReadOnly( true );
							me.addPoolPopup.down( 'textfield[itemId="contraCreditAccDesc"]' ).setReadOnly( true );
							me.addPoolPopup.down( 'textfield[itemId="contraDebitAccDesc"]' ).setReadOnly( true );
						}
					}

					me.addPoolPopup.down( 'textfield[itemId="nodeName"]' ).setReadOnly( true );
					me.addPoolPopup.down( 'textfield[itemId="nodeDescription"]' ).setReadOnly( false );

					me.addPoolPopup.show();
				}
				else
				{
					var temp = null;
					temp = me.addSubgroupPopup.down( 'combobox[itemId="sgApportmentItemId"]' );

					if( me.parentRecordId == 1 )
					{
						temp.store.loadData( me.sgApportionmentStoreForGrp.getRange(), false );
					}
					else
					{
						temp.store.loadData( me.sgApportionmentStoreForSubGrp.getRange(), false );
					}
					me.enableDisableSubgroupFieldList();
					if( Ext.isEmpty( me.addSubgroupPopup ) )
					{
						me.addSubgroupPopup = Ext.create( 'GCP.view.AgreementNotionalDtlAddSubgroupView' );
					}
					me.addSubgroupPopup.down( 'label[itemId="errorLabelItemId"]' ).setText( '' );
					me.addSubgroupPopup.down( 'textfield[itemId="subgroupCodeItemId"]' ).setValue(
						me.prev_record.data.nodeName );
					me.addSubgroupPopup.down( 'textfield[itemId="subgroupDescItemId"]' ).setValue(
						me.prev_record.data.nodeDescription );
					me.addSubgroupPopup.down( 'combobox[itemId="sgApportmentItemId"]' ).setValue(
						me.prev_record.data.apportionment );
					me.addSubgroupPopup.down( 'hidden[itemId="creditApportmentProfileRecKeyItemId"]' ).setValue(
						me.prev_record.data.creditApportmentProfileRecKey );
					me.addSubgroupPopup.down( 'hidden[itemId="debitApportmentProfileRecKeyItemId"]' ).setValue(
						me.prev_record.data.debitApportmentProfileRecKey );
					me.addSubgroupPopup.down( 'hidden[itemId="nominatedCreditAccIdItemId"]' ).setValue(
						me.prev_record.data.nominatedCreditAccId );
					me.addSubgroupPopup.down( 'hidden[itemId="nominatedDebitAccIdItemId"]' ).setValue(
						me.prev_record.data.nominatedDebitAccId );
					me.addSubgroupPopup.down( 'hidden[itemId="contraCreditAccIdItemId"]' ).setValue(
						me.prev_record.data.contraCreditAccId );
					me.addSubgroupPopup.down( 'hidden[itemId="contraDebitAccIdItemId"]' ).setValue(
						me.prev_record.data.contraDebitAccId );
					me.addSubgroupPopup.down( 'textfield[itemId="sgApportmentCrIntProfileDescItemId"]' ).setValue(
						me.prev_record.data.creditApportmentProfileDesc );
					me.addSubgroupPopup.down( 'textfield[itemId="sgApportmentDrIntProfileDescItemId"]' ).setValue(
						me.prev_record.data.debitApportmentProfileDesc );
					me.addSubgroupPopup.down( 'textfield[itemId="sgNominatedCrAccDescItemId"]' ).setValue(
						me.prev_record.data.nominatedCreditAccDesc );
					me.addSubgroupPopup.down( 'textfield[itemId="sgNominatedDrAccDescItemId"]' ).setValue(
						me.prev_record.data.nominatedDebitAccDesc );
					me.addSubgroupPopup.down( 'textfield[itemId="sgContraCrAccDescItemId"]' ).setValue(
						me.prev_record.data.contraCreditAccDesc );
					me.addSubgroupPopup.down( 'textfield[itemId="sgContraDrAccDescItemId"]' ).setValue(
						me.prev_record.data.contraDebitAccDesc );
					me.addSubgroupPopup.down( 'textfield[itemId="sgChargeAccountDescItemId"]' ).setValue(
						me.prev_record.data.chargeAccount );
					me.addSubgroupPopup.down( 'hidden[itemId="chargeAccountIdItemId"]' ).setValue(
						me.prev_record.data.chargeAccId );
					//FTGCPBDB-4643
					/*me.addSubgroupPopup.down( 'textfield[itemId="creditLimitItemId"]' ).setValue(
						me.prev_record.data.creditLimit );*/
					if( me.prev_record.data.apportionmentType == 2 )
					{
						me.addSubgroupPopup.down( 'checkbox[itemId="sgApportionmentNoPostItemId"]' ).setValue( true );
					}
					if( pageMode == 'VIEW' )
					{
						me.addSubgroupPopup.down( 'button[itemId="sgBtnSaveItemId"]' ).hide();
						me.addSubgroupPopup.down( 'button[itemId="sgBtnUpdateItemId"]' ).hide();
						me.addSubgroupPopup.down( 'textfield[itemId="subgroupDescItemId"]' ).setReadOnly( true );
					}
					else
					{
						me.addSubgroupPopup.down( 'button[itemId="sgBtnSaveItemId"]' ).hide();
						me.addSubgroupPopup.down( 'button[itemId="sgBtnUpdateItemId"]' ).show();
						if( pageMode == 'PRIOR_EDIT' )
						{
							me.addSubgroupPopup.down( 'combobox[itemId="sgApportmentItemId"]' ).setReadOnly( true );
							me.addSubgroupPopup.down( 'checkbox[itemId="sgApportionmentNoPostItemId"]' ).setReadOnly(
								true );
							me.addSubgroupPopup.down( 'textfield[itemId="sgChargeAccountDescItemId"]' ).setReadOnly(
								true );
							me.addSubgroupPopup.down( 'textfield[itemId="sgNominatedCrAccDescItemId"]' ).setReadOnly(
								true );
							me.addSubgroupPopup.down( 'textfield[itemId="sgNominatedDrAccDescItemId"]' ).setReadOnly(
								true );
							me.addSubgroupPopup.down( 'textfield[itemId="sgContraCrAccDescItemId"]' )
								.setReadOnly( true );
							me.addSubgroupPopup.down( 'textfield[itemId="sgContraDrAccDescItemId"]' )
								.setReadOnly( true );
						}
					}
					me.addSubgroupPopup.down( 'textfield[itemId="subgroupCodeItemId"]' ).setReadOnly( true );
					me.addSubgroupPopup.down( 'label[itemId="subGrpParentNodeItemId"]' ).setText(
							getLabel('parentNode','Parent Node : ') + me.getFromStore( me.parentRecordId, 'nodeName' ) );
					me.addSubgroupPopup.show();
				}
			},

			showCompRegIdError : function( errorLabelObj )
			{
				errorLabelObj.setText( getLabel( 'lblCompRegIdMandatoryCheckMsg',
					'Company Registration ID is missing for selected Account. Please select different Account.' ) );
				errorLabelObj.show();
			},
			showMandatoryError : function( errorLabelObj )
			{
				errorLabelObj.setText( getLabel( 'lblMandatoryCheckMsg', 'Please Enter All Mandatory Fields' ) );
				errorLabelObj.show();
			},
			showValidationError : function( errorLabelObj )
			{
				errorLabelObj.setText( getLabel( 'lblValidateCheckMsg', 'Please Enter Valid Data' ) );
				errorLabelObj.show();
			},

			getFromStore : function( nodeId, fieldName )
			{
				var me = this;
				var newRecords = null;
				var storeFieldValue = "";
				if( null != cellEditGrid.store.getNodeById( nodeId ) )
				{
					storeFieldValue = cellEditGrid.store.getNodeById( nodeId ).get( fieldName );
				}
				else
				{
					newRecords = cellEditGrid.store.getNewRecords();
					for( i = 0 ; i < newRecords.length ; i++ )
					{
						if( newRecords[ i ].data.nodeId == nodeId )
						{
							storeFieldValue = newRecords[ i ].data[ fieldName ];
							break;
						}
					}
				}
				return storeFieldValue;
			},

			enableDisableActions : function( record )
			{
				var me = this;
				var nodeType = record.data.nodeType;

				me.getAddSubgroupBtnRef().setDisabled( false );
				me.getAddAccountBtnRef().setDisabled( false );
				me.getDeleteBtnRef().setDisabled( false );
				me.getEditBtnRef().setDisabled( false );
				if( pageMode == 'PRIOR_EDIT' )
				{
					if( nodeType == 'A' )
					{
						me.getAddSubgroupBtnRef().setDisabled( true );
						me.getAddAccountBtnRef().setDisabled( true );
					}
					else if( nodeType == 'P' )
					{
						me.getDeleteBtnRef().setDisabled( true );
						me.getAddSubgroupBtnRef().setDisabled( true );
						if( record.data.chargeAccount == "" )
						{
							me.getAddAccountBtnRef().setDisabled( true );
						}
					}
					else if( nodeType == 'G' )
					{
						me.getDeleteBtnRef().setDisabled( true );
						me.getAddSubgroupBtnRef().setDisabled( true );
					}
				}
				else
				{
					if( nodeType == 'A' )
					{
						me.getAddSubgroupBtnRef().setDisabled( true );
						me.getAddAccountBtnRef().setDisabled( true );
					}
					else if( nodeType == 'P' )
					{
						me.getDeleteBtnRef().setDisabled( true );
						if( record.data.chargeAccount == "" )
						{
							me.getAddSubgroupBtnRef().setDisabled( true );
							me.getAddAccountBtnRef().setDisabled( true );
						}
					}
				}

				if( structureType != NotionalStructureType.Combination )
				{
					me.getAddSubgroupBtnRef().setDisabled( true );
				}
			},

			handleBeforeDropAction : function( node, data, overModel, dropPosition, dropFunction, eOpts )
			{
				var srcNodeType = data.records[ 0 ].data.nodeType;
				var destNodeType = overModel.data.nodeType;
				if( dropPosition == 'before' && destNodeType == 'P' )
				{
					dropFunction.cancelDrop();
				}
				else if( dropPosition == 'before' && destNodeType == 'G' && pageMode == "PRIOR_EDIT" )
				{
					dropFunction.cancelDrop();
				}
			},

			handleDropAction : function( node, data, overModel, dropPosition, eOpts )
			{
				if( dropPosition == 'before' )
				{
					data.records[ 0 ].data.parentNodeId = overModel.data.parentNodeId;
				}
				else
				{
					data.records[ 0 ].data.parentNodeId = overModel.data.nodeId;
				}
			},

			handleTreeGridConfig : function()
			{
				var me = this;
				cellEditGrid = Ext.create( 'Ext.tree.Panel',
				{
					xtype : 'tree-grid',
					id : 'poolgrid',
					itemId : 'poolgrid',
					minHeight : 140,
					maxHeight : 415,
					padding : '0 10 10 10',
					useArrows : true,
					rootVisible : false,
					multiSelect : true,
					singleExpand : false,
					viewConfig :
					{
						plugins :
						{
							ptype : 'treeviewdragdrop',
							enableDrag : true,
							enableDrop : true
						},
						listeners :
						{
							beforedrop : function( node, data, overModel, dropPosition, dropFunction, eOpts )
							{
								me.handleBeforeDropAction( node, data, overModel, dropPosition, dropFunction, eOpts );
							},
							drop : function( node, data, overModel, dropPosition, eOpts )
							{
								me.handleDropAction( node, data, overModel, dropPosition, eOpts );
							}
						}
					},
					listeners :
					{
						itemclick : function( view, record, item, index, e )
						{
							me.prev_record = record;
							me.enableDisableActions( record );
						}
					},
					store : new Ext.data.TreeStore(
					{
						model : Pool.model,
						proxy :
						{
							type : 'ajax',
							url : 'showConfigurePoolJsonString.srvc?$viewState=' + encodeURIComponent( viewState )
								+ '&' + csrfTokenName + "=" + csrfTokenValue,
							method : 'POST',
							reader :
							{
								type : 'json'
							}
						},
						folderSort : true
					} ),
					columns :
					[
						{
							xtype : 'treecolumn', // this is so we know which
							// column will show the tree
							text : getLabel('nodeName','Node Name'),
							locked : true,
							width : 200,
							sortable : true,
							dataIndex : 'nodeName'
						},
						{
							text : getLabel("description",'Description'),
							width : 150,
							sortable : true,
							dataIndex : 'nodeDescription',
							editor :
							{
								xtype : 'textfield'
							}
						},
						{
							text : getLabel('ccy','CCY'),
							width : 60,
							sortable : true,
							dataIndex : 'nodeCurrency'
						},
						{
							text : getLabel('bank','Bank'),
							width : 150,
							sortable : true,
							dataIndex : 'bank'
						},
						{
							text : getLabel('bankInterestProfileCR','Bank Interest Profile (CR)'),
							width : 160,
							sortable : true,
							dataIndex : 'bankCreditInterestProfDesc',
							renderer : function( value, meta, record )
							{
								var recKey = record.get( 'creditInterestProfRecKey' );
								return '<a href="#" style="color:blue" onclick="javascript:showInterestProfile(' + "'"
									+ recKey + "', '', '" + csrfTokenName + "', '" + csrfTokenValue + "'" + ');">'
									+ value + '</a>';
							}
						},
						{
							text : getLabel('bankInterestProfileDR','Bank Interest Profile (DR)'),
							width : 160,
							sortable : true,
							dataIndex : 'bankDebitInterestProfDesc',
							renderer : function( value, meta, record )
							{
								var recKey = record.get( 'debitInterestProfRecKey' );
								return '<a href="#" style="color:blue" onclick="javascript:showInterestProfile(' + "'"
									+ recKey + "', '', '" + csrfTokenName + "', '" + csrfTokenValue + "'" + ');">'
									+ value + '</a>';
							}
						},
						{
							text : getLabel('apportionmentApplicable','Apportionment Applicable'),
							width : 160,
							sortable : true,
							dataIndex : 'apportionmentDesc'
						},
						{
							text : getLabel('apportionmentNoPost','Apportionment No Post'),
							width : 150,
							sortable : true,
							dataIndex : 'apportionmentTypeDesc'
						},
						{
							text : getLabel('apportionmentProfileCR','Apportionment Profile (CR)'),
							width : 170,
							sortable : true,
							dataIndex : 'creditApportmentProfileDesc',
							renderer : function( value, meta, record )
							{
								var recKey = record.get( 'creditApportmentProfileRecKey' );
								return '<a href="#" style="color:blue" onclick="javascript:showInterestProfile(' + "'"
									+ recKey + "', '', '" + csrfTokenName + "', '" + csrfTokenValue + "'" + ');">'
									+ value + '</a>';
							}
						},
						{
							text : getLabel('apportionmentProfileDR','Apportionment Profile (DR)'),
							width : 170,
							sortable : true,
							dataIndex : 'debitApportmentProfileDesc',
							renderer : function( value, meta, record )
							{
								var recKey = record.get( 'debitApportmentProfileRecKey' );
								return '<a href="#" style="color:blue" onclick="javascript:showInterestProfile(' + "'"
									+ recKey + "', '', '" + csrfTokenName + "', '" + csrfTokenValue + "'" + ');">'
									+ value + '</a>';
							}
						},
						{
							text : getLabel('nominatedAccountCR','Nominated Account (CR)'),
							width : 160,
							sortable : true,
							dataIndex : 'nominatedCreditAccDesc'
						},
						{
							text : getLabel('nominatedAccountDR','Nominated Account (DR)'),
							width : 160,
							sortable : true,
							dataIndex : 'nominatedDebitAccDesc'
						},
						{
							text : getLabel('contraAccountCR','Contra Account (CR)'),
							width : 150,
							sortable : true,
							dataIndex : 'contraCreditAccDesc'
						},
						{
							text : getLabel('contraAccountDR','Contra Account (DR)'),
							width : 150,
							sortable : true,
							dataIndex : 'contraDebitAccDesc'
						},
						{
							text : getLabel('lblChargeAccount','Charge Account'),
							width : 150,
							sortable : true,
							dataIndex : 'chargeAccount'
						},
						{
							text : getLabel('lblBenefitAllocationRatio','Allocation Ratio(%)'),
							width : 150,
							sortable : true,
							hidden: (structureType === 'CP' && allocationMethod === 'R') ? false : true,
							dataIndex : 'benefitAllocationRatio'
						}/*,
						{
							text : getLabel('creditLimit','Credit Limit'),
							width : 100,
							align : 'right',
							sortable : true,
							dataIndex : 'creditLimit'
						}*///FTGCPBDB-4643
					]
				} );
				var editTreeGridView = me.getDtlTreeGridRef();
				editTreeGridView.add( cellEditGrid );
				editTreeGridView.doLayout();
			}

		} );
