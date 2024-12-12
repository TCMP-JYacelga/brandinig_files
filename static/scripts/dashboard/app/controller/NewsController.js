Ext.define('Cashweb.controller.NewsController', {
	extend : 'Ext.app.Controller',
	xtype : 'newsController',
	views : ['portlet.NewsPortlet'],
	stores : ['NewsStore'],
	models : ['NewsModel'],
	mask : null,
	refs : [{
				ref : 'newsPortlet',
				selector : 'newsfeed'
			}, {
				ref: 'newsRefreshTool',
				selector: 'portlet tool[itemId=newsfeed_refresh]'
			}],

	init : function() {
		this.control({
					'newsfeed' : {
						render : this.onNewsPortletRender,
						afterrender: this.afterNewsRender,
						boxready: this.onBoxReady
					}
				});
	},
	onBoxReady: function(portlet) {
		portlet.getTargetEl().mask(label_map.loading);
	},
	onNewsPortletRender : function(component, eOpts) {
		this.getNewsRefreshTool().on('click', this.portletRefresh, this);
		this.ajaxRequest();
	},
	afterNewsRender: function() {
		if(this.getNewsRefreshTool().record.get('refreshType') == "A") {
			this.handleNewsAutoRefresh(this.getNewsRefreshTool().record);
		}
	},

	loadData : function(data) {
		this.getNewsPortlet().getStore().loadData(data.news);
		this.getNewsPortlet().getStore().config.dashboardNewsViewState = data.newsViewState;
		this.getNewsPortlet().getTargetEl().unmask();
	},

	ajaxRequest : function() {
		var obj;
		var thisClass = this;
		
		Ext.Ajax.request({
			 url : './getNewsFeeds.rest',
			 success : function(response) {
				obj = Ext.decode(response.responseText);
				thisClass.loadData(obj);
			},
			failure : function(response) {
				thisClass.getNewsPortlet().getTargetEl().unmask();
				var ref = thisClass.getNewsPortlet();
					thisClass.mask = new Ext.LoadMask(ref ,{msgCls:'error-msg'});
					
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
		this.getNewsPortlet().getTargetEl().mask(label_map.loading);
		this.ajaxRequest();
		
	},
	
	handleNewsAutoRefresh: function(record) {
		var portlet = this;
		var taskRunner = new Ext.util.TaskRunner();
		var task = taskRunner.newTask({
			run: portlet.portletRefresh,
			interval: record.get('refreshInterval') * 1000,
			scope: portlet
		});
		task.start();
		this.getNewsPortlet().taskRunner = taskRunner;
	}
});