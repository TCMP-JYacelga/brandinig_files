Ext.define('GCP.view.StopCheckRequestEntry', {
	extend : 'Ext.form.Panel',
	xtype : 'stopCheckRequestEntry',
	requires : [],
	callerParent : null,
	width : 500,
	standardSubmit:true,
	url:"addStopRequest.srvc",
	layout : {
		type : 'vbox'
	},
	initComponent : function() {
		var me = this;		
		this.items = [{
		 	    xtype : 'hidden',
		 	    name: csrfTokenName,
		 	    value: tokenValue
		 	},{
			xtype: 'container',
			width: 'auto',
			layout: 'column',
			margin : 30,
			defaults: {
				margin: '2 15 0 5'
			},
			items: [{
					xtype: 'container',
					columnWidth: 0.30,
					layout: 'vbox',
					defaults: {
						padding: 2,
						labelAlign: 'top',
						labelSeparator: ''
					},
					items: [{
						xtype: 'textfield',
						fieldLabel: getLabel("lblreference", "Reference"),
						itemId: 'reference',						
						name: 'reference',
						allowBlank: false,
						maxLength: 40
					}, {
						xtype: 'textfield',
						fieldLabel: getLabel("lblaccount", "Account"),
						itemId: 'account',
						name: 'account',
						allowBlank: false,
						maxLength: 35
					},{						
						xtype: 'datefield',
						fieldLabel: getLabel("lblchkdate", "Check Date"),	
						fieldCls : 'xn-valign-middle xn-form-text w12',						
						itemId: 'chkDate',
						name: 'chkDate',												
						editable : false,						
						hideTrigger : true						
					}, {
						xtype: 'textfield',
						fieldLabel: getLabel("lblreasoncode", "Reason Code"),
						itemId: 'reason',
						name: 'reason',
						allowBlank: false,
						maxLength: 255
					}]
				},{
					xtype: 'container',
					columnWidth: 0.40,
					layout: 'vbox',
					defaults: {
						padding: 2,
						labelAlign: 'top',
						labelSeparator: ''
					},
					items: [{
								xtype: 'fieldcontainer',
								name: 'Label1',
								itemid: 'Label1',
								fieldLabel: getLabel("lblchecknum", "Check No."),
								layout: 'hbox',																
								text: getLabel("lblchecknum", "Check No."),	
								items: [
									{										
										xtype:"numberfield",
										itemId: 'checkNmbrFrom',
										name: 'checkNmbrFrom',
										allowBlank: false,
										hideTrigger : true,										
										fieldCls : 'w6',										
										allowNegative:false,
										maxLength: 8
									}, {
										xtype:"numberfield",
										itemId: 'checkNmbrTo',
										name: 'checkNmbrTo',										
										hideTrigger : true,										
										fieldCls : 'w6',										
										allowNegative:false,
										maxLength: 8
									}
								]
						   },{
						xtype: 'numberfield',
						fieldCls : 'xn-valign-middle xn-form-text w15 xn-field-amount',
						fieldLabel: getLabel("lblamount", "Amount"),
						itemId: 'amount',
						name: 'amount',
						regex: /^\d{1,16}(\.\d{0,2})?$/,
						hideTrigger : true
					},{
						xtype: 'textfield',
						fieldLabel: getLabel("lblpayee", "Payee"),
						itemId: 'payee',
						name: 'payee',
						maxLength: 60
					}, {
						xtype: 'textfield',
						fieldLabel: getLabel("lblreplacementcheck", "Replacement Check"),
						itemId: 'replacementCheck',
						name: 'replacementCheck',
						maxLength: 60
					}]
				}]
		}];

		this.dockedItems = [{
			xtype : 'toolbar',
			padding : '10 40 0 0',
			dock : 'bottom',
			items : ['->', {						
						xtype : 'button',
						cls : 'xn-button',
						text : getLabel( 'btnOk', 'Ok' ),
						formBind: true,
						itemId : 'okBtn',
						callerParent : me.parent,
						handler : function(btn)	{							
							var form = this.up('form').getForm();							
				            if (form.isValid()) {								
				                 //Submit the Ajax request and handle the response
				                form.submit({
				                    success: function(form, action) {
				                       Ext.Msg.alert('Success', action.result.msg);
				                    },
				                    failure: function(form, action) {
				                        Ext.Msg.alert('Failed', action.result.msg);
				                    }
				                });
				            }
						}
						
					}, {
						xtype : 'button',
						cls : 'xn-button',
						text : getLabel( 'btncacel', 'Cancel' ),
						itemId : 'cancelBtn',
						callerParent : me.parent,
						handler : function(btn)	{
							me.fireEvent('closeStopChkRequest', btn );
						}						
					}]
		}];

		this.callParent(arguments);
	}	
});