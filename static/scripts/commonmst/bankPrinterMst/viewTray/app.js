var objTrayPanelView = null;
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
	appFolder : 'static/scripts/commonmst/bankPrinterMst/viewTray/app',
	views: ['GCP.view.TrayPanelView','GCP.view.AttachTrayPopupView'],
	controllers : ['GCP.controller.TrayController'],
	launch : function() {
		objTrayPanelView = Ext.create('GCP.view.TrayPanelView', {
			itemId: 'trayPanelInst',
			renderTo: 'trayPanelDiv'
		});
	}
});
function resizeContentPanel() {
	if (!Ext.isEmpty(objTrayPanelView)) {
		objTrayPanelView.hide();
		objTrayPanelView.show();
	}
}