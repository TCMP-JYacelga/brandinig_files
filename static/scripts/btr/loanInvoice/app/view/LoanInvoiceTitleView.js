Ext.define('GCP.view.LoanInvoiceTitleView', {
			extend : 'Ext.panel.Panel',
			xtype : 'loanInvoiceTitleViewType',
			requires : ['Ext.form.Label', 'Ext.Img', 'Ext.button.Button'],
			width : '100%',
			cls : 'ux_panel-background ux_extralargepadding-bottom',
			layout : {
				type : 'hbox'
			},
			initComponent : function() {
				var me = this;
				this.items =
				//Need to confirm whether to delete this file as it is no longer required.
				[/*
				{
					xtype : 'container',
					cls : 'ux_panel-background',
					layout : 'hbox',
					align : 'left',
					defaults :
					{
						labelAlign : 'top'
					},
					items :
					[
					
						{
							xtype : 'label',
							text : getLabel( 'loantxnSummary', 'Transaction Summary' ),
							//itemId : 'pageTitle',
							cls : 'page-heading thePointer page-heading-inactive',
							padding : '0 0 0 10',							
							listeners : {
								'render' : function(lbl) {
									lbl.getEl().on('click', function() {
												goToPage( 'loanCenterNew.srvc', 'frmMain', 'P', 'N' );
											});				
								}
							}
						}, {
							xtype : 'label',
							text : ' | ',
							cls : 'page-heading ',
							margin : '0 10 0 10',
							hidden : false
						},{
							xtype : 'label',
							text : getLabel( 'loanInvoices', 'Invoices' ),
							cls : 'page-heading',
							padding : '0 0 0 10',							
							listeners : {
								'render' : function(lbl) {
									lbl.getEl().on('click', function() {
												goToPage( 'loanInvoiceCenter.srvc', 'frmMain', 'P', 'N' );
											});			
								}
							}							
						}, {
							xtype : 'label',
							text : ' | ',
							cls : 'page-heading ',
							margin : '0 10 0 10',
							hidden : false
						},{
							xtype : 'label',
							text : getLabel( 'loanRecurringPayment', 'Recurring Payment' ),
							cls : 'page-heading thePointer page-heading-inactive',
							padding : '0 0 0 10',														
							listeners : {
								'render' : function(lbl) {
									lbl.getEl().on('click', function() {
												goToPage( 'loanCenterSiNew.srvc', 'frmMain', 'P', 'N' );
											});			
								}
							}
						}
					]
				}*/
				];
				this.callParent(arguments);
			}
		});