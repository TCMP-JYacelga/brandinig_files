jQuery.fn.sellersClientSeekAutoComplete= function() {
	return this.each(function() {
		$(this).autocomplete({
					source : function(request, response) {
					var strUrl = "services/securityProfileSeek/securityAdminClientList.json?$sellerId="+$('#sellerId').val();
					if(!isEmpty($('#clientDescText').val()))
					{
						strUrl = strUrl+"&qfilter="+$('#clientDescText').val();
					}
					$.ajax({
								url : strUrl,
								type: "POST",
								dataType : "json",
								data : {
									$autofilter : request.term
								},
								success : function(data) {
									var rec = data.filterList;
									
									response($.map(rec, function(item) {
												return {														
													label : item.value,														
													bankDtl : item
												}
											}));
								}
							});
					},
					minLength : 1,
					select : function(event, ui) {
						var data = ui.item.bankDtl;
						if (data) {
							if (!isEmpty(data.name))
							{
								$('#clientId').val(data.name);
								$('#clientDesc').val(data.value);
							}
						}
					},
					open : function() {
						$(this).removeClass("ui-corner-all")
								.addClass("ui-corner-top");
					},
					close : function() {
						$(this).removeClass("ui-corner-top")
								.addClass("ui-corner-all");
					}
				});/*.data("autocomplete")._renderItem = function(ul, item) {
			var inner_html = '<a><ol class="xn-autocompleter"><ul style="width:200px;">'
					+ item.label + '</ul></ol></a>';
			return $("<li></li>").data("item.autocomplete", item)
					.append(inner_html).appendTo(ul);
		};*/
	});
};


function showList(strUrl)
{
	var frm = document.forms["frmMain"];
	frm.action = strUrl;
	frm.target = "";
	frm.method = "POST";
	frm.submit();	
}

function showAddNewForm(strUrl)
{
	var frm = document.forms["frmMain"];
	frm.action = strUrl;
	frm.target = "";
	frm.method = "POST";
	frm.submit();	
}

function showHistoryForm(strUrl, index)
{
	var intTop  = (screen.availHeight - 300)/2;
	var intLeft = (screen.availWidth - 400)/2;
	var strAttr = "dependent=yes,scrollbars=yes,";
	strAttr = strAttr + "left=" + intLeft + ",";
	strAttr = strAttr + "top=" + intTop + ",";
	strAttr = strAttr + "width=400,height=300";

	var frm = document.forms["frmMain"];
	document.getElementById("updateIndex").value = index;
	frm.action = strUrl;
	frm.target = "hWinHistory";
	frm.method = "POST";

	window.open ("", "hWinHistory", strAttr);
	frm.submit();
}

function showViewForm(strUrl, index)
{
	var frm = document.forms["frmMain"]; 
	document.getElementById("updateIndex").value = index;
	frm.action = strUrl;
	frm.target = "";
	frm.method = "POST";
	frm.submit();
}

function showEditForm(strUrl, index)
{
	var frm = document.forms["frmMain"]; 
	document.getElementById("updateIndex").value = index;
	frm.action = strUrl;
	frm.target = "";
	frm.method = "POST";
	frm.submit();
}

// Enable, Disable, Accept and Reject requests
function enableRecordList(strUrl)
{
	var frm = document.forms["frmMain"];
	if (document.getElementById("updateIndex").value == "")
	{
		alert("Select Atlease One Record")
		return;
	}
	frm.action = strUrl;
	frm.target = "";
	frm.method = "POST";
	frm.submit();
}

function disableRecordList(strUrl)
{
	var frm = document.forms["frmMain"]; 
	if (document.getElementById("updateIndex").value == "")
	{
		alert("Select Atlease One Record")
		return;
	}
	frm.action = strUrl;
	frm.target = "";
	frm.method = "POST";
	frm.submit();
}

function acceptRecord(me,strUrl)
{
	if (me.className.startsWith("imagelink grey"))
		return;
	var frm = document.forms["frmMain"];
	if (document.getElementById("updateIndex").value == "")
	{
		alert("Select Atlease One Record")
		return;
	}	
	frm.target ="";
	frm.action = strUrl;
	frm.method = "POST";
	frm.submit();
}


function getRejectRecord(me, rejTitle, rejMsg,strUrl)
{
    var temp = document.getElementById("btnReject");
	if (temp.className.startsWith("imagelink grey"))
		return;
	if (document.getElementById("updateIndex").value == "")
	{
		alert("Select Atlease One Record")
		return;
	}
	getRemarks(230, rejTitle, rejMsg, strUrl, rejectRecord);
}

function rejectRecord(arrData, strRemarks,strUrl)
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
		frm.target = "";
		frm.action = arrData;
		frm.method = 'POST';
		frm.submit();
	}
}

function deleteList(me,strUrl)
{
    var temp = document.getElementById("btnDiscard");
	if (temp.className.startsWith("imagelink grey"))
		return;
	if (document.getElementById("updateIndex").value == "")
	{
		alert("Select Atlease One Record");
		return;
	} 
	deleteRecord(document.getElementById("updateIndex").value,strUrl);
}

function deleteRecord(arrData,strUrl)
{
	var frm = document.forms["frmMain"]; 
	document.getElementById("txtIndex").value = arrData;
	frm.target = "";
	frm.action = strUrl;
	frm.method = 'POST';
	frm.submit();
}


// List navigation
function prevPage(strUrl, intPg)
{
	var frm = document.forms["frmMain"]; 
	document.getElementById("txtCurrent").value = intPg;
	frm.action = strUrl;
	frm.target = "";
	frm.method = "POST";
	frm.submit();
}

function nextPage(strUrl, intPg)
{
	document.getElementById("txtCurrent").value = intPg;
	frm.action = strUrl;
	frm.target = "";
	frm.method = "POST";
	frm.submit();
}


function selectRecord(ctrl, status, index, maker)
{
	var strAuthIndex = document.getElementById("updateIndex").value;
	var strActionMap = document.getElementById("actionmap").value;
	if (index.length < 2)
	{
		index = '0' + index;
	}	
	var aPosition = strAuthIndex.indexOf(index);
    var mapPosition;	
	var strCurrentAction;
	var strDelimAction;
	var lenDelimAction;
	var strArrSplitAction;
	var strFinalBitmap = document.getElementById("bitmapval").value;
	var lenLooplen;
	if (aPosition >= 0)
	{
		document.getElementById("updateIndex").value = strAuthIndex.replace(strAuthIndex.substring(aPosition, aPosition + 2),"");
		mapPosition = strActionMap.indexOf(index+":");
		document.getElementById("actionmap").value = strActionMap.replace(strActionMap.substring(mapPosition, mapPosition + 7),"");
	}
	else
	{
		document.getElementById("updateIndex").value = index+ ","+document.getElementById("updateIndex").value ;
		strCurrentAction = arrActionMap[status];
		document.getElementById("actionmap").value = index+":"+ strCurrentAction +","+document.getElementById("actionmap").value ;
	}
	if (ctrl.className.indexOf("acceptlink") > -1)
	{
		ctrl.className = "linkbox acceptedlink";
	}
	else
	{
		ctrl.className = "linkbox acceptlink";
	}
	// perform the operation of bitwise anding
	lenDelimAction = document.getElementById("actionmap").value.length;
	if (lenDelimAction > 1)
	{
		strDelimAction = document.getElementById("actionmap").value;
		strDelimAction = strDelimAction.substring(0, lenDelimAction-1);		
		strArrSplitAction = strDelimAction.split(",");		
		for (var i=0;i<strArrSplitAction.length;i++)
		{
			strArrSplitAction[i] = strArrSplitAction[i].substring(strArrSplitAction[i].indexOf(":")+1);
		}
		
		if (strArrSplitAction.length==1)
		{
			strFinalBitmap = strArrSplitAction[0];
		}
		else
		{
				lenLooplen =strArrSplitAction.length-1;
				for (var j=0; j<lenLooplen ; j++)
				{
					if (j==0)
					{
						strFinalBitmap = performAnd(strArrSplitAction[j],strArrSplitAction[j+1]);						
					}
					else
					{
						strFinalBitmap = performAnd(strFinalBitmap,strArrSplitAction[j+1]);
					}
				}
		}		
		document.getElementById("bitmapval").value=	strFinalBitmap;
		refreshButtons(maker);
	}
	else
	{
		strFinalBitmap = _strValidActions;
		document.getElementById("bitmapval").value=	strFinalBitmap;
		refreshButtons(maker);
	}	
}

function performAnd(validAction,currentAction)
{
	var strOut = "";
	var i = 0;
	if (validAction.length = currentAction.length)
	{
		for (i=0; i<5; i++)
		{
			strOut = strOut +((validAction.charAt(i)*1) && (currentAction.charAt(i)*1));
		}
	}
	return strOut;
}

function refreshButtons(maker)
{
	var strPopultedButtons=document.getElementById("bitmapval").value;
	var strActionButtons;	
	// DO THE ANDING WITH SERVER BITMAP
	strActionButtons = performAnd(strPopultedButtons,_strServerBitmap);	
	//alert('the final bitmap::' + strActionButtons);
	var i=0;
	if (strActionButtons.length > 0)
	{
		for (i=0; i<5; i++)
		{
				switch (i)
				{
					case 0: 
					if (strActionButtons.charAt(i)*1 ==1 &&  maker != _strUserCode)
					{
						document.getElementById("btnAuth").className ="imagelink black inline_block button-icon icon-button-accept font_bold";
					}
					else
					{
						document.getElementById("btnAuth").className ="imagelink grey inline_block button-icon icon-button-accept-grey font-bold";
					}
					break;					
					
					case 1: 
					if (strActionButtons.charAt(i)*1 ==1 &&  maker != _strUserCode)
					{
						document.getElementById("btnReject").className ="imagelink black inline_block button-icon icon-button-reject font_bold";
					}
					else
					{
						document.getElementById("btnReject").className ="imagelink grey inline_block button-icon icon-button-reject-grey font-bold";
					}
					break;
					
					case 2: 
					if (strActionButtons.charAt(i)*1 ==1)
					{
						document.getElementById("btnEnable").className ="imagelink black inline_block button-icon icon-button-enable font_bold";
					}
					else
					{
						document.getElementById("btnEnable").className ="imagelink grey inline_block button-icon icon-button-enable-grey font-bold";
					}
					break;
					
					case 3: 
					if (strActionButtons.charAt(i)*1 ==1)
					{
						document.getElementById("btnDisable").className ="imagelink black inline_block button-icon icon-button-disable font_bold";
					}
					else
					{
						document.getElementById("btnDisable").className ="imagelink grey inline_block button-icon icon-button-disable-grey font-bold";
					}
					break;
						
					case 4: 
					if (strActionButtons.charAt(i)*1 ==1)
					{
						document.getElementById("btnDiscard").className ="imagelink black inline_block button-icon icon-button-discard font_bold";
					}
					else
					{
						document.getElementById("btnDiscard").className ="imagelink grey inline_block button-icon icon-button-discard-grey font-bold";
					}
					break;
				}
		}
	}	
}

// Details
function addDetail(strUrl)
{
	var frm = document.forms["frmMain"]; 
	frm.action = strUrl;
	frm.method = "POST";
	frm.submit();
}

function deleteDetail(strUrl, index)
{
	var frm = document.forms["frmMain"]; 
	document.getElementById("txtIndex").value = index;
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

function toggleCheckUncheck(imgElement,flag) 
{
	if (imgElement.src.indexOf("icon_unchecked.gif") > -1)
	{
		imgElement.src = "static/images/icons/icon_checked.gif";	
		$('#'+flag).val('Y');
	}
	else
	{
		imgElement.src = "static/images/icons/icon_unchecked.gif";
		$('#'+flag).val('N');
	}
}
function toggleCheckUncheckChecks(imgElement,flag) 
{
	
	if (imgElement.src.indexOf("icon_unchecked.gif") > -1)
	{
		imgElement.src = "static/images/icons/icon_checked.gif";	
		$('#'+flag).val('Y');
		$('.'+flag).removeAttr("disabled");
		$('.'+flag).removeClass("disabled");
		
		if(flag === 'encryptionFlag')
		{
			$('.encryptlbl').attr("class","frmLabel required ml12 encryptlbl");
			//$('#lblEncryptType').addClass("required");
			$('#lblEncryptionAlgorithm').addClass("required");
			$('#lblEncryptionKeyLen').addClass("required");
			$('#lblkeylength').addClass("required");
			if(entityType != '0'|| onBehalf ==  true)
			{
				makeNiceSelect("encryptionType",true);
				makeNiceSelect("encryptionAlgo",true);
				makeNiceSelect("encryptionKeyLength",true);
			}
		}
		else if(flag === 'integrityCheckFlag')
		{
			//$('.integrityChecklbl').addClass("required-lbl-right");
		    $('.integrityChecklbl').attr("class","frmLabel required ml12 integrityChecklbl");
		    if(entityType != '0'|| onBehalf ==  true)
			{
		    	makeNiceSelect('integrityCheckAlgo',true);
			}
		}
		else if(flag === 'singingFlag')
		{
			$('.signinglbl').attr("class","frmLabel required ml12 signinglbl");
            $('#signingalgolbl').addClass("required");
            if(entityType != '0' || onBehalf ==  true)
			{
            	makeNiceSelect("singingType",true);
            	makeNiceSelect("singingAlgo",true);
			}
		}
	}
	else
	{
		imgElement.src = "static/images/icons/icon_unchecked.gif";
		$('#'+flag).val('N');
		$('.'+flag).val(' ');
		$('.'+flag).attr("disabled","true");
		
		if(flag === 'encryptionFlag')
		{
			$('.encryptlbl').attr("class","ml12 encryptlbl");
			$('#lblEncryptType').removeClass("required");
			document.getElementById("encryptkey_length").style.display = "block";
			document.getElementById("encryptkey_algo").style.display = "block";
			$('#lblEncryptionAlgorithm').text(getLabel('encryptionalgo','Encryption Algorithm'));
			$('#lblEncryptionAlgorithm').removeClass("required");
			$('#lblEncryptionKeyLen').removeClass("required");
			$('#lblkeylength').removeClass("required");
			var encType = $('#encryptionType').val();
			$('#lblEncryptionKey').text(lblEncryptionKeyMap[encType]);
			$('#lblEncryptionKey').removeClass("required required-lbl-right");
			$('#lblkeylength').removeClass("required frmLabel");
			$("#encryptionType").removeClass('requiredField');
			$("#encryptionAlgo").removeClass('requiredField');
			$("#encryptionKeyLength").removeClass('requiredField');
			if(entityType != '0'|| onBehalf ==  true)
			{
				$("#encryptionType").niceSelect('update'); 
				$("#encryptionAlgo").niceSelect('update'); 
				$("#encryptionKeyLength").niceSelect('update');
			}
		}
		else if(flag === 'integrityCheckFlag')
		{
			//$('.integrityChecklbl').attr("class","ml12 integrityChecklbl");
			//$('#integrityChecklbl').removeClass("required");
		    $('.integrityChecklbl').attr("class","ml12 integrityChecklbl");
		    $("#integrityCheckAlgo").removeClass('requiredField');
		    if(entityType != '0'|| onBehalf ==  true)
			{
		    	$('#integrityCheckAlgo').niceSelect('update');
			}
		}
		else if(flag === 'singingFlag')
		{
			$('.signinglbl').attr("class","ml12 signinglbl");
            $('#signingalgolbl').removeClass("required");
            $("#singingType").removeClass('requiredField');
            $("#singingAlgo").removeClass('requiredField');
            if(entityType != '0'|| onBehalf ==  true)
			{
            	$("#singingType").niceSelect('update'); 
            	$("#singingAlgo").niceSelect('update'); 
			}
		}
	}
	removeMarkRequired($('#encryptionKey'));
	unbindMarkRemoveRequired('encryptionKey');
}

function unsetothers(elementId,imgElement)
{
	$('#ftpProtocolType').val('');
	$('#lblIpAddress').removeClass("required");
	$('#lblLogin').removeClass("required");
	$('#lblPwd').removeClass("required");
	if('chkFTP' === elementId)
	{
		$('#chkSFTPSSL').attr("src","static/images/icons/icon_unchecked.gif");
		$('#chkTSL').attr("src","static/images/icons/icon_unchecked.gif");
		$('#chkSFTPSSH').attr("src","static/images/icons/icon_unchecked.gif");
		validateFTPInfo(imgElement);
	}
	else if ('chkSFTPSSL' === elementId)
	{
		$('#chkFTP').attr("src","static/images/icons/icon_unchecked.gif");
		$('#chkSFTPSSH').attr("src","static/images/icons/icon_unchecked.gif");
		$('#chkTSL').attr("src","static/images/icons/icon_unchecked.gif");
		validateSFTPSSLInfo(imgElement);
	}
	else if ('chkTSL' === elementId)
	{
		$('#chkFTP').attr("src","static/images/icons/icon_unchecked.gif");
		$('#chkSFTPSSH').attr("src","static/images/icons/icon_unchecked.gif");
		$('#chkSFTPSSL').attr("src","static/images/icons/icon_unchecked.gif");
		validateSFTPSSLInfo(imgElement);
	}
	else if ('chkSFTPSSH' === elementId)
	{
		validateSFTPSSHInfo(imgElement);
		$('#chkFTP').attr("src","static/images/icons/icon_unchecked.gif");
		$('#chkSFTPSSL').attr("src","static/images/icons/icon_unchecked.gif");
		$('#chkFTP').attr("src","static/images/icons/icon_unchecked.gif");
		$('#chkTSL').attr("src","static/images/icons/icon_unchecked.gif");
	}
}

function setEncryptionFieldTypeList(elem)
{
	$('#lblEncryptionKey').text(lblEncryptionKeyMap[elem]);
	setEncryptionAlgo(elem);
	
	setEncryptionKey(elem);
	
	setSigningType();
	
	if(elem == "Asymmetric")
	{
		document.getElementById("encryptkey_length").style.display = "none";
		//document.getElementById("encryptkey_algo").style.display = "none";
		$('#lblEncryptionKey').removeClass("required required-lbl-right");
		removeMarkRequired($('#encryptionKey'));
		unbindMarkRemoveRequired('encryptionKey');
		$('#lblEncryptionAlgorithm').text(getLabel('vendor','Vendor'));
	}
	else
	{
		document.getElementById("encryptkey_length").style.display = "block";
		document.getElementById("encryptkey_algo").style.display = "block";
		$('#lblEncryptionAlgorithm').text(getLabel('encryptionalgo','Encryption Algorithm'));
		$('#lblEncryptionKey').removeClass("required required-lbl-right");
		removeMarkRequired($('#encryptionKey'));
		unbindMarkRemoveRequired('encryptionKey');
	}
	if(elem == "Symmetric")
	{
		$('#lblEncryptionAlgorithm').addClass("required");
		$('#lblEncryptionKeyLen').addClass("required");
		$('#lblkeylength').addClass("required");
		$('#lblEncryptionKey').addClass("required");
		bindMarkRemoveRequired('encryptionKey');
	}
	if(elem == '' || elem == ' ')
	{
		document.getElementById("encryptionAlgo").innerHTML="";
		//document.getElementById("encryptionKey").innerHTML="";
		document.getElementById("encryptionKeyLength").innerHTML="";
		document.getElementById("singingType").innerHTML="";
		
		var option = document.createElement("option");
		document.getElementById("encryptionAlgo").add(option);	
		option.text = getLabel("lbl.select","Select");
		option.value = " ";
		if(entityType != '0'|| onBehalf ==  true)
		{
			makeNiceSelect("encryptionAlgo",true);
		}

		option = document.createElement("option");
		//document.getElementById("encryptionKey").add(option);	
		option.text = getLabel("lbl.select","Select");
		option.value = " ";

		option = document.createElement("option");
		document.getElementById("encryptionKeyLength").add(option);	
		option.text = getLabel("lbl.select","Select");
		option.value = " ";
		if(entityType != '0'|| onBehalf ==  true)
		{
			makeNiceSelect("encryptionKeyLength",true);
		}

		option = document.createElement("option");
		document.getElementById("singingType").add(option);	
		option.text = getLabel("lbl.select","Select");
		option.value = " ";
		option = document.createElement("option");
		document.getElementById("singingType").add(option);	
		option.text = getLabel("symmetric","Symmetric");
		option.value = "Symmetric";
		option = document.createElement("option");
		document.getElementById("singingType").add(option);	
		option.text = getLabel("asymmetric","Asymmetric");
		option.value = "Asymmetric";
		if(entityType != '0'|| onBehalf ==  true)
		{
			makeNiceSelect("singingType",true);
		}
	}
}

function setEncryptionAlgo(elem)
{
	document.getElementById("encryptionAlgo").innerHTML="";
	var option = document.createElement("option");
	document.getElementById("encryptionAlgo").add(option);	
	option.text = getLabel("lbl.select","Select");
	option.value = "";
	if( 'Symmetric' === elem )
	{
		var symmAlgoms = ["DES", "DESede" , "RC2", "RC4", "RC5", "AES"];
		
		for(var i=0 ; i < symmAlgoms.length; i++)
		{
			option = document.createElement("option");
			document.getElementById("encryptionAlgo").add(option);	
			option.text = symmAlgoms[i];
			option.value = symmAlgoms[i];
		}
		//setKeyLength(symmAlgoms[0]);
	}
	else if( 'Asymmetric' === elem )
	{
		var aSymmAlgoms = ["PGP"];
		for(var i=0 ; i < aSymmAlgoms.length; i++)
		{
			option = document.createElement("option");
			document.getElementById("encryptionAlgo").add(option);	
			option.text = aSymmAlgoms[i];
			option.value = aSymmAlgoms[i];
		}
		document.getElementById("encryptionKeyLength").innerHTML="";
		option = document.createElement("option");
		document.getElementById("encryptionKeyLength").add(option);	
		option.text = getLabel("lbl.select","Select");
		option.value = "0";
		if(entityType != '0'|| onBehalf ==  true)
		{
			makeNiceSelect('encryptionKeyLength', true);
		}
	}
	if(entityType != '0' || onBehalf ==  true )
	{
		makeNiceSelect('encryptionAlgo', true);
	}
}

function setEncryptionKey(elem)
{
	/*document.getElementById("encryptionKey").innerHTML="";
	if( 'Symmetric' === elem )
	{
		var option = document.createElement("option");
		document.getElementById("encryptionKey").add(option);	
		option.text = "Passphrase";
		option.value = "Passphrase";
	}
	else if( 'Asymmetric' === elem )
	{
		var option = document.createElement("option");
		document.getElementById("encryptionKey").add(option);	
		option.text = "Client Key";
		option.value = "Client Key";		
	}*/
}

function setKeyLength(elem)
{
	var encryptionType = document.getElementById("encryptionType").value;
	document.getElementById("encryptionKeyLength").innerHTML="";
	var option = document.createElement("option");
	document.getElementById("encryptionKeyLength").add(option);	
	option.text = getLabel("lbl.select","Select");
	option.value = "";
	if( 'Symmetric' === encryptionType )
	{
		if('DES' === elem)
		{
			option = document.createElement("option");
			document.getElementById("encryptionKeyLength").add(option);	
			option.text = "64";
			option.value = "64";	
		}
		else if('RC2'  === elem ||  'RC4'  === elem  || 'RC5' === elem)
		{
			option = document.createElement("option");
			document.getElementById("encryptionKeyLength").add(option);	
			option.text = "128";
			option.value = "128";	
		}
		else if('AES'  === elem )
		{
			option = document.createElement("option");
			document.getElementById("encryptionKeyLength").add(option);	
			option.text = "128";
			option.value = "128";	
			option = document.createElement("option");
			document.getElementById("encryptionKeyLength").add(option);	
			option.text = "192";
			option.value = "192";	
			option = document.createElement("option");
			document.getElementById("encryptionKeyLength").add(option);	
			option.text = "256";
			option.value = "256";	
		} 
		else if('DESede'  === elem )
		{
			option = document.createElement("option");
			document.getElementById("encryptionKeyLength").add(option);	
			option.text = "64";
			option.value = "64";
			option = document.createElement("option");
			document.getElementById("encryptionKeyLength").add(option);	
			option.text = "128";
			option.value = "128";	
			option = document.createElement("option");
			document.getElementById("encryptionKeyLength").add(option);	
			option.text = "192";
			option.value = "192";
			option = document.createElement("option");
			document.getElementById("encryptionKeyLength").add(option);	
			option.text = "256";
			option.value = "256";	
		}
	}
	else if( 'Asymmetric' === encryptionType )
	{
		document.getElementById("encryptionKeyLength").value = '0';	
	}
	if(entityType != '0'|| onBehalf ==  true)
	{
		makeNiceSelect('encryptionKeyLength',true);
	}
}
function setSigningType()
{
	var encryptionType = document.getElementById("encryptionType").value;
	document.getElementById("singingType").innerHTML="";
	var option = document.createElement("option");
	document.getElementById("singingType").add(option);	
	option.text = getLabel("lbl.select","Select");
	option.value = "";
	if( 'Symmetric' === encryptionType )
	{
		option = document.createElement("option");
		document.getElementById("singingType").add(option);	
		option.text =getLabel("symmetric","Symmetric");
		option.value = "Symmetric";
		setSigningAlgo('Symmetric');
	}
	else if('Asymmetric' === encryptionType )
	{
		option = document.createElement("option");
		document.getElementById("singingType").add(option);	
		option.text = getLabel("asymmetric","Asymmetric");
		option.value = "Asymmetric";
		setSigningAlgo('Asymmetric');
	}
	if($("#singingType").is(":visible"))
	{
		if(entityType != '0'|| onBehalf ==  true)
			makeNiceSelect('singingType',true);
	}
}
function setSigningAlgo(signingType)
{
	var encryptionType = document.getElementById("encryptionType").value;
	var signAlgoms = ["CRC32","ALR32","MD5","SHA256"];
	document.getElementById("singingAlgo").innerHTML="";
	if( 'Symmetric' === signingType )
	{
		$('#divSigningAlgo').show();
		$('#divSigningKey').hide();
	}
	else if( 'Asymmetric' === signingType )
	{
		$('#divSigningAlgo').hide();
		$('#divSigningKey').show();
	}

	var option = document.createElement("option");
	document.getElementById("singingAlgo").add(option);	
	option.text = getLabel("lbl.select","Select");
	option.value = " ";
	if( 'Symmetric' === signingType )
	{
		for(var i=0 ; i < signAlgoms.length; i++)
		{
			option = document.createElement("option");
			document.getElementById("singingAlgo").add(option);	
			option.text = signAlgoms[i];
			option.value = signAlgoms[i];
		}
	}
	else if( 'Asymmetric' === encryptionType && 'Asymmetric' === signingType)
	{
		option = document.createElement("option");
		document.getElementById("singingAlgo").add(option);	
		option.text = getLabel("lbl.select","Select");
		option.value = " ";
	}
	else if(('Asymmetric' === signingType) && (encryptionType == '' || encryptionType == ' '))
	{
		option = document.createElement("option");
		document.getElementById("singingAlgo").add(option);	
		option.text = signAlgoms[3];
		option.value = signAlgoms[3];
	}
	if($("#singingAlgo").is(":visible"))
	{
		if(entityType != '0'|| onBehalf ==  true)
			makeNiceSelect('singingAlgo',true);
	}
}

function setFieldsForView()
{
	var encType = $('#encryptionType').val();
	$('#lblEncryptionKey').text(lblEncryptionKeyMap[encType]);
	
	if(encType == "Asymmetric")
	{
		document.getElementById("encryptkey_length").style.display = "none";
		$('#lblEncryptionAlgorithm').text(getLabel('vendor','Vendor')+':');
	}
	else
	{
		document.getElementById("encryptkey_length").style.display = "block";
		document.getElementById("encryptkey_algo").style.display = "block";
		$('#lblEncryptionAlgorithm').text(getLabel('encryptionalgo','Encryption Algorithm')+ ':');
	}
	var signingType = $('#singingType').val();
	if( 'Symmetric' === signingType ||  'S' === signingType)
	{
		$('#divSigningAlgo').show();
		$('#divSigningKey').hide();
	}
	else if( 'Asymmetric' === signingType ||  'A' === signingType)
	{
		$('#divSigningAlgo').hide();
		$('#divSigningKey').show();
	}
}