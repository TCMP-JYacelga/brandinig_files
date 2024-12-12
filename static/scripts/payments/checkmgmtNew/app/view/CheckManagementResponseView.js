Ext.define('GCP.view.CheckManagementResponseView', {
	extend : 'Ext.grid.Panel',
	xtype : 'checkManagementResponseView',
	selType : 'rowmodel',
	padding : '10 0 0 0',
	autoScroll:true,
	minHeight:50,
	height : 300,
	cls : 'xn-grid-cell-inner',
	width : '100%',
	initComponent : function() {
		var me = this;
		this.columns = [{
			header : getLabel('lblreference', 'Reference'),
			dataIndex : 'reference',
			width : 100
		}, {
			header : getLabel('lblchecknum', 'Check No.'),
			dataIndex : 'checkNmbrFrom',
			width : 80
		}, {
			header : getLabel('lblchkdate', 'Check Date'),
			dataIndex : 'checkDate',
			width : 80
		}, {
			header : getLabel('lblamount', 'Amount'),
			dataIndex : 'amount',
			width : 80
		}, {
			header : getLabel('lblpayee', 'Payee'),
			dataIndex : 'payee',
			width : 100
		}, {
			header : getLabel('lbltrakingnumber', 'Traking Number'),
			dataIndex : 'trakingNumber',
			width : 90
		}, {
			header : getLabel('lblhostmessage', 'Host Message'),
			dataIndex : 'hostMessage',
			width : 200
		},{
			header : getLabel('lblstatus', 'Status'),
			dataIndex : 'status',
			width : 80
		}]
		
		this.callParent(arguments);
	},
	loadRawData : function(data, append) {
		var me=this;
		var objStore = me.store;
		result = objStore.proxy.reader.read(data), records = result.records;
		if (result.success) {
			objStore.currentPage = objStore.currentPage === 0
					? 1
					: objStore.currentPage;
			objStore.totalCount = result.total;
			objStore.loadRecords(records, append
							? objStore.addRecordsOptions
							: undefined);
			objStore.fireEvent('load', objStore, records, true);
		}
	}
});