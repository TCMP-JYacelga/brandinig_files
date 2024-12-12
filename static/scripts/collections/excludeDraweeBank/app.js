var objMasterView = null, prefHandler = null;
Ext.Loader.setConfig({
    enabled : true,
    disableCaching : false,
    setPath : {
        'Ext' : 'static/js/extjs4.2.1/src',
        'Ext.ux' : 'static/js/extjs4.2.1/src/ux'
    }
});
Ext
        .application({
            name : 'GCP',
            appFolder : 'static/scripts/collections/excludeDraweeBank/app',
            requires : [ 'GCP.view.ExcludeDraweeBankView' ],
            controllers : [ 'GCP.controller.ExcludeDraweeBankController' ],
            launch : function() {
            objMasterView = Ext.create('GCP.view.ExcludeDraweeBankView', {
            renderTo : 'excludeDraweeBankDiv'
        });
    }
});

function resizeContentPanel() {
    if (!Ext.isEmpty(objMasterView)) {
        objMasterView.hide();
        objMasterView.show();
    }
}