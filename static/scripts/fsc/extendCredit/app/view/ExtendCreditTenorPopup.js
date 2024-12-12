Ext.define( 'GCP.view.ExtendCreditTenorPopup',
{
	extend : 'Ext.window.Window',
	xtype : 'extendCreditTenorPopup',
	width : 735,
	maxHeight: 650,
	minHeight:156,
	resizable: false,
	draggable: false,
	autoHeight : true,
	parent : null,
	invoice_po_flag : null,
	invoice_no : null,
	invoice_date : null,
	invoice_amt : null,
	loan_disb_amt : null,
	loan_due_date : null,
	loan_duedate_new : null,
	identifier : null,
	requestNo : null,
	title : getLabel('lblExtendCredit', 'Extend Credit Tenor' ),
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
			margin : '0 0 10 10',
			itemId : 'errorContainer',
			//cls : 'ux_padding-top-18',
			layout : 'hbox',
			//hidden : true,
			flex : 1,
			items : [{
				xtype : 'label',
				cls : 'red',
				itemId : 'errorLabel',
				heigth : 10
			}]
		},{
			xtype : 'container',
			margin : '0 0 10 10',
			itemId : 'invDetailContainer',
			cls : 'ux_padding-top-18',
			layout : 'hbox',
			flex : 1,
			items : [{
				xtype : 'container',
				layout : 'vbox',
				flex : 1,
				items : [{
					xtype : 'label',
					itemId : 'invNolbl',
					//text : getLabel("invoiceNo."+this.invoice_po_flag, "Invoice No."),
					cls : 'f13 ux_font-size14 ux_padding0060'
				}, {
					xtype : 'container',
					layout : 'hbox',
					itemId : 'invNoContainer',
					items : [{
								xtype : 'textfield',
								itemId : 'invoiceNoTextField',
								name : 'invoiceNoTextField',
								//value : this.invoice_no,
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
					itemId : 'invDatelbl',
					//text : getLabel("invDate."+this.invoice_po_flag, "Invoice Date"),
					cls : 'f13 ux_font-size14 ux_padding0060 '
				}, {
					xtype : 'container',
					layout : 'hbox',
					itemId : 'invDateContainer',
					items : [{
								xtype : 'datefield',
								width : 165,
								itemId : 'invoiceDate',
								fieldCls : 'xn-form-text w165 disabled',
								name : 'invoiceDate',
								hideTrigger : true,
								disabled : true,
								cls : 'ux_paddingb',
								labelWidth : 150,
								enforceMaxLength : true,
								enableKeyEvents : true,
								maxLength : 21
								///value : this.invoice_date,
							}]
				}]
			},{
				xtype : 'container',
				layout : 'vbox',
				flex : 1,
				items : [{
							xtype : 'label',
							itemId : 'invAmtlbl',
							//text : getLabel("invAmnt."+this.invoice_po_flag, "Invoice Amount"),
							cls : 'f13 ux_font-size14 ux_padding0060 '
						}, {
							xtype : 'container',
							layout : 'hbox',
							itemId : 'invAmtContainer',
							items : [{
										xtype : 'textfield',
										textAlign : 'right',
										width : 165,
										itemId : 'invAmt',
										name : 'invAmt',
										fieldCls : 'xn-form-text w165 disabled',
										disabled : true,
										cls : 'ux_paddingb',
										labelWidth : 150,
										//value : this.invoice_amt,
										fieldStyle: 'text-align: right;'
									},{
									xtype : 'hidden',
									itemId : 'identifier'
									//value : this.identifier
								}]
						}]
			}]
		}, {
			xtype : 'container',
			margin : '0 0 0 10',
			itemId : 'loanDetailContainer',
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
								text : getLabel("loanDisbursalAmount", "Loan Disb. Amount"),
								cls : 'f13 ux_font-size14 ux_padding0060'
							}, {
								xtype : 'container',
								layout : 'hbox',
								itemId : 'loanDisbAmtContainer',
								items : [{
											xtype : 'textfield',
											width : 165,
											itemId : 'loanDisbAmt',
											fieldCls : 'xn-form-text w165 disabled',
											name : 'loanDisbAmt',
											hideTrigger : true,
											disabled : true,
											cls : 'ux_paddingb',
											//value : this.loan_disb_amt,
											fieldStyle: 'text-align: right;'
										}]
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
										xtype : 'datefield',
										width : 165,
										itemId : 'loanDueDate',
										fieldCls : 'xn-form-text w165 disabled disabled',
										name : 'loanDueDate',
										hideTrigger : true,
										disabled : true,
										cls : 'ux_paddingb',
										labelWidth : 150,
										enforceMaxLength : true,
										enableKeyEvents : true
										//value : this.loan_due_date
									}]
						}]
					},{
						xtype : 'container',
						layout : 'vbox',
						flex : 1,
						items : [{
							xtype : 'label',
							text : getLabel("loanDueDateNew", "New Loan Due Date"),
							cls : 'f13 ux_font-size14 ux_padding0060 '
						}, {
							xtype : 'container',
							layout : 'hbox',
							itemId : 'loanDueDateNewContainer',
							items : [{
										xtype : 'datefield',
										width : 165,
										itemId : 'loanDueDateNew',
										fieldCls : 'xn-form-text w165',
										name : 'loanDueDateNew',
										hideTrigger : true,
										editable : false,
										cls : 'ux_paddingb',
										labelWidth : 150,
										enforceMaxLength : true,
										enableKeyEvents : true
										//value : this.loan_duedate_new,
										//minValue : this.loan_due_date
									},{
										xtype : 'hidden',
										itemId : 'requestNo'
										//value : this.requestNo
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
							margin : '5 0 0 10',
							itemId : 'btnCancel',
							text : getLabel('btnCancel', 'Cancel'),
							cls : 'ux_button-background-color ux_font-color-black',
							glyph : 'xf056@fontawesome',
							parent : this,
							style :{
								color : '#fff !important'
							},
							handler : function(btn, opts) {
								//me.close();
								me.fireEvent('closeCreditPopup',btn, opts);
							}
						},{
							xtype : 'button',
							itemId : 'btnUpdate',
							margin : '0 0 0 520',
							text : getLabel('btnUpdate', 'Update'),
							cls : 'ux_button-background-color ux_font-color-black',
							glyph : 'xf058@fontawesome',
							parent : this,
							actionName : 'save',
							handler : function(btn, opts) {
								me.fireEvent('updateCredit',btn, opts);
							}
						}
					]}
			];
		me.callParent(arguments);
	}
} );
