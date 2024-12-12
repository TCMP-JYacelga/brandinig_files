/**
 * @class GCP.view.ScheduleMonitorFilterView
 * @extends Ext.panel.Panel
 * @author Naresh Mahajan
 */
Ext
		.define(
				'GCP.view.ScheduleMonitorFilterView',
				{
					extend : 'Ext.panel.Panel',
					xtype : 'scheduleMonitorFilterView',
					requires : [ 'Ext.menu.Menu', 'Ext.menu.DatePicker',
							'Ext.container.Container', 'Ext.toolbar.Toolbar',
							'Ext.button.Button', 'Ext.panel.Panel',
							'Ext.ux.gcp.AutoCompleter' ],
					width : '100%',
					accountSetPopup : null,
					componentCls : 'gradiant_back',
					collapsible : true,
					collapseFirst : true,
					title : getLabel('filterBy', 'Filter By :')
							+ '<span id="imgFilterInfoStdView" class="ux_largemargin-right"></span>',
					cls : 'xn-ribbon ux_border-bottom',
					layout : {
						type : 'vbox',
						align : 'stretch'
					},
					statusCode : null,
					statusCodeDesc : null,
					repOrDwnld : null,
					repOrDwnldDesc : null,
					scheduleTypeCode : null,
					isclientSelected : 'N',
					scheduleMode : null,
					entityType : 'BANK',
					tools : [
							{
								xtype : 'container',
								itemId : 'filterClientAutoCmplterCnt',
								cls : 'paymentqueuespacer',
								padding : '0 0 0 15',
								layout : {
									type : 'hbox'
								},
								hidden : isClientUser,
								items : [
										{
											xtype : 'combobox',
											margin : '0 0 0 10',
											width : 160,
											fieldCls : 'xn-form-field inline_block x-trigger-noedit',
											triggerBaseCls : 'xn-form-trigger',
											filterParamName : 'seller',
											editable : false,
											// autoSelect: false,
											name : 'sellerCombo',
											itemId : 'reportCenterSellerId',
											displayField : 'DESCR',
											valueField : 'CODE',
											queryMode : 'local',
											// value : strSeller,
											listeners : {
												'select' : function(combo,
														record) {
													strSeller = combo
															.getValue();
													reportSummaryView.seller = strSeller;
													var field = reportSummaryView
															.down('combobox[itemId="reportCenterClientId"]');
													field.setValue('');
													field.setRawValue('');
													reportSummaryView
															.handleQuickFilterChange();

													field.cfgExtraParams = [ {
														key : '$filtercode1',
														value : strSeller
													} ];
													reportSummaryView
															.fireEvent(
																	'refreshGroupByTabs',
																	strSeller,
																	null);
												}
											}
										}
										]

							},
							{
								xtype : 'container',
								padding : '0 9 0 0',
								layout : 'hbox',
								items : [
										{
											xtype : 'label',
											text : getLabel('preferences',
													'Preferences : '),
											cls : 'xn-account-filter-btnmenu',
											padding : '2 0 0 0'
										},
										{
											xtype : 'button',
											itemId : 'btnClearPreferences',
											disabled : true,
											text : getLabel('clearFilter',
													'Clear'),
											cls : 'xn-account-filter-btnmenu',
											textAlign : 'right',
											width : 40
										},
										{
											xtype : 'image',
											src : 'static/images/icons/icon_spacer.gif',
											height : 18
										},
										{
											xtype : 'button',
											itemId : 'btnSavePreferences',
											disabled : true,
											text : getLabel('saveFilter',
													'Save'),
											cls : 'xn-account-filter-btnmenu',
											textAlign : 'right',
											width : 30
										} ]
							} ],
					initComponent : function() {
						var me = this;
						reportSummaryView = this;
						var arrItems = [], panel = null;

						GCP.getApplication().on({
							callHandleQuickFilterChange : function() {
								reportSummaryView.handleQuickFilterChange();
							}
						});

						// panel = me.createFilterUpperPanel();
						// arrItems.push(panel);
						me
								.on(
										'afterrender',
										function(panel) {
											Ext.Ajax
													.request({
														url : 'services/userseek/adminSellersListCommon.json',
														method : "POST",
														async : false,
														success : function(
																response) {
															if (response
																	&& response.responseText)
																me
																		.populateSellerMenu(Ext
																				.decode(response.responseText));
														},
														failure : function(
																response) {
															// console.log('Error
															// Occured');
														}
													});
										});
						panel = me.createFilterLowerPanel();
						arrItems.push(panel);
						me.items = arrItems;
						me.callParent(arguments);
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
																	boxLabel : getLabel('entityTypeBank','Bank'),
																	name : 'entityType',
																	inputValue : 'BANK',
																	itemId : 'entityTypeRadio1',
																	padding : '0 0 0 5',
																	//boxLabelCls : 'ux_font-size14',
																	checked : true,
																	width : 60
																},
																{
																	margin : '0 0 0 10',
																	boxLabel : getLabel('entityTypeClient','Client'),
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
																reportSummaryView
																		.fireEvent(
																				'filterEntityType',
																				newValue.entityType,
																				null);
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
											fieldCls : 'xn-form-text w13 xn-suggestion-box',
											itemId : 'reportCenterClientId',
											name : 'client',
											cfgUrl : 'services/userseek/scheduleMonitorClientSeek.json',
											cfgRecordCount : -1,
											cfgRootNode : 'd.preferences',
											cfgDataNode1 : 'DESCR',
											cfgDataNode2 : 'SELLER_CODE',
											cfgKeyNode : 'CODE',
											value : strClient,
											cfgQueryParamName : '$autofilter',
											listeners : {
												'select' : function(combo,
														record) {
													reportSummaryView.isclientSelected = 'Y';
													strClient = combo
															.getValue();
													strClientDesc = combo
															.getRawValue();
													reportSummaryView.seller = record[0].data.SELLER_CODE;
													reportSummaryView.clientCode = strClient;
													reportSummaryView.clientDesc = strClientDesc;
													reportSummaryView.handleQuickFilterChange();
												},
												'change' : function(combo,
														newValue, oldValue,
														eOpts) {
													if (Ext.isEmpty(newValue)) {
														reportSummaryView.isclientSelected = 'N';
														reportSummaryView.clientCode = null;
														reportSummaryView.fireEvent('handleClientChange');
													}
												},
												'render' : function(combo) {
													combo.store
															.loadRawData({
																"d" : {
																	"preferences" : [ {
																		"CODE" : strClient,
																		"DESCR" : strClientDesc
																	} ]
																}
															});
													if(!Ext.isEmpty(strClient))
													{
														reportSummaryView.isclientSelected = 'Y';
													}
													combo.listConfig.width = 200;
													combo.suspendEvents();
													combo.setValue(strClient);
													combo.resumeEvents();
												}
											}
										}  ]
													} ]
										});
						return clientFilterPanel;
	},
					populateSellerMenu : function(data) {
						var me = this;
						var storeVal = null;
						if( data.d && data.d.preferences)
						{
							storeVal = data.d.preferences;
						}
						var sellerDrop = me
								.down('combobox[itemId="reportCenterSellerId"]');
						var clientAutoCompleter = me
								.down('combobox[itemId="reportCenterClientId"]');
						var sellerArray = data || [];

						var objStore = Ext.create('Ext.data.Store', {
							fields : [ 'CODE', 'DESCR' ],
							data : storeVal,
							reader : {
								type : 'json'
							}
						});
						sellerDrop.store = objStore;
						if (objStore.getCount() == 1) {
							sellerDrop.hide();
						}
						var selectedSeller = objStore.findRecord('CODE',
								strSeller);
						sellerDrop.setValue(selectedSeller);
						clientAutoCompleter.cfgExtraParams = [ {
							key : '$filtercode1',
							value : sellerDrop.getValue()
						} ];
					},
					createFilterLowerPanel : function() {
						var me = this;
						var parentPanel = Ext
								.create(
										'Ext.panel.Panel',
										{
											layout : 'hbox',
											itemId : 'filterLowerPanel',
											cls : 'ux_largepadding-left largepadding-right  ux_largepadding-bottom',
											width : '100%',
											items : [me.clientFilterPanel(),me.createSchedulingInterfaceTypeFilter(),
													me.createReportDownloadNameFilter()
															//,me.createSchedulingTypeFilter() 
													]
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
								var data = Ext.decode(response.responseText);
								var sellerData = data.filterList;
								if (!Ext.isEmpty(data)) {
									storeData = data;
								}
							},
							failure : function(response) {
								// console.log("Ajax Get data Call Failed");
							}

						});
						var objStore = Ext.create('Ext.data.Store', {
							fields : [ 'sellerCode', 'description' ],
							data : storeData,
							reader : {
								type : 'json',
								root : 'filterList'
							}
						});// check if multiple sellers are available
						if (objStore.getCount() > 1) {
							isMultipleSellerAvailable = true;
						}
						var fiComboPanel = Ext
								.create(
										'Ext.panel.Panel',
										{
											cls : 'xn-filter-toolbar',
											flex : 0.25,
											layout : {
												type : 'vbox'
											},
											hidden : !isMultipleSellerAvailable,
											items : [
													{
														xtype : 'label',
														text : getLabel(
																'financialInstitution',
																'Financial Institution'),
														cls : 'ux_font-size14',
														padding : '0 0 6 0',
														flex : 1

													},
													{
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
															'change' : function(
																	combo,
																	strNewValue,
																	strOldValue) {
																me
																		.setSellerToClientAutoCompleterUrl();
															}

														}

													} ]
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
					createSearchBtn : function() {
						var me = this;
						var searchBtnPanel = Ext.create('Ext.toolbar.Toolbar',
								{
									cls : 'xn-filter-toolbar',
									margin : '15 0 0 0',
									items : [ '->', {
										xtype : 'button',
										itemId : 'filterBtnId',
										text : getLabel('searchBtn', 'Search'),
										cls : 'xn-btn ux-button-s',
										listeners : {
											'click' : function(btn, e, eOpts) {
												me.handleQuickFilterChange();
											}
										}
									}, '' ]
								});
						return searchBtnPanel;
					},
					createSchedulingInterfaceTypeFilter : function() {
						var me = this;
						var schedulingTypeFilterPanel = Ext
								.create(
										'Ext.panel.Panel',
										{
											itemId : 'schedulingSrcTypeFilterPanel',
											cls : 'xn-filter-toolbar',
											flex : 0.33,
											layout : {
												type : 'vbox'
											},
											items : [
													{
														xtype : 'label',
														text : getLabel(
																'srcType',
																'Type'),
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
														items : [
																{
																	text : getLabel(
																			'all',
																			'All'),
																	code : 'All',
																	btnDesc : 'All',
																	btnId : 'allSchType',
																	parent : this,
																	cls : 'f13 xn-custom-heighlight ux_no-padding',
																	handler : function(
																			btn,
																			opts) {
																		me.repOrDwnld = btn.code;
																		me.repOrDwnldDesc = btn.btnDesc;
																		me
																				.changeCls(
																						btn,
																						'schedulingTypeToolBar');
																		me
																				.handleQuickFilterChange();
																	}
																},
																{
																	text : getLabel(
																			'report',
																			'Report'),
																	code : 'R',
																	btnDesc : 'Reports',
																	btnId : 'Report',
																	parent : this,
																	handler : function(
																			btn,
																			opts) {
																		me.repOrDwnld = btn.code;
																		me.repOrDwnldDesc = btn.btnDesc;
																		me
																				.changeCls(
																						btn,
																						'schedulingTypeToolBar');
																		me
																				.handleQuickFilterChange();
																	}
																},
																{
																	text : getLabel(
																			'srcType.D',
																			'Download'),
																	code : 'D',
																	btnDesc : 'Download',
																	btnId : 'Dwnld',
																	parent : this,
																	handler : function(
																			btn,
																			opts) {
																		me.repOrDwnld = btn.code;
																		me.repOrDwnldDesc = btn.btnDesc;
																		me
																				.changeCls(
																						btn,
																						'schedulingTypeToolBar');
																		me
																				.handleQuickFilterChange();
																	}
																},
																{
																	text : getLabel(
																			'srcType.U',
																			'Upload'),
																	code : 'U',
																	btnDesc : 'Upload',
																	btnId : 'Upld',
																	parent : this,
																	handler : function(
																			btn,
																			opts) {
																		me.repOrDwnld = btn.code;
																		me.repOrDwnldDesc = btn.btnDesc;
																		me
																				.changeCls(
																						btn,
																						'schedulingTypeToolBar');
																		me
																				.handleQuickFilterChange();
																	}
																},
																{
																	text : getLabel(
																			'srcType.SCH_PROFILE',
																			'Profile'),
																	code : 'SCH_PROFILE',
																	btnDesc : 'Profile',
																	btnId : 'Profile',
																	parent : this,
																	handler : function(
																			btn,
																			opts) {
																		me.repOrDwnld = btn.code;
																		me.repOrDwnldDesc = btn.btnDesc;
																		me
																				.changeCls(
																						btn,
																						'schedulingTypeToolBar');
																		me
																				.handleQuickFilterChange();
																	}
																}																]
													} ]
										});
						return schedulingTypeFilterPanel;
					},

					createReportDownloadNameFilter : function() {
						var me = this;
						var reportDownloadNameFilterPanel = Ext
								.create(
										'Ext.panel.Panel',
										{
											itemId : 'reportDownloadNameFilterPanel',
											cls : 'xn-filter-toolbar',
											flex : 0.33,
											layout : {
												type : 'vbox'
											},
											items : [
													{
														xtype : 'label',
														text : getLabel(
																'repOrDwnldNameLbl',
																'Name'),
														cls : 'ux_font-size14',
														flex : 1,
														padding : '0 0 6 0'
													},
													{
														xtype : 'AutoCompleter',
														// margin : '0 0 0 5',
														fieldCls : 'xn-form-text w13 xn-suggestion-box',
														itemId : 'reportNameId',
														name : 'reportname',
														cfgUrl : 'services/scheduleMonitor/names.json',
														cfgProxyMethodType : 'post',
														cfgRecordCount : -1,
														// cfgRootNode :
														// 'd.preferences',
														cfgDataNode1 : 'value',
														cfgDataNode2 : 'value',
														cfgKeyNode : 'value',
														cfgQueryParamName : '$autofilter',
														cfgExtraParams : [
																{
																	key : '$filtercode1',
																	value : me.repOrDwnld
																},
																{
																	key : '$sellerCode',
																	value : strSeller
																},
																{
																	key : '$filtercode2',
																	value : me.isclientSelected
																} ],
														listeners : {
															'select' : function(
																	combo,
																	record) {
																me.reportNameId = combo
																		.getValue();
																reportSummaryView
																		.handleQuickFilterChange();
															},
															'change' : function(
																	combo,
																	newValue,
																	oldValue,
																	eOpts) {
																if (Ext
																		.isEmpty(newValue)) {
																	me.reportNameId = combo
																			.getValue();
																	reportSummaryView
																			.handleQuickFilterChange();
																}
															},
															'render' : function(
																	combo) {

															}
														}
													} ]
										});
						return reportDownloadNameFilterPanel;
					},

					createSchedulingTypeFilter : function() {
						var me = this;
						var schedulingTypeFilterPanel = Ext
								.create(
										'Ext.panel.Panel',
										{
											itemId : 'schedulingTypeFilterPanel',
											cls : 'xn-filter-toolbar',
											flex : 0.33,
											layout : {
												type : 'vbox'
											},
											items : [
													{
														xtype : 'label',
														text : getLabel(
																'mode',
																'Mode'),
														cls : 'ux_font-size14',
														flex : 1
													},
													{
															xtype : 'toolbar',
															itemId : 'typeToolBar',
															cls : 'xn-toolbar-small ux_no-padding',
															width : '100%',
															enableOverflow : true,
															border : false,
															componentCls : 'xn-btn-default-toolbar-small xn-custom-more-toolbar',
															items : [
																	{
																		text : 'All',
																		code : 'ALL',
																		btnDesc : 'ALL',
																		handler : function(
																				btn,
																				opts) {
																			me.scheduleMode =  null;
																			me
																				.changeCls(
																						btn,
																						'typeToolBar');
																			me
																					.fireEvent(
																							'filterScheduleType',
																							btn,
																							opts);
																		}
																	},
																	{
																		text : 'Real Time',
																		code : 'REAL',
																		btnDesc : 'Real Time',
																		handler : function(
																				btn,
																				opts) {
																			me.scheduleMode =  'REAL';
																			me
																				.changeCls(
																						btn,
																						'typeToolBar');
																			me
																					.fireEvent(
																							'filterScheduleType',
																							btn,
																							opts);
																		}
																	},
																	{
																		text : 'Batch',
																		code : 'BATCH',
																		btnDesc : 'Batch',
																		handler : function(
																				btn,
																				opts) {
																			me.scheduleMode =  'BATCH';
																			me
																				.changeCls(
																						btn,
																						'typeToolBar');
																			me
																					.fireEvent(
																							'filterScheduleType',
																							btn,
																							opts);
																		}
																	} ]
														
													}]
										});
						return schedulingTypeFilterPanel;
					},

					getQuickFilterJSON : function() {
						var me = this;
						var filterJson = {};
						var field = null, strValue = null;
						
						strValue = strSeller;
						filterJson['seller'] = strValue;
						
							field = me
									.down('combobox[itemId="reportCenterClientId"]');
							strValue = field ? field.getValue() : '';
							if(strValue != 'ALL'){
								filterJson['clientCode'] = strValue;
							}
							strValue = field ? field.getRawValue() : '';
							if(strValue != 'ALL'){
								filterJson['clientDesc'] = strValue;
							}
							filterJson[ 'repOrDwnld' ] = ( me.repOrDwnld != 'All' ) ? me.repOrDwnld : null;
							if(!Ext.isEmpty(me.reportNameId)){
								filterJson['srcName'] = me.reportNameId;
							}
							if(!Ext.isEmpty(me.scheduleMode)){
								filterJson['scheduleMode'] = me.scheduleMode;
							}
											
						return filterJson;
					},
					changeCls : function(btn, itemId) {
						var me = this;
						me.down('toolbar[itemId=' + itemId + ']').items
								.each(function(item) {
									item.removeCls('xn-custom-heighlight');
								});
						btn.addCls('xn-custom-heighlight');
					},
					handleQuickFilterChange : function() {
						var me = this;
						var reportNameId = me.down( 'AutoCompleter[itemId="reportNameId"]' );
						var seller = strSeller;
						var reportOrDownload = ( me.repOrDwnld != 'All' ) ? me.repOrDwnld : null;
						if(!Ext.isEmpty(reportNameId))
						{
							reportNameId.cfgExtraParams = [
										   {
												key : '$filtercode1',
												value : reportOrDownload
											},
											{
												key : '$sellerCode',
												value : seller
											},
											{
												key : '$filtercode2', // Is Client Selected
												value : me.isclientSelected
											}]
						}
						me.fireEvent('quickFilterChange', me
								.getQuickFilterJSON());
					}
				});