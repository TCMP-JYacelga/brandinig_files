Ext.define('GCP.controller.MsgCenterAlertController', {
	extend : 'Ext.app.Controller',
	requires : ['Ext.ux.gcp.DateHandler','Ext.ux.gcp.PreferencesHandler'],
	views : ['GCP.view.MsgCenterAlertView','GCP.view.MsgCenterAlertGroupView','GCP.view.MsgCenterAlertViewPopUp'],
	/**
	 * Array of configs to build up references to views on page.
	 */
	refs : [{
				ref : 'msgCenterAlertView',
				selector : 'msgCenterAlertView'
			},
			{
				ref : 'msgCenterAlertGroupView',
				selector : 'msgCenterAlertView msgCenterAlertGroupView'
			},
			{
				ref : 'groupView',
				selector : 'msgCenterAlertGroupView groupView'
			},			
			{
				ref : 'msgCenterAlertFilterView',
				selector : 'msgCenterAlertFilterView'
			},			
			{
				ref : 'dateLabel',
				selector : 'msgCenterAlertFilterView label[itemId="eventDateLabel"]'
			},
			{
				ref : 'filterView',
				selector : 'filterView'
			}
			],
	config : {
		filterData : [],
		advFilterData : [],
		typeFilterVal : 'Select',
		filterApplied : 'ALL',
		showAdvFilterCode : null,
		actionFilterVal : 'all',
		actionFilterDesc : 'all',
		typeFilterDesc : 'all',
		dateFilterVal : '12',
		dateFilterFromVal : '',
		dateFilterToVal : '',
		datePickerSelectedDate : [],
		dateFilterLabel : getLabel('lblLatest', 'Latest'),
		dateHandler : null,
		urlGridPref : 'userpreferences/msgcenteralert/gridView.srvc',
		strCommonPrefUrl : 'services/userpreferences/msgcenteralert.json',
		urlGridFilterPref : 'userpreferences/msgcenteralert/gridViewFilter.srvc',
		strGetModulePrefUrl : 'services/userpreferences/msgcenteralert/{0}.json',
		objViewInfoPopup : null,
		strDefaultMask : '0000000000',
		preferenceHandler : null,
		arrSorter:[],
		strPageName : 'msgcenteralert'
	},
	/**
	 * A template method that is called when your application boots. It is
	 * called before the Application's launch function is executed so gives a
	 * hook point to run any code before your Viewport is created.
	 */
	init : function() {
		var me = this;		
		this.dateHandler = Ext.create( 'Ext.ux.gcp.DateHandler' );
		$(document).on('savePreference', function(event) {					
			me.handleSavePreferences();
		});
		$(document).on('handleClientChangeInQuickFilter',function(event,isSessionClientFilter) {
			me.handleClientChangeInQuickFilter();
		});
		$(document).on('clearPreference', function(event) {
			me.handleClearPreferences();
		});
		$(document).on('performPageSettings', function(event) {
			me.showPageSettingPopup('PAGE');
			});
		
		me.updateFilterConfig();		
		me.control({
			'msgCenterAlertView' : {
				beforerender : function(panel, opts) {
				},
				afterrender : function(panel, opts) {
				}
			},'pageSettingPopUp' : {
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
			'filterView' : {
				appliedFilterDelete : function(btn){
					me.handleAppliedFilterDelete(btn);
				}
			},
			'msgCenterAlertGroupView groupView' : {
				'groupByChange' : function(menu, groupInfo) {
					// me.doHandleGroupByChange(menu, groupInfo);
				},
				'groupTabChange' : function(groupInfo, subGroupInfo, tabPanel,
						newCard, oldCard) {					
					me.doHandleGroupTabChange(groupInfo, subGroupInfo,
							tabPanel, newCard, oldCard);
					me.setGridInfoSummary();
				},
				'gridRender' : function(groupInfo, subGroupInfo, grid, url, pgSize,
							newPgNo, oldPgNo, sorter, filterData) {					
						me.doHandleLoadGridData(groupInfo, subGroupInfo, grid, url, pgSize,
							newPgNo, oldPgNo, sorter, filterData);
						me.setGridInfoSummary();
				},				
				'gridPageChange' : me.doHandleLoadGridData,
				'gridSortChange' : me.doHandleLoadGridData,
				'gridPageSizeChange' : me.doHandleLoadGridData,
				'gridColumnFilterChange' : me.doHandleLoadGridData,
				'gridRowSelectionChange' : me.doHandleGridRowSelectionChange,
				'gridStateChange' : function(grid) {					
				},
				'gridRowActionClick' : function(grid, rowIndex, columnIndex,
						actionName, record) {
					me.doHandleRowActions(actionName, grid, record);
				},
				'groupActionClick' : function(actionName, isGroupAction,
						maskPosition, grid, arrSelectedRecords) {
					if (isGroupAction === true)
						me.doHandleGroupActions(actionName, grid,
								arrSelectedRecords, 'groupAction');
				},
				'gridSettingClick' : function(){
					me.showPageSettingPopup('GRID');
				}
			},
			'msgCenterAlertFilterView' : {
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
				render : function(panel, opts) {
					me.setGridInfoSummary();					
				},
				/*afterrender : function( panel, opts )
				{
					me.handleDateChange(me.dateFilterVal);
				},*/
				handleSavedEventItemClick : function(combo) {
					me.handleSavedEventItemClick(combo);
					me.setGridInfoSummary();
				},
				dateChange : function(btn, opts) {
					me.dateFilterVal = btn.btnValue;
					me.dateFilterLabel = btn.text;
					me.handleDateChange(btn.btnValue);
					this.filterApplied = 'Q';
					if (btn.btnValue !== '7') {
						me.setDataForFilter();
						me.applyQuickFilter();						
					}
					me.setGridInfoSummary();
				}
			},
			'msgCenterAlertFilterView combo[itemId="eventFiltersCombo"]' : {
				afterrender : function(combo, newValue, oldValue, eOpts) {
					if (!Ext.isEmpty(me.typeFilterVal)) {
						combo.setValue(me.typeFilterVal);
					}
				}
			},
			'msgCenterAlertFilterView component[itemId="eventDatePickerQuick"]' : {
				render : function() {
					$('#eventDatePickerQuickText').datepick({
						monthsToShow : 1,
						changeMonth : true,
						changeYear : true,
						rangeSeparator : '  to  ',
						dateFormat : strApplicationDefaultFormat,
						onClose : function(dates) {
							if (!Ext.isEmpty(dates)) {
								me.datePickerSelectedDate = dates;
								me.dateFilterVal = '13';
								me.dateFilterLabel = getLabel('daterange','Date Range');
								me.handleDateChange(me.dateFilterVal);
								me.setDataForFilter();
								me.applyQuickFilter();											
							}
						}
					});
					
					me.dateFilterVal = '12'; // Set to Latest
					me.dateFilterLabel = getLabel('latest', 'Latest');
					me.handleDateChange(me.dateFilterVal);
					me.setDataForFilter();
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

	/*handleSmartGridConfig : function() {
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
				pgSize = !Ext.isEmpty( objPref.pgSize ) ? parseInt( objPref.pgSize ) : 100;
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
	},*/
	doHandleRowActions : function(actionName, objGrid, record) {
		var me = this;		
		if (actionName === 'delete' || actionName === 'unread' || actionName === 'read'){			
			me.doHandleGroupActions(actionName, objGrid, [record], 'rowAction');
		} else if (actionName === 'btnView') {
			me.viewMsgPopUp(record);
		}
	},
	/*Page setting handling starts here*/

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
			} else
				me.preferenceHandler.savePagePreferences(me.strPageName,
						arrPref, me.postHandlePageGridSetting, args, me, false);
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
		me.preferenceHandler.clearPagePreferences(me.strPageName, arrPref,
				me.postHandleRestorePageSetting, null, me, false);
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
						msg : getLabel('errorMsg',
								'Error while apply/restore setting'),
						buttons : Ext.MessageBox.OK,
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
				cls : 't7-popup',
				icon : Ext.MessageBox.ERROR
			});
		}
	},
	showPageSettingPopup : function(strInvokedFrom) {
		var me = this, objData = {}, objGroupView = me.getGroupView(), objPrefData, objGeneralSetting, objGridSetting, objColumnSetting, strTitle = null, subGroupInfo;
		var objGroupByVal = '', objDefaultFilterVal = '', objGridSizeVal = '', objRowPerPageVal = _GridSizeMaster;
		var objSummaryView = me.getMsgCenterAlertGroupView();
		me.pageSettingPopup = null;
		
		objColumnSetting = objSummaryView.getDefaultColumnModel();
		
		if (!Ext.isEmpty(objAlertPref)) {
			objPrefData = Ext.decode(objAlertPref);
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
					: (objSummaryView.getDefaultColumnModel() || '[]');

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
		objData["filterUrl"] = 'services/userfilterslist/' +me.strPageName;
		objData["rowPerPage"] = _AvailableGridSize;
		objData["groupByVal"] = objGroupByVal;
		objData["filterVal"] = objDefaultFilterVal;
		objData["gridSizeVal"] = objGridSizeVal;
		objData["rowPerPageVal"] = objRowPerPageVal;
		subGroupInfo = objGroupView.getSubGroupInfo() || {};
		strTitle = (strInvokedFrom === 'GRID' ? getLabel("columnSettings",
				"Column Settings") + ' : ' + (subGroupInfo.groupDescription||'')  : getLabel("Settings", "Settings"));
		me.pageSettingPopup = Ext.create('Ext.ux.gcp.PageSettingPopUp', {
					cfgPopUpData : objData,
					cfgGroupView : objGroupView,
					cfgDefaultColumnModel : objColumnSetting,
					cfgViewOnly : _IsEmulationMode,
					cfgInvokedFrom : strInvokedFrom,
					cfgGridHeight : 'auto',
					title : strTitle
				});
		me.pageSettingPopup.show();
		me.pageSettingPopup.center();
	},	
	handleAppliedFilterDelete : function(btn){
		var me = this;
		var objData = btn.data;
		var quickJsonData = me.filterData;
		if(!Ext.isEmpty(objData)){
			var paramName = objData.paramName || objData.field;
				reqJsonInQuick = me.findInQuickFilterData(quickJsonData,paramName);
				if (!Ext.isEmpty(reqJsonInQuick)) {
					arrQuickJson = quickJsonData;
					arrQuickJson = me.removeFromQuickArrJson(arrQuickJson,paramName);
					me.filterData = arrQuickJson;
				}
			me.resetFieldInQuickFilterOnDelete(objData);
			me.refreshData();
		}
	},
	doHandleGroupActions : function(strAction, grid, arrSelectedRecords,
			strActionType) {
		var me = this;		
		var strUrl = Ext.String.format( 'MsgCenterAlert/{0}.srvc?',strAction );
		strUrl= strUrl+ csrfTokenName + "=" + csrfTokenValue;
		//var strUrl = Ext.String.format(me.strBatchActionUrl, strAction);
		if (strAction === 'reject') {
			me.showRejectVerifyPopUp(strAction, strUrl, grid,
					arrSelectedRecords, strActionType);

		} else {
			me.preHandleGroupActions(strUrl, '', grid, arrSelectedRecords,
					strActionType, strAction);
		}
	},
	showRejectVerifyPopUp : function(strAction, strActionUrl, grid,
			arrSelectedRecords, strActionType) {
		var me = this;
		var titleMsg = '', fieldLbl = '';
		if (strAction === 'reject') {
			titleMsg = getLabel('instrumentRejectRemarkPopUpTitle',
					'Please Enter Reject Remark');
			fieldLbl = getLabel('instrumentRejectRemarkPopUpFldLbl',
					'Reject Remark');
		}
		var prompt = Ext.Msg.show({
					title : titleMsg,
					msg : fieldLbl,
					buttons : Ext.Msg.OKCANCEL,
					multiline : 4,
					style : {
						height : 400
					},
					bodyPadding : 0,
					fn : function(btn, text) {
						if (btn == 'ok') {
							if (text != '') {
								me.preHandleGroupActions(strActionUrl, text,
										grid, arrSelectedRecords,
										strActionType, strAction);
							} else {
								Ext.MessageBox.show({
											title : getLabel(
													'instrumentErrorPopUpTitle',
													'Error'),
											msg : getLabel(
													'instrumentErrorPopUpMsg',
													'Reject Remarks cannot be blank'),
											buttons : Ext.MessageBox.OK,
											buttonText: {
									            ok: getLabel('btnOk', 'OK')
												}, 
											cls : 'ux_popup',
											icon : Ext.MessageBox.ERROR
										});
							}
						}
					}
				});
		prompt.textArea.inputEl.set({
					maxLength : 255
				});
	},
	preHandleGroupActions : function(strUrl, remark, grid, arrSelectedRecords,
			strActionType, strAction) {
		var me = this;
		var groupView = me.getGroupView();
		if (!Ext.isEmpty(groupView)) {
			var me = this;
			if (!Ext.isEmpty(grid)) {
				var arrayJson = new Array();
				var records = (arrSelectedRecords || []);
				for (var index = 0; index < records.length; index++) {
					arrayJson.push({
								serialNo : grid.getStore()
										.indexOf(records[index])
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
				groupView.setLoading(true);
				Ext.Ajax.request({
							url : strUrl,
							method : 'POST',
							jsonData : Ext.encode(arrayJson),
							success : function(jsonData) {
								var jsonRes = Ext.JSON
										.decode(jsonData.responseText);
								
								var errorMessage = '';
								var record = jsonRes.d.instrumentActions[0].errors;
								if( record != null && record != 'undefined' )
								{
									for(var i=0;i<record.length;i++){
									 errorMessage = errorMessage + record[i].code +' : '+ record[i].errorMessage+"<br/>";
									}
								}

								if('' != errorMessage && null != errorMessage)
								{
								 //Ext.Msg.alert("Error",errorMessage);
									Ext.MessageBox.show({
										title : getLabel('errorTitle','Error'),
										msg : errorMessage,
										buttons : Ext.MessageBox.OK,
										cls : 'ux_popup',
										icon : Ext.MessageBox.ERROR
									});
								}
								
								groupView.setLoading(false);
								me.refreshData();
								if(strAction == 'read')
								{
									updateCount();
								}
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
											cls : 'ux_popup',
											icon : Ext.MessageBox.ERROR
										});
							}
						});
			}
		}
	},
	/*handleRowIconClick : function(grid, rowIndex, columnIndex, btn, event,
			record) {
		var me = this;
		var actionName = btn.itemId;
		if (actionName === 'delete' || actionName === 'unread' || actionName === 'read'){
			me.handleGroupActions(btn, record);
		} else if (actionName === 'btnView') {
			me.viewMsgPopUp(record);
		}
	},*/
	viewMsgPopUp : function(record)
	{
		var me = this;
		var buttonsOpts = {};
		buttonsOpts[btnsArray['okBtn']] = function() {		
			$(this).dialog("close");
		};	
		var date=record.data.eventDt;
		var sTitle = getLabel('ViewAlert', 'View Alert');
		$('#viewAlertPopup').dialog({
			autoOpen : false,
			title : sTitle,
			//maxHeight : 650,
			minHeight : 156,
			maxHeight : 550,
			width : 580,
			modal : true,
			beforeClose : function()
			{
				updateCount();
			}
		});
//		$('#viewAlertPopup').addClass("ux_panel-transparent-background ux_font-size14-normal");
		$('#popup_footer').removeClass("modal-footer");
        $('#popup_close').removeClass("btn");
		$('#subject').text($('#subject').html(record.data.subject).text());
		$('#sent').text(date.toString());
		$('#from').text(record.data.senderMail);
		$('#messageText').addClass("ux_font-size14-normal");
		$('#messageText').html(record.data.messageText.replace(/\n/g, '<br />'));
		$('#viewAlertPopup').dialog("open");
		if(record.get('status')=="U" ||record.get('status')=="N"){
			var strUrl = Ext.String.format( 'MsgCenterAlert/read.srvc?' );
			strUrl= strUrl+ csrfTokenName + "=" + csrfTokenValue;
			var groupView = me.getGroupView();
			var grid = groupView.getGrid();	
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
	/*handleGroupActions : function(strAction, record) {
		var me = this;				
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

	},*/
	applyFilter : function() {
		var me = this;
		var groupView = me.getGroupView();
		var grid = groupView.getGrid();		
		var groupInfo = groupView.getGroupInfo() || '{}';
		var subGroupInfo = groupView.getSubGroupInfo() || {};
		if (!Ext.isEmpty(grid)) {
			var strDataUrl = grid.store.dataUrl;
			var store = grid.store;
			var strUrl = grid.generateUrl(strDataUrl, grid.pageSize, 1, 1,
					store.sorters);
			strUrl = strUrl + me.generateFilterUrl(subGroupInfo, groupInfo)+'&'+csrfTokenName+'='+csrfTokenValue;
			grid.setLoading(true);
			grid.loadGridData(strUrl, me.handleAfterGridDataLoad, null);
		}
	},
	/*getMsgCenterAlertConfiguration : function() {
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
	},*/
	doHandleGroupTabChange : function(groupInfo, subGroupInfo, tabPanel,
			newCard, oldCard) {
		var me = this;
		var objGroupView = me.getGroupView();
		var strModule = '', strUrl = null, args = null, strFilterCode = null;
		groupInfo = groupInfo || {};
		subGroupInfo = subGroupInfo || {};
		if (groupInfo) {
			args = {
				scope : me
			};
			strModule = subGroupInfo.groupCode;
			strUrl = Ext.String.format(me.strGetModulePrefUrl, strModule);
			me.getSavedPreferences(strUrl, me.postHandleDoHandleGroupTabChange,
					args);
		}
	},
	handleSavedEventItemClick : function(combo) {
		var me = this;		
		me.typeFilterVal = combo.getValue();
		me.typeFilterDesc = combo.getRawValue();	
		me.filterApplied = 'Q';
		me.setDataForFilter();
		me.applyQuickFilter();		
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
	postHandleDoHandleGroupTabChange : function(data, args) {
		var me = args.scope;
		var objGroupView = me.getGroupView();
		var objSummaryView = me.getMsgCenterAlertGroupView(), objPref = null, gridModel = null, intPgSize = null;
		var colModel = null, arrCols = null;
		if (data && data.preference) {
			objPref = Ext.decode(data.preference);
			arrCols = objPref.gridCols || null;
			intPgSize = objPref.pgSize || _GridSizeTxn;
			colModel = objSummaryView.getColumnModel(arrCols);
			if (colModel) {
				gridModel = {
					columnModel : colModel,
					pageSize : intPgSize,
					storeModel:{
					  sortState:objPref.sortState
                    }

				};
			}
		}
		objGroupView.reconfigureGrid(gridModel);
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
	removeFromQuickArrJson : function(arr, key) {
		for (var ai, i = arr.length; i--;) {
			if ((ai = arr[i]) && ai.paramName == key) {
				arr.splice(i, 1);
			}
		}
		return arr;
	},resetFieldInQuickFilterOnDelete : function(objData){
		var me = this,strFieldName;
		strFieldName = objData.paramName || objData.field;	
		if(strFieldName=='eventType')
		{	
			me.typeFilterVal = 'Select';
			var eventFiltersCombo = me.getMsgCenterAlertFilterView()
					.down('combo[itemId="eventFiltersCombo"]');
			eventFiltersCombo.setValue(me.typeFilterVal);
		}
		if(strFieldName=='clientCode')
		{	
			selectedFilterClient = null;
			selectedClientDesc = null;
			selectedFilterClientDesc = null;
			var clientFiltersCombo = me.getMsgCenterAlertFilterView()
			.down('combo[itemId="clientCombo"]');
			clientFiltersCombo.setValue(selectedFilterClient);	
		}
		if (strFieldName ==='AlertDate') {
			var datePickerRef = $('#eventDatePickerQuickText');
			me.dateFilterVal = '12';
			me.getDateLabel().setText(getLabel('alertDate', 'Alert Date(Latest)'));
			//datePickerRef.val('');
		}
		
	},
	doHandleLoadGridData : function(groupInfo, subGroupInfo, grid, url, pgSize,
			newPgNo, oldPgNo, sorter, filterData) {
		var me = this;
		var arrOfParseQuickFilter = [];
		var objGroupView = me.getGroupView();
		var buttonMask = me.strDefaultMask;
		objGroupView.handleGroupActionsVisibility(buttonMask);
		var strUrl = grid.generateUrl(url, pgSize, newPgNo, oldPgNo, sorter);
		me.reportGridOrder = strUrl;
		strUrl += me.generateFilterUrl(subGroupInfo, groupInfo)+'&'+csrfTokenName+'='+csrfTokenValue;
		grid.loadGridData(strUrl, null, null, false);
		
		var paramName = 'clientId';
		var reqJsonInQuick = me.findInQuickFilterData(me.filterData, paramName);
		if (!Ext.isEmpty(reqJsonInQuick)) {
			var arrQuickJson = me.filterData;
			me.filterData = me.removeFromQuickArrJson(me.filterData,paramName);
		}

		if(!Ext.isEmpty(me.filterData)){
			if(!Ext.isEmpty(me.filterData) && me.filterData.length >= 1){
				arrOfParseQuickFilter = generateFilterArray(me.filterData);
			}
		}
		
		if(arrOfParseQuickFilter) {
			me.getFilterView().updateFilterInfo(arrOfParseQuickFilter);
		}
		
		grid.on('cellclick', function(tableView, td, cellIndex, record, tr, rowIndex, e) {
			var clickedColumn = tableView.getGridColumns()[cellIndex];
			var columnType = clickedColumn.colType;
			if(Ext.isEmpty(columnType)) {
				var containsCheckboxCss = (clickedColumn.cls.indexOf('x-column-header-checkbox') > -1)
				columnType = containsCheckboxCss ? 'checkboxColumn' : '';
			}
			me.handleGridRowClick(record, grid, columnType);
		});
	},
	
	handleGridRowClick : function(record, grid, columnType) {
		if(columnType !== 'actioncontent' && columnType !== 'checkboxColumn' ){
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
				me.doHandleRowActions(arrVisibleActions[0].itemId, grid, record);
			}
		} else {
		}
	},
	
	/*handleLoadGridData : function(grid, url, pgSize, newPgNo, oldPgNo, sorter) {
		var me = this;
		var strUrl = grid.generateUrl(url, pgSize, newPgNo, oldPgNo, sorter);
		me.setDataForFilter();
		strUrl = strUrl + me.getFilterUrl()+'&'+csrfTokenName+'='+csrfTokenValue;
		grid.loadGridData(strUrl, null);		
	},*/
	applyQuickFilter : function() {
		var me = this;
		var groupView = me.getGroupView();
		var grid = groupView.getGrid();		
		var groupInfo = groupView.getGroupInfo() || '{}';
		var subGroupInfo = groupView.getSubGroupInfo() || {};
		
		me.filterApplied = 'Q';		
		if (!Ext.isEmpty(grid)) {
			var strDataUrl = grid.store.dataUrl;
			var store = grid.store;
			var strUrl = grid.generateUrl(strDataUrl, grid.pageSize, 1, 1,
					store.sorters);
			strUrl = strUrl + me.generateFilterUrl(subGroupInfo, groupInfo)+'&'+csrfTokenName+'='+csrfTokenValue;
			groupView.refreshData();
		}
	},
	setDataForFilter : function() {
		var me = this;		
		if (this.filterApplied === 'Q') {
			this.filterData = this.getQuickFilterQueryJson();
		} 
		if (this.filterApplied === 'ALL') {
			this.advFilterData = [];
			this.filterData = this.getQuickFilterQueryJson();
		} 
	},
	generateFilterUrl : function(subGroupInfo, groupInfo) {
		var me = this;
		var strQuickFilterUrl = '', strAdvancedFilterUrl = '', strUrl = '', isFilterApplied = false;
		var strGroupQuery = (subGroupInfo && subGroupInfo.groupQuery)
				? subGroupInfo.groupQuery
				: '';
		if (me.filterApplied === 'ALL' || me.filterApplied === 'Q') {
			strQuickFilterUrl = me.generateUrlWithQuickFilterParams(me);
			if (!Ext.isEmpty(strQuickFilterUrl)) {
				strUrl += '&$filter=' + strQuickFilterUrl;
				isFilterApplied = true;
			}
		} else if (me.filterApplied === 'A') {
			strAdvancedFilterUrl = me
					.generateUrlWithAdvancedFilterParams(isFilterApplied);
			if (!Ext.isEmpty(strAdvancedFilterUrl)) {
				if (Ext.isEmpty(strUrl)) {
					strUrl = "&$filter=";
				}
				strUrl += strAdvancedFilterUrl;
				isFilterApplied = true;
			}
		}
		if (!Ext.isEmpty(strGroupQuery)) {
			if (!Ext.isEmpty(strUrl))
				strUrl += ' and ' + strGroupQuery;
			else
				strUrl += '&$filter=' + strGroupQuery;
		}
		return strUrl;
	},
	/*getFilterUrl : function() {
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
	},*/
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
	setGridInfoSummary : function( )
	{
		var me = this;
		var allCount = 0, allReadCount = 0, allUnReadCount = 0;
		var groupView = me.getGroupView();
		var grid = groupView.getGrid();
		if (!Ext.isEmpty(grid))
		{
			var dataStore = grid.store;
			dataStore.on( 'load', function( store, records )
			{
				var i = records.length - 1;
				if( i >= 0 )
				{
					if(!Ext.isEmpty(records[ i ].get( 'AllCount' )))
						allCount = records[ i ].get( 'AllCount' );
						
					if(!Ext.isEmpty(records[ i ].get( 'AllRead' )))
						allReadCount = records[ i ].get( 'AllRead' );
					
					if(!Ext.isEmpty(records[ i ].get( 'AllUnread' )))
						allUnReadCount = records[ i ].get( 'AllUnread' );
				}
				
				var summaryData = [
				{			
					"description": "Count",				
					"summaryCount": allCount
				},
				{
					"description": "Read",				
					"summaryCount": allReadCount
				},
				{
					"description": "Unread",				
					"summaryCount": allUnReadCount
				}		
			];
			
			$('#summaryCarousal').carousel({
					data : summaryData,
					titleNode : "description",
					contentRenderer: function(value) {
						return  '#'+ value.summaryCount;
					}								
			});	
			} );
		}
	},
	getQuickFilterQueryJson : function() {
		var me = this;
		var typeFilterVal = me.typeFilterVal;
		var typeFilterDesc = me.typeFilterDesc;
		var actionFilterVal = this.actionFilterVal;
		var jsonArray = [];
		var index = me.dateFilterVal;
		var objDateParams = me.getDateParam(index);
		if(!Ext.isEmpty(index)){
			jsonArray.push({
						paramName : 'AlertDate',
						paramValue1 : objDateParams.fieldValue1,
						paramValue2 : objDateParams.fieldValue2,
						operatorValue : objDateParams.operator,
						dataType : 'D',
						paramIsMandatory : true,
						paramFieldLable : getLabel("alertDate","Alert Date")
			});
		}	
   
		if (typeFilterVal != null && typeFilterVal.toUpperCase() != "SELECT" && typeFilterVal !="read" && typeFilterVal!="unread") {
			jsonArray.push({
						paramName : 'eventType',
						paramValue1 : typeFilterVal,
						operatorValue : 'eq',
						dataType : 'S',
						paramFieldLable : getLabel("event","Event")
					});
			}
		if (selectedFilterClient != null && selectedFilterClient != "all") {
			jsonArray.push({
						paramName : 'clientCode',
						paramValue1 : selectedFilterClient,
						operatorValue : 'eq',
						dataType : 'S',
						paramFieldLable : getLabel("lblcompany", "Company Name")
					});
		}
		return jsonArray;
	},
	doHandleGridRowSelectionChange : function(groupInfo, subGroupInfo, objGrid,
			objRecord, intRecordIndex, arrSelectedRecords, jsonData) {
		var me = this;
		var objGroupView = me.getGroupView();
		var buttonMask = me.strDefaultMask;		
		var maskArray = new Array(), actionMask = '', objData = null;;
		if (!Ext.isEmpty(jsonData) && !Ext.isEmpty(jsonData.d.__buttonMask))
			buttonMask = jsonData.d.__buttonMask;
		maskArray.push(buttonMask);
		for (var index = 0; index < arrSelectedRecords.length; index++) {
			objData = arrSelectedRecords[index];
			maskArray.push(objData.get('__metadata').__rightsMap);
		}
		actionMask = doAndOperation(maskArray, 10);
		objGroupView.handleGroupActionsVisibility(actionMask);
	},
	/*enableValidActionsForGrid : function(grid, record, recordIndex,
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
						strBitMapKey = parseInt(item.maskPosition) - 1;
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
			bitPosition = parseInt(maskPosition) - 1;
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
	},	*/
	handleDateChange : function(index) {
		var me = this;
		var filterView = me.getMsgCenterAlertFilterView();
		var objDateParams = me.getDateParam(index, null);
		var datePickerRef = $('#eventDatePickerQuickText');

		if (!Ext.isEmpty(me.dateFilterLabel)) {
			me.getDateLabel().setText(getLabel('alertDate', 'Alert Date') + " ("
					+ me.dateFilterLabel + ")");
		}

		var vFromDate = Ext.util.Format.date(Ext.Date.parse(
						objDateParams.fieldValue1, 'Y-m-d'),
				strExtApplicationDateFormat);
		var vToDate = Ext.util.Format.date(Ext.Date.parse(
						objDateParams.fieldValue2, 'Y-m-d'),
				strExtApplicationDateFormat);
		if (index == '13') {
			if (objDateParams.operator == 'eq') {
				datePickerRef.setDateRangePickerValue(vFromDate);
			} else {
				datePickerRef.setDateRangePickerValue([vFromDate, vToDate]);
			}
		} else {
			if (index === '1' || index === '2') {
					datePickerRef.setDateRangePickerValue(vFromDate);
			} else {
				datePickerRef.setDateRangePickerValue([vFromDate, vToDate]);
			}
		}
	},
	getDateParam : function( index )
	{
		var me = this;
		var objDateHandler = me.getDateHandler();
		var strAppDate = dtApplicationDate;
		var dtFormat = strExtApplicationDateFormat;
		var date = new Date( Ext.Date.parse( strAppDate, dtFormat ) );
		var strSqlDateFormat = 'Y-m-d';
		var fieldValue1 = '', fieldValue2 = '', operator = '';
		var retObj = {};
		var dtJson = {};
		switch( index )
		{
			case '1':
				// Today
				fieldValue1 = Ext.Date.format( date, strSqlDateFormat );
				fieldValue2 = fieldValue1;
				operator = 'eq';
				break;
			case '2':
				// Yesterday
				fieldValue1 = Ext.Date.format( objDateHandler.getYesterdayDate( date ), strSqlDateFormat );
				fieldValue2 = fieldValue1;
				operator = 'eq';
				break;
			case '3':
				// This Week
				dtJson = objDateHandler.getThisWeekStartAndEndDate( date );
				fieldValue1 = Ext.Date.format( dtJson.fromDate, strSqlDateFormat );
				fieldValue2 = Ext.Date.format( dtJson.toDate, strSqlDateFormat );
				operator = 'bt';
				break;
			case '4':
				// Last Week To Date
				dtJson = objDateHandler.getLastWeekToDate( date );
				fieldValue1 = Ext.Date.format( dtJson.fromDate, strSqlDateFormat );
				fieldValue2 = Ext.Date.format( dtJson.toDate, strSqlDateFormat );
				operator = 'bt';
				break;
			case '5':
				// This Month
				dtJson = objDateHandler.getThisMonthToDate( date );
				fieldValue1 = Ext.Date.format( dtJson.fromDate, strSqlDateFormat );
				fieldValue2 = Ext.Date.format( dtJson.toDate, strSqlDateFormat );
				operator = 'bt';
				break;
			case '6':
				// Last Month To Date
				dtJson = objDateHandler.getLastMonthToDate( date );
				fieldValue1 = Ext.Date.format( dtJson.fromDate, strSqlDateFormat );
				fieldValue2 = Ext.Date.format( dtJson.toDate, strSqlDateFormat );
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
			case '12' :	
				// Latest
				var fromDate = new Date(Ext.Date.parse(from_date_admin, dtFormat));
			    var toDate = new Date(Ext.Date.parse(to_date_admin, dtFormat));		
				 
				fieldValue1 = Ext.Date.format(
							fromDate,
							strSqlDateFormat);
				fieldValue2 = Ext.Date.format(
							toDate,
							strSqlDateFormat);
				operator = 'bt';
				break;
			case '13' :
				// Date Range
				if (me.datePickerSelectedDate.length == 1) {
					fieldValue1 = Ext.Date.format(me.datePickerSelectedDate[0],
							strSqlDateFormat);
					fieldValue2 = fieldValue1;
					operator = 'eq';
				} else if (me.datePickerSelectedDate.length == 2) {
					fieldValue1 = Ext.Date.format(me.datePickerSelectedDate[0],
							strSqlDateFormat);
					fieldValue2 = Ext.Date.format(me.datePickerSelectedDate[1],
							strSqlDateFormat);
					operator = 'bt';
				}
		}
		
		retObj.fieldValue1 = fieldValue1;
		retObj.fieldValue2 = fieldValue2;
		retObj.operator = operator;
		return retObj;
	},	
	updateFilterConfig : function() {
		var me = this;
		var arrJsn = new Array();
		me.preferenceHandler = Ext.create('Ext.ux.gcp.PreferencesHandler');
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
                '11' : getLabel( 'lastyeartodate', 'Last Year To Date' ),
				'13' : getLabel('daterange', 'Date Range')
		};
		if (!Ext.isEmpty(objGridViewFilter)) {
			var data = Ext.decode(objGridViewFilter);


			var strDtValue = data.quickFilter.alertDate;
			var strDtFrmValue = data.quickFilter.alertDateFrom;
			var strDtToValue = data.quickFilter.alertDateTo;
			var strType = data.quickFilter.eventType;			
			if (!Ext.isEmpty(strDtValue)) {
				me.dateFilterLabel = objDateLbl[strDtValue];
				me.dateFilterVal = strDtValue;
				if (strDtValue === '13') {
					if (!Ext.isEmpty(strDtFrmValue))
						me.dateFilterFromVal = strDtFrmValue;

					if (!Ext.isEmpty(strDtToValue))
						me.dateFilterToVal = strDtToValue;
				}
				me.typeFilterVal = !Ext.isEmpty(strType)
						? strType
						: 'Select';
			}

		}
		if (!Ext.isEmpty(me.dateFilterVal)) 
		{
			var strVal1 = '', strVal2 = '', strOpt = 'eq';
			if (me.dateFilterVal !== '13') {
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
			//if(me.dateFilterVal != '12')
			//{
				arrJsn.push({
					paramName : 'AlertDate',
					paramValue1 : strVal1,
					paramValue2 : strVal2,
					operatorValue : strOpt,
					paramIsMandatory : true,
					dataType : 'D'
				});
			//}
		}
		if (me.typeFilterVal != null && me.typeFilterVal.toUpperCase() != "SELECT") {
			arrJsn.push({
				paramName : 'eventType',
				paramValue1 : me.typeFilterVal,
				operatorValue : 'eq',
				dataType : 'S'
			});
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
		var strFilter = '';
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
		me.doSavePreferences();
	},
	handleClientChangeInQuickFilter : function() {
		var me = this;
		me.clientFilterVal = isEmpty(selectedFilterClient)
					? 'all'
					: selectedFilterClient;
		me.clientFilterDesc = selectedFilterClientDesc;					
		me.filterApplied = 'Q';
		me.setDataForFilter();
		if (me.clientFilterVal == 'all') {
			me.savedFilterVal = null;
			me.filterApplied = 'ALL';
			me.refreshData();
		} else {
			me.applyQuickFilter();
		}
	},
	handleClearPreferences : function() {
		var me = this;
		me.preferenceHandler.clearPagePreferences('msgcenteralert', null,
				 me.postHandleClearPreferences, null, me, true);
	},
	postHandleClearPreferences : function(data, args, isSuccess) {
		var me = this;		
	},	
	doSavePreferences : function() {
		var me = this;
		var strUrl = me.strCommonPrefUrl;
		var arrPref = me.getPreferencesToSave(false);
		if (arrPref) {
			me.preferenceHandler.savePagePreferences('msgcenteralert', arrPref,
					me.postHandleSavePreferences, null, me, true);
		}
	},	
	postHandleSavePreferences : function(data, args, isSuccess) {
				var me = this;
	},
	getPreferencesToSave : function(localSave) {
		var me = this;
		var groupView = me.getGroupView();
		var grid = null;
		var arrCols = null, objCol = null, arrColPref = null, arrPref = [], objFilterPref = null;
		var groupInfo = null, subGroupInfo = null;
		
		if (groupView) {
			grid = groupView.getGrid();
			var gridState=grid.getGridState();	
			groupInfo = groupView.getGroupInfo() || '{}';
			subGroupInfo = groupView.getSubGroupInfo() || {};
 
			arrPref.push({
						"module" : "gridView",
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
							 'sortState':gridState.sortState
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
	getFilterPreferences : function() {
		var me = this;		
		var objFilterPref = {};				
		var quickPref = {};
		quickPref.eventType = me.typeFilterVal;
		quickPref.alertDate = me.dateFilterVal;
		if (me.dateFilterVal === '13') {
			quickPref.alertDate = '1'; 
			if (!Ext.isEmpty(me.dateFilterFromVal)
					&& !Ext.isEmpty(me.dateFilterToVal)) {
				quickPref.alertDateFrom = me.dateFilterFromVal;
				quickPref.alertDateTo = me.dateFilterToVal;					
			} else {
				var strSqlDateFormat = 'Y-m-d';				
			}
		}
		objFilterPref.quickFilter = quickPref;		
		return objFilterPref;
	},
	/*savePreferences : function() {
		var me = this, objPref = {}, arrCols = null, objCol = null;
		var strUrl = me.urlGridPref;
		var grid = me.getMsgCenterAlertGrid();
		//var arrColPref = new Array();
		var gridState = grid.getGridState();
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
		btn.addCls( 'xn-custom-heighlight xn-account-filter-btnmenu' );
		if(btn.code !== null && btn.btnDesc === 'eventDescId')
		{
			me.typeFilterVal = btn.code;
		    me.typeFilterDesc = btn.btnDesc;
		}
	
		me.setDataForFilter();
		if(me.typeFilterDesc !== null && me.typeFilterDesc === 'eventDescId')
		{
			msgLabel.setText(me.typeFilterVal);
			msgLabel.addCls('xn-custom-heighlight xn-account-filter-btnmenu');
		}		me.filterApplied = 'Q';
		me.applyFilter();
		
		
	},
	applyTypeFilter : function(typeFilterVal)
	{
		var me = this;
		var groupView = me.getGroupView();
		var grid = groupView.getGrid();		
		if(typeFilterVal === 'read' || typeFilterVal === 'unread'){
			var strUrl = 'msgCenterAlertType.srvc?$type='+typeFilterVal+'&$filter='+'&'+csrfTokenName+'='+csrfTokenValue;
			grid.setLoading(true);
			grid.loadGridData(strUrl, me.handleAfterGridDataLoad, null);
		}
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
	},
	refreshData : function() {
		var me = this;
		var groupView = me.getGroupView();
		var grid = groupView.getGrid();		
		var groupInfo = groupView.getGroupInfo() || '{}';
		var subGroupInfo = groupView.getSubGroupInfo() || {};
		var oldPageNum = 1;
		var current = 1;
		me.doHandleLoadGridData(groupInfo, subGroupInfo,grid, grid.store.dataUrl, grid.pageSize, 1, 1, null, null);		
	},*/
	
	
/*	applyTypeFilter : function(typeFilterVal)
	{
		var me = this;
		var groupView = me.getGroupView();
		var grid = groupView.getGrid();		
		if(typeFilterVal === 'read' || typeFilterVal === 'unread'){
			var strUrl = 'msgCenterAlertType.srvc?$type='+typeFilterVal+'&$filter='+'&'+csrfTokenName+'='+csrfTokenValue;
			grid.setLoading(true);
			grid.loadGridData(strUrl, me.handleAfterGridDataLoad, null);
		}
	}*/	
	refreshData : function() {
		var me = this;
		var objGroupView = me.getGroupView();
		objGroupView.refreshData();
		me.disablePreferencesButton("savePrefMenuBtn",false);
	},
	disablePreferencesButton: function(btnId,boolVal){
		$("#"+btnId).attr("disabled",boolVal);
		if(boolVal)
			$("#"+btnId).css("color",'grey');
		else
			$("#"+btnId).css("color",'#FFF');
	},
	handleClearSettings : function() {
		var me = this;
		me.typeFilterVal = 'Select';
		var eventFiltersCombo = me.getMsgCenterAlertFilterView()
				.down('combo[itemId="eventFiltersCombo"]');
		eventFiltersCombo.setValue(me.typeFilterVal);		
		var datePickerRef = $('#eventDatePickerQuickText');
		me.dateFilterVal = '12';
		me.handleDateChange(me.dateFilterVal);
		me.getDateLabel().setText('Alert Date (Latest)');
		me.advFilterData = null;	
		me.filterApplied = 'ALL';
		selectedFilterClient = null;
		
		var clientFiltersCombo = me.getMsgCenterAlertFilterView()
		.down('combo[itemId="clientCombo"]');
		clientFiltersCombo.setValue(selectedFilterClient);	

		selectedClientDesc = null;
		selectedFilterClientDesc = null;
		me.setDataForFilter();
		me.refreshData();
	}
	
});