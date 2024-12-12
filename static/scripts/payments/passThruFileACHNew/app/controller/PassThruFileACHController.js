Ext
	.define(
		'GCP.controller.PassThruFileACHController',
		{
			extend : 'Ext.app.Controller',	
			requires : ['Ext.ux.gcp.DateUtil', 'Ext.ux.gcp.PageSettingPopUp'],
			views :
			[
				'GCP.view.PassThruFileACHView', 'GCP.view.PassThruFileACHFilterView','GCP.view.PassThruGroupView','Ext.ux.gcp.PreferencesHandler'
			],
			/**
			 * Array of configs to build up references to views on page.
			 */
			refs :
			[	{
					ref : 'pageSettingPopUp',
					selector : 'pageSettingPopUp'
				},
				{
					ref : 'groupView',
					selector : 'passThruFileACHViewType groupView'
				},
				{
					ref : 'passThruGroupView',
					selector : 'passThruFileACHViewType passThruGroupView'
				},	
				{
					ref : 'filterView',
					selector : 'filterView'
				}, 				
				{
					ref : 'passThruFileACHViewRef',
					selector : 'passThruFileACHViewType'
				},	
				{
					ref : 'dateLabel',
					selector : 'passThruFileACHFilterViewType label[itemId="dateLabel"]'
				},								
				{
					ref : 'entryDate',
					selector : 'passThruFileACHFilterViewType button[itemId="importDateTime"]'
				},												
				/*{
					ref : 'sellerClientMenuBar',
					selector : 'passThruFileACHViewType passThruFileACHFilterViewType panel[itemId="sellerClientMenuBar"]'
				},*/				
				{
					ref : 'passThruFilterView',
					selector : 'passThruFileACHFilterViewType' 
				}
			],
			config :
			{
				savePrefAdvFilterCode : null,
				filterCodeValue : null,				
				advFilterCodeApplied : null,
				filterData : [],
				advFilterData : [],
				datePickerSelectedDate : [],
				filterApplied : 'ALL',
				commonPrefUrl : 'services/userpreferences/{0}.json',
				urlGridPref : 'userpreferences/{0}/gridView.srvc?',
				urlGridFilterPref : 'userpreferences/{0}/gridViewFilter.srvc?',
				showAdvFilterCode : null,
				statusFilterVal : 'All',
				statusLabelDesc : 'All',
				statusFilterDesc : 'All',
				dateFilterVal : defaultDateIndex,
				dateFilterFromVal : '',
				dateFilterToVal : '',
				dateFilterLabel : getDateIndexLabel(defaultDateIndex),
				dateHandler : null,
				screenTypeFileACH : 'passThruFileACH',
				screenTypePositivePay : 'passThruPositivePay',
				sellerFilterVal : null,
				clientFilterVal : null,
				clientFilterDesc  : null,
				reportGridOrder : null,
				strDefaultMask : '000000',
				savedFilterVal : '',
				strPageName : null,
				objLocalData : null,
				preferenceHandler : null,
				strGetModulePrefUrl : null
			},
			/**
			 * A template method that is called when your application boots. It
			 * is called before the Application's launch function is executed so
			 * gives a hook point to run any code before your Viewport is
			 * created.
			 */
			init : function()
			{
				var me = this;
				var screenName ;
				me.clientFilterVal =$("#summaryClientFilterSpan").val(),
				me.clientFilterDesc = $("#summaryClientFilterSpan").text(),
				me.dateHandler = Ext.create('Ext.ux.gcp.DateUtil');
				if (objSaveLocalStoragePref) {
                    me.objLocalData = Ext.decode(objSaveLocalStoragePref);
                    var filterType = me.objLocalData && me.objLocalData.d.preferences
                            && me.objLocalData.d.preferences.tempPref
                            && me.objLocalData.d.preferences.tempPref.filterAppliedType ? me.objLocalData.d.preferences.tempPref.filterAppliedType
                            : {};
                    me.filterApplied = (!Ext.isEmpty(filterType)) ? filterType : 'ALL';
                }
				var date = new Date(Ext.Date.parse(dtApplicationDate, strExtApplicationDateFormat));
				clientFromDate = me.dateHandler.getDateBeforeDays(date,filterDays);
				$(document).on('performReportAction', function(event, actionName) {
					me.downloadReport(actionName);
				});
				$(document).on('handleClientChangeInQuickFilter',function(isSessionClientFilter) {
					me.handleClientChangeInQuickFilter(isSessionClientFilter);
					//me.disablePreferencesButton("savePrefMenuBtn",false);
					//me.disablePreferencesButton("clearPrefMenuBtn",false);
		        });
				$(document).on('savePreference', function(event) {					
					me.handleSavePreferences();
				});
				$(document).on('clearPreference', function(event) {
					me.handleClearPreferences();
				});
				$(document).on('filterDateChange', function(event,filterType,btn, opts) {
					if(filterType == "importDate")
					{
						me.handleImportDateChangeInAdvaFilter(btn, opts);
					}else if(filterType == "importDateQuickFilter")
					{
					me.handleImportDateChange(btn, opts);						
					}
				});
				$(document).on('searchActionClicked', function() {
					me.searchActionClicked(me);
				});
				$(document).on('saveAndSearchActionClicked', function() {
					me.saveAndSearchActionClicked(me);
				});
				/*$(document).on('deleteFilterEvent', function(event, grid, rowIndex) {
					me.deleteFilterSet(grid, rowIndex);
				});*/
				$(document).on('deleteFilterEvent', function(event, filterCode) {
					me.deleteFilterSet(filterCode);
				});
				$(document).on('orderUpGridEvent',
						function(event, grid, rowIndex, direction) {
							me.orderUpDown(grid, rowIndex, direction)
				});
				$(document).on('viewFilterEvent', function(event, grid, rowIndex) {
					me.viewFilterData(grid, rowIndex);
				});
				$(document).on('editFilterEvent', function(event, grid, rowIndex) {
					me.editFilterData(grid, rowIndex);
				});
				$(document).on('resetAllFieldsEvent', function() {
					me.resetAllFields();
					me.filterCodeValue = null;
				});
				$(document).on('performPageSettings', function(event) {
					me.showPageSettingPopup('PAGE');
				});
				$(document).on('handleSavedFilterClick', function(event) {
					me.handleSavedFilterClick();
				});
				$(document).on('refreshGrid', function(event) {
					me.refreshData();
				});
				$(document).on("datePickPopupSelectedDate",
					function(event, filterType, dates) {
						if (filterType == "importDateAdv") {
							me.dateRangeFilterVal = '13';
							me.datePickerSelectedDate = dates;
							me.dateFilterVal = me.dateRangeFilterVal;
							me.dateFilterLabel = getLabel('daterange', 'Date Range');
							me.handleImportAdvDateChange(me.dateRangeFilterVal);
						}
				});
				
				if(screenType == 'ACH')
				{
					me.screenName = me.screenTypeFileACH ;
				}
				else
				{
					me.screenName = me.screenTypePositivePay ;
				}
				
				this.dateHandler = Ext.create( 'Ext.ux.gcp.DateHandler' );  
				
				me.updateFilterConfig();
				//me.updateAdvFilterConfig();
				me.control(
					{
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
						'passThruFileACHViewType' :
						{
							beforerender : function( panel, opts )
							{
							},
							afterrender : function( panel, opts )
							{
							},
							performReportAction : function( btn, opts )
							{
								me.handleReportAction( btn, opts );
							}
						},
						'passThruGroupView groupView' : {
							'groupByChange' : function(menu, groupInfo) {
								// me.doHandleGroupByChange(menu, groupInfo);
							},
							'groupTabChange' : function(groupInfo, subGroupInfo, tabPanel,
									newCard, oldCard) {
								me.disablePreferencesButton("savePrefMenuBtn",false);
								me.disablePreferencesButton("clearPrefMenuBtn",false);
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
								//me.toggleSavePrefrenceAction(true);
								me.disablePreferencesButton("savePrefMenuBtn",false);
								me.disablePreferencesButton("clearPrefMenuBtn",false);
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
							'gridStoreLoad' : function(grid, store) {
								if(count < 1)
								{
									if(!isRefresh)
									{
										me.refreshGrid(grid, store);
										count++;
									}
								}
								me.disableActions(false);
							},
							afterrender : function() {
								if (objGridViewPref) {
									//me.toggleSavePrefrenceAction(false);
									//me.toggleClearPrefrenceAction(true);
								}
							},
							'render': function(){
								populateAdvancedFilterFieldValue();
								me.firstTime = true;						
									
							},
							'gridSettingClick' : function(){
								me.showPageSettingPopup('GRID');
							}
						},
						'filterView' : {
							afterrender : function(tbar, opts) {
								var passThruFilterView=me.getPassThruFilterView();
								passThruFilterView.down('combo[itemId="savedFiltersCombo"]').setValue(me.savedFilterVal);
								me.handleDateChange(me.dateFilterVal);
								me.applyPreferences();
							},
							beforerender : function() {
								var useSettingsButton = me.getFilterView()
										.down('button[itemId="useSettingsbutton"]');
								if (!Ext.isEmpty(useSettingsButton)) {
									useSettingsButton.hide();
								}
							}
						},
						'filterView' : {
							appliedFilterDelete : function(btn){
								me.resetSavedFilterCombo();
								me.handleAppliedFilterDelete(btn);
							}
						},
						'passThruFileACHFilterViewType combo[itemId="savedFiltersCombo"]' : {
							'afterrender' : function(combo, newValue, oldValue, eOpts) {
								if (!Ext.isEmpty(me.savedFilterVal)) {
									combo.setValue(me.savedFilterVal);
								}
							}
						},
						'filterView menu[itemId="importDateMenu"]' : {
							'click' : function(menu, item, e, eOpts) {
								me.dateFilterVal = item.btnValue;
								me.dateFilterLabel = item.text;
								me.handleDateChange(item.btnValue);
								me.filterAppiled = 'Q';
								me.resetSavedFilterCombo();
								me.setDataForFilter();
								me.applyQuickFilter();							
							}
						},
						'filterView component[itemId="importDateTime"]' : {
							render : function() {
								$('#importDateQuickPicker').datepick({
											monthsToShow : 1,
											changeMonth : true,
											changeYear : true,
											dateFormat : strApplicationDefaultFormat,
											rangeSeparator : '  to  ',											
											onClose : function(dates) {
												if (!Ext.isEmpty(dates)) {
													me.datePickerSelectedDate = dates;
													me.dateFilterVal = '13';
													me.dateFilterLabel = getLabel('daterange', 'Date Range');
													me.handleDateChange(me.dateFilterVal);
													me.resetSavedFilterCombo();
													selectedImportDateInAdvFilter ={};
													me.setDataForFilter();
													me.applyQuickFilter();
													// me.toggleSavePrefrenceAction(true);
												}
											}

										});
							/*if(!Ext.isEmpty(me.savedFilterVal) || me.entryDateChanged === true) {
								var importDateLableVal = $('label[for="dateLabel"]').text();
								var importDateField = $("#importDateTime");
								me.handleImportDateSync('A', importDateLableVal, null, importDateField);
							}*/
								
									me.dateFilterVal = defaultDateIndex; // Set to Latest
									me.dateFilterLabel = getDateIndexLabel(defaultDateIndex);
									me.handleDateChange(me.dateFilterVal);
									me.setDataForFilter();
									me.applyQuickFilter();
								
							}

						},
						'filterView label[itemId="createAdvanceFilterLabel"]' : {
							'click' : function() {
								showAdvanceFilterPopup();
								me.assignSavedFilter();
							}
						},
						'filterView button[itemId="clearSettingsButton"]' : {
							'click' : function() {
								me.handleClearSettings();
							}
						},
						'passThruFileACHFilterViewType' : {
							/*afterrender : function(view){
								var clientContainer = view.down('container[itemId="clientContainer"]');
								var combo = clientContainer.down('combo[itemId="quickFilterClientCombo"]');
								if(combo.getStore().data.length <= 2)
								{
									clientContainer.hide();
								}
							},*/
							handleSavedFilterItemClick : function(comboValue,
									comboDesc) {
								me.savedFilterVal = comboValue;
								me.doHandleSavedFilterItemClick(comboValue);
							//me.disablePreferencesButton("savePrefMenuBtn",false);
							//me.disablePreferencesButton("clearPrefMenuBtn",false);	
							}
							/*handleClientChangeInQuickFilter : function(combo) {
								me.handleClientChangeInQuickFilter(combo);
							}*/
						}/*
						'passThruFileACHFilterViewType  combo[itemId="quickFilterClientCombo"]' : {
							'afterrender' : function(combo, newValue, oldValue, eOpts) {
								if (!Ext.isEmpty(me.clientFilterVal)) {
									combo.setValue(me.clientFilterVal);
								}
							}
						}*/
					} );
			},	
			handleSavedFilterClick : function() {
				var me = this;
				var savedFilterVal = $("#msSavedFilter").val();
				me.resetAllFields();
				me.filterCodeValue = null;
		
				var filterCodeRef = $("input[type='text'][id='filterCode']");
				if (!Ext.isEmpty(filterCodeRef)) {
					filterCodeRef.val(savedFilterVal);
				}
		
				var saveFilterChkBoxRef = $("input[type='checkbox'][id='saveFilterChkBox']");
				if (!Ext.isEmpty(saveFilterChkBoxRef) && !Ext.isEmpty(savedFilterVal))
					saveFilterChkBoxRef.prop('checked', true);
		
				var applyAdvFilter = false;
				me.filterCodeValue = savedFilterVal;
				me.getSavedFilterData(savedFilterVal, this.populateSavedFilter,
						applyAdvFilter);
			},
			
			saveAndSearchActionClicked : function(me) {
				me.savedFilterVal = null;	
				me.handleSaveAndSearchAction();
			},
			handleSaveAndSearchAction : function( btn )			
			{
				var me = this;
				
				var strFilterCodeVal = null;
				var FilterCode = $("#filterCode").val();
				if (Ext.isEmpty(FilterCode)) {
					paintError('#advancedFilterErrorDiv',
					'#advancedFilterErrorMessage', getLabel('filternameMsg',
							'Please Enter Filter Name'));
					return;
				}else {
					hideErrorPanel("advancedFilterErrorDiv");
					me.filterCodeValue = FilterCode;
					strFilterCodeVal = me.filterCodeValue;
				}
				var callBack = me.postDoSaveAndSearch;
				me.savePrefAdvFilterCode = strFilterCodeVal;
				me.savedFilterVal = strFilterCodeVal;
				me.postSaveFilterRequest(me.filterCodeValue, callBack);
				
			},	
		
			postSaveFilterRequest : function( FilterCodeVal, fncallBack )
			{
				var me = this;
				var strUrl = 'userfilters/{0}/{1}.srvc?';
				strUrl = Ext.String.format( strUrl,me.screenName , FilterCodeVal );
				var objJson;
				objJson = getAdvancedFilterValueJson(FilterCodeVal);
				Ext.Ajax.request(
				{
					url : strUrl+ csrfTokenName + "=" + csrfTokenValue,
					method : 'POST',
					jsonData : Ext.encode( objJson ),
					success : function( response )
					{
						var responseData = Ext.decode( response.responseText );
						var isSuccess;
						var title, strMsg, imgIcon;
						if( responseData.d.filters && responseData.d.filters.success )
							isSuccess = responseData.d.filters.success;
						if( isSuccess && isSuccess === 'N' )
						{
							title = getLabel( 'instrumentSaveFilterPopupTitle', 'Message' );
							strMsg = responseData.d.filters.error.errorMessage;
							imgIcon = Ext.MessageBox.ERROR;
							Ext.MessageBox.show(
							{
								title : title,
								msg : strMsg,
								width : 200,
								buttons : Ext.MessageBox.OK,
								icon : imgIcon
							} );

						}

						if( FilterCodeVal && isSuccess && isSuccess === 'Y' )
						{
							$('#advancedFilterPopup').dialog('close');
							fncallBack.call(me);
							//me.reloadFilters(filterGrid.getStore());
							//filterGrid.getStore().reload();
							me.updateSavedFilterComboInQuickFilter();
						}
					},
					failure : function()
					{
						var errMsg = "";
						Ext.MessageBox.show(
						{
							title : getLabel( 'instrumentErrorPopUpTitle', 'Error' ),
							msg : getLabel( 'instrumentErrorPopUpMsg', 'Error while fetching data..!' ),
							buttons : Ext.MessageBox.OK,
							icon : Ext.MessageBox.ERROR
						} );
					}
				} );
			},
			
			/* Page setting handling starts here */
	savePageSetting : function(arrPref, strInvokedFrom) {
		/* This will be get invoked from page level setting always */
		var me = this, args = {};
		
		if(screenType == 'ACH'){
				me.strPageName = me.screenTypeFileACH ;
		}else {
				me.strPageName = me.screenTypePositivePay ;
		}
		
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
		
		if(screenType == 'ACH'){
				me.strPageName = me.screenTypeFileACH ;
		}else {
				me.strPageName = me.screenTypePositivePay ;
		}
		
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
		
		if(screenType == 'ACH'){
				me.strPageName = me.screenTypeFileACH ;
		}else {
				me.strPageName = me.screenTypePositivePay ;
		}
		
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
				me.handleClearSettings();
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
		var objSummaryView = me.getPassThruGroupView();
		var objGroupByVal = '', objDefaultFilterVal = '', objGridSizeVal = '', objRowPerPageVal = _GridSizeTxn, strTitle = null, subGroupInfo;

		me.pageSettingPopup = null;

		if (!Ext.isEmpty(objPassThruPref)) {
			objPrefData = Ext.decode(objPassThruPref);
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
					
			if(screenType == 'ACH')
			{								
				objColumnSetting = objPrefData && objPrefData.d.preferences
					&& objPrefData.d.preferences.ColumnSetting
					&& objPrefData.d.preferences.ColumnSetting.gridCols
					? objPrefData.d.preferences.ColumnSetting.gridCols
					: (objSummaryView.getDefaultColumnModel(me.screenTypeFileACH) || '[]');
			}
			else{
				objColumnSetting = objPrefData && objPrefData.d.preferences
						&& objPrefData.d.preferences.ColumnSetting
						&& objPrefData.d.preferences.ColumnSetting.gridCols
						? objPrefData.d.preferences.ColumnSetting.gridCols
						: (objSummaryView.getDefaultColumnModel(me.screenTypePositivePay) || '[]');
			}

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
		if(screenType == 'ACH'){
			objData["filterUrl"] = 'services/userfilterslist/'+ me.screenTypeFileACH;
		}else{
			objData["filterUrl"] = 'services/userfilterslist/' + me.screenTypePositivePay;
		}
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
	/* Page setting handling ends here */
			
			postDoSaveAndSearch : function()
			{
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
			
			
			searchActionClicked : function(me) {
				var me = this, objGroupView = null, savedFilterCombobox = me
				.getFilterView().down('combo[itemId="savedFiltersCombo"]');
				
				var SaveFilterChkBoxVal = $("input[type='checkbox'][id='saveFilterChkBox']")
				.is(':checked');
				
				if (SaveFilterChkBoxVal === true) {
					me.handleSaveAndSearchAction();
				} else {
					me.doSearchOnly();
					/*if (savedFilterCombobox)
						savedFilterCombobox.setValue('');*/
					objGroupView = me.getGroupView();
					objGroupView.setFilterToolTip('');
					$('#advancedFilterPopup').dialog('close');
				}
				
				/*var filterCode = $('#filterCode').val();
				me.savedFilterVal = filterCode;
				me.doAdvSearchOnly();
				me.updateSavedFilterComboInQuickFilter();*/
			},
			
			doSearchOnly : function()
			{
				var me = this;
				
				var savedFilterValue = $("#msSavedFilter").val();
				var savedFilterCombobox = me.getFilterView().down('combo[itemId="savedFiltersCombo"]');
				if(!Ext.isEmpty(savedFilterValue)) {					
					if (!Ext.isEmpty(savedFilterCombobox)) {
						//savedFilterCombobox.getStore().reload();						
						savedFilterCombobox.setValue(savedFilterValue);					
					}
				}else{
					savedFilterCombobox.setValue('');
				}
				me.applyAdvancedFilter();				
			},
						
			applyAdvancedFilter : function(filterData)
			{
				var me = this, objGroupView = me.getGroupView();
				me.filterApplied = 'A';
				me.setDataForFilter(filterData);
				//me.resetAllFields();
				me.refreshData();
				if (objGroupView)
				{
					objGroupView.toggleFilterIcon(true);
					objGroupView.setFilterToolTip(me.showAdvFilterCode || '');
				}
			},
			
			handleAfterGridDataLoad : function( grid, jsonData )
			{
				var me = grid.ownerCt.ownerCt;
				me.setLoading( false );
			},			
			setDataForFilter : function(filterData)
			{
				var me = this;	
				var arrQuickJson = {};
				me.advFilterData = {};
				me.filterData = me.getQuickFilterQueryJson();
				var objJson = (!Ext.isEmpty(filterData) ? filterData.filterBy : getAdvancedFilterQueryJson());
				var reqJson = me.findInAdvFilterData(objJson, "importDateTime");
				if(!Ext.isEmpty(reqJson)) {
					arrQuickJson = me.filterData;
					arrQuickJson = me.removeFromQuickArrJson(arrQuickJson, "importDateTime");
					me.filterData = arrQuickJson;
					me.updateQuickFilterDate(reqJson);
				}
				reqJson = me.findInAdvFilterData(objJson, "clientId");
                if (!Ext.isEmpty(reqJson)) {
                    arrQuickJson = me.filterData;
                    arrQuickJson = me.removeFromQuickArrJson(arrQuickJson, "clientId");
                    me.filterData = arrQuickJson;
                }
				me.advFilterData = objJson;
				var filterCode = $("input[type='text'][id='filterCode']").val();
				if(!Ext.isEmpty(filterCode)){
					me.advFilterCodeApplied = filterCode;
				}
			},
			updateQuickFilterDate : function(jsonDate){
				var me = this;
				var datePickerRef = $('#importDateQuickPicker');
				me.getDateLabel().setText(jsonDate.fieldLabel + '(' + jsonDate.dropdownLabel+')');
				/*var vFromDate = Ext.util.Format.date(Ext.Date.parse(
								jsonDate.value1, 'Y-m-d'),
						strExtApplicationDateFormat);
				var vToDate = Ext.util.Format.date(Ext.Date.parse(
								jsonDate.value2, 'Y-m-d'),
						strExtApplicationDateFormat);*/
				var vFromDate = Ext.Date.parse(jsonDate.value1, 'Y-m-d');
				var vToDate = Ext.Date.parse(jsonDate.value2, 'Y-m-d');
				if (jsonDate.operator == 'eq') {
					datePickerRef.setDateRangePickerValue(vFromDate);
				} else {
					datePickerRef.setDateRangePickerValue([vFromDate, vToDate]);
				}
			},
			handleAppliedFilterDelete : function(btn){
				var me = this;
				var objData = btn.data;
				var advJsonData = me.advFilterData;
				var quickJsonData = me.filterData;
				if(!Ext.isEmpty(objData)){
					var paramName = objData.paramName || objData.field;
					var reqJsonInAdv = null ,reqJsonInQuick = null;;
					var arrAdvJson =null ,arrQuickJson =null;;
					//adv
					vreqJsonInAdv = me.findInAdvFilterData(advJsonData,paramName);
					if (!Ext.isEmpty(reqJsonInAdv)) {
						arrAdvJson = advJsonData;
						arrAdvJson = me
								.removeFromAdvanceArrJson(arrAdvJson,paramName);
						me.advFilterData = arrAdvJson;
					}
					// quick
					else {
						reqJsonInQuick = me.findInQuickFilterData(quickJsonData,paramName);
						if (!Ext.isEmpty(reqJsonInQuick)) {
							arrQuickJson = quickJsonData;
							arrQuickJson = me.removeFromQuickArrJson(arrQuickJson,paramName);
							me.filterData = arrQuickJson;
						}
					}
					me.resetFieldInAdvAndQuickOnDelete(objData);
					me.refreshData();
				}
			},
			getQuickFilterQueryJson : function()
			{
				var me = this;
				var jsonArray = [];
				var index = me.dateFilterVal;
				//var statusFilterVal = me.statusFilterVal;
				var objDateParams = me.getDateParam( index );
				if(!Ext.isEmpty(index))
				{
					jsonArray.push(
					{
						paramName : 'importDateTime',
						paramIsMandatory : true,
						paramValue1 : objDateParams.fieldValue1,
						paramValue2 : objDateParams.fieldValue2,
						operatorValue : objDateParams.operator,
						dataType : 'D',
						paramFieldLable : getLabel('importDate', 'Import Date'),
						//displayType : 5,
						displayValue1 : objDateParams.fieldValue2
					} );
				}
				/*if( me.statusFilterVal != null && me.statusFilterVal != 'All' )
				{
					jsonArray.push(
					{
						paramName : me.getTaskStatusItemId().filterParamName,
						paramValue1 : me.statusFilterVal,
						operatorValue : 'eq',
						dataType : 'S'
					} );
				}*/
				/*var filterView = me.getPassThruFilterView();
				var clientCode = filterView.clientCode;
				if (!Ext.isEmpty(clientCode) && clientCode !== null && clientCode!='all') {
					jsonArray.push({
						paramName : 'clientCode',
						operatorValue : 'eq',
						paramValue1 : clientCode,
						dataType : 'S'
					});
				}*/
				if (!Ext.isEmpty(me.clientFilterVal) && me.clientFilterVal != 'all') {
					jsonArray.push({
						paramName : 'clientCode',
						operatorValue : 'eq',
						paramValue1 : encodeURIComponent(me.clientFilterVal.replace(new RegExp("'", 'g'), "\''")),
						dataType : 'S',
						paramFieldLable :getLabel('lblcompany', 'Company Name'),
						displayType : 5,
						displayValue1 : me.clientFilterDesc
					});
				}
				else
				{
					var objOfCreateNewFilter = me.getPassThruFileACHViewRef();
					if (!Ext.isEmpty(objOfCreateNewFilter)) {
						var clientCode = objOfCreateNewFilter.down('AutoCompleter[itemId="clientAutoCompleter"]');
						if (!Ext.isEmpty(clientCode) && clientCode.isVisible() ) {
							var clientCodeValue = objOfCreateNewFilter.down('AutoCompleter[itemId="clientAutoCompleter"]').getValue();
							if (!Ext.isEmpty(clientCodeValue) && clientCodeValue !== null && clientCodeValue!='all') {
								jsonArray.push({
									paramName : 'clientCode',
									operatorValue : 'eq',
									paramValue1 : encodeURIComponent(clientCodeValue.replace(new RegExp("'", 'g'), "\''")),
									dataType : 'S',
									paramFieldLable : getLabel("client", "Company Name"),
									displayType : 5,
									displayValue1 : clientCodeValue
								});
							}
						}
					}
				
				}
				return jsonArray;
			},
			applyQuickFilter : function()
			{
				var me = this;				
				me.filterApplied = 'Q';
				me.refreshData();
				//var groupView = me.getGroupView();
				//groupView.refreshData();
			},
			postReadPanelPrefrences : function (data, args, isSuccess) {
				var me = this;
				if(!Ext.isEmpty(data))
				objGridViewPref = data.preference;
			},			
			doHandleRowActions : function(actionName, grid, record) {
				var me = this;				
				if( actionName === 'submit' || actionName === 'reject' || actionName === 'accept')
					me.doHandleGroupActions(actionName, grid, [record], 'rowAction');					
				else if( actionName === 'btnHistory' )
				{
					var recHistory = record.get( 'history' );
					if( !Ext.isEmpty( recHistory ) && !Ext.isEmpty( recHistory.__deferred.uri ) )
					{
						me.showHistory( record.get( 'fileName' ), record.get( 'history' ).__deferred.uri,record.get("identifier") );
					}
				}
				else if( actionName === 'btnViewError' )
				{
					//me.showErrorReport(record);
					//var strUrl = 'getList/{0}/errorReport.srvc?';
					//strUrl = Ext.String.format( strUrl,me.screenName);
					//showErrorReportPopUp(record,strUrl);
					
					me.showErrorReportPdf(record);
				}
				else if( actionName === 'btnView' )
				{
					var strUrl = '';
					if(screenType == 'ACH')
					{
						strUrl = 'passThruFileACHBatch.srvc' ;
					}
					else
					{
						strUrl = 'passThruPositivePayBatch.srvc' ;
					}
					me.submitForm(strUrl,record);
				}
				else if( actionName === 'btnViewOk' )
				{
					me.showDetailReportPdf(record);
				}				
			},
			submitForm : function( strUrl, record)
			{
				var me = this;
				var srNo = record.get('srNo');
				var fileId = record.get('fileId');
				var form = null;
				form = document.createElement( 'FORM' );
				form.name = 'frmMain';
				form.id = 'frmMain';
				form.method = 'POST';
				form.appendChild( me.createFormField( 'INPUT', 'HIDDEN', csrfTokenName, csrfTokenValue ) );
				form.appendChild( me.createFormField( 'INPUT', 'HIDDEN', 'srNo', srNo ) );
				form.appendChild( me.createFormField( 'INPUT', 'HIDDEN', 'fileId', fileId ) );
				form.action = strUrl;
				document.body.appendChild( form );
				form.submit();
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
			showHistory : function( fileName, url,id )
			{
			var historyPopup =	Ext.create( 'GCP.view.PassThruFileACHHistoryPopup',
				{
					//historyUrl : url+'?'+ csrfTokenName + "=" + csrfTokenValue,
					historyUrl : url,
					fileName : fileName,
					identifier : id
				} ).show();
				Ext.getCmp('btnAchPassThruHistoryPopupClose').focus();
				historyPopup.center();
			},
			/*showErrorReport : function( record)
			{
				var me = this ;
				var strUrl = 'getList/{0}/errorReport.srvc?';
				strUrl = Ext.String.format( strUrl,me.screenName);
				Ext.create( 'GCP.view.PassThruFileACHErrorPopUp',
				{
					record : record,
					url:strUrl + csrfTokenName + "=" + csrfTokenValue,
					identifier : record.get("identifier"),
					fileId:record.get("executionId")
				} ).show();
			},*/
			showErrorReportPdf : function(record)
			{
				var me = this;
				var strUrl = null;
				if(screenType == 'ACH')
				{
					strUrl = 'services/getList/passThruFileACH/getPassThruFileErrorReport.pdf';
				}
				else
				{
					strUrl = 'services/getList/passThruFilePositivePay/getPassThruFileErrorReport' ;
				}				
				var form = document.createElement( 'FORM' );
				form.name = 'frmMain';
				form.id = 'frmMain';
				form.method = 'POST';
				form.appendChild( me.createFormField( 'INPUT', 'HIDDEN', csrfTokenName, tokenValue ) );
				form.appendChild( me.createFormField( 'INPUT', 'HIDDEN', 'executionId', record.get("executionId") ) );
				form.appendChild( me.createFormField( 'INPUT', 'HIDDEN', 'client', record.get("clientId") ) );
				form.action = strUrl;
				document.body.appendChild( form );
				form.submit();
				document.body.removeChild( form );
			},
			showDetailReportPdf : function(record)
			{
				var me = this;
				var strUrl = 'services/getList/passThruFileACH/getPassThruFileErrorReport.pdf'
				var form = document.createElement( 'FORM' );
				form.name = 'frmMain';
				form.id = 'frmMain';
				form.method = 'POST';
				form.appendChild( me.createFormField( 'INPUT', 'HIDDEN', csrfTokenName, tokenValue ) );
				form.appendChild( me.createFormField( 'INPUT', 'HIDDEN', 'executionId', record.get("executionId") ) );
				form.appendChild( me.createFormField( 'INPUT', 'HIDDEN', 'client', record.get("clientId") ) );
				form.appendChild( me.createFormField( 'INPUT', 'HIDDEN', 'reportType', 'detail' ) );
				form.action = strUrl;
				document.body.appendChild( form );
				form.submit();
				document.body.removeChild( form );
			},		
			doHandleLoadGridData : function(groupInfo, subGroupInfo, grid, url, pgSize,
					newPgNo, oldPgNo, sorter, filterData) {
				var me = this;
				var groupView = me.getGroupView();
				groupView.toggleLoadingIndicator(false);
				var arrOfParseQuickFilter = [], arrOfParseAdvFilter = [], arrOfFilteredApplied = [];
				var strUrl = grid.generateUrl( url, pgSize, newPgNo, oldPgNo, sorter );
				me.reportGridOrder = strUrl;
				me.disableActions(true);
				//saving local prefrences
		        if(allowLocalPreference === 'Y')
		            me.handleSaveLocalStorage();
				if (!Ext.isEmpty(me.filterData)) {
						if (!Ext.isEmpty(me.filterData) && me.filterData.length >= 1) {
							var quickJsonData = me.filterData;
							var reqJsonInQuick = me.findInQuickFilterData(quickJsonData,'Seller');
							if (!Ext.isEmpty(reqJsonInQuick)) {
								var arrQuickJson = quickJsonData;
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
				strUrl = strUrl + me.getFilterUrl(subGroupInfo, groupInfo) + "&" + csrfTokenName + "=" + csrfTokenValue;
				grid.loadGridData( strUrl, null );
			},
			getFilterUrl : function(subGroupInfo, groupInfo)
			{
				var me = this;
				var strQuickFilterUrl = '', strAdvFilterUrl = '', strUrl = '', isFilterApplied = 'false';

				var strGroupQuery = (subGroupInfo && subGroupInfo.groupQuery)
						? subGroupInfo.groupQuery
						: '';
				
				if( me.filterApplied === 'ALL')
				{
					strQuickFilterUrl = me.generateUrlWithQuickFilterParams( me );
					if( !Ext.isEmpty( strQuickFilterUrl ) )
					{
						strUrl += '&$filter=' + strQuickFilterUrl;
						isFilterApplied = true;
					}
					
				}
				else
				{
					strQuickFilterUrl = me.generateUrlWithQuickFilterParams(me);
					if (!Ext.isEmpty(strQuickFilterUrl)) {
						strUrl += '&$filter=' + strQuickFilterUrl;
						isFilterApplied = true;
					}
					strAdvFilterUrl = me.generateUrlWithAdvancedFilterParams( me );
					if( !Ext.isEmpty( strAdvFilterUrl ) )
					{
						if( strUrl == '' )
							strUrl += '&$filter=' + strAdvFilterUrl;
						else
							strUrl += ' and ' + strAdvFilterUrl;
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
			generateUrlWithQuickFilterParams : function( thisClass )
			{
				var filterData = thisClass.filterData;
				var isFilterApplied = false;
				var strFilter = '&$filter=';
				var strTemp = '';
				var strFilterParam = '';

				for( var index = 0 ; index < filterData.length ; index++ )
				{
					if( isFilterApplied )
						strTemp = strTemp + ' and ';
					switch( filterData[ index ].operatorValue )
					{
						case 'bt':
							if( filterData[ index ].dataType === 'D' )
							{
								strTemp = strTemp + filterData[ index ].paramName + ' '
									+ filterData[ index ].operatorValue + ' ' + 'date\''
									+ filterData[ index ].paramValue1 + '\'' + ' and ' + 'date\''
									+ filterData[ index ].paramValue2 + '\'';
							}
							else
							{
								strTemp = strTemp + filterData[ index ].paramName + ' '
									+ filterData[ index ].operatorValue + ' ' + '\'' + filterData[ index ].paramValue1
									+ '\'' + ' and ' + '\'' + filterData[ index ].paramValue2 + '\'';
							}
							break;
						default:
							// Default opertator is eq
							if( filterData[ index ].dataType === 'D' )
							{
								strTemp = strTemp + filterData[ index ].paramName + ' '
									+ filterData[ index ].operatorValue + ' ' + 'date\''
									+ filterData[ index ].paramValue1 + '\'';
							}
							else
							{
								strTemp = strTemp + filterData[ index ].paramName + ' '
									+ filterData[ index ].operatorValue + ' ' + '\'' + filterData[ index ].paramValue1
									+ '\'';
							}
							break;
					}
					isFilterApplied = true;
				}
				if( isFilterApplied )
					strFilter = strFilter + strTemp;
				else
					strFilter = '';
				return strFilter;
			},
			generateUrlWithAdvancedFilterParams : function( me )
			{
				var thisClass = this;				
				var filterData = thisClass.advFilterData;
				var isFilterApplied = false;
				var isOrderByApplied = false;
				var strFilter = '';
				var strTemp = '';
				var strFilterParam = '';
				var operator = '';
				var isInCondition = false;

				if( !Ext.isEmpty( filterData ) )
				{
					for( var index = 0 ; index < filterData.length ; index++ )
					{
						isInCondition = false;
						operator = filterData[ index ].operator;
						if( isFilterApplied
							&& ( operator === 'bt' || operator === 'eq' || operator === 'lk' || operator === 'gt' || operator === 'lt' || operator === 'in' ) )
							strTemp = strTemp + ' and ';
						switch( operator )
						{
							case 'bt':
								isFilterApplied = true;
								if( filterData[ index ].dataType === 1 )
								{
									strTemp = strTemp + filterData[ index ].field + ' ' + filterData[ index ].operator
										+ ' ' + 'date\'' + filterData[ index ].value1 + '\'' + ' and ' + 'date\''
										+ filterData[ index ].value2 + '\'';
								}
								else
								{
									strTemp = strTemp + filterData[ index ].field + ' ' + filterData[ index ].operator
										+ ' ' + '\'' + filterData[ index ].value1 + '\'' + ' and ' + '\''
										+ filterData[ index ].value2 + '\'';
								}
								break;
							case 'st':
								if( !isOrderByApplied )
								{
									strTemp = strTemp + ' &$orderby=';
									isOrderByApplied = true;
								}
								else
								{
									strTemp = strTemp + ',';
								}
								strTemp = strTemp + filterData[ index ].value1 + ' ' + filterData[ index ].value2;
								break;
							case 'lk':
								isFilterApplied = true;
								strTemp = strTemp + filterData[ index ].field + ' ' + filterData[ index ].operator
									+ ' ' + '\'' + filterData[ index ].value1 + '\'';
								break;
							case 'eq':
								isInCondition = this.isInCondition( filterData[ index ] );
								if( isInCondition )
								{
									var reg = new RegExp( /[\(\)]/g );
									var objValue = filterData[ index ].value1;
									objValue = objValue.replace( reg, '' );
									var objArray = objValue.split( ',' );
									isFilterApplied = true;
									for( var i = 0 ; i < objArray.length ; i++ )
									{
										strTemp = strTemp + filterData[ index ].field + ' '
											+ filterData[ index ].operator + ' ' + '\'' + objArray[ i ] + '\'';
										if( i != objArray.length - 1 )
											strTemp = strTemp + ' or '
									}
									break;
								}
							case 'gt':
							case 'lt':
								isFilterApplied = true;
								if( filterData[ index ].dataType === 1 )
								{
									strTemp = strTemp + filterData[ index ].field + ' ' + filterData[ index ].operator
										+ ' ' + 'date\'' + filterData[ index ].value1 + '\'';
								}
								else
								{
									strTemp = strTemp + filterData[ index ].field + ' ' + filterData[ index ].operator
										+ ' ' + '\'' + filterData[ index ].value1 + '\'';
								}
								break;
							case 'in' :
											isFilterApplied = true;
								//var arrId = null;
								var temp = filterData[ index ].value1;

								var arrId = temp.split(",");
								if (arrId[0] != 'All') {
									if( 0 != arrId.length )
									{
										strTemp = strTemp + '(';
										for( var count = 0 ; count < arrId.length ; count++ )
										{
											if(filterData[ index ].field == "uploadStatus")
											{
												if( arrId[ count ] == "0.A" )
												{
													strTemp = strTemp + '(' +  filterData[ index ].field + ' eq  \'0\' and makerId ne ' + '\'' + loggedInUser  + '\'' + ' )';
												}
												else if( arrId[ count ] == "0" )
												{
													strTemp = strTemp + '(' +  filterData[ index ].field + ' eq  \'0\' and makerId eq ' + '\'' + loggedInUser  + '\'' + ' )';
												}
												else
												{
													strTemp = strTemp + filterData[ index ].field + ' eq ' + '\'' + arrId[ count ]
													+ '\'';
												}
											}
											else
											{
												strTemp = strTemp + filterData[ index ].field + ' eq ' + '\'' + arrId[ count ]
													+ '\'';
											}
											if( count != arrId.length - 1 )
											{
												strTemp = strTemp + ' or ';
					}
										}
										strTemp = strTemp + ')';
				}
								}
								else
								{
									isFilterApplied = false;
								}
								break;		
						}
					}
				}
				if( isFilterApplied )
				{
					strFilter = strFilter + strTemp;
				}
				else if( isOrderByApplied )
				{
					strFilter = strTemp;
				}
				else
				{
					strFilter = '';
				}
				return strFilter;
			},
			isInCondition : function( data )
			{
				var retValue = false;
				var displayType = data.displayType;
				var strValue = data.value1;
				var reg = new RegExp( /^\((\d\d*,)*\d\d*\)$/ );
				if( displayType && displayType === 4 && strValue && strValue.match( reg ) )
				{
					retValue = true;
				}
				return retValue;
			},
			generateActionStatusUrl : function()
			{
				var me = this;
				var strRetValue = '';
				var arrActionStatus = me.arrActionStatus;
				if( !Ext.isEmpty( arrActionStatus ) )
				{
					for( var i = 0 ; i < arrActionStatus.length ; i++ )
					{
						if( i == 0 )
							strRetValue += Ext.String.format( "ActionStatus eq '{0}'", arrActionStatus[ i ] );
						else
							strRetValue += Ext.String.format( " or ActionStatus eq '{0}'", arrActionStatus[ i ] );
					}
				}
				if( !Ext.isEmpty( strRetValue ) )
					strRetValue = '(' + strRetValue + ')';
				return strRetValue;
			},
			generateUrlWithFilterParams : function( thisClass )
			{
				var filterData = thisClass.filterData;
				var isFilterApplied = false;
				var strFilter = '&$filter=';
				var strTemp = '';
				var strFilterParam = '';
				for( var index = 0 ; index < filterData.length ; index++ )
				{
					if( isFilterApplied )
						strTemp = strTemp + ' and ';
					switch( filterData[ index ].operatorValue )
					{
						case 'bt':
							if( filterData[ index ].dataType === 'D' )
							{
								strTemp = strTemp + filterData[ index ].paramName + ' '
									+ filterData[ index ].operatorValue + ' ' + 'date\''
									+ filterData[ index ].paramValue1 + '\'' + ' and ' + 'date\''
									+ filterData[ index ].paramValue2 + '\'';
							}
							else
							{
								strTemp = strTemp + filterData[ index ].paramName + ' '
									+ filterData[ index ].operatorValue + ' ' + '\'' + filterData[ index ].paramValue1
									+ '\'' + ' and ' + '\'' + filterData[ index ].paramValue2 + '\'';
							}
							break;
						default:
							// Default opertator is eq
							if( filterData[ index ].dataType === 'D' )
							{
								strTemp = strTemp + filterData[ index ].paramName + ' '
									+ filterData[ index ].operatorValue + ' ' + 'date\''
									+ filterData[ index ].paramValue1 + '\'';
							}
							else
							{
								strTemp = strTemp + filterData[ index ].paramName + ' '
									+ filterData[ index ].operatorValue + ' ' + '\'' + filterData[ index ].paramValue1
									+ '\'';
							}
							break;
					}
					isFilterApplied = true;
				}
				if( isFilterApplied )
					strFilter = strFilter + strTemp;
				else
					strFilter = '';
				return strFilter;
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
			getSavedFilterData : function( filterCode, fnCallback, applyAdvFilter )
			{
				var me = this;				
				var objJson;
				var strUrl = 'userfilters/{0}/{1}.srvc?';
				strUrl = Ext.String.format( strUrl,me.screenName, filterCode );
				Ext.Ajax.request(
				{
					url : strUrl ,
					method : 'GET',
					success : function( response )
					{
						var responseData = Ext.decode( response.responseText );
						fnCallback.call( me, filterCode, responseData, applyAdvFilter );
					},
					failure : function()
					{
						var errMsg = "";
						Ext.MessageBox.show(
						{
							title : getLabel( 'instrumentErrorPopUpTitle', 'Error' ),
							msg : getLabel( 'instrumentErrorPopUpMsg', 'Error while fetching data..!' ),
							buttons : Ext.MessageBox.OK,
							icon : Ext.MessageBox.ERROR
						} );
					}
				} );
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
				advFilterSelectedClients = "";
				for (i = 0; i < filterData.filterBy.length; i++) {
					fieldName = filterData.filterBy[i].field;
					fieldVal = filterData.filterBy[i].value1;
					fieldSecondVal = filterData.filterBy[i].value2;
					currentFilterData = filterData.filterBy[i];
					operatorValue = filterData.filterBy[i].operator;
					if ( fieldName === 'clientId' ) {
						 me.checkUnCheckMenuItems(fieldName, fieldVal);
							advFilterSelectedClients=fieldVal;
					 }else if (fieldName === 'FileName') {
						$("#FileName").val(decodeURI(fieldVal));
					} else if (fieldName === 'totalCrAmount') {
						$("#totalCrAmount").val(fieldVal);
					} else if (fieldName === 'totalCrCount') {
						$("#totalCrCount").val(fieldVal);
					} else if (fieldName === 'totalDrAmt') {
						$("#totalDrAmount").val(fieldVal);
					} else if (fieldName === 'totalDrCount') {
						$("#totalDrCount").val(fieldVal);
					} else if (fieldName === 'importDateTime') {
						me.setSavedFilterDates(fieldName, currentFilterData);
					} else if (fieldName === 'uploadStatus') {
						$("#uploadStatus").val(fieldVal).multiselect("refresh");
					} else if (fieldName === 'noOfCompany') {
						$("#noOfCompany").val(fieldVal);
					}					
				}
				if (!Ext.isEmpty(filterCode) && isFilterCodeExist(filterCode,$('#msSavedFilter')[0])) {
					$('#filterCode').val(filterCode);
					$("#msSavedFilter option[value='"+filterCode+"']").attr("selected",true);
					$("#msSavedFilter").multiselect("refresh");
					var saveFilterChkBox = $("input[type='checkbox'][id='saveFilterChkBox']");
					saveFilterChkBox.prop('checked', true);
					markAdvFilterNameMandatory('saveFilterChkBox','savedFilterlbl','filterCode', false);										
				}
				if (applyAdvFilter)
				{
					me.showAdvFilterCode = filterCode;
					me.applyAdvancedFilter(filterData);
				}
			},
			checkUnCheckMenuItems : function(componentName, data) {
				var menuRef = null;
				var elementId = null;
				if (componentName === 'clientId') {
					menuRef = $('select[id=\'clientSelect\']');
					elementId = '#clientSelect';
				} 
				if (componentName === 'uploadStatus') {
                    menuRef = $('select[id=\'uploadStatus\']');
                    elementId = '#uploadStatus';
                }
				if (!Ext.isEmpty(menuRef)) {
					var itemArray = $(elementId + " option");
					if (data === 'All') {
						itemArray.prop('selected', true);
					} else {
						itemArray.prop('selected', false);
					}

					var dataArray = (typeof data == 'string') ? data.split(',') : data;
					if(!Ext.isEmpty(dataArray)) {
						for (var dataIndex = 0; dataIndex < dataArray.length; dataIndex++) {
							for (var index = 0; index < itemArray.length; index++) {
								if (dataArray[dataIndex] == itemArray[index].value) {
									$(elementId + ' option[value=\'' + itemArray[index].value + '\']').prop('selected', true);
									break;
								}
							}
						}
					}
					$(elementId).multiselect('refresh');
				}
			},
			setSavedFilterDates : function(dateType, data) {
				if (!Ext.isEmpty(dateType) && !Ext.isEmpty(data)) {
					var me = this;
					var dateFilterRef = null;
					var dateOperator = data.operator;

					if (dateType === 'importDateTime') {
						dateFilterRef = $('#importDateTime');
					}

					if (dateOperator === 'eq') {
						var fromDate = data.value1;
						if (!Ext.isEmpty(fromDate)) {
							var formattedFromDate = Ext.util.Format.date(Ext.Date
											.parse(fromDate, 'Y-m-d'),
									strExtApplicationDateFormat);
							$(dateFilterRef).val(formattedFromDate);
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
								$(dateFilterRef).setDateRangePickerValue([
									fromDate, toDate]);
							}
						}
					}
				
					selectedImportDateInAdvFilter = {
						operator : dateOperator,
						fromDate : fromDate,
						toDate : toDate,
						dateLabel : data.dropdownLabel
					};
					
					me.getDateLabel().setText(getLabel('importDate',
							'Import Date')
							+ " (" + selectedImportDateInAdvFilter.dateLabel + ")");
					$('label[for="importDateLabel"]').text(getLabel('importDate','Import Date')+ " ("
							+ selectedImportDateInAdvFilter.dateLabel + ")");
					var dateLable = " (" + selectedImportDateInAdvFilter.dateLabel + ")";
							updateToolTip('importDate', dateLable);
			
				} else {
					// console.log("Error Occured - date filter details found empty");
				}
			},
			editFilterData : function(grid, rowIndex) {
				var me = this;
				me.resetAllFields();

				var record = grid.getStore().getAt(rowIndex);
				var filterCode = record.data.filterName;

				var filterCodeRef = $("input[type='text'][id='filterCode']");
				if (!Ext.isEmpty(filterCodeRef)) {
					filterCodeRef.val(filterCode);
					filterCodeRef.prop('disabled', true);
				}
				var applyAdvFilter = false;


				me.getSavedFilterData(filterCode, this.populateSavedFilter,
						applyAdvFilter);
				changeAdvancedFilterTab(1);
			},
			deleteFilterSet : function( filterCode)
			{
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
			
			deleteFilterCodeFromDb : function( objFilterName )
			{
				var me = this;
				if( !Ext.isEmpty( objFilterName ) )
				{
					var strUrl = 'userfilters/{0}/{1}/remove.srvc?' + csrfTokenName + '=' + csrfTokenValue;
					strUrl = Ext.String.format(strUrl, me.screenName, objFilterName);

					Ext.Ajax.request(
					{
						url : strUrl,
						method : "POST",
						success : function( response )
						{
							//me.getAllSavedAdvFilterCode();
						},
						failure : function( response )
						{
							console.log( "Error Occured" );
						}
					} );
				}
			},
			sendUpdatedOrderJsonToDb : function(store) {
				var me = this;
				var objJson = {};
				var preferenceArray = [];

				$("#msSavedFilter option").each(function() {
					preferenceArray.push($(this).val());
				});	
				objJson.filters = preferenceArray;
				
				var strUrl = 'services/userpreferences/{0}/advanceFilterOrderList.json';
				strUrl = Ext.String.format(strUrl, me.screenName);
							
				Ext.Ajax.request({
					url : strUrl,
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
						
			viewFilterData : function( grid, rowIndex )
			{
				var me = this;
				me.resetAllFields();
				var record = grid.getStore().getAt(rowIndex);
				var filterCode = record.data.filterName;
				var applyAdvFilter = false;
				me.getSavedFilterData(filterCode, this.populateSavedFilter,
						applyAdvFilter);
				changeAdvancedFilterTab(1);
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
			doHandleGroupActions : function(strAction, grid, arrSelectedRecords,
					strActionType) {
				var me = this;
				var strUrl = Ext.String.format( 'getList/{0}/{1}.srvc?', me.screenName, strAction );
				strUrl= strUrl + csrfTokenName + "=" + csrfTokenValue;
				if( strAction === 'reject' )
				{
					me.showRejectVerifyPopUp(strAction, strUrl, grid,
							arrSelectedRecords);
				}
				else
				{
					me.preHandleGroupActions(strUrl, '', grid, arrSelectedRecords,
							strAction);
				}
				
				
			},			
			showRejectVerifyPopUp : function( strAction, strActionUrl, grid,
					arrSelectedRecords )
			{
				var me = this;
				var titleMsg = '', fieldLbl = '';
				if( strAction === 'reject' )
				{
					fieldLbl = getLabel( 'prfRejectRemarkPopUpTitle', 'Please Enter Reject Remark' );
					titleMsg = getLabel( 'prfRejectRemarkPopUpFldLbl', 'Reject Remark' );
				}
				var msgbox = Ext.Msg.show(
				{
					title : titleMsg,
					msg : fieldLbl,
					buttons : Ext.Msg.OKCANCEL,
					multiline : 4,
					cls : 't7-popup',
					width: 355,
					height : 270,
					bodyPadding : 0,
					fn : function( btn, text )
					{
						if( btn == 'ok' )
						{
							me.preHandleGroupActions(strActionUrl, text, grid, arrSelectedRecords,
												strAction);
						}
					}
				} );
				msgbox.textArea.enforceMaxLength = true;
				msgbox.textArea.inputEl.set({
					maxLength : 255
				});
			},
			enableDisableGroupActions : function(actionMask, isSameUser, isDisabled,
					isSubmit) {
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

									if ((item.maskPosition === 4 && blnEnabled)) {
										blnEnabled = blnEnabled && isSameUser;
									} else if (item.maskPosition === 5 && blnEnabled) {
										blnEnabled = blnEnabled && isSameUser;
									} 
									item.setDisabled(!blnEnabled);
								}
							});
				}
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
							if( !Ext.isEmpty( strUrl ) && strUrl.indexOf('/accept.srvc') !== -1)
							{
								remark = records[ index ].data.clientId;
							}
							arrayJson.push({
										serialNo : grid.getStore()
												.indexOf(records[index])
												+ 1,
										identifier : records[index].data.identifier,
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
							var errors = '';
							var errocode='';
							 for (var i in jsonRes.d.instrumentActions) {
								if (jsonRes.d.instrumentActions[i].errors) {
									for (var j in jsonRes.d.instrumentActions[i].errors) {
										errocode = jsonRes.d.instrumentActions[i].errors[j].code;
										errors = jsonRes.d.instrumentActions[i].errors[j].errorMessage + "<br\>";
									}
								}			
							 }
							 if (errors != '') {
								Ext.MessageBox.show(
								{
									title : getLabel( 'instrumentErrorPopUpTitle', 'Error' ),
									msg :errocode+':'+ errors,
									buttons : Ext.MessageBox.OK,
									icon : Ext.MessageBox.ERROR
								} );
							}
							 			me.enableDisableGroupActions('000000000000000000');		
										groupView.setLoading(false);
										me.refreshData();
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
			setInfoTooltip : function()
			{
				var me = this;
				var infotip = Ext.create( 'Ext.tip.ToolTip',
				{
					target : 'passThruFileACHFilterViewType-1060_header_hd-textEl',
					listeners :
					{
						// Change content dynamically depending on which
						// element
						// triggered the show.
						beforeshow : function( tip )
						{
							//var statusVal = '';
							var dateFilter = me.dateFilterLabel;
							var client = '';

							/*if( me.statusFilterVal == 'All' && me.filterApplied == 'ALL' )
							{
								statusVal = 'All';
								me.showAdvFilterCode = null;
							}
							else
							{
								statusVal = me.statusFilterDesc;
							}*/

							var advfilter = me.showAdvFilterCode;
							if( advfilter == '' || advfilter == null )
							{
								advfilter = getLabel( 'none', 'None' );
							}
							
							if(!Ext.isEmpty(me.clientDescr) )
								{
								client = me.clientDescr								
								}
								else {
								client = getLabel('allCompanies', 'All Companies');	
								}								

							tip.update( 'Company Name '+ ' : '+ client + '<br/>' + getLabel( 'date', 'Import Date' )
								+ ' : ' + dateFilter + '<br/>' + getLabel( 'advancedFilter', 'Advanced Filter' ) + ':'
								+ advfilter );
						}
					}
				} );
			},
			toggleSavePrefrenceAction : function( isVisible )
			{
				var me = this;
				var btnPref = me.getBtnSavePreferences();
				if( !Ext.isEmpty( btnPref ) )
					btnPref.setDisabled( !isVisible );
			},
			toggleClearPrefrenceAction : function(isVisible) {
				var me = this;
				var btnPref = me.getBtnClearPreferences();
				if (!Ext.isEmpty(btnPref))
					btnPref.setDisabled(!isVisible);
			},				
			handleDateChange : function(index) {
				var me = this;
				var objDateParams = me.getDateParam(index);
				var datePickerRef = $('#importDateQuickPicker');

				if (!Ext.isEmpty(me.dateFilterLabel)) {
					me.getDateLabel().setText(getLabel('importDate',
							'Import Date')
							+ " (" + me.dateFilterLabel + ")");
					$('label[for="importDateLabel"]').text(getLabel('importDate',
					'Import Date')
					+ " (" + me.dateFilterLabel + ")");	
				}

				/*var vFromDate = Ext.util.Format.date(Ext.Date.parse(
								objDateParams.fieldValue1, 'Y-m-d'),
						strExtApplicationDateFormat);
				var vToDate = Ext.util.Format.date(Ext.Date.parse(
								objDateParams.fieldValue2, 'Y-m-d'),
						strExtApplicationDateFormat);*/
				var vFromDate = Ext.Date.parse(objDateParams.fieldValue1, 'Y-m-d');
				var vToDate = Ext.Date.parse(objDateParams.fieldValue2, 'Y-m-d');
				if (index == '13') {
					if (objDateParams.operator == 'eq') {
						datePickerRef.setDateRangePickerValue(vFromDate);
					} else {
						datePickerRef.setDateRangePickerValue([vFromDate, vToDate]);
					}
				} else {
					if (index === '1' || index === '2') {
							datePickerRef.val(vFromDate);
						}
					 else {
						datePickerRef.setDateRangePickerValue([vFromDate, vToDate]);
					}
				}
			me.handleImportDateSync('Q', me.getDateLabel().text, " (" + me.dateFilterLabel + ")", datePickerRef);
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
					case '12' :
						// Latest
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
			handleSavePreferences : function()
			{
				var me = this;
				if ($("#savePrefMenuBtn").attr('disabled'))
					event.preventDefault();
				else{	
							if(screenType == 'ACH')
							{
								me.strPageName = me.screenTypeFileACH ;
							}
							else
							{
								me.strPageName = me.screenTypePositivePay ;
							}
							var arrPref = me.getPreferencesToSave(false);
							if (arrPref) {
								me.preferenceHandler.savePagePreferences(me.strPageName, arrPref,
										me.postHandleSavePreferences, null, me, true);
							}
							me.disablePreferencesButton("savePrefMenuBtn",true);
							me.disablePreferencesButton("clearPrefMenuBtn",false);	
						//me.savePreferences();
				}		
			},
			handleClearPreferences : function() {
				var me = this;
				if ($("#clearPrefMenuBtn").attr('disabled'))
					event.preventDefault();
				else{	
					if(screenType == 'ACH')
					{
						me.strPageName = me.screenTypeFileACH ;
					}
					else
					{
						me.strPageName = me.screenTypePositivePay ;
					}
					var arrPref = me.getPreferencesToSave(false);
					me.preferenceHandler.clearPagePreferences(me.strPageName, null,
							me.postHandleClearPreferences, null, me, true);
					me.disablePreferencesButton("savePrefMenuBtn",false);
					me.disablePreferencesButton("clearPrefMenuBtn",true);			
				}			
			},
			postHandleSavePreferences : function(data, args, isSuccess) {
				var me = this;
				me.disablePreferencesButton("savePrefMenuBtn",true);
				me.disablePreferencesButton("clearPrefMenuBtn",false);	
			},
			postHandleClearPreferences : function(data, args, isSuccess) {
				var me = this;
			},
			getPreferencesToSave : function(localSave) {
				var me = this;
				var groupView = me.getGroupView();
				var grid = null;
				var arrCols = null, objCol = null, arrColPref = new Array(), arrPref = [], objFilterPref = null;
				var groupInfo = null, subGroupInfo = null;
				if (groupView) {
					grid = groupView.getGrid()
					var gridState = grid.getGridState();
					groupInfo = groupView.getGroupInfo() || '{}';
					subGroupInfo = groupView.getSubGroupInfo() || {};

					objFilterPref = me.getFilterPreferences();
					arrPref.push({
								"module" : "groupViewFilterPref",
								"jsonPreferences" : objFilterPref
							});
					// TODO : Save Active tab for group by "Advanced Filter" to be
					// discuss
					if (groupInfo.groupTypeCode && subGroupInfo.groupCode
							&& groupInfo.groupTypeCode !== 'ADVFILTER') {
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
										'gridSetting' : groupView.getGroupViewState().gridSetting,
										'sortState' : gridState.sortState
									}
								});
					}
				}
				return arrPref;
			},
			getFilterPreferences : function() {
				var me = this;
				var advFilterCode = null;
				var objFilterPref = {},strSqlDateFormat = 'Y-m-d';;
				var filterPanel = me.getPassThruFilterView();
				if (!Ext.isEmpty(me.savedFilterVal)) {
					advFilterCode = me.savedFilterVal;
				}
				var quickPref = {};
				quickPref.entryDate = me.dateFilterVal;
				if (me.dateFilterVal === '13') {
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
				if (!Ext.isEmpty(me.clientFilterVal))
				{
					objFilterPref.filterClientSelected = me.clientFilterVal;
					objFilterPref.filterClientDesc = me.clientFilterDesc;
					
				}	
				return objFilterPref;
			},
			saveFilterPreferences : function()
			{
				var me = this;
				var strUrl = me.urlGridFilterPref;				
				strUrl = Ext.String.format( strUrl,me.screenName);
				var advFilterCode = null;
				var objFilterPref = {};
				
				if( !Ext.isEmpty( me.savedFilterVal ) )
				{
					advFilterCode = me.savedFilterVal;
				}
				var objQuickFilterPref = {};
				//objQuickFilterPref.status = me.statusFilterVal;
				objQuickFilterPref.importDateTime = me.dateFilterVal;
				if( me.dateFilterVal === '7' )
				{
					if( !Ext.isEmpty( me.dateFilterFromVal ) && !Ext.isEmpty( me.dateFilterToVal ) )
					{	
						objQuickFilterPref.importDateTimeFrom = me.dateFilterFromVal;
						objQuickFilterPref.importDateTimeTo = me.dateFilterToVal;
					}
					else
					{
						var strSqlDateFormat = 'Y-m-d';
						//var frmDate = me.getFromEntryDate().getValue();
						//var toDate = me.getToEntryDate().getValue();
						//fieldValue1 = Ext.util.Format.date( frmDate, 'Y-m-d' );
						//fieldValue2 = Ext.util.Format.date( toDate, 'Y-m-d' );
						//objQuickFilterPref.fromDate = fieldValue1;
						//objQuickFilterPref.toDate = fieldValue2;
					}
				}

				objFilterPref.advFilterCode = advFilterCode;
				objFilterPref.quickFilter = objQuickFilterPref;
				if (!Ext.isEmpty(me.clientFilterVal))
					objFilterPref.filterClientSelected = me.clientFilterVal;
				

				if( objFilterPref )
					Ext.Ajax.request(
					{
						url : strUrl+ csrfTokenName + "=" + csrfTokenValue,
						method : 'POST',
						jsonData : Ext.encode( objFilterPref ),
						success : function( response )
						{
							var data = Ext.decode( response.responseText );
							var title = getLabel( 'SaveFilterPopupTitle', 'Message' );
							if( data.d.preferences && data.d.preferences.success === 'Y' )
							{
								Ext.MessageBox.show(
								{
									title : title,
									msg : getLabel( 'prefSavedMsg', 'Preferences Saved Successfully' ),
									buttons : Ext.MessageBox.OK,
									icon : Ext.MessageBox.INFO
								} );
							}
							else if( data.d.preferences && data.d.preferences.success === 'N' && data.d.error
								&& data.d.error.errorMessage )
							{								
								Ext.MessageBox.show(
								{
									title : title,
									msg : data.d.error.errorMessage,
									buttons : Ext.MessageBox.OK,
									icon : Ext.MessageBox.ERROR
								} );
							}
						},
						failure : function()
						{
							var errMsg = "";
							Ext.MessageBox.show(
							{
								title : getLabel( 'instrumentErrorPopUpTitle', 'Error' ),
								msg : getLabel( 'instrumentErrorPopUpMsg', 'Error while fetching data..!' ),
								buttons : Ext.MessageBox.OK,
								icon : Ext.MessageBox.ERROR
							} );
						}
					} );
			},
			clearWidgetPreferences : function() {
				var me = this;
				//var strUrl = Ext.String.format( me.commonPrefUrl,me.screenName);
				//strUrl = strUrl+"?$clear=true";
				//var grid = me.getPassThruFileACHGridRef();
				//var arrColPref = new Array();
				//var arrPref = new Array();
				if(Ext.isEmpty(me.preferenceHandler)){
					 me.preferenceHandler = Ext.create('Ext.ux.gcp.PreferencesHandler');
				}				
				me.preferenceHandler.clearModulePreferences(me.screenName,'gridView',null,
					me.postHandleClearPreferences, null, me, true);
				me.preferenceHandler.clearModulePreferences(me.screenName,'gridViewFilter',null,
					me.postHandleClearPreferences, null, me, true);
			},			
			updateFilterConfig : function()
			{
				var me = this;
				me.preferenceHandler = Ext.create('Ext.ux.gcp.PreferencesHandler');
				var arrJsn = new Array();				
				var objDateLbl = {
					'' : getLabel('latest', 'Latest'),
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
					'12' : getLabel('latest', 'Latest'),
					'13' : getLabel('daterange', 'Date Range')

				};
                 /*if(Ext.isEmpty(objDefaultGridViewPref)){
				  me.preferenceHandler = Ext.create('Ext.ux.gcp.PreferencesHandler');
				  me.preferenceHandler.readModulePreferences('passThruPositivePay',
					'gridViewFilter', me.postReadPanelPrefrences, args, me, true);
				 }*/
				if (!Ext.isEmpty(objPassThruPref)) {
					var objJsonData = Ext.decode(objPassThruPref);
					var data = objJsonData.d.preferences.groupViewFilterPref;
					if (!Ext.isEmpty(data)) {
						var strDtValue = data.quickFilter.entryDate;
						var strDtFrmValue = data.quickFilter.entryDateFrom;
						var strDtToValue = data.quickFilter.entryDateTo;

						if (!Ext.isEmpty(strDtValue)) {
							me.dateFilterLabel = objDateLbl[strDtValue];
							me.dateFilterVal = strDtValue;
						
							if (strDtValue === '13') {
								if (!Ext.isEmpty(strDtFrmValue))
									me.dateFilterFromVal = strDtFrmValue;
									me.datePickerSelectedDate[0]=Ext.Date.parse(strDtFrmValue, 'Y-m-d')
								if (!Ext.isEmpty(strDtToValue))
									me.dateFilterToVal = strDtToValue;
									me.datePickerSelectedDate[1]=Ext.Date.parse(strDtToValue, 'Y-m-d')
							}
						}

						var clientSelected = data.filterClientSelected;
						me.clientFilterDesc=data.filterClientDesc;
						me.clientFilterVal = clientSelected;
						if (entity_type == '1') {
							$("#summaryClientFilterSpan").text(me.clientFilterDesc);
						}else if(entity_type=='0'){
							$("#summaryClientFilter").val(me.clientFilterDesc);
						}
						arrJsn = me.createAndSetJsonForFilterData();
						var advFilterCode = data.advFilterCode;
						me.savedFilterVal = advFilterCode;
					}
				}				
				me.filterData = arrJsn;
			},
		
		  createAndSetJsonForFilterData : function() {
			var me = this;
			var arrJsn = new Array();
			if (!Ext.isEmpty(me.dateFilterVal)) {
				var strVal1 = '', strVal2 = '', strOpt = 'eq';
				/*
				 * if (me.dateFilterVal === '12') { // do nothing. } else
				 */
				 if (me.dateFilterVal !== '13') {
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
					arrJsn.push({
								paramName : 'importDateTime',
								paramValue1 : strVal1,
								paramValue2 : strVal2,
								operatorValue : strOpt,
								dataType : 'D'
							});
			}
			
			if (me.clientFilterVal != null && me.clientFilterVal != 'all') {
				arrJsn.push({
							paramName : 'clientCode',
							paramValue1 : encodeURIComponent(me.clientFilterVal.replace(new RegExp("'", 'g'), "\''")),
							operatorValue : 'eq',
							dataType : 'S'
						});
			}
			return arrJsn;
		},		  	
			// This function will called only once
			/*updateAdvFilterConfig : function() {
				var me = this;
				if (!Ext.isEmpty(objDefaultGridViewPref)) 
				{
					var data = Ext.decode(objDefaultGridViewPref);
					if (!Ext.isEmpty(data.advFilterCode)) {
						me.showAdvFilterCode = data.advFilterCode;
						me.savePrefAdvFilterCode = data.advFilterCode;
						var strUrl = 'userfilters/{0}/{1}.srvc';
						strUrl = Ext.String.format(strUrl,me.screenName, data.advFilterCode);
						Ext.Ajax.request({
							url : strUrl+'?'+csrfTokenName+'='+csrfTokenValue,
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
								this.advFilterCodeApplied = data.advFilterCode;
								me.savePrefAdvFilterCode ='';
								me.filterApplied = 'A';
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
			},*/
			handleReportAction : function( btn, opts )
			{
				var me = this;
				me.downloadReport( btn.itemId );
			},
			downloadReport : function( actionName )
			{
				var me = this;
				var withHeaderFlag = document.getElementById("headerCheckbox").checked;
				var arrExtension =
				{
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
				var groupView = me.getGroupView();
				var subGroupInfo = groupView.getSubGroupInfo() || {};
				
				strExtension = arrExtension[ actionName ];
				if(screenType == 'ACH')
				{
					strUrl = 'services/getPassThruACHList/getPassThruACHDynamicReport.' + strExtension;
				}
				else
				{
					strUrl = 'services/getPassThruACHList/getPassThruPositivePayDynamicReport.' + strExtension;	
				}
				strUrl += '?$skip=1';				
				var strQuickFilterUrl = me.getFilterUrl(subGroupInfo);
				strUrl += strQuickFilterUrl;
				//var grid = me.getPassThruFileACHGridRef();
				
				var grid = groupView.getGrid();
				viscols = grid.getAllVisibleColumns();
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
				for( var j = 0 ; j < viscols.length ; j++ )
				{
					col = viscols[ j ];
					if( col.dataIndex && arrSortColumnReport[ col.dataIndex ] )
					{
						if( colMap[ arrSortColumnReport[ col.dataIndex ] ] )
						{
							// ; do nothing
						}
						else
						{
							colMap[ arrSortColumnReport[ col.dataIndex ] ] = 1;
							colArray.push( arrSortColumnReport[ col.dataIndex ] );

						}
					}

				}
				if( colMap != null )
				{

					visColsStr = visColsStr + colArray.toString();
					strSelect = '&$select=[' + colArray.toString() + ']';
				}

				strUrl = strUrl + strSelect;
				
				var  objParam = {}, arrMatches, strRegex = /[?&]([^=#]+)=([^&#]*)/g;
		         while (arrMatches = strRegex.exec(strUrl)) {
					objParam[arrMatches[1]] = arrMatches[2];
				}
				strUrl = strUrl.substring(0, strUrl.indexOf('?'));
				
				form = document.createElement( 'FORM' );
				form.name = 'frmMain';
				form.id = 'frmMain';
				form.method = 'POST';
				
				Object.keys(objParam).map(function(key) { 
				form.appendChild(me.createFormField('INPUT', 'HIDDEN',
						key, objParam[key]));
				});
				
				form.appendChild( me.createFormField( 'INPUT', 'HIDDEN', csrfTokenName, csrfTokenValue ) );
				form.appendChild( me.createFormField( 'INPUT', 'HIDDEN', 'txtCurrent', currentPage ) );
				form.appendChild( me.createFormField( 'INPUT', 'HIDDEN', 'txtCSVFlag', withHeaderFlag ) );
				form.action = strUrl;
				document.body.appendChild( form );
				form.submit();
				document.body.removeChild( form );
			},
			applySeekFilter : function()
			{
				var me = this;
				//me.toggleSavePrefrenceAction( true );
				me.setDataForFilter();
				me.filterApplied = 'Q';
				me.applyQuickFilter();
			},
			doHandleGroupTabChange : function(groupInfo, subGroupInfo, tabPanel,
					newCard, oldCard) {
				var me = this;
				if(screenType == 'ACH')
				{
					me.strPageName = me.screenTypeFileACH ;
					me.strGetModulePrefUrl = 'services/userpreferences/passThruFileACH/{0}.json'
				}
				else
				{
					me.strPageName = me.screenTypePositivePay ;
					me.strGetModulePrefUrl = 'services/userpreferences/passThruPositivePay/{0}.json'
				}
				var objGroupView = me.getGroupView();
				var strModule = '', strUrl = null, args = null, strFilterCode = null;
				groupInfo = groupInfo || {};
				subGroupInfo = subGroupInfo || {};
				// TODO : Need to refactor for non us market
				if (groupInfo && _charCaptureGridColumnSettingAt === 'L') {
					args = {
						scope : me
					};
					strModule = subGroupInfo.groupCode;
				//	strUrl = Ext.String.format(me.strGetModulePrefUrl, strModule);
					strModule = strModule === 'all'? groupInfo.groupTypeCode+'-'+strModule : strModule;
					me.preferenceHandler.readModulePreferences(me.strPageName,strModule,me.postHandleDoHandleGroupTabChange, null, me, false);

					//strUrl = me.urlGridPref;
					//strUrl = Ext.String.format( strUrl,me.screenName);
					//strUrl = strUrl +csrfTokenName+'='+csrfTokenValue;
					/*me.getSavedPreferences(strUrl, me.postHandleDoHandleGroupTabChange,
							args);*/
					/*me.preferenceHandler.readModulePreferences(me.strPageName,
					strModule, me.postHandleDoHandleGroupTabChange, args, me, true);*/
				}else 
			me.postHandleDoHandleGroupTabChange();
				
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
			var me = args ? args.scope : this;
			me.handleReconfigureGrid(data);
		},
		handleReconfigureGrid : function(data) {
		var me = this;
		var objGroupView = me.getGroupView();
		var objSummaryView = me.getPassThruGroupView(), gridModel = null, objData = null;
		var colModel = null, arrCols = null;
		var intPageSize = me.objLocalData && me.objLocalData.d && me.objLocalData.d.preferences
        	&& me.objLocalData.d.preferences.tempPref
        	&& me.objLocalData.d.preferences.tempPref.pageSize
        	? me.objLocalData.d.preferences.tempPref.pageSize
        	: '';
		var intPageNo = me.objLocalData && me.objLocalData.d && me.objLocalData.d.preferences
        	&& me.objLocalData.d.preferences.tempPref
        	&& me.objLocalData.d.preferences.tempPref.pageNo
        	? me.objLocalData.d.preferences.tempPref.pageNo
        	: 1;
		var sortState = me.objLocalData && me.objLocalData.d && me.objLocalData.d.preferences
       		&& me.objLocalData.d.preferences.tempPref
       		&& me.objLocalData.d.preferences.tempPref.sorter
       		? me.objLocalData.d.preferences.tempPref.sorter
       		: [];
		if (data && data.preference)
			objData = Ext.JSON.decode(data.preference)
		if (_charCaptureGridColumnSettingAt === 'L' && objData
				&& objData.gridCols) {
			arrCols = objData.gridCols;
			colModel = objSummaryView.getColumnModel(arrCols);
			if (colModel) {
				gridModel = {
					columnModel : colModel,
					pageSize : intPageSize,
                    pageNo : intPageNo
				}
			}
		}
		if(!Ext.isEmpty(intPageSize) && !Ext.isEmpty(intPageNo)) {
            gridModel = gridModel ? gridModel : {};
            gridModel.pageSize = intPageSize;
            gridModel.pageNo = intPageNo;
            gridModel.storeModel = {sortState: sortState};
        }
		// TODO : Preferences and existing column model need to be merged
		objGroupView.reconfigureGrid(gridModel);
	},

		/*postHandleDoHandleGroupTabChange : function(data, args) {
			var me = args.scope;
			var objGroupView = me.getGroupView();
			var objSummaryView = me.getPassThruGroupView(), objPref = null, gridModel = null, intPgSize = null , showPager = true;
			var colModel = null, arrCols = null;
			if (data && data.preference) {
				me.disablePreferencesButton("clearPrefMenuBtn",false);
				objPref = Ext.decode(data.preference);
				arrCols = objPref.gridCols || null;
				intPgSize = objPref.pgSize || _GridSizeTxn;
				//arrCols = objPref[0].columns || null;
				//intPgSize = objPref[0].pageSize || _GridSizeTxn;
				showPager = objPref.gridSetting
								&& !Ext.isEmpty(objPref.gridSetting.showPager)
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
						 // sortState:objPref[0].sortState
						}

					};
				}
			}
			objGroupView.reconfigureGrid(gridModel);
	},*/
	refreshData : function() {
		var me=this;
		var objGroupView = me.getGroupView();
		objGroupView.refreshData();
	},
	handleImportDateChange : function(btn, opts) {
		var me = this;
		me.dateFilterVal = btn.btnValue;
		me.dateFilterLabel = btn.text;
		me.handleDateChange(btn.btnValue);
		me.handleImportAdvDateChange(me.dateFilterVal);				
		me.resetSavedFilterCombo();
		me.setDataForFilter();
		me.applyQuickFilter();
	},
	handleImportDateChangeInAdvaFilter : function(btn, opts) {
		var me = this;
		me.dateFilterVal = btn.btnValue;
		me.dateFilterLabel = btn.text;
		me.handleImportAdvDateChange(btn.btnValue);		
	},
		handleImportDateSync : function(valueChangedAt, sourceLable, sourceToolTipText, sourceTextRef) {
		var me = this, labelToChange, valueControlToChange, updatedDateValue;		
		labelToChange = (valueChangedAt === 'Q') ? $('label[for="dateLabel"]') : me.getDateLabel();
		valueControlToChange = (valueChangedAt === 'Q') ? $('#importDateTime') : $('#importDateQuickPicker');
		updatedDateValue = sourceTextRef.getDateRangePickerValue();		
		if(labelToChange && valueControlToChange && valueControlToChange.hasClass('is-datepick')) {
			if(valueChangedAt === 'Q') {
				labelToChange.text(sourceLable);
				updateToolTip('importDate', sourceToolTipText);
			} else {
				labelToChange.setText(sourceLable);
			}
			if(!Ext.isEmpty(updatedDateValue)) {
				valueControlToChange.setDateRangePickerValue(updatedDateValue);
			}
		}
	},
	/*handleClientChangeInQuickFilter : function(combo) {
		var me = this;
		me.clientFilterVal  = combo.getValue();
		me.clientFilterDesc = combo.getRawValue();					
								
		me.filterApplied = 'Q';
		me.setDataForFilter();
		if (me.clientFilterVal == 'all') {
			me.savedFilterVal = null;
			me.filterApplied = 'ALL';
			me.refreshData();
		} else {
			me.applyQuickFilter();
		}
	},*/
	doHandleSavedFilterItemClick : function(filterCode, comboDesc) {
		var me = this;
		if (!Ext.isEmpty(filterCode)) {
			me.savePrefAdvFilterCode = filterCode
			me.showAdvFilterCode = filterCode;
			me.resetAllFields();
			me.getSavedFilterData(filterCode, this.populateSavedFilter, true);
		}
		/*var importDateLableVal = $('label[for="dateLabel"]').text();
		var importDateField = $("#importDateTime");		
		me.handleImportDateSync('A', importDateLableVal, null, importDateField);*/
	//	me.savedFilterVal = filterCode;
		me.savePrefAdvFilterCode = filterCode;
		me.showAdvFilterCode = filterCode;
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
		
	reloadFilters: function(store){
		store.load();
		store.reload({
						callback : function() {
							var storeGrid = filterGridStore();
							if (!Ext.isEmpty(storeGrid)) {
								store.loadRecords(
									storeGrid.getRange(0, storeGrid
													.getCount()), {
										addRecords : false
									});
							}
							else {
								store.loadRecords(new Array());
							}
						}
					});
	},
	resetAllFields : function() {
		var me = this;
		$("input[type='text'][id='FileName']").val("");
		$("input[type='text'][id='totalCrAmount']").val("");
		$("input[type='text'][id='totalCrCount']").val("");
		if(screenType == 'ACH')
		{
			$("input[type='text'][id='totalDrAmount']").val("");
			$("input[type='text'][id='totalDrCount']").val("");
			$("input[type='text'][id='noOfCompany']").val("");		
		}
		$("#uploadStatus").val("All");
		$('#uploadStatus option').prop('selected', true);
		$('#uploadStatus').multiselect("refresh");
		selectedImportDateInAdvFilter = {};
		$("input[type='text'][id='filterCode']").val("");
		$("input[type='text'][id='filterCode']").prop('disabled', false);
		$("#msSavedFilter").val("");
		$("#msSavedFilter").multiselect("refresh");
		$("#saveFilterChkBox").attr('checked', false);
		markAdvFilterNameMandatory('saveFilterChkBox','savedFilterlbl','filterCode', true);
		me.handleImportAdvDateChange(defaultDateIndex);
	},
	
	resetEntryDateAsDefault : function() {
		var me = this;
		me.dateFilterLabel = getDateIndexLabel(defaultDateIndex);
		me.dateFilterVal = defaultDateIndex;
		me.handleDateChange(me.dateFilterVal);
	},
	
	resetFieldInAdvAndQuickOnDelete : function(objData){
		var me = this,strFieldName;
		if(!Ext.isEmpty(objData))
			strFieldName = objData.paramName || objData.field;
		
		if(strFieldName === 'FileName'){
			$("input[type='text'][id='FileName']").val("");
		}
		else if(strFieldName === 'totalCrAmount'){
			$("input[type='text'][id='totalCrAmount']").val("");
		}else if(strFieldName === 'totalCrCount'){
			$("input[type='text'][id='totalCrCount']").val("");
		}else if(strFieldName === 'uploadStatus'){
			$('#uploadStatus').multiselect("checkAll");
			$('#uploadStatus').multiselect("refresh");
		}
		else if(strFieldName === 'importDateTime'){
			var datePickerRef = $('#importDateQuickPicker');
			me.dateFilterVal = '';
			me.getDateLabel().setText(getLabel('importDate','Import Date'));
			datePickerRef.val('');
			
			selectedImportDateInAdvFilter = {};
			me.datePickerSelectedDate = [];
			$("#importDateTime").val("");
			//$('label[for="EntryDateLabel"]').text(getLabel('importDate','Import Date'));
		}/*else if(strFieldName === 'clientCode'){
			if(isClientUser()){
			var clientComboBox = me.getPassThruFilterView()
						.down('combo[itemId="quickFilterClientCombo"]');
				me.clientFilterVal = 'all';
				selectedFilterClientDesc = "";
				selectedFilterClient = "";
				selectedClientDesc = "";
				clientComboBox.setValue(me.clientFilterVal);
			}
			else {
				var clientAuto = me.getPassThruFilterView().down('AutoCompleter[itemId=clientAuto]');
				clientAuto.setValue("");
				selectedFilterClientDesc = "";
				selectedFilterClient = "";
			}
		}*/
		if(screenType == 'ACH')
		{
			if(strFieldName === 'totalDrAmt'){
				$("input[type='text'][id='totalDrAmount']").val("");
			}
			else if(strFieldName === 'totalDrCount'){
				$("input[type='text'][id='totalDrCount']").val("");
			}
			else if(strFieldName === 'noOfCompany'){
				$("input[type='text'][id='noOfCompany']").val("");		
			}
					
		}
	},
	
	handleImportAdvDateChange : function(index) {
		var me = this;
		var dateToField;
		var objDateParams = me.getDateParam(index, null);

		if (!Ext.isEmpty(me.dateFilterLabel)) {
			$('label[for="importDateLabel"]').text(getLabel('importDate',
					'Import Date')
					+ " (" + me.dateFilterLabel + ")");
		}

		/*var vFromDate = Ext.util.Format.date(Ext.Date.parse(
						objDateParams.fieldValue1, 'Y-m-d'),
				strExtApplicationDateFormat);
		var vToDate = Ext.util.Format.date(Ext.Date.parse(
						objDateParams.fieldValue2, 'Y-m-d'),
				strExtApplicationDateFormat);*/
		var vFromDate = Ext.Date.parse(objDateParams.fieldValue1, 'Y-m-d');
		var vToDate = Ext.Date.parse(objDateParams.fieldValue2, 'Y-m-d');
		var filterOperator = objDateParams.operator;

		if (index == '13') {
			if (filterOperator == 'eq') {
				$('#importDateTime').setDateRangePickerValue(vFromDate);
			} else {
				$('#importDateTime')
						.setDateRangePickerValue([vFromDate, vToDate]);
			}
			
		} else {
			if (index === '1' || index === '2') {
				if (index === '12' && !Ext.isEmpty(filterDays) && filterDays !== '999') {
					$('#importDateTime').datepick('setDate', vToDate);
				} else {
					$('#importDateTime').datepick('setDate', vFromDate);
				}
			} else {
				$('#importDateTime').datepick('setDate', [vFromDate, vToDate]);
			}
			
		}
		if (filterOperator == 'eq')
            dateToField = "";
        else
            dateToField = vToDate;
		
		selectedImportDateInAdvFilter = {
                operator : filterOperator,
                fromDate : vFromDate,
                toDate : dateToField,
                dateLabel : me.dateFilterLabel,
                dropdownIndex : index
        };
	},
	removeFromQuickArrJson : function(arr, key){
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
	findInAdvFilterData : function(arr, key) { // Find array element which
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
	
	handleClientChangeInQuickFilter : function(isSessionClientFilter) {
		var me = this;
		 me.clientFilterVal = selectedFilterClient;			
		me.clientFilterDesc = selectedFilterClientDesc;// combo.getRawValue();
		quickFilterClientValSelected = me.clientFilterVal;
		quickFilterClientDescSelected = me.clientFilterDesc;
		me.filterApplied = 'Q';
		me.setDataForFilter();
		if (me.clientFilterVal === 'all') {
			me.filterApplied = 'ALL';
			me.refreshData();

		} else {
		
			me.applyQuickFilter();
		}
	},
	handleClearSettings : function() {
		var me = this;
		/*var clientComboBox = me.getPassThruFilterView().down('combo[itemId="quickFilterClientCombo"]');
		me.clientFilterVal = 'all';
		clientComboBox.setValue(me.clientFilterVal);*/
		me.resetSavedFilterCombo();
		var objGroupView = me.getGroupView();
		if(isClientUser()){
			var clientComboBox = me.getPassThruFilterView()
					.down('combo[itemId="quickFilterClientCombo"]');
			me.clientFilterVal = 'all';
			selectedFilterClientDesc = "";
			selectedFilterClient = "";
			selectedClientDesc = "";
			//clientComboBox.setValue(me.clientFilterVal);
		}
		me.dateFilterVal = defaultDateIndex;
		me.dateFilterLabel = getDateIndexLabel(defaultDateIndex);
		me.handleDateChange(me.dateFilterVal);
		me.advFilterData= {};
		me.filterApplied = 'Q';
		if (objGroupView)
		{
		    objGroupView.toggleFilterIcon(false);
		    objGroupView.setFilterToolTip('');
		}		
		me.filterData=[];
		me.resetAllFields();
		me.setDataForFilter();
		objGroupView.refreshData();
				
	},
	
	resetSavedFilterCombo : function() {
		var me = this;
		me.savedFilterVal='';
		var savedFilterComboBox = me.getFilterView()
				.down('combo[itemId="savedFiltersCombo"]');
		if (!Ext.isEmpty(savedFilterComboBox))
			savedFilterComboBox.setValue(me.savedFilterVal);
		$("#msSavedFilter").val("");
		$("#msSavedFilter").multiselect("refresh");
		$("#saveFilterChkBox").attr('checked', false);
		markAdvFilterNameMandatory('saveFilterChkBox','savedFilterlbl','filterCode', true);
	},
	
	disablePreferencesButton: function(btnId,boolVal){
		$("#"+btnId).attr("disabled",boolVal);
		if(boolVal)
			$("#"+btnId).css("color",'grey');
		else
			$("#"+btnId).css("color",'#FFF');
	},
	refreshGrid  : function(grid, store) {
		var me= this;
		if (null != grid) {
			var records = grid.getStore().data.items;
			for (var i = 0; i < records.length; i++) {
				if ("Loading" === records[i].data.status) {
					intervalFlag = true;
				}
			}
		}
		
		if( countr < refreshCount && intervalFlag && refreshIntervalTime)
		{
			intervalFlag = false;
			countr++;
			setTimeout( function()
			{
				me.refreshData();
			}, refreshIntervalTime * 1000 );
		}
	},
	disableActions : function(canDisable) {
		if (canDisable)
			$('.canDisable').addClass('button-grey-effect');
		else
			$('.canDisable').removeClass('button-grey-effect');
	},
	assignSavedFilter: function(){
		 var me= this,savedFilterCode='';
	        me.resetAllFields();
	        if (objPassThruPref || objSaveLocalStoragePref) {
	            objJsonData = Ext.decode(objPassThruPref);
	            objLocalJsonData = Ext.decode(objSaveLocalStoragePref); 
	            if (!Ext.isEmpty(objLocalJsonData.d.preferences) 
	                    && (!Ext.isEmpty(objLocalJsonData.d.preferences.tempPref)) && allowLocalPreference === 'Y') {
	                    if(!Ext.isEmpty(objLocalJsonData.d.preferences.tempPref.advFilterCode)){
	                        savedFilterCode = objLocalJsonData.d.preferences.tempPref.advFilterCode;
	                        me.savedFilterVal = objLocalJsonData.d.preferences.tempPref.advFilterCode;
	                    }
	                    if(!Ext.isEmpty(objLocalJsonData.d.preferences.tempPref.advFilterJson)){
	                        me.populateSavedFilter(savedFilterCode,objLocalJsonData.d.preferences.tempPref.advFilterJson,false);
	                    }
	            } else if (!Ext.isEmpty(objJsonData.d.preferences)){
	                if (!Ext.isEmpty(objJsonData.d.preferences.GeneralSetting)) {
	                    if (!Ext.isEmpty(objJsonData.d.preferences.GeneralSetting.defaultFilterCode)) {
	                        var advData = objJsonData.d.preferences.GeneralSetting.defaultFilterCode;
	                        if (advData === me.getFilterView().down('combo[itemId="savedFiltersCombo"]').getValue()) {
	                            $("#msSavedFilter option[value='" + advData + "']").attr("selected", true);
	                            $("#msSavedFilter").multiselect("refresh");
	                            me.savedFilterVal = advData;
	                            me.handleSavedFilterClick();
	                        }
	                    }
	                }
	            }
	        }
		},
		/* State handling at local storage starts */
	    handleSaveLocalStorage : function(){
	        var me = this, arrSaveData = [], objSaveState = {}, objAdvJson = {};
	        var objGroupView = me.getGroupView(), grid = objGroupView.getGrid(), subGroupInfo = null;
	        if (objGroupView)
	            subGroupInfo = objGroupView.getSubGroupInfo();
	        if(!Ext.isEmpty(me.savedFilterVal))
	            objSaveState['advFilterCode'] = me.savedFilterVal;
	        if(!Ext.isEmpty(me.advFilterData)){
	            objAdvJson['filterBy'] = me.advFilterData;
	            objSaveState['advFilterJson'] = objAdvJson;
	        }
	        objSaveState['filterAppliedType'] = me.filterApplied;
	        objSaveState['quickFilter'] = !Ext.isEmpty(me.filterData) ? me.filterData : {};
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
	    saveLocalPref : function(objSaveState){
	        var me = this, args = {},strLocalPrefPageName = me.strPageName+'_TempPref';
	        if (!Ext.isEmpty(objSaveState)) {
	            args['tempPref'] = objSaveState;
	            me.preferenceHandler.savePagePreferences(strLocalPrefPageName, objSaveState,
	                    me.postHandleSaveLocalPref, args, me, false);
	        }
	    },
	    postHandleSaveLocalPref : function(data, args, isSuccess) {
	        var me = this,strLocalPrefPageName = me.strPageName+'_TempPref';
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
	            if(args && args.tempPref){
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
	    handleClearLocalPrefernces : function(){
	        var me = this,args = {},strLocalPrefPageName = me.strPageName+'_TempPref';;
	        
	        me.preferenceHandler.clearPagePreferences(strLocalPrefPageName, null,
	                me.postHandleClearLocalPreference, args, me, false);
	    },
	    postHandleClearLocalPreference : function(data, args, isSuccess){
	        var me = this, args = {},strLocalPrefPageName = me.strPageName+'_TempPref';
	        if (isSuccess === 'N') {
	            Ext.MessageBox.show({
	                title : getLabel('instrumentErrorPopUpTitle', 'Error'),
	                msg : getLabel('localerrorMsg', 'Error while clear local setting'),
	                buttons : Ext.MessageBox.OK,
	                cls : 't7-popup',
	                icon : Ext.MessageBox.ERROR
	            });
	        }
	        else if(isSuccess === 'Y') {
	            objSaveLocalStoragePref = '';
	            me.objLocalData = '';
	        }
	    },
	    /* State handling at local storage End */
	    applyPreferences : function() {
	        var me = this, objJsonData = '', objLocalJsonData = '', savedFilterCode = '';
	        if (objPassThruPref || objSaveLocalStoragePref) {
	            objJsonData = Ext.decode(objPassThruPref);
	            objLocalJsonData = Ext.decode(objSaveLocalStoragePref);
	            if (!Ext.isEmpty(objLocalJsonData.d.preferences) && (!Ext.isEmpty(objLocalJsonData.d.preferences.tempPref)) && allowLocalPreference === 'Y') {
	                if (!Ext.isEmpty(objLocalJsonData.d.preferences.tempPref.advFilterCode)) {
	                    //if (isFilterCodeExist(objLocalJsonData.d.preferences.tempPref.advFilterCode,$('#msSavedFilter')[0])) {
	                        savedFilterCode = objLocalJsonData.d.preferences.tempPref.advFilterCode;
	                        me.savedFilterVal = objLocalJsonData.d.preferences.tempPref.advFilterCode;
	                    //}
	                }
	                if (!Ext.isEmpty(objLocalJsonData.d.preferences.tempPref.advFilterJson)) {
	                    me.populateSavedFilter(savedFilterCode, objLocalJsonData.d.preferences.tempPref.advFilterJson,true);
	                    var entryDateLableVal = $('label[for="dateLabel"]').text();
	                    var entryDateField = $("#importDateTime");
	                    me.handleImportDateSync('A', entryDateLableVal, null, entryDateField);
	                }
	            }
	            else
	                me.applySavedDefaultPreference(objJsonData);
	        }
	    },
	    applySavedDefaultPreference : function(objJsonData){
	        var me = this;
	        if (!Ext.isEmpty(objJsonData.d.preferences)) {
	            if (!Ext.isEmpty(objJsonData.d.preferences.GeneralSetting) && !Ext.isEmpty(objJsonData.d.preferences.GeneralSetting.defaultFilterCode)) {
	                me.doHandleSavedFilterItemClick(objJsonData.d.preferences.GeneralSetting.defaultFilterCode);
	                me.savedFilterVal = objJsonData.d.preferences.GeneralSetting.defaultFilterCode;
	            }
	        }
	    },
});