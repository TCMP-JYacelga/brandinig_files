function showTxnInstrumentInfoPopup() {
	$('#agreementSweepTrasanctionSummaryDiv').dialog(
			{
				autoOpen : false,
				maxHeight : 620,
				width : 690,
				modal : true,
				dialogClass : 'ft-dialog',
				title : getLabel('trnInfoTitle', 'Transaction Information'),
				open : function() {
					$('#agreementSweepTrasanctionSummaryDiv').removeClass('hidden');
					var additionalInfo = getAgreementAddtionalInfo($('#viewState').val());
					if (!isEmpty(additionalInfo)) {
						if (additionalInfo && additionalInfo.companyName
								&& additionalInfo.companyAddress) {
							var strCompany = additionalInfo.companyName + '</br>'
									+ additionalInfo.companyAddress;
							$('.companydetails_InfoSpan ').html(strCompany);
						}
						if (additionalInfo && additionalInfo.agreementName) {
							$('.agreementName_InfoSpan').text(additionalInfo.agreementName);
						}
						if (additionalInfo && additionalInfo.agreementType) {
							$('.agreementType_InfoSpan').text(getLabel(additionalInfo.agreementType,additionalInfo.agreementType));
						}
						if (additionalInfo && additionalInfo.enteredBy) {
							$('.enteredBy_InfoSpan').text(decodeURIComponent(additionalInfo.enteredBy));
						}
						if (additionalInfo && additionalInfo.status) {
							$('.status_InfoSpan').html(additionalInfo.status);
						}
					}
					if (additionalInfo && !isEmpty(additionalInfo.history) && additionalInfo.history.length > 0) {
						paintAgreementAuditInfoGrid(additionalInfo.history);
					}
					$('#agreementSweepTrasanctionSummaryDiv').dialog('option', 'position', 'center');
				},
				close : function() {
				}
			});
	$('#agreementSweepTrasanctionSummaryDiv').dialog('open');
	$('#agreementSweepTrasanctionSummaryDiv').dialog('option', 'position', 'center');
}

function getAgreementAddtionalInfo(strIdentifier) {
	var objResponseData = null;
	var strData = {};
	strData[csrfTokenName] = csrfTokenValue;
	if (strIdentifier && strIdentifier !== '') {
		var strUrl = 'services/agreementMst/agreementSweepAdditionalInfo.json?viewState=' + strIdentifier;
		$.ajax({
			url : strUrl,
			type : 'POST',
			data : strData,
			async : false,
			contentType : 'application/json',
			complete : function(XMLHttpRequest, textStatus) {
			},
			success : function(data) {
				if (data && data.d) {
					objResponseData = data.d;
				}
			}
		});
	}
	return objResponseData;
}

function paintAgreementAuditInfoGrid(data) {
	var renderToDiv = 'auditInfoGridDiv';
	$('#auditInformationInfoHdrDiv').removeClass('hidden');
	if (!isEmpty(renderToDiv)) {
		$('#' + renderToDiv).empty();
		var store = createAuditInfoGridStore(data);
		var grid = Ext.create('Ext.grid.Panel', {
			store : store,
			popup : true,
			columns : [ {
				dataIndex : 'userCode',
				text : getLabel('userCode', 'User'),
				width : 150,
				draggable : false,
				resizable : false,
				hideable : false
			}, {
				dataIndex : 'logDate',
				text : getLabel('logDate', 'Date Time'),
				width : 200,
				draggable : false,
				resizable : false,
				hideable : false
			}, {
				dataIndex : 'statusDesc',
				text : getLabel('statusDesc', 'Status'),
				width : 150,
				draggable : false,
				resizable : false,
				hideable : false,
				renderer : function(value, metadata) {
					if (!Ext.isEmpty(value) && value.length > 11) {
						metadata.tdAttr = 'title="' + value + '"';
					}
					return value;
				}
			}, {
				dataIndex : 'remarks',
				text : getLabel('remarks', 'Reject Remarks'),
				flex : 1,
				draggable : false,
				resizable : false,
				hideable : false,
				renderer : function(value, metadata) {
					if (!Ext.isEmpty(value) && value.length > 11) {
						metadata.tdAttr = 'title="' + value + '"';
					}
					return value;
				}
			} ],
			renderTo : renderToDiv
		});
		var layout = Ext.create('Ext.container.Container', {
			width : 'auto',
			items : [ grid ],
			renderTo : renderToDiv
		});
		return layout;
	}
	function createAuditInfoGridStore(jsonData) {
		var myStore = Ext.create('Ext.data.Store', {
			fields : [ 'version', 'parentRecordKeyNo', 'userCode', 'logDate', 'statusDesc', 'clientCode', 'logNumber',
					'billerCode', 'remarks', '__metadata' ],
			data : jsonData,
			autoLoad : true
		});
		return myStore;
	}

}

function goToPage(strUrl) {
	
	if('201' === structureType ){
    	if(agreementMstGrid && 
           agreementMstGrid.getStore() &&
           agreementMstGrid.getStore().data && 
           agreementMstGrid.getStore().data.items && 
           agreementMstGrid.getStore().data.items.length>1)
           {
            $('#uiErrorsDiv').addClass('hidden');
            var frm = document.getElementById('frmMain');
            $("input").removeAttr('disabled');
            $("select").removeAttr('disabled');
            $("checkbox").removeAttr('disabled');
            frm.action = strUrl;
            frm.target = '';
            frm.method = 'POST';
            frm.submit();
           }
           else
           {
           	$('#uiErrorsDiv').removeClass('hidden');
           	$("html, body").animate({
            scrollTop : 0
            }, "slow");
           }
	} 
	else
	{
		var frm = document.getElementById('frmMain');
        $("input").removeAttr('disabled');
        $("select").removeAttr('disabled');
        $("checkbox").removeAttr('disabled');
        frm.action = strUrl;
        frm.target = '';
        frm.method = 'POST';
        frm.submit();
	}
}

function showList( strUrl )
{
	//window.location = strUrl;
	var frm;
	frm = document.createElement('FORM');
	frm.name = 'frmMain';
	frm.id = 'frmMain';
	frm.action = strUrl;
	frm.target = '';
	frm.method = 'POST';
	frm.appendChild(createFormField('INPUT', 'HIDDEN', csrfTokenName, csrfTokenValue));
	document.body.appendChild(frm);
	frm.submit();
	document.body.removeChild(frm);
}

function goToCenterPage() {
	var frm;
	var strUrl = 'agreementMstList.srvc';

	frm = document.createElement('FORM');
	frm.name = 'frmMain';
	frm.id = 'frmMain';
	frm.action = strUrl;
	frm.target = '';
	frm.method = 'POST';
	frm.appendChild(createFormField('INPUT', 'HIDDEN', csrfTokenName, csrfTokenValue));
	document.body.appendChild(frm);
	frm.submit();
	document.body.removeChild(frm);
}