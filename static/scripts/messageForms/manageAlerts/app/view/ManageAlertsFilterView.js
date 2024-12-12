Ext.define('GCP.view.ManageAlertsFilterView', {
	extend : 'Ext.panel.Panel',
	xtype : 'manageAlertsFilterView',
	requires : ['Ext.ux.gcp.AutoCompleter'],
	width : '100%',
	margin : '0 0 10 0',
	componentCls : 'gradiant_back',
	collapsible : true,
	collapsed: true,
	cls : 'xn-ribbon ux_border-bottom',
	layout : {
		type : 'vbox',
		align : 'stretch'
	},
	initComponent : function() {

var filterContainerArr = new Array();		
		var moduleTypeContainer = Ext.create('Ext.container.Container', {
			columnWidth : 0.35,
			padding : '10px',
			items : [{
						xtype : 'label',
						text : getLabel('module', 'Module'),
						cls : 'ux_font-size14',
						padding : '1 0 0 10'
					}, {
						xtype : 'toolbar',
						padding : '6 0 0 8',
						cls : 'xn-toolbar-small',
						itemId : 'moduleTypeToolBar',
						filterParamName : 'module',
						width : '100%',
						parent : this,
						border : false,
						componentCls : 'xn-btn-default-toolbar-small xn-custom-more-toolbar',
						items : [{
									text : getLabel('all', 'All'),
									code : 'all',
									btnDesc : getLabel('all', 'All'),
									btnId : 'allPaymentType',
									parent : this,
									cls : 'f13 xn-custom-heighlight',
									handler : function(btn, opts) {
										this.parent.fireEvent(
												'handleModuleType', btn);
									}
								}],
						listeners : {
							render : function(toolbar, opts) {
								// this.parent.handlePaymentTypeLoading(toolbar);
							}
						}
					}]
		});
		
		var statusTypeContainer = Ext.create('Ext.container.Container', {
			columnWidth : 0.35,
			padding : '10px',
			items : [{
						xtype : 'label',
						text : getLabel('status', 'Status'),
						cls : 'ux_font-size14',
						padding : '1 0 0 10'
					}, {
						xtype : 'toolbar',
						padding : '6 0 0 8',
						cls : 'xn-toolbar-small',
						itemId : 'statusTypeToolBar',
						filterParamName : 'status',
						width : '100%',
						parent : this,
						border : false,
						componentCls : 'xn-btn-default-toolbar-small xn-custom-more-toolbar',
						items : [{
									text : getLabel('all', 'All'),
									code : 'all',
									btnDesc : getLabel('all', 'All'),
									btnId : 'allPaymentType',
									parent : this,
									cls : 'f13 xn-custom-heighlight',
									handler : function(btn, opts) {
										this.parent.fireEvent(
												'handleStatusType', btn);
									}
								}, {
									text : getLabel('active', 'Active'),
									code : 'Y',
									btnDesc : getLabel('active', 'Active'),
									btnId : 'allActiveType',
									parent : this,
									cls : 'f13',
									handler : function(btn, opts) {
										this.parent.fireEvent(
												'handleStatusType', btn);
									}
								}, {
									text : getLabel('inactive', 'Inactive'),
									code : 'N',
									btnDesc : getLabel('inactive', 'Inactive'),
									btnId : 'allInactiveType',
									parent : this,
									cls : 'f13',
									handler : function(btn, opts) {
										this.parent.fireEvent(
												'handleStatusType', btn);
									}
								}],
						listeners : {
							render : function(toolbar, opts) {
								// this.parent.handlePaymentTypeLoading(toolbar);
							}
						}
					}]
		});
		
		var subscriptionTypeContainer = Ext.create('Ext.container.Container', {
			columnWidth : 0.30,
			padding : '10px',
			items : [{
						xtype : 'label',
						text : getLabel('type', 'Type'),
						cls : 'ux_font-size14',
						padding : '1 0 0 10'
					}, {
						xtype : 'toolbar',
						padding : '6 0 0 8',
						cls : 'xn-toolbar-small',
						itemId : 'subscriptionTypeToolBar',
						filterParamName : 'subscriptionType',
						width : '100%',
						parent : this,
						border : false,
						componentCls : 'xn-btn-default-toolbar-small xn-custom-more-toolbar',
						items : [{
									text : getLabel('all', 'All'),
									code : 'all',
									btnDesc : getLabel('all', 'All'),
									btnId : 'allPaymentType',
									parent : this,
									cls : 'f13 xn-custom-heighlight',
									handler : function(btn, opts) {
										this.parent.fireEvent(
												'handleSubscriptionType', btn);
									}
								}, {
									text : getLabel('standard', 'Standard'),
									code : 'S',
									btnDesc : getLabel('standard', 'Standard'),
									btnId : 'allActiveType',
									parent : this,
									cls : 'f13',
									handler : function(btn, opts) {
										this.parent.fireEvent(
												'handleSubscriptionType', btn);
									}
								}, {
									text : getLabel('custom', 'Custom'),
									code : 'C',
									btnDesc : getLabel('custom', 'Custom'),
									btnId : 'allInactiveType',
									parent : this,
									cls : 'f13',
									handler : function(btn, opts) {
										this.parent.fireEvent(
												'handleSubscriptionType', btn);
									}
								}],
						listeners : {
							render : function(toolbar, opts) {
								// this.parent.handlePaymentTypeLoading(toolbar);
							}
						}
					}]
		});

		filterContainerArr.push(moduleTypeContainer);
		filterContainerArr.push(subscriptionTypeContainer);
		filterContainerArr.push(statusTypeContainer);
		
		this.items = [{
					xtype : 'container',
					width : '100%',
					layout : 'column',
					items : filterContainerArr
				}];
		this.callParent(arguments);
	}
});