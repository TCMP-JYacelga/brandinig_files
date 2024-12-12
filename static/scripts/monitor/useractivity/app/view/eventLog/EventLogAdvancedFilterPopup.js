Ext.define('GCP.view.eventLog.EventLogAdvancedFilterPopup', {
	extend : 'Ext.window.Window',
	xtype : 'eventLogAdvancedFilterPopup',
	requires : [],
	width : 580,
	minHeight : 450,
	tapPanelWidth : 550,
	autoHeight : true,
	parent : null,
	cls: 'ux_window-position',
	modal : true,
	closeAction : 'hide',
	layout : 'vbox',
	initComponent : function() {

		me.callParent(arguments);
	}
});