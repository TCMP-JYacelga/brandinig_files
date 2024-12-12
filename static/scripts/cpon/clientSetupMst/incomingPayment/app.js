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
	name : 'CPON',
	appFolder : 'static/scripts/cpon/clientSetupMst/incomingPayment/app',
	requires : ['CPON.view.IncomingPayServiceView','CPON.view.IncomingPayActionBarView','CPON.view.IncomingPaymentPopup'],
	controllers : ['CPON.controller.IncomingPayServiceController'],
	launch : function() {
		objProfileView = Ext.create('CPON.view.IncomingPayServiceView', {
					renderTo : 'incomingPayServiceDiv'
				});
				
		objIncomingPaymentPopup = Ext.create('CPON.view.IncomingPaymentPopup');		
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
