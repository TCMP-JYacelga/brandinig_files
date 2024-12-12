var objProfileView = null;
var objUserActivityView = null;
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
	appFolder : 'static/scripts/monitor/useractivity/app',
	//appFolder : 'app',
	requires : ['GCP.view.UserActivityView','Ext.ux.gcp.vtypes.CustomVTypes'],
	controllers : ['GCP.controller.UserActivityController','GCP.controller.DateHandler'],
	init : function(application) {
		Ext.ux.gcp.vtypes.CustomVTypes.applyDateRange();
		prefHandler = Ext.create('Ext.ux.gcp.PreferencesHandler');
		prefHandler.init(application);
	},
	launch : function() {
		objUserActivityView = Ext.create('GCP.view.UserActivityView', {
					renderTo : 'userActivityDiv'
				});
		
		/*GCP.getApplication().on({
			switchView : function(screenName){
				objUserActivityView.setActiveCard(screenName);
			}
		});*/
	}
});
function resizeContentPanel() {
	if (!Ext.isEmpty(objUserActivityView)) {
		objUserActivityView.hide();
		objUserActivityView.show();
		var filterButton=objUserActivityView.down('button[itemId="filterButton"]');
		if(!Ext.isEmpty(filterButton)&&filterButton.panel)
			filterButton.panel.setFilterWidth();
	}
}
$(document).on('hideShowSidebar',function(event){
	resizeContentPanel();
});	
