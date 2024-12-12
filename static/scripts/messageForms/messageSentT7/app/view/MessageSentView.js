/**
 * @class GCP.view.MessageSentView
 * @extends Ext.panel.Panel
 * @author Archana Shirude
 */
Ext.define('GCP.view.MessageSentView', {
	extend : 'Ext.panel.Panel',
	xtype : 'messageSentView',
	requires : ['GCP.view.MessageSentGridView'],	
	autoHeight : true,
	initComponent : function() {
		var me = this;
		me.items = [
		/*{
			xtype : 'panel',
			cls : 'ux_panel-background ux_largepadding-bottom',
			hidden : true,//bcoz following code is moved to MessageSentTitleView
			width : '100%',
			layout : {
				type : 'hbox'
			},
			items : [
					{
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
							width : 80,
							text : getLabel('lbl.loanCenter.report', 'Report'),
							iconAlign : 'left',
							textAlign : 'right',
							cls : 'cursor_pointer xn-saved-filter-btnmenu ux_font-size14 ux_export-btn',
							glyph : 'xf1c1@fontawesome',
							itemId : 'loanCenterDownloadPdf',
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
							text : getLabel('lbl.loanCenter.export', 'Export'),
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
		},*/
	/*	{
			xtype : 'messageSentTitleViewType',
			width : '100%'
		},*/ 
		/*{
			xtype : 'messageSentFilterView',
			width : '100%',
			title : '<span id=imgFilterInfoGridView>'+getLabel('filterBy', 'Filter By: ')+'</span>',
			collapsible : true,
			collapsed: filterPanelCollapsed
					//+ '<img id="imgFilterInfoGridView" class="largepadding icon-information"/>'
		}, {
			xtype : 'messageSentGridInformationView'
		},*/
		{
			xtype : 'messageSentGridView',			
			parent : me
		}];
		me.on('resize', function() {
					me.doLayout();
				});
		me.callParent(arguments);
	}
});