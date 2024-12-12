Ext.define('GCP.controller.ProductRuleController', {
	extend : 'Ext.app.Controller',
	requires : [],
	views : ['GCP.view.ProductRuleView','GCP.view.ProductRuleFilterView','GCP.view.ProductRuleGridView','GCP.view.ProductRuleActionBarView','GCP.view.HistoryPopup'],
	/**
	 * Array of configs to build up references to views on page.
	 */
	refs : [{
				ref : 'productRuleView',
				selector : 'productRuleView'
			},{
				ref : 'createNewToolBar',
				selector : 'productRuleView productRuleGridView toolbar[itemId="btnCreateNewToolBar"]'
			},{
				ref : 'productRuleFilterView',
				selector : 'productRuleView productRuleFilterView'
			},{
				ref : 'gridHeader',
				selector : 'productRuleView productRuleGridView panel[itemId="clientSetupDtlView"] container[itemId="gridHeader"]'
			}, {
				ref : 'productRuleGridView',
				selector : 'productRuleView productRuleGridView grid[itemId="gridViewMstId"]'
			}, {
				ref : 'productRuleGridDtlView',
				selector : 'productRuleView productRuleGridView panel[itemId="clientSetupDtlView"]'
			},{
				ref : 'grid',
				selector : 'productRuleGridView smartgrid'
			}, {
				ref : 'groupActionBar',
				selector : 'productRuleView productRuleGridView productRuleActionBarView'
			},{
				ref : 'specificFilterPanel',
				selector : 'productRuleView productRuleFilterView panel container[itemId="specificFilter"]'
			},
			{
				ref : "ruleCodeFilter",
				selector : 'productRuleView productRuleFilterView textfield[itemId="ruleCodeFilter"]'
			},{
				ref : "ruleDescriptionFilter",
				selector : 'productRuleView productRuleFilterView textfield[itemId="ruleDescriptionFilter"]'
			},{
				ref : "sellerCombo",
				selector : 'productRuleView productRuleFilterView combobox[itemId="sellerCombo"]'
			},
			{
				ref : "statusFilter",
				selector : 'productRuleView productRuleFilterView combobox[itemId="statusFilter"]'
			},
			{
				ref : "ruleTypeFilter",
				selector : 'productRuleView productRuleFilterView combobox[itemId="ruleTypeFilter"]'
			},
			{
				ref : 'grid',
				selector : 'productRuleGridView smartgrid'
			}
			],
	config : {
	
					filterData : []					
		},
	/**
	 * A template method that is called when your application boots. It is
	 * called before the Application's launch function is executed so gives a
	 * hook point to run any code before your Viewport is created.
	 */
	init : function() {
		var me = this;
		me.control({
			'productRuleView productRuleGridView toolbar[itemId="btnCreateNewToolBar"] button[itemId="btnCreateRule"]' : {
				click : function() {
					if(ACCESSNEW)
	                 me.handleBankEntryAction(true);
				}
			},
			
			'productRuleView productRuleFilterView' : {
			    render : function() {
			
					me.setInfoTooltip();
					me.handleSpecificFilter();
				}
			},			
			'productRuleView productRuleGridView panel[itemId="clientSetupDtlView"]' : {
				render : function() {
		
					me.handleGridHeader();
					
				}
			},
			'productRuleGridView' : {
				render : function(panel) {
					me.handleSmartGridConfig();
				}
			},
			'productRuleGridView smartgrid' : {
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
			'productRuleGridView toolbar[itemId=AlertGroupActionBarView_subcriptionDtl]' : {
				performGroupAction : function(btn, opts) {
					me.handleGroupActions(btn);
				}
			},
			'productRuleView productRuleFilterView button[itemId="btnFilter"]' : {
				click : function(btn, opts) {
					me.setDataForFilter();
					me.applyFilter();
				}
			}
		});
	},
	
	handleSpecificFilter : function() {
		var me = this;
		var ruleCodeTextField = Ext.create('Ext.ux.gcp.AutoCompleter', {
					fieldCls : 'xn-form-text w165 xn-suggestion-box ux_font-size14-normal',
					cls:'ux_font-size14-normal',
					name : 'ruleCode',
					itemId : 'ruleCodeFilter',
					cfgUrl : 'cpon/cpondependentseek/{0}.json',
					cfgProxyMethodType : 'POST',
					cfgQueryParamName : 'qfilter',
					cfgRecordCount : -1,
					cfgSeekId : 'ruleCodeSeek',
					enableQueryParam:false,
					cfgRootNode : 'd.filter',
					cfgDataNode1 : 'name',
					cfgKeyNode:'value',
					cfgExtraParams : [{
						key : '$filterCode1',
						value : uploadType
					}]
				});
		
		var ruleDescriptionTextField = Ext.create('Ext.ux.gcp.AutoCompleter', {
					fieldCls : 'xn-form-text w165 xn-suggestion-box ux_font-size14-normal',
					cls:'ux_font-size14-normal',
					name : 'ruleDescription',
					itemId : 'ruleDescriptionFilter',
					cfgUrl : 'cpon/cpondependentseek/{0}.json',
					cfgProxyMethodType : 'POST',
					cfgQueryParamName : 'qfilter',
					cfgRecordCount : -1,
					cfgSeekId : 'ruleDescriptionSeek',
					enableQueryParam:false,
					cfgRootNode : 'd.filter',
					cfgDataNode1 : 'name',
					cfgKeyNode:'value',
					cfgExtraParams : [{
						key : '$filterCode1',
						value : uploadType
					}]
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
	/*	var comboStore = Ext.create('Ext.data.Store', {
			fields : ["DESCR", "CODE"],
			proxy : {
				type : 'ajax',
				autoLoad : true,
				url : 'services/userseek/adminSellersListCommon.json',
				actionMethods : {
					read : 'POST'
				},
				reader : {
					type : 'json',
					root : 'd.preferences'
				},
				noCache: false
			}
		}); */	
		var comboStore = Ext.create('Ext.data.Store', {
			fields : ['CODE', 'DESCR'],
			data : storeData,
			reader : {
				type : 'json',
				root : 'preferences'
			}			
		});
		var statusStore = Ext.create('Ext.data.Store', {
			fields : ["name", "value"],
			proxy : {
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
			}
		});
		var ruleTypeStore = null;
		if(uploadType === 'TU'){
			ruleTypeStore = Ext.create('Ext.data.Store', {
				fields : ["name", "value"],
				data: [{"name":"ALL", "value": "ALL"},
			       {"name":getLabel('lblProduct', 'Product'), "value": "TU"},
			       {"name":getLabel('lblVerification', 'Verification'), "value": "CD"}],
				autoload:true
			});
		}
		else{
			var objData = [{"name":"ALL", "value": "ALL"},
				{"name":getLabel('lblProduct', 'Product'), "value": "PU"},
				{"name":getLabel('lblVerification', 'Verification'), "value": "DD"}];
			if(realTimeHoldCheck) {
				objData.push({"name":getLabel('lblFraudCheck', 'Fraud Check'), "value": "FA"});
			}
			ruleTypeStore = Ext.create('Ext.data.Store', {
				fields : ["name", "value"],
				data: objData,
				autoload:true
			});
		}

	var sellerComboField = Ext.create('Ext.form.field.ComboBox', {
			displayField : 'DESCR',
			fieldCls : 'xn-form-field inline_block ux_font-size14-normal ',
			triggerBaseCls : 'xn-form-trigger',
			filterParamName : 'sellerCode',
			itemId : 'sellerCombo',
			valueField : 'CODE',
			name : 'sellerCode',
			editable : false,
			store : comboStore,
			width : 'auto',
			cls:'w165',
			value : strSellerId,
			listeners : {
				'render' : function(combo, record) {
					//combo.setValue(strSellerId);	
					combo.store.load();
				},
				'change' : function(combo, record) {
					strSellerId=combo.getValue();
					setAdminSeller(combo.getValue());
					me.setSellerToRuleCodeAutoCompleterUrl();
				}
			}
		});	
				
		var filterPanel = me.getSpecificFilterPanel();
		if (!Ext.isEmpty(filterPanel))
		{
			filterPanel.removeAll();
		}
		
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
										text : getLabel('seller', 'Financial Institution')
										 //cls : 'xn-custom-button cursor_pointer',
							          }, sellerComboField]
		    		},{
							   xtype : 'container',
							   columnWidth : 0.3,
							   padding : '5px',
						items : [{
									xtype : 'label',
									text : getLabel('ruleCode',
											'Rule Code'),
									cls : 'f13 ux_font-size14  ux_normalmargin-bottom'
								}, ruleCodeTextField]
					}, {
							   xtype : 'container',
							   columnWidth : 0.3,
							   padding : '5px',
						 flex : 1,
						items : [{
									xtype : 'label',
									text : getLabel('ruledesc', 'Rule Description'),
									cls : 'f13 ux_font-size14  ux_normalmargin-bottom'
								}, ruleDescriptionTextField]
					   },{
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
										filterParamName : 'ruleRequestState',
										store : statusStore,
										valueField : 'name',
										displayField : 'value',
										editable : false,
										value : getLabel('all',
												'ALL')
	
									}]

					},{
						   xtype : 'container',
						   columnWidth : 0.3,
						   padding : '5px',
//						columnWidth : 0.4,
						itemId: 'ruleTypePanel',
						items : [{
									xtype : 'label',
									text : getLabel('ruleTytpe', 'Rule Type'),
									hidden : uploadType === 'TU',
									cls : 'f13 ux_font-size14 ux_normalmargin-bottom'
								}, {
									xtype : 'combobox',
									fieldCls : 'xn-form-field inline_block',
									triggerBaseCls : 'xn-form-trigger',
									width : 165,
									itemId : 'ruleTypeFilter',
									filterParamName : 'ruleRequestState',
									store : ruleTypeStore,
									valueField : 'value',
									displayField : 'name',
									editable : false,
									hidden : uploadType === 'TU',
									value : getLabel('all',
											'ALL')

								}]

				},
				{
						   xtype : 'container',
						   columnWidth : 0.3,
						   padding : '5px',
						itemId: 'ruleTypePanelNew',
						items : []

				},
				{
							   xtype : 'container',
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
				
				 if (comboStore.getCount() > 1){ 
			       filterPanel.down('container[itemId="sellerFilter"]').show();
				   filterPanel.down('container[itemId="ruleTypePanelNew"]').hide();
				} 
				else
				{
				filterPanel.down('container[itemId="sellerFilter"]').hide();
				}
					
		
	},

setSellerToRuleCodeAutoCompleterUrl : function() {
		var me = this;
		var ruleCodeAutoCompleter = me.getRuleCodeFilter();
		ruleCodeAutoCompleter.reset();
		ruleCodeAutoCompleter.cfgExtraParams = [{
					key : '$filtercode1',
					value : strSellerId
				}];
	},
setSellerToRuleDescriptionAutoCompleterUrl : function(value) {
		var me = this;
		var sellerCombo = me.getSellerCombo();
		var sellerValue=sellerCombo.getValue();
		var ruleDescriptionAutoCompleter = me.getRuleDescriptionFilter();
		ruleDescriptionAutoCompleter.reset();
		ruleDescriptionAutoCompleter.cfgExtraParams = [{
					key : '$filtercode1',
					value : sellerValue
				    },{key : '$filtercode2',
					  value : value
				}];
},
handleGridHeader : function() {
		var me = this;
		var gridHeaderPanel = me.getGridHeader();
		var createNewPanel = me.getCreateNewToolBar();
		if (!Ext.isEmpty(createNewPanel))
		{
			createNewPanel.removeAll();
		}
		createNewPanel.add(
			{
							xtype : 'button',
							border : 0,
							text : getLabel('createProductRule', 'Create New Rule'),
							cls : 'cursor_pointer ux_button-background ux_button-padding ux_button-background-color ux_button-s',
						    glyph:'xf055@fontawesome',
							parent : this,
							hidden : ACCESSNEW == true ? false : true,
						//	padding : '4 0 2 0',
							itemId : 'btnCreateRule'
						}
		);
	},
 
	handleLoadGridData : function(grid, url, pgSize, newPgNo, oldPgNo, sorter) {
		var me = this;
		var strUrl = grid.generateUrl(url, pgSize, newPgNo, oldPgNo, sorter);
		me.setDataForFilter();
		strUrl = strUrl + me.getFilterUrl() + "&" + csrfTokenName + "=" + csrfTokenValue;
		me.enableDisableGroupActions( '000000000');
		grid.setLoading(true);
		grid.loadGridData(strUrl, null);
	},
	
	getFilterUrl : function() {
		var me = this;
		var strQuickFilterUrl = '';
		strQuickFilterUrl = me.generateUrlWithFilterParams(this);
		return strQuickFilterUrl;
	},
	
	generateUrlWithFilterParams : function(thisClass) {
		var filterData = thisClass.filterData;
		var isFilterApplied = false;
		var strFilter = '&$filter=';
		var strTemp = '';
		var strFilterParam = '';
		for (var index = 0; index < filterData.length; index++) {
			if (isFilterApplied)
				strTemp = strTemp + ' and ';
			switch (filterData[index].operatorValue) {
				case 'bt' :
					strTemp = strTemp + filterData[index].paramName + ' '
							+ filterData[index].operatorValue + ' ' + '\''
							+ filterData[index].paramValue1 + '\'' + ' and '
							+ '\'' + filterData[index].paramValue2 + '\'';
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
					strTemp = strTemp + filterData[index].paramName + ' '
							+ filterData[index].operatorValue + ' ' + '\''
							+ filterData[index].paramValue1 + '\'';
					break;
			}
			isFilterApplied = true;
		}
		if (isFilterApplied)
			strFilter = strFilter + strTemp;
		else
			strFilter = '';
		return strFilter;
	},
	
	setDataForFilter : function() {
		var me = this;
		
		var sellerVal = null, ruleCodeVal = null, ruleDescriptionVal = null, statusVal=null, ruleTypeVal=null, jsonArray = [];
		var isPending = true;
		var ruleSetupFilterView = me.getProductRuleFilterView();
		if(!Ext.isEmpty(ruleSetupFilterView)){
			var ruleCodeFilterId=me.getRuleCodeFilter();
			var ruleDescriptionFilterId=me.getRuleDescriptionFilter();
			
			var sllerComboFilterId=me.getSellerCombo();
			
			if(!Ext.isEmpty(ruleCodeFilterId)){
				ruleCodeVal=ruleCodeFilterId.getValue();
			}
			if(!Ext.isEmpty(ruleDescriptionFilterId)){
				ruleDescriptionVal=ruleDescriptionFilterId.getValue();
			}
			
			if(!Ext.isEmpty(sllerComboFilterId)){
				sellerVal=sllerComboFilterId.getValue();
			}
			
			if (!Ext.isEmpty(ruleCodeVal)) {
			jsonArray.push({
						paramName : 'ruleCode',
						paramValue1 : encodeURIComponent(ruleCodeVal.replace(new RegExp("'", 'g'), "\''")),
						operatorValue : 'eq',
						dataType : 'S'
					});
		}
		if (!Ext.isEmpty(ruleDescriptionVal)) {
			jsonArray.push({
						paramName : 'ruleDescription',
						paramValue1 : encodeURIComponent(ruleDescriptionVal.replace(new RegExp("'", 'g'), "\''")),
						operatorValue : 'eq',
						dataType : 'S'
					});
		}
		if (!Ext.isEmpty(sellerVal)) {
			sellerVal = sellerVal.toUpperCase();
		}
		jsonArray.push({
			paramName : 'sellerCode',
			paramValue1 : encodeURIComponent(sellerVal.replace(new RegExp("'", 'g'), "\''")),
			operatorValue : 'eq',
			dataType : 'S'
		});
	}
		if (!Ext.isEmpty(me.getStatusFilter())
				&& !Ext.isEmpty(me.getStatusFilter().getValue())
				//&& "ALL" != me.getStatusFilter().getValue()
		&& "ALL" != me.getStatusFilter().getValue().toUpperCase()&& getLabel('all','ALL').toUpperCase()!= me.getStatusFilter().getValue().toUpperCase()		
		) {
						
			statusVal = me.getStatusFilter().getValue();
			if(statusVal == 13)
			{
				statusVal  = new Array('5YN','4NN','0NY','1YY');
				isPending = false;
				jsonArray.push({
							paramName : 'statusFilter',
							paramValue1 : statusVal,
							operatorValue : 'in',
							dataType : 'S'
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
				if (statusVal == 12 || statusVal == 14) // 12: New Submitted , 14: Modified Submitted
				{
					statusVal = (statusVal == 12)? 0:1;
					jsonArray.push({
								paramName : 'ruleIsSubmitted',
								paramValue1 : 'Y',
								operatorValue : 'eq',
								dataType : 'S'
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
							paramName : 'ruleIsSubmitted',
							paramValue1 : 'N',
							operatorValue : 'eq',
							dataType : 'S'
						});
			}
			
					jsonArray.push({
								paramName : me.getStatusFilter().filterParamName,
								paramValue1 : statusVal,
								operatorValue : 'eq',
								dataType : 'S'
							});
				
			}
			
		}
		
		if (!Ext.isEmpty(me.getRuleTypeFilter())
				&& !Ext.isEmpty(me.getRuleTypeFilter().getValue())
				//&& "ALL" != me.getRuleTypeFilter().getValue()
		&& "ALL" != me.getRuleTypeFilter().getValue().toUpperCase()&& getLabel('all','ALL').toUpperCase()!= me.getRuleTypeFilter().getValue().toUpperCase()		
		) {
						
			ruleTypeFilter = me.getRuleTypeFilter().getValue();
			if (!Ext.isEmpty(ruleTypeFilter)) {
			jsonArray.push({
						paramName : 'uploadType',
						paramValue1 : encodeURIComponent(ruleTypeFilter.replace(new RegExp("'", 'g'), "\''")),
						operatorValue : 'eq',
						dataType : 'S'
					});
			}
		}
		else{
			if(uploadType === 'TU'){
					jsonArray.push({
						paramName : 'uploadType',
						paramValue1 : ['TU', 'CD'],
						operatorValue : 'in',
						dataType : 'S'
				});
			}
			else{
				var arrParamValue1 = ['PU', 'DD'];
				if(realTimeHoldCheck) {
					arrParamValue1.push('FA');
				}
				jsonArray.push({
					paramName : 'uploadType',
					paramValue1 : arrParamValue1,
					operatorValue : 'in',
					dataType : 'S'
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
		var productRuleGrid = me.getProductRuleGridView();
		var objConfigMap = me.getProductRuleGridConfiguration();
		var arrCols = new Array();
		if (!Ext.isEmpty(productRuleGrid))
			productRuleGrid.destroy(true);

		arrCols = me.getColumns(objConfigMap.arrColsPref,
				objConfigMap.objWidthMap);
		me.handleSmartGridLoading(arrCols, objConfigMap.storeModel);

	},

	handleSmartGridLoading : function(arrCols, storeModel) {
		var me = this;
		var pgSize = null;
		pgSize = 10;
		productRuleGrid = Ext.create('Ext.ux.gcp.SmartGrid', {
					id : 'gridViewMstId',
					itemId : 'gridViewMstId',
					pageSize : pgSize,
					stateful : false,
					showEmptyRow : false,
				//	padding : '5 0 0 0',
					cls : 'ux_largepaddinglr ux_paddingb ux_largemargin-bottom',
					rowList : _AvailableGridSize,
					minHeight : 0,
					columnModel : arrCols,
					storeModel : storeModel,
					isRowIconVisible : me.isRowIconVisible,
					//isRowMoreMenuVisible : me.isRowMoreMenuVisible,
					handleRowMoreMenuClick : me.handleRowMoreMenuClick,

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

		var clntSetupDtlView = me.getProductRuleGridDtlView();
		clntSetupDtlView.add(productRuleGrid);
		clntSetupDtlView.doLayout();
	},
	
	handleRowIconClick : function(tableView, rowIndex, columnIndex, btn, event,
			record) {
		var me = this;
		var actionName = btn.itemId;
		if (actionName === 'submit' || actionName === 'accept'
				|| actionName === 'enable' || actionName === 'disable'
				|| actionName === 'reject' || actionName === 'discard')
			me.handleGroupActions(btn, record);
		else if (actionName === 'btnHistory') {
			var recHistory = record.get('history');
			if (!Ext.isEmpty(recHistory)&& !Ext.isEmpty(recHistory.__deferred.uri)) {
				me.showHistory(record.get('ruleCode'),record.get('history').__deferred.uri, record.get('identifier'));
			}
		} else if (actionName === 'btnView'|| actionName === 'btnEdit') {
			me.submitExtForm(me.getUrlAction(actionName), record, rowIndex);
		}
	},
	getUrlAction : function(actionName) {
		var strURLAction = '';
		if (actionName === 'btnView') {
			if (uploadType === UPLOADTYPE_PU) {
				strURLAction = 'viewProductRuleMaster.form';
			} else {
				strURLAction = 'recViewProductRuleMaster.form';
			}
		} else if (actionName === 'btnEdit') {
			if (uploadType === UPLOADTYPE_PU) {
				strURLAction = 'editProductRuleMaster.form';
			} else {
				strURLAction = 'recEditProductRuleMaster.form';
			}
		}
		return strURLAction;
	},
	submitExtForm : function(strUrl, record, rowIndex) {
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
		me.setFilterParameters(form);
		document.body.appendChild(form);
		form.submit();
	},
			
	showHistory : function(product ,url, id) {
		Ext.create('GCP.view.HistoryPopup', {
					clientName : product,
					historyUrl : url,
					identifier : id
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
			         cfgCol.sortable = false;
				}
				if (!Ext.isEmpty(objCol.colType)) {
					cfgCol.colType = objCol.colType;
					if (cfgCol.colType === "number")
						cfgCol.align = 'right';
				}

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
			width : 80,
			locked : true,
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
						toolTip : getLabel('historyToolTip',
								'View History'),
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
			width : 140,
			locked : true,
			items: [{
						text : getLabel('prfMstActionSubmit', 'Submit'),
						itemId : 'submit',
						actionName : 'submit',
						maskPosition : 5
					}, {
						text : getLabel('prfMstActionDiscard', 'Discard'),
						itemId : 'discard',
						actionName : 'discard',
						maskPosition : 10
					}, {
						text : getLabel('prfMstActionApprove', 'Approve'),
						itemId : 'accept',
						actionName : 'accept',
						maskPosition : 6
					}, {
						text : getLabel('prfMstActionReject', 'Reject'),
						itemId : 'reject',
						actionName : 'reject',
						maskPosition : 7
					}, {
						text : getLabel('prfMstActionEnable', 'Enable'),
						itemId : 'enable',
						actionName : 'enable',
						maskPosition : 8
					}, {
						text : getLabel('prfMstActionDisable',	'Disable'),
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
		var strUrl = Ext.String.format('services/{1}/{0}',
				strAction,strUrlPrefix);
		strUrl = strUrl + '.srvc?';
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
                            if (Ext.isEmpty(text)) {
                                 Ext.Msg.alert(getLabel('errorTitle', 'Error'), getLabel('rejectEmptyErrorMsg',
                                    'Reject Remarks cannot be blank'));
                             }else{
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
							recordDesc :  records[index].data.ruleCode
						});
			}
			if (arrayJson)
				arrayJson = arrayJson.sort(function(valA, valB) {
							return valA.serialNo - valB.serialNo
						});

			Ext.Ajax.request({
						url : strUrl + csrfTokenName + "=" + csrfTokenValue,
						method : 'POST',
						jsonData : Ext.encode(arrayJson),
						success : function(response) {
							// TODO : Action Result handling to be done here
							var errorMessage = '';
						       if(response.responseText != '[]')
						       {
						    	   var jsonData = Ext.decode(response.responseText);
							        if(!Ext.isEmpty(jsonData))
							        {
							        	for(var i =0 ; i<jsonData.length;i++ )
							        	{
							        		var arrError = jsonData[i].errors;
							        		if(!Ext.isEmpty(arrError))
							        		{
							        			for(var j =0 ; j< arrError.length; j++)
									        	{
								        			errorMessage = errorMessage + arrError[j].code +' : '+ arrError[j].errorMessage+"<br/>";
									        	}
							        		}
							        		
							        	}
								        if('' != errorMessage && null != errorMessage)
								        {
								         //Ext.Msg.alert("Error",errorMessage);
								        	Ext.MessageBox.show({
												title : getLabel('instrumentErrorPopUpTitle','Error'),
												msg : errorMessage,
												buttons : Ext.MessageBox.OK,
												cls : 'ux_popup',
												icon : Ext.MessageBox.ERROR
											});
								        } 
							        }
						       }
							me.enableDisableGroupActions('0000000000', true);
							//grid.refreshData();
							me.applyFilter();
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
		if(colId === 'col_uploadType') {
			if(value === 'DD' || value === 'CD') {
				strRetValue = getLabel('lblVerification', 'Verification');
			} else if(value === 'FA') {
				strRetValue = getLabel('lblFraudCheck', 'Fraud Check');
			} else {
				strRetValue = getLabel('lblProduct', 'Product');	
			}
		} else {
			strRetValue = value;
		}
		return strRetValue;
	},

	getProductRuleGridConfiguration : function() {
		var me = this;
		var objConfigMap = null;
		var objWidthMap = null;
		var arrColsPref = null;
		var storeModel = null;
		var strUrl = Ext.String.format('services/{0}.json',strUrlPrefix);
		objWidthMap = {
			"ruleCode" : 220,
			"ruleDescription" : 220,	
			"requestStateDesc" : 220
			};

		arrColsPref = [{	
							"colId" : "ruleCode",
							"colDesc" : getLabel('ruleCode','Rule Code')
							
						}, {
							"colId" : "ruleDescription",
							"colDesc" : getLabel('ruledesc','Rule Description')
							
						},{
							"colId" : "requestStateDesc",
							"colDesc" : getLabel('status','Status')
						}];
			if(uploadType !== 'TU'){
					arrColsPref.push({
						"colId" : "uploadType",
						"colDesc" : getLabel('ruleType','Rule Type'),
						"hidden" : uploadType === 'TU'
					});			
			}

		storeModel = {
					fields : ['ruleCode','ruleDescription', 'productCategoryCode', 'uploadType',
							 'beanName', 'primaryKey','history','identifier','makerId','sellerId','validFlag',
							'requestStateDesc', 'parentRecordKey', 'version','isSubmitted',
							'recordKeyNo', 'masterRecordkeyNo', '__metadata'],
					   proxyUrl : strUrl,
					    rootNode : 'd.profile',
					    totalRowsNode : 'd.__count'
				};

		
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
	handleBankEntryAction : function(entryType) {
		var me = this;
		var form;
		var strUrl = strAddUrl;
		var errorMsg = null;
		form = document.createElement('FORM');
		form.name = 'frmMain';
		form.id = 'frmMain';
		form.method = 'POST';
		form.appendChild(me.createFormField('INPUT', 'HIDDEN',
				csrfTokenName, tokenValue));
		form.appendChild(me.createFormField('INPUT', 'HIDDEN',
				'uploadType', uploadType));
		form.action = strUrl;
		document.body.appendChild(form);
		form.submit();
		document.body.removeChild(form);
	},
	/* Function sets the filter Panel element values in JSON */
	setFilterParameters : function(form) {
		var me = this;
		var drawerNameVal = null;
		var arrJsn = {};
		var productRuleFilterView = me.getProductRuleFilterView();
		arrJsn['sellerId'] =  strSellerId;
		form.appendChild(me.createFormField('INPUT', 'HIDDEN', 'filterData',
				Ext.encode(arrJsn)));
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
							
							var ruleCode='';
							var ruleDescription = '';
							var seller = '';
							
							var productRuleFilterView = me.getProductRuleFilterView();
							
	                        var ruleCodeFilter=me.getRuleCodeFilter()
							
							var ruleDescriptionFilter=me.getRuleDescriptionFilter();
							
	                        if (!Ext.isEmpty(productRuleFilterView.down('combo[itemId="sellerCombo"]')) 
									&& productRuleFilterView.down('combo[itemId="sellerCombo"]') != null) {
								seller=productRuleFilterView.down('combo[itemId="sellerCombo"]').getRawValue();
							} else {
								seller = strSellerId;
							}
	                        
							if (!Ext.isEmpty(ruleCodeFilter)
									&& !Ext.isEmpty(ruleCodeFilter.getValue())) {
								ruleCode =ruleCodeFilter.getRawValue();
							}else
								ruleCode = getLabel('none','None');							
							
							if (!Ext.isEmpty(ruleDescriptionFilter)
									&& !Ext.isEmpty(ruleDescriptionFilter.getValue())) {
								ruleDescription =ruleDescriptionFilter.getRawValue();
							}else
								ruleDescription = getLabel('none','None');
							
							var status = '';
							if (!Ext.isEmpty(me.getStatusFilter())
									&& !Ext.isEmpty(me
											.getStatusFilter()
											.getValue())) {
								var combo = me.getStatusFilter();
								status = combo.getRawValue()
							} else {
								status = getLabel('all', 'All');
							}
							
							var ruleType = '';
							if (!Ext.isEmpty(me.getRuleTypeFilter())
									&& !Ext.isEmpty(me
											.getRuleTypeFilter()
											.getValue())) {
								var combo = me.getRuleTypeFilter();
								ruleType = combo.getRawValue()
							} else {
								ruleType = getLabel('all', 'All');
							}
							
							tip.update(
									getLabel('financialInstitution', 'Financial Institution') + ' : ' + seller+ '<br/>'
									+ getLabel('ruleCode', 'Rule Code') + ' : ' + ruleCode+ '<br/>'
									+ getLabel('ruledesc', 'Rule Description') + ' : ' + ruleDescription+ '<br/>'
									+ getLabel('status', 'Status') + ' : ' + status + '<br/>'
									+ getLabel('ruleType', 'Rule Type') + ' : ' + ruleType);
						}
					}
				});
	}

	
});
