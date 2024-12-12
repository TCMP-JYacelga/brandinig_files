var uploadSummaryLabelsMap = 
{		"rejectRemarkPopUpFldLbl" : "Reject Remark",	
		"actionClone" : "Copy Record",	
		"actionSubmit" : "Submit",	
		"actionApprove" : "Approve",	
		"actionReject" : "Reject",	
		"actionEnable" : "Enable",	
		"actionDisable" : "Suspend",	
		"actionDiscard" : "Discard",	
		"editToolTip" : "Modify Record",
"submitToolTip":"Submit",
"btnCancel":"Cancel",
"btnOk":"Ok",
"clonePopUpTitle":"Interface Cloning",
"editRecord":"Edit Record",
"submittedStatus":"New Submitted",
"prfMstHistoryPopUpdateRemark":"Remark",
"prfMstHistoryPopUpdateAction":"Action",
"prfMstHistoryPopUpdateDate":"Date Time",
"submittedRequestStatus":"Submitted",
"grid.column.company":"Company Name",
"none":"None",
"filterBy":"Filter By: ",
"lbl.codeMap.createNew":"Code Map",
"codeMapRequestCreate":"Create New :",
"lbl.codeMap":"Code Map Master",
"lblerror":"Error",
"codeMapMoreMenuTitle":"more",
"actions":"Actions",
"lblCodeMapGrid":"Code Map",
"anyMatch":"Any Match",
"exactMatch":"Exact Match",
"searchOnPage":"Search on Page",
"saveFilter":"Save Filters",
"lbl.codeMap.client":"Client",
"lbl.codeMap.Seller":"Financial Institution",
"prefSavedMsg":"Preferences Saved Successfully",
"clone":"Clone",
"approve":"Approve",
"codeMapErrorPopUpMsg":"Error while fetching data..!",
"codeMapErrorPopUpTitle":"Error",
"prfRejectRemarkPopUpFldLbl":"Reject Remark",
"prfRejectRemarkPopUpTitle":"Please enter reject remark",
"codeMapStatus":"Status",
"codeMapOthersVal":"Other Value",
"codeMapDefaultVal":"Default Value",
"codeMapDescription":"Description",
"codeMapName":"Name",
		"model" : "Model",
		"dataStore" : "Medium",
		"lbl.modules.01" :"BR",
		"lbl.modules.02" :"Payments",
		"lbl.modules.03" :"Admin",
		"lbl.modules.04" :"Incoming Payments",
		"lbl.modules.05" :"Receivables",
		"lbl.modules.06" :"SCF",
		"lbl.modules.09" :"Trade",
		"lbl.modules.10" :"Forecasting",
		"lbl.modules.11" :"Incoming ACH",
		"lbl.modules.15" :"Bank Reports",
		"lbl.modules.13" :"Positive Pay",
		"lbl.modules.14" :"Checks",
		"lbl.modules.21" :"Sub Accounts",
		"FI" : "Financial Institution",
		"category" : "Interface Category",
		"type" : "Interface Type",
		"bankInterfaceCenter": "Bank Interface Center",
		"customInterfaceCenter" : "Customer Interface Center",
		"groupBy" : "Group By",
		"interfaces" : "Interfaces",
		"viewToolTip" : "View Record",
		"historyToolTip" : "View History",
		"client" : "Company Name",
		"status" : "Status",
		"all" : "ALL",
		"uploads" : "Uploads",
		"downloads" : "Downloads",
		"standard" : "Standard",
		"custom" : "Custom",
		"newStatus" : "New",
		"New / Draft" : "",
		"modifiedStatus" : "Modified",
		"deleteStatus" : "Delete Request",
		"authorizedStatus" : "Approved",
		"enableStatus" : "Enable Request",
		"disableStatus" : "Suspend Request",
		"disabledStatus" : "Suspended",
		"rejectedStatus" : "New Rejected",
		"allCompanies" : "All Companies",
		"moreMenuTitle" : "more",
		"lbl.CodeMapMst":"Code Map Master History",
		"codeMapHistoryColumnUserId":"User ID",
		"codeMapHistoryColumnDateTime":"Date Time",
		"codeMapHistoryColumnRejectRemark":"Reject Remark",
		"codeMapHistoryColumnStatus":"Status",
		"btnClose":"Close",
		"rejectRemarkPopUpTitle" : "Please Enter Reject Remark",
		"lblError" : "Error",
		"lblDataError" : "Error while fetching data..!",
		"flavour" : "Flavour",
		"modifiedRejectStatus" : "Modified Request Rejected",
		"disableRequestStatus" : "Suspend Request Rejected",
		"enableRequestStatus" : "Enable Request Rejected",
		"attachSecurityPrf" : "Attach Security Profile",
		"historyPopUpErrorTitle" : "Error",
		"historyPopUpNoUrlError" : "Sorry no URl provided for History",
		"historyErrorPopUpMsg" : "Error while fetching data..!",
		"interfaceHistory" : "Interface History",
		"interfaceCode" : "Interface Code",
		"description" : "Description",
		"maker" : "Maker",
		"checker" : "Checker",
		"close" : "Close",
		"historyPopUpdateDate" : "Date Time",
		"historyPopUpdateAction" : "Action",
		"historyPopUpdateRemark" : "Remark",
		"summInformation" : "Summary",
		"stdInterface" : "Standard Interface",
		"custInterface" : "Custom Interface",
		"interfaceName" : "Interface Code",
		"parentInterface" : "Parent Interface",
		"securityProfile" : "Security Profile",
		"moduleName" : "Module Name",
		"flavor" : "Flavor",
		"selectSecurityPrf" : "..Select",
		"editSecurityPrf" : "..Edit",
		"action" : "Action",
		"autoCompleterEmptyText" : "Enter Keyword or %",
		"suggestionBoxLoadingText" : "Searching...",
		"suggestionBoxEmptyText" : "No match found.",
		"pendingMyApproval" : "Pending My Approval"
};
var objBankDefaultStandardViewPref =
{
	"widgetPref" :
	{
		"pgSize" : "10",
		"gridCols" :
		[
		 	 /* {
				"colId" : "mapId",
				"colDesc" : "Interface Id"
			  },
			  */
		 	 {
		 		"colId" : "clientDesc",
				"colDesc" : "Company Name"
		 	 },{
				"colId" : "interfaceName",
				"colDesc" : "Interface Code"
			  },{
				"colId" : "interfaceType",
				"colDesc" : "Interface Type"
			  },{
				"colId" : "interfaceFlavor",
				"colDesc" : "Flavor"
			  },{
				"colId" : "parentInterfaceName",
				"colDesc" : "Parent Interface"
			 },{
				"colId" : "interfaceMedium",
				"colDesc" : "Medium"
			 },{
				"colId" : "interfaceCateory",
				"colDesc" : "Category"
			 },{
				"colId" : "requestStateDesc",
				"colDesc" : "Status"
			 }
		]
	}
};
var objClientDefaultStandardViewPref =
{
	"widgetPref" :
	{
		"pgSize" : "10",
		"gridCols" :
		[
		 	/*  {
				"colId" : "mapId",
				"colDesc" : "Interface Id"
			  },*/
		 	 {
		 		"colId" : "clientDesc",
				"colDesc" : "Company Name"
		 	 },{
				"colId" : "interfaceName",
				"colDesc" : "Interface Code"
			  },{
				"colId" : "interfaceType",
				"colDesc" : "Interface Type"
			  },{
				"colId" : "interfaceFlavor",
				"colDesc" : "Flavor"
			  },{
				"colId" : "parentInterfaceName",
				"colDesc" : "Parent Interface"
			 },{
				"colId" : "securityProfileId",
				"colDesc" : "Security Profile"
			 },{
				"colId" : "interfaceCateory",
				"colDesc" : "Category"
			 },{
				"colId" : "requestStateDesc",
				"colDesc" : "Status"
			 }
		]
	}
};
var objClientCountDefaultStandardViewPref =
{
	"widgetPref" :
	{
		"pgSize" : "10",
		"gridCols" :
		[
		 	 {
				"colId" : "interfaceName",
				"colDesc" : "Interface Code"
			  },{
				"colId" : "interfaceType",
				"colDesc" : "Interface Type"
			  },{
				"colId" : "interfaceFlavor",
				"colDesc" : "Flavor"
			  },{
				"colId" : "parentInterfaceName",
				"colDesc" : "Parent Interface"
			 },{
				"colId" : "securityProfileId",
				"colDesc" : "Security Profile"
			 },{
				"colId" : "interfaceCateory",
				"colDesc" : "Category"
			 },{
				"colId" : "requestStateDesc",
				"colDesc" : "Status"
			 }
		]
	}
};
