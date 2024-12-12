var objAccountGridView = null;
var objPackageGridView = null;
var objPkgAccGridView = null;
var accountGridDataLoaded = false;
var packageGridDataLoaded = false;
var packageAccountGridDataLoaded = false;
Ext.Loader.setConfig({
			enabled : true,
			setPath : {
				'Ext' : 'static/js/extjs4.2.1/src',
				'Ext.ux' : 'static/js/extjs4.2.1/src/ux'
			}
		});
Ext.application({
			name : 'GCP',
			appFolder : 'static/scripts/cpon/approvalWorkflowT7/app',
			// appFolder : 'app',
			requires : ['GCP.view.AccountGridView'],
			controllers : ['ApprovalWorkflowDetailController'],
			launch : function() {
				if (entryType == 'EDIT' || entryType == 'UPDATE' || entryType == 'VIEW') {
				objAccountGridView = Ext.create('GCP.view.AccountGridView', {
													renderTo : 'accountGridDiv'
											});
				objPackageGridView = Ext.create('GCP.view.PackageGridView', {
													renderTo : 'packageGridDiv'
											});
				objPkgAccGridView = Ext.create('GCP.view.PackageAccountGridView', {
													renderTo : 'pkgAccGridDiv'
											});					
				}
			}
		});
function resizeContentPanel() {
	if (!Ext.isEmpty(objAccountGridView)
			&& (entryType == 'EDIT' || entryType == 'UPDATE' || entryType == 'VIEW')) {
		objAccountGridView.hide();
		objPackageGridView.hide();
		objPkgAccGridView.hide();
		objAccountGridView.show();
		objPackageGridView.show();
		objPkgAccGridView.show();
	}
}
$(document).on('hideShowSidebar',function(event){
	resizeContentPanel();
})

$(document).on('gridDataLoaded', function(event, strGrid) {
	if(strGrid === 'accountGrid') {
		accountGridDataLoaded = true;
	} else if(strGrid === 'packageGrid') {
		packageGridDataLoaded = true;
	} else if(strGrid === 'packageAccountGrid') {
		packageAccountGridDataLoaded = true;
	}
	
	if(accountGridDataLoaded && packageGridDataLoaded && packageAccountGridDataLoaded) {
		objAccountGridView.doLayout();
		objPackageGridView.doLayout();
		objPkgAccGridView.doLayout();
		accountGridDataLoaded = false;
		packageGridDataLoaded = false;
		packageAccountGridDataLoaded = false;
	}
	
});