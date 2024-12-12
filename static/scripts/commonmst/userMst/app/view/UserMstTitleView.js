Ext.define('GCP.view.UserMstTitleView', {
	extend : 'Ext.panel.Panel',
	xtype : 'userMstTitleView',
	requires : ['Ext.form.Label', 'Ext.Img', 'Ext.button.Button'],
	width : '100%',
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
					text : getLabel('user', 'User'),
					itemId : 'pageTitle',
					cls : 'page-heading'
				}, {
					xtype : 'label',
					flex : 15
				}, {
					xtype : 'button',
					border : 0,
					text : getLabel('report', 'Report'),
					iconAlign : 'left',
					width : 80,
					textAlign : 'right',
					glyph : 'xf1c1@fontawesome',
					cls : 'cursor_pointer xn-saved-filter-btnmenu ux_font-size14 ux_export-btn',
					itemId : 'downloadPdf',
					parent : this,
					handler : function(btn, opts) {
						this.parent.fireEvent('performReportAction', btn, opts);
					}
				}, {
					xtype : 'button',
					border : 0,
					text : getLabel('export', 'Export'),
					itemId : 'exportBtn',
					cls : 'cursor_pointer xn-saved-filter-btnmenu ux_font-size14 ux_export-btn',
					glyph : 'xf019@fontawesome',
					width: 75,
					menu : Ext.create('Ext.menu.Menu', {
						itemId : 'exportMenu',
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
				}

		];
		this.callParent(arguments);
	}

});