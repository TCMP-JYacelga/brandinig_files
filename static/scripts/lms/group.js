function showList(strUrl)
{
	window.location = strUrl;
}

function showWelcomePage()
{
	window.location = "/WEB-INF/secure/welcome.jsp";
}


function fupper(o)
{	
	o.value=o.value.toUpperCase().replace(/([^0-9A-Z])/g,"");
}

function setParentGroupCode()
{
	var frm = document.forms["frmMain"];
	frm.target ="";
	if (mode == "ADD" || mode == "ADDPGC")
	{
		strUrl = "addParentGroupCode.form"
	}
	else if (mode == "EDIT" || mode == "EDITPGC" || mode == "UPDATE")
	{
		strUrl = "editParentGroupCode.form"
	}
	frm.action = strUrl;
	frm.target = "";		
	frm.method = "POST";
	frm.submit();
}


function goPgNmbr(strUrl, totalPages)
{	
	var frm = document.forms["frmMain"];
	var pgNmbr = document.getElementById("goPageNumbr").value;	
	document.getElementById("txtCurrent").value = pgNmbr - 1 ;
	if(isNaN(pgNmbr))
	{
		showError('Page Number Cannot be alphabet',null);
			return;
	}
	if (pgNmbr > totalPages)	
	{
		showError('Page Number cannot be greater than total number of pages!',null);
			return;
	}
	else if (pgNmbr<=0)
	{
		showError('Page Number cannot be Zero!',null);
			return;
	}
	
	frm.action = strUrl;
	frm.target = "";		
	frm.method = "POST";
	frm.submit();
}


function Save()
{
	var frm = document.forms["frmMain"];
	frm.target ="";
	frm.action = actionUrl;
	frm.method = "POST";
	frm.submit();
	return true;
}

function call(str)
{
	if(str=='F2')
	{
		showAddNewForm('addGroup.form');
	}
	if(str=='F12')
	{
		showList('welcome.jsp');
	}

	if(str=='F11')
	{
		return Save();
	}
	if(str=='F3')
	{
		if(mode == "AUTH")
			filter('groupAuthList.form');
		else
			filter('groupList.form')
	}	
}

function Save()
{
	var frm = document.forms["frmMain"];
	frm.target ="";
	frm.action = actionUrl;
	frm.method = "POST";
	frm.submit();
	return true;
}

function showAddNewForm(strUrl)
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
	strAttr = strAttr + "width=400,height=300";

	var frm = document.forms["frmMain"];
	document.getElementById("txtIndex").value = index;
	frm.action = strUrl;
	frm.target = "hWinHistory";
	frm.method = "POST";

	window.open ("", "hWinHistory", strAttr);
	frm.submit();
}

function showViewForm(strUrl, index)
{
	var frm = document.forms["frmMain"]; 
	document.getElementById("txtIndex").value = index;
	if(mode == "AUTH")
	{
		strUrl = "authViewGroup.form";
	}
	else
	{
		strUrl = "viewGroup.form";
	}
	frm.action = strUrl;
	frm.target = "";
	frm.method = "POST";
	frm.submit();
}

function showEditForm(strUrl, index)
{
	var frm = document.forms["frmMain"]; 
	document.getElementById("txtIndex").value = index;
	document.getElementById("txtCurrent").value = "";
	frm.target ="";
	frm.action = strUrl;
	frm.method = "POST";
	frm.submit();
}

// Enable, Disable, Accept and Reject requests
function enableRecord(strUrl, index)
{
	var frm = document.forms["frmMain"]; 
	document.getElementById("txtIndex").value = index;
	frm.target ="";
	frm.action = strUrl;
	frm.method = "POST";
	frm.submit();
}

function disableRecord(strUrl, index)
{
	var frm = document.forms["frmMain"]; 
	document.getElementById("txtIndex").value = index;
	frm.target ="";
	frm.action = strUrl;
	frm.method = "POST";
	frm.submit();
}

function acceptRecord(strUrl, index)
{
	var frm = document.forms["frmMain"]; 
	document.getElementById("txtIndex").value = index;
	frm.target ="";
	frm.action = strUrl;
	frm.method = 'POST';
	frm.submit();
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
			frm.txtIndex.value = arrData[0];
			frm.target = "";
			frm.action = "rejectGroup.form";
			frm.method = 'POST';
			frm.submit();
		}
	}

// List navigation
function prevPage(strUrl, intPg)
{
	var frm = document.forms["frmMain"]; 
	document.getElementById("txtCurrent").value = intPg;
	frm.target ="";
	frm.action = strUrl;
	frm.method = "POST";
	frm.submit();
}

function nextPage(strUrl, intPg)
{
	var frm = document.forms["frmMain"]; 
	document.getElementById("txtCurrent").value = intPg;
	frm.target ="";
	frm.action = strUrl;
	frm.method = "POST";
	frm.submit();
}
// Details
function deleteDetail(strUrl, index)
{
	var frm = document.forms["frmMain"]; 
	document.getElementById("txtIndex").value = index;
	frm.target ="";
	frm.action = strUrl;
	frm.method = "POST";
	frm.submit();
}

function viewDetailForm(strUrl, index)
{
	var frm = document.forms["frmMain"]; 
	document.getElementById("txtIndex").value = index;
	frm.target ="";
	frm.action = strUrl;
	frm.method = "POST";
	frm.submit();
}

function editDetailForm(strUrl, index)
{
	var frm = document.forms["frmMain"]; 
	document.getElementById("txtIndex").value = index;
	frm.target ="";
	frm.action = strUrl;
	frm.method = "POST";
	frm.submit();
}

function showAddDetail(strUrl)
{
	var frm = document.forms["frmMain"];	
	frm.action = strUrl;
	frm.target = "";	
	frm.method = "POST";
	frm.submit();
}
function showListEntry(mode)
{
	var frm = document.forms["frmMain"];
	if (mode == 'AUTHVIEW')
		strUrl = 'groupAuthList.form';
	else
		strUrl = 'groupList.form';
	frm.target="";
	frm.action = strUrl;
	frm.method = "POST";
	frm.submit();
}
function discardRecord(strUrl, index)
{
	var frm = document.forms["frmMain"]; 
	document.getElementById("txtIndex").value = index;
	frm.target ="";
	frm.action = strUrl;
	frm.method = "POST";
	frm.submit();
}
function filter(strUrl)
{
	var frm = document.forms["frmMain"];
	frm.target ="";
	frm.action = strUrl;
	frm.method = "POST";
	frm.submit();
}

function populateState(strUrl)
{
	var frm = document.forms["frmMain"];	
	frm.target ="";
	frm.action = strUrl;	
	frm.method = "POST";
	frm.submit();
}
function nextDetPage(strUrl, intPg)
{
	var frm = document.forms["frmMain"];
	var strUrl = null; 
	document.getElementById("txtDetail").value = intPg;
 	frm.target ="";
	strUrl = "editGroup.form"
	frm.action = strUrl;
	frm.method = "POST";
	frm.submit();
}
function prevDetPage(strUrl, intPg)
{
	var frm = document.forms["frmMain"]; 
	var strUrl = null;	
	document.getElementById("txtDetail").value = intPg;
 	frm.target ="";
	strUrl = "editGroup.form"
	frm.action = strUrl;
	frm.method = "POST";
	frm.submit();
}
function saveDetail(strUrl)
{
	var frm = document.forms["frmMain"];
	frm.target ="";
	frm.action = strUrl;
	frm.method = "POST";
	frm.submit();
}

function updateDetail(strUrl)
{
	var frm = document.forms["frmMain"]; 	
	frm.target ="";
	frm.action = strUrl;
	frm.method = "POST";
	frm.submit();
}	

function saveHeader(strUrl)
{
	var frm = document.forms["frmMain"]; 
	frm.target ="";	
	frm.action = strUrl;
	frm.method = "POST";
	frm.submit();
}	


function getRecord(json,elementId)
{	
	var myJSONObject = JSON.parse(json);	
    var inputIdArray = elementId.split("|");
    for (i=0; i < inputIdArray.length; i++)
	{
    	if (document.getElementById(inputIdArray[i]) && myJSONObject.columns[i])
    	{
			if (null == myJSONObject.columns[i].value)
				myJSONObject.columns[i].value = "";
    		var type = document.getElementById(inputIdArray[i]).type;
    		if (type == 'text')
    			document.getElementById(inputIdArray[i]).value=myJSONObject.columns[i].value;
    		else
    			document.getElementById(inputIdArray[i]).innerHTML=myJSONObject.columns[i].value; 
    	}
	}    
}