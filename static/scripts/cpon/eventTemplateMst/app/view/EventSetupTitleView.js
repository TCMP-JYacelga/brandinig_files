Ext.define('GCP.view.EventSetupTitleView', {
	extend : 'Ext.panel.Panel',
	xtype : 'eventSetupTitleView',
	requires : ['Ext.form.Label', 'Ext.Img', 'Ext.button.Button'],
	width : '100%',
	cls : 'ux_panel-background ux_largepaddingtb',
	layout : {
		type : 'hbox'
	},
	initComponent : function() {

		this.items = [{
					xtype : 'label',
					text : getLabel('alertMessageTemp', 'Alert Message Template'),
					itemId : 'pageTitle',
					cls : 'page-heading'
				}, {
					xtype : 'label',
					flex : 25
				}/*, {
					xtype : 'button',
					itemId : 'downloadPdf',
					cls : 'cursor_pointer xn-saved-filter-btnmenu ux_font-size14 ux_export-btn',
					glyph : 'xf1c1@fontawesome',
					width : 80,
					border : 0,
					text : getLabel('report', 'Report'),
					parent : this,
					handler : function(btn, opts) {
						this.parent.fireEvent('performReportAction', btn, opts);
					}
				}, {
					xtype : 'button',
					border : 0,
					cls : 'cursor_pointer xn-saved-filter-btnmenu ux_font-size14 ux_export-btn',
					glyph : 'xf019@fontawesome',
					margin : '0 0 0 0',
					width : 75,
					text : getLabel('export', 'Export'),
					menu : Ext.create('Ext.menu.Menu', {
						items : [{
							text : getLabel('xlsBtnText', 'XLS'),
							glyph : 'xf1c3@fontawesome',
							itemId : 'downloadXls',
							parent : this,
							handler : function(btn, opts) {
								this.parent.fireEvent('performReportAction',
										btn, opts);
							}
						}, {
							text : getLabel('csvBtnText', 'CSV'),
							glyph : 'xf0f6@fontawesome',
							itemId : 'downloadCsv',
							parent : this,
							handler : function(btn, opts) {
								this.parent.fireEvent('performReportAction',
										btn, opts);
							}
						}, {
							text : getLabel('tsvBtnText', 'TSV'),
							glyph : 'xf1c9@fontawesome',
							itemId : 'downloadTsv',
							parent : this,
							handler : function(btn, opts) {
								this.parent.fireEvent('performReportAction',
										btn, opts);
							}
						}, {
							text : getLabel('withHeaderBtnText', 'With Header'),
							xtype : 'menucheckitem',
							itemId : 'withHeaderId',
							checked : 'true'
						}]
					})
				}*/

		];
		this.callParent(arguments);
	}

});