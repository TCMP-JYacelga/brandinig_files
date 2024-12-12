Ext.define('GCP.view.CheckManagementViewPopup', {
	extend : 'Ext.window.Window',
	xtype : 'checkManagementViewPopup',
	requires : ['Ext.panel.Panel','Ext.button.Button','Ext.data.Store','GCP.view.CheckManagementResponseView'],
	modal : true,
	title : getLabel('lbltxninfo', 'Check Inquiry Response'),
	overflow : 'auto',
	closeAction:'hide',	
	width : 800,
	storeData:null,
	layout : 'fit',	
	initComponent : function() {
		var me = this;		
		this.items = [{
		 	    xtype : 'hidden',
		 	    name: csrfTokenName,
		 	    value: tokenValue
		 	},{
			xtype: 'container',
			itemId : 'responseItemId',
			width: 'auto',
			layout: 'vbox',
			defaults: {
				labelAlign: 'top',
				labelSeparator: ''
			},
			items: [ {
						html : '<div id="crumbs" class="crumbs">'
							+ '<ul>'
							+ '<li style="width:190px;"><a class="active">Check Inquiry Details</a></li>'
									+ '</ul> ' + '</div>',
						itemId : 'singleResponseView',
						width : '100%'
					},
					{
						xtype: 'toolbar',
						padding : '12 0 12 680',
				        items: ['->',{
							xtype : 'button',
							itemId : 'btnStop',
							text : getLabel('placeStop', 'Place Stop'),
							cls : 'ux_button-background-color ux_button-padding',
							glyph : 'xf056d@fontawesome',
							margin : '0 10 0 0',
							parent : this,
							handler : function(btn, opts) {
								this.parent.fireEvent('stopAction', btn, opts);
							}
						},  {
							xtype : 'button',
							itemId : 'btnCancel',
							text : getLabel( 'btncacel', 'Cancel' ),
							margin : '0 15 0 0',
							cls : 'ux_button-background-color ux_button-padding',
							glyph : 'xf056@fontawesome',				
							parent : this,
							handler : function(btn, opts) {
								me.close();
							}
						}]
					},{
					xtype: 'container',					
					layout: 'hbox',
					cls : 'filter-container-cls ux_extralargepadding-bottom',
					defaults: {
						labelAlign: 'top',
						flex : 1,
						labelSeparator: ''
					},
					items: [
						
							{
								xtype: 'textfield',
								fieldLabel: getLabel("lblreference", "Reference"),
								labelCls : 'ux_font-size14',
								fieldCls : 'ux_smallmargin-top w14',
								itemId: 'reference',						
								name: 'reference',
								allowBlank: false,						
								maxLength: 40				
							},
							{
								xtype: 'textfield',
								fieldLabel: getLabel("lblchkdate12", "Entry User"),								
								itemId: 'makerId',
								labelCls : 'ux_font-size14',
								fieldCls : 'ux_smallmargin-top w14',
								padding: '2 2 2 90',
								name: 'makerId'																		
							}, {						
								xtype: 'textfield',
								fieldLabel: getLabel("lblchkdate11", "Entry Date"),	
								fieldCls : 'xn-valign-middle   ux_smallmargin-top w14',	
								labelCls : 'ux_font-size14',
								itemId: 'entryDate',
								name: 'entryDate',	
								padding: '2 2 2 90',				
								editable : false,						
								hideTrigger : true						
							}
					]	
				},				
				{
					xtype: 'fieldset',
					title: '<span class="ux_reciever-info">Request Information</span>',
					width: '100%',
					cls : 'ux_no-padding',
					collapsed: true
				},
				{				
					xtype: 'container',					
					layout: 'hbox',
				
					defaults: {
						labelAlign: 'top',
						flex : 1,
						labelSeparator: ''
					},
					items: [{
						xtype: 'textfield',
						fieldLabel: getLabel("lblseller", "Financial Institution"),
						itemId: 'sellerId',
						labelCls : 'ux_font-size14',
						fieldCls : 'ux_smallmargin-top w14',
						name: 'sellerId',
						allowBlank: false,
						maxLength: 40
					}, {
						xtype: 'textfield',
						fieldLabel: getLabel("lblaccountNmbr", "Account"),
						labelCls : 'ux_font-size14',
						fieldCls : 'ux_smallmargin-top w14',
						itemId: 'account',
						name: 'account',
						padding: '2 2 2 90',
						allowBlank: false,
						maxLength: 35
					},
					{
						xtype: 'textfield',
						fieldLabel: getLabel("lblchecknum", "Check No."),
						itemId: 'checkNmbrFrom',
						labelCls : 'ux_font-size14',
						padding: '2 2 2 90',
						fieldCls : 'ux_smallmargin-top w14',
						name: 'checkNmbrFrom',
						allowBlank: false,
						hideTrigger : true,
						maxLength: 40				
					}
					
					]
				},				
				{				
					xtype: 'container',
					cls : 'ux_extralargepadding-top ux_extralargepadding-bottom',
					layout: 'hbox',
					defaults: {
						labelAlign: 'top',
						flex : 1,
						labelSeparator: ''
					},
					items: [
						{
						xtype: 'textfield',
						fieldCls : 'xn-valign-middle  w14 xn-field-amount ux_smallmargin-top',
						labelCls : 'ux_font-size14',
						fieldLabel: getLabel("lblamount", "Amount"),
						itemId: 'amount',
						name: 'amount',						
						hideTrigger : true
					}, {						
						xtype: 'textfield',
						fieldLabel: getLabel("lblchkdate", "Check Date"),
						labelCls : 'ux_font-size14',
						fieldCls : 'xn-valign-middle  w14 ux_smallmargin-top',						
						itemId: 'checkDate',
						name: 'checkDate',
						padding: '2 2 2 90',			
						editable : false,						
						hideTrigger : true						
					}
					,
					{
						xtype: 'textfield',
						fieldLabel: getLabel("lblpayee", "Payee"),
						itemId: 'payee',
						name: 'payee',
						padding: '2 2 2 90',
						labelCls : 'ux_font-size14',
						fieldCls : 'ux_smallmargin-top ux_extralargemargin-bottom w14',
						maxLength: 120,
						width: 389
					}
					]
				},				
				{
					xtype: 'fieldset',
					title: '<span class="ux_reciever-info">Response Information</span>',					
					cls : 'ux_no-padding',
					width: '100%',
					collapsed: true
				},
				{				
					xtype: 'container',					
					layout: 'hbox',
					
					defaults: {
						labelAlign: 'top',
						flex : 1,
						labelSeparator: ''
					},
					items: [{
						xtype: 'textfield',
						fieldLabel: getLabel("lblchkdate12", "Status"),								
						itemId: 'status',
						labelCls : 'ux_font-size14',
						fieldCls : 'ux_smallmargin-top w14',
						name: 'status'																
					}, 
					{
						xtype: 'textfield',
						fieldLabel: getLabel("lblchkdate12", "Message"),								
						itemId: 'hostMessage',
						name: 'hostMessage',
						labelCls : 'ux_font-size14',
						fieldCls : 'ux_smallmargin-top w14',
						width : 385,
						padding: '2 2 2 90'						
					}]
				},				
				{				
					xtype: 'container',					
					layout: 'hbox',
					cls : 'ux_extralargepadding-top',
					defaults: {
						labelAlign: 'top',						
						labelSeparator: ''
					},
					items: [{						
						xtype: 'textfield',
						fieldLabel: getLabel("lblchkdate11", "Bank Reference"),	
						itemId: 'bankReference',
						labelCls : 'ux_font-size14',
						fieldCls : 'ux_smallmargin-top w14',
						name: 'bankReference'
					}, {						
						xtype: 'textfield',
						fieldLabel: getLabel("lblchkdate11", "Tracking No."),	
						itemId: 'trakingNumber',
						name: 'trakingNumber',	
						labelCls : 'ux_font-size14',
						fieldCls : 'ux_smallmargin-top w14',
						padding: '2 2 2 90'
					}]
				},
				{
					xtype: 'container',					
					layout: 'hbox',
					cls : 'ux_hide-image',
					defaults: {
						labelAlign: 'top',						
						labelSeparator: ''
					},
					items: [{
						xtype : 'label',
						cls : 'page-heading-bottom-border',
						width : 630
						//padding : '4 0 0 0'
					}]
				}]
		}];

		this.dockedItems = [{
			xtype: 'toolbar',
	        dock: 'bottom',
	        items: ['->',{
				xtype : 'button',
				itemId : 'btnStopBottom',
				text : getLabel('placeStop', 'Place Stop'),
				cls : 'ux_button-background-color ux_button-padding',
				glyph : 'xf056d@fontawesome',				
				parent : this,
				handler : function(btn, opts) {
					this.parent.fireEvent('stopAction', btn, opts);
				}
			}, {
				xtype : 'button',
				itemId : 'btnCancel',
				text : getLabel( 'btncacel', 'Cancel' ),
				cls : 'ux_button-background-color ux_button-padding',
				glyph : 'xf056@fontawesome',					
				parent : this,
				handler : function(btn, opts) {
					me.close();
				}
			}]
		}];

		this.callParent(arguments);
	},
	getResponseViewStore : function() {
		var me = this;
		var responseViewDataArray=me.storeData;
		var objStore = Ext.create('Ext.data.Store', {
			fields : [ 'requestNmbr','reference' ,'checkNmbrFrom','checkDate','amount','payee','status','trakingNumber','hostMessage'],
			data : responseViewDataArray
		});
		return objStore;
	}
});
