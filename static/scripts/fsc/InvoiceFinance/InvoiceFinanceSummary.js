var PO_GENERIC_COLUMN_MODEL = [{
			"colId" : "poReferenceNmbr",
			"colHeader" : getLabel('poReferenceNmbr','Batch Reference'),
			"hidden" : false
		},{
			"colId" : "poBatchNumber",
			"colHeader" : getLabel('poBatchNumber','PO#'),
			"hidden" : false
		}, {
			"colId" : "poDate",
			"colType" : "date",
			"colHeader" : getLabel('date','Date'),
			"hidden" : false
		}, {
			"colId" : "poAmount",
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
			"colId" : "purchaseOrderStatus",
			"colHeader" : getLabel('purchaseOrderStatus','Status'),
			"hidden" : false
		}];
var arrPOStatus = 	[
	  {
		"code": "0",
		"desc": getLabel('poStatus.0','Draft')
	  },
	  /*{
		"code": "1",
		"desc": getLabel('poStatus.1','Submitted')
	  },
	  */
	  {
		"code": "1",
		"desc": getLabel('poStatus.2','For Auth')
	  },
	  {
		"code": "2",
		"desc": getLabel('poStatus.3','For MyAuth')
	  },
	  {
			"code": "3",
			"desc": getLabel('poStatus.10','For Presentment')
      },
	  {
		"code": "4",
		"desc": getLabel('poStatus.4','Rejected')
	  },
	  {
		"code": "7",
		"desc": getLabel('poStatus.5','Presented')
	  },
	  {
		"code": "9",
		"desc": getLabel('poStatus.9','For Repair')
	  }];
	  

var arrSellerBuyer = [{
		"code": "SELLER",
		"desc": getLabel('Seller', 'Seller')
	  },
	  {
		"code": "BUYER",
		"desc": getLabel('Buyer', 'Buyer')
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