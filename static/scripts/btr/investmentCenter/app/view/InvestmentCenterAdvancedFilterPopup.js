/**
 * @class InvestmentCenterAdvancedFilterPopup
 * @extends Ext.window.Window
 * @author Vaidehi
 */

Ext.define('GCP.view.InvestmentCenterAdvancedFilterPopup', {
	extend : 'Ext.window.Window',
	xtype : 'investmentCenterAdvancedFilterPopup',
	requires : ['GCP.view.InvestmentCenterCreateNewAdvFilter',
			'GCP.view.InvestmentCenterAdvFilterGridView'],
	width : 500,
	parent : null,
	modal : true,
	closeAction : 'hide',
	initComponent : function() {
		var me = this;
		var Advancedfiltertab = null;

		this.title = getLabel('advancedFilter', 'Advance Filter');

		Advancedfiltertab = Ext.create('Ext.tab.Panel', {
					width : 750,
					itemId : 'advancedFilterTab',
					items : [{
								title : getLabel('filters', 'Filters'),
								itemId : 'FilterSetTab',
								items : [{
											xtype : 'investmentCenterAdvFilterGridView',
											callerParent : me.parent
										}]
							}, {
								title : getLabel('createNewFilter', 'Create New Filter'),
								itemId : 'filterDetailsTab',
								items : [me.filterPanel
								/*
								 * { xtype:'pmtCreateNewAdvFilter', margin :'4 0
								 * 0 0', callerParent : me.parent }
								 */]
							}]
				});

		me.items = [Advancedfiltertab];

		this.callParent(arguments);
	}
});