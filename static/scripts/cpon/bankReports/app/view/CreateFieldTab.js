Ext.define('GCP.view.CreateFieldTab', {
	extend : 'Ext.form.Panel',
	cls : 'form-pnl-cls',
	layout : {
		type : 'vbox',
		align : 'center'
	},
	xtype : 'createFieldTab',
	requires : [ 'Ext.form.ComboBox', 'Ext.form.field.Text',
			'Ext.container.Container', 'Ext.form.Label' ],
	itemId : "createFieldTab",
	padding : '15 0 0 0',
	height : 300,
	initComponent : function() {
		var me = this;
		this.items = [ {
			xtype : 'textfield',
			fieldLabel : getLabel('fieldName', 'Field Name'),
			labelAlign : 'top',
			width : 150,
			itemId : 'fieldName'
		}, {
			xtype : 'textfield',
			fieldLabel : getLabel('fieldDescription', 'Field Description'),
			labelAlign : 'top',
			width : 150,
			itemId : 'fieldDescription'
		} ];
		this.callParent(arguments);
	}
});