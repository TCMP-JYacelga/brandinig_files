Ext.define('Cashweb.view.portlet.UserActivity', {
	extend : 'Ext.grid.Panel',
	alias : 'widget.useractivity',
	requires : ['Cashweb.store.UserActivityStore'],
	border : false,
	padding : '5 10 10 10',
	emptyText : null,
	taskRunner : null,
	minHeight : 50,
	config : {
		viewConfig : {
			stripeRows : false
		}
	},
	initComponent : function() {
		var thisClass = this;
		thisClass.emptyText = label_map.noDataFound;
		this.store = new Cashweb.store.UserActivityStore();
		this.columns = [{
					header : 'Users',
					dataIndex : 'USRDESCRIPTION',
					sortable : false,
					hideable : false,
					width : 200,
					renderer : function(value, meta, record, row, column, store) {
						if (!Ext.isEmpty(record.data.USRDESCRIPTION))
							return record.data.USRDESCRIPTION;
					}
				}, {
					header : "#",
					dataIndex : 'TOTAL_LOGIN',
					sortable : false,
					align : 'right',
					width : 80,
					hideable : false,
					renderer : function(value, meta, record, row, column, store) {
						if (!Ext.isEmpty(record.data.TOTAL_LOGIN))
							return record.data.TOTAL_LOGIN;
					}
				}, {
					header :'Last Login',
					dataIndex : 'LAST_LOGIN',
					align : 'left',
					sortable : false,
					width : 200,
					hideable : false,
					renderer : function(value, meta, record, row, column, store) {
						var login = record.data.LAST_LOGIN;
						return login;
					}
				}];

		this.callParent();
	}
});