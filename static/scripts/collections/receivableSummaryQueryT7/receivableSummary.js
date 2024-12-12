/**
 * Sample Column Model, User should have to structured the column model in this
 * way
 */
var RECEIVABLE_GENERIC_COLUMN_MODEL = [{
			"colId" : "clientReference",
			"colHeader" : getLabel('clientRef','Client Reference'),
			"hidden" : false,
			"width" : 150,
			"hideable" : false
		}, {
			"colId" : "creditAccount",
			"colHeader" : getLabel('creditAcct','Credit Account'),
			"hidden" : false,
			"width" : 150
		}, {
			"colId" : "batchAmount",
			"colType" : "amount",
			"colHeader" : getLabel('batchAmount','Amount'),
			"hidden" : false,
			"width" : 150
		}, {
			"colId" : "processingDate",
			"colType" : "date",
			"colHeader" : getLabel('processingDate','Processing Date'),
			"hidden" : false,
			"width" : 150
		}, {
			"colId" : "totalInst",
			"colType" : "count",
			"colHeader" : getLabel('numOfInst','Count'),
			"hidden" : false,
			"width" : 150
		}, {
			"colId" : "remarks",
			"colHeader" : getLabel('remark','Remarks'),
			"hidden" : false,
			"width" : 150
		}, {
			"colId" : "actionStatus",
			"colHeader" : getLabel('status','Status'),
			"hidden" : false,
			"width" : 150
		}, {
			"colId" : "productCategory",
			"colHeader" : getLabel('productCategory','Product Category'),
			"hidden" : true,
			"width" : 150
		}, {
			"colId" : "ccy",
			"colHeader" : getLabel('ccy','Currency'),
			"hidden" : true,
			"width" : 150
		}, {
			"colId" : "recProductDesc",
			"colHeader" : getLabel('recProductDesc','Receivables Product'),
			"hidden" : true,
			"width" : 150
		}, {
			"colId" : "creationDate",
			"colHeader" : getLabel('creationDate','Creation Date'),
			"hidden" : true,
			"width" : 150
		}];

var arrSortByPaymentFields = [{
			"colId" : "clientReference",
			"colDesc" : getLabel("clientReference", "Client Reference")
		}, {
			"colId" : "creditAccount",
			"colDesc" : getLabel("creditaccount", "Credit Account#")
		}, {
			"colId" : "batchAmount",
			"colDesc" : getLabel("batchAmount", "Batch Amount")
		}, {
			"colId" : "totalInst",
			"colDesc" : getLabel("numOfInst", "No. of instruments")
		},{
			"colId" : "remarks",
			"colDesc" :getLabel("dhdRemark", "Remarks")
		},{
			"colId" : "processingDate",
			"colDesc" : getLabel("processingDate", "Processing Date")
		},{
			"colId" : "actionStatus",
			"colDesc" : getLabel("status", "Status")
		}];;
var arrReceivableStatus = 	[
	  {
		"code": "15",
		"desc":  getLabel("paid","Paid"),
	  },
	  {
		"code": "41",
		"desc": getLabel("returned","Returned"),
	  },
	  {
		"code": "51,52,53,54,55,56,57,62,63,64,65,66,67,68,69,70,71,102,103,104,105,106,107,108,109,110,111,112,113,114,115,116,117,118,119,120,121,122,123,124,125,126,127,128,129,130,131,132,133,134,135,136,137,138,139,140,141",
		"desc":  getLabel("inprocess","In Process"),
	  },
	  {
		"code": "58,60,61",
		"desc":  getLabel("processed","Processed"),
	  },
	  {
		"code": "96",
		"desc": getLabel('cancelledbybank',"Cancelled By Bank"),
	  },
	  {
		"code": "103",
		"desc": "Sent To Clearing"
	  },
	  {
		"code": "146",
		"desc": "Data Entry Rejected"  
	  }
	];
var arrReceivableAdminStatus = 	[
	  {
		"code": "LA",
		"desc": "Liquidation Auth"
	  },
	  {
		"code": "RR",
		"desc": "Risk Manager Rejected"
	  },
	  {
		"code": "RM",
		"desc": "Pending Risk Manager"
	  },
	  {
		"code": "SG",
		"desc": "Schedule Generated"
	  },
	  {
		"code": "SM",
		"desc": "Schedule Receipt Marked"
	  },
	  {
		"code": "SA",
		"desc": "Schedule Receipt Auth"
	  },
	  {
		"code": "SR",
		"desc": "Schedule Receipt Rejected"
	  },
	  {
		"code": "RD",
		"desc": "Ready For Dispatch"
	  },
	  {
		"code": "LP",
		"desc": "Paid"
	  },
	  {
		"code": "LR",
		"desc": "Returned"
	  },
	  {
		  "code": "IP",
		  "desc": "PDC In Custody"
	  },
	  {
		  "code": "RI",
		  "desc": "Data Entry Rejected"
	  }
	];
var arrActionColumnStatus = [['15', 'Paid'], ['41', 'Returned'],['96', 'Cancelled By Bank'],
		['51,52,53,54,55,56,57,62,63,64,65,66,67,68,69,70,71,102,103,104,105,106,107,108,109,110,111,112,113,114,115,116,117,118,119,120,121,122,123,124,125,126,127,128,129,130,131,132,133,134,135,136,137,138,139,140,141', 'In Process'],
		['58,60,61', 'Processed']];

var arrAdminActionColumnStatus = [
		['LA', 'Liquidation Auth'],
		['RR', 'Risk Manager Rejected'],
		['RM', 'Pending Risk Manager'],
		['SG', 'Schedule Generated'],
		['SM', 'Schedule Receipt Marked'],
		['SA', 'Schedule Receipt Auth'],
		['SR', 'Schedule Receipt Rejected'],
		['RD', 'Ready For Dispatch'],
		['LP', 'Paid'],
		['LR', 'Returned'],
		['IP', 'PDC In Custody'],
		['RI', 'Data Entry Rejected']
	];
		
jQuery.fn.CollForceNumericOnly = function(intPrecision, intDecimal) {
	if (intPrecision == null)
		intPrecision = 11;
	if (intDecimal == null)
		intDecimal = 5;
	return this.each(function() {
		$(this).keydown(function(event) {
			var keynum;
			var keychar;
			var caret = $(this).caret();
			if (window.event) { // IE
				keynum = event.keyCode;
			}
			if (event.which) { // Netscape/Firefox/Opera
				keynum = event.which;
			}
			
			if ((this.value.length > intPrecision - 4)
					&& this.value.indexOf('.') == -1) {
				if (keynum == 110 || keynum == 190 || keynum == 8
						|| keynum == 46) {
					return true;
				} else {
					return false;
				}
			}
			if ((keynum == 8 || keynum == 9 || keynum == 27 || keynum == 46
					||
					// Allow: Ctrl+A
					((keynum == 65 || keynum == 67 || keynum == 88 || keynum == 86) && event.ctrlKey === true)
					||
					// Allow: home, end, left, right
					(keynum >= 35 && keynum <= 40)
					|| (keynum >= 48 && keynum <= 57) || (keynum >= 96 && keynum <= 105))) {
				if (((keynum >= 48 && keynum <= 57) || (keynum >= 96 && keynum <= 105))
						&& (this.value.indexOf('.') != -1 && (this.value
								.substring(this.value.indexOf('.'))).length > intDecimal)
						&& (this.value.indexOf('.') != -1 && caret > this.value
								.indexOf('.')))
					return false;
				return true;
			} else if (keynum == 110 || keynum == 190) {
				var checkdot = this.value;
				var i = 0;
				for (i = 0; i < checkdot.length; i++) {
					if (checkdot[i] == '.')
						return false;
				}
				if (checkdot.length == 0)
					this.value = '0';
				return true;
			} else {
				// Ensure that it is a number and stop
				// the keypress
				if (event.shiftKey || (keynum < 48 || keynum > 57)
						&& (keynum < 96 || keynum > 105)) {
					event.preventDefault();
				}
			}

			keychar = String.fromCharCode(keynum);

			return !isNaN(keychar);
		})
	})
};
