Ext.define('GCP.view.ViewFieldDetailsGrid', {
	extend : 'Ext.grid.Panel',
	requires:['Ext.grid.column.Action'],
	xtype : 'viewFieldDetailsGrid',
	selType : 'rowmodel',
	config : {bankReportCode : null},
	itemId : "viewFieldDetailsGrid",
	padding : '10 0 0 0',
	autoHeight : true,
	minHeight : 200,
	height : 200,
	width : '100%',
	cls : 'xn-grid-cell-inner',
	initComponent : function() {
		var me = this; 
		var myStore = Ext.create('Ext.data.Store', {
			  fields:['description','fieldId','identifier'],
			     proxy: {
			         type: 'ajax',
					 url : 'cpon/clientServiceSetup/bankReportsFields.json?id='+ encodeURIComponent(parentkey)+'&$select='+me.bankReportCode,
			         reader: {
			             type: 'json',
						 root: 'd.accounts'
			         },
					 actionMethods:  {
							create: "POST", 
							read: "POST", 
							update: "POST", 
							destroy: "POST"
						} 
		
			     },
				 autoLoad: true
			 });
		me.store=myStore;
		this.columns = [{
			xtype : 'actioncolumn',
			width : 80,
			parent : this,
			align : 'center',
			sortable : false,
			items : [{
						iconCls : 'grid-row-delete-icon',
						tooltip : getLabel('delete', 'Delete'),
						handler: function(grid, rowIndex, colIndex) {
							if (!Ext.isEmpty(grid)) {
							var fieldGrid=grid;
							record = grid.getStore().getAt(rowIndex);
							var arrayJson = new Array();
							arrayJson.push({
											serialNo : grid.getStore().indexOf(record)
													+ 1,
											identifier : record.data.identifier,
											userMessage : parentkey
										});
							

							Ext.Ajax.request({
										url : 'cpon/clientBankReport/discard',
										method : 'POST',
										jsonData : Ext.encode(arrayJson),
										success : function(response) {
											// TODO : Action Result handling to be done here
											fieldGrid.getStore().reload();
										},
										failure : function() {
											var errMsg = "";
											Ext.MessageBox.show({
														title : getLabel(
																'instrumentErrorPopUpTitle',
																'Error'),
														msg : getLabel(
																'instrumentErrorPopUpMsg',
																'Error while fetching data..!'),
														buttons : Ext.MessageBox.OK,
														icon : Ext.MessageBox.ERROR
													});
										}
									});
							}	
							
						}
					}]

		}, {
			header : getLabel('fieldName', 'Field Name'),
			dataIndex : 'fieldId',
			width : 100
		}, {
			header : getLabel('fieldDescription', 'Field Description'),
			dataIndex : 'description',
			width : 130
		}];
		this.callParent(arguments);
	}
	
});