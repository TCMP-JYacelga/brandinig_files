function showList(mode)
{
	var frm = document.forms["frmMain"];
	if ("AUTH" == mode)
			frm.action = "myPrdEnrichmentsAuthList.form";
		else
			frm.action = "myPrdEnrichmentsList.form";
	frm.method = "POST";
	frm.submit();		
}

function showAddNewForm()
{
	var frm = document.forms["frmMain"];
	frm.action = "addMyPrdEnrichments.form";
	frm.method = "POST";
	frm.submit();
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
		frm.action = "myPrdEnrichmentsAuthHistory.hist";
	else
		frm.action = "myPrdEnrichmentsHistory.hist";
		
	frm.target = "hWinHistory";
	frm.method = "POST";

	window.open ("", "hWinHistory", strAttr);
	frm.submit();
}

function showViewForm(index,mode)
{
	var frm = document.forms["frmMain"]; 
	var strUrl = null;
	document.getElementById("txtIndex").value = index;
	frm.target ="";

	if(mode == "AUTH")
	strUrl = "authViewMyPrdEnrichments.form";
	else 
	strUrl = "viewMyPrdEnrichments.form";
	
	frm.action = strUrl;
	frm.method = "POST";
	frm.submit();	
}

function showEditForm(index)
{
	var strUrl ='';
	var frm = document.forms["frmMain"]; 
	document.getElementById("txtIndex").value = index;
	document.getElementById("txtCurrent").value = '';
	strUrl = "editMyPrdEnrichments.form";
	frm.action = strUrl;
	frm.method = "POST";
	frm.submit();
}

// Enable, Disable, Accept and Reject requests
function enableRecord(index)
{
	var frm = document.forms["frmMain"]; 
	document.getElementById("txtIndex").value = index;
	frm.target ="";
	frm.action = "enableMyPrdEnrichments.form";
	frm.method = "POST";
	frm.submit();
}

function disableRecord(index)
{
	var frm = document.forms["frmMain"]; 
	document.getElementById("txtIndex").value = index;
	frm.target ="";
	frm.action = "disableMyPrdEnrichments.form";	
	frm.method = "POST";
	frm.submit();
}

function acceptRecord(index)
{
	var frm = document.forms["frmMain"]; 
	document.getElementById("txtIndex").value = index;
	frm.target ="";
	frm.action = "acceptMyPrdEnrichments.form";
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
			frm.action = "rejectMyPrdEnrichments.form";
			frm.method = 'POST';
			frm.submit();
		}
	}

// List navigation
function prevPage(strUrl, intPg)
{
	var frm = document.forms["frmMain"]; 
	document.getElementById("txtCurrent").value = intPg;
	frm.action = strUrl;
	frm.method = "POST";
	frm.submit();
}

function nextPage(strUrl, intPg)
{
	var frm = document.forms["frmMain"]; 
	document.getElementById("txtCurrent").value = intPg;
	frm.action = strUrl;
	frm.method = "POST";
	frm.submit();
}
// Details
function deleteDetail(strUrl, index)
{
	var frm = document.forms["frmMain"]; 
	document.getElementById("txtIndex").value = index;
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
function showListEntry(strUrl)
{
	if (document.getElementById("myProduct")!=null)
	{
		document.getElementById("myProduct").value = '';
	}
	
	if(frmName == "View")
	{
		if(mode == "AUTH" )
		{	
			strUrl = "myPrdEnrichmentsAuthList.form";
		}else{
			strUrl = "myPrdEnrichmentsList.form";
		}
	}else{
		strUrl = "myPrdEnrichmentsList.form";
	}
				
	var frm = document.forms["frmMain"];	
	frm.target='';
	frm.action = strUrl;//"myPrdEnrichmentsList.form";
	frm.method = "POST";
	frm.submit();
}
function discardRecord(index)
{
	var frm = document.forms["frmMain"]; 
	document.getElementById("txtIndex").value = index;
	frm.target ="";
	frm.action = "undoMyPrdEnrichments.form";
	frm.method = "POST";
	frm.submit();
}
function discardRecord(arrData)
{
	var frm = document.forms["frmMain"];
	frm.txtIndex.value = arrData[1];
	frm.action = arrData[0];
	frm.action = "undoMyPrdEnrichments.form";
	frm.method = "POST";
	frm.target = "";	
	frm.submit();
}
function filter()
{
	var strUrl='';
	strUrl = "myPrdEnrichmentsList.form"
	var frm = document.forms["frmMain"];
	frm.target ="";
	frm.action = strUrl;
	frm.method = "POST";
	frm.submit();
}

function filterAuth()
{
	var strUrl='';
	strUrl = "myPrdEnrichmentsAuthList.form"
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
	strUrl = "editBeneficiary.form"
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
	strUrl = "editBeneficiary.form"
	frm.action = strUrl;
	frm.method = "POST";
	frm.submit();
}

function updateHeader()
{
	var frm = document.forms["frmMain"]; 	
	frm.target ="";
	frm.action = "updateMyPrdEnrichments.form"
	frm.method = "POST";
	frm.submit();
}	

function saveHeader()
{
	var frm = document.forms["frmMain"];
	frm.target ="";
	frm.action = "saveMyPrdEnrichments.form"
	frm.method = "POST";
	frm.submit();
}
function showEditDtlForm(strUrl, index)
{
	var frm = document.forms["frmMain"]; 
	document.getElementById("txtIndex").value = index;
	frm.action = strUrl;
	frm.target = "";
	frm.method = "POST";
	frm.submit();
}
function showViewDtlForm(strUrl, index)
{
	var frm = document.forms["frmMain"]; 
	document.getElementById("txtIndex").value = index;
	frm.action = strUrl;
	frm.target ="";
	frm.method = "POST";
	frm.submit();
}
function deleteDtlRecord(strUrl, index)
{
	var frm = document.forms["frmMain"]; 
	document.getElementById("txtIndex").value = index;
	frm.action = strUrl;
	frm.target = "";
	frm.method = "POST";
	frm.submit();
}
function saveDetail()
{
	var frm = document.forms["frmMain"];
	frm.target ="";
	frm.action = "saveMyPrdEnrichmentsDetail.form"
	frm.method = "POST";
	frm.submit();
}
function updateDetail()
{
	var frm = document.forms["frmMain"]; 	
	frm.target ="";
	frm.action = "updateMyPrdEnrichmentsDetail.form"
	frm.method = "POST";
	frm.submit();
}	
function reloadDataType()
{
	var frm = document.forms["frmMain"]; 	
	frm.target ="";
	frm.action = "addMyPrdEnrichments.form";
	frm.method = "POST";
	frm.submit();
}