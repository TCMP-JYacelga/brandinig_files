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
	"colHeader" : getLabel("Client",
	"hidden" : false
	},
	*/
	{
		"colId" : "reportName",
		"colHeader" : getLabel("reportName","Report Name"),
		"hidden" : false,
		"colSequence":1
	},
	{
		"colId" : "reportDesc",
		"colHeader" : getLabel("reportDesc","Report Description"),
		"hidden" : false,
		"colSequence":2
	},
	{
		"colId" : "moduleName",
		"colHeader" : getLabel("moduleName","Module"),
		"hidden" : false,
		"colSequence":3
	},
	{
		"colId" : "securityProfile",
		"colHeader" : getLabel("securityProfile","Security Config"),
		"hidden" : false,
		"colSequence":4
	},
	{
		"colId" : "createdBy",
		"colHeader" : getLabel("createdBy","Created By"),
		"hidden" : false,
		"colSequence":5
	},
	{
		"colId" : "requestStateDesc",
		"colHeader" : getLabel("requestStateDesc","Status"),
		"hidden" : false,
		"sortable" : false
	}
];

var REPORT_GENERIC_COLUMN_MODELADM =
	[
		{
			"colId" : "reportName",
			"colHeader" : getLabel("reportName","Report Name"),
			"hidden" : false,
			"colSequence":1
		},
		{
			"colId" : "reportDesc",
			"colHeader" : getLabel("reportDesc","Report Description"),
			"hidden" : false,
			"colSequence":2
		},
		{
			"colId" : "moduleName",
			"colHeader" : getLabel("moduleName","Module"),
			"hidden" : false,
			"colSequence":3
		},
		{
			"colId" : "createdBy",
			"colHeader" : getLabel("createdBy","Created By"),
			"hidden" : false,
			"colSequence":5
		},
		{
			"colId" : "requestStateDesc",
			"colHeader" : getLabel("requestStateDesc","Status"),
			"hidden" : false,
			"sortable" : false
		}
	];
var objGridWidthMap =
{
	"reportName" : 120,
	"reportDesc" : 120,
	"moduleName" : 170,
	"securityProfile" : 150,
	"createdBy" : 130,
	"reportStatus" : 100
};

var arrSortByPaymentFields =
[
	{
		"colId" : "recieverName",
		"colDesc" : getLabel("recieverName","Receiver Name")
	},
	{
		"colId" : "amount",
		"colDesc" : getLabel("amount","Amount")
	},
	{
		"colId" : "count",
		"colDesc" : getLabel("count","Count")
	},
	{
		"colId" : "actionStatus",
		"colDesc" : getLabel("actionStatus","Status")
	},
	{
		"colId" : "productTypeDesc",
		"colDesc" : getLabel("productTypeDesc","My Product")
	},
	{
		"colId" : "activationDate",
		"colDesc" : getLabel("activationDate","Effective Date")
	},
	{
		"colId" : "sendingAccount",
		"colDesc" : getLabel("sendingAccount","Sending Account")
	},
	{
		"colId" : "templateName",
		"colDesc" : getLabel("templateName","Template Name")
	},
	{
		"colId" : "recieverAccount",
		"colDesc" : getLabel("recieverAccount","Receiving Account + CCY")
	},
	{
		"colId" : "entryDate",
		"colDesc" : getLabel("entryDate","Entry Date")
	},
	{
		"colId" : "valueDate",
		"colDesc" : getLabel("valueDate","Process Date")
	},
	{
		"colId" : "client",
		"colDesc" : getLabel("client","Client Description")
	},
	{
		"colId" : "bankProduct",
		"colDesc" : getLabel("bankProduct","Bank Product")
	},
	{
		"colId" : "phdnumber",
		"colDesc" : getLabel("phdnumber","Tracking No.")
	},
	{
		"colId" : "clientReference",
		"colDesc" : getLabel("clientReference","Payment Reference")
	},
	{
		"colId" : "currency",
		"colDesc" : getLabel("currency","Sending Account + CCY")
	},
	{
		"colId" : "creditAmount",
		"colDesc" : getLabel("creditAmount","Credit Amount")
	},
	{
		"colId" : "debitAmount",
		"colDesc" : getLabel("debitAmount","Debit Amount")
	},
	{
		"colId" : "txnType",
		"colDesc" : getLabel("txnType","Type of Transaction")
	},
	{
		"colId" : "maker",
		"colDesc" : getLabel("maker","Entry User")
	},
	{
		"colId" : "hostMessage",
		"colDesc" : getLabel("hostMessage","Host Message")
	}
];
var arrPaymentStatus =
[
	{
		'code' : '0',
		'desc' : getLabel('drafeStatus','Draft')
	},
	{
		'code' : '1',
		'desc' : getLabel('pendingSubmitStatus','Pending Submit')
	},
	{
		'code' : '2',
		'desc' : getLabel('pendingMApprovalStatus','Pending My Approval')
	},
	{
		'code' : '3',
		'desc' : getLabel('PendingApprovalStatus','Pending Approval')
	},
	{
		'code' : '4',
		'desc' : getLabel('pendingSendStatus','Pending Send')
	},
	{
		'code' : '5',
		'desc' : getLabel('rejectedStatus','Rejected')
	},
	{
		'code' : '6',
		'desc' : getLabel('onHoldStatus','On Hold')
	},
	{
		'code' : '7',
		'desc' : getLabel('sentToBnkStatus','Sent To Bank')
	},
	{
		'code' : '8',
		'desc' : getLabel('deletedStatus','Deleted')
	},
	{
		'code' : '9',
		'desc' : getLabel('PendingrepairStatus','Pending Repair')
	},
	{
		'code' : '13',
		'desc' : getLabel('debitFailedStatus','Debit Failed')
	},
	{
		'code' : '14',
		'desc' : getLabel('debitedStatus','Debited')
	},
	{
		'code' : '15',
		'desc' : getLabel('processedStatus','Processed')
	},
	{
		'code' : '18',
		'desc' : getLabel('stoppedStatus','Stopped')
	},
	{
		'code' : '19',
		'desc' : getLabel('ForStopAuthStatus','For Stop Auth')
	},
	{
		'code' : '28',
		'desc' : getLabel('debitedStatus','Debited')
	},
	{
		'code' : '43',
		'desc' : getLabel('wareHousedStatus','WareHoused')
	},
	{
		'code' : '75',
		'desc' : getLabel('ReversalPendingAauth','Reversal Pending Auth')
	},
	{
		'code' : '76',
		'desc' : getLabel('reversalApproved','Reversal Aproved')
	},
	{
		'code' : '77',
		'desc' : getLabel('reversalRejected','Reversal Rejected')
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
/*
$(function() {
    $('#clientDescAutoCompleter').autocomplete({
        minLength: 1,
        source: function(request, response) {
            $.ajax({
                url: 'services/userseek/userclients.json',
                data: {
                    $autofilter: request.term
                },
                success: function(responseText) {
                    var responseData = responseText.d.preferences;
                    response($.map(responseData, function(item) {
                        return {
                            value: item.CODE,
                            label: item.DESCR
                        }
                    }));
                }
            });
        },
        select: function(event, ui) {
        	selectedClientDesc = ui.item.label;
            selectedClient = ui.item.value;
        },
        close: function(event, ui) {
            $("#clientDescAutoCompleter").val(selectedClientDesc);
            handleClientComboChange();
        }
    }).data("autocomplete")._renderItem = function(ul, item) {
        var inner_html = '<a><ol class="t7-autocompleter"><ul>' + item.label + '</ul></ol></a>';
        return $("<li></li>").data("item.autocomplete", item)
            .append(inner_html).appendTo(ul);
    };
   
});*/
function handleClientComboChange() {
    
}
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
		//height : "auto",
		title: getLabel('newReport','Create New Custom Report'),
		maxHeight: 550,
		minHeight:156,
		modal : true,
		resizable : false,
		width : 900,
		draggable: false,
		open: function() {
		//	$( '#chooseReport' ).show();
		$('#tab_1').addClass("ft-status-bar-li-active");	
		paintChooseCustomReportTypeLeftPanel(sellerObj,clientIdObj);
		if(entityType == 0)
		{
			// in case of Admin User hide Client Auto- completer for Custom Report
			$('#clientAutoCompleterField').addClass('hidden');
			if(moduleCode != null && moduleCode != '' && undefined != moduleCode)
				populateReportsBasedOnCategoryInCenterPanel(moduleCode);
		}
		else
		{
			getClientsList();
		}
		dlg.dialog('option','position','center');
		autoFocusOnFirstElement(null, 'chooseReportFormDiv', true);
		
		},
		close : function(){
			$('#chooseReportCategoryFromSidePanel').empty();
		}
	} );
	dlg.dialog( 'open' );
}
function getClientsList(){
	Ext.Ajax.request({
		url : 'services/userseek/userclients.json',
		method : 'POST',
		async : false,
		success : function(response) {
			var responseData = Ext.decode(response.responseText);
			var data = responseData.d.preferences;
			$('#clientCode').empty();
			addDataInMultiSelect('clientCode',data);
			$('#clientCode').change();
			makeNiceSelect('clientCode',true);
		},
		failure : function() {
		}
	});
	
}
function handleClientChange(){
	$('#selectedClient').val($('#clientCode').val());
	console.log("on change moduleCode is:- "+moduleCode);
	if(moduleCode)
		populateReportsBasedOnCategoryInCenterPanel(moduleCode);
}
function addDataInMultiSelect(elementId,data)
{
	var elementId = "#"+elementId;
	for(index=0;index<data.length;index++)
	{
		$(elementId).append($("<option />").val(data[index].CODE)
				.text(data[index].DESCR));
	}
}

function paintChooseCustomReportTypeLeftPanel(sellerObj,clientIdObj){
	var strUrl = "services/getReportModulesList.json";
	hideErrorPanel('#customReportInfoError');
    $.ajax({
        url: strUrl,
		type: 'POST',
		async : false,
		data:{
			$client:clientIdObj,
			$seller:sellerObj
		},
        success: function(data) {
            populateReportModuleInLeftPanel(data);	
        	if(entityType == 0)
    		{
    			if(moduleCode != null && moduleCode != '' && undefined != moduleCode)
    				fetchReportList(moduleCode);
    		}
        }
    });
}
function populateReportModuleInLeftPanel(response){
	if (!jQuery.isEmptyObject(response)&&!isEmpty(response[0])){
		var data=response[0].groups;
		data.sort(function(a, b){
					    if(a.groupDescription < b.groupDescription) return -1;
					    if(a.groupDescription > b.groupDescription) return 1;
					    return 0;
			});
	    var length = data.length;
		var slectedCls = 'selected-cb-background ux_margin2 wrap-word';
		var deSelectedCls = 'ux_margin2 ux_unselected wrap-word';
	    var list = $("#chooseReportCategoryFromSidePanel");
	    var checkboxArray = [];
	    
	    for (var i = 0; i < data.length; i++) {
	    	if(i === 0){
	    		moduleCode=data[0].groupCode;
	    		console.log("setting moduleCode as:- "+moduleCode);
	    	}
	    	checkboxArray.push({
				code : data[i].groupCode,
				boxLabel : data[i].groupDescription,
				checked : false,
				cls : (i === 0 )
					? slectedCls
					: deSelectedCls,
				style : 'word-break: break-word !important',
				readOnly : false,
				width : '100%',
				tabIndex:'1',
				listeners : {
					render : function(c) {
					}
				},
				handler : function(btn, opts) {
					moduleCode=this.code;
					console.log("setting moduleCode as:- "+moduleCode);
					click : tabAnchorClickInReportModule(this, this.checked, this.code);
				}
			});
	    }
	    
  
	    

		var widgetListView = Ext.create('Ext.panel.Panel', {
			itemId : 'widgetCategoryPanel',
			cls  : 'panel-seperator',
			layout : 'hbox',
			renderTo : 'chooseReportCategoryFromSidePanel',
			//width : '100%',
			items : [
			]
		});
		
		widgetListView.add({
		xtype : 'checkboxgroup',
		columns : 1,
		width : '100%',
		items : checkboxArray
	});
	
		
		var checkboxgroup = widgetListView.down('checkboxgroup');
		console.log(checkboxgroup);
		
		
		/*{
			xtype : 'checkboxgroup',
			columns : 1,
			width : '100%',
			items : checkboxArray
		}*/
		
	}else{
		if(jQuery.isEmptyObject(data)){
			var errorMsg=getLabel('noClientDataError','No Data Available for the moment.');
			//TODO display error
		}
	}   
}
function tabAnchorClickInReportModule(cb,checked,code){
    var me = this;
	if (checked) {
		cb.removeCls('ux_unselected');
		cb.addCls('selected-cb-background');
		cb.addCls('.ux_unselected');
		cb.setReadOnly(true);
		var group = cb.findParentByType('checkboxgroup');
		if (group) {
			group.items.each(function(it) {
						if (it.getName() != cb.getName()) {
							it.setValue(0);
							it.removeCls('selected-cb-background');
							it.addCls('ux_unselected');
							it.setReadOnly(false);
						}
					});
		}
		moduleCode=code;
		console.log("setting moduleCode as:- "+moduleCode);
		populateReportsBasedOnCategoryInCenterPanel(code);
	}
}
function populateReportsBasedOnCategoryInCenterPanel(code){
	var dataArray = fetchReportList(code);
    var centreDiv = $("#chooseReportTypeFromSidePanel" );
    centreDiv.empty();
    $('#chooseReportTypeFromSidePanel').css({
	      "height": "auto",
	      "overflow-y": "auto"
	    });
    if(dataArray){
		dataArray.sort(function(a, b){
					    if(a.REPDESCRIPTION < b.REPDESCRIPTION) return -1;
					    if(a.REPDESCRIPTION > b.REPDESCRIPTION) return 1;
					    return 0;
		});
		if(dataArray.length>0)
			$('#chooseReportTypeFromSidePanel').css({
			      "height": "275px",
			      "overflow-y": "auto"
			});
        var rowDiv;
        var childCountPerRow = 0;
		var isMessageTypePresent=false;
        for (var i = 0; i < dataArray.length; i++) {
            if (childCountPerRow % 2 == 0) {
                rowDiv = document.createElement("div");
                rowDiv.setAttribute('class', 'row form-group');
                centreDiv.append(rowDiv);
            }
			var ctrl = $('<input/>').attr({
				type: 'radio',
				name:'reportCategory',
			//	name: code,
			    tabIndex:'1',
				reportCode: dataArray[i].REPREPORT,
				onClick: "storeSelectedReportCode($(this))"
			});
			var sReportDesc = dataArray[i].REPDESCRIPTION;
			var colDiv = $('<div>').attr({'class': 'col-sm-6'}).appendTo(rowDiv);
        	$('<label>').attr({'title':sReportDesc, 'class': 'radio-inline custom-truncate-text'}).append(ctrl).append(sReportDesc).appendTo(colDiv);
	        if(i==0){
	        	ctrl.attr('checked',true);
	        	storeSelectedReportCode(ctrl);
	        }
			childCountPerRow++;
        }
    }
}
function fetchReportList(code){
	var strUrl = 'services/getReportList.json';
	var responseData = null;
	var responseData = null,objParam={};
    $.ajax({
        url: strUrl,
		type:'POST',
		async:false,
		data:{
			csrfTokenName:csrfTokenValue,
			$client:document.getElementById( "selectedClient" ).value,
			$seller:document.getElementById( "selectedSeller" ).value,
			$module:code
			},
        success: function(data) {
            responseData = data;
        }
    });
    for(var i=0;i < responseData.length; i++)
	{
    	responseData[i].REPDESCRIPTION = getReportDescLabel(responseData[i].REPREPORT,responseData[i].REPDESCRIPTION);
	}
    return responseData;
}
function storeSelectedReportCode(selectedRadio){
	document.getElementById('reportCode').value = selectedRadio.attr('reportCode');
}
function addCustomReport()
{
	var form = document.createElement( 'FORM' );
	var strUrl = "addNewCustomReport.srvc"; 
	form.name = 'frmMain';
	form.id = 'frmMain';
	var reportCode = document.getElementById('reportCode').value;
	form.method = 'POST';
	form.appendChild(createFormField('INPUT', 'HIDDEN',	'clientCode', document.getElementById('selectedClient').value));
	form.appendChild(createFormField( 'INPUT', 'HIDDEN', 'reportCode', reportCode ) );
	form.appendChild(createFormField( 'INPUT', 'HIDDEN', csrfTokenName, csrfTokenValue ) );
	form.action = strUrl;
	if(isEmpty(reportCode)){
		errorMsg = getLabel('selectreport','Please Select the Report');
		paintError('#customReportInfoError','#customReportInfoErrorMsg',errorMsg);
	}else{
		document.body.appendChild( form );
		form.submit();
		document.body.removeChild( form );
	}
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
	form.appendChild( createFormField( 'INPUT', 'HIDDEN', 'viewState', record.get( 'identifier' ) ) );
	form.appendChild(createFormField( 'INPUT', 'HIDDEN', csrfTokenName, csrfTokenValue ) );
	form.action = strUrl;
	document.body.appendChild( form );
	form.submit();
	document.body.removeChild( form );
}
function viewCustomReport(record)
{
	var form = document.createElement( 'FORM' );
	var strUrl = "viewNewCustomReport.srvc"; 
	form.name = 'frmMain';
	form.id = 'frmMain';
	form.method = 'POST';
	form.appendChild(createFormField('INPUT', 'HIDDEN',	'clientCode', record.get( 'entityCode' )));
	form.appendChild(createFormField( 'INPUT', 'HIDDEN', 'reportCode', record.get( 'reportCode' ) ) );
	form.appendChild( createFormField( 'INPUT', 'HIDDEN', 'entitlementSeller', record.get( 'sellerId' ) ) );
	form.appendChild( createFormField( 'INPUT', 'HIDDEN', 'viewState', record.get( 'identifier' ) ) );
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
	// Set draft flag
	document.getElementById("draftFlag").value = draftFlag;
	var repName = document.getElementById("reportName").value;
	setSelectedColData()
	var sortorderFlag  = setSelectedOrderData();
	if(sortorderFlag == false)
		return false;	
	enableFileldsToSave();
	$('.jq-multiselect').each(function(i , element){
		if( $('#'+element.id).length > 0 )
		{
			multiValue = '';
			var elementName = "reportCenterParameterBean";
			index = element.id.substr(elementName.length, element.id.length);
			document.getElementById(elementName+"["+index+"].value").value = '';
			var checkedItems = $("#"+element.id).multiselect("getChecked");
			var allItems = $("#"+element.id).multiselect("getAllItems");
			if( allItems.length != checkedItems.length )
			{
				$("#"+element.id).multiselect("getChecked").map(function()
				{
					if(multiValue == '') multiValue = this.value;
					else
						multiValue = multiValue+","+ this.value;
				});
				document.getElementById(elementName+"["+index+"].value").value = multiValue;
			}
			else
			{
				document.getElementById(elementName+"["+index+"].value").value = "(ALL)";
			}
		}
	});
	$('form').find('.amountBox').each(function(){
       var self=$(this);
       var selfValue = self.autoNumeric('get');
       self.val(selfValue);
	});
	frm.target ="";
	frm.action = strUrl;
	frm.method = 'POST';
	frm.submit();
	
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

function toggleParamLock(elem,fieldId,paramId,defValue,seekID,multiSeekId,dataType,cntrlIndex,paramElementDescId){
	cntrlIndex = parseInt(cntrlIndex,10);
	var seekElem = document.getElementById(seekID);
	var multiSeekElem = document.getElementById(multiSeekId);
	var parameterElem = document.getElementById(paramId);
	var span =  elem.getElementsByTagName('SPAN')[0];
	var paramDescElement = paramElementDescId;
	if (span.className == 'fa fa-lock')
	{
		span.className = 'fa fa-unlock';
		$('#'+fieldId).val('N');
		parameterElem.removeAttribute('disabled');
		if(null != paramDescElement && undefined != paramDescElement){
			paramDescElement = paramDescElement.replace('.','\\.');
			$('#'+paramDescElement).removeAttr('disabled');
		}
        $('#'+fieldId).parent().siblings().find('.form-control').each( function ( index ) {
            this.removeAttribute('disabled');
            $(this).removeAttr('disabled');
        });
        $('#'+fieldId).parent().find('input, select').each( function ( index ) {
            if($(this).hasClass('jq-multiselect'))
            {
                $('#'+paramId).multiselect('enable');
            }
            else if($(this).hasClass('jq-nice-select'))
            {
                $(this).niceSelect('update');
            }
            else
            {
                this.removeAttribute('disabled');
                $(this).removeAttr('disabled');
                $(this).removeClass('disabled');
            }
        });
		if(seekElem != null){
			seekElem.removeAttribute('style');
		}
		if(multiSeekElem != null){
			multiSeekElem.removeAttribute('style');
		}
		if(null != dataType)
		{
			if('DATE' == dataType)
			{
				$('#reportCenterParameterBean'+(cntrlIndex+1)+'\\.value').removeAttr('disabled');
				$('#reportCenterParameterBean'+(cntrlIndex+2)+'\\.value').removeAttr('disabled');
				$('#iconreportCenterParameterBean'+(cntrlIndex+1)+'\\.value').removeClass('disabled');
				$('#iconreportCenterParameterBean'+(cntrlIndex+2)+'\\.value').removeClass('disabled');
			}
			if( 'TEXT' == dataType || 'DECIMAL' == dataType || 'NUMBER' == dataType){
				$('#reportCenterParameterBean'+(cntrlIndex+1)+'\\.value').removeAttr('disabled');
				$('#reportCenterParameterBean'+(cntrlIndex+2)+'\\.value').removeAttr('disabled');
			}
		}
	}
	else
	{
        span.className = 'fa fa-lock';
        $('#'+fieldId).val('Y');
        document.getElementById(paramId).value = defValue;
        parameterElem.removeAttribute('readonly');
        parameterElem.setAttribute('disabled',true);
        if(null != paramDescElement && undefined != paramDescElement){
            paramDescElement = paramDescElement.replace('.','\\.');
            $('#'+paramDescElement).attr('disabled','disabled');
        }
        $('#'+fieldId).parent().siblings().find('.form-control').each( function ( index ) {
            this.setAttribute('disabled', 'true');
        });
        $('#'+fieldId).parent().find('input, select').each( function ( index ) {
            if($(this).hasClass('jq-multiselect'))
            {
                $('#'+paramId).multiselect('disable');
            }
            else if($(this).hasClass('jq-nice-select'))
            {
                $(this).niceSelect('update');
            }
            else
            {
                this.setAttribute('disabled', true);
                $(this).addClass('disabled');
                $(this).attr('disabled', 'disabled');
            }
        });
        if(seekElem != null){
            seekElem.setAttribute('style','display:none !important');
        }
        if(multiSeekElem != null){
            multiSeekElem.setAttribute('style','display:none !important');
        }
        if(null != dataType)
        {
            if('DATE' == dataType)
            {
                $('#reportCenterParameterBean'+(cntrlIndex+1)+'\\.value').attr('disabled','disabled');
                $('#reportCenterParameterBean'+(cntrlIndex+2)+'\\.value').attr('disabled','disabled');
                $('#iconreportCenterParameterBean'+(cntrlIndex+1)+'\\.value').addClass('disabled');
                $('#iconreportCenterParameterBean'+(cntrlIndex+2)+'\\.value').addClass('disabled');
            }
            if('TEXT' == dataType || 'DECIMAL' == dataType || 'NUMBER' == dataType){
                $('#reportCenterParameterBean'+(cntrlIndex+1)+'\\.value').attr('disabled','disabled');
                $('#reportCenterParameterBean'+(cntrlIndex+2)+'\\.value').attr('disabled','disabled');
            }
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
	if(null != sortBy){
		var sortByOrder = 	$( 'input[name="sortByRadio"]:checked' ).val();
		if(sortBy.value != -1)
		input += '"'+sortBy.options[sortBy.selectedIndex].value +' '+ sortByOrder+'":"'+ sortBy.options[sortBy.selectedIndex].text +'"';
		
		var thenBy1 = document.getElementById("thenBy1");
		var thenBy1Order =  $( 'input[name="thenBy1Radio"]:checked' ).val();
		if(thenBy1.value != -1)
			if(sortBy.value != -1)
			      input += ',"'+thenBy1.options[thenBy1.selectedIndex].value +' '+ thenBy1Order +'":"'+ thenBy1.options[thenBy1.selectedIndex].text +'"';
				else
				{
					$( '#errorDiv').empty();
					$( '#errorDiv').append("<ul><li>Report Sort Order is Invalid.</ul></li>");
					$( '#errorDiv').removeClass( 'ui-helper-hidden' );
					 $(window).scrollTop(0);
					return false;
				}			
		var thenBy2 = document.getElementById("thenBy2");
		var thenBy2Order = $( 'input[name="thenBy2Radio"]:checked' ).val();
		if(thenBy2.value != -1)
			if(thenBy1.value != -1)
			      input += ',"'+thenBy2.options[thenBy2.selectedIndex].value +' '+ thenBy2Order +'":"'+ thenBy2.options[thenBy2.selectedIndex].text +'"';
				else
				{
					$( '#errorDiv').empty();
					$( '#errorDiv').append("<ul><li>Report Sort Order is Invalid.</ul></li>");
					$( '#errorDiv').removeClass( 'ui-helper-hidden' );	
					 $(window).scrollTop(0);
				   return false;

				}
		
		input += "}]}";
	}else
		input += "}]}";
	document.getElementById("reorderlist").value = input;
	return true;
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
function hideErrorPanel(errorDivId){
	if($(errorDivId).is(':visible')){
		$(errorDivId).addClass('ui-helper-hidden');
	}
}
function paintError(errorDiv,errorMsgDiv,errorMsg){
	if(!$(errorDiv).is(':visible')){
		$(errorDiv).removeClass('ui-helper-hidden');
	}
	$(errorMsgDiv).text(errorMsg);
}
var arrCustomStatus = 	[
	  {
		"code": "0",
		"desc": "New"
	  },
	  {
		"code": "12",
		"desc": "New Submitted"
     },
	  {
		"code": "3",
		"desc": "Approved"
	  },
	  {
		"code": "1",
		"desc": "Modified"
	  },	
	   {
		"code": "14",
		"desc": "Modified Submitted"
     },  
	  {
		"code": "4",
		"desc": "Enable Request"
	  },
	  {
		"code": "5",
		"desc": "Suspend Request"
	  },
	  {
		"code": "11",
		"desc": "Suspended"
	  },
	  {
		"code": "7",
		"desc": "New Rejected"
	  },
	  {
		"code": "8",
		"desc": "Modified Rejected"
	  },	  
	  {
		"code": "9",
		"desc": "Suspend Request Rejected"
	  },
	  {
		"code": "10",
		"desc": "Enable Request Rejected"
	  },
	  {
		"code": "13",
		"desc": "Pending My Approval"
	  }
	];