function submitAttachInterest()
{
	var strUrl="updateAndSubmitInterAccountParameterMst.srvc";
	document.getElementById( "txtRecordIndex" ).value = "1";
	var frm = document.forms["frmMain"];
	frm.target ="";
	frm.action = strUrl;
	frm.method = "POST";
	frm.submit();
}
function submitUrlByUpdateIndex( buttonPressed, strUrl, frmId )
{
	if( buttonPressed.className.startsWith( "imagelink grey" ) )
		return;

	if( document.getElementById( "updateIndex" ).value == "" )
	{
		alert( "Select Atlease One Record" )
		return;
	}
	document.getElementById( "txtRecordIndex" ).value = document
			.getElementById( "updateIndex" ).value;

	submitUrl( strUrl, frmId );
}

function submitUrl( strUrl, frmId ,index)
{
	document.getElementById( "txtRecordIndex" ).value = index;
	var frm = document.forms["frmMain"];
	frm.target ="";
	frm.action = strUrl;
	frm.method = "POST";
	frm.submit();
}
function getRejectRecord( me, rejTitle, rejMsg )
{
	var temp = document.getElementById( "btnReject" );
	if( temp.className.startsWith( "imagelink grey" ) )
		return;
	if( document.getElementById( "updateIndex" ).value == "" )
	{
		alert( "Select Atlease One Record" )
		return;
	}
	getRemarks( 230, rejTitle, rejMsg, [ document
			.getElementById( "updateIndex" ).value ], rejectRecord );
}

function rejectRecord(arrData, strRemarks)
{
	var frm = document.forms["frmMain"]; 

	if (strRemarks.length > 255)
	{
		alert("Reject Remarks Length Cannot Be Greater than 255 Characters!");	
		return false;
	}
	else
	{
		frm.rejectRemarks.value = strRemarks;
		document.getElementById("txtRecordIndex").value = arrData;
		frm.target = "";
		frm.action = "interAccountParameterReject.form";
		frm.method = 'POST';
		frm.submit();
	}
}

function acceptRecord( ctrl, status, index)
{
	var strAuthIndex = document.getElementById( "updateIndex" ).value;
	var strActionMap = document.getElementById( "actionmap" ).value;

	if( index.length < 2 )
	{
		index = '0' + index;
	}
	var aPosition = strAuthIndex.indexOf( index );
	var mapPosition;
	var strCurrentAction;
	var strDelimAction;
	var lenDelimAction;
	var strArrSplitAction;
	var strFinalBitmap = document.getElementById( "bitmapval" ).value;
	var lenLooplen;
	if( aPosition >= 0 )
	{
		document.getElementById( "updateIndex" ).value = strAuthIndex.replace(
				strAuthIndex.substring( aPosition, aPosition + 3 ), "" );
		mapPosition = strActionMap.indexOf( index + ":" );
		document.getElementById( "actionmap" ).value = strActionMap.replace(
				strActionMap.substring( mapPosition, mapPosition + 10 ), "" );
	}
	else
	{
		strCurrentAction = arrBatchInterAccParam[ status ];
		if( !strCurrentAction )
			strCurrentAction = "00000";
		document.getElementById( "actionmap" ).value = index + ":"
				+ strCurrentAction + ","
				+ document.getElementById( "actionmap" ).value;
		document.getElementById( "updateIndex" ).value = index + ","
				+ document.getElementById( "updateIndex" ).value;

	}

	if( ctrl.className.indexOf( "acceptlink" ) > -1 )
	{
		ctrl.className = "linkbox acceptedlink";
	}
	else
	{
		ctrl.className = "linkbox acceptlink";
	}

	// perform the operation of bitwise anding
	lenDelimAction = document.getElementById( "actionmap" ).value.length;
	if( lenDelimAction > 1 )
	{
		strDelimAction = document.getElementById( "actionmap" ).value;
		strDelimAction = strDelimAction.substring( 0, lenDelimAction - 1 );
		strArrSplitAction = strDelimAction.split( "," );
		for( var i = 0 ; i < strArrSplitAction.length ; i++ )
		{
			strArrSplitAction[ i ] = strArrSplitAction[ i ]
					.substring( strArrSplitAction[ i ].indexOf( ":" ) + 1 );
		}

		if( strArrSplitAction.length == 1 )
		{
			strFinalBitmap = strArrSplitAction[ 0 ];
		}
		else
		{
			lenLooplen = strArrSplitAction.length - 1;
			for( var j = 0 ; j < lenLooplen ; j++ )
			{
				if( j == 0 )
				{
					strFinalBitmap = performAnd( strArrSplitAction[ j ],
							strArrSplitAction[ j + 1 ] );
				}
				else
				{
					strFinalBitmap = performAnd( strFinalBitmap,
							strArrSplitAction[ j + 1 ] );
				}
			}
		}
		document.getElementById( "bitmapval" ).value = strFinalBitmap;
		refreshButtons();
	}
	else
	{
		strFinalBitmap = _strValidActions;
		document.getElementById( "bitmapval" ).value = strFinalBitmap;
		refreshButtons();
	}
}

function performAnd( validAction, currentAction )
{
	var strOut = "";
	var i = 0;
	if( validAction.length = currentAction.length )
	{
		for( i = 0 ; i < 5 ; i++ )
		{
			strOut = strOut
					+ ( ( validAction.charAt( i ) * 1 ) && ( currentAction
							.charAt( i ) * 1 ) );
		}
	}
	return strOut;
}

function refreshButtons()
{
	var strPopultedButtons = document.getElementById( "bitmapval" ).value;
	var strActionButtons;
	// DO THE ANDING WITH SERVER BITMAP
	strActionButtons = performAnd( strPopultedButtons, _strServerBitmap );
	var i = 0;
	if( strActionButtons.length > 0 )
	{
		for( i = 0 ; i < 5 ; i++ )
		{
			switch( i )
			{
				case 0:
					if( strActionButtons.charAt( i ) * 1 == 1 )
					{
						document.getElementById( "btnAuth" ).className = "imagelink black inline button-icon icon-button-accept font_bold";
					}
					else
					{
						document.getElementById( "btnAuth" ).className = "imagelink grey inline button-icon icon-button-accept-grey font-bold";
					}
					break;

				case 1:
					if( strActionButtons.charAt( i ) * 1 == 1 )
					{
						document.getElementById( "btnReject" ).className = "imagelink black button-icon icon-button-reject font_bold";
					}
					else
					{
						document.getElementById( "btnReject" ).className = "imagelink grey button-icon icon-button-reject-grey font-bold";
					}
					break;
				case 2:
					if( strActionButtons.charAt( i ) * 1 == 1 )
					{
						document.getElementById( "btnEnable" ).className = "imagelink black inline button-icon icon-button-enable font_bold";
					}
					else
					{
						document.getElementById( "btnEnable" ).className = "imagelink grey inline button-icon icon-button-enable-grey font-bold";
					}
					break;
				case 3:
					if( strActionButtons.charAt( i ) * 1 == 1 )
					{
						document.getElementById( "btnDisable" ).className = "imagelink black inline button-icon icon-button-disable font_bold";
					}
					else
					{
						document.getElementById( "btnDisable" ).className = "imagelink grey inline button-icon icon-button-disable-grey font-bold";
					}
					break;
				case 4:

					if( strActionButtons.charAt( i ) * 1 == 1 )
					{
						document.getElementById( "btnDiscard" ).className = "imagelink black button-icon icon-button-discard font_bold";
					}
					else
					{
						document.getElementById( "btnDiscard" ).className = "imagelink grey button-icon icon-button-discard-grey font-bold";
					}
					break;
			}
		}
	}
}

function setViewFlag( flagVal )
{
	document.getElementById( "viewPageFlag" ).value = flagVal;
}
function filter()
{
	var strUrl="interAccountParameterFilterList.form";
	var frm = document.forms["frmMain"];
	frm.target ="";
	frm.action = strUrl;
	frm.method = "POST";
	frm.submit();
}
function getRecord(json, elementId,fptrCallback)
{
    var myJSONObject = JSON.parse(json);
    var inputIdArray = elementId.split("|");
    for(i=0; i<inputIdArray.length; i++)
     {
	    var field = inputIdArray[i];
	    if(document.getElementById(inputIdArray[i]) && myJSONObject.columns[i])
	    {
	          var type = document.getElementById(inputIdArray[i]).type;
	          if(type=='text')
	          {
	               document.getElementById(inputIdArray[i]).value=myJSONObject.columns[i].value;
	          }
	          else if (type == 'hidden')
	          {
	               document.getElementById(inputIdArray[i]).value=myJSONObject.columns[i].value;
	          }
	          else
	          {
	               document.getElementById(inputIdArray[i]).innerHTML=myJSONObject.columns[i].value;
	          }
	    }
     }
    if( !isEmpty( fptrCallback ) && typeof window[ fptrCallback ] == 'function' )
		window[ fptrCallback ]( json, elementId );
}

function saveAttachInterest()
{
	var strUrl="lmsSaveLMSInterAccountParameter.srvc";
	document.getElementById( "txtRecordIndex" ).value = "1";
	var frm = document.forms["frmMain"];
	frm.target ="";
	frm.action = strUrl;
	frm.method = "POST";
	frm.submit();
}
function backURL()
{
	var strUrl="interAccountParameterListBack.form";
	var frm = document.forms["frmMain"];
	frm.target ="";
	frm.action = strUrl;
	frm.method = "POST";
	frm.submit();
}

function addFromtoToSlabsRow()
{
	var slabCount1Hidden = document.getElementById("slabCount1Hidden").value ;
	var tempSlabCount1Hidden =  parseInt(slabCount1Hidden,10) + 1  ;
	var slabBefore = parseInt(slabCount1Hidden,10) - 1  ;
	var testTable = document.getElementById("TestFromToToSlabsTable");
	var table = document.getElementById("FromToToSlabsTable").getElementsByTagName('tbody')[0];
	var rowCount = table.rows.length;
	var colCount = testTable.rows[0].cells.length;
	var toAmount = 0;
	if(parseInt(slabCount1Hidden,10)> 0 )
	{
		toAmount = $('input[id="interAccountParameterDetailBeans1['+slabBefore+'].toAmount"]').autoNumeric('get');
		var fromAmount = document.getElementById("interAccountParameterDetailBeans1["+slabBefore+"].fromAmount").value;
		if(parseInt(toAmount,10) <= 0 )
		{
			showError('Amount To cannot be Zero for Slab '+parseInt(slabCount1Hidden,10)+' !');
			return;
		}
		if(strAmountMinFraction > 0)
			toAmount = parseFloat(toAmount)+0.01 ;
		else
			toAmount = parseFloat(toAmount)+1 ;
	}
	var row = table.insertRow(rowCount);
	row.id = "interAccountParameterDetailBeans1["+slabCount1Hidden+"]";
	for(i=0; i<colCount; i++)
	{
	    var newcell = row.insertCell(i);
	    var innerString = testTable.rows[0].cells[i].innerHTML;
	    newcell.innerHTML = innerString;
	    if(i==0)
	    {
	    	newcell.style.textAlign = "center";
	    }
    	testTable.rows[0].cells[i].innerHTML = innerString;
	    testTable.rows[0].cells[i].innerHTML = replaceIndex("["+slabCount1Hidden+"]","["+tempSlabCount1Hidden+"]",testTable.rows[0].cells[i].innerHTML) ; 
	}
	var nextFromAmount = document.getElementById("interAccountParameterDetailBeans1["+parseInt(slabCount1Hidden,10)+"].fromAmount").value = toAmount;
	document.getElementById("slabCount1Hidden").value =  parseInt(slabCount1Hidden,10) + 1  ;
	$('.bindAutonumeric').autoNumeric("init",
	{
		aSep: strGroupSeparator,
		aDec: strDecimalSeparator,
		mDec: strAmountMinFraction
	});
	$('input[id="' + nextFromAmount.id + '"]').autoNumeric('set', toAmount);
	$('input[id="interAccountParameterDetailBeans1['+parseInt(slabCount1Hidden,10)+'].fromAmount"]').trigger("blur");
	if(parseInt(slabCount1Hidden,10) > 0 )
	{
		 $('input[id="interAccountParameterDetailBeans1['+(parseInt(slabCount1Hidden,10)-1)+'].acceptChkBox"]').attr("disabled", true);
		 $('input[id="interAccountParameterDetailBeans1['+(parseInt(slabCount1Hidden,10)-1)+'].acceptChkBox"]').attr("checked", false);
		 $('input[id="interAccountParameterDetailBeans1['+(parseInt(slabCount1Hidden,10)-1)+'].acceptChkBox"]').hide();
	}
}
function addTotoFromSlabsRow()
{
	var slabCount2Hidden = document.getElementById("slabCount2Hidden").value ;
	var tempSlabCount2Hidden =  parseInt(slabCount2Hidden,10) + 1  ;
	var slabBefore = parseInt(slabCount2Hidden,10) - 1  ;
	var testTable = document.getElementById("TestToToFromSlabsTable");
	var table = document.getElementById("ToToFromSlabsTable").getElementsByTagName('tbody')[0];
	var rowCount = table.rows.length;
	var colCount = testTable.rows[0].cells.length;
	var toAmount = 0;
	if(parseInt(slabCount2Hidden,10)> 0 )
	{
		toAmount = $('input[id="interAccountParameterDetailBeans2['+slabBefore+'].toAmount"]').autoNumeric('get');
		var fromAmount = document.getElementById("interAccountParameterDetailBeans2["+slabBefore+"].fromAmount").value;
		if(parseInt(toAmount,10) <= 0 )
		{
			showError('Amount To cannot be Zero for Slab '+parseInt(slabCount2Hidden,10)+' !');
			return;
		}
		if(strAmountMinFraction > 0)
			toAmount = parseFloat(toAmount)+0.01 ;
		else
			toAmount = parseFloat(toAmount)+1 ;
	}
	var row = table.insertRow(rowCount);
	row.id = "interAccountParameterDetailBeans2["+slabCount2Hidden+"]";
	for(i=0; i<colCount; i++)
	{
	    var newcell = row.insertCell(i);
	    var innerString = testTable.rows[0].cells[i].innerHTML;
	    newcell.innerHTML = innerString;
	    if(i==0)
	    {
	    	newcell.style.textAlign = "center";
	    }
	    testTable.rows[0].cells[i].innerHTML = innerString;
	    testTable.rows[0].cells[i].innerHTML = replaceIndex("["+slabCount2Hidden+"]","["+tempSlabCount2Hidden+"]",testTable.rows[0].cells[i].innerHTML) ;
	}
	var nextFromAmount = document.getElementById("interAccountParameterDetailBeans2["+parseInt(slabCount2Hidden,10)+"].fromAmount").value = toAmount;
	document.getElementById("slabCount2Hidden").value =  parseInt(slabCount2Hidden,10) + 1  ;
	$('.bindAutonumeric').autoNumeric("init",
	{
		aSep: strGroupSeparator,
		aDec: strDecimalSeparator,
		mDec: strAmountMinFraction
	});
	$('input[id="' + nextFromAmount.id + '"]').autoNumeric('set', toAmount);
	$('input[id="interAccountParameterDetailBeans2['+parseInt(slabCount2Hidden,10)+'].fromAmount"]').trigger("blur");
	if(parseInt(slabCount2Hidden,10) > 0 )
	{
		$('input[id="interAccountParameterDetailBeans2['+(parseInt(slabCount2Hidden,10)-1)+'].acceptChkBox"]').attr("disabled", true);
		$('input[id="interAccountParameterDetailBeans2['+(parseInt(slabCount2Hidden,10)-1)+'].acceptChkBox"]').attr("checked", false);
		$('input[id="interAccountParameterDetailBeans2['+(parseInt(slabCount2Hidden,10)-1)+'].acceptChkBox"]').hide();
	}
}

function showHistoryForm( strUrl, index )
{
	var intTop = ( screen.availHeight - 300 ) / 2;
	var intLeft = ( screen.availWidth - 400 ) / 2;
	var strAttr = "dependent=yes,scrollbars=yes,";
	strAttr = strAttr + "left=" + intLeft + ",";
	strAttr = strAttr + "top=" + intTop + ",";
	strAttr = strAttr + "width=550,height=350";

	var frm = document.forms[ "frmMain" ];
	document.getElementById( "txtRecordIndex" ).value = index;
	frm.action = strUrl;
	frm.target = "hWinHistory";
	frm.method = "POST";

	window.open( "", "hWinHistory", strAttr );
	frm.submit();
}

function toggleFirstBeanRow() 
{
	if( document.getElementById( "rowidIndex1" ).value == "" )
	{
		var arrError = [];
		var strTargetDivId = 'messageArea';
		arrError.push({
			"errorCode" : "ERR",
			"errorMessage" : getLabel('recordSelectMsg', 'Please select atleast one record... !')
		});
		
		if (arrError && arrError.length > 0) {
			$('#' + strTargetDivId).empty();
			$.each(arrError, function(index, error) {
				strMsg = error.errorMessage;
				element = $('<p>').text(strMsg);
				element.appendTo($('#' + strTargetDivId));
				$('#' + strTargetDivId + ', #messageContentDiv')
						.removeClass('hidden');
			});
		}
		return;
	}
	var rowIndex = document.getElementById( "rowidIndex1" ).value ;
    var rowIndexId = document.getElementById( "rowidIndex1" ).value ;
    var removeFlag ; 
    var rowId = rowIndexId.split(",") ;
    var slabCount1Hidden = document.getElementById("slabCount1Hidden").value ;
    for(i=0 ; i < rowId.length-1 ; i++ )
    {
        trId = rowId[i];
        removeFlag = document.getElementById("interAccountParameterDetailBeans1["+trId+"].isRemovedFlag" );
        var table = document.getElementById("FromToToSlabsTable");
        table.deleteRow(parseInt(trId,10) + 1);
        if(removeFlag)
        {
        	removeFlag.value = true;
        	slabCount1Hidden = parseInt(slabCount1Hidden,10) - 1;
        }
    }
    document.getElementById("slabCount1Hidden").value = slabCount1Hidden;
    //replace element index by -1 after delete
    var testTable = document.getElementById("TestFromToToSlabsTable");
  	for(i=0; i<testTable.rows[0].cells.length; i++)
	{
	    testTable.rows[0].cells[i].innerHTML = replaceIndex("["+(slabCount1Hidden+1)+"]","["+slabCount1Hidden+"]",testTable.rows[0].cells[i].innerHTML) ;
	}
  	if(parseInt(slabCount1Hidden,10)> 0 )
	{
		 $('input[id="interAccountParameterDetailBeans1['+(slabCount1Hidden-1)+'].acceptChkBox"]').removeAttr("disabled");
		 $('input[id="interAccountParameterDetailBeans1['+(slabCount1Hidden-1)+'].acceptChkBox"]').show();
	}
  	document.getElementById( "rowidIndex1" ).value = '';
}

function hideFirstBeanRow(ctrl,index)
{
	var rowIndex = document.getElementById( "rowidIndex1" ).value ;
	var rowIndexId = document.getElementById( "rowidIndex1" ).value ;
	rowIndex = rowIndex.indexOf(index);
	if( ctrl.checked == true )
	{
		document.getElementById( "rowidIndex1" ).value = index + ","
				+ document.getElementById( "rowidIndex1" ).value ; 
	}
	else
	{
		if(rowIndex >= 0)
		{
			document.getElementById( "rowidIndex1" ).value = rowIndexId.replace(
					rowIndexId.substring( rowIndex, rowIndex + 2 ), "" );
		}
	}
}

function toggleSecondBeanRow() 
{
	if( document.getElementById( "rowidIndex2" ).value == "" )
	{
		var arrError = [];
		var strTargetDivId = 'messageArea';
		arrError.push({
			"errorCode" : "ERR",
			"errorMessage" : getLabel('recordSelectMsg', 'Please select atleast one record... !')
		});
		
		if (arrError && arrError.length > 0) {
			$('#' + strTargetDivId).empty();
			$.each(arrError, function(index, error) {
				strMsg = error.errorMessage;
				element = $('<p>').text(strMsg);
				element.appendTo($('#' + strTargetDivId));
				$('#' + strTargetDivId + ', #messageContentDiv')
						.removeClass('hidden');
			});
		}
		return;
	}
	var rowIndex = document.getElementById( "rowidIndex2" ).value ;
    var rowIndexId = document.getElementById( "rowidIndex2" ).value ;
    var removeFlag;
    var rowId = rowIndexId.split(",") ;
    var slabCount2Hidden = document.getElementById("slabCount2Hidden").value ;
    for(i=0 ; i < rowId.length-1 ; i++ )
    {
        trId = rowId[i];
        removeFlag = document.getElementById("interAccountParameterDetailBeans2["+trId+"].isRemovedFlag" ); 
        var table = document.getElementById("ToToFromSlabsTable");
        table.deleteRow(parseInt(trId,10) + 1);
        if(removeFlag)
        {
        	removeFlag.value = true;
        	slabCount2Hidden = parseInt(slabCount2Hidden,10) - 1;
        }
    }
    document.getElementById("slabCount2Hidden").value = slabCount2Hidden;
    //replace element index by -1 after delete
    var testTable = document.getElementById("TestToToFromSlabsTable");
  	for(i=0; i<testTable.rows[0].cells.length; i++)
	{
	    testTable.rows[0].cells[i].innerHTML = replaceIndex("["+(slabCount2Hidden+1)+"]","["+slabCount2Hidden+"]",testTable.rows[0].cells[i].innerHTML) ;
	}
  	if(parseInt(slabCount2Hidden,10)> 0 )
	{
		 $('input[id="interAccountParameterDetailBeans2['+(slabCount2Hidden-1)+'].acceptChkBox"]').removeAttr("disabled");
		 $('input[id="interAccountParameterDetailBeans2['+(slabCount2Hidden-1)+'].acceptChkBox"]').show();
	}
  	document.getElementById( "rowidIndex2" ).value = '';
}

function hideSecondBeanRow(ctrl,index)
{
	var rowIndex = document.getElementById( "rowidIndex2" ).value ;
	var rowIndexId = document.getElementById( "rowidIndex2" ).value ;
	rowIndex = rowIndex.indexOf(index);
	if( ctrl.checked == true )
	{
		document.getElementById( "rowidIndex2" ).value = index + ","
				+ document.getElementById( "rowidIndex2" ).value ; 
	}
	else
	{
		if(rowIndex >= 0)
		{
			document.getElementById( "rowidIndex2" ).value = rowIndexId.replace(
					rowIndexId.substring( rowIndex, rowIndex + 2 ), "" );
		}
	}
}

function onChangeRateTypeList1(index)
{
	var rateType = document.getElementById("interAccountParameterDetailBeans1["+index+"].rateType");
	var rateofInterest = document.getElementById("interAccountParameterDetailBeans1["+index+"].rateOFInterest");
	var baseRateCode = document.getElementById("interAccountParameterDetailBeans1["+index+"].baseRateDesc");
	var astrikLblFrom = document.getElementById("astrikLblFrom["+index+"]");
	var baseRateCodeSeek = document.getElementById("interAcctParamBaseRateCode1["+index+"]");
	var spread = document.getElementById("interAccountParameterDetailBeans1["+index+"].spread");
	if(rateType)
	{
		if(rateType.value == 'V')
		{
			rateofInterest.className = "readOnly greyback form-control";
			rateofInterest.readOnly =true;
			rateofInterest.value="";
			baseRateCode.className = "form-control";
			baseRateCode.disabled =false;
			astrikLblFrom.style.visibility = "visible";
			baseRateCodeSeek.style.visibility = "visible";
			if(baseRateCode.value != null && baseRateCode.value != "" )
			{
				spread.className = "form-control amountBox";
				spread.readOnly =false;
			}
			else
			{
				spread.className = "readOnly greyback form-control amountBox";
				spread.readOnly =true;
				spread.value="";
			}
		}
		else
		{
			rateofInterest.className = "form-control amountBox";
			rateofInterest.readOnly =false;
			baseRateCode.className = "readOnly greyback form-control";
			baseRateCode.disabled =true;
			baseRateCode.value="";
			astrikLblFrom.style.visibility = "hidden";
			baseRateCodeSeek.style.visibility = "hidden";
			spread.className = "readOnly greyback form-control amountBox";
			spread.readOnly =true;
			spread.value="";
		}
	}
	
}

function onChangeRateTypeList2(index)
{
	var rateType = document.getElementById("interAccountParameterDetailBeans2["+index+"].rateType");
	var rateofInterest = document.getElementById("interAccountParameterDetailBeans2["+index+"].rateOFInterest");
	var baseRateCode = document.getElementById("interAccountParameterDetailBeans2["+index+"].baseRateDesc");
	var astrikLblTo = document.getElementById("astrikLblTo["+index+"]");
	var baseRateCodeSeek = document.getElementById("interAcctParamBaseRateCode2["+index+"]");
	var spread = document.getElementById("interAccountParameterDetailBeans2["+index+"].spread");
	if(rateType)
	{
		if(rateType.value == 'V')
		{
			rateofInterest.className = "readOnly greyback form-control amountBox";
			rateofInterest.readOnly =true;
			rateofInterest.value="";
			baseRateCode.className = "form-control";
			baseRateCode.disabled =false;
			astrikLblTo.style.visibility = "visible";
			baseRateCodeSeek.style.visibility = "visible";
			if(baseRateCode.value != null && baseRateCode.value != "")
			{
				spread.className = "form-control amountBox";
				spread.readOnly =false;
			}
			else
			{
				spread.className = "readOnly greyback form-control amountBox";
				spread.readOnly =true;
				spread.value="";
			}
		}
		else
		{
			rateofInterest.className = "form-control amountBox";
			rateofInterest.readOnly =false;
			baseRateCode.className = "readOnly greyback form-control";
			baseRateCode.disabled =true;
			baseRateCode.value="";
			astrikLblTo.style.visibility = "hidden";
			baseRateCodeSeek.style.visibility = "hidden";
			spread.className = " readOnly greyback form-control amountBox";
			spread.readOnly =true;
			spread.value="";
		}
	}
	
}

function slabValidationList1(index)
{
	var fromAmount = document.getElementById("interAccountParameterDetailBeans1["+index+"].fromAmount");
	if(index == 0)
	{
//		fromAmount.className = "w10 amountBox rounded";
	}
	else
	{
		//fromAmount.className = "w10 amountBox rounded inline_block greyback";
		fromAmount.readOnly =true;
	}
}

function slabValidationList2(index)
{
	var fromAmount = document.getElementById("interAccountParameterDetailBeans2["+index+"].fromAmount");
	if(index == 0)
	{
//		fromAmount.className = "w10 amountBox rounded";
	}
	else
	{
//		fromAmount.className = "w10 amountBox rounded inline_block greyback";
		fromAmount.readOnly =true;
	}
}
function checkList1Amount(index)
{
	var nextIndex = parseInt(index,10) +1 ;
	var fromAmount = document.getElementById("interAccountParameterDetailBeans1["+index+"].fromAmount");
	var nextFromAmount = document.getElementById("interAccountParameterDetailBeans1["+nextIndex+"].fromAmount");
	var toAmount = document.getElementById("interAccountParameterDetailBeans1["+index+"].toAmount");
	var fromAmountValue = $('input[id="' + fromAmount.id + '"]').autoNumeric('get');
	var nextFromAmountValue = $('input[id="' + nextFromAmount.id + '"]').autoNumeric('get');
	var toAmountValue = $('input[id="' + toAmount.id + '"]').autoNumeric('get');
	if (isNaN(toAmountValue))
	{
		showError('Amount To Should Not be Character !');
		return false;
	}
	else if(parseInt(fromAmountValue,10) > parseInt(toAmountValue,10) && parseInt(toAmountValue,10) > 0)
	{
		showError('Amount To should be greater than Amount From !');
	}
	if(nextFromAmount)
	{
		if(strAmountMinFraction > 0)
			nextFromAmount.value = parseFloat(toAmountValue) +0.01 ;
		else
			nextFromAmount.value = parseFloat(toAmountValue,10) +1 ;
		$('input[id="' + nextFromAmount.id + '"]').autoNumeric('set', nextFromAmount.value);
	}
}
function checkList2Amount(index)
{
	var nextIndex = parseInt(index,10) +1 ;
	var fromAmount = document.getElementById("interAccountParameterDetailBeans2["+index+"].fromAmount");
	var nextFromAmount = document.getElementById("interAccountParameterDetailBeans2["+nextIndex+"].fromAmount");
	var toAmount = document.getElementById("interAccountParameterDetailBeans2["+index+"].toAmount");
	var fromAmountValue = $('input[id="' + fromAmount.id + '"]').autoNumeric('get');
	var nextFromAmountValue = $('input[id="' + nextFromAmount.id + '"]').autoNumeric('get');
	var toAmountValue = $('input[id="' + toAmount.id + '"]').autoNumeric('get');
	if (isNaN(toAmountValue))
	{
		showError('Amount To Should Not be Character !');
		return false;
	}
	else if(parseInt(fromAmountValue,10) > parseInt(toAmountValue,10) && parseInt(toAmountValue,10) > 0)
	{
		showError('Amount To should be greater than Amount From !');
	}
	if(nextFromAmount)
	{
		if(strAmountMinFraction > 0)
			nextFromAmount.value = parseFloat(toAmountValue) +0.01 ;
		else
			nextFromAmount.value = parseFloat(toAmountValue,10) +1 ;
	}
}
function onChangeBaseRateCode(json,elementId)
{
	var inputIdArray = elementId.split("|");
	var tempString = replaceIndex('baseRateDesc','spread',inputIdArray[0]);
	var spread = document.getElementById(tempString);
	spread.className = "form-control amountBox";
	spread.readOnly =false;
}
function checkAmount(me)
{
	if( isNaN( parseFloat( me.value ) ) ) 
		me.value = "";
	$(me).keypress(function (e) {
	     //if the letter is not digit then display error and don't type anything
	     if (e.which != 8 && e.which != 0 && e.which != 45 && e.which != 46 && (e.which < 48 || e.which > 57)) {
	        //display error message	        
	               return false;
	    }
	   });
}
function OnChangeFormatAmount(me)
{
	if( isNaN( parseFloat( me.value ) ) ) return false;
	me.value = parseFloat(me.value).toFixed(2);
}
function replaceIndex(stringToFind, stringToReplace,tempString) {
	if(typeof stringToFind === 'undefined')
	{
		return tempString;
	}
    if (stringToFind === stringToReplace) return this;
    var index = tempString.indexOf(stringToFind);
    while (index != -1) {
    	tempString = tempString.replace(stringToFind, stringToReplace);
        index = tempString.indexOf(stringToFind);
    }
    return tempString;
}

function goToListScreen()
{
	submitUrl('lmsInterAccountParameterList.srvc',null,0);
}


function renderAutoCompleters()
{
	//alert('pageMode:'+pageMode);
		if( pageMode != 'View'){
			createExtJsEffectiveDateField();
		}
}
function createExtJsEffectiveDateField() {
	var effectivedtValue = effectiveDateModel != '' || effectiveDateModel != null ? effectiveDateModel
			: new Date(year, month - 1, day);
	var effectivedt = Ext.create('Ext.form.DateField', {
		name : 'effectiveDate',
		itemId : 'effectiveDate',
		format : extJsDateFormat,
		editable : false,
		width: 200,
		height: 24,
		hideTrigger: 'true',
		fieldCls: 'ft-datepicker ui-datepicker-range-alignment is-datepick',
		minValue : dtApplicationDate,
		value : effectivedtValue
	});
	effectivedt.render(Ext.get('effectiveDateDiv'));
}
function validateAndNavigate(strUrl, frmId,tabId) {
	if(tabId == 'Tab_2')
	{
		//$('#Lending').removeClass('ft-button ft-button-light');
		//$('#Lending').addClass('ft-button ft-button-primary ft-margin-l');
		
		//$('#Borrowing').removeClass('ft-button ft-button-primary ft-margin-l');
		//$('#Borrowing').addClass('ft-button ft-button-light ft-margin-l');
	}
	else
	{
		//$('#Lending').removeClass('ft-button ft-button-primary ft-margin-l');
	//	$('#Lending').addClass('ft-button ft-button-light');
				
		//$('#Borrowing').removeClass('ft-button ft-button-light');
		//$('#Borrowing').addClass('ft-button ft-button-primary ft-margin-l');
	}
		
	if ($('#dirtyBit').val() == "1")
		getNavigationPopup(frmId, strUrl);
	else
		goToPage(strUrl, frmId, tabId);
}
function getNavigationPopup(frmId, strUrl,flag) {	
	$('#navigatePopup').dialog({
		autoOpen : false,
		height : 200,
		width : 420,
		modal : true,
		buttons : {
			"Yes" : {
				text: 'Yes',
				"class": "ux_label-margin-right",
				click: function() {
				var frm = document.getElementById(frmId);
				frm.action = strUrl;
				frm.target = "";
				frm.method = "POST";
				frm.submit();
			}
			},
			"No" : {
				text: 'No',
				click: function() {
				$(this).dialog("close");
			}
			}
		}
	});
	$('#navigatePopup').dialog("open");
}
function goToPage(strUrl, frmId,tabId) {
	var frm = document.getElementById(frmId);
	document.getElementById("tabActiveFlag").value=tabId;
	frm.action = strUrl;
	frm.target = "";
	frm.method = "POST";
	frm.submit();
}
function showError(errMsg){
	var arrError = [];
	var strTargetDivId = 'messageArea';
	arrError.push({
		"errorCode" : "ERR",
		"errorMessage" : getLabel('ERRMSG', errMsg)
	});
	
	if (arrError && arrError.length > 0) {
		$('#' + strTargetDivId).empty();
		$.each(arrError, function(index, error) {
			strMsg = error.errorMessage;
			element = $('<p>').text(strMsg);
			element.appendTo($('#' + strTargetDivId));
			$('#' + strTargetDivId + ', #messageContentDiv')
					.removeClass('hidden');
		});
	}
}
function disableCheckBox1(){
	var slabCount1Hidden = document.getElementById("slabCount1Hidden").value;
	var chkCount = parseInt(slabCount1Hidden,10)-1;
	for(i=0; i<chkCount; i++)
	{
		 $('input[id="interAccountParameterDetailBeans1['+i+'].acceptChkBox"]').attr("disabled", true);
		 $('input[id="interAccountParameterDetailBeans1['+i+'].acceptChkBox"]').attr("checked", false);
		 $('input[id="interAccountParameterDetailBeans1['+i+'].acceptChkBox"]').hide();
	}
}
function disableCheckBox2(){
	var slabCount2Hidden = document.getElementById("slabCount2Hidden").value;
	var chkCount = parseInt(slabCount2Hidden,10)-1;
	for(i=0; i<chkCount; i++)
	{
		 $('input[id="interAccountParameterDetailBeans2['+i+'].acceptChkBox"]').attr("disabled", true);
		 $('input[id="interAccountParameterDetailBeans2['+i+'].acceptChkBox"]').attr("checked", false);
		 $('input[id="interAccountParameterDetailBeans2['+i+'].acceptChkBox"]').hide();
	}
}