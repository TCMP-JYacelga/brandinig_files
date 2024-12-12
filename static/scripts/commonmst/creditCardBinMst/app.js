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
            appFolder : 'static/scripts/commonmst/creditCardBinMst/app',
            requires : [ 'GCP.view.CreditCardBinMstView' ],
            controllers : [ 'GCP.controller.CreditCardBinMstController' ],
            launch : function() {
            objMasterView = Ext.create('GCP.view.CreditCardBinMstView', {
            renderTo : 'creditCardBinDiv'
        });
    }
});

function resizeContentPanel() {
    if (!Ext.isEmpty(objMasterView)) {
        objMasterView.hide();
        objMasterView.show();
    }
}