Ext.define("GCP.view.periodicSummary.PeriodicSummaryFilterView", {
	extend : 'Ext.panel.Panel',
	requires : ['Ext.ux.gcp.AutoCompleter'],
	xtype : 'periodicSummaryFilterView',
	layout : 'vbox',
	initComponent : function() {
		var me = this, strUrl = '';
		var companyName;
		var companyStore = Ext.create('Ext.data.Store', {
			fields : ['CODE', 'DESCR']
		}); 
		if(isClientUser()) {
			Ext.Ajax.request({
				url : 'services/userseek/userclients.json',
				method : 'POST',
				async : false,
				success : function(response) {
					var responseData = Ext.decode(response.responseText);
					var data = responseData.d.preferences;
					if(companyStore) {
						companyStore.removeAll();
						var count = data.length;
						for(var i=0; i<count; i++) {
							var record = {
								'CODE' : data[i].CODE,
								'DESCR' : data[i].DESCR
							}
							companyStore.add(record);
						}
						if(count) {
							clientCount = count;
//							selectedFilterClient = companyStore.getAt(0).data.CODE;
//							selectedFilterClientDesc = companyStore.getAt(0).data.DESCR;
						}
					}
				},
				failure : function() {
					
				}
			});
		}
		
		var periodTypeStore = Ext.create('Ext.data.Store', {
			fields : ['CODE', 'DESCR'],
			data : [{'CODE' : 'D', 'DESCR' : 'Daily'},
			        {'CODE' : 'W', 'DESCR' : 'Weekly'},
			        {'CODE' : 'M', 'DESCR' : 'Monthly'}]
		});
		
		me.items = [{
			xtype : 'container',
			layout : 'vbox',
			itemId : 'companySlectorContainer',
			flex : 1,
			hidden : (isClientUser() && companyStore.getCount() <= 1) ? true : false,
			width : '100%',
			items : [{
				xtype : 'container',
				layout : 'vbox',
				width: '25%',
				padding : '0 30 0 0',
				items: [{
					xtype : 'label',
					itemId : 'lblcompanyname',
					text : getLabel('lblcompanyname', 'Company Name')
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
					store : companyStore
				}, {
					xtype : 'AutoCompleter',
					width : '100%',
					matchFieldWidth : true,
					hidden : isClientUser(),
					itemId : 'clientComboAuto',
					cfgUrl : "services/userseek/userclients.json",
					padding : '-4 0 0 0',
					cfgRecordCount : -1,
					cfgSeekId : 'foreCorpSeek',
					cfgQueryParamName : '$autofilter',
					cfgKeyNode : 'CODE',
					cfgRootNode : 'd.preferences',
					cfgDataNode1 : 'DESCR',
					emptyText : getLabel('searchByCompany', 'Search By Company Name'),
					enableQueryParam : false,
					cfgProxyMethodType : 'POST'
				}]
			}]
		},{
			xtype : 'container',
			itemId : 'parentContainer',
			width : '100%',
			layout : 'hbox',
			flex : 1,
			items : [{
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
								xtype : 'combo',
								displayField : 'DISPLAYFIELD',
								valueField : 'CODE',
								queryMode : 'local',
								editable : false,
								width : '100%',
								padding : '-4 0 0 0',
								itemId : 'accountCombo'
							}]
				}]
			}, {
				xtype : 'container',
				itemId : 'periodTypeContainer',
				width : '25%',
				layout : 'hbox',
				items : [{
					xtype : 'container',
					itemId : 'periodContainer',
					layout : 'vbox',
					width : '100%',
					padding : '0 30 0 0',
					items : [{
								xtype : 'label',
								itemId : 'periodTypeLabel',
								text : 'Period Type'//getLabel('accountNmbr', 'Account Number')
							}, {
								xtype : 'combo',
								displayField : 'DESCR',
								valueField : 'CODE',
								queryMode : 'local',
								editable : false,
								width : '100%',
								store : periodTypeStore,
								padding : '-4 0 0 0',
								itemId : 'periodTypeCombo',
								listeners : {
									boxready : function(combo, width, height, eOpts) {
										if(selectedFilterPeriodicType === "D")
											combo.setValue(combo.getStore().getAt(0));
										else if(selectedFilterPeriodicType === "W")
											combo.setValue(combo.getStore().getAt(1));
										else if(selectedFilterPeriodicType === "M")
											combo.setValue(combo.getStore().getAt(2));
										else
											combo.setValue(combo.getStore().getAt(0));
									}	
								}
							}]
				}]
			}, {
				xtype : 'container',
				itemId : 'periodicDateContainer',
				layout : 'vbox',
				width : '25%',
				padding : '0 30 0 0',
				items : [{
					xtype : 'panel',
					itemId : 'periodDatePanel',
					height : 23,
					flex : 1,
					layout : 'hbox',
					items : [{
						xtype : 'label',
						itemId : 'periodDateLabel',
						text : getLabel('date1', 'Period')
					}]
				}, {
					xtype : 'container',
					itemId : 'periodDateContainer',
					layout : 'hbox',
					width : '100%',
					items : [{
						xtype : 'component',
						width : '82%',
						itemId : 'periodDatePicker',
						filterParamName : 'PeriodDate',
						html : '<input type="text"  id="periodDatePicker" class="ft-datepicker from-date-range ui-datepicker-range-alignment">'
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
	}
});