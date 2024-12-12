Ext.define( 'GCP.view.ShowClonePopUp',
{
	extend : 'Ext.window.Window',
	requires :[],
	xtype : 'showClonePopUp',
	callerParent : null,
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
		this.title = getLabel( 'clonePopUpTitle', 'Enter new Interface Code' );
		this.items = [{
			xtype: 'container',
			width: 'auto',
			layout: 'column',
			itemId : 'clonePopUpItemId',
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
					xtype : 'container',
					layout : 'hbox',
					items : [{
						xtype : 'textfield',
						itemId : 'interfaceCode',
						fieldLabel : getLabel('interfaceCode', 'Interface code :'),
						labelWidth : 150
					},{
					xtype : 'hidden',
					itemId : 'viewStateVal',
					name : 'viewState'
					}]
			    }]
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
			padding : '25 0 0 0',
			dock : 'bottom',
			items : ['->',{
						xtype : 'button',
						cls : 'xn-button',
						text : getLabel('btnOk', 'Ok'),
						itemId : 'okBtn',
						actionName : 'ok',
						handler : function(btn) {
								me.fireEvent('handleCloneAction', btn);
						}
					 },{
						xtype : 'button',
						cls : 'xn-button',
						text : getLabel( 'btnCancel', 'Cancel' ),
						itemId : 'cancelBtn',
						actionName : 'cancel',
						handler : function( btn )
						{
							me.fireEvent('closeClonePopup', btn);
						}
					}]
			}];
		this.callParent( arguments );
	}
} );
