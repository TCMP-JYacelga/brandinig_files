Ext.define('GCP.view.UserMstView', {
	extend : 'Ext.panel.Panel',
	xtype : 'userMstView',
	requires : ['GCP.view.UserMstFilterView',
			'GCP.view.UserMstGridView', 'Ext.form.field.ComboBox',
			'Ext.menu.Menu', 'Ext.form.RadioGroup', 'Ext.button.Button',
			'Ext.form.field.Text'],
	autoHeight : true,
	//width : '100%',
	initComponent : function() {
		var me = this;
		this.items = [{
					xtype : 'userMstGridView'
				}];
		this.callParent(arguments);
	}

});