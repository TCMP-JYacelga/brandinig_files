var objReconRuleGridView = null;

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
	appFolder : 'static/scripts/fsc/ReconRule/app',
	requires : ['GCP.view.ReconRuleGridView'],
	launch : function() {
		objReconRuleGridView = Ext.create('GCP.view.ReconRuleGridView', {
			renderTo : 'ruleDetailsGridDiv'
		});
	}
});
function resizeContentPanel() {
		objReconRuleGridView.hide();
		objReconRuleGridView.show();
}