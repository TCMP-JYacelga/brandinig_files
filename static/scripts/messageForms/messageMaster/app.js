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
			appFolder : 'static/scripts/messageForms/messageMaster/app',
			requires : ['GCP.view.MessageFormMstMainView'],
			controllers : ['GCP.controller.MessageFormMstFilterController',
					'GCP.controller.MessageFormMstInfoController',
					'GCP.controller.MessageFormMstGridController'],
			launch : function() {
				objProfileView = Ext.create('GCP.view.MessageFormMstMainView',
						{
							renderTo : 'messageFormMstDiv'
						});
			}
		});
function resizeContentPanel() {
	if (!Ext.isEmpty(objProfileView)) {
		objProfileView.hide();
		objProfileView.show();
	}
}
