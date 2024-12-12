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
	statusCode : null,
	statusCodeDesc : null,
	repOrDwnld : null,
	repOrDwnldDesc : null,
	reportType : null,
	reportTypeDesc : null,
	seller : strSeller,
	clientCode : strClient,
	clientDesc : strClientDesc,
	initComponent : function() {
		var me = this;
		reportSummaryView = this;
		var arrItems = [], panel = null;
		me.on('afterrender', function(panel) {
					Ext.Ajax.request({
								url : 'services/userseek/userclients.json&$sellerCode='
										+ strSeller,
								method : "POST",
								async : false,
								success : function(response) {
									if (response && response.responseText)
										me.addDataToClientCombo(Ext.decode(response.responseText));
								},
								failure : function(response) {
									// console.log('Error Occured');
								}
							});
				});
		me.on('afterrender', function(panel) {
					var clientCombo = me.down('combo[itemId="clientCombo"]');
					// Set Default Text When Page Loads
					if(!Ext.isEmpty(me.clientDesc)){
						clientCombo.setRawValue(me.clientDesc);
					}
					else{
						clientCombo.setRawValue(strClientDesc);
					}
		});
			
		panel = me.createFilterLowerPanel();
		arrItems.push(panel);
		me.items = arrItems;
		me.callParent(arguments);
	},
	populateClientMenu : function(data) {
		var me = this;
		var clientMenu = me.down('menu[itemId="clientMenu"]');
		var clientBtn = me.down('button[itemId="clientBtn"]');
		var filterClientMenuContainer = me
				.down('container[itemId="filterClientMenuContainer"]');
		var clientArray = data.d.preferences || [];
		
		Ext.each(clientArray, function(client) {

					clientMenu.add({
								text : client.DESCR,
								code : client.CODE,
								btnDesc : client.DESCR,
								handler : function(btn, opts) {
									clientBtn.setText(btn.text);
									reportSummaryView.clientCode = btn.code;
									reportSummaryView.clientDesc = btn.btnDesc;
									reportSummaryView.handleQuickFilterChange();
								}
							});
				});
		if (null != clientArray && clientArray.length <= 1) {
			filterClientMenuContainer.hide();
		}

	},
	addDataToClientCombo:function(data){
		var me=this;
		var clientMenu=[];
		var clientCombobox=me.down('combo[itemId="clientCombo"]');
		var filterClientMenuContainer = me.down('container[itemId="filterClientMenuContainer"]');
		var clientArray = data.d.preferences || [];
		Ext.each(clientArray, function(client) {
					clientMenu.push({
								DESCR : client.DESCR,
								CODE : client.CODE
							});
				});	
		if (null != clientArray && clientArray.length <= 1) {
			filterClientMenuContainer.hide();    
		}else{
			clientCombobox.getStore().loadRawData(clientMenu);
		}
	},
	/*createFilterUpperPanel : function() {
		var me = this;
		var flex = 0;
		var fieldFI = null,  fieldClient = null, btnSearch = null, intCnt = 0;
		fieldFI = me.createFICombo();
		if(entity_type == 0)
			fieldClient = me.createClientAutocompleter();
		else
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
					items : [ btnSearch]
				});
		return parentPanel;
	},	*/
	createFilterLowerPanel : function() {
		var me = this;
		var parentPanel = Ext.create('Ext.panel.Panel', {
					layout : 'hbox',
					itemId : 'filterLowerPanel',
					items : [me.createClientCombo(),
							me.createClientAutoCompleter(),
							me.createReportDownloadFilter(),
							me.createReportDownloadTypeFilter(),
							me.createStatusFilter()]
				});
		return parentPanel;
	},
	createClientCombo:function(){
		var me=this;
		var clientStore=Ext.create('Ext.data.Store', {
					fields : ['CODE','DESCR']
				});
		var clientCombo=Ext.create('Ext.container.Container',{
			itemId:'filterClientMenuContainer',
			layout : 'vbox',
			flex:0.25,
			hidden : !isClientUser,
			items:[
				{
					xtype : 'label',
					text : getLabel("Client", "Client"),
					margin : '0 0 0 6'
				},{
					xtype : 'combo',
					padding:'0 0 0 6',
					valueField : 'CODE',
					displayField : 'DESCR',
					queryMode : 'local',
					emptyText:'Select',
					itemId:'clientCombo',
					triggerAction : 'all',
					triggerBaseCls : 'xn-form-trigger',
					editable : false,
					store : clientStore,
					listeners:{
						'select':function(combo,record){
							reportSummaryView.clientCode = combo.getValue();
							reportSummaryView.clientDesc = combo.getRawValue();
							reportSummaryView.handleQuickFilterChange();						}
						}
				}]
		});
		return clientCombo;
	},
	createClientAutoCompleter:function(){
	var me=this;	
	var clientAutoCompleterContainer=Ext.create('Ext.container.Container',{
			flex : 0.25,
			layout : 'vbox',
			itemId : 'filterClientAutoCmplterCnt',
			hidden : isClientUser,
			items : [{
					xtype : 'label',
					text : getLabel("Client", "Client"),
					margin : '0 0 0 6'
				},{
					xtype : 'AutoCompleter',
					padding:'0 0 0 6',
					cfgTplCls : 'xn-autocompleter-t7',
					fieldCls : 'xn-form-text xn-suggestion-box',
					itemId : 'reportCenterClientId',
					name : 'client',
					cfgUrl : 'services/userseek/userclients.json',
					cfgRecordCount : -1,
					cfgRootNode : 'd.preferences',
					cfgDataNode1 : 'DESCR',
					cfgDataNode2 : 'SELLER_CODE',
					cfgKeyNode : 'CODE',
					value : strClient,
					cfgQueryParamName : '$autofilter',
					cfgProxyMethodType : 'POST',
						listeners : {
							'select' : function(combo, record) {
								strClient = combo.getValue();
								strClientDesc = combo.getRawValue();
								reportSummaryView.seller = record[0].data.SELLER_CODE;
								reportSummaryView.handleQuickFilterChange();
							},
							'change' : function(combo, newValue, oldValue, eOpts) {	
								if (Ext.isEmpty(newValue)) {					
									reportSummaryView.fireEvent('handleClientChange');
								}
							},
							'render':function(combo,newValue,oldValue,eOpts){
								combo.listConfig.width = 200;
							}
						}
					}]	
		}); 
		return clientAutoCompleterContainer;
	},
	createReportDownloadFilter : function(){
		var me = this;
		var reportDownloadFilterPanel = Ext.create('Ext.container.Container', {
					itemId : 'reportDownloadFilterPanel',
					flex : 0.25,
					layout : {
						type : 'vbox'
					},
					items : [
							{
								xtype : 'label',
								text : getLabel( 'repOrDwnld', 'Report or Download' ),
								flex : 1
							},{
								xtype:"combo",
								itemId : 'repOrDwnldToolBar',
								filterParamName : 'repOrDwnld',
								editable:false,
								displayField:'text',
								emptyText:'Select',
								valueField:'code',
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
							/*{
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
							}*/
						]
				});
		return reportDownloadFilterPanel;
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
	createReportDownloadTypeFilter : function() {
		var me = this;
		var reportDownloadTypeFilterPanel = Ext.create('Ext.container.Container', {
					itemId : 'reportDownloadTypeFilterPanel',
					flex : 0.25,
					layout : {
						type : 'vbox'
					},
					items : [{
								xtype : 'label',
								text : getLabel( 'repOrDwnldTypeLbl', 'Report/Upload Type' )
							},
							{
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
							/*{
								xtype : 'toolbar',
								itemId : 'reportTypeToolBar',
								filterParamName : 'reportType',
								items :
								[{
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

							}*/
						]
						});
		return reportDownloadTypeFilterPanel;				
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
	createStatusFilter : function() {
		var me = this;
		var statusFilterPanel = Ext.create('Ext.container.Container', {
					itemId : 'statusFilterPanel',
					flex : 0.25,
					layout : {
						type : 'vbox'
					},
				items :[{
								xtype : 'label',
								text : getLabel( 'reportStatus', 'Status' )
							},{
								xtype : 'combo',
								itemId : 'reportStatusToolBar',
								filterParamName : 'reportStatus',
								editable:false,
								displayField:'text',
								valueField:'code',
								emptyText:'Select',
								triggerBaseCls : 'xn-form-trigger',
								store:me.reportStatusStore(),
								listeners:{
									'select':function(combo){
										me.statusCode = combo.getValue();
										me.statusCodeDesc = combo.getRawValue();
										me.handleQuickFilterChange();
									}
								}
							}
							/*{
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
							}*/
						]
				});
		return statusFilterPanel;			
	},
	reportStatusStore:function(){
		var dataArray=[{
			text : getLabel( 'all', 'All' ),
			code : 'All',
			btnDesc : 'All',
			btnId : 'allReportStatus'
		},{
			text : getLabel( 'active', 'Active' ),
			code : 'ACTIVE',
			btnDesc : 'Active',
			btnId : 'Active'
		},{
			text : getLabel( 'draft', 'Draft' ),
			code : 'DRAFT',
			btnDesc : 'Draft',
			btnId : 'Draft'
		}]
		
		var ObjStore=Ext.create('Ext.data.Store',{
			fields:['text','code'],
			autoLoad:true,
			data:dataArray
		});
		return ObjStore;
	},
	getQuickFilterJSON : function() {
		var me = this;
		var filterJson = {};
		var field = null, strValue = null;

		strValue =  strSeller;
		filterJson['sellerCode'] = strValue;
		if(!isClientUser){
			field = me.down('combobox[itemId="reportCenterClientId"]');
			strValue = field ? field.getValue() : '';
			filterJson['clientCode'] = strValue;
			strValue = field ? field.getRawValue() : '';
			filterJson['clientDesc'] = strValue;
		}
		else{
			if(!Ext.isEmpty(me.clientCode) && me.clientCode != 'all')
				filterJson['clientCode'] = me.clientCode;
				filterJson['clientDesc'] = me.clientDesc;
		}
		filterJson['statusCode'] = (me.statusCode != 'All') ? me.statusCode : null;
		filterJson['statusCodeDesc'] = me.statusCodeDesc;
		filterJson['repOrDwnld'] = (me.repOrDwnld != 'All') ? me.repOrDwnld : null;
		filterJson['repOrDwnldDesc'] = me.repOrDwnldDesc;
		filterJson['reportType'] = (me.reportType != 'All' && me.reportType != 'FAVORITE') ? me.reportType : null;
		filterJson['reportTypeDesc'] = me.reportTypeDesc;
		return filterJson;
	},
	/*changeCls : function(btn, itemId) {
		var me = this;
		me.down('toolbar[itemId='+ itemId +']').items.each(function(
						item) {
					item.removeCls('xn-custom-heighlight');
				});
		btn.addCls('xn-custom-heighlight');
	},*/
	handleQuickFilterChange : function() {
		var me = this;
		me.fireEvent('quickFilterChange', me.getQuickFilterJSON());
	}
});