var objAdminPriviligePopup = null;
var objbankReportsGridView = null;
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
			controllers : [ 'GCP.controller.PrivilegeController','SubsidiaryController', 
					'SelectPopupController' ],
			requires : ['GCP.view.AdminPriviligesPopup','Ext.util.MixedCollection','Ext.util.Filter','GCP.view.ColPriviligesPopup','GCP.view.AdminPriviligesPopup','GCP.view.PayPriviligesPopup','GCP.view.SubsidiarySelectPopup', 
			            'Ext.window.MessageBox','Ext.ux.gcp.FilterPopUpView'],
			launch : function() {
				objAdminPriviligePopup = Ext.create('GCP.view.AdminPriviligesPopup',
						{
							itemId : 'adminPriviligesPopup',
							fnCallback : setSelectedBRFeatureItems,
							//profileId : brFeatureProfileId,
							//featureType : 'P',
							module : '01'
//							title : getLabel("brfeatureProfile", "BR Feature")
						});
			}
		});

function getPrivilegesPopup() {

	if (objAdminPriviligePopup == null || objAdminPriviligePopup == undefined) 
	{
		objAdminPriviligePopup = Ext.create('GCP.view.AdminPriviligesPopup',
						{
							itemId : 'adminPriviligesPopup',
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
	saveAdminFeatureProfile('saveUserCategoryAdminFeature.form');
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
