var objPassThruACHView = null;
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
			appFolder : 'static/scripts/payments/passThruFileACHNew/app',
			requires : ['GCP.view.PassThruFileACHView',
					'Ext.ux.gcp.vtypes.CustomVTypes'],
			controllers : ['GCP.controller.PassThruFileACHController',
					'Ext.ux.gcp.DateHandler'],
			launch : function() {
				Ext.ux.gcp.vtypes.CustomVTypes.applyDateRange();
				objPassThruACHView = Ext.create('GCP.view.PassThruFileACHView',
						{
							renderTo : 'passThruFileACHNewDiv'
						});
			}
		});
function resizeContentPanel() {
	if (!Ext.isEmpty(objPassThruACHView)) {
		objPassThruACHView.hide();
		objPassThruACHView.show();
	}
}

$(document).on('hideShowSidebar',function(event,actionName){
	resizeContentPanel();
});	