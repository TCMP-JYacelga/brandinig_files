/**
 * @class GCP.controller.StationeryDtlController
 * @extends Ext.app.Controller
 * @author Himanshu Dixit
 */
Ext.define('GCP.controller.StationeryDtlController', {
    extend : 'Ext.app.Controller',
    requires : ['Ext.util.Point','Ext.panel.Panel'],
    views : ['GCP.view.StationeryDtlGridView'],

    refs : [{
            ref : 'stationeryDtlView',
            selector : 'stationeryDtlView'
        },
        {
            ref : 'stationeryDtlGridView',
            selector : 'stationeryDtlView stationeryDtlGridView grid[itemId="gridViewMstId"]'
        },{
            ref : 'gridDtlView',
            selector : 'stationeryDtlView stationeryDtlGridView panel[itemId="gridDtlView"]'
        },{
            ref : 'grid',
            selector : 'stationeryDtlGridView smartgrid'
        }],
    config : {
    },
    init : function() {
        var me = this;
        me.control({
            'stationeryDtlView stationeryDtlGridView panel[itemId="gridDtlView"]' : {
                render : function() {
                }
            },
            'stationeryDtlGridView' : {
                render : function(panel) {
                    me.handleSmartGridConfig();
                }
            },
            'stationeryDtlGridView smartgrid' : {
                render : function(grid) {
                    me.handleLoadGridData(grid, grid.store.dataUrl,
                            grid.pageSize, 1, 1, null);
                },
                gridPageChange : me.handleLoadGridData,
                gridSortChange : me.handleLoadGridData,
                gridRowSelectionChange : function(grid, record, recordIndex,
                        records, jsonData) {
                }
            }
        });
    },
    handleSmartGridConfig : function() {
        var me = this;
        var stnryIndConfirmGrid = me.getStationeryDtlGridView();
        var objConfigMap = me.getStationeryDtlGridConfiguration();
        var arrCols = null;
        if (!Ext.isEmpty(stnryIndConfirmGrid))
            stnryIndConfirmGrid.destroy(true);
        arrCols = me.getColumns(objConfigMap.arrColsPref,
                objConfigMap.objWidthMap);
        me.handleSmartGridLoading(arrCols, objConfigMap.storeModel);
    },
    getStationeryDtlGridConfiguration : function(){
        var objConfigMap = null;
        var objWidthMap = null;
        var arrColsPref = null;
        var storeModel = null;
        
        objWidthMap = {
                "dispatchDate" : 130,
                "lastUpdateDate" : 130,
                "receivedQuantity" : 130,
                "balanceQuantity" : 130,
                "startInstNmbr" : 130,
                "endInstNmbr" : 130,
                "courierAckNmbr" : 150,
                "invoiceNmbr" : 130,
                "requestStateDesc" : 130,
                "dispatchRemarks" : 130
            };
            arrColsPref = [{ 
                "colId" : "dispatchDate",
                "colDesc" : getLabel('dispatchDate', 'Dispatch Date')
            },
            { 
                "colId" : "lastUpdateDate",
                "colDesc" : getLabel('lastUpdateDate', 'Latest Update Date')
            },
            {
                "colId" : "receivedQuantity",
                "colDesc" : (viewType == 'VIEW_BRANCH') ? getLabel('receivedQuantity', 'Received Quantity') : getLabel('sentQuantity', 'Sent Quantity')
            },
            { 
                "colId" : "balanceQuantity",
                "colDesc" : getLabel('balanceQuantity', 'Balance Quantity')
            },
            { 
                "colId" : "startInstNmbr",
                "colDesc" : getLabel('startInstNmbr', 'Start Instrument No.')
            },
            { 
                "colId" : "endInstNmbr",
                "colDesc" : getLabel('endInstNmbr', 'End Instrument No.')
            },
            { 
                "colId" : "courierAckNmbr",
                "colDesc" : getLabel('courierAckNmbr', 'Courier Tracking Number')
            },
            {
                "colId" : "invoiceNmbr",
                "colDesc" : getLabel('invoiceNmbr', 'Invoice No.')
            },
            { 
                "colId" : "requestStateDesc",
                "colDesc" : getLabel('status', 'Status')
            },
            { 
                "colId" : "dispatchRemarks",
                "colDesc" : getLabel('dispatchRemarks', 'Dispatch Remarks')
            }];
            storeModel = {
                    fields: ['requestReferenceNo', 'requestQuantity', 'receivedQuantity', 'balanceQuantity', 'startInstNmbr',
                        'endInstNmbr', 'courierAckNmbr', 'invoiceNmbr', 'dispatchDate', 'lastUpdateDate', 'recordKeyNo',
                        'requestState', 'requestStateDesc', 'makerDesc', 'dispatchRemarks', 'version', 'identifier','__metadata','history'],
                    proxyUrl: (viewType == 'VIEW_BRANCH') ? 'services/stationeryBranch/readReceiveDetails.json' : 'services/stationeryCpu/readSentDetails.json',
                    rootNode: 'd.profile',
                    totalRowsNode: 'd.__count'
        };
        objConfigMap = {
            "objWidthMap" : objWidthMap,
            "arrColsPref" : arrColsPref,
            "storeModel" : storeModel
        };
        return objConfigMap;
    },
    getColumns : function(arrColsPref, objWidthMap) {
        var me = this;
        var arrCols = new Array(), objCol = null, cfgCol = null;
        if (!Ext.isEmpty(arrColsPref)) {
            for (var i = 0; i < arrColsPref.length; i++) {
                objCol = arrColsPref[i];
                cfgCol = {};
                cfgCol.colHeader = objCol.colDesc;
                cfgCol.colId = objCol.colId;
                cfgCol.lockable = true;
                cfgCol.draggable = true;
                cfgCol.locked = false;
                if(objCol.colId == 'requestStateDesc')
                {
                    cfgCol.locked = false;
                    cfgCol.lockable = false;
                    cfgCol.sortable = false;
                    cfgCol.hideable = false;
                    cfgCol.resizable = false;
                    cfgCol.draggable = false;
                    cfgCol.hidden = false;
                }
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
    },
    handleSmartGridLoading : function(arrCols, storeModel) {
        var me = this;
        var pgSize = null;
        pgSize = 10;
        var stnryIndConfirmGrid = Ext.create('Ext.ux.gcp.SmartGrid', {
            id : 'gridViewMstId',
            itemId : 'gridViewMstId',
            pageSize : pgSize,
            stateful : false,
            showEmptyRow : false,
            showCheckBoxColumn : false,
            cls : 'ux_largepaddinglr ux_paddingb ux_largemargin-bottom',
            rowList : _AvailableGridSize,
            minHeight : 0,
            maxHeight : 550,
            columnModel : arrCols,
            storeModel : storeModel
        });
        var stnryIndConfirmGridDtlView = me.getGridDtlView();
        stnryIndConfirmGridDtlView.add(stnryIndConfirmGrid);
        stnryIndConfirmGridDtlView.doLayout();
    },
    handleLoadGridData : function(grid, url, pgSize, newPgNo, oldPgNo, sorter) {
        var me = this;
        var strUrl = grid.generateUrl(url, pgSize, newPgNo, oldPgNo, sorter);
        strUrl = strUrl+ '&$requestReferenceNo=' + referenceNo;
        grid.loadGridData(strUrl, null);
    },
    columnRenderer : function(value, meta, record, rowIndex, colIndex, store, view, colId){
        var strRetVal = value;
        if(!Ext.isEmpty(strRetVal)) {
            meta.tdAttr = 'title="' + strRetVal + '"';
        }
        return strRetVal;
    }
});