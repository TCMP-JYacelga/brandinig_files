Ext.define('Cashweb.controller.UserActivityController', {
			extend : 'Ext.app.Controller',
			xtype : 'userActivityController',
			views : ['Cashweb.view.portlet.UserActivity'],
			stores : ['UserActivityStore'],
			models : ['UserActivityModel'],
			mask : null,
			refs : [{
						ref : 'userActivityPortlet',
						selector : 'useractivity'
					}],

			init : function() {
				this.control({
							'useractivity' : {
								'seeMoreRecords' : this.seeMoreRecords
							}
						});
			},
			seeMoreRecords : function(strFilter) {
				var me = this;
				var strUrl = 'userActivityList.srvc';
				var frm = document.createElement('FORM');
				if (!Ext.isEmpty(strFilter)) {
					frm.appendChild(me.createFormField('INPUT', 'HIDDEN',
							'filterUrl', strFilter));
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
			}
		});