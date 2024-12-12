Ext.define('GCP.view.PrfMstLiquidityProfileView', {
			extend : 'Ext.panel.Panel',
			xtype : 'prfMstLiquidityProfileView',
			requires : ['GCP.view.PrfFilterView', 'GCP.view.LiquidityPrfMenu'],
			width : '100%',
			margin : '0 0 10 0',
			layout : {
				type : 'vbox',
				align : 'stretch'
			},
			initComponent : function() {
				this.items = [{
							xtype : 'panel',
							width : '100%',
							itemId : 'liquidityPrfMenuPanel',
							defaults : {
								style : {
									padding : '0 0 0 4px'
								}
							},
							layout : {
								type : 'hbox'
							},
							items : [{
										xtype : 'liquidityPrfMenu',
										parent : this,
										width : '25%'
									}, {
										xtype : 'prfFilterView',
										itemId : 'liquidityPrfFilterView',
										width : '75%'
									}]
						}];
				this.callParent(arguments);
			}

		});