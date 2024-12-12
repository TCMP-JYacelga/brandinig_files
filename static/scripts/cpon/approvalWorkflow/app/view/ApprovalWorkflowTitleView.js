Ext.define('GCP.view.ApprovalWorkflowTitleView', {
	extend : 'Ext.panel.Panel',
	xtype : 'approvalWorkflowTitleView',
	requires : ['Ext.form.Label', 'Ext.Img', 'Ext.button.Button'],
	width : '100%',
//	baseCls : 'page-heading-bottom-border',
	layout : {
		type : 'hbox'
	},
	initComponent : function() {
		
		this.items = [{
					xtype : 'label',
					text : getLabel('approvalworkflowsummary', 'Approval Matrix Workflow Summary'),
					itemId : 'pageTitle',
					cls : 'page-heading '
				}, {
					xtype : 'label',
					flex : 25
				}/*,  {
					xtype : 'button',
					itemId : 'btnReport',
					glyph : 'xf1c1@fontawesome',
					cls : 'cursor_pointer xn-saved-filter-btnmenu  ux_font-size14 ux_export-btn',
					border : 0,
					margin : '0 10 0 0',
					text : getLabel('report', 'Report')
				}, {
					xtype : 'button',
					border : 0,
					text : getLabel('export', 'Export'),
					glyph : 'xf019@fontawesome',
					cls : 'cursor_pointer xn-saved-filter-btnmenu  ux_font-size14 ux_export-btn',
					menu : Ext.create('Ext.menu.Menu', {

					})
				}*/

		];
		this.callParent(arguments);
	}

});