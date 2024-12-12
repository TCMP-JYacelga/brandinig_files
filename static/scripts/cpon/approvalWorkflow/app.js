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
			appFolder : 'static/scripts/cpon/approvalWorkflow/app',
			// appFolder : 'app',
			requires : ['GCP.view.ApprovalWorkflowView'],
			controllers : ['GCP.controller.ApprovalWorkflowController'],
			launch : function() {
				objWorkflowView = Ext.create('GCP.view.ApprovalWorkflowView', {
							renderTo : 'approvalWorkflowDiv'
						});
			}
		});
function resizeContentPanel() {
	if (!Ext.isEmpty(objWorkflowView)) {
		objWorkflowView.hide();
		objWorkflowView.show();
	}
}
