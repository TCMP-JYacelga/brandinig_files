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
	appFolder : 'static/scripts/cpon/paymentPackageMst/app',
	requires : ['GCP.view.PaymentPackageView'],
	controllers : ['GCP.controller.PaymentPackageController'],
	launch : function() {
		objProfileView = Ext.create('GCP.view.PaymentPackageView', {
					renderTo : 'paymentPackageDiv'
				});
	}
});
function resizeContentPanel() {
	if (!Ext.isEmpty(objProfileView)) {
		objProfileView.hide();
		objProfileView.show();
	}
}
