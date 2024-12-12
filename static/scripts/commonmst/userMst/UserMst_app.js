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
			appFolder : 'static/scripts/commonmst/userMst/app',
			// appFolder : 'app',
			requires : ['Ext.ux.gcp.FilterPopUpView',
					'GCP.view.UserSelectSubsidiariesPopUp',
					'Ext.window.MessageBox','Ext.form.DateField'],
			controllers : ['SubsidiaryController',
					'UserMstSelectPopUpController'],
			launch : function () {
				
				if(document.getElementById("activationDateDiv")) {					
			
				var startdtValue = activationDateModel == null || activationDateModel == '' ? dtApplicationDate : activationDateModel;
				var startdt = Ext.create('Ext.form.DateField', {
					name : 'activationDate',
					itemId : 'activationDate',
					format : extJsDateFormat,
					editable : false,
					minValue : dtApplicationDate, 
					value : startdtValue,
					listeners :
					{
						change: function ( datefield, newValue, oldValue, eOpts ){
							setDirtyBit();
						}
					}
				});
				//startdt.on('change', setDirtyBit());
				startdt.render(Ext.get('activationDateDiv'));
				}	
			}		
		});

function getSubsidiaryListPopup() {
	GCP.getApplication().fireEvent('showsubsidiarypopup', userCategory,
			userCode, userSeller, userCorporation);
}

function getPackagesPopUp(module) {
	GCP.getApplication().fireEvent('showUserPackages', module);
}

function getBRAccountsPopup() {
	GCP.getApplication().fireEvent('showUserBRAccounts');
}
function getPortalAccountsPopup() {
	GCP.getApplication().fireEvent('showUserPortalAccounts');
}
function getLMSAccountsPopup() {
	GCP.getApplication().fireEvent('showLMSAccounts');
}

function getPaymentAccountsPopup(module) {
	GCP.getApplication().fireEvent('showUserPaymentAccounts', module);
}

function getPaymentTamplatesPopup() {
	GCP.getApplication().fireEvent('showUserTemplates');
}
function getSCMProductPopup() {
	GCP.getApplication().fireEvent('showSCMProducts');
}
function getNotionalListPopup() {
	GCP.getApplication().fireEvent('showNotionalList');
}
function getSweepListPopup() {
	GCP.getApplication().fireEvent('showSweepList');
}
function getTradePackagePopup(){
	GCP.getApplication().fireEvent('showTradePackageList', '09');
}
function getForecastPackagePopup(){
	GCP.getApplication().fireEvent('showForecastPackageList', '10');
}
function getUserDetailReport(userCode,userCorporation){
	//alert("userCode="+userCode+" userCorporation="+userCorporation);
	var form = document.createElement('FORM');
	var strUrl = "services/userMasterDetailReport.pdf";
	form.name = 'frmMain';
	form.id = 'frmMain';
	form.method = 'POST';
	form.appendChild(createFormField('INPUT', 'HIDDEN',
			csrfTokenName, tokenValue));
	form.appendChild(createFormField('INPUT', 'HIDDEN',
			'userCode', userCode));
	form.appendChild(createFormField('INPUT', 'HIDDEN',
			'userCorporation', userCorporation));
	form.action = strUrl;
	document.body.appendChild(form);
	form.submit();
	document.body.removeChild(form);
}
function createFormField(element, type, name, value) {
	var inputField;
	inputField = document.createElement(element);
	inputField.type = type;
	inputField.name = name;
	inputField.value = value;
	return inputField;
}

