var colMapLbl = {'txnRemarks':"Remarks", 'txnUser':"User", 'txnAction' :'Action', 'txnDateTime' : 'DateTime'};
var poResponseHeaderData = null;
var strpoFinanceAdditionalInfoData = null;
function showPoTxnInfoPopup() {
	$('#purchaseOrderSummaryDiv').dialog({
				autoOpen : false,
				maxHeight : 620,
				width : 690,
				modal : true,
				dialogClass : 'ft-dialog',
				draggable:false,
				title : getLabel('transinfo','Transaction Information'),
				open : function() {
					$('#purchaseOrderSummaryDiv').removeClass('hidden');
					paintTransactionInformation(identifier,false, 'VERIFY');
						$('#purchaseOrderSummaryDiv').dialog('option','position','center'); 
				},
				close : function() {
				}
			});
	$('#purchaseOrderSummaryDiv').dialog("open");
	$('#purchaseOrderSummaryDiv').dialog('option','position','center');
}

function paintTransactionInformation(strIdentifier, blnCollapsed, strMode) {
	var strPostFix = '_InfoSpan', fieldName = null, strValueToBeDisplayed = null, intMaxFieldLength = 20, blnHistoryExists = false, strAuthLevel = 'B',strhdrActionStatus ='';
	// if (isEmpty(strpoFinanceAdditionalInfoData))
	var objValue = null;
	$('.acceptanceWorkflowInfoHdr').empty();
	if(poState != null)
	{
		strpoFinanceAdditionalInfoData = getPOAddtionInformationData(strIdentifier);
	 }
	if(poResponseHeaderData && poResponseHeaderData.d && poResponseHeaderData.d.anchorCompanyInfo)
	{
		var objInfo = poResponseHeaderData.d.anchorCompanyInfo;
			var strText = !isEmpty(objInfo.company) ? objInfo.company : '';
			strText += '<br/>'
					+ (!isEmpty(objInfo.companyAddress)
							? objInfo.companyAddress
							: '');
			$('.anchorClientInfoHdr').html(strText); 
		
	}
	
	if(poResponseHeaderData && poResponseHeaderData.d && poResponseHeaderData.d.counterPartyCompanyInfo)
	{
			objInfo = poResponseHeaderData.d.counterPartyCompanyInfo;
			var strText = !isEmpty(objInfo.company) ? objInfo.company : '';
			strText += '<br/>'
					+ (!isEmpty(objInfo.companyAddress)
							? objInfo.companyAddress
							: '');
			$('.counterPartyInfoHdr').html(strText); 
			
		
	}
	
	if(poResponseHeaderData && poResponseHeaderData.d && poResponseHeaderData.d.workflow)
	{
		objValue = poResponseHeaderData.d.workflow;
		$('.workflowInfoHdr').html(objValue); 
	}
	
	if(poResponseHeaderData && poResponseHeaderData.d && poResponseHeaderData.d.packageName)
	{
		objValue = poResponseHeaderData.d.packageName;
		$('.packageNameInfoHdr').html(objValue); 
	}
	
	if(poResponseHeaderData && poResponseHeaderData.d && poResponseHeaderData.d.enteredBy)
	{
		objValue = poResponseHeaderData.d.enteredBy;
		$('.enteredByInfohdr').html(objValue); 
	}
	
	if(poResponseHeaderData && poResponseHeaderData.d && poResponseHeaderData.d.dataSource)
	{
		objValue = poResponseHeaderData.d.dataSource;
		$('.dataSourceInfohdr').html(objValue); 
	}
	
	if(poResponseHeaderData && poResponseHeaderData.d && poResponseHeaderData.d.entryWorkflow)
	{
		objValue = poResponseHeaderData.d.entryWorkflow;
		$('.entryWorkflowInfoHdr').html(objValue); 
	}
	else
	{
		$('.entryWorkflowInfoHdr_parent').hide();
	}
	
	if(poResponseHeaderData && poResponseHeaderData.d && poResponseHeaderData.d.entryEnrichmentProfile)
	{
		objValue = poResponseHeaderData.d.entryEnrichmentProfile;
		$('.entryEnrichmentInfoHdr').html(objValue); 
		$('.entryEnrichmentInfoHdr_parent').show();
	}
	else
	{
		$('.entryEnrichmentInfoHdr_parent').hide();
	}
	
	if(poResponseHeaderData && poResponseHeaderData.d && poResponseHeaderData.d.cpAcceptanceWorkflow)
	{
		objValue = poResponseHeaderData.d.cpAcceptanceWorkflow;
		$('.acceptanceWorkflowInfoHdr').html(objValue);
		$('.acceptanceWorkflowInfoHdr_parent').show();
	}
	else
	{
		$('.acceptanceWorkflowInfoHdr_parent').hide();
	}
	
	if(poResponseHeaderData && poResponseHeaderData.d && poResponseHeaderData.d.acceptanceEnrichmentProfile)
	{
		objValue = poResponseHeaderData.d.acceptanceEnrichmentProfile;
		$('.acceptanceEnrichmentInfoHdr').html(objValue); 
	}
	else
	{
		$('.acceptanceEnrichmentInfoHdr_parent').hide();
	}
	// Hide Status Div Initially
	$('.statusDiv').hide();
	$('.auditInformationInfoHdrDiv').hide();
	if(strpoFinanceAdditionalInfoData && strpoFinanceAdditionalInfoData.poStatus)
	{
		objValue = strpoFinanceAdditionalInfoData.poStatus;
		$('.statusDiv').show();
		$('.statusInfo').html(objValue); 
	}
	if(strpoFinanceAdditionalInfoData && strpoFinanceAdditionalInfoData.history && strpoFinanceAdditionalInfoData.poStatus)
	{
		$('.auditInformationInfoHdrDiv').show();
		paintPoTransactionAuditInfoGrid(strpoFinanceAdditionalInfoData.history, '');
	}
	
}
	
function getPOAddtionInformationData(strIdentifier) {
	var objResponseData = null;
	if (strIdentifier && strIdentifier != '') {
		var strUrl = 'services/poTxnInfo/(' + strIdentifier + ').json';
		$.ajax({
					url : strUrl,
					type : 'POST',
					async : false,
					contentType : "application/json",
					complete : function(XMLHttpRequest, textStatus) {
						if ("error" == textStatus) {
							// TODO : Error handling to be done.
							// alert("Unable to complete your request!");
							// blockpoFinanceUI(true);
						}
					},
					success : function(data) {
						if (data && data.d)
							objResponseData = data.d;
					}
				});
	}
	/*
	 * Remove comments to test with Dummay data if (isEmpty(objResponseData)) {
	 * objResponseData = dummayAdditionalInfoJson; }
	 */
	return objResponseData;
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
				$enteredClient : enteredByClient,
				$counterParty : counterparty,
				$counterPartyName:counterpartyName
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
		doHandleUnknownErrorForBatch();
		blockpoFinanceUI(false);
	}
}

function paintPoTransactionAuditInfoGrid(data, strMode) {
	var renderToDiv = null;
	renderToDiv = 'auditInfoGridDiv';
	if (!isEmpty(renderToDiv)) {
		$('#'+renderToDiv).empty();
		var store = createAuditInfoGridStore(data);
		var grid = Ext.create('Ext.grid.Panel', {
			store : store,
			popup : true,
			columns : [{
						dataIndex : 'userCode',
						text : getLabel('txnUser',colMapLbl['txnUser']),
						width : 150,
						draggable : false,
						resizable : false,
						sortable: false,
						hideable : false
					}, {
						dataIndex : 'logDate',
						text : getLabel('txnDateTime',colMapLbl['txnDateTime']),
						width : 200,
						draggable : false,
						resizable : false,
						sortable: false,
						hideable : false
					}, {
						dataIndex : 'statusDesc',
						text : getLabel('txnAction',colMapLbl['txnAction']),
						width : 150,
						draggable : false,
						sortable: false,
						resizable : false,
						hideable : false
					}, {
						dataIndex : 'rejectRemarks',
						text : getLabel('txnRemarks',colMapLbl['txnRemarks']),
						flex : 1,
						draggable : false,
						sortable: false,
						resizable : false,
						hideable : false,
						renderer : function(value, metadata) {
								if(!Ext.isEmpty(value) && value.length > 11){
									metadata.tdAttr = 'title="' + value + '"';
			                    	return value;
								}
								else{
									return value;
								}
			            }
					}],
			renderTo : renderToDiv
				/*
			 * , afterRender : function() { if(strPmtType==='Q')
			 * $('#poFinanceInstrumentTrasanctionSummaryDiv
			 * span.expand-vertical').trigger('click'); else
			 * if(strPmtType==='B') $('#poFinanceHeadeerTrasanctionSummaryDiv
			 * span.expand-vertical').trigger('click'); }
			 */
			});
		grid.on('afterlayout', function() {
			if (strMode && strMode !== 'VERIFY') {
				$('#poFinanceInstrumentTrasanctionSummaryDiv span.expand-vertical')
							.trigger('click');
			}			
		});
		return grid;
	}
}/**/

function createAuditInfoGridStore(jsonData) {
	var myStore = Ext.create('Ext.data.Store', {
				fields : ['recordKeyNo', 'userCode',
						'logDate', 'requestState', 'statusDesc', 'rejectRemarks'],
				data : jsonData,
				autoLoad : true
			});
	return myStore;
}

function closeTransactionInfoPopup(){
	$('#purchaseOrderSummaryDiv').dialog("close");
}