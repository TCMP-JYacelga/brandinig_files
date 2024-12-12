/**
 * @class Ext.ux.gcp.TransactionCenter
 * @extends Ext.panel.Panel
 * @author Vinay Thube
 */
Ext.define('Ext.ux.gcp.TransactionCenter', {
	extend : 'Ext.panel.Panel',
	xtype : 'transactioncenter',
	requires : [ 'Ext.ux.gcp.SmartGrid', 'Ext.ux.gcp.AdvancedFilter',
			'Ext.ux.gcp.ActionResult','Ext.ux.gcp.SmartGridActionBar',
			'Ext.data.Store','Ext.form.Label', 'Ext.toolbar.Spacer',
			'Ext.form.field.ComboBox','Ext.toolbar.Toolbar' ],

	autoHeight : true,
	width : 'auto',
	gridModel : null,
	advancedFilterModel : null,
	actionItems : [],
	quickFilterItems : [],
	actionResultModel : null,
    maskSize : 20,
    defaultMask : '',
	
	filterApplied : 'Q',
	grid : null,
	advanceFilter : null,
	actionResult : null,
	filterItems : [],
	actions : [],
	
	initComponent : function() {
		var me = this;
		var objGrid = null;
		var objAdvFilter = null;
		var objQuickFilter = null;
		var objActionBar = null;
		var objContentPanel = null;
		var objActionResult = null;
		var items = new Array();
		
		me.generateDefaultMask();
		objGrid = me.createGrid();
		me.grid = objGrid;
		objAdvFilter = me.createAdvancedFilter();
		me.advanceFilter = objAdvFilter;
		objQuickFilter = me.createQuickFilter();
		objActionBar = me.createActionBar();
		objContentPanel = me.createContentPanel(objQuickFilter,objActionBar);
		if(Ext.isEmpty(me.actionResult)) {
				objActionResult = me.createActionResult();
				me.actionResult = objActionResult;
			}
		else objActionResult = me.actionResult;
		if(!Ext.isEmpty(objActionResult))
			items.push(objActionResult);
		if(!Ext.isEmpty(objAdvFilter))
			items.push(objAdvFilter);
		if(!Ext.isEmpty(objContentPanel))
			items.push(objContentPanel);
		if(!Ext.isEmpty(objGrid))
			items.push(objGrid);
		me.items = items;
		Ext.EventManager.onWindowResize(function(w, h) {
				me.doComponentLayout();
			});
		me.on('resize',function(){me.doLayout();});
		me.callParent(arguments);
	},
	createAdvancedFilter : function() {
		var me = this;
		var filter = null;
		var model = me.advancedFilterModel;
		if(!Ext.isEmpty(model))
			{
				filter = Ext.create('Ext.ux.gcp.AdvancedFilter',{
					getFilterUrl : model.getFilterUrl,
					saveFilterUrl : model.saveFilterUrl,
					filterModel : model.filterModel,
					id : !Ext.isEmpty(model.id) ? model.id : me.id+'_advFilter',
					listeners : {
						applyAdvancedFilter : function(objAdvFilter,filterdata){
							me.applyAdvancedFilter(objAdvFilter,filterdata);
						},
						resetAdvancedFilter : function(){
							//if(me.filterApplied === 'A')
								me.applyQuickFilter();
						}
					}
					});
			}

		return filter;
	},
	createGrid : function() {
		var me = this;
		var grid = null;
		var model = me.gridModel;
		if (!Ext.isEmpty(model)) {
			
			var gridId = !Ext.isEmpty(model.id) ? model.id :  me.id+'_txnGrid';
			var enableActionMenu = !Ext.isEmpty(model.enableActionMenu) ? model.enableActionMenu : false;
			var multiSort = !Ext.isEmpty(model.multiSort) ? model.multiSort : true;
			var pageSize = !Ext.isEmpty(model.pageSize) ? model.pageSize : null;
			var enableLocking = !Ext.isEmpty(model.enableLocking) ? model.enableLocking : true;
			var stateful = !Ext.isEmpty(model.stateful) ? model.stateful : true;
			var width = !Ext.isEmpty(model.width) ? model.width : 'auto';
			
			grid = Ext.create('Ext.ux.gcp.SmartGrid', {
				id : gridId,
				rowList : model.rowList,
				height : model.height,
				enableActionMenu :  enableActionMenu,
				actionMenuModel : model.actionMenuModel,
				multiSort : multiSort,
				pageSize : pageSize,
				enableLocking : enableLocking,
				stateful : stateful,
				width : width,
				columnModel : model.columnModel,
				storeModel : model.storeModel,
				isRowIconVisible : me.isRowIconVisible,
				listeners : {
					render : function (objGrid) {
						var jsonSorter = objGrid.store.sorters;
						me.populateGridData(objGrid,objGrid.store.dataUrl,objGrid.pageSize,1,1,jsonSorter);
					},
					gridPageChange : function (objGrid,strDataUrl,intPgSize,intNewPgNo,intOldPgNo,jsonSorter)	{
						me.populateGridData(objGrid,strDataUrl,intPgSize,intNewPgNo,intOldPgNo,jsonSorter);
					},
					gridSortChange : function (objGrid,strDataUrl,intPgSize,intNewPgNo,intOldPgNo,jsonSorter) {
						me.populateGridData(objGrid,strDataUrl,intPgSize,intNewPgNo,intOldPgNo,jsonSorter);
					},
					gridRowSelectionChange : function (objGrid,objRecord,intRecordIndex,arrSelectedRecords,jsonData) {
						me.handleSelectionChange(objGrid,objRecord,intRecordIndex,arrSelectedRecords,jsonData);
					},
					modifyColumnHeader : function(column,itemConfig,renderTo) {
						me.createColumnHeaderField(itemConfig,renderTo);
					}
				}
			});
		}
		return grid;
	},
	createQuickFilter : function() {
		var me = this;
		var model = me.quickFilterItems;
		var toolbar = null;
		var items = null;
		if(Ext.isEmpty(model)) return null;
		
		items = me.createQuickFilterFields();
		if(!Ext.isEmpty(items) && items.length>0)
			{
			var tbarItems = [{
								xtype : 'label',
								cls : 'font_bold',
								text : 'Filter By : '
							}];
				tbarItems = tbarItems.concat(items);
				toolbar = Ext.create('Ext.toolbar.Toolbar',{
					id : me.id+'_quickFilter',
					border : false,
					cls : 'padding_tb_10',
					items : tbarItems
				});
			}
		return toolbar;
	},
	createActionBar : function() {
		var me= this;
		var button = null;
		var arrActions = new Array();
		var model = me.actionItems;
		var actionBar = null;
		if(!Ext.isEmpty(model) && Ext.isArray(model))
			{
				var objCfg,btnCfg = {}, text='',iconCls='',itemId='',actionName='',
					toolTip='',fnClickHandler=null,maskPosition='',disabled = true,isGroupAction;
				for(var i = 0;i<model.length;i++)
					{
						objCfg = model[i];
						btnCfg = {};
						text = objCfg.itemText;
						iconCls = objCfg.itemCls;
						itemId = 'btn'+objCfg.actionName;
						actionName= objCfg.actionName
						maskPosition = objCfg.maskPosition;
		                toolTip = objCfg.toolTip;
		                fnClickHandler = objCfg.fnClickHandler;
		                disabled =  objCfg.disabled;
		                isGroupAction = !Ext.isEmpty(objCfg.isGroupAction) ? objCfg.isGroupAction : true;
		                
		                btnCfg.disabled= true;
		                btnCfg.isGroupAction= true;
		                btnCfg.maskPosition = '';
		                
		                if(!Ext.isEmpty(text))
		                	btnCfg.text = text;
		                
		                if(!Ext.isEmpty(iconCls))
		                	btnCfg.iconCls = iconCls;
		                
		                if(!Ext.isEmpty(itemId))
		                	btnCfg.itemId = itemId;
		                
		                if(!Ext.isEmpty(actionName))
		                	btnCfg.actionName = actionName;
		                
		                if(!Ext.isEmpty(maskPosition))
		                	btnCfg.maskPosition = maskPosition;
		                
		                if(!Ext.isEmpty(toolTip))
		                	btnCfg.tooltip = toolTip;
		                
		                if(!Ext.isEmpty(fnClickHandler) && typeof fnClickHandler == 'function')
		                	{
		                		/*if(!Ext.isEmpty(isGroupAction) && isGroupAction===true)
		                			btnCfg.handler = Ext.Function.bind(fnClickHandler,me,[actionName], false);
		                		else
		                			btnCfg.handler = fnClickHandler;*/
		                		btnCfg.handler = Ext.Function.bind(fnClickHandler,me,[actionName], false);
		                	}
		                else
		                	btnCfg.handler = Ext.Function.bind(me.handleActionClick,me,[actionName], false);
		                
		                if(!Ext.isEmpty(disabled))
		                	btnCfg.disabled = disabled;
		                
		                if(!Ext.isEmpty(isGroupAction))
		                	btnCfg.isGroupAction = isGroupAction;
		                
						button = Ext.create('Ext.button.Button', btnCfg);
						arrActions.push(button);
					}
			if(arrActions.length>0)
				{
					me.actions = arrActions;
					actionBar = Ext.create('Ext.ux.gcp.SmartGridActionBar',{items : arrActions});
				}
			}

		return actionBar;
	},
	createActionResult : function()	{
		var actionResult = null;
		var me= this;
		var model = me.actionResultModel;
		var title = 'Recent Action Result', hidden=true,itemId = me.id+'_actionResult';
		var transactionInfo = null,actions = new Array();
		//var fields = ['status','serialNo','actualSerailNo', 'actionMessage','lastActionUrl','parentRecord'];
		if(!Ext.isEmpty(model)) {
				title = !Ext.isEmpty(model.title) ? model.title : title;
				hidden = !Ext.isEmpty(model.hidden) ? model.hidden : hidden;
				itemId = !Ext.isEmpty(model.id) ? model.id : itemId;
				//fields = !Ext.isEmpty(model.fields) ? model.fields : fields;
				transactionInfo = !Ext.isEmpty(model.transactionInfo) ? model.transactionInfo : transactionInfo;
				actions = !Ext.isEmpty(model.actions) ? model.actions : actions;
				
			}
		actionResult = Ext.create('Ext.ux.gcp.ActionResult',{
						id : itemId,
						itemId : itemId,
						hidden : hidden,
						title : title,
						fields : [],
						transactionInfo : transactionInfo,
						actions : actions
					});
		return actionResult;
	},
	handleActionClick : function(actionName,strUserMessage){
		var me = this;
		var arrayJson = new Array();
		var records = me.grid.getSelectedRecords();
		var grid = me.grid;
		var actionUrl = 'services/'+me.id+'/'+actionName;
		var userMessage = !Ext.isEmpty(strUserMessage) ? strUserMessage : '';
		for (var index = 0; index < records.length; index++) {
			arrayJson.push({
						serialNo : grid.getStore().indexOf(records[index]) + 1,
						identifier : records[index].data.identifier,
						userMessage : userMessage
					});
		}
		if (arrayJson)
			arrayJson = arrayJson.sort(function(valA, valB) {
						return valA.serialNo - valB.serialNo
					});
		me.setLoading(true);
		Ext.Ajax.request({
					url : actionUrl,
					method : 'POST',
					jsonData : Ext.encode(arrayJson),
					success : function(response) {
						me.setLoading(false);
						me.postHandleGroupActions.call(me, Ext.decode(response.responseText), actionUrl);
					},
					failure : function() {
						var errMsg = "";
						me.setLoading(false);
						Ext.MessageBox.show({
									title : getLabel('instrumentErrorPopUpTitle','Error'),
									msg : getLabel('instrumentErrorPopUpMsg','Error while fetching data..!'),
									buttons : Ext.MessageBox.OK,
									icon : Ext.MessageBox.ERROR
								});
					}
				});
	},
	postHandleGroupActions : function(objData, strLastActionUrl) {
		var me = this;
		var resultData = objData.d.instrumentActions;
		var actionResult = me.actionResult;
		if(!Ext.isEmpty(actionResult))
			actionResult.handleActionResult(resultData,me.grid,strLastActionUrl);
		me.refreshGridData();
	},
	generateDefaultMask : function() {
		var me = this;
		var defaultMask = '';
		for(var i=0;i<me.maskSize;i++)
			defaultMask = defaultMask+'0'; 
		me.defaultMask = defaultMask;
	},
	handleSelectionChange : function(grid,record,index,selectedRecords,jsonData) {
		var me = this;
		var rightsMask = me.defaultMask;
		var maskArray = new Array();
		var actionMask = '';
		if(jsonData && jsonData.d.__metadata.__buttonMask)
			rightsMask = jsonData.d.__metadata.__buttonMask;
		
		maskArray.push(rightsMask);
		for (var index = 0; index < selectedRecords.length; index++) {
			maskArray.push(selectedRecords[index].get('__metadata').__rightsMap);
		}
		actionMask = doAndOperation(maskArray, me.maskSize);
		me.handleActionsVisibility(actionMask,true);
	},
	handleAfterGridDataLoad : function (grid,jsonData) {
		var me = grid.ownerCt;
		me.setLoading(false);
		var rightsMask = me.defaultMask;
		if(jsonData && jsonData.d.__metadata.__buttonMask)
			rightsMask = jsonData.d.__metadata.__buttonMask;
		me.handleActionsVisibility(rightsMask,false);
	},
	handleActionsVisibility : function(actionMask,blnIsGroupAction)	{
		var me = this;
		var arrActions = me.actions;
		var blnEnabled = false;
		var maskPosition ='';
		Ext.each(arrActions, function(item) {
					if (!Ext.isEmpty(item.isGroupAction) && item.isGroupAction === blnIsGroupAction) {
						if (!Ext.isEmpty(item.maskPosition)) {
							maskPosition = parseInt(item.maskPosition)-1;
							blnEnabled = isActionEnabled(actionMask,maskPosition);
							item.setDisabled(!blnEnabled);
						}
					}
				});
	},
	disableAllGroupAction : function() {
		var me = this;
		var arrActions = me.actions;
		Ext.each(arrActions, function(item) {
					if (!Ext.isEmpty(item.isGroupAction) && item.isGroupAction === true) {
						item.setDisabled(true);
					}
				});
	},
	isRowIconVisible : function(store,record,jsonData,itmId,maskPosition) {
		var me = this;
		var maskArray = new Array();
		var actionMask = '';
		var rightsMap = record.data.__metadata.__rightsMap;
		var buttonMask = '';
		var retValue = true;
		var bitPosition = '',maskSize='';
		if(!Ext.isEmpty(maskPosition) && !Ext.isEmpty(me.ownerCt.maskSize))
			{
				bitPosition = parseInt(maskPosition)-1;
				maskSize = me.ownerCt.maskSize;
			}
		if(!Ext.isEmpty(jsonData) && !Ext.isEmpty(jsonData.d.__metadata.__buttonMask))
			buttonMask = jsonData.d.__metadata.__buttonMask;
		maskArray.push(buttonMask);
		maskArray.push(rightsMap);
		actionMask = doAndOperation(maskArray, maskSize);
		if(Ext.isEmpty(bitPosition)) return retValue;
		retValue = isActionEnabled(actionMask, bitPosition);
		return retValue;
	},
	createContentPanel : function(objQuickFilter,objActionBar)	{
		var panel = null;
		if(!Ext.isEmpty(objQuickFilter) || !Ext.isEmpty(objActionBar))
			{
				var items = new Array();
				if(!Ext.isEmpty(objQuickFilter))
					{
						objQuickFilter.flex = 1;
						items.push(objQuickFilter);
					}
					
				if(!Ext.isEmpty(objActionBar))
					{
						objActionBar.flex = 1;
						items.push(objActionBar);
					}
					
				panel = Ext.create('Ext.panel.Panel',{
					autoHeight : true,
					width : 'auto',
					items : [{
						flex : 1,
						layout : {
							type : 'hbox',
							align : 'stretch'
						},
						items : items
					}]
				});
			}
		return panel;
		
	},
	populateGridData : function(objGrid,strDataUrl,intPgSize,intNewPgNo,intOldPgNo,jsonSorter)	{
		var me=  this;
		me.disableAllGroupAction();
		var strUrl = objGrid.generateUrl (strDataUrl,intPgSize,intNewPgNo,intOldPgNo,jsonSorter);
		strUrl = strUrl + me.getFilterUrl();
		if(objGrid)
			{
				me.setLoading(true);
				objGrid.loadGridData(strUrl,me.handleAfterGridDataLoad,null,false);
			}
	},
	getFilterUrl : function () {
		var me = this;
		var strQuickFilterUrl = '',strAdvFilterUrl = '' , strUrl = '';
		
		strQuickFilterUrl = me.generateUrlWithQuickFilterParams();
		if(!Ext.isEmpty(me.advanceFilter))
			{
			 	var filterData = me.advanceFilter.getAdvancedFilterJson('QUERY_JSON'); 
			 	strAdvFilterUrl =  me.advanceFilter.generateUrlWithAdvancedFilterParams(filterData); 
			}
		if(!Ext.isEmpty(strQuickFilterUrl))
			strQuickFilterUrl = strQuickFilterUrl.replace('&$filter=','');
		if(!Ext.isEmpty(strAdvFilterUrl))
			strAdvFilterUrl = strAdvFilterUrl.replace('&$filter=','');
		
		if(!Ext.isEmpty(strQuickFilterUrl) && !Ext.isEmpty(strAdvFilterUrl))
			strUrl = '&$filter='+strQuickFilterUrl+' and ' + strAdvFilterUrl;
		else if(Ext.isEmpty(strQuickFilterUrl) && !Ext.isEmpty(strAdvFilterUrl))
			strUrl = '&$filter='+ strAdvFilterUrl;
		else if(!Ext.isEmpty(strQuickFilterUrl) && Ext.isEmpty(strAdvFilterUrl))
			strUrl = '&$filter='+ strQuickFilterUrl;
		return strUrl;
	},
	getAppliedFilterUrl : function () {
		var me=  this;
		var strUrl = ''
		var objGrid =  me.grid;
		  if(me.filterApplied === 'Q') 
			  strUrl = me.generateUrlWithQuickFilterParams(); 
		  else if(me.filterApplied === 'A') {
			  if(!Ext.isEmpty(me.advanceFilter)) { 
				  	var filterData = me.advanceFilter.getAdvancedFilterJson('QUERY_JSON'); 
				  	strUrl = me.advanceFilter.generateUrlWithAdvancedFilterParams(filterData); 
				  }
		  }
		  return strUrl;
	},
	refreshGridData : function()	{
		var me=  this;
		var objGrid =  me.grid;
		var strDataUrl = objGrid.getDataUrl();
		var intPgSize = objGrid.getPageSize();
		var currentPage = objGrid.getCurrentPage();
		var jsonSorter = objGrid.getSorters();
		me.disableAllGroupAction();
		var strUrl = objGrid.generateUrl (strDataUrl,intPgSize,currentPage,currentPage,jsonSorter);
		strUrl = strUrl + me.getFilterUrl();
		if(objGrid)
			{
				me.setLoading(true);
				objGrid.loadGridData(strUrl,me.handleAfterGridDataLoad,null,false);
			}
	},
	applyAdvancedFilter : function(objAdvFilter,filterdata)	{
		var me= this;
		var strUrl = '';
		var objGrid = me.grid;
		var objAdvFilter =  me.advanceFilter;
		me.filterApplied = 'A';
		me.disableAllGroupAction();
		if(!Ext.isEmpty(objGrid))
			{
				var strDataUrl = objGrid.store.dataUrl;
				var pgSize = objGrid.pageSize;
				var sorter = objGrid.store.sorters;
				strUrl = objGrid.generateUrl (strDataUrl,pgSize,1,1,sorter);
			}
		//TODO : Currently both filters are in sync
		//me.resetQuickFilter();
		strUrl = strUrl + me.getFilterUrl();
		if(!Ext.isEmpty(objGrid))
			{
				me.setLoading(true);
				objGrid.loadGridData(strUrl,me.handleAfterGridDataLoad,null,false);
			}
			
	},
	applyQuickFilter : function ()	{
		var me = this;
		var grid = me.grid;
		me.filterApplied = 'Q';
		me.disableAllGroupAction();
		//TODO : Currently both filters are in sync
		/*if(me.advancefilter)
			me.advancefilter.setVisibility(false);*/
		if(!Ext.isEmpty(grid))
			{
				var strDataUrl = grid.store.dataUrl;
				var store = grid.store;
				var strUrl = grid.generateUrl (strDataUrl,grid.pageSize,1,1,store.sorters);
				strUrl = strUrl + me.getFilterUrl();
				me.setLoading(true);
				grid.loadGridData(strUrl,me.handleAfterGridDataLoad,null,false);
			}
	},
	resetQuickFilter : function()	{
		var me= this;
		var items = me.filterItems;
		var defaultValue = '';
		var field = null;
		if(!Ext.isEmpty(items))
		{
			for(var i=0;i<items.length;i++)
			{
				field = items[i];
				defaultValue =field.defaultValue;
				field.suspendEvents();
				field.setValue(defaultValue);
				field.resumeEvents();
			}
		}
	},
	generateUrlWithQuickFilterParams : function ()	{
		var me = this;
		var strFilter = '&$filter=';
		var strTemp = '',strUrl = '';
		var items = me.filterItems;
		var paramName = '', paramValue='';
		var paramAppended = false;
		if(!Ext.isEmpty(items))
			{
				for(var i=0;i<items.length;i++)
				{
					paramName = items[i].queryParamName;
					paramValue = items[i].getValue();
					if(!Ext.isEmpty(paramName) && !Ext.isEmpty(paramValue) )
						{
							if(!paramAppended)
								strTemp = strTemp + paramName + ' eq ' + '\''+paramValue+'\'';
							else
								strTemp = strTemp + ' and '+ paramName + ' eq ' + '\''+paramValue+'\'';
							paramAppended = true;
						}
				}
			}
		if(!Ext.isEmpty(strTemp))
			strUrl = strFilter + strTemp;
		return strUrl;

	},
	getQueryString : function() {
		var me=  this;
		var grid = me.getGrid();
		var pgSize = grid.getPageSize();
		var curPgNo = grid.getCurrentPage();
		var sorters = grid.getSorters();
		var strUrl = '';
			strUrl = grid.generateUrl ('',pgSize,curPgNo,curPgNo,sorters);
			strUrl = strUrl + me.getFilterUrl();
		  return strUrl;
	},
	createColumnHeaderField : function (config,renderTo)	{
		var field = null;
		var me = this;
		field = me.createField(config,null);
		field.fieldCls = 'xn-grid-form-trigger-field';
		field.triggerBaseCls = 'xn-grid-form-trigger';
		field.render(renderTo);
		if(!me.isQuickFilterFieldExist(config.itemId))
			me.filterItems.push(field);
	},
	createQuickFilterFields : function ()	{
		var field = null;
		var me = this;
		var arrItem = new Array();
		var model = me.quickFilterItems;
		if(!Ext.isEmpty(model) && Ext.isArray(model))
			{
				for(var i=0; i<model.length; i++)
					{
						field = model[i];
						field.defaultValue = field.value;
						field.on ('change',function(combo, newValue, oldValue, opts) {
								me.applyQuickFilter();
							});
						if(!Ext.isEmpty(field))
							{
								if(arrItem.length == 0)
									arrItem.push(field);
								else
									{
										arrItem.push(' ');
										arrItem.push(' ');
										arrItem.push('-');
										arrItem.push(' ');
										arrItem.push(field);
									}
								if(!me.isQuickFilterFieldExist(field.itemId))
									me.filterItems.push(field);
							}
					}
			}
		return arrItem;
	},
	createField : function (config,renderTo)	{
		var field = null;
		var me = this;
		if(!Ext.isEmpty(config) && !Ext.isEmpty(config.type))
			{
				if(config.type === 'combo')
					{
						var defaultValue = !Ext.isEmpty(config.defaultValue) ? config.defaultValue : '';
						var width = !Ext.isEmpty(config.width) ? config.width : 100;
						var itemId = config.itemId;
						var arrData =  !Ext.isEmpty(config.data) ? config.data : new Array();
						var label = !Ext.isEmpty(config.label) ? config.label : '';
						var store = Ext.create('Ext.data.Store', {
							fields : [ 'key', 'value' ],
							data : arrData
						});
						var queryParamName = !Ext.isEmpty(config.queryParamName) ? config.queryParamName : '';
						field = Ext.create('Ext.form.field.ComboBox', {
							displayField : 'value',
							valueField : 'key',
							fieldCls : 'xn-form-field',
							triggerBaseCls : 'xn-form-trigger',
							value : defaultValue,
							defaultValue : defaultValue,
							width : width,
							store : store,
							matchFieldWidth : false,
							scope : this,
							editable : false,
							itemId : itemId,
							listConfig : {width : 170},
							queryParamName : queryParamName,
							listeners : {
								change : function(combo, newValue, oldValue, opts) {
									me.applyQuickFilter();
								}
							}
						});
						if(!Ext.isEmpty(renderTo))
							field.render(renderTo);
					}
			}
		return field;
	},
	isQuickFilterFieldExist : function (itemId)	{
		var blnValue = false;
		var me = this;
		var items = me.filterItems;
		for(var i=0;i<items.length;i++)
			{
				if(items[i].itemId === itemId)
					{
						blnValue = true;
						break;
					}
			}
			
		return blnValue;
	},
	getGrid : function(){
		return this.grid;
	},
	getAdvanceFilter : function(){
		return this.advanceFilter;
	},
	getActionResult : function(){
		return this.actionResult;
	}

});