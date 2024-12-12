function getLabel(key, defaultText) {
	return (printingLabelsMap && !Ext.isEmpty(printingLabelsMap[key])) ? printingLabelsMap[key]
	: defaultText
}

function showInstrPrintViewPopUp(record)
{
	$('#instrPrintViewPopup').dialog({
		autoOpen : false,
		maxHeight: 550,
		minHeight:156,
		width : 865,
		modal : true,
		resizable: false,
		dialogClass : 'ft-dialog',
		draggable: false,
		title: getLabel('InstrumentprintingDetails', 'Instrument Printing Details'),
 		open: function() {
			createInstrPrintViewGrid(record);
			setDtlViewPopupFields(record.data.pdfFileName, record.data.phdReference)
		 }
	});
	$('#instrPrintViewPopup').dialog("open");
}

function createInstrPrintViewGrid(record)
{
	$(document).trigger('loadInstrPrintDtlViewSmartGrid',[record]);
}

function showLotInfoPopUp(record)
{
	$('#lotInfo').dialog({
		autoOpen : false,
		maxHeight: 550,
		minHeight:156,
		width : 865,
		modal : true,
		resizable: false,
		dialogClass : 'ft-dialog',
		draggable: false,
		title: getLabel('lotInfo', 'Lot Info'),
		open: function() {
			createLotInfoGrid(record);
		 }
	});
	$('#lotInfo').dialog("open");
}

function createLotInfoGrid(record)
{
	$(document).trigger('loadLotInfoSmartGrid',[record]);
}

function setDtlViewPopupFields(pdfFileName, phdReference){
	$("#pdfFileName").text(pdfFileName).prop('title',pdfFileName);
	$("#phdReference").text(phdReference).prop('title',phdReference);
}

function showLotInfoDetail(clientName, productName){
	$('#clientName').text(clientName).prop('title',clientName);
	$('#productDesc').text(productName).prop('title',productName);
}

var INSTR_PRINT_COLUMNS = [ {
	'colId' : 'pdfFileName',
	'colHeader' : getLabel('pdfFileName', 'PDF File Name'),
	'sortable' : true,
	'colDesc' : getLabel('pdfFileName', 'PDF File Name'),
	'colSequence' : 1,
	'width' : 200,
	'locked' : false,
	'hidden' : false,
	'hideable' : false
}, {
	'colId' : 'adviceIncluded',
	'colHeader' : getLabel('adviceIncluded', 'Advice Included'),
	'sortable' : false,
	'colDesc' : getLabel('adviceIncluded', 'Advice Included'),
	'colSequence' : 2,
	'width' : 100,
	'locked' : false,
	'hidden' : false,
	'hideable' : true
}, {
	'colId' : 'whtIncluded',
	'colHeader' : getLabel('whtIncluded', 'WHT Included'),
	'sortable' : false,
	'colDesc' : getLabel('whtIncluded', 'WHT Included'),
	'colSequence' : 3,
	'width' : 100,
	'locked' : false,
	'hidden' : false,
	'hideable' : true
}, {
	'colId' : 'phdReference',
	'colHeader' : getLabel('phdReference', 'Payment Reference'),
	'sortable' : true,
	'colDesc' : getLabel('phdReference', 'Payment Reference'),
	'colSequence' : 4,
	'width' : 200,
	'locked' : false,
	'hidden' : false,
	'hideable' : true
}, {
	'colId' : 'decodeStatus',
	'colHeader' : getLabel('decodeStatus', 'Status'),
	'sortable' : false,
	'colDesc' : getLabel('decodeStatus', 'Status'),
	'colSequence' : 5,
	'width' : 170,
	'locked' : false,
	'hidden' : false,
	'hideable' : true
}, {
	'colId' : 'createdDate',
	'colHeader' : getLabel('createdDate', 'Created Date'),
	'sortable' : true,
	'colDesc' : getLabel('createdDate', 'Created Date'),
	'colSequence' : 6,
	'width' : 170,
	'locked' : false,
	'hidden' : false,
	'hideable' : true
}, {
	'colId' : 'printBy',
	'colHeader' : getLabel('printBy', 'Printed By'),
	'sortable' : true,
	'colDesc' : getLabel('printBy', 'Printed By'),
	'colSequence' : 7,
	'width' : 170,
	'locked' : false,
	'hidden' : false,
	'hideable' : true
}, {
	'colId' : 'printDate',
	'colHeader' : getLabel('printDate', 'Printed Date/Time'),
	'sortable' : true,
	'colDesc' : getLabel('printDate', 'Printed Date/Time'),
	'colSequence' : 8,
	'width' : 170,
	'locked' : false,
	'hidden' : false,
	'hideable' : true
}, {
	'colId' : 'printConfirmBy',
	'colHeader' : getLabel('printConfirmBy', 'Print Confirm By'),
	'sortable' : true,
	'colDesc' : getLabel('printConfirmBy', 'Print Confirm By'),
	'colSequence' : 9,
	'width' : 170,
	'locked' : false,
	'hidden' : false,
	'hideable' : true
}, {
	'colId' : 'printConfirmDate',
	'colHeader' : getLabel('printConfirmDate', 'Print Confirm Date/Time'),
	'sortable' : true,
	'colDesc' : getLabel('printConfirmDate', 'Print Confirm Date/Time'),
	'colSequence' : 10,
	'width' : 170,
	'locked' : false,
	'hidden' : false,
	'hideable' : true
}];

var arrStatus = [ {
	'code' : 'RP',
	'desc' : getLabel('RP', 'Ready For Printing')
}, {
	'code' : 'PP',
	'desc' : getLabel('PP', 'Pending Print Confirm')
}, {
	'code' : 'P',
	'desc' : getLabel('PC', 'Printed')
},{
	'code' : 'W',
	'desc' : getLabel('W', 'Wasted')
},{
	'code' : 'PR',
	'desc' : getLabel('PR', 'Partial Printed')
} ];