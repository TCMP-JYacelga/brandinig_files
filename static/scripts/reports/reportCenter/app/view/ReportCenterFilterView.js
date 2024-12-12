/**
 * @class GCP.view.ReportCenterFilterView
 * @extends Ext.panel.Panel
 * @author Anil Pahane
 */
Ext.define('GCP.view.ReportCenterFilterView', {
	extend : 'Ext.panel.Panel',
	xtype : 'reportCenterFilterView',
	requires : ['Ext.menu.Menu', 'Ext.menu.DatePicker',
			'Ext.container.Container', 'Ext.toolbar.Toolbar',
			'Ext.button.Button', 'Ext.panel.Panel','Ext.ux.gcp.AutoCompleter'],
	width : '100%',
	accountSetPopup : null,
	componentCls : 'gradiant_back',
	collapsible : true,
	collapseFirst : true,
	title : getLabel('filterBy', 'Filter By :')
			+ '<label id="imgFilterInfoStdView" class="icon-company"/>',
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
	tools : [{
				xtype : 'container',
				padding : '0 9 0 0',
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
		var arrItems = [], panel = null;
		panel = me.createFilterUpperPanel();
		arrItems.push(panel);
		panel = me.createFilterLowerPanel();
		arrItems.push(panel);
		me.items = arrItems;
		me.callParent(arguments);
	},
	createFilterUpperPanel : function() {
		var me = this;
		var flex = 0;
		var fieldFI = null,  fieldClient = null, btnSearch = null, intCnt = 0;
		fieldFI = me.createFICombo();
		//fieldClient = me.createClientAutocompleter();
		fieldClient = me.createClientDropDown();
		btnSearch = me.createSearchBtn();

		intCnt += fieldFI.hidden === true ? 0 : 1;
		intCnt += fieldClient.hidden === true ? 0 : 1;
		intCnt += btnSearch.hidden === true ? 0 : 1;

		flex = parseFloat((1 / intCnt).toFixed(2));

		fieldFI.flex = fieldFI.hidden === true ? 0 : flex;
		fieldClient.flex = fieldClient.hidden === true ? 0 : flex;
		btnSearch.flex = btnSearch.hidden === true ? 0 : flex;

		var parentPanel = Ext.create('Ext.panel.Panel', {
					layout : 'hbox',
					itemId : 'filterUpperPanel',
					cls : 'ux_largepadding',
					items : [fieldFI, fieldClient, btnSearch]
				});
		return parentPanel;
	},	
	createFilterLowerPanel : function() {
		var me = this;
		var parentPanel = Ext.create('Ext.panel.Panel', {
					layout : 'hbox',
					itemId : 'filterLowerPanel',
					cls : 'ux_largepaddinglr ux_largepadding-bottom',
					width : '100%',
					items : [me.createReportDownloadFilter(),
							me.createReportDownloadTypeFilter(),
							me.createStatusFilter()]
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
				flex : 1
			}, {
				xtype : 'combobox',
				padding : '5 10 0 0',
				width : 165,
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
	createClientAutocompleter : function() {
		var me = this;
		var clientPanel = Ext.create('Ext.panel.Panel', {
			cls : 'xn-filter-toolbar',
			flex : 0.25,
			layout : {
				type : 'vbox'
			},
			items : [{
						xtype : 'label',
						text : getLabel('client', 'Client'),
						cls : 'ux_font-size14',
						flex : 1
					}, {
						xtype : 'combobox',
						padding : '6 0 0 3',
						matchFieldWidth : true,
						cls : 'autoCmplete-field',
						fieldCls : 'w14 xn-form-text xn-suggestion-box',
						labelSeparator : '',
						name : 'client',
						itemId : 'reportCenterClientId',
						cfgUrl : 'services/userseek/reportCenterBankClientSeek.json',
						cfgQueryParamName : '$autofilter',
						cfgRecordCount : -1,
						cfgSeekId : 'clientCodeSeek',
						cfgRootNode : 'd.preferences',
						cfgKeyNode : 'CODE',
						cfgDataNode1 : 'DESCR',
						cfgStoreFields:['CODE','DESCR'],
						value : strClientDesc,
						cfgProxyMethodType : 'POST',
						cfgExtraParams: [ {
									key : '$filtercode1',
									value : strSeller
								} ],
						listeners : {
							'render' : function(combo, eOpts) {
								if (!Ext.isEmpty(strClient)
										&& !Ext.isEmpty(strClientDesc)) {
									combo.store.loadRawData({
												"d" : {
													"preferences" : [{
																"CODE" : strClient,
																"DESCR" : strClientDesc
															}]
												}
											});
									combo.suspendEvents();
									combo.setValue(strClient);
									combo.resumeEvents();
								}
								me.setSellerToClientAutoCompleterUrl();
							}

						}
					}]
		});
		return clientPanel;
	},
	
	createClientDropDown : function() {
		var strSelectedClient = null;
		Ext.Ajax.request(
					{
						url : 'services/userseek/reportCenterClientSeek.json',
						method : 'POST',
						async: false,
						success : function( response )
						{
							var clientsData = Ext.decode( response.responseText );
							if( !Ext.isEmpty( clientsData ) ){
								clientsStoreData = clientsData.d.preferences;
							}
						},
						failure : function(response)
						{
							// console.log("Ajax Get data Call Failed");
						}

			});
			var objStore = Ext.create('Ext.data.Store', {
						fields : ['CODE', 'DESCR'],
						data : clientsStoreData,
						reader : {
							type : 'json'
						}
						});
			if(objStore.getCount() > 1){
				//clientsStoreData.unshift({"CODE":"","DESCR":"ALL"});
				isMultipleClientAvailable = true;
			}
		
		if(null != clientsStoreData[0].CODE && undefined != clientsStoreData[0].CODE){
			strSelectedClient = clientsStoreData[0].CODE;
		}
		
		var me = this;
		var clientPanel = Ext.create('Ext.panel.Panel', {
			cls : 'xn-filter-toolbar',
			flex : 0.25,
			layout : {
				type : 'vbox'
			},
			items : [{
						xtype : 'label',
						text : getLabel('client', 'Client'),
						cls : 'ux_font-size14',
						flex : 1
					}, {
								xtype : 'combo',
								//padding : '1 0 0 10',
								width : 120,
								cls:'ux_largepadding-left',
								displayField : 'DESCR',
								fieldCls : 'xn-form-field inline_block',
								triggerBaseCls : 'xn-form-trigger',
								itemId : 'reportCenterClientId',
								valueField : 'CODE',
								name : 'clientCode',
								//editable : false,
								store : objStore,
								value : strSelectedClient
								
							
					}]
		});
		return clientPanel;
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
	createReportDownloadFilter : function(){
		var me = this;
		var reportDownloadFilterPanel = Ext.create('Ext.panel.Panel', {
					itemId : 'reportDownloadFilterPanel',
					cls : 'xn-filter-toolbar',
					flex : 0.25,
					layout : {
						type : 'vbox'
					},
					items : [
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
											me.changeCls(btn, 'repOrDwnldToolBar');
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
											me.changeCls(btn, 'repOrDwnldToolBar');
											me.handleQuickFilterChange();
										}
									},
									{
										text : getLabel( 'downloads', 'Downloads' ),
										code : 'D',
										btnDesc : 'Dwnld',
										btnId : 'Dwnld',
										parent : this,
										handler : function( btn, opts )
										{
											me.repOrDwnld = btn.code;
											me.repOrDwnldDesc = btn.btnDesc;
											me.changeCls(btn, 'repOrDwnldToolBar');
											me.handleQuickFilterChange();
										}
									}
								]
							}
						]
				});
		return reportDownloadFilterPanel;
	},
	createReportDownloadTypeFilter : function() {
		var me = this;
		var reportDownloadTypeFilterPanel = Ext.create('Ext.panel.Panel', {
					itemId : 'reportDownloadTypeFilterPanel',
					cls : 'xn-filter-toolbar',
					flex : 0.25,
					layout : {
						type : 'vbox'
					},
					items : [
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
											me.changeCls(btn, 'reportTypeToolBar');
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
											me.changeCls(btn, 'reportTypeToolBar');
											me.handleQuickFilterChange();
										}
									},
									{
										text : getLabel( 'myReports', 'Custom' ),
										code : 'C',
										btnDesc : 'Custom',
										btnId : 'myReportsType',
										parent : this,
										handler : function( btn, opts )
										{
											me.reportType = btn.code;
											me.reportTypeDesc = btn.btnDesc;
											me.changeCls(btn, 'reportTypeToolBar');
											me.handleQuickFilterChange();
										}
									},
									{
										text : getLabel( 'favorites', 'Favorite' ),
										code : 'FAVORITE',
										btnDesc : 'Favorite',
										btnId : 'favoriteType',
										parent : this,
										handler : function( btn, opts )
										{
											me.reportType = btn.code;
											me.reportTypeDesc = btn.btnDesc;
											me.changeCls(btn, 'reportTypeToolBar');
											me.handleQuickFilterChange();
										}
									}
								]

							}
						]
						});
		return reportDownloadTypeFilterPanel;				
	},
	createStatusFilter : function() {
		var me = this;
		var statusFilterPanel = Ext.create('Ext.panel.Panel', {
					itemId : 'statusFilterPanel',
					cls : 'xn-filter-toolbar',
					flex : 0.25,
					layout : {
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

		field = me.down('combobox[itemId="reportCenterSellerId"]');
		strValue = field ? field.getValue() : '';
		filterJson['sellerCode'] = strValue;

		field = me.down('combobox[itemId="reportCenterClientId"]');
		strValue = field ? field.getValue() : '';
		filterJson['clientCode'] = strValue;
		strValue = field ? field.getRawValue() : '';
		filterJson['clientDesc'] = strValue;
		filterJson['statusCode'] = (me.statusCode != 'All') ? me.statusCode : null;
		filterJson['statusCodeDesc'] = me.statusCodeDesc;
		filterJson['repOrDwnld'] = (me.repOrDwnld != 'All') ? me.repOrDwnld : null;
		filterJson['repOrDwnldDesc'] = me.repOrDwnldDesc;
		filterJson['reportType'] = (me.reportType != 'All') ? me.reportType : null;
		filterJson['reportTypeDesc'] = me.reportTypeDesc;
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