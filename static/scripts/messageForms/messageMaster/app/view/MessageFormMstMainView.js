/**
 * @class GCP.view.MessageFormMstMainView
 * @extends Ext.panel.Panel
 * @author Nilesh Shinde
 */
Ext.define('GCP.view.MessageFormMstMainView', {
	extend : 'Ext.panel.Panel',
	xtype : 'messageFormMstMainViewType',
	requires : ['GCP.view.MessageFormMstFilterView',
			'GCP.view.MessageFormMstInfoView',
			'GCP.view.MessageFormMstGridView'],
	config : {
		globalGridRef : null,
		globalFilterData : null,
		globalFilterReportData : null
	},
	width : '100%',
	autoHeight : true,
	initComponent : function() {
		var me = this;
		me.items = [{
			xtype : 'panel',
			cls : 'ux_panel-background ux_largepaddingtb',
			width : '100%',
			layout : {
				type : 'hbox'
			},
			items : [{
				xtype : 'label',
				text : getLabel('lbl.messageForm.formMessages', 'Message Form'),
				cls : 'page-heading'
			}, {
				xtype : 'label',
				flex : 19
			}/*, {
				xtype : 'button',
				border : 0,
				text : getLabel('lbl.loanCenter.report', 'Report'),
				iconAlign : 'left',
				cls : 'cursor_pointer xn-saved-filter-btnmenu ux_font-size14 ux_export-btn',
				glyph : 'xf1c1@fontawesome',
				border : 0,
				width : 80,
				textAlign : 'right',
				itemId : 'loanCenterDownloadPdf',
				parent : this,
				handler : function(btn, opts) {
					this.parent.fireEvent('performReportAction', btn, opts);
				}
			},{
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
											'performReportAction', btn, opts);
								}
							}, {
								text : getLabel('csvBtnText', 'CSV'),
								glyph : 'xf0f6@fontawesome',
								itemId : 'downloadCsv',
								parent : this,
								handler : function(btn, opts) {
									this.parent.fireEvent(
											'performReportAction', btn, opts);
								}
							}, {
								text : getLabel('tsvBtnText', 'TSV'),
								glyph : 'xf1c9@fontawesome',
								itemId : 'downloadTsv',
								parent : this,
								handler : function(btn, opts) {
									this.parent.fireEvent(
											'performReportAction', btn, opts);
								}
							}, {
								text : getLabel('withHeaderBtnText',
										'With Header'),
								xtype : 'menucheckitem',
								itemId : 'withHeaderId',
								checked : 'true'
							}]
						})
			}*/]
		}, {
			xtype : 'panel',
			cls : 'ux_panel-background ux_largepadding-bottom',
			hidden : (ACCESSNEW)?false:true,
			layout : {
				type : 'hbox'
			},
			items : [{
						xtype : 'label',
						margin : '7 0 3 0',
						cls : 'ux_hide-image',
						// cls : 'x-custom-header-font',
						text : getLabel('lbl.messageForm.create',
								'Create New :')
					}, {
						xtype : 'button',
						itemId : 'formCreateItemId',
						parent : this,
						margin : '7 0 5 0',
						text : '<span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;'
								+ getLabel('lbl.messageForm.newForm',
										'Message Form') + '</span>',
						glyph : 'xf055@fontawesome',
						cls : 'xn-btn ux-button-s ux_button-padding',
						handler : function() {
							this.parent.fireEvent('addNewFormEvent', this);
						}
					}]
		}, {
			xtype : 'messageFormMstFilterViewType',
			width : '100%',
			title : getLabel('filterBy', 'Filter By: ')+ '<img id="imgFilterInfo" class="largepadding icon-information"/>'
		}, {
			xtype : 'messageFormMstGridViewType',
			width : '100%',
			parent : me
		}];
		me.on('resize', function() {
					me.doLayout();
				});
		me.callParent(arguments);
	}
});
