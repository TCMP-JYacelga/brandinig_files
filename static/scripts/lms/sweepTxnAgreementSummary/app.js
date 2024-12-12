var objsweepTxnAgreementView = null;
Ext.Loader.setConfig(
{
	enabled : true,
	disableCaching : false,
	setPath :
	{
		'Ext' : 'static/js/extjs4.2.1/src',
		'Ext.ux' : 'static/js/extjs4.2.1/src/ux'
	}
} );
Ext.application(
{
	name : 'GCP',
	appFolder : 'static/scripts/lms/sweepTxnAgreementSummary/app',
	requires :
	[
		'GCP.view.SweepTxnAgreementView','Ext.ux.gcp.PreferencesHandler'
	],
	controllers :
	[
		'GCP.controller.SweepTxnAgreementController'
	],
	launch : function()
	{
		objsweepTxnAgreementView = Ext.create( 'GCP.view.SweepTxnAgreementView',
		{
			renderTo : 'sweepTxnAgreementView'
		} );
	}
} );
function resizeContentPanel()
{
	if( !Ext.isEmpty( objsweepTxnAgreementView ) )
	{
		objsweepTxnAgreementView.hide();
		objsweepTxnAgreementView.show();
	}
}

$(document).on('hideShowSidebar',function(event){
	resizeContentPanel();
});	
function submitForm(Url) {
		var me = this;
		var form;
		var strUrl = Url;
		var errorMsg = null;
		if (!Ext.isEmpty(strUrl)) {
			form = document.createElement('FORM');
			form.name = 'frmMain';
			form.id = 'frmMain';
			form.method = 'POST';
			form.action = strUrl;
			document.body.appendChild(form);
			form.submit();
			document.body.removeChild(form);
		}
	
}
function goToTransactionsTab() {
	submitForm('lmsSweepTxnList.srvc');
}
