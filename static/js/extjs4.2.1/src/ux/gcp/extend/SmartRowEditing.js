/**
 * @class Ext.ux.gcp.extend.SmartRowEditing
 * @extends Ext.grid.plugin.RowEditing
 * @author Vinay Thube
 */
Ext.define('Ext.ux.gcp.extend.SmartRowEditing', {
	extend : 'Ext.grid.plugin.RowEditing',
	alias : 'plugin.smartrowediting',
	requires : ['Ext.ux.gcp.extend.SmartRowEditor',
			'Ext.grid.plugin.RowEditing'],
	allowFirstFieldFocus : true,
	initEditor : function() {
		var me = this;
		var editor = new Ext.ux.gcp.extend.SmartRowEditor(me.initEditorConfig());
		editor.getFloatingButtons().setVisible(false);
		editor.allowFirstFieldFocus = me.allowFirstFieldFocus;
		editor.addListener('savePreviousRecord', me.doSavePreviousRecord, me);
		return editor;
	},
	doSavePreviousRecord : function(editor, prevContext) {
		var me = this;
		me.fireEvent("editPrevious", editor, prevContext);
	}
});