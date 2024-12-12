/**
 * @class GCP.view.ReceivableProductMstFilterView
 * @extends Ext.panel.Panel
 * @author Archana Shirude
 */

Ext.define( 'GCP.view.ReceivableProductMstFilterView',
{
	extend : 'Ext.panel.Panel',
	xtype : 'receivableProductMstFilterViewType',
	requires :
	[
		'Ext.ux.gcp.AutoCompleter'
	],
	width : '100%',
	componentCls : 'gradiant_back',
	collapsible : true,
	collapsed :true,
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
		if(entityType === '0')
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
	
		var requestStateComboStore;
		requestStateComboStore =Ext.create('Ext.data.Store', {
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

		this.items =
		[
			{
				xtype : 'panel',
				layout : 'hbox',
				cls: 'ux_largepadding ux_border-top',
				items :
				[
					{
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
						}
					}
				}]
			},
			
			//Panel 2
					{
						xtype : 'panel',
						cls : 'xn-filter-toolbar',
						flex : 0.25,
						layout :
						{
							type : 'vbox'
						},
						items :
						[
							{
								xtype : 'panel',
								layout :
								{
									type : 'hbox'
								},
								items :
								[
									{
										xtype : 'label',
										text : getLabel( 'productName', 'Product Name' ),
										cls : 'frmLabel',
										flex : 0.20
									}
								]
							},
							{
								xtype : 'AutoCompleter',
								matchFieldWidth : true,
								width : '100%',
								fieldCls : 'xn-form-text w14 xn-suggestion-box',
								labelSeparator : '',
								name : 'productName',
								itemId : 'productNameFilterItemId',
								cfgUrl : 'services/userseek/receivableProductCodeSeek.json',
								cfgQueryParamName : '$autofilter',
								cfgRecordCount : -1,
								cfgSeekId : 'receivableProductCodeSeek',
								cfgRootNode : 'd.preferences',
								displayfieldIndex : 1,
								cfgKeyNode : 'DESCRIPTION',
								cfgDataNode1 : 'PRODUCT_CODE',
								cfgDataNode2 : 'DESCRIPTION',
								cfgStoreFields :
								[
									'PRODUCT_CODE',
									'DESCRIPTION'
								],
								enableQueryParam:false,
								cfgProxyMethodType:'POST',
								cfgExtraParams :
								[
									{
										key : '$sellerCode',
										value : strSellerId
									}
								]
							}
						]
					},

					//Panel 3
					{
						xtype : 'panel',
						cls : 'xn-filter-toolbar',
						flex : 0.25,
						layout :
						{
							type : 'vbox'
						},
						items :
						[
							{
								xtype : 'panel',
								layout :
								{
									type : 'hbox'
								},
								items :
								[
									{
										xtype : 'label',
										text : getLabel( 'status', 'Status' ),
										cls : 'frmLabel'
									}
								]
							},
							{
								xtype : 'combobox',
								fieldCls : 'xn-form-field inline_block',
								triggerBaseCls : 'xn-form-trigger',
								matchFieldWidth : true,
								width: 196,
								itemId : 'requestStateFilterItemId',
								store : requestStateComboStore,
								valueField : 'name',
								displayField : 'value',
								name : 'requestState',
								editable : false,
								value : getLabel( 'lblAll', 'ALL' ),
								parent : this
							}
						]
					},

					//Panel 4
					{
						xtype : 'panel',
						cls : 'xn-filter-toolbar',
						layout : 'vbox',
						flex : 0.05,
						columnWidth : 0.15,
						items :
						[
							{
								xtype : 'panel',
								layout : 'hbox',
								padding : '26 0 1 0',
								items :
								[
									{
										xtype : 'button',
										itemId : 'btnFilter',
										text : getLabel( 'search', 'Search' ),									
										cls : 'search_button ux_button-background-color ux_button-padding',	
										height : 24
									}
								]
							}
						]
					}
				]
			}
		];
		this.callParent( arguments );
	},
	tools : []
} );
