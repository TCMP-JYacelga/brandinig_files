var objFscAccountMstView = null;
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
	appFolder : 'static/scripts/cpon/fscAccount/app',
	requires : ['CPON.view.FSCFeatureAccMstView'],
	controllers : ['CPON.controller.FSCFeatureAccMstController'],
	launch : function() {
		objFscAccountMstView = Ext.create('CPON.view.FSCFeatureAccMstView', {
					renderTo : 'fscFeatureAccountListDiv'
				});
	}
});
function resizeContentPanel() {
	if (!Ext.isEmpty(objFscAccountMstView)) {
		objFscAccountMstView.hide();
		objFscAccountMstView.show();
	}
}
