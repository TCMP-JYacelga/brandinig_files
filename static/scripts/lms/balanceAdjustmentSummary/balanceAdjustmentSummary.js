var globalRecord = null ;
function addNewBalanceAdjustment()
{
	var frm = document.getElementById( "frmMain" );
	frm.action = "showBalanceAdjustmentEntryForm.srvc";
	frm.target = "";
	frm.method = "POST";
	frm.submit();
}
function editNotionalSpecialEditTxn(changeId)
{
	var frm = document.getElementById( "frmMain" );
	frm.action = "editBalanceAdjustmentTxn.srvc"+ '?' + csrfTokenName + '=' + csrfTokenValue + '&$changeId='
					+ changeId;
	frm.target = "";
	frm.method = "POST";
	frm.submit();
}
function ajaxError()
{
	alert( "AJAX error, please contact admin!" );
}
function submitBalanceAdjustmentEntry(frmId)
{
	var strUrl ;
	var frm = document.getElementById( frmId );
	strUrl = 'submitBalanceAdjustmentHeader.srvc'+ '?' + csrfTokenName + '=' + csrfTokenValue + '&$viewState='
	+ encodeURIComponent( document.getElementById( 'viewState' ).value);
	frm.action = strUrl;
	frm.target = "";
	frm.method = "POST";
	frm.submit();
}
function saveBalanceAdjustmentEntry( frmId )
{
	var strUrl;
	var errorMessage = null;
	var frm = document.getElementById( frmId );
	if(pageMode == 'ADD')
	{
		strUrl = 'saveBalanceAdjustmentHeader.srvc';
	}
	else
	{
		strUrl = 'updateBalanceAdjustmentHeader.srvc'+ '?' + csrfTokenName + '=' + csrfTokenValue + '&$viewState='
		+ encodeURIComponent( document.getElementById( 'viewState' ).value);
	}
	//var detailGrid = this.GCP.getApplication().controllers.items[ 0 ].getBalanceAdjustmentDetailGridView();
	var detailGrid  = objbalanceAdjustmentDtlView.items.items[1];
	if(detailGrid != undefined)
	{
		var detailRecords = detailGrid.store.data.items;
		for( var index = 0 ; index < detailRecords.length ; index++ )
		{
			errorMessage = checkMandatoryData(detailRecords[ index ]);
			if(errorMessage != null)
			{
				break;
			}
			frm.appendChild( createFormField( 'INPUT', 'HIDDEN',
				'notionalSpecialEditDtlBean[' + index + '].nodeId', detailRecords[ index ].data.nodeId ) );
			frm.appendChild( createFormField( 'INPUT', 'HIDDEN', 'notionalSpecialEditDtlBean[' + index + '].fromDate',
				detailRecords[ index ].data.fromDate ) );
			frm.appendChild( createFormField( 'INPUT', 'HIDDEN', 'notionalSpecialEditDtlBean[' + index + '].toDate',
					detailRecords[ index ].data.toDate ) );
			frm.appendChild( createFormField( 'INPUT', 'HIDDEN', 'notionalSpecialEditDtlBean[' + index + '].balanceDelta',
					detailRecords[ index ].data.balanceDelta ) );
		}
	}
	frm.action = strUrl;
	frm.target = "";
	frm.method = "POST";
	if(errorMessage == null)
	{
		frm.submit();
	}
	else
	{
		Ext.MessageBox.show(
				{
					title : getLabel('errorlbl', 'Error'),
					msg : errorMessage,
					buttons : Ext.MessageBox.OK,
					icon : Ext.MessageBox.ERROR
				} );
	}
}
function checkMandatoryData(dataObject)
{
	var effectiveFromDate = document.getElementsByName( "effectiveFromDate" )[0].value;
	var effectiveToDate = document.getElementsByName( "effectiveToDate" )[0].value;
	var effectiveFromDateObj = Date.parse( Ext.util.Format.date(effectiveFromDate,extJsDateFormat));
	var effectiveToDateObj = Date.parse( Ext.util.Format.date(effectiveToDate,extJsDateFormat));
	var  fromDateObj = Date.parse( Ext.util.Format.date(dataObject.data.fromDate,extJsDateFormat));
	var toDateObj = Date.parse(Ext.util.Format.date(dataObject.data.toDate,extJsDateFormat));
	if(dataObject.data.nodeId == null || dataObject.data.nodeId == '')
	{
		return 'Account is Required' ;
	}
	else if(dataObject.data.fromDate == null || dataObject.data.fromDate == '')
	{
		return 'From Date is Required' ;
	}
	else if(dataObject.data.toDate == null || dataObject.data.toDate == '')
	{
		return 'To Date is Required' ;
	}
	else if(dataObject.data.balanceDelta == null || dataObject.data.balanceDelta == '')
	{
		return 'Balance is Required' ;
	}
	else if (fromDateObj > toDateObj) 
	{
		return 'From Date should be less than To Date For Account '+dataObject.data.accountName;
	}
	else if (fromDateObj < effectiveFromDateObj) 
	{
		return 'From Date cannot be less than Effective From Date For Account '+dataObject.data.accountName;
	}
	else if (toDateObj > effectiveToDateObj) 
	{
		return 'To Date cannot be greater than Effective To Date For Account '+dataObject.data.accountName;
	}
	else
	{
		return null;
	}
}
function viewBalanceAdjustment(changeId)
{
	var frm = document.getElementById( "frmMain" );
	frm.action = "viewBalanceAdjustmentTxn.srvc"+ '?' + csrfTokenName + '=' + csrfTokenValue + '&$changeId='
					+ changeId;
	frm.target = "";
	frm.method = "POST";
	frm.submit();
}
		
function goToHome(strUrl)
{
	var frm = document.getElementById( 'frmMain' );
	frm.action = strUrl;		
	frm.target = "";
	frm.method = "POST";
	frm.submit();
}
function warnBeforeCancel(strUrl) {
	var dirtyBit = $('#dirtyBit').val();
	if('1' == dirtyBit) {
		$('#confirmMsgPopup').dialog({
			autoOpen : false,
			maxHeight: 550,
			width : 400,
			modal : true
			/*buttons : {
				"Yes" : function() {
					var frm = document.forms["frmMain"];
					frm.action = strUrl;
					frm.target = "";
					frm.method = "POST";
					frm.submit();
				},
				"No" : function() {
					$(this).dialog("close");
				}
			}*/
		});
		$('#confirmMsgPopup').dialog("open");
		$('#cancelBackConfirmMsg').bind('click',function(){
			$('#confirmMsgPopup').dialog("close");
		});
		$('#doneBackConfirmMsgbutton').bind('click',function(){
			$('#confirmMsgPopup').dialog("close");
			var frm = document.forms["frmMain"];
			frm.action = strUrl;
			frm.target = "";
			frm.method = "POST";
			frm.submit();
		});
	}
	else {
		var frm = document.forms["frmMain"];
		frm.action = strUrl;
		frm.target = "";
		frm.method = "POST";
		frm.submit();
	}
}
function setDirtyBit()
{
	document.getElementById( "dirtyBit" ).value = '1';
}

function createAgreementAutoCompletor(clientCodeValue)
{
	document.getElementById( "agreementDiv" ).innerHTML = "";
	var auto1 = Ext.create( 'Ext.ux.gcp.AutoCompleter',
	{
		xtype : 'AutoCompleter',
		fieldLabel : '',
		fieldCls : 'xn-form-text w15 xn-suggestion-box',
		itemId : 'agreementCodeItemId',
		cls : 'autoCmplete-field',
		labelSeparator : '',
		cfgUrl : 'services/userseek/balanceAdjustmentAgreementEntryIdSeek.json',
		cfgQueryParamName : '$autofilter',
		cfgRecordCount : -1,
		cfgSeekId : 'balanceAdjustmentAgreementEntryIdSeek',
		cfgRootNode : 'd.preferences',
		cfgDataNode1 : 'DESCR',
		cfgDataNode2 : 'CODE',
		cfgStoreFields :
			[
				'CODE', 'DESCR','RECORD_KEY_NO','STRUCTURE_TYPE','STRUCTURE_SUBTYPE','NO_POST_STRUCTURE'
			],
		cfgExtraParams :
			[
				{
					key : '$filtercode1',
					value : clientCodeValue
				}
			],
		listeners :
		{
			select : function( combo, record, index )
			{
				document.getElementById( "agreementCode" ).value = record[ 0 ].data.CODE;
				document.getElementById( "agreementName" ).value = record[ 0 ].data.DESCR;
				document.getElementById( "agreementRecKey" ).value = record[ 0 ].data.RECORD_KEY_NO;
				document.getElementById( "structureType" ).value = record[ 0 ].data.STRUCTURE_TYPE;
				document.getElementById( "structureSubType" ).value = record[ 0 ].data.STRUCTURE_SUBTYPE;
				document.getElementById( "noPostStructure" ).value = record[ 0 ].data.NO_POST_STRUCTURE;
				setDirtyBit();
			}
		}
	} );
	auto1.render( Ext.get( 'agreementDiv' ) );
	auto1.setValue(document.getElementById( "agreementName" ).value);
}

function createSellerAutoCompletor()
{
	var auto1 = Ext.create( 'Ext.ux.gcp.AutoCompleter',
	{
		xtype : 'AutoCompleter',
		fieldLabel : '',
		itemId : 'sellerCodeItemId',
		cls : 'autoCmplete-field',
		labelSeparator : '',
		fieldCls : 'xn-form-text w16 xn-suggestion-box',
		cfgUrl : 'services/userseek/balanceAdjustmentSellerIdSeek.json',
		cfgQueryParamName : '$autofilter',
		cfgRecordCount : -1,
		cfgSeekId : 'balanceAdjustmentSellerIdSeek',
		cfgRootNode : 'd.preferences',
		cfgDataNode1 : 'DESCRIPTION',
		cfgDataNode2 : 'CODE',
		listeners :
		{
			select : function( combo, record, index )
			{
				document.getElementById( "sellerId" ).value = record[ 0 ].data.CODE;
				document.getElementById( "sellerDesc" ).value = record[ 0 ].data.DESCRIPTION;
				var sellerCodeValue = record[ 0 ].data.CODE;
				createClientCodeAutoCompletor( sellerCodeValue );
				setDirtyBit();
			}
		}
	} );
	auto1.setValue(document.getElementById( "sellerDesc" ).value);
	auto1.render( Ext.get( 'sellerIdDiv' ) );
}
function onSellerChange(seller)
{
	createClientCodeAutoCompletor( seller.value );
}
function createClientCodeAutoCompletor(sellerCodeValue)
{
	document.getElementById( "clientCodeDiv" ).innerHTML = "";
	var auto1 = Ext.create( 'Ext.ux.gcp.AutoCompleter',
	{
		xtype : 'AutoCompleter',
		fieldLabel : '',
		fieldCls : 'xn-form-text w15 xn-suggestion-box',
		itemId : 'clientCodeItemId',
		cls : 'autoCmplete-field',
		labelSeparator : '',
		cfgUrl : 'services/userseek/balanceAdjustmentClientIdSeek.json',
		cfgQueryParamName : '$autofilter',
		cfgRecordCount : -1,
		cfgSeekId : 'balanceAdjustmentClientIdSeek',
		cfgRootNode : 'd.preferences',
		cfgDataNode1 : 'DESCRIPTION',
		cfgKeyNode : 'CODE',
		cfgExtraParams :
		[
			{
				key : '$filtercode1',
				value : sellerCodeValue
			}
		],
		listeners :
		{
			select : function( combo, record, index )
			{
				document.getElementById( "clientId" ).value = record[ 0 ].data.CODE;
				document.getElementById( "clientDesc" ).value = record[ 0 ].data.DESCRIPTION;
				var clientCodeValue = record[ 0 ].data.CODE;
				createAgreementAutoCompletor( clientCodeValue );
				setDirtyBit();
			}
		}
	} );
	auto1.setValue(document.getElementById( "clientDesc" ).value);
	auto1.render( Ext.get( 'clientCodeDiv' ) );
}

function renderAutoCompleters()
{

	if( !Ext.Ajax )
	{
		// to get reference of Ext.Ajax until its loaded completely. 
		setTimeout( function()
		{
			renderAutoCompleters();
		}, 1000 );
	}
	else if( document.readyState === 'complete')
	{
		createClientCodeAutoCompletor(document.getElementById( "sellerId" ).value);
		createAgreementAutoCompletor(document.getElementById( "clientId" ).value);
		// following jquery to render complete page once the autocompleters are loaded.
		$( '#balanceAdjustmentEntryPageDiv' ).attr( "class", "block" );
	}
	else
	{
		setTimeout( function()
		{
			renderAutoCompleters();
		}, 1000 );
	}
}

function closePopup( dlgId )
{
	$( '#' + dlgId + '' ).dialog( "close" );
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
function getAccountSeekWindow(record)
{
	globalRecord = record ;
	document.getElementById( "accountName" ).value = "";
	document.getElementById( "nodeId" ).value = "";
	document.getElementById( "ccyCode" ).value = "";
	getHelp('accountName||ccyCode|nodeId|', balanceAccQryId,'notionalAccountId_seek_first.seek', 'clntparam:agreementRecKey',callerIdMasterAcc, 'notionalAccountId','','setAllAccountValue');
}

function setAllAccountValue()
{
	var accountName = document.getElementById( "accountName" ).value;
	globalRecord.set('accountName',document.getElementById( "accountName" ).value);
	globalRecord.set('nodeId',document.getElementById( "nodeId" ).value);
	globalRecord.set('ccyCode',document.getElementById( "ccyCode" ).value);
}
function getRecord(json,elementId,fptrCallback)
{		  
	var myJSONObject = JSON.parse(json);
    var inputIdArray = elementId.split("|");
    for(i=0; i<inputIdArray.length; i++)
	{
    	var field = inputIdArray[i];
    	if(document.getElementById(inputIdArray[i]) && myJSONObject.columns[i])
    	{
			var type = document.getElementById(inputIdArray[i]).type;
			if(type=='text'){
				document.getElementById(inputIdArray[i]).value=myJSONObject.columns[i].value;}
			else if (type == 'hidden') {
				document.getElementById(inputIdArray[i]).value=myJSONObject.columns[i].value;}
			else {
				document.getElementById(inputIdArray[i]).innerHTML=myJSONObject.columns[i].value;} 
    	}
	}    
    if( !isEmpty( fptrCallback ) && typeof window[ fptrCallback ] == 'function' )
		window[ fptrCallback ]( json, elementId );
}

function createExtJsFromDateField() {
	var fromdtValue = effectiveFromDateModel == null || effectiveFromDateModel == '' ? ''
			: effectiveFromDateModel;
	var fromdt = Ext.create('Ext.form.DateField', {
		name : 'effectiveFromDate',
		itemId : 'effectiveFromDate',
		format : extJsDateFormat,
		editable : false,
		width: 168,
		value : fromdtValue,
		listeners :
		{
			change: function ( datefield, newValue, oldValue, eOpts ){
				setDirtyBit();
			}
		}
	});
	fromdt.render(Ext.get('effectiveFromDateDiv'));
}

function createExtJsToDateField() {
	var todtValue = effectiveToDateModel != '' || effectiveToDateModel != null ? effectiveToDateModel
			: '';
	var todt = Ext.create('Ext.form.DateField', {
		name : 'effectiveToDate',
		itemId : 'effectiveToDate',
		format : extJsDateFormat,
		editable : false,
		width: 168,
		value : todtValue,
		listeners :
		{
			change: function ( datefield, newValue, oldValue, eOpts ){
				setDirtyBit();
			}
		}
	});
	todt.render(Ext.get('effectiveToDateDiv'));
}

function renderExtJsDateField()
{

	if( !Ext.Ajax )
	{
		// to get reference of Ext.Ajax until its loaded completely. 
		setTimeout( function()
		{
			renderExtJsDateField();
		}, 500 );
	}
	else if( document.readyState === 'complete') // to check the dom is completely loaded with framework
	{
			createExtJsFromDateField();
			createExtJsToDateField();
	}
	else{
		setTimeout( function()
		{
			renderExtJsDateField();
		}, 500 );
	}
}