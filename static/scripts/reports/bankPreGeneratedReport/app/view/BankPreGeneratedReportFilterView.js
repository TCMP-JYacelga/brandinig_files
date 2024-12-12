/**
 * @class GCP.view.BankPreGeneratedReportFilterView
 * @extends Ext.panel.Panel
 * @author Nilesh Shinde
 */

Ext.define( 'GCP.view.BankPreGeneratedReportFilterView',
{
	extend : 'Ext.panel.Panel',
	xtype : 'bankPreGeneratedReportFilterViewType',
	requires :
	[
		'Ext.menu.Menu', 'Ext.menu.DatePicker', 'Ext.container.Container', 'Ext.toolbar.Toolbar', 'Ext.button.Button',
		'Ext.panel.Panel', 'Ext.ux.gcp.AutoCompleter','Ext.form.field.Date','Ext.form.field.VTypes'
	],
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
	reportType : null,
	reportTypeDesc : null,
	seller : strSeller,
	clientCode : strClient,
	clientDesc : strClientDesc,
	reportNameId : null,
	isclientSelected : null,
	entityType : 'BANK',
	tools :
	[
		{
			xtype : 'container',
			itemId : 'filterClientAutoCmplterCnt',
			padding : '0 0 0 0',
			//cls : 'paymentqueuespacer',
			width : '89%',
			layout :
			{
				type : 'hbox'
			},
			hidden : isClientUser,
			items :
			[
				{
					xtype : 'combobox',
					margin : '0 0 0 0',
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
					//value : strSeller,
					listeners :
					{
						'select' : function( combo, record )
						{
							strSeller = combo.getValue();
							setAdminSeller(combo.getValue());
							reportSummaryView.seller = strSeller;
							var field = reportSummaryView.down( 'combobox[itemId="reportCenterClientId"]' );
							field.setValue( '' );
							field.setRawValue( '' );
							reportSummaryView.handleQuickFilterChange();

							field.cfgExtraParams =
							[
								{
									key : '$filtercode1',
									value : strSeller
								}
							];
							reportSummaryView.fireEvent( 'refreshGroupByTabs', strSeller, null );
						}
					}
				}
			]
		},
		{
			xtype : 'container',
			padding : '0 9 0 0',
			layout : 'hbox',
			hidden :true,
			items :
			[
				{
					xtype : 'label',
					text : getLabel( 'preferences', 'Preferences : ' ),
					cls : 'xn-account-filter-btnmenu',
					padding : '2 0 0 0'
				},
				{
					xtype : 'button',
					itemId : 'btnClearPreferences',
					disabled : true,
					text : getLabel( 'clearFilter', 'Clear' ),
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
					text : getLabel( 'saveFilter', 'Save' ),
					cls : 'xn-account-filter-btnmenu',
					textAlign : 'right',
					width : 30
				}
			]
		}
	],
	initComponent : function()
	{
		var me = this;
		reportSummaryView = this;
		var arrItems = [], panel = null;
		//panel = me.createFilterUpperPanel();
		//arrItems.push(panel);

		me.on( 'afterrender', function( panel )
		{
			Ext.Ajax.request(
			{
				url : 'services/userseek/adminSellersListCommon.json',
				method : "POST",
				async : false,
				success : function( response )
				{
					if( response && response.responseText )
						me.populateSellerMenu( Ext.decode( response.responseText ) );
				},
				failure : function( response )
				{
					// console.log('Error Occured');
				}
			} );
		} );

		panel = me.createFilterLowerPanel();
		arrItems.push( panel );
		me.items = arrItems;
		me.callParent( arguments );
	},
	clientFilterPanel : function(){
						var me = this;
						var clientFilterPanel =  Ext
								.create(
										'Ext.panel.Panel',
										{
											itemId : 'bankClientFilterPanel',
											cls : 'xn-filter-toolbar',
											layout : {
												type : 'vbox'
											},
											flex :  0.30,
											items : [{
												xtype : 'radio',
												boxLabel  : getLabel( 'bank', 'Bank' ),
												name      : 'entityType',
												inputValue: 'BANK',
												itemId    : 'entityTypeRadio1',
												padding : '0 0 0 4',
												hidden : (hideCompanyFilter === 'Y') ? false : true,
												width : 47,
												checked : true,
												listeners: {
													'change' : function(field, newValue, oldValue){
															me.entityType = newValue.entityType;
															if(me.entityType == 'BANK')
															{
																me.clientCode = '';
															}
															reportSummaryView.fireEvent('filterEntityType',newValue.entityType, null);
														}
												}
											},{
											xtype      : 'radiogroup',
											hidden : (hideCompanyFilter === 'Y') ? true : false,
											defaults: {
												flex: 1
											},
											layout: 'hbox',
											//margin : '0 0 0 10',
												items: [
												{
													//boxLabel  : 'Bank',
													boxLabel  : getLabel( 'bank', 'Bank' ),
													name      : 'entityType',
													inputValue: 'BANK',
													itemId    : 'entityTypeRadio1',
													padding : '0 0 0 5',
													//boxLabelCls: 'ux_font-size14',
													checked : true
												}, {
													margin : '0 0 0 10',
													boxLabel  : getLabel( 'client', 'Company Name' ),
													name      : 'entityType',
													inputValue: 'BANK_CLIENT',
													itemId     : 'entityTypeRadio2',
													checked : false,
													width : 150
													//boxLabelCls: 'ux_font-size14'
												}
											],
											listeners : {
														'change' : function(field, newValue, oldValue){
															me.entityType = newValue.entityType;
															if(me.entityType == 'BANK')
															{
																me.clientCode = '';
															}
															reportSummaryView.fireEvent('filterEntityType',newValue.entityType, null);
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
											cfgUrl : 'services/userseek/bankPreGeneratedClientSeek.json',
											cfgRecordCount : -1,
											cfgRootNode : 'd.preferences',
											cfgDataNode1 : 'DESCR',
											cfgDataNode2 : 'SELLER_CODE',
											cfgKeyNode : 'CODE',
											value : strClient,
											cfgQueryParamName : '$autofilter',
											listeners :
											{
												'select' : function( combo, record )
												{
													reportSummaryView.isclientSelected = 'Y';
													strClient = combo.getValue();
													strClientDesc = combo.getRawValue();
													reportSummaryView.seller = record[ 0 ].data.SELLER_CODE;
													reportSummaryView.clientCode = strClient;
													reportSummaryView.clientDesc = strClientDesc;
													reportSummaryView.fireEvent( 'refreshGroupByTabs', strSeller, strClient );
													reportSummaryView.handleQuickFilterChange();
												},
												'change' : function( combo, newValue, oldValue, eOpts )
												{
													if( Ext.isEmpty( newValue ) )
													{
														reportSummaryView.isclientSelected = 'N';
														reportSummaryView.clientCode = null;
														reportSummaryView.fireEvent( 'refreshGroupByTabs', strSeller, null );
														reportSummaryView.fireEvent( 'handleClientChange' );
														me.setReportNameFilterParam();
													}
												},
												'render' : function( combo )
												{
													combo.store.loadRawData(
													{
														"d" :
														{
															"preferences" :
															[
																{
																	"CODE" : strClient,
																	"DESCR" : strClientDesc
																}
															]
														}
													} );
													if(!Ext.isEmpty(strClient))
													{
														reportSummaryView.isclientSelected = 'Y';
													}
													combo.listConfig.width = 200;
													combo.suspendEvents();
													combo.setValue( strClient );
													combo.resumeEvents();
												}
											}
										}]
									}]
							});
						return clientFilterPanel;
	},
	populateSellerMenu : function( data )
	{
		var me = this;
		var storeValue = null;
		var sellerDrop = me.down( 'combobox[itemId="reportCenterSellerId"]' );
		var clientAutoCompleter = me.down( 'combobox[itemId="reportCenterClientId"]' );
		var sellerArray = data || [];

		if( data.d && data.d.preferences )
		{
			storeValue = data.d.preferences;
		}
		var objStore = Ext.create( 'Ext.data.Store',
		{
			fields :
			[
				'CODE', 'DESCR'
			],
			data : storeValue,
			reader :
			{
				type : 'json'
			}
		} );
		sellerDrop.store = objStore;
		if( objStore.getCount() == 1 )
		{
			sellerDrop.hide();
		}
		var selectedSeller = objStore.findRecord( 'CODE', strSeller );
		sellerDrop.setValue( selectedSeller );
		clientAutoCompleter.cfgExtraParams =
		[
			{
				key : '$filtercode1',
				value : sellerDrop.getValue()
			}
		];
	},

	createFilterUpperPanel : function()
	{
		var me = this;
		var flex = 0;
		var fieldFI = null, fieldClient = null, btnSearch = null, intCnt = 0;
		fieldFI = me.createFICombo();
		if( entity_type == 0 )
			fieldClient = me.createClientAutocompleter();
		else
			fieldClient = me.createClientDropDown();

		btnSearch = me.createSearchBtn();
		intCnt += fieldFI.hidden === true ? 0 : 1;
		intCnt += fieldClient.hidden === true ? 0 : 1;
		intCnt += btnSearch.hidden === true ? 0 : 1;

		flex = parseFloat( ( 1 / intCnt ).toFixed( 2 ) );

		fieldFI.flex = fieldFI.hidden === true ? 0 : flex;
		fieldClient.flex = fieldClient.hidden === true ? 0 : flex;
		btnSearch.flex = btnSearch.hidden === true ? 0 : flex;

		var parentPanel = Ext.create( 'Ext.panel.Panel',
		{
			layout : 'hbox',
			itemId : 'filterUpperPanel',
			cls : 'ux_largepadding',
			items :
			[
				btnSearch
			]
		} );
		return parentPanel;
	},
	createFilterLowerPanel : function()
	{
		var me = this;
		var parentPanel = Ext.create( 'Ext.panel.Panel',
		{
			layout : 'hbox',
			itemId : 'filterLowerPanel',
			cls : 'ux_largepaddinglr ux_largepadding-bottom',
			width : '100%',
			items :
			[
				me.clientFilterPanel(), me.createReportDownloadFilter(), me.createReportDownloadNameFilter(), me.createDateFilterPanel()
			]
		} );
		return parentPanel;
	},

	setSellerToClientAutoCompleterUrl : function()
	{
		var me = this;
		var sellerCombo = me.down( 'combobox[itemId="reportCenterSellerId"]' );
		var seller = sellerCombo.getValue();
		var clientautoComplter = me.down( 'combobox[itemId="reportCenterClientId"]' );
		//clientautoComplter.reset();
		clientautoComplter.cfgExtraParams =
		[
			{
				key : '$filtercode1',
				value : seller
			}
		];
	},
	createSearchBtn : function()
	{
		var me = this;
		var searchBtnPanel = Ext.create( 'Ext.toolbar.Toolbar',
		{
			cls : 'xn-filter-toolbar',
			margin : '15 0 0 0',
			items :
			[
				'->',
				{
					xtype : 'button',
					itemId : 'filterBtnId',
					text : getLabel( 'searchBtn', 'Search' ),
					cls : 'xn-btn ux-button-s',
					listeners :
					{
						'click' : function( btn, e, eOpts )
						{
							me.handleQuickFilterChange();
						}
					}
				}, ''
			]
		} );
		return searchBtnPanel;
	},
	createReportDownloadFilter : function()
	{
		var me = this;
		var reportDownloadFilterPanel = Ext.create( 'Ext.panel.Panel',
		{
			itemId : 'reportDownloadFilterPanel',
			cls : 'xn-filter-toolbar',
			flex : 0.25,
			layout :
			{
				type : 'vbox'
			},
			items :
			[
				{
					xtype : 'label',
					text : getLabel( 'repOrDwnld', 'Report or Upload' ),
					cls : 'ux_font-size14',
					flex : 1
				},
				{
					xtype : 'toolbar',
					itemId : 'repOrDwnldToolBar',
					cls : 'xn-toolbar-small ux_no-padding ux_smallpadding-top',
					filterParamName : 'repOrDwnld',
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
							btnId : 'allRepOrDwnld',
							parent : this,
							cls : 'f13 xn-custom-heighlight',
							handler : function( btn, opts )
							{
								me.repOrDwnld = btn.code;
								me.repOrDwnldDesc = btn.btnDesc;
								me.changeCls( btn, 'repOrDwnldToolBar' );
								me.handleQuickFilterChange();
							}
						},
						{
							text : getLabel( 'reports', 'Reports' ),
							code : 'R',
							btnDesc : 'Report',
							btnId : 'Report',
							parent : this,
							handler : function( btn, opts )
							{
								me.repOrDwnld = btn.code;
								me.repOrDwnldDesc = btn.btnDesc;
								me.changeCls( btn, 'repOrDwnldToolBar' );
								me.handleQuickFilterChange();
							}
						},
						{
							text : getLabel( 'downloads', 'Downloads' ),
							code : 'D',
							btnDesc : 'Downloads',
							btnId : 'Dwnld',
							parent : this,
							handler : function( btn, opts )
							{
								me.repOrDwnld = btn.code;
								me.repOrDwnldDesc = btn.btnDesc;
								me.changeCls( btn, 'repOrDwnldToolBar' );
								me.handleQuickFilterChange();
							}
						}
					]
				}
			]
		} );
		return reportDownloadFilterPanel;
	},
	createReportDownloadTypeFilter : function()
	{
		var me = this;
		var reportDownloadTypeFilterPanel = Ext.create( 'Ext.panel.Panel',
		{
			itemId : 'reportDownloadTypeFilterPanel',
			cls : 'xn-filter-toolbar',
			flex : 0.25,
			layout :
			{
				type : 'vbox'
			},
			items :
			[
				{
					xtype : 'label',
					text : getLabel( 'repOrDwnldTypeLbl', 'Report/Upload Type' ),
					cls : 'ux_font-size14',
					flex : 1
				},
				{
					xtype : 'toolbar',
					itemId : 'reportTypeToolBar',
					cls : 'xn-toolbar-small ux_no-padding ux_smallpadding-top',
					filterParamName : 'reportType',
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
							btnId : 'allReportType',
							parent : this,
							cls : 'f13 xn-custom-heighlight',
							handler : function( btn, opts )
							{
								me.reportType = btn.code;
								me.reportTypeDesc = btn.btnDesc;
								me.changeCls( btn, 'reportTypeToolBar' );
								me.handleQuickFilterChange();
							}
						},
						{
							text : getLabel( 'standard', 'Standard' ),
							code : 'S',
							btnDesc : 'Standard',
							btnId : 'standardType',
							parent : this,
							handler : function( btn, opts )
							{
								me.reportType = btn.code;
								me.reportTypeDesc = btn.btnDesc;
								me.changeCls( btn, 'reportTypeToolBar' );
								me.handleQuickFilterChange();
							}
						},
						{
							text : getLabel( 'myReports', 'Custom' ),
							code : 'C',
							btnDesc : 'Custom',
							btnId : 'myReportsType',
							parent : this,
							hidden : !customReportFeatureFlag,
							handler : function( btn, opts )
							{
								me.reportType = btn.code;
								me.reportTypeDesc = btn.btnDesc;
								me.changeCls( btn, 'reportTypeToolBar' );
								me.handleQuickFilterChange();
							}
						}
					]
				}
			]
		} );
		return reportDownloadTypeFilterPanel;
	},
	createReportDownloadNameFilter : function()
	{
		var me = this;
		var reportDownloadNameFilterPanel = Ext.create( 'Ext.panel.Panel',
		{
			itemId : 'reportDownloadNameFilterPanel',
			cls : 'xn-filter-toolbar',
			flex : 0.25,
			layout :
			{
				type : 'vbox'
			},
			items :
			[
				{
					xtype : 'label',
					text : getLabel( 'repOrDwnldNameLbl', 'Name' ),
					cls : 'ux_font-size14',
					flex : 1
				},
				{
					xtype : 'AutoCompleter',
					//margin : '0 0 0 5',
					fieldCls : 'xn-form-text w13 xn-suggestion-box',
					itemId : 'reportNameId',
					name : 'reportname',
					cfgUrl : 'services/PreGeneratedReport/names.json',
					cfgRecordCount : -1,
					//cfgRootNode : 'd.preferences',
					cfgDataNode1 : 'value',
					cfgDataNode2 : 'value',
					cfgKeyNode : 'value',
					value : strClient,
					cfgQueryParamName : '$autofilter',
					cfgExtraParams : [
						   {
								key : '$filtercode1',
								value : me.repOrDwnld
							},
							{
								key : '$sellerCode',
								value : me.seller
							},
							{
								key : '$filtercode2',
								value : me.isclientSelected
							},
							{
								key : '$filtercode3',
								value : ''
							}],
					listeners :
					{
						'select' : function( combo, record )
						{
							me.reportNameId = combo.getValue();
							reportSummaryView.handleQuickFilterChange();
						},
						'change' : function( combo, newValue, oldValue, eOpts )
						{
							if( Ext.isEmpty( newValue ) )
							{
								me.reportNameId = combo.getValue();
								reportSummaryView.handleQuickFilterChange();
							}
						},
						'render' : function( combo )
						{
							
						}
					}
				}
			]
		} );
		return reportDownloadNameFilterPanel;
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
					itemId : 'dateLabel',
					text : getLabel('today', 'Today'),
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
		
		/*arrMenuItem.push({
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
	
	createStatusFilter : function()
	{
		var me = this;
		var statusFilterPanel = Ext.create( 'Ext.panel.Panel',
		{
			itemId : 'statusFilterPanel',
			cls : 'xn-filter-toolbar',
			flex : 0.25,
			layout :
			{
				type : 'vbox'
			},
			items :
			[
				{
					xtype : 'label',
					text : getLabel( 'reportStatus', 'Status' ),
					cls : 'ux_font-size14',
					flex : 1
				},
				{
					xtype : 'toolbar',
					itemId : 'reportStatusToolBar',
					cls : 'xn-toolbar-small ux_no-padding ux_smallpadding-top',
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
							cls : 'f13 xn-custom-heighlight',
							handler : function( btn, opts )
							{
								me.statusCode = btn.code;
								me.statusCodeDesc = btn.btnDesc;
								me.changeCls( btn, 'reportStatusToolBar' );
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
								me.changeCls( btn, 'reportStatusToolBar' );
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
								me.changeCls( btn, 'reportStatusToolBar' );
								me.handleQuickFilterChange();
							}
						}
					]
				}
			]
		} );
		return statusFilterPanel;
	},
	getQuickFilterJSON : function()
	{
		var me = this;
		var filterJson = {};
		var field = null, strValue = null;

		strValue = strSeller;
		filterJson[ 'sellerCode' ] = strValue;
		if( !isClientUser )
		{
			field = me.down( 'combobox[itemId="reportCenterClientId"]' );
			strValue = field ? field.getValue() : '';
			if(strValue != 'ALL'){
				filterJson[ 'clientCode' ] = strValue;
			}
			strValue = field ? field.getRawValue() : '';
			if(strValue != 'ALL'){
				filterJson[ 'clientDesc' ] = strValue;
			}
		}
		else
		{
			if( !Ext.isEmpty( me.clientCode ) && me.clientCode != 'all' )
				filterJson[ 'clientCode' ] = me.clientCode;
			filterJson[ 'clientDesc' ] = me.clientDesc;
		}
		
		filterJson[ 'statusCode' ] = ( me.statusCode != 'All' ) ? me.statusCode : null;
		filterJson[ 'statusCodeDesc' ] = me.statusCodeDesc;
		filterJson[ 'repOrDwnld' ] = ( me.repOrDwnld != 'All' ) ? me.repOrDwnld : null;
		filterJson[ 'repOrDwnldDesc' ] = me.repOrDwnldDesc;
		filterJson[ 'reportType' ] = ( me.reportType != 'All' && me.reportType != 'FAVORITE' ) ? me.reportType : null;
		filterJson[ 'reportTypeDesc' ] = me.reportTypeDesc;
		filterJson[ 'reportNameId' ] = ( me.reportNameId != 'All' ) ? me.reportNameId : null;
		return filterJson;
	},
	changeCls : function( btn, itemId )
	{
		var me = this;
		me.down( 'toolbar[itemId=' + itemId + ']' ).items.each( function( item )
		{
			item.removeCls( 'xn-custom-heighlight' );
		} );
		btn.addCls( 'xn-custom-heighlight' );
	},
	handleQuickFilterChange : function()
	{
		var me = this;
		me.fireEvent( 'quickFilterChange', me.getQuickFilterJSON() );
		me.setReportNameFilterParam();
	},
	setReportNameFilterParam : function()
	{
		var me = this;
		var reportNameId = me.down( 'AutoCompleter[itemId="reportNameId"]' );
		var clientId = null, clientIDVal = null;
		var sellerCombo = me.down( 'combobox[itemId="reportCenterSellerId"]' );
		var seller = sellerCombo.getValue();
		clientId = me.down( 'combobox[itemId="reportCenterClientId"]' );
		clientIDVal = clientId ? clientId.getValue() : '';
		if(!Ext.isEmpty(reportNameId))
		{
			reportNameId.cfgExtraParams = [
						   {
								key : '$filtercode1',
								value : me.repOrDwnld
							},
							{
								key : '$filtercode2',
								value : me.isclientSelected
							},
							{
								key : '$filtercode3', 
								value : clientIDVal
							}]
		}
	}
} );
