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
			appFolder : 'static/scripts/commonmst/userMst/app',
//			appFolder : 'app',
			requires : ['GCP.view.UserMstView', 'GCP.view.UserMstTitleView',
					'GCP.view.UserMstFilterView', 'GCP.view.UserMstGridView',
					'GCP.view.UserMstGroupActionBarView','Ext.form.DateField'],
			controllers : ['GCP.controller.UserMstController'],
			launch : function() {
				objMainView = Ext.create('GCP.view.UserMstView', {
							renderTo : 'userMasterDiv'
						});
			}
		});

function resizeContentPanel() {
	if (!Ext.isEmpty(objMainView)) {
		objMainView.hide();
		objMainView.show();
	}
}
