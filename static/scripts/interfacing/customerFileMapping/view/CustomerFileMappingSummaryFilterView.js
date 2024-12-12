Ext.define('GCP.view.CustomerFileMappingSummaryFilterView',
{
	extend : 'Ext.panel.Panel',
	xtype : 'customerFileMappingSummaryFilterView',
	requires : [ 'Ext.ux.gcp.AutoCompleter',
			'Ext.layout.container.VBox',
			'Ext.layout.container.HBox', 'Ext.form.Label',
			'Ext.panel.Panel', 'Ext.ux.gcp.AutoCompleter',
			'Ext.toolbar.Toolbar', 'Ext.button.Button' ],
	layout : {
			type:'hbox',
			align : 'stretch'},
	width:'100%',
	clientCode : strClientId,
	clientDesc : strClientDesc,
	initComponent : function() {
		var me = this;
		interfaceSummary = this;
		var clientStore=Ext.create('Ext.data.Store', {
					fields : ['CODE','DESCR']
				});
		Ext.Ajax.request({
					url : 'services/userseek/userclients.json',
					method : 'POST',
					async : false,
					success : function(response) {
						var responseData = Ext.decode(response.responseText);
						var data = responseData.d.preferences;
						if (clientStore) {
							clientStore.removeAll();
							var count = data.length;
							if (count > 1) {
								clientStore.add({
											'CODE' : '',
											'DESCR' :getLabel("allCompanies","All Companies")
										});
							}
							for (var index = 0; index < count; index++) {
								var record = {
									'CODE' : data[index].CODE,
									'DESCR' : data[index].DESCR
								}
								clientStore.add(record);
							}
						}
					},
					failure : function() {
					}
				});
		var objStore = Ext.create('Ext.data.Store', {
					fields : ["name", "value"],
					proxy : {
						type : 'ajax',
						autoLoad : true,
						url : 'services/customInterfaceStatusList.json',
						noCache: false,
						actionMethods : {
							read : 'POST'
						},
						reader : {
							type : 'json',
							root : 'd.filter'
						}
					}
				});
				

var objClientStore = Ext.create('Ext.data.Store', {
			fields : [ 'clientId', 'clientDescription' ],
			proxy : {
				type : 'ajax',
				autoLoad : true,
				url : 'services/clientList.json'
			}
		});
			this.items = [{
			
			xtype : 'container',
			layout : 'vbox',
			hidden : ((clientStore.getCount() < 2) || !isClientUser()) ? true : false,//If count is one or admin then hide
			width : '25%',
			padding : '0 30 0 0',
			items : [{
						xtype : 'label',
						itemId : 'companyLabel',
						text : getLabel('lblcompanyname', 'Company Name')
					}, {
						xtype : 'combo',
						displayField : 'DESCR',
						valueField : 'CODE',
						queryMode : 'local',
						editable : false,
						triggerAction : 'all',
						width : '100%',
						padding : '-4 0 0 0',
						itemId : 'clientCombo',
						mode : 'local',
						value : '',
						emptyText : getLabel('selectCompany', 'Select Company Name'),
						store : clientStore,
						listeners : {
							'select' : function(combo, record) {
								
							}
						}
					}]
		
						},{
							xtype : 'container',
							itemId : 'filterInterfaceNameAutoCmplterCnt',
							flex : 1,
							layout : 'hbox',
							items : [{
										xtype : 'container',
										layout : 'vbox',
										items:[{
												xtype : 'label',
												text : getLabel("interfaceName", "Interface Name")
										  },{
												xtype : 'AutoCompleter',
												name : 'interfaceName',
												width : 250,
												cfgTplCls : 'xn-autocompleter-t7',
												itemId : 'interfaceNameId',
												cfgUrl : 'services/userseek/customInterface.json',
												cfgQueryParamName : '$autofilter',
												cfgStoreFields:['INTERFACE_NAME','INTERFACE_NAME'],
												cfgRecordCount : -1,
												padding : '-4 10 0 0',
												cfgSeekId : 'customInterface',
												matchFieldWidth: true,
												emptyText:getLabel('autoCompleterEmptyText','Enter keyword or %'),
												cfgRootNode : 'd.preferences',
												cfgDataNode1 : 'INTERFACE_NAME',
												cfgKeyNode : 'INTERFACE_NAME',
												cfgProxyMethodType : 'POST',
												enableQueryParam:false,
												cfgExtraParams:[{
															key: "$filtercode1",
															value:  userCode
														}],
												listeners : {
													'render' : function(combo) {
														
													},
													'select' : function(combo, record) {
														var interfaceDesc = combo.getValue();
														this.up('customerFileMappingSummaryFilterView').fireEvent('filterInterfaceName',combo);
													},
													'change' : function(combo, newValue, oldValue, eOpts) {	
														if (Ext.isEmpty(newValue)) {					
															this.up('customerFileMappingSummaryFilterView').fireEvent('filterInterfaceName',combo);
														}
													}
												 }
											}]
									},
						{
							
			  						xtype : 'container',
			  						flex : 1,
			  						layout : 'vbox',
			  						items : [{
			  									xtype : 'label',
			  									text : getLabel('status', 'Status')
			  								}, Ext.create('Ext.ux.gcp.CheckCombo', {
  												valueField : 'name',
  												displayField : 'value',
  												editable : false,
  												addAllSelector : true,
  												emptyText : 'All',
  												multiSelect : true,
  												width : 250,
  												padding : '-4 0 0 0',
  												itemId : 'statusFltId',
  												isQuickStatusFieldChange : false,
  												store : me.getStatusStore(),
  												listeners : {
  													'focus' : function() {
  													//	$('#entryDataPicker').attr(
  													//			'disabled', 'disabled');
  													}
  												}
  											})]
			  					
					} ]
					}
				];

		this.callParent(arguments);
	},
	getStatusStore : function(){
		var objStatusStore = null;
		if (!Ext.isEmpty(statusJsonArr)) {
			objStatusStore = Ext.create('Ext.data.Store', {
						fields : ['name','value'],
						data : statusJsonArr,
						autoLoad : true,
						listeners : {
							load : function() {
							}
						}
					});
			objStatusStore.load();
		}
		return objStatusStore;
	}
	});