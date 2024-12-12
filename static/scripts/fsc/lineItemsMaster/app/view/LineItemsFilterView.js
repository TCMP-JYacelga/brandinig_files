Ext.define('GCP.view.LineItemsFilterView', {
	extend : 'Ext.panel.Panel',
	xtype : 'lineItemsFilterView',
	requires : ['Ext.ux.gcp.AutoCompleter'],
	layout : {
		type : 'hbox'
	},
	initComponent : function() {
		var me = this;
		pmtSummaryView = this;
		clientSetupSummaryView=this;
		var userClient = Ext.create('Ext.data.Store', {
			fields : ['CODE', 'DESCR']
		});
		Ext.Ajax.request({
					url : 'services/userseek/userclients.json',
					method : 'POST',
					async : false,
					success : function(response) {
						var responseData = Ext.decode(response.responseText);
						var data = responseData.d.preferences;
						if (userClient) {
							userClient.removeAll();
							var count = data.length;
							if (count > 1) {
								userClient.add({
											'CODE' : 'all',
											'DESCR' : 'All Companies'
										});
							}
							for (var index = 0; index < count; index++) {
								var record = {
									'CODE' : data[index].CODE,
									'DESCR' : data[index].DESCR
								}
								userClient.add(record);
							}
						}
					},
					failure : function() {
					}
				});
		var clientStore=Ext.create('Ext.data.Store', {
					fields : ['CODE','DESCR']
		 			});

		var filterContainerArr = new Array();
		this.items = [{
							xtype : 'container',
							layout : 'vbox',
							hidden : ((userClient.getCount() < 2) || !isClientUser()) ? true : false,//If count is one or admin then hide
							width : '25%',
							padding : '0 30 0 0',
							items : [{
										xtype : 'label',
										itemId : 'savedFiltersLabel',
										text : getLabel('companyname', 'Company Name')
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
										emptyText : getLabel('selectCompany',
												'Select Company Name'),
										store : userClient,
										listeners : {
											'select' : function(combo, record) {
												var val = combo.getValue(), descr = combo
														.getDisplayValue();
												if (val && descr) {
													changeClientAndRefreshGrid(val, descr);
												}
											},
											boxready : function(combo, width, height, eOpts) {
												//combo.setValue(combo.getStore().getAt(0));
											}
										}
									}]
						}, {
							xtype : 'container',
							layout : 'vbox',
							hidden : (isClientUser()) ? true : false,// If not admin then hide
							width : '25%',
							padding : '0 30 0 0',
							items : [{
										xtype : 'label',
										itemId : 'savedFiltersLabel',
										text : getLabel('companyname', 'Company Name')
									}, {
										xtype : 'AutoCompleter',
										width : '100%',
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
						},
						{
						xtype : 'container',
						itemId : 'filterParentContainer',
						layout : 'vbox',
						width : '25%',
						padding : '0 30 0 0',
						items : [{
										xtype : 'label',										
										text : getLabel('scfPackage', 'Package')
									},{
										xtype : 'AutoCompleter',
										width : '100%',
										matchFieldWidth : true,
										name : 'productCombo',
										itemId : 'productComboAuto',
										cfgUrl : "services/userseek/lineItemProductseek.json",
										padding : '-4 0 0 0',
										cfgQueryParamName : '$autofilter',
										cfgRecordCount : -1,
										cfgSeekId : 'lineItemProductseek',
										cfgKeyNode : 'CODE',
										cfgRootNode : 'd.preferences',
										cfgDataNode1 : 'DESCR',
										emptyText : getLabel('autoCompleterEmptyText', 'Enter Keyword or %'),
										enableQueryParam : false,
										cfgProxyMethodType : 'POST',
										listeners : {
											'select' : function(combo, record) {
												var val = combo.getValue(); 
												var descr = combo.getDisplayValue();
												if (val && descr) {
													scmProductName = descr;
													scmProductCode = val;
													$(document).trigger(
															"handleProductChangeInQuickFilter",
															false);
												}
											}
										}
									}]
								}]
		this.callParent(arguments);
	}
});   