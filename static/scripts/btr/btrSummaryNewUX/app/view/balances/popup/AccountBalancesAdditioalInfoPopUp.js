/**
 * @class GCP.view.balances.popup.AccountBalancesAdditioalInfoPopUp
 * @extends Ext.window.Window
 * @author Shraddha Chauhan
 */
Ext.define('GCP.view.balances.popup.AccountBalancesAdditioalInfoPopUp', {
	extend : 'Ext.window.Window',
	requires : ['Ext.form.field.Display', 'Ext.panel.Panel',
			'Ext.layout.container.Column', 'Ext.layout.container.VBox',
			'Ext.button.Button', 'Ext.container.Container'],
	xtype : 'accountBalancesAdditioalInfoPopUp',
	title : getLabel('additionalInfo', 'Additional Information'),
	width : 820,
	closeAction : 'hide',
	autoHeight : true,
	resizable: false,
	draggable: false,
	maxHeight: 550,
	minHeight:156,
	modal : true,
	tabIndex : "1",
	layout : 'fit',
	cls : 'x-windows-viewPopup xn-popup',
	recordId : null,
	currentAccountNumber : null,
	record : null,
	selectedAccCcy : null,
	accNumber : 'None',
	currency : 'None',
	summaryDate : 'None',
	initComponent : function() {
		var me = this;
		var parentPanelView = Ext.create('Ext.panel.Panel', {
					width : 795,
					autoHeight : true,
					itemId : 'parentPanel',
					/*layout : {
						type : 'vbox'
					},*/
					layout : 'column',
					items : [{
						xtype : 'panel',
						itemId : 'accountDetailsPanel',
						width : 810,
						//height : 60,
						//padding : '0 0 0 12',
						layout : 'column',
						items : [{
							xtype : 'container',
							itemId : 'accountDisplayContainer',
							columnWidth : 0.3340,
							items : [{
										xtype : 'displayfield',
										fieldLabel : getLabel('account#',
												'Account'),
										labelWidth : 'auto',
										itemId : 'accountDisplay',
										name : 'accountDisplay',
										cls : 'additional-info-label',
										labelSeparator : ' : ',
										//width : 280,
										listeners: {
									       render: function(c) {
									    	   			var tip = Ext.create('Ext.tip.ToolTip', {
									            	    target: c.getEl(),
									            	    listeners:{
									            	    	beforeshow:function(tip){
									            	    		tip.update(me.accNumber)
									            	    	}
									            	    }
									            	});
									       }
										}
									}]
						}, {
							xtype : 'container',
							itemId : 'currencyDisplayContainer',
							columnWidth : 0.3340,
							items : [{
										xtype : 'displayfield',
										fieldLabel : getLabel('currency',
												'Currency'),
										labelWidth : 'auto',
										itemId : 'currencyDisplay',
										name : 'currencyDisplay',
										cls : 'additional-info-label txnDetails-displayfield',
										labelSeparator : ' : ',
										//width : 200,
										listeners: {
									       render: function(c) {
								    	   			var tip = Ext.create('Ext.tip.ToolTip', {
								            	    target: c.getEl(),
								            	    listeners:{
								            	    	beforeshow:function(tip){
								            	    		tip.update(me.currency)
								            	    	}
								            	    }
								            	});
									       }
										}
										
									}]
						}, {
							xtype : 'container',
							itemId : 'dateDisplayContainer',
							columnWidth : 0.3340,
							items : [{
								xtype : 'displayfield',
								fieldLabel : getLabel('summarydate',
										'Summary Date'),
								labelWidth : 'auto',
								//labelCls: 'left-margin',
								itemId : 'dateDisplay',
								name : 'dateDisplay',
								cls : 'additional-info-label txnDetails-displayfield',
								labelSeparator : ' : ',
								//width : 280,
								listeners: {
							       render: function(c) {
						    	   			var tip = Ext.create('Ext.tip.ToolTip', {
						            	    target: c.getEl(),
						            	    listeners:{
						            	    	beforeshow:function(tip){
						            	    		tip.update(me.summaryDate)
						            	    	}
						            	    }
						            	});
							       }
								}
							}]
						}]
					}, /*{
						xtype : 'label',
						cls : 'page-heading-bottom-border borderPanel-section-line',
						width : 550
					},*/ {
						xtype : 'panel',
						itemId : 'txnDetailsPanel',
						//margin : '15 0 0 10',
						//cls : 'xn-panel',
						border : false,
						width : 810,
						layout : 'column',
						defaults: { 
						    columnWidth: 0.3340
						},
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
		this.items = [parentPanelView];
		me.bbar = [{
					xtype:'button',
					text : getLabel('btnClose', 'Close'),
					tabIndex :"1",
					cls:'ft-button ft-button-light',
					id : "btnshowAdditionalInfoClose",
					handler : function(btn, opts) {
						me.close();
					}
				}];
		me.on('beforeshow', function() {
					me.showAdditionalInfo();					
				});
		this.callParent(arguments);
	},
	showAdditionalInfo : function() {
		var me = this;
		var panel = me.down('panel[itemId="txnDetailsPanel"]');
		var btnf = panel.down(panel['itemId="btnshowAdditionalInfoClose"']);
		var errorPanel = me.down('panel[itemId="errorPanel"]');		
		var jsonId = "{\"identifier\":\"" + me.recordId + "\"}";
		Ext.Ajax.request({
					url : 'services/btrBalanceHistory/'+summaryType+'/additionalinfo.json',
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
						//btnf.focus();
						Ext.getCmp('btnshowAdditionalInfoClose').focus();
					},
					failure : function(response) {
						// console.log("Error Occured - while fetching
						// account
						// activity notes");
					}
				});
	},
	setPopUpData : function(record) {
		var me = this;
		var field = null, strValue = '';

		field = me.down('displayfield[itemId="accountDisplay"]');
		strValue = me.currentAccountNumber || '';
		if (!Ext.isEmpty(field) && !Ext.isEmpty(strValue)) {
			field.setValue(strValue);
			me.accNumber = strValue ;
		}

		field = me.down('displayfield[itemId="currencyDisplay"]');
		strValue = me.selectedAccCcy || '';
		if (!Ext.isEmpty(field) && !Ext.isEmpty(strValue)) {
			field.setValue(strValue);
			me.currency = strValue;
		}

		field = me.down('displayfield[itemId="dateDisplay"]');
		strValue = record.get('date') || '';
		if (!Ext.isEmpty(field) && !Ext.isEmpty(strValue)) {
			field.setValue(strValue);
			me.summaryDate=strValue;
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
						//remove duplicate fields Ccy desc and Account
						if(arrLabels[index]=="Account"){
							delete arrLabels[index];
							delete arrValues[index];
						}	
						if(arrLabels[index]=="Currency"){
							delete arrLabels[index];
							delete arrValues[index];
						}
						if (!Ext.isEmpty(arrValues[index])) {
							var currentContainer = Ext.create(
									'Ext.container.Container', {
										itemId : 'container_'
												+ arrLabels[index],
										//columnWidth : 0.3326,		
										items : [{
													xtype : 'displayfield',
													fieldLabel : getLabel(arrLabels[index],arrLabels[index]),
													labelWidth : 'auto',
													itemId : arrLabels[index],
													name : arrLabels[index],
													cls : 'additional-info-label txnDetails-displayfield',
													value : arrValues[index],
													//width : 285,
													listeners: {
														beforerender : function(){
															   if(arrLabels[index]=="Account type")
															   this.addCls('tabClass');   
														   },
													       render: function(c) {
													    	   			var tip = Ext.create('Ext.tip.ToolTip', {
													            	    target: c.getEl(),
													            	    html: arrValues[index]
													            	});
													       }
													}
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
