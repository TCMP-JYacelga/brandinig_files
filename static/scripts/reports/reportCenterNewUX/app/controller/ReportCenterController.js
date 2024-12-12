/**
 * @class GCP.controller.ReportCenterController
 * @extends Ext.app.Controller
 * @author Anil Pahane
 */

/**
 * This controller is prime controller in Report Center which handles all
 * measure events fired from GroupView. This controller has important
 * functionality like on any change on grid status or quick filter change, it
 * forms required URL and gets data which is then shown on Summary Grid.
 */

Ext.define('GCP.controller.ReportCenterController', {
	extend : 'Ext.app.Controller',
	requires : ['Ext.ux.gcp.DateUtil', 'Ext.ux.gcp.PageSettingPopUp'],
	views : ['GCP.view.ReportCenterView','GCP.view.ReportCenterFilterView','GCP.view.SecurityProfilePopup',
				'Ext.ux.gcp.PreferencesHandler'],
	refs : [{
				ref : 'reportCenterView',
				selector : 'reportCenterView'
			},{
				ref : 'reportCenterFilterView',
				selector : 'filterView reportCenterFilterView'
			},{
				ref : 'groupView',
				selector : 'reportCenterView groupView'
			},{
				ref : 'reportCenterPreGenPopupDtl',
				selector : 'reportCenterPreGenPopup panel[itemId="preGeneratedId"]'
			},{
				ref : 'securityProfilePopup',
				selector : 'securityProfilePopup'
			},{
				ref : 'smartgrid',
				selector : 'reportCenterView groupView smartgrid'
			},{
				ref : 'filterView',
				selector : 'filterView'
			},
			{	ref : 'pageSettingPopUp',
				selector : 'pageSettingPopUp'
			}],
	config : {
		preferenceHandler : null,
		filterData : [],
		favReport : [],
		widgetType : '01',
		reportModule : '01',
		strDefaultMask : '0000',
		strPageName : 'reportCenterNewUX',
		filterDataPref : {},
		strGetModulePrefUrl : 'services/userpreferences/reportCenterNewUX/{0}.json',
		cfgGroupByUrl : 'services/grouptype/reportCenterNewUX/groupBy.srvc?&'+csrfTokenName+'=' + tokenValue + '&$filter=seller eq ' + '\'' + '\'' + strSeller + '\'' + '\' and client eq ' + '\'' + '{0}' + '\'' + ' and seller eq ' + '\'' + strSeller + '\''
		//urlOfGridViewPref : 'userpreferences/reportCenterFilter/reportCenterViewPref.srvc',
		//urlGridViewFilterPref : 'userpreferences/reportCenterFilter/reportCenterViewFilter.srvc'
		
	},
	/**
	 * A template method that is called when your application boots. It is
	 * called before the Application's launch function is executed so gives a
	 * hook point to run any code before your Viewport is created.
	 */	
	init : function() {
		var me = this;
		me.clientFilterVal = strClient;
		me.clientFilterDesc=strClientDesc;
		me.updateConfigs();
		$(document).on('savePreference', function(event) {					
				me.handleSavePreferences();
		});
		$(document).on('clearPreference', function(event) {
				me.handleClearPreferences();
		});
		$(document).on('attachSecurityProfileToReport', function(event) {
				me.attachSecurityProfileToReport();
		});
		$(document).on('handleClientChangeInQuickFilter',function(isSessionClientFilter) {
			me.disablePreferencesButton("savePrefMenuBtn",false);
			me.disablePreferencesButton("clearPrefMenuBtn",false);		
			me.handleClientChangeInQuickFilter(isSessionClientFilter);
		});
		$(document).on('performPageSettings', function(event) {
					me.showPageSettingPopup('PAGE');
		});
		
		me.getFavoriteReports();
		
		me.control({
			'reportCenterFilterView' : {
				beforerender : function() {
					var useSettingsButton = me.getFilterView()
							.down('button[itemId="useSettingsbutton"]');
					if (!Ext.isEmpty(useSettingsButton)) 
						useSettingsButton.hide();
					
					var advanceFilterLbl = me.getFilterView()
							.down('label[itemId="createAdvanceFilterLabel"]');
					if (!Ext.isEmpty(advanceFilterLbl)) 
						advanceFilterLbl.hide();
						
					
					
				},
				afterrender : function(tbar, opts) {
					me.setSelectedFilters();
				},
				'quickFilterChange' : function(filterJson) {
					me.setDataForQuickFilter(filterJson);
					//me.toggleSavePrefrenceAction(true);
					if (me.getReportCenterView())
						me.getReportCenterView().setLoading(true);
					me.applyQuickFilter();
					me.disablePreferencesButton("savePrefMenuBtn",false);
					me.disablePreferencesButton("clearPrefMenuBtn",false);		
				}/*,
				'render' : function() {
					me.setInfoTooltip();
					//me.setDataForQuickFilter();
					me.setSelectedFilters();
				},
				'refreshGroupByTabs': function(client)
				{
					me.refreshGroupByTabs(client); 
				}*/
			},
			'reportCenterView' : {				
				'deleteFavoriteRep' : me.deleteFavoriteRep,
				'addFavoriteRep' : me.addFavoriteRep,
				'addSchedule' : me.addNewScheduleReport,
				'securityProfile' : me.selectSecurityProfile,
				'generateReportId' : me.generateOndemand
			},
			'reportCenterView groupView' : {				
				'groupTabChange' : function(groupInfo, subGroupInfo, tabPanel,
						newCard, oldCard) {	
					//me.setDataForQuickFilter(me.filterJson);		
					me.disablePreferencesButton("savePrefMenuBtn", false);
					me.disablePreferencesButton("clearPrefMenuBtn", false);		
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
					me.disablePreferencesButton("savePrefMenuBtn", false);
				},
				'toggleGridPager' : function() {
					me.disablePreferencesButton("savePrefMenuBtn",false);
				},
				'render' : function(){
					me.applyPreferences();
					/*
					me.firstTime = true;
					if (objReportCenterPref) {
						var objJsonData = Ext.decode(objReportCenterPref);
						if (!Ext.isEmpty(objJsonData.d.preferences)) {
							if (!Ext
									.isEmpty(objJsonData.d.preferences.GeneralSetting)) {
								if (!Ext
										.isEmpty(objJsonData.d.preferences.GeneralSetting.defaultFilterCode)) {
									var advData = objJsonData.d.preferences.GeneralSetting.defaultFilterCode;
									me.doHandleSavedFilterItemClick(advData);
									me.savedFilterVal = advData;
								}
							}
						}
					}
					*/
				},
				'gridSettingClick' : function(){
					me.showPageSettingPopup('GRID');
				}
			},
			'reportCenterView groupView smartgrid' : {
				//'cellclick' : me.doHandleCellClick
			},
			'filterView button[itemId="clearSettingsButton"]' : {
				'click' : function() {
					me.handleClearSettings();
				}
			},
		'filterView' : {
			appliedFilterDelete : function(btn){
				me.handleAppliedFilterDelete(btn);
			}
		},
		'pageSettingPopUp' : {
				'applyPageSetting' : function(popup, data,strInvokedFrom) {
					me.applyPageSetting(data,strInvokedFrom);
				},
				'savePageSetting' : function(popup, data,strInvokedFrom) {
					me.savePageSetting(data,strInvokedFrom);
				},
				'restorePageSetting' : function(popup,data,strInvokedFrom) {
					me.restorePageSetting(data,strInvokedFrom);
				}
			},
		'gridRowActionClick' : function(grid, rowIndex, columnIndex,
				actionName, record) {
			me.doHandleRowActions(actionName, grid, record);
		}
			
			
		});
	},
	
	handleClientChangeInQuickFilter : function(isSessionClientFilter) {
		var me = this;
		me.clientFilterVal = selectedFilterClient;			
		me.clientFilterDesc = selectedFilterClientDesc;
		me.filterApplied = 'Q';
		me.setDataForQuickFilter();
		if (me.clientFilterVal == 'all') {
			me.showAdvFilterCode = null;
			me.filterApplied = 'ALL';
			me.refreshData();
		} else {
			me.applyQuickFilter();
		}
	},
	
	refreshGroupByTabs: function(client)
	{
		var me = this;
		var strUrl = Ext.String.format(me.cfgGroupByUrl, client);
		me.getGroupView().loadGroupByMenus(strUrl);
	},
	
	//Preference handling functions starts
	
	handleClearPreferences : function() {
		var me = this;
		//me.toggleSavePrefrenceAction(false);
		var arrPref = me.getPreferencesToSave(false);
		me.preferenceHandler.clearPagePreferences(me.strPageName, null,
				null, null, me, true);
		me.disablePreferencesButton("savePrefMenuBtn",false);
		me.disablePreferencesButton("clearPrefMenuBtn",true);			
	},
	handleSavePreferences : function()
	{
		var me = this;
		var arrPref = me.getPreferencesToSave(false);
		if (arrPref) {
			me.preferenceHandler.savePagePreferences(me.strPageName, arrPref,
			me.postHandleSavePreferences, null, me, true);
		}
		me.disablePreferencesButton("savePrefMenuBtn",true);
		me.disablePreferencesButton("clearPrefMenuBtn",false);		
	},
	postHandleSavePreferences : function(data, args, isSuccess) {},
	getPreferencesToSave : function(localSave) {
				var me = this;
				var groupView = me.getGroupView();
				var grid = null;
				var arrCols = null, objCol = null, arrColPref = new Array(), arrPref = [], objFilterPref = null;
				var groupInfo = null, subGroupInfo = null;
				  if(groupView){
					grid=groupView.getGrid()
					var gridState=grid.getGridState();				
					groupInfo = groupView.getGroupInfo() || '{}';
					subGroupInfo = groupView.getSubGroupInfo() || {};
					var colPrefModuleName = (subGroupInfo.groupCode === 'all') ? (groupInfo.groupTypeCode + subGroupInfo.groupCode) : subGroupInfo.groupCode;
					
							
						arrPref.push({
							"module" : "groupByPref",
							"jsonPreferences" : {
								groupCode : groupInfo.groupTypeCode,
								subGroupCode : subGroupInfo.groupCode
							}
						});
					arrPref.push({
							"module" : subGroupInfo.groupCode,
							"jsonPreferences" : {
								'gridCols' : gridState.columns,
								'pgSize' : gridState.pageSize,
								'sortState' : gridState.sortState,
								'gridSetting' : groupView.getGroupViewState().gridSetting
							}
						});
				
				}
				objFilterPref = me.getFilterPreferences();
					arrPref.push({
								"module" : "gridViewFilter",
								"jsonPreferences" : objFilterPref
							});
				return arrPref;
	},
	handleClearPreferences : function() {
		var me = this;
		me.preferenceHandler.clearPagePreferences(me.strPageName, null,
			me.postHandleClearPreferences, null, me, true);
			me.disablePreferencesButton("savePrefMenuBtn",false);
			me.disablePreferencesButton("clearPrefMenuBtn",true);	
	},
	postHandleClearPreferences : function(data, args, isSuccess) {
		var me = this;						
	},
	
	doSavePreferenceToLocale : function() {
		var me = this, filter = me.getReportCenterFilterView(); data = null;
		if (!Ext.isEmpty(filter)) 
		{
			data = filter.getQuickFilterJSON();
		}
		me.preferenceHandler.setLocalPreferences(me.strPageName, data);
	},
	doApplySavedPreferences : function() {
		var me = this;
		var objPref = null;
		objPref = me.preferenceHandler.getLocalPreferences(me.strPageName);
		if (objPref) {
			strSeller = objPref['sellerCode'] || strSeller;
			me.filterDataPref = objPref;	
			me.setDataForQuickFilter(objPref);
			me.preferenceHandler.setLocalPreferences(me.strPageName, null);
		}
	},
	/* State handling at local storage starts */
	handleSaveLocalStorage : function()
	{
		var me=this,arrSaveData = [], objSaveState = {},objAdvJson={},objGroupView = me.getGroupView(), grid = objGroupView.getGrid() ,subGroupInfo = null,quickFilterState = {};
		if (objGroupView)
			subGroupInfo = objGroupView.getSubGroupInfo();
		if(!Ext.isEmpty(me.savedFilterVal))
			objSaveState['advFilterCode'] = me.savedFilterVal;
		if(!Ext.isEmpty(me.advFilterData))
		{
			objAdvJson['filterBy'] = me.advFilterData;
			objSaveState['advFilterJson'] = objAdvJson;
		}
		objSaveState['filterAppliedType'] = me.filterApplied;
		objSaveState['quickFilterJson'] = !Ext.isEmpty(me.filterData) ? me.filterData : {};
		objSaveState['subGroupCode'] = (subGroupInfo || {}).groupCode;
		objSaveState['pageSize'] = grid && !Ext.isEmpty(grid.getPageSize()) ? grid.getPageSize() : null;
		objSaveState['pageNo'] = grid && !Ext.isEmpty(grid.getCurrentPage()) ? grid.getCurrentPage() :  1;
		objSaveState['sorter'] = grid && !Ext.isEmpty(grid.getSortState()) ? grid.getSortState() :  [];
		arrSaveData.push({
			"module" : "tempPref",
			"jsonPreferences" : objSaveState
		});
		me.saveLocalPref(arrSaveData);
	},
	saveLocalPref : function(objSaveState)
	{
		var me = this, args = {},strLocalPrefPageName = me.strPageName+'_TempPref';
		if (!Ext.isEmpty(objSaveState))
		{
			args['tempPref'] = objSaveState;
			me.preferenceHandler.savePagePreferences(strLocalPrefPageName, objSaveState,
					me.postHandleSaveLocalPref, args, me, false);
		}
	},
	postHandleSaveLocalPref : function(data, args, isSuccess)
	{
		var me = this,strLocalPrefPageName = me.strPageName+'_TempPref';
		var objLocalPref = {},objTemp={},objTempPref = {}, jsonSaved ={};
		if (isSuccess === 'N')
		{
			Ext.MessageBox.show({
				title : getLabel('instrumentErrorPopUpTitle', 'Error'),
				msg : getLabel('errorMsg', 'Error while apply/restore setting'),
				buttons : Ext.MessageBox.OK,
				cls : 't7-popup',
				icon : Ext.MessageBox.ERROR
			});
		}
		else
		{
			if(args && args.tempPref)
			{
				jsonSaved = args && args.tempPref && args.tempPref[0] && args.tempPref[0].jsonPreferences ? args.tempPref[0].jsonPreferences : {};
				objTemp['tempPref'] = jsonSaved;
				objTempPref['preferences'] = objTemp;
				objLocalPref['d'] = objTempPref;
				me.updateObjLocalPref(objLocalPref);
			}
		}
	},
	updateObjLocalPref : function (data)
	{
		var me = this;
		objSaveLocalStoragePref = Ext.encode(data);
		me.objLocalData = Ext.decode(objSaveLocalStoragePref);
	},
	handleClearLocalPrefernces : function()
	{
		var me = this,args = {},strLocalPrefPageName = me.strPageName+'_TempPref';;
		me.preferenceHandler.clearPagePreferences(strLocalPrefPageName, null,
				me.postHandleClearLocalPreference, args, me, false);
	},
	postHandleClearLocalPreference : function(data, args, isSuccess)
	{
		var me = this, args = {},strLocalPrefPageName = me.strPageName+'_TempPref';
		if (isSuccess === 'N')
		{
			Ext.MessageBox.show({
				title : getLabel('instrumentErrorPopUpTitle', 'Error'),
				msg : getLabel('localerrorMsg', 'Error while clear local setting'),
				buttons : Ext.MessageBox.OK,
				cls : 't7-popup',
				icon : Ext.MessageBox.ERROR
			});
		}
		else if(isSuccess === 'Y')
		{
			objSaveLocalStoragePref = '';
			me.objLocalData = '';
		}
	},
	applyPreferences : function()
	{
		var me = this, objJsonData='', objLocalJsonData='',savedFilterCode='';
		if (objReportCenterPref || objSaveLocalStoragePref)
		{
			objJsonData = Ext.decode(objReportCenterPref);
			objLocalJsonData = Ext.decode(objSaveLocalStoragePref); 
			if (!Ext.isEmpty(objLocalJsonData.d.preferences) 
					&& (!Ext.isEmpty(objLocalJsonData.d.preferences.tempPref)) && allowLocalPreference === 'Y')
			{
				if(!Ext.isEmpty(objLocalJsonData.d.preferences.tempPref.quickFilterJson))
				{
					me.populateSavedFilter(savedFilterCode,objLocalJsonData.d.preferences.tempPref.quickFilterJson,true);
				}
			}
			else
			{
				me.applySavedDefaultPreference(objJsonData);
			}
		}
	},
	populateSavedFilter : function(filterCode, filterData, applyQFilter)
	{
		var me = this;
		for (var i = 0; i < filterData.length; i++)
		{
			var fieldName = filterData[i].paramName;
			var fieldVal = filterData[i].paramValue1;
			if (fieldName === "reportCenterClient")
			{
				var clientComboBox = me.getReportCenterFilterView().down('combo[itemId="clientCombo"]');
				clientComboBox.setValue(fieldVal);
				clientComboBox.setRawValue(filterData[i].displayValue1);
				me.getReportCenterFilterView().clientCode = fieldVal;
				me.getReportCenterFilterView().clientDesc = filterData[i].displayValue1;
			}
			else if(fieldName === "repOrDwnld")
			{
				var reportDownloadComboBox = me.getReportCenterFilterView().down('combobox[itemId="repOrDwnldToolBar"]');
                reportDownloadComboBox.setValue(fieldVal);
                reportDownloadComboBox.setRawValue(filterData[i].displayValue1);
				me.getReportCenterFilterView().repOrDwnld = fieldVal;
				me.getReportCenterFilterView().repOrDwnldDesc = filterData[i].displayValue1;
			}
			else if(fieldName === 'reportType')
			{
				var reportTypeComboBox = me.getReportCenterFilterView().down('combobox[itemId="reportTypeToolBar"]');
				if(fieldVal.length === 2)
				{
					fieldVal = "FAVORITE";
				}
				reportTypeComboBox.setValue(fieldVal);
				reportTypeComboBox.setRawValue(filterData[i].displayValue1);
				me.getReportCenterFilterView().reportType = fieldVal;
				me.getReportCenterFilterView().reportTypeDesc = filterData[i].displayValue1;
			}
		}
		if (applyQFilter)
		{
			me.filterApplied = 'Q';
			me.setDataForFilter();
			me.applyQuickFilter();
			//me.refreshData();
		}
	},
	applySavedDefaultPreference : function(objJsonData)
	{
		var me = this;
		if (!Ext.isEmpty(objJsonData.d.preferences))
		{
			if (!Ext.isEmpty(objJsonData.d.preferences.GeneralSetting))
			{
				if (!Ext.isEmpty(objJsonData.d.preferences.GeneralSetting.defaultFilterCode))
				{
					var advData = objJsonData.d.preferences.GeneralSetting.defaultFilterCode;
					me.doHandleSavedFilterItemClick(advData);
					me.savedFilterVal = advData;
				}
			}
		}
	},
	refreshData : function()
	{
		var me = this;
		var objGroupView = me.getGroupView();
		var grid = objGroupView.getGrid();
		if (grid)
		{
			if (!Ext.isEmpty(me.advSortByData))
			{
				appliedSortByJson = me.getSortByJsonForSmartGrid();
				grid.removeAppliedSort();
				grid.applySort(appliedSortByJson);
			}
			else
			{
				grid.removeAppliedSort();
			}
		}
		objGroupView.refreshData();
	},
	/* State handling at local storage End */
	setSelectedFilters : function() {
		var me = this, filter = me.getFilterView();
		var objPref = null;
		objPref = me.filterDataPref;
		var clientComboBox = me.getReportCenterFilterView()
					.down('combo[itemId="clientCombo"]');
		var selectedClientVal = clientComboBox.getValue();
		var selectedClientText = clientComboBox.getRawValue();
		if(selectedClientVal)
		{
			filter.clientCode = selectedClientVal;
			filter.clientDesc = selectedClientText;
			me.clientFilterVal = selectedClientVal;
		}
		else
		{
			//filter.clientCode = 'all';
			//me.clientFilterVal = 'all';
			//filter.clientDesc = getLabel('allCompanies', 'All Companies');
		}
		var reportTypeCombo=filter.down('combobox[itemId="reportTypeToolBar"]');
		if(objPref.reportType)
		{
			reportTypeCombo.setValue(objPref.reportType);
			filter.reportType = objPref.reportType;
			filter.reportTypeDesc = objPref.reportTypeDesc;
		}
		else
		{
			//reportTypeCombo.setValue("All");
			//filter.reportType = "All";
			//filter.reportTypeDesc = "All";
		}
		if(objPref.statusCode)
		{
			var reportStatusCombo=filter.down('combobox[itemId="reportStatusToolBar"]');
			reportStatusCombo.setValue(objPref.statusCode);
			filter.statusCode = objPref.statusCode;
			filter.statusCodeDesc = objPref.statusFilterDesc;
		}
		var reportDownloadId=filter.down('combobox[itemId="repOrDwnldToolBar"]');
		if(objPref.repOrDwnld)
		{
			reportDownloadId.setValue(objPref.repOrDwnld);
			filter.repOrDwnld =objPref.repOrDwnld;
			filter.repOrDwnldDesc = objPref.repOrDwnldDesc;
		}
		else
		{
			//reportDownloadId.setValue("All");
			//filter.repOrDwnld = "All";
			//filter.repOrDwnldDesc = "All";
		}
		me.setDataForQuickFilter( objPref );
	},
	setButtonCls : function(btn, itemId) {
		var me = this, filter = me.getReportCenterFilterView();
		filter.down('toolbar[itemId='+ itemId +']').items.each(function(
						item) {
					item.removeCls('xn-custom-heighlight');
				});
		btn.addCls('xn-custom-heighlight');
	},
	attachSecurityProfileToReport : function(){
		var me = this;
		var strData = {};
		var repReportCode = $('#repReportCode');
		var repReportType = $('#repReportType');
		var repEntityType = $('#repEntityType');
		var repSecurityPrf = $('#securityProfileCombo');
		var repEntityCode = $('#repEntityCode');
		
		strData['reportCode'] = repReportCode.val();
		strData['securityProfileId'] = repSecurityPrf.val();
		strData['reportType'] = repReportType.val();
		strData['entityType'] = repEntityType.val();
		strData['entityCode'] = repEntityCode.val();

			Ext.Ajax.request(
					{
						url : "attachSecurityProfileToReport.srvc?"+ csrfTokenName + "=" + csrfTokenValue,
						method : 'POST',
						jsonData : Ext.encode(strData),
						success : function( response )
						{
							var isSuccess;
							var title, strMsg, imgIcon;
							if (response && response.responseText)
								var responseData = Ext.decode(response.responseText);
							if (responseData.success)
							{
								isSuccess = responseData.success;
								if (isSuccess && isSuccess === 'N') {
									title = getLabel('instrumentSaveFilterPopupTitle',
											'Message');
									strMsg = responseData.errors[0].errorMessage;
									imgIcon = Ext.MessageBox.ERROR;
									Ext.MessageBox.show({
												title : title,
												msg : strMsg,
												width : 400,
												buttons : Ext.MessageBox.OK,
									buttonText: {
							            ok: getLabel('btnOk', 'OK')
										},
												cls : 'ux_popup',
												icon : imgIcon
											});

								}
								$('#securityProfilePopupDiv').dialog('close');
							}
							else
							{
								$('#securityProfilePopupDiv').dialog('close');
								me.getSmartgrid().refreshData();
							}
						},
						failure : function( response )
						{
							console.log( 'Error Occured' );
						}
					} );			


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
			objData = arrSelectedRecords[ index ];
			maskArray.push( objData.get( '__metadata' ).__rightsMap );
		}
		actionMask = doAndOperation( maskArray, 6 );
		objGroupView.handleGroupActionsVisibility(actionMask);
	},
	
	doHandleGroupActions : function(strAction, grid, arrSelectedRecords,
			strActionType) {
		var me = this;
		var strUrl ;
		if(strAction == 'reportCenterSubmit')
		{
			strUrl = 'loadWidgetsData/submit.srvc?';
		}
		else if(strAction == 'reportCenterDiscard')
		{
			strUrl = 'loadWidgetsData/discard.srvc?';
		}
		else if(strAction == 'reportCenterEnable')
		{
			strUrl = 'loadWidgetsData/enable.srvc?';
		}
		else if(strAction == 'reportCenterDisable')
		{
			strUrl = 'loadWidgetsData/disable.srvc?';
			
		}
		if(strAction == 'reportCenterDisable')
		{
			Ext.MessageBox.confirm('Disable', 'Are you sure disable your Schedules  too?', function(btn){
			  if(btn === 'yes'){
				 me.preHandleGroupActions(strUrl, '', grid, arrSelectedRecords,
					strActionType, strAction)
			   }
			 });
		}
		else
		{
			me.preHandleGroupActions(strUrl, '', grid, arrSelectedRecords,
					strActionType, strAction);
		}
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
								reportCode : records[index].data.reportCode,
								entityCode : records[index].data.entityCode,
								sellerId : records[index].data.sellerId
							});
				}
				if (arrayJson)
					arrayJson = arrayJson.sort(function(valA, valB) {
								return valA.serialNo - valB.serialNo
							});
				groupView.setLoading(true);
				Ext.Ajax.request({
							url : strUrl,
							method : 'POST',
							jsonData : Ext.encode(arrayJson),
							success : function(jsonData) {
								//var jsonRes = Ext.JSON
								//		.decode(jsonData.responseText);
								groupView.setLoading(false);
								me.getSmartgrid().refreshData();
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
	addFavoriteRep : function( reportCode, wdgt )
	{
		var me = this;
		me.favReport.push( reportCode );
		var newReportset = "{\"reports\":" + "[";
		me.flagFavSet = true;
		for( var index = 0 ; index < me.favReport.length ; index++ )
		{
			var rep = me.favReport[ index ];
			var newRep = '"' + rep + '"';
			newReportset = newReportset + newRep;
			if( index != ( me.favReport.length - 1 ) )
				newReportset = newReportset + ",";
		}

		newReportset = newReportset + "]}";
		
		//wdgt.setLoading( true );
		var groupView = me.getGroupView();
		groupView.setLoading( true );

		Ext.Ajax.request(
		{
			url : 'userpreferencesreport/reportCenterNewUX/preferredReports.srvc?'+ csrfTokenName + "=" + csrfTokenValue,
			method : 'POST',
			jsonData : newReportset,
			success : function( response )
			{
				//wdgt.setLoading( false );
				groupView.setLoading( false );
				var data = Ext.decode(response.responseText);
				var isSuccess;
				var title, strMsg, imgIcon;
				if (data.d.preferences && data.d.preferences.success)
					isSuccess = data.d.preferences.success;
				if (isSuccess && isSuccess === 'N') {
						title = getLabel('SaveFilterPopupTitle',
								'Message');
						strMsg = data.d.preferences.error.errorMessage;
						imgIcon = Ext.MessageBox.ERROR;
						Ext.MessageBox.show({
									title : title,
									msg : strMsg,
									width : 200,
									buttons : Ext.MessageBox.OK,
									buttonText: {
							            ok: getLabel('btnOk', 'OK')
										},
									cls : 't7-popup',
									icon : imgIcon
								});

				} else {
						Ext.MessageBox.show({
									title : title,
									msg : getLabel('prefSavedMsg',
											'Preferences Saved Successfully'),
									buttons : Ext.MessageBox.OK,
									buttonText: {
							            ok: getLabel('btnOk', 'OK')
										},
									fn: function(btn){
										doHandlePageRefreshClick();
									},
									cls : 't7-popup',
									icon : Ext.MessageBox.INFO
								});
				}
			},
			failure : function()
			{
				if (blnShowMsg === true) {
					var errMsg = "";
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
								cls : 't7-popup',
								icon : Ext.MessageBox.ERROR
							});
				}
			}
		} );

		var favLength = me.favReport.length;
		/*
		 * me.getFavButtonRef().setText(getLabel('favorites',
		 * 'Favorites') + "(<span class='red'>" + favLength + "</span>)");
		 * me.getFavButtonRef().accArray = me.favReport;
		 */
	},
	deleteFavoriteRep : function( reportCode, wdgt )
	{
		var reportId = reportCode;
		var me = this;
		me.flagFavSet = true;
		var index = me.favReport.indexOf( reportId, 0 );

		if( index > -1 )
		{
			me.favReport.splice( index, 1 );
		}
		var newReportset = "{\"reports\":" + "[";

		for( var index = 0 ; index < this.favReport.length ; index++ )
		{
			var Acc = me.favReport[ index ];
			var newAcc = '"' + Acc + '"';
			newReportset = newReportset + newAcc;
			if( index != ( me.favReport.length - 1 ) )
				newReportset = newReportset + ",";
		}

		newReportset = newReportset + "]}";

		//wdgt.setLoading( true );
		var groupView = me.getGroupView();
		groupView.setLoading( true );
		
		Ext.Ajax.request(
		{
			url : 'userpreferencesreport/reportCenterNewUX/preferredReports.srvc?'+ csrfTokenName + "=" + csrfTokenValue,
			method : 'POST',
			jsonData : newReportset,
			success : function( response )
			{
				//wdgt.setLoading( false );
				groupView.setLoading( false );
				var data = Ext.decode(response.responseText);
				var isSuccess;
				var title, strMsg, imgIcon;
				if (data.d.preferences && data.d.preferences.success)
					isSuccess = data.d.preferences.success;
				if (isSuccess && isSuccess === 'N') {
						title = getLabel('SaveFilterPopupTitle',
								'Message');
						strMsg = data.d.preferences.error.errorMessage;
						imgIcon = Ext.MessageBox.ERROR;
						Ext.MessageBox.show({
									title : title,
									msg : strMsg,
									width : 200,
									buttons : Ext.MessageBox.OK,
									buttonText: {
							            ok: getLabel('btnOk', 'OK')
										},
									cls : 't7-popup',
									icon : imgIcon
								});

				} else {
						Ext.MessageBox.show({
									title : title,
									msg : getLabel('prefSavedMsg',
											'Preferences Saved Successfully'),
									buttons : Ext.MessageBox.OK,
									buttonText: {
							            ok: getLabel('btnOk', 'OK')
										},
									fn: function(btn){
										doHandlePageRefreshClick();
									},
									cls : 't7-popup',
									icon : Ext.MessageBox.INFO
								});
				}
			},
			failure : function()
			{
				if (blnShowMsg === true) {
					var errMsg = "";
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
								cls : 't7-popup',
								icon : Ext.MessageBox.ERROR
							});
				}
			}

		} );
		var favLength = me.favReport.length;
		/*
		 * me.getFavButtonRef().setText(getLabel('favorites',
		 * 'Favorites') + "(<span class='red'>" + favLength + "</span>)");
		 * me.getFavButtonRef().accArray = me.favReport;
		 */
	},
	
	getFavoriteReports : function()
	{
		var me = this;
		Ext.Ajax.request(
		{
			url : 'userpreferencesreport/reportCenterNewUX.srvc' ,
			headers: objHdrCsrfParams,
			method : "GET",
			success : function( response )
			{
				if( response.responseText != '' )
					me.loadFavoriteReports( Ext.decode( response.responseText ) );
			},
			failure : function( response )
			{
				// console.log('Error
				// Occured-handleAccountTypeLoading');
			}
		} );
	},
	
	loadFavoriteReports : function( data )
	{
		if( data.error == null )
		{
			var me = this;
			var jsonData = JSON.parse( data.preference );
			// var FavoritesCount = jsonData.reports.length;
			var accSetArray = jsonData.reports;
			var accFavArrInt = [];
			if(!Ext.isEmpty(jsonData.reports))
			{
				for( i = 0 ; i < jsonData.reports.length ; i++ )
				{
					accFavArrInt.push( accSetArray[ i ] );
				}
			}
			me.favReport = accFavArrInt;
		}
	},
	
	applyQuickFilter : function() {
		var me = this;
		var groupView = me.getGroupView();
		var grid = groupView.down('smartgrid');
		if(grid)
			grid.refreshData();
	},
	doHandleCellClick : function( view, td, cellIndex, record, tr, rowIndex, e, eOpts ) {
		var clickedColumn = view.getGridColumns()[cellIndex];
		var columnType = clickedColumn.colType;
		if(columnType !== 'actioncontent' && columnType !== 'action'){
			var me = this;
			me.generateOndemand(record);
		}
	},	
	
	generateOndemand : function( record )
	{
		var me = this;
		me.doSavePreferenceToLocale();
		me.submitRequest( 'Generate', record );
	},
	editReport : function( record )
	{
		var me = this;
		me.submitRequest( 'editReport', record );
	},
	selectSecurityProfile : function( record ,viewSmartGrid)
	{
		var reportName = record.raw.reportName;		
		var clientCode = record.get('entityCode');
		var sellerCode = record.get('sellerId');
		
		showSecurityProfilePopup(record, reportName,clientCode, sellerCode);
	},
	/*selectSecurityProfile : function( record ,viewSmartGrid)
	{
		var me = this;
		var clientCode = record.raw.entityCode;
		var sellerCode = record.raw.sellerId;
		var entityType = record.raw.entityType;
		var strUrl = 'getSecurityProfile.srvc?';
		var selectedProfileId = record.raw.securityProfileId;
		var reportCode = record.raw.reportCode;
		var reportName = record.raw.reportName;
		var storeData = me.handleSecurityProfileLoading( record,viewSmartGrid );
		var objSecurityProfilePopup = Ext.create('GCP.view.SecurityProfilePopup',{
			clientCode : clientCode,
			sellerCode : sellerCode,
			entityType : entityType,
			strUrl : strUrl,
			storeData : storeData,
			selectedProfileId : selectedProfileId,
			reportCode : reportCode,
			reportName : reportName,
			record : record
			});
		objSecurityProfilePopup.show();
	},	
	handleSecurityProfileLoading : function(record,viewSmartGrid)
	{
		var storeData = null;
		var me = this;
		var clientCode = record.get('entityCode');
		var sellerCode = record.get('sellerId');
		var strUrl = 'getSecurityProfile.srvc?';
		if(clientCode != null && sellerCode != null)
		{
			Ext.Ajax.request(
			{
				url : strUrl + csrfTokenName + '=' + csrfTokenValue + '&$sellerFilter=' + sellerCode + '&$clientFilter=' + clientCode,
				method : "POST",
				async : false,
				success : function( response )
				{
					storeData =  Ext.decode( response.responseText );
				},
				failure : function( response )
				{
					console.log( 'Error Occured' );
				}
			} );
		}
		return storeData;
	},	*/
	preGeneratedReport : function( record )
	{
		var me = this;
		if( !Ext.isEmpty( me.objPreGenPopup ) )
		{
			me.objPreGenPopup.show();
		}
		else
		{
			me.objPreGenPopup = Ext.create( 'GCP.view.ReportCenterPreGenPopup' );
			me.objPreGenPopup.show();
		}
		me.handlePreGenSmartGridConfig( record );
	},	
	handlePreGenSmartGridConfig : function( record )
	{
		var me = this;

		//var preGenGrid = me.getReportCenterPreGenGrid();
		var objConfigMap = me.getPreGenConfiguration();
		var arrCols = new Array();
		arrCols = me.getPreGenColumns( objConfigMap.arrColsPref, objConfigMap.objWidthMap );
		//if( !Ext.isEmpty( preGenGrid ) )
		//	preGenGrid.destroy( true );
		me.handlePreGenSmartGridLoading( arrCols, objConfigMap.storeModel, record );
	},

	getPreGenColumns : function( arrColsPref, objWidthMap )
	{
		var me = this;
		var arrCols = new Array(), objCol = null, cfgCol = null;
		arrCols.push( me.createPreGenActionColumn() )
		if( !Ext.isEmpty( arrColsPref ) )
		{
			for( var i = 0 ; i < arrColsPref.length ; i++ )
			{
				objCol = arrColsPref[ i ];
				cfgCol = {};
				cfgCol.colHeader = objCol.colDesc;
				cfgCol.colId = objCol.colId;
				if( !Ext.isEmpty( objCol.colType ) )
				{
					cfgCol.colType = objCol.colType;
					if( cfgCol.colType === "number" )
						cfgCol.align = 'right';
				}

				cfgCol.width = !Ext.isEmpty( objWidthMap[ objCol.colId ] ) ? objWidthMap[ objCol.colId ] : 120;

				cfgCol.fnColumnRenderer = me.columnRenderer;
				arrCols.push( cfgCol );
			}
		}
		return arrCols;
	},
	createPreGenActionColumn : function()
	{
		var me = this;
		var objActionCol =
		{
			colType : 'actioncontent',
			colId : 'btnDownloadId',
			width : 100,
			align : 'right',
			locked : true,
			items :
			[
				{
					itemId : 'btnDownload',
					text : 'Download',
					itemLabel : getLabel( 'download', 'Upload to Other System' )
				}
			]
		};
		return objActionCol;
	},
	handleRowIconClickDwnld: function( tableView, rowIndex, columnIndex, btn, event, record )
	{
		var me = this;		
		me.submitRequest( 'Download', record );
	},
	getPreGenConfiguration : function()
	{
		var me = this;
		var objConfigMap = null;
		var objWidthMap = null;
		var arrColsPref = null;
		var storeModel = null;

		objWidthMap =
		{
			"gendatetime" : 300,
			"size" : 80,
			"copies" : 100,
			"gastatus" : 200,
			"fileExtension" : 130
		};
		arrColsPref =
		[
			{
				"colId" : "genDateTime",
				"colDesc" : "Generated On"
			},
			{
				"colId" : "size",
				"colDesc" : "Size"
			},
			{
				"colId" : "fileExtension",
				"colDesc" : "Extension"
			}
		];

		storeModel =
		{
			fields :
			[
				'genDateTime', 'size', 'copies', 'gaStatus', 'recordKeyNo', 'gaFileName', 'schTempFileDir','fileExtension'
			],
			proxyUrl : 'getPreGeneratedList.srvc',
			rootNode : 'd.reportCenter',
			totalRowsNode : 'd.__count'
		};

		objConfigMap =
		{
			"objWidthMap" : objWidthMap,
			"arrColsPref" : arrColsPref,
			"storeModel" : storeModel
		};
		return objConfigMap;
	},

	handlePreGenSmartGridLoading : function( arrCols, storeModel, record )
	{
		var me = this;
		var pgSize = null;
		var reportCode = record.get( 'reportCode' );
		var reportCenterPregenGrid = null;
		pgSize = 5;
		var reportCenterPreGenPopupDtl = me.getReportCenterPreGenPopupDtl();
		var reportCenterPregenGrid = Ext.getCmp( 'gridPreGenItemId' );

		if( typeof reportCenterPregenGrid == 'undefined' )
		{
			reportCenterPregenGrid = Ext.create( 'Ext.ux.gcp.SmartGrid',
			{
				id : 'gridPreGenItemId',
				itemId : 'gridPreGenItemId',
				pageSize : pgSize,
				autoDestroy : true,
				stateful : false,
				showEmptyRow : false,
				showSummaryRow : true,
				padding : '5 0 0 0',
				showCheckBoxColumn : false,
				rowList :
				[
					5, 10, 15, 20, 25, 30
				],
				minHeight : 180,
				columnModel : arrCols,
				storeModel : storeModel,
				isRowIconVisible : me.isPregeneratedRowIconVisible,
				isRowMoreMenuVisible : me.isRowMoreMenuVisible,
				handleRowMoreMenuClick : me.handleRowMoreMenuClick,

				handleRowIconClick : function( tableView, rowIndex, columnIndex, btn, event, record )
				{
					me.handleRowIconClickDwnld( tableView, rowIndex, columnIndex, btn, event, record );
				},
				listeners :
				{
					render : function( reportCenterPregenGrid )
					{
						me.handlePreGenLoadGridData( reportCenterPregenGrid, reportCode, 1, 1, record );
					},
					afterrender : function( reportCenterPregenGrid )
					{
						me.handlePreGenLoadGridData( reportCenterPregenGrid, reportCode, 1, 1, record );
					},
					gridPageChange : function( reportCenterPregenGrid, strDataUrl, intPgSize, intNewPgNo, intOldPgNo,
						jsonSorter )
					{
						me.handlePreGenLoadGridData( reportCenterPregenGrid, reportCode, intNewPgNo, intOldPgNo, record  );
					},
					gridSortChange : function( reportCenterPregenGrid, strDataUrl, intPgSize, intNewPgNo, intOldPgNo,
						jsonSorter )
					{
						me.handlePreGenLoadGridData( reportCenterPregenGrid, reportCode, intNewPgNo, intOldPgNo,record );
					}
				}
			} );
			reportCenterPregenGrid.view.refresh();
			reportCenterPreGenPopupDtl.add( reportCenterPregenGrid );
			reportCenterPreGenPopupDtl.doLayout();
		}

		me.handlePreGenLoadGridData( reportCenterPregenGrid, reportCode, 1, 1,record );
	},
	
	handlePreGenLoadGridData : function( grid, reportCode, intNewPgNo, intOldPgNo, record )
	{
		var me = this;
		var distributionId = record.get( 'distributionId' );

		if( Ext.isEmpty( distributionId ) )
		{
			distributionId = ' ';
		}
		var strUrl = grid.generateUrl( grid.store.dataUrl, grid.pageSize, intNewPgNo, intOldPgNo, null );
		/* Commented By Naresh M
		strUrl += '&' + csrfTokenName + "=" + csrfTokenValue + 
		'&$argString=' + reportCode +
		'&$showEntityType=' + record.get( 'showEntityType' ) +
		'&$entityCode=' + record.get( 'entityCode' ) +
		'&$srcName=' + record.get( 'reportName' )  +
		'&$srcId=' + record.get( 'reportCode' ) +
		'&$distributionId=' + distributionId +
		'&$originalSourceId=' + record.get( 'originalSourceId' ) +
		'&$moduleCode=' + record.get( 'moduleCode' ) +
		'&$srcTag=' + record.get( 'reportType' ) +
		'&$srcType=' + record.get( 'srcType' );
		*/
		 
		 strUrl += '&' + csrfTokenName + "=" + csrfTokenValue + 
		'&$argString=' + reportCode +
		'&$entityCode=' + record.get( 'entityCode' ) +
		'&$srcName=' + record.get( 'reportName' )  +
		'&$srcId=' + record.get( 'reportCode' ) +
		'&$distributionId=' + distributionId +
		'&$sellerId=' + record.get('sellerId') +
		'&$originalSourceId=' + record.get( 'originalSourceId' ) +
		'&$moduleCode=' + record.get( 'moduleCode' ) +
		'&$srcTag=' + record.get( 'reportType' ) +
		'&$srcType=' + record.get( 'srcType' );
		 
		grid.loadGridData( strUrl, null );

	},
	addNewScheduleReport : function( record )
	{
		var me = this;
		me.doSavePreferenceToLocale();
		me.submitRequest( 'addSchedule', record );
	},
	updateConfigs : function() {
		var me = this;
		me.preferenceHandler = Ext.create('Ext.ux.gcp.PreferencesHandler');
		if (!Ext.isEmpty(objGridViewFilterPref)) {
					var data = Ext.decode(objGridViewFilterPref);
					var reportOrDownload = data.repOrDwnld;
					var status = data.statusCode;
					var seller = data.financialInstitutionVal;
					var reportType = data.reportType;
					var objPref = {};
					objPref['sellerCode'] = seller;
					//objPref['clientCode'] = clientVal;
					//objPref['clientDesc'] = clientDesc;
					objPref['repOrDwnld'] = reportOrDownload;
					objPref['reportType'] = reportType;
					objPref['statusCode'] = status;
					me.clientFilterVal = data.filterSelectedClientCode;
					me.clientFilterDesc = data.filterSelectedClientDesc;
					me.setDataForQuickFilter(objPref);
					if (entity_type == '1') {
						$("#summaryClientFilterSpan").text(me.clientFilterDesc);
						changeClientAndRefreshGrid(me.clientFilterVal,me.clientFilterDesc)
					}else if(entity_type=='0'){
						$("#summaryClientFilter").val(me.clientFilterDesc);
						changeClientAndRefreshGrid(me.clientFilterVal,me.clientFilterDesc)
					}
					me.filterDataPref = objPref;
					/* Set Filter Elements Value Of Filter Panle */
					
		}
		
		//me.widgetType = 
	},
	doHandleLoadGridData : function(groupInfo, subGroupInfo, grid, url, pgSize,
			newPgNo, oldPgNo, sorter) {		
		var me = this;
		var objGroupView = me.getGroupView();
		var buttonMask = me.strDefaultMask;
		var arrOfParseQuickFilter = [], arrOfFilteredApplied = [];
		url = url + me.widgetType + '.srvc';
		//saving local preferences
		if(allowLocalPreference === 'Y')
			me.handleSaveLocalStorage();
		objGroupView.handleGroupActionsVisibility(buttonMask);
		var strUrl = grid.generateUrl(url, pgSize, newPgNo, oldPgNo, sorter);
		strUrl += me.generateFilterUrl(groupInfo, subGroupInfo);
		strUrl = strUrl + "&" + csrfTokenName + "=" + csrfTokenValue;
		if (!Ext.isEmpty(me.filterData)) {
			if (!Ext.isEmpty(me.filterData) && me.filterData.length >= 1) {
				var quickJsonData = me.filterData;
				var reqJsonInQuick = me.findInQuickFilterData(quickJsonData,'Seller');
				if (!Ext.isEmpty(reqJsonInQuick)) {
					arrQuickJson = quickJsonData;
					arrQuickJson = me.removeFromQuickArrJson(arrQuickJson,'Seller');
					quickJsonData = arrQuickJson;
				}
				arrOfParseQuickFilter = generateFilterArray(quickJsonData);
			}
		}


		if (arrOfParseQuickFilter) {
				me.getFilterView().updateFilterInfo(arrOfParseQuickFilter);
		}

		grid.loadGridData(strUrl, null, null, false);
		
		grid.on('cellclick', function(tableView, td, cellIndex, record, tr,
						rowIndex, e) {
					var clickedColumn = tableView.getGridColumns()[cellIndex];
					var columnType = clickedColumn.itemId;
					if (Ext.isEmpty(columnType)) {
						var containsCheckboxCss = (clickedColumn.cls
								.indexOf('x-column-header-checkbox') > -1)
						columnType = containsCheckboxCss
								? 'col_checkboxColumn'
								: '';
					}
					me.handleGridRowClick(record, grid, columnType);
				});
	},
	handleGridRowClick : function(record, grid, columnType) {
		if (columnType !== 'col_actioncontent' && columnType !== 'col_checkboxColumn' && columnType !== 'col_favorite') {
			var me = this;
			var columnModel = null;
			var columnAction = null;
			if (!Ext.isEmpty(grid.columnModel)) {
				columnModel = grid.columnModel;
				for (var index = 0; index < columnModel.length; index++) {
					if (columnModel[index].colId == 'actioncontent') {
						columnAction = columnModel[index].items;
						break;
					}
				}
			}
			var arrVisibleActions = [];
			var arrAvailableActions = [];
			if (!Ext.isEmpty(columnAction))
				arrAvailableActions = columnAction;
			var store = grid.getStore();
			var jsonData = store.proxy.reader.jsonData;
			if (!Ext.isEmpty(arrAvailableActions)) {
				for (var count = 0; count < arrAvailableActions.length; count++) {
					var btnIsEnabled = false;
					if (!Ext.isEmpty(grid)
							&& !Ext.isEmpty(grid.isRowIconVisible)) {
						btnIsEnabled = grid.isRowIconVisible(store, record,
								jsonData, arrAvailableActions[count].itemId,
								arrAvailableActions[count].maskPosition);
						if (btnIsEnabled == true) {
							arrVisibleActions.push(arrAvailableActions[count]);
							btnIsEnabled = false;
						}
					}
				}
			}
			if (!Ext.isEmpty(arrVisibleActions)) {
				me
						.doHandleRowActions(arrVisibleActions[0].itemId, grid,
								record);
			}
		} else {
		}
	},
	generateFilterUrl : function(groupInfo, subGroupInfo) {
		var me = this;
		var filterView = me.getReportCenterFilterView();
		var strQuickFilterUrl = '', strWidgetFilterUrl = '', strUrl = '', isFilterApplied = false, isFavouriteFilter = false;
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
		if(!Ext.isEmpty(filterView))
		{
			if(filterView.reportType == 'FAVORITE'){
				strUrl += '&$isFavouriteFilter=Y';
			}
		}
		if(strDownloadFilter == 'D'){
			strUrl += '&$isDownloadFilter=D';
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
		/*
		if(Ext.isEmpty(filterData))
		{
			if (!Ext.isEmpty(me.clientFilterVal) && me.clientFilterVal !='all') {
				filterData.push({
							paramName : 'client',
							paramValue1 : encodeURIComponent(me.clientFilterVal.replace(new RegExp("'", 'g'), "\''")),
							operatorValue : 'eq',
							dataType : 'S'
						});
			}
		}
		*/
		for (var index = 0; index < filterData.length; index++) {
			if(filterData[index].paramName === 'reportType' && filterData[index].paramValue1 === '%'){
				continue;
			}
			if (isFilterApplied)
				strTemp = strTemp + ' and ';
			switch (filterData[index].operatorValue) {
				case 'eq' :
				case 'lk' :
					isFilterApplied = true;
					strTemp = strTemp + filterData[index].paramName + ' '
							+ filterData[index].operatorValue + ' ' + '\''
							+ filterData[index].paramValue1 + '\'';
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
			}
			isFilterApplied = true;
		}
		if (isFilterApplied)
			strFilter = strFilter + strTemp;
		else
			strFilter = '';	
		return strFilter;
	},
	generateWidgetUrl : function(groupInfo, subGroupInfo) {
		if(subGroupInfo.groupCode != 'all'){
			var strWidgetFilter = 'reportCenterModule' + ' eq ' + '\'' + subGroupInfo.groupCode + '\'';
		}else{
			var strWidgetFilter = '';'reportCenterModule' + ' eq ' + '\'' + '%' + '\'';
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

		if(groupInfo){
			if (groupInfo.groupTypeCode == 'ADV_FILTER') {
					strModule = subGroupInfo.groupCode
				args = {
					'module' : strModule
					};
				me.preferenceHandler.readModulePreferences(me.strPageName,
						strModule, me.postDoHandleGroupTabChange, args, me, true);
			} 
			else {
					args = {
							scope : me
					};
				strModule = subGroupInfo.groupCode;
				strUrl = Ext.String.format(me.strGetModulePrefUrl, strModule);
				me.getSavedPreferences(strUrl,
						me.postDoHandleGroupTabChange, args);
			}
		}
	},	
	postDoHandleGroupTabChange : function(data, args, isSuccess) {
		
		var me = args.scope;
		var objGroupView = me.getGroupView();
		var objSummaryView = me.getReportCenterView(), objPref = null, gridModel = null, intPgSize = null,showPager = true, heightOption = null;
		var colModel = null, arrCols = null;;
		var colModel = null, arrCols = null;
		if (data && data.preference) {
			//me.toggleClearPrefrenceAction(true);
			objPref = Ext.decode(data.preference);
			arrCols = objPref.gridCols
					|| objDefPref[mapService[args['module']]] || null;
			intPgSize = objPref.pgSize || _GridSizeTxn;
			colModel = objSummaryView.getColumns(arrCols);
			showPager = objPref.gridSetting
					&& !Ext.isEmpty(objPref.gridSetting.showPager)
					? objPref.gridSetting.showPager
					: true;
			heightOption = objPref.gridSetting
					&& !Ext.isEmpty(objPref.gridSetting.heightOption)
					? objPref.gridSetting.heightOption
					: null;		
			if (colModel) {
				gridModel = {
					columnModel : colModel,
					pageSize : intPgSize,
					showPagerForced : showPager,
					heightOption : heightOption,
					storeModel:{
					  sortState:objPref.sortState
                    }
				};
			}
		}
		objGroupView.reconfigureGrid(gridModel);
	},
	getSavedPreferences : function(strUrl, fnCallBack, args) {
		var me = this;
		Ext.Ajax.request({
					url : strUrl,
					method : 'GET',
					success : function(response) {
						var data = null;
						if (response && response.responseText)
							data = Ext.decode(response.responseText);
						Ext.Function.bind(fnCallBack, me);
						if (fnCallBack)
							fnCallBack(data, args);
					},
					failure : function() {
					}

				});
	},
	setDataForQuickFilter : function(filterJson) {
		var me = this, filter = me.getReportCenterFilterView(), arrFilter = [];
		var data = null;
		var isClient = true;
		var clientComboBox = me.getReportCenterFilterView()
					.down('combo[itemId="clientCombo"]');
		var selectedClientVal = clientComboBox.getValue();
		var selectedClientText = clientComboBox.getRawValue();
		if(!me.isEmptyObject(filterJson)){
			data = filterJson;
		}
		else if(null != filter){
			data = filter.getQuickFilterJSON();
		}
		if (selectedClientVal && selectedClientVal !='all')
		{
				arrFilter.push({
							paramName : 'reportCenterClient',
							paramValue1 : encodeURIComponent(selectedClientVal.replace(new RegExp("'", 'g'), "\''")),
							paramFieldLable : getLabel('reportCenterClient', 'Company Name'),
							operatorValue : 'eq',
							displayValue1 : selectedClientText,
							displayType : 5,
							dataType : 'S'
						});
				isClient = false;
		}
		if (data) {
			/*if (data['sellerCode'])
				arrFilter.push({
							paramName : 'reportCenterSeller',
							paramValue1 : (data['sellerCode'] || '')
									.toUpperCase(),
							operatorValue : 'eq',
							displayType : 5,
							dataType : 'S'
						});*/
			if (data['clientCode'] && isClient && isFirstTime)
			{
				selectedClientVal = data['clientCode'];
				selectedClientText = data['clientDesc'],
				arrFilter.push({
					paramName : 'reportCenterClient',
					paramValue1 : encodeURIComponent(selectedClientVal.replace(new RegExp("'", 'g'), "\''")),
					paramFieldLable : getLabel('reportCenterClient', 'Company Name'),
					operatorValue : 'eq',
					displayValue1 : selectedClientText,
					displayType : 5,
					dataType : 'S'
				});
				clientComboBox.setValue(selectedClientVal);
				clientComboBox.setRawValue(selectedClientText);
			}
			if (data['repOrDwnld'])
			{
				arrFilter.push({
							paramName : 'repOrDwnld',
							paramValue1 : (data['repOrDwnld'] || ''),
							paramFieldLable : getLabel('repOrDwnld', 'Reports or Downloads'),
							displayValue1 : data['repOrDwnldDesc'],
							operatorValue : 'eq',
							displayType : 5,
							dataType : 'S'
						});
				strDownloadFilter = data['repOrDwnld'];
				if(isFirstTime)
				{
					var reportDownloadComboBox = me.getReportCenterFilterView().down('combobox[itemId="repOrDwnldToolBar"]');
	                reportDownloadComboBox.setValue((data['repOrDwnld'] || ''));
	                reportDownloadComboBox.setRawValue(data['repOrDwnldDesc']);
					me.getReportCenterFilterView().repOrDwnld = (data['repOrDwnld'] || '');
					me.getReportCenterFilterView().repOrDwnldDesc = data['repOrDwnldDesc'];
			}
			}
			if (data['reportType'])
			{
				arrFilter.push({
							paramName : 'reportType',
						paramValue1 : data['reportType'] === 'FAVORITE' ? ['S','C'] :  (data['reportType'] || ''),
							operatorValue : 'in',
							paramFieldLable : getLabel('reportType', 'Report/Download Type'),
							displayValue1 : data['reportTypeDesc'],
							displayType : 5,
							dataType : 'S'
						});
				if(isFirstTime)
				{
					var reportTypeComboBox = me.getReportCenterFilterView().down('combobox[itemId="reportTypeToolBar"]');
					if(data['reportType'].length === 2)
					{
						reportTypeComboBox.setValue("FAVORITE");
						me.getReportCenterFilterView().repOrDwnld = "FAVORITE";
			}			
					else
					{
						reportTypeComboBox.setValue(data['reportType'] || '');
						me.getReportCenterFilterView().repOrDwnld = (data['reportType'] || '');
					}
					reportTypeComboBox.setRawValue(data['reportTypeDesc']);
					me.getReportCenterFilterView().repOrDwnldDesc = data['reportTypeDesc'];
				}
			}
			if (data['statusCode'])
				arrFilter.push({
							paramName : 'reportStatus',
							paramValue1 : (data['statusCode'] || ''),
							operatorValue : 'eq',
							dataType : 'S'
						});
			isFirstTime = false;
		}
		me.filterData = arrFilter;
	},
	setInfoTooltip : function() {
	var me = this, filter = me.getReportCenterFilterView(), arrFilter = [];
	Ext.create('Ext.tip.ToolTip', {
				target : 'imgFilterInfoStdView',
				listeners : {
					'beforeshow' : function(tip) {
						var data = filter.getQuickFilterJSON();
						var financialInstitutionVal = data['sellerCode'];
						var clientVal = (data['clientDesc'] || getLabel(
								'none', 'None'));
						var repOrDwnldDesc = (data['repOrDwnldDesc'] || getLabel(
								'all', 'All'));
						var statusFilter = (data['statusCodeDesc'] || getLabel(
								'all', 'All'));
						var reportTypeDesc = (data['reportTypeDesc'] || getLabel(
								'all', 'All'));
						tip.update(getLabel('financialInstitution',
								'Financial Insitution')
								+ ' : '
								+ financialInstitutionVal
								+ '<br/>'
								+ getLabel('grid.column.company', 'Company Name')
								+ ' : '
								+ clientVal
								+ '<br/>'
								+ getLabel( 'repOrDwnld', 'Report or Upload' )
								+ ' : '
								+ repOrDwnldDesc
								+ '<br/>'
								+ getLabel( 'repOrDwnldType', 'Report Type' )
								+ ' : '
								+ reportTypeDesc);
					}
				}
			});

	},
	submitRequest : function( str, record )
	{
		var me = this;
		form = document.createElement( 'FORM' );
		form.name = 'frmMain';
		form.id = 'frmMain';
		form.method = 'POST';
		if( str == 'addReport' )
		{
			strUrl = "addCustomReport.srvc";
			var reportCenterFilterView = me.getReportCenterFilterView();
			form.appendChild(me.createFormField('INPUT', 'HIDDEN',	'clientCode', reportCenterFilterView.clientCode));
			form.appendChild( me.createFormField( 'INPUT', 'HIDDEN', 'entitlementSeller', strSeller ) );
			form.appendChild( me.createFormField( 'INPUT', 'HIDDEN', 'reportCode', '' ) );
		}
		if( str == 'addIMDef' )
		{
			strUrl = "interfaceMapCenter.srvc";
		}
		if( str == 'editReport' )
		{
			strUrl = "editCustomReport.srvc";
			form.appendChild( me.createFormField( 'INPUT', 'HIDDEN', 'reportCode', record.get( 'reportCode' ) ) );
			form.appendChild( me.createFormField( 'INPUT', 'HIDDEN', 'clientCode', record.get( 'entityCode' ) ) );
			form.appendChild( me.createFormField( 'INPUT', 'HIDDEN', 'entitlementSeller', record.get( 'sellerId' ) ) );
		}
		else
			if( str == 'addSchedule' )
			{
				strUrl = "addScheduleDefination.srvc";
			
				form.appendChild( me.createFormField( 'INPUT', 'HIDDEN', 'schSrcId', record.get( 'reportCode' ) ) );
				form.appendChild( me.createFormField( 'INPUT', 'HIDDEN', 'schSrcName', record.get( 'reportName' ) ) );
				form.appendChild( me.createFormField( 'INPUT', 'HIDDEN', 'schSecurityProfileName', record.get( 'securityProfile' ) ) );
				form.appendChild( me.createFormField( 'INPUT', 'HIDDEN', 'schSecurityProfileID', record.get( 'securityProfileId' ) ) );
				form.appendChild( me.createFormField( 'INPUT', 'HIDDEN', 'schDelInfo', record.get( 'delInfo' ) ) );
				form.appendChild( me.createFormField( 'INPUT', 'HIDDEN', 'schDelMedium', (record.get('medium') == 'EMAIL' ?'SMTP' : record.get('medium'))) );
				form.appendChild( me.createFormField( 'INPUT', 'HIDDEN', 'schDelOutput', record.get('delOutput')));
				form.appendChild( me.createFormField( 'INPUT', 'HIDDEN', 'schModuleCode', record.get( 'moduleCode' ) ) );
				form.appendChild( me.createFormField( 'INPUT', 'HIDDEN', 'schSrcType', record.get( 'srcType' ) ) );
				form.appendChild( me.createFormField( 'INPUT', 'HIDDEN', 'schSrcSubType', record.get( 'reportType' ) ) );
				form.appendChild( me.createFormField( 'INPUT', 'HIDDEN', 'schEntityCode', record.get( 'entityCode' ) ) );
				form.appendChild( me.createFormField( 'INPUT', 'HIDDEN', 'sellerId', record.get( 'sellerId' ) ) );
				form.appendChild( me.createFormField( 'INPUT', 'HIDDEN', 'identifier', record
						.get( 'identifier' ) ) );
				form
					.appendChild( me.createFormField( 'INPUT', 'HIDDEN', 'version', 0 ) );
				form.appendChild( me.createFormField( 'INPUT', 'HIDDEN', 'recordKeyNo', record
					.get( 'recordKeyNo' ) ) );
				form.appendChild(me.createFormField('INPUT', 'HIDDEN', 
						'schEntityType', record.get('entityType')));
				form.appendChild(me.createFormField('INPUT', 'HIDDEN', 
						'schChannel', record.get('channelName')));
				form.appendChild(me.createFormField('INPUT', 'HIDDEN', 
						'intRecordKeyNmbr', record.get('intRecordKeyNmbr')));
			}
			else
				if( str == 'Generate' )
				{
					strUrl = "showGenerateReportParam.srvc";
					form.appendChild( me.createFormField( 'INPUT', 'HIDDEN', 'moduleCode', record.get( 'moduleCode' ) ) );
					form.appendChild( me.createFormField( 'INPUT', 'HIDDEN', 'srcType', record.get( 'srcType' ) ) );
					form.appendChild( me.createFormField( 'INPUT', 'HIDDEN', 'reportCode', record.get( 'reportCode' ) ) );
					form.appendChild( me.createFormField( 'INPUT', 'HIDDEN', 'reportFileName', record.get( 'reportName' ) ) );
					form.appendChild( me.createFormField( 'INPUT', 'HIDDEN', 'delInfo', record.get( 'delInfo' ) ) );
					form.appendChild( me.createFormField( 'INPUT', 'HIDDEN', 'delMedium', (record.get('medium') == 'EMAIL' ?'SMTP' : record.get('medium')) ) );
					form.appendChild( me.createFormField( 'INPUT', 'HIDDEN', 'securityProfileID', record.get( 'securityProfileId' ) ) );
					form.appendChild( me.createFormField( 'INPUT', 'HIDDEN', 'securityProfileName', record.get( 'securityProfile' ) ) );
					form.appendChild( me.createFormField( 'INPUT', 'HIDDEN', 'clientCode', record.get( 'entityCode' ) ) );
					form.appendChild( me.createFormField( 'INPUT', 'HIDDEN', 'entitlementSeller', record.get( 'sellerId' ) ) );
					form.appendChild( me.createFormField( 'INPUT', 'HIDDEN', 'srcSubType', record.get( 'reportType' ) ) );
					form.appendChild(me.createFormField('INPUT', 'HIDDEN', 
							'entityType', record.get('entityType')));
					form.appendChild(me.createFormField('INPUT', 'HIDDEN', 
							'channelName', record.get('channelName')));
					form.appendChild( me.createFormField( 'INPUT', 'HIDDEN', 'intRecordKeyNo', record.get( 'intRecordKeyNmbr' ) ) );		
							
				}
				else
					if( str == 'Download' )
					{
						strUrl = "downloadPreGeneratedReport.srvc";
						form.appendChild( me.createFormField( 'INPUT', 'HIDDEN', 'recordKeyNo', record
							.get( 'recordKeyNo' ) ) );
						form.appendChild( me.createFormField( 'INPUT', 'HIDDEN', 'schTempFileDir', record
							.get( 'schTempFileDir' ) ) );
						form.appendChild( me
							.createFormField( 'INPUT', 'HIDDEN', 'gaFileName', record.get( 'gaFileName' ) ) );
					}
					else
						if( str == 'View' )
						{
							strUrl = "viewScheduleReport.srvc";
							
							form.appendChild( me.createFormField( 'INPUT', 'HIDDEN', 'identifier', record
								.get( 'identifier' ) ) );
							form
								.appendChild( me.createFormField( 'INPUT', 'HIDDEN', 'version', record.get( 'version' ) ) );
							form.appendChild( me.createFormField( 'INPUT', 'HIDDEN', 'recordKeyNo', record
								.get( 'recordKeyNo' ) ) );
							form.appendChild(me.createFormField('INPUT', 'HIDDEN', 
									'schEntityType', record.get('entityType')));
							form.appendChild(me.createFormField('INPUT', 'HIDDEN', 
									'schChannel', record.get('channelName')));
							form.appendChild(me.createFormField('INPUT', 'HIDDEN', 
									'intRecordKeyNmbr', record.get('intRecordKeyNmbr')));

						}
						else
							if( str == 'Edit' )
							{
								strUrl = "editScheduleReport.srvc";
								form.appendChild( me.createFormField( 'INPUT', 'HIDDEN', 'identifier', record
									.get( 'identifier' ) ) );
								form.appendChild( me.createFormField( 'INPUT', 'HIDDEN', 'version', record
									.get( 'version' ) ) );
											form.appendChild( me.createFormField( 'INPUT', 'HIDDEN', 'recordKeyNo', record
									.get( 'recordKeyNo' ) ) );
								form.appendChild(me.createFormField('INPUT', 'HIDDEN', 
										'schEntityType', record.get('entityType')));
								form.appendChild(me.createFormField('INPUT', 'HIDDEN', 
										'schChannel', record.get('channelName')));
								form.appendChild(me.createFormField('INPUT', 'HIDDEN', 
										'intRecordKeyNmbr', record.get('intRecordKeyNmbr')));

							}

		form.appendChild( me.createFormField( 'INPUT', 'HIDDEN', csrfTokenName, csrfTokenValue ) );
		form.action = strUrl;
		//me.setFilterParameters(form);
		document.body.appendChild( form );
		form.submit();
		document.body.removeChild( form );
	},
	createFormField : function( element, type, name, value )
	{
		var inputField;
		inputField = document.createElement( element );
		inputField.type = type;
		inputField.name = name;
		inputField.value = value;
		return inputField;
	},
	 handleClearSettings:function(){
		var me=this;
		var filterView = me.getReportCenterFilterView();
		var reportDownloadId=filterView.down('combobox[itemId="repOrDwnldToolBar"]');
		var reportType=filterView.down('combobox[itemId="reportTypeToolBar"]');
		var clientComboBox = me.getReportCenterFilterView()
					.down('combo[itemId="clientCombo"]');
		clientComboBox.setValue('all');
		filterView.clientCode='all'
		me.clientFilterVal = 'all';
		filterView.reportType="";
		filterView.repOrDwnld="";
		reportDownloadId.suspendEvents();
		reportDownloadId.setValue("All");
		reportDownloadId.resumeEvents();
		reportType.suspendEvents();
		reportType.setValue("All");
		reportType.resumeEvents();
		me.filterData=[];
		var groupView = me.getGroupView();
		groupView.down('smartgrid').refreshData();
	},
	isPregeneratedRowIconVisible : function( store, record, jsonData, itmId, maskPosition )
	{
		return true;
	},
	isEmptyObject : function( obj )
	{
		for(var i in obj){ 
			if(obj.hasOwnProperty(i)){
				return false;
			}
		}
		return true;
	},
	disablePreferencesButton: function(btnId,boolVal){
		$("#"+btnId).attr("disabled",boolVal);
		if(boolVal)
			{
				$("#"+btnId).css("color",'grey');			
				$("#"+btnId).css('cursor','default').removeAttr('href');
				$("#"+btnId).css('pointer-events','none');
			}
		else
			{
				$("#"+btnId).css("color",'#FFF');
				$("#"+btnId).css('cursor','pointer').attr('href','#');
				$("#"+btnId).css('pointer-events','all');				
			}
	},
	showPageSettingPopup : function(strInvokedFrom) {
		var me = this, objData = {}, objGroupView = me.getGroupView(), objPrefData, objGeneralSetting, objGridSetting, objColumnSetting;
		var objGroupByVal = '', objDefaultFilterVal = '', objGridSizeVal = '', objRowPerPageVal = _GridSizeTxn;

		me.pageSettingPopup = null;

		if (!Ext.isEmpty(objReportCenterPref)) {
			objPrefData = Ext.decode(objReportCenterPref);
			objGeneralSetting = objPrefData && objPrefData.d.preferences
					&& objPrefData.d.preferences.GeneralSetting
					? objPrefData.d.preferences.GeneralSetting
					: null;
			objGridSetting = objPrefData && objPrefData.d.preferences
					&& objPrefData.d.preferences.GridSetting
					? objPrefData.d.preferences.GridSetting
					: null;
			/**
			 * This default column setting can be taken from
			 * preferences/gridsets/uder defined( js file)
			 */
			objColumnSetting = objPrefData && objPrefData.d.preferences
					&& objPrefData.d.preferences.ColumnSetting
					&& objPrefData.d.preferences.ColumnSetting.gridCols
					? objPrefData.d.preferences.ColumnSetting.gridCols
					: (REPORT_GENERIC_COLUMN_MODEL || '[]');

			if (!Ext.isEmpty(objGeneralSetting)) {
				objGroupByVal = objGeneralSetting.defaultGroupByCode;
				objDefaultFilterVal = objGeneralSetting.defaultFilterCode;
			}
			if (!Ext.isEmpty(objGridSetting)) {
				objGridSizeVal = objGridSetting.defaultGridSize;
				objRowPerPageVal = objGridSetting.defaultRowPerPage;
			}
		}

		objData["groupByData"] = objGroupView
				? objGroupView.cfgGroupByData
				: [];
		objData["filterUrl"] = 'services/userfilterslist/'+me.strPageName;
		objData["rowPerPage"] = _AvailableGridSize;
		objData["groupByVal"] = objGroupByVal;
		objData["filterVal"] = objDefaultFilterVal;
		objData["gridSizeVal"] = objGridSizeVal;
		objData["rowPerPageVal"] = objRowPerPageVal;

		me.pageSettingPopup = Ext.create('Ext.ux.gcp.PageSettingPopUp', {
					cfgPopUpData : objData,
					cfgGroupView : objGroupView,
					cfgDefaultColumnModel : objColumnSetting,
					cfgViewOnly : _IsEmulationMode
				});
		me.pageSettingPopup.show();
		me.pageSettingPopup.center();
	},
	savePageSetting : function(arrPref, strInvokedFrom) { 
		/* This will be get invoked from page level setting always */
		var me = this, args = {};
		if (!Ext.isEmpty(arrPref)) {
			me.preferenceHandler.savePagePreferences(me.strPageName, arrPref,
					me.postHandleSavePageSetting, args, me, false);
		}
	},
	postHandleSavePageSetting : function(data, args, isSuccess) {
		if (isSuccess === 'N')  {
			Ext.MessageBox.show({
				title : getLabel('instrumentErrorPopUpTitle', 'Error'),
				msg : getLabel('errorMsg', 'Error while apply/restore setting'),
				buttons : Ext.MessageBox.OK,
				buttonText: {
		            ok: getLabel('btnOk', 'OK')
					},
				cls : 't7-popup',
				icon : Ext.MessageBox.ERROR
			});
		}
	},
	applyPageSetting : function(arrPref, strInvokedFrom) {
		var me = this, args = {};
		if (!Ext.isEmpty(arrPref)) {
			if (strInvokedFrom === 'GRID'
					&& _charCaptureGridColumnSettingAt === 'L') {
				/**
				 * This handling is required for non-us market
				 */
				var groupView = me.getGroupView(), subGroupInfo = groupView
						.getSubGroupInfo()
						|| {}, objPref = {}, groupInfo = groupView
						.getGroupInfo()
						|| '{}', strModule = subGroupInfo.groupCode;
				Ext.each(arrPref || [], function(pref) {
							if (pref.module === 'ColumnSetting') {
								objPref = pref.jsonPreferences;
							}
						});
				args['strInvokedFrom'] = strInvokedFrom;
				args['objPref'] = objPref;
				strModule = strModule === 'all' ? groupInfo.groupTypeCode + '-'
						+ strModule : strModule;
				me.preferenceHandler.saveModulePreferences(me.strPageName,
						strModule, objPref, me.postHandlePageGridSetting, args,
						me, false);
			} else {
				me.handleClearLocalPrefernces();
				me.preferenceHandler.savePagePreferences(me.strPageName,
						arrPref, me.postHandlePageGridSetting, args, me, false);
			}
		}
	},
	restorePageSetting : function(arrPref, strInvokedFrom) {
		var me = this;
		if (strInvokedFrom === 'GRID'
				&& _charCaptureGridColumnSettingAt === 'L') {
			var groupView = me.getGroupView(), subGroupInfo = groupView
					.getSubGroupInfo()
					|| {}, objPref = {}, groupInfo = groupView.getGroupInfo()
					|| '{}', strModule = subGroupInfo.groupCode, args = {};
			strModule = strModule === 'all' ? groupInfo.groupTypeCode + '-'
					+ strModule : strModule;
			args['strInvokedFrom'] = strInvokedFrom;
			Ext.each(arrPref || [], function(pref) {
						if (pref.module === 'ColumnSetting') {
							pref.module = strModule;
							return false;
						}
					});
			me.preferenceHandler.clearPagePreferences(me.strPageName, arrPref,
					me.postHandleRestorePageSetting, args, me, false);
		} else
		{
			me.handleClearLocalPrefernces();
			me.preferenceHandler.clearPagePreferences(me.strPageName, arrPref,
					me.postHandleRestorePageSetting, null, me, false);
		}
	},
	postHandlePageGridSetting : function(data, args, isSuccess) {
		if (isSuccess === 'Y') {
			var me = this;
			if (args && args.strInvokedFrom === 'GRID'
					&& _charCaptureGridColumnSettingAt === 'L') {
				var objGroupView = me.getGroupView(), gridModel = null;
				if (args.objPref && args.objPref.gridCols)
					gridModel = {
						columnModel : args.objPref.gridCols
					}
				// TODO : Preferences and existing column model need to be
				// merged
				objGroupView.reconfigureGrid(gridModel);
			} else
				window.location.reload();
		} else {
			Ext.MessageBox.show({
				title : getLabel('instrumentErrorPopUpTitle', 'Error'),
				msg : getLabel('errorMsg', 'Error while apply/restore setting'),
				buttons : Ext.MessageBox.OK,
				buttonText: {
		            ok: getLabel('btnOk', 'OK')
					},
				cls : 't7-popup',
				icon : Ext.MessageBox.ERROR
			});
		}
	},
	postHandleRestorePageSetting : function(data, args, isSuccess) {
		if (isSuccess === 'Y') {
			var me = this;
			if (args && args.strInvokedFrom === 'GRID'
					&& _charCaptureGridColumnSettingAt === 'L') {
				var objGroupView = me.getGroupView();
				if (objGroupView)
					objGroupView.reconfigureGrid(null);
			} else
				window.location.reload();
		} else {
			Ext.MessageBox.show({
				title : getLabel('instrumentErrorPopUpTitle', 'Error'),
				msg : getLabel('errorMsg', 'Error while apply/restore setting'),
				buttons : Ext.MessageBox.OK,
				buttonText: {
		            ok: getLabel('btnOk', 'OK')
					},
				cls : 't7-popup',
				icon : Ext.MessageBox.ERROR
			});
		}
	},
	doHandleRowActions : function(actionName, objGrid, record) {
		var me = this;
		var groupView = me.getGroupView();
		var grid = groupView.getGrid();
		if(actionName == 'btnGenerate'){
			me.generateOndemand(record);
		}else if(actionName == 'btnAddSchedule'){
			me.addNewScheduleReport(record);
		}else if(actionName == 'btnSecurity'){
			me.selectSecurityProfile(record);
		}
		
	},
	handleAppliedFilterDelete : function(btn){
		var me = this;
		var objData = btn.data;
		var advJsonData = me.advFilterData;
		var quickJsonData = me.filterData;
		if(!Ext.isEmpty(objData)){
			var paramName = objData.paramName || objData.field;
			//adv
			var reqJsonInQuick = me.findInQuickFilterData(quickJsonData,paramName);
			if (!Ext.isEmpty(reqJsonInQuick)) {
				arrQuickJson = quickJsonData;
				arrQuickJson = me.removeFromQuickArrJson(arrQuickJson,paramName);
				me.filterData = arrQuickJson;
				
			}
			me.resetFieldInQuickFilterOnDelete(objData); //In this Method will delete all the Filters which are applied
			me.getSmartgrid().refreshData()
		}
	},
	resetFieldInQuickFilterOnDelete : function(objData){
		var me = this,strFieldName;
		var filterView = me.getReportCenterFilterView();
		if(!Ext.isEmpty(objData))
			strFieldName = objData.paramName || objData.field;
		
		if(strFieldName === 'reportCenterClient'){
			me.clientFilterVal='all';
			var clientComboBox = me.getReportCenterFilterView()
						.down('combo[itemId="clientCombo"]');
			clientComboBox.setValue('all');
			me.clientFilterVal = 'all';
		}
		else if(strFieldName === 'repOrDwnld'){
			filterView.repOrDwnld="all";
			var reportDownloadId=filterView.down('combobox[itemId="repOrDwnldToolBar"]');
			reportDownloadId.suspendEvents();
			reportDownloadId.setValue("All");
			reportDownloadId.resumeEvents();
		}
		else if(strFieldName === 'reportType') {
			filterView.reportType="all";
			var reportType=filterView.down('combobox[itemId="reportTypeToolBar"]');
			reportType.suspendEvents();
			reportType.setValue("All");
			reportType.resumeEvents();
		}
		
	},
	removeFromQuickArrJson : function(arr, key) {
		for (var ai, i = arr.length; i--;) {
			if ((ai = arr[i]) && ai.paramName == key) {
				arr.splice(i, 1);
			}
		}
		return arr;
	},
	removeFromAdvanceArrJson : function(arr,key){
		for (var ai, i = arr.length; i--;) {
			if ((ai = arr[i]) && ai.field == key) {
				arr.splice(i, 1);
			}
		}
		return arr;
	},
	findInAdvFilterData : function(arr, key) {
		var reqJson = null;
		for (var ai, i = arr.length; i--;) {
			if ((ai = arr[i]) && ai.field == key) {
				reqJson = ai;
			}
		}
		return reqJson;
	},
	findInQuickFilterData : function(arr, key) {
		var reqJson = null;
		for (var ai, i = arr.length; i--;) {
			if ((ai = arr[i]) && ai.paramName == key) {
				reqJson = ai;
			}
		}
		return reqJson;
	},
	setDataForFilter : function(filterData)
	{
		var me = this;
		var arrQuickJson = {};
		me.advFilterData = {};
		me.filterData = {};
		//me.filterData = me.getQuickFilterQueryJson();
		me.filterData = me.getReportCenterFilterView().getQuickFilterJSON();
		/*
		var objJson = (!Ext.isEmpty(filterData) ? filterData.filterBy : getAdvancedFilterQueryJson());
		var reqJson = me.findInAdvFilterData(objJson, "Client");
		if (!Ext.isEmpty(reqJson)) {
			arrQuickJson = me.filterData;
			arrQuickJson = me
					.removeFromQuickArrJson(arrQuickJson, "Client");
			me.filterData = arrQuickJson;
		}
		reqJson = me.findInAdvFilterData(objJson, "repOrDwnld");
		if (!Ext.isEmpty(reqJson)) {
			arrQuickJson = me.filterData;
			arrQuickJson = me.removeFromQuickArrJson(arrQuickJson,
					"repOrDwnld");
			me.filterData = arrQuickJson;
		}
		reqJson = me.findInAdvFilterData(objJson, "reportType");
		if (!Ext.isEmpty(reqJson)) {
			arrQuickJson = me.filterData;
			arrQuickJson = me.removeFromQuickArrJson(arrQuickJson, "reportType");
			me.filterData = arrQuickJson;
		}
		me.advFilterData = objJson;

		var sortByData = getAdvancedFilterSortByJson();
		if (!Ext.isEmpty(sortByData) && sortByData.length > 0) {
			me.advSortByData = sortByData;
		} else {
			me.advSortByData = [];
		}

		var filterCode = $("input[type='text'][id='savedFilterAs']").val();
		if(!Ext.isEmpty(filterCode))
			me.advFilterCodeApplied = filterCode;
		*/
	}
});