/**
 * @class GCP.controller.ExcludeDraweeBankController
 * @extends Ext.app.Controller
 * @author Himanshu Dixit
 */
Ext.define('GCP.controller.ExcludeDraweeBankController', {
    extend : 'Ext.app.Controller',
    requires : ['Ext.util.Point','Ext.panel.Panel'],
    views : ['GCP.view.ExcludeDraweeBankView',
             'GCP.view.ExcludeDraweeBankFilterView',
             'GCP.view.ExcludeDraweeBankGridView',
             'GCP.view.ExcludeDraweeBankActionBarView',
             'GCP.view.ExcludeDraweeBankHistoryPopup'],
    
    refs : [{
            ref : 'excludeView',
            selector : 'excludeDraweeBankView'
        },{
            ref : 'createNewToolBar',
            selector : 'excludeDraweeBankView excludeDraweeBankGridView toolbar[itemId="btnCreateNewToolBar"]'
        },{
            ref : 'excludeDraweeBankFilterView',
            selector : 'excludeDraweeBankView excludeDraweeBankFilterView'
        },{
            ref : 'gridHeader',
            selector : 'excludeDraweeBankView excludeDraweeBankGridView panel[itemId="excludeDtlView"] container[itemId="gridHeader"]'
        },{
            ref : 'excludeGridView',
            selector : 'excludeDraweeBankView excludeDraweeBankGridView grid[itemId="gridViewMstId"]'
        },{
            ref : 'excludeGridDtlView',
            selector : 'excludeDraweeBankView excludeDraweeBankGridView panel[itemId="excludeDtlView"]'
        },{
            ref : 'grid',
            selector : 'excludeDraweeBankGridView smartgrid'
        },{
            ref : 'groupActionBar',
            selector : 'excludeDraweeBankView excludeDraweeBankGridView excludeDraweeBankActionBarView'
        },{
            ref : 'specificFilterPanel',
            selector : 'excludeDraweeBankView excludeDraweeBankFilterView panel container[itemId="specificFilter"]'
        },{
            ref : "sellerCombo",
            selector : 'excludeDraweeBankView excludeDraweeBankFilterView combobox[itemId="sellerCombo"]'
        },
        {
            ref : "statusFilter",
            selector : 'excludeDraweeBankView excludeDraweeBankFilterView combobox[itemId="statusFilter"]'
        },
        {
            ref : "sysBranchFilter",
            selector : 'excludeDraweeBankView excludeDraweeBankFilterView combobox[itemId="sysBranchFilter"]'
        },
        {
            ref : "draweeBankFilter",
            selector : 'excludeDraweeBankView excludeDraweeBankFilterView combobox[itemId="draweeBankFilter"]'
        },
        {
            ref : 'downloadReport',
            selector : 'excludeDraweeBankView excludeDraweeBankTitleView menuitem[itemId="downloadReport"]'
        }],
    config : {
        filterData : [],
        sysBranchSelected : false,
        draweeBankSelected : false,
        reportGridOrder : null
    },
    init : function() {
        var me = this;
        me.control({
            'excludeDraweeBankView excludeDraweeBankFilterView' : {
                render : function() {
                    me.setInfoTooltip();
                    me.handleSpecificFilter();
                    me.setDataForFilter();
                    me.applyFilter();
                }
            },
            'excludeDraweeBankView excludeDraweeBankGridView panel[itemId="excludeDtlView"]' : {
                render : function() {
                    me.handleGridHeader();
                }
            },
            'excludeDraweeBankGridView' : {
                render : function(panel) {
                    me.handleSmartGridConfig();
                }
            },
            'excludeDraweeBankGridView smartgrid' : {
                render : function(grid) {
                    me.handleLoadGridData(grid, grid.store.dataUrl,grid.pageSize, 1, 1, null);
                },
                gridPageChange : me.handleLoadGridData,
                gridSortChange : me.handleLoadGridData,
                gridRowSelectionChange : function(grid, record, recordIndex, records, jsonData) {
                    me.enableValidActionsForGrid(grid, record, recordIndex, records, jsonData);
                }
            },
            'excludeDraweeBankGridView toolbar[itemId=excludeDraweeBankActionBarView]' : {
                performGroupAction : function(btn, opts) {
                    me.handleGroupActions(btn);
                }
            },
            'excludeDraweeBankView excludeDraweeBankFilterView button[itemId="btnFilter"]' : {
                click : function(btn, opts) {
                    me.setDataForFilter();
                    me.applyFilter();
                }
            },
            
            'excludeDraweeBankView excludeDraweeBankGridView toolbar[itemId="btnCreateNewToolBar"] button[itemId="btnExcludeCreateNew"]' : {
                click : function() {
                     me.cDlyMaintSetupEntryAction();
                }
            },
            'excludeDraweeBankView excludeDraweeBankTitleView' : {
                'performReportAction' : function(btn) {
                     me.handleReportAction(btn);
             }
            }
        });
    },
    setInfoTooltip : function() {
        var me = this;
        Ext.create('Ext.tip.ToolTip', {
            target : 'imgFilterInfo',
            listeners : {
                beforeshow : function(tip) {
                    var sellerFilter = '';
                    var statusFilter = '';
                    var sysBranch='';
                    var draweeBank = '';
                    var referenceNoFilter = '';
                    var sllerComboFilterId=me.getSellerCombo();
                    var statusFilterId = me.getStatusFilter();
                    var sysBranchFilter=me.getSysBranchFilter();
                    var draweeBankFilter = me.getDraweeBankFilter();
                    if (!Ext.isEmpty(sllerComboFilterId) && !Ext.isEmpty(sllerComboFilterId.getValue()))
                        sellerFilter = sllerComboFilterId.getRawValue();
                    else
                        sellerFilter = getLabel( 'all', 'All' );
                    
                    if( !Ext.isEmpty(statusFilterId) && !Ext.isEmpty(statusFilterId.getRawValue()))
                        statusFilter = statusFilterId.getRawValue()
                    else
                        statusFilter = getLabel( 'all', 'All' );
                    
                    if (!Ext.isEmpty(sysBranchFilter) && !Ext.isEmpty(sysBranchFilter.getValue()))
                        sysBranch = sysBranchFilter.getRawValue();
                    else
                        sysBranch = getLabel( 'all', 'All' );
                    
                    if (!Ext.isEmpty(draweeBankFilter) && !Ext.isEmpty(draweeBankFilter.getValue()))
                        draweeBank = draweeBankFilter.getRawValue();
                    else
                        draweeBank = getLabel( 'all', 'All' );
                    
                    tip.update(getLabel('seller', 'Financial Institution') + ' : '
                            + sellerFilter + '<br/>'
                            + getLabel('sysBranch', 'System Liquidation Branch') + ' : '
                            + sysBranch  + '<br/>'
                            + getLabel('draweeBank', 'Drawee Bank') + ' : '
                            + draweeBank  + '<br/>'
                            + getLabel('status', 'Status') + ' : '
                            + statusFilter  + '<br/>');
                }
            }
        });
    },
    handleSpecificFilter : function() {
        var me = this;
        var storeData;
        Ext.Ajax.request({
            url : 'services/userseek/adminSellersListCommon.json',
            method : 'POST',
            async : false,
            success : function(response) {
                var data = Ext.decode(response.responseText);
                var sellerData = data.d.preferences;
                if (!Ext.isEmpty(data)) {
                    storeData = sellerData;
                }
            },
            failure : function(response) {
                // console.log("Ajax Get data Call Failed");
            }
        });
        var comboStore = Ext.create('Ext.data.Store', {
            fields : ['CODE', 'DESCR'],
            data : storeData,
            reader : {
                type : 'json',
                root : 'preferences'
            }
        });
        var statusStore = Ext.create('Ext.data.Store', {
            fields : ["name", "value"],
            proxy : {
                type : 'ajax',
                autoLoad : true,
                url : 'services/excludeDraweeBank/statusList.json?' + csrfTokenName + "=" + csrfTokenValue,
                actionMethods : {
                    read : 'GET'
                },
                reader : {
                    type : 'json',
                    root : 'd.filter'
                },
                noCache: false
            }
        });
        var sellerComboField = Ext.create('Ext.form.field.ComboBox', {
            displayField : 'DESCR',
            fieldCls : 'xn-form-field inline_block ux_font-size14-normal ',
            triggerBaseCls : 'xn-form-trigger',
            filterParamName : 'sellerCode',
            itemId : 'sellerCombo',
            valueField : 'CODE',
            name : 'sellerCode',
            editable : false,
            store : comboStore,
            value : strSellerId,
            width : 190,
            listeners : {
                'render' : function(combo, record) {
                    combo.store.load();
                },
                'change' : function(combo, record) {
                    var strSellerId=combo.getValue();
                    setAdminSeller(strSellerId);
                }
            }
        });
        var createSysBranchAutocompleter = Ext.create('Ext.ux.gcp.AutoCompleter', {
            fieldCls : (!Ext.isEmpty(sysDesc)) ? 'xn-form-text xn-suggestion-box ux_font-size14-normal disabled':'xn-form-text xn-suggestion-box ux_font-size14-normal',
            cls:'ux_font-size14-normal',
            width : 190,
            name : 'sysBranch',
            itemId : 'sysBranchFilter',
            cfgUrl : 'services/userseek/{0}.json',
            cfgProxyMethodType : 'POST',
            cfgQueryParamName : '$autofilter',
            cfgRecordCount : -1,
            matchFieldWidth:true,
            cfgSeekId : 'excludeDraweeBranchSeek',
            enableQueryParam:false,
            cfgRootNode : 'd.preferences',
            cfgDataNode1 : 'DESCRIPTION',
            cfgKeyNode:'CODE',
            value:sysDesc,
            disabled:(!Ext.isEmpty(sysDesc)) ? true : false,
            listeners:{
                'select' : function(combo, record) {
                    me.sysBranchSelected = true;
                },
                'change' : function(combo, record) {
                    me.sysBranchSelected = false;
                }
            }
        });
        var createDraweeBankAutocompleter = Ext.create('Ext.ux.gcp.AutoCompleter', {
            fieldCls : 'xn-form-text xn-suggestion-box ux_font-size14-normal',
            cls:'ux_font-size14-normal',
            width : 190,
            name : 'draweeBank',
            itemId : 'draweeBankFilter',
            cfgUrl : 'services/userseek/{0}.json',
            cfgProxyMethodType : 'POST',
            cfgQueryParamName : '$autofilter',
            cfgRecordCount : -1,
            matchFieldWidth:true,
            cfgSeekId : 'excludeDraweeBankSeek',
            enableQueryParam:false,
            cfgRootNode : 'd.preferences',
            cfgDataNode1 : 'DESCRIPTION',
            cfgKeyNode:'CODE',
            listeners:{
                'select' : function(combo, record) {
                    me.draweeBankSelected = true;
                },
                'change' : function(combo, record) {
                    me.draweeBankSelected = false;
                }
            }
        });
        var filterPanel = me.getSpecificFilterPanel();
        if (!Ext.isEmpty(filterPanel))
        {
            filterPanel.removeAll();
        }
        filterPanel.doLayout();
        filterPanel.add({
            items:[
                {
                    xtype : 'panel',
                    layout : 'hbox',
                    items :
                     [
                        {
                            xtype : 'panel',
                            cls : 'xn-filter-toolbar',
                            hidden : false,
                            width : '25%',
                            padding : '5px',
                            itemId : 'sellerFilter',
                            layout : {
                                type : 'vbox'
                            },
                            items:[{
                                xtype : 'label',
                                layout : {
                                    type : 'hbox'
                                },
                                width : 315,
                                itemId : 'labelSeller',
                                text : getLabel('seller', 'Financial Institution'),
                                cls : 'f13 ux_font-size14 ux_normalmargin-bottom'
                                }, sellerComboField
                            ]
                        },
                        {
                            xtype : 'panel',
                            cls : 'xn-filter-toolbar',
                            padding : '5px',
                            width : '25%',
                            layout : {
                                 type : 'vbox'
                            },
                            items : [{
                                xtype : 'label',
                                 layout : {
                                     type : 'hbox'
                                 },
                                 width : 315,
                                 text : getLabel('sysBranch','System Liquidation Branch'),
                                 cls : 'f13 ux_font-size14 ux_normalmargin-bottom'
                             }, createSysBranchAutocompleter]
                         },
                         {
                             xtype : 'panel',
                             cls : 'xn-filter-toolbar',
                             padding : '5px',
                             width : '25%',
                             layout : {
                                  type : 'vbox'
                             },
                             items : [{
                                 xtype : 'label',
                                  layout : {
                                      type : 'hbox'
                                  },
                                  width : 315,
                                  text : getLabel('draweeBank','Drawee Bank'),
                                  cls : 'f13 ux_font-size14 ux_normalmargin-bottom'
                              }, createDraweeBankAutocompleter]
                          }
                    ]
                },
                {
                    xtype : 'panel',
                    layout : 'hbox',
                    items :[
                        {
                            xtype : 'panel',
                            cls : 'xn-filter-toolbar',
                            width : '25%',
                            itemId: 'statusFilterPanel',
                            padding : '5px',
                            layout : {
                                 type : 'vbox'
                            },
                            items : [{
                                 xtype : 'label',
                                 layout : {
                                     type : 'hbox'
                                 },
                                 text : getLabel('statusFilter', 'Status'),
                                 width : 315,
                                 cls : 'f13 ux_font-size14 ux_normalmargin-bottom'
                             },{
                                 xtype : 'combobox',
                                 fieldCls : 'xn-form-field inline_block ux_font-size14-normal',
                                 triggerBaseCls : 'xn-form-trigger',
                                 itemId : 'statusFilter',
                                 filterParamName : 'requestState',
                                 store : statusStore,
                                 valueField : 'name',
                                 displayField : 'value',
                                 editable : false,
                                 width : 190,
                                 value : getLabel('all', 'ALL')
                                 }]
                         },
                       {
                           xtype : 'panel',
                           cls : 'xn-filter-toolbar',
                           padding : '5px',
                           itemId: 'buttonFilter',
                           layout : {
                               type : 'vbox'
                           },
                           width : '25%',
                           items : [{
                           xtype : 'panel',
                           layout : 'hbox',
                           padding : '25 0 0 0',
                           items : [{
                               xtype : 'button',
                               itemId : 'btnFilter',
                               text : getLabel('search', 'Search'),
                               cls : 'ux_button-padding ux_button-background ux_button-background-color',
                               height : 22
                            }]
                        }]
                      }
                      ]
                }
            ]
        });
        sellerComboField.store.on('load',function(store){
            if(store.getCount()===1) {
                filterPanel.down('container[itemId="sellerFilter"]').hide();
            } else {
                filterPanel.down('container[itemId="sellerFilter"]').show();
            }
        });
    },
    setDataForFilter : function() {
        var me = this;
        var sellerValue = null, statusVal = null;
        var sysBranchCode = null, sysBranchDesc = null;
        var draweeBankCode = null, draweeBankDesc = null;
        var jsonArray = [];
        var excludeFilterView = me.getExcludeDraweeBankFilterView();
        if(!Ext.isEmpty(excludeFilterView)){
            var sellerFilter = me.getSellerCombo();
            if(!Ext.isEmpty(sellerFilter)){
                sellerValue = sellerFilter.getValue();
            }
            if (!Ext.isEmpty(sellerValue)) {
                jsonArray.push({
                    paramName : 'sellerCode',
                    paramValue1 : encodeURIComponent(sellerValue.replace(new RegExp("'", 'g'), "\''")),
                    operatorValue : 'eq',
                    dataType : 'S'
                });
            }
            var sysBranchFilter = me.getSysBranchFilter();
            if (!Ext.isEmpty(sysBranchFilter)){
                if(me.sysBranchSelected === true){
                    sysBranchCode = sysBranchFilter.getValue();
                } else {
                    sysBranchDesc = sysBranchFilter.getValue();
                }
            }
            if (!Ext.isEmpty(sysBranchCode)) {
                jsonArray.push({
                    paramName : 'sysBranchCode',
                    paramValue1 : encodeURIComponent(sysBranchCode.replace(new RegExp("'", 'g'), "\''")),
                    operatorValue : 'eq',
                    dataType : 'S'
                });
            }
            var draweeBankFilter = me.getDraweeBankFilter();
            if (!Ext.isEmpty(draweeBankFilter)){
                if(me.draweeBankSelected === true){
                    draweeBankCode = draweeBankFilter.getValue();
                } else {
                    draweeBankDesc = draweeBankFilter.getValue();
                }
            }
            if (!Ext.isEmpty(draweeBankCode)) {
                jsonArray.push({
                    paramName : 'draweeBankCode',
                    paramValue1 : encodeURIComponent(draweeBankCode.replace(new RegExp("'", 'g'), "\''")),
                    operatorValue : 'eq',
                    dataType : 'S'
                });
            }
        }
        if (!Ext.isEmpty(sysBranchDesc)) {
            jsonArray.push({
                paramName : 'sysBranchDesc',
                paramValue1 : encodeURIComponent(sysBranchDesc.toUpperCase().replace(new RegExp("'", 'g'), "\''")),
                operatorValue : 'lk',
                dataType : 'S'
            });
        }
        if (!Ext.isEmpty(draweeBankDesc)) {
            jsonArray.push({
                paramName : 'draweeBankDesc',
                paramValue1 : encodeURIComponent(draweeBankDesc.toUpperCase().replace(new RegExp("'", 'g'), "\''")),
                operatorValue : 'lk',
                dataType : 'S'
            });
        }
        if (!Ext.isEmpty(me.getStatusFilter()) && !Ext.isEmpty(me.getStatusFilter().getValue())
                && getLabel('all', 'All').toLowerCase() != me.getStatusFilter().getValue().toLowerCase())
        {
            statusVal = me.getStatusFilter().getValue();
            if(statusVal == 6)
            {
                statusVal  = new Array('1','4');
                jsonArray.push({
                    paramName : me.getStatusFilter().filterParamName,
                    paramValue1 :statusVal,
                    operatorValue : 'in',
                    dataType : 'S'
                } );
                jsonArray.push({
                        paramName : 'user',
                        paramValue1 :encodeURIComponent(USER.replace(new RegExp("'", 'g'), "\''")) ,
                        operatorValue : 'ne',
                        dataType : 'S'
                });
            }
            else
            {
                jsonArray.push({
                    paramName : me.getStatusFilter().filterParamName,
                    paramValue1 : statusVal,
                    operatorValue : 'eq',
                    dataType : 'S'
                });
            }
        }
        me.filterData = jsonArray;
    },
    applyFilter : function() {
        var me = this;
        var grid = me.getGrid();
        if (!Ext.isEmpty(grid)) {
            var strDataUrl = grid.store.dataUrl;
            var store = grid.store;
            var strUrl = grid.generateUrl(strDataUrl, grid.pageSize, 1, 1, store.sorters);
            strUrl = strUrl + me.getFilterUrl();
            me.getGrid().setLoading(true);
            grid.loadGridData(strUrl, me.handleAfterGridDataLoad, null);
        }
    },
    getFilterUrl : function() {
        var me = this;
        var strQuickFilterUrl = '';
        strQuickFilterUrl = me.generateUrlWithFilterParams(this);
        return strQuickFilterUrl;
    },
    generateUrlWithFilterParams : function(thisClass) {
        var filterData = thisClass.filterData;
        var isFilterApplied = false;
        var strFilter = '&$filter=';
        var strTemp = '';
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
                case 'in' :
                    var arrId = filterData[index].paramValue1;
                    if (0 != arrId.length) {
                        strTemp = strTemp + '(';
                        for (var count = 0; count < arrId.length; count++) {
                            strTemp = strTemp + filterData[index].paramName
                                    + ' eq ' + '\'' + arrId[count] + '\'';
                            if (count != arrId.length - 1) {
                                strTemp = strTemp + ' or ';
                            }
                        }
                        strTemp = strTemp + ' ) ';
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
    handleGridHeader : function() {
        var me = this;
        if(ACCESSNEW){
            var createNewPanel = me.getCreateNewToolBar();
            if (!Ext.isEmpty(createNewPanel))
            {
                createNewPanel.removeAll();
            }
            createNewPanel.add({
                xtype : 'button',
                border : 0,
                text : getLabel('excludeCreateNew', 'Create Exclude Drawee Bank'),
                cls : 'cursor_pointer ux_button-background ux_button-padding ux_button-background-color ux_button-s',
                glyph:'xf055@fontawesome',
                parent : this,
                itemId : 'btnExcludeCreateNew'
            });
        }
    },
    handleSmartGridConfig : function() {
        var me = this;
        var excludeGrid = me.getExcludeGridView();
        var objConfigMap = me.getCourierDlyMaintGridConfiguration();
        var arrCols = null;
        if (!Ext.isEmpty(excludeGrid))
            excludeGrid.destroy(true);
        arrCols = me.getColumns(objConfigMap.arrColsPref,
                objConfigMap.objWidthMap);
        me.handleSmartGridLoading(arrCols, objConfigMap.storeModel);
    },
    getCourierDlyMaintGridConfiguration : function(){
        var objConfigMap = null;
        var objWidthMap = null;
        var arrColsPref = null;
        var storeModel = null;
        objWidthMap = {
                "sysBranchCode" : 200,
                "draweeBankCode" : 200,
                "draweeBankDesc" : 300,
                "requestStateDesc" : 200
            };
            
            arrColsPref = [
            {
                "colId" : "sysBranchCode",
                "colDesc" : getLabel("sysBranch","System Liquidation Branch")
            },
            { 
                "colId" : "draweeBankCode",
                "colDesc" : getLabel("draweeBank","Drawee Bank")
            },
            { 
                "colId" : "draweeBankDesc",
                "colDesc" : getLabel("draweeBankDesc","Drawee Bank Name")
            },
            {
                "colId" : "requestStateDesc",
                "colDesc" : getLabel("status","Status")
            }];
            storeModel = {
                    fields : ['sysBranchCode','sysBranchDesc','draweeBankCode','draweeBankDesc',
                          'makerBranchCode','makerBranchDesc','makerStamp','checkerStateDesc','requestStateDesc', 'parentRecordKey',
                          'version','isSubmitted','recordKeyNo', 'masterRecordkeyNo', 'identifier','__metadata','history',
                          'sellerId'],
                proxyUrl : 'services/excludeDraweeBank.json',
                rootNode : 'd.profile',
                totalRowsNode : 'd.__count'
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
        arrCols.push(me.createGroupActionColumn());
        arrCols.push(me.createActionColumn())
        if (!Ext.isEmpty(arrColsPref)) {
            for (var i = 0; i < arrColsPref.length; i++) {
                objCol = arrColsPref[i];
                cfgCol = {};
                cfgCol.colHeader = objCol.colDesc;
                cfgCol.colId = objCol.colId;
                cfgCol.lockable = true;
                cfgCol.draggable = true;
                cfgCol.locked = false;
                if(objCol.colId == 'requestStateDesc' || objCol.colId == 'checkerStateDesc')
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
    createGroupActionColumn : function() {
        var objActionCol = {
            colType : 'actioncontent',
            colId : 'groupaction',
            width : 150,
            locked : true,
            items: [{
                text : getLabel('excludeActionSubmit', 'Submit'),
                itemId : 'submit',
                actionName : 'submit',
                maskPosition : 3
            },{
                text : getLabel('excludeActionDiscard', 'Discard'),
                itemId : 'discard',
                actionName : 'discard',
                maskPosition : 6
            }, {
                text : getLabel('excludeActionApprove', 'Approve'),
                itemId : 'accept',
                actionName : 'accept',
                maskPosition : 4
            }, {
                text : getLabel('excludeActionReject', 'Reject'),
                itemId : 'reject',
                actionName : 'reject',
                maskPosition : 5
            },
            {
                text : getLabel('excludeActionDelete', 'Delete'),
                itemId : 'delete',
                actionName : 'delete',
                maskPosition : 7
            }]
        };
        return objActionCol;
    },
    createActionColumn : function() {
        var objActionCol = {
            colType : 'actioncontent',
            colId : 'action',
            width : 85,
            locked : true,
            items : [ {
                itemId : 'btnEdit',
                itemCls : 'grid-row-action-icon icon-edit',
                toolTip : getLabel('editToolTip', 'Edit Record'),
                maskPosition : 1
            },{
                itemId : 'btnHistory',
                itemCls : 'grid-row-action-icon icon-history',
                itemLabel : getLabel('historyToolTip', 'View History'),
                maskPosition : 2
            }]
        };
        return objActionCol;
    },
    handleSmartGridLoading : function(arrCols, storeModel) {
        var me = this;
        var pgSize = null;
        pgSize = 10;
        var maintGrid = Ext.create('Ext.ux.gcp.SmartGrid', {
            id : 'gridViewMstId',
            itemId : 'gridViewMstId',
            pageSize : pgSize,
            stateful : false,
            showEmptyRow : false,
            cls : 'ux_largepaddinglr ux_paddingb ux_largemargin-bottom',
            rowList : _AvailableGridSize,
            minHeight : 0,
            maxHeight : 550,
            columnModel : arrCols,
            storeModel : storeModel,
            isRowIconVisible : me.isRowIconVisible,
            handleRowMoreMenuClick : me.handleRowMoreMenuClick,
            handleRowIconClick : function(tableView, rowIndex, columnIndex, btn, event, record) {
                me.handleRowIconClick(tableView, rowIndex, columnIndex, btn, event, record);
            },
            handleMoreMenuItemClick : function(grid, rowIndex, cellIndex, menu, event, record) {
                var dataParams = menu.dataParams;
                me.handleRowIconClick(dataParams.view, dataParams.rowIndex, dataParams.columnIndex, menu, null, dataParams.record);
            }
        });
        var excludeGridDtlView = me.getExcludeGridDtlView();
        excludeGridDtlView.add(maintGrid);
        excludeGridDtlView.doLayout();
    },
    isRowIconVisible : function(store, record, jsonData, itmId, maskPosition) {
        var maskSize = 7;
        var maskArray = new Array();
        var actionMask = '';
        var rightsMap = record.data.__metadata.__rightsMap;
        var buttonMask = '';
        var retValue = true;
        var bitPosition = '';
        var reqState = null, submitFlag = null, validFlag = null;
        if (!Ext.isEmpty(maskPosition)) {
            bitPosition = parseInt(maskPosition,10) - 1;
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
        if ((maskPosition === 4 && retValue)) {
            retValue = retValue && isSameUser;
        }else if (maskPosition === 5 && retValue) {
            retValue = retValue && isSameUser;
        }else if (maskPosition === 1 && retValue) {
            reqState = record.raw.requestState;
            submitFlag = record.raw.isSubmitted;
            validFlag = record.raw.validFlag;
            var isSubmitModified = (reqState === 1 && submitFlag == 'Y');
            retValue = retValue && (!isSubmitModified);
        }else if (maskPosition === 6 && retValue) {
            reqState = record.raw.requestState;
            submitFlag = record.raw.isSubmitted;
            var submitResult = (reqState === 0 && submitFlag == 'Y');
            retValue = retValue && (!submitResult);
        }
        return retValue;
    },
    handleRowMoreMenuClick : function(tableView, rowIndex, columnIndex, btn, event, record) {
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
                blnRetValue = me.isRowIconVisible(store, record, jsonData, null, arrMenuItems[a].maskPosition);
                arrMenuItems[a].setVisible(blnRetValue);
            }
        }
        menu.showAt(event.xy[0] + 5, event.xy[1] + 5);
    },
    handleRowIconClick : function(tableView, rowIndex, columnIndex, btn, event, record) {
        var me = this;
        var actionName = btn.itemId;
        if (actionName === 'submit' || actionName === 'accept'
            || actionName === 'reject' || actionName === 'delete' || actionName === 'discard')
            me.handleGroupActions(btn, record);
        else if (actionName === 'btnHistory') {
            var recHistory = record.get('history');
            if (!Ext.isEmpty(recHistory)&& !Ext.isEmpty(recHistory.__deferred.uri)) {
                me.showHistory(record.get('history').__deferred.uri, record.get('identifier'),record.get('sysBranchCode'),record.get('draweeBankCode'));
            }
        } else if (actionName === 'btnEdit') {
            me.submitExtForm('editExcludeDraweeBank.form', record, rowIndex);
        }
    },
    handleGroupActions : function(btn, record) {
        var me = this;
        var strAction = !Ext.isEmpty(btn.actionName)
                ? btn.actionName
                : btn.itemId;
        var strUrl = Ext.String.format('services/excludeDraweeBank/{0}.srvc?', strAction);
        if (strAction === 'reject') {
            me.showRejectVerifyPopUp(strAction, strUrl,record);
        }else {
            me.preHandleGroupActions(strUrl, '',record);
        }
    },
    showRejectVerifyPopUp : function(strAction, strActionUrl,record) {
        var me = this;
        var titleMsg = '', fieldLbl = '';
        if (strAction === 'reject') {
            fieldLbl = getLabel('rejectRemarkPopUpTitle', 'Please enter reject remark');
            titleMsg = getLabel('rejectRemarkPopUpFldLbl', 'Reject Remark');
        }
        var msgbox = Ext.Msg.show({
            title : titleMsg,
            msg : fieldLbl,
            buttons : Ext.Msg.OKCANCEL,
            multiline : 4,
            cls:'t7-popup',
            width: 355,
            height : 270,
            bodyPadding : 0,
            fn : function(btn, text) {
                if (btn == 'ok') {
                       if (Ext.isEmpty(text)) {
                           if (strAction === 'reject') {
                               Ext.Msg.alert(getLabel('errorTitle', 'Error'), getLabel('rejectRestrictionErroMsg',
                               'Reject Remark field can not be blank'));
                           }
                       }else{
                           me.preHandleGroupActions(strActionUrl, text, record);
                       }
                }
            }
        });
        msgbox.textArea.enforceMaxLength = true;
        msgbox.textArea.inputEl.set({
            maxLength : 255
        });
    },
    preHandleGroupActions : function(strUrl, remark, record) {
        var me = this;
        var grid = this.getGrid();
        if (!Ext.isEmpty(grid)) {
            var arrayJson = new Array();
            var records = grid.getSelectedRecords();
            records = (!Ext.isEmpty(records) && Ext.isEmpty(record))
                    ? records : [record];
            for (var index = 0; index < records.length; index++) {
                arrayJson.push({
                    serialNo : grid.getStore().indexOf(records[index]) + 1,
                    identifier : records[index].data.identifier,
                    userMessage : remark
                    // TODO : need to check recordDesc is required
                    //recordDesc: records[index].data.draweeBranchDescription
                });
            }
            if (arrayJson){
                arrayJson = arrayJson.sort(function(valA, valB) {
                    return valA.serialNo - valB.serialNo
                });
            }
            Ext.Ajax.request({
                url : strUrl + csrfTokenName + "=" + csrfTokenValue,
                method : 'POST',
                jsonData : Ext.encode(arrayJson),
                success : function(response) {
                    var errorMessage = '';
                    if(response.responseText != '[]') {
                        var jsonData = Ext.decode(response.responseText);
                        if(!Ext.isEmpty(jsonData)) {
                            for(var i =0 ; i<jsonData.length;i++ ) {
                                var arrError = jsonData[i].errors;
                                if(!Ext.isEmpty(arrError)) {
                                    for(var j =0 ; j< arrError.length; j++) {
                                        errorMessage = errorMessage + arrError[j].code +' : '+ arrError[j].errorMessage+"<br/>";
                                    }
                                }
                            }
                            if('' != errorMessage && null != errorMessage) {
                                Ext.MessageBox.show({
                                    title : getLabel('errorTitle','Error'),
                                    msg : errorMessage,
                                    buttons : Ext.MessageBox.OK,
                                    cls : 'ux_popup',
                                    icon : Ext.MessageBox.ERROR
                                });
                            } 
                        }
                    }
                    me.enableDisableGroupActions('0000000', true);
                    grid.refreshData();
                },
                failure : function() {
                    Ext.MessageBox.show({
                        title : getLabel('errorTitle','Error'),
                        msg : getLabel('errorPopUpMsg','Error while fetching data..!'),
                        buttons : Ext.MessageBox.OK,
                        icon : Ext.MessageBox.ERROR
                    });
                }
            });
        }
    },
    enableDisableGroupActions : function(actionMask, isSameUser, isDisabled, isSubmit) {
        var actionBar = this.getGroupActionBar();
        var blnEnabled = false, strBitMapKey = null, arrItems = null;
        if (!Ext.isEmpty(actionBar) && !Ext.isEmpty(actionBar.items.items)) {
            arrItems = actionBar.items.items;
            Ext.each(arrItems, function(item) {
                strBitMapKey = parseInt(item.maskPosition,10) - 1;
                if (strBitMapKey) {
                    blnEnabled = isActionEnabled(actionMask, strBitMapKey);
                    if((item.maskPosition === 4 && blnEnabled)){
                        blnEnabled = blnEnabled && isSameUser;
                    } else  if(item.maskPosition === 5 && blnEnabled){
                        blnEnabled = blnEnabled && isSameUser;
                    } else  if(item.maskPosition === 6 && blnEnabled){
                        blnEnabled = blnEnabled && !isSubmit;
                    }
                    item.setDisabled(!blnEnabled);
                }
            });
        }
    },
    handleLoadGridData : function(grid, url, pgSize, newPgNo, oldPgNo, sorter) {
        var me = this;
        var strUrl = grid.generateUrl(url, pgSize, newPgNo, oldPgNo, sorter);
        strUrl = strUrl + me.getFilterUrl();
        me.reportGridOrder = strUrl;
        grid.loadGridData(strUrl, null);
    },
    handleReportAction : function(btn, opts) {
        var me = this;
        me.downloadReport(btn.itemId);
    },
    downloadReport : function(actionName) {
        var me = this;
        var currentPage = 1, strExtension = '', strUrl = '';
        var arrExtension = {
            downloadXls : 'xls',
            downloadCsv : 'csv',
            downloadTsv : 'tsv'
        };
        var gridView = me.getExcludeGridView();
        var grid = me.getGrid();
        strExtension = arrExtension[actionName];
        strUrl = 'services/generateExcludeDraweeBankReport';
        strUrl += '?$skip=1';
        me.setDataForFilter();
        strUrl = strUrl + me.getFilterUrl();
        strUrl += '&$strExtension=' +strExtension;
        var strOrderBy = me.reportGridOrder;
        if (!Ext.isEmpty(strOrderBy)) {
            var orderIndex = strOrderBy.indexOf('orderby');
            if (orderIndex > 0) {
                strOrderBy = strOrderBy.substring(orderIndex, strOrderBy.length);
                var indexOfamp = strOrderBy.indexOf('&$');
                if (indexOfamp > 0)
                    strOrderBy = strOrderBy.substring(0, indexOfamp);
                strUrl += '&$' + strOrderBy;
            }
        }
        form = document.createElement('FORM');
        form.name = 'frmMain';
        form.id = 'frmMain';
        form.method = 'POST';
        form.appendChild(me.createFormField('INPUT', 'HIDDEN', csrfTokenName, csrfTokenValue));
        form.appendChild(me.createFormField('INPUT', 'HIDDEN', 'txtCurrent', currentPage));
        form.action = strUrl;
        document.body.appendChild(form);
        form.submit();
        document.body.removeChild(form);
    },
    enableValidActionsForGrid : function(grid, record, recordIndex, selectedRecords, jsonData) {
        var me = this;
        var buttonMask = '0000000';
        var maskArray = new Array(), actionMask = '', objData = null;
        if (!Ext.isEmpty(jsonData) && !Ext.isEmpty(jsonData.d.__buttonMask)) {
            buttonMask = jsonData.d.__buttonMask;
        }
        var isSameUser = true;
        var isDisabled = false;
        var isSubmit = false;
        maskArray.push(buttonMask);
        for (var index = 0; index < selectedRecords.length; index++) {
            objData = selectedRecords[index];
            maskArray.push(objData.get('__metadata').__rightsMap);
            if (objData.raw.makerId === USER) {
                isSameUser = false;
            }
            if (objData.raw.validFlag != 'Y') {
                isDisabled = true;
            }
            if (objData.raw.isSubmitted == 'Y' && objData.raw.requestState == 0) {
                isSubmit = true;
            }
        }
        actionMask = doAndOperation(maskArray, 6);
        me.enableDisableGroupActions(actionMask, isSameUser, isDisabled,isSubmit);
    },
    submitExtForm : function(strUrl, record, rowIndex) {
        var me = this;
        var viewState = record.data.identifier;
        var form;
        form = document.createElement('FORM');
        form.name = 'frmMain';
        form.id = 'frmMain';
        form.method = 'POST';
        form.appendChild(me.createFormField('INPUT', 'HIDDEN', csrfTokenName, tokenValue));
        form.appendChild(me.createFormField('INPUT', 'HIDDEN', 'txtRecordIndex', rowIndex));
        form.appendChild(me.createFormField('INPUT', 'HIDDEN', 'viewState', viewState));
        form.action = strUrl;
        //me.setFilterParameters(form);
        document.body.appendChild(form);
        form.submit();
    },
    setFilterParameters : function(form) {
        var me = this;
        var arrJsn = {};
        arrJsn['sellerId'] =  strSellerId;
        form.appendChild(me.createFormField('INPUT', 'HIDDEN', 'filterData', Ext.encode(arrJsn)));
    },
    createFormField : function(element, type, name, value) {
        var inputField;
        inputField = document.createElement(element);
        inputField.type = type;
        inputField.name = name;
        inputField.value = value;
        return inputField;
    },
    showHistory : function(url, id, sysBranch, draweeBank) {
        Ext.create('GCP.view.ExcludeDraweeBankHistoryPopup', {
                    sysBranch : sysBranch,
                    draweeBank : draweeBank,
                    historyUrl : url,
                    identifier : id
                }).show();
    },
    cDlyMaintSetupEntryAction : function(){
        var me = this;
        var form;
        var strUrl = 'addExcludeDraweeBank.form';
        form = document.createElement('FORM');
        form.name = 'frmMain';
        form.id = 'frmMain';
        form.method = 'POST';
        form.appendChild(me.createFormField('INPUT', 'HIDDEN', csrfTokenName, tokenValue));
        form.action = strUrl;
        document.body.appendChild(form);
        form.submit();
        document.body.removeChild(form);
    },
    columnRenderer : function(value, meta, record, rowIndex, colIndex, store, view, colId){
        var strRetVal = value;
        if (colId === 'col_viewImage') {
            strRetVal = '<span class="underlined cursor_pointer">View Image</span>';
        }
        else if(!Ext.isEmpty(strRetVal)) {
            meta.tdAttr = 'title="' + strRetVal + '"';
        }
        return strRetVal;
    }
});