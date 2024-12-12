Ext.define('GCP.view.AgreementFrequencyTitleView', {
	extend : 'Ext.panel.Panel',
	xtype : 'agreementFrequencyTitleView',
	requires : ['Ext.form.Label', 'Ext.Img', 'Ext.button.Button'],
	width : '100%',
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
					text : getLabel('sweepAgreementFrequencySummary','Sweep Agreement Scheduling Summary'),
					itemId : 'pageTitle',
					cls : 'page-heading'
				} /*{
					xtype : 'label',
					flex : 15
				}, {
					xtype : 'image',
					src : 'static/images/icons/icon_report.png',
					cls : 'ux_hide-image',
					height : 14,
					margin : '2 2 0 0'
				}, {
					xtype : 'button',
					itemId : 'btnReport',
					margin : '0 0 0 2',
					cls : 'cursor_pointer xn-saved-filter-btnmenu ux_font-size14 ux_export-btn',
					glyph : 'xf1c1@fontawesome',					
					border : 0,
					text : getLabel('report', 'Report')
				}, {
					xtype : 'image',
					src : 'static/images/icons/icon_spacer.gif',
					height : 18,
					cls : 'ux_hide-image',
					padding : '0 4 0 0'
				},  {
					cls : 'extralargeleftpadding black inline_block button-icon icon-button-pdf',
					flex : 0,
					padding : '20 12 0 0'
				},  {
					xtype : 'button',
					border : 0,
					padding : '0 3',
					text : getLabel('export', 'Export'),
					cls : 'cursor_pointer xn-saved-filter-btnmenu ux_font-size14 ux_export-btn',
					glyph : 'xf019@fontawesome',					
					menu : Ext.create('Ext.menu.Menu',{

					})
				}*/

		];
		this.callParent(arguments);
	}

});