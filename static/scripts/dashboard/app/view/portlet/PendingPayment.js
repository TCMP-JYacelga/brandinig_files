Ext.define('Cashweb.view.portlet.PendingPayment',{

	extend: 'Ext.panel.Panel',
	border : false,
	alias : 'widget.pending_pay',
	record : null,
	mask : null,
	taskRunner: null,
	handleRefresh: true,
	config : {
		layout: 'fit',
		listeners: {
			render: function(panel) {
				panel.onPortletRender();
			},
			afterrender: function(portlet) {
				if(portlet.record.get('refreshType') == "A") {
					portlet.handlePaymentsAutoRefresh(portlet.record);
				}
			}
		}
	},
	
	initComponent : function(){
		var thisClass = this;
		thisClass.setLoading({msg :label_map.loading});
		this.callParent(arguments);
	},
	onPortletRender: function() {
		this.add({html: '<div id="dataPipe" width="200" height="200"> </div>'});
		this.fireAjaxRequest();
	},
	fireAjaxRequest: function() {
		var thisClass = this;
		Ext.Ajax.request({
			url : './getPendingPayments.rest',
			 method : "POST",
			 success : function(response) {
				if(response.status == 200 && response.statusText == "OK") {
					var responseObj = Ext.decode(response.responseText);
					thisClass.showPendingPayments(responseObj.pendingStatus);
				}
			 },
			 failure : function(response) {
					
					thisClass.mask = new Ext.LoadMask(thisClass ,{msgCls:'error-msg'});
						
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
	showPendingPayments: function(data) {
		
		$("#dataPipe").glasspipe({headerData:[label_map.customer, label_map.bank, label_map.stopRequest], 
			pipeData: data, 
			pipeLabels: [label_map.repair, label_map.draft, label_map.verification, label_map.pendAuth, label_map.hold, label_map.send, label_map.bankRepair,
			             label_map.balVerify, label_map.pendPrint, label_map.liquidation, label_map.stopReqAuth, label_map.stopWithBank]});
		this.setLoading(false);
		this.doComponentLayout();
	},
	handlePaymentsAutoRefresh: function(record) {
		var portlet = this;
		var taskRunner = new Ext.util.TaskRunner();
		var task = taskRunner.newTask({
			run: function() {
				var dataNode = document.getElementById('dataPipe');
				if (dataNode) {
					dataNode.parentNode.removeChild(dataNode);
				}
				if(this.mask != null)
				{
					portlet.mask.hide();
					Ext.destroy(portlet.mask);
				}
				if(portlet.state != 'collapsed')
					portlet.setLoading({msg :label_map.loading});
				portlet.onPortletRender();
			},
			interval: record.get('refreshInterval') * 1000
		});
		task.start();
		this.taskRunner = taskRunner;
	},
	portletRefresh: function() {
		var dataNode = document.getElementById('dataPipe');
		if (dataNode) {
			dataNode.parentNode.removeChild(dataNode);
		}
		if(this.mask != null)
		{
			this.mask.hide();
			Ext.destroy(this.mask);
		}
		if(this.state != 'collapsed')
			this.setLoading({msg :label_map.loading});
		this.onPortletRender();
		
		
	}
});