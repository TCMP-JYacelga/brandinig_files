Ext.define('GCP.view.BankProductFilterView',
{
	extend : 'Ext.panel.Panel',	
	xtype  : 'bankProductFilterView',
requires : ['Ext.menu.Menu', 'Ext.container.Container',
			'Ext.toolbar.Toolbar', 'Ext.button.Button', 'Ext.panel.Panel',
			'Ext.ux.gcp.AutoCompleter'],
	width : '100%',
	componentCls : 'gradiant_back',
	collapsible : true,
	collapsed : true,
	cls : 'xn-ribbon',
	layout :
	{
		type : 'vbox',
		align : 'stretch'
	},
	initComponent : function()
	{
		var me=this;
		var storeData = null;
		if(entity_type === '0')
		{
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
		}
		
		var objStore = Ext.create('Ext.data.Store', {
					fields : ['CODE', 'DESCR'],
					data : storeData,
					reader : {
						type : 'json',
						root : 'preferences'
					}
				});
		if(objStore.getCount() > 1){
			multipleSellersAvailable = true;
		    }
	
		var statusStore = Ext.create('Ext.data.Store', {
			fields : ["name", "value"],
			proxy : {
				type : 'ajax',
				autoLoad : true,
				url : 'services/categoryStatusList.json',
				actionMethods : {
					read : 'POST'
				},
				reader : {
					type : 'json',
					root : 'd.filter'
				}
			}
		});

		this.items=[{
			xtype : 'panel',
			itemId : 'mainContainer',
			layout : 'hbox',
			cls: 'ux_border-top ux_largepadding',
			items :[{
				//panel 1
				xtype : 'panel',
				itemId : 'firstRow',
				cls : 'xn-filter-toolbar',
				flex : 0.25,
				layout :
				{
				   type : 'vbox'
				},
				items :
				[{
					xtype : 'panel',
					flex: 1,
					layout :
					{
						type : 'hbox'
					},
					items :
					[{
						xtype : 'label',
						text : getLabel('financialInstitution', 'Financial Institution'),
						cls : 'frmLabel w12'
					}]
				},
				{
					xtype : 'combo',
					displayField : 'DESCR',
					fieldCls : 'xn-form-field inline_block',
					triggerBaseCls : 'xn-form-trigger',
					filterParamName : 'sellerId',
					itemId : 'sellerFltId',
					valueField : 'CODE',
					name : 'sellerCombo',
					editable : false,
					value :strSellerId,
					store : objStore,
					listeners : {
						'render' : function(combo, record) {
							combo.store.load();
						},
						'select' : function(combo, strNewValue, strOldValue) {
							setAdminSeller(combo.getValue());
							me.fireEvent('handleChangeFilter', combo, strNewValue, strOldValue);
						}
					}
				}]
			},
			//Panel 2
			{
				xtype : 'panel',
				cls : 'xn-filter-toolbar',
				flex : 0.25,
				layout : 'vbox',
				columnWidth : 0.22,
				items :
				[{
					xtype : 'label',
					text : getLabel('productDesc', 'Product'),
					cls : 'frmLabel',
					flex : 0.20
				},{
					xtype : 'AutoCompleter',
					matchFieldWidth : true,
					fieldCls : 'xn-form-text w14 xn-suggestion-box',
					labelSeparator : '',
					name : 'productDesc',
					itemId : 'product',
					cfgUrl : 'services/userseek/bankProductSeek.json',
					cfgQueryParamName : '$autofilter',
					cfgRecordCount : -1,
					cfgSeekId : 'bankProductSeek',
					cfgRootNode : 'd.preferences',
					displayfieldIndex : 1,
					cfgKeyNode : 'PRODUCT_DESCRIPTION',
					cfgDataNode1 : 'PRODUCT_CODE',
					//cfgDataNode2 : 'PRODUCT_DESCRIPTION',								
					cfgStoreFields :
					[
						'PRODUCT_CODE',
						'PRODUCT_DESCRIPTION'
					],
					listeners : {
						'change' : function(combo, strNewValue, strOldValue) {
							me.fireEvent('handleChangeFilter', combo, strNewValue, strOldValue);
						}
					}
				}]
			},
			{
				//panel 3
				xtype : 'panel',
				cls : 'xn-filter-toolbar',
				flex : 0.25,
				layout : 'vbox',
				columnWidth : 0.22,
				items :[{
					xtype : 'label',
					text : getLabel('status', 'Status'),
					cls : 'frmLabel',
					flex : 0.20
				},
				{
					xtype : 'combo',
					fieldCls : 'xn-form-field inline_block',
					triggerBaseCls : 'xn-form-trigger',
					width : 165,
					itemId : 'statusFilter',	
					store : statusStore,
					valueField : 'name',
					displayField : 'value',
					name : 'requestState',
					editable : false,
					value :  getLabel('all', 'All')
/*					listeners : {
						'select' : function(combo, strNewValue, strOldValue) {
							me.fireEvent('handleChangeFilter', combo, strNewValue, strOldValue);
						}
					}*/
				}]
			}, {
				xtype : 'panel',
				cls : 'xn-filter-toolbar',
				layout : 'vbox',
				columnWidth : 0.22,
				flex : 0.25,
				items : [{
							xtype : 'panel',
							layout : 'hbox',
							padding : '23 0 1 0',
							items : [{
										xtype : 'button',
										itemId : 'btnFilter',
										text : getLabel('search',
												'Search'),
										cls : 'search_button ux_button-background-color ux_button-padding',														
										height : 25
									}]
						}]
			}]
		}];
		this.callParent( arguments );
	}
	
});