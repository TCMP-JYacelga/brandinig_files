Ext.define("GCP.view.PaymentSummaryFilterView",{
	extend:'Ext.panel.Panel',
	requires : ['Ext.ux.gcp.AutoCompleter'],
	xtype : 'paymentSummaryFilterView',
	layout:'vbox',
	initComponent : function() {
		var me=this, strUrl='';
		
		var clientStore = Ext.create('Ext.data.Store', {
					fields : ['CODE', 'DESCR']
				});
		if(isClientUser()){
		Ext.Ajax.request({
					url : 'services/userseek/userclientsPayment.json',
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
											'DESCR' :getLabel('allCompanies', 'All Companies')
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
		}	
		me.items = [{
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
						emptyText : getLabel('selectCompany', 'Select Company Name'),
						store : clientStore,
						listeners : {
							'select' : function(combo, record) {
								selectedFilterClientDesc = combo.getRawValue();
								selectedFilterClient = combo.getValue();
								selectedClientDesc = combo.getRawValue();
								if(!isClientUser()){
								  $('#msClientAutocomplete').val(selectedFilterClient);
								}
								else{
									$('#msClient').val(selectedFilterClient);
									$('#msClient').niceSelect('update');
								}
								changeClientAndRefreshGrid(combo.getValue(), combo.getRawValue());
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
							cfgUrl : "services/userseek/userclientsPayment.json",
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
							cfgProxyMethodType : 'POST',
							listeners : {
								'select' : function(combo, record) {
									selectedFilterClientDesc = combo.getRawValue();
									selectedFilterClient = combo.getValue();
									selectedClientDesc = combo.getRawValue();
									selectedClient = combo.getValue();
									if(!isClientUser()){
									  $('#msClientAutocomplete').val(selectedFilterClient);
									}
									else{
										$('#msClient').val(selectedFilterClient);
										$('#msClient').niceSelect('update');
									}
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
							listeners : {
								'select' : function(combo, record) {
									me.fireEvent("handleSavedFilterItemClick",
											combo.getValue(), combo
													.getRawValue());
								}
							}
						}]
			}, {
				xtype : 'container',
				itemId : 'statusContainer',
				layout : 'vbox',
				width : '25%',
				padding : '0 30 0 0',
				items : [{
							xtype : 'label',
							text : getLabel('lblStatus', 'Status')
						}, Ext.create('Ext.ux.gcp.CheckCombo', {
									valueField : 'code',
									displayField : 'desc',
									editable : false,
									addAllSelector : true,
									emptyText : 'All',
									multiSelect : true,
									width : '100%',
									padding : '-4 0 0 0',
									itemId : 'statusCombo',
									isQuickStatusFieldChange : false,
									store : me.getStatusStore(),
									listeners : {
										/*'focus' : function() {
											$('#entryDataPicker').attr(
													'disabled', 'disabled');
										}*/
									}
								})]
			},{
				xtype : 'container',
				itemId : 'parentBatchReferenceContainer',
				layout : 'vbox',
				width : '25%',
				padding : '0 30 0 0',
				hidden :true,
				items : [{
							xtype : 'label',
							itemId : 'parentBatchReferenceLabel',
							text : getLabel('parentBatchTrackingId', 'Parent Batch Tracking Id')
						}, {
							xtype : 'textfield',
							valueField : 'filterName',
							displayField : 'filterName',
							width : '100%',
							padding : '-4 0 0 0',
							name : 'parentBatchReference1',
							itemId : 'parentBatchReference1',
							fieldCls : 'form-control',
							maxLength : 20,
							enforceMaxLength : true,
							listeners : {
								'blur' : function(textfield, record) {
									payBatchRefFilterValue = textfield.getValue();
									//payRefFilterDesc = textfield.getRawValue();
									$('#parentBatchReference').val(payBatchRefFilterValue);
									
									$(document).trigger("handleParentBatchReferenceChange",
											false);
								}
							}
						}]
			},{
				xtype : 'container',
				itemId : 'paymentReferenceContainer',
				layout : 'vbox',
				width : '25%',
				padding : '0 30 0 0',
				hidden : (showPaymentRefFilter == 'N') ? true : false,
				items : [{
							xtype : 'label',
							itemId : 'paymentReferenceLabel',
							text : getLabel('batchReference', 'Batch Reference')
						}, {
							xtype : 'textfield',
							valueField : 'filterName',
							displayField : 'filterName',
							width : '100%',
							padding : '-4 0 0 0',
							name : 'paymentReference1',
							itemId : 'paymentReference1',
							fieldCls : 'form-control',
							maxLength : 20,
							enforceMaxLength : true,
							listeners : {
								'blur' : function(textfield, record) {
									payRefFilterValue = textfield.getValue();
									//payRefFilterDesc = textfield.getRawValue();
									$('#paymentReference').val(payRefFilterValue);
									
									$(document).trigger("handlePaymentReferenceChangeInQF",
											false);
								}
							}
						}]
			}, {
				xtype : 'container',
				itemId : 'entryDateContainer',
				layout : 'vbox',
				width : '50%',
				padding : '0 30 0 0',
				items : [{
					xtype : 'panel',
					itemId : 'entryDatePanel',
					height : 23,
					flex : 1,
					layout : 'hbox',
					items : [{
								xtype : 'label',
								itemId : 'entryDateLabel',
								text : getLabel('date', 'Entry Date')
							}, {
								xtype : 'button',
								border : 0,
								filterParamName : 'EntryDate',
								itemId : 'entryDateBtn',
								cls : 'ui-caret-dropdown',
								listeners : {
									click : function(event) {
										var menus = getDateDropDownItems(
												"entryDateQuickFilter", this);
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
					itemId : 'entryDateToContainer',
					layout : 'hbox',
					width : '50%',
					items : [{
						xtype : 'component',
						width : '82%',
						itemId : 'paymentEntryDataPicker',
						filterParamName : 'EntryDate',
						html : '<input type="text"  id="entryDataPicker" class="ft-datepicker from-date-range ui-datepicker-range-alignment">'
					}, {
						xtype : 'component',
						cls : 'icon-calendar',
						margin : '1 0 0 0',
						html : '<span class=""><i class="fa fa-calendar"></i></span>'
					} /*, {
						xtype : 'component',
						itemId : 'dateToLbl',
						cls : 'toDateText',
						margin : '1 0 0 -9',
						html : '<span class=""> to </span>'
					}, {
						xtype : 'component',
						width : '35%',
						itemId : 'paymentEntryToDataPicker',
						filterParamName : 'EntryToDate',
						html : '<input type="text"  id="entryDataToPicker" placeholder="'
								+ strApplicationDateFormat
								+ '" class="ft-datepicker to-date-range ui-datepicker-range-alignment">'
					}, {
						xtype : 'component',
						cls : 'to-icon-calendar',
						margin : '1 0 0 0',
						html : '<span class=""><i class="fa fa-calendar"></i></span>'
					}*/]
				}]
			}
			/*, {
				xtype : 'container',
				itemId : 'clientContainer',
				layout : 'vbox',
				hidden : true,
				items : [{
							xtype : 'label',
							text : getLabel("batchColumnClient", "Company Name"),
							flex : 1,
							margin : '0 0 0 0'
						}, {
							xtype : 'combo',
							valueField : 'CODE',
							displayField : 'DESCR',
							queryMode : 'local',
							editable : false,
							triggerAction : 'all',
							width : '93%',
							itemId : 'quickFilterClientCombo',
							mode : 'local',
							padding : '0 0 0 0',
							emptyText : getLabel('selectclient',
									'Select Client'),
							store : me.getClientStore(),
							listeners : {
								'select' : function(combo, record) {
									me.fireEvent(
											"handleClientChangeInQuickFilter",
											combo);
								}
							}
						}]
			}*/
			
			]
		}];
		this.callParent(arguments);	
	},
	getStatusStore : function(){
		var objPayStatusStore = null;
		if (!Ext.isEmpty(arrPaymentStatus)) {
			objPayStatusStore = Ext.create('Ext.data.Store', {
						fields : ['code','desc'],
						data : arrPaymentStatus,
						autoLoad : true,
						listeners : {
							load : function() {
							}
						}
					});
			objPayStatusStore.load();
		}
		return objPayStatusStore;
	},
	getPaymentTypeStore : function() {
		var dataPaymentTypes = null;
		var objPaymentTypesStore = null;
		Ext.Ajax.request({
			url : 'services/paymentMethod.json',
			async : false,
			method : "POST",
			success : function(response) {
				if (!Ext.isEmpty(response.responseText)) {
					var data = Ext.decode(response.responseText);
					if (data && data.d) {
						dataPaymentTypes = data.d.instrumentType;
						objPaymentTypesStore = Ext.create('Ext.data.Store', {
									fields : ['instTypeDescription',
											'instTypeCode'],
									data : dataPaymentTypes,
									reader : {
										type : 'json',
										root : 'd.instrumentType'
									},
									autoLoad : true,
									listeners : {
										load : function() {
											// this.insert(0, {
														// instTypeDescription : 'All',
														// instTypeCode : 'all'
													// });
										}
									}
								});
						objPaymentTypesStore.load();
					}
				}
			},
			failure : function(response) {
				// console.log('Error Occured');
			}
		});
		return objPaymentTypesStore;
	},
	/*getClientStore:function(){
		var clientData=null;
		var objClientStore=null;
		Ext.Ajax.request({
			url : 'services/userseek/userclients.json&$sellerCode='+ strSeller,
			async : false,
			method : "POST",
			success : function(response) {
				if (!Ext.isEmpty(response.responseText)) {
					var data = Ext.decode(response.responseText);
					if (data && data.d) {
						clientData = data.d.preferences;
						objClientStore = Ext.create('Ext.data.Store', {
									fields : ['CODE',
											'DESCR'],
									data : clientData,
									reader : {
										type : 'json',
										root : 'd.preferences'
									},
									autoLoad : true,
									listeners : {
										load : function() {
											this.insert(0, {
														'CODE' : 'all',
														'DESCR' : getLabel('allCompanies', 'All companies')
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
	},*/
	savedFilterStore : function() {
		var myStore = new Ext.data.ArrayStore({
					autoLoad : true,
					fields : ['filterName'],
					proxy : {
						type : 'ajax',
						url : 'services/userfilterslist/groupViewFilter.json',
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