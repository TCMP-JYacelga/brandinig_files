/**
 * Sample Column Model, User should have to structured the column model in this
 * way
 */
var actionsForWidget =
[
	'Submit', 'Discard', 'Enable', 'Disable'
];
var REPORT_GENERIC_COLUMN_MODEL =
[
	/*{
	"colId" : "entityDesc",
	"colHeader" : "Client",
	"hidden" : false
	},
	*/
	{
		"colId" : "reportName",
		"colHeader" : "Report Name",
		"hidden" : false
	},
	{
		"colId" : "moduleName",
		"colHeader" : "Module",
		"hidden" : false
	},
	{
		"colId" : "securityProfile",
		"colHeader" : "Security Config",
		"hidden" : false
	},
	{
		"colId" : "createdBy",
		"colHeader" : "Created By",
		"hidden" : false
	},
	{
		"colId" : "reportStatus",
		"colHeader" : "Status",
		"hidden" : false
	}
];
var objGridWidthMap =
{
	"reportName" : 240,
	"moduleName" : 170,
	"securityProfile" : 150,
	"createdBy" : 130,
	"reportStatus" : 100
};

var arrSortByPaymentFields =
[
	{
		"colId" : "recieverName",
		"colDesc" : getLabel("receiverName","Receiver Name")
	},
	{
		"colId" : "amount",
		"colDesc" : "Amount"
	},
	{
		"colId" : "count",
		"colDesc" : "Count"
	},
	{
		"colId" : "actionStatus",
		"colDesc" : "Status"
	},
	{
		"colId" : "productTypeDesc",
		"colDesc" : "My Product"
	},
	{
		"colId" : "activationDate",
		"colDesc" : "Effective Date"
	},
	{
		"colId" : "sendingAccount",
		"colDesc" : "Sending Account"
	},
	{
		"colId" : "templateName",
		"colDesc" : "Template Name"
	},
	{
		"colId" : "recieverAccount",
		"colDesc" : getLabel("receiverAccountCCY","Receiver Account + CCY")
	},
	{
		"colId" : "entryDate",
		"colDesc" : "Entry Date"
	},
	{
		"colId" : "valueDate",
		"colDesc" : "Process Date"
	},
	{
		"colId" : "client",
		"colDesc" : "Client Description"
	},
	{
		"colId" : "bankProduct",
		"colDesc" : "Bank Product"
	},
	{
		"colId" : "phdnumber",
		"colDesc" : "Tracking #"
	},
	{
		"colId" : "clientReference",
		"colDesc" : "Payment Reference"
	},
	{
		"colId" : "currency",
		"colDesc" : "Sending Account + CCY"
	},
	{
		"colId" : "creditAmount",
		"colDesc" : "Credit Amount"
	},
	{
		"colId" : "debitAmount",
		"colDesc" : "Debit Amount"
	},
	{
		"colId" : "txnType",
		"colDesc" : "Type of Transaction"
	},
	{
		"colId" : "maker",
		"colDesc" : "Entry User"
	},
	{
		"colId" : "hostMessage",
		"colDesc" : "Host Message"
	}
];
var arrPaymentStatus =
[
	{
		'code' : '0',
		'desc' : 'Draft'
	},
	{
		'code' : '1',
		'desc' : 'Pending Submit'
	},
	{
		'code' : '2',
		'desc' : 'Pending My Approval'
	},
	{
		'code' : '3',
		'desc' : 'Pending Approval'
	},
	{
		'code' : '4',
		'desc' : 'Pending Send'
	},
	{
		'code' : '5',
		'desc' : 'Rejected'
	},
	{
		'code' : '6',
		'desc' : 'On Hold'
	},
	{
		'code' : '7',
		'desc' : 'Sent To Bank'
	},
	{
		'code' : '8',
		'desc' : 'Deleted'
	},
	{
		'code' : '9',
		'desc' : 'Pending Repair'
	},
	{
		'code' : '13',
		'desc' : 'Debit Failed'
	},
	{
		'code' : '14',
		'desc' : 'Debited'
	},
	{
		'code' : '15',
		'desc' : 'Processed'
	},
	{
		'code' : '18',
		'desc' : 'Stopped'
	},
	{
		'code' : '19',
		'desc' : 'For Stop Auth'
	},
	{
		'code' : '28',
		'desc' : 'Debited'
	},
	{
		'code' : '43',
		'desc' : 'WareHoused'
	},
	{
		'code' : '75',
		'desc' : 'Reversal Pending Auth'
	},
	{
		'code' : '76',
		'desc' : 'Reversal Aproved'
	},
	{
		'code' : '77',
		'desc' : 'Reversal Rejected'
	}
];

var arrActionColumnStatus =
[
	[
		'0', 'Draft'
	],
	[
		'1', 'Pending Submit'
	],
	[
		'2', 'Pending My Approval'
	],
	[
		'3', 'Pending Approval'
	],
	[
		'4', 'Pending Send'
	],
	[
		'5', 'Rejected'
	],
	[
		'6', 'On Hold'
	],
	[
		'7', 'Sent To Bank'
	],
	[
		'8', 'Deleted'
	],
	[
		'9', 'Pending Repair'
	],
	[
		'13', 'Debit Failed'
	],
	[
		'14', 'Debited'
	],
	[
		'15', 'Processed'
	],
	[
		'18', 'Stopped'
	],
	[
		'19', 'For Stop Auth'
	],
	[
		'28', 'Debited'
	],
	[
		'43', 'WareHoused'
	],
	[
		'75', 'Reversal Pending Auth'
	],
	[
		'76', 'Reversal Aproved'
	],
	[
		'77', 'Reversal Rejected'
	],
	[
		'78', 'Reversal Pending My Auth'
	]
];

var notRendered = true;
function doChooseReport(sellerObj,clientIdObj,clientDescObj)
{
	document.getElementById( "chooseReportForm" ).style.visibility = "visible";
	document.getElementById( "selectedSeller" ).value = sellerObj;
	document.getElementById( "selectedClient" ).value = clientIdObj;
	document.getElementById( "selectedClientDesc" ).value = clientDescObj;
	var dlg = $( '#chooseReportForm' );
	dlg.dialog( {
		bgiframe : true,
		autoOpen : false,
		height : "auto",
		modal : true,
		resizable : false,
		width : 825,
		open: function() {
			$( '#chooseReport' ).show();
			if(notRendered) {
				objChooseReport = Ext.create( 'GCP.view.CustomReportCenterChooseView',
				{
					renderTo : 'chooseReportFormDiv'
				} );
				notRendered = false;
			}
			$("#tab_1").find('a').addClass('active');
			$("#tab_2").find('a').removeClass('active');
		}
	} ).dialog("widget").find(".ui-dialog-titlebar").hide();
	dlg.dialog( 'open' );
}

function addCustomReport()
{
	var form = document.createElement( 'FORM' );
	var strUrl = "addNewCustomReport.srvc"; 
	form.name = 'frmMain';
	form.id = 'frmMain';
	form.method = 'POST';
	form.appendChild(createFormField('INPUT', 'HIDDEN',	'clientCode', document.getElementById('selectedClient').value));
	form.appendChild(createFormField( 'INPUT', 'HIDDEN', 'reportCode', document.getElementById('reportCode').value ) );
	form.appendChild(createFormField( 'INPUT', 'HIDDEN', csrfTokenName, csrfTokenValue ) );
	form.action = strUrl;
	document.body.appendChild( form );
	form.submit();
	document.body.removeChild( form );
}
function editCustomReport(record)
{
	var form = document.createElement( 'FORM' );
	var strUrl = "editNewCustomReport.srvc"; 
	form.name = 'frmMain';
	form.id = 'frmMain';
	form.method = 'POST';
	form.appendChild(createFormField('INPUT', 'HIDDEN',	'clientCode', record.get( 'entityCode' )));
	form.appendChild(createFormField( 'INPUT', 'HIDDEN', 'reportCode', record.get( 'reportCode' ) ) );
	form.appendChild( createFormField( 'INPUT', 'HIDDEN', 'entitlementSeller', record.get( 'sellerId' ) ) );
	form.appendChild(createFormField( 'INPUT', 'HIDDEN', csrfTokenName, csrfTokenValue ) );
	form.action = strUrl;
	document.body.appendChild( form );
	form.submit();
	document.body.removeChild( form );
}
function createFormField(element, type, name, value )
{
	var inputField;
	inputField = document.createElement( element );
	inputField.type = type;
	inputField.name = name;
	inputField.value = value;
	return inputField;
}
function saveCustomReport(strUrl,draftFlag)
{
	// Get and Set repPrivate flag
	var frm = document.forms["frmMain"]; 	
	var elemPrv = document.getElementById("rPrivateFlg");
	var imagePrv =  elemPrv.getElementsByTagName("IMG")[0];
	if (imagePrv.src.indexOf("icon_unchecked.gif") == -1)
		document.getElementById("repPrivate").value = "N";
	else
		document.getElementById("repPrivate").value = "Y";
		
	frm.appendChild(createFormField( 'INPUT', 'HIDDEN', csrfTokenName, csrfTokenValue ) );
	// Set draft flag
	document.getElementById("draftFlag").value = draftFlag;
	var repName = document.getElementById("reportName").value;
	if(!(repName.trim() == ""))
	{
		setSelectedColData()
		setSelectedOrderData();
		enableFileldsToSave();
		frm.target ="";
		frm.action = strUrl;
		frm.method = 'POST';
		frm.submit();
	}
	else
	{
		alert("My Report Name is mandatory");
	}
}
function enableFileldsToSave()
{
	$( "#frmMain" ).find( 'input' ).addClass( "enabled" );
	$( "#frmMain" ).find( 'input' ).attr( "disabled", false );
	$( "#frmMain" ).find( 'select' ).addClass( "enabled" );
	$( "#frmMain" ).find( 'select' ).attr( "disabled", false );
}
function showBack(strUrl)
{
	var frm = document.forms["frmMain"]; 	
	frm.target ="";
	frm.action = strUrl;
	frm.method = 'POST';
	frm.submit();
}

function toggleParamLock(elem,fieldId,paramId,defValue,seekID,multiSeekId){
	var seekElem = document.getElementById(seekID);
	var multiSeekElem = document.getElementById(multiSeekId);
	var parameterElem = document.getElementById(paramId);
	var image =  elem.getElementsByTagName("IMG")[0];
	if (image.src.indexOf("unlocked.png") == -1)
	{
		image.src = "static/images/icons/unlocked.png";
		$("#"+fieldId).val("N");
		parameterElem.removeAttribute('disabled');
		if(seekElem != null){
			seekElem.removeAttribute('style');
		}
		if(multiSeekElem != null){
			multiSeekElem.removeAttribute('style');
		}
	}	
	else
	{
		image.src = "static/images/icons/locked.png";
		$("#"+fieldId).val("Y");
		document.getElementById(paramId).value = defValue;
		parameterElem.setAttribute('disabled','true');
		if(seekElem != null){
			seekElem.setAttribute('style','display:none;');
		}
		if(multiSeekElem != null){
			multiSeekElem.setAttribute('style','display:none;');
		}
	}
}

//Sort Order Function
function reloadSortState(){
	var currentOpts = $('#dataOrderBox2 option');
	for(cnt=0; cnt < 3; cnt++){
		var order = cnt+1;
		if(cnt < currentOpts.length)
			$('#btnSort'+order).css({ "display": 'block'});
		else
			$('#btnSort'+order).css({ "display": 'none'});
	}
	var cntr=1;
	$.each(currentOpts,function(i,value){
		var optValue = value.value;
		var arrSort = optValue.trim().split(" ");
		var strSortOrd = arrSort[arrSort.length-1];
		
		if(strSortOrd == "desc"){
			$('#btnSort'+cntr).css({ "background-image": "url('static/images/flexigrid/ddn.png')"});
		}else{
			$('#btnSort'+cntr).css({ "background-image": "url('static/images/flexigrid/uup.png')"});
		}	
		cntr++;	
	});
}
function orderColMoveUp() {
	ColMoveUp('dataOrderBox2');
	reloadSortState();
}
function orderColMoveTop() {
	ColMoveTop('dataOrderBox2');
	reloadSortState();
}	
function orderColMoveBottom() {
	ColMoveBottom('dataOrderBox2');
	reloadSortState();
}
//Moving up the selected items
function ColMoveUp(elemid) {
// get all selected items and loop through each
$("#"+elemid+" option:selected").each(function() {
 var listItem = $(this);
 var listItemPosition = $("#"+elemid+" option").index(listItem) + 1;

 // when the item is already at the topmost,
 // we do not need to move it up anymore
 if (listItemPosition == 1) return false;

 // the following will move the item up
 // this inserts the listItem over the element before it
 listItem.insertBefore(listItem.prev());
});
}

// Moving top the selected items
function ColMoveTop(elemid) {
// get all selected items and loop through each
$("#"+elemid+" option:selected").each(function() {
 var listItem = $(this);
 var listItemPosition = $("#"+elemid+" option").index(listItem) + 1;

 // when the item is already at the topmost,
 // we do not need to move it up anymore
 if (listItemPosition == 1) return false;

 // the following will move the item up
 // this inserts the listItem over the element before it
 var diff = listItemPosition-1;
  for(cntr=0; cntr<diff; cntr++){
	listItem.insertBefore(listItem.prev());
	}
});
}	

// Moving bottom the selected items
function ColMoveBottom(elemid) {
// get the number of items
// we will need this later to determine
// if the item is at the bottommost already
var itemsCount = $("#"+elemid+" option").length;

// for move down, we will need to start moving down items
//   from the bottom
// we get the selected items, reverse it then then loop each item
$($("#"+elemid+" option:selected").get().reverse()).each(function() {
  var listItem = $(this);
  var listItemPosition = $("#"+elemid+" option").index(listItem) + 1;

 // when the item is already at the bottommost,
 //we do not need to move it down anymore
  if (listItemPosition == itemsCount) return false;

  // the following will move down the item
  // this inserts the listItem below the element after it
  var diff = itemsCount - listItemPosition;
  for(cntr=0; cntr<diff; cntr++){
	listItem.insertAfter(listItem.next());
	}
});
}

// Moving down the selected items
function ColMoveDown(elemid) {
// get the number of items
// we will need this later to determine
// if the item is at the bottommost already
var itemsCount = $("#"+elemid+" option").length;

// for move down, we will need to start moving down items
//   from the bottom
// we get the selected items, reverse it then then loop each item
$($("#"+elemid+" option:selected").get().reverse()).each(function() {
  var listItem = $(this);
  var listItemPosition = $("#"+elemid+" option").index(listItem) + 1;

 // when the item is already at the bottommost,
 //we do not need to move it down anymore
  if (listItemPosition == itemsCount) return false;

  // the following will move down the item
  // this inserts the listItem below the element after it
  listItem.insertAfter(listItem.next());
});
}

function orderColMoveDown() {
	ColMoveDown('dataOrderBox2');
	reloadSortState();
}
function columnMoveUp() {
	ColMoveUp('columnBox2');
}
function columnMoveTop() {
	ColMoveTop('columnBox2');
}	
function columnMoveBottom() {
	ColMoveBottom('columnBox2');
}
function columnMoveDown() {
	ColMoveDown('columnBox2');
}
function toggleSortOrder(cntr){
	var currentOpts = $('#dataOrderBox2 option');
	$.each(currentOpts,function(i,value){
		if(cntr == i+1){
			var optValue = value.value;
			var arrSort = optValue.trim().split(" ");
			var strSortOrd = arrSort[arrSort.length-1];
			if(strSortOrd == "desc"){
				value.value = arrSort[0] + " asc";
			}else{
				value.value = arrSort[0] + " desc";
			}			
		}
	});
}
function setSelectedOrderData()
{
	unselectedOrd = $("#sortBy option");

	input = '{"lstBoxdata":[{';
	$.each(unselectedOrd,function(i,value){
		if(i==1){
			if(value.value != -1)
			input += '"'+value.value+'":"'+value.text+'"';
		}else{
			if(value.value != -1)
			input += ',"'+value.value+'":"'+value.text+'"';
		}					
	});
	input += "},{";
	output = "";
	
	var sortBy = document.getElementById("sortBy");
	var sortByOrder = 	$( 'input[name="sortByRadio"]:checked' ).val();
	if(sortBy.value != -1)
	input += '"'+sortBy.options[sortBy.selectedIndex].value +' '+ sortByOrder+'":"'+ sortBy.options[sortBy.selectedIndex].text +'"';
	
	var thenBy1 = document.getElementById("thenBy1");
	var thenBy1Order =  $( 'input[name="thenBy1Radio"]:checked' ).val();
	if(thenBy1.value != -1)
	input += ',"'+thenBy1.options[thenBy1.selectedIndex].value +' '+ thenBy1Order +'":"'+ thenBy1.options[thenBy1.selectedIndex].text +'"';
	
	var thenBy2 = document.getElementById("thenBy2");
	var thenBy2Order = $( 'input[name="thenBy2Radio"]:checked' ).val();
	if(thenBy2.value != -1)
	input += ',"'+thenBy2.options[thenBy2.selectedIndex].value +' '+ thenBy2Order +'":"'+ thenBy2.options[thenBy2.selectedIndex].text +'"';
	
	input += "}]}";
	
	document.getElementById("reorderlist").value = input;
}
function chkBlnk(fieldId){
	
	var currval = document.getElementById(fieldId.id).value; //   $('#'+fieldId.id).val();
	if(currval.trim() == "")
		document.getElementById(fieldId.id).value = getLabel("(ALL)","(ALL)");
}

//For sequencing
function getSyncData(repdata123){
	for(var cnt = 101; cnt<199;cnt++){
		repdata123 = repdata123.replace('"'+cnt.toString()+'"','"f'+cnt.toString()+'"');
	}
	return repdata123;
}
function setSelectedColData()
{
	selectedCols = $("#columnBox2 option");
	unselectedCols = $("#columnBox1 option");
	input = '{"lstBoxdata":[{';
	$.each(unselectedCols,function(i,value){
		if(i==0){
			input += '"'+value.value+'":"'+value.text+'"';
		}else{
			input += ',"'+value.value+'":"'+value.text+'"';
		}					
	});
	input += "},{";
	output = "";
	output = "{";
	$.each(selectedCols,function(i,value){
		if(i==0){
			output += '"'+value.value+'" : "'+value.text+'"';
			input += '"'+value.value+'":"'+value.text+'"';
		}else{
			output += ',"'+value.value+'" : "'+value.text+'"';
			input += ',"'+value.value+'":"'+value.text+'"';
		}
	});
	input += "}]}";
	output += "}";
	document.getElementById("selectCol").value = output;
	document.getElementById("recollist").value = input;
}
