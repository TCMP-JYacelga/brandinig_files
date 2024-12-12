Ext.define('Cashweb.controller.PaymentsTrendController', {
			extend : 'Ext.app.Controller',
			views : ['portlet.PaymentsTrend'],
			stores : ['PaymentsTrendStore'],
			models : ['PaymentsTrendModel'],
			mask : null,
			refs : [],
			config : {},
			init : function() {
				var me = this;
				this.control({
							'paymentstrend' : {
								boxready : this.onBoxReady,
								//navigateToPayments : this.navigateToPayments
							}
						});
			},
			navigateToPayments : function(strFilter, filterJson) {
				var me = this;
				var strUrl = 'paymentSummary.form';
				var commaSeparetedStatus = '8,14,15,41';
				var commaSeparatedstatusDesc = "Deleted,Debited,Paid,Returned";
				var frm = document.createElement('FORM');
				//Status Filter
				filterJson.push({
					paramName : getLabel('ActionStatus', 'ActionStatus'),
					paramValue1 : commaSeparetedStatus,
					operatorValue : 'in',
					dataType : 'S',
					paramFieldLable : getLabel('lblStatus', 'Status'),
					field : getLabel('lblStatus', 'Status'),
					displayType : 5,
					displayValue1 : commaSeparatedstatusDesc
				});	
				if (!Ext.isEmpty(strFilter)) {
					frm.appendChild(me.createFormField('INPUT', 'HIDDEN',
							'filterUrl', strFilter));
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