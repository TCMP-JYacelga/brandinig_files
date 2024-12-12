Ext.define('GCP.view.AvmSvmFilterView', {
	extend : 'Ext.panel.Panel',
	xtype : 'avmSvmFilterView',
	requires : ['Ext.container.Container','Ext.panel.Panel',
			'Ext.ux.gcp.AutoCompleter'],
	layout : 'vbox',
	initComponent : function() {
		var me = this;
		pmtSummaryView =this;
		var matrixNameUrl = null;
		var storeData = null;
		var clientsStoreData = null;
		var filterContainerArr = new Array();
		var multipleSellersAvailable = false;
		var clientStore=Ext.create('Ext.data.Store', {
					fields : ['CODE','DESCR']
				});

		var corporationStore = Ext.create('Ext.data.Store', {
			fields : ['CODE', 'DESCR']
		});
		Ext.Ajax.request({
					url : 'services/userseek/userclients.json',
					method : 'POST',
					async : false,
					success : function(response) {
						var responseData = Ext.decode(response.responseText);
						var data = responseData.d.preferences;
						if (corporationStore) {
							corporationStore.removeAll();
							var count = data.length;
							if (count > 1) {
								corporationStore.add({
											'CODE' : 'All',
											DESCR : getLabel('allCompanies', 'All companies')

										});
							}
							for (var index = 0; index < count; index++) {
								var record = {
									'CODE' : data[index].CODE,
									'DESCR' : data[index].DESCR
								}
								corporationStore.add(record);
							}
						}
					},
					failure : function() {
					}
				});		
		
		var clientComboContainer=Ext.create('Ext.container.Container',{
			layout : 'vbox',
			hidden : ((corporationStore.getCount() < 2) || !isClientUser()) ? true : false,//If count is one or admin then hide
			width : '25%',
			padding : '0 30 0 0',
			items : [{
						xtype : 'label',
						itemId : 'savedFiltersLabel',
						text : getLabel("Client", "Company Name")
					}, {
						xtype : 'combo',
						displayField : 'DESCR',
						valueField : 'CODE',
						queryMode : 'local',
						editable : false,
						triggerAction : 'all',
						width : 230,
						padding : '-4 0 0 0',
						itemId : 'clientCombo',
						mode : 'local',
						emptyText : getLabel('selectCorporation',
								'Select Corporation'),
						store : corporationStore,
						listeners : {
							'select' : function(combo, record) {
								var val = combo.getValue(), descr = combo
										.getDisplayValue();
								if (val && descr) {
									changeClientAndRefreshGrid(val, descr);
								}
							}
						}
					}]
		});
		var clientAutoContainer=Ext.create('Ext.container.Container',{
			xtype : 'container',
			layout : 'vbox',
			hidden : (isClientUser()) ? true : false,// If not admin then hide
			width : '25%',
			padding : '0 30 0 0',
			items : [{
						xtype : 'label',
						itemId : 'savedFiltersLabel',
						text : getLabel("Client", "Company Name")
					}, {
						xtype : 'AutoCompleter',
						width : 230,
						matchFieldWidth : true,
						name : 'clientCombo',
						itemId : 'clientComboAuto',
						cfgUrl : "services/userseek/userclients.json",
						padding : '-4 0 0 0',
						cfgQueryParamName : '$autofilter',
						cfgRecordCount : -1,
						cfgSeekId : 'userclients',
						cfgKeyNode : 'CODE',
						cfgRootNode : 'd.preferences',
						cfgDataNode1 : 'DESCR',
						emptyText : getLabel('autoCompleterEmptyText', 'Enter Keyword or %'),
						enableQueryParam : false,
						cfgProxyMethodType : 'POST',
						listeners : {
							'select' : function(combo, record) {
								selectedFilterClientDesc = combo.getRawValue();
								selectedFilterClient = combo.getValue();
								$(document).trigger(
										"handleClientChangeInQuickFilter",
										false);
							},
							'change' : function(combo, record) {
								if (Ext.isEmpty(combo.getValue())) {
									selectedFilterClientDesc = "";
									selectedFilterClient = "";
									$(document).trigger(
											"handleClientChangeInQuickFilter",
											false);
								}
							}
						}
					}]
		});
		
		/*var clientComboContainer=Ext.create('Ext.container.Container',{
			flex : 0.8,
			layout : 'vbox',
			hidden : userType == 0 ? true : false,
			itemId : 'filterClientMenuContainer',
			items : [{
						xtype : 'label',
						text : getLabel("Client", "Company Name"),
						margin : '0 0 0 6'
					},{
						xtype : 'combo',
						padding:'0 0 0 6',
						valueField : 'CODE',
						displayField : 'DESCR',
						queryMode : 'local',
						editable : false,
						itemId:'clientCombo',
						triggerAction : 'all',
						triggerBaseCls : 'xn-form-trigger',
						store : clientStore,
						listeners:{
						'select':function(combo,record){
							var code=combo.getValue();
							me.clientCode=code;
							me.fireEvent("handleClientChange",code,combo.getRawValue(),'');
						}
					}
					}]	
		});
		
		var clientAutoCompleterContainer=Ext.create('Ext.container.Container',{
			flex : 0.8,
			layout : 'vbox',
			itemId : 'filterClientAutoCmplterCnt',
			hidden :  userType == 1 ? true : false,
			items : [{
				xtype : 'label',
				text : getLabel("Client", "Company Name"),
				margin : '0 0 0 6'
				},{
				xtype : 'AutoCompleter',
				padding:'0 0 0 6',
				cfgTplCls : 'xn-autocompleter-t7',
				fieldCls : 'xn-form-text xn-suggestion-box',
				name : 'clientCode',
				itemId : 'clientCodesFltId',
				cfgUrl : 'services/userseek/userclients.json',
				cfgQueryParamName : '$autofilter',
				cfgRecordCount : -1,
				cfgSeekId : 'avmSvmAdminClientList',
				cfgRootNode : 'd.preferences',
				cfgDataNode1 : 'DESCR',
				enableQueryParam:false,
				cfgKeyNode : 'CODE',
				cfgProxyMethodType : 'POST',
					listeners : {
						'select' : function(combo, record) {
							strClient = combo.getValue();
							strClientDesc = combo.getRawValue();
							pmtSummaryView.fireEvent('handleClientChange', strClient,
									strClientDesc);
						},
						'change' : function(combo, newValue, oldValue, eOpts) {	
							if (Ext.isEmpty(newValue)) {					
								pmtSummaryView.fireEvent('handleClientChange', '', '');
							}
						},
						'render':function(combo,newValue,oldValue,eOpts){
							combo.listConfig.width = 200;
						}
					}
				}]	
		}); */
		
		var matrixTypeContainer = Ext.create('Ext.container.Container', {
			flex : 0.8,
			padding: '0 30 0 0',
			layout : 'vbox',
			items : [{
				xtype : 'label',
				text : getLabel('matrixType', 'Matrix Type')
			}, {
				xtype : 'combo',
				itemId : 'matrixTypeToolBar',
				queryMode : 'local',
				filterParamName : 'matrixType',
				valueField : 'code',
				editable : false,
				width : 228,
				displayField : 'text',
				triggerBaseCls : 'xn-form-trigger',
				parent : this,
				store:me.matrixTypeStore(),
				listeners : {
					select : function(combo, opts) {
						 this.parent.fireEvent('handleMatrixType',combo);
					},
					render:function(combo,opts){
						//this.setValue("all");					
					}
				}
			}]
		});
		
		if (userType == 0) {
			matrixNameUrl = 'services/authMatrixSeek/adminMatrixNameList.json';
		}
		else{
			matrixNameUrl = 'services/authMatrixSeek/clientMatrixNameList.json';
		}
		
		var matrixNameContainer = Ext.create('Ext.container.Container', {
			flex : 0.8,
			padding: '0 30 0 0',
			layout : 'vbox',
			items : [{
				xtype : 'label',
				text : getLabel('matrixName', 'Matrix Name')
			}, {
				xtype : 'AutoCompleter',
				cfgTplCls : 'xn-autocompleter-t7',
				fieldCls : 'xn-form-text  xn-suggestion-box',
				name : 'matrixName',
				matchFieldWidth : true,
				itemId : 'matrixNameFltId',
				enableQueryParam:false,
				cfgUrl : matrixNameUrl,
				cfgQueryParamName : 'qfilter',
				cfgRecordCount : -1,
				cfgSeekId : 'matrixNameList',
				cfgKeyNode : 'name',
				emptyText:getLabel('SearchMatrixName','Enter Keyword or %'),
				cfgRootNode : 'filterList',
				cfgDataNode1 : 'name',
				cfgProxyMethodType : 'POST'
			}]
		});
		
		var statusContainer = Ext.create('Ext.container.Container', {
			flex : 0.8,
			//padding: '0 30 0 0',
			layout : 'vbox',
			items : [{
				xtype : 'label',
				text : getLabel('status', 'Status')
			},Ext.create('Ext.ux.gcp.CheckCombo', {
				valueField : 'code',
				displayField : 'desc',
				editable : false,
				addAllSelector : true,
				emptyText : 'All',
				multiSelect : true,
				width : 240,
				//padding : '-4 0 0 0',
				itemId : 'matrixStatusFilter',
				isQuickStatusFieldChange : false,
				store : me.getStatusStore(),
				listeners : {
					'focus' : function() {
					}
				}
			})]
		});
		/*var corpContainer =  Ext.create('Ext.container.Container', {
			layout : 'vbox',
			flex : 0.8,
			padding: '0 100 0 0',
			hidden : storeLength > 1 ? false : true,
			items : [{
				xtype : 'label',
				text : getLabel('company', 'Company Name')
			}, {
				xtype : 'combo',
				displayField : 'DESCR',
				valueField : 'CODE',
				queryMode : 'local',
				editable : false,
				triggerAction : 'all',
				width : 228,
				itemId : 'clientComboItem',
				mode : 'local',
				emptyText : getLabel('selectCompany', 'Select Company Name'),
				store : corporationStore,
				listeners : {
					'select' : function(combo, record) {
						 //this.parent.fireEvent('handleClientChangeFilter',combo);
						 me.fireEvent("handleClientChangeFilter", combo );
					},
					boxready : function(combo, width, height, eOpts) {
						combo.setValue(combo.getStore().getAt(0));
					}					
				}
			}]
		});*/
			
		var midContainer =  Ext.create('Ext.container.Container', {
			flex : 0.8,
			layout : 'hbox',
			items : [matrixTypeContainer, matrixNameContainer,statusContainer]
			
		});
		if(isClientUser())
			filterContainerArr.push(clientComboContainer);
		else
			filterContainerArr.push(clientAutoContainer);
		filterContainerArr.push(midContainer);
		this.items=filterContainerArr
		this.callParent(arguments);

	},
	matrixTypeStore:function(){
	 var dataArray=[{
		 text : getLabel('all', 'All'),
		 code : 'all',
		 btnDesc : getLabel('all', 'All'),
		 btnId : 'allPaymentType'
	 },{
	 	text : getLabel('authorization', 'Approval'),
		code : '0',
		btnDesc : getLabel('authorization', 'Approval'),
		btnId : 'authorizationMatrixType'
	 },{
	 	text : getLabel('signatory', 'Signatory'),
		code : '1',
		btnDesc : getLabel('signatory', 'Signatory'),
		btnId : 'signatoryMatrixType'
	 }]
	 var objStore = Ext.create('Ext.data.Store', {
					fields : ["text", "code"],
					autoLoad:true,
					data:dataArray
				});
	return 	objStore;		
	},
	getStatusStore : function(){
		var objStatusStore = null;
		if (!Ext.isEmpty(arrStatus)) {
			objStatusStore = Ext.create('Ext.data.Store', {
						fields : ['code','desc'],
						data : arrStatus,
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