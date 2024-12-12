/**
 * @class Ext.ux.gcp.EditableGridCustom
 * @extends Ext.grid.Panel
 * @author Aditya Sharma
 * 
 * */
Ext.define('Ext.ux.gcp.EditableGridCustom', {
	extend : 'Ext.grid.Panel',
	xtype : 'editableGridCustom',
	width: '100%',
	height: 500,
	plugins : [
			Ext.create('Ext.grid.plugin.CellEditing', {
				clicksToMoveEditor: 1,
				autoCancel: false,
				clicksToEdit : 1
		})],
		listeners : {
			'afterrender' : function(grid){
					grid.getEl().addKeyMap({
					eventName: "keyup",
					binding: [{
						key: Ext.EventObject.TAB,
						scope:grid,
						fn:  function(){
							var editingContext = this.editingPlugin.context;
							var totalColumns = this.columns.length;
							var totalRows = this.store.data.length;
							var currentCol = editingContext.colIdx;
							var currentRow = editingContext.rowIdx;
							if(currentCol == totalColumns-1){
								console.log('Fire the event for row saving');
								if(currentRow == totalRows-1){
									console.log('Functionality to add the new row');
										var rec = this.store.create();
										this.getStore().insert(totalRows, rec);
										this.editingPlugin.startEditByPosition({
											row: totalRows, 
											column: 0
										});
								}
							}
					}
					}]
				});
			}
		},
	initComponent : function() {
		var me = this;
		me.callParent(arguments);

	}

});