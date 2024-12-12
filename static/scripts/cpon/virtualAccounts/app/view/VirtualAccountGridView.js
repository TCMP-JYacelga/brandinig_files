/**
 * @class VirtualAccountGridView
 * @extends Ext.panel.Panel
 * @author Gaurav Pingale
 */
Ext.define('GCP.view.VirtualAccountGridView', {
    extend : 'Ext.panel.Panel',
    border : false,
    xtype : 'virtualAccountGridView',
    requires : [ 'Ext.ux.gcp.SmartGrid' ],
    autoHeight : true,
    cls : 'ux_panel-background ux_no-padding',
    initComponent : function() {
        var me = this;
        var actionBar = me.getActionBar();
        var gridView = me.getGridView();
        var hideButton;
        if(viewmode === 'VIEW' || viewmode === 'MODIFIEDVIEW'){
            hideButton = true;
        }else{
            hideButton = false;
        }
        me.items = [ {
            xtype : 'container',
            layout : 'hbox',
            flex : 1,
            items : [ {
                xtype : 'toolbar',
                itemId : 'btnVirtualAccountToolBar',
                flex : 1,
                padding : '0 0 20 0',
                cls : 'ux_extralargepadding-top',
                items : [ {
                    xtype : 'button',
                    border : 0,
                    hidden : hideButton,
                    text : getLabel('addNew', 'Add New'),
                    cls : 'cursor_pointer ux_button-padding ux_button-background-color',
                    glyph : 'xf055@fontawesome',
                    margin : '0 0 0 10',
                    padding : '4 0 2 0',
                    itemId : 'btnAddNew'
                } ]
            } ]
        }, {
            xtype : 'container',
            layout : 'hbox',
            cls : 'ux_panel-transparent-background',
            itemId : 'addVirtualAccountActionsView',
            items : [ {
                xtype : 'label',
                text : getLabel('actions', 'Actions') + ':',
                cls : 'font_bold ux_font-size14',
                padding : '5 0 0 10'
            }, actionBar, {
                xtype : 'label',
                text : '',
                flex : 1
            } ]
        }, gridView ];
        me.callParent(arguments);
    },
    getGridView : function() {
        var me = this;
        var arrCols = me.getColumns();
        var storeModel = me.getStoreModel();
        var gridView = Ext.create('Ext.ux.gcp.SmartGrid', {
            id : 'virtualAccountGrid',
            itemId : 'virtualAccountGrid',
            pageSize : 5,
            stateful : false,
            cls : 'ux_panel-transparent-background',
            padding : '5 10 10 10',
            rowList : [ 5, 10, 15, 20, 25, 30 ],
            height : 'auto',
            columnModel : arrCols,
            storeModel : storeModel,
            showEmptyRow : false,
            handleRowMoreMenuClick : me.handleRowMoreMenuClick,
            isRowIconVisible : me.isRowIconVisible,
            showCheckBoxColumn : true,
            multiSort : false,
            showSorterToolbar : false,
            handleRowIconClick : me.handleRowIconClick
        });
        return gridView;
    },
    getColumns : function() {
        var me = this;
        var cols = [];
        var colPref = [ {
            colId : 'clientConstCharDigit',
            colDesc : 'Client Constant Chars/Digit',
            width : 260,
            sortable: false
            }, {
            colId : 'maxClientConstLen',
            colDesc : 'Client Constant Length',
            width : 200,
            sortable : false
            }, {
            colId : 'maxIssuableAcct',
            colDesc : 'Max Issuable Accounts',
            width : 200,
            sortable: false
            }, {
            colId : 'partialMatch',
            colDesc : 'Partial Match',
            width : 200,
            sortable: false
            }, {
            colId : 'clientSpecifiedVa',
            colDesc : 'Client Specified VA',
            width : 200,
            sortable: false
            }, {
            colId : 'autoAssignVa',
            colDesc : 'Auto Assign VA',
            width : 200,
            sortable: false
            }, {
            colId : 'requestState',
            colDesc : 'Status',
            sortable : false
            } ];
        var actions = [{
            itemId : 'btnEdit',
            itemCls : 'grid-row-action-icon icon-edit',
            toolTip : getLabel('editToolTip', 'Edit')
            },{
            itemId : 'btnView',
            itemCls : 'grid-row-action-icon icon-view',
            toolTip : getLabel('viewToolTip', 'View')
        }];
        cols.push({
            colType : 'actioncontent',
            colId : 'actioncontent',
            width : 80,
            align : 'right',
            locked : true,
            sortable : false,
            items : actions
        });
        Ext.each(colPref, function(objCol) {
            var cfgCol = {};
            cfgCol.colId = objCol.colId;
            cfgCol.colHeader = objCol.colDesc;
            cfgCol.colType = objCol.colType;
            if(Ext.isEmpty(objCol.hidden)){
                cfgCol.hidden = false;
            }else{
                cfgCol.hidden = objCol.hidden;
            }
            if(Ext.isEmpty(objCol.width)){
                cfgCol.width = 120;
            }else{
                cfgCol.width = objCol.width;
            }
            if((Ext.isEmpty(objCol.sortable))){
                cfgCol.sortable = true;
            }else{
                cfgCol.sortable = objCol.sortable;
            }
            cfgCol.fnColumnRenderer = me.columnRenderer;
            cols.push(cfgCol);
        });
    return cols;
    },
    getStoreModel : function() {
        var storeModel = {
            fields : [ 'clientConstCharDigit','maxClientConstLen','maxIssuableAcct','partialMatch',
                'clientSpecifiedVa','autoAssignVa','identifier', 'requestState', 'version','recordKeyNo'],
            proxyUrl : 'services/clientServiceSetup/virtualAccounts.json',
            rootNode : 'd.virtualAccounts',
            totalRowsNode : 'd.metadata.__count'
        };
    return storeModel;
    },
    handleRowIconClick : function(gridview, rowIndex, columnIndex, btn, event, record) {
        var grid = this;
        grid.fireEvent('handleGridRowIconClick', gridview, rowIndex, columnIndex, btn, event, record);
    },
    getActionBar : function() {
        var actionBar = Ext.create('Ext.toolbar.Toolbar', {
            itemId : 'dtlsActionBar',
            componentCls : 'xn-custom xn-btn-default-toolbar-small xn-custom-toolbar',
            height : 18,
            width : '100%',
            items : [ {
                text : getLabel('discard', 'Discard'),
                disabled : true,
                itemId : 'discardBtn',
                actionName : 'discard'
            } ]
        });
    return actionBar;
    },
    columnRenderer : function(value, meta, record, rowIndex, colIndex, store, view, colId) {
        var strRetValue = value;
        var clsName = '';
        if (colId === 'col_requestState') {
            if (value.toString() === '0'){
                strRetValue = 'New';
            }else if (value.toString() === '1'){
                strRetValue = 'Approved';
             // in case of approved, sub account checkbox should be disabled for uncheck.
                var chkSubAccounts = $('#divAcUsage').find('#chkService_acctUsageSubAccounts');
                chkSubAccounts.removeAttr('onclick');
                chkSubAccounts.find('img').attr('src', 'static/images/icons/icon_checked_grey.gif');
            }
        }
        if((colId === 'col_clientConstCharDigit' || colId === 'col_maxClientConstLen')
                && clientConstApplicable === 'N' && strRetValue === ''){
            strRetValue = 'N/A';
        }
        if(colId === 'col_partialMatch' || colId === 'col_clientSpecifiedVa' || colId === 'col_autoAssignVa'){
            if(value === 'Y'){
                strRetValue = 'Yes';
            }else{
                strRetValue = 'No';
            }
        }
        if(mode === 'MODIFIEDVIEW' && record.raw.requestState === '0'){
            clsName = 'newFieldValue';
        }
        return '<span class="' + clsName + '">' + strRetValue + '</span>';
    },
    isRowIconVisible : function(store, record, jsonData, itmId, maskPosition) {
        if (itmId === 'btnEdit' && (viewmode === 'VIEW' || viewmode === 'MODIFIEDVIEW')) {
            return false;
        }else if(itmId === 'btnEdit' && record.data.requestState === '1'){
            return false;
        }
    return true;
    }
});
