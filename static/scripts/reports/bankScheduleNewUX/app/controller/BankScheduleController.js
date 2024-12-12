/**
 * @class GCP.controller.BankScheduleController
 * @extends Ext.app.Controller
 * @author Anil Pahane
 */

/**
 * This controller is prime controller in Bank Schedule which handles all
 * measure events fired from GroupView. This controller has important
 * functionality like on any change on grid status or quick filter change, it
 * forms required URL and gets data which is then shown on Summary Grid.
 */

Ext.define('GCP.controller.BankScheduleController', {
	extend : 'Ext.app.Controller',
	requires : [],
	views : ['GCP.view.BankScheduleGridInformationView','GCP.view.BankScheduleFilterView','GCP.view.SecurityProfilePopup'],
	refs : [{
				ref : 'bankScheduleView',
				selector : 'bankScheduleView'
			},{
				ref : 'bankScheduleFilterView',
				selector : 'bankScheduleView bankScheduleFilterView'
			},{
				ref : 'sellerCombo',
				selector : 'bankScheduleView bankScheduleFilterView combobox[itemId="reportCenterSellerId"]'
			},{
				ref : 'groupView',
				selector : 'bankScheduleView groupView'
			},{
				ref : 'bankSchedulePreGenPopupDtl',
				selector : 'bankSchedulePreGenPopup panel[itemId="preGeneratedId"]'
			},{
				ref : 'mostViewedReportItemId',
				selector : 'bankScheduleGridInformationView label[itemId="mostViewedReportItemId"]'
			},{
				ref : 'leastViewedReportItemId',
				selector : 'bankScheduleGridInformationView label[itemId="leastViewedReportItemId"]'
			},{
				ref : 'btnClearPreferences',
				selector : 'bankScheduleView bankScheduleFilterView button[itemId="btnClearPreferences"]'
			},{
				ref : 'btnSavePreferences',
				selector : 'bankScheduleView bankScheduleFilterView button[itemId="btnSavePreferences"]'
			},{
				ref : 'clientFilterPanel',
				selector : 'bankScheduleView bankScheduleFilterView container[itemId="clientFilterPanel"]'
			},{
				ref : 'clientAutoCompleter',
				selector : 'bankScheduleView bankScheduleFilterView AutoCompleter[itemId="reportCenterClientId"]'
			},{
				ref : 'securityProfilePopup',
				selector : 'securityProfilePopup'
			}
			
		],
	config : {
		widgetType : '01',
		reportModule : '01',
		preferenceHandler : null,
		strDefaultMask : '0000',
		filterData : [],
		favReport : [],
		strPageName : 'bankScheduleNewUX',
		filterDataPref : {},
		entityType : 'BANK',
		initialSmartGridRender : true,
        firstLoad : false,
		cfgSellerGroupByUrl : 'services/grouptype/bankScheduleNewUX/groupBy.srvc?'+csrfTokenName+'='+tokenValue+'&$filter=seller eq '+'\''+'{0}' + '\' and seller eq '+'\''+'{1}' + '\'&$filterscreen=BANKSCHEDULE',
		cfgSellerClientGroupByUrl : 'services/grouptype/bankScheduleNewUX/groupBy.srvc?'+csrfTokenName+'='+tokenValue+'&$filter=seller eq '+'\''+'{0}' + '\' and client eq '+'\''+'{1}'
		+ ' and client lk ' + '\'' + '{2}'
		+ '\' and seller eq '+'\''+'{3}' +'\'&$filterscreen=BANKSCHEDULECLIENT'
		},
	/**
	 * A template method that is called when your application boots. It is
	 * called before the Application's launch function is executed so gives a
	 * hook point to run any code before your Viewport is created.
	 */
	init : function() {
		var me = this;
        var data = [];
        me.firstLoad = true;
		me.favReport  = reportList;
		me.updateConfigs();
        if(!Ext.isEmpty(objSaveLocalStoragePref))
        {
            me.objLocalData = Ext.decode(objSaveLocalStoragePref);

            objQuickPref = me.objLocalData && me.objLocalData.d.preferences
                                && me.objLocalData.d.preferences.tempPref 
                                && me.objLocalData.d.preferences.tempPref.quickFilterJson ? me.objLocalData.d.preferences.tempPref.quickFilterJson : {};
            me.filterJson = me.filterData = (!Ext.isEmpty(objQuickPref)) ? objQuickPref : [];
        }
		me.doApplySavedPreferences();
		me.control({
			'bankScheduleGridInformationView'  : {
				afterrender : function(panel, opts) {
					me.renderMostViewedReportList();
					me.renderLeastViewedReportList();
				}

			},
			'bankScheduleView bankScheduleFilterView' : {
				'afterrender' : function(){
					me.setInfoTooltip();
					if(!$.isEmptyObject(me.filterData)) 
					{ 
						me.applyFilterDataInQuickFilter(me.filterData);
						me.initialSmartGridRender = false;
					} else {
						me.setDataForQuickFilter();
					}
					me.setSelectedButtons();
				},
				'quickFilterChange' : function(filterJson) {
					me.setDataForQuickFilter(filterJson);
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
				'filterEntityType' : function(entityType){
					me.filterEntityType(entityType);
				},
				'filterClient' : function(clientCode, clientDesc){
					me.filterClient(clientCode, clientDesc);
				}
			},
			'bankScheduleView groupView' : {
				'render' : function(){
					me.refreshGroupByTabs(strSeller, strClient);
				},
				'groupTabChange' : function(groupInfo, subGroupInfo, tabPanel,
						newCard, oldCard) {	
					if(!skipDuplicateCall || (newCard != null && oldCard != null)){		
					me.setDataForQuickFilter();	
					me.toggleSavePrefrenceAction(true);
					me.doHandleGroupTabChange(groupInfo, subGroupInfo,
							tabPanel, newCard, oldCard);
					}		
					if(oldCard == null && !skipDuplicateCall){
						skipDuplicateCall = true;		
					}
					else if(oldCard != null || (oldCard == null && newCard == null && skipDuplicateCall))
						skipDuplicateCall = false;
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
				}				
			},
			'bankScheduleView groupView smartgrid' : {
				'cellclick' : me.doHandleCellClick,
				'afterrender' : function(){
					if(me.initialSmartGridRender)
					{
						me.filterEntityType('BANK');
						me.initialSmartGridRender = false;
					}
					else
					{
						var isShowClientCol = me.entityType == 'BANK' ? false : true;
						me.hideShowClientColumn(isShowClientCol);
					}
				}
			},
			'bankScheduleView' : {				
				'deleteFavoriteRep' : me.deleteFavoriteRep,
				'addFavoriteRep' : me.addFavoriteRep
			},
			'bankScheduleView bankScheduleFilterView button[itemId="btnSavePreferences"]' : {
				click : function(btn, opts) {
					me.toggleSavePrefrenceAction(false);
					me.handleSavePreferences();
				}
			},
			'bankScheduleView bankScheduleFilterView button[itemId="btnClearPreferences"]' : {
				click : function(btn, opts) {
					me.toggleClearPrefrenceAction(false);
					me.handleClearPreferences();
				}
			},
			'securityProfilePopup button[itemId=btnSubmitRulePriority]' : {
				click : function(btn, opts) {
					me.attachSecurityProfileToReport();
				}
			}
		});	
	},	
	filterEntityType : function(entityType){
		var me = this;
		me.entityType = entityType;
		var filterView = me.getBankScheduleFilterView();
		if(entityType === 'BANK'){
            me.getBankScheduleFilterView().down('[itemId="entityTypeRadio1"]').setValue(entityType);
			var clientAutoCompleter = me.getClientAutoCompleter();
			filterView.clientCode = null;
			filterView.clientDesc = null;
			clientAutoCompleter.setValue(null);
			me.hideClientPanel();
			me.filterClient(null, null);
		}
		else if(entityType === 'BANK_CLIENT'){
			var clientAutoCompleter = me.getClientAutoCompleter();
			clientAutoCompleter.store.loadRawData({
																"d" : {
																	"preferences" : [{
																				"CODE" : 'ALL',
																				"DESCR" : 'ALL'
																			}]
																}
															});
			
			if(null == filterView.clientCode) {
				filterView.clientCode = 'ALL';
				clientAutoCompleter.setValue('ALL');
				me.filterClient('ALL','ALL');
			}
			me.showClientpanel();
		}
		var client = null;
		if(me.entityType == 'BANK_CLIENT')
		{
			client = clientAutoCompleter.getValue();
		}
		me.refreshGroupByTabs(strSeller,client);
		if('ALL' != client)
			clientAutoCompleter.setValue(client);
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
				if(column.itemId == 'col_moduleName'){
					if(isShowClientColumn)
						column.width = objGridWidthMap.moduleName;
					else
						column.width = parseInt(objGridWidthMap.moduleName,10) + 100;
				}
			}
		}
		me.setDataForQuickFilter();
		me.applyQuickFilter();	
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
				if(column.itemId == 'col_moduleName'){
					if(isShowClientColumn)
						column.width = objGridWidthMap.moduleName;
					else
						column.width = parseInt(objGridWidthMap.moduleName,10) + 100;
				}
			}
		}
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
		var me = this, filter = me.getBankScheduleFilterView();
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
	setButtonCls : function(btn, itemId) {
		var me = this, filter = me.getBankScheduleFilterView();
		filter.down('toolbar[itemId='+ itemId +']').items.each(function(
						item) {
					item.removeCls('xn-custom-heighlight');
				});
		btn.addCls('xn-custom-heighlight');
	},
	applyQuickFilter : function() {
		var me = this;
		var groupView = me.getGroupView();
		if(null != groupView.down('smartgrid')) groupView.down('smartgrid').refreshData();
	},
	setDataForQuickFilter : function(filterJson) {
		var me = this, filter = me.getBankScheduleFilterView(), arrFilter = [];
		var data = $.isEmptyObject(filterJson) ? filter.getQuickFilterJSON() : filterJson;        
        if (data) {			
			if (data['clientDesc'])
				arrFilter.push({
							paramName : 'clientName',
							paramValue1 : encodeURIComponent((data['clientDesc'] || '').replace(new RegExp("'", 'g'), "\''")),
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
			if (data['statusCode'])
				arrFilter.push({
							paramName : 'reportStatus',
							paramValue1 : (data['statusCode'] || ''),
							operatorValue : 'eq',
							dataType : 'S'
						});
			if (data['schSrcDescription'])
				arrFilter.push({
							paramName : 'schSrcDescription',
							paramValue1 : encodeURIComponent((data['schSrcDescription'] || '').replace(new RegExp("'", 'g'), "\''")),
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
        if(allowLocalPreference === 'Y' && !me.firstLoad)
            me.handleSaveLocalStorage();
		url = url + me.widgetType + '.srvc';
		objGroupView.handleGroupActionsVisibility(buttonMask);
		var strUrl = grid.generateUrl(url, pgSize, newPgNo, oldPgNo, sorter);
		if(!Ext.isEmpty(me.getSellerCombo()) && !Ext.isEmpty(me.getSellerCombo().getValue()))
		{
			strUrl +='&$seller='+me.getSellerCombo().getValue();
		}
		else
		{
			strUrl +='&$seller='+strSeller;
		}
		strUrl += me.generateFilterUrl(groupInfo, subGroupInfo);
		strUrl = strUrl + "&" + csrfTokenName + "=" + csrfTokenValue;
        me.firstLoad = false;
		grid.loadGridData(strUrl, null, null, false);
	},
	generateFilterUrl : function(groupInfo, subGroupInfo) {
		var me = this;
		var filterView = me.getBankScheduleFilterView();
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
	generateWidgetUrl : function(groupInfo, subGroupInfo) {
		if(subGroupInfo.groupCode != 'all'){
			var strWidgetFilter = 'reportModule' + ' eq ' + '\'' + subGroupInfo.groupCode + '\'';
		}else{
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
		var objSummaryView = me.getBankScheduleView(), objPref = null, gridModel = null, intPgSize = null;
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
	renderMostViewedReportList : function() {
		var me = this;
		var mostViewedReportItem = me.getMostViewedReportItemId();
		var mostUsedReport = '';
		for (var i = 0; i < mostViewedReportList.length; i++) {
			if (i == mostViewedReportList.length - 1) {
				mostUsedReport = mostUsedReport + mostViewedReportList[i]
			} else {
				mostUsedReport = mostUsedReport + mostViewedReportList[i]
						+ ", ";
			}
		}
		mostViewedReportItem.setText(mostUsedReport);
	},
	renderLeastViewedReportList : function() {
		var me = this;
		var leastViewedReportItem = me.getLeastViewedReportItemId();
		var leastUsedReport = '';
		for (var i = 0; i < leastViewedReportList.length; i++) {
			if (i == leastViewedReportList.length - 1) {
				leastUsedReport = leastUsedReport + leastViewedReportList[i]
			} else {
				leastUsedReport = leastUsedReport + leastViewedReportList[i]
						+ ", ";
			}
		}
		leastViewedReportItem.setText(leastUsedReport);
	},
	setInfoTooltip : function() {
	var me = this, filter = me.getBankScheduleFilterView(), arrFilter = [],sellerCombo = me.getSellerCombo();
	reportNameId = filter.down('AutoCompleter[itemId="reportDescriptionAutoCompleterId"]');
	Ext.create('Ext.tip.ToolTip', {
				target : 'imgFilterInfoGridView',
				listeners : {
					'beforeshow' : function(tip) {
						var  statusFilter1;
						var data = filter.getQuickFilterJSON();
						var financialInstitutionVal = data['seller'];
						var repOrDwnldDesc1 = ( data[ 'repOrDwnldDesc' ] || getLabel( 'all', 'All' ) );
						var entityType = me.entityType;
												
						var statusFilter = (data['statusCode'] || getLabel(
								'all', 'All'));
						switch(statusFilter)
						{
							case 'ACTIVE' : statusFilter1 = "Active"; break;
							case 'DRAFT' : statusFilter1 = "Drafts"; break;
							default : statusFilter1 = "All"; break;
						};
						var reportDescription = reportNameId.getRawValue() || getLabel('none','None');
						var clientDescVal = ( data[ 'clientDesc' ] ||getLabel( 'all', 'All' ) );
						//alert(clientDescVal);
						if( sellerCombo && sellerCombo.isVisible() )
						{
							if(entityType == "BANK_CLIENT") {
								tip.update( getLabel( 'financialInstitution', 'Financial Insitution' ) + ' : '
										+ financialInstitutionVal + '<br/>' + getLabel('grid.column.company', 'Company Name') + ' : '
										+ clientDescVal + '<br/>' + getLabel( 'schedulingType', 'Scheduling Type' ) + ' : '
										+ repOrDwnldDesc1 + '<br/>' + getLabel('description', 'Description') + ' : '
										+ reportDescription );
							}
							else if(entityType == "BANK") {
								tip.update(getLabel('financialInstitution',
								'Financial Insitution')
								+ ' : '
								+ financialInstitutionVal
								+ '<br/>'
								+ getLabel( 'schedulingType', 'Scheduling Type' )
								+ ' : '
								+ repOrDwnldDesc1
								+ '<br/>'
								+ getLabel('description', 'Description')
								+ ' : '
								+ reportDescription);
							}
							
						}
						else
						{
							if(entityType == "BANK_CLIENT") {
							tip.update(getLabel('grid.column.company', 'Company Name')
							+ ' : '
							+ clientDescVal
							+ '<br/>'
							+ getLabel( 'schedulingType', 'Scheduling Type' )
							+ ' : '
							+ repOrDwnldDesc1
							+ '<br/>'
							+ getLabel('description', 'Description')
							+ ' : '
							+ reportDescription);
							}
							else if(entityType == "BANK") {
								tip.update(getLabel( 'schedulingType', 'Scheduling Type' )
										+ ' : '
										+ repOrDwnldDesc1
										+ '<br/>'
										+ getLabel('description', 'Description')
										+ ' : '
										+ reportDescription);								
							}
							
						}
					}
				}
			});

	},
	doHandleCellClick : function( view, td, cellIndex, record, tr, rowIndex, e, eOpts ) {
		var me = this;
			var linkClicked = ( e.target.tagName == 'SPAN' );
			var generateClicked = ( e.target.name == 'btnGenrate' );
			var imgClicked = ( e.target.tagName == 'IMG' );
			var clickedId = e.target.id ;
			var favouriteIconClicked = (e.target.name == 'btnfavorite');
			if(favouriteIconClicked){
				var className = e.target.className;
				if(className=='grey cursor_pointer action-link-align linkbox misc-icon icon-misc-nonfavorite'){
					record.set("isFavorite", "Y");
					var reportCode = record.data.reportCode;
					me.addFavoriteRep(reportCode, me);
				}else if(className=='linkbox misc-icon icon-misc-favorite'){
					record.set("isFavorite", "N");
					var reportCode = record.data.reportCode;
					me.deleteFavoriteRep(reportCode, me);
				}
			}
			else if( (clickedId == 'addSchedule' || clickedId == 'seeSchedule'))
			{
				me.addNewScheduleReport(record, clickedId);
			}
			else if( clickedId == 'seePregenerated'  && ( cellIndex == 6 || cellIndex == 4 ) )
			{
				 me.preGeneratedReport(record, view);
			}
			else if( generateClicked )
			{  
				me.generateOndemand(record);
			}
			else if( imgClicked && cellIndex == 4 )
			{
				me.editReport(record);
			}
			else if( clickedId == 'securityProfile')
			{
				me.selectSecurityProfile(record, view);
			}
	},
	addNewScheduleReport : function( record, clickedId )
	{
		var me = this;
		me.doSavePreferenceToLocale();
		me.submitRequest( clickedId, record );
	},
	submitRequest : function(str, record) {
		var me = this;
		form = document.createElement('FORM');
		form.name = 'frmMain';
		form.id = 'frmMain';
		form.method = 'POST';
		if (str == 'addReport') {
			strUrl = "addBankCustomReport.srvc";
			form.appendChild(me.createFormField('INPUT', 'HIDDEN',
					'reportCode', ''));
		}
		if (str == 'addIMDef') {
			strUrl = "interfaceMapCenter.srvc";
		}
		if (str == 'editReport') {
			strUrl = "editBankCustomReport.srvc";
			form.appendChild(me.createFormField('INPUT', 'HIDDEN',
					'reportCode', record.get('reportCode')));
		} else if (str == 'addSchedule' || str == 'seeSchedule') {
			if(str == 'seeSchedule')
				strUrl = "viewBankScheduleList.srvc";
			else 
				strUrl = "addBankScheduleDefination.srvc";
			
			form.appendChild(me.createFormField('INPUT', 'HIDDEN', 'schSrcId',
					record.get('reportCode')));
			form.appendChild(me.createFormField('INPUT', 'HIDDEN',
					'schSrcName', record.get('reportName')));
			form.appendChild(me.createFormField('INPUT', 'HIDDEN',
					'schSecurityProfileName', record.get('securityProfile')));
			form.appendChild(me.createFormField('INPUT', 'HIDDEN',
					'schSecurityProfileID', record.get('securityProfileId')));
			form.appendChild(me.createFormField('INPUT', 'HIDDEN',
					'schDelInfo', record.get('delInfo')));
			form.appendChild(me.createFormField('INPUT', 'HIDDEN',
					'schDelMedium', (record.get('medium') == 'EMAIL' ?'SMTP' : record.get('medium'))));
			form.appendChild(me.createFormField('INPUT', 'HIDDEN',
							'schDelOutput', record.get('delOutput')));
			form.appendChild(me.createFormField('INPUT', 'HIDDEN',
					'schModuleCode', record.get('moduleCode')));
			form.appendChild(me.createFormField('INPUT', 'HIDDEN',
					'schSrcType', record.get('srcType')));
			form.appendChild(me.createFormField('INPUT', 'HIDDEN',
					'schEntityCode', record.get('entityCode')));
			form.appendChild(me.createFormField('INPUT', 'HIDDEN', 'sellerId',
					strSeller));
			form.appendChild(me.createFormField('INPUT', 'HIDDEN',
					'identifier', record.get('identifier')));
			form.appendChild(me
					.createFormField('INPUT', 'HIDDEN', 'version', 0));
			form.appendChild(me.createFormField('INPUT', 'HIDDEN',
					'recordKeyNo', record.get('recordKeyNo')));
			form.appendChild(me.createFormField('INPUT', 'HIDDEN', 
					'schEntityType', record.get('entityType')));
			form.appendChild(me.createFormField('INPUT', 'HIDDEN', 
					'schChannel', record.get('channelName')));
			form.appendChild(me.createFormField('INPUT', 'HIDDEN', 
					'intRecordKeyNmbr', record.get('intRecordKeyNmbr')));
			
		} else if (str == 'Generate') {
			strUrl = "showBankScheduleGenerateParam.srvc";
			form.appendChild(me.createFormField('INPUT', 'HIDDEN',
					'moduleCode', record.get('moduleCode')));
			form.appendChild(me.createFormField('INPUT', 'HIDDEN', 'srcType',
					record.get('srcType')));
			form.appendChild(me.createFormField('INPUT', 'HIDDEN',
					'reportCode', record.get('reportCode')));
			form.appendChild(me.createFormField('INPUT', 'HIDDEN',
					'reportFileName', record.get('reportDesc')));
			form.appendChild(me.createFormField('INPUT', 'HIDDEN',
					'reportName', record.get('reportName')));
			form.appendChild(me.createFormField('INPUT', 'HIDDEN',
					'reportDesc', record.get('reportDesc')));
			form.appendChild(me.createFormField('INPUT', 'HIDDEN', 'delInfo',
					record.get('delInfo')));
			// form.appendChild( me.createFormField( 'INPUT', 'HIDDEN',
			// 'delMedium', record.get( 'medium' ) ) );
			form.appendChild(me.createFormField('INPUT', 'HIDDEN', 'delMedium',
					(record.get('medium') == 'EMAIL' ?'SMTP' : record.get('medium'))));
			form.appendChild(me.createFormField('INPUT', 'HIDDEN',
					'securityProfileID', record.get('securityProfileId')));
			form.appendChild(me.createFormField('INPUT', 'HIDDEN',
					'securityProfileName', record.get('securityProfile')));
			form.appendChild(me.createFormField('INPUT', 'HIDDEN',
					'clientCode', record.get('entityCode')));
			form.appendChild(me.createFormField('INPUT', 'HIDDEN',
					'entityCode', record.get('entityCode')));
			form.appendChild(me.createFormField('INPUT', 'HIDDEN',
					'entitlementSeller', record.get('sellerId')));
			form.appendChild(me.createFormField('INPUT', 'HIDDEN',
					'recordKeyNo', record.get('recordKeyNo')));
			form.appendChild(me.createFormField('INPUT', 'HIDDEN', 
					'entityType', record.get('entityType')));
			form.appendChild(me.createFormField('INPUT', 'HIDDEN', 
					'channelName', record.get('channelName')));
			form.appendChild( me.createFormField( 'INPUT', 'HIDDEN', 'intRecordKeyNo', record.get( 'intRecordKeyNmbr' ) ) );	
		} else if (str == 'Download') {
			strUrl = "downloadBankSchPreGeneratedReport.srvc";
			form.appendChild(me.createFormField('INPUT', 'HIDDEN',
					'recordKeyNo', record.get('recordKeyNo')));
			form.appendChild(me.createFormField('INPUT', 'HIDDEN',
					'schTempFileDir', record.get('schTempFileDir')));
			form.appendChild(me.createFormField('INPUT', 'HIDDEN',
					'gaFileName', record.get('gaFileName')));
		} else if (str == 'View') {
			strUrl = "viewBankScheduleDefination.srvc";
			form.appendChild(me.createFormField('INPUT', 'HIDDEN',
					'identifier', record.get('identifier')));
			form.appendChild(me.createFormField('INPUT', 'HIDDEN', 'version',
					record.get('version')));
			form.appendChild(me.createFormField('INPUT', 'HIDDEN',
					'recordKeyNo', record.get('recordKeyNo')));
			form.appendChild(me.createFormField('INPUT', 'HIDDEN', 
					'schEntityType', record.get('entityType')));
			form.appendChild(me.createFormField('INPUT', 'HIDDEN', 
					'schChannel', record.get('channelName')));
			form.appendChild(me.createFormField('INPUT', 'HIDDEN', 
					'intRecordKeyNmbr', record.get('intRecordKeyNmbr')));

		} else if (str == 'Edit') {
			strUrl = "editBankScheduleDefination.srvc";
			form.appendChild(me.createFormField('INPUT', 'HIDDEN',
					'identifier', record.get('identifier')));
			form.appendChild(me.createFormField('INPUT', 'HIDDEN', 'version',
					record.get('version')));
			form.appendChild(me.createFormField('INPUT', 'HIDDEN',
					'recordKeyNo', record.get('recordKeyNo')));
			form.appendChild(me.createFormField('INPUT', 'HIDDEN', 
					'schEntityType', record.get('entityType')));
			form.appendChild(me.createFormField('INPUT', 'HIDDEN', 
					'schChannel', record.get('channelName')));
			form.appendChild(me.createFormField('INPUT', 'HIDDEN', 
					'intRecordKeyNmbr', record.get('intRecordKeyNmbr')));
		}
		
		form.appendChild(me.createFormField('INPUT', 'HIDDEN', csrfTokenName,
				csrfTokenValue));
		form.action = strUrl;
		document.body.appendChild(form);
		form.submit();
		document.body.removeChild(form);
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
	generateOndemand : function(record) {
		var me = this;
		me.doSavePreferenceToLocale();
		me.submitRequest('Generate', record);
	},
	addFavoriteRep : function(reportCode, wdgt) {
		var me = this;
		me.favReport.push(reportCode);
		var newReportset = "{\"reports\":" + "[";
		me.flagFavSet = true;
		for (var index = 0; index < me.favReport.length; index++) {
			var rep = me.favReport[index];
			var newRep = '"' + rep + '"';
			newReportset = newReportset + newRep;
			if (index != (me.favReport.length - 1))
				newReportset = newReportset + ",";
		}

		newReportset = newReportset + "]}";

		//wdgt.setLoading(true);
		var groupView = me.getGroupView();
		groupView.setLoading( true );
		Ext.Ajax.request({
					url : 'userpreferences/bankScheduleFilter/preferredReports.srvc',
					method : 'POST',
					jsonData : newReportset,
					success : function(response) {
						//wdgt.setLoading(false);
						groupView.setLoading( false );
					},
					failure : function() {
					}
				});

		var favLength = me.favReport.length;
		/*
		 * me.getFavButtonRef().setText(getLabel('favorites', 'Favorites') + "(<span
		 * class='red'>" + favLength + "</span>)");
		 * me.getFavButtonRef().accArray = me.favReport;
		 */
	},
	deleteFavoriteRep : function(reportCode, wdgt) {
		var reportId = reportCode;
		var me = this;
		me.flagFavSet = true;
		var index = me.favReport.indexOf(reportId, 0);

		if (index > -1) {
			me.favReport.splice(index, 1);
		}
		var newReportset = "{\"reports\":" + "[";

		for (var index = 0; index < this.favReport.length; index++) {
			var Acc = me.favReport[index];
			var newAcc = '"' + Acc + '"';
			newReportset = newReportset + newAcc;
			if (index != (me.favReport.length - 1))
				newReportset = newReportset + ",";
		}

		newReportset = newReportset + "]}";

		//wdgt.setLoading(true);
		var groupView = me.getGroupView();
		groupView.setLoading( true );

		Ext.Ajax.request({
					url : 'userpreferences/bankScheduleFilter/preferredReports.srvc',
					method : 'POST',
					jsonData : newReportset,
					success : function(response) {
						//wdgt.setLoading(false);
						groupView.setLoading( false );
					},
					failure : function() {
					}

				});
		var favLength = me.favReport.length;
		/*
		 * me.getFavButtonRef().setText(getLabel('favorites', 'Favorites') + "(<span
		 * class='red'>" + favLength + "</span>)");
		 * me.getFavButtonRef().accArray = me.favReport;
		 */
	},
	editReport : function(record) {
		var me = this;
		me.submitRequest('editReport', record);
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
			me.objPreGenPopup = Ext.create( 'GCP.view.BankSchedulePreGenPopup' );
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
			colId : 'groupaction',
			width : 100,
			align : 'right',
			locked : true,
			items :
			[
				{
					itemId : 'btnDownload',
					text : 'Download',
					itemLabel : getLabel( 'uploadToOther', 'Upload to Other System' )
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
			proxyUrl : 'getBankSchPreGeneratedList.srvc',
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
		var bankSchedulePreGenPopupDtl = me.getBankSchedulePreGenPopupDtl();
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
			bankSchedulePreGenPopupDtl.add( reportCenterPregenGrid );
			bankSchedulePreGenPopupDtl.doLayout();
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
		strUrl += '&' + csrfTokenName + "=" + csrfTokenValue + 
		'&$argString=' + reportCode +
		'&$entityCode=' + record.get( 'entityCode' ) +
		'&$srcName=' + record.get( 'reportName' )  +
		'&$srcId=' + record.get( 'reportCode' ) +
		'&$entityType=' + record.get( 'entityType' ) +
		'&$distributionId=' + distributionId +
		'&$originalSourceId=' + record.get( 'originalSourceId' ) +
		'&$sellerId=' + strSeller +
		'&$moduleCode=' + record.get( 'moduleCode' ) +
		'&$srcTag=' + record.get( 'reportType' ) +
		'&$srcType=' + record.get( 'srcType' );
		 
		grid.loadGridData( strUrl, null );

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
		me.preHandleGroupActions(strUrl, '', grid, arrSelectedRecords,
					strActionType, strAction)
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
													'lblError',
													'Error'),
											msg : getLabel(
													'lblDataError',
													'Error while fetching data..!'),
											buttons : Ext.MessageBox.OK,
											icon : Ext.MessageBox.ERROR
										});
							}
						});
			}
		}
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
		var groupInfo = null, subGroupInfo = null, strModule = null, filter = me.getBankScheduleFilterView();
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
		var me = this, filter = me.getBankScheduleFilterView(); data = null;
		data = filter.getQuickFilterJSON();
		me.preferenceHandler.setLocalPreferences(me.strPageName, data);
	},
	doApplySavedPreferences : function() {
		var me = this, filter = me.getBankScheduleFilterView();
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
			objData = arrSelectedRecords[ index ];
			maskArray.push( objData.get( '__metadata' ).__rightsMap );
		}
		actionMask = doAndOperation( maskArray, 6 );
		objGroupView.handleGroupActionsVisibility(actionMask);
	},	
	isPregeneratedRowIconVisible : function( store, record, jsonData, itmId, maskPosition )
	{
		return true;
	},
	attachSecurityProfileToReport : function(){
		var me = this;
		var securityPopupRef = me.getSecurityProfilePopup();
		var jsonData = securityPopupRef.getJsonofSecurityProfile();
		var strData = {};
		/*var repReportCode = $('#repReportCode');
		var repReportType = $('#repReportType');
		var repEntityType = $('#repEntityType');
		var repSecurityPrf = $('#securityProfileCombo');
		strData['reportCode'] = repReportCode.val();
		strData['securityProfileId'] = repSecurityPrf.val();
		strData['reportType'] = repReportType.val();
		strData['entityType'] = repEntityType.val();
		*/					
		Ext.Ajax.request(
		{
			url : "attachBankSecurityProfileToReport.srvc?"+ csrfTokenName + "=" + csrfTokenValue,
			method : 'POST',
			jsonData : Ext.encode(jsonData),		
			success : function( response )
			{
				securityPopupRef.destroy();
				var groupView = me.getGroupView();
				groupView.down('smartgrid').refreshData();
			},
			failure : function( response )
			{
				console.log( 'Error Occured' );
			}
		} );
	},
	selectSecurityProfile : function( record ,viewSmartGrid)
	{
		var me = this;
		var clientCode = record.raw.entityCode;
		var sellerCode = record.raw.sellerId;
		var entityType = record.raw.entityType;
		var strUrl = '/getSchdlSecurityProfile.srvc?';
		if(entityType =='BANK')
		{
			strUrl = 'getBankSchdlSecurityProfile.srvc?';
		}
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
		var entityType = record.raw.entityType;
		var strUrl = 'getSchdlSecurityProfile.srvc?';
		if(entityType =='BANK')
		{
			strUrl = 'getBankSchdlSecurityProfile.srvc?';
		}
		if(sellerCode != null)
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
	handleSaveLocalStorage : function(){
		var me=this,arrSaveData = [], objSaveState = {}, grid = Ext.getCmp( 'gridPreGenItemId' );
		objSaveState['quickFilterJson'] = !Ext.isEmpty(me.filterData) ? me.filterData : {};
		objSaveState['advanceFilterJson']= !Ext.isEmpty(me.advFilterData) ? me.advFilterData : {};
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
		var me = this, args = {}, strLocalPrefPageName = me.strPageName + '_TempPref';
		me.preferenceHandler = Ext.create('Ext.ux.gcp.PreferencesHandler');
		if (!Ext.isEmpty(objSaveState)) {
			args['tempPref'] = objSaveState;
			me.preferenceHandler.savePagePreferences(strLocalPrefPageName, objSaveState,me.postHandleSaveLocalPref, args, me, false);
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
	applyFilterDataInQuickFilter : function(advFilterData) {
		var me = this;
		var blnFlag = true;
		var sellerCombo = me.getBankScheduleFilterView()
				.down('combobox[itemId="reportCenterSellerId"]');
		var clientAutoCompleter = me.getBankScheduleFilterView()
				.down('combobox[itemId="reportCenterClientId"]');
		var reportNameAutoCompleter  = me.getBankScheduleFilterView().down('AutoCompleter[itemId="reportDescriptionAutoCompleterId"]');
		for (var i = 0; i < advFilterData.length; i++) {
			if (advFilterData[i].paramName === 'seller'
					&& !Ext.isEmpty(advFilterData[i].paramValue1))
				sellerCombo.setValue(advFilterData[i].paramValue1);
			if (advFilterData[i].paramName === 'clientName'
					&& !Ext.isEmpty(advFilterData[i].paramValue1)) {
				me.getBankScheduleFilterView().clientCode = decodeURIComponent(advFilterData[i].paramValue1);
				clientAutoCompleter.setValue(decodeURIComponent(advFilterData[i].paramValue1));
				me.getBankScheduleFilterView().down('[itemId="entityTypeRadio2"]').setValue("BANK_CLIENT");
				blnFlag = false;
				}
			if (advFilterData[i].paramName === 'repOrDwnld'
				&& !Ext.isEmpty(advFilterData[i].paramValue1)) {
				me.getBankScheduleFilterView().down('toolbar[itemId=schedulingTypeToolBar]').items.each(function(
						item) {
					item.removeCls('xn-custom-heighlight');
					if(item.code == advFilterData[i].paramValue1) {
						me.getBankScheduleFilterView().repOrDwnld = advFilterData[i].paramValue1;
						me.getBankScheduleFilterView().repOrDwnldDesc = item.btnDesc;
						item.addCls('xn-custom-heighlight');
						
					}
						
				});
			}
			if(advFilterData[i].paramName === 'schSrcDescription'
                    && !Ext.isEmpty(advFilterData[i].paramValue1)) {
				me.getBankScheduleFilterView().filterDescription = decodeURIComponent(advFilterData[i].paramValue1);
				reportNameAutoCompleter.setValue(decodeURIComponent(advFilterData[i].paramValue1));
			}
		}
		if(blnFlag) {
			me.getBankScheduleFilterView().down('[itemId="entityTypeRadio1"]').setValue("BANK");
		}
	},
});