/**
 * @class GCP.controller.DispBankProdClrLocController
 * @extends Ext.app.Controller
 * @author Vivek Bhurke
 */
Ext.define('GCP.controller.DispBankProdClrLocController', {
	extend : 'Ext.app.Controller',
	requires : ['Ext.util.Point'],
	views : ['GCP.view.DispBankProdClrLocView','GCP.view.DispBankProdClrLocFilterView','GCP.view.DispBankProdClrLocGridView','DispBankProdClrLocActionBarView','GCP.view.HistoryPopup'],
	
	refs : [{
			ref : 'dbpclView',
			selector : 'dispBankProdClrLocView'
		},{
			ref : 'createNewToolBar',
			selector : 'dispBankProdClrLocView dispBankProdClrLocGridView toolbar[itemId="btnCreateNewToolBar"]'
		},{
			ref : 'dbpclFilterView',
			selector : 'dispBankProdClrLocView dispBankProdClrLocFilterView'
		},{
			ref : 'gridHeader',
			selector : 'dispBankProdClrLocView dispBankProdClrLocGridView panel[itemId="clientSetupDtlView"] container[itemId="gridHeader"]'
		},{
			ref : 'dbpclGridView',
			selector : 'dispBankProdClrLocView dispBankProdClrLocGridView grid[itemId="gridViewMstId"]'
		},{
			ref : 'dbpclGridDtlView',
			selector : 'dispBankProdClrLocView dispBankProdClrLocGridView panel[itemId="clientSetupDtlView"]'
		},{
			ref : 'grid',
			selector : 'dispBankProdClrLocGridView smartgrid'
		},{
			ref : 'groupActionBar',
			selector : 'dispBankProdClrLocView dispBankProdClrLocGridView dispBankProdClrLocActionBarView'
		},{
			ref : 'specificFilterPanel',
			selector : 'dispBankProdClrLocView dispBankProdClrLocFilterView panel container[itemId="specificFilter"]'
		},{
			ref : "productNameFilter",
			selector : 'dispBankProdClrLocView dispBankProdClrLocFilterView textfield[itemId="productNameFilter"]'
		},{
			ref : "clearingLocationFilter",
			selector : 'dispBankProdClrLocView dispBankProdClrLocFilterView textfield[itemId="clearingLocationFilter"]'
		},{
			ref : "dispatchBankFilter",
			selector : 'dispBankProdClrLocView dispBankProdClrLocFilterView textfield[itemId="dispatchBankFilter"]'
		},{
			ref : "sellerCombo",
			selector : 'dispBankProdClrLocView dispBankProdClrLocFilterView combobox[itemId="sellerCombo"]'
		},{
			ref : "statusFilter",
			selector : 'dispBankProdClrLocView dispBankProdClrLocFilterView combobox[itemId="statusFilter"]'
		}],
	config : {
		filterData : [],
		productNameSelected : false,
		clearingLocationSelected : false,
		dispatchBankSelected : false
	},
	init : function() {
		var me = this;
		me.control({
			'dispBankProdClrLocView dispBankProdClrLocFilterView' : {
			    render : function() {
					me.setInfoTooltip();
					me.handleSpecificFilter();
					me.setDataForFilter();
					me.applyFilter();
				}
			},
			
			'dispBankProdClrLocView dispBankProdClrLocGridView panel[itemId="clientSetupDtlView"]' : {
				render : function() {
					me.handleGridHeader();
				}
			},
			
			'dispBankProdClrLocGridView' : {
				render : function(panel) {
					me.handleSmartGridConfig();
				}
			},
			
			'dispBankProdClrLocGridView smartgrid' : {
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
			
			'dispBankProdClrLocGridView toolbar[itemId=dispBankProdClrLocActionBarView]' : {
				performGroupAction : function(btn, opts) {
					me.handleGroupActions(btn);
				}
			},
			
			'dispBankProdClrLocView dispBankProdClrLocFilterView button[itemId="btnFilter"]' : {
				click : function(btn, opts) {
					me.setDataForFilter();
					me.applyFilter();
				}
			},
			
			'dispBankProdClrLocView dispBankProdClrLocGridView toolbar[itemId="btnCreateNewToolBar"] button[itemId="btnDbpclCreateNew"]' : {
				click : function() {
	                 me.handleBankServiceSetupEntryAction();
				}
			}
		});
	},
	setInfoTooltip : function() {
		var me = this;
		Ext.create('Ext.tip.ToolTip', {
			target : 'imgFilterInfo',
			listeners : {
				beforeshow : function(tip) {
					var sellerFilter = '';
					var dispBankName='';
					var productName = '';
					var clrLocName = '';
					var statusFilter = '';
					
					var sllerComboFilterId=me.getSellerCombo();
					var dispatchBankFilter=me.getDispatchBankFilter();
					var productNameFilter=me.getProductNameFilter();
					var clearingLocationFilter=me.getClearingLocationFilter();
					var statusFilterId = me.getStatusFilter();
					
					if (!Ext.isEmpty(sllerComboFilterId)
							&& !Ext.isEmpty(sllerComboFilterId.getValue()))
						sellerFilter = sllerComboFilterId.getRawValue();
					else
						sellerFilter = getLabel( 'all', 'All' );
					
					if (!Ext.isEmpty(dispatchBankFilter)
							&& !Ext.isEmpty(dispatchBankFilter.getValue()))
						dispBankName = dispatchBankFilter.getRawValue();
					else
						dispBankName = getLabel( 'all', 'All' );
					
					if (!Ext.isEmpty(productNameFilter)
							&& !Ext.isEmpty(productNameFilter.getValue()))
						productName = productNameFilter.getRawValue();
					else
						productName = getLabel( 'all', 'All' );
					
					if (!Ext.isEmpty(clearingLocationFilter)
							&& !Ext.isEmpty(clearingLocationFilter.getValue()))
						clrLocName = clearingLocationFilter.getRawValue();
					else
						clrLocName = getLabel( 'all', 'All' );
					
					if( !Ext.isEmpty(statusFilterId) && !Ext.isEmpty(statusFilterId.getRawValue()))
						statusFilter = statusFilterId.getRawValue()
					else
						statusFilter = getLabel( 'all', 'All' );
					
					tip.update(getLabel('seller', 'Financial Institution') + ' : '
							+ sellerFilter + '<br/>'
							+ getLabel('partnerBank', 'Partner Bank') + ' : '
							+ dispBankName + '<br/>'
							+ getLabel('product', 'Product') + ' : '
							+ productName + '<br/>'
							+ getLabel('clrLoc', 'Clearing Location') + ' : '
							+ clrLocName + '<br/>'
							+ getLabel('status', 'Status') + ' : '
							+ statusFilter  + '<br/>');
				}
			}
		});
	},
	handleSpecificFilter : function() {
		var me = this;
		var storeData;
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
		
		var productNameAuto = Ext.create('Ext.ux.gcp.AutoCompleter', {
			fieldCls : 'xn-form-text w165 xn-suggestion-box ux_font-size14-normal',
			cls:'ux_font-size14-normal',
			name : 'productName',
			itemId : 'productNameFilter',
			cfgUrl : 'services/userseek/{0}.json',
			cfgProxyMethodType : 'POST',
			cfgQueryParamName : '$autofilter',
			cfgRecordCount : -1,
			cfgSeekId : 'dispatchBankProductFilterSeek',
			enableQueryParam:false,
			cfgRootNode : 'd.preferences',
			cfgDataNode1 : 'DESCR',
			cfgKeyNode:'CODE',
			matchFieldWidth:true,
			listeners:{
				'select' : function(combo, record) {
					//var newValue = combo.getValue();
					//me.setProductToClrLocAutoCompleterUrl(newValue);
					me.productNameSelected = true;
				},
				'change' : function(combo, record) {
				     var newValue = combo.getValue();
				     if(Ext.isEmpty(newValue)){
				    	 me.clearClrLocAutoCompleterUrl();
				     }
				     me.productNameSelected = false;
				}
			}
		});
		
		var clearingLocationAuto = Ext.create('Ext.ux.gcp.AutoCompleter', {
			fieldCls : 'xn-form-text w165 xn-suggestion-box ux_font-size14-normal',
			cls:'ux_font-size14-normal',
			name : 'cleatingLocation',
			itemId : 'clearingLocationFilter',
			cfgUrl : 'services/userseek/{0}.json',
			cfgProxyMethodType : 'POST',
			cfgQueryParamName : '$autofilter',
			cfgRecordCount : -1,
			matchFieldWidth:true,
			cfgSeekId : 'dispatchBankClrLocFilterSeek',
			enableQueryParam:false,
			cfgRootNode : 'd.preferences',
			cfgDataNode1 : 'DESCR',
			cfgKeyNode:'CODE',
			listeners:{
				'select' : function(combo, record) {
					me.clearingLocationSelected = true;
				},
				'change' : function(combo, record) {
				     me.clearingLocationSelected = false;
				}
			}
		});
		
		var dispatchBankAuto = Ext.create('Ext.ux.gcp.AutoCompleter', {
			fieldCls : 'xn-form-text w165 xn-suggestion-box ux_font-size14-normal',
			cls:'ux_font-size14-normal',
			name : 'dispatchBank',
			itemId : 'dispatchBankFilter',
			cfgUrl : 'services/userseek/{0}.json',
			cfgProxyMethodType : 'POST',
			cfgQueryParamName : '$autofilter',
			cfgRecordCount : -1,
			matchFieldWidth:true,
			cfgSeekId : 'dispatchBankSeek',
			enableQueryParam:false,
			cfgRootNode : 'd.preferences',
			cfgDataNode1 : 'DESCR',
			cfgKeyNode:'CODE',
			listeners:{
				'select' : function(combo, record) {
					//var newValue = combo.getValue();
					//me.setDispBankToProdNameAutoCompleterUrl(newValue);
					me.dispatchBankSelected = true;
				},
				'change' : function(combo, record) {
					var newValue = combo.getValue();
					if(Ext.isEmpty(newValue)){
						me.clearProdNameAutoCompleterUrl();
					}
					me.dispatchBankSelected = false;
				}
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
			value : strSellerId,
			width : 165,
			listeners : {
				'render' : function(combo, record) {
					combo.store.load();
					var productNameAutoCompleter = me.getProductNameFilter();
					productNameAutoCompleter.reset();
					/*productNameAutoCompleter.cfgExtraParams = [{
						key : '$filtercode1',
						value : strSellerId
					}];*/
					
					var clearingLocationAutoCompleter = me.getClearingLocationFilter();
					clearingLocationAutoCompleter.reset();
					/*clearingLocationAutoCompleter.cfgExtraParams = [{
						key : '$filtercode1',
						value : strSellerId
					}];*/
					
					var dispatchBankAutoCompleter = me.getDispatchBankFilter();
					dispatchBankAutoCompleter.reset();
					/*dispatchBankAutoCompleter.cfgExtraParams = [{
						key : '$filtercode1',
						value : strSellerId
					}];*/
					
				},
				'change' : function(combo, record) {
					var strSellerId=combo.getValue();
					setAdminSeller(strSellerId);
					// TODO : need to check whether it is required
					//me.setSellerToBankAutoCompleterUrl();

					var productNameAutoCompleter = me.getProductNameFilter();
					productNameAutoCompleter.reset();
					/*productNameAutoCompleter.cfgExtraParams = [{
						key : '$filtercode1',
						value : strSellerId
					}];*/
					
					var clearingLocationAutoCompleter = me.getClearingLocationFilter();
					clearingLocationAutoCompleter.reset();
					/*clearingLocationAutoCompleter.cfgExtraParams = [{
						key : '$filtercode1',
						value : strSellerId
					}];*/
					
					var dispatchBankAutoCompleter = me.getDispatchBankFilter();
					dispatchBankAutoCompleter.reset();
					/*dispatchBankAutoCompleter.cfgExtraParams = [{
						key : '$filtercode1',
						value : strSellerId
					}];	*/				
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
			          }, sellerComboField]
			},{
				   xtype : 'container',
				   columnWidth : 0.3,
				   padding : '5px',
				   flex : 1,
				   items : [{
						xtype : 'label',
						text : getLabel('dbpclDispatchBank',
								'Partner Bank'),
						cls : 'f13 ux_font-size14  ux_normalmargin-bottom'
					}, dispatchBankAuto]
			},{
			   xtype : 'container',
			   columnWidth : 0.3,
			   padding : '5px',
			   items : [{
					xtype : 'label',
					text : getLabel('dbpclProductName',
							'Product'),
					cls : 'f13 ux_font-size14  ux_normalmargin-bottom'
				}, productNameAuto]
			},{
			   xtype : 'container',
			   columnWidth : 0.3,
			   padding : '5px',
			   flex : 1,
			   items : [{
					xtype : 'label',
					text : getLabel('dbpclClearingLocation',
							'Clearing Location'),
					cls : 'f13 ux_font-size14  ux_normalmargin-bottom'
				}, clearingLocationAuto]
			},{
			   xtype : 'container',
			   columnWidth : 0.3,
			   padding : '5px',
			   itemId: 'statusFilterPanel',
			   items : [{
					xtype : 'label',
					text : getLabel('status', 'Status'),
					cls : 'f13 ux_font-size14 ux_normalmargin-bottom'
				},{
					xtype : 'combobox',
					fieldCls : 'xn-form-field inline_block',
					triggerBaseCls : 'xn-form-trigger',
					width : 165,
					itemId : 'statusFilter',
					filterParamName : 'bankRequestState',
					store : statusStore,
					valueField : 'name',
					displayField : 'value',
					editable : false,
					value : getLabel('all',
							'ALL')
					}]
				},{
					xtype : 'container',
					padding : '5px',
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
			if(store.getCount()===1) {
				filterPanel.down('container[itemId="sellerFilter"]').hide();
			} else {	
				filterPanel.down('container[itemId="sellerFilter"]').show();
			}
		});
	},
	
	setDataForFilter : function() {
		var me = this;
		var sellerValue = null, dispatchBankVal = null, dispatchBankRawVal = null, productNameVal = null, productNameRawVal = null, clearingLocationVal = null, clearingLocationRawVal = null, statusVal = null;
		var jsonArray = [];
		var dbpclFilterView = me.getDbpclFilterView();
		var isPending = true;
		if(!Ext.isEmpty(dbpclFilterView)){
			var sellerFilter = me.getSellerCombo();
			var dispatchBankFilter=me.getDispatchBankFilter();
			var productNameFilter=me.getProductNameFilter();
			var clearingLocationFilter=me.getClearingLocationFilter();
			
			if(!Ext.isEmpty(sellerFilter)){
				sellerValue = sellerFilter.getValue();
			}
			
			if(!Ext.isEmpty(dispatchBankFilter)){
				if(me.dispatchBankSelected === true){
					dispatchBankVal = dispatchBankFilter.getValue();
				} else {
					dispatchBankRawVal = dispatchBankFilter.getValue();
				}
			}
			
			if(!Ext.isEmpty(productNameFilter)){
				if(me.productNameSelected === true){
					productNameVal = productNameFilter.getValue();
				} else {
					productNameRawVal = productNameFilter.getValue();
				}
			}
			
			if(!Ext.isEmpty(clearingLocationFilter)){
				if(me.clearingLocationSelected === true){
					clearingLocationVal = clearingLocationFilter.getValue();
				} else {
					clearingLocationRawVal = clearingLocationFilter.getValue();
				}
			}
			
			if (!Ext.isEmpty(sellerValue)) {
				jsonArray.push({
					paramName : 'sellerCode',
					paramValue1 : encodeURIComponent(sellerValue.replace(new RegExp("'", 'g'), "\''")),
					operatorValue : 'eq',
					dataType : 'S'
				});
			}
			
			if (!Ext.isEmpty(dispatchBankVal)) {
				jsonArray.push({
					paramName : 'dispBankCode',
					paramValue1 : encodeURIComponent(dispatchBankVal.replace(new RegExp("'", 'g'), "\''")),
					operatorValue : 'eq',
					dataType : 'S'
				});
			}
			
			if (!Ext.isEmpty(productNameVal)) {
				jsonArray.push({
					paramName : 'productCode',
					paramValue1 : encodeURIComponent(productNameVal.replace(new RegExp("'", 'g'), "\''")),
					operatorValue : 'eq',
					dataType : 'S'
				});
			}
			
			if (!Ext.isEmpty(clearingLocationVal)) {
				jsonArray.push({
					paramName : 'clrLocCode',
					paramValue1 : encodeURIComponent(clearingLocationVal.replace(new RegExp("'", 'g'), "\''")),
					operatorValue : 'eq',
					dataType : 'S'
				});
			}
		}
		if (!Ext.isEmpty(dispatchBankRawVal)) {
			jsonArray.push({
				paramName : 'dispBankDesc',
				paramValue1 : encodeURIComponent(dispatchBankRawVal.toUpperCase().replace(new RegExp("'", 'g'), "\''")),
				operatorValue : 'lk',
				dataType : 'S'
			});
		}
		
		if (!Ext.isEmpty(productNameRawVal)) {
			jsonArray.push({
				paramName : 'dbpclProductDesc',
				paramValue1 : encodeURIComponent(productNameRawVal.toUpperCase().replace(new RegExp("'", 'g'), "\''")),
				operatorValue : 'lk',
				dataType : 'S'
			});
		}
		
		if (!Ext.isEmpty(clearingLocationRawVal)) {
			jsonArray.push({
				paramName : 'clrLocDesc',
				paramValue1 : encodeURIComponent(clearingLocationRawVal.toUpperCase().replace(new RegExp("'", 'g'), "\''")),
				operatorValue : 'lk',
				dataType : 'S'
			});
		}
		
		if (!Ext.isEmpty(me.getStatusFilter())
				&& !Ext.isEmpty(me.getStatusFilter().getValue())
				&& getLabel('all', 'All').toLowerCase() != me.getStatusFilter().getValue().toLowerCase())
		{
			statusVal = me.getStatusFilter().getValue();
			if(statusVal ==  13)
			{
				statusVal = new Array('5YN','4NN','0NY','1YY');
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
            if (isPending)
			{
			    if (statusVal == 12 || statusVal == 3 || statusVal == 14) {
				if (statusVal == 12 || statusVal == 14) //12:New  Submitted //14:Modified Submitted
				{
					statusVal = (statusVal == 12) ? 0:1;
					jsonArray.push({
						paramName : 'branchIsSubmitted',
						paramValue1 : 'Y',
						operatorValue : 'eq',
						dataType : 'S'
					});
				} else {// Valid/Authorized
					jsonArray.push({
						paramName : 'validFlag',
						paramValue1 : 'Y',
						operatorValue : 'eq',
						dataType : 'S'
					});
				}
			} else if (statusVal == 11) {// Disabled
				statusVal = 3;
				jsonArray.push({
					paramName : 'validFlag',
					paramValue1 : 'N',
					operatorValue : 'eq',
					dataType : 'S'
				});
			}  
			else if (statusVal == 0 || statusVal == 1) {// New and Modified
				jsonArray.push({
					paramName : 'branchIsSubmitted',
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
	
	handleGridHeader : function() {
		var me = this;
		if(ACCESSNEW){
			var createNewPanel = me.getCreateNewToolBar();
			if (!Ext.isEmpty(createNewPanel))
			{
				createNewPanel.removeAll();
			}
			createNewPanel.add({
				xtype : 'button',
				border : 0,
				text : getLabel('dbpclCreateNew', 'Bank Service Setup Entry'),
				cls : 'cursor_pointer ux_button-background ux_button-padding ux_button-background-color ux_button-s',
				glyph:'xf055@fontawesome',
				parent : this,
				itemId : 'btnDbpclCreateNew',
				disabled : true,
				hidden : true
			});
		}
	},
	
	handleSmartGridConfig : function() {
		var me = this;
		var dbpclGrid = me.getDbpclGridView();
		var objConfigMap = me.getDispBankProdClrLocGridConfiguration();
		var arrCols = null;
		if (!Ext.isEmpty(dbpclGrid))
			dbpclGrid.destroy(true);
		arrCols = me.getColumns(objConfigMap.arrColsPref,
				objConfigMap.objWidthMap);
		me.handleSmartGridLoading(arrCols, objConfigMap.storeModel);
	},
	
	getDispBankProdClrLocGridConfiguration : function(){
		var objConfigMap = null;
		var objWidthMap = null;
		var arrColsPref = null;
		var storeModel = null;
		
		objWidthMap = {
				"dbpclProductDesc" : 210,
				"clrLocDesc" : 210,
				"dispAllocPriority" : 55,
				"ctrlBranchDesc" : 210,
				"dispBankDesc" : 200,
				"requestStateDesc" : 100
			};
			
			arrColsPref = [{	
				"colId" : "dispBankDesc",
				"colDesc" : getLabel("dbpclDispatchBank","Dispatch Bank")
			},{	
				"colId" : "dbpclProductDesc",
				"colDesc" : getLabel("productName","Product")
			},{	
				"colId" : "clrLocDesc",
				"colDesc" : getLabel("clearingLocation","Clearing Location")
			},{	
				"colId" : "dispAllocPriority",
				"colDesc" : getLabel("priority","Priority"),
				"colType" : "number"
			},{	
				"colId" : "ctrlBranchDesc",
				"colDesc" : getLabel("serviceBranch","Service Branch")
			},{
				"colId" : "requestStateDesc",
				"colDesc" : getLabel("status","Status")
			}];
			
			storeModel = {
					fields : ['productCode','clrLocCode', 'ctrlBranchCode', 'dispBankCode',
					      'dbpclProductDesc','clrLocDesc','ctrlBranchDesc','dispBankDesc','dispAllocPriority',
				          'beanName', 'primaryKey','history','identifier','makerId','sellerId','state','validFlag',
				          'requestStateDesc', 'parentRecordKey', 'version','isSubmitted',
				          'recordKeyNo', 'masterRecordkeyNo', '__metadata'],
				proxyUrl : 'cpon/dispBankProdClrLocMst.json',
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
				cfgCol.lockable = true;
				cfgCol.draggable = true;
				cfgCol.locked = false;
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

				cfgCol.width = !Ext.isEmpty(objWidthMap[objCol.colId])
						? objWidthMap[objCol.colId]
						: 120;

				cfgCol.fnColumnRenderer = me.columnRenderer;
				arrCols.push(cfgCol);
			}
		}
		return arrCols;
	},
	
	createGroupActionColumn : function() {
		var objActionCol = {
			colType : 'actioncontent',
			colId : 'groupaction',
			width : 120,
			locked : true,
			items: [{
				text : getLabel('dbpclActionSubmit', 'Submit'),
				itemId : 'submit',
				actionName : 'submit',
				maskPosition : 5
			}, {
				text : getLabel('dbpclActionDiscard', 'Discard'),
				itemId : 'discard',
				actionName : 'discard',
				maskPosition : 10
			}, {
				text : getLabel('dbpclActionApprove', 'Approve'),
				itemId : 'accept',
				actionName : 'accept',
				maskPosition : 6
			}, {
				text : getLabel('dbpclActionReject', 'Reject'),
				itemId : 'reject',
				actionName : 'reject',
				maskPosition : 7
			}, {
				text : getLabel('dbpclActionEnable', 'Enable'),
				itemId : 'enable',
				actionName : 'enable',
				maskPosition : 8
			}, {
				text : getLabel('dbpclActionSuspend', 'Suspend'),
				itemId : 'disable',
				actionName : 'disable',
				maskPosition : 9
			}]
		};
		return objActionCol;
	},
	
	createActionColumn : function() {
		var objActionCol = {
			colType : 'actioncontent',
			colId : 'action',			
			width : 85,
			locked : true,
			items : [{
				itemId : 'btnEdit',
				itemCls : 'grid-row-action-icon icon-edit',
				toolTip : getLabel('editToolTip', 'Edit Record'),
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
	
	handleSmartGridLoading : function(arrCols, storeModel) {
		var me = this;
		var pgSize = null;
		pgSize = 10;
		var dispBankProdClrLocGrid = Ext.create('Ext.ux.gcp.SmartGrid', {
			id : 'gridViewMstId',
			itemId : 'gridViewMstId',
			pageSize : pgSize,
			stateful : false,
			showEmptyRow : false,
			cls : 'ux_largepaddinglr ux_paddingb ux_largemargin-bottom',
			rowList : _AvailableGridSize,
			minHeight : 0,
			columnModel : arrCols,
			storeModel : storeModel,
			isRowIconVisible : me.isRowIconVisible,
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

		var dbpclGridDtlView = me.getDbpclGridDtlView();
		dbpclGridDtlView.add(dispBankProdClrLocGrid);
		dbpclGridDtlView.doLayout();
	},
	
	isRowIconVisible : function(store, record, jsonData, itmId, maskPosition) {
		var maskSize = 11;
		var maskArray = new Array();
		var actionMask = '';
		var rightsMap = record.data.__metadata.__rightsMap;
		var buttonMask = '';
		var retValue = true;
		var bitPosition = '';
		var reqState = null, submitFlag = null, validFlag = null;
		if (!Ext.isEmpty(maskPosition)) {
			bitPosition = parseInt(maskPosition,10) - 1;
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
			reqState = record.raw.requestState;
			submitFlag = record.raw.isSubmitted;
			validFlag = record.raw.validFlag;
			var isDisabled = (reqState === 3 && validFlag == 'N');
			var isSubmitModified = (reqState === 1 && submitFlag == 'Y');
			retValue = retValue && (!isDisabled) && (!isSubmitModified);
		} else if (maskPosition === 10 && retValue) {
			reqState = record.raw.requestState;
			submitFlag = record.raw.isSubmitted;
			var submitResult = (reqState === 0 && submitFlag == 'Y');
			retValue = retValue && (!submitResult);
		}else if (maskPosition === 8 && retValue) {
			validFlag = record.raw.validFlag;
			reqState = record.raw.requestState;
			retValue = retValue && (reqState == 3 && validFlag == 'N');
		}
		else if (maskPosition === 9 && retValue) {
			validFlag = record.raw.validFlag;
			reqState = record.raw.requestState;
			retValue = retValue && (reqState == 3 && validFlag == 'Y');
		}
		return retValue;
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
				me.showHistory(record.get('dispBankDesc'),record.get('history').__deferred.uri, record.get('identifier'),record.get('dbpclProductDesc'), record.get('clrLocDesc'));
			}
		} else if (actionName === 'btnView') {
			me.submitExtForm('viewDispBankProdClrLocMst.form', record, rowIndex);
		} else if (actionName === 'btnEdit') {
			me.submitExtForm('editDispBankProdClrLocMst.form', record, rowIndex);
		}
	},
	
	handleGroupActions : function(btn, record) {
		var me = this;
		var strAction = !Ext.isEmpty(btn.actionName)
				? btn.actionName
				: btn.itemId;
		var strUrl = Ext.String.format('cpon/dispBankProdClrLocMst/{0}.srvc?',
				strAction);
		if (strAction === 'reject') {
			me.showRejectVerifyPopUp(strAction, strUrl,record);
		} else {
			me.preHandleGroupActions(strUrl, '',record);
		}
	},
	
	showRejectVerifyPopUp : function(strAction, strActionUrl,record) {
		var me = this;
		var titleMsg = '', fieldLbl = '';
		if (strAction === 'reject') {
			fieldLbl = getLabel('dbpclRemarkPopupTitle',
					'Please enter reject remark');
			titleMsg = getLabel('dbpclRemarkPopupFieldLabel', 'Reject Remark');
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
				if (btn == 'ok') 
				{
					if(Ext.isEmpty(text))
					{
						Ext.Msg.alert(getLabel( 'errorTitle', 'Error' ), getLabel( 'rejectEmptyErrorMsg', 'Reject Remarks cannot be blank' ));
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
		if (!Ext.isEmpty(grid)) {
			var arrayJson = new Array();
			var records = grid.getSelectedRecords();
			records = (!Ext.isEmpty(records) && Ext.isEmpty(record))
					? records : [record];
			for (var index = 0; index < records.length; index++) {
				arrayJson.push({
					serialNo : grid.getStore().indexOf(records[index]) + 1,
					identifier : records[index].data.identifier,
					userMessage : remark
					// TODO : need to check recordDesc is required
					//recordDesc: records[index].data.draweeBranchDescription
				});
			}
			if (arrayJson){
				arrayJson = arrayJson.sort(function(valA, valB) {
					return valA.serialNo - valB.serialNo
				});
			}

			Ext.Ajax.request({
				url : strUrl + csrfTokenName + "=" + csrfTokenValue,
				method : 'POST',
				jsonData : Ext.encode(arrayJson),
				success : function(response) {
					var errorMessage = '';
					if(response.responseText != '[]') {
						var jsonData = Ext.decode(response.responseText);
						if(!Ext.isEmpty(jsonData)) {
							for(var i =0 ; i<jsonData.length;i++ ) {
								var arrError = jsonData[i].errors;
								if(!Ext.isEmpty(arrError)) {
									for(var j =0 ; j< arrError.length; j++) {
										errorMessage = errorMessage + arrError[j].code +' : '+ arrError[j].errorMessage+"<br/>";
									}
								}
							}
							if('' != errorMessage && null != errorMessage) {
								Ext.MessageBox.show({
									title : getLabel('errorPopUpTitle','Error'),
									msg : errorMessage,
									buttons : Ext.MessageBox.OK,
									cls : 'ux_popup',
									icon : Ext.MessageBox.ERROR
								});
							} 
						}
					}
					me.enableDisableGroupActions('0000000000', true);
					grid.refreshData();
				},
				failure : function() {
					Ext.MessageBox.show({
						title : getLabel('errorPopUpTitle','Error'),
						msg : getLabel('errorPopUpMsg','Error while fetching data..!'),
						buttons : Ext.MessageBox.OK,
						icon : Ext.MessageBox.ERROR
					});
				}
			});
			}
	},
	
	enableDisableGroupActions : function(actionMask, isSameUser, isDisabled, isSubmit) {
		var actionBar = this.getGroupActionBar();
		var blnEnabled = false, strBitMapKey = null, arrItems = null;
		if (!Ext.isEmpty(actionBar) && !Ext.isEmpty(actionBar.items.items)) {
			arrItems = actionBar.items.items;
			Ext.each(arrItems, function(item) {
				strBitMapKey = parseInt(item.maskPosition,10) - 1;
				if (strBitMapKey) {
					blnEnabled = isActionEnabled(actionMask, strBitMapKey);
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
	
	handleLoadGridData : function(grid, url, pgSize, newPgNo, oldPgNo, sorter) {
		var me = this;
		var strUrl = grid.generateUrl(url, pgSize, newPgNo, oldPgNo, sorter);
		strUrl = strUrl + me.getFilterUrl();
		grid.loadGridData(strUrl, null);
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
	
	/*setDispBankToProdNameAutoCompleterUrl : function(dispBank){
		var me = this;
		var sellerCombo = me.getSellerCombo();
		var sellerValue=sellerCombo.getValue();
		var productNameAutoCompleter = me.getProductNameFilter();
		productNameAutoCompleter.reset();
		productNameAutoCompleter.cfgExtraParams = [{
			key : '$sellerCode',
			value : sellerValue
		},{
			key : '$filtercode1',
			value : dispBank
		}];
	},*/
	
	/*setProductToClrLocAutoCompleterUrl : function(productCode){
		var me = this;
		var sellerCombo = me.getSellerCombo();
		var sellerValue=sellerCombo.getValue();
		var clrLocAutoCompleter = me.getClearingLocationFilter();
		clrLocAutoCompleter.reset();
		clrLocAutoCompleter.cfgExtraParams = [{
			key : '$sellerCode',
			value : sellerValue
		},{
			key : '$filtercode1',
			value : productCode
		}];
	},*/
	
	clearClrLocAutoCompleterUrl : function(){
		var me = this;
		var sellerCombo = me.getSellerCombo();
		var sellerValue=sellerCombo.getValue();
		var clrLocAutoCompleter = me.getClearingLocationFilter();
		clrLocAutoCompleter.reset();
		clrLocAutoCompleter.cfgExtraParams = [{
			key : '$sellerCode',
			value : sellerValue
		}];
	},
	
	clearProdNameAutoCompleterUrl : function(){
		var me = this;
		var sellerCombo = me.getSellerCombo();
		var sellerValue=sellerCombo.getValue();
		var productNameAutoCompleter = me.getProductNameFilter();
		productNameAutoCompleter.reset();
		productNameAutoCompleter.cfgExtraParams = [{
			key : '$sellerCode',
			value : sellerValue
		}];
	},
	
	submitExtForm : function(strUrl, record, rowIndex) {
		var me = this;
		var viewState = record.data.identifier;
		var form;

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
		//me.setFilterParameters(form);
		document.body.appendChild(form);
		form.submit();
	},
	
	setFilterParameters : function(form) {
		var me = this;
		var arrJsn = {};
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
	showHistory : function(partnerBank ,url, id, product, clearingLocation) {
		Ext.create('GCP.view.HistoryPopup', {
					partnerBank : partnerBank,
					product : product,
					clearingLocation : clearingLocation,
					historyUrl : url,
					identifier : id
				}).show();
	},
	handleBankServiceSetupEntryAction : function(){
		var me = this;
		var form;
		var strUrl = 'addDispBankProdClrLocMst.form';
		form = document.createElement('FORM');
		form.name = 'frmMain';
		form.id = 'frmMain';
		form.method = 'POST';
		form.appendChild(me.createFormField('INPUT', 'HIDDEN',
				csrfTokenName, tokenValue));
		form.action = strUrl;
		document.body.appendChild(form);
		form.submit();
		document.body.removeChild(form);
	},
	columnRenderer : function(value, meta, record, rowIndex, colIndex, store,
			view, colId){
		var strRetVal = value;
		if(colId === 'col_requestStateDesc'){
			if(!Ext.isEmpty(strRetVal)) {
				meta.tdAttr = 'title="' + strRetVal + '"';
			}
		}
		return strRetVal;
	}
});