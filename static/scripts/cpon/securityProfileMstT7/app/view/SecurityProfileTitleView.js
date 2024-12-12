Ext.define('GCP.view.SecurityProfileTitleView', {
	extend : 'Ext.panel.Panel',
	xtype : 'securityProfileTitleView',
	requires : ['Ext.form.Label', 'Ext.Img', 'Ext.button.Button'],
	width : '100%',
//	baseCls : 'page-heading-bottom-border',
	defaults : {
		style : {
			padding : '0 0 0 0px'
		}
	},
	layout : {
		type : 'hbox'
	},
	initComponent : function() {

		this.items = [{
					xtype : 'label',
					text : getLabel('securitySetup', 'Security Setup'),
					itemId : 'pageTitle',
					cls : 'page-heading'
				}, {
					xtype : 'label',
					flex : 25
				}/*, {
					xtype : 'button',
					itemId : 'btnReport',
					margin : '0 10 0 2',
					glyph : 'xf1c1@fontawesome',
					cls : 'cursor_pointer xn-saved-filter-btnmenu ux_font-size14 ux_export-btn',
					border : 0,
					text : getLabel('report', 'Report')
				}, {
					xtype : 'button',
					border : 0,
					text : getLabel('export', 'Export'),
					cls : 'cursor_pointer xn-saved-filter-btnmenu ux_font-size14 ux_export-btn',
					glyph : 'xf019@fontawesome',
					menu : Ext.create('Ext.menu.Menu', {

					})
				}*/

		];
		this.callParent(arguments);
	}

});