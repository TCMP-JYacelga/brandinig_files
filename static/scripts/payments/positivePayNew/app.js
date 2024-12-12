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
	appFolder : 'static/scripts/payments/positivePayNew/app',
	//appFolder : 'app',
	requires : ['GCP.view.PositivePayView'],
	controllers : ['GCP.controller.PositivePayController'],
	launch : function() {
		objProfileView = Ext.create('GCP.view.PositivePayView', {
					renderTo : 'positivePayDiv'
				});
	}
});
function resizeContentPanel() {
	if (!Ext.isEmpty(objProfileView)) {
		objProfileView.hide();
		objProfileView.show();
	}
}

$(document).on('hideShowSidebar',function(event,actionName){
	resizeContentPanel();
});	