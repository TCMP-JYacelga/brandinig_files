Ext.define('GCP.view.TokenFilesTitleView', {
	extend : 'Ext.panel.Panel',
	xtype : 'tokenFilesTitleView',
	requires : ['Ext.form.Label', 'Ext.Img', 'Ext.button.Button'],
	width : '100%',
	cls : 'ux_panel-background',
	layout : {
		type : 'hbox'
	},
	initComponent : function() {
		this.items = [{
						xtype : 'container',
					 	layout : 'hbox',
						flex : 10,				 
					 	items : [{
									xtype : 'label',
									padding : '0 0 0 10',
									text : getLabel('titleImport', 'Token File Import Summary'),
									itemId : 'pageTitle',
									cls : 'page-heading '
								}]
					  },
					  {
						xtype : 'label',
						flex : 25
					  }/*,
					  {
						xtype : 'button',
						itemId : 'btnReport',
						margin : '0 0 0 2',
						cls : 'cursor_pointer xn-saved-filter-btnmenu ux_font-size14 ux_export-btn',
						glyph : 'xf1c1@fontawesome',
						border : 0,
						width: 80,
						text : getLabel('report', 'Report')
					   },
					   {
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