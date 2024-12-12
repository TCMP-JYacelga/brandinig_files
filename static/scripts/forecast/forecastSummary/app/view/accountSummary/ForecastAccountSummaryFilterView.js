Ext.define("GCP.view.accountSummary.ForecastAccountSummaryFilterView", {
	extend : 'Ext.panel.Panel',
	requires : ['Ext.ux.gcp.AutoCompleter'],
	xtype : 'forecastAccountSummaryFilterView',	
	layout : 'vbox',
	initComponent : function() {
		var me = this, strUrl = '';
		var valfiltercode = null;
		
		if(!isClientUser())
		{
			valfiltercode = '\'\'';
		}
		else
		{
			valfiltercode = '%';
		}

		var clientStore = Ext.create('Ext.data.Store', {
					fields : ['CODE', 'DESCR']
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
											'CODE' : 'all',
											'DESCR' : 'All Companies'
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

		me.items = [{
			xtype : 'container',
			itemId : 'parentContainer',
			width : '100%',
			layout : 'hbox',
			items : [{
				xtype : 'container',
				layout : 'vbox',
				hidden : ((clientStore.getCount() < 2) || !isClientUser())
						? true
						: false,// If count is one or admin then hide
				width : '25%',
				padding : '0 30 0 0',
				items : [{
							xtype : 'label',
							itemId : 'lblcompanyname',
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
							emptyText : getLabel('selectCompany',
									'Select Company Name'),
							store : clientStore
						}]
			}, {
				xtype : 'container',
				layout : 'vbox',
				hidden : (isClientUser()) ? true : false,// If client user then hide
				width : '25%',
				padding : '0 30 0 0',
				items : [{
							xtype : 'label',
							itemId : 'lblcompanyname',
							text : getLabel('lblcompanyname', 'Company Name')
						}, {
							xtype : 'AutoCompleter',
							width : '100%',
							matchFieldWidth : true,
							name : 'clientAuto',
							itemId : 'clientAuto',
							cfgUrl : "services/userseek/userclients.json",
							padding : '-4 0 0 0',
							cfgQueryParamName : '$autofilter',
							cfgRecordCount : -1,
							cfgSeekId : 'userclients',
							cfgKeyNode : 'CODE',
							cfgRootNode : 'd.preferences',
							cfgDataNode1 : 'DESCR',
							emptyText : getLabel('autoCompleterEmptyText',
												'Enter Keyword or %'),
							enableQueryParam : false,
							cfgProxyMethodType : 'POST'
						}]
			}, {
				xtype : 'container',
				itemId : 'filterParentContainer',
				width : '25%',
				layout : 'hbox',
				hidden : isHidden('AdvanceFilter'),
				items : [{
					xtype : 'container',
					itemId : 'savedFiltersContainer',
					layout : 'vbox',
					width : '100%',
					padding : '0 30 0 0',
					hidden : isHidden('AdvanceFilter'),
					items : [{
								xtype : 'label',
								itemId : 'savedFiltersLabel',
								text : getLabel('savedFilters', 'Saved Filters')
							}, {
								xtype : 'combo',
								valueField : 'filterName',
								displayField : 'filterName',
								queryMode : 'local',
								editable : false,
								triggerAction : 'all',
								width : '100%',
								padding : '-4 0 0 0',
								itemId : 'savedFiltersCombo',
								mode : 'local',
								emptyText : getLabel('selectfilter',
										'Select Filter'),
								store : me.savedFilterStore(),
								/* forceSelection
								 :(((me.savedFilterStore()).getCount() < 1) )
								? true : false,*/
								listeners : {
								'select' : function(combo, record) {
									me.fireEvent("handleSavedFilterItemClick",
											combo.getValue(), combo
												.getRawValue());
									//console.log("fireEvent...");
													
								}
							}
							}]
				}]
			}, {
				xtype : 'container',
				itemId : 'accNmbrContainer',
				width : '25%',
				layout : 'hbox',
				items : [{
					xtype : 'container',
					itemId : 'accountContainer',
					layout : 'vbox',
					width : '100%',
					padding : '0 30 0 0',
					items : [{
								xtype : 'label',
								itemId : 'accountNoLabel',
								text : getLabel('accountNmbr', 'Account Number')
							}, {
								xtype : 'AutoCompleter',
								name : 'accNmbrAuto',
								itemId : 'accNmbrAuto',
								cfgUrl : 'services/userseek/forecastAccountsSeek.json',
								cfgQueryParamName : '$autofilter',
								cfgRecordCount : -1,
								cfgSeekId : 'forecastAccountsSeek',
								cfgKeyNode : 'ACCT_NMBR',
								width : '100%',
								padding : '-4 0 0 0',
								matchFieldWidth : true,
								emptyText : getLabel('autoCompleterEmptyText',
												'Enter Keyword or %'),
								cfgRootNode : 'd.preferences',
								cfgDataNode1 : 'DISPLAYFIELD',
								cfgProxyMethodType : 'POST',
								cfgExtraParams : [{
											key : '$filtercode1',
											value : valfiltercode
										}]
							}]
				}]
			}]
		}];
		this.callParent(arguments);
	},

	savedFilterStore : function() {
		var myStore = new Ext.data.ArrayStore({
			autoLoad : true,
			fields : ['filterName'],
			proxy : {
				type : 'ajax',
				url : Ext.String
						.format('services/userfilterslist/forecastAccountSummary.json'),
				reader : {
					type : 'json',
					root : 'd.filters'
				}
			},
			listeners : {
				load : function(store, records, success, opts) {
					store.each(function(record) {
								record.set('filterName', record.raw);
							});
				}
			}
		})
		return myStore;
	}
});