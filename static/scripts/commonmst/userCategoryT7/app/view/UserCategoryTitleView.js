Ext.define('GCP.view.UserCategoryTitleView', {
	extend : 'Ext.panel.Panel',
	xtype : 'userCategoryTitleView',
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
					text : getLabel("Role", "Role"),
					itemId : 'pageTitle',
					cls : 'page-heading'
				}, {
					xtype : 'label',
					flex : 15
				}/*, {
					xtype : 'button',
					border : 0,
					text : getLabel('report', 'Report'),
					glyph : 'xf1c1@fontawesome',
					border : 0,
					width: 80,
					textAlign : 'right',
					cls : 'cursor_pointer xn-saved-filter-btnmenu  ux_font-size14 ux_export-btn',
					itemId : 'downloadReport',
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
							text : getLabel('bai2BtnText', 'BAl2'),
							iconCls : 'icon-button icon-download',
							itemId : 'downloadBAl2',
							hidden : true,
							parent : this,
							handler : function(btn, opts) {
								this.parent.fireEvent('performReportAction',
										btn, opts);
							}
						}, {
							text : getLabel('xlsBtnText', 'XLS'),
							glyph : 'xf1c3@fontawesome',
							itemId : 'downloadXls',
							hidden : true,
							parent : this,
							handler : function(btn, opts) {
								this.parent.fireEvent('performReportAction',
										btn, opts);
							}
						}, {
							text : getLabel('csvBtnText', 'CSV'),
							glyph : 'xf0f6@fontawesome',
							itemId : 'downloadCsv',
							hidden : true,
							parent : this,
							handler : function(btn, opts) {
								this.parent.fireEvent('performReportAction',
										btn, opts);
							}
						}, {
							text : getLabel('tsvBtnText', 'TSV'),
							glyph : 'xf1c9@fontawesome',
							itemId : 'downloadTsv',
							hidden : true,
							parent : this,
							handler : function(btn, opts) {
								this.parent.fireEvent('performReportAction',
										btn, opts);
							}
						}, {
							text : getLabel('mt940BtnText', 'MT940'),
							iconCls : 'icon-button icon-download',
							itemId : 'downloadMt940',
							hidden : true,
							parent : this,
							handler : function(btn, opts) {
								this.parent.fireEvent('performReportAction',
										btn, opts);
							}
						}, {
							text : getLabel('qbookBtnText', 'QuickBooks'),
							iconCls : 'icon-button icon-download',
							itemId : 'downloadqbook',
							hidden : true,
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