Ext.define('GCP.controller.PositivePayIssuanceController', {
    extend : 'Ext.app.Controller',
    requires : ['Ext.ux.gcp.PreferencesHandler', 'Ext.ux.gcp.PageSettingPopUp'],
    views : ['GCP.view.PositivePayIssuanceView',
            'GCP.view.PositivePayIssuanceTitleView',
            'GCP.view.PositivePayIssuanceFilterView',
            'GCP.view.PositivePayIssuanceGroupView',
            'GCP.view.PositivePayIssuancePopUp',
            'GCP.view.PositivePayIssuanceImportPopUp',
            'GCP.view.PositivePayIssuanceAdvFilterPopUp',
            'GCP.view.HistoryPopup'],
    refs : [{
                ref : 'pageSettingPopUp',
                selector : 'pageSettingPopUp'
            },{
                ref : 'positivePayIssuance',
                selector : 'positivePayIssuanceView'
            }, {
                ref : 'positivePayIssuanceTitleView',
                selector : 'positivePayIssuanceView positivePayIssuanceTitleView'
            }, {
                ref : 'positivePayIssuanceFilterView',
                selector : 'positivePayIssuanceFilterView'
            }, {
                ref : 'positivePayIssuanceGroupView',
                selector : 'positivePayIssuanceView positivePayIssuanceGroupView'
            }, {
                ref : 'groupView',
                selector : 'positivePayIssuanceGroupView groupView'
            }, {
                ref : 'errorContainer',
                selector : 'positivePayIssuancePopUp container[itemId="errorContainer"]'
            }, {
                ref : 'importErrorContainer',
                selector : 'PositivePayIssuanceImportPopUp container[itemId="errorContainer"]'
            }, {
                ref : 'withHeaderCheckbox',
                selector : 'positivePayIssuanceView menuitem[itemId="withHeaderId"]'
            }, {
                ref : 'fromDateLabel',
                selector : 'positivePayIssuanceView positivePayIssuanceFilterView label[itemId="dateFilterFrom"]'
            }, {
                ref : 'toDateLabel',
                selector : 'positivePayIssuanceView positivePayIssuanceFilterView label[itemId="dateFilterTo"]'
            }, {
                ref : 'dateLabel',
                selector : 'positivePayIssuanceFilterView label[itemId="issueDateLabel"]'
            }, {
                ref : 'savedFiltersToolBar',
                selector : 'positivePayIssuanceView positivePayIssuanceFilterView toolbar[itemId="advFilterActionToolBar"]'
            }, {
                ref : 'issueDate',
                selector : 'positivePayIssuanceView positivePayIssuanceFilterView button[itemId="issueDate"]'
            }, {
                ref : 'fromEntryDate',
                selector : 'positivePayIssuanceView positivePayIssuanceFilterView datefield[itemId="fromDate"]'
            }, {
                ref : 'toEntryDate',
                selector : 'positivePayIssuanceView positivePayIssuanceFilterView datefield[itemId="toDate"]'
            }, {
                ref : 'dateRangeComponent',
                selector : 'positivePayIssuanceView positivePayIssuanceFilterView container[itemId="dateRangeComponent"]'
            }, {
                ref : 'btnSavePreferences',
                selector : 'positivePayIssuanceView positivePayIssuanceFilterView button[itemId="btnSavePreferences"]'
            }, {
                ref : 'btnClearPreferences',
                selector : 'positivePayIssuanceView positivePayIssuanceFilterView button[itemId="btnClearPreferences"]'
            }, {
                ref : 'advanceFilterPopup',
                selector : 'positivePayIssuanceAdvFilterPopUp[itemId="posPayIssuanceAdvFilterPopUp"]'
            }, {
                ref : 'advanceFilterTabPanel',
                selector : 'positivePayIssuanceAdvFilterPopUp[itemId="posPayIssuanceAdvFilterPopUp"] tabpanel[itemId="advancedFilterTab"] '
            }, {
                ref : 'filterDetailsTab',
                selector : 'positivePayIssuanceAdvFilterPopUp[itemId="posPayIssuanceAdvFilterPopUp"] tabpanel[itemId="advancedFilterTab"] panel[itemId="filterDetailsTab"]'
            }, {
                ref : 'createNewFilter',
                selector : 'positivePayIssuanceAdvFilterPopUp[itemId="posPayIssuanceAdvFilterPopUp"] positivePayIssuanceCreateNewAdvFilter[itemId="posPayIssuanceCreateAdvFilter"]'
            }, {
                ref : 'saveSearchBtn',
                selector : 'positivePayIssuanceAdvFilterPopUp[itemId="posPayIssuanceAdvFilterPopUp"] positivePayIssuanceCreateNewAdvFilter[itemId="posPayIssuanceCreateAdvFilter"] button[itemId="saveAndSearchBtn"]'
            }, {
                ref : 'clientMenu',
                selector : 'positivePayIssuanceAdvFilterPopUp[itemId="posPayIssuanceAdvFilterPopUp"] positivePayIssuanceCreateNewAdvFilter[itemId="posPayIssuanceCreateAdvFilter"] menu[itemId="clientMenu"]'
            }, {
                ref : 'clientDropDown',
                selector : 'positivePayIssuanceAdvFilterPopUp[itemId="posPayIssuanceAdvFilterPopUp"] positivePayIssuanceCreateNewAdvFilter[itemId="posPayIssuanceCreateAdvFilter"] button[itemId="clientDropDown"]'
            }, {
                ref : 'clientTextField',
                selector : 'positivePayIssuanceAdvFilterPopUp[itemId="posPayIssuanceAdvFilterPopUp"] positivePayIssuanceCreateNewAdvFilter[itemId="posPayIssuanceCreateAdvFilter"] textfield[itemId="clientText"]'
            }, {
                ref : 'corpMenu',
                selector : 'positivePayIssuanceAdvFilterPopUp[itemId="posPayIssuanceAdvFilterPopUp"] positivePayIssuanceCreateNewAdvFilter[itemId="posPayIssuanceCreateAdvFilter"] menu[itemId="corporationMenu"]'
            }, {
                ref : 'corporationDropDown',
                selector : 'positivePayIssuanceAdvFilterPopUp[itemId="posPayIssuanceAdvFilterPopUp"] positivePayIssuanceCreateNewAdvFilter[itemId="posPayIssuanceCreateAdvFilter"] button[itemId="corporationDropDown"]'
            }, {
                ref : 'corpTextField',
                selector : 'positivePayIssuanceAdvFilterPopUp[itemId="posPayIssuanceAdvFilterPopUp"] positivePayIssuanceCreateNewAdvFilter[itemId="posPayIssuanceCreateAdvFilter"] textfield[itemId="corporationText"]'
            }, {
                ref : 'accountMenu',
                selector : 'positivePayIssuanceAdvFilterPopUp[itemId="posPayIssuanceAdvFilterPopUp"] positivePayIssuanceCreateNewAdvFilter[itemId="posPayIssuanceCreateAdvFilter"] menu[itemId="accountMenu"]'
            }, {
                ref : 'accountDropDown',
                selector : 'positivePayIssuanceAdvFilterPopUp[itemId="posPayIssuanceAdvFilterPopUp"] positivePayIssuanceCreateNewAdvFilter[itemId="posPayIssuanceCreateAdvFilter"] button[itemId="accountDropDown"]'
            }, {
                ref : 'accountTextField',
                selector : 'positivePayIssuanceAdvFilterPopUp[itemId="posPayIssuanceAdvFilterPopUp"] positivePayIssuanceCreateNewAdvFilter[itemId="posPayIssuanceCreateAdvFilter"] textfield[itemId="accountText"]'
            }, {
                ref : 'issueFromDate',
                selector : 'positivePayIssuanceAdvFilterPopUp[itemId="posPayIssuanceAdvFilterPopUp"] positivePayIssuanceCreateNewAdvFilter[itemId="posPayIssuanceCreateAdvFilter"] datefield[itemId="issueDateFrom"]'
            }, {
                ref : 'issueToDate',
                selector : 'positivePayIssuanceAdvFilterPopUp[itemId="posPayIssuanceAdvFilterPopUp"] positivePayIssuanceCreateNewAdvFilter[itemId="posPayIssuanceCreateAdvFilter"] datefield[itemId="issueDateTo"]'
            }, {
                ref : 'issueDateText',
                selector : 'positivePayIssuanceAdvFilterPopUp[itemId="posPayIssuanceAdvFilterPopUp"] positivePayIssuanceCreateNewAdvFilter[itemId="posPayIssuanceCreateAdvFilter"] textfield[itemId="issueDateText"]'
            }, {
                ref : 'issueDateDropDown',
                selector : 'positivePayIssuanceAdvFilterPopUp[itemId="posPayIssuanceAdvFilterPopUp"] positivePayIssuanceCreateNewAdvFilter[itemId="posPayIssuanceCreateAdvFilter"] button[itemId="issueDateDropDown"]'
            }, {
                ref : 'amountField',
                selector : 'positivePayIssuanceAdvFilterPopUp[itemId="posPayIssuanceAdvFilterPopUp"] positivePayIssuanceCreateNewAdvFilter[itemId="posPayIssuanceCreateAdvFilter"] numberfield[itemId="amount"]'
            }, {
                ref : 'advFilterGridView',
                selector : 'positivePayIssuanceAdvFilterPopUp[itemId="posPayIssuanceAdvFilterPopUp"] positivePayIssuanceAdvFilterGridView'
            }, {
                ref : 'filterDetailsTab',
                selector : 'positivePayIssuanceAdvFilterPopUp[itemId="posPayIssuanceAdvFilterPopUp"] tabpanel[itemId="advancedFilterTab"] panel[itemId="filterDetailsTab"]'
            }, {
                ref : 'positivePayPopUp',
                selector : 'positivePayIssuancePopUp[itemId="positivePayPopUp"]'
            }, {
                ref : 'positivePayImportPopUp',
                selector : 'positivePayIssuanceImportPopUp[itemId="positivePayImportPopUp"]'
            }, {
                ref : 'posPayClientCombo',
                selector : 'positivePayIssuancePopUp[itemId="positivePayPopUp"] combo[itemId="posPayClientCombo"]'
            }, {
                ref : 'posPayCorpCombo',
                selector : 'positivePayIssuancePopUp[itemId="positivePayPopUp"] combo[itemId="posPayCorpCombo"]'
            }, {
                ref : 'posPayAccountCombo',
                selector : 'positivePayIssuancePopUp[itemId="positivePayPopUp"] combo[itemId="posPayAccountCombo"]'
            }, {
                ref : 'posPayImportClientCombo',
                selector : 'positivePayIssuanceImportPopUp[itemId="positivePayImportPopUp"] container[itemId="posPayClientContainer"] combo[itemId="posPayImportClientCombo"]'
            }, {
                ref : 'posPayImportFICombo',
                selector : 'positivePayIssuanceImportPopUp[itemId="positivePayImportPopUp"] container[itemId="posPayFIContainer"] combo[itemId="posPayImportFICombo"]'
            }, {
                ref : 'filterView',
                selector : 'filterView'
            }, {
                ref : "filterButton",
                selector : "groupView button[itemId=filterButton]"
            }],
    config : {
        dateHandler : null,
        filterCodeValue : null,
        objAdvFilterPopup : null,
        filterMode : '',
        advFilterSelectedCorpCode : '',
        advFilterSelectedClientCode : '',
        advFilterSelectedClientDesc : '',
        advFilterAllClientItemChecked : false,
        advFilterAllClientItemUnChecked : false,
        advFilterAllCorpItemChecked : false,
        advFilterAllCorpItemUnChecked : false,
        reportGridOrder : null,

        advFilterSelectedAccountCode : '',
        advFilterAllAccountItemChecked : false,
        advFilterAllAccountItemUnChecked : false,

        strCommonPrefUrl : 'services/userpreferences/positivePayIssuance.json',
        strModifySavedFilterUrl : 'services/userfilters/positivePayIssuance/{0}.json',
        strReadAllAdvancedFilterCodeUrl : 'services/userfilterslist/positivePayIssuance.json',
        strGetSavedFilterUrl : 'services/userfilters/positivePayIssuance/{0}.json',
        strRemoveSavedFilterUrl : 'services/userfilters/positivePayIssuance/{0}/remove.json',
        strGetModulePrefUrl : 'services/userpreferences/positivePayIssuance/{0}.json',
        strBatchActionUrl : 'services/positivePayIssuance/{0}.json',

        strDefaultMask : '000000000000000000',
        dateFilterVal : '',
        dateFilterFromVal : '',
        dateFilterToVal : '',
        issueDateFilterVal : '',
        dateFilterLabel: getLabel('latest', 'Latest'),
        filterData : [],
        advFilterData : [],
        advSortByData : [],
        filterApplied : 'ALL',
        showAdvFilterCode : null,
        SearchOrSave : false,
        savePrefAdvFilterCode : null,
        localPreHandler : null,
        advFilterCodeApplied : null,
        sellerOfSelectedClient : '',
        clientCode : '',
        clientDesc : '',
        strPageName : 'positivePayIssuance',
        savedFilterVal : '',
        datePickerSelectedDate : []
    },
    init : function() {
        var me = this;
        me.clientCode =$("#summaryClientFilterSpan").val(),
        me.clientDesc = $("#summaryClientFilterSpan").text(),
        me.dateHandler = Ext.create('Ext.ux.gcp.DateUtil');
        //me.updateFilterConfig();
        me.updateAdvFilterConfig();
        me.updateConfig();
        GCP.getApplication().on(
        {
            verifyOkBtnClick : function(strActionUrl, text, grid, arrSelectedRecords, strActionType, strAction)
            {
                me.preHandleGroupActions(strActionUrl, text,
                            grid, arrSelectedRecords,
                            strActionType, strAction);
            }
        } );
        $(document).on('performPageSettings', function(event) {
            me.showPageSettingPopup('PAGE');
        });

        $(document).on('savePreference', function(event) {
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
        $(document).on('resetAllFieldsEvent', function() {
            me.resetAllFields();
            me.filterCodeValue=null;
        });
        $(document).on('createNewIssuanceClick', function() {
            
            var url ='services/positivePayIssuanc.json';
            Ext.Ajax.request({
                
                url : url,
                method : "GET",
                dataType : 'json',
                success : function(data) {
            
                    if(data)
                    {
                       if(data.responseText == 'Y')
                       {
                            me.handleCreateNewIssuancePopUpClick();
                    
                       }
                    }
                }
            });
        });
        $(document).on('importIssuanceClick', function() {
            var url ='services/positivePayImportIssuanc.json';
                Ext.Ajax.request({
                       method : "GET",
                       dataType : 'json',
                       url : url,
                       success : function(data) {
                           if(data)
                           {
                               if(data.responseText == 'Y')
                               {
                                   me.handleImportIssuancePopUpClick();
                               }
                           }
                       }
                });
        });

        $(document).on('performReportAction', function(event, actionName) {
                    me.downloadReport(actionName);
                });
        
        $(document).on('filterDateChange',function(event, filterType, btn, opts) {
            me.creationDateFilterLabel= btn.text;
             if (filterType == "issuanceAdvDate"){
                 me.handleIssuanceAdvDateChange(btn.btnValue);
             }
             else if( filterType == "createDate" ) {
                 me.handleCreateAdvDateChange(btn.btnValue);
             }
        });    
    
        $(document).on('deleteFilterEvent', function(event, filterCode) {
                    me.deleteFilterSet(filterCode);
                });
        $(document).on('orderUpGridEvent',function(event, grid, rowIndex, direction) {
            me.orderUpDown(grid, rowIndex, direction)
        });
        $(document).on('viewFilterEvent', function(event, grid, rowIndex) {
            me.viewFilterData(grid, rowIndex);
        });
        $(document).on('editFilterEvent', function(event, grid, rowIndex) {
            me.editFilterData(grid, rowIndex);
        });
        $(document).on('savePositivePayAction', function(event) {
                me.savePositivePayAction();
        });
        $(document).on('saveAndAddPositivePayAction', function() {
                me.saveAndAddPositivePayAction();
                
        });
        $(document).on('savePositivePayImportAction', function(event) {
                me.savePositivePayImportAction();
                
        });
        $(document).on('handleClientChangeInQuickFilter',function(isSessionClientFilter) {
            me.handleClientChangeInQuickFilter(isSessionClientFilter);
        });        
        $(document).on('updatePositivePayAction', function(event) {
                me.updatePositivePayAction();
        });
        $(document).on('handleSavedFilterClick', function(event) {
                    me.handleSavedFilterClick();
                });
        
        $(document).on("datePickPopupSelectedDate",function(event, filterType, dates) {
            if ( filterType == "issuanceDate" ) {
                me.datePickerSelectedDate = dates;
                me.handleAdvFilterIssuanceDateChange(me.dateRangeFilterVal);
            }
            else if( filterType == "createDate" ) {
                me.datePickerSelectedDate = dates;
                me.handleAdvFilterCreateDateChange(me.dateRangeFilterVal);
            }
        });
        
        me.control({
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
            'positivePayIssuanceGroupView groupView' : {
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
                'gridStoreLoad' : function(grid, store) {
                    me.disableActions(false);
                },
                'render' : function() {
                    populateAdvancedFilterFieldValue();
                    me.firstTime = true;
                    if (objPositivePayIssuancePref) {
                        var objJsonData = Ext.decode(objPositivePayIssuancePref);
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
                },
                afterrender : function() {
                    if (objPositivePayIssuancePref) {
                        me.toggleSavePrefrenceAction(false);
                        me.toggleClearPrefrenceAction(true);
                    }
                },
                /*render:function(){
                    me.setDataForFilter();
                }*/
                
                'gridSettingClick' : function(){
                    me.showPageSettingPopup('GRID');
                }
            },
            'positivePayIssuanceFilterView' : {
                beforerender : function() {
                    var useSettingsButton = me.getFilterView()
                            .down('button[itemId="useSettingsbutton"]');
                    if (!Ext.isEmpty(useSettingsButton)) {
                        useSettingsButton.hide();
                    }
                },                                
                render : function(btn, opts) {
                    //me.setInfoTooltip();
                    //me.setDataForFilter();
                    //me.readAllAdvancedFilterCode();
                },
                afterrender : function(view) {
                    //view.highlightSavedFilter(me.savePrefAdvFilterCode);
                    //me.updateFilterFields();
                },
                dateChange : function(btn, opts) {
                    me.dateFilterVal = btn.btnValue;
                    me.dateFilterLabel = btn.text;
                    me.handleDateChange(btn.btnValue);
                    if (btn.btnValue !== '7') {
                        // TODO: To be handled
                        //me.filterApplied = 'Q';
                        selectedIssuanceDate={};
                        me.setDataForFilter();
                        me.applyQuickFilter();
                        me.toggleSavePrefrenceAction(true);
                    }
                },
                'handleSavedFilterItemClick' : function(strFilterCode, comboDesc) {
                    me.doHandleSavedFilterItemClick(strFilterCode, comboDesc);                    
                },
                'createNewFilterClick' : function(btn, opts) {
                    me.doHandleCreateNewFilterClick(btn, opts);
                },
                'moreAdvancedFilterClick' : function(btn) {
                    me.handleMoreAdvFilterSet(btn.itemId);
                },
                /*'handleClientChange' : function(selectedClientId,
                        strClientDescr, strSellerId) {
                    me.sellerOfSelectedClient = strSellerId;
                    me.clientCode = selectedClientId;
                    me.clientDesc = strClientDescr;
                    me.handleClientChange(me.clientCode, me.clientDesc);
                },*/
                'resetClientChange' : function() {
                    me.handleClientChange(null, null);
                }
            },
            'filterView' : {
                appliedFilterDelete : function(btn){
                    me.handleAppliedFilterDelete(btn);
                }
            },
            'positivePayIssuanceFilterView combo[itemId="savedFiltersCombo"]' : {
                'afterrender' : function(combo, newValue, oldValue, eOpts) {
                    if (!Ext.isEmpty(me.savedFilterVal)) {
                        combo.setValue(me.savedFilterVal);
                    }
                }
            },
            'positivePayIssuanceFilterView component[itemId="issueDatePickerQuick"]' : {
                render : function() {
                    $('#issueDatePickerQuickText').datepick({
                        monthsToShow : 1,
                        changeMonth : true,
                        changeYear : true,
                        dateFormat : strApplicationDefaultFormat,
                        rangeSeparator : ' to ',
                        onClose : function(dates) {
                            if (!Ext.isEmpty(dates)) {
                                me.datePickerSelectedDate = dates;
                                me.dateFilterVal = '13';
                                me.dateFilterLabel = getLabel('daterange',
                                        'Date Range');
                                me.handleDateChange(me.dateFilterVal);
                                selectedIssuanceDate={};
                                me.setDataForFilter();
                                me.applyQuickFilter();
                                // me.toggleSavePrefrenceAction(true);
                            }
                        }
                    });
                    if(!Ext.isEmpty(me.savedFilterVal)) {
                        var issueDateLableVal = $('label[for="issunceDateAdvLabel"]').text();
                        var issueDateField = $("#issuanceAdvDate");
                        me.handleIssueDateSync('A', issueDateLableVal, null, issueDateField);
                        
                    }else{
                        me.dateFilterVal = '1'; // Set to Today
                        me.dateFilterLabel = getLabel('today', 'Today');
                        me.handleDateChange(me.dateFilterVal);
                        me.setDataForFilter();
                        me.applyQuickFilter();
                    }
                }
            },
            'positivePayIssuanceFilterView button[itemId="btnSavePreferences"]' : {
                click : function(btn, opts) {
                    me.handleSavePreferences();
                }
            },
            'positivePayIssuanceFilterView button[itemId="btnClearPreferences"]' : {
                click : function(btn, opts) {
                    me.handleClearPreferences();
                }
            },
            'positivePayIssuancePopUp[itemId="positivePayPopUp"]' : {
                /*savePositivePayAction : function(btn, opts) {
                    me.savePositivePayAction();
                },
                saveAndAddPositivePayAction : function(btn, opts) {
                    me.saveAndAddPositivePayAction();
                },
                changeClientStore : function(value) {
                    me.changeClientStore(value);
                },
                changeAccountsStore : function(value) {
                    me.changeAccountsStore(value);
                },
                updatePositivePayAction : function(btn, opts) {
                    me.updatePositivePayAction();
                },
                prepareJson : function() {
                    me.prepareJson();
                }*/
            },
            /*'positivePayIssuanceImportPopUp[itemId="positivePayImportPopUp"]' : {
                savePositivePayImportAction : function(btn, opts) {
                    me.savePositivePayImportAction();
                }
            },*/
            'positivePayIssuanceImportPopUp[itemId="positivePayImportPopUp"] container[itemId="posPayFIContainer"] combo[itemId="posPayImportFICombo"]' : {
                select : function(combo, records, eOpts) {
                    me.handleImportFIselect(combo, records, eOpts);
                }
            },
            'filterView label[itemId="createAdvanceFilterLabel"]' : {
                'click' : function() {
                    showAdvanceFilterPopup();
                    me.assignSavedFilter();
					if(!Ext.isEmpty(me.advFilterCodeApplied))
						{
						var applyAdvFilter = false;
						me.getSavedFilterData(me.advFilterCodeApplied, me.populateSavedFilter,
								applyAdvFilter);
                }
				}
            },
            'filterView button[itemId="clearSettingsButton"]' : {
                'click' : function() {
                    me.handleClearSettings();
                }
            }
        });
    },
    
    /* Page setting handling starts here */
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
                cls : 'xn-popup message-box',
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
    },restorePageSetting : function(arrPref, strInvokedFrom) {
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
                cls : 'xn-popup message-box',
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
                cls : 'xn-popup message-box',
                icon : Ext.MessageBox.ERROR
            });
        }
    },
    showPageSettingPopup : function(strInvokedFrom) {
        var me = this, objData = {}, objGroupView = me.getGroupView(), objPrefData, objGeneralSetting, objGridSetting, objColumnSetting, strTitle = null, subGroupInfo;
        var objGroupByVal = '', objDefaultFilterVal = '', objGridSizeVal = '',objSummaryView = me.getPositivePayIssuanceGroupView(), objRowPerPageVal = _GridSizeMaster;
        
        me.pageSettingPopup = null;

        if (!Ext.isEmpty(objPositivePayIssuancePref)) {
            objPrefData = Ext.decode(objPositivePayIssuancePref);
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
                    title : strTitle
                });
        me.pageSettingPopup.show();
        me.pageSettingPopup.center();
    },
    /* Page setting handling ends here */
    
    
    
    
    searchActionClicked : function(me) {
        var me = this, objGroupView = null, savedFilterCombobox = me
                .getFilterView().down('combo[itemId="savedFiltersCombo"]');
        var SaveFilterChkBoxVal = $("input[type='checkbox'][id='saveFilterChkBox']")
                .is(':checked');        
        if (SaveFilterChkBoxVal === true) {
            me.handleSaveAndSearchAction();
        } else {
            me.doSearchOnly();
            if (savedFilterCombobox)
                savedFilterCombobox.setValue('');
            objGroupView = me.getGroupView();
            objGroupView.setFilterToolTip('');
        }
    },
    saveAndSearchActionClicked : function(me) {
        me.handleSaveAndSearchAction();
    },
    updateConfig : function() {
        var me = this;
        me.dateHandler = Ext.create('Ext.ux.gcp.DateUtil');
        me.preferenceHandler = Ext.create('Ext.ux.gcp.PreferencesHandler');
    },
        updateFilterFields : function(){
                        var me=this;
                        var clientCodesFltId;
                        var positivePayIssuanceFilterView = me.getPositivePayIssuanceFilterView();
                        /*if (!isClientUser()) {
                            clientCodesFltId = positivePayIssuanceFilterView.down('combobox[itemId=clientCodesFltId]');
                            if(undefined != me.clientCode && me.clientCode != ''){        
                                clientCodesFltId.suspendEvents();
                                clientCodesFltId.setValue(me.clientDesc);
                                clientCodesFltId.resumeEvents();
                            }else{
                                me.clientCode = 'all';            
                            }
                            
                        } else {
                        clientCodesFltId = positivePayIssuanceFilterView.down('combo[itemId="clientCombo"]');
                            if(undefined != me.clientCode && me.clientCode != '' && me.clientDesc != ''){    
                                clientCodesFltId.setRawValue(me.clientDesc);            
                            }    
                            else{    
                                clientCodesFltId.setRawValue(getLabel('allCompanies', 'All Companies'));
                                me.clientCode = 'all';
                            }
                        
                        }*/
                        if(me.savedFilterVal != null) { 
                            var saveFilterCombo=positivePayIssuanceFilterView.down('combo[itemId="savedFiltersCombo"]');
                                saveFilterCombo.setValue(me.savedFilterVal);
                        }    
                        me.handleDateChange(me.dateFilterVal);
                    
                    },
        handleAdvFilterIssuanceDateChange : function() {
                var me = this;
                var index = '13';
                var dateToField;
                var objDateParams = me.getDateParam(index, null);
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
                        $('#issuanceAdvDate').setDateRangePickerValue(vFromDate);
                    } else {
                        $('#issuanceAdvDate').setDateRangePickerValue([vFromDate, vToDate]);
                    }
                    if (filterOperator == 'eq')
                        dateToField = "";
                    else
                        dateToField = vToDate;
                    selectedIssuanceDate = {
                        operator : filterOperator,
                        fromDate : vFromDate,
                        toDate : dateToField
                    };
                }
            },
            
            handleAdvFilterCreateDateChange : function() {
                var me = this;
                var index = '13';
                var dateToField;
                var objDateParams = me.getDateParam(index, null);
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
                        $('#createAdvDate').setDateRangePickerValue(vFromDate);
                    } else {
                        $('#createAdvDate').setDateRangePickerValue([vFromDate, vToDate]);
                    }
                    if (filterOperator == 'eq')
                        dateToField = "";
                    else
                        dateToField = vToDate;
                    selectedCreateDate = {
                        operator : filterOperator,
                        fromDate : vFromDate,
                        toDate : dateToField
                    };
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
                    dtJson = objDateHandler.getThisWeekToDate( date );
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
            //    case '7':
                    // Date Range
                    /*var frmDate = me.getFromEntryDate().getValue();
                    var toDate = me.getToEntryDate().getValue();
                    fieldValue1 = Ext.Date.format( frmDate, strSqlDateFormat );
                    fieldValue2 = Ext.Date.format( toDate, strSqlDateFormat );
                    operator = 'bt';*/
                    //break;
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
                    // Latest
                    fieldValue1 = Ext.Date.format(date, strSqlDateFormat);
                    fieldValue2 = fieldValue1;
                    operator = 'le';
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
                // comparing with client filter condition
                if (Ext.Date.parse(fieldValue1, strSqlDateFormat) < clientFromDate) {
                    fieldValue1 = Ext.Date.format(clientFromDate, strSqlDateFormat);
                }
                retObj.fieldValue1 = fieldValue1;
                retObj.fieldValue2 = fieldValue2;
                retObj.operator = operator;
                return retObj;
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
        me.getSavedFilterData(savedFilterVal, this.populateSavedFilter,
                applyAdvFilter);
    },
    searchFilterData : function(filterCode) {
        var me = this;
        var emptyBtn = '';
        var currentBtn = '';
        var filterPresentOnToolbar = false;
        if (!Ext.isEmpty(filterCode)) {
            var objToolbar = me.getSavedFiltersToolBar();
            var filterView = me.getPositivePayIssuanceFilterView();
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
                                me.doHandleSavedFilterItemClick(filterCode);
                            }
                        }
                    }
                }

                if (!filterPresentOnToolbar) {
                    me.doHandleSavedFilterItemClick(filterCode);
                }

            }
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
            args = {
                scope : me
            };
            strModule = subGroupInfo.groupCode;
            strUrl = Ext.String.format(me.strGetModulePrefUrl, strModule);
            /*me.getSavedPreferences(strUrl, me.postHandleDoHandleGroupTabChange,
                    args);        */    
                me.preferenceHandler.readModulePreferences(me.strPageName,
                    strModule, me.postHandleDoHandleGroupTabChange, args, me, true);
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
            me.refreshData();
        }
    },
    postHandleDoHandleGroupTabChange : function(data, args) {
        var me = args.scope;
        var objGroupView = me.getGroupView();
        var objSummaryView = me.getPositivePayIssuanceGroupView(), objPref = null, gridModel = null, intPgSize = null,showPager = true, heightOption = null;
        var colModel = null, arrCols = null;
        if (data && data.preference) {
            objPref = Ext.decode(data.preference);
            arrCols = objPref.gridCols || null;
            intPgSize = objPref.pgSize || _GridSizeTxn;
            colModel = objSummaryView.getColumnModel(arrCols);
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
    doHandleGridRowSelectionChange : function(groupInfo, subGroupInfo, objGrid,
            objRecord, intRecordIndex, arrSelectedRecords, jsonData) {
        var me = this;
        var objGroupView = me.getGroupView();
        var buttonMask = me.strDefaultMask;
        var blnAuthInstLevel = false;
        var maskArray = new Array(), actionMask = '', objData = null;;
        if (!Ext.isEmpty(jsonData) && !Ext.isEmpty(jsonData.d.__buttonMask))
            buttonMask = jsonData.d.__buttonMask;
        maskArray.push(buttonMask);
        for (var index = 0; index < arrSelectedRecords.length; index++) {
            objData = arrSelectedRecords[index];
            if (objData.get('authLevel') === 0
                    && objData.get('paymentType') !== 'QUICKPAY')
                blnAuthInstLevel = true;
            maskArray.push(objData.get('__metadata').__rightsMap);
        }
        if (blnAuthInstLevel) {
            buttonMask = me.replaceCharAtIndex(5, '0', buttonMask);
            maskArray.push(buttonMask);
        }

        actionMask = doAndOperation(maskArray, 8);
        objGroupView.handleGroupActionsVisibility(actionMask);
    },
    doHandleRowActions : function(actionName, objGrid, record) {
        var me = this;
        var groupView = me.getGroupView();
        var grid = groupView.getGrid();
        if (actionName === 'discard' || actionName === 'accept'
                || actionName === 'reject' || actionName === 'submit' || actionName === 'void') {
            me.doHandleGroupActions(actionName, grid, [record], 'rowAction');
        } else if (actionName === 'btnHistory') {
            /*var chkr = (record.data.checkerId);
            var chkr_date = (record.raw.checkerTimeStamp);
            var makr = (record.data.makerId);
            var makr_date = (record.raw.makerTimeStamp);
            var rejectRemark = (record.data.rejectRemarks);
            var requestState = (record.data.requestState);
            var requestStateDesc = (record.data.decisionStatus);
            me.showHistory(chkr, chkr_date, makr, makr_date, rejectRemark, requestState, requestStateDesc);*/
            
            me.showHistory(record.get('identifier'));
            
        } else if (actionName === 'btnView' || actionName === 'btnEdit') {
            // createNewIssuance
            var mode = '';
            if (actionName === 'btnView'){
                mode = 'VIEW';
                me.populatepopupDataView(record, mode);
            }
                    
            else{
                mode = 'EDIT';
                me.populatepopupData(record, mode);
            }
                                
        }
    },
    
    populatepopupDataView : function(record, mode) {
        var me=this;
        me.resetPopUpView();
        
        var accountNumber = record.get('accountNumber');
        var acctName = getStringWithSpecialChars(record.get('acctName'));
        var amount = record.get('amount');
        var beanName = record.get('beanName');
        var checkerId = record.get('checkerId');
        var checkerStamp = record.get('checkerStamp');
        var clientDesc = getStringWithSpecialChars(record.get('clientDesc'));
        var clientId = record.get('clientId');
        var corporationDesc = record.get('corporationDesc');
        var corporationId = record.get('corporationId');
        var currSessionNo = record.get('currSessionNo');
        var decisionStatus = record.get('decisionStatus');
		var description = Ext.String.htmlDecode(record.get('description'));
        //var description = "Facebook Corporation,India Transfering fund";
        var fileName = record.get('fileName');
        var identifier = record.get('identifier');
        var issuanceDate = record.get('issuanceDate');
        var issuanceId = record.get('issuanceId');
        var makerId = record.get('makerId');
        var makerStamp = record.get('makerStamp');
		var payeeName = Ext.String.htmlDecode(record.get('payeeName'));		
        var recordKeyNo = record.get('recordKeyNo');
        var rejectRemarks = record.get('rejectRemarks');
        var requestState = record.get('requestState');
        var sellerCode = record.get('sellerCode');
        var serialNumber = record.get('serialNumber');
        var version = record.get('version');
        var voidIndicator = record.get('voidIndicator');

        createNewIssuance(mode);
        
        posPayCorpComboRef = document.getElementById("popUpcorporationSelectView");
        posPayClientComboRef = document.getElementById("popUpClientSelectView");
        posPayAccountComboRef = document.getElementById("popUpAccountSelectView");
        posPayDescriptionRef = document.getElementById("popUpdescriptionTextView");
        posPayPayeeRef = document.getElementById("popUppayeeTextView");
        posPaySerialNumberRef = document.getElementById("popUpSerialTextView");
        posPayAmountRef = document.getElementById("popUpAmountTextView");
        posPayIssueDateRef = document.getElementById("issuancePopUpDateView");
        posPayVoidRef = document.getElementById("popUpvoidCheckboxView");

        if(mode === "VIEW"){
             document.getElementById("statusDivView").style.display ='block';
        }
        posPayStatusRef = document.getElementById("popUpStatusTextView");

        posPayCorpComboRef.innerHTML = me.tooltip(corporationDesc,posPayCorpComboRef);
        if(posPayClientComboRef.innerText == undefined)
            posPayClientComboRef.textContent = me.tooltip(clientDesc,posPayClientComboRef);
        else
            posPayClientComboRef.innerText = me.tooltip(clientDesc,posPayClientComboRef);
        if(posPayAccountComboRef.innerText == undefined)
            posPayAccountComboRef.textContent = me.tooltip(accountNumber + " | " + acctName,posPayAccountComboRef);
        else
            posPayAccountComboRef.innerText = me.tooltip(accountNumber + " | " + acctName,posPayAccountComboRef);
        if(posPayDescriptionRef.innerText == undefined)
            posPayDescriptionRef.textContent = description;
        else
            posPayDescriptionRef.innerText = description;
        if(posPaySerialNumberRef.innerText == undefined)
            posPaySerialNumberRef.textContent = me.tooltip(serialNumber,posPaySerialNumberRef);
        else
            posPaySerialNumberRef.innerText = me.tooltip(serialNumber,posPaySerialNumberRef);
        //amount = amount.replace(new RegExp(',', 'g'), "");
        if(posPayAmountRef.innerText == undefined)
            posPayAmountRef.textContent = me.tooltip(record.get('currencySymbol')+ " " + amount,posPayAmountRef);
        else
            posPayAmountRef.innerText = me.tooltip(record.get('currencySymbol')+ " " + amount,posPayAmountRef);
        if(posPayIssueDateRef.innerText == undefined)
            posPayIssueDateRef.textContent = issuanceDate;
        else
            posPayIssueDateRef.innerText = issuanceDate;
        if(posPayStatusRef.innerText == undefined)
            posPayStatusRef.textContent = decisionStatus;
        else
            posPayStatusRef.innerText = decisionStatus;
        if(posPayPayeeRef.innerText == undefined)
            posPayPayeeRef.textContent = me.tooltip(payeeName);
        else
            posPayPayeeRef.innerText = me.tooltip(payeeName);
        identifier_data = identifier;
        
        if (voidIndicator == 'Y'){
            posPayVoidRef.innerHTML = "Void";
        }
        else{
            posPayVoidRef.innerHTML = "Issue";
        }
        closeButton = document.getElementById("cancel");
        closeButton.innerHTML = "Cancel";
    },
    
    tooltip : function(string,reference){
       $(reference).prop("title",string);
       return string; 
    },
    
    resetPopUpView : function() {
        var posPayClientComboRef = $('#popUpClientSelectView');
        var posPayCorpComboRef = $('#popUpcorporationSelectView');
        var posPayAccountComboRef =$('#popUpAccountSelectView');
        var posPayDescriptionRef = $('#popUpdescriptionTextView');
        var posPayPayeeRef = $('#popUppayeeTextView');
        var posPaySerialNumberRef = $('#popUpSerialTextView');
        var posPayAmountRef = $('#popUpAmountTextView');
        var posPayIssueDateRef = $('#issuancePopUpDateView');
        var posPayVoidRef = $('#popUpvoidCheckboxView');
        
        /*posPayAccountComboRef.removeAttr('disabled');
        posPayCorpComboRef.removeAttr('disabled');
        posPayClientComboRef.removeAttr('disabled');
        posPayDescriptionRef.removeAttr('disabled');
        posPaySerialNumberRef.removeAttr('disabled');
        posPayAmountRef.removeAttr('disabled');
        posPayIssueDateRef.removeAttr('disabled');
        posPayPayeeRef.removeAttr('disabled');
        posPayVoidRef.removeAttr('disabled');*/
        
        posPayCorpComboRef.val("");
        posPayClientComboRef.val("");
        posPayAccountComboRef.val(""); 
        posPayDescriptionRef.val("");
        posPayPayeeRef.val("");
        posPaySerialNumberRef.val("");
        posPayAmountRef.val("");
        posPayIssueDateRef.val("");
        posPayVoidRef.attr('checked',false);
        // me.loadClientsMenuToPositivePayPopUp();
        // me.loadAccountMenuToPositivePayPopUp();
    },
    
    populatepopupData : function(record, mode) {
        var me=this;
        accNo = record.get('accountNumber');
		accName = getStringWithSpecialChars(record.get('acctName'));
        var accountNumber = record.get('accountNumber');
        var acctName = record.get('acctName');
        var amount = record.get('amount');
        var beanName = record.get('beanName');
        var checkerId = record.get('checkerId');
        var checkerStamp = record.get('checkerStamp');
        var clientDesc = record.get('clientDesc');
        var clientId = record.get('clientId');
        var corporationDesc = record.get('corporationDesc');
        var corporationId = record.get('corporationId');
        var currSessionNo = record.get('currSessionNo');
        var decisionStatus = record.get('decisionStatus');
		var description = Ext.String.htmlDecode(record.get('description'));
        var fileName = record.get('fileName');
        var identifier = record.get('identifier');
        var issuanceDate = record.get('issuanceDate');
        var issuanceId = record.get('issuanceId');
        var makerId = record.get('makerId');
        var makerStamp = record.get('makerStamp');
		var payeeName = Ext.String.htmlDecode(record.get('payeeName'));
        var recordKeyNo = record.get('recordKeyNo');
        var rejectRemarks = record.get('rejectRemarks');
        var requestState = record.get('requestState');
        var sellerCode = record.get('sellerCode');
        var serialNumber = record.get('serialNumber');
        var version = record.get('version');
        var voidIndicator = record.get('voidIndicator');
        strPopUpClientSelect = clientId;
        var posPayCorpComboRef = $('#popUpcorporationSelect');
        var posPayClientComboRef = $('#popUpClientSelect');
		posPayClientComboRef.val(clientId);
		strClientId = clientId ;
		createNewIssuance(mode);


        var posPayAccountComboRef =$('#popUpAccountSelect');
        
        var posPayDescriptionRef = $('#popUpdescriptionText');
        var posPayPayeeRef = $('#popUppayeeText');
        var posPaySerialNumberRef = $('#popUpSerialText');
        var posPayAmountRef = $('#popUpAmountText');
        
        var posPayIssueDateRef = $('#issuancePopUpDate');
        var posPayVoidRef = $('#popUpvoidCheckbox');
        if(mode === "VIEW")
            {
             document.getElementById("statusDiv").style.display ='block';
            }
            var posPayStatusRef = $('#popUpStatusText');

        if (mode === "VIEW") {
            posPayAccountComboRef.attr('disabled', 'disabled');
            posPayCorpComboRef.attr('disabled', 'disabled');
            posPayClientComboRef.attr('disabled', 'disabled');
            posPayDescriptionRef.attr('disabled', 'disabled');
            posPaySerialNumberRef.attr('disabled', 'disabled');
            posPayAmountRef.attr('disabled', 'disabled');
            posPayIssueDateRef.attr('disabled', 'disabled');
            posPayPayeeRef.attr('disabled', 'disabled');
            posPayVoidRef.attr('disabled', true);
            posPayStatusRef.attr('disabled', 'disabled');
        }
		
		/*posPayAccountComboRef.val(accountNumber);
        var opt = $('<option />', {
            value: accountNumber,
            text: accountNumber + " | " + acctName 
        });
        
        opt.attr('selected','selected');
        
		opt.appendTo( posPayAccountComboRef );*/
        
        posPayCorpComboRef.val(corporationId);
        if( !Ext.isEmpty(posPayClientComboRef) && !Ext.isEmpty(posPayClientComboRef[0])
                && !Ext.isEmpty(posPayClientComboRef[0].options) && posPayClientComboRef[0].options.length > 0)
        {
            for (var i = 0; i < posPayClientComboRef[0].options.length; i++) {
                if (posPayClientComboRef[0].options[i].value== clientId) {
                    posPayClientComboRef[0].options[i].selected = true;
                    break;
                }
            }
        }
		if( !Ext.isEmpty(posPayAccountComboRef) && !Ext.isEmpty(posPayAccountComboRef[0])
				&& !Ext.isEmpty(posPayAccountComboRef[0].options) && posPayAccountComboRef[0].options.length > 0)
		{
			for (var i = 0; i < posPayAccountComboRef[0].options.length; i++) {
		        if (posPayAccountComboRef[0].options[i].value== accountNumber) {
		        	posPayAccountComboRef[0].options[i].selected = true;
		            break;
		        }
		    }
		}
        posPayDescriptionRef.val(description);
        posPaySerialNumberRef.val(serialNumber);
        amount = amount.replace(new RegExp(',', 'g'), "");
        posPayAmountRef.val(record.get('currencySymbol')+ " " + amount);
        posPayIssueDateRef.val(issuanceDate);
        posPayStatusRef.val(decisionStatus);
        posPayPayeeRef.val(payeeName);
        identifier_data = identifier;
        if (voidIndicator == 'Y')
            posPayVoidRef.attr("checked",true);
        else
            posPayVoidRef.attr("checked",false);

    },
    /*showHistory : function(chkr, chkr_date, makr, makr_date, rejectRemark, requestState, requestStateDesc)
    {
        var me = this;
        var historyPopup=Ext.create('GCP.view.PositivePayHistoryPopup',
        {
            checker : chkr,
            checkerDate : chkr_date,
            maker : makr,
            makerDate : makr_date,
            rejectRemark : rejectRemark,
            requestState : requestState,
            requestStateDesc : requestStateDesc
        });
        historyPopup.show();
        historyPopup.center();
    },*/
    showHistory : function(id) {
        Ext.create('GCP.view.HistoryPopup', {
                    historyUrl : 'positivePayIssuance/history.srvc?'+csrfTokenName+'='+csrfTokenValue,
                    //historyUrl:url,
                    identifier : id
                }).show();
    },
    showVerificationPopup : function(strAction, grid, arrSelectedRecords,strActionType, strActionUrl) {
        var verificationPopup =     Ext.create('GCP.view.PositivePayIssuanceVerifyPopup', {
                    action : strAction,
                    grid : grid,
                    selectedRecords : arrSelectedRecords,
                    actionType : strActionType,
                    actionUrl : strActionUrl
                }).show();
    verificationPopup.center();
    },
    doHandleGroupActions : function(strAction, grid, arrSelectedRecords,
            strActionType) {
        var me = this;
        var strUrl = Ext.String.format(me.strBatchActionUrl, strAction);
        if (strAction === 'reject') {
            me.showRejectVerifyPopUp(strAction, strUrl, grid,
                    arrSelectedRecords, strActionType);

        }
        else if((strAction === 'submit' || strAction === 'accept') && !isHidden('showVerifyPopup' + strAction)){
            me.showVerificationPopup(strAction, grid, arrSelectedRecords,strActionType, strUrl);
        }
        else {
            me.preHandleGroupActions(strUrl, '', grid, arrSelectedRecords,
                    strActionType, strAction);
        }
    },
    showRejectVerifyPopUp : function(strAction, strActionUrl, grid,
            arrSelectedRecords, strActionType) {
        var me = this;
        var titleMsg = '', fieldLbl = '';
        if (strAction === 'reject') {
            fieldLbl = getLabel('instrumentRejectRemarkPopUpTitle',
					'Please Enter Reject Remark');
            titleMsg = getLabel('instrumentRejectRemarkPopUpFldLbl',
                    'Reject Remark');
        }
        var prompt = new Ext.Window({
                modal       : true,
                height      : 270,
                width       : 355,
                plain       : true,
                border      : true,
                resizable   : false,
                maximizable : false,
                draggable   : false,
                closable    : true,
                cls:'t7-popup',
                closeAction : 'destroy',
                title       : titleMsg,
                autoScroll  : false,
                items: [{
                    xtype : 'label',
                    text : fieldLbl,
                    cls : 'frmLabel'
                },{
                    xtype: 'textarea',
                    id :  'rejectRemarkId',
                    enforceMaxLength : true,
                    maxLength : 255,
                    height: 100,
                    width: 310
                }],
                buttons: [
                {
                    xtype : 'button',
                    text     : 'Ok',
                    cls : 'ft-button ft-button-primary',
                    onClick : function () {
                        var text = Ext.getCmp('rejectRemarkId').getValue();
                        if (text !== '') {
                                me.preHandleGroupActions(strActionUrl, text,
                                        grid, arrSelectedRecords,
                                        strActionType, strAction);
                            } else {
                                Ext.MessageBox.show({
                                            title : getLabel(
                                                    'instrumentErrorPopUpTitle',
                                                    'Error'),
                                            msg : getLabel(
                                                    'RejError',
													'Reject Remarks cannot be blank'),
                                            buttons : Ext.MessageBox.OK,
                                            buttonText: {
        							            ok: getLabel('btnOk', 'OK')
        										},
                                            cls : 'xn-popup message-box',
                                            icon : Ext.MessageBox.ERROR
                                        });
                            }
                             prompt.destroy();
                        }
                    },
                    {
                    xtype : 'button',
                    text     : 'Cancel',
                    cls : 'ft-button ft-button-light',
                    glyph : 'xf0c7@fontawesome',
                    margin   : '0 183px 0 0',
                    onClick : function () {
                       prompt.destroy();
                    }
                }                    
                ]
            }).show();
        
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
                                if (jsonRes.d.instrumentActions
                                        && jsonRes.d.instrumentActions[0].success)
                                {
                                    isSuccess = jsonRes.d.instrumentActions[0].success;
                                    if (isSuccess && isSuccess === 'N') {                                    
                                        getRecentActionResult(jsonRes.d.instrumentActions[0].errors);
                                    }
                                    me.refreshData();
                                }
                                groupView.setLoading(false);
                                
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
                                            cls : 'xn-popup message-box',
                                            icon : Ext.MessageBox.ERROR
                                        });
                            }
                        });
            }
        }
    },
    doHandleLoadGridData : function(groupInfo, subGroupInfo, grid, url, pgSize,
            newPgNo, oldPgNo, sorter, filterData) {
        var me = this;
        var objGroupView = me.getGroupView();
        var arrOfParseQuickFilter = [], arrOfParseAdvFilter = [], arrOfFilteredApplied = [];
        var buttonMask = me.strDefaultMask;
        objGroupView.handleGroupActionsVisibility(buttonMask);
        var strUrl = grid.generateUrl(url, pgSize, newPgNo, oldPgNo, sorter);
        me.disableActions(true);
        me.reportGridOrder = strUrl;
        strUrl += me.generateFilterUrl(subGroupInfo, groupInfo);
        
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
				else if(strAdvancedFilterUrl.trim().indexOf('and') != 0)
				{
					strUrl = strUrl + ' and ';
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
    generateUrlWithAdvancedFilterParams : function(blnFilterApplied) {
        var me = this;
        var filterData = me.advFilterData;
        var isFilterApplied = blnFilterApplied;
        var isOrderByApplied = false;
        var strFilter = '';
        var strTemp = '';
        var strFilterParam = '';
        var operator = '';
        var isInCondition = false;
        var pmtCreateNewAdvFilterRef = me.getCreateNewFilter();

        if (!Ext.isEmpty(filterData)) {
            for (var index = 0; index < filterData.length; index++) {
                isInCondition = false;
                operator = filterData[index].operator;
                if (isFilterApplied
                        && (operator === 'bt' || operator === 'lk'
                                || operator === 'gt' || operator === 'lt' || operator === 'eq' )
                        && !isEmpty(strTemp)) {
                    strTemp = strTemp + ' and ';
                }

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
                        isInCondition = this.isInCondition(filterData[index]);
                        if (isInCondition)
                        {
                            var reg = new RegExp(/[\(\)]/g);
                            var objValue = filterData[index].value1;
                            if (objValue != 'All') {
                                if (isFilterApplied) {
                                    strTemp = strTemp + ' and ';
                                } else {
                                    isFilterApplied = true;
                                }
                                strTemp = strTemp + filterData[index].field + ' '
                                        + filterData[index].operator + ' ' + '\''
                                        + objValue + '\'';
                                isFilterApplied = true;
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
                    case 'in' :
                        var reg = new RegExp(/[\(\)]/g);
                        var objValue = filterData[index].value1;
                        var filterFieldId = filterData[index].field;
                        if(filterFieldId == 'accountNumber'){
							objValue = decodeURIComponent(objValue);
						}
                        var arrId = objValue.split(',');
                        if (arrId.length > 0) {
                            if (arrId[0] != 'All') {
                                if (isFilterApplied) {
                                    strTemp = strTemp + ' and ';
                                } else {
                                    isFilterApplied = true;
                                }

                                strTemp = strTemp + '(';
                                for (var count = 0; count < arrId.length; count++) 
                                {
            						if(filterData[ index ].field == "actionStatus")
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
    savePositivePayImportAction : function() {
        var me = this;
        var formdata = me.prepareDataForImport();
        if(!Ext.isEmpty(formdata)){
        $.ajax({
            url : 'services/addImportFileIssuancepay',
            type : 'POST',
            contentType : false,
            processData : false,
            data : formdata,
            complete : function(XMLHttpRequest, textStatus) {
                // if ("error" == textStatus) {
                // TODO : Error handling to be done.
                // alert("Unable to complete your request!");
                // }
            },
            success : function(response) {
                if (response && response['success'] == 'Y') {
                    $("#fileUploadDetailsDiv").empty();
					$('#lblSelectedFileName').html('no file selected');
					$('#file').val('');
                    createUploadDetailsGrid();
                    Ext.MessageBox.show({
                                title : getLabel(
                                        'saveActivityNotesSuccessPopUpTitle',
                                        'Message'),
                                msg : getLabel(
                                        'saveActivityNotesSuccessPopUpMsg',
                                        'File received successfully. Please click refresh for updated status.'),
                                buttons : Ext.MessageBox.OK,
                                cls : 'xn-popup message-box',
                                icon : Ext.MessageBox.INFO
                            });
					$('#btnImport').attr('disabled',false);
                } else {

					$('#lblSelectedFileName').html('no file selected');
					$('#file').val('');

					if (response && response['success'] == 'N' && response['errors'])
					{
                        var objErrors = response['errors'];
                        var strMessage = '';
                        
                        if(objErrors && objErrors.length>0)
                        {
                                paintErrors(objErrors);
                        }
                    } else if(response && response.d && response.d.auth && response.d.auth === 'AUTHREQ') {
                    } else {
                    Ext.MessageBox.show({
                                title : getLabel(
                                        'saveActivityNotesErrorPopUpTitle',
                                        'Message'),
                                msg : getLabel(
                                        'saveActivityNotesErrorPopUpMsg',
                                        'Error while Uploading file..!'),
                                buttons : Ext.MessageBox.OK,
                                cls : 'xn-popup message-box',
                                icon : Ext.MessageBox.ERROR
                            });
        				}
					$('#btnImport').attr('disabled',false);
				}
                /*
                 * me.refreshData(); var responseData =
                 * Ext.decode(response.responseText); var isSuccess; var title,
                 * strMsg, imgIcon; if (responseData.d.instrumentActions &&
                 * responseData.d.instrumentActions[0].success) isSuccess =
                 * responseData.d.instrumentActions[0].success; if (isSuccess &&
                 * isSuccess === 'N') { title = getLabel('positivePayIssuance',
                 * 'Message');
                 * 
                 * var errorMessage = ''; var errorsList =
                 * responseData.d.instrumentActions[0].errors;
                 * me.showErrors(errorsList); } else {
                 * me.getErrorContainer().removeAll();
                 * me.getPositivePayPopUp().close(); }
                 */
            },
            failure : function() {
                var errMsg = "";
                Ext.MessageBox.show({
                            title : getLabel('positivePayIssuance', 'Error'),
                            msg : getLabel('', 'Error while Uploading file..!'),
                            buttons : Ext.MessageBox.OK,
                            cls : 'xn-popup message-box',
                            icon : Ext.MessageBox.ERROR
                        });

            }
        });
        }else{
            return;
        }

    },
    savePositivePayAction : function() {
        var me = this;
        var objJson = me.prepareJson();
        Ext.Ajax.request({
            url : 'services/addPositivePayIssuance.json',
            method : 'POST',
            jsonData : objJson,
            async : false,
            success : function(response) {

                me.refreshData();
                var responseData = Ext.decode(response.responseText);
                var isSuccess;
                var title, strMsg, imgIcon;
                if (responseData.d.instrumentActions
                        && responseData.d.instrumentActions[0].success)
                    isSuccess = responseData.d.instrumentActions[0].success;
                if (isSuccess && isSuccess === 'N') {
                    title = getLabel('positivePayIssuance', 'Message');

                    var errorMessage = '';
                    var errorsList = responseData.d.instrumentActions[0].errors;
                    me.showErrors(errorsList);

                } else {
                    //me.resetPopUp();
                    $('#newIssuancePopup').dialog("close");
                }
            },
            failure : function() {
                
            }
        });

    },
    saveAndAddPositivePayAction : function() {
        var me = this;
        var objJson = me.prepareJson();
        Ext.Ajax.request({
            url : 'services/addPositivePayIssuance.json',
            method : 'POST',
            jsonData : objJson,
            async : false,
            success : function(response) {

                me.refreshData();
                var responseData = Ext.decode(response.responseText);
                var isSuccess;
                var title, strMsg, imgIcon;
                if (responseData.d.instrumentActions
                        && responseData.d.instrumentActions[0].success)
                    isSuccess = responseData.d.instrumentActions[0].success;
                if (isSuccess && isSuccess === 'N') {
                    title = getLabel('positivePayIssuance', 'Message');
                    var errorMessage = '';
                    var errorsList = responseData.d.instrumentActions[0].errors;
                    me.showErrors(errorsList);
                } else {
                    me.resetPopUp();
                }
            },
            failure : function() {
                

            }
        });

    },
    updatePositivePayAction : function() {
        var me = this;
        var objJson = me.prepareJson();
        Ext.Ajax.request({
            url : 'services/updatePositivePayIssuance.json?identifier='
                    + identifier_data,
            method : 'POST',
            jsonData : objJson,
            async : false,
            success : function(response) {

                me.refreshData();
                var responseData = Ext.decode(response.responseText);
                var isSuccess;
                var title, strMsg, imgIcon;
                if (responseData.d.instrumentActions
                        && responseData.d.instrumentActions[0].success)
                    isSuccess = responseData.d.instrumentActions[0].success;
                if (isSuccess && isSuccess === 'N') {
                    title = getLabel('positivePayIssuance', 'Message');
                    var errorMessage = '';
                    var errorsList = responseData.d.instrumentActions[0].errors;                    
                                                        
                    getRecentActionResult(responseData.d.instrumentActions[0].errors);
                    
                    me.showErrors(errorsList);
                } else {
					$('#newIssuancePopup').dialog("close");
                }
            },
            failure : function() {
                

            }
        });
    },
    showErrors : function(errorList) {
        
        var errorContainer = $('#errorContainerDiv');
        var errorMessage=$("#errorContainerMessage");
        errorContainer.empty();
        
        if ($('#errorContainerDiv').hasClass('ui-helper-hidden')) {
                $('#errorContainerDiv').removeClass('ui-helper-hidden');
            }
            var errorMsg = '';
        Ext.each(errorList, function(error, index) {
                    if (!Ext.isEmpty(errorContainer)) {
                      
                        errorMsg+=error.errorMessage + '<br>';
                    }
                });
       errorContainer.append(errorMsg);
    },
    resetErrorSection : function(errorList) {
        var errorContainer = $('#errorContainerDiv');
        var errorMessage= errorContainer.find('#errorContainerMessage');
        errorMessage.empty();
        $('#errorContainerDiv').addClass('ui-helper-hidden');
            var errorMsg = '';
        errorMessage.append(errorMsg);
    },
    prepareJson : function() {
        var posPayAmount = null;
        var posPayCorpComboRef = $('#popUpcorporationSelect');
        var posPayClientComboRef = $('#popUpClientSelect');
        var posPayAccountComboJQRef =$('#popUpAccountSelect_jq');
        var posPayAccountComboRef =$('#popUpAccountSelect');
        
        var posPayDescriptionRef = $('#popUpdescriptionText');
        var posPayPayeeRef = $('#popUppayeeText');
        var posPaySerialNumberRef = $('#popUpSerialText');
        //var posPayAmountRef = $('#popUpAmountText');
        var amount = $('#popUpAmountText').autoNumeric('get');
        var amtArray = amount.split(' ');
        if(amtArray.length > 1)
            posPayAmount = amtArray[1];
        else
            posPayAmount = amount;
        
        var posPayIssueDateRef = $('#issuancePopUpDate');
        var posPayVoidRef = $('#popUpvoidCheckbox');
        
        var objJson={};
        if (!Ext.isEmpty(posPayAccountComboJQRef) && posPayAccountComboJQRef.val() !== '' && !Ext.isEmpty(posPayAccountComboRef)){
            objJson.accountNumber = posPayAccountComboRef.val();
        }
        if (!Ext.isEmpty(posPayCorpComboRef)){
            objJson.corporationId = posPayCorpComboRef.val();
        }
        if (!Ext.isEmpty(posPayClientComboRef)){
            if (Ext.isEmpty(posPayClientComboRef.val()))
                objJson.clientId = posPayCorpComboRef.val();
            else
                objJson.clientId = posPayClientComboRef.val();
        }
        if (!Ext.isEmpty(posPayDescriptionRef))
            objJson.description = posPayDescriptionRef.val();
        if (!Ext.isEmpty(posPaySerialNumberRef))
            objJson.serialNumber = posPaySerialNumberRef.val();
        if (!Ext.isEmpty(posPayAmount))
            objJson.amount = posPayAmount;
        if (!Ext.isEmpty(posPayIssueDateRef))
            //objJson.issuanceDate =  Ext.util.Format.date(posPayIssueDateRef.val(), strExtApplicationDateFormat);
        	objJson.issuanceDate =  posPayIssueDateRef.val();
        if (!Ext.isEmpty(posPayPayeeRef))
            objJson.payeeName = posPayPayeeRef.val();
        if (!Ext.isEmpty(posPayVoidRef)) {
            var posPayVoidFlag = '';
            if (posPayVoidRef.is(':checked') )
                posPayVoidFlag = 'Y';
            else
                posPayVoidFlag = 'N';
        }
        objJson.voidIndicator = posPayVoidFlag;
        return objJson;
    },
    prepareDataForImport : function() {
        var me = this;
        var data = new FormData();
        var objJson = {};
        var posPaysellerComboRef = $('#fiSelect')
        var posPayClientComboRef =    $('#clientSelct')
 
        /*
         * var file=document.getElementsByName('issuanceFile')[0].files[0]); var
         * fileName var fileName =
         * document.getElementsByName('issuanceFile')[0].files[0].name;
         */
        /*
         * var posPayAccountComboRef = positivePayImportPopUp
         * .down('combo[itemId="posPayFileTypeCombo"]');
         */
        if (null!=document.getElementsByName('issuanceFile') && null!=document.getElementsByName('issuanceFile')[0].files[0])
        {
            //objJson.file=document.getElementsByName('issuanceFile')[0].files[0];
            //objJson.fileName=document.getElementsByName('issuanceFile')[0].files[0].name;
            data.append("file",    document.getElementsByName('issuanceFile')[0].files[0]);
        
            data.append("fileName",    document.getElementsByName('issuanceFile')[0].files[0].name);
        }
//        if (null != document.getElementsByName('issuanceFile')
//                && null != document.getElementsByName('issuanceFile').files) {
//            objJson.file = document.getElementsByName('issuanceFile')[0].files[0];
//            objJson.fileName = document.getElementsByName('issuanceFile')[0].files[0].name;
//            // data.append("file",
//            // document.getElementsByName('issuanceFile')[0].files[0]);
//
//            // data.append("fileName",
//            // document.getElementsByName('issuanceFile')[0].files[0].name);
//        }
        if (!Ext.isEmpty(posPaysellerComboRef) && posPaysellerComboRef.val()!="")
            data.append("sellerId", posPaysellerComboRef.val()); 
        else
            data.append("sellerId", strSellerId);
        // data.append("seller", posPaysellerComboRef.getValue());
        if (!Ext.isEmpty(posPayClientComboRef) &&posPayClientComboRef.val()!="")
            data.append("clientId", posPayClientComboRef.val());
        else
            data.append("clientId", strClientId);
        // data.append("clientId", posPayClientComboRef.getValue());
        data.append("mapCode", $("#fileSelect").val());
        return data;

        // return data;
    },
    resetPopUp : function() {
        var me = this;
        me.resetErrorSection();
        var posPayClientComboRef = $('#popUpClientSelect');
         var posPayCorpComboRef = $('#popUpcorporationSelect');
        var posPayAccountComboRef =$('#popUpAccountSelect_jq');
        
        var posPayDescriptionRef = $('#popUpdescriptionText');
        var posPayPayeeRef = $('#popUppayeeText');
        var posPaySerialNumberRef = $('#popUpSerialText');
        var posPayAmountRef = $('#popUpAmountText');
        var posPayIssueDateRef = $('#issuancePopUpDate');
        var posPayVoidRef = $('#popUpvoidCheckbox');
        
        posPayAccountComboRef.removeAttr('disabled');
        posPayCorpComboRef.removeAttr('disabled');
        posPayClientComboRef.removeAttr('disabled');
        posPayDescriptionRef.removeAttr('disabled');
        posPaySerialNumberRef.removeAttr('disabled');
        posPayAmountRef.removeAttr('disabled');
        posPayIssueDateRef.removeAttr('disabled');
        posPayPayeeRef.removeAttr('disabled');
        posPayVoidRef.removeAttr('disabled');
        
        posPayCorpComboRef.val("");
        posPayClientComboRef.val("");
        posPayAccountComboRef.val(""); 
        posPayDescriptionRef.val("");
        posPayPayeeRef.val("");
        posPaySerialNumberRef.val("");
        posPayAmountRef.val("");
        posPayIssueDateRef.val(dtApplicationDate);
        posPayVoidRef.attr('checked',false);
        // me.loadClientsMenuToPositivePayPopUp();
        // me.loadAccountMenuToPositivePayPopUp();
    },
    handleMoreAdvFilterSet : function(btnId) {
        var me = this;
        var objTabPanel = null;
        var filterDetailsTab = null;
        var clientContainer = null;
        if (Ext.isEmpty(me.objAdvFilterPopup)) {
            me.createAdvanceFilterPopup();
        }

        me.objAdvFilterPopup.show();
        objTabPanel = me.getAdvanceFilterTabPanel();
        objTabPanel.setActiveTab(0);
        filterDetailsTab = me.getFilterDetailsTab();
        filterDetailsTab.setTitle(getLabel('filterDetails', 'Filter Details'));
    },
    readAllAdvancedFilterCode : function() {
        var me = this;
        var filterView = me.getPositivePayIssuanceFilterView();
        Ext.Ajax.request({
                    url : me.strReadAllAdvancedFilterCodeUrl,
                    async : false,
                    success : function(response) {
                        var arrFilters = [];
                        if (response && response.responseText) {
                            var data = Ext.decode(response.responseText);
                            if (data && data.d && data.d.filters) {
                                arrFilters = data.d.filters;
                            }
                        }
                        if (filterView)
                            filterView.addAllSavedFilterCodeToView(arrFilters);
                    },
                    failure : function(response) {
                        // console.log('Bad : Something went wrong with your
                        // request');
                    }
                });
    },
    /*orderUpDown : function(grid, rowIndex, direction) {
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
    },*/

    sendUpdatedOrderJsonToDb : function() {
        var me = this;
        var objJson = {};
        var FiterArray = [];
        $("#msSavedFilter option").each(function() {
                    FiterArray.push($(this).val());
                });
        objJson.filters = FiterArray;
        Ext.Ajax.request({
            url : 'services/userpreferences/positivePayIssuance/advanceFilterPrefsOrder.json',
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
        var filterView = me.getPositivePayIssuanceFilterView();
        Ext.Ajax.request({
            url : 'services/userpreferences/positivePayIssuance/advanceFilterPrefsOrder.json',
            method : 'GET',
            async : false,
            success : function(response) {
                var responseData = Ext.decode(response.responseText);
                var filters = JSON.parse(responseData.preference);
                if (filterView)
                    filterView.addAllSavedFilterCodeToView(filters.filters);

            },
            failure : function() {
                // console.log("Error Occured - Addition
                // Failed");

            }

        });
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
        var datePickerRef = $('#issueDatePickerQuickText');
            me.dateFilterVal = '';
            me.getDateLabel().setText(getLabel('issunceDateAdvLbl', 'Issuance Date'));
            datePickerRef.val('');
            
        me.deleteFilterCodeFromDb(objFilterName);
        me.sendUpdatedOrderJsonToDb();
        
    },
    deleteFilterCodeFromDb : function(objFilterName) {
        var me = this;
        if (!Ext.isEmpty(objFilterName)) {
            var strUrl = me.strRemoveSavedFilterUrl;
            strUrl = Ext.String.format(strUrl, objFilterName);
            Ext.Ajax.request({
                        url : strUrl,
                        method : 'POST',
                        async:false,
                        success : function(response) {
                            
                        },
                        failure : function(response) {
                            
                        }
                    });
        }
    },

    viewFilterData : function(grid, rowIndex) {
        var me = this;
        me.resetAllFields();
        me.filterCodeValue=null;
        var record = grid.getStore().getAt(rowIndex);
        var filterCode = record.data.filterName;
        var applyAdvFilter = false;
        me.getSavedFilterData(filterCode, this.populateSavedFilter,
                applyAdvFilter);
        changeAdvancedFilterTab(1);
    },
    getSavedFilterData : function(filterCode, fnCallback, applyAdvFilter) {
        var me = this;
        var strUrl = Ext.String.format(me.strGetSavedFilterUrl, filterCode);
        Ext.Ajax.request({
                    url : strUrl,
                    method : 'GET',
                    async : false,
                    success : function(response) {
                        if(!Ext.isEmpty(response)&&!Ext.isEmpty(response.responseText)){
                            var responseData = Ext.decode(response.responseText);
                            fnCallback.call(me, filterCode, responseData,
                                applyAdvFilter);
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
                                    cls : 'xn-popup message-box',
                                    icon : Ext.MessageBox.ERROR
                                });
                    }
                });
    },
    editFilterData : function(grid, rowIndex) {
        var me = this;
        me.resetAllFields();
        me.filterCodeValue=null;
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
    checkUnCheckMenuItems : function(componentName, data) {
        var menuRef = null;
        var elementId = null;
        var me = this;
        var clientContainer = null;

        if (componentName === 'corporationId') {
            menuRef = $("select[id='corporationSelect']");
            elementId = '#corporationSelect';
        } else if (componentName === 'clientId') {
            menuRef = $("select[id='clientSelect']");
            elementId = '#clientSelect';
            me.clientCode = data;
        } else if (componentName === 'accountNumber') {
            menuRef = $("select[id='accountSelect']");
            elementId = '#accountSelect';
        }
        else if (componentName === 'actionStatus')
        {
        	menuRef = $("select[id='actionStatus']");
            elementId = '#actionStatus';
        }

        if (!Ext.isEmpty(menuRef)) {
            var itemArray = $(elementId + " option");

            if (data === 'All') {
                $(elementId + ' option').prop('selected', true);
            } else {
                $(elementId + ' option').prop('selected', false);
                $(elementId).multiselect("refresh");
            }

			var dataDecoded = decodeURIComponent(data);
			var dataArray = dataDecoded.split(',');
			var isApp = false;
            for (var dataIndex = 0; dataIndex < dataArray.length; dataIndex++) {
            	if(dataArray[dataIndex] == 3 || dataArray[dataIndex] == 1)
					 isApp = true;
            }
            for (var dataIndex = 0; dataIndex < dataArray.length; dataIndex++) {
                for (var index = 0; index < itemArray.length; index++) {
                    if (dataArray[dataIndex] == itemArray[index].value) {
                        $(elementId + " option[value=" + itemArray[index].value
                                + "]").prop("selected", true);
                        break;
                    }
                }
            }
            if  (componentName === 'actionStatus' && isApp == true)
			{
				$('#actionStatus option')[1].selected = true;
			
			}
            $(elementId).multiselect("refresh");
        }
    },
    setAmounts : function(operator, amountFromFieldValue, amountToFieldValue) {
        var amonutFieldRefFrom = $("#amountFieldFrom");
        var amountFieldRefTo = $("#amountFieldTo");

        if (!Ext.isEmpty(operator)) {
            if (!Ext.isEmpty(amountFromFieldValue)) {
                $('#amountOperator').val(operator);
                amonutFieldRefFrom.val(amountFromFieldValue);
                if (!Ext.isEmpty(amountToFieldValue)) {
                    if (operator == "bt") {
                        //$("#amountFieldFrom").removeClass("hidden");
                        $(".amountTo").removeClass("hidden");
                        $("#msAmountLabel").text(getLabel("amountFrom","Amount From"));
                        amountFieldRefTo.val(amountToFieldValue);
                    }
                }
            }
        }
    },
    setSavedFilterDates : function(dateType, data) {
        if (!Ext.isEmpty(dateType) && !Ext.isEmpty(data)) {
            var me = this;
            var dateFilterRef = null;
            var dateOperator = data.operator;

            if (dateType === 'issuanceDate') {
                dateFilterRef = $('#issuanceAdvDate');
            }
            else if(dateType === 'createDate') {
                dateFilterRef = $('#createAdvDate');
            }

            if (dateOperator === 'eq') {
                var fromDate = data.value1;
                if (!Ext.isEmpty(fromDate)) {
                    var formattedFromDate = Ext.util.Format.date(Ext.Date
                                    .parse(fromDate, 'Y-m-d'),strExtApplicationDateFormat);
                    $(dateFilterRef).val(formattedFromDate);
                }
            } else if (dateOperator === 'bt') {    
                 var fromDate = data.value1;
                 if (!Ext.isEmpty(fromDate)) { 
                     var formattedFromDate = Ext.util.Format.date(Ext.Date.parse(fromDate, 'Y-m-d'), strExtApplicationDateFormat);
                     var toDate = data.value2; 
                     if (!Ext.isEmpty(toDate)) { 
                         var formattedToDate = Ext.util.Format.date(Ext.Date.parse(toDate, 'Y-m-d'), strExtApplicationDateFormat);
                     $(dateFilterRef).setDateRangePickerValue([formattedFromDate,formattedToDate]);
                     }
                 }
            }
             if (dateType === 'issuanceDate') {
                    selectedIssuanceDate={
                        operator:dateOperator,
                        fromDate:formattedFromDate,
                        toDate:formattedToDate
                    };
                 } 
                 else if(dateType === 'createDate') {
                     selectedCreateDate={
                            operator:dateOperator,
                            fromDate:formattedFromDate,
                            toDate:formattedToDate
                        };                     
                 }
        }else {
            // console.log("Error Occured - date filter details found empty");
        }
            
    },    
    refreshData : function() {
        var me = this;
        var objGroupView = me.getGroupView();
        objGroupView.refreshData();
        //me.disablePreferencesButton("savePrefMenuBtn",false);
    },
    updateAdvFilterConfig : function() {
        var me = this;
        if (!Ext.isEmpty(objPositivePayIssuancePref)) {
            var objJsonData = Ext.decode(objPositivePayIssuancePref);
            if (!Ext.isEmpty(objJsonData.d.preferences)) {
                if (!Ext.isEmpty(objJsonData.d.preferences.filterPref)) {
                    if (!Ext
                            .isEmpty(objJsonData.d.preferences.filterPref.advFilterCode)) {
                        var advFilterCode = objJsonData.d.preferences.filterPref.advFilterCode;

                        if (!Ext.isEmpty(advFilterCode)) {
                            me.doHandleSavedFilterItemClick(advFilterCode);
                        }
                    }
                }
            }
        }
    },
    populateSavedFilter : function(filterCode, filterData, applyAdvFilter, mode) {
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

        for (i = 0; i < filterData.filterBy.length; i++) {
            fieldName = filterData.filterBy[i].field;
            fieldVal = filterData.filterBy[i].value1;
            fieldSecondVal = filterData.filterBy[i].value2;
            currentFilterData = filterData.filterBy[i];
            operatorValue = filterData.filterBy[i].operator;
            if (fieldName === 'clientId') {
                me.checkUnCheckMenuItems(fieldName, fieldVal);
                selectedClientDesc = filterData.filterBy[i].displayValue1;
				resetAllMenuItemsInMultiSelect("#accountSelect");
				setAccountMenuItems('#accountSelect');
            }
            if (fieldName === 'corporationId' || fieldName === 'accountNumber') {
                me.checkUnCheckMenuItems(fieldName, fieldVal);
            }
            else if (fieldName === 'issuanceDate') {
                me.setSavedFilterDates(fieldName, currentFilterData);
            }
            else if( fieldName === 'createDate' ) {
                me.setSavedFilterDates(fieldName, currentFilterData);
            }
            else if (fieldName === 'actionStatus') {
            	me.checkUnCheckMenuItems(fieldName, fieldVal);
            } 
            else if (fieldName === 'fileName') {
                $("#fileName").val(fieldVal);
            }
            else if (fieldName === 'voidIndicator') {
                if(fieldVal=='Y')
                    $("input[type='checkbox'][id='voidCheckbox']").prop('checked',true);
                else
                    $("input[type='checkbox'][id='voidCheckbox']").prop('checked',false);
            }
            else if (fieldName === 'amount') {
                me.setAmounts(operatorValue, fieldVal, fieldSecondVal);
            }
            else if (fieldName === 'payeeName') {
                $("#payeeText").val(fieldVal);
            }
            else if (fieldName === 'description') {
                $("#descriptionText").val(fieldVal);
            }
            else if (fieldName === 'serialNumber')
            {
            	$("#serial").val(fieldVal);
            }
        }
        if (!Ext.isEmpty(filterCode)) {
            $('#savedFilterAs').val(filterCode);
            $("#msSavedFilter option[value='"+filterCode+"']").attr("selected",true);
            $("#msSavedFilter").multiselect("refresh");
            var saveFilterChkBox = $("input[type='checkbox'][id='saveFilterChkBox']");
            saveFilterChkBox.prop('checked', true);
        }
        if (applyAdvFilter) {
            me.showAdvFilterCode = filterCode;
            me.applyAdvancedFilter(filterData);
        }
        
    },
    handleSearchAction : function(btn) {
        var me = this;
        me.doSearchOnly();
    },
    doSearchOnly : function() {
        var me = this;
        var issueDateLableVal = $('label[for="issunceDateAdvLabel"]').text();
        var issueDateField = $("#issuanceAdvDate");
        var clientComboBox = me.getPositivePayIssuanceFilterView().down('combo[itemId="clientCombo"]');
        if (selectedClient != null && $('#clientSelect').val() != 'all') {
			//clientComboBox.setValue($('#clientSelect').val());
        } else if($('#clientSelect').val() == 'all'){
//			clientComboBox.setValue('all');
	//		 clientCode = '';
        }
        me.handleIssueDateSync('A', issueDateLableVal, null, issueDateField);
        me.applyAdvancedFilter();
    },
        
    handleSaveAndSearchAction : function(btn) {
        var me = this;
        var callBack = me.postDoSaveAndSearch;
        var strFilterCodeVal=null;
        var FilterCode = $("#savedFilterAs").val();
        
        if (Ext.isEmpty(FilterCode)) {
            paintError('#advancedFilterErrorDiv',
                    '#advancedFilterErrorMessage', getLabel('filternameMsg',
                            'Please Enter Filter Name'));
            return;
        } else{
                hideErrorPanel("advancedFilterErrorDiv");
                me.filterCodeValue=FilterCode;
                strFilterCodeVal=me.filterCodeValue;
            }
        me.savePrefAdvFilterCode = strFilterCodeVal;
        hideErrorPanel("advancedFilterErrorDiv");
        me.postSaveFilterRequest(me.filterCodeValue, callBack);
        
    },


    setAdvDropdownData : function() {
        var me = this;
        var objCreateNewFilterPanel = me.getCreateNewFilter();
        if (me.advFilterSelectedCorpCode != '') {
            var menuRef = me.getCorpMenu();
            var itemArray = menuRef.items.items;
            var text = '';
            for (var index = 1; index < itemArray.length; index++) {
                var codeValue = itemArray[index].codeVal;
                if (me.advFilterSelectedCorpCode.indexOf(codeValue) != -1) {
                    itemArray[index].setChecked(true);
                    if (text == '')
                        text = itemArray[index].text;
                    else
                        text = text + "," + itemArray[index].text;
                }
            }
            objCreateNewFilterPanel.down('textfield[itemId="corporationText"]')
                    .setValue(text);
        } else {
            var menuRef = me.getCorpMenu();
            if (!Ext.isEmpty(menuRef)) {
                if (menuRef.items.length > 0) {
                    menuRef.removeAll();
                }
            }
        }
        if (me.advFilterSelectedClientCode != '') {
            var menuRef = me.getClientMenu();
            var itemArray = menuRef.items.items;
            var text = '';
            for (var index = 1; index < itemArray.length; index++) {
                var codeValue = itemArray[index].codeVal;
                if (me.advFilterSelectedClientCode.indexOf(codeValue) != -1) {
                    if (text == '')
                        text = itemArray[index].text;
                    else
                        text = text + "," + itemArray[index].text;
                }
            }
            objCreateNewFilterPanel.down('textfield[itemId="clientText"]')
                    .setValue(text);
        } else {
            var menuRef = me.getClientMenu();
            if (!Ext.isEmpty(menuRef)) {
                if (menuRef.items.length > 0) {
                    menuRef.removeAll();
                }
            }
        }
        if (me.advFilterSelectedAccountCode != '') {
            var menuRef = me.getAccountMenu();
            var itemArray = menuRef.items.items;
            var text = '';
            for (var index = 1; index < itemArray.length; index++) {
                var codeValue = itemArray[index].codeVal;
                if (me.advFilterSelectedAccountCode.indexOf(codeValue) != -1) {
                    if (text == '')
                        text = itemArray[index].text;
                    else
                        text = text + "," + itemArray[index].text;
                }
            }
            objCreateNewFilterPanel.down('textfield[itemId="accountText"]')
                    .setValue(text);
        } else {
            var menuRef = me.getAccountMenu();
            if (!Ext.isEmpty(menuRef)) {
                if (menuRef.items.length > 0) {
                    menuRef.removeAll();
                }
            }
        }
    },
    postSaveFilterRequest : function(FilterCodeVal, fncallBack) {
        var me = this;
        strUrl = Ext.String.format(me.strModifySavedFilterUrl, FilterCodeVal);
        strUrl += '?$mode=' + me.filterMode;
        var objJson;
        objJson = getAdvancedFilterValueJson(FilterCodeVal);
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
                                        cls : 'xn-popup message-box',
                                        icon : imgIcon
                                    });

                        }

                        if (FilterCodeVal && isSuccess && isSuccess === 'Y') {
                            $('#advancedFilterPopup').dialog('close');
                            fncallBack.call(me);
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
                                    cls : 'xn-popup message-box',
                                    icon : Ext.MessageBox.ERROR
                                });
                    }
                });
    },
    reloadFilters: function(store){
        store.load({
                    callback : function() {
                        var storeGrid = filterGridStore();
                        store.loadRecords(
                            storeGrid.getRange(0, storeGrid
                                            .getCount()), {
                                addRecords : false
                            });
                    }
                });
    },
    reloadGridRawData : function() {
        var me = this;
        var gridView = me.getAdvFilterGridView();
        var filterView = me.getPositivePayIssuanceFilterView();
        Ext.Ajax.request({
            url : me.strReadAllAdvancedFilterCodeUrl,
            method : 'GET',
            async : false,
            success : function(response) {
                var decodedJson = Ext.decode(response.responseText);
                var arrJson = new Array();

                if (!Ext.isEmpty(decodedJson.d.filters)) {
                    for (i = 0; i < decodedJson.d.filters.length; i++) {
                        arrJson.push({
                                    "filterName" : decodedJson.d.filters[i]
                                });
                    }
                }
                gridView.loadRawData(arrJson);
                if (filterView)
                    filterView
                            .addAllSavedFilterCodeToView(decodedJson.d.filters);
            },
            failure : function(response) {
                // console.log("Ajax Get data Call Failed");
            }

        });
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
        me.doSearchOnly();
        objGroupView = me.getGroupView();
        objGroupView.setFilterToolTip(me.filterCodeValue || '');
    },
    closeFilterPopup : function(btn) {
        var me = this;
        me.getAdvanceFilterPopup().close();
    },
    handleIssuanceAdvDateChange : function(index) {
        var me = this;
        var dateToField;
        var objDateParams = me.getDateParam(index,'issuanceAdvDate');

        if (!Ext.isEmpty(me.creationDateFilterLabel)) {
            $('label[for="issunceDateAdvLabel"]').text(getLabel('issuanceAdvDate',
                    'Issuance Date')
                    + " (" + me.creationDateFilterLabel + ")");
        }
        
            /*var vFromDate = Ext.util.Format.date(Ext.Date.parse(
                            objDateParams.fieldValue1, 'Y-m-d'),
                    strExtApplicationDateFormat);
            var vToDate = Ext.util.Format.date(Ext.Date.parse(
                            objDateParams.fieldValue2, 'Y-m-d'),
                    strExtApplicationDateFormat);*/
        	var vFromDate = Ext.Date.parse(objDateParams.fieldValue1, 'Y-m-d');
        	var vToDate = Ext.Date.parse(objDateParams.fieldValue2, 'Y-m-d');
            var filterOperator=objDateParams.operator;
            
            if (index == '13') {
                if (filterOperator == 'eq') {
                    $('#issuanceAdvDate').setDateRangePickerValue(vFromDate);
                } else {
                    $('#issuanceAdvDate').setDateRangePickerValue([
                            vFromDate, vToDate]);
                }
                if(filterOperator=='eq')
                    dateToField="";
                else
                    dateToField=vToDate;
                selectedIssuanceDate={
                    operator:filterOperator,
                    fromDate:vFromDate,
                    toDate:dateToField
                };
            } else {
                if (index === '1' || index === '2' || index === '12') {
                    if (index === '12') {
                        $('#issuanceAdvDate').val('Till' + '  ' + vFromDate);
                    } else {
                        $('#issuanceAdvDate').setDateRangePickerValue(vFromDate);
                    }
                } else {
                    $('#issuanceAdvDate').setDateRangePickerValue([
                            vFromDate, vToDate]);
                }
                if(filterOperator=='eq')
                    dateToField="";
                else
                    dateToField=vToDate;
                selectedIssuanceDate={
                    operator:filterOperator,
                    fromDate:vFromDate,
                    toDate:dateToField
                };
            }
    },
    handleCreateAdvDateChange : function(index) {
        var me = this;
        var dateToField;
        var objDateParams = me.getDateParam(index,'createAdvDate');

        if (!Ext.isEmpty(me.creationDateFilterLabel)) {
            $('label[for="createDateAdvLabel"]').text(getLabel('createAdvDate',
                    'Create Date')
                    + " (" + me.creationDateFilterLabel + ")");
        }
            /*var vFromDate = Ext.util.Format.date(Ext.Date.parse(
                            objDateParams.fieldValue1, 'Y-m-d'),
                    strExtApplicationDateFormat);
            var vToDate = Ext.util.Format.date(Ext.Date.parse(
                            objDateParams.fieldValue2, 'Y-m-d'),
                    strExtApplicationDateFormat);*/
        	var vFromDate = Ext.Date.parse(objDateParams.fieldValue1, 'Y-m-d');
        	var vToDate = Ext.Date.parse(objDateParams.fieldValue2, 'Y-m-d');
            var filterOperator=objDateParams.operator;
            
            if (index == '13') {
                if (filterOperator == 'eq') {
                    $('#createAdvDate').setDateRangePickerValue(vFromDate);
                } else {
                    $('#createAdvDate').setDateRangePickerValue([
                            vFromDate, vToDate]);
                }
                if(filterOperator=='eq')
                    dateToField="";
                else
                    dateToField=vToDate;
                selectedCreateDate={
                    operator:filterOperator,
                    fromDate:vFromDate,
                    toDate:dateToField
                };
            } else {
                if (index === '1' || index === '2' || index === '12') {
                    if (index === '12') {
                        $('#createAdvDate').val('Till' + '  ' + vFromDate);
                    } else {
                        $('#createAdvDate').setDateRangePickerValue(vFromDate);
                    }
                } else {
                    $('#createAdvDate').setDateRangePickerValue([
                            vFromDate, vToDate]);
                }
                if(filterOperator=='eq')
                    dateToField="";
                else
                    dateToField=vToDate;
                selectedCreateDate={
                    operator:filterOperator,
                    fromDate:vFromDate,
                    toDate:dateToField
                };
            }
    },    
    
//    handleIssueDateChange : function(index, textVal) {
//        var me = this;
//        var fromDateField = me.getIssueFromDate();
//        var toDateField = me.getIssueToDate();
//        var objDateParams = me.getDateParam(index);
//
//        if (!Ext.isEmpty(me.advDateLbl)) {
//            me.getIssueDateText().setValue(textVal);
//        }
//
//        var vFromDate = Ext.util.Format.date(Ext.Date.parse(
//                        objDateParams.fieldValue1, 'Y-m-d'),
//                strExtApplicationDateFormat);
//        var vToDate = Ext.util.Format.date(Ext.Date.parse(
//                        objDateParams.fieldValue2, 'Y-m-d'),
//                strExtApplicationDateFormat);
//        if (index === '1' || index === '2') {
//            fromDateField.setValue(vFromDate);
//            toDateField.setValue("");
//        } else {
//            fromDateField.setValue(vFromDate);
//            toDateField.setValue(vToDate);
//        }
//
//        if (index == '7') {
//            me.getIssueFromDate().setDisabled(false);
//            me.getIssueToDate().setDisabled(false);
//        } else {
//            me.getIssueFromDate().setDisabled(true);
//            me.getIssueToDate().setDisabled(true);
//        }
//    },
    doHandleSavedFilterItemClick : function(filterCode, comboDesc) {
        var me = this;
        if (!Ext.isEmpty(filterCode)) {
            me.savePrefAdvFilterCode = filterCode;
            me.showAdvFilterCode = filterCode;
            me.resetAllFields();
            me.getSavedFilterData(filterCode, me.populateSavedFilter, true);
            //me.savedFilterVal = filterCode;
        }
        var issueDateLableVal = $('label[for="issunceDateAdvLabel"]').text();
        var issueDateField = $("#issuanceAdvDate");
        me.handleIssueDateSync('A', issueDateLableVal, null, issueDateField);
        var clientComboBox = me.getPositivePayIssuanceFilterView().down('combo[itemId="clientCombo"]');
		if (!Ext.isEmpty(me.clientCode) && !Ext.isEmpty(clientComboBox)) {
            clientComboBox.setValue(me.clientCode);
        }
        me.savePrefAdvFilterCode = filterCode;
        me.showAdvFilterCode = filterCode;
    //    me.toggleSavePrefrenceAction(true);
    },
    doHandleCreateNewFilterClick : function() {
        var me = this;
        me.filterMode = 'ADD';
        var filterDetailsTab = null;
        var saveSearchBtn = null;
        var objTabPanel = null;

        if (!Ext.isEmpty(me.objAdvFilterPopup)) {
            me.filterCodeValue = null;
            filterDetailsTab = me.getFilterDetailsTab();
            filterDetailsTab.setTitle(getLabel('createNewFilter',
                    'Create New Filter'));
            saveSearchBtn = me.getSaveSearchBtn();
            if (saveSearchBtn) {
                saveSearchBtn.show();
            }
            var objCreateNewFilterPanel = me.getCreateNewFilter();
            objCreateNewFilterPanel.resetAllFields(objCreateNewFilterPanel);
            objCreateNewFilterPanel.down('numberfield[itemId="amount"]')
                    .setDisabled(true);
        } else {
            me.createAdvanceFilterPopup();
        }
        me.addCorporationMenuItems();
        me.objAdvFilterPopup.show();
        me.objAdvFilterPopup.center();
        objTabPanel = me.getAdvanceFilterTabPanel();
        objTabPanel.setActiveTab(1);
    },
    createAdvanceFilterPopup : function() {
        var me = this;
        if (Ext.isEmpty(me.objAdvFilterPopup)) {
            me.objAdvFilterPopup = Ext.create(
                    'GCP.view.PositivePayIssuanceAdvFilterPopUp', {
                        itemId : 'posPayIssuanceAdvFilterPopUp',
                        filterPanel : {
                            xtype : 'positivePayIssuanceCreateNewAdvFilter',
                            itemId : 'posPayIssuanceCreateAdvFilter',
                            margin : '4 0 0 0'
                        }
                    });
        }
    },
    addAccountMenuItems : function() {
        var me = this;
        var strTemp = '';
        var strUrl = 'services/positivePayAccountListAdvFilter.json?';
        if (!Ext.isEmpty(me.advFilterSelectedClientCode)) {
            var objArray = me.advFilterSelectedClientCode.split(',');
            if (objArray.length > 0) {
                if (objArray[0] != 'All') {
                    strTemp = strTemp + '(';
                    for (var i = 0; i < objArray.length; i++) {
                        strTemp = strTemp + ' filterClientCode ' + ' eq ';
                        strTemp = strTemp + '\'' + objArray[i] + '\'';
                        if (i != objArray.length - 1)
                            strTemp = strTemp + ' or ';
                    }
                    strTemp = strTemp + ')';
                }
            }
            strUrl += '&$filter=' + strTemp;
        }
        Ext.Ajax.request({
                    url : strUrl,
                    method : 'GET',
                    success : function(response) {
                        var responseData = Ext.decode(response.responseText);
                        var data = responseData.d;
                        me.loadAccountsMenu(data);
                        if (me.filterMode == 'EDIT' || me.filterMode == 'VIEW')
                            me.setAdvDropdownData();
                    },
                    failure : function() {
                        console.log("Error Occured - Addition Failed");
                    }
                });
    },
    loadAccountsMenu : function(data) {
        var me = this;
        var accountButton = me.getAccountDropDown();
        var menuRef = me.getAccountMenu();
        var menuRefClient = me.getClientMenu();
        var itemArray;
        if (!Ext.isEmpty(menuRefClient))
            itemArray = menuRefClient.items.items;

        if ((Ext.isEmpty(me.advFilterSelectedClientCode))) {
            if (!Ext.isEmpty(menuRef)) {
                if (menuRef.items.length > 0) {
                    menuRef.removeAll();
                }
            }
        } else if (!Ext.isEmpty(data)) {
            if (!Ext.isEmpty(menuRef)) {
                if (menuRef.items.length > 0) {
                    menuRef.removeAll();
                }
            }
            var count = data.length;
            if (count > 0) {
                menuRef.add({
                            xtype : 'menucheckitem',
                            text : getLabel('all', 'All'),
                            checked : me.advFilterAllAccountItemChecked,
                            listeners : {
                                checkchange : function(item, checked) {
                                    me.accountMenuAllHandler(item, checked);
                                    me.advFilterSelectedAccountCode = '';
                                }
                            }
                        });

                for (var index = 0; index < count; index++) {
                    var condition = (me.advFilterSelectedAccountCode
                            .indexOf(data[index].filterCode) != -1)
                            ? true
                            : false;
                    menuRef.add({
                        xtype : 'menucheckitem',
                        text : data[index].filterValue,
                        codeVal : data[index].filterCode,
                        checked : (me.advFilterAllAccountItemChecked || condition)
                                ? true
                                : false,
                        listeners : {
                            checkchange : function(item, checked) {
                                me.updateAccountTextField(item, checked);
                                if (!me.advFilterAllAccountItemChecked) {
                                    if (checked) {
                                        if (!Ext
                                                .isEmpty(me.advFilterSelectedAccountCode)) {
                                            me.advFilterSelectedAccountCode = me.advFilterSelectedAccountCode
                                                    + "," + item.codeVal;
                                        } else {
                                            me.advFilterSelectedAccountCode = item.codeVal;
                                        }
                                    } else {
                                        var objArray = me.advFilterSelectedAccountCode
                                                .split(',');
                                        if (objArray.length > 0) {
                                            if (objArray[0] != 'All') {
                                                strTemp = '';
                                                for (var i = 0; i < objArray.length; i++) {
                                                    if (objArray[i] != item.codeVal) {
                                                        if (strTemp != '')
                                                            strTemp = strTemp
                                                                    + ','
                                                                    + objArray[i];
                                                        else
                                                            strTemp = objArray[i];
                                                    }

                                                }
                                                me.advFilterSelectedClientCode = strTemp;
                                            }
                                        }
                                    }

                                }
                            }
                        }
                    });

                }
                menuRef.showBy(accountButton);
            }
        }
    },
    accountMenuAllHandler : function(item, checked) {
        var me = this;
        var menuRef = me.getAccountMenu();
        var accountTextField = me.getAccountTextField();
        var itemArray = menuRef.items.items;

        if (checked) {
            me.advFilterAllAccountItemChecked = true;
            for (var index = 1; index < itemArray.length; index++) {
                itemArray[index].setChecked(true);
            }
            if (!Ext.isEmpty(accountTextField)) {
                accountTextField.setValue("");
                accountTextField.setValue(getLabel('all', 'All'));
            }
        } else if (!me.advFilterAllAccountItemUnChecked && !checked) {
            me.advFilterAllAccountItemChecked = false;
            me.advFilterAllAccountItemUnChecked = false;
            for (var index = 1; index < itemArray.length; index++) {
                accountTextField.setValue('');
                itemArray[index].setChecked(false);
            }
        } else {
            me.advFilterAllAccountItemUnChecked = false;
        }
    },
    updateAccountTextField : function(item, checked) {
        var me = this;
        var maxCountReached = false;
        var menuRef = me.getAccountMenu();

        if (!Ext.isEmpty(menuRef)) {
            var itemArray = menuRef.items.items;
            var itemArrayLength = itemArray.length;
            var accountTextField = me.getAccountTextField();
            var textFieldData = '';

            if (!me.advFilterAllAccountItemChecked && checked) {
                me.advFilterAllAccountItemUnChecked = false;
                var count = 1;
                for (var index = 1; index < itemArrayLength; index++) {
                    if (itemArray[index].checked) {
                        textFieldData += itemArray[index].text + ',';
                        count++;

                    }
                }

                if (count == itemArrayLength) {
                    maxCountReached = true;
                }

            } else if (me.advFilterAllAccountItemChecked && !checked) {
                if (itemArray[0].checked) {
                    me.advFilterAllAccountItemUnChecked = true;
                    me.advFilterAllAccountItemChecked = false;
                    itemArray[0].setChecked(false);
                }

                for (var index = 1; index < itemArrayLength; index++) {
                    if (itemArray[index].checked) {
                        textFieldData += itemArray[index].text + ',';
                    }
                }
            } else if (!me.advFilterAllAccountItemChecked && !checked) {
                me.advFilterAllAccountItemUnChecked = false;
                for (var index = 1; index < itemArrayLength; index++) {
                    if (itemArray[index].checked) {
                        textFieldData += itemArray[index].text + ',';
                    }
                }
            }

            if (maxCountReached) {
                itemArray[0].setChecked(true);
            } else {
                var commaSeparatedString = textFieldData.substring(0,
                        (textFieldData.length - 1));
                accountTextField.setValue('');
                accountTextField.setValue(commaSeparatedString);
            }
        }
    },
    setInfoTooltip : function() {
        var me = this;
        Ext.create('Ext.tip.ToolTip', {
            target : 'positivePayIssuanceFilterView-1025_header_hd-textEl',
            listeners : {
                'beforeshow' : function(tip) {
                    var paymentTypeVal = '';
                    var client = '';
                    var dateFilter = me.dateFilterLabel;
                    var advfilter = (me.showAdvFilterCode || getLabel('none',
                            'None'));
                    if (me.filterApplied == 'ALL') {
                        paymentTypeVal = 'All';
                        me.showAdvFilterCode = null;
                    }
                    var filterView = me.getPositivePayIssuanceFilterView();
                    var clientCodeId = filterView
                            .down('combobox[itemId=clientCodeId]');

                    if (me.clientDesc) {
                        client = me.clientDesc;
                    } else {
                        // client = getLabel('none','None');
                        if (entityType == 1
                                && (me.clientDesc == "" || me.clientDesc == null)) {
                            client = getLabel('allcompanies', 'All Companies');
                        } else if (entityType == 0
                                && (me.clientDesc == "" || me.clientDesc == null)) {
                            client = getLabel('none', 'None');
                        } else
                            client = me.clientDesc;;
                    }
                    tip.update(getLabel('client', 'Company Name') + ' : ' + client
                            + '<br/>' + getLabel('date', 'Date') + ' : '
                            + dateFilter + '<br/>'
                            + getLabel('advancedFilter', 'Advanced Filter')
                            + ':' + advfilter);
                }
            }
        });

    },
    addClientMenuItems : function() {
        var me = this;
        var strTemp = '';
        var strUrl = 'services/positivePayClientList.json?';
        if (!Ext.isEmpty(me.advFilterSelectedCorpCode)) {
            var objArray = me.advFilterSelectedCorpCode.split(',');
            if (objArray.length > 0) {
                if (objArray[0] != 'All') {
                    strTemp = strTemp + '(';
                    for (var i = 0; i < objArray.length; i++) {
                        strTemp = strTemp + ' filterCorpCode ' + ' eq ';
                        strTemp = strTemp + '\'' + objArray[i] + '\'';
                        if (i != objArray.length - 1)
                            strTemp = strTemp + ' or ';
                    }
                    strTemp = strTemp + ')';
                }
            }
            strUrl += '&$filter=' + strTemp;
        }

        Ext.Ajax.request({
                    url : strUrl,
                    method : 'GET',
                    success : function(response) {
                        var responseData = Ext.decode(response.responseText);
                        var data = responseData.d;
                        me.loadClientsMenu(data);

                    },
                    failure : function() {
                        console.log("Error Occured - Addition Failed");
                    }
                });
    },
    loadClientsMenu : function(data) {
        var me = this;
        var clientButton = me.getClientDropDown();
        var menuRef = me.getClientMenu();
        var menuRefCorp = me.getCorpMenu();
        var itemArray;
        if (!Ext.isEmpty(menuRefCorp))
            itemArray = menuRefCorp.items.items;
        if ((Ext.isEmpty(me.advFilterSelectedCorpCode) && !itemArray[0].checked)) {
            me.getClientTextField().setValue("");
            if (!Ext.isEmpty(menuRef)) {
                if (menuRef.items.length > 0) {
                    menuRef.removeAll();
                }
            }
        } else if (!Ext.isEmpty(data)) {
            if (!Ext.isEmpty(menuRef)) {
                if (menuRef.items.length > 0) {
                    menuRef.removeAll();
                }
            }
            var count = data.length;
            if (count > 0) {
                menuRef.add({
                            xtype : 'menucheckitem',
                            text : getLabel('all', 'All'),
                            codeVal : 'ALL',
                            checked : me.advFilterAllClientItemChecked,
                            listeners : {
                                checkchange : function(item, checked) {
                                    me.clientMenuAllHandler(item, checked);
                                }
                            }
                        });

                for (var index = 0; index < count; index++) {
                    var condition = (me.advFilterSelectedClientCode
                            .indexOf(data[index].filterCode) != -1)
                            ? true
                            : false;
                    menuRef.add({
                        xtype : 'menucheckitem',
                        text : data[index].filterValue,
                        codeVal : data[index].filterCode,
                        checked : (me.advFilterAllClientItemChecked || condition)
                                ? true
                                : false,
                        listeners : {
                            checkchange : function(item, checked) {
                                me.updateClientTextField(item, checked);
                                if (!me.advFilterAllClientItemChecked) {
                                    if (checked) {
                                        if (!Ext
                                                .isEmpty(me.advFilterSelectedClientCode)) {
                                            me.advFilterSelectedClientCode = me.advFilterSelectedClientCode
                                                    + "," + item.codeVal;
                                        } else {
                                            me.advFilterSelectedClientCode = item.codeVal;
                                        }
                                    } else {
                                        var objArray = me.advFilterSelectedClientCode
                                                .split(',');
                                        if (objArray.length > 0) {
                                            if (objArray[0] != 'All') {
                                                strTemp = '';
                                                for (var i = 0; i < objArray.length; i++) {
                                                    if (objArray[i] != item.codeVal) {
                                                        if (strTemp != '')
                                                            strTemp = strTemp
                                                                    + ','
                                                                    + objArray[i];
                                                        else
                                                            strTemp = objArray[i];
                                                    }

                                                }
                                                me.advFilterSelectedClientCode = strTemp;
                                            }
                                        }

                                    }

                                }
                            }
                        }
                    });

                }
                menuRef.showBy(clientButton);
            }
        }
    },
    clientMenuAllHandler : function(item, checked) {
        var me = this;
        var menuRef = me.getClientMenu();
        var clientTextField = me.getClientTextField();
        var itemArray = menuRef.items.items;

        if (checked) {
            me.advFilterAllClientItemChecked = true;
            for (var index = 1; index < itemArray.length; index++) {
                itemArray[index].setChecked(true);
                var codeValue = itemArray[index].codeVal;
                if (codeValue != 'ALL') {
                    if (me.advFilterSelectedClientCode == '')
                        me.advFilterSelectedClientCode = codeValue;
                    else
                        me.advFilterSelectedClientCode = me.advFilterSelectedClientCode
                                + "," + codeValue;
                }
            }
            if (!Ext.isEmpty(clientTextField)) {
                clientTextField.setValue("");
                clientTextField.setValue(getLabel('all', 'All'));
            }
        } else if (!me.advFilterAllClientItemUnChecked && !checked) {
            me.advFilterAllClientItemChecked = false;
            me.advFilterAllClientItemUnChecked = false;
            for (var index = 1; index < itemArray.length; index++) {
                clientTextField.setValue('');
                itemArray[index].setChecked(false);
            }
        } else {
            me.advFilterAllClientItemUnChecked = false;
        }
    },
    updateClientTextField : function(item, checked) {
        var me = this;
        var maxCountReached = false;
        var menuRef = me.getClientMenu();

        if (!Ext.isEmpty(menuRef)) {
            var itemArray = menuRef.items.items;
            var itemArrayLength = itemArray.length;
            var clientTextField = me.getClientTextField();
            var textFieldData = '';

            if (!me.advFilterAllClientItemChecked && checked) {
                me.advFilterAllClientItemUnChecked = false;
                var count = 1;
                for (var index = 1; index < itemArrayLength; index++) {
                    if (itemArray[index].checked) {
                        textFieldData += itemArray[index].text + ',';
                        count++;

                    }
                }

                if (count == itemArrayLength) {
                    maxCountReached = true;
                }

            } else if (me.advFilterAllClientItemChecked && !checked) {
                if (itemArray[0].checked) {
                    me.advFilterAllClientItemUnChecked = true;
                    me.advFilterAllClientItemChecked = false;
                    itemArray[0].setChecked(false);
                }

                for (var index = 1; index < itemArrayLength; index++) {
                    if (itemArray[index].checked) {
                        textFieldData += itemArray[index].text + ',';
                    }
                }
            } else if (!me.advFilterAllClientItemChecked && !checked) {
                me.advFilterAllClientItemUnChecked = false;
                for (var index = 1; index < itemArrayLength; index++) {
                    if (itemArray[index].checked) {
                        textFieldData += itemArray[index].text + ',';
                    }
                }
            }

            if (maxCountReached) {
                itemArray[0].setChecked(true);
            } else {
                var commaSeparatedString = textFieldData.substring(0,
                        (textFieldData.length - 1));
                clientTextField.setValue('');
                clientTextField.setValue(commaSeparatedString);
            }
        }
    },
    addCorporationMenuItems : function() {
        var me = this;
        Ext.Ajax.request({
                    url : 'services/userseek/posPayCorp.json?$top=-1',
                    method : 'GET',
                    success : function(response) {
                        var responseData = Ext.decode(response.responseText);
                        var data = responseData.d.preferences;
                        me.loadCorporationMenu(data);
                    },
                    failure : function() {
                        console.log("Error Occured - Addition Failed");
                    }
                });
    },
    loadCorporationMenu : function(data) {
        var me = this;
        var corporationButton = me.getCorporationDropDown();
        var menuRef = me.getCorpMenu();
        if (!Ext.isEmpty(data)) {
            if (!Ext.isEmpty(menuRef)) {
                if (menuRef.items.length > 0) {
                    menuRef.removeAll();
                }
            }
            var count = data.length;
            if (count > 0 && entityType == 0) {
                menuRef.add({
                            xtype : 'menucheckitem',
                            text : getLabel('all', 'All'),
                            codeVal : 'ALL',
                            checked : me.advFilterAllCorpItemChecked,
                            listeners : {
                                checkchange : function(item, checked) {
                                    me.corpMenuAllHandler(item, checked);
                                    me.advFilterSelectedCorpCode = '';
                                }
                            }
                        });

                for (var index = 0; index < count; index++) {
                    var condition = (me.advFilterSelectedCorpCode
                            .indexOf(data[index].filterCode) != -1)
                            ? true
                            : false;
                    menuRef.add({
                        xtype : 'menucheckitem',
                        text : data[index].DESCR,
                        codeVal : data[index].CODE,
                        checked : (me.advFilterAllCorpItemChecked || condition)
                                ? true
                                : false,
                        listeners : {
                            checkchange : function(item, checked) {
                                me.updateCorpTextField(item, checked);
                                if (!me.advFilterAllCorpItemChecked) {
                                    if (checked) {
                                        if (!Ext
                                                .isEmpty(me.advFilterSelectedCorpCode)) {
                                            me.advFilterSelectedCorpCode = me.advFilterSelectedCorpCode
                                                    + "," + item.codeVal;
                                        } else {
                                            me.advFilterSelectedCorpCode = item.codeVal;
                                        }
                                    } else {
                                        // To handle

                                        var objArray = me.advFilterSelectedCorpCode
                                                .split(',');
                                        if (objArray.length > 0) {
                                            if (objArray[0] != 'All') {
                                                strTemp = '';
                                                for (var i = 0; i < objArray.length; i++) {
                                                    if (objArray[i] != item.codeVal) {
                                                        if (strTemp != '')
                                                            strTemp = strTemp
                                                                    + ','
                                                                    + objArray[i];
                                                        else
                                                            strTemp = objArray[i];
                                                    }

                                                }
                                                me.advFilterSelectedCorpCode = strTemp;
                                            }
                                        }

                                    }

                                }
                            }
                        }
                    });

                }
                menuRef.showBy(corporationButton);

            } else {
                me.handleEntityTypeForCorporationAdvFilter();
            }
        }
    },
    corpMenuAllHandler : function(item, checked) {
        var me = this;
        var menuRef = me.getCorpMenu();
        var corpTextField = me.getCorpTextField();
        var itemArray = menuRef.items.items;

        if (checked) {
            me.advFilterAllCorpItemChecked = true;
            for (var index = 1; index < itemArray.length; index++) {
                itemArray[index].setChecked(true);
            }
            if (!Ext.isEmpty(corpTextField)) {
                corpTextField.setValue("");
                corpTextField.setValue(getLabel('all', 'All'));
            }
        } else if (!me.advFilterAllCorpItemUnChecked && !checked) {
            me.advFilterAllCorpItemChecked = false;
            me.advFilterAllCorpItemUnChecked = false;
            for (var index = 1; index < itemArray.length; index++) {
                corpTextField.setValue('');
                itemArray[index].setChecked(false);
            }
        } else {
            me.advFilterAllCorpItemUnChecked = false;
        }
    },
    updateCorpTextField : function(item, checked) {
        var me = this;
        var maxCountReached = false;
        var menuRef = me.getCorpMenu();

        if (!Ext.isEmpty(menuRef)) {
            var itemArray = menuRef.items.items;
            var itemArrayLength = itemArray.length;
            var corpTextField = me.getCorpTextField();
            var textFieldData = '';

            if (!me.advFilterAllCorpItemChecked && checked) {
                me.advFilterAllCorpItemUnChecked = false;
                var count = 1;
                for (var index = 1; index < itemArrayLength; index++) {
                    if (itemArray[index].checked) {
                        textFieldData += itemArray[index].text + ',';
                        count++;

                    }
                }

                if (count == itemArrayLength) {
                    maxCountReached = true;
                }

            } else if (me.advFilterAllCorpItemChecked && !checked) {
                if (itemArray[0].checked) {
                    me.advFilterAllCorpItemUnChecked = true;
                    me.advFilterAllCorpItemChecked = false;
                    itemArray[0].setChecked(false);
                }

                for (var index = 1; index < itemArrayLength; index++) {
                    if (itemArray[index].checked) {
                        textFieldData += itemArray[index].text + ',';
                    }
                }
            } else if (!me.advFilterAllCorpItemChecked && !checked) {
                me.advFilterAllCorpItemUnChecked = false;
                for (var index = 1; index < itemArrayLength; index++) {
                    if (itemArray[index].checked) {
                        textFieldData += itemArray[index].text + ',';
                    }
                }
            }

            if (maxCountReached) {
                itemArray[0].setChecked(true);
            } else {
                var commaSeparatedString = textFieldData.substring(0,
                        (textFieldData.length - 1));
                corpTextField.setValue('');
                corpTextField.setValue(commaSeparatedString);
            }
        }
    },
    handleSavePreferences : function() {
        var me = this;
        if ($("#savePrefMenuBtn").attr('disabled'))
            event.preventDefault();
        else{    
            var arrPref = me.getPreferencesToSave(false);
            if (arrPref) {
                me.preferenceHandler.savePagePreferences(me.strPageName, arrPref,
                me.postHandleSavePreferences, null, me, true);
                }
            me.disablePreferencesButton("savePrefMenuBtn",true);
            me.disablePreferencesButton("clearPrefMenuBtn",false);    
        }    
        //me.doSavePreferences();
    },
    postHandleSavePreferences : function(data, args, isSuccess) {
                        var me = this;                        
                    },
    handleClearPreferences : function() {
        var me = this;
        if ($("#clearPrefMenuBtn").attr('disabled'))
            event.preventDefault();
        else{
            me.preferenceHandler.clearPagePreferences(me.strPageName, null,
                                me.postHandleClearPreferences, null, me, true);
            //me.doClearPreferences();
            me.disablePreferencesButton("clearPrefMenuBtn",true);    
            me.disablePreferencesButton("savePrefMenuBtn",false);
        }
    },
    postHandleClearPreferences : function(data, args, isSuccess) {
                        var me = this;
                    },

    disablePreferencesButton: function(btnId,boolVal){
        $("#"+btnId).attr("disabled",boolVal);
        if(boolVal)
            $("#"+btnId).css("color",'grey');
        else
            $("#"+btnId).css("color",'#FFF');
    },
    
    getPreferencesToSave : function(localSave) {
        var me = this;
        var groupView = me.getGroupView();
        var grid = null;
        var arrCols = null, objCol = null, arrColPref = null, arrPref = [], objFilterPref = null;
        var groupInfo = null, subGroupInfo = null;

        if (groupView) {
            grid = groupView.getGrid();
            var gridState = grid.getGridState();
            groupInfo = groupView.getGroupInfo() || '{}';
            subGroupInfo = groupView.getSubGroupInfo() || {};

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
                                'sortState' : gridState.sortState,
                                'gridSetting' : groupView.getGroupViewState().gridSetting
                            }
                        });

            }
        }

        objFilterPref = me.getFilterPreferences();
        arrPref.push({
                    "module" : "filterPref",
                    "jsonPreferences" : objFilterPref
                });

        return arrPref;
    },
    getFilterPreferences : function() {
        var me = this;
        var advFilterCode = null,strSqlDateFormat = 'Y-m-d';;
        var objFilterPref = {};
        if (!Ext.isEmpty(me.savePrefAdvFilterCode)) {
            advFilterCode = me.savePrefAdvFilterCode;
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
        objFilterPref.filterSelectedClientCode = me.clientCode;
        objFilterPref.filterSelectedClientDesc = me.clientDesc;
        return objFilterPref;
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
            '8' : getLabel('thisquarter', 'This Quarter'),
            '9' : getLabel('lastQuarterToDate', 'Last Quarter To Date'),
            '10' : getLabel('thisyear', 'This Year'),
            '11' : getLabel('lastyeartodate', 'Last Year To Date'),
            '13' : getLabel('daterange', 'Date Range'),
            '12' : getLabel('latest', 'Latest')
        };

        if (!Ext.isEmpty(objPositivePayIssuancePref)) {
            var objJsonData = Ext.decode(objPositivePayIssuancePref);
            var data = objJsonData.d.preferences.filterPref;
            if (data && !Ext.isEmpty(data.filterPanelCollapse)) {
                filterPanelCollapsed = data.filterPanelCollapse;
                me.filterCodeValue = data.advFilterCode;
            }
            if (!Ext.isEmpty(data)) {
                if(!Ext.isEmpty(data.filterSelectedClientCode) && data.filterSelectedClientCode !='all'){
                            me.clientCode = data.filterSelectedClientCode;
                            me.clientDesc = data.filterSelectedClientDesc;
            }
                var strDtValue = data.quickFilter.entryDate;
                var strDtFrmValue = data.quickFilter.entryDateFrom;
                var strDtToValue = data.quickFilter.entryDateTo;

                if (!Ext.isEmpty(strDtValue)) {
                    me.dateFilterLabel = objDateLbl[strDtValue];
                    me.dateFilterVal = strDtValue;
                    if (strDtValue === '13') {
                        if (!Ext.isEmpty(strDtFrmValue)){
                            me.dateFilterFromVal = strDtFrmValue;
                            me.datePickerSelectedDate[0]=Ext.Date.parse(strDtFrmValue, 'Y-m-d')
                        }
                        if (!Ext.isEmpty(strDtToValue)){
                            me.dateFilterToVal = strDtToValue;
                            me.datePickerSelectedDate[1]=Ext.Date.parse(strDtToValue, 'Y-m-d')
                        }    
                    }
                }
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
                            paramName : 'issuanceDate',
                            paramValue1 : strVal1,
                            paramValue2 : strVal2,
                            operatorValue : strOpt,
                            dataType : 'D'
                        });
        }
        if (isClientUser()) {
            $("#summaryClientFilterSpan").text(me.clientDesc);
        }else{
            $("#summaryClientFilter").val(me.clientDesc);
        }
        me.filterData = arrJsn;
    },
    applyQuickFilter : function() {
        var me = this;
        var objGroupView = me.getGroupView();
        var groupInfo = objGroupView.getGroupInfo();
        me.filterApplied = 'Q';

        // restting the adv filter changes
        //me.savePrefAdvFilterCode = '';
        /*var filterView = me.getPositivePayIssuanceFilterView();
        if (filterView)
            filterView.removeHighlight();*/

        me.refreshData();
    },
    applyAdvancedFilter : function(filterData) {
        var me = this;
        var objGroupView = me.getGroupView();
        me.filterApplied = 'A';
        me.setDataForFilter(filterData);
    //    me.refreshGridData();
        me.refreshData();
        $('#advancedFilterPopup').dialog('close');
        //me.resetAllFields(); 
        if (objGroupView)
            objGroupView.toggleFilterIcon(true);
        objGroupView.setFilterToolTip(me.showAdvFilterCode || '');
    },
    
    refreshGridData : function() {
        var me = this;
        var groupView = me.getGroupView();
        var grid = groupView.getGrid();        
        var groupInfo = groupView.getGroupInfo() || '{}';
        var subGroupInfo = groupView.getSubGroupInfo() || {};
        var oldPageNum = 1;
        var current = 1;
        me.doHandleLoadGridData(groupInfo, subGroupInfo,grid, grid.store.dataUrl, grid.pageSize, 1, 1, null, null);
    },
    handleIssueDateSync : function(valueChangedAt, sourceLable, sourceToolTipText, sourceTextRef) {
        var me = this, labelToChange, valueControlToChange, updatedDateValue;
        
        labelToChange = (valueChangedAt === 'Q') ? $('label[for="issunceDateAdvLabel"]') : me.getDateLabel();
        valueControlToChange = (valueChangedAt === 'Q') ? $('#issuanceAdvDate') : $('#issueDatePickerQuickText');
        updatedDateValue = sourceTextRef.getDateRangePickerValue();
        
        if(labelToChange && valueControlToChange && valueControlToChange.hasClass('is-datepick')) {
            if(valueChangedAt === 'Q') {
                labelToChange.text(sourceLable);
                updateToolTip('issuanceAdvDate', sourceToolTipText);
            } else {
                labelToChange.setText(sourceLable);
            }
            if(!Ext.isEmpty(updatedDateValue)) {
                valueControlToChange.datepick('setDate', updatedDateValue);
            }
        }
    },
    resetFieldInAdvAndQuickOnDelete : function(objData){
        var me = this,strFieldName;
        if(!Ext.isEmpty(objData))
            strFieldName = objData.paramName || objData.field;
        
        if(strFieldName === 'clientId'){
            $('#clientSelect').val('all');
        }else if(strFieldName === 'accountNumber'){
            resetAllMenuItemsInMultiSelect("#accountSelect");
        }else if(strFieldName === 'actionStatus'){
            $("#actionStatus").val("");
        }else if(strFieldName === 'fileName'){
            $("#fileName").val("");
        }else if(strFieldName === 'voidIndicator'){
            $("input[type='checkbox'][id='voidCheckbox']").prop('checked',
                false);
        }else if(strFieldName === 'amount'){
            $("#amountOperator").val($("#amountOperator option:first").val());
            handleAmountOperatorChange(me);
            $("#amountFieldFrom").val("");
            $("#amountFieldTo").val("");
        }else if(strFieldName === 'payeeName'){
            $("#payeeText").val("");
        }else if(strFieldName === 'description'){
            $("#descriptionText").val("");
        }else if(strFieldName === 'serialNumber'){
            $("#serial").val("");
        }else if(strFieldName === 'issuanceDate'){
            var datePickerRef = $('#issueDatePickerQuickText');
            me.dateFilterVal = '';
            me.getDateLabel().setText(getLabel('issunceDateAdvLbl', 'Issuance Date'));
            datePickerRef.val('');
            selectedIssuanceDate={};
            $("#issuanceAdvDate").val("");
            $('label[for="issunceDateAdvLabel"]').text(getLabel('issunceDateAdvLbl', 'Issuance Date'));
        }else if(strFieldName === 'createDate'){
            $("#createAdvDate").val("");
            selectedCreateDate={};
            }
        
    },
    resetAllFields : function() {
        var me = this;
        var datePickerRef = $('#issueDatePickerQuickText');
        //resetAllMenuItemsInMultiSelect("#clientSelect");
        $('#clientSelect').val('all');
		resetMenuItemsInMultiSelect("#corporationSelect");
		resetAllMenuItemsInMultiSelect("#accountSelect");
	    setAccountMenuItems('#accountSelect');
        $("#issuanceAdvDate").val("");
        selectedIssuanceDate={};
        //me.dateFilterVal = '';        
        datePickerRef.val('');
            
        $("#createAdvDate").val("");
        selectedCreateDate={};
		resetAllMenuItemsInMultiSelect("#actionStatus");
	    setActionStatusMenuItems('#actionStatus');
        //$("#txnStatus").val("");
        $("#fileName").val("");
        $("input[type='checkbox'][id='voidCheckbox']").prop('checked',
                false);
        $("#amountOperator").val($("#amountOperator option:first").val());
        handleAmountOperatorChange(me);
        $("#amountFieldFrom").val("");
        $("#amountFieldTo").val("");
        $("#payeeText").val("");
        $("#descriptionText").val("");
        $("#serial").val("");
        $("input[type='text'][id='savedFilterAs']").val("");
        $("input[type='text'][id='savedFilterAs']").prop('disabled', false);
        $('label[for="issunceDateAdvLabel"]').text(getLabel('issunceDateAdvLbl', 'Issuance Date'));
        me.resetIssuenceDate();
        $("#saveFilterChkBox").attr('checked', false);
        $("#msSavedFilter").val("");
        $("#msSavedFilter").multiselect("refresh");
    },
    resetIssuenceDate: function(){
		var me = this;
		var objDateParams =null;
		var label = null;
		
			objDateParams = me.getDateParam('1');
			label = getDateIndexLabel('1');
		
		/*var vFromDate = Ext.util.Format.date(Ext.Date.parse(objDateParams.fieldValue1, 'Y-m-d'), strExtApplicationDateFormat);
		var vToDate = Ext.util.Format.date(Ext.Date.parse(objDateParams.fieldValue2, 'Y-m-d'), strExtApplicationDateFormat);*/
		var vFromDate = Ext.Date.parse(objDateParams.fieldValue1, 'Y-m-d');
		var vToDate = Ext.Date.parse(objDateParams.fieldValue2, 'Y-m-d');
		$('#issueDatePickerQuickText').setDateRangePickerValue([vFromDate, vToDate]);
		$('#issuanceAdvDate').setDateRangePickerValue([vFromDate, vToDate]);
		
		selectedIssueDate = {
				operator : 'bt',
				fromDate : vFromDate,
				toDate : vToDate,
				dateLabel : label
		};
		me.getDateLabel().setText(getLabel('issunceDateAdvLbl', 'Issuance Date') + " (" + selectedIssueDate.dateLabel + ")")
		updateToolTip('issueDatePickerQuickText',  " (" + selectedIssueDate.dateLabel + ")");
		$('label[for="issunceDateAdvLabel"]').text(getLabel('issunceDateAdvLbl', 'Issuance Date') + " (" + selectedIssueDate.dateLabel + ")");
		updateToolTip('issuanceAdvDate',  " (" + selectedIssueDate.dateLabel + ")");
	},
    resetQuickFilterConfigs : function() {
        var me = this;
        me.dateFilterVal = '';
        me.dateFilterFromVal = '';
        me.dateFilterToVal = '';
        me.getDateLabel().setText(getLabel('issueDate', 'Issuance Date')
                + "(Latest)");
        me.getFromDateLabel().setText("");
        me.getToDateLabel().setText("");
        me.getDateRangeComponent().hide();
        me.getFromDateLabel().hide();
        me.getToDateLabel().hide();
    },
    reflectAdvFilterDateToQuickFilter : function(objCreateNewFilterPanel) {
        var me = this;
        var textVal = '';
        if (!Ext.isEmpty(objCreateNewFilterPanel)) {

            var tempAdvData = me.advFilterData;
            var menuItems = objCreateNewFilterPanel
                    .down('menu[itemId="issuanceDateMenu"]');

            if (!Ext.isEmpty(tempAdvData)) {
                me.resetQuickFilterConfigs();
                for (var index = 0; index < tempAdvData.length; index++) {
                    var data = tempAdvData[index];
                    var fieldName = data.field;
                    if (fieldName == 'issuanceDate') {
                        me.dateFilterVal = data.dateIndexVal;
                        var itemMenu = menuItems.down("[btnValue="
                                + data.dateIndexVal + "]")
                        if (!Ext.isEmpty(itemMenu)) {
                            textVal = itemMenu.text;
                        }
                        var objDateParams = me.getDateParam(data.dateIndexVal);
                        if (me.dateFilterVal != 7) {
                            me.dateFilterFromVal = data.value1;
                            if (!Ext.isEmpty(data.value1)) {
                                formattedFromDate = Ext.util.Format.date(
                                        Ext.Date.parse(
                                                objDateParams.fieldValue1,
                                                'Y-m-d'),
                                        strExtApplicationDateFormat);
                            }
                            me.dateFilterToVal = data.value2;
                            if (!Ext.isEmpty(data.value2)) {
                                formattedToDate = Ext.util.Format.date(
                                        Ext.Date.parse(
                                                objDateParams.fieldValue2,
                                                'Y-m-d'),
                                        strExtApplicationDateFormat);
                            }
                            me.getDateLabel().setText(getLabel('issueDate',
                                    'Issuance Date')
                                    + " (" + textVal + ")");
                            me.getFromDateLabel().setText(formattedFromDate);
                            me.getToDateLabel().setText("-" + formattedToDate);
                            me.getDateRangeComponent().hide();
                            me.getFromDateLabel().show();
                            me.getToDateLabel().show();
                        } else {
                            me.dateFilterFromVal = data.value1;
                            if (!Ext.isEmpty(data.value1)) {
                                formattedFromDate = Ext.util.Format.date(
                                        Ext.Date.parse(data.value1, 'Y-m-d'),
                                        strExtApplicationDateFormat);
                            }
                            me.dateFilterToVal = data.value2;

                            if (!Ext.isEmpty(data.value2)) {
                                formattedToDate = Ext.util.Format.date(Ext.Date
                                                .parse(data.value2, 'Y-m-d'),
                                        strExtApplicationDateFormat);
                            }
                            me.getDateLabel().setText(getLabel('issueDate',
                                    'Issuance Date')
                                    + " (" + textVal + ")");
                            me.getDateRangeComponent().show();
                            me.getFromDateLabel().hide();
                            me.getToDateLabel().hide();
                            me.getFromEntryDate()
                                    .setValue(me.dateFilterFromVal);
                            me.getToEntryDate().setValue(me.dateFilterToVal);
                        }

                    }
                }
            }
        }

    },
    setDataForFilter : function() {
        var me = this;
        
        if (me.filterApplied === 'Q') {
            me.filterData = me.getQuickFilterQueryJson();
            
        } else if (me.filterApplied === 'A') {
            me.filterData = me.getQuickFilterQueryJson();
            var objJson = getAdvancedFilterQueryJson();
            var reqJson = me.findInAdvFilterData(objJson, "issuanceDate");
            if (!Ext.isEmpty(reqJson)) {
                arrQuickJson = me.filterData;
                arrQuickJson = me.removeFromQuickArrJson(arrQuickJson, "issuanceDate");
                me.filterData = arrQuickJson;
            }
            
             reqJson = me.findInAdvFilterData(objJson, "clientId");
            if (!Ext.isEmpty(reqJson)) {
                arrQuickJson = me.filterData;
                arrQuickJson = me
                        .removeFromQuickArrJson(arrQuickJson, "clientId");
                me.filterData = arrQuickJson;
            }
            me.advFilterData = objJson;
            var filterCode = $("input[type='text'][id='savedFilterAs']").val();
            me.advFilterCodeApplied = filterCode;
        }
        if (me.filterApplied === 'ALL') {
            me.filterData = me.getQuickFilterQueryJson();
        }
    },
    getQuickFilterQueryJson : function() {
        var me = this;
        var jsonArray = [];
        var clientCode = me.clientCode;
        var index = me.dateFilterVal;
        var objDateParams = me.getDateParam(index);
        if (!Ext.isEmpty(index)){
        jsonArray.push({
                    paramName : 'issuanceDate',
                    paramValue1 : objDateParams.fieldValue1,
                    paramValue2 : objDateParams.fieldValue2,
                    operatorValue : objDateParams.operator,
                    dataType : 'D',
                    //displayType : 5,
                    fieldLabel : getLabel('issueDate', 'Issuance Date'),
                    displayValue1 : objDateParams.fieldValue1
                });
        }
    if (!Ext.isEmpty(me.clientCode) && me.clientCode != 'all' && !Ext.isEmpty( me.clientDesc) )     {
            jsonArray.push({
                        paramName : 'clientId',
                        paramValue1 : encodeURIComponent(me.clientCode.replace(new RegExp("'", 'g'), "\''")),
                        operatorValue : 'eq',
                        dataType : 'S',
                        displayType : 5,
						fieldLabel : getLabel('company12','Company Name'),
                        displayValue1 :  me.clientDesc
                    });
        }
        return jsonArray;
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
    handleDateChange : function(index) {
        var me = this;
        var filterView = me.getPositivePayIssuanceFilterView();
        var objDateParams = me.getDateParam(index, null);
        var datePickerRef = $('#issueDatePickerQuickText');

        if (!Ext.isEmpty(me.dateFilterLabel)) {
            me.getDateLabel().setText(getLabel('date', 'Issuance Date') + " ("
                    + me.dateFilterLabel + ")");
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
            if (index === '1' || index === '2' || index === '12') {
                if (index === '12') {
                    datePickerRef.val('Till' + '  ' + vFromDate);
                } else {
                    datePickerRef.setDateRangePickerValue(vFromDate);
                }
            } else {
                datePickerRef.setDateRangePickerValue([vFromDate, vToDate]);
            }
        }
        me.handleIssueDateSync('Q', me.getDateLabel().text, " (" + me.dateFilterLabel + ")", datePickerRef);
    },
    toggleSavePrefrenceAction : function(isVisible) {
        var me = this;
        var btnPref = me.getBtnSavePreferences();
        if (!Ext.isEmpty(btnPref))
            btnPref.setDisabled(!isVisible);
        // TODO : To be handled
        var arrStdViewPref = {};

        var objMainNode = {};
        var objpreferences = {};
        objpreferences.preferences = arrStdViewPref;
        objMainNode.d = objpreferences;
        /*
         * me.localPreHandler.fireEvent('savePreferencesToLocal', objMainNode,
         * isVisible, me.pageKey);
         */
    },
    toggleClearPrefrenceAction : function(isVisible) {
        var me = this;
        var btnPref = me.getBtnClearPreferences();
        if (!Ext.isEmpty(btnPref))
            btnPref.setDisabled(!isVisible);
    },
    handleExportAction : function(btn, opts) {
        var me = this;
        me.downloadReport(btn.itemId);
    },
    handleCreateNewIssuancePopUpClick : function() {
        var me = this;
        // this.getForm().reset(true);
        me.resetPopUp();
        createNewIssuance('NEW');//Bharat
    },
    createNewIssuance : function(mode) {
        var me = this;
        modeVal = mode;
        var objWindow = Ext.create('GCP.view.PositivePayIssuancePopUp', {
                    itemId : 'positivePayPopUp'
                });
        me.addCorporationMenuItemsToPositivePayPopUp();

        if (modeVal == 'NEW') {
            if (entityType == 1)
                me.addClientMenuItemsToPositivePayPopUp();
        } else {
            me.addClientMenuItemsToPositivePayPopUp();
            me.addAccountMenuItemsToPositivePayPopUp();
        }
        if (!Ext.isEmpty(objWindow))
            objWindow.show();
    },
    addAccountMenuItemsToPositivePayPopUp : function() {
        var me = this;
        Ext.Ajax.request({
                    url : 'services/positivePayAccountList.json',
                    method : 'GET',
                    async : false,
                    success : function(response) {
                        var responseData = Ext.decode(response.responseText);
                        var data = responseData.d;
                        me.loadAccountMenuToPositivePayPopUp(data);
                    },
                    failure : function() {
                        console.log("Error Occured - Addition Failed");
                    }
                });
    },
    loadAccountMenuToPositivePayPopUp : function(data) {
        var me = this;
        var comboRefAccount = me.getPosPayAccountCombo();
        var arrJsonAccount = new Array();
        if (!Ext.isEmpty(data)) {
            var count = data.length;
            if (count > 0) {
                for (var index = 0; index < count; index++) {
                    arrJsonAccount.push({
                                "DESCR" : data[index].filterValue + " ("
                                        + data[index].additionalValue2 + ")",
                                "CODE" : data[index].filterCode
                            });
                }
            }
            comboRefAccount.store.removeAll();
            comboRefAccount.store.loadRawData(arrJsonAccount);
        } else {
            comboRefAccount.store.removeAll();
        }
    },
    addCorporationMenuItemsToPositivePayPopUp : function() {
        var me = this;
        Ext.Ajax.request({
                    url : 'services/userseek/posPayCorp.json?$top=-1',
                    async : false,
                    method : 'GET',
                    success : function(response) {
                        var responseData = Ext.decode(response.responseText);
                        var data = responseData.d.preferences;
                        me.loadCorporationMenuToPositivePayPopUp(data);
                    },
                    failure : function() {
                        console.log("Error Occured - Addition Failed");
                    }
                });
    },
    loadCorporationMenuToPositivePayPopUp : function(data) {
        var me = this;
        var comboRef = me.getPosPayCorpCombo();
        var arrJsonCorp = new Array();
        if (!Ext.isEmpty(data)) {
            var count = data.length;
            if (count > 0) {
                for (var index = 0; index < count; index++) {
                    arrJsonCorp.push({
                                "DESCR" : data[index].DESCR,
                                "CODE" : data[index].CODE
                            });
                }
            }
            comboRef.store.removeAll();
            comboRef.store.loadRawData(arrJsonCorp);
            me.handleEntityTypeForCorporation(comboRef);
        }
    },
    handleEntityTypeForCorporation : function(comboRef) {
        if (entityType == 1) {
            comboRef.setValue(sessionCorporation);
            comboRef.setDisabled(true);
        }
    },
    handleImportIssuancePopUpClick : function() {
      importIssuance();
        /*var me = this;
        var objWindow = Ext.create('GCP.view.PositivePayIssuanceImportPopUp', {
                    itemId : 'positivePayImportPopUp'
                });
        me.addSellerMenuItemsToImportPopUp();
        if (!Ext.isEmpty(objWindow)){
                  //objWindow.show();
              importIssuance();
            }*/
    },
    handleEntityTypeForCorporationAdvFilter : function() {
        var me = this;
        var objCreateNewFilterPanel = me.getCreateNewFilter();
        var textfieldCorp = objCreateNewFilterPanel
                .down('textfield[itemId=corporationText]');
        var btnCorp = objCreateNewFilterPanel
                .down('button[itemId=corporationDropDown]');

        if (entityType == 1) {
            me.advFilterSelectedCorpCode = sessionCorporation;
            textfieldCorp.setValue(sessionCorpDesc);
            textfieldCorp.setDisabled(true);
            btnCorp.setDisabled(true);
        }
    },
    addClientMenuItemsToPositivePayPopUp : function() {
        var me = this;
        var strUrl = 'services/positivePayClientList.json';
        if (entityType == 1) {
            if (!Ext.isEmpty(sessionCorporation)) {
                strUrl = strUrl + '?$corpId=' + sessionCorporation;
            }
        }

        /*
         * if (!Ext.isEmpty(me.advFilterSelectedCorpCode)) { strUrl = strUrl +
         * '?$corpId=' + me.advFilterSelectedCorpCode; }
         */Ext.Ajax.request({
                    url : strUrl,
                    method : 'GET',
                    async : false,
                    success : function(response) {
                        var responseData = Ext.decode(response.responseText);
                        var data = responseData.d;
                        me.loadClientsMenuToPositivePayPopUp(data);
                        setPopUpAccountMenuItems();
                    },
                    failure : function() {
                        console.log("Error Occured - Addition Failed");
                    }
                });
    },
    loadClientsMenuToPositivePayPopUp : function(data) {
        var me = this;
        var comboRefClient = me.getPosPayClientCombo();
        var arrJsonClient = new Array();
        if (!Ext.isEmpty(data)) {
            var count = data.length;
            if (count > 0) {
                for (var index = 0; index < count; index++) {
                    arrJsonClient.push({
                                "DESCR" : data[index].filterValue,
                                "CODE" : data[index].filterCode
                            });
                }
            }
            comboRefClient.store.removeAll();
            comboRefClient.store.loadRawData(arrJsonClient);
            me.handleEntityClient(comboRefClient);
        } else {
            comboRefClient.store.removeAll();
        }
    },
    handleEntityClient : function(comboRefClient) {
        var me = this;
        if (entityType == 1) {
            comboRefClient.setValue(me.clientDesc);
            // comboRef.setDisabled(true);
        }
    },
    changeClientStore : function(actionName) {
        var me = this;
        var strUrl = 'services/positivePayClientList.json';
        if (!Ext.isEmpty(actionName)) {
            strUrl = strUrl + '?$corpId=' + actionName;
        }
        Ext.Ajax.request({
                    url : strUrl,
                    method : 'GET',
                    async : false,
                    success : function(response) {
                        var responseData = Ext.decode(response.responseText);
                        var data = responseData.d;
                        me.loadClientsMenuToPositivePayPopUp(data);
                    },
                    failure : function() {
                        console.log("Error Occured - Addition Failed");
                    }
                });
    },
    changeAccountsStore : function(actionName) {
        var me = this;
        var strUrl = 'services/positivePayAccountList.json';
        if (!Ext.isEmpty(actionName)) {
            strUrl = strUrl + '?$clientId=' + actionName;
        }
        Ext.Ajax.request({
                    url : strUrl,
                    method : 'GET',
                    async : false,
                    success : function(response) {
                        var responseData = Ext.decode(response.responseText);
                        var data = responseData.d;
                        me.loadAccountMenuToPositivePayPopUp(data);
                    },
                    failure : function() {
                        console.log("Error Occured - Addition Failed");
                    }
                });
    },
    downloadReport : function(actionName) {
        var me = this;
        var withHeaderFlag = document.getElementById("headerCheckbox").checked;
        var arrExtension = {
            downloadXls : 'xls',
            downloadCsv : 'csv',
            downloadPdf : 'pdf',
            downloadTsv : 'tsv'
        };
        var currentPage = 1;
        var strExtension = '', strUrl = '', strSelect = '', strFilterUrl = '';

        var grid = null, count = 0, objOfSelectedGridRecord = null, objOfGridSelected = null;
        var objGroupView = me.getGroupView();
        var arrSelectedrecordsId = [];
        if (!Ext.isEmpty(objGroupView))
            grid = objGroupView.getGrid();

        if (!Ext.isEmpty(grid)) {
            var objOfRecords = grid.getSelectedRecords();
            if (!Ext.isEmpty(objOfRecords)) {
                objOfGridSelected = grid;
                objOfSelectedGridRecord = objOfRecords;
            }
        }
        if ((!Ext.isEmpty(objOfGridSelected))
                && (!Ext.isEmpty(objOfSelectedGridRecord))) {
            for (var i = 0; i < objOfSelectedGridRecord.length; i++) {
                arrSelectedrecordsId.push(objOfSelectedGridRecord[i].data.identifier);
            }
        }
        var colMap = new Object();
        var colArray = new Array();
        var temp = new Array();
        var counter = 0;
        var visColsStr = "";
        var col = null;
        var viscols;
        strExtension = arrExtension[actionName];
        strUrl = 'services/positivePayIssuanceExport.' + strExtension;
        strUrl += '?$skip=1';
        strFilterUrl = "";
        strAdvancedFilterUrl = "";

        var strOrderBy = me.reportGridOrder;
        if (!Ext.isEmpty(strOrderBy)) {
            var orderIndex = strOrderBy.indexOf('orderby');
            if (orderIndex > 0) {
                strOrderBy = strOrderBy.substring(orderIndex - 2,
                        strOrderBy.length);
                strUrl += strOrderBy;
            }
        }
        var objGroupView = me.getGroupView();
        var groupInfo = objGroupView.getGroupInfo();
        var subGroupInfo = objGroupView.getSubGroupInfo();
        strFilterUrl += me.generateFilterUrl(subGroupInfo, groupInfo);

        /*
         * if (!Ext.isEmpty(strExtension)) strUrl += '&$extension=' +
         * strExtension;
         */
        if (!Ext.isEmpty(strFilterUrl))
            strUrl += strFilterUrl;
        if (!Ext.isEmpty(strAdvancedFilterUrl)) {
            strUrl += ' and ' + strAdvancedFilterUrl;
            isFilterApplied = true;
        }

        var objGroupView = me.getGroupView();
        var grid = objGroupView.getGrid();

        for (var cnt = 1; cnt < grid.columns.length; cnt++) {
            if (grid.columns[cnt].hidden == false) {
                temp[counter++] = grid.columns[cnt];
            }
        }
        viscols = temp;

        for (var j = 0; j < viscols.length; j++) {
            col = viscols[j];
            if (col.dataIndex && arrSortColumn[col.dataIndex]) {
                if (colMap[arrSortColumn[col.dataIndex]]) {
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
        form.appendChild(me.createFormField('INPUT', 'HIDDEN', 'txtCSVFlag',
                withHeaderFlag));
        for(var i=0; i<arrSelectedrecordsId.length; i++){
            form.appendChild(me.createFormField('INPUT', 'HIDDEN', 'identifier',
                    arrSelectedrecordsId[i]));
        }    
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
    setEnabledAmount : function(records) {
        var me = this;
        var posPayAmountRef = me.getAmountField();
        posPayAmountRef.setDisabled(true);
        if (records[0].data.amountTypeDesc === 'Select')
            posPayAmountRef.setDisabled(true);
        else
            posPayAmountRef.setDisabled(false);
    },
    addClientMenuItemsToImportPopUp : function(selectedSellerCode) {
        var me = this;
        var strUrl = 'services/positivePayClientList.json?' + '$sellerCode='
                + selectedSellerCode;
        if (entityType == 1) {
            if (!Ext.isEmpty(sessionCorporation)) {
                strUrl = strUrl + '?$corpId=' + sessionCorporation;
            }
        }
        Ext.Ajax.request({
                    url : strUrl,
                    method : 'GET',
                    async : false,
                    success : function(response) {
                        var responseData = Ext.decode(response.responseText);
                        var data = responseData.d;
                        me.loadClientsMenuToImportPopUp(data);
                    },
                    failure : function() {
                        // console.log("Error Occured - Addition Failed");
                    }
                });
    },
    loadClientsMenuToImportPopUp : function(data) {
        var me = this;
        var comboRefClient = me.getPosPayImportClientCombo();
        var arrJsonClient = new Array();
        if (!Ext.isEmpty(data)) {
            var count = data.length;
            if (count > 0) {
                for (var index = 0; index < count; index++) {
                    arrJsonClient.push({
                                "DESCR" : data[index].filterValue,
                                "CODE" : data[index].filterCode
                            });
                }
            }
            comboRefClient.store.removeAll();
            comboRefClient.store.loadRawData(arrJsonClient);
        } else {
            comboRefClient.store.removeAll();
        }
    },
    addSellerMenuItemsToImportPopUp : function() {
        var me = this;
        var strUrl = 'services/userseek/sellerSeek.json';
        if (entityType == 1) {
            if (!Ext.isEmpty(sessionCorporation)) {
                strUrl = strUrl + '?$corpId=' + sessionCorporation;
            }
        }
        Ext.Ajax.request({
                    url : strUrl,
                    method : 'GET',
                    async : false,
                    success : function(response) {
                        var responseData = Ext.decode(response.responseText);
                        var data = responseData.d.preferences;
                        me.loadSellersMenuToImportPopUp(data);
                    },
                    failure : function() {
                        // console.log("Error Occured - Addition Failed");
                    }
                });
    },
    loadSellersMenuToImportPopUp : function(data) {
        var me = this;
        var comboRefSeller = me.getPosPayImportFICombo();
        var arrJsonSeller = new Array();
        if (!Ext.isEmpty(data)) {
            var count = data.length;
            if (count > 0) {
                for (var index = 0; index < count; index++) {
                    arrJsonSeller.push({
                                "DESCR" : data[index].DESCRIPTION,
                                "CODE" : data[index].CODE
                            });
                }
            }
            comboRefSeller.store.removeAll();
            comboRefSeller.store.loadRawData(arrJsonSeller);
        } else {
            comboRefSeller.store.removeAll();
        }
    },
    handleImportFIselect : function(combo, records, eOpts) {
        var me = this;
        selectedSellerCode = records[0].data.CODE;
        me.addClientMenuItemsToImportPopUp(selectedSellerCode);
        if(typeof doClearMessageSection != 'undefined'
                    && typeof doClearMessageSection === 'function')
            doClearMessageSection();
    },
    
    handleClientChangeInQuickFilter : function(isSessionClientFilter) {
        var me = this;
        if (isSessionClientFilter)
            me.clientCode = selectedFilterClient;
        else
            me.clientCode = isEmpty(selectedClient)
                    ? 'all'
                    : selectedClient;
        me.clientDesc = selectedClientDesc;// combo.getRawValue();
        quickFilterClientValSelected = me.clientCode;
        quickFilterClientDescSelected = me.clientDesc;
        me.filterApplied = 'Q';
        me.setDataForFilter();
        if (me.clientCode === 'all') {
            me.showAdvFilterCode = null;
            me.filterApplied = 'ALL';
            me.refreshData();

        } else {
            //me.applyFilter();
            me.applyQuickFilter();
            
        }
    },
    
    handleClearSettings : function() {
        
        var me = this;
        var datePickerRef = $('#issueDatePickerQuickText');
        me.clientFilterVal = 'all';
        me.clientCode ='all';
        me.clientDesc=getLabel('allCompanies', 'All companies');
        me.savedFilterVal = '';
        var savedFilterComboBox = me.getPositivePayIssuanceFilterView()
                .down('combo[itemId="savedFiltersCombo"]');
        savedFilterComboBox.setValue(me.savedFilterVal);
        me.dateFilterVal = '1';
        me.dateFilterLabel = 'Today';
        me.handleDateChange(me.dateFilterVal);
        me.getDateLabel().setText(getLabel('issunceDateAdvLbl', 'Issuance Date'));
        datePickerRef.val('');
        me.filterApplied = 'Q';
        me.advFilterData = {};
        me.filterData = {};
        me.resetAllFields();
        me.setDataForFilter();
        me.refreshData();
    },
    handleClientChange : function(client, clientDesc) {
        var me = this;
        var objGroupView = me.getGroupView();
        var groupInfo = objGroupView.getGroupInfo();

        me.filterApplied = 'Q';
        me.advFilterData = null;

        me.clientCode = client;
        me.clientDesc = clientDesc;
        me.advFilterSelectedClientCode = client;
        me.advFilterSelectedClientDesc = clientDesc;
        if (!Ext.isEmpty(me.objAdvFilterPopup)) {
            var clientTextFieldRef = me.getClientTextField();
            clientTextFieldRef.setValue(clientDesc);
            clientTextFieldRef.clientCodesData = client;
        }
        // TODO: To be handled
        me.setDataForFilter();
        if (me.clientCode === 'all') {
            me.showAdvFilterCode = null;
            me.filterApplied = 'ALL';
            if (groupInfo && groupInfo.groupTypeCode === 'ADVFILTER') {
                objGroupView.setActiveTab('all');
            } else
                me.refreshData();
        } else {
            me.filterApplied = 'Q';
            me.applyQuickFilter();
        }
        me.toggleSavePrefrenceAction(true);
    },
    disableActions : function(canDisable) {
            if (canDisable)
                $('.canDisable').addClass('button-grey-effect');
            else
                $('.canDisable').removeClass('button-grey-effect');
    },
    assignSavedFilter: function(){
        var me= this;
        if(me.firstTime){
            me.firstTime = false;
            
            if (objPositivePayIssuancePref) {
                var objJsonData = Ext.decode(objPositivePayIssuancePref);
                if (!Ext.isEmpty(objJsonData.d.preferences)) {
                    if (!Ext
                            .isEmpty(objJsonData.d.preferences.GeneralSetting)) {
                        if (!Ext
                                .isEmpty(objJsonData.d.preferences.GeneralSetting.defaultFilterCode)) {
                            var advData = objJsonData.d.preferences.GeneralSetting.defaultFilterCode;
                            if(advData === me.getPositivePayIssuanceFilterView().down('combo[itemId="savedFiltersCombo"]').getValue()){
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
    }
});