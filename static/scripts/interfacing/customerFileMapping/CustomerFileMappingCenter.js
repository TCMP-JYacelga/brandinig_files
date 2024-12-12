/**
 * Sample Column Model, User should have to structured the column model in this
 * way
 */
var actionsForWidget = [ 'Submit', 'Discard', 'Enable', 'Disable' ];

var CLIENT_INTERFACE_GENERIC_COLUMN_MODEL = [

{
	"colId" : "interfaceName",
	"colHeader" : getLabel('interfaceName', 'Interface Name'),
	"colDesc" : getLabel('interfaceName', 'Interface Name'),
	"locked" : false,
	"hidden" : false,
	"hideable" : true,
	"colSequence" : 1
},{
	"colId" : "securityProfileId",
	"colHeader" : getLabel('securityProfile', 'Security Profile'),
	"colDesc" : getLabel('securityProfile', 'Security Profile'),
	"locked" : false,
	"hidden" : false,
	"hideable" : true,
	"colSequence" : 5
}, {
	"colId" : "interfaceCateory",
	"colHeader" : getLabel('category', 'Category'),
	"colDesc" : getLabel('category', 'Category'),
	"locked" : false,
	"hidden" : false,
	"hideable" : true,
	"colSequence" : 6
}, {
	"colId" : "interfaceModule",
	"colHeader" : getLabel('moduleName', 'Module Name'),
	"colDesc" : getLabel('moduleName', 'Module Name'),
	"locked" : false,
	"hidden" : false,
	"hideable" : true,
	"colSequence" : 7
}, {
	"colId" : "requestStateDesc",
	"colHeader" : getLabel('status', 'Status'),
	"colDesc" : getLabel('status', 'Status'),
	"locked" : false,
	"hidden" : false,
	"hideable" : true,
	"colSequence" : 8
},
{
	"colId" : "clientDesc",
	"colHeader" : getLabel('clientDesc', 'Company Name'),
	"colDesc" : getLabel('clientDesc', 'Company Name'),
	"locked" : false,
	"hidden" : false,
	"hideable" : true,
	"colSequence" : 9
} ];

var objClientInterfaceGridWidthMap = {
	"interfaceName" : 160,
	"interfaceType" : 100,
	"interfaceFlavor" : 90,
	"parentInterfaceName" : 160,
	"securityProfileId" : 180,
	"interfaceCateory" : 140,
	"interfaceModule" : 140,
	"requestStateDesc" : 100,
	"clientDesc" :200
};

var arrActionColumnStatus = [ [ '0', 'Draft' ], [ '1', 'Pending Submit' ],
		[ '2', 'Pending My Approval' ], [ '3', 'Pending Approval' ],
		[ '4', 'Pending Send' ], [ '5', 'Rejected' ], [ '6', 'On Hold' ],
		[ '7', 'Sent To Bank' ], [ '8', 'Deleted' ], [ '9', 'Pending Repair' ],
		[ '13', 'Debit Failed' ], [ '14', 'Debited' ], [ '15', 'Processed' ],
		[ '18', 'Stopped' ], [ '19', 'For Stop Auth' ], [ '28', 'Debited' ],
		[ '43', 'WareHoused' ], [ '75', 'Reversal Pending Auth' ],
		[ '76', 'Reversal Aproved' ], [ '77', 'Reversal Rejected' ],
		[ '78', 'Reversal Pending My Auth' ] ];

function doChooseInterface(sellerObj, clientIdObj, clientDescObj) {
	document.getElementById("chooseInterfaceForm").style.visibility = "visible";
	document.getElementById("selectedSeller").value = sellerObj;
	document.getElementById("selectedClient").value = clientIdObj;
	document.getElementById("selectedClientDesc").value = clientDescObj;
	var dlg = $('#chooseInterfaceForm');
	dlg.dialog({
		bgiframe : true,
		autoOpen : false,
		title: getLabel('newInterface','Create Customer Interface > New Customer File Mapping'),
		// height : "auto",
		maxHeight : 550,
		minHeight : 156,
		modal : true,
		resizable : false,
		width : 735,
		draggable : false,
		open : function() {
			// $( '#chooseInterface' ).show();
			$('#tab_1').addClass("ft-status-bar-li-active");
			paintChooseCustomInterfaceTypeLeftPanel(sellerObj, clientIdObj);
			dlg.dialog('option','position','center'); 
		},
		close : function(){
			$('#chooseInterfaceCategoryFromSidePanel').empty();
		}
	});
	dlg.dialog('open');
	$(document).on("ajaxStop", function (e) {
      dlg.dialog("option", "position", "center");
});
}

function paintChooseCustomInterfaceTypeLeftPanel(sellerObj, clientIdObj) {
	var strUrl = "services/getInterfaceModulesList.json";
	hideErrorPanel('#customInterfaceInfoError');
	$.ajax({
		url : strUrl,
		type : 'POST',
		async : false,
		data : {
			$client : clientIdObj,
			$seller : sellerObj
		},
		success : function(data) {
			populateInterfaceModuleInLeftPanel(data);
		}
	});
}
function populateInterfaceModuleInLeftPanel(response) {
	if (!jQuery.isEmptyObject(response) && !isEmpty(response[0])) {
		var data = response[0].groups;
		data.sort(function(a, b) {
			if (a.groupDescription < b.groupDescription)
				return -1;
			if (a.groupDescription > b.groupDescription)
				return 1;
			return 0;
		});
		var length = data.length;
		var slectedCls = 'selected-cb-background ux_margin2';
		var deSelectedCls = 'ux_margin2 ux_unselected';
		var list = $("#chooseInterfaceCategoryFromSidePanel");
		var anchor;
		var checkboxArray = [];
		list.empty();
		var tabDiv = document.createElement("div");
		tabDiv.setAttribute('class', 'ui-vertical-tab');
		tabDiv.setAttribute('id', 'reportCategoryTab');
		var ul = document.createElement('ul');
		tabDiv.appendChild(ul);
		list.append(tabDiv);
		for ( var i = 0; i < data.length; i++) {
		
			checkboxArray.push({
				code : data[i].groupCode,
				boxLabel : data[i].groupDescription,
				checked : false,
				cls : (i === 0 )
					? slectedCls
					: deSelectedCls,
				readOnly : false,
				width : 165,
				listeners : {
					render : function(c) {
					}
				},
				handler : function(btn, opts) {
					click : tabAnchorClickInInterfaceModule(this, this.checked, this.code);
				}
			});
		}
		
		
		var widgetListView = Ext.create('Ext.panel.Panel', {
			itemId : 'widgetCategoryPanel',
			cls  : 'panel-seperator',
			layout : 'hbox',
			renderTo : 'chooseInterfaceCategoryFromSidePanel',
			width : '100%',
			items : [
			]
		});
		
		widgetListView.add({
		xtype : 'checkboxgroup',
		columns : 1,
		width : '100%',
		items : checkboxArray,
		listeners : {
				"afterrender" : function(){
					if(null != this.items && null != this.items.items)
						tabAnchorClickInInterfaceModule(this.items.items[0], true, 'ACH');
				}
		}
	});
	
	}else{
		if(jQuery.isEmptyObject(data)){
			var errorMsg=getLabel('noClientDataError','No Data Available for the moment.');
			//TODO display error
		}
	}   
}
function tabAnchorClickInInterfaceModule(cb,checked,code) {
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
		populateInterfacesBasedOnCategoryInCenterPanel(code);
		autoFocusOnFirstElement(null, 'chooseInterface', true);
	}
}
function populateInterfacesBasedOnCategoryInCenterPanel(code) {
	var dataArray = fetchInterfaceList(code);
	var centreDiv = $("#chooseInterfaceTypeFromSidePanel");
	centreDiv.empty();
	if (dataArray) {
		dataArray.sort(function(a, b) {
			if (a.MODEL_NAME < b.MODEL_NAME)
				return -1;
			if (a.MODEL_NAME > b.MODEL_NAME)
				return 1;
			return 0;
		});

		var rowDiv;
		var childCountPerRow = 0;
		var isMessageTypePresent = false;
		for ( var i = 0; i < dataArray.length; i++) {
			if (childCountPerRow % 2 == 0) {
				rowDiv = document.createElement("div");
				rowDiv.setAttribute('class', 'row form-group');
				centreDiv.append(rowDiv);
			}
			var ctrl = $('<input/>').attr({
				type : 'radio',
				name : 'reportCategory',
				tabindex: '1',
				category : code,
				interfaceCode : dataArray[i].MODEL_NAME,
				subCategory : dataArray[i].INTERFACE_SUB_CATEGORY,
				catProductTypeId : dataArray[i].INSTRUMENT_CODE,
				onClick : "storeSelectedInterfaceCode($(this))"
			});
			var colDiv = $('<div>').attr({
				'class' : 'col-sm-6'
			}).appendTo(rowDiv);
			if (dataArray[i].MODEL_NAME.length > 21) {
				$('<label>').attr({
					'title' : dataArray[i].MODEL_DESC,
					'class' : 'radio-inline truncate-text'
				}).append(ctrl).append(dataArray[i].MODEL_NAME)
						.appendTo(colDiv);
			} else {
				$('<label>').attr({
					'class' : 'radio-inline'
				}).append(ctrl).append(dataArray[i].MODEL_NAME)
						.appendTo(colDiv);
			}
			if (i == 0) {
				ctrl.attr('checked', true);
				storeSelectedInterfaceCode(ctrl);
			}
			childCountPerRow++;
		}
		if(dataArray.length == 0){
			document.getElementById('interfaceCode').value = "";
			document.getElementById('interfaceCategory').value = "";
			document.getElementById('interfaceProduct').value = "";
			document.getElementById('productTypeID').value = "";
			
		}
	}else{
		document.getElementById('interfaceCode').value = "";
		document.getElementById('interfaceCategory').value = "";
		document.getElementById('interfaceProduct').value = "";
		document.getElementById('productTypeID').value = "";
	}
}
function fetchInterfaceList(code) {
	var strUrl = 'services/getInterfaceList.json';
	var responseData = null;
	var responseData = null, objParam = {};
	$.ajax({
		url : strUrl,
		type : 'POST',
		async : false,
		data : {
			csrfTokenName : csrfTokenValue,
			$client : document.getElementById("selectedClient").value,
			$seller : document.getElementById("selectedSeller").value,
			$category : code
		},
		success : function(data) {
			responseData = data;
		}
	});
	return responseData;
}
function storeSelectedInterfaceCode(selectedRadio) {
	document.getElementById('interfaceCode').value = selectedRadio
			.attr('interfaceCode');
	document.getElementById('interfaceCategory').value = selectedRadio
			.attr('category');
	document.getElementById('interfaceProduct').value = selectedRadio
			.attr('subCategory');
	document.getElementById('productTypeID').value = selectedRadio
	.attr('catProductTypeId');
}
function hideErrorPanel(errorDivId) {
	if ($(errorDivId).is(':visible')) {
		$(errorDivId).addClass('ui-helper-hidden');
	}
}
function paintError(errorDiv, errorMsgDiv, errorMsg) {
	if (!$(errorDiv).is(':visible')) {
		$(errorDiv).removeClass('ui-helper-hidden');
	}
	$(errorMsgDiv).text(errorMsg);
}
function addCustomInterface() {
	var form = document.createElement('FORM');
	var strUrl = "addCustomInterface.srvc";
	form.name = 'frmMain';
	form.id = 'frmMain';
	form.method = 'POST';
	form.appendChild(createFormField('INPUT', 'HIDDEN', 'clientCode', document
			.getElementById('selectedClient').value));
	form.appendChild(createFormField('INPUT', 'HIDDEN', 'category', document
			.getElementById('interfaceProduct').value));
	form.appendChild(createFormField('INPUT', 'HIDDEN', 'productType', document
			.getElementById('productTypeID').value));
	form.appendChild(createFormField('INPUT', 'HIDDEN', 'interfaceCode',
			document.getElementById('interfaceCode').value));
	form.appendChild(createFormField('INPUT', 'HIDDEN', csrfTokenName,
			csrfTokenValue));
	form.action = strUrl;
	
	if(isEmpty(document.getElementById('interfaceProduct').value)){
		errorMsg = 'Please select the Interface';
		paintError('#customInterfaceInfoError','#customInterfaceInfoError',errorMsg);
	}else{
		document.body.appendChild( form );
		form.submit();
		document.body.removeChild( form );
	}
	
}

function generateCustFileMappingFilterArray(arrFilter) {
	var parsedArray = [], objJson = null, value1 = '', value2 = '', displayValue1 = '', displayValue2 = '' , operator = '' , formattedDateVal1 = '',displayValueCount = '',
	formattedDateVal2 = '', dtFormat = '';
	arrFilter = arrFilter || [];
	dtFormat = strExtApplicationDateFormat ? strExtApplicationDateFormat : "m/d/Y";
	$.each(arrFilter, function(index, cfgFilter) {
				objJson = {
					"fieldId" : cfgFilter.field || cfgFilter.paramName,
					"fieldLabel" : cfgFilter.fieldLabel || cfgFilter.paramFieldLable,
					"fieldObjData" : cfgFilter
				};
				operator = cfgFilter.operatorValue || cfgFilter.operator;
				value1 = cfgFilter.value1 || cfgFilter.paramValue1;
				value2 = cfgFilter.value2 || cfgFilter.paramValue2;
				displayValue1 = cfgFilter.displayValue1;
				displayValue2 = cfgFilter.displayValue2;
				switch (operator) {
				    case 'le' : 
				    	if(cfgFilter.dataType === 1 || cfgFilter.dataType === 'D'){
				    		formattedDateVal1 = Ext.util.Format.date(Ext.Date
									.parse(value1, 'Y-m-d'),
									dtFormat);
				    		
							objJson["fieldValue"] = formattedDateVal1 ;
							objJson["fieldTipValue"] = formattedDateVal1 ;
				    	}
				    	break;
					case 'bt' :
						if (cfgFilter.dataType === 2) {
							objJson["fieldValue"] = value1 + ' - '
									+ value2;
							objJson["fieldTipValue"] = value1 + ' - ' + value2;
						} else if (cfgFilter.dataType === 1 || cfgFilter.dataType === 'D') {
							formattedDateVal1 = Ext.util.Format.date(Ext.Date
									.parse(value1, 'Y-m-d'),
									dtFormat);
							
							formattedDateVal2 = Ext.util.Format.date(Ext.Date
									.parse(value2, 'Y-m-d'),
									dtFormat);
							
							objJson["fieldValue"] = formattedDateVal1 + ' - '
									+ formattedDateVal2;
							objJson["fieldTipValue"] = formattedDateVal1 + ' - '
							+ formattedDateVal2;
						}
						break;
					case 'st' :
						// TODO : Sorting handling to be done
						break;
					case 'lk' :
					case 'eq' :
						if (cfgFilter.displayType === 5 ||cfgFilter.displayType === 8 || cfgFilter.displayType === 12 || cfgFilter.displayType === 13){
							objJson["fieldValue"] = displayValue1;
							objJson["fieldTipValue"] = displayValue1;
						}
						else if(cfgFilter.displayType === 2 || cfgFilter.dataType === 2){
							objJson["fieldValue"] = ' = ' + value1;
							objJson["fieldTipValue"] = ' = ' + value1;
						}
						else if (cfgFilter.dataType=='D'){
							formattedDateVal1 = Ext.util.Format.date(Ext.Date
									.parse(value1, 'Y-m-d'),
									dtFormat);
							objJson["fieldValue"] = formattedDateVal1 ;
							objJson["fieldTipValue"] = formattedDateVal1;
						}
						else{
							objJson["fieldValue"] = value1;
							objJson["fieldTipValue"] = value1;
						}
						break;
					case 'gt' :
						objJson["fieldValue"] = ' > ' + value1;
						objJson["fieldTipValue"] = ' > ' + value1;
						break;
					case 'gte' :
						objJson["fieldValue"] = ' >= ' + value1;
						objJson["fieldTipValue"] = ' >= ' + value1;
						break;
					case 'lt' :
						objJson["fieldValue"] = ' < ' + value1;
						objJson["fieldTipValue"] = ' < ' + value1;
						break;
					case 'lte' :
						objJson["fieldValue"] = ' <= ' + value1;
						objJson["fieldTipValue"] = ' <= ' + value1;
						break;
					case 'in' :
						displayValueCount = getValueDisplayCount(displayValue1);
						if(displayValueCount > 2){
							objJson["fieldValue"] = displayValueCount+' Selected';
							objJson["fieldTipValue"] = 'In ( ' + displayValue1 + ')';
							
						}
						else{
							objJson["fieldValue"] = 'In ( ' + displayValue1 + ')';
							objJson["fieldTipValue"] = 'In ( ' + displayValue1 + ')';
						}
						break;
					case 'statusFilterOp' :
						displayValueCount = getValueDisplayCount(displayValue1);
						if(displayValueCount > 2){
							objJson["fieldValue"] = displayValueCount+' Selected';
							objJson["fieldTipValue"] = 'In ( ' + displayValue1 + ')';
							
						}
						else{
							objJson["fieldValue"] = 'In ( ' + displayValue1 + ')';
							objJson["fieldTipValue"] = 'In ( ' + displayValue1 + ')';
						}
						break;
				}
				parsedArray.push(objJson);
			});
	return parsedArray;
}

var statusJsonArr = [
  {
    "sequenceNo": 0,
    "name": "0",
    "value": "New",
    "updated": 0
  },
  {
    "sequenceNo": 0,
    "name": "12",
    "value": "Submitted",
    "updated": 0
  },
  {
    "sequenceNo": 0,
    "name": "1",
    "value": "Modified",
    "updated": 0
  },
  {
    "sequenceNo": 0,
    "name": "3",
    "value": "Approved",
    "updated": 0
  },
  {
    "sequenceNo": 0,
    "name": "4",
    "value": "Enable Request",
    "updated": 0
  },
  {
    "sequenceNo": 0,
    "name": "5",
    "value": "Suspend Request",
    "updated": 0
  },
  {
    "sequenceNo": 0,
    "name": "7",
    "value": "New Rejected",
    "updated": 0
  },
  {
    "sequenceNo": 0,
    "name": "8",
    "value": "Modified Rejected",
    "updated": 0
  },
  {
    "sequenceNo": 0,
    "name": "9",
    "value": "Suspend Request Rejected",
    "updated": 0
  },
  {
    "sequenceNo": 0,
    "name": "10",
    "value": "Enable Request Rejected",
    "updated": 0
  },
  {
    "sequenceNo": 0,
    "name": "11",
    "value": "Suspended",
    "updated": 0
  }
];

function cloneObject(obj) {
	return JSON.parse(JSON.stringify(obj));
};