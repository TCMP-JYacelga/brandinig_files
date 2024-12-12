// This is IE-11 Browser Specific
// https://github.com/uxitten/polyfill/blob/master/string.polyfill.js
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/padStart
if (!String.prototype.padStart) {
    String.prototype.padStart = function padStart(targetLength, padString) {
        targetLength = targetLength >> 0; //truncate if number, or convert non-number to 0;
        padString = String(typeof padString !== 'undefined' ? padString : ' ');
        if (this.length >= targetLength) {
            return String(this);
        } else {
            targetLength = targetLength - this.length;
            var ieCheck = false;
            if (targetLength > padString.length) {
                if (!!navigator.userAgent.match(/Trident\/7\./))
                    ieCheck = true; 
                if (!ieCheck) {
                padString += padString.repeat(targetLength / padString.length); //append to original to ensure we are longer than needed
                }
                else
                {
                    var count1 = parseInt(targetLength / padString.length);
                    var count2='';
                    for(var i=0;i<count1;i++)
                    {
                        count2=count2 + padString;
                    }
                    padString = padString + count2;
                }
            }
            return padString.slice(0, targetLength) + String(this);
        }
    };
}

const quickPay_templates = {

  quickPayButton :'<div id="quickpaybtn" class="form-group quickpay-btn">'+
				   '<span id="QPimg" class="quickpay-img">'+
						'<img src="' + imagePath  + '/quickPay.svg" style="height:20px;width:35px;">'+
			            '<span class="quickPay-text">'+getDashLabel('quickPay.title', 'Quick Pay')+'</span>'+
				   '</span>'+
			       '</div>',
 quickPayDiv : '<div id="quickpaydiv" data-backdrop="static" class="quickpay-div fade" aria-expanded="false" aria-hidden="true">'+
                 '<div id="quickpay_container" class="quickpay-container modal-dialog">'+
                    '<div id="quickpay_back_button"><i class="material-icons d-none" style="cursor:pointer;">keyboard_backspace</i></div>'+
                   '<div class="field" id="quickpay_header"><h5 id="quikpay_title">'+getDashLabel('quickPayment.title', 'Quick Payment')+
                      '<button id="close_quickpay_btn" type="button" class="close float-right" aria-label="Close" >'+
							'<i class="material-icons" style="font-weight: 700;padding-left: 10px ">close</i>'+
						'</button>'+
					  '<button id="more_quickpay_btn" class="btn btn-dark float-right" style="padding: 0px" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">'+
                                '<i class="material-icons" >more_vert</i>'+
                       '</button>'+
                       '<div class="dropdown-menu dropdown-menu-right" aria-labelledby="more_quickpay_btn">'+
                         '<a class="dropdown-item" style="cursor:pointer;" id="recent_transactions">'+getDashLabel('quickPay.recentTransactions', 'Recent Transactions')+'</a>'+
						 '<a class="dropdown-item" style="cursor:pointer;" id="add_manage_beneficiaries" href="beneficiaryList.form">'+
						 getDashLabel('quickPay.addManageBene', 'Add/Manage Beneficiaries')+'</a>'+
						'</div></h5>'+
                     '</div>'+
                    '<div id="bene_search_section"></div>'+
                    '<div id="bene_search_results_section" class="quickpay-maxHeight-receivers"></div>'+
                    '<div id="receiver_section" class="quickpay-maxHeight-receivers"></div>'+
                    '<div id="payment_initiation_screenErr" style="color:red;font-size:13px;"></div>'+
                    '<div id="payment_initiation_screen" class="w-100 pr-3"></div>'+
                    '<div id="recent_transactions_section" class="quickpay-maxHeight-recentTnx w-100"></div>'+
                    '<div id="quickpay_success_screen" class="pr-3"></div>'+
                 '</div>'+
               '</div>',
quickPayReceiverSection : '<div class="font-weight-bold field" id="qprecsection">'+getDashLabel('quickPay.receivers', 'Receivers')+'</div><div class="field" id="qprecsubsection">'+
                      '<a id="all-bene-collapse" class="" data-toggle="collapse" href="#all-bene-section" role="button" aria-expanded="false" aria-controls="all-bene-section">'+
                     '<i id="all-bene-expand-icon" class="material-icons align-middle beneSection">keyboard_arrow_right</i>'+
                     '<i id="all-bene-collapse-icon" class="material-icons align-middle beneSection">keyboard_arrow_down</i>'+
                     '<span class="pl-2">'+getDashLabel('quickPay.receivers.all', 'All')+'</span>'+ 
                   '</a><div id="all-bene-section"></div></div>'+
                   '<div class="field" id="benecollapse"><a class="" id="fav-bene-collapse" data-toggle="collapse" href="#fav-bene-section" role="button" aria-expanded="false" aria-controls="fav-bene-section">'+
                     '<i id="fav-bene-expand-icon" class="material-icons align-middle beneSection">keyboard_arrow_right</i>'+
                     '<i id="fav-bene-collapse-icon" class="material-icons align-middle beneSection">keyboard_arrow_down</i>'+
                     '<span class="pl-2">'+getDashLabel('quickPay.receivers.favorite', 'Favorites')+'</span>'+ 
                   '</a><div id="fav-bene-section" class="collapse"></div></div>',

quickPaySearch :   '<input type="text" id="input_receiver_search" class="quickpay-search-input" placeholder="'+getDashLabel('quickPay.searchPlaceholder', 'Search your Receiver')+'"/>'+
                   '<i class="material-icons quickpay-search-icon" id="qpsearch" style="cursor:pointer">search</i>',

quickPaySuccess :
                 '<div class="mt-5 mb-4" id="payment_icon"><i class="material-icons text-center"></i></div>'+
                 '<div id="quickpay_success_header" class="font-weight-bold text-center align-middle mb-3"></div>'+
                 '<div id="quickpay_sucess_message" class="text-center" style="color:grey"></div>'+
                 '<div id="quickpay_sucess_messageErr" class="text-center" style="color:red"></div>'+
                 '<div id="quickpay_success_footer" class="mt-4">'+
                     '<button class="btn primary-button quickpay_sucess_button mt-4 w-100" id="quickpay_makeAnother_payment" onclick="makeAnotherPayment();">'+getDashLabel('quickPay.btn.makeAnotherPayment', 'Make Another Payment')+'</button>'+
                     '<button class="btn tertiary-button quickpay_sucess_button w-100" id="quickpay_cancel" onclick="closeQuickPay();">'+getDashLabel('quickPay.btn.close', 'Close')+'</button>'+
                 '</div>'
};

var a = ['','one ','two ','three ','four ', 'five ','six ','seven ','eight ','nine ','ten ','eleven ','twelve ','thirteen ','fourteen ','fifteen ','sixteen ','seventeen ','eighteen ','nineteen '];
var b = ['', '', 'twenty','thirty','forty','fifty', 'sixty','seventy','eighty','ninety'];
var productCurrency ;
var cuttoffTime ;
var nextExecutionDate ;
var prdDtls ;
var sendingAccountCcy;
var debitAccountsLst ;
$(document).ready(function(){
     $('.page-body').append(quickPay_templates.quickPayButton);
     $('.page-body').append(quickPay_templates.quickPayDiv);
	 showHideReceiverMasterOption();

     $('#quickpaybtn').click(function(){
       $('#quickpaydiv').modal();
       $('#quickpay_success_header').empty();
       $('#payment_initiation_screenErr').empty();
       $('#payment_initiation_screen').empty();
       $('#quickpay_success_screen').empty();
       $('#bene_search_section').empty();
       $('#receiver_details').empty();
       $('#recent_transactions_section').empty();
       fetchAllReceivers();
       fetchFavReceivers();
       paintReceiverSearch();
	   initiatePayment();
	   $('#close_quickpay_btn').click(function(e){
	         if($('#quickpaydiv').is(':visible')) {
		     $('#quickpaydiv').modal('hide');
	         }
	     });
	    if(_strUserLocale=="ar_BH")
	    {
	    $('#receiver_section').addClass('field-rtl');
		$('#qprecsubsection').addClass('field-rtl');
		$('#qprecsection').addClass('field-rtl');
		$('#benecollapse').addClass('field-rtl');
	    }
	    
     });
     handleRecentTransactions();
    if(_strUserLocale=="ar_BH")
	{
		$('#quickpaybtn').removeClass('quickpay-btn');
		$('#quickpaybtn').addClass('quickpay-btn-rtl');
		$('#QPimg').removeClass('quickpay-img');
		$('#QPimg').addClass('quickpay-img-rtl');
		
		$('#quickpay_container').css('margin','1rem 1rem 0rem 1rem');		
		$('#quickpaydiv').removeClass('quickpay-div');
		$('#quickpaydiv').addClass('quickpay-div-rtl');
		
		$('#close_quickpay_btn').removeClass('float-right');
		$('#close_quickpay_btn').addClass('float-left');
		$('#more_quickpay_btn').removeClass('float-right');
		$('#more_quickpay_btn').addClass('float-left');
		
		$('#qpsearch').removeClass('quickpay-search-icon');
		$('#qpsearch').addClass('quickpay-search-icon-rtl');
		
		$('#quickpay_header').addClass('field-rtl');
		$('#receiver_section').addClass('field-rtl');
	}
	
});

function fetchAllReceivers() {
  var strUrl = rootUrl+'/services/userseek/QuickPayreceiverSeekUsingPaymentType.json';
  var strData = {$top: '5'};
   $.ajax(
   {
		 type : 'POST',
		 data : strData,
		 url : strUrl,
		 dataType : 'json',
         async : false,
		 success : function( data )
		 {
			 paintQuickPayBeneSection(data);
		 }                       
   });
}

function fetchRecentTransactions(filter) {
  var strUrl = rootUrl+'/services/getQuickPayRecordList';
  var strData = {$top:'10', $filterDetail:''};
  if(filter!='') strData.$filterDetail = filter;
	$.ajax(
   	{
		 type : 'POST',
		 data : strData,
		 url : strUrl,
		 dataType : 'json',
         async : false
    })                 
	.done (function(data, textStatus, jqXHR) { 
		if(data.root.actionRowList && data.root.actionRowList.length >= 0 && textStatus === "success")
		{
			paintRecentTransactions(data);
		}
	})
	.fail (function(jqXHR, textStatus, errorThrown)  { 
	     if('error' == textStatus){
			 $('#receiver_section').addClass('d-none');
			 $('#payment_initiation_screenErr').empty();
			 $('#quickpay_back_button i').removeClass('d-none');
			 $('#recent_transactions_section').empty();
			 $('#bene_search_section').empty();
			 $('#bene_search_results_section').empty();
			 $('#payment_initiation_screen').empty();
			 $('#quickpay_success_screen').empty();
			 $('#more_quickpay_btn i').addClass('d-none');
			 let header = '<h5 class="mt-2">'+getDashLabel('quickPay.recentTransactions')+'</h5>';
			 $('#recent_transactions_section').append(header);
			 handleClickOnBackButton();
			 $('#recent_transactions_section').append('<h6>'+getDashLabel("quickPay.technicalError")+'</h6>');
	     }
	})
}

function fetchFavReceivers() {
  var strUrl = rootUrl+'/services/getFavoriteEntityList';
  var strData = {$entitytype:'BENE',
                 $top: '5'};
   $.ajax(
   {
		 type : 'POST',
		 data : strData,
		 url : strUrl,
         dataType : 'json',
         async : false,
		 success : function(data)
		 {
		   paintFavouriteReceivers(data.root.FavBeneList);
		 }                       
   });
}

function fetchDebitAccounts(recCurrency) {
 var strUrl = rootUrl+'/services/userseek/QuickPayDebitAccountSeek.json';
 var strData = {$filtercode1:recCurrency};
   $.ajax(
   {
		 type : 'POST',
		 data : strData,
		 url : strUrl,
         async : false,
		 success : function(data)
		 {
		   paintDebitAccounts(data.d.preferences);
		 }                       
   });
}

function fetchBankProduct(paymentType ,product){
 var strUrl = rootUrl+'/services/getProductDetails';
 var strData = {$paymentType:paymentType,
                $myProduct:product};
 productCurrency ="";
 nextExecutionDate = "";
 var bankProduct='';
   $.ajax(
   {
		 type : 'GET',
		 data : strData,
		 url : strUrl,
		 dataType : 'json',
         async : false,
		 success : function(data)
		 {
             prdDtls =  data.root.PrdDtls;
    		 debitAccountsLst = data.root.DebitAccList
		 }                       
   });

}

function paintReceiverSearch() {
	$('#input_receiver_search').autocomplete({
		  source: function( request, response ) {
	          if($('#input_receiver_search').val() == '' || $('#input_receiver_search').val() == null){
				fetchAllReceivers();
	            fetchFavReceivers();
	            initiatePayment();    
	          }
	          else { 
			    var strUrl = 'services/userseek/QuickPayreceiverSeekUsingPaymentType.json';
			    var strData = {};
			    strData['$autofilter'] = request.term;
			    $.ajax(
			    {
					 type : 'POST',
					 data : strData,
					 url : strUrl,
					 dataType : 'json',
					 success : function( data )
					 {
                       paintSearchedReceiver(data.d.preferences);
                       initiatePayment();
                     }
			   });
	          }
		  },
          minLength: 0 
		});	
}

function paintQuickPayBeneSection(beneData) {
  $('#more_quickpay_btn i').removeClass('d-none');
  $('#receiver_section').empty();
  $('#receiver_section').removeClass('d-none');
  $('#quickpay_back_button i').addClass('d-none');
  $('#recent_transactions_section').empty();
  $('#bene_search_section').empty();
  $('#bene_search_results_section').empty();
  $('#bene_search_section').append(quickPay_templates.quickPaySearch);
  $('#receiver_section').append(quickPay_templates.quickPayReceiverSection);
  paintReceiverSearch();
  $(beneData.d.preferences).each(function(index, bene){
    
    var beneItem = '<div id="bene-item" class="row quickpay-receiver">'+
                      '<div class="col-2 uxg-quickpay-avatar">'+getCharacters(bene.BENEDESCRIPTION)+'</div>'+
                      '<div class="col-10" style="font-size:14px">'+
                        '<div id="receiver_desc" class="font-weight-bold text-break quickPay-receiverDesc">'+bene.BENEDESCRIPTION+'</div>'+
                        '<div id="receiver_accountNo" class="font-weight-bold text-break">'+bene.ACCOUNTNO+'</div>'+
                        '<div class="text-break">'+bene.BANKNAME+'</div>'+
                        '<input type="hidden" id="quickpay_myProduct" name="quickpay_myProduct" value="'+bene.MYPRODUCT+'">'+
                        '<input type="hidden" id="quickpay_currency" name="quickpay_currency" value="'+bene.BENE_ACCOUNT_CCY_DESCRIPTION+'">'+
                        '<input type="hidden" id="quickpay_receiver_code" name="quickpay_receiver_code" value="'+bene.CODE+'">'+
                        '<input type="hidden" id="quickpay_paymentType" name="quickpay_paymentType" value="'+bene.PAYMENT_TYPE+'">'+
                      '</div>'+
                     '</div>';
     $('#all-bene-section').append(beneItem);
  });
  handleCollapseofReceivers();
}

function paintSearchedReceiver(beneData) {
  $('#receiver_section').addClass('d-none');
  $('#bene_search_results_section').empty();
  if(beneData.length == 0) 
     $('#bene_search_results_section').append(getDashLabel('addWidget.message.noResultsFound'));
  else {
  $(beneData).each(function(index, bene){
    
    var beneItem = '<div id="bene-item" class="row quickpay-receiver">'+
                      '<div class="col-2 uxg-quickpay-avatar">'+getCharacters(bene.BENEDESCRIPTION)+'</div>'+
                      '<div class="col-10" style="font-size:14px">'+
                        '<div id="receiver_desc" class="font-weight-bold text-break quickPay-receiverDesc">'+bene.BENEDESCRIPTION+'</div>'+
                        '<div id="receiver_accountNo" class="font-weight-bold text-break">'+bene.ACCOUNTNO+'</div>'+
                        '<div class="text-break">'+bene.BANKNAME+'</div>'+
                        '<input type="hidden" id="quickpay_myProduct" name="quickpay_myProduct" value="'+bene.MYPRODUCT+'">'+
                        '<input type="hidden" id="quickpay_currency" name="quickpay_currency" value="'+bene.BENE_ACCOUNT_CCY_DESCRIPTION+'">'+
                        '<input type="hidden" id="quickpay_receiver_code" name="quickpay_receiver_code" value="'+bene.CODE+'">'+
                        '<input type="hidden" id="quickpay_paymentType" name="quickpay_paymentType" value="'+bene.PAYMENT_TYPE+'">'+
                      '</div>'+
                     '</div>';
     $('#bene_search_results_section').append(beneItem);
  });
  }
}

function handleCollapseofReceivers() {
	  $('#more_quickpay_btn i').removeClass('d-none');
      $('#all-bene-section').collapse('show');
      $('#fav-bene-section').collapse('hide');
      $('#all-bene-expand-icon, #all-bene-collapse').click(function(){
		$('#fav-bene-section').collapse('hide');
		$('#recommended-bene-section').collapse('hide');
	  });
	  $('#recommended-bene-expand-icon, #recommended-bene-collapse').click(function(){
		$('#fav-bene-section').collapse('hide');
		$('#all-bene-section').collapse('hide');
	  });
	  $('#fav-bene-expand-icon, #fav-bene-collapse').click(function(){
		$('#recommended-bene-section').collapse('hide');
		$('#all-bene-section').collapse('hide');
	  });


}

function paintFavouriteReceivers(beneData) {
 $(beneData).each(function(index, bene){
    
    var beneItem = '<div id="bene-item" class="row quickpay-receiver">'+
                   '<div class="col-2 uxg-quickpay-avatar">'+getCharacters(bene.receiverDesc)+'</div>'+
                      '<div class="col-10" style="font-size:14px">'+
                        '<div id="receiver_desc" class="font-weight-bold text-break quickPay-receiverDesc">'+bene.receiverDesc+'</div>'+
                        '<div id="receiver_accountNo" class="font-weight-bold text-break">'+bene.accountNumber+'</div>'+
                        '<div class="text-break">'+bene.bankName+'</div>'+
                        '<input type="hidden" id="quickpay_myProduct" name="quickpay_myProduct" value="'+bene.myProduct+'">'+
                        '<input type="hidden" id="quickpay_currency" name="quickpay_currency" value="'+bene.receiverCcy+'">'+
                        '<input type="hidden" id="quickpay_receiver_code" name="quickpay_receiver_code" value="'+bene.receiverCode+'">'+
                        '<input type="hidden" id="quickpay_paymentType" name="quickpay_paymentType" value="'+bene.paymentType+'">'+
                      '</div>'+
                     '</div>';
     $('#fav-bene-section').append(beneItem);
  });
}

function initiatePayment() {
   $('.quickpay-receiver').click(function(){
     $('#more_quickpay_btn i').removeClass('d-none');
     $('#receiver_section').addClass('d-none');
     $('#bene_search_section').empty();
     $('#recent_transactions_section').empty();
     $('#bene_search_results_section').empty();
     $('#payment_initiation_screen').empty();
     $('#payment_initiation_screenErr').empty();
     $('#quickpay_back_button i').removeClass('d-none');
     var receiverName = $(this).find('#receiver_desc')[0].innerText;
     var receiverAcc = $(this).find('#receiver_accountNo')[0].innerText;
     var receiverCurrency = $(this).find('#quickpay_currency')[0].value;
     var receiverProduct = $(this).find('#quickpay_myProduct')[0].value;
     var receiverCode = $(this).find('#quickpay_receiver_code')[0].value;
     var paymentType = $(this).find('#quickpay_paymentType')[0].value;

     fetchBankProduct(paymentType , receiverProduct);
     paintInitiationScreen(receiverName , receiverAcc,  receiverProduct, receiverCurrency, receiverCode ,paymentType )
   });
}

function paintInitiationScreen(receiverName , receiverAcc, receiverProduct, receiverCurrency, receiverCode,
                paymentType ) {
  var receiver = '<div id="receiver_details" class="text-center" style="margin-top:35px;"><div id="receiver_avatar" class="receiver-avatar"><span class="receiver-avatar-initials">'+getCharacters(receiverName)+'</span></div>'+
                 '<div id="quickpay_receiver_name" class="pay-receiverName text-break">'+receiverName+'</div>'+
                 '<div id="quickpay_receiver_accNo" class="pay-receiverAccNo text-break">'+receiverAcc+'</div></div>'+
                 '<div class="input-field form-group messageForms-input" id="accountfield">'+
                     '<label class="required label-form-input" for="quickpay_debit_acc_no">'+getDashLabel('quickPay.fromAccount', 'From Account')+'</label>'+
                     '<select id="quickpay_debit_acc_no" tag="required" fieldLabel="'+getDashLabel('quickPay.fromAccount', 'From Account')+'" class="form-control col-sm-12" onblur="validateQuickPayFields(this)" onchange="getAccountCurrency(this);"><option value="">'+getDashLabel('quickPay.option.select', 'Select')+'</option></select>'+
                 '</div>'+
                 '<div id="bank_balance_section"></div>'+
                '<div id="cut_off_time_section" style="color:#ff9800;"></div>'+
                 '<div class="input-field form-group messageForms-input" id="amntfield">'+
                     '<label class="required label-form-input">'+getDashLabel('quickPay.amount', 'Amount')+'</label>'+
                     '<div class="input-group-append flex: 0 0 auto;">'+
                     '<span id="ccySymbol" style="padding-top:7px;padding-left: 6px;"></span>'+
                     '<input type="text" tag="required" fieldLabel="'+getDashLabel('quickPay.amount', 'Amount')+'"id="quickpay_amount" class="form-control" placeholder="0.00" onblur="validateQuickPayFields(this)">'+
                     '</div>'+
                 '</div>'+
                 '<div id="amount_in_words" class="quickPay-amount-in-words"></div>'+
                 '<div class="input-field form-group messageForms-input" id="referencefield">'+
                     '<label class="label-form-input">'+getDashLabel('quickPay.addReference', 'Add Reference')+'</label>'+
                     '<input type="text" tag="required" fieldLabel="'+getDashLabel('quickPay.addReference', 'Add Reference')+'"id="quickpay_reference" maxlength="20" value="'+generateUniqueString(paymentType,receiverProduct)+'"  class="form-control col-sm-12" onblur="validateQuickPayFields(this)">'+
                 '</div>'+
                 '<div id="quickpay_footer_section input-field"><button class="btn primary-button mt-4 w-100" id="quickpay_paynow" onclick="verifyQuickPayOnSubmit(\''+receiverAcc+'\',\''+receiverProduct+'\',\''+receiverName+'\',\''+receiverCurrency+'\',\''+receiverCode+'\',\''+ _dtCurrentDate.date+'\');">'+
                 getDashLabel('quickPay.btn.payNow', 'Pay Now')+'</button></div>';
                 
   $('#payment_initiation_screen').append(receiver);
    if(_strUserLocale=="ar_BH")
    {
    	$('#payment_initiation_screen').removeClass('pr-3');
		$('#payment_initiation_screen').css('padding-left','1rem!important');
   		$('#receiver_avatar').removeClass('receiver-avatar');
		$('#receiver_avatar').addClass('receiver-avatar-rtl');
		$('#accountfield').addClass('field-rtl');
		$('#amntfield').addClass('field-rtl');
		$('#referencefield').addClass('field-rtl');
    }
   paintDebitAccounts(debitAccountsLst);
   handleClickOnBackButton();
   document.getElementById('quickpay_amount').onkeyup = function (){
   var amntinWords = inWords($('#quickpay_amount').val().replace(/,/g, '').split('.')[0]);
   amntinWords =amntinWords.charAt(0).toUpperCase() + amntinWords.slice(1);
   if(amntinWords != "")
     document.getElementById('amount_in_words').innerHTML = amntinWords +'('+productCurrency+')';
};
  $('#quickpay_amount').autoNumeric('init',
					{
						aSep : _strGroupSeparator ? _strGroupSeparator : ',', 
						aDec : _strDecimalSeparator ? _strDecimalSeparator : '.', 
						mDec : _strAmountMinFraction ? _strAmountMinFraction : '2', 
                        vMin: '0.00' ,
                        vMax: '99999999999.99'
					});	       

}

function handleClickOnBackButton() {
 $('#quickpay_back_button i').click(function(){
 	 $('#more_quickpay_btn i').removeClass('d-none');
     $('#receiver_section').removeClass('d-none');
     $('#payment_initiation_screen').empty();
     $('#payment_initiation_screenErr').empty();
     $('#bene_search_section').empty();
     $('#recent_transactions_section').empty();
     $('#bene_search_section').append(quickPay_templates.quickPaySearch);
     paintReceiverSearch();
     $('#quickpay_back_button i').addClass('d-none');
   });
}

function paintDebitAccounts(debitAccounts) {
    $(debitAccounts).each(function(index, account){
       var accountData = '<option value="'+account.code+'" ccy="'+account.currency+'" >'+account.code+'</option>';
       $('#quickpay_debit_acc_no').append(accountData);
    });
}

function createPayment(receiverAcc, receiverProduct, receiverName, receiverCurrency, receiverCode, tnxDate) {
  var sendingAccount = $('#payment_initiation_screen').find('#quickpay_debit_acc_no').val();
  var amount = $('#payment_initiation_screen').find('#quickpay_amount').val();
  var reference = $('#payment_initiation_screen').find('#quickpay_reference').val();
  var strUrl = rootUrl+'/services/createWidgetPayment';
  var strData = {$sendingAccount: sendingAccount ,
                  $receivingAccount:receiverAcc ,
                  $amount:amount.replace(/,/g, ''),
                  $referenceNo:reference , 
                  $myProduct:receiverProduct, 
                  $reciverCode:receiverCode,
                  $receivingCcy:receiverCurrency, 
                  $reciverDesc:receiverName,
                  $txnDate:tnxDate,
                  $txnCurrency:sendingAccountCcy};
   $.ajax(
   {
		 type : 'POST',
		 data : strData,
		 url : strUrl,
		 dataType : 'json',
         async : false,
		 success : function( data )
		 {
			 paintSuccessMessage(data);
		 },
         failure : function(data) {
           $('#payment_icon i').append('clear');
           $('#payment_icon i').addClass('quickPay-error');
           $('#quickpay_success_header').append('Transaction failed due to technical error. Please try again');

         }                      
   });
}

function paintSuccessMessage(data) {
   $('#more_quickpay_btn i').removeClass('d-none');
   $('#receiver_section').addClass("d-none");
   $('#quickpay_success_screen').empty();
   $('#recent_transactions_section').empty();
   $('#payment_initiation_screenErr').empty();
   $('#bene_search_section').empty();
   if(data.root[0].status === 'SUCCESS' || data.root[0].status === 'SUCCESSWITHERR') {
     var successMessage ="";
     $('#quickpay_back_button i').addClass('d-none');
     $('#quickpay_success_screen').append(quickPay_templates.quickPaySuccess);
     $('#payment_initiation_screen').empty();
     $('#payment_icon i').append('check_circle');
     $('#payment_icon i').addClass('quickPay-success');
     $('#quickpay_success_header').append(getDashLabel('quickPay.transaction.'+data.root[0].status, 'Transaction created successfully'));
     if(data.root[0].status === 'SUCCESS')
     {
         successMessage = getDashLabel('quickPay.transaction.successMessage', 'This is to confirm that your account transaction with payment reference {0} has been processed successfully').replace('{0}', data.root[0].PirReference);
         $('#quickpay_sucess_message').append(successMessage);  
     }    
     else if(data.root[0].status === 'SUCCESSWITHERR') 
     {
         successMessage = getDashLabel('quickPay.transaction.successMessageErr', 'This is to confirm that your account transaction with payment reference {0} has been created with below Error'+"\n").replace('{0}', data.root[0].PirReference);
         $('#quickpay_sucess_message').append(successMessage);  
         for(var i=0;i< data.root[0].errors.length;i++)
         {
             $('#quickpay_sucess_messageErr').append(data.root[0].errors[i].errorMessage+"\n");
         }        
     }
   }
   else if(data.root[0].status === 'Failed') {
       var arrayJson = new Array();
       arrayJson.push({
           serialNo : 0,
           identifier : data.root[0].idetifier,
           userMessage : ''
       });
       var strUrl = rootUrl+'/services/paymentsbatch/discard.json?'+csrfTokenName+'='+ csrfTokenValue;
       $.ajax({
           url : strUrl,
           contentType : "application/json",
           data : JSON.stringify(arrayJson),
           type : 'POST',
           async : false,
           complete : function(XMLHttpRequest, textStatus) {}
       });
       var errMsges ='';
       for(var i=0;i< data.root[0].errors.length;i++)
       {
           errMsges  = errMsges + data.root[0].errors[i].errorMessage + " <br/> ";
       }
       $('#payment_initiation_screenErr').html(errMsges);
   }
}

function makeAnotherPayment() {
  $('#quickpay_success_screen').empty();
  $('#bene_search_section').append(quickPay_templates.quickPaySearch);
  $('#receiver_section').removeClass('d-none');
  paintReceiverSearch();
}

function verifyQuickPayOnSubmit(receiverAcc, receiverProduct, receiverName, receiverCurrency, receiverCode, tnxDate) {
 var fieldLabel, id, fieldRequired, value;
 var datavalid=new Array();
 $('#payment_initiation_screenErr').empty();
 $('#payment_initiation_screen').find('input[type=text],select').each(function() {
   fieldLabel= $(this).attr("fieldLabel");
   id= $(this).attr("id");
   fieldRequired=$(this).attr("tag");
   value = $(this).val();
   if((value =="" || value.split('.')[0]=="0" ) && fieldRequired!="") { 
      if(this.type=="select-one")  datavalid.push({'id':id, 'error':getDashLabel('quickLink.error.selectValidFeild','Please select valid ')+ ' ' +fieldLabel});
      if(this.type=="text")  datavalid.push({'id':id, 'error':getDashLabel('pleaseEnterValid','Please enter valid ')+ ' ' +fieldLabel});
   }
   });
   if(datavalid.length == 0)
	{
        $('#payment_initiation_screen .error-div').remove();
        $('#payment_initiation_screen .error-background').each(function() {
           $(this).removeClass('error-background');
        });
	 createPayment(receiverAcc, receiverProduct, receiverName, receiverCurrency, receiverCode, tnxDate);
	}
   else {
       $('#payment_initiation_screen .error-div').remove();
         var r = 0;
         for (r=0;r<datavalid.length;r++)
         {
             if(datavalid[r].id=="quickpay_amount")
             {
                 document.getElementById('amount_in_words').innerHTML ="";
                 paintErrorMessageToParentDiv(datavalid[r],datavalid[r].id); 
             }
             else
                 paintErrorMessage(datavalid[r]); 
         }
     }
}

function validateQuickPayFields(field){
  var fieldVal = field.value;
  var fieldRequired=field.attributes.tag.value;
  var id= field.attributes.id.value;
  var fieldLabel = field.attributes.fieldLabel.value;
  if (fieldRequired!="" && (fieldVal ==""|| fieldVal.split('.')[0]=="0" ))
    {  
       let error;
       if(field.type=="select-one")  error = {'id':id, 'error':getDashLabel('quickLink.error.selectValidFeild','Please select valid ')+ ' ' +fieldLabel};
       else error = {'id':id, 'error':getDashLabel('pleaseEnterValid','Please enter valid ')+ ' ' +fieldLabel};
       if(id=="quickpay_amount")
       {
           document.getElementById('amount_in_words').innerHTML ="";
           paintErrorMessageToParentDiv(error,id); 
       }
       else
           paintErrorMessage(error,id);
    }else{
       if(id=="quickpay_amount")
       {
           removeErrorDiv(field);
       }
       else
       {
           $('#'+field.id).parent().find('.error-div').remove();
           $('#'+field.id).parent().removeClass('error-background');
           $('#'+field.id).removeClass('error-border');
       }
	}
}

function removeErrorDiv(field)
{
    $('#'+field.id).parent().parent().find('.error-div').remove();
    $('#'+field.id).parent().parent().removeClass('error-background');
    $('#'+field.id).removeClass('error-border');
}

function paintErrorMessageToParentDiv(errorMsg,id){
    $('#'+errorMsg.id).parent().parent().find('.error-div').remove();
    let errorDiv = document.createElement('div');    
    if(_strUserLocale=="ar_BH")
    {
   		 errorDiv.setAttribute('class', 'error-div-rtl');
    }
    else
    {
    	errorDiv.setAttribute('class', 'error-div');
    }
    errorDiv.innerHTML= errorMsg.error.trim();
        $('#'+errorMsg.id).parent().parent().append(errorDiv);
        $('#'+errorMsg.id).addClass('error-border');
        $('#'+errorMsg.id).parent().parent().addClass('error-background');   
}
function inWords (num) {
    if ((num = num.toString()).length > 9) return 'overflow';
    n = ('000000000' + num).substr(-9).match(/^(\d{2})(\d{2})(\d{2})(\d{1})(\d{2})$/);
    if (!n) return; var str = '';
    str += (n[1] != 0) ? (a[Number(n[1])] || b[n[1][0]] + ' ' + a[n[1][1]]) + 'crore ' : '';
    str += (n[2] != 0) ? (a[Number(n[2])] || b[n[2][0]] + ' ' + a[n[2][1]]) + 'lakh ' : '';
    str += (n[3] != 0) ? (a[Number(n[3])] || b[n[3][0]] + ' ' + a[n[3][1]]) + 'thousand ' : '';
    str += (n[4] != 0) ? (a[Number(n[4])] || b[n[4][0]] + ' ' + a[n[4][1]]) + 'hundred ' : '';
    str += (n[5] != 0) ? ((str != '') ? 'and ' : '') + (a[Number(n[5])] || b[n[5][0]] + ' ' + a[n[5][1]]) + 'only ' : '';
    return str;
}

function closeQuickPay() {
   if($('#quickpaydiv').is(':visible')) {
   		$('#quickpay_success_screen').empty();
	    $('#quickpaydiv').modal('hide'); 
      }
}

function handleRecentTransactions() { 
  $('#recent_transactions').click(function(){
     var filter='';
     var receiverName = $('#payment_initiation_screen').find('#quickpay_receiver_name').length == 0 ? '' : $('#payment_initiation_screen').find('#quickpay_receiver_name')[0].innerText;
     if (receiverName !='') filter= "(ReceiverNamePDT eq \'" +receiverName + "\')";
      fetchRecentTransactions(filter);
  });
}

function paintRecentTransactions(data) {
 $('#receiver_section').addClass('d-none');
 $('#payment_initiation_screenErr').empty();
 $('#quickpay_back_button i').removeClass('d-none');
 $('#recent_transactions_section').empty();
 $('#bene_search_section').empty();
 $('#bene_search_results_section').empty();
 $('#payment_initiation_screen').empty();
 $('#quickpay_success_screen').empty();
 $('#more_quickpay_btn i').addClass('d-none');
 let header = '<h5 class="mt-2">'+getDashLabel('quickPay.recentTransactions')+'</h5>';
 $('#recent_transactions_section').append(header);
 handleClickOnBackButton();
 
 if (data.root.actionRowList && data.root.actionRowList.length === 0) {
	$('#recent_transactions_section').append('<h6>'+getDashLabel("quickPay.noRecentTxn")+'</h6>');
	return ;
 }
 $(data.root.actionRowList).each(function(index, tnx){
  let amountWithCurrency = decodeURIComponent(tnx.record.currency) + ' ' + DataRender.amountFormatter(tnx.record.amount, {
							groupSeparator    : _strGroupSeparator, 
							decimalSeparator  : _strDecimalSeparator, 
							amountMinFraction : _strAmountMinFraction, 
						});
  let floatalign ='float-right';
  if(_strUserLocale=="ar_BH")
  {
  	floatalign ='float-left';
  }
  let tnxDetails = '<div id="recent_tnx_'+ index +'" class="row quickpay_recent_tnx">'+
                   '<div class="col-2 uxg-quickpay-avatar">'+getCharacters(tnx.record.recieverName)+'</div>'+
                      '<div class="col-10" style="font-size:14px">'+
                        '<div class="text-break" style="font-size:13px">'+tnx.record.entryDate+'</div>'+
                        '<div id="recent_tnx_receiver_desc" class="font-weight-bold text-break quickPay-recentTnx-receiverDesc">'+tnx.record.recieverName+'</div>'+
                        '<div id="recent_tnx_receiver_accountNo" class="font-weight-bold text-break">'+tnx.record.recieverAccount+'</div>'+
                        '<div class="text-break" style="font-size:13px">'+tnx.record.beneBankDescription+'</div>'+
                        '<div class="font-weight-bold text-break quickPay-recentTnx-amount">'+ amountWithCurrency  +'<span><button class="btn primary-button '+floatalign+'" id="quickpay_pay_again_btn" onclick="initiatePaymentFromRecentTnx();">'+getDashLabel('quickPay.pay','Pay')+'</button></span></div>'+
                        '<input type="hidden" id="recent_tnx_quickpay_myProduct" name="recent_tnx_quickpay_myProduct" value="'+tnx.record.productType+'">'+
                        '<input type="hidden" id="recent_tnx_quickpay_currency" name="recent_tnx_quickpay_currency" value="'+tnx.record.receiverCcy+'">'+
                        '<input type="hidden" id="recent_tnx_quickpay_receiver_code" name="recent_tnx_quickpay_receiver_code" value="'+tnx.record.receiverShortCode+'">'+
                        '<input type="hidden" id="recent_tnx_quickpay_paymentType" name="recent_tnx_quickpay_paymentType" value="'+tnx.record.productCategory+'">'+
                        '<input type="hidden" id="recent_tnx_quickpay_sendingAccount" name="recent_tnx_quickpay_sendingAccount" value="'+tnx.record.sendingAccount+'">'+
                        '<input type="hidden" id="recent_tnx_quickpay_amount" name="recent_tnx_quickpay_amount" value="'+tnx.record.amount+'">'+
                      '</div>'+
                   '</div>';
  $('#recent_transactions_section').append(tnxDetails);
  
   if(_strUserLocale=="ar_BH")
    {
		$('#recent_transactions_section').addClass('field-rtl');
    }
});
}

function generateUniqueString(paymentType, product) {
    var d = new Date();
    var str = (paymentType.length > 4 ? paymentType.substr(0,4) :getTextPadding( paymentType,4, 0) )+
               (product.length > 4 ? product.substr(0,4) : getTextPadding( product,4, 0) )+      
               ((""+_dtCurrentDate.date).replace(/\//g, '')).substr(0,4);
        str = str + getTextPadding (d.getHours(),2, 0)+getTextPadding(d.getMinutes(),2,0)+
                        getTextPadding(d.getSeconds(),2,0) ;
    return str ;
}

function getTextPadding(inputString, length , paddingString)
{
    var str = (""+inputString).padStart(length, paddingString);
    return str;
}

function paintCutOffTime( strUpdatedTimeTwentyFour ,cuttoffTime) {
    $('#cut_off_time_section').empty();
    if(new Date ('1/1/1999 ' + strUpdatedTimeTwentyFour.trim()) > new Date ('1/1/1999 ' + cuttoffTime)  )    
    {
        var cutOffContent = '<span class="pl-2" style="font-size:13px;color:red;">'+getDashLabel('quickPay.cutOffTimeIsExceeded',
                                        'Cut-Off Time has exceeded.')+'</span>';
        $('#cut_off_time_section').append(cutOffContent);
    }
    else
    {
        var cutOffContent = '<i class="material-icons align-middle">query_builder</i>' +
                        '<span class="pl-2" style="font-size:13px">'+getDashLabel('quickPay.cutOffTime', 'Cut Off Time')+': ' +
                         $.datepicker.formatDate( "dd/mm/yy", new Date)+ ': ' + cuttoffTime +            
                        '</span>';
        $('#cut_off_time_section').append(cutOffContent);
    }

}

function initiatePaymentFromRecentTnx() {
   $('.quickpay_recent_tnx').click(function(){
     $('#recent_transactions_section').empty();
     $('#payment_initiation_screen').empty();
     $('#payment_initiation_screenErr').empty();
     $('#quickpay_back_button i').removeClass('d-none');
     var receiverName = $(this).find('#recent_tnx_receiver_desc')[0].innerText;
     var receiverAcc = $(this).find('#recent_tnx_receiver_accountNo')[0].innerText;
     var receiverCurrency = $(this).find('#recent_tnx_quickpay_currency')[0].value;
     var receiverProduct = $(this).find('#recent_tnx_quickpay_myProduct')[0].value;
     var receiverCode = $(this).find('#recent_tnx_quickpay_receiver_code')[0].value;
     var paymentType = $(this).find('#recent_tnx_quickpay_paymentType')[0].value;

     fetchBankProduct(paymentType , receiverProduct);
     paintInitiationScreen(receiverName , receiverAcc,  receiverProduct, receiverCurrency, receiverCode ,paymentType );
     $('#payment_initiation_screen').find('#quickpay_debit_acc_no').val($(this).find('#recent_tnx_quickpay_sendingAccount')[0].value);
     if($('#quickpay_debit_acc_no').val() !== ""){
     	getAccountCurrency(this);
     }
     $('#payment_initiation_screen').find('#quickpay_amount').val(DataRender.amountFormatter($(this).find('#recent_tnx_quickpay_amount')[0].value, {
							groupSeparator    : _strGroupSeparator, 
							decimalSeparator  : _strDecimalSeparator, 
							amountMinFraction : _strAmountMinFraction, 
						}));
   });
}

function getAccountCurrency()
{
    sendingAccountCcy = $('#payment_initiation_screen').find('#quickpay_debit_acc_no').find(':selected').attr('ccy');
    if(sendingAccountCcy)
    {
        document.getElementById('ccySymbol').innerHTML =FCM.CurrencyList[sendingAccountCcy].symbol;
        if(prdDtls[sendingAccountCcy].ProductCount==1)
        {
            paintCutOffTime( strUpdatedTimeTwentyFour ,prdDtls[sendingAccountCcy][1].cutoffTime);
        }
        else
        {
            $('#cut_off_time_section').empty();//if more than two product
        }
    }
    else
    {
        document.getElementById('ccySymbol').innerHTML ="";
        document.getElementById('quickpay_amount').value ="0.00";
    }
}

function showHideReceiverMasterOption()
{
    $('#add_manage_beneficiaries').addClass('d-none');
    var menuData = jQuery.parseJSON(_strMenuData);
    if(menuData && menuData.menu !== undefined && menuData.menu.length !== 0)
    {
		for(var i=0;i< menuData.menu.length;i++)
        {
			if(menuData.menu[i].weight === 8)
            {
                $('#add_manage_beneficiaries').removeClass('d-none');
                break;
            }
        }
	}
}