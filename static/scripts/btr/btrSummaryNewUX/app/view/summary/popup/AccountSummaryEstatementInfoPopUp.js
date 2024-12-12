/**
 * @class GCP.view.summary.popup.AccountSummaryEstatementInfoPopUp
 * @extends Ext.window.Window
 * @author Sathish Miryala
 */
Ext.define('GCP.view.summary.popup.AccountSummaryEstatementInfoPopUp', {
	extend : 'Ext.window.Window',
	requires : ['Ext.form.field.Display', 'Ext.panel.Panel',
			'Ext.layout.container.Column', 'Ext.layout.container.VBox',
			'Ext.button.Button', 'Ext.container.Container'],
	xtype : 'accountSummaryEstatementInfoPopUp',
	title : getLabel('estatementInfo', 'eStatements'),
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
						itemId : 'eStatement',
						width : 520,
						height : 60,
						padding : '0 0 0 12',
						layout : 'column',
						items : [{
							xtype : 'container',
							itemId : 'eStatementAccountDisplayContainer',
							items : [{
										xtype : 'displayfield',
										fieldLabel : getLabel('account',
												'Account'),
										labelWidth : 120,
										itemId : 'accountDisplay1',
										name : 'accountDisplay1',
										cls : 'additional-info-label',
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
		var _url = 'services/balanceSummary/'+summaryType+'/estatementinfo.json';
		if(Ext.isDefined(me.record) 
				&& Ext.isDefined(me.record.raw) 
				&& Ext.isDefined(me.record.raw.isHistoryFlag) 
				&& me.record.raw.isHistoryFlag == 'H') {
			_url = 'services/balances/estatementinfo.json';
		}
		Ext.Ajax.request({
					url : _url,
					method : 'POST',
					jsonData : Ext.decode(jsonId),
					success : function(response) {
						var data = Ext.decode(response.responseText);
						me.setPopUpData(me.record);
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

		field = me.down('displayfield[itemId="accountDisplay1"]');
		strValue = record.get('accountNumber') || '';
		if (!Ext.isEmpty(field)) {
			field.setValue(strValue);
		}
	}
});
