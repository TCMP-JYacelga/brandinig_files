function showAddNewProductForm(frmId)
{
	var frm = document.getElementById(frmId);
	frm.action = "newScmWorkflowProduct.form";
	frm.target = "";
	frm.method = "POST";
	frm.submit();
}
function filter()
{
	var frm = document.getElementById('frmMain');
	frm.action = "filterScmWorkflowProductList.form";
	frm.target = "";
	frm.method = "POST";
	frm.submit();
}
function viewProductData(strUrl, frmId, rowIndex)
{
	var frm = document.getElementById(frmId);
	document.getElementById("txtRecordIndex").value = rowIndex;
	frm.action = strUrl;
	frm.target = "";
	frm.method = "POST";
	frm.submit();
}
function editProductData(strUrl, frmId, rowIndex)
{
	var frm = document.getElementById(frmId);
	document.getElementById("txtRecordIndex").value = rowIndex;
	frm.action = strUrl;
	frm.target = "";
	frm.method = "POST";
	frm.submit();
}
function acceptRecord(strUrl, frmId, rowIndex)
{
	var frm = document.getElementById(frmId);
	document.getElementById("txtRecordIndex").value = rowIndex;
	frm.action = strUrl;
	frm.target = "";
	frm.method = "POST";
	frm.submit();
}
function rejectRecord(strUrl, frmId, rowIndex)
{
	var frm = document.getElementById(frmId);
	document.getElementById("txtRecordIndex").value = rowIndex;
	document.getElementById("txtWorkflowRejectRemark").value = $('#txtAreaRejectRemark').val();
	frm.action = strUrl;
	frm.target = "";
	frm.method = "POST";
	frm.submit();
}
function disableRecord(strUrl, frmId, rowIndex)
{
	var frm = document.getElementById(frmId);
	document.getElementById("txtRecordIndex").value = rowIndex;
	frm.action = strUrl;
	frm.target = "";
	frm.method = "POST";
	frm.submit();
}
function enableRecord(strUrl, frmId, rowIndex)
{
	var frm = document.getElementById(frmId);
	document.getElementById("txtRecordIndex").value = rowIndex;
	frm.action = strUrl;
	frm.target = "";
	frm.method = "POST";
	frm.submit();
}
function discardWorkflowProduct(strUrl, frmId, rowIndex)
{
	var frm = document.getElementById(frmId);
	document.getElementById("txtRecordIndex").value = rowIndex;
	frm.action = strUrl;
	frm.target = "";
	frm.method = "POST";
	frm.submit();
}
function workflowHistory(strUrl, frmId, rowIndex)
{
	var frm = document.getElementById(frmId);
	document.getElementById("txtRecordIndex").value = rowIndex;
	frm.action = strUrl;
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

function getRejectPopupNew(strUrl, frmId, rowIndex) {
	$('#rejectPopup').dialog( {
		autoOpen : false,
		height : 240,
		width : 420,
		modal : true,
		close: function() {$("#rejectCheck"+rowIndex).attr("checked", false);},
		buttons : {
				"Ok" : function() {
					rejectRecord(strUrl, frmId, rowIndex);
				},
				"Cancel" : function() {
					$("#rejectCheck"+rowIndex).attr("checked", false);
					$(this).dialog("close");
					}
		}
	});
	$('#rejectPopup').dialog("open");
}
function onAppReqdChange()
{
	if($('#mypApprManual:checked').val()!=undefined)
	{
	 $('#autoAuthLimitManual').removeAttr("disabled");
	}
	else
	{
	 $('#autoAuthLimitManual').val("0.0");
	 $('#autoAuthLimitManual').attr("disabled","disabled");
	}	
}
function onAutoSubmitChange()
{
	if($('#closeRequired:checked').val()!=undefined)
	{
		$('#mypAllowTxnEdit').attr("disabled","disabled");
		$('#mypAllowTxnEdit').removeAttr("checked");
	 
	}
	else
	{
		$('#mypAllowTxnEdit').removeAttr("disabled");
	}	
}
function onAppReqdUploadChange()
{
	if($('#mypApprUpload:checked').val()!=undefined)
	{
	 $('#autoAuthLimitUpload').removeAttr("disabled");
	}
	else
	{
	 $('#autoAuthLimitUpload').val("0.0");
	 $('#autoAuthLimitUpload').attr("disabled","disabled");
	}	
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

/*################# Add scm Workflow product ####################*/
function goToBack(frmId, strUrl)
{
	if($('#dirtyBit').val()=="1")
		getConfirmationPopup(frmId, strUrl);
	else
	{
	var frm = document.getElementById(frmId);
	frm.action = strUrl;
	frm.target = "";
	frm.method = "POST";
	frm.submit();
	}
}

function addNewSCMProduct(frmId, strUrl)
{
	var frm = document.getElementById(frmId);
	$("#mypBnkProduct").removeAttr("disabled");
	frm.action = strUrl;
	frm.target = "";
	frm.method = "POST";
	frm.submit();
}
function enableFileUpload(frmId, strUrl){
	
	var frm = document.getElementById(frmId);
	frm.action = strUrl;
	frm.target = "";
	frm.method = "POST";
	frm.submit();
}
function setDirtyBit()
{
	document.getElementById("dirtyBit").value = "1";	
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
/*################# Add scm Workflow product Ends ####################*/