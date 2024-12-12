var objProfileView = null;
var objIncomingPaymentPopup = null;
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
	appFolder : 'static/scripts/cpon/incomingPayment/app',
//	appFolder : 'app',
	requires : ['GCP.view.IncomingPayServiceView','GCP.view.IncomingPayActionBarView','GCP.controller.IncomingPayServiceController','GCP.view.IncomingPaymentPopup'],
	controllers : ['GCP.controller.IncomingPayServiceController'],
	launch : function() {
		objProfileView = Ext.create('GCP.view.IncomingPayServiceView', {
					renderTo : 'incomingPayServiceDiv'
				});
				
		objIncomingPaymentPopup = Ext.create('GCP.view.IncomingPaymentPopup');		
	}
});
function resizeContentPanel() {
	if (!Ext.isEmpty(objProfileView)) {
		objProfileView.hide();
		objProfileView.show();
	}
}

function showincomingPaymentProfileSeek(){
	objIncomingPaymentPopup.show();
}
