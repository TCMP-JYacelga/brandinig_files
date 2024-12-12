/**
 * @class GCP.view.MessageBoxView
 * @extends Ext.panel.Panel
 * @author Archana Shirude
 */
Ext.define('GCP.view.MessageBoxView', {
	extend : 'Ext.panel.Panel',
	xtype : 'messageBoxView',
	requires : ['GCP.view.MessageBoxGridView',
			'GCP.view.MessageBoxGridInformationView',
			'GCP.view.MessageBoxFilterView', 'GCP.view.MessageBoxTitleView'],	
	autoHeight : true,
	initComponent : function() {
		var me = this;
		me.items = [
		/*{
			xtype : 'panel',
			cls : 'ux_panel-background',
			hidden : true,//bcoz code is moved to MessageBoxTitleView.
			width : '100%',
			layout : {
				type : 'hbox'
			},
			items : [{
						xtype : 'label',
						flex : 19
					}, {
						xtype : 'container',
						layout : 'hbox',
						align : 'rightFloating',
						defaults : {
							labelAlign : 'top'
						},
						items : [{
							xtype : 'button',
							border : 0,
							text : getLabel('lbl.messageCenter.report',
									'Report'),
							iconAlign : 'left',
							width : 80,
							textAlign : 'right',
							cls : 'cursor_pointer xn-saved-filter-btnmenu ux_font-size14 ux_export-btn',
							glyph : 'xf1c1@fontawesome',
							itemId : 'DownloadPdf',
							parent : this,
							handler : function(btn, opts) {
								this.parent.fireEvent('performReportAction',
										btn, opts);
							}
						}, {
							cls : 'black inline_block button-icon icon-button-pdf ux_hide-image',
							flex : 0
						}, {
							xtype : 'button',
							border : 0,
							text : getLabel('lbl.messageCenter.export',
									'Export'),
							cls : 'cursor_pointer xn-saved-filter-btnmenu ux_font-size14 ux_export-btn',
							glyph : 'xf019@fontawesome',
							margin : '0 0 0 0',
							width : 75,
							menu : Ext.create('Ext.menu.Menu', {
										items : [{
											text : getLabel('xlsBtnText', 'XLS'),
											glyph : 'xf1c3@fontawesome',
											itemId : 'downloadXls',
											parent : this,
											handler : function(btn, opts) {
												this.parent.fireEvent(
														'performReportAction',
														btn, opts);
											}
										}, {
											text : getLabel('csvBtnText', 'CSV'),
											glyph : 'xf0f6@fontawesome',
											itemId : 'downloadCsv',
											parent : this,
											handler : function(btn, opts) {
												this.parent.fireEvent(
														'performReportAction',
														btn, opts);
											}
										}, {
											text : getLabel('tsvBtnText', 'TSV'),
											glyph : 'xf1c9@fontawesome',
											itemId : 'downloadTsv',
											parent : this,
											handler : function(btn, opts) {
												this.parent.fireEvent(
														'performReportAction',
														btn, opts);
											}
										}, {
											text : getLabel(
													'withHeaderBtnText',
													'With Header'),
											xtype : 'menucheckitem',
											itemId : 'withHeaderId',
											checked : 'true'
										}]
									})
						}]
					}]
		}, */
		/*{
			xtype : 'messageBoxTitleViewType',
			width : '100%'
		}, */
		/*{
			xtype : 'panel',
			cls : 'ux_panel-background ux_largepaddingtb',
			layout : {
				type : 'hbox'
			},
			items : [
			{
				xtype : 'panel',
				itemId : 'composeId',
				layout : {
					type : 'hbox'
				},
				items : [{
					xtype : 'button',
					itemId : 'composeMsgId',
					name : 'compose',
					border : 0,
					text : '<span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;'
							+ getLabel('compose', 'Compose') + '</span>',
					glyph : 'xf055@fontawesome',
					cls : 'xn-btn ux-button-s ux_button-padding cursor_pointer',
					padding : '4 0 2 0'
				}]
			}]
		}, */
		/*{
			xtype : 'messageBoxFilterView',
			width : '100%',
			title : '<span id=imgFilterInfoGridView>'+getLabel('filterBy', 'Filter By: ')+'</span>',
			collapsible : true,
			collapsed: filterPanelCollapsed
					//+ '<img id="imgFilterInfoGridView" class="largepadding icon-information"/>'

		}, */
		/*{
			xtype : 'messageBoxGridInformationView'
		}, */
		{
			xtype : 'messageBoxGridView',
			parent : me
		}
		];
		me.on('resize', function() {
					me.doLayout();
				});
		me.callParent(arguments);
	}
});