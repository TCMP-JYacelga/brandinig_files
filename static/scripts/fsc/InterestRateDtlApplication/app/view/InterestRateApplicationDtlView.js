/**
 * @class GCP.view.InterestRateApplicationView
 * @extends Ext.panel.Panel
 * @author Krishna Dhaval
 */
Ext.define('GCP.view.InterestRateApplicationDtlView', {
	extend : 'Ext.panel.Panel',
	xtype : 'interestRateApplicationDtlView',
	requires : ['GCP.view.InterestRateApplicationGridDtlView'],
	autoHeight : true,
	cls : 'ux_panel-background',
	width : '100%',
	initComponent : function() {
		var me = this;
		me.items = [{
					xtype : 'interestRateApplicationGridDtlView',
					itemId : 'interestRateApplicationGridDtlView',
					width : '100%'
				}];

		me.on('resize', function() {
					me.doLayout();
				});
		me.callParent(arguments);
	}
});