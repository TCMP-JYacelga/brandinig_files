function showAddNewProductForm(frmId)
{
	var frm = document.getElementById(frmId);
	frm.action = "newScmMyProduct.form";
	frm.target = "";
	frm.method = "POST";
	frm.submit();
}
function filter()
{
	var frm = document.getElementById('frmMain');
	frm.action = "filterScmMyProductList.form";
	frm.target = "";
	frm.method = "POST";
	frm.submit();
}
function viewProductData(strUrl, frmId, rowIndex)
{
	var frm = document.getElementById(frmId);
	document.getElementById("txtRecordIndex").value = rowIndex;
	frm.action = strUrl;
	frm.target = "";
	frm.method = "POST";
	frm.submit();
}
function acceptRecord(strUrl, frmId, rowIndex)
{
	var frm = document.getElementById(frmId);
	document.getElementById("txtRecordIndex").value = rowIndex;
	frm.action = strUrl;
	frm.target = "";
	frm.method = "POST";
	frm.submit();
}
function rejectRecord(strUrl, frmId, rowIndex)
{
	var frm = document.getElementById(frmId);
	document.getElementById("txtRecordIndex").value = rowIndex;
	document.getElementById("txtMyProductRejectRemark").value = $('#txtAreaRejectRemark').val();	
	frm.action = strUrl;
	frm.target = "";
	frm.method = "POST";
	frm.submit();
}
function disableRecord(strUrl, frmId, rowIndex)
{
	var frm = document.getElementById(frmId);
	document.getElementById("txtRecordIndex").value = rowIndex;
	frm.action = strUrl;
	frm.target = "";
	frm.method = "POST";
	frm.submit();
}
function enableRecord(strUrl, frmId, rowIndex)
{
	var frm = document.getElementById(frmId);
	document.getElementById("txtRecordIndex").value = rowIndex;
	frm.action = strUrl;
	frm.target = "";
	frm.method = "POST";
	frm.submit();
}
function discardRecord(strUrl, frmId, rowIndex)
{
	var frm = document.getElementById(frmId);
	document.getElementById("txtRecordIndex").value = rowIndex;
	frm.action = strUrl;
	frm.target = "";
	frm.method = "POST";
	frm.submit();
}
function editProductData(strUrl, frmId, rowIndex)
{
	var frm = document.getElementById(frmId);
	document.getElementById("txtRecordIndex").value = rowIndex;
	frm.action = strUrl;
	frm.target = "";
	frm.method = "POST";
	frm.submit();
}
function historyPage(strUrl, frmId, rowIndex)
{
	var frm = document.getElementById(frmId);
	document.getElementById("txtRecordIndex").value = rowIndex;
	frm.action = strUrl;
	frm.target = "hWinSeek";
	frm.method = "POST";
	var strAttr;
	var intTop  = (screen.availHeight - 300)/2;
	var intLeft = (screen.availWidth - 600)/2;
	strAttr = "dependent=yes,scrollbars=yes,";
	strAttr = strAttr + "left=" + intLeft + ",";
	strAttr = strAttr + "top=" + intTop + ",";
	strAttr = strAttr + "width=650,height=300";
	window.open ("", "hWinSeek", strAttr);
	frm.submit();
	frm.target = "";
}

function getRejectPopupNew(strUrl, frmId, rowIndex) {
	$('#rejectPopup').dialog( {
		autoOpen : false,
		height : 240,
		width : 420,
		modal : true,
		close: function() {$("#rejectCheck"+rowIndex).attr("checked", false);},
		buttons : {
				"Ok" : function() {
					rejectRecord(strUrl, frmId, rowIndex);
				},
				"Cancel" : function() {
					$("#rejectCheck"+rowIndex).attr("checked", false);
					$(this).dialog("close");
					}
		}
	});
	$('#rejectPopup').dialog("open");
}
function messagePopup() {
	$('#messagePopup').dialog( {
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
	$('#messagePopup').dialog('open');
}

/* ################# Add SCM My Product ##################### */
function goBack(frmId, strUrl, strUrlSave)
{
	if($('#dirtyBit').val()=="1")
		getConfirmationPopup(frmId, strUrl, strUrlSave);
	else
    {
	var frm = document.getElementById(frmId);
	frm.action = strUrl;
	frm.target = "";
	frm.method = "POST";
	frm.submit();
	}
}
function addNewSCMProduct(frmId, strUrl)
{
	var frm = document.getElementById(frmId);
	document.getElementById("txtDebitProduct").value = $('#directDebitMyproduct').val()
	document.getElementById("txtScmProduct").value = $('#mypBnkProduct').val()
	$('#periodSpecificDay').removeAttr("disabled");
	$('#settlePeriodSpecificDay').removeAttr("disabled");
	frm.action = strUrl;
	frm.target = "";
	frm.method = "POST";
	frm.submit();
}
function setDirtyBit()
{
	document.getElementById("dirtyBit").value = "1";	
}
function getConfirmationPopup(frmId, strUrl, strUrlSave)
{
	$('#confirmPopup').dialog( {
		autoOpen : false,
		height : 200,
		width : 420,
		modal : true,
		buttons : {
				"Yes" : function() {
					var frm = document.getElementById(frmId);
					frm.action = strUrl;
					frm.target = "";
					frm.method = "POST";
					frm.submit();
					},
				"No" : function() {
					$(this).dialog("close");
					}
		}
	});
	$('#confirmPopup').dialog("open");
}

function getProWorkflw(scmProduct,strUrl,frmId)
{
	var frm = document.getElementById(frmId);
	document.getElementById("txtScmProduct").value = scmProduct;
	frm.action = strUrl;
	frm.target = "";
	frm.method = "POST";
	frm.submit();
}
function getCreditAccount(debitPro,strUrl,frmId)
{
	var frm = document.getElementById(frmId);
	document.getElementById("txtDebitProduct").value = debitPro;
	document.getElementById("txtScmProduct").value = $('#mypBnkProduct').val()
	frm.action = strUrl;
	frm.target = "";
	frm.method = "POST";
	frm.submit();
}
function enaDisableSpecificDay(crt,frmId)
{
	if(crt.value == 'D' || crt.value == '')
	{
		$('#cycleSpecificDayM').hide();
		$('#temp').show();
		$('#cycleSpecificDayW').hide();
	}
	if(crt.value == 'W')
	{
		$('#cycleSpecificDayW').show();
		$('#cycleSpecificDayM').hide();
		$('#temp').hide();
	}
	if(crt.value == 'M')
	{
		$('#cycleSpecificDayM').show();
		$('#cycleSpecificDayW').hide();
		$('#temp').hide();
	}
}
function getInfo(crt)
{
	if(crt.value == 'C')
	{
		$('#trcycle').show();
		$('#trperiod').hide();
		$('#trlabel').show();
	}
	if(crt.value == 'P')
	{
		
		$('#trcycle').hide();
		$('#trperiod').show();
		$('#trlabel').show();
		$('#periodSpecificDay').attr("disabled","true");
	}
	if(crt.value == 'I' || crt.value=='')
	{
		
		$('#trcycle').hide();
		$('#trperiod').hide();
		$('#trlabel').hide();
	}
}
function getSettlementInfo(crt)
{
	
	if(crt.value == 'C')
	{
		$('#trsettlecycle').show();
		$('#trsettleperiod').hide();
		$('#trsettlelabel').show();
	}
	if(crt.value == 'D' || crt.value=='' || crt.value == 'M')
	{
		
		$('#trsettlecycle').hide();
		$('#trsettleperiod').hide();
		$('#trsettlelabel').hide();
	}
}
function enaDisableSettleSpecificDay(crt,frmId)
{
	if(crt.value == 'D' || crt.value == '')
	{
		$('#settleCycleSpecificDayM').hide();
		$('#settleTemp').show();
		$('#settleCycleSpecificDayW').hide();
	}
	if(crt.value == 'W')
	{
		$('#settleCycleSpecificDayW').show();
		$('#settleCycleSpecificDayM').hide();
		$('#settleTemp').hide();
	}
	if(crt.value == 'M')
	{
		$('#settleCycleSpecificDayM').show();
		$('#settleCycleSpecificDayW').hide();
		$('#settleTemp').hide();
	}
}
function enable(crt)
{
	if(crt.value == 'BEFORE')
	{
		$('#periodSpecificDay').attr("value","INVOICEDUEDATE");
		$('#periodSpecificDay').attr("disabled","true");
		
	}
	if(crt.value == 'AFTER')
	{
		$('#periodSpecificDay').removeAttr("disabled");
	}
}
function settleenable(crt)
{
	if(crt.value == '1')
	{
		$('#settlePeriodSpecificDay').attr("value","2");
		$('#settlePeriodSpecificDay').attr("disabled","true");
		
	}
	if(crt.value == '2')
	{
		$('#settlePeriodSpecificDay').removeAttr("disabled");
	}
}
function enableTdsAmnt(crt)
{
	if(crt.value == 'Y')
	{
		$('#tdsAmnt').show();
	}
	else
	{
		$('#tdsAmnt').hide();
	}
}
function getPOInfo(crt)
{
	if(crt.value == 'C')
	{
		$('#trPoCycle').show();
		$('#trPoPeriod').hide();
		$('#trPoLabel').show();
	}
	if(crt.value == 'P')
	{
		
		$('#trPoCycle').hide();
		$('#trPoPeriod').show();
		$('#trPoLabel').show();
		$('#poPeriodSpecificDay').attr("disabled","true");
	}
	if(crt.value == 'I' || crt.value=='M' || crt.value=='')
	{
		
		$('#trPoCycle').hide();
		$('#trPoPeriod').hide();
		$('#trPoLabel').hide();
	}
}
function enaDisableSpecificDayPO(crt,frmId)
{
	if(crt.value == 'D' || crt.value == '')
	{
		$('#poCycleSpecificDayM').hide();
		$('#poTemp').show();
		$('#poCycleSpecificDayW').hide();
	}
	if(crt.value == 'W')
	{
		$('#poCycleSpecificDayW').show();
		$('#poCycleSpecificDayM').hide();
		$('#poTemp').hide();
	}
	if(crt.value == 'M')
	{
		$('#poCycleSpecificDayM').show();
		$('#poCycleSpecificDayW').hide();
		$('#poTemp').hide();
	}
}
function poEnable(crt)
{
	if(crt.value == '1')
	{
		$('#poPeriodSpecificDay').attr("value","2");
		$('#poPeriodSpecificDay').attr("disabled","true");
		
	}
	if(crt.value == '2')
	{
		$('#poPeriodSpecificDay').removeAttr("disabled");
	}
}
/* ################# Add SCM My Product Ends ##################### */

/* ################# View SCM My Product Ends ##################### */
function goToBack(frmId, strUrl)
{
	var frm = document.getElementById(frmId);
	frm.action = strUrl;
	frm.target = "";
	frm.method = "POST";
	frm.submit();
}
/* ################# View SCM My Product Ends ##################### */