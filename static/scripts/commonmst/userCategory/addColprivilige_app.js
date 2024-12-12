var objColPopup = null;
var objbankReportsGridView = null;
Ext.application({
	name : 'GCP',
	appFolder : 'static/scripts/commonmst/userCategory/app',
	// appFolder : 'app',
	controllers : [ 'GCP.controller.PrivilegeController','GCP.controller.SubsidiaryController', 
					'GCP.controller.SelectPopupController'],
	requires : ['GCP.view.ColPriviligesPopup','Ext.util.MixedCollection','Ext.util.Filter','Ext.window.MessageBox'],
	launch : function() {
		objColPopup = Ext.create('GCP.view.ColPriviligesPopup',
				{
					itemId : 'colPriviligesPopup',
					fnCallback : setSelectedBRFeatureItems,
					//profileId : brFeatureProfileId,
					//featureType : 'P',
					module : '05'
//					title : getLabel("brfeatureProfile", "BR Feature")
				});
	}
});

function getColPrivilegesPopup() {
	
	if (objColPopup == null || objColPopup == undefined) 
	{
		objColPopup = Ext.create('GCP.view.ColPriviligesPopup',
				{
					itemId : 'colPriviligesPopup',
					fnCallback : setSelectedBRFeatureItems,
					//profileId : brFeatureProfileId,
					//featureType : 'P',
					module : '05'
//					title : getLabel("brfeatureProfile", "BR Feature")
				});
		objColPopup.show();
		
	} 
	else 
	{
		objColPopup.show();
	}
}

function setSelectedBRFeatureItems(viewSerials,authSerials,editSerials) {
	document.getElementById("viewRightsSerials").value = JSON.stringify(viewSerials);
	document.getElementById("editRightsSerials").value = JSON.stringify(editSerials);
	document.getElementById("authRightsSerials").value = JSON.stringify(authSerials);
	
}
function getSelectActionLinkPopup(userCategory,sellerCode,corporation) {
	GCP.getApplication().fireEvent('showcategorysubsidiary',userCategory, sellerCode,corporation);
}

function getInterfacePopup(module) {
	GCP.getApplication().fireEvent('showcategoryinterface', module);
}

function getMessageTypePopup() {
	GCP.getApplication().fireEvent('showcategorymessagetype');
}

function getAlertPopup(module) {
	GCP.getApplication().fireEvent('showcategoryalert', module);
}

function getReportPopup(module) {
	GCP.getApplication().fireEvent('showcategoryreport', module);
}

function getPaymentPackages(module) {
	GCP.getApplication().fireEvent('showcategorypackages', module);
}
function getCollectionPackages(module) {
	GCP.getApplication().fireEvent('showcategorycolpackages', module);
}
function getCompanyIds(module) {
	GCP.getApplication().fireEvent('showcompnayids', module);
}
function getshowtemplates(module) {
	GCP.getApplication().fireEvent('showtemplates', module);
}
function getshowAccounts(module) {
	GCP.getApplication().fireEvent('fetchbraccounts', module);
}