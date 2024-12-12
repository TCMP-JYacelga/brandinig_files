Ext.define('GCP.view.ClientSetupFilterView', {
	extend : 'Ext.panel.Panel',
	xtype : 'clientSetupFilterView',
	requires : ['Ext.ux.gcp.AutoCompleter'],
	layout : 'vbox',
	initComponent : function() {
		var me = this;
		pmtSummaryView = this;
		clientSetupSummaryView=this;
		var clientStore=Ext.create('Ext.data.Store', {
					fields : ['CODE','DESCR']
						});
		var mandatePartyNameSeek = null;
		var mandateDebtorRefSeekUrl = null;
		var payerNameSeekUrl = null;
		var filterContainerArr = new Array();
		if (userType == 0) {
			mandatePartyNameSeek = 'services/mandateseek/adminMandateNameSeekList.json';
		}
		else{
			mandatePartyNameSeek = 'services/mandateseek/clientMandateNameSeekList.json';
		}
		if (userType == 0) {
			mandateDebtorRefSeekUrl = 'services/mandateseek/adminDebtRefNoList.json';
		}
		else{
			mandateDebtorRefSeekUrl = 'services/mandateseek/clientDebtRefNoList.json';
		}
		if (userType == 0) {
			payerNameSeekUrl = 'services/mandateseek/adminPayerNameSeekPayerMstList.json';
		}
		else{
			payerNameSeekUrl = 'services/mandateseek/clientPayerNameSeekPayerMstList.json';
		}
		var statusStore = Ext.create('Ext.data.Store', {
					fields : ["name", "value"],
					proxy : {
						type : 'ajax',
						autoLoad : true,
						url : 'services/mandateseek/mandateStatusList.json',
						actionMethods : {
							read : 'POST'
						},
						reader : {
							type : 'json',
							root : 'filterList'
						}
					}
				});
		
		var clientStore=Ext.create('Ext.data.Store', {
			fields : ['CODE','DESCR']
		});
		Ext.Ajax.request({
			url : 'services/userseek/userclients.json',
			method : 'POST',
			async : false,
			success: function(response){								
			if(response && clientStore){
				clientStore.removeAll(true,true);
				var responseData = Ext.decode(response.responseText),
					data = responseData.d.preferences,
					count = data.length;
				
				if(count > 1){
					clientStore.add({
						'CODE' : 'all',
						'DESCR' : getLabel('allcompanies','All Companies')
					});
					
					for(var i=0;i<count;i++){
						var obj = {
							'DESCR': data[i].DESCR,
							'CODE' : data[i].CODE
						};
						clientStore.add(obj);
					}
				}
				
			}
		},
			failure : function(){}
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

		this.items = [{
			xtype: 'container',
      	  	layout: 'hbox',
      	  	width: '100%',
      	  	items:[{
			xtype: 'container',
      	  	layout: 'vbox',
      	  	width: '25%',
      	  	padding: '0 30 0 0',
      	  	hidden: ((strEntityTYpe == '0') && strOnBehalf != 'true') ? false : true,//Only display for admin
      	  	items:[{
      	  		xtype: 'label',
      	  		text : getLabel('financialInstitution', 'Financial Institution')
  	        },{
  	        	xtype : 'combo',			            	        	 
				displayField : 'DESCR',
				valueField : 'CODE',
				editable : false,
				width : '100%',
				padding : '-4 0 0 0',
				itemId : 'sellerFltId',
				value :strSellerId,
				store : objStore,
				listeners : {
						'render' : function(combo, record) {
							combo.store.load();
						},
						'select' : function(combo, strNewValue, strOldValue) {
							setAdminSeller(combo.getValue());
						}
				},
				boxready : function(combo, width, height, eOpts) {
							combo.setValue(combo.getStore().getAt(0));
				}
			}
        ]},{
			xtype: 'container',
      	  	layout: 'vbox',
      	  	width: '25%',
      	  	//width: corp_cond ? '25%' : '0',
      	  	padding: '0 30 0 0',
      	  	hidden: ((clientStore.getCount() < 1) || !isClientUser()) ? true : false,//If count is one or admin then hide
      	  	items:[{
      	  		xtype: 'label',
      	  		text : getLabel('lblcompany', 'Company Name')
  	        },{
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
				emptyText : getLabel('selectCompany', 'Select Company Name'),
				store : clientStore,
				listeners : {
					'select' : function(combo, record) {
				 		selectedFilterClientDesc = combo.getRawValue();
        				selectedFilterClient = combo.getValue();
				 		$(document).trigger("handleClientChangeInQuickFilter", false);
				}
				
			}
        }]},{
        	xtype: 'container',
      	  	layout: 'vbox',
      	  	width: '25%',
      	  	//width: corp_cond ? '25%' : '0',
      	  	padding: '0 30 0 0',
      	  	hidden: (isClientUser()) ? true : false,// If not admin then hide
      	  	items:[{
      	  		xtype: 'label',
  	        	text : getLabel('lblcompany', 'Company Name')
  	        },{
  	        	xtype : 'AutoCompleter',
  	        	width : '100%',
  	        	matchFieldWidth : true,
  	        	name : 'clientCombo',			            	        		
  	        	itemId : 'clientComboAuto',
  	        	cfgUrl : "services/userseek/adminmandatecompany.json",
  	        	padding : '-4 0 0 0',
  	        	cfgQueryParamName : '$autofilter',
  	        	cfgRecordCount : -1,
  	        	cfgSeekId : 'userclients',
  	        	cfgKeyNode : 'CODE',
  	        	cfgRootNode : 'd.preferences',
  	        	cfgDataNode1 : 'DESCR',
  	        	emptyText : getLabel('autoCompleterEmptyText', 'Enter Keyword or %'),
  	        	enableQueryParam:false,
  	        	cfgProxyMethodType : 'POST',
  	        	listeners : {
  	        		'select' : function(combo, record) {
  	        			selectedFilterClientDesc = combo.getRawValue();
  	        			selectedFilterClient = combo.getValue();
  	        			$(document).trigger("handleClientChangeInQuickFilter",false);
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
  	        }}]}
        ]},{
        	xtype : 'container',
			itemId : 'filterParentContainer',
			width : '100%',
			layout : 'hbox',
			items : [{
				xtype : 'container',
				width: '25%',
				padding: '0 30 0 0',
				layout : 'vbox',
				items : [{
					xtype : 'label',
					text : getLabel('mandateName', 'Mandate Name'),
					cls : 'ux_font-size14  ux_normalpadding-bottom ux_largepadding-left'
				}, {
					xtype : 'AutoCompleter',
					cls : 'ux_normalmargin-top ux_largepadding-left',
					fieldCls : 'xn-form-text xn-suggestion-box',
					name : 'mandateName',
					itemId : 'mandateNameFltId',
					matchFieldWidth : true,
					cfgUrl : mandatePartyNameSeek,
					emptyText : getLabel('autoCompleterEmptyText', 'Enter Keyword or %'),
					cfgQueryParamName : 'qfilter',
					cfgRecordCount : -1,
					width: '100%',
					cfgSeekId : 'mandateNamesList',
					cfgKeyNode : 'name',
					cfgRootNode : 'filterList',
					cfgDataNode1 : 'name',
					enableQueryParam:false,
					cfgProxyMethodType : 'POST'
				}]},{
					xtype : 'container',
					 width: '25%',
					 padding: '0 30 0 0',
					layout : 'vbox',
					items : [{
					xtype : 'label',
					text : getLabel('debtRefNo', 'Mandate Debtor Reference'),
					cls : 'ux_font-size14  ux_normalpadding-bottom ux_largepadding-left'
				}, {
					xtype : 'AutoCompleter',
					cls : 'ux_normalmargin-top ux_largepadding-left',
					fieldCls : 'xn-form-text xn-suggestion-box',
					name : 'mandateDebtorRef',
					width: '100%',
					itemId : 'mandateDebtorRefFltId',
					emptyText : getLabel('autoCompleterEmptyText', 'Enter Keyword or %'),
					cfgUrl : mandateDebtorRefSeekUrl,
					matchFieldWidth : true,
					cfgQueryParamName : 'qfilter',
					cfgRecordCount : -1,
					cfgSeekId : 'mandateDebtorRefList',
					cfgKeyNode : 'name',
					cfgRootNode : 'filterList',
					cfgDataNode1 : 'name',
					enableQueryParam:false,
					cfgProxyMethodType : 'POST'
				}]
				},
				{
					xtype : 'container',
					width: '25%',
					 padding: '0 30 0 0',
					layout : 'vbox',
					items : [{
					xtype : 'label',
					text : getLabel('mandateStatus', 'Mandate Status'),
					cls : 'ux_font-size14  ux_normalpadding-bottom ux_largepadding-left'
				}, Ext.create('Ext.ux.gcp.CheckCombo', {
					name : 'mandateStatusDescription',
					itemId : 'mandateStatusDescriptionFltId',
					width: '100%',
					valueField : 'code',
					displayField : 'desc',
					editable : false,
					matchFieldWidth : true,
					addAllSelector : true,
					emptyText : 'All',
					multiSelect : true,
					//filterParamName : 'mandateStatusDescription',
					store : me.getStatusStore(),
					isQuickStatusFieldChange : false,
					listeners : {
						'focus' : function() {
						}
					}
				})]
				},{
					xtype : 'container',
					width: '25%',
					 padding: '0 30 0 0',
					layout : 'vbox',
					items : [{
					xtype : 'label',
					text : getLabel('payerName', 'Payer Name'),
					cls : 'ux_font-size14  ux_normalpadding-bottom ux_largepadding-left'
				}, {
					xtype : 'AutoCompleter',
					cls : 'ux_normalmargin-top ux_largepadding-left',
					fieldCls : 'xn-form-text xn-suggestion-box',
					name : 'payerName',
					width: '100%',
					itemId : 'payerNameFltId',
					matchFieldWidth : true,
					emptyText : getLabel('autoCompleterEmptyText', 'Enter Keyword or %'),
					cfgUrl : payerNameSeekUrl,
					cfgQueryParamName : 'qfilter',
					cfgRecordCount : -1,
					cfgSeekId : 'payerNameList',
					cfgKeyNode : 'name',
					cfgRootNode : 'filterList',
					cfgDataNode1 : 'name',
					enableQueryParam:false,
					cfgProxyMethodType : 'POST'
				}]
			}
			]},
			
			{
				xtype : 'container',
				width: '25%',
				 padding: '0 30 0 0',
				layout : 'vbox',
				items : [{
				xtype : 'label',
				text : getLabel('status', 'Status'),
				cls : 'ux_font-size14  ux_normalpadding-bottom ux_largepadding-left'
			}, Ext.create('Ext.ux.gcp.CheckCombo', {
				itemId : 'requestStatusFilter',
				name : 'statusCombo',
				width: '100%',
				valueField : 'name',
				displayField : 'value',
				editable : false,
				matchFieldWidth : true,
				addAllSelector : true,
				emptyText : 'All',
				multiSelect : true,
				store : me.getStatusFilterStore(),
				isQuickStatusFieldChange : false,
				listeners : {
					'focus' : function() {
					}
				}
			})]
			}]
		this.callParent(arguments);
	},
	getStatusStore : function(){
		var objStatusStore = null;
		if (!Ext.isEmpty(arrActionColumnStatus)) {
			objStatusStore = Ext.create('Ext.data.Store', {
						fields : ['code','desc'],
						data : arrActionColumnStatus,
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
	getStatusFilterStore : function(){
		var objStatusFilterStore = null;
		if (!Ext.isEmpty(arrStatusFilterLst)) {	
			objStatusFilterStore = Ext.create('Ext.data.Store', {
						fields : ['name','value'],
						data : arrStatusFilterLst,
						autoLoad : true,
						listeners : {
							load : function() {
							}
						}
					});
			objStatusFilterStore.load();
		}
		return objStatusFilterStore;
	}
});