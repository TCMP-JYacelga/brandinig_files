var objAgreementSweepQueryView = null;
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
	appFolder : 'static/scripts/lms/agreementSweepQuery/app',
	requires :
	[
		'GCP.view.AgreementSweepQueryView'
	],
	controllers :
	[
		'GCP.controller.AgreementSweepQueryController'
	],
	launch : function()
	{
		objAgreementSweepQueryView = Ext.create( 'GCP.view.AgreementSweepQueryView',
		{
			renderTo : 'agreementSweepQueryViewDiv'
		} );
	}
} );
function resizeContentPanel()
{
	if( !Ext.isEmpty( objAgreementSweepQueryView ) )
	{
		objAgreementSweepQueryView.hide();
		objAgreementSweepQueryView.show();
	}
}

$(document).on('hideShowSidebar',function(event){
	resizeContentPanel();
});	

function goToSweepQuery()
{
$(document).trigger("handleFilterPanelVisibility");
}

function reportDownLoad(){
	$(document).trigger("handleReportAction");	
}

