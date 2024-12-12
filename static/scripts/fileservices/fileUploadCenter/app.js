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
	appFolder : 'static/scripts/fileservices/fileUploadCenter/app',
	//appFolder : 'app',
	requires : ['GCP.view.FileUploadCenterView'],
	controllers : ['GCP.controller.FileUploadCenterController'],
	launch : function() {
		objProfileView = Ext.create('GCP.view.FileUploadCenterView', {
					renderTo : 'fileUploadDiv'
				});
	}
});
function resizeContentPanel() {
	if (!Ext.isEmpty(objProfileView)) {
		objProfileView.hide();
		objProfileView.show();
	}
}
