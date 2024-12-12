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
	requires : [],
	views : ['GCP.view.ReportCenterView','GCP.view.SecurityProfilePopup',
				'Ext.ux.gcp.PreferencesHandler'],
	refs : [{
				ref : 'reportCenterView',
				selector : 'reportCenterView'
			},{
				ref:'filterView',
				selector:'filterView'	
			},{
				ref:"filterButton",
				selector : "groupView button[itemId=filterButton]"	
			},{
				ref : 'reportCenterFilterView',
				selector : 'reportCenterFilterView[itemId="reportCenterFilterId"]'
			},{
				ref : 'clientAutoCompleter',
				selector : 'reportCenterView reportCenterFilterView AutoCompleter[itemId="reportCenterClientId"]'
			},{
				ref : 'sellerCombo',
				selector : 'reportCenterView reportCenterFilterView combobox[itemId="reportCenterSellerId"]'
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
				ref : 'btnClearPreferences',
				selector : 'reportCenterView reportCenterFilterView button[itemId="btnClearPreferences"]'
			},{
				ref : 'btnSavePreferences',
				selector : 'reportCenterView reportCenterFilterView button[itemId="btnSavePreferences"]'
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
		strGetModulePrefUrl : 'services/userpreferences/reportCenterNewUX/{0}.json'
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
		me.updateConfigs();
		me.getFavoriteReports();			
		me.doApplySavedPreferences();
		$(document).on("handleAddNewReport",function(){
			me.submitRequest('addReport');
		});
		$(document).on('savePreference', function(event) {
				//	me.toggleSavePrefrenceAction(false);
					me.disablePreferencesButton("clearPrefMenuBtn",false);
					me.handleSavePreferences();
				});
		$(document).on('clearPreference', function(event) {
				me.disablePreferencesButton("savePrefMenuBtn",true);
				me.handleClearPreferences();
		});
		me.control({
			'reportCenterView' : {				
				'deleteFavoriteRep' : me.deleteFavoriteRep,
				'addFavoriteRep' : me.addFavoriteRep
			},
			'reportCenterView groupView' : {				
				'groupTabChange' : function(groupInfo, subGroupInfo, tabPanel,
						newCard, oldCard) {	
					//me.setDataForQuickFilter(me.filterJson);		
					me.disablePreferencesButton("savePrefMenuBtn",false);
					me.disablePreferencesButton("clearPrefMenuBtn",false);		
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
					//me.toggleSavePrefrenceAction(true);
					me.disablePreferencesButton("savePrefMenuBtn",false);
				},
				'render' : function(){
					if (objGridViewFilterPref) {
							var objJsonData = Ext.decode(objGridViewFilterPref);
							objGroupByPref = objJsonData;
							if (!Ext.isEmpty(objGroupByPref)) {
								//me.toggleSavePrefrenceAction(false);
								//me.toggleClearPrefrenceAction(true);
								me.disablePreferencesButton("savePrefMenuBtn",true);
								me.disablePreferencesButton("clearPrefMenuBtn",false);
							}
						}
					}
			},
			'reportCenterView groupView smartgrid' : {
				'cellclick' : me.doHandleCellClick
			},
			'securityProfilePopup' : {
				'attachSecurityProfileToReport' : me.attachSecurityProfileToReport
			},			
			'reportCenterView reportCenterFilterView button[itemId="btnSavePreferences"]' : {
				click : function(btn, opts) {
					me.toggleSavePrefrenceAction(false);
					me.handleSavePreferences();
				}
			},
			'reportCenterView reportCenterFilterView button[itemId="btnClearPreferences"]' : {
				click : function(btn, opts) {
					me.toggleClearPrefrenceAction(false);
					me.handleClearPreferences();
				}
			},
			'reportCenterView reportCenterTitleView button[itemId="btnCreateReport"]' : {
				click : function(btn, opts) {
					me.submitRequest('addReport');
					}
			},
			'reportCenterFilterView':{
				beforerender:function(){
					var useSettingsButton = me.getFilterView()
					.down('button[itemId="useSettingsbutton"]');
					if (!Ext.isEmpty(useSettingsButton)) {
						useSettingsButton.hide();
					}
					var createAdvanceFilterLabel = me.getFilterView()
							.down('label[itemId="createAdvanceFilterLabel"]');
					if (!Ext.isEmpty(createAdvanceFilterLabel)) {
						createAdvanceFilterLabel.hide();
					}
				},
				'afterrender' : function() {
					me.setInfoTooltip();
					//me.setDataForQuickFilter();
					me.setSelectedFilters();
				},				
				'quickFilterChange' : function(filterJson) {
					me.setDataForQuickFilter(filterJson);
				//	me.toggleSavePrefrenceAction(true);
					me.disablePreferencesButton("savePrefMenuBtn",false);
					if (me.getReportCenterView())
						me.getReportCenterView().setLoading(true);
					me.applyQuickFilter();
				}
			},
			'filterView button[itemId="clearSettingsButton"]' : {
				'click' : function() {
					me.handleClearSettings();
				}
			}
		});
	},
	//Preference handling functions starts
	
	handleClearPreferences : function() {
		var me = this;
	//	me.toggleSavePrefrenceAction(false);
		me.disablePreferencesButton("savePrefMenuBtn",true);
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
			me.disablePreferencesButton("savePrefMenuBtn",true);
		}
	},
	getPreferencesToSave : function(localSave) {
		var me = this;
		var groupView = me.getGroupView();
		var grid = null;
		var arrCols = null, objCol = null, arrColPref = null, arrPref = [], objFilterPref = null,data={},clientVal,financialInstitutionVal,clientDesc,reportType;
		var groupInfo = null, subGroupInfo = null, strModule = null, filter = me.getReportCenterFilterView();
		var state = null;
		if (groupView) {
			state = groupView.getGroupViewState();
			groupInfo = groupView.getGroupInfo() || '{}';
			subGroupInfo = groupView.getSubGroupInfo() || {};
			if(!Ext.isEmpty(filter)){
				 data = filter.getQuickFilterJSON();
				 financialInstitutionVal = (data['sellerCode'] || "");
				 clientVal = (data['clientCode'] || "");
				 clientDesc = (data['clientDesc'] || "");
				 reportType = (filter.reportType !='All' ? filter.reportType : ""); // FAVORITE Filter not stored in data['reportType']
			}else{
				clientVal=strClient;
				clientDesc=strClientDesc;
				financialInstitutionVal=strSeller;
				reportType=null;
			}
			var repOrDwnld = (data['repOrDwnld'] || "");
			var statusCode = (data['statusCode'] || "");
			var repOrDwnldDesc = (data['repOrDwnldDesc'] || "");
			var statusFilterDesc = (data['statusCodeDesc'] || "");
			var reportTypeDesc = (data['reportTypeDesc'] || "");
			strModule = state.groupCode
			arrPref.push({
						"module" : "groupByPref",
						"jsonPreferences" : {
							groupCode : state.groupCode,
							subGroupCode : state.subGroupCode
						}
					});
			arrPref.push({
						"module" : subGroupInfo.groupCode,
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
							'clientDesc' : clientDesc,
							'repOrDwnld' : repOrDwnld,
							'statusCode' : statusCode,
							'reportType' : reportType,
							'repOrDwnldDesc' : repOrDwnldDesc,
							'statusFilterDesc' : statusFilterDesc,
							'reportTypeDesc' : reportTypeDesc
						}
					});
		}
		return arrPref;
	},
	postHandleClearPreferences : function(data, args, isSuccess) {
		var me = this;
	//	me.toggleSavePrefrenceAction(false);
		me.disablePreferencesButton("savePrefMenuBtn",true);
		if (isSuccess === 'N') {
		} else {
		//	me.toggleClearPrefrenceAction(false);
		//	me.toggleSavePrefrenceAction(true);
			me.disablePreferencesButton("savePrefMenuBtn",false);
			me.disablePreferencesButton("clearPrefMenuBtn",true);
		}
	},
	postHandleSavePreferences : function(data, args, isSuccess) {
		var me = this;
		if (isSuccess === 'N') {
			if (!Ext.isEmpty(me.getBtnSavePreferences())){
			//	me.toggleSavePrefrenceAction(true);
				me.disablePreferencesButton("savePrefMenuBtn",false);
				}
		} else {
		//	me.toggleClearPrefrenceAction(true);
			me.disablePreferencesButton("clearPrefMenuBtn",false);
		}
	},
	toggleSavePrefrenceAction : function(isVisible) {
		var me = this;
		var btnPref = me.getBtnSavePreferences();
		if (!Ext.isEmpty(btnPref))
			btnPref.setDisabled(!isVisible);
	},
	toggleClearPrefrenceAction : function(isVisible) {
		var me = this;
		var btnPref = me.getBtnClearPreferences();
		if (!Ext.isEmpty(btnPref))
			btnPref.setDisabled(!isVisible);
	},
	//End of prefrence handling
	
	doSavePreferenceToLocale : function() {
		var me = this, filterView = me.getReportCenterFilterView(); data = {};
		if(Ext.isEmpty(filterView)){
			data['clientCode'] = strClient;
			data['clientDesc'] = strClientDesc;
			data['statusCode'] = null;
			data['statusCodeDesc'] = null;
			data['repOrDwnld'] = null;
			data['repOrDwnldDesc'] = null;
			data['reportType'] = null;
			data['reportTypeDesc'] = null;
		}else{
			data = filterView.getQuickFilterJSON();
		}
		me.preferenceHandler.setLocalPreferences(me.strPageName, data);
	},
	doApplySavedPreferences : function() {
		var me = this, filter = me.getReportCenterFilterView();
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
	setSelectedFilters : function() {
		var me = this, filter = me.getReportCenterFilterView();
		var objPref = null;
		objPref = me.filterDataPref;
		if(objPref.reportType){
		 var reportTypeCombo=filter.down('combobox[itemId="reportTypeToolBar"]');	
			reportTypeCombo.setValue(objPref.reportType);
			filter.reportType = objPref.reportType;
			filter.reportTypeDesc = objPref.reportTypeDesc;
		}
		if(objPref.statusCode){
		//	var btn = filter.down('combo[code='+objPref.statusCode+']');	
			var reportStatusCombo=filter.down('combobox[itemId="reportStatusToolBar"]');
			reportStatusCombo.setValue(objPref.statusCode);
			filter.statusCode = objPref.statusCode;
			filter.statusCodeDesc = objPref.statusFilterDesc;
		}
		if(objPref.repOrDwnld){
			var reportDownloadId=filter.down('combobox[itemId="repOrDwnldToolBar"]');
			reportDownloadId.setValue(objPref.repOrDwnld);
			filter.repOrDwnld =objPref.repOrDwnld;
			filter.repOrDwnldDesc = objPref.repOrDwnldDesc;
		}
		if(objPref.clientCode){
			var clientMenu = filter.down('menu[itemId="clientMenu"]');
			var clientBtn = filter.down('button[itemId="clientBtn"]');
			filter.clientCode = objPref.clientCode;
			filter.clientDesc = objPref.clientDesc;
			
		}
		me.setDataForQuickFilter(objPref);
	},
	setButtonCls : function(btn, itemId) {
		var me = this, filter = me.getReportCenterFilterView();
		filter.down('combo[itemId='+ itemId +']').items.each(function(
						item) {
					item.removeCls('xn-custom-heighlight');
				});
		btn.addCls('xn-custom-heighlight');
	},
	attachSecurityProfileToReport : function(){
		var me = this;
		var objSecurityProfilePopup = me.getSecurityProfilePopup();
		var strData = objSecurityProfilePopup.getJsonofSecurityProfile();	
		Ext.Ajax.request(
		{
			url : "attachSecurityProfileToReport.srvc?"+ csrfTokenName + "=" + csrfTokenValue,
			method : 'POST',
			jsonData : Ext.encode(strData),		
			success : function( response )
			{
				objSecurityProfilePopup.close();
				me.getSmartgrid().refreshData();
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

		wdgt.setLoading( true );

		Ext.Ajax.request(
		{
			url : 'userpreferences/reportCenterNewUX/preferredReports.srvc',
			method : 'POST',
			jsonData : newReportset,
			success : function( response )
			{
				wdgt.setLoading( false );
			},
			failure : function()
			{
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

		wdgt.setLoading( true );
		Ext.Ajax.request(
		{
			url : 'userpreferences/reportCenterNewUX/preferredReports.srvc',
			method : 'POST',
			jsonData : newReportset,
			success : function( response )
			{
				wdgt.setLoading( false );
			},
			failure : function()
			{
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
			url : 'userpreferences/reportCenterNewUX/preferredReports.srvc' ,
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
			for( i = 0 ; i < jsonData.reports.length ; i++ )
			{
				accFavArrInt.push( accSetArray[ i ] );
			}
			me.favReport = accFavArrInt;
		}
	},
	
	applyQuickFilter : function() {
		var me = this;
		var groupView = me.getGroupView();
		groupView.down('smartgrid').refreshData();
	},
	doHandleCellClick : function( view, td, cellIndex, record, tr, rowIndex, e, eOpts ) {
		var me = this;
		var linkClicked = ( e.target.tagName == 'SPAN' );
			var generateClicked = ( e.target.tagName == 'A' && cellIndex == 2);
			var imgClicked = ( e.target.tagName == 'A' && cellIndex==3 );
			var clickedId = e.target.id ; 
			if( clickedId == 'seeSchedule'  && cellIndex == 2)
			{
				me.addNewScheduleReport(record);
			}
			else if( clickedId == 'addSchedule'  && cellIndex == 2)
			{
				me.addNewScheduleReport(record);
			}
			else if( clickedId == 'editProfile'  && cellIndex == 3)
			{
				me.selectSecurityProfile(record, view);
			}
			else if( clickedId == 'selectProfile'  && cellIndex == 3)
			{
				me.selectSecurityProfile(record, view);
			}
			else if( clickedId == 'seePregenerated'  && ( cellIndex == 4 || cellIndex == 2 ) )
			{
				 me.preGeneratedReport(record, view);
			}
			else if( imgClicked)
			{
				me.editReport(record);
			}
			else if( generateClicked )
			{  
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
		var me = this;
		var clientCode = record.raw.entityCode;
		var sellerCode = record.raw.sellerId;
		var strUrl = 'getSecurityProfile.srvc?';
		var selectedProfileId = record.raw.securityProfileId;
		var reportCode = record.raw.reportCode;
		var reportName = record.raw.reportName;
		var storeData = me.handleSecurityProfileLoading( record,viewSmartGrid );
		var objSecurityProfilePopup = Ext.create('GCP.view.SecurityProfilePopup',{
			clientCode : clientCode,
			sellerCode : sellerCode,
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
	},	
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
				cls:'t7-grid',
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
					var clientVal = data.clientVal;
					var clientDesc = data.clientDesc;
					var reportOrDownload = data.repOrDwnld;
					var status = data.statusCode;
					var seller = data.financialInstitutionVal;
					var reportType = data.reportType;
					var objPref = {};
					objPref['sellerCode'] = seller;
					objPref['clientCode'] = clientVal;
					objPref['clientDesc'] = clientDesc;
					objPref['repOrDwnld'] = reportOrDownload;
					objPref['reportType'] = reportType;
					objPref['statusCode'] = status;
					me.setDataForQuickFilter(objPref);
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
		url = url + me.widgetType + '.srvc';
		objGroupView.handleGroupActionsVisibility(buttonMask);
		var strUrl = grid.generateUrl(url, pgSize, newPgNo, oldPgNo, sorter);
		strUrl += me.generateFilterUrl(groupInfo, subGroupInfo);
		strUrl = strUrl + "&" + csrfTokenName + "=" + csrfTokenValue;
		grid.loadGridData(strUrl, null, null, false);
		grid.on('itemdblclick', function(dataView, record, item, rowIndex,
				eventObj) {
			me.handleGridRowDoubleClick(record, grid);
		});
	},
	handleGridRowDoubleClick : function(record, grid) {
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
				if (!Ext.isEmpty(grid) && !Ext.isEmpty(grid.isRowIconVisible)) {
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
			me.doHandleRowDoubleClickActions(arrVisibleActions[0].itemId, grid, record);
		}
	},
	doHandleRowDoubleClickActions:function(actionName,grid,record){
		var me=this;
		if(actionName=="btnEdit"){
				me.editReport(record);	
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
		if(!Ext.isEmpty(filterView)){
			if(filterView.reportType == 'FAVORITE'){
				strUrl += '&$isFavouriteFilter=Y';
			}
			if(!Ext.isEmpty(filterView.clientCode) && filterView.clientCode != 'all'){
				strUrl += '&$isClientFilterSelected=Y';
			}
			if(strDownloadFilter == 'D'){
				strUrl += '&$isDownloadFilter=D';
			}
		}else{
		//TODO empty condition
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
	generateWidgetUrl : function(groupInfo, subGroupInfo) {
		if(subGroupInfo.groupCode != 'all'){
			var strWidgetFilter = 'reportModule' + ' eq ' + '\'' + subGroupInfo.groupCode + '\'';
		}else{
			var strWidgetFilter = '';'reportModule' + ' eq ' + '\'' + '%' + '\'';
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
		var objSummaryView = me.getReportCenterView(), objPref = null, gridModel = null, intPgSize = null;
		var colModel = null, arrCols = null;
		if (data && data.preference) {
			//me.toggleClearPrefrenceAction(true);
			me.disablePreferencesButton("clearPrefMenuBtn",false);
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
		var me = this, filter = me.getReportCenterFilterView(), arrFilter = [];;
		var data = null;
		var me = this, filter = me.getReportCenterFilterView(), arrFilter = [];;
		if(!me.isEmptyObject(filterJson)){
			data = filterJson;
		}
		else{
			if(!Ext.isEmpty(filter))
				data = filter.getQuickFilterJSON();
		}
		if (data) {
			if (data['sellerCode'])
				arrFilter.push({
							paramName : 'seller',
							paramValue1 : (data['sellerCode'] || '')
									.toUpperCase(),
							operatorValue : 'eq',
							dataType : 'S'
						});
			if (data['clientCode'])
				arrFilter.push({
							paramName : 'client',
							paramValue1 : (data['clientCode'] || ''),
							operatorValue : 'eq',
							dataType : 'S'
						});
			if (data['repOrDwnld'])
			{
				arrFilter.push({
							paramName : 'repOrDwnld',
							paramValue1 : (data['repOrDwnld'] || ''),
							operatorValue : 'eq',
							dataType : 'S'
						});
				strDownloadFilter = data['repOrDwnld'];
			}
			if (data['reportType'] && data['reportType'] != 'FAVORITE')
				arrFilter.push({
							paramName : 'reportType',
							paramValue1 : (data['reportType'] || ''),
							operatorValue : 'eq',
							dataType : 'S'
						});
						
			if (data['statusCode'])
				arrFilter.push({
							paramName : 'reportStatus',
							paramValue1 : (data['statusCode'] || ''),
							operatorValue : 'eq',
							dataType : 'S'
						});
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
								+ getLabel('client', 'Client')
								+ ' : '
								+ clientVal
								+ '<br/>'
								+ getLabel( 'repOrDwnld', 'Report or Upload' )
								+ ' : '
								+ repOrDwnldDesc
								+ '<br/>'
								+ getLabel( 'repOrDwnldType', 'Report Type' )
								+ ' : '
								+ reportTypeDesc
								+ '<br/>'
								+ getLabel('status', 'Status')
								+ ' : '
								+ statusFilter);
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
			if(!Ext.isEmpty(reportCenterFilterView)){
				form.appendChild(me.createFormField('INPUT', 'HIDDEN',	'clientCode', reportCenterFilterView.clientCode));
			}else{
				form.appendChild(me.createFormField('INPUT', 'HIDDEN',	'clientCode', strClient));
			}
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
	handleClearSettings:function(){
		 var me=this;
		 var filterView=me.getReportCenterFilterView();
		 if(!isClientUser){
				clientFilterId=filterView.down('combobox[itemId="reportCenterClientId"]');
				clientFilterId.suspendEvents();
				clientFilterId.reset();
				clientFilterId.resumeEvents();
			}else{
				clientFilterId=filterView.down('combo[itemId="clientCombo"]');
				clientFilterId.setRawValue(strClient);	
		 }
		 var reportDownloadId=filterView.down('combobox[itemId="repOrDwnldToolBar"]');
		 var reportType=filterView.down('combobox[itemId="reportTypeToolBar"]');
		 var reportStatus=filterView.down('combobox[itemId="reportStatusToolBar"]');
		 filterView.reportType="";
		 reportDownloadId.suspendEvents();
		 reportDownloadId.setValue("");
		 reportDownloadId.resumeEvents();
		 reportType.suspendEvents();
		 reportType.setValue("");
		 reportType.resumeEvents();
		 reportStatus.suspendEvents();
		 reportStatus.setValue("");
		 reportStatus.resumeEvents();
		 me.filterData=[];
		 var groupView = me.getGroupView();
		groupView.down('smartgrid').refreshData();
	},
	disablePreferencesButton: function(btnId,boolVal){
		$("#"+btnId).attr("disabled",boolVal);
		if(boolVal)
			$("#"+btnId).css("color",'grey');
		else
			$("#"+btnId).css("color",'#FFF');
	}
});