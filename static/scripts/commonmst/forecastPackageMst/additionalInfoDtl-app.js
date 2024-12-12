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
	appFolder : 'static/scripts/commonmst/forecastPackageMst/app',
	requires : ['GCP.view.AdditionalInfoGridView'],
	launch : function() {
		objReconRuleGridView = Ext.create('GCP.view.AdditionalInfoGridView', {
			renderTo : 'additionalInfoGridDiv'
		});
	}
});
