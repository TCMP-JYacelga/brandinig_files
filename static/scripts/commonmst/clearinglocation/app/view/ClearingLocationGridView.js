Ext.define('GCP.view.ClearingLocationGridView', {
	extend : 'Ext.panel.Panel',
	requires : ['Ext.ux.gcp.SmartGrid','GCP.view.ClearingLocationActionBarView','Ext.panel.Panel'],
	xtype : 'clearingLocationGridView',
	width : '100%',
    cls: 'ux_extralargemargin-top',
	initComponent : function() {
		var me = this;
		var actionBar = Ext.create('GCP.view.ClearingLocationActionBarView', {
					itemId : 'clearingLocationActionBarView',
					height : 21,
					width : '100%',
					cls : 'xn-ribbon ux_header-width ux_panel-transparent-background',
					parent : me
				});
		me.items = [{
				xtype : 'container',
				layout : 'hbox',
				cls: 'ux_panel-background ux_extralargepadding-bottom',
				flex : 1,
				items : [{
					xtype : 'toolbar',
					itemId : 'btnCreateNewToolBar',
					cls : ' ux_panel-background',							
					flex : 1,
					items : []
				}]
		}, {
			xtype : 'panel',
			width : '100%',
			collapsible : true,	
			title : getLabel('summary', 'Clearing Locations List'),
			autoHeight : true,
			cls : 'xn-ribbon ux_panel-transparent-background',
			itemId : 'gridDtlView',
			items : [{
				xtype : 'container',
				layout : 'hbox',
				cls: 'ux_largepaddinglr ux_no-padding ux_no-margin x-portlet ux_border-top ux_panel-transparent-background',
				items : [{
					xtype : 'label',
					text : getLabel('actions', 'Actions') + ' :',
					cls : 'font_bold ux-ActionLabel ux_font-size14',
					padding : '5 0 0 3'
				}, actionBar, {
					xtype : 'label',
					text : '',
					flex : 1
				}]
			}]
		}];
		me.callParent(arguments);
	}
});
