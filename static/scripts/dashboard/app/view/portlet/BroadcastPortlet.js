Ext.define('Cashweb.view.portlet.BroadcastPortlet', {
	extend : 'Ext.grid.Panel',
	alias : 'widget.broadcast',
	requires : ['Cashweb.store.BroadcastStore', 'Cashweb.view.portlet.BroadcastDetailsPopup'],
	emptyText : null,
	taskRunner: null,
	minHeight: 100,
	padding : '5 10 10 10',
	cls : 't7-grid',
	config : {
		viewConfig : {
			stripeRows : false
		}
	},
	initComponent : function() {
		this.store = new Cashweb.store.BroadcastStore();
		var thisClass = this;
		thisClass.emptyText = label_map.noDataFound;
		
		this.columns = [{
							header : '',
							dataIndex : 'urgent',
							align : 'left',
							width : 70,
							sortable : false,
							renderer : function(value, metaData, record, rowIndex, colIndex, store, view) 
							{
							    return '<a style="color:red">' + value + '</>';
							}
						}, {
							header : 'Date',
							dataIndex : 'feedDate',
							align : 'left',
							width : 100,
							sortable : false
						}, {
							header : 'Subject',
							dataIndex : 'title',
							align : 'left',
							flex : 2,
							sortable : false,						
							renderer : function(value, metaData, record, rowIndex, colIndex, store, view) 
							{	
								if (!Ext.isEmpty(record.data.docPath))
								{
									var htmlPathVal = record.data.docPath;									
						    	    return value + '&nbsp; <a class="ux_font-size14-normal button_underline" href="javascript:downloadView(\''+htmlPathVal+'\')">view</a>';
								}
						        else
								{
									var details = record.data.details;
									details = details.replace(/([']|\\)/g, "\\$1");
									var popupTitle = record.data.title+' , '+record.data.feedDate;
						    	    return value + '&nbsp; <a class="ux_font-size14-normal button_underline" href="javascript:showMsgPopup(\'' + popupTitle + '\', \'' + details + '\')";>view</a>';
								}
							}
					    }, {
							header : 'Message',
							dataIndex : 'details',
							align : 'left',
							flex : 2,
							sortable : false
					    }, {
							header : '',
							xtype : 'actioncolumn',
							align : 'right',
							width : 50,
							
							sortable : false,
							hideable : false,
							getClass : function(value, metaData, record, rowIndex, colIndex, store,	view) {
								if (!Ext.isEmpty(record.data.internalName))
									//return "grid-row-action-icon  downloadrep";
									return "grid-link-icon downloadrep ";
								else
									return "";
							},
							handler : function(grid, rowIndex,
									columnIndex, item, event, record) {
								if (!Ext.isEmpty(record.data.internalName))
								{
									downloadNewsAttachment('downloadNewsForm', 'downloadBroadcastpdf.form',
															rowIndex, grid.getStore().config.dashboardBroadcastViewState);
								}
								else {	
									
									//thisClass.showMessagePopup(record);
								}
							}
					} ];
		
		this.callParent();
	},
	showMessagePopup: function(record) {
		
		var msgPopup = Ext.create('Cashweb.view.portlet.BroadcastDetailsPopup', {
				title: record.data.title+' , '+record.data.feedDate,
				minHeight: 200,
				autoHeight: true,
				width: 500,
				resizable: false,
				recordDtl: record.data.details
			});
			msgPopup.show();
	}
});