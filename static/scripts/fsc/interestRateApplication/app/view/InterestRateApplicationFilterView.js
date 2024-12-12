/**
 * @class GCP.view.InterestRateApplicationFilterView
 * @extends Ext.panel.Panel
 * @author Preeti Kapade
 */
Ext.define('GCP.view.InterestRateApplicationFilterView',
{
	extend : 'Ext.panel.Panel',	
	xtype  : 'interestRateApplicationFilterView',
requires : ['Ext.menu.Menu', 'Ext.container.Container',
			'Ext.toolbar.Toolbar', 'Ext.button.Button', 'Ext.panel.Panel',
			'Ext.ux.gcp.AutoCompleter','Ext.menu.DatePicker','Ext.form.field.Date','Ext.form.field.VTypes'],
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
		var finReqDateFlex = 0.05;
		var finReqStatusFlex = 0.04;
		var searchBtnFlex = 0.01;
		var multipleSellersAvailable = false;
		var statusStore = Ext.create('Ext.data.Store', {
			fields : ["name", "value"],
			data : [{
				"name" : "All",
				"value" : "All"
			},{
				"name" : "N",
				"value" : "New"
			},{
				"name" : "S",
				"value" : "For Approval"
			},{
				"name" : "R",
				"value" : "Rejected"
			}]
			
		});
		
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
			finReqDateFlex = 0.05;
			finReqStatusFlex = 0.05;
			searchBtnFlex = 0.05;
		    }
		
		this.items=[{
			xtype : 'panel',
			itemId : 'mainContainer',
			layout : 'hbox',
			cls: 'ux_border-top ux_largepadding',
			items :[//Panel 1
					{
						xtype : 'panel',
						cls : 'xn-filter-toolbar',
						itemId : 'financialInsttitutionPanel',
						hidden : !multipleSellersAvailable,
						flex : 0.05,
						layout :
						{
							type : 'vbox'
						},
						items :
						[
							{
								xtype : 'label',
								text : getLabel( 'financialInsttitution', 'Financial Institution' ),
								cls : 'frmLabel required'
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
										//me.fireEvent('handleChangeFilter', combo, strNewValue, strOldValue);
									}
								}
							}
						]
					},
					//Panel 2
					{
			    	xtype : 'panel',
					cls : 'xn-filter-toolbar',
					flex : 0.05,
					layout : 'vbox',
					//columnWidth : 0.22,
					items :[
					    {
							xtype : 'label',
							text : getLabel('financeRequestedBy', 'Finance Requested By'),
							cls : 'frmLabel'
							//flex : 0.20
						},{
							xtype : 'AutoCompleter',
							matchFieldWidth : true,
							fieldCls : 'xn-form-text w14 xn-suggestion-box',
							labelSeparator : '',
							name : 'financeRequestedBy',
							itemId : 'financeRequestedBy',
							cfgUrl : 'services/userseek/anchorClientSeek.json',
							cfgQueryParamName : '$autofilter',
							cfgRecordCount : -1,
							cfgSeekId : 'anchorClientSeek',
							cfgRootNode : 'd.preferences',
							cfgDataNode1 : 'DESCR',
							cfgKeyNode : 'CODE',
							enableQueryParam:false,
							cfgStoreFields :['CODE','DESCR'],
							listeners : {
							'select' : function(combo, record) {
							}
							}
						}]
			    },
				//Panel 3
				{
			    	xtype : 'panel',
					cls : 'xn-filter-toolbar',
					flex : 0.05,
					layout : 'vbox',
					//columnWidth : 0.22,
					items :[
					    {
							xtype : 'label',
							text : getLabel('fileName', 'File Name/Document Reference'),
							cls : 'frmLabel'
							//flex : 0.20
						},{
							xtype : 'AutoCompleter',
							matchFieldWidth : true,
							fieldCls : 'xn-form-text w14 xn-suggestion-box',
							labelSeparator : '',
							name : 'fileName',
							itemId : 'fileName',
							cfgUrl : 'services/userseek/fscFileNameSeek.json',
							cfgQueryParamName : '$autofilter',
							cfgRecordCount : -1,
							cfgSeekId : 'fscFileNameSeek',
							cfgRootNode : 'd.preferences',
							cfgDataNode1 : 'CODE',
							//cfgDataNode2 : 'DESCR',	
							cfgKeyNode : 'CODE',
							enableQueryParam:false,
							cfgStoreFields :['CODE'],
							listeners : {
								'select' : function(combo, record) {
									strProduct = combo.getValue();
								}
							}
						}]
			    },
				//Panel 4
			    {
					xtype : 'panel',
					cls : 'xn-filter-toolbar',
					flex : finReqStatusFlex,
					layout :
					{
						type : 'vbox'
					},
					items :
					[
						{
							xtype : 'label',
							text : getLabel( 'status', 'Status' ),
							cls : 'frmLabel'
						},
						{
							xtype : 'combobox',
							fieldCls : 'xn-form-field inline_block',
							triggerBaseCls : 'xn-form-trigger',
							matchFieldWidth : true,
							itemId : 'statusCombo',
							store : statusStore,
							valueField : 'name',
							displayField : 'value',
							editable : false,
							value : getLabel( 'all', 'ALL' ),
							parent : this
						}
					]
				},{
					xtype : 'panel',
					cls : 'xn-filter-toolbar',
					layout : 'vbox',
					flex : searchBtnFlex,
					columnWidth : 0.15,
					items :
					[
						{
							xtype : 'panel',
							layout : 'hbox',
							padding : '23 0 1 0',
							items :
							[
								{
									xtype : 'button',
									itemId : 'btnFilter',
									text : getLabel( 'search', 'Search' ),
									cls : 'ux_button-padding ux_button-background ux_button-background-color',
									height : 22
								}
							]
						}
					]
				}]
		}
		];
		this.callParent( arguments );
	}
});