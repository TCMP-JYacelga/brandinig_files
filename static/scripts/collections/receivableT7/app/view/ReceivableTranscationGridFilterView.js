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
			hidden: (strLayoutType === "CASHLAYOUT" || strLayoutType === "CHKLAYOUT") ? true : false,
			items : [{
				xtype : 'label',
				text : getLabel("payerAcct","Payer Account"),
				padding : '0 0 0 10'
				
			},{
				xtype:'combo',
				valueField : 'CODE',
				displayField : 'DESCRIPTION',
				queryMode : 'local',
				padding : '-4 0 0 0',
				editable : false,
				triggerAction : 'all',
				itemId : 'batchProduct',
				mode : 'local',
				emptyText : getLabel('selectPayerAcct','Select Payer Account'),
				store : me.productStore(),
				width : '100%',
				matchFieldWidth: true,
				listeners : {
					'select' : function(combo, record) {
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
				//fieldCls : 'xn-suggestion-box',
				itemId : 'batchReceiverAccount',
				cfgUrl : 'services/userseek/txnDrawerNameSeek.json',
				cfgRecordCount : -1,
				cfgQueryParamName : '$autofilter',
				cfgExtraParams:[{key:'$filtercode1',
								value:strIdentifier
								}],
				cfgRootNode : 'd.preferences',
				cfgDataNode1 : 'DESCRIPTION',
				cfgKeyNode : 'DESCRIPTION',
				padding : '-4 0 0 0',
				width : '100%',
				matchFieldWidth: true,
				enforceMaxLength : true,
				maxLength : 40,
				emptyText : getLabel('searchByPayerName', 'Search By Payer Name'),
				listeners:{
					'select':function(combo,record){
						$(document).trigger("receiverAccountComboSelect",[combo.getValue(),combo.getRawValue()]);
					}
				}
			}]	
		},{
			xtype : 'container',
			itemId : 'clrLocationContainer',
			layout : 'vbox',
			width : '30%',
			padding : '0 30 0 0',
			hidden: (strLayoutType === "CASHLAYOUT" || strLayoutType === "CHKLAYOUT") ? false : true,
			items : [{
				xtype : 'label',
				text : getLabel("clrLocation","Clearing Location")
			},{
				xtype:'AutoCompleter',
				//fieldCls : 'xn-suggestion-box',
				itemId : 'batchClrLocation',
				cfgUrl : 'services/userseek/txnReceivableClearinglocation.json',
				cfgRecordCount : -1,
				cfgQueryParamName : '$autofilter',
				cfgExtraParams:[{key:'$filtercode1',
								value:strIdentifier
								}],
				cfgRootNode : 'd.preferences',
				cfgDataNode1 : 'DESCRIPTION',
				cfgKeyNode : 'CODE',
				padding : '-4 0 0 0',
				width : '100%',
				matchFieldWidth: true,
				enforceMaxLength : true,
				maxLength : 40,
				emptyText : getLabel('searchByClrLocation', 'Search By Clearing Location'),
				listeners:{
					'select':function(combo,record){
						$(document).trigger("clrLocationComboSelect",[combo.getValue(),combo.getRawValue()]);
					}
				}
			}]	
		},{
			xtype : 'container',
			itemId : 'batchInstProductContainer',
			layout : 'vbox',
			width : '30%',
			padding : '0 30 0 0',
			hidden: (strLayoutType === "CASHLAYOUT" || strLayoutType === "CHKLAYOUT") ? false : true,
			items : [{
				xtype : 'label',
				text : getLabel("batchProduct","Product")
			},{
				xtype:'AutoCompleter',
				//fieldCls : 'xn-suggestion-box',
				itemId : 'batchInstProduct',
				cfgUrl : 'services/userseek/receivableProductSeek.json',
				cfgRecordCount : -1,
				cfgQueryParamName : '$autofilter',
				cfgExtraParams:[{key:'$filtercode1',
								value:strIdentifier
								}],
				cfgRootNode : 'd.preferences',
				cfgDataNode1 : 'DESCRIPTION',
				cfgKeyNode : 'CODE',
				padding : '-4 0 0 0',
				width : '100%',
				matchFieldWidth: true,
				enforceMaxLength : true,
				maxLength : 40,
				emptyText : getLabel('selectproduct', 'Search By Product'),
				listeners:{
					'select':function(combo,record){
						$(document).trigger("instProductComboSelect",[combo.getValue(),combo.getRawValue()]);
					}
				}
			}]	
		},{
			xtype : 'container',
			itemId : 'ReceiverNameContainer',
			layout : 'vbox',
			width : '30%',
			padding : '0 30 0 0',
			hidden: (strLayoutType === "CASHLAYOUT" || strLayoutType === "CHKLAYOUT") ? true : false,
			items : [{
				xtype : 'label',
				text : getLabel("debtRefNo","Mandate Debtor Reference")
			},{
				xtype : 'AutoCompleter',
				//fieldCls : 'xn-suggestion-box',
				itemId : 'batchReceiverName',
				cfgUrl : 'services/userseek/txnDrawerDebtRefNoSeek.json',
				cfgRecordCount : -1,
				cfgQueryParamName : '$autofilter',
				cfgExtraParams:[{key:'$filtercode1',
								value:strIdentifier
								}],
				cfgRootNode : 'd.preferences',
				cfgDataNode1 : 'DESCRIPTION',
				cfgKeyNode : 'CODE',
				padding : '-4 0 0 0',
				width : '100%',
				matchFieldWidth: true,
				enforceMaxLength : true,
				maxLength : 20,
				emptyText : getLabel('searchByMandateDTRef', 'Search By Mandate Debtor Reference'),
				listeners:{
					'select':function(combo,record){
						$(document).trigger("receiverNameAutoCompleterSelect",[combo.getValue(),combo.getRawValue()]);
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