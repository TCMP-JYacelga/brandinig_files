var objPaymentParametersPopUp = null;
var objCustomLayoutIdPopup = null;

Ext.Loader.setConfig({
			enabled : true,
			setPath : {
				'Ext' : 'static/js/extjs4.2.1/src',
				'Ext.ux' : 'static/js/extjs4.2.1/src/ux'
			}
		});
Ext.application({
			name : 'GCP',
			appFolder : 'static/scripts/cpon/profileMst/app',
			// appFolder : 'app',
			requires : ['GCP.view.PaymentParametersPopUp','GCP.view.PmtPkgCustomLayoutIdPopup'],
			launch : function() {
				objPaymentParametersPopUp = Ext.create(
						'GCP.view.PaymentParametersPopUp', {
							itemId : 'paymentParametersPopUpId',
							//fnCallback : saveParametersDtls,
							title : getLabel('pmtPrdParam', 'Payment Product Parameters')
						});
			objCustomLayoutIdPopup = Ext.create('GCP.view.PmtPkgCustomLayoutIdPopup');		
			}
		});

function getPaymentParametersPopUp() {
	if (null != objPaymentParametersPopUp) {
		objPaymentParametersPopUp.show();
	}
}


function getCustomLayoutIdPopup() {	
	if (null != objCustomLayoutIdPopup) {
		objCustomLayoutIdPopup.show();
	}
}
