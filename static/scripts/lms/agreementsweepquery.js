var arrActionColumnStatus = [
		{
			"code" : "N",
			"desc" : getLabel( 'lblNew', 'New' )
		},
		{
			"code" : "P",
			"desc" : getLabel( 'lblPartial', 'Partial' )
		} ,
		{
			"code" : "S",
			"desc" : getLabel( 'lblSuccessful', 'Successful' )
		},
		{
			"code" : "FY",
			"desc" : getLabel( 'lblCancelled', 'Cancelled' )
		},
		{
			"code" : "F",
			"desc" : getLabel( 'lblFailed', 'Failed' )
		},
		{
			"code" : "Q",
			"desc" : getLabel( 'lblInqueue', 'Inqueue' )
		}];
function showDateRange(ctrl) 
{
	if ("H" == ctrl.options[ctrl.selectedIndex].value)
		$("#divDateRange").toggleClass("ui-helper-hidden", false);
	else
		$("#divDateRange").toggleClass("ui-helper-hidden", true);
}

function showFilterDateRange(fltrType) 
{
	var flag = true;
	if(fltrType)
	{
		if(fltrType.selectedIndex)
		{
			if ("H" == fltrType.options[fltrType.selectedIndex].value)
				flag = false ;
		}
	}
	$("#divFilterDateRange").toggleClass("ui-helper-hidden", flag);
}

function resetFilter()
{
	document.getElementById('type').value = document.getElementById('filterType').value;
	document.getElementById('refCode').value = document.getElementById('fltrRefCode').value;
	document.getElementById('fromDate').value = document.getElementById('filterFromDate').value;
	document.getElementById('toDate').value = document.getElementById('filterToDate').value;
}

function advanceResetFilter()
{
	document.getElementById('filterType').value = document.getElementById('type').value  ;
	document.getElementById('fltrRefCode').value = document.getElementById('refCode').value ;
	document.getElementById('filterFromDate').value = document.getElementById('fromDate').value  ;
	document.getElementById('filterToDate').value = document.getElementById('toDate').value  ;
}

function changefilter(fltrType)
{
	if(fltrType)
	{
		if(fltrType.selectedIndex)
		{
			if ("H" == fltrType.options[fltrType.selectedIndex].value)
			{
				agrCodeSeekId = agrCodeSeekIdHist ;
			}
			else
			{
				agrCodeSeekId = agrCodeSeekIdToday ;
			}
		}
		else
		{
			agrCodeSeekId = agrCodeSeekIdToday ;
		}
	}		
	$('#fltrFlag').val(fltrType.value);
}

function changeAdvancefilter(fltrType)
{
	if(fltrType)
	{
		if(fltrType.selectedIndex)
		{
			if ("H" == fltrType.options[fltrType.selectedIndex].value)
			{
				fltrAgrCodeSeekId = fltrAgrCodeSeekIdHist ;
			}
			else
			{
				fltrAgrCodeSeekId = fltrAgrCodeSeekIdToday ;
			}
		}
		else
		{
			fltrAgrCodeSeekId = fltrAgrCodeSeekIdToday ;
		}
	}		
	$('#fltrFlag').val(fltrType.value);
}

function showAdvancedFilter(fptrCallback)
{
	var dlg = $('#advanceFilter');
	dlg.dialog({bgiframe:true, autoOpen:false, height:"auto", modal:true, resizable:true, width:"auto",title : 'Advanced Filter',
					buttons: {"Continue": function() {$(this).dialog("close"); fptrCallback.call(null, 'agreementSweepQuery.form');},
					Cancel: function() {$(this).dialog('close'); }}});
	dlg.dialog('open');
}
function showQueryHeaderList(strUrl)
{
	resetFilter();
	$('#advanceFilter').appendTo('#frmMain');
	$('#advanceFilter').hide();
	// document.getElementById("myProduct").value=document.getElementById("myProduct1").value;
    var frm = document.forms["frmMain"];
	frm.action = strUrl;
	frm.target = "";
	frm.method = "POST";
	frm.submit();
}

function retrieve(strUrl , strval)
{	
	var instStatus = strval.options[strval.selectedIndex].value;
	document.getElementById('instStatus').value = instStatus ;
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
function postRecord(strUrl, index , exeId)
{
	document.getElementById("txtIndex").value = index;
	document.getElementById("execId").value = exeId;
	var frm = document.forms['frmMain'];
	frm.action = strUrl;
	frm.method='POST';
	frm.target='';
	frm.submit();
	return true;
}

function viewRecord(strUrl, index , agerExecId)
{
	document.getElementById("agerExecId").value = agerExecId;
	document.getElementById("txtIndex").value = index;
	document.getElementById("agerExecId").value = agerExecId;
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
function downloadXls(me,strUrl)
{
	if (me.className.startsWith("imagelink grey"))
	{
		return;
	}
	else
	{
		var frm = document.forms["frmMain"]; 
		frm.action = strUrl;
		frm.method = "POST";
		frm.submit();
	}
	
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

function getRecord(json, elementId)
{
    var myJSONObject = JSON.parse(json);
    var inputIdArray = elementId.split("|");
    for(i=0; i<inputIdArray.length; i++)
     {
	    var field = inputIdArray[i];
	    if(document.getElementById(inputIdArray[i]) && myJSONObject.columns[i])
	    {
	              var type = document.getElementById(inputIdArray[i]).type;
	              if(type=='text')
	              {
	                   document.getElementById(inputIdArray[i]).value=myJSONObject.columns[i].value;
	              }
	              else if (type == 'hidden')
	              {
	                   document.getElementById(inputIdArray[i]).value=myJSONObject.columns[i].value;
	              }
	              else
	              {
	                   document.getElementById(inputIdArray[i]).innerHTML=myJSONObject.columns[i].value;
	              }
	    }
     }
}


function filter()
{
	var strUrl="agreementSweepQuery.form";
	var frm = document.forms["frmMain"];
	frm.target ="";
	frm.action = strUrl;
	frm.method = "POST";
	frm.submit();
}

// For Agreement Type

function setProdCategory(strval)
{
	var agreementType = strval.options[strval.selectedIndex].value;
	var arr0 = new Array(); arr0[0]=["ALL","Sweep In","Sweep Out","Day 0 originating","Flexibe","Passive"]; arr0[1]=["ALL","201","101","601","401","501"];
	var arr1 = new Array(); arr1[0]=["ALL","Sweep In","Sweep Out","Day 0 originating","Passive"]; arr1[1]=["ALL","201","101","601","501"]; 
 	var arr2 = new Array(); arr2[0]=["ALL","Sweep In","Sweep Out","Flexibe"]; arr2[1]=["ALL","201","101","401"]; 
	 if(agreementType == 'ALL')
	 {
		 if(document.getElementById("fltrAgreementType") != null)
		 {
		  emptyList( document.getElementById("fltrProductCategory"));
		  var  box0 = document.getElementById("fltrProductCategory");
		 }
		
		  fillList( box0, arr0 ); 
	  }
	  else if(agreementType == 'Y')
	  {
	  	if(document.getElementById("fltrAgreementType") != null)
		 {
		  emptyList( document.getElementById("fltrProductCategory"));
		  var  box1 = document.getElementById("fltrProductCategory");
		 }
		 fillList( box1, arr1 ); 
	  }
	  else
	  {
	  	if(document.getElementById("fltrAgreementType") != null)
		 {
		  emptyList( document.getElementById("fltrProductCategory"));
		  var  box2 = document.getElementById("fltrProductCategory");
		 }
		 fillList( box2, arr2 ); 
	  }	
	  
}

function emptyList( box ) {
	// Set each option to null thus removing it
	while ( box.options.length ) box.options[0] = null;
}
function fillList( box, arr ) {
	// arr[0] holds the display text
	// arr[1] are the values
	
	for ( i = 0; i < arr[0].length; i++ ) {
		option = new Option( arr[0][i], arr[1][i] );
		box.options[box.length] = option;
	}
    // Preselect option 0
	box.selectedIndex=0;
}

function setExecMode(strval)
{
	var prodCat = strval.options[strval.selectedIndex].value;
	var arr0 = new Array(); arr0[0]=["ALL","Scheduled","Triggered","Balance Adjustment","Liquidity Transfer"]; arr0[1]=["ALL","T","D","A","X"];
	var arr1 = new Array(); arr1[0]=["ALL","Scheduled","On Demand","Balance Adjustment","Liquidity Transfer"]; arr1[1]=["ALL","O","D","A","X"];
 	 
	 if(prodCat == 'ALL' || prodCat == '501')
	 {
		 if(document.getElementById("fltrProductCategory") != null)
		 {
		  emptyList( document.getElementById("fltrExecutionMode"));
		  var  box0 = document.getElementById("fltrExecutionMode");
		 }
		
		  fillList( box0, arr0 ); 
	  }
	  else if(prodCat == 'ALL' || prodCat == '401' || prodCat == '101' || prodCat == '201')
	  {
	  	if(document.getElementById("fltrProductCategory") != null)
		 {
		  emptyList( document.getElementById("fltrExecutionMode"));
		  var  box1 = document.getElementById("fltrExecutionMode");
		 }
		 fillList( box1, arr1 ); 
	  }
}

function setMovType(strval)
{
	var prodCat = strval.options[strval.selectedIndex].value;
	var arr0 = new Array(); arr0[0]=["ALL","Sweep"]; arr0[1]=["ALL","R"];
	 if(prodCat == '601' || prodCat == '501')
	 {
		 if(document.getElementById("fltrProductCategory") != null)
		 {
		  emptyList( document.getElementById("fltrMovType"));
		  var  box0 = document.getElementById("fltrMovType");
		 }
		
		  fillList( box0, arr0 ); 
	  }
}


function setExecFreq(strval)
{
	var execMode = strval.options[strval.selectedIndex].value;
	
	if(execMode == 'ALL' || execMode == 'T')
	 {
		document.getElementById('fltrExecutionFreq').disabled = false;
	 }
	else
	{
		document.getElementById('fltrExecutionFreq').disabled = true;
	}
	
}

function showMovementDetails(data, XMLHttpRequest){
	var dlg = $('#movementDetails');
	dlg.dialog({bgiframe:true, autoOpen:false, height:"auto", modal:true, resizable:true, width:"auto",title : 'Movement Details',
					buttons: {"OK": function() {$(this).dialog("close");}}});
	var innerHTMLTxt="<table cellspacing='0' cellpadding='0' border='0' id='gridTable' class='gridTable'><thead><tr><th scope='col' class='srnoCell rightAlign'>No.</th><th scope='col' class='leftAlign w12'>From A/C</th><th scope='col' class='leftAlign w9'>To A/C</th><th scope='col' class='leftAlign w8'>Amount</th><th scope='col' class='leftAlign w6'>Narration</th></tr></thead><tbody><c:set var='ROW_OUTPUTTED' value='0'/><fmt:parseNumber var='pageSize' value='10'/>";
	for(i=0;i<data.model.length;i++){
		var rowStyle = "trEven";
		if(i%2==0){
			rowStyle = "trEven"
		}else{
			rowStyle = "trOdd"
		}
		innerHTMLTxt = innerHTMLTxt + "<tr class="+rowStyle+"><td  align='center'>"+(i+1)+"</td><td>"+data.model[i].debitAcctNum+"</td><td>"+data.model[i].creditAcctNum+"</td><td>"+data.model[i].amount+"</td><td>"+data.model[i].narration+"</td></tr>";
	}
	innerHTMLTxt = innerHTMLTxt+"</tbody></table>"
	dlg.dialog('open');
	document.getElementById("movementDetails").innerHTML=innerHTMLTxt;
}

function showAdditionalInfo(data, XMLHttpRequest){
	var dlg = $('#additionalInformation');
	dlg.dialog({bgiframe:true, autoOpen:false, height:"auto", modal:true, modal:data.model, resizable:true, width:560,title : 'Additional Information',
					buttons: {"OK": function() {$(this).dialog("close");}}});
	if(data.model.movRefNum)				
	document.getElementById("additionalInfoRefNo").innerHTML = data.model.movRefNum;
	if(data.model.msgType)
	document.getElementById("additionalInfoMsgType").innerHTML = data.model.msgType;
	if(data.model.clearingStatus)
	document.getElementById("additionalInfoClrStatus").innerHTML = data.model.clearingStatus;
	if(data.model.clearingReason)
	document.getElementById("additionalInfoClrReason").innerHTML = data.model.clearingReason;
	if(data.model.theirReference)
	document.getElementById("additionalInfoTheirRef").innerHTML = data.model.theirReference;

	if(data.model.productId != '08' && data.model.productId != '10' )
	{
		if(data.model.enrichments)
		document.getElementById("additionalInfoEnrichments").innerHTML = data.model.enrichments;
	}
	else
	{
		document.getElementById("additionalInfoEnrichments").style.visibility = 'hidden' ;
		document.getElementById("lblEnricment").style.visibility = 'hidden' ;		
	}
	dlg.dialog('open');
}

function submitAdditionalInfoReq( execId)
{
	var strUrl ;
	var csrf_name=document.getElementById("csrfTok").name;
	var csrf_token=document.getElementById(csrf_name).value;
	var fltrFlag = document.getElementById("fltrFlag").value ;
	if(fltrFlag == 'T')
	strUrl = 'viewAdditionalInfo.formx';
	else
	strUrl = 'viewAdditionalHistoryInfo.formx';
	var strData = {};
	strData['EXECID'] = execId;
	strData[csrf_name] = csrf_token;
	$.ajax({
	cache: false,
	data:strData,
	dataType:'json',
	success:showAdditionalInfo,
	error:ajaxError,
	url:strUrl,
	type:'POST'
	});
}

function submitMovmentDtlsReq( execId )
{
	var strUrl ;
	var csrf_name=document.getElementById("csrfTok").name;
	var csrf_token=document.getElementById(csrf_name).value;
	var fltrFlag = document.getElementById("fltrFlag").value ;
	
	if(fltrFlag == 'T')
	strUrl = 'viewMovementDetails.formx';
	else
	strUrl = 'viewHistoryMovementDetails.formx';
	var strData = {};
	strData['EXECID'] = execId;
	strData[csrf_name] = csrf_token;
	$.ajax({
	cache: false,
	data:strData,
	dataType:'json',
	success:showMovementDetails,
	error:ajaxError,
	url:strUrl,
	type:'POST'
	});
}

function ajaxError()
{
	alert("AJAX error, please contact admin!");
}

function showSnapShotDownload(strUrl)
{
	var frm = document.forms["frmMain"];
	frm.action = strUrl;
	frm.target = "";
	frm.method = "POST";
	frm.submit();
}

function showExecutionSnapshotResponse(execSnapShotFlag)
{
	if( execSnapShotFlag )
	{
		if( execSnapShotFlag.value == "true" )
		{
			$( '#executionSnapshot' ).dialog( {
				bgiframe:true,
				autoOpen : false,
				width : "auto",
				height : "auto",
				resizable:true,
				title : getLabel('sweepSnapshot', 'Sweep Snapshot'),
				modal : true
			} );
			$( '#dialogMode' ).val( '1' );
			$( '#executionSnapshot' ).dialog( 'open' );
		}
	}
}

function viewAccountRecord(strUrl,frmId,agerId)
{
	document.getElementById( "agreeId" ).value = agerId;
	var frm = document.forms['frmMain'];
	frm.action = strUrl;
	frm.method='POST';
	frm.target='';
	frm.submit();
}

function showAccountDetailResponse(viewAcctActFlag)
{
	if( viewAcctActFlag )
	{
		if( viewAcctActFlag.value )
		{
			$( '#agreeAccountDtl' ).dialog( {
				bgiframe:true,
				autoOpen : false,
				width : "auto",
				height : "auto",
				resizable:true,
				title : getLabel('sweepSnapshot', 'Sweep Snapshot'),
				modal : true,
				buttons: {"OK": function() {$(this).dialog("close");}}
			} );
			$( '#dialogMode' ).val( '1' );
			$( '#agreeAccountDtl' ).dialog( 'open' );
		}
	}
}

function showMovementDtlReq( movId,fltrType,exeId )
{
	var csrf_name = document.getElementById( "csrfTok" ).name;
	var csrf_token = document.getElementById( csrf_name ).value;
	var strData = {};
	strData[ 'MOVID' ] = movId;
	strData[ 'FLTRTYPE' ] = fltrType;
	strData[ 'EXEID' ] = exeId;
	strData[ csrf_name ] = csrf_token;
	$.ajax( {
		type : 'POST',
		data : strData,
		url : 'agreementSweepQueryActDtl.form',
		dataType : 'html',
		success : function( data )
		{
			var $response = $( data );
			$( '#movementDetails' ).html(
					$response.find( '#movementDetailsView' ) );
			$( '#movementDetails' ).dialog( {
				bgiframe : true,
				autoOpen : false,
				width : "auto",
				height : "auto", 
				resizable : true,
				title : getLabel('movementDetail', 'Movement Detail'),
				modal : true,
				buttons : {
					"OK" : function()
					{
						$( this ).dialog( "close" );
					}
				}
			} );
			$( '#dialogMode' ).val( '1' );
			$( '#movementDetails' ).dialog( 'open' );
		}
	} );
}


