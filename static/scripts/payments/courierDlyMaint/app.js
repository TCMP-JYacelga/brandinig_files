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
            appFolder : 'static/scripts/payments/courierDlyMaint/app',
            requires : [ 'GCP.view.CourierDlyMaintView' ],
            controllers : [ 'GCP.controller.CourierDlyMaintController' ],
            launch : function() {
            objMasterView = Ext.create('GCP.view.CourierDlyMaintView', {
            renderTo : 'courierDlyMaintDiv'
        });
    }
});

function resizeContentPanel() {
    if (!Ext.isEmpty(objMasterView)) {
        objMasterView.hide();
        objMasterView.show();
    }
}