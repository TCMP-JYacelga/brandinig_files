var accrualTranTypeArray = new Array( "('Interest','01')", "('Benefit','02')", "('Both','09')" );
var settlementCPTranTypeArray = new Array( "('Interest','03')", "('Benefit','04')", "('Both','10')" );
var settlementCBTranTypeArray = new Array( "('Interest','03')", "('Apportionment','05')" );

function createBankClientCodeAutoCompletor(sellerId) {
	$('#clientCodeDiv').val('');
	$('#agreementIdDiv').val('');
	var sellerCodeValue = sellerId.value;
	$('#clientCodeDiv').autocomplete({
		minLength : 1,
		source : function(request, response) {
			$.ajax({
						url : 'services/userseek/notionalQueryBankClientIdSeek.json',
						type : 'POST',
						data : {
							'$filtercode1' : sellerCodeValue,
							'$autofilter' : $('#clientCodeDiv').val()
						},
						success : function(data) {								
							if (!isEmpty(data) && !(isEmpty(data.d))) {
								var rec = data.d.preferences;
								if( rec.length == 0 ) {
									results = [{
												label : '',
												CODE : getLabel('norecordFound','No Records Found')}
												];
									response(results);
								}
								else {
								response($.map(rec, function(item) {
											return {
												value : item.CODE,
												label : item.DESCRIPTION,
												CODE : item.CODE,
												DESCRIPTION : item.DESCRIPTION,
												SHORTNAME : item.SHORTNAME
											}
										}));
								}
							}
						}
					});
		},
		select : function(event, ui) {
			event.preventDefault();
			$("#clientId").val(ui.item.CODE);
			$("#clientDesc").val(ui.item.DESCRIPTION);
			$('#clientCodeDiv').val(ui.item.DESCRIPTION);
			$("#agreementDesc").val('');
			$("#agreementIdDiv").val('');
			createAgreementIdAutoCompletor(sellerCodeValue, $("#clientId").val());
		},
		change : function(event, ui) {
			if (isEmpty($('#clientCodeDiv').val())
					|| $('#clientCodeDiv').val() == '%') {
				$('#clientCodeDiv').val('');
				$('#clientId').val('');
				$('#clientDesc').val('');
				$("#agreementCode").val('');
				$("#agreementDesc").val('');
				$("#agreementRecKey").val('');
				createAgreementIdAutoCompletor(sellerCodeValue, null);
			}
		}
	}).data("autocomplete")._renderItem = function(ul, item) {
		var inner_html;
		if( item.CODE == getLabel('norecordFound','No Records Found') ) {
			inner_html = '<a><ol class="t7-autocompleter"><ul">'+ item.CODE + ' '+'</ul"><ul">' + item.label
			+ '</ul"></ol></a>';
		} else {
			
			inner_html = '<a><ol class="t7-autocompleter"><ul">'+ item.SHORTNAME + ' | '+'</ul"><ul">' + item.label
				+ '</ul"></ol></a>';
		}
		return $("<li></li>").data("item.autocomplete", item)
				.append(inner_html).appendTo(ul);
	};	
}

function createAgreementIdAutoCompletor( sellerCodeValue, clientCodeValue )
{
	$('#agreementIdDiv').val('');
	$("#agreementCode").val('');
	$("#agreementDesc").val('');
	$("#agreementRecKey").val('');
	var seekID = 'notionalQueryAgreementIdSeek';
	$('#agreementIdDiv').autocomplete({
		minLength : 1,
		source : function(request, response) {

			$.ajax({
				url : 'services/userseek/' + seekID + '.json',
				type : 'POST',
				data : (null == clientCodeValue || '' == clientCodeValue) ? {
					'$filtercode1' : sellerCodeValue,
					'$autofilter' : $('#agreementIdDiv').val()
				} : {
					'$filtercode1' : sellerCodeValue,
					'$filtercode2' : clientCodeValue,
					'$autofilter' : $('#agreementIdDiv').val()
				},
				success : function(data) {
					if (!isEmpty(data) && !(isEmpty(data.d))) {
						var rec = data.d.preferences;
						if( rec.length == 0 ) {
							results = [{
										label : '',
										CODE : getLabel('norecordFound','No Records Found')}
										];
							response(results);
						} else {
						response($.map(rec, function(item) {
									return {
										value : item.CODE,
										label : item.DESCRIPTION,
										CODE : item.CODE,
										DESCRIPTION : item.DESCRIPTION,
										RECKEY : item.RECKEY,
										STRUCTURE_TYPE : item.STRUCTURE_TYPE,
										STRUCTURE_SUBTYPE : item.STRUCTURE_SUBTYPE
									}
								}));
						}
					}
				}
			});
		},
		select : function(event, ui) {
			$("#agreementCode").val(ui.item.CODE);
			$("#agreementDesc").val(ui.item.DESCRIPTION);
			$("#agreementRecKey").val(ui.item.RECKEY);
			$("#structureType").val(ui.item.STRUCTURE_TYPE);
			$("#structureSubType").val(ui.item.STRUCTURE_SUBTYPE);
			resetPartGrpOrAccFiels();
			setTransactionType($("#queryType").val());
		},
		change : function(event, ui) {
			if ($('#agreementIdDiv').val() === ''
					|| $('#agreementIdDiv').val() == null
					|| $('#agreementIdDiv').val() == '%') {
				$('#agreementIdDiv').val('');
				$("#agreementCode").val('');
				$("#agreementDesc").val('');
				$("#agreementRecKey").val('');
			}
		},
		focus:function(event,ui){
			$(".ui-autocomplete > li").attr("title", ui.item.CODE+' | '+ui.item.DESCRIPTION);	
		}
	}).data("autocomplete")._renderItem = function(ul, item) {
		var inner_html;
		if( item.CODE == getLabel('norecordFound','No Records Found') ) {
			inner_html = '<a><ol class="t7-autocompleter"><ul">'+ item.CODE + ' '+'</ul"><ul">' + item.label
			+ '</ul"></ol></a>';
		} else {
			
			inner_html = '<a><ol class="t7-autocompleter"><ul">'+ item.CODE + ' | '+'</ul"><ul">' + item.label
				+ '</ul"></ol></a>';
		}
		return $("<li></li>").data("item.autocomplete", item)
				.append(inner_html).appendTo(ul);
	};
}

function createPartGrpOrAcctAutoCompletor( queryType, tranType )
{	
		document.getElementById( "partGrpOrAcctDiv" ).innerHTML = "";
		var agreementRecKeyValue = document.getElementById( "agreementRecKey" ).value;
		var cfgParam2 = 'P';
		var cfgParam3 = 'G';
		var cfgParam4 = 'A';
		var structureType = document.getElementById( "structureType" ).value;
		var structureSubType = document.getElementById( "structureSubType" ).value;

		if( structureType == 'CP' )
		{
			cfgParam3 = 'PA';
		}
		else if( structureType == 'TE' )
		{
			cfgParam2 = 'A';
			cfgParam3 = 'A';
		}
		else if( structureType == 'CB' )
		{
			if( queryType == '2' ) // accrual
			{
				cfgParam3 = 'P';
				cfgParam4 = 'P';
			}
			else if( queryType == '3' ) // settlement
			{
				if( tranType == '03' ) // Interest
				{
					if( structureSubType == '1' || structureSubType == '2' )
					{
						cfgParam3 = 'P';
						cfgParam4 = 'P';
					}
					else if( structureSubType == '3' || structureSubType == '4' )
					{
						cfgParam3 = 'PA';
					}
				}
				else if( tranType == '05' ) // Apportionment
				{
					var cfgParam2 = 'GA';
				}
			}
		}

		$('#partGrpOrAcctDiv').autocomplete({
		minLength : 1,
		source : function(request, response) {

			$.ajax({
				url : 'services/userseek/notionalQueryPoolSgAcctSeek.json',
				type : 'POST',
				data : {'$filtercode1':agreementRecKeyValue, '$filtercode2':cfgParam2,  '$filtercode3':cfgParam3, '$filtercode4':cfgParam4,'$autofilter' : $('#partGrpOrAcctDiv').val()},
				success : function(data) {
					if (!isEmpty(data) && !(isEmpty(data.d))) {
						var rec = data.d.preferences;
						if( rec.length == 0 ) {
							results = [{
										label : '',
										CODE : getLabel('norecordFound','No Records Found')}
										];
							response(results);
						} else {
						response($.map(rec, function(item) {
									return {
										value : item.CODE,
										label : item.NODE_TYPE,
										CODE : item.CODE,
										NODE_TYPE : item.NODE_TYPE,
										IDENTIFIER_KEY : item.IDENTIFIER_KEY
									}
						}));
				}
			}
		}
	});
		},
		select : function(event, ui) {
			event.preventDefault();
			document.getElementById("groupOrAcct").value = ui.item.IDENTIFIER_KEY;
			document.getElementById("groupOrAcctDesc").value = ui.item.CODE;
			document.getElementById("nodeType").value = ui.item.NODE_TYPE;
			if(ui.item.CODE == getLabel('norecordFound','No Records Found')){
			$('#partGrpOrAcctDiv').val('');
			}
			else{
				$('#partGrpOrAcctDiv').val(ui.item.CODE);
			}
//			$('#queryType').val('');
//			$( '#transactionTypeDiv' ).css( "display", "none" );
//			$( '#tranType' ).css( "display", "none" );
//			$( '#partGrpOrAcctLabelDiv' ).css( "display", "none" );
		},
		change : function(event, ui) {
			if ($('#partGrpOrAcctDiv').val() === '' || $('#partGrpOrAcctDiv').val() == null
					|| $('#partGrpOrAcctDiv').val() == '%') {
				document.getElementById("groupOrAcct").value = null;
				document.getElementById("groupOrAcctDesc").value = null;
				document.getElementById("nodeType").value = null;
				$('#partGrpOrAcctDiv').val('');
//				$('#queryType').val('');
//				$( '#transactionTypeDiv' ).css( "display", "none" );
//				$( '#tranType' ).css( "display", "none" );
//				$( '#partGrpOrAcctLabelDiv' ).css( "display", "none" );
			}
		}
	}).data("autocomplete")._renderItem = function(ul, item) {
			var inner_html;
			if( item.CODE == getLabel('norecordFound','No Records Found') ) {
				inner_html = '<a><ol class="t7-autocompleter"><ul">'+ item.CODE + ' '+'</ul"><ul">' + item.label
				+ '</ul"></ol></a>';
			} else {
				
				inner_html = '<a><ol class="t7-autocompleter"><ul>' + item.value
				+ '</ul></ol></a>';
			}
		return $("<li></li>").data("item.autocomplete", item)
				.append(inner_html).appendTo(ul);
	};
		

}

function renderAutoCompleters()
{
	
		if( entityType == 0 )
		{			
			createBankClientCodeAutoCompletor(document.getElementById( "sellerId" ));
			createAgreementIdAutoCompletor( document.getElementById( "sellerId" ).value, document
				.getElementById( "clientId" ).value );
		}
		else
		{
			//createClientCodeAutoCompletor();
			createAgreementIdClientAutoCompletor( document.getElementById( "sellerId" ).value, document
				.getElementById( "clientId" ).value );
		}

		//createExtJsFromDateField();
		//createExtJsToDateField();
		// following jquery to render complete page once the autocompleters are loaded.
		$( '#notionalQueryPageDiv' ).attr( "class", "block" );
		//$( '#notionalQueryPageDiv' ).attr( "class", "filter-view" );
	//}
}

function renderAgreementIdAutoCompleter()
{
	document.getElementById("agreementIdDiv").value="";
	if( document.getElementById( "sellerId" ) != null || document.getElementById( "clientId" ) != null )
	{
		createAgreementIdClientAutoCompletor( document.getElementById( "sellerId" ).value, document
			.getElementById( "clientId" ).value );
	}
}

function createAgreementIdClientAutoCompletor( sellerCodeValue, clientCodeValue )
{ 	
	var seekID='notionalQueryClientAgreementIdSeek';
	if(null == clientCodeValue || 'ALL' == clientCodeValue )
	{
	  seekID ='notionalQueryClientAgreementIdSeekAll';
	}
	$('#agreementIdDiv').autocomplete({
		minLength : 1,
		source : function(request, response) {
			$.ajax({
				url : 'services/userseek/'+seekID+'.json',
				type : 'POST',
				data : {
					'$filtercode1' : sellerCodeValue,
					'$filtercode2' : clientCodeValue,
					'$autofilter' : $('#agreementIdDiv').val()
				},
				success : function(data) {
					if (!isEmpty(data) && !(isEmpty(data.d))) {
						var rec = data.d.preferences;
						if( rec.length == 0 ) {
							results = [{
										label : '',
										CODE : getLabel('norecordFound','No Records Found')}
										];
							response(results);
						} else {
						response($.map(rec, function(item) {
									return {
										value : item.CODE,
										label : item.DESCRIPTION,
										CODE : item.CODE,
										DESCRIPTION : item.DESCRIPTION,
										RECKEY :item.RECKEY,
										STRUCTURE_TYPE :item.STRUCTURE_TYPE,
										STRUCTURE_SUBTYPE :item.STRUCTURE_SUBTYPE
									}
								}));
					}
					}
				}
			});
		},
		select : function(event, ui) {
			$("#agreementCode").val(ui.item.CODE);
			$("#agreementDesc").val(ui.item.DESCRIPTION);
			$("#agreementRecKey").val(ui.item.RECKEY);
			$("#structureType").val(ui.item.STRUCTURE_TYPE);
			$("#structureSubType").val(ui.item.STRUCTURE_SUBTYPE);
			resetPartGrpOrAccFiels();
			setTransactionType(document.getElementById("queryType").value);
		},
		change : function(event, ui) {
			if ($('#agreementIdDiv').val() === '' 
					|| $('#agreementIdDiv').val() == null 
					|| $('#agreementIdDiv').val() == '%') {
				$("#agreementIdDiv").val('');
				$("#agreementCode").val('');
				$("#agreementDesc").val('');
				$("#agreementRecKey").val('');
			}
		}
	}).data("autocomplete")._renderItem = function(ul, item) {
		var inner_html;
		if( item.CODE == getLabel('norecordFound','No Records Found') ) {
			inner_html = '<a><ol class="t7-autocompleter"><ul">'+ item.CODE + ' '+'</ul"><ul">' + item.label
			+ '</ul"></ol></a>';
		} else {			
		inner_html = '<a><ol class="t7-autocompleter"><ul>'+ item.CODE +'</ul><ul>' + item.label
				+ '</ul></ol></a>';
		}
	return $("<li></li>").data("item.autocomplete", item)
			.append(inner_html).appendTo(ul);
};	
}

function getComputationSummary()
{
	var strUrl = null;
	var queryType = document.getElementById( "queryType" );
	document.getElementById( "transactionType" ).value = document.getElementById( "tranType" ).value;
	$('input').removeAttr('disabled');
	if( queryType.value != '')
	{
		$('#notionalQueryErrorDiv').addClass('ui-helper-hidden');
		if( queryType.value == '1' )
		{
			// For Computation screen
			strUrl = 'getComputationSummaryData.srvc';
		}
		else
		{
			if($('#partGrpOrAcctDiv').val() == ''
				&& $('#partGrpOrAcctDiv').is(':visible')){
				paintNotionalQueryErrorMessages();
				return;
			}
			// For Accrual/Settlement screen
			strUrl = 'showAccrualSettlementSummary.srvc';
		}

		strUrl = strUrl + "?&" + csrfTokenName + "=" + csrfTokenValue;
		var frm = document.getElementById( "frmNotionalQuery" );

		frm.action = strUrl;
		frm.target = "";
		frm.method = "POST";
		frm.submit();
	}
	else
	{
		//return false;
		// Show Error Messages
		paintNotionalQueryErrorMessages();
	}
}

function setPartGrpOrAcctField()
{
	var queryType = document.getElementById( "queryType" ).value;
	var txnType = document.getElementById( "tranType" ).value;

	if( queryType == '2' || queryType == '3' )
	{
		createPartGrpOrAcctAutoCompletor( queryType, txnType );
		$( '#partGrpOrAcctLabelDiv' ).css( "display", "block" );
		$( '#partGrpOrAcctDiv' ).css( "display", "block" );
	}
	else
	{
		$( '#partGrpOrAcctLabelDiv' ).css( "display", "none" );
		$( '#partGrpOrAcctDiv' ).css( "dispaly", "none" );
	}
}

function resetPartGrpOrAccFiels()
{
	document.getElementById( "groupOrAcct" ).value = '';
	document.getElementById( "groupOrAcctDesc" ).value = '';
	document.getElementById( "nodeType" ).value = '';
	$( '#partGrpOrAcctDiv' ).val('');
}
function setTransactionType( selectedVal )
{
	if( selectedVal == '2' )
	{
		$( '#transactionTypeDiv' ).css( "display", "block" );
		$( '#tranType' ).css( "display", "block" );
		$( '#tranType' ).addClass( 'rounded w14' );
		setAccrualTransactionType();
	}
	else if( selectedVal == '3' )
	{
		$( '#transactionTypeDiv' ).css( "display", "block" );
		$( '#tranType' ).css( "display", "block" );
		$( '#tranType' ).addClass( 'rounded w14' );
		
		$('#searchBtnId').insertAfter('#emptyDivId');
	
		setSettlementTransactionType();
	}
	else
	{
		$( '#transactionTypeDiv' ).css( "display", "none" );
		$( '#tranType' ).css( "display", "none" );
		
		$('#searchBtnId').insertAfter('#queryTypeId');
	}
	setPartGrpOrAcctField();
}

function setAccrualTransactionType()
{
	if( document.getElementById( "structureType" ).value == 'CB' )
	{
		$( '#tranType > option' ).remove();

		opt = document.createElement( "option" );
		document.getElementById( "tranType" ).options.add( opt );
		opt.text = 'Interest';
		opt.value = '01';
	}
	else if( document.getElementById( "structureType" ).value == 'TE'
		&& document.getElementById( "structureSubType" ).value == '1' )
	{
		$( '#tranType > option' ).remove();

		opt = document.createElement( "option" );
		document.getElementById( "tranType" ).options.add( opt );
		opt.text = 'Interest';
		opt.value = '01';
	}
	else if( document.getElementById( "structureType" ).value == 'CP'
		&& document.getElementById( "structureSubType" ).value == '1' )
	{
		$( '#tranType > option' ).remove();

		for( var i = 0 ; i < accrualTranTypeArray.length ; i++ )
		{
			eval( "document.getElementById('tranType').options[i]=" + "new Option" + accrualTranTypeArray[ i ] );
		}
	}
}

function setSettlementTransactionType()
{
	if( document.getElementById( "structureType" ).value == 'CB' )
	{
		$( '#tranType > option' ).remove();

		for( var i = 0 ; i < settlementCBTranTypeArray.length ; i++ )
		{
			eval( "document.getElementById('tranType').options[i]=" + "new Option" + settlementCBTranTypeArray[ i ] );
		}
	}
	else if( document.getElementById( "structureType" ).value == 'TE'
		&& document.getElementById( "structureSubType" ).value == '1' )
	{
		$( '#tranType > option' ).remove();

		opt = document.createElement( "option" );
		document.getElementById( "tranType" ).options.add( opt );
		opt.text = 'Interest';
		opt.value = '03';

	}
	else if( document.getElementById( "structureType" ).value == 'CP'
		&& document.getElementById( "structureSubType" ).value == '1' )
	{
		$( '#tranType > option' ).remove();

		for( var i = 0 ; i < settlementCPTranTypeArray.length ; i++ )
		{
			eval( "document.getElementById('tranType').options[i]=" + "new Option" + settlementCPTranTypeArray[ i ] );
		}
	}

}

function paintNotionalQueryErrorMessages(){
	var prevErrorDiv = '#errorDiv';
	var errorDiv = '#notionalQueryErrorDiv';
	var errorMsgDiv = '#notionalQueryErrorMsgDiv';
	
	if($(prevErrorDiv).is(':visible') ){
			$(prevErrorDiv).addClass('ui-helper-hidden');
	}
	
	if(!$(errorDiv).is(':visible') ){
			$(errorDiv).removeClass('ui-helper-hidden');
	}
	
	$(errorMsgDiv).nextAll('p').remove();
	
	if($('#partGrpOrAcctDiv').val() == ''
		&& $('#partGrpOrAcctDiv').is(':visible')){
		element = $('<p>').text($('#participatinGrpOrAccLabel')[0].innerText +getLabel("isReq"," is required."));
		$(errorMsgDiv).after(element);
	}
	
	if($('#tranType').val() == '' 
		&& $('#tranType').is(':visible')){
		element = $('<p>').text($('#transactionTypelabel')[0].innerText +getLabel("isReq"," is required."));
		$(errorMsgDiv).after(element);
	}
	
	if($('#queryType').val() == ''){
		element = $('<p>').text($('#queryTypeLabel')[0].innerText +getLabel("isReq"," is required."));
		$(errorMsgDiv).after(element);
	}
	
	if($('#toDate').val() == ''){
		element = $('<p>').text($('#toDateLabel')[0].innerText +getLabel("isReq"," is required."));
		$(errorMsgDiv).after(element);
	}
	
	if($('#fromDate').val() == ''){
		element = $('<p>').text($('#fromDatelabel')[0].innerText +getLabel("isReq"," is required."));
		$(errorMsgDiv).after(element);
	}
	
	if($('#agreementIdDiv').val() == ''){
		element = $('<p>').text($('#agreementId')[0].innerText +getLabel("isReq"," is required."));
		$(errorMsgDiv).after(element);
	}
	
	if($('#clientCodeDiv').val() == ''){
		element = $('<p>').text($('#clientIdlabel')[0].innerText +getLabel("isReq"," is required."));
		$(errorMsgDiv).after(element);
	}
	
}