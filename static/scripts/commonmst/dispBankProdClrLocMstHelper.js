function removeDisabled() {
	$("#dispBankDesc").removeAttr("disabled");
	$("#dbpclProductDesc").removeAttr("disabled");
	$("#clrLocDesc").removeAttr("disabled");
	$("#locationUtilizedAmt").removeAttr("disabled");
}

function goToPage(strUrl, frmId) {
	if(strUrl === 'updateDispBankProdClrLocMst.form'
		|| strUrl === 'verifyDispBankProdClrLocMst.form'){
		validateMandatoryFields();
	}
	if(dityBitSet)
		document.getElementById("dirtyBitSet").value = true;
	var frm = document.getElementById(frmId);
	frm.action = strUrl;
	frm.target = "";
	frm.method = "POST";
	frm.submit();
}

/*function togglePrintRadio(radioVal){
	if(radioVal === 'Y') {
		$('#printYes').prop('checked',true);
	} else if(radioVal == 'N') {
		$('#printNo').prop('checked',true);
	}
}*/

function validateMandatoryFields(){
	if(isEmpty($("#dispBankDesc").val()))
		$("#dispBankCode").val('');
	
	if(isEmpty($("#dbpclProductDesc").val()))
		$("#productCode").val('');
	
	if(isEmpty($("#clrLocDesc").val()))
		$("#clrLocCode").val('');
	
	if(isEmpty($("#ctrlBranchDesc").val()))
		$("#ctrlBranchCode").val('');
	
	if(isEmpty($("#destBranchDesc").val()))
		$("#destBranchCode").val('');
	
	if(isEmpty($("#payBranchDesc").val()))
		$("#payBranchCode").val('');
	
	if(isEmpty($("#liqBranchDesc").val()))
		$("#liqBranchCode").val('');
}
