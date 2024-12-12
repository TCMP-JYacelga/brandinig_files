Ext.define('GCP.view.ApprovalWorkflowFilterView', {
	extend : 'Ext.panel.Panel',
	xtype : 'approvalWorkflowFilterView',
	requires : ['Ext.ux.gcp.AutoCompleter'],
	//width : '100%',
	layout : 'vbox',
	initComponent : function() {
		var me = this;
		pmtSummaryView = this;
		var storeData = null;
		var clientsStoreData = null;
		var filterContainerArr = new Array();
		var defaultMatrixUrl = null;
		var multipleSellersAvailable = false;
		var clientStore = Ext.create('Ext.data.Store', {
					fields : ['CODE', 'DESCR']
				});
		var corporationStore = Ext.create('Ext.data.Store', {
					fields : ['CODE', 'DESCR']
				});

		if (userType == 0) {
			defaultMatrixUrl = 'services/approvalMatrixWorkflowSeek/adminDefaultMatrixList';
		} else {
			defaultMatrixUrl = 'services/approvalMatrixWorkflowSeek/clientDefaultMatrixList';
		}
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
											'DESCR' : getLabel('allCompanies',
											'All Companies')
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


		var statusStore = Ext.create('Ext.data.Store', {
					fields : ["name", "value"],
					proxy : {
						type : 'ajax',
						autoLoad : true,
						url : 'cpon/statusList.json',
						actionMethods : {
							read : 'POST'
						},
						reader : {
							type : 'json',
							root : 'd.filter'
						}
					}
				});

		this.items = [
				{
					xtype : 'container',
					layout : 'vbox',
					hidden : ((clientStore.getCount() < 2) || !isClientUser()) ? true : false,//If count is one or admin then hide
					width : '25%',
					padding : '0 30 0 0',
					items : [{
								xtype : 'label',
								itemId : 'savedFiltersLabel',
		                        text : getLabel('lblcompany', 'Company Name')
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
								store : clientStore,
								listeners : {
									'select' : function(combo, record) {
									me.fireEvent("handleClientChange", combo);
									}/*,
									boxready : function(combo, width, height, eOpts) {
										combo.setValue(combo.getStore().getAt(0));
									}*/
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
									$('#msClient').val(selectedFilterClient);
									$('#msClient').niceSelect('update');
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
			}, {
			xtype : 'panel',
			cls : 'ux_largepaddinglr ux_largepadding-bottom',
			width : '100%',
			layout : 'hbox',
			items : [{
				xtype : 'container',
				//flex : 1,
				layout : 'vbox',
				padding : '0 25 0 0',
				width : '25%',
				items : [{
							xtype : 'label',
							text : getLabel('defaultMatrix', 'Default Matrix')
						}, {
							xtype : 'AutoCompleter',
							matchFieldWidth : true,
							emptyText : getLabel('autoCompleterEmptyText',
									'Enter Keyword or %'),
							width : '100%',
							cls : 'ux_paddingb ux_normalmargin-top ux_largemargin-left ',
							fieldCls : 'xn-form-text w14 xn-suggestion-box',
							name : 'defaultMatrix',
							itemId : 'defaultMatrixFltId',
							cfgUrl : defaultMatrixUrl,
							cfgQueryParamName : 'qfilter',
							enableQueryParam : false,
							cfgRecordCount : -1,
							cfgSeekId : 'approvalAdminClientList',
							cfgKeyNode : 'name',
							cfgRootNode : 'filterList',
							cfgDataNode1 : 'value',
							cfgProxyMethodType : 'POST'
						}]
			}, {
				xtype : 'container',
				itemId : 'statusContainer',
				layout : 'vbox',
				width : '30%',
				padding : '5 30 0 0',
				items : [{
							xtype : 'label',
							text : getLabel('status', 'Status')
						}, Ext.create('Ext.ux.gcp.CheckCombo', {
									valueField : 'code',
									displayField : 'desc',
									editable : false,
									addAllSelector : true,
									emptyText : 'All',
									multiSelect : true,
									width : '100%',
									padding : '-4 0 0 0',
									itemId : 'statusFltId',
									isQuickStatusFieldChange : false,
									store : me.getStatusStore(),
									listeners : {
										'focus' : function() {
											//	$('#entryDataPicker').attr(
											//			'disabled', 'disabled');
										}
									}
								})]
			}]
		}

		];
		this.callParent(arguments);

	},

	getStatusStore : function() {
		var objStatusStore = null;
		if (!Ext.isEmpty(arrWorkFlowStatus)) {
			objStatusStore = Ext.create('Ext.data.Store', {
						fields : ['code', 'desc'],
						data : arrWorkFlowStatus,
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

	tools : []

});