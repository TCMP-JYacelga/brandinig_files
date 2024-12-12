Ext.define('GCP.controller.UserActivityController', {
	extend : 'Ext.app.Controller',
	requires : ['GCP.view.UserActivityGridView'],
	views : ['GCP.view.UserActivityView',
			'GCP.view.UserActivityAdvancedFilterPopup',
			'GCP.view.UserActivityDetailViewPopup',
			'GCP.view.UserActivityModuleViewPopup'],
	/**
	 * Array of configs to build up references to views on page.
	 */
	refs : [{
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
				ref : 'dateLabel',
				selector : ' userActivityFilterView label[itemId="dateLabel"]'
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
				
				ref : 'userActivitySellerRef',
				selector : 'userActivityFilterView combo[itemId="sellerCode_id"]'
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
			},{
					ref : 'sellerPanel',
					selector : 'userActivityAdvancedFilterPopup[itemId="stdViewAdvancedFilter"] userActivityCreateNewAdvFilter panel[itemId="sellerPanel"]'
				},
				{
					ref : 'corpPanel',
					selector : 'userActivityAdvancedFilterPopup[itemId="stdViewAdvancedFilter"] userActivityCreateNewAdvFilter panel[itemId="corpPanel"]'
				},
				{
					ref : 'clientPanel',
					selector : 'userActivityAdvancedFilterPopup[itemId="stdViewAdvancedFilter"] userActivityCreateNewAdvFilter panel[itemId="clientPanel"]'
				}, {
					ref : 'withHeaderCheckbox',
					selector : 'userActivityView menuitem[itemId="withHeaderId"]'
				},
				{
				ref:'filterView',
				selector:'filterView'	
				},{
				ref:"filterButton",
				selector : "groupView button[itemId=filterButton]"
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
		dateFilterVal : '1',
		dateFilterFromVal : '',
		dateFilterToVal : '',
		dateFilterLabel : getLabel('today', 'Today'),
		filterCodeValue : null,
		savePrefAdvFilterCode : null,
	//	urlGridPref : 'userpreferences/userActivity/gridView.srvc',
	//	urlGridFilterPref : 'userpreferences/userActivity/gridViewFilter.srvc',
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
		userName : null,
		clientCode : null,
		reportGridOrder : null,
		clientDesc : null,
		strPageName : 'userActivity',
		bIsAdvFilterApplied : false
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
		$(document).on('savePreference', function(event) {		
						me.handleSavePreferences();
				});
		$(document).on('clearPreference', function(event) {
						me.handleClearPreferences();
				});
		$(document).on('performReportAction', function(event, actionName) {
					me.downloadReport(actionName);
				});	
		$(document).on('filterDateChange',function(event, filterType, btn, opts) {			
					if (filterType=="entryDateQuickFilter"){
						 me.handleEntryDateChange(filterType,btn,opts);
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
		$(document).on('deleteFilterEvent', function(event, grid, rowIndex) {
			me.deleteFilterSet(grid, rowIndex);
		});
		$(document).on('orderUpEvent',function(event, grid, rowIndex, direction) {
			me.orderUpDown(grid, rowIndex, direction)
		});
		$(document).on('viewFilterEvent', function(event, grid, rowIndex) {
			me.viewFilterData(grid, rowIndex);
		});
		$(document).on('editFilterEvent', function(event, grid, rowIndex) {
			me.editFilterData(grid, rowIndex);
		});
		
		$(document).on("userDatePickPopupSelectedDate",
				function(event, filterType, dates) {
					if (filterType == "logintime") {
						if(dates.length == 1){
							selectedLoginDate = {
									operator :'eq',
									fromDate : Ext.util.Format.date(Ext.Date
											.parse(Ext.Date.format(dates[0],'Y-m-d'), 'Y-m-d'),
											strExtApplicationDateFormat),									
									toDate : Ext.util.Format.date(Ext.Date
											.parse(Ext.Date.format(dates[0],'Y-m-d'), 'Y-m-d'),
											strExtApplicationDateFormat)
								};

						}
						else if(dates.length == 2){
							selectedLoginDate = {
							operator :'bt',
							fromDate : Ext.util.Format.date(Ext.Date
											.parse(Ext.Date.format(dates[0],'Y-m-d'), 'Y-m-d'),
									strExtApplicationDateFormat),
							toDate : Ext.util.Format.date(Ext.Date
											.parse(Ext.Date.format(dates[1],'Y-m-d'), 'Y-m-d'),
									strExtApplicationDateFormat)
							};
						}
					}
					else if(filterType == "logouttime"){
						if(dates.length == 1){
							selectedLogoutDate = {
									operator :'eq',
									fromDate : Ext.util.Format.date(Ext.Date
											.parse(Ext.Date.format(dates[0],'Y-m-d'), 'Y-m-d'),
											strExtApplicationDateFormat),
									toDate : Ext.util.Format.date(Ext.Date
											.parse(Ext.Date.format(dates[0],'Y-m-d'), 'Y-m-d'),
											strExtApplicationDateFormat)
								};

						}
						else if(dates.length == 2){
							selectedLogoutDate = {
							operator :'bt',
							fromDate : Ext.util.Format.date(Ext.Date
											.parse(Ext.Date.format(dates[0],'Y-m-d'), 'Y-m-d'),
									strExtApplicationDateFormat),
							toDate : Ext.util.Format.date(Ext.Date
											.parse(Ext.Date.format(dates[1],'Y-m-d'), 'Y-m-d'),
									strExtApplicationDateFormat)
							};
						}
					}
				});
		
		this.dateHandler = me.getController('GCP.controller.DateHandler');
		var btnClearPref = me.getBtnClearPreferences();
		if (btnClearPref) {
			btnClearPref.setEnabled(false);
		}
		me.updateFilterConfig();
		//me.updateAdvFilterConfig();
		
		/*GCP.getApplication().on(
				{
					reloadUserActivities : function(userCode)
					{
						//var grid = me.getUsrActivityGrid();
						var groupView = me.getGroupView();
						var grid = groupView.getGrid();
						grid.store.dataUrl = "userActivityGridList/"+userCode+".srvc";
						me.handleLoadGridData(grid, grid.store.dataUrl, grid.pageSize, 1,
									1, null);
					},
				});
				*/
		me.control({
			/*'userActivityView' : {
				beforerender : function(panel, opts) {
					// me.loadDetailCount();
				},
				afterrender : function(panel, opts) {

				}
			},
			'userActivityGridView' : {
				render : function(panel) {
					me.handleSmartGridConfig();
				},
				performGroupAction : function(btn, opts) {
					me.handleGroupActions(btn);
				}
			},	


			'userActivityGridView smartgrid' : {
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

			},*/
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
			'userActivityFilterView' : {				
				render : function(panel, opts) {
				
					if (!Ext.isEmpty(modelSelectedMst))
							me.selectedMst = modelSelectedMst;
							var useSettingsButton = me.getFilterView().down('button[itemId="useSettingsbutton"]');
							if (!Ext.isEmpty(useSettingsButton)) {
									useSettingsButton.hide();
							}
							
					me.setInfoTooltip();
					//me.handleUserView(panel);
					me.getAllSavedAdvFilterCode(panel);
				},
				filterType : function(btn, opts) {
					me.disablePreferencesButton("savePrefMenuBtn",false);
					me.handleType(btn);
				},
				/*
				 * filterPaymentAction : function(btn, opts) {
				 * me.toggleSavePrefrenceAction(true);
				 * me.handleProductAction(btn); },
				 */
				dateChange : function(btn, opts) {
					me.dateFilterVal = btn.btnValue;
					me.dateFilterLabel = btn.text;
					me.handleDateChange(btn.btnValue);
					if (btn.btnValue !== '7') {
						me.setDataForFilter();
						me.applyQuickFilter();
						me.disablePreferencesButton("savePrefMenuBtn",false);
						me.disablePreferencesButton("clearPrefMenuBtn",true);
					}

				},
				afterrender : function( panel, opts )
							{
								me.updateFilterFields();
							},
				'handleSavedFilterItemClick' : function(comboValue, comboDesc) {
							objUserActAdvSyncWithQuick = true;
							me.doHandleSavedFilterItemClick(comboValue, comboDesc);
				}
			},
			
			'userActivityFilterView component[itemId="userActivityEntryDataPicker"]' : {
						render : function() {
							$('#entryDataPicker').datepick({
									monthsToShow : 1,
									changeMonth : false,
									rangeSeparator : '  to  ',
									maxDate: dtApplicationDate,
									onClose : function(dates) {
										if (!Ext.isEmpty(dates)) {
											me.datePickerSelectedDate = dates;
											selectedLogoutDate ={};
											me.dateFilterVal = me.dateRangeFilterVal;
											me.dateFilterLabel = getLabel('daterange', 'Date Range');
											me.handleDateChange(me.dateRangeFilterVal);
											me.setDataForFilter();
											me.applyQuickFilter();
											me.disablePreferencesButton("savePrefMenuBtn",false);
										}
									}
						    });
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
					//	me.toggleSavePrefrenceAction(true);
					}
				}
			},
			' userActivityFilterView' : {
				'handleClientChange' : function(client,  clientDesc) {
					me.clientValue=client;	
					me.clientCode = client;
					me.clientDesc = clientDesc;					
					selectUserAdvClientCode = me.clientValue;
					selectUserAdvClientDesc = me.clientDesc;
					if(isClientUser())
						$("#useradvclient").val(selectUserAdvClientCode);
					else
						$("#useradvclientauto").val(selectUserAdvClientDesc);
					me.filterApplied = 'Q';
					me.doSearchOnly();
					me.disablePreferencesButton("savePrefMenuBtn",false);
				},
				'handlebankuser':function(){
					 if(blnBankUser){
		              me.filterApplied = 'Q';
		              	$("input[type='checkbox'][id='bankusercheckbox']").prop('checked',me.getBankUser().getValue());
						me.doSearchOnly();
					 }
				}
			},
			'userActivityFilterView combo[itemId="sellerCode_id"]' :
			{
				render : function( combo, newValue, oldValue )
				{
					var userActivityFilterView = me.getUserActivityFilterView();
					var userNameFltId= userActivityFilterView.down('combo[itemId="userNameFltId"]');
					var clientAutoComFiltr =  userActivityFilterView.down('AutoCompleter[itemId="clientAutoCompleter"]');
					
					if( combo.getValue())
					{
						userNameFltId.cfgExtraParams =
						[
							{
								key : '$filterseller',
								value : combo.getValue()
							}
						];

						clientAutoComFiltr.cfgExtraParams =
						[
							{
								key : '$sellerCode',
								value : combo.getValue()
							}					
						];							
					}
					else
					{
						userNameFltId.cfgExtraParams =
							[
								{
									key : '$filterseller',
									value : null
								}
							];

							clientAutoComFiltr.cfgExtraParams =
							[
								{
									key : '$sellerCode',
									value : 'null'
								}					
							];		
					}
				
				},
				change : function( combo, newValue, oldValue )
				{
					if( combo.getValue() )
					{
						var userActivityFilterView = me.getUserActivityFilterView();
						var userNameFltId= userActivityFilterView.down('combo[itemId="userNameFltId"]');
						userNameFltId.cfgExtraParams =
						[
							{
								key : '$filterseller',
								value : combo.getValue()
							},{
								 key : '$filtercorporation',
								 value : strClientId
							}						
						];
						
						var clientAutoComFiltr =  userActivityFilterView.down('AutoCompleter[itemId="clientAutoCompleter"]');
						clientAutoComFiltr.cfgExtraParams =
						[
							{
								key : '$sellerCode',
								value : combo.getValue()
							}					
						];					
												
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
					selectUserAdvClientCode = combo.value;
					selectUserAdvClientDesc = combo.rawValue;
					if(isClientUser())
						$("#useradvclient").val(selectUserAdvClientCode);
					else
						$("#useradvclientauto").val(selectUserAdvClientDesc);
					me.doSearchOnly();
				}
				/*change : function( combo, record, index )
				{
					me.filterApplied = 'ALL';
					if(Ext.isEmpty(combo.getValue())){
						me.doSearchOnly();
					}
				},*/
				
			},
			'userActivityFilterView AutoCompleter[itemId="userNameFltId"]' : {
				select : function( combo, record, index )
				{
					me.filterApplied = 'Q';
					me.userName = combo.getRawValue();					
					selectUserAdvUserNameCode = combo.getValue();
					selectUserAdvUserNameDesc = combo.getRawValue();
					$("#useradvusername").val(selectUserAdvUserNameDesc);
					me.doSearchOnly();
				},
				'render':function(combo){
							combo.listConfig.width = 200;							
				},				
				change : function( combo, record, index )
				{
					me.userName = combo.getRawValue();
					if(me.userName === ''){
						me.userValue = '';
						selectUserAdvUserNameCode = '';
						selectUserAdvUserNameDesc = '';
						$("#useradvusername").val(selectUserAdvUserNameDesc);
					}
					if(isClientUser()){
							combo.cfgExtraParams=[{
							 key : '$filterseller',
							 value : sessionSellerCode
							},{
							 key : '$filtercorporation',
							 value : sessionCorporation
							}]
						   }
					if(Ext.isEmpty(combo.getValue())){
						me.filterApplied = 'Q';
						me.doSearchOnly();
					}
				}
				
			},
			'userActivityInformation' : {
	//			render : this.onUserActivityInformationViewRender
			},
			'userActivityAdvancedFilterPopup[itemId="stdViewAdvancedFilter"] userActivityCreateNewAdvFilter' : {
				/*handleSearchAction : function(btn) {
					me.handleSearchAction(btn);
				},
				handleSaveAndSearchAction : function(btn) {
					me.handleSaveAndSearchAction(btn);
				},
				closeFilterPopup : function(btn) {
					me.closeFilterPopup(btn);
				},
				handleRangeFieldsShowHide : function(objShow) {
					me.handleRangeFieldsShowHide(objShow);
				},*/
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
			/*'userActivityAdvancedFilterPopup[itemId="stdViewAdvancedFilter"] userActivityAdvFilterGridView' : {
				orderUpEvent : me.orderUpDown,
				deleteFilterEvent : me.deleteFilterSet,
				viewFilterEvent : me.viewFilterData,
				editFilterEvent : me.editFilterData
			},*/
			/*'userActivityView userActivityFilterView button[itemId="newFilter"]' : {
				click : function(btn, opts) {
					me.advanceFilterPopUp(btn);
				}
			},*/
			/*
			 * 'userActivityAdvancedFilterPopup userActivityAdvFilterGridView
			 * grid' : { render : function(grid) {
			 * me.handleAdvFltLoadGridData(grid); } },
			 */
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
						me.disablePreferencesButton("savePrefMenuBtn",false);
						me.disablePreferencesButton("clearPrefMenuBtn",false);		
					me.doHandleGroupTabChange(groupInfo, subGroupInfo,
							tabPanel, newCard, oldCard);
//					me.toggleSavePrefrenceAction(true);
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
					if ((!Ext.isEmpty(objUserActivityFilterPref))) {
						var objJsonData = Ext.decode(objUserActivityFilterPref);
						if (!Ext.isEmpty(objJsonData.d.preferences)) {
							if (!Ext.isEmpty(objJsonData.d.preferences.gridViewFilter)) {
								if (!Ext.isEmpty(objJsonData.d.preferences.gridViewFilter.advFilterCode)) {
									var advData = objJsonData.d.preferences.gridViewFilter.advFilterCode;
									objUserActAdvSyncWithQuick = false;
									me.doHandleSavedFilterItemClick(advData, null);
									me.savedFilterVal = advData;
								}
							}
						}
					}
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
							//me.resetAllFields();
							showUserActivityAdvanceFilterPopup();							
						}
					},
			'filterView button[itemId="clearSettingsButton"]' : {
					'click' : function() {
							me.handleClearSettings();
						}
			}
		});		
	},
	/*handleReportAction : function(btn, opts) {
		var me = this;
		me.downloadReport(btn.itemId);
	},*/
	downloadReport : function(actionName) {
		var me = this;
		//var withHeaderFlag = me.getWithHeaderCheckbox().checked;
		//var withHeaderFlag = document.getElementById("headerCheckbox").checked;
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

		var groupView = me.getGroupView();
		
		var groupInfo = groupView.getGroupInfo();
		var subGroupInfo = groupView.getSubGroupInfo();
		me.setDataForFilter();
		var strfilterUrl = me.getFilterUrl(subGroupInfo, groupInfo);
		
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
				strSelect = '&$select=[' + colArray.toString() +reportExtColumns+ ']';
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
		form.appendChild(me.createFormField('INPUT', 'HIDDEN',
				'$filter', strfilterUrl.substring(9, strfilterUrl.length)));
		//form.appendChild(me.createFormField('INPUT', 'HIDDEN', 'txtCSVFlag',
		//		withHeaderFlag));
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
		me.setDataForFilter();
		me.subGroupInfo=subGroupInfo;
		me.groupInfo=groupInfo;
		var bankUser = 'Y';
		if(!me.bankUserFlag)
		{
		  bankUser = 'N';
		}		
		strUrl = strUrl + me.getFilterUrl(subGroupInfo, groupInfo) +'&$bankUser='+ bankUser + '&' + csrfTokenName + '='
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
				if(!me.bankUserFlag)
				{
					var reqJsonInQuick = me.findInQuickFilterData(quickJsonData,'bankUserFlag');
					if (!Ext.isEmpty(reqJsonInQuick)) {
						arrQuickJson = quickJsonData;
						arrQuickJson = me.removeFromQuickArrJson(arrQuickJson,'bankUserFlag');
						quickJsonData = arrQuickJson;
					}
				}
				arrOfParseQuickFilter = generateFilterArray(quickJsonData);
			}
		}
		
		if (!Ext.isEmpty(me.advFilterData)) {
			if (!Ext.isEmpty(me.advFilterData) && me.advFilterData.length >= 1) {
				var advJsonData = me.advFilterData;
				if(!me.bankUserFlag)
				{
					var reqJson = me.findNodeInJsonData(advJsonData,'field','bankUserFlag');
					if(!Ext.isEmpty(reqJson))
					{
						arrQuickJson = advJsonData;
						arrQuickJson = me.removeFromArrJson(arrQuickJson,'field','bankUserFlag');
						advJsonData = arrQuickJson;
					}
				}
				
				if(me.filterApplied == 'Q'){
					var reqJson = me.findNodeInJsonData(me.filterData,'paramName','clientName');
					if(!Ext.isEmpty(reqJson)){
						arrQuickJson = advJsonData;
						arrQuickJson = me.removeFromArrJson(arrQuickJson,'field','clientName');
						advJsonData = arrQuickJson;
					}
					
					var reqJson = me.findNodeInJsonData(me.filterData,'paramName','userName');
					if(!Ext.isEmpty(reqJson)){
						arrQuickJson = advJsonData;
						arrQuickJson = me.removeFromArrJson(arrQuickJson,'field','userName');
						advJsonData = arrQuickJson;
					}	
				}
				arrOfParseAdvFilter = generateFilterArray(advJsonData);
			}
		}

		if (arrOfParseQuickFilter && arrOfParseAdvFilter) {
			arrOfFilteredApplied = arrOfParseQuickFilter.concat(arrOfParseAdvFilter);

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
	setGridInfoSummary : function(  )
			{
				var me = this;				
				var summaryData;
				
			var strInfoUrl = 'userActivityInfo.srvc?' + csrfTokenName + '='
				+ csrfTokenValue;
				if(me.clientCode == null)
					me.clientCode = "";
				else if(me.clientCode != null && me.clientCode == 'all' )
					me.clientCode = "";
		strInfoUrl=strInfoUrl +"&$filter="+me.clientCode;
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
	doHandleGroupTabChange : function(groupInfo, subGroupInfo, tabPanel,
			newCard, oldCard) {
		var me = this;
		var objGroupView = me.getGroupView();
		var strModule = '', strUrl = null, args = null, strFilterCode = null;
		groupInfo = groupInfo || {};
		subGroupInfo = subGroupInfo || {};
		if (groupInfo) {
			if (groupInfo.groupTypeCode === 'USERACTIVITY_OPT_ADVFILTER') {
				filterUrl = '';
				strFilterCode = subGroupInfo.groupCode;
				if (strFilterCode != 'all') {
					if (!Ext.isEmpty(strFilterCode)) {
						objUserActAdvSyncWithQuick = false;
						me.savedFilterVal = strFilterCode;
						me.showAdvFilterCode = strFilterCode;
						me.doHandleSavedFilterItemClick(strFilterCode);
					}
				} else {
					me.savePrefAdvFilterCode = null;
					me.showAdvFilterCode = null;
					me.filterApplied = 'ALL';
					args = {
						scope : me
					};
					strModule = subGroupInfo.groupCode;
					strUrl = Ext.String.format(me.strGetModulePrefUrl,
							strModule);
					me.getSavedPreferences(strUrl,
							me.postHandleDoHandleGroupTabChange, args);
				}

			} else {
				args = {
					scope : me
				};
				var colPrefModuleName = (subGroupInfo.groupCode === 'all') ? (subGroupInfo.groupCode) : subGroupInfo.groupCode;
				strModule = colPrefModuleName;
				strUrl = Ext.String.format(me.strGetModulePrefUrl, strModule);
				me.getSavedPreferences(strUrl,
						me.postHandleDoHandleGroupTabChange, args);
			}
		}

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
		//me.handleAdvanceFilterCleanUp();
		//objGroupView.reconfigureGrid(null);
		strUrl = Ext.String.format(me.strGetModulePrefUrl, 'USERACTIVITY_OPT_ADVFILTER');				
		args = {
			scope : me
		};
		me.getSavedPreferences(strUrl,
				me.postHandleDoHandleGroupTabChange, args);
	},
	postHandleDoHandleGroupTabChange : function(data, args) {
		var me = args.scope;
		//var me= this;
		var objGroupView = me.getGroupView();
		var objSummaryView = me.getUserActivityView(), objPref = null, gridModel = null, intPgSize = null;
		var colModel = null, arrCols = null;
		var showPager=null,heightOption=null;
		if (data && data.preference) {
			objPref = Ext.decode(data.preference);
			arrCols = objPref.gridCols || null;
			intPgSize = objPref.pgSize || _GridSizeTxn;
			showPager = objPref.gridSetting && !Ext.isEmpty(objPref.gridSetting.showPager)
			? objPref.gridSetting.showPager
			: true;
			heightOption = objPref.gridSetting
					&& !Ext.isEmpty(objPref.gridSetting.heightOption)
					? objPref.gridSetting.heightOption
					: null;		
			colModel = objSummaryView.getColumnModel(arrCols);
			if (colModel) {
				gridModel = {
					columnModel : colModel,
					pageSize : intPgSize,
					showPagerForced : showPager,
					heightOption : heightOption,
					storeModel:{
					  sortState:objPref.sortState
                    }
				}
			}
		}
		objGroupView.reconfigureGrid(gridModel);
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
		var userActivityFilterView = me.getUserActivityFilterView();
		if(isClientUser()){
			var clientComboBox = me.getUserActivityFilterView()
					.down('AutoCompleter[itemId="clientAutoCompleter"]');
			me.clientFilterVal = 'all';
			selectedFilterClientDesc = "";
			selectedFilterClient = "";
			selectedClientDesc = "";
			clientComboBox.setValue(me.clientFilterVal);
		}else{
			var clientComboBox = me.getUserActivityFilterView()
					.down('AutoCompleter[itemId="clientAutoCompleter"]');
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
		selectUserAdvUserNameCode = "";
		selectUserAdvUserNameDesc = "";

		me.savedFilterVal = '';
		var savedFilterComboBox = userActivityFilterView.down('combo[itemId="savedFiltersCombo"]');
		savedFilterComboBox.setValue(me.savedFilterVal);

		var entryDatePicker = me.getUserActivityFilterView()
				.down('component[itemId="entryDataPicker"]');
		me.dateFilterVal = '1';
		me.dateFilterLabel = getLabel('today', 'Today');
		me.handleDateChange(me.dateFilterVal);
		//datePickerRef.val('');
		me.filterApplied = 'Q';
		me.advFilterData = '';
		if (objGroupView)
			objGroupView.toggleFilterIcon(false);
		objGroupView.setFilterToolTip('');
		me.resetAllFields();
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
			.setText(record.get('clientName'));
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
						client_name : record.get('clientName'),
						user_type : record.get('userType')
						
						
					});
			me.objActivityDtlPopup.show();
		}
	},

	handleUsrActSmartGridConfig : function(record) {
		var me = this;
		var activityDtlGrid = me.getUserActivityDtlGenGrid();
		var objConfigMap = me.getActivityDtlConfiguration(record);
		var arrCols = new Array();
		arrCols = me.getActDtlColumns(objConfigMap.arrColsPref,
				null);
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

		/*objWidthMap = {
			"module" : 150,
			"screenName" : 150,
			"actionTaken" : 150,
			"activityDateTime" : 150
		};*/
	/*	arrColsPref = [{
					"colId" : "module",
					"colDesc" : "Module",
					"sortable" : false
				}, {
					"colId" : "screenName",
					"colDesc" : "Screen Name",
					"sortable" : false
				}, {
					"colId" : "actionTaken",
					"colDesc" : "Action Taken",
					"sortable" : false
				}, {
					"colId" : "activityDateTime",
					"colDesc" : "Date Time"
				}, {
					"colId" : "errorCode",
					"colDesc" : "Error Code"
				},{
					"colId" : "errorMessage",
					"colDesc" : "Error Message"
				}];*/
		
		arrColsPref = [/*{
			"colId" : "userName",
			"colDesc" : "User Name"
		},
		{
			"colId" : "userCategory",
			"colDesc" : "User Category"
		},
		{
			"colId" : "clientName",
			"colDesc" : "Client"
		},*/
		
		{
			"colId" : "loginTime",
			"colDesc" : getLabel("lbl.userActivity.grid.lastLoginTime","Last Login Time")
		},
		{
			"colId" : "logoutTime",
			"colDesc" : getLabel("lbl.userActivity.grid.lastLogoutTime","Last Logout Time")
		},{
			"colId" : "status",
			"colDesc" : getLabel("lblstatus","Status")
		},
		{
			"colId" : "remarks",
			"colDesc" : getLabel("lblremark","Remark")
		}/*,
		{
			"colId" : "userType",
			"colDesc" : "User Type"
		}*/];
		
		var userCode = record.data.userId;
		var gridUrl = 'userActivityGridList/'+userCode+'.srvc';

		storeModel={
			fields : ['userCode', 'userName', 'userCategory',
						'corporationName', 'clientName', 'loginTime',
						'logoutTime', 'loginStatus', 'identifier','requestState','validFlag','channel','userType',
						'__metadata', 'sessionId', 'remarks'],
			proxyUrl : gridUrl,
			rootNode : 'd.activitylist',
		    totalRowsNode : 'd.__count'
		}

		objConfigMap = {
			//"objWidthMap" : objWidthMap,
			"arrColsPref" : arrColsPref,
			"storeModel" : storeModel
		};
		return objConfigMap;
	},

	getActDtlColumns : function(arrColsPref, objWidthMap) {
		var me = this;
		var arrCols = new Array(), objCol = null, cfgCol = null;
		//arrCols.push(me.createActDtlActionColumn())
		if (!Ext.isEmpty(arrColsPref)) {
			for (var i = 0; i < arrColsPref.length; i++) {
				objCol = arrColsPref[i];
				cfgCol = {};
				cfgCol.colHeader = objCol.colDesc;
				cfgCol.colId = objCol.colId;
				cfgCol.sortable = objCol.sortable;
				if (!Ext.isEmpty(objCol.colType)) {
					cfgCol.colType = objCol.colType;
					if (cfgCol.colType === "number")
						cfgCol.align = 'right';
				}

				/*cfgCol.width = !Ext.isEmpty(objWidthMap[objCol.colId])
						? objWidthMap[objCol.colId]
						: 120;*/
				//cfgCol.width = 120;
				cfgCol.width = 150;
				cfgCol.fnColumnRenderer = me.gridActDtlColumnRenderer;
				arrCols.push(cfgCol);
			}
		}
		return arrCols;
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
						//showSummaryRow : true,
						padding : '5 0 0 0',
						showCheckBoxColumn : false,
						rowList : [5, 10, 15, 20, 25, 30],
						minHeight : 'auto',
						maxHeight : 350,
						columnModel : arrCols,
						storeModel : storeModel,
						isRowIconVisible : me.isRowIconVisible,
						isRowMoreMenuVisible : false,
						// handleRowMoreMenuClick : me.handleRowMoreMenuClick,
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
		// me.handleActDtlLoadGridData(userActivityDtlGrid,
		// userActivityDtlGrid.pageSize, 1, 1, parentRecord );
	},
	
	gridActDtlColumnRenderer : function(value, meta, record, rowIndex, colIndex, store, view, colId) {
		var strRetValue = value;
		if (colId === 'col_status') {
			if(record.data.loginStatus=='Y') {
				strRetValue="Online";
			} else { 
				strRetValue="Offline";
			}
		}
		/*if(colId === 'col_channel') {
			strRetValue = "Web";
		}*/
		return strRetValue;
	},

	handleActDtlLoadGridData : function(grid,url, pgSize, newPgNo, oldPgNo,
			sorter, record) {
		var me = this;
		var strUrl = grid.generateUrl(url, pgSize, newPgNo, oldPgNo, sorter);
		me.setDataForFilter();
		strUrl = strUrl + me.getFilterUrl(me.subGroupInfo,
		me.groupInfo) + '&' + csrfTokenName + '='
				+ csrfTokenValue;
		grid.loadGridData(strUrl, function() {
			me.getUserActivityView().doLayout();
		});
		
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

	/*searchTrasactionChange : function() {
		var me = this;
		var searchValue = me.getSearchTxnTextInput().value;
		var anyMatch = me.getMatchCriteria().getValue();
		if ('anyMatch' === anyMatch.searchOnPage) {
			anyMatch = false;
		} else {
			anyMatch = true;
		}

		var grid = me.getUsrActivityGrid();
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
	},*/
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
	/*getColumns : function(arrColsPref, objWidthMap) {
		var me = this;
		var arrCols = new Array(), objCol = null, cfgCol = null;
		arrCols.push(me.createActionColumn())
		if (!Ext.isEmpty(arrColsPref)) {
			for (var i = 0; i < arrColsPref.length; i++) {
				objCol = arrColsPref[i];
				cfgCol = {};
				cfgCol.colHeader = objCol.colDesc;
				cfgCol.colId = objCol.colId;
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
	},*/
	/*columnRenderer : function(value, meta, record, rowIndex, colIndex, store,
			view, colId) {
		var strRetValue = value;
		var showIcons = false;
		if(store.dataUrl === 'userActivityGridList.srvc'){
			showIcons = true;
		}
		if (colId === 'col_userCode' && showIcons) {
			var usr = "'"+value+"'";
			strRetValue = '<a href="#" onclick="getUserAllLogins('+usr+');">' + value + '</a>'
		}
		if (colId === 'col_userName' && showIcons) {
			if (record.get('loginStatus') === 'Y')
				strRetValue = '<a class="iconlink online_link">&nbsp;</a>' + ' ' +value  ;
			else
				strRetValue ='<a class="iconlink offline_link">&nbsp;</a>' + ' ' +value  ;;
		}
		if (colId === 'col_status' && showIcons) {
			if(record.data.requestState==3 && record.data.validFlag=='Y')
				strRetValue="Active";
			else if(record.data.requestState==3 && record.data.validFlag=='N')
				strRetValue="Disabled";
		}
		return strRetValue;
	},*/
	/*createActionColumn : function() {
		var me = this;
		var objActionCol = {
			colType : 'actioncontent',
			colId : 'viewAction',
			width : 120,
			align : 'center',
			locked : true,
			items : [{
						itemId : 'btnView',
						text : "View Activity",
						itemLabel : getLabel('lblviewactivity', 'View Activity')
					}]
		};
		return objActionCol;
	},*/
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
							/*
							 * + getLabel('actions', 'Actions') + ' : ' +
							 * chkMgmtActionVal + '<br/>'
							 */
							+ getLabel('advancedFilter', 'Advanced Filter')
							+ ':' + advfilter);
				}
			}
		});
	},
/*	toggleSavePrefrenceAction : function(isVisible) {
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
	},*/
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
		handleDateChange : function(index) {
		var me = this;
		var objDateParams = me.getDateParam(index);
		var datePickerRef=$('#entryDataPicker');
		
		if (!Ext.isEmpty(me.dateFilterLabel)) {
			me.getDateLabel().setText(getLabel('lblloginDate', 'Date') + "(" + me.dateFilterLabel + ")");
		}
		
		var vFromDate = Ext.util.Format.date(Ext.Date.parse(objDateParams.fieldValue1, 'Y-m-d'),strExtApplicationDateFormat);
		var vToDate = Ext.util.Format.date(Ext.Date.parse(objDateParams.fieldValue2, 'Y-m-d'),strExtApplicationDateFormat);
	
		if (index == '13') {
			if (objDateParams.operator == 'eq') {
				datePickerRef.val(vFromDate);
				$('#logintime').val(vFromDate);
				selectedLoginDate = {
						operator : objDateParams.operator,
						fromDate : vFromDate,
						toDate : vToDate
					};			
			} else {
				datePickerRef.val([vFromDate+' to '+vToDate]);
				$('#logintime').val([vFromDate+' to '+ vToDate]);
				selectedLoginDate = {
						operator : objDateParams.operator,
						fromDate : vFromDate,
						toDate : vToDate
					};			
			}
		} else {
				if (index === '1' || index === '2' || index === '12') {
						if (index === '12') {
							datePickerRef.val('Till' + '  ' + vFromDate);
					$('#logintime').val('Till' + '  ' + vFromDate);
					selectedLoginDate = {
						operator : objDateParams.operator,
						fromDate : vFromDate,
						toDate : vToDate
					};	
				}else if(index === '1') {
								datePickerRef.val(vFromDate);
					$('#logintime').val(vFromDate);
					selectedLoginDate = {
						operator : objDateParams.operator,
						fromDate : vFromDate,
						toDate : vToDate
					};	
				}else{
					datePickerRef.val(vFromDate);
					$('#logintime').val(vFromDate);
					selectedLoginDate = {
						operator : objDateParams.operator,
						fromDate : vFromDate,
						toDate : vToDate
					};	
						}	
				} else {
				datePickerRef.val([vFromDate, vToDate]);
				$('#logintime').val([vFromDate, vToDate]);
				selectedLoginDate = {
					operator : objDateParams.operator,
					fromDate : vFromDate,
					toDate : vToDate
				};	
				}
		}	
	},
		updateFilterFields:function(){
				var me=this;
				var clientCodesFltId;
				var userActivityFilterView = me.getUserActivityFilterView();
				if (!isClientUser()) {
					clientCodesFltId = userActivityFilterView.down('combobox[itemId=clientAutoCompleter]');
					if(undefined != me.clientCode && me.clientCode != ''){		
						clientCodesFltId.suspendEvents();
						clientCodesFltId.setValue(me.clientCode);
						clientCodesFltId.resumeEvents();
					}else{
						me.clientCode = 'all';			
					}
					
				} else {
					clientCodesFltId = userActivityFilterView.down('combo[itemId="clientBtn"]');
					if(undefined != me.clientCode && me.clientCode != 'all' && me.clientCode != ""){							
							clientCodesFltId.setRawValue(me.clientDesc);			
					}	
					else{	
						clientCodesFltId.setRawValue(getLabel('allCompanies', 'All Companies'));
						me.clientCode = 'all';
					}
				}
						
			var userNameFltId= userActivityFilterView.down('combo[itemId="userNameFltId"]');
				userNameFltId.setRawValue(me.userName);	

				me.handleDateChange(me.dateFilterVal);
			},
/*	handleDateChange : function(index) {
		var me = this;
		var fromDateLabel = me.getFromDateLabel();
		var toDateLabel = me.getToDateLabel();
		var objDateParams = me.getDateParam(index);

		if (index == '7') {
			me.getDateRangeComponent().show();
			me.getFromDateLabel().hide();
			me.getToDateLabel().hide();
		} else {
			me.getDateRangeComponent().hide();
			me.getFromDateLabel().show();
			me.getToDateLabel().show();
		}

		if (!Ext.isEmpty(me.dateFilterLabel)) {
			me.getDateLabel().setText(getLabel('lblloginDate', 'Date') + "("
							+ me.dateFilterLabel + ")");
		}
		if (index !== '7') {
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
	},*/
	handleEntryDateChange:function(filterType,btn,opts){
				var me=this;
				if(filterType=="entryDateQuickFilter"){
					me.dateFilterVal = btn.btnValue;
					me.dateFilterLabel = btn.text;
				
					
					me.handleDateChange(btn.btnValue);
					me.filterAppiled='Q';
					me.setDataForFilter();
					me.applyQuickFilter();
				}
			},

	getDateParam : function(index) {
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
						fieldValue1 = Ext.Date.format(date, strSqlDateFormat);
						fieldValue2 = fieldValue1;
						operator = 'le';
						break;
			case '13' :				
						// Date Range
							if (me.datePickerSelectedDate.length == 1 || 
								Ext.Date.format(me.datePickerSelectedDate[0],strSqlDateFormat) ==Ext.Date.format(me.datePickerSelectedDate[1],strSqlDateFormat)) {
								fieldValue1 = Ext.Date.format(me.datePickerSelectedDate[0],strSqlDateFormat);
								fieldValue2 = fieldValue1;
								operator = 'eq';
							}else if (me.datePickerSelectedDate.length == 2) {
								fieldValue1 = Ext.Date.format(me.datePickerSelectedDate[0],strSqlDateFormat);
								fieldValue2 = Ext.Date.format(me.datePickerSelectedDate[1], strSqlDateFormat);
									operator = 'bt';
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
		// var strInfoUrl = 'userLogInfo.srvc?' + csrfTokenName + '=' +
		// csrfTokenValue;

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
					/*
					 * params : { csrfTokenName : tokenValue },
					 */
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
		// TODO : Localization to be handled..
		var objDateLbl = {
			'1' : getLabel('today', 'Today'),
			'2' : getLabel('yesterday', 'Yesterday'),
			'3' : getLabel('thisweek', 'This Week'),
			'4' : getLabel('lastweek', 'Last Week'),
			'5' : getLabel('thismonth', 'This Month'),
			'6' : getLabel('lastmonth', 'Last Month'),
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
			me.clientCode = data1.clientCode;
			me.clientDesc = data1.clientDesc;
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
			arrJsn.push({
						paramName : 'loginDate',
						paramValue1 : strVal1,
						paramValue2 : strVal2,
						operatorValue : strOpt,
						dataType : 'D'
					});
				}	
					
		}

		if (!Ext.isEmpty(me.typeFilterVal)
				&& (me.typeFilterVal === 'Y' || me.typeFilterVal === 'N')) {
			arrJsn.push({
						paramName : 'loginStatus',
						paramValue1 : encodeURIComponent(me.typeFilterVal.replace(new RegExp("'", 'g'), "\''")),
						operatorValue : 'eq',
						dataType : 'S'
					});
		} else if (!Ext.isEmpty(me.typeFilterVal) && me.typeFilterVal != 'all') {
			arrJsn.push({
						paramName : 'userName',
						paramValue1 : encodeURIComponent(me.typeFilterVal.replace(new RegExp("'", 'g'), "\''")),
						operatorValue : 'eq',
						dataType : 'S'
					});
		}
		if(me.bankUserFlag){
			arrJsn.push({
						paramName : 'bankUserFlag',
						paramValue1 : 0,
						operatorValue : 'eq',
						dataType : 'S'
					});
		}else{
			arrJsn.push({
						paramName : 'bankUserFlag',
						paramValue1 : 1,
						operatorValue : 'eq',
						dataType : 'S'
					});
		}

		me.filterData = arrJsn;
	},

	getAllSavedAdvFilterCode : function(panel) {
		var me = this;
		Ext.Ajax.request({
					url : 'userfilterslist/userActivityFilter.srvc',
					headers: objHdrCsrfParams,
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
			//			me.addAllSavedFilterCodeToView(arrFilters);

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
								/*
								 * objSavedFilter.fireEvent(
								 * 'handleSavedFilterItemClick', btn.itemId);
								 */

								// me.handleFilterItemClick(btn.itemId);
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
		// Ext.create('GCP.view.PmtAdvancedFilterPopup', {
		// }).show();
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

	setDataForFilter : function(applyAdvFilter) {
		var me = this;
		var arrQuickJson;
		var bankUser=me.getBankUser();
		if(!Ext.isEmpty(bankUser)){
		 me.bankUserFlag=bankUser.getValue();
		}
		me.filterApplied = '';
			me.filterData = me.getQuickFilterQueryJson();
			var objJson = getAdvancedFilterQueryJson();
			//var objJson = (!Ext.isEmpty(me.filterData) ? me.filterData.filterBy : getAdvancedFilterQueryJson());
			if(objUserActAdvSyncWithQuick === true){
			//var isAdminData = $("input[type='checkbox'][id='bankusercheckbox']").is(':checked');
			//if (!Ext.isEmpty(isAdminData) && isAdminData === false ) {
				var reqJson = me.findNodeInJsonData(objJson,'field','bankUserFlag');
				if(!Ext.isEmpty(reqJson)) {
					arrQuickJson = me.filterData;
					arrQuickJson = me.removeFromArrJson(arrQuickJson,'paramName','bankUserFlag');
					me.filterData = arrQuickJson;
					me.updateQuickBankUserFlag(reqJson.value1);
				}else if(me.bIsAdvFilterApplied){
					me.updateQuickBankUserFlag(1);
				}
				//me.updateQuickBankUserFlag(1);
			//}
			
			var reqJson = me.findNodeInJsonData(objJson,'field','clientName');
			if(!Ext.isEmpty(reqJson)) {
				arrQuickJson = me.filterData;
				arrQuickJson = me.removeFromArrJson(arrQuickJson,'paramName','clientName');
				me.filterData = arrQuickJson;
				me.updateQuickClientName(reqJson.value1, reqJson.displayValue1);
			}else if(me.bIsAdvFilterApplied){
				me.updateQuickClientName('', '');
			}
			
			
			var reqJson = me.findNodeInJsonData(objJson,'field','userName');
			if(!Ext.isEmpty(reqJson)) {
				arrQuickJson = me.filterData;
				arrQuickJson = me.removeFromArrJson(arrQuickJson,'paramName','userName');
				me.filterData = arrQuickJson;
				me.updateQuickUserName(reqJson.value1,reqJson.displayValue1);
			}else if(me.bIsAdvFilterApplied){
				me.updateQuickUserName('', '');
			}
			
			
			var reqJson = me.findNodeInJsonData(objJson,'field','loginTime');
			if(!Ext.isEmpty(reqJson)) {
				arrQuickJson = me.filterData;
				arrQuickJson = me.removeFromArrJson(arrQuickJson,'paramName','loginTime');
				me.filterData = arrQuickJson;
				
				if(!Ext.isEmpty(reqJson.value1) && (me.bIsAdvFilterApplied || applyAdvFilter)){
					me.datePickerSelectedDate[0]=Ext.Date.parse(reqJson.value1, 'Y-m-d');
					
					if(!Ext.isEmpty(reqJson.value2) && reqJson.value1 !== reqJson.value2){
						me.datePickerSelectedDate[1]=Ext.Date.parse(reqJson.value2, 'Y-m-d');
			}
					me.dateFilterVal = '13';
					me.dateFilterLabel = getLabel('daterange', 'Date Range');
					me.handleDateChange(me.dateRangeFilterVal);
			}
			}
		}
			this.advFilterData = objJson;
			var filterCode = $("input[type='text'][id='savedFilterAs']").val();
			this.advFilterCodeApplied = filterCode;
	},
	
	updateQuickBankUserFlag : function(value){
		var me = this;
		var quickBankUserChkBox = me.getBankUser();
		blnBankUser = false;
		if(!Ext.isEmpty(value) && value === 0){
			quickBankUserChkBox.setValue(true);
		}else{
			quickBankUserChkBox.setValue(false);
		}
		blnBankUser = true;
		me.bankUserFlag = true;
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
			quickUserNameAutoComp.setValue(value);
		quickUserNameAutoComp.setRawValue(desc);
		
	},
	
	getQuickFilterQueryJson : function() {
		var me = this;
		var typeFilterVal = me.typeFilterVal;
		var jsonArray = [];
		var index = me.dateFilterVal;
		var objDateParams;
		var sellerVal;
		var clientFilterVal = me.clientFilterVal;
		var clientFilterDesc = me.clientFilterDesc;
		var userCodeValue;
		var userCodeDesc;
		
			objDateParams = me.getDateParam(index);
			var objOfCreateNewFilter = me.getUserActivityFilterView();
		if (!Ext.isEmpty(objOfCreateNewFilter)){
						userNameFltId = objOfCreateNewFilter.down('AutoCompleter[itemId=userNameFltId"]');
				if (!Ext.isEmpty(userNameFltId) && !Ext.isEmpty(userNameFltId.getValue())) {
					userCodeValue = userNameFltId.getValue();
				userCodeDesc = userNameFltId.getRawValue();
				$("#useradvusername option[value='"+userCodeValue+"']").attr("selected",true);
				}
				var clientComboBox = objOfCreateNewFilter.down('AutoCompleter[itemId="clientAutoCompleter"]');
				if (!Ext.isEmpty(clientComboBox) && !Ext.isEmpty(clientComboBox.getValue())) {
					clientFilterVal = clientComboBox.getValue();
					clientFilterDesc = clientComboBox.getRawValue();
					$("#useradvclient option[value='"+clientFilterVal+"']").attr("selected",true);
			}
		}
		if (typeFilterVal != null && typeFilterVal === 'all') {
			
		//	var objOfCreateNewFilter = me.getUserActivityView();
			
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
				
				//if (!Ext.isEmpty(userCode) && userCode.isVisible() ) {
					
					if (!Ext.isEmpty(userCodeValue) && userCodeValue !== null && userCodeValue!='all') {
						jsonArray.push({
							paramName : 'userName',
							operatorValue : 'lk',
							paramValue1 : encodeURIComponent(userCodeValue.toUpperCase().replace(new RegExp("'", 'g'), "\''")),
							dataType : 'S',
							displayType : 5,
							paramFieldLable : getLabel('userCode','User Name'),
							displayValue1 : userCodeDesc
						});
					}			
				
			//	}
	//		}			
			if (!Ext.isEmpty(index)) {
				jsonArray.push({					
							paramName : 'loginTime',
							paramValue1 : objDateParams.fieldValue1,
							paramValue2 : objDateParams.fieldValue2,
							operatorValue : objDateParams.operator,
							dataType : 'D',
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
						paramValue1 : encodeURIComponent(typeFilterVal.replace(new RegExp("'", 'g'), "\''")),
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
						displayType : 5,
						paramFieldLable : getLabel('bankUserFlag','Bank User'),
						displayValue1 : "Yes"
					});
		}else{
		jsonArray.push({
						paramName : 'bankUserFlag',
						paramValue1 : 1,
						operatorValue : 'eq',
						dataType : 'S',
				displayType : 5,
				paramFieldLable : getLabel('bankUserFlag','Bank User'),
				displayValue1 : "No"
					});
		}
		
		var sellerFilter = me.getUserActivitySellerRef();
		if (!Ext.isEmpty(sellerFilter) && !Ext.isEmpty(sellerFilter.getValue())) {
			sellerVal = sellerFilter.getValue().toUpperCase();
		}

		jsonArray.push({
					paramName : 'sellerCode',
					paramValue1 : encodeURIComponent(sellerVal.replace(new RegExp("'", 'g'), "\''")),
					operatorValue : 'eq',
					dataType : 'S',
					paramFieldLable : getLabel('lblSeller', 'Financial Institute')
				});
		
		return jsonArray;
		
	},

	/*handleUserView : function(panel) {
		var me = this;
		var strUrl = 'clientUserList.srvc';
		// var strUrl = 'getUserList.srvc';
		Ext.Ajax.request({
					url : strUrl + '?' + csrfTokenName + '=' + csrfTokenValue,
					method : "POST",
					success : function(response) {
						me.loadUserList(Ext.decode(response.responseText));
					},
					failure : function(response) {
						console.log('Error Occured');
					}
				});
	},

	loadUserList : function(data) {
		var me = this;
		var objTbar = me.getUsrActToolBar();
		var arrItem;
		if (!Ext.isEmpty(objTbar)) {
			var tbarItems = objTbar.items;

			// remove the items
			if (!Ext.isEmpty(tbarItems)) {
				if (tbarItems.length > 0)
					tbarItems.each(function(item, index, length) {
								if (index > 0)
									objTbar.remove(item);
							});
			}
			var arrayItems = new Array();
			arrayItems.push({
						text : 'Online',
						btnId : 'online',
						code : 'Y',
						btnDesc : 'Online',
						handler : function(btn, opts) {
							me.handleType(btn);
						}
					});
			arrayItems.push({
						text : 'Offline',
						btnId : 'offline',
						code : 'N',
						btnDesc : 'Offline',
						handler : function(btn, opts) {
							me.handleType(btn);
						}
					});
			objTbar.insert(1, arrayItems);
			if (data.d.activitylist) {
				var activityList = data.d.activitylist;

				if (activityList.length > 0) {
					arrItem = new Array();
					for (var i = 0; i < activityList.length; i++) {
						arrItem.push({
									text : activityList[i].userName,
									btnId : activityList[i].userCode,
									code : activityList[i].userCode,
									btnDesc : activityList[i].userName,
									handler : function(btn, opts) {
										me.handleType(btn);
									}
								});
					}

					var item = Ext.create('Ext.Button', {
								cls : 'xn-custom-arrow-button cursor_pointer w1',
								padding : '0 0 3 0',
								menu : Ext.create('Ext.menu.Menu', {
											items : arrItem
										})
							});
					objTbar.insert(4, item);
				}
			}
		}
	},
*/
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
		/*var me = this;
		me.filterApplied = 'Q';
		 var me = this;
		var objGroupView = me.getGroupView();
		var groupInfo = objGroupView.getGroupInfo();
		me.refreshData();*/
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
		var strQuickFilterUrl = '', strAdvFilterUrl = '', strUrl = '', strActionStatusUrl = '', isFilterApplied = false;
		var strGroupQuery = (subGroupInfo && subGroupInfo.groupQuery) ? subGroupInfo.groupQuery : '';
		if(me.filterApplied === 'ALL') {
			strQuickFilterUrl = me.generateUrlWithQuickFilterParams(this);
			if (!Ext.isEmpty(strQuickFilterUrl)) {
				strUrl = strQuickFilterUrl;
				isFilterApplied = true;
			}
		} else {
				strQuickFilterUrl = me.generateUrlWithQuickFilterParams(this);
				if (!Ext.isEmpty(strQuickFilterUrl)) {
					strUrl += strQuickFilterUrl;
					isFilterApplied = true;
				}
				strAdvFilterUrl = me.generateUrlWithAdvancedFilterParams(isFilterApplied);
				if (!Ext.isEmpty(strAdvFilterUrl)) {
					if(Ext.isEmpty(strUrl))
						strUrl = '&$filter=' ;
					strUrl += strAdvFilterUrl;
					isFilterApplied = true;
				}
				}
		if (!Ext.isEmpty(strGroupQuery)) {
			if (!Ext.isEmpty(strUrl))
				strUrl += ' and ' + strGroupQuery;
			else
				strUrl +=  strGroupQuery;
		}
		return strUrl;
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
	generateUrlWithAdvancedFilterParams : function(blnIsFilterApplied) {
		var thisClass = this;
		// var filterData = thisClass.filterData;
		var filterData = thisClass.advFilterData;
		var isFilterApplied = blnIsFilterApplied;
		var isOrderByApplied = false;
		 var strFilter = '';
		//var strFilter = '';
		var strTemp = '';
		var strFilterParam = '';
		var operator = '';
		var isInCondition = false;

		if (!Ext.isEmpty(filterData)) {
			for (var index = 0; index < filterData.length; index++) {
				isInCondition = false;
				operator = filterData[index].operator;
				if (isFilterApplied
						&& (operator === 'bt' || operator === 'eq'
								|| operator === 'lk' || operator === 'gt' || operator === 'lt'))
					strTemp = strTemp + ' and ';
				switch (operator) {
					case 'bt' :
						isFilterApplied = true;
						if (filterData[index].dataType === 1) {
							strTemp = strTemp + filterData[index].field + ' '
									+ filterData[index].operator + ' '
									+ 'date\'' + filterData[index].value1
									+ '\'' + ' : ' + 'date\''
									+ filterData[index].value2 + '\'';
						} else {
							strTemp = strTemp + filterData[index].field + ' '
									+ filterData[index].operator + ' ' + '\''
									+ filterData[index].value1 + '\'' + ' : '
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
						isInCondition = this.isInCondition(filterData[index]);
						if (isInCondition) {
							var reg = new RegExp(/[\(\)]/g);
							var objValue = filterData[index].value1;
							objValue = objValue.replace(reg, '');
							var objArray = objValue.split(',');
							isFilterApplied = true;
							for (var i = 0; i < objArray.length; i++) {
								strTemp = strTemp + filterData[index].field
										+ ' ' + filterData[index].operator
										+ ' ' + '\'' + objArray[i] + '\'';
								if (i != objArray.length - 1)
									strTemp = strTemp + ' or '
							}
							break;
						}
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
			
		if(strFilter.indexOf("loginTime") !== -1 || strFilter.indexOf("logoutTime") !== -1){
			strFilter = thisClass.combineLoginAndLogoutFilter(strFilter);
		}
		return strFilter;
	},
	combineLoginAndLogoutFilter : function(strFilter){
		var arrFilters = strFilter.split(" and ");
		var retVal = ""; 
		var dateFilter = [], otherFilter = [];
		// creating 2 separate array. 1) for Date filters 2) for rest of other filters
		for(var i = 0; i < arrFilters.length; i++)
		{
			var filter = arrFilters[i];
			filter = filter.replace(/:/g,'and');
			if(!Ext.isEmpty(filter) && filter != "")
			{
				if(filter.indexOf("loginTime") !== -1 || filter.indexOf("logoutTime") !== -1)
				{
					dateFilter.push(filter);
				}
				else
				{
					otherFilter.push(filter);
				}
			}
		}
		// creating filter URL for other filters
		if(otherFilter.length > 0)
		{
			retVal += ' and ';
			for(var i = 0; i < otherFilter.length; i++)
			{
				retVal += otherFilter[i];
				if( i < otherFilter.length -1)
					retVal += ' and ';
			}
		}
		// when both login and logout time has been selected
		// appending date filters
		if(dateFilter.length > 0)
		{
			retVal += ' and ';
			retVal += ' ( ';
			for(var i = 0; i < dateFilter.length; i++)
			{
				retVal += dateFilter[i];
				if( i < dateFilter.length -1)
					retVal += ' or ';
			}
			retVal += ' ) ';
		}
		return retVal;
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
	orderUpDown : function(grid, rowIndex, direction) {
		var record = grid.getStore().getAt(rowIndex);

		var store = grid.getStore();
		if (!record) {
			return;
		}
		var index = rowIndex;

		if (direction < 0) {
			index--;
			if (index < 0) {
				return;
			}
			var beforeRecord = store.getAt(index);
			store.remove(beforeRecord);
			store.remove(record);

			store.insert(index, record);
			store.insert(index + 1, beforeRecord);
		} else {
			if (index >= grid.getStore().getCount() - 1) {
				return;
			}
			var currentRecord = record;
			store.remove(currentRecord);
			var afterRecord = store.getAt(index);
			store.remove(afterRecord);
			store.insert(index, afterRecord);
			store.insert(index + 1, currentRecord);
		}

		this.sendUpdatedOrderJsonToDb(store);
	},
	sendUpdatedOrderJsonToDb : function(store) {
		var me = this;
		var preferenceArray = [];

		store.each(function(rec) {
					var singleFilterSet = rec.raw;
					preferenceArray.push(singleFilterSet);
				});
		var objJson = {};
		var FiterArray = [];
		for (i = 0; i < preferenceArray.length; i++) {
			FiterArray.push(preferenceArray[i].filterName);
		}
		objJson.filters = FiterArray;
		Ext.Ajax.request({
			url : 'services/userpreferences/useractivity/groupViewAdvanceFilter.json',
			method : 'POST',
			jsonData : objJson,
			async : false,
			success : function(response) {
				me.updateSavedFilterComboInQuickFilter();
			},
			failure : function() {
				// console.log("Error Occured - Addition
				// Failed");

			}

		});
	},
	deleteFilterSet : function(grid, rowIndex) {

		var me = this;
		var objGroupView = me.getGroupView();
		var record = grid.getStore().getAt(rowIndex);
		var objFilterName = record.data.filterName;
		grid.getStore().remove(record);

		if (me.savePrefAdvFilterCode == record.data.filterName) {
			me.advFilterData = [];
			me.filterApplied = 'A';
			me.refreshData();
		}

		var store = grid.getStore();
		me.deleteFilterCodeFromDb(objFilterName);
		me.filterCodeValue = null;
		me.sendUpdatedOrderJsonToDb(store);
		store.reload();
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
							// console.log('Bad : Something went wrong with your
							// request');
						}
					});
		}
	},
	sendUpdatedOrederJsonToDb : function(store) {
		var me = this;
		var preferenceArray = [];

		store.each(function(rec) {
					var singleFilterSet = rec.raw;
					preferenceArray.push(singleFilterSet);
				});
		var objJson = {};
		var FiterArray = [];
		for (i = 0; i < preferenceArray.length; i++) {
			FiterArray.push(preferenceArray[i].filterName);
		}
		objJson.filters = FiterArray;
		Ext.Ajax.request({
			url : 'userpreferences/userActivityList/userActivityAdvanceFilter.srvc?'
					+ csrfTokenName + '=' + csrfTokenValue,
			method : 'POST',
			jsonData : objJson,
			async : false,
			success : function(response) {
				me.updateAdvActionToolbar();
			},
			failure : function() {
				console.log("Error Occured - Addition Failed");

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

	populateAndDisableSavedFilter : function(filterCode, filterData,
			applyAdvFilter) {

		var me = this;
		var fieldType = '';
		var objCreateNewFilterPanel = me.getCreateNewFilter();
		for (i = 0; i < filterData.filterBy.length; i++) {
			var fieldName = filterData.filterBy[i].field;
			var fieldVal = filterData.filterBy[i].value1;
			var fieldOper = filterData.filterBy[i].operator;

			/*if (fieldOper != 'eq') {
				objCreateNewFilterPanel.down('combobox[itemId="rangeCombo"]')
						.setValue(fieldOper);
			}*/

			/*
			 * if( fieldName === 'userCode' || fieldName === 'corporationName' ||
			 * fieldName === 'clientName' || fieldName === 'userCategory' ||
			 * fieldName === 'ipAdress' || fieldName === 'loginStatus') { var
			 * fieldType = 'textfield'; }
			 */
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
			
		//var fieldType = 'textfield';
		var fieldObj = objCreateNewFilterPanel.down('' + fieldType
				+ '[itemId="' + fieldName + '"]');
		

		//fieldObj.setValue(fieldVal);
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
	/*handleSearchAction : function(btn) {
		var me = this;
		me.filterApplied = 'A';
		me.doSearchOnly();
	},*/
	postDoSaveAndSearch : function() {
		var me = this;
		me.applyAdvancedFilter();
		me.bIsAdvFilterApplied = false;
	},
	doSearchOnly : function() {
		var me = this;
		//me.filterApplied = 'A';
		me.setDataForFilter();
		//me.applyAdvancedFilter();
		me.applyQuickFilter();
	},
/*	applyAdvancedFilter : function() {
		var me = this;
		me.filterApplied = 'ALL';
		me.setDataForFilter();
		me.applyFilter();
		me.closeFilterPopup();
	},*/
	applyAdvancedFilter : function(filterData) {
		var me = this, objGroupView = me.getGroupView();
		me.filterApplied = 'A';
		me.setDataForFilter(filterData);
		me.refreshData();
	},
	
	handleSaveAndSearchAction : function(btn) {
		var me = this;
		var callBack = me.postDoSaveAndSearch;
		var strFilterCodeVal = null;
		me.filterCodeValue = $("#savedFilterAs").val();
		if (me.filterCodeValue === null) {
			var FilterCode = $("#savedFilterAs").val();
			if (Ext.isEmpty(FilterCode)) {
				paintError('#advancedFilterErrorDiv',
						'#advancedFilterErrorMessage', getLabel(
								'filternameMsg', 'Please Enter Filter Name'));
				return;
			} else {
				hideErrorPanel("advancedFilterErrorDiv");
				me.filterCodeValue = FilterCode;
				strFilterCodeVal = me.filterCodeValue;
			}
		} else {
			strFilterCodeVal = me.filterCodeValue;
		}
		me.savePrefAdvFilterCode = strFilterCodeVal;
		if (Ext.isEmpty(strFilterCodeVal)) {
			paintError('#advancedFilterErrorDiv',
					'#advancedFilterErrorMessage', getLabel('filternameMsg',
							'Please Enter Filter Name'));
			return;
		} else {
			hideErrorPanel("advancedFilterErrorDiv");
			me.postSaveFilterRequest(me.filterCodeValue, callBack);
		}
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
							{// objFilterCode.setValue(filterCode);
							// me.setAdvancedFilterTitle(filterCode);
							$('#advancedFilterPopup').dialog('close');
							fncallBack.call(me);
							userActFilterGrid.getStore().reload();
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
		/*reloadGridRawData : function()
	{
		var me = this;
		var strUrl = 'userfilterslist/userActivityFilter.srvc?';				
		var objGroupView = me.getGroupView();
		var gridView = objGroupView.getGrid();
		Ext.Ajax.request(
		{
			url : strUrl + csrfTokenName + "=" + csrfTokenValue,
			method : 'GET',
			success : function( response )
			{
				var decodedJson = Ext.decode( response.responseText );
				var arrJson = new Array();

				if( !Ext.isEmpty( decodedJson.d.filters ) )
				{
					for( i = 0 ; i < decodedJson.d.filters.length ; i++ )
					{
						arrJson.push(
						{
							"filterName" : decodedJson.d.filters[ i ]
						} );
					}
				}
				gridView.store.loadRawData( arrJson );
				me.addAllSavedFilterCodeToView( decodedJson.d.filters );
			},
			failure : function( response )
			{
				// console.log("Ajax Get data Call Failed");
			}
		} );
	},*/
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
		addAdvFilterFieldsData();
		for (i = 0; i < filterData.filterBy.length; i++) {
			fieldName = filterData.filterBy[i].field;
			fieldVal = filterData.filterBy[i].value1;
			fieldSecondVal = filterData.filterBy[i].value2;
			currentFilterData = filterData.filterBy[i];
			operatorValue = filterData.filterBy[i].operator;
			
			if(fieldName === 'clientName'){
				if(isClientUser())
					$("#useradvclient").val(fieldVal);
				else{
					$("#useradvclientauto").val(fieldSecondVal);
				selectUserAdvClientCode = fieldVal;
				selectUserAdvClientDesc = fieldSecondVal;
				}
			}
			else if(fieldName === 'userCategory'){
				$("#useradvrole").val(fieldVal);
			}
			else if(fieldName === 'userName'){
				$("#useradvusername").val(fieldSecondVal);
				selectUserAdvUserNameCode = fieldVal;
				selectUserAdvUserNameDesc = fieldSecondVal;
			}
			else if(fieldName === 'userCode'){
				$("#useradvusername").val(fieldSecondVal);
				selectUserAdvUserNameDesc = fieldSecondVal;
				selectUserAdvUserNameCode = fieldVal;
			}
			else if(fieldName === 'loginStatus'){
				$("#useradvstatus").val(fieldVal);
			}
			else if(fieldName === 'bankUserFlag'){
				if(fieldVal == 0)
				{
					$("input[type='checkbox'][id='bankusercheckbox']").prop('checked',true);
				}
			}
			else if(fieldName === 'channel'){
				$("#useradvchannel").val(fieldVal);
			}
			
			if (fieldName === 'loginTime') {
			me.setSavedFilterDates(fieldName, currentFilterData);
			}
			if (fieldName === 'logoutTime') {
				me.setSavedFilterDates(fieldName, currentFilterData);
			}
		
			if (!Ext.isEmpty(filterCode)) {
				$('#savedFilterAs').val(filterCode);
			}
		
		}
		if (applyAdvFilter){
			me.filterApplied = 'A';
			me.setDataForFilter(applyAdvFilter);
			me.applyAdvancedFilter(filterData);
		}
	},
	setSavedFilterDates : function(dateType, data) {
		if (!Ext.isEmpty(dateType) && !Ext.isEmpty(data)) {
			var me = this;
			var dateFilterRef = null;
			var dateOperator = data.operator;

			if (dateType === 'loginTime') {
				dateFilterRef = $('#logintime');
			} 
			else if(dateType === 'logoutTime'){
				dateFilterRef = $('#logouttime');
			}
				
			if (dateOperator === 'eq') {
				var fromDate = data.value1;
				if (!Ext.isEmpty(fromDate)) {
					var formattedFromDate = Ext.util.Format.date(Ext.Date
									.parse(fromDate, 'Y-m-d'),
							strExtApplicationDateFormat);
					$(dateFilterRef).val(formattedFromDate);
				}
				if (dateType === 'loginTime') {
					$('#entryDataPicker').val(formattedFromDate);
				selectedLoginDate = {
						operator :'eq',
						fromDate : formattedFromDate,
						toDate : formattedFromDate
					};
				}
				else if(dateType === 'logoutTime'){
					selectedLogoutDate = {
							operator :'eq',
							fromDate : formattedFromDate,
							toDate : formattedFromDate
						};
				}

			} else if (dateOperator === 'bt') {
				var fromDate = data.value1;
				if (!Ext.isEmpty(fromDate)) {
					var formattedFromDate = Ext.util.Format.date(Ext.Date
									.parse(fromDate, 'Y-m-d'),
							strExtApplicationDateFormat);
					var toDate = data.value2;
					if (!Ext.isEmpty(toDate)) {
						var formattedToDate = Ext.util.Format.date(Ext.Date
										.parse(toDate, 'Y-m-d'),
								strExtApplicationDateFormat);
						$(dateFilterRef).val([
								formattedFromDate+' to '+ formattedToDate]);
					}
				}
				if (dateType === 'loginTime') {
					$('#entryDataPicker').val([
								formattedFromDate+' to '+ formattedToDate]);
				selectedLoginDate = {
						operator :'bt',
						fromDate : formattedFromDate,
						toDate : formattedToDate
						};
				}
				else if(dateType === 'logoutTime'){
					selectedLogoutDate = {
							operator :'bt',
							fromDate : formattedFromDate,
							toDate : formattedToDate
						};
				}
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

	/*handleSavePreferences : function() {
		var me = this;
		me.savePreferences();
	},*/
	handleClearPreferences : function() {
		var me = this;		
		me.preferenceHandler.clearPagePreferences(me.strPageName, null,
					me.postHandleClearPreferences, null, me, true);
					me.disablePreferencesButton("savePrefMenuBtn",false);
					me.disablePreferencesButton("clearPrefMenuBtn",true);	
		//me.clearWidgetPreferences();
	},
/*savePreferences : function() {
		var me = this, objPref = {}, arrCols = null, objCol = null;
		var strUrl = me.urlGridPref;
		var groupView = me.getGroupView();
		var grid = groupView.getGrid();
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
								colDesc : objCol.text
							});

			}
			objPref.pgSize = grid.pageSize;
			objPref.gridCols = arrColPref;
			arrPref.push(objPref);
		}

		if (arrPref)
			Ext.Ajax.request({
						url : strUrl + '?' + csrfTokenName + '='
								+ csrfTokenValue,
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
										icon : Ext.MessageBox.ERROR
									});
						}
					});

	},
	*/
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
		objFilterPref.clientDesc = me.clientDesc;
		objFilterPref.clientCode = me.clientCode;
		objFilterPref.userName= me.userName;		
		
		return objFilterPref;
	/*	if (objFilterPref)
			Ext.Ajax.request({
						url : strUrl + '?' + csrfTokenName + '='
								+ csrfTokenValue,
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
										icon : Ext.MessageBox.ERROR
									});
						}
					});*/
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
				// jsonData : Ext.encode(arrPref),
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
			/*
			 * me.objModuleActivityPopup.down('label[itemId=m_usercode]').setText(record.get('userCode'));
			 * me.objModuleActivityPopup.down('label[itemId=m_username]').setText(record.get('userName'));
			 * me.objModuleActivityPopup.down('label[itemId=m_logintime]').setText(record.get('loginTime'));
			 * me.objModuleActivityPopup.down('label[itemId=m_logouttime]').setText(record.get('logoutTime'));
			 */
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
		// if (record.get('structureType') == '1' || record.get('structureType')
		// == '2')
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
				/*
				 * { "colId" : "requestStateDesc", "colDesc" : "Action Taken" },
				 */// Need to add status discription.
				{
					"colId" : "activityDateTime",
					"colDesc" : "Date Time"
				}];

		storeModel = {
			fields : ['screenName', 'field1', 'field2', 'field3', 'field4',
					'actionTaken', 'activityDateTime', 'requestStateDesc'],
			proxyUrl : 'userActivityModuleDetail.srvc',
			// proxyUrl : 'userActivityDtlSummaryList.srvc',
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
						// handleRowMoreMenuClick : me.handleRowMoreMenuClick,
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
		// me.handleModuleActDtlGridData(userActivityModuleGrid,
		// userActivityModuleGrid.pageSize, 1, 1, parentRecord );
	},

	handleModuleActDtlGridData : function(grid, pgSize, newPgNo, oldPgNo,
			sorters, record) {
		var me = this;
		var moduletype = 'M';
		url = 'userActivityModuleDetail.srvc';
		// url = 'userActivityDtlSummaryList.srvc';
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
		// strUrl = strUrl + '&$entryDate=' + record.get('activityDateTime') +
		// '&$activityCode=' + record.get('activityCode') + '&$moduleType=' +
		// record.get('structureType') + '&' + csrfTokenName + '=' +
		// csrfTokenValue;
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
	refreshData : function() {
		var me = this;
		var objGroupView = me.getGroupView();
		var grid = objGroupView.getGrid();
		if (grid) {
			/*if (!Ext.isEmpty(me.advSortByData)) {
				appliedSortByJson = me.getSortByJsonForSmartGrid();
				grid.removeAppliedSort();
				grid.applySort(appliedSortByJson);
			} else {
				grid.removeAppliedSort();
			}*/
		}
		grid.removeAppliedSort();
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
		me.bIsAdvFilterApplied = true;
		var me = this, objGroupView = null, savedFilterCombobox = me
				.getFilterView().down('combo[itemId="savedFiltersCombo"]');
		me.doSearchOnlyAdvFilter();
		if (savedFilterCombobox)
			savedFilterCombobox.setValue('');
		objGroupView = me.getGroupView();
		objGroupView.setFilterToolTip('');
		me.bIsAdvFilterApplied = false;
	},
	doSearchOnlyAdvFilter : function(){
		var me = this;
		me.filterApplied = 'A';
		me.setDataForFilter();
		me.applyAdvancedFilter();
	},
	resetAllFields : function() {
		var me = this;
		$("input[type='checkbox'][id='bankusercheckbox']").prop('checked',	false);
		$("#useradvclient").val("");
		$("#useradvclientauto").val("");
		selectedLoginDate = {};
		selectedLogoutDate = {};
		selectedUserAdvClient = "";
		selectedUserAdvRole = "";
		selectUserAdvUserNameCode = "";
		selectUserAdvClientCode = "";
		selectUserAdvClientDesc = "";
		$("#logintime").val("");
		$("#logouttime").val("");
		$("#useradvrole").val("");
		$("#useradvusername").val("");
		$("#useradvstatus").val("");
	//	$("#useradvchannel").val("");
		$("input[type='text'][id='savedFilterAs']").val("");
		$("input[type='text'][id='savedFilterAs']").prop('disabled', false);
		$('label[for="CreationDateLabel"]').text(getLabel('advDate','Date'));
		me.resetAdvLoginDate();
	},
		
	resetQuickFields : function(){
		var me = this;
		var userActivityFilterView = me.getUserActivityFilterView();
		if(isClientUser()){
			var clientComboBox = me.getUserActivityFilterView()
					.down('AutoCompleter[itemId="clientAutoCompleter"]');
			me.clientFilterVal = 'all';
			selectedFilterClientDesc = "";
			selectedFilterClient = "";
			selectedClientDesc = "";
			clientComboBox.setValue(me.clientFilterVal);
		} else {
			var clientComboBox = me.getUserActivityFilterView()
					.down('AutoCompleter[itemId="clientAutoCompleter"]');
			clientComboBox.reset();
			me.clientFilterVal = '';
			selectedFilterClientDesc = "";
			selectedFilterClient = "";
			selectedClientDesc = "";
		}
		
		me.updateQuickBankUserFlag(1);
		
		var userNameFltId= userActivityFilterView.down('combo[itemId="userNameFltId"]');
		userNameFltId.setValue("");
		selectUserAdvUserNameCode = "";
		selectUserAdvUserNameDesc = "";
	},
	
	resetAdvLoginDate : function(){
		var me = this;
		var objDateParams = me.getDateParam('1');
		var vFromDate = objDateParams.fieldValue1;
		var dateFilterRef = $('#logintime');
		if (!Ext.isEmpty(vFromDate)) {
			var formattedFromDate = Ext.util.Format.date(Ext.Date.parse(vFromDate, 'Y-m-d'), strExtApplicationDateFormat);
			$(dateFilterRef).val(formattedFromDate);
		}
		selectedLoginDate = {
					operator :'eq',
					fromDate : formattedFromDate,
					toDate : formattedFromDate
		};
	},	
	
	saveAndSearchActionClicked : function(me) {
		me.bIsAdvFilterApplied = true;
		me.handleSaveAndSearchAction();
		//me.bIsAdvFilterApplied = false;
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
		else{
			savedFilterCombobox.getStore().reload();
			if (me.filterCodeValue != null) {
				me.savedFilterVal = me.filterCodeValue;
			} else {
				me.savedFilterVal = '';
			}
			savedFilterCombobox.setValue(me.savedFilterVal);
		}
	},
	doHandleSavedFilterItemClick : function(filterCode, filterDesc) {
		var me = this;
		if (!Ext.isEmpty(filterCode)) {
			me.SearchOrSave = true;
			me.advFilterData = {};
			me.datePickerSelectedDate = [];			
			selectedLoginDate={};
			selectedLogoutDate={};
			me.resetAllFields();
			me.getSavedFilterData(filterCode, me.populateSavedFilter, true);
			setTimeout(function() {							
			me.resetQuickFields();
						},50);
		}
		me.savePrefAdvFilterCode = filterCode;
		me.showAdvFilterCode = filterCode;
	},
	handleReportAction : function( btn, opts )
	{
		var me = this;
		me.downloadReport( btn.itemId );
	}
});

/*function getUserAllLogins( userCode )
{
	GCP.getApplication().fireEvent( 'reloadUserActivities', userCode );
}*/
