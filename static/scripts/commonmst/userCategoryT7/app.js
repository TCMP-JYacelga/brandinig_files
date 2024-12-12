var objListView = null;
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
	appFolder : 'static/scripts/commonmst/userCategoryT7/app',
	requires : ['GCP.view.CategoryListView'],
	controllers : ['UserCategoryController'],
	launch : function() {
		Ext.Ajax.on('requestexception', function(con, resp, op, e) {
					if (resp.status == 403) {
						location.reload();
					}
				});
		objListView = Ext.create('GCP.view.CategoryListView', {
					renderTo : 'summary-T7-content'
				});
	}
});
function resizeContentPanel() {
	if (!Ext.isEmpty(objListView)) {
		objListView.hide();
		objListView.show();
		var filterButton=objListView.down('button[itemId="filterButton"]');
		if(!Ext.isEmpty(filterButton)&&filterButton.panel)
			filterButton.panel.setFilterWidth();
	}
}

$(document).on('hideShowSidebar',function(event){
	resizeContentPanel();
});	
