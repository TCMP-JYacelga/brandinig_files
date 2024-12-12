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
	accountSetPopup : null,
	//componentCls : 'gradiant_back',
	//collapsible : true,
	//collapseFirst : true,
	layout :'hbox',
	statusCode : null,
	statusCodeDesc : null,
	repOrDwnld : null,
	repOrDwnldDesc : null,
	reportType : null,
	reportTypeDesc : null,
	seller : strSeller,
	clientCode : 'all',
	clientDesc : strClientDesc,
	clientStore : null,
	initComponent : function()
	{
		var me = this;
		reportSummaryView = this;
		var arrItems = [], panel = null;
		clientStore = me.getClientStore();
		panel = me.createFilterLowerPanel();
		arrItems.push( panel );
		me.items = arrItems;
		me.callParent( arguments );
	},
	createFilterUpperPanel : function()
	{
		var me = this;
		var clientPanel = Ext.create( 'Ext.panel.Panel',
		{
			xtype : 'container',
			layout : 'vbox',
			hidden : ((clientStore.getCount() <= 2) || !isClientUser()) ? true : false,//If count is one or admin then hide
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
						emptyText : getLabel('allCompanies', 'All Companies'),
						store : clientStore,
						listeners : {
							'select' : function(combo, record) {
								selectedFilterClientDesc = combo.getRawValue();
								selectedFilterClient = combo.getValue();
								selectedClientDesc = combo.getRawValue();
								$('#msClient').val(selectedFilterClient);
								changeClientAndRefreshGrid(combo.getValue(), combo.getRawValue());
							},
							boxready : function(combo, width, height, eOpts)
							{
								if( combo.getValue() == null || combo.getValue() == "" )
								{
								combo.setValue(combo.getStore().getAt(0));
								}
							}
						}
					}]
				});
				return clientPanel;
			},
	createFilterLowerPanel : function()
	{
		var me = this;
		var parentPanel = Ext.create( 'Ext.panel.Panel',
		{
			layout : 'vbox',
			itemId : 'filterLowerPanel',
			cls : 'ux_largepaddinglr ux_largepadding-bottom',
			width : '100%',
			items :
			[
				me.createFilterUpperPanel(),me.createLowerPanelFields()
			]
		} );
		return parentPanel;
	},
	createLowerPanelFields : function()
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
				me.createReportDownloadFilter(), me.createReportDownloadTypeFilter()
			]
		} );
		return parentPanel;
	},
	createReportDownloadFilter : function()
	{
		var me = this;
		var reportDownloadFilterPanel = Ext.create( 'Ext.panel.Panel',
		{
			itemId : 'reportDownloadFilterPanel',
			cls : 'xn-filter-toolbar',
			padding: '0 30 0 0',
			width : '25%',
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
				},{
						xtype:"combo",
						itemId : 'repOrDwnldToolBar',
						filterParamName : 'repOrDwnld',
						editable:false,
						displayField:'text',
						emptyText:'Select',
						valueField:'code',					
						width : '100%',
						padding : '-4 0 0 0',
						store:me.reportDownloadStore(),
						listeners:{
							'select':function(combo){
								reportSummaryView.repOrDwnld = combo.getValue();
								reportSummaryView.repOrDwnldDesc = combo.getRawValue();
								reportSummaryView.handleQuickFilterChange();
							},
							'change':function(combo){
								reportSummaryView.repOrDwnld = combo.getValue();
								reportSummaryView.repOrDwnldDesc = combo.getRawValue();
								//reportSummaryView.handleQuickFilterChange();
							},
							boxready : function(combo, width, height, eOpts)
							{
								if( combo.getValue() == null || combo.getValue() == "" )
								{
									combo.setValue(combo.getStore().getAt(0));
								}
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
		},{
			text : getLabel( 'favorites', 'Favorite' ),
			code : 'FAVORITE',
			btnDesc : 'Favorite',
			btnId : 'favoriteType'
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
			width : '25%',
			//flex : 1,
			padding: '0 30 0 0',
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
								width : '100%',
								padding : '-4 0 0 0',
								store:me.reportDownloadTypeStore(),
								listeners:{
									'select':function(combo){
										me.reportType = combo.getValue();
										me.reportTypeDesc = combo.getRawValue();
										me.handleQuickFilterChange();
									},
									'change':function(combo){
										me.reportType = combo.getValue();
										me.reportTypeDesc = combo.getRawValue();
										//me.handleQuickFilterChange();
									},
									boxready : function(combo, width, height, eOpts)
									{
										if( combo.getValue() == null || combo.getValue() == "" )
										{
											combo.setValue(combo.getStore().getAt(0));
										}
									}
								}
					}
			]
		} );
		return reportDownloadTypeFilterPanel;
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
			field = me.down( 'combobox[itemId="clientCombo"]' );
			strValue = field ? field.getValue() : '';
			filterJson[ 'clientCode' ] = strValue;
			strValue = field ? field.getRawValue() : '';
			filterJson[ 'clientDesc' ] = strValue;
		}
		else
		{
			if( !Ext.isEmpty( me.clientCode ) && me.clientCode != 'all' )
			{
				filterJson[ 'clientCode' ] = me.clientCode;
			filterJson[ 'clientDesc' ] = me.clientDesc;
			}
		}
		filterJson[ 'statusCode' ] = ( me.statusCode != 'All' && me.statusCode != 'all' ) ? me.statusCode : null;
		filterJson[ 'statusCodeDesc' ] = me.statusCodeDesc;
		filterJson[ 'repOrDwnld' ] = ( me.repOrDwnld != 'All' && me.repOrDwnld != 'all') ? me.repOrDwnld : null;
		filterJson[ 'repOrDwnldDesc' ] = me.repOrDwnldDesc;
		filterJson[ 'reportType' ] = ( me.reportType != 'All' && me.reportType != 'all') ? me.reportType : null;
		filterJson[ 'reportTypeDesc' ] = me.reportTypeDesc;
		return filterJson;
	},
	handleQuickFilterChange : function()
	{
		var me = this;
		me.fireEvent( 'quickFilterChange', me.getQuickFilterJSON() );
	},
	getClientStore:function(){
		var clientData=null;
		var objClientStore=null;
		Ext.Ajax.request({
			url : 'services/userseek/userclients.json',
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
														CODE : 'all',
														DESCR : getLabel('allCompanies', 'All Companies')
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
	}
	
});