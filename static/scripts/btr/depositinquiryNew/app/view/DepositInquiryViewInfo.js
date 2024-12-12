Ext.define( 'GCP.view.DepositInquiryViewInfo',
{
	extend : 'Ext.window.Window',
	requires : [],
	xtype : 'depositInquiryViewInfo',
	parent : null,
	modal : true,
	closeAction : 'hide',
	initComponent : function()
	{
		var me = this;
		this.title = getLabel( 'viewDepositInquiry', 'Deposit Ticket Details' );
		this.items =
		[
			{
				xtype : 'panel',
				width : '100%',
				//title : getLabel( 'viewDepositInquiry', 'Deposit Inquiry Details' ),
				itemId : 'depositInquiryViewInfoItemId',
				items :
				[
					{
						xtype : 'textfield',
						itemId : 'depositTicketNmbr',
						fieldLabel : getLabel( 'lbldepositslipno', 'Deposit Ticket' ),
						labelCls : 'ux_font-size14',
						labelWidth : 150,
						margin : '10 10 10 10',
						editable : false
					},
					{
						xtype : 'textfield',
						fieldStyle : 'text-align: right;',
						itemId : 'depositAmount',
						fieldLabel : getLabel( 'lblamount', 'Deposit Amount' ),
						labelCls : 'ux_font-size14',
						labelWidth : 150,
						margin : '10 10 10 10',
						editable : false
					},
					{
						xtype : 'textfield',
						itemId : 'depositAccount',
						fieldLabel : getLabel( 'lblaccount', 'Deposit Account' ),
						labelCls : 'ux_font-size14',
						margin : '10 10 10 10',
						labelWidth : 150
					},
					{
						xtype : 'datefield',
						itemId : 'postingDate',
						fieldLabel : getLabel( 'lbldepositdate', 'Deposit Date' ),
						labelCls : 'ux_font-size14',
						margin : '10 10 10 10',
						labelWidth : 150
					},
					{
						xtype : 'textfield',
						itemId : 'depSeqNmbr',
						fieldLabel : getLabel( 'lbldepseqno', 'Sequence #' ),
						labelCls : 'ux_font-size14',
						margin : '10 10 10 10',
						labelWidth : 150
					},
					{
						xtype : 'textfield',
						itemId : 'lockBoxId',
						fieldLabel : getLabel( 'lbllockboxid', 'Lockbox ID' ),
						labelCls : 'ux_font-size14',
						margin : '10 10 10 10',
						labelWidth : 150
					}
				]
			}
		];
		this.dockedItems =
		[
			{
				xtype : 'toolbar',
				padding : '0 0 7 0',
				dock : 'bottom',
				items :
				[,'->',
					{
						xtype : 'button',
						//cls : 'xn-account-filter-btnmenu',
						cls : 'xn-button ux_button-background-color ux_cancel-button',
						glyph : 'xf056@fontawesome',
						text : 'Cancel',
						itemId : 'cancelBtn',
						handler : function( btn )
						{
							me.fireEvent( 'closeDepositInquiryInfoPopup', btn );
						}
					}
				]
			}
		];
		this.callParent( arguments );
	}

} );
