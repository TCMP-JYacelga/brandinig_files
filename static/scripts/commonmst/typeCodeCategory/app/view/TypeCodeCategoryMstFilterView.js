Ext.define('GCP.view.TypeCodeCategoryMstFilterView',
{
	extend : 'Ext.panel.Panel',	
	xtype  : 'typeCodeCategoryFilterView',
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

		Ext.Ajax.request({
			url : 'services/sellerListFltr.json',
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

		var levelStore = Ext.create('Ext.data.Store', {
			fields : ["name", "value"],
			data :[
			       {"name":getLabel('all', 'All'), "value": ""},
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
			items :[			
			{
				xtype : 'panel',
				cls : 'xn-filter-toolbar',
				flex : 0.065,
				layout : 'vbox',
				items :
				[{
					xtype : 'label',
					text : getLabel('tpcmstTypeCodeCategoryID', 'Type Code Category'),
					cls : 'frmLabel',
					flex : 0.20
				},{
					xtype : 'AutoCompleter',
					matchFieldWidth : true,
					cfgProxyMethodType : 'POST',
					width : '90%',
					fieldCls : 'xn-form-text xn-suggestion-box',
					labelSeparator : '',
					name : 'typeCodeCategory',
					itemId : 'typeCodeCategory',
					cfgUrl : 'cpon/cponseek/{0}.json',
					cfgQueryParamName : 'qfilter',
					cfgRecordCount : -1,
					cfgSeekId : 'typeCodesCategorySeek',
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
					text : getLabel('tpcmstTypeCodeCategory', 'Description'),
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
					cfgSeekId : 'typeCodesCategoryDescSeek',
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