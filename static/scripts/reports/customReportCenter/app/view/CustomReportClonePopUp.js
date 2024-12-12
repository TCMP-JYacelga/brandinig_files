Ext.define( 'GCP.view.CustomReportClonePopUp',
{
	extend : 'Ext.window.Window',
	requires :['Ext.layout.container.VBox','Ext.container.Container','Ext.layout.container.HBox','Ext.form.field.Text',
	'Ext.layout.container.Column','Ext.form.field.Hidden','Ext.form.field.Checkbox','Ext.button.Button','Ext.form.Label',
	'Ext.toolbar.Toolbar'],
	xtype : 'customReportClonePopUp',
	callerParent : null,
	modal : true,
    width : 350,
    closeAction : 'hide',
	layout :
	{
		type : 'vbox'
	},
	popupData : null,
	initComponent : function()
	{
		var me = this;
		this.title = getLabel( 'clonereportcloneTitle', 'Custom Report Cloning' );
		this.items = [{
						xtype : 'textfield',
						itemId : 'reportName',
						fieldLabel : getLabel('repname', 'New Report Name :'),
						labelWidth : 150,
						 listeners:{
					           change:function(field){
					                field.setValue(field.getValue().toUpperCase());
					           }
					        }
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
								me.fireEvent('handleCloneAction', btn, me.popupData);
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
