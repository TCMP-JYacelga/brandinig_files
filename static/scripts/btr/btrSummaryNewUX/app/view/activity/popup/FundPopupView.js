/**
 * @class GCP.view.activity.popup.FundPopupView
 * @extends Ext.window.Window
 * @author Shraddha Chauhan
 */
Ext.define('GCP.view.activity.popup.FundPopupView', {
	extend : 'Ext.window.Window',
	requires : ['Ext.button.Button', 'Ext.form.Label',
			'Ext.container.Container', 'Ext.form.field.Text', 'Ext.data.Store',
			'Ext.form.field.ComboBox'],
	xtype : 'fundPopupView',
	title : null,
	minHeight : 280,
	autoHeight : true,
	width : 510,
	closeAction : 'hide',
	modal : true,
	buyCcy : 'USD',
	initComponent : function() {
		var me = this;
		var rateList = new Ext.data.Store({
					fields : ['contractCode', 'contractDescription'],
					autoLoad : true
				});

		var fundProductStore = Ext.create('Ext.data.Store', {
					fields : ['MYPPRODUCT', 'MYPDESCRIPTION'],
					proxy : {
						type : 'ajax',
						url : 'services/btrseek/btrfundproducts?$top=-1',
						reader : {
							type : 'json',
							root : 'd.preferences'
						}
					}
				});

		var fundDebitAccountStore = Ext.create('Ext.data.Store', {
					fields : ['ACMACCOUNT', 'ACMCURRENCY', 'ACMACCOUNTDESC',
							'PRAPRODUCT'],
					proxy : {
						type : 'ajax',
						url : 'services/btrseek/btrfunddebitaccounts?$top=-1',
						reader : {
							type : 'json',
							root : 'd.preferences'
						}
					}
				});
		var paymentPackageStore = Ext.create('Ext.data.Store', {
					fields : ['code', 'value'],
					autoLoad : true,
					data : [{
								"code" : "bookTransfer",
								"value" : "Book Transfer Payment Package"
							}, {
								"code" : "bookTransfer",
								"value" : "Book Transfer Payment Package"
							}, {
								"code" : "bookTransfer",
								"value" : "Book Transfer Payment Package"
							}]
				});		

		var parentView = Ext.create('Ext.form.Panel', {
			width : 500,
			height : 220,
			autoHeight : true,
			itemId : 'fundParentPanel',
			cls : 'form-pnl-cls',
			layout : 'column',
			bbar : [{
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
					{
						xtype : 'container',
						itemId : 'paymentPackageContainer',
						padding : '10 0 0 7',
						height : 50,
						columnWidth : 0.55,
						items : [{
									xtype : 'label',
									text : getLabel('paymentPkg','Book Transfer Payment Package'),
									cls : 'f13 ux_font-size14 ux_padding0060'
								}, {
									xtype : 'combo',
									displayField : 'value',
									width : 160,
									valueField : 'code',
									editable : false,
									store : paymentPackageStore,
									fieldCls : 'popup-form-field',
									triggerBaseCls : 'popup-form-trigger',
									itemId : 'paymentPackageCombo',
									allowBlank : false
								}]
					},{
						xtype : 'container',
						itemId : 'productContainer',
						padding : '10 0 0 7',
						columnWidth : 0.45,
						items : [{
									xtype : 'label',
									text : getLabel('paymentProd','Payment Product'),
									cls : 'f13 ux_font-size14 ux_padding0060'
								}, {
									xtype : 'combo',
									width : 160,	
									displayField : 'MYPPRODUCT',
									valueField : 'MYPPRODUCT',
									editable : false,
									store : fundProductStore,
									fieldCls : 'popup-form-field',
									triggerBaseCls : 'popup-form-trigger',
									itemId : 'fundProductCombo'
								}]
					},				
					{
						xtype : 'container',
						itemId : 'receiverAccountOuterContainer',
						columnWidth : 0.55,
						padding : '8 0 0 7',
						layout : 'vbox',
						items : [{
									xtype : 'label',
									text : getLabel('debitAccount',
									'Debit Account'),
									cls : 'f13 ux_font-size14 ux_padding0060 required'
								}, {
									xtype : 'container',
									itemId : 'receiverContainer',
									layout : 'hbox',
									items : [{
										xtype : 'AutoCompleter',
										fieldCls : 'xn-form-text w165 xn-suggestion-box',
										cls : 'ux_paddingb',
										itemId : 'fundDebitAccountCombo',
										name : 'Maker',
										cfgUrl : 'services/btrseek/btrfunddebitaccounts.json',
										cfgSeekId : 'Maker',
										cfgRootNode : 'd.preferences',
										cfgDataNode1 : 'ACMACCOUNT',
										cfgKeyNode : 'ACMACCOUNT'
									}, {
										xtype : 'label',
										itemId : 'creditAccountCcy',
										text : me.buyCcy,
										padding : '4 0 0 10'
									}]
								}, {
									xtype : 'container',
									itemId : 'creditAccountInfo',
									layout : 'hbox',
									items : [{
												xtype : 'label',
												itemId : 'creditAccountCcy',
												text : getLabel('accNameType', 'Account Name , Account Type')
											}]
								}]
					},	{
						xtype : 'container',
						itemId : 'paymentAmountOuterContainer',
						columnWidth : 0.45,
						padding : '8 0 0 7',
						height : 60,
						layout : 'vbox',
						items : [{
									xtype : 'label',
									text : getLabel('debitAmount',
									'Debit Amount'),
									cls : 'f13 ux_font-size14 ux_padding0060 required'
								}, {
									xtype : 'container',
									itemId : 'paymentAmountContainer',
									layout : 'hbox',
									items : [{
										xtype : 'numberfield',
										fieldCls : 'xn-valign-middle xn-form-text w10 xn-field-amount w165',
										itemId : 'fundAmount',
										allowBlank : false,
										hideTrigger : true
									}, {
										xtype : 'label',
										itemId : 'creditAmountCcy',
										text : me.buyCcy,
										padding : '4 0 0 10'
									}]
								}]
					}, {
						xtype : 'container',
						itemId : 'internalReferenceContainer',
						padding : '8 0 0 7',
						columnWidth : 0.55,
						layout : 'vbox',
						items : [{
							xtype : 'label',
							text : getLabel('internalReference',
									'Internal Reference'),
							cls : 'f13 ux_font-size14 ux_padding0060'
						}, {
							xtype : 'textfield',
							itemId : 'fundReference',
							allowBlank : false,
							width : 165,
							padding : '0 0 0 0'
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

		me.items = [parentView];
		me.on('beforeshow', function() {
					me.populateFundPaymentProductCombo();
					me.clearFundPopupFields();
				});
		me.callParent(arguments);
	},
	populateFundPaymentProductCombo : function(){
		var me = this , currentAccountId ,fundProductCombo ,fundProductComboStore;
		currentAccountId = me.accountFilter;
		fundProductCombo = me.down('combo[itemId="fundProductCombo"]');

		if (!Ext.isEmpty(fundProductCombo)) {
			fundProductComboStore = fundProductCombo.getStore();
			fundProductComboStore.proxy.extraParams = {
				$autofilter : currentAccountId
			};
			fundProductComboStore.load();
		} else {
			// console.log("Error Occured - paymentProductCombo is
			// empty");
		}
	},
	clearFundPopupFields : function() {
		var me = this;
		var fundParentPanelRef = me.down('form[itemId="fundParentPanel"]');
		if (!Ext.isEmpty(fundParentPanelRef)) {
			fundParentPanelRef.getForm().reset();
		}
	},
	getAddFundDetails : function(btn){
		var me = this;
		var productComboRef = me.down('combo[itemId="fundProductCombo"]');
		var debitAccountComboRef = me.down('combo[itemId="fundDebitAccountCombo"]');
		var fundAmountRef = me.down('numberfield[itemId="fundAmount"]');
		var fundReferenceRef = me.down('textfield[itemId="fundReference"]');
		var fundDateRef = me.down('datefield[itemId="fundDate"]');
		var errorLbl = me.down('label[itemId="errorLabel"]');
		
		var creditCcy = "USD";
		var debitCcy = "USD";
		var rateType = "CARD RATE";

		if (!Ext.isEmpty(productComboRef)) {
			var fundProduct = productComboRef.getRawValue();
			if (fundProduct === 'Select') {
				errorLbl.setText("Please Select Product");
				return;
			}
		}

		if (!Ext.isEmpty(debitAccountComboRef)) {
			var debitAccount = debitAccountComboRef.getRawValue();
			if (debitAccount === 'Select') {
				errorLbl.setText(getLabel('errorlbl.debit.acc', 'Please Select Debit Account'));
				return;
			}
		}

		if (!Ext.isEmpty(fundAmountRef)) {
			var fundAmount = fundAmountRef.getRawValue();
			if (fundAmount === '') {
				errorLbl.setText(getLabel('errorlbl.funding.amt', 'Please Select Funding Amount'));
				return;
			}
		}

		if (!Ext.isEmpty(fundReferenceRef)) {
			var fundReference = fundReferenceRef.getRawValue();
			if (fundReference === '') {
				errorLbl.setText(getLabel('errorlbl.ref', 'Please Enter Reference'));
				return;
			}
		}

		if (!Ext.isEmpty(fundDateRef)) {
			var fundDate = fundDateRef.getRawValue();
			if (fundDate === '') {
				errorLbl.setText(getLabel('errorlbl.paymentDate', 'Please Enter Payment Date'));
				return;
			}
		}

		var fundJsonData = me.getFundPopupJsonData(fundProduct, debitAccount,
				fundAmount, fundReference, fundDate, creditCcy, debitCcy,
				rateType);
		me.fireEvent('handleSendFundDetails', fundJsonData);
	},
	getFundPopupJsonData : function(fundProduct, debitAccount, fundAmount,
			fundReference, fundDate, creditCcy, debitCcy, rateType) {
		var me = this;
		var fundJsonData = '';
		fundJsonData = "{\"fundDetails\":" + "{";
		fundJsonData += "\"fundProduct\":" + "\"" + fundProduct + "\",";
		fundJsonData += "\"debitAccountNumber\":" + "\"" + debitAccount + "\",";
		fundJsonData += "\"fundAmount\":" + "\"" + fundAmount + "\",";
		fundJsonData += "\"fundReference\":" + "\"" + fundReference + "\",";
		fundJsonData += "\"fundDate\":" + "\"" + fundDate + "\",";
		fundJsonData += "\"creditCcy\":" + "\"" + creditCcy + "\",";
		fundJsonData += "\"debitCcy\":" + "\"" + debitCcy + "\",";
		fundJsonData += "\"rateType\":" + "\"" + rateType + "\"}}";

		return fundJsonData;
	}
});