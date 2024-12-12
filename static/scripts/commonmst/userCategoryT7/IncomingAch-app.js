var objIncomingAchPriviligePopup = null;
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
	controllers : [ 'GCP.controller.IncomingAchController','SelectPopupController' ],
	requires : ['GCP.view.IncomingAchPriviligesPopup','Ext.util.MixedCollection','Ext.util.Filter', 'Ext.window.MessageBox'],
	launch : function() {
		objIncomingAchPriviligePopup = Ext.create('GCP.view.IncomingAchPriviligesPopup', {
			itemId : 'IncomingAchPriviligesPopup',
			fnCallback : setIncomingAchOptions,
			module : '11',
			cls:'t7-popup'
		});
	}
});


function getIncomingAchPrivilegesPopup() {

	if (objIncomingAchPriviligePopup == null || objIncomingAchPriviligePopup == undefined) 
	{
		objIncomingAchPriviligePopup = Ext.create('GCP.view.IncomingAchPriviligesPopup',
						{
							itemId : 'IncomingAchPriviligesPopup',
							fnCallback : setIncomingAchOptions,
							module : '11',
							cls:'t7-popup'
						});
		objIncomingAchPriviligePopup.show();
		
	} 
	else 
	{
		objIncomingAchPriviligePopup.show();
	}
	objIncomingAchPriviligePopup.center();
}

//function saveClientLoansFeatureProfile(){
//	objIncomingAchPriviligePopup.saveItems();
//	
//}
//
//function saveClientLoansFeatureProfileOnNext(){
//	objIncomingAchPriviligePopup.saveItems();
//	goToFeaturePage('saveUserCategoryLoansFeature.form')
//}

function getAlertPopup(module) {
	GCP.getApplication().fireEvent('showcategoryalert', module);
}

function getReportPopup(module) {
	GCP.getApplication().fireEvent('showcategoryreport', module);
}


function setIncomingAchOptions(viewSerials,authSerials,editSerials) {
	document.getElementById("viewRightsSerials").value = JSON.stringify(viewSerials);
	document.getElementById("editRightsSerials").value = JSON.stringify(editSerials);
	document.getElementById("authRightsSerials").value = JSON.stringify(authSerials);
	//saveAdminFeatureProfile('saveUserCategoryLoansFeature.form');
}

