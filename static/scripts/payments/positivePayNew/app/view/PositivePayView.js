/**
 * @class GCP.view.PrfMstView
 * @extends Ext.panel.Panel
 * @author Ashwini Pawar
 */
Ext.define('GCP.view.PositivePayView', {
	extend : 'Ext.panel.Panel',
	xtype : 'positivePayView',
	requires : ['GCP.view.PositivePayExceptionGroupView'],
	//width : '100%',
	autoHeight : true,
	//minHeight : 600,
	initComponent : function() {
		var me = this;
		me.items = [{
						xtype : 'positivePayExceptionGroupView',
						width : 'auto',
						margin : '0 0 12 0'
					}];
		me.on('resize', function() {
					me.doLayout();
				});
		me.callParent(arguments);
	}
});