
/* New Inter Account Position*/
var todt ;
function onSellerChange(seller)
{
	createClientCodeAutoCompletor( seller.value );
	
	document.getElementById( "clientId" ).value = null ;
	document.getElementById( "agreementRecKey" ).value = null  ;
	document.getElementById( "accountId1" ).value = null ;
	document.getElementById( "accountId2" ).value = null ;
}

function createClientCodeAutoCompletor(sellerCodeValue)
{
if(entityType == '0')
{
	document.getElementById( "clientCodeDiv" ).innerHTML = "";
	var auto1 = Ext.create( 'Ext.ux.gcp.AutoCompleter',
	{
		xtype : 'AutoCompleter',
		matchFieldWidth : true,
		fieldLabel : '',
		fieldCls : 'xn-form-text xn-suggestion-box',
		itemId : 'clientCodeItemId',
		cls : 'autoCmplete-field',
		labelSeparator : '',
		height: 25,
		width: 200,
		cfgUrl : 'services/userseek/interAccountPositionClientSeek.json',
		cfgQueryParamName : '$autofilter',
		cfgRecordCount : -1,
		cfgSeekId : 'interAccountPositionClientSeek',
		cfgRootNode : 'd.preferences',
		cfgDataNode1 : 'DESCRIPTION',
		cfgDataNode2 : 'SHORTNAME',
		cfgKeyNode : 'CODE',
		cfgStoreFields :
			[
				'CODE','DESCRIPTION','SHORTNAME'
			],
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
				document.getElementById( "clientDescription" ).value = record[ 0 ].data.DESCRIPTION;
				var clientCodeValue = record[ 0 ].data.CODE;
				document.getElementById( "agreementRecKey" ).value = null  ;
				document.getElementById( "accountId1" ).value = null ;
				document.getElementById( "accountId2" ).value = null ;
				createAgreementAutoCompletor( clientCodeValue );
				
			},
			'change' : function( combo, record, index )
			{				
				if(combo.value == ''|| combo.value == null)
				{
				
					document.getElementById( "agreementCode" ).value = null;
					document.getElementById( "accountId1" ).value = null;
					document.getElementById( "agreementRecKey" ).value = null;
					document.getElementById( "accountId1" ).value = null;					
					document.getElementById( "clientId" ).value = null;					
					document.getElementById( "clientDescription" ).value = null;	
					document.getElementById( "clientCodeDiv" ).value = "";					
					createAgreementAutoCompletor( '' );	
					createAccount1AutoCompletor('');
					createAccount2AutoCompletor('');												
				}
			}
		}
	} );
	auto1.setValue(document.getElementById( "clientId" ).value);
	auto1.render( Ext.get( 'clientCodeDiv' ) );
	}
}
function onClientChange(client)
{
	document.getElementById( "clientDescription" ).value = ClienList[client.value];
	createAgreementAutoCompletor( client.value );
	
}
function createAgreementAutoCompletor(clientCodeValue)
{
	document.getElementById( "agreementDiv" ).innerHTML = "";
	var auto1 = Ext.create( 'Ext.ux.gcp.AutoCompleter',
	{
		xtype : 'AutoCompleter',
		matchFieldWidth : true,
		fieldLabel : '',
		itemId : 'sellerCodeItemId',
		cls : 'autoCmplete-field',
		height: 25,
		width: 200,
		labelSeparator : '',
		fieldCls : 'xn-form-text xn-suggestion-box',
		cfgUrl : 'services/userseek/interAccountPositionAgreementSeek.json',
		cfgQueryParamName : '$autofilter',
		cfgRecordCount : -1,
		cfgSeekId : 'interAccountPositionAgreementSeek',
		cfgRootNode : 'd.preferences',
		cfgDataNode1 : 'DESCRIPTION',
		cfgDataNode2 : 'CODE',
		cfgStoreFields :
			[
				'CODE', 'DESCRIPTION','RECORD_KEY_NO'
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
				document.getElementById( "agreementRecKey" ).value = record[ 0 ].data.RECORD_KEY_NO;
				document.getElementById( "agreementCode" ).value = record[ 0 ].data.CODE;
				document.getElementById( "agreementDescription" ).value = record[ 0 ].data.DESCRIPTION;
								
				var agreementRekKey = record[ 0 ].data.RECORD_KEY_NO ;
				document.getElementById( "accountId1" ).value = null ;
				document.getElementById( "accountId1" ).value = null ;
				createAccount1AutoCompletor(agreementRekKey);
				createAccount2AutoCompletor(agreementRekKey);
			},
			'change' : function( combo, record, index )
			{				
				if(combo.value == ''|| combo.value == null)
				{
					document.getElementById( "agreementCode" ).value = null;
					document.getElementById( "accountId1" ).value = null;
					document.getElementById( "agreementRecKey" ).value = null;
					document.getElementById( "accountId2" ).value = null;		
					createAccount1AutoCompletor('');
					createAccount2AutoCompletor('');
			
				}
			}
		}
	} );
	auto1.setValue('');
	auto1.setValue(document.getElementById( "agreementCode" ).value);
	auto1.render( Ext.get( 'agreementDiv' ) );
}
function createAccount1AutoCompletor(agreementRekKey)
{
	document.getElementById( "account1Div" ).innerHTML = "";
	var auto1 = Ext.create( 'Ext.ux.gcp.AutoCompleter',
	{
		xtype : 'AutoCompleter',
		fieldLabel : '',
		matchFieldWidth : true,
		itemId : 'companyItemId',
		cls : 'autoCmplete-field',
		labelSeparator : '',
		height: 25,
		width: 200,
		fieldCls : 'xn-form-text xn-suggestion-box',
		cfgUrl : 'services/userseek/interAccountPositionAccount1Seek.json',
		cfgQueryParamName : '$autofilter',
		cfgRecordCount : -1,
		cfgSeekId : 'interAccountPositionAccount1Seek',
		cfgRootNode : 'd.preferences',
		cfgDataNode1 : 'DESCRIPTION',
		cfgDataNode2 : 'CODE',
		cfgStoreFields :
			[
				'CODE', 'DESCRIPTION','ACCTID','CCYCODE'
			],
		cfgExtraParams :
			[
				{
					key : '$filtercode1',
					value : agreementRekKey
				}
			],
		listeners :
		{
			select : function( combo, record, index )
			{
				document.getElementById( "accountId1" ).value = record[ 0 ].data.ACCTID;
				document.getElementById( "accountId1" ).value = record[ 0 ].data.ACCTID;
				document.getElementById( "accountOneDescription" ).value = record[ 0 ].data.DESCRIPTION;
				var agreementRekKey = document.getElementById( "agreementRecKey" ).value ;
				document.getElementById( "accountId2" ).value = null ;
				createAccount2AutoCompletor(agreementRekKey,record[ 0 ].data.ACCTID);
			},
			'change' : function( combo, record, index )
			{				
				if(combo.value == ''|| combo.value == null)
				{
					document.getElementById( "accountId1" ).value = null;						
					document.getElementById( "accountId2" ).value = null;	
					document.getElementById( "accountOneDescription" ).value = null;
					createAccount2AutoCompletor('');			
				}
			}
		}
	} );
	auto1.setValue(document.getElementById( "accountId1" ).value);
	auto1.render( Ext.get( 'account1Div' ) );
}

function createAccount2AutoCompletor(agreementReckKey,account1)
{
	document.getElementById( "account2Div" ).innerHTML = "";
	var auto1 = Ext.create( 'Ext.ux.gcp.AutoCompleter',
	{
		xtype : 'AutoCompleter',
		fieldLabel : '',
		matchFieldWidth : true,
		itemId : 'accountItemId',
		cls : 'autoCmplete-field',
		labelSeparator : '',
		height: 25,
		width: 200,
		fieldCls : 'xn-form-text xn-suggestion-box',
		cfgUrl : 'services/userseek/interAccountPositionAccount2Seek.json',
		cfgQueryParamName : '$autofilter',
		cfgRecordCount : -1,
		cfgSeekId : 'interAccountPositionAccount2Seek',
		cfgRootNode : 'd.preferences',
		cfgDataNode1 : 'DESCRIPTION',
		cfgDataNode2 : 'CODE',
		cfgStoreFields :
			[
				'CODE', 'DESCRIPTION','ACCTID'
			],
		cfgExtraParams :
			[
				{
					key : '$filtercode1',
					value : agreementReckKey
				},
				{
					key : '$filtercode2',
					value : account1
				}
			],
		listeners :
		{
			select : function( combo, record, index )
			{
				document.getElementById( "accountId2" ).value = record[ 0 ].data.ACCTID;
				document.getElementById( "accountTwoDescription" ).value = record[ 0 ].data.DESCRIPTION;
			},
			'change' : function( combo, record, index )
			{				
				if(combo.value == ''|| combo.value == null)
				{
					document.getElementById( "accountId2" ).value = null;	
					document.getElementById( "accountTwoDescription" ).value = null;	
				}
			}
		}
	} );
	auto1.setValue(document.getElementById( "accountId2" ).value);
	auto1.render( Ext.get( 'account2Div' ) );
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
	else
	{
		createClientCodeAutoCompletor(seller);
		createAgreementAutoCompletor(clientId);
		createAccount1AutoCompletor('');
		createAccount2AutoCompletor('','');
		// following jquery to render complete page once the autocompleters are loaded.
		//$( '#interAccountPositionDiv' ).attr( "class", "block" );
	}
}
function renderExtJsDateField() {
	if (!Ext.Ajax) {
		// to get reference of Ext.Ajax until its loaded completely.
		setTimeout(function() {
			renderExtJsDateField();
		}, 500);
	} else {
		createExtJsFromDateField();
		createExtJsToDateField();
	}
}
function createExtJsFromDateField() {
	var fromdtValue = fromDateModel == null || fromDateModel == '' ? ''
			: fromDateModel;
	var fromdt = Ext.create('Ext.form.DateField', {
		name : 'fromDateDatePicker',
		itemId : 'fromDateDatePicker',
		format : extJsDateFormat,
		editable : false,
		width: 200,
		height: 24,
		fieldCls: 'ft-datepicker ui-datepicker-range-alignment is-datepick',
		hideTrigger: 'true',
		maxValue : dtApplicationDate,
		minValue : dtLmsRetentionDate,
		value : fromdtValue,		
		allowBlank : false,		
		listeners : {
			change : function(field, newValue, oldValue, eOpts) {
				document.getElementById("fromDate").value =  Ext.util.Format.date(newValue, extJsDateFormat);
			},
			select : function(field, value, eOpts) {
				var formattedDate=Ext.util.Format.date(value, extJsDateFormat);
				document.getElementById("fromDate").value = formattedDate;
				todt.setMinValue(formattedDate);
				if( Date.parse(value) > Date.parse(todt.getValue())){
					document.getElementById("toDate").value=formattedDate;
					todt.setValue(formattedDate);
				}
			}
		}
	});	
	fromdt.render(Ext.get('fromDateDiv'));
}

function createExtJsToDateField() {
	var todtValue = toDateModel != '' || toDateModel != null ? toDateModel : '';
	todt = Ext.create('Ext.form.DateField', {
		name : 'toDateDatePicker',
		itemId : 'toDateDatePicker',
		format : extJsDateFormat,
		editable : false,
		maxValue : dtApplicationDate,
		minValue : dtLmsRetentionDate,
		value : todtValue,
		width: 200,
		height: 24,
		fieldCls: 'ft-datepicker ui-datepicker-range-alignment is-datepick',
		hideTrigger: 'true',
		allowBlank : false,
		listeners : {
			change : function(field, newValue, oldValue, eOpts) {
				document.getElementById("toDate").value =  Ext.util.Format.date(newValue, extJsDateFormat);
			},
			select : function(field, value, eOpts) {
				document.getElementById("toDate").value =  Ext.util.Format.date(value, extJsDateFormat);
			}
		}
	});
	todt.render(Ext.get('toDateDiv'));
}

function validateData()
{
	var mandatoryFieldsArray = [];
	var emptyString = null ;
	var arrError = [];
	var fromDateValue = document.getElementById("fromDatePicker").value;
	var toDateValue = document.getElementById("fromDatePicker").value;
	
	mandatoryFieldsArray.push({id:"Financial Institution",value:seller});
	mandatoryFieldsArray.push({id:"Client Name",value:strClient});
	mandatoryFieldsArray.push({id:"Agreement Code",value:agreementRecKey});
	mandatoryFieldsArray.push({id:"Participating Account",value:accountId1});
	mandatoryFieldsArray.push({id:"Contra Account",value:accountId2});
	/*mandatoryFieldsArray.push({id:"From Date",value:document.getElementsByName("fromDate")[0].value});
	mandatoryFieldsArray.push({id:"To Date",value:document.getElementsByName( "toDate" )[0].value});*/
	
	for( var i = 0 ; i < mandatoryFieldsArray.length ; i++ )
	{
		var fieldValue = mandatoryFieldsArray[ i ].value;
		if( fieldValue == null || fieldValue.trim() == '' )
		{
			if(emptyString == null )
			{
				emptyString = mandatoryFieldsArray[i].id ;
			}
			else
			{
				emptyString = emptyString + ',' + mandatoryFieldsArray[i].id ;
			}
		}
	}
	if(emptyString != null)
		arrError.push({
			"errorCode" : "ERR",
			"errorMessage" : '"'+emptyString+'" fields are empty. '
		});
	
	
	if( Ext.isEmpty(fromDateValue) && Ext.isEmpty(toDateValue))
	{
		arrError.push({
			"errorCode" : "ERR",
			"errorMessage" : getLabel('fromDateToDateEmptyMsg', 'From Date and To Date fields are empty.')
		});
	}
	
	return arrError ;
}
function validateDate()
{
	var fromDateValue = document.getElementById("fromDatePicker").value;
	var toDateValue = document.getElementById("fromDatePicker").value;
	if( toDateValue != null && fromDateValue != null )
	{
		if( Date.parse( fromDateValue ) > Date.parse( toDateValue ) )
		{
			return true;
		}
	}
	else
	{
		return true;
	}
}
function assignData()
{
	clientId = strClient ;
	agreementRecKey = agreementRecKey ;
	accountId1 = accountId1;
	accountId2 = accountId2 ;
	if(document.getElementById("fromDatePicker") != null)
	{
		fromDate = document.getElementById("fromDatePicker").value ;
		toDate = document.getElementById( "fromDatePicker" ).value ;
	}
}
function doClearMessageSection() {
	$('#messageArea').empty();
	$('#messageArea, #messageContentDiv').addClass('hidden');
}

function validateDataForDownload(strUrl)
{
	var mandatoryString = null;
	var dateFlag = false;
	mandatoryString = validateData();
	document.getElementById( "fromDate" ).value = $.datepick.formatDate('mm/dd/yyyy',$.datepick.parseDate('yyyy-mm-dd', fromDate));
	document.getElementById( "toDate" ).value = $.datepick.formatDate('mm/dd/yyyy',$.datepick.parseDate('yyyy-mm-dd', toDate));
	strUrl = strUrl + "?" + csrfTokenName + "=" + csrfTokenValue;
	var frm = document.getElementById( "frmMain" );
	frm.action = strUrl;
	frm.target = "";
	frm.method = "POST";
	frm.submit();
}

function downloadInterAccountLedgerXls(strUrl)
{

		//document.getElementById( "sellerDesc" ).value = Ext.getCmp('entitledSellerIdItemId').rawValue;
		document.getElementById( "sellerDesc" ).value = seller;
		if(strClient == ''){
			document.getElementById( "clientId" ).value = clientId;
		}
		else{
			document.getElementById( "clientId" ).value = strClient;
			document.getElementById( "clientDescription" ).value = strClientDesc;
		}
		document.getElementById( "accountId1" ).value = accountId1;
		document.getElementById( "accountId2" ).value = accountId2;
		document.getElementById( "agreementRecKey" ).value = agreementRecKey;
		document.getElementById( "fromDate" ).value = $.datepick.formatDate('mm/dd/yyyy', $.datepick.parseDate('yyyy-mm-dd', fromDate));
		document.getElementById( "toDate" ).value = $.datepick.formatDate('mm/dd/yyyy', $.datepick.parseDate('yyyy-mm-dd', toDate));
		
		strUrl = strUrl + "?" + csrfTokenName + "=" + csrfTokenValue;
		var frm = document.getElementById( "frmMain" );
		frm.action = strUrl;
		frm.target = "";
		frm.method = "POST";
		frm.submit();
}

function getSelectText(me) 
{      
   var sel = document.getElementById(me);
   var i = sel.selectedIndex;
   var selected_text = sel.options[i].text;
   return selected_text;
}