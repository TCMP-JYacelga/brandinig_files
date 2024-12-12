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
	document.getElementById("current_index").value = index;
	frm.appendChild(createFormField('INPUT', 'HIDDEN',csrfTokenName, csrfTokenValue));
	frm.action = strUrl;
	frm.target = "hWinHistory";
	frm.method = "POST";

	window.open ("", "hWinHistory", strAttr);
	frm.submit();
}

function getRejectRemarksDetails(strUrl, index)
{	
	var frm = document.forms["frmMain"]; 
	frm.current_index.value = strUrl[1];
    if(index.length > 255)
    {
         showError("Reject Remarks Length Cannot Be Greater than 255 Characters", null);    
         return false;
    }
	frm.rejectRemarks.value = index;
	frm.appendChild(createFormField('INPUT', 'HIDDEN',csrfTokenName, csrfTokenValue));
	frm.action = strUrl[0];
	frm.target = "";	
	frm.method = "POST";
	frm.submit();
}

function showViewForm(strUrl, index)
{
	var frm = document.forms["frmMain"]; 
	document.getElementById("current_index").value = index;
	frm.appendChild(createFormField('INPUT', 'HIDDEN',csrfTokenName, csrfTokenValue));
	frm.action = strUrl;
	frm.target = "";	
	frm.method = "POST";
	frm.submit();
}

function showEditForm(strUrl, index)
{
	var frm = document.forms["frmMain"]; 
	document.getElementById("current_index").value = index;
	frm.appendChild(createFormField('INPUT', 'HIDDEN',csrfTokenName, csrfTokenValue));
	frm.action = strUrl;
	frm.target = "";	
	frm.method = "POST";
	frm.submit();
}

// Enable, Disable, Accept and Reject requests
function enableRecord(strUrl, index)
{
	var frm = document.forms["frmMain"]; 
	document.getElementById("current_index").value = index;
	frm.appendChild(createFormField('INPUT', 'HIDDEN',csrfTokenName, csrfTokenValue));
	frm.action = strUrl;
	frm.target = "";	
	frm.method = "POST";
	frm.submit();
}
function filterList(strUrl)
{
	document.getElementById("current_page").value = '';
	document.getElementById("current_index").value = 0;
	var frm = document.forms["frmMain"]; 
	frm.appendChild(createFormField('INPUT', 'HIDDEN',csrfTokenName, csrfTokenValue));
	frm.action = strUrl;
	frm.target = "";	
	frm.method = "POST";
	frm.submit();
}

function disableRecord(strUrl, index)
{
	var frm = document.forms["frmMain"]; 
	document.getElementById("current_index").value = index;
	frm.appendChild(createFormField('INPUT', 'HIDDEN',csrfTokenName, csrfTokenValue));
	frm.action = strUrl;
	frm.target = "";	
	frm.method = "POST";
	frm.submit();
}

function acceptRecord(strUrl, index)
{
	var frm = document.forms["frmMain"]; 
	document.getElementById("current_index").value = index;
	frm.appendChild(createFormField('INPUT', 'HIDDEN',csrfTokenName, csrfTokenValue));
	frm.action = strUrl;
	frm.target = "";		
	frm.method = 'POST';
	frm.submit();
}

// List navigation
function prevPage(strUrl, intPg)
{
	var frm = document.forms["frmMain"]; 
	document.getElementById("current_page").value = intPg;
	frm.appendChild(createFormField('INPUT', 'HIDDEN',csrfTokenName, csrfTokenValue));
	frm.action = strUrl;
	frm.target = "";		
	frm.method = "POST";
	frm.submit();
}

function nextPage(strUrl, intPg)
{
	var frm = document.forms["frmMain"]; 
	document.getElementById("current_page").value = intPg;	
	frm.appendChild(createFormField('INPUT', 'HIDDEN',csrfTokenName, csrfTokenValue));
	frm.action = strUrl;
	frm.target = "";		
	frm.method = "POST";
	frm.submit();
}

// Details
function deleteDetail(strUrl, index)
{
	var frm = document.forms["frmMain"]; 
	document.getElementById("current_index").value = index;
	frm.appendChild(createFormField('INPUT', 'HIDDEN',csrfTokenName, csrfTokenValue));
	frm.action = strUrl;
	frm.target = "";	
	frm.method = "POST";
	frm.submit();
}

function viewDetailForm(strUrl, index)
{
	var frm = document.forms["frmMain"]; 
	document.getElementById("current_index").value = index;
	frm.appendChild(createFormField('INPUT', 'HIDDEN',csrfTokenName, csrfTokenValue));
	frm.action = strUrl;
	frm.target = "";	
	frm.method = "POST";
	frm.submit();
}

function editDetailForm(strUrl, index)
{
	var frm = document.forms["frmMain"]; 
	document.getElementById("current_index").value = index;
	frm.appendChild(createFormField('INPUT', 'HIDDEN',csrfTokenName, csrfTokenValue));
	frm.action = strUrl;
	frm.target = "";	
	frm.method = "POST";
	frm.submit();
}

function unassignRecord(strUrl, index)
{
	var frm = document.forms["frmMain"]; 
	document.getElementById("current_index").value = index;
	frm.appendChild(createFormField('INPUT', 'HIDDEN',csrfTokenName, csrfTokenValue));
	frm.action = strUrl;
	frm.target = "";	
	frm.method = "POST";
	frm.submit();
}

function assignRecord(strUrl, index)
{
	var frm = document.forms["frmMain"]; 
	document.getElementById("current_index").value = index;
	frm.appendChild(createFormField('INPUT', 'HIDDEN',csrfTokenName, csrfTokenValue));
	frm.action = strUrl;
	frm.target = "";	
	frm.method = "POST";
	frm.submit();
}

function discardRecord(strUrl, index)
{

	var frm = document.forms["frmMain"]; 
	document.getElementById("current_index").value = index;
	frm.appendChild(createFormField('INPUT', 'HIDDEN',csrfTokenName, csrfTokenValue));
	frm.action = strUrl;
	frm.target = "";		
	frm.method = "POST";
	frm.submit();
}

function back()
{
	window.location = strUrl;
}

function call(str)
{
	if(str=='F3')
	{
		if(mode == "AUTH")
			filterList('authCPMyProductList.form');
		else
			filterList('cPMyProductList.form');
	}
	if(str=='F12')
	{
		showList('welcome.jsp');
	}			
}

function rejectRecord(arrData, strRemarks)
{
	var frm = document.forms["frmMain"]; 

	if (strRemarks.length > 255)
	{
		alert("Reject Remarks Length Cannot Be Greater than 255 Characters!");	
		return false;
	}
	else
	{
		frm.rejectRemarks.value = strRemarks;
		frm.current_index.value = arrData[0];
		frm.appendChild(createFormField('INPUT', 'HIDDEN',csrfTokenName, csrfTokenValue));
		frm.target = "";
		frm.action = "rejectCPMyProduct.form";
		frm.method = 'POST';
		frm.submit();
	}
}

function setSellerDtlsFlag(ctrl, index)
{
	if( ctrl.className.indexOf("enablelink") > -1)
	{
		ctrl.className = "linkbox enabledlink";
		document.getElementById("sellerDtlsFlag").value = "Y";
	}
	else
	{
		ctrl.className = "linkbox enablelink";
		document.getElementById("sellerDtlsFlag").value = "N";
	}
	document.getElementById("current_index").value = index;
}

function setSellerEnrichFlag(ctrl, index)
{
	if( ctrl.className.indexOf("enablelink") > -1)
	{
		ctrl.className = "linkbox enabledlink";
		document.getElementById("sellerEnrichFlag").value = "Y";
	}
	else
	{
		ctrl.className = "linkbox enablelink";
		document.getElementById("sellerEnrichFlag").value = "N";
	}
	document.getElementById("current_index").value = index;
}
function createFormField( element, type, name, value )
{
	var inputField;
	inputField = document.createElement( element );
	inputField.type = type;
	inputField.name = name;
	inputField.value = value;
	return inputField;
}