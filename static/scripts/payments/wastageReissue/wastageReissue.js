function getLabel(key, defaultText) {
	return (printingLabelsMap && !Ext.isEmpty(printingLabelsMap[key])) ? printingLabelsMap[key]
	: defaultText
}

function showWastageReissuePopup(actionName, arrRecords)
{
	var strTitle = null;
	$('#wastageReissuePopup').dialog({
		autoOpen : false,
		maxHeight: 550,
		minHeight:156,
		width : 750,
		modal : true,
		resizable: false,
		dialogClass : 'ft-dialog',
		draggable: false,
		title: 'reissue' === actionName ? getLabel('wastageReissue','Wastage And Reissue') : getLabel('wastage','Wastage')
	});
	setWastagePopup(actionName,arrRecords[0].data);
	
	$('#popupConfirmBtn').off().on('click',function(){
		if (!$(this).is(':disabled')) {
			submitWastageEntry(actionName,arrRecords);
   	  	}
	});
	
	$('#wastageReissuePopup').dialog('open');
}

function setWastagePopup(actionName, record)
{
	if ('reissue' === actionName && null!= record && 'TP' === record.outsourcedPrintType) 
	{
		$('#instrumentNmbrDiv').show();
	} 
	else 
	{
		$('#instrumentNmbrDiv').hide();
	}
	$('#instrumentNmbr').val('');
	$('#wastageRemark').val('');
	resetPopupErrorDiv();
}

function resetPopupErrorDiv()
{
	$('#popupMessageContentDiv').addClass('hidden');
	$("#popupMessageArea").empty();
}

function submitWastageEntry(actionName,arrRecords)
{
	enableDisableWastagePopupActions(false);
	var arrayJson = [];
	var wastageRemark = $('#wastageRemark').val();
	var instrumentNmbr = $('#instrumentNmbr').val();
	$.each(arrRecords,function(index, record){
		arrayJson.push({
			decision : instrumentNmbr,
			reason : wastageRemark,
			identifier : record.data.identifier
		});
	})

	$.ajax({
		url : 'services/wastageReissue/'+actionName,
		type: 'POST',
		contentType: 'application/json; charset=utf-8',
	    data : JSON.stringify(arrayJson),
		success : function(response) {
			var errorMessage = '';
			var gridRefreshFlag = false;
			enableDisableWastagePopupActions(true);
			resetPopupErrorDiv();
			if (response) 
			{
				var jsonData = response;
				if (!isEmpty(jsonData.d)
						&& !isEmpty(jsonData.d.instrumentActions))
				{
					jsonData = jsonData.d.instrumentActions;
					$.each(jsonData, function (i, item) {
						if('Y' === item.success)
						{
							gridRefreshFlag = true;
						}
						var arrError = item.errors;
						if(!isEmpty(arrError)){
							$('#popupMessageContentDiv').removeClass('hidden');
							paintErrorDiv(arrError,'popupMessageArea');
						}
					});
				}
			}
			if(gridRefreshFlag)
			{
				$(document).trigger('refreshGridOnSave');
				$('#wastageReissuePopup').dialog('close');
			}
		},
		error : function(response) 
		{
			resetPopupErrorDiv();
			enableDisableWastagePopupActions(true);
		}
	});
}

function enableDisableWastagePopupActions(isEnable)
{
	if(true === isEnable)
	{
		$('#popupCancelBtn').prop('disabled', false)
		$('#popupConfirmBtn').prop('disabled', false)
	}
	else
	{
		$('#popupCancelBtn').prop('disabled', true)
		$('#popupConfirmBtn').prop('disabled', true)
	}
}


function paintErrorDiv(arrError,id)
{
	var errorDiv = $('#'+id);
	$.each(arrError, function (i, error) {
		errorDiv.append('<p>' + error.code + ' : '+ error.errorMessage + '</p>' );
	});
}

function cancelDialog(id)
{
	$('#'+id).dialog('close');
}

var WASTAGE_REISSUE_COLUMNS = [ 
{
	'colId' : 'pdtReference',
	'colHeader' : getLabel('pdtReference', 'Payment Reference'),
	'sortable' : true,
	'colDesc' : getLabel('pdtReference', 'Payment Reference'),
	'colSequence' : 1,
	'width' : 170,
	'locked' : false,
	'hidden' : false,
	'hideable' : false
}, {
	'colId' : 'statusDesc',
	'colHeader' : getLabel('statusDesc', 'Status'),
	'sortable' : false,
	'colDesc' : getLabel('statusDesc', 'Status'),
	'colSequence' : 2,
	'width' : 170,
	'locked' : false,
	'hidden' : false,
	'hideable' : true
},{
	'colId' : 'pdtProductDesc',
	'colHeader' : getLabel('pdtProductDesc', 'Payment Package'),
	'sortable' : true,
	'colDesc' : getLabel('pdtProductDesc', 'Payment Package'),
	'colSequence' : 3,
	'width' : 200,
	'locked' : false,
	'hidden' : false,
	'hideable' : true
}, {
	'colId' : 'pdtBnkProductDesc',
	'colHeader' : getLabel('pdtbnkProductDesc', 'Product'),
	'sortable' : true,
	'colDesc' : getLabel('pdtbnkProductDesc', 'Product'),
	'colSequence' : 4,
	'width' : 200,
	'locked' : false,
	'hidden' : false,
	'hideable' : true
}, {
	'colId' : 'pdtBeneficiary',
	'colHeader' : getLabel('pdtBenefName', 'Receiver Name'),
	'sortable' : true,
	'colDesc' : getLabel('pdtBenefName', 'Receiver Name'),
	'colSequence' : 5,
	'width' : 170,
	'locked' : false,
	'hidden' : false,
	'hideable' : true
}, {
	'colId' : 'instrumentDate',
	'colHeader' : getLabel('instrumentDate', 'Instrument Date'),
	'sortable' : true,
	'colDesc' : getLabel('instrumentDate', 'Instrument Date'),
	'colSequence' : 6,
	'width' : 170,
	'locked' : false,
	'hidden' : false,
	'hideable' : true
}, {
	'colId' : 'oldInstNo',
	'colHeader' : getLabel('oldInstNo', 'Instrument #'),
	'sortable' : true,
	'colDesc' : getLabel('oldInstNo', 'Instrument #'),
	'colSequence' : 7,
	'width' : 170,
	'locked' : false,
	'hidden' : false,
	'hideable' : true
}, {
	'colId' : 'newInstNo',
	'colHeader' : getLabel('newInstNo', 'New Instrument #'),
	'sortable' : true,
	'colDesc' : getLabel('newInstNo', 'New Instrument #'),
	'colSequence' : 8,
	'width' : 170,
	'locked' : false,
	'hidden' : false,
	'hideable' : true
}, {
	'colId' : 'pdtInstAmount',
	"colType" : "amount",
	'colHeader' : getLabel('pdtInstAmount', 'Amount'),
	'sortable' : true,
	'colDesc' : getLabel('pdtInstAmount', 'Amount'),
	'colSequence' : 9,
	'width' : 170,
	'locked' : false,
	'hidden' : false,
	'hideable' : true
}, {
	'colId' : 'pdtDebitCcy',
	'colHeader' : getLabel('pdtDebitCcy', 'Currency'),
	'sortable' : true,
	'colDesc' : getLabel('pdtDebitCcy', 'Currency'),
	'colSequence' : 10,
	'width' : 170,
	'locked' : false,
	'hidden' : false,
	'hideable' : true
}, {
	'colId' : 'wastageRemarks',
	'colHeader' : getLabel('wastageRemarks', 'Reason For Wastage'),
	'sortable' : true,
	'colDesc' : getLabel('wastageRemarks', 'Reason For Wastage'),
	'colSequence' : 11,
	'width' : 170,
	'locked' : false,
	'hidden' : false,
	'hideable' : true
}, {
	'colId' : 'makerId',
	'colHeader' : getLabel('makerId', 'Maker'),
	'sortable' : true,
	'colDesc' : getLabel('makerId', 'Maker'),
	'colSequence' : 12,
	'width' : 170,
	'locked' : false,
	'hidden' : false,
	'hideable' : true
}, {
	'colId' : 'makerStamp',
	'colHeader' : getLabel('makerStamp', 'Maker Date'),
	'sortable' : true,
	'colDesc' : getLabel('makerStamp', 'Maker Date'),
	'colSequence' : 13,
	'width' : 170,
	'locked' : false,
	'hidden' : false,
	'hideable' : true
}, {
	'colId' : 'checkerId',
	'colHeader' : getLabel('checkerId', 'Checker'),
	'sortable' : true,
	'colDesc' : getLabel('checkerId', 'Checker'),
	'colSequence' : 14,
	'width' : 170,
	'locked' : false,
	'hidden' : false,
	'hideable' : true
}, {
	'colId' : 'checkerStamp',
	'colHeader' : getLabel('checkerStamp', 'Checker Date'),
	'sortable' : true,
	'colDesc' : getLabel('checkerStamp', 'Checker Date'),
	'colSequence' : 15,
	'width' : 170,
	'locked' : false,
	'hidden' : false,
	'hideable' : true
}, {
	'colId' : 'pdtPriPayLocDesc',
	'colHeader' : getLabel('pdtPriPayLocDesc', 'Payment Location'),
	'sortable' : true,
	'colDesc' : getLabel('pdtPriPayLocDesc', 'Payment Location'),
	'colSequence' : 16,
	'width' : 170,
	'locked' : false,
	'hidden' : true,
	'hideable' : true
}, {
	'colId' : 'pdtPickupBranchDesc',
	'colHeader' : getLabel('pdtPickupBranchDesc', 'Pickup Branch'),
	'sortable' : true,
	'colDesc' : getLabel('pdtPickupBranchDesc', 'Pickup Branch'),
	'colSequence' : 17,
	'width' : 170,
	'locked' : false,
	'hidden' : true,
	'hideable' : true
}, {
	'colId' : 'pdtAuthPersonName',
	'colHeader' : getLabel('pdtAuthPersonName', 'Authorized Person Name'),
	'sortable' : true,
	'colDesc' : getLabel('pdtAuthPersonName', 'Authorized Person Name'),
	'colSequence' : 18,
	'width' : 170,
	'locked' : false,
	'hidden' : true,
	'hideable' : true
}, {
	'colId' : 'pdtAuthPersonIdTypeDesc',
	'colHeader' : getLabel('pdtAuthPersonIdTypeDesc', 'Authorized Person ID Type'),
	'sortable' : true,
	'colDesc' : getLabel('pdtAuthPersonIdTypeDesc', 'Authorized Person ID Type'),
	'colSequence' : 19,
	'width' : 170,
	'locked' : false,
	'hidden' : true,
	'hideable' : true
}, {
	'colId' : 'pdtAuthPersonId',
	'colHeader' : getLabel('pdtAuthPersonId', 'Authorized Person Id'),
	'sortable' : true,
	'colDesc' : getLabel('pdtAuthPersonId', 'Authorized Person Id'),
	'colSequence' : 20,
	'width' : 170,
	'locked' : false,
	'hidden' : true,
	'hideable' : true
}, {
	'colId' : 'whtApplicable',
	'colHeader' : getLabel('whtApplicable', 'WHT Applicable'),
	'sortable' : true,
	'colDesc' : getLabel('whtApplicable', 'WHT Applicable'),
	'colSequence' : 21,
	'width' : 170,
	'locked' : false,
	'hidden' : true,
	'hideable' : true
}, {
	'colId' : 'whtTotalAmount',
	'colHeader' : getLabel('whtTotalAmount', 'WHT Amount'),
	'sortable' : true,
	'colDesc' : getLabel('whtTotalAmount', 'WHT Amount'),
	'colSequence' : 22,
	'width' : 170,
	'locked' : false,
	'hidden' : true,
	'hideable' : true
}, {
	'colId' : 'receiverTaxId',
	'colHeader' : getLabel('receiverTaxId', "Receiver's Tax ID"),
	'sortable' : true,
	'colDesc' : getLabel('receiverTaxId', "Receiver's Tax ID"),
	'colSequence' : 23,
	'width' : 170,
	'locked' : false,
	'hidden' : true,
	'hideable' : true
}, {
	'colId' : 'whtFormCode',
	'colHeader' : getLabel('whtFormCode', 'Form Code'),
	'sortable' : true,
	'colDesc' : getLabel('whtFormCode', 'Form Code'),
	'colSequence' : 24,
	'width' : 170,
	'locked' : false,
	'hidden' : true,
	'hideable' : true
}, {
	'colId' : 'certificateRefNo',
	'colHeader' : getLabel('certificateRefNo', 'Certificate Ref No'),
	'sortable' : true,
	'colDesc' : getLabel('certificateRefNo', 'Certificate Ref No'),
	'colSequence' : 25,
	'width' : 170,
	'locked' : false,
	'hidden' : true,
	'hideable' : true
}];

var arrStatus = [ {
	'code' : 'N',
	'desc' : getLabel('new', 'New')
}, {
	'code' : 'CN',
	'desc' : getLabel('pendingWastage', 'Pending Wastage Auth')
}, {
	'code' : 'WN',
	'desc' : getLabel('pendingReissue', 'Pending Reissue Auth')
}, {
	'code' : 'CA',
	'desc' : getLabel('wasted', 'Wasted')
}, {
	'code' : 'WA',
	'desc' : getLabel('reissued', 'Reissued')
}, {
	'code' : 'R',
	'desc' : getLabel('rejected', 'Rejected')
} ];

var arrStatusCode = {
	"N": "status eq 'PP'",
	"CN":"status eq 'CN' and statusFlag eq 'N'",
	"WN":"status eq 'WN' and statusFlag eq 'N'",
	"CA":"status eq 'CA' and statusFlag eq 'A'",
	"WA":"status eq 'WA' and statusFlag eq 'A'",
	"R":"(status eq 'CN' or status eq 'WN') and statusFlag eq 'R'"
};