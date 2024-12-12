function createSellerAutoCompleter()     
{

	var auto1=Ext.create( 'Ext.ux.gcp.AutoCompleter' ,
	{
		xtype : 'AutoCompleter',
		fieldLabel : '',
		itemId :'sellerCodeItemId',
		cls : 'autoCmplete-field',
		labelSeparator : '',
		cfgUrl : 'services/userseek/AgreementFrequencydSellerIdSeek.json',
		cfgQueryParamName : '$autofilter',
		cfgRecordCount : -1,
		cfgSeekId : 'agreementScheduleEntitledSellerIdSeek',
		cfgRootNode : 'd.preferences',
		cfgDataNode1 : 'DESCRIPTION',
		cfgDataNode2 : 'CODE',
		listeners:
			{
			  select : function(combo,record,index)
			   {
				document.getElementById("sellerId").value=record[ 0 ].data.CODE;
				document.getElementById("sellerDesc").value = record[ 0 ].data.DESCRIPTION;
				
				createAgreementCodeAutoCompletor(document.getElementById("sellerCode").value)
			   }
			}
	     }		
	  );
	     auto1.setValue(document.getElementById( "sellerDesc" ).value);
	     auto1.render(Ext.get('sellerCodeDiv'));
	 }
  
  function createClientCodeAutoCompleter(sellerCodeValue)     
{
	document.getElementById("clientCodeDiv").innerHTML = "";
	var auto1=Ext.create( 'Ext.ux.gcp.AutoCompleter' ,
	{
		xtype : 'AutoCompleter',
		fieldLabel : '',
		itemId :'clientCodeItemId',
		cls : 'autoCmplete-field',
		labelSeparator : '',
		cfgUrl : 'services/userseek/AgreementFrequencyClientCodeSeek.json',
		cfgQueryParamName : '$autofilter',
		cfgRecordCount : -1,
		cfgSeekId : 'AgreementFrequencyClientCodeSeek',
		cfgRootNode : 'd.preferences',
		cfgDataNode1 : 'DESCRIPTION',
		cfgStoreFields :
			[
				'CODE', 'DESCRIPTION'
			],
		//cfgDataNode2 : 'CODE',
		cfgExtraParams :
			[
				{
					key : '$filtercode1',
					value : sellerCodeValue
				}
				//,
				//{
				//	key : '$filtercode2',
				//	value : clientCodeValue
				//}
			],
		listeners:
			{
			  select : function(combo,record,index)
			   {
				document.getElementById("clientCode").value=record[ 0 ].data.CODE;
				alert(record[ 0 ].data.CODE);
				document.getElementById("clientDesc").value = record[ 0 ].data.DESCRIPTION;				
				createAgreementCodeAutoCompletor(sellerCodeValue)
			   }
			}
	     }		
	  );
	     auto1.setValue(document.getElementById( "clientDesc" ).value);
	     auto1.render(Ext.get('clientCodeDiv'));
	 }
 function createAgreementCodeAutoCompletor(sellerCodeValue)
{
	
	var clientCodeValue ;
	document.getElementById("agreementCodeDiv").innerHTML = "";
	if(null!=document.getElementById("clientCode")){
	clientCodeValue = document.getElementById("clientCode").value;
	}
	if(null!=document.getElementById("sellerId")){
	sellerCodeValue = document.getElementById("sellerId").value;
	}
	
	var auto1 = Ext.create( 'Ext.ux.gcp.AutoCompleter',
	{
		xtype : 'AutoCompleter',
		fieldLabel : '',
		itemId : 'agreementCodeItemId',
		cls : 'autoCmplete-field',
		labelSeparator : '',
		cfgUrl : 'services/userseek/AgreementFrequencyAgreementCodeSeek.json',
		cfgQueryParamName : '$autofilter',
		cfgRecordCount : -1,
		cfgSeekId : 'AgreementFrequencyAgreementCodeSeek',
		cfgRootNode : 'd.preferences',
		cfgDataNode1 : 'CODE',
		cfgDataNode2 : 'DESCRIPTION',
		//cfgDataNode3 : 'AGREEMENTID',
		//cfgKeyNode : 'CODE',
		cfgExtraParams :
			[
				{
					key : '$filtercode1',
					value : sellerCodeValue
				}
				,
				{
				key : '$filtercode2',
					value : clientCodeValue
				}
			],
			cfgStoreFields :
				[
					'CODE', 'DESCRIPTION', 'AGREEMENTID'
				],
		listeners :
		{
			select : function( combo, record, index )
			{
				document.getElementById("agreementCode").value = record[ 0 ].data.CODE;
				document.getElementById("agreementName").value = record[ 0 ].data.DESCRIPTION;
				document.getElementById("agreementRecKey").value = record[ 0 ].data.AGREEMENTID;
				//document.getElementById("agreementRecKey").value = record[ 0 ].data.RECKEY;
			}
		}
	}
	);
	auto1.render(Ext.get('agreementCodeDiv'));
	auto1.setValue(document.getElementById( "agreementCode" ).value);
	auto1.setValue(document.getElementById( "agreementRecKey" ).value);
	auto1.setValue(document.getElementById( "agreementName" ).value);
	}
	function createBankReferenceAutocompleter()
    {
          document.getElementById("referenceTimeCodeDiv").innerHTML="";
           var auto1 = Ext.create( 'Ext.ux.gcp.AutoCompleter',
   {
             xtype : 'AutoCompleter',
		fieldLabel : '',
		itemId : 'bankReferenceTime',
		cls : 'autoCmplete-field',
		labelSeparator : '',
		cfgUrl : 'services/userseek/BankReferenceTimeCodeSeek.json',
		cfgQueryParamName : '$autofilter',
		cfgRecordCount : -1,
		cfgSeekId : 'BankReferenceTimeCodeSeek',
		cfgRootNode : 'd.preferences',
		cfgDataNode1 : 'CODE',
		cfgDataNode2 : 'DESCRIPTION',
		cfgKeyNode : 'FREQCODE',
		listeners:
		 {
			  select : function(combo,record,index)
			   {
				document.getElementById("bankFrequencyCode").value=record[ 0 ].data.FREQCODE;
				document.getElementById("frequencyCode").value=record[ 0 ].data.FREQCODE;
				document.getElementById("bankReferenceTimeDesc").value = record[ 0 ].data.DESCRIPTION;
				
				//createAgreementCodeAutoCompletor(document.getElementById("sellerCode").value)
			   }
			}
   });
       auto1.render(Ext.get('referenceTimeCodeDiv'));
	   auto1.setValue(document.getElementById( "frequencyCode" ).value);
	//auto1.setValue(document.getElementById( "agreementName" ).value);

}	
 function renderAutoCompleters()
 {
	 if(!Ext.Ajax)
		 {
		// to get reference of Ext.Ajax until its loaded completely. 
			setTimeout( function()
			{
				renderAutoCompleters();
			}, 1000 );
		 }
	 else
		 {
		 
			  createBankReferenceAutocompleter();
			   //createSellerAutoCompleter();
			   createAgreementCodeAutoCompletor( document.getElementById("sellerId").value);
			   createClientCodeAutoCompleter( document.getElementById("sellerId").value );
		       //createBankReferenceAutocompleter();
		       $( '#agreementSchedulePageDiv' ).attr( "class", "block" );
		 }
 }
 
 //what is the use.
 function getComputationSummary( strUrl )
 {
 	
 	strUrl = strUrl + "?&" + csrfTokenName + "=" + csrfTokenValue;
 	var frm = document.getElementById( "frmAgreementSchedule" );
 	
 	frm.action = strUrl;
 	frm.target = "";
 	frm.method = "POST";
 	frm.submit();
 }
 function saveAgreementFrequencySchedule(frmId)
 {
 var frm = document.getElementById( frmId );
	var strUrl = null;
	assignAccrualSchedulingParams();
if( pageMode == 'ADD' )
	{
		strUrl = 'saveAgreementFrequencySchedule.srvc';
		strUrl = strUrl+"?" + csrfTokenName + "=" + csrfTokenValue ;
	}
	else
	{
		strUrl = 'updateAgreementFrequencySchedule.srvc';
		strUrl = strUrl + "?$viewState=" + encodeURIComponent( viewState )+"&" + csrfTokenName + "=" + csrfTokenValue;
		enableFileldsToSave();
	}
		//strUrl = 'saveAgreementFrequencySchedule.srvc';
		//strUrl = strUrl;
	frm.action = strUrl;
	frm.target = "";
	frm.method = "POST";
	frm.submit();
 }
 function enableFileldsToSave()
{
	$("#frmMain").find('input').addClass("enabled");
	$("#frmMain").find('input').attr("disabled",false);
	$("#frmMain").find('select').addClass("enabled");
	$("#frmMain").find('select').attr("disabled",false);
}
function setAccrualFreqType()
{
	accrualFreqType = $( 'input[name="accrualFreqType"]:checked' ).val();
}
function setAccrualFreqParamRender( onLoadFlag )
{

	// Following If statement will set default Accrual Frequency to EOM.
	if( pageMode == 'ADD' && onLoadFlag == 'Y' )
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

		if(pageMode != 'ADD' && onLoadFlag == 'Y' )
		{
			document.getElementById( "accrualFreqDayPeriod" ).value = document.getElementById( "accrualFreqPeriod" ).value;
		}
		else
		{
			document.getElementById( "accrualFreqDayPeriod" ).value = '1';
			document.getElementById( "accrualFreqWeekPeriod" ).value = '';
			document.getElementById( "accrualFreqMonthPeriod" ).value = '';
		}
		if( (pageMode == 'PRIOR_EDIT' || pageMode == 'VIEW' )  && onLoadFlag == 'Y' )
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
		if( (pageMode == 'PRIOR_EDIT' || pageMode == 'VIEW' )  && onLoadFlag == 'Y' )
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

		if( pageMode == 'ADD' && onLoadFlag == 'Y' )
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
		if( (pageMode == 'PRIOR_EDIT' || pageMode == 'VIEW' )  && onLoadFlag == 'Y' )
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

function setDirtyBit()
{
	document.getElementById( "dirtyBit" ).value = '1';
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



