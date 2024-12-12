var objCourierDtlView = null;
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
	appFolder : 'static/scripts/payments/courierDlyMaint/courierDlyDtlView/app',
	views: ['GCP.view.CourierDlyDtlView'],
	controllers : ['GCP.controller.CourierDlyDtlController'],
	launch : function() {
		objCourierDtlView = Ext.create('GCP.view.CourierDlyDtlView', {
			itemId: 'courierDlyDtlInst',
			renderTo: 'courierDlyDtlDiv'
		});
	}
});
function resizeContentPanel() {
	if (!Ext.isEmpty(objCourierDtlView)) {
		objCourierDtlView.hide();
		objCourierDtlView.show();
	}
}