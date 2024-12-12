Ext.define('GCP.view.LiquidityProductTypeMstFilterView', {
	extend : 'Ext.panel.Panel',
	xtype : 'liquidityProductTypeMstFilterView',
	requires : ['Ext.menu.Menu', 'Ext.container.Container',
			'Ext.toolbar.Toolbar', 'Ext.button.Button', 'Ext.panel.Panel',
			'Ext.ux.gcp.AutoCompleter'],
	width : '100%',
	componentCls : 'gradiant_back ux_border-bottom',
	collapsible : true,
	collapsed :true,
	cls : 'xn-ribbon ux_extralargemargin-top',
	layout : {
		type : 'vbox',
		align : 'stretch'
	},
	initComponent : function() {
		var me = this;

		Ext.Ajax.request({
					url : 'services/sellerListFltr.json',
					read : 'POST',
					async : false,
					success : function(response) {
						var data = Ext.decode(response.responseText);
						var sellerData = data.filterList;
						if (!Ext.isEmpty(data)) {
							storeData = data;
						}
					},
					failure : function(response) {
						// console.log("Ajax Get data Call Failed");
					}
				});

		var objStore = Ext.create('Ext.data.Store', {
					fields : ['sellerCode', 'description'],
					data : storeData,
					reader : {
						type : 'json',
						root : 'filterList'
					}
				});
		if (objStore.getCount() > 1) {
			multipleSellersAvailable = true;
		}
		if (!Ext.isEmpty(arrStatusFilterLst)) {
			arrStatusFilterLst.push({
									name : 'all',
									value : getLabel('all','ALL')
								});
		}
		var statusStore = Ext.create('Ext.data.Store', {
					fields : ["name", "value"],
					data : arrStatusFilterLst
					/*proxy : {
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
					}*/
				});

		var levelStore = Ext.create('Ext.data.Store', {
					fields : ["name", "value"],
					data : [{
								"name" : getLabel('all', 'All'),
								"value" : ""
							}, {
								"name" : getLabel('status', 'Status'),
								"value" : "Status"
							}, {
								"name" : getLabel('summary', 'Summary'),
								"value" : "Summary"
							}, {
								"name" : getLabel('detail', 'Detail'),
								"value" : "Detail"
							}]
				});

		this.items = [{
			xtype : 'panel',
			itemId : 'mainContainer',
			layout : 'hbox',
			cls : 'ux_border-top ux_largepadding',
			items : [{
				// panel 1
				xtype : 'panel',
				itemId : 'firstRow',
				cls : 'xn-filter-toolbar',
				hidden : multipleSellersAvailable == true ? false : true,
				flex : 0.05,
				layout : {
					type : 'vbox'
				},
				items : [{
					xtype : 'panel',
					flex : 1,
					layout : {
						type : 'hbox'
					},
					items : [{
						xtype : 'label',
						text : getLabel('financialinstitution',
								'Financial Institution'),
						cls : 'frmLabel w12'
					}]
				}, {
					xtype : 'combo',
					displayField : 'description',
					fieldCls : 'xn-form-field inline_block',
					triggerBaseCls : 'xn-form-trigger',
					filterParamName : 'sellerId',
					itemId : 'sellerFltId',
					valueField : 'sellerCode',
					name : 'sellerCombo',
					editable : false,
					value : strSellerId,
					store : objStore,
					listeners : {
						'select' : function(combo, strNewValue, strOldValue) {
							setAdminSeller(combo.getValue());
							me.fireEvent('handleSellerFilterChange', combo,
									strNewValue, strOldValue);
						},
						'afterrender' : function(combo, cfg) {
							combo.setValue(strSellerId);
						}
					}
				}]
			},
					// Panel 2
					{
						xtype : 'panel',
						cls : 'xn-filter-toolbar',
						flex : 0.065,
						layout : 'vbox',
						items : [{
							xtype : 'label',
							text : getLabel('lblLmsProductTypeName',
									'Product Type Name'),
							cls : 'frmLabel',
							flex : 0.20
						}, {
							xtype : 'AutoCompleter',
							matchFieldWidth : true,
							cfgProxyMethodType : 'POST',
							fieldCls : 'xn-form-text w165 xn-suggestion-box ux_font-size14-normal',
							cls:'ux_font-size14-normal',
							labelSeparator : '',
							name : 'fltProductTypeName',
							itemId : 'fltrFldProductTypeName',
							cfgUrl : 'cpon/cpondependentseek/{0}.json',
							cfgQueryParamName : 'qfilter',
							cfgRecordCount : -1,
							cfgSeekId : 'lmsProductTypeSeek',
							cfgRootNode : 'd.filter',
							cfgKeyNode1 : 'name',
							cfgDataNode1 : 'value',
							enforceMaxLength : true,
							maxLength : 40,
							cfgExtraParams : [{
										key : '$filterCode1',
										value : modelSelectedMst
									}]
						}]
					}, {
						// panel 3
						xtype : 'panel',
						cls : 'xn-filter-toolbar',
						flex : 0.065,
						layout : 'vbox',
						items : [{
									xtype : 'label',
									text : getLabel('status', 'Status'),
									cls : 'f13 ux_font-size14 ux_normalmargin-bottom'
								}, {
									xtype : 'combo',
									fieldCls : 'xn-form-field inline_block',
								    triggerBaseCls : 'xn-form-trigger',
									itemId : 'statusFilter',
									store : statusStore,
									width : '40%',
									valueField : 'name',
									displayField : 'value',
									name : 'requestState',
									editable : false,
									value : 'all'//getLabel('all', 'All')
								}]
					},
					// Panel 4
					{
						xtype : 'panel',
						cls : 'xn-filter-toolbar',
						layout : 'vbox',
						flex : 0.065,
						items : [{
							xtype : 'panel',
							layout : 'hbox',
							padding : '23 0 1 0',
							items : [{
								xtype : 'button',
								itemId : 'btnFilter',
								text : getLabel('search',
														'Search'),
												cls : 'ux_button-padding ux_button-background ux_button-background-color'
							}]
						}]
					}]
		}];
		this.callParent(arguments);
	}

});