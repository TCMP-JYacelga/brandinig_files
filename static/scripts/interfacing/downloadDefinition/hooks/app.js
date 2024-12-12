var objInputParameter = null;
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
	appFolder : 'static/scripts/interfacing/downloadDefinition/hooks',
	requires : ['GCP.view.InputParameterView'],
	controllers : ['GCP.controller.InputParameterController'],
	launch : function() {
		objInputParameter = Ext.create('GCP.view.InputParameterView', {
					renderTo : 'inputParameterDiv'
				});
	}
});
function resizeContentPanel() {
	if (!Ext.isEmpty(objInputParameter)) {
		objInputParameter.hide();
		objInputParameter.show();
	}
}
