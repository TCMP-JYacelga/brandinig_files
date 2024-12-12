function showFileUploadDialog() {
	$('#paymentImageFile').trigger('click');
}

function updateFileName() {
	if ($("#paymentImageFile") && $("#paymentImageFile")[0]
			&& $("#paymentImageFile")[0].files) {
		var strUploadedImageName = $("#paymentImageFile")[0].files[0].name;
		$(".fileName_InfoSpan").text(strUploadedImageName);
		$(".fileName_InfoSpan").attr('title',strUploadedImageName);
		$('#paymentImageFileRemoveLink').removeClass('hidden');
		$('#paymentImageFileLink').addClass('hidden');
	}
}

function removeUploadedImage() {
	var control = $("#paymentImageFile");
	control.replaceWith(control = control.clone(true));
	$('#paymentImageFileRemoveLink').addClass('hidden');
	$('#paymentImageFileLink').removeClass('hidden');
	$(".fileName_InfoSpan").text(getLabel('noFileUploaded', 'No File Uploaded'));
	if (!isEmpty(strPaymentInstrumentIde))
		deleteAttachedDocumentFile(strPaymentInstrumentIde);
}

function uploadAttachedDocumentFile(identifier){
	var data = new FormData();
	var isUploadSuccess = false;
	data.append("file",$("#paymentImageFile")[0].files[0]);
	data.append("identifier",identifier);
	data.append("fileName",$("#paymentImageFile")[0].files[0].name);
	$.ajax({
		url : 'services/docverification/upload.srvc?'+csrfTokenName+'='+ tokenValue,
		type : 'POST',
		data : data, 
		processData: false,
		contentType : false,
		async : false,
		success : function(data) {
			if(data && data.d.success){
				if(data.d.success === "SUCCESS"){
					if(data.d.uploadedFileName){
						$("#uploadedFileLink").empty().append(data.d.uploadedFileName);
						$("#uploadedFileLink").attr("title",data.d.uploadedFileName);
						$("#uploadedFileDiv").removeClass("hidden");
						isUploadSuccess = true;
					}
				} else if(data.d.success === "FAILED"){
					isUploadSuccess = false;
					if(data.d.message && data.d.message.errors){
						paintErrors(data.d.message.errors);
					}
				}
			}
		}
	});
	return isUploadSuccess;
}

function downloadAttachedDocumentFile(){
	var data = new FormData();
	if (!isEmpty(strPaymentInstrumentIde)){
		var form = document.createElement('FORM');
		var strUrl = "services/docverification/download.srvc";
		form.name = 'frmMain';
		form.id = 'frmMain';
		form.method = 'POST';
		form.appendChild(createFormField('INPUT', 'HIDDEN',
				csrfTokenName, tokenValue));
		form.appendChild(createFormField('INPUT', 'HIDDEN',
				'identifier', strPaymentInstrumentIde));
		form.action = strUrl;
		document.body.appendChild(form);
		form.submit();
		document.body.removeChild(form);
	}
}

function deleteAttachedDocumentFile(identifier){
	var data = {"identifier": identifier};
	$.ajax({
		url : "services/docverification/delete.srvc?"+csrfTokenName+"="+ tokenValue,
		type : 'POST',
		data : JSON.stringify(data),
		contentType: "application/json; charset=utf-8",
		success : function(data) {
			if(data && data.d.success){
				if(data.d.success === "SUCCESS"){
					// TO-DO
				}
			}
		},
		error : function(){
			
		}
	});
}

function hideShowDownloadedFileDivForViewVerify(paymentMetaData){
	if(paymentMetaData._docUploadEnabled === 'Y'){
		$("#uploadedFileDiv").removeClass('hidden');
		if(paymentMetaData._docFileName){
			var docName = paymentMetaData._docFileName;
			$("#uploadedFileLink").empty().append(docName);
			$("#uploadedFileLink").attr("title",docName);
		}else{
			$("#uploadedFileLink").empty();
			$("#uploadedFileDiv").addClass('hidden');
		}
	}
}

function hideShowUploadFileDivForEdit(paymentMetaData){
	if(paymentMetaData._docUploadEnabled === 'Y'){
		$("#uploadFileDiv").removeClass('hidden');
		if(paymentMetaData._docFileName){
			var strUploadedImageName = paymentMetaData._docFileName;
			$(".fileName_InfoSpan").text(strUploadedImageName);
			$(".fileName_InfoSpan").attr('title',strUploadedImageName);
			$('#paymentImageFileRemoveLink').removeClass('hidden');
			$('#paymentImageFileLink').addClass('hidden');
		}
	}else if(paymentMetaData._docUploadEnabled === 'N')
		$("#uploadFileDiv").addClass('hidden');
}