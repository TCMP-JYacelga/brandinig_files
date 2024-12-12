Ext.define('GCP.view.DraweeBankSuspensionHistoryPopup', {
    extend : 'Ext.window.Window',
    historyUrl : null,
    isClient : true,
    identifier : null,
    description : null,
    requires : ['Ext.grid.column.Action', 'Ext.grid.column.Date'],
    width : 550,
    maxHeight : 350,
    minHeight : 156,
    resizable : false,
    draggable : false,
    cls : 'non-xn-popup',
    modal : true,
    config : {
        historyData : []
    },
    initComponent : function() {
        var me = this;
        var partnerBankLbl = getLabel('draweeBank', 'Drawee Bank');
        var histTitle = getLabel('suspensionHist', 'Drawee Bank Suspension History');
        if (Ext.isEmpty(me.historyUrl)) {
            Ext.apply(me, {
                title : getLabel('errorPopUpTitle', 'Error'),
                html : getLabel('popUpErrorMsg', 'Sorry no URl provided for History')
            });
        } else {
            var arrayData = me.loadHistoryData(me.historyUrl, me.identifier);
            me.title = histTitle;
            me.items = [{
                xtype : 'panel',
                width : '100%',
                layout : 'hbox',
                cls : 'ft-padding-bottom',
                items : [{
                    xtype : 'label',
                    cls : 'ux_font-size14 label-color',
                    text : partnerBankLbl + " : ",
                    width : '100'
                }, {
                    xtype : 'label',
                    style : { fontWeight: 'normal !important' },
                    cls : 'ux_font-size14',
                    html : "&nbsp" + me.description,
                    width : '150'
                }]
            },{
                xtype : 'grid',
                cls : 'x-grid-padding-top',
                autoScroll : true,
                forceFit : true,
                store : arrayData,
                defaultSortable : false,
                columns : [{
                    dataIndex : 'label',
                    sortable : false,
                    menuDisabled : true,
                    text : getLabel('prfMstDescription', 'Description')
                }, {
                    dataIndex : 'makerVal',
                    sortable : false,
                    menuDisabled : true,
                    text : getLabel('prfMstMaker', 'Maker'),
                    renderer: function(val, meta, rec, rowIndex, colIndex, store) {
                        if(val.length > 25)
                        meta.tdAttr = 'title="' + val + '"';
                        return val;
                    }
                },{
                    dataIndex : 'checkerVal',
                    sortable : false,
                    menuDisabled : true,
                    text : getLabel('prfMstChecker', 'Checker'),
                    renderer: function(val, meta, rec, rowIndex, colIndex, store) {
                        if(val.length > 25)
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
    loadHistoryData : function(historyUrl, id) {
        var arrayData = new Array();
        Ext.Ajax.request({
            url : 'cpon/common/history.json?' + csrfTokenName + '=' + csrfTokenValue
                + '&$histSeekPageId=history.seek.draweeBankSuspension',
            method : 'POST',
            jsonData : Ext.encode(id),
            async : false,
            success : function(response) {
                var data = Ext.decode(response.responseText);
                data = data.d.history[0];
                var checkerStamp, checkerId, makerRequestState, checkerRequestState, rejectRemarks;
                if((data.requestState != 0
                        && data.requestState != 1
                        && data.requestState != 4
                        && data.requestState != 5)) {
                    checkerId = data.checkerId;
                    checkerRequestState = data.requestStateDesc;
                    makerRequestState = data.lastRequestStateDesc;
                    checkerStamp = data.checkerStamp;
                } else {
                    makerRequestState = data.requestStateDesc;
                }
                if(!Ext.isEmpty(checkerRequestState) && checkerRequestState.indexOf("Reject") > -1){
                    rejectRemarks = data.rejectRemarks;
                }
                var historyData = [
                    [getLabel('prfMstDescription', 'Description'), data.makerId, checkerId],
                    [getLabel('prfMstHistoryPopUpdateDate', 'Date Time'), data.makerStamp, checkerStamp],
                    [getLabel('prfMstHistoryPopUpdateAction', 'Action'), makerRequestState, checkerRequestState],
                    [getLabel('prfMstHistoryPopUpdateRemark', 'Remark'), '', rejectRemarks]];
                arrayData = new Ext.data.ArrayStore({
                    fields : ['label', 'makerVal', 'checkerVal']
                });
                arrayData.loadData(historyData);
            },
            failure : function() {
                Ext.MessageBox.show({
                    title : getLabel('errorPopUpTitle', 'Error'),
                    msg : getLabel('errorPopUpMsg', 'Error while fetching data..!'),
                    buttons : Ext.MessageBox.OK,
                    icon : Ext.MessageBox.ERROR
                });
            }
        });
        return arrayData;
    }
});