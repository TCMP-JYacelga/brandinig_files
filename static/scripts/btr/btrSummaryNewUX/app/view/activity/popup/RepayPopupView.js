/**
 * @class GCP.view.activity.popup.RepayPopupView
 * @extends Ext.window.Window
 * @author Shraddha Chauhan
 */
Ext.define('GCP.view.activity.popup.RepayPopupView', {
	extend : 'Ext.window.Window',
	requires : ['Ext.button.Button','Ext.form.Label','Ext.container.Container','Ext.form.field.Text','Ext.data.Store',
	            'Ext.form.field.ComboBox', 'Ext.ux.gcp.AutoCompleter'],
	xtype : 'repayPopupView',
	title : null,
	height : 350,
	width : 520,
	closeAction : 'hide',
	buyCcy : 'USD',	
	modal : true,
	accountId:null,
	layout : 'fit',
	currencyCode: null,
	currentAccountNumber : null,
	
	initComponent : function() {
		
		var me = this;
		
		var obligorSore = Ext.create('Ext.data.Store', {
			fields : ['key', 'value'],
			autoLoad : true,
			data : [{
						"key" : "obligor_id",
						"value" : "Obligor Id"
					}]
		});
		
		var obligationSore = Ext.create('Ext.data.Store', {
			fields : ['key', 'value'],
			autoLoad : true,
			data : [{
						"key" : "obligation_id",
						"value" : "Obligation Id"
					}]
		});
		
		var repayProductStore = Ext.create('Ext.data.Store', {
			fields : ['MYPPRODUCT', 'MYPDESCRIPTION'],
			proxy : {
				type : 'ajax',
				autoLoad : true,
				url : 'services/btrseek/btrRepayProducts?',
				reader : {
					type : 'json',
					root : 'd.preferences'
				}
			}
		});
		
		var repayDebitAccountStore = Ext.create('Ext.data.Store', {
			fields : ['ACMACCOUNT', 'ACMCURRENCY','ACMACCOUNTDESC','PRAPRODUCT'],
			proxy : {
				type : 'ajax',
				autoLoad : true,
				url : 'services/btrseek/btrfunddebitaccounts?',
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
			width : 290,
			height: 250,
			itemId:'repayParentPanel',
			layout : 'column',
			cls: 'form-pnl-cls',
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
						itemId : 'paymentPackageContainer',
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
						layout : 'hbox',
						itemId : 'paymentContainer',
						padding : '7 0 0 0',
						width : 500,
						columnWidth : 0.55,
						items : [{
								xtype : 'container',
								items : [{
								xtype : 'radiogroup',
								layout : 'hbox',
								itemId : 'paymentRadioGroup',
								items : [{
										boxLabel : getLabel('fullPayment', 'Full Payment'),
										name : 'paymentType'
										}, {
										boxLabel : getLabel('partialPayment', 'Partial Payment'),
										name : 'paymentType',
										padding : '0 0 0 3',
										checked : true
										}]
									}]
								}]
					}, {
						xtype : 'container',
						itemId:'repayDebitContainer',
						padding:'0 0 0 7',
						columnWidth : 0.55,
						layout : 'vbox',		
						items : [ {
									xtype : 'label',
									text : getLabel('debitAccount','Debit Account'),
									cls : 'f13 ux_font-size14 ux_padding0060 required'
								},{
									xtype : 'container',
									itemId : 'debitAccountContainer',
									layout : 'hbox',
									padding : '0 0 0 0',
									items : [{
										xtype : 'AutoCompleter',
										fieldCls : 'xn-form-text w165 xn-suggestion-box',
										cls : 'ux_paddingb',
										name: 'debitAccount',
										store: repayDebitAccountStore,
										displayField : 'ACMACCOUNT',
										valueField : 'ACMACCOUNT',
										itemId : 'debitAccountCombo',
										allowBlank: false		
									}, {
										xtype : 'label',
										itemId : 'repayCurrencyField',
										text : me.buyCcy,
										padding : '4 0 0 10'
									}]
								}, {
									xtype : 'container',
									itemId : 'creditAccountInfo',
									layout : 'hbox',
									items : [{
												xtype : 'label',
												itemId : 'repayAccountField',
												text : getLabel('accNameType', 'Account Name , Account Type')
											}]
								}]
					}, {
						xtype : 'container',
						padding:'8 0 0 7',
						itemId:'principalAmountContainer',
						columnWidth : 0.55,
						layout : 'vbox',						
						items : [{
								xtype : 'label',
 								text: getLabel("principalamount", "Principal Amount"),
								cls : 'f13 ux_font-size14'
								},
								{
								xtype : 'container',
 								itemId : 'principalAmountContainer',
								layout : 'hbox',
								padding : '0 0 0 0',
								items : [{
										xtype : 'numberfield',
										fieldCls : 'xn-valign-middle xn-form-text w10 xn-field-amount w165',
										itemId : 'principalAmount',
										allowBlank : false,
										hideTrigger : true
									}, {
										xtype : 'label',
										itemId : 'principalAmountCcy',
										text : me.buyCcy,
										padding : '4 0 0 10'
									}]
								}]
					}, {
						xtype : 'container',
						padding:'8 0 0 7',
						itemId:'interestAmountContainer',
						columnWidth : 0.45,
						layout : 'vbox',						
						items : [{
								xtype : 'label',
 								text: getLabel("interest", "Interest"),
								cls : 'f13 ux_font-size14'
								},
								{
								xtype : 'container',
 								itemId : 'interestContainer',
								layout : 'hbox',
								padding : '0 0 0 0',
								items : [{
										xtype : 'numberfield',
										fieldCls : 'xn-valign-middle xn-form-text w10 xn-field-amount w165',
										itemId : 'interestField',
										allowBlank : false,
										hideTrigger : true
									}, {
										xtype : 'label',
										itemId : 'interestCcy',
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
		this.items = [ parentView ];
		me.on('beforeshow', function() {
					me.clearRepayPopupFields();
				});
		this.callParent(arguments);
	},
	getLoanRepayDetails : function(btn) {
		var me = this;
		var parentPanelRef = me.down('form[itemId="repayParentPanel"]');
		if (!Ext.isEmpty(parentPanelRef))
			var formData = parentPanelRef.getValues();
		formData.rateType = "CARD RATE";
		formData.LoanAccNmbr = me.currentAccountNumber;
		me.fireEvent('handleLoanRepayDetails', formData);
	},
	clearRepayPopupFields : function(){
		var me = this;
		var parentPanelRef = me.down('form[itemId="repayParentPanel"]');
		if (!Ext.isEmpty(parentPanelRef)) {
			parentPanelRef.getForm().reset();
		}
	}
});

