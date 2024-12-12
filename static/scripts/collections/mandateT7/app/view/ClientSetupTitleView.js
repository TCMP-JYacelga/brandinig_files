Ext.define('GCP.view.ClientSetupTitleView', {
	extend : 'Ext.panel.Panel',
	xtype : 'clientSetupTitleView',
	requires : ['Ext.form.Label', 'Ext.Img', 'Ext.button.Button'],
	width : '100%',
	baseCls : 'page-heading-bottom-border',
	defaults : {
		style : {
			padding : '0 0 0 10px'
		}
	},
	layout : {
		type : 'hbox'
	},
	initComponent : function() {

		this.items = [{
					xtype : 'label',
					text : getLabel('mandateParty', 'Mandate Parties'),
					itemId : 'pageTitle',
					cls : 'page-heading'
				}, {
					xtype : 'label',
					flex : 25
				}, {
					xtype : 'button',
					border : 0,
					text : getLabel('report', 'Report'),
					iconAlign : 'left',
					margin : '0 10 0 2',
					textAlign : 'right',
					cls : 'cursor_pointer xn-saved-filter-btnmenu ux_font-size14 ux_export-btn',
					glyph : 'xf1c1@fontawesome',
					width: 80,
					itemId : 'downloadReport',
					parent : this,
					handler : function(btn, opts) {
						this.parent.fireEvent('performReportAction', btn, opts);
					}
				}, {
					xtype : 'button',
					border : 0,
					padding : '0 3',
					text : getLabel('export', 'Export'),
					itemId : 'exportBtn',
					cls : 'cursor_pointer xn-saved-filter-btnmenu ux_font-size14 ux_export-btn',
					glyph : 'xf019@fontawesome',
					width : 75,
					menu : Ext.create('Ext.menu.Menu', {
						itemId : 'exportMenu',
						items : [{
							text : getLabel('xlsBtnText', 'XLS'),
							glyph : 'xf1c3@fontawesome',
							itemId : 'downloadXls',
							hidden : false,
							parent : this,
							handler : function(btn, opts) {
								this.parent.fireEvent('performReportAction',
										btn, opts);
							}
						}, {
							text : getLabel('csvBtnText', 'CSV'),
							glyph : 'xf0f6@fontawesome',
							itemId : 'downloadCsv',
							hidden : false,
							parent : this,
							handler : function(btn, opts) {
								this.parent.fireEvent('performReportAction',
										btn, opts);
							}
						}, {
							text : getLabel('tsvBtnText', 'TSV'),
							glyph : 'xf1c9@fontawesome',
							itemId : 'downloadTsv',
							hidden : false,
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