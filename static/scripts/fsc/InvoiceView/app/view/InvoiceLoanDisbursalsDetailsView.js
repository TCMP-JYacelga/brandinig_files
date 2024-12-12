Ext.define('GCP.view.InvoiceLoanDisbursalsDetailsView',{
	extend:'Ext.panel.Panel',
	requires : ['Ext.ux.gcp.SmartGrid', 'Ext.data.Store'],
	xtype:'poLineItemsGridView',
	
	initComponent : function(){
		var me = this;
		var strUrl = 'services/invoiceview/loanDisbursalDetails/('+viewState+')';
		 var loanDisbursalsSmartGrid = Ext.create('Ext.ux.gcp.SmartGrid',{
			 stateful : false,
				showEmptyRow : false,
				showCheckBoxColumn : false,
				hideRowNumbererColumn : true,
				cls : 't7-grid',
				padding : '0 10 0 10',
				minHeight : 0,
				showPager : true,
				pageSize : pageSize,
				columnModel : me.getColumnModel(),
				enableColumnAutoWidth : _blnGridAutoColumnWidth,
				enableColumnHeaderMenu : false,
				storeModel:{
				fields:['processedDate','expectedRepaymentDate','upfrontInterestDiducted','invoiceFinanceReferenceNumber','processedAmnt','requestedAmnt','rejectReason','settlementStatus','disbursementStatus'],
				proxyUrl:strUrl,
				rootNode:'d.loanRequestDetails',
				totalRowsNode :'d.count'
				
			},
			listeners:{
				render : function(grid) {
					me.handleLoadGridData(grid,
							grid.store.dataUrl, grid.pageSize,
							1, 1, null);
				},
				gridPageChange : me.handleLoadGridData,
				gridSortChange : me.handleLoadGridData
			}
			
	 });		
		me.items=[loanDisbursalsSmartGrid];
		
		me.on('resize',function(){
			me.doLayout();
		});
		
		me.callParent(arguments);
	},
	
	getColumnModel : function(){
		var me = this;
		var arrCols = new Array(), objCol = null, cfgCol = null;
		
		var arrColsPref = [{
			colType : 'emptyColumn',
			colId : 'emptyCol',
			colDesc : '',
			locked : true,
			resizable : false,
			draggable : false,
			width : 0.1,
			minWidth : 0.1
		},
		           {
					   "colId" : "invoiceFinanceReferenceNumber",
						"colDesc" : getLabel('reference', 'Reference'),
						"sortable" : false,
						"menuDisabled" : false
					   
				},
				{
					   "colId" : "processedAmnt",
						"colDesc" : getLabel('financeamount', 'Finance Amount'),
						"sortable" : false,
						"menuDisabled" : false
				},
				{
					   	"colId" : "requestedAmnt",
						"colDesc" : getLabel('requestedamount', 'Requested Amount'),
						"sortable" : false,
						"menuDisabled" : false
				},
				{
					   	"colId" : "rejectReason",
						"colDesc" : getLabel('rejectreason', 'Reject Reason'),
						"sortable" : false,
						"menuDisabled" : false
				},
				{
					   "colId" : "disbursementStatus",
						"colDesc" : getLabel('status', 'Status'),
						"sortable" : false,
						"menuDisabled" : false
				},
				{
					   "colId" : "processedDate",
						"colDesc" : getLabel('disburseddate', 'Disbursed Date'),
						"sortable" : false,
						"menuDisabled" : false
				},
				{
					   "colId" : "expectedRepaymentDate",
						"colDesc" : getLabel('loanduedate', 'Loan Due Date'),
						"sortable" : false,
						"menuDisabled" : false
				},
				{
					    "colId" : "upfrontInterestDiducted",
						"colDesc" : getLabel('upfrontdiducted', 'Upfront Interest Deducted'),
						"sortable" : false,
						"menuDisabled" : false
				}];
		          
				if (!Ext.isEmpty(arrColsPref)) {
					for (var i = 0; i < arrColsPref.length; i++) {
						objCol = arrColsPref[i];
						cfgCol = {};
						cfgCol.colHeader = objCol.colDesc;
						cfgCol.colId = objCol.colId;
						cfgCol.locked = Ext.isEmpty(objCol.locked) ? false : objCol.locked;
						cfgCol.resizable = Ext.isEmpty(objCol.resizable) ? true : objCol.resizable;
						cfgCol.draggable = Ext.isEmpty(objCol.draggable) ? true : objCol.draggable;
						
						if (!Ext.isEmpty(objCol.colType)) {
							cfgCol.colType = objCol.colType;
							if (cfgCol.colType === "number")
								cfgCol.align = 'right';
						}
		
						cfgCol.width = Ext.isEmpty(objCol.width) ? 120 : objCol.width;
						if(!Ext.isEmpty(objCol.minWidth)) {
							cfgCol.minWidth = objCol.minWidth;
						}
						cfgCol.fnColumnRenderer = me.columnRenderer;
						arrCols.push(cfgCol);
		
					}
				}
		return arrCols;
	},
	
	columnRenderer : function(value, meta, record, rowIndex, colIndex, store,view, colId){
		
		var strReturnValue = "";
		if(Ext.isEmpty(value)){
			strReturnValue =  strReturnValue;
		}else if((colId === "col_processedAmnt" ||colId === "col_requestedAmnt"|| colId === "col_upfrontInterestDiducted") && !Ext.isEmpty(value)){
			strReturnValue = currencyCode+" "+value;
		}else{
			strReturnValue = value;
		}
		
		return strReturnValue;
	},
	
	handleLoadGridData : function(grid, url, pgSize, newPgNo, oldPgNo, sorter) {
		var me = this;
		var strUrl = grid.generateUrl(url, pgSize, newPgNo, oldPgNo, sorter);
		strUrl = strUrl + '&$parentId='+ encodeURIComponent($('#viewState').val())+ '&$client=' +selectedClient;;
		grid.loadGridData(strUrl, null, null, false);

	}
});