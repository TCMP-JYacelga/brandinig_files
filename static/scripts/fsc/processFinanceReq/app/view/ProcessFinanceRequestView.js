/**
 * @class GCP.view.ProcessFinanceRequestView
 * @extends Ext.panel.Panel
 * @author Preeti Kapade
 */
Ext.define('GCP.view.ProcessFinanceRequestView', {
	extend : 'Ext.panel.Panel',
	xtype : 'processFinanceRequestView',
	requires : ['GCP.view.ProcessFinanceRequestTitleView',
			'GCP.view.ProcessFinanceRequestGridView', 'GCP.view.ProcessFinanceRequestFilterView'],
	autoHeight : true,
	cls : 'ux_panel-background',
	width : '100%',
	initComponent : function() {
		var me = this;
		me.items = [{
					xtype : 'processFinanceRequestTitleView',
					width : '100%'
				}, {
					xtype : 'processFinanceRequestFilterView',
					itemId : 'processFinanceRequestFilterView',
					width : '100%',
					margin : '0 0 12 0',
				    title : getLabel( 'filterBy', 'Filter By: ' )
					+ '&nbsp;<img id="imgFilterInfoGridView" class="largepadding icon-information"/>'
				}, {
					xtype : 'processFinanceRequestGridView',
					itemId : 'processFinanceRequestGridView',
					width : '100%'
				}];

		me.on('resize', function() {
					me.doLayout();
				});
		me.callParent(arguments);
	}
});