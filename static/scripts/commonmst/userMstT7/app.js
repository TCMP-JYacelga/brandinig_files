var objMainView = null, prefHandler = null;
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
			appFolder : 'static/scripts/commonmst/userMstT7/app',
//			appFolder : 'app',
			requires : ['GCP.view.UserMstView', 'GCP.view.UserMstFilterView', 'GCP.view.UserMstGridView',
					'GCP.view.UserMstGroupActionBarView'],
			controllers : ['GCP.controller.UserMstController'],
			launch : function() {
				objMainView = Ext.create('GCP.view.UserMstView', {
							renderTo : 'summary-T7-content'
						});
			}
		});

function resizeContentPanel() {
	if (!Ext.isEmpty(objMainView)) {
		objMainView.hide();
		objMainView.show();
		var filterButton=objMainView.down('button[itemId="filterButton"]');
		if(!Ext.isEmpty(filterButton)&&filterButton.panel)
			filterButton.panel.setFilterWidth();
	}
}
$(document).on('hideShowSidebar',function(event){
	resizeContentPanel();
});	