Ext.define('GCP.view.PrfMstOthersProfileView', {
			extend : 'Ext.panel.Panel',
			xtype : 'prfMstOthersProfileView',
			requires : ['GCP.view.PrfFilterView', 'GCP.view.OthersPrfMenu'],
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
							itemId : 'othersPrfMenuPanel',
							defaults : {
								style : {
									padding : '0 0 0 4px'
								}
							},
							layout : {
								type : 'hbox'
							},
							items : [{
										xtype : 'othersPrfMenu',
										parent : this,
										width : '25%'
									}, {
										xtype : 'prfFilterView',
										itemId : 'othersPrfFilterView',
										width : '75%'
									}]
						}];
				this.callParent(arguments);
			}

		});