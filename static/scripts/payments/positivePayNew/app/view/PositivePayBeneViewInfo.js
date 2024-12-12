Ext.define( 'GCP.view.PositivePayBeneViewInfo',
{
	extend : 'Ext.window.Window',
	requires :[],
	xtype : 'positivePayBeneViewInfo',
	parent : null,
	modal : true,
    width : 820,
	y :250,
    closeAction : 'hide',
	layout :
	{
		type : 'vbox'
	},
	initComponent : function()
	{
		var me = this;
		this.title = getLabel( 'whitelistReceiver', 'Whitelist Payee' );
		var amountTypeStore = Ext.create('Ext.data.Store', {
			fields : ['key', 'value'],
			data : [{
						"key" : "1",
						"value" : "Less Than"
					},{
						"key" : "2",
						"value" : "Greater Than"
					},{
						"key" : "3",
						"value" : "Between"
					}]
		});
		this.items = [{
		      		xtype: 'container',
		    		itemId : 'positivePayBeneInfoItemId',
		    		width: 'auto',
		    		layout: 'vbox',
		    		cls : 'filter-container-cls',
		    		margin : 5,
		    		defaults: {
		    			padding: 2,
		    			labelAlign: 'top',
		    			labelSeparator: ''
		    		},
		    		items: [{
								xtype : 'label',
								itemId : 'amountType',
								text : 'Disclaimer - Payee saved as White-Listed will be marked as \'Pay\' by the System.',
								cls : 'ux_font-size14-normal',
								padding: '0 0 20 0',
								style: 'font-weight:bold;'
		    				},				
		    			{				
		    				xtype: 'container',					
		    				layout: 'hbox',
		    				defaults: {
		    					padding: 2,
		    					labelAlign: 'top',
		    					flex : 1,
		    					labelSeparator: ''
		    				},
		    				items: [{
								xtype: 'textfield',
								itemId : 'beneAccountNmbr',
								fieldLabel : getLabel( 'accountNmbr', 'Account' ),						
								name: 'beneAccountNmbr',
								labelCls: 'frmLabel',
								maxLength: 150,
								fieldCls: 'w14_8',
								fieldStyle: 'background-color: #ddd; background-image: none;'
							},{
								xtype: 'textfield',
								itemId : 'beneficiaryName',
								fieldLabel : getLabel( 'beneficiaryName', 'Payee' ),
								name: 'beneficiaryName',					
								labelCls: 'frmLabel',
								maxLength: 120,
								fieldCls: 'w14_8',
								padding: '2 2 2 50',
								fieldStyle: 'background-color: #ddd; background-image: none;'
							},
							{
								xtype : 'label',
								itemId : 'amountType',
								text : getLabel('amtLessThan', 'Less Than'),
								cls: 'ux_font-size14-normal',
								style: 'font-weight:bold;',
								padding: '25 0 0 30'								
		    				},
							{
								xtype: 'textfield',
								itemId : 'fromBeneAmount',
								labelCls : 'frmLabel tdrequired',
								fieldLabel : getLabel( 'fromAmount', 'Amount' ),		
								fieldCls : 'w14_8 xn-valign-middle xn-form-text xn-field-amount',
								name: 'fromBeneAmount',
								maxLength: 120	,
								padding: '2 2 2 20'								
							}
							/*{
								xtype : 'combobox',
								fieldLabel: 'Amount Type',
								width : 140,
								displayField : 'value',
								itemId : 'amountType',
								labelCls : 'x-form-item-label x-unselectable x-form-item-label-top tdfrmLabel tdrequired',
								store : amountTypeStore,
								valueField : 'key',
								fieldCls : 'xn-form-field',
								triggerBaseCls : 'xn-form-trigger',
								padding : '2 90 0 90',
								listeners : {
									change : function(combo, newValue, oldValue) {
										me.fireEvent('handleAmountType', newValue,oldValue);
									}
								}
							}*/]
		    			},		    			
		    			{				
		    				xtype: 'container',					
		    				layout: 'hbox',
		    				defaults: {
		    					padding: 2,
		    					labelAlign: 'top',
		    					flex : 1,
		    					labelSeparator: ''
		    				},
		    				items: [/*{
								xtype: 'textfield',
								itemId : 'fromBeneAmount',
								labelCls : 'x-form-item-label x-unselectable x-form-item-label-top tdfrmLabel tdrequired',
								fieldLabel : getLabel( 'fromAmount', 'Amount' ),		
								fieldCls : 'xn-valign-middle xn-form-text w15 xn-field-amount',
								name: 'fromBeneAmount',
								maxLength: 120				
							},{
								xtype: 'textfield',
								itemId : 'toBeneAmount',
								labelCls : 'tdrequired',
								fieldLabel : getLabel( 'toAmount', 'To Amount' ),
								fieldCls : 'xn-valign-middle xn-form-text w15 xn-field-amount',
								name: 'toBeneAmount',					
								maxLength: 120,
								padding: '2 2 2 90'
							},*/
							{
								xtype : 'hidden',
								itemId : 'decisionNmbr'
							}]
		    			}/*,
		    			{
		    				xtype: 'container',					
		    				layout: 'hbox',
		    				defaults: {
		    					padding: 2,
		    					labelAlign: 'top',						
		    					labelSeparator: ''
		    				},
		    				items: [{
		    					xtype : 'label',
		    					cls : 'page-heading-bottom-border',
		    					width : 690
		    				}]
		    			}*/]
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
			//padding : '0 0 0 400',
			dock : 'bottom',
			items : ['->',{
						xtype : 'button',
						text : getLabel('btnCancel', 'Cancel'),
						itemId : 'cancelBtn',
						cls : 'ux_button-background-color ux_cancel-button',
						glyph : 'xf056@fontawesome',
						handler : function( btn )
						{
							me.fireEvent( 'closeBeneInfoPopup', btn );
						}
					},{
						xtype : 'button',
						cls : 'ux_button-background-color',	
						text : getLabel('btnSave', 'Save'),
						glyph : 'xf0c7@fontawesome',
						itemId : 'saveBtn',
						docked: 'left',
						actionName : 'save',
						handler : function(btn) {
								me.fireEvent('handleBeneActionGridView', btn);
						}
					 }]
			}];
		this.callParent( arguments );
	}
} );
