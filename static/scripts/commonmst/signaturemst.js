function setDirtyBit()
{
	dityBitSet=true;
}

jQuery.fn.SignatureMstAutoComplete= function(options) {
var settings = $.extend({signatureSeek:'seekId',
						 valueElementId: "elementId",
						 callBack: ''
					     }, options );
var seekId = settings.signatureSeek;
	return this.autocomplete({
					source : function(request, response) {
						var entityType = $('#entityType').val();
						var entityCode = $('#entityCode').val();
						
						$.ajax({
									url : "services/userseek/"+seekId+".json",
									type: "POST",
									dataType : "json",
									data : {
										'$autofilter' : request.term,
										'$filtercode1': entityType,
										'$filtercode2': entityCode,
										'$sellerCode': $('#sellerId').val()
									},
									success : function(data) {
										var rec = data.d.preferences;
										response($.map(rec, function(item) {
													return {														
														label :  seekId === 'signatureAccountNoSeek' ?item.CODE: (seekId === 'signatoryCodeSeek' ? item.CODE+'|'+item.DESCRIPTION : item.DESCRIPTION ),														
														bankDtl : item
													}
												}));
									}
								});
					},
					minLength : 1,
					select : function(event, ui) {
						var data = ui.item.bankDtl;
						$('#'+settings.valueElementId).val(data.CODE);
						if(seekId === 'signatureAccountNoSeek')
						{
							$(this).attr('oldValue', data.CODE);
							$(this).val(data.CODE);
						}
						else if(seekId === 'signatoryCodeSeek')
						{
							$(this).attr('oldValue',data.DESCRIPTION);
							$(this).val(data.DESCRIPTION);
							ui.item.value = data.DESCRIPTION;
							ui.item.label = data.DESCRIPTION;
						}
						else						
							$(this).attr('oldValue', data.DESCRIPTION);						
						var fnCallBack = settings.callBack;
						if(fnCallBack && typeof fnCallBack == 'function'){
							fnCallBack.call(this, null);
					      }
					},
					open : function() {
						$(this).removeClass("ui-corner-all")
								.addClass("ui-corner-top");
					},
					change : function() {
						if ( $(this).attr('oldValue') !==  $(this).val()) {
							$(this).val('');
							$('#'+settings.valueElementId).val('');
							var fnCallBack = settings.callBack;
							if(fnCallBack && typeof fnCallBack == 'function'){
								fnCallBack.call(this, null);
						     }
						}
					},
					close : function() {
						$(this).removeClass("ui-corner-top")
								.addClass("ui-corner-all");
					}
				});/*.data("autocomplete")._renderItem = function(ul, item) {
			var inner_html = '<a><ol class="t7-autocompleter"><ul  >'
					+ item.label + '</ul></ol></a>';
			ul.addClass('client_autocompleter');
			return $("<li></li>").data("item.autocomplete", item)
					.append(inner_html).appendTo(ul);
		};*/
}

function handleEntityTypeDependentFields(){
	$('#entityCodeDesc').val('');
	$('#entityCode').val('');
	handleEntityDepenentFields();
	resetEntityDependentFields();
	handleWhtFlag();
}

function resetEntityDependentFields(){
	$('#signatoryCodeDesc').val('');
	$('#signatoryCode').val('');
	handleAccountNumberField();
	handleSignatoryUserType($("input[name='signatoryUserType']:checked").val());
}

function handleAccountNumberField(){
	var entityType = $('#entityType').val();

	if ('CLIENT' === entityType) {
		$('#accountNumberDesc').prop('readonly', false);
		$('#accountNumberDescLbl').addClass('required-lbl-right');
	} else {
		$('#accountNumberDesc').prop('readonly', true);
		$('#accountNumberDescLbl').removeClass('required-lbl-right');
	}
	$('#accountNumberDesc').val('(ALL)')
	$('#accountNumber').val('(ALL)');
}

function handleWhtFlag(){
	var entityType = $('#entityType').val();

	if ('CLIENT' === entityType) {
		$('#whtChk').prop('src', 'static/images/icons/icon_unchecked.gif');
	} else {
		$('#whtChk').prop('src', 'static/images/icons/icon_unchecked_grey.gif');
		$('#whtSign').val('N');
	}
}
function handleEntityDepenentFields()
{
	var entityType = $('#entityType').val();
	if ('CLIENT' === entityType) 
	{
		$('#whtSignatoryFields').removeClass('hidden');
	}
	else
	{
		$('#whtSignatoryFields').addClass('hidden');
	}
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
			gotoPage(strUrl);
		});
		
		$('#textContent').focus();
	}
	else
	{
		gotoPage(strUrl);
	}
}

function saveSignatureMst(strUrl)
{
	var frm = document.forms["frmMain"];
	frm.action = strUrl;
	$("input").removeAttr('disabled');
	$("select").removeAttr('disabled');
	frm.target = "";
	frm.method = "POST";
	frm.submit();	
}

function showUploadDialog(hlnk) {
	var ctrlFile = document.getElementById('signatureFile');
	var ctrlImgUploadFlag = document.getElementById('signUploadFlag');
	
	var viewLink = document.getElementById('viewSignatureFile');
	if (_sinatureFileSelected) {
		$(hlnk).text('Choose Signature');
		$(hlnk).attr("title", 'Choose Signature');
		if(undefined != viewLink && null != viewLink)
		{
			viewLink.innerHTML = '';
		}
		if (!$.browser.msie) {
			ctrlFile.value = '';	
		} else {
			$("#signatureFile").replaceWith($("#signatureFile").val('').clone(true));
		}
		_sinatureFileSelected = false;
		ctrlImgUploadFlag.value = "N";
		$('#lblSelectedSignFile').text('No File Selected');
		setDirtyBit();
	} else {
		var dlg = $('#divFilUpload');
		dlg.dialog({
			bgiframe : true,
			autoOpen : false,
			height : "auto",
			modal : true,
			resizable : false,
			width : '400',
			hide : false
		});
		
		dlg.find('#cancelImportLogo .ft-button').off('click');
		dlg.find('#cancelImportLogo .ft-button').on('click', function() {
			if (!$.browser.msie) {
				ctrlFile.value = '';
			} else {
				$("#signatureFile").replaceWith(
						$("#signatureFile").val('').clone(true));
			}
			_sinatureFileSelected = false;
			$(hlnk).text('Choose Signature File');
			$(dlg).dialog('destroy');
			ctrlImgUploadFlag.value = "N";
		});
		dlg.find('#okImportLogo .ft-button').off('click');
		dlg.find('#okImportLogo .ft-button').on('click', function() {
			if (ctrlFile.value != null && ctrlFile.value != "") {
					var n = ctrlFile.value.lastIndexOf("\\");
					var fileName = ctrlFile.value.substring(n+1);
					var fileText = 'Remove Signature';
					var ft = fileText;
					
					$(hlnk).text(fileText + "..");
					$(hlnk).attr("title", ft);
					_sinatureFileSelected = true;
					ctrlImgUploadFlag.value = "Y";
					setDirtyBit();
				
			}
			$(dlg).dialog('close');
		});
		
		dlg.find('#chooseSignatureFile').off('click');
		dlg.find('#chooseSignatureFile').on('click', function() {
			$('#signatureFile').click();
		});
		
		dlg.find('#signatureFile').off('change');
		dlg.find('#signatureFile').on('change', function() {
			var filename = $('#signatureFile').val();
			if(filename) {
				$('#lblSelectedSignFile').text(filename.substring(filename.lastIndexOf('\\')+1));
			} else {
				$('#lblSelectedSignFile').text('No File Selected');
			}
			$('#lblSelectedSignFile').attr('title', filename); 
		});
		dlg.parent().appendTo($('#frmMain'));
		dlg.dialog('open');
	}
}

function viewSignatureAttachment(frmId) {
        var strUrl = 'signatureMst/viewSignatureAttachment.srvc?'+csrfTokenName + '=' + csrfTokenValue+'&viewState=' +
                        document.getElementById("viewState").value+'&displayViewChanges='+displayViewChanges;
        $.ajax({
            type : 'POST',
            url : strUrl,
            dataType : 'html',
            success : function( data ){
                $('#signatureImageDiv').html( '<img src="data:image/jpeg;base64,' + data + '"/>' );
                $('#signatureImageDiv').dialog(
                {
                    bgiframe : true,
                    autoOpen : false,
                    height : "600",
                    modal : true,
                    resizable : true,
                    width : "1000",
                    title : 'Signature',
                    buttons :
                    {
                        "OK" : function()
                        {
                            $( this ).dialog("close");
                        },   
                    },
                });
				$('#dialogMode').val('1');
				$('#signatureImageDiv').dialog('open');
            },
			error : function(request,status,error)
			{
				$( '#signatureImageDiv').html( '<img src="./static/images/misc/no_image.jpg"/>');
				$( '#signatureImageDiv').dialog(
				{
					bgiframe : true,
					autoOpen : false,
					height : "340",
					modal : true,
					resizable : true,
					width : "300",
					zIndex: '29001',
					title : 'Signature',
					buttons :
					{
						"Cancel" : function()
						{
							$(this).dialog("close");
						}
					}
				} );
				$('#dialogMode').val('1');
				$('#signatureImageDiv').dialog('open');
			}
        });
}

function toggleCheckUncheck(imgElement,flag) 
{
	if (imgElement.src.indexOf("checked_grey.gif") > -1){
		return false;
	}
	
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

function viewChanges(strUrl)
{
	console.log(strUrl);
	var frm = document.forms["frmMain"];
	frm.appendChild(createHTMLFormField('INPUT', 'HIDDEN',
			'VIEW_MODE', "VIEW_CHANGES"));
	frm.action = strUrl;
	frm.target = "";
	frm.method = "POST";
	frm.submit();	
}

function createHTMLFormField(element, type, name, value) 
{
	var inputField;
	inputField = document.createElement(element);
	inputField.type = type;
	inputField.name = name;
	inputField.value = value;
	return inputField;
}

function goToPage(strUrl) {
	var frm = document.forms["frmMain"];
	frm.action = strUrl;
	frm.target = "";
	frm.method = "POST";
	frm.submit();
}

function handleSignatoryUserType(value)
{
	var entityType = $('#entityType').val();
	if ('SYSBRANCH' === entityType) {
		$('#newUserType').removeClass('disabled');
		$("#newUserType").removeAttr('disabled');
		$('#existingUserType').removeClass('disabled');
		$('#existingUserType').removeAttr('disabled');
		toggleRadioButton(value);
	}
	else
	{
		$('#newUserType').addClass('disabled');
		$('#newUserType').prop('disabled', true);
		$('#existingUserType').addClass('disabled');
		$('#existingUserType').prop('disabled', true);
		toggleRadioButton('R');
	}
}

function toggleRadioButton(value)
{
	if (value == 'N') {
		$('#signatoryCodeN').show();
		$('#signatoryCodeR').hide();
		$('#newUserType').prop('checked', true);
	} else {
		$('#signatoryCodeR').show();
		$('#signatoryCodeN').hide();
		$('#existingUserType').prop('checked', true);
	}
}