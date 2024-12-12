Ext.define('GCP.view.UserLimitTitleView', {
	extend : 'Ext.panel.Panel',
	xtype : 'userLimitTitleView',
	requires : ['Ext.form.Label', 'Ext.Img', 'Ext.button.Button'],
	width : '100%',
	baseCls : 'page-heading-bottom-border',
	defaults : {
		style : {
			padding : '0 0 0 10px'
		}
	},
	layout : {
		type : 'hbox'
	},
	initComponent : function() {

		this.items = [{
					xtype : 'label',
					text : getLabel('userLimitMst', 'User Limit'),
					itemId : 'pageTitle',
					cls : 'page-heading'
				}];
		this.callParent(arguments);
	}

});