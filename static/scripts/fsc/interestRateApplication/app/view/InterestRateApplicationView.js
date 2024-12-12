/**
 * @class GCP.view.ProcessFinanceRequestView
 * @extends Ext.panel.Panel
 * @author Preeti Kapade
 */
Ext.define('GCP.view.InterestRateApplicationView', {
	extend : 'Ext.panel.Panel',
	xtype : 'interestRateApplicationView',
	requires : ['GCP.view.InterestRateApplicationTitleView',
			'GCP.view.InterestRateApplicationGridView', 'GCP.view.InterestRateApplicationFilterView'],
	autoHeight : true,
	cls : 'ux_panel-background',
	width : '100%',
	initComponent : function() {
		var me = this;
		me.items = [{
					xtype : 'interestRateApplicationTitleView',
					width : '100%'
				}, {
					xtype : 'interestRateApplicationFilterView',
					itemId : 'interestRateApplicationFilterView',
					width : '100%',
					margin : '0 0 12 0',
					title : getLabel( 'filterBy', 'Filter By: ' )
					+ '&nbsp;<img id="imgFilterInfoGridView" class="largepadding icon-information"/>'
				}, {
					xtype : 'interestRateApplicationGridView',
					itemId : 'interestRateApplicationGridView',
					width : '100%'
				}];

		me.on('resize', function() {
					me.doLayout();
				});
		me.callParent(arguments);
	}
});