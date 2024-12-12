Ext.define('Cashweb.controller.PaymentVolumeController', {
			extend : 'Ext.app.Controller',
			views : ['portlet.PaymentVolume'],
			mask : null,
			refs : [],
			config : {},
			init : function() {
				var me = this;
				this.control({
							'paymentvolume' : {
								boxready : this.onBoxReady,
								navigateToPayments : this.navigateToPayments
							}
						});
			},
			navigateToPayments : function(strFilter, filterJson) {
				var me = this;
				var strUrl = 'paymentSummary.form';
				var frm = document.createElement('FORM');
				if (!Ext.isEmpty(strFilter)) {
					frm.appendChild(me.createFormField('INPUT', 'HIDDEN',
							'filterUrl', strFilter));
					frm.appendChild(me.createFormField('INPUT', 'HIDDEN', 'filterJson',
							JSON.stringify(filterJson)));
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