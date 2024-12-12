Ext.define('GCP.view.AgentSubAccountGridView', {
	extend : 'Ext.panel.Panel',
	requires : ['Ext.ux.gcp.SmartGrid','GCP.view.AgentSubAccountActionBarView','GCP.view.AgentSubAccountFilterView','Ext.panel.Panel'],
	xtype : 'agentSubAccountGridView',
	width : '100%',
	componentCls : 'ux_panel-background',
	initComponent : function() {
		var me = this;
		var subAccountActionBar = Ext.create('GCP.view.AgentSubAccountActionBarView', {
					itemId : 'subAccountActionBar',
					height : 21,
					width : '100%',
					margin : '1 0 0 0',
					parent : me
				});	
		this.items = [{
			xtype : 'panel',
			width : '100%',
			collapsible : true,
			title : getLabel('subAccountList','Sub Account List'),
			cls : 'xn-ribbon ux_panel-transparent-background ux_border-bottom',
			autoHeight : true,
			itemId : 'agentSubAccountDtlView',
			items : [
				{
					xtype : 'agentSubAccountFilterView',
					width : '100%',
					margin : '0 0 12 0',
					title : getLabel('filterBy', 'Filter By: ')							
				},
				 {
					xtype : 'panel',
					cls : 'xn-filter-toolbar',
					layout : 'vbox',
					flex : 0.05,
					height : 30,
					itemId : 'btnActionToolBar',
					columnWidth : 0.15,
					items : [{
								xtype : 'toolbar',
								layout : 'hbox',										
								padding : '1 0 1 0',
								items : [{
									xtype : 'button',
									itemId : 'btnNewAccount',
									border : 0,									
									text : '<i class="fa fa-plus-circle ux_icon-padding"></i>'+getLabel('createSubAccount','Create New Sub-Account'),
									cls : 'inline_block ux_button-padding ux_button-background-color',
									parent : this,
									margin : {
										left : 10
									},
									//padding : '5 10 10 5',
									handler : function(btn, opts) {
										me.fireEvent('addSubAccountEntry', btn, opts);
									}
								}]
							}]
				},
				{
						xtype : 'container',
						itemId : 'actionBarContainer',
						layout : 'hbox',
						items : [{
									xtype : 'label',
									text : getLabel('actions', 'Actions') + ' :',
									cls : 'action_label ux_font-size14',
									padding : '5 0 0 10'
								}, subAccountActionBar, {
									xtype : 'label',
									text : '',
									flex : 1
								}]

					}]
		}];
		this.callParent(arguments);
	}

});