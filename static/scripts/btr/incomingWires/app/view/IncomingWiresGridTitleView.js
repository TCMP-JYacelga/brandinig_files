Ext.define('GCP.view.IncomingWiresGridTitleView', {
	extend : 'Ext.panel.Panel',
	xtype : 'incomingWiresGridTitleView',
	requires : [],
	width : '100%',
	cls : 'ux_panel-background',
	defaults : {
		style : {
			padding : '0 0 0 0'
		}
	},
	layout : {
		type : 'hbox'
	},
	initComponent : function() {

		this.items = [{
					xtype : 'label',
					text : getLabel('incomingWires', 'Incoming Wires'),
					cls : 'page-heading'
				},{
					xtype : 'label',
					flex : 19
				}, {
					xtype : 'image',
					src : 'static/images/icons/icon_report.png',
					height : 14,
					cls : 'ux_hide-image',
					margin : '2 0 0 0'
				}, {
					xtype : 'button',
					itemId : 'downloadPdf',
					margin : '0 0 0 0',
					cls : 'cursor_pointer xn-saved-filter-btnmenu ux_font-size14 ux_export-btn',
					glyph : 'xf1c1@fontawesome',
					border : 0,
					width : 80,
					text : getLabel('reportIcon', 'Report'),
					parent:this,
					handler : function(btn, opts) {
						this.parent.fireEvent('performReportAction',
								btn, opts);
					}
				}, {
					xtype : 'image',
					src : 'static/images/icons/icon_spacer.gif',
					height : 18,
					cls : 'ux_hide-image'
					//padding : '0 3'
				}, {
					cls : 'extralargeleftpadding black inline_block button-icon icon-button-pdf ux_hide-image',
					flex : 0
					//padding : '20 16 0 0'
				}, {
					xtype : 'button',
					border : 0,
					text : getLabel('export', 'Export'),
					cls : 'cursor_pointer xn-saved-filter-btnmenu ux_font-size14 ux_export-btn',
					glyph : 'xf019@fontawesome',
					width: 75,
					menu : Ext.create('Ext.menu.Menu', {
						items : [{
							text : getLabel('btnXLSText', 'XLS'),
							glyph : 'xf1c3@fontawesome',
							itemId : 'downloadXls',
							parent : this,
							handler : function(btn, opts) {
								this.parent.fireEvent('performReportAction',
										btn, opts);
							}
						}, {
							text : getLabel('btnCSVText', 'CSV'),
							glyph : 'xf0f6@fontawesome',
							itemId : 'downloadCsv',
							parent : this,
							handler : function(btn, opts) {
								this.parent.fireEvent('performReportAction',
										btn, opts);
							}
						}, {
							text : getLabel('btnTSVText', 'TSV'),
							glyph : 'xf1c9@fontawesome',
							itemId : 'downloadTsv',
							parent : this,
							handler : function(btn, opts) {
								this.parent.fireEvent('performReportAction',
										btn, opts);
							}
						}, {
							text : getLabel('btnWithHeaderText', 'With Header'),
							xtype : 'menucheckitem',
							itemId : 'withHeaderId',
							checked : 'true'
						}]
					})
				}

		];

		this.callParent(arguments);
	}

});