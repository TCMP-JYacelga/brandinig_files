Ext.define('GCP.view.JobMonitorAdvFilterPopup', {
	extend : 'Ext.window.Window',
	xtype : 'jobMonitorAdvFilterPopup',
	requires : ['GCP.view.JobMonitorCreateNewAdvFilter',
			'GCP.view.JobMonitorAdvFilterGridView'],
	width : 660,
	height : 260,
	parent : null,
	modal : true,
	closeAction : 'hide',
	config : {
		sellerVal : null,
		queueType : null
	},
	initComponent : function() {
		var me = this;
		var Advancedfiltertab = null;

		this.title = getLabel('advancedFilter', 'Advance Filter');

		Advancedfiltertab = Ext.create('Ext.tab.Panel', {
					itemId : 'advancedFilterTab',
					items : [{
								title : getLabel('filters', 'Filters'),
								itemId : 'FilterSetTab',
								items : [{
											xtype : 'jobMonitorAdvFilterGridView',
											callerParent : me.parent
										}]
							}, {
								title : getLabel('createNewFilter', 'Create New Filter'),
								itemId : 'filterDetailsTab',
								items : [me.filterPanel, {
															xtype : 'jobMonitorCreateNewAdvFilter',
															itemId : 'stdViewAdvFilter',
															margin : '4 0 0 0',
															sellerVal : me.sellerVal,
															queueType : me.queueType
														}
										]
							}]
				});

		me.items = [Advancedfiltertab];

		this.callParent(arguments);
	}
});