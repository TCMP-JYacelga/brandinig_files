Ext.define("GCP.view.LoanRepayStandingOrderFilterView", {
	extend:'Ext.panel.Panel',
	xtype : 'loanRepayStandingOrderFilterView',
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
		var validityStore = Ext.create( 'Ext.data.Store',
		{
			fields :['CODE', 'DESCR'],
			data :
			[   {
					"CODE" : "ALL",
					"DESCR" : getLabel( 'all', 'ALL' )
				},
				{
					"CODE" : "0",
					"DESCR" : getLabel( 'lbl.validity.0', 'In-Active' )
				},
				{
					"CODE" : "1",
					"DESCR" : getLabel( 'lbl.validity.1', 'Future Dated' )
				},
				{
					"CODE" : "2",
					"DESCR" : getLabel( 'lbl.validity.2', 'Active' )
				}
			]
		} );

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
						if (count > 1) {
							companyStore.add({
										'CODE' : 'ALL',
										'DESCR' :  getLabel( 'allCompanies', 'All Companies' )
									});
						}
						for(var i=0; i<count; i++) {
							var record = {
								'CODE' : data[i].CODE,
								'DESCR' : data[i].DESCR
							}
							companyStore.add(record);
						}
						if(count) {
							selectedFilterClient = companyStore.getAt(0).data.CODE;
							selectedFilterClientDesc = companyStore.getAt(0).data.DESCR;
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
			width : '100%',
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
				width : 250,
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
				width : 250,
				matchFieldWidth : true,
				hidden : isClientUser(),
				itemId : 'clientComboAuto',
				cfgUrl : "services/userseek/userclients.json",
				padding : '-4 0 0 0',
				cfgRecordCount : -1,
				cfgSeekId : 'userclients',
				cfgQueryParamName : '$autofilter',
				cfgKeyNode : 'CODE',
				cfgRootNode : 'd.preferences',
				cfgDataNode1 : 'DESCR',
				emptyText : getLabel('autoCompleterEmptyText', 'Enter Keyword or %'),
				enableQueryParam : false,
				cfgProxyMethodType : 'POST'
				/*listeners : {
					select : function(combo, record) {
						selectedFilterClient = combo.getValue();
						selectedFilterClientDesc = combo.getDisplayValue();
						$(document).trigger("handleClientChangeInQuickFilter", false);
					}
				}*/
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
				items : [
				 {
					xtype : 'label',
					text : getLabel('scmProduct', 'SCF Package')	
				}, {
					xtype : 'AutoCompleter',
					name : 'scmProductAutocompleter',
					itemId : 'scmProductAutocompleter',
					cfgUrl : 'services/userseek/loanRepaySoScmProductSeek.json',
					cfgQueryParamName : '$autofilter',
					cfgRecordCount : -1,
					cfgKeyNode : 'CODE',
					width : 250,
					padding : '-4 30 0 0',
					matchFieldWidth : true,
					emptyText :getLabel('autoCompleterEmptyText', 'Enter Keyword or %'),
					cfgRootNode : 'd.preferences',
					cfgDataNode1 : 'DESCR',
					cfgProxyMethodType : 'POST'
				}]
			},
			{
				xtype : 'container',
				//itemId : 'filterParentContainer',
				//width : '100%',
				layout : 'vbox',
				items : [{
					xtype : 'container',
					itemId : 'validitySelectorContainer',
					layout : 'vbox',
					items : [{
						xtype : 'label',
						text : getLabel('validity', 'Validity')	
					}]
				}, {
					xtype : 'combo',
					displayField : 'DESCR',
					valueField : 'CODE',
					queryMode : 'local',
					editable : false,
					width : 250,
					padding : '-4 30 0 0',
					itemId : 'validityCombo',
					emptyText : getLabel('selectValidity', 'Select Validity'),
					store : validityStore
				}]
			},{
				xtype : 'container',
				layout : 'vbox',
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
									width : 240,
									padding : '-4 30 0 0',
									itemId : 'statusFilter',
									isQuickStatusFieldChange : false,
									store : me.getStatusStore(),
									listeners : {
										'focus' : function() {
										}
									}
								})]
			}]
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