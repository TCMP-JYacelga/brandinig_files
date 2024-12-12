/**
 * @class GCP.view.activity.popup.PaymentPopupView
 * @extends Ext.window.Window
 * @author Shraddha Chauhan
 */
Ext.define('GCP.view.activity.popup.PaymentPopupView', {
	extend : 'Ext.window.Window',
	requires : ['Ext.button.Button', 'Ext.form.Label',
			'Ext.container.Container', 'Ext.form.field.Text', 'Ext.data.Store',
			'Ext.form.field.ComboBox', 'Ext.XTemplate',
			'Ext.ux.gcp.AutoCompleter'],
	xtype : 'paymentPopupView',
	title : null,
	minHeight : 280,
	autoHeight : true,
	width : 510,
	closeAction : 'hide',
	modal : true,
	buyCcy : 'USD',
	accountFilter : null,
	currentAccountNumber : null,
	initComponent : function() {
		var me = this;
		var paymentProductStore = Ext.create('Ext.data.Store', {
					fields : ['MYPPRODUCT', 'MYPDESCRIPTION'],
					proxy : {
						type : 'ajax',
						autoLoad : false,
						url : 'services/btrseek/btrpaymentproducts.json?$top=-1',
						reader : {
							type : 'json',
							root : 'd.preferences'
						}
					}
				});

		var currencyList = Ext.create('Ext.data.Store', {
					fields : ['CODE', 'DESCR', 'SYMBOL'],
					proxy : {
						type : 'ajax',
						autoLoad : true,
						url : 'services/userseek/paymentccy.json?$top=-1',
						reader : {
							type : 'json',
							root : 'd.preferences'
						}
					}
				});

		var rateList = new Ext.data.Store({
					fields : ['contractCode', 'contractDescription'],
					autoLoad : true
				});

		var receiverAccounts = Ext.create('Ext.data.Store', {
					fields : ['DRAWER_CODE', 'DRAWER_BENEFICARY_FLAG'],
					proxy : {
						type : 'ajax',
						url : 'services/userseek/btrreceivercodes.json?$top=-1',
						reader : {
							type : 'json',
							root : 'd.preferences'
						}
					},
					autoLoad : true
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
			minHeight : 220,
			autoHeight : true,
			itemId : 'paymentParentPanel',
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
					}, '->', {
						xtype : 'button',
						text : getLabel('submit', 'Submit'),
						cls : 'ux_button-background-color ux_font-color-black',
						itemId : 'addPaymentSubmitButton',
						formBind : true,
						handler : function(btn, opts) {
							me.getAddPaymentDetails(btn);
						}

					}],
			items : [{
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
					}, {
						xtype : 'container',
						itemId : 'productContainer',
						padding : '10 0 0 7',
						height : 50,
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
									store : paymentProductStore,
									fieldCls : 'popup-form-field',
									triggerBaseCls : 'popup-form-trigger',
									itemId : 'paymentProductCombo'
								}]
					}, {
						xtype : 'container',
						itemId : 'creditAccountOuterContainer',
						columnWidth : 0.55,
						padding : '8 0 0 7',
						layout : 'vbox',
						items : [{
									xtype : 'label',
									text : getLabel('creditAccount',
											'Credit Account'),
									cls : 'f13 ux_font-size14 ux_padding0060 required'
								}, {
									xtype : 'container',
									itemId : 'creditAccountContainer',
									layout : 'hbox',
									items : [{
										xtype : 'AutoCompleter',
										fieldCls : 'xn-form-text w165 xn-suggestion-box',
										cls : 'ux_paddingb',
										itemId : 'creditAccount',
										name : 'Maker',
										cfgUrl : 'services/userseek/btrreceivercodes.json',
										cfgSeekId : 'Maker',
										cfgRootNode : 'd.preferences',
										cfgDataNode1 : 'DRAWER_CODE',
										cfgDataNode2 : 'DRAWER_BENEFICARY_FLAG',
										cfgKeyNode : 'DRAWER_CODE'
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
												text : getLabel('accNameType','Account Name , Account Type')
											}]
								}]
					}, {
						xtype : 'container',
						itemId : 'creditAmountOuterContainer',
						columnWidth : 0.45,
						padding : '8 0 0 7',
						layout : 'vbox',
						items : [{
									xtype : 'label',
									text : getLabel('creditAmount',
											'Credit Amount'),
									cls : 'f13 ux_font-size14 ux_padding0060 required'
								}, {
									xtype : 'container',
									itemId : 'creditAmountContainer',
									layout : 'hbox',
									items : [{
										xtype : 'numberfield',
										fieldCls : 'xn-valign-middle xn-form-text w10 xn-field-amount w165',
										itemId : 'creditAmount',
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
							itemId : 'internalReference',
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
					me.clearPaymentPopupFields();
					me.populatePaymentProductCombo();
					me.populatePaymentPackageCombo();
				});
		me.callParent(arguments);
	},
	populatePaymentPackageCombo : function() {
		var me = this;
		var combo =  me.down('combo[itemId="paymentPackageCombo"]');
		var objComboStore = combo.getStore();
		if(!Ext.isEmpty(objComboStore)){
		var data = objComboStore.data.items;
		var recordSelected = objComboStore.getAt(0);  
		if(!Ext.isEmpty(recordSelected))
		combo.setValue(recordSelected.get('value'));
		 if(!Ext.isEmpty(data) && data.length === 1)
			combo.setDisabled(true);
		 else 
			combo.setDisabled(false);
		} 
	},
	populatePaymentProductCombo : function() {
		var me = this, paymentProductComboStore, currentAccountId, paymentProductCombo;
		currentAccountId = me.accountFilter;
		paymentProductCombo = me.down('combo[itemId="paymentProductCombo"]');

		if (!Ext.isEmpty(paymentProductCombo)) {
			paymentProductComboStore = paymentProductCombo.getStore();
			paymentProductComboStore.proxy.extraParams = {
				$autofilter : currentAccountId
			};
			paymentProductComboStore.load();
		} else {
			// console.log("Error Occured - paymentProductCombo is
			// empty");
		}
	},
	clearPaymentPopupFields : function() {
		var me = this;
		var paymentParentPanelRef = me
				.down('form[itemId="paymentParentPanel"]');
		if (!Ext.isEmpty(paymentParentPanelRef)) {
			paymentParentPanelRef.getForm().reset();
		}
	},
	getAddPaymentDetails : function() {
		var me = this;
		var paymentParentPanelRef = me
				.down('form[itemId="paymentParentPanel"]');
		if (!Ext.isEmpty(paymentParentPanelRef))
			var paymentFormData = paymentParentPanelRef.getValues();
		paymentFormData.currentAccNumber = me.currentAccountNumber;
		paymentFormData.currentCcy = "USD";
		me.fireEvent('handleSendPaymentDetails', paymentFormData);
	},
	handlePaymentRateType : function(combo, newValue, oldValue, eOpts) {
		var me = this;
		var rateTypeComboRef = me.down('combo[itemId="paymentRateTypeCombo"]');
		var newbuyCcy = combo.value;
		var sellCcy = me.buyCcy;
		if (newbuyCcy !== sellCcy) {
			if (!Ext.isEmpty(rateTypeComboRef)) {
				rateTypeComboRef.setDisabled(false);
				me.setPaymentRateTypes(rateTypeComboRef, combo, newbuyCcy,
						sellCcy);
			}
		} else {
			rateTypeComboRef.setDisabled(true);
		}
	},
	setPaymentRateTypes : function(rateTypeComboRef, combo, buyCcy, sellCcy) {
		var me = this;
		rateTypeUrl = 'services/activities/getContractRates';
		rateTypeUrl += '?&$sellCcy=' + sellCcy;
		rateTypeUrl += '&$buyCcy=' + buyCcy;
		Ext.Ajax.request({
					url : rateTypeUrl,
					method : 'GET',
					success : function(response) {
						var data = Ext.decode(response.responseText);
						var list = data.d;
						var arrData = new Array();
						arrData.push({
									"contractCode" : "CARD_RATE",
									"contractDescription" : "CARD RATE"
								});
						arrData.push({
									"contractCode" : "CONTRACT_RATE",
									"contractDescription" : "CONTRACT RATE"
								});
						Ext.each(list, function(ccyBean) {
									arrData.push(ccyBean);
								});
						rateTypeComboRef.getStore().loadRawData(arrData);
						rateTypeComboRef.on('beforeselect', function(combo,
										record) {
									if (record.data.contractCode == "CONTRACT_RATE") {
										return false;
									}
								});
					},
					failure : function(response) {
					}

				});
	}
});