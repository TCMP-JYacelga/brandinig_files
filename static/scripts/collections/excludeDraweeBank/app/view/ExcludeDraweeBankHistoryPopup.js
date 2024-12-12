/**
 * @class GCP.view.ExcludeDraweeBankHistoryPopup
 * @extends Ext.window.Window
 * @author Himanshu Dixit
 */
Ext.define('GCP.view.ExcludeDraweeBankHistoryPopup',{
    extend : 'Ext.window.Window',
    historyUrl : null,
    sysBranch : null,
    draweeBank : null,
    isClient : true,
    identifier : null,
    requires : ['Ext.grid.column.Action', 'Ext.grid.column.Date'],
    width : 750,
    maxHeight : 350,
    minHeight : 156,
    overflowY : 'auto',
    resizable : false,
    draggable : false,
    cls : 'non-xn-popup',
    modal : true,
    config : {
        historyData : []
    },
    initComponent : function() {
        var me = this;
        var sysBranchDescLbl = getLabel("sysBranch","System Branch");
        var histTitle = getLabel('excludeHist', 'Exclude Drawee Bank History');
        if (Ext.isEmpty(me.historyUrl)) {
            Ext.apply(me, {
                title : getLabel('prfHistoryPopUpTitle', 'Error'),
                html : getLabel('prfMstHistoryPopUpErrorMsg', 'Sorry no URl provided for History')
            });
        } else {
            var arrayData = me.loadHistoryData(me.identifier);
            me.title = histTitle;
            me.items = [{
                xtype : 'panel',
                width : '100%',
                layout : 'hbox',
                cls : 'ft-padding-bottom',
                items : [{
                    xtype : 'panel',
                    width : '50%',
                    layout : 'hbox',
                    cls : 'ft-padding-bottom',
                    items : [{
                        xtype : 'label',
                        cls : 'ux_font-size14 label-color',
                        text : getLabel("sysBranch","System Liquidation Branch") + ' : ',
                        width : 170
                    }, {
                        xtype : 'label',
                        style : { fontWeight: 'normal !important' },
                        cls : 'ux_font-size14',
                        html : '&nbsp' + me.sysBranch,
                        width : 150
                    }]
                },
                {
                    xtype : 'panel',
                    width : '50%',
                    layout : 'hbox',
                    cls : 'ft-padding-bottom',
                    items : [{
                        xtype : 'label',
                        cls : 'ux_font-size14 label-color',
                        text : getLabel("draweeBank","Drawee Bank") + ' : ',
                        width : 90
                    }, {
                        xtype : 'label',
                        style : { fontWeight: 'normal !important' },
                        cls : 'ux_font-size14',
                        html : '&nbsp' + me.draweeBank,
                        width : 150
                    }]
                }]
            },{
                xtype : 'grid',
                cls : 'x-grid-padding-top',
                autoScroll : true,
                forceFit : true,
                store : arrayData,
                defaultSortable : false,
                columns : [{
                    dataIndex : 'seqNmbr',
                    width : 50,
                    sortable : false,
                    menuDisabled : true,
                    text : getLabel('seqNmbr', 'Seq. No.'),
                    renderer: function(val, meta, rec, rowIndex, colIndex, store) {
                        meta.tdAttr = 'title="' + val + '"';
                        return val;
                    }
                },{
                    dataIndex : 'userCode',
                    width : 100,
                    sortable : false,
                    menuDisabled : true,
                    text : getLabel('userCode', 'User Name'),
                    renderer: function(val, meta, rec, rowIndex, colIndex, store) {
                        meta.tdAttr = 'title="' + val + '"';
                        return val;
                    }
                },{
                    dataIndex : 'logDate',
                    width : 150,
                    sortable : false,
                    menuDisabled : true,
                    text : getLabel('logDate', 'Date&Time'),
                    renderer: function(val, meta, rec, rowIndex, colIndex, store) {
                        meta.tdAttr = 'title="' + val + '"';
                        return val;
                    }
                },
                {
                    dataIndex : 'remarks',
                    width : 280,
                    sortable : false,
                    menuDisabled : true,
                    text : getLabel('rejectRemarkPopUpFldLbl', 'Reject Remarks'),
                    renderer: function(val, meta, rec, rowIndex, colIndex, store) {
                        meta.tdAttr = 'title="' + val + '"';
                        return val;
                    }
                },
                {
                    dataIndex : 'action',
                    width : 150,
                    sortable : false,
                    menuDisabled : true,
                    text : getLabel('action', 'Action'),
                    renderer: function(val, meta, rec, rowIndex, colIndex, store) {
                        meta.tdAttr = 'title="' + val + '"';
                        return val;
                    }
                }]
            }];
            me.bbar = ['->',{
                text : getLabel('btnClose', 'Close'),
                handler : function() {
                    me.close();
                }
            }];
        }
        me.callParent();
    },
    loadHistoryData : function(id){
        var arrayData = new Array();
        Ext.Ajax.request({
            url : 'services/excludeDraweeBank/fetchRecordHistory.json',
            method : 'POST',
            jsonData : Ext.encode(id),
            async : false,
            success : function(response) {
            	var data = Ext.decode(response.responseText);
                var historyData = new Array();
                if (data && data.d && data.d.history) 
                {
                    for(var i = 0; i < data.d.history.length; i++) {
                        var obj = data.d.history[i];
                        var j=i+1;
                        historyData.push([j, obj.userCode, obj.logDate, obj.remarks, obj.requestStateDesc])
                    }
                    arrayData = new Ext.data.ArrayStore({
                        fields : ['seqNmbr', 'userCode', 'logDate', 'remarks', 'action']
                    });
                    arrayData.loadData(historyData);
                }
            },
            failure : function() {
                Ext.MessageBox.show({
                    title : getLabel('prfHistoryPopUpTitle', 'Error'),
                    msg : getLabel('errorPopUpMsg', 'Error while fetching data..!'),
                    buttons : Ext.MessageBox.OK,
                    icon : Ext.MessageBox.ERROR
                });
            }
        });
        return arrayData;
    }
});
