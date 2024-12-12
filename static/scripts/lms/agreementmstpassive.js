function showList(strUrl)
{
	var frm = document.forms["frmMain"];
	frm.action = strUrl;
	frm.target = "";
	frm.method = "POST";
	frm.submit();	
}

function saveRecord(strUrl)
{
	var frm = document.forms["frmMain"];
	frm.action = strUrl;
	frm.target = "";
	frm.method = "POST";
	frm.submit();	
}
// Details
function addDetail(strUrl)
{
	var frm = document.forms["frmMain"]; 
	frm.action = strUrl;
	frm.method = "POST";
	frm.submit();
}
function removeRecord( strUrl, method )
{
	if( document.getElementById( "txtIndex" ).value == "" )
	{
		alert( "Select Atlease One Record" )
		return;
	}
	if( document.getElementById( "txtIndex" ).value.length >= 0 )
	{
		showAlert( strConfMessage, null, [ strUrl ], method );
	}
}
function deleteDetail(strUrl)
{
	var frm = document.forms["frmMain"];
	frm.action = strUrl;
	frm.method = "POST";
	frm.submit();
}
function viewDetailForm(strUrl, index)
{
	var frm = document.forms["frmMain"]; 
	document.getElementById("txtIndex").value = index;
	frm.action = strUrl;
	frm.method = "POST";
	frm.submit();
}

function editDetailForm(strUrl, index)
{
	var frm = document.forms["frmMain"]; 
	document.getElementById("txtIndex").value = index;
	frm.action = strUrl;
	frm.method = "POST";
	frm.submit();
}

function selectDetailRecord(ctrl,index)
{
	var strDetailIndex = document.getElementById("txtIndex").value;
	if (index.length < 2)
	{
		index = '0' + index;
	}
	var aPosition = strDetailIndex.indexOf(index);
	if (aPosition >= 0)
	{
		document.getElementById("txtIndex").value = strDetailIndex.replace(strDetailIndex.substring(aPosition, aPosition + 3),"");
	}
	else
	{
		document.getElementById("txtIndex").value = index+ ","+strDetailIndex ;
	}
	if (ctrl.className.indexOf("acceptlink") > -1)
	{
		ctrl.className = "linkbox acceptedlink";
	}
	else
	{
		ctrl.className = "linkbox acceptlink";
	}
	var removeInstr = document.getElementById( "removeInstr" );
	if(document.getElementById("txtIndex").value.length > 0)
	{
		removeInstr.disabled = false;
	}
	else
	{
		removeInstr.disabled = true;
	}
}

function getRecord( json, elementId, fptrCallback )
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
		window[ fptrCallback ]();
}  

function setfromaccdesc()
{
	var clntdesc="";
	var clntccy="";

	if(document.getElementById("fromAccDesc") && document.getElementById("fromAccCcy") )
	{
		if(document.getElementById("fromAccDesc").value != "")
			clntdesc = document.getElementById("fromAccDesc").value; 
		if(document.getElementById("fromAccCcy").value != "")
			clntccy =  ' ('.concat(document.getElementById("fromAccCcy").value).concat(')');
		if("" != clntdesc && "" != clntccy)
		document.getElementById("fromaccdescspan").innerHTML = clntdesc.concat(clntccy);
	}
}

function settoaccdesc()
{
	var clntdesc="";
	var clntccy="";

	if(document.getElementById("toAccDesc") && document.getElementById("toAccCcy") )
	{
		if(document.getElementById("toAccDesc").value != "")
			clntdesc = document.getElementById("toAccDesc").value; 
		if(document.getElementById("toAccCcy").value != "")
			clntccy =  ' ('.concat(document.getElementById("toAccCcy").value).concat(')');
			if("" != clntdesc && "" != clntccy)
			document.getElementById("toaccdescspan").innerHTML = clntdesc.concat(clntccy);
	}
}
function validateAgreement( strUrl )
{
	var frm = document.forms[ "frmMain" ];
	frm.action = strUrl;
	frm.target = "";
	frm.method = "POST";
	frm.submit();
}

function submitForAuthAgreement( strUrl )
{
	var frm = document.forms[ "frmMain" ];
	frm.action = strUrl;
	frm.target = "";
	frm.method = "POST";
	frm.submit();
}

function setDirtyBit()
{
	document.getElementById( "dirtyBit" ).value = '1';
}

function renderAutoCompleters () {
	
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
		if(pageMode == 'ADD') {
			createClientCodeAutoCompletor(document.getElementById( "sellerId" ).value);
		}
		else if( pageMode == 'EDIT') {
			
		}
		if (requestState == '0' || pageMode == 'ADD') {
			createExtJsStartDateField();
		}
		createExtJsEndDateField();
		// following jquery to render complete page once the autocompleters are loaded.
		$( '#agreementMstEntryPageDiv' ).attr( "class", "block" );
	}
}

function createClientCodeAutoCompletor( sellerCodeValue )
{
	document.getElementById( "clientCodeDiv" ).innerHTML = "";
	var auto1 = Ext.create( 'Ext.ux.gcp.AutoCompleter',
	{
		xtype : 'AutoCompleter',
		fieldLabel : '',
		itemId : 'clientCodeItemId',
		fieldCls : 'xn-form-text w14 xn-suggestion-box',
		labelSeparator : '',
		cfgUrl : 'services/userseek/sweepClientIdSeek.json',
		cfgQueryParamName : '$autofilter',
		cfgRecordCount : -1,
		cfgSeekId : 'sweepClientIdSeek',
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
				document.getElementById( "clientCode" ).value = record[ 0 ].data.CODE;
				document.getElementById( "clientDescription" ).value = record[ 0 ].data.DESCRIPTION;
				setCponEnforcedStructureType();
			}
		}
	} );
	auto1.setValue(document.getElementById( "clientDescription" ).value);
	auto1.render( Ext.get( 'clientCodeDiv' ) );
}


function setCponEnforcedStructureType()
{
	var strData = {};
	var strUrl = 'getCponEnforcedStructureType.srvc';
	var clientId = document.getElementById( "clientCode" ).value;
	
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
		},
		error : ajaxError,
		url : strUrl,
		type : 'POST'
	} );

}

function ajaxError()
{
	alert( "AJAX error, please contact admin!" );
}

function loadStructureType( cponList )
{
	var structureTypeVal = document.getElementById('structureType').value;

	$( '#structureType > option' ).remove();
	if( cponList.length == 0 ||  cponList.length > 1)
	{
		eval( "document.getElementById('structureType').options[0]=" + "new Option('" + 'Select' + "','" + '' + "')" );
	}
	
	for( var i = 0 ; i < cponList.length ; i++ )
	{
        if( cponList[ i ].filterCode == 'SWEEP' )
        {
        	opt = document.createElement("option");
            document.getElementById("structureType").options.add(opt);
            opt.text = "Sweep";
            opt.value = "101";
            
            if( structureTypeVal != '' && structureTypeVal == '101' )
            {
            	 opt.selected = true;
            }
            
        }
        else if( cponList[ i ].filterCode == 'FLEXIBLE' )
        {
        	opt = document.createElement("option");
            document.getElementById("structureType").options.add(opt);
            opt.text = "Flexible";
            opt.value = "201";
            
            if( structureTypeVal != '' && structureTypeVal == '201' )
            {
            	 opt.selected = true;
            }
            else if( pageMode == 'ADD' )
            {
            	opt.selected = true;
            }
        }
        else if( cponList[ i ].filterCode == 'HYBRID' )
        {
        	opt = document.createElement("option");
            document.getElementById("structureType").options.add(opt);
            opt.text = "Hybrid";
            opt.value = "501";
            
            if( structureTypeVal != '' && structureTypeVal == '501' )
            {
            	 opt.selected = true;
            }
        }
        else if( cponList[ i ].filterCode == 'PASSIVE' )
        {

        	opt = document.createElement("option");
            document.getElementById("structureType").options.add(opt);
            opt.text = "Passive";
            opt.value = "401";
            
            if( structureTypeVal != '' && structureTypeVal == '401' )
            {
            	 opt.selected = true;
            }
        }
	}
	
	opt = document.createElement("option");
    document.getElementById("structureType").options.add(opt);
    opt.text = "Passive";
    opt.value = "401";
    
    if( structureTypeVal != '' && structureTypeVal == '401' )
    {
    	 opt.selected = true;
    }
}