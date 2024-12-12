Ext.define('GCP.view.PassThruFileACHFilterView', {
	extend : 'Ext.panel.Panel',
	requires : ['Ext.ux.gcp.AutoCompleter'],
	xtype : 'passThruFileACHFilterViewType',	
	width : '100%',
	layout : {
		type : 'vbox'
	},
	initComponent : function() {
		var me = this;
		this.items = [/*{
			xtype : 'container',
			itemId : 'clientContainer',
			hidden : client_count > 1 ? false : true,
			layout : 'vbox',
			width : '35%',
			padding : '0 30 0 0',
			items : [{
						xtype : 'label',
						text : getLabel('lblcompany', 'Company Name')
						//margin : '0 0 0 6'
					}, {
						xtype : 'combo',
						valueField : 'CODE',
						displayField : 'DESCR',
						queryMode : 'local',
						width : '70%',
						editable : false,
						triggerAction : 'all',
						itemId : 'quickFilterClientCombo',
						mode : 'local',
						padding : '-4 0 0 0',
						emptyText : getLabel('selectCompany', 'Select Company Name'),
						store : me.getClientStore(),
						 listeners : {
					 	'select' : function(combo, record) {
						selectedFilterClientDesc = combo.getRawValue();
						selectedFilterClient = combo.getValue();
						$(document).trigger("handleClientChangeInQuickFilter", false);
									},
									boxready : function(combo, width, height, eOpts) {
										if (Ext.isEmpty(combo.getValue())) {										
											combo.setValue(combo.getStore().getAt(0));
										}
									}
								 }
					}]
		},{
			xtype : 'container',
			layout : 'vbox',
			hidden : (isClientUser()) ? true : false,//If not admin then hide
			width : '25%',
			padding : '0 25 0 0',
			items : [{
						xtype : 'label',
						itemId : 'savedFiltersLabel',
						text : getLabel('lblcompany', 'Company Name')
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
							emptyText : getLabel('searchByCompany', 'Enter Keyword or %'),
							enableQueryParam:false,
							cfgProxyMethodType : 'POST',
							listeners : {
								'select' : function(combo, record) {
									selectedFilterClientDesc = combo.getRawValue();
									selectedFilterClient = combo.getValue();
									selectedClientDesc = combo.getRawValue();
									$(document).trigger("handleClientChangeInQuickFilter",
											false);
								},
								'change' : function(combo, record) {
									if(Ext.isEmpty(combo.getValue())){
									selectedFilterClientDesc = "";
									selectedFilterClient = "";
									selectedClientDesc = "";
									$(document).trigger("handleClientChangeInQuickFilter",
											false);
									}
								}
							}
						}]
		}*/,{
			xtype : 'container',
			itemId : 'filterParentContainer',
			width : '100%',
			layout : 'hbox',
			items : [ {
				xtype : 'container',
				itemId : 'savedFiltersContainer',
				layout : 'vbox',
				width : '30%',
				padding : '0 30 0 0',
				items : [{
						xtype : 'label',
						itemId : 'savedFiltersLabel',
						text : getLabel('savedFilter','Saved Filters')
					}, {
						xtype : 'combo',
						valueField : 'filterName',
						displayField : 'filterName',
						queryMode : 'local',
						width : '83%',
						padding : '-4 0 0 0',
						editable : false,
						triggerAction : 'all',
						itemId : 'savedFiltersCombo',
						mode : 'local',
						emptyText : getLabel('selectfilter', 'Select Filter'),
						store : me.savedFilterStore(),
						listeners : {
							'select' : function(combo, record) {
								me.fireEvent("handleSavedFilterItemClick",
										combo.getValue(), combo.getRawValue());
							}
						}
			}]
		},{
			xtype : 'container',
			itemId : 'importDateContainer',
			layout : 'vbox',
			cls : 'importDateContainer',
			flex : 1,
			items : [{
				xtype : 'panel',
				itemId : 'importDatePanel',
				layout : 'hbox',
				flex : 1,
				items : [{
							xtype : 'label',
							itemId : 'dateLabel',
							text : getLabel('importDate','Import Date')
							//padding : '0 0 12 6'
						}, {
							xtype : 'button',
							border : 0,
							filterParamName : 'importDateTime',
							itemId : 'importDateTime',
							cls : 'ui-caret',
							menu : getDateDropDownItems("importDateQuickFilter")
						}]
			}, /*{
				xtype : 'component',
				width : 200,
				itemId : 'fileServicesImportDatePicker',
				filterParamName : 'importDateTime',
			//	padding : '-4 0 0 0',
				html : '<input type="text" id="importDateQuickPicker" class="ft-datepicker ui-datepicker-range-alignment">'
			}*/
			{
					xtype : 'container',
					itemId : 'fileServicesImportDatePicker',
					layout : 'hbox',
					width : '35%',
					items : [{
						xtype : 'component',
						width : '85%',
						itemId : 'fileServicesImportDatePicker',
						filterParamName : 'importDateTime',
						html : '<input type="text"  id="importDateQuickPicker" class="ft-datepicker from-date-range ui-datepicker-range-alignment">'
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
	getClientStore : function() {
		var clientData = null;
		var objClientStore = null;
		var strUrl;
		if(entity_type == '1')
			strUrl = 'services/userseek/userclients.json&$sellerCode=' + strSellerId;
		else
			strUrl = 'services/userseek/userclients.json';
		
		Ext.Ajax.request({
			url : strUrl,
			async : false,
			method : "POST",
			success : function(response) {
				if (!Ext.isEmpty(response.responseText)) {
					var data = Ext.decode(response.responseText);
					if (data && data.d) {
						clientData = data.d.preferences;
						objClientStore = Ext.create('Ext.data.Store', {
									fields : ['CODE', 'DESCR'],
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
														DESCR : getLabel(
																'allCompanies',
																'All companies')
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
	},
	savedFilterStore : function() {	
		if(screenType == 'ACH')
			screenName = 'passThruFileACH';
		else
			screenName = 'passThruPositivePay';
		
		var strUrl = 'services/userfilterslist/{0}.json';
		strUrl = Ext.String.format( strUrl, screenName);
		var myStore = new Ext.data.ArrayStore({
					autoLoad : true,
					fields : ['filterName'],
					proxy : {
						type : 'ajax',
						url : strUrl,
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
