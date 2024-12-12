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
	appFolder : 'static/scripts/btr/loanCenterT7/app',
	requires :
	[
		'GCP.view.LoanCenterView','Ext.ux.data.PagingMemoryProxy'
	],
	controllers :
	[
		'GCP.controller.LoanCenterController'
	],
	launch : function()
	{
		objProfileView = Ext.create( 'GCP.view.LoanCenterView',
		{
			renderTo : 'loanCenterDiv'
		} );
	}
} );
function resizeLoanContentPanel()
{
	if( !Ext.isEmpty( objProfileView ) )
	{
		objProfileView.hide();
		objProfileView.show();
		var filterButton=objProfileView.down('button[itemId="filterButton"]');
		if(!Ext.isEmpty(filterButton)&&filterButton.panel)
			filterButton.panel.setFilterWidth();
	}
}
$(document).on('hideShowSidebar',function(event){
	resizeLoanContentPanel();
});
