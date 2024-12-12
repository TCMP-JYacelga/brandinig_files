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
	appFolder : 'static/scripts/fileservices/BankFileUploadCenter/app',
	//appFolder : 'app',
	requires : ['Ext.ux.gcp.PreferencesHandler','GCP.view.FileUploadCenterView','Ext.ux.gcp.vtypes.CustomVTypes'],
	controllers : ['GCP.controller.FileUploadCenterController'],
	init : function(application) {
				//Ext.ux.gcp.vtypes.CustomVTypes.applyDateRange();
				Ext.ux.gcp.vtypes.CustomVTypes.applyDateRange();
				prefHandler = Ext.create('Ext.ux.gcp.PreferencesHandler');
				prefHandler.init(application);
			},
	launch : function() {
		objProfileView = Ext.create('GCP.view.FileUploadCenterView', {
					renderTo : 'summary-T7-content'
				});
	}
});
function resizeContentPanel() {
	if (!Ext.isEmpty(objProfileView)) {
		objProfileView.hide();
		objProfileView.show();
		var filterButton=objProfileView.down('button[itemId="filterButton"]');
		if(!Ext.isEmpty(filterButton)&&filterButton.panel)
			filterButton.panel.setFilterWidth();
	}
}

$(document).on('hideShowSidebar',function(event){
	resizeContentPanel();
});	