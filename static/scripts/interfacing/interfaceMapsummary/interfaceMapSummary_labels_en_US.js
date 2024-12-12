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
"clonePopUpTitle":"Interface Cloning",
"createNew":"Create : ",
"uploadClientdefinition":"Customer Interface Center",
"uploadBankdefinition":"Bank Interface Center",
"summinformation":"Summary",
"clearFilter":"Clear",
"preferences":"Preferences : ",
"custom":"Custom",
"standard":"Standard",
"downloads":"Uploads",
"uploads":"Imports",
"all":"All",
"HistoryPopUpTitle":"Error",
"HistoryPopUpdateRemark":"Remark",
"HistoryPopUpdateAction":"Action",
"HistoryPopUpdateDate":"Date Time",
"btnOk":"Ok",
"HistoryMstChecker":"Checker",
"HistoryMstMaker":"Maker",
"HistoryDescription":"Description",
"interfaceCode":"Interface Code",
"uploadHistoryTitle":"Interface History",
"instrumentsMoreMenuTitle":"more",
"btnDiscard":"Discard",
"btnDisable":"Disable",
"btnEnable":"Enable",
"btnReject":"Reject",
"btnApprove":"Approve",
"attachSecurityPrf":"Attach Security Profile",
"enableRequestStatus":"Enable Request Rejected",
"disableRequestStatus":"Disable Request Rejected",
"modifiedRejectStatus":"Modified Request Rejected",
"rejectedStatus":"Rejected",
"disabledStatus":"Disabled",
"disableStatus":"Disable Request",
"enableStatus":"Enable Request",
"authorizedStatus":"Authorized",
"deleteStatus":"Delete Request",
"modifiedStatus":"Modified",
"newStatus":"New / Draft",
"AllStatus":"All",
"SaveFilterPopupTitle":"Message",
"errorTitle":"Error",
"messageTitle":"Message",
"status":"Status",
"Falvour":"Flavour",
"client":"Client",
"none":"None",
"codeMapDtlErrorPopUpMsg":"Error while fetching data..!",
"codeMapDtlErrorPopUpTitle":"Error",
		"model" : "Model",
		"dataStore" : "Medium",
		"category" : "Category",
		"prfMstActionDelete" : "Delete",
		"codeMapDtlMoreMenuTitle" : "more",
		"lbl.codeMapDtl.AddNew" : "Add Record",
		"searchOnPage" : "Search on Page",
		"exactMatch" : "Exact Match",
		"anyMatch" : "Any Match",
		"lbl.codeMapDtlsummary.Codes" : "Codes",
		"actions" : "Actions",
		"codeMapDtlInputValue" : "Input Value",
		"codeMapDtlOutputValue" : "Output Value",
		"lbl.codeMap.Seller" : "Financial Institution",
		"lbl.codeMap.client" : "Client",
		"saveFilter" : "Save Filters",
		"lbl.codeMap" : "Code Map Master",
		"codeMapRequestCreate" : "Create New :",
		"lbl.codeMap.createNew" : "Create Code Map",
		"filterBy" : "Filter By:",
		"codeMapMoreMenuTitle" : "more",
		"lblCodeMapGrid" : "Code Map",
		"codeMapName" : "Name",
		"codeMapDescription" : "Description",
		"codeMapDefaultVal" : "Default Value",
		"codeMapOthersVal" : "Other Value",
		"codeMapStatus" : "Status",
		"lbl.code.codeMapName" : "Name",
		"lblerror" : "Error",
		"historyPopUpNoUrlError" : "Sorry no URl provided for History",
		"lbl.CodeMapMst" : "Code Map Master History",
		"prfMstDescription" : "Description",
		"prfMstMaker" : "Maker",
		"prfMstChecker" : "Checker",
		"btnClose" : "Close",
		"prfMstHistoryPopUpDescription" : "Description",
		"prfMstHistoryPopUpdateDate" : "Date Time",
		"prfMstHistoryPopUpdateAction" : "Action",
		"prfMstHistoryPopUpdateRemark" : "Remark",
		"lblDataError" : "Error while fetching data..!",
		"prfRejectRemarkPopUpTitle" : "Please Enter Reject Remark",
		"prfRejectRemarkPopUpFldLbl" : "Reject Remark",
		"codeMapErrorPopUpTitle" : "Error",
		"codeMapErrorPopUpMsg" : "Error while fetching data..!",
		"historyToolTip" : "View History",
		"viewToolTip" : "View Record",
		"approve" : "Approve",
		"prefSavedMsg" : "Preferences Saved Successfully" 
			

			
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
				"colDesc" : "Client"
		 	 },{
				"colId" : "interfaceName",
				"colDesc" : "Interface Name"
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
				"colDesc" : "Client"
		 	 },{
				"colId" : "interfaceName",
				"colDesc" : "Interface Name"
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
				"colDesc" : "Interface Name"
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
