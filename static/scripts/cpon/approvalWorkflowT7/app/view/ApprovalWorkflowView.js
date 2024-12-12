Ext.define('GCP.view.ApprovalWorkflowView', {
	extend : 'Ext.container.Container',
	xtype : 'approvalWorkflowView',
	requires : ['Ext.container.Container', 'GCP.view.ApprovalWorkflowTitleView',
			'GCP.view.ApprovalWorkflowFilterView', 'GCP.view.ApprovalWorkflowGridView'],
	width : '100%',
	autoHeight : true,
	minHeight : 600,
	initComponent : function() {
		var me = this;
		me.items = [{
					xtype : 'approvalWorkflowGridView',
					width : '100%'
				}];

		me.on('resize', function() {
					me.doLayout();
				});
		me.callParent(arguments);
	}
});