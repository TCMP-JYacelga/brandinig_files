
function filterList(status)
{
	
	var frm = document.getElementById("frmMain");
	frm.action = "filteredList.form";
	frm.target ="";
	frm.method = "POST";
	frm.submit();	
}
function filterListAuth(status)
{
	
	var frm = document.getElementById("frmMain");
	frm.action = "filteredAuthList.form";
	frm.target ="";
	frm.method = "POST";
	frm.submit();	
}



function disableMessageFormField(index)
{
	
	var frm = document.getElementById("frmMain");
	document.getElementById("txtIndex").value = index;	
	frm.action = "disableFilter.form";
	frm.target ="";
	frm.method = "POST";
	frm.submit();
	
	
	}

function enableMessageForm(index)
{
	
	var frm = document.getElementById("frmMain");
	document.getElementById("txtIndex").value = index;	
	frm.action = "enableFilter.form";
	frm.target ="";
	frm.method = "POST";
	frm.submit();
	
	
	}
function changePage(navType, newPage) 
{
	
	var frm = document.getElementById('frmMain');
	if (!frm) 
	{
		alert(_errMessages.ERR_NOFORM);
		return false;
	}
	frm.selectedRecordIndex.value = -1;
	frm.curPage.value = newPage;
	switch(navType) 
	{
		case 'first':
			frm.action = 'filterMasterList.form';
			break;
		case 'prev':
			frm.action = 'filterMasterList.form';
			break;
		case 'next':
			frm.action = 'filterMasterList.form';
			break;
		case 'last':
			frm.action = 'filterMasterList.form';
			break;
		case 'input':
			frm.action = 'filterMasterList.form';
			break;
		default:
			alert(_errMessages.ERR_NAVIGATE);
			return false;
	}
	frm.target = "";
	frm.method = "POST";
	frm.submit();
}

function changeSort(sortCol, sortOrd, colId) 
{
	
	var frm = document.getElementById('frmMain');
	if (!frm) {
		alert(_errMessages.ERR_NOFORM);
		return false;
	}
	if (!isEmpty(sortCol) && sortCol != 'NONE') 
	{
	
		
		document.getElementById('txtSortColName').value = sortCol;
		document.getElementById('txtSortOrder').value = sortOrd;
		document.getElementById('txtSortColId').value=colId;
		
   		frm.action = 'filterMasterList.form';
   		frm.target = "";
   		frm.method = "POST";
   		frm.submit();
	}
	else {
	alert(_errMessages.ERR_NOFORM);
	return false;
	}
}



function acceptMessageFormsForm(index)
{
	var frm = document.getElementById("frmMain");
	document.getElementById("txtIndex").value = index;	
	frm.action = "approveFilterForm.form";
	frm.target ="";
	frm.method = "POST";
	frm.submit();
}
function rejectMessageFormsForm(index)
{
	var frm = document.getElementById("frmMain");
	var rejrmks=prompt("Please Provide Reject Remarks","");	
	if (rejrmks!=null && rejrmks!="")
	{	
		document.getElementById("rejectRemarks").value = rejrmks;
		document.getElementById("txtIndex").value = index;	
		frm.action = "rejectFilterMasterForm.form";
		frm.target ="";
		frm.method = "POST";
		frm.submit();
	}
	else
	{
		alert ("Please provide Reject Remarks and click OK");
	}	
}

function showHistoryForm(strAction, index)
{
	
	var intTop  = (screen.availHeight - 300)/2;
	var intLeft = (screen.availWidth - 400)/2;
	var strAttr = "dependent=yes,scrollbars=yes,";
	strAttr = strAttr + "left=" + intLeft + ",";
	strAttr = strAttr + "top=" + intTop + ",";
	strAttr = strAttr + "width=400,height=300";

	var frm = document.forms["frmMain"];
	document.getElementById("txtIndex").value = index;
	if ("AUTH" == strAction)
		frm.action = "filterMasterAuthHistory.hist";
	else
		frm.action = "filterMasterHistory.hist";
	frm.target = "hWinHistory";
	frm.method = "POST";

	window.open ("", "hWinHistory", strAttr);
	frm.submit();
}
function privateField(index,status)
{
	
	var frm = document.getElementById("frmMain");
	document.getElementById("txtIndex").value = index;	
	document.getElementById("Status").value = status;	
	alert("Status2"+document.getElementById("Status").value);
	frm.action = "privateFilterMasterField.form";
	frm.target ="";
	frm.method = "POST";
	frm.submit();	
	/*function getFilterData(ctrl) {
		var strData = {};
		strData['recKeyNo'] = ctrl.options[ctrl.selectedIndex].value;
		strData["screenId"] = 'INSTRUMENTS_FILTER';
		strData[csrfTokenName] = csrfTokenValue;	
		$(document).ajaxStart($.blockUI).ajaxStop($.unblockUI);
		$.ajax({
		        type: 'POST',	
		        data:strData,
		        url: "filterValues.formx",	       
		        success: function(data)
		        {
		           if (data!=null) 
				   { 
		        	   valuesRetrieved(data);							   
				   }       	
		        }
		});
	}*/
}
