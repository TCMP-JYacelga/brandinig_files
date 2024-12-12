/**
 * @class GCP.view.summary.popup.AccountSummaryAdditioalInfoPopUp
 * @extends Ext.window.Window
 * @author Shraddha Chauhan
 */
Ext.define('GCP.view.summary.popup.AccountSummaryAdditioalInfoPopUp', {
	extend : 'Ext.window.Window',
	requires : ['Ext.form.field.Display', 'Ext.panel.Panel',
			'Ext.layout.container.Column', 'Ext.layout.container.VBox',
			'Ext.button.Button', 'Ext.container.Container'],
	xtype : 'accountSummaryAdditioalInfoPopUp',
	title : getLabel('additionalInfo', 'View Additional Information'),
	width : 570,
	closeAction : 'hide',
	autoHeight : true,
	modal : true,
	layout : 'fit',
	recordId : null,
	currentAccountNumber : null,
	record : null,
	selectedAccCcy : null,
	initComponent : function() {
		var me = this;
		var parentPanelView = Ext.create('Ext.panel.Panel', {
					width : 520,
					autoHeight : true,
					itemId : 'parentPanel',
					layout : {
						type : 'vbox'
					},
					items : [{
						xtype : 'panel',
						itemId : 'accountDetailsPanel',
						width : 520,
						height : 60,
						padding : '0 0 0 12',
						layout : 'column',
						items : [{
							xtype : 'container',
							itemId : 'accountDisplayContainer',
							items : [{
										xtype : 'displayfield',
										fieldLabel : getLabel('account',
												'Account'),
										labelWidth : 120,
										itemId : 'accountDisplay',
										name : 'accountDisplay',
										cls : 'additional-info-label',
										labelSeparator : '',
										width : 280
									}]
						}, {
							xtype : 'container',
							itemId : 'currencyDisplayContainer',
							items : [{
										xtype : 'displayfield',
										fieldLabel : getLabel('currency',
												'Currency'),
										labelWidth : 120,
										itemId : 'currencyDisplay',
										name : 'currencyDisplay',
										cls : 'additional-info-label',
										labelSeparator : '',
										width : 200
									}]
						}, {
							xtype : 'container',
							itemId : 'dateDisplayContainer',
							items : [{
								xtype : 'displayfield',
								fieldLabel : getLabel('summarydate',
										'Summary Date'),
								labelWidth : 120,
								itemId : 'dateDisplay',
								name : 'dateDisplay',
								labelSeparator : '',
								width : 280
							}]
						}]
					}, {
						xtype : 'label',
						cls : 'page-heading-bottom-border',
						width : 550
					}, {
						xtype : 'panel',
						itemId : 'txnDetailsPanel',
						margin : '15 0 0 10',
						cls : 'xn-panel',
						border : false,
						width : 520,
						layout : 'column',
						items : []
					}, {
						xtype : 'panel',
						itemId : 'errorPanel',
						margin : '15 0 0 10',
						hidden : true,
						items : [{
							xtype : 'label',
							cls : 'red',
							itemId : 'errorLabel',
							text : getLabel('noDataToDisplay',
									'No Data To Display')
						}]
					}]
				});
		me.items = [parentPanelView];
		me.buttons = [{
					text : getLabel('ok', 'OK'),
					glyph:'xf058@fontawesome',
					cls : 'xn-button ux_button-background-color ux_button-padding',
					handler : function(btn, opts) {
						me.close();
					}
				}]
		me.on('beforeshow', function() {
					me.showAdditionalInfo();
				});
		me.callParent(arguments);
	},
	showAdditionalInfo : function() {
		var me = this;
		var panel = me.down('panel[itemId="txnDetailsPanel"]');
		var errorPanel = me.down('panel[itemId="errorPanel"]');
		var jsonId = "{\"identifier\":" + "\"" + me.recordId + "\"}";
		var _url = 'services/balanceSummary/'+summaryType+'/additionalinfo.json';
		if(Ext.isDefined(me.record) 
				&& Ext.isDefined(me.record.raw) 
				&& Ext.isDefined(me.record.raw.isHistoryFlag) 
				&& me.record.raw.isHistoryFlag == 'H') {
			_url = 'services/balances/additionalinfo.json';
		}
		Ext.Ajax.request({
					url : _url,
					method : 'POST',
					jsonData : Ext.decode(jsonId),
					success : function(response) {
						var data = Ext.decode(response.responseText);
						me.setPopUpData(me.record);
						var showFlag = me.setDetailData(data);
							if (showFlag) {
								panel.show();
								errorPanel.hide();
							} else {
								panel.hide();
								errorPanel.show();
							}
					},
					failure : function(response) {
						// console.log("Error Occured - while fetching account
						// activity notes");
					}

				});
	},
	setPopUpData : function(record) {
		var me = this;
		var field = null, strValue = '';

		field = me.down('displayfield[itemId="accountDisplay"]');
		strValue = record.get('accountNumber') || '';
		if (!Ext.isEmpty(field)) {
			field.setValue(strValue);
		}

		field = me.down('displayfield[itemId="currencyDisplay"]');
		strValue = record.get('currencyCode') || '';
		if (!Ext.isEmpty(field)) {
			field.setValue(strValue);
		}

		field = me.down('displayfield[itemId="dateDisplay"]');
		strValue = record.get('summaryDate') || '';
		if (!Ext.isEmpty(field)) {
			field.setValue(strValue);
		}
	},
	setDetailData : function(jsonData) {
		var me = this;
		var arrLabels = jsonData.summaryInfoLabels;
		var arrValues = jsonData.summaryInfoValues;
		var panelDetail = me.down('panel[itemId="txnDetailsPanel"]');

		if (!Ext.isEmpty(panelDetail)) {
			panelDetail.removeAll();
			if (Ext.isEmpty(arrLabels)) {
				return false;
			}
			if (arrLabels.length != arrValues.length) {
				return false;
			}
			if (!Ext.isEmpty(arrLabels) && !Ext.isEmpty(arrValues)) {
				var labelsListLength = arrLabels.length;
				if (arrLabels.length == arrValues.length) {
					for (var index = 0; index < labelsListLength; index++) {
						if (!Ext.isEmpty(arrLabels[index])) {
							var currentContainer = Ext.create(
									'Ext.container.Container', {
										itemId : 'container_dtl_'
												+ index,
										items : [{
													xtype : 'displayfield',
													fieldLabel : getLable(arrLabels[index],arrLabels[index]),
													labelWidth : 170,
													itemId : arrLabels[index],
													name : arrLabels[index],
													cls : 'additional-info-label',
													value : arrValues[index],
													width : 285
												}]
									});
							panelDetail.add(currentContainer);
						}
					}
					return true;
				}
			}
		}
	}
});
