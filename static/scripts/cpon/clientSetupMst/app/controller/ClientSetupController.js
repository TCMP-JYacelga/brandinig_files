Ext.define('GCP.controller.ClientSetupController', {
	extend : 'Ext.app.Controller',
	requires : ['Ext.ux.gcp.PreferencesHandler'],
	views : ['GCP.view.ClientSetupView', 'GCP.view.ClientSetupGridView','GCP.view.HistoryPopup'],
	/**
	 * Array of configs to build up references to views on page.
	 */
	refs : [{
				ref : 'clientSetupView',
				selector : 'clientSetupView'
			}, {
				ref : 'createNewToolBar',
				selector : 'clientSetupView clientSetupGridView toolbar[itemId="btnCreateNewToolBar"]'
			},{
				ref : 'specificFilterPanel',
				selector : 'clientSetupView clientSetupFilterView container[itemId="specificFilter"]'
			},{
				ref : 'statusFilterPanel',
				selector : 'clientSetupView clientSetupFilterView panel[itemId="statusFilterPanel"]'
			},{
				ref : 'buttonFilterPanel',
				selector : 'clientSetupView clientSetupFilterView panel[itemId="buttonFilter"]'
			},{
				ref : 'clientSetupGridView',
				selector : 'clientSetupView clientSetupGridView'
			}, {
				ref : 'clientSetupDtlView',
				selector : 'clientSetupView clientSetupGridView panel[itemId="clientSetupDtlView"]'
			}, {
				ref : 'gridHeader',
				selector : 'clientSetupView clientSetupGridView panel[itemId="clientSetupDtlView"] container[itemId="gridHeader"]'
			}, {
				ref : 'clientSetupGrid',
				selector : 'clientSetupView clientSetupGridView grid[itemId="gridViewMstId"]'
			},{
				ref : 'searchTextInput',
				selector : 'clientSetupGridView textfield[itemId="searchTextField"]'
			}, {
				ref : 'matchCriteria',
				selector : 'clientSetupGridView radiogroup[itemId="matchCriteria"]'
			},{
				ref : 'grid',
				selector : 'clientSetupGridView smartgrid'
			},{
				ref : "corporationFilter",
				selector : 'clientSetupView clientSetupFilterView textfield[itemId="corporationFilter"]'
			},{
				ref : "clientFilter",
				selector : 'clientSetupView clientSetupFilterView textfield[itemId="clientFilter"]'
			},{
				ref : "statusFilter",
				selector : 'clientSetupView clientSetupFilterView combobox[itemId="statusFilter"]'
			}, {
				ref : 'groupActionBar',
				selector : 'clientSetupView clientSetupGridView clientGroupActionBarView'
			},{
				ref : 'brandingPkgListLink',
				selector : 'clientSetupView toolbar[itemId="btnActionToolBar"] button[itemId="btnBrandingPkgList"]'
			},{
				ref : 'clientListLink',
				selector : 'clientSetupView toolbar[itemId="btnActionToolBar"] button[itemId="btnClientList"]'
			},
			{
				ref : 'screenTitleLabel',
				selector : 'clientSetupView clientSetupTitleView label[itemId="pageTitle"]'
			},
			{
				ref : "clientMciCodeFilter",
				selector : 'clientSetupView clientSetupFilterView textfield[itemId="clientMciCodeFilter"]'
			}],
	config : {
		selectedMst : 'client',
		clientListCount : 0,
		brandingPkgListCount : 0,
		filterData : [],
		preferenceHandler : null,
		firstLoad : false
	},
	/**
	 * A template method that is called when your application boots. It is
	 * called before the Application's launch function is executed so gives a
	 * hook point to run any code before your Viewport is created.
	 */
	init : function() {
		var me = this;
		me.firstLoad = true;
		if(objSaveLocalStoragePref){
			me.objLocalData = Ext.decode(objSaveLocalStoragePref);
			objQuickPref = me.objLocalData && me.objLocalData.d.preferences
								&& me.objLocalData.d.preferences.tempPref 
								&& me.objLocalData.d.preferences.tempPref.quickFilterJson ? me.objLocalData.d.preferences.tempPref.quickFilterJson : {};
			
			me.filterData = (!Ext.isEmpty(objQuickPref)) ? objQuickPref : [];
		
		}
		
		me.control({
			'clientSetupView clientSetupGridView toolbar[itemId="btnCreateNewToolBar"] button[itemId="btnCreateClient"]' : {
				click : function() {
					me.handleClientEntryAction(true);
				}
			},
			'clientSetupView clientSetupGridView toolbar[itemId="btnCreateNewToolBar"] button[itemId="btnCreateBrandingPkg"]' : {
				click : function() {
					me.handleClientEntryAction(false);
				}
			},
			'clientSetupView clientSetupFilterView' : {
				render : function() {
					if(!Ext.isEmpty(modelSelectedMst))
						me.selectedMst = modelSelectedMst;
					me.setInfoTooltip();
					me.handleSpecificFilter();
				}
			},
			'clientSetupView clientSetupFilterView button[itemId="btnFilter"]' : {
				click : function(btn, opts) {
					me.setDataForFilter();
					if(allowLocalPreference === 'Y')
					me.handleSaveLocalStorage();
					me.applyFilter();
				}
			},
			'clientSetupView clientSetupGridView panel[itemId="clientSetupDtlView"]' : {
				render : function() {
					if(!Ext.isEmpty(modelSelectedMst))
						me.selectedMst = modelSelectedMst;
					me.handleGridHeader();
					
				}
			},
			'clientSetupView toolbar[itemId="btnActionToolBar"] button[itemId="btnBrandingPkgList"]' : {
				click : function() {
					me.filterData = [];
					me.showBrandingPkgList();
					me.handleSpecificFilter();
					me.handleGridHeader();
				}
			},
			'clientSetupView toolbar[itemId="btnActionToolBar"] button[itemId="btnClientList"]' : {
				click : function() {
					me.filterData = [];
					me.showClientList();
					me.handleSpecificFilter();
					me.handleGridHeader();
				}
			},

			'clientSetupGridView' : {
				render : function(panel) {
					me.handleSmartGridConfig();
				}
			},
			'clientSetupGridView textfield[itemId="searchTextField"]' : {
				change : function(btn, opts) {
					me.searchOnPage();
				}
			},
			'clientSetupGridView radiogroup[itemId="matchCriteria"]' : {
				change : function(btn, opts) {
					me.searchOnPage();
				}
			},
			'clientSetupGridView smartgrid' : {
				render : function(grid) {
					me.handleLoadGridData(grid, grid.store.dataUrl,
							grid.pageSize, 1, 1, null);
				},
				gridPageChange : me.handleLoadGridData,
				gridSortChange : me.handleLoadGridData,
				gridRowSelectionChange : function(grid, record, recordIndex,
						records, jsonData) {
					me.enableValidActionsForGrid(grid, record, recordIndex,
							records, jsonData);
				}
			},
			'clientSetupGridView toolbar[itemId=clientGroupActionBarView_clientDtl]' : {
				performGroupAction : function(btn, opts) {
					me.handleGroupActions(btn);
				}
			}

		});
	},
	
	handleSpecificFilter : function() {
		var me = this;
		me.getSearchTextInput().setValue('');
		var storeData;
		var corporationTextfield = Ext.create('Ext.ux.gcp.AutoCompleter', {
					fieldCls : 'xn-form-text w165 xn-suggestion-box ux_font-size14-normal',
					cls:'ux_font-size14-normal',
					name : 'corporationName',
					itemId : 'corporationFilter',
					cfgUrl : 'cpon/cponseek/{0}.json',
					cfgProxyMethodType : 'POST',
					cfgQueryParamName : 'qfilter',
					cfgRecordCount : -1,
					cfgSeekId : 'corporationSeek',
					enableQueryParam:false,
					cfgRootNode : 'd.filter',
					cfgDataNode1 : 'name'
				});
		
		var clientTextfield = Ext.create('Ext.ux.gcp.AutoCompleter', {
					fieldCls : 'xn-form-text w165 xn-suggestion-box ux_font-size14-normal',
					cls:'ux_font-size14-normal',
					name : 'clientName',
					itemId : 'clientFilter',
					cfgUrl : 'cpon/cponseek/{0}.json',
					cfgProxyMethodType : 'POST',
					cfgQueryParamName : 'qfilter',
					cfgRecordCount : -1,
					cfgSeekId : 'clientSeek',
					enableQueryParam:false,
					cfgRootNode : 'd.filter',
					cfgDataNode1 : 'name'
				});
		
		var objMCICode = Ext.create('Ext.ux.gcp.AutoCompleter', {
			fieldCls : 'xn-form-text w165 xn-suggestion-box ux_font-size14-normal',
			cls:'ux_font-size14-normal',
			name : 'clientShortCode',
			itemId : 'clientMciCodeFilter',
			cfgUrl : 'cpon/cponseek/{0}.json',
			cfgProxyMethodType : 'POST',
			cfgQueryParamName : 'qfilter',
			cfgRecordCount : -1,
			cfgSeekId : 'clientMCICodeSeek',
			cfgRootNode : 'd.filter',
			cfgDataNode1 : 'name'
		});
		
		var brandingPkgNameTextfield = Ext.create('Ext.ux.gcp.AutoCompleter', {
					fieldCls : 'xn-form-text w165 xn-suggestion-box ux_font-size14-normal',
					cls:'ux_font-size14-normal',
					name : 'brandingPkgName',
					itemId : 'corporationFilter',
					cfgUrl : 'cpon/cponseek/{0}.json',
					cfgProxyMethodType : 'POST',
					cfgQueryParamName : 'qfilter',
					cfgRecordCount : -1,
					cfgSeekId : 'brandingPkgNameSeek',
					cfgRootNode : 'd.filter',
					enableQueryParam:false,
					cfgDataNode1 : 'name'
				});
		
		Ext.Ajax.request({
					url : 'services/userseek/adminSellersListCommon.json',
					method : 'POST',
					async : false,
					success : function(response) {
						var data = Ext.decode(response.responseText);
						var sellerData = data.d.preferences;
						if (!Ext.isEmpty(data)) {
							storeData = sellerData;
						}
					},
					failure : function(response) {
						// console.log("Ajax Get data Call Failed");
					}

				});
		var comboStore = Ext.create('Ext.data.Store', {
					fields : ['CODE', 'DESCR'],
					data : storeData,
					reader : {
						type : 'json',
						root : 'preferences'
					}
				});
		if (!Ext.isEmpty(arrStatusFilterLst)) {
			arrStatusFilterLst.push({
									name : 'all',
									value : getLabel('all','ALL')
								});
		}
				var statusStore = Ext.create('Ext.data.Store', {
					fields : ["name", "value"],
					data : arrStatusFilterLst
					/*proxy : {
						type : 'ajax',
						autoLoad : true,
						url : 'cpon/statusList.json',
						actionMethods : {
							read : 'POST'
						},
						reader : {
							type : 'json',
							root : 'd.filter'
						},
						noCache: false
					}*/
				});		
		
		var sellerComboField = Ext.create('Ext.form.field.ComboBox', {
			displayField : 'DESCR',
			fieldCls : 'xn-form-field inline_block ux_font-size14-normal ',
			triggerBaseCls : 'xn-form-trigger',
			filterParamName : 'sellerCode',
			itemId : 'sellerCode_id',
			valueField : 'CODE',
			name : 'sellerCode',
			editable : false,
			value : strSellerId,
			store : comboStore,
			width : 'auto',
			cls:'w165',
			listeners : {
				'render' : function(combo, record) {
					combo.store.load();
					var corporationFilter = me.getCorporationFilter();
					corporationFilter.cfgExtraParams =
					[
						{
							key : '$sellerCode',
							value : strSellerId
						}
					];
					
					if( me.selectedMst == 'client' )
					{
						var clientFilter = me.getClientFilter();
						clientFilter.cfgExtraParams =
						[
							{
								key : '$sellerCode',
								value : strSellerId
							}
						];
						var clientMciCodeFilter = me.getClientMciCodeFilter();
						clientMciCodeFilter.cfgExtraParams =
						[
							{
								key : '$sellerCode',
								value : strSellerId
							}
						];
					}
				},
				'select' : function(combo, record) {
					var newValue = combo.getValue();
					setAdminSeller(newValue);
					var corporationFilter = me.getCorporationFilter();
					corporationFilter.cfgExtraParams =
					[
						{
							key : '$sellerCode',
							value : newValue
						}
					];
					corporationFilter.setValue('');
					if( me.selectedMst == 'client' )
					{
						var clientFilter = me.getClientFilter();
						clientFilter.cfgExtraParams =
						[
							{
								key : '$sellerCode',
								value : newValue
							}
						];
						clientFilter.setValue('');
						var clientMciCodeFilter = me.getClientMciCodeFilter();
						clientMciCodeFilter.cfgExtraParams =
						[
							{
								key : '$sellerCode',
								value : newValue
							}
						];
						clientMciCodeFilter.setValue('');
					}
				}
			}
		});	
		
		var filterPanel = me.getSpecificFilterPanel();
		var statusPanel = me.getStatusFilterPanel();
		var buttonPanel = me.getButtonFilterPanel();
		if (!Ext.isEmpty(filterPanel))
		{
			filterPanel.removeAll();
		}
		
		if ('brandingPackage' == me.selectedMst)
		{
			filterPanel.flex=0.33;
			filterPanel.doLayout();
		
			filterPanel.add({
							   xtype : 'container',
							   columnWidth : 0.25,
							   padding : '5px',
					           hidden: true,
					           itemId : 'sellerFilter',
					           items: [{
										xtype : 'label',
										cls : 'f20 ux_font-size14 ux_normalmargin-bottom',
										itemId : 'labelSeller',
										text : getLabel('seller', 'FI')
										 //cls : 'xn-custom-button cursor_pointer',
							          }, sellerComboField]
		    		},{
							   xtype : 'container',
							   columnWidth : 0.25,
							   padding : '5px',
						items : [{
									xtype : 'label',
									text : getLabel('brandingPkgName',
											'Service Package Name'),
									cls : 'f13 ux_font-size14  ux_normalmargin-bottom'
								}, brandingPkgNameTextfield]
					},{
							   xtype : 'container',
							   columnWidth : 0.25,
							   padding : '5px',
//							columnWidth : 0.4,
							itemId: 'statusFilterPanel',
							items : [{
										xtype : 'label',
										text : getLabel('status', 'Status'),
										cls : 'f13 ux_font-size14 ux_normalmargin-bottom'
									}, {
										xtype : 'combobox',
										fieldCls : 'xn-form-field inline_block',
										triggerBaseCls : 'xn-form-trigger',
										width : 165,
										itemId : 'statusFilter',
										filterParamName : 'cponRequestState',
										store : statusStore,
										valueField : 'name',
										displayField : 'value',
										editable : false,
										value : 'all'//getLabel('all',
												//'ALL')
	
									}]

					},{
							   xtype : 'container',
							   columnWidth : 0.25,
							   padding : '5px',
//						columnWidth : 0.1,
						itemId: 'buttonFilter',
						items : [{
									xtype : 'panel',
									layout : 'hbox',									
									padding : '20 0 1 5',
									items : [{
												xtype : 'button',
												itemId : 'btnFilter',
												text : getLabel('search',
														'Search'),
												cls : 'ux_button-padding ux_button-background ux_button-background-color'
											}]
								}]
					});
				
			
			sellerComboField.store.on('load',function(store){
						if(store.getCount() > 1) {
								filterPanel.down('container[itemId="sellerFilter"]').show();
						}
				});
			
			
			
		}
		else
		{
			filterPanel.flex=2.9;
			filterPanel.doLayout();

			filterPanel.add({
							   xtype : 'container',
							   columnWidth : 0.3,
							   padding : '5px',
					           hidden : true,
					           itemId : 'sellerFilter',
					           items: [{
										xtype : 'label',
										cls : 'f20 ux_font-size14 ux_normalmargin-bottom',
										itemId : 'labelSeller',
										text : getLabel('seller', 'FI')
										 //cls : 'xn-custom-button cursor_pointer',
							          }, sellerComboField]
		    		},{
							   xtype : 'container',
							   columnWidth : 0.3,
							   padding : '5px',
						items : [{
									xtype : 'label',
									text : getLabel('corporation',
											'Corporation'),
									cls : 'f13 ux_font-size14  ux_normalmargin-bottom'
								}, corporationTextfield]
					}, {
							   xtype : 'container',
							   columnWidth : 0.3,
							   padding : '5px',
						 flex : 1,
						items : [{
									xtype : 'label',
									text : getLabel('companyName', 'Company Name'),
									cls : 'f13 ux_font-size14  ux_normalmargin-bottom'
								}, clientTextfield]
					   }, {
						   xtype : 'container',
						   columnWidth : 0.3,
						   padding : '5px',
						   flex : 1,
						   items : [{
						   		xtype : 'label',
								text :  me.getAdditionalInfoLabel('clientShortName','Client Short Name'),
								cls : 'f13 ux_font-size14  ux_normalmargin-bottom'
							}, objMCICode]
		   			},
					   {
							   xtype : 'container',
							   columnWidth : 0.3,
							   padding : '5px',
//							columnWidth : 0.4,
							itemId: 'statusFilterPanel',
							items : [{
										xtype : 'label',
										text : getLabel('status', 'Status'),
										cls : 'f13 ux_font-size14 ux_normalmargin-bottom'
									}, {
										xtype : 'combobox',
										fieldCls : 'xn-form-field inline_block',
										triggerBaseCls : 'xn-form-trigger',
										width : 165,
										itemId : 'statusFilter',
										filterParamName : 'cponRequestState',
										store : statusStore,
										valueField : 'name',
										displayField : 'value',
										editable : false,
										value : 'all'//getLabel('all',
												//'ALL')
	
									}]

					},{
							   xtype : 'container',
							   columnWidth : 0.3,
							   padding : '5px',
//						columnWidth : 0.1,
						itemId: 'buttonFilter',
						items : [{
									xtype : 'panel',
									layout : 'hbox',									
									padding : '20 0 1 5',
									items : [{
												xtype : 'button',
												itemId : 'btnFilter',
												text : getLabel('search',
														'Search'),
												cls : 'ux_button-padding ux_button-background ux_button-background-color'
											}]
								}]
					});
						
			sellerComboField.store.on('load',function(store){
				if(store.getCount() > 1) {
					filterPanel.down('container[itemId="sellerFilter"]').show();
				}
				});
		}
		
	},
	//method to handle client list and branding pkg list link  click
	handleGridHeader : function() {
		var me = this;
		var gridHeaderPanel = me.getGridHeader();
		var createNewPanel = me.getCreateNewToolBar();
		var label = me.getScreenTitleLabel();
		if (!Ext.isEmpty(gridHeaderPanel))
		{
			gridHeaderPanel.removeAll();
		}
		if (!Ext.isEmpty(createNewPanel))
		{
			createNewPanel.removeAll();
		}
		
		if ('brandingPackage' == me.selectedMst)
		{
			//me.getClientListLink().setDisabled(false);
			//me.getClientListLink().addCls('underlined');
			//me.getBrandingPkgListLink().removeCls('underlined');
			//me.getBrandingPkgListLink().setDisabled(true);
			label.setText(getLabel('brandingPkgSetup', 'Service Package Setup'));
			var clntSetupDtlView = me.getClientSetupDtlView();
			clntSetupDtlView.setTitle(getLabel('brandingServicelist', 'Branding Service List'));
			if(ACCESSNEW && ACCESSNEW !== "false"){
				createNewPanel.add(
					{
									xtype : 'button',
									border : 0,
									text : getLabel('createBrandingPackage',
											'Create New Service Package'),
									cls : 'cursor_pointer ux_button-background ux_button-padding ux_button-background-color ux_button-s',
									glyph:'xf055@fontawesome',
									parent : this,
									itemId : 'btnCreateBrandingPkg'
					}
				);
			}
		}
		else
		{
			//me.getBrandingPkgListLink().setDisabled(false);
			//me.getBrandingPkgListLink().addCls('underlined');
			//me.getClientListLink().removeCls('underlined');
			//me.getClientListLink().setDisabled(true);
			label.setText(getLabel('clntServiceSetup', 'Client Service Setup'));
			var clntSetupDtlView = me.getClientSetupDtlView();
			clntSetupDtlView.setTitle(getLabel('clntServiceSetuplist','Client Setup Service List'));
			if(ACCESSNEW && ACCESSNEW !== "false"  && (partyMgmtFlag == 'M' || partyMgmtFlag == 'C' || partyMgmtFlag == '')){
				createNewPanel.add(
					{
									xtype : 'button',
									border : 0,
									text : getLabel('craeteClient', 'Create New Client'),
									cls : 'cursor_pointer ux_button-background ux_button-padding ux_button-background-color ux_button-s',
									glyph:'xf055@fontawesome',
									parent : this,
									itemId : 'btnCreateClient'
								}
				);
			}
		}
		

	},
	showBrandingPkgList : function(btn, opts) {
		var me = this;
		me.selectedMst = 'brandingPackage';
		me.handleSmartGridConfig();
	},

	showClientList : function(btn, opts) {
		var me = this;
		me.selectedMst = 'client';
		me.handleSmartGridConfig();
	},
	handleLoadGridData : function(grid, url, pgSize, newPgNo, oldPgNo, sorter) {
		var me = this;
		if(!me.firstLoad)
		me.handleSaveLocalStorage();		
		me.applyPreferences();
		me.setFilterRetainedValues();		
		if(!Ext.isEmpty(me.filterData) && !me.filterData.length >= 1)
		me.setDataForFilter();
		
        var intPageNo = me.objLocalData && me.objLocalData.d && me.objLocalData.d.preferences
        && me.objLocalData.d.preferences.tempPref
        && me.objLocalData.d.preferences.tempPref.pageNo
        ? me.objLocalData.d.preferences.tempPref.pageNo
        : null, oldPgNo = oldPgNo , newPgNo = newPgNo;
        
        if(!Ext.isEmpty(intPageNo) && me.firstLoad)   {
            newPgNo = intPageNo;
            oldPgNo = intPageNo;
	     }
		me.firstLoad = false;
		 
		sorter = grid.store.sorters;
		var strUrl = grid.generateUrl(url, pgSize, newPgNo, oldPgNo, sorter);		
		strUrl = strUrl + me.getFilterUrl();
		grid.loadGridData(strUrl, null);
	},
	getFilterUrl : function() {
		var me = this;
		var strQuickFilterUrl = '';
		var strMasterFilterUrl = '';
		var strUrl = '';
		var isFilterApplied = false;
		strQuickFilterUrl = me.generateUrlWithFilterParams(me);
		strMasterFilterUrl = me.generateUrlForMaster();
		if (!Ext.isEmpty(strQuickFilterUrl)) {
			strUrl += '&$filter=' + strQuickFilterUrl;
			isFilterApplied = true;
		}

		if (!Ext.isEmpty(strMasterFilterUrl)) {
			if (isFilterApplied)
				strUrl += ' and ' + strMasterFilterUrl;
			else
				strUrl += '&$filter=' + strMasterFilterUrl;
		}

		return strUrl;
	},
	generateUrlForMaster : function () {
		var me = this;
		var strUrl ='';
		if ('brandingPackage' == me.selectedMst)
		{
			strUrl = 'brandingPkgType eq \'Y\'';
		}
		else
		{
			strUrl = 'brandingPkgType eq \'N\'';
		}
		return strUrl;
	},
	generateUrlWithFilterParams : function(thisClass) {
		var filterData = thisClass.filterData;
		var strFilter = '';
		var strTemp = '';
		var strFilterParam = '';
		var isFilterApplied = false;
		for (var index = 0; index < filterData.length; index++) {
		
			if (isFilterApplied)
				strTemp = strTemp + ' and ';
			switch (filterData[index].operatorValue) {
				case 'bt' :
					if (filterData[index].dataType === 'D') {
						strTemp = strTemp + filterData[index].paramName + ' '
								+ filterData[index].operatorValue + ' '
								+ 'date\'' + filterData[index].paramValue1
								+ '\'' + ' and ' + 'date\''
								+ filterData[index].paramValue2 + '\'';
					} else {
						strTemp = strTemp + filterData[index].paramName + ' '
								+ filterData[index].operatorValue + ' ' + '\''
								+ filterData[index].paramValue1 + '\''
								+ ' and ' + '\''
								+ filterData[index].paramValue2 + '\'';
					}
					break;
				case 'in' :
					var arrId = filterData[index].paramValue1;
					if (0 != arrId.length) {
						strTemp = strTemp + '(';
						for (var count = 0; count < arrId.length; count++) {
							strTemp = strTemp + filterData[index].paramName
									+ ' eq ' + '\'' + arrId[count] + '\'';
							if (count != arrId.length - 1) {
								strTemp = strTemp + ' or ';
							}
						}
						strTemp = strTemp + ' ) ';
					}
					break;					
				default :
					// Default opertator is eq
					if (filterData[index].dataType === 'D') {
						strTemp = strTemp + filterData[index].paramName + ' '
								+ filterData[index].operatorValue + ' '
								+ 'date\'' + filterData[index].paramValue1
								+ '\'';
					} else {
						strTemp = strTemp + filterData[index].paramName + ' '
								+ filterData[index].operatorValue + ' ' + '\''
								+ filterData[index].paramValue1 + '\'';
					}
					break;
			}
			isFilterApplied = true;
		}
		return strTemp;
	},
	
	setDataForFilter : function() {
		var me = this;
		me.getSearchTextInput().setValue('');
		var sellerVal = null;
		var isPending = true;
		var corporationVal = null, statusVal = null, clientVal = null,  strSelectedMciCode = null, jsonArray = [];

		var spFilterView = me.getSpecificFilterPanel();
		var sellerFltId = spFilterView
				.down('combobox[itemId=sellerCode_id]');
		if (!Ext.isEmpty(sellerFltId) && !Ext.isEmpty(sellerFltId.getValue())) {
			sellerVal = sellerFltId.getValue().toUpperCase();
		}

		jsonArray.push({
					paramName : sellerFltId.filterParamName,
					paramValue1 : sellerVal,
					operatorValue : 'eq',
					dataType : 'S'
				});
		
		if (!Ext.isEmpty(me.getCorporationFilter())
				&& !Ext.isEmpty(me.getCorporationFilter().getValue())) {
			corporationVal = me.getCorporationFilter().getValue();
		}
		if('brandingPackage' != me.selectedMst)
		{		
			if (!Ext.isEmpty(me.getClientMciCodeFilter())
					&& !Ext.isEmpty(me.getClientMciCodeFilter().getValue())) {
				strSelectedMciCode = me.getClientMciCodeFilter().getValue();
			}
		}

		if (!Ext.isEmpty(me.getStatusFilter())
				&& !Ext.isEmpty(me.getStatusFilter().getValue())
				&& ('all' != me.getStatusFilter().getValue())) {
			statusVal = me.getStatusFilter().getValue();
			if(statusVal == 13)//Pending My Approval
			{
				statusVal  = new Array('5YN','4NN','0NY','1YY');
				isPending = false;
				jsonArray.push({
							paramName : 'statusFilter',
							paramValue1 : statusVal,
							operatorValue : 'in',
							dataType : 'S',
							displayValue1 :"Pending My Approval"
						} );
				jsonArray.push({
							paramName : 'user',
							paramValue1 :encodeURIComponent(USER.replace(new RegExp("'", 'g'), "\''")),
							operatorValue : 'ne',
							dataType : 'S'
						});
			}
			if(isPending)
			{
			  if (statusVal == 12 || statusVal == 3 || statusVal == 14) {
				if (statusVal == 12 || statusVal == 14) // 12: New Submitted,14: Modified Submitted
				{
					statusVal = (statusVal == 12)? 0 : 1;
					jsonArray.push({
								paramName : 'cponIsSubmitted',
								paramValue1 : 'Y',
								operatorValue : 'eq',
								dataType : 'S',
								displayValue1 : me.getStatusFilter().rawValue
							});
				} else // Valid/Authorized
				{
					jsonArray.push({
								paramName : 'validFlag',
								paramValue1 : 'Y',
								operatorValue : 'eq',
								dataType : 'S'
							});
				}
			} else if (statusVal == 11) // Disabled
			{
				statusVal = 3;
				jsonArray.push({
							paramName : 'validFlag',
							paramValue1 : 'N',
							operatorValue : 'eq',
							dataType : 'S'
						});
			}  
			else if (statusVal == 0 || statusVal == 1) // New and Modified
			{
				jsonArray.push({
							paramName : 'cponIsSubmitted',
							paramValue1 : 'N',
							operatorValue : 'eq',
							dataType : 'S',
							displayValue1 : me.getStatusFilter().rawValue
						});
			}
					jsonArray.push({
								paramName : me.getStatusFilter().filterParamName,
								paramValue1 : statusVal,
								operatorValue : 'eq',
								dataType : 'S',
								displayValue1 : me.getStatusFilter().rawValue
							});
			}
		}

		if (!Ext.isEmpty(me.getClientFilter())
				&& !Ext.isEmpty(me.getClientFilter().getValue())) {
			clientVal = me.getClientFilter().getValue();
		}
		var tempParam = null;
		if('brandingPackage' == me.selectedMst)
		{
			tempParam = 'brandingPkgName';
		}
		else
		{
			tempParam = 'corporationName';	
		}		
		if (!Ext.isEmpty(corporationVal)) {
			jsonArray.push({
						paramName : tempParam,							
						paramValue1 : encodeURIComponent(corporationVal.toUpperCase().replace(new RegExp("'", 'g'), "\''")),
						operatorValue : 'lk',
						dataType : 'S',
						displayValue1 : corporationVal
					});
		}
		
		if (clientVal != null) {
			jsonArray.push({
						paramName : me.getClientFilter().name,
						paramValue1 : encodeURIComponent(clientVal.toUpperCase().replace(new RegExp("'", 'g'), "\''")),
						operatorValue : 'lk',
						dataType : 'S',
						displayValue1 : clientVal
					});
		}
		if('brandingPackage' != me.selectedMst)
		{
			if(!isEmpty(strSelectedMciCode)){
				jsonArray.push({
							paramName : me.getClientMciCodeFilter().name,
							paramValue1 : encodeURIComponent(strSelectedMciCode.toLowerCase().replace(new RegExp("'", 'g'), "\''")),
							operatorValue : 'lk',
							dataType : 'S',
							displayValue1 : strSelectedMciCode
						});
			}
		}
		
		me.filterData = jsonArray;
	},
	applyFilter : function() {
		var me = this;
		var grid = me.getGrid();
		if (!Ext.isEmpty(grid)) {
			var strDataUrl = grid.store.dataUrl;
			var store = grid.store;
			var strUrl = grid.generateUrl(strDataUrl, grid.pageSize, 1, 1,
					store.sorters);
			strUrl = strUrl + me.getFilterUrl();
			me.getGrid().setLoading(true);
			grid.loadGridData(strUrl, me.handleAfterGridDataLoad, null);
		}
	},

	handleSmartGridConfig : function() {
		var me = this;
		var clientGrid = me.getClientSetupGrid();
		var objConfigMap = me.getClientSetupConfiguration();
		var arrCols = new Array();
		if (!Ext.isEmpty(clientGrid))
			clientGrid.destroy(true);
			
		arrCols = me.getColumns(objConfigMap.arrColsPref,
				objConfigMap.objWidthMap);
		/*if (!Ext.isEmpty(clientGrid)) {
			var store = clientGrid.createGridStore(objConfigMap.storeModel);
			var columns = clientGrid.createColumns(arrCols);
			clientGrid.reconfigure(store, columns);
			clientGrid.down('pagingtoolbar').bindStore(store);
			clientGrid.refreshData();
		} else {*/
			me.handleSmartGridLoading(arrCols, objConfigMap.storeModel);
		
	},

	handleSmartGridLoading : function(arrCols, storeModel) {
		var me = this;
		var pgSize = null;

        pgSize = me.objLocalData && me.objLocalData.d && me.objLocalData.d.preferences
        && me.objLocalData.d.preferences.tempPref
        && me.objLocalData.d.preferences.tempPref.pageSize
        ? me.objLocalData.d.preferences.tempPref.pageSize: _GridSizeMaster;
        
        
        var sortState = me.objLocalData && me.objLocalData.d && me.objLocalData.d.preferences
        && me.objLocalData.d.preferences.tempPref
        && me.objLocalData.d.preferences.tempPref.sorter
        ? me.objLocalData.d.preferences.tempPref.sorter
        : [];
        
        if(!Ext.isEmpty(sortState)) {
        	storeModel.sortState = sortState;
		}


		clientGrid = Ext.create('Ext.ux.gcp.SmartGrid', {
					id : 'gridViewMstId',
					itemId : 'gridViewMstId',
					pageSize : pgSize,
					stateful : false,
					showEmptyRow : false,
					padding : '5 0 0 0',
					rowList : _AvailableGridSize,
					minHeight : 0,
					maxHeight : 550,
					columnModel : arrCols,
					storeModel : storeModel,
					isRowIconVisible : me.isRowIconVisible,
//					isRowMoreMenuVisible : me.isRowMoreMenuVisible,
					handleRowMoreMenuClick : me.handleRowMoreMenuClick,
					cls : 'ux_largepaddinglr ux_paddingb ux_largemargin-bottom',

			handleRowIconClick : function(tableView, rowIndex, columnIndex,
					btn, event, record) {
				me.handleRowIconClick(tableView, rowIndex, columnIndex, btn,
						event, record);
			},

			handleMoreMenuItemClick : function(grid, rowIndex, cellIndex,
											menu, event, record) {
				var dataParams = menu.dataParams;
				me.handleRowIconClick(dataParams.view, dataParams.rowIndex,
						dataParams.columnIndex, menu, null, dataParams.record);
			}
	    });

		var clntSetupDtlView = me.getClientSetupDtlView();
		clntSetupDtlView.add(clientGrid);
		clntSetupDtlView.doLayout();
	},
	
	handleRowIconClick : function(tableView, rowIndex, columnIndex, btn, event,
			record) {
		var me = this;
		var actionName = btn.itemId;
		if (actionName === 'submit' || actionName === 'accept' || actionName === 'enable' || actionName === 'disable'
				|| actionName === 'reject' || actionName === 'discard')
			me.handleGroupActions(btn, record);
		else if (actionName === 'btnHistory') {
			var recHistory = record.get('history');

			if (!Ext.isEmpty(recHistory)
					&& !Ext.isEmpty(recHistory.__deferred.uri)) {
				if ('client' == me.selectedMst)
				{
					me.showHistory(true,record.get('clientName'),record.get('history').__deferred.uri,record.get('identifier'));
				}
				else
				{
					me.showHistory(false,record.get('brandingPkgName'),record.get('history').__deferred.uri,record.get('identifier'));
				}
				
			}
		} else if (actionName === 'btnView') {
			me.submitForm('viewClientServiceSetup.form', record, rowIndex);
		} else if (actionName === 'btnEdit'){
			me.submitForm('editClientServiceSetup.form', record, rowIndex);
		}
	},
	submitForm : function(strUrl, record, rowIndex) {
		var me = this;
		var viewState = record.data.identifier;
		var updateIndex = rowIndex;
		var form, inputField;
		
		form = document.createElement('FORM');
		form.name = 'frmMain';
		form.id = 'frmMain';
		form.method = 'POST';
		form.appendChild(me.createFormField('INPUT', 'HIDDEN',
				csrfTokenName, tokenValue));
		form.appendChild(me.createFormField('INPUT', 'HIDDEN',
				'txtRecordIndex', rowIndex));
		form.appendChild(me.createFormField('INPUT', 'HIDDEN', 'viewState',
				viewState));

		form.action = strUrl;
		document.body.appendChild(form);
		form.submit();
	},
	
	showHistory : function(isClient,clientName,url, id) {
		Ext.create('GCP.view.HistoryPopup', {
					isClient : isClient,
					historyUrl : url,
					identifier : id,
					clientName : clientName
				}).show();
	},

	isRowIconVisible : function(store, record, jsonData, itmId, maskPosition) {
		var maskSize = 11;
		var maskArray = new Array();
		var actionMask = '';
		var rightsMap = record.data.__metadata.__rightsMap;
		var buttonMask = '';
		var retValue = true;
		var bitPosition = '';
		if (!Ext.isEmpty(maskPosition)) {
			bitPosition = parseInt(maskPosition,10) - 1;
			maskSize = maskSize;
		}
		if (!Ext.isEmpty(jsonData) && !Ext.isEmpty(jsonData.d.__buttonMask))
			buttonMask = jsonData.d.__buttonMask;
		maskArray.push(buttonMask);
		maskArray.push(rightsMap);
		actionMask = doAndOperation(maskArray, maskSize);
		var isSameUser = true;
		if (record.raw.makerId === USER) {
			isSameUser = false;
		}
		if (Ext.isEmpty(bitPosition))
			return retValue;
		retValue = isActionEnabled(actionMask, bitPosition);
		if ((maskPosition === 6 && retValue)) {
			retValue = retValue && isSameUser;
		} else if (maskPosition === 7 && retValue) {
			retValue = retValue && isSameUser;
		} else if (maskPosition === 2 && retValue) {
			var reqState = record.raw.requestState;
			var submitFlag = record.raw.isSubmitted;
			var validFlag = record.raw.validFlag;
			var isDisabled = (reqState === 3 && validFlag == 'N');
			var isSubmitModified = (reqState === 1 && submitFlag == 'Y');
			retValue = retValue && (!isDisabled) && (!isSubmitModified);
		} else if (maskPosition === 10 && retValue) {
			var reqState = record.raw.requestState;
			var submitFlag = record.raw.isSubmitted;
			var submitResult = (reqState === 0 && submitFlag == 'Y');
			retValue = retValue && (!submitResult);
		}else if (maskPosition === 8 && retValue) {
			var validFlag = record.raw.validFlag;
			var reqState = record.raw.requestState;
			retValue = retValue && (reqState == 3 && validFlag == 'N');
		}
		else if (maskPosition === 9 && retValue) {
			var validFlag = record.raw.validFlag;
			var reqState = record.raw.requestState;
			retValue = retValue && (reqState == 3 && validFlag == 'Y');
		}
		return retValue;
	},

	getColumns : function(arrColsPref, objWidthMap) {
		var me = this;
		var arrCols = new Array(), objCol = null, cfgCol = null;
		arrCols.push(me.createGroupActionColumn());
		arrCols.push(me.createActionColumn())
		if (!Ext.isEmpty(arrColsPref)) {
			for (var i = 0; i < arrColsPref.length; i++) {
				objCol = arrColsPref[i];
				cfgCol = {};
				cfgCol.colHeader = objCol.colDesc;
				cfgCol.colId = objCol.colId;
				
				if(objCol.colId == 'requestStateDesc')
				{
					cfgCol.locked = false;
					cfgCol.lockable = false;
					cfgCol.sortable = false;
					cfgCol.hideable = false;
					cfgCol.resizable = false;
					cfgCol.draggable = false;
					cfgCol.hidden = false;
				}
				
				if (!Ext.isEmpty(objCol.colType)) {
					cfgCol.colType = objCol.colType;
					if (cfgCol.colType === "number")
						cfgCol.align = 'right';
				}
				cfgCol.sortable=objCol.sortable;
				cfgCol.width = !Ext.isEmpty(objWidthMap[objCol.colId])
						? objWidthMap[objCol.colId]
						: 120;

				cfgCol.fnColumnRenderer = me.columnRenderer;
				arrCols.push(cfgCol);
			}
		}
		return arrCols;
	},

	createActionColumn : function() {
		var me = this;
		var objActionCol = {
			colType : 'actioncontent',
			colId : 'action',
			width : 85,
			locked : true,
			lockable : false,
			sortable : false,
			hideable : false,
			resizable : false,
			draggable : false,
			items : [{
						itemId : 'btnEdit',
						itemCls : 'grid-row-action-icon icon-edit',
						toolTip : getLabel('editToolTip', 'Edit'),
						maskPosition : 2
					}, {
						itemId : 'btnView',
						itemCls : 'grid-row-action-icon icon-view',
						toolTip : getLabel('viewToolTip', 'View Record'),
						maskPosition : 3
					}, {
						itemId : 'btnHistory',
						itemCls : 'grid-row-action-icon icon-history',
						itemLabel : getLabel('historyToolTip',
								'View History'),
						toolTip : getLabel('historyToolTip','View History'),		
						maskPosition : 4
					}]
		};
		return objActionCol;
		
	},
	
	handleRowMoreMenuClick : function(tableView, rowIndex, columnIndex, btn,
			event, record) {
		var me = this;
		var menu = btn.menu;
		var arrMenuItems = null;
		var blnRetValue = true;
		var store = tableView.store;
		var jsonData = store.proxy.reader.jsonData;

		btn.menu.dataParams = {
			'record' : record,
			'rowIndex' : rowIndex,
			'columnIndex' : columnIndex,
			'view' : tableView
		};
		if (!Ext.isEmpty(menu.items) && !Ext.isEmpty(menu.items.items))
			arrMenuItems = menu.items.items;
		if (!Ext.isEmpty(arrMenuItems)) {
			for (var a = 0; a < arrMenuItems.length; a++) {
				blnRetValue = me.isRowIconVisible(store, record, jsonData,
						null, arrMenuItems[a].maskPosition);
				arrMenuItems[a].setVisible(blnRetValue);
			}
		}
		menu.showAt(event.xy[0] + 5, event.xy[1] + 5);
	},

	createGroupActionColumn : function() {
		var me = this;
		var objActionCol = {
			colType : 'actioncontent',
			colId : 'groupaction',
			width : 130,
			locked : true,
			lockable : false,
			sortable : false,
			hideable : false,
			resizable : false,
			draggable : false,
			items: [{
						text : getLabel('prfMstActionSubmit', 'Submit'),
						itemId : 'submit',
						actionName : 'submit',
						maskPosition : 5
					},{
						text : getLabel('prfMstActionApprove', 'Approve'),
						itemId : 'accept',
						actionName : 'accept',
						maskPosition : 6
					},{
						text : getLabel('prfMstActionReject', 'Reject'),
						itemId : 'reject',
						actionName : 'reject',
						maskPosition : 7
					},{
						text : getLabel('prfMstActionDiscard', 'Discard'),
						itemId : 'discard',
						actionName : 'discard',
						maskPosition : 10
					},{
						text : getLabel('prfMstActionEnable', 'Enable'),
						itemId : 'enable',
						actionName : 'enable',
						maskPosition : 8
					}, {
						text : getLabel('prfMstActionDisable',	'Suspend'),
						itemId : 'disable',
						actionName : 'disable',
						maskPosition : 9
					}]
		};
		return objActionCol;
	},
	
	enableValidActionsForGrid : function(grid, record, recordIndex,
			selectedRecords, jsonData) {
		var me = this;
		var buttonMask = '0000000000';
		var maskArray = new Array(), actionMask = '', objData = null;;

		if (!Ext.isEmpty(jsonData) && !Ext.isEmpty(jsonData.d.__buttonMask)) {
			buttonMask = jsonData.d.__buttonMask;
		}
		var isSameUser = true;
		var isDisabled = false;
		var isSubmit = false;
		maskArray.push(buttonMask);
		for (var index = 0; index < selectedRecords.length; index++) {
			objData = selectedRecords[index];
			maskArray.push(objData.get('__metadata').__rightsMap);
			if (objData.raw.makerId === USER) {
				isSameUser = false;
			}
			if (objData.raw.validFlag != 'Y') {
				isDisabled = true;
			}
			if (objData.raw.isSubmitted == 'Y' && objData.raw.requestState == 0) {
				isSubmit = true;
			}
		}
		actionMask = doAndOperation(maskArray, 10);
		me.enableDisableGroupActions(actionMask, isSameUser, isDisabled,isSubmit);
	},

	enableDisableGroupActions : function(actionMask, isSameUser, isDisabled, isSubmit) {
		var actionBar = this.getGroupActionBar();
		var blnEnabled = false, strBitMapKey = null, arrItems = new Array();
		if (!Ext.isEmpty(actionBar) && !Ext.isEmpty(actionBar.items.items)) {
			arrItems = actionBar.items.items;
			Ext.each(arrItems, function(item) {
						strBitMapKey = parseInt(item.maskPosition,10) - 1;
						if (strBitMapKey) {
							blnEnabled = isActionEnabled(actionMask,
									strBitMapKey);
									
							if((item.maskPosition === 6 && blnEnabled)){
								blnEnabled = blnEnabled && isSameUser;
							} else  if(item.maskPosition === 7 && blnEnabled){
								blnEnabled = blnEnabled && isSameUser;
							}else if (item.maskPosition === 8 && blnEnabled) {
								blnEnabled = blnEnabled && isDisabled;
							} else if (item.maskPosition === 9 && blnEnabled) {
								blnEnabled = blnEnabled && !isDisabled;
							} else if (item.maskPosition === 10 && blnEnabled) {
								blnEnabled = blnEnabled && !isSubmit;
							}
							item.setDisabled(!blnEnabled);
						}
					});
		}
	},

	handleGroupActions : function(btn, record) {
		var me = this;
		var strAction = !Ext.isEmpty(btn.actionName)
				? btn.actionName
				: btn.itemId;
		var strUrl = Ext.String.format('cpon/clientServiceSetup/{0}',
				strAction);
		if (strAction === 'reject') {
			this.showRejectVerifyPopUp(strAction, strUrl,record);

		} else {
			this.preHandleGroupActions(strUrl, '',record);
		}

	},
	
	showRejectVerifyPopUp : function(strAction, strActionUrl,record) {
		var me = this;
		var titleMsg = '', fieldLbl = '';
		if (strAction === 'reject') {
			fieldLbl = getLabel('prfRejectRemarkPopUpTitle',
					'Please Enter Reject Remark');
			titleMsg = getLabel('prfRejectRemarkPopUpFldLbl', 'Reject Remark');
		}
		var msgbox = Ext.Msg.show({
					title : titleMsg,
					msg : fieldLbl,
					buttons : Ext.Msg.OKCANCEL,
					multiline : 4,
					cls:'t7-popup',
					width: 355,
					height : 270,
					bodyPadding : 0,
					fn : function(btn, text) {
						if (btn == 'ok') {
							if(Ext.isEmpty(text))
							{
								Ext.Msg.alert(getLabel('errorTitle', 'Error'), getLabel('Error', 'Reject Remarks cannot be blank'));
							}
							else
							{
								me.preHandleGroupActions(strActionUrl, text, record);
							}
						}
					}
				});
		msgbox.textArea.enforceMaxLength = true;
		msgbox.textArea.inputEl.set({
			maxLength : 255
		});
	},

	preHandleGroupActions : function(strUrl, remark, record) {

		var me = this;
		var grid = this.getGrid();
		grid.setLoading(true);
		if (!Ext.isEmpty(grid)) {
			var arrayJson = new Array();
			var records = grid.getSelectedRecords();
			records = (!Ext.isEmpty(records) && Ext.isEmpty(record))
					? records
					: [record];
			for (var index = 0; index < records.length; index++) {
				arrayJson.push({
							serialNo : grid.getStore().indexOf(records[index])
									+ 1,
							identifier : records[index].data.identifier,
							userMessage : remark,
							recordDesc : ('brandingPackage' == me.selectedMst)? records[index].data.brandingPkgName : records[index].data.clientName
						});
			}
			if (arrayJson)
				arrayJson = arrayJson.sort(function(valA, valB) {
							return valA.serialNo - valB.serialNo
						});

			Ext.Ajax.request({
						url : strUrl,
						method : 'POST',
						jsonData : Ext.encode(arrayJson),
						success : function(response) {
							// TODO : Action Result handling to be done here
							grid.setLoading(false);
							me.enableDisableGroupActions('0000000000', true);
							grid.refreshData();
							var errorMessage = '';
							if (!Ext.isEmpty(response.responseText)) {
								var jsonData = Ext
										.decode(response.responseText);
								if(!Ext.isEmpty(jsonData))
						        {
						        	for(var i =0 ; i<jsonData.length;i++ )
						        	{
						        		var arrError = jsonData[i].errors;
						        		if(!Ext.isEmpty(arrError))
						        		{
						        			for(var j = 0 ; j< arrError.length; j++)
								        	{
						        				errorMessage = errorMessage + arrError[j].code +' : '+ arrError[j].errorMessage+"<br/>";
								        	}
						        		}
						        		
						        	}
						        }
								if ('' != errorMessage
										&& null != errorMessage) {
									Ext.Msg.alert({
											title: getLabel('errorTitle', 'Error'),
											cls:'t7-popup',
											bodyPadding : 0,
											width: 300,
											buttons : Ext.MessageBox.OK,
											msg : errorMessage});
								}
							}
						},
						failure : function() {
							var errMsg = "";
							Ext.MessageBox.show({
										title : getLabel(
												'instrumentErrorPopUpTitle',
												'Error'),
										msg : getLabel(
												'instrumentErrorPopUpMsg',
												'Error while fetching data..!'),
										buttons : Ext.MessageBox.OK,
										icon : Ext.MessageBox.ERROR
									});
						}
					});
		}

	},

	columnRenderer : function(value, meta, record, rowIndex, colIndex, store,
			view, colId) {
		var strRetValue = "";
		if (colId === 'col_clientType') {
			if (!record.get('isEmpty')) {
				if (!Ext.isEmpty(record.get('clientType'))
						&& 'M' == record.get('clientType')) 
				{
					if (record.get('subsideryCount') == '0' || record.get('subsideryCount') == '1')
						strRetValue = "" ; //getLabel('lblcompany', 'Company');
					else
						strRetValue = "" ; // getLabel('corporation', 'Corporation');
				} 
				else {
					strRetValue = getLabel('subsidiary', 'Subsidiary');
				}
			}
		} else if (colId === 'col_corporationName') {
			if (!record.get('isEmpty')) {
				if (!Ext.isEmpty(record.get('clientType'))
						&& 'M' == record.get('clientType')) {
					strRetValue =  "" ;//record.get('clientName');
				}
				else 
				{
					strRetValue = value;
				}
			}
		}
		else if(colId === 'col_authSyncStatus')
		{
			strRetValue = getLabel('authSyncStatus.'+value , '');
		}
		else {
			strRetValue = value;
		}

		return strRetValue;
	},

	getClientSetupConfiguration : function() {
		var me = this;
		var objConfigMap = null;
		var objWidthMap = null;
		var arrColsPref = null;
		var storeModel = null;
		switch (me.selectedMst) {
			case 'client' :

				objWidthMap = {
					"clientName" : 150,
					"corporationName" : 120,
					"brandingPkgDesc" : 130,
					"clientType" : 100,
					"requestStateDesc" : 100,
					"clientShortName" : 120,
					"authSyncStatus": 150
				};

				arrColsPref = [{
							"colId" : "clientName",
							"colDesc" : me.getAdditionalInfoLabel('companyName','Company Name'),
							//"colDesc" : getLabel('clientname','Client Name'),
							"sortable" :true
						}, {
							"colId" : "corporationName",
							"colDesc" : me.getAdditionalInfoLabel('lblCorpDesc','Corporation'),
							//"colDesc" :getLabel('lblCorpDesc','Corporation'),
							"sortable" :true
						}, {
							"colId" : "brandingPkgDesc",
							"colDesc" : me.getAdditionalInfoLabel('brandingPkgSetup','Branding Service'),
							//"colDesc" : getLabel('brandingPkgSetup','Branding Service'),
							"sortable" :true
						}, {
							"colId" : "requestStateDesc",
							"colDesc" : getLabel('colStatus','Status'),
							"sortable" :false
						}, {
							"colId" : "clientType",
							"colDesc" : me.getAdditionalInfoLabel('clienttype','Client Type'),
							//"colDesc" : getLabel('clienttype','Client Type'),
							"sortable" :true
						},
						{
							"colId" : "clientShortName",
							"colDesc" : me.getAdditionalInfoLabel('clientShortName','Client Short Name'),
							//"colDesc" : getLabel('clientShortName','Client Short Code'),
							"sortable" :true
						},
						{
							"colId" : "authSyncStatus",
							"colDesc" : me.getAdditionalInfoLabel('authSyncStatus','Synchronization Status'),
							"sortable" :false
						}
						];

				storeModel = {
					fields : ['clientName', 'corporationName',
							'brandingPkgDesc', 'clientType','clientShortName',
							'requestStateDesc', 'subsideryCount',
							'identifier','history','authSyncStatus','__metadata'],
					proxyUrl : 'cpon/clientServiceSetup.json',
					rootNode : 'd.profile',
					totalRowsNode : 'd.__count',
					sortState : ''
				};
				break;

			case 'brandingPackage' :
				objWidthMap = {
					"brandingPkgName" : 255,
					"requestStateDesc" : 160
				};

				arrColsPref = [{
							"colId" : "brandingPkgName",
							"colDesc" : getLabel('brandingPkgSetup','Branding Service'),
							"sortable" :true
						}, {
							"colId" : "requestStateDesc",
							"colDesc" : getLabel('colStatus','Status'),
							"sortable" :false
						}];

				storeModel = {
					fields : ['brandingPkgName', 'requestStateDesc',
							'identifier','history','__metadata'],
					proxyUrl : 'cpon/clientServiceSetup.json',
					rootNode : 'd.profile',
					totalRowsNode : 'd.__count'
				};
				break;

			default :

		}
		objConfigMap = {
			"objWidthMap" : objWidthMap,
			"arrColsPref" : arrColsPref,
			"storeModel" : storeModel
		};
		return objConfigMap;
	},
		/**
	 * Finds all strings that matches the searched value in each grid cells.
	 * 
	 * @private
	 */
	
getAdditionalInfoLabel : function(fieldId , label)	{
		
		if( ADDITIONAL_INFO_BASE_GRID == null || ADDITIONAL_INFO_BASE_GRID == '' )
			return getLabel(fieldId, label);
		var labelFound = false;
		var json = JSON.parse(ADDITIONAL_INFO_BASE_GRID);
		for( index = 0 ; index < json.length ; index++ )
		{
			var columnid = json[ index ].javaName;			
			if(columnid == fieldId )
			{
				console.log( 'Label Found for : ' + fieldId);
				labelFound = true;
				return json[ index ].displayName;
				break ;
			}
		}
		if(!labelFound)
			return getLabel(fieldId, label);
	},
	
	
	
	searchOnPage : function() {
		var me = this;
		var searchValue = me.getSearchTextInput().value;
		var anyMatch = me.getMatchCriteria().getValue();
		if ('anyMatch' === anyMatch.searchOnPage) {
			anyMatch = false;
		} else {
			anyMatch = true;
		}

		var grid = me.getGrid();
		grid.view.refresh();

		// detects html tag
		var tagsRe = /<[^>]*>/gm;
		// DEL ASCII code
		var tagsProtect = '\x0f';
		// detects regexp reserved word
		var regExpProtect = /\\|\/|\+|\\|\.|\[|\]|\{|\}|\?|\$|\*|\^|\|/gm;

		if (searchValue !== null) {
			searchRegExp = new RegExp(searchValue, 'g' + (anyMatch ? '' : 'i'));

			if (!Ext.isEmpty(grid)) {
				var store = grid.store;

				store.each(function(record, idx) {
					var td = Ext.fly(grid.view.getNode(idx)).down('td'), cell, matches, cellHTML;
					while (td) {
						cell = td.down('.x-grid-cell-inner');
						matches = cell.dom.innerHTML.match(tagsRe);
						cellHTML = cell.dom.innerHTML.replace(tagsRe,
								tagsProtect);

						if (cellHTML === '&nbsp;') {
							td = td.next();
						} else {
							// populate indexes array, set currentIndex, and
							// replace
							// wrap matched string in a span
							cellHTML = cellHTML.replace(searchRegExp, function(
											m) {
										return '<span class="xn-livesearch-match">'
												+ m + '</span>';
									});
							// restore protected tags
							Ext.each(matches, function(match) {
								cellHTML = cellHTML.replace(tagsProtect, match);
							});
							// update cell html
							cell.dom.innerHTML = cellHTML;
							td = td.next();
						}
					}
				}, me);
			}
		}
	},
	handleClientEntryAction : function(entryType) {
		var me = this;
		var form;
		var strUrl = 'addClientServiceSetup.form';
		var brandingPkgType = null;
		
		var errorMsg = null;
		
		if (entryType)
			brandingPkgType = 'N';
		else
			brandingPkgType = 'Y';

		form = document.createElement('FORM');
		form.name = 'frmMain';
		form.id = 'frmMain';
		form.method = 'POST';
		form.appendChild(me.createFormField('INPUT', 'HIDDEN',
				csrfTokenName, tokenValue));
		
		form.appendChild(me.createFormField('INPUT', 'HIDDEN', 'txtBrandingPkgType',
				brandingPkgType));
		
		form.action = strUrl;
		document.body.appendChild(form);
		form.submit();
		document.body.removeChild(form);
	},
	createFormField : function(element, type, name, value) {
		var inputField;
		inputField = document.createElement(element);
		inputField.type = type;
		inputField.name = name;
		inputField.value = value;
		return inputField;
	},
	setInfoTooltip : function() {
		var me = this;
		var infotip = Ext.create('Ext.tip.ToolTip', {
					target : 'imgFilterInfo',
					listeners : {
						// Change content dynamically depending on which element
						// triggered the show.
						beforeshow : function(tip) {
							var corporation = '';
							var client = '';
							var status = '';
							var micode = '';
							var seller = '';
							var spFilterView = me.getSpecificFilterPanel();
							var sellerFltId = spFilterView.down('combobox[itemId=sellerCode_id]');
							
							var sellerCount = sellerFltId.getStore().getCount();
							
							if (!Ext.isEmpty(me.getCorporationFilter()) && 
							!Ext.isEmpty(me.getCorporationFilter().getValue())) {
								corporation = me.getCorporationFilter().getValue();
							} else {
								corporation = getLabel('none', 'None');
							}
							if (!Ext.isEmpty(me.getStatusFilter()) && 
							!Ext.isEmpty(me.getStatusFilter().getValue())) {
								var combo = me.getStatusFilter();
								status = combo.getRawValue()
							} else {
								status = getLabel('all', 'ALL');
							}
							if( sellerFltId )
							{
								seller = sellerFltId.getRawValue();
							}
							if ('client' == me.selectedMst)
							{
								if (!Ext.isEmpty(me.getClientFilter()) &&
								!Ext.isEmpty(me.getClientFilter().getValue())) {
								client = me.getClientFilter().getValue();
								} else {
									client = getLabel('none', 'None');;
								}
								if (!Ext.isEmpty(me.getClientMciCodeFilter())
										&& !Ext.isEmpty(me.getClientMciCodeFilter().getValue())) {
									micode = me.getClientMciCodeFilter().getValue();
								} else {
									micode = getLabel('none', 'None');;
								}
								if(sellerCount > 1) {
								tip.update(getLabel('financialinstitution', 'Financial Institution')
										+ ' : '
										+ seller+'<br/>'+
										getLabel('corporation', 'Corporation')
									+ ' : '
									+ corporation
									+ '<br/>' + getLabel('client', 'Client')
									+ ' : ' + client + '<br/>'
									+ getLabel('clientShortName', 'Client Short Name')
									+ ' : ' + micode + '<br/>'
									+ getLabel('status', 'Status') + ' : '
									+ status);
								}
								else {
									tip.update(getLabel('corporation', 'Corporation')
											+ ' : '
											+ corporation
											+ '<br/>' + getLabel('client', 'Client')
											+ ' : ' + client + '<br/>'
											+ getLabel('clientShortName', 'Client Short Name')
											+ ' : ' + micode + '<br/>'
											+ getLabel('status', 'Status') + ' : '
											+ status);
								}
							}
							else
							{
								if(sellerCount > 1) {
								tip.update(getLabel('financialinstitution', 'Financial Institution')
										+ ' : '
										+ seller+'<br/>'+
										getLabel('brandingPkgName', 'Branding Service Name')
									+ ' : '
									+ corporation
									+ '<br/>' + getLabel('status', 'Status') + ' : '
									+ status);
								}
								else {
									tip.update(getLabel('brandingPkgName', 'Branding Service Name')
											+ ' : '
											+ corporation
											+ '<br/>' + getLabel('status', 'Status') + ' : '
											+ status);
								}
							}
						}
					}
				});
	},
	handleSellerChange : function(selectedSeller) {
				var me = this;
				var form;
				var strUrl = 'clientServiceChangeSeller.form';
				var errorMsg = null;
				if (!Ext.isEmpty(strUrl)) {
					form = document.createElement('FORM');
					form.name = 'frmMain';
					form.id = 'frmMain';
					form.method = 'POST';
					form.appendChild(me.createFormField('INPUT', 'HIDDEN',
							csrfTokenName, tokenValue));
					form.appendChild(me.createFormField('INPUT', 'HIDDEN',
							'selectedSellerCode', selectedSeller));

					form.action = strUrl;
					document.body.appendChild(form);
					form.submit();
					document.body.removeChild(form);
				}
			},
	
	/* State handling at local storage starts */
	handleSaveLocalStorage : function(){
				var me=this,arrSaveData = [], objSaveState = {}, grid = me.getGrid();			
				objSaveState['quickFilterJson'] = !Ext.isEmpty(me.filterData) ? me.filterData : {};
				objSaveState['pageSize'] = grid && !Ext.isEmpty(grid.getPageSize()) ? grid.getPageSize() : null;
				objSaveState['pageNo'] = grid && !Ext.isEmpty(grid.getCurrentPage()) ? grid.getCurrentPage() :  1;
				objSaveState['sorter'] = grid && !Ext.isEmpty(grid.getSortState()) ? grid.getSortState() :  [];
				
				arrSaveData.push({
					"module" : "tempPref",
					"jsonPreferences" : objSaveState
				});
				
				me.saveLocalPref(arrSaveData);
			},
	saveLocalPref : function(objSaveState){
				var me = this, args = {}, strLocalPrefPageName = 'clientsetupMst_TempPref', strBrandPrefPageName = 'brandingserviceMst_TempPref';
				me.preferenceHandler = Ext.create('Ext.ux.gcp.PreferencesHandler');
				if('client' == me.selectedMst) {
				if (!Ext.isEmpty(objSaveState)) {
					args['tempPref'] = objSaveState;
					me.preferenceHandler.savePagePreferences(strLocalPrefPageName, objSaveState,
							me.postHandleSaveLocalPref, args, me, false);
				}
				}
				
				if('brandingPackage' == me.selectedMst) {
					if (!Ext.isEmpty(objSaveState)) {
						args['tempPref'] = objSaveState;
						me.preferenceHandler.savePagePreferences(strBrandPrefPageName, objSaveState,
								me.postHandleSaveLocalPref, args, me, false);
					}
					}
			},
	postHandleSaveLocalPref : function(data, args, isSuccess) {
				var me = this;
				var objLocalPref = {},objTemp={},objTempPref = {}, jsonSaved ={};
				if (isSuccess === 'N') {
					Ext.MessageBox.show({
						title : getLabel('instrumentErrorPopUpTitle', 'Error'),
						msg : getLabel('errorMsg', 'Error while apply/restore setting'),
						buttons : Ext.MessageBox.OK,
						cls : 't7-popup',
						icon : Ext.MessageBox.ERROR
					});
				} 
				else {
					if(!Ext.isEmpty(args)){
						jsonSaved = args && args.tempPref && args.tempPref[0] && args.tempPref[0].jsonPreferences ? args.tempPref[0].jsonPreferences : {};
						objTemp['tempPref'] = jsonSaved;
						objTempPref['preferences'] = objTemp;
						objLocalPref['d'] = objTempPref;
						
						me.updateObjLocalPref(objLocalPref);
					}
				}
			},
	updateObjLocalPref : function (data){
				var me = this;
				objSaveLocalStoragePref = Ext.encode(data);
				me.objLocalData = Ext.decode(objSaveLocalStoragePref);
			},
	
	/* Preference handling for values */
	applyPreferences : function(){
				var me = this, objLocalJsonData='';
				if ( objSaveLocalStoragePref) {
								 objLocalJsonData = Ext.decode(objSaveLocalStoragePref); 
								
								  if (!Ext.isEmpty(objLocalJsonData.d.preferences) && (!Ext.isEmpty(objLocalJsonData.d.preferences.tempPref)) && allowLocalPreference === 'Y') {
										if(!Ext.isEmpty(objLocalJsonData.d.preferences.tempPref.quickFilterJson)){
											var  isSubmitted ;
											var quickPref = objLocalJsonData.d.preferences.tempPref.quickFilterJson;
											for(var i=0;i<quickPref.length;i++){
												if(quickPref[i].paramName == "sellerCode"){
													me.sellerCode = decodeURIComponent(quickPref[i].paramValue1);
													strsellerCode = me.sellerCode;
													//me.corpFilterVal = quickPref[i].codeValue1;
												}
												if(quickPref[i].paramName == "corporationName"){
													me.corpNamePrefCode = quickPref[i].paramValue1;
													me.corpNamePrefDesc = quickPref[i].displayValue1;
												}
												if(quickPref[i].paramName == "clientName"){
													me.clientDescPrefCode = quickPref[i].paramValue1;
													me.clientDescPrefDesc = quickPref[i].displayValue1;
												}
												if(quickPref[i].paramName == "clientShortCode"){
													me.clientShortPrefCode = quickPref[i].paramValue1;
													me.clientShortPrefDesc = quickPref[i].displayValue1;
												}
												if(quickPref[i].paramName == "cponRequestState" || quickPref[i].paramName == "statusFilter"){
													me.userStatusPrefCode = quickPref[i].paramValue1;
													me.userStatusPrefDesc = quickPref[i].displayValue1;
													
												}
												if(quickPref[i].paramName == "cponIsSubmitted")
												{
													isSubmitted = quickPref[i].paramValue1;
												}
												if(quickPref[i].paramName == "brandingPkgName"){
													me.userBrandPrefCode = quickPref[i].paramValue1;
													me.userBrandPrefDesc = quickPref[i].displayValue1;
												}
											}
											if(me.userStatusPrefCode != undefined)
											{
												if((me.userStatusPrefCode == 0 || me.userStatusPrefCode == 1 ) && isSubmitted == "Y")
												{
													me.userStatusPrefCode = me.userStatusPrefCode == 0 ? "12" : "14";
												}
												if(me.userStatusPrefCode.length == 4)
												{
									                 me.userStatusPrefCode = "13";
											    }
										    }
										}
								}
							}
				},
	
	/* Retained values assignment to filters*/
	setFilterRetainedValues : function() {
				var me = this;
				var clientSetupView = me.getClientSetupView();
				for(var i=0;i<me.filterData.length;i++)
				{
    				if('client' == me.selectedMst) 
    				{
        				var corporationFilter = clientSetupView.down('AutoCompleter[itemId=corporationFilter]');
        				if(me.filterData[i].paramName == "corporationName")
        				    corporationFilter.setValue(me.corpNamePrefDesc);
        				
        				var clientFilter = clientSetupView.down('AutoCompleter[itemId=clientFilter]');
        				if(me.filterData[i].paramName == "clientName")
        				    clientFilter.setValue(me.clientDescPrefDesc);
        				
        				var clientMciCodeFilter = clientSetupView.down('AutoCompleter[itemId=clientMciCodeFilter]');
        				if(me.filterData[i].paramName == "clientShortCode")
        				    clientMciCodeFilter.setValue(me.clientShortPrefDesc)
    				}
    				
    				if('brandingPackage' == me.selectedMst) 
    				{
        				var corporationFilter = clientSetupView.down('AutoCompleter[itemId=corporationFilter]');
        				if(me.filterData[i].paramName == "brandingPkgName")
        				    corporationFilter.setValue(me.userBrandPrefDesc);
    				}
    			
    				var statusFilter = clientSetupView.down('combo[itemId=statusFilter]');
    				if(!Ext.isEmpty(me.userStatusPrefCode)&&!Ext.isEmpty(me.userStatusPrefDesc))
    				{
    				    if(me.filterData[i].paramName == "cponRequestState") 
    				    {
    					   statusFilter.setValue(me.userStatusPrefCode);
    					   statusFilter.setRawValue(me.userStatusPrefDesc);
    					 }
    				}
				}		
			}
});