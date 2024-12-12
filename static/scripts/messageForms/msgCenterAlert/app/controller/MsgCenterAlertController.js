Ext.define('GCP.controller.MsgCenterAlertController', {
	extend : 'Ext.app.Controller',
	requires : ['GCP.view.MsgCenterAlertGridView','Ext.ux.gcp.DateHandler'],
	views : ['GCP.view.MsgCenterAlertView','GCP.view.MsgCenterAlertViewPopUp'],
	/**
	 * Array of configs to build up references to views on page.
	 */
	refs : [{
				ref : 'msgCenterAlertView',
				selector : 'msgCenterAlertView'
			},
	        {
				ref : 'msgCenterAlertGrid',
				selector : 'msgCenterAlertView msgCenterAlertGridView grid[itemId="gridViewMstId"]'
			},
			{
				ref : 'msgCenterAlertDtlView',
				selector : 'msgCenterAlertView msgCenterAlertGridView panel[itemId="msgCenterAlertDtlView"]'
			},
			{
				ref : 'msgCenterAlertGridView',
				selector : 'msgCenterAlertView msgCenterAlertGridView'
			}, 
			{
				ref : 'matchCriteria',
				selector : 'msgCenterAlertGridView radiogroup[itemId="matchCriteria"]'
			},
			{
				ref : 'searchTxnTextInput',
				selector : 'msgCenterAlertGridView textfield[itemId="searchTxnTextField"]'
			},
			{
				ref : 'msgCenterAlertFilterView',
				selector : 'msgCenterAlertFilterView'
			},
			{
				ref : 'fromDateLabel',
				selector : 'msgCenterAlertView msgCenterAlertFilterView label[itemId="dateFilterFrom"]'
			},
			{
				ref : 'toDateLabel',
				selector : 'msgCenterAlertView msgCenterAlertFilterView label[itemId="dateFilterTo"]'
			},
			{
				ref : 'dateLabel',
				selector : 'msgCenterAlertView msgCenterAlertFilterView label[itemId="dateLabel"]'
			},
			{
				ref : 'fromAlertDate',
				selector : 'msgCenterAlertView msgCenterAlertFilterView datefield[itemId="fromDate"]'
			},
			{
				ref : 'toAlertDate',
				selector : 'msgCenterAlertView msgCenterAlertFilterView datefield[itemId="toDate"]'
			},
			{
				ref : 'dateRangeComponent',
				selector : 'msgCenterAlertView msgCenterAlertFilterView container[itemId="dateRangeComponent"]'
			},
			{
				ref : 'alertDate',
				selector : 'msgCenterAlertView msgCenterAlertFilterView button[itemId="alertDate"]'
			},
			{
				ref : 'advFilterActionToolBar',
				selector : 'msgCenterAlertView msgCenterAlertFilterView toolbar[itemId="advFilterActionToolBar"]'
			},
			{
				ref : 'btnSavePreferences',
				selector : 'msgCenterAlertView msgCenterAlertFilterView button[itemId="btnSavePreferences"]'
			}, 
			{
				ref : 'btnClearPreferences',
				selector : 'msgCenterAlertView msgCenterAlertFilterView button[itemId="btnClearPreferences"]'
			}, 
			{
				ref : 'msgCenterAlertTypeToolBar',
				selector : 'msgCenterAlertView msgCenterAlertFilterView toolbar[itemId="msgCenterAlertTypeToolBar"]'
			},
			{
				ref : 'msgEventPanel',
				selector : 'msgCenterAlertView msgCenterAlertFilterView panel[itemId="msgEventPanel"]'
			},
			{
				ref : 'msgCenterAlertGridInformationView',
				selector : 'msgCenterAlertGridInformationView'
			},
			{
				ref : 'infoSummaryLowerPanel',
				selector : 'msgCenterAlertGridInformationView panel[itemId="infoSummaryLowerPanel"]'
			},
			{
				ref : 'withHeaderCheckbox',
				selector : 'msgCenterAlertView msgCenterAlertTitleView menuitem[itemId="withHeaderId"]'
			},
			{
				ref : 'actionBarSummDtl',
				selector : 'msgCenterAlertView msgCenterAlertGridView msgCenterAlertGroupActionBarView'
			},
			{
				ref : 'msgCenterAlertViewInfoDtlRef',
				selector : 'msgCenterAlertViewPopUp[itemId="viewMsgPopupId"] container[itemId="msgCenterAlertViewInfoItemId"]'
			},
			{
				ref : 'msgCenterAlertViewInfoRef',
				selector : 'msgCenterAlertViewPopUp[itemId="viewMsgPopupId"]'
			},
			{
				ref : 'strMsgLabel',
				selector : 'msgCenterAlertView msgCenterAlertFilterView label[itemId="strMsgValue"]'
			}
			],
	config : {
		filterData : [],
		advFilterData : [],
		typeFilterVal : 'all',
		filterApplied : 'ALL',
		showAdvFilterCode : null,
		actionFilterVal : 'all',
		actionFilterDesc : 'all',
		typeFilterDesc : 'all',
		dateFilterVal : '1',
		dateFilterFromVal : '',
		dateFilterToVal : '',
		dateFilterLabel : getLabel('today', 'Today'),
		dateHandler : null,
		statusFilterVal:'',
		urlGridPref : 'userpreferences/msgcenteralert/gridView.srvc',
		urlGridFilterPref : 'userpreferences/msgcenteralert/gridViewFilter.srvc',
		objViewInfoPopup : null,
		arrSorter:[]
	},
	/**
	 * A template method that is called when your application boots. It is
	 * called before the Application's launch function is executed so gives a
	 * hook point to run any code before your Viewport is created.
	 */
	init : function() {
		var me = this;
		
		this.dateHandler = Ext.create( 'Ext.ux.gcp.DateHandler' );
		me.updateFilterConfig();
		me.objViewInfoPopup = Ext.create( 'GCP.view.MsgCenterAlertViewPopUp',
				{
					parent : 'msgCenterAlertView',
					itemId : 'viewMsgPopupId'
				} );
		me.control({
			'msgCenterAlertView' : {
			beforerender : function(panel, opts) {
			},
			afterrender : function(panel, opts) {
			}
		},
			'msgCenterAlertGridView' : {
				render : function(panel) {
					me.handleSmartGridConfig();
					me.setGridInfoSummary();
				}
			},

			'msgCenterAlertGridView smartgrid' : {
				render : function(grid) {
					me.handleLoadGridData(grid, grid.store.dataUrl,
							grid.pageSize, 1, 1, grid.store.sorters);					
				},
				gridPageChange : me.handleLoadGridData,
				gridSortChange : me.handleLoadGridData,
				gridRowSelectionChange : function(grid, record, recordIndex,
						records, jsonData) {
					me.enableValidActionsForGrid(grid, record, recordIndex,
							records, jsonData);
				}
			},
			'msgCenterAlertGridView textfield[itemId="searchTxnTextField"]' : {
				change : function(btn, opts) {
					me.searchTrasactionChange();
				}
			},
			'msgCenterAlertGridView radiogroup[itemId="matchCriteria"]' : {
				change : function(btn, opts) {
					me.searchTrasactionChange();
				}
			},
			'msgCenterAlertView msgCenterAlertFilterView' : {
				render : function(panel, opts) {
					me.setInfoTooltip();
					me.setEventComboListVal(panel);
				},
				filterType : function(btn, opts) {
					me.toggleSavePrefrenceAction(true);
					me.handleType(btn);
				},
				dateChange : function(btn, opts) {
					me.dateFilterVal = btn.btnValue;
					me.dateFilterLabel = btn.text;
					me.handleDateChange(btn.btnValue);
					this.filterApplied = 'Q';
					if (btn.btnValue !== '7') {
						me.setDataForFilter();
						me.applyQuickFilter();
						me.toggleSavePrefrenceAction(true);
					}
				},
				afterrender : function(panel, opts){
					if(me.statusFilterVal != 'all')
						panel.highlightSavedStatus(me.statusFilterVal);
				}
			},
			'msgCenterAlertView msgCenterAlertFilterView toolbar[itemId="dateToolBar"]' : {
				afterrender : function(tbar, opts) {
					me.updateDateFilterView();
				}
			},
			'msgCenterAlertView msgCenterAlertFilterView button[itemId="goBtn"]' : {
				click : function(btn, opts) {
					var frmDate = me.getFromAlertDate().getValue();
					var toDate = me.getToAlertDate().getValue();
					
					if(!Ext.isEmpty(frmDate) && !Ext.isEmpty(toDate))
					{
					var dtParams = me.getDateParam('7');
					me.dateFilterFromVal = dtParams.fieldValue1;
					me.dateFilterToVal = dtParams.fieldValue2;
					this.filterApplied = 'Q';
					me.setDataForFilter();
					me.applyQuickFilter();
					me.toggleSavePrefrenceAction(true);
					}
				}
			},
			'msgCenterAlertView msgCenterAlertFilterView button[itemId="btnSavePreferences"]' : {
				click : function(btn, opts) {
					me.toggleSavePrefrenceAction(false);
					me.handleSavePreferences();
				}
			},
			'msgCenterAlertView msgCenterAlertFilterView button[itemId="btnClearPreferences"]' : {
				click : function(btn, opts) {
					me.handleClearPreferences();
				}
			},
			'msgCenterAlertView msgCenterAlertGridInformationView panel[itemId="msgCenterAlertInfoHeaderBarGridView"] image[itemId="summInfoShowHideGridView"]' : {
				click : function(image) {
					var objAccSummInfoBar = me.getInfoSummaryLowerPanel();
					if (image.hasCls("icon_collapse_summ")) {
						image.removeCls("icon_collapse_summ");
						image.addCls("icon_expand_summ");
						objAccSummInfoBar.hide();
					} else {
						image.removeCls("icon_expand_summ");
						image.addCls("icon_collapse_summ");
						objAccSummInfoBar.show();
					}
				},
				render:function( image, eOpts ){
					var objAccSummInfoBar = me.getInfoSummaryLowerPanel();
						if (image.hasCls("icon_collapse_summ")) {
							image.removeCls("icon_collapse_summ");
							image.addCls("icon_expand_summ");
							objAccSummInfoBar.hide();
						} else {
							image.removeCls("icon_expand_summ");
							image.addCls("icon_collapse_summ");
							objAccSummInfoBar.show();
						}
					}
			},
			'msgCenterAlertGridInformationView' : {
				render : this.onMsgCenterAlertGridInformationViewRender
			},
			'msgCenterAlertView msgCenterAlertTitleView' : {
				performReportAction : function(btn, opts) {
					me.handleReportAction(btn, opts);
				},
				afterrender : function() {
				}
			},
			'msgCenterAlertView msgCenterAlertGridView toolbar[itemId=msgCenterAlertGroupActionBarView_summDtl]' : {
				performGroupAction : function(btn, opts) {
					me.handleGroupActions(btn);
				}
			},
			'msgCenterAlertViewPopUp[itemId="viewMsgPopupId"]' : {
				closeViewInfoPopup : function( btn )
				{
					me.closeViewInfoPopup( btn );
				}
			},
			'msgCenterAlertView msgCenterAlertFilterView toolbar[itemId="msgToolBar"]' : {
				afterrender : function(tbar, opts) {
					me.toggleSavePrefrenceAction(true);
				}
			},
			'msgCenterAlertFilterView':{
				render: function (cmp,eopts){
				  //   cmp.getEl().dom.title = me.setInfoTooltip();
				}
				}
		});
	},

	handleSmartGridConfig : function() {
		var me = this;
		var msgCenterAlertGrid = me.getMsgCenterAlertGrid();
		var objConfigMap = me.getMsgCenterAlertConfiguration();
		var objPref = null, arrCols = new Array(), arrColsPref = null, pgSize = null;
		if( Ext.isEmpty( msgCenterAlertGrid ) )
		{
			if( !Ext.isEmpty( objGridViewPref ) )
			{
				var data = Ext.decode( objGridViewPref );
				objPref = data[ 0 ];
				arrColsPref = objPref.gridCols;
				arrCols = me.getColumns( arrColsPref, objConfigMap.objWidthMap );
				pgSize = !Ext.isEmpty( objPref.pgSize ) ? parseInt( objPref.pgSize,10 ) : 100;
				me.handleSmartGridLoading( arrCols, objConfigMap.storeModel, pgSize );
			}
			else
			if( objConfigMap.arrColsPref )
			{
				arrCols = me.getColumns( objConfigMap.arrColsPref, objConfigMap.objWidthMap );
				pgSize = 100;
				me.handleSmartGridLoading( arrCols, objConfigMap.storeModel, pgSize );
			}
		}
		else
		{
			me.handleLoadGridData( grid, grid.store.dataUrl, grid.pageSize, 1, 1, null );
		}
	},
	
	handleSmartGridLoading : function(arrCols, storeModel, pgSize) {
		var me = this;
		var pageSize = null;
		pageSize = pgSize || 10;
		msgCenterAlertGrid = Ext.create('Ext.ux.gcp.SmartGrid', {
			id : 'gridViewMstId',
			itemId : 'gridViewMstId',
			pageSize : pageSize,
			autoDestroy : true,
			stateful : false,
			showEmptyRow : false,
			showCheckBoxColumn : true,
			hideRowNumbererColumn : true,
			padding : '0 10 10 10',
			rowList : _AvailableGridSize,
			minHeight : 140,
			columnModel : arrCols,
			storeModel : storeModel,
			isRowIconVisible : me.isRowIconVisible,
			isRowMoreMenuVisible : me.isRowMoreMenuVisible,
			handleRowMoreMenuClick : me.handleRowMoreMenuClick,

			handleRowIconClick : function(grid, rowIndex, columnIndex,
					btn, event, record) {
				me.handleRowIconClick(grid, rowIndex, columnIndex, btn,
						event, record);
			},

			handleRowMoreMenuItemClick : function(menu, event) {
				var dataParams = menu.ownerCt.dataParams;
				me.handleRowIconClick(dataParams.view, dataParams.rowIndex,
						dataParams.columnIndex, this, event, dataParams.record);
			}
		});
		
		var msgCenterAlertDtlView = me.getMsgCenterAlertDtlView();
		msgCenterAlertDtlView.add(msgCenterAlertGrid);
		msgCenterAlertDtlView.doLayout();
	},
	
	handleRowIconClick : function(grid, rowIndex, columnIndex, btn, event,
			record) {
		var me = this;
		var actionName = btn.itemId;
		if (actionName === 'delete' || actionName === 'unread' || actionName === 'read'){
			me.handleGroupActions(btn, record);
		} else if (actionName === 'btnView') {
			me.viewMsgPopUp(record);
		}
	},
	viewMsgPopUp : function(record)
	{
		var buttonsOpts = {};
		buttonsOpts[btnsArray['okBtn']] = function() {		
			$(this).dialog("close");
		};	
		var date=record.data.eventDt;
		var sTitle = getLabel('ViewAlert', 'View Alert');
		$('#viewAlertPopup').dialog({
			autoOpen : false,
			title : sTitle,
			height : 500,
			width : 580,
			modal : true,
			buttons : buttonsOpts,
			close: function() {
				
			}
		});
		$('#viewAlertPopup').addClass("ux_panel-transparent-background ux_font-size14-normal");
		$('#subject').text(record.data.subject);
		$('#sent').text(date.toString());
		$('#from').text(record.data.senderMail);
		$('#messageText').addClass("ux_font-size14-normal");
		$('#messageText').html(record.data.messageText.replace(/\n/g, '<br />'));
		$('#viewAlertPopup').dialog("open");
		if(record.get('status')=="U" ||record.get('status')=="N"){
		  var strUrl = Ext.String.format( 'MsgCenterAlert/read.srvc?' );
		  strUrl= strUrl+ csrfTokenName + "=" + csrfTokenValue;
		  var grid = this.getMsgCenterAlertGrid();
		if (!Ext.isEmpty(grid)) {
			var arrayJson = new Array();
			
			records = record;
				arrayJson.push({
							identifier : records.data.identifier,
							jornalNmbr : records.data.jornalNmbr
						});
	
		  Ext.Ajax.request({
						url : strUrl,
						method : 'POST',
						jsonData : Ext.encode(arrayJson),
						success : function(response) {
							// TODO : Action Result handling to be done here
							//this.enableDisableGroupActions('0000000000', true);
							grid.refreshData();
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
										cls : 'ux_popup',
										icon : Ext.MessageBox.ERROR
									});
						}
					});
			}		
		}
	},
	handleGroupActions : function(btn, record) {
		var me = this;
		
		var strAction = !Ext.isEmpty( btn.actionName ) ? btn.actionName : btn.itemId;
		var strUrl = Ext.String.format( 'MsgCenterAlert/{0}.srvc?',strAction );
		strUrl= strUrl+ csrfTokenName + "=" + csrfTokenValue;
		this.preHandleGroupActions( strUrl, '', record );
	},
	preHandleGroupActions : function(strUrl, remark, record) {

		var me = this;
		var grid = this.getMsgCenterAlertGrid();
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
							jornalNmbr : records[index].data.jornalNmbr,
							userMessage : remark
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
							me.enableDisableGroupActions('0000000000', true);
							grid.refreshData();
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
										cls : 'ux_popup',
										icon : Ext.MessageBox.ERROR
									});
						}
					});
		}

	},
	applyFilter : function() {
		var me = this;
		var grid = me.getMsgCenterAlertGrid();
		if (!Ext.isEmpty(grid)) {
			var strDataUrl = grid.store.dataUrl;
			var store = grid.store;
			var strUrl = grid.generateUrl(strDataUrl, grid.pageSize, 1, 1,
					store.sorters);
			strUrl = strUrl + me.getFilterUrl()+'&'+csrfTokenName+'='+csrfTokenValue;
			me.getMsgCenterAlertGrid().setLoading(true);
			grid.loadGridData(strUrl, me.handleAfterGridDataLoad, null);
		}
	},
	getMsgCenterAlertConfiguration : function() {
		var me = this;
		var objConfigMap = null;
		var objWidthMap = null;
		var arrColsPref = null;
		var storeModel = null;
		if( !Ext.isEmpty( objGridViewPref ) )
			{
				var data = Ext.decode( objGridViewPref );
				var objPref = data[ 0 ];
				me.arrSorter = objPref.sortState;
			}
		objWidthMap = {
			"eventDt" : 130,
			"subject" : 280,
			"eventDesc" : 370
		};
		
			arrColsPref = [{
						"colId" : "eventDt",
						"colHeader" : "Alert Date Time"
					}, {
						"colId" : "subject",
						"colHeader" : "Subject"
					}, {
						"colId" : "eventDesc",
						"colHeader" : "Alert Event"
					}];

			storeModel = {
				fields : ['eventDt', 'subject', 'eventDesc','__metadata','identifier','status',
				          'AllCount','AllUnread','notificationId','messageText','jornalNmbr'],
				proxyUrl : 'msgCenterAlertList.srvc',
				rootNode : 'd.msgCenterAlert',
				sortState : me.arrSorter,
				totalRowsNode : 'd.__count'
			};
		
		objConfigMap = {
			"objWidthMap" : objWidthMap,
			"arrColsPref" : arrColsPref,
			"storeModel"  : storeModel
		};
		return objConfigMap;
	},
	
	handleLoadGridData : function(grid, url, pgSize, newPgNo, oldPgNo, sorter) {
		var me = this;
		var strUrl = grid.generateUrl(url, pgSize, newPgNo, oldPgNo, sorter);
		me.setDataForFilter();
		strUrl = strUrl + me.getFilterUrl()+'&'+csrfTokenName+'='+csrfTokenValue;
		grid.loadGridData(strUrl, null);		
	},
	applyQuickFilter : function() {
		var me = this;
		me.filterApplied = 'Q';
		var grid = me.getMsgCenterAlertGrid();
		if (!Ext.isEmpty(grid)) {
			var strDataUrl = grid.store.dataUrl;
			var store = grid.store;
			var strUrl = grid.generateUrl(strDataUrl, grid.pageSize, 1, 1,
					store.sorters);
			strUrl = strUrl + me.getFilterUrl()+'&'+csrfTokenName+'='+csrfTokenValue;
			grid.setLoading(true);
			grid.loadGridData(strUrl,null);
		}
	},
	setDataForFilter : function() {
		var me = this;
		me.getSearchTxnTextInput().setValue('');
		if (this.filterApplied === 'Q') {
			this.filterData = this.getQuickFilterQueryJson();
		} 
		if (this.filterApplied === 'ALL') {
			this.advFilterData = [];
			this.filterData = this.getQuickFilterQueryJson();
		} 
	},
	getFilterUrl : function() {
		var me = this;
		var strQuickFilterUrl = '',  strUrl = '', isFilterApplied = 'false',strAdvFilterUrl ='';
		if (me.filterApplied === 'ALL'){	
			strQuickFilterUrl = me.generateUrlWithQuickFilterParams(me);
			if (!Ext.isEmpty(strQuickFilterUrl)) {
				if(strQuickFilterUrl.indexOf('&$filter')==-1)
				strUrl = '&$filter='+strQuickFilterUrl + ' ' ;
				else
					strUrl = strQuickFilterUrl + ' ' ;
				isFilterApplied = true;
			}
		}else if (me.filterApplied === 'Q'){	
			strQuickFilterUrl = me.generateUrlWithQuickFilterParams(me);
			if (!Ext.isEmpty(strQuickFilterUrl)) {
				strUrl =  strQuickFilterUrl;
				isFilterApplied = true;
			}
		}
		else{
			strAdvFilterUrl = me.generateUrlWithAdvancedFilterParams(me);
			strUrl =  '&$filter=' + strAdvFilterUrl ;
			isFilterApplied = true;
		}
		return strUrl;
	},
	generateUrlWithAdvancedFilterParams : function(me) {
		var filterData = me.filterData;
		var isFilterApplied = false;
		var strFilter = '';
		var strTemp = '';
		var strFilterParam = '';
		for (var index = 0; index < filterData.length; index++) {
			/*if (isFilterApplied)
				strTemp = strTemp + ' and ';*/
			switch (filterData[index].operatorValue) {
				default :
					// Default opertator is eq
					if (filterData[index].dataType === 'S') {
						strTemp = strTemp + filterData[index].paramName + ' '
								+ filterData[index].operatorValue + ' ' + '\''
								+ filterData[index].paramValue1 + '\'';
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
	setGridInfoSummary : function( grid )
	{
		var me = this;
		var msgCenterAlertGrid = me.getMsgCenterAlertGrid();
		var msgCenterAlertSummaryInfo = me.getMsgCenterAlertGridInformationView();

		var allCount = msgCenterAlertSummaryInfo.down( 'panel[itemId="infoSummaryLowerPanel"] panel label[itemId="allCount"]' );
		var allUnread = msgCenterAlertSummaryInfo.down( 'panel[itemId="infoSummaryLowerPanel"] panel label[itemId="allUnread"]' );

		var dataStore = msgCenterAlertGrid.store;
		dataStore.on( 'load', function( store, records )
		{
			var i = records.length - 1;
			if( i >= 0 )
			{
				allCount.setText(records[i].get('AllCount'));
				allUnread.setText(records[i].get('AllUnread') );
			}
			else
			{
				allCount.setText( "" );
				allUnread.setText( "" );
			}
		} );
	},
	getQuickFilterQueryJson : function() {
		var me = this;
		var typeFilterVal = me.typeFilterVal;
		var statusFilterVal=me.statusFilterVal;
		var typeFilterDesc = me.typeFilterDesc;
		var actionFilterVal = this.actionFilterVal;
		var jsonArray = [];
		var index = me.dateFilterVal;
		var objDateParams = me.getDateParam(index);
		 if(me.statusFilterVal === 'read')
		{
			statusFilterVal='R'
		}
		else if(me.statusFilterVal === 'unread')
		{
			statusFilterVal='U'
		}
		if(index != '12')
		{
			jsonArray.push({
						paramName : me.getAlertDate().filterParamName,
						paramValue1 : objDateParams.fieldValue1,
						paramValue2 : objDateParams.fieldValue2,
						operatorValue : objDateParams.operator,
						dataType : 'D'
			});
		}
		
   
		if (statusFilterVal != null && statusFilterVal.toUpperCase()!= "ALL" && statusFilterVal != '') {
			jsonArray.push({
						paramName : 'type',
						paramValue1 : statusFilterVal,
						operatorValue : 'eq',
						dataType : 'S'
					});
			}
		if (typeFilterVal != null && typeFilterVal.toUpperCase() != "ALL" && typeFilterVal !="read" && typeFilterVal!="unread") {
			jsonArray.push({
						paramName : 'eventType',
						paramValue1 : typeFilterVal,
						operatorValue : 'eq',
						dataType : 'S'
					});
			}
		return jsonArray;
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
		maskArray.push(buttonMask);
		for (var index = 0; index < selectedRecords.length; index++) {
			objData = selectedRecords[index];
			maskArray.push(objData.get('__metadata').__rightsMap);
			if (objData.raw.makerId === USER) {
				isSameUser = false;
			}
		}
		actionMask = doAndOperation(maskArray, 10);
		
		me.enableDisableGroupActions(actionMask, isSameUser);
	},
	enableDisableGroupActions : function(actionMask, isSameUser) {
		var actionBar = this.getActionBarSummDtl();
		var blnEnabled = false, strBitMapKey = null, arrItems = new Array();
		if (!Ext.isEmpty(actionBar) && !Ext.isEmpty(actionBar.items.items)) {
			arrItems = actionBar.items.items;
			Ext.each(arrItems, function(item) {
						strBitMapKey = parseInt(item.maskPosition,10) - 1;
						if (strBitMapKey) {
							blnEnabled = isActionEnabled(actionMask,
									strBitMapKey);
							if ((item.maskPosition === 6 && blnEnabled)) {
								blnEnabled = blnEnabled && isSameUser;
							} else if (item.maskPosition === 7 && blnEnabled) {
								blnEnabled = blnEnabled && isSameUser;
							}else if (item.maskPosition === 8 && blnEnabled) {
								blnEnabled = blnEnabled && isSameUser;
							}
							item.setDisabled(!blnEnabled);
						}
					});
		}
	},
	searchTrasactionChange : function() {
		var me = this;
		var searchValue = me.getSearchTxnTextInput().value;
		var anyMatch = me.getMatchCriteria().getValue();
		if ('anyMatch' === anyMatch.searchOnPage) {
			anyMatch = false;
		} else {
			anyMatch = true;
		}

		var grid = me.getMsgCenterAlertGrid();
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
		}
		return retValue;
	},
	isRowMoreMenuVisible : function(store, record, jsonData, itmId, menu) {
		var me = this;
		if (!Ext.isEmpty(record.get('isEmpty'))
				&& record.get('isEmpty') === true)
			return false;
		var arrMenuItems = null;
		var isMenuVisible = false;
		var blnRetValue = true;
		if (!Ext.isEmpty(menu.items) && !Ext.isEmpty(menu.items.items))
			arrMenuItems = menu.items.items;

		if (!Ext.isEmpty(arrMenuItems)) {
			for (var a = 0; a < arrMenuItems.length; a++) {
				blnRetValue = me.isRowIconVisible(store, record, jsonData,
						itmId, arrMenuItems[a].maskPosition);
				isMenuVisible = (isMenuVisible || blnRetValue) ? true : false;
			}
		}
		return isMenuVisible;
	},
	getColumns : function(arrColsPref, objWidthMap) {

		var me = this;
		var arrCols = new Array(), objCol = null, cfgCol = null;
		arrCols.push(me.createActionColumn());
		if (!Ext.isEmpty(arrColsPref)) {
			for (var i = 0; i < arrColsPref.length; i++) {
				objCol = arrColsPref[i];
				cfgCol = {};
				cfgCol.colHeader = objCol.colHeader;
				cfgCol.colId = objCol.colId;
				cfgCol.hidden = objCol.hidden;
				cfgCol.locked = objCol.locked;
				if (!Ext.isEmpty(objCol.colType)) {
					cfgCol.colType = objCol.colType;
					if (cfgCol.colType === "number")
						cfgCol.align = 'right';
				}
				
				cfgCol.width = !Ext.isEmpty( objCol.width ) ? objCol.width : 120;
				if(cfgCol.width === 120)
					cfgCol.width = !Ext.isEmpty( objWidthMap[ objCol.colId ] ) ? objWidthMap[ objCol.colId ] : 120;
				cfgCol.fnColumnRenderer = me.columnRenderer;
				arrCols.push(cfgCol);
			}
		}
		return arrCols;
	},
	columnRenderer : function(value, meta, record, rowIndex, colIndex, store,
			view, colId) {
		var me=this;
		var strRetValue = "";
		if(record.get('status')=="U" ||record.get('status')=="N"){
		    meta.style = 'font-weight: bold !important;'
		}
		strRetValue = value;
		return strRetValue;
	},
	createActionColumn : function() {
		var me = this;
		var objActionCol = {
			colType : 'actioncontent',
			colId : 'action',
			width : 35,
			align : 'right',
			locked : true,
			items : [{
						itemId  : 'btnView',
						itemCls : 'grid-row-action-icon icon-view',
						toolTip : getLabel('viewToolTip', 'View Record'),
						maskPosition : 1
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
	setInfoTooltip : function() {
		var me = this;
		var infotip = Ext.create('Ext.tip.ToolTip', {
					target : 'msgCenterAlertFilterView-1020_header_hd-textEl',
					listeners : {
						// Change content dynamically depending on which element
						// triggered the show.
						beforeshow : function(tip) {
							var paymentTypeVal = '';
							var paymentActionVal = '';
							var dateFilter = me.dateFilterLabel;

							if (me.typeFilterVal == 'all' && me.filterApplied == 'ALL') {
								paymentTypeVal = 'All';
								me.showAdvFilterCode = null;
							} else {
								paymentTypeVal = me.typeFilterVal;
							}

							if (me.actionFilterVal == 'all') {
								paymentActionVal = 'All';
							} else {
								paymentActionVal = me.actionFilterVal;
							}
							if (!Ext
									.isEmpty(me.subscriptionTypeVal)
									&& "all" != me.subscriptionTypeVal) {
								if (me.subscriptionTypeVal == 'S')
									type = getLabel(
											'standard',
											'Standard');
								else
									type = getLabel(
											'custom',
											'Custom');
							} else {
								type = getLabel('all',
										'All');
							}

							tip.update(getLabel(
									"status", "Status")
									+ ' : '
									+ paymentTypeVal
									+ '<br/>'
									+ getLabel("alertDate",
											"Alert Date")
									+ ' : '
									+ dateFilter
									+ '<br/>'
									+ getLabel(
											"event",
											"Event")
									+ ' : ' + paymentActionVal);
						}
					}
				});
	},
	toggleSavePrefrenceAction : function(isVisible) {
		var me = this;
		var btnPref = me.getBtnSavePreferences();
		if (!Ext.isEmpty(btnPref))
			btnPref.setDisabled(!isVisible);

	},
	updateDateFilterView : function() {
		var me = this;
		var dtEntryDate = null;
		if (!Ext.isEmpty(me.dateFilterVal)) {
			me.handleDateChange(me.dateFilterVal);
			if (me.dateFilterVal === '7') {
				if (!Ext.isEmpty(me.dateFilterFromVal)) {
					dtEntryDate = Ext.Date.parse(me.dateFilterFromVal, "Y-m-d");
					me.getFromAlertDate().setValue(dtEntryDate);
				}
				if (!Ext.isEmpty(me.dateFilterToVal)) {
					dtEntryDate = Ext.Date.parse(me.dateFilterToVal, "Y-m-d");
					me.getToAlertDate().setValue(dtEntryDate);
				}
			}
		}

	},
	handleDateChange : function(index) {
		var me = this;
		var fromDateLabel = me.getFromDateLabel();
		var toDateLabel = me.getToDateLabel();
		var objDateParams = me.getDateParam(index);
		if (index == '7') {
			me.getDateRangeComponent().show();
			me.getFromDateLabel().hide();
			me.getToDateLabel().hide();
		}else if(index == '12'){
			me.getDateRangeComponent().hide();
			me.getFromDateLabel().hide();
			me.getToDateLabel().hide();
		}else {
			me.getDateRangeComponent().hide();
			me.getFromDateLabel().show();
			me.getToDateLabel().show();
		}

		if (!Ext.isEmpty(me.dateFilterLabel)) {
			me.getDateLabel().setText(getLabel('date', 'Alert Date') + "("
					+ me.dateFilterLabel + ")");
		}
		if (index !== '7' && index !== '12') {
			var vFromDate = Ext.util.Format.date(Ext.Date.parse(
							objDateParams.fieldValue1, 'Y-m-d'),
					strExtApplicationDateFormat);
			var vToDate = Ext.util.Format.date(Ext.Date.parse(
							objDateParams.fieldValue2, 'Y-m-d'),
					strExtApplicationDateFormat);
			if (index === '1' || index === '2') {
				fromDateLabel.setText(vFromDate);
				toDateLabel.setText("");
			} else {
				fromDateLabel.setText(vFromDate + " - ");
				toDateLabel.setText(vToDate);
			}
		}
	},
	getDateParam : function(index) {
		var me = this;
		var objDateHandler = me.getDateHandler();
		var strAppDate = dtApplicationDate;
		var dtFormat = strExtApplicationDateFormat;
		var date = new Date(Ext.Date.parse(strAppDate, dtFormat));
		var strSqlDateFormat = 'Y-m-d';
		var strSqlDateTimeFormat = 'Y-m-d h:i:s';
		var dateTime = new Date(Ext.Date.parse(dtApplicationDateTime, strSqlDateTimeFormat));
		var fieldValue1 = '', fieldValue2 = '', operator = '';
		var retObj = {};
		var dtJson = {};
		switch (index) {
			case '1' :
				// Today
				fieldValue1 = Ext.Date.format(date, strSqlDateFormat);
				fieldValue2 = fieldValue1;
				operator = 'eq';
				break;
			case '2' :
				// Yesterday
				fieldValue1 = Ext.Date.format(objDateHandler
								.getYesterdayDate(date), strSqlDateFormat);
				fieldValue2 = fieldValue1;
				operator = 'eq';
				break;
			case '3' :
				// This Week
				dtJson = objDateHandler.getThisWeekStartAndEndDate(date);
				fieldValue1 = Ext.Date.format(dtJson.fromDate, strSqlDateFormat);
				fieldValue2 = Ext.Date.format(dtJson.toDate, strSqlDateFormat);
				operator = 'bt';
				break;
			case '4' :
				// Last Week
				dtJson = objDateHandler.getLastWeekStartAndEndDate(date);
				fieldValue1 = Ext.Date.format(dtJson.fromDate, strSqlDateFormat);
				fieldValue2 = Ext.Date.format(dtJson.toDate, strSqlDateFormat);
				operator = 'bt';
				break;
			case '5' :
				// This Month
				dtJson = objDateHandler.getThisMonthStartAndEndDate(date);
				fieldValue1 = Ext.Date.format(dtJson.fromDate, strSqlDateFormat);
				fieldValue2 = Ext.Date.format(dtJson.toDate, strSqlDateFormat);
				operator = 'bt';
				break;
			case '6' :
				// Last Month
				dtJson = objDateHandler.getLastMonthStartAndEndDate(date);
				fieldValue1 = Ext.Date.format(dtJson.fromDate, strSqlDateFormat);
				fieldValue2 = Ext.Date.format(dtJson.toDate, strSqlDateFormat);
				operator = 'bt';
				break;
			case '7' :
				// Date Range
				var frmDate = me.getFromAlertDate().getValue();
				var toDate = me.getToAlertDate().getValue();
				fieldValue1 = Ext.Date.format(frmDate, strSqlDateFormat);
				fieldValue2 = Ext.Date.format(toDate, strSqlDateFormat);
				operator = 'bt';
				break;
			case '8':
				// This Quarter
				dtJson = objDateHandler.getQuarterToDate( date );
				fieldValue1 = Ext.Date.format( dtJson.fromDate, strSqlDateFormat );
				fieldValue2 = Ext.Date.format( dtJson.toDate, strSqlDateFormat );
				operator = 'bt';
				break;
			case '9':
				// Last Quarter To Date
				dtJson = objDateHandler.getLastQuarterToDate( date );
				fieldValue1 = Ext.Date.format( dtJson.fromDate, strSqlDateFormat );
				fieldValue2 = Ext.Date.format( dtJson.toDate, strSqlDateFormat );
				operator = 'bt';
				break;
			case '10':
				// This Year
				dtJson = objDateHandler.getYearToDate( date );
				fieldValue1 = Ext.Date.format( dtJson.fromDate, strSqlDateFormat );
				fieldValue2 = Ext.Date.format( dtJson.toDate, strSqlDateFormat );
				operator = 'bt';
				break;
			case '11':
				// Last Year To Date
				dtJson = objDateHandler.getLastYearToDate( date );
				fieldValue1 = Ext.Date.format( dtJson.fromDate, strSqlDateFormat );
				fieldValue2 = Ext.Date.format( dtJson.toDate, strSqlDateFormat );
				operator = 'bt';
				break;
			case '12':
				break;
		}
		retObj.fieldValue1 = fieldValue1;
		retObj.fieldValue2 = fieldValue2;
		retObj.operator = operator;
		return retObj;
	},
	onMsgCenterAlertGridInformationViewRender : function() {
		var me = this;
		var accSummInfoViewRef = me.getMsgCenterAlertGridInformationView();
		accSummInfoViewRef.createSummaryLowerPanelView();
	},
	updateFilterConfig : function() {
		var me = this;
		var arrJsn = new Array();
		var objDateLbl = {
				'12' : getLabel( 'latest', 'Latest' ),
				'1' : getLabel( 'today', 'Today' ),
                '2' : getLabel( 'yesterday', 'Yesterday' ),
                '3' : getLabel( 'thisweek', 'This Week' ),
                '4' : getLabel( 'lastweek', 'Last Week To Date' ),
                '5' : getLabel( 'thismonth', 'This Month' ),
                '6' : getLabel( 'lastmonth', 'Last Month To Date' ),
                '7' : getLabel( 'daterange', 'Date Range' ),
                '8' : getLabel( 'thisquarter', 'This Quarter' ),
                '9' : getLabel( 'lastQuarterToDate', 'Last Quarter To Date' ),
                '10' : getLabel( 'thisyear', 'This Year' ),
                '11' : getLabel( 'lastyeartodate', 'Last Year To Date' )
		};
		if (!Ext.isEmpty(objGridViewFilter)) {
			var data = Ext.decode(objGridViewFilter);


			var strDtValue = data.quickFilter.alertDate;
			var strDtFrmValue = data.quickFilter.alertDateFrom;
			var strDtToValue = data.quickFilter.alertDateTo;
			var strPaymentType = data.quickFilter.paymentType;
			var strPaymentAction=data.quickFilter.paymentAction;
			filterPanelCollapsed = !Ext.isEmpty(data.filterPanelCollapsed) ? data.filterPanelCollapsed : true;
			infoPanelCollapsed = !Ext.isEmpty(data.infoPanelCollapsed) ? data.infoPanelCollapsed : true;

			if (!Ext.isEmpty(strDtValue)) {
				me.dateFilterLabel = objDateLbl[strDtValue];
				me.dateFilterVal = strDtValue;
				if (strDtValue === '7') {
					if (!Ext.isEmpty(strDtFrmValue))
						me.dateFilterFromVal = strDtFrmValue;

					if (!Ext.isEmpty(strDtToValue))
						me.dateFilterToVal = strDtToValue;
				}
				me.typeFilterVal = !Ext.isEmpty(strPaymentType)
						? strPaymentAction
						: 'all';
				me.statusFilterVal = !Ext.isEmpty(strPaymentType)
						? strPaymentType
						: 'all';			
			}

		}
		if (!Ext.isEmpty(me.dateFilterVal)) {
			var strVal1 = '', strVal2 = '', strOpt = 'eq';
			if (me.dateFilterVal !== '7') {
				var dtParams = me.getDateParam(me.dateFilterVal);
				if (!Ext.isEmpty(dtParams)
						&& !Ext.isEmpty(dtParams.fieldValue1)) {
					strOpt = dtParams.operator;
					strVal1 = dtParams.fieldValue1;
					strVal2 = dtParams.fieldValue2;
				}
			} else {
				if (!Ext.isEmpty(me.dateFilterVal)
						&& !Ext.isEmpty(me.dateFilterFromVal)) {
					strVal1 = me.dateFilterFromVal;

					if (!Ext.isEmpty(me.dateFilterToVal)) {
						strOpt = 'bt';
						strVal2 = me.dateFilterToVal;
					}
				}
			}
			if(me.dateFilterVal != '12')
			{
				arrJsn.push({
							paramName : 'alertDate',
							paramValue1 : strVal1,
							paramValue2 : strVal2,
							operatorValue : strOpt,
							dataType : 'D'
						});
			}
		}
		
		me.filterData = arrJsn;
	},
	updateAdvFilterConfig : function()
	{
		var me = this;
		if( !Ext.isEmpty( objGridViewFilter ) )
		{
			var data = Ext.decode( objGridViewFilter );
			if( !Ext.isEmpty( data.advFilterCode ) )
			{
				me.showAdvFilterCode = data.advFilterCode;
				me.savePrefAdvFilterCode = data.advFilterCode;
				var strUrl = 'userfilters/msgcenteralert/{0}.srvc';
				strUrl = Ext.String.format( strUrl, data.advFilterCode );
				Ext.Ajax.request(
				{
					url : strUrl ,
					headers: objHdrCsrfParams,
					async : false,
					method : 'GET',
					success : function( response )
					{
						var responseData = Ext.decode( response.responseText );
						var applyAdvFilter = false;
						me.populateSavedFilter( data.advFilterCode, responseData, applyAdvFilter );
						var objOfCreateNewFilter = me.getCreateNewFilter();
						var objJson = objOfCreateNewFilter.getAdvancedFilterQueryJson( objOfCreateNewFilter );

						me.advFilterData = objJson;
						this.advFilterCodeApplied = data.advFilterCode;
						me.savePrefAdvFilterCode = '';
						me.filterApplied = 'A';
					},
					failure : function()
					{
						var errMsg = "";
						Ext.MessageBox.show(
						{
							title : getLabel( 'errorTitle', 'Error' ),
							msg : getLabel( 'investCenterErrorPopUpMsg', 'Error while fetching data..!' ),
							buttons : Ext.MessageBox.OK,
							cls : 'ux_popup',
							icon : Ext.MessageBox.ERROR
						} );
					}
				} );
			}
		}
	},
	generateUrlWithQuickFilterParams : function(me) {

		var filterData = me.filterData;
		var isFilterApplied = false;
		var strFilter = '&$filter=';
		var strTemp = '';
		var strFilterParam = '';
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
		if (isFilterApplied)
			strFilter = strFilter + strTemp;
		else
			strFilter = '';
		return strFilter;
	},
	handleSavePreferences : function() {
		var me = this;
		me.savePreferences();
	},
	handleClearPreferences : function() {
		var me = this;
		var preferenceHandler = Ext.create('Ext.ux.gcp.PreferencesHandler');
		preferenceHandler.clearPagePreferences('msgcenteralert', null,
				 me.postHandleClearPreferences, null, me, true);
	},
	postHandleClearPreferences : function(data, args, isSuccess) {
		var me = this;
		if (isSuccess === 'Y') {
			me.toggleSavePrefrenceAction(true);
			me.toggleClearPrefrenceAction(false);
		} else {
			me.toggleClearPrefrenceAction(true);
		}
	},
	toggleClearPrefrenceAction : function(isVisible) {
		var me = this;
		var btnPref = me.getBtnClearPreferences();
		if (!Ext.isEmpty(btnPref))
			btnPref.setDisabled(!isVisible);
	},
	savePreferences : function() {
		var me = this, objPref = {}, arrCols = null, objCol = null;
		var strUrl = me.urlGridPref;
		var grid = me.getMsgCenterAlertGrid();
		//var arrColPref = new Array();
		var gridState=grid.getGridState();
		var arrPref = new Array();
		if (!Ext.isEmpty(grid)) {
			//arrCols = grid.getView().getGridColumns();
			//for (var j = 0; j < arrCols.length; j++) {
			//	objCol = arrCols[j];
			//	if (!Ext.isEmpty(objCol) && !Ext.isEmpty(objCol.itemId)
			//			&& objCol.itemId.startsWith('col_')
			//			&& !Ext.isEmpty(objCol.xtype)
			//			&& objCol.xtype !== 'actioncolumn')
			//		arrColPref.push({
			//					colId : objCol.dataIndex,
			//					colDesc : objCol.text
			//				});

			//}
			objPref.pgSize = gridState.pageSize;
			objPref.gridCols = gridState.columns;
			objPref.sortState = gridState.sortState;
			arrPref.push(objPref);
		}

		if (arrPref)
			Ext.Ajax.request({
						url :  strUrl+'?'+csrfTokenName+'='+csrfTokenValue,
						method : 'POST',
						jsonData : Ext.encode(arrPref),
						success : function(response) {
							var responseData = Ext
									.decode(response.responseText);
							var isSuccess;
							var title, strMsg, imgIcon;
							if (responseData.d.preferences
									&& responseData.d.preferences.success)
								isSuccess = responseData.d.preferences.success;
							if (isSuccess && isSuccess === 'N') {
								if (!Ext.isEmpty(me.getBtnSavePreferences()))
									me.getBtnSavePreferences()
											.setDisabled(false);
								title = getLabel('SaveFilterPopupTitle',
										'Message');
								strMsg = responseData.d.preferences.error.errorMessage;
								imgIcon = Ext.MessageBox.ERROR;
								Ext.MessageBox.show({
											title : title,
											msg : strMsg,
											width : 200,
											buttons : Ext.MessageBox.OK,
											cls : 'ux_popup',
											icon : imgIcon
										});

							} else
								me.saveFilterPreferences();
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
										cls : 'ux_popup',
										icon : Ext.MessageBox.ERROR
									});
						}
					});

	},
	saveFilterPreferences : function() {
		var me = this;
		var strUrl = me.urlGridFilterPref;
		var advFilterCode = null;
		var objFilterPref = {};
		var infoPanel = me.getMsgCenterAlertGridInformationView();
		var filterViewCollapsed = (me.getMsgCenterAlertFilterView().getCollapsed() === false) ? false : true; 
		var infoViewCollapsed = infoPanel.down('image[itemId="summInfoShowHideGridView"]').hasCls("icon_expand_summ");
		if (!Ext.isEmpty(me.savePrefAdvFilterCode)) {
			advFilterCode = me.savePrefAdvFilterCode;
		}
		var objQuickFilterPref = {};
		objQuickFilterPref.paymentType = me.typeFilterVal;
		objQuickFilterPref.paymentAction = me.actionFilterVal;
		objQuickFilterPref.alertDate = me.dateFilterVal;
		if (me.dateFilterVal === '7') {
			if(!Ext.isEmpty(me.dateFilterFromVal) && !Ext.isEmpty(me.dateFilterToVal)){
				
				objQuickFilterPref.alertDateFrom = me.dateFilterFromVal;
				objQuickFilterPref.alertDateTo = me.dateFilterToVal;
				}
				else
				{
							var strSqlDateFormat = 'Y-m-d';
							var frmDate = me.getFromAlertDate().getValue();
							var toDate = me.getToAlertDate().getValue();
							fieldValue1 = Ext.util.Format.date(frmDate, 'Y-m-d');
							fieldValue2 = Ext.util.Format.date(toDate, 'Y-m-d');
					   objQuickFilterPref.alertDateFrom = fieldValue1;
					   objQuickFilterPref.alertDateTo = fieldValue2;
				}
		}

		objFilterPref.advFilterCode = advFilterCode;
		objFilterPref.quickFilter = objQuickFilterPref;
		objFilterPref.filterPanelCollapsed = filterViewCollapsed;
		objFilterPref.infoPanelCollapsed = infoViewCollapsed;

		if (objFilterPref)
			Ext.Ajax.request({
						url : strUrl+'?'+csrfTokenName+'='+csrfTokenValue,
						method : 'POST',
						jsonData : Ext.encode(objFilterPref),
						success : function(response) {
							var data = Ext.decode(response.responseText);
							var title = getLabel('SaveFilterPopupTitle',
									'Message');
							if (data.d.preferences
									&& data.d.preferences.success === 'Y') {
								Ext.MessageBox.show({
											title : title,
											msg : getLabel('prefSavedMsg',
													'Preferences Saved Successfully'),
											buttons : Ext.MessageBox.OK,
											cls : 'ux_popup',
											icon : Ext.MessageBox.INFO
										});
							} else if (data.d.preferences
									&& data.d.preferences.success === 'N'
									&& data.d.error
									&& data.d.error.errorMessage) {
								if (!Ext.isEmpty(me.getBtnSavePreferences()))
									me.toggleSavePrefrenceAction(true);
								Ext.MessageBox.show({
											title : title,
											msg : data.d.error.errorMessage,
											buttons : Ext.MessageBox.OK,
											cls : 'ux_popup',
											icon : Ext.MessageBox.ERROR
										});
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
										cls : 'ux_popup',
										icon : Ext.MessageBox.ERROR
									});
						}
					});
	},
	handleType : function(btn)
	{
		var me = this;
		var msgLabel = me.getStrMsgLabel();
		me.toggleSavePrefrenceAction( true );
		me.getMsgCenterAlertTypeToolBar().items.each( function( item )
		{
			item.removeCls( 'xn-custom-heighlight' );
			item.addCls( 'xn-account-filter-btnmenu' );
		} );
		btn.addCls( 'xn-custom-heighlight xn-account-filter-btnmenu' );
		if(btn.code !== null && btn.btnDesc === 'eventDescId')
		{
			me.typeFilterVal = btn.code;
		     me.typeFilterDesc = btn.btnDesc;
		}
	
		me.statusFilterVal=btn.code;
		me.setDataForFilter();
		if(me.typeFilterDesc !== null && me.typeFilterDesc === 'eventDescId')
		{
			msgLabel.setText(me.typeFilterVal);
			msgLabel.addCls('xn-custom-heighlight xn-account-filter-btnmenu');
		}
		if(me.statusFilterVal === 'all' || me.statusFilterVal === 'All')
		{
			me.filterApplied = 'ALL';
			me.applyFilter();
		}
		else if(me.statusFilterVal === 'read')
		{
			me.applyTypeFilter(me.statusFilterVal);
		}
		else if(me.statusFilterVal === 'unread')
		{
			me.applyTypeFilter(me.statusFilterVal);
		}
		else
		{
			me.filterApplied = 'Q';
			me.applyFilter();
		}
		
	},
	applyTypeFilter : function(typeFilterVal)
	{
		var me = this;
		var grid = me.getMsgCenterAlertGrid();
		if(typeFilterVal === 'read')
		{
			var strUrl = 'msgCenterAlertType.srvc?$type='+typeFilterVal+'&$filter='+'&'+csrfTokenName+'='+csrfTokenValue;
		}else if(typeFilterVal === 'unread'){
			var strUrl = 'msgCenterAlertType.srvc?$type='+typeFilterVal+'&$filter='+'&'+csrfTokenName+'='+csrfTokenValue;
		}
		me.getMsgCenterAlertGrid().setLoading(true);
		grid.loadGridData(strUrl, me.handleAfterGridDataLoad, null);
	},
	closeViewInfoPopup : function(btn){
		var me = this;
		me.getMsgCenterAlertViewInfoRef().close();
	},
	setEventComboListVal : function(panel)
	{
		var me = this;
		var eventCodesFilterRef = me.getMsgCenterAlertFilterView();
		var strUrl = 'eventCodes.srvc?'; 
		strUrl = strUrl+'$filter='+'&'+csrfTokenName+'='+csrfTokenValue;
		Ext.Ajax.request(
		{
			url : strUrl,
			method : 'POST',
			params :
			{
				csrfTokenName : tokenValue
			},
			success : function( response )
			{
				var data = Ext.decode( response.responseText );
				if (!Ext.isEmpty(data)) 
				{
					me.createEventCodeList(data.d.msgCenterAlert);
				}
			},
			failure : function( response )
			{
				console.log( 'Bad : Something went wrong with your request' );
			}
		} );
	},
	createEventCodeList : function(jsonData) {
		var me=this;
		var objTbar = me.getMsgEventPanel();
		var infoArray = this.createEventMenuList(jsonData,me);
		objTbar.add({
						xtype : 'label',
						itemId : 'dateLabel',
						text : getLabel('event', 'Event'),
						cls : 'ux_font-size14 ux_padding0060',
						flex : 1
					},{
						xtype : 'button',
						border : 0,
						filterParamName : 'event',
						itemId : 'eventCodeCombo',// Required
						cls : 'menu-disable xn-custom-arrow-button cursor_pointer',
						glyph : 'xf0d7@fontawesome',
						menu  : Ext.create('Ext.menu.Menu', { 
							items : infoArray
						})
				})
	},
	createEventMenuList : function(jsonData,me) {
		var infoArray = new Array();
		infoArray.push({
			text : getLabel('labelAll', 'All'),
			btnId : 'btnAll',
			btnValue : 'All',
			code : 'All',
			btnDesc : 'eventDescId',
			parent : this,
			handler : function( btn, opts )
			{
				me.handleType(btn);
			}
		});
		if(jsonData)
		{
			for (var i = 0; i < jsonData.length; i++) 
			{ 
				infoArray.push({
					text : getLabel( 'label'+i, jsonData[i].eventDesc ),
					btnId : 'btn'+jsonData[i].eventDesc,
					btnValue : i,
					code : jsonData[i].eventDesc,
					btnDesc : 'eventDescId',
					parent : this,
					handler : function( btn, opts )
					{
						me.handleType(btn);
					}
				});
			}
		}
		return infoArray;
	}
	
});