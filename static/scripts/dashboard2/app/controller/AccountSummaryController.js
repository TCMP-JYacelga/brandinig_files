Ext.define('Cashweb.controller.AccountSummaryController', {
	extend : 'Ext.app.Controller',
	xtype : 'accountSummaryController',
	views : [ 'portlet.AccountSummary' ],
	stores : [ 'AccountSummaryStore' ],
	models : [ 'AccountSummaryModel' ],
	mask : null,
	refs : [ {
		ref : 'summaryPortlet',
		selector : 'accountsummary'
	}, {
		ref : 'summaryRefreshTool',
		selector : 'portlet tool[itemId=accountsummary_refresh]'
	} ],

	init : function() {
		this.control({
			'accountsummary' : {
				seeMoreAccountRecords : this.seeMoreAccountRecords
			}
		});
	},
	seeMoreAccountRecords : function(strFilter, filterJson) {
				var me = this;
				var strUrl='';
				strUrl = 'btrSummaryIntraday.form';
				var frm = document.createElement('FORM');
				if (!Ext.isEmpty(strFilter)) {
					frm.appendChild(me.createFormField('INPUT', 'HIDDEN',
							'filterUrl', strFilter));
					frm.appendChild(me.createFormField('INPUT', 'HIDDEN', 'filterJson',
							JSON.stringify(filterJson)));
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
			}
});