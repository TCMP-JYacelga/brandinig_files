function showWelcomePage()
{
	window.location = "/WEB-INF/secure/welcome.jsp";
}

function showList(strUrl)
{
	window.location = strUrl;
}

function showHistoryForm(strUrl, index)
{	
	var intTop  = (screen.availHeight - 300)/2;
	var intLeft = (screen.availWidth - 400)/2;
	var strAttr = "dependent=yes,scrollbars=yes,";
	strAttr = strAttr + "left=" + intLeft + ",";
	strAttr = strAttr + "top=" + intTop + ",";
	strAttr = strAttr + "width=390,height=300";

	var frm = document.forms["frmMain"];
	document.getElementById("txtIndex").value = index;
	frm.action = strUrl;
	frm.target = "hWinHistory";
	frm.method = "POST";

	window.open ("", "hWinHistory", strAttr);
	frm.submit();
}

function getRejectRemarksDetails(strUrl, index)
{	
	var frm = document.forms["frmMain"]; 
	frm.txtIndex.value = strUrl[1];
	frm.rejectRemarks.value = index;
	frm.action = strUrl[0];
	frm.target = "";	
	frm.method = "POST";
	frm.submit();
}

function showViewForm(strUrl, index)
{
	var frm = document.forms["frmMain"]; 
	document.getElementById("txtIndex").value = index;

	frm.action = strUrl;
	frm.target = "";	
	frm.method = "POST";
	frm.submit();
}

function showEditForm(strUrl, index)
{
	var frm = document.forms["frmMain"]; 
	document.getElementById("txtIndex").value = index;
	frm.action = strUrl;
	frm.target = "";	
	frm.method = "POST";
	frm.submit();
}

// Enable, Disable, Accept and Reject requests
function enableRecord(strUrl, index)
{
	var frm = document.forms["frmMain"]; 
	document.getElementById("txtIndex").value = index;
	frm.action = strUrl;
	frm.target = "";	
	frm.method = "POST";
	frm.submit();
}
function filterList(strUrl)
{
	document.getElementById("txtCurrent").value = 0;
	document.getElementById("txtIndex").value = 0;
	var frm = document.forms["frmMain"]; 
	frm.action = strUrl;
	frm.target = "";	
	frm.method = "POST";
	frm.submit();
}

function disableRecord(strUrl, index)
{
	var frm = document.forms["frmMain"]; 
	document.getElementById("txtIndex").value = index;

	frm.action = strUrl;
	frm.target = "";	
	frm.method = "POST";
	frm.submit();
}

function acceptRecord(strUrl, index)
{
	var frm = document.forms["frmMain"]; 
	document.getElementById("txtIndex").value = index;

	frm.action = strUrl;
	frm.target = "";		
	frm.method = 'POST';
	frm.submit();
}

// List navigation
function prevPage(strUrl, intPg)
{
	var frm = document.forms["frmMain"]; 
	document.getElementById("txtCurrent").value = intPg;

	frm.action = strUrl;
	frm.target = "";		
	frm.method = "POST";
	frm.submit();
}

function nextPage(strUrl, intPg)
{
	var frm = document.forms["frmMain"]; 
	document.getElementById("txtCurrent").value = intPg;	

	frm.action = strUrl;
	frm.target = "";		
	frm.method = "POST";
	frm.submit();
}

function goPgNmbr(mode, totalPages)
{	
	var frm = document.forms["frmMain"];
	var strUrl = null; 
	frm.target ="";
	
	if(mode == "AUTH")
		strUrl = "authLMSUserAccountList.form";
	else
		strUrl = "lMSUserAccountList.form"
 
	var pgNmbr = document.getElementById("goPageNumbr").value;	
	document.getElementById("txtCurrent").value = pgNmbr - 1 ;
	if (isNaN(pgNmbr) || isNaN(totalPages))
	{
		showError("Page number can accept integer only",null);
		return false;
	}
	
	if (pgNmbr > totalPages)	
	{
		showError('Page Number cannot be greater than total number of pages!',null);
			return;
	}
	else if (pgNmbr<=0)
	{
		showError('Page Number cannot be Zero or less!',null);
			return;
	}
	
	frm.action = strUrl;
	frm.target = "";		
	frm.method = "POST";
	frm.submit();
	
}	
	

// Details
function deleteDetail(strUrl, index)
{
	var frm = document.forms["frmMain"]; 
	document.getElementById("txtIndex").value = index;

	frm.action = strUrl;
	frm.target = "";	
	frm.method = "POST";
	frm.submit();
}

function viewDetailForm(strUrl, index)
{
	var frm = document.forms["frmMain"]; 
	document.getElementById("txtIndex").value = index;

	frm.action = strUrl;
	frm.target = "";	
	frm.method = "POST";
	frm.submit();
}

function editDetailForm(strUrl, index)
{
	var frm = document.forms["frmMain"]; 
	document.getElementById("txtIndex").value = index;

	frm.action = strUrl;
	frm.target = "";	
	frm.method = "POST";
	frm.submit();
}

function unassignRecord(strUrl, index)
{
	var frm = document.forms["frmMain"]; 
	document.getElementById("txtIndex").value = index;

	frm.action = strUrl;
	frm.target = "";	
	frm.method = "POST";
	frm.submit();
}

function assignRecord(strUrl, index, accountDesc,lmsAccMstId)
{
	var frm = document.forms["frmMain"]; 
	document.getElementById("txtIndex").value = index;
	document.getElementById("accountDesc").value = accountDesc;
	document.getElementById("lmsAccMstId").value = lmsAccMstId;
	

	frm.action = strUrl;
	frm.target = "";	
	frm.method = "POST";
	frm.submit();
}

function discardRecord(strUrl, index)
{

	var frm = document.forms["frmMain"]; 
	document.getElementById("txtIndex").value = index;

	frm.action = strUrl;
	frm.target = "";		
	frm.method = "POST";
	frm.submit();
}

function back()
{
	window.location = strUrl;
}

function getRejectRemarks(strUrl)
{	
	window.opener.document.getElementById("rejectRemarks").value = document.getElementById("rejectRemarks").value;
	var frm = window.opener.document.forms["frmMain"];	

	frm.action = strUrl;		
	frm.method = "POST";
	frm.submit();
	window.close();
			
}


function call(str)
{
	if(str=='F3')
	{
		if(mode == "AUTH")
			filterList('authLMSUserAccountList.form');
		else
			filterList('lMSUserAccountList.form');
	}
	if(str=='F12')
	{
		showList('welcome.jsp');
	}			
}
