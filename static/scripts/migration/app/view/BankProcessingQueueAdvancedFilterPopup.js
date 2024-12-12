/**
 * @class BankProcessingQueueAdvancedFilterPopup
 * @extends Ext.window.Window
 * @author Vaidehi
 */

Ext.define('GCP.view.BankProcessingQueueAdvancedFilterPopup', {
	extend : 'Ext.window.Window',
	xtype : 'bankProcessingQueueAdvancedFilterPopup',
	requires : ['GCP.view.BankProcessingQueueCreateNewAdvFilter',
			'GCP.view.BankProcessingQueueAdvFilterGridView'],
	//width : 360,
	//height : 350,
	parent : null,
	modal : true,
	closeAction : 'hide',
	initComponent : function() {
		var me = this;
		var Advancedfiltertab = null;

		this.title = getLabel('advancedFilter', 'Advance Filter');

		Advancedfiltertab = Ext.create('Ext.tab.Panel', {
					//width : 750,
					//height : 405,
					itemId : 'advancedFilterTab',
					items : [{
								title : getLabel('filters', 'Filters'),
								itemId : 'FilterSetTab',
								items : [{
											xtype : 'bankProcessingQueueAdvFilterGridView',
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