/**
 * @class GCP.view.ExpandedWirePopup
 * @extends Ext.window.Window
 * @author Vinay Thube
 */
Ext.define('GCP.view.ExpandedWirePopup', {
	extend : 'Ext.window.Window',
	requires : ['Ext.form.field.Display', 'Ext.panel.Panel',
			'Ext.layout.container.Column', 'Ext.layout.container.VBox',
			'Ext.button.Button', 'Ext.container.Container', 'Ext.form.Panel'],
	xtype : 'expandedWirePopup',
	title : getLabel('incomingWire', 'Incoming Wire'),
	width : 700,
	closeAction : 'hide',
	autoHeight : true,
	modal : true,
	resizable : 'false',
	layout : 'fit',
	record : null,
	initComponent : function() {
		var me = this;
		me.items = [{
			xtype : 'form',
			itemId : 'expandedWireForm',
			items : [{
				xtype : 'panel',
				itemId : 'incomingWirePanel',
				layout : 'vbox',
				items : [{
					xtype : 'fieldset',
					width : '100%',
					title : 'Receiver Information',
					collapsible : false,
					layout : 'column',
					defaults : {
						labelWidth : 150,
						anchor : '100%',
						layout : {
							type : 'column',
							defaultMargins : {
								top : 0,
								right : 5,
								bottom : 0,
								left : 0
							}
						}
					},
					items : [{
						xtype : 'panel',
						columnWidth : 0.5,
						// height : 50,
						layout : 'vbox',
						items : [{
							xtype : 'panel',
							layout : 'hbox',
							items : [{
								xtype : 'textfield',
								name : 'receiverAccCcy',
								labelWidth : 150,
								width : 200,
								fieldLabel : getLabel('btr.fed.amount',
										'Amount'),
								readOnly : true,
								margin : '0 5 5 0',
								fieldCls : 'xn-readonly'
							}, {
								xtype : 'textfield',
								name : 'paymentAmount',
								readOnly : true,
								width : 100,
								fieldCls : 'rightAlign xn-readonly'
							}]
						}, {
							xtype : 'textfield',
							name : 'fedReference',
							labelWidth : 150,
							fieldLabel : getLabel('btr.fed.ref',
									'Fed Reference'),
							readOnly : true,
							fieldCls : 'xn-readonly'
						}, {
							xtype : 'textfield',
							name : 'receiverAccNmbr',
							labelWidth : 150,
							fieldLabel : getLabel('btr.fed.accNo',
									'Account'),
							readOnly : true,
							fieldCls : 'xn-readonly'
						}]
					}, {
						xtype : 'panel',
						columnWidth : 0.5,
						layout : 'vbox',
						items : [{
							xtype : 'textfield',
							name : 'valueDate',
							labelWidth : 150,
							fieldLabel : getLabel('btr.fed.valueDate',
									'Value Date'),
							readOnly : true,
							fieldCls : 'xn-readonly'
						}, {
							xtype : 'textfield',
							name : 'customerRef',
							labelWidth : 150,
							fieldLabel : getLabel('btr.fed.custref',
									'Customer Reference'),
							readOnly : true,
							fieldCls : 'xn-readonly'
						}, {
							xtype : 'textfield',
							name : 'receiverAccName',
							labelWidth : 150,
							fieldLabel : getLabel('btr.fed.accountName',
									'Account Name'),
							readOnly : true,
							fieldCls : 'xn-readonly'
						}]
					}]
				}, {
					xtype : 'fieldset',
					width : '100%',
					title : getLabel('btr.fed.sendingbankinfo',
							'Sending Bank Information'),
					collapsible : false,
					layout : 'vbox',
					defaults : {
						labelWidth : 150,
						anchor : '100%',
						layout : {
							type : 'vbox',
							defaultMargins : {
								top : 0,
								right : 5,
								bottom : 0,
								left : 0
							}
						}
					},
					items : [{
								xtype : 'textfield',
								name : 'senderBankName',
								fieldLabel : getLabel('btr.fed.bankName',
										'Name'),
								labelWidth : 150,
								readOnly : true,
								fieldCls : 'xn-readonly'
							}, {
								xtype : 'textfield',
								name : 'senderBankFiID',
								fieldLabel : getLabel('btr.fed.fid', 'FID'),
								labelWidth : 150,
								readOnly : true,
								fieldCls : 'xn-readonly'
							}, {
								xtype : 'textfield',
								name : 'senderName',
								labelWidth : 150,
								fieldLabel : getLabel('btr.fed.senderName',
										'Sender Name'),
								readOnly : true,
								fieldCls : 'xn-readonly'
							}, {
								xtype : 'textfield',
								name : 'senderAddr',
								labelWidth : 150,
								fieldLabel : getLabel('btr.fed.senderadd1',
										'Sender Address 1'),
								readOnly : true,
								fieldCls : 'xn-readonly'
							}, {
								xtype : 'textfield',
								name : 'senderAddress2',
								labelWidth : 150,
								fieldLabel : getLabel('btr.fed.senderadd2',
										'Sender Address 2'),
								readOnly : true,
								fieldCls : 'xn-readonly'
							}, {
								xtype : 'textfield',
								name : 'senderAddress3',
								labelWidth : 150,
								fieldLabel : getLabel('btr.fed.senderadd3',
										'Sender Address 3'),
								readOnly : true,
								fieldCls : 'xn-readonly'
							}]
				}, {
					xtype : 'fieldset',
					width : '100%',
					title : 'Other Information',
					collapsible : false,
					layout : 'column',
					defaults : {
						labelWidth : 100,
						anchor : '100%',
						layout : {
							type : 'column',
							defaultMargins : {
								top : 0,
								right : 5,
								bottom : 0,
								left : 0
							}
						}
					},
					items : [{
						xtype : 'textareafield',
						columnWidth : 0.5,
						name : 'orderInfo',
						fieldLabel : getLabel('btr.fed.orderinfo',
								'By Order Of Information'),
						cols : 10,
						margin : '0 10 5 0',
						readOnly : true,
						fieldCls : 'xn-readonly'
					}, {
						xtype : 'textareafield',
						columnWidth : 0.5,
						name : 'additionalInfo',
						fieldLabel : getLabel('btr.fed.additionalinfo',
								'Additional Information'),
						cols : 10,
						margin : '0 10 5 0',
						readOnly : true,
						fieldCls : 'xn-readonly'
					}]
				}]
			}]
		}];

		me.buttons = [{
					text : getLabel('ok', 'OK'),
					glyph:'xf058@fontawesome',
					cls : 'xn-button ux_button-background-color ux_button-padding',
					handler : function(btn, opts) {
						me.close();
					}
				}];
		me.on('beforeshow', function() {
					//me.showExpandedWirePopup(me.record);
				});
		me.callParent(arguments);
	},
	showExpandedWirePopup : function(record) {
		var me = this;
		var objPopUp = me.expandedWirePopup;
		Ext.Ajax.request({
			url : 'services/btrIncomingWireInfo.json',
			method : 'POST',
			async : false,
			jsonData : Ext.encode({
						id : record.get('identifier'),
						valueDate : record.get('valueDate'),
						fedReference : record.get('fedReference'),
						customerRefNo : record.get('customerRefNo'),
						txnAmount : record.get('txnAmount'),
						info19 : record.get('info19')

					}),
			success : function(response) {
				var data = Ext.decode(response.responseText);
				if (data && data.d && !Ext.isEmpty(data.d.incomingWire)
						&& data.d.incomingWire !== 'null') {
					var arrData = data.d.incomingWire;
					var objRec = null;
					if (arrData.length > 1) {
						Ext.MessageBox.show({
							title : getLabel('btrWarnPopUpTitle', 'Warn'),
							msg : getLabel('btrWarnPopUpMsg',
									'Multiple records found for this transaction..!'),
							buttons : Ext.MessageBox.OK,
							icon : Ext.MessageBox.WARNING
						});

					} else {
						objRec = arrData[0];
						me.setFedWireFormData(objRec);
						me.show();
					}

				} else {
					Ext.MessageBox.show({
								title : getLabel('btrWarnPopUpTitle', 'Warn'),
								msg : getLabel('btrWarnNoRecordFoundPopUpMsg',
										'No record found for this transaction..!'),
								buttons : Ext.MessageBox.OK,
								icon : Ext.MessageBox.WARNING
							});
				}

			},
			failure : function(response) {
				Ext.MessageBox.show({
							title : getLabel('instrumentErrorPopUpTitle',
									'Error'),
							msg : getLabel('instrumentErrorPopUpMsg',
									'Error while fetching data..!'),
							buttons : Ext.MessageBox.OK,
							icon : Ext.MessageBox.ERROR
						});
			}

		});

	},
	setFedWireFormData : function(data) {
		var me = this;
		var form = me.down('form[itemId="expandedWireForm"]');

		if (form) {
			form.getForm().reset();
			if (data)
				form.getForm().setValues(data);
		}
	}
});
