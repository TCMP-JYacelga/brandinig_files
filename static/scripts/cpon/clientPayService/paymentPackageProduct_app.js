var objPaymentProfileSeek = null;
var objPaymentParametersPopUp = null;
var objPayFeaturePopup = null;
var objProfileFilterPopup = null;
var objPayCompanyIdPopup = null;
var isPaymentOptionsAllSelected = null;
var objAlertProfileFilterPopup = null;
var objReportProfileFilterPopup = null;
var objBillingProfileFilterPopup = null;
var objPaymentParametersPopUp = null;
var objSystemReceiverProfileFilterPopup = null;
Ext.Loader.setConfig({
			enabled : true,
			setPath : {
				'Ext' : 'static/js/extjs4.2.1/src',
				'Ext.ux' : 'static/js/extjs4.2.1/src/ux'
			}
		});
Ext.application({
			name : 'GCP',
			appFolder : 'static/scripts/cpon/clientPayService/app',
			controllers : ['GCP.controller.ClientPayServiceController'],
			requires : ['GCP.view.PaymentParametersPopUp'],	
			launch : function() {
				
				objPaymentParametersPopUp = Ext.create(
						'GCP.view.PaymentParametersPopUp', {
							itemId : 'paymentParametersPopUpId',
							//fnCallback : saveParametersDtls,
							title : getLabel('pmtPrdParam', 'Payment Product Parameters')
						});
			}
		});
function getPaymentParametersPopUp() {
	if (null != objPaymentParametersPopUp) {
		objPaymentParametersPopUp.show();
	}
}

