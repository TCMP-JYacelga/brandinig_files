/**
 * @class GCP.view.JobMonitorFilterView
 * @extends Ext.panel.Panel
 * @author Naresh Mahajan
 */
Ext
		.define(
				'GCP.view.JobMonitorFilterView',
				{
					extend : 'Ext.panel.Panel',
					xtype : 'jobMonitorFilterView',
					requires : [ 'Ext.menu.Menu', 'Ext.menu.DatePicker',
							'Ext.container.Container', 'Ext.toolbar.Toolbar',
							'Ext.button.Button', 'Ext.panel.Panel',
							'Ext.ux.gcp.AutoCompleter','Ext.form.field.VTypes' ],
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
					arrStatusFilter : [],
					comboStoreStatusFilter : null,
					jobIdCode : null,
					fileName : null,
					statusCode : null,
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
											name : 'sellerCombo',
											itemId : 'reportCenterSellerId',
											displayField : 'DESCR',
											valueField : 'CODE',
											queryMode : 'local',
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
						me.createStatusStore();
						reportSummaryView = this;
						var arrItems = [], panel = null,lowerPanel = null;
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
						panel = me.createFilterUpperPanel();
						arrItems.push(panel);
						lowerPanel = me.createFilterLowerPanel();
						arrItems.push(lowerPanel);
						me.items = arrItems;
						me.callParent(arguments);
					},
					createStatusStore : function(){
						var me = this;
						me.arrStatusFilter = [{
							'key' : '',
							'value' : getLabel('jobStatus.ALL','All')
						},{
							'key' : 'N',
							'value' : getLabel('jobStatus.N','N')
						}, {
							'key' : 'P',
							'value' : getLabel('jobStatus.P','P')
						}, {
							'key' : 'L',
							'value' : getLabel('jobStatus.L','L')
						}, {
							'key' : 'R',
							'value' : getLabel('jobStatus.R','R')
						}, {
							'key' : 'S',
							'value' : getLabel('jobStatus.S','S')
						},{
							'key' : 'C',
							'value' : getLabel('jobStatus.C','C')
						},{
							'key' : 'E',
							'value' : getLabel('jobStatus.E','E')
						},{
							'key' : 'T',
							'value' : getLabel('jobStatus.T','T')
						},{
							'key' : 'Y',
							'value' : getLabel('jobStatus.Y','Y')
						}];
						me.comboStoreStatusFilter = Ext.create( 'Ext.data.Store',{ fields :['key', 'value'],data : me.arrStatusFilter })
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
											width : '25%',
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
																	//margin : '0 0 0 5',
																	boxLabel : getLabel('entityTypeClient','Client'),
																	name : 'entityType',
																	inputValue : 'BANK_CLIENT',
																	itemId : 'entityTypeRadio2',
																	checked : false
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
											fieldCls : 'xn-form-text w12 xn-suggestion-box',
											itemId : 'reportCenterClientId',
											name : 'client',
											cfgUrl : 'services/userseek/jobMonitorClientSeek.json',
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
						var storeValue = null;
						var sellerDrop = me
								.down('combobox[itemId="reportCenterSellerId"]');
						var clientAutoCompleter = me
								.down('combobox[itemId="reportCenterClientId"]');
						var sellerArray = data || [];

						if( data.d && data.d.preferences )
						{
							storeValue = data.d.preferences;
						}
						var objStore = Ext.create('Ext.data.Store', {
							fields : [ 'CODE', 'DESCR' ],
							data : storeValue,
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
					createFilterUpperPanel : function() {
						var me = this;
						var parentPanel = Ext
								.create(
										'Ext.panel.Panel',
										{
											layout : 'hbox',
											itemId : 'filterUpperPanel',
											cls : 'ux_largepadding-left largepadding-right  ux_largepadding-bottom',
											width : '100%',
											items : [me.clientFilterPanel(),me.createSchedulingInterfaceTypeFilter(),
													me.createStatusFilter(),me.createDateFilterPanel()
															//,me.createSchedulingTypeFilter() 
													]
										});
						return parentPanel;
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
											items : [
												me.createReportDownloadNameFilter(),me.createJobIdFilter(),me.createFileNameFilter(),me.createSearchBtn()
												//me.createAdvanceFilter()
															//,me.createSchedulingTypeFilter() 
													]
										});
						return parentPanel;
					},
					createFICombo : function() {},
					createSearchBtn : function() {
						var me = this;
						var searchBtnPanel = Ext.create('Ext.toolbar.Toolbar',
								{
									cls : 'xn-filter-toolbar',
									width : '25%',
									layout : {
										type : 'vbox'
									},
									items : [ {
										xtype : 'panel',
										itemId : 'searchBtn',
										cls : 'ux_paddingtl',
										layout : {
											type : 'hbox'
										}, 
										items : [ {
										xtype : 'button',
										itemId : 'filterBtnId',
										text : getLabel('searchBtn', 'Search'),
										cls : 'ux_button-padding ux_button-background ux_button-background-color',
										listeners : {
											'click' : function(btn, e, eOpts) {
												me.handleQuickFilterChange();
											}
										}
										}]
									}]
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
											width : '25%',
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
																} ]
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
											width : '25%',
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
														fieldCls : 'xn-form-text w12 xn-suggestion-box',
														itemId : 'reportNameId',
														name : 'reportname',
														cfgUrl : 'services/jobMonitor/names.json',
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
																}
															}
														}
													}
													]
										});
						return reportDownloadNameFilterPanel;
					},
					createJobIdFilter : function() {
						var me = this;
						var jobIdFilterPanel = Ext
								.create(
										'Ext.panel.Panel',
										{
											itemId : 'jobIdFilterPanel',
											cls : 'xn-filter-toolbar',
											width : '25%',
											layout : {
												type : 'vbox'
											},
											items : [{
														xtype : 'label',
														text : getLabel(
																'jobIdLbl',
																'Job Id'),
														cls : 'ux_font-size14',
														flex : 1,
														padding : '0 0 6 0'
													},
													{
														xtype : 'AutoCompleter',
														fieldCls : 'xn-form-text w12 xn-suggestion-box',
														itemId : 'jobId',
														name : 'jobId',
														cfgUrl : 'services/userseek/jobMonitorJobIdSeek.json',
														cfgProxyMethodType : 'post',
														cfgRecordCount : -1,
														cfgRootNode : 'd.preferences',
														cfgDataNode1 : 'CODE',
														cfgDataNode2 : 'CODE',
														cfgKeyNode : 'CODE',
														cfgQueryParamName : '$autofilter',
														cfgExtraParams : [
																{
																	key : '$sellerCode',
																	value : strSeller
																}
																],
														listeners : {
															'select' : function(combo, record) {
																me.jobIdCode = combo.getValue();
															},
															'change' : function(combo, newValue, oldValue, eOpts) {
																if (Ext.isEmpty(newValue)) {
																	me.jobIdCode = combo.getValue();
																}
															}
														}
													}
													]
										});
						return jobIdFilterPanel;
					},
					createFileNameFilter : function() {
						var me = this;
						var fileNameFilterPanel = Ext
								.create(
										'Ext.panel.Panel',
										{
											itemId : 'fileNameFilterPanel',
											cls : 'xn-filter-toolbar',
											width : '25%',
											layout : {
												type : 'vbox'
											},
											items :
											[
												{
													xtype : 'container',
													layout : 'vbox',
													defaults :
													{
														labelAlign : 'top'
													},
													items :
													[
														{
															xtype : 'label',
															text : getLabel( 'fileName', 'File Name'),
															cls : 'ux_font-size14',
															flex : 1,
															padding : '0 0 6 0'
														},
														{
															xtype : 'textfield',
															itemId : 'fileNameFilterItemId',
															fieldCls : 'xn-form-text w12',
															maxLength : 255,
															labelSeparator : '',
															enforceMaxLength : true,
															enableKeyEvents : true,
															listeners :
															{
																'change' : function(combo, newValue, oldValue, eOpts) {
																		me.fileName = combo.getValue();
																}
															}
														}
													]
												}]
												});
						return fileNameFilterPanel;
					},
					
					createStatusFilter : function() {
						var me = this;
						var statusFilterPanel = Ext
								.create(
										'Ext.panel.Panel',
										{
											itemId : 'statusFilterPanel',
											cls : 'xn-filter-toolbar',
											width : '25%',
											layout : {
												type : 'vbox'
											},
											items :
											[
												{
													xtype : 'container',
													layout : 'vbox',
													width : 220,
													defaults :
													{
														labelAlign : 'top'
													},
													items :
													[
														{
															xtype : 'label',
															text : getLabel( 'status', 'Status'),
															cls : 'ux_font-size14',
															flex : 1,
															padding : '0 0 6 0'
														},
														{
															xtype : 'combobox',
															width : 160,
															displayField : 'value',
															valueField : 'key',
															labelSeparator : '',
															itemId : 'statusFilterItemId',
															editable : false,
															store : me.comboStoreStatusFilter,
															fieldCls : 'xn-form-field inline_block x-trigger-noedit',
															triggerBaseCls : 'xn-form-trigger',
															value : enableStatusRetry == 'Y' ? 'Y' : '',
															listeners : {
																'select' : function(combo, record) {
																	me.statusCode = combo.getValue();
																},
																'change' : function(combo, newValue, oldValue, eOpts) {
																	if (Ext.isEmpty(newValue)) {
																		me.statusCode = combo.getValue();
																	}
																}
															}
														}
													]
												}]
												});
						return statusFilterPanel;
					},
					
					createSchedulingTypeFilter : function() {
						var me = this;
						var schedulingTypeFilterPanel = Ext
								.create(
										'Ext.panel.Panel',
										{
											itemId : 'schedulingTypeFilterPanel',
											cls : 'xn-filter-toolbar',
											flex : 0.27,
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
					
			createDateFilterPanel : function() {
				var me = this;
				var dateMenuPanel = Ext.create('Ext.panel.Panel', {
					width : '25%',
					padding : '0 0 0 0px',
					layout : 'vbox',
					items : [
					{
						xtype : 'panel',
						flex : 0.25,
						layout : 'hbox',
						items : [
							{
							xtype : 'label',
							itemId : 'dateLabel',
							text : getLabel('dateLatest', 'Date (Latest)'),
							padding : '0 0 0 8px',
							cls : 'ux_font-size14'
								// padding : '6 0 0 5'
							}, {
							xtype : 'button',
							border : 0,
							filterParamName : 'EntryDate',
							itemId : 'entryDate',
							// cls : 'xn-custom-arrow-button cursor_pointer w1',
							cls : 'menu-disable xn-custom-arrow-button cursor_pointer',
							glyph : 'xf0d7@fontawesome',
							//padding : '6 0 0 3',
							menu : me.createDateFilterMenu()				
						}]
					},
					me.addDateContainerPanel()
					]
				});
				return dateMenuPanel;
		},
		addDateContainerPanel : function() {
					var me = this;
					var dateContainerPanel = Ext.create('Ext.panel.Panel', {
					layout : 'hbox',
					padding : '0 0 0 8',
					items : [{
						xtype : 'container',
						itemId : 'dateRangeComponent',
						layout : 'hbox',
						hidden : true,
						items : [{
							xtype : 'datefield',
							itemId : 'fromDate',  
							hideTrigger : true,
							width : 80,
							fieldCls : 'h2',
							cls : 'date-range-font-size',
							//padding : '0 3 0 0',
							editable : false,
							parent : me,
							vtype : 'daterange',
							endDateField : 'toDate',
							format : !Ext.isEmpty(strExtApplicationDateFormat)
									? strExtApplicationDateFormat
									: 'm/d/Y',							
							listeners : {
								'change' : function(field, newValue, oldValue) {
									if (!Ext.isEmpty(newValue)) {
										Ext.form.field.VTypes.daterange(
												newValue, field);
									}
								}
							}
						}, {
							xtype : 'datefield',
							itemId : 'toDate',
							hideTrigger : true,
							padding : '0 3 0 0',
							editable : false,
							width : 80,
							fieldCls : 'h2',
							cls : 'date-range-font-size',
							parent : me,
							vtype : 'daterange',
							startDateField : 'fromDate',
							format : !Ext.isEmpty(strExtApplicationDateFormat)
									? strExtApplicationDateFormat
									: 'm/d/Y',
							listeners : {
								'change' : function(field, newValue, oldValue) {
									if (!Ext.isEmpty(newValue)) {
										Ext.form.field.VTypes.daterange(
												newValue, field);
									}
								}
							}
						}]
					}, {
						xtype : 'toolbar',
						itemId : 'dateToolBar',
						cls : 'xn-toolbar-small',
						//padding : '2 0 0 1',
						items : [{
									xtype : 'label',
									itemId : 'dateFilterFrom'
									//text : dtApplicationDate
								}, {
									xtype : 'label',
									itemId : 'dateFilterTo'
								}]
					}]
				});
			return dateContainerPanel;
	},
	
	createDateFilterMenu : function() {
			var me = this;
			var menu = null;
						
			var arrMenuItem = [
				];
		
		arrMenuItem.push({
					text : getLabel('latest', 'Latest'),
					btnId : 'btnLatest',
					parent : this,
					btnValue : '12',
					handler : function(btn, opts) {
						this.parent.fireEvent('dateChange', btn, opts);
					}
				});

		
			arrMenuItem.push({
						text : getLabel('today', 'Today'),
						btnId : 'btnToday',
						btnValue : '1',
						parent : this,
						handler : function(btn, opts) {
							this.parent.fireEvent('dateChange', btn, opts);
						}
					});
		
			arrMenuItem.push({
						text : getLabel('yesterday', 'Yesterday'),
						btnId : 'btnYesterday',
						btnValue : '2',
						parent : this,
						handler : function(btn, opts) {
							this.parent.fireEvent('dateChange', btn, opts);
						}
					});
		
			arrMenuItem.push({
						text : getLabel('thisweek', 'This Week'),
						btnId : 'btnThisweek',
						btnValue : '3',
						parent : this,
						handler : function(btn, opts) {
							this.parent.fireEvent('dateChange', btn, opts);
						}
					});
		
			arrMenuItem.push({
						text : getLabel('lastweektodate', 'Last Week To Date'),
						btnId : 'btnLastweek',
						parent : this,
						btnValue : '4',
						handler : function(btn, opts) {
							this.parent.fireEvent('dateChange', btn, opts);
						}
					});
		
			arrMenuItem.push({
						text : getLabel('thismonth', 'This Month'),
						btnId : 'btnThismonth',
						parent : this,
						btnValue : '5',
						handler : function(btn, opts) {
							this.parent.fireEvent('dateChange', btn, opts);
						}
					});
		
			arrMenuItem.push({
						text : getLabel('lastMonthToDate', 'Last Month To Date'),
						btnId : 'btnLastmonth',
						btnValue : '6',
						parent : this,
						handler : function(btn, opts) {
							this.parent.fireEvent('dateChange', btn, opts);
						}
					});
		
			arrMenuItem.push({
						text : getLabel('thisquarter', 'This Quarter'),
						btnId : 'btnLastMonthToDate',
						btnValue : '8',
						parent : this,
						handler : function(btn, opts) {
							this.parent.fireEvent('dateChange', btn, opts);
						}
					});
		
			arrMenuItem.push({
						text : getLabel('lastQuarterToDate',
								'Last Quarter To Date'),
						btnId : 'btnQuarterToDate',
						btnValue : '9',
						parent : this,
						handler : function(btn, opts) {
							this.parent.fireEvent('dateChange', btn, opts);
						}
					});
		
			arrMenuItem.push({
						text : getLabel('thisyear', 'This Year'),
						btnId : 'btnLastQuarterToDate',
						btnValue : '10',
						parent : this,
						handler : function(btn, opts) {
							this.parent.fireEvent('dateChange', btn, opts);
						}
					});
		
			arrMenuItem.push({
						text : getLabel('lastyeartodate', 'Last Year To Date'),
						btnId : 'btnYearToDate',
						parent : this,
						btnValue : '11',
						handler : function(btn, opts) {
							this.parent.fireEvent('dateChange', btn, opts);
						}
					});
		arrMenuItem.push({
					text : getLabel('daterange', 'Date Range'),
					btnId : 'btnDateRange',
					parent : this,
					btnValue : '7',
					handler : function(btn, opts) {		
						var field = me.down('datefield[itemId="fromDate"]');	
						if (field)
							field.setValue('');
						field = me.down('datefield[itemId="toDate"]');
						if (field)
							field.setValue('');
						this.parent.fireEvent('dateChange', btn, opts);

					}
				});

		menu = Ext.create('Ext.menu.Menu', {
					items : arrMenuItem
				});
		return menu;
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
							if(!Ext.isEmpty(me.jobIdCode)){
								filterJson['jobId'] = me.jobIdCode;
							}
							if(!Ext.isEmpty(me.statusCode)){
								if(me.statusCode == 'Y'){
									filterJson['retryStatus'] = me.statusCode;
								}
								else{
									filterJson['status'] = me.statusCode;
								}
							}
							if(!Ext.isEmpty(me.fileName)){
								filterJson['fileName'] = me.fileName;
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
						var jobId = me.down( 'AutoCompleter[itemId="jobId"]' );
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
						if(!Ext.isEmpty(jobId))
						{
							jobId.cfgExtraParams = [
											{
												key : '$sellerCode',
												value : seller
											}]
						}
						me.fireEvent('quickFilterChange', me.getQuickFilterJSON());
					},
					createAdvanceFilter : function() {
							var me = this;
							var advanceFilterPanel = Ext.create('Ext.panel.Panel', {
										itemId : 'advFilterPanel',
										cls : 'xn-filter-toolbar',
										flex : 0.4,
										layout : {
											type : 'vbox'
										},
										items : [{
											xtype : 'panel',
											cls : 'ux_paddingtl',
											layout : {
												type : 'hbox'
											},
											items : [{
												xtype : 'label',
												text : getLabel('advFilters', 'Advanced Filters'),
												cls : 'f13 ux_font-size14'
													// hidden : isHidden('AdvanceFilter')
													// padding : '6 0 0 6'
												}, {
												xtype : 'image',
												src : 'static/images/icons/icon_spacer.gif',
												height : 18,
												// hidden : isHidden('AdvanceFilter'),
												padding : '5 0 0 9',
												cls : 'ux_hide-image'

											}, {
												xtype : 'button',
												itemId : 'newFilter',
												text : '<span class="button_underline thePointer">'
														+ getLabel('createNewFilter',
																'Create New Filter') + '</span>',
												cls : 'xn-account-filter-btnmenu xn-small-button',
												// width : 100,
												// margin : '7 0 0 0',
												margin : '0 0 0 10'
													// hidden : isHidden('AdvanceFilter')
											}]
										}, {
											xtype : 'toolbar',
											itemId : 'advFilterActionToolBar',
											cls : 'xn-toolbar-small',
											padding : '5 0 0 1',
											width : '100%',
											enableOverflow : true,
											border : false,
											items : []

										}]
									});
							return advanceFilterPanel;
						},
						highlightSavedFilter : function(strFilterCode) {
							var me = this;
							var objToolbar = me.down('toolbar[itemId="advFilterActionToolBar"]');
							if (objToolbar) {
								objToolbar.items.each(function(item) {
											item.removeCls('xn-custom-heighlight');
											if (item.itemId === strFilterCode)
												item.addCls('xn-custom-heighlight');
										});
							}
						},
						addAllSavedFilterCodeToView : function(arrFilters) {
								var me = this;
								var objToolbar = me.down('toolbar[itemId="advFilterActionToolBar"]');
								var arrTBarItems = [], item = null;
								if (objToolbar) {
									if (objToolbar.items && objToolbar.items.length > 0)
										objToolbar.removeAll();
									if (arrFilters && arrFilters.length > 0) {
										for (var i = 0; i < 2; i++) {
											if (arrFilters[i]) {
												item = Ext.create('Ext.Button', {
													cls : 'cursor_pointer xn-account-filter-btnmenu',
													text : Ext.util.Format.ellipsis(arrFilters[i], 11),
													itemId : arrFilters[i],
													tooltip : arrFilters[i],
													handler : function(btn, opts) {
														var objToolbar = me
																.down('toolbar[itemId="advFilterActionToolBar"]');
														objToolbar.items.each(function(item) {
																	item
																			.removeCls('xn-custom-heighlight');
																});
														btn.addCls('xn-custom-heighlight');
														me.fireEvent('handleSavedFilterItemClick',
																btn.itemId, btn, true);
													}
												});
												arrTBarItems.push(item);
											}
										}
										var imgItem = Ext.create('Ext.Img', {
													src : 'static/images/icons/icon_spacer.gif',
													height : 16,
													padding : '0 3 0 3',
													cls : 'ux_hide-image'
												});
										item = Ext.create('Ext.Button', {
											cls : 'cursor_pointer xn-account-filter-btnmenu xn-button-transparent',
											menuAlign : 'tr-br',
											text : getLabel('moreText', 'more') + '&nbsp;>>',
											itemId : 'AdvMoreBtn',
											// width : 48,
											padding : '2 0 0 0',
											handler : function(btn, opts) {
												// TODO: To be handled
												me.fireEvent('moreAdvancedFilterClick', btn);
											}
										});
										arrTBarItems.push(imgItem);
										arrTBarItems.push(item);
										objToolbar.removeAll();
										objToolbar.add(arrTBarItems);
									}
								}
							}
				});