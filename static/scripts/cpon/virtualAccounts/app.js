var objVirtualAccountPanelView;
Ext.Loader.setConfig({
    enabled : true,
    disableCaching : false,
    setPath : {
        'Ext' : 'static/js/extjs4.2.1/src',
        'Ext.ux' : 'static/js/extjs4.2.1/src/ux'
    }
});

Ext.application({
    name : 'GCP',
    appFolder : 'static/scripts/cpon/virtualAccounts/app',
    views: ['GCP.view.VirtualAccountGridView'],
    controllers : ['GCP.controller.VirtualAccountController'],
    launch : function() {
        if(($('#hiddenService_acctUsageSubAccounts').val() === 'Y') || ((mode === 'VIEW' || mode === 'MODIFIEDVIEW') && showVirtual === true)){
            objVirtualAccountPanelView = Ext.create('GCP.view.VirtualAccountGridView', {
                itemId: 'virtualAccountPanelView',
                renderTo: 'virtualAccountPanelDiv'
            });
        }
    }
});
