var PaymentRealtime = {};
PaymentRealtime.realtimeInstrument = 'paymentsbatch/findRealTimePirs.srvc';
PaymentRealtime.realtimeResponse = 'realTimePayRes/showResponse.srvc';

PaymentRealtime.processRealTimePirs = function(responseData, baseUrl,strAction)
{
	let pirsFound = false, me = this;
	let  arrayJson = new Array();
	let responseData1 = '',realTimeIdsList;
	let pirType = (strAction === 'instEntrySubmit') ? 'I' : 'B';
	if(strAction === 'instEntrySubmit')
		calledFrom = 'I';
	else if(strAction === 'batchEntrysubmit')
		calledFrom = 'B';
	actionData = responseData.d.instrumentActions;
	if('auth' === strAction || 'submit' === strAction 
			|| 'instEntrySubmit' === strAction || strAction === 'batchEntrysubmit')
	{
		$.each(actionData, function(index, result) {
			if(result.updatedStatus === 'Sent To Bank' && result.success === 'Y')
			{
				arrayJson.push({
					identifier : result.identifier
				});
			}			
		});
	}
	else if('send' === strAction)
	{
		$.each(actionData, function(index, result) {
			arrayJson.push({
				identifier : result.identifier
			});					
		});
	}
	if(!CommonUtility.isEmpty(arrayJson) && arrayJson.length > 0)
	{
		pirsFound = PaymentRealtime.realTimeInstrumentAjax(arrayJson, pirType, baseUrl);
	}
	return pirsFound;
}

PaymentRealtime.realTimeInstrumentAjax = function(arrayJson, pirType, baseUrl)
{
	let pirsFound = false;
	let responseData1 = '',realTimeIdsList;

	$('#widget-body-'+widgetId).empty().html('<div class="loading-indicator"></div>');

	$.ajax({
		url : PaymentRealtime.realtimeInstrument+'?'+csrfTokenName+'='+csrfTokenValue+'&'+'$pirType='+pirType,
		type: 'POST',
		data : JSON.stringify(arrayJson),
		dataType: 'json',
		contentType: "application/json; charset=utf-8",
	})
	.done(function(data, textStatus, jqXHR)        
	{  
		responseData1 = data;
		realTimeIdsList = responseData1.REAL_TIME_PIRS;
		if(realTimeIdsList.length > 0)
		{
			PaymentRealtime.callRealTimeresponse(realTimeIdsList, baseUrl);
			pirsFound = true;
		}
		else
		{
			pirsFound = false;
		}
	})
    .fail(function(jqXHR, textStatus, errorThrown) { 
		$('#payaction_webserviceFail').modal({backdrop: 'static', keyboard: false});
    })
    .always(function(jqXHROrData, textStatus, jqXHROrErrorThrown)
     { 
		$('#widget-body-'+widgetId).empty();
		widgetMap[widgetId].api.refresh();
     });
	return pirsFound;
}
PaymentRealtime.callRealTimeresponse = function(realTimeIdsList, baseUrl)
{
	let me = this;
	let arrayJson = new Array();
	let intCounter = 0;
	let usrAct = baseUrl.indexOf("/");
	let subAction = baseUrl.substring((usrAct+1), baseUrl.length).trim();
	let responseData1 = "";
	let arr_reckey_pir_nos;
	for( i = 0 ; i < realTimeIdsList.length ; i++ )
	{
		arrayJson.push({
			identifier : realTimeIdsList[i].identifier
		});
	}
	intervalObj = setInterval(function()
	{
		if(intCounter < noOfAttempts && stopRefresh == 'N' )
		{
			pir_for_dropdown = document.getElementById('batchRefs').value;
			
			$.ajax({
				url : PaymentRealtime.realtimeResponse+'?'+csrfTokenName+'='+csrfTokenValue+'&'+'$phdNumber='+pir_for_dropdown,
				type: 'POST',
				data : JSON.stringify(arrayJson),
				dataType: 'json',
				contentType: "application/json; charset=utf-8",
			})
			.done(function(data, textStatus, jqXHR)        
			{  
				responseData1 = data;
				retry_required = responseData1.RETRY_REQUIRED;
				total_records = responseData1.TOTAL_RECORDS;
				processed_records  = responseData1.PROCESSED_RECORDS;
				showPopUp =  responseData1.SHOWPOPUP;
				
				batch_status = responseData1.BATCH_STATUS;
				tot_trans= responseData1.TOTAL_TRANS;
				tot_trans_processed = responseData1.TOT_TRANS_PROCESSED;
				arr_reckey_pir_nos = responseData1.ARR_RECKEY_PHDNO;
				pir_for_dropdown = responseData1.SEL_PHD;
					
				if(showPopUp == 'Y')
				{
					//showRealtimeResponsePopup();
					$('#payaction_realtimeResPopup').modal({backdrop: 'static', keyboard: false});
					$('#payaction_realtimeClose').unbind('click');
					$('#payaction_realtimeClose').click(function(){
						$('#payaction_realtimeResPopup').modal('hide');
						CommonUtility.goToPage('paymentSummary.form', 'frmMain');
					});
					$('#payaction_realtimeClose').unbind('keydown');
					$('#payaction_realtimeClose').keydown(function(){
						autoFocusOnFirstElement(event, 'realtimeResPopup', false);
					});					
					
					showPopUp = 'N';
				}
											
				document.getElementById("totalRec").innerHTML= total_records;
				document.getElementById("processRec").innerHTML= processed_records;
				document.getElementById("totalInsts").innerHTML= tot_trans;
				document.getElementById("txnProcessed").innerHTML= tot_trans_processed;
				document.getElementById("batchStatus").innerHTML= batch_status;
				createSelectBox(arr_reckey_pir_nos,pir_for_dropdown);
				
				if('N' == retry_required)
				{
					stopRefresh = 'Y';
					clearInterval(intervalObj);		
				}
			})
		    .fail(function(jqXHR, textStatus, errorThrown) { 
				$('#payaction_webserviceFail').modal({backdrop: 'static', keyboard: false});
		    })
		    .always(function(jqXHROrData, textStatus, jqXHROrErrorThrown)
		     { 
				$('#widget-body-'+widgetId).empty();
				widgetMap[widgetId].api.refresh();
		    });
		}
		else
		{
			clearInterval(intervalObj);
			PaymentRealtime.hideUnhideBtns();
			
		}
		intCounter = intCounter + 1}, 500);
}
PaymentRealtime.hideUnhideBtns = function()
{
	$("#btnContinueDiv").hide();
	$("#btnCancelDiv").show();
}