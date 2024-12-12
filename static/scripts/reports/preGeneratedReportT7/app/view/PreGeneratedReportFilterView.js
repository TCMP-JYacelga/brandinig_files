/**
 * @class GCP.view.PreGeneratedReportFilterView
 * @extends Ext.panel.Panel
 * @author Nilesh Shinde
 */

Ext.define( 'GCP.view.PreGeneratedReportFilterView',
{
	extend : 'Ext.panel.Panel',
	xtype : 'preGeneratedReportFilterViewType',
	requires :
	[
		'Ext.menu.Menu', 'Ext.menu.DatePicker', 'Ext.container.Container', 'Ext.toolbar.Toolbar', 'Ext.button.Button',
		'Ext.panel.Panel', 'Ext.ux.gcp.AutoCompleter'
	],
	accountSetPopup : null,
	layout :'hbox',
	
	statusCode : null,
	statusCodeDesc : null,
	repOrDwnld : null,
	repOrDwnldDesc : null,
	reportType : null,
	reportTypeDesc : null,
	seller : strSeller,
	clientCode : null,
	clientDesc : null,
	clientStore:null,
	reportNameFilter : null ,
	reportNameFilterDesc : null ,
	isclientSelected : 'Y',
	initComponent : function()
	{
		var me = this;
		reportSummaryView = this;
		var arrItems = [], panel = null;
		
		me.clientStore=Ext.create('Ext.data.Store', {
					fields : ['CODE','DESCR']
						});
		me.on('afterrender', function(panel) {
					Ext.Ajax.request({
								url : 'services/userseek/userclients.json',
								method : "POST",
								async : false,
								success : function(response) {
									if (response && response.responseText){
										me.addDataToClientCombo(Ext.decode(response.responseText));
									}
								},
								failure : function(response) {
									// console.log('Error Occured');
								}
							});
				});
			me.on('afterrender', function(panel) {
					var clientCombo = me.down('combo[itemId="clientCombo"]');
					// Set Default Text When Page Loads
					clientCombo.setRawValue(getLabel('allCompanies', 'All companies'));	
				});

		panel = me.createFilterLowerPanel();
		arrItems.push( panel );
		me.items = arrItems;
		me.callParent( arguments );
	},
	addDataToClientCombo:function(data){
		var me=this;
		var clientMenu=[];
		var clientCombobox=me.down('combo[itemId="clientCombo"]');
		var filterClientMenuContainer = me.down('container[itemId="filterClientMenuContainer"]');
		var clientArray = data.d.preferences || [];
		clientMenu.push({
					text : getLabel('allCompanies', 'All companies'),
					DESCR : getLabel('allCompanies', 'All companies'),
					CODE : 'all'
					
				});

		Ext.each(clientArray, function(client) {
					clientMenu.push({
								text : client.DESCR,
								CODE : client.CODE,
								DESCR : client.DESCR
							});
				});		
		if (null != clientArray && clientArray.length <= 1) {
			filterClientMenuContainer.hide();
		}else{
			clientCombobox.getStore().loadData(clientMenu);
		}
	},
	createFilterUpperPanel : function()
	{
		var me = this;
		var fieldClient = null;
		if( entity_type == 0)
			fieldClient = me.createClientAutocompleter();
		else
			fieldClient = me.createClientDropDown();

		return fieldClient;
	},
	createClientDropDown:function(){
	var me=this;
	  var clientContainer=Ext.create('Ext.container.Container',{
				flex : 1,
				layout :{
				type : 'vbox',
				width : '25%'
			},
				hidden : !isClientUser,
				itemId : 'filterClientMenuContainer',
				items : [{
							xtype : 'label',
							text : getLabel('lblcompany', 'Company Name')
						},{
							xtype : 'combo',
							valueField : 'CODE',
							displayField : 'DESCR',
							//width : 220,
							queryMode : 'local',
							itemId:'clientCombo',
							emptyText:'Select',
							triggerAction : 'all',
							triggerBaseCls : 'xn-form-trigger',
							editable : false,
							store : me.clientStore,
							listeners:{
							'select':function(combo,record){
								var code=combo.getValue();
								me.clientCode=code;
								me.clientDesc=combo.getRawValue();
								me.handleQuickFilterChange();
							}
						}
						}]
			    });
				
				return clientContainer;
	},
	createClientAutocompleter:function(){
	     var adminContainer=Ext.create('Ext.container.Container',{
				flex : 1,
				layout :{
				type : 'vbox',
				width : '25%'
			},
				hidden : isClientUser,
				itemId : 'filterClientMenuContainer',
				items : [{
							xtype : 'label',
							text : getLabel('lblcompany', 'Company Name')
						},{
				xtype : 'AutoCompleter',
				fieldCls : 'xn-form-text w12 xn-suggestion-box',
				name : 'clientCode',
				//width : 220,
				itemId : 'clientCodeId',
				cfgUrl : 'services/userseek/userclients.json',
				cfgQueryParamName : '$autofilter',
				cfgStoreFields:['SELLER_CODE','CODE','DESCR'],
				cfgRecordCount : -1,
				cfgSeekId : 'clientCodeSeek',
				cfgRootNode : 'd.preferences',
				cfgDataNode1 : 'DESCR',
				cfgKeyNode : 'CODE',
				cfgProxyMethodType : 'POST',
				enableQueryParam:false,
				listeners :
					{
						'select' : function( combo, record )
						{
							strClient = combo.getValue();
							strClientDesc = combo.getRawValue();
							reportSummaryView.seller = record[ 0 ].data.SELLER_CODE;
							reportSummaryView.fireEvent( 'refreshGroupByTabs', strClient );
							reportSummaryView.handleQuickFilterChange();
						},
						'change' : function( combo, newValue, oldValue, eOpts )
						{
							if( Ext.isEmpty( newValue ) )
							{
								reportSummaryView.fireEvent( 'handleClientChange' );
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
							combo.listConfig.width = 200;
							combo.suspendEvents();
							combo.setValue( strClient );
							combo.resumeEvents();
						}
					}
		    }]
			    });
	        return adminContainer;
	},
	createFilterLowerPanel : function()
	{
		var me = this;
		var parentPanel = Ext.create( 'Ext.panel.Panel',
		{
			xtype : 'container',
			itemId : 'filterLowerContainer',
			width : '100%',
			layout : 'vbox',
			items :
			[
					me.createFilterUpperPanel(),me.createLowerFields()
			]
		} );
		return parentPanel;
	},
	createLowerFields : function()
	{
		var me = this;
		var parentPanel = Ext.create( 'Ext.panel.Panel',
		{
			xtype : 'container',
			layout : 'hbox',
			itemId : 'filterLowerFieldsPanel',
			width : '75%',
			items :
			[
				me.createReportDownloadFilter(),
				me.createReportNameFilter(), 
				me.createDateFilterPanel()
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
		clientautoComplter.reset();
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
	createReportNameFilter : function()
	{
		var me = this ;
		var reportNameFilter = Ext.create( 'Ext.panel.Panel',
		{
			itemId : 'reportNameFilterPanel',
			cls : 'xn-filter-toolbar',
			flex : 1,
			width : '25%',
			padding : '0 25 0 0',
			layout :
			{
				type : 'vbox'
			},
			items :
			[
				 {
					 xtype: 'label',
					 text : getLabel('reportName', 'Report Name'),
					 cls : 'ux_font-size14  ux_normalpadding-bottom ux_largepadding-left'
				 },
				 {
						xtype : 'AutoCompleter',
						fieldCls : 'xn-form-text xn-suggestion-box',
						itemId : 'reportNameId',
						name : 'reportname',
						cfgUrl : 'services/PreGeneratedReport/names.json',
						cfgRecordCount : -1,
						cfgDataNode1 : 'value',
						width : '84%',
						cfgDataNode2 : 'value',
						emptyText:getLabel('reportEMPtytext','Enter Keyword or %'),
						cfgKeyNode : 'value',
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
								me.reportNameFilter = combo.getValue();
								reportSummaryView.handleQuickFilterChange();
							},
							'change' : function( combo, newValue, oldValue, eOpts )
							{
								if( Ext.isEmpty( newValue ) )
								{
									me.reportNameFilter = combo.getValue();
									reportSummaryView.handleQuickFilterChange();
								}
							},
							'render' : function( combo )
							{
								
							}
						}
				}
			]
		});
		return reportNameFilter ;
	},
	createReportDownloadFilter : function()
	{
		var me = this;
		var reportDownloadFilterPanel = Ext.create( 'Ext.panel.Panel',
		{
			xtype : 'container',
			itemId : 'reportDownloadFilterPanel',
			flex : 1,
			width : '100%',
			padding : '0 25 0 0',
			layout :
			{
				type : 'vbox'
			},
			items :
			[
				{
					xtype : 'label',
					text : getLabel( 'reportsOrdownloads', 'Reports /  Downloads' ),
					cls : 'ux_font-size14',
					flex : 1
				},{
								xtype:"combo",
								itemId : 'repOrDwnldToolBar',
								filterParamName : 'repOrDwnld',
								editable:false,
								displayField:'text',
								emptyText:'Select',
								valueField:'code',
								width : '84%',
								triggerBaseCls : 'xn-form-trigger',
								store:me.reportDownloadStore(),
								listeners:{
									'select':function(combo){
										reportSummaryView.repOrDwnld = combo.getValue();
										reportSummaryView.repOrDwnldDesc = combo.getRawValue();
										reportSummaryView.handleQuickFilterChange();
									}
								}
							}
			]
		} );
		return reportDownloadFilterPanel;
	},
	reportDownloadTypeStore:function(){
		var dataArray=[{
			text : getLabel( 'all', 'All' ),
			code : 'All',
			btnDesc : 'All',
			btnId : 'allReportType'
		},{
			text : getLabel( 'standard', 'Standard' ),
			code : 'S',
			btnDesc : 'Standard',
			btnId : 'standardType'
		},{
			text : getLabel( 'myReports', 'Custom' ),
			code : 'C',
			btnDesc : 'Custom',
			btnId : 'myReportsType'
		}];
		var objStore = Ext.create('Ext.data.Store', {
					fields : ["text", "code"],
					autoLoad:true,
					data:dataArray
				});
	return 	objStore;	
	},
	reportDownloadStore:function(){
		var dataArray=[{
			text : getLabel( 'all', 'All' ),
			code : 'All',
			btnDesc : 'All',
			btnId : 'allRepOrDwnld'
		},{
			text : getLabel( 'reports', 'Reports' ),
			code : 'R',
			btnDesc : 'Report',
			btnId : 'Report'
		},{
			text : getLabel( 'downloads', 'Downloads' ),
			code : 'D',
			btnDesc : 'Dwnld',
			btnId : 'Dwnld'
		}];
		var objStore = Ext.create('Ext.data.Store', {
					fields : ["text", "code"],
					autoLoad:true,
					data:dataArray
				});
	return 	objStore;	
	},
	createReportDownloadTypeFilter : function()
	{
		var me = this;
		var reportDownloadTypeFilterPanel = Ext.create( 'Ext.panel.Panel',
		{
			itemId : 'reportDownloadTypeFilterPanel',
			cls : 'xn-filter-toolbar',
			flex : 1,
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
				},{
								xtype : 'combo',
								itemId : 'reportTypeToolBar',
								filterParamName : 'reportType',
								emptyText:'Select',
								editable:false,
								displayField:'text',
								valueField:'code',
								triggerBaseCls : 'xn-form-trigger',
								store:me.reportDownloadTypeStore(),
								listeners:{
									'select':function(combo){
										me.reportType = combo.getValue();
										me.reportTypeDesc = combo.getRawValue();
										me.handleQuickFilterChange();
									}
								}
					}
			]
		} );
		return reportDownloadTypeFilterPanel;
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
		me.fireEvent( 'quickFilterChange');
		var reportNameId = me.down( 'AutoCompleter[itemId="reportNameId"]' );
		var clientId = null, clientIDVal = null;
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
								key : '$sellerCode',
								value : me.seller
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
	},
	createDateFilterPanel : function() {
		var me = this;
		var dateMenuPanel = Ext.create('Ext.panel.Panel', {
			//flex : 1,
			layout : 'vbox',
			width : '50%',
			padding : '0 30 0 0',
			items : [{
				xtype : 'panel',
				layout : 'hbox',
				height : 23,
				flex : 1,
				items : [{
							xtype : 'label',
							itemId : 'dateLabel',
							text : getLabel('gdateLatest', 'Generation Date'),
							//flex : 1,
							//margin : '1 0 0 0'//Top Right Bottom Left
							//padding : '6 30 0 0'  //Top Right Bottom Left
						}, {
							xtype : 'button',
							border : 0,
							filterParamName : 'EntryDate',
							itemId : 'entryDate',
							cls : 'ui-caret-dropdown',
							//margin : '1 0 0 0',//Top Right Bottom Left
							listeners : {
								click : function(event) {
									var menus = me.getDateDropDownItems(this);
									var xy = event.getXY();
									menus.showAt(xy[0], xy[1] + 16);
									event.menu = menus;
								}
							}
						}]
			}, {
				xtype : 'container',
				itemId : 'entryDateToContainer',
				layout : 'hbox',
				width : '100%',
				items : [{
					xtype : 'component',
					width : '60%',
					margin : '3 0 0 0',//Top Right Bottom Left
					itemId : 'entryDatePickerQuick',
					filterParamName : 'EntryDate',
					html : '<input type="text"  id="entryDatePickerQuickText" class="ft-datepicker from-date-range ui-datepicker-range-alignment">'
				},{
					xtype : 'component',
					margin : '4 0 0 0',
					cls : 'icon-calendar',
					html : '<span class=""><i class="fa fa-calendar"></i></span>'
				}]
			}]
		});
		return dateMenuPanel;
	},
	getDateDropDownItems : function(buttonIns) {
		var dropdownMenu = Ext.create('Ext.menu.Menu', {
			itemId : 'DateMenu',
			cls : 'ext-dropdown-menu',
			listeners : {
				hide : function(event) {
					buttonIns.addCls('ui-caret-dropdown');
					buttonIns.removeCls('action-down-hover');
				}
			},
			items : [{
						text : getLabel('latest', 'Latest'),
						btnId : 'btnLatest',
						btnValue : '12',
						parent : this,
						handler : function(btn, opts) {
							this.parent.fireEvent('dateChange', btn, opts);
						}
					}, {
						text : getLabel('today', 'Today'),
						btnId : 'btnToday',
						btnValue : '1',
						parent : this,
						handler : function(btn, opts) {
							this.parent.fireEvent('dateChange', btn, opts);
						}
					}, {
						text : getLabel('yesterday', 'Yesterday'),
						btnId : 'btnYesterday',
						btnValue : '2',
						parent : this,
						handler : function(btn, opts) {
							this.parent.fireEvent('dateChange', btn, opts);
						}
					}, {
						text : getLabel('thisweek', 'This Week'),
						btnId : 'btnThisweek',
						btnValue : '3',
						parent : this,
						handler : function(btn, opts) {
							this.parent.fireEvent('dateChange', btn, opts);
						}
					}, {
						text : getLabel('lastweektodate', 'Last Week To Date'),
						btnId : 'btnLastweek',
						btnValue : '4',
						parent : this,
						handler : function(btn, opts) {
							this.parent.fireEvent('dateChange', btn, opts);
						}
					}, {
						text : getLabel('thismonth', 'This Month'),
						btnId : 'btnThismonth',
						btnValue : '5',
						parent : this,
						handler : function(btn, opts) {
							this.parent.fireEvent('dateChange', btn, opts);
						}
					}, {
						text : getLabel('lastMonthToDate', 'Last Month To Date'),
						btnId : 'btnLastmonth',
						btnValue : '6',
						parent : this,
						handler : function(btn, opts) {
							this.parent.fireEvent('dateChange', btn, opts);
						}
					}, {
						text : getLabel('lastmonthonly', 'Last Month Only'),
						btnId : 'btnLastmonthonly',
						btnValue : '14',
						parent : this,
						handler : function(btn, opts) {
							this.parent.fireEvent('dateChange', btn, opts);
						}
					}, {
						text : getLabel('thisquarter', 'This Quarter'),
						btnId : 'btnLastMonthToDate',
						btnValue : '8',
						parent : this,
						handler : function(btn, opts) {
							this.parent.fireEvent('dateChange', btn, opts);
						}
					}, {
						text : getLabel('lastQuarterToDate',
								'Last Quarter To Date'),
						btnId : 'btnQuarterToDate',
						btnValue : '9',
						parent : this,
						handler : function(btn, opts) {
							this.parent.fireEvent('dateChange', btn, opts);
						}
					}, {
						text : getLabel('thisyear', 'This Year'),
						btnId : 'btnLastQuarterToDate',
						btnValue : '10',
						parent : this,
						handler : function(btn, opts) {
							this.parent.fireEvent('dateChange', btn, opts);
						}
					}, {
						text : getLabel('lastyeartodate', 'Last Year To Date'),
						btnId : 'btnYearToDate',
						btnValue : '11',
						parent : this,
						handler : function(btn, opts) {
							this.parent.fireEvent('dateChange', btn, opts);
						}
					}]
		});
		return dropdownMenu;
	}
} );