Ext.define('GCP.view.IncomingPayServiceView', {
	extend : 'Ext.container.Container',
	xtype : 'incomingPayServiceView',
	requires : ['Ext.ux.gcp.SmartGrid','GCP.view.IncomingPayActionBarView','Ext.panel.Panel','GCP.view.AddEditViewRulePopup'],
	width : '100%',
	autoHeight : true,
	initComponent : function() {
		var me = this;
		var actionBar = Ext.create('GCP.view.IncomingPayActionBarView', {
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
			margin : '5 0 0 0',
			itemId : 'clientAccountDtlView',
			items : [{
							xtype : 'label',
							text : getLabel('incominglist', 'Incoming Payment List'),
							cls : 'font_bold',
							padding : '5 0 0 3'
							
						},{
						xtype : 'panel',
						layout : 'hbox',
						items : [{
									xtype : 'button',
									border : 0,
									text : '<span class="button_underline thePoniter ux_font-size14-normal">'
											+ getLabel('createnewrule', 'Create New Rule	') + '</span>',
									cls : 'xn-account-filter-btnmenu',
									margin : '5 0 0 0',
									itemId : 'btnAccountGrid',
									handler : function(){
										var rulepopup= Ext.create('GCP.view.AddEditViewRulePopup');
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
									cls : 'action_label',
									padding : '5 0 0 3'
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