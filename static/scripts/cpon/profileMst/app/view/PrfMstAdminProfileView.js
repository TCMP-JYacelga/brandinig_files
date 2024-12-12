Ext.define('GCP.view.PrfMstAdminProfileView', {
			extend : 'Ext.panel.Panel',
			xtype : 'prfMstAdminProfileView',
			requires : ['GCP.view.PrfFilterView', 'GCP.view.AdminPrfMenu'],
			width : '100%',
			margin : '0 0 12 0',
			layout : {
				type : 'vbox',
				align : 'stretch'
			},
			initComponent : function() {
				this.items = [{
							xtype : 'panel',
							itemId : 'adminPrfMenuPanel',
							width : '100%',
							layout : {
								type : 'hbox'
							},
							items : [{
										xtype : 'adminPrfMenu',
										parent : this,
										width : '22%'
									}, {
										xtype : 'prfFilterView',
										cls : 'ux_panel-transparent-background',
										itemId : 'adminPrfFilterView',
										width : '78%'
									}]
						}];
				this.callParent(arguments);
			}

		});