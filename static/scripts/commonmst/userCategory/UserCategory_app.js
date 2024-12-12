var objbankReportsGridView = null;
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
			// appFolder : 'app',
			controllers : [ 'GCP.controller.SelectPopupController','GCP.controller.SubsidiaryController' ],
			requires : ['GCP.view.ColPriviligesPopup','GCP.view.AdminPriviligesPopup','GCP.view.PayPriviligesPopup','GCP.view.SubsidiarySelectPopup', 
			    					'Ext.window.MessageBox','Ext.ux.gcp.FilterPopUpView'],
			launch : function() {
			
			}
		});

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