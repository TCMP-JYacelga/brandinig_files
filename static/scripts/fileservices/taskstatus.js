	jQuery.fn.CorporationAutoComplete = function() {
		return this.each(function() {
			$(this).autocomplete({
				source : function(request, response) {
					$.ajax({
								url : "services/userseek/userclients.json?$top=20",
								dataType : "json",
								data : {
									$autofilter : request.term,
									$sellerCode : $('#paramSellerCode').val()
								},
								success : function(data) {
									var rec = data.d.preferences;
									if(entityType=='1')
									{
										response($.map(rec, function(item) {
													return {
														label :item.DESCR,
														value : item.DESCR,
														code : item.CODE
													}
												}));
									}
									if(entityType=='0')
									{
										if(cponclientCode!=undefined && cponclientCode =='N')
										{
											response($.map(rec, function(item) {
													return {
														label : item.SHORTNAME+' '+item.DESCR,
														value : item.DESCR,
														code : item.CODE
													}
												}));
										}
										else
										{
											response($.map(rec, function(item) {
													return {
														label : item.CODE+' '+item.DESCR,
														value : item.DESCR,
														code : item.CODE
													}
												}));
										}
									}
								}
							});
				},
				minLength : 1,
				select : function(event, ui) {
					var val = ui.item.code;
					$('#paramClientCode').val(ui.item.code);
					$('#ahtskClientDesc').val(ui.item.label);
					$('#ahtskclient').val(ui.item.code);
					loadDropDownTypes();
					clientParam = ui.item.code ;
					//$('#selectedClientCode').val(ui.item.value);
					//$('#selectedSellerCode').val($('#paramSellerCode').val());
					//getUploadParam('taskStatusListParam.srvc');
				},
				open : function() {
					$(this).removeClass("ui-corner-all").addClass("ui-corner-top");
				},
				close : function() {
					$(this).removeClass("ui-corner-top").addClass("ui-corner-all");
				}
			});/*.data("autocomplete")._renderItem = function(ul, item) {

				var inner_html = '<a><ol class="t7-autocompleter"><ul>'
						+ item.label
						+ '</ul>'
						+ '</ol></a>';
				return $("<li></li>").data("item.autocomplete", item)
						.append(inner_html).appendTo(ul);
			};*/
		});
	};
	function showInstHeaderList(me) {
		$('#advanceFilterInst').appendTo('#frmMain');
		$('#advanceFilterInst').hide();
		if (me.value == "0") {
			$('#myProduct').val('');
			$('#qryPhdReference').val('');
			$('#txnCurrency').val('');
			$('#PHDTotalAmountFilterOption').val('');
			$('#amount').val('');
			$('#filename').val('');
			$('#activationDate').val('');
			$('#AccountNo').val('');
			$('#fileName').val('');
			$('#drawerDescription').val('');
			$('#micrNo').val('');
		}
		var frm = document.forms["frmMain"];
		if ("C" == strMstType)
			strUrl = 'collTaskStatusList.form';
		else if ("P" == strMstType)
			strUrl = 'taskStatusList.form';
		else if ("I" == strMstType)
			strUrl = 'invoiceTaskStatusList.form';

		frm.action = strUrl;
		frm.target = "";
		frm.method = "POST";
		frm.submit();
	}

	function showImportFilePopUp() {
		this.loadDropDownTypes();
		$("#uploadBtn").addClass("ft-button ft-button-primary");
		$('#uploadBtn').attr('disabled','disabled');
		var filename = $('#file').val();
		if(filename) {
			$('#lblSelectedFileName').html("No file selected");
			$('#file').val('');
		}
		var dlg = $('#uploadInstrumentFile');
		//var btnsArr = {};

		if(entityType == 0)
		{
			clearImportFilePopup();
		}
		/*btnsArr[labels.uploadBtn] = function() {
			saveUploadedFile($(this));
		};

		btnsArr[labels.cancelBtn] = function() {
			$(this).dialog('close');
		};*/
		dlg.dialog({
					bgiframe : true,
					autoOpen : false,
					//height : "auto",
					minHeight:156, 
					//maxHeight:550,
					modal : true,
					resizable : false,
					draggable: false,
					width : 650,
				title : "File Upload"
				//	buttons : btnsArr
				});
		// Cancel: function() {$(this).dialog('close');}}});
		dlg.dialog('open');
		$('#uploadErrors').empty();
		$('#uploadErrors').removeClass('ft-error-message');
		$('#uploadInstrumentFile :input:not(:button):not(:hidden)').val('');
		$("#clientMapCode").blur();
	if(entityType == 1)
	{
		$("#clientMapCode").niceSelect();
		$("#clientMapCode").niceSelect('update');
		$('#clientMapCode-niceSelect').bind('blur', function () {
			markRequired($(this));
		});
		$('#clientMapCode-niceSelect').on('focus', function () {
			removeMarkRequired($(this));
		});
	
		$('#uploadBtn').bind('keydown', function () {
			autoFocusOnFirstElement(event, 'uploadInstrumentFile', false);
		});
		$('#btnCancel').bind('keydown', function () {
			if($('#uploadBtn').is(':disabled'))
				{
					autoFocusOnFirstElement(event, 'uploadInstrumentFile', false);
	}
		});
		autoFocusOnFirstElement(null, 'uploadInstrumentFile', true);
	}
}
	function clearImportFilePopup()
	{
		var entityTypeBtn = document.getElementsByName("filterEntityType");
		if(entityTypeBtn != 'undefined')
		{
			entityTypeBtn[ 0 ].checked = true;
		}
		onChangeEntityType('BANK')
	}
	function enableImportBtn() {
		if (($('input[type=file]').val() != '')) {
			// $(this).dialog().find('button:contains("Cancel")').css('disabled',true);;
		}
	}

	function saveUploadedFile(refPopUp) {
		var formdata = new FormData();
	countr = 0;
		var tokenValue = document.getElementById(csrfTokenName).value;
		formdata.append("file", document.getElementsByName('file')[0].files[0]);
		formdata.append("paramSellerCode", $("#paramSellerCode").val());
		formdata.append("paramClientCode", $("#paramClientCode").val());
		formdata.append("clientMapCode", $("#clientMapCode").val());
		formdata.append("ahtskclient", $("#ahtskclient").val());
		formdata.append(csrfTokenName, tokenValue);
		if(strSelectedPayPackage) {
			formdata.append(strPaymentCategory, strPaymentCategory);
			formdata.append('txtCode', strSelectedPayPackage);
		}
		
		for (i = 0; i < countofParams; i++) {
			var ipName= "processParameterBean"+i+".parameterName";
			var ipValue= "processParameterBean"+i+".value";
			var postingIpName = "processParameterBean["+i+"].parameterName";
			var postinIpValue = "processParameterBean["+i+"].value";
			var ipNameVal = document.getElementById(ipName).value;
			var ipValueVal = document.getElementById(ipValue).value;
			formdata.append(postingIpName, ipNameVal);
			formdata.append(postinIpValue, ipValueVal);
		}
		
		var strUrl = (strPaymentCategory) ? 'services/' + strPaymentCategory.toLowerCase() + '/uploadFile.srvc' : 'services/payCategory/uploadFile.srvc';
		
		$.ajax({
					url : strUrl,
					type : 'POST',
					processData : false,
					contentType : false,
					data : formdata,
					complete : function(XMLHttpRequest, textStatus) {
						// if ("error" == textStatus) {
						// TODO : Error handling to be done.
						// alert("Unable to complete your request!");
						// }
					},
					beforeSend: function (response) {
						$('#uploadInstrumentFile').block({
							message : 'Processing your request...'
						});
					},	
					success : function(response) {
						var myJSONObject = response;
						var isSuccess = response.success;
						var errorsList = response.errors;
						if (isSuccess && isSuccess == 'N') {
							displayErrors(errorsList);
						} else if(response && response.d && response.d.auth && response.d.auth === 'AUTHREQ') {
							$('#uploadInstrumentFile').unblock();

						} else {
							refPopUp.dialog('close');
							$('#uploadErrors').empty();
							$(document).trigger('refresh');
						}
						if(!(response && response.d && response.d.auth && response.d.auth === 'AUTHREQ')) {
							$('#uploadInstrumentFile').unblock();
							if(!errorsList)
							{
								$('#uploadInstrumentFile').dialog('close');
								$(document).trigger("refreshData");
						intervalFlag = true;
							}
						}
					},
					failure : function(response) {
					}
				});
	}
	function displayErrors(errorList) {
		$('#uploadErrors').empty();
		$('#uploadErrors').addClass('ft-error-message');	
		var ObjUl = $('<ul></ul>');
		var Objspan = $('<span class="ft-bold-font">ERROR:</span>');
		$('#uploadErrors').append(Objspan);
		$('#uploadErrors').append(ObjUl);
		$.each(errorList, function(index, data) {
					if ($('#uploadErrors')) {
						var Objli = $('<li></li>');
						Objli.text(data.code +' : '+data.errorMessage);
						ObjUl.append(Objli);
						//label.css('color','red');
						//$('#uploadErrors').append(label);
					}
				});

	}
	function onChangeEntityType(entityType)
	{
		if(entityType == 'BANK')
		{
			$( '#impClientDiv' ).attr( "class", "hidden" );
			$( '#impClientDiv' ).removeClass( "row" );
			
			$("#ahtskclient").val('');
			loadDropDownTypes();
		}
		else
		{
			$( '#impClientDiv' ).attr( "class", "block" );
			$( '#impClientDiv' ).addClass( "row" );
			$("#sellerId").val(sessionSellerCode);
			populateClientList(sessionSellerCode);
			$("#paramsListImport").empty();
			$("#clientMapCode").empty();
			if(clientCount == 1)
			{
				loadDropDownTypes();
			}
		}
	}
	function loadDropDownTypes() {
		var sellerVal = null;
		var clientVal = null;
		if(entityType=="0"){
			sellerVal=$('#sellerId').val();
			clientVal=$('#ahtskclient').val();
		}
		else
		{
			sellerVal=sessionSellerCode;
			clientVal=$('#ahtskclient').val();
			if(clientVal=='')
			{
				clientVal=sessionClientCode; 
			}
		}
		$.ajax({
					url : "./getInterfaceMapCodes.srvc",
					async : false,
					type : "GET",
					context : this,
					error : function() {
					},
					dataType : 'json',
					data : {
						sellerCode : sellerVal,
						clientCode : clientVal,
					},
					success : function(response) {
						$("#clientMapCode").empty();
						var paramsListImportDiv =  $("#paramsListImport");
						paramsListImportDiv.empty();
						$('#clientMapCode').append($("<option></option>").attr(
													"value", '').text(getLabel("select","Select")));
						$.each(response, function(key, val) {
									$('#clientMapCode')
											.append($("<option></option>").attr(
													"value", key).text(val));
								});
						$("#paramSellerCode").val(sessionSellerCode);
						$("#paramClientCode").val(sessionClientCode);
						$("#sellerId").val(sessionSellerCode);
						$('#clientMapCode').niceSelect('update');
						// $("#ahtskClientDesc").val(clientDesc);
						loadDropDownTypesDetails();
					}
				});
	}

	function loadDropDownTypesDetails() {
		if(entityType=="0") {
			sellerVal=$('#sellerId').val();
			clientVal=$('#ahtskclient').val();
		} else {
			sellerVal=sessionSellerCode;
			clientVal=sessionClientCode; 
		}
		$.ajax({
			url : "./getInterfaceMapCodesDetails.srvc",
			async : false,
			type : "GET",
			context : this,
			error : function() {},
			dataType : 'json',
			data : {
				sellerCode : sellerVal,
				clientCode : clientVal,
			},
			success : function(response) {
				interfaceMapDetails = response;
				$.each(response, function(key, val) {
					interfaceMapDetails[key] = val;
				});
			}
		});
	}

	function loadParameters(selectRef) {
		var clientMapCode = selectRef.value;
	$('#clientMapCode').prop('title', '');
	if(!Ext.isEmpty(clientMapCode))
	{
		$('#clientMapCode').prop('title', $("#clientMapCode option:selected").text()); 
	}	
		var strUrl = "./getProcessParamList.srvc";
		countofParams = 0 ;
		$.ajax({
					url : strUrl,
					async : false,
					type : "GET",
					context : this,
					error : function() {
					},
					dataType : 'json',
					data : {
						clientMapCode : clientMapCode,
						csrfTokenName : document
								.getElementById(csrfTokenName).value
					},
					success : function(response) {
						
						var jsonArr = response.d;
						var paramsListImportDiv =  $("#paramsListImport");
						paramsListImportDiv.empty();
						if(!Ext.isEmpty(jsonArr))
						{
						countofParams = jsonArr.length;
						createParamElements(jsonArr);
						}
					}
				});
		
		var selectedInterfaceMap = interfaceMapDetails[clientMapCode];
		if(selectedInterfaceMap && selectedInterfaceMap.MODULE_CODE && selectedInterfaceMap.MODULE_CODE === '02') {
			strPaymentCategory = selectedInterfaceMap.CATEGORY;
			strSelectedPayPackage = '';
		} else {
			strPaymentCategory = '';
			strSelectedPayPackage = '';
		}
	}

	function createParamElements(jsonArr){
		$.each(jsonArr,function(index,jsonValue){
			var divRow = $('<div class="row"></div>');
			var divCol1 = $('<div class="col-sm-6"></div>');
			var divCol1Child = $('<div></div>');
			var divCol2 = $('<div class="form-group"></div>');
			var divCol2Child = $('<div></div>');
			divRow.appendTo($("#paramsListImport"));
			divCol1.appendTo(divRow);
			divCol1Child.appendTo(divCol1);
			divCol2.appendTo(divCol1);
			createLabelForParam(divRow,divCol1Child,index,jsonValue);
			createComponentForParam(divRow,divCol2,index,jsonValue);
			var popupDiv = createPopup(index);
			popupDiv.appendTo($("#seekSelectionPopup"));
		});
	}

	function createPopup(index){
		$("#seekSelectionPopup_"+index).remove();
		var div = $("<div id='seekSelectionPopup_"
				+ index
				+ "' class='ui-helper-hidden autowidth ux-dialog'><div id='messageContentAddUsingRecDiv_"
				+ index
				+ "'></div><div class='row'><div class='form-group'><div class='col-sm-6'><label for='paramDesc' class='frmLabel ux_w135' style='width:80px;'><spring:message code='seek.rcheader.desc' htmlEscape='true' javaScriptEscape='true'/></label><input id='seekSelectionCriteria_"
				+ index
				+ "' class='ui-suggestion-box  form-control popup-searchBox' placeholder=' Name' type=text style='margin-left: 4px;' ></input></div><br><br><div class='col-sm-12 form-group' style='margin-top:5px;'><div id='seekSelectionGrid_"
				+ index + "' class='t7-grid'></div></div></div></div></div>");
		return div;
	}

	function createLabelForParam(divRow,divColRef,index, jsonValue) {
		var labelText = '';
		var labelCss = 'frmLabel';
		var posIndex = index+1;
		if ((jsonValue.filterDataType != null && jsonValue.filterDataType == 'DECIMAL')
				|| (jsonValue.paramDataType != null && jsonValue.paramDataType == 'DECIMAL')) {
			labelText = jsonValue.parameterDesc + " (###0.00) ";
		} else if (jsonValue.filterDataType == 'DATE'
				|| jsonValue.paramDataType == 'DATE') {
			labelText = jsonValue.parameterDesc + " (DD-MM-YYYY) ";
		} else {
			labelText = jsonValue.parameterDesc;
		}
		if(jsonValue != null && (jsonValue.isRequired != null && jsonValue.isRequired == true))
			labelCss = 'frmLabel required';
			
		$("<label>").addClass(labelCss).attr({
					"id" : "label_" + index
				}).html(" " + labelText).appendTo(divColRef);
	}

function setDepDropdowns(index, jsonValue)
{
	var nextDropDownObj;
	for(i = index + 1 ; i < 10 ; i++)
	{
		nextDropDownObj = document.getElementById('processParameterBean' + i + 'desc');
		if( nextDropDownObj )
		{
			setDropdownValues(nextDropDownObj, i, jsonValue, true,
					document.getElementById('processParameterBean' + i + '.parameterName').value);
		}
		else
		{
			break;
		}
	}
}

function setDropdownValues(passedObj, index, jsonValue, isOnChange, paramName)
{
	var currObj, opt, jParamName;
	if(isOnChange)
	{
		currObj = passedObj;
		jParamName = paramName;
	}
	else
	{
		currObj = passedObj[0];
		jParamName = jsonValue.parameterName;
	}
	
	$(currObj).empty();
	opt = document.createElement("option");
	opt.value = '';
	opt.text = 'Select';
	currObj.options.add(opt);
	
	var arrJson = getDepFieldsJSON(index);
	if(arrJson == null)
		arrJson = '';
	$.ajax(
	{
		url : "./getPopUpValues.srvc",
		async : false,
		type : "GET",
		context : this,
		error : function(){},
		dataType : 'json',
		data :
		{
			parameterName : jParamName,
			interfaceCode : jsonValue.interfaceCode,
			processCode : jsonValue.processCode,
			dependentFeildsJSON : arrJson,
			client : $('#ahtskclient').val(),
			'$top' : -1,
			csrfTokenName : document
					.getElementById(csrfTokenName).value
		},
		success : function(response)
		{
			if( response.d != null )
			{
				var data = response.d.preferences;
				if( data != null && data.length > 0 )
				{
					for( var i = 0 ; i < data.length ; i++ )
					{
						opt = document.createElement("option");
						opt.value = data[i].PARAMETER_CODE;
						opt.text = data[i].PARAMETER_DESC;
						currObj.options.add(opt);
					}
				}
			}
			if(entityType == 1)
			{
				makeNiceSelect(currObj.id, true);
			}
		},
		failure : function(response)
		{
			console.log(response);
		}
	});
}

function getDepFieldsJSON(index)
{
	var arrJson = [];
	for (i = 0; i < index; i++) 
	{
		var ipName= "processParameterBean"+i+".parameterName";
		var ipValue= "processParameterBean"+i+".value";
		if(document.getElementById(ipName) != null 
				&& document.getElementById(ipValue) != null)
		{
			var ipNameVal = document.getElementById(ipName).value;
			var ipValueVal = document.getElementById(ipValue).value;
			
			arrJson.push({
				parameterName : ipNameVal,
				value : ipValueVal
				});
		}
	}
	return arrJson.length > 0 ? JSON.stringify(arrJson) : null ;
}

	function createComponentForParam(divRow,divColRef,index,jsonValue){
		var posIndex = index+1;
	var selectHTML;
		if (jsonValue.lovType == 'N' || jsonValue.derivationType == 'Q' || jsonValue.listOfValueType=='LA'
			|| jsonValue.listOfValueType == 'LM' && jsonValue.listOfValueType == 'LS')
	{
		if (jsonValue.parameterName == 'P_CLIENT_CODE')
		{
				$('<input>').addClass("form-control").attr({
	//						type : 'hidden',
							id : 'processParameterBean' + index + '.value',
						name : 'processParameterBean[' + index + '].value',
						tabindex: '1'
					}).on('blur', function() {
						if(jsonValue != null && (jsonValue.isRequired != null && jsonValue.isRequired == true))
						{
							if(entityType == 1)
								markRequired($(this));
						}
					}).on('focus', function() {
						if(jsonValue != null && (jsonValue.isRequired != null && jsonValue.isRequired == true))
						{
							if(entityType == 1)
								removeMarkRequired($(this));
						}
						}).appendTo(divColRef);
		}
		else
		{
			selectHTML= $("<select class='form-control'><option value=''>Select</option></select>");	
			selectHTML.addClass("w12").attr({
	//						type : 'hidden',
						id : 'processParameterBean' + index + 'desc',
						name : 'processParameterBean[' + index + ']desc',
						value : jsonValue.parameterName
				}).on('change', function()
				{
					document.getElementById('processParameterBean'+index+'.value').value = this.value;
					setDepDropdowns(index, jsonValue);
				}).on('blur', function()
				{
					if(jsonValue != null && (jsonValue.isRequired != null && jsonValue.isRequired == true))
					{
						if(entityType == 1)
							markRequired($(this));
					}
				}).on('focus', function()
				{
					if(jsonValue != null && (jsonValue.isRequired != null && jsonValue.isRequired == true))
					{
						if(entityType == 1)
							removeMarkRequired($(this));
					}
						}).appendTo(divColRef);

			setDropdownValues(selectHTML, index, jsonValue, false, null);
				
				$('<input>').attr({
					type : 'hidden',
					id : 'processParameterBean' + index + '.parameterName',
					name : 'processParameterBean[' + index + '].parameterName',
					value : jsonValue.parameterName
				}).appendTo(divColRef);
						
				$('<input>').attr({
							type : 'hidden',
				id : 'processParameterBean' + index + '.value',
				name : 'processParameterBean[' + index + '].value',
				value : ''
						}).appendTo(divColRef);
		}
	}
	else if (jsonValue.derivationType == 'S')
	{
		selectHTML= $("<select class='form-control'><option value=''>Select</option></select>");	
		selectHTML.addClass("w12").attr({
//						type : 'hidden',
						id : 'processParameterBean' + index + '.desc',
						name : 'processParameterBean[' + index + '].desc',
						value : jsonValue.parameterName
			}).on('change', function()
			{
				document.getElementById('processParameterBean'+index+'.value').value = this.value;
				setDepDropdowns(index, jsonValue);
			})
			.on('blur', function()
			{
				if(jsonValue != null && (jsonValue.isRequired != null && jsonValue.isRequired == true))
				{
					if(entityType == 1)
						markRequired($(this));
				}
			}).on('focus', function()
			{
				if(jsonValue != null && (jsonValue.isRequired != null && jsonValue.isRequired == true))
				{
					if(entityType == 1)
						removeMarkRequired($(this));
				}
						}).appendTo(divColRef);
						
		setDropdownValues(selectHTML, index, jsonValue, false, null);
				
				$('<input>').attr({
							type : 'hidden',
							id : 'paramList',
							name : 'paramList',
							value : ''
						}).appendTo(divColRef);	
						
				$('<input>').attr({
							type : 'hidden',
							id : 'mapCode',
							name : 'mapCode',
							value : ''
						}).appendTo(divColRef);	
						
				$('<input>').attr({
							type : 'hidden',
							id : 'mapCodeCat',
							name : 'mapCodeCat',
							value : ''
						}).appendTo(divColRef);		

				var isPayPackagePopup = (jsonValue.parameterName.toUpperCase() === 'P_MY_PRODUCT') ? true : false;
				
				appendSeeklink(divColRef,index,jsonValue.listOfValueType, isPayPackagePopup);					
			
		} else if (jsonValue.derivationType == 'S') {
			
			var selectHTML= $("<select class='form-control'><option>Select</option></select>");	
			 selectHTML.addClass("w12").attr({
							type : 'hidden',
							id : 'processParameterBean' + index + '.parameterName',
							name : 'processParameterBean[' + index + '].parameterName',
							value : jsonValue.parameterName
				}).appendTo(divColRef);
				
			$('<input>').attr({
							type : 'hidden',
							id : 'processParameterBean' + index + '.value',
							name : 'processParameterBean[' + index + '].value',
							value : ''
						}).appendTo(divColRef);		
	}
	else
	{
			 $('<input>').addClass("form-control").attr({
							//type : 'hidden',
							id : 'processParameterBean' + index + '.parameterName',
							name : 'processParameterBean[' + index + '].parameterName',
							value : jsonValue.parameterName
				}).appendTo(divColRef);
				
			$('<input>').attr({
							type : 'hidden',
							id : 'processParameterBean' + index + '.value',
							name : 'processParameterBean[' + index + '].value',
							value : ''
						}).appendTo(divColRef);		
		}
	}
	function appendSeeklink(divColRef,index,listOfValueType, isPayPackagePopup){
		var anchorHTML='';
		var sellerVal = '';
		var clientVal = ''
		if(entityType=="0"){
			
			clientVal=$('#ahtskclient').val();
		}
		
		if(Ext.isEmpty(listOfValueType)){
			listOfValueType = '';
		}
		if(listOfValueType=='LM')
		{
			anchorHTML= '<a style="margin-left:5px;" id="anchor0" onclick="javascript:paramVal('+index+');showFileUploadSeekSelectionPopup('+index+',true,document.getElementById(\'processParameterBean'+index+'.parameterName\').value,\'processParameterBean'+index+'.desc\',\'processParameterBean'+index+'.value\'); " href="#"><i class="fa fa-search" aria-hidden="true"></i></a>';
			
			$('<input>').attr({
							type : 'hidden',
							id : 'processParameterBean' + index + '.value_multipleSelectRecords',
							name : 'processParameterBean' + index + '.value_multipleSelectRecords',
							value : ''
						}).appendTo(divColRef);
						
		}
		else if(listOfValueType=='LA'){
			anchorHTML= '<a style="margin-left:5px;" id="anchor0" onclick="javascript:paramVal('+index+');showFileUploadSeekSelectionPopupPopup('+index+',true,document.getElementById(\'processParameterBean'+index+'.parameterName\').value,\'processParameterBean'+index+'.desc\',\'processParameterBean'+index+'.value\');" href="#"><i class="fa fa-search" aria-hidden="true"></i></a>';
		}
		else{
			anchorHTML= '<a style="margin-left:5px;" id="anchor0" onclick="javascript:paramVal('+index+');showFileUploadSeekSelectionPopup('+index+',true,document.getElementById(\'processParameterBean'+index+'.parameterName\').value,\'processParameterBean'+index+'.desc\',\'processParameterBean'+index+'.value\',\'processParameterBean'+index+'.parameterName\',\'repcode_'+index+'\',\'repparam_'+index+'\','+ isPayPackagePopup + ');" href="#"><i class="fa fa-search" aria-hidden="true"></i></a>';
			
		}
		
		divColRef.append(anchorHTML);
	}
	function showUploadPopup(isReload, fptrCallback, calledfrom, sellerCode,
			clientCode, clientDesc) {
		var strUrl;
		if ("P" == strMstType) {
			if (calledfrom == "EXTJS") {
				// strUrl = "uploadInstrFileParam.srvc";
				strUrl = "uploadInstrFileNew.srvc";
			} else
				strUrl = "uploadInstrFileParam.formx";
		} else if ("C" == strMstType) {
			strUrl = "uploadCollInstrFile.form";
		} else if ("I" == strMstType)
			strUrl = 'uploadInvoiceInstrFile.form';

		if (!isReload) {
			$.ajax({
				url : "./getInterfaceMapCodes.srvc",
				async : false,
				type : "GET",
				context : this,
				error : function() {
				},
				dataType : 'json',
				data : {
					sellerCode : sellerCode,
					clientCode : clientCode,
					csrfTokenName : document.getElementById(csrfTokenName).value
				},
				success : function(response) {
					$("clientMapCode").empty();
					$.each(response, function(key, val) {
								$('#clientMapCode').append($("<option></option>")
										.attr("value", key).text(val));
							});
					$("#paramSellerCode").val(sellerCode);
					$("#paramClientCode").val(clientCode);
					$("#sellerId").val(sellerCode);
					$("#ahtskClientDesc").val(clientDesc);
				}
			});
			$("#sellerId").val(sellerCode);
			$("#ahtskClientDesc").val(clientDesc);
			var frm = document.forms["frmMain"];
			frm.action = "uploadInstrFileNew.srvc";
			frm.paramFlag.value = 'Y';
			frm.method = "POST";
			frm.submit();
		}
		var dlg = $('#uploadInstrumentFile');
		var btnsArr = {};
		if (($('input[type=file]').val() != '')) {
			btnsArr[labels.uploadBtn] = function() {
				$(this).dialog("close");
				fptrCallback.call(null, strUrl);
			};
		}
		btnsArr[labels.cancelBtn] = function() {
			$(this).dialog('close');
		};
		dlg.dialog({
					bgiframe : true,
					autoOpen : false,
					height : "auto",
					modal : true,
					resizable : false,
					width : 600,
					title : labels.uploadFile,
					buttons : btnsArr
				});
		// Cancel: function() {$(this).dialog('close');}}});
		dlg.dialog('open');
	}
	function showExportPopup(fptrCallback) {

		var dlg = $('#exportInstrumentFile');
		var btnsArr = {};
		btnsArr['OK'] = function() {
			showTxnReport();
			$(this).dialog("close");
		};
		btnsArr[labels.cancelBtn] = function() {
			$(this).dialog('close');
		};
		dlg.dialog({
					bgiframe : true,
					autoOpen : false,
					height : "auto",
					modal : true,
					resizable : false,
					width : 570,
					title : labels.exportFile,
					buttons : btnsArr
				});
		// Cancel: function() {$(this).dialog('close');}}});
		dlg.dialog('open');
	}

	function showAdvancedFilter(fptrCallback) {
		var dlg = $('#advanceFilter');
		var strUrl;
		if ("C" == strMstType)
			strUrl = "collTaskStatusList.form";
		else if ("P" == strMstType)
			strUrl = "taskStatusList.form";
		else if ("I" == strMstType)
			strUrl = "invoiceTaskStatusList.form";

		dlg.dialog({
					bgiframe : true,
					autoOpen : false,
					height : "auto",
					modal : true,
					resizable : true,
					width : 540,
					title : 'Advanced Filter',
					buttons : {
						"Continue" : function() {
							$(this).dialog("close");
							fptrCallback.call(null, 'taskStatusList.form');
						},
						"Save & Filter" : function() {
							if (document.getElementById('saveAs').value == '') {
								alert("Plase provide a filter name");
								return false;
							};
							$(this).dialog("close");
							fptrCallback.call(null, 'taskStatusList.form');
						},
						"Reset All" : function() {
							resetAll()
						},
						Cancel : function() {
							$(this).dialog('close');
						}
					}
				});
		dlg.dialog('open');
	}

	function uploadFile(strUrl) {
		$('#uploadInstrumentFile').appendTo('#frmMain');
		$('#uploadInstrumentFile').hide();
		var frm = document.forms["frmMain"];
		var strUrl;
		if ("C" == strMstType)
			strUrl = 'uploadCollInstrFile.form';
		else if ("P" == strMstType)
			strUrl = 'uploadInstrFileNew.srvc';
		else if ("I" == strMstType)
			strUrl = 'uploadInvoiceInstrFile.form';
		frm.action = strUrl;
		frm.paramFlag.value = 'N';
		frm.method = "POST";
		frm.submit();
	}
	function showWelcomePage() {
		window.location = "/WEB-INF/secure/welcome.jsp";
	}

	function showList(strUrl) {
		window.location = strUrl;
	}

	function showHistoryForm(strUrl, index) {
		var intTop = (screen.availHeight - 300) / 2;
		var intLeft = (screen.availWidth - 400) / 2;
		var strAttr = "dependent=yes,scrollbars=yes,";
		strAttr = strAttr + "left=" + intLeft + ",";
		strAttr = strAttr + "top=" + intTop + ",";
		strAttr = strAttr + "width=390,height=300";

		var frm = document.forms["frmMain"];
		document.getElementById("txtIndex").value = index;
		frm.action = strUrl;
		frm.target = "hWinHistory";
		frm.method = "POST";

		window.open("", "hWinHistory", strAttr);
		frm.submit();
	}

	function getRejectRemarksDetails(strUrl, index) {
		var frm = document.forms["frmMain"];
		frm.txtIndex.value = strUrl[1];
		if (index.length > 255) {
			showError(
					"Reject Remarks Length Cannot Be Greater than 255 Characters",
					null);
			return false;
		}
		frm.rejectRemarks.value = index;
		frm.action = strUrl[0];
		frm.target = "";
		frm.method = "POST";
		frm.submit();
	}

	function showViewForm(strUrl, index) {
		var frm = document.forms["frmMain"];
		document.getElementById("txtIndex").value = index;

		frm.action = strUrl;
		frm.target = "";
		frm.method = "POST";
		frm.submit();
	}

	function showEditForm(strUrl, index) {
		var frm = document.forms["frmMain"];
		document.getElementById("txtIndex").value = index;
		frm.action = strUrl;
		frm.target = "";
		frm.method = "POST";
		frm.submit();
	}

	// Enable, Disable, Accept and Reject requests
	function enableRecord(strUrl, index) {
		var frm = document.forms["frmMain"];
		document.getElementById("txtIndex").value = index;
		frm.action = strUrl;
		frm.target = "";
		frm.method = "POST";
		frm.submit();
	}
	function filterList(strUrl) {
		$('#advanceFilter').appendTo('#frmMain');
		$('#advanceFilter').hide();
		var frm = document.forms["frmMain"];
		frm.action = strUrl;
		frm.target = "";
		frm.method = "POST";
		frm.submit();
	}

	function disableRecord(strUrl, index) {
		var frm = document.forms["frmMain"];
		document.getElementById("txtIndex").value = index;

		frm.action = strUrl;
		frm.target = "";
		frm.method = "POST";
		frm.submit();
	}

	function acceptRecord(strUrl, index) {
		var frm = document.forms["frmMain"];
		document.getElementById("txtIndex").value = index;

		frm.action = strUrl;
		frm.target = "";
		frm.method = 'POST';
		frm.submit();
	}

	// List navigation
	function prevPage(strUrl, intPg) {
		var frm = document.forms["frmMain"];
		document.getElementById("txtCurrent").value = intPg;

		frm.action = strUrl;
		frm.target = "";
		frm.method = "POST";
		frm.submit();
	}

	function nextPage(strUrl, intPg) {
		var frm = document.forms["frmMain"];
		document.getElementById("txtCurrent").value = intPg;

		frm.action = strUrl;
		frm.target = "";
		frm.method = "POST";
		frm.submit();
	}

	function goPgNmbr(mode, totalPages) {
		var frm = document.forms["frmMain"];
		var strUrl = null;
		frm.target = "";

		if ("C" == strMstType)
			strUrl = "collTaskStatusList.form";
		else if ("P" == strMstType)
			strUrl = "taskStatusList.form";
		else if ("I" == strMstType)
			strUrl = "invoiceTaskStatusList.form";
		var pgNmbr = document.getElementById("goPageNumbr").value;
		document.getElementById("txtCurrent").value = pgNmbr - 1;
		if (isNaN(pgNmbr) || isNaN(totalPages)) {
			showError("Page number can accept integer only", null);
			return false;
		}

		if (pgNmbr > totalPages) {
			showError('Page Number cannot be greater than total number of pages!',
					null);
			return;
		} else if (pgNmbr <= 0) {
			showError('Page Number cannot be Zero or less!', null);
			return;
		}
		frm.action = strUrl;
		frm.target = "";
		frm.method = "POST";
		frm.submit();
	}

	// Details
	function deleteDetail(strUrl, index) {
		var frm = document.forms["frmMain"];
		document.getElementById("txtIndex").value = index;
		frm.action = strUrl;
		frm.target = "";
		frm.method = "POST";
		frm.submit();
	}

	function viewDetailForm(strUrl, index) {
		var frm = document.forms["frmMain"];
		document.getElementById("txtIndex").value = index;

		frm.action = strUrl;
		frm.target = "";
		frm.method = "POST";
		frm.submit();
	}

	function editDetailForm(strUrl, index) {
		var frm = document.forms["frmMain"];
		document.getElementById("txtIndex").value = index;

		frm.action = strUrl;
		frm.target = "";
		frm.method = "POST";
		frm.submit();
	}

	function unassignRecord(strUrl, index) {
		var frm = document.forms["frmMain"];
		document.getElementById("txtIndex").value = index;

		frm.action = strUrl;
		frm.target = "";
		frm.method = "POST";
		frm.submit();
	}

	function assignRecord(strUrl, index) {
		var frm = document.forms["frmMain"];
		document.getElementById("txtIndex").value = index;
		frm.action = strUrl;
		frm.target = "";
		frm.method = "POST";
		frm.submit();
	}

	function discardRecord(strUrl, index) {

		var frm = document.forms["frmMain"];
		document.getElementById("txtIndex").value = index;

		frm.action = strUrl;
		frm.target = "";
		frm.method = "POST";
		frm.submit();
	}

	function back() {
		window.location = strUrl;
	}

	function getRejectRemarks(strUrl) {
		window.opener.document.getElementById("rejectRemarks").value = document
				.getElementById("rejectRemarks").value;
		var frm = window.opener.document.forms["frmMain"];

		frm.action = strUrl;
		frm.method = "POST";
		frm.submit();
		window.close();

	}

	function call(str) {
		if (str == 'F3') {
			filterList('taskStatusList.form');
		}
		if (str == 'F12') {
			showList('welcome.jsp');
		}
	}
	function filterRefresh() {
		filterList('taskStatusList.form');
	}

	function Refresher(t) {
		if (t)
			refresh = setTimeout("document.location='javascript:filterRefresh()';",
					t * 1000);
	}

	function trim(str) {
		var str = str.replace(/^\s\s*/, ''), ws = /\s/, i = str.length;
		while (ws.test(str.charAt(--i)));
		return str.slice(0, i + 1);
	}
	function showDownloadParam(strUrl, index) {
		var frm = document.forms["frmMain"];
		document.getElementById("txtIndex").value = index;
		if ("C" == strMstType)
			strUrl = 'collDownloadTaskStatus.form';
		else if ("I" == strMstType)
			strUrl = 'invoiceDownloadTaskStatus.form';
		frm.action = strUrl;
		frm.method = "POST";
		frm.submit();
	}
	function showList(strMstTye) {
		var strUrl;
		if (strMstTye == 'C')
			strUrl = 'collTaskStatusList.form';
		else if (strMstTye == 'P')
			strUrl = 'taskStatusList.form';
		else if (strMstTye == 'I')
			strUrl = 'invoiceTaskStatusList.form';
		var frm = document.forms["frmMain"];
		frm.action = strUrl;
		frm.method = "POST";
		frm.target = "";
		frm.submit();
	}
	function backtoList() {
		parent.window.operner;
		window.close();
	}

	function changePage(navType, newPage) {
		var frm = document.getElementById('frmMain');
		if (!frm) {
			alert(_errMessages.ERR_NOFORM);
		}
		var curPage = $('.pcontrol input', this.pDiv).val();
		var totPage = '<c:out value="${total_pages}"/>';
		switch (navType) {
			case 'first' :
				frm.action = 'taskStatusList_first.form';
				break;
			case 'prev' :
				frm.action = 'taskStatusList_previous.form';
				break;
			case 'next' :
				if (curPage == totPage)
					return false;

				frm.action = 'taskStatusList_next.form';
				break;
			case 'last' :
				frm.action = 'taskStatusList_last.form';
				break;
			case 'input' :
				$('#page_number').val(curPage);
				frm.action = 'taskStatusList_goto.form';
				break;
			default :
				alert(_errMessages.ERR_NAVIGATE);
				return false;
		}
		frm.target = "";
		frm.method = "POST";
		frm.submit();
	}

	function IsJsonString(str) {
		try {
			JSON.parse(str);
		} catch (e) {
			return false;
		}
		return true;
	}
	function getRecord(json, elementId) {

		var myJSONObject = JSON.parse(json);
		if (IsJsonString(myJSONObject)) {
			myJSONObject = JSON.parse(myJSONObject);
		}

		var inputIdArray = elementId.split("|");

		for (i = 0; i < inputIdArray.length; i++) {

			var field = inputIdArray[i];
			// alert("field"+document.getElementById(inputIdArray[i]));

			if (document.getElementById(inputIdArray[i]) && myJSONObject.columns[i]) {

				var type = document.getElementById(inputIdArray[i]).type;

				if (type == 'text' || type == 'hidden'){
					document.getElementById(inputIdArray[i]).value = myJSONObject.columns[i].value;
				} else {
					document.getElementById(inputIdArray[i]).innerHTML = myJSONObject.columns[i].value;
				}
			}
		}
	}
	function changePaymentsListSort(sortCol, sortOrd, colId) {

		var frm = document.getElementById('frmMain');
		if (!frm) {
			alert(_errMessages.ERR_NOFORM);
			return false;
		}
		if (!isEmpty(sortCol)) {
			document.getElementById("txtSortColName").value = sortCol;
			document.getElementById("txtSortOrder").value = sortOrd;
			document.getElementById("txtSortColId").value = colId;
			frm.action = 'taskStatusList.form';
			frm.target = "";
			frm.method = "POST";
			frm.submit();
		} else {
			alert(_errMessages.ERR_NOFORM);
			return false;
		}
		function showAdvancedFilter(fptrCallback) {
			var dlg = $('#advanceFilter');
			dlg.dialog({
						bgiframe : true,
						autoOpen : false,
						height : "auto",
						modal : true,
						resizable : true,
						width : 540,
						title : 'Advanced Filter',
						buttons : {
							"Continue" : function() {
								$(this).dialog("close");
								fptrCallback.call(null, 'taskStatusList.form');
							},
							"Save & Filter" : function() {
								if (document.getElementById('saveAs').value == '') {
									alert("Plase provide a filter name");
									return false;
								};
								$(this).dialog("close");
								fptrCallback.call(null, 'taskStatusList.form');
							},
							"Reset All" : function() {
								resetAll()
							},
							Cancel : function() {
								$(this).dialog('close');
							}
						}
					});
			dlg.dialog('open');
		}
	}
	function resetAll() {

		document.getElementById("ahtskSrc").value = "";
		document.getElementById("ahtskMaker").value = "(ALL)";
		document.getElementById("filterFromDate").value = "";
		document.getElementById("ahtskCreated").value = "";
		document.getElementById("ahtskStatus").value = "(ALL)";

		document.getElementById("sortField1").value = "NONE";
		document.getElementById("orderField1").value = "asc";
		document.getElementById("sortField2").value = "NONE";
		$('#' + "sortField2").attr('disabled', true);
		document.getElementById("orderField2").value = "asc";
		$('#' + "orderField2").attr('disabled', true);
		document.getElementById("sortField3").value = "NONE";
		$('#' + "sortField3").attr('disabled', true);
		document.getElementById("orderField3").value = "asc";
		$('#' + "orderField3").attr('disabled', true);
		document.getElementById("sortField4").value = "NONE";
		$('#' + "sortField4").attr('disabled', true);
		document.getElementById("orderField4").value = "asc";
		$('#' + "orderField4").attr('disabled', true);
	}

	function showQueryHeaderList(strUrl) {
		$('#advanceFilter').appendTo('#frmMain');
		$('#advanceFilter').hide();
		$('#advanceFilter').dialog('close');
		$('#cboPayFilter').val('0');

		var frm = document.forms["frmMain"];
		frm.action = strUrl;
		frm.target = "";
		frm.method = "POST";
		frm.submit();
	}

	function showTxnReport() {

		var sel = document.getElementById("clientMapCode1");
		var val = sel.options[sel.selectedIndex].value;

		if (val == 'Pdf') {
			url = 'generateFileUploadReportPDF.form';
		} else if (val == 'Csv') {
			url = 'generateFileUploadReportCSV.form';
		} else if (val == 'Xls') {
			url = 'generateFileUploadReportXLS.form';
		} else if (val == 'Tsv') {
			url = 'generateFileUploadReportTSV.form';
		}

		var frm = document.forms["frmMain"];
		frm.target = "";
		frm.action = url;
		frm.method = "POST";
		frm.submit();
	}

	function showInvoices(strUrl, index) {
		var frm = document.forms["frmMain"];
		document.getElementById("txtIndex").value = index;
		document.getElementById("operator").value = 'GREATER_THAN';
		frm.action = strUrl;
		frm.method = "POST";
		frm.target = "";
		frm.submit();
	}

	function reloadClientMapCodeList(sellerVal) {
		var frm = document.forms["frmMain"];
		frm.action = "uploadInstrFileNew.srvc";
		frm.paramFlag.value = 'Y';
		frm.target = "";
		frm.method = "POST";
		frm.submit();
	}

	function newfileselected () {
		var filename = $('#file').val();
		if(filename) {
			$('#lblSelectedFileName').html(filename.substring(filename.lastIndexOf('\\')+1));
		} else {
			$('#lblSelectedFileName').html(labels.lblNoFileSelected);
		}
		$('#lblSelectedFileName').attr('title', filename); 
	}

	function chooseFileClicked() {
		$('#file').click();
	}