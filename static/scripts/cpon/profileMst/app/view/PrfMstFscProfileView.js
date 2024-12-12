Ext.define('GCP.view.PrfMstFscProfileView', {
			extend : 'Ext.panel.Panel',
			xtype : 'prfMstFscProfileView',
			requires : ['GCP.view.PrfFilterView', 'GCP.view.FscPrfMenu'],
			width : '100%',
			layout : {
				type : 'vbox',
				align : 'stretch'
			},
			initComponent : function() {
				this.items = [{
							xtype : 'panel',
							width : '100%',
							itemId : 'fscPrfMenuPanel',
							layout : {
								type : 'hbox'
							},
							items : [{
										xtype : 'fscPrfMenu',
										parent : this,
										width : '22%'
									}, {
										xtype : 'prfFilterView',
										cls : 'ux_panel-transparent-background',
										itemId : 'fscPrfFilterView',
										width : '78%'
									}]
						}];
				this.callParent(arguments);
			}

		});