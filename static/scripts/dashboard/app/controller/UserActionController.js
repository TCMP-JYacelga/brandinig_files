Ext.define('Cashweb.controller.UserActionController', {
	extend : 'Ext.app.Controller',
	xtype : 'userActionController',
	views : ['portlet.UserActionPortlet'],
	stores : ['UserActionStore'],
	models : ['UserActionModel'],
	mask:null,
	refs : [{
				ref : 'userActionPortlet',
				selector : 'usr_actions'
			}, {
				ref: 'userActionsRefreshTool',
				selector: 'portlet tool[itemId=usr_actions_refresh]'
			}],

	init : function() {
		this.control({
					'usr_actions' : {
						render : this.onUserActionPortletRender,
						afterrender: this.afterPortletRender,
						boxready: this.onBoxReady
					}
				});
	},
	onBoxReady: function(portlet) {
		portlet.getTargetEl().mask(label_map.loading);
	},
	onUserActionPortletRender : function(component, eOpts) {
		this.getUserActionsRefreshTool().on('click', this.portletRefresh, this);
		this.ajaxRequest();
	},
	afterPortletRender: function(portlet) {
		if(this.getUserActionsRefreshTool().record.get('refreshType') == "A") {
			this.handleUserActionsAutoRefresh(this.getUserActionsRefreshTool().record);
		}
	},

	loadData : function(data) {
		var storeData = [];
		storeData.push({
					actionName : 'Payments',
					actionCount : data.actionCount
				});
		this.getUserActionPortlet().getStore().loadData(storeData);
		this.getUserActionPortlet().getTargetEl().unmask();
	},

	ajaxRequest : function() {
		var obj;
		var thisClass = this;
		Ext.Ajax.request({
			 url : './getAwatingActions.rest',
			success : function(response) {
				obj = Ext.decode(response.responseText);
				thisClass.loadData(obj);
			},
			failure : function(response) {
				thisClass.getUserActionPortlet().getTargetEl().unmask();
				var viewref = thisClass.getUserActionPortlet();
				thisClass.mask = new Ext.LoadMask(viewref ,{msgCls:'error-msg'});	
				if (response.timedout) {
					thisClass.mask.msg=label_map.timeoutmsg;		
				} else if (response.aborted) {
					thisClass.mask.msg=label_map.abortmsg;
				} else {
					 if(response.status === 0)
					{
						thisClass.mask.msg=label_map.serverStopmsg;
					}
					else
					thisClass.mask.msg=response.statusText;
				}
				thisClass.mask.show();
			}
		});
	},
	
	portletRefresh: function() {
		if(this.mask != null)
		{
		this.mask.hide();
		Ext.destroy(this.mask);
		}
		this.getUserActionPortlet().getTargetEl().mask(label_map.loading);
		this.ajaxRequest();
	},
	handleUserActionsAutoRefresh: function(record) {
		var portlet = this;
		var taskRunner = new Ext.util.TaskRunner();
		var task = taskRunner.newTask({
			run: portlet.portletRefresh,
			interval: record.get('refreshInterval') * 1000,
			scope: portlet
		});
		task.start();
		this.getUserActionPortlet().taskRunner = taskRunner;
	}
});