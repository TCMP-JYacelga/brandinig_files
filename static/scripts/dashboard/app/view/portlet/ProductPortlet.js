Ext.define('Cashweb.view.portlet.ProductPortlet', {
	extend : 'Ext.grid.Panel',
	alias : 'widget.pay_product',
	emptyText: null,
	padding : '0 0 0 5',
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
		store : null,
		listeners: {
			afterrender: function(portlet) {
				if(portlet.record.get('refreshType') == "A") {
					portlet.handlePaymentsAutoRefresh(portlet.record);
				}
			}
		}
	},
	initComponent : function() {
		
		var thisClass = this;
		thisClass.emptyText = label_map.noDataFound;
		thisClass.setLoading({msg :label_map.loading});
	
		var store = Ext.create('Ext.data.Store', {
			fields: ['productDescription', 'lastQuarterInst', 'currentQuarterInst'],
			autoLoad: true,
			proxy: {
				type : 'ajax',
				url : './getTopFiveProductInfo.rest',
				reader : {
					type : 'json',
					root : 'paymentProduct'
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
		
		this.columns = [{
					header : label_map.product ,
					dataIndex : 'productDescription',
					align : 'left',
					flex : 3,
					sortable : false,
					hideable : false
				}, {
					header : label_map.lastquarter,
					dataIndex : 'lastQuarterInst',
					align : 'left',
					width : 150,
					sortable : false,
					hideable : false
				}, {
					header : label_map.currentquarter,
					dataIndex : 'currentQuarterInst',
					align : 'left',
					width : 150,
					sortable : false,
					hideable : false
					}
				];
		this.setStore(store);
		this.callParent();
	},
	handlePaymentsAutoRefresh: function(record) {
		var portlet = this;
		var taskRunner = new Ext.util.TaskRunner();
		var task = taskRunner.newTask({
			run: function() {
				portlet.mask.hide();
				Ext.destroy(portlet.mask);
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
		Ext.destroy(this.mask);
		}
		this.getStore().reload();
	}
});
