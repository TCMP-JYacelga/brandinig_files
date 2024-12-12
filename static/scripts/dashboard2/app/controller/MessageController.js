Ext.define('Cashweb.controller.MessageController', {
	extend : 'Ext.app.Controller',
	xtype : 'messageController',
	views : [ 'portlet.MessagePortlet' ],
	stores : [ 'MessageStore' ],
	models : [ 'MessageModel' ],
	mask : null,
	refs : [ {
		ref : 'messagePortlet',
		selector : 'alerts'
	}, {
		ref : 'messageRefreshTool',
		selector : 'portlet2 tool[itemId=alerts_refresh]'
	} ],

	init : function() {
		this.control({
					'alerts' : {
						navigateToAlert : this.navigateToAlert
					}
				});
	},
	
	navigateToAlert : function(strFilter, filterJson) {
		var me = this;
		var strUrl = 'inboxAlertCenter.srvc';
		var frm = document.createElement('FORM');
		if (!Ext.isEmpty(strFilter)) {
			frm.appendChild(me.createFormField('INPUT', 'HIDDEN', 'filterUrl',
					strFilter));
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

	portletRefresh : function() {
		if (this.mask != null) {
			this.mask.hide();
			Ext.destroy(this.mask);
		}

		this.agePortlet().ownerCt.setLoading({
			msg : label_map.loading
		});
		this.ajaxRequest();
	},
	handleMessageAutoRefresh : function(record) {
		var portlet = this;
		var taskRunner = new Ext.util.TaskRunner();
		var task = taskRunner.newTask({
			run : portlet.portletRefresh,
			interval : record.get('refreshInterval') * 1000,
			scope : portlet
		});
		task.start();
		this.agePortlet().taskRunner = taskRunner;
	}
});