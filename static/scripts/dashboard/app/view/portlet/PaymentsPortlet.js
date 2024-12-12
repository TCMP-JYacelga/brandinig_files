Ext.define('Cashweb.view.portlet.PaymentsPortlet',{

	extend: 'Ext.grid.Panel',
	border : false,
	padding : '0 0 0 5',
	emptyText: null,
	requires: ['Cashweb.model.PaymentsModel'],
	alias : 'widget.pay_last_5',
	record : null,
	mask : null,
	taskRunner: null,
	handleRefresh: true,
	minHeight: 150,
	config : {
		viewConfig : {
			stripeRows : false,
			loadMask: false
		},
		forceFit : true,
		store : null,
		listeners: {
			afterrender: function(portlet) {
				if(portlet.record.get('refreshType') == "A") {
					portlet.handlePaymentsAutoRefresh(portlet.record);
				}
			}
		}
	},
	
	initComponent : function(){
	var thisClass = this;
	thisClass.emptyText = label_map.noDataFound;
	thisClass.setLoading({msg :label_map.loading});
	
		this.columns = [{
			header : label_map.paymentdate,
			dataIndex : 'activationDate',
			xtype : 'datecolumn',
			format : serverdateFormat,
			sortable : false,
			hideable : false
		},{
			header : label_map.paymenttype,
			dataIndex : 'productType',
			sortable : false,
			hideable : false
		},
		{
			header : label_map.paymentreceiver,
			dataIndex : 'recieverName',
			sortable : false,
			hideable : false
		}, {
			header : label_map.paymentamount,
			dataIndex : 'amount',
			align:'right',
			sortable : false,
			hideable : false,
			renderer:function(value,meta,record,row,col){
				
				var newccy=record.data.currency;
				return newccy + " " +Ext.util.Format.number(value , '0,000.00')
			}
		}, {
			header : label_map.paymentstatus,
			dataIndex : 'actionStatus',
			sortable : false,
			hideable : false
		}];
		var store = Ext.create('Ext.data.Store',{
			autoLoad : true,
			model : 'Cashweb.model.PaymentsModel',
			proxy : {
				type : 'ajax',
				url : './services/payments.json?$top=5',
				reader : {
					type : 'json',
					root : 'd.instruments'
				},
				//after the request is successfully completed
				afterRequest: function() {
					thisClass.getTargetEl().unmask();
					
				},
				listeners: {
					exception: function( proxy, response, operation, eOpts) {
						var Msg = null;
						if(response.status === 0)
						{
							 Msg = label_map.serverStopmsg;
						}
						else
						{
							 Msg = response.statusText;
						}
						thisClass.mask = new Ext.LoadMask(thisClass ,{msg :Msg,msgCls:'error-msg'});
						thisClass.mask.show();
					}
				}
			},
			listeners: {
				beforeload: function() {
					if(thisClass.state != 'collapsed')
						thisClass.getTargetEl().mask(label_map.loading);
					//return true;
				}
			}
		});
		
		this.setStore(store);
		this.callParent(arguments);
	},
	handlePaymentsAutoRefresh: function(record) {
		var portlet = this;
		var taskRunner = new Ext.util.TaskRunner();
		var task = taskRunner.newTask({
			run: function() {
				if(portlet.mask != null)
				{
				portlet.mask.hide();
				portlet.mask.destroy();
				}
				portlet.getStore().reload();
			},
			interval: record.get('refreshInterval') * 1000
		});
		task.start();
		this.taskRunner = taskRunner;
	},
	portletRefresh: function() {
		if(this.mask != null)
		{
		this.mask.hide();
		this.mask.destroy(this);
		}
		this.getStore().reload();
	}
});