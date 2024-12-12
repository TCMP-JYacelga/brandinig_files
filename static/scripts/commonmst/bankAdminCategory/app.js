/**
 * @class app.js
 * @author Nilesh Shinde
 */

var objMainView = null;

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
	appFolder : 'static/scripts/commonmst/bankAdminCategory/app',
	requires :
	[
		'GCP.view.BankAdminCategoryView'
	],
	controllers :
	[
		'GCP.controller.BankAdminCategoryController'
	],
	launch : function()
	{
		objMainView = Ext.create( 'GCP.view.BankAdminCategoryView',
		{
			renderTo : 'bankAdminCategoryDiv'
		} );
	}
} );

function resizeContentPanel()
{
	if( !Ext.isEmpty( objMainView ) )
	{
		objMainView.hide();
		objMainView.show();
	}
}
