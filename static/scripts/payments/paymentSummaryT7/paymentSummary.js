/**
 * Sample Column Model, User should have to structured the column model in this
 * way
 */
var PAYMENT_GENERIC_COLUMN_MODEL = [{
			"colId" : "clientReference",
			"colHeader" : getLabel("batchReference", "Batch Reference"),
			"hidden" : false
		}, {
			"colId" : "sendingAccount",
			"colHeader" : "Sending Account",
			"hidden" : false
		}, {
			"colId" : "recieverName",
			"colHeader" : getLabel("receiverName", "Receiver Name"),
			"hidden" : false
		}, {
			"colId" : "amount",
			"colType" : "amount",
			"colHeader" : "Amount",
			"hidden" : false
		}, {
			"colId" : "count",
			"colType" : "count",
			"colHeader" : "Count",
			"hidden" : false
		}, {
			"colId" : "actionStatus",
			"colHeader" : "Status",
			"hidden" : false
		}, {
			"colId" : "productCategoryDesc",
			"colHeader" : "Payment Type",
			"hidden" : false
		}, {
			"colId" : "productTypeDesc",
			"colHeader" : "Payment Package",
			"hidden" : false
		}, {
			"colId" : "txnDate",
			"colHeader" : "Effective Date",
			"hidden" : false
		}, {
			"colId" : "recieverAccount",
			"colHeader" : "Receiving Account + CCY",
			"hidden" : true
		}, {
			"colId" : "entryDate",
			"colHeader" : "Entry Date",
			"hidden" : true
		}, {
			"colId" : "valueDate",
			"colHeader" : "Process Date",
			"hidden" : true
		}, {
			"colId" : "phdnumber",
			"colHeader" : "Tracking No.",
			"hidden" : true
		}, {
			"colId" : "creditAmount",
			"colType" : "amount",
			"colHeader" : "Credit Amount",
			"hidden" : true
		}, {
			"colId" : "debitAmount",
			"colType" : "amount",
			"colHeader" : "Debit Amount",
			"hidden" : true
		}, {
			"colId" : "txnType",
			"colHeader" : "Type of Transaction",
			"hidden" : true
		}, {
			"colId" : "hostMessage",
			"colHeader" : "Host Message",
			"hidden" : true
		}, {
			"colId" : "companyId",
			"colHeader" : "Company ID",
			"hidden" : true
		}, {
			"colId" : "maker",
			"colHeader" : "Entry User",
			"hidden" : true
		}, {
			"colId" : "checker1",
			"colHeader" : "Checker1",
			"hidden" : true
		},{
			"colId" : "checker2",
			"colHeader" : "Checker2",
			"hidden" : true
		},{
			"colId" : "client",
			"colHeader" : "Company Name",
			"hidden" : true
		}, {
			"colId" : "paymentSource",
			"colHeader" : "Source",
			"hidden" : true
		}, {
			"colId" : "rejectRemarks",
			"colHeader" : "Reject Remark",
			"hidden" : true
		}, {
			"colId" : "makerCode",
			"colHeader" : "Maker Code",
			"hidden" : true
		}, {
			"colId" : "templateName",
			"colHeader" : "Template Name",
			"hidden" : true
		}, {
			"colId" : "templateDescription",
			"colHeader" : "Template Description",
			"hidden" : true
		}, {
			"colId" : "templateTypeDesc",
			"colHeader" : "Template Type",
			"hidden" : true
		}, {
			"colId" : "SendingAccountDescription",
			"colHeader" : "Sending Account Name",
			"hidden" : true
		}, {
			"colId" : "pendingApprovalCount",
			"colHeader" : "User Pending for Approval",
			"hidden" : true
		}, {
			"colId" : "channelDesc",
			"colHeader" : "Channel",
			"hidden" : true
		}, {
			"colId" : "anyIdTypeDesc",
			"colHeader" : "Any ID Type",
			"hidden" : true
		}, {
			"colId" : "anyIdValue",
			"colHeader" : "Any ID Value",
			"hidden" : true
		}, {
			"colId" : "file",
			"colHeader" : "File Name",
			"hidden" : false
		}, {
			"colId" : "BeneBankDescription",
			"colHeader" : "Receiver Bank Name",
			"hidden" : false
		}, {
			"colId" : "BeneBranchDescription",
			"colHeader" : "Receiver Branch Name",
			"hidden" : false
		}, {
			"colId" : "ReceiverShortCode",
			"colHeader" : "Drawer Code",
			"hidden" : false
		}, {
			"colId" : "ReceiverCode",
			"colHeader" : "Receiver Code",
			"hidden" : false
		},{
			"colId" : "pullToBank",
			"colHeader" : "Pull To Bank",
			"hidden" : true
		},{
			"colId" : "pullToBankRemarks",
			"colHeader" : "Pull To Bank Remarks",
			"hidden" : true
		},{
			"colId" : "myAuthAmount",
			"colHeader" : "My Auth Amount",
			"hidden" : true
		},{
			"colId" : "myAuthCount",
			"colHeader" : "My Auth Count",
			"hidden" : true
		},{
			"colId" : "mySendAmount",
			"colHeader" : "My Send Amount",
			"hidden" : true
		},{
			"colId" : "mySendCount",
			"colHeader" : "My Send Count",
			"hidden" : true
		},
		,{
			"colId" : "parentBacthRefId",
			"colHeader" : "Parent Batch Tracking Id",
			"hidden" : true
		}];

var arrSortByPaymentFields = [{
			"colId" : "recieverName",
			"colDesc" : getLabel("receiverName", "Receiver Name")
		}, {
			"colId" : "amount",
			"colDesc" : getLabel("amount", "Amount")
		}, {
			"colId" : "count",
			"colDesc" :  getLabel("count", "Count")
		}, /*{
			"colId" : "actionStatus",
			"colDesc" : getLabel("actionStatus", "Status")
		},*/ {
			"colId" : "productCategoryDesc",
			"colDesc" : getLabel("PaymentType","Payment Type") 
		}, {
			"colId" : "productTypeDesc",
			"colDesc" : getLabel("PaymentPackage", "Payment Package")
		}, {
			"colId" : "txnDate",
			"colDesc" : getLabel("txnDate", "Effective Date")
		}, {
			"colId" : "sendingAccount",
			"colDesc" : getLabel("sendingAccount", "Sending Account")
		}, {
			"colId" : "templateName",
			"colDesc" : getLabel("templateName", "Template Name")
		}, {
			"colId" : "recieverAccount",
			"colDesc" :  getLabel("ReceiverAccount" , "Receiver Account")
		}, {
			"colId" : "entryDate",
			"colDesc" : getLabel("entryDate", "Entry Date")
		}, {
			"colId" : "valueDate",
			"colDesc" : getLabel("valueDate", "Process Date")
		}, {
			"colId" : "client",
			"colDesc" : getLabel("client", "Company Name")
		},/* {
			"colId" : "bankProduct",
			"colDesc" : getLabel("bankProduct", "Bank Product")
		},*/ {
			"colId" : "phdnumber",
			"colDesc" : getLabel("TrackingNo", "Tracking No.")
		}, {
			"colId" : "clientReference",
			"colDesc" : getLabel("clientReference", "Payment Reference")
		}, {
			"colId" : "file",
			"colDesc" : getLabel("FileName","File Name")
		}, {
			"colId" : "creditAmount",
			"colDesc" : getLabel("creditAmount", "Credit Amount")
		}, {
			"colId" : "debitAmount",
			"colDesc" : getLabel("debitAmount", "Debit Amount")
		}, {
			"colId" : "txnType",
			"colDesc" : getLabel("txnType", "Type of Transaction")
		}, {
			"colId" : "maker",
			"colDesc" : getLabel("maker", "Entry User")
		}, {
			"colId" : "checker1",
			"colDesc" : getLabel("Checker1", "Checker1")
		}, {
			"colId" : "checker2",
			"colDesc" : getLabel("Checker2","Checker2")
		}, {
			"colId" : "hostMessage",
			"colDesc" : getLabel("hostMessage", "Host Message")
		}, {
			"colId" : "channelDesc",
			"colDesc" :  getLabel("Channel","Channel")
		},  {
			"colId" : "CompanyId",
			"colDesc" : getLabel( "CompanyID", "Company ID")
		},	{
			"colId" : "PendingApprovalCount",
			"colDesc" : getLabel( "UserPendingforApproval","User Pending for Approval")
		}, {
			"colId" : "RejectRemarks",
			"colDesc" : getLabel( "RejectRemarks","Reject Remarks")
		}, {
			"colId" : "TemplateDescription",
			"colDesc" :  getLabel("TemplateDescription","Template Description")
		}, {
			"colId" : "TemplateTypeDesc",
			"colDesc" : getLabel( "TemplateType","Template Type")
		}, {
			"colId" : "sendingAccountDescription",
			"colDesc" :  getLabel("SendingAccountName","Sending Account Name")
		}, {
			"colId" : "PaymentSource",
			"colDesc" :  getLabel("PaymentSource","Payment Source")
		}, {
			"colId" : "FxRate",
			"colDesc" :  getLabel("ExchangeRate","Exchange Rate")
		}, {
			"colId" : "Remarks",
			"colDesc" :  getLabel("Remarks","Remarks")
		}, {
			"colId" : "anyIdTypeDesc",
			"colDesc" :  getLabel("AnyIDType","Any ID Type")
		}, {
			"colId" : "anyIdValue",
			"colDesc" :  getLabel("AnyIDValue","Any ID Value")
		},
		{
			"colId" : "parentBacthRefId",
			"colDesc" :  getLabel("parentBatchTrackingId","Parent Batch Tracking Id")
		}];
var arrPaymentStatus = 	[
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
		"code": "40",
		"desc": getLabel("pendingapproval2","Partially Rejected")
	  },
	  {
		"code": "4",
		"desc":  getLabel("rejectedinst","Rejected")
	  },
	  {
		"code": "7",
		"desc": getLabel("senttobank","Sent To Bank")
		},
	  {
		"code": "8",
		"desc": getLabel("deleted","Deleted")
	  },
	  {
		"code": "9",
		"desc":  getLabel("pendingrepair","Pending Repair")
	  },
	  {
		"code": "14",
		"desc":  getLabel("debited","Debited")
	  },
	  {
		"code": "41",
		"desc": getLabel("returned","Returned")
	  },
	  {
		"code": "18",
		"desc": getLabel("Cancelled","Cancelled")
	  },
	  {
		"code": "19",
		"desc": getLabel("forcancelapprove","For Cancel Approve")
	  },
	  {
		"code": "29",
		"desc": getLabel("cancelrequested","Cancel Requested")
	  },
	  {
		"code": "51,52,53,54,55,56,57,62,63,64,65,66,67,68,69,70,71,94,95,96",
		"desc":  getLabel("IN_PROCESS","In Process")
	  },
	  {
		"code": "15,58,60,61",
		"desc": getLabel("PROCESSED","Processed")
	  },
	  {
		"code": "59",
		"desc":  getLabel("BANK_REPAIR","Failed")
	  },
	  {
			"code": "13",
			"desc": getLabel("debitfailed","Debit Failed")
	  },
	  {
		  "code": "43",
			"desc": getLabel("WareHoused","WareHoused")
	  },
	  {
		"code": "97,99,999,777,888",
		"desc": getLabel("mixed","Mixed")
	  },
	  {
			"code": "30",
			"desc": getLabel("pendingmyverification","Pending My Verification")
	  },
	  {
			"code": "31",
			"desc": getLabel("pendingverification","Pending Verification")
	  },
	  {
			"code": "32",
			"desc": getLabel("verifierrejected","Verifier Rejected")
	  },
	  {
			"code": "109",
			"desc": getLabel("partiallyverified","Partially Verified")
	  },{
			"code": "108",
			"desc": getLabel("verified","Verified")
	  }
	];

if(PHYSICAL_PAY_APPLY == false)
{
	arrPaymentStatus.push(
	 {
		"code": "104",
		"desc":  getLabel("printed","Printed")
	  },
	  {
		"code": "105",
		"desc":  getLabel("stale","Stale")
	  },
	  {
		"code": "106",
		"desc": getLabel("Technical Return","Technical Return")
	  },
	  {
	   "code": "107",
	   "desc": getLabel("Stopped","Stopped")
	  });
}


var arrActionColumnStatus = [['0', 'Draft'], ['101', 'Pending Submit'], ['1', 'Pending Approval'],
		['2', 'Pending My Approval'],['3', 'Pending Send'],
		['40', 'Partially Rejected'],
		['4', 'Rejected'], ['7', 'Sent To Bank'],
		['8', 'Deleted'], ['9', 'Pending Repair'],['14', 'Debited'], ['41', 'Returned'],
		['18', 'Stopped'], ['19', 'For Cancel Approve'], ['29', 'Cancel Requested'],
		['51,52,53,54,55,56,57,62,63,64,65,66,67,68,69,70,71,94,95,96', 'In Process'],['15','58,60,61', 'Processed'],
		['59', 'Failed'],
		['75', 'Reversal Pending Approval'], ['76', 'Reversal Approved'],
		['77', 'Reversal Rejected'], ['78', 'Reversal Pending My Approval'],['93','Reversed '],['43','WareHoused'],
		['97,99,999,777,888', 'Mixed']];
		

var PAYMENT_APPROVAL_CONFIRMATION_COLUMN_MODEL = [{
			"xtype" : "rownumberer",
			"colId" : "srNo",
			"colHeader" : getLabel("srNo","Seq. No."),
			"hidden" : false,
			"width" : 80,
			"resizable" : false,
			hideable : false,
			draggable : false,
			renderer : this.columnRenderer
		},{
			"colId" : "clientReference",
			"colHeader" : getLabel("colPaymentReference","Batch Reference"),
			"hidden" : false,
			"width" : 160,
			resizable : false,
			hideable : false,
			"sortable" : false,
			draggable : false,
			forceFit : true,
			renderer : this.columnRenderer
		}, {
			"colId" : "sendingAccount",
			"colHeader" : getLabel("lblColAccountNo","Sending Account"),
			"hidden" : false,
			"width" : 140,
			"resizable" : false,
			"hideable" : false,
			"sortable" : false,
			"draggable" : false,
			"forceFit" : true,
			renderer : this.columnRenderer
		}, {
			"colId" : "recieverName",
			"colHeader" : getLabel("lblColReceiverName", "Receiver Name"),
			"hidden" : false,
			"width" : 160,
			"resizable" : false,
			"hideable" : false,
			"draggable" : false,
			"sortable" : false,
			"forceFit" : true,
			renderer : this.columnRenderer
		}, {
			"colId" : "amount",
			"colType" : "amount",
			"colHeader" :  getLabel("lblColAmount","Amount"),
			"hidden" : false,
			"width" : 140,
			"resizable" : false,
			"hideable" : false,
			"draggable" : false,
			"sortable" : false,
			"forceFit" : true,
			"colType" :"amount",
			"tdCls":'amountCol',
			renderer : this.columnRenderer
		}, {
			"colId" : "count",
			"colType" : "count",
			"colHeader" : getLabel("lblColCount","Count"),
			"hidden" : false,
			"width" : 70,
			"resizable" : false,
			sortable : false,
			"hideable" : false,
			"draggable" : false,
			"forceFit" : true,
			renderer : this.columnRenderer
		}, {
			"colId" : "productCategoryDesc",
			"colHeader" :  getLabel("lblColPaymentCategory","Payment Type"),
			"hidden" : false,
			"width" : 160,
			"resizable" : false,
			 sortable : false,
			"hideable" : false,
			"draggable" : false,
			"forceFit" : true,
			renderer : this.columnRenderer
		}, {
			"colId" : "productTypeDesc",
			"colHeader" :  getLabel("lblColPaymentMetohd", "Payment Package"),
			"hidden" : false,
			"width" : 160,
			"resizable" : false,
			 sortable : false,
			"hideable" : false,
			"draggable" : false,
			"forceFit" : true,
			renderer : this.columnRenderer
		}, {
			"colId" : "txnDate",
			"colHeader" :  getLabel("lblColEffectiveDate","Effective Date"),
			"hidden" : false,
			"width" : 150,
			"resizable" : false,
			"hideable" : false,
			sortable : false,
			"draggable" : false,
			"forceFit" : true,
			renderer : this.columnRenderer
		},{
			"colId" : "file",
			"colHeader" : getLabel("fileName","File Name"),
			"hidden" : false,
			"width" : 160,
			resizable : false,
			hideable : false,
			"sortable" : false,
			draggable : false,
			forceFit : true,
			renderer : this.columnRenderer
		},{
			"colId" : "pullToBank",
			"colHeader" : getLabel("lbl.pullToBank","Pull To Bank"),
			"hidden" : false,
			"width" : 160,
			resizable : false,
			hideable : false,
			"sortable" : false,
			draggable : false,
			forceFit : true,
			renderer : this.columnRenderer
		},{
			"colId" : "pullToBankRemarks",
			"colHeader" : getLabel("lbl.pullToBankRemarks","Pull To Bank Remarks"),
			"hidden" : false,
			"width" : 160,
			resizable : false,
			hideable : false,
			"sortable" : false,
			draggable : false,
			forceFit : true,
			renderer : this.columnRenderer
		}];

var APPROVAL_CONFIRMATION_COLUMN_MODEL_WITH_DRAWER = [{
			"xtype" : "rownumberer",
			"colId" : "srNo",
			"colHeader" : getLabel("srNo","Seq. No."),
			"hidden" : false,
			"width" : 80,
			"resizable" : false,
			hideable : false,
			draggable : false,
			renderer : this.columnRenderer
		},{
			"colId" : "clientReference",
			"colHeader" : getLabel("colPaymentReference","Batch Reference"),
			"hidden" : false,
			"width" : 160,
			resizable : false,
			hideable : false,
			"sortable" : false,
			draggable : false,
			forceFit : true,
			renderer : this.columnRenderer
		}, {
			"colId" : "sendingAccount",
			"colHeader" : getLabel("lblColAccountNo","Sending Account"),
			"hidden" : false,
			"width" : 140,
			"resizable" : false,
			"hideable" : false,
			"sortable" : false,
			"draggable" : false,
			"forceFit" : true,
			renderer : this.columnRenderer
		}, {
			"colId" : "recieverName",
			"colHeader" : getLabel("lblColReceiverName", "Receiver Name"),
			"hidden" : false,
			"width" : 160,
			"resizable" : false,
			"hideable" : false,
			"draggable" : false,
			"sortable" : false,
			"forceFit" : true,
			renderer : this.columnRenderer
		}, {
			"colId" : "drawerLocalName",
			"colHeader" : getLabel("lblDrawerLocalName", "Receiver Input Name"),
			"hidden" : false,
			"width" : 160,
			"resizable" : false,
			"hideable" : false,
			"draggable" : false,
			"sortable" : false,
			"forceFit" : true,
			renderer : this.columnRenderer
		}, {
			"colId" : "amount",
			"colType" : "amount",
			"colHeader" :  getLabel("lblColAmount","Amount"),
			"hidden" : false,
			"width" : 140,
			"resizable" : false,
			"hideable" : false,
			"draggable" : false,
			"sortable" : false,
			"forceFit" : true,
			"colType" :"amount",
			"tdCls":'amountCol',
			renderer : this.columnRenderer
		}, {
			"colId" : "count",
			"colType" : "count",
			"colHeader" : getLabel("lblColCount","Count"),
			"hidden" : false,
			"width" : 70,
			"resizable" : false,
			sortable : false,
			"hideable" : false,
			"draggable" : false,
			"forceFit" : true,
			renderer : this.columnRenderer
		}, {
			"colId" : "productCategoryDesc",
			"colHeader" :  getLabel("lblColPaymentCategory","Payment Type"),
			"hidden" : false,
			"width" : 160,
			"resizable" : false,
			 sortable : false,
			"hideable" : false,
			"draggable" : false,
			"forceFit" : true,
			renderer : this.columnRenderer
		}, {
			"colId" : "productTypeDesc",
			"colHeader" :  getLabel("lblColPaymentMetohd", "Payment Package"),
			"hidden" : false,
			"width" : 160,
			"resizable" : false,
			 sortable : false,
			"hideable" : false,
			"draggable" : false,
			"forceFit" : true,
			renderer : this.columnRenderer
		}, {
			"colId" : "txnDate",
			"colHeader" :  getLabel("lblColEffectiveDate","Effective Date"),
			"hidden" : false,
			"width" : 150,
			"resizable" : false,
			"hideable" : false,
			sortable : false,
			"draggable" : false,
			"forceFit" : true,
			renderer : this.columnRenderer
		},{
			"colId" : "file",
			"colHeader" : getLabel("fileName","File Name"),
			"hidden" : false,
			"width" : 160,
			resizable : false,
			hideable : false,
			"sortable" : false,
			draggable : false,
			forceFit : true,
			renderer : this.columnRenderer
		},{
			"colId" : "pullToBank",
			"colHeader" : getLabel("lbl.pullToBank","Pull To Bank"),
			"hidden" : false,
			"width" : 160,
			resizable : false,
			hideable : false,
			"sortable" : false,
			draggable : false,
			forceFit : true,
			renderer : this.columnRenderer
		},{
			"colId" : "pullToBankRemarks",
			"colHeader" : getLabel("lbl.pullToBankRemarks","Pull To Bank Remarks"),
			"hidden" : false,
			"width" : 160,
			resizable : false,
			hideable : false,
			"sortable" : false,
			draggable : false,
			forceFit : true,
			renderer : this.columnRenderer
		}];

var approvalConfGrid = null;
var objArgs = null;
var lastFieldFlag = false;
function showApprovalConfirmationPopup(arrSelectedRecords, arrColumnModel,
		storeFields, objDataArgs) {
	var grid, strTitle = getLabel('approvalConfirmationPopup','Approval Confirmation Popup');
	$.each(arrSelectedRecords, function(index, cfg) {
				if(cfg.data.recKeyCheck == 'Y'){
					strTitle = getLabel('reckeyverificationpopup','Record Key Verification');
				}
				cfg.data.amount = setDigitAmtGroupFormat(cfg.data.amount);
			});
	$("#approvalConfirmationPopupDiv").dialog({
		bgiframe : true,
		resizable : false,
		draggable : false,
		modal : true,
		width :  "735px",
		title : strTitle,
		//dialogClass : 'highZIndex',
		open : function(event, ui) {
			objArgs = objDataArgs;
			approvalConfGrid = null;
			$('#approvalConfirmationGrid').empty();
			approvalConfGrid = createApprovalConfirmationGrid(
					arrSelectedRecords, arrColumnModel, storeFields);	
			$("#approvalConfirmationPopupDiv").dialog("option", "position", { my : "center", at : "center", of : window });
		},
		close : function(event, ui) {
		}
	});

}
function closeApprovalConfirmationPopup() {
	approvalConfGrid = null;
	$('#approvalConfirmationPopupDiv').dialog('close');
}

function approveSelectedRecords() {
	validateAmount(objArgs);
	//$(document).trigger("validateAmount", [objArgs]);
	
	//$(document).trigger("approvalConfirmed", [objArgs]);
	//closeApprovalConfirmationPopup();
}
function createSelectRecordsGridStore(arrSelectedRecords, storeFields) {
	var gridJson = {};
	var gridObjectJson = {};
	var arrData = [];
	if(!isEmpty(arrSelectedRecords)){
		$.each(arrSelectedRecords, function(index, cfg) {
				var objData = cloneObject(cfg.data);
				if(objData.amount && objData.recKeyCheck == 'Y'){
					objData.amount='';
				}
				arrData.push(objData);
			});
	}
	
	if (arrData) {
		gridJson['selectedRecords'] = arrData;
		gridJson['totalRows'] = arrData.length;
		gridJson['SUCCESS'] = true;
	}
	gridObjectJson['d'] = gridJson;

	var myStore = Ext.create('Ext.data.Store', {
				storeId : 'selectedRecordsStore',
				fields : storeFields,
				// pageSize : me.intPageSize,
				proxy : {
					type : 'pagingmemory',
					data : gridObjectJson,
					reader : {
						type : 'json',
						root : 'd.selectedRecords',
						totalProperty : 'totalRows',
						successProperty : 'SUCCESS'

					}
				}
			});
	myStore.load();
	return myStore;
}

function getColumns(arrColumnModel) {
	var arrColsPref = arrColumnModel;
	var arrCols = [], objCol = null, cfgCol = null;
	if (!Ext.isEmpty(arrColsPref)) {
		for (var i = 0; i < arrColsPref.length; i++) {
			objCol = arrColsPref[i];
			cfgCol = {};
			cfgCol.dataIndex = objCol.colId;
			cfgCol.text = objCol.colHeader;
			cfgCol.width = objCol.width;
			cfgCol.colType = objCol.colType;
			cfgCol.resizable = objCol.resizable;
			cfgCol.hideable = objCol.hideable;
			cfgCol.draggable = objCol.draggable;
			cfgCol.flex = objCol.flex;
			cfgCol.sortable = false;
			cfgCol.renderer = objCol.renderer;
			cfgCol.itemId = objCol.colId;
			cfgCol.xtype = objCol.xtype;
			// cfgCol.forceFit = objCol.forceFit;
			if (!Ext.isEmpty(objCol.colType) && cfgCol.colType === "amount") {
				cfgCol.editor = this.createAmountField('amntCol', '', '', false);
				cfgCol.editor.cls = 'amountField';
				cfgCol.align = 'right';
			}
			if(cfgCol.colType === "count")
				cfgCol.align = 'right';
				
			arrCols.push(cfgCol);
		}
	}
	return arrCols;
}

function createApprovalConfirmationGrid(arrSelectedRecords, arrColumnModel,
		storeFields) {
	var store = createSelectRecordsGridStore(arrSelectedRecords, storeFields);
	var recordCount = arrSelectedRecords.length;
	var grid = Ext.create('Ext.grid.Panel', {
				store : store,
				width : 1200,
				overflowY : false,
				menuDisabled : true,
				columns : getColumns(arrColumnModel),
				renderTo : 'approvalConfirmationGrid',
				plugins: [
			        Ext.create('Ext.grid.plugin.CellEditing', {
			            clicksToEdit: 1,
			            listeners: {
			            beforeedit: function(e, editor){
			            	if(editor.record.index == recordCount - 1){
			            		lastFieldFlag = true;
			            	} else {
			            		lastFieldFlag = false;
			            	}
			            	
			                if (editor.record.get('recKeyCheck') != 'Y' )
			                    return false;
			            }
			        }
			        })
			    ]
			});
	return grid;
}

function columnRenderer(value, metaData) {
	var strRetVal = "";
	var multipleCcy = "<a title='"+ getLabel("iconBatchFcy", "Multiple Currencies")+ "' class='iconlink grdlnk-notify-icon icon-gln-fcy'></a>";
	if(metaData.column.itemId == 'amount' && metaData.record.get('recKeyCheck') == 'Y' ) {
		metaData.tdCls = 'amountCol';
		if(!Ext.isEmpty(value)
			&& (value.indexOf('.') > -1)){
			value = value.replace(',', '');
			var amountObj = $('<input type="text">')
							.autoNumeric('init',
								{
									aSep : strGroupSeparator, 
									aDec : strDecimalSeparator, 
									mDec : strAmountMinFraction, 
									vMin : 0,
									wEmpty : 'zero'
								});
			amountObj.autoNumeric('set',value);
			strRetVal = amountObj.val();
			amountObj.remove();
		}
	}else if(metaData.column.itemId == 'srNo'){
		strRetVal = metaData.recordIndex+1;
	}
	else if(metaData.column.itemId == 'amount')
	{
		if (Ext.isEmpty(metaData.record.raw.currency)) 
		{
			if(value === "--CONFIDENTIAL--")
			{
				strRetVal = value;
			}
			else
			{
				strRetVal = multipleCcy + ' ' + value;
			}
		} 
		else
		{
			if(value === "--CONFIDENTIAL--")
			{
				strRetVal = value;									
			}
			else
			{
				strRetVal = metaData.record.raw.currency + ' ' + value;
			}
		}		
	}
	else
	{
		strRetVal = value;
	}
		
	if(!Ext.isEmpty(strRetVal)) {
		metaData.tdAttr = 'title="' + strRetVal + '"';
	}
	return strRetVal;
}
function createAmountField(fieldId, defValue, intMaxLength, isReadOnly) {
		var fieldCfg = {
			fieldCls : 'xn-valign-middle xn-form-text amountBox grid-field',
			allowBlank : true,
			itemId : fieldId,
			name : fieldId,
			disabled : isReadOnly,
			dataIndex : fieldId,
			value : defValue ? defValue : '',
			defValue : defValue ? defValue : '',
			focusable : true,
			listeners : {
				'render' : function(cmp, e) {
					cmp.getEl().on('mousedown', function(ev) {
								ev.preventDefault();
								cmp.focus(true);

							})
				},
				'afterrender' : function(field) {
					var strId = field.getEl() && field.getEl().id ? field
							.getEl().id : null;
					var inputField = strId ? $('#' + strId + ' input') : null;
					if (inputField) {
						inputField.autoNumeric("init", {
									aSep : strGroupSeparator,
									dGroup: strAmountDigitGroup,
									aDec : strDecimalSeparator,
									mDec : strAmountMinFraction,
									vMin : 0,
									vmax : '99999999999.99'
								});
					}
				},
				'focus' : function(field, e, eOpts) {
					e.stopEvent();
					field.focus(true);
				},
				'specialkey': function(field, event, eOpts) {
	                if (event.getKey() == event.TAB) {
	                	var strId = field.getActionEl()
	                			&& field.getActionEl().id
	                			? field.getActionEl().id
	                			: null;
	                	if(null != strId
	                		&& lastFieldFlag == true){
	                		event.stopEvent();
	                		$("#"+strId).trigger("blur");
	                	}
	                }
                }
			}
		};
		/*fieldCfg.maxLength = 11;// e.g 123456789.12
		if (strLayoutType === 'WIRESWIFTLAYOUT')
			fieldCfg.maxLength = 16;
		fieldCfg.enforceMaxLength = true;*/
		var field = Ext.create('Ext.form.TextField', fieldCfg);
		return field;
	}

var arrRejectRec = [];
var objRejectDataArgs = null, arrSelectedRecs= null,arrRecordsToAppr=null;
function showReckeyRejectConfirmationPopup(arrRecordsToReject,objRejDataArgs, arrSelectedRec,arrRecToAppr) {
	$("#reckeyRejectConfirmationPopupDiv").dialog({
		bgiframe : true,
		resizable : false,
		draggable : false,
		modal : true,
		width :  "535px",
		title : getLabel('error',
				'Error'),
		//dialogClass : 'highZIndex',
		open : function(event, ui) {
			arrRejectRec = arrRecordsToReject;
			objRejectDataArgs = !isEmpty(objRejDataArgs) ? objRejDataArgs[0] : [];
			arrSelectedRecs = arrSelectedRec;
			arrRecordsToAppr = arrRecToAppr;
			$("#reckeyRejectConfirmationPopupDiv").dialog("option", "position", { my : "center", at : "center", of : window });
		},
		close : function(event, ui) {
		}
	});

}

function validateAmount(objArgs) {
		var me = this, arrValidateRecords= [],arrRecordsToReject= [],arrRecordsToApprove= [],arrResponse = [],arrAmountValidate=[],strAmtValue='',objGridRecordAmt='';
		var showRejectConf = false, isAmountEmpty =false;
		var strUrl = 'services/paymentsbatch/validateAmount.json';
		var summaryGrid = objArgs[2];
		var arrSelectedRecords = objArgs[3];
		
		$.each(arrSelectedRecords, function(index, cfg) {
				if(cfg.data.recKeyCheck == 'Y'){
					cfg.popupSerialNo = index+1;
					arrValidateRecords.push(cfg);	
					if(!Ext.isEmpty(approvalConfGrid)){
						var objGridRecordAmt = (approvalConfGrid && approvalConfGrid.getStore() && approvalConfGrid.getStore().getAt(index) &&
												approvalConfGrid.getStore().getAt(index).get('amount')) ? 
											approvalConfGrid.getStore().getAt(index).get('amount') : '';
						
							if(!isEmpty(objGridRecordAmt)){
								var obj = $('<input type="text">');
								obj.autoNumeric('init');
								obj.val(objGridRecordAmt);
								strAmtValue = obj.autoNumeric('get');
								obj.remove();
							}
						if(!isEmpty(strAmtValue))					
							arrAmountValidate.push(parseFloat(strAmtValue));
						else
							isAmountEmpty = true;
					}
				}else if (cfg.data.recKeyCheck == 'N'){
					arrRecordsToApprove.push(cfg);
				}
			});
		if(isAmountEmpty)
		{
			showAmountEmptyWarningPopup();
		}else if (!Ext.isEmpty(summaryGrid) && !Ext.isEmpty(arrValidateRecords) && (arrValidateRecords.length === arrAmountValidate.length)) {
			var arrayJson = new Array();
			var records = (arrValidateRecords || []);
			for (var index = 0; index < records.length; index++) {
				arrayJson.push({
							serialNo : summaryGrid.getStore()
									.indexOf(records[index])
									+ 1,
							popupSerialNo : records[index].popupSerialNo,
							identifier : records[index].data.identifier,
							userMessage : arrAmountValidate[index]
						});
			}
			if (arrayJson)
				arrayJson = arrayJson.sort(function(valA, valB) {
							return valA.serialNo - valB.serialNo
						});
			Ext.Ajax.request({
						url : strUrl,
						method : 'POST',
						jsonData : Ext.encode(arrayJson),
						success : function(jsonData) {
						var jsonRes = Ext.JSON.decode(jsonData.responseText);
						var srNos = '';
						var objRec = null;
							if(jsonRes && jsonRes.d && jsonRes.d.instrumentActions){
								arrResponse = jsonRes.d.instrumentActions;
								
								$.each(arrResponse, function(index, cfg) {
										if(cfg.success == 'Y'){
											objRec = summaryGrid.getStore().getAt(cfg.serialNo-1)
											objRec.set('recKeyIdentifier',cfg.recKeyValidation);
											objRec.commit();
											arrRecordsToApprove.push(objRec);
										}else if(cfg.success == 'N'){
											srNos+=cfg.popupSerialNo+',';
											arrRecordsToReject.push(summaryGrid.getStore().getAt(cfg.serialNo-1)); 
											showRejectConf = true;
										}
									});
								objArgs[3] = arrRecordsToApprove;
								if(showRejectConf){
									showReckeyRejectConfirmationPopup(arrRecordsToReject,[objArgs],arrSelectedRecords,arrRecordsToApprove);
									$('.srNos').text(srNos.slice(0,-1));
								}else{
									$(document).trigger("approvalConfirmed", [objArgs]);
									closeApprovalConfirmationPopup();
								}
							}
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
										cls : 't7-popup',
										icon : Ext.MessageBox.ERROR
									});
						}
					});
		}else{
			$(document).trigger("approvalConfirmed", [objArgs]);
			closeApprovalConfirmationPopup();
		}
	}

function closeReckeyRejectConfirmationPopup() {
	if(!isEmpty(arrSelectedRecs))
		objArgs[3]=arrSelectedRecs;
	$('#reckeyRejectConfirmationPopupDiv').dialog('close');
}
function rejectSelectedRecords(/*arrRejectRec, objRejectDataArgs*/){
	var rejectSuccess = true;
	var summGrd =objRejectDataArgs[2];
	var strUrl = 'services/paymentsbatch/reject.json';
	objRejectDataArgs[3]=arrRecordsToAppr;
	
			var arrayJson = new Array();
			var records = (arrRejectRec || []);
			for (var index = 0; index < records.length; index++) {
				arrayJson.push({
							serialNo : '',
							identifier : records[index].data.identifier,
							userMessage : 'Record Key verification failed.'
						});
			}
			if (arrayJson)
				arrayJson = arrayJson.sort(function(valA, valB) {
							return valA.serialNo - valB.serialNo
						});
			Ext.Ajax.request({
						url : strUrl,
						method : 'POST',
						jsonData : Ext.encode(arrayJson),
						success : function(jsonData) {
						var jsonRes = Ext.JSON.decode(jsonData.responseText);
						if(jsonRes && jsonRes.d && jsonRes.d.instrumentActions){
						var arrResp = jsonRes.d.instrumentActions;
								$.each(arrResp, function(index, cfg) {
										if(cfg.success == 'N'){
											rejectSuccess = false;
										}
									});
								if(rejectSuccess){
									summGrd.refreshData();
									$(document).trigger("approvalConfirmed", [objRejectDataArgs]);
									closeReckeyRejectConfirmationPopup();
									closeApprovalConfirmationPopup();
								}
							}
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
										cls : 't7-popup',
										icon : Ext.MessageBox.ERROR
									});
						}
					});
}

function cloneObject(obj) {
	return JSON.parse(JSON.stringify(obj));
}
function showAmountEmptyWarningPopup() {
	var _objDialog = $('#amountEmptyWarningPopup');
	_objDialog.dialog({
				bgiframe : true,
				autoOpen : false,
				modal : true,
				resizable : false,
				width : "320px",
				draggable : false
			});
	_objDialog.dialog('open');
	_objDialog.dialog('option', 'position', 'center');
}
function closeAmountWarningPopup(){
	$('#amountEmptyWarningPopup').dialog('close');
}

function getJsonObj(jsonObject) {
    var jsonObj ='';
    if(jsonObject  instanceof Object ==false)
           jsonObj =JSON.parse(jsonObject);
    if(jsonObject  instanceof Array)
           jsonObj =jsonObject;
    for (var i = 0; i < jsonObj.length; i++) {
           jsonObj[i].DESCR =  getLabel(jsonObj[i].CODE,jsonObj[i].DESCR);
    }
    if(jsonObject  instanceof Object ==false)
           jsonObj = JSON.stringify(jsonObj)
    return jsonObj;
}