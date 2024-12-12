Ext.define('Cashweb.controller.TransactionsPortletController', {
	extend : 'Ext.app.Controller',
	views : ['portlet.TransactionsPortlet'],
	stores : ['TransactionsPortletStore'],
	models : ['TransactionsPortletModel'],
	mask : null,
	refs : [{
				ref : 'transactionsPortlet',
				selector : 'transactionsportlet'
			}, {
				ref : 'summaryRefreshTool',
				selector : 'portlet2 tool[itemId=transactionsportlet_refresh]'
			}, {
				ref : 'clientTextField',
				selector : 'portlet2 panel[itemId=transactionsportletSettingsPanel] textfield[itemId="Client"]'
			}],
	init : function() {
		var me = this;
		this.control({
					'transactionsportlet' : {
						// afterrender :
						// this.afterAccountSummaryRender,
						//boxready : this.onBoxReady,
						seeMoreBalanceRecords : this.seeMoreBalanceRecords
						// clientChange : this.setSelectedClient
					}
				});
	},
	seeMoreBalanceRecords : function(strFilter, filterJson) {
		var me = this;
		var strUrl = 'transactionSearch.srvc';
		var frm = document.createElement('FORM');
		if (!Ext.isEmpty(strFilter)) {
			frm.appendChild(me.createFormField('INPUT', 'HIDDEN', 'filterUrl',
					strFilter));
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
	},
	onBoxReady : function(portlet) {
		portlet.getTargetEl().mask(label_map.loading);
	},
	afterAccountSummaryRender : function() {
		if (this.getSummaryRefreshTool().record.get('refreshType') == "A") {
			this.handleSummaryAutoRefresh(this.getSummaryRefreshTool().record);
		}
	},

	portletRefresh : function() {
		if (this.mask != null) {
			this.mask.hide();
			Ext.destroy(this.mask);
		}
		this.gettransactionsPortlet().getTargetEl().mask(label_map.loading);
		this.ajaxRequest();
	},
	handleSummaryAutoRefresh : function(record) {
		var portlet = this;
		var taskRunner = new Ext.util.TaskRunner();
		var task = taskRunner.newTask({
					run : portlet.portletRefresh,
					interval : record.get('refreshInterval') * 100,
					scope : portlet
				});
		task.start();
		this.gettransactionsPortlet().taskRunner = taskRunner;
	}
});