
function processRealTimePirs(responseData, baseUrl,strAction)
{
	var pirsFound = false;
	var me = this;
	var  arrayJson = new Array();
	strUrl = 'paymentsbatch/findRealTimePirs.srvc';
	var responseData1 = '';
	var realTimeIdsList;
	var pirType = (strAction === 'instEntrySubmit') ? 'I' : 'B';
	if(strAction === 'instEntrySubmit')
		calledFrom = 'I';
	else if(strAction === 'batchEntrysubmit')
		calledFrom = 'B';
	actionData = responseData.d.instrumentActions;
	if('auth' === strAction || 'submit' === strAction || 'instEntrySubmit' === strAction || strAction === 'batchEntrysubmit')
	{
		Ext.each(actionData, function(result){
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
		Ext.each(actionData, function(result){
				arrayJson.push({
					identifier : result.identifier
				});			
		});
	}
	if(!Ext.isEmpty(arrayJson) && arrayJson.length > 0)
	{
		Ext.Ajax.request({
			url : strUrl+'?'+csrfTokenName+'='+csrfTokenValue+'&'+'$pirType='+pirType,
			method : 'POST',
			jsonData : Ext.encode(arrayJson),
			async : false,
			success : function(response) {
				responseData1 = Ext.decode(response.responseText);
				realTimeIdsList = responseData1.REAL_TIME_PIRS;
				if(realTimeIdsList.length > 0)
				{
					callRealTimeresponse(realTimeIdsList, baseUrl);
					pirsFound = true;
				}
				else
				{
					pirsFound = false;
				}
			},
			failure : function() {
					pirsFound = false;
			}
		});
	}
	return pirsFound;
}	
function callRealTimeresponse(realTimeIdsList, baseUrl)
{
	var me = this;
	var arrayJson = new Array();
	var intCounter = 0;
	var usrAct = baseUrl.indexOf("/");
	var subAction = baseUrl.substring((usrAct+1), baseUrl.length).trim();
	strUrl = 'realTimePayRes/showResponse.srvc';
	var responseData1 = "";
	var arr_reckey_pir_nos;
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
			Ext.Ajax.request({
				url : strUrl+'?'+csrfTokenName+'='+csrfTokenValue+'&'+'$phdNumber='+pir_for_dropdown,
				method : 'POST',
				jsonData : Ext.encode(arrayJson),
				success : function(response) {
					responseData1 = Ext.decode(response.responseText);
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
						showRealtimeResponsePopup();
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
				},
				failure : function() {
					var errMsg = "";
					Ext.MessageBox.show({
								title : getLabel(
										'instrumentErrorPopUpTitle',
										'Error'),
								msg : getLabel(
										'instrumentErrorPopUpMsg',
										'Error while fetching data..!'),
								buttons : Ext.MessageBox.OK,
								icon : Ext.MessageBox.ERROR
							});
				}
			});
		}
		else
		{
			clearInterval(intervalObj);
			hideUnhideBtns();
			
		}
		intCounter = intCounter + 1}, 500);
}
function hideUnhideBtns()
{
	$("#btnContinueDiv").hide();
	$("#btnCancelDiv").show();
}
function showRealtimeResponsePopup()
{
	$( '#realtimeResPopup' ).dialog(
	{
		autoOpen : false,
		height : 500,
		width : '70%',
		modal : true,
		layout : 'fit',
		resizable : false,
		draggable : false,
		title : getLabel('realTimePayRequest','Request in Process'),
		close: closeDialog
	} );
	openResponseGrid();
	$( '#realtimeResPopup' ).dialog( "open" );	
	setTimeout(function() { autoFocusOnFirstElement(null, 'realtimeResPopup', true); }, 150);	
}
function closeDialog()
{
	goToPage('paymentSummary.form', 'frmMain');
}
function closePopup( dlgId )
{
	$( '#' + dlgId + '' ).dialog( "close" );
	clearInterval(intervalObj);
	if(calledFrom === 'I')
		goToPage(_mapUrl['cancelInstrumentUrl'], 'frmMain');
	if(calledFrom === 'B')
		goToPage(_mapUrl['cancelBatchUrl'], 'frmMain');
}
function createSelectBox(arrRecKeyPhdNos,pir_for_dropdown)
{
	$("#batchRefs").empty();
	for( i = 0 ; i < arrRecKeyPhdNos.length ; i++ )
	{
		opt = document.createElement("option");
		document.getElementById("batchRefs").options.add(opt);
		opt.text  = arrRecKeyPhdNos[i].phdNumber;
		opt.value = arrRecKeyPhdNos[i].phdNumber;
	}
	 $("#batchRefs").val(pir_for_dropdown);
}
function reloadGrid(option)
{
	pir_for_dropdown=option.value;
	strReloadUrl = 'realTimePayRes/getInstStatus.srvc';
	var responseData1='';
	Ext.Ajax.request({
		url : strReloadUrl+ '?' + '&identifier=' +pir_for_dropdown +'&' +  csrfTokenName + '=' + csrfTokenValue,
		method : 'POST',
		success : function(response) {
			responseData1 = Ext.decode(response.responseText);										
			tot_trans= responseData1.TOTAL_TRANS;
			tot_trans_processed = responseData1.TOT_TRANS_PROCESSED;
			batch_status = responseData1.BATCH_STATUS;
			document.getElementById("totalInsts").innerHTML= tot_trans;
			document.getElementById("txnProcessed").innerHTML= tot_trans_processed;
			document.getElementById("batchStatus").innerHTML= batch_status;
			openResponseGrid();
		},
		failure : function() {
			var errMsg = "";
			Ext.MessageBox.show({
						title : getLabel(
								'instrumentErrorPopUpTitle',
								'Error'),
						msg : getLabel(
								'instrumentErrorPopUpMsg',
								'Error while fetching data..!'),
						buttons : Ext.MessageBox.OK,
						icon : Ext.MessageBox.ERROR
					});
		}
	});
} 	

function isCutOffTimeExceeded(option)
{
	strUrl = 'realTimeCutoff/getCutOffTime.srvc';
	var responseData1='';
	Ext.Ajax.request({
		url : strUrl+ '?' + '&identifier=' +pir_for_dropdown +  '&' +  csrfTokenName + '=' + csrfTokenValue,
		method : 'POST',
		success : function(response) {
			responseData1 = Ext.decode(response.responseText);
			cutOffTimeFlag= responseData1.CutOffTimeFlag;
		},
		failure : function() {
			var errMsg = "";
			Ext.MessageBox.show({
						title : getLabel(
								'instrumentErrorPopUpTitle',
								'Error'),
						msg : getLabel(
								'instrumentErrorPopUpMsg',
								'Error while fetching data..!'),
						buttons : Ext.MessageBox.OK,
						icon : Ext.MessageBox.ERROR
					});
		}
	});
}
 function checkCutOffTime(eventCodeList,url,record, remark, fromGrid){
		var me = this;
		var usrResponse = null;
		var effectiveDate ;	
			if(document.getElementById("effectiveDate"))
			{
				effectiveDate = document.getElementById("effectiveDate").value ;							
			}
			else if (record != null && record !=undefined && record != '' )
			{
				effectiveDate = record.get('effectiveDate');
			}									
									
		var strUrl = 'realTimeCutoff/getCutOffTime.srvc?'+csrfTokenName+'='+csrfTokenValue +'&$eventCodeList='+ eventCodeList + '&$effectiveDate='+ effectiveDate;
		Ext.Ajax.request({
						url : strUrl,
						method : "POST",
						success : function(response) {
							var responseData = Ext.decode(response.responseText);
							setTimeout( function(){
								me.checkCutOffStatus(responseData, eventCodeList, url, record, remark, fromGrid);
							}, 500 );
						},
						failure : function() {
							var errMsg = "";
							Ext.MessageBox.show({
										title : getLabel(
												'instrumentErrorPopUpTitle',
												'Error'),
										cls:'t7-popup',		
										msg : getLabel(
												'instrumentErrorPopUpMsg',
												'Error while fetching data..!'),
										buttons : Ext.MessageBox.OK,
										icon : Ext.MessageBox.ERROR
									});
						}
					});
 }
	
 function checkCutOffStatus(responseData, eventCodeList, url, record, remark, fromGrid)
 {
	var temp = new Array();
	temp = eventCodeList.split(",");
	var me = this;
	var payDown = 'N';
	var advance = 'N';
	var loanInvoice = 'N';
	var eventString = "";
	var message = "";
	var button = "";
	var cutOffReqd = "";
	//var btnPressed = null;
	//	var x = new Map();
	//	x = responseData;
		for( i = 0 ; i < (temp.length -1) ; i++ )
			{
				var eventno = temp[i];
				eventString = eventString + eventno + ",";
				//var cutOff = x[eventno];
				var cutOff = responseData[eventno];
				if(cutOff=='Y')
				{
					  cutOffReqd = "Y";
					  if(eventno=='LNPAYDOWN'){url = url+'&$payDown=Y';}
					  if(eventno=='LNADVANCE'){url = url+'&$advance=Y';}
					  if(eventno=='LNINVPAY'){url = url+'&$loanInvoice=Y';}

					 if(eventno=='LNPAYDOWN' || eventno=='LNADVANCE' || eventno=='LNINVPAY' ){
						 if(eventno=='LNPAYDOWN'){ 
							 message = cutOffLNPAYDOWN;
							 }
						if(eventno=='LNINVPAY'){ message = cutOffLNINVPAY; }
						 if(eventno=='LNADVANCE'){ 
							 message = cutOffLNADVANCE;
							 //button= Ext.MessageBox.OK;
							 button= Ext.MessageBox.OKCANCEL;
						 }
						 else
							 {
							 	button= Ext.MessageBox.OKCANCEL;
							 }
					 }else {
						 if(eventno=='CHENQUIRY'){ message = cutOffCHQINQ; }
						 if(eventno=='CHSTPPAY'){ message = cutOffCHSTPPAY; }
						 button= Ext.MessageBox.OK;
					 }
				  }
			 }  
			 
			 if("Y"==cutOffReqd){
				  Ext.MessageBox.show
				  ({
				   title:'Cut-Off Time Exceeded',
				   msg: message,
				   cls:'t7-popup',
				   buttons: button,
				   fn: (function(btn) {
						if(btn=='ok'){
							if(fromGrid=='Y')
							{
							 if((eventString.indexOf("PAYDOWN")) > 0 || (eventString.indexOf("ADVANCE")) > 0 || (eventString.indexOf("INVPAY")) > 0 ){invoicePay(url,record,remark);}
							}
							else
							{
								if((eventString.indexOf("PAYDOWN")) > 0){loanPayDown('yes');}
								if((eventString.indexOf("ADVANCE")) > 0){
									loanAdvance('yes');
									//$( '#advancedPopup' ).dialog( "close" );
									}
							}
							//else{ getStpCheck('no'); }					
							//addChkInqRequest('yes');
							var effectiveDate ;
							var strData = {};
							var strUrl = 'getLoanPaymentEfectiveDate.srvc';
							
							if(document.getElementById("effectiveDate"))
							{
								effectiveDate = document.getElementById("effectiveDate").value ;							
							}
							
							strData[ '$effectiveDate' ] = effectiveDate; 
							strData[ csrfTokenName ] = csrfTokenValue;										
							$.ajax(
							{
								cache : false,
								data : strData,
								dataType : 'json',
								success : function(response)
								{
									//alert(response.next_effective_date);
									document.getElementById("effectiveDate").value = response.next_effective_date ;
								},
								error : function()
								{
									alert("Error in ajax");
								},
								url : strUrl,
								type : 'POST'
							} );			
						}
						else
						{
							//closePopup('realtimeResPopup');
							$( '#payDownPopup' ).dialog( "close" );
							$( '#advancedPopup' ).dialog( "close" );
						}
						}),
				   icon: Ext.MessageBox.QUESTION
				 });
			 }
			 else{
			  if(fromGrid=='Y')
				{
				 if((eventString.indexOf("PAYDOWN")) > 0 || (eventString.indexOf("ADVANCE")) > 0 || (eventString.indexOf("INVPAY")) > 0 ){invoicePay(url,record,remark);}
				}
				else
				{
					if((eventString.indexOf("PAYDOWN")) > 0){loanPayDown('no');}
					if((eventString.indexOf("ADVANCE")) > 0){loanAdvance('no');}
					if((eventString.indexOf("STPPAY")) > 0){getStpCheck('no');}
					if((eventString.indexOf("ENQUIRY")) > 0){getCheckInq('no');}
				}
			 
			 }

  }
