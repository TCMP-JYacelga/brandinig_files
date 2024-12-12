Ext.define('Cashweb.view.portlet.RSSFeedsPortlet', {
	extend : 'Ext.grid.Panel',
	alias : 'widget.rss_widget',
	requires : ['Cashweb.store.RSSFeedStore'],
	border : false,
	padding : '5 10 10 10',
	emptyText : null,
	mask : null,
	taskRunner: null,
	minHeight: 150,
	handleRefresh: true,
	config :{
		viewConfig : {
			stripeRows : false,
			loadMask: false
		},
		listeners: {
			afterrender: function(portlet) {
				if(portlet.record.get('refreshType') == "A") {
					portlet.handleRSSAutoRefresh(portlet.record);
				}
			}
		}
	},
	hideHeaders : true,
	
	initComponent : function() {
		var thisClass = this;
		thisClass.emptyText = label_map.noDataFound;
		thisClass.setLoading({msg :label_map.loading});
		this.store = new Cashweb.store.RSSFeedStore({
			proxy: {
		        type: 'ajax',
		        url : 'static/scripts/dashboard/data/xml/RSSFeeds.xml',
		        reader: {
		        	 type : 'xml',
		        	 record: 'item',
		        	 root: 'channel'
		        },
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
						thisClass.getTargetEl().unmask();
						thisClass.mask = new Ext.LoadMask(thisClass ,{msg :Msg,msgCls:'error-msg'});
						thisClass.mask.show();
					}
				}
		    }
			
		});

	this.columns = [{
		dataIndex : 'title',
		menuDisabled : true,
		flex: 1,
		renderer : function(value, metadata, record, rowIndex, colIndex, store) {
			return '<div class="RSS-feed-title ux_font-size14-normal" ><a class="button_underline ux_font-size14-normal" target="_blank" href="' + record.data.link + '">' + value + '</a><br>' + record.data.description + '</div>';
		}
	}];
		
		this.callParent(arguments);
	},
	
	handleRSSAutoRefresh: function(record) {
		var portlet = this;
		var taskRunner = new Ext.util.TaskRunner();
		var task = taskRunner.newTask({
			run: function() {
				if(portlet.state != 'collapsed')
					portlet.getTargetEl().mask(label_map.loading);
				if(portlet.mask != null)
				{
				portlet.mask.hide();
				Ext.destroy(portlet.mask);
				}
				portlet.getStore().reload();
			},
			interval: record.get('refreshInterval') * 1000
		});
		task.start();
		this.taskRunner = taskRunner;
	},
	portletRefresh: function() {
		var thisClass = this;
		if(this.mask != null)
		{
		thisClass.mask.hide();
		Ext.destroy(this.mask);
		}
		this.getStore().reload();
	}
});
