Ext.define( 'GCP.view.PositivePayGridViewInfo',
{
	extend : 'Ext.window.Window',
	requires :[],
	xtype : 'positivePayGridViewInfo',
	width : 530,
	//height : 500,
	parent : null,
	modal : true,
	closeAction : 'hide',
	initComponent : function()
	{
		var me = this;
		this.title = getLabel( 'viewPositivePay', 'Positive Pay Decision' );
		
		this.items = [{
	 	    xtype : 'hidden',
	 	    name: csrfTokenName,
	 	    value: tokenValue
	 	},{
		xtype: 'container',
		itemId : 'positivePayViewInfoItemId',
		width: 'auto',
		layout: 'vbox',
		defaults: {
			labelAlign: 'top',
			labelSeparator: ''
		},
		items: [{
					xtype: 'toolbar',
					padding : '0 10 0 412',
			        items: ['->',  {
						xtype : 'button',
						itemId : 'btnCancel',
						text : getLabel('btnCancel', 'Cancel'),
						cls : 'ux_button-background-color ux_cancel-button',
						glyph : 'xf056@fontawesome',					
						parent : this,
						handler : function(btn, opts) {
							me.close();
						}
					}]
				},{
					xtype: 'container',					
					layout: 'hbox',
					defaults: {
						labelAlign: 'top',						
						labelSeparator: ''
					},
					items: [{
						xtype : 'label',
						cls : 'page-heading-bottom-border ux_hide-image',
						width : 630
						//padding : '4 0 0 0'
					}]
				},{
					xtype: 'fieldset',
					title: '<span class="ux_reciever-info ux_font-size14-normal ux_no-padding">Check Information</span>',
					cls : 'ux_no-padding',
					width: '100%',
					collapsed: true
				},{
				xtype: 'container',
				cls : 'ux_extralargepadding-bottom filter-container-cls',
				layout: 'hbox',
				defaults: {
					labelAlign: 'top',
					flex : 1,
					labelSeparator: ''
				},
				items: [
						{
							xtype: 'textfield',
							itemId : 'accountNmbr',
							fieldLabel : getLabel( 'accountNmbr', 'Account' ),
							labelCls : 'ux_font-size14',
							fieldCls : 'ux_smallmargin-top w14_8',
							name: 'accountNmbr',
							maxLength: 150				
						},
						{
							xtype: 'textfield',
							fieldLabel : getLabel( 'instNmbr', 'Check No.' ),							
							itemId : 'instNmbr',
							labelCls : 'ux_font-size14',
							fieldCls : 'ux_smallmargin-top w14_8',
							padding: '2 2 2 88',
							name: 'instNmbr'																		
						}
						]	
			},				
			{				
				xtype: 'container',	
				cls : 'ux_extralargepaddingtb',
				layout: 'hbox',
				defaults: {
					labelAlign: 'top',
					flex : 1,
					labelSeparator: ''
				},
				items: [
					{
					xtype: 'textfield',
					itemId : 'amount',
					fieldLabel : getLabel( 'amount', 'Amount' ),
					fieldCls : 'xn-valign-middle xn-form-text xn-field-amount ux_smallmargin-top w14_8',
					//width : 150,
					labelCls : 'ux_font-size14',
					name: 'amount',
					hideTrigger : true,
					maxLength: 40				
				},{						
					xtype: 'textfield',
					fieldLabel: getLabel("lblchkdate", "Check Date"),	
					fieldCls : 'xn-valign-middle xn-form-text ux_smallmargin-top w14_8',
					//width : 150,
					itemId: 'instDate',
					labelCls : 'ux_font-size14',
					name: 'instDate',
					padding: '2 2 2 88',			
					hideTrigger : true						
				}]
			},
			{
				xtype: 'textfield',
				itemId : 'beneficiaryName',
				fieldLabel : getLabel( 'beneficiaryName', 'Receiver Name' ),
				labelCls : 'ux_font-size14',
				fieldCls : 'ux_smallmargin-top',
				name: 'beneficiaryName',					
				maxLength: 120,
				padding: '0 0 0 0',
				width: 380
			},
			{				
				xtype: 'container',
				cls : 'ux_extralargepadding-top',
				layout: 'hbox',
				defaults: {
					labelAlign: 'top',
					flex : 1,
					labelSeparator: ''
				},
				items: [
					{
					xtype: 'textfield',
					itemId : 'exceptionReason',
					fieldLabel : getLabel( 'exceptionReason', 'Exception Reason' ),
					name: 'exceptionReason',
					labelCls : 'ux_font-size14',
					fieldCls : 'ux_smallmargin-top w14_8',
					hideTrigger : true,
					maxLength: 40				
				},{						
					xtype: 'textfield',
					itemId : 'decisionStatus',
					fieldLabel : getLabel( 'decisionStatus', 'Status' ),
					name: 'decisionStatus',
					labelCls : 'ux_font-size14',
					fieldCls : 'ux_smallmargin-top w14_8',
					padding: '2 2 15 86',			
					hideTrigger : true						
				}]
			},
			{
				xtype: 'fieldset',
				title: '<span class="ux_reciever-info ux_font-size14-normal ux_no-padding">Decision & Reason</span>',
				cls : 'ux_no-padding ux_reciever-info',
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
					itemId : 'decision',
					fieldLabel : getLabel( 'decision', 'Decision' ),
					labelCls : 'ux_font-size14',
					fieldCls : 'ux_smallmargin-top w14_8',
					name: 'decision'																
				}, 
				{						
					xtype: 'textfield',
					itemId : 'defaultAction',
					fieldLabel : getLabel( 'defaultDecision', 'Default Decision' ),
					name: 'defaultAction',
					labelCls : 'ux_font-size14',
					fieldCls : 'ux_smallmargin-top w14_8',
					padding: '2 2 2 86',			
					hideTrigger : true						
				}]
			},				
			{				
				xtype: 'container',	
				cls : 'ux_extralargepadding-top',
				layout: 'hbox',
				defaults: {
					labelAlign: 'top',						
					labelSeparator: ''
				},
				items: [{						
					xtype: 'textfield',
					fieldLabel: getLabel("decisionReason", "Decision Reason"),	
					itemId: 'decisionReason',
					labelCls : 'ux_font-size14',
					fieldCls : 'ux_smallmargin-top w14_8',
					name: 'decisionReason'
				}, {						
					xtype: 'textfield',
					fieldLabel: getLabel("fileDate", "File Imported Date"),	
					itemId: 'fileImportDate',
					labelCls : 'ux_font-size14',
					fieldCls : 'ux_smallmargin-top w14_8',
					name: 'fileImportDate',	
					padding: '2 2 2 86'
				}]
			},
			/*{				
				xtype: 'container',					
				layout: 'hbox',
				defaults: {
					padding: 2,
					labelAlign: 'top',						
					labelSeparator: ''
				},
				items: [{						
					xtype: 'textfield',
					fieldLabel: getLabel("maker", "Maker"),	
					itemId: 'makerId',
					name: 'makerId'
				}, {						
					xtype: 'textfield',
					fieldLabel: getLabel("checker", "Checker"),	
					itemId: 'checkerId',
					name: 'checkerId',	
					padding: '2 2 2 90'
				}]
			},*/
			{
				xtype: 'container',					
				layout: 'hbox',
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
				itemId : 'btnCancel',
				text : getLabel('btnCancel', 'Cancel'),
				cls : 'ux_button-background-color ux_cancel-button',
				glyph : 'xf056@fontawesome',					
				parent : this,
				handler : function(btn, opts) {
					me.close();
				}
			}]
		}];
		this.callParent( arguments );
	}
} );
