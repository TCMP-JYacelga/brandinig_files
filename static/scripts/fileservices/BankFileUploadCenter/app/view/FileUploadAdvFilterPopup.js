Ext.define('GCP.view.FileUploadAdvFilterPopup', {
	extend : 'Ext.window.Window',
	xtype : 'fileUploadAdvFilterPopup',
	requires : ['GCP.view.FileUploadCreateNewAdvFilter',
			'GCP.view.FileUploadAdvFilterGridView'],
	width : 710,
	height : 260,
	parent : null,
	modal : true,
	closeAction : 'hide',
	resizable:false,
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
								width : 660,
								items : [{
											xtype : 'fileUploadAdvFilterGridView',
											callerParent : me.parent
										}]
							}, {
								title : getLabel('createNewFilter', 'Create New Filter'),
								itemId : 'filterDetailsTab',
								items : [me.filterPanel, {
															xtype : 'fileUploadCreateNewAdvFilter',
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