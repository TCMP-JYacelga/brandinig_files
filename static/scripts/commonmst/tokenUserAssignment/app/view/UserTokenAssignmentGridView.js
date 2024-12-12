Ext.define('GCP.view.UserTokenAssignmentGridView', {
	extend : 'Ext.panel.Panel',
	requires : ['Ext.ux.gcp.SmartGrid','GCP.view.UserTokenActionBarView','Ext.panel.Panel'],
	xtype : 'userTokenAssignmentGridView',
	width : '100%',
	initComponent : function() {
		var me = this;
		var actionBar = Ext.create('GCP.view.UserTokenActionBarView', {
					itemId : 'userTokenGroupActionBarView',
					height : 21,
					width : '100%',				
					parent : me
				});
		this.items = [{
			xtype : 'panel',
			width : '100%',
			collapsible : true,
			margin:'10 0 0 0',
			cls : 'xn-ribbon ux_header-width ux_panel-transparent-background',
			title : getLabel('userTokensList', 'User Tokens List'),
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