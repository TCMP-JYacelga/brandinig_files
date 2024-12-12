Ext.define('Cashweb.controller.CashPositionStaticController', {
			extend : 'Ext.app.Controller',
			xtype : 'cashPositionStaticController',
			views : ['portlet.CashPositionStatic'],
			stores : ['CashPositionStaticStore'],
			models : ['CashPositionStaticModel'],
			mask : null,
			refs : [{
						ref : 'summaryPortlet',
						selector : 'cashpositionstatic'
					}],

			init : function() {
				this.control({
							'cashpositionstatic' : {
								seeMoreAccountRecords : this.seeMoreAccountRecords
							}
						});
			},
			seeMoreAccountRecords : function() {
				var me = this;
				var strUrl = '';
				strUrl = 'cashPositionTxnCenter.form';
				var frm = document.createElement('FORM');
				frm.appendChild(me.createFormField('INPUT', 'HIDDEN',
						csrfTokenName, tokVal));
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
			}
		});