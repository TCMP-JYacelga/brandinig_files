var objAccountGridView = null;
var objPackageGridView = null;
var objPkgAccGridView = null;
Ext.Loader.setConfig({
			enabled : true,
			setPath : {
				'Ext' : 'static/js/extjs4.2.1/src',
				'Ext.ux' : 'static/js/extjs4.2.1/src/ux'
			}
		});
Ext.application({
			name : 'GCP',
			appFolder : 'static/scripts/cpon/approvalWorkflow/app',
			// appFolder : 'app',
			requires : ['GCP.view.AccountGridView'],
			controllers : ['ApprovalWorkflowDetailController'],
			launch : function() {
				if (entryType == 'EDIT' || entryType == 'UPDATE' || entryType == 'VIEW') {
				objAccountGridView = Ext.create('GCP.view.AccountGridView', {
													renderTo : 'accountGridDiv'
											});
				objAccountGridView = Ext.create('GCP.view.PackageGridView', {
													renderTo : 'packageGridDiv'
											});
				objAccountGridView = Ext.create('GCP.view.PackageAccountGridView', {
													renderTo : 'pkgAccGridDiv'
											});					
				}
			}
		});
function resizeContentPanel() {
	if (!Ext.isEmpty(objAccountGridView)
			&& (entryType == 'EDIT' || entryType == 'UPDATE' || entryType == 'VIEW')) {
		objAccountGridView.hide();
		objAccountGridView.show();
	}
}
