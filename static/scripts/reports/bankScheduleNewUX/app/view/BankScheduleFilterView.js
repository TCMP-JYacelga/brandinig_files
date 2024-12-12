/**
 * @class GCP.view.BankScheduleFilterView
 * @extends Ext.panel.Panel
 * @author Anil Pahane
 */
Ext.define('GCP.view.BankScheduleFilterView', {
	extend : 'Ext.panel.Panel',
	xtype : 'bankScheduleFilterView',
	requires : ['Ext.menu.Menu', 'Ext.menu.DatePicker',
			'Ext.container.Container', 'Ext.toolbar.Toolbar',
			'Ext.button.Button', 'Ext.panel.Panel','Ext.ux.gcp.AutoCompleter'],
	width : '100%',
	accountSetPopup : null,
	componentCls : 'gradiant_back',
	collapsible : true,
	collapseFirst : true,
	title : getLabel('filterBy', 'Filter By :')+ '&nbsp;<span id="imgFilterInfoGridView" class="largepadding icon-information"></span>',
	cls : 'xn-ribbon ux_border-bottom',
	layout : {
		type : 'vbox',
		align : 'stretch'
	},
	statusCode : null,
	statusCodeDesc : null,
	repOrDwnld : null,
	repOrDwnldDesc : null,
	entityType : 'BANK',
	tools : [
	{
		xtype : 'container',
		itemId : 'filterClientAutoCmplterCnt',
		//cls : 'paymentqueuespacer',
		padding : '0 0 0 0',
		width : '89%',
		layout : {
			type : 'hbox'
		},
		hidden : isClientUser,
		items : [{
				xtype : 'combobox',
				margin : '0 0 0 10',
				width : 160,
				fieldCls : 'xn-form-field inline_block x-trigger-noedit',
				triggerBaseCls : 'xn-form-trigger',
				filterParamName : 'seller',
				editable : false,
				//autoSelect: false,
				name : 'sellerCombo',
				itemId : 'reportCenterSellerId',
				displayField : 'DESCR',
				valueField : 'CODE',
				queryMode : 'local',
				value : strSeller,
				listeners : {
					'select' : function(combo, record) {	
						strSeller = combo.getValue();
						setAdminSeller(combo.getValue());
						reportSummaryView.seller = strSeller;
						var field = reportSummaryView.down('combobox[itemId="reportCenterClientId"]');
						var descField = reportSummaryView.down('combobox[itemId="reportDescriptionAutoCompleterId"]');
						field.setValue('');
						field.setRawValue('');
						reportSummaryView.handleQuickFilterChange();
						
						field.cfgExtraParams = [{
							key : '$filtercode1',
							value : strSeller
						}];
						descField.cfgExtraParams = [{
							key : '$sellerCode',
							value : strSeller
						}];
						reportSummaryView.fireEvent('refreshGroupByTabs',strSeller, null);
					}
			}
		   }]
	
	},
	{
				xtype : 'container',
				padding : '0 9 0 0',	
				hidden :true,
				layout : 'hbox',
				items : [{
							xtype : 'label',
							text : getLabel('preferences', 'Preferences : '),
							cls : 'xn-account-filter-btnmenu',
							padding : '2 0 0 0'
						}, {
							xtype : 'button',
							itemId : 'btnClearPreferences',
							disabled : true,
							text : getLabel('clearFilter', 'Clear'),
							cls : 'xn-account-filter-btnmenu',
							textAlign : 'right',
							width : 40
						}, {
							xtype : 'image',
							src : 'static/images/icons/icon_spacer.gif',
							height : 18
						}, {
							xtype : 'button',
							itemId : 'btnSavePreferences',
							disabled : true,
							text : getLabel('saveFilter', 'Save'),
							cls : 'xn-account-filter-btnmenu',
							textAlign : 'right',
							width : 30
						}]
			}],
	initComponent : function() {
		var me = this;
		reportSummaryView = this;
		var arrItems = [], panel = null;
		
		GCP.getApplication().on(
		{
			callHandleQuickFilterChange : function()
			{
				reportSummaryView.handleQuickFilterChange();
			}
		} );
		
		//panel = me.createFilterUpperPanel();
		//arrItems.push(panel);
		me.on('afterrender', function(panel) {
			Ext.Ajax.request({
						url : 'services/userseek/adminSellersListCommon.json',
						method : "POST",
						async : false,
						success : function(response) {
							if (response && response.responseText)
								me.populateSellerMenu(Ext
										.decode(response.responseText));
						},
						failure : function(response) {
							// console.log('Error Occured');
						}
					});
		});		
		panel = me.createFilterLowerPanel();
		arrItems.push(panel);
		me.items = arrItems;
		me.callParent(arguments);
	},
	populateSellerMenu : function(data) {
		var me = this;
		var storeValue = null;
		var sellerDrop = me.down('combobox[itemId="reportCenterSellerId"]');
		var clientAutoCompleter = me.down('combobox[itemId="reportCenterClientId"]');
		var descAutoCompleter = me.down('combobox[itemId="reportDescriptionAutoCompleterId"]');
		var sellerArray = data || [];
		
		if( data.d && data.d.preferences )
		{
			storeValue = data.d.preferences;
		}
		var objStore = Ext.create('Ext.data.Store', {
			fields : ['CODE', 'DESCR'],
			data : storeValue,
			reader : {
				type : 'json'
			}
		});
		sellerDrop.store = objStore;
		if(objStore.getCount()==1)
		{
			sellerDrop.hide();
		}
		var selectedSeller = objStore.findRecord('CODE', strSeller);
		sellerDrop.setValue(selectedSeller);
		clientAutoCompleter.cfgExtraParams = [{
			key : '$filtercode1',
			value : sellerDrop.getValue()
		}];
		descAutoCompleter.cfgExtraParams = [{
			key : '$sellerCode',
			value : sellerDrop.getValue()
		}];
	},	
	createFilterLowerPanel : function() {
		var me = this;
		var parentPanel = Ext.create('Ext.panel.Panel', {
					layout : 'hbox',
					itemId : 'filterLowerPanel',
					cls : 'ux_largepadding-left largepadding-right  ux_largepadding-bottom',
					width : '100%',
					items : [me.clientFilterPanel(), me.createSchedulingTypeFilter(), me.createDescriptionFilter()]
				});
		return parentPanel;
	},
	createFICombo : function() {
		var me = this;
		var storeData = null;
		var isMultipleSellerAvailable = false;
		Ext.Ajax.request({
					url : 'services/sellerList.json',
					method : 'POST',
					async : false,
					success : function(response) {
						var data = Ext.decode( response.responseText );
						var sellerData = data.filterList;
						if( !Ext.isEmpty( data ) ){
							storeData = data;
						}
					},
					failure : function(response) {
						// console.log("Ajax Get data Call Failed");
					}

				});
			var objStore = Ext.create('Ext.data.Store', {
					fields : ['sellerCode', 'description'],
					data : storeData,
					reader : {
						type : 'json',
						root : 'filterList'
					}
				});// check if multiple sellers are available
		if (objStore.getCount() > 1) {
			isMultipleSellerAvailable = true;
		}
		var fiComboPanel = Ext.create('Ext.panel.Panel', {
			cls : 'xn-filter-toolbar',
			flex : 0.25,
			layout : {
				type : 'vbox'
			},
			hidden : !isMultipleSellerAvailable,
			items : [{
				xtype : 'label',
				text : getLabel('financialInstitution', 'Financial Institution'),
				cls : 'ux_font-size14',
				padding: '0 0 6 0',
				flex : 1
				
			}, {
				xtype : 'combobox',
				padding : '5 10 0 0',
				width : 160,
				fieldCls : 'xn-form-field inline_block x-trigger-noedit',
				triggerBaseCls : 'xn-form-trigger',
				filterParamName : 'seller',
				editable : false,
				name : 'sellerCombo',
				itemId : 'reportCenterSellerId',
				displayField : 'description',
				valueField : 'sellerCode',
				queryMode : 'local',
				store : objStore,
				value : strSeller,
				listeners : {
					'change' : function(combo, strNewValue, strOldValue) {
						me.setSellerToClientAutoCompleterUrl();
						me.setSellerToDescAutoCompleterUrl();
					}

				}

			}]
		});

		var fiCombo = fiComboPanel
				.down('combobox[itemId="reportCenterSellerId"]');

		if (Ext.isEmpty(strSeller)) {
			fiCombo.suspendEvents();
			fiCombo.select(fiCombo.getStore().getAt(0));
			fiCombo.resumeEvents();
		}
		return fiComboPanel;
	},
	clientFilterPanel : function() {
						var me = this;
						var clientFilterPanel = Ext
								.create(
										'Ext.panel.Panel',
										{
											itemId : 'bankClientFilterPanel',
											cls : 'xn-filter-toolbar',
											layout : {
												type : 'vbox'
											},
											flex : 0.338,
											items : [
													{
														xtype : 'radiogroup',
														defaults : {
															flex : 1
														},
														layout : 'hbox',
														// margin : '0 0 0 10',
														items : [
																{
																	boxLabel : getLabel('bank', 'Bank'),
																	name : 'entityType',
																	inputValue : 'BANK',
																	itemId : 'entityTypeRadio1',
																	//padding : '0 0 0 5',
																	//boxLabelCls : 'ux_font-size14',
																	checked : false,
																	width : 70
																},
																{
																	//margin : '0 0 0 10',
																	boxLabel : getLabel('client', 'Company Name'),
																	name : 'entityType',
																	inputValue : 'BANK_CLIENT',
																	itemId : 'entityTypeRadio2',
																	checked : false,
																	width : 150
																	//boxLabelCls : 'ux_font-size14'
																} ],
														listeners : {
															'change' : function(
																	field,
																	newValue,
																	oldValue) {
																me.entityType = newValue.entityType;
																if(me.entityType == "BANK_CLIENT"){
																	isClientSelected = 'Y';
																}
																reportSummaryView
																		.fireEvent(
																				'filterEntityType',
																				newValue.entityType,
																				null);
																me.resetDescriptionUrl(oldValue, newValue);
															}
														}
													},
													{
														xtype : 'container',
														layout : 'hbox',
														itemId : 'clientFilterPanel',
														hidden : true,
														items : [
																{
																	xtype : 'label',
																	margin : '3 0 0 0',
																	html : '<i href="#" id="imgFilterInfo" class="icon-company largepadding"></i>',
																	itemId : 'clientCompanyIcon'
																},
																{
																	xtype : 'AutoCompleter',
																	margin : '0 0 0 5',
																	fieldCls : 'xn-form-text w12 xn-suggestion-box',
																	itemId : 'reportCenterClientId',
																	name : 'client',
																	cfgUrl : 'services/userseek/bankSchedulingClientSeek.json',
																	cfgRecordCount : -1,
																	cfgRootNode : 'd.preferences',
																	cfgDataNode1 : 'DESCR',
																	cfgDataNode2 : 'SELLER_CODE',
																	cfgKeyNode : 'CODE',
																	value : strClient,
																	cfgQueryParamName : '$autofilter',
																	listeners : {
																		'select' : function(
																				combo,
																				record) {
																			strClient = combo
																					.getValue();
																			strClientDesc = combo
																					.getRawValue();
																			reportSummaryView.seller = record[0].data.SELLER_CODE;
																			reportSummaryView.clientCode = strClient;
																			reportSummaryView.clientDesc = strClientDesc;
																			//setCponEnforcement(strClient);
																			/*reportSummaryView
																					.fireEvent(
																							'refreshGroupByTabs',
																							strSeller,
																							strClient);
																			*/
																			// reportSummaryView.handleQuickFilterChange();
																			/*reportSummaryView
																			.fireEvent(
																					'filterEntityType',
																					record[0].data.SELLER_CODE,
																					strClient);*/
																			reportSummaryView.handleQuickFilterChange();
																			me.addClientFilterToDescAutoCompleter(strClient);
																			
																		},
																		'change' : function(
																				combo,
																				newValue,
																				oldValue,
																				eOpts) {
																			if (Ext
																					.isEmpty(newValue)) {
																				isScheduleAllow = true;
																				isSecPrfAllow = true;
																				reportSummaryView.clientCode = null;																				
																				reportSummaryView.fireEvent('filterClient','ALL', 'ALL');
																				me.addClientFilterToDescAutoCompleter('ALL');
																			}
																		},
																		'render' : function(
																				combo) {
																			combo.store
																					.loadRawData({
																						"d" : {
																							"preferences" : [ {
																								"CODE" : strClient,
																								"DESCR" : strClientDesc
																							} ]
																						}
																					});
																			combo.listConfig.width = 200;
																			combo
																					.suspendEvents();
																			combo
																					.setValue(strClient);
																			combo
																					.resumeEvents();
																		}
																	}
																} ]
													} ]
										});
						return clientFilterPanel;
	},
	
	setSellerToClientAutoCompleterUrl : function() {
		var me = this;
		var sellerCombo = me.down('combobox[itemId="reportCenterSellerId"]');
		var seller = sellerCombo.getValue();
		var clientautoComplter = me
				.down('combobox[itemId="reportCenterClientId"]');
		clientautoComplter.reset();
		clientautoComplter.cfgExtraParams = [{
					key : '$filtercode1',
					value : seller
				}];
	},
	createSearchBtn : function() {
		var me = this;
		var searchBtnPanel = Ext.create('Ext.toolbar.Toolbar', {
					cls : 'xn-filter-toolbar',
					margin : '15 0 0 0',
					items : ['->', {
								xtype : 'button',
								itemId : 'filterBtnId',
								text : getLabel('searchBtn', 'Search'),
								cls : 'xn-btn ux-button-s',
								listeners : {
									'click' : function(btn, e, eOpts) {
										me.handleQuickFilterChange();
									}
								}
							}, '']
				});
		return searchBtnPanel;
	},
	createSchedulingTypeFilter : function(){
		var me = this;
		var schedulingTypeFilterPanel = Ext.create('Ext.panel.Panel', {
					itemId : 'schedulingTypeFilterPanel',
					cls : 'xn-filter-toolbar',
					flex : 0.338,
					layout : {
						type : 'vbox'
					},
					items : [
							{
								xtype : 'label',
								text : getLabel( 'schedulingType', 'Type' ),
								cls : 'f13 ux_font-size14',
								padding : '0 0 6 0',
								flex : 1
							},
							{
								xtype : 'toolbar',
								itemId : 'schedulingTypeToolBar',
								cls : 'xn-toolbar-small ux_no-padding',
								filterParamName : 'repOrDwnld',
								width : '100%',
								enableOverflow : true,
								border : false,
								componentCls : 'xn-btn-default-toolbar-small xn-custom-more-toolbar',
								items :
								[
									{
										text : getLabel('all', 'All'),
										code : 'All',
										btnDesc : 'All',
										btnId : 'allSchType',
										parent : this,
										cls : 'f13 xn-custom-heighlight ux_no-padding',
										handler : function( btn, opts )
										{
											me.repOrDwnld = btn.code;
											me.repOrDwnldDesc = btn.btnDesc;
											me.changeCls(btn, 'schedulingTypeToolBar');
											me.handleQuickFilterChange();
										}
									},
									{
										text : getLabel('report', 'Report'),
										code : 'R',
										btnDesc : 'Reports',
										btnId : 'Report',
										parent : this,
										handler : function( btn, opts )
										{
											me.repOrDwnld = btn.code;
											me.repOrDwnldDesc = btn.btnDesc;
											me.changeCls(btn, 'schedulingTypeToolBar');
											me.handleQuickFilterChange();
										}
									},
									{
										text : getLabel('dwnld', 'Downloads'),
										code : 'D',
										btnDesc : 'Downloads',
										btnId : 'Dwnld',
										parent : this,
										handler : function( btn, opts )
										{
											me.repOrDwnld = btn.code;
											me.repOrDwnldDesc = btn.btnDesc;
											me.changeCls(btn, 'schedulingTypeToolBar');
											me.handleQuickFilterChange();
										}
									},
									{
										text : getLabel('upload', 'Uploads'),
										code : 'U',
										btnDesc : 'Uploads',
										btnId : 'Upld',
										parent : this,
										handler : function( btn, opts )
										{
											me.repOrDwnld = btn.code;
											me.repOrDwnldDesc = btn.btnDesc;
											me.changeCls(btn, 'schedulingTypeToolBar');
											me.handleQuickFilterChange();
										}
									},
									{
										text : getLabel( 'favorites', 'Favorites' ),
										code : 'FAVORITE',
										btnDesc : 'Favorites',
										btnId : 'favoriteType',
										parent : this,
										handler : function( btn, opts )
										{
											me.repOrDwnld = btn.code;
											me.repOrDwnldDesc = btn.btnDesc;
											me.changeCls(btn, 'schedulingTypeToolBar');
											me.handleQuickFilterChange();
										}
									}
								]
							}
						]
				});
		return schedulingTypeFilterPanel;
	},
	
	createDescriptionFilter : function() {
		var me = this;
		var descriptionFilter = Ext.create('Ext.panel.Panel', {
			itemId : 'descriptionFilterPanel',
			flex : 0.338,
			items : [{
				xtype : 'label',
				text : getLabel( 'description', 'Description' ),
				cls : 'f13 ux_font-size14',
				padding : '0 0 6 2',
				flex : 1
			}, {
				xtype : 'AutoCompleter',
				margin : '0 0 0 0',
				fieldCls : 'xn-form-text w12 xn-suggestion-box',
				itemId : 'reportDescriptionAutoCompleterId',
				cfgUrl : 'services/userseek/bankSchedulingDescSeekVWBank.json',
				cfgRecordCount : -1,
				cfgRootNode : 'd.preferences',
				cfgDataNode1 : 'DESCRIPTION',
				cfgKeyNode : 'DESCRIPTION',
				cfgQueryParamName : '$autofilter',
				listeners : {
					'select' : function(combo, record) {
						me.filterDescription = combo.getValue();
						me.handleQuickFilterChange();
					},
					'change' : function(combo, newValue, oldValue, eOpts) {
						if (Ext.isEmpty(newValue)) {
							me.filterDescription = '';
							me.handleQuickFilterChange();
						}
					}
				}
			}]
		});
		return descriptionFilter;
	},
	
	resetDescriptionUrl : function(oldValue, newValue) {
		var me = this;
		var descAutoCompleter = me.down('AutoCompleter[itemId="reportDescriptionAutoCompleterId"]');
		var bankUrl = 'services/userseek/bankSchedulingDescSeekVWBank.json';
		var bankClientUrl = 'services/userseek/bankSchedulingDescSeekVWBankClient.json';
		descAutoCompleter.cfgUrl = me.entityType === "BANK" ? bankUrl : bankClientUrl;
		if(oldValue != null && !Ext.isEmpty(oldValue.entityType) && oldValue.entityType != newValue.entityType) descAutoCompleter.reset();
	},
	
	addClientFilterToDescAutoCompleter : function (clientCode) {
		var me = this;
		var descAutoCompleter = me.down('AutoCompleter[itemId="reportDescriptionAutoCompleterId"]');
		var filtercode1index = -1;
		descAutoCompleter.cfgExtraParams.forEach(function(item, index) {
			if (item.key === '$filtercode1') filtercode1index = index;
		});
		
		if(filtercode1index !== -1) descAutoCompleter.cfgExtraParams.splice(filtercode1index, 1);
		
		if(!Ext.isEmpty(clientCode) && clientCode !== 'ALL') {
			descAutoCompleter.cfgExtraParams.push({
				key : '$filtercode1',
				value : clientCode
			});
		}
	},
	
	createStatusFilter : function() {
		var me = this;
		var statusFilterPanel = Ext.create('Ext.panel.Panel', {
					itemId : 'statusFilterPanel',
					cls : 'xn-filter-toolbar',
					flex : 0.662,
					layout : {
						type : 'vbox'
					},
			items :
						[
							{
								xtype : 'label',
								text : getLabel( 'status', 'Status' ),
								cls : 'f13 ux_font-size14',
								padding : '0 0 6 0',
								flex : 1
							},
							{
								xtype : 'toolbar',
								itemId : 'reportStatusToolBar',
								cls : 'xn-toolbar-small ux_no-padding',
								filterParamName : 'reportStatus',
								width : '100%',
								enableOverflow : true,
								border : false,
								componentCls : 'xn-btn-default-toolbar-small xn-custom-more-toolbar',
								items :
								[
									{
										text : getLabel( 'all', 'All' ),
										code : 'All',
										btnDesc : 'All',
										btnId : 'allReportStatus',
										parent : this,
										cls : 'f13 xn-custom-heighlight ux_no-padding',
										handler : function( btn, opts )
										{
											me.statusCode = btn.code;
											me.statusCodeDesc = btn.btnDesc;
											me.changeCls(btn, 'reportStatusToolBar');
											me.handleQuickFilterChange();
										}
									},
									{
										text : getLabel( 'active', 'Active' ),
										code : 'ACTIVE',
										btnDesc : 'Active',
										btnId : 'Active',
										parent : this,
										handler : function( btn, opts )
										{
											me.statusCode = btn.code;
											me.statusCodeDesc = btn.btnDesc;
											me.changeCls(btn, 'reportStatusToolBar');
											me.handleQuickFilterChange();
										}
									},
									{
										text : getLabel( 'draft', 'Draft' ),
										code : 'DRAFT',
										btnDesc : 'Draft',
										btnId : 'Draft',
										parent : this,
										handler : function( btn, opts )
										{
											me.statusCode = btn.code;
											me.statusCodeDesc = btn.btnDesc;
											me.changeCls(btn, 'reportStatusToolBar');
											me.handleQuickFilterChange();
										}
									}
								]
							}
						]
				});
		return statusFilterPanel;			
	},
	getQuickFilterJSON : function() {
		var me = this;
		var filterJson = {};
		var field = null, strValue = null;
		
		strValue =  strSeller;
		filterJson['seller'] = strValue;
		if(!isClientUser){
			field = me.down('combobox[itemId="reportCenterClientId"]');
			if(strValue != 'ALL'){
				strValue = field ? field.getValue() : '';
				filterJson['clientCode'] = strValue;
			}
			if(strValue != 'ALL'){
				strValue = field ? field.getRawValue() : '';
				filterJson['clientDesc'] = strValue;
			}
		}
		else{
			if(!Ext.isEmpty(me.clientCode) && me.clientCode != 'all')
				filterJson['clientCode'] = me.clientCode;
				filterJson['clientDesc'] = me.clientDesc;
		}
		
		filterJson['statusCode'] = (me.statusCode != 'All') ? me.statusCode : null;
		filterJson['statusCodeDesc'] = me.statusCodeDesc;
		filterJson['repOrDwnld'] = (me.repOrDwnld != 'All' && me.repOrDwnld != 'FAVORITE') ? me.repOrDwnld : null;
		filterJson['repOrDwnldDesc'] = me.repOrDwnldDesc;
		filterJson['schSrcDescription'] = me.filterDescription;
		return filterJson;
	},
	changeCls : function(btn, itemId) {
		var me = this;
		me.down('toolbar[itemId='+ itemId +']').items.each(function(
						item) {
					item.removeCls('xn-custom-heighlight');
				});
		btn.addCls('xn-custom-heighlight');
	},
	handleQuickFilterChange : function() {
		var me = this;
		me.fireEvent('quickFilterChange', me.getQuickFilterJSON());
	}
});