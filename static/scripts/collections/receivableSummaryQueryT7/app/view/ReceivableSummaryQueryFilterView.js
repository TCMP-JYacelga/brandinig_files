Ext.define("GCP.view.ReceivableSummaryQueryFilterView",{
	extend:'Ext.panel.Panel',
	requires : ['Ext.ux.gcp.AutoCompleter'],
	xtype : 'receivableSummaryQueryFilterView',
	layout:'vbox',
	initComponent : function() {
		var me=this;
		var clientStore = Ext.create('Ext.data.Store', {
			fields : ['CODE', 'DESCR']
		});
		Ext.Ajax.request({
			url : 'services/userseek/userclients.json&$sellerCode='+strSeller,
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
									'DESCR' : getLabel('allcompanies','All Companies')
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
						emptyText : getLabel('selectCompany', 'Select Company'),
						store : clientStore,
						listeners : {
							'select' : function(combo, record) {
								selectedFilterClientDesc = combo.getRawValue();
								selectedFilterClient = combo.getValue();
								selectedClientDesc = combo.getRawValue();
								$('#msClient').val(selectedFilterClient);
								$('#msClient').niceSelect('update');
								changeClientAndRefreshGrid(combo.getValue(), combo.getRawValue());
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
							emptyText : getLabel('autoCompleterEmptyText','Enter Keyword or %'),
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
									selectedFilterClient = combo.getValue();
									selectedFilterClientDesc = combo.getDisplayValue();
									selectedClient = selectedFilterClient;
									selectedFilterClientDesc = "";
									selectedFilterClient = "";
									selectedClientDesc = "";
									$('#msClient').val(selectedFilterClient);
									$('#msClient').niceSelect('update');
									if(($("#msClient").val() !== "all")
											|| ($("#msClient").val() === "all"
												&& selectedClient == null))
									$(document).trigger("handleClientChangeInQuickFilter",
											false);
									}
								}
							}
						}]
		},{
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
				text : 'Saved Filters',
				padding : '0 0 0 0'
			}, {
				xtype : 'combo',
				valueField : 'filterName',
				displayField : 'filterName',
				hidden : isHidden('AdvanceFilter'),
				queryMode : 'local',
				editable : false,
				width : '100%',
				padding : '-4 0 0 0',
				triggerAction : 'all',
				itemId : 'savedFiltersCombo',
				mode : 'local',
				emptyText : getLabel('selectfilter','Select Filter'),
				store : me.savedFilterStore(),
				listeners:{
					'select':function(combo,record){
						me.fireEvent("handleSavedFilterItemClick",combo.getValue(),combo.getRawValue());
						}
				}
	 }]
	},{
		xtype : 'container',
		itemId : 'receivablePackContainer',
		layout : 'vbox',
		width : '25%',
		padding : '0 30 0 0',
		items : [{
					xtype : 'label',
					text : getLabel('paymentType',
							'Product Category'),
					flex : 1
				},Ext.create('Ext.ux.gcp.CheckCombo',
				{				
					valueField : 'PRODUCT_CATEGORY_CODE',
					displayField : 'PRODUCT_CATEGORY_DESC',
					editable : false,
					addAllSelector: true,
					emptyText : 'All',
					multiSelect : true,
					width :'100%',
					padding : '-4 0 0 0',
					itemId : 'receivablePackageCombo',
					store : me.recCategoryStore(),
					listeners:{
						'focus':function(){
							$('#entryDataPicker').attr('disabled','disabled');
						},
						'blur':function(combo,record){
							me.fireEvent("handlePaymentTypeChangeInQuickFilter",combo);
						}
					}
				})]
	},{
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
								text : getLabel('processingDate',
										'Processing Date')
							}, {
								xtype : 'button',
								border : 0,
								filterParamName : 'ProcessingDate',
								itemId : 'entryDateBtn',
								cls : 'ui-caret-dropdown',
								listeners : {
									click:function(event){
											var menus=getDateDropDownItems("entryDateQuickFilter",this);
											var xy=event.getXY();
											menus.showAt(xy[0],xy[1]+16);
											event.menu=menus;
										//	event.removeCls('ui-caret-dropdown'),
										//	event.addCls('action-down-hover');
									}
								}
							}]
				}, 
				{
					xtype : 'container',
					itemId : 'entryDateToContainer',
					layout : 'hbox',
					width : '50%',
					items : [{
						xtype : 'component',
						width : '82%',
						itemId : 'paymentEntryDataPicker',
						filterParamName : 'ProcessingDate',
						html : '<input type="text"  id="entryDataPicker" class="ft-datepicker from-date-range ui-datepicker-range-alignment">'
					}, {
						xtype : 'component',
						cls : 'icon-calendar',
						margin : '1 0 0 0',
						html : '<span class=""><i class="fa fa-calendar"></i></span>'
					}]
				},{
					xtype : 'container',
					itemId : 'clientContainer',
					layout : 'vbox',
					width : '18%',
					hidden : true,
					items : [{
								xtype : 'label',
								text : getLabel("batchColumnClient","Client"),
								flex : 1,
								margin : '0 0 0 6'
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
								padding : '0 0 0 6',
								emptyText : getLabel('selectclient','Select Client'),
								store : clientStore,
								listeners:{
									'select':function(combo,record){
										me.fireEvent("handleClientChangeInQuickFilter",combo);
									}
								}
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
						url : 'services/userfilterslist/groupRecQViewFilter.json',
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
	},
	recCategoryStore : function() {
		var dataRecCatTypes = null;
		var objRecCategoryStore = null;
		Ext.Ajax.request({
			url : 'services/userseek/receivableCategoryQuery.json',
			async : false,
			method : "POST",
			success : function(response) {
				if (!Ext.isEmpty(response.responseText)) {
					var data = Ext.decode(response.responseText);
					if (data && data.d) {
						dataRecCatTypes = data.d.preferences;
						var jsonObj ='';
						if(dataRecCatTypes  instanceof Object ==false)
							jsonObj =JSON.parse(dataRecCatTypes);
						if(dataRecCatTypes  instanceof Array)
							jsonObj =dataRecCatTypes;
						for (var i = 0; i < jsonObj.length; i++) {
							jsonObj[i].PRODUCT_CATEGORY_DESC =  getLabel(jsonObj[i].PRODUCT_CATEGORY_CODE,jsonObj[i].colDesc);
						}
						if(dataRecCatTypes  instanceof Object ==false)
							jsonObj = JSON.stringify(jsonObj);
						objRecCategoryStore = Ext.create('Ext.data.Store', {
							fields : ['PRODUCT_CATEGORY_DESC',
								'PRODUCT_CATEGORY_CODE'],
								data : jsonObj,
								reader : {
									type : 'json',
									root : 'd.preferences'
								},
								autoLoad : true,
								listeners : {
									load : function() {

									}
								}
						});
						objRecCategoryStore.load();
					}
				}
			},
			failure : function(response) {
				// console.log('Error Occured');
			}
		});
		return objRecCategoryStore;
	}
});