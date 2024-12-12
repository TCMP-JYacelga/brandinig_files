/**
 * History Pop-up is an User Interface Component, extends Ext Window component.
 * Used to show history of particular payment.
 */
Ext.define('GCP.view.HistoryPopup', {
    extend : 'Ext.window.Window',
    historyUrl : null,
    usrCode : null,
    productName : null,
    identifier : null,
    id : 'HistoryPopup',
    requires : ['Ext.grid.column.Action', 'Ext.grid.column.Date'],
    /**
     * @cfg {number} width width of component in pixels.
     */
    width : 600,
    maxWidth : 735,
    /**
     * @cfg {number} height width of component in pixels.
     */
    //height : 260,
    minHeight : 156,
    maxHeight : 550,
    /**
     * @cfg {String} layout In order for child items to be correctly sized and
     *      positioned, typically a layout manager must be specified through the
     *      layout configuration option. layout may be specified as either as an
     *      Object or as a String:
     */
    /**
     * @cfg {boolean} modal True to make the window modal and mask everything
     *      behind it when displayed, false to display it without restricting
     *      access to other UI elements. Defaults to: false
     */
    modal : true,
    resizable : false,
    draggable : false,
    config : {
        historyData : []
    },
    listeners : {
        'resize' : function(){
            this.center();
        }
    },
    cls:'xn-popup',
    initComponent : function() {
        var thisClass = this;
        if (Ext.isEmpty(this.historyUrl)) {
            Ext.apply(this, {
                        title : getLabel('errorTitle', 'Error'),
                        html : getLabel('userMstHistoryPopUpErrorMsg',
                                'Sorry no URl provided for History')
                    });
        } else {

            var arrayData = thisClass.loadHistoryData(this.historyUrl,
                    this.identifier);
            var productlabel = getLabel('reportName', 'Report Name');
            this.title = getLabel('customReportHistoryTitle', 'Custom Report History');

            this.items = [{
                xtype : 'panel',
                width : '100%',
                //margin : '5 5 0 0',
                layout : 'hbox',
                items : [{
                            xtype : 'label',
                            cls : 'ux_font-size14 label-color',
                            text : productlabel
                                    + " : "
                            //width : 100
                        }, {
                            xtype : 'label',
                            margin : '0 0 0 0',
                            style : { fontWeight: 'normal !important' },
                            cls : 'ux_font-size14 label-font-normal',
                            html : "&nbsp" + thisClass.reportName
                        }]
            },{
                        xtype : 'grid',
                        margin : '5 0 0 0',
                        autoScroll : true,
                        forceFit : true,
                        store : arrayData,
                        defaultSortable : false,
                        columns : [{
                                    dataIndex : 'label',
                                    sortable : false,
                                    width : '34%',
                                    menuDisabled : true,
                                    resizable : false,
                                    draggable : false,
                                    text : getLabel('description', 'Description'),//getLabel('userName', 'User Name')
                                    renderer: function(val, meta, rec, rowIndex, colIndex, store) {
                                        meta.tdAttr = 'title="' + val + '"';
                                        return val;
                                    }
                                }, {
                                    dataIndex : 'makerVal',
                                    sortable : false,
                                    menuDisabled : true,
                                    resizable : false,
                                    draggable : false,
                                    text : getLabel('Makerval', 'Maker'),
                                    width : '33%',
                                    renderer: function(val, meta, rec, rowIndex, colIndex, store) {
                                        meta.tdAttr = 'title="' + val + '"';
                                        return val;
                            }
                                }, {
                                    dataIndex : 'checkerVal',
                                    sortable : false,
                                    menuDisabled : true,
                                    resizable : false,
                                    draggable : false,
                                    width : '33%',
                                    text : getLabel('checker', 'Checker'),
                                    renderer: function(val, meta, rec, rowIndex, colIndex, store) {
                                        meta.tdAttr = 'title="' + val + '"';
                                        return val;
                            }
                                }]
                    }];

            this.bbar = [{
                    xtype : 'button',
                    id : 'btnCustomReportHistoryPopupClose',
                    tabIndex : '1',
                    cls : 'ft-button ft-button-light',
                    text : getLabel('btnClose', 'Close'),
                    handler : function()
                    {
                        thisClass.close();
                    }
                    }];
        }

        this.callParent();
    },

    loadHistoryData : function(historyUrl, id) {
        var me = this;
        var arrayData = new Array();
        Ext.Ajax.request({
            //url : historyUrl,
            url : 'cpon/common/history.json' + '?&' + '$histSeekPageId=history.seek.customReport',          
            method : 'POST',
            jsonData : Ext.encode(id),
            async : false,
            success : function(response) {
                var data = Ext.decode(response.responseText);
                data = data.d.history[0];
                var checkerStamp, checkerId, makerRequestState, checkerRequestState;
                
                console.log(data.requestState);
                console.log(response.responseText);
                
                if( ( data.requestState != 0 && data.requestState != 1 && data.requestState != 4 && data.requestState != 5 ) )
                {
                     checkerId = data.checkerId;
                     checkerRequestState = data.requestStateDesc;
                    checkerStamp = data.checkerStamp;
                    makerRequestState = data.lastRequestStateDesc;
                }
                else
                {
                    makerRequestState = data.requestStateDesc;
                }
                var setRejectRemarks = "";
                if (!Ext.isEmpty(checkerRequestState)
                        && checkerRequestState
                                .indexOf("Reject") > -1) {
                    setRejectRemarks = data.rejectRemarks;
                }
                var historyData = [
                        [getLabel('user',
                                        'User'), data.makerId, checkerId],
                        [getLabel('dateTime', 'Date Time'),
                                        data.makerStamp, checkerStamp],
                        [getLabel('action', 'Action'),
                                        makerRequestState, checkerRequestState],
                        [getLabel('remark', 'Remark'),
                                        '', setRejectRemarks]];
                arrayData = new Ext.data.ArrayStore({
                            fields : ['label', 'makerVal', 'checkerVal']
                        });
                arrayData.loadData(historyData);
            },
            failure : function() {
                var errMsg = "";
                Ext.MessageBox.show({
                            title : getLabel('errorTitle', 'Error'),
                            msg : getLabel('errorPopUpMsg',
                                    'Error while fetching data..!'),
                            buttons : Ext.MessageBox.OK,
                            icon : Ext.MessageBox.ERROR
                        });
            }
        });
        return arrayData;
    }
});
