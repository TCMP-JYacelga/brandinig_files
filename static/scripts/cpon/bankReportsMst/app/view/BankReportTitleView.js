Ext.define('GCP.view.BankReportTitleView', {
	extend : 'Ext.panel.Panel',
	xtype : 'bankReportTitleView',
	requires : ['Ext.form.Label', 'Ext.Img', 'Ext.button.Button'],
	width : '100%',
	cls : 'ux_largepaddingtb ux_panel-background',
	layout : {
		type : 'hbox'
	},
	initComponent : function() {

		this.items = [{
					xtype : 'label',
					text : getLabel('systemBeneficiary', 'Bank Report Master Setup'),
					itemId : 'pageTitle',
					cls : 'page-heading'
				}, {
					xtype : 'label',
					flex : 25
				}/*, {
					xtype : 'button',
					itemId : 'btnReport',
					margin : '0 0 0 2',
					cls : 'cursor_pointer xn-saved-filter-btnmenu ux_font-size14 ux_export-btn',
					glyph : 'xf1c1@fontawesome',
					border : 0,
					width: 80,
					text : getLabel('report', 'Report')
				},   {
					xtype : 'button',
					border : 0,
					text : getLabel('export', 'Export'),
					cls : 'cursor_pointer xn-saved-filter-btnmenu ux_font-size14 ux_export-btn',
					glyph : 'xf019@fontawesome',
					margin : '0 0 0 0',
					width: 75,
					menu : Ext.create('Ext.menu.Menu', {

					})
				}*/

		];
		this.callParent(arguments);
	}

});