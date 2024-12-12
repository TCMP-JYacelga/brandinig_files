var objJsonData = {};
function selectChildren(ctrl,rowId)
{
	//var parentTrElement;
	//var parentImgElement;
	//parentTrElement = document.getElementById("tr-" + rowId)
	//parentImgElement = parentTrElement.cells[1].childNodes[0].childNodes[0];
	if (ctrl.className.indexOf("acceptlink") > -1)
	{
		ctrl.className = "linkbox acceptedlink";
		objJsonData[rowId]= true;
	}
	else
	{
		ctrl.className = "linkbox acceptlink";
		objJsonData[rowId]= false;
	}	
}
function showList(mode)
{
	var frm = document.forms["frmMain"];
	if ("AUTH" == mode)
		frm.action = "userSubscriptionAuthList.form";
	else
		frm.action = "userSubscriptionList.form";
	frm.method = "POST";
	frm.submit();		
}

function showAddNewForm()
{
	var frm = document.forms["frmMain"];
	frm.action = "addUserSubscription.form";
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
		frm.action = "userSubscriptionAuthHistory.hist";
	else
		frm.action = "userSubscriptionHistory.hist";
	
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
		strUrl = "authViewUserSubscription.form";
	else 
		strUrl = "viewUserSubscription.form";
	frm.action = strUrl;
	frm.method = "POST";
	frm.submit();	
}
function showDetailsForm(subScriptionCode)
{
	var frm = document.forms["frmMain"]; 
	var strUrl = null;
	document.getElementById("updateIndex").value = subScriptionCode;
	frm.target ="";
	strUrl = "userSubscriptionDetails.form";
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
	strUrl = "editUserSubscription.form";
	frm.action = strUrl;
	frm.method = "POST";
	frm.submit();
}

// Enable, Disable, Accept and Reject requests
function enableRecord(index)
{
	var frm = document.forms["frmMain"]; 
	document.getElementById("txtIndex").value = index;
	frm.action = "enableUserSubscription.form";
	frm.method = "POST";
	frm.submit();
}

function disableRecord(index)
{
	var frm = document.forms["frmMain"]; 
	document.getElementById("txtIndex").value = index;
	frm.action = "disableUserSubscription.form";
	frm.method = "POST";
	frm.submit();
}

function acceptRecord(index)
{
	var frm = document.forms["frmMain"]; 
	document.getElementById("txtIndex").value = index;
	frm.action = "acceptUserSubscription.form";
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
			frm.action = "rejectUserSubscription.form";
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
	frm.action = strUrl;
	frm.method = "POST";
	frm.submit();
}

function editDetailForm(strUrl, index)
{
	var frm = document.forms["frmMain"]; 
	document.getElementById("txtIndex").value = index;
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
	var frm = document.forms["frmMain"];
	document.getElementById("txtCurrent").value = '';	
	frm.target='';
	frm.action = "userSubscriptionList.form";
	frm.method = "POST";
	frm.submit();
}
function discardRecord(index)
{
	var frm = document.forms["frmMain"]; 
	document.getElementById("txtIndex").value = index;
	frm.target ="";
	frm.action = "undoUserSubscription.form";
	frm.method = "POST";
	frm.submit();
}
function discardRecord(arrData)
{
	var frm = document.forms["frmMain"];
	frm.txtIndex.value = arrData[1];
	frm.action = arrData[0];
	frm.action = "undoUserSubscription.form";
	frm.method = "POST";
	frm.target = "";	
	frm.submit();
}
function filter()
{
	var strUrl='';
	strUrl = "userSubscriptionList.form"

	var frm = document.forms["frmMain"];
	frm.target ="";
	frm.action = strUrl;
	frm.method = "POST";
	frm.submit();
}

function filterAuth()
{
	var strUrl='';
	strUrl = "userSubscriptionAuthList.form"
	var frm = document.forms["frmMain"];
	frm.target ="";
	frm.action = strUrl;
	frm.method = "POST";
	frm.submit();
}

function populateUpdateState()
{
	var frm = document.forms["frmMain"];	
	frm.target ="";
	frm.action = "populateUpdateUserSubscription.form";
	frm.method = "POST";
	frm.submit();
}

function populateState()
{
	var frm = document.forms["frmMain"];	
	frm.target ="";
	frm.action = "populateUserSubscription.form";
	frm.method = "POST";
	frm.submit();
}
function nextDetPage(strUrl, intPg)
{
	var frm = document.forms["frmMain"];
	var strUrl = null; 
	document.getElementById("txtDetail").value = intPg;
 	frm.target ="";
	strUrl = "editUserSubscription.form"
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
	strUrl = "editUserSubscription.form"
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

function updateDetail()
{
	document.getElementById("updateIndex").value = JSON.stringify(objJsonData);
	var frm = document.forms["frmMain"]; 	
	frm.target ="";
	frm.action = "updateUserSubscription.form"
	frm.method = "POST";
	frm.submit();
}	

function saveHeader()
{
	document.getElementById("updateIndex").value = JSON.stringify(objJsonData);
	var frm = document.forms["frmMain"];
	frm.target ="";
	frm.action = "saveUserSubscription.form"
	frm.method = "POST";
	frm.submit();
}

function getRecord(json,elementId)
{		  
	var myJSONObject = JSON.parse(json);
    var inputIdArray = elementId.split("|");
    for(i=0; i<inputIdArray.length; i++)
	{
    	var field = inputIdArray[i];
    	if(document.getElementById(inputIdArray[i]) && myJSONObject.columns[i])
    	{
			var type = document.getElementById(inputIdArray[i]).type;
			if(type=='text'){
				document.getElementById(inputIdArray[i]).value=myJSONObject.columns[i].value;}
			else if (type == 'hidden') {
				document.getElementById(inputIdArray[i]).value=myJSONObject.columns[i].value;}
			else {
				document.getElementById(inputIdArray[i]).innerHTML=myJSONObject.columns[i].value;} 
    	}
	}    
}
function clearSwiftLines()
{
	$('#line1').val('');
	$('#line2').val('');
	$('#line3').val('');
	$('#line4').val('');
}
function showSwiftMsg59(code)
{
	var dlg = $('#swiftMsgDiv');
	dlg.dialog({bgiframe:true, autoOpen:false, height:"auto", modal:true, resizable:false, width:500,title : 'Swift Message Info - Tag <59a>',
					buttons: {Close: function() {$(this).dialog('close'); }}});
	dlg.dialog('open');
	clearSwiftLines();
	populateSwiftMsg59(code);
}
function populateSwiftMsg59(code)
{
	var drawerCode = document.getElementById("drawerDesc");
	var add1 = document.getElementById("beneAddr1");
	var benCountry = document.getElementById("beneCountry");
	var benState = document.getElementById("beneState");
	var benCity = document.getElementById("beneCity");
	var benPostCode = document.getElementById("benePost");
	var line4;
	if (drawerCode != null)
		document.getElementById("line1").value = drawerCode.value;
	else
		document.getElementById("line1").value = code;
	if (add1 != null)
	{
		document.getElementById("line2").value = add1.value.substring(0,35);
		document.getElementById("line3").value = add1.value.substring(35,70);
	}
	if (benCountry != null)
		line4 = benCountry.value.substring(0,10);
	if (benState != null && benState.value != 'NONE')
		line4 = line4 + benState.value.substring(0,10);
	if (benCity != null)
		line4 = line4 + benCity.value.substring(0,10);
	if (benPostCode != null)
		line4 = line4 + benPostCode.value.substring(0,6);
	if (line4 != null)
	document.getElementById("line4").value = line4.substring(0,35); 
}

function showSwiftMsg57()
{
	var dlg = $('#swiftMsgDiv');
	dlg.dialog({bgiframe:true, autoOpen:false, height:"auto", modal:true, resizable:false, width:500,title : 'Swift Message Info - Tag <57a>',
					buttons: {Close: function() {$(this).dialog('close'); }}});
	dlg.dialog('open');
	clearSwiftLines();
	refreshSwiftMsg();
}
function refreshSwiftMsg()
{
	var beneBranchCode = document.getElementById("beneBranchCode");
	var add1;
	var benCountry;
	if (document.getElementById("beneBankType1") != null && document.getElementById("beneBankType1").checked == true)
	{
		add1 = document.getElementById("regBeneBankAddress");
		benCountry = document.getElementById("regBeneBankCountry");
	}
	else
	{
		add1 = document.getElementById("beneBankAddress");
		benCountry = document.getElementById("beneBankCountry");
	}
	var line4;
	if (beneBranchCode != null)
		document.getElementById("line1").value = beneBranchCode.value.substring(0,35);
	if (add1 != null)
	{
		document.getElementById("line2").value = add1.value.substring(0,35);
		document.getElementById("line3").value = add1.value.substring(35,70);
		line4 = add1.value.substring(70,95);
	}
	if (benCountry != null)
		line4 = line4 + benCountry.value.substring(0,10);
	if (line4 != null)
		document.getElementById("line4").value = line4.substring(0,35); 
}
function showBackPage(strUrl)
{
	var frm = document.forms["frmMain"];
	document.getElementById("txtCurrent").value = '';	
	frm.target='';
	frm.action = strUrl;
	frm.method = "POST";
	frm.submit();
}