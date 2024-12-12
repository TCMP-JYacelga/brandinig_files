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
	appFolder : 'static/scripts/commonmst/bankBranch/app',
	requires : ['GCP.view.BankBranchView'],
	controllers : ['GCP.controller.BankBranchController'],
	launch : function() {
		Ext.Ajax.timeout = Ext.isEmpty(requestTimeout)
		? 600000
		: parseInt(requestTimeout,10) * 1000 * 60;

		Ext.Ajax.on('requestexception', function(con, resp, op, e) {
			if (resp.status == 403) {
				// window.location='logoutUser.action';
				// location.reload();
			}
		});

		objProfileView = Ext.create('GCP.view.BankBranchView', {
			renderTo : 'bankBranchDiv'
		});
	}
});
function resizeContentPanel() {
	if (!Ext.isEmpty(objProfileView)) {
		objProfileView.hide();
		objProfileView.show();
	}
}
