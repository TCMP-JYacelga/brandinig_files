Ext.define("GCP.view.ForecastPackageFilterView", {
	extend:'Ext.panel.Panel',
	xtype : 'forecastPackageFilterView',
	requires : ['Ext.ux.gcp.AutoCompleter','Ext.ux.gcp.CheckCombo'],
	layout : {
		type : 'vbox'
	},
	initComponent : function() {
		var me = this;
		var strUrl = null;
		var companyStore = Ext.create('Ext.data.Store', {
			fields : ['CODE', 'DESCR']
		});
		var isRecurringStore = null;
			isRecurringStore = Ext.create('Ext.data.Store', {
				fields : ["name", "value"],
				data: [{"name":"All", "value": "ALL"},
			       {"name":getLabel('lblYes', 'Yes'), "value": "Y"},
			       {"name":getLabel('lblNo', 'No'), "value": "N"}],
				autoload:true
			});

		if(isClientUser()) {
			Ext.Ajax.request({
				url : 'services/userseek/foreCorpSeek.json',
				method : 'GET',
				async : false,
				success : function(response) {
					var responseData = Ext.decode(response.responseText);
					var data = responseData.d.preferences;
					if(companyStore) {
						companyStore.removeAll();
						var count = data.length;
						if (count > 1) {
							companyStore.add({
										'CODE' : 'all',
										'DESCR' : 'All Companies'
									});
						}
						for(var i=0; i<count; i++) {
							var record = {
								'CODE' : data[i].CODE,
								'DESCR' : data[i].DESCR
							}
							companyStore.add(record);
						}
					}
				},
				failure : function() {
					
				}
			});
		}
		me.items = [{
			xtype : 'container',
			itemId : 'companySlectorContainer',
			layout : 'vbox',
			flex : 1,
			hidden : (isClientUser() && companyStore.getCount() <= 1) ? true : false,
			width : '25%',
			padding : '0 30 0 0',
			items : [{
				xtype : 'label',
				text : getLabel('lblcompany', 'Company Name')
			}, {
				xtype : 'combo',
				hidden : !isClientUser(),
				displayField : 'DESCR',
				valueField : 'CODE',
				queryMode : 'local',
				editable : false,
				width : '100%',
				padding : '-4 0 0 0',
				itemId : 'clientCombo',
				emptyText : getLabel('selectCompany', 'Select Company Name'),
				store : companyStore,
				listeners : {
					select : function(combo, record, eOpts) {
						changeClientAndRefreshGrid(combo.getValue(), combo.getDisplayValue());
					}
				}
			}, {
				xtype : 'AutoCompleter',
				width : '100%',
				matchFieldWidth : true,
				hidden : isClientUser(),
				itemId : 'clientComboAuto',
				cfgUrl : "services/userseek/foreCorpSeek.json",
				padding : '-4 0 0 0',
				cfgRecordCount : -1,
				cfgSeekId : 'foreCorpSeek',
				cfgQueryParamName : '$autofilter',
				cfgKeyNode : 'CODE',
				cfgRootNode : 'd.preferences',
				cfgDataNode1 : 'DESCR',
				emptyText :  getLabel('autoCompleterEmptyText', 'Enter Keyword or %'),
				enableQueryParam : false,
				cfgProxyMethodType : 'POST'
			}]
		}, 
		
			{
			xtype : 'container',
			//itemId : 'filterParentContainer',
			width : '100%',
			layout : 'hbox',
			flex : 1,
			items : [{
				xtype : 'container',
				layout : 'vbox',
				width : '25%',
				padding : '0 30 0 0',
				items : [
				 {
					xtype : 'label',
					text : getLabel('cffPackage', 'Forecast Package')	
				}, {
					xtype : 'AutoCompleter',
					name : 'cffPackageAutocompleter',
					itemId : 'cffPackageAutocompleter',
					cfgUrl : 'services/userseek/forecastPackages.json',
					cfgQueryParamName : '$autofilter',
					cfgRecordCount : -1,
					cfgKeyNode : 'CODE',
					width : '100%',
					padding : '-4 0 0 0',
					matchFieldWidth : true,
					emptyText : getLabel('autoCompleterEmptyText', 'Enter Keyword or %'),
					cfgRootNode : 'd.preferences',
					cfgDataNode1 : 'DESCR',
					cfgProxyMethodType : 'POST'
				}]
			},{
			xtype : 'container',
			layout : 'vbox',
			width : '25%',
			padding : '0 30 0 0',
			items : [{
				xtype : 'label',
				text :getLabel('status', 'Status')	
				},
				Ext.create('Ext.ux.gcp.CheckCombo', {
								valueField : 'code',
								displayField : 'desc',
								editable : false,
								addAllSelector : true,
								emptyText : 'All',
								multiSelect : true,
								width : '100%',
								padding : '-4 0 0 0',
								itemId : 'statusFilter',
								isQuickStatusFieldChange : false,
								store : me.getStatusStore(),
								listeners : {
									'focus' : function() {
									}
								}
							})]
				},{
				xtype : 'container',
				layout : 'vbox',
				width : '25%',
				padding : '0 30 0 0',
				items : [{
					xtype : 'label',
					text :getLabel('recurring', 'Recurring')
					},
					{
					xtype : 'combo',
					displayField : 'name',
					valueField : 'value',
					queryMode : 'local',
					editable : false,
					triggerAction : 'all',
					width : '100%',
					padding : '-4 0 0 0',
					itemId : 'isRecurring',
					mode : 'local',
					emptyText : getLabel('all', 'All'),
					store : isRecurringStore
				}]
			}
			]
		}]
		this.callParent(arguments);
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