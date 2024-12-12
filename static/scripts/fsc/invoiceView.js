function viewAcceptance(strUrl, frmId, intAccRefNo, client)
{
	document.getElementById("txtInvAccIntRefNum").value = intAccRefNo;
	document.getElementById("txtPOCenterClientCode").value = client;
	var frm = document.getElementById(frmId);
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

function paintInvoiceViewActionButtons(mode)
{
	$('#poViewActionButtonListLB','#poViewActionButtonListRB').empty();
	
	var leftButtons = '#poViewActionButtonListLB';
	var rightButtons = '#poViewActionButtonListRB';
	if(isEmpty(backUrl)){
		backUrl = 'invoiceCenter.form';
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
			userMessage : '',
			selectedClient : selectedClient
		});
		
		$.ajax({
			url : "services/invoiceCenter/authourize",
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
		                     reference : poFinanceReferenceNo,
		                     actionMessage : msg
		              });
		              getRecentActionResult(arrActionMsg);
                }else{
                       goToPage('invoiceCenter.form','frmMain');
                }
			},
			error : function(data){
				
			}
		});
	});
	
	//Reject button
	btnReject = createButton('btnReject', 'P');
	btnReject.click(function() {
		getInvoiceViewRejectPopup();
	});
	
	//send button
	btnSend = createButton('btnSend','P');
	btnSend.click(function(){
		var arrayJson = new Array();
		arrayJson.push({
			serialNo : 1,
			identifier : identifier,
			userMessage : '',
			selectedClient : selectedClient
		});
		$.ajax({
			url : "services/invoiceCenter/send",
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
		                     reference : poFinanceReferenceNo,
		                     actionMessage : msg
		              });
		              getRecentActionResult(arrActionMsg);
                }else{
                       goToPage('invoiceCenter.form','frmMain');
                }
			},
			error : function(data){
			}
		});
	});
	
	//left buttons
	btnClose.appendTo($(leftButtons)); 
	//right buttons
	btnApprove.appendTo($(rightButtons)); 
	btnReject.appendTo($(rightButtons)); 
	btnSend.appendTo($(rightButtons)); 
	
	$(btnApprove).addClass('hidden');
	$(btnReject).addClass('hidden');
	$(btnSend).addClass('hidden');
	if(mode === "AUTH" || mode === "SEND" || mode === "VIEW"){
		$(btnApprove).removeClass('hidden');
		$(btnReject).removeClass('hidden');
		$(btnSend).removeClass('hidden');
		if(mode === "AUTH"){
			$(btnSend).addClass('hidden');
			if (forMyAuth === "false"){
				$(btnApprove).addClass('hidden');
				$(btnReject).addClass('hidden');
			}
		}
		if(mode === "SEND"){
			$(btnApprove).addClass('hidden');
			$(btnReject).addClass('hidden');
		}else if (mode === "VIEW"){
			$(btnApprove).addClass('hidden');
			$(btnReject).addClass('hidden');
			$(btnSend).addClass('hidden');
		}
	}
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

function getInvoiceViewRejectPopup()
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
						userMessage : userMessage,
						selectedClient : selectedClient
					});
					$.ajax({
						url : "services/invoiceCenter/reject",
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
                                        reference : poFinanceReferenceNo,
                                        actionMessage : msg
                                 });
                                 getRecentActionResult(arrActionMsg);
	                         }else{
	                        	 goToPage('invoiceCenter.form','frmMain');
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

function loadPOHeaderFields(strMyProduct, anchorClient) {
	// blockpoFinanceUI(true);
	if (!isEmpty(strMyProduct)) {
		var url = 'services/poTxnHeaderInfo' + "/" + strMyProduct;
		$.ajax({
			type : "POST",
			url : url,
			data : {
				$productRelClient : anchorClient,
				$enteredClient : enteredClient,
				$counterParty : counterparty
			},
			async : false,
			complete : function(XMLHttpRequest, textStatus) {
				if ("error" == textStatus) {
					var arrError = new Array();
					arrError.push({
								"errorCode" : "Message",
								"errorMessage" : mapLbl['unknownErr']
							});
					paintErrors(arrError);
					blockpoFinanceUI(false);
				}
			},
			success : function(data) {
				if (data != null) {
					if (data.d
							&& data.d.message
							&& (data.d.message.errors || data.d.message.success === 'FAILED')) {
						doHandleEmptyScreenErrorForpoFinanceHeader(data.d.message.errors);
						blockpoFinanceUI(false);
					} else {
						poResponseHeaderData = data;
					}
				}
			}
		});
	} else {
		/*doHandleUnknownErrorForBatch();
		blockpoFinanceUI(false);*/
	}
}

function downloadViewAttachment(){
	var strUrl="services/invoiceheader" + "/("+ invId+")/download";
	var frm = document.getElementById("frmMain");
	frm.action = strUrl;
	frm.target = "hWinSeek";
	frm.method = "POST";
	frm.submit();
	frm.target = "";
}