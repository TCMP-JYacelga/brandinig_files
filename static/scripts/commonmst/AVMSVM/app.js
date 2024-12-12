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
			appFolder : 'static/scripts/commonmst/AVMSVM/app',
			// appFolder : 'app',
			requires : ['GCP.view.AvmSvmView'],
			controllers : ['GCP.controller.AVMSVMController'],
			launch : function() {
				objProfileView = Ext.create('GCP.view.AvmSvmView', {
							renderTo : 'authMatrixDiv'
						});
			}
		});
function resizeContentPanel() {
	if (!Ext.isEmpty(objProfileView)) {
		objProfileView.hide();
		objProfileView.show();
	}
}
