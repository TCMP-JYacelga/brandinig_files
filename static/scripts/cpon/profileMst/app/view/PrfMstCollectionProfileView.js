Ext.define('GCP.view.PrfMstCollectionProfileView', {
			extend : 'Ext.panel.Panel',
			xtype : 'prfMstCollectionProfileView',
			requires : ['GCP.view.PrfFilterView', 'GCP.view.CollectionPrfMenu'],
			width : '100%',
			layout : {
				type : 'vbox',
				align : 'stretch'
			},
			initComponent : function() {
				this.items = [{
							xtype : 'panel',
							itemId : 'collectionPrfMenuPanel',
							width : '100%',
							layout : {
								type : 'hbox'
							},
							items : [{
										xtype : 'collectionPrfMenu',
										parent : this,
										width : '25%'
									}, {
										xtype : 'prfFilterView',
										itemId : 'collectionPrfFilterView',
										cls : 'ux_panel-transparent-background',
										width : '75%'
									}]
						}];
				this.callParent(arguments);
			}

		});