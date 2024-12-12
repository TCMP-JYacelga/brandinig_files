Ext
		.define(
				'GCP.view.AgreementSweepQueryTitleView',
				{
					extend : 'Ext.panel.Panel',
					xtype : 'agreementSweepQueryTitleView',
					requires : [ 'Ext.form.Label', 'Ext.Img',
							'Ext.button.Button' ],
					width : '100%',
					defaults : {
						style : {
							padding : '0 0 0 4px'
						}
					},
					cls : 'ux_extralargepadding-bottom  ux_no-margin ux_panel-background',
					layout : {
						type : 'hbox'
					},
					initComponent : function() {

						this.items = [
								{
									xtype : 'label',
									flex : 1,
									text : getLabel(
											'screen.title.executionQueryList',
											'SWEEP QUERY'),
									itemId : 'pageTitle',
									cls : 'page-heading '
								},
								{
									xtype : 'label',
									flex : 1
								},
								/*
								 *{
								 *	xtype : 'image',
								 *	src : 'static/images/icons/icon_excel.png'
								*},
								
								 * xtype : 'button', itemId : 'sweepXlsButton',
								 * border : 0, padding : '0 8', text :
								 * "Download"
								 */

								{
									xtype : 'toolbar',
									flex : 1,
									cls : 'ux_panel-background',
									items : [
											'->',
											{
												xtype : 'button',
												border : 0,
												textAlign : 'right',
												cls : 'cursor_pointer xn-saved-filter-btnmenu ux_font-size14 ux_export-btn ',
												width : 75,
												text : getLabel('btnXLSText',
														'XLS'),
												glyph : 'xf1c3@fontawesome',
												itemId : 'sweepXlsButton'
												// hidden : isHidden('XLS'),

												/*handler : function(btn, opts) {
													this.parent
															.fireEvent(
																	'performReportAction',
																	btn, opts);

												}*/
											} ]
								}

						];
						this.callParent(arguments);
					}

				});