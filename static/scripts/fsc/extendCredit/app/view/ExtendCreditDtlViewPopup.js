Ext.define( 'GCP.view.ExtendCreditDtlViewPopup',
{
	extend : 'Ext.window.Window',
	xtype : 'extendCreditDtlViewPopup',
	width : 735,
	maxHeight: 650,
	minHeight:156,
	resizable: false,
	draggable: false,
	autoHeight : true,
	parent : null,
	anchor_client : null,
	product_name : null,
	counter_party : null,
	invoice_no : null,
	invoice_date : null,
	invoice_amt : null,
	invoice_due_date : null,
	fin_req_no : null,
	fin_req_date : null,
	fin_req_amt : null,
	loan_type : null,
	loan_disb_amt : null,
	loan_due_date : null,
	title : getLabel('extendCreditView', 'Extend Credit View' ),
	modal : true,
	closeAction : 'hide',
	cls : 'xn-popup',
	listeners : {
		'resize' : function(){
			this.center();
		}
	},	
	initComponent : function() {
		var me = this;
		me.items = [{
			xtype : 'container',
			margin : '0 0 0 10',
			cls : 'ux_padding-top-18',
			layout : 'hbox',
			flex : 1,
			items : [{
				xtype : 'container',
				layout : 'vbox',
				flex : 1,
				items : [{
					xtype : 'label',
					text : getLabel("anchorClient", "Anchor Client"),
					cls : 'f13 ux_font-size14 ux_padding0060'
				}, {
					xtype : 'container',
					layout : 'hbox',
					itemId : 'anchorClientContainer',
					items : [{
								xtype : 'textfield',
								itemId : 'anchorClientTextField',
								name : 'anchorClientTextField',
								value : this.anchor_client,
								width : 165,
								disabled : true,
								editable : false,						
								fieldCls : 'xn-form-text w165 disabled'
							}]
				}]
			}, {
				xtype : 'container',
				layout : 'vbox',
				flex : 1,
				items : [{
					xtype : 'label',
					text : getLabel("product", "Product"),
					cls : 'f13 ux_font-size14 ux_padding0060 '
				}, {
					xtype : 'container',
					layout : 'hbox',
					itemId : 'productContainer',
					items : [{
								xtype : 'textfield',
								width : 165,
								itemId : 'product',
								fieldCls : 'xn-form-text w165 disabled',
								name : 'product',
								disabled : true,
								cls : 'ux_paddingb',
								labelWidth : 150,
								value : this.product_name
							}]
				}]
			},{
				xtype : 'container',
				layout : 'vbox',
				flex : 1,
				items : [{
							xtype : 'label',
							text : getLabel("counterParty", "Counterparty"),
							cls : 'f13 ux_font-size14 ux_padding0060 '
						}, {
							xtype : 'container',
							layout : 'hbox',
							itemId : 'counterPartyContainer',
							items : [{
										xtype : 'textfield',
										width : 165,
										itemId : 'counterParty',
										name : 'counterParty',
										fieldCls : 'xn-form-text w165 disabled',
										disabled : true,
										cls : 'ux_paddingb',
										labelWidth : 150,
										value : this.counter_party
									}]
						}]
			}]
		}, {
			xtype : 'container',
			margin : '0 0 0 10',
			cls : 'ux_padding-top-18',
			layout : 'hbox',
			flex : 1,
			items : [{
						xtype : 'container',
						layout : 'hbox',
						flex : 1,
						items : [{
							xtype : 'container',
							layout : 'vbox',
							items : [{
								xtype : 'label',
								text : getLabel("invoiceNo."+this.invoice_po_flag, "Invoice No"),
								cls : 'f13 ux_font-size14 ux_padding0060'
							}, {
								xtype : 'container',
								layout : 'hbox',
								itemId : 'invoiceNoContainer',
								items : [{
											xtype : 'textfield',
											width : 165,
											itemId : 'invoiceNo',
											fieldCls : 'xn-form-text w165 disabled',
											name : 'invoiceNo',
											hideTrigger : true,
											disabled : true,
											cls : 'ux_paddingb',
											value : this.invoice_no
										}]
							}]
						}]
					},{
						xtype : 'container',
						layout : 'vbox',
						flex : 1,
						items : [{
							xtype : 'label',
							text : getLabel("invDate."+this.invoice_po_flag, "Invoice Date"),
							cls : 'f13 ux_font-size14 ux_padding0060 '
						}, {
							xtype : 'container',
							layout : 'hbox',
							itemId : 'invoiceDateContainer',
							items : [{
										xtype : 'datefield',
										width : 165,
										itemId : 'invoiceDate',
										fieldCls : 'xn-form-text w165 disabled disabled',
										name : 'invoiceDate',
										hideTrigger : true,
										disabled : true,
										cls : 'ux_paddingb',
										labelWidth : 150,
										enforceMaxLength : true,
										enableKeyEvents : true,
										value : this.invoice_date
									}]
						}]
					},{
						xtype : 'container',
						layout : 'vbox',
						flex : 1,
						items : [{
							xtype : 'label',
							text : getLabel("invAmnt."+this.invoice_po_flag, "Invoice Amount"),
							cls : 'f13 ux_font-size14 ux_padding0060 '
						}, {
								xtype : 'container',
								layout : 'hbox',
								itemId : 'invAmntContainer',
								items : [{
											xtype : 'textfield',
											textAlign : 'right',
											width : 165,
											itemId : 'invAmnt',
											fieldCls : 'xn-form-text w165 disabled',
											name : 'invAmnt',
											hideTrigger : true,
											disabled : true,
											cls : 'ux_paddingb',
											value : this.invoice_amt,
											fieldStyle: 'text-align: right;'
										}]
							}]
					}]
		},{
			xtype : 'container',
			margin : '0 0 0 10',
			cls : 'ux_padding-top-18',
			layout : 'hbox',
			flex : 1,
			items : [{
				xtype : 'container',
				layout : 'vbox',
				flex : 1,
				items : [{
					xtype : 'label',
					text : getLabel("invDueDate."+this.invoice_po_flag, "Invoice Due Date"),
					cls : 'f13 ux_font-size14 ux_padding0060'
				}, {
					xtype : 'container',
					layout : 'hbox',
					itemId : 'invDueDateContainer',
					items : [{
								xtype : 'textfield',
								itemId : 'invDueDateTextField',
								name : 'invDueDateTextField',
								value : this.invoice_due_date,
								width : 165,
								disabled : true,
								editable : false,						
								fieldCls : 'xn-form-text w165 disabled'
							}]
				}]
		}]},{
			xtype : 'container',
			margin : '0 0 0 10',
			cls : 'ux_padding-top-18',
			layout : 'hbox',
			flex : 1,
			items : [{
				xtype : 'container',
				layout : 'vbox',
				flex : 1,
				items : [{
					xtype : 'label',
					text : getLabel("finReqNo", "Finance Request Reference"),
					cls : 'f13 ux_font-size14 ux_padding0060 '
				}, {
					xtype : 'container',
					layout : 'hbox',
					itemId : 'finReqNoContainer',
					items : [{
								xtype : 'textfield',
								width : 165,
								itemId : 'finReqNo',
								fieldCls : 'xn-form-text w165 disabled',
								name : 'finReqNo',
								disabled : true,
								cls : 'ux_paddingb',
								labelWidth : 150,
								value : this.fin_req_no
							}]
				}]
			},{
				xtype : 'container',
				layout : 'vbox',
				flex : 1,
				items : [{
							xtype : 'label',
							text : getLabel("requestDate", "Finance Req. Date"),
							cls : 'f13 ux_font-size14 ux_padding0060 '
						}, {
							xtype : 'container',
							layout : 'hbox',
							itemId : 'finReqDateContainer',
							items : [{
										xtype : 'textfield',
										textAlign : 'right',
										width : 165,
										itemId : 'finReqDate',
										name : 'finReqDate',
										fieldCls : 'xn-form-text w165 disabled',
										hideTrigger : true,
										disabled : true,
										cls : 'ux_paddingb',
										labelWidth : 150,
										enforceMaxLength : true,
										enableKeyEvents : true,
										maxLength : 21,
										value : this.fin_req_date
									}]
						}]
			},{
				xtype : 'container',
				layout : 'vbox',
				flex : 1,
				items : [{
					xtype : 'label',
					text : getLabel("requestedAmnt", "Finance Req. Amount"),
					cls : 'f13 ux_font-size14 ux_padding0060'
				}, {
					xtype : 'container',
					layout : 'hbox',
					itemId : 'anchorClientContainer',
					items : [{
								xtype : 'textfield',
								itemId : 'finReqAmtTextField',
								textAlign : 'right',
								name : 'finReqAmtTextField',
								value : this.fin_req_amt,
								width : 165,
								disabled : true,
								editable : false,						
								fieldCls : 'xn-form-text w165 disabled',
								fieldStyle: 'text-align: right;'
							}]
				}]
		}]}, {
			xtype : 'container',
			margin : '0 0 0 10',
			cls : 'ux_padding-top-18',
			layout : 'hbox',
			flex : 1,
			items : [{
				xtype : 'container',
				layout : 'vbox',
				flex : 1,
				items : [{
					xtype : 'label',
					text : getLabel("loanType", "Loan Type"),
					cls : 'f13 ux_font-size14 ux_padding0060 '
				}, {
					xtype : 'container',
					layout : 'hbox',
					itemId : 'loanTypeContainer',
					items : [{
								xtype : 'textfield',
								itemId : 'loanTypeTextField',
								name : 'loanTypeTextField',
								value : this.loan_type,
								inputAttrTpl: " data-qtip='"+this.loan_type +"'",
								width : 165,
								disabled : true,
								editable : false,						
								fieldCls : 'xn-form-text w165 disabled'
							}]
				}]
			},{
				xtype : 'container',
				layout : 'vbox',
				flex : 1,
				items : [{
							xtype : 'label',
							text : getLabel("loanDisbAmt", "Loan Disb. Amount"),
							cls : 'f13 ux_font-size14 ux_padding0060 '
						}, {
							xtype : 'container',
							layout : 'hbox',
							itemId : 'loanDisbAmtContainer',
							items : [{
										xtype : 'textfield',
										textAlign : 'right',
										width : 165,
										itemId : 'loanDisbAmt',
										name : 'loanDisbAmt',
										fieldCls : 'xn-form-text w165 disabled',
										disabled : true,
										value : this.loan_disb_amt,
										fieldStyle: 'text-align: right;'
									}]
						}]
	},{
				xtype : 'container',
				layout : 'vbox',
				flex : 1,
				items : [{
							xtype : 'label',
							text : getLabel("loanDueDate", "Loan Due Date"),
							cls : 'f13 ux_font-size14 ux_padding0060 '
						}, {
							xtype : 'container',
							layout : 'hbox',
							itemId : 'loanDueDateContainer',
							items : [{
										xtype : 'textfield',
										textAlign : 'right',
										width : 165,
										itemId : 'loanDueDate',
										name : 'loanDueDate',
										fieldCls : 'xn-form-text w165 disabled',
										hideTrigger : true,
										disabled : true,
										cls : 'ux_paddingb',
										labelWidth : 150,
										enforceMaxLength : true,
										enableKeyEvents : true,
										maxLength : 21,
										value : this.loan_due_date
									}]
						}]
			}]
		}];
		this.dockedItems =
			[{
			 	xtype : 'toolbar',
			 	dock : 'bottom',
			 	cls: 'x-toolbar-footer',
			 	items :
					[
				{
					xtype : 'button',
					itemId : 'btnCancel',
					text : getLabel('btnCancel', 'Cancel'),
					cls : 'ux_button-background-color ux_font-color-black',
					glyph : 'xf056@fontawesome',
					margin : '0 0 0 585',
					parent : this,
					handler : function(btn, opts) {
						me.close();
					}
				}
			]}
			];
		me.callParent(arguments);
	}
} );
