function viewAcceptance(strUrl, frmId, viewState)
{
	var frm = document.getElementById(frmId);
	frm.appendChild(createFormField('INPUT', 'HIDDEN', 'accpViewState',	viewState));
	frm.appendChild(createFormField('INPUT', 'HIDDEN', 'poEnteredByClient',	enteredByClient));
	frm.appendChild(createFormField('INPUT', 'HIDDEN', 'counterPartyName',	counterpartyName));
	frm.action = strUrl;
	frm.target = "";
	frm.method = "POST";
	frm.submit();

}
function showActions(ctrl, divId) 
{
	if (!ctrl || isEmpty(divId)) return;
	$("#" + divId).show();
	$(ctrl).hide();
	return false;
}
function hideActions(ctrl, divId,moreLink) 
{
  var v=document.getElementById("moreLink");
    if (!ctrl || isEmpty(divId)) return;
	$("#" + divId).hide();
	$("#" + moreLink).show();
	return false;
}

function getPOViewRejectPopup() {
	$('#rejectPopup').dialog( {
		autoOpen : false,
		height : 200,
		width : 420,
		modal : true,
		buttons : {
				"Cancel" : function() {
				$(this).dialog("close");
				},
				"Go" : function() {
					rejectInvoices("rejectViewedPO.form", "frmMain");
				}
		}
	});
	$('#rejectPopup').dialog("open");
}

function paintPOViewActionButtons(mode){
	
	$('#poViewActionButtonListLB','#poViewActionButtonListRB').empty();
		
		var leftButtons = '#poViewActionButtonListLB';
		var rightButtons = '#poViewActionButtonListRB';
		if(isEmpty(backUrl)){
			backUrl = 'purchaseOrderCenter.form';
		}
		//back button
		btnClose = createButton('btnClose', 'S');
		btnClose.click(function() {
			var v=$('#finViewState').val();
            $('#txtFinIntRefNum').val("1");
            if(v != null && ""!= v)
            {
            $('#txtFinIntRefNum').val("2");
             $('#viewState').val(v);
            }

            $('#txtPOIntRefNum').val("1");
            goToPage(backUrl,'frmMain');
		});
		
		//Approve button
		btnApprove = createButton('btnApprove', 'P');
		btnApprove.click(function() {
			var arrayJson = new Array();
			arrayJson.push({
				serialNo : 1,
				identifier : identifier,
				userMessage : ''
			});
			
			$.ajax({
				url : "services/purchaseOrder/authourize",
				type : 'POST',
				contentType : "application/json",
				data : JSON.stringify(arrayJson),
				success :function(data){
					var result = data[0];
					var isSuccess = data[0].success;
					var msg="";
					if(isSuccess == 'N')
					{
							Ext.each(result.errors, function(error) {
								msg = msg + error.code + ' : ' + error.errorMessage;
								errCode = error.code;
								});
							var arrActionMsg = [];
							 arrActionMsg.push({
								success : result.success,
								actualSerailNo : result.serialNo,
								actionTaken : 'Y',
								reference : poReferenceNumber,
								actionMessage : msg
							});
							 getRecentActionResult(arrActionMsg);
					}else{
						goToPage('purchaseOrderCenter.form','frmMain');
					}
					
				},
				error : function(data){
					
				}
			});
		});
		
		//Reject button
		btnReject = createButton('btnReject', 'P');
		btnReject.click(function() {
			getPOViewRejectPopup();
		});
		if(null != mode && mode === "AUTH"){
			btnApprove.appendTo($(rightButtons));
			btnReject.appendTo($(rightButtons));
		}
		btnClose.appendTo($(leftButtons));
		
}

function createButton(btnKey, charIsPrimary) {
	 var strCls = charIsPrimary === 'P'
			? 'ft-button canDisable ft-button-primary ft-margin-l'
			: (charIsPrimary === 'L' ? 'ft-btn-link canDisable ' : 'ft-button canDisable ft-button-light');
			
	var elt = null;
	elt = $('<input>').attr({
				'type' : 'button',
				'tabindex':1,
				'class' : strCls,
				'id' : 'button_' + btnKey,
				'value' : mapLbls[btnKey]
			});
	return elt;
}

function getPOViewRejectPopup()
{
	$('#rejectPopup').dialog( {
		autoOpen : false,
		bgiframe : true,
		width : 380,
		modal : true,
		resizable : false,
		buttons : {
				"OK" : function() {
					var userMessage = $('#txtAreaRejectRemark').val();
					var arrayJson = new Array();
					arrayJson.push({
						serialNo : 1,
						identifier : identifier,
						userMessage : userMessage
					});
					$.ajax({
						url : "services/purchaseOrder/reject",
						type : 'POST',
						contentType : "application/json",
						data : JSON.stringify(arrayJson),
						success : function(data){
							var result = data[0];
							var isSuccess = data[0].success;
							var msg="";
							if(isSuccess == 'N')
							{
									Ext.each(result.errors, function(error) {
										msg = msg + error.code + ' : ' + error.errorMessage;
										errCode = error.code;
										});
									var arrActionMsg = [];
									 arrActionMsg.push({
										success : result.success,
										actualSerailNo : result.serialNo,
										actionTaken : 'Y',
										reference : poReferenceNumber,
										actionMessage : msg
									});
									 getRecentActionResult(arrActionMsg);
							}else{
								goToPage('purchaseOrderCenter.form','frmMain');
							}
						},
						error : function(data){
						}
					});
				},
				"Cancel" : function() {
					$(this).dialog("close");
					}
		}
	});
	$('#rejectPopup').dialog("open");
}
function getRecentActionResult(record){
	if ($('#actionResultInfoDiv').children('.row').length > 0) {
		$('#actionResultInfoDiv').children('.row').remove();
	}
	var intSrNo = 0;
	for(var i=0;i<record.length;i++){
		intSrNo = record[i].actualSerailNo;
		$('#actionResultDiv').removeClass('ui-helper-hidden');
		//add a row
		var rowDiv=document.createElement('div');
		$(rowDiv).addClass('row form-control-static');
		var delimitor='&nbsp;'
		if(record[i].success==='N'){
				delimitor='<br/>';
		}
		var fontColor=getRecentActionResultFontColor(record[i]);
		$(rowDiv).append($('<p>',{
			'class':'col-sm-10 '+fontColor,
			'id':'actionMsg'+intSrNo,
			'style' : 'margin-left : 5px',
			'html':mapLbls['poFinanceRefNo']+' : '+record[i].reference+delimitor+record[i].actionMessage
		}));
		//add row to main div
		$(rowDiv).appendTo('#actionResultInfoDiv');
	}
}
function getRecentActionResultFontColor(record){
	if(record.success==='Y'){
		return 'success_font';
	}
	else if (record.success === 'N')
		return 'error_font ';
}

function createFormField (element, type, name, value) {
		var inputField;
		inputField = document.createElement(element);
		inputField.type = type;
		inputField.name = name;
		inputField.value = value;
		return inputField;
	}