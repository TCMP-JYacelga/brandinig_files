var mapLbl = {'txnRemarks':"Remarks", 'txnUser':"User", 'txnAction' :'Action', 'txnDateTime' : 'DateTime'};
var poFinanceResponseHeaderData = null;
var strpoFinanceAdditionalInfoData = null;
function showFinanceTxnInfoPopup() {
	$('#purchaseOrderSummaryDiv').dialog({
				autoOpen : false,
				maxHeight : 620,
				width : 690,
				modal : true,
				dialogClass : 'ft-dialog',
				draggable:false,
				title : getLabel('TransactionInformation','Transaction Information'),
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
	if(financeState != null)
	{
		strpoFinanceAdditionalInfoData = getpoFinanceAddtionInformationData(strIdentifier);
	 }
	if(poFinanceResponseHeaderData && poFinanceResponseHeaderData.d && poFinanceResponseHeaderData.d.anchorCompanyInfo)
	{
		var objInfo = poFinanceResponseHeaderData.d.anchorCompanyInfo;
			var strText = !isEmpty(objInfo.company) ? objInfo.company : '';
			strText += '<br/>'
					+ (!isEmpty(objInfo.companyAddress)
							? objInfo.companyAddress
							: '');
			$('.anchorClientInfoHdr').html(strText); 
		
	}
	
	if(poFinanceResponseHeaderData && poFinanceResponseHeaderData.d && poFinanceResponseHeaderData.d.counterPartyCompanyInfo)
	{
			objInfo = poFinanceResponseHeaderData.d.counterPartyCompanyInfo;
			var strText = !isEmpty(objInfo.company) ? objInfo.company : '';
			strText += '<br/>'
					+ (!isEmpty(objInfo.companyAddress)
							? objInfo.companyAddress
							: '');
			$('.counterPartyInfoHdr').html(strText); 
			
		
	}
	
	if(poFinanceResponseHeaderData && poFinanceResponseHeaderData.d && poFinanceResponseHeaderData.d.workflow)
	{
		objValue = poFinanceResponseHeaderData.d.workflow;
		$('.workflowInfoHdr').html(objValue); 
	}
	
	if(poFinanceResponseHeaderData && poFinanceResponseHeaderData.d && poFinanceResponseHeaderData.d.packageName)
	{
		objValue = poFinanceResponseHeaderData.d.packageName;
		$('.packageNameInfoHdr').html(objValue); 
	}
	
	if(poFinanceResponseHeaderData && poFinanceResponseHeaderData.d && poFinanceResponseHeaderData.d.enteredBy)
	{
		objValue = poFinanceResponseHeaderData.d.enteredBy;
		$('.enteredByInfohdr').html(objValue); 
	}
	
	if(poFinanceResponseHeaderData && poFinanceResponseHeaderData.d && poFinanceResponseHeaderData.d.dataSource)
	{
		objValue = poFinanceResponseHeaderData.d.dataSource;
		$('.dataSourceInfohdr').html(objValue); 
	}
	
	if(poFinanceResponseHeaderData && poFinanceResponseHeaderData.d && poFinanceResponseHeaderData.d.financeWorkflow)
	{
		objValue = poFinanceResponseHeaderData.d.financeWorkflow;
		$('.financeEntryWorkflowInfoHdr').html(objValue); 
	}
	
	// Hide Status Div Initially
	$('.statusDiv').hide();
	$('.auditInformationInfoHdrDiv').hide();
	if(strpoFinanceAdditionalInfoData && strpoFinanceAdditionalInfoData.poStatusFinance)
	{
		objValue = strpoFinanceAdditionalInfoData.poStatusFinance;
		$('.statusDiv').show();
		$('.statusInfo').html(objValue); 
	}
	if(strpoFinanceAdditionalInfoData && strpoFinanceAdditionalInfoData.history && strpoFinanceAdditionalInfoData.poStatus)
	{
		$('.auditInformationInfoHdrDiv').show();
		paintpoFinanceTransactionAuditInfoGrid(strpoFinanceAdditionalInfoData.history, '');
	}
	
}
	
function getpoFinanceAddtionInformationData(strIdentifier) {
	var objResponseData = null;
	if (strIdentifier && strIdentifier != '') {
		var strUrl = 'services/poFinanceTxnInfo/(' + strIdentifier + ').json';
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

function loadPOFinanceHeaderFields(strMyProduct, anchorClient) {
	// blockpoFinanceUI(true);
	if (!isEmpty(strMyProduct)) {
		var url = 'services/poFinanceTxnHeaderInfo' + "/" + strMyProduct;
		$.ajax({
			type : "POST",
			url : url,
			data : {
				$productRelClient : anchorClient,
				$poViewState : poIdentifier,
				$finEnteredClient : finEnteredClient
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
						poFinanceResponseHeaderData = data;
					}
				}
			}
		});
	} else {
		doHandleUnknownErrorForBatch();
		blockpoFinanceUI(false);
	}
}

function paintpoFinanceTransactionAuditInfoGrid(data, strMode) {
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
						text :getLabel('txnUser', mapLbl['txnUser']),
						width : 150,
						draggable : false,
						resizable : false,
						sortable: false,
						hideable : false
					}, {
						dataIndex : 'logDate',
						text :getLabel('txnDateTime', mapLbl['txnDateTime']),
						width : 200,
						draggable : false,
						resizable : false,
						sortable: false,
						hideable : false
					}, {
						dataIndex : 'statusDesc',
						text :getLabel('txnAction', mapLbl['txnAction']),
						width : 150,
						draggable : false,
						resizable : false,
						sortable: false,
						hideable : false
					}, {
						dataIndex : 'rejectRemarks',
						text :getLabel('txnRemarks', mapLbl['txnRemarks']),
						flex : 1,
						draggable : false,
						resizable : false,
						sortable: false,
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