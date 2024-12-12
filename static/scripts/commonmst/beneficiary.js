function enableDisablePackage(objPaypkg)
{
	if(objPaypkg=='D')
	{
		$('#defaultPayment').attr('checked',true);
		makeNiceSelect('myProduct', false);
	}
	else if(objPaypkg=='F')
	{
		$('#fixedPayment').attr('checked',true);
		makeNiceSelect('myProduct', true);
	}
}

function enableDisablePeriod(objPeriod)
{
    if(objPeriod=='D')
    {
        $('#periodTypeD').attr('checked',true);
    }
    else if(objPeriod=='M')
    {
        $('#periodTypeM').attr('checked',true);
    }
}
function enableDisableReceiver(objReceiver)
{
    if(objReceiver=='E')
    {
        $('#receiverTypeE').attr('checked',true);
		
		if(modelDefaultAccountFlag == 'Y')
			$('#chkDefaultAccountFlag').attr('checked',true).attr('disabled',true);
		else
			$('#chkDefaultAccountFlag').removeAttr('checked').removeAttr('disabled');
			
					
        
        $('#receiverCodeMD1').show();
        $('#receiverCode').attr('name', 'receiverCode'); 
        $('#receiverCodeMD2').hide();
        $('#receiverCode2').attr('name', 'receiverCodeOld');
        
    }
    else if(objReceiver=='N'|| objReceiver=="")
    {
        $('#receiverTypeN').attr('checked',true);
        if(vMode=='EDIT' && modelDefaultAccountFlag == 'N')
			$('#chkDefaultAccountFlag').removeAttr('checked').removeAttr('disabled');
        else
			$('#chkDefaultAccountFlag').attr('checked',true).attr('disabled',true);
        $('#receiverCodeMD1').hide();
        $('#receiverCodeMD1').hide();
        $('#receiverCode').attr('name', 'receiverCodeOld'); 
        $('#receiverCodeMD2').show();
        $('#receiverCode2').attr('name', 'receiverCode'); 
      
		$("#limitLevelR").prop("disabled", false);
		$("#limitLevelA").prop("disabled", false);
		$("#limitLevelN").prop("disabled", false);
		$("#limitLevelA").prop("disabled", false);
		$("#periodTypeM").prop("disabled", false);
		$("#periodTypeD").prop("disabled", false);
		$('#totalTxnAmtAllowed').prop("disabled", false);
		$('#maxNoTxnAllowed').prop("disabled", false);
    }
}
function resetLimitLevel(){
	$("#limitLevelN").attr('checked',true);
	$('#totalTxnAmtAllowed').val("");
	$('#maxNoTxnAllowed').val("");
	$("#txnLimit").hide();
}
function enableDisableDocumentID(documentType)
{		
	var strDocumentType = documentType ;
	if(''==strDocumentType)
	{
		$('#divDocumentId').hide();
		$('#docTypePath').val('');
		$('#documentId').val('');
	}
	else
	{
		$('#divDocumentId').show();
		$('#docTypePath').val($('#docTypeId').val());
	}
}		
function changeLabel(lab1,lab2)
{
	$('#'+lab1).show();
	$('#'+lab2).hide();
}

function setCheckUnchek(flag, field)
{
	if(flag=='Y')
	{
		$('#'+field).attr('src','static/images/T7/checked.png');
	}
	else
	{
		$('#'+field).attr('src','static/images/T7/checkbox.png');		
	}	
}
function toggleCheckBoxValue(id) {
	var isChecked = $('#' + id).attr('checked') ? true : false;
	if (isChecked)
		$('#' + id).val('Y');
	else
		$('#' + id).val('N');
}

function showMismatchMsgPopup(receiverName) {
    vReceiverName = receiverName;
    $('#mismatchMsgPopup').dialog({
                autoOpen : false,
                maxHeight: 550,
                minHeight:'auto',
                width : 400,
                modal : true,
                resizable: false,
                draggable: false,
                close: function() {
                	mismatchMsgPopupClose();
                }
            });
    $('#noMismatchMsgbutton').bind('click',function(){
    	strMisMatchAction="N";
        $('#mismatchMsgPopup').dialog("close");
    });
    $('#yesMismatchMsgbutton').bind('click',function(){
        $('#drawerDesc').val(vReceiverName);
        strMisMatchAction="Y";
        $('#mismatchMsgPopup').dialog("close");
    });
    $('#mismatchMsgPopup').dialog("open");
    $('#receivedReceiverName').text(receiverName);
}
function mismatchMsgPopupClose()
{
	if(strMisMatchAction=="N")
	{
		$('#drawerDesc').val('');
	    $('#beneBranchDesc').val('');
	    $('#drawerDesc').focus();
	}
}

function updateValidations(productId) {
	if(productId)
		selectedProductId = productId;
	else if($('#paymentType').val())
		selectedProductId = $('#paymentType').val();
	else if (pay)
		selectedProductId=pay;
	else
		selectedProductId = "";
//	$("#drawerDesc").unbind('.ValidateTextKeydown .ValidateTextBlur .ValidateTextInput .ValidateTextPropertychange');
	if(selectedProductId == "30"){
		$("label[for='bankIdType']").removeClass("required");
	}
	else{
		if(selectedProductId=="01" || selectedProductId=="02" || selectedProductId=="07" || selectedProductId=="30")
			$("label[for='bankIdType']").removeClass("required");
		else
		$("label[for='bankIdType']").addClass("required");
	}
//	setPatternValidator();
}
function setDesc(objPayType)
{
	if($(objPayType).val()!='')
	{
		$('#paymentTypeDesc').val($(objPayType).find(":selected").text());
	}	
}
function enableDisableforAuthorized(validFlag){
    if(validFlag=='Y'){
        $('#periodTypeD').attr('disabled','disabled');
        $('#periodTypeM').attr('disabled','disabled');
    }
}
function enableDisableAccountNo(isPaymentTypeChanged)
{
	var paymentType=$('#paymentType').val();
	if(paymentType=="")
	{
		paymentType=pay;
	}
	if(paymentType=='01' || paymentType=='02' ||paymentType=='07' || paymentType=='30' )
	{
		$('#beneAcctNmbr').attr('disabled','disabled');
		$('#beneAcctNmbr').val("");
		$('#lblAccLabel').removeClass('required');
		$('#bankIdType').attr('disabled','disabled');
		//$('#bankIdType').show();
		$('#bankIdType').val("");
		$("#bankIdType").niceSelect("update");
		$('#bankIdSpanText').text("");
	    $('#bankIdTypeLbl').removeClass('required');
        $('#bankSearchText').attr('disabled','disabled');
        $('#bankSearchTextLbl').removeClass('required');
        $('#beneBranchDesc').attr('disabled','disabled');
        $('#receiverBranchName').removeClass('required');
        $('#beneAccountType').prop('disabled', true);
        $('#beneAccountType').closest('.form-group').find('.frmLabel').removeClass('required');
        $('#beneAccountType').val("");
        $('#beneAccountCcy').val('').prop('disabled', true);
        $('#beneAccountCcy').val("");
	}else if(paymentType=='93' || paymentType=='94')
    {
        $('#lblAccLabel').text("IBAN");
		$('#bankIdType').val("BIC");
		$("#bankIdType").niceSelect("update");
        if(!isEmpty($('#myProduct').val()) ){
       	    $('#beneAcctNmbr').removeAttr('disabled');
       	    if(!isEmpty($('#clientIbanFlag').val()) && $('#clientIbanFlag').val() == 'Y'){
                $('#beneAcctNmbr').removeAttr('disabled');
                $('#bankSearchText').attr('disabled','disabled');
                $('#beneBranchDesc').attr('disabled','disabled');
            }else{
            	$('#bankSearchText').removeAttr('disabled');
                $('#beneBranchDesc').removeAttr('disabled');
                if(isPaymentTypeChanged){
                	$('#bankSearchText').val('');
                    $('#beneBranchDesc').val('');
                }
            }
        }else{
            $('#beneAcctNmbr').attr('disabled','disabled');
            $('#beneAcctNmbr').val("");
        }
    }
	else
	{
		$('#beneAcctNmbr').removeAttr('disabled');
		$('#lblAccLabel').text("Account");
		$('#lblAccLabel').addClass('required');
		$('#bankIdType').removeAttr('disabled');
        $('#bankIdTypeLbl').addClass('required');
        $('#bankSearchText').removeAttr('disabled');
        $('#bankSearchTextLbl').addClass('required');
        $('#beneBranchDesc').removeAttr('disabled');
        $('#receiverBranchName').addClass('required');
        $('#beneAccountType').prop('disabled', false);
        $('#beneAccountType').closest('.form-group').find('.frmLabel').addClass('required');
        $('#beneAccountCcy').prop('disabled', false);
	}
	if (checkAnyIdApplicable($("#anyIdFlag").val(),paymentType))
    {
		$('#beneBranchDesc').attr('disabled','disabled');
    }
	
}

function populateDrawerCode()
{
	if($('#receiverCode2').val() != '' ||  $('#receiverCode').val() != '')
	{
	 	$('#drawerCode').val(receiver_short_code);
	}
}
function clearRecShortCode()
{
	$('#drawerCode').val('');
	$('#receiverCode2').val('');
	$('#receiverCode').val('');
}

function validatefields(){
	var arrError = new Array();	
    validatePopupFields(arrError);   
    return validateAndPaintErrors(arrError);        
} 

function validatePopupFields(arrError){	  
		
	var amtValue = $("#tempTxnAmt").val();
	if (amtValue) 
	{
	amtValue = amtValue.replaceAll(',','');
	}
	
	var totAmtValue = $("#totalTxnAmtAllowed").val();
	if (totAmtValue) 
	{
	totAmtValue = totAmtValue.replaceAll(',','');
	}
	
	/*
    if(totAmtValue < parseInt(amtValue,10)){
    	arrError.push({
			"errorCode" : "Total transaction amount allowed should be equal to or greater than existing Total transaction amount allowed.",
			"errorMessage" : "Total transaction amount allowed should be equal to or greater than existing Total transaction amount allowed."
		});
    	//$("#totalTxnAmtAllowed").val($("#tempTxnAmt").val());
    }
	*/
    return arrError;
}

function validateAndPaintErrors(arrError){	
	
	var element = null, strMsg = null, strTargetDivId = 'messageArea', strErrorCode = '';
	if (arrError && arrError.length > 0) {
		$('#' + strTargetDivId).empty();
		$.each(arrError, function(index, error) {
					strErrorCode = error.errorCode || error.code;
					strMsg = !isEmpty(strErrorCode) ? strErrorCode : '';
					if (!isEmpty(strMsg))
						strMsg += ' : ';
					strMsg += error.errorMessage;
					if (!isEmpty(strErrorCode)) {
						$('#errorDiv').empty();
						element = $('<p>').text(error.errorMessage);
						element.appendTo($('#' + strTargetDivId));
						$('#' + strTargetDivId + ', #messageContentDiv')
								.removeClass('hidden');
					}
				});

	} else {
		$('#messageArea').empty();
		$('#' + strTargetDivId + ', #messageContentDiv').addClass('hidden');
	}

	if(arrError.length > 0)
		return true;
	else
		return false;
}

function setCurrency(sellerCcy){
	if($("#paymentType").val() == '62'){
		//var sellerCcy = '${SESVAR_SELLER_CURR}';
		$("#beneAccountCcy").val(sellerCcy);
		$('#beneAccountCcy').attr("disabled", true);
		$('#beneAccountCcy-niceSelect').attr("disabled", true);
	}
	else if($("#paymentType").val()=='01' || $("#paymentType").val()=='02' || $("#paymentType").val()=='07' || $("#paymentType").val()=='30')
	{
		$('#beneAccountCcy').attr("disabled", true);
		$('#beneAccountCcy-niceSelect').attr("disabled", true);
	}
	else
	{
		if(beneValidationOnSave === 'N' && !isEmpty($('#beneAccountCcy').val()) && $('#paymentType').val() === '04' && readonlyFields)
		{	
		    $('#beneAccountCcy').attr("disabled", true);
			$('#beneAccountCcy-niceSelect').attr("disabled", true);
		}
		else
		{
			 $('#beneAccountCcy').attr("disabled", false);
			 $('#beneAccountCcy-niceSelect').attr("disabled", false);
		}
	}
	$('#beneAccountCcy').niceSelect('update');
}
function setDirtyBit()
{
	dityBitSet=true;
}

function onchange1(obj)
{
	var j = obj.value;
	var k= $("#beneBranchCode1  option:selected").text();
	$("#beneBankCode1").val(k);
	$("#beneBranchCodeMemFi").val(j);
}

function showList(mode)
{
	var frm = document.forms["frmMain"];
	if ("B" == strMstType)
	{
		if ("AUTH" == mode)
			frm.action = "beneficiaryAuthList.form";
		else
			frm.action = "beneficiaryList.form";
	}
	else if ("D" == strMstType)
	{
		if ("AUTH" == mode)
			frm.action = "drawerAuthList.form";
		else
			frm.action = "drawerList.form";
	}
	frm.method = "POST";
	frm.submit();		
}
function getPrdouct(strUrl)
{
	var strData = {};
	
	strData["myProduct"] = $('#myProduct').val();
    strData[csrfTokenName] = csrfTokenValue; 
	  ($.unblockUI);
	  $.ajax({
	          type: 'POST', 
	          data:strData,
	          url: strUrl, 
	      async:false,
	          success: function(data)
	          {       
	        	      
	        	       if (data['PRODUCT_CODES']!=null) 
                       { 
	        	    	   var allProducts = data['PRODUCT_CODES'];
                               $('#beneDefaultPrd').html('');
               
                               $('#beneDefaultPrd').append($("<option></option>").attr("value"," ").text("--Select--"));
                               $.each(allProducts, function(i){
                            	  
                            	    $('#beneDefaultPrd').append($("<option></option>")
                            	                    .attr("value",allProducts[i].productCode)
                            	                    .text(allProducts[i].productDesc));
                            	});
                       
                       }        
                   }
               });
           strData = "";       


	 
	//$.post(strUrl, strData, "json");
}
function showAddNewForm()
{
	var frm = document.forms["frmMain"];
	document.getElementById("drawerCode").value="";
	document.getElementById("drawerDesc").value="";
	if ("B" == strMstType)
	{
		frm.action = "addBeneficiary.form";
	}
	else if ("D" == strMstType)
	{
		frm.action = "addDrawer.form";
	}	
	frm.method = "POST";
	frm.submit();
}

function showHistoryForm(strAction, index)
{
	var intTop  = (screen.availHeight - 300)/2;
	var intLeft = (screen.availWidth - 400)/2;
	var strAttr = "dependent=yes,scrollbars=yes,";
	strAttr = strAttr + "left=" + intLeft + ",";
	strAttr = strAttr + "top=" + intTop + ",";
	strAttr = strAttr + "width=400,height=300";

	var frm = document.forms["frmMain"];
	document.getElementById("txtIndex").value = index;
	if ("B" == strMstType)
	{
		if ("AUTH" == strAction)
			frm.action = "beneficiaryAuthHistory.hist";
		else
			frm.action = "beneficiaryHistory.hist";
	}
	else
	{
			frm.action = "drawerHistory.hist";
	}		
	frm.target = "hWinHistory";
	frm.method = "POST";

	window.open ("", "hWinHistory", strAttr);
	frm.submit();
}

function showViewForm(index,mode)
{
	var frm = document.forms["frmMain"]; 
	var strUrl = null;
	document.getElementById("txtIndex").value = index;
	frm.target ="";
	if ("B" == strMstType)
	{
		if(mode == "AUTH")
		strUrl = "authViewBeneficiary.form";
		else 
		strUrl = "viewBeneficiary.form";
	}
	else if ("D" == strMstType)
	{
		if(mode == "AUTH")
		strUrl = "authViewDrawer.form";
		else 
		strUrl = "viewDrawer.form";
	}	
	frm.action = strUrl;
	frm.method = "POST";
	frm.submit();	
}

function showEditForm(index)
{
	var strUrl ='';
	var frm = document.forms["frmMain"]; 
	document.getElementById("txtIndex").value = index;
	document.getElementById("txtCurrent").value = '';
	if ("B" == strMstType)
	{
		strUrl = "editBeneficiary.form";
	}
	else if ("D" == strMstType)
	{
		strUrl = "editDrawer.form";
	}	
	frm.action = strUrl;
	frm.method = "POST";
	frm.submit();
}

// Enable, Disable, Accept and Reject requests
function enableRecord(index)
{
	var frm = document.forms["frmMain"]; 
	document.getElementById("txtIndex").value = index;
	if ("B" == strMstType)
	{
		frm.action = "enableBeneficiary.form";
	}
	else if ("D" == strMstType)
	{
		frm.action = "enableDrawer.form";
	}
	frm.method = "POST";
	frm.submit();
}

function disableRecord(index)
{
	var frm = document.forms["frmMain"]; 
	document.getElementById("txtIndex").value = index;
	if ("B" == strMstType)
	{
		frm.action = "disableBeneficiary.form";
	}
	else if ("D" == strMstType)
	{
		frm.action = "disableDrawer.form";
	}
	frm.method = "POST";
	frm.submit();
}

function acceptRecord(index)
{
	var frm = document.forms["frmMain"]; 
	document.getElementById("txtIndex").value = index;
	if ("B" == strMstType)
	{
		frm.action = "acceptBeneficiary.form";
	}
	else if ("D" == strMstType)
	{
		frm.action = "acceptDrawer.form";
	}
	frm.method = 'POST';
	frm.submit();
}

function rejectRecord(arrData, strRemarks)
	{
		var frm = document.forms["frmMain"];		
		if (strRemarks.length > 255)
		{
			alert("Reject Remarks Length Cannot Be Greater than 255 Characters!");	
			return false;
		}
		else
		{
			frm.rejectRemarks.value = strRemarks;			
			frm.txtIndex.value = arrData[0];
			frm.target = "";
			if ("B" == strMstType)
			{
				frm.action = "rejectBeneficiary.form";
			}
			else if ("D" == strMstType)
			{
				frm.action = "rejectDrawer.form";
			}
			frm.method = 'POST';
			frm.submit();
		}
	}

// List navigation
function prevPage(strUrl, intPg)
{
	var frm = document.forms["frmMain"]; 
	document.getElementById("txtCurrent").value = intPg;
	frm.action = strUrl;
	frm.method = "POST";
	frm.submit();
}

function nextPage(strUrl, intPg)
{
	var frm = document.forms["frmMain"]; 
	document.getElementById("txtCurrent").value = intPg;
	frm.action = strUrl;
	frm.method = "POST";
	frm.submit();
}
// Details
function deleteDetail(strUrl, index)
{
	var frm = document.forms["frmMain"]; 
	document.getElementById("txtIndex").value = index;
	frm.action = strUrl;
	frm.method = "POST";
	frm.submit();
}

function viewDetailForm(strUrl, index)
{
	var frm = document.forms["frmMain"]; 
	document.getElementById("txtIndex").value = index;
	frm.action = strUrl;
	frm.method = "POST";
	frm.submit();
}

function editDetailForm(strUrl, index)
{
	var frm = document.forms["frmMain"]; 
	document.getElementById("txtIndex").value = index;
	frm.action = strUrl;
	frm.method = "POST";
	frm.submit();
}

function showAddDetail(strUrl)
{
	var frm = document.forms["frmMain"];	
	frm.action = strUrl;
	frm.target = "";	
	frm.method = "POST";
	frm.submit();
}
function showListEntry(strUrl)
{
	var frm = document.forms["frmMain"];
	if (document.getElementById("drawerCode")!=null)
	{
		document.getElementById("drawerCode").value = '';
	}
	document.getElementById("drawerDesc").value = '';
	if (document.getElementById("beneAcctNmbr"))
		document.getElementById("beneAcctNmbr").value = '';
	document.getElementById("txtCurrent").value = '';	
	frm.target='';
	
	if ("B" == strMstType)
	{
		frm.action = "beneficiaryList.form";
	}
	else if ("D" == strMstType)
	{
		frm.action = "drawerList.form";
	}
	frm.method = "POST";
	frm.submit();
}
function discardRecord(index)
{
	var frm = document.forms["frmMain"]; 
	document.getElementById("txtIndex").value = index;
	frm.target ="";
	if ("B" == strMstType)
	{
		frm.action = "undoBeneficiary.form";
	}
	else if ("D" == strMstType)
	{
		frm.action = "undoDrawer.form";
	}
	frm.method = "POST";
	frm.submit();
}
function discardRecord(arrData)
{
	var frm = document.forms["frmMain"];
	frm.txtIndex.value = arrData[1];
	frm.action = arrData[0];
	if ("B" == strMstType)
	{
		frm.action = "undoBeneficiary.form";
	}
	else if ("D" == strMstType)
	{
		frm.action = "undoDrawer.form";
	}
	
	frm.method = "POST";
	frm.target = "";	
	frm.submit();
}
function filter()
{
	var strUrl='';
	if ("B" == strMstType)
	{
		strUrl = "beneficiaryList.form"
	}
	else if ("D" == strMstType)
	{
		strUrl = "drawerList.form"
	}
	var frm = document.forms["frmMain"];
	frm.target ="";
	frm.action = strUrl;
	frm.method = "POST";
	frm.submit();
}

function filterAuth()
{
	var strUrl='';
	if ("B" == strMstType)
	{
		strUrl = "beneficiaryAuthList.form"
	}
	else if ("D" == strMstType)
	{
		strUrl = "drawerAuthList.form"
	}
	var frm = document.forms["frmMain"];
	frm.target ="";
	frm.action = strUrl;
	frm.method = "POST";
	frm.submit();
}

function populateUpdateState()
{
	var frm = document.forms["frmMain"];	
	frm.target ="";
	if ("B" == strMstType)
	{
		frm.action = "populateUpdateBeneficiary.form";
	}
	else if ("D" == strMstType)
	{
		frm.action = "populateUpdateDrawer.form";
	}
	frm.method = "POST";
	frm.submit();
}

function populateState()
{
	var frm = document.forms["frmMain"];	
	frm.target ="";
	if ("B" == strMstType)
	{
		frm.action = "populateBeneficiary.form";
	}
	else if ("D" == strMstType)
	{
		frm.action = "populateDrawer.form";
	}
	frm.method = "POST";
	frm.submit();
}
function nextDetPage(strUrl, intPg)
{
	var frm = document.forms["frmMain"];
	var strUrl = null; 
	document.getElementById("txtDetail").value = intPg;
 	frm.target ="";
	strUrl = "editBeneficiary.form"
	frm.action = strUrl;
	frm.method = "POST";
	frm.submit();
}
function prevDetPage(strUrl, intPg)
{
	var frm = document.forms["frmMain"]; 
	var strUrl = null;	
	document.getElementById("txtDetail").value = intPg;
 	frm.target ="";
	strUrl = "editBeneficiary.form"
	frm.action = strUrl;
	frm.method = "POST";
	frm.submit();
}
function saveDetail(strUrl)
{
	var frm = document.forms["frmMain"];
	frm.target ="";
	frm.action = strUrl;
	frm.method = "POST";
	frm.submit();
}

function updateDetail()
{
	var frm = document.forms["frmMain"]; 	
	frm.target ="";
	if ("B" == strMstType)
	{
		frm.action = "updateBeneficiary.form"
	}
	else if ("D" == strMstType)
	{
		frm.action = "updateDrawer.form"
	}
	frm.method = "POST";
	frm.submit();
}	

function saveHeader()
{
	var frm = document.forms["frmMain"];
	frm.target ="";
	if ("B" == strMstType)
	{
		frm.action = "saveBeneficiary.form"
	}
	else if ("D" == strMstType)
	{
		frm.action = "saveDrawer.form"
	}
	frm.method = "POST";
	frm.submit();
}

function doHide(radioval)
{
var registered = document.getElementById("registered");
var adhocbene = document.getElementById("adhocbene");
var adhoc = document.getElementById("adhoc");
   if (radioval.value=='R')
   {
   		registered.style.display = "none";
	    adhocbene.style.display = "block";
		adhoc.style.display = "block";
		document.getElementById("beneBankDesc").readOnly=true;
		document.getElementById("beneBranchDesc").readOnly=true;
		document.getElementById("beneBankBic").readOnly=true;
		beneRoutingFlag.style.display = "block";
		if (document.getElementById("lowValueClearing"))
			document.getElementById("lowValueClearing").value = "";
		if (document.getElementById("highValueClearing"))
		document.getElementById("highValueClearing").value = "";
   }
   else
   {
   		adhoc.style.display = "none";
		registered.style.display = "block";
   		adhocbene.style.display = "none";
		document.getElementById("beneBankDesc").readOnly=false;
		document.getElementById("beneBranchDesc").readOnly=false;
		beneRoutingFlag.style.display = "none";
		document.getElementById("beneBankBic").readOnly=false;		
		if (radioval.value=='A')
		{
			document.getElementById("beneBankDesc").innerHTML = '';
			document.getElementById("beneBranchDesc").innerHTML = '';
		}
   }
	if (document.getElementById("orderPartyCode"))
		document.getElementById("orderPartyCode").value = "";
	if (document.getElementById("beneBankDesc"))
		document.getElementById("beneBankDesc").value = "";
	if (document.getElementById("beneBranchDesc"))
		document.getElementById("beneBranchDesc").value = "";
	if (document.getElementById("beneAcctNmbr"))
		document.getElementById("beneAcctNmbr").value = "";
	/*if (document.getElementById("beneIban"))
		document.getElementById("beneIban").value = "";*/
	if (document.getElementById("beneBankBic"))
		document.getElementById("beneBankBic").value = "";
   document.getElementById("beneAccountCcy").value = document.getElementById("defaultccy").value;
   if (document.getElementById("beneBankAddress") != null || document.getElementById("beneBankAddress") != undefined)
   {
  		 document.getElementById("beneBankAddress").value = "";
  		 document.getElementById("beneBankCountry").value = "";
   }
   
}

function changeTabVal()
{
	document.getElementById("beneDisplayName").value = document.getElementById("drawerDesc").value;
}

function getdiv()
{
	var registered = document.getElementById("registered");
	var adhocbene = document.getElementById("adhocbene");
	var adhoc = document.getElementById("adhoc");
	var receivercorrbankseek = document.getElementById("receivercorrbankseek");
	var intermediarybankseek = document.getElementById("intermediarybankseek");
	if (document.getElementById("divType").value=='R')
	{
		registered.style.display = "none";
		adhocbene.style.display = "block";
		adhoc.style.display = "block";
		document.getElementById("beneBankDesc").readOnly=true;
		document.getElementById("beneBranchDesc").readOnly=true;
		document.getElementById("beneBankBic").readOnly=true;		
	}
	else
	{
		adhoc.style.display = "none";
		registered.style.display = "block";
		adhocbene.style.display = "none";
		document.getElementById("beneBankDesc").readOnly=false;
		document.getElementById("beneBranchDesc").readOnly=false;
		document.getElementById("beneBankBic").readOnly=false;	
	}
	if (document.getElementById("bankTypeCorr").value == 'R')
	{
		receivercorrbankseek.style.display = "block";
		document.getElementById("corrBankDetails1").readOnly=true;
		document.getElementById("corrBankDetails2").readOnly=true;
		document.getElementById("corrBankDetails3").readOnly=true;
		document.getElementById("corrBankDetails4").readOnly=true;
	}
	else
	{
		receivercorrbankseek.style.display = "none";
		document.getElementById("corrBankDetails1").readOnly=false;
		document.getElementById("corrBankDetails2").readOnly=false;
		document.getElementById("corrBankDetails3").readOnly=false;
		document.getElementById("corrBankDetails4").readOnly=false;
	}
	if (document.getElementById("bankTypeInter").value == 'R')
	{
		intermediarybankseek.style.display = "block";
		document.getElementById("intBankDetails1").readOnly=true;
		document.getElementById("intBankDetails2").readOnly=true;
		document.getElementById("intBankDetails3").readOnly=true;
		document.getElementById("intBankDetails4").readOnly=true;
	}
	else
	{
		intermediarybankseek.style.display = "none";
		document.getElementById("intBankDetails1").readOnly=false;
		document.getElementById("intBankDetails2").readOnly=false;
		document.getElementById("intBankDetails3").readOnly=false;
		document.getElementById("intBankDetails4").readOnly=false;
	}
}

function getBankBranchRecord(json,elementId)
{		  
	var myJSONObject = JSON.parse(json);
    var inputIdArray = elementId.split("|");
    for(i=0; i<inputIdArray.length - 1; i++)
	{
    	var field = inputIdArray[i];		
    	if(inputIdArray[i+1] != null && document.getElementById(inputIdArray[i+1]) && myJSONObject.columns[i])
    	{
			var type = document.getElementById(inputIdArray[i+1]).type;
			if(type=='text' || type=='select-one')
			{
				if (myJSONObject.columns[i].value != undefined)
					document.getElementById(inputIdArray[i+1]).value=myJSONObject.columns[i].value;
					
				if (myJSONObject.columns[i].value == undefined)
					document.getElementById(inputIdArray[i+1]).value='';
			}
			else if (type == 'hidden') {
					document.getElementById(inputIdArray[i+1]).value=myJSONObject.columns[i].value;}
			else {
				document.getElementById(inputIdArray[i+1]).innerHTML=myJSONObject.columns[i].value;} 
    	}
	}    
}


function hideCorrBankType(radioval)
{
	var receivercorrbankseek = document.getElementById("receivercorrbankseek");
	if (radioval.value=='R')
	{
		receivercorrbankseek.style.display = "block";
		document.getElementById("corrBankDetails1").readOnly=true;
		document.getElementById("corrBankDetails2").readOnly=true;
		document.getElementById("corrBankDetails3").readOnly=true;
		document.getElementById("corrBankDetails4").readOnly=true;
	}
	else
	{
		receivercorrbankseek.style.display = "none";
		document.getElementById("corrBankDetails1").readOnly=false;
		document.getElementById("corrBankDetails2").readOnly=false;
		document.getElementById("corrBankDetails3").readOnly=false;
		document.getElementById("corrBankDetails4").readOnly=false;
	}
	document.getElementById("corrBankDetails1").value = "";
	document.getElementById("corrBankDetails2").value = "";
	document.getElementById("corrBankDetails3").value = "";
	document.getElementById("corrBankDetails4").value = "";
	document.getElementById("corrBankBic").value = "";
}

function hideIntBankType(radioval)
{
	var intermediarybankseek = document.getElementById("intermediarybankseek");
	if (radioval.value=='R')
	{
		intermediarybankseek.style.display = "block";
		document.getElementById("intBankDetails1").readOnly=true;
		document.getElementById("intBankDetails2").readOnly=true;
		document.getElementById("intBankDetails3").readOnly=true;
		document.getElementById("intBankDetails4").readOnly=true;
	}
	else
	{
		intermediarybankseek.style.display = "none";
		document.getElementById("intBankDetails1").readOnly=false;
		document.getElementById("intBankDetails2").readOnly=false;
		document.getElementById("intBankDetails3").readOnly=false;
		document.getElementById("intBankDetails4").readOnly=false;
	}
	document.getElementById("intBankDetails1").value = "";
	document.getElementById("intBankDetails2").value = "";
	document.getElementById("intBankDetails3").value = "";
	document.getElementById("intBankDetails4").value = "";
	document.getElementById("intBankBic").value = "";
}
function clearSwiftLines()
{
	$('#line1').val('');
	$('#line2').val('');
	$('#line3').val('');
	$('#line4').val('');
}
function showSwiftMsg59(code)
{
	var dlg = $('#swiftMsgDiv');
	dlg.dialog({bgiframe:true, autoOpen:false, height:"auto", modal:true, resizable:false, width:500,title : 'Swift Message Info - Tag <59a>',
					buttons: {Close: function() {$(this).dialog('close'); }}});
	dlg.dialog('open');
	clearSwiftLines();
	populateSwiftMsg59(code);
}
function populateSwiftMsg59(code)
{
	var drawerCode = document.getElementById("drawerDesc");
	var add1 = document.getElementById("beneAddr1");
	var benCountry = document.getElementById("beneCountry");
	var benState = document.getElementById("beneState");
	var benCity = document.getElementById("beneCity");
	var benPostCode = document.getElementById("benePost");
	var line4;
	if (drawerCode != null)
		document.getElementById("line1").value = drawerCode.value;
	else
		document.getElementById("line1").value = code;
	if (add1 != null)
	{
		document.getElementById("line2").value = add1.value.substring(0,35);
		document.getElementById("line3").value = add1.value.substring(35,70);
	}
	if (benCountry != null)
		line4 = benCountry.value.substring(0,10);
	if (benState != null && benState.value != 'NONE')
		line4 = line4 + benState.value.substring(0,10);
	if (benCity != null)
		line4 = line4 + benCity.value.substring(0,10);
	if (benPostCode != null)
		line4 = line4 + benPostCode.value.substring(0,6);
	if (line4 != null)
	document.getElementById("line4").value = line4.substring(0,35); 
}

function showSwiftMsg57()
{
	var dlg = $('#swiftMsgDiv');
	dlg.dialog({bgiframe:true, autoOpen:false, height:"auto", modal:true, resizable:false, width:500,title : 'Swift Message Info - Tag <57a>',
					buttons: {Close: function() {$(this).dialog('close'); }}});
	dlg.dialog('open');
	clearSwiftLines();
	refreshSwiftMsg();
}


function refreshSwiftMsg()
{
	var beneBranchCode = document.getElementById("beneBranchCode");
	var add1;
	var benCountry;
	if (document.getElementById("beneBankType1") != null && document.getElementById("beneBankType1").checked == true)
	{
		add1 = document.getElementById("beneBankAddress");
		benCountry = document.getElementById("beneBankCountry");
	}
	else
	{
		add1 = document.getElementById("beneBankAddress");
		benCountry = document.getElementById("beneBankCountry");
	}
	var line4;
	if (beneBranchCode != null)
		document.getElementById("line1").value = beneBranchCode.value.substring(0,35);
	if (add1 != null)
	{
		document.getElementById("line2").value = add1.value.substring(0,35);
		document.getElementById("line3").value = add1.value.substring(35,70);
		line4 = add1.value.substring(70,95);
	}
	if (benCountry != null)
		line4 = line4 + benCountry.value.substring(0,10);
	if (line4 != null)
		document.getElementById("line4").value = line4.substring(0,35); 
}

function populateSwiftMsg59a(code)
{
	var drawerCode = document.getElementById("drawerDesc");
	var add1 = document.getElementById("beneAddr1");
	var benCountry = document.getElementById("beneCountry");
	var benState = document.getElementById("beneState");
	var benCity = document.getElementById("beneCity");
	var benPostCode = document.getElementById("benePost");
	var line4;
	if (drawerCode != null)
		document.getElementById("tag59aLine1").value = drawerCode.value;
	else
		document.getElementById("tag59aLine1").value = code;
	if (add1 != null)
	{
		document.getElementById("tag59aLine2").value = add1.value.substring(0,35);
		document.getElementById("tag59aLine3").value = add1.value.substring(35,70);
	}
	if (benCountry != null)
		line4 = benCountry.value.substring(0,10);
	if (benState != null && benState.value != 'NONE')
		line4 = line4 + benState.value.substring(0,10);
	if (benCity != null)
		line4 = line4 + benCity.value.substring(0,10);
	if (benPostCode != null)
		line4 = line4 + benPostCode.value.substring(0,6);
	if (line4 != null)
	document.getElementById("tag59aLine4").value = line4.substring(0,35); 
}

function populateSwiftMsg57a()
{
	var beneBranchCode = document.getElementById("beneBranchCode");
	var add1;
	var benCountry;
	if (document.getElementById("beneBankType1") != null && document.getElementById("beneBankType1").checked == true)
	{
		if(document.getElementById("beneBankAddress") != null)
		{
			add1 = document.getElementById("beneBankAddress");
		}
		if(add1.value == '' && document.getElementById("beneAddress2") != null)
		{
			add1 = document.getElementById("beneAddress2");
		}
		benCountry = document.getElementById("beneBankCountry");
	}
	else
	{
		if(document.getElementById("beneBankAddress") != null )
		{
			add1 = document.getElementById("beneBankAddress");
		}
		if(add1.value == '' && document.getElementById("beneAddress2") != null)
		{
			add1 = document.getElementById("beneAddress2");
		}
		benCountry = document.getElementById("beneBankCountry");
	}
	var line4;
	if (beneBranchCode != null)
		document.getElementById("tag57aLine1").value = beneBranchCode.value.substring(0,35);
	if (add1 != null)
	{
		document.getElementById("tag57aLine2").value = add1.value.substring(0,35);
		document.getElementById("tag57aLine3").value = add1.value.substring(35,70);
		line4 = add1.value.substring(70,95);
	}
	if (benCountry != null)
		line4 = line4 + benCountry.value.substring(0,10);
	if (line4 != null)
		document.getElementById("tag57aLine4").value = line4.substring(0,35); 
}

function goToPage(strUrl)
{
	var frm = document.forms["frmMain"];
	frm.action = strUrl;
	frm.target = "";
	frm.method = "POST";
	frm.submit();
}

function getCancelConfirmPopUp(strUrl) {
	
	var amtValue = $('#totalTxnAmtAllowed').val();
	if(amtValue)
		{
		amtValue = amtValue.replaceAll(',','');
		$('#totalTxnAmtAllowed').val(amtValue);
		}	
	if(dityBitSet)
	{
		$('#confirmMsgPopup').dialog({
		        title:getLabel('lbl.profiles.message.header','Message'),
					autoOpen : false,
					width : 430,
					modal : true,
				buttons :[
					{
						text:getLabel('lbl.btn.ok','Ok'),
						click : function() {
							$('#confirmMsgPopup').dialog("close");
							gotoPage(strUrl);
						}
					},
					{
						text:getLabel('lbl.btn.cancel','Cancel'),
						click : function() {
							$('#confirmMsgPopup').dialog("close");
						}
					}
				],
					draggable: false,
					 resizable: false
		});
		
		$('#confirmMsgPopup').dialog("open");

	}
	else
	{
		gotoPage(strUrl);
	}
}
String.prototype.replaceAll = function(search, replacement) {
    var target = this;
    return target.replace(new RegExp(search, 'g'), replacement);
};
function saveProfile(strUrl)
{
	

	var frm = document.forms["frmMain"];
	frm.action = strUrl;
	$(":input").removeAttr('disabled');
	frm.target = "";
	frm.method = "POST";	
    
	var paymentType=$('#paymentType').val();
	
	if(!isReceiverBankIDSelected){
		$('#beneBankType').val("A");
		//$('#beneBankCode').val($('#bankSearchText').val());
	}
	else{
		$('#beneBankType').val("R");
	}
	if(!isCorrBankIDSelected){
		if(!isEmpty($('#corrBankSearchText').val()) || !isEmpty($('#corrBankDetails1').val()))
		{
			$('#corrBankType').val("A");
		}
		//$('#corrBankDetails1').val($('#corrBankSearchText').val());
	}
	else{
		$('#corrBankType').val("R");
	}
	if(!isIntBankIDSelected){
		if(!isEmpty($('#interemBankSearchText').val()) || !isEmpty($('#intBankDetails1').val()))
		{
			$('#intBankType').val("A");
		}
		
		//$('#intBankDetails1').val($('#interemBankSearchText').val());
	}
	else{
		$('#intBankType').val("R");
	}
	//$('#beneBankBic').val($('#bankSearchText').val());
	$('#corrBankBic').val($('#corrBankSearchText').val());
	$('#intBankBic').val($('#interemBankSearchText').val());
	setTagFieldRelatedDependencies();
	if (isEmpty($('#bankSearchText').val()))
		$('#beneBankCode').val('');
	if (isEmpty($('#beneBranchDesc').val()))
		$('#beneBranchCode').val('');
	
	if(validFlag=='Y' && !isEmpty($('#tempTxnAmt').val())){
		
		if(validatefields())
		{		
			return;
		}
	}
	var amtValue = $('#totalTxnAmtAllowed').val();
	if (amtValue) {
		amtValue = amtValue.replaceAll(',','');
		$('#totalTxnAmtAllowed').val(amtValue);
	}
	var acctNmbr = $('#beneAcctNmbr').val();
	if(acctNmbr){
		acctNmbr = acctNmbr.toUpperCase();
		$('#beneAcctNmbr').val(acctNmbr);
	}
	$('#periodTypeD').attr('disabled', false);
	$('#periodTypeM').attr('disabled', false);
	//iban validation
	if(!doIBANValidation())
	{
		return false;
	}	
	
		if(!validateAndPaintReceiverBankIDsErrors())
		{
			if ($('#beneAccountCcy').attr('disabled'))
				$('#beneAccountCcy').attr('disabled', false);
			if (isEmpty($('#beneAccountCcy').val()) && paymentType!='01' && paymentType!='02' && paymentType!='07' && paymentType!='30')
				$('#beneAccountCcy').val(defaultSeller);
			
			if( strUrl.indexOf('submitBeneficiary') !=-1 )
				{
					var arrayJson = new Array();
					arrayJson.push({
						serialNo : 1,
						identifier : document.getElementById("viewState").value,
						userMessage : "",
						recordDesc : ""
					});
					arrayJson = arrayJson.sort(function(valA, valB) 
								{
									return valA.serialNo - valB.serialNo
								});
					
					$.ajax({
				        url: "services/receiversList/submit",
				        type: "POST",
				        data: JSON.stringify(arrayJson),
				        async : false,
				        contentType: "application/json; charset=utf-8",
				        success: function (data) {
				        	if(data !=null && data[0] != undefined  && data[0].success === 'Y')
				        	window.location = 'beneficiaryList.form';
				        	//$.unblockUI();
				        },
				        error: function () {
				            $('#errorDiv').removeClass('hidden');
				        	$('#errorPara').text("An error has occured!!!");
				        	if(event)
					            event.preventDefault();
				        	$.unblockUI();
				        }
				    });
				}
			else
				{
					frm.submit();
				}
	
		}
}


function getAdhocBankDetailsPopup()
{
	var buttonsOpts = {};
	buttonsOpts[btnsArray['okBtn']] = function() {
		$(this).dialog("close");
	};
	buttonsOpts[btnsArray['cancelBtn']] = function() {
		$(this).dialog("close");
	};		
		$('#adhocBankDetails').dialog({
			autoOpen : false,
			height : 380,
			width : 580,
			modal : true,
			buttons : buttonsOpts
		});
$('#adhocBankDetails').dialog("open");		

}

jQuery.fn.beneBankSeekAutoComplete= function() {
	return this.each(function() {
		$(this).autocomplete({
					source : function(request, response) {
						$.ajax({
									url : "services/drawBankSeek.json?$sellerCode="+$('#sellerCode').val()+"&$country="+$('#tempCountry').val(),
									type: "POST",
									dataType : "json",
									data : {
										$autofilter : request.term
									},
									success : function(data) {
										var rec = data.filterList;
										response($.map(rec, function(item) {
													return {														
														label : item.value,														
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
							if (!isEmpty(data.value))
							{
								$('#beneBankCode').val(data.value);
								$('#beneBankDesc').val(data.value);								
							}
						}
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
			var inner_html = '<a><ol class="t7-autocompleter"><ul  >'
					+ item.label + '</ul></ol></a>';
			return $("<li></li>").data("item.autocomplete", item)
					.append(inner_html).appendTo(ul);
		};*/
	});
};

jQuery.fn.beneBankBranchSeekAutoComplete= function() {
	return this.each(function() {
		$(this).autocomplete({
					source : function(request, response) {
						$.ajax({
									url : "services/drawBankBranchSeek.json?$sellerCode="+$('#sellerCode').val()+"&$country="+$('#tempCountry').val()+"&$branch="+$('#beneBankCode').val(),
									type: "POST",
									dataType : "json",
									data : {
										$autofilter : request.term
									},
									success : function(data) {
											var rec = data.filterList;
											response($.map(rec, function(item) {
														return {														
															label : item.value,														
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
							if (!isEmpty(data.value))
							{
								$('#beneBranchDesc').val(data.value);
								$('#beneBranchCode').val(data.value);
							}
						}
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
			var inner_html = '<a><ol class="t7-autocompleter"><ul  >'
					+ item.label + '</ul></ol></a>';
			return $("<li></li>").data("item.autocomplete", item)
					.append(inner_html).appendTo(ul);
		};*/
	});
};

jQuery.fn.corrBankSeekAutoComplete= function() {
	return this.each(function() {
		$(this).autocomplete({
					source : function(request, response) {
						$.ajax({
									url : getUrlForNameSearch(),
									type: "POST",
									dataType : "json",
									data : {
										$autofilter : request.term
									},
									success : function(data) {
										var rec = data.d.preferences;
										response($.map(rec, function(item) {
													return {														
														label : item.BRANCHDESCRIPTION,
														bankDesc : item.BANKDESCRIPTION,
														value : item.BRANCHDESCRIPTION,															
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
							if (!isEmpty(data.value))
							{
								$('#corrBankDetails1').val(data.value);
								
							}
							if (!isEmpty(data.BIC))
							{
								$('#corrBankSearchText').val(data.BIC);
							}
							
						}
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
			var inner_html = '<a><ol class="t7-autocompleter"><ul  >'
					+ item.label
					+ '</ul><ul  >'
					+ item.bankDesc + '</ul></ol></a>';
			return $("<li></li>").data("item.autocomplete", item)
					.append(inner_html).appendTo(ul);
		};*/
	});
};

jQuery.fn.corrBankBranchSeekAutoComplete= function() {
	return this.each(function() {
		$(this).autocomplete({
					source : function(request, response) {
						$.ajax({
									url : getUrlForNameSearch(),
									type: "POST",
									dataType : "json",
									data : {
										$autofilter : request.term
									},
									success : function(data) {
										var rec = data.filterList;
										response($.map(rec, function(item) {
													return {			
														label : item.value,														
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
							if (!isEmpty(data.value))
							{
								$('#corrBankDetails2').val(data.value);
							}
							
						}
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
			var inner_html = '<a><ol class="t7-autocompleter"><ul  >'
					+ item.label + '</ul></ol></a>';
			return $("<li></li>").data("item.autocomplete", item)
					.append(inner_html).appendTo(ul);
		};*/
	});
};

jQuery.fn.intermBankSeekAutoComplete= function() {
	return this.each(function() {
		$(this).autocomplete({
					source : function(request, response) {
						$.ajax({
									url : getUrlForNameSearch(),
									type: "POST",
									dataType : "json",
									data : {
										$autofilter : request.term
									},
									success : function(data) {
										var rec =data.d.preferences;
										response($.map(rec, function(item) {
													return {														
														label : item.BRANCHDESCRIPTION,
														bankDesc : item.BANKDESCRIPTION,
														value : item.BRANCHDESCRIPTION,															
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
							if (!isEmpty(data.value))
							{
								$('#intBankDetails1').val(data.value);
							}
							if (!isEmpty(data.BIC))
							{
								$('#interemBankSearchText').val(data.BIC);
							}
							
						}
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
			var inner_html = '<a><ol class="t7-autocompleter"><ul  >'
					+ item.label
					+ '</ul><ul  >'
					+ item.bankDesc + '</ul></ol></a>';
			return $("<li></li>").data("item.autocomplete", item)
					.append(inner_html).appendTo(ul);
		};*/
	});
};

jQuery.fn.intermBankBranchSeekAutoComplete= function() {
	return this.each(function() {
		$(this).autocomplete({
					source : function(request, response) {
						$.ajax({
									url : "services/drawBankBranchSeek.json?$sellerCode="+$('#sellerCode').val()+"&$country="+$('#tempCountry').val()+"&$branch="+$('#intBankDetails1').val(),
									type: "POST",
									dataType : "json",
									data : {
										$autofilter : request.term
									},
									success : function(data) {
										var rec = data.filterList;
										response($.map(rec, function(item) {
													return {			
														label : item.value,														
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
							if (!isEmpty(data.value))
							{
								$('#intBankDetails2').val(data.value);
							}
						}
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
			var inner_html = '<a><ol class="t7-autocompleter"><ul  >'
					+ item.label + '</ul></ol></a>';
			return $("<li></li>").data("item.autocomplete", item)
					.append(inner_html).appendTo(ul);
		};*/
	});
};

jQuery.fn.sellersClientSeekAutoComplete= function() {
	return this.each(function() {
		$(this).autocomplete({
					source : function(request, response) {
						$.ajax({
									url : "services/receiverPartySeek/receivingPartyAdminClientList.json",
									type: "POST",
									dataType : "json",
									data : {
										qfilter : request.term
									},
									success : function(data) {
										if (data.filterList){
										var rec = data.filterList;
										response($.map(rec, function(item) {
													return {														
														label : item.name.concat( " | ", item.value),	
														value : item.value,
														bankDtl : item
													}
												}));
										}
									}
								});

					},
					minLength : 1,
					select : function(event, ui) {
						var data = ui.item.bankDtl;
						
						if (data) {
							if (!isEmpty(data.name))
							{
								$('#clientId').val(data.name);
								$('#clientDesc').val(data.value);
								onClientChange();
							}
						}
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
			var inner_html = '<a><ol class="t7-autocompleter"><ul  >'
					+ item.label + '</ul></ol></a>';
			ul.addClass('client_autocompleter');
			return $("<li></li>").data("item.autocomplete", item)
					.append(inner_html).appendTo(ul);
		};*/
	});
};
function reloadPaymentTypes()
{
	var filterCode1 = $('#clientId').val();
	var strUrl = "services/userseek/beneClientPaymentTypesSeek.json";
	$.ajax({
		url : strUrl,
				dataType : "json",
				type:'POST',
				data : {
					$top:-1,
					$filtercode1:filterCode1,
					$autofilter : '%'
				},
				success : function(data) {
					var rec = data.d.preferences;
							$('#paymentType')
							.empty()
							//.append('<option selected="selected" value="">Select</option>');
							$('#paymentType').append($('<option>', { 
								value: "",
								selected:"selected",
								text : getLabel('lbl.bankidtype.select','Select') 
							}));
					if(rec && rec.length > 0){
						$.each(rec, function(index, cfg) {
							$('#paymentType').append($('<option>', { 
								value: cfg.PRODUCTID,
								text : (cfg.PRODUCTID == '06' && nonUsImpl === 'N')?getLabel('lbl.typepayment.us.'+cfg.PRODUCTID,cfg.PRODTYPEDESC)
										:getLabel('lbl.typepayment.'+cfg.PRODUCTID,cfg.PRODTYPEDESC) 
							}));
						});			
					}
					$('#paymentType').val(paymentTypeVal);
				    if("ADD"== pageMode ||"SAVE"== pageMode || "EDIT"== pageMode || "UPDATE"== pageMode || "SAVE_NEXT" == nextPageMode || "UPDATE_NEXT" == nextPageMode)
					makeNiceSelect('paymentType', true);
					setCurrency(defaultSeller);
					showHideOnchangeAnyIdPayment();
				}
	});	
}

jQuery.fn.BankIdAutoComplete = function() {
	return this.each(function() {
		$(this).autocomplete({
			source : function(request, response) {
				$.ajax({
							url : "services/userseek/beneEntryDrawerbank.json",
							type : 'POST',
							dataType : "json",
							data : {
								$top : autocompleterSize,
								$filtercode1 : $('#clientSellerCode').val(),
								$autofilter : request.term,
								$filtercode2 : $('#bankIdType').val()
										? $('#bankIdType').val() :'BIC',
								$filtercode3 : !isEmpty($('#bankIdType').val()) && $('#mySelectList > option').length ===1 && $('#paymentType').val() =='04' ? 'BOOK' : $('#paymentType').val()
							},
							success : function(data) {
								isReceiverBankIDSelected = false;
								var rec = data.d.preferences;
								if (rec.length > 0) {
									response($.map(rec, function(item) {
												return {
													label : item.ROUTINGNUMBER+' | '+item.BRANCHDESCRIPTION,
													bankDesc : item.BANKDESCRIPTION,
													value : item.ROUTINGNUMBER,
													bankDtl : item
												}
											}));
								}/* else {
									validateAndPaintReceiverBankIDsErrors();
								}*/
								$('#beneBankAddress').val('');
								$('#beneBankAddress2').val('');
								$('#beneBankAddress3').val('');
								$('#beneBranchDesc').val('');
							}
						});
			},
			focus: function( event, ui ) {
                $(".ui-autocomplete > li").attr("title", ui.item.label);
            },
			minLength : 1,
			select : function(event, ui) {
				$('#bankSearchText').val('');// jquery to remove typed text to avoid AJAX call inside below method.
				checkInfoFoundForBankIDListener('bankIdType','bankIdNotFound', 'RECEIVER_BANK_ID');
				var data = ui.item.bankDtl;
				var strText = '';
				if (data) {
					$('#beneBankCode').attr("disabled", "true");
					isReceiverBankIDSelected = true;
					
					if (!isEmpty(data.BANKCODE)) {
						$('#beneBankCode').val(data.BANKCODE);
						$('#beneBankDesc').val(data.BANKDESCRIPTION);
					}
					if(!isEmpty(data.ROUTINGNUMBER)){
						$('#bankId').val(data.ROUTINGNUMBER);
						$('#bankSearchText').val(data.ROUTINGNUMBER);
					}	
					if (!isEmpty(data.BRANCHCODE))
						$('#beneBranchCode').val(data.BRANCHCODE);
					if (!isEmpty(data.BRANCHDESCRIPTION))
						$('#beneBranchDesc').val(data.BRANCHDESCRIPTION);
					if (!isEmpty(data.ADDRESS) && data.ADDRESS!= undefined)//
					{
						$('#beneBankAddress').val(data.ADDRESS.substring(0,35));
						$('#beneBankAddress').attr('disabled','disabled');				
						$('#beneBankAddress').addClass("disabled");	
						$('#beneBankAddress2').val(data.ADDRESS.substring(35,70));
						$('#beneBankAddress2').attr('disabled','disabled');				
						$('#beneBankAddress2').addClass("disabled");
					
					if (!isEmpty(data.COL1))
					{
						$('#beneBankAddress3').val(data.COL1);	
						$('#beneBankAddress3').attr('disabled','disabled');				
						$('#beneBankAddress3').addClass("disabled");
					}
					}
					// $('#bankIdNotFound').empty();
					$('#beneficiaryIDNumber').val($('#bankSearchText').val());
					if (!isEmpty(data.BIC))
						$('#beneBankBic').val(data.BIC);
					
				}
				resetBeneficiaryBankDetails();
			},
			open : function() {
				/*
				 * $(this).removeClass("ui-corner-all")
				 * .addClass("ui-corner-top");
				 */
			},
			close : function() {
				/*
				 * $(this).removeClass("ui-corner-top")
				 * .addClass("ui-corner-all");
				 */
			}
		});/*.data("autocomplete")._renderItem = function(ul, item) {
			
			 * var inner_html = '<a><ol class="t7-autocompleter"><ul  >'
			 * +item.value +' - '+ item.label + '</ul><ul  >' + item.bankDesc + '</ul></ol></a>';
			 
			var inner_html = '<a><ol class="t7-autocompleter"><ul">'
					+ item.value + '  ' + '</ul><ul">' + item.label + '</ul></ol></a>';
			ul.addClass('bankid_autocompleter');
			return $("<li></li>").data("item.autocomplete", item)
					.append(inner_html).appendTo(ul).attr('title',item.value+" "+item.label);
		};*/
	});
};

jQuery.fn.CorrBankIdAutoComplete = function() {
	return this.each(function() {
		$(this).autocomplete({
					source : function(request, response) {
						$.ajax({
							url : "services/userseek/beneEntryDrawerbank.json",
									dataType : "json",
							type : 'POST',
									data : {
								$top : 20,
								$filtercode1 : $('#clientSellerCode').val(),
								$autofilter : request.term,
								$filtercode2 : $('#corrBankIdType').val()
										? $('#corrBankIdType').val() :'BIC',
								$filtercode3 : !isEmpty($('#corrBankIdType').val()) && $('#mySelectList > option').length ===1 && $('#paymentType').val() =='04' ? 'BOOK' : $('#paymentType').val()
									},
									success : function(data) {
										isCorrBankIDSelected = false;
										var rec = data.d.preferences;
										response($.map(rec, function(item) {
													return {
														label : item.ROUTINGNUMBER+' | '+item.BRANCHDESCRIPTION,
														value : item.ROUTINGNUMBER,
														bankDtl : item
													}
												}));
									}
								});
					},
					focus: function( event, ui ) {
		                $(".ui-autocomplete > li").attr("title", ui.item.label);
		            },
					minLength : 1,
					select : function(event, ui) {
						var data = ui.item.bankDtl;
						var strText = '';
						if (data) {
							isCorrBankIDSelected = true;
							
							if (!isEmpty(data.BANKCODE))
							{
								$('#corrBankSearchText').val(data.BANKCODE);
							}
							if (!isEmpty(data.BRANCHCODE))
								$('#corrBankCodeDetails1').val(data.BRANCHCODE);
							if (!isEmpty(data.BRANCHDESCRIPTION))
								$('#corrBankDetails1').val(data.BRANCHDESCRIPTION);
							if (!isEmpty(data.ADDRESS) && data.ADDRESS!= undefined)//
							{
								$('#corrBankDetails2').val(data.ADDRESS.substring(0,34));
								$('#corrBankDetails2').attr('disabled',true);				
								$('#corrBankDetails2').addClass("disabled");
								$('#corrBankDetails3').val(data.ADDRESS.substring(34,69));
								$('#corrBankDetails3').attr('disabled',true);				
								$('#corrBankDetails3').addClass("disabled");
								$('#corrBankDetails4').val(data.COL1);	
								$('#corrBankDetails4').attr('disabled',true);				
								$('#corrBankDetails4').addClass("disabled");
							}
							else
							{
								$('#corrBankDetails2,#corrBankDetails3,#corrBankDetails4').val("");	
								$('#corrBankDetails2,#corrBankDetails3,#corrBankDetails4').removeClass("disabled");	
								$('#corrBankDetails2,#corrBankDetails3,#corrBankDetails4').attr('disabled',false);
							}
							$('#recCorrBankIdNotFound').empty();
							$('#lblCorrBankBranchName').removeClass('required-lbl-right');
						}
					},
					change : function() {
						if($('#corrBankSearchText').val().length < 1)
						{
							$('#corrBankDetails1').val('');
							$('#corrBankDetails2,#corrBankDetails3,#corrBankDetails4').val("");	
							$('#corrBankDetails2,#corrBankDetails3,#corrBankDetails4').removeClass("disabled");	
							$('#corrBankDetails2,#corrBankDetails3,#corrBankDetails4').attr('disabled',false);
							$('#corrBankCodeDetails1').val('');
					}
					}
				});/*.data("autocomplete")._renderItem = function(ul, item) {
			var inner_html = '<a><ol class="t7-autocompleter"><ul">'
					+ item.value
					+ '</ul><ul">'
					+ item.label + '</ul></ol></a>';
			return $("<li></li>").data("item.autocomplete", item)
					.append(inner_html).appendTo(ul).attr('title',item.value+" "+item.label);
		};*/
	});
};

function enableDisableAddressDetails()
{
	if(!isEmpty($('#interemBankSearchText').val()))
	{
		$('#intBankDetails2,#intBankDetails3,#intBankDetails4').addClass("disabled");	
		$('#intBankDetails2,#intBankDetails3,#intBankDetails4').attr('disabled',true);
	}
	if(!isEmpty($('#corrBankSearchText').val()))
	{
		$('#corrBankDetails2,#corrBankDetails3,#corrBankDetails4').addClass("disabled");	
		$('#corrBankDetails2,#corrBankDetails3,#corrBankDetails4').attr('disabled',true);
	}
	if(!isEmpty($('#bankSearchText').val()))
	{
		$('#beneBankAddress,#beneBankAddress2,#beneBankAddress3').addClass("disabled");	
		$('#beneBankAddress,#beneBankAddress2,#beneBankAddress3').attr('disabled',true);
	}
}

jQuery.fn.IntBankIdAutoComplete = function() {
	return this.each(function() {
		$(this).autocomplete({
					source : function(request, response) {
						$.ajax({
							url : "services/userseek/beneEntryDrawerbank.json",
									dataType : "json",
									data : {
										$top:autocompleterSize,
										$filtercode1:$('#sellerCode').val(),
										$filtercode2: $('#interemBankIdType').val()
										? $('#interemBankIdType').val() :'BIC',
										$autofilter : request.term,
										$filtercode3 : !isEmpty($('#interemBankIdType').val()) && $('#mySelectList > option').length ===1 && $('#paymentType').val() =='04' ? 'BOOK' : $('#paymentType').val()
									},
									success : function(data) {
										isIntBankIDSelected = false;
										var rec = data.d.preferences;
										response($.map(rec, function(item) {
													return {
														label : item.ROUTINGNUMBER+' | '+item.BRANCHDESCRIPTION,
														value : item.ROUTINGNUMBER,
														bankDtl : item
													}
												}));
									}
								});
					},
					focus: function( event, ui ) {
		                $(".ui-autocomplete > li").attr("title", ui.item.label);
		            },
					minLength : 1,
					select : function(event, ui) {
						var data = ui.item.bankDtl;
						var strText = '';
						if (data) {
							isIntBankIDSelected = true;
							if (!isEmpty(data.BANKCODE))
							{
								$('#interemBankSearchText').val(data.BANKCODE);
							}
							if (!isEmpty(data.BRANCHCODE))
								$('#intBankCodeDetails1').val(data.BRANCHCODE);
							if (!isEmpty(data.BRANCHDESCRIPTION))
								$('#intBankDetails1').val(data.BRANCHDESCRIPTION);
							if (!isEmpty(data.ADDRESS) && data.ADDRESS!= undefined)//
							{
								$('#intBankDetails2').val(data.ADDRESS.substring(0,34));
								$('#intBankDetails2').attr('disabled',true);				
								$('#intBankDetails2').addClass("disabled");
								$('#intBankDetails3').val(data.ADDRESS.substring(34,69));
								$('#intBankDetails3').attr('disabled',true);				
								$('#intBankDetails3').addClass("disabled");
								$('#intBankDetails4').val(data.COL1);	
								$('#intBankDetails4').attr('disabled',true);				
								$('#intBankDetails4').addClass("disabled");
							}
							else
							{
								$('#intBankDetails2,#intBankDetails3,#intBankDetails4').val("");	
								$('#intBankDetails2,#intBankDetails3,#intBankDetails4').removeClass("disabled");	
								$('#intBankDetails2,#intBankDetails3,#intBankDetails4').attr('disabled',false);
							}
							$('#intCorrBankIdNotFound').empty();
							$('#lblIntBankBranchName').removeClass('required-lbl-right');
						}
					},
					change : function() {
						if($('#interemBankSearchText').val().length < 1)
						{
							$('#intBankDetails1').val('');
							$('#intBankDetails2').val('');
							$('#intBankDetails3').val('');
							$('#intBankDetails4').val('');
							$('#intBankCodeDetails1').val('');
					}			
					}
				});/*.data("autocomplete")._renderItem = function(ul, item) {
			var inner_html = '<a><ol class="t7-autocompleter"><ul">'
					+ item.value
					+ '</ul><ul">'
					+ item.label + '</ul></ol></a>';
			return $("<li></li>").data("item.autocomplete", item)
					.append(inner_html).appendTo(ul).attr('title',item.value+" "+item.label);
		};*/
	});
};

jQuery.fn.BankBranchAutoComplete = function() {
	return this.each(function() {
		$(this).autocomplete({
					source : function(request, response) {
						$.ajax({
							url : "services/userseek/beneEntryDrawerbank.json?$top=20&$filtercode1="+$('#tempCountry').val()+"&$filtercode2="+$('#sellerCode').val(),
									dataType : "json",
									data : {
										$autofilter : request.term
									},
									success : function(data) {
										var rec = data.d.preferences;
										response($.map(rec, function(item) {
													return {
														label : item.BANKDESCRIPTION,
														value : item.BANKCODE,
														bankDtl : item
													}
												}));
									}
								});
					},
					minLength : 1,
					select : function(event, ui) {
						var data = ui.item.bankDtl;
						var strText = '';
						if (data) {
							
							if (!isEmpty(data.BANKCODE))
								$('#beneBankCode').val(data.BANKCODE);
								$('#beneBankDesc').val(data.BANKDESCRIPTION);								
							if (!isEmpty(data.BRANCHCODE))
								$('#beneBranchCode').val(data.BRANCHCODE);
								$('#beneBranchDesc').val(data.BRANCHDESCRIPTION);								
						}
					}					
				});/*.data("autocomplete")._renderItem = function(ul, item) {
			var inner_html = '<a><ol class="t7-autocompleter"><ul">'
					+ item.value
					+ '</ul><ul>'
					+ item.label + '</ul></ol></a>';
			return $("<li></li>").data("item.autocomplete", item)
					.append(inner_html).appendTo(ul);
		};*/
	});
};

jQuery.fn.CorrBankBranchAutoComplete = function() {
	return this.each(function() {
		$(this).autocomplete({
					source : function(request, response) {
						$.ajax({						
									url : "services/userseek/beneEntryDrawerbank.json?$top=20&$filtercode1="+$('#tempCountry').val()+"&$filtercode2="+$('#sellerCode').val(),
									dataType : "json",
									data : {
										$autofilter : request.term
									},
									success : function(data) {
										var rec = data.d.preferences;
										response($.map(rec, function(item) {
													return {
														label : item.BANKDESCRIPTION,
														value : item.BANKCODE,
														bankDtl : item
													}
												}));
									}
								});
					},
					minLength : 1,
					select : function(event, ui) {
						var data = ui.item.bankDtl;
						var strText = '';
						if (data) {
							if (!isEmpty(data.BANKCODE))
								$('#corrBankDetails1').val(data.BANKCODE);
							if (!isEmpty(data.BRANCHCODE))
								$('#corrBankDetails2').val(data.BRANCHCODE);
						}
					}
				});/*.data("autocomplete")._renderItem = function(ul, item) {
			var inner_html = '<a><ol class="t7-autocompleter"><ul>'
					+ item.value
					+ '</ul><ul">'
					+ item.label + '</ul></ol></a>';
			return $("<li></li>").data("item.autocomplete", item)
					.append(inner_html).appendTo(ul);
		};*/
	});
};

jQuery.fn.IntBankBranchAutoComplete = function() {
	return this.each(function() {
		$(this).autocomplete({
					source : function(request, response) {
						$.ajax({
									url : "services/userseek/beneEntryDrawerbank.json?$top=20&$filtercode1="+$('#tempCountry').val()+"&$filtercode2="+$('#sellerCode').val(),
									dataType : "json",
									data : {
										$autofilter : request.term
									},
									success : function(data) {
										var rec = data.d.preferences;
										response($.map(rec, function(item) {
													return {
														label : item.BANKDESCRIPTION,
														value : item.BANKCODE,
														bankDtl : item
													}
												}));
									}
								});
					},
					minLength : 1,
					select : function(event, ui) {
						var data = ui.item.bankDtl;
						var strText = '';
						if (data) {
							
							if (!isEmpty(data.BANKCODE))
								$('#intBankDetails1').val(data.BANKCODE);
							if (!isEmpty(data.BRANCHCODE))
								$('#intBankDetails2').val(data.BRANCHCODE);
						}
					}
				});/*.data("autocomplete")._renderItem = function(ul, item) {
			var inner_html = '<a><ol class="t7-autocompleter"><ul">'
					+ item.value
					+ '</ul><ul">'
					+ item.label + '</ul></ol></a>';
			return $("<li></li>").data("item.autocomplete", item)
					.append(inner_html).appendTo(ul);
		};*/
	});	
};
/*Receiver code Start*/
jQuery.fn.ReceiverCodeAutoComplete = function() {
	return this.each(function() {
		$(this).autocomplete({
					source : function(request, response) {
						$.ajax({
									url : "services/userseek/clientReceiverCodesList2.json?",
									dataType : "json",
									type:'POST',
									data : {
										$top:10,
										$autofilter : $('#receiverCode').val(),
										$filtercode1 : $('#clientId').val()
									},
									success : function(data) {
										var rec = data.d.preferences;
										response($.map(rec, function(item) {
													return {
														label : item.RECEIVER_CODE,
														value : item.RECEIVER_CODE,
														data: item
													}
												}));
									}
								});
					},
					minLength : 1,
					select : function(event, ui) {
						var data = ui.item.data;
						var limitLevelVal = data.LIMIT_LEVEL_FLAG;
						var periodTypeVal = data.PERIOD_TYPE;
						var LEI_code = data.RECEIVER_LEI_CODE;
						var beneType = data.RECEIVER_LEI_TYPE;
						var strText = '';
						var limitAccount;
						if (data) {
							if (!isEmpty(data.LIMIT_LEVEL_FLAG))
							{
									if (limitLevelVal == 'N')
									{
										$("#limitLevelN").prop("checked", true);
										$("#limitLevelR").prop("disabled", true);
										$("#limitLevelA").prop("disabled", true);
									}
									if (limitLevelVal == 'B')
									{
										$("#limitLevelR").prop("checked", true);
										$("#limitLevelN").prop("disabled", true);
										$("#limitLevelA").prop("disabled", true);
									}
									//showHideTxnLimit(limitLevelVal);
									if (limitLevelVal == 'A')
									{
										limitAccount=true;
										$("#limitLevelN").prop("checked", true);
										$("#limitLevelR").prop("disabled", true);
										$("#limitLevelA").prop("disabled", false);
									}
									showHideTxnLimit(limitLevelVal);
							}
							if (!isEmpty(data.PERIOD_TYPE))
							{
									if (periodTypeVal == 'D'){
										$("#periodTypeD").prop("checked", true);
										if(!limitAccount)
											$("#periodTypeM").prop("disabled", true);
										else
											$("#periodTypeM").prop("disabled", false);
									}
									if (periodTypeVal == 'M'){
										$("#periodTypeM").prop("checked", true);
										if(!limitAccount)
											$("#periodTypeD").prop("disabled", true);
										else
											$("#periodTypeD").prop("disabled", false);
									}
							}
							if (!isEmpty(data.TOTAL_TXN_AMT))
							{
								if(!limitAccount)
								{
									$('#totalTxnAmtAllowed').prop("disabled", true);
									$('#totalTxnAmtAllowed').val(data.TOTAL_TXN_AMT);
								}
								else
									$("#totalTxnAmtAllowed").prop("disabled", false);
							}	
							if (!isEmpty(data.TOTAL_TXN_AMT))
							{
								if(!limitAccount)
								{
									$('#maxNoTxnAllowed').prop("disabled", true);
									$('#maxNoTxnAllowed').val(data.MAX_NO_TXN);
								}
								else
									$("#maxNoTxnAllowed").prop("disabled", false);
							}
							if (!isEmpty(data.BENE_ADDRESS_1))
							{
								$("#beneAddr1").val(data.BENE_ADDRESS_1)
							}
							if (!isEmpty(data.BENE_ADDRESS_2))
							{
								$("#beneAddr2").val(data.BENE_ADDRESS_2)
							}
							if (!isEmpty(data.BENE_ADDRESS_3))
							{
								$("#beneAddr3").val(data.BENE_ADDRESS_3)
							}
							if (!isEmpty(data.BENE_MOBILE_NMBR))
							{
								$("#beneMobileNmbr").val(data.BENE_MOBILE_NMBR)
							}
							if (!isEmpty(data.BENE_EMAIL_ID))
							{
								$("#beneEmailId").val(data.BENE_EMAIL_ID)
							}
							if (!isEmpty(data.DRAWER_DESCRIPTION))
							{
								$("#drawerDesc").val(data.DRAWER_DESCRIPTION)
							}
							if($('#receiverTypeE').is(":checked"))
							{
								$('#leiCode').attr("disabled", true); 
								$('#LEICode').attr("disabled", true); 
								$('#LEICode').val(LEI_code);
	 							$('#leiCode').val(beneType);
	 							enableDisableLEICode(beneType);
							}
						}										
					}
				});
	});
};
/*Receiver Code End*/

jQuery.fn.BeneReceiverStateAutoComplete = function() {
		return this.each(function() {
			$(this).autocomplete({
				source : function(request, response) {
					var strUrl = "services/userseek/state.json";

						if (isEmpty($('#beneCountry').val())) 
						return false;			
					$.ajax({
								url : strUrl,	
								dataType : "json",
								type:'POST',
								data : {
									$top:10,
									$filtercode1:(isEmpty($('#beneCountry').val())?$('#tempCountry').val():$('#beneCountry').val()),
									$autofilter : request.term
								},
								success : function(data) {
									var rec = data.d.preferences;
									response($.map(rec, function(item) {
												return {
													label : item.DESCRIPTION,
													value : item.CODE
												}
											}));
								}
							});
				},
				minLength : 1,
				select : function(event, ui) {					
						//$('#beneCountry').val('');					
				},
				open : function() {
					$(this).removeClass("ui-corner-all").addClass("ui-corner-top");
				},
				close : function() {
					$(this).removeClass("ui-corner-top").addClass("ui-corner-all");
				}
			});/*.data("autocomplete")._renderItem = function(ul, item) {
				var inner_html = '<a><ol class="t7-autocompleter"><ul  >'
						+ item.value
						+ '</ul><ul  >'
						+ item.label + '</ul></ol></a>';
				return $("<li></li>").data("item.autocomplete", item)
						.append(inner_html).appendTo(ul);
			};*/
		});
	};


	jQuery.fn.BeneReceiverCountryAutoComplete = function() {
		return this.each(function() {
			$(this).autocomplete({
						source : function(request, response) {
							$.ajax({
										url : "services/userseek/country.json?",
										dataType : "json",
										type:'POST',
										data : {
											$top:10,
											$autofilter : request.term
										},
										success : function(data) {
											var rec = data.d.preferences;
											response($.map(rec, function(item) {
														return {
															label : item.DESCRIPTION,
															value : item.CODE
														}
													}));
										}
									});
						},
						minLength : 1,
						select : function(event, ui) {
								$('#beneCountry, #beneState')
									.val('');						
						}
					});/*.data("autocomplete")._renderItem = function(ul, item) {
				var inner_html = '<a><ol class="t7-autocompleter"><ul  >'
						+ item.value
						+ '</ul><ul  >'
						+ item.label + '</ul></ol></a>';
				return $("<li></li>").data("item.autocomplete", item)
						.append(inner_html).appendTo(ul);
			};*/
		});
	};
	

function reloadMyProducts(isPaymentTypeChanged) {
	
	if(ibanErrorFlag){
		$('#errorDiv').empty();
		$('#messageArea').empty();
		$('#messageArea').append('');
		$('#messageArea, #messageContentDiv').addClass('hidden');
	}
	var filterCode1 = $('#clientId').val();
	$.ajax({
		url : "services/beneClientPaymentPackageList.json",
		dataType : "json",
		type : "POST",
		data : {
			$top : -1,
			$clientCode : filterCode1,
			$payType : paymentTypeFlag,
			$anyIdType : $('#anyIdFlag').val(),
			$sellerCode : $('#sellerCode').val()
		},
		success : function(data) {
			var rec = data;
			var ibanValidationFlag = 'N';
			$('#myProduct')
					.empty()
					//.append('<option selected="selected" value="">Select</option>');
					$('#myProduct').append($('<option>', { 
								value: "",
								selected:"selected",
								text : getLabel('lbl.bankidtype.select','Select') 
							}));
			if (rec && rec.length > 0) {
				$.each(rec, function(index, cfg) {
							$('#myProduct').append($('<option>', {
										value : cfg.filterCode,
										text : cfg.filterValue,
										ibanflag : cfg.additionalValue2,
										adhocbankflag : cfg.additionalValue3
									}));
							if(myProductVal == cfg.filterCode && cfg.additionalValue2 === 'Y')
							{
								productIbanSelected = 'Y';
							}
							if(cfg.additionalValue2 === 'Y')
							{
								ibanValidationFlag = 'Y';
							}
						});
				if(rec[0] && rec[0].additionalValue1)
					$('#clientSellerCode').val(rec[0].additionalValue1);
			}
			$('#myProduct').val(myProductVal);
			if(myProductVal != null && myProductVal != "")
			{
				showHideIbanOption(productIbanSelected);
			}
			else
			{
				showHideIbanOption(ibanValidationFlag);
			}
			if("ADD"== pageMode ||"SAVE"== pageMode || "EDIT"== pageMode || "UPDATE"== pageMode || "SAVE_NEXT" == nextPageMode || "UPDATE_NEXT" == nextPageMode)
				makeNiceSelect('myProduct', false);
			if(paymentTypeFlag=='93' || paymentTypeFlag=='94'){
				if(isPaymentTypeChanged){
				 	$('#lblAccLabel').text("IBAN");
					$('#bankIdType').val("BIC");   
					$("#bankIdType").niceSelect("update");  
		            if(!isEmpty($('#myProduct').val()) ){
		                $('#beneAcctNmbr').removeAttr('disabled');                              
		            }else{
		                $('#beneAcctNmbr').attr('disabled','true');
		                $('#beneAcctNmbr').val("");
		            }
				}
	            /**/	            
	            var ibanFlag = $( "#myProduct option:selected" ).attr("ibanflag");  
	            var adhocBankFlag = $( "#myProduct option:selected" ).attr("adhocbankflag");    
	            
	            if(!isEmpty(ibanFlag)){
	                $('#clientIbanFlag').val(ibanFlag);
	                $('#adhocBankFlag').val(adhocBankFlag);
	                if(ibanFlag == 'Y'){
	            		var strbeneBranchDesc = '<c:out value="${model.beneBranchDesc}"/>';
	            		var strbankSearchText = '<c:out value="${model.bankSearchText}"/>';
	                    $('#beneAcctNmbr').removeAttr('disabled'); 
	                    $('#bankSearchText').attr('disabled','disabled');
	            		$('#beneBranchDesc').attr('disabled','disabled');
	                }           
	            }else{
	                $('#clientIbanFlag').val('');
	                $('#adhocBankFlag').val('');
	                $('#bankSearchText').removeAttr('disabled');
            		$('#beneBranchDesc').removeAttr('disabled');
            		$('#bankSearchText').val('');
             		$('#beneBranchDesc').val('');
	            }  
	            
			}
		}
	});
}
function checkInfoFoundForBankIDListener(bankIdTypeElement, infoNotFoundElement, infoType) {
    var isBankIDSelected = null;
    if(infoType == 'RECEIVER_BANK_ID'){
        isBankIDSelected = isReceiverBankIDSelected;
    }
    if(infoType == 'CORR_BANK_ID'){
        isBankIDSelected = isCorrBankIDSelected;
    }
    if(infoType == 'INT_BANK_ID'){
        isBankIDSelected = isIntBankIDSelected;
    }

    if(!isBankIDSelected){
        $('#bankSearchText').checkInfoFoundForBankID(infoType,bankIdTypeElement,infoNotFoundElement);
    }
}

jQuery.fn.checkInfoFoundForBankIDListener = function(bankIdTypeElement, infoNotFoundElement, infoType) {
	var isBankIDSelected = null;
	$(this).focusout(function() {
			if(infoType == 'RECEIVER_BANK_ID'){
				isBankIDSelected = isReceiverBankIDSelected;
			}
			if(infoType == 'CORR_BANK_ID'){
				isBankIDSelected = isCorrBankIDSelected;
			}
			if(infoType == 'INT_BANK_ID'){
				isBankIDSelected = isIntBankIDSelected;
			}

			if(!isBankIDSelected){
				$(this).checkInfoFoundForBankID(infoType,bankIdTypeElement,infoNotFoundElement);
			}
		 })
		  .blur(function() {
			if(!isBankIDSelected){
				//$('#bankSearchText').validateBankID();
			}
		  });

//		$(this).keydown(function(event) {
//			if(infoType == 'RECEIVER_BANK_ID'){
//				isReceiverBankIDSelected = false;
//			}
//			if(infoType == 'CORR_BANK_ID'){
//				isCorrBankIDSelected = false;
//			}
//			if(infoType == 'INT_BANK_ID'){
//				isIntBankIDSelected = false;
//			}
//		});
};

jQuery.fn.checkInfoFoundForBankID = function(infoType,bankIdTypeElement, infoMessageElement) {
	var textVal = this.val();
	if(textVal == '' || textVal == '%'){
		$('#messageArea').empty();
		$('#messageArea, #messageContentDiv').addClass('hidden');
		return;
	}
	$.ajax({
									url :"services/userseek/validateBeneEntryDrawerbank.json",
									dataType : "json",
									type:'POST',
									data : {
										$top:20,
										$filtercode1:(isEmpty($('#beneCountry').val())?$('#tempCountry').val():$('#beneCountry').val()),
										$filtercode2:$('#sellerCode').val(),
										$filtercode4 : textVal,
										$filtercode3 : ($('#'+bankIdTypeElement) == null || $('#'+bankIdTypeElement).val() == undefined)
														? 'BIC' : $('#'+bankIdTypeElement).val()
									},
									success : function(bankData) {
										var data = bankData.d.preferences[0];
										clearBankDetails(infoType);
										if(data == null || (data != null && data.length == 0)){
											$('#'+infoMessageElement).empty();
											$('#'+infoMessageElement).html(getWarningMessage());
											//var strPaymentType = $('#paymentType').val();
											//if(infoType == 'RECEIVER_BANK_ID' && strPaymentType!='03'){
											//	$('#receiverBranchName').addClass('required');
											//}
											if(infoType == 'CORR_BANK_ID'){
												$('#lblCorrBankBranchName').addClass('required');
											}
											else if(infoType == 'INT_BANK_ID'){
												$('#lblIntBankBranchName').addClass('required');
											}
										}
										else{
											if(infoType == 'RECEIVER_BANK_ID'){

													if (data) {
														$('#receiverBranchName').removeClass('required');
														$('#beneBankCode').attr("disabled","true");
														isReceiverBankIDSelected = true;
														if (!isEmpty(data.BANKCODE))
														{
															$('#bankSearchText').val(data.ROUTINGNUMBER);
															$('#beneBankCode').val(data.BANKCODE);
														}
														if (!isEmpty(data.BRANCHCODE))
															$('#beneBranchCode').val(data.BRANCHCODE);
														if (!isEmpty(data.ADDRESS))
															$('#beneAddress2').val(data.ADDRESS);
														if (!isEmpty(data.ADDRESS) && data.ADDRESS!= undefined)
														{
															$('#beneBankAddress').val(data.ADDRESS.substring(0,35));
															$('#beneBankAddress').attr('disabled','disabled');				
															$('#beneBankAddress').addClass("disabled");	
															$('#beneBankAddress2').val(data.ADDRESS.substring(35,70));
															$('#beneBankAddress2').attr('disabled','disabled');				
															$('#beneBankAddress2').addClass("disabled");
														}
														if (!isEmpty(data.COL1))
														{
															$('#beneBankAddress3').val(data.COL1);	
															$('#beneBankAddress3').attr('disabled','disabled');				
															$('#beneBankAddress3').addClass("disabled");
														}
														var strText = '';
														if (!isEmpty(data.BRANCHDESCRIPTION))
														$('#beneBranchDesc').val(data.BRANCHDESCRIPTION);
														if (!isEmpty(data.BANKDESCRIPTION))
														$('#beneBankDesc').val(data.BANKDESCRIPTION);
														if (!isEmpty(data.BANKDESCRIPTION))
															strText = data.BANKDESCRIPTION;
														if (!isEmpty(data.BRANCHDESCRIPTION))
															strText += ',&nbsp;' + data.BRANCHDESCRIPTION;
														if (!isEmpty(data.ROUTINGNUMBER))
															strText += ',&nbsp;' + data.ROUTINGNUMBER;
															$('#'+infoMessageElement).empty();
														$('#'+infoMessageElement).html(strText);
													}
											}
											else if(infoType == 'CORR_BANK_ID'){
													if (data) {
														$('#lblCorrBankBranchName').removeClass('required');
														$('#corrBankDetails1').attr("disabled","true");
														$('#corrBankDetails2').attr("disabled","true");
														if (!isEmpty(data.BANKCODE))
														{
															$('#corrBankSearchText').val(data.ROUTINGNUMBER);
															$('#corrBankDetails1').val(data.BANKCODE);
														}
														if (!isEmpty(data.BRANCHCODE))
															$('#corrBankDetails2').val(data.BRANCHCODE);
													}
											}
											else if(infoType == 'INT_BANK_ID'){
													if (data) {
														$('#lblIntBankBranchName').removeClass('required');
														$('#intBankDetails1').attr("disabled","true");
														$('#intBankDetails2').attr("disabled","true");
														if (!isEmpty(data.BANKCODE))
														{
															$('#interemBankSearchText').val(data.ROUTINGNUMBER);
															$('#intBankDetails1').val(data.BANKCODE);
														}
														if (!isEmpty(data.BRANCHCODE))
															$('#intBankDetails2').val(data.BRANCHCODE);
													}
											}
											// Populate other Information
										}
									}
								});

};

function clearBankDetails(infoType)
{
	if(infoType == 'RECEIVER_BANK_ID'){
		$('#beneBankCode').val('');
		$('#beneBranchCode').val('');
		$('#beneAddress2').val('');
		$('#beneBankCode').removeAttr("disabled");
		$('#beneBranchCode').removeAttr("disabled");
		$('#beneAddress2').removeAttr("disabled");
		$('#beneBranchDesc').val('');
		$('#beneBankDesc').val('');
		$('#beneBankAddress').val('');
		$('#beneBankAddress2').val('');
		$('#beneBankAddress3').val('');
	//	$('#bankIdNotFound').empty();
	}
	else if(infoType == 'CORR_BANK_ID'){
		$('#corrBankDetails1').val('');
		$('#corrBankDetails2').val('');
		$('#corrBankDetails1').removeAttr("disabled");
		$('#corrBankDetails2').removeAttr("disabled");
	}
	else if(infoType == 'INT_BANK_ID'){
		$('#intBankDetails1').val('');
		$('#intBankDetails2').val('');
		$('#intBankDetails1').removeAttr("disabled");
		$('#intBankDetails2').removeAttr("disabled");
	}
}

function paintErrors(arrError)
{
	$('#messageArea > ul').empty();
	$.each(arrError, function(index, error) {
					strMsg = !isEmpty(error.errorCode) ? error.errorCode : '';
					if (!isEmpty(strMsg))
						strMsg += ' : ';
					strMsg += error.errorMessage;
					element = $('<li>').text(strMsg);
					element.appendTo($('#messageArea > ul'));
		});
}

function validateAndPaintReceiverBankIDsErrors(){
	var arrError = new Array();

	doBankIDValidation($('#bankIdType').val(), $('#bankSearchText').val(), arrError, 'Receiver');
	//Following fields are not being used in current implementation hence commented.
	doBankIDValidation($('#corrBankIdType').val(), $('#corrBankBic').val(), arrError, 'Corrospondent');
	doBankIDValidation($('#interemBankIdType').val(), $('#intBankBic').val(), arrError, 'Intermediatory' );

	var element = null, strMsg = null, strTargetDivId = 'messageArea', strErrorCode = '';
	if (arrError && arrError.length > 0) {
		$('#' + strTargetDivId).empty();
		$.each(arrError, function(index, error) {
					strErrorCode = error.errorCode || error.code;
					strMsg = !isEmpty(strErrorCode) ? strErrorCode : '';
					if (!isEmpty(strMsg))
						strMsg += ' : ';
					strMsg += error.errorMessage;
					if (!isEmpty(strErrorCode)) {
						$('#errorDiv').empty();
						element = $('<p>').text(error.errorMessage);
						element.appendTo($('#' + strTargetDivId));
						$('#' + strTargetDivId + ', #messageContentDiv')
								.removeClass('hidden');
					}
				});

	} else {
		$('#messageArea').empty();
		$('#' + strTargetDivId + ', #messageContentDiv').addClass('hidden');
	}

	if(arrError.length > 0)
		return true;
	else
		return false;
}

function doBankIDValidation(bankIDType, bankId, arrError, field) {
	var maxLength, mapMaxLength = {
			'FED' : 9,
			'BIC' : 11,
			'ACH' : 6,
			'ACHA' : 9,
			'IBAN' : 34,
			'DEFAULT' : 35
		};
		maxLength = mapMaxLength[strBankIdType] || mapMaxLength['DEFAULT'];
	var strBankIdType = null;
	var strBankID = null;
	var strValidationFlag = null;
	strBankIdType = bankIDType;
	strBankID = bankId;
	if (true) {
		if (!isEmpty(strBankID)) {
			if (strBankID.length > (mapMaxLength[strBankIdType] || mapMaxLength['DEFAULT'])) {
				strValidationFlag = false;
				arrError.push({
							"errorCode" : field+" Bank ID",
							"errorMessage" : '"Bank ID" field length can not be greater than '+(mapMaxLength[strBankIdType] || mapMaxLength['DEFAULT'])
						});
			}
			else{
			switch (strBankIdType) {
				case 'FED' :
					strValidationFlag = isValidFedAba(strBankID);
					if (false === strValidationFlag)
						arrError.push({
							"errorCode" : field+" Bank ID",
							"errorMessage" : "ABA Routing number validation failed"
						});
					break;
				case 'BIC' :
					strValidationFlag = isValidBIC(strBankID);
					if (false === strValidationFlag)
						arrError.push({
							"errorCode" : field+" Bank ID",
							"errorMessage" : "BIC Routing number validation failed"
						});
					break;
				case 'ACH' :
					strValidationFlag = isValidCHIPSUID(strBankID);
					if (false === strValidationFlag)
						arrError.push({
							"errorCode" : field+" Bank ID",
							"errorMessage" : "CHIPS UID Routing number validation failed"
						});
					break;
				case 'ACHA' :
					strValidationFlag = isValidFedAba(strBankID);
					if (false === strValidationFlag)
						arrError.push({
							"errorCode" : field+" Bank ID",
							"errorMessage" : "FED ACH Routing number validation failed"
						});
					break;
				default :
					break;
			}
			}
		}

	}

}

function isValidBIC(strRelatedID) {
	if( strRelatedID != '%')
	{
	var bReturnCode = false;
	var iLength = strRelatedID.length;
	if ((iLength === 8) || (iLength === 11)) {
		for (var i = 0; i < iLength; i++) {
			var iDigit = strRelatedID.substr(i, 1);
			var alnumRegex = /^[0-9a-zA-Z]+$/;
			if (alnumRegex.test(iDigit)) {
				bReturnCode = true;
			} else {
				bReturnCode = false;
				break;
			}
		}
	}
	return (bReturnCode);
	}
	else
		return true;
}

function isValidCHIPSUID(strRelatedID) {
	var bReturnCode = false;
	var iLength = strRelatedID.length;
	if (iLength === 6) {
		for (var i = 0; i < iLength; i++) {
			var iDigit = parseInt(strRelatedID.substr(i, 1), 10);
			var intRegex = /^\d+$/;
			if (intRegex.test(iDigit)) {
				bReturnCode = true;
			} else {
				bReturnCode = false;
				break;
			}
		}

	}

	return (bReturnCode);

}
function isValidFedAba(strRelatedID) {
	var bReturnCode = true;
	var iAbaTotal = 0;
	var iAbaCheckDigit = 0;
	var rt9digit = new RegExp(/^\d{9}$/);
	if (strRelatedID.search(rt9digit) != -1) {
		var abaCheckDigit;

		var abaNumber = parseFloat(strRelatedID);
		abaCheckDigit = computeFedABACheckDigit(strRelatedID.substr(0, 8)) + "";
		if (bReturnCode == true) {
			if (strRelatedID.substr(8, 1) != abaCheckDigit) {
				bReturnCode = false;
			}
		}
	} else {
		bReturnCode = false;
	}

	return bReturnCode;
}

function computeFedABACheckDigit(strRelatedID) {
	var bReturnCode = true;
	var iAbaTotal = 0;
	var iAbaCheckDigit = 0;
	var abaCheckDigit = 0;

	for (var iAbaIndex = 0; iAbaIndex < 8 && bReturnCode == true; iAbaIndex++) {
		var iDigit = parseInt(strRelatedID.substr(iAbaIndex, 1), 10);

		switch (iAbaIndex % 3) {
			case 0 :
				iAbaTotal += iDigit * 3;
				break;
			case 1 :
				iAbaTotal += iDigit * 7;
				break;
			case 2 :
				iAbaTotal += iDigit * 1;
				break;
		}
	}

	iAbaCheckDigit = iAbaTotal % 10;

	if (iAbaCheckDigit != 0) {
		iAbaCheckDigit = 10 - iAbaCheckDigit;
	}
	return iAbaCheckDigit;
}

function getWarningMessage(){
	/* Need to Remove inline Styles */
	var warningMsgHtmlText='<span class="ux_info-icon floatLeft" style="float:left !important;padding:1px 0px 0px 0px !important;color:#F7442A !important">&nbsp;</span> <span style="color:#F7442A !important"> Information not found in library</span>';
	return warningMsgHtmlText;
}

function clearReceiverBankDetails(){
	persistBeneficiaryBankDetails();
	$('#bankSearchText').val('');
	$('#beneBankAddress').val('');
    $('#beneBankAddress2').val('');
    $('#beneBankAddress3').val('');
	isReceiverBankIDSelected = false;
	clearBankDetails('RECEIVER_BANK_ID');
}
// Used for Bene Branch Description
jQuery.fn.BankByNameAutoComplete = function() {

	return this.each(function() {
					$(this).autocomplete({
					source : function(request, response) {
						$.ajax({
									url :'services/userseek/beneBranchSeek.json',
									dataType : "json",
									type:'POST',
									data : {
										$top:autocompleterSize,
										$filtercode1:$('#clientSellerCode').val(),
										$autofilter : request.term,
										$filtercode2 : $('#bankIdType').val(),
										$filtercode3 : $('#paymentType').val() =='04' ? 'BOOK' : ''
									},
									success : function(data) {
										isReceiverBankIDSelected = false;
										var rec = data.d.preferences;
										response($.map(rec, function(item) {
													return {
														label : item.BRANCHDESCRIPTION,
														bankDesc : item.BANKDESCRIPTION,
														value : item.BRANCHDESCRIPTION,
														bankDtl : item
													}
												}));
										$('#beneBankAddress').val('');
										$('#beneBankAddress2').val('');
										$('#beneBankAddress3').val('');
										$('#bankSearchText').val('');
									}
								});
					},
					minLength : 1,
					select : function(event, ui) {
						var data = ui.item.bankDtl;
						var strText = '';
						if (data) {
							isReceiverBankIDSelected = true;
							if (!isEmpty(data.BANKCODE))
							{
								$('#beneBankCode').val(data.BANKCODE);
							}
							if (!isEmpty(data.BANKDESCRIPTION))
							{
								$('#beneBankDesc').val(data.BANKDESCRIPTION);
							}
							if (!isEmpty(data.BRANCHCODE))
								$('#beneBranchCode').val(data.BRANCHCODE);
							if (!isEmpty(data.BRANCHDESCRIPTION))
								$('#beneBranchDesc').val(data.BRANCHDESCRIPTION);
							/*if (!isEmpty(data.ADDRESS))
								$('#beneAddress2').val(data.ADDRESS);	*/
							//checkBankIDTypes($('#bankIdType').val(), data);
							
							if (data.ADDRESS != undefined && !isEmpty(data.ADDRESS)) {
								$('#beneBankAddress').val(data.ADDRESS.substring(0,35));
								$('#beneBankAddress').attr('disabled','disabled');				
								$('#beneBankAddress').addClass("disabled");	
								$('#beneBankAddress2').val(data.ADDRESS.substring(35,70));
								$('#beneBankAddress2').attr('disabled','disabled');				
								$('#beneBankAddress2').addClass("disabled");
							}
							if (data.COL1 != undefined && !isEmpty(data.COL1)) {
								$('#beneBankAddress3').val(data.COL1);	
								$('#beneBankAddress3').attr('disabled','disabled');				
								$('#beneBankAddress3').addClass("disabled");
							}
							
							$('#beneficiaryIDNumber').val($('#bankSearchText').val());

							if (!isEmpty(data.ROUTINGNUMBER))
								$('#bankSearchText').val(data.ROUTINGNUMBER);
							if (!isEmpty(data.BIC))
								$('#beneBankBic').val(data.BIC);
							setDefaultBeneCountry();
							}
						resetBeneficiaryBankDetails();
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
			var inner_html = '<a><ol class="t7-autocompleter"><ul  >'
					+ item.label
					+ '</ul><ul  >'
					+ item.bankDesc + '</ul></ol></a>';
			return $("<li></li>").data("item.autocomplete", item)
					.append(inner_html).appendTo(ul).attr('title',item.label+' '+item.bankDesc );
		};*/
	});
};

function checkBankIDTypes(bankIdSelected, data) {
	if ('BIC' === bankIdSelected) {
		$('#bankSearchText').val(data.BIC);
	}
	if ('CHIPS' === bankIdSelected) {
		$('#bankSearchText').val(data.CHIPS);
	}
	if ('FED' === bankIdSelected) {
		$('#bankSearchText').val(data.FEDABA);
	}
	if ('NCC' === bankIdSelected) {
		$('#bankSearchText').val(data.NCC);
	}
	if ('SORT' === bankIdSelected) {
		$('#bankSearchText').val(data.SORT);
	}
}

function  getBankIDTypeList(objPayType,isPaymentTypeChanged) {
	var strPayType;
	if(null!=objPayType)
	{
		strPayType = objPayType;
	}
	else
	{
		strPayType = $('#paymentType').val();
	}

	$.ajax({
		url : "services/beneBankIDTypeList.json",
		type: "POST",
		data:{
			$sellerCode:$('#sellerCode').val(),
			$anyIdFlag : $('#anyIdFlag').val(),
			$payType:strPayType,
			$clientCode:$('#clientId').val(),
			$payPackage: !isPaymentTypeChanged ? $('#myProduct').val() : ''
		},
		dataType : "json",
		success : function(data) {
			if ($('#anyIdFlag').val() == "Y") {
				populateAnyIdTypeList(data);
			}
			else {
				populateBankIDTypeList(strPayType,data);
			}
		}
	});
	if(!isPaymentTypeChanged && $('#paymentType').val() === '93' || $('#paymentType').val() === '94'){
		var ibanFlag = $( "#myProduct option:selected" ).attr("ibanflag");	
		var adhocBankFlag = $( "#myProduct option:selected" ).attr("adhocbankflag");	
		$('#bankIdType').val("BIC");   
		$("#bankIdType").niceSelect("update");      
		if(!isEmpty(ibanFlag)){
			$('#clientIbanFlag').val(ibanFlag);
			$('#adhocBankFlag').val(adhocBankFlag);
			if(ibanFlag == 'Y'){
				$('#beneAcctNmbr').removeAttr('disabled');
				$('#bankSearchText').attr('disabled','disabled');
         		$('#beneBranchDesc').attr('disabled','disabled');
			}else{
				$('#bankSearchText').removeAttr('disabled');
				$('#beneBranchDesc').removeAttr('disabled');         		
         		$('#bankSearchText').val('');
         		$('#beneBranchDesc').val('');
			}			
		}
	}else{
		 $('#clientIbanFlag').val('');
         $('#adhocBankFlag').val('');
         $('#bankSearchText').removeAttr('disabled');
 		 $('#beneBranchDesc').removeAttr('disabled');
 		 $('#bankSearchText').val('');
  		 $('#beneBranchDesc').val('');
	}	
};

function populateBankIDTypeList(strPayType,data) {

	var sBankIdType = $('#bankIdType').val();
	var isSelectedVal = false;
	var rec = data;
	$('#bankIdType')
	.empty()
	//.append('<option value="">Select</option>');
								$('#bankIdType').append($('<option>', { 
								value: "",
								selected:"selected",
								text : getLabel('lbl.bankidtype.select','Select') 
							}));
	if(rec && rec.length > 0){
		$.each(rec, function(index, cfg) {
			if(rec.length==1)
			{
				var opt = $('<option />', {
							value : cfg.filterCode,
							text : getLabel('lbl.bankidtype.'+cfg.filterCode,cfg.filterValue)
						});
				opt.attr('selected', 'selected');
				opt.appendTo($('#bankIdType'));
				if(strPayType=="01" || strPayType=="02" || strPayType=="07" || strPayType=="30")
				{
					$('#bankIdType').val("");
					$("#bankIdType").niceSelect("update");
					$('#bankIdSpanText').addClass('hidden');
					$('#bankIdSpanText').text("");
				}
				else
				{
					$('#spBankIdType').hide();
					$('#bankIdSpanText').removeClass('hidden');
					$('#bankIdSpanText').text(cfg.filterValue);
					$('#bankIdType').val(cfg.filterCode);
					$('#bankIdType').hide();
					$('#bankIdType-niceSelect').hide();
				}
			}
			else
			{
				$('#bankIdSpanText').addClass('hidden');
				$('#bankIdSpanText').text("");
				$('#bankIdType').append($('<option>', {
					value: cfg.filterCode,
					text : cfg.filterValue
				}));
				if(cfg.filterCode === sBankIdType )
					isSelectedVal = true;
				$('#bankIdType').niceSelect();
				$('#bankIdType').niceSelect('update');
				$('#bankIdType-niceSelect').show();
				$('#bankIdType-niceSelect').bind('blur', function () { markRequired(this);});
				$('#bankIdType-niceSelect').bind('focus', function () { removeMarkRequired(this);});
			}
		});
		if(isSelectedVal){
			 $('#bankIdType').val(sBankIdType);
			 $('#bankIdType').niceSelect('update');
		}
		var strPaymentType = $('#paymentType').val();
		if (strPaymentType == '04' && !isEmpty($('#bankIdType').val()))
			setBeneficiaryBankDetailsForBookTransfer();
		addMandatory();
	}
	else
	{
		$('#bankIdType').niceSelect('update');
		$('#bankIdSpanText').addClass('hidden');
		$('#bankIdSpanText').text("");
	}
	//if BankId is same as of previous Payment Type/ Payment Package selection
	verifyAndRestoreBeneBankDetails();
	//$('#bankIdType').val(bankIdTypeVal);
	if (strPaymentType == '62')
		$('#bankIdType').val('FED');

}

function hideshowLines(objDivClass,flagshow,selectedRadioTagNo)
{
	if(flagshow=='A')
	{
		$('.'+objDivClass).hide();
		$('.'+objDivClass+"57A").show();
		if(objDivClass=='corrLines')
			$('#corrBankNostroAccDiv').removeClass("col-sm-offset-1");
		if(objDivClass=='intLines')
			$('#intBankNostroAccDiv').removeClass("col-sm-offset-1");
		$('#radioTag'+selectedRadioTagNo+'A').attr('checked',true);
	}
	else
	{
		$('.'+objDivClass).show();
		$('.'+objDivClass+"57A").hide();
		if(objDivClass=='corrLines')
			$('#corrBankNostroAccDiv,').addClass("col-sm-offset-1");
		if(objDivClass=='intLines')
			$('#intBankNostroAccDiv').addClass("col-sm-offset-1");
		$('#radioTag'+selectedRadioTagNo+'D').attr('checked',true);
	}
}

function getCollapsibleStatusFromPmtType(objPayType) {
	var strPayType;
	var showLink=false;
	if (null != objPayType) {
		strPayType = objPayType;
	} else {
		strPayType = $('#paymentType').val();
	}
	$.ajax({
				url : "services/collapsibleStatusFromPmtType.json",
				type : "POST",
				dataType : "json",
				data : {
					$sellerCode : $('#sellerCode').val(),
					$payType : strPayType
				},
				success : function(data) {
					//clearBankDetails('RECEIVER_BANK_ID');
					if (data && data.length > 0) {
						$('#etiDiv').removeClass("ui-helper-hidden ");
						if (data[0].BENE_FI_DETAILS == 'Y') {
							$('#divAccountWithInstitution').show();
							showLink=true;
						} else {
							$('#divAccountWithInstitution').hide();
						}
						if (data[0].INTERMEDIARY_BANK_DETAILS == 'Y') {
							$('#intrDetailsDivparent').show();
							
							if(data[1].INTERMEDIARY_BANK_NOSTRO_ACC == 1)
							{
								$('#intBankNostroAccDiv').hide();
							}
							else
							{
								$('#intBankNostroAccDiv').show();
							}
							showLink=true;
						} else {
							$('#intrDetailsDivparent').hide();
						}
						if (data[0].RECEIVER_CORRESPONDENT_DETAILS == 'Y') {
							$('#recCorrDetailsDivparent').show();
							if(data[1].CORR_BANK_NOSTRO_ACC == 1)
							{
								$('#corrBankNostroAccDiv').hide();
							}
							else
							{
								$('#corrBankNostroAccDiv').show();
							}
							showLink=true;
						} else {
							$('#recCorrDetailsDivparent').hide();
						}
						if (strPayType == '01') {
							$('#txnSetupDetailsLinkParentDiv').show();
							showLink=true;
						} else {
							$('#txnSetupDetailsLinkParentDiv').hide();
						}
						if (paymentTypeFlag === '62') {
							$('#achReceiverId').show();
						//	$("#lblAchRecId").addClass("required");
						} else {
							$('#achRecId').val('');
						//	$("#lblAchRecId").removeClass("required");
							$('#achReceiverId').hide();
						}
						if(showLink)
							$('#reciverdtlshowhide').show();
						else
							$('#reciverdtlshowhide').hide();
						$('#reciverdtlshowhide')
								.text(hideReceiverDetails);
					} else {
						$('#reciverdtlshowhide').hide();
						$('#divAccountWithInstitution').hide();
						$('#intrDetailsDivparent').hide();
						$('#recCorrDetailsDivparent').hide();
						$('#txnSetupDetailsLinkParentDiv').hide();

					}

					if ($('#etiDiv').hasClass('ui-helper-hidden')) {
						$('#reciverdtlshowhide')
								.text(' '+showReceiverDetails+' ');
					} else {
						$('#reciverdtlshowhide')
								.text(' '+hideReceiverDetails+' ');
					}
				}
			});
}

function hideShowOnMoreClick(){
	$('#etiDiv').toggleClass("ui-helper-hidden ");
	$("#reciverdtlshowhide").toggleClass("fa-caret-up fa-caret-down");
	if($('#etiDiv').hasClass('ui-helper-hidden')){
		$('#reciverdtlshowhide').text(' '+showReceiverDetails+' ');
	}
	else{
		$('#reciverdtlshowhide').text(' '+hideReceiverDetails+' ');
	}
}
/* Receiver Changes starts here for Line 1 field to be displayed as free-text*/
function setTagFieldRelatedDependencies() {
	var chrTag54TypeVal = $('input[name="tag54aFlag"]:radio:checked').val();
	var chrTag57TypeVal = $('input[name="tag57aFlag"]:radio:checked').val();
	var chrTag56TypeVal = $('input[name="tag56aFlag"]:radio:checked').val();

	if (chrTag54TypeVal) {
		if (chrTag54TypeVal == 'A')
			$('#corrBankDetails1').val($('#corrBankDetails1Tag57A').val());
		if (chrTag54TypeVal == 'D')
			$('#corrBankDetails1').val($('#corrBankDetails1Tag57D').val());
	}

	if (chrTag57TypeVal) {
		if (chrTag57TypeVal == 'A')
			$('#tag57aLine1').val($('#tag57aLine1Tag57A').val());
		if (chrTag57TypeVal == 'D')
			$('#tag57aLine1').val($('#tag57aLine1Tag57D').val());
	}

	if (chrTag56TypeVal) {
		if (chrTag56TypeVal == 'A')
			$('#intBankDetails1').val($('#intBankDetails1Tag57A').val());
		if (chrTag56TypeVal == 'D')
			$('#intBankDetails1').val($('#intBankDetails1Tag57D').val());
	}
}
function setTagFieldRelatedDependenciesForEdit()
{
	var chrTag54TypeVal = $('input[name="tag54aFlag"]:radio:checked').val();
	var chrTag57TypeVal = $('input[name="tag57aFlag"]:radio:checked').val();
	var chrTag56TypeVal = $('input[name="tag56aFlag"]:radio:checked').val();

	if (chrTag54TypeVal) {
		if (chrTag54TypeVal == 'A')
			$('#corrBankDetails1Tag57A').val($('#corrBankDetails1').val());
		if (chrTag54TypeVal == 'D')
			$('#corrBankDetails1Tag57D').val($('#corrBankDetails1').val());
	}

	if (chrTag57TypeVal) {
		if (chrTag57TypeVal == 'A')
			$('#tag57aLine1Tag57A').val($('#tag57aLine1').val());
		if (chrTag57TypeVal == 'D')
			$('#tag57aLine1Tag57D').val($('#tag57aLine1').val());
	}

	if (chrTag56TypeVal) {
		if (chrTag56TypeVal == 'A')
			$('#intBankDetails1Tag57A').val($('#intBankDetails1').val());
		if (chrTag56TypeVal == 'D')
			$('#intBankDetails1Tag57D').val($('#intBankDetails1').val());
	}
}
function setTagFieldRelatedDependenciesForView()
{
	var chrTag54TypeVal = $('input[name="tag54aFlag"]:radio:checked').val();
	var chrTag57TypeVal = $('input[name="tag57aFlag"]:radio:checked').val();
	var chrTag56TypeVal = $('input[name="tag56aFlag"]:radio:checked').val();

	if (chrTag54TypeVal) {
		if (chrTag54TypeVal == 'A')
			$('#corrBankDetails1Tag57A').val($('#corrBankDetails1').val());
		if (chrTag54TypeVal == 'D')
			$('#corrBankDetails1Tag57D').val($('#corrBankDetails1').val());
	}

	if (chrTag57TypeVal) {
		if (chrTag57TypeVal == 'A')
			$('#tag57aLine1Tag57A').val($('#tag57aLine1').val());
		if (chrTag57TypeVal == 'D')
			$('#tag57aLine1Tag57D').val($('#tag57aLine1').val());
	}

	if (chrTag56TypeVal) {
		if (chrTag56TypeVal == 'A')
			$('#intBankDetails1Tag57A').val($('#intBankDetails1').val());
		if (chrTag56TypeVal == 'D')
			$('#intBankDetails1Tag57D').val($('#intBankDetails1').val());
	}
}
/* Receiver Changes starts here for Line 1 field to be displayed as free-text*/

function populateCategoryDependentFieldPopulation() {
	var strPaymentType = $('#paymentType').val();
	if (strPaymentType == '04' && !isEmpty($('#bankIdType').val()))
		setBeneficiaryBankDetailsForBookTransfer();
	if(strPaymentType== '62')
		setCurrency(defaultSeller);
	setMandatoryFields(strPaymentType);
	setDefaultBeneCountry();
}
function setDefaultBeneCountry() {
	var strPaymentType = $('#paymentType').val();
	if(strPaymentType!='03' && isEmpty($('#beneCountry').val())){
		$('#beneCountry').val($('#tempCountry').val());
	}
}
function setBeneficiaryBankDetailsForBookTransfer() {
	$.ajax({
				url : "services/userseek/beneBranchSeek.json",
				dataType : "json",
				type : 'POST',
				data : {
					$top:autocompleterSize,
					$autofilter : '%',
					$filtercode1 : $('#sellerCode').val(),
					$filtercode2 : $('#bankIdType').val(),
					$filtercode3 : $('#paymentType').val() =='04' ? 'BOOK' : ''
				},
				success : function(response) {
					var data = response.d.preferences;
					if (data && data.length == 1) {
						var objBankDetails = data[0];
						if (!isEmpty(objBankDetails.BANKCODE)) {
							$('#beneBankCode').val(objBankDetails.BANKCODE);
						}
						if (!isEmpty(objBankDetails.BANKDESCRIPTION)) {
							$('#beneBankDesc').val(objBankDetails.BANKDESCRIPTION);
						}
						if (!isEmpty(objBankDetails.BRANCHCODE))
							$('#beneBranchCode').val(objBankDetails.BRANCHCODE);
						if (!isEmpty(objBankDetails.BRANCHDESCRIPTION))
							$('#beneBranchDesc').val(objBankDetails.BRANCHDESCRIPTION);
						if (!isEmpty(objBankDetails.ADDRESS))
							$('#beneAddress2').val(objBankDetails.ADDRESS);
						//checkBankIDTypes($('#bankIdType').val(), data);
						$('#beneficiaryIDNumber').val($('#bankSearchText')
								.val());

						if (!isEmpty(objBankDetails.ROUTINGNUMBER))
						$('#bankSearchText').val(objBankDetails.ROUTINGNUMBER);
						if (!isEmpty(data.BIC))
						$('#beneBankBic').val(data.BIC);
						if (isEmpty($('#beneCountry')))
							$('#beneCountry').val($('#tempCountry').val());
						isReceiverBankIDSelected=true;
				}
				}
			});
}
function setMandatoryFields(strPaymentType) {
	// EFT
	var strPaymentType = $('#paymentType').val();
}
//Requirement received under FTMNTBANK-1188
function setDefaultAccountType(){
	$('#beneAccountType').val('1');	
}
/**
 * Persist all beneficiary bank details to be restored if Bank Id Type for new
 * Payment Type / Payment Package selection is same
 */
function persistBeneficiaryBankDetails() {
	objOldBeneDetails['bankIdType'] = $('#bankIdType').val();
	objOldBeneDetails['beneBankCode'] = $('#beneBankCode').val();
	objOldBeneDetails['beneBranchCode'] = $('#beneBranchCode').val();
	objOldBeneDetails['beneAddress2'] = $('#beneAddress2').val();
	objOldBeneDetails['beneBranchDesc'] = $('#beneBranchDesc').val();
	objOldBeneDetails['beneBankDesc'] = $('#beneBankDesc').val();
	objOldBeneDetails['bankSearchText'] = $('#bankSearchText').val();
	objOldBeneDetails['isReceiverBankIDSelected'] = isReceiverBankIDSelected;
}
/**
 * verify if previously selected bankId and current value is same on PaymentType / PaymentPackage change, Restore data if same.
 */
function verifyAndRestoreBeneBankDetails() {
	if (!isEmpty(objOldBeneDetails)
			&& !isEmpty(objOldBeneDetails['bankIdType'])
			&& !isEmpty($('#bankIdType').val())
			&& objOldBeneDetails['bankIdType'] == $('#bankIdType').val()) {
		restoreBeneficiaryBankDetails();
	}
}
function restoreBeneficiaryBankDetails() {
	$('#bankIdType').val(objOldBeneDetails['bankIdType']);
	$('#beneBankCode').val(objOldBeneDetails['beneBankCode']);
	$('#beneBranchCode').val(objOldBeneDetails['beneBranchCode']);
	$('#beneAddress2').val(objOldBeneDetails['beneAddress2']);
	$('#beneBranchDesc').val(objOldBeneDetails['beneBranchDesc']);
	$('#beneBankDesc').val(objOldBeneDetails['beneBankDesc']);
    $('#bankSearchText').val(objOldBeneDetails['bankSearchText']);
	isReceiverBankIDSelected = objOldBeneDetails['isReceiverBankIDSelected'];
}
function resetBeneficiaryBankDetails() {
	objOldBeneDetails = {};
}

function onClientChange(){
	var client = clientInfo[$('#clientId').val()];
    $('#sellerCode').val(client && client.sellerCode ? client.sellerCode : '');
	$('#beneAccountCcy').val(client && client.ccyCode ? client.ccyCode : '');
	$.ajax({
		url : "services/beneClientSellerList.json",
		dataType : "json",
		type : "POST",
		data : {
			$sellerCode : $('#sellerCode').val()
		},
	success : function(data) {
								var rec = data;
								if (rec != null) {
									allowLimit = data.ALLOWRECLIMIT;
									multiAcc = data.BENE_MULTI_ACCT;
									limitModeHideUnHide();
								}
							}
						});
	paymentTypeVal='';
	$('#paymentType').val(paymentTypeVal);
    if("ADD"== pageMode ||"SAVE"== pageMode || "EDIT"== pageMode || "UPDATE"== pageMode || "SAVE_NEXT" == nextPageMode || "UPDATE_NEXT" == nextPageMode)
    	$('#paymentType').niceSelect('update');
    reloadPaymentTypes();
    reloadMyProducts();
    showHideAnyIDPayment('N');
    showHideAnyIdPaymentFlag('N','');
    if ($('#clientId').val()) {
        checkAnyIDPaymentAllowed();
    }
    readonlyFields = false;
	showHideBeneAccValidationFields();
}

jQuery.fn.DeliveryModeAutoComplete = function() {
	return this.each(function() {
		$(this).autocomplete({
			source : function(request, response) {
				$.ajax({
							url : "services/userseek/deliveryMode.json",
							type : 'POST',
							dataType : "json",
							data : {
								//$top : 20,
								$autofilter : request.term,
								$filtercode1 : $('#deliveryModeId').val()
							},
							success : function(data) {
								var rec = data.d.preferences;
								if (rec.length > 0) {
									response($.map(rec, function(item) {
												return {
													label : item.DESCR,
													modeDtl : item
												}
											}));
								}
							}
						});
			},
			minLength : 1,
			select : function(event, ui) {
				var data = ui.item.modeDtl;
				if (data) {
					if (!isEmpty(data.DESCR))
					{
						$('#deliveryModeId').val(data.DESCR);
						$('#deliveryModePath').val(data.CODE);
					}
				}
			},
			change : function(event, ui){
				var val=ui.item;
				if(val===null)
				{
				$('#deliveryModeId').val('');
				$('#deliveryModePath').val('');
				}
			},
			open : function() {
				/*
				 * $(this).removeClass("ui-corner-all")
				 * .addClass("ui-corner-top");
				 */
			},
			close : function() {
				/*
				 * $(this).removeClass("ui-corner-top")
				 * .addClass("ui-corner-all");
				 */
			}
		});/*.data("autocomplete")._renderItem = function(ul, item) {
			var inner_html = '<a><ol class="xn-autocompleter"><ul style="width:200px;">'
				+ item.label + '</ul></ol></a>';
		return $("<li></li>").data("item.autocomplete", item)
				.append(inner_html).appendTo(ul);
		};*/
	});
};

jQuery.fn.DocumentTypeAutoComplete = function() {
	return this.each(function() {
		$(this).autocomplete({
			source : function(request, response) {
				if(request.term.length >= jQAutoCompleterLength || request.term == '%')
				{
					$.ajax({
							url : "services/userseek/documentType.json",
							type : 'POST',
							dataType : "json",
							data : {
								//$top : 20,
								$autofilter : request.term,
								$filtercode1 : $('#docTypeId').val()
							},
							success : function(data) {
								var rec = data.d.preferences;
								if (rec.length > 0) {
									response($.map(rec, function(item) {
												return {
													label : item.DESCR,
													modeDtl : item
												}
											}));
								}
							}
						});
				}
			},
			minLength : 1,
			select : function(event, ui) {
				var data = ui.item.modeDtl;
				if (data) {
					if (!isEmpty(data.DESCR))
					{
						$('#docTypeId').val(data.DESCR);
						$('#docTypePath').val(data.CODE);
					}
				}
			},
			change : function(event, ui){
				var val=ui.item;
				if(val===null)
				{
				$('#docTypeId').val('');
				$('#docTypePath').val('');
				$('#documentId').val('');
				$('#divDocumentId').hide();
				}
			},
			open : function() {
				/*
				 * $(this).removeClass("ui-corner-all")
				 * .addClass("ui-corner-top");
				 */
			},
			close : function() {
				/*
				 * $(this).removeClass("ui-corner-top")
				 * .addClass("ui-corner-all");
				 */
			}
		});/*.data("autocomplete")._renderItem = function(ul, item) {
			var inner_html = '<a><ol class="xn-autocompleter"><ul style="width:200px;">'
				+ item.label + '</ul></ol></a>';
		return $("<li></li>").data("item.autocomplete", item)
				.append(inner_html).appendTo(ul);
		};*/
	});
};

jQuery.fn.PayLocAutoComplete = function() {
	return this.each(function() {
		$(this).autocomplete({
			source : function(request, response) {
				if(request.term.length >= jQAutoCompleterLength || request.term == '%')
				{
					$.ajax({
						url : "services/userseek/payLocation.json",
						type : 'POST',
						dataType : "json",
						data : {
							//$top : 20,
							$autofilter : request.term,
							$filtercode1 : $('#clientId').val(),
							$filtercode2 : $('#sellerCode').val()
						},
						success : function(data) {
							var rec = data.d.preferences;
							if (rec.length > 0) {
								response($.map(rec, function(item) {
											return {
												label : item.DESCRIPTION,
												modeDtl : item
											}
										}));
							}
						}
					});
				}
			},
			minLength : 1,
			select : function(event, ui) {
				var data = ui.item.modeDtl;
				if (data) {
					if (!isEmpty(data.DESCRIPTION))
					{
						$('#beneDefaultPayLocDesc').val(data.DESCRIPTION);
						$('#beneDefaultPayLoc').val(data.CODE);
					}
				}
			},
			change : function(event, ui){
				var val=ui.item;
				if(val===null){
				$('#beneDefaultPayLocDesc').val('');
				$('#beneDefaultPayLoc').val('');
				}
			},
			open : function() {
				/*
				 * $(this).removeClass("ui-corner-all")
				 * .addClass("ui-corner-top");
				 */
			},
			close : function() {
				/*
				 * $(this).removeClass("ui-corner-top")
				 * .addClass("ui-corner-all");
				 */
			}
		});/*.data("autocomplete")._renderItem = function(ul, item) {
			var inner_html = '<a><ol class="xn-autocompleter"><ul style="width:200px;">'
				+ item.label + '</ul></ol></a>';
		return $("<li></li>").data("item.autocomplete", item)
				.append(inner_html).appendTo(ul);
		};*/
	});
};

jQuery.fn.PickUpBranchAutoComplete = function() {
	return this.each(function() {
		$(this).autocomplete({
			source : function(request, response) {
				if(request.term.length >= jQAutoCompleterLength || request.term == '%')
				{
					$.ajax({
						url : "services/userseek/pickUpBranch.json",
						type : 'POST',
						dataType : "json",
						data : {
							//$top : 20,
							$autofilter : request.term
						},
						success : function(data) {
							var rec = data.d.preferences;
							if (rec.length > 0) {
								response($.map(rec, function(item) {
											return {
												label : item.DESCRIPTION,
												modeDtl : item
											}
										}));
							}
						}
					});
				}
			},
			minLength : 1,
			select : function(event, ui) {
				var data = ui.item.modeDtl;
				if (data) {
					if (!isEmpty(data.DESCRIPTION))
					{
						$('#beneDefaultPickupBrnDesc').val(data.DESCRIPTION);
						$('#beneDefaultPickupBrn').val(data.CODE);
					}
				}
			},
			change : function(event, ui){
				var val=ui.item;
				if(val===null){
				$('#beneDefaultPickupBrnDesc').val('');
				$('#beneDefaultPickupBrn').val('');
				}
			},
			open : function() {
				/*
				 * $(this).removeClass("ui-corner-all")
				 * .addClass("ui-corner-top");
				 */
			},
			close : function() {
				/*
				 * $(this).removeClass("ui-corner-top")
				 * .addClass("ui-corner-all");
				 */
			}
		});/*.data("autocomplete")._renderItem = function(ul, item) {
			var inner_html = '<a><ol class="xn-autocompleter"><ul style="width:200px;">'
				+ item.label + '</ul></ol></a>';
		return $("<li></li>").data("item.autocomplete", item)
				.append(inner_html).appendTo(ul);
		};*/
	});
};
function clearValues()
{
	//$('#deliveryModePath').val($('#deliveryModeId').val());
	//$('#beneDefaultPickupBrn').val($('#beneDefaultPickupBrnDesc').val());
	//$('#beneDefaultPayLoc').val('');

}
function populateSystemBank()
{

    var urlDrawerBank = "services/userseek/beneEntryDrawerbank.json";
    $.ajax({
            url : urlDrawerBank,
            dataType : "json",
            data : {
				$top : 20,
				$filtercode1 : $('#clientSellerCode').val(),
				//$autofilter : request.term,
				$filtercode2 : $('#bankIdType').val()
						? $('#bankIdType').val() :'BIC',
				$filtercode3 : !isEmpty($('#bankIdType').val()) && $('#mySelectList > option').length ===1 && $('#paymentType').val() =='04' ? 'BOOK' : ''
            },
            success : function(data) {
				//isReceiverBankIDSelected = false;
				var rec = data.d.preferences;
				if (rec && rec.length == 1) {
					
					if (!isEmpty(rec[0].BANKCODE)) {
						isReceiverBankIDSelected = true;
						$('#beneBankCode').val(rec[0].BANKCODE);
						$('#beneBankDesc').val(rec[0].BANKDESCRIPTION);
					}
					if(!isEmpty(rec[0].ROUTINGNUMBER)){
						$('#bankId').val(rec[0].ROUTINGNUMBER);
						$('#bankSearchText').val(rec[0].ROUTINGNUMBER);
					}	
					if (!isEmpty(rec[0].BRANCHCODE))
						$('#beneBranchCode').val(rec[0].BRANCHCODE);
					if (!isEmpty(rec[0].BRANCHDESCRIPTION))
						$('#beneBranchDesc').val(rec[0].BRANCHDESCRIPTION);
					if (!isEmpty(rec[0].ADDRESS) && rec[0].ADDRESS!= undefined)
					{
						$('#beneBankAddress').val(rec[0].ADDRESS.substring(0,35));
						$('#beneBankAddress').attr('disabled','disabled');				
						$('#beneBankAddress').addClass("disabled");	
						$('#beneBankAddress2').val(rec[0].ADDRESS.substring(35,70));
						$('#beneBankAddress2').attr('disabled','disabled');				
						$('#beneBankAddress2').addClass("disabled");
					}
					if (!isEmpty(rec[0].COL1))
					{
						$('#beneBankAddress3').val(rec[0].COL1);	
						$('#beneBankAddress3').attr('disabled','disabled');				
						$('#beneBankAddress3').addClass("disabled");
					}
					$('#beneficiaryIDNumber').val($('#bankSearchText').val());
					if (!isEmpty(rec[0].BIC))
						$('#beneBankBic').val(rec[0].BIC);
					
				}
            }
        });
}

 function resetBankDetails()
  {
	  if(isEmpty($('#bankSearchText').val()))
	  {
		  	$('#beneBankCode').val("");
		  	$('#beneBankDesc').val("");
		  	$('#beneBranchCode').val("");
		  	$('#beneBranchDesc').val("");
		  	$('#beneBankAddress').val("");
			$('#beneBankAddress2').val("");
			$('#beneBankAddress3').val("");
	 } 
	  
	  if( isEmpty($('#beneBranchDesc').val()) )
		 {
		  	$('#bankSearchText').val("");
		  	$('#beneBankCode').val("");
		  	$('#beneBankDesc').val("");
		  	$('#beneBranchCode').val("");
		  	$('#beneBranchDesc').val("");
		  	$('#beneBankAddress').val("");
			$('#beneBankAddress2').val("");
			$('#beneBankAddress3').val("");
					  
		 }
  }
 
function resetCorrBankDetails()
{
	if(isEmpty($('#corrBankSearchText').val()))
	 {
	  	$('#corrBankDetails1').val("");
	  	$('#corrBankDetails2').val("");
	  	$('#corrBankDetails3').val("");
	  	$('#corrBankDetails4').val("");
	 }
	 if( isEmpty($('#corrBankDetails1').val()))
	 {
		 $('#corrBankSearchText').val("");
		 $('#corrBankDetails2').val("");
		 $('#corrBankDetails3').val("");
		 $('#corrBankDetails4').val("");
	 }
}

function resetIntBankDetails()
{
	if(isEmpty($('#interemBankSearchText').val()))
	 {
	  	$('#intBankDetails1').val("");
	  	$('#intBankDetails2').val("");
	  	$('#intBankDetails3').val("");
	  	$('#intBankDetails4').val("");
	 }
	 if( isEmpty($('#intBankDetails1').val()))
	 {
		$('#interemBankSearchText').val("");
		$('#intBankDetails2').val("");
	  	$('#intBankDetails3').val("");
	  	$('#intBankDetails4').val("");
	 }
}

function populateIbanDetails() {	
	if($('#clientIbanFlag').val() == 'Y' && !isEmpty($('#beneAcctNmbr').val())){
		 $('#errorDiv').empty();
		 $('#messageArea').empty();	
		 $('#messageArea, #messageContentDiv').addClass('hidden');
		 $.ajax({
			 url : './services/receiver/ibandetails/'+$("#beneAcctNmbr").val()+'.json',
			data : {
				"sellerId": $('#sellerCode').val()
			},
			method : 'GET',
			success : function(responseData) {
				var isError =  false;
				var errorMsg = "";
				if(responseData.systemAllowValidate)
				{
					$('#bankSearchText').attr('disabled', 'disabled');
					$('#beneBranchDesc').attr('disabled', 'disabled');
					if(responseData.valid){
						var bicNumber = responseData.bic;
						var bank = responseData.bank;
						var branch = responseData.branch;
						$("#bankSearchText").val(bicNumber);
						populateIbanResponse(bicNumber,bank,branch);
												
					}else{
						isError = true;
						$('#beneBranchDesc').val("");
						$('#beneBranchCode').val("");
						$("#beneBankCode").val("");
						$("#bankSearchText").val("");
						if(responseData.errors){
							$( responseData.errors ).each(function( index ) {
							  errorMsg = errorMsg + "<p>"+responseData.errors[index]+"</p>";
							});
						}											
					}
					if(isError){
						$('#errorDiv').empty();
						$('#messageArea').empty();
						$('#messageArea').append(errorMsg);
						$('#messageArea, #messageContentDiv')
							.removeClass('hidden');
					}
				}else
				{
					$('#bankSearchText').removeAttr('disabled');
					$('#beneBranchDesc').removeAttr('disabled');
					$('#beneBranchDesc').val("");
					$('#beneBranchCode').val("");
					$("#beneBankCode").val("");
					$("#bankSearchText").val("");
					console.log("System not allow to validate IBAN");		
				}				
			}
		});
	}
	else if( beneValidationOnSave === 'N' && $('#paymentType').val() === '04' && !isEmpty($('#beneAcctNmbr').val()))
	{		
		$('#errorDiv').empty();
		 $('#messageArea').empty();	
		 $('#messageArea, #messageContentDiv').addClass('hidden');
		 $.ajax({
			 url : 'services/receiver/receiverdetails/'+$("#beneAcctNmbr").val()+'.json',
			data : {				
				"clientId" :$('#clientId').val(),
				"$payType" : $('#paymentType').val(),
				"$payPackage": $('#myProduct').val() 
			},
			method : 'GET',
			success : function(responseData) {
				var isError =  false;
				var errorMsg = "";
				if(!isEmpty(responseData))
				{					
					if(responseData.ISVALIDFLAG)
					{
						if(disableFields === 'Y')
						{
							readonlyFields = true;
						}
						if(!isEmpty(responseData.ACCTNAME))
						{
							$('#drawerDesc').val(responseData.ACCTNAME);
							$('#drawerDesc').removeClass("requiredField");
							if(readonlyFields)
								$('#drawerDesc').attr("disabled", true);
						}
						if(!isEmpty(responseData.ACCTCCY))
						{
							$("#beneAccountCcy").val(responseData.ACCTCCY);
							if(readonlyFields)
							{	
								$('#beneAccountCcy').attr("disabled", true);
								$('#beneAccountCcy-niceSelect').attr("disabled", true);
								$('#beneAccountCcy').niceSelect('update');
							}	
						}	
						if(!isEmpty(responseData.ACCTTYPE))
						{
							$("#beneAccountType").val(responseData.ACCTTYPE);
							if(readonlyFields)
							{
								$('#beneAccountType').attr("disabled", true);
								$('#beneAccountType-niceSelect').attr("disabled", true);
								$('#beneAccountType').niceSelect('update');
							}	
						}
						
						$('#bankIdType').val('SYSTEM');
						$("#bankIdType").niceSelect("update");
						$('#bankIdSpanText').addClass('hidden');
						$('#bankIdSpanText').text("");
												
						if(!isEmpty(responseData.ACCTBRANCH))
						{
							if(readonlyFields)
							{
								$('#bankSearchText').attr('disabled', 'disabled');
								$('#beneBranchDesc').attr('disabled', 'disabled');
							}							
							var branch = responseData.ACCTBRANCH;
							validateEQResponse(branch);		
						}	
					}
					else
					{
						isError = true;
						$('#beneBranchDesc').val("");
						$('#beneBranchCode').val("");
						$("#beneBankCode").val("");
						$("#bankSearchText").val("");
						if(responseData.errors){
							$( responseData.errors ).each(function( index ) {
							  errorMsg = errorMsg + "<p>"+responseData.errors[index]+"</p>";
							});
						}											
					}
					if(isError)
					{
						$('#errorDiv').empty();
						$('#messageArea').empty();
						$('#messageArea').append(errorMsg);
						$('#messageArea, #messageContentDiv')
							.removeClass('hidden');
					}
				}
				else
				{
					$('#bankSearchText').removeAttr('disabled');
					$('#beneBranchDesc').removeAttr('disabled');
					$('#beneBranchDesc').val("");
					$('#beneBranchCode').val("");
					$("#beneBankCode").val("");
					$("#bankSearchText").val("");							
				}				
			}
		});
	}
	else
	{		
		$('#bankSearchText').val("");
		$('#beneBranchDesc').val("");
		$('#beneBranchCode').val("");
		$("#beneBankCode").val("");
		$('#bankSearchText').removeAttr('disabled');
		$('#beneBranchDesc').removeAttr('disabled');
		$('#errorDiv').empty();
		$('#messageArea').empty();	
		$('#messageArea, #messageContentDiv').addClass('hidden');
	}
}

function populateIbanResponse(bicNumber,bank,branch) {
	$.ajax({
		url : 'services/userseek/beneEntryDrawerbank.json',
		data : {
			$top : 20,
			$filtercode1 : $('#clientSellerCode').val(),
			$autofilter : bicNumber,
			$filtercode2 : $('#bankIdType').val()
					? $('#bankIdType').val() :'BIC',
			$filtercode3 : ''
		},
		method : 'POST',
		success : function(responseData) {
			var rec = responseData.d.preferences;
			if (rec.length > 0) {
				$.map(rec, function(item) {
					var data = item;
					if (data) {
						$('#beneBankCode').attr("disabled", "true");
						isReceiverBankIDSelected = true;						
						if (!isEmpty(data.BANKCODE)) {
							$('#beneBankCode').val(data.BANKCODE);							
						}
						if(!isEmpty(data.ROUTINGNUMBER)){
							$('#bankId').val(data.ROUTINGNUMBER);
							$('#bankSearchText').val(data.ROUTINGNUMBER);
						}	
						if (!isEmpty(data.BRANCHCODE))
							$('#beneBranchCode').val(data.BRANCHCODE);
						if (!isEmpty(data.BRANCHDESCRIPTION))
							$('#beneBranchDesc').val(data.BRANCHDESCRIPTION);										
					}
					//resetBeneficiaryBankDetails();
				});					
			}
			else
			{
				if($('#adhocBankFlag').val() === 'N' ){
					$('#beneBranchDesc').val("");
					$('#beneBranchCode').val("");
					$("#beneBankCode").val("");
					$("#bankSearchText").val("");
					$('#errorDiv').empty();
					$('#messageArea').empty();
					ibanErrorFlag = true;
					$('#messageArea').append("BIC ("+bicNumber+") not present in the system for bank ("+bank+") and branch ("+branch+")");
					$('#messageArea, #messageContentDiv').removeClass('hidden');
				}else{
					$('#beneBankCode').attr("disabled", "true");
					isReceiverBankIDSelected = true;
					$('#beneBankCode').val(bicNumber);	
					$('#beneBankBic').val(bicNumber);					
					$('#bankId').val(bank);
					$('#bankSearchText').val(bicNumber);
					$('#beneBranchDesc').val(branch);
					$('#beneBranchCode').val('');
					$('#beneBankCode').val('');
					/*if (!isEmpty(data.BRANCHCODE))
						$('#beneBranchCode').val(data.BRANCHCODE);*/
				}
			}
		}
	});
}

function validateBankResponse(bicNumber,bank,branch) {	
	$.ajax({
		url : 'services/userseek/beneBranchSeek.json',
		data : {
			$top : 20,
			$filtercode1 : $('#clientSellerCode').val(),
			$autofilter : branch,
			$filtercode2 : $('#bankIdType').val()
					? $('#bankIdType').val() :'BIC',
			$filtercode3 : ''
		},
		method : 'POST',
		success : function(responseData) {
			var rec = responseData.d.preferences;
			if (rec.length > 0) {
				$.map(rec, function(item) {
					var data = item;
					if (data) {
						$('#beneBankCode').attr("disabled", "true");
						isReceiverBankIDSelected = true;
						
						if (!isEmpty(data.BANKCODE)) {
							$('#beneBankCode').val(data.BANKCODE);							
						}
						if(!isEmpty(data.ROUTINGNUMBER)){
							$('#bankId').val(data.ROUTINGNUMBER);
							$('#bankSearchText').val(data.ROUTINGNUMBER);
						}	
						if (!isEmpty(data.BRANCHCODE))
							$('#beneBranchCode').val(data.BRANCHCODE);
						if (!isEmpty(data.BRANCHDESCRIPTION))
							$('#beneBranchDesc').val(data.BRANCHDESCRIPTION);										
					}
					resetBeneficiaryBankDetails();
				});				
			}
			else
			{
				$('#beneBranchDesc').val("");
				$('#beneBranchCode').val("");
				$("#beneBankCode").val("");
				$("#bankSearchText").val("");
				$('#errorDiv').empty();
				$('#messageArea').empty();
				ibanErrorFlag =  true;
				$('#messageArea').append("Adhoc bank ("+branch+") not allowed .");
				$('#messageArea, #messageContentDiv')
					.removeClass('hidden');
			}
		}
	});
}

function onAnyIdPaymentClick ()
 {
	
	$('#myProduct').val('');
	$('#myProduct').niceSelect('update');
	$('#bankIdSpanText').addClass('hidden');
	$('#anyIdSpanText').addClass('hidden');
	$('#bankIdSpanText').text("");
	$('#anyIdSpanText').text("");
}
function onAnyIdPaymentChange(myproductChanged)
{
	toggleCheckBoxValue('chkAnyIdFlag');
	$('#anyIdFlag').val($('#chkAnyIdFlag').val());
	showHideOnchangeAnyIdPayment();
	if(myproductChanged === false)
		reloadMyProducts();
	getBankIDTypeList(null, false);
	if($('#chkAnyIdFlag').val()=="N")
	{
		resetAnyIDDetailsFields();
	}
	else
	{
		$('#beneAcctNmbr').val('');
		$('#beneAccountCcy').val('');
		$('#beneAccountType').val('');
		$('#bankIdType').val('');
		$('#bankSearchText').val('');
		$('#beneBranchDesc').val('');
		resetBankDetails();
	}
}
function resetAnyIDDetailsFields()
 {
	$('#anyIdValue').val('');
	$('#beneBranchDesc').val('');
	if ($('#anyIdType option').length > 2) {
		$('#anyIdType').val('');
		$('#anyIdType').niceSelect('update');
	}
	resetAnyIdValuePlaceholder();
}
function showHideOnchangeAnyIdPayment()
{
	if(checkAnyIdApplicable($('#anyIdFlag').val(),$('#paymentType').val()))
	{
		$('#accountNumberDiv').hide();
		$('#accountTypeAndCcyDiv').hide();
		$('#accountTypeAndCcyDiv1').hide();
		$('#anyIdTypeLbl').removeClass('hidden');
		$('#anyIdType').removeClass('hidden');
		$('#anyIdValueLbl').removeClass('hidden');
		$('#anyIdValue').removeClass('hidden');
		$('#bankIdTypeLbl').addClass('hidden');
		$('#bankIdType').addClass('hidden');
		$('#bankSearchTextLbl').addClass('hidden');
		$('#bankSearchText').addClass('hidden');
		$('#beneBranchDesc').removeAttr('placeholder');
		$('#beneBranchDesc').attr('disabled', 'disabled');
		$('#accountIbanDiv').hide();
	}
	else
	{
		$('#accountNumberDiv').show();
		$('#accountTypeAndCcyDiv').show();
		$('#accountTypeAndCcyDiv1').show();
		$('#bankIdTypeLbl').removeClass('hidden');
		$('#bankIdType').removeClass('hidden');
		$('#bankSearchTextLbl').removeClass('hidden');
		$('#bankSearchText').removeClass('hidden');
		$('#beneBranchDesc').attr('placeholder','Enter Keyword or %');
		if(beneValidationOnSave === 'N' && !isEmpty($('#beneBranchDesc').val()) && $('#paymentType').val() === '04' && readonlyFields)
			$('#beneBranchDesc').attr('disabled', 'disabled');
		else
			$('#beneBranchDesc').removeAttr('disabled');		
		$('#anyIdTypeLbl').addClass('hidden');
		$('#anyIdType').addClass('hidden');
		$('#anyIdValueLbl').addClass('hidden');
		$('#anyIdValue').addClass('hidden');
		$('#anyIdSpanText').addClass('hidden');
		$('#anyIdSpanText').text('');
		$('#accountIbanDiv').show();
	}
	$('#beneAccountCcy').niceSelect('update');
	$('#bankIdType').niceSelect('update');	
	if(pageMode != 'VIEW' && pageMode != 'UPDATE_NEXT' && pageMode != 'SAVE_NEXT')
		$('#anyIdType').niceSelect();
     $('#anyIdType').niceSelect('update');
	
}
function showHideField(field1,field2)
{
	$('#'+field1).show();
	$('#'+field2).hide();
}

function checkAnyIdApplicable(anyIdFlag,payTypeFlag)
{
	return (anyIdPayAllowedFlag == "Y" && anyIdFlag == "Y" && !isEmpty(payTypeFlag) && ( payTypeFlag == "06" || payTypeFlag == "03"));
}
function showHideAnyIDPayment(val)
{
	if(val && val=="Y")
	{
		$('#chkAnyIdFlag').attr('checked', true);
		$('#chkAnyIdFlag').val('Y');
		$('#anyIdFlag').val('Y');
	}
	else
	{
		$('#chkAnyIdFlag').removeAttr('checked');
		$('#chkAnyIdFlag').val('N');
		$('#anyIdFlag').val('N');
	}
	showHideAnyIdPaymentFlag(anyIdPayAllowedFlag,$('#paymentType').val());
}
function showHideAnyIdPaymentFlag(anyIdPayFlag, payTypeFlag)
{
	if (checkAnyIdApplicable(anyIdPayFlag, payTypeFlag))
	{
		$('#anyIdFlagLabel').removeClass('hidden');
	}
	else
	{
		$('#anyIdFlagLabel').addClass('hidden');
	}
}
function checkAnyIDPaymentAllowed()
{
	$.ajax({
		url : 'services/receiver/anyIDFlag',
		data : {
			"sellerId": $('#sellerCode').val()
		},
		method : 'GET',
		success : function(responseData) {
			if(responseData && responseData.isAnyIDPaymentAllow)
			{
				anyIdPayAllowedFlag = responseData.isAnyIDPaymentAllow;
			}
		},
		error: function (error) {
			anyIdPayAllowedFlag = "N";
		}
	});
}
function onchangePaymentType()
{
	var paymentType = document.getElementById('paymentType');
	setDesc(paymentType);
	updateValidations(paymentType.value);
	setPaymentTypeFlag(paymentType.value);	
	clearReceiverBankDetails();
	getDefaultANYIDFlag(paymentType.value);
	reloadMyProducts(true);
	getBankIDTypeList(null, true);
	getCollapsibleStatusFromPmtType(null);
	populateCategoryDependentFieldPopulation();
	setCurrency('${SESVAR_SELLER_CURR}');
	hideShowOnMoreClick();		
	showHideOnchangeAnyIdPayment();
	onAnyIdPaymentChange(false);
	enableDisableAccountNo(true);
	readonlyFields = false;
	showHideBeneAccValidationFields();
	$("#drawerDesc").unbind('.ValidateTextKeydown .ValidateTextBlur .ValidateTextInput .ValidateTextPropertychange');
	$("#receiverCode2").unbind('.ValidateTextKeydown .ValidateTextBlur .ValidateTextInput .ValidateTextPropertychange');
	setPatternValidator(true);
}

function onchangePackage()
{
	//updateValidations(this[this.selectedIndex].getAttribute('prdCode'));
	getBankIDTypeList(null,false);
	clearReceiverBankDetails();
	hideShowOnMoreClick();
	enableDisableAccountNo();
	showHideOnchangeAnyIdPayment();
	onAnyIdPaymentChange(true);
	readonlyFields = false;
	showHideBeneAccValidationFields();
}
function resetAnyIdValuePlaceholder()
{
	var anyIdType = $('#anyIdType').val();
	var placeholder = "Enter Keyword";
	if(anyIdType != ""){
		placeholder = "Enter " + $('#anyIdType').children("option:selected").text();
	}
	$('#anyIdValue').attr('placeholder',placeholder);
	$('#anyIdValue').val('');
}

function populateAnyIdTypeList(data) {
    var sAnyIdType = $('#anyIdType').val();
    var isSelectedVal = false;
    var rec = data;
    $('#anyIdType')
    .empty()
    .append('<option value="">Select</option>');
    if(rec && rec.length > 0){
        $.each(rec, function(index, cfg) {
            if(rec.length==1)
            {
                var opt = $('<option />', {
                            value : cfg.filterCode,
                            text : cfg.filterValue
                        });
                opt.attr('selected', 'selected');
                opt.appendTo($('#anyIdType'));
                $('#anyIdSpanText').removeClass('hidden');
                $('#anyIdSpanText').text(cfg.filterValue);
                $('#anyIdType').niceSelect('update');
                $('#anyIdType').val(cfg.filterCode);
                $('#anyIdType').hide();
                $('#anyIdType-niceSelect').hide();
            }
            else
            {
                $('#anyIdSpanText').addClass('hidden');
                $('#anyIdSpanText').text('');
                $('#anyIdType').append($('<option>', {
                    value: cfg.filterCode,
                    text : cfg.filterValue
                }));
                if(cfg.filterCode === sAnyIdType )
                    isSelectedVal = true;
                $('#anyIdType').niceSelect();
                $('#anyIdType').niceSelect('update');
                $('#anyIdType-niceSelect').show();
                $('#anyIdType-niceSelect').bind('blur', function () { markRequired(this);});
                $('#anyIdType-niceSelect').bind('focus', function () { removeMarkRequired(this);});
            }
        });
        if(isSelectedVal){
             $('#anyIdType').val(sAnyIdType);
        }
    }
    else
	{
    	$('#anyIdType').niceSelect('update');
    	$('#anyIdSpanText').addClass('hidden');
    	$('#anyIdSpanText').text("");
	}
    $('#beneBranchDesc').removeAttr('placeholder');
	$('#beneBranchDesc').attr('disabled', 'disabled');
    resetAnyIdValuePlaceholder();
}

function populateAnyIdDetails() {
	$('#errorDiv').empty();
	$('#messageArea').empty();
	$('#messageArea, #messageContentDiv').addClass('hidden');
	if (anyIdPayAllowedFlag == "Y" && !isEmpty($("#anyIdType").val()) && !isEmpty($('#anyIdValue').val()))
	{
		$.ajax({
			url : './services/receiver/anyIdDetails/' + $("#anyIdType").val() +'/'+$("#anyIdValue").val()+ '.json',
			data : {
				"sellerId" : $('#sellerCode').val()
			},
			method : 'GET',
			success : function(responseData) {
				processAnyIdResponse(responseData);
			}
		});
	}
	else 
	{
		$('#beneBranchDesc').val('');
	}
}
function processAnyIdResponse(responseData)
 {
	var isError = false;
	var errorMsg = "";
	if (responseData.systemAllowValidate && responseData.valid)
	{
		$('#beneBranchDesc').val(responseData.branch);
		if (responseData.receiverName && !isEmpty(responseData.receiverName))
 		{
			if (!isEmpty($('#drawerDesc').val()) && $('#drawerDesc').val().toLowerCase() != responseData.receiverName.toLowerCase())
			{
				showMismatchMsgPopup(responseData.receiverName);
			}
			else
			{
				$('#drawerDesc').val(responseData.receiverName);
			}
		}
	}
	else if (responseData.validationsCheck)
	{
		isError = true;
		$.each(responseData.validationsCheck, function(key, value) {
			errorMsg = errorMsg + "<p>" + value + "</p>";
		});
	}
	else if (responseData.errors)
	{
		isError = true;
		$(responseData.errors).each(function(index) {
			errorMsg = errorMsg + "<p>" + responseData.errors[index] + "</p>";
		});
	}
	if (isError && errorMsg != "")
	{
		$('#errorDiv').empty();
		$('#messageArea').empty();
		$('#messageArea').append(errorMsg);
		$('#messageArea, #messageContentDiv').removeClass('hidden');
	}
}
function onDrawerDescChange()
{
	if($('#chkAnyIdFlag').val()=="Y")
	{
		resetAnyIDDetailsFields();
	}
}
function showHideSpanText(lstId, spanId)
{
	if($('#'+lstId+' option').length==2)
	{
		$('#'+lstId).hide();
	    $('#'+lstId+'-niceSelect').hide();
	    $('#'+spanId).text($('#'+lstId+' option')[1].innerText);
	    $('#'+spanId).removeClass('hidden');
	}
	else if(!$('#'+lstId).is(':visible'))
	{
		$('#'+lstId).show();
        $('#'+lstId+'-niceSelect').show();
        $('#'+spanId).text('');
        $('#'+spanId).addClass('hidden');
	}
}
function showHideTxnLimit(strLimitLevel)
{
	if ($('input[name="limitLevelFlag"]:checked').val() === 'N')
	{
		$("#txnLimit").hide();
	}
	else 
	{
		$("#txnLimit").show();
		if($('#receiverTypeE').is(":checked"))
		{
			if ($('input[name="limitLevelFlag"]:checked').val() === 'B')
			{
				$('#totalTxnAmtAllowed').prop("disabled", true);
				$('#maxNoTxnAllowed').prop("disabled", true);
				$('#periodTypeD').prop("disabled", true);
				$('#periodTypeM').prop("disabled", true);
			}
			else 
			{
				$('#periodTypeD').removeAttr("disabled");
				$('#periodTypeM').removeAttr("disabled");
				$('#totalTxnAmtAllowed').removeAttr("disabled");
				$('#maxNoTxnAllowed').removeAttr("disabled");
			} 
		}
	}	
}

function beneAccountPagination()
{
	
	setPaginationValue();
	$('#nextTxn').click(function(){
		if(currentAccPage <= totalAccPage)
		{
			currentAccPage = parseInt(currentAccPage)+1;
			submitBeneAccount(currentAccPage);
		}
		
	});
	
	$('#previousTxn').click(function(){
		if(currentAccPage > 1)
		{
			currentAccPage = parseInt(currentAccPage)-1;
			submitBeneAccount(currentAccPage);
		}
	});
}

function setPaginationValue()
{
	//currentPage defined in BeneficiaryView page
	$('.currentPage').html(currentAccPage);
	$('.totalPages').html(totalAccPage);
	
	if(currentAccPage == totalAccPage)
	{
		$('#nextTxn').attr('disabled','disabled');
		$('#nextTxn').addClass('button-grey-effect');
		
	}
	else
	{
		$('#nextTxn').removeAttr('disabled');
		$('#nextTxn').removeClass('button-grey-effect');
		
	}
	
	if(currentAccPage == 1)
	{
		$('#previousTxn').attr('disabled','disabled');
		$('#previousTxn').addClass('button-grey-effect');		
	}
	else
	{
		$('#previousTxn').removeAttr('disabled');
		$('#previousTxn').removeClass('button-grey-effect');		
	}	
}

function submitBeneAccount(currentAccPage)
{
	
	var me = this;
	var form, inputField;
	var strUrl = './viewBeneficiary.form';
	var objKey = Object.keys(accList[currentAccPage-1])[0];
	var viewState = accList[currentAccPage-1][objKey];
	form = document.createElement('FORM');
	form.name = 'frmMain';
	form.id = 'frmMain';
	form.method = 'POST';
	inputField = document.createElement("input");
	inputField.setAttribute("type", "hidden");
	inputField.setAttribute("name", "viewState");
	inputField.setAttribute("value", viewState);
	form.appendChild(inputField);
	
	inputField = document.createElement("input");
	inputField.setAttribute("type", "hidden");
	inputField.setAttribute("name", csrfTokenName);
	inputField.setAttribute("value", csrfTokenValue);
	form.appendChild(inputField);

	form.action = strUrl;
	document.body.appendChild(form);
	form.submit();
}
function showLimitPopup(){
	if ($('input[name="limitLevelFlag"]:checked').val() === 'N'){
		if(vMode=='EDIT' && ($('#maxNoTxnAllowed').val()!='' || $('#totalTxnAmtAllowed').val()!=''))
		{
			$('#limitPopup').dialog({
						autoOpen : false,
						width : 430,
						modal : true,
						draggable: false,
						 resizable: false,
						 title : 'Warning'
			});
			
			$('#limitPopup').dialog("open");
			$('#cancelLimitPopup').bind('click',function(){
				$('#limitPopup').dialog("close");
				if(strLimitLevelOrig == 'A')
					$("#limitLevelA").prop("checked", true);
				else if(strLimitLevelOrig == 'B')
					$("#limitLevelR").prop("checked", true);				
			});
			
			$('#doneLimitPopup').bind('click',function(){
				$('#limitPopup').dialog("close");
				$('#maxNoTxnAllowed').val('');
				$('#totalTxnAmtAllowed').val('');
				$("#txnLimit").hide();
			});
		}
		else{
			$('#maxNoTxnAllowed').val('');
			$('#totalTxnAmtAllowed').val('');
			$("#txnLimit").hide();
		}
	}

}
$(document).on('click','#dialogTitlebarClose' ,function() { 
    $('#limitPopup').dialog("close");
});
function showDefaultAccountPopup(val,strUrl){
    $('#defaultAccountPopup').dialog({
                autoOpen : false,
                width : 430,
                modal : true,
                draggable: false,
                 resizable: false,
                 title : 'Warning'
    });
    $('#defaultAccountTextContent').html('Selection of default account '+$('#beneAcctNmbr').val()+'  will over ride the Default Account selection for Account Number '+val+'. Do you want to continue ?');
    $('#defaultAccountPopup').dialog("open");
    $('#cancelDefaultAccountPopup').bind('click',function(){
        $('#defaultAccountPopup').dialog("close");
        $('#chkDefaultAccountFlag').attr('checked',false);
        return;
    });
    
    $('#doneDefaultAccountPopup').bind('click',function(){
        $('#defaultAccountPopup').dialog("close");
        saveProfile(strUrl);
        //return true;
    });


}
$(document).on('click','#dialogTitlebarClose' ,function() { 
    $('#limitPopup').dialog("close");
});
function getDefaultAccount(strUrl){
    var val;
    var rec;
    var data;
    var receiverCode;
    receiverCode = $('#receiverCode').val();
    if (receiverCode == '')
    {
        receiverCode = $('#receiverCode2').val();
    }
    if(($('#chkDefaultAccountFlag').is(":checked") && modelDefaultAccountFlag == 'N')
		&& ($('#receiverTypeE').is(":checked") || vMode=='EDIT'))
	{
        
        $.ajax({
            url : "services/userseek/clientAccountList.json?",
            dataType : "json",
            type:'POST',
            data : {
                $top:10,
                $filtercode1: receiverCode,
                $filtercode2: $('#clientId').val()
            },
            success : function(data) {
                rec = data.d.preferences;
                
                val=rec[0];
                showDefaultAccountPopup(val,strUrl);
            }
        });
    }
    else{
        
        saveProfile(strUrl);
    }
    
}
function getDefaultANYIDFlag(strPayType)
{   
	 if ((strPayType === '06' && defAnyIDCheckLW === 'Y') || (strPayType === '03' && defAnyIDCheckEF === 'Y') )
	    	showHideAnyIDPayment('Y');
	 else
		 	showHideAnyIDPayment('N');
}
function validateEQResponse(branch) 
{	
	$.ajax({
		url : 'services/userseek/beneEntryDrawerbank.json',
		data : {
			$top : 20,
			$filtercode1 : $('#clientSellerCode').val(),
			$autofilter : branch,
			$filtercode2 : $('#bankIdType').val()
					? $('#bankIdType').val() :'SYSTEM',
			$filtercode3 : ''
		},
		method : 'POST',
		success : function(responseData) {
			var rec = responseData.d.preferences;
			if (rec.length > 0) {
				$.map(rec, function(item) {
					var data = item;
					if (data) {
						$('#beneBankCode').attr("disabled", "true");
						isReceiverBankIDSelected = true;
						
						if (!isEmpty(data.BANKCODE)) {
							$('#beneBankCode').val(data.BANKCODE);							
						}
						if(!isEmpty(data.ROUTINGNUMBER)){
							$('#bankId').val(data.ROUTINGNUMBER);
							$('#bankSearchText').val(data.ROUTINGNUMBER);
						}	
						if (!isEmpty(data.BRANCHCODE))
							$('#beneBranchCode').val(data.BRANCHCODE);
						if (!isEmpty(data.BRANCHDESCRIPTION))
							$('#beneBranchDesc').val(data.BRANCHDESCRIPTION);										
					}
					resetBeneficiaryBankDetails();
				});				
			}
			else
			{
				$('#beneBranchDesc').val("");
				$('#beneBranchCode').val("");
				$("#beneBankCode").val("");
				$("#bankSearchText").val("");
				$('#errorDiv').empty();
				$('#messageArea').empty();
				ibanErrorFlag =  true;
				$('#messageArea').append("Adhoc bank ("+branch+") not allowed .");
				$('#messageArea, #messageContentDiv')
					.removeClass('hidden');
			}
		}
	});
}

function showHideBeneAccValidationFields()
{
	if(beneValidationOnSave === 'N' && $('#paymentType').val() === '04' && readonlyFields)
	{
		if(!isEmpty($('#drawerDesc').val())){
			$('#drawerDesc').attr("disabled", true);
			$('#drawerDesc').removeClass("requiredField");
		}
		else
			$('#drawerDesc').attr("disabled", false);
			
		if(!isEmpty($('#beneAccountCcy').val()))
		{
			$('#beneAccountCcy').attr("disabled", true);
			$('#beneAccountCcy-niceSelect').attr("disabled", true);
			$('#beneAccountCcy').niceSelect('update');
		}
		else
		{
			 $('#beneAccountCcy').attr("disabled", false);
			 $('#beneAccountCcy-niceSelect').attr("disabled", false);
			 $('#beneAccountCcy').niceSelect('update');
			 
		}	
		if(!isEmpty($('#beneAccountType').val()))
		{
			$('#beneAccountType').attr("disabled", true);
			$('#beneAccountType-niceSelect').attr("disabled", true);
			$('#beneAccountType').niceSelect('update');
		}
		else
		{
			$('#beneAccountType').attr("disabled", false);
			$('#beneAccountType-niceSelect').attr("disabled", false);
			$('#beneAccountType').niceSelect('update');
		}		
		
		if(!isEmpty($('#bankSearchText').val()))
			$('#bankSearchText').attr('disabled', 'disabled');
		else
			$('#bankSearchText').removeAttr('disabled');
		
		if(!isEmpty($('#beneBranchDesc').val()))
			$('#beneBranchDesc').attr('disabled', 'disabled');
		else
			$('#beneBranchDesc').removeAttr('disabled');	
	}
	else
	{		
		$('#drawerDesc').attr("disabled", false); 
		$('#beneAccountCcy').attr("disabled", false);		
		$('#beneAccountCcy-niceSelect').attr("disabled", false);
		$('#beneAccountCcy').niceSelect('update');
		$('#beneAccountType').attr("disabled", false);
		$('#beneAccountType-niceSelect').attr("disabled", false);
		$('#beneAccountType').niceSelect('update');
		$('#bankSearchText').removeAttr('disabled');
		$('#beneBranchDesc').removeAttr('disabled');
	}
	  
}


function showHideIbanOption(value)
{
		if(value === 'Y'){
			$(".ibanValidationOption").show();
			$('#ibanLbl').attr('checked', true);
		}	
		else {
			$('#ibanLbl').attr('checked', false);
			$(".ibanValidationOption").hide();
		}
		
		if((beneIban != "" && beneIban !=null) || ibanSelected === 'Y'){
			$('#ibanLbl').attr('checked', true);
		}else {
			$('#accountNoLbl').attr('checked', true);
		}
}
/**
 * Function to validate IBAN
 * IF User has selected Product as International Fund Transfer
 * 	AND Selected IBAN 
 * THEN Check and Validate IBAN Structure  for the Input Account Number
 */
function doIBANValidation()
 {
		if($(".ibanValidationOption").is(":visible") && $('input[name=ibanValidationFlag]:checked').length > 0){
		
			var ibanValidationFlag = $('input[name="ibanValidationFlag"]:checked').val();	
			
			if('Y' == ibanValidationFlag)
			{
				if(!ibanValidator.validateStructure($("#beneAcctNmbr").val()))
				{
					var arrError = new Array(); ;
					arrError.push({
						"errorCode" : "Reciever Account Number",
						"errorMessage" : "Invalid IBAN Structure"
					});
					$('#messageArea').empty();
					$('#errorDiv').empty();
					var element = $('<p>').text("Invalid IBAN Structure");
					element.appendTo($('#messageArea'));
					$('#messageArea'  + ', #messageContentDiv') .removeClass('hidden');
					
					return false;
				}
			}
		}
		
		return true;
 }

function onIbanBlur()
{
	var bankIdVal = $('#bankIdType').val() ;
	var acctNmbr = $('#beneAcctNmbr').val();
	var paymentType = $('#paymentType').val() =='04' ? 'BOOK' : $('#paymentType').val() ;
	if( !isEmpty( bankIdVal ) && bankIdVal == 'IBAN' && !isEmpty( acctNmbr ))
	{
		$.ajax({
			url : 'services/userseek/drawerbank.json?$top=20&$filtercode1=IBAN&$filtercode2='+paymentType+'&$autofilter='+acctNmbr.toUpperCase(),
			type : 'GET',
			contentType : "application/json",
			success : function(data) {
				if( data && data.d && data.d.preferences && data.d.preferences.length > 0)
				{
					$('#beneBranchDesc').val( data.d.preferences[0].BRANCHDESCRIPTION );
				}
			}
		});
	}
}
function trimBeneAcctNmbr(){
	var beneAcctNmbr = $.trim($('#beneAcctNmbr').val());
	$('#beneAcctNmbr').val(beneAcctNmbr);
}
function limitModeHideUnHide(){
	
	if(multiAcc == 'Y')
	{
		$('#receiverIdMode').removeClass('hidden');
		$('#defaultAccountFlag').removeClass('hidden');
	}
	else
	{
	   $('#receiverIdMode').addClass('hidden');
	   $("#receiverCode2").attr("maxlength", 10);
	   $('#lblReceiverId').removeClass('required');
	}
	if(multiAcc == 'Y' && allowLimit == 'Y')
	{
		$('#receiverIdLevel').removeClass('hidden');
	}
	else
	{
		$('#receiverIdLevel').addClass('hidden');
	}
	if(allowLimit == 'Y' && strLimitLevel != 'N')
	{
	  $("#txnLimit").show();
	}
	else
	{
		$("#txnLimit").hide();
	}
	//to handle client change while creating
	if(multiAcc=='Y'&& strLimitLevel=="")
	{
		$("#txnLimit").hide();
	}
	//to handle client change while creating and switching client of same seller
	if(multiAcc == 'Y' && allowLimit == 'Y' && strLimitLevel=="")
	{ 
      document.getElementById('limitLevelN').checked = true;
	}
}
function enableDisableLEICode(code)
{
	if(code == 'I')
	{
	    $('#LEICode').val('');
		$('#LEICodeDiv').hide();
	}
	else if(code == 'C')
	{
	   $('#LEICodeDiv').show();
	   $('#corporate').attr('checked','checked');
	   $('#LEICode').val($('#LEICode').val());
	}
}