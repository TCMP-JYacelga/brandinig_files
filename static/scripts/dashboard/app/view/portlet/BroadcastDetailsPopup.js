Ext.define('Cashweb.view.portlet.BroadcastDetailsPopup', {
	extend: 'Ext.window.Window',
	title: 'Message Body',
	autoHeight: true,
	width: 500,
	modal: true,
	layout: 'fit',
	recordDtl: null,
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
		var recordDtl = this.recordDtl;
		if(!Ext.isEmpty(recordDtl)) {
				this.items =  [{
					layout: 'vbox',
					items : [ {
								xtype : 'textarea',
								disabled: true,
								grow: true,								
								labelCls : 'font_bold',
								fieldCls: 'details-cls ux_font-size14-normal',
								value : recordDtl,
								padding: 6,
								componentCls: 'detail-field-cls',
								width: 480,
								height: 240
							}]
				}];
		}
		this.callParent(arguments);
	}
});