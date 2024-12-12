/**
 * @class GCP.controller.ScheduleMonitorController
 * @extends Ext.app.Controller
 * @author Naresh Mahajan
 */

/**
 * This controller is prime controller in Bank Schedule which handles all
 * measure events fired from GroupView. This controller has important
 * functionality like on any change on grid status or quick filter change, it
 * forms required URL and gets data which is then shown on Summary Grid.
 */

Ext.define('GCP.controller.ScheduleMonitorController', {
	extend : 'Ext.app.Controller',
	requires : [],
	views : ['GCP.view.ScheduleMonitorGridInformationView','GCP.view.ScheduleMonitorFilterView','GCP.view.ScheduleDelayPopup'],
	refs : [{
				ref : 'scheduleMonitorView',
				selector : 'scheduleMonitorView'
			},{
				ref : 'scheduleMonitorFilterView',
				selector : 'scheduleMonitorView scheduleMonitorFilterView'
			},{
				ref : 'sellerCombo',
				selector : 'scheduleMonitorView scheduleMonitorFilterView combobox[itemId="reportCenterSellerId"]'
			},{
				ref : 'groupView',
				selector : 'scheduleMonitorView groupView'
			},{
				ref : 'btnClearPreferences',
				selector : 'scheduleMonitorView scheduleMonitorFilterView button[itemId="btnClearPreferences"]'
			},{
				ref : 'btnSavePreferences',
				selector : 'scheduleMonitorView scheduleMonitorFilterView button[itemId="btnSavePreferences"]'
			},{
				ref : 'schedulingTypeLabel',
				selector : 'scheduleMonitorView scheduleMonitorFilterView label[itemId="schedulingTypeValue"]'
			},{
				ref : 'clientFilterPanel',
				selector : 'scheduleMonitorView scheduleMonitorFilterView container[itemId="clientFilterPanel"]'
			},{
				ref : 'clientAutoCompleter',
				selector : 'scheduleMonitorView scheduleMonitorFilterView AutoCompleter[itemId="reportCenterClientId"]'
			}
		],
	config : {
		widgetType : '01',
		reportModule : '01',
		preferenceHandler : null,
		strDefaultMask : '0000',
		filterData : [],
		favReport : [],
		strPageName : 'scheduleMonitorNewUX',
		filterDataPref : {},
		initialSmartGridRender : true,
		entityType : 'BANK',
		cfgSellerGroupByUrl : 'services/grouptype/scheduleMonitor/groupBy.srvc?&'+csrfTokenName+'='+tokenValue+'&$filter=seller eq '+'\''+'{0}' + '\' and seller eq '+'\''+'{1}' + '\'&$filterscreen=BANKSCHEDULE',
		cfgSellerClientGroupByUrl : 'services/grouptype/scheduleMonitor/groupBy.srvc?&'+csrfTokenName+'='+tokenValue+'&$filter=seller eq '+'\''+'{0}' + '\' and client eq '+'\''+'{1}' 
		+ '\' and client lk '+'\''+'{2}' 
		+ '\' and seller eq '+'\''+'{3}' +'\'&$filterscreen=BANKSCHEDULECLIENT'
		},
	/**
	 * A template method that is called when your application boots. It is
	 * called before the Application's launch function is executed so gives a
	 * hook point to run any code before your Viewport is created.
	 */
	init : function() {
		var me = this;
		me.updateConfigs();			
		me.doApplySavedPreferences();
		me.control({
			
			'scheduleMonitorView scheduleMonitorFilterView' : {	
				'render' : function() {
					me.setInfoTooltip();
					me.setDataForQuickFilter();
					me.setSelectedButtons();
				},
				'quickFilterChange' : function(filterJson) {
					me.setDataForQuickFilter(me.filterJson);
					//if (me.getReportCenterView())
					//	me.getReportCenterView().setLoading(true);
					me.applyQuickFilter();
				},
				'refreshGroupByTabs': function(seller, client){
					me.refreshGroupByTabs(seller, client); 
				},
				'handleClientChange' : function(clientCode, clientDesc) {
					me.setDataForQuickFilter();
					me.applyQuickFilter();
				},
				'filterScheduleType' : function(btn, opts){
					me.toggleSavePrefrenceAction(true);
					me.handleSchedulingType(btn);
				},
				'filterEntityType' : function(entityType){
					me.filterEntityType(entityType);
				},
				'filterClient' : function(clientCode, clientDesc){
					me.filterClient(clientCode, clientDesc);
				}
			},
			'scheduleMonitorView groupView' : {
				'render' : function(){
					me.refreshGroupByTabs(strSeller, strClient);
				},
				'groupTabChange' : function(groupInfo, subGroupInfo, tabPanel,
						newCard, oldCard) {	
					me.setDataForQuickFilter(me.filterJson);	
					me.toggleSavePrefrenceAction(true);
					me.doHandleGroupTabChange(groupInfo, subGroupInfo,
							tabPanel, newCard, oldCard);
				},			
				'groupActionClick' : function(actionName, isGroupAction,
						maskPosition, grid, arrSelectedRecords) {
					if (isGroupAction === true)
						me.doHandleGroupActions(actionName, grid,
								arrSelectedRecords, 'groupAction');
				},
				'gridRender' : me.doHandleLoadGridData,
				'gridPageChange' : me.doHandleLoadGridData,
				'gridSortChange' : me.doHandleLoadGridData,
				'gridPageSizeChange' : me.doHandleLoadGridData,
				'gridColumnFilterChange' : me.doHandleLoadGridData,
				'gridRowSelectionChange' : me.doHandleGridRowSelectionChange,
				
				'gridStateChange' : function(grid) {
					me.toggleSavePrefrenceAction(true);
				},
				
				'gridRowActionClick' : function(grid, rowIndex, columnIndex,
						actionName, record) {
					me.doHandleRowActions(actionName, grid, record, rowIndex);
				}
			},
			'scheduleMonitorView scheduleMonitorFilterView button[itemId="btnSavePreferences"]' : {
				click : function(btn, opts) {
					me.toggleSavePrefrenceAction(false);
					me.handleSavePreferences();
				}
			},
			'scheduleMonitorView scheduleMonitorFilterView button[itemId="btnClearPreferences"]' : {
				click : function(btn, opts) {
					me.toggleClearPrefrenceAction(false);
					me.handleClearPreferences();
				}
			},
			'scheduleMonitorView groupView smartgrid' : {
				'afterrender' : function(){
						var isShowClientCol = me.entityType == 'BANK' ? false : true;
						me.hideShowClientColumn(isShowClientCol);
				}
			},
			'scheduleDelayPopup' :{
				'updateScheduleDelayInfo' : function(info)
				{
					me.updateScheduleDelayInfo(info);
				}
			}
		});	
	},
	filterEntityType : function(entityType){
		var me = this;
		me.entityType = entityType;
		var filterView = me.getScheduleMonitorFilterView();
		if(entityType === 'BANK'){
			filterView.clientCode = null;
			me.hideClientPanel();
			me.clientFilterVal = null;
			me.clientFilterDesc = null;
			//me.filterClient(null, null);
		}
		else if(entityType === 'BANK_CLIENT'){
			filterView.clientCode = 'ALL';
			var clientAutoCompleter = me.getClientAutoCompleter();
			clientAutoCompleter.store.loadRawData({
																"d" : {
																	"preferences" : [{
																				"CODE" : 'ALL',
																				"DESCR" : 'ALL'
																			}]
																}
															});
			clientAutoCompleter.setValue('ALL');
			me.clientFilterVal = 'ALL';
			me.clientFilterDesc = 'ALL';
			me.showClientpanel();
			//me.filterClient('ALL','ALL');
		}
		var client = null;
		if(me.entityType == 'BANK_CLIENT')
		{
			client = 'ALL';
		}
		me.refreshGroupByTabs(strSeller,client);
	},
	hideClientPanel : function(){
		var me = this;
		var clientFilterPanel = me.getClientFilterPanel();
		if (!Ext.isEmpty(clientFilterPanel)) {
			clientFilterPanel.hide();
		}
	},
	showClientpanel : function(){
		var me = this;
		var clientFilterPanel = me.getClientFilterPanel();
		if (!Ext.isEmpty(clientFilterPanel)) {
			clientFilterPanel.show();
		}
	},
	hideShowClientColumn : function(isShowClientColumn){
		var me = this;
		var groupView = me.getGroupView();
		if(null != groupView.down('smartgrid'))
		{
			var columnModel = groupView.down('smartgrid').getAllColumns();
			var i = 0;
			for( i = 0; i < columnModel.length; i++){
				var column = columnModel[i];
				if(column.itemId == 'col_entityDesc'){
					if(isShowClientColumn)
						column.show();
					else
						column.hide();
				}
				if(column.itemId == 'col_scheduleStatus'){
					if(isShowClientColumn)
						column.width = objGridWidthMap.scheduleStatus;
					else
						column.width = parseInt(objGridWidthMap.scheduleStatus,10) + 100;
				}
			}
		}
	},
	filterClient : function(clientCode, clientDesc){
		var me = this;
		var isShowClientColumn = (clientCode == null ? false : true);
		me.clientFilterVal = clientCode;
		me.clientFilterDesc = clientDesc;
					
		var groupView = me.getGroupView();
		if(null != groupView.down('smartgrid'))
		{
			var columnModel = groupView.down('smartgrid').getAllColumns();
			var i = 0;
			for( i = 0; i < columnModel.length; i++){
				var column = columnModel[i];
				if(column.itemId == 'col_entityDesc'){
					if(isShowClientColumn)
						column.show();
					else
						column.hide();
				}
			}
		}
		me.setDataForQuickFilter();
		me.applyQuickFilter();	
	},
	refreshGroupByTabs: function(seller, client)
	{
		var me = this;
		var strUrl = Ext.String.format(me.cfgSellerGroupByUrl, seller, seller);
		if( !Ext.isEmpty( client ) )
		{
			strUrl = Ext.String.format( me.cfgSellerClientGroupByUrl, seller, client, client, seller );
		}
		me.getGroupView().loadGroupByMenus(strUrl);
	},
	setSelectedButtons : function() {
		var me = this, filter = me.getScheduleMonitorFilterView();
		var objPref = null;
		objPref = me.filterDataPref;
		if(objPref.statusCode){
			var btn = filter.down('button[code='+objPref.statusCode+']');	
			me.setButtonCls(btn, 'reportStatusToolBar');
			filter.statusCode = btn.code;
			filter.statusCodeDesc = btn.btnDesc;
			//filter.handleQuickFilterChange();
		}
		if(objPref.repOrDwnld){
			var btn = filter.down('button[code='+objPref.repOrDwnld+']');	
			me.setButtonCls(btn, 'schedulingTypeToolBar');
			filter.repOrDwnld = btn.code;
			filter.repOrDwnldDesc = btn.btnDesc;
			//filter.handleQuickFilterChange();
		}
		me.setDataForQuickFilter(objPref);
	},
	handleSchedulingType : function(btn) {
		var me = this;
		me.toggleSavePrefrenceAction(true);
		me.setDataForQuickFilter();
		me.applyQuickFilter();
	},
	setButtonCls : function(btn, itemId) {
		var me = this, filter = me.getScheduleMonitorFilterView();
		filter.down('toolbar[itemId='+ itemId +']').items.each(function(
						item) {
					item.removeCls('xn-custom-heighlight');
				});
		btn.addCls('xn-custom-heighlight');
	},
	applyQuickFilter : function() {
		var me = this;
		var groupView = me.getGroupView();
		groupView.down('smartgrid').refreshData();
	},
	setDataForQuickFilter : function(filterJson) {
		var me = this, filter = me.getScheduleMonitorFilterView(), arrFilter = [];
		var data = filterJson || filter.getQuickFilterJSON();
		if (data) {			
			if (data['clientCode'])
				arrFilter.push({
							paramName : 'entity_code',
							paramValue1 : (data['clientCode'] || ''),
							operatorValue : 'lk',
							dataType : 'S'
						});
			if (data['repOrDwnld'])
				arrFilter.push({
							paramName : 'repOrDwnld',
							paramValue1 : (data['repOrDwnld'] || ''),
							operatorValue : 'eq',
							dataType : 'S'
						});			
			if (data['srcName'])
				arrFilter.push({
							paramName : 'srcName',
							paramValue1 : (data['srcName'] || ''),
							operatorValue : 'eq',
							dataType : 'S'
						});
			if (data['scheduleMode'])
				arrFilter.push({
							paramName : 'scheduleMode',
							paramValue1 : (data['scheduleMode'] || ''),
							operatorValue : 'eq',
							dataType : 'S'
						});
		}
		me.filterData = arrFilter;
	},
	updateConfigs : function() {
		var me = this;
		me.preferenceHandler = Ext.create('Ext.ux.gcp.PreferencesHandler');
	},	
	doHandleLoadGridData : function(groupInfo, subGroupInfo, grid, url, pgSize,
			newPgNo, oldPgNo, sorter) {		
		var me = this;
		var objGroupView = me.getGroupView();
		var buttonMask = me.strDefaultMask;
		url = url + me.widgetType + '.srvc';
		objGroupView.handleGroupActionsVisibility(buttonMask);
		var strUrl = grid.generateUrl(url, pgSize, newPgNo, oldPgNo, sorter);
		strUrl +='&$seller='+me.getSellerCombo().getValue();
		strUrl += me.generateFilterUrl(groupInfo, subGroupInfo);
		strUrl = strUrl + "&" + csrfTokenName + "=" + csrfTokenValue;
		grid.loadGridData(strUrl, null, null, false);
	},
	generateFilterUrl : function(groupInfo, subGroupInfo) {
		var me = this;
		var filterView = me.getScheduleMonitorFilterView();
		var data = filterView.getQuickFilterJSON();	
		var strQuickFilterUrl = '', strWidgetFilterUrl = '', strUrl = '', isFilterApplied = false;
		strQuickFilterUrl = me.generateUrlWithQuickFilterParams(me.filterData);
		strWidgetFilterUrl = me.generateWidgetUrl(groupInfo, subGroupInfo);
		if (!Ext.isEmpty(strQuickFilterUrl)) {
				strUrl += strQuickFilterUrl;
				isFilterApplied = true;
			}
		if (!Ext.isEmpty(strWidgetFilterUrl)) {
				if (isFilterApplied)
					strUrl += ' and ' + strWidgetFilterUrl;
				else
					strUrl += '&$filter=' + strWidgetFilterUrl;
			}
		if(filterView.repOrDwnld == 'FAVORITE'){
			strUrl += '&$isFavouriteFilter=Y';
		}
		if(!Ext.isEmpty(filterView.entityType) && filterView.entityType == 'BANK_CLIENT'){
			strUrl += '&$isClientFilterSelected=Y';
		}
		else if (data) {			
			if (data['clientDesc'])
				{
					strUrl += '&$isClientFilterSelected=Y';
				}
		}
		return strUrl;
	},
	generateUrlWithQuickFilterParams : function(urlFilterData) {
		var me = this;
		var filterData = urlFilterData;
		var isFilterApplied = false;
		var strFilter = '&$filter=';
		var strTemp = '';
		var strFilterParam = '';
		for (var index = 0; index < filterData.length; index++) {
			if (isFilterApplied)
				strTemp = strTemp + ' and ';
			switch (filterData[index].operatorValue) {
				case 'eq' :
				case 'lk' :
					isFilterApplied = true;
					strTemp += filterData[index].paramName + ' '
							+ filterData[index].operatorValue + ' ' + '\''
							+ filterData[index].paramValue1 + '\'';
					break;					
			}
			isFilterApplied = true;
		}
		if (isFilterApplied)
			strFilter += strTemp;
		else
			strFilter = '';
		return strFilter;
	},
	doHandleRowActions : function(strAction, grid, record, rowIndex){
		var me = this;
		var strUrl ;
		var records = [record];
		if(strAction == 'scheduleMonitorSuspend')
		{
			strUrl = 'scheduleMonitor/suspend.srvc?';
		}
		else if(strAction == 'scheduleMonitorDelay')
		{
			strUrl = 'scheduleMonitor/delayUpdate.srvc?';
		}
		else if(strAction == 'scheduleMonitorHold')
		{
			strUrl = 'scheduleMonitor/hold.srvc?';
		}
		else if(strAction == 'scheduleMonitorResume')
		{
			strUrl = 'scheduleMonitor/resume.srvc?';
		}
		else if(strAction == 'scheduleMonitorReset')
		{
			strUrl = 'scheduleMonitor/reset.srvc?';
		}
		
		
		if(strAction == 'scheduleMonitorDelay')
		{
			me.showScheduleDelayPopup(strUrl,grid, record,strAction);
		}
		else if(strAction == 'scheduleMonitorReset')
		{
			Ext.Msg.show({
				title:'Reseting The Schedule',
				msg: 'Presently Jobs are running, do you really want to Reset?',
				buttons: Ext.Msg.YESNO,
				icon: Ext.Msg.QUESTION,
				fn: function(btn) {
					if (btn === 'yes') {
						me.preHandleGroupActions(strUrl, '', grid, records, '', '');
					}
				}
			});
		}
		else
		{
			me.preHandleGroupActions(strUrl, '', grid, records, '', '');
		}
	},
	editAction : function(record, rowIndex) {
		var me = this;
		var strUrl;
		strUrl = "editScheduleMonitor.srvc";
		me.editScheduleMonitorRecord(strUrl, record, rowIndex);
	},
	editScheduleMonitorRecord : function(strUrl, record, rowIndex) {
		var me = this;
		var viewState = record.get('viewState');
		var schSrcId = record
				.get('schSrcId');
		var form, inputField;
		form = document.createElement('FORM');
		form.name = 'frmMain';
		form.id = 'frmMain';
		form.method = 'POST';
		form.appendChild(me.createFormField('INPUT', 'HIDDEN',
				csrfTokenName, tokenValue));
		form.appendChild(me.createFormField('INPUT', 'HIDDEN','schSrcId', schSrcId));
		form.appendChild(me.createFormField('INPUT', 'HIDDEN', 'schEntityType',	record.get('schEntityType')));
		form.appendChild(me.createFormField('INPUT', 'HIDDEN', 'schEntityCode',	record.get('schEntityCode')));
		form.action = strUrl;
		document.body.appendChild(form);
		form.submit();
	},
	createFormField : function(element, type, name, value) {
		var inputField;
		inputField = document.createElement(element);
		inputField.type = type;
		inputField.name = name;
		inputField.value = value;
		return inputField;
	},
	generateWidgetUrl : function(groupInfo, subGroupInfo) {
		if(subGroupInfo.groupCode != 'all'){
			var strWidgetFilter = 'reportModule' + ' eq ' + '\'' + subGroupInfo.groupCode + '\'';
		}else if(strSeller != null){
			var strWidgetFilter = 'monitoringSeller' + ' eq ' + '\'' + strSeller + '\'';
		}else
		{
			var strWidgetFilter = '';//'reportModule' + ' eq ' + '\'' + '%' + '\'';
		}
		
		return strWidgetFilter;
	},
	doHandleGroupTabChange : function(groupInfo, subGroupInfo, tabPanel,
			newCard, oldCard) {	
		var me = this;
		me.widgetType = subGroupInfo.groupCode;
		me.reportModule = subGroupInfo.groupCode;	
		var objGroupView = me.getGroupView();
		var strModule = '', strUrl = null, args = null;
		groupInfo = groupInfo || {};
		subGroupInfo = subGroupInfo || {};

		if (groupInfo && groupInfo.groupTypeCode) {
				strModule = subGroupInfo.groupCode
			args = {
				'module' : strModule
			};
			me.preferenceHandler.readModulePreferences(me.strPageName,
					strModule, me.postDoHandleGroupTabChange, args, me, true);
		} else {
			objGroupView.reconfigureGrid(null);
		}
	},	
	postDoHandleGroupTabChange : function(data, args, isSuccess) {
		var me = this;
		var objGroupView = me.getGroupView();
		var objSummaryView = me.getScheduleMonitorView(), objPref = null, gridModel = null, intPgSize = null;
		var colModel = null, arrCols = null;
		if (data && data.preference) {
			me.toggleClearPrefrenceAction(true);
			objPref = Ext.decode(data.preference);
			arrCols = objPref.gridCols
					|| objDefPref[mapService[args['module']]] || null;
			intPgSize = objPref.pgSize || _GridSizeTxn;
			colModel = objSummaryView.getColumns(arrCols);
			if (colModel) {
				gridModel = {
					columnModel : colModel,
					pageSize : intPgSize
				};
			}
		}
		objGroupView.reconfigureGrid(gridModel);
	},
	toggleClearPrefrenceAction : function(isVisible) {
		var me = this;
		var btnPref = me.getBtnClearPreferences();
		if (!Ext.isEmpty(btnPref))
			btnPref.setDisabled(!isVisible);
	},	
	setInfoTooltip : function() {
			var me = this, filter = me.getScheduleMonitorFilterView(), arrFilter = [];
			Ext.create('Ext.tip.ToolTip', {
				target : 'imgFilterInfoStdView',
				listeners : {
					'beforeshow' : function(tip) {
						var repOrDwnldDesc1, statusFilter1;
						var data = filter.getQuickFilterJSON();
						var financialInstitutionVal = data['sellerCode'];
						var clientVal = (data['clientDesc'] || getLabel(
								'none', 'None'));
						var repOrDwnldDesc1 = (filter.repOrDwnldDesc == null ? getLabel('all','All') : filter.repOrDwnldDesc);
						/*switch(repOrDwnldDesc)
						{
							case 'R' : repOrDwnldDesc1 = "Report"; break;
							case 'U' : repOrDwnldDesc1 = "Uploads"; break;
							case 'D' : repOrDwnldDesc1 = "Downloads"; break;
							case 'FAVORITE' : repOrDwnldDesc1 = "Favourites"; break;
							default : repOrDwnldDesc1 = "All"
						}*/
						
						var statusFilter = (data['statusCode'] || getLabel(
								'all', 'All'));
						switch(statusFilter)
						{
							case 'ACTIVE' : statusFilter1 = "Active"; break;
							case 'DRAFT' : statusFilter1 = "Drafts"; break;
							default : statusFilter1 = "All"; break;
						}
						tip.update(getLabel('financialInstitution',
								'Financial Insitution')
								+ ' : '
								+ financialInstitutionVal
								+ '<br/>'
								+ getLabel('client', 'Company Name')
								+ ' : '
								+ clientVal
								+ '<br/>'
								+ getLabel( 'schedulingType', 'Scheduling Type' )
								+ ' : '
								+ repOrDwnldDesc1
								+ '<br/>'
								+ getLabel('status', 'Status')
								+ ' : '
								+ statusFilter1);
					}
				}
			});

	},
	doHandleGroupActions : function(strAction, grid, arrSelectedRecords,
			strActionType) {
		
		
	},
	preHandleGroupActions : function(strUrl, remark, grid, arrSelectedRecords,
			strActionType, strAction) {
		var me = this;
		var groupView = me.getGroupView();
		var objGroupView = me.getGroupView();
		if (!Ext.isEmpty(groupView)) {
			var me = this;
			if (!Ext.isEmpty(grid)) {
				var arrayJson = new Array();
				var records = (arrSelectedRecords || []);
				for (var index = 0; index < records.length; index++) {
					arrayJson.push({
								identifier : records[index].data.identifier
							});
				}
				if (arrayJson)
					arrayJson = arrayJson.sort(function(valA, valB) {
								return valA.serialNo - valB.serialNo
							});
				groupView.setLoading(true);
				Ext.Ajax.request({
							url : strUrl + csrfTokenName + "=" + csrfTokenValue,
							method : 'POST',
							jsonData : Ext.encode(arrayJson),
							success : function(jsonData) {
								//var jsonRes = Ext.JSON
								//		.decode(jsonData.responseText);
								groupView.setLoading(false);
								groupView.down('smartgrid').refreshData();
								objGroupView.handleGroupActionsVisibility(me.strDefaultMask);
							},
							failure : function() {
								var errMsg = "";
								groupView.setLoading(false);
								Ext.MessageBox.show({
											title : getLabel(
													'instrumentErrorPopUpTitle',
													'Error'),
											msg : getLabel(
													'instrumentErrorPopUpMsg',
													'Error while fetching data..!'),
											buttons : Ext.MessageBox.OK,
											buttonText: {
									            ok: getLabel('btnOk', 'OK')
												},
											icon : Ext.MessageBox.ERROR
										});
							}
						});
			}
		}
	},
	
	showScheduleDelayPopup : function(strUrl, grid, arrSelectedRecords,strAction){
		var identifier = null;
		identifier = arrSelectedRecords.data.identifier;
		var delayPopup = Ext.create('GCP.view.ScheduleDelayPopup', {
							title : 'Schedule Delay Info',
							identifier : identifier
							});
		delayPopup.show();
	},
	
	updateScheduleDelayInfo : function(info){
		var me = this;
		var jsonData = { 
					userMessage : info.getFormData()
			}; 
			
				Ext.Ajax.request({
					url: 'scheduleMonitor/updateDelayInfo.srvc?',
					method: 'POST',
					jsonData: jsonData,
					success: function(response) {
						var errorMessage = '';
						if(response.responseText != '[]' && !Ext.isEmpty(response.responseText))
						{
							var jsonData = Ext.decode(response.responseText);
							Ext.each(jsonData[0].errors, function(error, index) {
								errorMessage = errorMessage + error.errorMessage +"<br/>";
							});
							if('' != errorMessage && null != errorMessage)
							Ext.Msg.alert("Error",errorMessage);
						}
						
						me.applyQuickFilter();
					},
					failure: function() {
						Ext.Msg.alert("Error","Error while fetching data");
					}
				});						
			
	},
	// ** Preference Handling Save/Clear ** 
	
	handleClearPreferences : function() {
		var me = this;
		me.toggleSavePrefrenceAction(false);
		var arrPref = me.getPreferencesToSave(false);
		me.preferenceHandler.clearPagePreferences(me.strPageName, null,
				me.postHandleClearPreferences, null, me, true);
	},
	handleSavePreferences : function() {
		var me = this;
		var arrPref = me.getPreferencesToSave(false);
		if (arrPref) {
			me.preferenceHandler.savePagePreferences(me.strPageName, arrPref,
					me.postHandleSavePreferences, null, me, true);
		}
	},
	getPreferencesToSave : function(localSave) {
		var me = this;
		var groupView = me.getGroupView();
		var grid = null;
		var arrCols = null, objCol = null, arrColPref = null, arrPref = [], objFilterPref = null;
		var groupInfo = null, subGroupInfo = null, strModule = null, filter = me.getScheduleMonitorFilterView();
		var state = null;
		if (groupView) {
			state = groupView.getGroupViewState();
			groupInfo = groupView.getGroupInfo() || '{}';
			subGroupInfo = groupView.getSubGroupInfo() || {};
			var data = filter.getQuickFilterJSON();
			var financialInstitutionVal = (data['sellerCode'] || "");
			var clientVal = (data['clientDesc'] || "");
			var repOrDwnldDesc = (data['repOrDwnldDesc'] || "");
			var statusFilter = (data['repOrDwnld'] || "");
			var reportTypeDesc = (data['statusCode'] || "");
			strModule = state.groupCode
			arrPref.push({
						"module" : "groupByPref",
						"jsonPreferences" : {
							groupCode : state.groupCode,
							subGroupCode : state.subGroupCode
						}
					});
			arrPref.push({
						"module" : strModule,
						"jsonPreferences" : {
							'gridCols' : state.grid.columns,
							'pgSize' : state.grid.pageSize
						}
					});
			arrPref.push({
						"module" : "groupViewFilterPref",
						"jsonPreferences" : {
							'financialInstitutionVal' : financialInstitutionVal,
							'clientVal' : clientVal,
							'repOrDwnldDesc' : repOrDwnldDesc,
							'statusFilter' : statusFilter,
							'reportTypeDesc' : reportTypeDesc
						}
					});
		}
		return arrPref;
	},
	postHandleSavePreferences : function(data, args, isSuccess) {
		var me = this;
		if (isSuccess === 'N') {
			if (!Ext.isEmpty(me.getBtnSavePreferences()))
				me.toggleSavePrefrenceAction(true);
		} else {
			me.toggleClearPrefrenceAction(true);
		}
	},
	toggleSavePrefrenceAction : function(isVisible) {
		var me = this;
		var btnPref = me.getBtnSavePreferences();
		if (!Ext.isEmpty(btnPref))
			btnPref.setDisabled(!isVisible);
	},	
	// *****End*********
	// ****Filter Persistency***
	doSavePreferenceToLocale : function() {
		var me = this, filter = me.getScheduleMonitorFilterView(); data = null;
		data = filter.getQuickFilterJSON();
		me.preferenceHandler.setLocalPreferences(me.strPageName, data);
	},
	doApplySavedPreferences : function() {
		var me = this, filter = me.getScheduleMonitorFilterView();
		var objPref = null;
		objPref = me.preferenceHandler.getLocalPreferences(me.strPageName);
		if (objPref) {
			strSeller = objPref['sellerCode'] || strSeller;
			strClient = objPref['clientCode'] || strClient;
			strClientDesc = objPref['clientDesc'] || strClientDesc;		
			me.filterDataPref = objPref;
			me.setDataForQuickFilter(objPref);
			me.preferenceHandler.setLocalPreferences(me.strPageName, null);
		}
	},
	doHandleGridRowSelectionChange : function(groupInfo, subGroupInfo, objGrid,
			objRecord, intRecordIndex, arrSelectedRecords, jsonData) {
		var me = this;
		var buttonMask = me.strDefaultMask;
		var objGroupView = me.getGroupView();
		var maskArray = new Array(), actionMask = '', objData = null;
		
		if( !Ext.isEmpty( jsonData ) && !Ext.isEmpty( jsonData.d.__buttonMask ) )
			buttonMask = jsonData.d.__buttonMask;
		maskArray.push( buttonMask );
		for( var index = 0 ; index < arrSelectedRecords.length ; index++ )
		{
			maskArray.push( objData.get( '__metadata' ).__rightsMap );
		}
		actionMask = doAndOperation( maskArray, 5);
		objGroupView.handleGroupActionsVisibility(actionMask);
	},	
	isPregeneratedRowIconVisible : function( store, record, jsonData, itmId, maskPosition )
	{
		return true;
	}
});