/**
 * @class GCP.view.PipeLineView
 * @extends Ext.panel.Panel
 * @author Vinay Thube
 */
Ext.define('GCP.view.PipeLineView', {
	extend : 'Ext.panel.Panel',
	border : false,
	xtype : 'pipeLineView',
	record : null,
	mask : null,
	handleRefresh : true,
	collapsible : true,
	collapseFirst : true,
	cls : 'xn-panel ux_header-no-title-border',
	collapsed : true,
	title : getLabel('paymentsPipeline', 'Payments Pipeline'),
	config : {
		listeners : {
			afterrender : function(panel) {
				panel.onPortletRender();
			}
		}
	},

	initComponent : function() {
		var me = this;
		me.setLoading({
					msg : label_map.loading
				});

		this.callParent(arguments);
	},
	onPortletRender : function() {
		var strHtml = Ext.String
				.format(
						'<div id="datapipe_{0}" class="extrapadding" width="180" height="200"> </div>',
						this.itemId)
		this.update(strHtml);
		this.fireAjaxRequest();
	},
	fireAjaxRequest : function() {
		var me = this;
		Ext.Ajax.request({
					url : './getPendingPayments.rest',
					method : "POST",
					success : function(response) {
						if (response.status == 200
								&& response.statusText == "OK") {
							var responseObj = Ext.decode(response.responseText);
							if(!Ext.isEmpty(responseObj.pendingStatus))
							me.showPendingPayments(responseObj.pendingStatus);
						}
					},
					failure : function(response) {
						me.mask = new Ext.LoadMask(me, {
									msgCls : 'error-msg'
								});
						if (response.timedout) {
							me.mask.msg = label_map.timeoutmsg;

						} else if (response.aborted) {
							me.mask.msg = label_map.abortmsg;
						} else {

							if (response.status === 0) {
								me.mask.msg = label_map.serverStopmsg;
							} else
								me.mask.msg = response.statusText;

						}
						me.mask.show();
					}
				});

	},
	showPendingPayments : function(data) {
		var me = this;
		var divId = Ext.String.format('datapipe_{0}', me.itemId)
		$("#" + divId).glasspipe({
			headerData : [label_map.customer, label_map.bank,
					label_map.stopRequest],
			pipeData : data,
			pipeLabels : [label_map.repair, label_map.draft,
					label_map.verification, label_map.pendAuth, label_map.hold,
					label_map.send, label_map.bankRepair, label_map.balVerify,
					label_map.pendPrint, label_map.liquidation,
					label_map.stopReqAuth, label_map.stopWithBank]
		});
		me.setLoading(false);
		me.doComponentLayout();
	}
});