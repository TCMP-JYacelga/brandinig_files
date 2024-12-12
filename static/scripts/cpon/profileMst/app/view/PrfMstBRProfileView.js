Ext.define('GCP.view.PrfMstBRProfileView', {
			extend : 'Ext.panel.Panel',
			xtype : 'prfMstBRProfileView',
			requires : ['GCP.view.PrfFilterView', 'GCP.view.BRPrfMenu'],
			width : '100%',
			layout : {
				type : 'vbox',
				align : 'stretch'
			},
			initComponent : function() {
				this.items = [{
							xtype : 'panel',
							width : '100%',
							itemId : 'brPrfMenuPanel',
							layout : {
								type : 'hbox'
							},
							items : [{
										xtype : 'brPrfMenu',
										parent : this,
										width : '22%'
									}, {
										xtype : 'prfFilterView',
										cls : 'ux_panel-transparent-background',
										itemId : 'brPrfFilterView',
										width : '78%'
									}]
						}];
				this.callParent(arguments);
			}

		});