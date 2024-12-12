function addSBLCGTYData(frmId)
{
	$('.disabled').removeAttr("disabled");
	var frm = document.getElementById(frmId);
	document.getElementById("txtRecordIndex").value = 1;
	var type = document.getElementById("type").value;
	if(type == "SBLC")
	{	
		frm.action = "saveImportStandbyLc.form";
	}
	if(type == "GTY")
	{	
		frm.action = "saveImportGuarantee.form";
	}
	frm.target = "";
	$("#frmMain").attr("encoding", "multipart/form-data");
	frm.method = "POST";
	frm.submit();
}
function addAndSubmitSBLCGTYData(frmId)
{
	$('.disabled').removeAttr("disabled");
	var frm = document.getElementById(frmId);
	document.getElementById("txtRecordIndex").value = 1;
	var type = document.getElementById("type").value;
	if(type == "SBLC")
	{	
		frm.action = "submitOnAddImportStandbyLc.form";
	}
	if(type == "GTY")
	{	
		frm.action = "submitOnAddImportGuarantee.form";
	}
	frm.target = "";
	$("#frmMain").attr("encoding", "multipart/form-data");
	frm.method = "POST";
	frm.submit();
}
function updateSBLCGTYData(frmId)
{
	$('.disabled').removeAttr("disabled");
	var frm = document.getElementById(frmId);
	var type = document.getElementById("type").value;
	document.getElementById("txtRecordIndex").value = 1;
	if(type == "SBLC")
	{	
		frm.action = "updateImportStandbyLc.form";
	}
	if(type == "GTY")
	{	
		frm.action = "updateImportGuarantee.form";
	}
	frm.target = "";
	$("#frmMain").attr("encoding", "multipart/form-data");
	frm.method = "POST";
	frm.submit();
}
function updateAndSubmitSBLCGTYData(frmId)
{
	$('.disabled').removeAttr("disabled");
	var frm = document.getElementById(frmId);
	var type = document.getElementById("type").value;
	document.getElementById("txtRecordIndex").value = 1;
	if(type == "SBLC")
	{	
		frm.action = "submitOnUpdateImportStandbyLc.form";
	}
	if(type == "GTY")
	{	
		frm.action = "submitOnUpdateImportGuarantee.form";
	}
	frm.target = "";
	$("#frmMain").attr("encoding", "multipart/form-data");
	frm.method = "POST";
	frm.submit();
}
/*function goBackToCenter(frmId)
{
	var frm = document.getElementById(frmId);
	var type = document.getElementById("type").value;
	if(type == "GTY")
	{	
		frm.action = "importGuaranteeCenter.form";
	}
	if(type == "SBLC")
	{	
		frm.action = "importStandbyLcCenter.form";
	}	
	frm.target = "";
	frm.method = "POST";
	frm.submit();
}

function goBackToAmendCenter(frmId)
{
	var frm = document.getElementById(frmId);
	var type = document.getElementById("type").value;
	if(type == "GTY")
	{	
		frm.action = "importGuaranteeAmendmentCenter.form";
	}
	if(type == "SBLC")
	{	
		frm.action = "importStandbyLcAmendmentCenter.form";
	}
	frm.target = "";
	frm.method = "POST";
	frm.submit();
}*/
function underDevelopement()
{
	alert("Under Development.");
	return;
}
function viewSBLCGTYAttachment(frmId)
{
	var frm = document.getElementById(frmId);
	var type = document.getElementById("type").value;
	if(type == "SBLC")
	{	
		frm.action = "viewImportStandbyLcAttachment.form";
	}
	if(type == "GTY")
	{	
		frm.action = "viewImportGuaranteeAttachment.form";
	}
	frm.target = "";
	frm.method = "POST";
	frm.submit();
}
function showClearIfSelect(fileId, ctrlId, textId) 
{
	var file = $("#" + fileId).val();

	if (file != "") {
		var splitFile = file.split('\\');
		var size = splitFile.length;
		file = splitFile[size-1];
		$("#" + textId).text(file);
		$("#" + ctrlId).show();
		$("#" + fileId).hide();
		$("#" + fileId).next().hide();		
	} else {
		$("#" + ctrlId).hide();
	}
}
function clearFile() 
{
	var ctrl = document.getElementById("fileText");
	if(ctrl != null)
	{
		ctrl.value = "";
		$("#fileText").text("");
	}
	var ctrl = document.getElementById("clearSBLCGTYFile");
	if(ctrl != null)
	{
		$("#clearSBLCGTYFile").hide();
	}
	var ctrl = document.getElementById("clearFile");
	if(ctrl != null)
	{
		$("#clearFile").hide();
	}
	var ctrl = document.getElementById("fileUploadFlag");
	if(ctrl != null)
	{	
		ctrl.value = "N";
		$("#fileUploadFlag").val("N");
	}
	var ctrl = document.getElementById("updateSBLCGTYFileSelector");
	if(ctrl != null)
	{	
		$("#updateSBLCGTYFileSelector").show();
	}
	var ctrl = document.getElementById("file1");
	if(ctrl != null)
	{
		ctrl.value = "";
		$("#file1").val("");
		$("#file1").show();
		$("#file1").next().show();
	}
}
function addSBLCGTYDataAmend(frmId)
{
	var frm = document.getElementById(frmId);
	document.getElementById("txtRecordIndex").value = 1;
	var type = document.getElementById("type").value;
	if(type == "SBLC")
	{	
		frm.action = "saveImportStandbyLcAmendment.form";
	}
	if(type == "GTY")
	{	
		frm.action = "saveImportGuaranteeAmendment.form";
	}
	frm.target = "";
	$("#frmMain").attr("encoding", "multipart/form-data");
	frm.method = "POST";
	$('.disabled').removeAttr("disabled");
	frm.submit();
}
function updateSBLCGTYDataAmend(frmId)
{
	$('.disabled').removeAttr("disabled");
	var frm = document.getElementById(frmId);
	document.getElementById("txtRecordIndex").value = 1;
	var type = document.getElementById("type").value;
	if(type == "SBLC")
	{	
		frm.action = "updateImportStandbyLcAmendment.form";
	}
	if(type == "GTY")
	{	
		frm.action = "updateImportGuaranteeAmendment.form";
	}
	frm.target = "";
	$("#frmMain").attr("encoding", "multipart/form-data");
	frm.method = "POST";
	frm.submit();
}
function updateAndSubmitSBLCGTYDataAmend(frmId)
{
	$('.disabled').removeAttr("disabled");
	var frm = document.getElementById(frmId);
	var type = document.getElementById("type").value;
	document.getElementById("txtRecordIndex").value = 1;
	if(type == "SBLC")
	{	
		frm.action = "submitOnUpdateImportStandbyLcAmendment.form";
	}
	if(type == "GTY")
	{	
		frm.action = "submitOnUpdateImportGuaranteeAmendment.form";
	}
	frm.target = "";
	$("#frmMain").attr("encoding", "multipart/form-data");
	frm.method = "POST";
	frm.submit();
}
function addAndSubmitSBLCGTYDataAmend(frmId)
{
	$('.disabled').removeAttr("disabled");
	var frm = document.getElementById(frmId);
	var type = document.getElementById("type").value;
	document.getElementById("txtRecordIndex").value = 1;
	if(type == "SBLC")
	{	
		frm.action = "submitOnAddImportStandbyLcAmendment.form";
	}
	if(type == "GTY")
	{	
		frm.action = "submitOnAddImportGuaranteeAmendment.form";
	}
	frm.target = "";
	$("#frmMain").attr("encoding", "multipart/form-data");
	frm.method = "POST";
	frm.submit();
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
	    height: 170,
	    modal:true,
	    resizable:false,
	    width: 350,
	    hide:"explode",
	    buttons: {
	     "OK": function() {
	      if (ctrlFile.value != null && ctrlFile.value !="") {
	       var fileText = 'Remove File.. '+ctrlFile.value;
	       $(hlnk).find('span').text(fileText);
	       _blnSelected = true;
	       ctrlFileUploadFlag.value="Y";	       
	      }
	      if (navigator.appName == "Microsoft Internet Explorer") {
				$(this).dialog("close");
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
	    },
	    open: function() {
            $('.ui-dialog-buttonpane').find('button:contains("Cancel")').find('.ui-button-text').prepend('<span class="fa fa-minus-circle">&nbsp;&nbsp</span>');
            $('.ui-dialog-buttonpane').find('button:contains("OK")').find('.ui-button-text').prepend('<span class="fa fa-check-circle">&nbsp;&nbsp</span>');
		}
	   }
	  );
	  dlg.parent().appendTo($('#frmMain'));
	  dlg.dialog('open');
	 }
	}
function changeGtyType( )
{
	if($("#guaranteeType").val() == "Shipping")
	{
		$('#lcNumberlabel').attr('class','frmLabel required');
		$("#lcNumSeek").attr("class","linkbox seeklink");
		$("#lcNumber").attr("class","rounded w14");
		$("#lcNumber").removeAttr("disabled");
	}
	else
	{
		$('#lcNumberlabel').attr('class','hidden');
		$("#lcNumSeek").attr("class","hidden");
		$("#lcNumber").attr("class","hidden");
		$("#lcNumber").attr("disabled","disabled");
	}
}
function getTextForGtyPopup() 
{
	$('#textforGtyPopup').dialog( {
		autoOpen : false,
		height : 400,
		width : 700,
		modal : true,
		buttons : {
			"OK" : function() 
			{
				document.getElementById("textForGuarantee").value = $('#textAreatextForGty').val();	
				$(this).dialog("close");
				document.getElementById('btnEditTextForGty').focus();
			},
			"Cancel" : function() 
			{
				$('#textAreatextForGty').val(" ")
				$(this).dialog("close");
				document.getElementById('btnEditTextForGty').focus();
			}			
		},
		open: function() {
            $('.ui-dialog-buttonpane').find('button:contains("Cancel")').find('.ui-button-text').prepend('<span class="fa fa-minus-circle">&nbsp;&nbsp</span>');
            $('.ui-dialog-buttonpane').find('button:contains("OK")').find('.ui-button-text').prepend('<span class="fa fa-check-circle">&nbsp;&nbsp</span>');
	}
	});
	$('#textforGtyPopup').dialog("open");
}
function viewTextForGtyPopup() 
{
	$('#textforGtyPopup').dialog( {
		autoOpen : false,
		height : 400,
		width : 700,
		modal : true,
		buttons : {
			"OK" : function() 
			{
				$(this).dialog("close");
			}
		},
		open: function() {           
            $('.ui-dialog-buttonpane').find('button:contains("OK")').find('.ui-button-text').prepend('<span class="fa fa-check-circle">&nbsp;&nbsp</span>');
	}
	});
	$('#textforGtyPopup').dialog("open");
}

function goBackToMasterView(frmId)
{
	var frm = document.getElementById(frmId);
	var type = document.getElementById("type").value;
	if(type == "SBLC")
	{	
		frm.action = "viewImportStandbyLcMasterDetails.form";
	}
	if(type == "GTY")
	{	
		frm.action = "viewImportGuaranteeMasterDetails.form";
	}
	frm.target = "";
	frm.method = "POST";
	frm.submit();	
}

function goBackToAmendMaster(frmId)
{
	var frm = document.getElementById(frmId);
	var type = document.getElementById("type").value;
	if(type == "SBLC")
	{	
		frm.action = "backToViewImportStandbyLcAmendMstDetails.form";
	}
	if(type == "GTY")
	{	
		frm.action = "backToViewImportGuaranteeAmendMstDetails.form";
	}
	frm.target = "";
	frm.method = "POST";
	frm.submit();
}

function goBackToAmendMaster2(frmId)
{
	var frm = document.getElementById(frmId);
	var type = document.getElementById("type").value;
	if(type == "SBLC")
	{	
		frm.action = "backToViewImpStandbyLcAmendMasterDetails.form";
	}
	if(type == "GTY")
	{	
		frm.action = "backToViewImpGuaranteeAmendMasterDetails.form";
	}
	frm.target = "";
	frm.method = "POST";
	frm.submit();
}

function goBackToCancelMaster(frmId)
{
	var frm = document.getElementById(frmId);
	var type = document.getElementById("type").value;
	if(type == "SBLC")
	{	
		frm.action = "backToViewImpStandbyLcCancellationMstDetails.form";
	}
	if(type == "GTY")
	{	
		frm.action = "backToViewImpGuaranteeCancellationMstDetails.form";
	}
	frm.target = "";
	frm.method = "POST";
	frm.submit();
}
function goBackToCancelMaster2(frmId)
{
	var frm = document.getElementById(frmId);
	var type = document.getElementById("type").value;
	if(type == "SBLC")
	{	
		frm.action = "backToViewImportStandbyLcCancellationMstDetails.form";
	}
	if(type == "GTY")
	{	
		frm.action = "backToViewImportGuaranteeCancellationMstDetails.form";
	}
	frm.target = "";
	frm.method = "POST";
	frm.submit();
}
function goToBack(strUrl, frmId)
{
	if($('#dirtyBit').val()=="1")
	{	
		getConfirmationPopup(frmId, strUrl);
	}	
	else
    {
		var frm = document.getElementById(frmId);
		frm.action = strUrl;
		frm.target = "";
		frm.method = "POST";
		frm.submit();	
    }		
}
function getConfirmationPopup(frmId, strUrl)
{
	$('#confirmPopup').dialog( {
		autoOpen : false,
		height : 200,
		width : 420,
		modal : true,
		buttons : {
				"Yes" : function() {
					var frm = document.getElementById(frmId);
					frm.action = strUrl;
					frm.target = "";
					frm.method = "POST";
					frm.submit();
					},
				"No" : function() {
					$(this).dialog("close");
					}
		}
	});
	$('#confirmPopup').dialog("open");
}
function setDirtyBit()
{
	document.getElementById("dirtyBit").value = "1";	
}
function messagePopup() 
{
	$('#messagePopup').dialog( {
		autoOpen : true,
		height : 150,
		width : 350,
		modal : true,
		buttons : {
				"OK" : function() {
					$(this).dialog('close');
				}
		},
		open: function() {
            $('.ui-dialog-buttonpane').find('button:contains("OK")').find('.ui-button-text').prepend('<span class="fa fa-check-circle">&nbsp;&nbsp</span>');
	}
	});
	$('#messagePopup').dialog('open');
}