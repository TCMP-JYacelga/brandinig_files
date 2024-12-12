Ext.define('GCP.view.FileUploadCenterFilterView', {
	extend : 'Ext.panel.Panel',
	xtype : 'fileUploadCenterFilterView',
	requires : ['Ext.menu.Menu', 'Ext.menu.DatePicker',
			'Ext.container.Container', 'Ext.toolbar.Toolbar',
			'Ext.button.Button', 'Ext.panel.Panel','Ext.ux.gcp.AutoCompleter'],
	width : '100%',
	componentCls : 'gradiant_back',
	collapsible : true,
	collapseFirst : true,
	title : getLabel('filterBy', 'Filter By :')
			+ '<span id="imgFilterInfoStdView" class="largepadding icon-information"></span>',
	cls : 'xn-ribbon ux_border-bottom',
	layout : {
		type : 'hbox'
	},
	entityType : entityType == 1 ? 'BANK_CLIENT' : 'BANK',
	tools : [
			{
		
					xtype : 'container',
					itemId : 'filterSellerCnt',
					cls : 'paymentqueuespacer',
					padding : '0 0 0 15',
					layout : {
							type : 'hbox'
					},
					hidden : false,
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
								itemId : 'fileUploadSellerId',
								displayField : 'description',
								valueField : 'sellerCode',
								queryMode : 'local',
											// value : strSeller,
									listeners : {
										'select' : function(combo,	record) {
													strSeller = combo
															.getValue();
													setAdminSeller(strSeller);
													fileUploadCenterView.seller = strSeller;
													var field = fileUploadCenterView
															.down('combobox[itemId="reportCenterClientId"]');
													field.setValue('');
													field.setRawValue('');
													fileUploadCenterView
															.handleQuickFilterChange();

													field.cfgExtraParams = [ {
														key : '$filtercode1',
														value : strSeller
													} ];
													fileUploadCenterView
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
							text : getLabel('preferences','Preferences : '),
							cls : 'xn-account-filter-btnmenu',
							padding : '2 0 0 0'
					},
					{
							xtype : 'button',
							itemId : 'btnClearPreferences',
							disabled : true,
							text : getLabel('clearFilter','Clear'),
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
							text : getLabel('saveFilter', 'Save'),
							cls : 'xn-account-filter-btnmenu',
							textAlign : 'right',
							width : 30
					} ]
		}
	],
	initComponent : function() {
		var me = this;
		fileUploadCenterView = this;
		var arrItems = [], panel = null;
		me.on('afterrender',function(panel) {
			Ext.Ajax.request({
						url : 'services/sellerList.json',
						method : "POST",
						async : false,
						success : function(response) {
							if (response&&response.responseText)
								me.populateSellerMenu(Ext.decode(response.responseText));
						},
						failure : function(response) {
							 console.log('Error Occured');
						}
					});
		});
		
		//
		//OLD CODE
		
		//
		
		panel = me.createFilterLowerPanel();
		arrItems.push(panel);
		me.items = arrItems;
		this.callParent(arguments);
	},
	savedFilterStore : function() {
		var myStore = new Ext.data.ArrayStore({
					autoLoad : true,
					fields : ['filterName'],
					proxy : {
						type : 'ajax',
						url : 'services/userfilterslist/fileUploadCenter.json',
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
	populateSellerMenu : function(data) {
		var me = this;
		
		var sellerContainer=me.down('container[itemId="filterSellerCnt"]');
		var sellerDrop = me.down('combobox[itemId="fileUploadSellerId"]');
		var clientAutoCompleter = me
				.down('combobox[itemId="fileClientCodeId"]');
		var sellerArray = data || [];

		var objStore = Ext.create('Ext.data.Store', {
			fields : [ 'sellerCode', 'description' ],
			data : data,
			reader : {
				type : 'json'
			}
		});
		sellerDrop.store = objStore;
		if (objStore.getCount() == 1) {
			sellerContainer.hide();     
		}
		sellerDrop.setValue(strSeller);
		clientAutoCompleter.cfgExtraParams = [ {
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
					items : [me.clientFilterPanel(), me.createDateFilterPanel(), me.savedFilterContainer(), me.advanceFilterContainer()]
				});
		return parentPanel;
	},
	importDateContainer : function(){
		var me = this;
		var importDateContainer = Ext.create('Ext.container.Container',{
			xtype : 'container',
			itemId : 'importDateContainer',
			layout : 'vbox',
			flex : 0.25,
			cls : 'importDateContainer',
			//width:me.entityType == 'BANK' ? '20%' : '30%',   
			items : [{
				xtype : 'panel',
				itemId : 'importDatePanel',
				layout : 'hbox',
				items : [{
							xtype : 'label',
							itemId : 'importDateLabel',
							text : getLabel('dateLatest', 'Date'),
							cls : 'f13 ux_font-size14',
							padding : '0 0 6 0'
						}, {
							xtype : 'button',
							border : 0,
							filterParamName : 'importDate',
							itemId : 'importDatePicker',
							cls : 'ui-caret',
							listeners : {
										click:function(event){
												var menus=getDateDropDownItems("importDateQuickFilter",this);
												var xy=event.getXY();
												menus.showAt(xy[0],xy[1]+16);
												event.menu=menus;
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
		return importDateContainer;
	},
	createDateFilterPanel : function() {
				var me = this;
				var dateMenuPanel = Ext.create('Ext.panel.Panel', {
					flex : 0.25,
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
							itemId : 'importDateLabel',
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
						}, {
							xtype : 'button',
							text : getLabel('goBtnText', 'Go'),
							cls : 'ux_button-background-color ux_button-padding',
							itemId : 'goBtn',
							height : 22
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
		
	/*	arrMenuItem.push({
					text : getLabel('latest', 'Latest'),
					btnId : 'btnLatest',
					parent : this,
					btnValue : '12',
					handler : function(btn, opts) {
						this.parent.fireEvent('dateChange', btn, opts);
					}
				});*/

		
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
	savedFilterContainer : function(){
		var me = this;
		var savedFiltersContainer = Ext.create('Ext.container.Container',{
			xtype : 'container',
			itemId : 'savedFiltersContainer',
			layout : 'vbox',
			flex : 0.25,
			hidden : true,
			items : [{
						xtype : 'label',
						itemId : 'savedFiltersLabel',
						text : 'Saved Filters',
						cls : 'f13 ux_font-size14',
						padding : '0 0 6 0'
					}, {
						xtype : 'combo',
						valueField : 'filterName',
						displayField : 'filterName',
						queryMode : 'local',
						editable : false,
					//	width:'200px',
						triggerAction : 'all',
						itemId : 'savedFiltersCombo',
						mode : 'local',
						triggerBaseCls : 'xn-form-trigger',
						emptyText : getLabel('selectfilter', 'Select Filter'),
						store : me.savedFilterStore(),
						listeners : {
							'select' : function(combo, record) {
								me.fireEvent("handleSavedFilterItemClick",
										combo.getValue(), combo.getRawValue());
							}
						}
					}]
		});
		return savedFiltersContainer;
	},
	advanceFilterContainer : function(){
							var me = this;
							var advanceFilterPanel = Ext.create('Ext.panel.Panel', {
										itemId : 'advFilterPanel',
										cls : 'xn-filter-toolbar',
										flex : 0.25,
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
											flex : 0.30,
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
																	boxLabel : 'Bank',
																	name : 'entityType',
																	inputValue : 'BANK',
																	itemId : 'entityTypeRadio1',
																	//padding : '0 0 0 5',
																	//boxLabelCls : 'ux_font-size14',
																	checked : true,
																	width : 70
																},
																{
																	//margin : '0 0 0 10',
																	boxLabel : 'Company Name',
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
																fileUploadCenterView
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
														itemId : 'filterClientAutoCmplterCnt',
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
															name : 'clientCode',
															//width: 140,
															fieldCls : 'xn-form-text w12 xn-suggestion-box',
															itemId : 'fileClientCodeId',
															cfgUrl : 'services/userseek/userclients.json',
															cfgQueryParamName : '$autofilter',
															cfgStoreFields:['SELLER_CODE','CODE','DESCR'],
															cfgRecordCount : -1,
															cfgSeekId : 'clientCodeSeek',
															cfgRootNode : 'd.preferences',
															cfgDataNode1 : 'DESCR',
															cfgKeyNode : 'CODE',
															cfgProxyMethodType : 'POST',
															cfgExtraParams :
																[
																	{
																		key : '$sellerCode',
																		value : strSeller
																	}
																],
															enableQueryParam:false,
															listeners : {
																'render' : function(combo) {
																	if(!Ext.isEmpty(strPreClientCode) && !Ext.isEmpty(strPrefClientDesc))
																	combo.store.loadRawData({
																				"d" : {
																					"preferences" : [{
																								"CODE" : strPreClientCode,
																								"DESCR" : strPrefClientDesc
																							}]
																				}
																			});
																	//combo.listConfig.width = 200;
																	combo.suspendEvents();
																	combo.setValue(strPreClientCode);
																	combo.resumeEvents();
																},
																'select' : function(combo, record) {
																	var clientCode = combo.getValue();
																	var clientDesc = combo.getRawValue();
																	me.fireEvent('filterClient',clientCode, clientDesc);
																},
																'change' : function(combo, newValue, oldValue, eOpts) {	
																	if (Ext.isEmpty(newValue)) {					
																		me.fireEvent('filterClient',null, null);
																	}
																}
															 }
														} ]
													} ]
										});
						return clientFilterPanel;
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