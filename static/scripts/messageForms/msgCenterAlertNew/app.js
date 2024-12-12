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
	appFolder : 'static/scripts/messageForms/msgCenterAlertNew/app',
	//appFolder : 'app',
	requires : ['GCP.view.MsgCenterAlertView'],
	controllers : ['GCP.controller.MsgCenterAlertController'],
	launch : function() {
		objProfileView = Ext.create('GCP.view.MsgCenterAlertView', {
					renderTo : 'msgCenterAlertViewDiv'
				});
	}
});
function resizeContentPanel() {
	if (!Ext.isEmpty(objProfileView)) {
		objProfileView.hide();
		objProfileView.show();
		var filterButton = objProfileView.down('button[itemId="filterButton"]');
		if(!Ext.isEmpty(filterButton)&&filterButton.panel)
			filterButton.panel.setFilterWidth();
	}
}

$(document).on('hideShowSidebar',function(event,actionName){
	resizeContentPanel();
});
