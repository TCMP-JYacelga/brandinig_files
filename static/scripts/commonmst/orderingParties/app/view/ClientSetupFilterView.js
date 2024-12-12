Ext.define('GCP.view.ClientSetupFilterView', {
	extend : 'Ext.panel.Panel',
	xtype : 'clientSetupFilterView',
	requires : ['Ext.ux.gcp.AutoCompleter'],
	width : '100%',
	componentCls : 'gradiant_back',
	collapsible : true,
	collapsed : true,
	cls : 'xn-ribbon ux_border-bottom',
	layout : {
		type : 'vbox',
		align : 'stretch'
	},
	initComponent : function() {
		var me = this;
		pmtSummaryView = this;
		var orderingPartyNameSeekURL = null;
		var oderingPartyIDSeekURL = null;
		var storeData = null;
		var clientsStoreData = null;
		var filterContainerArr = new Array();
		var multipleSellersAvailable = false;
	me.on('afterrender', function(panel) {
			Ext.Ajax.request({
				url : 'services/userseek/userclients.json',
				method : 'POST',
				async : false,
				success : function(response) {
					if (response && response.responseText)
					{
						var data = Ext.decode(response.responseText);
						me.populateClientMenu(data);
					}
				},
				failure : function(response) {
					// console.log('Error Occured');
				}
			});
		});
		me.on('afterrender', function(panel) {
			var clientBtn = me.down('button[itemId="clientBtn"]');
		/*
		 * if (clientBtn) clientBtn.setText(me.clientCode);
		 */
		// Set Default Text When Page Loads
			clientBtn.setText(getLabel('allCompanies', 'All companies'));
			});
		if (userType == 0) {
			Ext.Ajax.request({
						url : 'services/userseek/adminSellersListCommon.json',
						method : 'POST',
						async : false,
						success : function(response) {
							var data = Ext.decode(response.responseText);
							var sellerData = data.d.preferences;
							if (!Ext.isEmpty(data)) {
								storeData = sellerData;
							}
						},
						failure : function(response) {
							// console.log("Ajax Get data Call Failed");
						}

					});
			var objStore = Ext.create('Ext.data.Store', {
						fields : ['CODE', 'DESCR'],
						data : storeData,
						reader : {
							type : 'json',
							root : 'preferences'
						}
					});
			if (objStore.getCount() > 1) {
				multipleSellersAvailable = true;
			}

		} else {

			var clientURL = 'services/orderPartySeek/orderingPartyUserClientList.json?$sellerId='
					+ strSellerId + '';

			Ext.Ajax.request({
						url : clientURL,
						method : 'POST',
						async : false,
						success : function(response) {
							var clientsData = Ext.decode(response.responseText);
							if (!Ext.isEmpty(clientsData)) {
								clientsStoreData = clientsData.filterList;
							}
						},
						failure : function(response) {
							// console.log("Ajax Get data Call Failed");
						}

					});
			var objClientStore = Ext.create('Ext.data.Store', {
						fields : ['name', 'value'],
						data : clientsStoreData,
						reader : {
							type : 'json'
						}
					});
			if (objClientStore.getCount() > 1) {
				isMultipleClientAvailable = true;
				clientsStoreData.unshift({
							"name" : "",
							"value" : "ALL"
						});
			}

		}

	/*	var sellerContainer = Ext.create('Ext.container.Container', {
			columnWidth : 0.25,
			//padding : '10px',
			items : [{
				xtype : 'label',
				text : getLabel('financialinstitution', 'Financial Institution'),
				cls : 'ux_font-size14',
				padding : '1 0 0 10'
			}, {
				xtype : 'combo',
				padding : '1 0 0 10',
				width : 180,
				displayField : 'DESCR',
				cls : 'ux_paddingb ux_normalmargin-top ux_largemargin-left ',
				fieldCls : 'xn-form-field inline_block',
				triggerBaseCls : 'xn-form-trigger',
				filterParamName : 'seller',
				itemId : 'sellerFltId',
				valueField : 'CODE',
				name : 'sellerCombo',
				editable : false,
				value : strSellerId,
				store : objStore
			}]
		});
*/
		/*var clientNameContainer = Ext.create('Ext.container.Container', {
			columnWidth : 0.25,
			//padding : '10px',
			items : [{
				xtype : 'label',
				text : getLabel('clientName', 'Client Name'),
				cls : 'ux_font-size14  ux_largemargin-left'
					// padding : '1 0 0 10'
				}, {
				xtype : 'AutoCompleter',
				// padding : '1 0 0 10',
				cls : 'ux_paddingb ux_normalmargin-top ux_largemargin-left ',
				fieldCls : 'xn-form-text w10_3 xn-suggestion-box',
				name : 'clientCode',
				itemId : 'orderPartyClientCodesFltId',
				cfgUrl : 'services/orderPartySeek/orderingPartyAdminClientList.json',
				cfgQueryParamName : 'qfilter',
				cfgRecordCount : -1,
				cfgSeekId : 'orderingPartyAdminClientList',
				cfgKeyNode : 'name',
				cfgRootNode : 'filterList',
				cfgDataNode1 : 'value',
				cfgProxyMethodType : 'POST'
			}]
		});

		var clientComboContainer = Ext.create('Ext.container.Container', {
			columnWidth : 0.25,
			//padding : '10px',
			items : [{
				xtype : 'label',
				text : getLabel('clientName', 'Client Name'),
				cls : 'ux_font-size14  ux_normalpadding-bottom ux_largepadding-left'
			}, {
				xtype : 'combo',
				padding : '1 0 0 10',
				width : 120,
				cls : 'ux_normalmargin-top ux_largepadding-left',
				displayField : 'value',
				fieldCls : 'xn-form-field inline_block',
				triggerBaseCls : 'xn-form-trigger',
				itemId : 'orderPartyClientCodesFltId',
				valueField : 'name',
				name : 'clientCode',
				editable : false,
				value : '',
				store : objClientStore
			}]
		});
		*/
		if (userType == 0) {
			orderingPartyNameSeekURL = 'services/orderPartySeek/adminOrderPartyNamesList.json';
		}
		else{
			orderingPartyNameSeekURL = 'services/orderPartySeek/clientOrderPartyNamesList.json';
		}
		
		var orderingPartyNameContainer = {
			xtype : 'container',
			columnWidth : 0.25,
			padding : '0px 0px 0px 12px',
			items : [{
						xtype : 'label',
						text : getLabel('orderPartyName', 'Ordering Party Name'),
						// padding: '1 0 0 10'
						cls : 'ux_font-size14'
					}, {
						xtype : 'AutoCompleter',
						padding : '6 0 0 0',
						fieldCls : 'xn-form-text xn-suggestion-box',
						width : 165,
						name : 'orderPartyName',
						itemId : 'orderPartyNameFltId',
						cfgUrl : orderingPartyNameSeekURL,
						cfgQueryParamName : 'qfilter',
						cfgRecordCount : -1,
						cfgSeekId : 'orderPartyNamesList',
						cfgKeyNode : 'name',
						cfgRootNode : 'filterList',
						cfgDataNode1 : 'name',
						cfgProxyMethodType : 'POST'
					}]
		};
		
		if (userType == 0) {
			oderingPartyIDSeekURL = 'services/orderPartySeek/adminOrderCodeList.json';
		}
		else{
			oderingPartyIDSeekURL = 'services/orderPartySeek/clientOrderCodeList.json';
		}
		
		var orderingPartyIdContainer = {
			xtype : 'container',
			columnWidth : 0.25,
			padding : '0px 0px 0px 12px',
			items : [{
						xtype : 'label',
						text : getLabel('orderPartyId', 'Ordering Party ID'),
						padding : '1 0 0 10',
						cls : 'ux_font-size14'
					}, {
						xtype : 'AutoCompleter',
						// padding: '1 0 0 10',
						padding : '6 0 0 10',
						fieldCls : 'xn-form-text xn-suggestion-box',
						name : 'orderCode',
						itemId : 'orderPartyCodeFltId',
						cfgUrl : oderingPartyIDSeekURL,
						cfgQueryParamName : 'qfilter',
						cfgRecordCount : -1,
						cfgSeekId : 'orderCodeList',
						cfgKeyNode : 'name',
						cfgRootNode : 'filterList',
						cfgDataNode1 : 'name',
						cfgProxyMethodType : 'POST'
					}]
		};

		/*filterContainerArr.push(sellerContainer);
		if (userType === '0' && multipleSellersAvailable) {
			sellerContainer.show();
		} else {
			sellerContainer.hide();
		}

		if (userType === '0') {
			filterContainerArr.push(clientNameContainer);
		} else {
			filterContainerArr.push(clientComboContainer);
			if (isMultipleClientAvailable) {
				clientComboContainer.show();
			} else {
				clientComboContainer.hide();
			}
		}*/
		filterContainerArr.push(orderingPartyNameContainer);
		filterContainerArr.push(orderingPartyIdContainer);

		this.items = [{
					xtype : 'container',
					width : '100%',
					layout : 'column',
					cls : 'ux_largepadding',
					items : filterContainerArr
				}];

		this.callParent(arguments);

		var sellerCombo = me.down('combobox[itemId=sellerFltId]');
		/*var clientAutoCompleter = clientNameContainer
				.down('AutoCompleter[itemId=orderPartyClientCodesFltId]');
		clientAutoCompleter.cfgExtraParams = [{
					key : 'sellerId',
					value : sellerCombo.getValue()
				}];*/

	},
	
	populateClientMenu : function(data) {
		var me = this;
		var clientMenu = me.down('menu[itemId="clientMenu"]');
		var clientBtn = me.down('button[itemId="clientBtn"]');
		var filterClientMenuContainer = me
				.down('container[itemId="filterClientMenuContainer"]');
		var clientArray = data.d.preferences || [];
		clientMenu.add({
					text : getLabel('allCompanies', 'All companies'),
					btnDesc : getLabel('allCompanies', 'All companies'),
					code : 'all',
					handler : function(btn, opts) {
						clientBtn.setText(btn.text);
						me.clientCode = btn.code;
						me.fireEvent('handleClientChange', btn.code,
								btn.btnDesc);
					}
				});

		Ext.each(clientArray, function(client) {
					//if(client.CODE === prefClientCode)	
					//	prefClientDesc = client.DESCR;
					clientMenu.add({
								text : client.DESCR,
								code : client.CODE,
								btnDesc : client.DESCR,
								handler : function(btn, opts) {
									clientBtn.setText(btn.text);
									me.clientCode = btn.code;
									me.fireEvent('handleClientChange',
											btn.code, btn.btnDesc);
								}
							});
				});
		if (null != clientArray && clientArray.length <= 1) {
			filterClientMenuContainer.hide();
		}

	},
tools : [{
			xtype : 'container',
			itemId : 'filterClientMenuContainer',
			cls : 'paymentqueuespacer',
			padding : '0 0 0 5',
			hidden : entityType == 0 ? true : false,
			layout : {
				type : 'hbox'
			},
			items : [{
				xtype : 'label',
				html : '<img id="imgFilterInfo" class="icon-company"/>'
			}, {
				xtype : 'button',
				border : 0,
				itemId : 'clientBtn',
				text : getLabel('allCompanies', 'All Companies'),
				cls : 'font_bold xn-custom-more-btn cursor_pointer x-zero-padding ux-custom-more-btn',
				menuAlign : 'b',
				menu : {
					xtype : 'menu',
					maxHeight : 180,
					width : 50,
					cls : 'ext-dropdown-menu xn-menu-noicon',
					itemId : 'clientMenu',
					items : []
				}
			}]
		},
		{
			xtype : 'container',
			itemId : 'filterClientAutoCmplterCnt',
			cls : 'paymentqueuespacer',
			padding : '0 0 0 5',
			hidden :  entityType == 1 ? true : false,
			layout : {
				type : 'hbox'
			},
			items : [{
					xtype : 'label',
					margin : '3 0 0 0',
					html : '<i href="#" id="imgFilterInfo" class="icon-company largepadding"></i>'
			}, 
			{
				xtype : 'AutoCompleter',
				fieldCls : 'xn-form-text w12 xn-suggestion-box',
				name : 'clientCode',
				itemId : 'clientCodeId',
				cfgUrl : 'services/userseek/userclients.json',
				cfgQueryParamName : '$autofilter',
				cfgStoreFields:['SELLER_CODE','CODE','DESCR'],
				cfgRecordCount : -1,
				cfgSeekId : 'clientCodeSeek',
				cfgRootNode : 'd.preferences',
				cfgDataNode1 : 'DESCR',
				cfgKeyNode : 'CODE',
				cfgProxyMethodType : 'POST'
			}]
		}
	         ]
});