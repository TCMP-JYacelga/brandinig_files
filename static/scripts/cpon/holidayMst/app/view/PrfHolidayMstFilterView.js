Ext.define('GCP.view.PrfHolidayMstFilterView',
{
	extend : 'Ext.panel.Panel',	
	xtype  : 'prfHolidayFilterView',
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
		var storeData = null;
		var firstSeller = null;
		if(entity_type === '0')
		{
			/*Ext.Ajax.request({
				url : 'services/sellerListFltr.json'+"?" + csrfTokenName + "=" + csrfTokenValue,
				read :'POST',
				async: false,
				success : function( response )
				{
					var data = Ext.decode( response.responseText );
					var sellerData = data.filterList;
					if( !Ext.isEmpty( data ) ){
						storeData = data;
					}
				},
				failure : function(response)
				{
				}
				  });
				*/
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
					},
					listeners : {
						'load' : function(store) {
							if(!Ext.isEmpty(store) && !Ext.isEmpty(store.first()))
								firstSeller = store.first().get('CODE');
						}}
				});
		if(objStore.getCount() > 1){
			multipleSellersAvailable = true;
		    }
	
		/*var objStore = Ext.create('Ext.data.Store', {
			fields : ['sellerCode', 'description'],
			data : storeData,
			reader : {
				type : 'json',
				root : 'filterList'
			       }
			});
		if(objStore.getCount() > 1){
			multipleSellersAvailable = true;
		    }*/
	
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

		this.items=[{
			xtype : 'panel',
			itemId : 'mainContainer',
			layout : 'hbox',
			cls: 'ux_border-top ux_largepadding',
			items :[
			{
				//panel 1
				xtype : 'panel',
				itemId : 'firstRow',
				cls : 'xn-filter-toolbar',
				hidden : multipleSellersAvailable == true ? false : true,
				flex : 0.05,
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
						'select' : function(combo, strNewValue, strOldValue) {
							setAdminSeller(combo.getValue());
						}
					}
				}]
			},
			/* {
				//panel 1
				xtype : 'panel',
				itemId : 'firstRow',
				cls : 'xn-filter-toolbar',
				hidden : multipleSellersAvailable == true ? false : true,
				flex : 0.05,
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
					displayField : 'description',
					fieldCls : 'xn-form-field inline_block',
					triggerBaseCls : 'xn-form-trigger',
					filterParamName : 'sellerId',
					itemId : 'sellerFltId',
					valueField : 'sellerCode',
					name : 'sellerCombo',
					editable : false,
					value :strSellerId,
					store : objStore,
					listeners : {
						'select' : function(combo, strNewValue, strOldValue) {
							me.fireEvent('handleSellerFilterChange', combo, strNewValue, strOldValue);
						},
						'afterrender':function(combo,cfg){
							combo.setValue(defaultSeller);
						}
					}
				}]
			},*/
			//Panel 2
			{
				xtype : 'panel',
				cls : 'xn-filter-toolbar',
				flex : 0.065,
				layout : 'vbox',
				items :
				[{
					xtype : 'label',
					text : getLabel('profileName', 'ProfileName'),
					cls : 'frmLabel',
					flex : 0.20
				},{
					xtype : 'AutoCompleter',
					matchFieldWidth : true,
					cfgProxyMethodType : 'POST',
					width : '100%',
					fieldCls : 'xn-form-text w14 xn-suggestion-box',
					labelSeparator : '',
					name : 'profileName',
					itemId : 'profileName',
					cfgUrl : 'services/userseek/{0}.json',
					cfgQueryParamName : '$autofilter',
					cfgRecordCount : -1,
					cfgSeekId : 'holidayprofilenameseek',
					cfgRootNode : 'd.preferences',
					cfgDataNode1 : 'CODE',
					cfgKeyNode : 'CODE'					
					/*listeners : {
						'change' : function(combo, strNewValue, strOldValue) {
							me.fireEvent('handleChangeFilter', combo, strNewValue, strOldValue);
						}
					}*/
				}]
			},{
				//panel 3
				xtype : 'panel',
				cls : 'xn-filter-toolbar',
				flex : 0.05,
				layout : 'vbox',
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
					itemId : 'statusFilter',	
					store : statusStore,
					valueField : 'name',
					displayField : 'value',
					name : 'requestState',
					editable : false,
					value : 'all',//getLabel('all','All'),
					listeners : {
						afterrender : function() {
							var me = this;
							me.inputEl.set({onfocus: "this.blur();"});
							/*me.inputEl.set({onblur: "this.removeAttribute('disabled');"});*/
						}
					}
					/*listeners : {
						'select' : function(combo, strNewValue, strOldValue) {
							me.fireEvent('handleChangeFilter', combo, strNewValue, strOldValue);
						}
					}*/
				}]
			},
			//Panel 4
			{
					xtype : 'panel',
					cls : 'xn-filter-toolbar',
					layout : 'vbox',
					flex : 0.05,
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
									//cls : 'ux_button-padding ux_button-background-color',
									cls : 'ux_button-padding ux_button-background ux_button-background-color',
									height : 22
								}
							]
						}
					]
				}]
		}];
		this.callParent( arguments );
	}
	
});