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
	appFolder : 'static/scripts/cpon/holidayMst/app',
	requires : ['GCP.view.PrfHolidayMstView'],
	controllers : ['GCP.controller.PrfHolidayMstController'],
	init : function(application) {
				
			},
	launch : function() {
		objProfileView = Ext.create('GCP.view.PrfHolidayMstView', {
					renderTo : 'profileDiv'
				});
	}
});
function resizeContentPanel() {
	if (!Ext.isEmpty(objProfileView)) {
		objProfileView.hide();
		objProfileView.show();
	}
}
