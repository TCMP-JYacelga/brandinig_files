Ext.define( 'GCP.view.ShowClonePopUp',
{
	extend : 'Ext.window.Window',
	requires :['Ext.layout.container.VBox','Ext.container.Container','Ext.layout.container.HBox','Ext.form.field.Text',
	'Ext.layout.container.Column','Ext.form.field.Hidden','Ext.form.field.Checkbox','Ext.button.Button','Ext.form.Label',
	'Ext.toolbar.Toolbar'],
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
		this.title = getLabel( 'clonePopUpTitle', 'Interface Cloning' );
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
						itemId : 'interfaceName',
						fieldLabel : getLabel('interfaceCode', 'Interface Name :'),
						labelWidth : 150,
						 listeners:{
					           change:function(field){
					                field.setValue(field.getValue().toUpperCase());
					           }
					        }
						
					},
					{
						xtype : 'hidden',
						itemId : 'viewStateVal',
						name : 'viewState'
					},
					{
						xtype : 'hidden',
						itemId : 'interfaceType',
						name : 'interfaceType'
					},
					{
						xtype : 'hidden',
						itemId : 'interfaceMapMasterViewStateVal',
						name : 'interfaceMapMasterViewState'
					}]
			    },{
			    	xtype: 'checkbox',
	                boxLabel: 'Editable',
	                id: 'editChkBox',
	                handler: function() {
	                	var checked = Ext.getCmp('editChkBox').getValue();
	                	me.fireEvent('handleCheckBoxEditAction', checked);
	                }
			    },{
			    	xtype: 'checkbox',
	                boxLabel: 'Use Parent Security Profile',
	                id: 'profileChkBox',
	                handler: function() {
	                	var checked = Ext.getCmp('profileChkBox').getValue();
	                	me.fireEvent('handleCheckBoxProfileAction', checked);
	                }
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
						cls : 'xn-button ux_button-background-color ux_button-padding',
						text : getLabel('btnOk', 'Ok'),
						itemId : 'okBtn',
						actionName : 'ok',
						glyph : 'xf058@fontawesome',
						handler : function(btn) {
								me.fireEvent('handleCloneAction', btn);
						}
					 },{
						xtype : 'button',
						cls : 'xn-button ux_button-background-color ux_button-padding',
						text : getLabel( 'btnCancel', 'Cancel' ),
						itemId : 'cancelBtn',
						actionName : 'cancel',
						glyph : 'xf056@fontawesome',
						handler : function( btn )
						{
							me.fireEvent('closeClonePopup', btn);
						}
					}]
			}];
		this.callParent(arguments);
	}
} );
