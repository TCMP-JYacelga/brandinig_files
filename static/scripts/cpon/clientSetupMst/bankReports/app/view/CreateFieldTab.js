Ext.define('CPON.view.CreateFieldTab', {
	extend : 'Ext.form.Panel',
	cls : 'ux_extralargepadding-top',
	layout : {
		type : 'vbox',
		align : 'left'
	},
	xtype : 'createFieldTab',
	requires : [ 'Ext.form.ComboBox', 'Ext.form.field.Text',
			'Ext.container.Container', 'Ext.form.Label' ],
	itemId : "createFieldTab",
	//height : 300,
	initComponent : function() {
		var me = this;
		this.items = [ {
			xtype : 'container',
			cls : 'ft-padding-bottom',
			items : [{
			xtype : 'textfield',
			fieldLabel : getLabel('fieldName', 'Field Name'),
			fieldCls : 'ux_font-size14-normal textfield-input',
			labelCls:'frmLabel',
			cls:'leftfloating',
			labelAlign : 'top',
			itemId : 'fieldName',
			width : 220,
			margin : '0 0 0 0'
		}]
		}, {
			xtype : 'container',
			//cls : 'ft-padding-bottom',
			items : [{
			xtype : 'textfield',
			fieldLabel : getLabel('fieldDescription', 'Field Description'),
			labelAlign : 'top',
			cls:'leftfloating',
			fieldCls : 'ux_font-size14-normal textfield-input',
			labelCls:'frmLabel',
			itemId : 'fieldDescription',
			width : 220,
			margin : '0 0 0 0'
		}]
		} ];
		this.callParent(arguments);
	}
});