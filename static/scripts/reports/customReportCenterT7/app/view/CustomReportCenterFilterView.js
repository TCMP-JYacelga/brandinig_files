/**
 * @class GCP.view.CustomReportCenterFilterView
 * @extends Ext.panel.Panel
 * @author Nilesh Shinde
 */
Ext.define( 'GCP.view.CustomReportCenterFilterView',
{
	extend : 'Ext.panel.Panel',
	xtype : 'customReportCenterFilterViewType',
	requires :
	[
		'Ext.menu.Menu', 'Ext.menu.DatePicker', 'Ext.container.Container', 'Ext.toolbar.Toolbar', 'Ext.button.Button',
		'Ext.panel.Panel', 'Ext.ux.gcp.AutoCompleter'
	],
	width : '100%',
	accountSetPopup : null,
	statusCode : null,
	statusCodeDesc : null,
	repOrDwnld : null,
	repOrDwnldDesc : null,
	reportType : null,
	reportTypeDesc : null,
	seller : strSeller,
	sellerDesc : null,
	clientCode : null,
	clientDesc : null,
	objSellerStore : null,
	initComponent : function()
	{
		var me = this;
		reportSummaryView = this;
		var arrItems = [], panel = null;
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
		 me.objSellerStore = Ext.create('Ext.data.Store', {
				fields : ['CODE', 'DESCR'],
				data : storeData,
				reader : {
					type : 'json',
					root : 'preferences'
				}
				});
		 me.objSellerStore.load();
		 
		panel = me.createFilterLowerPanel();
		arrItems.push( panel );
		me.items = arrItems;
		me.callParent( arguments );
	},
	populateClientMenu : function(data) {
		var me = this;
		var clientMenu = me.down('menu[itemId="clientMenu"]');
		var clientBtn = me.down('button[itemId="clientBtn"]');
		var filterClientMenuContainer = me
				.down('container[itemId="filterClientMenuContainer"]');
		var clientArray = data.d.preferences || [];
		Ext.each(clientArray, function(client) {

					clientMenu.add({
								text : client.DESCR,
								code : client.CODE,
								btnDesc : client.DESCR
							});
				});
		if (null != clientArray && clientArray.length <= 1) 
		{
		}

	},
	addDataToClientCombo:function(data){
		var me=this;
		var clientMenu=[];
		var clientCombobox=me.down('combo[itemId="clientCombo"]');
		var filterClientMenuContainer = me.down('container[itemId="filterClientMenuContainer"]');
		var clientArray = data.d.preferences || [];
		Ext.each(clientArray, function(client) {
					clientMenu.push({
								DESCR : client.DESCR,
								CODE : client.CODE
							});
				});	
		if (null != clientArray && clientArray.length <= 1) {
			filterClientMenuContainer.hide();    
		}else{
			clientCombobox.getStore().loadRawData(clientMenu);
		}
	},
	createFilterLowerPanel : function()
	{
		var me = this;
		var parentPanel = Ext.create( 'Ext.panel.Panel',
		{
			layout : 'hbox',
			itemId : 'filterLowerPanel',
			items :
			[
				me.createSellerFilter(),
				me.createClientCombo(),
				//me.createClientAutoCompleter(),
				me.createStatusFilter()
				
			]
		} );
		return parentPanel;
	},
	createClientCombo:function(){
		var me=this;
		var clientStore = me.getClientStore();
		var clientCombo=Ext.create('Ext.container.Container',{
			itemId:'filterClientMenuContainer',
			layout : 'vbox',
			flex:1,
			hidden : ((clientStore.getCount() <= 2) || !isClientUser()) ? true : false,//If count is one or admin then hide
			items:[
				{
					xtype : 'label',
					text : getLabel("Client", "Company Name"),
					margin : '0 0 0 6'
				},{
					xtype : 'combo',
					padding:'0 0 0 6',
					valueField : 'CODE',
					displayField : 'DESCR',
					queryMode : 'local',
					width : 280,
					emptyText : getLabel("Client", "Select Company"),
					itemId:'clientCombo',
					triggerAction : 'all',
					triggerBaseCls : 'xn-form-trigger',
					editable : false,
					store : clientStore,
					listeners:{
						'select':function(combo,record){
							me.clientCode = combo.getValue();
							me.clientDesc = combo.getRawValue();
							me.handleQuickFilterChange();	}
						}
				}]
		});
		return clientCombo;
	},
	createClientAutoCompleter:function(){
	var me=this;	
	var clientAutoCompleterContainer=Ext.create('Ext.container.Container',{
			flex : 1,
			layout : 'vbox',
			itemId : 'filterClientAutoCmplterCnt',
			hidden : isClientUser(),
			items : [{
					xtype : 'label',
					text : getLabel("Client", "Company Name"),
					margin : '0 0 0 6'
				},{
					xtype : 'AutoCompleter',
					padding:'0 0 0 6',
					cfgTplCls : 'xn-autocompleter-t7',
					fieldCls : 'xn-form-text xn-suggestion-box',
					itemId : 'reportCenterClientId',
					name : 'client',
					cfgUrl : 'services/userseek/userclients.json',
					cfgRecordCount : -1,
					cfgRootNode : 'd.preferences',
					cfgDataNode1 : 'DESCR',
					cfgDataNode2 : 'SELLER_CODE',
					cfgKeyNode : 'CODE',
					value : strClient,
					width : 280,
					cfgQueryParamName : '$autofilter',
					cfgProxyMethodType : 'POST',
						listeners : {
							'select' : function(combo, record) {
								strClient = combo.getValue();
								strClientDesc = combo.getRawValue();
								reportSummaryView.seller = record[0].data.SELLER_CODE;
								reportSummaryView.handleQuickFilterChange();
							},
							'change' : function(combo, newValue, oldValue, eOpts) {	
								if (Ext.isEmpty(newValue)) {					
									reportSummaryView.fireEvent('handleClientChange');
								}
							},
							'render':function(combo,newValue,oldValue,eOpts){
								combo.listConfig.width = 200;
							}
						}
					}]	
		}); 
		return clientAutoCompleterContainer;
	},
	setSellerToClientAutoCompleterUrl : function()
	{
		var me = this;
		var sellerCombo = me.down( 'combobox[itemId="reportCenterSellerId"]' );
		var seller = sellerCombo.getValue();
		var clientautoComplter = me.down( 'combobox[itemId="reportCenterClientId"]' );
		//clientautoComplter.reset();
		clientautoComplter.cfgExtraParams =
		[
			{
				key : '$filtercode1',
				value : seller
			}
		];
	},
	createStatusFilter:function(){
		var me = this;
		var reportDownloadTypeFilterPanel = Ext.create('Ext.container.Container', {
					itemId : 'statusFilterPanel',
					flex : 1,
					layout : {
						type : 'vbox'
					},
					items : [{
								xtype : 'label',
								text :  getLabel( 'reportStatus', 'Status' ),
								margin : '0 0 0 6'
							},
							Ext.create('Ext.ux.gcp.CheckCombo', {
								valueField : 'code',
								displayField : 'desc',
								editable : false,
								addAllSelector : true,
								emptyText : getLabel('all', 'All'),
								multiSelect : true,
								width : 256,
								padding : '-4 0 0 0',
								itemId : 'reportStatusToolBar',
								isQuickStatusFieldChange : false,
								store : me.getStatusStore(),
								listeners : {
									'select' : function(combo,selectedRecords) {
										combo.isQuickStatusFieldChange = true;
									},
									'blur':function(combo,record){
										if(combo.isQuickStatusFieldChange)
										{
											me.statusCode = combo.getSelectedValues();
											me.statusCodeDesc = combo.getRawValue();
											me.handleQuickFilterChange();
										}
											
									}
								}
							})
							
						]
						});
		return reportDownloadTypeFilterPanel;		
	},
	statusFilterStore:function(){
		var me=this;
		var dataArray=[{
			text : getLabel( 'all', 'All' ),
			code : 'All',
			btnDesc : 'All',
			btnId : 'allReportStatus'
		},{
			text : getLabel( 'active', 'Active' ),
			code : 'ACTIVE',
			btnDesc : 'Standard',
			btnId : 'standardType'
		},{
			text :getLabel( 'new', 'New' ),
			code : 'NEW',
			btnDesc : 'New',
			btnId : 'myReportsType'
		}];
		var objStore = Ext.create('Ext.data.Store', {
					fields : ["text", "code"],
					autoLoad:true,
					data:dataArray
				});
	return 	objStore;	
	},
	getStatusStore : function(){
		var objStatusStore = null;
		if (!Ext.isEmpty(arrCustomStatus)) {
			objStatusStore = Ext.create('Ext.data.Store', {
						fields : ['code','desc'],
						data : arrCustomStatus,
						autoLoad : true,
						listeners : {
							load : function() {
							}
						}
					});
			objStatusStore.load();
		}
		return objStatusStore;
	},
	createSellerFilter:function(){
		var me = this;
		var sellerDownloadTypeFilterPanel = Ext.create('Ext.container.Container', {
					itemId : 'sellerFilterPanel',
					flex : 1,
					hidden : ((me.objSellerStore.getCount() <= 1) || isClientUser()) ? true : false,//If count is one or admin then hide
					layout : {
						type : 'vbox'
					},
					items : [{
								xtype : 'label',
								text : getLabel('financialInstitution', 'Financial Institution'),
								cls : 'frmLabel w12'
							},
							{
								xtype : 'combo',
								padding : '0 0 0 6',
								filterParamName : 'sellerId',
								itemId : 'sellerFltId',
								emptyText:'Select',
								editable:false,
								displayField:'DESCR',
								valueField:'CODE',
								width : 256,
								triggerBaseCls : 'xn-form-trigger',
								store: me.objSellerStore,
								value :strSeller,
								listeners:{
									'render' : function(combo, record) {
										combo.store.load();
									},
									'select' : function(combo, strNewValue, strOldValue) {
										me.seller = combo.getValue();
										me.sellerDesc = combo.getRawValue();
										setAdminSeller(combo.getValue());
										me.handleQuickFilterChange();
									}
								}
							}
							
						]
						});
		return sellerDownloadTypeFilterPanel;		
	},
	getQuickFilterJSON : function()
	{
		var me = this;
		var filterJson = {};
		var field = null, strValue = null;
		var clientStore = me.getClientStore();
		strValue = strSeller;
		filterJson[ 'sellerCode' ] = strValue;
		if( !isClientUser() )
		{
			field = me.down( 'combobox[itemId="reportCenterClientId"]' );
			strValue = field ? field.getValue() : '';
			filterJson[ 'clientCode' ] = strValue;
			strValue = field ? field.getRawValue() : '';
			filterJson[ 'clientDesc' ] = strValue;
		}
		else if((clientStore.getCount() > 2) || !isClientUser())
		{
			
			if( !Ext.isEmpty( me.clientCode ) && me.clientCode != 'all' )
				filterJson[ 'clientCode' ] = me.clientCode;
			filterJson[ 'clientDesc' ] = me.clientDesc;
		}
		filterJson[ 'statusCode' ] = ( me.statusCode != 'All' ) ? me.statusCode.toString() : null;
		filterJson[ 'statusCodeDesc' ] = me.statusCodeDesc.toString();
		// only reports
		filterJson[ 'repOrDwnld' ] = 'R';
		filterJson[ 'repOrDwnldDesc' ] = me.repOrDwnldDesc;
		// only custom reports
		filterJson[ 'reportType' ] = 'C';
		filterJson[ 'reportTypeDesc' ] = me.reportTypeDesc;
		return filterJson;
	},
	handleQuickFilterChange : function()
	{
		var me = this;
		me.fireEvent( 'quickFilterChange', me.getQuickFilterJSON() );
	},
	getClientStore:function(){
		var clientData=null;
		var objClientStore=null;
		Ext.Ajax.request({
			url : 'services/userseek/userclients.json',
			async : false,
			method : "POST",
			success : function(response) {
				if (!Ext.isEmpty(response.responseText)) {
					var data = Ext.decode(response.responseText);
					if (data && data.d) {
						clientData = data.d.preferences;
						objClientStore = Ext.create('Ext.data.Store', {
									fields : ['CODE',
											'DESCR'],
									data : clientData,
									reader : {
										type : 'json',
										root : 'd.preferences'
									},
									autoLoad : true,
									listeners : {
										load : function() {
											this.insert(0, {
														CODE : 'all',
														DESCR : getLabel('allCompanies', 'All Companies')
													});
										}
									}
								});
						objClientStore.load();
					}
				}
			},
			failure : function(response) {
				// console.log('Error Occured');
			}
		});
		return objClientStore;
	}
} );
