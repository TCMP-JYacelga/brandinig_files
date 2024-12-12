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
	appFolder : 'static/scripts/commonmst/clientOffice/app',
	requires : ['GCP.view.ClientOfficeView'],
	controllers : ['GCP.controller.ClientOfficeController'],
	launch : function() {
		objProfileView = Ext.create('GCP.view.ClientOfficeView', {
					renderTo : 'clientOfficeDiv'
				});
	}
});
function resizeContentPanel() {
	if (!Ext.isEmpty(objProfileView)) {
		objProfileView.hide();
		objProfileView.show();
	}
}
