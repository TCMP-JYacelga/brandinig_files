function showDateRange(ctrl) 
{
	if ("H" == ctrl.options[ctrl.selectedIndex].value)
		$("#divDateRange").toggleClass("ui-helper-hidden", false);
	else
		$("#divDateRange").toggleClass("ui-helper-hidden", true);
}

function showAdvancedFilter(fptrCallback)
{
	var dlg = $('#advanceFilter');
	dlg.dialog({bgiframe:true, autoOpen:false, height:"auto", modal:true, resizable:true, width:480,title : 'Advanced Filter',
					buttons: {"Continue": function() {$(this).dialog("close"); fptrCallback.call(null, 'lmsQueryList.form');},
					Cancel: function() {$(this).dialog('close'); }}});
	dlg.dialog('open');
}
function showQueryHeaderList(strUrl)
{
	$('#advanceFilter').appendTo('#frmMain');
	$('#advanceFilter').hide();
	//document.getElementById("myProduct").value=document.getElementById("myProduct1").value;
    var frm = document.forms["frmMain"];
	frm.action = strUrl;
	frm.target = "";
	frm.method = "POST";
	frm.submit();
}

function retrieve(strUrl)
{
	var frm = document.forms["frmMain"]; 
	frm.action = strUrl;
	frm.method = "POST";
	frm.submit();
}
function fupper(o)
{	
	o.value=o.value.toUpperCase().replace(/([^0-9A-Z/(/)])/g,"");
}

function getClient1()
{
	var frm = document.forms['frmMain'];
	frm.action = fetchURL;
	frm.method = 'POST';
	frm.target="";
	frm.submit();
	return true;
}
function setDescriptions()
{
	var args = setDescriptions.arguments;
	
	if (args.length == 1)
	{
		document.getElementById("instrdescspan").innerHTML = args[0]; 
	}
}

function setDisplay(var1)
{
		if (var1.value == 'T')
		{
			document.getElementById('startDate').disabled = true;
			document.getElementById('endDate').disabled = true;
		}
}
function postRecord(strUrl, index)
{
	document.getElementById("txtIndex").value = index;
	var frm = document.forms['frmMain'];
	frm.action = strUrl;
	frm.method='POST';
	frm.target='';
	frm.submit();
	return true;
	
}
function back(strUrl)
{
	var frm = document.forms['frmMain'];
	frm.action = strUrl;
	frm.method='POST';
	frm.target='';
	frm.submit();
	return true;
	
}
function download(strUrl)
{
	var frm = document.forms["frmMain"]; 
	frm.action = strUrl;
	frm.method = "POST";
	frm.submit();
}
function welcome(strUrl)
{
 window.location= strUrl;
}

function viewAccountMov(strUrl, index)
{
	document.getElementById("txtIndex").value = index;
	var frm = document.forms['frmMain'];
	frm.action = strUrl;
	frm.method='POST';
	frm.target='';
	frm.submit();
	return true;
}

function viewAccountActivities(strUrl, index)
{
	document.getElementById("txtIndex").value = index;
	var frm = document.forms['frmMain'];
	frm.action = strUrl;
	frm.method='POST';
	frm.target='';
	frm.submit();
	return true;
}
function disableControls(var1)
{
	if (var1.id == 'instrExecStatus')
	{
		if (var1.value != '1' && var1.value != 'FNN^SNN^SZN')
		{
			document.getElementById('instrFailReason').value='-1';
			document.getElementById('instrFailReason').readOnly = true;
			document.getElementById('instrFailReason').disabled = true;
		}
		else
		{
			document.getElementById('instrFailReason').readOnly = false;
			document.getElementById('instrFailReason').disabled = false;
		}
	}
	else if (var1.id == 'movStatus')
	{
		if (var1.value != 'A' && var1.value != 'FZ^FF^SZ')
		{
			document.getElementById('movFailReason').value='-1';
			document.getElementById('movFailReason').readOnly = true;
			document.getElementById('movFailReason').disabled = true;
		}
		else
		{
			document.getElementById('movFailReason').readOnly = false;
			document.getElementById('movFailReason').disabled = false;
		}	
	}
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
    	else {
    	 document.getElementById(inputIdArray[i]).innerHTML=myJSONObject.columns[i].value;} 
    	}
	}    
}
function filter()
{
	var strUrl="lmsQueryList.form";
	var frm = document.forms["frmMain"];
	frm.target ="";
	frm.action = strUrl;
	frm.method = "POST";
	frm.submit();
}