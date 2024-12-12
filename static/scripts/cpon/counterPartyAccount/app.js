var counterPartyAccountMstView = null;
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
	appFolder : 'static/scripts/cpon/counterPartyAccount/app',
	requires : ['CPON.view.CounterPartyAccMstView'],
	controllers : ['CPON.controller.CounterPartyAccMstController'],
	launch : function() {
		counterPartyAccountMstView = Ext.create('CPON.view.CounterPartyAccMstView', {
					renderTo : 'counterPartyAccountListDiv'
				});
	}
});
function resizeContentPanel() {
	if (!Ext.isEmpty(counterPartyAccountMstView)) {
		counterPartyAccountMstView.hide();
		counterPartyAccountMstView.show();
	}
}
