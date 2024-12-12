Ext.define( 'GCP.view.InstrumentInqViewInfo',
{
	extend : 'Ext.window.Window',
	requires : [],
	xtype : 'instrumentInqViewInfo',
	width : 400,
	//height : 400,
	parent : null,
	modal : true,
	closeAction : 'hide',
	initComponent : function()
	{
		var me = this;
		this.title = getLabel( 'viewInstrumentInqCheck', 'Deposit Item Details' );
		this.items =
		[
			{
				xtype : 'panel',
				width : '100%',
				margin : '5 5 0 0',
				//title : getLabel( 'viewInstrumentInqCheck', 'Deposit Check Details' ),
				itemId : 'instrumentInqViewInfoItemId',
				items :
				[
					{
						xtype : 'textfield',
						itemId : 'instrumentNmbr',
						fieldLabel : getLabel( 'lblCheckno', 'Item No.' ),
						labelCls : 'ux_font-size14',
						labelWidth : 150,
						margin : '0 0 12 0',
						editable : false
					},
					{
						xtype : 'textfield',
						itemId : 'instrumentAmount',
						fieldStyle : 'text-align: right;',
						fieldLabel : getLabel( 'lblCheckAmount', 'Item Amount' ),
						labelWidth : 150,
						margin : '0 0 12 0',
						labelCls : 'ux_font-size14',
						editable : false
					},
					{
						xtype : 'textfield',
						itemId : 'instrumentDate',
						fieldLabel : getLabel( 'lblCheckDate', 'Item Date' ),
						labelWidth : 150,
						margin : '0 0 12 0',
						labelCls : 'ux_font-size14',
						editable : false
					},
					{
						xtype : 'textfield',
						itemId : 'depSlipNmbr',
						fieldLabel : getLabel( 'lbldepSlipNo', 'Deposit Ticket' ),
						labelWidth : 150,
						margin : '0 0 12 0',
						labelCls : 'ux_font-size14',
						editable : false
					},
					{
						xtype : 'datefield',
						itemId : 'depositDate',
						fieldLabel : getLabel( 'lbldepositdate', 'Deposit Date' ),
						margin : '0 0 12 0',
						labelCls : 'ux_font-size14',
						labelWidth : 150
					},
					{
						xtype : 'textfield',
						itemId : 'depositAccount',
						fieldLabel : getLabel( 'lblaccount', 'Deposit Account' ),
						margin : '0 0 12 0',
						labelCls : 'ux_font-size14',
						labelWidth : 150
					},
					{
						xtype : 'textfield',
						itemId : 'instrumentStatus',
						fieldLabel : getLabel( 'lblStatus', 'Item Type' ),
						labelWidth : 150,
						margin : '0 0 12 0',
						labelCls : 'ux_font-size14',
						editable : false
					},
					{
						xtype : 'textfield',
						itemId : 'debitAccount',
						fieldLabel : getLabel( 'lblDebitAccount', 'Debit Account' ),
						margin : '0 0 12 0',
						labelCls : 'ux_font-size14',
						labelWidth : 150
					},
					{
						xtype : 'textfield',
						itemId : 'rtn',
						fieldLabel : getLabel( 'lblRTN', 'RTN' ),
						margin : '0 0 12 0',
						labelCls : 'ux_font-size14',
						labelWidth : 150
					}
				]
			}
		];
		this.dockedItems =
		[
			{
				xtype : 'toolbar',
				padding : '0 0 7 300',
				dock : 'bottom',
				items :
				[
					{
						xtype : 'button',
						cls : 'xn-button ux_button-background-color ux_cancel-button',
						glyph : 'xf056@fontawesome',
						text : getLabel( 'btnCancel', 'Cancel' ),
						itemId : 'cancelBtn',
						handler : function( btn )
						{
							me.fireEvent( 'closeInstrumentInqInfoPopup', btn );
						}
					}
				]
			}
		];
		this.callParent( arguments );
	}

} );
