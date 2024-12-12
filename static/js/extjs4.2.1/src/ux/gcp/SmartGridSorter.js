/**
 * @class Ext.ux.gcp.SmartGrid
 * @extends Ext.toolbar.Toolbar
 * @author Vinay Thube
 */
Ext.define('Ext.ux.gcp.SmartGridSorter', {
	extend : 'Ext.toolbar.Toolbar',
	xtype : 'smartGridSorter',
	requires : [ 'Ext.ux.BoxReorderer', 'Ext.ux.ToolbarDroppable' ],
	componentCls : 'xn-btn-default-toolbar-small ux_no-padding',
	sorters : null,
	initComponent : function() {
		var reorderer = Ext.create('Ext.ux.BoxReorderer', {
			pluginId : 'sort-reorderer'
		});
		var droppable = Ext.create('Ext.ux.ToolbarDroppable', {});
		this.plugins = [ reorderer, droppable ];
		this.callParent(arguments);
	}
});