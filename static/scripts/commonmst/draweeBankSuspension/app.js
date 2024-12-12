var objMasterView = null;
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
    appFolder : 'static/scripts/commonmst/draweeBankSuspension/app',
    requires : ['GCP.view.DraweeBankSuspensionView'],
    controllers : ['GCP.controller.DraweeBankSuspensionController'],
    launch : function() {
        objMasterView = Ext.create('GCP.view.DraweeBankSuspensionView', {
            renderTo : 'suspensionDiv'
        });
    }
});
function resizeContentPanel() {
    if (!Ext.isEmpty(objMasterView)) {
        objMasterView.hide();
        objMasterView.show();
    }
}
