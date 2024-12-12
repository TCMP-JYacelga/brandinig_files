var objInvestmentPriviligePopup = null;
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
	controllers : [ 'GCP.controller.InvestmentController','SelectPopupController' ],
	requires : ['GCP.view.InvestmentPriviligesPopup','Ext.util.MixedCollection','Ext.util.Filter', 'Ext.window.MessageBox'],
	launch : function() {
		objInvestmentPriviligePopup = Ext.create('GCP.view.InvestmentPriviligesPopup', {
			itemId : 'investmentPriviligesPopup',
			fnCallback : setInvestmentOptions,
			module : '08'
		});
	}
});


function getPrivilegesPopup() {

	if (objInvestmentPriviligePopup == null || objInvestmentPriviligePopup == undefined) 
	{
		objInvestmentPriviligePopup = Ext.create('GCP.view.InvestmentPriviligesPopup',
						{
							itemId : 'investmentPriviligesPopup',
							fnCallback : setInvestmentOptions,
							module : '08'
						});
		objInvestmentPriviligePopup.show();
		
	} 
	else 
	{
		objInvestmentPriviligePopup.show();
	}
}

function saveClientInvestmentFeatureProfile(){
	objInvestmentPriviligePopup.saveItems();
	
}


function getAlertPopup(module) {
	GCP.getApplication().fireEvent('showcategoryalert', module);
}

function getReportPopup(module) {
	GCP.getApplication().fireEvent('showcategoryreport', module);
}


function setInvestmentOptions(viewSerials,authSerials,editSerials) {
	document.getElementById("viewRightsSerials").value = JSON.stringify(viewSerials);
	document.getElementById("editRightsSerials").value = JSON.stringify(editSerials);
	document.getElementById("authRightsSerials").value = JSON.stringify(authSerials);
}

