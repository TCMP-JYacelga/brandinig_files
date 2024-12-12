var sellerCodeValue = null;
var accrualFreqType = null;
var settlementFreqType = null;
var globalStrUrl;
var globalTabId;
var globalRowIndex;
var strucSubTypeArray = new Array( "('"+getLabel("lms.notionalMst.net","Net")+"',1)", 
		"('"+getLabel("lms.notionalMst.gross","Gross")+"',2)", 
		"('"+getLabel("lms.notionalMst.debitGross","Debit Gross")+"',3)", 
		"('"+getLabel("lms.NotionalMst.creditGross","Credit Gross")+"',4)", 
		"('"+getLabel("lms.notionalMst.info","Info")+"',5)");
var strucSubTypeJsonArray = [{"filterCode":"Net","filterValue":"1"}, {"filterCode":"Gross","filterValue":"2"}, {"filterCode":"Debit Gross","filterValue":"3"},  {"filterCode":"Credit Gross","filterValue":"4"}];
var cponNoLiveFlag = null;

function showAddNewAgreement()
{
	var frm = document.getElementById( "frmMain" );
	frm.action = "showAgreementNotionalMstEntryForm.srvc";
	frm.target = "";
	frm.method = "POST";
	frm.submit();
}

function showAgreementNotionalTree( strUrl, record, rowIndex )
{
	var strData = {};
	var viewState = record.get( 'viewState' );
	if(viewState==undefined)
	{
		if(record.raw)
		{
			viewState =record.raw.viewState;
		}
	}
	strData[ '$viewState' ] = viewState; // temporary
	strData[ csrfTokenName ] = csrfTokenValue;

	$.ajax(
	{
		cache : false,
		data : strData,
		dataType : 'json',
		success : function(data)
		{
			if(null == data.AGREEMENT_NOTIONAL_ERROR_JSON)
				drawAgreementNotionalTree( data.AGREEMENT_NOTIONAL_TREE_JSON,csrfTokenName,csrfTokenValue,viewState,data.TREEVIEW_TITLE );
			else
			ajaxTreeError(data);
		},
		error : ajaxError,
		url : strUrl,
		type : 'POST'
	} );
}

function ajaxTreeError(data)
{
	var errMsg = "";
	//init data
	var json = JSON.parse(data.AGREEMENT_NOTIONAL_ERROR_JSON);
	
	Ext.MessageBox.show(
	{
		title : getLabel( 'filterPopupTitle', 'Error' ),
		msg : json.error,
		buttons : Ext.MessageBox.OK,
		icon : Ext.MessageBox.ERROR
	} );
}

function showSpecialEditPopup( record )
{
	$( '#specialEditPopup' ).dialog(
	{
		autoOpen : false,
		height : 'auto',
		width : '50%',
		modal : true,
		resizable : false,
		title : "Special Edit of : " + record.get( 'agreementCode' )
	} );
	document.getElementById( "specialEditViewState" ).value = record.get( 'viewState' );
	document.getElementById( "agreementStartDate" ).value = Ext.util.Format.date( record.get( 'startDate' ), strExtApplicationDateFormat );
	document.getElementById( "agreementEndDate" ).value = Ext.util.Format.date( record.get( 'endDate' ), strExtApplicationDateFormat );
	
	// following logic to open pop up by making fields empty.
	//document.getElementById( "editEffectDate" ).value = '';
	
	if( document.getElementById( "editEffectDate" ) )
	{
		document.getElementsByName( "editEffectDate" )[0].value = null;
	}
	document.getElementById( "specialEditRemarks" ).value = '';
	document.getElementById( "specialEditType" ).value = '';
	document.getElementById( "agreementCode" ).value = '';

	$( "#agreementCode" ).attr( "disabled", true );
	$( "#agreementCode" ).addClass( "disabled" );
	$( "#forwardValueChange" ).attr( "checked", false );
	$( "#structureSubTypeChange" ).attr( "checked", false );
	$( "#backValueChange" ).attr( "checked", true );
	$( '#errorMessageDiv' ).attr( "class", "hidden" );
	
	specialEditcheckBoxRender(document.getElementById("backValueChange"));
	
	$( '#specialEditPopup' ).dialog( "open" );
}

function createExtJsBVEffectiveDateField( minDate ) {
	var bvDate = Ext.Date.parse(dtApplicationDate, strExtApplicationDateFormat);
	bvDate.setDate(bvDate.getDate() - 1);
	var effectiveDt = Ext.create('Ext.form.DateField', {
		name : 'editEffectDate',
		itemId : 'editEffectDate',
		id : 'editEffectDate',
		format : strExtApplicationDateFormat,
		padding : '12 0 0 0',
		editable : false,		
		minValue : minDate,
		maxValue : bvDate,
		value : bvDate,		
		listeners :
		{
		}
	});
	//startdt.on('change', setDirtyBit());
	effectiveDt.render(Ext.get('editEffectDateDiv'));
}

function createExtJsFVEffectiveDateField( maxDate ) {
	var fvDate = Ext.Date.parse(dtApplicationDate, strExtApplicationDateFormat);
	fvDate.setDate(fvDate.getDate() + 1);
	var effectiveDt = Ext.create('Ext.form.DateField', {
		name : 'editEffectDate',
		itemId : 'editEffectDate',
		id : 'editEffectDate',
		format : strExtApplicationDateFormat,
		padding : '12 0 0 0',	
		editable : false,
		minValue : fvDate,
		maxValue : maxDate,
		value : fvDate,
		listeners : {}
	});
	//startdt.on('change', setDirtyBit());
	effectiveDt.render(Ext.get('editEffectDateDiv'));
}

function renderExtJsEffectiveDateField( specialEditType, dtDate )
{

	if( !Ext.Ajax )
	{
		// to get reference of Ext.Ajax until its loaded completely. 
		setTimeout( function()
		{
			renderExtJsEffectiveDateField( specialEditType, dtDate );
		}, 500 );
	}
	else
	{
		var effectDateObj = Ext.getCmp("editEffectDate");
		if( !Ext.isEmpty( effectDateObj ) )
		{
			effectDateObj.destroy();
		}
		
		if( specialEditType == 'BACK_VALUE' )
		{
			createExtJsBVEffectiveDateField( dtDate );
		}
		else if( specialEditType == 'FUTURE_VALUE' )
		{
			createExtJsFVEffectiveDateField( dtDate );
		}
		
	}
}

function showTree( data )
{
	drawAgreementNotionalTree( data.AGREEMENT_NOTIONAL_TREE_JSON );
}

function ajaxError()
{
	alert( "AJAX error, please contact admin!" );
}

function setAccrualFreqType()
{
	accrualFreqType = $( 'input[name="accrualFreqType"]:checked' ).val();
}

function setSettlementFreqType()
{
	settlementFreqType = $( 'input[name="settlementFreqType"]:checked' ).val();
}

function setSettlementFrequency()
{
	var accrualFreqDayPeriod = document.getElementById( "accrualFreqDayPeriod" ).value ;
	var settlementFreqTypeRadioRef = document.getElementsByName( "settlementFreqType" );
	var weekDayNmbr = document.getElementById( "accrualFreqWeekDayNmbr" ).value
	var monthDayNmbr = document.getElementById( "accrualFreqMonthDayNmbr" ).value
	var dayNmbr ;
	
	if( (accrualFreqType == 'D' &&  accrualFreqDayPeriod > 1) ||  !(accrualFreqType == 'D'))
	{
		if(accrualFreqType == 'D')
		{
			settlementFreqTypeRadioRef[ 0 ].checked = true;
		}
		else if(accrualFreqType == 'W')
		{
			settlementFreqTypeRadioRef[ 1 ].checked = true;
			dayNmbr = weekDayNmbr ;
		}
		else if(accrualFreqType == 'M')
		{
			settlementFreqTypeRadioRef[ 2 ].checked = true;
			dayNmbr = monthDayNmbr ;
		}
		setSettlementFreqType();
		setSettlementFreqParamRender( 'N' );
		if(dayNmbr != null)
		{
			setSettlementFrequencyDayNumbr();
		}
	}
}
function setSettlementFrequencyDayNumbr()
{
	var weekDayNmbr = document.getElementById( "accrualFreqWeekDayNmbr" ).value
	var monthDayNmbr = document.getElementById( "accrualFreqMonthDayNmbr" ).value
	if(accrualFreqType == 'W')
	{
		document.getElementById( "settlementFreqWeekDayNmbr" ).value = weekDayNmbr ;
		$( "#settlementFreqWeekDayNmbr" ).attr( "disabled", true );
		$( "#settlementFreqWeekDayNmbr" ).addClass( "disabled" );
	}
	else if(accrualFreqType == 'M')
	{
		document.getElementById( "settlementFreqMonthDayNmbr" ).value = monthDayNmbr ;
		$( "#settlementFreqMonthDayNmbr" ).attr( "disabled", true );
		$( "#settlementFreqMonthDayNmbr" ).addClass( "disabled" );
	}
}

function setAccrualFreqParamRender( onLoadFlag )
{
	// Following If statement will set default Accrual Frequency to EOM.
	if( accrualFlag == 'Y' && pageMode == 'ADD' && onLoadFlag == 'Y' )
	{
		var accrualFreqTypeRadioRef = document.getElementsByName( "accrualFreqType" );

		for( var i = 0 ; i < accrualFreqTypeRadioRef.length ; i++ )
		{
			if( accrualFreqTypeRadioRef[ i ].value == 'M' )
			{
				accrualFreqTypeRadioRef[ i ].checked = true;
				setAccrualFreqType();
			}
		}
	}

	if( accrualFreqType == 'D' )
	{
		$( "#accrualFreqDayPeriod" ).attr( "disabled", false );
		$( "#accrualFreqDayPeriod" ).removeClass( "disabled" );

		if( pageMode != 'ADD' && onLoadFlag == 'Y' )
		{
			document.getElementById( "accrualFreqDayPeriod" ).value = document.getElementById( "accrualFreqPeriod" ).value;
		}
		else
		{
			document.getElementById( "accrualFreqDayPeriod" ).value = '1';
			document.getElementById( "accrualFreqWeekPeriod" ).value = '';
			document.getElementById( "accrualFreqMonthPeriod" ).value = '';
		}
		if( ( pageMode == 'PRIOR_EDIT' || pageMode == 'VIEW' ) && onLoadFlag == 'Y' )
		{
			$( "#accrualFreqDayPeriod" ).attr( "disabled", true );
			$( "#accrualFreqDayPeriod" ).addClass( "disabled" );
		}

		$( "#accrualFreqWeekDayNmbr" ).attr( "disabled", true );
		$( "#accrualFreqWeekDayNmbr" ).addClass( "disabled" );

		$( "#accrualFreqWeekPeriod" ).attr( "disabled", true );
		$( "#accrualFreqWeekPeriod" ).addClass( "disabled" );

		$( "#accrualFreqMonthDayNmbr" ).attr( "disabled", true );
		$( "#accrualFreqMonthDayNmbr" ).addClass( "disabled" );

		$( "#accrualFreqMonthPeriod" ).attr( "disabled", true );
		$( "#accrualFreqMonthPeriod" ).addClass( "disabled" );
	}

	else if( accrualFreqType == 'W' )
	{

		$( "#accrualFreqWeekPeriod" ).attr( "disabled", false );
		$( "#accrualFreqWeekPeriod" ).removeClass( "disabled" );

		$( "#accrualFreqWeekDayNmbr" ).attr( "disabled", false );
		$( "#accrualFreqWeekDayNmbr" ).removeClass( "disabled" );

		if( pageMode != 'ADD' && onLoadFlag == 'Y' )
		{
			document.getElementById( "accrualFreqWeekPeriod" ).value = document.getElementById( "accrualFreqPeriod" ).value;
			document.getElementById( "accrualFreqWeekDayNmbr" ).value = document.getElementById( "accrualFreqDayNmbr" ).value;
		}
		else
		{
			document.getElementById( "accrualFreqWeekPeriod" ).value = '1';
			document.getElementById( "accrualFreqDayPeriod" ).value = '';
			document.getElementById( "accrualFreqMonthPeriod" ).value = '';
		}
		if( ( pageMode == 'PRIOR_EDIT' || pageMode == 'VIEW' ) && onLoadFlag == 'Y' )
		{
			$( "#accrualFreqWeekPeriod" ).attr( "disabled", true );
			$( "#accrualFreqWeekPeriod" ).addClass( "disabled" );

			$( "#accrualFreqWeekDayNmbr" ).attr( "disabled", true );
			$( "#accrualFreqWeekDayNmbr" ).addClass( "disabled" );
		}

		$( "#accrualFreqDayPeriod" ).attr( "disabled", true );
		$( "#accrualFreqDayPeriod" ).addClass( "disabled" );

		$( "#accrualFreqMonthDayNmbr" ).attr( "disabled", true );
		$( "#accrualFreqMonthDayNmbr" ).addClass( "disabled" );

		$( "#accrualFreqMonthPeriod" ).attr( "disabled", true );
		$( "#accrualFreqMonthPeriod" ).addClass( "disabled" );
	}
	else if( accrualFreqType == 'M' )
	{
		$( "#accrualFreqMonthDayNmbr" ).attr( "disabled", false );
		$( "#accrualFreqMonthDayNmbr" ).removeClass( "disabled" );

		$( "#accrualFreqMonthPeriod" ).attr( "disabled", false );
		$( "#accrualFreqMonthPeriod" ).removeClass( "disabled" );

		if( accrualFlag == 'Y' && pageMode == 'ADD' && onLoadFlag == 'Y' )
		{
			document.getElementById( "accrualFreqMonthPeriod" ).value = 1;
			document.getElementById( "accrualFreqMonthDayNmbr" ).value = -1;
		}
		else
		{
			document.getElementById( "accrualFreqMonthPeriod" ).value = '1';
			document.getElementById( "accrualFreqDayPeriod" ).value = '';
			document.getElementById( "accrualFreqWeekPeriod" ).value = '';
		}
		if( pageMode != 'ADD' && onLoadFlag == 'Y' )
		{
			document.getElementById( "accrualFreqMonthPeriod" ).value = document.getElementById( "accrualFreqPeriod" ).value;
			document.getElementById( "accrualFreqMonthDayNmbr" ).value = document.getElementById( "accrualFreqDayNmbr" ).value;
		}
		if( ( pageMode == 'PRIOR_EDIT' || pageMode == 'VIEW' ) && onLoadFlag == 'Y' )
		{
			$( "#accrualFreqMonthPeriod" ).attr( "disabled", true );
			$( "#accrualFreqMonthPeriod" ).addClass( "disabled" );

			$( "#accrualFreqMonthDayNmbr" ).attr( "disabled", true );
			$( "#accrualFreqMonthDayNmbr" ).addClass( "disabled" );
		}

		$( "#accrualFreqDayPeriod" ).attr( "disabled", true );
		$( "#accrualFreqDayPeriod" ).addClass( "disabled" );

		$( "#accrualFreqWeekDayNmbr" ).attr( "disabled", true );
		$( "#accrualFreqWeekDayNmbr" ).addClass( "disabled" );

		$( "#accrualFreqWeekPeriod" ).attr( "disabled", true );
		$( "#accrualFreqWeekPeriod" ).addClass( "disabled" );
	}
}

function setSettlementFreqParamRender( onLoadFlag )
{
	var oPageMode = pageMode;
	if( pageMode == 'ADD' && onLoadFlag == 'Y' && errFlag == 'true' )
	{
		pageMode = "ADD_ERR";		
	}

	// Following If statement will set default Settlement Frequency to EOM.
	if( pageMode == 'ADD' && onLoadFlag == 'Y' )
	{
		var settlementFreqTypeRadioRef = document.getElementsByName( "settlementFreqType" );

		for( var i = 0 ; i < settlementFreqTypeRadioRef.length ; i++ )
		{
			if( settlementFreqTypeRadioRef[ i ].value == 'M' )
			{
				settlementFreqTypeRadioRef[ i ].checked = true;
				setSettlementFreqType();
			}
		}
	}
	
	if( settlementFreqType == 'D' )
	{
		$( "#settlementFreqDayPeriod" ).attr( "disabled", false );
		$( "#settlementFreqDayPeriod" ).removeClass( "disabled" );

		if( pageMode != 'ADD' && onLoadFlag == 'Y' )
		{
			document.getElementById( "settlementFreqDayPeriod" ).value = document
				.getElementById( "settlementFreqPeriod" ).value;
		}
		else
		{
			document.getElementById( "settlementFreqDayPeriod" ).value = '1';
			document.getElementById( "settlementFreqWeekPeriod" ).value = '';
			document.getElementById( "settlementFreqMonthPeriod" ).value = '';
			document.getElementById( "settlementFreqWeekDayNmbr" ).value = '';
			document.getElementById( "settlementFreqMonthDayNmbr" ).value = '';
		}
		if( ( pageMode == 'PRIOR_EDIT' || pageMode == 'VIEW' ) && onLoadFlag == 'Y' )
		{
			$( "#settlementFreqDayPeriod" ).attr( "disabled", true );
			$( "#settlementFreqDayPeriod" ).addClass( "disabled" );
		}

		$( "#settlementFreqWeekPeriod" ).attr( "disabled", true );
		$( "#settlementFreqWeekPeriod" ).addClass( "disabled" );

		$( "#settlementFreqWeekDayNmbr" ).attr( "disabled", true );
		$( "#settlementFreqWeekDayNmbr" ).addClass( "disabled" );

		$( "#settlementFreqMonthPeriod" ).attr( "disabled", true );
		$( "#settlementFreqMonthPeriod" ).addClass( "disabled" );

		$( "#settlementFreqMonthDayNmbr" ).attr( "disabled", true );
		$( "#settlementFreqMonthDayNmbr" ).addClass( "disabled" );
	}
	else if( settlementFreqType == 'W' )
	{
		$( "#settlementFreqWeekPeriod" ).attr( "disabled", false );
		$( "#settlementFreqWeekPeriod" ).removeClass( "disabled" );

		$( "#settlementFreqWeekDayNmbr" ).attr( "disabled", false );
		$( "#settlementFreqWeekDayNmbr" ).removeClass( "disabled" );

		if( pageMode != 'ADD' && onLoadFlag == 'Y' )
		{
			document.getElementById( "settlementFreqWeekPeriod" ).value = document
				.getElementById( "settlementFreqPeriod" ).value;
			document.getElementById( "settlementFreqWeekDayNmbr" ).value = document
				.getElementById( "settlementFreqDayNmbr" ).value;
		}
		else
		{
			document.getElementById( "settlementFreqWeekPeriod" ).value = '1';
			document.getElementById( "settlementFreqDayPeriod" ).value = '';
			document.getElementById( "settlementFreqMonthPeriod" ).value = '';
			document.getElementById( "settlementFreqWeekDayNmbr" ).value = '';
			document.getElementById( "settlementFreqMonthDayNmbr" ).value = '';
		}
		if( ( pageMode == 'PRIOR_EDIT' || pageMode == 'VIEW' ) && onLoadFlag == 'Y' )
		{
			$( "#settlementFreqWeekPeriod" ).attr( "disabled", true );
			$( "#settlementFreqWeekPeriod" ).addClass( "disabled" );

			$( "#settlementFreqWeekDayNmbr" ).attr( "disabled", true );
			$( "#settlementFreqWeekDayNmbr" ).addClass( "disabled" );
		}

		$( "#settlementFreqDayPeriod" ).attr( "disabled", true );
		$( "#settlementFreqDayPeriod" ).addClass( "disabled" );

		$( "#settlementFreqMonthPeriod" ).attr( "disabled", true );
		$( "#settlementFreqMonthPeriod" ).addClass( "disabled" );

		$( "#settlementFreqMonthDayNmbr" ).attr( "disabled", true );
		$( "#settlementFreqMonthDayNmbr" ).addClass( "disabled" );
	}
	else if( settlementFreqType == 'M' )
	{
		$( "#settlementFreqMonthPeriod" ).attr( "disabled", false );
		$( "#settlementFreqMonthPeriod" ).removeClass( "disabled" );

		$( "#settlementFreqMonthDayNmbr" ).attr( "disabled", false );
		$( "#settlementFreqMonthDayNmbr" ).removeClass( "disabled" );
		
		
		if( accrualFlag == 'Y' && pageMode == 'ADD' && onLoadFlag == 'Y' )
		{
			document.getElementById( "accrualFreqMonthPeriod" ).value = 1;
			document.getElementById( "settlementFreqMonthDayNmbr" ).value = -1;
		}
		
		if( pageMode != 'ADD' && onLoadFlag == 'Y' )
		{
			document.getElementById( "settlementFreqMonthPeriod" ).value = document
				.getElementById( "settlementFreqPeriod" ).value;
			document.getElementById( "settlementFreqMonthDayNmbr" ).value = document
				.getElementById( "settlementFreqDayNmbr" ).value;
		}
		else
		{
			document.getElementById( "settlementFreqMonthPeriod" ).value = '1';
			document.getElementById( "settlementFreqDayPeriod" ).value = '';
			document.getElementById( "settlementFreqWeekPeriod" ).value = '';
			document.getElementById( "settlementFreqWeekDayNmbr" ).value = '';
			document.getElementById( "settlementFreqMonthDayNmbr" ).value = '';
		}
		if( ( pageMode == 'PRIOR_EDIT' || pageMode == 'VIEW' ) && onLoadFlag == 'Y' )
		{
			$( "#settlementFreqMonthPeriod" ).attr( "disabled", true );
			$( "#settlementFreqMonthPeriod" ).addClass( "disabled" );

			$( "#settlementFreqMonthDayNmbr" ).attr( "disabled", true );
			$( "#settlementFreqMonthDayNmbr" ).addClass( "disabled" );
		}

		$( "#settlementFreqDayPeriod" ).attr( "disabled", true );
		$( "#settlementFreqDayPeriod" ).addClass( "disabled" );

		$( "#settlementFreqWeekPeriod" ).attr( "disabled", true );
		$( "#settlementFreqWeekPeriod" ).addClass( "disabled" );

		$( "#settlementFreqWeekDayNmbr" ).attr( "disabled", true );
		$( "#settlementFreqWeekDayNmbr" ).addClass( "disabled" );
	}

	if(oPageMode != pageMode){
		pageMode = oPageMode
	}
	
}

function saveAgreementNotionalMaster( frmId )
{
	var frm = document.getElementById( frmId );
	var strUrl = null;

	assignAccrualSchedulingParams();
	assignSettlementSchedulingParams();

	if( pageMode == 'ADD' )
	{
		strUrl = 'saveAgreementNotionalMaster.srvc';
		strUrl = strUrl;
	}
	else
	{
		strUrl = 'updateAgreementNotionalMaster.srvc';
		strUrl = strUrl + "?$viewState=" + encodeURIComponent( viewState );
		enableFileldsToSave();
	}

	frm.action = strUrl;
	frm.target = "";
	frm.method = "POST";
	frm.submit();
}

function enableFileldsToSave()
{
	$( "#frmMain" ).find( 'input' ).addClass( "enabled" );
	$( "#frmMain" ).find( 'input' ).attr( "disabled", false );
	$( "#frmMain" ).find( 'select' ).addClass( "enabled" );
	$( "#frmMain" ).find( 'select' ).attr( "disabled", false );
}

function assignAccrualSchedulingParams()
{
	if( accrualFreqType == 'D' )
	{
		document.getElementById( "accrualFreqPeriod" ).value = document.getElementById( "accrualFreqDayPeriod" ).value;
		document.getElementById( "accrualFreqDayNmbr" ).value = "";
	}
	else if( accrualFreqType == 'W' )
	{
		document.getElementById( "accrualFreqPeriod" ).value = document.getElementById( "accrualFreqWeekPeriod" ).value;
		document.getElementById( "accrualFreqDayNmbr" ).value = document.getElementById( "accrualFreqWeekDayNmbr" ).value;
	}
	else if( accrualFreqType == 'M' )
	{
		document.getElementById( "accrualFreqPeriod" ).value = document.getElementById( "accrualFreqMonthPeriod" ).value;
		document.getElementById( "accrualFreqDayNmbr" ).value = document.getElementById( "accrualFreqMonthDayNmbr" ).value;
	}
}

function assignSettlementSchedulingParams()
{
	if( settlementFreqType == 'D' )
	{
		document.getElementById( "settlementFreqPeriod" ).value = document.getElementById( "settlementFreqDayPeriod" ).value;
		document.getElementById( "settlementFreqDayNmbr" ).value = "";
	}
	else if( settlementFreqType == 'W' )
	{
		document.getElementById( "settlementFreqPeriod" ).value = document.getElementById( "settlementFreqWeekPeriod" ).value;
		document.getElementById( "settlementFreqDayNmbr" ).value = document
			.getElementById( "settlementFreqWeekDayNmbr" ).value;
	}
	else if( settlementFreqType == 'M' )
	{
		document.getElementById( "settlementFreqPeriod" ).value = document.getElementById( "settlementFreqMonthPeriod" ).value;
		document.getElementById( "settlementFreqDayNmbr" ).value = document
			.getElementById( "settlementFreqMonthDayNmbr" ).value;
	}
}

function setDirtyBit()
{
	document.getElementById( "dirtyBit" ).value = '1';
}

function disableRadioButtons()
{
	var accrualFreqTypeRadio = null;
	var settlementFreqTypeRadio = null;

	accrualFreqTypeRadio = document.forms[ 'frmMain' ].elements[ 'accrualFreqType' ];
	settlementFreqTypeRadio = document.forms[ 'frmMain' ].elements[ 'settlementFreqType' ];
	for( var i = 0 ; i < accrualFreqTypeRadio.length ; i++ )
	{
		accrualFreqTypeRadio[ i ].disabled = true;
	}

	for( var i = 0 ; i < settlementFreqTypeRadio.length ; i++ )
	{
		settlementFreqTypeRadio[ i ].disabled = true;
	}
}

function structureTypeChange()
{
	var structureTypeVal = null;
	var structureSubTypeVal = null;

	structureTypeObj = document.getElementById( "structureType" );

	// Call to populate structureSubType
	populateStructureSubType( structureTypeObj );
	benefitAllocPopulate( structureTypeObj );
	populateNoPostStructure();
	//populateLoanTracking();//FTGCPBDB-4643
}

/* Code snipette for enable/disable of noPostStructure. */
function populateNoPostStructure()
{
	if( pageMode == 'VIEW' )
		return;
	var structureTypeVal = null;
	var structureSubTypeVal = null;

	structureTypeVal = document.getElementById( "structureType" ).value;
	structureSubTypeVal = document.getElementById( "structureSubType" ).value;
	
	if(pageMode != 'VIEW')
	{
		if( structureTypeVal != NotionalStructureType.Combination )
		{
			document.forms[ 'frmMain' ].elements[ 'noPostStructure' ].checked = false;
			document.forms[ 'frmMain' ].elements[ 'noPostStructure' ].disabled = true;

		}
		else if( structureTypeVal == NotionalStructureType.Combination && structureSubTypeVal == '5' )
		{
			document.forms[ 'frmMain' ].elements[ 'noPostStructure' ].checked = false;
			document.forms[ 'frmMain' ].elements[ 'noPostStructure' ].disabled = true;
		}
		else if( structureTypeVal == NotionalStructureType.Combination && structureSubTypeVal != '5' )
		{
			document.forms[ 'frmMain' ].elements[ 'noPostStructure' ].disabled = false;
		}
		onNoPostStructureChange(document.forms[ 'frmMain' ].elements[ 'noPostStructure' ]);
	}
}

/* Code snipette for enable/disable of loan tracking. */
function populateLoanTracking()
{
	var structureTypeVal = null;
	var structureSubTypeVal = null;

	structureTypeVal = document.getElementById( "structureType" ).value;
	structureSubTypeVal = document.getElementById( "structureSubType" ).value;

	if( structureTypeVal == NotionalStructureType.Combination && structureSubTypeVal == '1' )
	{
		if( ( pageMode == 'REGULAR_EDIT' && requestState < '3') || pageMode == 'ADD' )
			document.forms[ 'frmMain' ].elements[ 'loanTracking' ].disabled = false;
	}
	else
	{
		document.forms[ 'frmMain' ].elements[ 'loanTracking' ].checked = false;
		document.forms[ 'frmMain' ].elements[ 'loanTracking' ].disabled = true;
	}
}

/* Code added for the Benefit Allocation Method dropdown */
function benefitAllocPopulate( structureTypeObj )
{
	if( structureTypeObj.value == NotionalStructureType.Compensation && pageMode == 'ADD' )
	{
		document.forms[ 'frmMain' ].elements[ 'benefitAllocMethod' ].disabled = false;
		$( "#benefitAllocMethod" ).removeClass( "disabled" );
	}
	else
	{
		document.forms[ 'frmMain' ].elements[ 'benefitAllocMethod' ].disabled = true;
		$( "#benefitAllocMethod" ).addClass( "disabled" );
	}
}

//function to populate the structureSubType combobox options

function populateStructureSubType( structureTypeObj )
{
	var StrcSubTypeVal = document.getElementById("structureSubType").value;
	var optSelected = false;
	$('#structureSubType > option').remove();
	document.getElementById('structureSubType').options[0]=new Option('Select' ,'');
	if (structureTypeObj.value != "")
	{
		for (var i = 0; i < strucSubTypeJsonArray.length; i++)
		{
			var strucSubTypeOption = strucSubTypeJsonArray[i];
			if (i == 1 || i == 2 || i == 3)
			{
				if(structureTypeObj.value == NotionalStructureType.Combination)
				{
					opt = document.createElement("option");
		            opt.text = strucSubTypeOption.filterCode;
		            opt.value = strucSubTypeOption.filterValue;
		            document.getElementById("structureSubType").options.add(opt);
				}
			}
			else
			{
				opt = document.createElement("option");
	            opt.text = strucSubTypeOption.filterCode;
	            opt.value = strucSubTypeOption.filterValue;
	            document.getElementById("structureSubType").options.add(opt);
			}
            if( StrcSubTypeVal != '' && StrcSubTypeVal === opt.value )
            {
	            opt.selected = true;
            	optSelected = true;
            }
		}
		var length = $('#structureSubType > option').length;
		if (length > 0 &&  !optSelected) 
		{
			$('#structureSubType > option:eq(0)').attr('selected', 'selected');
		}
	}
}

function structureSubTypeChange( structureSubTypeVal )
{
	if( structureSubTypeVal == '5' )
	{
		$( '#agreementNotionalFormEntrySchedulingParams' ).attr( "class", "hidden" );
		$( '#accrualFrequncyDiv' ).attr( "class", "hidden" );
		$( '#settlementFrequencyDiv' ).attr( "class", "hidden" );
	}
	else
	{
		$( '#agreementNotionalFormEntrySchedulingParams' ).attr( "class", "block" );
		if( accrualFlag == 'Y' )
		{
			$( '#accrualFrequncyDiv' ).attr( "class", "block" );
		}
		$( '#settlementFrequencyDiv' ).attr( "class", "block" );
	}
	populateNoPostStructure();
	//populateLoanTracking();//FTGCPBDB-4643
}

function createCurrencyAutoCompletor()
{
	var auto1 = Ext.create( 'Ext.ux.gcp.AutoCompleter',
	{
		xtype : 'AutoCompleter',
		fieldLabel : '',
		fieldCls : 'xn-form-text w16 xn-suggestion-box',
		itemId : 'currencyCodeItemId',
		cls : 'autoCmplete-field',
		labelSeparator : '',
		cfgUrl : 'services/userseek/notionalAgreementMstCcySeek.json',
		cfgQueryParamName : '$autofilter',
		cfgRecordCount : -1,
		cfgSeekId : 'notionalAgreementMstCcySeek',
		cfgRootNode : 'd.preferences',
		cfgDataNode1 : 'CODE',
		cfgDataNode2 : 'DESCR',
		listeners :
		{
			select : function( combo, record, index )
			{
				document.getElementById( "poolCurrency" ).value = record[ 0 ].data.CODE;
				document.getElementById( "currencyDesc" ).value = record[ 0 ].data.CODE;
			}
		}
	} );
	auto1.render( Ext.get( 'currencyDiv' ) );
	auto1.setValue( document.getElementById( "currencyDesc" ).value );
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
		cfgUrl : 'services/userseek/notionalEntitledSellerIdSeek.json',
		cfgQueryParamName : '$autofilter',
		cfgRecordCount : -1,
		cfgSeekId : 'notionalEntitledSellerIdSeek',
		cfgRootNode : 'd.preferences',
		cfgDataNode1 : 'DESCRIPTION',
		cfgDataNode2 : 'CODE',
		listeners :
		{
			select : function( combo, record, index )
			{
				document.getElementById( "sellerId" ).value = record[ 0 ].data.CODE;
				document.getElementById( "sellerDesc" ).value = record[ 0 ].data.DESCRIPTION;
				sellerCodeValue = record[ 0 ].data.CODE;
				createClientCodeAutoCompletor( sellerCodeValue );
				getAccrualFlagValue( sellerCodeValue );
			}
		}
	} );
	auto1.setValue( document.getElementById( "sellerDesc" ).value );
	auto1.render( Ext.get( 'sellerIdDiv' ) );
}
function onSellerChange(seller)
{
	createClientCodeAutoCompletor( seller.value );
	getAccrualFlagValue( seller.value );
}
function createClientCodeAutoCompletor( sellerCodeValue )
{
	document.getElementById( "clientCodeDiv" ).innerHTML = "";
	var auto1 = Ext.create( 'Ext.ux.gcp.AutoCompleter',
	{
		xtype : 'AutoCompleter',
		fieldLabel : '',
		fieldCls : 'xn-form-text w16 xn-suggestion-box',
		itemId : 'clientCodeItemId',
		cls : 'autoCmplete-field',
		labelSeparator : '',
		cfgUrl : 'services/userseek/notionalClientIdSeek.json',
		cfgQueryParamName : '$autofilter',
		cfgRecordCount : -1,
		cfgSeekId : 'notionalClientIdSeek',
		cfgRootNode : 'd.preferences',
		cfgDataNode1 : 'DESCRIPTION',
		cfgKeyNode : 'CODE',
		cfgDataNode2 : 'SHORTNAME',
		cfgStoreFields :
		 [
			'CODE', 'DESCRIPTION','SHORTNAME'
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
				document.getElementById( "clientDesc" ).value = record[ 0 ].data.DESCRIPTION;
				setCponEnforceStructureType();
			}
		}
	} );
	auto1.setValue( document.getElementById( "clientDesc" ).value );
	auto1.render( Ext.get( 'clientCodeDiv' ) );
}

function setCponEnforceStructureType()
{
	var strData = {};
	var strUrl = 'getCponStructureTypeData.srvc';
	var clientId = document.getElementById( "clientId" ).value;
	
	strData[ '$clientId' ] = clientId;
	strData[ csrfTokenName ] = csrfTokenValue;

	$.ajax(
	{
		cache : false,
		data : strData,
		dataType : 'json',
		success : function( response )
		{
			loadStructureType( response.STRUCTURE_TYPE );
			loadNoPostStructure( response.NO_LIVE_STRUCTURE );
		},
		error : ajaxError,
		url : strUrl,
		type : 'POST'
	} );

}

function loadNoPostStructure( noLiveFlag )
{
	if( noLiveFlag == 'T')
	{
		$( '#td_snpLabel' ).attr( "class", "block" );
		$( '#td_liveDateLabel' ).attr( "class", "block" );
		$( '#liveDate' ).attr( "class", "block" );
		$( '#liveDate' ).addClass( "disabled" );
		$( '#noPostStructure1' ).attr( "class", "block" );
	}
	else
	{
		$( '#td_snpLabel' ).attr( "class", "hidden" );
		$( '#td_liveDateLabel' ).attr( "class", "hidden" );
		$( '#liveDate' ).attr( "class", "hidden" );
		$( '#noPostStructure1' ).attr( "class", "hidden" );
	}
}

function loadStructureType( cponList )
{
	var structureTypeVal = document.getElementById('structureType').value;
	var optSelected = false;
	$( '#structureType > option' ).remove();
	if( cponList.length >= 0 )
	{
		document.getElementById('structureType').options[0]=new Option('Select' ,'');
	}
	
	for( var i = 0 ; i < cponList.length ; i++ )
	{
        if( cponList[ i ].filterCode == 'COMBINATION' )
        {
        	opt = document.createElement("option");
            document.getElementById("structureType").options.add(opt);
            opt.text = getLabel("lms.notionalMst.combination","Combination");
            opt.value = "CB";
            
            if( structureTypeVal != '' && structureTypeVal == 'CB' )
            {
            	 opt.selected = true;
            	 optSelected = true;
            }
        }
        else if( cponList[ i ].filterCode == 'COMPENSATION' )
        {
        	opt = document.createElement("option");
            document.getElementById("structureType").options.add(opt);
            opt.text = getLabel("lms.notionalMst.compensation","Compensation");
            opt.value = "CP";
            
            if( structureTypeVal != '' && structureTypeVal == 'CP' )
            {
            	 opt.selected = true;
            	 optSelected = true;
            }
        }
        else if( cponList[ i ].filterCode == 'TIERENHANCE' )
        {
        	opt = document.createElement("option");
            document.getElementById("structureType").options.add(opt);
            opt.text = getLabel("lms.notionalMst.tierEnhancement","Tier Enhancement");
            opt.value = "TE";
            
            if( structureTypeVal != '' && structureTypeVal == 'TE' )
            {
            	 opt.selected = true;
            	 optSelected = true;
            }
        }
	}
	var length = $('#structureType > option').length;
	if (length > 1 &&  !optSelected) {
		$('#structureType > option:eq(1)').attr('selected', 'selected');
	}
	populateStructureSubType(document.getElementById("structureType"));
	populateNoPostStructure();
}



function getAccrualFlagValue( sellerValue )
{
	var strData = {};
	var strUrl = 'getAgreementNotionalSysParamFlag.srvc';

	strData[ '$sellerFilter' ] = sellerValue;
	strData[ csrfTokenName ] = csrfTokenValue;

	$.ajax(
	{
		cache : false,
		data : strData,
		dataType : 'json',
		success : function( response )
		{
			accrualFlag = response.accrual_flag;
			accrualFreqDivPopulate();
		},
		error : ajaxError,
		url : strUrl,
		type : 'POST'
	} );
}

function accrualFreqDivPopulate()
{
	// when structureSubType value is not INFO(5) then only make  accrualFrequncyDiv visible.
	if( accrualFlag == 'Y' && document.getElementById( "structureSubType" ).value != '5' )
	{
		$( '#accrualFrequncyDiv' ).attr( "class", "block" );
	}
	else
	{
		$( '#accrualFrequncyDiv' ).attr( "class", "hidden" );
	}
}

function specialEditClose( dlgId )
{
	$( '#' + dlgId + '' ).dialog( "close" );
}
function closePopup( dlgId )
{
	$( '#' + dlgId + '' ).dialog( "close" );
}
function specialEditClose()
{
	$( '#specialEditPopup' ).dialog( "close" );
}

function specialEditcheckBoxRender( objReference )
{
	if( $( objReference ).is( ':checked' ) )
	{
		// for back value change
		if( objReference.value == '2' )
		{
			$( '#structureSubTypeChange' ).attr( 'checked', false );
			$( '#forwardValueChange' ).attr( 'checked', false );

			$( "#agreementCode" ).attr( "disabled", true );
			$( "#agreementCode" ).addClass( "disabled" );
			$( "#changeEffectiveFrom" ).addClass("tdrequired");
			
			var agreementStartDateVal = document.getElementById("agreementStartDate").value;
			document.getElementById('editEffectDateDiv').innerHTML = "";
			renderExtJsEffectiveDateField( 'BACK_VALUE', agreementStartDateVal );
			$('#editEffectDateDivDummy').hide();
			$('#editEffectDateDiv').show();
			
		}
		// for structure subtype change
		else if( objReference.value == '1' )
		{
			$( '#backValueChange' ).attr( 'checked', false );
			$( "#agreementCode" ).attr( "disabled", false );
			$( "#agreementCode" ).removeClass( "disabled" );
			$( "#changeEffectiveFrom" ).removeClass("tdrequired");
			if( !$( document.getElementById( "forwardValueChange" ) ).is( ':checked' ) )
			{
				document.getElementsByName( "editEffectDate" )[0].value = "";
				document.getElementsByName("editEffectDate")[0].disabled = true;
				var effectDateObj = Ext.getCmp("editEffectDate");
				effectDateObj.setReadOnly(true);
				$( "#agreementCode" ).attr( "disabled", false );
				$( "#agreementCode" ).removeClass( "disabled" );
				$('#editEffectDateDivDummy').show();
				$('#editEffectDateDiv').hide();
			}
		}
		// for forward value change
		else if( objReference.value == '3' )
		{
			$( '#backValueChange' ).attr( 'checked', false );

			if( $( '#structureSubTypeChange' ).is( ':checked' ) )
			{
				$( "#agreementCode" ).attr( "disabled", false );
				$( "#agreementCode" ).removeClass( "disabled" );
			}
			else
			{
				$( "#agreementCode" ).attr( "disabled", true );
				$( "#agreementCode" ).addClass( "disabled" );
			}
			
			var agreementEndDateVal = document.getElementById("agreementEndDate").value;
			document.getElementById('editEffectDateDiv').innerHTML = "";
			renderExtJsEffectiveDateField( 'FUTURE_VALUE', agreementEndDateVal );
			$('#editEffectDateDivDummy').hide();
			$('#editEffectDateDiv').show();
		}
	}
	else if( $( objReference ).not( ':checked' ) )
	{
		if( objReference.value == '2' )
		{
			$( "#editEffectDate" ).attr( "disabled", true );
			$( "#editEffectDate" ).addClass( "disabled" );
			$( "#agreementCode" ).attr( "disabled", true );
			$( "#agreementCode" ).addClass( "disabled" );
		}
		if( objReference.value == '1' )
		{
			$( "#agreementCode" ).attr( "disabled", true );
			$( "#agreementCode" ).addClass( "disabled" );
		}
		if( objReference.value == '3' )
		{
			$( "#editEffectDate" ).attr( "disabled", true );
			$( "#editEffectDate" ).addClass( "disabled" );
			document.getElementsByName( "editEffectDate" )[0].value = "";
			document.getElementsByName("editEffectDate")[0].disabled = true;
			var effectDateObj = Ext.getCmp("editEffectDate");
			effectDateObj.setReadOnly(true);
			if( $( '#structureSubTypeChange' ).is( ':checked' ) )
			{
				$( "#agreementCode" ).attr( "disabled", false );
				$( "#agreementCode" ).removeClass( "disabled" );
				$('#editEffectDateDivDummy').show();
				$('#editEffectDateDiv').hide();
			}
			else
			{
				$( "#agreementCode" ).attr( "disabled", true );
				$( "#agreementCode" ).addClass( "disabled" );
				$('#editEffectDateDivDummy').show();
				$('#editEffectDateDiv').hide();
			}
		}
	}
}

function specialEditSave()
{
	var editTypeFlag = true;
	var effectiveDateFlag = false;
	var remarksFlag = false;
	var editType = null;

	if( $( document.getElementById( "backValueChange" ) ).is( ':checked' ) )
	{
		editTypeFlag = false;
		editType = document.getElementById( "backValueChange" ).value;
		if( document.getElementsByName( "editEffectDate" )[0].value == "" )
		{
			effectiveDateFlag = true;
		}
	}
	else if( $( document.getElementById( "forwardValueChange" ) ).is( ':checked' ) )
	{
		editTypeFlag = false;

		if( $( document.getElementById( "structureSubTypeChange" ) ).is( ':checked' ) )
		{
			editType = 4;
		}
		else
		{
			editType = document.getElementById( "forwardValueChange" ).value;
		}

		if( document.getElementsByName( "editEffectDate" )[0].value == "" )
		{
			effectiveDateFlag = true;
		}
	}
	else if( $( document.getElementById( "structureSubTypeChange" ) ).is( ':checked' ) )
	{
		editTypeFlag = false;

		if( $( document.getElementById( "forwardValueChange" ) ).is( ':checked' ) )
		{
			editType = 4;
		}
		else
		{
			editType = document.getElementById( "structureSubTypeChange" ).value;
		}
	}

	if( document.getElementById( "specialEditRemarks" ).value == "" )
	{
		remarksFlag = true;
	}

	if( editTypeFlag || effectiveDateFlag || remarksFlag )
	{
		$( '#errorMessageDiv' ).attr( "class", "block" );
	}
	else
	{
		$( '#errorMessageDiv' ).attr( "class", "hidden" );
		saveSpecialEditData( editType );
	}
}

function saveSpecialEditData( editType )
{
	var viewState = null;
	var editEffectDate = null;
	var specialEditRemarks = null;
	var strData = {};
	var strUrl = 'specialEditAgreementNotionalMaster.srvc';

	viewState = document.getElementById( "specialEditViewState" ).value;
	document.getElementById( "specialEditType" ).value = editType;

	strUrl = strUrl + "?$specialEditViewState=" + encodeURIComponent( viewState ) + "&" + csrfTokenName + "="
		+ csrfTokenValue;
	var frm = document.getElementById( "frmSpecialEdit" );

	frm.action = strUrl;
	frm.target = "";
	frm.method = "POST";
	frm.submit();
}
function onNoPostStructureChange(me, isLoad)
{
	if(! me.checked == true )
	{
		$( '#td_liveDateLabel' ).show();
		$( '#td_liveDateElement' ).show();
		$( '#liveDate' ).addClass( "disabled" );
		if(isLoad === "N")
	       $( '#liveDate' ).val(dtApplicationDate);
	}
	else
	{
		$( '#td_liveDateLabel' ).hide();
		$( '#td_liveDateElement' ).hide();
		$( '#liveDate' ).val('');
	}
}

function showTreeView( strUrl,record)
{
	var frm = document.forms["frmMain"]; 
	document.getElementById("viewState").value =  record.get( 'viewState' );
	frm.action = strUrl;
	frm.method = "POST";
	frm.submit();
}
function showAgreementTreePopup()
{
	var agrTreeJson = document.getElementById("agreementTreeJson");
	if( agrTreeJson )
	{
		if( agrTreeJson.value != '' )
		{
			$( '#AgreementTreeDialog' ).dialog( {
				autoOpen : false,
				width : 900,
				height : 500,
				title : getLabel('treeView', 'Tree View'),
				modal : true
			} );
			$( '#dialogMode' ).val( '1' );
			$( '#AgreementTreeDialog' ).dialog( 'open' );
			drawAgreementTree();
		}
	}
}
