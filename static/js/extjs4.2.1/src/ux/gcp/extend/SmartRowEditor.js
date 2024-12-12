/**
 * @class Ext.ux.gcp.extend.SmartRowEditor
 * @extends Ext.grid.RowEditor
 * @author Vinay Thube
 */
Ext.define('Ext.ux.gcp.extend.SmartRowEditor', {
	extend : 'Ext.grid.RowEditor',
	xtype : 'smartroweditor',
	previousContext : undefined,
	allowFirstFieldFocus : true,
	onHide : function() {
		var me = this;
		me.previousContext = undefined;
		me.callParent(arguments);
	},
	beforeEdit : function() {
		var me = this, context = me.editingPlugin.context, scrollDelta;
		if (!Ext.isEmpty(context))
			me.previousContext = context;
		me.callParent(arguments);
	},
	startEdit : function(record, columnHeader) {
		var me = this, editingPlugin = me.editingPlugin, grid = editingPlugin.grid, context = me.context = editingPlugin.context;
		form = me.getForm();
		if (form.isValid() && form.isDirty()
				&& !Ext.isEmpty(me.previousContext) && me.isVisible()) {
			form.updateRecord(me.previousContext.record);
			me.fireEvent("savePreviousRecord", me, me.previousContext);
		} else {
			me.previousContext = undefined;
		}
		me.callParent(arguments);
	},
	focusContextCell : function() {
		var me = this;
		var field = me.getEditor(me.context.column);
		// check to see if field is focusable; if not find first field that is
		// focusable;
		if (!field.isFocusable()) {
			var fieldsCollection = me.query('[isFormField]');
			field = Ext.Array.findBy(fieldsCollection, function(item, key) {
						return item.isFocusable();
					})
		}
		if (me.allowFirstFieldFocus && field && field.focus) {
			field.focus();
		}
	}
});
