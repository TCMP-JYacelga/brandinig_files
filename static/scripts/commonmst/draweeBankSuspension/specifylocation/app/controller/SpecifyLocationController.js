Ext.define('GCP.controller.SpecifyLocationController', {
    extend : 'Ext.app.Controller',
    requires : ['GCP.view.SpecifyLocationEntryView'],
    views : ['GCP.view.SpecifyLocationEntryView',
            'GCP.view.SpecifyLocationSelectionPopUp'],
    refs : [{
                ref : 'specifyLocationEntryView',
                selector : 'specifyLocationEntryView'
            },{
                ref : 'specifyLocationSelectionPopUp',
                selector : 'specifyLocationSelectionPopUp'
            },{
                ref : 'locationsGrid',
                selector : 'specifyLocationEntryView grid[itemId="locationsGrid"]'
            }, {
                ref : 'selectLocationsGrid',
                selector : 'specifyLocationSelectionPopUp grid[itemId="selectLocationsId"]'
            },{
                ref : 'btnFilterLoc',
                selector : 'specifyLocationSelectionPopUp textfield[itemId="btnFilterLoc"]'
            }, {
                ref : 'searchLocText',
                selector : 'specifyLocationSelectionPopUp textfield[itemId="searchLocText"]'
            },{
                ref : 'locSelectionContainer',
                selector : 'specifyLocationEntryView container[itemId="locSelectionContainer"]'
            },{
                ref : 'prfMstDtlView',
                selector : 'specifyLocationEntryView panel[itemId="prfMstDtlView"]'
            },{
                ref : 'prfMstActionsView',
                selector : 'specifyLocationEntryView container[itemId="prfMstActionsView"]'
            }, {
                ref : 'discardBtn',
                selector : 'specifyLocationEntryView toolbar[itemId="dtlsActionBar"] [actionName="unassign"]'
            }],
    config : {},
    init : function() {
        var me = this;
        $(document).on('handleViewChanges',function() {
            me.refreshGrid();
        });
        me.control({
            'specifyLocationEntryView' : {
                render : function(panel, opts) {
                    me.handleSmartGridConfig();
                },
                afterrender : function(panel, opts) {
                    if (mode == 'VERIFY' || mode == 'VIEW' || mode == 'SUBMIT') {
                                    me.getPrfMstActionsView().hide();
                                    me.getLocSelectionContainer().hide();
                                }
                }
            },
            'specifyLocationEntryView smartgrid' : {
                render : function(grid) {
                    me.handleLoadGridData(grid, grid.store.dataUrl,
                            grid.pageSize, 1, 1, null);
                },
                gridPageChange : me.handleLoadGridData,
                gridSortChange : me.handleLoadGridData,
                gridRowSelectionChange : function(grid, record, recordIndex,
                        records, jsonData) {
                    me.enableDiscardPrMstAction();
                }
            },
            'specifyLocationEntryView button[itemId="selectLocBtn"]' : {
                click : function(btn, opts) {
                    me.showSelectLocationsPopUp();
                }
            },
            'specifyLocationSelectionPopUp button[itemId="btnOkSelectLocation"]' : {
                click : function(btn, opts) {
                    me.saveItems(btn);
                }
            },
            'specifyLocationSelectionPopUp button[itemId="btnFilterLoc"]' : {
                click : function(btn, opts) {
                    var popUp= me.getSpecifyLocationSelectionPopUp();
                    var textfield = me.getSearchLocText();
                    var grid = me.getSelectLocationsGrid();
                    me.performSearch(popUp,textfield,grid);
                }
            },
            'specifyLocationEntryView toolbar[itemId="dtlsActionBar"] button[itemId="unassignBtn"]' : {
                click : function(btn, opts) {
                    me.saveItems(btn);
                }
            }
        });
    },
    performSearch: function(popUp,textfield,grid){
        var me=this;
        popUp.setSearchValue(textfield.value);
        grid.refreshData();
    },
    saveItems : function(btn) {
        var me = this;
        var grid = null;
        if (btn.itemId == "btnOkSelectLocation") {
            grid = me.getSelectLocationsGrid();
            btn.setDisabled(true);
        } else {
            grid = me.getLocationsGrid();
        }
        if (!Ext.isEmpty(grid)) {
            var arrayJson = new Array();
            var records = grid.getSelectedRecords();
            for (var index = 0; index < records.length; index++) {
                arrayJson.push({
                            serialNo : grid.getStore().indexOf(records[index])
                                    + 1,
                            identifier : records[index].data.identifier,
                            filterValue1 : records[index].data.locationCode,
                            filterValue2 : records[index].data.locationDesc,
                            userMessage : encryptedParentId
                        });
            }
            if (arrayJson)
                arrayJson = arrayJson.sort(function(valA, valB) {
                            return valA.serialNo - valB.serialNo
                        });
            if (btn.itemId == "btnOkSelectLocation") {
                if (!Ext.isEmpty(arrayJson)) {
                    me.assignUnssignDetails(btn, arrayJson, 'assign');
                } else {
                    if (!Ext.isEmpty(me.getSpecifyLocationSelectionPopUp()))
                        me.getSpecifyLocationSelectionPopUp().close();
                }
            } else {
                if (!Ext.isEmpty(arrayJson)) {
                    me.assignUnssignDetails(btn, arrayJson, 'unassign');
                } else {
                    if (!Ext.isEmpty(me.getSpecifyLocationSelectionPopUp()))
                        me.getSpecifyLocationSelectionPopUp().close();
                }
            }
        }
    },
    assignUnssignDetails : function(btn, arrayJson, action) {
        var me = this;
        var grid = me.getLocationsGrid();
        var popUp= null;
        var popUpGrid= null;
        popUp = me.getSpecifyLocationSelectionPopUp();
        popUpGrid = me.getSelectLocationsGrid(); 
        var strUrl = Ext.String.format("services/draweeBankSuspensionDtl/{0}.srvc", action);
        Ext.Ajax.request({
                    url : strUrl,
                    method : 'POST',
                    jsonData : Ext.encode(arrayJson),
                    success : function(response) {
                        // TODO : Action Result handling to be done here
                        var jsonData = JSON.parse(response.responseText);
                        var jsonArr = jsonData.listActionResult
                        var jsonErrArray= null;
                        for(var i=0;i<jsonArr.length;i++)
                        {
                            if(jsonArr[i].success=="N")
                            {
                            error= jsonArr[i];
                            jsonErrArray = error.errors;
                            if (!Ext.isEmpty(popUpGrid)) {
                                popUpGrid.getSelectionModel().deselectAll();
                            }
                            if (!Ext.isEmpty(popUp)) {
                                popUp.close();
                            }
                            me.showFailurePopup(jsonErrArray);
                            }
                        }
                        if(!Ext.isEmpty(jsonData.parentIdentifier))
                        {
                            encryptedParentId = jsonData.parentIdentifier;
                            document.getElementById('viewState').value = jsonData.parentIdentifier;
                        }
                        grid.refreshData();
                        grid.getSelectionModel().deselectAll();
                        me.enableDiscardPrMstAction();
                        if (!Ext.isEmpty(popUp)) {
                            popUp.close();
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
    showFailurePopup: function(jsonErrArray){
        var errMsg = '';
        for(var i=0;i<jsonErrArray.length;i++)
        {
            if(!Ext.isEmpty(jsonErrArray[i]))
            {
                errMsg = jsonErrArray[i].errorMessage ;
            }
        }
        Ext.MessageBox.show({
                title : getLabel(
                        'instrumentErrorPopUpTitle',
                        'Error'),
                msg : errMsg,
                buttons : Ext.MessageBox.OK,
                cls : 'ux_popup',
                icon : Ext.MessageBox.ERROR
                });
    },
    showSelectLocationsPopUp : function() {
        var objSelectProdPopup = Ext.create(
                'GCP.view.SpecifyLocationSelectionPopUp', {
                    itemId : 'specifyLocationSelectionPopUpId',
                    title : getLabel('selectLocation', 'Select Location')
                });
        objSelectProdPopup.show();
    },
    handleLoadGridData : function(grid, url, pgSize, newPgNo, oldPgNo, sorter) {
        var me = this;
        var strUrl = grid.generateUrl(url, pgSize, newPgNo, oldPgNo, sorter);
        strUrl = strUrl + '&$parentRecordKey=' + parentRecKey;
        if(mode === 'VIEW' && blnViewOld==='TRUE')
        {
            strUrl = strUrl +'&$viewMode=VIEW_CHANGES';
        }
        grid.loadGridData(strUrl, null, null, false);
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
                if(!Ext.isEmpty(objCol.hidden)){
                    cfgCol.hidden = objCol.hidden;
                }
                if (!Ext.isEmpty(objCol.colType))
                    cfgCol.colType = objCol.colType;
                cfgCol.width = !Ext.isEmpty(objWidthMap[objCol.colId])
                        ? objWidthMap[objCol.colId]
                        : 120;
               cfgCol.fnColumnRenderer = me.columnRenderer;
                arrCols.push(cfgCol);
            }
        }
        return arrCols;
    },
    columnRenderer : function(value, meta, record, rowIndex, colIndex, store,
            view, colId) {
            var strRetValue = value;
            var clsName = '';
            if(mode === 'VIEW' && blnViewOld==='TRUE') {
                if(record.raw.changeState === 1) {
                    clsName = 'modifiedFieldValue';
                } else if(record.raw.changeState === 2) {
                    clsName = 'deletedFieldValue';
                }else if(record.raw.changeState === 3) {
                    clsName = 'newFieldGridValue';
               }
            }
            return '<span class="' + clsName + '">' + strRetValue + '</span>';
        return strRetValue;
        },
    handleSmartGridConfig : function() {
        var me = this;
        var locationsGrid = me.getLocationsGrid();
        var objConfigMap = me.getPrfMstConfiguration();
        var arrCols = new Array();
        var showCheckBoxColumn = true;
        arrCols = me.getColumns(objConfigMap.arrColsPref,
                objConfigMap.objWidthMap);
        if (!Ext.isEmpty(locationsGrid)) {
            var store = locationsGrid.createGridStore(objConfigMap.storeModel);
            var columns = locationsGrid.createColumns(arrCols);
            locationsGrid.reconfigure(store, columns);
            locationsGrid.down('pagingtoolbar').bindStore(store);
            locationsGrid.refreshData();
        } else {
            if (mode == 'VERIFY' || mode == 'VIEW' || mode == 'SUBMIT') {
                showCheckBoxColumn = false;
            }
            me.handleSmartGridLoading(arrCols, objConfigMap.storeModel,
                    showCheckBoxColumn);
        }
    },
    handleSmartGridLoading : function(arrCols, storeModel, showCheckBoxColumn) {
        var me = this;
        var locationsGrid = null;
        locationsGrid = Ext.create('Ext.ux.gcp.SmartGrid', {
            id : 'locationsGrid',
            itemId : 'locationsGrid',
            pageSize : 10,
            rowList : [5, 10, 15, 20, 25, 30],
            stateful : false,
            cls:'ux_panel-transparent-background',
            padding : '5 10 10 10',
            height : 'auto',
            columnModel : arrCols,
            storeModel : storeModel,
            showEmptyRow : false,
            isRowMoreMenuVisible : me.isRowMoreMenuVisible,
            handleRowMoreMenuClick : me.handleRowMoreMenuClick,
            showCheckBoxColumn : showCheckBoxColumn
        });
        var prfMstDtlView = me.getPrfMstDtlView();
        prfMstDtlView.add(locationsGrid);
        prfMstDtlView.doLayout();
    },
    createActionColumn : function() {
        var me = this;
        var objActionCol = {
            colType : 'actioncontent',
            colId : 'actioncontent',
            width : 80,
            align : 'right',
            locked : true,
            sortable : false,
            items : null,
            moreMenu : {
                fnMoreMenuVisibilityHandler : function(store, record, jsonData,
                        itmId, menu) {
                },
                fnMoreMenuClickHandler : function(tableView, rowIndex,
                        columnIndex, btn, event, record) {
                    me.handleRowMoreMenuClick(tableView, rowIndex, columnIndex,
                            btn, event, record);
                },
                items : [{
                            itemId : 'btnHistory',
                            itemCls : 'grid-row-action-icon icon-history',
                            itemLabel : getLabel('historyToolTip',
                                    'View History')
                        }]
            }
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
    createFormField : function(element, type, name, value) {
        var inputField;
        inputField = document.createElement(element);
        inputField.type = type;
        inputField.name = name;
        inputField.value = value;
        return inputField;
    },
    getPrfMstConfiguration : function() {
        var me = this;
        var objConfigMap = null;
        var objWidthMap = null;
        var arrColsPref = null;
        var storeModel = null;
        objWidthMap = {
            "locationCode" : 300,
            "locationDesc" : 300
            };
        arrColsPref = [{
                    "colId" : "locationCode",
                    "colDesc" : getLabel("locationCode","Location Code")
                }, {
                    "colId" : "locationDesc",
                    "colDesc" : getLabel("locationDesc","Location Description")
                }];
        storeModel = {
            fields : ['locationCode', 'locationDesc','identifier',
                    'parentRecordKey', 'version', 'recordKeyNo'],
            proxyUrl : 'services/draweeBankSuspensionDtl/fetchSuspensionLocations.json',
            rootNode : 'd.profileDetails',
            totalRowsNode : 'd.__count'
        };
        objConfigMap = {
            "objWidthMap" : objWidthMap,
            "arrColsPref" : arrColsPref,
            "storeModel" : storeModel
        };
        return objConfigMap;
    },
    enableDiscardPrMstAction : function() {
        var me = this;
        var grid = me.getLocationsGrid();
        var discardActionEnabled = false;
        var blnEnabled = false;
        if (Ext.isEmpty(grid.getSelectedRecords())) {
            discardActionEnabled = false;
        } else {
            discardActionEnabled = true;
        }
        var discardBtn = me.getDiscardBtn();
        if (!discardActionEnabled) {
            discardBtn.setDisabled(!blnEnabled);
        } 
        else {
            discardBtn.setDisabled(blnEnabled);
        }
    },
    refreshGrid: function()
    {
        var me = this;
        var grid = me.getLocationsGrid();
        grid.refreshData();
    }
});