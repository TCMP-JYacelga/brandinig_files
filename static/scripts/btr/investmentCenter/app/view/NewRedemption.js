/**
 * @class AddNewInvestmentPopup
 * @extends Ext.panel.Panel
 * @author Vaidehi
 */

Ext.define( 'GCP.view.NewRedemption',
{
	extend : 'Ext.form.Panel',
	xtype : 'newRedemption',
	requires : [],
	callerParent : null,
	width : 420,
	layout :
	{
		type : 'vbox'
	},
	standardSubmit : true,
	url : "newRedemptionRequest.srvc",
	initComponent : function()
	{
		var me = this;
		var statusComboStore = Ext.create( 'Ext.data.Store',
		{
			fields :
			[
				'key', 'value'
			],
			data : ''
		} );
		me.items =
		[
			{
				xtype : 'hidden',
				name : csrfTokenName,
				value : csrfTokenValue
			},
			{
				xtype : 'container',
				cls : 'filter-container-cls',
				width : 'auto',
				itemId : 'investmentParentContainer',
				layout : 'column',
				// margin : 5,
				defaults :
				{
					margin : '3 5 0 5'
				},
				items :
				[
					{

						xtype : 'container',
						columnWidth : 0.43,
						flex : 0.8,
						layout : 'vbox',
						defaults :
						{
							padding : 3,
							labelAlign : 'top',
							labelSeparator : ''
						},
						items :
						[
							{
								xtype : 'container',
								columnWidth : 0.43,
								layout : 'hbox',
								defaults :
								{
									padding : 3,
									labelAlign : 'top',
									labelSeparator : ''
								},
								items :
								[
									{
										xtype : 'AutoCompleter',
										matchFieldWidth : true,
										cls : 'autoCmplete-field',
										labelSeparator : '',
										fieldLabel : getLabel( 'investmentAccount', 'Investment Account' ),
										name : 'investmentAccNmbr',
										itemId : 'investmentAccNmbr',
										cfgUrl : 'services/userseek/investmentAccount.json',
										cfgQueryParamName : '$autofilter',
										cfgRecordCount : -1,
										cfgSeekId : 'investmentAccountSeek',
										cfgRootNode : 'd.preferences',
										cfgKeyNode : 'CODE',
										cfgDataNode1 : 'DESCR',
										cfgStoreFields :
										[
											'CODE', 'DESCR', 'FUNDCODE', 'NAV'
										]
									},
									{
										xtype : 'label',
										text : '',
										padding : '23 0 10 5',
										itemId : 'navId',
										name : 'nav'
									}
								]
							},
							{
								xtype : 'radiogroup',
								itemId : 'redemptionRadioId',
								padding : '10 0 5 0',
								vertical : true,
								items :
								[
									{
										boxLabel : getLabel( 'unit', 'All Units' ),
										name : 'redeemType',
										width : 80,
										inputValue : 'Allunit',
										checked : true
									},
									{
										boxLabel : getLabel( 'unit', 'Units' ),
										name : 'redeemType',
										width : 50,
										inputValue : 'unit'
									},
									{
										boxLabel : getLabel( 'amt', 'Amount' ),
										name : 'redeemType',
										inputValue : 'amount',
										width : 70
									}
								]
							},
							{
								xtype : 'textfield',
								itemId : 'requestedUnitId',
								width : 150,
								fieldStyle : 'text-align: right;',
								name : 'requestedUnit'
							},
							{
								xtype : 'textfield',
								itemId : 'requestedAmntId',
								width : 150,
								fieldStyle : 'text-align: right;',
								name : 'requestedAmnt'
							},
							{
								xtype : 'textfield',
								fieldLabel : getLabel( 'lblreference', 'Reference' ),
								width : 150,
								itemId : 'requestReference',
								name : 'requestReference'
							}
						]
					},
					{

						xtype : 'container',
						columnWidth : 0.43,
						flex : 0.8,
						layout : 'vbox',
						defaults :
						{
							padding : 3,
							labelAlign : 'top',
							labelSeparator : ''
						},
						items :
						[
							{
								xtype : 'AutoCompleter',
								matchFieldWidth : true,
								cls : 'autoCmplete-field',
								labelSeparator : '',
								padding : '2 0 0 0',
								fieldLabel : getLabel( 'creditAccount', 'Credit Account' ),
								name : 'drcrAccNmbr',
								itemId : 'debitAccNmbr',
								cfgUrl : 'services/userseek/investmentCreditaccount.json',
								cfgQueryParamName : '$autofilter',
								cfgRecordCount : -1,
								cfgSeekId : 'debitAccountSeek',
								cfgRootNode : 'd.preferences',
								cfgKeyNode : 'CODE',
								cfgDataNode1 : 'DESCR',
								cfgStoreFields :
								[
									'CODE', 'DESCR', 'DRCRCCY'
								]

							},
							{
								xtype : 'hidden',
								name : 'drcrCcy',
								itemId : 'drcrCcyId'
							},
							{
								xtype : 'datefield',
								fieldLabel : getLabel( 'redemptionDate', 'Redemption Date' ),
								itemId : 'redemptionDateId',
								name : 'contractRef',
								matchFieldWidth : true,
								width : 152,
								editable : false,
								fieldCls : 'xn-valign-middle xn-form-text',
								hideTrigger : true,
								allowBlank : true
							},
							{
								xtype : 'hidden',
								name : 'FundCode',
								itemId : 'fundName'
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
				padding : '5 0 0 30',
				dock : 'bottom',
				items :
				[
				 	'->',
					{
						xtype : 'button',
						cls : 'xn-button',
						text : getLabel( 'submitRedemption', 'Submit' ),
						itemId : 'submitRedemptionBtn',
						callerParent : me.parent,
						handler : function( btn, opts )
						{
							var form = this.up( 'form' ).getForm();
							if( form.isValid() )
							{
								// Submit the Ajax request and handle the
								// response
								form.submit(
								{
									success : function( form, action )
									{
										Ext.Msg.alert( 'Success', action.result.msg );
									},
									failure : function( form, action )
									{
										Ext.Msg.alert( 'Failed', action.result.msg );
									}
								} );
							}
						}

					},
					{
						xtype : 'label',
						text : '',
						padding : '0 5 0 0'

					},
					{
						xtype : 'button',
						cls : 'xn-button',
						text : getLabel( 'redemptionCancel', 'Cancel' ),
						itemId : 'cancelRedemptionBtn',
						callerParent : me.parent,
						handler : function( btn )
						{
							this.fireEvent( 'cancleRedemption', btn );
						}
					}
				]
			}
		];

		this.callParent( arguments );
	},

	handleInvestmentAccNmbr : function( objCreateNewRedemptionPanel, combo, record, index )
	{
		objCreateNewRedemptionPanel.down( 'hidden[itemId="fundName"]' ).setValue( record[ 0 ].data.FUNDCODE );
		objCreateNewRedemptionPanel.down( 'label[itemId="navId"]' ).setText( record[ 0 ].data.NAV );
		// objCreateNewRedemptionPanel.down( 'label[itemId="navId"]'
		// ).setValue(record[0].data.NAV);
	},
	resetAllFields : function( objCreateNewRedemptionPanel )
	{

		objCreateNewRedemptionPanel.down( 'AutoCompleter[itemId="investmentAccNmbr"]' ).setReadOnly( false );
		objCreateNewRedemptionPanel.down( 'textfield[itemId="requestReference"]' ).setReadOnly( false );
		objCreateNewRedemptionPanel.down( 'AutoCompleter[itemId="debitAccNmbr"]' ).setReadOnly( false );
		objCreateNewRedemptionPanel.down( 'datefield[itemId="redemptionDateId"]' ).setReadOnly( false );
		objCreateNewRedemptionPanel.down( 'radiogroup[itemId="redemptionRadioId"]' ).setValue(
		{
			redeemType : 'Allunit'
		} );
		objCreateNewRedemptionPanel.down( 'radiogroup[itemId="redemptionRadioId"]' ).setDisabled( false );
		objCreateNewRedemptionPanel.down( 'textfield[itemId="requestedUnitId"]' ).setReadOnly( false );
		objCreateNewRedemptionPanel.down( 'textfield[itemId="requestedAmntId"]' ).setReadOnly( false );

		objCreateNewRedemptionPanel.down( 'textfield[itemId="requestReference"]' ).reset();
		objCreateNewRedemptionPanel.down( 'textfield[itemId="requestedAmntId"]' ).reset();
		objCreateNewRedemptionPanel.down( 'textfield[itemId="requestedUnitId"]' ).reset();
		objCreateNewRedemptionPanel.down( 'AutoCompleter[itemId="investmentAccNmbr"]' ).reset();
		objCreateNewRedemptionPanel.down( 'AutoCompleter[itemId="debitAccNmbr"]' ).reset();
		objCreateNewRedemptionPanel.down( 'datefield[itemId="redemptionDateId"]' ).reset();
		objCreateNewRedemptionPanel.down( 'label[itemId="navId"]' ).setText( '' );
	},
	handleRedemption : function( objCreateRedemptionPanel )
	{

		var redemptionType = objCreateRedemptionPanel.down( 'radiogroup[itemId="redemptionRadioId"]' ).getValue();
		if( 'unit' === redemptionType.redeemType || 'Allunit' == redemptionType.redeemType )
		{
			objCreateRedemptionPanel.down( 'textfield[itemId="requestedAmntId"]' ).reset();
			objCreateRedemptionPanel.down( 'textfield[itemId="requestedUnitId"]' ).show();
			objCreateRedemptionPanel.down( 'textfield[itemId="requestedAmntId"]' ).hide();
		}
		else
		{
			objCreateRedemptionPanel.down( 'textfield[itemId="requestedUnitId"]' ).reset();
			objCreateRedemptionPanel.down( 'textfield[itemId="requestedUnitId"]' ).hide();
			objCreateRedemptionPanel.down( 'textfield[itemId="requestedAmntId"]' ).show();
		}
	},
	handleDebitCCY : function( objCreateRedemptionPanel, combo, record, index )
	{
		objCreateRedemptionPanel.down( 'hidden[itemId="drcrCcyId"]' ).setValue( record[ 0 ].data.DRCRCCY );

	}

} );
