/**
 * @class GCP.controller.CourierDlyMaintController
 * @extends Ext.app.Controller
 * @author Sumith Khandagle
 */
Ext.define('GCP.controller.CourierDlyMaintController', {
    extend : 'Ext.app.Controller',
    requires : ['Ext.util.Point','Ext.panel.Panel'],
    views : ['GCP.view.CourierDlyMaintView',
             'GCP.view.CourierDlyMaintFilterView',
             'GCP.view.CourierDlyMaintGridView',
             'CourierDlyMaintActionBarView',
             'GCP.view.CourierDlyMaintHistoryPopup'],
    
    refs : [{
            ref : 'cDlyMaintView',
            selector : 'courierDlyMaintView'
        },{
            ref : 'createNewToolBar',
            selector : 'courierDlyMaintView courierDlyMaintGridView toolbar[itemId="btnCreateNewToolBar"]'
        },{
            ref : 'cDlyMaintFilterView',
            selector : 'courierDlyMaintView courierDlyMaintFilterView'
        },{
            ref : 'gridHeader',
            selector : 'courierDlyMaintView courierDlyMaintGridView panel[itemId="clientSetupDtlView"] container[itemId="gridHeader"]'
        },{
            ref : 'cDlyMaintGridView',
            selector : 'courierDlyMaintView courierDlyMaintGridView grid[itemId="gridViewMstId"]'
        },{
            ref : 'cDlyMaintGridDtlView',
            selector : 'courierDlyMaintView courierDlyMaintGridView panel[itemId="clientSetupDtlView"]'
        },{
            ref : 'grid',
            selector : 'courierDlyMaintGridView smartgrid'
        },{
            ref : 'groupActionBar',
            selector : 'courierDlyMaintView courierDlyMaintGridView courierDlyMaintActionBarView'
        },{
            ref : 'specificFilterPanel',
            selector : 'courierDlyMaintView courierDlyMaintFilterView panel container[itemId="specificFilter"]'
        },{
            ref : "couirerACKNmbr",
            selector : 'courierDlyMaintView courierDlyMaintFilterView textfield[itemId="couirerACKNmbr"]'
        },{
            ref : "courierEntryDateFrm",
            selector : 'courierDlyMaintView courierDlyMaintFilterView textfield[itemId="courierEntryDateFrm"]'
        },
        {
            ref : "courierEntryDateTo",
            selector : 'courierDlyMaintView courierDlyMaintFilterView textfield[itemId="courierEntryDateTo"]'
        },
        {
            ref : "dispatchCourierFilter",
            selector : 'courierDlyMaintView courierDlyMaintFilterView textfield[itemId="dispatchCourierFilter"]'
        },
        {
            ref : "makerBranchFilter",
            selector : 'courierDlyMaintView courierDlyMaintFilterView textfield[itemId="makerBranchFilter"]'
        },{
            ref : "sellerCombo",
            selector : 'courierDlyMaintView courierDlyMaintFilterView combobox[itemId="sellerCombo"]'
        },{
            ref : "statusFilter",
            selector : 'courierDlyMaintView courierDlyMaintFilterView combobox[itemId="statusFilter"]'
        },{
            ref : 'downloadReport',
            selector : 'courierDlyMaintView courierDlyMaintTitleView menuitem[itemId="downloadReport"]'
        },],
    config : {
        filterData : [],
        clientSelected : false,
        makerBranchSelected : false,
        reportGridOrder : null
    },
    init : function() {
        var me = this;
        me.control({
            'courierDlyMaintView courierDlyMaintFilterView' : {
                render : function() {
                    me.setInfoTooltip();
                    me.handleSpecificFilter();
                    me.setDataForFilter();
                    me.applyFilter();
                }
            },
            
            'courierDlyMaintView courierDlyMaintGridView panel[itemId="clientSetupDtlView"]' : {
                render : function() {
                    me.handleGridHeader();
                }
            },
            
            'courierDlyMaintGridView' : {
                render : function(panel) {
                    me.handleSmartGridConfig();
                }
            },
            
            'courierDlyMaintGridView smartgrid' : {
                render : function(grid) {
                    me.handleLoadGridData(grid, grid.store.dataUrl,
                            grid.pageSize, 1, 1, null);
                },
                gridPageChange : me.handleLoadGridData,
                gridSortChange : me.handleLoadGridData,
                gridRowSelectionChange : function(grid, record, recordIndex,
                        records, jsonData) {
                    me.enableValidActionsForGrid(grid, record, recordIndex,
                            records, jsonData);
                }
            },
            
            'courierDlyMaintGridView toolbar[itemId=courierDlyMaintActionBarView]' : {
                performGroupAction : function(btn, opts) {
                    me.handleGroupActions(btn);
                }
            },
            
            'courierDlyMaintView courierDlyMaintFilterView button[itemId="btnFilter"]' : {
                click : function(btn, opts) {
                    me.setDataForFilter();
                    me.applyFilter();
                }
            },
            
            'courierDlyMaintView courierDlyMaintGridView toolbar[itemId="btnCreateNewToolBar"] button[itemId="btnCDlyMaintCreateNew"]' : {
                click : function() {
                     me.cDlyMaintSetupEntryAction();
                }
            },
            
            'courierDlyMaintView courierDlyMaintTitleView' : {
                'performReportAction' : function(btn) {
                     me.handleReportAction(btn);
             }
            },
        });
    },
    setInfoTooltip : function() {
        var me = this;
        Ext.create('Ext.tip.ToolTip', {
            target : 'imgFilterInfo',
            listeners : {
                beforeshow : function(tip) {
                    var sellerFilter = '';
                    var clientName='';
                    var courierAckNmbr = '';
                    var creationDateFrm = '';
                    var creationDateTo = '';
                    var statusFilter = '';
                    var makerBranch = '';
                    var sllerComboFilterId=me.getSellerCombo();
                    var dispatchCourierFilter=me.getDispatchCourierFilter();
                    var statusFilterId = me.getStatusFilter();
                    var creationDateFromId = me.getCourierEntryDateFrm();
                    var creationDateToId = me.getCourierEntryDateTo();
                    var couirerACKNmbrId = me.getCouirerACKNmbr();
                    var makerBranchFilter = me.getMakerBranchFilter();
                    if (!Ext.isEmpty(sllerComboFilterId)
                            && !Ext.isEmpty(sllerComboFilterId.getValue()))
                        sellerFilter = sllerComboFilterId.getRawValue();
                    else
                        sellerFilter = getLabel( 'all', 'All' );
                    
                    if (!Ext.isEmpty(dispatchCourierFilter)
                            && !Ext.isEmpty(dispatchCourierFilter.getValue()))
                        clientName = dispatchCourierFilter.getRawValue();
                    else
                        dispBankName = getLabel( 'all', 'All' );
                        
                     if (!Ext.isEmpty(creationDateFromId)
                            && !Ext.isEmpty(creationDateFromId.getValue()))
                        creationDateFrm = creationDateFromId.getRawValue();
                        
                     if (!Ext.isEmpty(creationDateToId)
                            && !Ext.isEmpty(creationDateToId.getValue()))
                        creationDateTo = creationDateToId.getRawValue();
                        
                     if (!Ext.isEmpty(couirerACKNmbrId)
                            && !Ext.isEmpty(couirerACKNmbrId.getValue()))
                        courierAckNmbr = couirerACKNmbrId.getRawValue();
                                           
                    if( !Ext.isEmpty(statusFilterId) && !Ext.isEmpty(statusFilterId.getRawValue()))
                        statusFilter = statusFilterId.getRawValue()
                    else
                        statusFilter = getLabel( 'all', 'All' );
                    
                    if( !Ext.isEmpty(makerBranchFilter) && !Ext.isEmpty(makerBranchFilter.getRawValue()))
                    	makerBranch = makerBranchFilter.getRawValue()
                    
                    tip.update(getLabel('seller', 'Financial Institution') + ' : '
                            + sellerFilter + '<br/>'
                            + getLabel('companyName', 'Company Name') + ' : '
                            + clientName + '<br/>'
                            + getLabel('couirerACKNmbr', 'Courier ACK Number') + ' : '
                            + courierAckNmbr + '<br/>'
                            + getLabel('status', 'Status') + ' : '
                            + statusFilter  + '<br/>'
                            + getLabel('creationDateFrm', 'Creation Date From') + ' : '
                            + creationDateFrm + '<br/>'
                            + getLabel('creationDateTo', 'Creation Date To') + ' : '
                            + creationDateTo + '<br/>'
                            + getLabel('makerBranch','Print Branch') + ' : '
                            + makerBranch + '<br/>');
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
        
        var createClientAutocompleter = Ext.create('Ext.ux.gcp.AutoCompleter', {
            fieldCls : 'xn-form-text w165 xn-suggestion-box ux_font-size14-normal',
            cls:'ux_font-size14-normal',
            name : 'client',
            itemId : 'dispatchCourierFilter',
            cfgUrl : 'services/userseek/{0}.json',
            cfgProxyMethodType : 'POST',
            cfgQueryParamName : '$autofilter',
            cfgRecordCount : -1,
            matchFieldWidth:true,
            cfgSeekId : 'clientSeek',
            enableQueryParam:false,
            cfgRootNode : 'd.preferences',
            cfgDataNode1 : 'CLIENT_NAME',
            cfgKeyNode:'CLIENT_ID',
            listeners:{
                'select' : function(combo, record) {
                    me.clientSelected = true;
                },
                'change' : function(combo, record) {
                    me.clientSelected = false;
                }
            }
        });

        var createMakerBranchAutocompleter = Ext.create('Ext.ux.gcp.AutoCompleter', {
            fieldCls : 'xn-form-text w165 xn-suggestion-box ux_font-size14-normal',
            cls:'ux_font-size14-normal',
            name : 'makerBranch',
            itemId : 'makerBranchFilter',
            cfgUrl : 'services/userseek/{0}.json',
            cfgProxyMethodType : 'POST',
            cfgQueryParamName : '$autofilter',
            cfgRecordCount : -1,
            matchFieldWidth:true,
            cfgSeekId : 'printBranch',
            enableQueryParam:false,
            cfgRootNode : 'd.preferences',
            cfgDataNode1 : 'DESCRIPTION',
            cfgKeyNode:'CODE',
            value:makerBranchDesc,
            listeners:{
                'select' : function(combo, record) {
                	me.makerBranchSelected = true;
                },
                'change' : function(combo, record) {
                	me.makerBranchSelected = false;
                }
            }
        });
        
        var statusStore = Ext.create('Ext.data.Store', {
            fields : ["name", "value"],
            proxy : {
                type : 'ajax',
                autoLoad : true,
                url : 'services/courierDlyStatusList.json?' + csrfTokenName + "=" + csrfTokenValue,
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
            width : 165,
            listeners : {
                'render' : function(combo, record) {
                    combo.store.load();                    
                    var dispatchBankAutoCompleter = me.getDispatchCourierFilter();
                    dispatchBankAutoCompleter.reset();
                },
                'change' : function(combo, record) {
                    var strSellerId=combo.getValue();
                    setAdminSeller(strSellerId);
                                        
                    var dispatchBankAutoCompleter = me.getDispatchCourierFilter();
                    dispatchBankAutoCompleter.reset();
                }
            }
        });
        var filterPanel = me.getSpecificFilterPanel();
        var createCreationDateTo = me.createCreationDateTo();
        var createCreationDateFrm =me.createCreationDateFrm();
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
                            width : '33%',
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
                           width : '33%',
                           layout : {
                                    type : 'vbox'
                           },
                           items : [{
                               xtype : 'label',
                                layout : {
                                    type : 'hbox'
                                },
                                width : 315,
                                text : getLabel('companyName','Company Name'),
                                cls : 'f13 ux_font-size14 ux_normalmargin-bottom'
                            }, createClientAutocompleter]
                        },
                        {
                            xtype : 'panel',
                            cls : 'xn-filter-toolbar',
                            padding : '5px',
                            width : '33%',
                            layout : {
                                type : 'vbox'
                            },
                            items : [
                                {
                                    xtype : 'label',
                                    layout : {
                                      type : 'hbox'
                                    },
                                    width : 315,
                                    text : getLabel('courierACKNmbr', 'Courier ACK Number'),
                                    cls : 'f13 ux_font-size14 ux_normalmargin-bottom'
                                },
                                {
                                    xtype : 'textfield',
                                    itemId : 'couirerACKNmbr',
                                    maxLength : 20,
                                    fieldCls : 'xn-valign-middle xn-form-text w10_5',
                                    labelCls : 'frmLabel',
                                    layout : 'hbox',                                    
                                    labelSeparator : '',
                                    enforceMaxLength : true,
                                    enableKeyEvents : true,
                                    listeners : {
                                        'keypress' : function(
                                                text) {
                                            //if( text.value.length === 20 )
                                            //  me.showErrorMsg();
                                        }
                                    }
                                } ]         
                         },
                    ]
                },
                {
                    xtype : 'panel',
                    layout : 'hbox',
                    items :[
                    {
                       xtype : 'panel',
                       cls : 'xn-filter-toolbar',
                       width : '33%',
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
                            text : getLabel('status', 'Status'),
                            width : 315,
                            cls : 'f13 ux_font-size14 ux_normalmargin-bottom'
                        },{
                            xtype : 'combobox',
                            fieldCls : 'xn-form-field inline_block ux_font-size14-normal',
                            triggerBaseCls : 'xn-form-trigger',
                            itemId : 'statusFilter',
                            filterParamName : 'courierRequestState',
                            store : statusStore,
                            valueField : 'name',
                            displayField : 'value',
                            editable : false,
                            width : 165,
                            value : getLabel('all',
                                    'ALL')
                            }]
                    },
                    {
                        items :[createCreationDateFrm]
                    }, 
                    { 
                        items :[createCreationDateTo]
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
                        padding : '5px',
                        width : '33%',
                        layout : {
                                 type : 'vbox'
                        },
                        items : [{
                            xtype : 'label',
                             layout : {
                                 type : 'hbox'
                             },
                             width : 315,
                             text : getLabel('makerBranch','Print Branch'),
                             cls : 'f13 ux_font-size14 ux_normalmargin-bottom'
                         }, createMakerBranchAutocompleter]
                    },
                    {
                        xtype : 'panel',
                        cls : 'xn-filter-toolbar',
                        padding : '5px',
                        itemId: 'buttonFilter',
                        layout : {
                            type : 'vbox'
                        },
                        width : '33%',
                        items : [{
                        xtype : 'panel',
                        layout : 'hbox',
                        padding : '25 0 0 0',
                        items : [{
                        xtype : 'button',
                        itemId : 'btnFilter',
                        text : getLabel('search',
                                    'Search'),
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
        var sellerValue = null, clientCode = null, clientNameVal = null,couirerACKNmbr,courierEntryDateFrm=null,courierEntryDateTo=null, statusVal = null;
        var makerBranch = null, makerBranchDesc = null;
        var jsonArray = [];
        var cDlyMaintFilterView = me.getCDlyMaintFilterView();
        if(!Ext.isEmpty(cDlyMaintFilterView)){
            var sellerFilter = me.getSellerCombo();
            var dispatchCourierFilter=me.getDispatchCourierFilter();
            var makerBranchFilter=me.getMakerBranchFilter();
            var courierEntryDateFrmFilter=me.getCourierEntryDateFrm() ;  
            var courierEntryDateToFilter=me.getCourierEntryDateTo() ; 
            var couirerACKNmbrFilter=me.getCouirerACKNmbr() ;          
            if(!Ext.isEmpty(sellerFilter)){
                sellerValue = sellerFilter.getValue();
            }
            
            if(!Ext.isEmpty(dispatchCourierFilter)){
                if(me.clientSelected === true){
                    clientCode = dispatchCourierFilter.getValue();
                } else {
                    clientNameVal = dispatchCourierFilter.getValue();
                }
            }

            if(!Ext.isEmpty(makerBranchFilter))
            {
            	if(me.makerBranchSelected === true)
            	{
            		makerBranch = makerBranchFilter.getValue();
            	}
            	else 
            	{
            		makerBranchDesc = makerBranchFilter.getValue();
                }
            }

             if(!Ext.isEmpty(couirerACKNmbrFilter)){
                    couirerACKNmbr = couirerACKNmbrFilter.getValue();
            }
            
            if(!Ext.isEmpty(courierEntryDateFrmFilter) && !Ext.isEmpty(courierEntryDateToFilter)){
                courierEntryDateFrm = new Date(courierEntryDateFrmFilter.value);
                courierEntryDateTo =  new Date(courierEntryDateToFilter.value);
            }
            
            if (!Ext.isEmpty(sellerValue)) {
                jsonArray.push({
                    paramName : 'sellerCode',
                    paramValue1 : encodeURIComponent(sellerValue.replace(new RegExp("'", 'g'), "\''")),
                    operatorValue : 'eq',
                    dataType : 'S'
                });
            }
            
            if (!Ext.isEmpty(clientCode)) {
                jsonArray.push({
                    paramName : 'clientCode',
                    paramValue1 : encodeURIComponent(clientCode.replace(new RegExp("'", 'g'), "\''")),
                    operatorValue : 'eq',
                    dataType : 'S'
                });
            }
            
            if (!Ext.isEmpty(couirerACKNmbr)) {
                jsonArray.push({
                    paramName : 'courierAckNumber',
                    paramValue1 : encodeURIComponent(couirerACKNmbr.replace(new RegExp("'", 'g'), "\''")),
                    operatorValue : 'lk',
                    dataType : 'S'
                });
            }
            
            if(!Ext.isEmpty(courierEntryDateFrm) && !Ext.isEmpty(courierEntryDateTo)){
                jsonArray.push({
                      paramName : 'courierEntryDate',
                      paramValue1 : Ext.Date.format(courierEntryDateFrm, 'Y-m-d' ),
                      paramValue2 : Ext.Date.format(courierEntryDateTo, 'Y-m-d' ),
                      operatorValue : 'bt',
                      dataType : 'D'
                 });
              }
            if (!Ext.isEmpty(makerBranch)) {
                jsonArray.push({
                    paramName : 'makerBranch',
                    paramValue1 : encodeURIComponent(makerBranch.replace(new RegExp("'", 'g'), "\''")),
                    operatorValue : 'eq',
                    dataType : 'S'
                });
            }
              
        }
        if (!Ext.isEmpty(clientNameVal)) {
            jsonArray.push({
                paramName : 'clientName',
                paramValue1 : encodeURIComponent(clientNameVal.toUpperCase().replace(new RegExp("'", 'g'), "\''")),
                operatorValue : 'lk',
                dataType : 'S'
            });
        }
        
        if (!Ext.isEmpty(makerBranchDesc)) {
            jsonArray.push({
                paramName : 'makerBranchDesc',
                paramValue1 : encodeURIComponent(makerBranchDesc.toUpperCase().replace(new RegExp("'", 'g'), "\''")),
                operatorValue : 'lk',
                dataType : 'S'
            });
        }
        
        if (!Ext.isEmpty(me.getStatusFilter())
                && !Ext.isEmpty(me.getStatusFilter().getValue())
                && getLabel('all', 'All').toLowerCase() != me.getStatusFilter().getValue().toLowerCase())
        {
            statusVal = me.getStatusFilter().getValue();
            var strInFlag = false;
            if (statusVal == 1 || statusVal == 3) {
                if (statusVal == 1){ // Submitted
                    statusVal = new Array(0, 1);
                    jsonArray.push({
                        paramName : 'isSubmitted',
                        paramValue1 : 'Y',
                        operatorValue : 'eq',
                        dataType : 'S'
                    });
                    strInFlag = true;
                } else {// Valid/Authorized
                    jsonArray.push({
                        paramName : 'validFlag',
                        paramValue1 : 'Y',
                        operatorValue : 'eq',
                        dataType : 'S'
                    });
                }
            } 
            else if (statusVal == 0) {// New
                jsonArray.push({
                    paramName : 'isSubmitted',
                    paramValue1 : 'N',
                    operatorValue : 'eq',
                    dataType : 'S'
                });
            }
            if (strInFlag) {// Used for Submitted & Rejected status
                jsonArray.push({
                    paramName : me.getStatusFilter().filterParamName,
                    paramValue1 : statusVal,
                    operatorValue : 'in',
                    dataType : 'S'
                });
            } else {
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
            var strUrl = grid.generateUrl(strDataUrl, grid.pageSize, 1, 1,
                    store.sorters);
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
                text : getLabel('cDlyMaintCreateNew', 'Dispatch'),
                cls : 'cursor_pointer ux_button-background ux_button-padding ux_button-background-color ux_button-s',
                glyph:'xf055@fontawesome',
                parent : this,
                itemId : 'btnCDlyMaintCreateNew'
            });
        }
    },
    
    handleSmartGridConfig : function() {
        var me = this;
        var cDlyMaintGrid = me.getCDlyMaintGridView();
        var objConfigMap = me.getCourierDlyMaintGridConfiguration();
        var arrCols = null;
        if (!Ext.isEmpty(cDlyMaintGrid))
            cDlyMaintGrid.destroy(true);
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
                "clientName" : 200,
                "totalInstruments":105,
                "courierAckNumber" : 200,
                "courierName" :200,
                "dispatchSameDay" : 140,
                "courierEntryDate":110,
                "printBranchDesc" : 140,
                "requestStateDesc" : 140
            };
            
            arrColsPref = [{    
                "colId" : "clientName",
                "colDesc" : getLabel("companyName","Company Name")
            },{ 
                "colId" : "totalInstruments",
                "colDesc" : getLabel("instrumentCount","Instrument Count")
            },{ 
                "colId" : "courierAckNumber",
                "colDesc" : getLabel("couirerACKNmbr","Courier ACK Number")
            },{ 
                "colId" : "courierName",
                "colDesc" : getLabel("courierName","Courier Name"),
            },
            { 
                "colId" : "dispatchSameDay",
                "colDesc" : getLabel("dispatchDay","Dispatch"),
            },
            { 
                "colId" : "courierEntryDate",
                "colDesc" : getLabel("courierEntryDate","Courier Entry Date")
            },
            {
                "colId" : "printBranchDesc",
                "colDesc" : getLabel("makerBranch","Maker Branch")
            },
            {
                "colId" : "requestStateDesc",
                "colDesc" : getLabel("status","Status")
            }];
            
            storeModel = {
                    fields : ['clientName','clientId','totalInstruments', 'courierAckNumber','courierName','dispatchSameDay',
                          'courierEntryDate', 'printBranchDesc' ,'requestStateDesc', 'parentRecordKey', 'version','isSubmitted',
                          'recordKeyNo', 'masterRecordkeyNo', 'identifier','__metadata','history'],
                proxyUrl : 'services/courierDlyMaintMst.json',
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
    
    createGroupActionColumn : function() {
        var objActionCol = {
            colType : 'actioncontent',
            colId : 'groupaction',
            width : 120,
            locked : true,
            items: [{
                text : getLabel('submit', 'Submit'),
                itemId : 'submit',
                actionName : 'submit',
                maskPosition : 5
            }, {
                text : getLabel('discard', 'Discard'),
                itemId : 'discard',
                actionName : 'discard',
                maskPosition : 10
            }, {
                text : getLabel('dbpclActionApprove', 'Approve'),
                itemId : 'accept',
                actionName : 'accept',
                maskPosition : 6
            }, {
                text : getLabel('dbpclActionReject', 'Reject'),
                itemId : 'reject',
                actionName : 'reject',
                maskPosition : 7
            }, {
                text : getLabel('dbpclActionEnable', 'Enable'),
                itemId : 'enable',
                actionName : 'enable',
                maskPosition : 8
            }, {
                text : getLabel('dbpclActionSuspend', 'Suspend'),
                itemId : 'disable',
                actionName : 'disable',
                maskPosition : 9
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
                itemId : 'btnEdit',
                itemCls : 'grid-row-action-icon icon-edit',
                toolTip : getLabel('editToolTip', 'Edit Record'),
                maskPosition : 2
            }, {
                itemId : 'btnView',
                itemCls : 'grid-row-action-icon icon-view',
                toolTip : getLabel('viewToolTip', 'View Record'),
                maskPosition : 3
            }, {
                itemId : 'btnHistory',
                itemCls : 'grid-row-action-icon icon-history',
                itemLabel : getLabel('historyToolTip',
                        'View History'),
                maskPosition : 4
            }]
        };
        return objActionCol;
    },
    
    handleSmartGridLoading : function(arrCols, storeModel) {
        var me = this;
        var pgSize = null;
        pgSize = 10;
        var courierDlyMaintGrid = Ext.create('Ext.ux.gcp.SmartGrid', {
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

            handleRowIconClick : function(tableView, rowIndex, columnIndex,
                    btn, event, record) {
                me.handleRowIconClick(tableView, rowIndex, columnIndex, btn,
                        event, record);
            },

            handleMoreMenuItemClick : function(grid, rowIndex, cellIndex,
                                            menu, event, record) {
                var dataParams = menu.dataParams;
                me.handleRowIconClick(dataParams.view, dataParams.rowIndex,
                        dataParams.columnIndex, menu, null, dataParams.record);
            }
        });

        var cDlyMaintGridDtlView = me.getCDlyMaintGridDtlView();
        cDlyMaintGridDtlView.add(courierDlyMaintGrid);
        cDlyMaintGridDtlView.doLayout();
    },
    
    isRowIconVisible : function(store, record, jsonData, itmId, maskPosition) {
        var maskSize = 11;
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
        if ((maskPosition === 6 && retValue)) {
            retValue = retValue && isSameUser;
        } else if (maskPosition === 7 && retValue) {
            retValue = retValue && isSameUser;
        } else if (maskPosition === 2 && retValue) {
            reqState = record.raw.requestState;
            submitFlag = record.raw.isSubmitted;
            validFlag = record.raw.validFlag;
            var isDisabled = (reqState === 3 && validFlag == 'N');
            var isSubmitModified = (reqState === 1 && submitFlag == 'Y');
            retValue = retValue && (!isDisabled) && (!isSubmitModified);
        } else if (maskPosition === 10 && retValue) {
            reqState = record.raw.requestState;
            submitFlag = record.raw.isSubmitted;
            var submitResult = (reqState === 0 && submitFlag == 'Y');
            retValue = retValue && (!submitResult);
        }else if (maskPosition === 8 && retValue) {
            validFlag = record.raw.validFlag;
            reqState = record.raw.requestState;
            retValue = retValue && (reqState == 3 && validFlag == 'N');
        }
        else if (maskPosition === 9 && retValue) {
            validFlag = record.raw.validFlag;
            reqState = record.raw.requestState;
            retValue = retValue && (reqState == 3 && validFlag == 'Y');
        }
        return retValue;
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
    
    handleRowIconClick : function(tableView, rowIndex, columnIndex, btn, event,
            record) {
        var me = this;
        var actionName = btn.itemId;
        if (actionName === 'submit' || actionName === 'accept'
                || actionName === 'enable' || actionName === 'disable'
                || actionName === 'reject' || actionName === 'discard')
            me.handleGroupActions(btn, record);
        else if (actionName === 'btnHistory') {
            var recHistory = record.get('history');
            if (!Ext.isEmpty(recHistory)&& !Ext.isEmpty(recHistory.__deferred.uri)) {
                me.showHistory(record.get('history').__deferred.uri, record.get('identifier'),record.get('courierAckNumber'));
            }
        } else if (actionName === 'btnView') {
            me.submitExtForm('viewCourierDlyMaintMst.form', record, rowIndex);
        } else if (actionName === 'btnEdit') {
            me.submitExtForm('editCourierDlyMaintMst.form', record, rowIndex);
        }
    },
    
    handleGroupActions : function(btn, record) {
        var me = this;
        var strAction = !Ext.isEmpty(btn.actionName)
                ? btn.actionName
                : btn.itemId;
        var strUrl = Ext.String.format('services/courierDlyMaintMst/{0}.srvc?',
                strAction);
        if (strAction === 'reject') {
            me.showRejectVerifyPopUp(strAction, strUrl,record);
        } else {
            me.preHandleGroupActions(strUrl, '',record);
        }
    },
    
    showRejectVerifyPopUp : function(strAction, strActionUrl,record) {
        var me = this;
        var titleMsg = '', fieldLbl = '';
        if (strAction === 'reject') {
            fieldLbl = getLabel('dbpclRemarkPopupTitle',
                    'Please enter reject remark');
            titleMsg = getLabel('dbpclRemarkPopupFieldLabel', 'Reject Remark');
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
                           Ext.Msg.alert(getLabel('errorTitle', 'Error'), getLabel('rejectRestrictionErroMsg',
                                    'Reject Remark field can not be blank'));
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
                                    title : getLabel('errorPopUpTitle','Error'),
                                    msg : errorMessage,
                                    buttons : Ext.MessageBox.OK,
                                    cls : 'ux_popup',
                                    icon : Ext.MessageBox.ERROR
                                });
                            } 
                        }
                    }
                    me.enableDisableGroupActions('0000000000', true);
                    grid.refreshData();
                },
                failure : function() {
                    Ext.MessageBox.show({
                        title : getLabel('errorPopUpTitle','Error'),
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
                    if((item.maskPosition === 6 && blnEnabled)){
                        blnEnabled = blnEnabled && isSameUser;
                    } else  if(item.maskPosition === 7 && blnEnabled){
                        blnEnabled = blnEnabled && isSameUser;
                    }else if (item.maskPosition === 8 && blnEnabled) {
                        blnEnabled = blnEnabled && isDisabled;
                    } else if (item.maskPosition === 9 && blnEnabled) {
                        blnEnabled = blnEnabled && !isDisabled;
                    } else if (item.maskPosition === 10 && blnEnabled) {
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
        var gridView = me.getCDlyMaintGridView();
        var grid = me.getGrid();
        strExtension = arrExtension[actionName];
        strUrl = 'services/generateCourierReport';
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
    
    enableValidActionsForGrid : function(grid, record, recordIndex,
            selectedRecords, jsonData) {
        var me = this;
        var buttonMask = '0000000000';
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
        actionMask = doAndOperation(maskArray, 10);
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
        form.appendChild(me.createFormField('INPUT', 'HIDDEN',
                csrfTokenName, tokenValue));
        form.appendChild(me.createFormField('INPUT', 'HIDDEN',
                'txtRecordIndex', rowIndex));
        form.appendChild(me.createFormField('INPUT', 'HIDDEN', 'viewState',
                viewState));

        form.action = strUrl;
        //me.setFilterParameters(form);
        document.body.appendChild(form);
        form.submit();
    },
    
    setFilterParameters : function(form) {
        var me = this;
        var arrJsn = {};
        arrJsn['sellerId'] =  strSellerId;
        form.appendChild(me.createFormField('INPUT', 'HIDDEN', 'filterData',
                Ext.encode(arrJsn)));
    },
    
    createFormField : function(element, type, name, value) {
        var inputField;
        inputField = document.createElement(element);
        inputField.type = type;
        inputField.name = name;
        inputField.value = value;
        return inputField;
    },
    showHistory : function(url, id, ackNumber) {
        Ext.create('GCP.view.CourierDlyMaintHistoryPopup', {
                    couirerACKNmbr : ackNumber,
                    historyUrl : url,
                    identifier : id
                }).show();
    },
    cDlyMaintSetupEntryAction : function(){
        var me = this;
        var form;
        var strUrl = 'addCourierDlyMaintMst.form';
        form = document.createElement('FORM');
        form.name = 'frmMain';
        form.id = 'frmMain';
        form.method = 'POST';
        form.appendChild(me.createFormField('INPUT', 'HIDDEN',
                csrfTokenName, tokenValue));
        form.action = strUrl;
        document.body.appendChild(form);
        form.submit();
        document.body.removeChild(form);
    },
    columnRenderer : function(value, meta, record, rowIndex, colIndex, store, view, colId){
        var strRetVal = value;
        if(!Ext.isEmpty(strRetVal)) {
        	if(colId === 'col_dispatchSameDay')
        	{
    			if(strRetVal == 'Y')
    			{
    				strRetVal = getLabel('sameDay','Same Day');
    			}
    			else if(strRetVal == 'N')
    			{
    				strRetVal = getLabel('nextDay','Next Day');
    			}
    		}
            meta.tdAttr = 'title="' + strRetVal + '"';
        }
        return strRetVal;
    },
    createCreationDateFrm : function() {
        var creationDateFrmPanel = Ext.create('Ext.panel.Panel', {
            cls : 'xn-filter-toolbar',
            padding : '5px',
            width : '33%',
            layout : {
              type : 'vbox'
            },
            items : [ {
                xtype : 'panel',
                layout : 'vbox',
                width : 315,
                defaults :
                {
                    labelAlign : 'top',
                },
                items :
                [
                    {
                        xtype : 'datefield',
                        name : 'receivedOn',
                        itemId : 'courierEntryDateFrm',
                        format : strExtApplicationDateFormat,
                        editable : false,
                        value : new Date(),
                        labelSeparator : '',
                        fieldLabel : getLabel('creationDateFrm', 'Courier Entry Date From' ),
                        fieldCls : 'xn-valign-middle xn-form-text w10_5',
                        allowBlank : true,
                        labelCls: 'frmLabel',
                        hideTrigger : true
                    }
                ]
            } ]
        });
        return creationDateFrmPanel;
    },
    createCreationDateTo : function() {
        var creationDateToPanel = Ext.create('Ext.panel.Panel', {
            cls : 'xn-filter-toolbar',
            padding : '5px',
            width : '33%',
            layout : {
              type : 'vbox'
            },
            items : [ {
                xtype : 'panel',
                layout : 'vbox',
                width : '315',                
                defaults :
                {
                    labelAlign : 'top'
                },
                items :
                [
                    {
                        xtype : 'datefield',
                        name : 'receivedOn',
                        itemId : 'courierEntryDateTo',
                        format : strExtApplicationDateFormat,
                        editable : false,
                        value : new Date(),
                        labelSeparator : '',
                        fieldLabel : getLabel('creationDateTo', 'Courier Entry Date To' ),
                        //labelStyle : 'padding-left:10px',
                        fieldCls : 'xn-valign-middle xn-form-text w10_5',
                        allowBlank : false,
                        labelCls: 'frmLabel',
                        hideTrigger : true
                    }
                ]
            } ]
        });
        return creationDateToPanel;
    }
});