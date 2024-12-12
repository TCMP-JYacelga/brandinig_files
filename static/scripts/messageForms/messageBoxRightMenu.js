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
		strData['selectedClient'] = strClient ; 
		strData['selectedSeller'] = strSellerCode ; 
		strData['selectedClientDesc'] = strClientDesc;
		strData['screenType'] = 'MSG_RIGHT_MENU';
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
					var referenceDiv = 	null;
					if( $('#messageInboxChooseRightMenuForm').length > 0 )   
					{
						referenceDiv = $('#messageInboxChooseRightMenuForm');
					}
					else
					{
						referenceDiv = $(document.createElement('div'));
					}
				   	$(referenceDiv).attr("id","messageInboxChooseRightMenuForm");
					$(referenceDiv).html(
						$response.filter( '#messageInboxComposeMessage' ) );
					
					$('#messageInboxChooseRightMenuForm #tab_1').removeClass('ft-status-bar-li-active');
					$('#messageInboxChooseRightMenuForm #tab_2').addClass('ft-status-bar-li-active');
					//$(referenceDiv).find('#messageInboxChooseRightMenuForm li[id$="1"]').find('a').removeClass('active');
					//$(referenceDiv).find('#messageInboxChooseRightMenuForm li[id$="2"]').find('a').addClass('active');
					$(referenceDiv).find('#messageInboxChooseRightMenuForm div[id=verifyMessageRightMenuBtn1]').attr("class","block");
					$(referenceDiv).find('#messageInboxChooseRightMenuForm div[id=submitMessageRightMenuBtn1]').attr("class","hidden");
					$(referenceDiv).find('#messageInboxChooseRightMenuForm div[id=verifyMessageRightMenuBtn2]').attr("class","block");
					$(referenceDiv).find('#messageInboxChooseRightMenuForm div[id=submitMessageRightMenuBtn2]').attr("class","hidden");
					var dlg = $(referenceDiv);
					dlg.dialog( {
						bgiframe : true,
						autoOpen : false,
						height : "auto",
						modal : true,
						resizable : true,
						width : 825
						//title : 'Create New Message',
					} ).dialog("widget").find(".ui-dialog-titlebar").hide();
					dlg.dialog( 'open' );
					
					toggleShowCompanyInfo();
					 // To do					
					$('#messageInboxChooseRightMenuForm #tab_1').removeClass('ft-status-bar-li-active');
					$('#messageInboxChooseRightMenuForm #tab_2').addClass('ft-status-bar-li-active');
					$("#messageInboxChooseRightMenuForm").addClass('ux_panel-transparent-background ux_largepadding');
					$("#messageInboxChooseRightMenuForm #verifyMessageBtn1").attr("class","block");
					$("#messageInboxChooseRightMenuForm #submitMessageBtn1").attr("class","hidden");
					$("#messageInboxChooseRightMenuForm #verifyMessageBtn2").attr("class","block");
					$("#messageInboxChooseRightMenuForm #submitMessageBtn2").attr("class","hidden");
								 
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
function createJsonData(Field_Record_Key,Field_Name,Field_value)
{
	return {Field_Record_Key:Field_Record_Key,Field_Name:Field_Name,Field_value:Field_value} ;
}
function exitComposeMessageRightMenuPopup()
{
	$("#messageInboxChooseRightMenuForm").remove(); 
	$( '#messageInboxChooseRightMenuForm' ).dialog( 'close' );
}

function toggleShowCompanyInfo(){
	showToolTip();
}

function showToolTip() {
	$("#instumentCompanyInfoLink").unbind('mouseover');
	$("#instumentCompanyInfoLink").unbind('mouseout');
	$("#instumentCompanyInfoLink").bind('mouseover', function(e) {
				console.log(e.pageY);
				$('<span>').html($('#instumentCompanyInfoDiv').html()).attr('class','custom-tooltip').css({
								/*'top' : 100,
								'right' : 40,
								'position' : 'absolute',
								'border' : '1px solid #868686',
								'padding' : '5px',
								'max-height' : '500px',
								'overflow' : 'auto',
								'min-width' : '250px',
								'background-color' : '#FFFFFF',
								'z-index' : '2000',
								'color' : '#333333'*/
						}).appendTo($("#instumentCompanyInfoSpan"));
			});

	$("#instumentCompanyInfoLink").bind('mouseout', function(e) {
				$("#instumentCompanyInfoSpan").find('.custom-tooltip').remove();
			});
}
function verifyMessageRightMenu()
{
	var errorFlag = false ;
	var fieldRequired ;
	var checkBoxFieldRequired ;
	var value ;
	var fieldId ;
	var datavalid=[];
	var checkboxfieldCodes = null;
	$("#messageInboxChooseRightMenuForm").find('input[type=text],input[type=hidden],textarea,select').each(function()
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
	
	$('#messageInboxChooseRightMenuForm #tab_2').removeClass('ft-status-bar-li-active');
	$('#messageInboxChooseRightMenuForm #tab_3').addClass('ft-status-bar-li-active');
		//$('#messageInboxChooseRightMenuForm #tab_2').find('a').removeClass('active');
		//$("#messageInboxChooseRightMenuForm #tab_3").find('a').addClass('active');
		$("#messageInboxChooseRightMenuForm").find('input').attr("disabled","disabled");
		$("#messageInboxChooseRightMenuForm").find('textarea').attr("disabled","disabled");
		$("#messageInboxChooseRightMenuForm").find('select').attr("disabled","disabled");
		$("#messageInboxChooseRightMenuForm #verifyMessageBtn1").attr("class","hidden");
		$("#messageInboxChooseRightMenuForm #submitMessageBtn1").attr("class","block");
		$("#messageInboxChooseRightMenuForm #verifyMessageBtn2").attr("class","hidden");
		$("#messageInboxChooseRightMenuForm #submitMessageBtn2").attr("class","block");
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
function showErrorDialog(newDiv,divTitle,divid)
{	 
	$(newDiv).attr("id",divid);
	$(newDiv).dialog
	(
		{
			title:divTitle,				
	        show: "blind",
	        width: 300,
            height: 200,      
            modal: true,

            close: function(event, ui) 
            {
            	removeErrorDialog(this);
            }
            	
	    }
	);
	return  $(newDiv).attr("id");
}

function submitMessageRightMenu()
{
 var JsonData=new Array();
 var value ;
 var fieldId ;
 var fieldRecordKey ;
 var checkboxfieldCodes = null;
 var TrackingNo = null ;
 var formRecordKey = document.getElementById('formRecordKey').value;
 
 var arrItems =$("#messageInboxChooseRightMenuForm").find('input[type=text],textarea,select');
 for (i = 0; i < arrItems.length; i++) {
  fieldId = arrItems[i].getAttribute("fieldId");
  if (fieldId == null) {
   fieldId = arrItems[i].getAttribute("id");
  }
  fieldRecordKey = arrItems[i].getAttribute("fieldRecordKey");
  value = arrItems[i].value;
  JsonData.push(createJsonData(fieldRecordKey, fieldId, value));
 }

 $("#messageInboxChooseRightMenuForm").children('input[type=checkbox]').each(function()
 {
  fieldId = $(this).attr("fieldId");
  if(fieldId == null)
  {
   fieldId = $(this).attr("id");
  }
  fieldRecordKey = $(this).attr("fieldRecordKey");
  value=$(this).attr("checked")?1:0;
    checkboxfieldCodes = checkboxfieldCodes + fieldId +",";
  });
 $("#messageInboxChooseRightMenuForm").children('input[type=radio]').each(function()
 {
  fieldId = $(this).attr("fieldId");
  if(fieldId == null)
  {
   fieldId = $(this).attr("id");
  }
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
         url: "submitComposeMessage.popup",        
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
			
			$('#messageInboxChooseRightMenuForm #tab_3').removeClass('ft-status-bar-li-active');
			$('#messageInboxChooseRightMenuForm #tab_4').addClass('ft-status-bar-li-active');
          //   $('#messageInboxChooseRightMenuForm #tab_3').find('a').removeClass('active');
          //$("#messageInboxChooseRightMenuForm #tab_4").find('a').addClass('active');
          $("#messageInboxChooseRightMenuForm #exitBtn1").attr("class","block");
          $("#messageInboxChooseRightMenuForm #submitMessageBtn1").attr("class","hidden");
          $("#messageInboxChooseRightMenuForm #exitBtn2").attr("class","block");
          $("#messageInboxChooseRightMenuForm #submitMessageBtn2").attr("class","hidden");
         },
   error: function (request, status, error) 
   {
    alert(error);
   }   
     });
 strData = "";
}
function exitComposeMessageRightMenuPopup()
{
	$( '#messageInboxChooseRightMenuForm' ).dialog( 'destroy' );
	$( '#messageInboxChooseRightMenuForm' ).dialog( 'close' );
	var form = null;
	//var strUrl = 'showWelcome.form' ;
	form = document.createElement('FORM');
	form.name = 'frmMain';
	form.id = 'frmMain';
	form.method = 'GET';
	//form.action = strUrl;
	document.body.appendChild(form);
	//form.submit();
}
function closeComposeMessageRightMenuPopup()
{
	$( '#messageInboxChooseRightMenuForm' ).dialog( 'close' );

}