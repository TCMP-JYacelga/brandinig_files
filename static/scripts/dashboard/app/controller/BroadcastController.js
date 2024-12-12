Ext.define('Cashweb.controller.BroadcastController', {
	extend : 'Ext.app.Controller',
	xtype : 'broadcastController',
	views : ['portlet.BroadcastPortlet'],
	stores : ['BroadcastStore'],
	models : ['BroadcastModel'],
	mask : null,
	refs : [{
				ref : 'broadcastPortlet',
				selector : 'broadcast'
			}, {
				ref: 'broadcastRefreshTool',
				selector: 'portlet tool[itemId=broadcast_refresh]'
			}],

	init : function() {
		this.control({
					'broadcast' : {
						render : this.onBroadcastPortletRender,
						afterrender: this.afterBroadcastRender,
						boxready: this.onBoxReady
					}
				});
	},
	onBoxReady: function(portlet) {
		portlet.getTargetEl().mask(label_map.loading);
	},
	onBroadcastPortletRender : function(component, eOpts) {
		this.getBroadcastRefreshTool().on('click', this.broadcastRefresh, this);
		this.ajaxRequest();
	},
	afterBroadcastRender: function() {
		if(this.getBroadcastRefreshTool().record.get('refreshType') == "A") {
			this.handleBroadcastAutoRefresh(this.getBroadcastRefreshTool().record);
		}
	},

	loadData : function(data) {
		broadCastPortletRef = this.getBroadcastPortlet();
	    this.getBroadcastPortlet().getStore().config.dashboardBroadcastViewState = data.broadcastViewState;
		this.getBroadcastPortlet().getStore().loadData(data.broadcast);
		this.getBroadcastPortlet().getTargetEl().unmask();
	},

	ajaxRequest : function() {
		var obj;
		var thisClass = this;
		
		Ext.Ajax.request({
			 url : './getBroadcastMsg.rest',
			 success : function(response) {
				obj = Ext.decode(response.responseText);
				obj = thisClass.doEscapeHtmlJSONValues(obj);
				thisClass.loadData(obj);
			},
			failure : function(response) {
				thisClass.getBroadcastPortlet().getTargetEl().unmask();
				var ref = thisClass.getBroadcastPortlet();
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
	broadcastRefresh: function() {
		if(this.mask != null)
		{
			this.mask.hide();
			Ext.destroy(this.mask);
		}
		this.getBroadcastPortlet().getTargetEl().mask(label_map.loading);
		this.ajaxRequest();
		
	},
	
	handleBroadcastAutoRefresh: function(record) {
		var portlet = this;
		var taskRunner = new Ext.util.TaskRunner();
		var task = taskRunner.newTask({
			run: portlet.broadcastRefresh,
			interval: record.get('refreshInterval') * 1000,
			scope: portlet
		});
		task.start();
		this.getBroadcastPortlet().taskRunner = taskRunner;
	},
	/**
		Modify the JSON values with Html Escape
	**/
	doEscapeHtmlJSONValues : function(sourceJSON) {
		var me = this;
		for (var i in sourceJSON) {
			if (typeof sourceJSON[i] === 'object') {
				me.doEscapeHtmlJSONValues(sourceJSON[i]);
			} else if(typeof sourceJSON[i] === 'string') {
				sourceJSON[i] = Ext.util.Format.htmlEncode(sourceJSON[i]);
			}
		}
		return sourceJSON;
	}
});
var broadCastPortletRef;
function downloadView(htmlUrl)
{
	if(!Ext.isEmpty(broadCastPortletRef)) 
	{
		downloadBroadcastMessage(htmlUrl);
	}
}

function showMsgPopup(popupTitle, details) {
	var msgPopup = Ext.create('Cashweb.view.portlet.BroadcastDetailsPopup', {
		title: popupTitle,
		minHeight: 200,
		autoHeight: true,
		width: 500,
		resizable: false,
		recordDtl: details
	});
	msgPopup.show();		
}