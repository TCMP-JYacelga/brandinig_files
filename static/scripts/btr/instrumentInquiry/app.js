var objProfileView = null;
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
	appFolder : 'static/scripts/btr/instrumentInquiry/app',
	//appFolder : 'app',
	requires :
	[
		'GCP.view.InstrumentInquiryView'
	],
	controllers :
	[
		'GCP.controller.InstrumentInquiryController'
	],
	launch : function()
	{
		objProfileView = Ext.create( 'GCP.view.InstrumentInquiryView',
		{
			renderTo : 'instrumentInqDiv'
		} );
	}
} );
function resizeContentPanel()
{
	if( !Ext.isEmpty( objProfileView ) )
	{
		objProfileView.hide();
		objProfileView.show();
	}
}
