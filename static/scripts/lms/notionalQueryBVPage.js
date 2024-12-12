function createBankClientCodeAutoCompletor(sellerId)
{
	$('#clientCodeDiv').val('');
	$('#agreementIdDiv').val('');
	var sellerCodeValue = sellerId.value;
	$('#clientCodeDiv').autocomplete({
		minLength : 1,
		source : function(request, response) {

			$.ajax({
						url : 'services/userseek/notionalQueryBVBankClientIdSeek.json',
						type : 'POST',
						data : {
							'$filtercode1' : sellerCodeValue, '$autofilter' : $('#clientCodeDiv').val()
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
												value : item.DESCRIPTION,
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
			
			$("#clientId").val(ui.item.CODE);
			$("#clientDesc").val(ui.item.DESCRIPTION);
			$('#clientCodeDiv').val(ui.item.DESCRIPTION);
			$("#agreementDesc").val('');
			$("#agreementIdDiv").val('');
			createBankAgreementIdClientAutoCompletor(sellerCodeValue, $("#clientId").val());
		},
		change : function(event, ui) {
			// TODO
			if (isEmpty($('#clientCodeDiv').val()) || $('#clientCodeDiv').val()=='%') {
					$('#clientCodeDiv').val('');
					$('#clientId').val('');
					$('#clientDesc').val('');
					$("#agreementCode").val('');
					$("#agreementDesc").val('');
					$("#agreementRecKey").val('');
					createBankAgreementIdClientAutoCompletor(sellerCodeValue, null);
			}
		}
	});/*.data("autocomplete")._renderItem = function(ul, item) {
		var inner_html;
		if( item.CODE == 'No Records Found' ) {
			inner_html = '<a><ol class="t7-autocompleter"><ul">'+ item.CODE + ' '+'</ul"><ul">' + item.label
			+ '</ul"></ol></a>';
		} else {			
			inner_html = '<a><ol class="t7-autocompleter"><ul">'+ item.SHORTNAME + ' | '+'</ul"><ul">' + item.label
				+ '</ul"></ol></a>';
		}
		return $("<li></li>").data("item.autocomplete", item)
				.append(inner_html).appendTo(ul);
	};*/	

}

function createAgreementIdAutoCompletor( sellerCodeValue, clientCodeValue )
{
	$('#agreementIdDiv').val('');
	$("#agreementCode").val('');
	$("#agreementDesc").val('');
	$("#agreementRecKey").val('');
	var seekID='notionalQueryBVAgreementIdSeek';
	var auto1 = Ext.create( 'Ext.ux.gcp.AutoCompleter',
	{
		xtype : 'AutoCompleter',
		fieldLabel : '',
		itemId : 'agreementIdItemId',
		fieldCls : 'xn-form-text w15 xn-suggestion-box',
		labelSeparator : '',
		cfgUrl : 'services/userseek/{0}.json',
		cfgQueryParamName : '$autofilter',
		cfgRecordCount : -1,
		cfgSeekId : seekID,
		cfgRootNode : 'd.preferences',
		cfgDataNode1 : 'CODE',
		cfgDataNode2 : 'DESCRIPTION',
		cfgKeyNode : 'RECKEY',
		cfgStoreFields :
		[
			'CODE', 'DESCRIPTION', 'STRUCTURE_TYPE', 'STRUCTURE_SUBTYPE', 'RECKEY'
		],
		cfgExtraParams : (null == clientCodeValue || '' == clientCodeValue) ? [ {
			key : '$filtercode1',
			value : sellerCodeValue
		} ]
				: [ {
					key : '$filtercode1',
					value : sellerCodeValue
				}, {
					key : '$filtercode2',
					value : clientCodeValue
				}
			],
		listeners :
		{
			select : function( combo, record, index )
			{
				$("#agreementCode").val(record[ 0 ].data.CODE);
				$("#agreementDesc").val(record[ 0 ].data.DESCRIPTION);
				$("#agreementRecKey").val(record[ 0 ].data.RECKEY);
				$("#structureType").val(record[ 0 ].data.STRUCTURE_TYPE);
				$("#structureSubType").val(record[ 0 ].data.STRUCTURE_SUBTYPE);
			},
			change : function( combo, record, index )
			{
				//TODO
				if(combo.value == ''|| combo.value == null || combo.value == '%')
				{
					$("#agreementCode").val('');
					$("#agreementDesc").val('');
					$("#agreementRecKey").val('');
					$("#structureType").val('');
					$("#structureSubType").val('');
				}
			}
		}
	} );
	auto1.render( Ext.get( 'agreementIdDiv' ) );
	auto1.setValue( document.getElementById( "agreementCode" ).value );
}

function createAgreementIdClientAutoCompletor( sellerCodeValue, clientCodeValue )
{ 	

	var seekID = 'notionalQueryBVClientAgreementIdSeek';
	if (null == clientCodeValue || 'ALL' == clientCodeValue) {
		seekID = 'notionalQueryBVAgreementIdSeekAll';
	}
	var clientDesc = $('#clientId').find(":selected").text();
	$('#clientDesc').val(clientDesc);	
	$("#agreementIdDiv").val('');
	$("#agreementCode").val('');
	$("#agreementDesc").val('');
	$('#agreementIdDiv').autocomplete('destroy');
	
	$('#agreementIdDiv').autocomplete({
		minLength : 1,
		source : function(request, response) {
			$.ajax({
				url : 'services/userseek/' + seekID + '.json',
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
						}
						else {
						response($.map(rec, function(item) {
									return {
										value : item.CODE,
										label : item.DESCRIPTION,
										CODE : item.CODE,
										DESCRIPTION : item.DESCRIPTION,
										RECKEY :item.RECKEY,
										STRUCTURE_TYPE :item.STRUCTURE_TYPE,
										STRUCTURE_SUBTYPE :item.STRUCTURE_SUBTYPE,
										CLIENT_DESCRIPTION : item.CLIENT_DESCRIPTION
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
			$("#clientDesc").val(ui.item.CLIENT_DESCRIPTION);
			if('' === ui.item.label) {
				$('#agreementIdDiv').val('');
				$('#agreementCode').val('');
				}
		},
		change : function(event, ui) {
			if ($('#agreementIdDiv').val() === '' || $('#agreementIdDiv').val() == null || $('#agreementIdDiv').val() == '%') {
				$("#agreementIdDiv").val('');
				$("#agreementCode").val('');
				$("#agreementDesc").val('');
				$("#agreementRecKey").val('');
			}
		}
	});/*.data("autocomplete")._renderItem = function(ul, item) {
		var inner_html;
		if( item.CODE == 'No Records Found' ) {
			inner_html = '<a><ol class="t7-autocompleter"><ul">'+ item.CODE + ' '+'</ul"><ul">' + item.label
			+ '</ul"></ol></a>';
		} else {			
			inner_html = '<a><ol class="t7-autocompleter"><ul">'+ item.CODE + ' | '+'</ul"><ul">' + item.label
				+ '</ul"></ol></a>';
		}
		return $("<li></li>").data("item.autocomplete", item)
				.append(inner_html).appendTo(ul);
	};*/
}

function createBankAgreementIdClientAutoCompletor( sellerCodeValue, clientCodeValue )
{ 	
	var seekID='notionalQueryBVAgreementIdSeek';
	var clientDesc = $('#clientId').find(":selected").text();
	$('#clientDesc').val(clientDesc);	
	
	$("#agreementIdDiv").val('');
	$("#agreementCode").val('');
	$("#agreementDesc").val('');
	$('#agreementIdDiv').autocomplete('destroy');
	
	$('#agreementIdDiv').autocomplete({
		minLength : 1,
		source : function(request, response) {
			$.ajax({
				url : 'services/userseek/' + seekID + '.json',
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
						}
						else {
						response($.map(rec, function(item) {
									return {
										value : item.CODE,
										label : item.DESCRIPTION,
										CODE : item.CODE,
										DESCRIPTION : item.DESCRIPTION,
										RECKEY :item.RECKEY,
										STRUCTURE_TYPE :item.STRUCTURE_TYPE,
										STRUCTURE_SUBTYPE :item.STRUCTURE_SUBTYPE,
										CLIENT_DESCRIPTION : item.CLIENT_DESCRIPTION
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
			$("#clientDesc").val(ui.item.CLIENT_DESCRIPTION);
			if('' === ui.item.label) {
			$('#agreementIdDiv').val('');
			$('#agreementCode').val('');
			}
		},
		change : function(event, ui) {
			if ($('#agreementIdDiv').val() === '' || $('#agreementIdDiv').val() == null || $('#agreementIdDiv').val() == '%') {
				$("#agreementIdDiv").val('');
				$("#agreementCode").val('');
				$("#agreementDesc").val('');
				$("#agreementRecKey").val('');
			}
		}
	});/*.data("autocomplete")._renderItem = function(ul, item) {
		var inner_html;
		if( item.CODE == 'No Records Found' ) {
			inner_html = '<a><ol class="t7-autocompleter"><ul">'+ item.CODE + ' '+'</ul"><ul">' + item.label
			+ '</ul"></ol></a>';
		} else {
			
			inner_html = '<a><ol class="t7-autocompleter"><ul">'+ item.CODE + ' | '+'</ul"><ul">' + item.label
				+ '</ul"></ol></a>';
		}
		return $("<li></li>").data("item.autocomplete", item)
				.append(inner_html).appendTo(ul);
	};*/
}

function renderAutoCompleters(sellerId)
{

	if( entityType == 0 )
	{			
		createBankClientCodeAutoCompletor(sellerId);
		createBankAgreementIdClientAutoCompletor( document.getElementById( "sellerId" ).value, document
			.getElementById( "clientId" ).value );
	}
	else
	{
		createAgreementIdClientAutoCompletor( document.getElementById( "sellerId" ).value, document
			.getElementById( "clientId" ).value );
	}
	$( '#notionalBVQueryPageDiv' ).attr( "class", "block" );
}

function renderAgreementIdAutoCompleter()
{
	createAgreementIdClientAutoCompletor( document.getElementById( "sellerId" ).value,
			document.getElementById( "clientId" ).value );
}

function validateData()
{
	var mandatoryFieldsArray = [];
	var arrError = [];
	var emptyString = null ;
	
	var arrError = [];
	var fromDateValue = document.getElementsByName("fromDate")[0].value;
	var toDateValue = document.getElementsByName( "toDate" )[0].value ;
	
	mandatoryFieldsArray.push({id:getLabel("Financial Institution","Financial Institution"),value:document.getElementById( "sellerId" ).value});
	mandatoryFieldsArray.push({id:getLabel("Agreement Code","Agreement Code"),value:document.getElementById( "agreementCode" ).value});
	mandatoryFieldsArray.push({id:getLabel("From Date","From Date"),value:document.getElementsByName("fromDate")[0].value});
	mandatoryFieldsArray.push({id:getLabel("To Date","To Date"),value:document.getElementsByName("toDate")[0].value});
	
	for( var i = 0 ; i < mandatoryFieldsArray.length ; i++ )
	{
		var fieldValue = mandatoryFieldsArray[ i ].value;
		if( fieldValue == null || fieldValue.trim() == '' )
		{
			if(emptyString == null )
			{
				emptyString = mandatoryFieldsArray[i].id ;
			}
			else
			{
				emptyString = emptyString + ',' + mandatoryFieldsArray[i].id ;
			}
		}
	}
	if(emptyString != null)
	{
		emptyStringArr = emptyString.split(",");
		if(emptyStringArr.length == 1)
			emptyString = '"'+emptyString+'"'+getLabel("emptyField"," field is empty. ")
		else
			emptyString = '"'+emptyString+'"'+getLabel("emptyFields"," fields are empty. ")
		arrError.push({
			"errorCode" : "ERR",
			"errorMessage" : emptyString
		});
	}
		
	
	if( toDateValue != null && fromDateValue != null )
	{
		if( Date.parse( fromDateValue) > Date.parse( toDateValue ) )
		{
			arrError.push({
				"errorCode" : "ERR",
				"errorMessage" : getLabel('fromDateToDateLessMsg', 'From Date should be less than To Date.')
			});
		}
	}
	else
	{
		arrError.push({
			"errorCode" : "ERR",
			"errorMessage" : getLabel('fromDateToDateEmptyMsg', 'From Date and To Date fields are empty.')
		});
	}
	
	return arrError;
}

function doClearMessageSection() {
	$('#messageArea').empty();
	$('#messageArea, #messageContentDiv').addClass('hidden');
}

function validateDate()
{
	var arrError = [];
	var fromDateValue = document.getElementsByName("extFromDate")[0].value;
	var toDateValue = document.getElementsByName( "extToDate" )[0].value ;
	if( toDateValue != null && fromDateValue != null )
	{
		if( Date.parse( fromDateValue) > Date.parse( toDateValue ) )
		{
			arrError.push({
				"errorCode" : "ERR",
				"errorMessage" : getLabel('fromDateToDateLessMsg', 'From Date should be less than To Date.')
			});
			return arrError;
		}
	}
	else
	{
		arrError.push({
			"errorCode" : "ERR",
			"errorMessage" : getLabel('fromDateToDateEmptyMsg', 'From Date and To Date fields are empty.')
		});
		return arrError;
	}
}

function assignData()
{
	agreementKey = document.getElementById( "agreementRecKey" ).value;
	changeType = document.getElementById( "reason" ).value;
	if(document.getElementById( "fromDate" ) != null)
	{
		fromTimestamp = document.getElementById( "fromDate" ).value ;
	}
	if(document.getElementById( "toDate" ) != null)
	{
		toTimestamp = document.getElementById( "toDate" ).value ;
	}
}

function handleFilterSenctionVisisbility(){
	var objEditableHeaderSec = $('#filterDiv');
	var objReadHeaderSec = $('#headerReadOnlyDiv');
	var objSummaryDiv = $('#summaryDiv');
	
	var seller = document.getElementById( "sellerDesc" ).value;
	var clientName = document.getElementById( "clientDesc" ).value;
	if(clientDesc != null && clientDesc !=''){
		clientName = clientDesc;
	}
	var agreement = document.getElementById( "agreementCode" ).value;
	if(agreementCodeModel != null  && agreementCodeModel !=''){
		agreement = agreementCodeModel;
	}
	var agreementDesc = document.getElementById( "agreementDesc" ).value;
	if(agreementDescription != null  && agreementDescription !=''){
		agreementDesc = agreementDescription;
	}
	
	
	var todate = document.getElementById( "toDate" ).value;
	var fromdate = document.getElementById( "fromDate" ).value;
		
	if(entityType == 0){
		$('#BVAdSellerSpanId').text('');
		$('#BVAdSellerSpanId').text(seller);
		$('#BVAdClientSpanId').text('');
		$('#BVAdClientSpanId').text(clientName);
		$('#BVAdAgreementSpanId').text('');
		$('#BVAdAgreementSpanId').text(agreement);
		$('#BVAdAgreementSpanIdDesc').text('');
		$('#BVAdAgreementSpanIdDesc').text(agreementDesc);
	}
	else if(entityType == 1){
		$('#BVClClinetSpanId').text('');
		$('#BVClClinetSpanId').text(clientName);
		$('#BVClAgreementSpanId').text('');
		$('#BVClAgreementSpanId').text(agreement);
		$('#BVClAgreementDescSpanId').text('');
		$('#BVClAgreementDescSpanId').text(agreementDesc);
	}
	$('#BVFromDateSpanId').text('');
	$('#BVFromDateSpanId').text(fromdate);
	$('#BVToDateSpanId').text('');
	$('#BVToDateSpanId').text(todate);
	$('#BVReasonSpanId').text('');
	$('#BVReasonSpanId').text(reason);
	
	$('#messageArea, #messageContentDiv').addClass('hidden');
	objEditableHeaderSec.addClass('ui-helper-hidden');
	objReadHeaderSec.removeClass('ui-helper-hidden');
	objSummaryDiv.removeClass('ui-helper-hidden');
	$('#searchBtnDuv').addClass("ui-helper-hidden");
	$('#backBtnDuv').removeClass('ui-helper-hidden');
}
function goToBVQuery(){
	var objEditableHeaderSec = $('#filterDiv');
	var objReadHeaderSec = $('#headerReadOnlyDiv');
	var objSummaryDiv = $('#summaryDiv');
	
	$('#messageArea, #messageContentDiv').addClass('hidden');
	objEditableHeaderSec.removeClass('ui-helper-hidden');
	objReadHeaderSec.addClass('ui-helper-hidden');
	objSummaryDiv.addClass('ui-helper-hidden');
	$('#searchBtnDuv').removeClass("ui-helper-hidden");
	$('#backBtnDuv').addClass('ui-helper-hidden');
	$('#fromDate').val('');
	$('#toDate').val('');
}

function gotoQueryPage( strUrl )
{
	strUrl = strUrl + "?&" + "$viewState=" + viewState + "&" + csrfTokenName + "=" + csrfTokenValue;
	var frm = document.createElement( "form" );

	frm.action = strUrl;
	frm.target = "";
	frm.method = "POST";
	frm.submit();
}
function gotoBackBVQueryPage(strUrl){
	strUrl = strUrl + "?&" + "$viewState=" + viewState + "&$mode=readView"+"&" + csrfTokenName + "=" + csrfTokenValue;
	var frm = document.createElement( "form" );
	document.body.appendChild(frm);
	frm.action = strUrl;
	frm.target = "";
	frm.method = "POST";
	frm.submit();
}

function downloadXlsSummary( strUrl, viewName )
{
	strUrl = strUrl + "?" + "&$viewState=" + viewState + "&$changeId=" + changeId + "&$viewName=" + viewName;
	strUrl = strUrl + "&" + csrfTokenName + "=" + csrfTokenValue;
	var frm = document.getElementById( "frmMain" );
	frm.action = strUrl;
	frm.target = "";
	frm.method = "POST";
	frm.submit();

}

function gotoNodeView( strUrl , viewName )
{
	strUrl = strUrl + "?&" + "$viewState=" + viewState;
	strUrl = strUrl + "&$changeId=" + changeId + "&" + csrfTokenName + "=" + csrfTokenValue + "&$viewName=" +viewName;
	var frm = document.createElement( "form" );
    $(document.body).append(frm);
	frm.action = strUrl;
	frm.target = "";
	frm.method = "POST";
	frm.submit();
}
function gotoInterestView( strUrl )
{
	var me = this;
	strUrl = strUrl + "?$changeId=" + changeId + "&" + csrfTokenName + "=" + csrfTokenValue;
	var frm = document.getElementById( "frmMain" );
	frm.action = strUrl
	frm.target = "";
	frm.method = "POST";
	frm.submit();
}

function goToBackValueSummary( strUrl )
{
	var me = this;
	strUrl = strUrl +"?&"+ csrfTokenName + "=" + csrfTokenValue;
	var frm = document.getElementById("frmNotionalBVQuery" );
	frm.action = strUrl
	frm.target = "";
	frm.method = "POST";
	frm.submit();
}

/*function renderExtJsDateField() {
	if (!Ext.Ajax) {
		// to get reference of Ext.Ajax until its loaded completely.
		setTimeout(function() {
			renderExtJsDateField();
		}, 500);
	} else {
		createExtJsFromDateField();
		createExtJsToDateField();
	}
}
function createExtJsFromDateField() {
	var fromdtValue = fromDateModel == null || fromDateModel == '' ? ''
			: fromDateModel;
	var fromdt = Ext.create('Ext.form.DateField', {
		name : 'extFromDate',
		itemId : 'extFromDate',
		id : 'extFromDate',
		format : extJsDateFormat,
		minValue : dtLmsRetentionDate,
		maxValue : dtApplicationDate,	
		editable : false,
		width: 210,
		value : fromdtValue,
		allowBlank : false,
		listeners : {
			change : function(field, newValue, oldValue, eOpts) {
				document.getElementById("fromDate").value =  Ext.util.Format.date(newValue, extJsDateFormat);
			},
			select : function(field, value, eOpts) {
				document.getElementById("fromDate").value = Ext.util.Format.date(value, extJsDateFormat);
			}
		}
	});
	fromdt.render(Ext.get('fromDateDiv'));
}

function createExtJsToDateField() {
	var todtValue = toDateModel != '' || toDateModel != null ? toDateModel : '';
	var todt = Ext.create('Ext.form.DateField', {
		name : 'extToDate',
		itemId : 'extToDate',
		id : 'extToDate',
		format : extJsDateFormat,
		minValue : dtLmsRetentionDate,
		maxValue : dtApplicationDate,
		editable : false,
		width: 210,
		value : todtValue,
		allowBlank : false,
		listeners : {
			change : function(field, newValue, oldValue, eOpts) {
				document.getElementById("toDate").value =  Ext.util.Format.date(newValue, extJsDateFormat);
			},
			select : function(field, value, eOpts) {
				document.getElementById("toDate").value =  Ext.util.Format.date(value, extJsDateFormat);
			}
		}
	});
	todt.render(Ext.get('toDateDiv'));
}
*/
