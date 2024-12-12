/**
 * @class GCP.controller.VirtualAccountController
 * @extends Ext.app.Controller
 * @author Gaurav Pingale
 */
Ext.define('GCP.controller.VirtualAccountController', {
    extend: 'Ext.app.Controller',
    requires: [],
    refs: [{
        ref: 'addNewButton',
        selector: 'virtualAccountGridView toolbar[itemId="btnVirtualAccountToolBar"] button[itemId="btnAddNew"]'
    }, {
        ref: 'virtualAccountGrid',
        selector: 'virtualAccountGridView smartgrid[itemId="virtualAccountGrid"]'
    }, {
        ref: 'virtualAccountPanelView',
        selector: 'virtualAccountGridView[itemId="virtualAccountPanelView"]'
    }],
    init: function() {
        var me = this;
            me.control({
            'virtualAccountGridView toolbar[itemId="btnVirtualAccountToolBar"] button[itemId="btnAddNew"]': {
                click: function() {
                    if(mode && mode === 'EDIT'){
                        $(document).trigger('showAddVirtualAccountPopup',[true,this.getVirtualAccountGrid()]);
                    }else{
                        var dialog = $('<div class="row"><div class="col_1_1" style="padding:20px">'+
                        'Please save client account first.</div></div>');
                        dialog.dialog({
                                    modal:true,
                                    title:'Virtual Account',
                                    resizable:false,
                                    draggable:false,
                                    height:'auto',
                                    buttons:{
                                        'Ok':function(){
                                            dialog.dialog('close');
                                        }
                                    }});
                    }
                }
            },
            'virtualAccountGridView smartgrid[itemId="virtualAccountGrid"]': {
                render: function(grid) {
                    me.handleLoadGridData(grid, grid.store.dataUrl, grid.pageSize, 1, 1, null);
                    if(viewmode==='VIEW' || viewmode==='MODIFIEDVIEW') {
                        grid.getSelectionModel().setLocked(true);
                    }
                },
                gridPageChange: me.handleLoadGridData,
                gridSortChange: me.handleLoadGridData,
                gridRowSelectionChange: me.gridRowSelectionChange,
                handleGridRowIconClick: me.handleGridRowIconClick
            },
            'virtualAccountGridView toolbar[itemId="dtlsActionBar"] [actionName="discard"]': {
                click: function() {
                    me.handleGroupActions('discard');
                }
            }
        });
    },
    handleLoadGridData: function(grid, url, pgSize, newPgNo, oldPgNo, sorter) {
        var strUrl = grid.generateUrl(url, pgSize, newPgNo, oldPgNo, sorter);
        if(!Ext.isEmpty(detailkey)) {
            strUrl = strUrl + '&parentIdentifier=' + detailkey;
        }
        if(!Ext.isEmpty(parentkey)) {
            strUrl = strUrl + '&clientIdentifier=' + parentkey;
        }
        grid.loadGridData(strUrl, function() {}, null, false);
        vaGrid = grid;
    },
    gridRowSelectionChange: function(grid, record, recordIndex, arrSelectedRecords, jsonData, strAction) {
        var me = this;
        var disableDiscardAction = true;
        if(arrSelectedRecords.length > 0){
            disableDiscardAction = false;
        }
        Ext.each(arrSelectedRecords, function(selectedRecord) {
            var requestState = selectedRecord.get('requestState');
            if(requestState.toString() === '1'){
                disableDiscardAction = true;
            }
        });
        var virtualAccountPanelView = me.getVirtualAccountPanelView();
        var discardActionButton = virtualAccountPanelView.down('toolbar[itemId="dtlsActionBar"] [actionName="discard"]');
        discardActionButton.setDisabled(disableDiscardAction);
    },
    handleGroupActions: function(strAction) {
        var me = this;
        var grid = me.getVirtualAccountGrid();
        var gridSelectedRecords = grid.getSelectedRecords();
        if(strAction === 'discard') {
            var requestData = [];
            var parentIdentifier = $('input[type="hidden"][name="viewState"]').val();
            $.each(gridSelectedRecords, function(index, record) {
                requestData.push({
                    serialNo: grid.getStore().indexOf(record) + 1,
                    identifier: record.get('identifier'),
                    userMessage: parentIdentifier
                });
            });
            if(requestData.length) {
                requestData = requestData.sort(function(valA, valB) {
                    return valA.serialNo - valB.serialNo;
                });
            }
            var strUrl = 'services/clientServiceSetup/discard.json?clientIdentifier=' + parentkey;
            $.ajax({
                url: strUrl,
                type: 'POST',
                dataType: 'json',
                contentType: 'application/json',
                data: JSON.stringify(requestData),
                success: function(arrResponse) {
                    var isSuccess = false;
                    if(arrResponse.length) {
                        isSuccess = true;
                        $.each(arrResponse, function(index, response) {
                            if(response.success !== 'Y') {
                                isSuccess = false;
                            }
                        });
                        if(isSuccess) {
                            var virtualAccountGrid = me.getVirtualAccountGrid();
                            var virtualAccountPanelView = me.getVirtualAccountPanelView();
                            var discardActionButton = virtualAccountPanelView.down('toolbar[itemId="dtlsActionBar"] [actionName="discard"]');
                            discardActionButton.setDisabled(true);
                            virtualAccountGrid.refreshData();
                        }
                    }
                },
                error: function(response) {
                }
            });
        }
    },
    handleGridRowIconClick: function(gridview, rowIndex, columnIndex, btn, event, record) {
        var actionName = btn.itemId;
        if(actionName === 'btnView'){
            var viewOnlyMode = true;
        }else{
            var viewOnlyMode = false;
        }
        $(document).trigger('showAddVirtualAccountPopup',[false,this.getVirtualAccountGrid(),viewOnlyMode,record]);
    }

});
