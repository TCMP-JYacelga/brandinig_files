function viewLCAttachment(frmId)
{
	var frm = document.getElementById(frmId);
	document.getElementById("txtRecordIndex").value = 1;
	frm.action = "viewImportLcAttachment.form";
	frm.target = "";
	frm.method = "POST";
	frm.submit();
}
function addLCData(frmId)
{
	$('.disabled').removeAttr("disabled");
	var frm = document.getElementById(frmId);
	document.getElementById("txtRecordIndex").value = 1;
	frm.action = "saveImportLc.form";
	frm.target = "";
	frm.enctype = "multipart/form-data";
	frm.method = "POST";
	frm.submit();
}
function updateLCData(frmId)
{
	$('.disabled').removeAttr("disabled");
	var frm = document.getElementById(frmId);
	document.getElementById("txtRecordIndex").value = 1;
	frm.action = "updateImportLc.form";
	frm.target = "";
	frm.enctype = "multipart/form-data";
	frm.method = "POST";
	frm.submit();
}
function updateAndSubmitLCData(frmId)
{
	$('.disabled').removeAttr("disabled");
	var frm = document.getElementById(frmId);
	document.getElementById("txtRecordIndex").value = 1;
	frm.action = "submitOnUpdateImportLc.form";
	frm.target = "";
	frm.enctype = "multipart/form-data";
	frm.method = "POST";
	frm.submit();
}
function addAndSubmitLCData(frmId)
{
	$('.disabled').removeAttr("disabled");
	var frm = document.getElementById(frmId);
	document.getElementById("txtRecordIndex").value = 1;
	frm.action = "submitOnAddImportLc.form";
	frm.target = "";
	frm.enctype = "multipart/form-data";
	frm.method = "POST";
	frm.submit();
}
function goBackToLC(frmId)
{
	var frm = document.getElementById(frmId);
	frm.action = "importLcCenter.form";
	frm.target = "";
	frm.method = "POST";
	frm.submit();
}
function addLCDocDetail(frmId, url)
{
	$('.disabled').removeAttr("disabled");
	var frm = document.getElementById(frmId);
	document.getElementById("txtRecordIndex").value = 1;
	frm.action = url;
	frm.target = "";
	frm.method = "POST";
	frm.submit();	
}

function addLCAmendDocDetail(frmId, url)
{
	$('.disabled').removeAttr("disabled");
	var frm = document.getElementById(frmId);
	document.getElementById("txtRecordIndex").value = 1;
	frm.action = url;
	frm.target = "";
	frm.method = "POST";
	frm.submit();	
}

function updateLCDocDetail(frmId, rowIndex)
{
	var frm = document.getElementById(frmId);
	document.getElementById("txtRecordIndex").value = 1;
	document.getElementById("txtDocIndex").value = rowIndex;
	frm.action = "updateImportLcDocumentDetail.form";
	frm.target = "";
	frm.method = "POST";
	frm.submit();	
}
function deleteLCDocDetail(frmId, rowIndex)
{
	var frm = document.getElementById(frmId);
	document.getElementById("txtDocIndex").value = rowIndex;
	frm.action = "deleteImportLcDocumentDetail.form";
	frm.target = "";
	frm.method = "POST";
	frm.submit();	
}

function deleteLCAmendDocDetail(frmId, rowIndex)
{
	var frm = document.getElementById(frmId);
	document.getElementById("txtDocIndex").value = rowIndex;
	frm.action = "deleteImportLcAmendmentDocumentDetail.form";
	frm.target = "";
	frm.method = "POST";
	frm.submit();	
}

function viewLCAttachmentAmend(frmId)
{
	var frm = document.getElementById(frmId);
	document.getElementById("txtRecordIndex").value = 1;
	frm.action = "viewImportLcAttachment.form";
	frm.target = "";
	frm.method = "POST";
	frm.submit();
}
function addLCDataAmend(frmId)
{
	$('.disabled').removeAttr("disabled");
	var frm = document.getElementById(frmId);
	document.getElementById("txtRecordIndex").value = 1;
	frm.action = "saveImportLcAmendment.form";
	frm.target = "";
	//$("#frmMain").attr("encoding", "multipart/form-data");
	frm.enctype = "multipart/form-data";
	frm.method = "POST";
	frm.submit();
}
function updateLCDataAmend(frmId)
{
	$('.disabled').removeAttr("disabled");
	var frm = document.getElementById(frmId);
	document.getElementById("txtRecordIndex").value = 1;
	frm.action = "updateImportLcAmendment.form";
	frm.target = "";
	//$("#frmMain").attr("encoding", "multipart/form-data");
	frm.enctype = "multipart/form-data";
	frm.method = "POST";
	frm.submit();
}
function updateAndSubmitLCDataAmend(frmId)
{
	$('.disabled').removeAttr("disabled");
	var frm = document.getElementById(frmId);
	document.getElementById("txtRecordIndex").value = 1;
	frm.action = "submitOnUpdateImportLcAmendment.form";
	frm.target = "";
	//$("#frmMain").attr("encoding", "multipart/form-data");
	frm.enctype = "multipart/form-data";
	frm.method = "POST";
	frm.submit();
}
function addAndSubmitLCDataAmend(frmId)
{
	$('.disabled').removeAttr("disabled");
	var frm = document.getElementById(frmId);
	document.getElementById("txtRecordIndex").value = 1;
	frm.action = "submitOnAddImportLcAmendment.form";
	frm.target = "";
	//$("#frmMain").attr("encoding", "multipart/form-data");
	frm.enctype = "multipart/form-data";
	frm.method = "POST";
	frm.submit();
}
function goBackToLCAmend(frmId)
{
	var frm = document.getElementById(frmId);
	frm.action = "importLcAmendmentCenter.form";
	frm.target = "";
	frm.method = "POST";
	frm.submit();
}
function addLCDocDetailAmend(frmId)
{
	var frm = document.getElementById(frmId);
	document.getElementById("txtRecordIndex").value = 1;
	frm.action = "saveImportLcAmendmentDocmentDetail.form";
	frm.target = "";
	frm.method = "POST";
	frm.submit();	
}
function deleteLCDocDetailAmend(frmId, rowIndex)
{
	var frm = document.getElementById(frmId);
	document.getElementById("txtDocIndex").value = rowIndex;
	frm.action = "deleteImportLcAmendmentDocmentDetail.form";
	frm.target = "";
	frm.method = "POST";
	frm.submit();	
}
function viewLCAttachment(frmId)
{
	var frm = document.getElementById(frmId);
	document.getElementById("txtRecordIndex").value = 1;
	frm.action = "viewImportLcAttachment.form";
	frm.target = "";
	frm.method = "POST";
	frm.submit();
}
function viewAMENDAttachment(frmId)
{
	var frm = document.getElementById(frmId);
	document.getElementById("txtRecordIndex").value = 1;
	frm.action = "viewImportLcAmendmentAttachment.form";
	frm.target = "";
	frm.method = "POST";
	frm.submit();
}
function getAddDetailPopup(frmId) 
{
	$('#addDetailPopup').dialog({
		autoOpen : false,
		height : 150,
		width : 420,
		modal : true,
		buttons : {
				"OK" : function() {
					$(this).dialog("close");
				}
		}
	});
	$('#addDetailPopup').dialog("open");
}
function checkPayment()
{	
	if($('#paymentInstBybill:checked').val()=='N')
	{		
		$('#accLabel').attr('class','frmLabel');
		$('#debitAccount').attr('disabled','disabled');
		$('#debitAccount').val("");
	}
	else
	{	
		$('#accLabel').attr('class','frmLabel required');
		$('#debitAccount').removeAttr('disabled');
	} 
}
function showUploadDialog(hlnk) {
	 var ctrlFile = document.getElementById('file1');
	 var ctrlFileUploadFlag = document.getElementById('fileUploadFlag');
	 if (_blnSelected) 
	 {
	  $(hlnk).find('span').text('Upload File..');
	  $("#viewAttachment").addClass("ui-helper-hidden");
	  if (!$.browser.msie) {
	  ctrlFile.value = '';
	  }
	  else{
		  	$("#file1").replaceWith($("#file1").clone(true));
		  }
	  _blnSelected = false;
	  ctrlFileUploadFlag.value="N";
	 } 
	 else 
	 {
	  var dlg = $('#divFilUpload');
	  dlg.dialog({
	    bgiframe:true,
	    autoOpen:false,
	    height:"auto",
	    modal:true,
	    resizable:false,
	    width:'auto',
	    hide:"explode",
	    buttons: {
	     "OK": function() {
	      if (ctrlFile.value != null && ctrlFile.value !="") {
	       var fileText = 'Remove File.. '+ctrlFile.value;
	       var ft=fileText;
	       if(fileText.length > 12)
	    	 var  fileText1 = fileText.substring(0,27);
	       $(hlnk).find('span').text(fileText1+"..");
	       $(hlnk).find('span').attr("title", ft);
	       _blnSelected = true;
	       ctrlFileUploadFlag.value="Y";	
	      }
	      $(this).dialog("close");
	      document.getElementById('uploadfilelink').focus();	  
	     },
	     "Cancel": function() {
	    	  if (!$.browser.msie) {
	    		  ctrlFile.value = '';
	    		  }
	    		  else{
	    			  	$("#file1").replaceWith($("#file1").clone(true));
	    			  }
	      _blnSelected = false;
	      $(hlnk).find('span').text('Upload File...');
	      $(this).dialog('destroy');
	      ctrlFileUploadFlag.value="N";
	      document.getElementById('uploadfilelink').focus();
	     }
	    }
	   }
	  );
	  dlg.parent().appendTo($('#frmMain'));
	  dlg.dialog('open');
	 }
	}
function setOriginals()
{
	if($('#txtOriginalCopies1:checked').val()=='Y')
		{
		document.getElementById("originalCopies1").value=1;
		}
	else
		document.getElementById("originalCopies1").value=0;
}