function goToPage( strUrl, frmId )
{
	var frm = document.getElementById( frmId );
	frm.action = strUrl;
	frm.target = "";
	frm.method = "POST";
	frm.submit();
}

function saveCodeMapMaster( frmId )
{
	var frm = document.getElementById( frmId );
//	processShowCodeMap();
	enableFields();

	if( pageMode == 'EDIT' )
	{
		strUrl = 'updateCodeMapMasterDetails.srvc';
	}
	else
	{
		strUrl = 'saveCodeMapMasterDetails.srvc';
	}
	strUrl = strUrl + "?" + "&" + csrfTokenName + "=" + csrfTokenValue;
	frm.action = strUrl;
	frm.target = "";
	frm.method = "POST";
	frm.submit();

}

function updateNextCodeMapMaster( frmId )
{
	var frm = document.getElementById( frmId );
//	processShowCodeMap();
	enableFields();
	strUrl = 'updateNextCodeMapMasterDetails.srvc';
	strUrl = strUrl + "?" + "&" + csrfTokenName + "=" + csrfTokenValue;
	frm.action = strUrl;
	frm.target = "";
	frm.method = "POST";
	frm.submit();

}
function enableFields()
{
	document.getElementById( 'codeMapDefaultValue' ).disabled = false;
	document.getElementById( 'codeMapOthersValue' ).disabled = false;
	document.getElementById( 'globalLocalFlag1' ).disabled = false;
	document.getElementById( 'globalLocalFlag2' ).disabled = false;
	
}

function goToMasterPage()
{
	var frm = document.createElement( "form" );

	if( isBankCodeMap == 'true')
	{
		strUrl = 'bankCodeMapCenter.srvc';
	}
	else
	{
		strUrl = 'clientCodeMapCenter.srvc';
	}
	strUrl = strUrl + "?" + "&" + csrfTokenName + "=" + csrfTokenValue;
	frm.action = strUrl;
	frm.target = "";
	frm.method = "POST";
	document.body.appendChild(frm);
	frm.submit();
}

function submitCodeMapMaster( frmId, strUrl )
{
	var frm = document.getElementById( frmId );
	processShowCodeMap();
	strUrl = strUrl + "?$viewState=" + encodeURIComponent( viewState ) + "&" + csrfTokenName + "=" + csrfTokenValue;
	frm.action = strUrl;
	frm.target = "";
	frm.method = "POST";
	frm.submit();
}

function getClientList( selectedSeller )
{
	
	if( !Ext.Ajax )
	{
		setTimeout( function()
		{
			getClientList( selectedSeller )
		}, 1000 );
	}
	else
	{
		if( selectedSeller != '-1' && isBankCodeMap == 'false' )
		{
			$( '#clientId > option' ).remove();
			eval( "document.getElementById('clientId').options[0]=" + "new Option('" + 'Select' + "','" + '' + "')" );

			var strUrl = 'getCodeMapClientList.srvc?' + csrfTokenName + "=" + csrfTokenValue + '&$sellerFilter='
				+ selectedSeller;
			Ext.Ajax.request(
			{
				url : strUrl,
				method : "POST",
				success : function( response )
				{
					loadClientList( Ext.decode( response.responseText ) );
				},
				failure : function( response )
				{
					console.log( 'Error Occured' );
				}
			} );
		}
	}
	
}

function loadClientList( clientList )
{
	var temp = clientList.entityCodeList;
	var opt;
	
	$( '#clientId > option' ).remove();
	if( temp.length == 0 ||  temp.length > 1)
	{
		eval( "document.getElementById('clientId').options[0]=" + "new Option('" + 'Select' + "','" + '' + "')" );
	}
	
	for( var i = 0 ; i < temp.length ; i++ )
	{
		opt = document.createElement("option");
        document.getElementById("clientId").options.add(opt);
    	opt.text = temp[ i ].filterValue;
        opt.value = temp[ i ].filterCode;
	}
}

// Logic to handle the Seller, Client Combo Box population depending upon entityType and isBankCodeMap 
function renderSellerClientCombo( isBankCodeMap, entityType, pageMode )
{
	if( entityType == 0 )
	{
		if( isBankCodeMap == 'true' )
		{
			$( '#codeMapClient' ).attr( "class", "hidden" );
			if( pageMode == 'ADD' )
			{
				$( '#clientId' ).attr( "class", "hidden" );
			}
			else
			{
				$( '#clientDesc' ).attr( "class", "hidden" );
			}
		}
	}
	else
	{
		$( '#codeMapEntitledSeller' ).attr( "class", "hidden" );
		if( pageMode == 'ADD' )
		{
			$( '#sellerId' ).attr( "class", "hidden" );
		}
		//document.getElementById( 'sellerId' ).disabled = true;
		else
		{
			$( '#sellerDesc' ).attr( "class", "hidden" );
		}
	}

}

function showVerifySubmit()
{
	var codeMapDefaultValRadio, codeMapOtherValRadio;
	isSubmitMode = 'Y';

	$( '#tab1' ).find( 'a' ).removeClass( 'active' );
	$( "#tab2" ).find( 'a' ).addClass( 'active' );

	$( '#codeMapDtlRightSubmitBtn' ).attr( "class", "block" );
	$( '#codeMapDtlRightBtn' ).attr( "class", "hidden" );
	$( '#codeMapDtlLowerRightSubmitBtn' ).attr( "class", "block" );
	$( '#codeMapDtlLowerRightBtn' ).attr( "class", "hidden" );

	$( '#codeMapCode' ).addClass( 'rounded w14 disabled' );
	$( '#codeMapDesc' ).addClass( 'rounded w14 disabled' );
	
	
	$( '#codeMapDefaultValue' ).addClass( 'rounded w14 disabled' );
	$( '#codeMapOthersValue' ).addClass( 'rounded w14 disabled' );

	document.getElementById( 'codeMapCode' ).disabled = true;
	document.getElementById( 'codeMapDesc' ).disabled = true;

	if( document.getElementById( 'sellerId' ))
	{
		$( '#sellerId' ).addClass( 'rounded w14 disabled' );
		document.getElementById( 'sellerId' ).disabled = true;
	}
	
	if( document.getElementById( 'clientId' ))
	{
		$( '#clientId' ).addClass( 'rounded w14 disabled' );
		document.getElementById( 'clientId' ).disabled = true;
	}
	
	document.getElementById( 'codeMapDefaultValue' ).disabled = true;
	document.getElementById( 'codeMapOthersValue' ).disabled = true;
	document.getElementById( 'codeMapCustOthersValue' ).disabled = true;

	disableRadioButtons();
	disableEnableAddRecord(isSubmitMode);

}

function processShowCodeMap()
{
	var codeMapOtherValRadio;

	$( '#tab1' ).find( 'a' ).addClass( 'active' );
	$( "#tab2" ).find( 'a' ).removeClass( 'active' );

	$( '#codeMapDtlRightSubmitBtn' ).attr( "class", "hidden" );
	$( '#codeMapDtlRightBtn' ).attr( "class", "block" );
	$( '#codeMapDtlLowerRightSubmitBtn' ).attr( "class", "hidden" );
	$( '#codeMapDtlLowerRightBtn' ).attr( "class", "block" );

	$( '#codeMapCode' ).removeClass( 'rounded w14 disabled' );
	$( '#codeMapDesc' ).removeClass( 'rounded w14 disabled' );
	
	$( '#codeMapDefaultValue' ).removeClass( 'rounded w14 disabled' );
	$( '#codeMapOthersValue' ).removeClass( 'rounded w14 disabled' );

	$( '#codeMapCode' ).addClass( 'rounded w14' );
	$( '#codeMapDesc' ).addClass( 'rounded w14' );
	
	
	$( '#codeMapDefaultValue' ).addClass( 'rounded w14' );
	$( '#codeMapOthersValue' ).addClass( 'rounded w14' );

	document.getElementById( 'codeMapCode' ).disabled = false;
	document.getElementById( 'codeMapDesc' ).disabled = false;

	if(document.getElementById( 'sellerId' ))
	{
		$( '#sellerId' ).removeClass( 'rounded w14 disabled' );
		$( '#sellerId' ).addClass( 'rounded w14' );
		document.getElementById( 'sellerId' ).disabled = false;
	}
	
	if(document.getElementById( 'clientId' ))
	{
		$( '#clientId' ).removeClass( 'rounded w14 disabled' );
		$( '#clientId' ).addClass( 'rounded w14' );
		document.getElementById( 'clientId' ).disabled = false;
	}	
		
	
	document.getElementById( 'codeMapDefaultValue' ).disabled = false;
	document.getElementById( 'codeMapOthersValue' ).disabled = false;
	document.getElementById( 'codeMapCustOthersValue' ).disabled = false;

	codeMapDefaultValRadio = document.forms[ 'codeMapMstNewForm' ].elements[ 'codeMapCustDefaultValue' ];
	for( var i = 0 ; i < codeMapDefaultValRadio.length ; i++ )
	{
		codeMapDefaultValRadio[ i ].disabled = false;
	}

}

function showCodeMapTab()
{
	isSubmitMode = 'N';
	processShowCodeMap();
	checkDefaultValueType();
	checkOtherValueType();
}

function disableRadioButtons()
{
	var codeMapDefaultValRadio, codeMapDefaultValRadio;

	codeMapDefaultValRadio = document.forms[ 'codeMapMstNewForm' ].elements[ 'codeMapCustDefaultValue' ];
	for( var i = 0 ; i < codeMapDefaultValRadio.length ; i++ )
	{
		codeMapDefaultValRadio[ i ].disabled = true;
	}
	
	codeMapDefaultValRadio = document.forms[ 'codeMapMstNewForm' ].elements[ 'globalLocalFlag' ];
	for( var i = 0 ; i < codeMapDefaultValRadio.length ; i++ )
	{
		codeMapDefaultValRadio[ i ].disabled = true;
	}
}

function custOtherValComboBoxpopulate( selectedOption )
{
	var flag = false;

	var selectOptions = document.getElementById( 'codeMapCustOthersValue' ).options;

	for( var i = 0 ; i < selectOptions.length ; i++ )
	{
		if( selectOptions[ i ].value == selectedOption )
		{
			document.getElementById( "codeMapCustOthersValue" ).selectedIndex = i;
			// following function call to render the Other Value TextBox
			checkOtherValueType();
			flag = true;
			break;
		}

	}

	if( flag == false )
	{
		document.getElementById( "codeMapCustOthersValue" ).selectedIndex = selectOptions.length - 1;
	}

}
