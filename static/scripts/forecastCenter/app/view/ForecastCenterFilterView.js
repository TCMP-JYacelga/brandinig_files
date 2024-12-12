Ext.define("GCP.view.ForecastCenterFilterView",{
	extend:'Ext.panel.Panel',
	requires : ['Ext.ux.gcp.AutoCompleter'],
	xtype : 'forecastCenterFilterView',
	layout:'vbox',
	initComponent : function() {
		var me=this, strUrl='';
		
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
			hidden : ((clientStore.getCount() < 2) || !isClientUser()) ? true : false,//If count is one or admin then hide
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
						emptyText : getLabel('allCompaniess', 'All Companies'),
						store : clientStore
					}]
		},{
			xtype : 'container',
			layout : 'vbox',
			hidden : (isClientUser()) ? true : false,//If not admin then hide
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
							name : 'clientCombo',
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
							enableQueryParam:false,
							cfgProxyMethodType : 'POST'
						}]
		}]}, {
			xtype : 'container',
			itemId : 'filterParentContainer',
			width : '100%',
			layout : 'hbox',
			items : [{
				xtype : 'container',
				itemId : 'savedFiltersContainer',
				layout : 'vbox',
				width : '25%',
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
							//forceSelection :(((me.savedFilterStore()).getCount() < 1) ) ? true : false,
							listeners : {
								'select' : function(combo, record) {
									me.fireEvent("handleSavedFilterItemClick",
											combo.getValue(), combo
													.getRawValue());
								}
							}
						}]
			},{
			xtype : 'container',
			itemId : 'accountContainer',
			layout : 'vbox',
			width : '25%',
			padding : '0 30 0 0',
			items : [{
						xtype : 'label',
						text : getLabel('lblAccount', 'Account Number')
					}, 
					{
						xtype : 'combo',
						displayField : 'DISPLAYFIELD',
						valueField : 'CODE',
						queryMode : 'local',
						editable : false,
						triggerAction : 'all',
						width : '100%',
						padding : '-4 0 0 0',
						itemId : 'accountCombo',
						mode : 'local',
						emptyText : getLabel('selectAccountNo', 'Select Account Number'),
						store : me.getAccountStore()
					}]
		},{
				xtype : 'container',
				itemId : 'effectiveDateContainer',
				layout : 'vbox',
				width : '50%',
				padding : '0 30 0 0',
				items : [{
					xtype : 'panel',
					itemId : 'effectiveDatePanel',
					height : 23,
					flex : 1,
					layout : 'hbox',
					items : [{
								xtype : 'label',
								itemId : 'effectiveDateLabel',
								text : getLabel('date', 'Effective Date')
							}, {
								xtype : 'button',
								border : 0,
								filterParamName : 'EffectiveDate',
								itemId : 'effectiveDateBtn',
								cls : 'ui-caret-dropdown',
								listeners : {
									click : function(event) {
										var menus = getDateDropDownItems(
												"effectiveDateQuickFilter", this);
										var xy = event.getXY();
										menus.showAt(xy[0], xy[1] + 16);
										event.menu = menus;
										// event.removeCls('ui-caret-dropdown'),
										// event.addCls('action-down-hover');
									}
								}
							}]
				}, {
					xtype : 'container',
					itemId : 'effectiveDateToContainer',
					layout : 'hbox',
					width : '50%',
					items : [{
						xtype : 'component',
						width : '82%',
						itemId : 'effectiveDatePicker',
						filterParamName : 'EntryDate',
						html : '<input type="text" readonly="readonly"  id="effectiveDatePicker" class="ft-datepicker from-date-range ui-datepicker-range-alignment">'
					}, {
						xtype : 'component',
						cls : 'icon-calendar',
						margin : '1 0 0 0',
						html : '<span class=""><i class="fa fa-calendar"></i></span>'
					}]
				}]
			}]
		}];
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
	},

	getAccountStore : function(){
		var accountData=null;
		var objClientStore=null;
		Ext.Ajax.request({
			url : 'services/userseek/forecastAccountsSeek.json?&$sellerCode='+ strSeller + '&$filtercode1='+selectedClient,
			async : false,
			method : "GET",
			success : function(response) {
				if (!Ext.isEmpty(response.responseText)) {
					var data = Ext.decode(response.responseText);
					if (data && data.d) {
						accountData = data.d.preferences;
						objAccountStore = Ext.create('Ext.data.Store', {
									fields : ['CODE','DESCR','DISPLAYFIELD'],
									data : accountData,
									reader : {
										type : 'json',
										root : 'd.preferences'
									},
									autoLoad : true,
									listeners : {
										load : function() {
											//this.insert(0, {
											//			CODE : 'all',
											//			DESCR : getLabel('allAccounts', 'All')
											//		});
										}
									}
								});
						objAccountStore.load();
					}
				}
			},
			failure : function(response) {
				// console.log('Error Occured');
			}
		});
		return objAccountStore;
	},
		savedFilterStore : function() {
		var myStore = new Ext.data.ArrayStore({
					autoLoad : true,
					fields : ['filterName'],
					proxy : {
						type : 'ajax',
						url : Ext.String.format('services/userfilterslist/forecastCenter.json'),
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