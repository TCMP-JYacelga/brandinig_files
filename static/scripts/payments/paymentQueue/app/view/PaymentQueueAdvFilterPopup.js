Ext.define('GCP.view.PaymentQueueAdvFilterPopup', {
	extend : 'Ext.window.Window',
	xtype : 'paymentQueueAdvFilterPopup',
	requires : ['GCP.view.PaymentQueueCreateNewAdvFilter',
			'GCP.view.PaymentQueueAdvFilterGridView'],
	width : 660,
	height : 730,
	parent : null,
	cls: 'ux_window-position',
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
											xtype : 'paymentQueueAdvFilterGridView',
											callerParent : me.parent,
											processingQueueTypeCode : me.queueType
										}]
							}, {
								title : getLabel('createNewFilter', 'Create New Filter'),
								itemId : 'filterDetailsTab',
								items : [me.filterPanel, {
															xtype : 'paymentQueueCreateNewAdvFilter',
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