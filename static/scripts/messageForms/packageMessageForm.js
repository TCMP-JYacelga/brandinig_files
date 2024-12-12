function doComposeFormMessage(strUrl,formRecordKey)
{
	if(formRecordKey == null || formRecordKey == '')
	{
		showErrorMessage();
	}
	else
	{
		document.getElementById('formRecordKey').value = formRecordKey ;
		var strData = {};
		strData['formRecordKey'] = formRecordKey;
		strData[csrfTokenName] = csrfTokenValue ;	
		$.ajax(
			{
				type : 'POST',
				data : strData,
				url : strUrl,
				//contentType : "application/json",
				dataType : 'html',
				success : function( data )
				{
					var $response = $(data);
					var referenceDiv = 	$(document.createElement('div'));
				   	$(referenceDiv).attr("id","messageInboxChooseRightMenuForm");
					$(referenceDiv).html(
						$response.filter( '#messageInboxComposeMessage' ) );
					
					$(referenceDiv).find('li[id$="1"]').find('a').removeClass('active')
					$(referenceDiv).find('li[id$="2"]').find('a').addClass('active')
					$(referenceDiv).find('div[id=verifyMessageRightMenuBtn1]').attr("class","block");
					$(referenceDiv).find('div[id=submitMessageRightMenuBtn1]').attr("class","hidden");
					$(referenceDiv).find('div[id=verifyMessageRightMenuBtn2]').attr("class","block");
					$(referenceDiv).find('div[id=submitMessageRightMenuBtn2]').attr("class","hidden");
					var dlg = $(referenceDiv);
					dlg.dialog( {
						bgiframe : true,
						autoOpen : false,
						height : 450,
						modal : true,
						resizable : true,
						width : 900
						//title : 'Create New Message',
					} ).dialog("widget").find(".ui-dialog-titlebar").hide();
					dlg.dialog( 'open' );
				},
				error : function( request, status, error )
				{
					alert("Error");
				}
			} );
	}
}
function showErrorMessage()
{
	var dlg = $( '#messageBoxError' );
	dlg.dialog( {
		autoOpen : false,
		height : "auto",
		modal : true,
		width : 300,
		title : 'Message',
		buttons : {
			"Ok" : function() {
				$(this).dialog("close");
				}
		}
	} );
	dlg.dialog( 'open' );
}
function closeComposeMessagePopup()
{
	$( '#messageInboxChooseRightMenuForm' ).dialog( 'close' );
}
function verifyRightMenuMessage()
{
	var errorFlag = false ;
	var fieldRequired ;
	var checkBoxFieldRequired ;
	var value ;
	var fieldId ;
	var datavalid=[];
	var checkboxfieldCodes = null;
	$("#messageInboxChooseRightMenuForm").find('input[type=text],textarea,select').each(function()
	 {
		fieldId = $(this).attr("fieldId");
		fieldRequired=$(this).attr("tag");
	  	value=$(this).val();
		if($(this).attr("type")=="text" || $(this).attr("type")=="textarea" )
		 {
		  	if (trim(fieldRequired)!="" && trim(value)=="")
		  	{
		  		datavalid[datavalid.length]="Please Enter valid "+fieldId;
		  	}
		 }
		else if($(this).attr("type")=="select")
		{
			if (trim(fieldRequired)!="" && trim(value)=="")
		  	{
		  		datavalid[datavalid.length]="Please Select valid "+fieldId;
		  	}
		}
	 });
	$("#messageInboxChooseRightMenuForm").children('input[type=checkbox]').each(function()
	{
		fieldId = $(this).attr("fieldId");
		checkBoxFieldRequired=$(this).attr("tag");
		value=$(this).attr("checked")?1:0;
		checkboxfieldCodes = checkboxfieldCodes + value +",";
	 });
	$("#messageInboxChooseRightMenuForm").children('input[type=radio]').each(function()
		{
			fieldId = $(this).attr("fieldId");
			fieldRequired=$(this).attr("tag");
		  	value=$(this).val();
		  	if (trim(fieldRequired)!="" && trim(value)=="")
		  	{
		  		datavalid[datavalid.length]="Please Select valid "+fieldId;
		  	}
		 });
	if(checkBoxFieldRequired != null)
	{
		if (trim(checkBoxFieldRequired)!="" && trim(checkboxfieldCodes)=="")
	  	{
	  		datavalid[datavalid.length]="Please Select One valid "+fieldId;
	  	}
	}
	
	if(datavalid.length == 0)
	{
		$("#messageInboxChooseRightMenuForm").find('input').attr("disabled","disabled");
		$("#messageInboxChooseRightMenuForm").find('textarea').attr("disabled","disabled");
		$("#messageInboxChooseRightMenuForm").find('select').attr("disabled","disabled");
			
		$("#messageInboxChooseRightMenuForm").find('li[id$="2"]').find('a').removeClass('active')
		$("#messageInboxChooseRightMenuForm").find('li[id$="3"]').find('a').addClass('active')
		$("#messageInboxChooseRightMenuForm").find('div[id=verifyMessageRightMenuBtn1]').attr("class","hidden");
		$("#messageInboxChooseRightMenuForm").find('div[id=submitMessageRightMenuBtn1]').attr("class","block");
		$("#messageInboxChooseRightMenuForm").find('div[id=verifyMessageRightMenuBtn2]').attr("class","hidden");
		$("#messageInboxChooseRightMenuForm").find('div[id=submitMessageRightMenuBtn2]').attr("class","block");
	}
	else
	{
		 var errDiv = $(document.createElement('div'));	 
		 var setErrDivTitle="Errors";
		 var ErrdivId=showErrorDialog(errDiv,setErrDivTitle,"Errorform");
		  
		 for (r=0;r<datavalid.length;r++)
		 { 
			  $("#"+ErrdivId).append(trim(datavalid[r]));	
			  $("#"+ErrdivId).append(document.createElement('br'));	
      	 }
	}
}
function submitRightMenuMessage()
{
	var JsonData=new Array();
	var value ;
	var fieldId ;
	var fieldRecordKey ;
	var checkboxfieldCodes = null;
	var TrackingNo = null ;
	var formRecordKey = document.getElementById('formRecordKey').value;
	
	$("#messageInboxChooseRightMenuForm").find('input[type=text],textarea,select').each(function()
	 {
		fieldId = $(this).attr("fieldId");
		fieldRecordKey = $(this).attr("fieldRecordKey");
	  	value=$(this).val();
	  	JsonData.push(createJsonData(fieldRecordKey,fieldId,value));
	 });
	$("#messageInboxChooseRightMenuForm").children('input[type=checkbox]').each(function()
	{
		fieldId = $(this).attr("fieldId");
		fieldRecordKey = $(this).attr("fieldRecordKey");
		value=$(this).attr("checked")?1:0;
	  	checkboxfieldCodes = checkboxfieldCodes + fieldId +",";
	 });
	$("#messageInboxChooseRightMenuForm").children('input[type=radio]').each(function()
	{
		fieldId = $(this).attr("fieldId");
		fieldRecordKey = $(this).attr("fieldRecordKey");
	  	value=$(this).val();
	  	JsonData.push(createJsonData(fieldRecordKey,fieldId,value));
	 });
	if(checkboxfieldCodes != null)
	{
		JsonData.push(createJsonData(fieldRecordKey,fieldId,checkboxfieldCodes));
	}
	var strData = {};
	$('<input>').attr({
	    type: 'hidden',
	    id: 'dynamicdata',
	    name: 'dynamicdata'
	}).appendTo('frmMain');
	strData["dynamicdata"] = JSON.stringify( JsonData );
	strData['formRecordKey'] = formRecordKey;
	strData[csrfTokenName] = csrfTokenValue ;
	$.ajax({
	        type: 'POST',	
	        data:strData,
	        url: "submitPackageForm.action",	       
	        success: function(data)
	        {	         	 
	        	TrackingNo=data.TrackingNo;
	           if(null != TrackingNo)
	           {	   
				  var setErrDivTitle="Your Request has been Submitted";
				  var setTrackingNo = "Tracking Number :" ;
				 
				  $("#bankInfoDiv").empty();
				  $('<p>'+setErrDivTitle+'</p>').appendTo('#bankInfoDiv');
				  $("#bankInfoDiv").append(document.createElement('br'));
				  $('<p>'+setTrackingNo+'<font color="red">'+TrackingNo+'</font></p>').appendTo('#bankInfoDiv');
				  $('#bankInfoDiv').css("vertical-align","top");
				  //$('#bankInfoDiv').css("color","#0078AE");
				  $('#bankInfoDiv').css("font-size","1.2em");
				  $('#bankInfoDiv').css("font-weight","bold");
				  $('#bankInfoDiv').css("width","300");
				  $('#bankInfoDiv').css("text-align","center");
	           }  
	           		       	
		       	$("#messageInboxChooseRightMenuForm").find('li[id$="3"]').find('a').removeClass('active')
				$("#messageInboxChooseRightMenuForm").find('li[id$="4"]').find('a').addClass('active')
				$("#messageInboxChooseRightMenuForm").find('div[id=submitMessageRightMenuBtn1]').attr("class","hidden");
				$("#messageInboxChooseRightMenuForm").find('div[id=exitRightMenuBtn1]').attr("class","block");
				$("#messageInboxChooseRightMenuForm").find('div[id=submitMessageRightMenuBtn2]').attr("class","hidden");
				$("#messageInboxChooseRightMenuForm").find('div[id=exitRightMenuBtn2]').attr("class","block");
	        },
			error: function (request, status, error) 
			{
				alert(error);
			}			
	    });
	strData = "";
}
function createJsonData(Field_Record_Key,Field_Name,Field_value)
{
	return {Field_Record_Key:Field_Record_Key,Field_Name:Field_Name,Field_value:Field_value} ;
}
function exitComposeMessageRightMenuPopup()
{
	$("#messageInboxChooseRightMenuForm").remove(); 
	$( '#messageInboxChooseRightMenuForm' ).dialog( 'close' );
}