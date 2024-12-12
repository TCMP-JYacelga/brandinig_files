/**
 * @class GCP.view.PaymentSummaryTitleView
 * @extends Ext.panel.Panel
 * @author Shraddha Chauhan
 */
Ext.define('GCP.view.eventLog.EventLogTitleView', {
	extend : 'Ext.panel.Panel',
	xtype : 'eventLogTitleView',
	requires : [],
	width : '100%',
	baseCls : 'page-heading-bottom-border',
	defaults : {
		style : {
			padding : '0 0 0 4px'
		}
	},
	layout : {
		type : 'hbox'
	},
	initComponent : function() {

		this.items = [{
						xtype : 'label',
						text : getLabel('lbluseractivity',
								'User Activity'),
						cls : 'page-heading thePointer page-heading-inactive',
						listeners : {
							'render' : function(lbl) {
								lbl.getEl().on('click', function() {
									GCP.getApplication().fireEvent(
											'switchView','useractivity');
								});
							}
						}
					},{
						xtype : 'label',
						text : ' | ',
						cls : 'page-heading thePointer ',
						margin : '0 10 0 10'
					},{
						xtype : 'label',
						text : getLabel('lbleventlog',
								'Event Log'),
						cls : 'page-heading '
						/*listeners : {
							'render' : function(lbl) {
								lbl.getEl().on('click', function() {
									GCP.getApplication().fireEvent(
										'switchView','eventlog');
										});
							}
						}*/
					},{
						xtype : 'label',
						flex : 19
				},{
						xtype : 'container',
						layout : 'hbox',
						align : 'rightFloating',
						defaults : {
							labelAlign : 'top'
						},
						items : [{
					xtype : 'button',
					textAlign : 'right',
					itemId : 'eventDownloadPdf',
					cls : 'cursor_pointer xn-saved-filter-btnmenu ux_font-size14 ux_export-btn',
					glyph : 'xf1c1@fontawesome',
					width : 80,
					text : getLabel('report', 'Report'),
					border : 0
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
											text : getLabel('csvBtnText', 'CSV'),
											glyph : 'xf0f6@fontawesome',
											itemId : 'downloadCsv',
											parent : this,
											handler : function(btn, opts) {
												
												this.parent.fireEvent(
														'eventPerformReportAction',
														btn, opts);
											}
										}]
									})
						}]
					}

		];

		this.callParent(arguments);
	}

});