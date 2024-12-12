Ext.define('GCP.view.ManageAlertsGridView', {
	extend : 'Ext.panel.Panel',
	requires : ['Ext.ux.gcp.SmartGrid', 'GCP.view.ManageAlertsGroupActionBar',
			'Ext.panel.Panel'],
	xtype : 'manageAlertsGridView',
	width : '100%',
	initComponent : function() {
		var me = this;
		var actionBar = Ext.create('GCP.view.ManageAlertsGroupActionBar', {
					itemId : 'manageAlertsGroupActionBar_Dtl',
					height : 21,
					width : '100%',
					margin : '1 0 0 0',
					parent : me
				});
		this.items = [{
			xtype : 'container',
			layout : 'hbox',
			flex : 1,
			items : [{
						xtype : 'toolbar',
						itemId : 'btnCreateNewToolBar',
						cls : '',
						flex : 1,
						items : []
					}]
		}, {
			xtype : 'panel',
			width : '100%',
			cls : 'xn-panel',
			autoHeight : true,
			margin : '5 0 0 0',
			itemId : 'manageAlertsDtlView',
			items : [{
						xtype : 'container',
						layout : 'hbox',
						itemId : 'gridHeader',
						items : []
					}, {
						xtype : 'container',
						layout : 'hbox',
						items : [{
									xtype : 'label',
									text : getLabel('actions', 'Actions') + ':',
									cls : 'ux_font-size14',
									padding : '5 0 0 3'
								}, actionBar, {
									xtype : 'label',
									text : '',
									flex : 1
								}]

					}]
		}];
		this.callParent(arguments);
	}

});