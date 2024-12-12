var objCheckPriviligePopup = null;
var objChecksGranularPrivPriviligePopup =null;
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
	controllers : [ 'GCP.controller.CheckController','SelectPopupController','GCP.controller.CheckGranularPrivilegePayController' ],
	requires : ['GCP.view.CheckPriviligesPopup','Ext.util.MixedCollection','Ext.util.Filter', 'GCP.view.CheckGranularPriviligesPopup'],
	launch : function() {
		objCheckPriviligePopup = Ext.create('GCP.view.CheckPriviligesPopup', {
			itemId : 'checkPriviligesPopup',
			fnCallback : setCheckOptions,
			module : '14'
		});
	}
});


function getChecksGranularPrivilegesPopup() {

	if (objChecksGranularPrivPriviligePopup == null || objChecksGranularPrivPriviligePopup == undefined) 
	{
		objChecksGranularPrivPriviligePopup = Ext.create('GCP.view.CheckGranularPriviligesPopup',
						{
							itemId : 'checkGranularPriviligesPopup',
							fnCallback : setChecksGranularOptions,
							module : '14'
							//cls:'t7-popup'
						});
		objChecksGranularPrivPriviligePopup.show();
		
	} 
	else 
	{
		objChecksGranularPrivPriviligePopup.reconfigure();
		objChecksGranularPrivPriviligePopup.show();
	}
	objChecksGranularPrivPriviligePopup.center();
}

function setChecksGranularOptions(jsonObj) {
	document.getElementById("checksGranularPermissions").value = JSON.stringify(jsonObj);
}

function getPrivilegesPopup() {

	if (objCheckPriviligePopup == null || objCheckPriviligePopup == undefined) 
	{
		objCheckPriviligePopup = Ext.create('GCP.view.CheckPriviligesPopup',
						{
							itemId : 'checkPriviligesPopup',
							fnCallback : setCheckOptions,
							module : '14'
						});
		objCheckPriviligePopup.show();
		
	} 
	else 
	{
		objCheckPriviligePopup.show();
	}
	objCheckPriviligePopup.center();
}

function saveClientCheckFeatureProfile(){
	objCheckPriviligePopup.saveItems();
	
}

function saveFeatureProfileOnNext(){
	objCheckPriviligePopup.saveItems();
	goToFeaturePage('saveUserCategoryCheckFeature.form')
}

function getAlertPopup(module) {
	GCP.getApplication().fireEvent('showcategoryalert', module);
}

function getReportPopup(module) {
	GCP.getApplication().fireEvent('showcategoryreport', module);
}

function getshowWidgtes(module) {
	GCP.getApplication().fireEvent('fetchbrwidgets', module);
}
function setCheckOptions(viewSerials,authSerials,editSerials) {
	document.getElementById("viewRightsSerials").value = JSON.stringify(viewSerials);
	document.getElementById("editRightsSerials").value = JSON.stringify(editSerials);
	document.getElementById("authRightsSerials").value = JSON.stringify(authSerials);
	//saveAdminFeatureProfile('saveUserCategoryLoansFeature.form');
}
function getChecksAccountPopup(module) {
	GCP.getApplication().fireEvent('fetchbraccounts', module);
}
