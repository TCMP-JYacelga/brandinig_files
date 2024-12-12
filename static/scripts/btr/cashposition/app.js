var prefHandler = null;
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
			appFolder : 'static/scripts/btr/cashposition/app',
			requires : ['GCP.view.CashPositionCenter'],
			controllers : ['CashPositionSummaryController','AccountController','TransactionController'],
			launch : function() {
	
				objSummaryView = Ext.create('GCP.view.CashPositionCenter', {
							renderTo : 'summaryDiv'
							//width : '99%'
						});
			}
		});
function resizeContentPanel() {
	if (!Ext.isEmpty(objSummaryView)) {
		objSummaryView.hide();
		objSummaryView.show();
		var filterButton=objSummaryView.down('button[itemId="filterButton"]');
		if(!Ext.isEmpty(filterButton)&&filterButton.panel)
			filterButton.panel.setFilterWidth();
	}
}

$(document).on('hideShowSidebar',function(event,actionName){
	resizeContentPanel();
});	
