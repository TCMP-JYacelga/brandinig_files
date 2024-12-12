var objDetailGrid = null;
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
            appFolder : 'static/scripts/commonmst/draweeBankSuspension/specifylocation/app',
            controllers : ['GCP.controller.SpecifyLocationController'],
            requires : ['GCP.view.SpecifyLocationEntryView'],
            launch : function() {
                objDetailGrid = Ext.create('GCP.view.SpecifyLocationEntryView', {
                    renderTo : 'locationDiv'
                });
            }
        });

function resizeContentPanel() {
    if (!Ext.isEmpty(objDetailGrid)) {
        objDetailGrid.hide();
        objDetailGrid.show();
    }
}
