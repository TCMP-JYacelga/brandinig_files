/**
 * @class AddNewInvestmentPopup
 * @extends Ext.panel.Panel
 * @author Vaidehi
 */

Ext.define( 'GCP.view.NewInvestment',
{
	extend : 'Ext.form.Panel',
	xtype : 'newInvestment',
	requires : [],
	callerParent : null,
	width :480,
	layout :
	{
		type : 'vbox'
	},
	standardSubmit:true,
	url:"newInvestmentRequest.srvc",
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
		 	    name: csrfTokenName,
		 	    value: csrfTokenValue
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
						layout : 'vbox',
						flex : 0.8,
						defaults :
						{
							padding : 3,
							labelAlign : 'top',
							labelSeparator : ''
						},
						items :
						[
							{
								xtype : 'radiogroup',
								itemId : 'investmentRadioId',
								fieldLabel : getLabel( 'investment', 'Investment' ),
								padding : '10 0 40 0',
								vertical : true,
								items :
								[
									{
										boxLabel : getLabel( 'new', 'New Investment' ),
										name : 'purchaseNewOrFromAccount',
										width : 120,
										inputValue : 'New'
									},
									{
										boxLabel : getLabel( 'addtionalPurchase', 'Additional Purchase' ),
										name : 'purchaseNewOrFromAccount',
										inputValue : 'Existing Account',
										checked : true,
										width : 150
									}
								]
							},
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
								[{
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
									cfgKeyNode   : 'CODE',
									cfgDataNode1 : 'DESCR' ,
	                                cfgStoreFields:['CODE', 'DESCR' ,'FUNDCODE','NAV']

								},
								 {
									xtype : 'AutoCompleter',
									matchFieldWidth : true,
									cls : 'autoCmplete-field',
									labelSeparator : '',
									fieldLabel : getLabel( 'fundName', 'Fund Name' ),
									name : 'FundCode',
									itemId : 'fundName',
									cfgUrl : 'services/userseek/fundName.json',
									cfgQueryParamName : '$autofilter',
									cfgRecordCount : -1,
									cfgSeekId : 'fundNameSeek',
									cfgRootNode : 'd.preferences',
									cfgKeyNode   : 'CODE',
									cfgDataNode1 : 'DESCR', 
									cfgStoreFields:['CODE', 'DESCR' ,'ACCNMBR' ,'NAV']
								},
								{
									xtype : 'label',
									matchFieldWidth : true,
									text : '',
									padding : '23 0 10 5',
									itemId : 'navId',
									name : 'nav'
								}]
								
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
						layout : 'vbox',
						flex : 0.8,
						defaults :
						{
							padding : 3,
							labelAlign : 'top',
							labelSeparator : ''
						},
						items :
						[
							{
								xtype : 'radiogroup',
								itemId : 'purchaseRadioId',
								cls : 'xn-toolbar-small',
								fieldLabel : getLabel( 'purchase', 'Purchase' ),
								padding : '0 0 15 5',
								vertical : true,
								items :
								[
									{
										boxLabel : getLabel( 'unit', 'Unit' ),
										name : 'purchaseType',
										width : 50,
										inputValue : 'unit',
										checked : true
									},
									{
										boxLabel : getLabel( 'amt', 'Amount' ),
										name : 'purchaseType',
										inputValue : 'amount',
										width : 70
									}
								]

							},
							{
								xtype : 'textfield',
								itemId : 'requestedUnitId',
								width : 150,
								fieldStyle: 'text-align: right;',
								name : 'requestedUnit'
							},
							{
								xtype : 'textfield',
								itemId : 'requestedAmntId',
								width : 150,
								fieldStyle: 'text-align: right;',
								name : 'requestedAmnt'
							},
							{

								xtype : 'AutoCompleter',
								matchFieldWidth : true,
								cls : 'autoCmplete-field',
								labelSeparator : '',
								fieldLabel : getLabel( 'debitAccount', 'Debit Account' ),
								name : 'drcrAccNmbr',
								itemId : 'debitAccNmbr',
								cfgUrl : 'services/userseek/investmentDebitaccount.json',
								cfgQueryParamName : '$autofilter',
								cfgRecordCount : -1,
								cfgSeekId : 'debitAccountSeek',
								cfgRootNode : 'd.preferences',
								cfgKeyNode   : 'CODE',
								cfgDataNode1 : 'DESCR',
								cfgStoreFields:['CODE', 'DESCR' ,'DRCRCCY']

							},
							{
						 	    xtype : 'hidden',
						 	    name: 'drcrCcy'	,
						 	    itemId : 'drcrCcyId'
						 	},
						 	{
								xtype : 'label',
								text : '',
								itemId : 'id'
							},
							{
								xtype : 'datefield',
								fieldLabel : getLabel( 'paymentDate', 'Payment Date' ),
								itemId : 'paymentDateId',
								name : 'contractRef',
								matchFieldWidth : true,
								width : 152,
								editable : false,
								fieldCls : 'xn-valign-middle xn-form-text',
								hideTrigger : true,
								allowBlank : true
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
				padding : '10 0 0 30',
				dock : 'bottom',
				items :
				[
					'->',
					{
						xtype : 'button',
						cls : 'xn-button',
						text : getLabel( 'submitInvestment', 'Submit' ),
						itemId : 'submitInvestmentBtn',
						callerParent : me.parent,
						handler : function( btn, opts )
						{
							var form = this.up('form').getForm();
				            if (form.isValid()) {
				                // Submit the Ajax request and handle the response
				                form.submit({
				                    success: function(form, action) {
				                       Ext.Msg.alert('Success', action.result.msg);
				                    },
				                    failure: function(form, action) {
				                        Ext.Msg.alert('Failed', action.result.msg);
				                    }
				                });
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
						text : getLabel( 'investmentCancel', 'Cancel' ),
						itemId : 'cancelInvestmentBtn',
						callerParent : me.parent,
						handler : function( btn )
						{
							this.fireEvent( 'cancelInvestment', btn );
						}
					}
				]
			}
		];
		this.callParent( arguments );
	},

	handleInvestment : function( objCreateInvestmentPanel )
	{

		var investmentType = objCreateInvestmentPanel.down( 'radiogroup[itemId="investmentRadioId"]' ).getValue();
		if( 'New' === investmentType.purchaseNewOrFromAccount )
		{
			objCreateInvestmentPanel.down( 'AutoCompleter[itemId="investmentAccNmbr"]' ).reset();
			objCreateInvestmentPanel.down( 'AutoCompleter[itemId="fundName"]' ).show();
			objCreateInvestmentPanel.down( 'AutoCompleter[itemId="investmentAccNmbr"]' ).hide();
		}
		else
		{
			objCreateInvestmentPanel.down( 'AutoCompleter[itemId="fundName"]' ).reset();
			objCreateInvestmentPanel.down( 'AutoCompleter[itemId="fundName"]' ).hide();
			objCreateInvestmentPanel.down( 'AutoCompleter[itemId="investmentAccNmbr"]' ).show();
		}
	},
	handlePurchase : function( objCreateInvestmentPanel )
	{
		var purchaseType = objCreateInvestmentPanel.down( 'radiogroup[itemId="purchaseRadioId"]' ).getValue();
		if( 'unit' === purchaseType.purchaseType )
		{ 
			objCreateInvestmentPanel.down( 'textfield[itemId="requestedAmntId"]' ).reset();
			objCreateInvestmentPanel.down( 'textfield[itemId="requestedUnitId"]' ).show();
			objCreateInvestmentPanel.down( 'textfield[itemId="requestedAmntId"]' ).hide();
		}
		else
		{
			objCreateInvestmentPanel.down( 'textfield[itemId="requestedUnitId"]' ).hide();
			objCreateInvestmentPanel.down( 'textfield[itemId="requestedAmntId"]' ).show();
			objCreateInvestmentPanel.down( 'textfield[itemId="requestedUnitId"]' ).reset();
		}
	},
	resetAllFields : function( objCreateNewInvestmentPanel )
	{

		objCreateNewInvestmentPanel.down( 'radiogroup[itemId="investmentRadioId"]' ).setDisabled( false );
		objCreateNewInvestmentPanel.down( 'radiogroup[itemId="investmentRadioId"]' ).setValue({purchaseNewOrFromAccount :'Existing Account'});
		objCreateNewInvestmentPanel.down( 'AutoCompleter[itemId="investmentAccNmbr"]' ).setReadOnly( false );
		objCreateNewInvestmentPanel.down( 'AutoCompleter[itemId="fundName"]' ).setReadOnly( false );
		
		objCreateNewInvestmentPanel.down( 'textfield[itemId="requestReference"]' ).setReadOnly( false );
		objCreateNewInvestmentPanel.down( 'AutoCompleter[itemId="debitAccNmbr"]' ).setReadOnly( false );
		objCreateNewInvestmentPanel.down( 'datefield[itemId="paymentDateId"]' ).setReadOnly( false );
		
		objCreateNewInvestmentPanel.down( 'radiogroup[itemId="purchaseRadioId"]' ).setDisabled( false );
		objCreateNewInvestmentPanel.down( 'radiogroup[itemId="purchaseRadioId"]' ).setValue({purchaseType :'unit'});
		objCreateNewInvestmentPanel.down( 'textfield[itemId="requestedUnitId"]' ).setReadOnly( false );
		objCreateNewInvestmentPanel.down( 'textfield[itemId="requestedAmntId"]' ).setReadOnly( false );
		
		objCreateNewInvestmentPanel.down( 'textfield[itemId="requestReference"]' ).reset();
		objCreateNewInvestmentPanel.down( 'textfield[itemId="requestedAmntId"]' ).reset();
		objCreateNewInvestmentPanel.down( 'textfield[itemId="requestedUnitId"]' ).reset();
		objCreateNewInvestmentPanel.down( 'AutoCompleter[itemId="fundName"]' ).reset();
		objCreateNewInvestmentPanel.down( 'AutoCompleter[itemId="investmentAccNmbr"]' ).reset();
		objCreateNewInvestmentPanel.down( 'AutoCompleter[itemId="debitAccNmbr"]' ).reset();
		objCreateNewInvestmentPanel.down( 'datefield[itemId="paymentDateId"]' ).reset();
		objCreateNewInvestmentPanel.down( 'label[itemId="navId"]' ).setText('');
	},
	handleInvestmentAccNmbr : function (objCreateInvestmentPanel,combo, record, index)
	{
	     objCreateInvestmentPanel.down( 'AutoCompleter[itemId="fundName"]' ).setValue(record[0].data.FUNDCODE);
	     objCreateInvestmentPanel.down( 'AutoCompleter[itemId="fundName"]' ).hide();
	     objCreateInvestmentPanel.down( 'label[itemId="navId"]' ).setText(record[0].data.NAV);
	},
	handleFundCode : function (objCreateInvestmentPanel,combo, record, index)
	{
	     objCreateInvestmentPanel.down( 'AutoCompleter[itemId="investmentAccNmbr"]' ).setValue(record[0].data.ACCNMBR);
	     objCreateInvestmentPanel.down( 'AutoCompleter[itemId="investmentAccNmbr"]' ).hide();
	     objCreateInvestmentPanel.down( 'label[itemId="navId"]' ).setText(record[0].data.NAV);
	},
	handleDebitCCY :function (objCreateInvestmentPanel,combo, record, index)
	{
	     objCreateInvestmentPanel.down( 'hidden[itemId="drcrCcyId"]' ).setValue(record[0].data.DRCRCCY);
	    
	}
		
} );


