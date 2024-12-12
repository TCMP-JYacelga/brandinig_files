Ext.define('Cashweb.controller.MessageController', {
	extend : 'Ext.app.Controller',
	xtype : 'messageController',
	views : ['portlet.MessagePortlet'],
	stores : ['MessageStore'],
	models : ['MessageModel'],
	mask:null,
	refs : [{
				ref : 'messagePortlet',
				selector : 'alerts'
			}, {
				ref: 'messageRefreshTool',
				selector: 'portlet tool[itemId=alerts_refresh]'
			}],

	init : function() {
		this.control({
					'alerts' : {
						render : this.onMessagePortletRender,
						afterrender: this.afterMessageRender
					}
				});
	},
	onMessagePortletRender : function(component, eOpts) {
		this.getMessageRefreshTool().on('click', this.portletRefresh, this);
		this.getMessagePortlet().ownerCt.setLoading({msg :label_map.loading});
		this.ajaxRequest();
	},
	afterMessageRender: function() {
		if(this.getMessageRefreshTool().record.get('refreshType') == "A") {
			this.handleMessageAutoRefresh(this.getMessageRefreshTool().record);
		}
	},

	loadData : function(data) {
		this.getMessagePortlet().getStore().loadData(data.messages);
		this.getMessagePortlet().getStore().config.dashboardMessageViewState = data.messageViewstate;
		this.getMessagePortlet().ownerCt.setLoading(false);
	},

	ajaxRequest : function() {
		var obj;
		var thisClass = this;
		Ext.Ajax.request({
			 url : './getMyMessages.rest',
			success : function(response) {
				obj = Ext.decode(response.responseText);
				thisClass.loadData(obj);
			},
			failure : function(response) {
				thisClass.getMessagePortlet().ownerCt.setLoading(false);
				var viewref = thisClass.getMessagePortlet();
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
		
		this.getMessagePortlet().ownerCt.setLoading({msg :label_map.loading});
		this.ajaxRequest();
	},
	handleMessageAutoRefresh: function(record) {
		var portlet = this;
		var taskRunner = new Ext.util.TaskRunner();
		var task = taskRunner.newTask({
			run: portlet.portletRefresh,
			interval: record.get('refreshInterval') * 1000,
			scope: portlet
		});
		task.start();
		this.getMessagePortlet().taskRunner = taskRunner;
	}
});