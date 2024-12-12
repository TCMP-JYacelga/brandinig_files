var INV_RECON_COLUMNS = [ {
	"colId" : "invoiceNumber",
	"colHeader" : getLabel('invoiceNumber', 'Invoice Number'),
	"sortable" : true,
	"colDesc" : getLabel('invoiceNumber', 'Invoice Number'),
	"colSequence" : 1,
	"width" : 170,
	"locked" : false,
	"hidden" : false,
	"hideable" : true
}, {
	"colId" : "invoiceDate",
	"colHeader" : getLabel('invoiceDate', 'Invoice Date'),
	"sortable" : true,
	"colDesc" : getLabel('invoiceDate', 'Invoice Date'),
	"colSequence" : 2,
	"width" : 170,
	"locked" : false,
	"hidden" : false,
	"hideable" : true
},{
	"colId" : "invoiceDueDate",
	"colHeader" : getLabel('invoiceDueDate', 'Invoice Due Date'),
	"sortable" : true,
	"colDesc" : getLabel('invoiceDueDate', 'Invoice Due Date'),
	"colSequence" : 3,
	"width" : 170,
	"locked" : false,
	"hidden" : false,
	"hideable" : true
},{
	"colId" : "invoiceAmount",
	"colHeader" : getLabel('invoiceAmount', 'Amount'),
	"sortable" : true,
	"colDesc" : getLabel('invoiceAmount', 'Amount'),
	"colSequence" : 3,
	"width" : 170,
	"locked" : false,
	"hidden" : false,
	"hideable" : true
}, {
	"colId" : "netAmount",
	"colHeader" : getLabel('netAmount', 'Net Receivable'),
	"sortable" : true,
	"colDesc" : getLabel('netAmount', 'Net Receivable'),
	"colSequence" : 4,
	"width" : 170,
	"locked" : false,
	"hidden" : false,
	"hideable" : true
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
},{
	"colId" : "buyerSeller",
	"colHeader" : getLabel('buyerSeller', 'Buyer'),
	"sortable" : true,
	"colDesc" : getLabel('buyerSeller', 'Buyer'),
	"colSequence" : 6,
	"width" : 170,
	"locked" : false,
	"hidden" : false,
	"hideable" : true
},{
	"colId" : "scmMyProductName",
	"colHeader" : getLabel('scmMyProductName', 'Package'),
	"sortable" : true,
	"colDesc" : getLabel('scmMyProductName', 'Package'),
	"colSequence" : 7,
	"width" : 170,
	"locked" : false,
	"hidden" : false,
	"hideable" : true
},{
	"colId" : "reconInvoiceState",
	"colHeader" : getLabel('reconInvoiceState', 'Status'),
	"sortable" : false,
	"colDesc" : getLabel('reconInvoiceState', 'Status'),
	"colSequence" : 8,
	"width" : 170,
	"locked" : false,
	"hidden" : false,
	"hideable" : true
}];
var arrStatus = 	[
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
	"desc": getLabel("seller","Seller")
  },
  {
	"code": "BUYER",
	"desc": getLabel("buyer","Buyer")
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
		title : getLabel('advancedFilter','Advanced Filter'),
		modal : true,
	open:function(){
      	  hideErrorPanel('#advancedFilterErrorDiv');
      	  var buyerSellerLbl = getLabel('buyer','Buyer'),buyerSellerPlaceholder = getLabel('searchbybuyer','Search By Buyer');
      	  if(selectedFilterLoggerDesc =='BUYER'){
      	  	 buyerSellerLbl=getLabel('seller','Seller'),buyerSellerPlaceholder=getLabel('searchbyeseller','Search By Seller');
      	  }
      	  $('#buyerSellerLbl').text(buyerSellerLbl);
      	  $('#dropdownClientCodeDescription').attr('placeholder',buyerSellerPlaceholder);
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

function hideErrorPanel(errorDivId){
	if($(errorDivId).is(':visible')){
		$(errorDivId).addClass('ui-helper-hidden');
	}
}