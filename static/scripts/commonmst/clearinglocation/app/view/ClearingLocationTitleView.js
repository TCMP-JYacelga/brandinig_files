Ext.define('GCP.view.ClearingLocationTitleView', {
	extend : 'Ext.panel.Panel',
	xtype : 'clearingLocationTitleView',
	requires : [ 'Ext.form.Label', 'Ext.Img', 'Ext.button.Button' ],
	width : '100%',
	defaults : {
		style : {
			padding : '0 0 0 0px'
		}
	},
	layout : {
		type : 'hbox'
	},
	initComponent : function() {
		var me = this;
		me.items = [{
			xtype : 'label',
			text : getLabel('clearingLocation', 'Clearing Locations'),
			itemId : 'pageTitle',
			cls : 'page-heading'
		},{
			xtype : 'label',
			flex : 25
		}];
		me.callParent(arguments);
	}
});
