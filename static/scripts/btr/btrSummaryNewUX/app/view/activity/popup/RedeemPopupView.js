/**
 * @class GCP.view.activity.popup.RedeemPopupView
 * @extends Ext.window.Window
 * @author Shraddha Chauhan
 */
Ext.define('GCP.view.activity.popup.RedeemPopupView', {
	extend : 'Ext.window.Window',
	requires : ['Ext.button.Button','Ext.form.Label','Ext.container.Container','Ext.form.field.Text','Ext.data.Store',
	            'Ext.form.field.ComboBox'],
	xtype : 'redeemPopupView',
	title : null,
	height : 310,
	width : 520,
	closeAction : 'hide',
	buyCcy : 'USD',
	modal : true,
	accountId:null,
	accountFilter : null,
	layout : 'fit',
	
	initComponent : function() {
		var me = this;
		
		var purchaseProductStore = Ext.create('Ext.data.Store', {
			fields : ['MYPPRODUCT', 'MYPDESCRIPTION'],
			proxy : {
				type : 'ajax',
				autoLoad : true,
				url : 'services/btrseek/btrpurchaseproducts',
				reader : {
					type : 'json',
					root : 'd.preferences'
				}
			}
		});
		
		
		var purchaseCreditAccountStore = Ext.create('Ext.data.Store', {
			fields : ['ACMACCOUNT', 'ACMCURRENCY','ACMACCOUNTDESC','PRAPRODUCT'],
			proxy : {
				type : 'ajax',
				autoLoad : true,
				url : 'services/btrseek/btrredemcreditaccounts?',
				reader : {
					type : 'json',
					root : 'd.preferences'
				}
			}
		});
		
		var parentView = Ext.create('Ext.form.Panel', {
			width : 500,
			height: 400,
			itemId:'redemParentPanel',
			cls: 'form-pnl-cls',
			layout : 'column',
			bbar: [{
						xtype : 'button',
						text : getLabel('cancel', 'Cancel'),
						cls : 'ux_button-background-color ux_font-color-black',
						handler : function(btn, opts) {
							me.down('form').getForm().reset();
							me.close();
						}
					},'->', {
						xtype : 'button',
						text : getLabel('submit', 'Submit'),
						cls : 'ux_button-background-color ux_font-color-black',
						itemId : 'addFundSubmitButton',
						formBind : true,
						handler : function(btn, opts) {
							this.fireEvent('addFund', btn);
							me.getAddFundDetails(btn);
						}

					}],
			items : [{
					xtype : 'container',
					itemId:'redeemProductContainer',
					padding:'10 0 0 7',
					height : 50,
					columnWidth : 0.45,
					items : [{
							xtype : 'label',
							text : getLabel('product','Product'),
							cls : 'f13 ux_font-size14 ux_padding0060 required'
							},{
							xtype : 'combo',
							emptyText: 'Select',
							width : 160,
							displayField : 'MYPPRODUCT',
							valueField : 'MYPPRODUCT',
							store:purchaseProductStore,
							editable:false,
							fieldCls : 'popup-form-field',
							triggerBaseCls : 'popup-form-trigger',
							itemId : 'redeemProductCombo',
							allowBlank: false
						}]
					}, {
						xtype : 'container',
						itemId:'redeemUnitContainer',
						padding:'10 0 0 7',
						columnWidth : 0.55,
						layout : 'hbox',
						items : [ {
								xtype: 'radiogroup',
						        columns: 1,
						        vertical: true,
								defaults: {
						        	padding: 5
						        },
						        items: [{ 
						            boxLabel: getLabel('allunits','All Units'), 
						            name: 'units',
						            checked: true,
						            inputValue: 'allunits',
									itemId:'allUnitsRadio',
						            listeners: {
					                    focus:function(){
					                    	this.fireEvent('allUnitSelected');
					                    }
					                    }
						         },{
						         	boxLabel: getLabel('units','Units'), 
						         	name: 'units',
						            inputValue: 'units',
						            itemId:'unitsRadio',
						            listeners: {
					                    focus:function(){
					                    	this.fireEvent('unitSelected');
					                    }
					                    }
						         },{
						         	boxLabel: getLabel('amount','Amount'), 
						         	name: 'units',
						            inputValue: 'amount',
						            itemId:'amountRadio',
						            listeners: {
					                    focus:function(){
					                    	this.fireEvent('amountSelected');
					                    }
					                    }
						         }
						        
						        ]
							}, {
								xtype: 'container',
								layout: 'vbox',
								items: [{
											xtype: 'textfield',
											itemId: 'allUnitsField',
											 disabled:false,
											 value:'1,000.00',
											 readOnly:true,
											 fieldCls : 'w10',
											 padding:'0 0 0 5'
									},{
											xtype: 'textfield',
											itemId: 'unitField',
											 disabled:false,
											 readOnly:true,
											 emptyText: '0',
											 fieldCls : 'w10',
											 padding:'0 0 0 5'
									}, 
								    {
										xtype: 'container',
										id: 'amtContainer',
										width: 300,
										defaults: {
											padding: '2 0 0 5'
										},
										layout: {
											type: 'hbox'
										},
										items: [{
											xtype: 'textfield',
											itemId: 'redemAmountCurrency',
											readOnly:true,
											disabled:false,
											width: 75,
											fieldCls : 'w6'
										}, {
											xtype: 'textfield',
											itemId: 'redemAmount',
											emptyText: '0',
											disabled:false,
											fieldCls : 'w6'
										}]
										
									}
									
								]
							}]
						},{
							xtype : 'container',
							itemId:'redeemeCreditContainer',
							padding:'8 0 0 7',
							columnWidth : 0.45,
							layout : 'vbox',		
							items : [ {
								xtype : 'label',
 								text: getLabel('creditaccount','Credit Account'),
								cls : 'f13 ux_font-size14 required'
								}, {
									xtype : 'container',
									itemId:'creditContainer',
									layout : 'hbox',
									items : [{
									xtype : 'combo',
									emptyText: 'Select',
									store:purchaseCreditAccountStore,
									editable:false,
									width : 160,
									displayField : 'ACMACCOUNT',
									valueField : 'ACMACCOUNT',
									currencyValue:'ACMCURRENCY',
									fieldCls : 'popup-form-field',
									triggerBaseCls : 'popup-form-trigger',
									itemId : 'purchaseDebitAccountCombo',
									allowBlank: false		
									},
									{
									xtype : 'label',
									itemId : 'debitAccountCcy',
									text : me.buyCcy,
									padding : '4 0 0 10'
									}]
							}]
						},{
							xtype : 'container',
							itemId:'rateTypeContainer',
							padding:'8 0 0 19',
							columnWidth : 0.55,
							layout : 'vbox',
							items : [{
								xtype : 'label',
 								text: getLabel('rateType','Rate Type'),
								cls : 'f13 ux_font-size14'
								}, {
								xtype : 'combo',
								value : 'Select',
								disabled: true,
								width : 160,
								disabledCls: 'field-disable-cls',
								fieldCls : 'popup-form-field',
								triggerBaseCls : 'popup-form-trigger',
								itemId : 'redeemRateTypeCombo'
							}]
						},{
							xtype : 'container',
							padding:'8 0 0 7',
							columnWidth : 0.45,
							layout : 'vbox',
							itemId:'referenceContainer',							
							items : [{
								xtype : 'label',
 								text: getLabel('reference','Reference'),
								cls : 'f13 ux_font-size14'
								}, {
 								xtype : 'textfield',
 								itemId : 'redeemReference',
 								allowBlank: false,
								width : 165
							}]
						},{
						xtype : 'container',
						padding:'8 0 0 19',
						itemId:'redeemDateContainer',
						columnWidth : 0.55,
						layout : 'vbox',						
						items : [{
								xtype : 'label',
 								text: getLabel('redemptionDate', 'Redemption Date'),
								cls : 'f13 ux_font-size14 ux_padding0060 required'
								}, {
								xtype : 'datefield',
								name : 'redeemDate',
								itemId : 'redeemDate',
								width : 165,
								padding : '0 0 0 0',
								editable : false,
								allowBlank : true,
								hideTrigger : true
								}]
						}
						/*{
							xtype : 'container',
							padding:'5 0 5 12',
							itemId:'redeemDateContainer',
							colspan:1,
							layout : {
								type : 'hbox'
							},
							items : [
							{
 								xtype : 'datefield',
 								itemId : 'redeemDate',
								fieldLabel : getLabel('redemptionDate', 'Redemption Date'),
								labelPad: 53,
								labelWidth: 117,
								labelStyle: 'padding-left:10px;margin-right:0px;',
								//labelCls: 'required',
 								allowBlank: false,
								flex: 1,
								fieldCls : 'w8'
							},{
								xtype : 'label',
								text : getLabel('dateFormat','(MM/dd/yyyy)'),
								padding : '4 0 0 10',
								margin:'0 0 0 15'
							}]
						}*/]
			
		});
		
		me.items = [ parentView ];
		me.on('beforeshow', function() {
					me.clearRedeemPopupFields();
				});	        
		me.callParent(arguments);
	},
	getAddRedemInvestmentDetails : function() {
		var me = this;
		var productComboRef = me.down('combo[itemId="redeemProductCombo"]');
		var creditAccountComboRef = me.down('combo[itemId="redemCreditAccountCombo"]');
		var redemAmountRef = me.down('textfield[itemId="redemAmount"]');
		var redemCcyRef = me.down('textfield[itemId="redemCurrencyField"]');
		var redeemReferenceRef = me.down('textfield[itemId="redeemReference"]');
		var redeemDateRef = me.down('datefield[itemId="redeemDate"]');
		var investmentAccountNumber = me.accountFilter;
		var errorLbl = me.down('label[itemId="errorLabel"]');
		
		var debitCcy = me.selectedAccCcy;
		var purchaseType = "Amount";
		var units = 0;
		var rateType = "CARD RATE";

		if (!Ext.isEmpty(productComboRef)) {
			var redemProduct = productComboRef.getRawValue();
			if (redemProduct === 'Select') {
				errorLbl.setText(getLabel('errorLbl.selectProduct','Please Select Product'));
				return;
			}
		}

		if (!Ext.isEmpty(creditAccountComboRef)) {
			var creditAccount = creditAccountComboRef.getRawValue();
			if (creditAccount === 'Select') {
				errorLbl.setText(getLabel('errorLbl.creditAcc', 'Please Select Credit Account'));
				return;
			}
		}

		if (!Ext.isEmpty(redemAmountRef)) {
			var redeemAmount = redemAmountRef.getRawValue();
			if (redeemAmount === '') {
				errorLbl.setText(getLabel('errorLbl.enterAmt', 'Please Enter Amount'));
				return;
			}
		}

		if (!Ext.isEmpty(redemCcyRef)) {
			var redeemCcy = redemCcyRef.getRawValue();
		}

		if (!Ext.isEmpty(redeemReferenceRef)) {
			var redeemReference = redeemReferenceRef.getRawValue();
			if (redeemReference === '') {
				errorLbl.setText(getLabel('errorLbl.enterRef', 'Please Enter Reference'));
				return;
			}
		}

		if (!Ext.isEmpty(redeemDateRef)) {
			var redemmDate = redeemDateRef.getRawValue();
			if (redemmDate === '') {
				errorLbl.setText(getLabel('errorLbl.redemptionDate', 'Please Enter Redemption Date'));
				return;
			}
		}

		var redemJsonData = me.getRedemPopupJsonData(redemProduct,
				creditAccount, redeemAmount, redeemCcy, redeemReference,
				redemmDate, debitCcy, rateType, purchaseType,
				investmentAccountNumber, units);
		me.fireEvent('handleSendRedemDetails', redemJsonData);
	},
	getRedemPopupJsonData : function(redemProduct, creditAccount, redeemAmount,
			redeemCcy, redeemReference, redemmDate, debitCcy, rateType,
			purchaseType, investmentAccountNumber, units) {
		var me = this;
		var redeemJsonData = '';
		redeemJsonData = "{\"redemDetails\":" + "{";
		redeemJsonData += "\"redemProduct\":" + "\"" + redemProduct + "\",";
		redeemJsonData += "\"creditAccount\":" + "\"" + creditAccount + "\",";
		redeemJsonData += "\"redeemAmount\":" + "\"" + redeemAmount + "\",";
		redeemJsonData += "\"redeemCcy\":" + "\"" + redeemCcy + "\",";
		redeemJsonData += "\"redeemReference\":" + "\"" + redeemReference
				+ "\",";
		redeemJsonData += "\"redemmDate\":" + "\"" + redemmDate + "\",";
		redeemJsonData += "\"debitCcy\":" + "\"" + debitCcy + "\",";
		redeemJsonData += "\"rateType\":" + "\"" + rateType + "\",";
		redeemJsonData += "\"purchaseType\":" + "\"" + purchaseType + "\",";
		redeemJsonData += "\"investmentAccountNumber\":" + "\""
				+ investmentAccountNumber + "\",";
		redeemJsonData += "\"units\":" + "\"" + units + "\"}}";

		return redeemJsonData;
	},
	clearRedeemPopupFields : function(){
		var me = this;
		var parentPanelRef = me.down('form[itemId="redemParentPanel"]');
		if (!Ext.isEmpty(parentPanelRef)) {
			parentPanelRef.getForm().reset();
		}
	}
});

