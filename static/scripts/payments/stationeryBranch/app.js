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
            appFolder : 'static/scripts/payments/stationeryBranch/app',
            requires : [ 'GCP.view.StationeryBranchView' ],
            controllers : [ 'GCP.controller.StationeryBranchController' ],
            launch : function() {
            objMasterView = Ext.create('GCP.view.StationeryBranchView', {
            renderTo : 'stationeryBranchDiv'
        });
    }
});

function resizeContentPanel() {
    if (!Ext.isEmpty(objMasterView)) {
        objMasterView.hide();
        objMasterView.show();
    }
}