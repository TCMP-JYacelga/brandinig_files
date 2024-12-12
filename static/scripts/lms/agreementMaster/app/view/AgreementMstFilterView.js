Ext.define("GCP.view.AgreementMstFilterView", {
	extend : 'Ext.panel.Panel',
	xtype : 'agreementMstFilterView',
	requires : [ 'Ext.ux.gcp.AutoCompleter', 'Ext.ux.gcp.CheckCombo' ],
	layout : {
		type : 'vbox'
	},
	initComponent : function() {
		var me = this;
		var companyStore = Ext.create('Ext.data.Store', {
			fields : [ 'CODE', 'DESCR' ]
		});
		if (isClientUser()) {
			Ext.Ajax.request({
				url : 'services/userseek/sweepClientCodeSeek.json?$filtercode1=' + strSellerId,
				method : 'GET',
				async : false,
				success : function(response) {
					var responseData = Ext.decode(response.responseText);
					var data = responseData.d.preferences;
					if (companyStore) {
						companyStore.removeAll();
						var count = data.length;
						if (count > 1) {
							companyStore.add({
								'CODE' : 'all',
								'DESCR' : 'All Companies'
							});
						}
						for (var i = 0; i < count; i++) {
							var record = {
								'CODE' : data[i].CODE,
								'DESCR' : data[i].DESCRIPTION
							}
							companyStore.add(record);
						}
						if (count) {
							selectedFilterClient = companyStore.getAt(0).data.CODE;
							selectedFilterClientDesc = companyStore.getAt(0).data.DESCR;
						}
					}
				},
				failure : function() {

				}
			});
		}
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
			fields : [ 'CODE', 'DESCR' ],
			data : storeData,
			reader : {
				type : 'json',
				root : 'preferences'
			}
		});
		if(objStore.getCount() > 1){
			multipleSellersAvailable = true;
		}
		var structureTypeStore = Ext.create('Ext.data.Store', {
			fields : [ 'key', 'value' ],
			data : [ {
				"key" : "all",
				"value" : getLabel('lblAll', 'ALL')
			}, {
				"key" : "101",
				"value" : getLabel('lblSweep', 'Sweep')
			}, {
				"key" : "201",
				"value" : getLabel('lblFlexible', 'Flexible')
			}, {
				"key" : "501",
				"value" : getLabel('lblHybrid', 'Hybrid')
			}

			]
		});
		this.items = [ {
			xtype : 'container',
			layout : 'hbox',
			width : '100%',
			items : [ {
				xtype : 'container',
				layout : 'vbox',
				width : '25%',
				padding : '0 30 0 0',
				hidden : multipleSellersAvailable == true ? false : true,
				//hidden : ((entityType == '0') && strOnBehalf != 'true') ? false : true,// Only display for admin
				items : [ {
					xtype : 'label',
					text : getLabel('financialInstitution', 'Financial Institution')
				}, {
					xtype : 'combo',
					displayField : 'DESCR',
					valueField : 'CODE',
					editable : false,
					width : '100%',
					padding : '-4 0 0 0',
					itemId : 'sellerFltId',
					value : strSellerId,
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
				} ]
			}, {
				xtype : 'container',
				layout : 'vbox',
				width : '25%',
				padding : '0 30 0 0',
				hidden : ((companyStore.getCount() < 2) || !isClientUser()) ? true : false,// If count is one or admin then hide
				items : [ {
					xtype : 'label',
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
					emptyText : getLabel('selectCompanycombo', 'All Companies'),
					store : companyStore

				} ]
			}, {
				xtype : 'container',
				layout : 'vbox',
				width : '25%',
				padding : '0 30 0 0',
				hidden : (isClientUser()) ? true : false,// If not admin then hide
				items : [ {
					xtype : 'label',
					text : getLabel('lblcompany', 'Company Name')
				}, {
					xtype : 'AutoCompleter',
					width : '100%',
					matchFieldWidth : true,
					name : 'clientCombo',
					itemId : 'clientComboAuto',
					cfgUrl : "services/userseek/sweepClientCodeSeek.json",
					padding : '-4 0 0 0',
					cfgQueryParamName : '$autofilter',
					cfgRecordCount : -1,
					cfgSeekId : 'sweepClientCodeSeek',
					cfgKeyNode : 'CODE',
					cfgRootNode : 'd.preferences',
					cfgDataNode1 : 'DESCRIPTION',
					// cfgDataNode2 : 'CLIENTSHORTNAME',
					emptyText : getLabel('autoCompleterEmptyText', 'Enter Keyword or %'),
					enableQueryParam : false,
					cfgProxyMethodType : 'POST',
					cfgExtraParams : [ {
						key : '$filtercode1',
						value : strSellerId
					} ]
				} ]
			} ]
		}, {
			xtype : 'container',
			itemId : 'filterParentContainer',
			width : '100%',
			layout : 'hbox',
			items : [ {
				xtype : 'container',
				width : '25%',
				padding : '0 30 0 0',
				layout : 'vbox',
				items : [ {
					xtype : 'label',
					text : getLabel('lbl.notionalMst.agreementCode', 'Agreement Name'),
					cls : 'ux_font-size14  ux_normalpadding-bottom ux_largepadding-left'
				}, {
					xtype : 'AutoCompleter',
					cls : 'ux_normalmargin-top ux_largepadding-left',
					fieldCls : 'xn-form-text xn-suggestion-box',
					name : 'agreementRecKey',
					itemId : 'agreementCodeItemId',
					matchFieldWidth : true,
					cfgUrl : 'services/userseek/{0}.json',
					emptyText : getLabel('autoCompleterEmptyText', 'Enter Keyword or %'),
					cfgQueryParamName : '$autofilter',
					cfgRecordCount : -1,
					width : '100%',
					cfgSeekId : (entityType === '0') ? 'sweepMstAgreementCodeSeekAll' : 'sweepMstAgreementCodeSeek',
					cfgKeyNode : 'DESCRIPTION',
					cfgRootNode : 'd.preferences',
					// cfgDataNode1 : 'CODE',
					cfgDataNode1 : 'DESCRIPTION',
					enableQueryParam : false,
					cfgProxyMethodType : 'POST',
					cfgStoreFields : [ 'CODE', 'DESCRIPTION', 'RECKEY', 'DISPLAYFIELD' ],
					cfgExtraParams : (entityType === '0') ? [ {
						key : '$filtercode1',
						value : strSellerId
					} ] : [ {
						key : '$filtercode1',
						value : strSellerId
					}, {
						key : '$filtercode2',
						value : strClient
					} ]
				} ]
			}, {
				xtype : 'container',
				width : '25%',
				padding : '0 30 0 0',
				layout : 'vbox',
				items : [ {
					xtype : 'label',
					text : getLabel('lms.notionalMst.structureType', 'Structure Type'),
					cls : 'ux_font-size14  ux_normalpadding-bottom ux_largepadding-left'
				}, {
					xtype : 'combo',
					valueField : 'key',
					displayField : 'value',
					editable : false,
					queryMode : 'local',
					triggerAction : 'all',
					margin : '7 0 0 0',
					width : '100%',
					padding : '-4 0 0 0',
					itemId : 'structureTypeId',
					mode : 'local',
					emptyText : getLabel('autoCompleterEmptyText', 'Enter Keyword or %'),
					store : structureTypeStore
				} ]
			}, {
				xtype : 'container',
				width : '25%',
				padding : '0 30 0 0',
				layout : 'vbox',
				items : [ {
					xtype : 'label',
					text : getLabel('lms.notionalMst.status', 'Status'),
					cls : 'ux_font-size14  ux_normalpadding-bottom ux_largepadding-left'
				}, Ext.create('Ext.ux.gcp.CheckCombo', {
					name : 'statusId',
					itemId : 'statusId',
					width : '100%',
					valueField : 'code',
					displayField : 'desc',
					editable : false,
					matchFieldWidth : true,
					addAllSelector : true,
					emptyText : 'All',
					multiSelect : true,
					store : me.getStatusStore(),
					isQuickStatusFieldChange : false,
					listeners : {
						'focus' : function() {
						}
					}
				}) ]
			} ]
		},

		{
			xtype : 'container',
			itemId : 'savedFilterParentContainer',
			width : '100%',
			layout : 'hbox',
			items : [ {
				xtype : 'container',
				itemId : 'savedFiltersContainer',
				layout : 'vbox',
				width : '25%',
				padding : '0 30 0 0',
				hidden : (entityType === '0')? false : isHidden('AdvanceFilter'),
				items : [ {
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
					emptyText : getLabel('selectfilter', 'Select Filter'),
					store : me.savedFilterStore(),
					listeners : {
						'select' : function(combo, record) {
							me.fireEvent("handleSavedFilterItemClick", combo.getValue(), combo.getRawValue());
						}
					}
				} ]
			}

			]
		}

		]
		this.callParent(arguments);
	},
	getStatusStore : function() {
		var objStatusStore = null;
		if (!Ext.isEmpty(arrStatus)) {
			objStatusStore = Ext.create('Ext.data.Store', {
				fields : [ 'code', 'desc' ],
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
	savedFilterStore : function() {
		var myStore = new Ext.data.ArrayStore({
			autoLoad : true,
			fields : [ 'filterName' ],
			proxy : {
				type : 'ajax',
				async : false,
				url : Ext.String.format('services/userfilterslist/agreementMst.json'),
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