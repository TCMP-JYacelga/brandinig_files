var BILLER_REGISTRATION_COLUMNS_AUTO = [ {
	'colId' : 'benefDesc',
	'colHeader' : getLabel('biller', 'Biller'),
	'sortable' : true,
	'colDesc' : getLabel('biller', 'Biller'),
	'colSequence' : 1,
	'width' : 200,
	'locked' : false,
	'hidden' : false,
	'hideable' : false
}, {
	'colId' : 'registrationDate',
	'colHeader' : getLabel('regDate', 'Registration Date'),
	'sortable' : true,
	'colType' : 'date',
	'colDesc' : getLabel('regDate', 'Registration Date'),
	'colSequence' : 2,
	'width' : 200,
	'locked' : false,
	'hidden' : false,
	'hideable' : true
}, {
	'colId' : 'reference',
	'colHeader' : getLabel('reference', 'Reference'),
	'sortable' : true,
	'colDesc' : getLabel('reference', 'Reference'),
	'colSequence' : 3,
	'width' : 170,
	'locked' : false,
	'hidden' : false,
	'hideable' : true
}, {
	'colId' : 'billPayType',
	'colHeader' : getLabel('billPayType', 'Bill Pay Type'),
	'sortable' : true,
	'colDesc' : getLabel('billPayType', 'Bill Pay Type'),
	'colSequence' : 4,
	'width' : 170,
	'locked' : false,
	'hidden' : false,
	'hideable' : true
}, {
	'colId' : 'acctNmbr',
	'colHeader' : getLabel('paymentAccount', 'Payment Account'),
	'sortable' : true,
	'colDesc' : getLabel('paymentAccount', 'Payment Account'),
	'colSequence' : 5,
	'width' : 170,
	'locked' : false,
	'hidden' : false,
	'hideable' : true
}, {
	'colId' : 'requestStateDesc',
	'colHeader' : getLabel('status', 'Status'),
	'sortable' : false,
	'colDesc' : getLabel('status', 'Status'),
	'colSequence' : 6,
	'width' : 170,
	'locked' : false,
	'hidden' : false,
	'hideable' : true
} ];
var BILLER_REGISTRATION_COLUMNS_MANUAL = [ {
	'colId' : 'benefDesc',
	'colHeader' : getLabel('biller', 'Biller'),
	'sortable' : true,
	'colDesc' : getLabel('biller', 'Biller'),
	'colSequence' : 1,
	'width' : 200,
	'locked' : false,
	'hidden' : false,
	'hideable' : false
}, {
	'colId' : 'registrationDate',
	'colHeader' : getLabel('regDate', 'Registration Date'),
	'sortable' : true,
	'colType' : 'date',
	'colDesc' : getLabel('regDate', 'Registration Date'),
	'colSequence' : 2,
	'width' : 200,
	'locked' : false,
	'hidden' : false,
	'hideable' : true
}, {
	'colId' : 'reference',
	'colHeader' : getLabel('reference', 'Reference'),
	'sortable' : true,
	'colDesc' : getLabel('reference', 'Reference'),
	'colSequence' : 3,
	'width' : 170,
	'locked' : false,
	'hidden' : false,
	'hideable' : true
}, {
	'colId' : 'billPayType',
	'colHeader' : getLabel('billPayType', 'Bill Pay Type'),
	'sortable' : true,
	'colDesc' : getLabel('billPayType', 'Bill Pay Type'),
	'colSequence' : 4,
	'width' : 170,
	'locked' : false,
	'hidden' : false,
	'hideable' : true
}, {
	'colId' : 'requestStateDesc',
	'colHeader' : getLabel('status', 'Status'),
	'sortable' : false,
	'colDesc' : getLabel('status', 'Status'),
	'colSequence' : 6,
	'width' : 170,
	'locked' : false,
	'hidden' : false,
	'hideable' : true
} ];
var BILLER_REGISTRATION_COLUMNS = ('Y' === ISBILLERAUTO) ? BILLER_REGISTRATION_COLUMNS_AUTO : BILLER_REGISTRATION_COLUMNS_MANUAL;
var arrStatus = [ {
	'code' : '0',
	'desc': getLabel('new','New')
}, {
	'code' : '3',
	'desc': getLabel('approved','Approved')
}, {
	'code' : '1',
	'desc': getLabel('modified','Modified')
}, {
	'code' : '7',
	'desc': getLabel('newrejected','New Rejected')
}, {
	'code' : '8',
	'desc': getLabel('modifiedrejected','Modified Rejected')
},

{
	'code' : '12',
	'desc': getLabel('submitted','Submitted')
}, {
	'code' : '4',
	'desc': getLabel('active','Active')
}, {
	'code' : '5',
	'desc': getLabel('inactive','In-Active')
}, {
	'code' : '6',
	'desc': getLabel('inprocess','In Process')
} ];

function setDirtyBit() {
	dirtyBitSet = true;
	$('#dirtyBit').val('1');
}

function getDiscardConfirmPopUp(strUrl) {
	$('#cancelDiscardConfirmMsg').bind('click', function() {
		$('#discardMsgPopup').dialog('close');
	});
	$('#doneConfirmDiscardbutton').bind('click', function() {
		$(this).dialog('close');
		discardProfile(strUrl);
	});
	$('#discardMsgPopup').dialog({
		autoOpen : false,
		maxHeight : 550,
		width : 400,
		modal : true,
		resizable : false,
		draggable : false
	});
	$('#discardMsgPopup').dialog('open');
	$('#textContent').focus();
}

function getCancelConfirmPopUp(strUrl) {
	$('#cancelConfirmMsg').bind('click', function() {
		$('#confirmMsgPopup').dialog('close');
	});

	$('#doneConfirmMsgbutton').bind('click', function() {
		$(this).dialog('close');
		gotoPage(strUrl);
	});
	if (dirtyBitSet) {
		$('#confirmMsgPopup').dialog({
			autoOpen : false,
			maxHeight : 550,
			minHeight : 'auto',
			width : 400,
			modal : true,
			resizable : false,
			draggable : false
		});
		$('#confirmMsgPopup').dialog('open');
		$('#textContent').focus();
	}
	else {
		gotoPage(strUrl);
	}
}

function gotoPage(strUrl) {
	var frm = document.forms['frmMain'];
	frm.action = strUrl;
	$('input').removeAttr('disabled');
	$('select').removeAttr('disabled');

	frm.target = '';
	frm.method = 'POST';
	frm.action = strUrl;
	frm.method = 'POST';
	frm.submit();
}

function showWarning(strUrl) {
	$('#cancelWarningMsg').bind('click', function() {
		$('#warningMsgPopup').dialog('close');
	});

	$('#doneWarningMsgbutton').bind('click', function() {
		$(this).dialog('close');
		gotoPage(strUrl);
	});
	if (dirtyBitSet && isTxnExists === 'true') {
		$('#warningMsgPopup').dialog({
			autoOpen : false,
			maxHeight : 550,
			minHeight : 'auto',
			width : 400,
			modal : true,
			resizable : false,
			draggable : false
		});
		$('#warningMsgPopup').dialog('open');
		$('#textContent').focus();
	}
	else {
		gotoPage(strUrl);
	}
}
function handleAutoPayDisplay() {
	var strBillPayType = $('input[type="radio"][name="billPayType"]:checked').val();
	if ('M' === strBillPayType) {
		$('#autoPayDetailsDiv').addClass('hidden');
	}
	else {
		$('#autoPayDetailsDiv').removeClass('hidden');
	}
}
