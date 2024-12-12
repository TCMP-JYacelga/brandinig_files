Ext.define('Cashweb.controller.BalancesLineController', {
			extend : 'Ext.app.Controller',
			views : ['portlet.BalancesLine'],
			stores : ['BalancesLineStore'],
			models : ['BalancesLineModel'],
			mask : null,
			refs : [{
						ref : 'summaryPortlet',
						selector : 'balancesline'
					}],
			init : function() {
				var me = this;
				this.control({
							'balancesline' : {
								boxready : this.onBoxReady,
								seeMoreBalanceRecords : this.seeMoreBalanceRecords
							}
						});
			},
			seeMoreBalanceRecords : function(strFilter, filterJson) {
				var me = this;
				var strUrl = '';
				if (strFilter.indexOf('$summaryType=previousday') != -1)
					strUrl = 'btrSummaryPreviousday.form';
				else
					strUrl = 'btrSummaryIntraday.form';
				var frm = document.createElement('FORM');
				if (!Ext.isEmpty(strFilter)) {
					frm.appendChild(me.createFormField('INPUT', 'HIDDEN',
							'filterUrl', strFilter));
					frm.appendChild(me.createFormField('INPUT', 'HIDDEN',
							'filterJson', JSON.stringify(filterJson)));
				}
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
			},
			onBoxReady : function(portlet) {
				portlet.getTargetEl().mask(label_map.loading);
			}
		});