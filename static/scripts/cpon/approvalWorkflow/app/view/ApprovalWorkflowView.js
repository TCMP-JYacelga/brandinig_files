Ext.define('GCP.view.ApprovalWorkflowView', {
	extend : 'Ext.container.Container',
	xtype : 'approvalWorkflowView',
	requires : ['Ext.container.Container', 'GCP.view.ApprovalWorkflowTitleView',
			'GCP.view.ApprovalWorkflowFilterView', 'GCP.view.ApprovalWorkflowGridView'],
	width : '100%',
	cls:'xn_ribbon',
	autoHeight : true,
	minHeight : 600,
	initComponent : function() {
		var me = this;
		me.items = [{
					xtype : 'approvalWorkflowTitleView',
					width : '100%',
					cls : 'ux_no-border ux_largepaddingtb'
				}, {
					xtype : 'approvalWorkflowFilterView',
					width : '100%',
				//	margin : '0 0 5 0',
					title : getLabel('filterBy', 'Filter By : ')						
				}, {
					xtype : 'approvalWorkflowGridView',
					width : '100%'
				}];

		me.on('resize', function() {
					me.doLayout();
				});
		me.callParent(arguments);
	}
});