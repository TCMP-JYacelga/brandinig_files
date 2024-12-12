Ext.define('GCP.view.SCMProductTitleView', {
	extend : 'Ext.panel.Panel',
	xtype : 'scmProductTitleView',
	requires : ['Ext.form.Label', 'Ext.Img', 'Ext.button.Button'],
	width : '100%',
	//baseCls : 'page-heading-bottom-border',
	cls : 'ux_panel-background ux_extralargepaddingtb ux_no-margin',
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
					text : getLabel('scmProduct', 'SCF Package'),
					itemId : 'pageTitle',
					cls : 'page-heading'
				}, {
					xtype : 'label',
					flex : 5
				}, 
					
						
				{
								xtype : 'button',
								border : 0,
								text : getLabel('report', 'Report'),
								iconAlign : 'left',
								width : 80,
								textAlign : 'right',
								cls : 'cursor_pointer xn-saved-filter-btnmenu ux_font-size14 ux_export-btn',
								glyph : 'xf1c1@fontawesome',
								itemId : 'btnReport',
								parent : this,
								handler : function(btn, opts) {
								//	this.parent.fireEvent(
										//	'performReportAction', btn, opts);
								}
				 },			
				 {
					xtype : 'image',
					src : 'static/images/icons/icon_spacer.gif',
					height : 18,
					padding : '0 4 0 0',
					cls : 'ux_hide-image'
				}, 
					/*{
					cls : 'extralargeleftpadding black inline_block button-icon icon-button-pdf ux_hide-image',
					flex : 0,
					padding : '20 12 0 0'
					}*/
					
					
				{
								xtype : 'button',
								border : 0,
								text : getLabel('export', 'Export'),
								cls : 'cursor_pointer xn-saved-filter-btnmenu ux_font-size14 ux_export-btn',
								glyph : 'xf019@fontawesome',
								width : 75,
								menu : Ext.create('Ext.menu.Menu', {
											
										})
							
				}

		];
		this.callParent(arguments);
	}

});