Ext.define('GCP.view.PrfMstPaymentProfileView', {
			extend : 'Ext.panel.Panel',
			xtype : 'prfMstPaymentProfileView',
			requires : ['GCP.view.PrfFilterView', 'GCP.view.PaymentPrfMenu'],
			width : '100%',
			layout : {
				type : 'vbox',
				align : 'stretch'
			},
			initComponent : function() {
				this.items = [{
							xtype : 'panel',
							itemId : 'pmtPrfMenuPanel',
							width : '100%',
							layout : {
								type : 'hbox'
							},
							items : [{
										xtype : 'paymentPrfMenu',
										parent : this,
										width : '22%'
									}, {
										xtype : 'prfFilterView',
										cls : 'ux_panel-transparent-background',
										itemId : 'paymentPrfFilterView',
										width : '78%'
									}]
						}];
				this.callParent(arguments);
			}

		});