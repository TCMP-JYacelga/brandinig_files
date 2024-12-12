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
			// appFolder : 'app',
			requires : ['GCP.view.LiquidityPriviligesPopup','GCP.view.UserMstSelectPopup', 'Ext.window.MessageBox','GCP.view.NotionalAgreementSelectPopup', 'GCP.view.SweepAgreementSelectPopup'],
			controllers : ['SelectPopupController'],
			launch : function() {

			}
		});

function getLiquidityAlertPopup(module) {
	GCP.getApplication().fireEvent('fetchlmsalerts', module);
}

function getLiquidityReportPopup(module) {
	GCP.getApplication().fireEvent('fetchlmsreports', module);
}

function getLMSAccountPopup(module) {
	GCP.getApplication().fireEvent('fetchbraccounts', module);
}

function getNotionalAgreementPopup() {
	GCP.getApplication().fireEvent('fetchNotionalAgreements');
}
function getshowWidgtes(module) {
	GCP.getApplication().fireEvent('fetchbrwidgets', module);
}
function getSweepAgreementPopup() {
	GCP.getApplication().fireEvent('fetchSweepAgreements');
}
