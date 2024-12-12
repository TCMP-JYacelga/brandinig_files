var objBankScheduleDtlView = null;
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
	appFolder : 'static/scripts/reports/bankSchedulingDtl/app',
	//appFolder : 'app',
	requires : ['GCP.view.BankScheduleDtlView','Ext.ux.gcp.GCPPager'],
	controllers : ['GCP.controller.BankScheduleDtlController'],
	launch : function() {
		objBankScheduleDtlView = Ext.create('GCP.view.BankScheduleDtlView', {
					renderTo : 'bankScheduleDtlDiv'
				});
	}
});
function resizeContentPanel() {
	if (!Ext.isEmpty(objBankScheduleDtlView)) {
		objBankScheduleDtlView.hide();
		objBankScheduleDtlView.show();
	}
}
function getScheduleLabel(key, defaultText) {
	return (bankScheduleLabelsMap && !Ext.isEmpty(bankScheduleLabelsMap[key])) ? bankScheduleLabelsMap[key]
			: defaultText
}