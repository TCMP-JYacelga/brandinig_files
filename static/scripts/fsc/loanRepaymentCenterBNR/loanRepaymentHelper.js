var LOAN_REPAYMENT_CENTER_COLUMNS = [{
	"colId" : "clientDescription",
	"colHeader" : getLabel('companyName', 'Company Name'),
	"sortable" : true,
	"colDesc" : getLabel('companyName', 'Company Name'),
	"colSequence" : 1,
	"width" : 150,
	"locked" : false,
	"hidden" : false,
	"hideable" : true
},{
	"colId" : "loanReference",
	"colHeader" : getLabel('loanReference', 'Loan Reference'),
	"sortable" : true,
	"colDesc" : getLabel('loanReference', 'Loan Reference'),
	"colSequence" : 2,
	"width" : 150,
	"locked" : false,
	"hidden" : false,
	"hideable" : false
}, {
	"colId" : "invoiceReference",
	"colHeader" : getLabel('invoiceReference', 'Document Reference'),
	"sortable" : true,
	"colDesc" : getLabel('invoiceReference', 'Document Reference'),
	"colSequence" : 3,
	"width" : 100,
	"locked" : false,
	"hidden" : false,
	"hideable" : true
}, {
	"colId" : "invoiceAmount",
	"colHeader" : getLabel('invoiceAmount', 'Amount'),
	"sortable" : true,
	"colDesc" : getLabel('invoiceAmount', 'Amount'),
	"colSequence" : 4,
	"width" : 100,
	"locked" : false,
	"hidden" : false,
	"hideable" : true,
	"colType" : 'amount'
}, {
	"colId" : "loanAmount",
	"colHeader" : getLabel('loanAmount', 'Loan Amount'),
	"sortable" : true,
	"colDesc" : getLabel('loanAmount', 'Loan Amount'),
	"colSequence" : 5,
	"width" : 105,
	"locked" : false,
	"hidden" : false,
	"hideable" : true,
	"colType" : 'amount'
}, {
	"colId" : "loanOutStandingAmount",
	"colHeader" : getLabel('loanOutStandingAmount', 'Loan O/S Amount'),
	"sortable" : true,
	"colDesc" : getLabel('loanOutStandingAmount', 'Loan O/S Amount'),
	"colSequence" : 6,
	"width" : 100,
	"locked" : false,
	"hidden" : false,
	"hideable" : true,
	"colType" : 'amount'
}, {
	"colId" : "loanDueDate",
	"colHeader" : getLabel('loanDueDate', 'Loan Due Date'),
	"sortable" : true,
	"colDesc" : getLabel('loanDueDate', 'Loan Due Date'),
	"colSequence" : 7,
	"width" : 90,
	"locked" : false,
	"hidden" : false,
	"hideable" : true
}, {
	"colId" : "buyerSeller",
	"colHeader" : getLabel('buyerSeller', 'Buyer'),
	"sortable" : false,
	"colDesc" : getLabel('buyerSeller', 'Buyer'),
	"colSequence" : 8,
	"width" : 150,
	"locked" : false,
	"hidden" : false,
	"hideable" : true
}, {
	"colId" : "scmMyProductName",
	"colHeader" : getLabel('scmMyProductName', 'Package'),
	"sortable" : false,
	"colDesc" : getLabel('scmMyProductName', 'Package'),
	"colSequence" : 9,
	"width" : 100,
	"locked" : false,
	"hidden" : false,
	"hideable" : true
}, {
	"colId" : "invoicePoFlag",
	"colHeader" : getLabel('documentType', 'Document Type'),
	"sortable" : false,
	"colDesc" : getLabel('documentType', 'Document Type'),
	"colSequence" : 10,
	"width" : 150,
	"locked" : false,
	"hidden" : false,
	"hideable" : true
}, {
	"colId" : "payments",
	"colHeader" : getLabel('status', 'Status'),
	"sortable" : false,
	"colDesc" : getLabel('status', 'Status'),
	"colSequence" : 11,
	"width" : 30,
	"locked" : false,
	"hidden" : false,
	"hideable" : true
}];

var arrLoanRepaymentStatus = [{
   		"code": "101",
   		"desc":getLabel('PaymentPending', 'Payment Pending') 
   	},{
   		"code": "102",
   		"desc":getLabel('PartiallyPaid', 'Partially Paid')
}];

var arrSellerBuyer = [{
	"code": "SELLER",
	"desc": getLabel('seller', 'Seller'),
  },{
	"code": "BUYER",
	"desc":getLabel('buyer', 'Buyer'), 
}];

function getAdvancedFilterQueryJson(){
	var objJson = null;
	var jsonArray = [];
	
	//Client
	var clientCodesData =$("select[id='msClient']").getMultiSelectValueString(); 	
	var tempCodesData = clientCodesData;
	var selClientDesc = selectedClientDesc;
	if (!Ext.isEmpty(tempCodesData)) {
		if(!Ext.isEmpty(filterClientCount)){
			var clientCodeArray=clientCodesData.split(',');
			if(filterClientCount==clientCodeArray.length)
				tempCodesData='all';
		}
		if(tempCodesData!='all' && selClientDesc != '' && selClientDesc != 'All companies'){
		jsonArray.push({
					field : 'Client',
					operator : tempCodesData.indexOf(',') === -1 ? 'eq' : 'in',
					value1 : encodeURIComponent(tempCodesData.replace(new RegExp("'", 'g'), "\''")),
					value2 : '',
					dataType : 0,
					displayType : tempCodesData.indexOf(',') === -1 ? 5 : 11,
					fieldLabel : getLabel('lblcompany', 'Company Name'),
					displayValue1 : selClientDesc
				});
		}
	}
	
	// Loan Reference
	var loanReferenceText = $("#txtLoanReference").val();
	if (!Ext.isEmpty(loanReferenceText)) {
		jsonArray.push({
					field : 'LoanReference',
					operator : 'lk',
					value1 : encodeURIComponent(loanReferenceText.replace(new RegExp("'", 'g'), "\''")),
					value2 : '',
					dataType : 0,
					displayType : 8,
					//detailFilter : 'Y',
					fieldLabel : getLabel('loanReference','Loan #'),
					displayValue1 : loanReferenceText
				});
	}
	
	// Invoice Number
	var invoiceNumberText = $("#txtInvoice").val();
	if (!Ext.isEmpty(invoiceNumberText)) {
		jsonArray.push({
					field : 'InvoiceNumber',
					operator : 'lk',
					value1 : encodeURIComponent(invoiceNumberText.replace(new RegExp("'", 'g'), "\''")),
					value2 : '',
					dataType : 0,
					displayType : 8,
					//detailFilter : 'Y',
					fieldLabel : getLabel('docRef','Document Reference'),
					displayValue1 : invoiceNumberText
				});
	}
	
	// Due Date
	if(!jQuery.isEmptyObject(selectedDueDate)){
		jsonArray.push({
			field : 'DueDate',
			operator : selectedDueDate.operator,
			value1 : Ext.util.Format.date(selectedDueDate.fromDate, 'Y-m-d'),
			value2 : (!Ext.isEmpty( selectedDueDate.toDate))? Ext.util.Format.date(selectedDueDate.toDate, 'Y-m-d'): '',
			dataType : 1,
			displayType : 6,
			fieldLabel : getLabel('dueDate','Invoice Due Date'),
			dropdownLabel : selectedDueDate.dateLabel
		});
	}
	
	// Loan Due Date
	if(!jQuery.isEmptyObject(selectedLoanDueDate)){
		jsonArray.push({
			field : 'LoanDueDate',
			operator : selectedLoanDueDate.operator,
			value1 : Ext.util.Format.date(selectedLoanDueDate.fromDate, 'Y-m-d'),
			value2 : (!Ext.isEmpty( selectedLoanDueDate.toDate))? Ext.util.Format.date(selectedLoanDueDate.toDate, 'Y-m-d'): '',
			dataType : 1,
			displayType : 6,
			fieldLabel : getLabel('loanDueDate','Loan Due Date'),
			dropdownLabel : selectedLoanDueDate.dateLabel
		});
	}
	
	// Loan Release Date
	if(!jQuery.isEmptyObject(selectedLoanReleaseDate)){
		jsonArray.push({
			field : 'LoanReleaseDate',
			operator : selectedLoanReleaseDate.operator,
			value1 : Ext.util.Format.date(selectedLoanReleaseDate.fromDate, 'Y-m-d'),
			value2 : (!Ext.isEmpty( selectedLoanReleaseDate.toDate))? Ext.util.Format.date(selectedLoanReleaseDate.toDate, 'Y-m-d'): '',
			dataType : 1,
			displayType : 6,
			fieldLabel : getLabel('loanReleaseDate','Loan Release Date'),
			dropdownLabel : selectedLoanReleaseDate.dateLabel
		});
	}

	// Loan Amount
	var blnAutoNumeric = true;
	//var amountFrom=$("#loanAmountFieldFrom").val();
	
	blnAutoNumeric = isAutoNumericApplied("loanAmountFieldFrom");
	if (blnAutoNumeric)
		amountFrom = $("#loanAmountFieldFrom").autoNumeric('get');
	else
		amountFrom = $("#loanAmountFieldFrom").val();
	
	if(!Ext.isEmpty(amountFrom)){
		var amountOperator = $("#loanAmountOperator").val();
		blnAutoNumeric = isAutoNumericApplied("loanAmountFieldTo");
		if (blnAutoNumeric)
			amountTo = $("#loanAmountFieldTo").autoNumeric('get');
		else
			amountTo = $("#loanAmountFieldTo").val();
		//var amountTo=$("#loanAmountFieldTo").val();
		if (!Ext.isEmpty(amountOperator)) {
			jsonArray.push({
						field : 'LoanAmount',
						operator : amountOperator,							
						value1 : amountFrom,
						value2 : amountTo,
						paramValue1 : amountFrom,
						paramValue2 : amountTo, 
						dataType : 2,
						displayType : 2,
						fieldLabel : getLabel('loanAmount','Loan Amount')
					});
		}
	}
	
	// Loan Outstanding Amount
	blnAutoNumeric = true;
	//var instAmountFrom=$("#loanOSAmountFieldFrom").val();
	blnAutoNumeric = isAutoNumericApplied("loanOSAmountFieldFrom");
	if (blnAutoNumeric)
		instAmountFrom = $("#loanOSAmountFieldFrom").autoNumeric('get');
	else
		instAmountFrom = $("#loanOSAmountFieldFrom").val();
	
	if(!Ext.isEmpty(instAmountFrom)){
		var instAmountOperator = $("#loanOSAmountOperator").val();
		//var instAmountTo=$("#loanOSAmountFieldTo").val();
		blnAutoNumeric = isAutoNumericApplied("loanOSAmountFieldTo");
		if (blnAutoNumeric)
			instAmountTo = $("#loanOSAmountFieldTo").autoNumeric('get');
		else
			instAmountTo = $("#loanOSAmountFieldTo").val();
		if (!Ext.isEmpty(instAmountOperator)) {
			jsonArray.push({
						field : 'LoanOSAmount',
						operator : instAmountOperator,							
						value1 : instAmountFrom,
						value2 : instAmountTo,
						paramValue1 : instAmountFrom,
						paramValue2 : instAmountTo, 
						dataType : 2,
						displayType : 2,
						fieldLabel : getLabel('loanOSAmount','Loan O/S Amount')
					});
		}
	}
	
	// Document Type
	var docTypeDesc=null;
	var documentType = $("#documentTypeOperator").val();
	
	if(documentType === 'I')
		docTypeDesc = 'Invoice';
	else if(documentType === 'P')
		docTypeDesc = 'Purchase Order';
	
	if(!Ext.isEmpty(documentType)){
		jsonArray.push({
			field : 'DocumentType',
			operator : 'eq',							
			value1 : encodeURIComponent(documentType.replace(new RegExp("'", 'g'), "\''")),
			value2 : '',
			dataType : 0,
			displayType : 8,
			fieldLabel : getLabel('documentType','Document Type'),
			displayValue1 : docTypeDesc
		});
	}
	
	objJson = jsonArray;
	return objJson;
}

function getAdvancedFilterValueJson(FilterCodeVal){
	var jsonArray = [];
	var objJson = {};
	jsonArray = getAdvancedFilterQueryJson();
	objJson.filterBy = jsonArray;
	if (FilterCodeVal && !Ext.isEmpty(FilterCodeVal))
		objJson.filterCode = FilterCodeVal;
	/*if (!Ext.isEmpty(seller))
		objJson.sellerValue = seller;*/
	return objJson;
}

function changeBuyerOrSellerAndRefreshGrid(selectedLoggerCode,
		selectedLoggerDescription) {
	selectedFilterLogger = selectedLoggerCode;
	selectedFilterLoggerDesc = selectedLoggerCode;
	$(document).trigger("handleLoggerChangeInQuickFilter", false);
	
}

function isAutoNumericApplied(strId) {
	var isAutoNumericApplied = false;
	$.each(($('#'+strId).data('events')||[]), function(i, event) {
				if (isAutoNumericApplied === true)
					return false;
				$.each(event, function(i, eventHandler) {
							if (eventHandler.namespace === 'autoNumeric')
								isAutoNumericApplied = true;
							return false;
						});
			});
	return isAutoNumericApplied;
}
