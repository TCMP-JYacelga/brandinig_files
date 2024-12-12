Ext.define('GCP.view.TypeCodeMstFilterView',
{
	extend : 'Ext.panel.Panel',	
	xtype  : 'typeCodeFilterView',
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
		var storeData;
        /*var strSellerId;
		Ext.Ajax.request({
			url : 'services/userseek/adminSellersListCommon.json'+"?" + csrfTokenName + "=" + csrfTokenValue,
			read :'POST',
			async: false,
			success : function( response )
			{
				var data = Ext.decode( response.responseText );
				var sellerData = data.d.preferences;
				if( !Ext.isEmpty( sellerData ) ){
					storeData = sellerData;
				}
			},
			failure : function(response)
			{
				// console.log("Ajax Get data Call Failed");
			}
		});

		
	var objStore = Ext.create('Ext.data.Store', {
			fields : ["CODE","DESCR"],
			data : storeData,
			reader : {
				type : 'json',
				root : 'preferences'
			       },
			       listeners : {
						'load' : function(store) {
							if(!Ext.isEmpty(store) && !Ext.isEmpty(store.first()))
								strSellerId = store.first().get('CODE');					
						}}
			});
		if(objStore.getCount() > 1){
			multipleSellersAvailable = true;
		    }*/
	
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

		var levelStore = Ext.create('Ext.data.Store', {
			fields : ["name", "value"],
			data :[
			       {"name":getLabel('all', 'All'), "value": "ALL"},
			       {"name":getLabel('status', 'Status'), "value": "Status"},
			       {"name":getLabel('summary', 'Summary'), "value": "Summary"},
			       {"name":getLabel('detail', 'Detail'), "value": "Detail"}
			      ]
		});		
		
		this.items=[{
			xtype : 'panel',
			itemId : 'mainContainer',
			layout : 'hbox',
			cls: 'ux_border-top ux_largepadding',
			items :[/*{
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
						text : getLabel('financialinstitution', 'Financial Institution'),
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
							me.fireEvent('handleSellerFilterChange', combo, strNewValue, strOldValue);
						},
						'afterrender':function(combo,cfg){
							combo.setValue(strSellerId);
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
					text : getLabel('lblTypecode', 'Type Code'),
					cls : 'frmLabel',
					flex : 0.20
				},{
					xtype : 'AutoCompleter',
					matchFieldWidth : true,
					cfgProxyMethodType : 'POST',
					width : '90%',
					fieldCls : 'xn-form-text xn-suggestion-box',
					labelSeparator : '',
					name : 'typeCode',
					itemId : 'typeCode',
					cfgUrl : 'cpon/cponseek/{0}.json',
					cfgQueryParamName : 'qfilter',
					cfgRecordCount : -1,
					cfgSeekId : 'typeCodesListSeek',
					cfgRootNode : 'd.filter',
					cfgKeyNode1 : 'name',	
					cfgDataNode1 : 'value'
				}]
			},
			{
				xtype : 'panel',
				cls : 'xn-filter-toolbar',
				flex : 0.065,
				layout : 'vbox',
				items :
				[{
					xtype : 'label',
					text : getLabel('lblTypecodedesc', 'Type Code Description'),
					cls : 'frmLabel',
					flex : 0.20
				},{
					xtype : 'AutoCompleter',
					matchFieldWidth : true,
					cfgProxyMethodType : 'POST',
					width : '90%',
					fieldCls : 'xn-form-text xn-suggestion-box',
					labelSeparator : '',
					name : 'typeCodeDesc',
					itemId : 'typeCodeDesc',
					cfgUrl : 'cpon/cponseek/{0}.json',
					cfgQueryParamName : 'qfilter',
					cfgRecordCount : -1,
					cfgSeekId : 'typeCodesDescListSeek',
					cfgRootNode : 'd.filter',
					cfgKeyNode1 : 'name',	
					cfgDataNode1 : 'value'
				}]
			},			
			{
				//panel 3
				xtype : 'panel',
				cls : 'xn-filter-toolbar',
				flex : 0.065,
				layout : 'vbox',
				items :[{
					xtype : 'label',
					text : getLabel('lbllevel', 'Level'),
					cls : 'frmLabel',
					flex : 0.20
				},
				{
					xtype : 'combo',
					fieldCls : 'xn-form-field inline_block',
					triggerBaseCls : 'xn-form-trigger',
					itemId : 'levelFilter',	
					store : levelStore,
					width : '90%',
					valueField : 'value',
					displayField : 'name',
					name : 'level',
					editable : false,
					value : getLabel('all', 'All')
				}]
			},
			{
				//panel 3
				xtype : 'panel',
				cls : 'xn-filter-toolbar',
				flex : 0.065,
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
					width : '90%',
					valueField : 'name',
					displayField : 'value',
					name : 'requestState',
					editable : false,
					value : getLabel('all', 'All')
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