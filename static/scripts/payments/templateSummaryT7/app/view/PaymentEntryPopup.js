Ext.define('GCP.view.PaymentEntryPopup', {
	extend : 'Ext.window.Window',
	xtype : 'paymentEntryPopup',
	requires : ['GCP.view.ChoosePaymentMethodView'],
	width : 825,
	height : 400,
	draggable : true,
	modal : true,
	header : false,
	minButtonWidth : 60,
	initComponent : function() {
		var me = this;
		var singlePaymentTab = null;
		var choosePaymentMethodView = null;
		//this.title = 'Single Payment';

		singlePaymentTab = Ext.create('Ext.panel.Panel', {
			width : '100%',
			layout : {
				type: 'hbox',
				align: 'stretch'
			},
			items : [{
				html : '<div id="crumbs" class="crumbs">'
						+ '<ul>'
						+ '<li style="width:190px;"><a class="active">Choose Payment Pacakge</a></li>'
						+ '<li style="width:190px;"><a>Enter Payment Details</a></li>'
						+ '<li style="width:190px;"><a>Submit Payment</a></li>'
						+ '</ul> ' + '</div>',
				itemId : 'singlePaymentEntryTabPanelHeader',
				width : '100%'
			}, {
				html : '<div id="crumbs" class="crumbs">'
						+ '<ul>'
						+ '<li style="width:190px;"><a class="active">Choose Payment Package&nbsp;</a></li>'
						+ '<li style="width:150px;"><a><span class="mediumfont font_bold">Enter Payment Header</a></li>'
						+ '<li style="width:150px;"><a><span class="mediumfont font_bold">Enter Payment Details</a></li>'
						+ '<li style="width:150px;"><a><span class="mediumfont font_bold">Submit Payment</a></li>'
						+ '</ul> ' + '</div>',
				itemId : 'multiPaymentEntryTabPanelHeader',
				hidden : true,
				width : '100%'
			}]
		});
		choosePaymentMethodView = Ext.create('Ext.panel.Panel', {
					items : [{
								xtype : 'choosePaymentMethodView',
								dockedItems: [{
									xtype: 'toolbar',
									cls : 'ux_panel-transparent-background xn-pad-10 ux_border-top',
									margin : '10 0 0 0',
							        dock: 'bottom',
							        items: [
								        {
											xtype : 'button',
											itemId : 'btnCancel',
											text : getLabel('btnCancel', 'Cancel'),
											cls : 'ux_button-background-color ux_font-color-black',
											glyph : 'xf056@fontawesome',
											parent : this,
											handler : function(btn, opts) {
												me.close();
											}
										},'->',
								        {
											xtype : 'button',
											itemId : 'btnNext',
											margin : '0 0 0 10',
											text : getLabel('btnNext', 'Next'),
											cls : 'ux_button-background-color ux_font-color-black',
											glyph : 'xf058@fontawesome',
											parent : this,
											handler : function(btn, opts) {
												this.parent.fireEvent('nextPaymentAction', btn, opts);
										}
									}]
								}]								
							}]											
				});
		me.items = [singlePaymentTab, choosePaymentMethodView];		
		this.callParent(arguments);
	}
});