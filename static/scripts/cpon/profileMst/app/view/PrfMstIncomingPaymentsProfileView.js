Ext.define('GCP.view.PrfMstIncomingPaymentsProfileView', {
			extend : 'Ext.panel.Panel',
			xtype : 'prfMstIncomingPaymentsProfileView',
			requires : ['GCP.view.PrfFilterView', 'GCP.view.IncomingPaymentsPrfMenu'],
			width : '100%',
			layout : {
				type : 'vbox',
				align : 'stretch'
			},
			initComponent : function() {
				this.items = [{
							xtype : 'panel',
							width : '100%',
							itemId : 'incomingPaymentsPrfMenuPanel',
							layout : {
								type : 'hbox'
							},
							items : [{
										xtype : 'incomingPaymentsPrfMenu',
										parent : this,
										width : '22%'
									}, {
										xtype : 'prfFilterView',
										cls : 'ux_panel-transparent-background',
										itemId : 'incomingPaymentsPrfFilterView',
										width : '78%'
									}]
						}];
				this.callParent(arguments);
			}

		});