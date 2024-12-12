jQuery.fn.clientCodeSeekAutoComplete= function() {
	return this.each(function() {
		$(this).autocomplete({
					source : function(request, response) {
						$.ajax({
									url : "services/userseek/userclients.json",
									type: "POST",
									dataType : "json",
									data : {
										$autofilter : request.term,
										$top:-1
									},
									success : function(data) {
										var rec = data.d.preferences;
										response($.map(rec, function(item) {
													return {														
														label : item.DESCR,														
														bankDtl : item
													}
												}));
									}
								});
					},
					minLength : 1,
					select : function(event, ui) {
						var data = ui.item.bankDtl;
						if (data) {
							if (!isEmpty(data.DESCR))
							{
								$('#txtLCMyClientDesc').val(data.DESCR);
								$('#txtLCMyClientCode').val(data.CODE);
							}
						}
						filter('frmMain');
					},
					open : function() {
						$(this).removeClass("ui-corner-all")
								.addClass("ui-corner-top");
					},
					close : function() {
						$(this).removeClass("ui-corner-top")
								.addClass("ui-corner-all");
					}
				});/*.data("autocomplete")._renderItem = function(ul, item) {
			var inner_html = '<a><ol class="xn-autocompleter"><ul style="width:200px;">'
					+ item.label + '</ul></ol></a>';
			return $("<li></li>").data("item.autocomplete", item)
					.append(inner_html).appendTo(ul);
		};*/
	});
};

function applySortOnTemplate(sortCol, sorOrd, colId)
{
	var frm = document.getElementById('frmMain');
	if (!frm) 
	{
		alert(_errMessages.ERR_NOFORM);
		return false;
	}
	if(!isEmpty(colId))
	{
		document.getElementById("txtSortColId").value = colId;
		if(!isEmpty(sortCol))
		{
			document.getElementById("txtSortColName").value = sortCol;
		}
		if(!isEmpty(sorOrd))
		{
			document.getElementById("txtSortOrder").value = sorOrd;			
		}
		frm.action = "sortLcTemplateList.form";
		frm.target = "";
		frm.method = "POST";
		frm.submit();		
	}
}
function getChargesField(chargeTypeCtrl)
{
	if(chargeTypeCtrl.value == 'BEN')
	{
		$("#charges").removeAttr("disabled");		
	}
	else
	{
		$('#charges').val(0);
		$('#charges').attr('disabled','disabled');		
	}
}
function changePage(navType, newPage) 
{
	var frm = document.getElementById('frmMain');
	if (!frm) 
	{
		alert(_errMessages.ERR_NOFORM);
		return false;
	}	
	var curPage=$('.pcontrol input', this.pDiv).val();
		var totPage='<c:out value="${total_pages}"/>';
		
		switch(navType) 
	{
		case 'first':
			frm.action = 'lcTemplate_first.form';
			break;
		case 'prev':
			frm.action = 'lcTemplate_previous.form';
			break;
		case 'next':
		if(curPage==totPage)
				  return false;
			frm.action = 'lcTemplate_next.form';
			break;
		case 'last':
			frm.action = 'lcTemplate_last.form';
			break;
		case 'input':
			$('#page_number').val(curPage);
			frm.action = 'lcTemplate_goto.form';
			break;
		default:
			alert(_errMessages.ERR_NAVIGATE);
			return false;
	}
	frm.target = "";
	frm.method = "POST";
	frm.submit();
}
function sectionCollapseExpandOnLoad()
{
	var collapsFlag=0;
	var labels = $(".enrichLabel.required").size();
	if(labels!=0)
	{
		$("#title_AdditionalDtls").children('a').toggleClass("icon-expand-minus icon-collapse-plus");
		$("#title_AdditionalDtls").next().slideToggle("fast");
		return;
	}
	$(".enrichValue").each(function(){
	    
		if(!isEmpty($(this).val()))
		{
			collapsFlag=1;				
		}
		
	});	
	if(collapsFlag==1)
	{
		$("#title_AdditionalDtls").children('a').toggleClass("icon-expand-minus icon-collapse-plus");
		$("#title_AdditionalDtls").next().slideToggle("fast");
		return;
	}
}

function getNewTemplatePopUp(frmId) 
{
	$('#addTemplatePopup').dialog( {
		autoOpen : false,
		resizable : false,
		width : 340,
		height : 280,
		modal : true,
		position : [ 'center', 'middle' ],
		buttons : 
		{
			"Cancel" : function() 
			{
				$(this).dialog("close");
			}
		},
		open: function(){
			$('.ui-dialog-buttonpane').find('.ui-button-text').prepend('<span class="fa fa-minus-circle">&nbsp;&nbsp</span>');
			$('.ui-dialog-buttonpane').find('.ui-dialog-buttonset').addClass('nofloating centerAlign');
		}
	});
	$('#addTemplatePopup').dialog("open");
	
}
function showAddNewForm(frmId, rowIndex)
{
	var frm = document.getElementById(frmId);
	document.getElementById("txtRecordIndex").value = rowIndex;
	frm.action = "newLcTemplate.form";
	frm.target = "";
	frm.method = "POST";
	frm.submit();
}
function filter(frmId)
{
	var frm = document.getElementById(frmId);
	if('0'==strEntity)
	 {
		if($('#txtLCMyClientDesc').val()== null || $('#txtLCMyClientDesc').val()=='')
		{
			$('#txtLCMyClientCode').val('');
		}
		else
		{
			if($('#txtLCMyClientCode').val()== null|| $('#txtLCMyClientCode').val()=='')
			{
				$('#txtLCMyClientCode').val($('#txtLCMyClientDesc').val());  
			}		  
		}
	 }		
	frm.action = "filterLcTemplateList.form";
	frm.target = "";
	frm.method = "POST";
	frm.submit();
}
function showEditForm(frmId, rowIndex)
{
	var frm = document.getElementById(frmId);
	document.getElementById("txtRecordIndex").value = rowIndex;
	frm.action = "editLcTemplate.form";
	frm.target = "";
	frm.method = "POST";
	frm.submit();
}
function viewData(frmId, rowIndex)
{
	var frm = document.getElementById(frmId);
	document.getElementById("txtRecordIndex").value = rowIndex;
	frm.action = "viewLcTemplate.form";
	frm.target = "";
	frm.method = "POST";
	frm.submit();
}
function historyPage(frmId, rowIndex)
{
	var frm = document.getElementById(frmId);
	document.getElementById("txtRecordIndex").value = rowIndex;
	frm.action =  "lcTemplateHistory.hist";
	frm.target = "hWinSeek";
	frm.method = "POST";
	var strAttr;
	var intTop  = (screen.availHeight - 300)/2;
	var intLeft = (screen.availWidth - 600)/2;
	strAttr = "dependent=yes,scrollbars=yes,";
	strAttr = strAttr + "left=" + intLeft + ",";
	strAttr = strAttr + "top=" + intTop + ",";
	strAttr = strAttr + "width=600,height=300";
	window.open ("", "hWinSeek", strAttr);
	frm.submit();
	frm.target = "";
}
function updateData(frmId)
{
	$('.disabled').removeAttr('disabled');
	var frm = document.getElementById(frmId);
	document.getElementById("txtRecordIndex").value = 0;
	frm.action = "updateLCTemplateMasterController.form";
	frm.target = "";
	frm.enctype = "multipart/form-data";
	frm.method = "POST";
	frm.submit();
}
function viewAttachment(frmId)
{
	var frm = document.getElementById(frmId);
	document.getElementById("txtRecordIndex").value = 1;
	frm.action = "viewLcTemplateAttachment.form";
	frm.target = "";
	frm.method = "POST";
	frm.submit();
}
function addData(frmId)
{
	$('.disabled').removeAttr('disabled');
	var frm = document.getElementById(frmId);
	document.getElementById("txtRecordIndex").value = 1;
	frm.action = "saveLCTemplateMasterController.form";
	frm.target = "";
	frm.enctype = "multipart/form-data";
	frm.method = "POST";
	frm.submit();
}
function goToBack(frmId, strUrl)
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

function goBackToAuthCenter(frmId)
{
	var frm = document.getElementById(frmId);
	frm.action = "lcTemplateAuthList.form";
	frm.target = "";
	frm.method = "POST";	
	frm.submit();
}

function enableRecord(frmId, rowIndex)
{
	var frm = document.getElementById(frmId);
	document.getElementById("txtRecordIndex").value = rowIndex;
	frm.action = "enableLcTemplate.form";
	frm.target = "";
	frm.method = "POST";
	frm.submit();
}
function disableRecord(frmId, rowIndex)
{
	var frm = document.getElementById(frmId);
	document.getElementById("txtRecordIndex").value = rowIndex;
	frm.action = "disableLcTemplate.form";
	frm.target = "";
	frm.method = "POST";
	frm.submit();
}
function acceptRecord(frmId, rowIndex)
{
	var frm = document.getElementById(frmId);
	document.getElementById("txtRecordIndex").value = rowIndex;
	frm.action = "acceptLcTemplate.form";
	frm.target = "";
	frm.method = "POST";
	frm.submit();
}
function discardRecord(frmId, rowIndex)
{
	var frm = document.getElementById(frmId);
	document.getElementById("txtRecordIndex").value = rowIndex;
	frm.action = "discardLcTemplate.form";
	frm.target = "";
	frm.method = "POST";
	frm.submit();
}
function rejectRecord(frmId, rowIndex)
{
	var frm = document.getElementById(frmId);
	document.getElementById("txtRecordIndex").value = rowIndex;
	document.getElementById("txtTemplateRejectRemark").value = $('#txtAreaRejectRemark').val();	
	frm.action = "rejectLcTemplate.form";
	frm.target = "";
	frm.method = "POST";
	frm.submit();
}
function addTemplateDetail(frmId, url)
{
	var frm = document.getElementById(frmId);
	document.getElementById("txtRecordIndex").value = 1;
	frm.action = url;
	frm.target = "";
	frm.method = "POST";
	frm.submit();	
}
function updateTemplateDetail(frmId, rowIndex)
{
	var frm = document.getElementById(frmId);
	document.getElementById("txtRecordIndex").value = 1;
	document.getElementById("txtDocIndex").value = rowIndex;
	frm.action = "updateTemplateDetail.form";
	frm.target = "";
	frm.method = "POST";
	frm.submit();	
}
function deleteDocumentDetail(frmId, rowIndex)
{
	var frm = document.getElementById(frmId);
	document.getElementById("txtDocIndex").value = rowIndex;
	frm.action = "deleteLcTemplateDocumentDetail.form";
	frm.target = "";
	frm.method = "POST";
	frm.submit();	
}
function getRejectPopupNew(checkBox,frmId, rowIndex) 
{
	$('#rejectPopup').dialog( {
		autoOpen : false,
		height : 240,
		width : 420,
		modal : true,
		buttons : {
			"OK" : function() 
			{
				rejectRecord(frmId, rowIndex);
			},
			"Cancel" : function() 
			{
				checkBox.checked = false;
				$('#txtAreaRejectRemark').val("");
				$(this).dialog("close");
			}
		}
	});
	$('#rejectPopup').dialog("open");
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
	var ctrl = document.getElementById("clearInvoiceFile");
	if(ctrl != null)
	{
		$("#clearInvoiceFile").hide();
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
	var ctrl = document.getElementById("updateInvoiceFileSelector");
	if(ctrl != null)
	{	
		$("#updateInvoiceFileSelector").show();
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

function underDevelopement()
{
	alert("Under Development.");
	return;
}
function goBackToLcCenter(frmId)
{
	var frm = document.getElementById(frmId);
	frm.action = "viewImportLcMasterDetails.form";
	frm.target = "";
	frm.method = "POST";
	frm.submit();	
}
function goBackToAmendCenter(frmId)
{
	var frm = document.getElementById(frmId);
	frm.action = "importLcAmendmentCenter.form";
	frm.target = "";
	frm.method = "POST";
	frm.submit();
}
function goBackToAmendMaster2(frmId)
{
	var frm = document.getElementById(frmId);
	frm.action = "backToViewImportLcAmendmentMasterDetails.form";
	frm.target = "";
	frm.method = "POST";
	frm.submit();
}
function goBackToAmendMaster(frmId)
{
	var frm = document.getElementById(frmId);
	frm.action = "backToAmendmentMstDetails.form";
	frm.target = "";
	frm.method = "POST";
	frm.submit();
}
function goBackToCancelMaster(frmId)
{
	var frm = document.getElementById(frmId);
	frm.action = "backToImpLcCancellationMstDetails.form";
	frm.target = "";
	frm.method = "POST";
	frm.submit();
}
function goBackToCancelMaster2(frmId)
{
	var frm = document.getElementById(frmId);
	frm.action = "backToImpLcCancellationMasterDetails.form";
	frm.target = "";
	frm.method = "POST";
	frm.submit();
}
function addTemplateAndDetail(frmId, url)
{
	$('.disabled').removeAttr("disabled");
	var frm = document.getElementById(frmId);
	document.getElementById("txtRecordIndex").value = 1;
	frm.action = url;
	frm.target = "";
	frm.method = "POST";
	frm.submit();	
}
function messagePopup() {
	$('#messagePopup').dialog( {
		autoOpen : true,
		height : 150,
		width : 350,
		modal : true,
		buttons : {
				"OK" : function() {
					$(this).dialog('close');
				}
		}
	});
	$('#messagePopup').dialog('open');
}
function setDirtyBit()
{
	document.getElementById("dirtyBit").value = "1";	
}
function getConfirmationPopup(frmId, strUrl, strUrlSave)
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

function checkDefPayTerm(avlblByTypeCtrl)
{
	if(avlblByTypeCtrl.value == 'Deferred Payment')
	{
		$("#defPayTerm").show();
		$("#defPayTermLbl").show();
	}
	else
	{
		$('#defPayTerm').val("");
		$("#defPayTerm").hide();
		$("#defPayTermLbl").hide();
	}
}

function attachLCDoc(strUrl)
{
  var frm = document.forms["frmMain"];
  frm.action = strUrl;
  frm.target = "";
  frm.method = "POST";
  frm.submit();
}

function setClientDesc()
{
	$('#txtLCMyClientDesc').val($('#txtLCMyClientCode option:selected').text());
}

jQuery.fn.ForceAlphaNumericAndPercentOnly = function() {
	return this
			.each(function(){
				$(this)
						.keypress(function(e) 
						{
							// allows only alphabets & numbers, backspace, tab
							var keycode = e.which || e.keyCode;						
							if ((keycode >= 48 && keycode <= 57) || (keycode >= 65 && keycode <= 90) || (keycode >= 97 && keycode <= 122)
									|| keycode == 8 || keycode == 9 || keycode == 37)
								return true;

							return false;
						})
			})
};