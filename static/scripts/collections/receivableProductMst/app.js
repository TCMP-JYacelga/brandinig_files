/**
 * @class app.js
 * @author Archana Shirude
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
	appFolder : 'static/scripts/collections/receivableProductMst/app',
	requires :
	[
		'GCP.view.ReceivableProductMstView'
	],
	controllers :
	[
		'GCP.controller.ReceivableProductMstController'
	],
	launch : function()
	{
		objMainView = Ext.create( 'GCP.view.ReceivableProductMstView',
		{
			renderTo : 'receivableProductMstDiv'
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
