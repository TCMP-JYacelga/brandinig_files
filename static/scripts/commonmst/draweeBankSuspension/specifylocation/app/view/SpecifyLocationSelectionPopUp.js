Ext.define('GCP.view.SpecifyLocationSelectionPopUp', {
    extend : 'Ext.window.Window',
    xtype : 'specifyLocationSelectionPopUp',
    requires : ['Ext.ux.gcp.SmartGrid', 'Ext.data.Store'],
    width : 650,
    maxWidth : 750,
    minHeight : 156,
    maxHeight : 550,
    cls : 'non-xn-popup',
    modal : true,
    draggable : false,
    resizable : false,
    closeAction : 'destroy',
    searchVal : '',
    config : {
        fnCallback : null,
        profileId : null,
        featureType : null,
        module : null,
        title : null
    },
    listeners : {
                'resize' : function(){
                    this.center();
                }
            },

    initComponent : function() {
        var me = this;
        this.title = me.title;
        var strUrl = 'services/draweeBankSuspensionDtl/fetchAvailableLocations.json'
        var colModel = me.getColumns();
        adminListView = Ext.create('Ext.ux.gcp.SmartGrid', {
                    showPager : true,
                    xtype : 'selectLocationsView',
                    itemId : 'selectLocationsId',
                    stateful : false,
                    showEmptyRow : false,
                    pageSize : 10,
                    rowList : [5, 10, 15, 20, 25, 30],
                    showCheckBoxColumn : true,
                    hideRowNumbererColumn : true,
                    checkBoxColumnWidth : 40,
                    cls:'t7-grid',
                    minHeight : 40,
                    maxHeight : 390,
                    scroll : 'vertical',
                    width : 'auto',
                    columnModel : colModel,
                    storeModel : {
                        fields : ['locationCode', 'locationDesc'],
                        proxyUrl : strUrl,
                        rootNode : 'd.profileDetails',
                        totalRowsNode : 'd.__count'
                    },
                    listeners : {
                        render : function(grid) {
                            me.handleLoadGridData(grid, grid.store.dataUrl,
                                    grid.pageSize, 1, 1, null);
                        },
                        gridPageChange : me.handleLoadGridData,
                        gridSortChange : me.handleLoadGridData,
                        gridRowSelectionChange : function(grid, record,
                                recordIndex, records, jsonData) {
                        }
                    },
                    checkBoxColumnRenderer : function(value, metaData, record,
                            rowIndex, colIndex, store, view) {
                    }
                });
        this.items = [{
                    xtype : 'panel',
                    cls:'ft-padding-bottom',
                    layout : 'hbox',
                    items : [{
                                xtype : 'textfield',
                                itemId : 'searchLocText',
                                //fieldLabel : getLabel('prdName', 'Product Name'),
                                labelCls : 'frmLabel',
                                fieldCls: 'textfield-input',
                                height : 30,
                                width : 200,
                                emptyText : getLabel("searchLocation","Search by Location Code"),
                                labelSeparator : '',
                                labelAlign : 'left',
                                listeners : {
                                    change : function(field, newValue) {
                                        field.setValue(newValue.toUpperCase());
                                    }
                                }
                            }, {
                                xtype : 'button',
                                text : getLabel('filter', 'Filter'),
                                itemId : 'btnFilterLoc',
                                cls : 'ft-button-primary',
                                margin : '3 0 0 12'
                            }]
                }, adminListView];
        this.bbar = [{
                    xtype : 'button',
                    text : getLabel('cancel', 'Cancel'),
                    itemId : 'btnCancelSelectProduct',
                    handler : function() {
                        me.close();
                    }
                },'->', {
                    xtype : 'button',
                    text : getLabel('btndone', 'Done'),
                    itemId : 'btnOkSelectLocation'
                }];
        this.callParent(arguments);
    },

    getColumns : function() {
        arrColsPref = [{
                    "colId" : "locationCode",
                    "colDesc" : getLabel("locationCode","Location Code")
                }, {
                    "colId" : "locationDesc",
                    "colDesc" : getLabel("locationDesc","Location Description")
                }];
        var me = this;
        var arrCols = new Array(), objCol = null, cfgCol = null;
        if (!Ext.isEmpty(arrColsPref)) {
            for (var i = 0; i < arrColsPref.length; i++) {
                objCol = arrColsPref[i];
                cfgCol = {};
                cfgCol.colHeader = objCol.colDesc;
                cfgCol.colId = objCol.colId;
                cfgCol.width = 160;
                arrCols.push(cfgCol);
            }
        }
        return arrCols;
    },

    handleLoadGridData : function(grid, url, pgSize, newPgNo, oldPgNo, sorter) {
        var me = grid.up('specifyLocationSelectionPopUp');
        var strUrl = grid.generateUrl(url, pgSize, newPgNo, oldPgNo, sorter);
        strUrl = strUrl + '&$draweeBankCode=' + draweeBankCode +'&$parentRecordKey='+parentRecKey;
        if (!Ext.isEmpty(me.searchVal)) {
            strUrl = strUrl + '&$locFilter=' + me.searchVal;
        }
        grid.loadGridData(strUrl, null,null,false);
    },
    setSearchValue : function(textValue) {
        var me = this;
        me.searchVal = textValue;
    }
});