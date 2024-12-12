var objPositivePayPriviligePopup = null;
var objPPGranularPrivPriviligePopup =null;
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
	controllers : [ 'GCP.controller.PositivePayController','SelectPopupController','GCP.controller.GranularPositivePayController' ],
	requires : ['GCP.view.PositivePayPriviligesPopup','GCP.view.PositivePayGranularPriviligesPopup','Ext.util.MixedCollection','Ext.util.Filter', 'Ext.window.MessageBox'],
	launch : function() {
		objPositivePayPriviligePopup = Ext.create('GCP.view.PositivePayPriviligesPopup', {
			itemId : 'positivePayPriviligesPopup',
			fnCallback : setPositivePayOptions,
			module : '13'
		});
	}
});


function getPrivilegesPopup() {

	if (objPositivePayPriviligePopup == null || objPositivePayPriviligePopup == undefined) 
	{
		objPositivePayPriviligePopup = Ext.create('GCP.view.PositivePayPriviligesPopup',
						{
							itemId : 'positivePayPriviligesPopup',
							fnCallback : setPositivePayOptions,
							module : '13'
						});
		objPositivePayPriviligePopup.show();
		
	} 
	else 
	{
		objPositivePayPriviligePopup.show();
	}
}

function getGranularPrivilegesPopup() {

	if (objPPGranularPrivPriviligePopup == null || objPPGranularPrivPriviligePopup == undefined) 
	{
		objPPGranularPrivPriviligePopup = Ext.create('GCP.view.PositivePayGranularPriviligesPopup',
						{
							itemId : 'positivePayGranularPriviligesPopup',
							fnCallback : setPositivePayGranularOptions,
							module : '13'
						});
		objPPGranularPrivPriviligePopup.show();
		
	} 
	else 
	{
		objPPGranularPrivPriviligePopup.show();
	}
}


function saveClientPositivePayFeatureProfile(){
	objPositivePayPriviligePopup.saveItems();
	
}

function saveFeatureProfileOnNext(){
	objPositivePayPriviligePopup.saveItems();
	goToFeaturePage('saveUserCategoryPositivePayFeature.form')
}

function getAlertPopup(module) {
	GCP.getApplication().fireEvent('showcategoryalert', module);
}

function getReportPopup(module) {
	GCP.getApplication().fireEvent('showcategoryreport', module);
}


function setPositivePayGranularOptions(jsonObj) {
	document.getElementById("positivePayGranularPermissions").value = JSON.stringify(jsonObj);
}

function setPositivePayOptions(viewSerials,authSerials,editSerials) {
	document.getElementById("viewRightsSerials").value = JSON.stringify(viewSerials);
	document.getElementById("editRightsSerials").value = JSON.stringify(editSerials);
	document.getElementById("authRightsSerials").value = JSON.stringify(authSerials);
	//saveAdminFeatureProfile('saveUserCategoryLoansFeature.form');
}
