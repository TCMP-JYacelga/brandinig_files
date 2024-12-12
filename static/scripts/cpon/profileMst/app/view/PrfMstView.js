/**
 * @class GCP.view.PrfMstView
 * @extends Ext.panel.Panel
 * @author Ashwini Pawar
 */
Ext.define('GCP.view.PrfMstView', {
	extend : 'Ext.panel.Panel',
	xtype : 'prfMstView',
	requires : ['GCP.view.PrfMstAdminProfileView',
			'GCP.view.PrfMstBRProfileView', 'GCP.view.PrfMstChecksProfileView',
			'GCP.view.PrfMstPaymentProfileView',
			'GCP.view.PrfMstIncomingPaymentsProfileView',
			'GCP.view.PrfMstGridView','GCP.view.PrfMstFscProfileView','GCP.view.PrfMstLiquidityProfileView','GCP.view.PrfMstCollectionProfileView','Ext.tab.Panel','Ext.layout.container.HBox'],
	width : '100%',
	autoHeight : true,
	//minHeight : 600,
	initComponent : function() {
		var me = this;
		var multipleSellersAvailable =  false;
		var comboStore = Ext.create('Ext.data.Store', {
			fields : ["DESCR", "CODE"]
		});
				
		Ext.Ajax.request({
					url : 'services/userseek/adminSellersListCommon.json',
					method : 'GET',
					async : false,
					success : function(response) {
						var responseData = Ext.decode(response.responseText);
						var data = responseData.d.preferences;
						if (comboStore) {
							comboStore.removeAll();
							var count = data.length;
							
							for (var index = 0; index < count; index++) {
								var record = {
									'CODE' : data[index].CODE,
									'DESCR' : data[index].DESCR
								}
								comboStore.add(record);
							}
						}
					},
					failure : function() {
					}
				});
		
		if(comboStore.getCount() > 1){
			multipleSellersAvailable = true;
		}
		
		var sellerComboField = Ext.create('Ext.form.field.ComboBox', {
					displayField : 'DESCR',
					fieldCls : 'xn-form-field inline_block',
					labelCls : 'ux_font-size14-normal',
					triggerBaseCls : 'xn-form-trigger',
					filterParamName : 'sellerCode',
					itemId : 'sellerCode_id',
					valueField : 'CODE',
					name : 'sellerCode',
					editable : false,					
					store : comboStore,					
					padding : '1 3 0 10',
					margin : '0 5 0 0',
					width : 165,
					mode : 'local',
					triggerAction : 'all',
					queryMode : 'local',
					value : sessionSellerCode		
				});
		selectedSellerCode = sessionSellerCode;
		me.items = [{
					xtype : 'panel',
					width : '100%',
					cls : 'ux_panel-background ux_largepaddingtb',
					layout : {
						type : 'hbox'
					},
					items : [{
								xtype : 'label',
								text : 'Client Profiles',
								cls : 'page-heading'
							}, {
								xtype : 'container',
								layout : 'hbox',
								flex : 1,
								items : [{
											xtype : 'label',
											text : '',
											flex : 1
										}]
							}]
				}, {
					xtype : 'container',
					cls : 'ux_panel-background',
					layout : {
						type : 'hbox',
						pack : 'end'
					},
					itemId : 'sellerPanel',
					hidden : multipleSellersAvailable == true ? false : true,
					items : [{
								xtype : 'label',
								border : 0,
								itemId : 'labelSeller',
								text : getLabel('seller', 'Seller'),
								cls : 'ux_font-size14-normal',
								padding : '4 6 0 3'
							}, sellerComboField]
				}, {
					xtype : 'tabpanel',
					itemId : 'prfMstViewTabPanel',
					width : '100%',
					padding : '12 0 0 0',
					cls : 'ux_panel-background ux_tabs',
					activeTab : 0,
					items : [{
								title : getLabel('admin', 'Admin'),
								xtype : 'prfMstAdminProfileView',
								name : 'admin',
								width : '100%',
								margin : '0 0 12 0',
								itemId : 'adminPrftab'
							}, {
								title : getLabel('payments', 'Payments'),
								xtype : 'prfMstPaymentProfileView',
								width : '100%',
								name : 'payment',
								margin : '0 0 12 0',
								itemId : 'paymentsPrftab'
							}, {
								title : getLabel('balRep', 'Balance Reporting'),
								xtype : 'prfMstBRProfileView',
								name : 'br',
								width : '100%',
								margin : '0 0 12 0',
								itemId : 'brPrftab'
							}/*, {
								title : getLabel('check', 'Check'),
								xtype : 'prfMstChecksProfileView',
								name : 'check',
								width : '100%',
								margin : '0 0 10 0',
								itemId : 'checksPrftab'
							}, {
								title : getLabel('incomingpayments',
										'Incoming Payments'),
								xtype : 'prfMstIncomingPaymentsProfileView',
								name : 'incomingPayments',
								width : '100%',
								margin : '0 0 10 0',
								itemId : 'incomingPaymentsPrftab'
							}, {
								title : getLabel('others', 'Others'),
								xtype : 'prfMstOthersProfileView',
								name : 'others',
								width : '100%',
								margin : '0 0 10 0',
								itemId : 'othersPrftab'
							}, {
								title : getLabel('liquidity', 'Liquidity'),
								xtype : 'prfMstLiquidityProfileView',
								name : 'liquidity',
								width : '100%',
								margin : '0 0 10 0',
								itemId : 'liquidityPrftab'
						   }*/,{
								title : getLabel('fsc', 'SCF'),
								xtype : 'prfMstFscProfileView',
								name : 'fsc',
								width : '100%',
								margin : '0 0 12 0',
								itemId : 'fscPrftab'
							},{
								title : getLabel('collections', 'Receivables'),
								xtype : 'prfMstCollectionProfileView',
								name : 'Receivable',
								width : '100%',
								margin : '0 0 12 0',
								itemId : 'collectionPrftab'
							}],
					tabchange : function(panel, newTab, oldTab) {
						me.fireEvent('tabchange', panel, newTab, oldTab);
					}
				}, {
					xtype : 'prfMstGridView',
					width : '100%',
					parent : me
				}];
		me.on('resize', function() {
					me.doLayout();
				});
				
		me.callParent(arguments);
		// this.hideProfileTabs();
	},
	hideProfileTabs : function() {
		var tabPanel = this.down('tabpanel[itemId=prfMstViewTabPanel]');
		tabPanel.child('#adminPrftab').tab.hide();
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