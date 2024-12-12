Ext.define('GCP.view.CheckManagementStopPayViewPopup', {
	extend : 'Ext.window.Window',
	xtype : 'checkManagementStopPayViewPopup',
	requires : ['Ext.panel.Panel','Ext.button.Button','Ext.data.Store','GCP.view.CheckManagementResponseView'],
	modal : true,
	//title : getLabel('lbltxnStopPayinfo', 'Cancel Stop Pay'),
	//height : 600,
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
						xtype : 'panel',
						itemId : 'singleResponseView',
						width : '100%'
					},
					{
						xtype: 'toolbar',
						padding : '12 0 12 690',
				        items: ['->',{
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
								maxLength: 40,
								readOnly: true
							},
							{
								xtype: 'textfield',
								fieldLabel: getLabel("lblchkdate12", "Entry User"),		
								labelCls : 'ux_font-size14',
								fieldCls : 'ux_smallmargin-top w14',
								itemId: 'makerId',
								padding: '2 2 2 90',
								name: 'makerId',	
								readOnly: true
							}, {						
								xtype: 'textfield',
								fieldLabel: getLabel("lblchkdate11", "Entry Date"),	
								labelCls : 'ux_font-size14',
								fieldCls : 'xn-valign-middle w14 ux_smallmargin-top',				
								itemId: 'entryDate',
								name: 'entryDate',	
								padding: '2 2 2 90',				
								editable : false,						
								hideTrigger : true,
								readOnly: true
								
							}
							]	
				},				
					{
					xtype: 'fieldset',
					cls : 'ux_reciever-info',
					title: '<span>Request Information</span>',
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
						labelCls : 'ux_font-size14',
						fieldCls : 'ux_smallmargin-top w14',
						fieldLabel: getLabel("lblseller", "Financial Institution"),
						itemId: 'sellerId',						
						name: 'sellerId',
						allowBlank: false,
						maxLength: 40,
						readOnly: true
					}, {
						xtype: 'textfield',
						fieldLabel: getLabel("lblaccountNmbr", "Account"),
						labelCls : 'ux_font-size14',
						fieldCls : 'ux_smallmargin-top w14',
						itemId: 'account',
						name: 'account',
						padding: '2 2 2 90',
						allowBlank: false,
						maxLength: 35,
						readOnly: true
					},
					{
						xtype: 'textfield',
						fieldLabel: getLabel("lblchecknum", "Check No."),
						labelCls : 'ux_font-size14',
						fieldCls : 'ux_smallmargin-top w14',
						itemId: 'checkNmbrFrom',						
						name: 'checkNmbrFrom',
						padding: '2 2 2 90',
						allowBlank: false,
						hideTrigger : true,
						maxLength: 40,
						readOnly: true
					}
					]
				},				
				{				
					xtype: 'container',					
					layout: 'hbox',
					cls : 'ux_extralargepadding-top',
					defaults: {
						labelAlign: 'top',
						flex : 1,
						labelSeparator: ''
					},
					items: [
						{
						xtype: 'textfield',
						labelCls : 'ux_font-size14',
						fieldCls : 'xn-valign-middle   xn-field-amount ux_smallmargin-top w14',
						fieldLabel: getLabel("lblamount", "Amount"),
						itemId: 'amount',
						name: 'amount',						
						hideTrigger : true,
						readOnly: true
					}, {						
						xtype: 'textfield',
						fieldLabel: getLabel("lblchkdate", "Check Date"),	
						fieldCls : 'xn-valign-middle w14 ux_smallmargin-top',
						labelCls : 'ux_font-size14',
						itemId: 'checkDate',
						name: 'checkDate',
						padding: '2 2 2 90',
						editable : false,						
						hideTrigger : true,
						readOnly: true
					},
					{
					xtype: 'textfield',
					fieldLabel: getLabel("lblpayee", "Payee"),
					labelCls : 'ux_font-size14',
					fieldCls : 'ux_smallmargin-top w14',
					itemId: 'payee',
					name: 'payee',	
					padding: '2 2 2 90',					
					maxLength: 120,
					width: 389
				}	
					
					]
				},
				
				{				
					xtype: 'container',					
					layout: 'hbox',
					cls : 'ux_extralargepaddingtb',
					defaults: {
						labelAlign: 'top',
						flex : 1,
						labelSeparator: ''
					},
					items: [
						{
						xtype: 'textfield',
						fieldLabel: getLabel("lblreasonCode", "Reason Code"),
						itemId: 'reason',	
						labelCls : 'ux_font-size14',
						fieldCls : 'ux_smallmargin-top w14',
						name: 'reason',
						allowBlank: false,
						hideTrigger : true,
						maxLength: 40,
						readOnly: true
					},{
						xtype: 'textfield',
						fieldLabel: getLabel("lblexpirationDate", "Expiration Date"),
						itemId: 'expirationDate',
						name: 'expirationDate',
						labelCls : 'ux_font-size14',
						fieldCls : 'ux_smallmargin-top w14',
						padding: '2 2 2 90',
						hideTrigger : true,
						readOnly: true
					}, {						
						xtype: 'textfield',
						fieldLabel:  getLabel("lblReplacementChk", "Replacement Check"),
						labelCls : 'ux_font-size14',
						fieldCls : 'xn-valign-middle w14 ux_smallmargin-top',						
						itemId: 'replacementCheck',
						name: 'replacementCheck',
						padding: '2 2 2 90',			
						editable : false,						
						hideTrigger : true,
						readOnly: true
					}]
				},
					{				
					xtype: 'container',					
					layout: 'hbox',
					cls : 'ux_extralargepadding-bottom',
					defaults: {
						labelAlign: 'top',
						flex : 1,
						labelSeparator: ''
					},
					items: [{
						xtype: 'textfield',
						labelCls : 'ux_font-size14',
						fieldCls : 'ux_smallmargin-top w14',
						fieldLabel: getLabel("lblcontactPerson", "Contact Person"),
						itemId: 'contactPerson',						
						name: 'contactPerson',
						allowBlank: false,
						maxLength: 40,
						readOnly: true
					}, {
						xtype: 'textfield',
						fieldLabel: getLabel("lblphoneNumber", "Phone Number"),
						labelCls : 'ux_font-size14',
						fieldCls : 'ux_smallmargin-top w14',
						itemId: 'phoneNmbr',
						name: 'phoneNmbr',
						padding: '2 2 2 90',
						allowBlank: false,
						maxLength: 35,
						readOnly: true
					}]
				},
				{
					xtype: 'fieldset',
					cls : 'ux_reciever-info',
					title: '<span>Response Information</span>',
					width: '100%',
					collapsed: true
				},
				{				
					xtype: 'container',		
					cls : 'ux_extralargepadding-bottom',
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
						name: 'status',
						readOnly: true
					}, 
					{
						xtype: 'textfield',
						fieldLabel: getLabel("lblchkdate12", "Message"),								
						itemId: 'hostMessage',
						name: 'hostMessage',
						labelCls : 'ux_font-size14',
						fieldCls : 'ux_smallmargin-top w14',
						width : 405,
						padding: '2 2 2 90',
						readOnly: true
					}]
				},				
				{				
					xtype: 'container',					
					layout: 'hbox',
					cls : 'ux_extralargepadding-bottom',
					defaults: {
						labelAlign: 'top',						
						labelSeparator: ''
					},
					items: [{						
						xtype: 'textfield',
						fieldLabel: getLabel("lblchkdate11", "Bank Reference"),	
						itemId: 'bankReference',
						labelCls : 'ux_font-size14',
						fieldCls : 'ux_smallmargin-top w14 ',
						name: 'bankReference',
						readOnly: true
					}, {						
						xtype: 'textfield',
						fieldLabel: getLabel("lblchkdate11", "Tracking No."),	
						itemId: 'trakingNumber',
						labelCls : 'ux_font-size14',
						fieldCls : 'ux_smallmargin-top w14',
						name: 'trakingNumber',	
						padding: '2 2 2 90',
						readOnly: true
					}]
				},
				
			/*	{
					xtype: 'fieldset',
					cls : 'ux_no-padding',
					title: '<span class="ux_reciever-info">Contact Details</span>',
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
						labelCls : 'ux_font-size14',
						fieldCls : 'ux_smallmargin-top w14',
						fieldLabel: getLabel("lblcontactPerson", "Contact Person"),
						itemId: 'contactPerson',						
						name: 'contactPerson',
						allowBlank: false,
						maxLength: 40,
						readOnly: true
					}, {
						xtype: 'textfield',
						fieldLabel: getLabel("lblphoneNumber", "Phone Number"),
						labelCls : 'ux_font-size14',
						fieldCls : 'ux_smallmargin-top w14',
						itemId: 'phoneNmbr',
						name: 'phoneNmbr',
						padding: '2 2 2 90',
						allowBlank: false,
						maxLength: 35,
						readOnly: true
					}]
				},	*/			
				
				{
					xtype: 'container',	
					cls : 'ux_extralargepadding-bottom ux_hide-image',
					layout: 'hbox',					
					defaults: {
						labelAlign: 'top',						
						labelSeparator: ''
					},
					items: [{
						xtype : 'label',
						cls : 'page-heading-bottom-border',
						width : '100%'
					}]
				}]
		}];

		this.dockedItems = [{
			xtype: 'toolbar',
	        dock: 'bottom',
	        items: ['->',{
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
			fields : [ 'requestNmbr','reference' ,'checkNmbrFrom','checkDate','amount','payee','status','trakingNumber','hostMessage','contactPerson','phoneNmbr'],
			data : responseViewDataArray
		});
		return objStore;
	}
});
