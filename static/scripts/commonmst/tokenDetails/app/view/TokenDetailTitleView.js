Ext.define('GCP.view.TokenDetailTitleView', {
	extend : 'Ext.panel.Panel',
	xtype : 'tokenDetailTitleView',
	requires : ['Ext.form.Label', 'Ext.Img', 'Ext.button.Button'],
	width : '100%',
	cls : 'ux_panel-background',
	layout : {
		type : 'hbox'
	},
	initComponent : function() {
		this.items = [{
						xtype : 'container',
					 	layout : 'hbox',
						flex : 40,
						padding: '10 0 10 0',
					 	items : [{
									xtype : 'label',
									padding : '0 0 0 10',
									text : getLabel('importtoken', 'Token Summary'),
									itemId : 'pageTitle',
									cls : 'page-heading page-heading-tabs '
								},{
									xtype : 'label',
									text : ' | ',
									cls : 'page-heading page-heading-tabs ',
									margin : '0 10 0 10'
								}, {
									xtype : 'label',
									text : getLabel('userTokenTitle', 'Users Token Assignment'),
									itemId : 'pageTitleNavigation',
									cls : 'page-heading thePointer page-heading-inactive page-heading-tabs ',
									padding : '0 0 0 10',
									listeners : {
										'render' : function(lbl) {
											lbl.getEl().on('click', function() {
														submitForm('userTokenAssignmentList.form');
													});
										}
									}
								}]
					  },
					  {
						xtype : 'label',
						flex : 25
					  }/*,
					  {
						xtype : 'button',
						itemId : 'btnReport',
						margin : '0 0 0 2',
						cls : 'cursor_pointer xn-saved-filter-btnmenu ux_font-size14 ux_export-btn',
						glyph : 'xf1c1@fontawesome',
						border : 0,
						width: 80,
						text : getLabel('report', 'Report')
					   },
					   {
						xtype : 'button',
						border : 0,
						text : getLabel('export', 'Export'),
						cls : 'cursor_pointer xn-saved-filter-btnmenu ux_font-size14 ux_export-btn',
						glyph : 'xf019@fontawesome',
						margin : '0 0 0 0',
						width: 75,
						menu : Ext.create('Ext.menu.Menu', {
						})
				}*/

		];
		this.callParent(arguments);
	}
});

function submitForm(Url) {
	var me = this;
	var form;
	var strUrl = Url;
	var errorMsg = null;
	if (!Ext.isEmpty(strUrl)) {
		form = document.createElement('FORM');
		form.name = 'frmMain';
		form.id = 'frmMain';
		form.method = 'POST';
		form.action = strUrl;
		document.body.appendChild(form);
		form.submit();
		document.body.removeChild(form);
	}
}