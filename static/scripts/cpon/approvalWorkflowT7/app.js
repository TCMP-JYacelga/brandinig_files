var objWorkflowView = null;
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
			appFolder : 'static/scripts/cpon/approvalWorkflowT7/app',
			// appFolder : 'app',
			requires : ['GCP.view.ApprovalWorkflowGridView'],
			controllers : ['GCP.controller.ApprovalWorkflowController'],
			launch : function() {
				objWorkflowView = Ext.create('GCP.view.ApprovalWorkflowGridView', {
							renderTo : 'summary-T7-content'
						});
			}
		});
function resizeContentPanel() {
	if (!Ext.isEmpty(objWorkflowView)) {
		objWorkflowView.hide();
		objWorkflowView.show();
		var filterButton=objWorkflowView.down('button[itemId="filterButton"]');
		if(!Ext.isEmpty(filterButton)&&filterButton.panel)
			filterButton.panel.setFilterWidth();
	}
}
$(document).on('hideShowSidebar',function(event){
	resizeContentPanel();
});	