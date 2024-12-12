Ext.define('GCP.view.TokenDetailGridView', {
	extend : 'Ext.panel.Panel',
	requires : ['Ext.ux.gcp.SmartGrid','GCP.view.TokenDetailActionBarView','Ext.panel.Panel'],
	xtype : 'tokenDetailGridView',
	width : '100%',
	initComponent : function() {
		var me = this;
		var actionBar = Ext.create('GCP.view.TokenDetailActionBarView', {
					itemId : 'clientGroupActionBarView_clientDtl',
					height : 21,
					width : '100%',				
					parent : me
				});
		this.items = [{
			xtype : 'panel',
			width : '100%',
			autoHeight : true,
			collapsible : true,
			margin:'10 0 0 0',
			cls : 'xn-ribbon ux_header-width ux_panel-transparent-background',
			title : getLabel('tokenList', 'Tokens List'),
			itemId : 'clientSetupDtlView',
			items : [{
						xtype : 'container',
						cls: 'ux_largepaddinglr ux_border-top',
						layout : 'hbox',
						items : [{
									xtype : 'label',
									text : getLabel('actions', 'Actions') + ':',
									cls : 'ux_font-size14',
									padding : '5 0 0 10'
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