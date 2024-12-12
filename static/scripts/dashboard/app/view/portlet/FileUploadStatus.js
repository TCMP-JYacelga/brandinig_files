Ext.define('Cashweb.view.portlet.FileUploadStatus', {
	extend : 'Ext.grid.Panel',
	alias : 'widget.file_upld_st',
	border : false,
	requires: ['Cashweb.model.FileUploadStatusModel'],
	padding : '5 10 10 10',
	emptyText : null,
	mask : null,
	taskRunner: null,
	record : null,
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
					portlet.handleFileUploadAutoRefresh(portlet.record);
				}
			}
		}
	},
	initComponent : function() {
			var thisClass = this;
			thisClass.emptyText = label_map.noDataFound;
			thisClass.setLoading({msg :label_map.loading});
				
				this.columns = [{
					header : label_map.fileuploadname,
					dataIndex : 'fileName',
					sortable : false,
					hideable : false
				},{
					header : label_map.fileuploaddatetime,
					dataIndex : 'uploadDate',
					sortable : false,
					hideable : false
				},{
					header : label_map.fileuploadstatus,
					dataIndex : 'status',
					sortable : false,
					hideable : false
				}];
				var store = Ext.create('Ext.data.Store',{
					autoLoad : true,
					model : 'Cashweb.model.FileUploadStatusModel',
					proxy : {
						type : 'ajax',
						url : './getFileUploadStatus.rest',
						reader : {
							type : 'json',
							root : 'uploadStatus'
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
	handleFileUploadAutoRefresh: function(record) {
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