function submitUrl( strUrl)
{
	var frm = document.forms["frmMain"]; 
	frm.action = strUrl;
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

function showList(strUrl)
{
	var frm = document.forms["frmMain"];
	frm.action = strUrl;
	frm.target = "";
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

function showAgreementTreePopup( agrTreeJson )
{
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

function saveRecordForHybrid()
{
	submitUrl("attachHybridAgreementDtl.form");
}

function updateHybridAgreement()
{
	if( isDefaultMasterAccSelect() )
	{
		var frm = document.forms[ "frmMain" ];
		var strUrl = 'updateHybridAgreement.form';
		frm.target = "";
		frm.action = strUrl;
		frm.method = "POST";
		frm.submit();
	}
}

function selectDetailHybridRecord(ctrl,index)
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
	var removeAgrmnt = document.getElementById( "removeAgrmnt" );
	if(document.getElementById("txtIndex").value.length > 0)
	{
		removeAgrmnt.disabled = false;
	}
	else
	{
		removeAgrmnt.disabled = true;
	}
}

function isValidHybridPriority( me , index) 
{
	if(! (~~Number(me.value)>0)  )
    {   
        showError( 'Please Enter Positive Integers Only!', null );
        me.value = document.getElementById("agreementDtlBean["+index+"].priority").defaultValue
                return false;
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
			loadOnDemand( response.ON_DEMAND_FLAG );
		},
		error : ajaxError,
		url : strUrl,
		type : 'POST'
	} );

}

function loadOnDemand( onDemandFlag )
{
	if(document.getElementById("allowOndemand"))
	{
		if( onDemandFlag == 'T')
		{
			document.getElementById("allowOndemand").disabled = false;
		}
		else
		{
			if( document.getElementById("allowOndemand") )
			{
				 document.getElementById("allowOndemand").checked = false;
			}
           document.getElementById("allowOndemand").disabled = true;
		}
	}
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
            else if( pageMode == 'ADD' )
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

function setDirtyBit()
{
	document.getElementById( "dirtyBit" ).value = '1';
}
function onNoPostStructureChange(me) {
	
		if(pageMode == 'ADD' || pageMode == 'EDIT') {	//first time in case of draft or EDIT with no instruction	
			
			if(! me.checked == true )
			{
				document.getElementById( 'liveDateLbl' ).style.visibility = "visible";		
				document.getElementById( 'liveDate' ).style.visibility = "visible";
				//document.getElementById("noPostStructure").value = "Y";
			}
			else
			{
				document.getElementById( 'liveDateLbl' ).style.visibility = "hidden";
				document.getElementById( 'liveDate' ).style.visibility = "hidden";
				//document.getElementById("noPostStructure").value = "N";
			}
			}
			else if (pageMode == 'VIEW') {
				
				if(! me.checked == true )
				{
					document.getElementById( 'liveDateLbl' ).style.visibility = "visible";
					document.getElementById( 'liveDate' ).style.visibility = "visible";
				}
			}
			else {
				document.getElementById( 'liveDateLbl' ).style.visibility = "hidden";
				document.getElementById( 'liveDate' ).style.visibility = "hidden";			
			}
	}

function downloadAgreementMst(reckeyNo) {
	
	var recordKeNo = document.getElementById('txtRecordKeyNo').value;
	var sellerIdSelected = document.getElementById('sellerId').value;
	//document.getElementById( "confirmPopup" ).style.visibility = "visible";
	if($('#dirtyBit').val()=="1" || recordKeNo == null ||  recordKeNo == '')
	{
		var dlg = $( '#confirmPopup' );
		dlg.dialog( {
			autoOpen : false,
			height : "auto",
			modal : true,
			width : 420,
			title : getLabel('message', 'Message')
		} );
		dlg.dialog( 'open' );
	}
	else {		
		
			var strUrl =  'services/agreementMst/printAgreement.srvc';				
				form = document.createElement('FORM');
				form.name = 'frmMain';
				form.id = 'frmMain';
				form.method = 'POST';
				form.appendChild(createFormField('INPUT', 'HIDDEN',
						csrfTokenName, tokenValue));
				form.appendChild(createFormField('INPUT', 'HIDDEN', 'recordKeyNo',
						recordKeNo));
				form.appendChild(createFormField('INPUT', 'HIDDEN', 'sellerId',
						sellerIdSelected));
				form.action = strUrl;
				document.body.appendChild(form);
				form.submit();
				document.body.removeChild(form);	
		}
}

function createFormField ( element, type, name, value ) {
	
	var inputField;
	inputField = document.createElement( element );
	inputField.type = type;
	inputField.name = name;
	inputField.value = value;
	return inputField;
}

