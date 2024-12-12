Ext.define('GCP.view.PrfMstChecksProfileView', {
			extend : 'Ext.panel.Panel',
			xtype : 'prfMstChecksProfileView',
			requires : ['GCP.view.PrfFilterView', 'GCP.view.ChecksPrfMenu'],
			width : '100%',
			layout : {
				type : 'vbox',
				align : 'stretch'
			},
			initComponent : function() {
				this.items = [{
							xtype : 'panel',
							width : '100%',
							itemId : 'checksPrfMenuPanel',
							layout : {
								type : 'hbox'
							},
							items : [{
										xtype : 'checksPrfMenu',
										parent : this,
										width : '22%'
									}, {
										xtype : 'prfFilterView',
										cls : 'ux_panel-transparent-background',
										itemId : 'checksPrfFilterView',
										width : '78%'
									}]
						}];
				this.callParent(arguments);
			}

		});