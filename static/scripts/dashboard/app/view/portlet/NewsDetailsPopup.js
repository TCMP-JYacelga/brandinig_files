Ext.define('Cashweb.view.portlet.NewsDetailsPopup', {
	extend: 'Ext.window.Window',
	title: 'Announcement Message',
	autoHeight: true,
	width: 500,
	modal: true,
	layout: 'fit',
	record: null,
	initComponent: function() {
		var thisClass = this;
		this.bbar = {
					layout : {
							type : 'hbox',
							align : 'middle',
							pack : 'end'
						},
						items : [{
									text : label_map.okBtn,
									cls : 'ux_button-background-color ux_button-padding',
									handler: function() {
										thisClass.close();
								    }
						}] 
		};
		var record = this.record;
		if(!Ext.isEmpty(record)) {
				this.items =  [{
					layout: 'vbox',
					cls : 'ux_largepadding',
					items : [{
								xtype : 'displayfield',
								fieldLabel : label_map.newsFeedTitle,
								fieldCls : 'ux_font-size14-normal',
								labelCls : 'font_bold ',
								value : record.data.title,
								flex: 1
							}, {
								xtype : 'displayfield',
								fieldLabel : label_map.newsLastGenerated,
								fieldCls : 'ux_font-size14-normal',
								labelCls : 'font_bold',
								value : record.artifactDate,
								flex: 1
							}, {
								xtype : 'textarea',
								disabled: true,
								grow: true,
								fieldLabel : label_map.newsFeedDetails,
								labelCls : 'font_bold',
								fieldCls: 'details-cls ux_font-size14-normal',
								value : record.data.details,
								padding: 5,
								componentCls: 'detail-field-cls',
								width: 400
							}]
				}];
		}
			this.callParent(arguments);
	}
});