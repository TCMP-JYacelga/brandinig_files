Ext.define('GCP.view.InterfaceMapSummaryFilterView',
{
	extend : 'Ext.panel.Panel',
	xtype : 'interfaceMapSummaryFilterView',
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
	});	var objStore = Ext.create('Ext.data.Store', {
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
							itemId : 'filterSellerCnt',
							flex:1,
							//hidden :  entityType == 1 ? true : false,
						 	hidden : multipleSellersAvailable == true ? false : true,  
							items:[
							       {
									xtype : 'label',
									text : getLabel("FI", "Financial Institution")
							 
							       
							       },

                                  {
									xtype : 'combo',
									displayField : 'DESCR',
									width:'70%',
									fieldCls : 'xn-form-field inline_block',
									triggerBaseCls : 'xn-form-trigger',
									filterParamName : 'sellerId',
									itemId : 'sellerFltId',
									valueField : 'CODE',
									value: strSeller,
									name : 'sellerCombo',
									editable : false,
									store : objStore,
									listeners : {
									     select: function(g, d) {
				                         strSeller = g.getValue();
				                         setAdminSeller(strSeller);
										 interfaceSummary.seller = strSeller;
				                         var e = interfaceSummary.down('combobox[itemId="clientCodeId"]');
				                        e.setValue("");
				                        e.setRawValue("");
				                        e.cfgExtraParams = [{
				                            key: "$sellerCode",
				                            value: strSeller
				                        }];
				                        interfaceSummary.fireEvent("refreshGroupByTabs", strSeller)
				                    },
				                    change: function() {
				                        console.log("changed")
				                     }
									}
								  }
							  ]
						},
						{
							xtype : 'container',
							itemId : 'filterClientAutoCmplterCnt',
							flex : 1,
							hidden :  entityType == 1 ? true : false, 
							layout : 'hbox',
							items : [{
										xtype : 'container',
										layout : 'vbox',
										hidden :  entityType == 1 ? true : false,     
										items:[{
												xtype : 'label',
												text : getLabel("client", "Company Name")
										  },{
												xtype : 'AutoCompleter',
												name : 'clientCode',
												width: 140,
												cfgTplCls : 'xn-autocompleter-t7',
												itemId : 'clientCodeId',
												cfgUrl : 'services/userseek/bankUserClientSeek.json',
												cfgQueryParamName : '$autofilter',
												cfgStoreFields:['SELLER_CODE','CODE','DESCR'],
												cfgRecordCount : -1,
												cfgSeekId : 'clientCodeSeek',
												matchFieldWidth: true,
												cfgRootNode : 'd.preferences',
												cfgDataNode1 : 'DESCR',
												cfgKeyNode : 'CODE',
												cfgProxyMethodType : 'POST',
												enableQueryParam:false,
												listeners : {
													'render' : function(combo) {
														if(!Ext.isEmpty(strPreClientCode) && !Ext.isEmpty(strPrefClientDesc))
														combo.store.loadRawData({
																	"d" : {
																		"preferences" : [{
																					"CODE" : strPreClientCode,
																					"DESCR" : strPrefClientDesc
																				}]
																	}
																});
														combo.listConfig.width = 200;
														combo.suspendEvents();
														combo.setValue(strPreClientCode);
														combo.resumeEvents();
													},
													'select' : function(combo, record) {
														var clientCode = combo.getValue();
														var clientDesc = combo.getRawValue();
														interfaceSummary.fireEvent('filterClient',clientCode, clientDesc);
													},
													'change' : function(combo, newValue, oldValue, eOpts) {	
														if (Ext.isEmpty(newValue)) {					
															interfaceSummary.fireEvent('filterClient',null, null);
														}
													}
												 }
											}]
									}
									]
						},
						
						{
							xtype : 'container',
							itemId : 'filterIntCodeAutoCmplterCnt',
							flex : 1,
							layout : 'hbox',
							items : [{
										xtype : 'container',
										layout : 'vbox',   
										items:[{
												xtype : 'label',
												text : getLabel("interfaceName", "Interface Code")
										  },{
												xtype : 'AutoCompleter',
												name : 'interfaceCode',
												width: 140,
												cfgTplCls : 'xn-autocompleter-t7',
												itemId : 'interfaceCodeId',
												cfgUrl : 'services/userseek/bankIntCodeSeek.json',
												cfgQueryParamName : '$autofilter',
												cfgStoreFields:['SELLER_CODE','CODE','DESCR'],
												cfgRecordCount : -1,
												cfgSeekId : 'interfaceCodeSeek',
												matchFieldWidth: true,
												cfgRootNode : 'd.preferences',
												cfgDataNode1 : 'DESCR',
												cfgKeyNode : 'CODE',
												cfgProxyMethodType : 'POST',
												enableQueryParam:false,
												listeners : {
													'select' : function(combo, record) {
														interfaceSummary.fireEvent('filterInterface',combo);
													},
													'change' : function(combo, newValue, oldValue, eOpts) {	
														if (Ext.isEmpty(newValue)) {					
															interfaceSummary.fireEvent('filterInterface',null, null);
														}
													}
												 }
											}]
									}
									]
						},
						
						{
							xtype : 'container',
							flex : 1,
							layout : 'vbox',
							items : [{
										xtype : 'label',
										text : getLabel("type", "Interface Type")
									},
									{
										xtype:'combo',
										itemId : 'interfaceTypeToolBar',
										filterParamName : 'interfaceType',
										displayField : 'text',
										emptyText:'Select',
										parent:this,
										triggerBaseCls : 'xn-form-trigger',
										valueField:'code',
										editable:false,
										store:me.interfaceTypeStore(),
										listeners:{
											select:function(combo){
												this.parent.fireEvent('filterType',combo);
											}
										}
									}]
					    },{
							xtype : 'container',
							layout : 'vbox',
							flex : 1,
							items : [
									{
										xtype : 'label',
										text : getLabel("category", "Interface Category")
									},
									{
										xtype : 'combo',
										itemId : 'flavorTypeToolBar',
										filterParamName : 'flavorType',
										triggerBaseCls : 'xn-form-trigger',
										editable:false,
										emptyText:'Select',
										displayField:'text',
										parent:this,
										valueField:'code',
										store:me.flavorTypeComboStore(),
										listeners:{
											select:function(combo){
												this.parent.fireEvent('filterFlavorType',combo);
											}
										}
									} ]
						},{
							xtype : 'container',
							layout : 'vbox',
							flex : 1,
							items : [{
								xtype : 'panel',
								layout : 'hbox',
								items : [{
											xtype : 'label',
											text : getLabel('status','Status')
										}, {
											xtype : 'button',
											filterParamName : 'taskStatus',
											itemId : 'taskStatusItemId',// Required
											cls : 'ui-caret',
											listeners : {
												click:function(event){
														var menus=me.addTaskStatusDropDownItems(this);
														var xy=event.getXY();
														menus.showAt(xy[0],xy[1]+16);
														event.menu=menus;
												}
											}
										}]
						 },{
							xtype : 'panel',
							layout : 'hbox',
							items : [{
										xtype : 'toolbar',
										itemId : 'statusToolBar',
										width : '100%',
										items : [ {
											xtype : 'label',
											itemId : 'strStatusValue',
											text : getLabel('all','All')
										}]
									}]
						}]
					} ]

		this.callParent(arguments);
	},
	interfaceTypeStore:function(){
		var dataArray=[{
				text : getLabel('all','All'),
				code : 'All'
			},{
				text : getLabel('uploads','Uploads'),
				code : 'U'
			},{
				text : getLabel('downloads','Downloads'),
				code : 'D'
			}];
			var objStore = Ext.create('Ext.data.Store', {
						fields : ["text", "code"],
						autoLoad:true,
						data:dataArray
					});
		return 	objStore;
	},
	flavorTypeComboStore:function(){
		var dataArray=[{
				text : getLabel('all','All'),
				code : 'All'
			},{
				text : getLabel('standard','Standard'),
				code : 'Standard'
			},{
				text : getLabel('custom','Custom'),
				code : 'Custom'
			}];
			var objStore = Ext.create('Ext.data.Store', {
						fields : ["text", "code"],
						autoLoad:true,
						data:dataArray
					});
		return 	objStore;
	},
   addTaskStatusDropDownItems:function(buttonIns){
		var dropdownMenu = Ext.create('Ext.menu.Menu', {
			cls : 'ext-dropdown-menu',
			listeners : {
				hide:function(event) {
					buttonIns.addCls('ui-caret-dropdown');
					buttonIns.removeCls('action-down-hover');
				}
			},	
			items : [{
						text : getLabel('all','All'),
						btnId : 'btnAll',
						btnValue : 'All',
						parent : this,
						handler : function(btn,opts) {
							this.parent.fireEvent('filterStatusType',btn,opts);
						}
					},
					{
						text : getLabel('newStatus','New'),
						btnId : 'btnNew',
						btnValue : '0',
						parent : this,
						handler : function(btn,opts) {
							this.parent.fireEvent('filterStatusType',btn,opts);
						}
					},
					{
						text : getLabel('submittedStatus','New Submitted'),
						btnId : 'btnSubmitted',
						btnValue : '12',
						parent : this,
						handler : function(btn,opts) {
							this.parent.fireEvent('filterStatusType',btn,opts);
						}
					},
					{
						text : getLabel('modifiedStatus','Modified'),
						btnId : 'btnModified',
						btnValue : '1',
						parent : this,
						handler : function(btn,opts) {
							this.parent.fireEvent('filterStatusType',btn,opts);
						}
					},
					{
						text : getLabel('modifiedSubmittedStatus','Modified Submitted'),
						btnId : 'btnModifiedSubmitted',
						btnValue : '14',
						parent : this,
						handler : function(btn,opts) {
							this.parent.fireEvent('filterStatusType',btn,opts);
						}
					},
					{
						text : getLabel('deleteStatus','Delete Request'),
						btnId : 'btnDeleteRequest',
						btnValue : '2',
						parent : this,
						handler : function(btn,opts) {
							this.parent.fireEvent('filterStatusType',btn,opts);
						}
					},
					{
						text : getLabel('authorizedStatus','Approved'),
						btnId : 'btnAuthorized',
						parent : this,
						btnValue : '3',
						handler : function(btn,opts) {
							this.parent.fireEvent('filterStatusType',btn,opts);
						}
					},
					{
						text : getLabel('enableStatus','Enable Request'),
						btnId : 'btnEnableRequest',
						parent : this,
						btnValue : '4',
						handler : function(btn,opts) {
							this.parent.fireEvent('filterStatusType',btn,opts);
						}
					},
					{
						text : getLabel(
								'disableStatus',
								'Disable Request'),
						btnId : 'btnDisableRequest',
						parent : this,
						btnValue : '5',
						handler : function(btn,opts) {
							this.parent.fireEvent('filterStatusType',btn,opts);
						}
					},
					{
						text : getLabel('disabledStatus','Disabled'),
						btnId : 'btnDisabled',
						parent : this,
						btnValue : '11',
						handler : function(btn,opts) {
							this.parent.fireEvent('filterStatusType',btn,opts);
						}
					},
					{
						text : getLabel(
								'rejectedStatus',
								'Rejected'),
						btnId : 'btnRejected',
						parent : this,
						btnValue : '7',
						handler : function(btn,opts) {
							this.parent.fireEvent('filterStatusType',btn,opts);
						}
					},
					{
						text : getLabel('modifiedRejectStatus', 'Modified Request Rejected'),
						btnId : 'btnModifiedRejected',
						parent : this,
						btnValue : '8',
						handler : function(btn,opts) {
							this.parent.fireEvent('filterStatusType',btn,opts);
						}
					},
					{
						text : getLabel('disableRequestStatus', 'Disable Request Rejected'),
						btnId : 'btnDisableRejected',
						parent : this,
						btnValue : '9',
						handler : function(btn,opts) {
							this.parent.fireEvent('filterStatusType',btn,opts);
						}
					},
					{
						text : getLabel('enableRequestStatus', 'Enable Request Rejected'),
						btnId : 'btnEnableRejected',
						parent : this,
						btnValue : '10',
						handler : function(btn,opts) {
							this.parent.fireEvent('filterStatusType',btn,opts);
						}
					}	,
					{
						text : getLabel('pendingMyApproval', 'Pending My Approval'),
						btnId : 'btnPendingApproval',
						parent : this,
						btnValue : '13',
						handler : function(btn,opts) {
							this.parent.fireEvent('filterStatusType',btn,opts);
						}	
					}	
					]
		});
		return dropdownMenu;
	},
	populateSellerMenu : function(data) {
		var me = this;
		
		var sellerContainer=me.down('container[itemId="filterSellerCnt"]');
		var sellerDrop = me.down('combobox[itemId="interfaceSellerId"]');
		var clientAutoCompleter = me
				.down('combobox[itemId="clientCodeId"]');
		var sellerArray = data || [];

		var objStore = Ext.create('Ext.data.Store', {
			fields : [ 'sellerCode', 'description' ],
			data : data,
			reader : {
				type : 'json'
			}
		});
		sellerDrop.store = objStore;
		if (objStore.getCount() == 1) {
			sellerContainer.hide();     
		}
		sellerDrop.setValue(strSeller);
		clientAutoCompleter.cfgExtraParams = [ {
			key : '$sellerCode',
			value : sellerDrop.getValue()
		}];
	},
	addDataToClientCombo:function(data){
		var me=this;
		var clientMenu=[];
		clientMenu.push({
			text : getLabel('all','All'),
			CODE : '',
			DESCR : getLabel('allCompanies','All Companies')
		});
		var clientCombobox=me.down('combo[itemId="clientCombo"]');
		var filterClientMenuContainer = me.down('container[itemId="filterClientAutoCmplterCnt"]');
		var filterClientMenuContainer = me.down('container[itemId="filterIntCodeAutoCmplterCnt"]');
		var clientArray = data.d.preferences || [];

		Ext.each(clientArray, function(client) {
					clientMenu.push({
								text : client.DESCR,
								CODE : client.CODE,
								DESCR : client.DESCR
					});		
		if (null != clientArray && clientArray.length <= 1) {
			filterClientMenuContainer.hide();        
		}else{
			clientCombobox.getStore().loadData(clientMenu);
			clientCombobox.setValue('');
		}
	  });
	}
	
	});