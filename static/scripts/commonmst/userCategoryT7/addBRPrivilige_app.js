var objAdminPriviligePopup = null;
var objBrGranularPrivPriviligePopup =null;
Ext.Loader.setConfig({
			enabled : true,
			setPath : {
				'Ext' : 'static/js/extjs4.2.1/src',
				'Ext.ux' : 'static/js/extjs4.2.1/src/ux'
			}
		});
Ext.application({
			name : 'GCP',
			appFolder : 'static/scripts/commonmst/userCategoryT7/app',
			// appFolder : 'app',
			controllers : [ 'GCP.controller.PrivilegeController','GCP.controller.SelectPopupController','GCP.controller.BrGranularPrivilegePayController' ],
			requires : ['GCP.view.AdminPriviligesPopup','Ext.util.MixedCollection','Ext.util.Filter','GCP.view.UserMstSelectPopup', 'Ext.window.MessageBox', 'GCP.view.BrGranularPriviligesPopup'],
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
	objAdminPriviligePopup.center();
  }
  
function getBrGranularPrivilegesPopup() {


	if (objBrGranularPrivPriviligePopup == null || objBrGranularPrivPriviligePopup == undefined) 
	{
		objBrGranularPrivPriviligePopup = Ext.create('GCP.view.BrGranularPriviligesPopup',
						{
							itemId : 'brGranularPriviligesPopup',
							fnCallback : setBrGranularOptions,
							module : '01'
							//cls:'t7-popup'
							
						});
		objBrGranularPrivPriviligePopup.show();
	} 
	else 
	{
		objBrGranularPrivPriviligePopup.reconfigure();
		objBrGranularPrivPriviligePopup.show();
	}
	objBrGranularPrivPriviligePopup.center();
}

function setBrGranularOptions(jsonObj) {
	document.getElementById("brGranularPermissions").value = JSON.stringify(jsonObj);
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
function getWidgtesPopup(module) {
	GCP.getApplication().fireEvent('fetchbrwidgets', module);
}
function getAdminWidgtesPopup(module) {
	GCP.getApplication().fireEvent('fetchbrwidgets', module);
}
