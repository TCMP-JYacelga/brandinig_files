var blnAdjPopupOpen = true;
var blnTrnPopupOpen = true;
var agreementStructureType = null;
var STRUCTURETYPE = null;
var CURRENCYTYPE = null;
var masterAccount = null;
function goToPage(strUrl, frmId) {
	var frm = document.createElement( 'FORM' );
	frm.name = 'txnFrmMain';
	frm.id = 'txnFrmMain';
	frm.action = strUrl;
	frm.target = "";
	frm.method = "POST";
	document.body.appendChild( frm );
	frm.submit();
	document.body.removeChild( frm );
}
function ajaxError()
{
	alert( "AJAX error, please contact admin!" );
}
function goToHome(strUrl)
{
	var frm = document.getElementById( 'frmMain' );
	frm.action = strUrl;		
	frm.target = "";
	frm.method = "POST";
	frm.submit();
}
function setDirtyBit()
{
	document.getElementById( "dirtyBit" ).value = '1';
}
function createFormField( element, type, name, value )
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
function resetPopupVariables()
{
	$('#targetGlId').val('');
	$('#targetCcy').val('');
	$('#targetAccountId').val(0);
	$('#targetBank').val('');
	$('#targetIban').val('');
	document.getElementById( "contraAccountSpan" ).innerHTML = '';
	
	$('#sourceGlId').val('');
	$('#sourceCcy').val('');
	$('#sourceAccountId').val(0);
	$('#sourceBank').val('');
	$('#sourceIban').val('');
	document.getElementById( "participatingAccountSpan" ).innerHTML = '';
}
function resetContraAccountFields()
{
	$('#targetGlId').val('');
	$('#targetCcy').val('');
	$('#targetAccountId').val(0);
	$('#targetBank').val('');
	$('#targetIban').val('');
	document.getElementById( "contraAccountSpan" ).innerHTML = '';	
}
function doAdjustmentTxn(record)
{
    var makerStamp, time;
	$("#errorDiv").empty();
	resetPopupVariables();
    $('#messageContentDiv').addClass('ui-helper-hidden');
	createParticipatingAccountAutoCompletor(record.get('agreementRecKey'));
	createContraAccountAutoCompletor(record.get('agreementRecKey'));
	
	document.getElementById("txnFrmMain").reset();
	
	/*$("#txnFrmMain input[name=clientDesc]").val(record.get('clientDesc'));
	$("#txnFrmMain input[name=agreementCodeDesc]").val(record.get('agreementCode'));
	$("#txnFrmMain input[name=agreementName]").val(record.get('agreementName'));*/
	$("#txnFrmMain input[name=viewState]").val(record.get('viewState'));
	$("#txnFrmMain input[name=transactionType]").val(1);
	
	document.getElementById('transactionTypeDesc').value = "Adjustment";
	document.getElementById('movementType').value = 'A';
//	document.getElementById('valueDate').value = dtApplicationDate;
	
	makerStamp = new Date(dtApplicationDate);	
	time = makerStamp.toLocaleTimeString();	
	makerStamp = Ext.Date.format(makerStamp, strExtApplicationDateFormat);		
	
	$( '#adjustmentTransferPopup' ).dialog(
	{
		autoOpen : false,
		minHeight : 156,
		maxHeight : 550,
		width : '735',
		modal : true,
		resizable : false,				
		draggable: false,		
		title : getLabel('adjustmentEntry','Adjustment Entry'), 
		open : function()
		{		
				if(blnAdjPopupOpen)
					$('#adjustmentTransferPopup').dialog().parent().prepend($('#messageContentDiv'));
		
			   $('#popupTitle').text("Adjustment");
			   $("#clientDesc").text(getStringWithSpecialChars(record.data.clientDesc || ''));
				$("#clientDesc").prop('title',getStringWithSpecialChars(record.data.clientDesc || ''));
				$("#clientDescription1").text(getStringWithSpecialChars(record.data.clientDesc || ''));
				$("#clientDescription1").prop('title',getStringWithSpecialChars(record.data.clientDesc || ''));
				$("#agreementCodeDesc").text(record.data.agreementCode || '');
				$("#agreementCodeDesc").prop('title',record.data.agreementCode || '');
				$("#agreementName").text(record.data.agreementName || '');
				$("#agreementName").prop('title',record.data.agreementName || '');
				$("#agreementName1").text(record.data.agreementName || '');
				$("#agreementName1").prop('title',record.data.agreementName || '');
				$("#transactionTypeDesc").text(record.data.structureTypeDesc || '');
				$("#transactionTypeDesc").prop('title',record.data.structureTypeDesc || '');
				//$("#valueDateId").text(dtApplicationDate +' '+time || '');
				$("#valueDateId").text(dtApplicationDate);
				//$("#valueDateId").prop('title', dtApplicationDate + ' ' + time || '');
				$("#valueDateId").prop('title', dtApplicationDate);
				$('#targetAmount').autoNumeric("init",
						{
							aSep: strGroupSeparator,
							aDec: strDecimalSeparator,
							mDec: strAmountMinFraction
						});
				$('#sourceAmount').autoNumeric("init",
						{
							aSep: strGroupSeparator,
							aDec: strDecimalSeparator,
							mDec: strAmountMinFraction
						});
				$('#sourceAmount').autoNumeric('set','0.00');
				$('#targetAmount').autoNumeric('set','0.00');
				blnAdjPopupOpen= false;
		}
	} );
	$( '#adjustmentTransferPopup' ).dialog( "open" );
}
function closeAdjustmentTransferPopup()
{
	hideErrorPanel('#messageContentDiv');
	$( '#adjustmentTransferPopup' ).dialog( 'close' );
}
function closeExecutePopup()
{
	$( '#executePopup' ).dialog( 'close' );
}
function doTransferTxn(record)
{
	var time,makerStamp;
	$("#errorDiv").empty();
	resetPopupVariables();
	$('#messageContentDiv').addClass('ui-helper-hidden');
	if( record && record.raw && record.raw.structureType )
	{
		agreementStructureType = record.raw.structureType;
	}
	else
	{
		agreementStructureType = null;
	}	
	createParticipatingAccountAutoCompletor(record.get('agreementRecKey'));
	createContraAccountAutoCompletor(record.get('agreementRecKey'));
	
	document.getElementById("txnFrmMain").reset();
	
	/*$("#txnFrmMain input[name=clientDesc]").val(record.get('clientDesc'));
	$("#txnFrmMain input[name=agreementCodeDesc]").val(record.get('agreementCode'));
	$("#txnFrmMain input[name=agreementName]").val(record.get('agreementName'));*/
	$("#txnFrmMain input[name=viewState]").val(record.get('viewState'));
	$("#txnFrmMain input[name=transactionType]").val(2);
	
	document.getElementById('transactionTypeDesc').value = "Transfer";
	document.getElementById('movementType').value = 'X';
	
//	document.getElementById('valueDate').value = dtApplicationDate;	
//	document.getElementById("valueDate").readOnly=true;
//	document.getElementById("valueDate").disabled=true;

	makerStamp = new Date(dtApplicationDate);	
	time = makerStamp.toLocaleTimeString();	
	makerStamp = Ext.Date.format(makerStamp, strExtApplicationDateFormat);		
	$( '#adjustmentTransferPopup' ).dialog(
	{
		autoOpen : false,
		minHeight : 156,
		maxHeight : 550,
		width : '735',
		modal : true,
		resizable : false,				
		draggable: false,		
		title : getLabel('txnEntry', 'Transaction Entry'),
		open : function()
		{
				if(blnTrnPopupOpen === true)
					$('#adjustmentTransferPopup').dialog().parent().prepend($('#messageContentDiv'));
				
				$('#popupTitle').text("Transfer");
				$("#clientDesc").text(getStringWithSpecialChars(record.data.clientDesc || ''));
				$("#clientDesc").prop('title',getStringWithSpecialChars(record.data.clientDesc || ''));
				$("#clientDescription1").text(getStringWithSpecialChars(record.data.clientDesc || ''));
				$("#clientDescription1").prop('title',getStringWithSpecialChars(record.data.clientDesc || ''));
				$("#agreementCodeDesc").text(record.data.agreementCode || '');
				$("#agreementCodeDesc").prop('title',record.data.agreementCode || '');
				$("#agreementName").text(record.data.agreementName || '');
				$("#agreementName").prop('title',record.data.agreementName || '');
				$("#agreementName1").text(record.data.agreementName || '');
				$("#agreementName1").prop('title',record.data.agreementName || '');
				$("#transactionTypeDesc").text(record.data.structureTypeDesc || '');
				$("#transactionTypeDesc").prop('title',record.data.structureTypeDesc || '');
				//$("#valueDateId").text(dtApplicationDate +' '+time || '');
				$("#valueDateId").text(dtApplicationDate);
				//$("#valueDateId").prop('title', dtApplicationDate + ' ' + time || '');
				$("#valueDateId").prop('title', dtApplicationDate);
				$('#targetAmount').autoNumeric("init",
						{
							aSep: strGroupSeparator,
							aDec: strDecimalSeparator,
							mDec: strAmountMinFraction
						});
				$('#sourceAmount').autoNumeric("init",
						{
							aSep: strGroupSeparator,
							aDec: strDecimalSeparator,
							mDec: strAmountMinFraction
						});
				$('#sourceAmount').autoNumeric('set','0.00');
				$('#targetAmount').autoNumeric('set','0.00');
				blnTrnPopupOpen = false;
				
		}
	} );
	$( '#adjustmentTransferPopup' ).dialog( "open" );
}
function submitAdjustmentTransferTxn()
{
	var frm = document.forms["txnFrmMain"];
	var mandatoryFieldsArray = new Array();
	var i = 0;
	var blnAutoNumeric ;
	var sourceAmount ,targetAmount ;
	if($('#sourceAmount') != null)
	{
		blnAutoNumeric = isAutoNumericApplied('sourceAmount');
		if (blnAutoNumeric)
			sourceAmount = $("#sourceAmount").autoNumeric('get');
		else
			sourceAmount = $("#sourceAmount").val();
	}
	
	if($('#targetAmount') != null)
	{
		blnAutoNumeric = isAutoNumericApplied('targetAmount');
		if (blnAutoNumeric)
			targetAmount = $("#targetAmount").autoNumeric('get');
		else
			targetAmount = $("#targetAmount").val();
	}
	//mandatoryFieldsArray[ i++ ] = document.getElementById('valueDateId').value;
	mandatoryFieldsArray[ i++ ] = document.getElementById('sourceGlId').value;
	mandatoryFieldsArray[ i++ ] = document.getElementById('targetGlId').value;
	mandatoryFieldsArray[ i++ ] = sourceAmount;
	mandatoryFieldsArray[ i++ ] = targetAmount;
	$("#errorDiv").empty();
	if(checkMandatoryFields( mandatoryFieldsArray) )
	{		
		
				$('#messageContentDiv').removeClass('ui-helper-hidden');
				$( "#errorDiv" ).text( "Please enter mandatory data !" );
	
		return false;
	}
	
	if( validateSourceAmount() ) {
		document.getElementById('sourceAmount').value = sourceAmount;
		document.getElementById('targetAmount').value = targetAmount;
	$( "#txnFrmMain" ).find( 'input' ).addClass( "enabled" );
	$( "#txnFrmMain" ).find( 'input' ).attr( "disabled", false );
	$( "#txnFrmMain" ).find( 'select' ).addClass( "enabled" );
	$( "#txnFrmMain" ).find( 'select' ).attr( "disabled", false );
	frm.action = "submitAdjustmentTransferTxn.srvc";
	frm.target = "";
	frm.method = "POST";
	frm.submit();
	}
}
function checkMandatoryFields( mandatoryFieldsArray )
{
	var me = this;
	var fieldValue = null;
	var isMandatoryError = false;
	for( var i = 0 ; i < mandatoryFieldsArray.length ; i++ )
	{
			fieldValue = mandatoryFieldsArray[ i ];
			if( fieldValue == null || fieldValue.trim() == '' )
			{
				isMandatoryError = true;
				break;
			}
	}
	return isMandatoryError;
}
function doExecuteTxn(record)
{
	document.getElementById("exeFrmMain").reset();
	
/*	$("#exeFrmMain input[name=clientDesc]").val(record.get('clientDesc'));
	$("#exeFrmMain input[name=agreementCodeDesc]").val(record.get('agreementCode'));
	$("#exeFrmMain input[name=agreementName]").val(record.get('agreementName'));*/
	
	$("#exeFrmMain input[name=viewState]").val(record.get('viewState'));
	$("#exeFrmMain input[name=transactionType]").val(3);
	
	$( '#executePopup' ).dialog(
	{
		autoOpen : false,
		minHeight : 156,
		maxHeight : 550,
		width : '735',
		modal : true,
		resizable : false,
		title : getLabel('balType', 'Select Balance Type'),
		open : function()
		{
				$("#clientDescription").text(getStringWithSpecialChars(record.data.clientDesc || ''));
				$("#clientDescription").prop('title',getStringWithSpecialChars(record.data.clientDesc || ''));
				$("#agreementCodeDescription").text(record.data.agreementCode || '');
				$("#agreementCodeDescription").prop('title',record.data.agreementCode || '');
				$("#agreementNameDesc").text(record.data.agreementName || '');
				$("#agreementNameDesc").prop('title',record.data.agreementName || '');								
			
		}
	} );
	$( '#executePopup' ).dialog( "open" );
}
function submitExecuteTxn()
{
	$( '#executePopup' ).addClass('hidden');
	$( '#executePopup' ).dialog('close');
	var frm = document.forms["exeFrmMain"];
	frm.action = "submitExecuteTxn.srvc";
	frm.target = "";
	frm.method = "POST";
	frm.submit();
}
function calculateTargetAmount(strUrl)
{
	var strData = {};
	var strUrl = strUrl;
	var fromCCy = document.getElementById( "sourceCcy" ).value;
	var toCCY = document.getElementById( "targetCcy" ).value;
	if(validateSourceAmount()){
	hideErrorPanel('#messageContentDiv');
	var blnAutoNumeric = isAutoNumericApplied('sourceAmount');
	var fromAmount ;
	var fieldAmount ;
	if (blnAutoNumeric)
		fromAmount = $("#sourceAmount").autoNumeric('get');
	else
		fromAmount = $("#sourceAmount").val();
	
	strData[ '$fromCCY' ] = fromCCy;
	strData[ '$toCCy' ] = toCCY;
	strData[ '$fromAmount' ] = fromAmount;
	strData[ csrfTokenName ] = csrfTokenValue;

	$.ajax(
	{
		cache : false,
		data : strData,
		dataType : 'json',
		success : function( response )
		{
			if(typeof(response.TARGETAMOUNT) == "undefined")
			{
				document.getElementById( "targetAmount" ).value = 0.00 ;	
			}
			else
			{
				document.getElementById( "targetAmount" ).value = response.TARGETAMOUNT ;
			}
			
		},
		error : ajaxError,
		url : strUrl,
		type : 'POST'
	} );
	}
}

function createParticipatingAccountAutoCompletor(agreementRecKey)
{
	document.getElementById( "participatingAccountDiv" ).innerHTML = "";
	document.getElementById( "contraAccountDiv" ).innerHTML = "";
	var auto1 = Ext.create( 'Ext.ux.gcp.AutoCompleter',
	{
		xtype : 'AutoCompleter',
		fieldLabel : '',
		fieldCls : 'xn-form-text  xn-suggestion-box',
		itemId : 'participatingAccountItemId',
		cls : 'autoCmplete-field',
		width: 220,
		labelSeparator : '',
		margin: '-2 0 0 0',
		cfgUrl : 'services/userseek/sweepTxnParticipatingAccIdSeek.json',
		cfgQueryParamName : '$autofilter',
		cfgRecordCount : -1,
		tabIndex : 1,
		cfgSeekId : 'sweepTxnParticipatingAccIdSeek',
		cfgRootNode : 'd.preferences',
		cfgDataNode1 : 'GLID',
		cfgDataNode2 : 'CCY',
		emptyText : getLabel('searchByFromAccount','Search By Participating Account'),
		cfgStoreFields :
			[
				'GLID', 'CCY','ACCOUNTID','BANK','IBAN'
			],
		cfgExtraParams :
			[
				{
					key : '$filtercode1',
					value : agreementRecKey
				}
			],
		listeners :
		{
			select : function( combo, record, index )
			{
				document.getElementById( "sourceGlId" ).value = record[ 0 ].data.GLID;
				document.getElementById( "sourceCcy" ).value = record[ 0 ].data.CCY;
				document.getElementById( "sourceAccountId" ).value = record[ 0 ].data.ACCOUNTID;
				document.getElementById( "sourceBank" ).value = record[ 0 ].data.BANK;
				document.getElementById( "sourceIban" ).value = record[ 0 ].data.IBAN;
				document.getElementById( "participatingAccountSpan" ).innerHTML = "("+record[ 0 ].data.CCY+")";
				resetContraAccountFields();
				createContraAccountAutoCompletor( agreementRecKey, record[ 0 ].data.ACCOUNTID);
				if(record[ 0 ].data.SYSBANKFLAG == 'N')
				{
					document.getElementById("sourceAmount").readOnly=true;
					document.getElementById("sourceAmount").disabled=true;
					document.getElementById("targetAmount").readOnly=false;
					document.getElementById("targetAmount").disabled=false;
				}
			}
		}
	} );
	auto1.render( Ext.get( 'participatingAccountDiv' ) );
	auto1.setValue(document.getElementById( "sourceGlId" ).value);
}

function createContraAccountAutoCompletor(agreementRecKey,participatingAcountId)
{
	// in case of FLEXIBLE agreement(StructureType = 201 ) change the URL.
	var  strCfgUrl = (agreementStructureType != null && agreementStructureType == 201) ? 
					'services/userseek/sweepTxnContraAccFlexibleAgrIdSeek.json' :
					 'services/userseek/sweepTxnContraAccIdSeek.json';
	
	var strCfgSeekId = (agreementStructureType != null && agreementStructureType == 201) ?
			         'sweepTxnContraAccFlexibleAgrIdSeek' :'sweepTxnContraAccIdSeek';
	document.getElementById( "contraAccountDiv" ).innerHTML = "";
	var auto1 = Ext.create( 'Ext.ux.gcp.AutoCompleter',
	{
		xtype : 'AutoCompleter',
		fieldLabel : '',
		fieldCls : 'xn-form-text  xn-suggestion-box',
		itemId : 'contraAccountItemId',
		cls : 'autoCmplete-field',
		width: 220,
		labelSeparator : '',
		cfgUrl : strCfgUrl,
		cfgQueryParamName : '$autofilter',
		cfgRecordCount : -1,
		tabIndex : 2,
		cfgSeekId : strCfgSeekId,
		cfgRootNode : 'd.preferences',
		cfgDataNode1 : 'GLID',
		cfgDataNode2 : 'CCY',
		emptyText : getLabel('searchByCa','Search by Contra Account'),
		cfgStoreFields :
			[
				'GLID', 'CCY','ACCOUNTID','BANK','IBAN'
			],
		cfgExtraParams :
			[
				{
					key : '$filtercode1',
					value : agreementRecKey
				},
				{
					key : '$filtercode2',
					value : participatingAcountId
				}
			],
		listeners :
		{
			select : function( combo, record, index )
			{
				document.getElementById( "targetGlId" ).value = record[ 0 ].data.GLID;
				document.getElementById( "targetCcy" ).value = record[ 0 ].data.CCY;
				document.getElementById( "targetAccountId" ).value = record[ 0 ].data.ACCOUNTID;
				document.getElementById( "targetBank" ).value = record[ 0 ].data.BANK;
				document.getElementById( "targetIban" ).value = record[ 0 ].data.IBAN;
				document.getElementById( "contraAccountSpan" ).innerHTML = "("+record[ 0 ].data.CCY+")";
			}
		}
	} );
	auto1.render( Ext.get( 'contraAccountDiv' ) );
	auto1.setValue(document.getElementById( "targetGlId" ).value);
}
function doSimulationTxn(record)
{
	var simulationPopupGrid = null;
	$("#agreementSimulationView").removeClass("ui-helper-hidden autowidth");
	document.getElementById("agreementSimulationView").style.visibility = "visible";
	var strUrl = 'agreementSimulation.srvc?$viewState='+encodeURIComponent(record.get('viewState'))
	+ '&$agreementRecKey=' + record.get('agreementRecKey')+'&'+csrfTokenName+'='+csrfTokenValue;
	
	$.ajax( {
		type : 'POST',
		url : strUrl,
		dataType : 'json',
		contentType : "application/json",
		success : function( data )
		{
			CURRENCYTYPE = data.CURRENCYTYPE;
			STRUCTURETYPE = data.STRUCTURETYPE;
			$( '#CCYPopupVal' ).val(data.CCY);
			$( '#agreementSimulationMstBean\\.clientId' ).val(record.data.clientId);
			$( '#agreementSimulationMstBean\\.agreementRecKey' ).val(record.data.agreementRecKey);
			$( '#agreementSimulationMstBean\\.agreementCodes' ).val(record.data.agreementCode);
			$( '#agreementSimulationMstBean\\.structureType' ).val(record.data.structureType);
			$("#clientNameSP").text(getStringWithSpecialChars(record.data.clientDesc || ''));
			$("#clientNameSP").prop('title',getStringWithSpecialChars(record.data.clientDesc || ''));
			$("#agreementNameSP").text(record.data.agreementName || '');
			$("#agreementNameSP").prop('title',record.data.agreementName || '');
			$("#structureTypeSp").text(record.data.structureTypeDesc || '');
			$("#structureTypeSp").prop('title',record.data.structureTypeDesc || '');
			if((STRUCTURETYPE == "601") || (STRUCTURETYPE == "201") || (STRUCTURETYPE == "101" && CURRENCYTYPE == "S") )
			{
				$('#agreement_ccy').removeClass('ui-helper-hidden');
				$("#agreementCCY").text(data.CCY || '');
				$("#agreementCCY").prop('title',data.CCY || '');
			}
			simulationPopupGrid = simulationPopupDataGrid(data.DTL_LIST);		
			$( '#agreementSimulationView' ).dialog( {
				bgiframe : true,
				autoOpen : false,
				minHeight : 156,
				maxHeight : 550,
				width : '735px',
				resizable : true,
				title : getLabel('agreementSimulation', 'Agreement Simulation'),
				modal : true,
				open : function()
				{
					$('.applyNumeric').autoNumeric("init",
					{
						aSep: strGroupSeparator,
						aDec: strDecimalSeparator,
						mDec: strAmountMinFraction
					});					
				}
			} );					
			$( '#dialogMode' ).val( '1' );
			$( '#agreementSimulationView' ).dialog( 'open' );
		}
	} );
}
function simulationPopupDataGrid(data) {
	$('#agreementAccountDetailsGrid').empty();
	var store = createSimulationPopupGridStore(data);
	var grid = Ext.create('Ext.grid.Panel', {
				store : store,
				popup : true,
				columns : [{
							"xtype" : "rownumberer",
							dataIndex : 'rownumberer',
							text : getLabel("srNo","No."),
							"hidden" : false,
							"width" : 70,
							"resizable" : false,
							hideable : false,
							sortable : false,
							draggable : false
						}, {
							dataIndex : 'test',
							width : 48,
							draggable : false,
							resizable : false,
							sortable : false,
							hidden : ((STRUCTURETYPE == "601") && (data.masterAccount) == 'Y' ) ? false : true,
							renderer: function (value, metadata, data,rowIndex) {
								return "<span class='font_bold red' style='font-size: 12pt'> "+ '*' +" </span>";
							}
						}, {
							text : getLabel('accNo', 'Account Number'),
							dataIndex : 'account',
							width : 140,
							draggable : false,
							resizable : false,
							sortable : false,
							hideable : false
						}, {
							text : getLabel('accName', 'Account Name'),
							dataIndex : 'accDesc',
							width : 200,
							draggable : false,
							resizable : false,
							sortable : false,
							hideable : false
						}, {
							text : getLabel('accType', 'Account Type'),
							dataIndex : 'acctType',
							width : 160,
							draggable : false,
							resizable : false,
							sortable : false,
							hideable : false
						}, {
							text : getLabel('accCcy', 'Currency'),
							dataIndex : 'accCcy',
							width : 85,
							draggable : false,
							resizable : false,
							sortable : false,
							hidden : ((STRUCTURETYPE == "501") || (STRUCTURETYPE == "101" && CURRENCYTYPE == "M")) ? false : true
						}, {
							text : getLabel('accBalance', 'Account'),
							dataIndex : 'transactionAmount',
							width : 137,
							draggable : false,
							resizable : false,
							sortable : false,
							hideable : false,
							renderer: function (value, metadata, data,rowIndex) {
								var amt = (data.raw.transactionAmount * 1).toFixed(data.raw.amtPrcision);
							   return "<input id = 'agreementSimulationDtlBean["+ rowIndex +"].workBalance' type='number' Class='form-control amountBox applyNumeric' value= "+ amt +"  min = '0.0' maxlength = '21' onkeypress= 'javascript:OnKeyPressWorkingBalance("+rowIndex+");' onChange = 'javascript:OnChangeWorkingBalance("+ rowIndex +","+ data.raw.amtPrcision +");' style='height: 26px;'/>";
			            }},{
							dataIndex : 'accId',
							width : 0,
							draggable : false,
							resizable : false,
							sortable : false,
							hideable : true,
							renderer: function (value, metadata, data,rowIndex) {
							   return "<input type='hidden' id = 'agreementSimulationDtlBean["+ rowIndex +"].accId' name = 'agreementSimulationDtlBean["+ rowIndex +"].accId' 	value = "+ value +" />";
			            }},{
							dataIndex : 'workingBalance',
							width : 0,
							draggable : false,
							resizable : false,
							sortable : false,
							hideable : true,
							renderer: function (value, metadata, data,rowIndex) {
							   return "<input type='hidden' id = 'agreementSimulationDtlBean["+ rowIndex +"].workingBalance' name = 'agreementSimulationDtlBean["+ rowIndex +"].workingBalance' 	value = "+ value +" />";
			            }}],
			            width: 850,
						renderTo:'agreementAccountDetailsGrid',
						/*plugins: [
			        Ext.create('Ext.grid.plugin.CellEditing', {
			            clicksToEdit: 1
			        })
			    ]*/
			});
	return grid;
}
function createSimulationPopupGridStore(jsonData) {
	var myStore = Ext.create('Ext.data.Store', {
				fields : ['rownumberer','*','account', 'accDesc', 'acctType', 'accCcy', 'transactionAmount','accId','workingBalance'],
				data : jsonData,
				autoLoad : true
			});
	return myStore;
}
function closeSimulationPopup()
{
	$( '#agreementSimulationView' ).dialog( 'close' );
}
function submitSimulationTxn()
{
	$( '#agreementSimulationView' ).addClass('hidden');
	$( '#agreementSimulationView' ).appendTo( '#simulationfrm' );
	$( '#agreementSimulationView' ).dialog('close');
	var strUrl = "testRunSimulationTxn.srvc";
	var data = $("form[name=simulationfrm]").serialize();
	/*$('.applyNumeric').each(function(){
		$(this).val($(this).autoNumeric("get"));
	});
	var frm = document.forms["simulationfrm"];
	var data = $("form[name=simulationfrm]").serialize();
	frm.action = "testRunSimulationTxn.srvc";
	frm.target = "";
	frm.method = "POST";
	frm.submit();*/
	$.ajax({
    url: strUrl,
    type: "POST",
    data: data,
    success: function(tableData){
	viewSimulationResult(tableData);
  }
});
}
function viewSimulationResult( tableData )
{
	var errorMsg = tableData.ERRORMSG;
	if( errorMsg )
	{
		if( errorMsg.value != '' )
		{
			var id = document.getElementById("agerExecId");
			id.value = tableData.SIMULATIONID;
			var id1 = document.getElementById("errorMsg");
			id1.value = errorMsg;
			/*var id2 = document.getElementById("agreementSimulationMstBean.clientId");
			id2.value = tableData.agreementMstBean.agreementSimulationMstBean.clientId;
			var id3 = document.getElementById("agreementSimulationMstBean.agreementCodes");
			id3.value =tableData.agreementMstBean.agreementSimulationMstBean.agreementCodes;*/
			$( "#simulationErrorMsg" ).removeClass('ui-helper-hidden');
			if(errorMsg == 'Successful' || errorMsg == 'Failed')
			{
				if(errorMsg == 'Successful')
				{
					$("#errorMessage").text(getLabel('viewSimulationSuccessMsg', 'Success'));
					$("#errorMessage").prop('title',getLabel('viewSimulationSuccessMsg', 'Success'));
				}
				else
				{
					$("#errorMessage").text(getLabel('viewSimulationfailedMsg', 'Failed'));
					$("#errorMessage").prop('title',getLabel('viewSimulationfailedMsg', 'Failed'));
				}
				if(STRUCTURETYPE == '601')
				{
					$('#result601').removeClass('ui-helper-hidden');
				}
				else
				{
					$('#resultDiv').removeClass('ui-helper-hidden');
				}
			}
			else
			{
				$("#errorMessage").text(errorMsg);
				$("#errorMessage").prop('title',errorMsg);
			}
			$( '#simulationErrorMsg' ).dialog( {
				autoOpen : false,
				maxHeight: 550,
				minHeight:'auto',
				width : 400,
				modal : true,
				resizable: false,
				draggable: false,
				title : getLabel('msg', 'Message')          
			} );
			$( '#dialogMode' ).val( '1' );
			$( '#simulationErrorMsg' ).dialog( 'open' );
		}
	}
}
function OnChangeWorkingBalance(index,dr_decimal)
{
	var id = document.getElementById("agreementSimulationDtlBean["+index+"].workBalance");
	if( isNaN( parseFloat( id.value ) ) ) return false;
	id.value = parseFloat(id.value).toFixed(dr_decimal);
	var id2 = document.getElementById("agreementSimulationDtlBean["+index+"].workingBalance");
	id2.value = id.value;
}
function OnChangeTxnAmount(index,dr_decimal)
{
	var id = document.getElementById("agreementSimulationMstBean.transactionAmount");
	if( isNaN( parseFloat( id.value ) ) ) return false;
	id.value = parseFloat(id.value).toFixed(dr_decimal);
}
function OnKeyPressWorkingBalance(index)
{
	var id = document.getElementById("agreementSimulationDtlBean["+index+"].workBalance");
	if( isNaN( parseFloat( id.value ) ) && id.value != '-' )
	{
		id.value = "";
	}
	$(id).keypress(function (e) {
	     //if the letter is not digit then display error and don't type anything
	     if (e.which != 8 && e.which != 0 && e.which != 46 && e.which != 45 && (e.which < 48 || e.which > 57)) {
	        //display error message	        
	               return false;
	    }
	   });
}
function OnKeyPressTxnAmount(index)
{
	var id = document.getElementById("agreementSimulationMstBean.transactionAmount");
	if( isNaN( parseFloat( id.value ) ) && id.value != '-') 
		id.value = "";
	$(id).keypress(function (e) {
	     //if the letter is not digit then display error and don't type anything
	     if (e.which != 8 && e.which != 0 && e.which != 46 && e.which != 45 && (e.which < 48 || e.which > 57)) {
	        //display error message	        
	               return false;
	    }
	   });
}

function closeCancelPopup()
{
	hideErrorPanel('#messageContentCancelDiv');
	$( '#cancellationPopup' ).dialog( 'close' );
}
function doCancelTxn(record)
{
	document.getElementById("cancelFrmMain").reset();
	$("#errorDiv").empty();
	$('#messageContentCancelDiv').addClass('ui-helper-hidden');
	var objStructureTypeLbl =
	{
		'101' : getLabel( 'lblSweep', 'Sweep' ),
		'201' : getLabel( 'lblFlexible', 'Flexible' ),
		'501' : getLabel( 'lblHybrid', 'Hybrid' )
	};
	var strData = {};
	strData[ 'agreementRecKey' ] = record.get('agreementRecKey');
	strData[ csrfTokenName ] = csrfTokenValue;
	var evaluatedResponse;

	$.ajax(
	{
		cache : false,
		data : strData,
		dataType : 'json',
		success : function( response )
		{
			$('#nextScheduledExecution > option').remove();
			document.getElementById('nextScheduledExecution').options[0]=new Option('Select' ,'-1');
			evaluatedResponse = eval(response);
			for( var i = 0 ; i < evaluatedResponse.length ; i++ )
			{
				$('#nextScheduledExecution').append($('<option/>', { 
			        value: evaluatedResponse[i].filterCode,
			        text : evaluatedResponse[i].filterValue 
			    }));
			}//for
		},
		error : ajaxError,
		url : 'fetchAgreementSchedule.srvc',
		type : 'POST'
	} );
	
	var scheduleExecutionDate = record.get('scheduleExecutionDate').substr(0,10);	
	$("#cancelFrmMain input[name=viewState]").val(record.get('viewState'));
	$("#cancelFrmMain input[name=transactionType]").val(5);
	
	$( '#cancellationPopup' ).dialog(
	{
		autoOpen : false,
		minHeight : 156,
		maxHeight : 550,
		width : '735',
		modal : true,
		resizable : false,
		title : getLabel('cancelSchedule', 'Cancel Schedule'),				
		open: function()
			{
				$("#clientDescId").text(record.data.clientDesc || '');
				$("#clientDescId").prop('title',record.data.clientDesc || '');
				$("#agreementCodeDescId").text(record.data.agreementCode || '');
				$("#agreementCodeDescId").prop('title',record.data.agreementCode || '');
				$("#agreementNameId").text(record.data.agreementName || '');
				$("#agreementNameId").prop('title',record.data.agreementName || '');				
				$("#structureTypeSpId").text(record.data.structureTypeDesc || '');
				$("#structureTypeSpId").prop('title',record.data.structureTypeDesc || '');
				$("#nextExecutionDateDescId").text(scheduleExecutionDate || '');
				$("#nextExecutionDateDescId").prop('title', scheduleExecutionDate || '');
			}
	} );
	$( '#cancellationPopup' ).dialog( "open" );
}
function submitCancelTxn()
{
	var frm = document.forms["cancelFrmMain"];
	var txnRemarks;
	$("#cancelFrmMain input[name=agreementExeId]").val($('#nextScheduledExecution').val());
	$("#cancelFrmMain input[name=clientDesc]").val($('#clientDescId').val());
	$("#cancelFrmMain input[name=agreementCode]").val($('#agreementCodeDescId').val());
	$("#cancelFrmMain input[name=agreementName]").val($('#agreementNameId').val());
	$("#cancelFrmMain input[name=structureType]").val($('#structureTypeSpId').val());
	
	if( -1 == $('#nextScheduledExecution').val() )
	{
		var errorMsg = "Please select Next Scheduled Execution which need to be cancelled.";
		$('#messageContentCancelDiv').removeClass('ui-helper-hidden');
		$( "#cancelErrorDiv" ).text( errorMsg );
		return false;
	}
	if( !('EOD' == $('#nextScheduledExecution option:selected').text()) )
	{
		txnRemarks = $('#nextExecutionDateDescId').text() + ' ' +  $('#nextScheduledExecution option:selected').text();
		$("#cancelFrmMain input[name=transactionRemarks]").val(txnRemarks);	
	}
	else
	{		
		txnRemarks = $('#nextExecutionDateDescId').text() + ' 23:59:59';
		$("#cancelFrmMain input[name=transactionRemarks]").val(txnRemarks);	
	}
	
	frm.action = "submitCancellationTxn.srvc";
	frm.target = "";
	frm.method = "POST";
	frm.submit();
}
function OnKeyPressSourceAmount()
{
	var id = document.getElementById("sourceAmount");
	if( isNaN( parseFloat( id.value ) ) && id.value != '-' )
	{
		id.value = "";
	}
	$(id).keypress(function (e) {
	     //if the letter is not digit then display error and don't type anything
	     if (e.which != 8 && e.which != 0 && e.which != 46 && e.which != 45 && (e.which < 48 || e.which > 57)) {
	        //display error message	        
	               return false;
	    }
	   });
}
function validateSourceAmount(){
	var blnAutoNumeric = isAutoNumericApplied('sourceAmount');
	var fieldAmount ;
	if (blnAutoNumeric)
		fieldAmount = $("#sourceAmount").autoNumeric('get');
	else
		fieldAmount = $("#sourceAmount").val();
	
	$("#errorDiv").empty();
	if(fieldAmount != "")
	{
		var amount  ;	
		if (isNaN(parseFloat(fieldAmount))) {
			amount = "";
		} else {
			amount = parseFloat(fieldAmount);
		}
		if(amount < 1  ){		
					$('#messageContentDiv').removeClass('ui-helper-hidden');
					$( "#errorDiv" ).text( getLabel('lblAmountErrorMessage','From Amount should be greater than 0') );		
			return false;
		}
		return true	
	}
	return false
}
function isAutoNumericApplied(strId) {
	var isAutoNumericApplied = false;
	$.each(($('#'+strId).data('events')||[]), function(i, event) {
				if (isAutoNumericApplied === true)
					return false;
				$.each(event, function(i, eventHandler) {
							if (eventHandler.namespace === 'autoNumeric')
								isAutoNumericApplied = true;
							return false;
						});
			});
	return isAutoNumericApplied;
}
