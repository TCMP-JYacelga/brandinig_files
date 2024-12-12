/**
 * @class GCP.controller.StationeryBranchController
 * @extends Ext.app.Controller
 * @author Himanshu Dixit
 */
Ext.define('GCP.controller.StationeryBranchController', {
    extend : 'Ext.app.Controller',
    requires : ['Ext.util.Point','Ext.panel.Panel'],
    views : ['GCP.view.StationeryBranchView',
             'GCP.view.StationeryBranchFilterView',
             'GCP.view.StationeryBranchGridView',
             'GCP.view.StationeryBranchActionBarView',
             'GCP.view.StationeryBranchHistoryPopup'],
    
    refs : [{
            ref : 'stnryBranchView',
            selector : 'stationeryBranchView'
        },{
            ref : 'createNewToolBar',
            selector : 'stationeryBranchView stationeryBranchGridView toolbar[itemId="btnCreateNewToolBar"]'
        },{
            ref : 'stnryBranchFilterView',
            selector : 'stationeryBranchView stationeryBranchFilterView'
        },{
            ref : 'gridHeader',
            selector : 'stationeryBranchView stationeryBranchGridView panel[itemId="stnBranchDtlView"] container[itemId="gridHeader"]'
        },{
            ref : 'stnryBranchGridView',
            selector : 'stationeryBranchView stationeryBranchGridView grid[itemId="gridViewMstId"]'
        },{
            ref : 'stnryBranchGridDtlView',
            selector : 'stationeryBranchView stationeryBranchGridView panel[itemId="stnBranchDtlView"]'
        },{
            ref : 'grid',
            selector : 'stationeryBranchGridView smartgrid'
        },{
            ref : 'groupActionBar',
            selector : 'stationeryBranchView stationeryBranchGridView stationeryBranchActionBarView'
        },{
            ref : 'specificFilterPanel',
            selector : 'stationeryBranchView stationeryBranchFilterView panel container[itemId="specificFilter"]'
        },{
            ref : "sellerCombo",
            selector : 'stationeryBranchView stationeryBranchFilterView combobox[itemId="sellerCombo"]'
        },
        {
            ref : "productFilter",
            selector : 'stationeryBranchView stationeryBranchFilterView combobox[itemId="productFilter"]'
        },
        {
            ref : "statusFilter",
            selector : 'stationeryBranchView stationeryBranchFilterView combobox[itemId="statusFilter"]'
        },
        {
            ref : 'requestDateBtn',
            selector : 'stationeryBranchView stationeryBranchFilterView button[itemId="requestDateBtn"]'
        }, 
        {
            ref : 'requestDateLabel',
            selector : 'stationeryBranchView stationeryBranchFilterView label[itemId="requestDateLabel"]'
        },
        {
            ref : "referenceNoFilter",
            selector : 'stationeryBranchView stationeryBranchFilterView textfield[itemId="referenceNo"]'
        },
        {
            ref : 'downloadReport',
            selector : 'stationeryBranchView stationeryBranchTitleView menuitem[itemId="downloadReport"]'
        }],
    config : {
        filterData : [],
        clientSelected : false,
        dispatchBankSelected : false,
        productSelected : false,
        reportGridOrder : null,
        dateHandler : null,
        dateFilterVal : defaultDateIndex,
        dateFilterLabel : getDateIndexLabel(defaultDateIndex),
        datePickerSelectedDate : [],
        datePickerSelectedRequestDate : [],
        selectedEntryDate : {}
    },
    init : function() {
        var me = this;
        me.dateHandler = Ext.create('Ext.ux.gcp.DateUtil');
        $(document).on('filterDateChange',
                function(event, btn, opts) {
                    me.dateFilterVal = btn.btnValue;
                    me.dateFilterLabel = btn.text;
                    me.handleDateChange(btn.btnValue);
                });
        me.control({
            'stationeryBranchView stationeryBranchFilterView' : {
                render : function() {
                    me.setInfoTooltip();
                    me.handleSpecificFilter();
                    me.handleDateChange(me.dateFilterVal);
                    me.setDataForFilter();
                    me.applyFilter();
                }
            },
            'stationeryBranchView stationeryBranchGridView panel[itemId="stnBranchDtlView"]' : {
                render : function() {
                    me.handleGridHeader();
                }
            },
            'stationeryBranchGridView' : {
                render : function(panel) {
                    me.handleSmartGridConfig();
                }
            },
            'stationeryBranchGridView smartgrid' : {
                render : function(grid) {
                    me.handleLoadGridData(grid, grid.store.dataUrl,grid.pageSize, 1, 1, null);
                },
                gridPageChange : me.handleLoadGridData,
                gridSortChange : me.handleLoadGridData,
                gridRowSelectionChange : function(grid, record, recordIndex, records, jsonData) {
                    me.enableValidActionsForGrid(grid, record, recordIndex, records, jsonData);
                }
            },
            'stationeryBranchGridView toolbar[itemId=stationeryBranchActionBarView]' : {
                performGroupAction : function(btn, opts) {
                    me.handleGroupActions(btn);
                }
            },
            'stationeryBranchView stationeryBranchFilterView button[itemId="btnFilter"]' : {
                click : function(btn, opts) {
                    me.setDataForFilter();
                    me.applyFilter();
                }
            },
            
            'stationeryBranchView stationeryBranchGridView toolbar[itemId="btnCreateNewToolBar"] button[itemId="btnStnBranchCreateNew"]' : {
                click : function() {
                     me.cDlyMaintSetupEntryAction();
                }
            },
            'stationeryBranchView stationeryBranchTitleView' : {
                'performReportAction' : function(btn) {
                     me.handleReportAction(btn);
             }
            },
            'stationeryBranchView stationeryBranchFilterView component[itemId="paymentRequestDataPicker"]' : {
                render : function() {
                    $('#requestDataPicker').datepick({
                        monthsToShow : 1,
                        changeMonth : true,
                        changeYear : true,
                        dateFormat : strApplicationDateFormat,
                        rangeSeparator : ' to ',
                        onClose : function(dates) {
                            if (!Ext.isEmpty(dates)) {
                                me.datePickerSelectedDate = dates;
                                me.datePickerSelectedRequestDate = dates;
                                me.dateFilterVal = '13';
                                me.dateFilterLabel = getDateIndexLabel(me.dateFilterVal);
                                me.handleDateChange(me.dateFilterVal);
                            }
                        }
                    });
                    me.handleDateChange(me.dateFilterVal);
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
                    var product='';
                    var statusFilter = '';
                    var requestDateFilter = '';
                    var referenceNoFilter = '';
                    var sllerComboFilterId=me.getSellerCombo();
                    var productFilter=me.getProductFilter();
                    var statusFilterId = me.getStatusFilter();
                    var referenceNo = me.getReferenceNoFilter();
                    if (!Ext.isEmpty(sllerComboFilterId) && !Ext.isEmpty(sllerComboFilterId.getValue()))
                        sellerFilter = sllerComboFilterId.getRawValue();
                    else
                        sellerFilter = getLabel( 'all', 'All' );
                    
                    if (!Ext.isEmpty(productFilter) && !Ext.isEmpty(productFilter.getValue()))
                        product = productFilter.getRawValue();
                    else
                        product = getLabel( 'all', 'All' );
                     
                    if( !Ext.isEmpty(statusFilterId) && !Ext.isEmpty(statusFilterId.getRawValue()))
                        statusFilter = statusFilterId.getRawValue()
                    else
                        statusFilter = getLabel( 'all', 'All' );
                    
                    if (!Ext.isEmpty(me.selectedEntryDate) && !Ext.isEmpty(me.selectedEntryDate.fromDate)) {
                        var vFromDate = $.datepick.formatDate(strApplicationDateFormat, $.datepick.parseDate('yy-mm-dd', me.selectedEntryDate.fromDate));
                        requestDateFilter = requestDateFilter + vFromDate;
                        if(!Ext.isEmpty(me.selectedEntryDate.toDate))
                        {
                            var vToDate = $.datepick.formatDate(strApplicationDateFormat, $.datepick.parseDate('yy-mm-dd', me.selectedEntryDate.toDate));
                            requestDateFilter = requestDateFilter + ' - ' + vToDate;
                        }
                    }
                    if( !Ext.isEmpty(referenceNo) && !Ext.isEmpty(referenceNo.getRawValue()))
                    	referenceNoFilter = referenceNo.getRawValue();
                    tip.update(getLabel('seller', 'Financial Institution') + ' : '
                            + sellerFilter + '<br/>'
                            + getLabel('productDesc', 'Product') + ' : '
                            + product  + '<br/>'
                            + getLabel('requestReferenceNo', 'Unique Reference No.') + ' : '
                            + referenceNoFilter  + '<br/>'
                            + getLabel('requestDate', 'Indent Date') + ' : '
                            + requestDateFilter  + '<br/>'
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
        var createProductAutocompleter = Ext.create('Ext.ux.gcp.AutoCompleter', {
            fieldCls : 'xn-form-text xn-suggestion-box ux_font-size14-normal',
            cls:'ux_font-size14-normal',
            width : 190,
            name : 'product',
            itemId : 'productFilter',
            cfgUrl : 'services/userseek/{0}.json',
            cfgProxyMethodType : 'POST',
            cfgQueryParamName : '$autofilter',
            cfgRecordCount : -1,
            matchFieldWidth:true,
            cfgSeekId : 'StationeryIndProduct',
            enableQueryParam:false,
            cfgRootNode : 'd.preferences',
            cfgDataNode1 : 'DESCRIPTION',
            cfgKeyNode:'CODE',
            listeners:{
                'select' : function(combo, record) {
                    me.productSelected = true;
                },
                'change' : function(combo, record) {
                    me.productSelected = false;
                }
            }
        });
        var statusStore = Ext.create('Ext.data.Store', {
            fields : ["name", "value"],
            proxy : {
                type : 'ajax',
                autoLoad : true,
                url : 'services/stationeryBranch/statusList.json?' + csrfTokenName + "=" + csrfTokenValue,
                actionMethods : {
                    read : 'POST'
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
                                 text : getLabel('productDesc','Stationery Product'),
                                 cls : 'f13 ux_font-size14 ux_normalmargin-bottom'
                             }, createProductAutocompleter]
                         },
                         {
                             xtype : 'panel',
                             cls : 'xn-filter-toolbar',
                             padding : '5px',
                             width : '25%',
                             layout : {
                                 type : 'vbox'
                             },
                             items : [
                                 {
                                 	xtype : 'label',
                                     text : getLabel('requestReferenceNo', 'Unique Reference No.'),
                                     width : 315,
                                     cls : 'f13 ux_font-size14 ux_normalmargin-bottom'
                                 },
                                 {
                                     xtype : 'textfield',
                                     itemId : 'referenceNo',
                                     maxLength : 20,
                                     width : 190,
                                     height : 25,
                                     fieldCls: 'inline_block ux_font-size14-normal',
                                     enforceMaxLength : true,
                                     enableKeyEvents : true,
                                     listeners :
                                     {
                                         'keypress' : function( text )
                                         {
                                             //if( text.value.length === 20 )
                                             //    me.showErrorMsg();
                                         }
                                     }
                                 }
                             ]
                        },
                         {
                             xtype : 'panel',
                             cls : 'xn-filter-toolbar',
                             padding : '5px',
                             width : '25%',
                             items :[me.createDateFilterPanel()]
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
        var productCode = null, productDesc = null, referenceNo = null;
        var jsonArray = [];
        var stnryBranchFilterView = me.getStnryBranchFilterView();
        if(!Ext.isEmpty(stnryBranchFilterView)){
            var sellerFilter = me.getSellerCombo();
            var productFilter=me.getProductFilter();
            var referenceNoFilter=me.getReferenceNoFilter();
            if(!Ext.isEmpty(sellerFilter)){
                sellerValue = sellerFilter.getValue();
            }
            if(!Ext.isEmpty(productFilter)){
                if(me.productSelected === true){
                    productCode = productFilter.getValue();
                } else {
                    productDesc = productFilter.getValue();
                }
            }
            if(!Ext.isEmpty(referenceNoFilter)){
            	referenceNo = referenceNoFilter.getValue();
            }
            if (!Ext.isEmpty(me.selectedEntryDate) && !Ext.isEmpty(me.selectedEntryDate.fromDate)) {
                jsonArray.push({
                            paramName : 'requestDate',
                            paramIsMandatory : true,
                            paramValue1 : me.selectedEntryDate.fromDate,
                            paramValue2 : me.selectedEntryDate.toDate,
                            operatorValue : me.selectedEntryDate.operator,
                            dataType : 'D',
                            paramFieldLable : me.selectedEntryDate.dateLabel
                        });
            }
            if (!Ext.isEmpty(sellerValue)) {
                jsonArray.push({
                    paramName : 'sellerCode',
                    paramValue1 : encodeURIComponent(sellerValue.replace(new RegExp("'", 'g'), "\''")),
                    operatorValue : 'eq',
                    dataType : 'S'
                });
            }
            if (!Ext.isEmpty(productCode)) {
                jsonArray.push({
                    paramName : 'productCode',
                    paramValue1 : encodeURIComponent(productCode.replace(new RegExp("'", 'g'), "\''")),
                    operatorValue : 'eq',
                    dataType : 'S'
                });
            }
            if (!Ext.isEmpty(referenceNo)) {
                jsonArray.push({
                    paramName : 'requestReferenceNo',
                    paramValue1 : encodeURIComponent(referenceNo.toUpperCase().replace(new RegExp("'", 'g'), "\''")),
                    operatorValue : 'eq',
                    dataType : 'S'
                });
            }
        }
        if (!Ext.isEmpty(productDesc)) {
            jsonArray.push({
                paramName : 'productDesc',
                paramValue1 : encodeURIComponent(productDesc.toUpperCase().replace(new RegExp("'", 'g'), "\''")),
                operatorValue : 'lk',
                dataType : 'S'
            });
        }
        if (!Ext.isEmpty(me.getStatusFilter()) && !Ext.isEmpty(me.getStatusFilter().getValue())
                && getLabel('all', 'All').toLowerCase() != me.getStatusFilter().getValue().toLowerCase())
        {
            statusVal = me.getStatusFilter().getValue();
            jsonArray.push({
                paramName : me.getStatusFilter().filterParamName,
                paramValue1 : statusVal,
                operatorValue : 'eq',
                dataType : 'S'
            });
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
                text : getLabel('stnIndCreateNew', 'Create Indent'),
                cls : 'cursor_pointer ux_button-background ux_button-padding ux_button-background-color ux_button-s',
                glyph:'xf055@fontawesome',
                parent : this,
                itemId : 'btnStnBranchCreateNew'
            });
        }
    },
    handleSmartGridConfig : function() {
        var me = this;
        var stnryBranchGrid = me.getStnryBranchGridView();
        var objConfigMap = me.getCourierDlyMaintGridConfiguration();
        var arrCols = null;
        if (!Ext.isEmpty(stnryBranchGrid))
            stnryBranchGrid.destroy(true);
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
                "requestReferenceNo" : 150,
                "requestBranchDesc" : 150,
                "requestBranchCode" : 150,
                "stateDesc" : 150,
                "productDesc" : 150,
                "viewImage" : 150,
                "requestDate" : 100,
                "dispatchDate" : 100,
                "lastUpdateDate" : 100,
                "requestQuantity" : 100,
                "receivedQuantity" : 100,
                "balanceQuantity" : 100,
                "startInstNmbr" : 100,
                "endInstNmbr" : 100,
                "courierAckNmbr" : 100,
                "invoiceNmbr" : 100,
                "requestStateDesc" : 150,
                "checkerStateDesc" : 150,
                "requestRemarks" : 150
            };
            
            arrColsPref = [
            {
                "colId" : "requestReferenceNo",
                "colDesc" : getLabel("requestReferenceNo","Unique Reference")
            },
            { 
                "colId" : "requestBranchDesc",
                "colDesc" : getLabel("requestBranchDesc","Request Branch")
            },
            { 
                "colId" : "requestBranchCode",
                "colDesc" : getLabel("requestBranchCode","Branch Code")
            },
            { 
                "colId" : "stateDesc",
                "colDesc" : getLabel("stateDesc","State")
            },
            { 
                "colId" : "productDesc",
                "colDesc" : getLabel("productDesc","Stationery Product")
            },
            { 
                "colId" : "viewImage",
                "colDesc" : getLabel("viewImage","Product Image")
            },
            { 
                "colId" : "requestDate",
                "colDesc" : getLabel("requestDate","Indent Date")
            },
            { 
                "colId" : "dispatchDate",
                "colDesc" : getLabel("dispatchDate","Dispatch Date")
            },
            { 
                "colId" : "lastUpdateDate",
                "colDesc" : getLabel("lastUpdateDate","Latest Update Date")
            },
            { 
                "colId" : "requestQuantity",
                "colDesc" : getLabel("requestQuantity","Indent Quantity")
            },
            { 
                "colId" : "receivedQuantity",
                "colDesc" : getLabel("receivedQuantity","Received Quantity")
            },
            { 
                "colId" : "balanceQuantity",
                "colDesc" : getLabel("balanceQuantity","Balance Quantity")
            },
            { 
                "colId" : "startInstNmbr",
                "colDesc" : getLabel("startInstNmbr","Start Instrument No.")
            },
            { 
                "colId" : "endInstNmbr",
                "colDesc" : getLabel("endInstNmbr","End Instrument No.")
            },
            { 
                "colId" : "courierAckNmbr",
                "colDesc" : getLabel("courierAckNmbr","Courier Tracking No.")
            },
            { 
                "colId" : "invoiceNmbr",
                "colDesc" : getLabel("invoiceNmbr","Invoice No.")
            },
            {
                "colId" : "requestStateDesc",
                "colDesc" : getLabel("status","Status")
            },
            { 
                "colId" : "checkerStateDesc",
                "colDesc" : getLabel("checkerStateDesc","Check Status"),
            }
            ,
            { 
                "colId" : "requestRemarks",
                "colDesc" : getLabel("requestRemarks","Request Remarks"),
            }];
            storeModel = {
                    fields : ['requestReferenceNo','requestBranchCode','requestBranchDesc','stateCode','stateDesc','productCode',
                          'productDesc','requestQuantity','requestRemarks','requestDate','dispatchDate','lastUpdateDate',
                          'receivedQuantity','balanceQuantity','startInstNmbr','endInstNmbr','courierAckNmbr','invoiceNmbr',
                          'makerBranchCode','makerBranchDesc','makerStamp','checkerStateDesc','requestStateDesc', 'parentRecordKey',
                          'version','isSubmitted','recordKeyNo', 'masterRecordkeyNo', 'identifier','__metadata','history',
                          'sellerId'],
                proxyUrl : 'services/stationeryBranch.json',
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
                text : getLabel('stnBranchActionDiscard', 'Discard'),
                itemId : 'discard',
                actionName : 'discard',
                maskPosition : 5
            }, {
                text : getLabel('stnBranchActionApprove', 'Approve'),
                itemId : 'accept',
                actionName : 'accept',
                maskPosition : 3
            }, {
                text : getLabel('stnBranchActionReject', 'Reject'),
                itemId : 'reject',
                actionName : 'reject',
                maskPosition : 4
            },
            {
                text : getLabel('stnBranchActionReceive', 'Receive'),
                itemId : 'receive',
                actionName : 'receive',
                maskPosition : 6
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
            items : [{
                itemId : 'btnView',
                itemCls : 'grid-row-action-icon icon-view',
                toolTip : getLabel('viewToolTip', 'View Record'),
                maskPosition : 1
            }, {
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
        maintGrid.on('cellclick', function(view, td, cellIndex, record,
                tr, rowIndex, e, eOpts) {
            if (td.className.match('x-grid-cell-col_viewImage')) {
                if(record.get('productCode') && record.get('sellerId'))
                {
                    viewStationeryImage(record.get('productCode'),record.get('sellerId'));
                }
            }
        });
        var stnryBranchGridDtlView = me.getStnryBranchGridDtlView();
        stnryBranchGridDtlView.add(maintGrid);
        stnryBranchGridDtlView.doLayout();
    },
    isRowIconVisible : function(store, record, jsonData, itmId, maskPosition) {
        var maskSize = 6;
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
        if ((maskPosition === 3 && retValue)) {
            retValue = retValue && isSameUser;
        } else if (maskPosition === 4 && retValue) {
            retValue = retValue && isSameUser;
        }else if (maskPosition === 6 && retValue) {
            retValue = retValue && isSameUser;
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
            || actionName === 'reject' || actionName === 'discard' || actionName === 'cancel' || actionName === 'receive')
            me.handleGroupActions(btn, record);
        else if (actionName === 'btnHistory') {
            var recHistory = record.get('history');
            if (!Ext.isEmpty(recHistory)&& !Ext.isEmpty(recHistory.__deferred.uri)) {
                me.showHistory(record.get('history').__deferred.uri, record.get('identifier'),record.get('recordKeyNo'));
            }
        } else if (actionName === 'btnView') {
            me.submitExtForm('viewStationeryBranch.form', record, rowIndex);
        } else if (actionName === 'btnEdit') {
            me.submitExtForm('editStationeryBranch.form', record, rowIndex);
        }
    },
    handleGroupActions : function(btn, record) {
        var me = this;
        var strAction = !Ext.isEmpty(btn.actionName)
                ? btn.actionName
                : btn.itemId;
        var strUrl = Ext.String.format('services/stationeryBranch/{0}.srvc?', strAction);
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
                    me.enableDisableGroupActions('000000', true);
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
                    if((item.maskPosition === 3 && blnEnabled)){
                        blnEnabled = blnEnabled && isSameUser;
                    } else  if(item.maskPosition === 4 && blnEnabled){
                        blnEnabled = blnEnabled && isSameUser;
                    } else  if(item.maskPosition === 6 && blnEnabled){
                        blnEnabled = blnEnabled && isSameUser;
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
        var gridView = me.getStnryBranchGridView();
        var grid = me.getGrid();
        strExtension = arrExtension[actionName];
        strUrl = 'services/generateStationeryBranchReport';
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
        var buttonMask = '000000';
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
    showHistory : function(url, id, recordKeyNo) {
        Ext.create('GCP.view.StationeryBranchHistoryPopup', {
                    recordKeyNo : recordKeyNo,
                    historyUrl : url,
                    identifier : id
                }).show();
    },
    cDlyMaintSetupEntryAction : function(){
        var me = this;
        var form;
        var strUrl = 'addStationeryBranch.form';
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
    },
    createDateFilterPanel : function() {
        var me = this;
        var dateMenuPanel = Ext.create('Ext.container.Container', {
            itemId : 'requestDateContainer',
            layout : 'vbox',
            width : 315,
            items : [
                {
                xtype : 'panel',
                itemId : 'requestDatePanel',
                layout : 'hbox',
                items : [
                    {
                    xtype : 'label',
                    itemId : 'requestDateLabel',
                    cls : 'f13 ux_font-size14',
                    text : getLabel('requestDate', 'Request Date')
                    }, {
                    xtype : 'button',
                    border : 0,
                    filterParamName : 'EntryDate',
                    itemId : 'requestDateBtn',
                    cls : 'menu-disable xn-custom-arrow-button cursor_pointer',
                    glyph : 'xf0d7@fontawesome',
                    listeners : {
                        click : function(event) {
                            var menus = me.getDateDropDownItems();
                            var xy = event.getXY();
                            menus.showAt(xy[0], xy[1] + 16);
                            event.menu = menus;
                            // event.removeCls('ui-caret-dropdown'),
                            // event.addCls('action-down-hover');
                        }
                    }
                }]
            },
            me.addDateContainerPanel()
            ]
        });
        return dateMenuPanel;
    },
    addDateContainerPanel : function() {
        var me = this;
        var dateContainerPanel = Ext.create('Ext.container.Container', {
            layout : 'hbox',
            itemId : 'requestDateToContainer',
            width : 210,
            items : [{
                xtype : 'component',
                width : '80%',
                itemId : 'paymentRequestDataPicker',
                filterParamName : 'EntryDate',
                html : '<input type="text"  id="requestDataPicker" class="ft-datepicker from-date-range ui-datepicker-range-alignment">'
                }, {
                    xtype : 'component',
                    cls : 'icon-calendar',
                    margin : '2 0 0 0',
                    html : '<span class=""><i class="fa fa-calendar"></i></span>'
                }]
        });
       return dateContainerPanel;
    },
    getDateDropDownItems : function()
    {
        var me = this;
        var arrMenuItem = [];
        arrMenuItem.push({
            btnId : 'latest',
            btnValue : '12',
            text : getDateIndexLabel('12'),
            handler : function(btn, opts) {
                $(document).trigger("filterDateChange",[btn,opts]);
            }
        });
        arrMenuItem.push({
            btnId : 'btnToday',
            btnValue : '1',
            text : getDateIndexLabel('1'),
            handler : function(btn, opts) {
                $(document).trigger("filterDateChange",[btn,opts]);
            }
        });
        arrMenuItem.push({
            btnId : 'btnYesterday',
            btnValue : '2',
            text : getDateIndexLabel('2'),
            handler : function(btn, opts) {
                $(document).trigger("filterDateChange",[btn,opts]);
            }
        });
        arrMenuItem.push({
            btnId : 'btnThisweek',
            btnValue : '3',
            text : getDateIndexLabel('3'),
            handler : function(btn, opts) {
                $(document).trigger("filterDateChange",[btn,opts]);
            }
        });
        arrMenuItem.push({
            btnId : 'btnLastweek',
            btnValue : '4',
            text : getDateIndexLabel('4'),
            handler : function(btn, opts) {
                $(document).trigger("filterDateChange",[btn,opts]);
            }
        });
        arrMenuItem.push({
            btnId : 'btnThismonth',
            btnValue : '5',
            text : getDateIndexLabel('5'),
            handler : function(btn, opts) {
                $(document).trigger("filterDateChange",[btn,opts]);
            }
        });
        arrMenuItem.push({
            btnId : 'btnLastmonth',
            btnValue : '6',
            text : getDateIndexLabel('6'),
            handler : function(btn, opts) {
                $(document).trigger("filterDateChange",[btn,opts]);
            }
        });
        arrMenuItem.push({
            btnId : 'btnLastMonthToDate',
            btnValue : '8',
            text : getDateIndexLabel('8'),
            handler : function(btn, opts) {
                $(document).trigger("filterDateChange",[btn,opts]);
            }
        });
        arrMenuItem.push({
            btnId : 'btnQuarterToDate',
            btnValue : '9',
            text : getDateIndexLabel('9'),
            handler : function(btn, opts) {
                $(document).trigger("filterDateChange",[btn,opts]);
            }
        });
        arrMenuItem.push( {
            btnId : 'btnLastQuarterToDate',
            btnValue : '10',
            text : getDateIndexLabel('10'),
            handler : function(btn, opts) {
                $(document).trigger("filterDateChange",[btn,opts]);
            }
        });
        arrMenuItem.push({
            btnId : 'btnYearToDate',
            btnValue : '11',
            text : getDateIndexLabel('11'),
            handler : function(btn, opts) {
                $(document).trigger("filterDateChange",[btn,opts]);
            }
        });
        var dropdownMenu = Ext.create('Ext.menu.Menu', {
            itemId : 'DateMenu',
            cls : 'ext-dropdown-menu',
            items : arrMenuItem
        });
        return dropdownMenu;
    },
    handleDateChange : function(index) {
        var me = this,dateToField;
        var objDateParams = me.getDateParam(index);
        var datePickerRef = $('#requestDataPicker');
        if (!Ext.isEmpty(me.dateFilterLabel)) {
            me.getRequestDateLabel().setText(getLabel('requestDate', 'Request Date') + " (" + me.dateFilterLabel + ")");
            var filterOperator = objDateParams.operator;
            var vFromDate = $.datepick.formatDate(strApplicationDateFormat, $.datepick.parseDate('yy-mm-dd', objDateParams.fieldValue1));
            var vToDate = $.datepick.formatDate(strApplicationDateFormat, $.datepick.parseDate('yy-mm-dd', objDateParams.fieldValue2));
            if (index == '13') {
                if (objDateParams.operator == 'eq') {
                    datePickerRef.datepick('setDate', vFromDate);
                } else {
                    datePickerRef.datepick('setDate', [vFromDate, vToDate]);
                }
            }
            else {
                if (index === '1' || index === '2') {
                    datePickerRef.datepick('setDate', vFromDate);
                } else {
                    datePickerRef.datepick('setDate', [vFromDate, vToDate]);
                }
            }
            if (filterOperator == 'eq')
                dateToField = "";
            else
                dateToField = objDateParams.fieldValue2;
            me.selectedEntryDate = {
                    operator : filterOperator,
                    fromDate : objDateParams.fieldValue1,
                    toDate : dateToField,
                    dateLabel : me.dateFilterLabel
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
        var fieldValue1 = '', fieldValue2 = '', operator = '',label = '';
        var retObj = {};
        var dtJson = {};
        switch (index) {
            case '1' :
                // Today
                fieldValue1 = Ext.Date.format(date, strSqlDateFormat);
                fieldValue2 = fieldValue1;
                operator = 'eq';
                label = getDateIndexLabel(index);
                break;
            case '2' :
                // Yesterday
                fieldValue1 = Ext.Date.format(objDateHandler.getYesterdayDate(date), strSqlDateFormat);
                fieldValue2 = fieldValue1;
                operator = 'eq';
                label = getDateIndexLabel(index);
                break;
            case '3' :
                // This Week
                dtJson = objDateHandler.getThisWeekToDate(date);
                fieldValue1 = Ext.Date.format(dtJson.fromDate, strSqlDateFormat);
                fieldValue2 = Ext.Date.format(dtJson.toDate, strSqlDateFormat);
                operator = 'bt';
                label = getDateIndexLabel(index);
                break;
            case '4' :
                // Last Week To Date
                dtJson = objDateHandler.getLastWeekToDate(date);
                fieldValue1 = Ext.Date.format(dtJson.fromDate, strSqlDateFormat);
                fieldValue2 = Ext.Date.format(dtJson.toDate, strSqlDateFormat);
                operator = 'bt';
                label = getDateIndexLabel(index);
                break;
            case '5' :
                // This Month
                dtJson = objDateHandler.getThisMonthToDate(date);
                fieldValue1 = Ext.Date.format(dtJson.fromDate, strSqlDateFormat);
                fieldValue2 = Ext.Date.format(dtJson.toDate, strSqlDateFormat);
                operator = 'bt';
                label = getDateIndexLabel(index);
                break;
            case '6' :
                // Last Month To Date
                dtJson = objDateHandler.getLastMonthToDate(date);
                fieldValue1 = Ext.Date.format(dtJson.fromDate, strSqlDateFormat);
                fieldValue2 = Ext.Date.format(dtJson.toDate, strSqlDateFormat);
                operator = 'bt';
                label = getDateIndexLabel(index);
                break;
            case '8' :
                // This Quarter
                dtJson = objDateHandler.getQuarterToDate(date);
                fieldValue1 = Ext.Date.format(dtJson.fromDate, strSqlDateFormat);
                fieldValue2 = Ext.Date.format(dtJson.toDate, strSqlDateFormat);
                operator = 'bt';
                label = getDateIndexLabel(index);
                break;
            case '9' :
                // Last Quarter To Date
                dtJson = objDateHandler.getLastQuarterToDate(date);
                fieldValue1 = Ext.Date.format(dtJson.fromDate, strSqlDateFormat);
                fieldValue2 = Ext.Date.format(dtJson.toDate, strSqlDateFormat);
                operator = 'bt';
                label = getDateIndexLabel(index);
                break;
            case '10' :
                // This Year
                dtJson = objDateHandler.getYearToDate(date);
                fieldValue1 = Ext.Date.format(dtJson.fromDate, strSqlDateFormat);
                fieldValue2 = Ext.Date.format(dtJson.toDate, strSqlDateFormat);
                operator = 'bt';
                label = getDateIndexLabel(index);
                break;
            case '11' :
                // Last Year To Date
                dtJson = objDateHandler.getLastYearToDate(date);
                fieldValue1 = Ext.Date.format(dtJson.fromDate, strSqlDateFormat);
                fieldValue2 = Ext.Date.format(dtJson.toDate, strSqlDateFormat);
                operator = 'bt';
                label = getDateIndexLabel(index);
                break;
             case '14' :
                // Last Month only
                dtJson = objDateHandler.getLastMonthStartAndEndDate(date);
                fieldValue1 = Ext.Date.format(dtJson.fromDate, strSqlDateFormat);
                fieldValue2 = Ext.Date.format(dtJson.toDate, strSqlDateFormat);
                operator = 'bt';
                label = getDateIndexLabel(index);
                break;
             case '13' :
                 // Date Range
                 if (!isEmpty(me.datePickerSelectedDate)) {
                        if (me.datePickerSelectedDate.length == 1) {
                            fieldValue1 = Ext.Date.format(me.datePickerSelectedDate[0], strSqlDateFormat);
                            fieldValue2 = fieldValue1;
                            operator = 'eq';
                            label = getDateIndexLabel(index);
                        } else if (me.datePickerSelectedDate.length == 2) {
                            fieldValue1 = Ext.Date.format(me.datePickerSelectedDate[0], strSqlDateFormat);
                            fieldValue2 = Ext.Date.format(me.datePickerSelectedDate[1], strSqlDateFormat);
                            operator = 'bt';
                            label = getDateIndexLabel(index);
                        }
                    }
                 break;
             case '12' :
                 // Latest
                    var fromDate = new Date(Ext.Date.parse(latestFromDate, dtFormat));
                    var toDate = new Date(Ext.Date.parse(latestToDate, dtFormat));
                    fieldValue1 = Ext.Date.format(fromDate, strSqlDateFormat);
                    fieldValue2 = Ext.Date.format(toDate, strSqlDateFormat);
                    operator = 'bt';
                    label = getDateIndexLabel(index);
                    break;
        }
        retObj.fieldValue1 = fieldValue1;
        retObj.fieldValue2 = fieldValue2;
        retObj.operator = operator;
        retObj.label = label;
        return retObj;
    }
});