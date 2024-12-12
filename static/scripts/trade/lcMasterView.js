function showLCDetails(frmId)
{
	var frm = document.getElementById(frmId);
	frm.action = "viewImportLc.form";
	frm.target = "";
	frm.method = "POST";
	frm.submit();	
}
function goToBack(frmId)
{
	var frm = document.getElementById(frmId);
	frm.action = "importLcCenter.form";
	frm.target = "";
	frm.method = "POST";
	frm.submit();	
}
function showAmendDetails(frmId, rowIndex)
{
	var frm = document.getElementById(frmId);
	document.getElementById("txtAmendIndex").value = rowIndex;
	frm.action = "viewImpLcAmendMstDetails.form";
	frm.target = "";
	frm.method = "POST";
	frm.submit();		
}
function showDetails1(frmId, rowIndex)
{
	var frm = document.getElementById(frmId);
	document.getElementById("txtIndex").value = rowIndex;
	frm.action = "viewImpLcAmendmentFromUpdatesList.form";
	frm.target = "";
	frm.method = "POST";
	frm.submit();	
}
function showDetails2(frmId, rowIndex)
{
	var frm = document.getElementById(frmId);
	document.getElementById("txtIndex").value = rowIndex;
	frm.action = "viewImpLcCancellationFromUpdatesList.form";
	frm.target = "";
	frm.method = "POST";
	frm.submit();	
}

function showLCBillDetails(frmId, rowIndex)
{
	var frm = document.getElementById(frmId);
	document.getElementById("txtIndex").value = rowIndex;
	frm.action = "viewImportLcBillFromUpdatesList.form";
	frm.target = "";
	frm.method = "POST";
	frm.submit();	
}
function viewLCBillDetails(frmId, rowIndex)
{
	var frm = document.getElementById(frmId);
	document.getElementById("txtIndex").value = rowIndex;
	document.getElementById("txtBillsDetailsFlag").value = true;
	frm.action = "viewImportLcBillFromDetails.form";
	frm.target = "";
	frm.method = "POST";
	frm.submit();	
}
function goBackToBillView(frmId)
{
	var frm = document.getElementById(frmId);
	frm.action = "backToViewImportBillFromLc.form";
	frm.target = "";
	frm.method = "POST";
	frm.submit();	
}
function goBackToLoanView(frmId)
{
	var frm = document.getElementById(frmId);
	frm.action = "backToViewImportBillLoanFromLc.form";
	frm.target = "";
	frm.method = "POST";
	frm.submit();	
}
function underDevelopement()
{
	alert("Under Development.");
	return;
}
function getSwiftMessagePopUp() 
{
	$('#swiftPopup').dialog({
		autoOpen : false,
		height : 530,
		width : 670,
		modal : true,
		position : [ 'center', 'middle' ],
		buttons : {
			"OK" : function() {
				$(this).dialog("close");
			}
		}		
	});
	$('#swiftPopup').dialog("open");
}
function getNewLCPopUp() 
{
	$('#newLCPopup').dialog( {
		autoOpen : false,
		resizable : false,
		width : 350,
		height : 280,
		modal : true,
		position : [ 'center', 'middle' ],
		buttons : {
			"Cancel" : function() {
				$(this).dialog("close");
			}
		}
	});
	$('#newLCPopup').dialog("open");
}
function showAddSBLCGTYForm(frmId, rowIndex)
{
	var frm = document.getElementById(frmId);
	document.getElementById("txtRecordIndex").value = rowIndex;
	frm.action = "newImportGuarantee.form";
	frm.target = "";
	frm.method = "POST";
	frm.submit();
}
function attachLCDoc(strUrl)
{
  var frm = document.forms["frmMain"];
  frm.action = strUrl;
  frm.target = "";
  frm.method = "POST";
  frm.submit();
}

function showLcDetail(strUrl, rowIndex)
{
	var frm = document.forms["frmMain"];
	document.getElementById("txtRecordIndex").value = rowIndex;
	frm.action = "viewImportLcMasterDetails.form";
	frm.target = "";
	frm.method = "POST";
	frm.submit();
}