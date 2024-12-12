/**
 * @class GCP.view.PrfMstView
 * @extends Ext.panel.Panel
 * @author Ashwini Pawar
 */
Ext.define('GCP.view.NonCMSStopPayView', {
	extend : 'Ext.panel.Panel',
	xtype : 'nonCMSView',
	requires : ['GCP.view.NonCMSStopPayGroupGridView','GCP.view.NonCMSStopFilterView','Ext.ux.gcp.GridHeaderFilterView'],
	//width : '100%',
	autoHeight : true,
	//minHeight : 600,
	initComponent : function() {
		var me = this;
		me.items = [{
					xtype : 'nonCMSGridGroupView',
					width : 'auto',
					margin : '0 0 12 0'
				}];
		me.on('resize', function() {
					me.doLayout();
				});
		me.callParent(arguments);
	}
});