/**
 * @class GCP.controller.AlertMonitorController
 * @extends Ext.app.Controller
 * @author Archana Shirude
 */

Ext.define('GCP.controller.AlertMonitorController', {
	extend : 'Ext.app.Controller',
	requires : ['Ext.ux.gcp.FilterView','Ext.ux.gcp.DateUtil','Ext.ux.gcp.PreferencesHandler',
	          'Ext.ux.gcp.PageSettingPopUp'],
	views : ['GCP.view.AlertMonitorView','GCP.view.AlertMonitorFilterView','Ext.tip.ToolTip'],
	
	refs : [{
				ref : 'pageSettingPopUp',
				selector : 'pageSettingPopUp'
			},{
				ref : 'filterView',
				selector : 'filterView'
			},{
				ref : 'alertMonitorView',
				selector : 'alertMonitorView'
			},{
				ref : 'groupView',
				selector : 'alertMonitorView groupView'
			},{
				ref : 'alertMonitorFilterView',
				selector : 'alertMonitorFilterView'
			},{
				ref : 'btnSavePreferences',
				selector : 'alertMonitorView alertMonitorFilterView button[itemId="btnSavePreferences"]'
			}, {
				ref : 'btnClearPreferences',
				selector : 'alertMonitorView alertMonitorFilterView button[itemId="btnClearPreferences"]'
			},{
				ref : 'fromDateLabel',
				selector : 'alertMonitorView alertMonitorFilterView label[itemId="dateFilterFrom"]'
			},{
				ref : 'toDateLabel',
				selector : 'alertMonitorView alertMonitorFilterView label[itemId="dateFilterTo"]'
			},{
				ref : 'dateLabel',
				selector : 'alertMonitorFilterView label[itemId="dateLabel"]'
			},{
				ref : 'entryDate',
				selector : 'alertMonitorFilterView button[itemId="entryDate"]'
			},{
				ref : 'fromEntryDate',
				selector : 'alertMonitorView alertMonitorFilterView datefield[itemId="fromDate"]'
			},{
				ref : 'toEntryDate',
				selector : 'alertMonitorView alertMonitorFilterView datefield[itemId="toDate"]'
			},{
				ref : 'dateRangeComponent',
				selector : 'alertMonitorView alertMonitorFilterView container[itemId="dateRangeComponent"]'
			},{
				ref : 'savedFiltersToolBar',
				selector : 'alertMonitorView alertMonitorFilterView toolbar[itemId="advFilterActionToolBar"]'
			},{
				ref : 'savedFiltersCombo',
				selector : 'alertMonitorFilterView  combo[itemId="savedFiltersCombo"]'
			}, {
				ref : 'alertStatusToolBar',
				selector : 'alertMonitorView alertMonitorFilterView toolbar[itemId="alertStatusToolBar"]'
			}],
	config : {
		alertStatusVal : 'E',
		alertStatusDesc : 'Failure',
		previouGrouByCode : null,
		savePrefAdvFilterCode : null,
		showAdvFilterCode : null,
		filterApplied : 'ALL',
		advFilterData : [],
		filterData : [],
		//clientValue :'',
		//clientValueDesc :'',
		clientFilterVal : 'all',
		clientFilterDesc : getLabel('allCompanies', 'All companies'),
		alertNameValue :'',
		alertNameDesc:'',
		datePickerSelectedDate : [],
		datePickerSelectedCreationAdvDate :[],
		dateRangeFilterVal : '1',
		dateFilterLabel : getLabel('lblToday', 'Today'),
		dateFilterVal : '1',
		dateFilterFromVal : '',
		dateFilterToVal : '',
		savedFilterVal : '',
		dateHandler : null,
		preferencesHandler : null,
		objAdvFilterPopup : null,
		filterMode :'',
		creationDateFilterVal : '1',
		creationDateFilterLabel : getLabel('lblToday', 'Today'),
		SearchOrSave : false,
		ribbonDateLbl : null,
		ribbonFromDate : null,
		ribbonToDate : null,
		filterCodeValue : null,
		strModifySavedFilterUrl : 'services/userfilters/alertMonitorGrpViewFilter/{0}.json',
		strGetSavedFilterUrl : 'services/userfilters/alertMonitorGrpViewFilter/{0}.json',
		strRemoveSavedFilterUrl : 'services/userfilters/alertMonitorGrpViewFilter/{0}/remove.json',
		reportGridOrder : null,
		strPageName : 'alertMonitor',
		pageSettingPopup : null,
		syncAdvFilterWithQuick : true
	},
	init : function() {
		var me = this;
		me.dateHandler = Ext.create('Ext.ux.gcp.DateUtil');	
		me.preferencesHandler = Ext.create('Ext.ux.gcp.PreferencesHandler');	
		var date = new Date(Ext.Date.parse(dtApplicationDate, strExtApplicationDateFormat));
		me.updateFilterConfig();
		$(document).on('filterDateChange',
				function(event, filterType, btn, opts) {
					if ((filterType == "entryDateAdvFilter")
							|| (filterType == "eventEntryDateQuickFilter")) {
						me.handleEntryDateChange(filterType, btn, opts);
					} else if (filterType == "creationDate") {
						me.creationDateChange(btn, opts);
					}
				});
		$(document).on('performReportAction', function(event, actionName) {
			me.downloadReport(actionName);
		});
		$("#savePrefMenuBtn").attr('disabled',true);
		$("#clearPrefMenuBtn").attr('disabled',true);
		$(document).on('searchActionClicked', function() {
			me.searchActionClicked(me);
		});
		$(document).on('resetAllFieldsEvent', function() {
			me.resetAllFields();
			me.filterCodeValue = null;
		});
		$(document).on('saveAndSearchActionClicked', function() {
			me.saveAndSearchActionClicked(me);
		});
		
		$(document).on('handleSavedFilterClick', function(event) {
					me.handleSavedFilterClick();
		});
		
		$(document).on('performPageSettings', function(event) {
					me.showPageSettingPopup('PAGE');
		});
		$(document).on('deleteFilterEvent', function(event, filterCode) {
					me.deleteFilterSet(filterCode);
		});
		$(document).on('handleClientChangeInQuickFilter',
				function(isSessionClientFilter) {
					me.handleClientChangeInQuickFilter(isSessionClientFilter);
		});
		$(document).on("datePickPopupSelectedDate",
				function(event, filterType, dates) {
					if (filterType == "creationDate") {
						me.dateRangeFilterVal = '7';
						me.datePickerSelectedCreationAdvDate = dates;
						me.creationDateFilterVal = me.dateRangeFilterVal;
						me.creationDateFilterLabel = getLabel('daterange', 'Date Range');
						me.handleCreationDateChange(me.dateRangeFilterVal);
					}
				});
		me.control({
			'alertMonitorView groupView' : {
				'groupByChange' : function(menu, groupInfo) {
					me.doHandleGroupByChange(menu, groupInfo);
				},
				'groupTabChange' : function(groupInfo, subGroupInfo, tabPanel,
						newCard, oldCard) {
					//me.disablePreferencesButton("savePrefMenuBtn",false);
					//me.disablePreferencesButton("clearPrefMenuBtn",false);	
					me.doHandleGroupTabChange(groupInfo, subGroupInfo,
							tabPanel, newCard, oldCard);
				},
				'gridRender' : me.doHandleLoadGridData,
				'gridPageChange' : me.doHandleLoadGridData,
				'gridSortChange' : me.doHandleLoadGridData,
				'gridPageSizeChange' : me.doHandleLoadGridData,
				'gridColumnFilterChange' : me.doHandleLoadGridData,
				'gridRowSelectionChange' : me.doHandleGridRowSelectionChange,
				'gridStateChange' : function(grid) {
					me.disablePreferencesButton("savePrefMenuBtn",false);
				},
				'gridRowActionClick' : function(grid, rowIndex, columnIndex,
						actionName, record) {
					me.doHandleRowActions(actionName, grid, record,rowIndex);
				},
				'groupActionClick' : function(actionName, isGroupAction,
						maskPosition, grid, arrSelectedRecords) {
					if (isGroupAction === true)
						me.handleGroupActions(actionName, grid,
								arrSelectedRecords, 'groupAction');
				},
				'render' : function(panel, opts) {
					populateAdvancedFilterFieldValue();
					me.firstTime = true;
					if ((!Ext.isEmpty(objAlertMonitorFilterPref))) {
						var objJsonData = Ext.decode(objAlertMonitorFilterPref);
						if (!Ext.isEmpty(objJsonData.d.preferences)) {
							if (!Ext.isEmpty(objJsonData.d.preferences.GeneralSetting)) {
								if (!Ext.isEmpty(objJsonData.d.preferences.GeneralSetting.defaultFilterCode)) {
									var advData = objJsonData.d.preferences.GeneralSetting.defaultFilterCode;
									me.doHandleSavedFilterItemClick(advData, null);
									me.savedFilterVal = advData;
								}
							}
						}
					}
				},
				'gridSettingClick' : function(){
					me.showPageSettingPopup('GRID');
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
			'alertMonitorView button[itemId="downloadPdf"]' : {
				click : function(btn, opts) {
					me.handleReportAction(btn,opts);
				}
			},
			'alertMonitorView' : {
				performReportAction : function(btn, opts) {
					me.handleReportAction(btn, opts);
				}
			},
			'alertMonitorFilterView' :{
				'beforerender' : function() {
					var useSettingsButton = me.getFilterView()
							.down('button[itemId="useSettingsbutton"]');
					if (!Ext.isEmpty(useSettingsButton)) {
						useSettingsButton.hide();
					}
				},
				'handleClientChange' : function(combo,  record) {
					me.handleClientChange(combo,record);
					me.disablePreferencesButton("savePrefMenuBtn",false);
				},
				'handleAlertNameChange' : function(alertCode , alertDesc){
					me.handleAlertNameChange(alertCode, alertDesc);
					me.disablePreferencesButton("savePrefMenuBtn",false);
				},
				'handleAlertStatus' : function(combo) {
					me.handleAlertStatus(combo);
				},
				'handleSavedFilterItemClick' : function(comboValue, comboDesc) {
					 objAdvSyncWithQuick = true;
					me.doHandleSavedFilterItemClick(comboValue, comboDesc);
				}
			},
			'filterView' : {
				appliedFilterDelete : function(btn){
					me.handleAppliedFilterDelete(btn);
				}
			},
			'alertMonitorFilterView combo[itemId="savedFiltersCombo"]' : {
				'afterrender' : function(combo, newValue, oldValue, eOpts) {
					if (!Ext.isEmpty(me.savedFilterVal)) {
						combo.setValue(me.savedFilterVal);
					}
				}
			},
			'alertMonitorFilterView combo[itemId="alertStatusToolBar"]' : {
				'afterrender' : function(combo, newValue, oldValue, eOpts) {
					if (!Ext.isEmpty(me.alertStatusVal)) {
						combo.setValue(me.alertStatusVal);
					}
				}
			},
			'alertMonitorFilterView component[itemId="eventQuickEntryDataPicker"]' : {
				render : function() {
					$('#entryDataPicker').datepick({
						monthsToShow : 1,
						//minDate : dtHistoryDate,
						maxDate : dtApplicationDate,
						changeMonth : true,
						dateFormat : strApplicationDefaultFormat,
						changeYear : true,
						rangeSeparator : ' to ',
						onClose : function(dates) {
							if (!Ext.isEmpty(dates)) {
                                me.dateRangeFilterVal = '7';
								me.datePickerSelectedDate = dates;
								me.datePickerSelectedCreationAdvDate = dates;
								me.dateFilterVal = me.dateRangeFilterVal;
								me.dateFilterLabel = getLabel('daterange',
										'Date Range');
								me.handleDateChange(me.dateRangeFilterVal,me.dateFilterLabel);
								me.setDataForFilter();
								me.applyQuickFilter();
								me.disablePreferencesButton("savePrefMenuBtn",false);
							}
						}
					});
					if(!Ext.isEmpty(me.savedFilterVal)) {
						var creationDateLableVal = $('label[for="CreationDateLabel"]').text();
						var creationDateField = $("#creationDate");
						me.handleCreationDateSync('A', creationDateLableVal, null, creationDateField);
					}
					else{
						me.dateFilterVal = '1'; // Set to Today
						me.dateFilterLabel = getLabel('lblToday', 'Today');
						me.handleDateChange(me.dateFilterVal,me.dateFilterLabel);
						me.setDataForFilter();
						me.applyQuickFilter();
					}

				}
			},
			'filterView button[itemId="clearSettingsButton"]' : {
				'click' : function() {
					me.handleClearSettings();
				}
			},
			'filterView label[itemId="createAdvanceFilterLabel"]' : {
				'click' : function() {
					//me.resetAllFields();
					showAdvanceFilterPopup();
					me.assignSavedFilter();

				}
			}
		});
	},
	doHandleGridRowSelectionChange : function(groupInfo, subGroupInfo, objGrid,
			objRecord, intRecordIndex, arrSelectedRecords, jsonData) {
		var me = this;
		var buttonMask = '00';
		var maskArray = new Array(), actionMask = '', objData = null;;

		if (!Ext.isEmpty(jsonData) && !Ext.isEmpty(jsonData.d.__buttonMask)) {
			buttonMask = jsonData.d.__buttonMask;
		}
		maskArray.push(buttonMask);
		for (var index = 0; index < arrSelectedRecords.length; index++) {
			objData = arrSelectedRecords[index];
			maskArray.push(objData.get('__metadata').__rightsMap);
		}
		actionMask = doAndOperation(maskArray, 10);
		me.enableDisableGroupActions(actionMask);
	},
	enableDisableGroupActions : function(actionMask) {

		var me = this;
		var objGroupView = me.getGroupView();
		var actionBar = objGroupView.down('toolbar[itemId="groupActionToolBar"]');

		var blnEnabled = false, strBitMapKey = null, arrItems = new Array();
		if (!Ext.isEmpty(actionBar) && !Ext.isEmpty(actionBar.items.items)) {
			arrItems = actionBar.items.items;
			Ext.each(arrItems, function(item) {
						strBitMapKey = parseInt(item.maskPosition,10)-1 ;
						if (strBitMapKey) {
							blnEnabled = isActionEnabled(actionMask,
									strBitMapKey);
							item.setDisabled( !blnEnabled );
						}
						
					});
		}
	},
	doHandleRowActions : function(actionName, grid, record,rowIndex) {
		var me = this;
		if (actionName === 'btnRetrigger') {
			me.handleGroupActions(actionName, grid, [record], 'rowAction');
		}
	},
	doHandleGroupByChange : function(menu, groupInfo) {
		var me = this;
		if (me.previouGrouByCode === 'ALERTMONITOR_OPT_ADVFILTER') {
			me.savePrefAdvFilterCode = null;
			me.showAdvFilterCode = null;
			me.filterApplied = 'ALL';
		}
		if (groupInfo && groupInfo.groupTypeCode === 'ALERTMONITOR_OPT_ADVFILTER') {
			me.previouGrouByCode = groupInfo.groupTypeCode;
		} else
			me.previouGrouByCode = null;
	},
	handleGroupActions : function(strAction, grid, arrSelectedRecords,
			strActionType) {
		var me = this;
		if (strAction === 'btnRetrigger') 
		{
			me.preHandleGroupActions("services/alertMonitor/retrigger.srvc", '',  grid, arrSelectedRecords,
					strActionType, strAction);
		}
	},
	preHandleGroupActions : function(strUrl, remark, grid, arrSelectedRecords,
			strActionType, strAction) {

		var me = this;
		var groupView = me.getGroupView();
		if (!Ext.isEmpty(groupView)) {
			var arrayJson = new Array();
			var records = (arrSelectedRecords || []);
		
			for (var index = 0; index < records.length; index++) {
				arrayJson.push({
							serialNo : grid.getStore().indexOf(records[index])
									+ 1,
							identifier : records[index].data.identifier,
							userMessage : remark,
							recordDesc : records[index].data.profileName
						});
			}
			if (arrayJson)
				arrayJson = arrayJson.sort(function(valA, valB) {
							return valA.serialNo - valB.serialNo
						});

			Ext.Ajax.request({
						url : strUrl + '?' + csrfTokenName + '=' + csrfTokenValue,
						method : 'POST',
						jsonData : Ext.encode(arrayJson),
						success : function(response) {
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
								me.enableDisableGroupActions( '00' );
								groupView.refreshData();
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
	disablePreferencesButton : function(btnId,boolVal) {
		var me = this;
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
	/**
	 * This method will be used to create the Grid Model based on Group By
	 * parameter. You can pass Grid Model to reconfigureGrid method. If you
	 * passed null then the default Grid Model will used.
	 */
	doHandleGroupTabChange : function(groupInfo, subGroupInfo, tabPanel,
			newCard, oldCard) {
		var me = this;
		var objGroupView = me.getGroupView();
		var strModule = '', strUrl = null, args = null, strFilterCode = null;
		groupInfo = groupInfo || {};
		subGroupInfo = subGroupInfo || {};
		// TODO : Need to refactor for non us market
		if (groupInfo && _charCaptureGridColumnSettingAt === 'L') {
			args = {
				scope : me
			};
			strModule = subGroupInfo.groupCode
			strModule = strModule === 'all'? groupInfo.groupTypeCode+'-'+strModule : strModule;
			me.preferencesHandler.readModulePreferences(me.strPageName,strModule,me.postHandleDoHandleGroupTabChange, null, me, false);

		} else 
		me.postHandleDoHandleGroupTabChange();

	},
	postHandleDoHandleGroupTabChange : function(data, args) {
		var me = args ? args.scope : this;
		me.handleReconfigureGrid(data);
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
	handleReconfigureGrid : function(data) {
		var me = this;
		var objGroupView = me.getGroupView();
		var objSummaryView = me.getAlertMonitorView(), gridModel = null, objData = null;
		var colModel = null, arrCols = null;
		if (data && data.preference)
			objData = Ext.JSON.decode(data.preference)
		if (_charCaptureGridColumnSettingAt === 'L' && objData
				&& objData.gridCols) {
			arrCols = objData.gridCols;
			colModel = objSummaryView.getColumnModel(arrCols);
			if (colModel) {
				gridModel = {
					columnModel : colModel
				}
			}
		}
		// TODO : Preferences and existing column model need to be merged
		objGroupView.reconfigureGrid(gridModel);
	},
	
	/*Page setting handling starts here*/
	savePageSetting : function(arrPref, strInvokedFrom) {
		/* This will be get invoked from page level setting always */
		var me = this, args = {};
		if (!Ext.isEmpty(arrPref)) {
			me.preferencesHandler.savePagePreferences(me.strPageName, arrPref,
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
				me.preferencesHandler.saveModulePreferences(me.strPageName,
						strModule, objPref, me.postHandlePageGridSetting, args,
						me, false);
			} else {
				me.preferencesHandler.savePagePreferences(me.strPageName,
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
			me.preferencesHandler.clearPagePreferences(me.strPageName, arrPref,
					me.postHandleRestorePageSetting, args, me, false);
		} else
			me.preferencesHandler.clearPagePreferences(me.strPageName, arrPref,
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
				msg : getLabel('errorMsg', 'Error while apply/restore setting'),
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
		var me = this, objData = {}, objGroupView = me.getGroupView(), objPrefData, objGeneralSetting, objGridSetting, objColumnSetting;
		var objGroupByVal = '', objDefaultFilterVal = '', objGridSizeVal = '', objRowPerPageVal = _GridSizeTxn, strTitle = null, subGroupInfo;

		me.pageSettingPopup = null;

		if (!Ext.isEmpty(objAlertMonitorFilterPref)) {
			objPrefData = Ext.decode(objAlertMonitorFilterPref);
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
					:(ALERT_MONITOR_COLUMN_MODEL || '[]');

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
		objData["filterUrl"] = 'services/userfilterslist/alertMonitorGrpViewFilter';
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
					title : strTitle
				});
		me.pageSettingPopup.show();
		me.pageSettingPopup.center();
	},
	handleAppliedFilterDelete : function(btn){
		var me = this;
		var objData = btn.data;
		var advJsonData = me.advFilterData || [];
		var quickJsonData = me.filterData;
		if(!Ext.isEmpty(objData)){
			var paramName = objData.paramName || objData.field;
			var reqJsonInAdv = null;
			var arrAdvJson =null;
			//adv
			var reqJsonInAdv = me.findInAdvFilterData(advJsonData,paramName);
			if (!Ext.isEmpty(reqJsonInAdv)) {
				arrAdvJson = advJsonData;
				arrAdvJson = me
						.removeFromAdvanceArrJson(arrAdvJson,paramName);
				me.advFilterData = arrAdvJson;
			}
			// quick
			else {
				var reqJsonInQuick = me.findInQuickFilterData(quickJsonData,paramName);
				if (!Ext.isEmpty(reqJsonInQuick)) {
					arrQuickJson = quickJsonData;
					arrQuickJson = me.removeFromQuickArrJson(arrQuickJson,paramName);
					me.filterData = arrQuickJson;
				}
			}
			me.resetFieldInAdvAndQuickOnDelete(objData);
			me.firstTime = false;
			if(me.filterData.length < 1 && me.advFilterData.length < 1){
				me.resetAllFields();
				me.filterCodeValue=null;
				me.savedFilterVal = '';
				var savedFilterComboBox = me.getAlertMonitorFilterView().down('combo[itemId="savedFiltersCombo"]');
				savedFilterComboBox.setValue(me.savedFilterVal);
			}
			me.refreshData();
		}
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
	findInAdvFilterData : function(arr, key) {
		var reqJson = null;
		for (var ai, i = arr.length; i--;) {
			if ((ai = arr[i]) && ai.field == key) {
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
	},
	removeFromAdvanceArrJson : function(arr,key){
		for (var ai, i = arr.length; i--;) {
			if ((ai = arr[i]) && ai.field == key) {
				arr.splice(i, 1);
			}
		}
		return arr;
	},
	resetFieldInAdvAndQuickOnDelete : function(objData){
		var me = this,strFieldName;
		if(!Ext.isEmpty(objData))
			strFieldName = objData.paramName || objData.field;
		
		if(strFieldName ==='alertName'){
			$("#advalertname").val("");
			var alertNameFltId = me.getAlertMonitorFilterView().down('AutoCompleter[itemId="alertNameFltId"]');
			alertNameFltId.setRawValue("");
			selectAdvAlertNameCode = '';
			selectAdvAlertNameDesc = '';
		}
		else if(strFieldName ==='clientFilterId'){
			$("#advclient").val("");
				if(isClientUser()){
					var clientComboBox = me.getAlertMonitorFilterView().down('combo[itemId="clientCombo"]');
					me.clientFilterVal = 'all';
					selectedFilterClientDesc = "";
					selectedFilterClient = "";
					clientComboBox.setValue(me.clientFilterVal);
				} else {
					$('#advclientauto').val("");
					var clientComboBox = me.getAlertMonitorFilterView().down('combo[itemId="clientComboAuto]');
					clientComboBox.reset();
					me.clientFilterVal = '';
					selectedFilterClientDesc = "";
					selectedFilterClient = "";
				}
		}
		else if(strFieldName === 'alertDate'){
			var datePickerRef = $('#entryDataPicker');
			me.dateFilterVal = '1';
			me.dateFilterLabel = getLabel('lblToday', 'Today') ;
			me.handleDateChange(me.dateFilterVal, me.dateFilterLabel);
			//datePickerRef.val('');
			
			//selectedCreationDate = {};
			me.datePickerSelectedCreationAdvDate = [];
			//$("#creationDate").val("");
			$('label[for="CreationDateLabel"]').text(getLabel('creationDate', 'Alert Date(Latest)'));
		}
		else if(strFieldName === 'alertStatus')
		{
			var alertStatusToolBar = me.getAlertMonitorFilterView().down('combo[itemId="alertStatusToolBar"]');
			if (!Ext.isEmpty(alertStatusToolBar)) {
				alertStatusToolBar.setValue('All');
				me.alertStatusVal = 'all';
				me.alertStatusDesc = '';
			}
			$('#advalertstatus').val("");
		}
		else if(strFieldName === 'alertMode')
		{
			$('#advalertmode').val("");
		}
		else if(strFieldName === 'alertTrackingId')
		{
			$('#advtrackingid').val("");
		}
		
	},
	doHandleLoadGridData : function(groupInfo, subGroupInfo, grid, url, pgSize,
			newPgNo, oldPgNo, sorter, filterData) {
		var me = this;
		var arrOfParseQuickFilter = [], arrOfParseAdvFilter = [], arrOfFilteredApplied = [];
		var objGroupView = me.getGroupView();
		var strUrl = grid.generateUrl(url, pgSize, newPgNo, oldPgNo, sorter);
		//me.setDataForFilter();
		strUrl += me.generateFilterUrl(subGroupInfo, groupInfo);
		me.reportGridOrder = strUrl;
		strUrl = strUrl + '&'+ csrfTokenName + '='
				+ csrfTokenValue;
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
		
		if (!Ext.isEmpty(me.advFilterData)) {
			if (!Ext.isEmpty(me.advFilterData) && me.advFilterData.length >= 1) {
				arrOfParseAdvFilter = generateFilterArray(me.advFilterData);
			}
		}

		if (arrOfParseQuickFilter && arrOfParseAdvFilter) {
			arrOfFilteredApplied = arrOfParseQuickFilter
					.concat(arrOfParseAdvFilter);

			if (arrOfFilteredApplied)
				me.getFilterView().updateFilterInfo(arrOfFilteredApplied);
		}
		grid.loadGridData(strUrl, null, null, false);
		grid.on('itemdblclick', function(dataView, record, item, rowIndex,
				eventObj) {
			//me.handleGridRowDoubleClick(record, grid);
		});
		
	},
	generateFilterUrl : function(subGroupInfo, groupInfo) {
		var me = this;
		var strQuickFilterUrl = '', strAdvancedFilterUrl = '', strUrl = '', isFilterApplied = false;
		var strGroupQuery = (subGroupInfo && subGroupInfo.groupQuery)
				? subGroupInfo.groupQuery
				: '';
		if (me.filterApplied === 'ALL') {
			strQuickFilterUrl = me.generateUrlWithQuickFilterParams(me);
			if (!Ext.isEmpty(strQuickFilterUrl)) {
				strUrl += '&$filter=' + strQuickFilterUrl;
				isFilterApplied = true;
			}
		} else {
			strQuickFilterUrl = me.generateUrlWithQuickFilterParams(me);
			if (!Ext.isEmpty(strQuickFilterUrl)) {
				strUrl += '&$filter=' + strQuickFilterUrl;
				isFilterApplied = true;
			}
			var URLJson = me
					.generateUrlWithAdvancedFilterParams(isFilterApplied);
			strAdvancedFilterUrl = URLJson;
			if (!Ext.isEmpty(strAdvancedFilterUrl)) {
				if (Ext.isEmpty(strUrl)) {
					strUrl = "&$filter=";
					
				}
				else 
					strUrl += ' and ';
				
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
	generateUrlWithQuickFilterParams : function() {
		var me = this;
		var filterData = me.filterData;
		var isFilterApplied = false;
		var strFilter = '';
		var strTemp = '';
		var strFilterParam = '';
		for (var index = 0; index < filterData.length; index++) {
			if (isFilterApplied)
				strTemp = strTemp + ' and ';
			if (Ext.isEmpty(filterData[index].operatorValue)) {
				isFilterApplied = false;
				continue;
			}
			switch (filterData[index].operatorValue) {
				case 'bt' :

					if (filterData[index].dataType === 'D') {
						// Special case we need to send to_date in alertDate to get the 
						// right set of records in faster manner.
						strTemp = strTemp + filterData[index].paramName + ' '
								+ filterData[index].operatorValue + ' '
								+ 'date\'' + filterData[index].paramValue1
								+ '\'' + ' and ' + 'datetime\''
								+ filterData[index].paramValue2 + ' 23:59:59\'';
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
						// Special case we need to send to_date in alertDate to get the 
						// right set of records in faster manner.
						strTemp = strTemp + filterData[index].paramName + ' '
								+ 'bt' + ' '
								+ 'date\'' + filterData[index].paramValue1
								+ '\'' + ' and ' + 'datetime\''
								+ filterData[index].paramValue1 + ' 23:59:59\'';
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
	generateUrlWithAdvancedFilterParams : function(blnFilterApplied) {
		var retUrl = {};
		var me = this;
		var filterData = me.advFilterData;
		var isFilterApplied = blnFilterApplied;
		var isOrderByApplied = false;
		var strFilter = '';
		var strTemp = '';
		var strFilterParam = '';
		var operator = '';
		var isInCondition = false;
		if (!Ext.isEmpty(filterData)) {
			for (var index = 0; index < filterData.length; index++) {
				isInCondition = false;
				operator = filterData[index].operator;
				if (isFilterApplied
						&& (operator === 'bt' || operator === 'lk'
								|| operator === 'gt' || operator === 'lt')
						&& !isEmpty(strTemp)) {
						strTemp = strTemp + ' and ';
				}

				switch (operator) {
					case 'bt' :
						if (filterData[index].dataType === 1) {
							// Special case we need to send to_date in alertDate to get the 
							// right set of records in faster manner.
							strTemp = strTemp + filterData[index].field + ' '
									+ filterData[index].operator + ' '
									+ 'date\'' + filterData[index].value1
									+ '\'' + ' and ' + 'datetime\''
									+ filterData[index].value2 + ' 23:59:59\'';
						} else {
							strTemp = strTemp + filterData[index].field + ' '
									+ filterData[index].operator + ' ' + '\''
									+ filterData[index].value1 + '\'' + ' and '
									+ '\'' + filterData[index].value2 + '\'';
						}
						isFilterApplied = true;
						break;
					case 'st' :
						if (!isOrderByApplied) {
							strTemp = strTemp + ' &$orderby=';
							isOrderByApplied = true;
							isFilterApplied = true;
						} else {
							strTemp = strTemp + ',';
						}
						strTemp = strTemp + filterData[index].value1 + ' '
								+ filterData[index].value2;
						break;
					case 'lk' :
							isFilterApplied = true;
							strTemp = strTemp + filterData[index].field + ' '
									+ filterData[index].operator + ' ' + '\''
									+ filterData[index].value1 + '\'';
						
						break;
					case 'eq' :
						isInCondition = me.isInCondition(filterData[index]);
						if (objValue != 'All') {
							if (isFilterApplied && strTemp.length > 0) {
								strTemp = strTemp + ' and ';
							} else {
								isFilterApplied = true;
							}
						if (isInCondition) {
							var reg = new RegExp(/[\(\)]/g);
							var objValue = filterData[index].value1;
								if (filterData[index].dataType === 1) {
									// Special case we need to send to_date in alertDate to get the 
									// right set of records in faster manner.
									strTemp = strTemp + filterData[index].field
									+ ' ' + 'bt'
									+ ' ' + 'date\'' + objValue + '\''
									+ ' and ' + 'datetime\''
									+ objValue + ' 23:59:59\'';
									
								} else {
									strTemp = strTemp + filterData[index].field
											+ ' ' + filterData[index].operator
											+ ' ' + '\'' + objValue + '\'';
								}
								isFilterApplied = true;
								break;
							}
						}
						if( filterData[ index ].dataType === 'D' )
						{
							// Special case we need to send to_date in alertDate to get the 
							// right set of records in faster manner.
							isFilterApplied = true
							strTemp = strTemp + filterData[ index ].field + ' '
								+ 'bt' + ' ' + 'date\''
								+ filterData[ index ].value1 + '\''
								+ ' and ' + 'datetime\''
								+ filterData[ index ].value1 + ' 23:59:59\'';
						}
						else
						{
							isFilterApplied = true;
							strTemp = strTemp + filterData[ index ].field + ' ' + filterData[ index ].operator
								+ ' ' + '\'' + filterData[ index ].value1 + '\'' ;
						}	
						break;
					case 'gt' :
					case 'lt' :
						isFilterApplied = true;
						if (filterData[index].dataType === 1) {
							strTemp = strTemp + filterData[index].field + ' '
									+ filterData[index].operator + ' '
									+ 'date\'' + filterData[index].value1
									+ '\'';
						} else {
							strTemp = strTemp + filterData[index].field + ' '
									+ filterData[index].operator + ' ' + '\''
									+ filterData[index].value1 + '\'';
						}
						break;
					case 'in' :
						var reg = new RegExp(/[\(\)]/g);
						var objValue = filterData[index].value1;
						objValue = objValue.replace(reg, '');
						var objArray = objValue.split(',');
						if (objArray.length > 0) {
							if (objArray[0] != 'All') {
								if (isFilterApplied) {
										strTemp = strTemp + ' and ';
								} else {
									isFilterApplied = true;
								}
									strTemp = strTemp + '(';
								for (var i = 0; i < objArray.length; i++) {
			
										strTemp = strTemp
												+ filterData[index].field
												+ ' eq ';
										strTemp = strTemp + '\'' + objArray[i]
												+ '\'';
										if (i != objArray.length - 1)
											strTemp = strTemp + ' or ';

									
								}
			
									strTemp = strTemp + ')';
								
							}
						}
						break;
				}
			}
		}
		if (isFilterApplied) {
			strFilter = strFilter + strTemp;
		} else if (isOrderByApplied)
			strFilter = strTemp;
		else
			strFilter = '';
		
		return strFilter;
	},
	handleClientChange : function (combo,record){
		var me = this;
		if(!Ext.isEmpty(combo))
			me.clientValue = combo.getValue();
		if(record && record[0].data)
			me.clientValueDesc = record[0].data.DESCR;
		var objGroupView = me.getGroupView();
		var groupInfo = objGroupView.getGroupInfo();
		me.filterApplied = 'Q';
		me.setDataForFilter();
		me.applyQuickFilter();
		
	},
	setDataForFilter : function(filterData) {
		var me = this;
		var arrQuickJson = {};
		me.advFilterData = {};
		me.filterData = {};
		//me.getSearchTxnTextInput().setValue('');
		var arrQuickJson;
		if (this.filterApplied === 'Q') {
			$("#advclient option[value='"+me.clientFilterVal+"']").attr("selected",true);
			$("#advclient").multiselect("refresh");
			$("#advalertname").val(me.alertNameDesc);
			$("#advclientauto").val(me.clientFilterDesc);
            $("#advalertstatus").val(me.alertStatusVal);
			
		} 
		me.filterData = me.getQuickFilterQueryJson();
		var objJson = (!Ext.isEmpty(filterData) ? filterData.filterBy : getAdvancedFilterQueryJson());
		
			var reqJson = me.findInAdvFilterData(objJson,'clientFilterId');
			if(!Ext.isEmpty(reqJson))
			{
				arrQuickJson = me.filterData;
				arrQuickJson = me.removeFromQuickArrJson(arrQuickJson,'clientFilterId');
				me.filterData = arrQuickJson;
			}
			
			var reqJson = me.findInAdvFilterData(objJson,'alertName');
			if(!Ext.isEmpty(reqJson))
			{
				arrQuickJson = me.filterData;
				arrQuickJson = me.removeFromQuickArrJson(arrQuickJson,'alertName');
				me.filterData = arrQuickJson;
			}
			
			var reqJson = me.findInAdvFilterData(objJson,'alertDate');
			if(!Ext.isEmpty(reqJson))
			{
				arrQuickJson = me.filterData;
				arrQuickJson = me.removeFromQuickArrJson(arrQuickJson,'alertDate');						
				me.filterData = arrQuickJson;
			}
			
			var reqJson = me.findInAdvFilterData(objJson,'alertStatus');
			if(!Ext.isEmpty(reqJson))
			{
				arrQuickJson = me.filterData;
				arrQuickJson = me.removeFromQuickArrJson(arrQuickJson,'alertStatus');						
				me.filterData = arrQuickJson;
			}
			this.advFilterData = objJson;
			var filterCode = $("input[type='text'][id='savedFilterAs']").val();
			this.advFilterCodeApplied = filterCode;
		
	},
	applyQuickFilter : function() {
		var me = this;
		filterUrl='';
		var objGroupView = me.getGroupView();
		var groupInfo = objGroupView.getGroupInfo();
		me.filterApplied = 'Q';
		if (groupInfo && groupInfo.groupTypeCode === 'ALERTMONITOR_OPT_ADVFILTER') {
			objGroupView.setActiveTab('all');
		} else
			me.refreshData();
	},
	getQuickFilterQueryJson : function() {
		var me = this;
		var jsonArray = [];
		var index = me.dateFilterVal;
		var clientFilterVal = me.clientFilterVal;
		var clientFilterDesc = me.clientFilterDesc;
		var objDateParams = me.getDateParam(index);
		var clientComboBox = me.getAlertMonitorFilterView().down('combo[itemId="clientCombo"]');
		if (!Ext.isEmpty(clientComboBox) && !Ext.isEmpty(clientComboBox.getValue())) {
			clientFilterVal = clientComboBox.getValue();
			clientFilterDesc = clientComboBox.getRawValue();
		}
		if (!Ext.isEmpty(index)) {
		jsonArray.push({
					paramName : 'alertDate',
					paramValue1 : objDateParams.fieldValue1,
					paramValue2 : objDateParams.fieldValue2,
					operatorValue : objDateParams.operator,
					dataType : 'D',
					paramIsMandatory : true,
					paramFieldLable : getLabel('alertDate','Alert Date')
				});
		}
		if(!Ext.isEmpty(clientFilterVal) && clientFilterVal!= 'all' ){
			jsonArray.push({
				paramName : 'clientFilterId',
				operatorValue : 'eq',
				paramValue1 : encodeURIComponent(clientFilterVal.replace(new RegExp("'", 'g'), "\''")),
				dataType : 'S',
				displayType : 5,
				paramFieldLable : getLabel('clientId','Company Name'),
				displayValue1 : clientFilterDesc
			});
		}
		var alertNameFltId= me.getAlertMonitorFilterView().down('AutoCompleter[itemId="alertNameFltId"]');
		if(!Ext.isEmpty(alertNameFltId) && !Ext.isEmpty(alertNameFltId.getValue())){
			jsonArray.push({
				paramName : 'alertName',
				operatorValue : 'lk',
				paramValue1 : encodeURIComponent(me.alertNameValue.replace(new RegExp("'", 'g'), "\''")).toUpperCase(),
				dataType : 'S',
				displayType : 5,
				paramFieldLable : getLabel('alertName','Alert Name'),
				displayValue1 : me.alertNameDesc
			});
		}
		if (!Ext.isEmpty(me.alertStatusVal) && "all" != me.alertStatusVal) {
			jsonArray.push({
						paramName : 'alertStatus',
						paramValue1 : encodeURIComponent(me.alertStatusVal.replace(new RegExp("'", 'g'), "\''")),
						operatorValue : 'eq',
						dataType : 'S',
						displayType : 5,
						paramFieldLable : getLabel('alertStatus', 'Status'),
						displayValue1 : me.alertStatusDesc
					});
		}
		return jsonArray;
		
	},	
	getSortByJsonForSmartGrid : function() {
		var me = this;
		var jsonArray = [];
		var sortDirection = '';
		var fieldId = '';
		var sortOrder = '';
		var sortByData = me.advSortByData;
		if (!Ext.isEmpty(sortByData)) {
			for (var index = 0; index < sortByData.length; index++) {
				fieldId = sortByData[index].value1;
				sortOrder = sortByData[index].value2;

				if (sortOrder != 'asc')
					sortDirection = 'DESC';
				else
					sortDirection = 'ASC';

				jsonArray.push({
							property : fieldId,
							direction : sortDirection,
							root : 'data'
						});
			}

		}
		return jsonArray;
	},	
	refreshData : function() {
		var me = this;
		var objGroupView = me.getGroupView();
		var grid = objGroupView.getGrid();
		if (grid) {
			if (!Ext.isEmpty(me.advSortByData)) {
				appliedSortByJson = me.getSortByJsonForSmartGrid();
				grid.removeAppliedSort();
				grid.applySort(appliedSortByJson);
			} else {
				grid.removeAppliedSort();
			}
		}
		//grid.removeAppliedSort();
		objGroupView.refreshData();
	},
	handleAlertNameChange : function(alertCode,alertName){
		var me = this;
		var objGroupView = me.getGroupView();
		var groupInfo = objGroupView.getGroupInfo();
		me.alertNameValue = alertCode;
		me.alertNameDesc = alertName;
		selectAdvAlertNameCode = alertCode;
		selectAdvAlertNameDesc = alertName;
		me.filterApplied = 'Q';
		me.handleAlertNameFilterSync( 'Q',alertCode,alertName);
		me.setDataForFilter();
		me.applyQuickFilter();
	},
	handleAlertStatus : function(combo) {
		var me = this;
		me.alertStatusVal = combo.getValue();
		me.alertStatusDesc = combo.getRawValue();
		me.filterApplied = 'Q';
		me.setDataForFilter();
		me.applyQuickFilter();
	},
	handleEntryDateChange : function(filterType, btn, opts) {
		var me = this;
		if (filterType == "eventEntryDateQuickFilter") {
			me.dateFilterVal = btn.btnValue;
			me.dateFilterLabel = btn.text;
			me.handleDateChange(btn.btnValue , me.dateFilterLabel);
			me.filterAppiled = 'Q';
			me.datePickerSelectedDate = [];
			me.datePickerSelectedCreationAdvDate = [];
			me.setDataForFilter();
			me.applyQuickFilter();
		} else if (filterType == "entryDateAdvFilter") {

		}
	},
	handleDateChange : function(index,objLabel) {
		var me = this;
		var objDateParams = me.getDateParam(index);
		var datePickerRef = $('#entryDataPicker');

		if (!Ext.isEmpty(objLabel)) {
			me.getDateLabel().setText(getLabel('alertDate', 'Alert Date')
					+ " (" + objLabel + ")");
		}

		var vFromDate = $.datepick.formatDate(strApplicationDateFormat, $.datepick.parseDate('yy-mm-dd', objDateParams.fieldValue1));
		var vToDate = $.datepick.formatDate(strApplicationDateFormat, $.datepick.parseDate('yy-mm-dd', objDateParams.fieldValue2));
		
		if (index == '7') {
			if (objDateParams.operator == 'eq') {
				datePickerRef.setDateRangePickerValue(vFromDate);
				selectedCreationDate = {
						operator : objDateParams.operator,
						fromDate : vFromDate,
						toDate : vFromDate
					};					
			} else {
				datePickerRef.setDateRangePickerValue([vFromDate, vToDate]);
				selectedCreationDate = {
						operator : objDateParams.operator,
						fromDate : vFromDate,
						toDate : vToDate
					};
			}
		} else {
			if (index === '1' || index === '2') {
					datePickerRef.setDateRangePickerValue(vFromDate);
				selectedCreationDate = {
						operator : objDateParams.operator,
						fromDate : vFromDate,
						toDate : vFromDate
					};					
			} else {
				datePickerRef.setDateRangePickerValue([vFromDate, vToDate]);
				selectedCreationDate = {
						operator : objDateParams.operator,
						fromDate : vFromDate,
						toDate : vToDate
					};				
			}
		}
		me.handleCreationDateSync('Q', me.getDateLabel().text, " (" + objLabel + ")", datePickerRef);
	},
	getDateParam : function(index, dateType) {
		var me = this;
		var objDateHandler = me.getDateHandler();
		var strAppDate = dtApplicationDate;
		var dtFormat = strExtApplicationDateFormat;
		var date = new Date(Ext.Date.parse(strAppDate, dtFormat));
		var strSqlDateFormat = 'Y-m-d';
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
				dtJson = objDateHandler.getThisWeekToDate(date);
				fieldValue1 = Ext.Date
						.format(dtJson.fromDate, strSqlDateFormat);
				fieldValue2 = Ext.Date.format(dtJson.toDate, strSqlDateFormat);
				operator = 'bt';
				break;
			case '4' :
				// Last Week To Date
				dtJson = objDateHandler.getLastWeekToDate(date);
				fieldValue1 = Ext.Date
						.format(dtJson.fromDate, strSqlDateFormat);
				fieldValue2 = Ext.Date.format(dtJson.toDate, strSqlDateFormat);
				operator = 'bt';
				break;
			case '5' :
				// This Month
				dtJson = objDateHandler.getThisMonthToDate(date);
				fieldValue1 = Ext.Date
						.format(dtJson.fromDate, strSqlDateFormat);
				fieldValue2 = Ext.Date.format(dtJson.toDate, strSqlDateFormat);
				operator = 'bt';
				break;
			case '6' :
				// Last Month To Date
				dtJson = objDateHandler.getLastMonthToDate(date);
				fieldValue1 = Ext.Date
						.format(dtJson.fromDate, strSqlDateFormat);
				fieldValue2 = Ext.Date.format(dtJson.toDate, strSqlDateFormat);
				operator = 'bt';
				break;
			case '7' :
				// Date Range
				if(!isEmpty(me.datePickerSelectedDate)){
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
				if('creationDate' === dateType  && !isEmpty(me.datePickerSelectedCreationAdvDate)){
					if (me.datePickerSelectedCreationAdvDate.length == 1) {
						fieldValue1 = Ext.Date.format(me.datePickerSelectedCreationAdvDate[0],
								strSqlDateFormat);
						fieldValue2 = fieldValue1;
						operator = 'eq';
					} else if (me.datePickerSelectedCreationAdvDate.length == 2) {
						fieldValue1 = Ext.Date.format(me.datePickerSelectedCreationAdvDate[0],
								strSqlDateFormat);
						fieldValue2 = Ext.Date.format(me.datePickerSelectedCreationAdvDate[1],
								strSqlDateFormat);
						operator = 'bt';
					}
				}
				break;
			case '8' :
				// This Quarter
				dtJson = objDateHandler.getQuarterToDate(date);
				fieldValue1 = Ext.Date
						.format(dtJson.fromDate, strSqlDateFormat);
				fieldValue2 = Ext.Date.format(dtJson.toDate, strSqlDateFormat);
				operator = 'bt';
				break;
			case '9' :
				// Last Quarter To Date
				dtJson = objDateHandler.getLastQuarterToDate(date);
				fieldValue1 = Ext.Date
						.format(dtJson.fromDate, strSqlDateFormat);
				fieldValue2 = Ext.Date.format(dtJson.toDate, strSqlDateFormat);
				operator = 'bt';
				break;
			case '10' :
				// This Year
				dtJson = objDateHandler.getYearToDate(date);
				fieldValue1 = Ext.Date
						.format(dtJson.fromDate, strSqlDateFormat);
				fieldValue2 = Ext.Date.format(dtJson.toDate, strSqlDateFormat);
				operator = 'bt';
				break;
			case '11' :
				// Last Year To Date
				dtJson = objDateHandler.getLastYearToDate(date);
				fieldValue1 = Ext.Date
						.format(dtJson.fromDate, strSqlDateFormat);
				fieldValue2 = Ext.Date.format(dtJson.toDate, strSqlDateFormat);
				operator = 'bt';
				break;
			case '14' :
			    //last month only
				dtJson = objDateHandler.getLastMonthStartAndEndDate(date);
				fieldValue1 = Ext.Date
						.format(dtJson.fromDate, strSqlDateFormat);
				fieldValue2 = Ext.Date.format(dtJson.toDate, strSqlDateFormat);
				operator = 'bt';
				break;
			 case '12' :
				var fromDate = new Date(Ext.Date.parse(latestFromDate, dtFormat));
				var toDate = new Date(Ext.Date.parse(latestToDate, dtFormat));
				fieldValue1 = Ext.Date.format(
						fromDate,
						strSqlDateFormat);
				fieldValue2 = Ext.Date.format(
						toDate,
						strSqlDateFormat);
				operator = 'bt';
				label = 'Latest';	
			}
		retObj.fieldValue1 = fieldValue1;
		retObj.fieldValue2 = fieldValue2;
		retObj.operator = operator;
		return retObj;
	},
	creationDateChange : function(btn, opts) {
		var me = this;
		me.creationDateFilterVal = btn.btnValue;
		me.creationDateFilterLabel = btn.text;
		me.handleCreationDateChange(btn.btnValue);
	},
	handleCreationDateChange : function(index) {
		var me = this;
		var dateToField;
		var objDateParams = me.getDateParam(index, 'creationDate');

		if (!Ext.isEmpty(me.creationDateFilterLabel)) {
			$('label[for="CreationDateLabel"]').text(getLabel('creationDate',
					'Alert Date')
					+ " (" + me.creationDateFilterLabel + ")");
		}
				
		var vFromDate = $.datepick.formatDate(strApplicationDateFormat, $.datepick.parseDate('yy-mm-dd', objDateParams.fieldValue1));
		var vToDate = $.datepick.formatDate(strApplicationDateFormat, $.datepick.parseDate('yy-mm-dd', objDateParams.fieldValue2));
		
		var filterOperator = objDateParams.operator;

		if (index == '7') {
			if (filterOperator == 'eq') {
				$('#entryDateFrom').datepick('setDate', vFromDate);
			} else {
				$('#entryDateFrom').datepick('setDate', [vFromDate, vToDate]);
			}
			if (filterOperator == 'eq')
				dateToField = "";
			else
				dateToField = vToDate;
			selectedCreationDate = {
				operator : filterOperator,
				fromDate : vFromDate,
				toDate : dateToField,
				dateLabel : me.creationDateFilterLabel,
				dropdownIndex : index
			};
		} else {
			if (index === '1' || index === '2') {
				$('#creationDate').datepick('setDate', vFromDate);
			} else {
				$('#creationDate').datepick('setDate', [vFromDate, vToDate]);
			}
			if (filterOperator == 'eq')
				dateToField = "";
			else
				dateToField = vToDate;
			selectedCreationDate = {
				operator : filterOperator,
				fromDate : vFromDate,
				toDate : dateToField,
				dateLabel : me.creationDateFilterLabel,
				dropdownIndex : index
			};
		}
	},
	searchActionClicked : function(me) {
		var me = this, objGroupView = null, savedFilterCombobox = me
				.getFilterView().down('combo[itemId="savedFiltersCombo"]');
		var SaveFilterChkBoxVal=$("input[type='checkbox'][id='saveFilterChkBox']").is(':checked');
		me.handleAlertNameFilterSync( 'A',selectAdvAlertNameCode,selectAdvAlertNameDesc);
		if(SaveFilterChkBoxVal === true){
			me.handleSaveAndSearchAction();
		}
		else{
			me.doSearchOnly();
		if (savedFilterCombobox)
			savedFilterCombobox.setValue('');
		objGroupView = me.getGroupView();
		objGroupView.setFilterToolTip('');
		$('#advancedFilterPopup').dialog("close"); 
		}
	},
	doSearchOnly : function() {
		var me = this;
		//me.handleDateChange(me.creationDateFilterVal,me.creationDateFilterLabel);
		me.populateQuickFilterFields();
		me.applyAdvancedFilter();
	},
	applyAdvancedFilter : function(filterData) {
		//var me = this;
		//var objGroupView = me.getGroupView();
		var me = this, objGroupView = me.getGroupView();
		me.filterApplied = 'A';
		me.setDataForFilter(filterData);
		//me.resetAllFields();
		me.refreshData();
		if (objGroupView)
			objGroupView.toggleFilterIcon(true);
		objGroupView.setFilterToolTip(me.showAdvFilterCode || '');
	},
	isInCondition : function(data) {
		var retValue = false;
		var reg = new RegExp(/^\((\d\d*,)*\d\d*\)$/);
		var displayType = data.displayType;
		var strValue = data.value1;
		if (displayType && (displayType === 4 || displayType === 3)) {
			retValue = true;
		}
		return retValue;
	},
	saveAndSearchActionClicked : function(me) {
		me.handleSaveAndSearchAction();
	},
	handleSaveAndSearchAction : function(btn) {
		var me = this;
		var callBack = me.postDoSaveAndSearch;
		var strFilterCodeVal = null;
		//if (me.filterCodeValue === null) {
			var FilterCode = $("#savedFilterAs").val();
			if (Ext.isEmpty(FilterCode)) {
				paintError('#advancedFilterErrorDiv',
						'#advancedFilterErrorMessage', getLabel(
								'filternameMsg', 'Please Enter Filter Name'));
				markRequired('#savedFilterAs');
				return;
			} else {
				hideErrorPanel("advancedFilterErrorDiv");
				me.filterCodeValue = FilterCode;
				strFilterCodeVal = me.filterCodeValue;
			}
		//} else {
			//strFilterCodeVal = me.filterCodeValue;
		//}
		me.savePrefAdvFilterCode = strFilterCodeVal;
		/*if (Ext.isEmpty(strFilterCodeVal)) {
			paintError('#advancedFilterErrorDiv',
					'#advancedFilterErrorMessage', getLabel('filternameMsg',
							'Please Enter Filter Name'));
			return;
		} else {*/
			hideErrorPanel("advancedFilterErrorDiv");
			me.postSaveFilterRequest(me.filterCodeValue, callBack);
		//}

	},
	postSaveFilterRequest : function(FilterCodeVal, fncallBack) {
		var me = this;
		strUrl = Ext.String.format(me.strModifySavedFilterUrl, FilterCodeVal);
		var objJson;
		objJson = getAdvancedFilterValueJson(FilterCodeVal,me.creationDateFilterVal);
		Ext.Ajax.request({
					url : strUrl,
					method : 'POST',
					jsonData : Ext.encode(objJson),
					success : function(response) {
						var responseData = Ext.decode(response.responseText);
						var isSuccess;
						var title, strMsg, imgIcon;
						if (responseData.d.filters
								&& responseData.d.filters.success)
							isSuccess = responseData.d.filters.success;

						if (isSuccess && isSuccess === 'N') {
							title = getLabel('instrumentSaveFilterPopupTitle',
									'Message');
							strMsg = responseData.d.filters.error.errorMessage;
							imgIcon = Ext.MessageBox.ERROR;
							Ext.MessageBox.show({
										title : title,
										msg : strMsg,
										width : 200,
										buttons : Ext.MessageBox.OK,
										cls : 'ux_popup',
										icon : imgIcon
									});

						}

						if (FilterCodeVal && isSuccess && isSuccess === 'Y') {
							$('#advancedFilterPopup').dialog('close');
							fncallBack.call(me);
							//filterGrid.getStore().reload();
							me.updateSavedFilterComboInQuickFilter();
						}
					},
					failure : function() {
						var errMsg = "";
						Ext.MessageBox.show({
									title : getLabel(
											'instrumentErrorPopUpTitle',
											'Error'),
									msg : getLabel('instrumentErrorPopUpMsg',
											'Error while fetching data..!'),
									buttons : Ext.MessageBox.OK,
									cls : 'ux_popup',
									icon : Ext.MessageBox.ERROR
								});
					}
				});

	},
	postDoSaveAndSearch : function() {
		var me = this;
		//me.doSearchOnly();
		var me = this, objGroupView = null, savedFilterCombobox = me
				.getFilterView().down('combo[itemId="savedFiltersCombo"]');
		var objAdvSavedFilterComboBox, blnOptionPresent = false, arrValues = [];
		if (savedFilterCombobox) {
			savedFilterCombobox.getStore().reload();
			savedFilterCombobox.setValue(me.filterCodeValue);
		}
		var objAdvSavedFilterComboBox = $("#msSavedFilter");
		if (objAdvSavedFilterComboBox) {
			blnOptionPresent = $("#msSavedFilter option[value='"
					+ me.filterCodeValue + "']").length > 0;
			if (blnOptionPresent === true) {
				objAdvSavedFilterComboBox.val(me.filterCodeValue);
			} else if (blnOptionPresent === false) {
				$(objAdvSavedFilterComboBox).append($('<option>', {
							value : me.filterCodeValue,
							text : me.filterCodeValue
						}));

				if (!Ext.isEmpty(me.filterCodeValue))
					arrValues.push(me.filterCodeValue);
				objAdvSavedFilterComboBox.val(arrValues);
				objAdvSavedFilterComboBox.multiselect("refresh");
			}
		}
		me.doSearchOnly();
		objGroupView = me.getGroupView();
		objGroupView.setFilterToolTip(me.filterCodeValue || '');
	},
	
	doHandleSavedFilterItemClick : function(filterCode, filterDesc) {
		var me = this;
		if (!Ext.isEmpty(filterCode)) {
			me.savePrefAdvFilterCode = filterCode
			me.showAdvFilterCode = filterCode;
			me.resetAllFields();
			me.getSavedFilterData(filterCode, me.populateSavedFilter, true);
		}
		
		me.savePrefAdvFilterCode = filterCode;
		me.showAdvFilterCode = filterCode;
	},
	getSavedFilterData : function(filterCode, fnCallback, applyAdvFilter) {
		var me = this;
		filterCode = Ext.util.Format.htmlDecode(filterCode);
		var objJson;
		var strUrl = Ext.String.format(me.strGetSavedFilterUrl, filterCode);
		Ext.Ajax.request({
					url : strUrl,
					method : 'GET',
					success : function(response) {
						var responseData = Ext.decode(response.responseText);
						fnCallback.call(me, filterCode, responseData,
								applyAdvFilter);
					},
					failure : function() {
						var errMsg = "";
						Ext.MessageBox.show({
									title : getLabel(
											'instrumentErrorPopUpTitle',
											'Error'),
									msg : getLabel('instrumentErrorPopUpMsg',
											'Error while fetching data..!'),
									buttons : Ext.MessageBox.OK,
									cls : 'ux_popup',
									icon : Ext.MessageBox.ERROR
								});
					}
				});
	},
	populateSavedFilter : function(filterCode, filterData, applyAdvFilter) {
		var me = this;
		var fieldName = '';
		var fieldVal = '';
		var fieldSecondVal = '';
		var dateVal = '';
		var currentFilterData = '';
		var fieldType = '';
		var columnId = '';
		var sortByOption = '';
		var buttonText = '';
		var operatorValue = '';
		var objSellerAutoComp = null;
		for (i = 0; i < filterData.filterBy.length; i++) {
			fieldName = filterData.filterBy[i].field;
			fieldVal = decodeURIComponent(filterData.filterBy[i].value1);
			fieldSecondVal = filterData.filterBy[i].value2;
			fieldDisplayVal = filterData.filterBy[i].displayValue1;
			currentFilterData = filterData.filterBy[i];
			operatorValue = filterData.filterBy[i].operator;
			if(fieldName === 'clientFilterId'){
				if(isClientUser()){
					$("#advclient").val(fieldVal);
					me.clientFilterVal = fieldVal;
					$("#advclient").niceSelect('update');
				}
				else{
					$("#advclientauto").val(fieldSecondVal);
					
					selectAdvClientDesc = fieldSecondVal;
					selectAdvClientCode = fieldVal;
				}
			}
			else if(fieldName === 'alertName' || fieldName === 'userName'){
				$("#advalertname").val(fieldDisplayVal);
				selectAdvAlertNameDesc = fieldDisplayVal;
				selectAdvAlertNameCode = fieldVal;
			}
			else if(fieldName === 'alertStatus'){
				$("#advalertstatus").val(fieldVal);
				selectAdvAlertStatusDesc = fieldDisplayVal;
				selectAdvAlertStatusCode = fieldVal;
			}
			else if(fieldName === 'alertMode'){
				$("#advalertmode").val(fieldVal);
				selectAdvAlertModeDesc = fieldDisplayVal;
				selectAdvAlertModeCode = fieldVal;
			}
			else if(fieldName === 'alertTrackId'){
				$("#advtrackingid").val(fieldVal);
				selectAdvAlertTrackIdDesc = fieldDisplayVal;
				selectAdvAlertTrackIdCode = fieldVal;
			}
			if(fieldName === 'alertDate'){
				var vFromDate = Ext.util.Format.date(Ext.Date.parse(
						filterData.filterBy[i].value1, 'Y-m-d'),
						strExtApplicationDateFormat);
				var vToDate = Ext.util.Format.date(Ext.Date.parse(
						filterData.filterBy[i].value2, 'Y-m-d'),
						strExtApplicationDateFormat);
				var index = filterData.filterBy[i].dateVal;
				filterOperator = operatorValue;
				me.creationDateFilterVal = index;				
				me.creationDateFilterLabel = me.getLabel(index);
				me.dateFilterVal = index;
				me.dateFilterLabel = me.getLabel(index);
				$('label[for="CreationDateLabel"]').text(getLabel('creationDate','Alert Date') + " (" + me.dateFilterLabel + ")");
				if (index == '7') {
					if (filterOperator == 'eq') {
						$('#creationDate').val(vFromDate);
						$('#entryDataPicker').val(vFromDate);
					} else {
						$('#creationDate').val([vFromDate+" to "+ vToDate]);
						$('#entryDataPicker').val([vFromDate+" to "+vToDate]);
						
					}
					if (filterOperator == 'eq')
						dateToField = "";
					else
						dateToField = vToDate;
					selectedCreationDate = {
						operator : filterOperator,
						fromDate : Ext.util.Format.date(vFromDate,'Y-m-d'),
						toDate : Ext.util.Format.date(dateToField,'Y-m-d')
					};
					if (vFromDate) {
						me.datePickerSelectedDate[0] = new Date(Ext.Date.parse(vFromDate, strExtApplicationDateFormat))
					}
					if (dateToField) {
						me.datePickerSelectedDate[1] = new Date(Ext.Date.parse(dateToField, strExtApplicationDateFormat))
					}
				} else {
					if (index === '1' || index === '2' || index === '12') {
						if (index === '12') {
							$('#creationDate').val('Till' + '  ' + vFromDate);
							$('#entryDataPicker').val('Till' + '  ' + vFromDate);
						} else {
							$('#creationDate').val(vFromDate);
							$('#entryDataPicker').val(vFromDate);
						}
					} else {
						$('#creationDate').val([vFromDate +' to '+ vToDate]);
						$('#entryDataPicker').val([vFromDate+' to '+ vToDate]);
					}
					if (filterOperator == 'eq')
						dateToField = "";
					else
						dateToField = vToDate;
					selectedCreationDate = {
						operator : filterOperator,
						fromDate : Ext.util.Format.date(vFromDate,'Y-m-d'),
						toDate : Ext.util.Format.date(dateToField,'Y-m-d')
					};
				}
			}
		
			if (!Ext.isEmpty(filterCode)) {
				$('#savedFilterAs').val(filterCode);
			}
		}
		if (!Ext.isEmpty(filterCode)) {
			$('#savedFilterAs').val(filterCode);
			$("#msSavedFilter option[value='"+filterCode+"']").attr("selected",true);
			$("#msSavedFilter").multiselect("refresh");
			var saveFilterChkBox = $("input[type='checkbox'][id='saveFilterChkBox']");
			saveFilterChkBox.prop('checked', true);
			
			me.populateQuickFilterFields();
		}
		if (applyAdvFilter){
			me.showAdvFilterCode = filterCode;
			//me.applyAdvancedFilter(filterData);
		}
	},
	getLabel : function(dateVal) {
		var objDateLbl = {
				'12' : getLabel('latest', 'Latest'),
				'1' : getLabel('today', 'Today'),
				'2' : getLabel('yesterday', 'Yesterday'),
				'3' : getLabel('thisweek', 'This Week'),
				'4' : getLabel('lastweektodate', 'Last Week To Date'),
				'5' : getLabel('thismonth', 'This Month'),
				'6' : getLabel('lastMonthToDate', 'Last Month To Date'),
				'8' : getLabel('thisquarter', 'This Quarter'),
				'9' : getLabel('lastQuarterToDate', 'Last Quarter To Date'),
				'10' : getLabel('thisyear', 'This Year'),
				'11' : getLabel('lastyeartodate', 'Last Year To Date'),
				'7' : getLabel('daterange', 'Date Range')
		};
		return objDateLbl[dateVal];
	},
	sendUpdatedOrderJsonToDb : function() {
		var me = this;
		var objJson = {};
		var FiterArray = [];
		$("#msSavedFilter option").each(function() {
					FiterArray.push($(this).val());
				});
		objJson.filters = FiterArray;
		Ext.Ajax.request({
			url : 'services/userpreferences/alertMonitor/groupViewAdvanceFilter.json',
			method : 'POST',
			jsonData : objJson,
			async : false,
			success : function(response) {
				me.updateSavedFilterComboInQuickFilter();
				me.resetAllFields();
			},
			failure : function() {
				// console.log("Error Occured - Addition
				// Failed");

			}

		});
	},
	handleSavedFilterClick : function() {
		var me = this;
		var savedFilterVal = $("#msSavedFilter").val();
		me.resetAllFields();
		me.filterCodeValue = null;

		var filterCodeRef = $("input[type='text'][id='savedFilterAs']");
		if (!Ext.isEmpty(filterCodeRef)) {
			filterCodeRef.val(savedFilterVal);
			$("#savedFilterlbl").addClass("required");
		}

		var saveFilterChkBoxRef = $("input[type='checkbox'][id='saveFilterChkBox']");
		if (!Ext.isEmpty(saveFilterChkBoxRef) && !Ext.isEmpty(savedFilterVal))
			saveFilterChkBoxRef.prop('checked', true);

		var applyAdvFilter = false;
		me.filterCodeValue = savedFilterVal;
		me.getSavedFilterData(savedFilterVal, this.populateSavedFilter,
				applyAdvFilter);
	},
	
	deleteFilterSet : function(filterCode) {
		var me = this;
		var objFilterName;
		var savedFilterCombobox = me.getFilterView().down('combo[itemId="savedFiltersCombo"]');
		var objComboStore=null;
		if (!Ext.isEmpty(filterCode))
			objFilterName = filterCode;
		me.filterCodeValue = null;
		
		if (me.savePrefAdvFilterCode == objFilterName) {
			me.advFilterData = [];
			me.filterApplied = 'A';
			me.refreshData();
		}
		
		if (savedFilterCombobox) {
			objComboStore = savedFilterCombobox.getStore();
			objComboStore.removeAt(objComboStore.find('filterName',objFilterName));
			savedFilterCombobox.setValue('');
		}
		
		//var store = grid.getStore();
		me.deleteFilterCodeFromDb(objFilterName);
		me.sendUpdatedOrderJsonToDb();
		//store.reload();
	},
	deleteFilterCodeFromDb : function(objFilterName) {
		var me = this;
		if (!Ext.isEmpty(objFilterName)) {
			var strUrl = me.strRemoveSavedFilterUrl;
			strUrl = Ext.String.format(strUrl, objFilterName);
			Ext.Ajax.request({
						url : strUrl,
						method : 'POST',
						success : function(response) {

						},
						failure : function(response) {
							// console.log('Bad : Something went wrong with your
							// request');
						}
					});
		}
	},
	viewFilterData : function(grid, rowIndex) {
		var me = this;
		me.resetAllFields();
		me.filterCodeValue = null;
		var record = grid.getStore().getAt(rowIndex);
		var filterCode = record.data.filterName;
		var applyAdvFilter = false;
		me.getSavedFilterData(filterCode, this.populateSavedFilter,
				applyAdvFilter);
		changeAdvancedFilterTab(1);
	},
	editFilterData : function(grid, rowIndex) {
		var me = this;
		me.resetAllFields();
		me.filterCodeValue = null;
		var record = grid.getStore().getAt(rowIndex);
		var filterCode = record.data.filterName;

		var filterCodeRef = $("input[type='text'][id='savedFilterAs']");
		if (!Ext.isEmpty(filterCodeRef)) {
			filterCodeRef.val(filterCode);
			filterCodeRef.prop('disabled', true);
		}
		var applyAdvFilter = false;

		me.filterCodeValue = filterCode;

		me.getSavedFilterData(filterCode, this.populateSavedFilter,
				applyAdvFilter);
		changeAdvancedFilterTab(1);

	},
	searchFilterData : function(filterCode) {
		var me = this;
		filterCode = Ext.util.Format.htmlEncode(filterCode);
		var emptyBtn = '';
		var currentBtn = '';
		var filterPresentOnToolbar = false;
		if (!Ext.isEmpty(filterCode)) {
			var objToolbar = me.getSavedFiltersToolBar();
			var filterView = me.getAlertMonitorFilterView();
			if (filterView)
				filterView.highlightSavedFilter(filterCode);
			if (!Ext.isEmpty(objToolbar)) {
				var tbarItems = objToolbar.items.items;
				if (tbarItems.length >= 1) {
					for (var index = 0; index < 2; index++) {
						currentBtn = tbarItems[index];
						if (currentBtn) {
							if (currentBtn.itemId === filterCode) {
								filterPresentOnToolbar = true;
								me.doHandleSavedFilterItemClick(filterCode,
										currentBtn, true);
							}
						}
					}
				}

				if (!filterPresentOnToolbar) {
					me
							.doHandleSavedFilterItemClick(filterCode, emptyBtn,
									false);
				}

			}
		}
	},
	findNodeInJsonData : function(arr, paramName, key) {
		var reqJson = null;
		for (var ai, i = arr.length; i--;) {
			if ((ai = arr[i]) && ai[paramName] == key) {
				reqJson = ai;
			}
		}
		return reqJson;
	},
	removeFromArrJson : function(arr, paramName, key){
		for (var ai, i = arr.length; i--;) {
			if ((ai = arr[i]) && ai[paramName] == key) {
				arr.splice(i, 1);
			}
		}
		return arr;
	},
	updateQuickClientName : function(value,desc){
		var me = this;
		var objOfAlertMonitorFilterView = me.getAlertMonitorFilterView();
		if(isClientUser()){
			if (!Ext.isEmpty(objOfAlertMonitorFilterView))
				var quickClientCombo = objOfAlertMonitorFilterView.down('combobox[itemId="quickFilterClientCombo"]');
			if(!Ext.isEmpty(value) && !Ext.isEmpty(quickClientCombo))
				quickClientCombo.setValue(value);
			me.clientValue = value;
		}
		else{
			var quickClientAutoComp;
			if (!Ext.isEmpty(objOfAlertMonitorFilterView)){
				 quickClientAutoComp = objOfAlertMonitorFilterView.down('AutoCompleter[itemId="clientAutoCompleter"]');
			if(!Ext.isEmpty(value) && !Ext.isEmpty(quickClientAutoComp))
				quickClientAutoComp.setValue(value);
			quickClientAutoComp.setRawValue(desc);
			me.clientValue = value;
			}
		}
	},
	handleClearPreferences : function() {
		var me = this;
		me.doClearPreferences();
		me.disablePreferencesButton("savePrefMenuBtn",false);
		me.disablePreferencesButton("clearPrefMenuBtn",true);	
	},
	doClearPreferences : function() {
		var me = this;
		var me = this;
		var arrPref = me.getPreferencesToSave(false);
		me.preferencesHandler.clearPagePreferences(me.strPageName,arrPref,null,null,me,true);

	},
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
			var colPrefModuleName = (subGroupInfo.groupCode === 'all') ? (subGroupInfo.groupCode) : subGroupInfo.groupCode;
			objFilterPref = me.getFilterPreferences();
			arrPref.push({
						"module" : "groupViewFilterPref",
						"jsonPreferences" : objFilterPref
					});
			
			if (groupInfo.groupTypeCode && subGroupInfo.groupCode) {
				if (groupInfo.groupTypeCode !== 'ALERTMONITOR_OPT_ADVFILTER'
					|| (groupInfo.groupTypeCode == 'ALERTMONITOR_OPT_ADVFILTER' && subGroupInfo.groupCode == 'all')) {
				
				arrPref.push({
						"module" : "groupByPref",
						"jsonPreferences" : {
							groupCode : groupInfo.groupTypeCode,
							subGroupCode : subGroupInfo.groupCode
						}
					});
				
				arrPref.push({
							"module" : colPrefModuleName,
							"jsonPreferences" : {
								 'gridCols' : gridState.columns,
								 'pgSize' : gridState.pageSize,
								 'sortState':gridState.sortState,
								 'gridSetting' : groupView.getGroupViewState().gridSetting
							}
						});
				}
			}
		}
		return arrPref;
	},
	getFilterPreferences : function() {
		var me = this;
		var advFilterCode = null;
		var objFilterPref = {},strSqlDateFormat = 'Y-m-d';
		
		if (!Ext.isEmpty(me.savePrefAdvFilterCode)) {
			advFilterCode = me.savePrefAdvFilterCode;
		}
		var quickPref = {};
		quickPref.client = me.clientFilterVal;
		quickPref.clientDesc = me.clientFilterDesc;
		quickPref.alertCode = me.alertNameValue;
		quickPref.alertName = me.alertName;
		quickPref.entryDate = me.dateFilterVal;
		quickPref.alertStatusCode = me.alertStatusVal;
		quickPref.alertStatusDesc = me.alertStatusDesc;
		if (me.dateFilterVal === '7') {
			me.dateFilterFromVal = Ext.Date.format(me.datePickerSelectedDate[0],
							strSqlDateFormat);
			me.dateFilterToVal = Ext.Date.format(me.datePickerSelectedDate[1],
							strSqlDateFormat);				
			if (me.datePickerSelectedDate.length == 1) {
				quickPref.entryDateFrom = me.dateFilterFromVal;	
			}	
			else if(me.datePickerSelectedDate.length == 2){
				quickPref.entryDateFrom = me.dateFilterFromVal;	
				quickPref.entryDateTo = me.dateFilterToVal;			
			}
		}
		objFilterPref.advFilterCode = advFilterCode;
		objFilterPref.quickFilter = quickPref;
		
		return objFilterPref;
	},
	handleSavePreferences : function() {
		var me = this;
		me.disablePreferencesButton("savePrefMenuBtn",true);
		me.disablePreferencesButton("clearPrefMenuBtn",false);	
		me.doSavePreferences();
	},
	doSavePreferences : function() {
		var me = this;
		var arrPref = me.getPreferencesToSave(false);
		me.preferencesHandler.savePagePreferences(me.strPageName,arrPref,null,null,me,true);
	},
	updateFilterConfig : function() {
		var me = this;
		var arrJsn = new Array();
		var loginDateValArray = [];
		// TODO : Localization to be handled..
		var objDateLbl = {
			'12' : getLabel('latest', 'Latest'),	
			'1' : getLabel('today', 'Today'),
			'2' : getLabel('yesterday', 'Yesterday'),
			'3' : getLabel('thisweek', 'This Week'),
			'4' : getLabel('lastweektodate', 'Last Week To Date'),
			'5' : getLabel('thismonth', 'This Month'),
			'6' : getLabel('lastMonthToDate', 'Last Month To Date'),
			'14' : getLabel('lastmonthonly', 'Last Month Only'),
			'8' : getLabel('thisquarter', 'This Quarter'),
			'9' : getLabel('lastQuarterToDate', 'Last Quarter To Date'),
			'10' : getLabel('thisyear', 'This Year'),
			'11' : getLabel('lastyeartodate', 'Last Year To Date'),
			'7' : getLabel('daterange', 'Date Range')
		};
		if (!Ext.isEmpty(objAlertMonitorFilterPref)) {
			var objJsonData = Ext.decode(objAlertMonitorFilterPref);
			var data = objJsonData.d.preferences.groupViewFilterPref;
			if (!Ext.isEmpty(data)) {
				var strDtValue = data.quickFilter.entryDate;
				var strDtFrmValue = data.quickFilter.entryDateFrom;
				var strDtToValue = data.quickFilter.entryDateTo;
				var strclient = data.quickFilter.client;
				var strclientDesc = data.quickFilter.clientDesc;
				var strAlert = data.quickFilter.alertCode;
				var strAlertDesc = data.quickFilter.alertName;
				var strAlertStatusCode = data.quickFilter.alertStatusCode;
				var strAlertStatusDesc = data.quickFilter.alertStatusDesc;
				
				me.clientFilterVal = strclient;
				me.clientFilterDesc = strclientDesc;
				me.alertNameValue = strAlert;
				me.alertName = strAlertDesc;
				me.alertStatusVal = strAlertStatusCode;
				me.alertStatusDesc = strAlertStatusDesc;
				
				if (!Ext.isEmpty(strDtValue)) {
					me.dateFilterLabel = objDateLbl[strDtValue];
					me.dateFilterVal = strDtValue;
					if (strDtValue === '7') {
						if (!Ext.isEmpty(strDtFrmValue))
							me.dateFilterFromVal = strDtFrmValue;
							me.datePickerSelectedDate[0]=Ext.Date.parse(strDtFrmValue, 'Y-m-d')
						if (!Ext.isEmpty(strDtToValue))
							me.dateFilterToVal = strDtToValue;
							me.datePickerSelectedDate[1]=Ext.Date.parse(strDtToValue, 'Y-m-d')
					}
				}
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
				strOpt = 'bt';
				if (!Ext.isEmpty(me.dateFilterVal)
						&& !Ext.isEmpty(me.dateFilterFromVal)) {
					strVal1 = me.dateFilterFromVal;

					if (!Ext.isEmpty(me.dateFilterToVal)) {
						// strOpt = 'bt';
						strVal2 = me.dateFilterToVal;
					}
				}
			}
			if ((!Ext.isEmpty(strVal1) && (strOpt === 'eq' || strOpt === 'le'))
					|| (!Ext.isEmpty(strVal1) && !Ext.isEmpty(strVal2) && strOpt === 'bt'))
					
					if(!Ext.isEmpty(strVal1))
					loginDateValArray.push(strVal1)
				if(!Ext.isEmpty(strVal2))
					loginDateValArray.push(strVal2)
					
				arrJsn.push({
							paramName : 'alertDate',
							paramValue1 : strVal1,
							paramValue2 : strVal2,
							operatorValue : strOpt,
							dataType : 'D',
							paramIsMandatory : true,
							paramFieldLable : getLabel('alertDate', 'Alert Date'),
							paramFieldValue : loginDateValArray.toString()
						});
		}

		if(!Ext.isEmpty(me.clientFilterVal) && me.clientFilterVal!= 'all' ){
			arrJsn.push({
				paramName : 'clientFilterId',
				operatorValue : 'eq',
				paramValue1 : encodeURIComponent(me.clientFilterVal.replace(new RegExp("'", 'g'), "\''")),
				dataType : 'S',
				paramFieldLable : getLabel('clientId', 'Company Name'),
				paramFieldValue : me.clientFilterDesc
			});
		}
		if(!Ext.isEmpty(me.alertNameValue) && me.alertNameValue!= 'all' ){
			arrJsn.push({
				paramName : 'alertName',
				operatorValue : 'lk',
				paramValue1 : encodeURIComponent(me.alertNameValue.replace(new RegExp("'", 'g'), "\''")).toUpperCase(),
				dataType : 'S',
				paramFieldLable : getLabel('alertName', 'Alert Name'),
				paramFieldValue : me.alertNameDesc
			});
		}
		if(!Ext.isEmpty(me.alertStatusVal) && me.alertStatusVal!= 'all' ){
			arrJsn.push({
				paramName : 'alertStatus',
				operatorValue : 'lk',
				paramValue1 : encodeURIComponent(me.alertStatusVal.replace(new RegExp("'", 'g'), "\''")).toUpperCase(),
				dataType : 'S',
				paramFieldLable : getLabel('alertStatus', 'Status'),
				paramFieldValue : me.alertStatusDesc
			});
		}

		me.filterData = arrJsn;
	},
	handleReportAction : function( btn, opts )
	{
		var me = this;
		me.downloadReport( btn.itemId );
	},
	downloadReport : function(actionName) {
		var me = this;
		var withHeaderFlag = document.getElementById("headerCheckbox").checked;
		var arrExtension = {
				downloadCsv : 'csv',
				downloadPdf : 'pdf',
				downloadXls : 'xls',
				downloadTsv : 'tsv'
		};
		var currentPage = 1;
		var strExtension = '';
		var strUrl = '';
		var strSelect = '';
		var activeCard = '';

		strExtension = arrExtension[actionName];
		strUrl = 'services/alertMonitor/getDynamicReport.' + strExtension;
		strUrl += '?$skip=1';

		var strOrderBy = me.reportGridOrder;
		if(!Ext.isEmpty(strOrderBy)){
			var orderIndex = strOrderBy.indexOf('orderby');
			if(orderIndex > 0){
				strOrderBy = strOrderBy.substring(orderIndex,strOrderBy.length);
				var indexOfamp = strOrderBy.indexOf('&$');
				if(indexOfamp > 0)
					strOrderBy = strOrderBy.substring(0,indexOfamp);
				strUrl += '&$'+strOrderBy;
			}				
		}
		var groupView = me.getGroupView();
		
		var groupInfo = groupView.getGroupInfo();
		var subGroupInfo = groupView.getSubGroupInfo();
		
		strUrl += me.generateFilterUrl(subGroupInfo, groupInfo);
		
		var grid = groupView.getGrid();
		arrColumn = grid.getAllVisibleColumns();

		if (arrColumn) {
			var col = null;
			var colArray = new Array();
			for (var i = 0; i < arrColumn.length; i++) {
				col = arrColumn[i];
				if (col.dataIndex && arrDownloadReportColumn[col.dataIndex])
					colArray.push(arrDownloadReportColumn[col.dataIndex]);
			}
			if (colArray.length > 0)
				strSelect = '&$select=[' + colArray.toString() + ']';
		}
		strUrl = strUrl + strSelect;
		form = document.createElement('FORM');
		form.name = 'frmMain';
		form.id = 'frmMain';
		form.method = 'POST';
		form.appendChild(createFormField('INPUT', 'HIDDEN',
				csrfTokenName, tokenValue));
		form.appendChild(createFormField('INPUT', 'HIDDEN', 'txtCurrent',
				currentPage));
		form.appendChild(createFormField('INPUT', 'HIDDEN', 'txtCSVFlag',
			withHeaderFlag));
		form.action = strUrl;
		document.body.appendChild(form);
		form.submit();
		document.body.removeChild(form);
	},
	handleClearSettings : function() {
		var me = this, objGroupView = me.getGroupView();
		var datePickerRef = $('#entryDataPicker');
		var isHandleClearSettings = true;
		if(isClientUser()){
			var clientComboBox = me.getAlertMonitorFilterView().down('combo[itemId="clientCombo"]');
			me.clientFilterVal = 'all';
			selectedFilterClientDesc = "";
			selectedFilterClient = "";
			clientComboBox.setValue(me.clientFilterVal);
		} else {
            var clientComboBox = me.getAlertMonitorFilterView().down('combo[itemId="clientComboAuto]')
            clientComboBox.reset();
			me.clientFilterVal = '';
			selectedFilterClientDesc = "";
			selectedFilterClient = "";
		}
		selectAdvClientDesc = "";
		selectAdvClientCode = "";
		
		var objAlertAutoComp = me.getAlertMonitorFilterView().down('AutoCompleter[itemId="alertNameFltId"]');
		me.alertNameValue = '';
		objAlertAutoComp.setValue(me.alertNameValue);
		objAlertAutoComp.setRawValue(me.alertNameValue);
		selectAdvAlertNameCode ='';
		selectAdvAlertNameDesc = '';
		
		var alertStatusToolBar = me.getAlertMonitorFilterView().down('combo[itemId=alertStatusToolBar]');
		alertStatusToolBar.setValue('E');
		me.alertStatusVal = 'E';
		me.alertStatusDesc = 'Failure';
		selectAdvAlertStatusDesc='';
		selectAdvAlertStatusCode='';
		selectAdvAlertModeDesc='';
		selectAdvAlertModeCode='';
		selectAdvAlertTrackIdDesc = '';
		selectAdvAlertTrackIdCode = '';
		me.savedFilterVal = '';
		var savedFilterComboBox = me.getAlertMonitorFilterView().down('combo[itemId="savedFiltersCombo"]');
		savedFilterComboBox.setValue(me.savedFilterVal);
		
		me.dateFilterVal = '1';
		me.dateFilterLabel = 'Today';
		me.handleDateChange(me.dateFilterVal,me.dateFilterLabel);
		//datePickerRef.val('');
		//me.getDateLabel().setText(getLabel('dateToday', 'Last Login'));
		me.filterApplied = 'Q';

		if (objGroupView)
			objGroupView.toggleFilterIcon(false);
		objGroupView.setFilterToolTip('');
		
		me.resetAllFields(isHandleClearSettings); 
		me.setDataForFilter();
		me.refreshData();
		
	},
	setClientComboValue : function(){
		var me = this;
		var objClientCombo;
		var objFilterView = me.getAlertMonitorFilterView();
		if(!Ext.isEmpty(objFilterView))
			objClientCombo = objFilterView.down('combo[itemId="quickFilterClientCombo"]');
		if(!Ext.isEmpty(objClientCombo)){
			objClientCombo.select(objClientCombo.getStore().getAt(0));
		}
	},
	resetAllFields : function(isHandleClearSettings) {
		var me = this;
		
		$("#advclient").val("all");
		$("#advclientauto").val("");
		selectedCreationDate = {};
		me.datePickerSelectedCreationAdvDate = [];
		$("#advalertname").val("");
		if(!isClientUser())
		{
		var alertCompanyName = me.getAlertMonitorFilterView().down('combo[itemId="clientComboAuto"]');
        alertCompanyName.setRawValue("");
        me.clientFilterVal = "";
		selectAdvClientDesc = "";
		}
		var alertNameFltId= me.getAlertMonitorFilterView().down('combo[itemId="alertNameFltId"]');
		alertNameFltId.setRawValue("");
		var alertStatusToolBar = me.getAlertMonitorFilterView().down('combo[itemId=alertStatusToolBar]');
		alertStatusToolBar.setValue('E');
		me.alertStatusVal = "E";
		$("input[type='text'][id='savedFilterAs']").val("");
		$("input[type='text'][id='savedFilterAs']").prop('disabled', false);
		
		$('label[for="CreationDateLabel"]').text(getLabel('creationDate',
				'Alert Date(Latest)'));
		$("#advalertmode").val("");
		$("#advtrackingid").val("");
		$("#advalertstatus").val("E");
		$("#msSavedFilter").val("");
		$("#msSavedFilter").multiselect("refresh");
		$("#saveFilterChkBox").attr('checked', false);
        
        $("#advclient").niceSelect('update');
		$("#advclientauto").niceSelect('update');
		markAdvFilterNameMandatory('saveFilterChkBox','savedFilterlbl','savedFilterAs', true);
		
		if(!isHandleClearSettings)
			me.resetAdvEntryDate();
	},
	resetAdvEntryDate: function(){ 
		var me = this; 
		var objDateParams = me.getDateParam('1'); 
		
		var vFromDate = Ext.util.Format.date(Ext.Date.parse(objDateParams.fieldValue1, 'Y-m-d'), strExtApplicationDateFormat); 
		var vToDate = Ext.util.Format.date(Ext.Date.parse(objDateParams.fieldValue2, 'Y-m-d'), strExtApplicationDateFormat); 
		$('#creationDate').setDateRangePickerValue([vFromDate, vToDate]); 
		selectedCreationDate = { 
				operator : 'bt', 
				fromDate : vFromDate, 
				toDate : vToDate, 
				dateLabel : 'Today' 
		}; 
		
		$('label[for="CreationDateLabel"]').text(getLabel('creationDate', 'Alert Date') + " (" + selectedCreationDate.dateLabel + ")"); 
		updateToolTip('creationDate',  " (" + selectedCreationDate.dateLabel + ")"); 
	},
	updateSavedFilterComboInQuickFilter : function() {
		var me = this;
		var savedFilterCombobox = me.getFilterView()
				.down('combo[itemId="savedFiltersCombo"]');
		if (!Ext.isEmpty(savedFilterCombobox)
				&& savedFilterCombobox.getStore().find('code',
						me.filterCodeValue) >= 0) {
			savedFilterCombobox.getStore().reload();
			if (me.filterCodeValue != null) {
				me.savedFilterVal = me.filterCodeValue;
			} else {
				me.savedFilterVal = '';
			}
			savedFilterCombobox.setValue(me.savedFilterVal);
			me.filterCodeValue = null;
		}
		/*else{
			savedFilterCombobox.getStore().reload();
			if (me.filterCodeValue != null) {
				me.savedFilterVal = me.filterCodeValue;
			} else {
				me.savedFilterVal = '';
			}
			savedFilterCombobox.setValue(me.savedFilterVal);
		}*/
	},
	setSavedFilterDates : function(dateType, data) {
		if (!Ext.isEmpty(dateType) && !Ext.isEmpty(data)) {
			var me = this;
			var dateFilterRefFrom = null;
			var formattedFromDate,fromDate,toDate,formattedToDate;
			var dateOperator = data.operator;
			var dateVal=data.dateVal;
	        if(dateVal==7)
	        {
			fromDate = data.value1;
			if (!Ext.isEmpty(fromDate)) 
				 formattedFromDate = Ext.util.Format.date(Ext.Date
								.parse(fromDate, 'Y-m-d'),
						strExtApplicationDateFormat);
				 
			toDate = data.value2;
			if (!Ext.isEmpty(toDate)) 
					formattedToDate = Ext.util.Format.date(Ext.Date
									.parse(toDate, 'Y-m-d'),
							strExtApplicationDateFormat);
			
			if (dateType === 'alertDate') {
				selectedLoginDate = {
						operator : dateOperator,
						fromDate : formattedFromDate,
						toDate : formattedToDate
					};
				dateFilterRefFrom = $('#creationDate');
				
			}
			
			if (dateOperator === 'eq') {
					$(dateFilterRefFrom).val(formattedFromDate);
				}
			else if (dateOperator === 'bt') {
						$(dateFilterRefFrom).setDateRangePickerValue([formattedFromDate, formattedToDate]);
					}
		 } 
		else{
			var objDateParams = me.getDateParam(dateVal);
			 formattedFromDate = Ext.util.Format.date(Ext.Date
								.parse(objDateParams.fieldValue1, 'Y-m-d'),
						strExtApplicationDateFormat);
			formattedToDate= Ext.util.Format.date(Ext.Date
								.parse(objDateParams.fieldValue2, 'Y-m-d'),
						strExtApplicationDateFormat);
			dateOperator=objDateParams.operator;
			if (dateType === 'alertDate') {
				selectedLoginDate = {
						operator : dateOperator,
						fromDate : formattedFromDate,
						toDate : formattedToDate
					};
				dateFilterRefFrom = $('#creationDate');
			}
			
			if (dateOperator === 'eq') {
					$(dateFilterRefFrom).val(formattedFromDate);
					$(dateFilterRef).val(formattedFromDate);

				}
			else if (dateOperator === 'bt') {
						$(dateFilterRefFrom).setDateRangePickerValue([formattedFromDate, formattedToDate]);
					}
			
		}
	  }
	},
	handleClientChangeInQuickFilter : function(isSessionClientFilter) {
		var me = this;
		me.clientFilterVal = selectedFilterClient;
		me.clientFilterDesc = selectedFilterClientDesc;// combo.getRawValue();
		quickFilterClientValSelected = me.clientFilterVal;
		quickFilterClientDescSelected = me.clientFilterDesc;
		me.filterApplied = 'Q';
		me.setDataForFilter();
		if (me.clientFilterVal === 'all') {
			me.showAdvFilterCode = null;
			me.filterApplied = 'ALL';
			me.refreshData();

		} else {
			me.applyQuickFilter();
		}
	},
	handleCreationDateSync : function(valueChangedAt, sourceLable, sourceToolTipText, sourceTextRef) {
		var me = this, labelToChange, valueControlToChange, updatedDateValue;
		
		labelToChange = (valueChangedAt === 'Q') ? $('label[for="CreationDateLabel"]') : me.getDateLabel();
		valueControlToChange = (valueChangedAt === 'Q') ? $('#creationDate') : $('#entryDataPicker');
		updatedDateValue = sourceTextRef.getDateRangePickerValue();
		
		if(labelToChange && valueControlToChange && valueControlToChange.hasClass('is-datepick')) {
			if(valueChangedAt === 'Q') {
				labelToChange.text(sourceLable);
				updateToolTip('creationDate', sourceToolTipText);
			} else {
				labelToChange.setText(sourceLable);
			}
			if(!Ext.isEmpty(updatedDateValue)) {
				valueControlToChange.setDateRangePickerValue(updatedDateValue);
			}
		}
	},
	handleAlertNameFilterSync : function( calledFrom,alertCode,alertDesc) {
		var me = this;
		if(calledFrom === 'Q'){
			$("#advalertname").val(alertDesc);
			selectAdvAlertNameDesc = alertDesc;
			selectAdvAlertNameCode = alertCode;
			me.alertNameValue = alertCode;
			me.alertNameDesc = alertDesc;			
		} else if(calledFrom === 'A'){
			var alertNameFltId = me.getAlertMonitorFilterView().down('AutoCompleter[itemId="alertNameFltId"]');
			alertNameFltId.setRawValue(alertDesc);
			alertNameFltId.setValue(alertCode);
			me.alertNameValue = alertCode;
			me.alertNameDesc = alertDesc;
			selectAdvAlertNameCode = alertCode;
			selectAdvAlertNameDesc = alertDesc;
		}		
	},
	assignSavedFilter: function(){
		var me= this;
		if(me.firstTime){
			me.firstTime = false;
			
			if (objAlertMonitorFilterPref) {
				var objJsonData = Ext.decode(objAlertMonitorFilterPref);
				if (!Ext.isEmpty(objJsonData.d.preferences)) {
					if (!Ext.isEmpty(objJsonData.d.preferences.GeneralSetting)) {
						if (!Ext.isEmpty(objJsonData.d.preferences.GeneralSetting.defaultFilterCode)) {
							var advData = objJsonData.d.preferences.GeneralSetting.defaultFilterCode;
							if(advData === me.getAlertMonitorFilterView().down('combo[itemId="savedFiltersCombo"]').getValue()){
								$("#msSavedFilter option[value='"+advData+"']").attr("selected",true);
								$("#msSavedFilter").multiselect("refresh");
								me.savedFilterVal = advData;
								me.handleSavedFilterClick();
							}
						}
					}
				}
			}
		}
	},
	populateQuickFilterFields : function(){
		var me = this;
		var clientComboBox = null;
		var clientAdvFilterVal = null;
        if(isClientUser())
        {
        	clientComboBox = me.getAlertMonitorFilterView().down('combo[itemId="clientCombo"]');
        	clientAdvFilterVal = $('#advclient').val();
        }
        else
        {
        	clientComboBox = me.getAlertMonitorFilterView().down('combo[itemId="clientComboAuto]');
        	clientAdvFilterVal = $('#advclientauto').val();
        }
		
		if (!Ext.isEmpty(clientAdvFilterVal)) {
			clientComboBox.setValue(clientAdvFilterVal);
		} else if($('#advclient').val() == 'all'){
			clientComboBox.setValue('all');
			clientFilterVal = '';
		}
		var alertNameFltId= me.getAlertMonitorFilterView().down('AutoCompleter[itemId="alertNameFltId"]');
		var alertAdvFilterVal = $('#advalertname').val();
		if (!Ext.isEmpty(alertAdvFilterVal)) {
			alertNameFltId.setValue(selectAdvAlertNameCode);
			alertNameFltId.setRawValue(alertAdvFilterVal);
		}
		else{
			alertNameFltId.setRawValue('');
			$('#advalertname').val('');
			selectAdvAlertNameCode = '';
			selectAdvAlertNameDesc = '';
		}
		var alertStatusToolBar = me.getAlertMonitorFilterView().down('combo[itemId=alertStatusToolBar]');
		var alertAdvStatusFilterVal = $('#advalertstatus').val();
		if (!Ext.isEmpty(alertAdvStatusFilterVal)) {
			alertStatusToolBar.setValue(alertAdvStatusFilterVal);
		}
		else{
			alertStatusToolBar.setValue('E');
			$('#advalertstatus').val('E');
			selectAdvAlertStatusCode = '';
			selectAdvAlertStatusDesc = '';
		}
		var creationDateLableVal = $('label[for="CreationDateLabel"]').text();
		var creationDateField = $("#creationDate");
		me.handleCreationDateSync('A', creationDateLableVal, null, creationDateField);
	//	me.handleAlertNameFilterSync( 'A',selectAdvAlertNameCode,selectAdvAlertNameDesc);
	}
});