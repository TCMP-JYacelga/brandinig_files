Ext.define('GCP.view.SystemAccountFilterView', {
		extend : 'Ext.panel.Panel',
		xtype : 'systemAccountFilterView',
		requires : ['Ext.ux.gcp.AutoCompleter'],
		width : '100%',
		componentCls : 'gradiant_back',
		collapsed : true,
		collapsible : true,
		cls : 'xn-ribbon ux_border-bottom',
		layout : {
			type : 'vbox',
			align : 'stretch'
		},
		initComponent : function() {
			var me = this;
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
					url : 'cpon/statusList.json',
					actionMethods : {
						read : 'POST'
					},
					reader : {
						type : 'json',
						root : 'd.filter'
					}
				}*/
			});
			
		
			
			
			var storeData = null;
			
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
		     
		
		    var ccyStore = Ext.create('Ext.data.Store', {
				fields : ['name', 'value'],
				proxy : {
					type : 'ajax',
					url : 'cpon/cponseek/ccySeek.json',
					actionMethods : {
			        	read : 'POST'
			       },
					reader : {
						type : 'json',
						root : 'd.filter'
					}
				},
				autoLoad : true
			});
			ccyStore.on('load',function(){
				if(ccyStore.getAt(0).data.name != 'Select') {
					ccyStore.insert(0, {
		              name : 'Select',
		              value : getLabel('select', 'Select')
		             });
				}
			});
			ccyStore.load();
			var entityTypeStore = Ext.create('Ext.data.Store', {
				fields : ['ENTITY_TYPE'],
				proxy : {
					type : 'ajax',
					url : 'services/systemAccountMst/entityType.json',
					actionMethods : {
			        	read : 'POST'
			       },
					reader : {
						type : 'json'
						//root : 'd.filter'
					}
				},
				autoLoad : true
			})
		    
			
			this.items = 
			[{
				xtype : 'panel',
				layout : 'hbox',
				cls: 'ux_largepadding',
				items :
				[
					//Panel 1
					{
						xtype : 'panel',
						cls : 'xn-filter-toolbar',
						itemId : 'financialInsttitutionPanel',
						flex : 0.05,
						layout :
						{
							type : 'vbox'
						},
						items :
						[
							{
								xtype : 'label',
								text : getLabel( 'seller', 'Financial Insttitution' ),
								cls : 'frmLabel required'
							},
							{
								xtype : 'combobox',
								displayField : 'DESCR',
								fieldCls : 'xn-form-field inline_block',
								triggerBaseCls : 'xn-form-trigger',
								filterParamName : 'sellerId',
								itemId : 'sellerFltId',
								store : objStore,
								valueField : 'CODE',
								editable : false,
								value :strSellerId,
								parent : this,
								listeners : {
									'select' : function(combo, strNewValue, strOldValue) {
										setAdminSeller(combo.getValue());
									}
								}
							}
						]
					},
					//Panel 3
					{
						xtype : 'panel',
						cls : 'xn-filter-toolbar',
						flex : 0.05,
						itemId : 'entityPanel',
						layout :
						{
							type : 'vbox'
						},
						items :
						[
							{
								xtype : 'label',
								text : getLabel( 'entityType', 'Entity Type' ),
								cls : 'frmLabel required'
							},
							{
								xtype : 'combobox',
								fieldCls : 'xn-form-field inline_block',
								triggerBaseCls : 'xn-form-trigger',
								matchFieldWidth : true,
								itemId : 'entityCombo',
								store : entityTypeStore,
								valueField : 'ENTITY_TYPE',
								displayField : 'ENTITY_TYPE',
								editable : false,
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
						layout :
						{
							type : 'vbox'
						},items : [{
							xtype : 'label',
							text : getLabel( 'entityCode', 'Entity Name' ),
							cls : 'frmLabel'
							},{
								xtype : 'AutoCompleter',
								matchFieldWidth : true,
								width : 185,								
								fieldCls : 'xn-form-text inline_block',
								labelSeparator : '',
								name : 'entityNameDesc',
								itemId : 'entityName',
								cfgUrl : 'services/userseek/entityNameSeek.json',
								cfgQueryParamName : '$autofilter',
								cfgRecordCount : -1,
								cfgSeekId : 'entityNameSeek',
								cfgRootNode : 'd.preferences',
								cfgDataNode1 : 'DESCR',
								//cfgDataNode2 : 'DESCR',
								cfgKeyNode : 'CODE',
								enableQueryParam:false,
								cfgStoreFields :['CODE','DESCR'],
								listeners : {
									'select' : function(combo, record) {
										strEntityName = combo.getValue();
									}
								}
							}]
					},
					{
						xtype : 'panel',
						cls : 'xn-filter-toolbar',
						flex : 0.05,
						layout :
						{
							type : 'vbox'
						},
						items :
						[
							{
								xtype : 'label',
								text : getLabel( 'currency', 'Currency' ),
								cls : 'frmLabel'
							},
							{
								xtype : 'combobox',
								fieldCls : 'xn-form-field inline_block',
								triggerBaseCls : 'xn-form-trigger',
								matchFieldWidth : true,
								itemId : 'currencyCombo',
								store : ccyStore,
								valueField : 'key',
								displayField : 'value',
								editable : false,
								value : getLabel( 'select', 'Select' ),
								parent : this
							}
						]
					},
					{
						xtype : 'panel',
						cls : 'xn-filter-toolbar',
						itemId : 'emptyPanel',
						flex : 0.05,
						hidden:true,
						layout :
						{
							type : 'vbox'
						},
						items :
						[{}]
					}
				]
			},
		{
			xtype : 'panel',
			layout : 'hbox',
			cls: 'ux_largepadding',
			items :
			[
				//Panel 1
				
				//Panel 2
				{
					xtype : 'panel',
					cls : 'xn-filter-toolbar',
					flex : 0.05,
					layout :
					{
						type : 'vbox'
					},
					items :
					[
						{
							xtype : 'label',
							text : getLabel( 'product', 'Product' ),
							cls : 'frmLabel w12'
						},
						{
							xtype : 'combobox',
							fieldCls : 'xn-form-field inline_block',
							triggerBaseCls : 'xn-form-trigger',
							matchFieldWidth : true,
							itemId : 'productCombo',
							//store : productStore,
							valueField : 'PRODUCT_CODE',
							displayField : 'PRODUCT_DESCRIPTION',
							editable : false,
							value : getLabel( 'select', 'Select' ),
							parent : this
						}
					]
				},
				{
					xtype : 'panel',
					cls : 'xn-filter-toolbar',
					layout : 'vbox',
					flex : 0.05,
					layout :
					{
						type : 'vbox'
					},items : [{
						xtype : 'label',
						text : getLabel('Account Name', 'Account Name'),
						cls : 'frmLabel'
						},{
							xtype : 'AutoCompleter',
							matchFieldWidth : true,
							width : 185,							
							fieldCls : 'xn-form-text inline_block',
							labelSeparator : '',
							name : 'accountNameDesc',
							itemId : 'AccountName',
							cfgUrl : 'services/userseek/accountNameSeek.json',
							cfgQueryParamName : '$autofilter',
							cfgRecordCount : -1,
							cfgSeekId : 'accountNameSeek',
							cfgRootNode : 'd.preferences',
							cfgDataNode1 : 'DESCR',
							//cfgDataNode2 : 'DESCR',
							cfgKeyNode : 'CODE',
							enableQueryParam:false,
							cfgStoreFields :['CODE','DESCR'],
							listeners : {
								'select' : function(combo, record) {
									strAccountName = combo.getValue();
								}
							}
						}]
				},
				//Panel 3
				{
					xtype : 'panel',
					cls : 'xn-filter-toolbar',
					flex : 0.05,
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
							value : 'ALL',//getLabel( 'all', 'ALL' ),
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
				}
			]
		}
	];
	this.callParent(arguments);
	}
});