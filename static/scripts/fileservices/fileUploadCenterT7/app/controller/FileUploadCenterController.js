Ext.define('GCP.controller.FileUploadCenterController', {
	extend : 'Ext.app.Controller',
	requires : ['Ext.ux.gcp.DateHandler'],
	views : ['Ext.ux.gcp.PreferencesHandler',
			'GCP.view.FileUploadCenterFilterView', 'Ext.ux.gcp.AutoCompleter'],
	/**
	 * Array of configs to build up references to views on page.
	 */
	refs : [{
				ref : 'fileUploadCenterView',
				selector : 'fileUploadCenterView'
			}, {
				ref : 'groupView',
				selector : 'fileUploadCenterView groupView'
			}, {
				ref : 'filterView',
				selector : 'filterView'
			}, {
				ref : 'fileUploadCenterFilterView',
				selector : 'fileUploadCenterFilterView'
			}, {
				ref : 'importDatePicker',
				selector : 'fileUploadCenterView groupView container[itemId="importDateContainer"] panel[itemId="importDatePanel"] button[itemId="importDatePicker"]'
			}, {
				ref : 'importDateLabel',
				selector : 'fileUploadCenterFilterView label[itemId="importDateLabel"]'
			}, {
				ref : 'savedFiltersCombo',
				selector : 'fileUploadCenterFilterView combo[itemId="savedFiltersCombo"]'
			}, {
				ref : 'filterSellerPanel',
				selector : 'fileUploadCenterFilterView container[itemId="filterSellerCnt"]'
			}, {
				ref : 'filterClientPanel',
				selector : 'fileUploadCenterFilterView container[itemId="filterClientAutoCmplterCnt"]'
			}

	],
	config : {
		filterData : [],
		advFilterData : [],
		datePickerSelectedDate : [],
		typeFilterVal : 'All',
		filterApplied : 'ALL',
		showAdvFilterCode : null,
		savedFilterVal : '',
		filterCodeValue : null,
		actionFilterVal : 'all',
		actionFilterDesc : 'all',
		typeFilterDesc : 'All',
		dateFilterVal :  defaultDateIndex,
		dateFilterFromVal : '',
		dateFilterToVal : '',
		reportGridOrder : null,
		dateFilterLabel : getDateIndexLabel(defaultDateIndex),
		gridInfoDateFilterLabel : getDateIndexLabel(defaultDateIndex),
		dateHandler : null,
		// commonPrefUrl : 'services/userpreferences/fileUpload.json',
		urlGridFilterPref : 'services/userpreferences/fileUploadCenter.json',
		strModifySavedFilterUrl : 'services/userfilters/fileUploadCenter/{0}.json',
		strRemoveSavedFilterUrl : 'services/userfilters/fileUploadCenter/{0}/remove.json',
		strCommonPrefUrl : 'services/userpreferences/fileUploadCenter.json',
		strGetModulePrefUrl : 'services/userpreferences/fileUploadCenter/{0}.json',
		strBatchActionUrl : 'services/templatesbatch/{0}.json',
		strAdvFilterUrl : 'services/userpreferences/fileUploadCenter/groupViewAdvanceFilter.json',
		objUploadFilePopup : null,
		objAdvFilterPopup : null,
		sellerVal : null,
		sellerFilterVal : 'all',
		clientFilterVal : 'all',
		clientFilterDesc : null,
		strPageName : 'fileUploadCenter',
		strLocalStorageKey : 'file_upload_center',
		objLocalData : null,
		initialSmartGridRender : true,
		entityType : entityType == 1 ? 'CLIENT' : 'BANK',
		importDateFilterLabel : getDateIndexLabel(defaultDateIndex),
		importDateFilterVal : defaultDateIndex,
		savePrefAdvFilterCode : null
	},
	/**
	 * A template method that is called when your application boots. It is
	 * called before the Application's launch function is executed so gives a
	 * hook point to run any code before your Viewport is created.
	 */
	init : function() {
		var me = this;
		me.preferenceHandler = Ext.create('Ext.ux.gcp.PreferencesHandler');
		me.dateHandler = Ext.create('Ext.ux.gcp.DateHandler');
		me.updateFilterConfig();
		me.updateConfig();
		if (objSaveLocalStoragePref) {
            me.objLocalData = Ext.decode(objSaveLocalStoragePref);
            var filterType = me.objLocalData && me.objLocalData.d.preferences
                    && me.objLocalData.d.preferences.tempPref
                    && me.objLocalData.d.preferences.tempPref.filterAppliedType ? me.objLocalData.d.preferences.tempPref.filterAppliedType
                    : {};
            me.filterApplied = (!Ext.isEmpty(filterType)) ? filterType : 'ALL';
        }
		$(document).on('performPageSettings', function(event) {
					me.showPageSettingPopup();
				});
		$(document).on('savePreference', function(event) {
					// me.toggleSavePrefrenceAction(false);
					me.handleSavePreferences();
				});
		$(document).on('clearPreference', function(event) {
					me.handleClearPreferences();
				});

		$(document).on('searchActionClicked', function() {
					me.searchActionClicked(me);
				});
		$(document).on('saveAndSearchActionClicked', function() {
					me.saveAndSearchActionClicked(me);
				});
		$(document).on('deleteFilterEvent', function(event, grid, rowIndex) {
					me.deleteFilterSet(grid, rowIndex);
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
				});
		$(document).on('refreshData', function() {
			me.refreshData();
		});
		$(document).on('setImportDateFilterLabel', function(event) {
					me.setImportDateFilterLabel(event);
				});
		$(document).on('filterDateChange',
				function(event, filterType, btn, opts) {

					if (filterType == "importDateQuickFilter") {
						me.handleImportDateChange(filterType, btn, opts);
					} else if (filterType === "importDate") {
						me.importDateAdvFilterChange(btn, opts);
					}
				});

		$(document).on("datePickPopupSelectedDate",
				function(event, filterType, dates) {
					if (filterType == "importDateAdv") {
						me.dateFilterVal = '13';
						me.dateFilterLabel = 'Date Range';
						me.datePickerSelectedDate = dates;
						me.handleImportAdvDateChange(me.dateFilterVal);
					}
				});

		$(document).on('performReportAction', function(event, actionName) {
					me.downloadReport(actionName);
				});

		$(document).on('handleClientChangeInQuickFilter',
				function(isSessionClientFilter) {
					me.handleClientChangeInQuickFilter(isSessionClientFilter);
				});
		$(document).on('deleteFilterEvent', function(event, filterCode) {
					me.deleteFilterSet(filterCode);
				});
		$(document).on('handleSavedFilterClick', function(event) {
					me.handleSavedFilterClick();
				});
		me.objUploadFilePopup = Ext.create('GCP.view.FileUploadPopUp', {
					parent : 'fileUploadCenterView',
					itemId : 'fileUploadPopupId'
				});
		me.control({
			'pageSettingPopUp' : {
				'applyPageSetting' : function(popup, data, strInvokedFrom) {
					me.applyPageSetting(data, strInvokedFrom);
				},
				'savePageSetting' : function(popup, data, strInvokedFrom) {
					me.savePageSetting(data, strInvokedFrom);
				},
				'restorePageSetting' : function(popup, data, strInvokedFrom) {
					me.restorePageSetting(data, strInvokedFrom);
				}
			},
			'groupView smartgrid' : {
				'cellclick' : me.doHandleCellClick
			},
			'filterView' : {
				appliedFilterDelete : function(btn) {
					me.resetSavedFilterCombo();
					me.handleAppliedFilterDelete(btn);
				},
				/* : function(tbar, opts) {
					me.getFileUploadCenterFilterView().down('combo[itemId="savedFiltersCombo"]').setValue(me.savedFilterVal);
					me.handleDateChange(me.dateFilterVal);
				},*/
				beforerender : function() {
					var useSettingsButton = me.getFilterView().down('button[itemId="useSettingsbutton"]');
					if (!Ext.isEmpty(useSettingsButton)) {
						useSettingsButton.hide();
					}
				}
			},
			'filterView menu[itemId="importDateMenu"]' : {
				'click' : function(menu, item, e, eOpts) {
					me.dateFilterVal = item.btnValue;
					me.dateFilterLabel = item.text;
					me.handleDateChange(item.btnValue);
					me.resetSavedFilterCombo();
					me.filterApplied = 'Q';
					me.setDataForFilter();
					me.applyQuickFilter();
					// me.toggleSavePrefrenceAction(true);
				}
			},
			'filterView component[itemId="importDatePicker"]' : {
				render : function() {
					$('#importDateQuickPicker').datepick({
								monthsToShow : 1,
								changeMonth : true,
								changeYear : true,
								dateFormat : strApplicationDefaultFormat,
								rangeSeparator : '  '+getLabel('to','to')+'  ',
								onClose : function(dates) {
									if (!Ext.isEmpty(dates)) {
										me.datePickerSelectedDate = dates;
										me.datePickerSelectedEntryDate = dates;
										me.dateFilterVal = '13';
										me.dateFilterLabel = 'Date Range';
										me.handleDateChange('13');
										me.resetSavedFilterCombo();
										me.filterApplied='Q';
										me.setDataForFilter();
										me.applyQuickFilter();
										// me.toggleSavePrefrenceAction(true);
									}
								}

							});
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
			'fileUploadCenterFilterView' : {
				handleSavedFilterItemClick : function(comboValue, comboDesc) {
					me.savedFilterVal = comboValue;
					me.doHandleSavedFilterItemClick(comboValue);
					
				},
				/*
				 * handleClientChangeInQuickFilter : function(combo) {
				 * me.handleClientChangeInQuickFilter(combo); },
				 */

				afterrender : function(panel, eOpts) {
					me.updateFilterFields();
					if (entityType == 1) {
						me.filterEntityType('CLIENT');
					}
				},
				'filterEntityType' : function(entityType) {
					me.filterEntityType(entityType);
				},
				'filterSeller' : function(seller) {
					me.sellerFilterVal = seller;
					me.filterApplied = 'Q';
					me.resetSavedFilterCombo();
					me.setDataForFilter();
					me.applyQuickFilter();
				},
				'filterClient' : function(clientCode, clientDesc) {
					me.clientFilterVal = clientCode;
					me.clientFilterDesc = clientDesc;
					me.resetSavedFilterCombo();
					me.filterApplied = 'Q';
					me.setDataForFilter();
					me.applyQuickFilter();
				}
			},
			'fileUploadCenterView groupView' : {
				'groupByChange' : function(menu, groupInfo) {
					// me.doHandleGroupByChange(menu, groupInfo);
				},
				'groupTabChange' : function(groupInfo, subGroupInfo, tabPanel,
						newCard, oldCard) {
					me.disablePreferencesButton("savePrefMenuBtn", false);
					me.disablePreferencesButton("clearPrefMenuBtn", false);
					// me.toggleSavePrefrenceAction(true);
					me.doHandleGroupTabChange(groupInfo, subGroupInfo,
							tabPanel, newCard, oldCard);
				},
				'gridRender' : me.doHandleLoadGridData,
				'gridPageChange' : me.doHandleLoadGridData,
				'gridSortChange' : me.doHandleLoadGridData,
				'gridPageSizeChange' : me.doHandleLoadGridData,
				'gridColumnFilterChange' : me.doHandleLoadGridData,
				'gridStateChange' : function(grid) {
					// me.toggleSavePrefrenceAction(true);
					me.disablePreferencesButton("savePrefMenuBtn", false);
					me.disablePreferencesButton("clearPrefMenuBtn", false);
				},
				'gridRowActionClick' : function(grid, rowIndex, columnIndex,
						actionName, record) {
					me.handleRowIconClick(actionName, grid, record);
				},
				'groupActionClick' : function(actionName, isGroupAction,
						maskPosition, grid, arrSelectedRecords) {
					if (isGroupAction === true)
						me.doHandleGroupActions(actionName, grid,
								arrSelectedRecords, 'groupAction');
				},
				'gridStoreLoad' : function(grid, store) {
					me.disableActions(false);
					me.refreshGrid(grid);
				},
				'render' : function() {
					populateAdvancedFilterFieldValue();
					me.firstTime = true;
					me.applyPreferences();
				}				
			},
			'fileUploadCenterFilterView  combo[itemId="quickFilterClientCombo"]' : {
				'afterrender' : function(combo, newValue, oldValue, eOpts) {
					if (!Ext.isEmpty(me.clientFilterVal)) {
						combo.setValue(me.clientFilterVal);
					}
				}
			},
			'fileUploadCenterFilterView combo[itemId="savedFiltersCombo"]' : {
				'afterrender' : function(combo, newValue, oldValue, eOpts) {
					if (!Ext.isEmpty(me.savedFilterVal)) {
						combo.setValue(me.savedFilterVal);
					}
				}
			},
			'fileUploadCenterView groupView smartgrid' : {
				'afterrender' : function() {
					var isShowClientCol = me.entityType == 'BANK'
							? false
							: true;
					// me.hideShowClientColumn(isShowClientCol);
				}
			}
		});

	},
	updateFilterFields : function() {
		var me = this;
		var clientCodesFltId;
		var fileUploadCenterFilterView = me.getFileUploadCenterFilterView();
		var selectedFilter = me.getFileUploadCenterFilterView().down('combo[itemId="savedFiltersCombo"]');
		selectedFilter.setValue(me.savedFilterVal);
		me.handleDateChange(me.dateFilterVal);
	},
	filterEntityType : function(strEntityType) {
		var me = this;
		me.entityType = strEntityType;
		var filterView = me.getFileUploadCenterFilterView();
		me.resetSavedFilterCombo();
		me.filterApplied = 'Q';
		me.setDataForFilter();
		me.applyQuickFilter();
	},
	hideSellerPanel : function() {
		var me = this;
		var sellerFilterPanel = me.getFilterSellerPanel();
		if (!Ext.isEmpty(sellerFilterPanel)) {
			sellerFilterPanel.hide();
		}
	},
	showSellerpanel : function() {
		var me = this;
		var sellerFilterPanel = me.getFilterSellerPanel();
		if (!Ext.isEmpty(sellerFilterPanel)) {
			sellerFilterPanel.show();
		}
	},
	hideClientPanel : function() {
		var me = this;
		var clientFilterPanel = me.getFilterClientPanel();
		if (!Ext.isEmpty(clientFilterPanel)) {
			clientFilterPanel.hide();
		}
	},
	showClientpanel : function() {
		var me = this;
		var clientFilterPanel = me.getFilterClientPanel();
		if (!Ext.isEmpty(clientFilterPanel)) {
			clientFilterPanel.show();
		}
	},

	/* Page setting handling starts here */
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
	savePageSetting : function(arrPref, strInvokedFrom) {
		/* This will be get invoked from page level setting always */
		var me = this, args = {};
		if (!Ext.isEmpty(arrPref)) {
			me.preferenceHandler.savePagePreferences(me.strPageName, arrPref,
					me.postHandleSavePageSetting, args, me, false);
		}
	},
	postHandleSavePageSetting : function(data, args, isSuccess) {
		if (isSuccess === 'N') {
			Ext.MessageBox.show({
				title : getLabel('instrumentErrorPopUpTitle', 'Error'),
				msg : getLabel('errorMsg', 'Error while apply/restore setting'),
				buttons : Ext.MessageBox.OK,
				buttonText: {
		            ok: getLabel('btnOk', 'OK')
					} ,
				cls : 't7-popup',
				icon : Ext.MessageBox.ERROR
			});
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
        } else{
            me.handleClearLocalPrefernces();
            me.preferenceHandler.clearPagePreferences(me.strPageName, arrPref,
                    me.postHandleRestorePageSetting, null, me, false);
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
            } else{
                me.doDeleteLocalState();
                window.location.reload();
            }
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
	postHandlePageGridSetting : function(data, args, isSuccess) {
		if (isSuccess === 'Y') {
			window.location.reload();
		} else {
			Ext.MessageBox.show({
				title : getLabel('instrumentErrorPopUpTitle', 'Error'),
				msg : getLabel('errorMsg', 'Error while apply/restore setting'),
				buttons : Ext.MessageBox.OK,
				buttonText: {
		            ok: getLabel('btnOk', 'OK')
					} ,
				cls : 't7-popup',
				icon : Ext.MessageBox.ERROR
			});
		}
	},
	showPageSettingPopup : function() {
		var me = this, objData = {}, objGroupView = me.getGroupView(), objPrefData, objGeneralSetting, objGridSetting, objColumnSetting;
		var objGroupByVal = '', objDefaultFilterVal = '', objGridSizeVal = '', objRowPerPageVal = _GridSizeMaster;

		me.pageSettingPopup = null;

		if (!Ext.isEmpty(objFileUploadCenterPref)) {
			objPrefData = Ext.decode(objFileUploadCenterPref);
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
					: (FILE_GENERIC_COLUMN_MODEL || '[]');

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
		objData["filterUrl"] = 'services/userfilterslist/' + me.strPageName;
		objData["rowPerPage"] = _AvailableGridSize;
		objData["groupByVal"] = objGroupByVal;
		objData["filterVal"] = objDefaultFilterVal;
		objData["gridSizeVal"] = objGridSizeVal;
		objData["rowPerPageVal"] = objRowPerPageVal;

		me.pageSettingPopup = Ext.create('Ext.ux.gcp.PageSettingPopUp', {
					cfgPopUpData : objData,
					cfgGroupView : objGroupView,
					cfgDefaultColumnModel : objColumnSetting
				});
		me.pageSettingPopup.show();
		me.pageSettingPopup.center();
	},
	/* Page setting handling ends here */
	handleClientChangeInQuickFilter : function(isSessionClientFilter) {
		var me = this;
		if (isSessionClientFilter)
			me.clientFilterVal = selectedFilterClient;
		else
			me.clientFilterVal = isEmpty(selectedClient)
					? 'all'
					: selectedClient;
		me.clientFilterDesc = selectedFilterClientDesc;
		me.filterApplied = 'Q';
		me.setDataForFilter();
		if (me.clientFilterVal == 'all') {
			me.showAdvFilterCode = null;
			me.filterApplied = 'ALL';
			me.refreshData();
		} else {
			me.applySeekFilter();
		}
	},
	handleImportAdvDateChange : function(index) {
		var me = this;
		var dateToField;
		var objDateParams = me.getDateParam(index, 'importDate');
		var datePickerRef = $('#importDateAdvFilter');
		if (!Ext.isEmpty(me.dateFilterLabel)) {
			$('label[for="ImportDateLabel"]').text(getLabel('importDate','Import Date')+ " (" + me.dateFilterLabel + ")");
		}
		var vFromDate = $.datepick.formatDate(strApplicationDefaultFormat, $.datepick.parseDate('yy-mm-dd', objDateParams.fieldValue1));;
		var vToDate = $.datepick.formatDate(strApplicationDefaultFormat, $.datepick.parseDate('yy-mm-dd', objDateParams.fieldValue2));
		var filterOperator = objDateParams.operator;

		if (index == '13') {
			if (filterOperator == 'eq') {
				datePickerRef.datepick('setDate',vFromDate);
			} else {
				datePickerRef.datepick('setDate',[vFromDate, vToDate]);
			}
		}else {
			if (index === '1' || index === '2') {									
				datePickerRef.datepick('setDate',vFromDate);				
			} else {
				datePickerRef.datepick('setDate',[vFromDate, vToDate]);
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
            importDateLabel :  objDateParams.label
        };
	},
	handleImportDateChange : function(filterType, btn, opts) {
		var me = this;
		if (filterType == "importDateQuickFilter") {
			me.dateFilterVal = btn.btnValue;
			me.dateFilterLabel = btn.text;
			me.handleDateChange(btn.btnValue);
			me.importDateAdvFilterChange(btn, opts);
	        me.resetSavedFilterCombo();
			me.filterApplied = 'Q';
			me.setDataForFilter();
			me.applyQuickFilter();
			advancedFilterFieldsDataAdded = true;
		}
	},
	handleClearSettings : function() {
		var me = this;
		var datePickerRef = $('#importDateQuickPicker');
		var savedFilterComboBox = me.getFileUploadCenterFilterView().down('combo[itemId="savedFiltersCombo"]');
		savedFilterComboBox.clearValue();
		var clientComboBox = me.getFileUploadCenterFilterView().down('combo[itemId="clientCombo"]');
		clientComboBox.setValue('all');
		me.resetSavedFilterCombo();
		me.dateFilterVal = defaultDateIndex;
		me.dateFilterLabel = getDateIndexLabel(defaultDateIndex);
		me.handleDateChange(me.dateFilterVal);		
		me.getImportDateLabel().setText(getLabel('importDate','Import Date')+ " (" + me.dateFilterLabel + ")");		
		/*datePickerRef.val('');*/
		me.filterApplied = 'Q';
		me.resetAllFields();
		me.advFilterData=[];
		me.clientFilterVal = 'all';
		me.setDataForFilter();
		me.refreshData();

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
			grid.removeAppliedSort();
			if (!Ext.isEmpty(me.advSortByData)) {
                var appliedSortByJson = me.getSortByJsonForSmartGrid();
                grid.applySort(appliedSortByJson);
            }
		}
		objGroupView.refreshData();
	},
	creationDateChange : function(btn, opts) {
		var me = this;
		me.dateFilterVal = btn.btnValue;
		me.dateFilterLabel = btn.text;
		me.handleDateChange(btn.btnValue);
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
	doHandleGroupTabChange : function(groupInfo, subGroupInfo, tabPanel,
			newCard, oldCard) {
		var me = this;
		var objGroupView = me.getGroupView();
		var strModule = '', strUrl = null, args = null, strFilterCode = null;
		groupInfo = groupInfo || {};
		subGroupInfo = subGroupInfo || {};
		if (groupInfo/* && _charCaptureGridColumnSettingAt === 'L'*/) {
			if (groupInfo.groupTypeCode === 'FILECEN_OPT_ADVFILTER') {
				strFilterCode = subGroupInfo.groupCode;
				if (strFilterCode !== 'all') {
					if (!Ext.isEmpty(strFilterCode)) {
						me.savedFilterVal = strFilterCode;
						me.showAdvFilterCode = strFilterCode;
						me.doHandleSavedFilterItemClick(strFilterCode);
					}
					// me.toggleSavePrefrenceAction(true);
				} else {
					me.savedFilterVal = null;
					me.showAdvFilterCode = null;
					me.filterApplied = 'ALL';
					me.handleClearSettings();
					var gridModel = {
						showCheckBoxColumn : false
					};
					objGroupView.reconfigureGrid(gridModel);
				}
			} else {
				args = {
					scope : me
				};
				strModule = subGroupInfo.groupCode;
				strModule = strModule === 'all'? groupInfo.groupTypeCode+'-'+strModule : strModule;
				me.preferenceHandler.readModulePreferences(me.strPageName,strModule,me.postHandleDoHandleGroupTabChange,args,me,true);
		   }
		} else
            me.postHandleDoHandleGroupTabChange();
	},
	postHandleDoHandleGroupTabChange : function(data, args) {
		 var me = args ? args.scope : this;
	     me.handleReconfigureGrid(data);
	},
	handleReconfigureGrid : function(data) {
	        var me = this;
	        var objGroupView = me.getGroupView();
	        var objSummaryView = me.getFileUploadCenterView(), gridModel = null, objData = null;
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
	doHandleLoadGridData : function(groupInfo, subGroupInfo, grid, url, pgSize,
			newPgNo, oldPgNo, sorter, filterData) {
		var me = this;
		var arrOfParseQuickFilter = [], arrOfParseAdvFilter = [], arrOfFilteredApplied = [];
		var objGroupView = me.getGroupView();
		var buttonMask = me.strDefaultMask;
		if (!$('#actionResultDiv').hasClass('ui-helper-hidden')) {
			$('#actionResultDiv').addClass('ui-helper-hidden');
			if ($('#actionResultInfoDiv').children('.row').length > 0) {
				$('#actionResultInfoDiv').children('.row').remove();
			}
		}
		objGroupView.handleGroupActionsVisibility(buttonMask);
		var strUrl = grid.generateUrl(url, pgSize, newPgNo, oldPgNo, sorter);
		me.disableActions(true);
		//saving local prefrences
        if(allowLocalPreference === 'Y')
            me.handleSaveLocalStorage();
		strUrl = strUrl + '&' + csrfTokenName + '=' + csrfTokenValue;
		strUrl = strUrl + '&' + '$entityType' + '=' + me.entityType;
		strUrl = strUrl + me.getFilterUrl(subGroupInfo, groupInfo);
		if (!Ext.isEmpty(me.filterData)) {
			if (!Ext.isEmpty(me.filterData) && me.filterData.length >= 1) {
				var quickJsonData = me.filterData;
				var reqJsonInQuick = me.findInQuickFilterData(quickJsonData,
						'Seller');
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
			arrOfFilteredApplied = arrOfParseQuickFilter.concat(arrOfParseAdvFilter);
			if (arrOfFilteredApplied)
				me.getFilterView().updateFilterInfo(arrOfFilteredApplied);
		}
		me.reportGridOrder = strUrl;
		grid.loadGridData(strUrl, null, null, false);
		grid.on('itemdblclick', function(dataView, record, item, rowIndex,eventObj) {
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
			me.handleRowIconClick(arrVisibleActions[0].itemId, grid, record);
		}
	},
	handleRowIconClick : function(actionName, grid, record) {
		var me = this;
		if (actionName === 'btnViewError' || actionName === 'btnViewRepair') {
			// FTGCPBDB-4831 Redirect to Payment center is not available in
			// other module .hence to maintain the consistency the change has
			// been done and remeoved from Payment
			me.showErrorReport(record);
		} else if (actionName === 'btnViewOk') {
			if (!record.get('isEmpty')) {
				if (Ext.isEmpty(record.raw.phdRecordKeyNo)) {
					if (!Ext.isEmpty(me.getPhdRecordKey(record))){					
						record.raw.phdRecordKeyNo = me.getPhdRecordKey(record);
					}
					// me.viewPaymentRejectRepair(record); commented for the
					// JIRA FTMNTBANK-1748
				}
				if (!Ext.isEmpty(record.raw.phdRecordKeyNo))	
					me.viewInPaymentSummary(record);
			}
		}
	},
	viewInPaymentSummary : function(record) {
		var me = this;
		var strUrl = 'paymentSummary.form', filter = '', filterDetail = '', arrFilterJson = [];
		if (!Ext.isEmpty(record.get('ahtskSrc')))
			filter = filter + "FileName lk '" + encodeURIComponent(Ext.util.Format.htmlDecode(record.get('ahtskSrc'))) + "'";
		if (!Ext.isEmpty(filterDetail)) // To pass detail level filter parameters (if any)
			filter = filter + '&$filterDetail=' + filterDetail;
		form = document.createElement('FORM');
		form.name = 'frmMain';
		form.id = 'frmMain';
		form.method = 'POST';
		form.appendChild(me.createFormField('INPUT', 'HIDDEN', csrfTokenName,csrfTokenValue));
		form.appendChild(me.createFormField('INPUT', 'HIDDEN', 'txtIdentifier',record.get('paymentIdentifier')));
		form.appendChild(me.createFormField('INPUT', 'HIDDEN', 'txtProduct',record.get('phdProduct')));
		form.appendChild(me.createFormField('INPUT', 'HIDDEN','txtPaymentType', 'BB'));
		form.appendChild(me.createFormField('INPUT', 'HIDDEN', 'txtPhdNumber',record.get('phdNumber')));
		form.appendChild(me.createFormField('INPUT', 'HIDDEN', 'filterUrl',filter));
		form.appendChild(me.createFormField('INPUT', 'HIDDEN', 'filterJson',JSON.stringify(arrFilterJson)));
		form.action = strUrl;
		document.body.appendChild(form);
		setNavigationCookie(strUrl);
		form.submit();
		document.body.removeChild(form);
	},
	viewPaymentRejectRepair : function(record) {
		var me = this;
		var strUrl = 'editMultiPayment.form';
		form = document.createElement('FORM');
		form.name = 'frmMain';
		form.id = 'frmMain';
		form.method = 'POST';
		form.appendChild(me.createFormField('INPUT', 'HIDDEN', csrfTokenName,csrfTokenValue));
		form.appendChild(me.createFormField('INPUT', 'HIDDEN', 'txtIdentifier',record.get('paymentIdentifier')));
		form.appendChild(me.createFormField('INPUT', 'HIDDEN', 'txtProduct',record.get('phdProduct')));
		form.appendChild(me.createFormField('INPUT', 'HIDDEN','txtPaymentType', 'BB'));
		form.appendChild(me.createFormField('INPUT', 'HIDDEN', 'txtPhdNumber',record.get('phdNumber')));
		form.action = strUrl;
		document.body.appendChild(form);
		form.submit();
		document.body.removeChild(form);
	},
	viewUploadedFile : function(record) {
		var me = this;
		form = document.createElement('FORM');
		form.name = 'frmMain';
		form.id = 'frmMain';
		form.method = 'POST';
		strUrl = "viewUploadedFile.srvc";
		form.appendChild(me.createFormField('INPUT', 'HIDDEN', 'recordKeyNo',record.get('recordKeyNo')));
		form.appendChild(me.createFormField('INPUT', 'HIDDEN', 'ahtskSrc',record.get('ahtskSrc')));
		form.appendChild(me.createFormField('INPUT', 'HIDDEN', 'ahtskdata',record.get('ahtskdata')));
		form.appendChild(me.createFormField('INPUT', 'HIDDEN', 'ahtskid',record.get('ahtskid')));
		form.appendChild(me.createFormField('INPUT', 'HIDDEN', csrfTokenName,csrfTokenValue));
		form.action = strUrl;
		document.body.appendChild(form);
		form.submit();
		document.body.removeChild(form);
	},
	showErrorReport : function(record) {
		// Ext.create('GCP.view.FileUploadErrorPopUp', {
		// record : record,
		// url : 'fileUploadCenterList/errorReport.srvc?' + csrfTokenName
		// + "=" + csrfTokenValue,
		// identifier : record.get("identifier"),
		// ahtskid : record.get("ahtskid")
		// }).show();
		// FTGCPBDB-2520
		var me = this;
		var strUrl = 'services/getFileUploadCenterList/getUploadErrorReport.pdf'
		form = document.createElement('FORM');
		form.name = 'frmMain';
		form.id = 'frmMain';
		form.method = 'POST';
		form.appendChild(me.createFormField('INPUT', 'HIDDEN',csrfTokenName, tokenValue));
		// form.appendChild( me.createFormField( 'INPUT', 'HIDDEN', 'taskid',
		// record.get("recordKeyNo") ) );
		form.appendChild(me.createFormField('INPUT', 'HIDDEN', 'taskid', record.get("ahtskdata")));
		form.appendChild(me.createFormField('INPUT', 'HIDDEN', 'client', record.get("ahtskclient")));
		form.action = strUrl;
		document.body.appendChild(form);
		form.submit();
		document.body.removeChild(form);
	},
	applyFilter : function() {
		var me = this;
		var objGroupView = me.getGroupView();
		var groupInfo = objGroupView.getGroupInfo();
		me.refreshData();
	},
	applyQuickFilter : function() {
		var me = this;
		var objGroupView = me.getGroupView();
		var groupInfo = objGroupView.getGroupInfo();
		me.filterApplied = 'Q';
		if (groupInfo && groupInfo.groupTypeCode === 'FILECEN_OPT_ADVFILTER') {
			objGroupView.setActiveTab('all');
		} else
			me.refreshData();
	},
	setDataForFilter : function(filterData) {
		var me = this;
        var arrQuickJson = {};
        me.advFilterData = {};
        me.filterData = me.getQuickFilterQueryJson();
        var objJson = (!Ext.isEmpty(filterData) ? filterData.filterBy : getAdvancedFilterQueryJson());
        var reqJson = me.findInAdvFilterData(objJson, "uploadDateFilter");
		if (!Ext.isEmpty(reqJson)) {
			arrQuickJson = me.filterData;
			arrQuickJson = me.removeFromQuickArrJson(arrQuickJson,"uploadDateFilter");
			me.filterData = arrQuickJson;
			//me.updateQuickFilterDate(reqJson);
		}
		me.advFilterData = objJson;
		var filterCode = $("input[type='text'][id='savedFilterAs']").val();
		me.advFilterCodeApplied = filterCode;
	},
	updateQuickFilterDate : function(jsonDate) {
		var me = this;
		var datePickerRef = $('#importDateQuickPicker');
		me.getImportDateLabel().setText(jsonDate.fieldLabel + '(' + jsonDate.dropdownLabel+')');
		var vFromDate = $.datepick.formatDate(strApplicationDefaultFormat, $.datepick.parseDate('yy-mm-dd', jsonDate.value1));
		var vToDate = $.datepick.formatDate(strApplicationDefaultFormat, $.datepick.parseDate('yy-mm-dd', jsonDate.value2));
		if (jsonDate.operator == 'eq') {
				datePickerRef.datepick('setDate', vFromDate);
		} else {
				datePickerRef.datepick('setDate', [vFromDate, vToDate]);
		}
	},
	updateAdvFilterDate : function(jsonDate) {
		var me = this;
		var datePickerRef = $('#importDateAdvFilter');
		$('label[for="ImportDateLabel"]').text(getLabel('importDate', 'Import Date') + '(' + jsonDate.dropdownLabel+')');
		var vFromDate = $.datepick.formatDate(strApplicationDefaultFormat, $.datepick.parseDate('yy-mm-dd', jsonDate.paramValue1));
		var vToDate = $.datepick.formatDate(strApplicationDefaultFormat, $.datepick.parseDate('yy-mm-dd', jsonDate.paramValue2));
		if (jsonDate.operator == 'eq') {
				datePickerRef.datepick('setDate', vFromDate);
		} else {
				datePickerRef.datepick('setDate', [vFromDate, vToDate]);
		}
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
	removeFromQuickArrJson : function(arr, key) {
		for (var ai, i = arr.length; i--;) {
			if ((ai = arr[i]) && ai.paramName == key) {
				arr.splice(i, 1);
			}
		}
		return arr;
	},
	getFilterUrl : function(subGroupInfo, groupInfo) {
		var me = this;
		var strQuickFilterUrl = '', strUrl = '', isFilterApplied = 'false', strAdvFilterUrl = '';
		var strGroupQuery = (subGroupInfo && subGroupInfo.groupQuery)
				? subGroupInfo.groupQuery
				: '';
		if (me.filterApplied === 'ALL') {
			strQuickFilterUrl = me.generateUrlWithQuickFilterParams(this);
			if (!Ext.isEmpty(strQuickFilterUrl)) {
				strUrl += '&$filter=' + strQuickFilterUrl;
				isFilterApplied = true;
			}

		} else {

			strQuickFilterUrl = me.generateUrlWithQuickFilterParams(this);
			if (!Ext.isEmpty(strQuickFilterUrl)) {
				strUrl += '&$filter=' + strQuickFilterUrl;
				isFilterApplied = true;
			}

			strAdvFilterUrl = me.generateUrlWithAdvancedFilterParams(me);

			if (!Ext.isEmpty(strAdvFilterUrl)) {
				if (Ext.isEmpty(strUrl)) {
					strUrl = "&$filter=" + strAdvFilterUrl;
				} else {
					strUrl = strUrl + ' and ' + strAdvFilterUrl;
				}
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
	generateUrlWithAdvancedFilterParams : function(me) {
		var thisClass = this;
		// var filterData = thisClass.filterData;
		var filterData = thisClass.advFilterData;
		var isFilterApplied = false;
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
						&& (operator === 'bt' || operator === 'eq'
								|| operator === 'lk' || operator === 'gt' || operator === 'lt' || operator === 'in'))
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
					case 'in':
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
									if(filterData[ index ].field == "status")
									{
										if( arrId[ count ] == "0.A" )
										{
											strTemp = strTemp + '(' +  filterData[ index ].field + ' eq  \'0\' )';
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
								strTemp = strTemp + ' )';
							}
						}
						break;
				}
			}
		}
		if (isFilterApplied) {
			strFilter = strFilter + strTemp;
		} else if (isOrderByApplied) {
			strFilter = strTemp;
		} else {
			strFilter = '';
		}
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
	getQuickFilterQueryJson : function() {
		var me = this;
		var typeFilterVal = me.typeFilterVal;
		var actionFilterVal = this.actionFilterVal;
		var sellerFilterVal = me.sellerFilterVal;
		var clientFilterVal = me.clientFilterVal;
		var clientComboBox = me.getFileUploadCenterFilterView()
				.down('combo[itemId="clientCombo"]');
		var selectedClientVal = clientComboBox.getValue();
		var selectedClientText = clientComboBox.getRawValue();
		var jsonArray = [];
		var index = me.dateFilterVal;
		var objDateParams = me.getDateParam(index);
		if (!Ext.isEmpty(index)) {
			jsonArray.push({
						paramName : 'uploadDateFilter',
						paramIsMandatory : true, 
						paramFieldLable : getLabel('importDate', 'Import Date'),
						paramIsMandatory : true,
						paramValue1 : objDateParams.fieldValue1,
						paramValue2 : objDateParams.fieldValue2,
						operatorValue : objDateParams.operator,
						dataType : 'D'
					});
		}
		if (me.typeFilterVal != null && me.typeFilterVal != 'All') {
			jsonArray.push({
						paramName : 'taskStatus',
						paramValue1 : encodeURIComponent(me.typeFilterVal.replace(new RegExp("'", 'g'), "\''")),
						operatorValue : 'eq',
						dataType : 'S'
					});
		}

		if (clientFilterVal != null && !Ext.isEmpty(clientFilterVal)
				&& clientFilterVal != 'all') {
			jsonArray.push({
						paramName : 'clientCode',
						operatorValue : 'eq',
						paramFieldLable : getLabel('lblcompany',
								'Company Name'),
						displayValue1 : selectedClientText,
						paramValue1 : encodeURIComponent(clientFilterVal.replace(new RegExp("'", 'g'), "\''")),
						displayType : 5,
						dataType : 'S'
					});
		}
		return jsonArray;
	},
	enableValidActionsForGrid : function(grid, record, recordIndex,
			selectedRecords, jsonData) {
		var me = this;
		var buttonMask = '000';
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
		actionMask = doAndOperation(maskArray, 3);
	},
	isRowIconVisible : function(store, record, jsonData, itmId, maskPosition) {
		var maskSize = 3;
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
				if (entityType === '1' && cfgCol.colId !== 'ahtskclient') {
					arrCols.push(cfgCol);
				} else if (entityType === '0') {
					arrCols.push(cfgCol);
				}

			}
		}
		return arrCols;
	},
	columnRenderer : function(value, meta, record, rowIndex, colIndex, store,
			view, colId) {
		var me = this;
		var strRetValue = "";
		strRetValue = value;
		return strRetValue;
	},
	createActionColumn : function() {
		var me = this;
		var objActionCol = {
			colType : 'action',
			colId : 'action',
			width : 32,
			align : 'right',
			locked : true,
			items : [{
						itemId : 'btnViewError',
						itemCls : 'icon_deleted',
						toolTip : getLabel('viewReportToolTip', 'View Report'),
						maskPosition : 1
					}, {
						itemId : 'btnViewRepair',
						itemCls : 'icon_repair',
						toolTip : getLabel('viewReportToolTip', 'View Report'),
						maskPosition : 2
					}, {
						itemId : 'btnViewOk',
						itemCls : 'icon_completed',
						toolTip : getLabel('completeToolTip', 'Completed'),
						maskPosition : 3
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
			target : 'imgFilterInfoGridView',
			listeners : {
				// Change content dynamically depending on which element
				// triggered the show.
				beforeshow : function(tip) {
					var fileUploadCenterFilterView = me
							.getFileUploadCenterFilterView();
					var client;
					var clientCombo = fileUploadCenterFilterView
							.down('combobox[itemId="clientCodeId"]');
					var paymentTypeVal = '';
					var paymentActionVal = '';
					var dateFilter = me.dateFilterLabel;
					if (!Ext.isEmpty(clientCombo)
							&& !Ext.isEmpty(clientCombo.getValue())) {
						client = clientCombo.rawValue;
					} else {
						client = getLabel('none', 'None');
					}
					if (me.typeFilterVal == 'all' && me.filterApplied == 'ALL') {
						paymentTypeVal = 'All';
						me.showAdvFilterCode = null;
					} else {
						paymentTypeVal = me.paymentTypeFilterDesc;
					}

					if (me.paymentActionFilterVal == 'all') {
						paymentActionVal = 'All';
					} else {
						paymentActionVal = me.paymentActionFilterDesc;
					}
					if (entityType == 0) {
						tip.update(getLabel("clientName", "Company Name")
								+ ' : ' + client + '<br/>'
								+ getLabel('date', 'Date') + ':' + dateFilter
								+ '<br/>' + 'Type : ' + me.typeFilterVal
								+ '<br/>');
					} else {
						if (me.clientFilterDesc == ""
								|| me.clientFilterDesc == null)
							client = 'All Companies';
						else
							client = me.clientFilterDesc;
						tip.update(getLabel("clientName", "Company Name")
								+ " : " + client + '<br>' + 'Date : '
								+ dateFilter + '<br/>' + 'Type : '
								+ me.typeFilterVal + '<br/>');
					}
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
			me.getImportDateLabel().setText(getLabel('importDate','Import Date')+ " (" + me.dateFilterLabel + ")");
		}
		var vFromDate =	$.datepick.formatDate(strApplicationDefaultFormat, $.datepick.parseDate('yy-mm-dd', objDateParams.fieldValue1));
		var vToDate =  $.datepick.formatDate(strApplicationDefaultFormat, $.datepick.parseDate('yy-mm-dd', objDateParams.fieldValue2));
		if (index == '13') {
			if (objDateParams.operator == 'eq') {
				datePickerRef.datepick('setDate', vFromDate);
			} else {
				datePickerRef.datepick('setDate', [vFromDate, vToDate]);
			}
		} else {
			if (index === '1' || index === '2') {				
					datePickerRef.datepick('setDate', vFromDate);				
			} else {
					datePickerRef.datepick('setDate', [vFromDate, vToDate]);
			}
		}
		
		if (objDateParams.operator == 'eq')
            dateToField = "";
        else
            dateToField = vToDate;
        selectedImportDateInAdvFilter = {
            operator : objDateParams.operator,
            fromDate : vFromDate,
            toDate : dateToField,
            importDateLabel : me.dateFilterLabel
        };
		me.handleImportDateSync('Q', me.getImportDateLabel().text, " (" + me.dateFilterLabel + ")", datePickerRef);		
	},
	getDateParam : function(index, dateType) {
		var me = this;
		var objDateHandler = me.getDateHandler();
		var strAppDate = dtApplicationDate;
		var dtFormat = strExtApplicationDateFormat;
		//oracleDate - is owner date added for JIRA DHGCP441-2936
		var date = new Date(Ext.Date.parse(strAppDate, dtFormat));
		var strSqlDateFormat = 'Y-m-d';
		var fieldValue1 = '', fieldValue2 = '', operator = '', label = '';
		var retObj = {};
		var dtJson = {};
		var objDateLbl = {
				'' : getLabel('latest', 'Latest'),
				'1' : getLabel('today', 'Today'),
				'2' : getLabel('yesterday', 'Yesterday'),
				'3' : getLabel('thisweek', 'This Week'),
				'4' : getLabel('lastweektodate', 'Last Week To Date'),
				'5' : getLabel('thismonth', 'This Month'),
				'6' : getLabel('lastMonthToDate', 'Last Month To Date'),
				'14': getLabel('lastmonthonly', 'Last Month Only'),
				'8' : getLabel('thisquarter', 'This Quarter'),
				'9' : getLabel('lastQuarterToDate', 'Last Quarter To Date'),
				'10' : getLabel('thisyear', 'This Year'),
				'11' : getLabel('lastyeartodate', 'Last Year To Date'),
				'12' : getLabel('latest', 'Latest'),
				'13' : getLabel('daterange', 'Date Range')
		};	
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
		retObj.label = objDateLbl[index];
		return retObj;
	},
	updateFilterConfig : function() {
		var me = this;
		var arrJsn = new Array();
		// TODO : Localization to be handled..
		var objDateLbl = {
			'' : getLabel('latest', 'Latest'),
			'1' : getLabel('today', 'Today'),
			'2' : getLabel('yesterday', 'Yesterday'),
			'3' : getLabel('thisweek', 'This Week'),
			'4' : getLabel('lastweektodate', 'Last Week To Date'),
			'5' : getLabel('thismonth', 'This Month'),
			'6' : getLabel('lastMonthToDate', 'Last Month To Date'),
			'14': getLabel('lastmonthonly', 'Last Month Only'),
			'8' : getLabel('thisquarter', 'This Quarter'),
			'9' : getLabel('lastQuarterToDate', 'Last Quarter To Date'),
			'10' : getLabel('thisyear', 'This Year'),
			'11' : getLabel('lastyeartodate', 'Last Year To Date'),
			'12' : getLabel('latest', 'Latest'),
			'13' : getLabel('daterange', 'Date Range')

		};
		if (!Ext.isEmpty(objFileUploadCenterPref)) {
			var objJsonData = Ext.decode(objFileUploadCenterPref);
			var data = objJsonData.d.preferences.groupViewFilterPref;
			if (!Ext.isEmpty(data)) {
				var strDtValue = data.quickFilter.importDate;
				var strDtFrmValue = data.quickFilter.importDateFrom;
				var strDtToValue = data.quickFilter.importDateTo;

				if (!Ext.isEmpty(strDtValue)) {
					me.dateFilterLabel = objDateLbl[strDtValue];
					me.dateFilterVal = strDtValue;

					if (strDtValue === '13') {
						if (!Ext.isEmpty(strDtFrmValue))
							me.dateFilterFromVal = strDtFrmValue;

						if (!Ext.isEmpty(strDtToValue))
							me.dateFilterToVal = strDtToValue;
					} else {
						var dtParams = me.getDateParam(strDtValue);
						if (!Ext.isEmpty(dtParams)
								&& !Ext.isEmpty(dtParams.fieldValue1)) {
							me.dateFilterFromVal = dtParams.fieldValue1;
							me.dateFilterToVal = dtParams.fieldValue2;
						}
					}
				}

				var clientSelected = data.filterClientSelected;
				me.clientFilterVal = clientSelected;
				me.clientFilterDesc = data.filterClientDesc;
				arrJsn = me.createAndSetJsonForFilterData();
				var advFilterCode = data.advFilterCode;
				me.savedFilterVal = advFilterCode;
				me.doHandleSavedFilterItemClick(advFilterCode);
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
			 */if (me.dateFilterVal !== '13') {
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
							paramName : 'uploadDateFilter',
							paramIsMandatory : true, 
							paramValue1 : strVal1,
							paramValue2 : strVal2,
							operatorValue : strOpt,
							dataType : 'D'
						});
		}

		if (me.clientFilterVal != null && me.clientFilterVal != 'all') {
			arrJsn.push({
						paramName : 'Client',
						paramValue1 : encodeURIComponent(me.clientFilterVal.replace(new RegExp("'", 'g'), "\''")),
						operatorValue : 'eq',
						dataType : 'S'
					});
		}
		return arrJsn;
	},
	doHandleSavedFilterItemClick : function(filterCode) {
		var me = this;
		if (!Ext.isEmpty(filterCode)) {
			me.savePrefAdvFilterCode = filterCode;
			me.resetAllFields();
			me.getSavedFilterData(filterCode, this.populateSavedFilter, true);
		}
        
		me.savePrefAdvFilterCode = filterCode;
		me.showAdvFilterCode = filterCode;
	},
	handleFieldSync : function(){
		var me = this;
        var entryDateLableVal = $('label[for="ImportDateLabel"]').text();
        var entryDateField = $("#importDateAdvFilter");
        me.handleImportDateSync('A', entryDateLableVal, null , entryDateField);
        
        var savedFilterValue = $("#savedFilterAs").val();
        var savedFilterCombobox = me.getFilterView().down('combo[itemId="savedFiltersCombo"]');
        if (!Ext.isEmpty(savedFilterValue)) {
            if (!Ext.isEmpty(savedFilterCombobox)) {
                // savedFilterCombobox.getStore().reload();
                savedFilterCombobox.setValue(savedFilterValue);
            }
        } else {
            savedFilterCombobox.setValue('');
        }
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
	updateConfig : function() {
		var me = this;
		me.dateHandler = Ext.create('Ext.ux.gcp.DateUtil');
		me.preferenceHandler = Ext.create('Ext.ux.gcp.PreferencesHandler');
	},
	handleSavePreferences : function() {
		 var me = this;
	        if ($("#savePrefMenuBtn").attr('disabled')) {
	            event.preventDefault();
	        }
	        else {
	            var arrPref = me.getPreferencesToSave(false);
	            if (arrPref) {
	                me.preferenceHandler.clearPagePreferences(me.strPageName, null, me.postHandleClearPreferences, null, me, true);
	            }
	            me.disablePreferencesButton("savePrefMenuBtn", true);
	            me.disablePreferencesButton("clearPrefMenuBtn", false);
	        }
	},
	handleClearPreferences : function() {
		 var me = this;
	        if ($("#clearPrefMenuBtn").attr('disabled')) {
	            event.preventDefault();
	        }
	        else {
	            var arrPref = me.getPreferencesToSave(false);
	            me.preferenceHandler.clearPagePreferences(me.strPageName, null, me.postHandleClearPreferences, null, me, true);
	            me.disablePreferencesButton("savePrefMenuBtn", false);
	            me.disablePreferencesButton("clearPrefMenuBtn", true);
	        }
	},
	postHandleSavePreferences : function(data, args, isSuccess) {
		var me = this;
		me.disablePreferencesButton("savePrefMenuBtn", true);
		me.disablePreferencesButton("clearPrefMenuBtn", false);
	},
	postHandleClearPreferences : function(data, args, isSuccess) {
		var me = this;
	},
	/*
	 * doSavePreferences : function() { var me = this; var strUrl =
	 * me.urlGridFilterPref + '?' + csrfTokenName + '=' + csrfTokenValue; var
	 * arrPref = me.getPreferencesToSave(false); if (arrPref) {
	 * Ext.Ajax.request({ url : strUrl, method : 'POST', jsonData :
	 * Ext.encode(arrPref), success : function(response) { var responseData =
	 * Ext .decode(response.responseText); var isSuccess; var title, strMsg,
	 * imgIcon; if (responseData.d.preferences &&
	 * responseData.d.preferences.success) isSuccess =
	 * responseData.d.preferences.success; if (isSuccess && isSuccess === 'N') {
	 * title = getLabel('SaveFilterPopupTitle', 'Message'); strMsg =
	 * responseData.d.preferences.error.errorMessage; imgIcon =
	 * Ext.MessageBox.ERROR; Ext.MessageBox.show({ title : title, msg : strMsg,
	 * width : 200, buttons : Ext.MessageBox.OK, cls : 'ux_popup', icon :
	 * imgIcon });
	 *  } else { // me.toggleClearPrefrenceAction(true); Ext.MessageBox.show({
	 * title : title, msg : getLabel('prefSavedMsg', 'Preferences Saved
	 * Successfully'), buttons : Ext.MessageBox.OK, cls : 'ux_popup', icon :
	 * Ext.MessageBox.INFO });
	 * me.disablePreferencesButton("savePrefMenuBtn",true);
	 * me.disablePreferencesButton("clearPrefMenuBtn",false); }
	 *  }, failure : function() { var errMsg = ""; Ext.MessageBox.show({ title :
	 * getLabel( 'instrumentErrorPopUpTitle', 'Error'), msg : getLabel(
	 * 'instrumentErrorPopUpMsg', 'Error while fetching data..!'), buttons :
	 * Ext.MessageBox.OK, cls : 'ux_popup', icon : Ext.MessageBox.ERROR }); }
	 * }); } },
	 */
	disablePreferencesButton : function(btnId, boolVal) {
		$("#" + btnId).attr("disabled", boolVal);
		if (boolVal)
			$("#" + btnId).css("color", 'grey');
		else
			$("#" + btnId).css("color", '#FFF');
	},
	/*
	 * doClearPreferences : function() { var me = this; //
	 * me.toggleSavePrefrenceAction(false); var me = this; var strUrl =
	 * me.urlGridFilterPref + '?$clear=true' + '&' + csrfTokenName + '=' +
	 * csrfTokenValue; var arrPref = me.getPreferencesToSave(false); if
	 * (arrPref) { Ext.Ajax.request({ url : strUrl, method : 'POST', jsonData :
	 * Ext.encode(arrPref), success : function(response) { var responseData =
	 * Ext.decode(response.responseText); var isSuccess; var title, strMsg,
	 * imgIcon; if (responseData.d.preferences &&
	 * responseData.d.preferences.success) isSuccess =
	 * responseData.d.preferences.success; if (isSuccess && isSuccess === 'N') {
	 * title = getLabel('SaveFilterPopupTitle', 'Message'); strMsg =
	 * responseData.d.preferences.error.errorMessage; imgIcon =
	 * Ext.MessageBox.ERROR; Ext.MessageBox.show({ title : title, msg : strMsg,
	 * width : 200, buttons : Ext.MessageBox.OK, cls : 'ux_popup', icon :
	 * imgIcon });
	 *  } else { // me.toggleSavePrefrenceAction(true); Ext.MessageBox.show({
	 * title : title, msg : getLabel('prefClearedMsg', 'Preferences Cleared
	 * Successfully'), buttons : Ext.MessageBox.OK, cls : 'ux_popup', icon :
	 * Ext.MessageBox.INFO });
	 * me.disablePreferencesButton("savePrefMenuBtn",false);
	 * me.disablePreferencesButton("clearPrefMenuBtn",true); }
	 *  }, failure : function() { var errMsg = ""; Ext.MessageBox.show({ title :
	 * getLabel('instrumentErrorPopUpTitle', 'Error'), msg :
	 * getLabel('instrumentErrorPopUpMsg', 'Error while fetching data..!'),
	 * buttons : Ext.MessageBox.OK, cls : 'ux_popup', icon :
	 * Ext.MessageBox.ERROR }); } }); }
	 *  },
	 */
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
					&& groupInfo.groupTypeCode !== 'FILECEN_OPT_ADVFILTER') {
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
		var objFilterPref = {};
		var filterPanel = me.getFileUploadCenterFilterView();

		var currentFilterValue;
		if (typeof me.getSavedFiltersCombo() !== 'undefined') {
			currentFilterValue = me.getSavedFiltersCombo().value;
		}
		if (!Ext.isEmpty(currentFilterValue)) {
			advFilterCode = currentFilterValue;
		} else {
			advFilterCode = me.savedFilterVal;

		}

		/*
		 * if (!Ext.isEmpty(me.savedFilterVal)) { advFilterCode =
		 * me.savedFilterVal; }
		 */
		var quickPref = {};
		quickPref.importDate = me.dateFilterVal;
		if (me.dateFilterVal === '13') {
			if (!Ext.isEmpty(me.dateFilterFromVal)
					&& !Ext.isEmpty(me.dateFilterToVal)) {
				quickPref.importDateFrom = me.dateFilterFromVal;
				quickPref.importDateTo = me.dateFilterToVal;
			} else {
				var strSqlDateFormat = 'Y-m-d';
				var frmDate = me.getFromEntryDate().getValue();
				var toDate = me.getToEntryDate().getValue();
				fieldValue1 = Ext.util.Format.date(frmDate, 'Y-m-d');
				fieldValue2 = Ext.util.Format.date(toDate, 'Y-m-d');
				quickPref.importDateFrom = fieldValue1;
				quickPref.importDateTo = fieldValue2;
			}
		}
		objFilterPref.advFilterCode = advFilterCode;
		objFilterPref.quickFilter = quickPref;
		if (!Ext.isEmpty(me.clientFilterVal)) {
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
	handleType : function(btn) {
		var me = this;
		// me.toggleSavePrefrenceAction(true);
		me.typeFilterVal = btn.btnValue;
		me.typeFilterDesc = btn.btnDesc;
		me.setDataForFilter();
		me.filterApplied = 'Q';
		me.applyFilterData();
	},
	applyFilterData : function() {
		var me = this;
		me.getFileUploadCenterGridViewRef().refreshData();
	},
	createFileFormatList : function() {
		var me = this;
		// var eventCodesFilterRef = me.getFileUploadDtlRef();
		var strUrl = 'fileFormatTypes.srvc?';
		strUrl = strUrl + '$filter=' + '&' + csrfTokenName + '='
				+ csrfTokenValue;
		Ext.Ajax.request({
					url : strUrl,
					method : 'POST',
					params : {
						csrfTokenName : tokenValue
					},
					success : function(response) {
						var data = Ext.decode(response.responseText);
						if (!Ext.isEmpty(data)) {
							me.createList(data.d.fileUploadCenter);
						}
					},
					failure : function(response) {
						console
								.log('Bad : Something went wrong with your request');
					}
				});
	},
	createList : function(jsonData) {
		var me = this;
		var objfileUploadDtlRefPanel = me.getFileUploadDtlRef();
		var infoArray = this.createFileFormatMenuList(jsonData, me);
		objfileUploadDtlRefPanel.add({
					xtype : 'button',
					border : 0,
					filterParamName : 'ccyCode',
					itemId : 'ccyCodeCombo',// Required
					cls : 'xn-custom-arrow-button cursor_pointer w1',
					menu : Ext.create('Ext.menu.Menu', {
								items : infoArray
							})
				})
	},
	createFileFormatMenuList : function(jsonData, me) {
		var infoArray = new Array();
		if (jsonData) {
			for (var i = 0; i < jsonData.length; i++) {
				infoArray.push({
							text : getLabel('label' + i, jsonData[i].ccyCode),
							btnId : 'btn' + jsonData[i].ccyCode,
							btnValue : i,
							code : jsonData[i].ccyCode,
							parent : this,
							handler : function(btn, opts) {
								me.setCcyCode(btn);
							}
						});
			}
		}
		return infoArray;
	},
	createFormField : function(element, type, name, value) {
		var inputField;
		inputField = document.createElement(element);
		inputField.type = type;
		inputField.name = name;
		inputField.value = value;
		return inputField;
	},
	resetAllFields : function() {
		var me = this;
		$("input[type='text'][id='filterName']").val("");
		$("input[type='text'][id='fileName']").val("");
		$("input[type='text'][id='user']").val("");
		$("#saveFilterChkBox").attr('checked', false);
		//$("#statusAdvFilter").val("All");
		resetAllMenuItemsInMultiSelect("#statusAdvFilter");
		selectedImportDateInAdvFilter = {};
		$("input[type='text'][id='savedFilterAs']").val("");
		$("input[type='text'][id='savedFilterAs']").prop('disabled', false);
		$('#msSavedFilter').val('');
		markAdvFilterNameMandatory('saveFilterChkBox','savedFilterlbl','savedFilterAs', true);
		//$("#importDateQuickPicker").val("");
		//$("#importDateAdvFilter").val("");
		me.datePickerSelectedDate = [];
		$('#msSavedFilter').multiselect('refresh');
		markAdvFilterNameMandatory('saveFilterChkBox','savedFilterlbl','savedFilterAs', true);
		setImportDateDropDownMenu('importDateDropDown');
		//dateFilterRef = $('#importDateAdvFilter');
		//var formattedFromDate = Ext.util.Format.date(new Date(),strExtApplicationDateFormat);
		//$(dateFilterRef).val(formattedFromDate);
		$('label[for="ImportDateLabel"]').text(getLabel('importDate','Import Date'));
		me.dateFilterLabel = getDateIndexLabel(defaultDateIndex);
		me.dateFilterVal = defaultDateIndex;
		me.importDateFilterVal = me.dateFilterVal;
		me.importDateFilterLabel = me.dateFilterLabel;
		me.handleImportAdvDateChange(me.dateFilterVal);	
		$('#statusAdvFilter option').prop('selected', true);
		$('#statusAdvFilter').multiselect("refresh");		
	},
	handleSearchActionGridView : function(btn) {
		var me = this;
		me.doSearchOnly();
	},
	doSearchOnly : function() {
        var me = this;
        var filterData = "";
        var savedFilterValue = $("#savedFilterAs").val();
        var savedFilterCombobox = me.getFilterView().down('combo[itemId="savedFiltersCombo"]');
        if (!Ext.isEmpty(savedFilterValue)) {
            if (!Ext.isEmpty(savedFilterCombobox)) {
                // savedFilterCombobox.getStore().reload();
                savedFilterCombobox.setValue(savedFilterValue);
            }
        } else {
            savedFilterCombobox.setValue('');
        }
        var entryDateLableVal = $('label[for="ImportDateLabel"]').text();
        var entryDateField = $("#importDateAdvFilter");
        me.handleImportDateSync('A', entryDateLableVal, null , entryDateField);
        me.applyAdvancedFilter(filterData);
    },
	closeGridViewFilterPopup : function(btn) {
		var me = this;
		me.getAdvanceFilterPopup().close();
	},
	handleRangeFieldsShowHide : function(objShow) {
		var me = this;
		var objCreateNewFilterPanel = me.getCreateNewFilter();
		var toobj1 = objCreateNewFilterPanel
				.down('combobox[itemId="ascDescCombo1"]');
		var soobj1 = objCreateNewFilterPanel
				.down('combobox[itemId="sortByCombo2"]');
		var toobj2 = objCreateNewFilterPanel
				.down('combobox[itemId="ascDescCombo2"]');
		var soobj2 = objCreateNewFilterPanel
				.down('combobox[itemId="sortByCombo3"]');
		var toobj3 = objCreateNewFilterPanel
				.down('combobox[itemId="ascDescCombo3"]');
		var soobj3 = objCreateNewFilterPanel
				.down('combobox[itemId="sortByCombo4"]');
		var toobj4 = objCreateNewFilterPanel
				.down('combobox[itemId="ascDescCombo4"]');
		if (toobj1) {
			toobj1.setDisabled(false);
			soobj1.setDisabled(false);
		}

		if (toobj2) {
			toobj2.setDisabled(false);
			soobj2.setDisabled(false);
		}

		if (toobj3) {
			toobj3.setDisabled(false);
			soobj3.setDisabled(false);
		}

		if (toobj4) {
			toobj4.setDisabled(false);
		}

	},
	applyAdvancedFilter : function(filterData) {
		var me = this, objGroupView = me.getGroupView();
		me.filterApplied = 'A';
		me.setDataForFilter(filterData);
		me.refreshData();
		if (objGroupView)
        {
            objGroupView.toggleFilterIcon(true);
            objGroupView.setFilterToolTip(me.showAdvFilterCode || '');
        }
	},
	postDoSaveAndSearch : function() {
		var me = this;
		me.doSearchOnly();
	},
	postSaveFilterRequest : function(FilterCodeVal, fncallBack) {
		var me = this;
		strUrl = Ext.String.format('userfilters/fileUploadCenter/{0}.srvc', FilterCodeVal);
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
						if (responseData.d.filters && responseData.d.filters.success)
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
							me.updateSavedFilterComboInQuickFilter();
							setSavedFilterComboItems('#msSavedFilter');
							$('#msSavedFilter').val(FilterCodeVal);
							$('#msSavedFilter').multiselect('refresh');
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
									buttonText: {
								            ok: getLabel('btnOk', 'OK')
											} ,
									cls : 'ux_popup',
									icon : Ext.MessageBox.ERROR
								});
					}
				});

	},
	updateSavedFilterComboInQuickFilter : function() {
		var me = this;
		var savedFilterCombobox = me.getFilterView()
				.down('combo[itemId="savedFiltersCombo"]');
		savedFilterCombobox.getStore().reload();
		if (!Ext.isEmpty(savedFilterCombobox)) {
			if (me.savedFilterVal == null) {
				me.savedFilterVal = '';
			}
			if (me.filterCodeValue != null) {
				me.savedFilterVal = me.filterCodeValue;
			} else {
				me.savedFilterVal = '';
			}
			savedFilterCombobox.setValue(me.savedFilterVal);
		}
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
	deleteFilterCodeFromDb : function(objFilterName) {
		var me = this;
		if (!Ext.isEmpty(objFilterName)) {
			var strUrl = me.strRemoveSavedFilterUrl;
			strUrl = Ext.String.format(strUrl, objFilterName);

			Ext.Ajax.request({
						url : strUrl + '?' + csrfTokenName + '='
								+ csrfTokenValue,
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
	sendUpdatedOrderJsonToDb : function(store) {
		var me = this;
		var preferenceArray = [];

		store.each(function(rec) {
					var singleFilterSet = rec.get('filterName');
					preferenceArray.push(singleFilterSet);
				});
		var objJson = {};
		objJson.filters = preferenceArray;
		Ext.Ajax.request({
			url : 'services/userpreferences/fileUploadCenter/advanceFilterOrderList.json',
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
	viewFilterData : function(grid, rowIndex) {
		var me = this;
		me.resetAllFields();

		var record = grid.getStore().getAt(rowIndex);
		var filterCode = record.data.filterName;
		var applyAdvFilter = false;
		me.getSavedFilterData(filterCode, this.populateSavedFilter,
				applyAdvFilter);
		changeAdvancedFilterTab(1);
	},
	getSavedFilterData : function(filterCode, fnCallback, applyAdvFilter) {
		var me = this;
		var strUrl = 'userfilters/fileUploadCenter/{0}.srvc';
		strUrl = Ext.String.format(strUrl, filterCode);
		var urlSave = strUrl ;
		Ext.Ajax.request({
					url : urlSave,
					headers: objHdrCsrfParams,
					method : 'GET',
					success : function(response) {
						if (!Ext.isEmpty(response)
								&& !Ext.isEmpty(response.responseText)) {
							var responseData = Ext
									.decode(response.responseText);
							fnCallback.call(me, filterCode, responseData,
									applyAdvFilter);
							me.handleFieldSync();
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
									buttonText: {
								            ok: getLabel('btnOk', 'OK')
											} ,
									cls : 'ux_popup',
									icon : Ext.MessageBox.ERROR
								});
					}
				});
	},
	editFilterData : function(grid, rowIndex) {
		var me = this;
		me.resetAllFields();

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
	searchActionClicked : function(me) {
		var me = this, objGroupView = null, savedFilterCombobox = me.getFilterView().down('combo[itemId="savedFiltersCombo"]');
		var SaveFilterChkBoxVal = $("input[type='checkbox'][id='saveFilterChkBox']").is(':checked');
		if (SaveFilterChkBoxVal === true) {
			me.handleSaveAndSearchAction();
		} else {
			me.savedFilterVal = '';
			me.filterCodeValue = '';
			me.doSearchOnly();
			me.updateSavedFilterComboInQuickFilter()
			objGroupView = me.getGroupView();
			objGroupView.setFilterToolTip('');
			$('#advancedFilterPopup').dialog("close");
		}
	},
	saveAndSearchActionClicked : function(me) {
		me.savedFilterVal = null;
		me.handleSaveAndSearchAction(me);
	},
	handleSaveAndSearchAction : function(btn) {
		var me = this;
		var callBack = me.postDoSaveAndSearch;
		var strFilterCodeVal = null;
		var FilterCode = $("input[type='text'][id='savedFilterAs']");
		strFilterCodeVal = FilterCode.val();
		me.savePrefAdvFilterCode = strFilterCodeVal;
		if (Ext.isEmpty(strFilterCodeVal) && $('#saveFilterChkBox').is(":checked")) {
			if ($('#advancedFilterErrorDiv').hasClass('ui-helper-hidden')) {
				$('#advancedFilterErrorDiv').removeClass('ui-helper-hidden');
				$('#advancedFilterErrorMessage').text(getLabel('filternameMsg',
						'Please Enter Filter Name'));
				markRequired('#savedFilterAs');
			}
		} else {
			me.savedFilterVal = strFilterCodeVal;
			if (!$('#advancedFilterErrorDiv').hasClass('ui-helper-hidden')) {
				$('#advancedFilterErrorDiv').addClass('ui-helper-hidden');
			}
			$('#advancedFilterPopup').dialog("close");
			me.filterCodeValue = strFilterCodeVal;
			me.savePrefAdvFilterCode = me.filterCodeValue;
            me.savedFilterVal = me.filterCodeValue;
			me.postSaveFilterRequest(me.filterCodeValue, callBack);
		}
	},
	populateSavedFilter : function(filterCode, filterData, applyAdvFilter) {
        var me = this;
        var fieldName = '';
        var fieldVal = '';
        var fieldSecondVal = '';
        var currentFilterData = '';
        var operatorValue = '';
        for (i = 0; i < filterData.filterBy.length; i++) {
            fieldName = filterData.filterBy[i].field;
            fieldVal = filterData.filterBy[i].value1;
            fieldSecondVal = filterData.filterBy[i].value2;
            currentFilterData = filterData.filterBy[i];
            operatorValue = filterData.filterBy[i].operator;
            if (fieldName === 'fileName') {
                if (!Ext.isEmpty(fieldVal)) {
                    $("#fileName").val(decodeURIComponent(fieldVal));
                }
                else {
                    $("#fileName").val("");
                }
            }
            else if (fieldName === 'userName') {
                if (!Ext.isEmpty(fieldVal)) {
                    $("#user").val(decodeURIComponent(fieldVal));
                }
                else {
                    $("#user").val("");
                }
            }
            else if (fieldName === 'uploadDateFilter') {
                me.setSavedFilterDates(fieldName, currentFilterData);
            }
            else if (fieldName === 'status') {
                me.checkUnCheckMenuItems(fieldName, fieldVal);
                if (fieldName === 'status' && Array.isArray(fieldVal)) {
                    filterData.filterBy[i].value1 = fieldVal.join(",");
                }
            }
        }
        if (!Ext.isEmpty(filterCode)) {
            $('#savedFilterAs').val(filterCode);
            $("#msSavedFilter option[value='"+filterCode+"']").attr("selected",true);
            $("#msSavedFilter").multiselect("refresh");
            $('#saveFilterChkBox').prop('checked', true);
            $('#saveFilterChkBox').val('Y');
            $('#saveFilterChkBox').attr('checked', 'checked');
        }
        if (applyAdvFilter) {
            me.showAdvFilterCode = filterCode;
            me.applyAdvancedFilter(filterData);
            advancedFilterFieldsDataAdded = true;
        }
    },
	setSavedFilterDates : function(dateType, data) {
		if (!Ext.isEmpty(dateType) && !Ext.isEmpty(data)) {
            var me = this;
            var dateFilterRef = null;
            var dateOperator = data.operator;
            if (dateType === 'uploadDateFilter') {
                dateFilterRef = $('#importDateAdvFilter');
            }
            var fromDate = data.value1;
            var toDate = data.value2;
            var formattedFromDate = null;
            var formattedToDate = null;
            if (!Ext.isEmpty(fromDate)) {
                formattedFromDate = Ext.util.Format.date(Ext.Date.parse(fromDate, 'Y-m-d'), strExtApplicationDateFormat);
            }
            if (!Ext.isEmpty(toDate)) {
                formattedToDate = Ext.util.Format.date(Ext.Date.parse(toDate, 'Y-m-d'), strExtApplicationDateFormat);
            }
            $(dateFilterRef).val(formattedFromDate);
    
            if (dateOperator === 'eq') {
                $(dateFilterRef).val(formattedFromDate);
            }
            else if (dateOperator === 'bt') {
                $(dateFilterRef).setDateRangePickerValue([ formattedFromDate, formattedToDate ]);
            }
            selectedImportDateInAdvFilter = {
                operator : dateOperator,
                fromDate : formattedFromDate,
                toDate : formattedToDate,
                importDateLabel : data.dropdownLabel
            };
            var importDateLabel = getLabel('importDate', 'Import Date');
            if (!Ext.isEmpty(selectedImportDateInAdvFilter.importDateLabel)) {
                importDateLabel = importDateLabel + " (" + selectedImportDateInAdvFilter.importDateLabel + ")";
            }
            $('label[for="ImportDateLabel"]').text(importDateLabel);
            //var importDateLabel1 = $('label[for="ImportDateLabel"]').text();
            //me.handleImportDateSync('A', importDateLabel1, " ("	+ me.importDateFilterLabel + ")", dateFilterRef);
		} else {
			// console.log("Error Occured - date filter details found empty");
		}
	},
	updateStatusFilterView : function() {
		var me = this;
		var statuslabelValue = me.getStatusLabel();
		var objStatusLbl = {
			'All' : getLabel('AllStatus', 'All'),
			'N' : getLabel('newStatus', 'New'),
			'C' : getLabel('completedStatus', 'Completed'),
			'E' : getLabel('abortedStatus', 'Aborted'),
			'T' : getLabel('rejectedStatus', 'Rejected'),
			'R' : getLabel('runningStatus', 'Running'),
			'Q' : getLabel('inQueueStatus', 'In Queue')
		};
		if (!Ext.isEmpty(me.typeFilterVal)) {
			statuslabelValue.setText(objStatusLbl[me.typeFilterVal]);
		}
	},
	createSellerClientMenuList : function() {
		var me = this;
		var filterPanel = me.getSellerClientMenuBar();

		var objSellerStore = Ext.create('Ext.data.Store', {
					fields : ['sellerCode', 'description'],
					proxy : {
						type : 'ajax',
						autoLoad : true,
						url : 'services/sellerListFltr.json'
					}
				});
		if (!Ext.isEmpty(filterPanel)) {
			filterPanel.removeAll();
		}
	},
	createClientMenuList : function() {
		var me = this;
		var filterPanel = me.getSellerClientMenuBar();

		var objClientStore = Ext.create('Ext.data.Store', {
					fields : ['clientId', 'clientDescription'],
					proxy : {
						type : 'ajax',
						autoLoad : true,
						url : 'services/clientList.json'
					}
				});
		if (!Ext.isEmpty(filterPanel)) {
			filterPanel.removeAll();
		}
	},
	showHideSellerClientMenuBar : function(entityType) {
		var me = this;
		if (entityType === '0') {
			me.createSellerClientMenuList();
		} else {
			if (client_count > 1) {
				me.createClientMenuList();
			}
		}

	},
	applySeekFilter : function() {
		var me = this;
		var groupView = me.getGroupView();
		var grid = groupView.getGrid();
		var groupInfo = groupView.getGroupInfo() || '{}';
		var subGroupInfo = groupView.getSubGroupInfo() || {};
		me.filterApplied = 'Q';
		// TODO : Currently both filters are in sync
		if (!Ext.isEmpty(grid)) {
			var strDataUrl = grid.store.dataUrl;
			var store = grid.store;
			var strUrl = grid.generateUrl(strDataUrl, grid.pageSize, 1, 1,
					store.sorters);
			strUrl = strUrl + me.getFilterUrl(subGroupInfo, groupInfo) + '&'
					+ csrfTokenName + '=' + csrfTokenValue;
			strUrl = strUrl + '&' + '$entityType' + '=' + me.entityType;
			grid.setLoading(true);
			me.refreshData();
		}
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
		strUrl = 'services/getFileUploadCenterList/getFileUploadCenterDynamicReport.'
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
				if (col.dataIndex && arrSortColumn[col.dataIndex]) {
					if (colMap[arrSortColumn[col.dataIndex]]) {
						// ; do nothing
					} else {
						colMap[arrSortColumn[col.dataIndex]] = 1;
						colArray.push(arrSortColumn[col.dataIndex]);
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
	disableActions : function(canDisable) {
		if (canDisable)
			$('.canDisable').addClass('button-grey-effect');
		else
			$('.canDisable').removeClass('button-grey-effect');
	},

	refreshGrid : function(grid) {
		var me = this;
		if (null != grid && intervalFlag) {
			var records = grid.getStore().data.items;
			intervalFlag = false;
			for (var i = 0; i < records.length; i++) {
				if ("New" === records[i].data.ahtskStatus) {
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
	
	importDateAdvFilterChange : function(btn, opts) {
		me = this;
		me.importDateFilterVal = btn.btnValue;
		me.importDateFilterLabel = btn.text;
		me.handleImportDateInAdvFilterChange(btn.btnValue);
	},
	handleImportDateInAdvFilterChange : function(index) {
		var me = this;
		var dateToField;
		var datePickerRef =$('#importDateAdvFilter');
		var objDateParams = me.getDateParam(index, 'entryDate');
		import_date_opt = me.importDateFilterLabel;
		if (!Ext.isEmpty(me.importDateFilterLabel)) {
			$('label[for="ImportDateLabel"]').text(getLabel('importDate','Import Date')
					+ " (" + me.importDateFilterLabel + ")");
		}
		var vFromDate = $.datepick.formatDate(strApplicationDefaultFormat, $.datepick.parseDate('yy-mm-dd', objDateParams.fieldValue1));
		var vToDate = $.datepick.formatDate(strApplicationDefaultFormat, $.datepick.parseDate('yy-mm-dd', objDateParams.fieldValue2));
		var filterOperator = objDateParams.operator;

		if (index == '13') {
			if (filterOperator == 'eq') {
				datePickerRef.datepick('setDate', vFromDate);
			} else {
				datePickerRef.datepick('setDate', [vFromDate, vToDate]);
			}
		} else {
			if (index === '1' || index === '2') {				
					datePickerRef.datepick('setDate', vFromDate);
			
			} else {
					datePickerRef.datepick('setDate', [vFromDate, vToDate]);
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
            importDateLabel : objDateParams.label
        };
	},
	handleAppliedFilterDelete : function(btn) {
		var me = this;
		var objData = btn.data;
		var advJsonData = me.advFilterData;
		var quickJsonData = me.filterData;
		if (!Ext.isEmpty(objData)) {
			var paramName = objData.paramName || objData.field;
			var reqJsonInAdv = null;
			var arrAdvJson = null;
			// adv
			var reqJsonInAdv = me.findInAdvFilterData(advJsonData, paramName);
			if (!Ext.isEmpty(reqJsonInAdv)) {
				arrAdvJson = advJsonData;
				arrAdvJson = me.removeFromAdvanceArrJson(arrAdvJson, paramName);
				me.advFilterData = arrAdvJson;
			}
			// quick
			else {
				var reqJsonInQuick = me.findInQuickFilterData(quickJsonData,
						paramName);
				if (!Ext.isEmpty(reqJsonInQuick)) {
					arrQuickJson = quickJsonData;
					arrQuickJson = me.removeFromQuickArrJson(arrQuickJson,
							paramName);
					me.filterData = arrQuickJson;
				}
			}
			me.resetFieldInAdvAndQuickOnDelete(objData); // In this Method
															// will delete all
															// the Filters which
															// are applied
			me.refreshData();
		}
	},
	resetFieldInQuickFilterOnDelete : function(objData) {
		var me = this, strFieldName;
		if (!Ext.isEmpty(objData))
			strFieldName = objData.paramName || objData.field;

		if (strFieldName === 'clientId') {
			me.clientFilterDesc = '';
			me.clientFilterVal = '';
			if (_availableClients > 1) {
				$("#summaryClientFilterSpan").text('All Companies');
			}
			$("#summaryClientFilter").val('');
		}

	},
	removeFromAdvanceArrJson : function(arr, key) {
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
	resetFieldInAdvAndQuickOnDelete : function(objData) {
		var me = this, strFieldName;
		var filtersView = me.getFileUploadCenterFilterView
		if (!Ext.isEmpty(objData))
			strFieldName = objData.paramName || objData.field;

		if (strFieldName === 'fileName') {
			$('#fileName').val("");
		} 
		else if (strFieldName === 'userName') {
			$('#user').val("");
		}
		else if (strFieldName === 'status') {
			//$('#statusAdvFilter').val("All");
			resetAllMenuItemsInMultiSelect("#statusAdvFilter");
		}
		if(strFieldName === 'uploadDateFilter'){
			var datePickerRef = $('#importDateQuickPicker');
			me.dateFilterVal = '';
			me.getImportDateLabel().setText(getLabel('importDate', 'Import Date'));
			datePickerRef.val('');
			selectedRequestDateFilter={};
			me.datePickerSelectedDate = [];
			$('#importDateQuickPicker').val("");
			$("#importDateAdvFilter").val("");
			$('label[for="ImportDateLabel"]').text(getLabel('importDate','Import Date'));
		}
	},
	deleteFilterSet : function(filterCode) {
		var me = this;
		var objFilterName;
		var savedFilterCombobox = me.getFilterView().down('combo[itemId="savedFiltersCombo"]');
		var objComboStore = null;
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
		me.sendUpdatedOrderJsonToDb(objComboStore);
	},
	handleSavedFilterClick : function() {
		var me = this;
		var savedFilterVal = $("#msSavedFilter").val();
		me.resetAllFields();
		me.filterCodeValue = null;

		var filterCodeRef = $("input[type='text'][id='savedFilterAs']");
		if (!Ext.isEmpty(filterCodeRef)) {
			filterCodeRef.val(savedFilterVal);
		}

		var saveFilterChkBoxRef = $("input[type='checkbox'][id='saveFilterChkBox']");
		if (!Ext.isEmpty(saveFilterChkBoxRef) && !Ext.isEmpty(savedFilterVal))
			saveFilterChkBoxRef.prop('checked', true);

		var applyAdvFilter = false;
		me.filterCodeValue = savedFilterVal;
		me.getSavedFilterData(savedFilterVal, this.populateSavedFilter,applyAdvFilter);
	},
	handleImportDateSync : function(valueChangedAt, sourceLable, sourceToolTipText, sourceTextRef) {
		var me = this, labelToChange, valueControlToChange, updatedDateValue;
		labelToChange = (valueChangedAt === 'Q') ? $('label[for="ImportDateLabel"]') : me.getImportDateLabel();
		valueControlToChange = (valueChangedAt === 'Q') ? $('#importDateAdvFilter') : $('#importDateQuickPicker');
		updatedDateValue = sourceTextRef.getDateRangePickerValue();
		if(labelToChange && valueControlToChange && valueControlToChange.hasClass('is-datepick')) {
			if(valueChangedAt === 'Q') {
				labelToChange.text(sourceLable);
				updateToolTip('importDate', sourceToolTipText);
			} else {
				labelToChange.setText(sourceLable);
			}
			if(!Ext.isEmpty(updatedDateValue)) {
				valueControlToChange.datepick('setDate',updatedDateValue);
			}
		}
	},
	setImportDateFilterLabel : function(event) {
		me = this;
		var selectedDateFilterLabel = me.getFileUploadCenterFilterView().down('label[itemId="importDateLabel"]');
		var strd=selectedDateFilterLabel.text;
		var toolTipText=strd.substring(strd.lastIndexOf("(")+1,strd.lastIndexOf(")"));
		if(selectedDateFilterLabel && !Ext.isEmpty(selectedDateFilterLabel.text)){
			$('label[for="ImportDateLabel"]').text(selectedDateFilterLabel.text);
			updateToolTip('importDate',toolTipText);
		}
		else{
			$('label[for="ImportDateLabel"]').text(getLabel('importDate','Import Date') + " (" + me.dateFilterLabel + ")");
		}		
	},
	doHandleCellClick : function( view, td, cellIndex, record, tr, rowIndex, e, eOpts ) {
		var me = this;
		var objGroupView = me.getGroupView();
		var grid = objGroupView.getGrid();
		var clickedColumn = view.getGridColumns()[cellIndex];
		var columnType = clickedColumn.colType;
		if(columnType === 'actioncontent'){
			return;
		}
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
			me.handleRowIconClick(arrVisibleActions[0].itemId, grid, record);
		}
	},
	checkUnCheckMenuItems : function(componentName, data) {
		var menuRef = null;
		var elementId = null;
		var me = this;

		if (componentName === 'status') {
			menuRef = $("select[id='statusAdvFilter']");
			elementId = '#statusAdvFilter';
		} 
		if (!Ext.isEmpty(menuRef)) {
			var itemArray = $(elementId + " option");

			if (data === 'All') {
				$(elementId + ' option').prop('selected', true);
			} else {
				$(elementId + ' option').prop('selected', false);
				$(elementId).multiselect("refresh");
			}
			var dataArray = (typeof data == 'string') ? data.split(',') : data;
			for (var dataIndex = 0; dataIndex < dataArray.length; dataIndex++) {
				for (var index = 0; index < itemArray.length; index++) {
					if (dataArray[dataIndex] == itemArray[index].value) {
						$(elementId + " option[value=\"" + itemArray[index].value + "\"]").prop("selected", true);
						break;
					}
				}
			}
			$(elementId).multiselect("refresh");
		}
	},
	
	getPhdRecordKey : function(record){
		if (!record.get('isEmpty')) {
    		if (!Ext.isEmpty(record.raw.recordKeyNo)) {
    		var ahtsrno=record.raw.recordKeyNo;
            var phdRecordKey;
            Ext.Ajax.request({
                   url : 'services/getPhdReckey.json',
                   method : 'POST',
                   async : false,
                   params : {
                         'phdrecordkey' : ahtsrno
                   },
                   success : function(response) {
                         var data = response.responseText;
                         phdRecordKey=data;
                   },
                   failure : function(response) {
                         // console.log("Ajax Get data Call Failed");
                   }
    
                });
    		}
    	}
    	return phdRecordKey;
	},
	assignSavedFilter: function(){
        var me = this, savedFilterCode = '', objJsonData = '', objLocalJsonData = '';
        me.resetAllFields();
        if (objFileUploadCenterPref || objSaveLocalStoragePref) {
            objJsonData = Ext.decode(objFileUploadCenterPref);
            objLocalJsonData = Ext.decode(objSaveLocalStoragePref); 
            if (!Ext.isEmpty(objLocalJsonData.d.preferences) 
                    && (!Ext.isEmpty(objLocalJsonData.d.preferences.tempPref)) && allowLocalPreference === 'Y') {
                    if(!Ext.isEmpty(objLocalJsonData.d.preferences.tempPref.advFilterCode)){
                        savedFilterCode = objLocalJsonData.d.preferences.tempPref.advFilterCode;
                        me.savedFilterVal = objLocalJsonData.d.preferences.tempPref.advFilterCode;
                    }
                    if(!Ext.isEmpty(objLocalJsonData.d.preferences.tempPref.advFilterJson)){
                        me.populateSavedFilter(savedFilterCode,objLocalJsonData.d.preferences.tempPref.advFilterJson,false);
                        //me.handleFieldSync();
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
    saveLocalPref : function(objSaveState){
        var me = this, args = {},strLocalPrefPageName = me.strPageName+'_TempPref';
        if (!Ext.isEmpty(objSaveState)) {
            args['tempPref'] = objSaveState;
            me.preferenceHandler.savePagePreferences(strLocalPrefPageName, objSaveState, me.postHandleSaveLocalPref, args, me, false);
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
        me.preferenceHandler.clearPagePreferences(strLocalPrefPageName, null, me.postHandleClearLocalPreference, args, me, false);
    },
    postHandleClearLocalPreference : function(data, args, isSuccess){
        var me = this;
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
    doHandleStateChange : function() {
        var me = this, objState = {}, objGroupView = me.getGroupView(), grid = objGroupView.getGrid() ,subGroupInfo = null;
        if (objGroupView)
            subGroupInfo = objGroupView.getSubGroupInfo();
        objState['filterCode'] = me.savedFilterVal;
        objState['subGroupCode'] = (subGroupInfo || {}).groupCode;
        // Below handling is not feasible as causing pagination failure at component level
        //objState['pageSize'] = grid && !Ext.isEmpty(grid.getPageSize()) ? grid.getPageSize() : null;
        //objState['pageNo'] = grid && !Ext.isEmpty(grid.getCurrentPage()) ? grid.getCurrentPage() :  1;
        objLocalStoragePref = objState;
        me.preferenceHandler.setLocalPreferences(me.strLocalStorageKey,Ext.encode(objState));
    },
    doGetSavedState : function() {
        var me = this;
        return Ext.decode(me.preferenceHandler.getLocalPreferences(me.strLocalStorageKey));
    },
    doDeleteLocalState : function(){
        var me = this;
        me.preferenceHandler.clearLocalPreferences(me.strLocalStorageKey);
    },
    /* State handling at local storage End */
    applyPreferences : function() {
        var me = this, savedFilterCode = '', objJsonData = '', objLocalJsonData = '';
        if (objFileUploadCenterPref || objSaveLocalStoragePref) {
            objJsonData = Ext.decode(objFileUploadCenterPref);
            objLocalJsonData = Ext.decode(objSaveLocalStoragePref);
            if (!Ext.isEmpty(objLocalJsonData.d.preferences) && (!Ext.isEmpty(objLocalJsonData.d.preferences.tempPref)) && allowLocalPreference === 'Y') {
                if (!Ext.isEmpty(objLocalJsonData.d.preferences.tempPref.advFilterCode)) {
                    savedFilterCode = objLocalJsonData.d.preferences.tempPref.advFilterCode;
                    me.savedFilterVal = objLocalJsonData.d.preferences.tempPref.advFilterCode;
                }
                if (!Ext.isEmpty(objLocalJsonData.d.preferences.tempPref.advFilterJson)) {
                    me.populateSavedFilter(savedFilterCode, objLocalJsonData.d.preferences.tempPref.advFilterJson,true);
                    var entryDateLableVal = $('label[for="ImportDateLabel"]').text();
                    var entryDateField = $("#importDateQuickPicker");
                    me.handleImportDateSync('A', entryDateLableVal, " ("    + me.importDateFilterLabel + ")", entryDateField);
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
    resetSavedFilterCombo : function() {
        var me = this;
        me.savedFilterVal='';
        var savedFilterComboBox = me.getFilterView().down('combo[itemId="savedFiltersCombo"]');
        if (!Ext.isEmpty(savedFilterComboBox))
            savedFilterComboBox.setValue(me.savedFilterVal);
        $("#msSavedFilter").val("");
        $("#msSavedFilter").multiselect("refresh");
        $("#saveFilterChkBox").attr('checked', false);
        $("input[type='text'][id='savedFilterAs']").val("");
        $("input[type='text'][id='savedFilterAs']").prop('disabled', false);
        markAdvFilterNameMandatory('saveFilterChkBox','savedFilterlbl','savedFilterAs', true);
    }
});