var objsweepTxnView = null,  prefHandler = null;
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
	appFolder : 'static/scripts/lms/sweepTxnSummaryNewUX/app',
	requires :
	[
	 	'Ext.ux.gcp.PreferencesHandler', 
	 	'Ext.ux.gcp.GroupView', 'GCP.view.SweepTxnView'
	],
	controllers :
	[
		'GCP.controller.SweepTxnController'
	],
	init : function(application) {
		prefHandler = Ext.create('Ext.ux.gcp.PreferencesHandler');
		prefHandler.init(application);
	},
	launch : function()
	{
		objsweepTxnView = Ext.create( 'GCP.view.SweepTxnView',
		{
			renderTo : 'sweepTxnView'
		} );
	}
} );
function resizeContentPanel()
{
	if (!Ext.isEmpty(objsweepTxnView)) {
		objsweepTxnView.hide();
		objsweepTxnView.show();
		var filterButton=objsweepTxnView.down('button[itemId="filterButton"]');
		if(!Ext.isEmpty(filterButton)&&filterButton.panel)
			filterButton.panel.setFilterWidth();
	}
}

$(document).on('hideShowSidebar',function(event){
	resizeContentPanel();
});	

function goToAgreementsTab() {
	submitForm('lmsSweepAgreementTxnList.srvc');
}

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
