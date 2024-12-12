var responseVar;
var productResponseVar;

function populateParameters(sendingAccount,currency,packageId,type,productCode)
{
	var sendingDept = $('#sendingDept').val();
	if(type === 'S')
	{
	$('#packageId').val('');
	$('#productCode').val('');
	$('#payoutMode').val("");
	$('#paymentCurr').val("");
	$('#bankIdType').val("");
	$('#payoutBranch').val("");
	$('#payoutBranchDesc').val("");
	$('#bankSearchText').val("");
	$('#branchDesc').val("");
	$('#bankCode').val("");
	$('#branchCode').val("");
	$('#clearingLoc').val("");
	$('#clearingLocDesc').val("");
	$('#recvAccNo,#currency,#delvMode,#name,#email,#address').val('');
	$('#bankIdType,#productCode').empty().append($('<option>', {
		value: '',
		text : 'Select',
		selected:true
	}));
	}
	populateAccAndCurrency(sendingDept,sendingAccount);
	//populateCurrencyDropDown(currency);
	//populateIdentifierValues(sendingDept,identifierType);
	if(!isEmpty(sendingDept) && (verModeFlag !== 'VERIFY' || $('#MODE').val() === "VIEW"))
	{
	populatePackage(sendingDept,packageId);
	
    if(!isEmpty(packageId)){
    	   populateProduct(sendingDept,packageId,productCode);
    }
	}
}
function populateAccAndCurrency(sendingDept,sendingAccount)
{
	var strUrl = "services/payoutParameter/getAccountList.json?$clientId="+sendingDept;
	$('#sendingAcc').empty().append($('<option>', {
		value: '',
		text : 'Select',
		selected:true
	}));
	
	$.ajax({
		url : strUrl,
		method : "GET",
		async : false,
		data : {
			$autofilter : $('#sendingDept').val()
		},
		success : function(response) {
			if(response.length !== 0) {
			responseVar = response.d.accounts;
			
			$.each(response.d.accounts, function (i, item) {
				$('#sendingAcc').append($('<option>', { 
					value: item.acctNmbr,
					title: item.acctNmbr,
					text : item.acctNmbr +' - '+item.acctName 
				}));
				
			});
			}
			if(sendingAccount !== "")
				{
					$('#sendingAcc').val(sendingAccount);
					setAccParameters(sendingAccount,'L');
				}
		},
		failure : function(response) {
		}
	});
}
function populatePackage(sendingDept,packageId)
{
	var strUrl = "services/payoutParameter/getPackageList.json?$clientId="+sendingDept;
	$('#packageId').empty().append($('<option>', {
		value: '',
		text : 'Select',
		selected:true
	}));
	
	$.ajax({
		url : strUrl,
		method : "GET",
		async : false,
		data : {
			$autofilter : $('#sendingDept').val()
		},
		success : function(response) {
			if(response.length !== 0)
			{
			$.each(response, function (i, item) {
				$('#packageId').append($('<option>', { 
					value: item.filterValue,
					text : item.filterCode,
					productCode : item.additionalValue1
				}));
									
			});
			}
			if(packageId !== "")
				{
				$('#packageId').val(packageId);
				}
		},
		failure : function(response) {
		}
	});
}

function populateProduct(sendingDept,packageId,productCode)
{
    var strUrl = "services/payoutParameter/getProductList.json?$clientId="+sendingDept;
    $('#payoutMode').val('');
    $('#productCode').empty().append($('<option>', {
        value: '',
        text : 'Select',
        selected:true
    }));
    $.ajax({
        url : strUrl,
        method : "GET",
        async : false,
        data : {
            $autofilter : $('#sendingDept').val(),
            $filter : packageId
        },
        success : function(response) {
            if(response.length !== 0 &&  response.d &&  response.d.accounts)
            {
            productResponseVar = response.d.accounts;
            $.each(response.d.accounts, function (i, item) {
                $('#productCode').append($('<option>', { 
                    value: item.productCode,
                    text : item.productName
                }));
                                    
            });
            }
            if(productCode !== '')
                {
                $('#productCode').val(productCode);
                setPayoutMode(productCode);
                //setProductTypeOnLoad(productCode);
                }
        },
        failure : function(response) {
        }
    });
}

function populateIdentifierValues(product,identifierType)
{
	$('#bankIdType').empty().append($('<option>', {
		value: '',
		text : 'Select',
		selected:true
	}));
    var productCode = '%'; ;
    if(!isEmpty($('#productCode').val())){
    	productCode = $('#productCode').val();
    }
	$.ajax({
		url : 'services/userseek/payoutBankIdSeek.json',
		method : "GET",
		async : false,
		data : {
			$autofilter : productCode,
			$filtercode1 : $('#packageId').val()
		},
		success : function(response) {
			
			if(response !== undefined)
			{
			$.each(response.d.preferences, function (i, item) {
				$('#bankIdType').append($('<option>', { 
					value: item.CODE,
					text : item.DESCRIPTION 
				}));
									
			});
			}
			if(identifierType !== "")
			{
				$('#bankIdType').val(identifierType);
			}
		},
		failure : function(response) {
		}
	});
}

jQuery.fn.BankIdAutoComplete = function() {
	return this.each(function() {
		$(this).autocomplete({
			source : function(request, response) {
				$.ajax({
							url : "services/userseek/payoutIdentifier.json",
							type : 'POST',
							dataType : "json",
							data : {
								$top : 20,
								$filtercode1 : seller,
								$autofilter : request.term,
								$filtercode2 : $('#bankIdType').val(),
								$filtercode3 : ''
							},
							success : function(data) {
								var rec = data.d.preferences;
								if (rec.length > 0) {
									response($.map(rec, function(item) {
												return {
													label : item.BRANCHDESCRIPTION,
													bankDesc : item.BANKDESCRIPTION,
													value : item.ROUTINGNUMBER,
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
				if (!isEmpty(data.BANKCODE)) {
				$('#bankCode').val(data.BANKCODE);
				}
					if(!isEmpty(data.ROUTINGNUMBER)){
						//$('#bankIdType').val(data.ROUTINGNUMBER);
						$('#bankSearchText').val(data.ROUTINGNUMBER);
					}	
					
					if (!isEmpty(data.BRANCHDESCRIPTION))
					{
						$('#branchDesc').val(data.BRANCHDESCRIPTION);
					}
					if (!isEmpty(data.BRANCHCODE))
					{
						$('#branchCode').val(data.BRANCHCODE);
					}
					if(!isEmpty(data.CLEARING_LOC_CODE))
					{
						$('#clearingLoc').val(data.CLEARING_LOC_CODE);
						$('#clearingLocDesc').val(data.CLEARING_LOC_DESC);
					}
				}
				
			},
			focus:function(event,ui){
				 var item=ui.item;
				 $(".ui-autocomplete > li").attr("title",item.value+' | '+item.label);
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
					+ item.value + ' | ' + '</ul><ul">' + item.label + '</ul></ol></a>'
			return $("<li></li>").data("item.autocomplete", item)
					.append(inner_html).appendTo(ul);
		};*/
	});
};

jQuery.fn.BankByNameAutoComplete = function() {
	
	return this.each(function() {
					$(this).autocomplete({
					source : function(request, response) {
						$.ajax({
									url :'services/userseek/payoutBankName.json',
									dataType : "json",
									type:'POST',
									data : {
										$top:-1,
										$filtercode1: seller,
										$autofilter : request.term,
										$filtercode2 : $('#bankIdType').val(),
										$filtercode3 : ''
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
							if (!isEmpty(data.BRANCHDESCRIPTION))
							{
								$('#branchDesc').val(data.BRANCHDESCRIPTION);
							}
							if (!isEmpty(data.ROUTINGNUMBER))
							{
								$('#bankSearchText').val(data.ROUTINGNUMBER);
							}
							if (!isEmpty(data.BRANCHCODE))
							{
								$('#branchCode').val(data.BRANCHCODE);
							}
							if(!isEmpty(data.CLEARING_LOC_CODE))
							{
								$('#clearingLoc').val(data.CLEARING_LOC_CODE);
								$('#clearingLocDesc').val(data.CLEARING_LOC_DESC);
							}
							if (!isEmpty(data.BANKCODE)) {
                                $('#bankCode').val(data.BANKCODE);
                            }
						}
						
					},
					open : function() {
					},
					close : function() {
					},
					focus:function(event,ui){
					$(".ui-autocomplete > li").attr("title", ui.item.label+' | '+ui.item.bankDesc);	
					}
				});/*.data("autocomplete")._renderItem = function(ul, item) {
			var inner_html = '<a><ol class="t7-autocompleter"><ul">'
					+ item.label + ' | '
					+ '</ul><ul">'
					+ item.bankDesc + '</ul></ol></a>';
			return $("<li></li>").data("item.autocomplete", item)
					.append(inner_html).appendTo(ul);
		};*/
	});
};


function setAccParameters(accVal,action)
{
	if (accVal === '')
	{
		$('#paymentCurr').val("");
		$('#payoutBranchDesc').val("");
		$('#payoutBranch').val("");
	}
	else
	{
		if(responseVar !== undefined && responseVar.length !== 0){
		$.each(responseVar, function (i, item) {
			if(item.acctNmbr === accVal)
			{
			$('#paymentCurr').val(item.pccyCode);
			if(action === 'S' && currencyVal === '' && firstLoad)
			{
				$('#currency').val(item.pccyCode);
				firstLoad = false;
			}
			$('#payoutBranch').val(item.bankDesc);
			$('#payoutBranchDesc').val(item.accountAdditionalInfo1);
			}
		});
		}
	}
	
}
function setPayoutMode(prodCode)
{
	if(productResponseVar !== undefined && productResponseVar.length !== 0){
	$.each(productResponseVar, function (i, item) {
		if(item.productCode === prodCode)
		{		
		    $('#payoutMode').val(item.productCatType);	
		}
	});
}

}

function checkValidations()
{
	errorFlag = false;
	$("#errorMessage").html('');
	
	if($('#sendingDept').val() === ""){
		$('<p>' +getLabel('error.payout.sendingDept','Sending Department is required') + '</p>').appendTo('#errorMessage');
		errorFlag = true;
	}
	if($('#sendingAcc').val() === ""){
		$('<p>' +getLabel('error.payout.sendingAcc','Sending Account is required') + '</p>').appendTo('#errorMessage');
		errorFlag = true;
	}
	if($('#packageId').val() === ""){
		$('<p>' +getLabel('error.payout.package','Payment Package is required') + '</p>').appendTo('#errorMessage');
		errorFlag = true;
	}
	if($('#name').val() === ""){
		$('<p>' + getLabel('error.payout.name','Receiver Name is required') + '</p>').appendTo('#errorMessage');
		errorFlag = true;
	}
	if($('#email').val() === ""){
		$('<p>' + getLabel('error.payout.email','Receiver Email is required') + '</p>').appendTo('#errorMessage');
		errorFlag = true;
	}
	if($('#email').val() !== "")
		{
		if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{1,})+$/.test($('#email').val()) === false)  
		{
			$('<p>' + getLabel('error.payout.invEmail','Invalid Email') + '</p>').appendTo('#errorMessage');
			errorFlag = true;
		}
		}
	if($('#recvAccNo').val() === ""){
		$('<p>' + getLabel('error.payout.accNo','Receiver Account No is required') + '</p>').appendTo('#errorMessage');
		errorFlag = true;
	}
	if($('#currency').val() === ""){
		$('<p>' + getLabel('error.payout.currency','Currency is required') + '</p>').appendTo('#errorMessage');
		errorFlag = true;
	}
	if($('#bankIdType').val() === ""){
		$('<p>' + getLabel('error.payout.identifierType','Identifier Type is required') + '</p>').appendTo('#errorMessage');
		errorFlag = true;
	}
	if($('#bankSearchText').val() == ""){
		$('<p>' + getLabel('error.payout.identifier','Identifier is required') + '</p>').appendTo('#errorMessage');
		errorFlag = true;
	}
	if($('#address').val() == ""){
		$('<p>' + getLabel('error.payout.address','Address is required') + '</p>').appendTo('#errorMessage');
		errorFlag = true;
	}
	
	var enteredText = $('#address').val();
	var numberOfLineBreaks = (enteredText.match(/\n/g)||[]).length;
	var characterCount = enteredText.length + numberOfLineBreaks;

	if(characterCount > 255){
		$('<p>' + getLabel('','Address Length can not exceed 255 characters.') + '</p>').appendTo('#errorMessage');
	errorFlag = true;
	}
	$('#errorDiv1').removeClass("ui-helper-hidden");
	
	
}
function clearPopUpDetails()
{
	$('#sendingDept').val("");
	$('#sendingAcc').val("");
	$('#productCode').val("");
	$('#paymentCurr').val("");
	$('#payoutBranch').val("");
	$('#payoutBranchDesc').val("");
	$('#name').val("");
	$('#email').val("");
	$('#recvAccNo').val("");
	$('#currency').val("");
	$('#bankIdType').val("");
	$('#bankSearchText').val("");
	$('#branchDesc').val("");
	$('#address').val("");
	$('#delvMode').val("C");
	$('#bankIdType').empty().append($('<option>', {
		value: '',
		text : 'Select',
		selected:true
	}));
	$('#clearingLoc').val("");
	$('#clearingLocDesc').val("");
	$("#errorMessage").html('');
	$('#errorDiv1').addClass("ui-helper-hidden");
	populateParameters('','','','S');
}
function setProductType(productCode) {
	
	if (productCode === '')
	{
		$('#clearingLoc').val("");
		$('#clearingLocDesc').val("");
		payoutProductType='';
	}
	else
	{
	var strUrl = "services/payoutParameter/getProductType.json?$productCode="
			+ productCode;
	$.ajax({
				url : strUrl,
				method : "GET",
				async : false,
				success : function(response) {

					if (response !== undefined) {
						payoutProductType = response.productType;
						if (payoutProductType !== "P")
						{
							$('#clearingLoc').val("DEFAULT");
							$('#clearingLocDesc').val("Default");
						}
						else
						{
							$('#clearingLoc').val("");
							$('#clearingLocDesc').val("");
						}
					}
				},
				failure : function(response) {
				}
			});
	}
}
function populateIdentifierValuesForView(productCode,identifierType)
{
	
	$.ajax({
		url : 'services/userseek/payoutBankIdSeek.json',
		method : "GET",
		async : false,
		data : {
			$autofilter : productCode
		},
		success : function(response) {
			
			if(response !== undefined)
			{
			$.each(response.d.preferences, function (i, item) {
				if(item.CODE === identifierType){
					$('#identifierTypeSpan').text(item.DESCRIPTION);
				}
					
			});
		
			}
		},
		failure : function(response) {
		}
	});
}
function resetIdentifier()
{
	$('#bankSearchText').val("");
	$('#branchDesc').val("");
	$('#bankCode').val("");
	$('#branchCode').val("");
	if (payoutProductType === "P")
	{
		$('#clearingLoc').val("");
		$('#clearingLocDesc').val("");
	}
}
function setProductTypeOnLoad(productCode)
{
	if (productCode === '')
	{
		$('#clearingLoc').val("");
		$('#clearingLocDesc').val("");
		payoutProductType='';
	}
	else
	{
	var strUrl = "services/payoutParameter/getProductType.json?$productCode="
			+ productCode;
	$.ajax({
				url : strUrl,
				method : "GET",
				async : false,
				success : function(response) {

					if (response !== undefined) {
						payoutProductType = response.productType;
					}
				},
				failure : function(response) {
				}
			});
	}
}