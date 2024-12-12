Ext.define('CPON.view.IncomingPayServiceView', {
	extend : 'Ext.container.Container',
	xtype : 'incomingPayServiceView',
	requires : ['Ext.ux.gcp.SmartGrid','CPON.view.IncomingPayActionBarView','Ext.panel.Panel','CPON.view.AddEditViewRulePopup'],
	width : '100%',
	autoHeight : true,
	initComponent : function() {
		var me = this;
		var actionBar = Ext.create('CPON.view.IncomingPayActionBarView', {
					itemId : 'accountActionBar',
					height : 21,
					width : '100%',
					margin : '1 0 0 0',
					parent : me
				});
		me.items = [{
			xtype : 'panel',
			width : '100%',
			cls : 'xn-panel',
			autoHeight : true,
			margin : '12 0 0 0',
			itemId : 'clientAccountDtlView',
			items : [{
							xtype : 'label',
							text : getLabel('incominglist', 'Incoming Payment List'),
							cls : 'font_bold ux_font-size14',
							padding : '5 0 0 3'
							
						},{
						xtype : 'panel',
						layout : 'hbox',
						items : [{
									xtype : 'button',
									border : 0,
									text : '<span class="buton_underline">'
											+ getLabel('createnewrule', 'Create New Rule	') + '</span>',
									cls : 'xn-account-filter-btnmenu',
									margin : '5 0 0 0',
									itemId : 'btnAccountGrid',
									handler : function(){
										var rulepopup= Ext.create('CPON.view.AddEditViewRulePopup');
										rulepopup.show();
									}
								}, actionBar, {
									xtype : 'label',
									text : '',
									flex : 1
								}]

					},{
						xtype : 'container',
						layout : 'hbox',
						items : [{
									xtype : 'label',
									text : getLabel('actions', 'Actions') + ':',
									cls : 'action_label ux_font-size14',
									padding : '5 0 0 10'
								}, actionBar, {
									xtype : 'label',
									text : '',
									flex : 1
								}]

					}]
		}];
		me.callParent(arguments);
	}

});