/**
 * Sample Column Model, User should have to structured the column model in this
 * way
 */
var RECEIVABLE_GENERIC_COLUMN_MODEL = [{
			"colId" : "dhdClientDesc",
			"colHeader" : getLabel('companyName','Company Name'),
			"colDesc" : getLabel('companyName','Company Name'),
			"hidden" : false
		},{
			"colId" : "dhdDepSlip",
			"colHeader" : getLabel('clientRef','Client Reference'),
			"colDesc" : getLabel('clientRef','Client Reference'),
			"hidden" : false
		},{
			"colId" : "creditAccount",
			"colHeader" : getLabel('creditAcct','Credit Account'),
			"colDesc" : getLabel('creditAcct','Credit Account'),
			"hidden" : false
		}, {
			"colId" : "dhdProductDesc",
			"colHeader" : getLabel('product','Package'),
			"colDesc" : getLabel('product','Package'),
			"hidden" : false
		}, {
			"colId" : "dhdTotalAmnt",
			"colType" : "amount",
			"colHeader" : getLabel('amount','Amount'),
			"colDesc" : getLabel('amount','Amount'),
			"hidden" : false
		}, {
			"colId" : "activationDate",
			"colType" : "date",
			"colHeader" : getLabel('processingDate','Processing Date'),
			"colDesc" : getLabel('processingDate','Processing Date'),
			"hidden" : false
		}, {
			"colId" : "dhdTotalNo",
			"colType" : "count",
			"colHeader" : getLabel('count','Count'),
			"colDesc" : getLabel('count','Count'),
			"hidden" : false
		}, {
			"colId" : "dhdRemark",
			"colHeader" : getLabel('remark','Remarks'),
			"colDesc" : getLabel('remark','Remarks'),
			"hidden" : false
		}, {
			"colId" : "dhdModule",
			"colHeader" : getLabel('enterBy','Entered By'),
			"colDesc" : getLabel('enterBy','Entered By'),
			"hidden" : false
		}, {
			"colId" : "actionStatus",
			"colHeader" : getLabel('status','Status'),
			"colDesc" : getLabel('status','Status'),
			"hidden" : false
		}];

var arrSortByPaymentFields = [{
			"colId" : "dhdDepSlip",
			"colDesc" : getLabel("clientReference","Client Reference")
		}, {
			"colId" : "creditAccount",
			"colDesc" : getLabel("creditaccount","Credit Account #")
		}, {
			"colId" : "dhdProductDesc",
			"colDesc" : getLabel("package","Package")
		}, {
			"colId" : "dhdTotalAmnt",
			"colDesc" : getLabel("batchAmount","Batch Amount")
		}, {
			"colId" : "dhdTotalNo",
			"colDesc" : getLabel("count","Count")
		},{
			"colId" : "dhdRemark",
			"colDesc" : getLabel("remark","Remarks")
		},{
			"colId" : "dhdModule",
			"colDesc" : getLabel('enterBy','Entered By')
		},{
			"colId" : "activationDate",
			"colDesc" : getLabel("activationDate","Processing Date")
		},{
			"colId" : "actionStatus",
			"colDesc" : getLabel("status","Status")
		}];;
var arrReceivableStatus = 	[
	  {
		"code": "0",
		"desc": getLabel("draft","Draft")
	  },
	  {
		"code": "101",
		"desc": getLabel("pendingsubmit","Pending Submit")
	  },
	  {
		"code": "1",
		"desc": getLabel("pendingapproval","Pending Approval")
	  },
	  {
		"code": "2",
		"desc": getLabel("pendingmyapproval","Pending My Approval")
	  },
	  {
		"code": "3",
		"desc": getLabel("pendingsend","Pending Send")
	  },
	  {
		"code": "19",
		"desc": getLabel("forcancelapprove","For Cancel Approve")
	  },
	  {
		"code": "15",
		"desc": getLabel("paid","Paid")
	  },
	  {
		"code": "41",
		"desc": getLabel("returned","Returned")
	  },
	  {
		"code": "4",
		"desc": getLabel("rejectedinst","Rejected")
	  },
	  {
		"code": "7,102",
		"desc": getLabel("senttobank","Sent To Bank")
	  },
	  {
		"code": "11,27,51,52,53,54,55,56,57,62,63,64,65,66,67,68,69,70,71,94,95,98,103,104,105,106,107,108,109,110,111,112,113,114,115,116,117,118,119,120,121,122,123,124,125,126,127,128,129,130,131,132,133,134,135,136,137,138,139,140,141,142,143,144,145",
		"desc": getLabel("senttoClearing","Sent To Clearing")
	  },
	  {
		"code": "8",
		"desc": getLabel("deleted","Deleted")
	  },
	  {
		"code": "9",
		"desc": getLabel("pendingrepair","Pending Repair")
	  },
	  {
		"code": "18",
		"desc": getLabel("stoppedcancelled","Cancelled")
	  },
	  {
		"code": "58,60,61",
		"desc": getLabel("PROCESSED","Processed")
	  },
	  {
		"code": "43",
		"desc": getLabel("WAREHOUSED","WareHoused")
	  },
	  {
		"code": "96",
		"desc": getLabel("cancelledbybank","Cancelled By Bank")
	  }
	];

var arrActionColumnStatus = [['0', 'Draft'], ['101', 'Pending Submit'], ['1', 'Pending Approval'],
		['2', 'Pending My Approval'],['3', 'Pending Send'],	['43', 'Warehoused'],
		['4', 'Rejected'], ['7', 'Sent To Bank'],
		['8', 'Deleted'], ['9', 'Pending Repair'],['15', 'Paid'], ['41', 'Returned'],
		['18', 'Cancelled'],['19', 'For Cancel Approve'],['96', 'Cancelled By Bank'],
		['11,27,51,52,53,54,55,56,57,62,63,64,65,66,67,68,69,70,71,94,95,98,103,104,105,106,107,108,109,110,111,112,113,114,115,116,117,118,119,120,121,122,123,124,125,126,127,128,129,130,131,132,133,134,135,136,137,138,139,140,141,142,143,144,145', 'Sent To Clearing'],
		['58,60,61', 'Processed']];
function getJsonObj(jsonObject) {
    var jsonObj ='';
    if(jsonObject  instanceof Object ==false)
           jsonObj =JSON.parse(jsonObject);
    if(jsonObject  instanceof Array)
           jsonObj =jsonObject;
    for (var i = 0; i < jsonObj.length; i++) {
           jsonObj[i].colDesc =  getLabel(jsonObj[i].colId,jsonObj[i].colDesc);
           jsonObj[i].colHeader =  getLabel(jsonObj[i].colId,jsonObj[i].colHeader);
    }
    if(jsonObject  instanceof Object ==false)
           jsonObj = JSON.stringify(jsonObj)
    return jsonObj;
};
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
