function setDirtyBit()
{
	dityBitSet=true;
}

function getCancelConfirmPopUp(strUrl) {
	var buttonsOpts = {};
	buttonsOpts[btnsArray['okBtn']] = function() {
		$(this).dialog("close");
		gotoPage(strUrl);
	};
	buttonsOpts[btnsArray['cancelBtn']] = function() {
		$(this).dialog("close");
	};
	if(dityBitSet)
	{
	$('#confirmMsgPopup').dialog({
				autoOpen : false,
				height : 150,
				width : 430,
				modal : true,
				buttons : buttonsOpts
			});
	$('#confirmMsgPopup').dialog("open");
	}
	else
	{
		gotoPage(strUrl);
	}
}

function saveProfile(strUrl)
{
	var frm = document.forms["frmMain"];
	frm.action = strUrl;
	$("input").removeAttr('disabled');
	frm.target = "";
	frm.appendChild(createFormField('INPUT', 'HIDDEN',csrfTokenName, tokenValue)); 
	frm.method = "POST";
	frm.submit();	
}

function showList(strUrl)
{
	if (formName=="Entry")
		strUrl="clientEnrichmentList.form";
	else if(formName=="List")
		strUrl="welcome.jsp";
	else if(formName=="View")
	{
		if(mode=="AUTHVIEW" )
			strUrl="clientEnrichmentAuthList.form";
		else
			strUrl="clientEnrichmentList.form";
	}
	strUrl = strUrl + "?" + csrfTokenName + "=" + tokenValue;
	window.location = strUrl;
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
	frm.target="";
	
}

function showViewForm(index,mode)
{
	var frm = document.forms["frmMain"];
	var strUrl = null; 
	frm.txtIndex.value = index;
	if(mode == "AUTH" || mode == "ACCEPT" ||mode == "REJECT")
		strUrl = "authViewClientEnrichment.form";
	else
		strUrl = "viewClientEnrichment.form"
	frm.action = strUrl;
	frm.target="";
	frm.method = "POST";
	frm.submit();
}
function showEditForm(strUrl, index)
{
	var frm = document.forms["frmMain"]; 
	frm.txtIndex.value = index;
	frm.action = strUrl;
	frm.method = "POST";
	frm.target="";
	frm.submit();
}
// Enable, Disable, Accept and Reject requests
function enableRecord(strUrl, index)
{
	var frm = document.forms["frmMain"]; 
	frm.txtIndex.value = index;
	frm.action = strUrl;
	frm.method = "POST";
	frm.target="";
	frm.submit();
}
function disableRecord(strUrl, index)
{
	var frm = document.forms["frmMain"]; 
	frm.txtIndex.value = index;
	frm.action = strUrl;
	frm.method = "POST";
	frm.target="";
	frm.submit();
}
function acceptRecord(strUrl, index)
{
	var frm = document.forms["frmMain"]; 
	frm.txtIndex.value = index;
	frm.action = strUrl;
	frm.method = 'POST';
	frm.target="";
	frm.submit();
}
function rejectRecord(arrData, retVal)
{
	var frm = document.forms["frmMain"]; 
	frm.txtIndex.value = arrData[1];
	frm.rejectRemarks.value = retVal;
	frm.action = arrData[0];
	frm.method = "POST";
	frm.target="";
	frm.submit();
}
function rejectRecord(arrData,strRemarks)
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
		frm.action = 'rejectClientEnrichment.form';
		frm.target = "";
		frm.method = "POST";
		frm.submit();
	}
}
function discardRecord(arrData)
{
	var strUrl;
	var frm = document.forms["frmMain"]; 
	strUrl = arrData[0];
	frm.txtIndex.value = arrData[1];
	frm.target ="";
	frm.action = strUrl;
	frm.method = "POST";
	frm.submit();
}

function hideRowsList(me,elementhidden)
{
 	if (me.value=="C")
	{
 		document.getElementById('glId').value = "";
		document.getElementById('glId').readOnly = true;
		document.getElementById('accountSeek').className = "hidden";
 	}
 	else
 	{
		document.getElementById('glId').readOnly = false;
		document.getElementById('accountSeek').className = "linkbox seeklink";
 	}
}

function filter(strUrl)
{
	var frm = document.forms["frmMain"];
	frm.target ="";
	frm.action = strUrl;
	frm.method = "POST";
	frm.submit();
}

function numericValidate(obj)
{
   var strindex="1234567890";
   if(obj!=null)
   {
	   var fieldValue=obj.value;
	   fieldValue = fieldValue.replace(' ','');
	   for(i=0;i<fieldValue.length;i++)
	    {
	        if(!(strindex.indexOf(fieldValue.charAt(i))>-1))
	        {
	           obj.value="";
	           alert("Please enter numeric value.");
	           //showError("TX5421","","","",true);	
	           return false;
	        }
	     }
	} 
	obj.value = parseInt(fieldValue,10);    
}
function Save(strUrl)
{
	var frm = document.forms["frmMain"];
	frm.action = strUrl;
	frm.method = "POST";
	frm.target ="";
	frm.submit();
	return true;
}
function update(strUrl)
{
	var frm = document.forms["frmMain"];	
	frm.target ="";
	frm.action = strUrl;	
	frm.method = "POST";
	frm.submit();
}

function enableEnrich(el, ele)
{
	var obj = '';
	try
	{
		obj = document.getElementById(ele);
	}
	catch(e)
	{
		return;
	} 
	if (el.checked == true)
	{
	  obj.disabled = false;
	  obj.readonly = false;
	  obj.className = 'cwInputBox';
	}
	else
	{
	  obj.value='';
	  obj.disabled = true;
	  obj.readonly = true;
	  obj.className = 'cwInputBoxDisabled';
	}
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
    		else if (type == 'hidden')
    			document.getElementById(inputIdArray[i]).value=myJSONObject.columns[i].value;
    		else
    			document.getElementById(inputIdArray[i]).innerHTML=myJSONObject.columns[i].value; 
    			
    		document.getElementById('accountId').value = myJSONObject.columns[6].value;
    	}
	}    
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