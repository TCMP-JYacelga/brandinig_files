Ext.define( 'GCP.view.ReturnDecisionPopUp',
{
	extend : 'Ext.window.Window',
	requires :[],
	xtype : 'returnDecisionPopUp',
	parent : null,
	modal : true,
    width : 350,
    closeAction : 'hide',
	layout :
	{
		type : 'vbox'
	},
	initComponent : function()
	{
		var me = this;
		this.title = getLabel( 'return', 'Return' );
		this.items = [{
		      		xtype: 'container',
		    		itemId : 'returnDecisionItemId',
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
			    				xtype: 'container',					
			    				defaults: {
			    					padding: 2,
			    					labelAlign: 'top',
			    					flex : 1,
			    					labelSeparator: ''
			    				},
			    				items: [{
									xtype : 'hidden',
									itemId : 'decisionNmbr'
								},{
	    							xtype: 'label',
	    							itemId : 'decisionReason',
	    							text : getLabel( 'lbldecisionReason', 'Decision Reason' ),						
	    							name: 'decisionReason',
	    							maxLength: 250				
	    						}]
			    			},{
		    				xtype: 'container',		
		    				itemId : 'returnComboId',
		    				layout: 'hbox',
		    				cls : 'filter-container-cls',
		    				defaults: {
		    					padding: 2,
		    					labelAlign: 'top',
		    					flex : 1,
		    					labelSeparator: ''
		    				},
		    				items: []
		    			}]
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
			//padding : '20 0 0 0',
			dock : 'bottom',
			items : ['->',{
						xtype : 'button',
						cls : 'xn-account-filter-btnmenu xn-button ux_button-background-color ux_cancel-button',
						text : getLabel('btnCancel', 'Cancel'),
						itemId : 'cancelBtn',
						glyph : 'xf056@fontawesome',
						handler : function( btn )
						{
							me.fireEvent('closeReturnReasonPopUp', btn);
						}
					},{
						xtype : 'button',
						cls : 'xn-button ux_button-background-color',
						text : getLabel('btnSave', 'Save'),
						glyph : 'xf0c7@fontawesome',
						itemId : 'saveBtn',
						actionName : 'save',
						handler : function(btn) {
							me.fireEvent('handleReturnReason', btn);
						}
					 }]
			}];
		this.callParent( arguments );
	}
} );
