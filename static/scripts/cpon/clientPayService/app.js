var objProfileView = null;
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
	appFolder : 'static/scripts/cpon/clientPayService/app',
//	appFolder : 'app',
	requires : ['GCP.view.ClientPayServiceView'],
	controllers : ['GCP.controller.ClientPayServiceController'],
	launch : function() {
		objProfileView = Ext.create('GCP.view.ClientPayServiceView', {
					renderTo : 'payServiceDiv'
				});
	}
});
function resizeContentPanel() {
	if (!Ext.isEmpty(objProfileView)) {
		objProfileView.hide();
		objProfileView.show();
	}
}

function updateAttachPackageLink(enableDisableFlag){
    GCP.getApplication().fireEvent('checkClicked',enableDisableFlag);
}