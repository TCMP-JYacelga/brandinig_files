Ext.define('GCP.view.LoanCenterTitleView', {
			extend : 'Ext.panel.Panel',
			xtype : 'loanCenterTitleViewType',
			requires : ['Ext.form.Label', 'Ext.Img', 'Ext.button.Button'],
			width : '100%',
			defaults : {
				style : {
					padding : '0 0 0 0'
				}
			},
			layout : {
				type : 'hbox'
			},
			initComponent : function() {
				var me = this;
				this.items = [
				//Need to confirm whether to delete this file as it is no longer required.
				/*{
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
							cls : 'page-heading',
							padding : '0 0 0 10',							
							listeners : {
								'render' : function(lbl) {
									lbl.getEl().on('click', function() {
												goToPage( 'loanCenterNew.srvc', 'frmMain', 'P', 'N' );
											});	
									if(isSiTabSelected === 'Y'){	
										this.removeCls('page-heading');
										this.addCls('page-heading thePointer page-heading-inactive');
									}		
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
							cls : 'page-heading thePointer page-heading-inactive',
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
									if(isSiTabSelected === 'Y'){	
										this.removeCls('page-heading thePointer page-heading-inactive');
										this.addCls('page-heading');
									}	
								}
							}
						}
					]
				}*/
				];
				this.callParent(arguments);

			}

		});