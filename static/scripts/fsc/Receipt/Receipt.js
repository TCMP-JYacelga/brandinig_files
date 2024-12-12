var RECEIPT_COLUMNS = [ {
	"colId" : "receiptReferenceNumber",
	"colHeader" : getLabel('recNo', 'Receipt Number'),
	"sortable" : true,
	"colDesc" : getLabel('recNo', 'Receipt Number'),
	"colSequence" : 1,
	"width" : 170,
	"locked" : false,
	"hidden" : false,
	"hideable" : true
}, {
	"colId" : "receiptDate",
	"colHeader" : getLabel('recDate', 'Receipt Date'),
	"sortable" : true,
	"colDesc" : getLabel('recDate', 'Receipt Date'),
	"colSequence" : 2,
	"width" : 170,
	"locked" : false,
	"hidden" : false,
	"hideable" : true
}, {
	"colId" : "receiptAmount",
	"colHeader" : getLabel('recAmount', 'Amount'),
	"sortable" : true,
	"colDesc" : getLabel('recAmount', 'Amount'),
	"colSequence" : 3,
	"width" : 170,
	"locked" : false,
	"hidden" : false,
	"hideable" : true
}, {
	"colId" : "reconcilableAmount",
	"colHeader" : getLabel("reconcilable", "Reconcilable"),
	"sortable" : true,
	"colDesc" : getLabel("reconcilable", "Reconcilable"),
	"colSequence" : 4,
	"width" : 170,
	"hidden" : false,
	"hideable" : true,
	"locked" : false
}, {
	"colId" : "clientDescription",
	"colHeader" : getLabel('lblcompany', 'Company Name'),
	"sortable" : true,
	"colDesc" : getLabel('lblcompany', 'Company Name'),
	"colSequence" : 5,
	"width" : 170,
	"locked" : false,
	"hidden" : false,
	"hideable" : true
}, {
	"colId" : "buyerSellerDesc",
	"colHeader" : getLabel('buyer', 'Buyer'),
	"sortable" : true,
	"colDesc" : getLabel('buyer', 'Buyer'),
	"colSequence" : 6,
	"width" : 170,
	"locked" : false,
	"hidden" : false,
	"hideable" : true
}, {
	"colId" : "liquidationState",
	"colHeader" : getLabel('clearingStatus', 'Clearing Status'),
	"sortable" : true,
	"colDesc" : getLabel('clearingStatus', 'Clearing Status'),
	"colSequence" : 7,
	"width" : 170,
	"locked" : false,
	"hidden" : false,
	"hideable" : true
}, {
	"colId" : "reconReceiptState",
	"colHeader" : getLabel('recStatus', 'Status'),
	"sortable" : false,
	"colDesc" : getLabel('recStatus', 'Status'),
	"colSequence" : 8,
	"width" : 170,
	"locked" : false,
	"hidden" : false,
	"hideable" : true
}];

var arrLiquidationStatus = 	[
                	  {
                		"code": "O",
                		"desc": getLabel("open","Open")
                	  },
					  {
                		"code": "P",
                		"desc": getLabel("paid","Paid")
                	  },
                	  {
                		"code": "R",
                		"desc": getLabel("return","Return")
                	  }
                	];
var arrSellerBuyer = [{
		"code": "SELLER",
		"desc": getLabel("sellerdrpdwn", "Seller")
	  },
	  {
		"code": "BUYER",
		"desc": getLabel("buyerdrpdwn", "Buyer")
	  }];
function getAdvancedFilterPopup(strUrl, frmId) {
	$('#advancedFilterPopup').dialog({
		autoOpen : false,
		maxHeight: 580,
		minHeight: (screen.width) > 1024 ? 156 : 0 ,
		width : 840,
		dialogClass: 'ft-dialog',
		resizable: false,
		draggable: false,
		title : getLabel("advancedFilter","Advanced Filter"),
		modal : true,
	open:function(){
      	  hideErrorPanel('#advancedFilterErrorDiv');
      	  $('#advancedFilterPopup').dialog('option', 'position', 'center');
      },
	  focus :function(){
			/* if(!isEmpty(selectedClient))
				$("#msClient").val(selectedClient); */
	  },
	  close : function(){
	  }
	});
	$('#advancedFilterPopup').dialog("open");

}