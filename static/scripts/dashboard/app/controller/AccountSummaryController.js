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
				//render : this.onAccountSummaryPortletRender,
				//afterrender : this.afterAccountSummaryRender,
				//boxready : this.onBoxReady,
				seeMoreAccountRecords : this.seeMoreAccountRecords
			}
		});
	},
	onBoxReady : function(portlet) {
		portlet.getTargetEl().mask(label_map.loading);
	},
	onAccountSummaryPortletRender : function(component, eOpts) {
		this.getSummaryRefreshTool().on('click', this.portletRefresh, this);
		this.ajaxRequest();
	},
	afterAccountSummaryRender : function() {
		if (this.getSummaryRefreshTool().record.get('refreshType') == "A") {
			this.handleSummaryAutoRefresh(this.getSummaryRefreshTool().record);
		}
	},
	loadData : function(data) {
		var storeData = [];
		var arrData = data.summary;

		Ext.each(arrData, function(object, index) {
			var arrCol = object;
			var colJson = {};
			Ext.each(arrCol, function(colObj, colIndex) {
				colJson[colObj.columnName] = colObj.value;
			});
			storeData.push(colJson);
		});
		this.getSummaryPortlet().getStore().loadData(storeData);
		this.getSummaryPortlet().getTargetEl().unmask();
	},

	ajaxRequest : function() {
		var obj;
		var thisClass = this;
		Ext.Ajax.request({
			url : './getAccountSummaryWidgetData.rest',
			success : function(response) {
				obj = Ext.decode(response.responseText);
				thisClass.loadData(obj);
			},
			failure : function(response) {
				if (!Ext.isEmpty(thisClass.getSummaryPortlet())) {
					thisClass.getSummaryPortlet().getTargetEl().unmask();
				}
				var viewref = thisClass.getSummaryPortlet();
				thisClass.mask = new Ext.LoadMask(viewref, {
					msgCls : 'error-msg'
				});
				if (response.timedout) {
					thisClass.mask.msg = label_map.timeoutmsg;

				} else if (response.aborted) {
					thisClass.mask.msg = label_map.abortmsg;

				} else {
					if (response.status === 0) {
						thisClass.mask.msg = label_map.serverStopmsg;
					} else
						thisClass.mask.msg = response.statusText;

				}
				thisClass.mask.show();
			}
		});
	},

	portletRefresh : function() {
		if (this.mask != null) {
			this.mask.hide();
			Ext.destroy(this.mask);
		}
		this.getSummaryPortlet().getTargetEl().mask(label_map.loading);
		this.ajaxRequest();
	},
	handleSummaryAutoRefresh : function(record) {
		var portlet = this;
		var taskRunner = new Ext.util.TaskRunner();
		var task = taskRunner.newTask({
			run : portlet.portletRefresh,
			interval : record.get('refreshInterval') * 1000,
			scope : portlet
		});
		task.start();
		this.getSummaryPortlet().taskRunner = taskRunner;
	},
	seeMoreAccountRecords : function(strFilter, filterJson) {
				var me = this;
				var strUrl='';
				strUrl = 'btrSummaryIntraDayNewUX.form';
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