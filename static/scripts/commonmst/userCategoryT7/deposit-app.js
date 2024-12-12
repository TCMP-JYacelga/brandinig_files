var objDepositPriviligePopup = null;
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
	controllers : [ 'GCP.controller.DepositController','SelectPopupController' ],
	requires : ['GCP.view.DepositPriviligesPopup','Ext.util.MixedCollection','Ext.util.Filter', 'Ext.window.MessageBox'],
	launch : function() {
		objDepositPriviligePopup = Ext.create('GCP.view.DepositPriviligesPopup', {
			itemId : 'depositPriviligesPopup',
			fnCallback : setDepositsOptions,
			module : '16'
		});
	}
});


function getPrivilegesPopup() {

	if (objDepositPriviligePopup == null || objDepositPriviligePopup == undefined) 
	{
		objDepositPriviligePopup = Ext.create('GCP.view.DepositPriviligesPopup',
						{
							itemId : 'depositPriviligesPopup',
							fnCallback : setDepositsOptions,
							module : '16'
						});
		objDepositPriviligePopup.show();
		
	} 
	else 
	{
		objDepositPriviligePopup.show();
	}
	objDepositPriviligePopup.center();
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
function setDepositsOptions(viewSerials,authSerials,editSerials) {
	document.getElementById("viewRightsSerials").value = JSON.stringify(viewSerials);
	document.getElementById("editRightsSerials").value = JSON.stringify(editSerials);
	document.getElementById("authRightsSerials").value = JSON.stringify(authSerials);
}

function getDepositViewAccountPopup(module) {
	GCP.getApplication().fireEvent('fetchbraccounts', module);
}


