Ext.define('GCP.controller.UserActivityController', {
	extend : 'Ext.app.Controller',
	requires : ['GCP.view.UserActivityGridView','Ext.ux.gcp.PageSettingPopUp'],
	views : ['GCP.view.UserActivityView',
			'GCP.view.UserActivityAdvancedFilterPopup',
			'GCP.view.UserActivityDetailViewPopup',
			'GCP.view.UserActivityModuleViewPopup'],
	/**
	 * Array of configs to build up references to views on page.
	 */
	refs : [{
				ref : 'pageSettingPopUp',
				selector : 'pageSettingPopUp'
			},{
				ref : 'userActivityCenter',
				selector : 'userActivityCenter'
			},{
				ref : 'userActivityView',
				selector : 'userActivityView'
			},{
				ref : 'groupView',
				selector : 'userActivityView groupView'
			}, {
				ref : 'usrActivityGrid',
				selector : 'userActivityView userActivityGridView grid[itemId="gridViewMstId"]'
			}, {
				ref : 'usrActDtlView',
				selector : 'userActivityView userActivityGridView panel[itemId="usrActDtlView"]'
			}, {
				ref : 'userActivityGridView',
				selector : 'userActivityView userActivityGridView'
			},{
				ref : 'userActivityFilterView',
				selector : 'userActivityFilterView'
			},{
				ref : 'matchCriteria',
				selector : 'userActivityGridView radiogroup[itemId="matchCriteria"]'
			}, {
				ref : 'searchTxnTextInput',
				selector : 'userActivityGridView textfield[itemId="searchTxnTextField"]'
			}, {
				ref : 'btnSavePreferences',
				selector : ' userActivityFilterView button[itemId="btnSavePreferences"]'
			}, {
				ref : 'bankUser',
				selector : ' userActivityFilterView checkbox[itemId="bankUserCheckbox"]'
			},{
				ref : 'btnClearPreferences',
				selector : ' userActivityFilterView button[itemId="btnClearPreferences"]'
			}, {
				ref : 'fromDateLabel',
				selector : ' userActivityFilterView label[itemId="dateFilterFrom"]'
			}, {
				ref : 'toDateLabel',
				selector : ' userActivityFilterView label[itemId="dateFilterTo"]'
			}, {
				ref : 'loginDateLabel',
				selector : ' userActivityFilterView label[itemId="loginDateLabel"]'
			}, {
				ref : 'fromLoginDate',
				selector : 'userActivityFilterView datefield[itemId="fromDate"]'
			}, {
				ref : 'toLoginDate',
				selector : 'userActivityFilterView datefield[itemId="toDate"]'
			}, {
				ref : 'dateRangeComponent',
				selector : ' userActivityFilterView container[itemId="dateRangeComponent"]'
			}, {
				ref : 'loginDate',
				selector : 'userActivityFilterView button[itemId="loginDate"]'
			}, {
				ref : 'advFilterActionToolBar',
				selector : ' userActivityFilterView toolbar[itemId="advFilterActionToolBar"]'
			}, {
				ref : 'usrActToolBar',
				selector : ' userActivityFilterView toolbar[itemId="usrActToolBar"]'
			}, {
				ref : 'userActivityInformation',
				selector : 'userActivityInformation'
			}, {
				ref : 'infoSummaryLowerPanel',
				selector : 'userActivityInformation panel[itemId="infoSummaryLowerPanel"]'
			}, {
				ref : 'advanceFilterPopup',
				selector : 'userActivityAdvancedFilterPopup[itemId="stdViewAdvancedFilter"]'
			}, {
				ref : 'advanceFilterTabPanel',
				selector : 'userActivityAdvancedFilterPopup[itemId="stdViewAdvancedFilter"] tabpanel[itemId="advancedFilterTab"] '
			}, {
				ref : 'filterDetailsTab',
				selector : 'userActivityAdvancedFilterPopup[itemId="stdViewAdvancedFilter"] tabpanel[itemId="advancedFilterTab"] panel[itemId="filterDetailsTab"]'
			}, {
				ref : 'createNewFilter',
				selector : 'userActivityAdvancedFilterPopup[itemId="stdViewAdvancedFilter"] userActivityCreateNewAdvFilter'
			}, {
				ref : 'advFilterGridView',
				selector : 'userActivityAdvancedFilterPopup[itemId="stdViewAdvancedFilter"] userActivityAdvFilterGridView'
			}, {
				ref : 'saveSearchBtn',
				selector : 'userActivityAdvancedFilterPopup[itemId="stdViewAdvancedFilter"] userActivityCreateNewAdvFilter button[itemId="saveAndSearchBtn"]'
			}, {
				ref : 'userActDtlViewPopupRef',
				selector : 'userActivityDetailViewPopup[itemId="gridActivityDtl"]'
			}, {
				ref : 'userActivityDtlGenGrid',
				selector : 'userActivityDetailViewPopup grid[itemId="gridActDtlItemId"]'
			}, {
				ref : 'userActivityPopupDtlId',
				selector : 'userActivityDetailViewPopup panel[itemId="activityDtlId"]'
			}, {
				ref : 'userActModuleViewPopupRef',
				selector : 'userActivityModuleViewPopup[itemId="gridModuleActivity"]'
			}, {
				ref : 'userActivityModuleGrid',
				selector : 'userActivityModuleViewPopup grid[itemId="gridModuleActDtlId"]'
			}, {
				ref : 'userActivityModulePopupId',
				selector : 'userActivityModuleViewPopup panel[itemId="moduleActivityDtlId"]'
			}, {
				ref : 'actionBarSummDtl',
				selector : 'userActivityView userActivityGridView button[itemId="killSession"]'
			}, {
				ref : 'sellerPanel',
				selector : 'userActivityAdvancedFilterPopup[itemId="stdViewAdvancedFilter"] userActivityCreateNewAdvFilter panel[itemId="sellerPanel"]'
			}, {
				ref : 'corpPanel',
				selector : 'userActivityAdvancedFilterPopup[itemId="stdViewAdvancedFilter"] userActivityCreateNewAdvFilter panel[itemId="corpPanel"]'
			}, {
				ref : 'clientPanel',
				selector : 'userActivityAdvancedFilterPopup[itemId="stdViewAdvancedFilter"] userActivityCreateNewAdvFilter panel[itemId="clientPanel"]'
			}, {
				ref : 'withHeaderCheckbox',
				selector : 'userActivityView menuitem[itemId="withHeaderId"]'
			}, {
				ref:'filterView',
				selector:'filterView'	
			}, {
				ref:"filterButton",
				selector : "groupView button[itemId=filterButton]"
			}, {
				ref : 'savedFiltersCombo',
				selector : 'userActivityFilterView  combo[itemId="savedFiltersCombo"]'
			}
			
				],
	config : {
		filterData : [],
		clientValue : strClientId,
		objAdvFilterPopup : null,
		statusVal : null,
		moduleVal : null,
		categoryVal : null,
		subCategoryVal : null,
		copyByClicked : '',
		activeFilter : null,
		typeFilterVal : 'all',
		filterApplied : 'ALL',
		showAdvFilterCode : null,
		actionFilterDesc : 'all',
		typeFilterDesc : 'all',
		dateFilterVal : '',
		dateFilterFromVal : '',
		dateFilterToVal : '',
		loginDateFilterLabel : getLabel('latest', 'Latest'),
		logoutDateFilterLabel : getLabel('latest', 'Latest'),
		loginDateFilterVal : '',
		logoutDateFilterVal : '',
		filterCodeValue : null,
		savePrefAdvFilterCode : null,
		commonPrefUrl : 'services/userpreferences/userActivity.json',
		strGetModulePrefUrl : 'services/userpreferences/userActivity/{0}.json',
		dateHandler : null,
		customizePopup : null,
		objActivityDtlPopup : null,
		objModuleActivityPopup : null,
		bankUserFlag:false,
		subGroupInfo:null,
		groupInfo:null,
		dateRangeFilterVal : '13',
		datePickerSelectedDate : [],
		datePickerSelectedLoginAdvDate : [],
		datePickerSelectedLogoutAdvDate : [],
		userName : null,
		clientFilterVal : 'all',
		clientFilterDesc : getLabel('allCompanies', 'All companies'),
		pageSettingPopup : null,
		isSelectUserName  : false,
		reportGridOrder : null,
		oldUserName : '',
		strPageName : 'userActivity'
	},
	/**
	 * A template method that is called when your application boots. It is
	 * called before the Application's launch function is executed so gives a
	 * hook point to run any code before your Viewport is created.
	 */
	init : function() {
		var me = this;
		me.updateConfig();
		me.objAdvFilterPopup = Ext.create(
				'GCP.view.UserActivityAdvancedFilterPopup', {
					parent : 'usrActivityView',
					itemId : 'stdViewAdvancedFilter',
					filterPanel : {
						xtype : 'userActivityCreateNewAdvFilter',
						margin : '4 0 0 0',
						callerParent : 'usrActivityView'
					}
				});

		me.objActivityDtlPopup = Ext.create(
				'GCP.view.UserActivityDetailViewPopup', {
					parent : 'UserActivityView',
					itemId : 'gridActivityDtl'

				});
		me.objActivityDtlPopup.center();
		
		me.objModuleActivityPopup = Ext.create(
				'GCP.view.UserActivityModuleViewPopup', {
					parent : 'UserActivityDetailViewPopup',
					itemId : 'gridModuleActivity'

				});
		$("#savePrefMenuBtn").attr('disabled',true);
		$("#clearPrefMenuBtn").attr('disabled',true);
		$(document).on('performReportAction', function(event, actionName) {
					me.downloadReport(actionName);
				});	
		$(document).on('filterDateChange',function(event, filterType, btn, opts) {			
					if (filterType=="entryDateQuickFilter"){
						 me.handleEntryDateChange(filterType,btn,opts);
					 }
					 else if (filterType=="logintime"){
						 me.loginDateChange(btn,opts);
					 }
					 else if (filterType=="logouttime"){
						 me.logoutDateChange(btn,opts);
					 }
				});
		$(document).on('searchActionClicked', function() {
			me.searchActionClicked(me);
		});
		$(document).on('saveAndSearchActionClicked', function() {
			me.saveAndSearchActionClicked(me);
		});
		$(document).on('resetAllFieldsEvent', function() {
			me.resetAllFields();
			me.filterCodeValue=null;
		});
		$(document).on('deleteFilterEvent', function(event, filterCode) {
					me.deleteFilterSet(filterCode);
		});
		$(document).on('handleSavedFilterClick', function(event) {
					me.handleSavedFilterClick();
		});
		$(document).on('performPageSettings', function(event) {
					me.showPageSettingPopup('PAGE');
		});
		$(document).on('handleClientChangeInQuickFilter',
				function(isSessionClientFilter) {
					me.handleClientChangeInQuickFilter(isSessionClientFilter);
		});
		$(document).on("datePickPopupSelectedDate",
				function(event, filterType, dates) {
			if(dates.length > 1)
			{
				me.dateFilterLabel = getLabel('daterange', 'Date Range');
				
			}
					if (filterType == "logintime") {
						me.datePickerSelectedLoginAdvDate = dates;
						me.loginDateFilterVal = me.dateRangeFilterVal;
						me.loginDateFilterLabel = getLabel('daterange', 'Date Range');
						me.handleLoginDateChange(me.dateRangeFilterVal);
				$('#logouttime').datepick('option', 'minDate', dates[0]);
					}
					else if (filterType == "logouttime") {
						me.datePickerSelectedLogoutAdvDate = dates;
						me.logoutDateFilterVal = me.dateRangeFilterVal;
						me.logoutDateFilterLabel = getLabel('daterange', 'Date Range');
				me.handleLogoutDateChange(me.dateRangeFilterVal);
						}
				});
		me.updateFilterConfig();
		me.control({
			'userActivityGridView textfield[itemId="searchTxnTextField"]' : {
				change : function(btn, opts) {
					me.searchTrasactionChange();
				}
			},
			'userActivityGridView radiogroup[itemId="matchCriteria"]' : {
				change : function(btn, opts) {
					me.searchTrasactionChange();
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
			'userActivityFilterView' : {				
				render : function(panel, opts) {
				
					if (!Ext.isEmpty(modelSelectedMst))
							me.selectedMst = modelSelectedMst;
							var useSettingsButton = me.getFilterView().down('button[itemId="useSettingsbutton"]');
							if (!Ext.isEmpty(useSettingsButton)) {
									useSettingsButton.hide();
							}
				},
				'handleSavedFilterItemClick' : function(comboValue, comboDesc) {
					me.doHandleSavedFilterItemClick(comboValue, comboDesc);
				}
			},
				'userActivityFilterView combo[itemId="savedFiltersCombo"]' : {
					'afterrender' : function(combo, newValue, oldValue, eOpts) {
						if (!Ext.isEmpty(me.savedFilterVal)) {
							combo.setValue(me.savedFilterVal);
						}
					}
				},
				'userActivityFilterView component[itemId="userActivityEntryDataPicker"]' : {
						render : function() {
							$('#entryDataPicker').datepick({
									monthsToShow : 1,
									changeMonth : true,
									dateFormat : strApplicationDefaultFormat,
									changeYear : true,
									rangeSeparator : ' to ',
									onClose : function(dates) {
										if (!Ext.isEmpty(dates)) {
											me.dateRangeFilterVal = '13';
											me.datePickerSelectedDate = dates;
											me.datePickerSelectedLoginAdvDate = dates;
											me.dateFilterVal = me.dateRangeFilterVal;
											$('#logouttime').datepick('option', 'minDate', dates[0]);
												me.dateFilterLabel = getLabel('daterange', 'Date Range');
											me.handleDateChange(me.dateRangeFilterVal);
											me.setDataForFilter();
											me.applyQuickFilter();
											me.disablePreferencesButton("savePrefMenuBtn",false);
										}
									},
									maxDate : dtApplicationDate
						    });
							if(!Ext.isEmpty(me.savedFilterVal)) {
								var loginDateLableVal = $('label[for="LoginDateLabel"]').text();
								var loginDateField = $("#logintime");
								me.handleLoginDateSync('A', loginDateLableVal, null, loginDateField);
							}
							else{
								me.dateFilterVal = '12'; // Set to Today
								me.dateFilterLabel = getLabel('latest', 'Latest');
								me.handleDateChange(me.dateFilterVal);
								me.setDataForFilter();
								me.applyQuickFilter();
				        }
				        }
			        },
					
			'userActivityFilterView toolbar[itemId="dateToolBar"]' : {
				afterrender : function(tbar, opts) {
					me.updateDateFilterView();
				}
			},
			'userActivityFilterView button[itemId="filterBtnId"]' : {
				click : function(btn) {
					this.setDataForFilter();
					this.applyQuickFilter();
				}
			},
			'userActivityFilterView button[itemId="goBtn"]' : {
				click : function(btn, opts) {
					var frmDate = me.getFromLoginDate().getValue();
					var toDate = me.getToLoginDate().getValue();

					if (!Ext.isEmpty(frmDate) && !Ext.isEmpty(toDate)) {
						var dtParams = me.getDateParam('7');
						me.dateFilterFromVal = dtParams.fieldValue1;
						me.dateFilterToVal = dtParams.fieldValue2;
						me.setDataForFilter();
						me.applyQuickFilter();
					}
				}
			},
			' userActivityFilterView' : {
				'handleClientChange' : function(client,  clientDesc) {
					me.clientValue=client;	
					me.clientCode = client;
					me.clientDesc = clientDesc;					
					me.filterApplied = 'Q';
					me.doSearchOnly();
					me.disablePreferencesButton("savePrefMenuBtn",false);
				},
				'handlebankuser':function(){
					 if(blnBankUser){
		              me.filterApplied = 'Q';
						me.doSearchOnly();
					 }
				}
			},
			'userActivityInformation panel[itemId="userActivityInfoGridView"] image[itemId="summInfoShowHideGridView"]' : {
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
				}
			},
			'userActivityFilterView AutoCompleter[itemId="clientAutoCompleter"]' : {
				select : function( combo, record, index )
				{
					me.filterApplied = 'Q';
					me.clientCode = combo.value;
					me.doSearchOnly();
				}
			},
			'userActivityFilterView AutoCompleter[itemId="userNameFltId"]' : {
				select : function( combo, record, index )
				{
					me.filterApplied = 'Q';
					me.userName = combo.getRawValue();
					me.isSelectUserName = true;
					me.doSearchOnly();
				},
				'render':function(combo){
							combo.listConfig.width = 200;							
				},				
				change : function( combo, record, index, oldVal )
				{
					me.oldUserName = oldVal;
					me.userName = combo.getRawValue();
					if(isClientUser()){
							combo.cfgExtraParams=[{
							 key : '$filterseller',
							 value : sessionSellerCode
							}]
						   }
					if(Ext.isEmpty(combo.getValue())){
						me.filterApplied = 'Q';
						me.isSelectUserName  = true;	
						me.oldUserName = "";
					}
				},
				keyup : function(combo, e, eOpts){
					me.isSelectUserName = false;
				},
				blur : function(combo, record){
					
					if (me.isSelectUserName == false && me.oldUserName != combo.getRawValue()){
						me.doSearchOnly();
						me.disablePreferencesButton("savePrefMenuBtn",false);
						me.disablePreferencesButton("clearPrefMenuBtn",false);
					}	
					me.oldUserName = combo.getRawValue();
				}
				
			},
			'userActivityInformation' : {
			},
			'userActivityAdvancedFilterPopup[itemId="stdViewAdvancedFilter"] userActivityCreateNewAdvFilter' : {
				handleSellerCombo : function(ObjCombo, newVal, oldVal)
				{
					var objFilterPanel = me.getCorpPanel();
					var objAutocompleter = objFilterPanel.down( 'AutoCompleter[itemId="corporationName"]' );
					objAutocompleter.cfgUrl = 'services/userseek/userActivityCorpSeek.json';
					objAutocompleter.setValue( '' );
					objAutocompleter.cfgExtraParams = [{key : '$sellerCode', value : newVal }];
					
					var objFilterPanel = me.getClientPanel();
					var objAutocompleter = objFilterPanel.down( 'AutoCompleter[itemId="clientName"]' );
					objAutocompleter.cfgUrl = 'services/userseek/userActivityClientSeek.json';
					objAutocompleter.setValue( '' );
					objAutocompleter.cfgExtraParams = [{key : '$sellerCode', value : newVal }];
				}
			},
			'userActivityView userActivityFilterView toolbar[itemId="advFilterActionToolBar"]' : {
				handleSavedFilterItemClick : me.handleFilterItemClick

			},
			'userActivityDetailViewPopup[itemId="gridActivityDtl"]' : {
				closeUserActivityDtlPopup : function(btn) {
					me.closeUserActivityDtlPopup(btn);
				}
			},
			'userActivityModuleViewPopup[itemId="gridModuleActivity"]' : {
				closeUserActivityModulePopup : function(btn) {
					me.closeUserActivityModulePopup(btn);
				}
			},  
			'userActivityView groupView' : {
				/**
				 * This is to be handled if grid model changes as per group by
				 * category. Otherewise no need to catch this event. If captured
				 * then GroupView.reconfigureGrid(gridModel) should be called
				 * with gridModel as a parameter
				 */
				'groupByChange' : function(menu, groupInfo) {
					me.doHandleGroupByChange(menu, groupInfo);
				},
				'groupTabChange' : function(groupInfo, subGroupInfo, tabPanel,
						newCard, oldCard) {
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
					me.doHandleRowActions(actionName, grid, record);
				},
				'groupActionClick' : function(actionName, isGroupAction,
						maskPosition, grid, arrSelectedRecords) {
					if (isGroupAction === true)
						me.doHandleGroupActions(actionName, grid,
								arrSelectedRecords, 'groupAction');
				},
				'render' : function(panel, opts) {
					populateAdvancedFilterFieldValue();
					me.firstTime = true;
					if ((!Ext.isEmpty(objUserActivityFilterPref))) {
						var objJsonData = Ext.decode(objUserActivityFilterPref);
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
			'userActivityView button[itemId="downloadPdf"]' : {
				click : function(btn, opts) {
					me.handleReportAction(btn,opts);
				}
			},
			'userActivityView' : {
				performReportAction : function(btn, opts) {
					me.handleReportAction(btn, opts);
				}
			},
				
			'filterView label[itemId="createAdvanceFilterLabel"]' : {
					'click' : function() {
							showUserActivityAdvanceFilterPopup();
							me.assignSavedFilter();
						}
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
			}
		});
	},
	
	handleClientChangeInQuickFilter : function(isSessionClientFilter) {
		var me = this;
		me.clientFilterVal = selectedFilterClient;
		me.clientFilterDesc = selectedFilterClientDesc;
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
	
	handleReconfigureGrid : function(data) {
		var me = this;
		var objGroupView = me.getGroupView();
		var objSummaryView = me.getUserActivityView(), gridModel = null, objData = null;
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
			} else {
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

		if (!Ext.isEmpty(objUserActivityFilterPref)) {
			objPrefData = Ext.decode(objUserActivityFilterPref);
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
					:(USER_ACTIVITY_GENERIC_COLUMN_MODEL || '[]');

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
		objData["filterUrl"] = 'services/userfilterslist/userActivityFilter';
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
		var advJsonData = me.advFilterData;
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
				var savedFilterComboBox = me.getUserActivityFilterView().down('combo[itemId="savedFiltersCombo"]');
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
			
		if(strFieldName ==='userCode'){
			$("#useradvusername").val("");
			var userNameFltId = me.getUserActivityFilterView().down('AutoCompleter[itemId="userNameFltId"]');
			userNameFltId.setRawValue("");
			selectUserAdvUserNameCode = "";
			selectUserAdvUserNameDesc = "";
			me.userName = "";
		}
		else if(strFieldName ==='clientName'){
			$("#useradvclient").val("");
				if(isClientUser()){
					var clientComboBox = me.getUserActivityFilterView()
							.down('combo[itemId="clientCombo"]');
					me.clientFilterVal = 'all';
					selectedFilterClientDesc = "";
					selectedFilterClient = "";
					selectedClientDesc = "";
					clientComboBox.setValue(me.clientFilterVal);
				} else {
					var clientComboBox = me.getUserActivityFilterView()
							.down('combo[itemId="clientAuto]');
					clientComboBox.reset();
					me.clientFilterVal = '';
					selectedFilterClientDesc = "";
					selectedFilterClient = "";
				}
		}
		else if(strFieldName ==='userCategory'){
			$("#useradvrole").val("");
		}
		else if(strFieldName ==='bankUserFlag'){
			$("input[type='checkbox'][id='bankusercheckbox']").prop('checked', false);
		}
		else if(strFieldName === 'loginStatus'){
				$("#useradvstatus").val("");
		}
		else if(strFieldName === 'loginTime'){
			var datePickerRef = $('#entryDataPicker');
			me.dateFilterVal = '12';
			me.dateFilterLabel = 'Latest';
			me.getLoginDateLabel().setText('Last Login Date (Latest)');
			//datePickerRef.val('');
			
			selectedLoginDate = {};
			me.datePickerSelectedLoginAdvDate = [];
			//$("#logintime").val("");
			$('label[for="LoginDateLabel"]').text('Last Login Date (Latest)');
			//$('#logouttime').datepick('option', 'minDate', "01/01/2009");
		}
		else if(strFieldName ==='logoutTime'){
			selectedLogoutDate = {};
			me.datePickerSelectedLogoutAdvDate = [];
			$('#logouttime').val("");
			$('label[for="LogoutDateLabel"]').text(getLabel('logoutDate',
			'Last Logout Date'));
		}
	},
	/*Applied Filters handling ends here*/
	
	handleLoginDateSync : function(valueChangedAt, sourceLable, sourceToolTipText, sourceTextRef) {
		var me = this, labelToChange, valueControlToChange, updatedDateValue;
		
		labelToChange = (valueChangedAt === 'Q') ? $('label[for="LoginDateLabel"]') : me.getLoginDateLabel();
		valueControlToChange = (valueChangedAt === 'Q') ? $('#logintime') : $('#entryDataPicker');
		updatedDateValue = sourceTextRef.getDateRangePickerValue();
		
		if(labelToChange && valueControlToChange && valueControlToChange.hasClass('is-datepick')) {
			if(valueChangedAt === 'Q') {
				labelToChange.text(sourceLable);
				updateToolTip('logintime', sourceToolTipText);
			} else {
				labelToChange.setText(sourceLable);
			}
			if(!Ext.isEmpty(updatedDateValue)) {
				valueControlToChange.datepick('setDate',updatedDateValue);
			}
		}
	},
	downloadReport : function(actionName) {
		var me = this;
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
		strUrl = 'services/userActivity/getDynamicReport.' + strExtension;
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
		
		strUrl += me.getFilterUrl(subGroupInfo, groupInfo);
		
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
		var  objParam = {}, arrMatches, strRegex = /[?&]([^=#]+)=([^&#]*)/g;
		while (arrMatches = strRegex.exec(strUrl)) {
					objParam[arrMatches[1]] = arrMatches[2];
				}
		strUrl = strUrl.substring(0, strUrl.indexOf('?'));
		form = document.createElement('FORM');
		form.name = 'frmMain';
		form.id = 'frmMain';
		form.method = 'POST';
		
		Object.keys(objParam).map(function(key) { 
		form.appendChild(me.createFormField('INPUT', 'HIDDEN',
					key, objParam[key]));
			});
		form.appendChild(me.createFormField('INPUT', 'HIDDEN',
				csrfTokenName, tokenValue));
		form.appendChild(me.createFormField('INPUT', 'HIDDEN', 'txtCurrent',
				currentPage));
		form.action = strUrl;
		document.body.appendChild(form);
		form.submit();
		document.body.removeChild(form);

	},
	createFormField : function(element, type, name, value) {
		var inputField;
		inputField = document.createElement(element);
		inputField.type = type;
		inputField.name = name;
		inputField.value = value;
		return inputField;
	},
	doHandleLoadGridData : function(groupInfo, subGroupInfo, grid, url, pgSize,
			newPgNo, oldPgNo, sorter, filterData) {
		var me = this;
		var arrOfParseQuickFilter = [], arrOfParseAdvFilter = [], arrOfFilteredApplied = [];
		var objGroupView = me.getGroupView();
		var buttonMask = me.strDefaultMask;
		var strUrl = grid.generateUrl(url, pgSize, newPgNo, oldPgNo, sorter);
		me.subGroupInfo=subGroupInfo;
		me.groupInfo=groupInfo;		
		me.reportGridOrder = strUrl;
		strUrl = strUrl + me.getFilterUrl(subGroupInfo, groupInfo) + '&' + csrfTokenName + '='
				+ csrfTokenValue;
		me.reportGridOrder = strUrl;
		if (!Ext.isEmpty(me.filterData)) {
			if (!Ext.isEmpty(me.filterData) && me.filterData.length >= 1) {
				var quickJsonData = me.filterData;
				var reqJsonInQuick = me.findInQuickFilterData(quickJsonData,'Seller');
				if (!Ext.isEmpty(reqJsonInQuick)) {
					arrQuickJson = quickJsonData;
					arrQuickJson = me.removeFromQuickArrJson(arrQuickJson,'Seller');
					quickJsonData = arrQuickJson;
				}
				var reqJsonInQuick = me.findInQuickFilterData(quickJsonData,'bankUserFlag');
				if (!Ext.isEmpty(reqJsonInQuick)) {
					arrQuickJson = quickJsonData;
					arrQuickJson = me.removeFromQuickArrJson(arrQuickJson,'bankUserFlag');
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
		grid.loadGridData(strUrl, null);
		grid.setLoading(false);
		me.setGridInfoSummary();
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
		if(columnType !== 'actioncontent' && columnType !== 'checkboxColumn') {
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
	setGridInfoSummary : function(  )
			{
				var me = this;				
				var summaryData;
				
			var strInfoUrl = 'userActivityInfo.srvc?' + csrfTokenName + '='
				+ csrfTokenValue;
				if(me.clientFilterVal == null)
					me.clientFilterVal = "";
		strInfoUrl=strInfoUrl +"&$filter="+me.clientFilterVal;
		Ext.Ajax.request({
					url : strInfoUrl,
					method : "POST",
					async : false,
					success : function(response) {
						var data = Ext.decode(response.responseText);
						if (!Ext.isEmpty(data)) {
						var records = data.d.activitylist;					
						var i = records.length - 1;
					if( i >= 0 )
					{	
						summaryData=[{
							title:getLabel( 'lbltotalusers', 'Total Users' ),
							amount:records[ i ].totalUsers 
						},{
							title: getLabel( 'lblusersonline', 'Users Online' ),
							amount:records[ i ].usersOnline 
						},{
							title:getLabel( 'lblusersdisabled', 'Users Disabled' ),
							amount:records[ i ].usersDisabled
						}]	
					}
					else
					{
						summaryData=[{
							title:getLabel( 'lbltotalusers', 'Total Users' ),
							amount:"0"
						},{
							title: getLabel( 'lblusersonline', 'Users Online' ),
							amount:"0 "
						},{
							title:getLabel( 'lblusersdisabled', 'Users Disabled' ),
							amount:"0"
						}]		
					}
					$('#summaryCarousal').carousel({
						data : summaryData,
						titleNode : "title",
						contentNode :"amount"
					});
						}
					},
					failure : function(response) {
						console.log('Error Occured');
					}
				});
			
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
			me.preferenceHandler.readModulePreferences(me.strPageName,strModule,me.postHandleDoHandleGroupTabChange, null, me, false);

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
	postHandleAdvancedFilterTabChange : function(filterCode, filterData,
			applyAdvFilter) {
		var me = this;
		var objGroupView = me.getGroupView();
		var strUrl = null;

		me.populateSavedFilter(filterCode, filterData, false);
		me.filterApplied = 'A';
		me.setDataForFilter();
		strUrl = Ext.String.format(me.strGetModulePrefUrl, 'USERACTIVITY_OPT_ADVFILTER');				
		args = {
			scope : me
		};
		me.getSavedPreferences(strUrl,
				me.postHandleDoHandleGroupTabChange, args);
	},
doHandleRowActions : function(actionName, objGrid, record) {
		var me = this;
		var groupView = me.getGroupView();
		var grid = groupView.getGrid();
		var selectedRecord=grid.getSelectionModel().getSelection()[0];
		var rowIndex = grid.store.indexOf(selectedRecord);
		if (actionName === 'btnView') {
			me.showViewActivity(record);
		}
		if (actionName === 'btnViewDtl') {
			me.showViewModuleActivity(record);
		}
	},
	doHandleGroupByChange : function(menu, groupInfo) {
		var me = this;
		if (me.previouGrouByCode === 'USERACTIVITY_OPT_ADVFILTER') {
			me.savePrefAdvFilterCode = null;
			me.showAdvFilterCode = null;
			me.filterApplied = 'ALL';
		}
		if (groupInfo && groupInfo.groupTypeCode === 'USERACTIVITY_OPT_ADVFILTER') {
			me.previouGrouByCode = groupInfo.groupTypeCode;
		} else
			me.previouGrouByCode = null;
	},
	doHandleGroupActions : function(strAction, grid, arrSelectedRecords,
			strActionType) {
		var me = this;
		me.handleGroupActions();
	},
	handleClearSettings:function()
		{
		var me=this, objGroupView = me.getGroupView();
		var datePickerRef = $('#entryDataPicker');
		var isHandleClearSettings = true; 
		var userActivityFilterView = me.getUserActivityFilterView();
		if(isClientUser()){
			var clientComboBox = me.getUserActivityFilterView()
					.down('combo[itemId="clientCombo"]');
			me.clientFilterVal = 'all';
			selectedFilterClientDesc = "";
			selectedFilterClient = "";
			selectedClientDesc = "";
			clientComboBox.setValue(me.clientFilterVal);
		} else {
			var clientComboBox = me.getUserActivityFilterView()
					.down('combo[itemId="clientAuto]');
			clientComboBox.reset();
			me.clientFilterVal = '';
			selectedFilterClientDesc = "";
			selectedFilterClient = "";
			selectedClientDesc = "";
		}
		
		if(!isClientUser()){
			var objBankUser = userActivityFilterView.down('checkbox[itemId="bankUserCheckbox"]');
			objBankUser.setValue(false);
		}
		me.bankUserFlag = false;
		
		var userNameFltId= userActivityFilterView.down('combo[itemId="userNameFltId"]');
		userNameFltId.setValue("");
		userNameFltId.setRawValue("");
		selectUserAdvUserNameCode = "";
		selectUserAdvUserNameDesc = "";

		me.savedFilterVal = '';
		var savedFilterComboBox = userActivityFilterView.down('combo[itemId="savedFiltersCombo"]');
		savedFilterComboBox.setValue(me.savedFilterVal);
		
		var entryDatePicker = me.getUserActivityFilterView()
				.down('component[itemId="entryDataPicker"]');
					
		me.dateFilterVal = '12';
		me.dateFilterLabel = 'Latest';
		me.handleDateChange(me.dateFilterVal);
		//datePickerRef.val('');
		me.getLoginDateLabel().setText('Last Login Date (Latest)');
		me.filterApplied = 'Q';
		if (objGroupView)
			objGroupView.toggleFilterIcon(false);
		objGroupView.setFilterToolTip('');
		me.resetAllFields(isHandleClearSettings); 
		me.setDataForFilter();
		me.refreshData();
	
	},
	updateConfig : function() {
						var me = this;
						me.dateHandler = Ext.create('Ext.ux.gcp.DateUtil');
						me.preferenceHandler = Ext.create('Ext.ux.gcp.PreferencesHandler');
			},
	handleRowIconClick : function(tableView, rowIndex, columnIndex, btn, event,
			record) {
		var me = this;
		var actionName = btn.itemId;
		if (actionName === 'btnView') {
			me.showViewActivity(record);
		}
		if (actionName === 'btnViewDtl') {
			me.showViewModuleActivity(record);
		}
	},

	showViewActivity : function(record) {
		record.data.userName = record.data.userName.replace(/amp;/g,'');
		record.data.userName = record.data.userName.replace(/&quot;/g,'"');
		record.data.clientName = record.data.clientName.replace(/amp;/g,'');
		record.data.clientName = record.data.clientName.replace(/&quot;/g,'"');
		var me = this;
		me.handleUsrActSmartGridConfig(record);
		if (!Ext.isEmpty(me.objActivityDtlPopup)) {
			me.objActivityDtlPopup.down('label[itemId=usercode]')
					.setText(record.get('userCode'));
			me.objActivityDtlPopup.down('label[itemId=username]')
					.setText(record.get('userName'));
			me.objActivityDtlPopup.down('label[itemId=logintime]')
					.setText(record.get('loginTime'));
			me.objActivityDtlPopup.down('label[itemId=logouttime]')
					.setText(record.get('logoutTime'));
			me.objActivityDtlPopup.down('label[itemId=userCategory]')
			.setText(record.get('userCategory'));
			me.objActivityDtlPopup.down('label[itemId=clientName]')
			.setText(getStringWithSpecialChars(record.get('clientName')));
			var strRetValue = record.get('userType');
			if(record.get('userType') == 1)
				strRetValue = "Customer";
			else if (record.get('userType') == 0)
				strRetValue = "Bank";
			
			me.objActivityDtlPopup.down('label[itemId=userType]')
			.setText(strRetValue);
			
			me.objActivityDtlPopup.show();

		} else {
			me.objActivityDtlPopup = Ext.create(
					'GCP.view.UserActivityDetailViewPopup', {
						user_code : record.get('userCode'),
						user_name : record.get('userName'),
						login_time : record.get('loginTime'),
						logout_time : record.get('logoutTime'),
						user_category : record.get('userCategory'),
						client_name : getStringWithSpecialChars(record.get('clientName')),
						user_type : record.get('userType')
						
						
					});
			me.objActivityDtlPopup.show();
		}
		me.refreshData();
	},

	handleUsrActSmartGridConfig : function(record) {
		var me = this;
		var activityDtlGrid = me.getUserActivityDtlGenGrid();
		var objConfigMap = me.getActivityDtlConfiguration(record);
		var arrCols = new Array();
		arrCols = me.getActDtlColumns(objConfigMap.arrColsPref,
				objConfigMap.objWidthMap);
		if (!Ext.isEmpty(activityDtlGrid))
			activityDtlGrid.destroy(true);
		me.handleActivityDtlSmartGridLoad(arrCols, objConfigMap.storeModel,
				record);
	},

	getActivityDtlConfiguration : function(record) {
		var me = this;
		var objConfigMap = null;
		var objWidthMap = null;
		var arrColsPref = null;
		var storeModel = null;
		objWidthMap = {
		"loginTime" : 200,
		"logoutTime" : 200,
		"loginStatus" : 85
		};
		
		arrColsPref = [
		{
			"colId" : "loginTime",
			"colDesc" : getLabel("lbl.userActivity.grid.lastLoginTime","Last Login Time"),
			"resizable" : false
		},
		{
			"colId" : "logoutTime",
			"colDesc" : getLabel("lbl.userActivity.grid.lastLogoutTime","Last Logout Time"),
			"resizable" : false
		},{
			"colId" : "loginStatus",
			"colDesc" : getLabel("lblstatus","Status"),
			"resizable" : false
		}];
		
		var userCode = record.data.userId;
		var gridUrl = 'userActivityGridList/'+userCode+'.srvc';

		storeModel={
			fields : ['userCode', 'userName', 'userCategory',
						'corporationName', 'clientName', 'loginTime',
						'logoutTime', 'loginStatus', 'identifier','requestState','validFlag','channel','userType',
						'__metadata', 'sessionId'],
			proxyUrl : gridUrl,
			rootNode : 'd.activitylist',
		    totalRowsNode : 'd.__count'
		}

		objConfigMap = {
			"objWidthMap" : objWidthMap,
			"arrColsPref" : arrColsPref,
			"storeModel" : storeModel
		};
		return objConfigMap;
	},

	getActDtlColumns : function(arrColsPref, objWidthMap) {
		var me = this;
		var arrCols = new Array(), objCol = null, cfgCol = null;
		if (!Ext.isEmpty(arrColsPref)) {
			for (var i = 0; i < arrColsPref.length; i++) {
				objCol = arrColsPref[i];
				cfgCol = {};
				cfgCol.colHeader = objCol.colDesc;
				cfgCol.colId = objCol.colId;
				cfgCol.sortable = false;
				cfgCol.draggable = false;
				cfgCol.hideable = false;
				cfgCol.lockable = false;
				if (!Ext.isEmpty(objCol.colType)) {
					cfgCol.colType = objCol.colType;
					if (cfgCol.colType === "number")
						cfgCol.align = 'right';
				}
				if (!Ext.isEmpty(objCol.resizable)) {
					cfgCol.resizable = false;
				}
				
				cfgCol.width = !Ext.isEmpty(objWidthMap[objCol.colId])
						? objWidthMap[objCol.colId]
						: 120;
				cfgCol.fnColumnRenderer = me.detailColumnRenderer;
				arrCols.push(cfgCol);
			}
		}
		return arrCols;
	},

	detailColumnRenderer : function(value, meta, record, rowIndex, colIndex, store,
			view, colId) {
		var strRetValue = value;
		var showIcons = false;
		if (colId === 'col_loginStatus') {
			if(record.data.loginStatus=='Y')
				strRetValue="Online";
			else 
				strRetValue="Offline";
		}
		meta.tdAttr = 'title="' + strRetValue + '"';
		return strRetValue;
	},
	
	createActDtlActionColumn : function() {
		var me = this;
		var objActionCol = {
			colType : 'actioncontent',
			colId : 'viewActionDtl',
			width : 120,
			sortable : false,
			align : 'center',
			locked : true,
			items : [{
						itemId : 'btnViewDtl',
						text : "View Activity",
						itemLabel : getLabel('lblviewactivity', 'View Activity')
					}]
		};
		return objActionCol;
	},

	handleActivityDtlSmartGridLoad : function(arrCols, storeModel, parentRecord) {
		var me = this;
		var pgSize = null;
		var userActivityDtlGrid = null;
		pgSize = 5;
		var userActivityPopupDtlId = me.getUserActivityPopupDtlId();
		var userActivityDtlGrid = Ext.getCmp('gridActDtlItemId');

		if (typeof userActivityDtlGrid == 'undefined') {
			userActivityDtlGrid = Ext.create('Ext.ux.gcp.SmartGrid', {
						id : 'gridActDtlItemId',
						itemId : 'gridActDtlItemId',
						pageSize : pgSize,
						autoDestroy : true,
						stateful : false,
						showEmptyRow : false,
						scroll : 'vertical',
						cls : 't7-grid',
						padding : '5 0 0 0',
						showCheckBoxColumn : false,
						enableColumnAutoWidth : false,
						rowList : [5, 10, 15, 20, 25, 30],
						minHeight : 'auto',
						maxHeight : 300,
						columnModel : arrCols,
						storeModel : storeModel,
						isRowIconVisible : me.isRowIconVisible,
						rowNumbererColumnWidth : 65,
						isRowMoreMenuVisible : false,
						handleRowIconClick : function(tableView, rowIndex,
								columnIndex, btn, event, record) {
							me.handleRowIconClick(tableView, rowIndex,
									columnIndex, btn, event, record);
						},
						listeners : {
							render : function(grid) {
								me.handleActDtlLoadGridData(grid,grid.store.dataUrl,
										userActivityDtlGrid.pageSize, 1, 1,
										null, parentRecord);
							},
							gridPageChange : function(grid, strUrl, pageSize,
									newPgNo, oldPgNo, sorters) {
								me
										.handleActDtlLoadGridData(grid,grid.store.dataUrl,
												pageSize, newPgNo, oldPgNo,
												sorters, parentRecord);
							},
							gridSortChange : function(grid, strUrl, pageSize,
									newPgNo, oldPgNo, sorters) {
								me
										.handleActDtlLoadGridData(grid,grid.store.dataUrl,
												pageSize, newPgNo, oldPgNo,
												sorters, parentRecord);
							},
							pagechange : function(pager, current, oldPageNum) {
								me.handleComboPageSizeChange(pager, current,
										oldPageNum);
							},
							statechange : function(grid) {
								me.disablePreferencesButton("savePrefMenuBtn",true);
							}
						}
					});
			userActivityDtlGrid.view.refresh();
			userActivityPopupDtlId.add(userActivityDtlGrid);
			userActivityPopupDtlId.doLayout();
		}
	},

	handleActDtlLoadGridData : function(grid,url, pgSize, newPgNo, oldPgNo,
			sorter, record) {
		var me = this;
		var strUrl = grid.generateUrl(url, pgSize, newPgNo, oldPgNo, sorter);
		me.setDataForFilter();
		strUrl = strUrl + me.getFilterUrl(me.subGroupInfo,
		me.groupInfo) + '&' + csrfTokenName + '='
				+ csrfTokenValue;
		grid.loadGridData(strUrl, null);
	},

	handleLoadGridData : function(grid, url, pgSize, newPgNo, oldPgNo, sorter) {
		var me = this;
		var strUrl = grid.generateUrl(url, pgSize, newPgNo, oldPgNo, sorter);
		me.setDataForFilter();
		strUrl = strUrl + me.getFilterUrl(me.subGroupInfo,	
		me.groupInfo) + '&' + csrfTokenName + '='
				+ csrfTokenValue;
		grid.loadGridData(strUrl, null);
	},

	enableValidActionsForGrid : function(grid, record, recordIndex,
			selectedRecords, jsonData) {
		var me = this;
		var buttonMask = '0000000000';
		var maskArray = new Array(), actionMask = '', objData = null;

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
			var me=this;
		var objGroupView = me.getGroupView();
		var actionBar = objGroupView.down('toolbar[itemId="groupActionToolBar"]');
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
							} else if (item.maskPosition === 8 && blnEnabled) {
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
	setInfoTooltip : function() {
		var me = this;
		var infotip = Ext.create('Ext.tip.ToolTip', {
			target : 'userActivityFilterView-1096_header_hd-textEl',
			listeners : {
				// Change content dynamically depending on which element
				// triggered the show.
				beforeshow : function(tip) {
					var typeVal = '';
					var dateFilter = me.dateFilterLabel;

					if (me.typeFilterVal == 'all' && me.filterApplied == 'ALL') {
						typeVal = 'All';
						me.showAdvFilterCode = null;
					} else {
						typeVal = me.typeFilterDesc;
					}

					var advfilter = me.showAdvFilterCode;
					if (advfilter == '' || advfilter == null) {
						advfilter = getLabel('none', 'None');
					}

					tip.update('Type' + ' : ' + typeVal + '<br/>'
							+ getLabel('lblloginDate', 'Date') + ' : '
							+ dateFilter + '<br/>'
							+ getLabel('advancedFilter', 'Advanced Filter')
							+ ':' + advfilter);
				}
			}
		});
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
	updateDateFilterView : function() {
		var me = this;
		var dtLoginDate = null;
		if (!Ext.isEmpty(me.dateFilterVal)) {
			me.handleDateChange(me.dateFilterVal);
			if (me.dateFilterVal === '7') {
				if (!Ext.isEmpty(me.dateFilterFromVal)) {
					dtLoginDate = Ext.Date.parse(me.dateFilterFromVal, "Y-m-d");
					me.getFromLoginDate().setValue(dtLoginDate);
				}
				if (!Ext.isEmpty(me.dateFilterToVal)) {
					dtLoginDate = Ext.Date.parse(me.dateFilterToVal, "Y-m-d");
					me.getToLoginDate().setValue(dtLoginDate);
				}
			}
		}

	},
	loginDateChange : function(btn, opts) {
		var me = this;
		me.loginDateFilterVal = btn.btnValue;
		me.loginDateFilterLabel = btn.text;
		me.handleLoginDateChange(btn.btnValue);
	},
	logoutDateChange : function(btn, opts) {
		var me = this;
		me.logoutDateFilterVal = btn.btnValue;
		me.logoutDateFilterLabel = btn.text;
		me.handleLogoutDateChange(btn.btnValue);
	},
	handleLoginDateChange : function(index) {
		var me = this;
		var dateToField;
		var objDateParams = me.getDateParam(index, 'logintime');

		if (!Ext.isEmpty(me.loginDateFilterLabel)) {
			$('label[for="LoginDateLabel"]').text(getLabel('loginDate',
					'Last Login Date')
					+ " (" + me.loginDateFilterLabel + ")");
		}else
		{
				$('label[for="LoginDateLabel"]').text(getLabel('loginDate',
						'Last Login Date'));
		}
		var vFromDate = Ext.util.Format.date(Ext.Date.parse(
						objDateParams.fieldValue1, 'Y-m-d'),
				strExtApplicationDateFormat);
		var vToDate = Ext.util.Format.date(Ext.Date.parse(
						objDateParams.fieldValue2, 'Y-m-d'),
				strExtApplicationDateFormat);
		var filterOperator = objDateParams.operator;

		if (index == '13') {
			if (filterOperator == 'eq') {
				$('#logintime').datepick('setDate',vFromDate);
				filterType = "logintime";
				updateToolTip(filterType," (Date Range)");
			} else {
				$('#logintime').datepick('setDate',[vFromDate, vToDate]);
			}
			if (filterOperator == 'eq')
				dateToField = "";
			else
				dateToField = vToDate;
			selectedLoginDate = {
				operator : filterOperator,
				fromDate : vFromDate,
				toDate : dateToField
			};
		} else {
			if (index === '1' || index === '2') {				
					$('#logintime').datepick('setDate',vFromDate);
			} else {
				$('#logintime').datepick('setDate',[vFromDate, vToDate]);
			}
			if (filterOperator == 'eq')
				dateToField = "";
			else
				dateToField = vToDate;
			selectedLoginDate = {
				operator : filterOperator,
				fromDate : vFromDate,
				toDate : dateToField
			};
		}
		if (new Date($("#logouttime").val()) < new Date($("#logintime").val())) {
			$("#logouttime").val("");
			me.datePickerSelectedLogoutAdvDate = [];
			selectedLogoutDate = {};
		}
	},
	handleLogoutDateChange : function(index) {
		var me = this;
		var dateToField;
		var objDateParams = me.getDateParam(index, 'logouttime');

		if (!Ext.isEmpty(me.logoutDateFilterLabel)) {
			$('label[for="LogoutDateLabel"]').text(getLabel('logoutDate',
					'Last Logout Date')
					+ " (" + me.logoutDateFilterLabel + ")");
		}else
		{
			$('label[for="LogoutDateLabel"]').text(getLabel('logoutDate',
					'Last Logout Date'));
		}
		var vFromDate = Ext.util.Format.date(Ext.Date.parse(
						objDateParams.fieldValue1, 'Y-m-d'),
				strExtApplicationDateFormat);
		var vToDate = Ext.util.Format.date(Ext.Date.parse(
						objDateParams.fieldValue2, 'Y-m-d'),
				strExtApplicationDateFormat);
		var filterOperator = objDateParams.operator;

		if (index == '13') {
			if (filterOperator == 'eq') {
				$('#logouttime').datepick('setDate',vFromDate);
				filterType = "logouttime";
				updateToolTip(filterType," (Date Range)");
			} else {
				$('#logouttime').datepick('setDate',[vFromDate, vToDate]);
			}
			if (filterOperator == 'eq')
				dateToField = "";
			else
				dateToField = vToDate;
			selectedLogoutDate = {
				operator : filterOperator,
				fromDate : vFromDate,
				toDate : dateToField
			};
		} else {
			if (index === '1' || index === '2') {				
					$('#logouttime').datepick('setDate',vFromDate);
			} else {
				$('#logouttime').datepick('setDate',[vFromDate, vToDate]);
			}
			if (filterOperator == 'eq')
				dateToField = "";
			else
				dateToField = vToDate;
			selectedLogoutDate = {
				operator : filterOperator,
				fromDate : vFromDate,
				toDate : dateToField
			};
		}
	},
		handleDateChange : function(index) {
		var me = this;
		var objDateParams = me.getDateParam(index);
		var datePickerRef=$('#entryDataPicker');
		
		if (!Ext.isEmpty(me.dateFilterLabel)) {
			me.getLoginDateLabel().setText(getLabel('loginDate', 'Last Login Date') + "("
							+ me.dateFilterLabel + ")");
		}else
		{
			me.getLoginDateLabel().setText(getLabel('loginDate', 'Last Login Date'));
		}
		
		var vFromDate = Ext.util.Format.date(Ext.Date.parse(objDateParams.fieldValue1, 'Y-m-d'),strExtApplicationDateFormat);
		var vToDate = Ext.util.Format.date(Ext.Date.parse(objDateParams.fieldValue2, 'Y-m-d'),strExtApplicationDateFormat);
		
		if (index == '13') {
			if (objDateParams.operator == 'eq') {
				datePickerRef.datepick('setDate',vFromDate);
				selectedLoginDate = {
						operator : objDateParams.operator,
						fromDate : vFromDate,
						toDate : vFromDate
					};
			} else {
				datePickerRef.datepick('setDate',[vFromDate, vToDate]);
				selectedLoginDate = {
						operator : objDateParams.operator,
						fromDate : vFromDate,
						toDate : vToDate
					};
			}
		} else {
				if (index === '1' || index === '2') {
						if(index === '1')
							{
								datePickerRef.val(vFromDate);
							}
						else{
							datePickerRef.datepick('setDate',vFromDate);
						}	
						selectedLoginDate = {
								operator : objDateParams.operator,
								fromDate : vFromDate,
								toDate : vFromDate
							};
				} else {
					datePickerRef.datepick('setDate',[vFromDate, vToDate]);
					selectedLoginDate = {
							operator : objDateParams.operator,
							fromDate : vFromDate,
							toDate : vToDate
						};
				}
		}
		me.handleLoginDateSync('Q', me.getLoginDateLabel().text, " (" + me.dateFilterLabel + ")", datePickerRef);
	},
		updateFilterFields:function(){
				var me=this;
				var clientCodesFltId;
				var userActivityFilterView = me.getUserActivityFilterView();
				if (!Ext.isEmpty(me.savedFilterVal)) {
					me.SearchOrSave = true;
					me.getSavedFilterData(me.savedFilterVal, me.populateSavedFilter, true);
				}
				var savedFilterComboBox = userActivityFilterView.down('combo[itemId="savedFiltersCombo"]');
				if (!Ext.isEmpty(me.savedFilterVal)) {
					savedFilterComboBox.setValue(me.savedFilterVal);
				}
				
				if (!isClientUser()) {
					clientCodesFltId = userActivityFilterView.down('combobox[itemId=clientAuto]');
					if(selectedUserAdvClient !=''){
						clientCodesFltId.suspendEvents();
						clientCodesFltId.setValue(me.clientFilterVal);
						clientCodesFltId.resumeEvents();
					}else{
						me.clientFilterVal = 'all';			
					}
					
				} else {
					clientCodesFltId = userActivityFilterView.down('combo[itemId="clientCombo"]');
					if(selectedUserAdvClient !=''){
							clientCodesFltId.setRawValue(selectedClientDesc);			
					}	
					else{	
						clientCodesFltId.setRawValue(getLabel('allCompanies', 'All Companies'));
						me.clientFilterVal = 'all';
					}
				}
						
				var userNameFltId= userActivityFilterView.down('combo[itemId="userNameFltId"]');
				userNameFltId.setRawValue(selectUserAdvUserNameDesc);
				
				var savedFilterComboBox = userActivityFilterView.down('combo[itemId="savedFiltersCombo"]');
				if (!Ext.isEmpty(me.savedFilterVal)) {
					savedFilterComboBox.setValue(me.savedFilterVal);
				}

				var loginDateLableVal = $('label[for="LoginDateLabel"]').text();
				var loginDateField = $("#logintime");
				me.handleLoginDateSync('A', loginDateLableVal, null, loginDateField);
			},
	handleEntryDateChange:function(filterType,btn,opts){
				var me=this;
				if(filterType=="entryDateQuickFilter"){
					me.dateFilterVal = btn.btnValue;
					me.dateFilterLabel = btn.text;
					me.handleDateChange(btn.btnValue);
					me.filterAppiled = 'Q';
					me.datePickerSelectedDate = [];
					me.datePickerSelectedLoginAdvDate = [];
					me.setDataForFilter();
					me.applyQuickFilter();
				}
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
				var frmDate = me.getFromEntryDate().getValue();
				var toDate = me.getToEntryDate().getValue();
				fieldValue1 = Ext.Date.format(frmDate, strSqlDateFormat);
				fieldValue2 = Ext.Date.format(toDate, strSqlDateFormat);
				operator = 'bt';
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
			case '12':
				// Latest
				var fromDate = new Date(Ext.Date.parse(latestFromDate, dtFormat));
	    		var toDate = new Date(Ext.Date.parse(latestToDate, dtFormat));		
		 
				fieldValue1 = Ext.Date.format(fromDate,strSqlDateFormat);
				fieldValue2 = Ext.Date.format(toDate,strSqlDateFormat);
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
			case '13' :				
					// Date Range
					if(!isEmpty(me.datePickerSelectedDate)){
						if (me.datePickerSelectedDate.length == 1) {
							fieldValue1 = Ext.Date.format(me.datePickerSelectedDate[0],strSqlDateFormat);
							fieldValue2 = fieldValue1;
							operator = 'eq';
						}else if (me.datePickerSelectedDate.length == 2) {
							fieldValue1 = Ext.Date.format(me.datePickerSelectedDate[0],strSqlDateFormat);
							fieldValue2 = Ext.Date.format(me.datePickerSelectedDate[1], strSqlDateFormat);
								operator = 'bt';
						}
				}
				if('logintime' === dateType  && !isEmpty(me.datePickerSelectedLoginAdvDate)){
					if (me.datePickerSelectedLoginAdvDate.length == 1) {
						fieldValue1 = Ext.Date.format(me.datePickerSelectedLoginAdvDate[0],
								strSqlDateFormat);
						fieldValue2 = fieldValue1;
						operator = 'eq';
					} else if (me.datePickerSelectedLoginAdvDate.length == 2) {
						fieldValue1 = Ext.Date.format(me.datePickerSelectedLoginAdvDate[0],
								strSqlDateFormat);
						fieldValue2 = Ext.Date.format(me.datePickerSelectedLoginAdvDate[1],
								strSqlDateFormat);
						operator = 'bt';
					}
				}
			 	if('logouttime' === dateType && !isEmpty(me.datePickerSelectedLogoutAdvDate)){
					if (me.datePickerSelectedLogoutAdvDate.length == 1) {
						fieldValue1 = Ext.Date.format(me.datePickerSelectedLogoutAdvDate[0],
								strSqlDateFormat);
						fieldValue2 = fieldValue1;
						operator = 'eq';
					} else if (me.datePickerSelectedLogoutAdvDate.length == 2) {
						fieldValue1 = Ext.Date.format(me.datePickerSelectedLogoutAdvDate[0],
								strSqlDateFormat);
						fieldValue2 = Ext.Date.format(me.datePickerSelectedLogoutAdvDate[1],
								strSqlDateFormat);
						operator = 'bt';
					}
				}
		}
		retObj.fieldValue1 = fieldValue1;
		retObj.fieldValue2 = fieldValue2;
		retObj.operator = operator;
		return retObj;
	},
	onUserActivityInformationViewRender : function() {
		var me = this;
		var infoLowerPanel = me.getInfoSummaryLowerPanel();
		var userActivityViewRef = me.getUserActivityInformation();
		if (!Ext.isEmpty(userActivityViewRef) && !Ext.isEmpty(infoLowerPanel)) {
			userActivityViewRef.remove(infoLowerPanel);
		}
		var strInfoUrl = 'userActivityInfo.srvc?' + csrfTokenName + '='
				+ csrfTokenValue;
		strInfoUrl=strInfoUrl +"&$filter="+me.clientValue; 

		Ext.Ajax.request({
					url : strInfoUrl,
					method : "POST",
					async : false,
					success : function(response) {
						var data = Ext.decode(response.responseText);
						if (!Ext.isEmpty(data)) {
							userActivityViewRef
									.createSummaryLowerPanelView(data.d.activitylist);
						}
					},
					failure : function(response) {
						console.log('Error Occured');
					}
				});
	},

	// This function will called only once
	updateAdvFilterConfig : function() {
		var me = this;
		if (!Ext.isEmpty(objGridViewFilter)) {
			var data = Ext.decode(objGridViewFilter);
			if (!Ext.isEmpty(data.advFilterCode)) {
				me.showAdvFilterCode = data.advFilterCode;
				me.savePrefAdvFilterCode = data.advFilterCode;
				var strUrl = 'userfilters/userActivityFilter/{0}.srvc';
				strUrl = Ext.String.format(strUrl, data.advFilterCode);
				Ext.Ajax.request({
					url : strUrl + '?' + csrfTokenName + '=' + csrfTokenValue,
					async : false,
					method : 'GET',
					success : function(response) {
						var responseData = Ext.decode(response.responseText);

						var applyAdvFilter = false;
						me.populateSavedFilter(data.advFilterCode,
								responseData, applyAdvFilter);
						var objOfCreateNewFilter = me.getCreateNewFilter();
						var objJson = objOfCreateNewFilter
								.getAdvancedFilterQueryJson(objOfCreateNewFilter);

						me.advFilterData = objJson;

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
									icon : Ext.MessageBox.ERROR
								});

					}
				});
			}
		}
	},

	updateFilterConfig : function() {
		var me = this;
		var arrJsn = new Array();
		var loginDateValArray = [];
		// TODO : Localization to be handled..
		var objDateLbl = {
			'1' : getLabel('today', 'Today'),
			'2' : getLabel('yesterday', 'Yesterday'),
			'3' : getLabel('thisweek', 'This Week'),
			'4' : getLabel('lastweek', 'Last Week'),
			'5' : getLabel('thismonth', 'This Month'),
			'6' : getLabel('lastmonth', 'Last Month'),
			'14': getLabel('lastmonthonly', 'Last Month Only'),
			'7' : getLabel('daterange', 'Date Range'),
			'8' : getLabel('thisquarter', 'This Quarter'),
			'9' : getLabel('lastQuarterToDate','Last Quarter To Date'),
			'10' : getLabel('thisyear', 'This Year'),
			'11' : getLabel('lastyeartodate', 'Last Year To Date')
		};
		if (!Ext.isEmpty(objUserActivityFilterPref)) {
			var data = Ext.decode(objUserActivityFilterPref);
			var data1 = data.d.preferences.gridViewFilter;
			if( data1 != 'undefined' && !Ext.isEmpty(data1))
			{
			var strDtValue = data1.quickFilter.loginDate;
			var strDtFrmValue = data1.quickFilter.loginDateFrom;
			var strDtToValue = data1.quickFilter.loginDateTo;
			var userType = data1.quickFilter.userType;
			me.clientFilterVal = data1.clientCode;
			me.clientFilterDesc = data1.clientDesc;
			me.userName = data1.userName;				
			}
			if (!Ext.isEmpty(strDtValue)) {
				me.dateFilterLabel = objDateLbl[strDtValue];
				me.dateFilterVal = strDtValue;
				if (strDtValue === '13') {
					if (!Ext.isEmpty(strDtFrmValue))
						{
							me.dateFilterFromVal = strDtFrmValue;
							me.datePickerSelectedDate[0]=Ext.Date.parse(strDtFrmValue, 'Y-m-d')
						}	
					if (!Ext.isEmpty(strDtToValue))
						{
							me.dateFilterToVal = strDtToValue;
							me.datePickerSelectedDate[1]=Ext.Date.parse(strDtToValue, 'Y-m-d')
						}	
				}
				me.typeFilterVal = !Ext.isEmpty(userType) ? userType : 'all';
			}

		}
		if (!Ext.isEmpty(me.dateFilterVal)) {
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
			if ((!Ext.isEmpty(strVal1) && (strOpt === 'eq' || strOpt === 'le'))
					|| (!Ext.isEmpty(strVal1) && !Ext.isEmpty(strVal2) && strOpt === 'bt'))			
				{
				if(!Ext.isEmpty(strVal1))
					loginDateValArray.push(strVal1)
				if(!Ext.isEmpty(strVal2))
					loginDateValArray.push(strVal2)
			arrJsn.push({
						paramName : 'loginTime',
						paramValue1 : strVal1,
						paramValue2 : strVal2,
						operatorValue : strOpt,
						dataType : 'D',
						paramIsMandatory : true,
						paramFieldLable : getLabel('loginDate', 'Last Login Date'),
						paramFieldValue : loginDateValArray.toString()
					});
				}	
					
		}

		if (!Ext.isEmpty(me.typeFilterVal)
				&& (me.typeFilterVal === 'Y' || me.typeFilterVal === 'N')) {
			arrJsn.push({
						paramName : 'loginStatus',
						paramValue1 : encodeURIComponent(me.typeFilterVal.replace(new RegExp("'", 'g'), "\''")),
						operatorValue : 'eq',
						dataType : 'S',
						paramFieldLable : getLabel('loginStatus', 'Status'),
						paramFieldValue : me.typeFilterVal
					});
		} else if (!Ext.isEmpty(me.typeFilterVal) && me.typeFilterVal != 'all') {
			arrJsn.push({
						paramName : 'userCode',
						paramValue1 : encodeURIComponent(me.typeFilterVal.replace(new RegExp("'", 'g'), "\''")),
						operatorValue : 'eq',
						dataType : 'S',
						paramFieldLable : getLabel('userCode', 'User Name'),
						paramFieldValue : me.userName
					});
		}
		if(me.bankUserFlag){
			arrJsn.push({
						paramName : 'bankUserFlag',
						paramValue1 : 0,
						operatorValue : 'eq',
						dataType : 'S',
						paramFieldLable : getLabel('bankUserFlag', 'Bank User')
					});
		}else{
			arrJsn.push({
						paramName : 'bankUserFlag',
						paramValue1 : 1,
						operatorValue : 'eq',
						dataType : 'S',
						paramFieldLable : getLabel('bankUserFlag', 'Bank User')
					});
		}

		me.filterData = arrJsn;
	},

	getAllSavedAdvFilterCode : function(panel) {
		var me = this;
		Ext.Ajax.request({
					url : 'userfilterslist/userActivityFilter.srvc?'
							+ csrfTokenName + '=' + csrfTokenValue,
					method : 'GET',
					/*
					 * params : { csrfTokenName : tokenValue },
					 */
					success : function(response) {
						var responseData = Ext.decode(response.responseText);
						var arrFilters = [];
						var filterData = responseData.d.filters;
						if (filterData) {
							arrFilters = filterData;
						}
					},
					failure : function(response) {
						console
								.log('Bad : Something went wrong with your request');
					}
				});
	},

	addAllSavedFilterCodeToView : function(arrFilters) {
		var me = this;
		var objToolbar = this.getAdvFilterActionToolBar();
		if (objToolbar.items && objToolbar.items.length > 0)
			objToolbar.removeAll();

		if (arrFilters && arrFilters.length > 0) {

			var toolBarItems = [];
			var item;
			for (var i = 0; i < 2; i++) {

				item = Ext.create('Ext.Button', {
							cls : 'cursor_pointer xn-account-filter-btnmenu',
							text : arrFilters[i],
							itemId : arrFilters[i],
							handler : function(btn, opts) {
								objToolbar.fireEvent(
										'handleSavedFilterItemClick',
										btn.itemId, btn);
							}
						});
				toolBarItems.push(item);
			}
			item = Ext.create('Ext.Button', {
						cls : 'cursor_pointer xn-account-filter-btnmenu',
						text : '<span class="button_underline">'
								+ getLabel('moreText', 'more') + '</span>'
								+ '>>',
						itemId : 'AdvMoreBtn',
						handler : function(btn, opts) {
							me.handleMoreAdvFilterSet(btn.itemId);
						}
					});
			toolBarItems.push('-');
			toolBarItems.push(item);
			objToolbar.removeAll();
			objToolbar.add(toolBarItems);
		}
	},

	handleMoreAdvFilterSet : function(btnId) {
		var me = this;
		if (!Ext.isEmpty(me.objAdvFilterPopup)) {
			me.objAdvFilterPopup.show();
			var objTabPanel = me.getAdvanceFilterTabPanel();
			objTabPanel.setActiveTab(0);
			var filterDetailsTab = me.getFilterDetailsTab();
			filterDetailsTab.setTitle(getLabel('filterDetails',
					'Filter Details'));
		} else {
			me.objAdvFilterPopup = Ext
					.create('GCP.view.UserActivityAdvancedFilterPopup');
			var objTabPanel = me.getAdvanceFilterTabPanel();
			objTabPanel.setActiveTab(0);
			me.objAdvFilterPopup.show();
			var filterDetailsTab = me.getFilterDetailsTab();
			filterDetailsTab.setTitle(getLabel('filterDetails',
					'Filter Details'));
		}
	},

	/*
	 * handleAdvFltLoadGridData : function(grid, isLoading) { var me = grid; var
	 * blnLoad = true; if (!Ext.isEmpty(isLoading)) blnLoad = false;
	 * me.setLoading(blnLoad); Ext.Ajax.request({ url :
	 * 'static/scripts/payments/paymentSummary/data/filterlst.json', method :
	 * 'GET', success : function(response) { var decodedJson =
	 * Ext.decode(response.responseText); me.store.loadRawData(decodedJson);
	 * me.setLoading(false); }, failure : function() { me.setLoading(false);
	 * Ext.MessageBox.show({ title : getLabel('errorPopUpTitle', 'Error'), msg :
	 * getLabel('errorPopUpMsg', 'Error while fetching data..!'), buttons :
	 * Ext.MessageBox.OK, icon : Ext.MessageBox.ERROR }); } }); },
	 */

	setDataForFilter : function(filterData) {
		var me = this;
		//me.getSearchTxnTextInput().setValue('');
		var arrQuickJson = {};
		me.advFilterData = {};
		me.filterData = {};
		var bankUser=me.getBankUser();
		if(!Ext.isEmpty(bankUser)){
		 me.bankUserFlag=bankUser.getValue();
		}
		if (this.filterApplied === 'Q') {
			$("#useradvclient option[value='"+me.clientFilterVal+"']").attr("selected",true);
			$("#useradvclient").multiselect("refresh");
			$("#useradvusername").val(me.userName);
			
		} 
			me.filterData = me.getQuickFilterQueryJson();
			var objJson = (!Ext.isEmpty(filterData) ? filterData.filterBy : getAdvancedFilterQueryJson());
			
			if(objUserActAdvSyncWithQuick === true){
				var reqJson = me.findInAdvFilterData(objJson,'bankUserFlag');
				if(!Ext.isEmpty(reqJson))
				{
					arrQuickJson = me.filterData;
					arrQuickJson = me.removeFromQuickArrJson(arrQuickJson,'bankUserFlag');
					me.filterData = arrQuickJson;
					me.updateQuickBankUserFlag(reqJson.value1);
				}
				
				var reqJson = me.findInAdvFilterData(objJson,'clientName');
				if(!Ext.isEmpty(reqJson))
				{
					arrQuickJson = me.filterData;
					arrQuickJson = me.removeFromQuickArrJson(arrQuickJson,'clientName');
					me.filterData = arrQuickJson;
					me.updateQuickClientName(reqJson.value1,reqJson.value2);
				}
				
				var reqJson = me.findInAdvFilterData(objJson,'userName');
				if(!Ext.isEmpty(reqJson))
				{
					arrQuickJson = me.filterData;
					arrQuickJson = me.removeFromQuickArrJson(arrQuickJson,'userName');
					me.filterData = arrQuickJson;
					var userCode = reqJson.value1 ;
					userCode = encodeURIComponent(userCode.toUpperCase().replace(new RegExp("'", 'g'), "\''"))
					me.updateQuickUserName(userCode,reqJson.value2);
				}
				
				var reqJson = me.findInAdvFilterData(objJson,'loginTime');
				if(!Ext.isEmpty(reqJson))
				{
					arrQuickJson = me.filterData;
					arrQuickJson = me.removeFromQuickArrJson(arrQuickJson,'loginTime');
					me.filterData = arrQuickJson;
				}
			}
			me.advFilterData = objJson;
			var filterCode = $("input[type='text'][id='savedFilterAs']").val();
			if(!Ext.isEmpty(filterCode))
				me.advFilterCodeApplied = filterCode;
	},
	
	updateQuickBankUserFlag : function(value){
		var me = this;
		var quickBankUserChkBox = me.getBankUser();
		if(!Ext.isEmpty(value) && value === 0){
			blnBankUser = false;
			quickBankUserChkBox.setValue(true);
		}
		blnBankUser = true;
	},
	
	updateQuickClientName : function(value,desc){
		var me = this;
		var objOfUserActivityFilterView = me.getUserActivityFilterView();
		if(isClientUser()){
			if (!Ext.isEmpty(objOfUserActivityFilterView))
				var quickClient = objOfUserActivityFilterView.down('combobox[itemId="clientBtn"]');
			if(!Ext.isEmpty(value) && !Ext.isEmpty(quickClient))
				quickClient.setValue(value);
		}
		else{
			if (!Ext.isEmpty(objOfUserActivityFilterView))
				var quickClientAutoComp = objOfUserActivityFilterView.down('AutoCompleter[itemId="clientAutoCompleter"]');
			if(!Ext.isEmpty(value) && !Ext.isEmpty(quickClientAutoComp))
				quickClientAutoComp.setValue(value);
				quickClientAutoComp.setRawValue(desc);
		}
	},
	
	updateQuickUserName : function(value,desc){
		var me = this;
		var objOfUserActivityFilterView = me.getUserActivityFilterView();
		
		if (!Ext.isEmpty(objOfUserActivityFilterView))
				var quickUserNameAutoComp = objOfUserActivityFilterView.down('AutoCompleter[itemId="userNameFltId"]');
			
		if(!Ext.isEmpty(value) && !Ext.isEmpty(quickUserNameAutoComp))	
		    selectUserAdvUserNameDesc = selectUserAdvUserNameDesc.replace(/amp;/g,'');
			selectUserAdvUserNameDesc = selectUserAdvUserNameDesc.replace(/&quot;/g,'"');
			quickUserNameAutoComp.setValue(selectUserAdvUserNameCode);
			quickUserNameAutoComp.setRawValue(selectUserAdvUserNameDesc);
		
	},
	
	getQuickFilterQueryJson : function() {
		var me = this;
		var typeFilterVal = me.typeFilterVal;
		var jsonArray = [];
		var index = me.dateFilterVal;
		var clientFilterVal = me.clientFilterVal;
		var clientFilterDesc = me.clientFilterDesc;
		var userCodeValue = "";
		var userNameFltId = null;
		var objDateParams;
		objDateParams = me.getDateParam(index);
		var objOfCreateNewFilter = me.getUserActivityFilterView();
		if (!Ext.isEmpty(objOfCreateNewFilter)){
			userNameFltId = objOfCreateNewFilter.down('AutoCompleter[itemId=userNameFltId"]');
			if (!Ext.isEmpty(userNameFltId) && !Ext.isEmpty(userNameFltId.getValue())) {
				userCodeValue = userNameFltId.getValue();
				userCodeValue = userCodeValue.replace(/amp;/g,'');
				userCodeValue = userCodeValue.replace(/&quot;/g,'"');
				var userCodeDesc = userNameFltId.getRawValue();
				userCodeDesc = userCodeDesc.replace(/amp;/g,'');
				userCodeDesc = userCodeDesc.replace(/&quot;/g,'"');
				$("#useradvusername").val(userCodeDesc);
				
			}
			var clientComboBox = objOfCreateNewFilter.down('combo[itemId=clientCombo"]');
			if (!Ext.isEmpty(clientComboBox) && !Ext.isEmpty(clientComboBox.getValue())) {
				clientFilterVal = clientComboBox.getValue();
				clientFilterDesc = clientComboBox.getRawValue();
				$("#useradvclient option[value='"+clientFilterVal+"']").attr("selected",true);
			}
		}
		if (typeFilterVal != null && typeFilterVal === 'all') {
			
					if (!Ext.isEmpty(clientFilterVal) && clientFilterVal != 'all') {
						jsonArray.push({
									paramName : 'clientName',
									paramValue1 : encodeURIComponent(clientFilterVal.replace(new RegExp("'", 'g'), "\''")),
									operatorValue : 'eq',
									dataType : 'S',
									displayType : 5,
									paramFieldLable : getLabel('lblcompany', 'Company Name'),
									displayValue1 : clientFilterDesc
								});
					}
			
				
					if (!Ext.isEmpty(userCodeValue) && userCodeValue !== null && userCodeValue!='all') {
						jsonArray.push({
							paramName : 'userName',
							operatorValue : 'lk',
							paramValue1 : encodeURIComponent(userCodeValue.toUpperCase().replace(new RegExp("'", 'g'), "\''")).toUpperCase(),
							dataType : 'S',
							displayType : 5,
							paramFieldLable : getLabel('userCode','User Name'),
							displayValue1 : userCodeDesc
						});
					}
					if (!Ext.isEmpty(index)) {
			jsonArray.push({					
						paramName : 'loginTime',
						paramValue1 : objDateParams.fieldValue1,
						paramValue2 : objDateParams.fieldValue2,
						operatorValue : objDateParams.operator,
						dataType : 'D',
						paramIsMandatory : true,
						paramFieldLable : getLabel('loginDate','Last Login Date')
					});
				}
		} else if (typeFilterVal != null
				&& (typeFilterVal === 'Y' || typeFilterVal === 'N')) {
				if(typeFilterVal == 'Y')
					var strLoginStatus = "Active";
				else
					strLoginStatus = "Disabled";
			objDateParams = me.getDateParam('1');
			jsonArray.push({
						paramName : me.getLoginDate().filterParamName,
						paramValue1 : objDateParams.fieldValue1,
						paramValue2 : objDateParams.fieldValue2,
						operatorValue : objDateParams.operator,
						dataType : 'D'
					});
			jsonArray.push({
						paramName : 'loginStatus',
						paramValue1 : encodeURIComponent(typeFilterVal.replace(new RegExp("'", 'g'), "\''")),
						operatorValue : 'eq',
						dataType : 'S',
						displayType : 5,
						fieldLabel : getLabel('loginStatus','Status'),
						displayValue1 : strLoginStatus
					});
		} else {
			jsonArray.push({
						paramName : 'userName',
						paramValue1 : encodeURIComponent(typeFilterVal.replace(new RegExp("'", 'g'), "\''")).toUpperCase(),
						operatorValue : 'eq',
						dataType : 'S',
						displayType : 4,
						paramFieldLable : getLabel('userCode','User Name'),
						displayValue1 : userCodeValue
					});
		}
		if(me.bankUserFlag){
		jsonArray.push({
						paramName : 'bankUserFlag',
						paramValue1 : 0,
						operatorValue : 'eq',
						dataType : 'S',
						paramFieldLable : getLabel('bankUserFlag','Bank User')
					});
		}
		return jsonArray;
		
	},

	handleType : function(btn) {
		var me = this;
		me.disablePreferencesButton("savePrefMenuBtn",false);
		me.getUsrActToolBar().items.each(function(item) {
					item.removeCls('xn-custom-heighlight');
					item.addCls('xn-account-filter-btnmenu');
				});
		btn.addCls('xn-custom-heighlight xn-account-filter-btnmenu');
		me.typeFilterVal = btn.code;
		me.typeFilterDesc = btn.btnDesc;
		me.setDataForFilter();
		if (me.typeFilterVal === 'all') {
			me.filterApplied = 'ALL';
		} else {
		}
	},
	applyFilter : function() {
		var me = this;
		var objGroupView = me.getGroupView();
		var grid = objGroupView.getGrid();
		if (!Ext.isEmpty(grid)) {
			var strDataUrl = grid.store.dataUrl;
			var store = grid.store;
			var strUrl = grid.generateUrl(strDataUrl, grid.pageSize, 1, 1,
					store.sorters);
			strUrl = strUrl + me.getFilterUrl(me.subGroupInfo, me.groupInfo) + '&' + csrfTokenName + '='
					+ csrfTokenValue;
			grid.setLoading(true);
			grid.loadGridData(strUrl, me.handleAfterGridDataLoad, null);
		}
	},

	applyQuickFilter : function() {
		 var me = this;
		var objGroupView = me.getGroupView();
		var groupInfo = objGroupView.getGroupInfo();
		me.filterApplied = 'Q';
		if (groupInfo && groupInfo.groupTypeCode === 'USERACTIVITY_OPT_ADVFILTER') {
			objGroupView.setActiveTab('all');
		} else
			me.refreshData();
	},
getFilterUrl : function(subGroupInfo, groupInfo) {
		var me = this;
		var bankUser=me.getBankUser();
		if(!Ext.isEmpty(bankUser)){
		 me.bankUserFlag=bankUser.getValue();
		}
		var strQuickFilterUrl = '', strAdvFilterUrl = '', strUrl = '', strActionStatusUrl = '', isFilterApplied = false;
		var strGroupQuery = (subGroupInfo && subGroupInfo.groupQuery)
								? subGroupInfo.groupQuery
								: '';
		if(me.filterApplied === 'ALL')
		{
			strQuickFilterUrl = me.generateUrlWithQuickFilterParams(this);
			if (!Ext.isEmpty(strQuickFilterUrl)) {
				strUrl = strQuickFilterUrl;
				isFilterApplied = true;
			}
			else {
				if(Ext.isEmpty(strUrl)){
					strUrl = '&$filter=' ;
					if(me.bankUserFlag)
						strUrl = strUrl + "bankUserFlag eq '0' ";
					else
						strUrl = strUrl + "bankUserFlag eq '1' ";
				}
			}
			//return strUrl;
		}
		else
		{
				strQuickFilterUrl = me.generateUrlWithQuickFilterParams(this);
				if (!Ext.isEmpty(strQuickFilterUrl)) {
					strUrl += '&$filter=' + strQuickFilterUrl;
					isFilterApplied = true;
				}
				
				strAdvFilterUrl = me.generateUrlWithAdvancedFilterParams(isFilterApplied);
				if (!Ext.isEmpty(strAdvFilterUrl)) {
					if(Ext.isEmpty(strUrl)){
						strUrl = '&$filter=' ;
					}
					else
						strUrl += ' and ';
					strUrl += strAdvFilterUrl;
					isFilterApplied = true;
				}
				
			//return strUrl;
		}
		if (!Ext.isEmpty(strGroupQuery)) {
			if (!Ext.isEmpty(strUrl))
				strUrl += ' and ' + strGroupQuery;
			else
				strUrl += '&$filter=' + strGroupQuery;
		}
		return strUrl;
	},
	generateUrlWithQuickFilterParams : function(me) {

		var filterData = me.filterData;
		var isFilterApplied = false;
		var strTemp = '';
		var strFilter = '';
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
		return strTemp;
	},
	generateUrlWithAdvancedFilterParams : function(blnIsFilterApplied) {
		var thisClass = this;
		var filterData = thisClass.advFilterData;
		var isFilterApplied = blnIsFilterApplied;
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
				if (isFilterApplied && (operator === 'bt' || operator === 'lk' || operator === 'gt' || operator === 'lt') && !isEmpty(strTemp))
					strTemp = strTemp + ' and ';
				switch (operator) {
					case 'bt' :
						isFilterApplied = true;
						if (filterData[index].dataType === 1) {
							strTemp = strTemp + filterData[index].field + ' '
									+ filterData[index].operator + ' '
									+ 'date\'' + filterData[index].value1
									+ '\'' + ' and ' + 'date\''
									+ filterData[index].value2 + '\'';
						} else {
							strTemp = strTemp + filterData[index].field + ' '
									+ filterData[index].operator + ' ' + '\''
									+ filterData[index].value1 + '\'' + ' and '
									+ '\'' + filterData[index].value2 + '\'';
						}
						break;
					case 'st' :
						if (!isOrderByApplied) {
							strTemp = strTemp + ' &$orderby=';
							isOrderByApplied = true;
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
						isInCondition = thisClass.isInCondition(filterData[index]);
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
									// Special case we need to send to_date in datetime to get the 
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
						if( filterData[ index ].dataType === 1 )
						{
							// Special case we need to send to_date in datetime to get the 
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

	isInCondition : function(data) {
		var retValue = false;
		var displayType = data.displayType;
		var strValue = data.value1;
		var reg = new RegExp(/^\((\d\d*,)*\d\d*\)$/);
		if (displayType && displayType === 4 && strValue && strValue.match(reg)) {
			retValue = true;
		}

		return retValue;

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
		
		me.deleteFilterCodeFromDb(objFilterName);
		me.sendUpdatedOrderJsonToDb();
	},
	deleteFilterCodeFromDb : function(objFilterName) {
		var me = this;
		if (!Ext.isEmpty(objFilterName)) {
			var strUrl = 'userfilters/userActivityFilter/{0}/remove.srvc?'
					+ csrfTokenName + '=' + csrfTokenValue;
			strUrl = Ext.String.format(strUrl, objFilterName);

			Ext.Ajax.request({
						url : strUrl,
						method : "POST",
						success : function(response) {

						},
						failure : function(response) {
						}
					});
		}
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
			url : 'userpreferences/userActivityList/userActivityAdvanceFilter.srvc?',
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
	updateAdvActionToolbar : function() {
		var me = this;
		Ext.Ajax.request({
			url : 'userpreferences/userActivityList/userActivityAdvanceFilter.srvc?'
					+ csrfTokenName + '=' + csrfTokenValue,
			method : 'GET',
			/*
			 * params : { csrfTokenName : tokenValue },
			 */
			success : function(response) {
				var responseData = Ext.decode(response.responseText);

				var filters = JSON.parse(responseData.preference);

				me.addAllSavedFilterCodeToView(filters.filters);

			},
			failure : function() {
				console.log("Error Occured - Addition Failed");

			}

		});
	},
	closeFilterPopup : function(btn) {
		var me = this;
		me.getAdvanceFilterPopup().close();
	},

	viewFilterData : function(grid, rowIndex) {
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
	getSavedFilterData : function(filterCode, fnCallback, applyAdvFilter) {
		var me = this;
		var objOfCreateNewFilter = me.getCreateNewFilter();
		var objJson;
		var strUrl = 'userfilters/userActivityFilter/{0}.srvc';
		strUrl = Ext.String.format(strUrl, filterCode);
		Ext.Ajax.request({
					url : strUrl + '?' + csrfTokenName + '=' + csrfTokenValue,
					method : 'GET',
					/*
					 * params : { csrfTokenName : tokenValue },
					 */
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
									icon : Ext.MessageBox.ERROR
								});
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

	populateAndDisableSavedFilter : function(filterCode, filterData,
			applyAdvFilter) {

		var me = this;
		var fieldType = '';
		var objCreateNewFilterPanel = me.getCreateNewFilter();
		for (i = 0; i < filterData.filterBy.length; i++) {
			var fieldName = filterData.filterBy[i].field;
			var fieldVal = filterData.filterBy[i].value1;
			var fieldOper = filterData.filterBy[i].operator;
			if (fieldName === 'username' || fieldName === 'clientName' || fieldName === 'userCategory' ) {
				 fieldType = 'AutoCompleter';
			} else if (fieldName === 'logintime' || fieldName === 'logouttime') {
				 fieldType = 'datefield';
			}else if (fieldName === 'channel' || fieldName === 'userType' || fieldName === 'filterCode') {
				 fieldType = 'textfield';
			}
			else if (fieldName === 'loginStatus'){
			     fieldType = 'combo';
			}
			else if(fieldName === 'bankUserFlag'){
				filedType = 'checkbox';
				if(fieldVal === '0')
					fieldVal = true;
			}
			else 
				 fieldType = 'label';
			
		var fieldObj = objCreateNewFilterPanel.down('' + fieldType
				+ '[itemId="' + fieldName + '"]');
		

		if(!Ext.isEmpty(fieldObj)) {
			if(fieldType == "label")
			 	fieldObj.setText(fieldVal);
			else
				fieldObj.setValue(fieldVal);				
		}


		}
		objCreateNewFilterPanel.down('textfield[itemId="filterCode"]')
				.setValue(filterCode);
		objCreateNewFilterPanel.down('textfield[itemId="username"]')
				.setReadOnly(true);
		objCreateNewFilterPanel.down('AutoCompleter[itemId="corporationName"]')
				.setReadOnly(true);
		objCreateNewFilterPanel.down('AutoCompleter[itemId="clientName"]')
				.setReadOnly(true);
		objCreateNewFilterPanel.down('textfield[itemId="userCategory"]')
				.setDisabled(true);
		objCreateNewFilterPanel.down('textfield[itemId="ipAdress"]')
				.setDisabled(true);
		objCreateNewFilterPanel.down('textfield[itemId="loginStatus"]')
				.setDisabled(true);
		objCreateNewFilterPanel.down('textfield[itemId="filterCode"]')
				.setReadOnly(true);
		objCreateNewFilterPanel.down('checkbox[itemId="bankUserFlag"]')
		.setReadOnly(true);

	},
	postDoSaveAndSearch : function() {
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
		me.doSearchOnlyAdvFilter();
		objGroupView = me.getGroupView();
		objGroupView.setFilterToolTip(me.filterCodeValue || '');
	},
	doSearchOnly : function() {
		var me = this;
		me.setDataForFilter();
		me.applyQuickFilter();
	},
	applyAdvancedFilter : function(filterData) {
		var me = this, objGroupView = me.getGroupView();
		me.filterApplied = 'A';
		me.setDataForFilter(filterData);
		me.refreshData();
		if (objGroupView)
			objGroupView.toggleFilterIcon(true);
		objGroupView.setFilterToolTip(me.showAdvFilterCode || '');
	},
	handleSaveAndSearchAction : function(btn) {
		var me = this;
		var callBack = me.postDoSaveAndSearch;
		var strFilterCodeVal = null;
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
		me.savePrefAdvFilterCode = strFilterCodeVal;
			hideErrorPanel("advancedFilterErrorDiv");
			me.postSaveFilterRequest(me.filterCodeValue, callBack);
	},
	postSaveFilterRequest : function(FilterCodeVal,fncallBack) {
		var me = this;
		var strUrl = 'userfilters/userActivityFilter/{0}.srvc';
		strUrl = Ext.String.format(strUrl, FilterCodeVal);
		var objJson;
		objJson = getAdvancedFilterValueJson(FilterCodeVal);
		Ext.Ajax.request({
					url : strUrl + '?' + csrfTokenName + '=' + csrfTokenValue,
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
							strMsg = responseData.d.error.errorMessage;
							imgIcon = Ext.MessageBox.ERROR;
							Ext.MessageBox.show({
										title : title,
										msg : strMsg,
										width : 200,
										buttons : Ext.MessageBox.OK,
										icon : imgIcon
									});

						}

						if (FilterCodeVal && isSuccess && isSuccess === 'Y') {
							{
							$('#advancedFilterPopup').dialog('close');
							fncallBack.call(me);
							me.updateSavedFilterComboInQuickFilter();
							}
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
									icon : Ext.MessageBox.ERROR
								});
					}
				});

	},
	handleRangeFieldsShowHide : function(objShow) {
		var me = this;

		var objCreateNewFilterPanel = me.getCreateNewFilter();
		var toobj = objCreateNewFilterPanel.down('numberfield[itemId="toAmt"]');
		var tolabelObj = objCreateNewFilterPanel
				.down('label[itemId="Tolabel"]');
		if (toobj && tolabelObj) {
			if (objShow) {
				toobj.show();
				tolabelObj.show();
			} else {
				toobj.hide();
				tolabelObj.hide();
			}
		}
	},
	advanceFilterPopUp : function(btn) {
		var me = this;

		var objCreateNewFilterPanel = me.getCreateNewFilter();
		var filterDetailsTab = me.getFilterDetailsTab();
		filterDetailsTab.setTitle(getLabel('createNewFilter',
				'Create New Filter'));

		var saveSearchBtn = me.getSaveSearchBtn();

		if (saveSearchBtn) {
			saveSearchBtn.show();
		}
		objCreateNewFilterPanel.resetAllFields(objCreateNewFilterPanel);
		objCreateNewFilterPanel.enableDisableFields(objCreateNewFilterPanel,
				false);
		objCreateNewFilterPanel.removeReadOnly(objCreateNewFilterPanel, false);

		me.filterCodeValue = null;
		if (!Ext.isEmpty(me.objAdvFilterPopup)) {
			me.objAdvFilterPopup.show();
			var objTabPanel = me.getAdvanceFilterTabPanel();
			objTabPanel.setActiveTab(1);
		} else {
			me.objAdvFilterPopup = Ext
					.create('GCP.view.UserActivityAdvancedFilterPopup');
			var objTabPanel = me.getAdvanceFilterTabPanel();
			objTabPanel.setActiveTab(1);
			me.objAdvFilterPopup.show();

		}
	},
	handleFilterItemClick : function(filterCode, btn) {

		var me = this;
		var objToolbar = me.getAdvFilterActionToolBar();

		objToolbar.items.each(function(item) {
					item.removeCls('xn-custom-heighlight');
				});
		btn.addCls('xn-custom-heighlight');

		if (!Ext.isEmpty(filterCode)) {
			var applyAdvFilter = true;
			this.getSavedFilterData(filterCode, this.populateSavedFilter,
					applyAdvFilter);
		}

		me.savePrefAdvFilterCode = filterCode;
		me.showAdvFilterCode = filterCode;
		me.disablePreferencesButton("savePrefMenuBtn",false);
	},
	populateSavedFilter : function(filterCode, filterData, applyAdvFilter) {
		var me = this;
		var fieldName = '';
		var fieldVal = '';
		var fieldSecondVal = '';
		var currentFilterData = '';
		var fieldType = '';
		var columnId = '';
		var sortByOption = '';
		var buttonText = '';
		var operatorValue = '';
		var objSellerAutoComp = null;
		//addAdvFilterFieldsData();
		for (i = 0; i < filterData.filterBy.length; i++) {
			fieldName = filterData.filterBy[i].field;
			fieldVal = filterData.filterBy[i].value1;
			fieldSecondVal = filterData.filterBy[i].value2;
			currentFilterData = filterData.filterBy[i];
			operatorValue = filterData.filterBy[i].operator;
			
			if(fieldName === 'clientName'){
				if(isClientUser()){
					$("#useradvclient").val(fieldVal);
					selectedUserAdvClient = fieldVal;
					me.clientFilterVal = fieldVal;
				}
				else{
					$("#useradvclientauto").val(fieldSecondVal);
					selectUserAdvClientCode = fieldVal;
					selectUserAdvClientDesc = fieldSecondVal;
				}
			}
			else if(fieldName === 'userCategory'){
				$("#useradvrole").val(fieldVal);
			}
			else if(fieldName === 'userCode'){
				$("#useradvusername").val(decodeURIComponent(fieldSecondVal));
				selectUserAdvUserNameCode = decodeURIComponent(fieldVal);
				selectUserAdvUserNameDesc = decodeURIComponent(fieldSecondVal);
			}
			else if(fieldName === 'loginStatus'){
				$("#useradvstatus").val(fieldVal);
			}
			else if(fieldName === 'bankUserFlag'){
				if(fieldVal == 0)
					$("input[type='checkbox'][id='bankusercheckbox']").prop('checked',true);
			}
			
			else if (fieldName === 'loginTime') {
			me.setSavedFilterDates(fieldName, currentFilterData);
			}
			else if (fieldName === 'logoutTime') {
				me.setSavedFilterDates(fieldName, currentFilterData);
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
			me.applyAdvancedFilter(filterData);
		}
	},
	setSavedFilterDates : function(dateType, data) {
		if (!Ext.isEmpty(dateType) && !Ext.isEmpty(data)) {
			var me = this;
			var dateFilterRefFrom = null;
			var formattedFromDate,fromDate,toDate,formattedToDate;
			var dateOperator = data.operator;
			
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
			
			if (dateType === 'loginTime') {
				selectedLoginDate = {
						operator : dateOperator,
						fromDate : formattedFromDate,
						toDate : formattedToDate
					};
				dateFilterRefFrom = $('#logintime');
				
			} else if (dateType === 'logoutTime') {
				selectedLogoutDate = {
						operator : dateOperator,
						fromDate : formattedFromDate,
						toDate : formattedToDate
					};
				dateFilterRefFrom = $('#logouttime');
			}
			

			if (dateOperator === 'eq') {
					$(dateFilterRefFrom).val(formattedFromDate);
				}
			else if (dateOperator === 'bt') {
						$(dateFilterRefFrom).setDateRangePickerValue([formattedFromDate, formattedToDate]);
					}
		} else {
			// console.log("Error Occured - date filter details found empty");
		}
	},
	handleGroupActions : function() {
		var me = this;
		var strUrl = "killClientUserSession.srvc";
		var objGroupView = me.getGroupView();
		var grid = objGroupView.getGrid();
		if (!Ext.isEmpty(grid)) {
			var arrayJson = new Array();
			var records = grid.getSelectedRecords();
			for (var index = 0; index < records.length; index++) {
				var serialNo = grid.getStore().indexOf(records[index]) + 1;
				arrayJson.push({
							serialNo : grid.getStore().indexOf(records[index])
									+ 1,
							identifier : records[index].data.identifier
						});
			}
			if (arrayJson)
				arrayJson = arrayJson.sort(function(valA, valB) {
							return valA.serialNo - valB.serialNo
						});

			Ext.Ajax.request({
						url : strUrl + '?' + csrfTokenName + '='
								+ csrfTokenValue,
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
										title : getLabel('lblerror', 'Error'),
										msg : getLabel('lblerrordata',
												'Error while fetching data..!'),
										buttons : Ext.MessageBox.OK,
										icon : Ext.MessageBox.ERROR
									});
						}
					});
		}

	},

	handleClearPreferences : function() {
		var me = this;		
		me.preferenceHandler.clearPagePreferences(me.strPageName, null,
					me.postHandleClearPreferences, null, me, true);
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
		postHandleSavePreferences : function(data, args, isSuccess) {
			var me = this;			
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
					var colPrefModuleName = (subGroupInfo.groupCode === 'all') ? (groupInfo.groupTypeCode + subGroupInfo.groupCode) : subGroupInfo.groupCode;
					
					
					if (groupInfo.groupTypeCode && subGroupInfo.groupCode) {
						if (groupInfo.groupTypeCode !== 'USERACTIVITY_OPT_ADVFILTER'
							|| (groupInfo.groupTypeCode == 'USERACTIVITY_OPT_ADVFILTER' && subGroupInfo.groupCode == 'all')) {
							
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
								'gridSetting' : groupView.getGroupViewState().gridSetting,
								'sortState' : gridState.sortState
							}
						});
					
						}
						
					}
				
				}
				objFilterPref = me.saveFilterPreferences();
					arrPref.push({
								"module" : "gridViewFilter",
								"jsonPreferences" : objFilterPref
							});
				return arrPref;
			},
	saveFilterPreferences : function() {
		var me = this;
		//var strUrl = me.urlGridFilterPref;
		var advFilterCode = null;
		var objFilterPref = {},strSqlDateFormat = 'Y-m-d';
		if (!Ext.isEmpty(me.savePrefAdvFilterCode)) {
			advFilterCode = me.savePrefAdvFilterCode;
		}
		var objQuickFilterPref = {};
		objQuickFilterPref.userType = me.typeFilterVal;
		objQuickFilterPref.loginDate = me.dateFilterVal;

		if (me.dateFilterVal === '13') {
			me.dateFilterFromVal = Ext.Date.format(me.datePickerSelectedDate[0],
							strSqlDateFormat);
			me.dateFilterToVal = Ext.Date.format(me.datePickerSelectedDate[1],
							strSqlDateFormat);				
			if (me.datePickerSelectedDate.length == 1) {
				objQuickFilterPref.loginDateFrom = me.dateFilterFromVal;	
			}	
			else if(me.datePickerSelectedDate.length == 2){
				objQuickFilterPref.loginDateFrom = me.dateFilterFromVal;	
				objQuickFilterPref.loginDateTo = me.dateFilterToVal;			
			}
		}

		objFilterPref.advFilterCode = advFilterCode;
		objFilterPref.quickFilter = objQuickFilterPref;
		objFilterPref.clientDesc = me.clientFilterDesc;
		objFilterPref.clientCode = me.clientFilterVal;
		objFilterPref.userName= me.userName;		
		
		return objFilterPref;
						},
	clearWidgetPreferences : function() {
		var me = this, objPref = {}, arrCols = null, objCol = null;
		var strUrl = me.commonPrefUrl + "?$clear=true";
		var grid = me.getUsrActivityGrid();
		var arrColPref = new Array();
		var arrPref = new Array();
		if (!Ext.isEmpty(grid)) {
			arrCols = grid.getView().getGridColumns();
			for (var j = 0; j < arrCols.length; j++) {
				objCol = arrCols[j];
				if (!Ext.isEmpty(objCol) && !Ext.isEmpty(objCol.itemId)
						&& objCol.itemId.startsWith('col_')
						&& !Ext.isEmpty(objCol.xtype)
						&& objCol.xtype !== 'actioncolumn')
					arrColPref.push({
								colId : objCol.dataIndex,
								colDesc : objCol.text,
								colHidden : objCol.hidden
							});

			}
			objWdgtPref = {};
			objWdgtPref.pgSize = grid.pageSize;
			objWdgtPref.gridCols = arrColPref;
			arrPref.push({
						"module" : "",
						"jsonPreferences" : objWdgtPref
					});

		}
		if (arrPref) {
			Ext.Ajax.request({
				url : strUrl,
				method : 'POST',
				success : function(response) {
					var responseData = Ext.decode(response.responseText);
					var isSuccess;
					var title, strMsg, imgIcon;
					if (responseData.d.preferences
							&& responseData.d.preferences.success)
						isSuccess = responseData.d.preferences.success;
					if (isSuccess && isSuccess === 'N') {
						if (!Ext.isEmpty(me.getBtnSavePreferences()))
							me.toggleSavePrefrenceAction(true);
						title = getLabel('SaveFilterPopupTitle', 'Message');
						strMsg = responseData.d.preferences.error.errorMessage;
						imgIcon = Ext.MessageBox.ERROR;
						Ext.MessageBox.show({
									title : title,
									msg : strMsg,
									width : 200,
									buttons : Ext.MessageBox.OK,
									icon : imgIcon
								});

					} else {
						Ext.MessageBox.show({
									title : title,
									msg : getLabel('prefClearedMsg',
											'Preferences Cleared Successfully'),
									buttons : Ext.MessageBox.OK,
									icon : Ext.MessageBox.INFO
								});
					}

				},
				failure : function() {
					var errMsg = "";
					Ext.MessageBox.show({
								title : getLabel('instrumentErrorPopUpTitle',
										'Error'),
								msg : getLabel('instrumentErrorPopUpMsg',
										'Error while fetching data..!'),
								buttons : Ext.MessageBox.OK,
								icon : Ext.MessageBox.ERROR
							});
				}
			});
		}
	},
	closeUserActivityDtlPopup : function(btn) {
		var me = this;
		me.getUserActDtlViewPopupRef().close();
	},
	handleComboPageSizeChange : function(pager, current, oldPageNum) {
		var me = this;
		me.disablePreferencesButton("savePrefMenuBtn",true);
	},

	showViewModuleActivity : function(record) {
		var me = this;
		me.handleModuleActSmartGridConfig(record);
		if (!Ext.isEmpty(me.objModuleActivityPopup)) {
			me.objModuleActivityPopup.show();

		} else {
			me.objModuleActivityPopup = Ext.create(
					'GCP.view.UserActivityDetailViewPopup', {
						user_code : record.get('userCode'),
						user_name : record.get('userName'),
						login_time : record.get('loginTime'),
						logout_time : record.get('logoutTime')
					});
			me.objModuleActivityPopup.show();
		}
	},
	handleModuleActSmartGridConfig : function(record) {
		var me = this;
		var activityDtlGrid = me.getUserActivityModuleGrid();
		var objConfigMap = me.getModuleActivityDtlConfig();
		var arrCols = new Array();
		if (record.get('module') == 'Payments'
				|| record.get('module') == 'Receivers')
			arrCols = me.getModuleActDtlColumns(objConfigMap.arrTxnColsPref,
					objConfigMap.objWidthMap);
		else
			arrCols = me.getModuleActDtlColumns(objConfigMap.arrMasterColsPref,
					objConfigMap.objWidthMap);
		if (!Ext.isEmpty(activityDtlGrid))
			activityDtlGrid.destroy(true);
		me.handleModuleActDtlSmartGridLoad(arrCols, objConfigMap.storeModel,
				record);
	},

	getModuleActivityDtlConfig : function() {
		var me = this;
		var objConfigMap = null;
		var objWidthMap = null;
		var arrMasterColsPref = null;
		var arrTxnColsPref = null;
		var storeModel = null;

		objWidthMap = {
			"screenName" : 150,
			"field1" : 150,
			"field2" : 150,
			"field3" : 150,
			"field4" : 150,
			"actionTaken" : 150,
			"activityDateTime" : 150
		};
		arrMasterColsPref = [{
					"colId" : "screenName",
					"colDesc" : "Screen Name",
					"sortable" : false
				}, {
					"colId" : "field1",
					"colDesc" : "Code"
				}, {
					"colId" : "field2",
					"colDesc" : "Field Name"
				}, {
					"colId" : "field3",
					"colDesc" : "Old Value"
				}, {
					"colId" : "field4",
					"colDesc" : "New Value"
				}, {
					"colId" : "actionTaken",
					"colDesc" : "Action Taken"
				}, {
					"colId" : "activityDateTime",
					"colDesc" : "Date Time"
				}];

		arrTxnColsPref = [{
					"colId" : "screenName",
					"colDesc" : "Screen Name",
					"sortable" : false
				}, {
					"colId" : "field1",
					"colDesc" : "My Product"
				}, {
					"colId" : "field2",
					"colDesc" : "Internal Ref#"
				}, {
					"colId" : "field3",
					"colDesc" : "Amount"
				}, {
					"colId" : "field4",
					"colDesc" : "Count"
				}, {
					"colId" : "actionTaken",
					"colDesc" : "Action Taken"
				},
				{
					"colId" : "activityDateTime",
					"colDesc" : "Date Time"
				}];

		storeModel = {
			fields : ['screenName', 'field1', 'field2', 'field3', 'field4',
					'actionTaken', 'activityDateTime', 'requestStateDesc'],
			proxyUrl : 'userActivityModuleDetail.srvc',
			rootNode : 'd.activitylist',
			totalRowsNode : 'd.__count'
		};

		objConfigMap = {
			"objWidthMap" : objWidthMap,
			"arrMasterColsPref" : arrMasterColsPref,
			"arrTxnColsPref" : arrTxnColsPref,
			"storeModel" : storeModel
		};
		return objConfigMap;
	},

	getModuleActDtlColumns : function(arrColsPref, objWidthMap) {
		var me = this;
		var arrCols = new Array(), objCol = null, cfgCol = null;
		if (!Ext.isEmpty(arrColsPref)) {
			for (var i = 0; i < arrColsPref.length; i++) {
				objCol = arrColsPref[i];
				cfgCol = {};
				cfgCol.colHeader = objCol.colDesc;
				cfgCol.colId = objCol.colId;
				cfgCol.sortable = objCol.sortable;
				cfgCol.width = !Ext.isEmpty(objWidthMap[objCol.colId])
						? objWidthMap[objCol.colId]
						: 120;
				cfgCol.fnColumnRenderer = me.columnRenderer;
				arrCols.push(cfgCol);
			}
		}
		return arrCols;
	},

	handleModuleActDtlSmartGridLoad : function(arrCols, storeModel,
			parentRecord) {
		var me = this;
		var pgSize = null;
		var userActivityModuleGrid = null;
		pgSize = 5;
		var userActivityModulePopupId = me.getUserActivityModulePopupId();
		var userActivityModuleGrid = Ext.getCmp('gridModuleActDtlId');

		if (typeof userActivityModuleGrid == 'undefined') {
			userActivityModuleGrid = Ext.create('Ext.ux.gcp.SmartGrid', {
						id : 'gridModuleActDtlId',
						itemId : 'gridModuleActDtlId',
						pageSize : pgSize,
						autoDestroy : true,
						stateful : false,
						showEmptyRow : false,
						showSummaryRow : true,
						cls : 't7-grid',
						padding : '5 0 0 0',
						showCheckBoxColumn : false,
						rowList : [5, 10, 15, 20, 25, 30],
						minHeight : 140,
						columnModel : arrCols,
						storeModel : storeModel,
						isRowIconVisible : me.isRowIconVisible,
						isRowMoreMenuVisible : false,
						handleRowIconClick : function(tableView, rowIndex,
								columnIndex, btn, event, record) {
							me.handleRowIconClick(tableView, rowIndex,
									columnIndex, btn, event, record);
						},
						listeners : {
							render : function(grid) {
								me.handleModuleActDtlGridData(grid,
										userActivityModuleGrid.pageSize, 1, 1,
										null, parentRecord);
							},
							gridPageChange : function(grid, strUrl, pageSize,
									newPgNo, oldPgNo, sorters) {
								me
										.handleModuleActDtlGridData(grid,
												pageSize, newPgNo, oldPgNo,
												sorters, parentRecord);
							},
							gridSortChange : function(grid, strUrl, pageSize,
									newPgNo, oldPgNo, sorters) {
								me
										.handleModuleActDtlGridData(grid,
												pageSize, newPgNo, oldPgNo,
												sorters, parentRecord);
							},
							pagechange : function(pager, current, oldPageNum) {
								me.handleComboPageSizeChange(pager, current,
										oldPageNum);
							},
							statechange : function(grid) {
								me.disablePreferencesButton("savePrefMenuBtn",true);
							}
						}
					});
			userActivityModuleGrid.view.refresh();
			userActivityModulePopupId.add(userActivityModuleGrid);
			userActivityModulePopupId.doLayout();
		}
	},

	handleModuleActDtlGridData : function(grid, pgSize, newPgNo, oldPgNo,
			sorters, record) {
		var me = this;
		var moduletype = 'M';
		url = 'userActivityModuleDetail.srvc';
		var strUrl = grid.generateUrl(url, pgSize, newPgNo, oldPgNo, sorters);
		if (record.get('module') == 'Payments')
			moduletype = 'P';
		else if (record.get('module') == 'Receivers')
			moduletype = 'C';
		else
			moduletype = 'M';

		var strUrl = strUrl + '&$entryDate=' + record.get('activityDateTime')
				+ '&$moduleType=' + moduletype + '&' + csrfTokenName + '='
				+ csrfTokenValue;
		grid.loadGridData(strUrl, null);
	},
	closeUserActivityModulePopup : function(btn) {
		var me = this;
		me.getUserActModuleViewPopupRef().close();
	},	
	doHandleGridRowSelectionChange : function(groupInfo, subGroupInfo, objGrid,
			objRecord, intRecordIndex, selectedRecords, jsonData) {
		var me = this;
		var buttonMask = '0000000000';
		var maskArray = new Array(), actionMask = '', objData = null;

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
		}
		objGroupView.refreshData();
	},
	findNodeInJsonData : function(arr, paramName, key) { // Find array element which
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
	searchActionClicked : function(me) {
		var me = this, objGroupView = null, savedFilterCombobox = me
				.getFilterView().down('combo[itemId="savedFiltersCombo"]');
		var SaveFilterChkBoxVal=$("input[type='checkbox'][id='saveFilterChkBox']").is(':checked');
		if(SaveFilterChkBoxVal === true){
			me.handleSaveAndSearchAction();
		}
		else{
			me.doSearchOnlyAdvFilter();
		if (savedFilterCombobox)
			savedFilterCombobox.setValue('');
		objGroupView = me.getGroupView();
		objGroupView.setFilterToolTip('');
		$('#advancedFilterPopup').dialog("close");
		}
	},
	doSearchOnlyAdvFilter : function(){
		var me = this;
		me.filterApplied = 'A';
		me.populateQuickFilterFields();
		
		me.applyAdvancedFilter();
	},
	resetAllFields : function(isHandleClearSettings) {
		var me = this;
		$("input[type='checkbox'][id='bankusercheckbox']").prop('checked',
				false);
		
		$("#useradvclient").val("all");
		$("#useradvclientauto").val("");
		me.filterData=[];
		activeFilter = null;
		me.datePickerSelectedDate = [];
		arrQuickJson = [];
		selectedUserAdvClient ='';
		selectedLoginDate = {};
		me.datePickerSelectedLoginAdvDate = [];
		selectedLogoutDate = {};
		me.datePickerSelectedLogoutAdvDate = [];
		//$("#logintime").val("");
		$("#logouttime").val("");
		$("#useradvrole").val("");
		$("#useradvusername").val("");
		var userNameFltId= me.getUserActivityFilterView().down('combo[itemId="userNameFltId"]');
		userNameFltId.setRawValue("");
		selectUserAdvUserNameCode = "";
		selectUserAdvUserNameDesc = "";
		$("#useradvstatus").val("");
		$("input[type='text'][id='savedFilterAs']").val("");
		$("input[type='text'][id='savedFilterAs']").prop('disabled', false);
		
		$('label[for="LogoutDateLabel"]').text(getLabel('logoutDate','Last Logout Date'));
		
		me.getLoginDateLabel().setText('Last Login Date (Latest)');
		//$('#entryDataPicker').val("");
		
		$("#msSavedFilter").val("");
		$("#msSavedFilter").multiselect("refresh");
		$("#saveFilterChkBox").attr('checked', false);
		markAdvFilterNameMandatory('saveFilterChkBox','savedFilterlbl','savedFilterAs', true);
		//$('#logouttime').datepick('option', 'minDate', "01/01/2009");
		if(!isHandleClearSettings)
			me.resetAdvEntryDate();
	},
	resetAdvEntryDate: function(){ 
		var me = this; 
		var objDateParams = me.getDateParam('12'); 
		
		var vFromDate = Ext.util.Format.date(Ext.Date.parse(objDateParams.fieldValue1, 'Y-m-d'), strExtApplicationDateFormat); 
		var vToDate = Ext.util.Format.date(Ext.Date.parse(objDateParams.fieldValue2, 'Y-m-d'), strExtApplicationDateFormat); 
		//$('#logintime').setDateRangePickerValue([vFromDate, vToDate]); 
		$('#logintime').datepick('setDate',[vFromDate,vToDate]);

		selectedLoginDate = { 
				operator : 'bt', 
				fromDate : vFromDate, 
				toDate : vToDate, 
				dateLabel : 'Latest' 
		}; 
		
		$('label[for="LoginDateLabel"]').text(getLabel('logintime', 'Last Login Date') + " (" + selectedLoginDate.dateLabel + ")"); 
		updateToolTip('logintime',  " (" + selectedLoginDate.dateLabel + ")");		 
	},
	saveAndSearchActionClicked : function(me) {
		me.handleSaveAndSearchAction();
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
	
	handleReportAction : function( btn, opts )
	{
		var me = this;
		me.downloadReport( btn.itemId );
	},
	downloadReport : function(actionName) {
		var me = this;

		var withHeaderFlag = document.getElementById("headerCheckbox").checked;
		var arrExtension = {
			downloadXls : 'xls',
			downloadCsv : 'csv',
			loanCenterDownloadPdf : 'pdf',
			downloadTsv : 'tsv',
			downloadBAl2 : 'bai2'
		};
		var currentPage = 1;
		var strExtension = '';
		var strUrl = '';
		var strSelect = '';
		var activeCard = '';
		var viscols;
		var col = null;
		var visColsStr = "";
		var colMap = new Object();
		var colArray = new Array();
		var objGroupView = me.getGroupView();
		var groupInfo = objGroupView.getGroupInfo();
		var subGroupInfo = objGroupView.getSubGroupInfo();

		strExtension = arrExtension[actionName];
		strUrl = 'services/getUserActivityCenterList/getUserActivityCenterDynamicReport.'
				+ strExtension;
		strUrl += '?$skip=1';
		var strQuickFilterUrl = me.getFilterUrl(subGroupInfo, groupInfo);
		strUrl += strQuickFilterUrl;
		strUrl = strUrl + '&' + '$entityType' + '=' + me.entityType;
		var strOrderBy = me.reportGridOrder;
		
		if (!Ext.isEmpty(strOrderBy)) {
			var orderIndex = strOrderBy.indexOf('orderby');
		
			if (orderIndex > 0) {
				strOrderBy = strOrderBy
						.substring(orderIndex, strOrderBy.length);
				var indexOfamp = strOrderBy.indexOf('&$');
				if (indexOfamp > 0)
					strOrderBy = strOrderBy.substring(0, indexOfamp);
				strUrl += '&$' + strOrderBy;				
			}
		}

		var grid = null;
		if (!Ext.isEmpty(objGroupView)) {
			if (!Ext.isEmpty(objGroupView))
				grid = objGroupView.getGrid();
			viscols = grid.getAllVisibleColumns();
			for (var j = 0; j < viscols.length; j++) {
				col = viscols[j];
				if (col.dataIndex && arrDownloadReportColumn[col.dataIndex]) {
					if (colMap[arrDownloadReportColumn[col.dataIndex]]) {
						// ; do nothing
					} else {
						colMap[arrDownloadReportColumn[col.dataIndex]] = 1;
						colArray.push(arrDownloadReportColumn[col.dataIndex]);
					}
				}
			}			
			if (colMap != null) {
				visColsStr = visColsStr + colArray.toString();
				strSelect = '&$select=[' + colArray.toString() + ']';
			}
		}
		strUrl = strUrl + strSelect;
		var objParam = {}, arrMatches, strRegex = /[?&]([^=#]+)=([^&#]*)/g;
		while (arrMatches = strRegex.exec(strUrl)) {
			objParam[arrMatches[1]] = arrMatches[2];
		}
		strUrl = strUrl.substring(0, strUrl.indexOf('?'));

		// var strToken = '&' + csrfTokenName + '=' + csrfTokenValue;
		// strUrl += strToken;
		form = document.createElement('FORM');
		form.name = 'frmMain';
		form.id = 'frmMain';
		form.method = 'POST';

		Object.keys(objParam).map(function(key) {
			form.appendChild(me.createFormField('INPUT', 'HIDDEN', key,
					objParam[key]));
		});
		form.appendChild(me.createFormField('INPUT', 'HIDDEN',
				csrfTokenName, tokenValue));
		form.appendChild(me.createFormField('INPUT', 'HIDDEN', 'txtCurrent',
				currentPage));
		form.appendChild(me.createFormField('INPUT', 'HIDDEN', 'txtCSVFlag',
				withHeaderFlag));
		form.action = strUrl;
		document.body.appendChild(form);
		form.submit();
		document.body.removeChild(form);
	},
	assignSavedFilter: function(){
		var me= this;
		if(me.firstTime){
			me.firstTime = false;
			
			if (objUserActivityFilterPref) {
				var objJsonData = Ext.decode(objUserActivityFilterPref);
				if (!Ext.isEmpty(objJsonData.d.preferences)) {
					if (!Ext.isEmpty(objJsonData.d.preferences.GeneralSetting)) {
						if (!Ext.isEmpty(objJsonData.d.preferences.GeneralSetting.defaultFilterCode)) {
							var advData = objJsonData.d.preferences.GeneralSetting.defaultFilterCode;
							if(advData === me.getUserActivityFilterView().down('combo[itemId="savedFiltersCombo"]').getValue()){
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
		var clientComboBox = me.getUserActivityFilterView().down('combo[itemId="clientCombo"]');
		var clientAdvFilterVal = $('#useradvclient').val();
		if (!Ext.isEmpty(clientAdvFilterVal)) {
			clientComboBox.setValue(clientAdvFilterVal);
		} else if($('#useradvclient').val() == 'all'){
			clientComboBox.setValue('all');
			clientFilterVal = '';
		}
		var userNameFltId= me.getUserActivityFilterView().down('AutoCompleter[itemId="userNameFltId"]');
		var userAdvFilterVal = $('#useradvusername').val();
		if (!Ext.isEmpty(userAdvFilterVal)) {
			userNameFltId.setRawValue(userAdvFilterVal);
		}
		else{
			userNameFltId.setRawValue('');
			$('#useradvusername').val('');
		}
		
		var loginDateLableVal = $('label[for="LoginDateLabel"]').text();
		var loginDateField = $("#logintime");
		me.handleLoginDateSync('A', loginDateLableVal, null, loginDateField);
	}
});
