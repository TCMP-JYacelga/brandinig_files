var selectedEvents = new Array();
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
function submitForm(strUrl)
{
	var frm = document.forms["frmMain"];
	enableDisableForm(false);
	frm.action = strUrl;
	frm.method = "POST";
	frm.submit();
}


function enableDisableForm(boolVal) {
	$('#Std').attr('disabled', boolVal);
	$('#custom').attr('disabled', boolVal);
	$('#profileName').attr('disabled', boolVal);
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
function getCancelConfirmPopUp(strUrl) {
	if(dityBitSet)
	{
		$('#confirmMsgPopup').dialog({
			autoOpen : false,
			maxHeight: 550,
			minHeight:'auto',
			width : 400,
			modal : true,
			resizable: false,
			draggable: false
		});
		
		$('#confirmMsgPopup').dialog("open");
		
		$('#cancelBackConfirmMsg').bind('click',function(){
			$('#confirmMsgPopup').dialog("close");
		});
		
		$('#doneBackConfirmMsgbutton').bind('click',function(){
			$('#confirmMsgPopup').dialog("close");
			submitForm(strUrl);
		});
		
		$('#textContent').focus();
	}
	else
	{
	submitForm(strUrl);
	}
}
function getSelectEventPopup(module,strlink)
{
	$('#module').val(module);	
	// create buttons on popup
	var buttonsOpts = {};
	var profileValue;
	var elementType;
	if (modeVal != 'VIEW')
	{
		/*buttonsOpts[btnsArray['saveBtn']] = function() {
			$(this).dialog("close");
			$(document).ajaxStart($.blockUI).ajaxStop($.unblockUI);
			if (modeVal != 'ADD')// Save the events selected
			{
				var strData = {};
				strData['details'] = selectedEvents;
				$.ajax({
					method : 'POST',
					url : "services/chargeProfile/addDetails.json?$filter="
							+ module
							+ "&$id="
							+ encodeURIComponent(document
									.getElementById('viewState').value),
					data : {
						qfilter : JSON.stringify(strData)
					},
					dataType : 'json',
					success : function(data) {
						// update the count on UI
						var countMap = Ext.decode(data.responseText);

						if (null != data['subCount'])
							document.getElementById('subcount_' + module).innerHTML = data['subCount'];
						if (null != data['eventCount'])
							document.getElementById('eventcount_' + module).innerHTML = data['eventCount'];
						resetEventSelectionPopup();
						// refresh the events smartgrid
						if (null != objDetailGrid) {
							var grid = objDetailGrid.down('smartgrid');
							if (null != grid)
								grid.refreshData();
						}

					}
				});
			} else {
				// Autosave the profile and then save the events
				$('#selectedEvents').val(selectedEvents);
				$('#module').val(module);
				submitForm('saveChargeProfileMst.form');
			}
		};*/
		
		$('#saveBtn').bind('click',function(){
			$(this).attr('id','saveBtn1');
			$('#eventSelectionPopup').dialog("close");
			$(document).ajaxStart($.blockUI).ajaxStop($.unblockUI);
			if (modeVal != 'ADD')// Save the events selected
			{
				var strData = {};
				strData['details'] = selectedEvents;
				$.ajax({
					method : 'POST',
					url : "services/chargeProfile/addDetails.json",
					data : {
						$qfilter : JSON.stringify(strData),
						$id : encodeURIComponent(document.getElementById('viewState').value),
						$filter:$('#module').val()
					},
					dataType : 'json',
					success : function(data) {
						// update the count on UI
						var countMap = Ext.decode(data.responseText);
						if(null != data.parentIdentifier)
							document.getElementById('viewState').value = data.parentIdentifier;
						if (null != data['subCount'])
							document.getElementById('subcount_' + $('#module').val()).innerHTML = data['subCount'];
						if (null != data['eventCount'])
							document.getElementById('eventcount_' + $('#module').val()).innerHTML = data['eventCount'];
						resetEventSelectionPopup();
						// refresh the events smartgrid
						if (null != objDetailGrid) {
							var grid = objDetailGrid.down('smartgrid');
							if (null != grid)
								grid.refreshData();
						}
						if(data.error) {
							Ext.MessageBox.show({
								title : getLabel(
										'instrumentErrorPopUpTitle',
										'Error'),
								msg : data.error,
								buttons : Ext.MessageBox.OK,
								icon : Ext.MessageBox.ERROR
							});
						}
					}
				});
			} else {
				// Autosave the profile and then save the events
				$('#selectedEvents').val(selectedEvents);
				$('#module').val(module);
				submitForm('saveChargeProfileMst.form');
			}
			
		});	
	}
		
	
	/*buttonsOpts[btnsArray['cancelBtn']] = function() {
		$(this).dialog("close");
		resetEventSelectionPopup();
	};*/
	
	$('#cancelBtn').bind('click',function(){
		$('#eventSelectionPopup').dialog("close");
		resetEventSelectionPopup();
	});
	
	
	// Fetches the events and design the popup
	elementType = document.getElementById('profileName').tagName.toLowerCase();
	if(elementType == 'input')
		profileValue = document.getElementById('profileName').value;
	else if(elementType == 'span')
		profileValue = document.getElementById('profileName').innerHTML;
	if(profileValue)
	{
		
		var subArr = new Array();
		var eventArr = new Array();
			 var strUrl= "services/chargeProfile/availableDetails.json?$filter="+module+"&$id="+encodeURIComponent(document.getElementById('viewState').value);
			 var  objParam = {}, arrMatches, strRegex = /[?&]([^=#]+)=([^&#]*)/g;
			 while (arrMatches = strRegex.exec(strUrl)) {
					objParam[arrMatches[1]] = arrMatches[2];
				}
				strUrl = strUrl.substring(0, strUrl.indexOf('?'));
				
			$.ajax({
			        type: 'POST',	
			        url: strUrl,
					data:objParam,
					success: function(data)
					{
			           if (data!= null && data.d!= null && data.d.accounts!=null) 
					   {
						$('#eventSelectionPopup').dialog({
							autoOpen : false,
							maxHeight: 550,
							minHeight:156,
							width : 500,
							modal : true,
							resizable: false,
							draggable: false,
							title: (strlink == 'E' ? getLabel('Event','Events') : getLabel('Subscription','Subscription')),
							//buttons : buttonsOpts,
							beforeClose: function(event, ui) { 
					                $('#eventDiv').addClass('ui-helper-hidden');
					           		$('#subDiv').addClass('ui-helper-hidden');
					           	    $('#subListDiv').empty();
					           	    $('#eventListDiv').empty();
					            }
						});
					   var arr = data.d.accounts;
			        	  for (var i = 0;i<arr.length;i++)
			        	  {
			        		  if(module === arr[i].moduleCode)
			        		  {
			        			  if (arr[i].eventType == 'S' && strlink == 'S')
					        	  		subArr.push(arr[i]);
					        	  	if (arr[i].eventType == 'E' && strlink == 'E')
					        	  		eventArr.push(arr[i]);
			        		  }
			        	  	
			        	  }
			        	  
						  if (subArr.length > 0)
						  {
							$('#subDiv').removeClass('ui-helper-hidden');
							for (var i = 0;i<subArr.length;i++)
							  {
								var code = subArr[i].eventCode;
								var desc = subArr[i].eventDesc;
								
								var imgSource;
								if(subArr[i].assignmentStatus == 'Assigned'){
									imgSource = "static/images/icons/checked_nont7.png";																		
									//imgSource = "static/images/icons/icon_checked_grey.gif";
								}
								else if (modeVal == 'VIEW'){
									//imgSource = "static/images/icons/icon_unchecked_grey.gif";
									imgSource = "static/images/icons/checkbox.png";
								}
								else{
									//imgSource = "static/images/icons/icon_unchecked.gif";
									imgSource = "static/images/icons/checkbox.png";
								}
								var	eltImage = $('<img>').attr({
										'src' : imgSource,
										'id' : 'img_'+code,
										'width' : '14',
										'height' : '14',
										'border' : '14'
									});
								var	eltLabel = $('<span>').attr({
										'class' : 'topAlign'
									});
								eltLabel.html('&nbsp;'+desc);
								
								if(subArr[i].assignmentStatus == 'Assigned')
								{
									var	eltAnchor = $('<a>').attr({
										'href' : '#',
										'id' : "event_"+code
									}).append(eltImage,eltLabel);
								}
								else								
								{
									if (modeVal == 'VIEW')
									{
										var	eltAnchor = $('<a>').attr({
											'href' : '#',
											'id' : "event_"+code
										}).append(eltImage,eltLabel);
									}
									else
									{
										var	eltAnchor = $('<a>').attr({
											'href' : '#',
											'id' : "event_"+code
										}).append(eltImage,eltLabel).click(function() {
											toggleEventCheckbox($(this));
										});
									}
									
								}
								
									
								$('#subListDiv').append(eltAnchor);
								if (i < subArr.length-1)
								{
								$('#subListDiv').append("<br/><br/>");
								}
							  }
						  }
						  if (eventArr.length > 0)
						  {
							$('#eventDiv').removeClass('ui-helper-hidden');
							for (var i = 0;i<eventArr.length;i++)
							  {
								var code = eventArr[i].eventCode;
								var desc = eventArr[i].eventDesc;
								
								var imgSource;
								/*if(eventArr[i].assignmentStatus == 'Assigned')
									imgSource = "static/images/icons/icon_checked_grey.gif";
								else if (modeVal == 'VIEW')
									imgSource = "static/images/icons/icon_unchecked_grey.gif";
								else
									imgSource = "static/images/icons/icon_unchecked.gif";
								*/
								
								if(eventArr[i].assignmentStatus == 'Assigned'){
									imgSource = "static/images/icons/checked_nont7.png";																		
									//imgSource = "static/images/icons/icon_checked_grey.gif";
								}
								else if (modeVal == 'VIEW'){
									//imgSource = "static/images/icons/icon_unchecked_grey.gif";
									imgSource = "static/images/icons/checkbox.png";
								}
								else{
									//imgSource = "static/images/icons/icon_unchecked.gif";
									imgSource = "static/images/icons/checkbox.png";
								}
								
								var	eltImage = $('<img>').attr({
										'src' : imgSource,
										'id' : 'img_'+code,
										'width' : '14',
										'height' : '14',
										'border' : '14'
									});
								var	eltLabel = $('<span>').attr({
										'class' : 'topAlign'
									});
								eltLabel.html('&nbsp;'+desc);
							
				
								if(eventArr[i].assignmentStatus == 'Assigned')
								{
									var	eltAnchor = $('<a>').attr({
										'href' : '#',
										'id' : "event_"+code
									}).append(eltImage,eltLabel);
									
								}
								else								
								{
									if (modeVal == 'VIEW')
									{
										var	eltAnchor = $('<a>').attr({
											'href' : '#',
											'id' : "event_"+code
										}).append(eltImage,eltLabel);
									}
									else
									{
										var	eltAnchor = $('<a>').attr({
											'href' : '#',
											'id' : "event_"+code
										}).append(eltImage,eltLabel).click(function() {
											toggleEventCheckbox($(this));
										});
									}
								}							
								
									
								$('#eventListDiv').append(eltAnchor);
								if (i < eventArr.length-1)
								{
								$('#eventListDiv').append("<br/><br/>");
								}
							  }
						  }
						  // opens the popup
						  $('#eventSelectionPopup').dialog("open");
					   }
						else
							Ext.MessageBox.show({
								title : getLabel(
										'selectevent',
										'Select Subscription / Events'),
								msg : getLabel(
										'noEvent',
										'No Subscriptions or Events present!'),
								buttons : Ext.MessageBox.OK
								
							});
			        }
			});		
		
	}
	else{
		Ext.MessageBox.show({
			title : getLabel(
					'profileName',
					'Prodile Name'),
			msg : getLabel(
					'enterName',
					'Please Enter Profile Name'),
			buttons : Ext.MessageBox.OK
			
		});
	}
	
}
function toggleEventCheckbox(anchor)
{
	var imgElement = anchor.find('img');
	if (imgElement.attr('src').indexOf("checkbox.png") > -1)
	{
		imgElement.attr('src','static/images/icons/checked_nont7.png');	
		selectedEvents.push(imgElement.attr('id').substr(4));
	}
	else
	{
		imgElement.attr('src','static/images/icons/checkbox.png');
		selectedEvents.splice(selectedEvents.indexOf(imgElement.attr('id').substr(4)), 1 );
	}
}
function resetEventSelectionPopup()
{
	$('#eventDiv').addClass('ui-helper-hidden');
	$('#subDiv').addClass('ui-helper-hidden');
	$('#subListDiv').empty();
	$('#eventListDiv').empty();
	selectedEvents = new Array();
}