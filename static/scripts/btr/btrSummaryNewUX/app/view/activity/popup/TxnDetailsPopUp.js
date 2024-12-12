/**
 * @class GCP.view.activity.popup.TxnDetailsPopUp
 * @extends Ext.window.Window
 * @author Vinay Thube
 */
Ext.define('GCP.view.activity.popup.TxnDetailsPopUp', {
	extend : 'Ext.window.Window',
	requires : ['Ext.panel.Panel', 'Ext.button.Button', 'Ext.form.Label',
			'Ext.container.Container', 'Ext.form.field.Text',
			'Ext.form.field.TextArea'],
	xtype : 'activityTxnDetailsPopUp',
	title : getLabel('txnDetails', 'Transaction Details'),
	width : 575,
	closeAction : 'hide',
	modal : true,
	layout : 'fit',
	recordId : null,
	currentAccountNumber : null,
	record : null,
	selectedAccCcy : null,
	accSubFacility : null,
	accountNmbr : null,
	sessionNmbr : null,
	sequenceNmbr : null,
	accountID : null,
	initComponent : function() {
		var me = this;
		var blnIsRemitTextHidden = objClientParameters['enableRemitText'] == true ? false : true; 
		var parentPanelView = Ext.create('Ext.panel.Panel', {
			width : 500,
			minHeight : 200,
			autoHeight : true,
			layout : {
				type : 'table',
				columns : 2
			},
			items : [{
						xtype : 'container',
						itemId : 'txnDateContainer',
						colspan : 1,
						layout : {
							type : 'vbox'
						},

						items : [{
									xtype : 'label',
									text : getLabel('txnDate',
											'Transaction Date'),
									cls : 'f13 ux_font-size14',
									padding : '6 0 6 8'
								}, {
									xtype : 'textfield',
									itemId : 'txndate',
									fieldCls : 'w165 xn-readonly',
									readOnly : true,
									padding : '2 0 0 5'

								}]

					}, {
						xtype : 'container',
						itemId : 'typeCodeDescContainer',
						layout : 'vbox',
						colspan : 1,
						items : [{
							xtype : 'label',
							text : getLabel('typeCodeDesc',
									'Type Code Description'),
							cls : 'f13 ux_font-size14',
							padding : '6 0 6 78'
						}, {
							xtype : 'textfield',
							itemId : 'typeCodeDesc',
							fieldCls : 'xn-readonly',
							width :228,
							readOnly : true,
							padding : '2 0 0 75'

						}]
					}, {
						xtype : 'container',
						itemId : 'amountContainer',
						layout : 'vbox',
						colspan : 1,
						items : [{
									xtype : 'label',
									text : getLabel('amount', 'Amount'),
									cls : 'f13 ux_font-size14',
									padding : '6 0 6 8'
								}, {
									xtype : 'textfield',
									itemId : 'amount',
									fieldCls : 'w165 xn-readonly xn-field-amount',
									readOnly : true,
									padding : '2 0 0 5'

								}]
					}, {
						xtype : 'container',
						itemId : 'accountContainer',
						layout : 'vbox',
						colspan : 1,
						items : [{
									xtype : 'label',
									text : getLabel('account', 'Account'),
									cls : 'f13 ux_font-size14',
									padding : '6 0 6 78'
								}, {
									xtype : 'textfield',
									itemId : 'accountId',
									fieldCls : 'w165  xn-readonly',
									readOnly : true,
									padding : '2 0 0 75'

								}]
					}, {
						xtype : 'container',
						itemId : 'bankRefContainer',
						layout : 'vbox',
						colspan : 1,
						items : [{
									xtype : 'label',
									text : getLabel('bankRef', 'Bank Reference'),
									cls : 'f13 ux_font-size14',
									padding : '6 0 6 8'
								}, {
									xtype : 'textfield',
									itemId : 'bankRef',
									fieldCls : 'xn-readonly',
									width :228,
									readOnly : true,
									padding : '2 0 0 5'

								}]
					}, {
						xtype : 'container',
						itemId : 'custRefContainer',
						layout : 'vbox',
						colspan : 1,
						items : [{
									xtype : 'label',
									text : getLabel('custRef',
											'Customer Reference'),
									cls : 'f13 ux_font-size14',
									padding : '6 0 6 78'
								}, {
									xtype : 'textfield',
									itemId : 'customerRef',
									fieldCls : 'xn-readonly',
									width : 228,
									readOnly : true,
									padding : '2 0 0 75'

								}]
					}, {
						xtype : 'container',
						itemId : 'textContainer',
						layout : 'vbox',
						colspan : 4,
						items : [{
									xtype : 'label',
									text : getLabel('text', 'Text'),
									cls : 'f13 ux_font-size14',
									padding : '6 0 6 8'
								}, {
									xtype : 'textarea',
									itemId : 'text',
									width : 535,
									fieldCls : 'xn-readonly',
									readOnly : true,
									margin : '0 0 0 5',
									height : 56
								}]
					}, {
						xtype : 'container',
						itemId : 'remTextContainer',
						layout : 'vbox',
						hidden : blnIsRemitTextHidden,
						colspan : 4,
						items : [{
							xtype : 'label',
							text : getLabel('remittanceText', 'Remittance Text'),
							cls : 'f13 ux_font-size14',
							padding : '6 0 6 8'
						}, {
							xtype : 'textarea',
							itemId : 'remText',
							readOnly : true,
							height : 56,
							margin : '0 0 0 5',
							width : 535,
							fieldCls : 'xn-readonly'
						}]
					},{
						xtype : 'container',
						itemId : 'orgNameContainer',
						layout : 'vbox',
						colspan : 1,
						items : [{
									xtype : 'label',
									text : getLabel('orgName', 'Originator Name'),
									cls : 'f13 ux_font-size14',
									padding : '6 0 6 8'
								}, {
									xtype : 'textfield',
									itemId : 'orgName',
									fieldCls : 'xn-readonly',
									width :228,
									readOnly : true,
									padding : '2 0 0 5'

								}]
					}, {
						xtype : 'container',
						itemId : 'checkNoContainer',
						layout : 'vbox',
						colspan : 1,
						items : [{
									xtype : 'label',
									text : getLabel('checkNo',
											'Check Number'),
									cls : 'f13 ux_font-size14',
									padding : '6 0 6 78'
								}, {
									xtype : 'textfield',
									itemId : 'checkNo',
									fieldCls : 'xn-readonly',
									width : 228,
									readOnly : true,
									padding : '2 0 0 75'

								}]
					},
					{
						xtype : 'container',
						itemId : 'fxRateContainer',
						layout : 'vbox',
						colspan : 1,
						items : [{
									xtype : 'label',
									text : getLabel('fxRate',
											'FX Rate'),
									cls : 'f13 ux_font-size14',
									padding : '6 0 6 8'
								}, {
									xtype : 'textfield',
									itemId : 'fxRate',
									fieldCls : 'xn-readonly',
									width : 228,
									readOnly : true,
									padding : '2 0 0 5'

								}]
					}],
			bbar : ['->', {
						xtype : 'button',
						margin : '10 6 0 0',
						text : getLabel('report', 'Report'),
						cls : 'xn-button ux_button-background-color ux_cancel-button',
						glyph : 'xf1c1@fontawesome',
						handler : function() {
							me.showReport(me.record);
						}
					},{
						xtype : 'button',
						margin : '10 0 0 0',
						text : getLabel('cancel', 'Cancel'),
						cls : 'xn-button ux_button-background-color ux_cancel-button',
						glyph : 'xf056@fontawesome',
						handler : function() {
							me.close();
						}
					}]
		});
		me.on('show', function() {
					me.showTxnDetails(me.record);
				});
		me.items = [parentPanelView];
		me.callParent(arguments);
	},
	showTxnDetails : function(record) {
		var me = this;
		var field = null, strValue = '';
		field = me.down('textfield[itemId="txndate"]');
		if (!Ext.isEmpty(field)) {
			field.setValue(record.get('postingDate') || '');
		}

		field = me.down('textfield[itemId="typeCodeDesc"]');
		if (!Ext.isEmpty(field)) {
			field.setValue(record.get('typeCodeDesc') || '');
		}

		field = me.down('textfield[itemId="customerRef"]');
		if (!Ext.isEmpty(field)) {
			field.setValue(record.get('customerRefNo') || '');
		}

		field = me.down('textarea[itemId="text"]');
		if (!Ext.isEmpty(field)) {
			field.setValue(record.get('text') || '');
		}

		strValue = me.getTxnAmount(record.get('creditUnit'), record
						.get('debitUnit'));
		field = me.down('textfield[itemId="amount"]');
		
		if (!Ext.isEmpty(strValue) && !Ext.isEmpty(field)) {
			if (strValue.indexOf("-") == 0) {
				strValue = strValue.substring(1);
				field.setValue("$" + (strValue));
				field.inputEl.addCls('red');
			} else {
				field.setValue("$" + strValue);
				if (field.inputEl.hasCls('red'))
					field.inputEl.removeCls('red');
			}
		} else if (!Ext.isEmpty(field)) {
			field.setValue('');
		}

		field = me.down('textfield[itemId="bankRef"]');
		if (!Ext.isEmpty(field)) {
			field.setValue(record.get('bankRef') || '');
		}

		field = me.down('textfield[itemId="accountId"]');
		if (!Ext.isEmpty(field)) {
			field.setValue(me.currentAccountNumber || '');
		}

		field = me.down('textfield[itemId="remText"]');
		if (!Ext.isEmpty(field)) {
			field.setValue(record.get('remittance') || '');
		}
		
		field = me.down('textfield[itemId="fxRate"]');
		if (!Ext.isEmpty(field)) {
			field.setValue(record.get('info1') || '');
		}
		if (mapService['loanSubFacility'] == me.accSubFacility)
		{
			field = me.down('container[itemId="checkNoContainer"]');
			field.hide();
			field = me.down('container[itemId="orgNameContainer"]');
			field.hide();
		}
		else
		{
			field = me.down('textfield[itemId="orgName"]');
		if (!Ext.isEmpty(field)) {
			field.setValue(record.get('info2') || '');
		}
		field = me.down('textfield[itemId="checkNo"]');
		if (!Ext.isEmpty(field)) {
			field.setValue(record.get('info3') || '');
		}
		}
		me.accountNmbr = record.get('accountNo') || '';
		me.sessionNmbr = record.get('sessionNumber') || '';
		me.sequenceNmbr = record.get('sequenceNumber') || '';
		me.accountID = record.get('accountId') || '';
	},
	getTxnAmount : function(creditUnit, debitUnit) {
		if (!Ext.isEmpty(creditUnit) && creditUnit != 0) {
			return creditUnit;
		} else if (!Ext.isEmpty(debitUnit) && debitUnit != 0) {
			return debitUnit;
		} else if ((Ext.isEmpty(debitUnit) || debitUnit === 0)
				&& (Ext.isEmpty(creditUnit) || creditUnit === 0)) {
			// console.log("Error Occured.. amount empty");
			return 0
		}
	},
	showReport : function(record) {
		var me = this;
		
		var field = null, strValue = '', txnType = '', reportType = 'I', remApplicable = 'Y';
		strValue = me.getTxnAmount(record.get('creditUnit'), record.get('debitUnit'));	
		reportType = record.get('isHistoryFlag');		
		if (!Ext.isEmpty(strValue)) {
			if (strValue.indexOf("-") == 0) {
				txnType = 'Debit';
			} else {
				txnType = 'Credit';
			}
		} else  {
			txnType = 'Credit';
		}
		var strUrl = 'services/btrActivities/'+summaryType+'/generateReport.pdf';
		strUrl += '?&$expand=txndetails';
		strUrl += '&$accountID=' + me.accountID;
		strUrl += '&$accountNmbr=' + me.accountNmbr;
		strUrl += '&$sequenceNmbr=' + me.sequenceNmbr;
		strUrl += '&$sessionNmbr=' + me.sessionNmbr;
		strUrl += '&$reportType=' + reportType; // TODO
		strUrl += '&$txnType=' + txnType; 
		strUrl += '&$remApplicable=' + remApplicable; // TODO
		form = document.createElement('FORM');
		form.name = 'frmMain';
		form.id = 'frmMain';
		form.method = 'POST';
		form.appendChild(me.createFormField('INPUT', 'HIDDEN',
					csrfTokenName, tokenValue));
		form.action = strUrl;
		document.body.appendChild(form);
		form.submit();
		document.body.removeChild(form);
	},
	createFormField : function(element, type, name, value) {
		var inputField;
		inputField = document.createElement(element);
		inputField.type = type;
		inputField.name = name;
		inputField.value = value;
		return inputField;
	}
});
