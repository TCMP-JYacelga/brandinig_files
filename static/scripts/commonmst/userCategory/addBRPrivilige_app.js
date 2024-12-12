var objAdminPriviligePopup = null;
Ext.Loader.setConfig({
			enabled : true,
			setPath : {
				'Ext' : 'static/js/extjs4.2.1/src',
				'Ext.ux' : 'static/js/extjs4.2.1/src/ux'
			}
		});
Ext.application({
			name : 'GCP',
			appFolder : 'static/scripts/commonmst/userCategory/app',
			// appFolder : 'app',
			controllers : [ 'GCP.controller.PrivilegeController','GCP.controller.SelectPopupController' ],
			requires : ['GCP.view.AdminPriviligesPopup','Ext.util.MixedCollection','Ext.util.Filter', 'Ext.window.MessageBox','Ext.ux.gcp.FilterPopUpView'],
			launch : function() {
				objAdminPriviligePopup = Ext.create('GCP.view.BRPriviligesPopup',
						{
							itemId : 'bRPriviligesPopup',
							fnCallback : setSelectedBRFeatureItems,
							//profileId : brFeatureProfileId,
							//featureType : 'P',
							module : '01'
//							title : getLabel("brfeatureProfile", "BR Feature")
						});
			}
		});

function getBrPrivilegesPopup() {
	
	if (objAdminPriviligePopup == null || objAdminPriviligePopup == undefined) 
	{
		objAdminPriviligePopup = Ext.create('GCP.view.BRPriviligesPopup',
						{
							itemId : 'bRPriviligesPopup',
							fnCallback : setSelectedBRFeatureItems,
							//profileId : brFeatureProfileId,
							//featureType : 'P',
							module : '01'
//							title : getLabel("brfeatureProfile", "BR Feature")
						});
		objAdminPriviligePopup.show();
		
	} 
	else 
	{
		objAdminPriviligePopup.show();
	}
  }

function setSelectedBRFeatureItems(viewSerials,authSerials,editSerials) {
	document.getElementById("viewRightsSerials").value = JSON.stringify(viewSerials);
	document.getElementById("editRightsSerials").value = JSON.stringify(editSerials);
	document.getElementById("authRightsSerials").value = JSON.stringify(authSerials);
	
}

function getBrAlertPopup(module) {
	GCP.getApplication().fireEvent('fetchbralerts', module);
}

function getBrAccountPopup(module) {
	GCP.getApplication().fireEvent('fetchbraccounts', module);
}

function getBrReportPopup(module) {
	GCP.getApplication().fireEvent('fetchbrreports', module);
}

