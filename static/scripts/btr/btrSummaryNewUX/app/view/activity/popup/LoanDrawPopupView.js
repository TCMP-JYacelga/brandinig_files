/**
 * @class GCP.view.activity.popup.LoanDrawPopupView
 * @extends Ext.window.Window
 * @author Shraddha Chauhan
 */
Ext.define('GCP.view.activity.popup.LoanDrawPopupView', {
	extend : 'Ext.window.Window',
	requires : ['Ext.button.Button','Ext.form.Label','Ext.container.Container','Ext.form.field.Text','Ext.data.Store',
	            'Ext.form.field.ComboBox'],
	xtype : 'loanDrawPopupView',
	title : null,
	height : 280,
	width : 510,
	closeAction : 'hide',
	modal : true,
	buyCcy : 'USD',	
	accountId:null,
	layout : 'fit',
	ccy : null,
	initComponent : function() {
		
		var me = this;
		//product combo store
		
		var obligorSore = Ext.create('Ext.data.Store', {
			fields : ['key', 'value'],
			autoLoad : true,
			data : [{
						"key" : "obligor_id",
						"value" : getLabel('lblobligorID', 'Obligor Id')  
					}]
		});
		
		var obligationSore = Ext.create('Ext.data.Store', {
			fields : ['key', 'value'],
			autoLoad : true,
			data : [{
						"key" : "obligation_id",
						"value" : getLabel('lblobligationID', 'Obligation Id') 
					}]
		});
		
		var paymentProductStore = Ext.create('Ext.data.Store', {
			fields : ['MYPPRODUCT', 'MYPDESCRIPTION'],
			proxy : {
				type : 'ajax',
				autoLoad : true,
				url : 'services/btrseek/btrLoanProducts?',
				reader : {
					type : 'json',
					root : 'd.preferences'
				}
			}
		});
		
		//receiver combo store
		var receiverAccounts = Ext.create('Ext.data.Store', {
			fields : ['DRAWER_CODE', 'DRAWER_BENEFICARY_FLAG'],
			proxy : {
				type : 'ajax',
				url : 'services/userseek/btrreceivercodes',
				reader : {
					type : 'json',
					root : 'd.preferences'
				}
			},
			autoLoad : false
		});
		
		//currency combo store
		var currencyStore = Ext.create('Ext.data.Store', {
			fields : ['CODE', 'DESCR', 'SYMBOL'],
			proxy : {
				type : 'ajax',
				autoLoad : true,
				url : 'services/userseek/paymentccy.json',
				reader : {
					type : 'json',
					root : 'd.preferences'
				}
			}
		});
		
		//rate type combo store
		var rateStore = Ext.create('Ext.data.Store', {
			fields : ['rate'],
			data : [{
				"rate" : "CARD RATE"
			}, {
				"rate" : "CONTRACT RATE"
			}]
			
		});
		
			var parentView = Ext.create('Ext.form.Panel', {
			width : 300,
			height: 260,
			itemId:'loanParentPanel',
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
			items : [ {
						xtype : 'container',
						//itemId : 'paymentPackageContainer',
						padding : '10 0 0 7',
						height : 50,
						columnWidth : 0.55,
						items : [{
									xtype : 'label',
									text : getLabel('obligorId','Obligor Id'),
									cls : 'f13 ux_font-size14 ux_padding0060'
								}, {
									xtype : 'combo',
									width : 160,
									displayField : 'value',
									valueField : 'key',
									editable : false,
									store : obligorSore,
									fieldCls : 'popup-form-field',
									triggerBaseCls : 'popup-form-trigger',
									itemId : 'obligatorCombo',
									allowBlank : false
								}]
					}, {
						xtype : 'container',
						//itemId : 'productContainer',
						padding : '10 0 0 7',
						height : 50,
						columnWidth : 0.45,
						items : [{
									xtype : 'label',
									text : getLabel('obligationId','Obligation Id'),
									cls : 'f13 ux_font-size14 ux_padding0060'
								}, {
									xtype : 'combo',
									width : 160,
									displayField : 'value',
									valueField : 'key',
									editable : false,
									store : obligationSore,
									fieldCls : 'popup-form-field',
									triggerBaseCls : 'popup-form-trigger',
									itemId : 'obligationCombo'
								}]
					}, {
						xtype : 'container',
						itemId:'drawDepositeContainer',
						padding:'8 0 0 7',
						columnWidth : 0.55,
						layout : 'vbox',		
						items : [ {
									xtype : 'label',
									text : getLabel('deopsitAccount','Deposit Account'),
									cls : 'f13 ux_font-size14 ux_padding0060 required'
								},{
									xtype : 'container',
									itemId : 'depositAccountContainer',
									layout : 'hbox',
									padding : '0 0 0 0',
									items : [{
										xtype : 'AutoCompleter',
										fieldCls : 'xn-form-text w165 xn-suggestion-box',
										cls : 'ux_paddingb',
										name: 'depositAccount',
										store: receiverAccounts,
										displayField : 'ACMACCOUNT',
										valueField : 'ACMACCOUNT',
										itemId : 'depositAccountCombo',
										allowBlank: false		
									}, {
										xtype : 'label',
										itemId : 'drawCurrencyField',
										text : me.buyCcy,
										padding : '4 0 0 10'
									}]
								}, {
									xtype : 'container',
									itemId : 'creditAccountInfo',
									layout : 'hbox',
									items : [{
												xtype : 'label',
												itemId : 'drawAccountField',
												text : getLabel('accNameType', 'Account Name , Account Type')
											}]
								}]
					}, {
						xtype : 'container',
						padding:'8 0 0 7',
						itemId:'drawRequestedAmountContainer',
						columnWidth : 0.45,
						layout : 'vbox',						
						items : [{
								xtype : 'label',
 								text: getLabel("requestedlamount", "Requested Amount"),
								cls : 'f13 ux_font-size14'
								},
								{
								xtype : 'container',
 								itemId : 'requestedAmountContainer',
								layout : 'hbox',
								padding : '0 0 0 0',
								items : [{
										xtype : 'numberfield',
										fieldCls : 'xn-valign-middle xn-form-text w10 xn-field-amount w165',
										itemId : 'requestedAmount',
										allowBlank : false,
										hideTrigger : true
									}, {
										xtype : 'label',
										itemId : 'requestedAmountCcy',
										text : me.buyCcy,
										padding : '4 0 0 10'
									}]
								}]
					}, {
						xtype : 'container',
						padding:'8 0 0 7',
						itemId:'requestReferenceContainer',
						columnWidth : 0.55,
						//width : 500,
						layout : 'vbox',						
						items : [{
								xtype : 'label',
 								text: getLabel("requestReference", "Request Reference"),
								cls : 'f13 ux_font-size14'
								},
								{
								xtype : 'textfield',
								width : 165,
								padding : '0 0 0 0',
 								itemId : 'requestReferenceField'
								}]
					}, {
						xtype : 'container',
						padding:'8 0 0 7',
						itemId:'effectiveDateContainer',
						columnWidth : 0.45,
						layout : 'vbox',						
						items : [{
								xtype : 'label',
 								text: getLabel("effectiveDate", "Effective Date"),
								cls : 'f13 ux_font-size14 ux_padding0060 required'
								}, {
								xtype : 'datefield',
								name : 'effectiveDate',
								itemId : 'effectiveDateItemId',
								width : 165,
								padding : '0 0 0 0',
								editable : false,
								allowBlank : true,
								hideTrigger : true
								}]
					}]
			         
			
		 });
		me.items = [ parentView ];
		me.on('beforeshow', function() {
					me.populateLoanDrawProductCombo();
					me.populateLoanDrawReceiverCombo();
					me.clearLoanPopupFields();
				});
		me.callParent(arguments);
	},
	populateLoanDrawProductCombo : function(){
		var me = this,paymentProductComboStore,currentAccountId,productComboRef;
		 currentAccountId = me.accountFilter;
		 productComboRef = me.down('combo[itemId="loanProductCombo"]');

		if (!Ext.isEmpty(productComboRef)) {
			paymentProductComboStore = productComboRef.getStore();
			paymentProductComboStore.proxy.extraParams = {
				$autofilter : currentAccountId
			};
			paymentProductComboStore.load();
		} else {
			// console.log("Error Occured - paymentProductCombo is
			// empty");
		}
	},
	populateLoanDrawReceiverCombo : function(){
		var me = this,comboStore,currentAccountId,loanreceiverCombo;
		 currentAccountId = me.accountFilter;
		 loanreceiverCombo = me.down('combo[itemId="loanreceiverCombo"]');

		if (!Ext.isEmpty(loanreceiverCombo)) {
			comboStore = loanreceiverCombo.getStore();
			comboStore.proxy.extraParams = {
				$autofilter : currentAccountId
			};
			comboStore.load();
		} else {
			// console.log("Error Occured - paymentProductCombo is
			// empty");
		}
	},
	getLoanDrawDetails : function(btn){
		var me = this;
		var loanParentPanelRef = me.down('form[itemId="loanParentPanel"]');
		if (!Ext.isEmpty(loanParentPanelRef))
			var formData = loanParentPanelRef.getValues();
		formData.debitCcy = "USD";
		formData.rateType = "CARD RATE";
		formData.LoanAccNmbr = me.currentAccountNumber;
		me.fireEvent('handleLoanDrawDetails', formData);
	},
	clearLoanPopupFields : function() {
		var me = this;
		var parentPanelRef = me.down('form[itemId="loanParentPanel"]');
		if (!Ext.isEmpty(parentPanelRef)) {
			parentPanelRef.getForm().reset();
		}
	},
	handleLoanRateType : function(combo, newValue, oldValue, eOpts){
		var me= this;
		var rateTypeCombo = me.down('combo[itemId="rateTypeCombo"]');
		var ccy = me.ccy;
		var newCcy = combo.value;
			if (ccy !== newCcy) {
				if (!Ext.isEmpty(rateTypeCombo)) {
					rateTypeCombo.setDisabled(false);
					// this.setPaymentRateTypes(rateTypeCombo,'loanDrawPopup');
				}
			} else {
				rateTypeCombo.setDisabled(true);
		}
	}
});

