Ext.define('GCP.view.ClientBroadcastDetailsPopup', {
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
									text : getLabel('btnOk','OK'),
									cls : 'ux_button-background-color ux_button-padding',
									handler: function() {
										thisClass.close();
								    }
						}] 
		};
		var recordDtl = this.recordDtl;
		var recordSub = this.recordSub;
		if(!Ext.isEmpty(recordDtl)) {
				this.items =  [{
					layout: 'vbox',
					items : [ {
								xtype : 'label',
								//disabled: true,
								//grow: true,								
								labelCls : 'font_normal',
								fieldCls: 'ux_font-size14-normal',
								text : recordSub
							  },
					          {
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