var objLoanPriviligePopup = null;
var objLoanGranularPrivPriviligePopup =null;
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
	controllers : [ 'GCP.controller.LoansController','SelectPopupController' ,'GCP.controller.LoanGranularPrivilegeController'],
	requires : ['GCP.view.LoanPriviligesPopup','Ext.util.MixedCollection','Ext.util.Filter', 'Ext.window.MessageBox','GCP.view.LoanGranularPriviligesPopup'],
	launch : function() {
		objLoanPriviligePopup = Ext.create('GCP.view.LoanPriviligesPopup', {
			itemId : 'loanPriviligesPopup',
			fnCallback : setLoansOptions,
			module : '07'
		});
	}
});

function getLoanGranularPrivilegesPopup() {

	if (objLoanGranularPrivPriviligePopup == null || objLoanGranularPrivPriviligePopup == undefined) 
	{
		objLoanGranularPrivPriviligePopup = Ext.create('GCP.view.LoanGranularPriviligesPopup',
						{
							itemId : 'LoanGranularPriviligesPopup',
							fnCallback : setLoanGranularOptions,
							module : '07'
							//cls:'t7-popup'
						});
		objLoanGranularPrivPriviligePopup.show();
		
	} 
	else 
	{
		objLoanGranularPrivPriviligePopup.reconfigure();
		objLoanGranularPrivPriviligePopup.show();
	}
	objLoanGranularPrivPriviligePopup.center();
}

function setLoanGranularOptions(jsonObj) {
	document.getElementById("loanGranularPermissions").value = JSON.stringify(jsonObj);
}


function getPrivilegesPopup() {

	if (objLoanPriviligePopup == null || objLoanPriviligePopup == undefined) 
	{
		objLoanPriviligePopup = Ext.create('GCP.view.LoanPriviligesPopup',
						{
							itemId : 'loanPriviligesPopup',
							fnCallback : setLoansOptions,
							module : '07'
						});
		objLoanPriviligePopup.show();
		
	} 
	else 
	{
		objLoanPriviligePopup.show();
	}
	objLoanPriviligePopup.center();
}

function saveClientLoansFeatureProfile(){
	objLoanPriviligePopup.saveItems();
	
}

function saveClientLoansFeatureProfileOnNext(){
	objLoanPriviligePopup.saveItems();
	goToFeaturePage('saveUserCategoryLoansFeature.form')
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
function setLoansOptions(viewSerials,authSerials,editSerials) {
	document.getElementById("viewRightsSerials").value = JSON.stringify(viewSerials);
	document.getElementById("editRightsSerials").value = JSON.stringify(editSerials);
	document.getElementById("authRightsSerials").value = JSON.stringify(authSerials);
	//saveAdminFeatureProfile('saveUserCategoryLoansFeature.form');
}

function getLoanAccountPopup(module) {
	GCP.getApplication().fireEvent('fetchbraccounts', module);
}