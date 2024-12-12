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
				  goToBack("frmMain","loanRepaymentCenter.form");
				}
			
		}
	});
	$('#popup').dialog("open");
}

function goToBack(frmId,strUrl)
{
	if($('#dirtyBit').val()=="1")
	{
		getConfirmationPopup(frmId, strUrl);
	}
	else
	{
		var frm = document.getElementById(frmId);
		$(".input", this).removeAttr("disabled");
		frm.action = strUrl;
		frm.target = "";
		frm.method = "POST";
		frm.submit();
	}
}

function getConfirmationPopup(frmId, strUrl)
{
	$('#confirmPopup').dialog({
		autoOpen : false,
		maxHeight: 550,
		minHeight:'auto',
		width : 400,
		modal : true,
		resizable: false,
		draggable: false
	});
	$('#confirmPopup').dialog("open");

	$('#cancelConfirmMsg').bind('click',function(){
		$('#confirmPopup').dialog("close");
	});

	$('#doneConfirmMsgbutton').bind('click',function(){
		var frm = document.forms[frmId];
		frm.action = strUrl;
		frm.target = "";
		frm.method = "POST";
		frm.submit();
	});
	$('#textContent').focus();
}

function addPayment(frmId,strUrl)
{
	$('#paymentAmount').removeAttr("disabled");
	$("input").removeAttr("disabled");
		var frm = document.getElementById(frmId);
		frm.action = strUrl;
		frm.target = "";
		frm.method = "POST";
		frm.submit();
	
}

function goToEdit(frmUrl)
{
	$('#MODE').val("BACK");
	saveLoanRepayData(frmUrl)
}

function payAmount(element,amount,rowIndex,os)
{
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
				$('#pay'+rowIndex).val(element);
				}
			  }, 100);	
}

function setDirtyBit()
{
	document.getElementById("dirtyBit").value = "1";	
}

function saveLoanRepayData(url)
{
	var arrIdentifier = '',strAmtValue='';
	var form = document.getElementById('frmMain');
	$('#paymentAmount').removeAttr("disabled");
	$("input").removeAttr("disabled");
	var loanRepayStore = loanRepayGrid.getStore();
	if(loanRepayStore && loanRepayStore.count() > 0)
	{
		loanRepayStore.data.each(function(record) {
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

function createLoanRepayGrid(data_list)
{
	if(!Ext.isEmpty(data_list))
	{
		var jsonDataList =  Ext.decode(data_list);
		loanRepayGrid = null;
		$('#loanRepayDetailDiv').empty();
		loanRepayGrid = getLoanRepayGrid(jsonDataList)
	}
}

function getLoanRepayGrid(arrSelectedRecords) 
{
	var dataStore = dataStore = Ext.create('Ext.data.Store', {
		fields : ['loanReference', 'invoiceCurrencyCode', 'loanDueDate', 'loanAmount', 'loanOutStandingAmount',
					'anchorClient','buyerSeller','clientDescription','scmMyProductName','netPaymentAmount','identifier','paymentAmount','currencySymbol'],
		data : arrSelectedRecords
	});
	 loanRepayGrid = Ext.create('Ext.grid.Panel', {
				store : dataStore,
				minHeight: 100,
				height : (arrSelectedRecords.length * 65) > 300 ? 300 : arrSelectedRecords.length * 65,
				//maxHeight: 300,
				columns : getLoanRepayColumnModel(),
				renderTo : 'loanRepayDetailDiv',
				plugins: [
			        Ext.create('Ext.grid.plugin.CellEditing', {
			            clicksToEdit: 1,
			            listeners: {
			            beforeedit: function(e, editor){
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
							
							amountObj.val(e.record.get('netPaymentAmount'));
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
	return loanRepayGrid;
}
function handleAmountCal(){
	var gridStore,gridStoreData,totalAmt,objAmt=0;
	if(!isEmpty(loanRepayGrid)){
		gridStore = loanRepayGrid.getStore();
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
function getLoanRepayColumnModel()
{
		var columns = [{
			text: getLabel('loanReference', 'Loan Reference'),
			width : 170,
			dataIndex: 'loanReference',
			hideable : false,
			sortable : false,
			resizable : false,
			draggable : false,
			renderer: lonRepayGridColumnRenderer
		}, {
			text: getLabel('loanDueDate', 'Due Date'),
			width : 130,
			dataIndex: 'loanDueDate',
			hideable : false,
			sortable : false,
			resizable : false,
			draggable : false,
			renderer: lonRepayGridColumnRenderer
		}, {
			text: getLabel('loanAmount', 'Loan Amount'),
			width : 170,
			dataIndex: 'loanAmount',
			hideable : false,
			sortable : false,
			resizable : false,
			draggable : false,
			align : 'right',
			renderer: lonRepayGridColumnRenderer
		}, {
			text : getLabel('loanOutStandingAmount', 'Loan O/S Amount'),
			width: 170,
			dataIndex : 'loanOutStandingAmount',
			hideable : false,
			sortable : false,
			resizable : false,
			draggable : false,
			align : 'right',
			renderer: lonRepayGridColumnRenderer
		},{
			text : (userMode === 'BUYER') ?  getLabel('seller', 'Seller') :  getLabel('buyer', 'Buyer'),
			width: 140,
			dataIndex : 'buyerSeller',
			hideable : false,
			sortable : false,
			resizable : false,
			draggable : false,
			renderer: lonRepayGridColumnRenderer
		},{
			text : getLabel('scmMyProductName', 'Package'),
			width: 160,
			dataIndex : 'scmMyProductName',
			hideable : false,
			sortable : false,
			resizable : false,
			draggable : false,
			renderer: lonRepayGridColumnRenderer
		},{
			text : getLabel('netPaymentAmount', 'Net Payble Amount'),
			width: 170,
			dataIndex : 'netPaymentAmount',
			hideable : false,
			sortable : false,
			resizable : false,
			draggable : false,
			align : 'right',
			renderer: lonRepayGridColumnRenderer
		}];
		
		if (mode === 'VERIFY') {
			columns.push({
				text : getLabel('payAmount', 'Payment Amount'),
				width: 140,
				dataIndex : 'paymentAmount',
				hideable : false,
				sortable : false,
				resizable : false,
				draggable : false,
				align : 'right',
				renderer: lonRepayGridColumnRenderer
			});
		} else {
			columns.push({
				text : getLabel('payAmount', 'Payment Amount'),
				width: 140,
				dataIndex : 'paymentAmount',
				hideable : false,
				sortable : false,
				resizable : false,
				draggable : false,
				align : 'right',
				editor : createAmountFieldEditor('payAmountCol', ''),
				renderer: lonRepayGridColumnRenderer
			});
		}
		
		return columns;
}

function lonRepayGridColumnRenderer(value, metaData) {
	var strRetVal = value;
	var columnId = metaData.column.dataIndex;
	var recordData = metaData.record.data;
	if(columnId === 'paymentAmount' && mode !== 'VERIFY') {
		metaData.tdCls = 'amountCol';
	}
	else if(columnId === 'buyerSeller'){
		if('TRUE' !== metaData.record.data.anchorClient)
			strRetVal = metaData.record.data.clientDescription;
	}
	else if(columnId === 'loanAmount' || columnId === 'loanOutStandingAmount' || columnId === 'netPaymentAmount'){
		strRetVal = recordData.currencySymbol +' '+ strRetVal;
	}
	
	if(!Ext.isEmpty(strRetVal)) {
		metaData.tdAttr = 'title="' + strRetVal + '"';
	}
	return strRetVal;
}

function createAmountFieldEditor(fieldId, defValue) {
		var fieldCfg = {
			fieldCls : 'xn-valign-middle xn-form-text amountBox grid-field',
			cls : 'amountField',
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

