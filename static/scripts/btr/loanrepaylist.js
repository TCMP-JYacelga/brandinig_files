function changeSortLoanRep(sortCol, sortOrd, colId) {
	var frm = document.getElementById('frmMain');
	if (!frm) {
		alert(_errMessages.ERR_NOFORM);
		return false;
	}

	if (!isEmpty(colId)) {
		document.getElementById("txtSortColId").value=colId;
		document.getElementById("txtSortColName").value=sortCol;
		document.getElementById("txtSortOrder").value=sortOrd;
   		
		frm.action = 'loanRepaymentInvoiceList.form';
		frm.target = "";
		frm.method = "POST";
		frm.submit();
	}
	else {
		alert(_errMessages.ERR_NOFORM);
		return false;
	}
}
function search()
{
	    var frm = document.getElementById("frmMain");
	    if ('0' == document.getElementById("searchKey").value)
		{
			if (null != document.getElementById("toloaninvdate"))
			{
				document.getElementById("toloaninvdate").value = '';
			}
			if (null != document.getElementById("fromloaninvdate"))
			{
				document.getElementById("fromloaninvdate").value = '';
			}
		}	
	    document.getElementById("simpleDate").value = document.getElementById("searchKey").value;
	    document.getElementById("advAccountNumber").value = document.getElementById("cboAccountNumber").value;
	    document.getElementById("loanStatus").value = document.getElementById("cboLoanStatus").value;
	    createJSONFromAdvFilterValues('advancedFilterPopupLoanRepay');
	    frm.action = "loanRepayAdvFilter.form"; 
	    frm.target ="";
	    frm.method = "POST";    
	    frm.submit();		
}

function goToPage(strUrl, frmId) {
	var frm = document.getElementById(frmId);
	frm.action = strUrl;
	frm.target = "";
	frm.method = "POST";
	frm.submit();
}

function getAdvancedFilterPopupLoanRepay(strUrl,frmId) {
	var buttonsOpts = {};
	buttonsOpts[btnsArray['filterBtn']] = function() {
		if ("Y" == $("#simpleDateFlag").val())
		{
			$("#searchKey").val('7');
			$("#simpleDate").val('7');
		}
		createJSONFromAdvFilterValues('advancedFilterPopupLoanRepay');
		
		$(this).dialog("close");
		$(this).hide();
	    goToPage(strUrl, frmId);
	};
	buttonsOpts[btnsArray['saveFilterBtn']] = function() {
		if ("Y" == $("#simpleDateFlag").val())
		{
			$("#searchKey").val('7');
			$("#simpleDate").val('7');
		}
		createJSONFromAdvFilterValues('advancedFilterPopupLoanRepay');
		
		$(this).dialog("close");
		$(this).hide();
	    goToPage('loanRepaySaveAndApplyFilter.form', frmId);
	};
	buttonsOpts[btnsArray['cancelBtn']] = function() {
		resetForm('advancedFilterPopupLoanRepay');
		if('{}' != document.getElementById('filterData').value)
		{
			setAdvFilterValuesFromJSON('advancedFilterPopupLoanRepay',document.getElementById('filterData').value);
			setSimpleFilterFromJSON(document.getElementById('filterData').value);
		}
		$(this).dialog("close");
	};
	$('#advancedFilterPopupLoanRepay').dialog({
				autoOpen : false,
				height : 380,
				width : 473,
				modal : true,
				buttons : buttonsOpts
			});
	$('#advancedFilterPopupLoanRepay').dialog("open");
}

function getFilterDataforLoanRepay(ctrl) {
	var strData = {};
	var filterId = ctrl.options[ctrl.selectedIndex].value;
	
	if(filterId){
	strData["recKeyNo"] = filterId;
	strData["screenId"] = 'MESSAGE_BOX_CENTER';
	strData[csrfTokenName] = csrfTokenValue;	
	$(document).ajaxStart($.blockUI).ajaxStop($.unblockUI);
	$.ajax({
	        type: 'POST',	
	        data:strData,
	        url: "loanRepaymentFilterValues.formx",	       
	        success: function(data)
	        {
	           if (data!=null) 
			   { 
	        	   populateAdvancedFilterDataforLoanRepay(data, filterId);							   
			   }       	
	        }
	});
	} else {
		resetForm('advancedFilterPopupLoanRepay');
	}
}
function changeSimpleDateFlag()
{
	$("#simpleDateFlag").val('Y');
}
function populateAdvancedFilterDataforLoanRepay(data, filterId) {
	var filterData = data.FILTER_DATA;
	resetForm('advancedFilterPopupLoanRepay');
	setAdvFilterValuesFromJSON('advancedFilterPopupLoanRepay',JSON.stringify(filterData));
	$("#filterCode").val('');
}
function setSimpleFilterFromJSON(jsonString)
{
	var json = JSON.parse(jsonString);
	$("#searchKey").val(json.simpleDate);
	$("#cboAccountNumber").val(json.advAccountNumber);
	$("#cboLoanStatus").val(json.loanStatus);
}

function resetForm(frmId) {
	$("#" + frmId).find(':input').each(function() {
				switch (this.type) {
					case 'password' :
					case 'select-multiple' :
					case 'select-one' :
					case 'text' :
					case 'textarea' :
						$(this).val('');
						break;
					case 'checkbox' :
					case 'radio' :
						this.checked = false;
				}
			});
}


function getLoanRepayViewPopUp(index,frmId,payBtnText,cancelBtnText) {
	
	var strJson = document.getElementById("TEXTJSON"+index).value;
	var myJSONObject = JSON.parse(strJson);
	
	setValuesForViewPopUp(myJSONObject);
	
	$('#loanRepayViewPopUp').dialog({
				autoOpen : false,
				height : 450,
				width : 450,
				modal : true,
				buttons :  [{
                    id:"cancelBtnView",
                    text: cancelBtnText,
                    click: function() {
                    	$(this).dialog("close");
                          }
                  },{
                  	id:"payBtnView",
                      text: payBtnText,
                      click: function() {
                    	  $(this).dialog("close");
                  			getLoanRepaymentPopup('saveLoanInvoicesRepayment.form', 'loanInvoiceRepaymentForm',myJSONObject);
                          }
                  }],
				  open : function()
					{
						if(CAN_EDIT != 'true' || myJSONObject.loan_status != "0")
						{
							$('#payBtnView').hide();
						}
					}
			});
			
	$('#loanRepayViewPopUp').dialog("open");
}

function getMsgPopup() {
	$('#confirmMsgPopup').dialog( {
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
	$('#confirmMsgPopup').dialog('open');
	}


function setValuesForViewPopUp(obj) {

	document.getElementById('viewLoanAccount').value = obj.account_nmbr;
	document.getElementById('viewLoanAccName').value = obj.loan_acc_desc;
	document.getElementById('viewLoanInvoiceNumber').value = obj.invoice_number;

	if (undefined != obj.date_of_note)
	{
	document.getElementById('viewLoanInvoiceDate').value = obj.date_of_note;
	}
	if (undefined != obj.due_date)
	{
	document.getElementById('viewLoanDueDate').value = obj.due_date;
	}
	if (undefined != obj.bene_bank_desc)
	{
	document.getElementById('viewLoanInstName').value = obj.bene_bank_desc;
	}
	document.getElementById('viewLoanRoutingNo').value = obj.routing_number;
	document.getElementById('viewLoanCurrentAmtDue').value = obj.amount_due;
	document.getElementById('viewLoanPastDueAmnt').value = obj.amt_past_due;
	document.getElementById('viewLoantTotalAmtDue').value = obj.amount_due+obj.amt_past_due;
}

function viewInvoiceForm(index)
{
	var frm = document.getElementById("frmMain");
	document.getElementById("selectedRecordIndex").value = index;	 
	frm.action = "loanRepapymentView.form";
	frm.target ="";
	frm.method = "POST";
	frm.submit();
}
function SaveData()
{
	 
	var frm = document.getElementById("frmMain");
	if(frm.paymentReference.value.length==0)
	{   		        
   		alert("Please Insert Payment Reference");		
	}
	else if (frm.debitAccount.value.length==0)
	{	 	             
	 	alert("Please Insert Debit Account");    	  
	}
	else if (!check_date(frm.paymentDate.value))
	{       	              
    	alert("Please Insert Date");    	
	}	 
	else
	{
		 
	  	var frm = document.getElementById("frmMain");
	   	frm.action = "loanRepapymentUpdatePay.form";
	   	frm.target ="";
	   	frm.method = "POST";
	   	frm.submit()
	   	
	 
	}
	
}
function CancelData()
{
	document.getElementById("paymentReference").value=""
	document.getElementById("debitAccount").value=""
	document.getElementById("paymentDate").value=""
}
function payInvoiceForm(index)
{
	 
	var frm = document.getElementById("frmMain");
	document.getElementById("selectedRecordIndex").value = index;	 
	frm.action = "loanRepapymentPay.form";
	frm.target ="";
	frm.method = "POST";
	frm.submit();
}
function gotoBackPage()
 {
	var frm = document.getElementById("frmMain");
	frm.action = "loanRepaymentInvoiceList.form"; 
    frm.target ="";
    frm.method = "POST";    
    frm.submit();
 }

function check_date(field)
{
	var RegEx = /^(?:(?:0?[1-9]|1\d|2[0-8])(\/|-)(?:0?[1-9]|1[0-2]))(\/|-)(?:[1-9]\d\d\d|\d[1-9]\d\d|\d\d[1-9]\d|\d\d\d[1-9])$|^(?:(?:31(\/|-)(?:0?[13578]|1[02]))|(?:(?:29|30)(\/|-)(?:0?[1,3-9]|1[0-2])))(\/|-)(?:[1-9]\d\d\d|\d[1-9]\d\d|\d\d[1-9]\d|\d\d\d[1-9])$|^(29(\/|-)0?2)(\/|-)(?:(?:0[48]00|[13579][26]00|[2468][048]00)|(?:\d\d)?(?:0[48]|[2468][048]|[13579][26]))$/;
	var regex = new RegExp(RegEx);
	var cd= regex.test(field);
	 
	if (cd==false)
	 {
	  
	    return false;
          }
	 else
	 {
	   return true;
	 }	

}
function add()
 {
	var frm = document.getElementById("frmMain");
	frm.action = "loanRepapymentPay.form"; 
    frm.target ="";
    frm.method = "POST";    
    frm.submit();
 }


 function gotoRepayment()
 {
	var frm = document.getElementById("frmMain");
	frm.action = "loanRepapymentPay.form"; 
    frm.target ="";
    frm.method = "POST";    
    frm.submit();
 }
 function showEditForm(strurl, index)
{
	 
	var frm = document.getElementById("frmMain");
	document.getElementById("selectedRecordIndex").value = index;	 
	frm.action = "loanRepapymentPay.form";
	frm.target ="";
	frm.method = "POST";
	frm.submit();
}
 function showAddLoanInvoicePopup(strUrl, frmId)
 {
	 var buttonsOpts = {};
		buttonsOpts[btnsArray['saveBtn']] = function() {
			$(this).dialog("close");
			$(this).hide();
		    goToPage(strUrl, frmId);
		};
		buttonsOpts[btnsArray['cancelBtn']] = function() {
			resetLoanRepaymentEntryForm(frmId);
			$(this).dialog("close");
		};
		$('#addLoanRepaymentPopup').dialog({
					autoOpen : false,
					height : 450,
					width : 473,
					modal : true,
					buttons : buttonsOpts
				});
		$('#addLoanRepaymentPopup').dialog("open");
 }
 function resetLoanRepaymentEntryForm(frmId)
 {
	 var frm = document.getElementById(frmId);
	 frm.elements['beneDesc'].value = '';
	 frm.elements['routingNumber'].value = '';
	 frm.elements['accountNumber'].value = '';
	 frm.elements['dateOfNote'].value = '';
	 frm.elements['noteType'].value = '';
	 frm.elements['amountDue'].value = '';
	 frm.elements['dueDate'].value = '';
	 frm.elements['outStandingPrincipal'].value = '';
	 frm.elements['amtPastDue'].value = '';
 }
 
 function getProductDebitAccounts(routing_number) {

 // Fetching the myproducts and corresponding debit accounts for selected loan invoice entry
 var strData = {};
	strData['routingNumber'] = routing_number;
	strData[csrfTokenName] = csrfTokenValue;	
	$(document).ajaxStart($.blockUI).ajaxStop($.unblockUI);
	$.ajax({
	        type: 'POST',
	        async : false,
	        data:strData,
	        url: 'getProductAndDebitAccForLoanInvoice.rest',     
	        success: function(data)
	        {
	        	productList = data.productList;
	        	debitAccountList = data.debitAccountList;
	        	
	        	//populate the product list
	        	var cmbProduct = document.getElementById('paymentProduct');
	        	cmbProduct.options.length = 0;
	        	 var option = document.createElement("option");              
    			 option.text = lblSelect;
    			 option.value = '';
    			 cmbProduct.options.add(option);
    			 for (var key in productList) {
    			/* for(var cntr = 0; cntr<productList.length; cntr++) {*/
	    			 var option = document.createElement("option");              
	    			 option.text = key+" : "+productList[key];
	    			 option.value = key;
	    			 cmbProduct.options.add(option);
	    		 }
	        }
	});
 
 }
 
 function clearRepaymentEntryPopUp(myJSONObject)
 {
	 $('#debitAmtCurr').val('');	
		$("#loanRepaymentDebitAccount").get(0).options.length = 1;	
		$('#loanInvoiceRepReference').val('');
		$('#loanInvoiceRepaymentDate').val('');
		$("#loanInvoiceRepayRateType").attr("disabled","true");	
		$('#loanInvoiceRateTypeLab').removeClass('required');		
		resetDefaultRadioRepayment();
		$('#paymentAmtCurr').val(myJSONObject.payment_ccy);				
		$("#paymentProduct").val('');
		$("#loanInvoiceRepayRateType").val('');
 }

 function resetDefaultRadioRepayment()
 {
	 document.getElementById('currAmtDue').checked =true;
	 document.getElementById('pastDueAmt').checked =false;
	 document.getElementById('totDueAmt').checked =false;
	 document.getElementById('otherAmt').checked =false;
 }
	
 function getLoanRepaymentPopup(strUrl, frmId,myJSONObject) {

	$('#loanRepaymentamount').val(myJSONObject.amount_due);
	$('#paymentAmtCurr').val(myJSONObject.payment_ccy);
	$("#loanInvoiceRepayRateType").val('');
	$("#loanInvoiceRepayRateType").attr("disabled","true");	
	 var myJSONText = JSON.stringify(myJSONObject);
	 document.getElementById('viewJsonStringPayEntryPopUp').value=myJSONText;
	 document.getElementById('loanInvAccNoPopUp').value=myJSONObject.account_nmbr;
	 
	 resetDefaultRadioRepayment();
	 
	 getProductDebitAccounts(myJSONObject.routing_number);
		
	 //Action buttons on  the loan repayment entry popup 
		var buttonsOpts = {};
		buttonsOpts[btnsArray['submitBtn']] = function() {
			$(this).dialog("close");
			goToPage(strUrl, frmId);
		};
		buttonsOpts[btnsArray['cancelBtn']] = function() {
			clearRepaymentEntryPopUp(myJSONObject);
			$(this).dialog("close");
		};
		
		//Opens the loan invoive entry popup
		$('#loanRepaymentEntryPopUp').dialog({
					title : "Loan Account: "+myJSONObject.account_nmbr+" |Loan Invoice No: "+myJSONObject.invoice_number+" |Current Amount Due: "+myJSONObject.amount_due+" "+myJSONObject.payment_ccy,
					autoOpen : false,
					height : 320,
					width : 720,
					modal : true,
					buttons : buttonsOpts
				});
		$('#loanRepaymentEntryPopUp').dialog("open");
	}

 function populateAmountValues(cntrl) {
	 var radioVal= cntrl.value;
	 var myJSONObject = JSON.parse(document.getElementById('viewJsonStringPayEntryPopUp').value);
	 if(radioVal=='currAmtDue')
	 {
		 $('#loanRepaymentamount').val(myJSONObject.amount_due);	
	 }
	 else if(radioVal=='pastDueAmt')
	 {
		 $('#loanRepaymentamount').val(myJSONObject.amt_past_due);	
	 }
	 else if(radioVal=='totDueAmt')
	 {
		 $('#loanRepaymentamount').val(myJSONObject.amount_due+myJSONObject.amt_past_due);	
	 }
	 else
	 {
		 $('#loanRepaymentamount').val('');	
		 $("#loanRepaymentamount").removeAttr("readonly");
	 }
		 
		 
 }
 
 function handleEnableDisablePaymentRateType(){
		var combo = document.getElementById('loanInvoiceRepayRateType');	
			if($('#paymentAmtCurr').val() != $('#debitAmtCurr').val()){
				$("#loanInvoiceRepayRateType").removeAttr("disabled");
				$('#loanInvoiceRateTypeLab').addClass('required');
					
			} else {
				$("#loanInvoiceRepayRateType").attr("disabled","true");
				$('#loanInvoiceRateTypeLab').removeClass('required');
				combo.selectedIndex = 0;			
			}
	} 
 
jQuery.fn.dateTextBox = function() {
	return this
			.each(function() {
				$(this)
						.keydown(function(e) {
							var key = e.charCode || e.keyCode || 0;
							// allow backspace, tab, delete, arrows, numbers and
							// keypad for TAB
							return (key == 9 || key==8 || key==46);
							})
			})
}; 