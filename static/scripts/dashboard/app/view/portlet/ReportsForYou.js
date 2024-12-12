Ext.define('Cashweb.view.portlet.ReportsForYou', {
	extend : 'Ext.grid.Panel',
	alias : 'widget.reportsforyou',
	requires : ['Cashweb.store.ReportsForYouStore'],
	border : false,
	padding : '5 10 10 10',
	emptyText : null,
	taskRunner : null,
	minHeight : 50,
	cls : 'widget-grid',
	config : {
		viewConfig : {
			stripeRows : false
		}
	},
	initComponent : function() {
		var thisClass = this;
		thisClass.emptyText = label_map.noDataFound;
		this.store = new Cashweb.store.ReportsForYouStore();
		this.columns = [{
			        header : label_map.reportDate,
					dataIndex : 'CREATED_DATE',
					sortable : false,
					hideable : false,
					flex : 23
				}, {
					header : label_map.reportname,
					dataIndex : 'SRC_NAME',
					sortable : false,
					hideable : false,
					flex : 23,
					renderer : function(value, meta, record, row, column, store) {
								return value +" "+ '<span style="color:blue" class="underlined cursor_pointer"> see </span>';
							
					}
				}, {
					header : label_map.reportParameters,
					dataIndex : 'REPORTPARAMETER',
					align : 'right',
					sortable : false,
					hideable : false,
					flex : 23
				}, {
					header : label_map.module,
					dataIndex : 'MODULENAME',
					align : 'right',
					sortable : false,
					hideable : false,
					flex : 23
				}];

		this.callParent();
	}
});