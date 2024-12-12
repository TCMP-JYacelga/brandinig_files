var objPayPopup = null;
var objbankReportsGridView = null;
var objReversalPayGranularPrivPriviligePopup =null;
var objSIGranularPrivPriviligePopup =null;
var objPayGranularPrivPriviligePopup =null;
var objTemplatesGranularPrivPriviligePopup =null;
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
			controllers : [ 'GCP.controller.PrivilegeController','GCP.controller.SubsidiaryController', 
			                'GCP.controller.SelectPopupController' ,'GCP.controller.PaymentGranularPermissionsController'],
			requires : ['GCP.view.PayPriviligesPopup','Ext.util.MixedCollection','Ext.util.Filter','Ext.window.MessageBox',
			'GCP.view.ReversalPayGranularPriviligesPopup','GCP.view.PaymentGranularPriviligesPopup','GCP.view.SIGranularPriviligesPopup','GCP.view.TemplatesGranularPriviligesPopup'],
			launch : function() {
				objPayPopup = Ext.create('GCP.view.PayPriviligesPopup',
						{
							itemId : 'payPriviligesPopup',
							fnCallback : setSelectedBRFeatureItems,
							//profileId : brFeatureProfileId,
							//featureType : 'P',
							module : '02'
//							title : getLabel("brfeatureProfile", "BR Feature")
						});
			}
		});

function getPrivilegesPopup() {
	
	if (objPayPopup == null || objPayPopup == undefined) 
	{
		objPayPopup = Ext.create('GCP.view.PayPriviligesPopup',
				{
					itemId : 'payPriviligesPopup',
					fnCallback : setSelectedBRFeatureItems,
					//profileId : brFeatureProfileId,
					//featureType : 'P',
					module : '02'
//					title : getLabel("brfeatureProfile", "BR Feature")
				});
		objPayPopup.show();
		
	} 
	else 
	{
		objPayPopup.show();
	}
}


function getReversalPayGranularPrivilegesPopup() {

	if (objReversalPayGranularPrivPriviligePopup == null || objReversalPayGranularPrivPriviligePopup == undefined) 
	{
		objReversalPayGranularPrivPriviligePopup = Ext.create('GCP.view.ReversalPayGranularPriviligesPopup',
						{
							itemId : 'reversalPayGranularPriviligesPopup',
							fnCallback : setReversalPayGranularOptions,
							module : '02'
						});
		objReversalPayGranularPrivPriviligePopup.show();
		
	} 
	else 
	{
		objReversalPayGranularPrivPriviligePopup.show();
	}
}

function getSIGranularPrivilegesPopup() {

	if (objSIGranularPrivPriviligePopup == null || objSIGranularPrivPriviligePopup == undefined) 
	{
		objSIGranularPrivPriviligePopup = Ext.create('GCP.view.SIGranularPriviligesPopup',
						{
							itemId : 'siGranularPriviligesPopup',
							fnCallback : setSIGranularOptions,
							module : '02'
						});
		objSIGranularPrivPriviligePopup.show();
		
	} 
	else 
	{
		objSIGranularPrivPriviligePopup.show();
	}
}

function getPaymentCenterGranularPrivilegesPopup() {

	if (objPayGranularPrivPriviligePopup == null || objPayGranularPrivPriviligePopup == undefined) 
	{
		objPayGranularPrivPriviligePopup = Ext.create('GCP.view.PaymentGranularPriviligesPopup',
						{
							itemId : 'paymentGranularPriviligesPopup',
							fnCallback : setPayGranularOptions,
							module : '02'
						});
		objPayGranularPrivPriviligePopup.show();
		
	} 
	else 
	{
		objPayGranularPrivPriviligePopup.show();
	}
}

function getTemplatesGranularPrivilegesPopup() {

	if (objTemplatesGranularPrivPriviligePopup == null || objTemplatesGranularPrivPriviligePopup == undefined) 
	{
		objTemplatesGranularPrivPriviligePopup = Ext.create('GCP.view.TemplatesGranularPriviligesPopup',
						{
							itemId : 'templatesGranularPriviligesPopup',
							fnCallback : setTemplatesGranularOptions,
							module : '02'
						});
		objTemplatesGranularPrivPriviligePopup.show();
		
	} 
	else 
	{
		objTemplatesGranularPrivPriviligePopup.show();
	}
}

function setTemplatesGranularOptions(jsonObj) {
	document.getElementById("templateGranularPermissions").value = JSON.stringify(jsonObj);
}

function setPayGranularOptions(jsonObj) {
	document.getElementById("payCenterGranularPermissions").value = JSON.stringify(jsonObj);
}


function setSIGranularOptions(jsonObj) {
	document.getElementById("siGranularPermissions").value = JSON.stringify(jsonObj);
}



function setReversalPayGranularOptions(jsonObj) {
	document.getElementById("reversalPayGranularPermissions").value = JSON.stringify(jsonObj);
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
function getshowWidgtes(module) {
	GCP.getApplication().fireEvent('fetchbrwidgets', module);
}