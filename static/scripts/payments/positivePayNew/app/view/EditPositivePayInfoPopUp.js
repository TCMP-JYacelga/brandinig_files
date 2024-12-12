Ext.define( 'GCP.view.EditPositivePayInfoPopUp',
{
	extend : 'Ext.form.Panel',
	requires :[],
	xtype : 'editPositivePayInfoPopUp',
	width : 500,
	//height : 500,
	callerParent : null,
	standardSubmit:true,
	url:"positivePayUpdate.srvc",
	initComponent : function()
	{
		var me = this;
		var decisionTypeStore = Ext.create('Ext.data.Store', {
			fields : ['key', 'value'],
			data : [{
						"key" : "pay",
						"value" : "Pay"
					},{
						"key" : "return",
						"value" : "Return"
					}]
		});
		this.items = [{
	 	    xtype : 'hidden',
	 	    name: csrfTokenName,
	 	    value: csrfTokenValue
	 	},{
		    xtype : 'container',
			layout : 'hbox',
			itemId : 'positivePayEditInfoTitleBar',
			items : [{
				xtype : 'label',
				itemId : 'decisionNmbr',
				text : getLabel('decisionNmbr', 'Decision # : '),
				labelWidth : 100
			},{
		  		xtype : 'label',
				itemId : 'decisionNmbrVal',
				labelWidth : 100
			},{
				xtype : 'label',
				itemId : 'paymentRef',
				text : getLabel('paymentRef', ' Payment Ref: '),
				labelWidth : 100
			},{
				xtype : 'label',
				itemId : 'paymentRefVal',
				labelWidth : 100
		    },{
		  		xtype : 'label',
				itemId : 'issueType',
				text : getLabel('issueType', ' Issue type : '),
				labelWidth : 100
			},{
				xtype : 'label',
				itemId : 'issueTypeVal',
				labelWidth : 100
			 }]
		},{
			xtype: 'container',
			width: 'auto',
			layout: 'column',
			itemId : 'positivePayEditInfoItemId',
			margin : 5,
			defaults: {
				margin: '3 5 0 5'
			},
			items: [{
				xtype: 'container',
				columnWidth: 0.50,
				layout: 'vbox',
				defaults: {
				padding: 3,
				labelAlign: 'top',
				labelSeparator: ''			
			},
			items: [{
				xtype : 'textfield',
				itemId : 'accountNmbr',
				name : 'accountNmbr',
				fieldLabel : getLabel( 'accountNmbr', 'Account' ),
				labelWidth : 150,
				editable : false
			  },{
				xtype : 'textfield',
				itemId : 'instNmbr',
				name : 'instNmbr',
				fieldLabel : getLabel( 'instNmbr', 'Check Number' ),
				labelWidth : 150,
				editable : false
			  },{
				xtype : 'textfield',
				itemId : 'decisionBydt',
				name : 'decisionBydt',
				fieldLabel : getLabel( 'decisionBydt', 'Decision By Date Time' ),
				labelWidth : 150,
				editable : false
			  },{
				xtype : 'textfield',
				itemId : 'exceptionReason',
				name : 'exceptionReason',
				fieldLabel : getLabel( 'exceptionReason', 'Exception Reason' ),
				labelWidth : 150,
				editable : false
			 },{
				xtype : 'textfield',
				itemId : 'decision',
				name : 'decision',
				fieldLabel : getLabel( 'decision', 'Decision' ),
				labelWidth : 150,
				editable : false
			 },{
				xtype : 'textfield',
				itemId : 'makerId',
				name : 'makerId',
				fieldLabel : getLabel( 'makerCode', 'Maker + datetime' ),
				labelWidth : 150,
				editable : false
			 },{
					xtype : 'hidden',
					itemId : 'recordKeyNo',
					name : 'recordKeyNo'
			 },{
					xtype : 'hidden',
					itemId : 'version',
					name : 'version'
			 }
			]
			},{
				xtype: 'container',
				columnWidth: 0.50,
				layout: 'vbox',
				defaults: {
					padding: 3,
					labelAlign: 'top',
					labelSeparator: ''
				},
				items: [{ 
					xtype  : 'datefield',
					itemId : 'instDate', 
					editable :false, 
				    fieldLabel: getLabel('lblchkdate', 'Check Date'),
				    fieldCls : 'xn-valign-middle xn-form-text w12',
				    allowBlank : true,
				    hideTrigger : true,
				    labelWidth : 150 
				},{
					xtype : 'textfield',
					itemId : 'amount',
					name : 'amount',
					fieldLabel : getLabel( 'amount', 'Amount' ),
					labelWidth : 150,
					editable : false
				},{
					xtype : 'textfield',
					itemId : 'beneficiaryName',
					name : 'beneficiaryName',
					fieldLabel : getLabel( 'beneficiaryName', 'Receiver Name' ),
					labelWidth : 150,
					editable : false
				},{
					xtype : 'textfield',
					itemId : 'descStatus',
					name : 'descStatus',
					fieldLabel : getLabel( 'decisionStatus', 'Status' ),
					labelWidth : 150,
					editable : false
				},{
					xtype : 'textfield',
					itemId : 'checkerId',
					name : 'checkerId',
					fieldLabel : getLabel( 'checkerCode', 'Checker + datetime' ),
					labelWidth : 150,
					editable : false
				}
				]
			  }
			]
		}];
		this.dockedItems =[{
			xtype: 'container',
			height : 10,
			dock: 'top',
			items: [{
				xtype : 'label',
				cls : 'red',
				itemId : 'errorLabel',
				hidden : true
			}]
			},{
			xtype : 'toolbar',
			padding : '5 50 25 25',
			dock : 'bottom',
			items : ['->',{
						xtype : 'button',
						cls : 'xn-button',
						text : getLabel('btnSave', 'Save'),
						formBind: true,
						itemId : 'saveBtn',
						callerParent : me.parent,
						handler : function(btn) {
							//me.fireEvent('handleEditActionGridView', btn);
							var form = this.up('form').getForm();
				            if (form.isValid()) {
				                // Submit the Ajax request and handle the response
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
					 },{
						xtype : 'button',
						cls : 'xn-button',
						text : getLabel( 'btnCancel', 'Close' ),
						itemId : 'closeBtn',
						callerParent : me.parent,
						handler : function( btn )
						{
							me.fireEvent('closeEditInfoPopup', btn);
						}
					}]
			}];
		this.callParent( arguments );
	}
	
} );
