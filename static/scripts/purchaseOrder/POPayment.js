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
				  goToBack("frmMain","purchaseOrderCenter.form");
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
		height :250,
		bgiframe : true,
		modal : true,
	    resizable : false,
		draggable : false,
		width : 320,
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
	savePoPayementData(frmUrl)
}

function addPayment(frmId,strUrl)
{

	$('#paymentAmount').removeAttr("disabled");
	$("input").removeAttr("disabled");
	
		document.getElementById('account').value = $('#debitAccount').val();
		var frm = document.getElementById(frmId);
		frm.action = strUrl;
		frm.target = "";
		frm.method = "POST";
		frm.submit();
	
}
function payAmount(elementValue,rowIndex,os)
{
$('#pay'+rowIndex).ForceNumericOnly();
var z = parseFloat(os);
 setTimeout(
		  function() 
			  {
				var x=$('#paymentAmount').val();//user entered
				var v;
				 v=$('#pay'+rowIndex).val();//set in bean
				 var y=$('#payos'+rowIndex).val();//set in bean
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

function savePoPayementData(url)
{
	var arrIdentifier = '',strAmtValue='';
	var form = document.getElementById('frmMain');
	$('#paymentAmount').removeAttr("disabled");
	$("input").removeAttr("disabled");
	var poPaymentStore = poPaymentGrid.getStore();
	if(poPaymentStore && poPaymentStore.count() > 0)
	{
		poPaymentStore.data.each(function(record) {
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

function createPoPaymentGrid(data_list)
{
	if(!Ext.isEmpty(data_list))
	{
		var jsonDataList =  Ext.decode(data_list);
		poPaymentGrid = null;
		$('#poPaymentDetailDiv').empty();
		poPaymentGrid = getPoPaymentGrid(jsonDataList)
	}
}

function getPoPaymentGrid(arrSelectedRecords) 
{
	var dataStore = dataStore = Ext.create('Ext.data.Store', {
		fields : ['poReferenceNmbr', 'poDate', 'poCurrencyCode', 'poAmount', 'buyerSeller',
					'scmMyProductDesc','paymentAmount','poTermCode','identifier','outstandingAmount'],
		data : arrSelectedRecords
	});
	 poPaymentGrid = Ext.create('Ext.grid.Panel', {
				store : dataStore,
				minHeight: 110,
				height : (arrSelectedRecords.length * 70) > 300 ? 300 : arrSelectedRecords.length * 70,
				//maxHeight: 300,
				columns : getPoPaymentColumnModel(),
				renderTo : 'poPaymentDetailDiv',
				plugins: [
			        Ext.create('Ext.grid.plugin.CellEditing', {
			            clicksToEdit: 1,
			            listeners: {
			            beforeedit: function(e, editor){
			                if(mode==="VERIFY")
			                return false;
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
							
							amountObj.val(e.record.get('poAmount'));
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
			    ],
			    listeners:{
			    'beforerender':function(grid, eOpts){
			   
			     },
				'render':function(grid, eOpts){
					grid.getSelectionModel().select(0); 
			     }
			    }
			});
	return poPaymentGrid;
}
function handleAmountCal(){
	var gridStore,gridStoreData,totalAmt,objAmt=0;
	if(!isEmpty(poPaymentGrid)){
		gridStore = poPaymentGrid.getStore();
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
function getPoPaymentColumnModel()
{
		var columns = [{
			text: getLabel('poReferenceNmbr', 'PO Unique ID'),
			width : 210,
			dataIndex: 'poReferenceNmbr',
			hideable : false,
			sortable : false,
			draggable : false,
			renderer: poPaymentGridColumnRenderer
		}, {
			text: getLabel('poDate', 'Date'),
			width : 140,
			dataIndex: 'poDate',
			hideable : false,
			sortable : false,
			draggable : false,
			renderer: poPaymentGridColumnRenderer
		}, {
			text: getLabel('poAmount', 'Amount'),
			width : 210,
			dataIndex: 'poAmount',
			hideable : false,
			sortable : false,
			align : 'right',
			draggable : false,
			renderer: poPaymentGridColumnRenderer
		}, {
			text : getLabel('buyerSeller', 'Seller'),
			width: 210,
			dataIndex : 'buyerSeller',
			hideable : false,
			sortable : false,
			draggable : false,
			align : 'left',
			renderer: poPaymentGridColumnRenderer
		},{
			text : getLabel('scmMyProductDesc', 'Package'),
			width: 230,
			dataIndex : 'scmMyProductDesc',
			hideable : false,
			sortable : false,
			draggable : false,
			renderer: poPaymentGridColumnRenderer
		},{
			text : getLabel('paymentAmount', 'Outstanding Amount'),
			width: 210,
			dataIndex : 'outstandingAmount',
			hideable : false,
			sortable : false,
			draggable : false,
			align : 'right',
			renderer: poPaymentGridColumnRenderer
		},{
			text : '<span class="requiredLeft"><span class="x-column-header-text">'+
			getLabel('paymentAmount', 'Payment Amount')+'</span></span>',
			dataIndex : 'paymentAmount',
			width:170,
			hideable : false,
			sortable : false,
			resizable : false,
			draggable : false,
			align : 'right',
			editor : createAmountFieldEditor('paymentAmount', ''),
			renderer: poPaymentGridColumnRenderer
		}];
		return columns;
}

function poPaymentGridColumnRenderer(value, metaData) {
	var strRetVal = value;
	var columnId = metaData.column.dataIndex;
	var recordData = metaData.record.data;
	
	if(columnId === 'poAmount' || columnId === 'outstandingAmount'){
		strRetVal = $('#currency').val() +" "+strRetVal;
	}
	
	if(columnId === 'paymentAmount' ){
		if(mode!="VERIFY")
			metaData.tdCls = 'amountCol';
		else
			strRetVal = $('#currency').val() +" "+strRetVal;
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
function setPOPaymentAddtionInformationData(){
	var clientPOCode=$('#txtPOCenterClientCode').val();
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
				paymentDetails=data.d;
				paintPOAdditionInormation(data);
			}
		});
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
function paintPOAdditionInormation(data){
	var respData=data.d;
	$('.companyInfo_InfoSpan').empty();
	$('.paymentSource_InfoSpan').empty();
	$('.package_InfoSpan').empty();
	$('.currency_InfoSpan').empty();
	$('.type_InfoSpan').empty();
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