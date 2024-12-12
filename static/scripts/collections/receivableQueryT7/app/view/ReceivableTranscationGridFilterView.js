Ext.define("GCP.view.ReceivableTranscationGridFilterView",{
	extend:'Ext.panel.Panel',
	requires:['Ext.ux.gcp.AutoCompleter'],
	xtype : 'receivableTranscationGridFilterView',
	layout:'hbox',
	initComponent : function() {
		var me=this;
		me.items=[{
			xtype : 'container',
			itemId : 'productContainer',
			layout : 'vbox',
			width : '30%',
			padding : '0 30 0 0',
			items : [{
				xtype : 'label',
				text : getLabel("colQryAdvFltTxnRefNo","Transaction Reference"),
				padding : '0 0 0 10'
				
			},{
				xtype:'textfield',
				triggerAction : 'all',
				fieldCls : 'form-control',
				itemId : 'batchProduct',
				width : '100%',
				enforceMaxLength: true,
				maxLength: '20',
				padding : '-4 0 0 0',
				mode : 'local',
				listeners : {
					'blur' : function(combo, record) {
						$(document).trigger("productComboSelect",[combo.getValue(),combo.getRawValue()]);
					}
				}
			}]	
		},{
			xtype : 'container',
			itemId : 'ReceiverAccountContainer',
			layout : 'vbox',
			width : '30%',
			padding : '0 30 0 0',
			items : [{
				xtype : 'label',
				text : getLabel("payerName","Payer Name")
			},{
				xtype:'AutoCompleter',
				fieldCls : 'xn-suggestion-box',
				itemId : 'batchReceiverAccount',
				width : '100%',
				enforceMaxLength: true,
				maxLength: '40',
				padding : '-4 0 0 0',
				cfgUrl : 'services/userseek/txnQDrawerNameSeek.json',
				cfgRecordCount : -1,
				cfgQueryParamName : '$autofilter',
				cfgExtraParams:[{key:'$filtercode1',
								value:strIdentifier
								}],
				cfgRootNode : 'd.preferences',
				cfgDataNode1 : 'DESCRIPTION',
				cfgKeyNode : 'DESCRIPTION',
				listeners:{
					'blur':function(combo,record){
						$(document).trigger("receiverAccountComboSelect",[combo.getValue(),combo.getRawValue()]);
					}
				}
			}]	
		},{
			xtype : 'container',
			itemId : 'ReceiverNameContainer',
			layout : 'vbox',
			width : '30%',
			padding : '0 30 0 0',
			items : [{
				xtype : 'label',
				text : getLabel("colQryAdvFltInstrument","Instrument")
			},{
				xtype:'textfield',
				width : '100%',
				padding : '-4 0 0 0',
				triggerAction : 'all',
				fieldCls : 'form-control',
				itemId : 'batchReceiverName',
				enforceMaxLength: true,
				maxLength: '10',
				maskRe: /[0-9.]/,
				mode : 'local',
				listeners : {
					'blur' : function(combo, record) {
						$(document).trigger("receiverNameAutoCompleterSelect",[combo.getValue(),combo.getRawValue()]);
					},
					'select':function(combo,record){
						$(document).trigger("receiverNameAutoSelectSync",[combo.getValue(),combo.getRawValue()]);
					}
				}
			}]	
		}
		]
		this.callParent(arguments);	
	},
	productStore:function(){
		var objProductStore=null;
		var productData=null;
		Ext.Ajax.request({
			url :  'services/userseek/txnDrawerAccNoSeek.json?$filtercode1='+strIdentifier,
			async : false,
			method : 'GET',
			success : function(response) {
				var responseData = Ext.decode(response.responseText);
				if(!Ext.isEmpty(responseData)&&!Ext.isEmpty(responseData.d)){
					productData=responseData.d.preferences;
					objProductStore = Ext.create('Ext.data.Store', {
						fields : ['CODE','DESCRIPTION'],
						data : productData,
						reader : {
							type : 'json',
							root : 'd.preferences'
						},
						listeners : {
							load : function() {
								this.insert(0, {
											CODE : 'all',
											DESCRIPTION : getLabel('allProducts', 'All')
										});
							}
						}
					});
					objProductStore.load();
				}
			},
			failure : function() {
				// console.log("Error Occured - Addition Failed");
			}
		});
		return objProductStore;	
	}
});