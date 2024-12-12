function showPopup()
{
 $('#popup').dialog({
		autoOpen : false,
		height : 180,
		width : 473,
		modal : true,
		buttons : {
				"OK" : function() 
				{
				  goToBack("frmMain","invoiceCenter.form");
				}
			
		}
	});
	$('#popup').dialog("open");
}
function goToBack(frmId,strUrl)
{
	
	if($('#dirtyBit').val()=="1")
		getConfirmationPopup(frmId, strUrl);
	else
		goToPage(strUrl, frmId);
}

function goToPage(strUrl, frmId)
{
	var frm = document.getElementById(frmId);
		$(".input", this).removeAttr("disabled");
		frm.action = strUrl;
		frm.target = "";
		frm.method = "POST";
		frm.submit();
}

function getConfirmationPopup(frmId, strUrl)
{
	$('#confirmPopup').dialog( {
		autoOpen : false,
		height : 250,
		width : 320,
		modal : true,
		buttons : {
				"Ok" : function() {
					var frm = document.getElementById(frmId);
					frm.action = strUrl;
					frm.target = "";
					frm.method = "POST";
					frm.submit();
					},
				"Cancel" : function() {
					$(this).dialog("close");
					}
		}
	});
	$('#confirmPopup').dialog("open");
}

function goToEdit(frmUrl)
{
	$('#MODE').val("BACK");
	saveInvoicePayementData(frmUrl)
}

function addPayment(frmId,strUrl)
{

	$('#paymentAmount').removeAttr("disabled");
	$("input").removeAttr("disabled");
	$('#divInvPayments').appendTo('#frmMain');
		document.getElementById('account').value = $('#debitAccount').val();
		var frm = document.getElementById(frmId);
		frm.action = strUrl;
		frm.target = "";
		frm.method = "POST";
		frm.submit();
	
}
function payAmount(elementValue,amount,rowIndex,os)
{
$('#pay'+rowIndex).ForceNumericOnly();
var z = parseFloat(os);
 setTimeout(
		  function() 
			  {
				var x=$('#paymentAmount').val();
				var v;
				 v=$('#pay'+rowIndex).val();
				 var y=$('#payos'+rowIndex).val();
				if(v <= z)
				{
				if(v < y)
				{
				  
				  $('#paymentAmount').val(parseFloat(x)-((isNaN(parseFloat(y)) ? 0 : parseFloat(y)) - (isNaN(parseFloat(v)) ? 0 : parseFloat(v))));
				  $('#payos'+rowIndex).val(v);
				}
				 else if(v > y)
				{
				  
				  $('#paymentAmount').val(parseFloat(x)+(
				  (isNaN(parseFloat(v)) ? 0 : parseFloat(v))
				  - (isNaN(parseFloat(y)) ? 0 : parseFloat(y))
				  ));
				  $('#payos'+rowIndex).val(v);
				}
				}
				else
				{
					$('#pay'+rowIndex).val(elementValue);
				
				}
			  }, 100);	
}
function setDirtyBit()
{
	document.getElementById("dirtyBit").value = "1";	
}

/* smart grid starts here */

function saveInvoicePayementData(url)
{
	var arrIdentifier = '',strAmtValue='';
	var form = document.getElementById('frmMain');
	$('#paymentAmount').removeAttr("disabled");
	$("input").removeAttr("disabled");
	var invoicePaymentStore = invoicePaymentGrid.getStore();
	if(invoicePaymentStore && invoicePaymentStore.count() > 0)
	{
		invoicePaymentStore.data.each(function(record) {
			var index = record.index;
	    	var id = record.data.identifier;
			var amount = record.data.paymentAmount;
			strAmtValue='';
			if(index > 0)
			arrIdentifier += ',';
			
			arrIdentifier +=id;
			
			if(!isEmpty(amount)){
					var obj = $('<input type="text">');
					obj.autoNumeric('init');
					obj.val(amount);
					strAmtValue = obj.autoNumeric('get');
					obj.remove();
				}
			
			form.appendChild(createFormField('INPUT', 'HIDDEN',
						'pay'+(index+1), strAmtValue));
	    });
	}
	$('#viewState').val(arrIdentifier);
	form.method = 'POST';
	form.action = url;
	form.submit();
	$('#paymentAmount').attr("disabled",true);
}


function createFormField(element, type, name, value) 
{
	var form = document.getElementById('frmMain');
	var formElements = form.elements;
	var inputField;

	if( null != formElements )
	{
		inputField = formElements.namedItem(name);
		if( null != inputField )
		{
			inputField.parentNode.removeChild(inputField);
		}
	}
	inputField = document.createElement( element );
	inputField.type = type;
	inputField.name = name;
	inputField.value = value;			
			
	return inputField;
}

function createinvoicePaymentGrid(data_list)
{
	if(!Ext.isEmpty(data_list))
	{
		var jsonDataList =  Ext.decode(data_list);
		invoicePaymentGrid = null;
		$('#invoicePaymentDetailDiv').empty();
		invoicePaymentGrid = getinvoicePaymentGrid(jsonDataList)
	}
}

function getinvoicePaymentGrid(arrSelectedRecords) 
{
	var dataStore = Ext.create('Ext.data.Store', {
		fields : ['invoiceNumber', 'invoiceDate','invoiceDueDate', 'invoiceCurrencyCode', 'invoiceAmount', 'adjustmentAmount',
					'buyerSeller','scmMyProductName','outstandingAmount','paymentAmount','invoiceTermCode','identifier'],
		data : arrSelectedRecords
	});
	 invoicePaymentGrid = Ext.create('Ext.grid.Panel', {
				store : dataStore,
				minHeight: 110,
				height : (arrSelectedRecords.length * 70) > 300 ? 300 : arrSelectedRecords.length * 70,
				//maxHeight: 300,
				columns : getInvoicePaymentColumnModel(),
				renderTo : 'invoicePaymentDetailDiv',
				plugins: [
			        Ext.create('Ext.grid.plugin.CellEditing', {
			            clicksToEdit: 1,
			            listeners: {
			            beforeedit: function(e, editor){
			            	if(mode==="VERIFY")
				                return false;
			                /*if (editor.record.get('count') == 3)
			                    return false;*/
			            },
			            validateedit : function(editor, e){
			            	var editableAmount = null;
							var oldEditedAmount = e.value;
							var paymentAmount = null;
							var netPaymentAmount = null;
							var amountObj = $('<input type="text">').autoNumeric('init',{aSep : strGroupSeparator, 
																						 aDec : strDecimalSeparator, 
																						 mDec : strAmountMinFraction, 
																						 vMin : 0,
																						 wEmpty : 'zero'});
							
							paymentAmount = $('#paymentAmount').autoNumeric('get');			
							
							amountObj.val(e.record.get('invoiceAmount'));
							netPaymentAmount = amountObj.autoNumeric('get');
							
							amountObj.val(e.value);
							editableAmount = amountObj.autoNumeric('get');	
			
							if(parseFloat(editableAmount) > parseFloat(netPaymentAmount))
							{
								return false;
							}
							
							$("#dirtyBit").val('1');
							amountObj.remove();
			            },
			            edit : function(editor,e){
			            	handleAmountCal();
			            }
			        }
			        })
			    ]
			});
	return invoicePaymentGrid;
}
function handleAmountCal(){
	var gridStore,gridStoreData,totalAmt,objAmt=0;
	if(!isEmpty(invoicePaymentGrid)){
		gridStore = invoicePaymentGrid.getStore();
		gridStoreData = gridStore.data.items;
		if(!isEmpty(gridStoreData)){
			$.each(gridStoreData, function(index, cfg) {
				var objData = cfg.data;
				var amountObj = $('<input type="text">').autoNumeric('init',{aSep : strGroupSeparator, 
																						 aDec : strDecimalSeparator, 
																						 mDec : strAmountMinFraction, 
																					 vMin : 0,
																					 wEmpty : 'zero'});
				amountObj.val(objData.paymentAmount);	
				objAmt = parseFloat(objAmt)+parseFloat(amountObj.autoNumeric('get'));
			});
			$('#paymentAmount').autoNumeric('set',objAmt);
		}
	}
}
function getInvoicePaymentColumnModel()
{
		var columns = [{
			text: getLabel('invoiceNumber', 'Invoice Number'),
			width : 210,
			dataIndex: 'invoiceNumber',
			hideable : false,
			sortable : false,
			draggable : false,
			renderer: invoicePaymentGridColumnRenderer
		}, {
			text: getLabel('invoiceDate', 'Due Date'),
			width : 140,
			dataIndex: 'invoiceDueDate',
			hideable : false,
			sortable : false,
			draggable : false,
			renderer: invoicePaymentGridColumnRenderer
		}, {
			text: getLabel('invoiceAmount', 'Amount'),
			width : 210,
			dataIndex: 'invoiceAmount',
			hideable : false,
			sortable : false,
			draggable : false,
			align : 'right',
			renderer: invoicePaymentGridColumnRenderer
		}, {
			text : getLabel('adjustmentAmount', 'Adjustment Amount'),
			width: 210,
			dataIndex : 'adjustmentAmount',
			hideable : false,
			sortable : false,
			draggable : false,
			align : 'right',
			renderer: invoicePaymentGridColumnRenderer
		},{
			text : getLabel('buyerSeller', 'Seller'),
			width: 230,
			dataIndex : 'buyerSeller',
			hideable : false,
			sortable : false,
			draggable : false,
			renderer: invoicePaymentGridColumnRenderer
		},{
			text : getLabel('scmMyProductName', 'Package'),
			width: 230,
			dataIndex : 'scmMyProductName',
			hideable : false,
			sortable : false,
			draggable : false,
			renderer: invoicePaymentGridColumnRenderer
		},{
			text : getLabel('paymentAmount', 'Outstanding Amount'),
			width: 210,
			dataIndex : 'outstandingAmount',
			hideable : false,
			sortable : false,
			draggable : false,
			align : 'right',
			renderer: invoicePaymentGridColumnRenderer
		},{
			text : '<span class="requiredLeft"><span class="x-column-header-text">'+
			getLabel('paymentAmount', 'Payment Amount')+'</span></span>',
			width: 170,
			dataIndex : 'paymentAmount',
			hideable : false,
			sortable : false,
			resizable : false,
			draggable : false,
			align : 'right',
			editor : createAmountFieldEditor('paymentAmount', ''),
			renderer: invoicePaymentGridColumnRenderer
		}];
		return columns;
}

function invoicePaymentGridColumnRenderer(value, metaData) {
	var strRetVal = value;
	var columnId = metaData.column.dataIndex;
	var recordData = metaData.record.data;
	
	if(columnId === 'adjustmentAmount' || columnId == 'invoiceAmount' || columnId === 'outstandingAmount'){
		strRetVal = $('#invoiceCurrencyCode').val() +" "+strRetVal;
	}
	
	if(columnId === 'paymentAmount' ){
		if(mode!="VERIFY")
			metaData.tdCls = 'amountCol';
		else
			strRetVal = $('#invoiceCurrencyCode').val() +" "+strRetVal;
	}
	
	if(!Ext.isEmpty(strRetVal)) {
		metaData.tdAttr = 'title="' + strRetVal + '"';
	}
	return strRetVal;
}

function createAmountFieldEditor(fieldId, defValue) {
		var fieldCfg = {
			fieldCls : 'xn-valign-middle xn-form-text amountBox grid-field',
			cls : 'payamount',
			allowBlank : true,
			itemId : fieldId,
			name : fieldId,
			tabIndex : 5,
			disabled : (mode === 'VERIFY' ? true : false),
			dataIndex : fieldId,
			
			value : defValue ? defValue : '',
			defValue : defValue ? defValue : '',
			focusable : true,
			enableKeyEvents : true,
			listeners : {
				'render' : function(cmp, e) {
					cmp.getEl().on('mousedown', function(ev) {
								ev.preventDefault();
								cmp.focus(true);

							})
				},
				'afterrender' : function(field) {
					var strId = field.getEl() && field.getEl().id ? field
							.getEl().id : null;
					var inputField = strId ? $('#' + strId + ' input') : null;
					if (inputField) {
						inputField.autoNumeric("init", {
									aSep : strGroupSeparator,
									aDec : strDecimalSeparator,
									mDec : strAmountMinFraction,
									vMin : 0,
									vmax : '9999999999999.99'
								});
					}
				},
				'focus' : function(field, e, eOpts) {
					e.stopEvent();
					field.focus(true);
				}
			}
		};
		var field = Ext.create('Ext.form.TextField', fieldCfg);
		return field;
}
var mapPaymentTypeLabel = {
		"BATCHPAY" : {
		"D" : {
			'ACCTRFLAYOUT' : 'Debit Multiple Accounts',
			'SIMPLEACCTRFLAYOUT' : 'Debit Multiple Accounts',
			'ACHLAYOUT' : 'Debit Transaction',
			'ACHIATLAYOUT' : 'Debit Transaction',
			'CHECKSLAYOUT' : 'Debit Transaction',
			'TAXLAYOUT' : 'Debit Transaction',
			'WIRELAYOUT' : 'Drawdown',
			'MIXEDLAYOUT' : 'Debit Transaction',
			'WIRESWIFTLAYOUT' : 'Debit'
		},
		"C" : {
			'ACCTRFLAYOUT' : 'Credit Multiple Account',
			'SIMPLEACCTRFLAYOUT' : 'Debit Single Account',
			'ACHLAYOUT' : 'Credit Transaction',
			'ACHIATLAYOUT' : 'Credit Transaction',
			'CHECKSLAYOUT' : 'Credit Transaction',
			'TAXLAYOUT' : 'Credit Transaction',
			'WIRELAYOUT' : 'Credit',
			'MIXEDLAYOUT' : 'Credit Transaction',
			'WIRESWIFTLAYOUT' : 'Credit'
		}
	},
	"QUICKPAY" : {
		"D" : {
			'ACCTRFLAYOUT' : 'Debit Single Account',
			'SIMPLEACCTRFLAYOUT' : 'Debit Single Account',
			'ACHLAYOUT' : 'Debit Transaction',
			'ACHIATLAYOUT' : 'Debit Transaction',
			'CHECKSLAYOUT' : 'Debit Transaction',
			'TAXLAYOUT' : 'Debit Transaction',
			'WIRELAYOUT' : 'Drawdown',
			'MIXEDLAYOUT' : 'Debit Transaction',
			'WIRESWIFTLAYOUT' : 'Debit'
		},
		"C" : {
			'ACCTRFLAYOUT' : 'Credit Single Account',
			'SIMPLEACCTRFLAYOUT' : 'Debit Single Account',
			'ACHLAYOUT' : 'Credit Transaction',
			'ACHIATLAYOUT' : 'Credit Transaction',
			'CHECKSLAYOUT' : 'Credit Transaction',
			'TAXLAYOUT' : 'Credit Transaction',
			'WIRELAYOUT' : 'Credit',
			'MIXEDLAYOUT' : 'Credit Transaction',
			'WIRESWIFTLAYOUT' : 'Credit'
		}
	},
	"QUICKPAYSTI" : {
		"D" : {
			'ACCTRFLAYOUT' : 'Debit Single Account',
			'SIMPLEACCTRFLAYOUT' : 'Debit Single Account',
			'ACHLAYOUT' : 'Debit Transaction',
			'ACHIATLAYOUT' : 'Debit Transaction',
			'CHECKSLAYOUT' : 'Debit Transaction',
			'TAXLAYOUT' : 'Debit Transaction',
			'WIRELAYOUT' : 'Drawdown',
			'MIXEDLAYOUT' : 'Debit Transaction',
			'WIRESWIFTLAYOUT' : 'Debit'
		},
		"C" : {
			'ACCTRFLAYOUT' : 'Credit Single Account',
			'SIMPLEACCTRFLAYOUT' : 'Debit Single Account',
			'ACHLAYOUT' : 'Credit Transaction',
			'ACHIATLAYOUT' : 'Credit Transaction',
			'CHECKSLAYOUT' : 'Credit Transaction',
			'TAXLAYOUT' : 'Credit Transaction',
			'WIRELAYOUT' : 'Credit',
			'MIXEDLAYOUT' : 'Credit Transaction',
			'WIRESWIFTLAYOUT' : 'Credit'
		}
	}
};
function setPOPaymentAddtionInformationData(){
	var clientPOCode=$('#txtLCMyClientCode').val();
		$.ajax({
			type : "GET",
			url : 'services/poPaymentAdditionalInfo',
			data : {
				$poPackage : poPackage,
			    $clientCode: clientPOCode
			},
			async : false,
			complete : function(XMLHttpRequest, textStatus) {
				
			},
			success : function(data) {
				paintPOAdditionInormation(data);
				paymentDetails=data.d;
			}
		});
}
function showPOPaymentInfoPopup(){
	$('#poPaymentSummaryDiv').dialog({
				autoOpen : false,
				maxHeight : 620,
				width : 690,
				modal : true,
				draggable:false,
				resizeable:false,
				dialogClass : 'ft-dialog',
				open : function() {
					$('#poPaymentSummaryDiv').removeClass('hidden');
					$('#poPaymentSummaryDiv').dialog('option','position','center'); 
				},
				close : function() {
				}
			});
	$('#poPaymentSummaryDiv').dialog("open");
	$('#poPaymentSummaryDiv').dialog("option","position","center");

}
function paintPOAdditionInormation(data){
	var respData=data.d;
	$('.companyInfo_InfoSpan').empty();
	$('.paymentSource_InfoSpan').empty();
	$('.package_InfoSpan').empty();
	$('.currency_InfoSpan').empty();
	var companyInfo=respData['anchorCompanyInfo'];
	$('.companyInfo_InfoSpan').text(companyInfo.company + ' '+companyInfo.companyAddress);
    $('.paymentSource_InfoSpan').text(respData['paymentSource']);
    $('.package_InfoSpan').text(respData['package']);
    $('.enteredBy_InfoSpan').text(respData['enteredBy']);
    $('.currency_InfoSpan').text(respData['currency']);
    var hrdDrfalg=respData['drCrFlag'];
    var paymentType=respData['paymentType'];
    var paymentLayout=respData['paymentLayout'];
    var diplayValue = mapPaymentTypeLabel[paymentType][hrdDrfalg][paymentLayout];
    $('.type_InfoSpan').text(diplayValue);
}