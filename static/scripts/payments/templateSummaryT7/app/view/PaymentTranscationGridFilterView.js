Ext.define("GCP.view.PaymentTranscationGridFilterView",{
	extend:'Ext.panel.Panel',
	requires:['Ext.ux.gcp.AutoCompleter'],
	xtype : 'paymentTranscationGridFilterView',
	layout:'hbox',
	initComponent : function() {
		var me=this;
		var crDrFlag = paymentResponseHeaderData
			&& paymentResponseHeaderData.d
			&& paymentResponseHeaderData.d.paymentEntry
			&& paymentResponseHeaderData.d.paymentEntry.paymentHeaderInfo
			&& paymentResponseHeaderData.d.paymentEntry.paymentHeaderInfo.hdrDrCrFlag
			? paymentResponseHeaderData.d.paymentEntry.paymentHeaderInfo.hdrDrCrFlag
			: '';
		me.items=[{
			xtype : 'container',
			itemId : 'productContainer',
			layout : 'vbox',
			width : '30%',
			padding : '0 30 0 0',
			hidden : strLayoutType === 'CHECKSLAYOUT' || strLayoutType === 'CASHLAYOUT' ? true : false,
			items : [{
				xtype : 'label',
				text : getLabel("batchProduct","Product")				
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
				emptyText : getLabel('selectproduct','Select Product'),
				store : me.productStore(),
				width : '88%',
				listeners : {
					'select' : function(combo, record) {
						$(document).trigger("productComboSelect",[combo.getValue(),combo.getRawValue()]);
					},
					'boxready' : function(combo, width, height,eOpts) {
						combo.setValue(combo.getStore().getAt(0));
					}
				}
			}]	
		},{
			xtype : 'container',
			itemId : 'ReceiverAccountContainer',
			layout : 'vbox',
			width : '30%',
			padding : '0 30 0 0',
			hidden : strLayoutType === 'CHECKSLAYOUT' || strLayoutType === 'CASHLAYOUT' ? true : false,
			items : [{
				xtype : 'label',
				text : strLayoutSubType === 'DRAWDOWN' ? getLabel("batchDebitAcc", "Debit Account") :((!isEmpty(crDrFlag) && crDrFlag === 'D')
						? getLabel("batchSendingAcc", "Sending Account")
						: (!isEmpty(crDrFlag) && crDrFlag === 'C'
								? getLabel("batchReceiverAcc",
										"Receiving Account")
								: getLabel("batchReceiverAcc",
										"Receiving Account")))
			},{
				xtype:'combo',
				valueField : 'CODE',  
				displayField : 'DESCRIPTION',
				queryMode : 'local',
				editable : false,
				matchFieldWidth: true,
				triggerAction : 'all',
				itemId : 'batchReceiverAccount',
				mode : 'local',
				emptyText : getLabel('selectReceiverAccount','Select Receiver A/c'),
				store:me.receiverAccountStore(),
				padding : '-4 0 0 0',
				width : '88%',
				listeners:{
					'select':function(combo,record){
						$(document).trigger("receiverAccountComboSelect",[combo.getValue(),combo.getRawValue()]);
					},
					'boxready' : function(combo, width, height,eOpts) {
						combo.setValue(combo.getStore().getAt(0));
						setTxnFilterReceiverAccount("#txnFilterReceiverAccount");
					}
				}
			}]	
		},{
			xtype : 'container',
			itemId : 'ReceiverNameContainer',
			layout : 'vbox',
			width : '30%',
			padding : '0 30 0 0',
			hidden : strLayoutType == "ACCTRFLAYOUT"? true : false,
			items : [{
				xtype : 'label',
				text : strLayoutType == "TAXLAYOUT"? strSystemBeneCategoryLbl : (strLayoutSubType === 'DRAWDOWN' 
					? getLabel("batchDebitPartyName", "Debit Party Name") : 
						getLabel("instrumentsColumnReceiverName","Receiver Name"))
			},{
				xtype : 'AutoCompleter',
				fieldCls : 'xn-suggestion-box',
				matchFieldWidth : true,
				itemId : 'batchReceiverName',
				cfgUrl : 'services/userseek/txnReceiverSeek.json',
				cfgRecordCount : -1,
				cfgQueryParamName : '$autofilter',
				cfgExtraParams:[{key:'$filtercode1',
								value:strIdentifier
								}],
				cfgRootNode : 'd.preferences',
				cfgDataNode1 : 'DESCRIPTION',
				cfgDataNode2 : 'VALUE',
				cfgKeyNode : 'CODE',
				padding : '-4 0 0 0',
				width : '100%',
				emptyText : strLayoutSubType === 'DRAWDOWN' ? getLabel("searchByDebitPartyName", "Search By Debit Party Name") : getLabel('searchByReceiverName',
										'Enter Keyword or %')
			}]	
		}
		]
		this.callParent(arguments);	
	},
	productStore : function(data) {
		var objProductStore = null;
		var productData = data;
		objProductStore = Ext.create('Ext.data.Store', {
					fields : ['CODE', 'DESCRIPTION'],
					data : productData,
					reader : {
						type : 'json',
						root : 'd.preferences'
					},
					listeners : {
						load : function() {
							this.insert(0, {
										CODE : 'all',
										DESCRIPTION : getLabel('allProducts',
												'All')
									});
						}
					}
				});
		objProductStore.load();
		return objProductStore;
	},
	receiverAccountStore : function(data) {
		var objReceiverAccountStore = null;
		var receiverAccountData = data;
		objReceiverAccountStore = Ext.create('Ext.data.Store', {
			fields : ['CODE', 'DESCRIPTION'],
			data : receiverAccountData,
			reader : {
				type : 'json',
				root : 'd.receivers'
			},
			autoLoad : true,
			listeners : {
				load : function() {
					this.insert(0, {
								CODE : 'all',
								DESCRIPTION : getLabel('allReceiverName', 'All')
							});
				}
			}
		});
		objReceiverAccountStore.load();
		return objReceiverAccountStore;
	}
});