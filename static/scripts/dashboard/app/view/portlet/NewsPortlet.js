Ext.define('Cashweb.view.portlet.NewsPortlet', {
	extend : 'Ext.grid.Panel',
	alias : 'widget.newsfeed',
	requires : ['Cashweb.store.NewsStore', 'Cashweb.view.portlet.NewsDetailsPopup'],
	emptyText : null,
	//padding : '0 0 0 5',
	padding : '5 10 10 10',
	width : '100%',
	cls : 'ux_panel-transparent-background',
	taskRunner: null,
	minHeight: 100,
	config : {
		viewConfig : {
			stripeRows : false
		}
	},
	initComponent : function() {
		this.store = new Cashweb.store.NewsStore();
		var thisClass = this;
		thisClass.emptyText = label_map.noDataFound;
		
		this.columns = [{
					header : label_map.newsFeedTitle,
					dataIndex : 'title',
					align : 'left',
					flex : 2,
					sortable : false
				}, {
					header : label_map.newsLastGenerated,
					dataIndex : 'artifactDate',
					align : 'left',
					//width : 150,
					flex: 1,
					xtype : 'datecolumn',
					format : serverdateFormat,
					sortable : false,
					renderer: function(value,metaData,record) {
						var dateFormat = serverdateFormat+ " H:i:s";
						var artifactDate = Ext.Date.format(value, serverdateFormat);
						record.artifactDate = artifactDate;
						return artifactDate;
					}
				}, {
					header : label_map.newsFeedView,
					xtype : 'actioncolumn',
					align : 'right',
					sortable : false,
					hideable : false,
					flex: 1,
					getClass : function(value, metaData,
							record, rowIndex, colIndex, store,
							view) {
						if (!Ext.isEmpty(record.data.docPath))
							return "grid-row-action-icon downloadrep";
						else
							return "grid-link-icon viewlink cursor_pointer";
					},
					handler : function(grid, rowIndex,
							columnIndex, item, event, record) {
						if (!Ext.isEmpty(record.data.docPath))
							downloadNewsAttachment('downloadNewsForm', 'downloadNewsAttachment.form',
													rowIndex,
													grid.getStore().config.dashboardNewsViewState);
						else {
							thisClass.showMessagePopup(record);
						}
					}
				} ];
		
		this.callParent();
	},
	showMessagePopup: function(record) {
		var msgPopup = Ext.create('Cashweb.view.portlet.NewsDetailsPopup', {
				title: label_map.annoucementMsg,
				minHeight: 200,
				autoHeight: true,
				width: 500,
				resizable: false,
				record: record
			});
			msgPopup.show();
	}
});
