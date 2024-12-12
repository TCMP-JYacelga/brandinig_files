var PO_GENERIC_COLUMN_MODEL = [{
			"colId" : "ReferenceNmbr",
			"colHeader" : getLabel('icReferenceNmbr','Batch Reference'),
			"hidden" : false
		},{
			"colId" : "BatchNumber",
			"colHeader" : getLabel('icBatchNumber','PO#'),
			"hidden" : false
		}, {
			"colId" : "Date",
			"colType" : "date",
			"colHeader" : getLabel('date','Date'),
			"hidden" : false
		}, {
			"colId" : "Amount",
			"colType" : "amount",
			"colHeader" : getLabel('amount','Amount'),
			"hidden" : false
		}, {
			"colId" : "subsidiary",
			"colHeader" : getLabel('subsidiary','Subsidiary'),
			"hidden" : false
		}, {
			"colId" : "buyerSeller",
			"colHeader" : getLabel('buyserSellerId','Buyer'),
			"hidden" : false
		}, {
			"colId" : "scmMyProduct",
			"colHeader" : getLabel('scmMyProduct','SCF Package'),
			"hidden" : false
		},{
			"colId" : "invoiceStatus",
			"colHeader" : getLabel('invoiceStatus','Status'),
			"hidden" : false
		}];
var arrPOStatus = 	[
	  {
		"code": "0",
		"desc": getLabel('icStatus.0','Draft')
	  },
	  /*{
		"code": "1",
		"desc": getLabel('poStatus.1','Submitted')
	  },
	  */
	  {
		"code": "1",
		"desc": getLabel('icStatus.2','Pending Approval')
	  },
	  {
		"code": "2",
		"desc": getLabel('icStatus.3','Pending My Approval')
	  },
	  {
			"code": "3",
			"desc": getLabel('icStatus.10','Pending Presentment')
      },
	  {
		"code": "4",
		"desc": getLabel('icStatus.4','Rejected')
	  },
	  {
		"code": "7",
		"desc": getLabel('icStatus.5','Presented')
	  },
	  {
		"code": "9",
		"desc": getLabel('icStatus.9','For Repair')
	  }];
	  

var arrSellerBuyer = [{
		"code": "SELLER",
		"desc": getLabel('Seller','Seller')
	  },
	  {
		"code": "BUYER",
		"desc": getLabel('Buyer','Buyer')
	  }];



function changeClientAndRefreshGrid(selectedClientCode,
		selectedClientDescription) {
	// sets global variable
	selectedFilterClient = selectedClientCode;
	selectedFilterClientDesc = selectedClientDescription;
	//$("#summaryClientFilterSpan").text(selectedClientDescription);
	//switchClient(selectedFilterClient);
	$(document).trigger("handleClientChangeInQuickFilter", false);
	
}
function changeBuyerOrSellerAndRefreshGrid(selectedLoggerCode,
		selectedLoggerDescription) {
	selectedFilterLogger = selectedLoggerCode;
	selectedFilterLoggerDesc = selectedLoggerCode;
	//$("#summaryLoggerFilterSpan").text(selectedLoggerDescription);
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
function switchClient(strClientId) {
	$.ajax({
				url : 'services/swclient/' + strClientId + '.json',
				success : function(response) {

				}
			});
}