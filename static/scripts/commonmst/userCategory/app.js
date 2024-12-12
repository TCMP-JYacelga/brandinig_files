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
	appFolder : 'static/scripts/commonmst/userCategory/app',
	requires : ['GCP.view.CategoryListView'],
	controllers : ['UserCategoryController'],
	launch : function() {
		Ext.Ajax.on('requestexception', function(con, resp, op, e) {
					if (resp.status == 403) {
						location.reload();
					}
				});
		objListView = Ext.create('GCP.view.CategoryListView', {
					renderTo : 'listDiv'
				});
	}
});
function resizeContentPanel() {
	if (!Ext.isEmpty(objListView)) {
		objListView.hide();
		objListView.show();
	}
}
