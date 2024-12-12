Ext.define('GCP.view.PrfHolidayMstGridView', {
	extend : 'Ext.panel.Panel',
	xtype : 'prfHolidayMstGridView',
	requires : ['Ext.ux.gcp.SmartGrid','Ext.panel.Panel'],
	width : '100%',
	cls: 'ux_extralargemargin-top',
	initComponent : function() {
		var me = this;
		var actionBar = Ext.create('GCP.view.PrfHolidayMstActionBarView', {
			itemId : 'clientGroupActionBarView_clientDtl',
			height : 21,
			width : '100%',
			margin : '1 0 0 0',
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
			},{
			xtype : 'panel',
			width : '100%',
			cls : 'xn-ribbon ux_panel-transparent-background',
			collapsible: true,
			title: getLabel('holidayProfile', 'Holiday Profile'),
			autoHeight : true,
			itemId : 'prfHolidayDtlView',
			items : [{
					xtype : 'container',
					layout : 'hbox',
					cls: 'ux_largepaddinglr ux_no-padding ux_no-margin x-portlet ux_border-top ux_panel-transparent-background',
					items : [{
						xtype : 'label',
						text : getLabel('actions', 'Actions :'),
						cls : 'font_bold ux-ActionLabel ux_font-size14',
						padding : '5 0 0 3'
					},actionBar, {
						xtype : 'label',
						text : '',
						flex : 1
					}]

					}]
			}];
		me.callParent(arguments);
	}
});