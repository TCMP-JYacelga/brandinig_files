Ext
		.define(
				'GCP.view.LotClosureTitleView',
				{
					extend : 'Ext.panel.Panel',
					xtype : 'LotClosureTitleView',
					requires : [ 'Ext.button.Button', 'Ext.toolbar.Toolbar',
							'Ext.menu.Menu' ],
					width : '100%',
					cls : 'ux_no-border ux_largepaddingtb ux_panel-background',
					defaults : {
						style : {
							padding : '0 0 0 4px'
						}
					},
					layout : {
						type : 'hbox'
					},
					initComponent : function() {

						this.items = [
								{
									xtype : 'label',
									text : getLabel('lbl.lotclosure.LotClosure',
											'Lot Closure'),
									cls : 'page-heading',
									padding : '0 0 0 10'
								},
								{
									xtype : 'toolbar',
									flex : 1,
									cls : 'ux_panel-background',
									items : [
											'->',
											{
												xtype : 'image',
												src : 'static/images/icons/icon_spacer.gif',
												height : 18,
												cls : 'ux_hide-image'
											},
											{
												cls : 'black inline_block button-icon icon-button-pdf ux_hide-image',
												flex : 0
											} ]
								},{
									xtype : 'label',
									flex : 19
								},{
									xtype : 'button',
									border : 0,
									text : getLabel('lbl.lms.export', 'Export'),
									cls : 'cursor_pointer xn-saved-filter-btnmenu ux_font-size14 ux_export-btn',
									glyph : 'xf019@fontawesome',
									margin : '0 0 0 0',
									width: 75,
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
										/*}, {
											text : getLabel('withHeaderBtnText', 'With Header'),
											xtype : 'menucheckitem',
											itemId : 'withHeaderId',
											checked : 'true'*/
										}]
									})
								}

						];

						this.callParent(arguments);
					}

				});