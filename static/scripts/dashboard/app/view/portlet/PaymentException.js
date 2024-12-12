Ext.define('Cashweb.view.portlet.PaymentException', {
	extend : 'Ext.grid.Panel',
	alias : 'widget.pay_excptn',
	padding : '0 0 0 5',
	emptyText : null,
	record : null,
	mask : null,
	taskRunner : null,
	disableSelection : true,
	handleRefresh : true,
	width : '100%',
	cls : 't7-grid',
	config : {
		viewConfig : {
			stripeRows : false,
			loadMask : false
		},
		store : null,
		listeners : {
			afterrender : function(portlet) {
				if (portlet.record.get('refreshType') == "A") {
					portlet.paymentexceptionAutoRefresh(portlet.record);
				}

			}
		}
	},
	hideHeaders : true,

	initComponent : function() {

		var thisClass = this;
		thisClass.emptyText = label_map.noDataFound;
		thisClass.setLoading({
			msg : label_map.loading
		});

		var store = Ext.create('Ext.data.Store', {
			fields : [ 'payException', 'instCount' ],
			autoLoad : true,
			proxy : {
				type : 'ajax',
				url : './getPaymentException.rest',
				reader : {
					type : 'json',
					root : 'paymentException'
				},
				// after the request is successfully completed
				afterRequest : function() {
					thisClass.setLoading(false);

				},
				listeners : {
					exception : function(proxy, response, operation, eOpts) {
						var message = null;
						if(response.status === 0)
						{
							 message = label_map.serverStopmsg;
						}
						else
						{
							 message = response.statusText;
						}
						thisClass.mask = new Ext.LoadMask(thisClass, {
							msg : message,
							msgCls : 'error-msg'
						});
						thisClass.mask.show();
					}
				}
			},
			listeners : {
				beforeload : function() {
					if (thisClass.state != 'collapsed')
						thisClass.setLoading({
							msg : label_map.loading
						});

				}
			}
		});

		this.columns = [ {

			dataIndex : 'payException',
			align : 'left',
			flex : 3

		}, {

			dataIndex : 'instCount',
			align : 'left',
			width : 300

		} ];

		this.setStore(store);
		this.callParent(arguments);
	},
	paymentexceptionAutoRefresh : function(record) {
		var me = this;
		var taskRunner = new Ext.util.TaskRunner();
		var task = taskRunner.newTask({
			run : function() {
				me.mask.hide();
				Ext.destroy(me.mask);
				me.getStore().reload();
			},
			interval : record.get('refreshInterval') * 1000
		});
		task.start();
		this.taskRunner = taskRunner;
	},
	portletRefresh : function() {
		if (this.mask != null) {
			this.mask.hide();
			Ext.destroy(this.mask);
		}
		this.getStore().reload();
	}
});