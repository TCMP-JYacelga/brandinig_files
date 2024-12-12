Ext.define( 'GCP.view.MsgCenterAlertViewPopUp',
{
	extend : 'Ext.window.Window',
	requires :[],
	xtype : 'msgCenterAlertViewPopUp',
	height : 250,
	width : 400,
	parent : null,
	modal : true,
	closeAction : 'hide',
	initComponent : function()
	{
		var me = this;
		this.title = getLabel( 'viewmsg', 'View Message' );
		
		this.items = [{
			xtype: 'container',
			width: 'auto',
			layout: 'column',
			itemId : 'msgCenterAlertViewInfoItemId',
			items: [{
				xtype : 'label',
				itemId : 'msgBody',
				cls : 'ux_font-size14-normal'
				}]
		}];
		this.dockedItems =[{
			xtype : 'toolbar',
			padding : '25 0 0 0',
			dock : 'bottom',
			items : ['->',{
						xtype : 'button',
						cls : 'ux_button-background-color ux_button-padding',
						text : getLabel('btnOk', 'Ok'),
						itemId : 'okBtn',
						actionName : 'ok',
						handler : function(btn) {
							me.fireEvent( 'closeViewInfoPopup', btn );
						}
					 }]
			}];
		this.callParent( arguments );
	}
} );
