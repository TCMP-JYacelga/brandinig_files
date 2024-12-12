Ext.define('Cashweb.controller.PaymentsThisMonthController', {
			extend : 'Ext.app.Controller',
			views : ['portlet.PaymentsThisMonth'],
			stores : ['PaymentsThisMonthStore'],
			models : ['PaymentsThisMonthModel'],
			mask : null,
			refs : [],
			config : {},
			init : function() {
				var me = this;
				this.control({
							'paymentsthismonth' : {
								boxready : this.onBoxReady,
								navigateToPayments : this.navigateToPayments
							}
						});
			},

			navigateToPayments : function(strFilter, filterJson,payCategory) {
				var me = this;
				var strUrl = 'paymentSummary.form';
				
				var frm = document.createElement('FORM');
				if (!Ext.isEmpty(strFilter)) {
					
													
					frm.appendChild(me.createFormField('INPUT', 'HIDDEN',
							'filterUrl', strFilter));
					filterJson.push({
						dataType: 0,
						displayType: 11,
						field : "InstrumentType",
						fieldLabel : "Payment Type",
						operator : "in" ,
						value1 : payCategory
					});	
					
					frm.appendChild(me.createFormField('INPUT', 'HIDDEN',
							'filterJson', JSON.stringify(filterJson)));
					frm.appendChild(me.createFormField('INPUT', 'HIDDEN',
							csrfTokenName, tokVal));
				}
				frm.action = strUrl;
				frm.name = 'frmMain';
				frm.id = 'frmMain';
				frm.method = "POST";
				document.body.appendChild(frm);
				frm.submit();
				document.body.removeChild(frm);
			},
			createFormField : function(element, type, name, value) {
				var inputField;
				inputField = document.createElement(element);
				inputField.type = type;
				inputField.name = name;
				inputField.value = value;
				return inputField;
			},
			onBoxReady : function(portlet) {
				portlet.getTargetEl().mask(label_map.loading);
			}
		});