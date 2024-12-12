/**
 * @class GCP.view.activity.popup.PurchasePopupView
 * @extends Ext.window.Window
 * @author Shraddha Chauhan
 */
Ext.define('GCP.view.activity.popup.PurchasePopupView', {
	extend : 'Ext.window.Window',
	requires : ['Ext.button.Button','Ext.form.Label','Ext.container.Container','Ext.form.field.Text','Ext.data.Store',
	            'Ext.form.field.ComboBox'],
	xtype : 'purchasePopupView',
	title : null,
	height : 280,
	width : 540,
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
	
		var purchaseDebitAccountStore = Ext.create('Ext.data.Store', {
			fields : ['ACMACCOUNT', 'ACMCURRENCY','ACMACCOUNTDESC','PRAPRODUCT'],
			proxy : {
				type : 'ajax',
				autoLoad : true,
				url : 'services/btrseek/btrpurchasedebitaccounts?',
				reader : {
					type : 'json',
					root : 'd.preferences'
				}
			}
		});
		
		var parentView = Ext.create('Ext.form.Panel', {
			width : 500,
			height:220,
			itemId:'purchaseParentPanel',
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
			items : [
			         {	xtype : 'container',
						itemId:'productContainer',
						padding:'10 0 0 7',
						layout : 'vbox',
						columnWidth : 0.55,
						items : [{
								xtype : 'label',
								text : getLabel('product','Product'),
								cls : 'f13 ux_font-size14 ux_padding0060 required'
								}, {
								xtype : 'combo',
								displayField : 'MYPPRODUCT',
								valueField : 'MYPPRODUCT',
								width : 158,
								fieldCls : 'popup-form-field',
								triggerBaseCls : 'popup-form-trigger',
								store:purchaseProductStore,
								editable:false,
								itemId : 'purchaseProductCombo',
								allowBlank: false
								}]
					},{
						xtype : 'container',
						itemId:'purchaseContainer',
						padding:'10 0 0 7',
						margin : '0 0 0 0',
						height : 60,
						layout : 'vbox',
						columnWidth : 0.45,
						items : [{
								xtype : 'label',
								text : getLabel('purchase','Purchase'),
								cls : 'f13 ux_font-size14 ux_padding0060 required'
								}, {
								xtype : 'container',
								itemId :'purchaseUnitContainer',
								padding:'2 0 0 0',
								layout : 'hbox',
								items : [ 
								{
								xtype : 'radio',
								name: 'purchase',
								itemId : 'purchaseUnitRadio',
								boxLabel  : 'Unit',
								inputValue: 'unit',
								checked: true,
								listeners: {
									focus:function(){
									me.unitSelected();
									}
								}
								},
								{
								xtype : 'textfield',
								width : 40,
								padding:'0 0 0 2',
								itemId : 'purchaseUnitTextField',
								disabled:false
								}, {
								xtype : 'radio',
								itemId : 'purchaseAmountRadio',
								name: 'purchase',
								boxLabel  : getLabel('amount','Amount'),
								inputValue: 'amt',
								listeners: {
									focus:function(){
									me.amountSelected();
									}
								}
								}, {
								xtype : 'textfield',
								width : 40,
								padding:'0 0 0 2',
								itemId : 'purchaseAmountTextField',
								disabled:true
							}]
						}]
					}, {
						xtype : 'container',
						itemId:'purchaseDebitContainer',
						padding:'8 0 5 7',
						columnWidth : 0.55,
						layout : 'vbox',
						items : [{
								xtype : 'label',
								text : getLabel('debitAccount','Debit Account'),
								cls : 'f13 ux_font-size14 ux_padding0060 required'
								}, {
									xtype : 'container',
									itemId:'debitContainer',
									layout : 'hbox',
									items : [{
									xtype : 'combo',
									emptyText: 'Select',
									store:purchaseDebitAccountStore,
									editable:false,
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
						},
						{
						xtype : 'container',
						padding:'8 0 0 7',
						itemId:'rateTypeContainer',
						columnWidth : 0.45,
						disabled: true,
						layout : 'vbox',
						items : [{
							xtype : 'label',
							text : getLabel('rateType','Rate Type'),
							cls : 'f13 ux_font-size14 ux_padding0060'
							},{
							xtype : 'combo',
							emptyText: getLabel('select','Select'),
							width : 160,
							disabledCls: 'field-disable-cls',
							fieldCls : 'popup-form-field',
							triggerBaseCls : 'popup-form-trigger',
							itemId : 'purchaseRateTypeCombo'
							}]
						},
						{
						xtype : 'container',
						padding:'8 0 0 7',
						itemId:'referenceContainer',
						columnWidth : 0.55,
						layout : 'vbox',
						items : [{
							xtype : 'label',
							text : getLabel('reference','Reference'),
							cls : 'f13 ux_font-size14 ux_padding0060'
							}, {
 							xtype : 'textfield',
 							itemId : 'purchaseReference',
							width : 160,
 							allowBlank: false
						}]
						},{
						xtype : 'container',
						padding:'8 0 0 7',
						itemId:'purchasePaymentDateContainer',
						columnWidth : 0.45,
						layout : 'vbox',						
						items : [{
								xtype : 'label',
 								text: getLabel('paymentDate','Payment Date'),
								cls : 'f13 ux_font-size14 ux_padding0060'
								}, {
								xtype : 'datefield',
								name : 'paymentDate',
								itemId : 'paymentDateItemId',
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
					me.clearPurchasePopupFields();
				});
		me.callParent(arguments);
	},
	unitSelected : function(){
		var me = this;
		var purchaseUnitTextFieldRef = me.down('textfield[itemId="purchaseUnitTextField"]');
		if (!Ext.isEmpty(purchaseUnitTextFieldRef)) {
				purchaseUnitTextFieldRef.setDisabled(false);
		}
		var purchaseAmountTextFieldRef = me.down('textfield[itemId="purchaseAmountTextField"]');
		if (!Ext.isEmpty(purchaseAmountTextFieldRef)) {
				purchaseAmountTextFieldRef.setDisabled(true);
		}
	},
	amountSelected : function(){
		var me = this;
		var purchaseUnitTextFieldRef = me.down('textfield[itemId="purchaseUnitTextField"]');
		if (!Ext.isEmpty(purchaseUnitTextFieldRef)) {
				purchaseUnitTextFieldRef.setDisabled(true);
		}

		var purchaseAmountTextFieldRef = me.down('textfield[itemId="purchaseAmountTextField"]');
		if (!Ext.isEmpty(purchaseAmountTextFieldRef)) {
				purchaseAmountTextFieldRef.setDisabled(false);
		}
	},
	clearPurchasePopupFields : function() {
		var me = this;
		var purchaseParentPanelRef = me.down('form[itemId="purchaseParentPanel"]');
		if (!Ext.isEmpty(purchaseParentPanelRef)) {
			purchaseParentPanelRef.getForm().reset();
		}
	},
	getPurchaseInvestmentDetails : function(btn){
		var me = this;
		var productComboRef = me.down('combo[itemId="purchaseProductCombo"]');
		var debitAccountComboRef = me.down('combo[itemId="purchaseDebitAccountCombo"]');
		var purchaseAmountRef = me.down('textfield[itemId="purchaseAmountTextField"]');
		var purchaseReferenceRef = me.down('textfield[itemId="purchaseReference"]');
		var purchaseDateRef = me.down('datefield[itemId="purchasePaymentDate"]');
		var investmentAccountNumber = me.accountFilter;
		var errorLbl = me.down('label[itemId="errorLabel"]');

		var creditCcy = "USD";
		var investmentCcy = "USD";
		var purchaseType = "Amount";
		var units = 0;
		var rateType = "CARD RATE";

		if (!Ext.isEmpty(productComboRef)) {
			var purchaseProduct = productComboRef.getRawValue();
			if (purchaseProduct === 'Select') {
				errorLbl.setText(getLabel('errorlbl.selectProduct', 'Please Select Product'));
				return;
			}
		}

		if (!Ext.isEmpty(debitAccountComboRef)) {
			var debitAccount = debitAccountComboRef.getRawValue();
			if (debitAccount === 'Select') {
				errorLbl.setText(getLabel('errorlbl.debitAcc','Please Select Debit Account'));
				return;
			}
		}

		if (!Ext.isEmpty(purchaseAmountRef)) {
			var purchaseAmount = purchaseAmountRef.getRawValue();
			if (purchaseAmount === '') {
				errorLbl.setText(getLabel('errorlbl.selectAmt', 'Please Select Amount'));
				return;
			}
		}

		if (!Ext.isEmpty(purchaseReferenceRef)) {
			var purchaseReference = purchaseReferenceRef.getRawValue();
			if (purchaseReference === '') {
				errorLbl.setText(getLabel('errorlbl.enterRef', 'Please Enter Reference'));
				return;
			}
		}

		if (!Ext.isEmpty(purchaseDateRef)) {
			var purchaseDate = purchaseDateRef.getRawValue();
			if (purchaseDate === '') {
				errorLbl.setText(getLabel('errorlbl.paymentDate', 'Please Enter Payment Date'));
				return;
			}
		}

		var purchaseJsonData = me.getPurchasePopupJsonData(purchaseProduct,
				debitAccount, purchaseAmount, purchaseReference, purchaseDate,
				creditCcy, investmentCcy, rateType, purchaseType,
				investmentAccountNumber, units);
		me.fireEvent('handleSendPurchaseDetails', purchaseJsonData);
	},
	getPurchasePopupJsonData : function(purchaseProduct, debitAccount,
			purchaseAmount, purchaseReference, purchaseDate, creditCcy,
			investmentCcy, rateType, purchaseType, investmentAccountNumber,
			units) {
		var me = this;
		var purchaseJsonData = '';
		purchaseJsonData = "{\"investmentDetails\":" + "{";
		purchaseJsonData += "\"purchaseProduct\":" + "\"" + purchaseProduct
				+ "\",";
		purchaseJsonData += "\"debitAccountNumber\":" + "\"" + debitAccount
				+ "\",";
		purchaseJsonData += "\"purchaseAmount\":" + "\"" + purchaseAmount
				+ "\",";
		purchaseJsonData += "\"purchaseReference\":" + "\"" + purchaseReference
				+ "\",";
		purchaseJsonData += "\"purchaseDate\":" + "\"" + purchaseDate + "\",";
		purchaseJsonData += "\"creditCcy\":" + "\"" + creditCcy + "\",";
		purchaseJsonData += "\"investmentCcy\":" + "\"" + investmentCcy + "\",";
		purchaseJsonData += "\"purchaseType\":" + "\"" + purchaseType + "\",";
		purchaseJsonData += "\"investmentAccountNumber\":" + "\""
				+ investmentAccountNumber + "\",";
		purchaseJsonData += "\"units\":" + "\"" + units + "\",";
		purchaseJsonData += "\"rateType\":" + "\"" + rateType + "\"}}";

		return purchaseJsonData;
	}
});

