var ccApplicable = 'N';
var balanceData = 0;
function getLabel(key, defaultText) {
	return defaultText;
}

var VIRTUAL_ACCOUNT_COLUMNS = [ {
	'colId' : 'clientId',
	'colHeader' : getLabel('lblcompanyname', 'Company Name'),
	'sortable' : true,
	'colDesc' : getLabel('lblcompanyname', 'Company Name'),
	'colSequence' : 1,
	'width' : 200,
	'locked' : false,
	'hidden' : false,
	'hideable' : false
}, {
	'colId' : 'vacategory',
	'colHeader' : getLabel('vacategory', 'Virtual Account Category'),
	'sortable' : true,
	'colType' : 'date',
	'colDesc' : getLabel('vacategory', 'Virtual Account Category'),
	'colSequence' : 2,
	'width' : 200,
	'locked' : false,
	'hidden' : false,
	'hideable' : true
}, {
	'colId' : 'clientCreditAccountNo',
	'colHeader' : getLabel('clientCreditAccountNo', 'Client Credit Account Number'),
	'sortable' : true,
	'colDesc' : getLabel('clientCreditAccountNo', 'Client Credit Account Number'),
	'colSequence' : 3,
	'width' : 170,
	'locked' : false,
	'hidden' : false,
	'hideable' : true
}, {
	'colId' : 'clientConstantValue',
	'colHeader' : getLabel('clientConstantValue', 'Client Constant'),
	'sortable' : true,
	'colDesc' : getLabel('clientConstantValue', 'Client Constant'),
	'colSequence' : 4,
	'width' : 170,
	'locked' : false,
	'hidden' : false,
	'hideable' : true
}, {
	'colId' : 'totalAccounts',
	'colHeader' : getLabel('totalAccounts', 'Total Count of Virtual Account'),
	'sortable' : true,
	'colDesc' : getLabel('totalAccounts', 'Total Count of Virtual Account'),
	'colSequence' : 5,
	'width' : 170,
	'locked' : false,
	'hidden' : false,
	'hideable' : true
}, {
	'colId' : 'issuanceNumber',
	'colHeader' : getLabel('issuanceNumber', 'Issuance Number'),
	'sortable' : true,
	'colDesc' : getLabel('issuanceNumber', 'Issuance Number'),
	'colSequence' : 6,
	'width' : 170,
	'locked' : false,
	'hidden' : true,
	'hideable' : true
},{
	'colId' : 'startNumber',
	'colHeader' : getLabel('startNumber', 'Start Number'),
	'sortable' : true,
	'colDesc' : getLabel('startNumber', 'Start Number'),
	'colSequence' : 7,
	'width' : 170,
	'locked' : false,
	'hidden' : false,
	'hideable' : true
}, {
	'colId' : 'endNumber',
	'colHeader' : getLabel('endNumber', 'End Number'),
	'sortable' : true,
	'colDesc' : getLabel('endNumber', 'End Number'),
	'colSequence' : 8,
	'width' : 170,
	'locked' : false,
	'hidden' : false,
	'hideable' : true
}, {
	'colId' : 'requestStateDesc',
	'colHeader' : getLabel('requestStateDesc', 'Status'),
	'sortable' : false,
	'colDesc' : getLabel('requestStateDesc', 'Status'),
	'colSequence' : 9,
	'width' : 170,
	'locked' : false,
	'hidden' : false,
	'hideable' : true
}];

var arrDtlStatus = [ {
	'code' : '0',
	'desc' : 'New'
}, {
	'code' : '1',
	'desc' : 'Modified'
}, {
	'code' : '2',
	'desc' : 'Active'
}, {
	'code' : '3',
	'desc' : 'Inactive'
}, {
	'code' : '4',
	'desc' : 'Suspend Request'
}, {
	'code' : '5',
	'desc' : 'Enable Request'
} ];

var arrStatus = [ {
	'code' : '0',
	'desc' : 'New'
}, {
	'code' : '3',
	'desc' : 'Approved'
}, {
	'code' : '1',
	'desc' : 'Modified'
}, {
	'code' : '7',
	'desc' : 'New Rejected'
}, {
	'code' : '8',
	'desc' : 'Modified Rejected'
}, {
	'code' : '12',
	'desc' : 'Submitted'
} ];

var billerRegLabelsMap = {
	'status' : 'Status',
	'lblcompanyname' : 'Company Name',
	'allCompanies' : 'All Companies',
	'searchByCompany' : 'Search By Company',
	'endNmbr' : 'End Number',
	'startNmbr' : 'Start Number',
	'totalCountVA' : 'Total Count of VA',
	'clientConstant' : 'Client Constant',
	'clientAccount' : 'Client Credit Account Number',
	'vaCategory' : 'Virtual Account Category',
	'clientCode' : 'Client Code'
};

function setDirtyBit() {
	dirtyBitSet = true;
	$('#dirtyBit').val('1');
}

function getDiscardConfirmPopUp(strUrl) {
	$('#cancelDiscardConfirmMsg').bind('click', function() {
		$('#discardMsgPopup').dialog('close');
	});
	$('#doneConfirmDiscardbutton').bind('click', function() {
		$(this).dialog('close');
		discardProfile(strUrl);
	});
	$('#discardMsgPopup').dialog({
		autoOpen : false,
		maxHeight : 550,
		width : 400,
		modal : true,
		resizable : false,
		draggable : false
	});
	$('#discardMsgPopup').dialog('open');
	$('#textContent').focus();
}

function getCancelConfirmPopUp(strUrl) {
	$('#cancelConfirmMsg').bind('click', function() {
		$('#confirmMsgPopup').dialog('close');
	});

	$('#doneConfirmMsgbutton').bind('click', function() {
		$(this).dialog('close');
		gotoPage(strUrl);
	});
	if (dirtyBitSet) {
		$('#confirmMsgPopup').dialog({
			autoOpen : false,
			maxHeight : 550,
			minHeight : 'auto',
			width : 400,
			modal : true,
			resizable : false,
			draggable : false
		});
		$('#confirmMsgPopup').dialog('open');
		$('#textContent').focus();
	}
	else {
		gotoPage(strUrl);
	}
}

function gotoPage(strUrl) {
	var frm = document.forms['frmMain'];
	frm.action = strUrl;
	$('input').removeAttr('disabled');
	$('select').removeAttr('disabled');

	frm.target = '';
	frm.method = 'POST';
	frm.action = strUrl;
	frm.method = 'POST';
	frm.submit();
}

function showWarning(strUrl) {
	$('#cancelWarningMsg').bind('click', function() {
		$('#warningMsgPopup').dialog('close');
	});

	$('#doneWarningMsgbutton').bind('click', function() {
		$(this).dialog('close');
		gotoPage(strUrl);
	});
	if (dirtyBitSet && isTxnExists === 'true') {
		$('#warningMsgPopup').dialog({
			autoOpen : false,
			maxHeight : 550,
			minHeight : 'auto',
			width : 400,
			modal : true,
			resizable : false,
			draggable : false
		});
		$('#warningMsgPopup').dialog('open');
		$('#textContent').focus();
	}
	else {
		gotoPage(strUrl);
	}
};

	var VIRTUAL_ACCOUNT_ENTRY_COLUMNS = [ {
		'colId' : 'virtualAccNo',
		'colHeader' : getLabel('virtualAccNo', 'Virtual Account Number'),
		'sortable' : true,
		'colDesc' : getLabel('virtualAccNo', 'Virtual Account Number'),
		'colSequence' : 1,
		'width' : 200,
		'locked' : false,
		'hidden' : false,
		'hideable' : false
	}, {
		'colId' : 'virtualAccName',
		'colHeader' : getLabel('virtualAccName', 'Name'),
		'sortable' : true,
		'colDesc' : getLabel('virtualAccName', 'Name'),
		'colSequence' : 2,
		'width' : 200,
		'locked' : false,
		'hidden' : false,
		'hideable' : true
	},{
		'colId' : 'partyDesc',
		'colHeader' : getLabel('partyCode', 'Party Code'),
		'sortable' : true,
		'colDesc' : getLabel('partyCode', 'Party Code'),
		'colSequence' : 3,
		'width' : 200,
		'locked' : false,
		'hidden' : false,
		'hideable' : true
	}, {
		'colId' : 'uniqueId',
		'colHeader' : getLabel('uniqueId', 'Unique Id'),
		'sortable' : true,
		'colDesc' : getLabel('uniqueId', 'Unique Id'),
		'colSequence' : 3,
		'width' : 200,
		'locked' : false,
		'hidden' : false,
		'hideable' : true
	},{
		'colId' : 'reference',
		'colHeader' : getLabel('reference', 'Reference'),
		'sortable' : true,
		'colDesc' : getLabel('reference', 'Reference'),
		'colSequence' : 3,
		'width' : 200,
		'locked' : false,
		'hidden' : false,
		'hideable' : true
	},{
		'colId' : 'requestStateDesc',
		'colHeader' : getLabel('status', 'Status'),
		'sortable' : false,
		'colDesc' : getLabel('status', 'Status'),
		'colSequence' : 8,
		'width' : 170,
		'locked' : false,
		'hidden' : false,
		'hideable' : true
	},{
		'colId' : 'fundAmount',
		'colHeader' : getLabel('fundedAmount', 'Funded Amount'),
		'sortable' : false,
		'colDesc' : getLabel('fundedAmount', 'Funded Amount'),
		'colSequence' : 9,
		'width' : 170,
		'locked' : false,
		'hidden' : (fcmVamIntegration == 'Y' && (vaCategory == "1" || vaCategory == "2")) ? false : true,
		'hideable' : true
	}];
	


var virtualAccountsLabelsMap = {
	'payerCode' : 'Payer Code',
	'searchByPayerCode' : 'Search By Payer Code',
	'virtualAccNo' : "Virtual Account Number",
	'virtualAccountSearch' : 'Search By Virtual Account Number'

};

jQuery.fn.popUppayerCodeComplete = function() {
	if (vaCategory === "1") { // if Company
		$('#popUppayerCode').val($('#clientId').val());
		if (strEntityType === '1') {
			$('#popUppayerDesc').val($("#clientId option:selected").text());
		}
		else {
			$('#popUppayerDesc').val($("#companyAuto").val());
		}
		$('#popUppayerCode').addClass('disabled');
		$('#popUppayerDesc').addClass('disabled');
	}
	else {
		if (vaCategory === "2") { // if Subsidiary
			var stUrl = 'services/userseek/ClientSubsiVA.json';
			return this.each(function() {
				$(this).autocomplete({
					source : function(request, response) {
						$.ajax({
							url : stUrl,
							dataType : "json",
							type : 'POST',
							data : {
								top : -1,
								$filtercode1 : $('#clientId').val(),
								$autofilter : request.term
							},
							success : function(data) {
								var clientData = data.d.preferences;
								if (isEmpty(clientData) || (isEmpty(data.d)) || clientData.length === 0) {
									var rec = [ {
										label : 'No match found..',
										value : ""
									} ];
									response($.map(rec, function(item) {
										return {
											label : item.label,
											value : item.value
										}
									}));

								}
								else {
									var rec = data.d.preferences;
									response($.map(rec, function(item) {
										return {
											label : item.DESCR,
											record : item
										}
									}));

								}
							}
						});
					},
					minLength : 1,
					select : function(event, ui) {
						var rec = ui.item.record;
						$('#popUppayerCode').val(rec.CODE);
						$('#popUppayerDesc').val(rec.DESCR);
					},
					change : function(event, ui) {
						// resetFields('company');
					},
					open : function() {
						$(this).removeClass("ui-corner-all").addClass("ui-corner-top");
					},
					close : function() {
						$(this).removeClass("ui-corner-top").addClass("ui-corner-all");
					}
				});/*.data("autocomplete")._renderItem = function(ul, item) {
					var inner_html = '<a><ol class="t7-autocompleter"><ul>' + item.label + '</ul></ol></a>';

					return $("<li></li>").data("item.autocomplete", item).append(inner_html).appendTo(ul);
				};*/
			});
		}
		else if (vaCategory === "3") { // if Aggregator
			var stUrl = 'services/userseek/ClientAggregatorVA.json';
			return this.each(function() {
				$(this).autocomplete({
					source : function(request, response) {
						$.ajax({
							url : stUrl,
							dataType : "json",
							type : 'POST',
							data : {
								top : -1,
								$autofilter : request.term,
								$filtercode1 : $('#clientId').val()
							},
							success : function(data) {
								var clientData = data.d.preferences;
								if (isEmpty(clientData) || (isEmpty(data.d)) || clientData.length === 0) {
									var rec = [ {
										label : 'No match found..',
										value : ""
									} ];
									response($.map(rec, function(item) {
										return {
											label : item.label,
											value : item.value
										}
									}));

								}
								else {
									var rec = data.d.preferences;
									response($.map(rec, function(item) {
										return {
											label : item.SHORTCODE,
											record : item
										}
									}));

								}
							}
						});
					},
					minLength : 1,
					select : function(event, ui) {
						var rec = ui.item.record;
						if(!Ext.isEmpty(rec)){
							$('#popUppayerCode').val(rec.CODE);
							$('#name').val(rec.DESCR);
							$('#popUppayerDesc').val(rec.SHORTCODE);
						}
						
					},
					change : function(event, ui) {
						// resetFields('company');
					},
					open : function() {
						$(this).removeClass("ui-corner-all").addClass("ui-corner-top");
					},
					close : function() {
						$(this).removeClass("ui-corner-top").addClass("ui-corner-all");
					}
				});/*.data("autocomplete")._renderItem = function(ul, item) {
					var inner_html = '<a><ol class="t7-autocompleter"><ul>' + item.label + '</ul></ol></a>';

					return $("<li></li>").data("item.autocomplete", item).append(inner_html).appendTo(ul);
				};*/
			});
		}
		else
			if (vaCategory === "4") { // if Customer
				return this.each(function() {
					$(this).autocomplete({
						source : function(request, response) {
							$.ajax({
								url : 'services/userseek/payerCodeSeek.json',
								dataType : "json",
								type : 'POST',
								data : {
									$top : -1,
									$filtercode1 : $('#clientId').val(),
									$autofilter : request.term
								},
								success : function(data) {
									var payerData = data.d.preferences;
									if (isEmpty(payerData) || (isEmpty(data.d)) || payerData.length === 0) {
										var rec = [ {
											label : 'No match found..',
											value : ""
										} ];
										response($.map(rec, function(item) {
											return {
												label : item.label,
												value : item.value
											}
										}));

									}
									else {
										var rec = data.d.preferences;
										response($.map(rec, function(item) {
											return {
												label : item.CODE,
												record : item
											}
										}));

									}
								}
							});
						},
						minLength : 1,
						select : function(event, ui) {
							var rec = ui.item.record;
							$('#popUppayerCode').val(rec.CODE);
							$('#popUppayerDesc').val(rec.CODE);
							$('#name').val(rec.DESCR);
							$('#reference').val(rec.PAYER_ACCT_NMBR);

						},
						change : function(event, ui) {
								
						},
						open : function() {
							$(this).removeClass("ui-corner-all").addClass("ui-corner-top");
						},
						close : function() {
							$(this).removeClass("ui-corner-top").addClass("ui-corner-all");
						}
					});/*.data("autocomplete")._renderItem = function(ul, item) {
						var inner_html = '<a><ol class="xn-autocompleter"><ul >' + item.label + '</ul></ol></a>';

						return $("<li></li>").data("item.autocomplete", item).append(inner_html).appendTo(ul);
					};*/
				});
			}

	}

};


jQuery.fn.companyAutoComplete = function() {
	var stUrl = 'services/userseek/userclientsVA.json';
	return this.each(function() {
		$(this).autocomplete({
			source : function(request, response) {
				$.ajax({
					url : stUrl,
					dataType : "json",
					type : 'POST',
					data : {
						top : -1,
						$autofilter : request.term
					},
					success : function(data) {
						var clientData = data.d.preferences;
						if (isEmpty(clientData) || (isEmpty(data.d)) || clientData.length === 0) {
							var rec = [ {
								label : 'No match found..',
								value : ""
							} ];
							response($.map(rec, function(item) {
								return {
									label : item.label,
									value : item.value
								}
							}));

						}
						else {
							var rec = data.d.preferences;
							response($.map(rec, function(item) {
								return {
									label : item.DESCR,
									record : item
								}
							}));

						}
					}
				});
			},
			minLength : 1,
			select : function(event, ui) {
				var rec = ui.item.record;
				$('#clientId').val(rec.CODE);
				selectedClient = rec.CODE;
				populateVACategory(rec.CODE, 'S');
			},
			change : function(event, ui) {
				resetFields('company');
			},
			open : function() {
				$(this).removeClass("ui-corner-all").addClass("ui-corner-top");
			},
			close : function() {
				$(this).removeClass("ui-corner-top").addClass("ui-corner-all");
			}
		});/*.data("autocomplete")._renderItem = function(ul, item) {
			var inner_html = '<a><ol class="t7-autocompleter"><ul>' + item.label + '</ul></ol></a>';

			return $("<li></li>").data("item.autocomplete", item).append(inner_html).appendTo(ul);
		};*/
	});

};

jQuery.fn.clientAccountAutoComplete = function() {
	var stUrl = 'services/VirtualAccMaintenance/clientCreditAccNoEntry.json';
	return this.each(function() {
		$(this).autocomplete({
			source : function(request, response) {
				$.ajax({
					url : stUrl,
					dataType : "json",
					type : 'POST',
					data : {
						top : -1,
						$autofilter : request.term,
						$clientCode : $('#clientId').val(),
						$ccApplicable : ccApplicable
					},
					success : function(data) {
						var clientData = data.d.preferences;
						if (isEmpty(clientData) || (isEmpty(data.d)) || clientData.length === 0) {
							var rec = [ {
								label : 'No match found..',
								value : ""
							} ];
							response($.map(rec, function(item) {
								return {
									label : item.label,
									value : item.value
								}
							}));

						}
						else {
							var rec = data.d.preferences;
							response($.map(rec, function(item) {
								return {
									label : item.DISPLAYFIELD,
									value : item.CODE,
									record : item
								}
							}));

						}
					}
				});
			},
			minLength : 1,
			select : function(event, ui) {
				var rec = ui.item.record;
				$('#clientCreditAccountNo').val(rec.CODE);
				$('#accountCcyCode').val(rec.CCYCODE);
				$('#accountBranch').val(rec.ACCBRANCH)
				$('#clientConstantValue').val("");
				if ('N' !== ccApplicable){
					$('#availableLength').val("");
				}
				$('#totalAccounts').val("");
				$('#startNumber').val("");
				$('#endNumber').val("");
				$('#sampleStartNumber').val("");
				populateClientConstant(rec.CODE, 'S');
			},
			change : function(event, ui) {
				// resetFields('acctnmbr');
			},
			open : function() {
				$(this).removeClass("ui-corner-all").addClass("ui-corner-top");
			},
			close : function() {
				$(this).removeClass("ui-corner-top").addClass("ui-corner-all");
			}
		});/*.data("autocomplete")._renderItem = function(ul, item) {
			var inner_html = '<a><ol class="t7-autocompleter"><ul">' + item.label + '</ul></ol></a>'
			return $("<li></li>").data("item.autocomplete", item).append(inner_html).appendTo(ul);
		};*/
	});

};

function populateClientConstant(clientAccount, type) {
	var strUrl = "services/userseek/clientConstant.json";
	$('#clientConstantValue').empty().append($('<option>', {
		value : '',
		text : 'Select',
		selected : true
	}));
	$('#clientConstantValue').niceSelect('update');
	$.ajax({
		url : strUrl,
		method : "GET",
		async : false,
		data : {
			$filtercode1 : clientAccount,
			$filtercode2 : $('#clientId').val()
		},
		success : function(response) {
			if (response.length !== 0) {
				clientConstList = response.d.preferences;
				$.each(response.d.preferences, function(i, item) {
					$('#clientConstantValue').append($('<option>', {
						value : item.CODE,
						text : item.CODE
					}));
					if (type === 'L') {
						if (item.CODE === clientConstantValue) {
							$('#clientConstantValue').val(item.CODE);
						}
					}
				});
			}
			$('#clientConstantValue').niceSelect('update');
		},
		failure : function(response) {
		}
	});
	$('#clientConstantValue').niceSelect('update');
}

function populateVACategory(clientId, type) {
	var strUrl = "services/userseek/vaCategory.json";
	$('#VACategory').empty().append($('<option>', {
		value : '',
		text : 'Select',
		selected : true
	}));

	$.ajax({
		url : strUrl,
		method : "GET",
		async : false,
		data : {
			$filtercode1 : $('#clientId').val()
		},
		success : function(response) {
			if (response.length !== 0) {
				$.each(response.d.preferences, function(i, item) {
					$('#VACategory').append($('<option>', {
						value : item.CODE,
						text : item.DESCR
					}));
					if (type === 'L') {
						if (item.CODE === vaCategory) {
							$('#VACategory').val(item.CODE);
						}
					}
				});
			}
		},
		failure : function(response) {
		}
	});
	$('#VACategory').niceSelect('update');
	
	
	$.ajax({
		url : "services/VirtualAccMaintenance/clientConstantApplicable.json",
		method : "GET",
		async : false,
		data : {
			$clientCode : $('#clientId').val()
		},
		success : function(response) {
			if (response !== undefined) {
				ccApplicable = response.clientConstantApplicable;
				if ('Y' !== ccApplicable) {
					$('#clientConstantValue').addClass('disabled');
					$('#clientConstantValue').niceSelect('update');
					$('#lblClientConstant').removeClass('required');
					$('#availableLength').val(response.availableLength);
					clientSpecified = 'Y';
					partialMatch = 'N';
				}
				else {
					if (mode !== 'EDIT') {
						$('#clientConstantValue').removeClass('disabled');
						$('#clientConstantValue').niceSelect('update');
						$('#lblClientConstant').addClass('required');
					}
				}
				
			}
		},
		failure : function(response) {
		}
	});
}

function checkClientSpecified(clientConstant) {
	$.each(clientConstList, function(i, item) {
		if (clientConstant === item.CODE) {
			clientSpecified = item.DESCR;
			partialMatch = item.MATCH;
			$('#clientSpecifiedVirtualFlag').val(clientSpecified);
			$('#partialMatchFlag').val(partialMatch);
			if ('N' === clientSpecified) {
				$('#startNumber').addClass('disabled');
			}
		}
	});
}
function fetchStartEndNumber() {
	var strUrl = 'services/VirtualAccMaintenance/fetchStartEndNumber.json';
	if (!Ext.isEmpty($('#startNumber').val())) {
		$.ajax({
			url : strUrl,
			method : "GET",
			async : false,
			data : {
				$totalCount : $('#totalAccounts').val(),
				$startNumber : $('#startNumber').val(),
				$clientSpecified : clientSpecified,
				$clientCode : $('#clientId').val(),
				$clientAccount : $('#clientCreditAccountNo').val(),
				$clientConstant : $('#clientConstantValue').val(),
				$availableLength : $('#availableLength').val(),
				$partialMatch : partialMatch
			},
			success : function(response) {

				if (response !== undefined) {
					$('#errorDiv').addClass('hidden');
					$('#messageArea').addClass('hidden');
					$('#messageContentDiv').addClass('hidden');
					$('#startNumber').val(response.startNumber);
					$('#endNumber').val(response.endNumber);
					$('#sampleStartNumber').val(response.sampleStartNumber);
					$('#startNumber').prop('title', response.startNumber);
					$('#endNumber').prop('title', response.endNumber);
					$('#sampleStartNumber').prop('title', response.sampleStartNumber);
					if (response.Error !== undefined && !Ext.isEmpty(response.Error)) {
						var arrErrorObj= response.Error,arrError=[];
						$.each(arrErrorObj, function(index, error) {
							arrError.push({
								"errorCode" : error.errCode,
								"errorMessage" : error.errMsg
							});
						});
						paintErrors(arrError);
					}

				}
			},
			failure : function(response) {
			}
		});
	}
}
function handleAddVirtualAccount() {
	var form;
	var strUrl = 'virtualAccountMasterEntry.srvc';

	form = document.createElement('FORM');
	form.name = 'frmMain';
	form.id = 'frmMain';
	form.method = 'POST';
	form.appendChild(createFormField('INPUT', 'HIDDEN', csrfTokenName, tokenValue));
	form.action = strUrl;
	document.body.appendChild(form);
	form.submit();
	document.body.removeChild(form);
}

function resetFields(type) {
	$('#startNumber').val('');
	$('#totalAccounts').val('');
	if (type != 'acctnmbr') {
		$('#clientAccount').val('');
	}
	$('#clientConstantValue').empty().append($('<option>', {
		value : '',
		text : 'Select',
		selected : true
	}));
	$('#clientConstantValue').niceSelect('update');
	$('#clientCreditAccountNo').val('');
	$('#endNumber').val('');

}

function toggleSpan() {
	if($('#maintainAcctLedgerlbl').is(':checked') == false)
	{
		$('#singleCheck1').hide();
		$('#singleCheck2').hide();
	}
	else
	{
		if(vaCategory === "1" || vaCategory === "2")
		{
			$('#singleCheck1').show();		
			$('#singleCheck2').show();
			$('#balCheck').hide();
			toggleCheckUncheck();
		}
	}
	
	if($('#fundVAlbl').is(':checked') == false)
	{
		$("#singleCheck2").attr("disabled", true);
	}
	else
	{
		$("#singleCheck2").attr("disabled", false);
    	$('#balCheck').show();	
		toggleCheckUncheck();
		showRealAccountBalance();
		
		if($("#fundPerBased").val() === 'P')
		{
			setToValue();
			$('#fundPerBased').prop("checked",true);
			$('#fundFixAmnt').prop("checked",false);	
			$('#perValue').attr('disabled', false);	
			$('#fundedAmount').attr('disabled', true);
		}
		else
		{
			$('#fundFixAmnt').prop("checked",true);
			$('#fundPerBased').prop("checked",false);
			$('#perValue').attr('disabled', true);
			$('#fundedAmount').attr('disabled', false);
			$('#perValue').val('');
		}
	}	
}

function toggleCheckUncheck()
{
	if($('#fundVAlbl').is(':checked') == false)
	{
		$('#fundPerBased').attr('disabled', true);
		$('#fundFixAmnt').attr('disabled', true);
		$('#fundedAmount').attr('disabled', true);
		$('#perValue').attr('disabled', true);
		$('#fundPerBased').addClass('disabled');
		$('#fundFixAmnt').addClass('disabled');
		$('#perValue').addClass('disabled');
		$('#fundedAmount').addClass('disabled');
	}
	else
	{
		 $('#fundPerBased').attr('disabled', false);
		 $('#fundFixAmnt').attr('disabled', false);
		 $('#fundFixAmnt').prop("checked",true);		
		 $('#perValue').attr('disabled', true);
		 $('#fundedAmount').attr('disabled', false);
			$('#fundPerBased').removeClass('disabled');
			$('#fundFixAmnt').removeClass('disabled');
	}

}

function setToValue(){
		$('#popupArea, #popupErrContentDiv').addClass('hidden');
	var amount = balanceData;
	var percentage = $('#perValue').val();
	if(amount!="" && amount!=" ") {
		amount=amount.replace(/\,/g,'');
		amount=parseFloat(amount);
		var num = new Number(amount);
		var total= (Math.floor(percentage * num) / 100).toFixed(2);
		if(percentage>100)
		{
			var arrError = new Array();
			arrError.push({
				"errorCode" : "Message",
				"errorMessage" : "Fund percentage value should be less than or equal to 100%"
			// TODO : getLabel
			});
			doHandlePaintErrors(arrError);	
		}
		$('#fundedAmount').val(total);
	}
}

function chkAmount(){
	$('#popupArea, #popupErrContentDiv').addClass('hidden');
	var amount = $('#fundedAmount').val();
    amount = parseInt(amount.replace(/,/g,''));
	if(amount!="" && amount!=" " && balanceData != "0") {
		if(amount>balanceData)
		{
			var arrError = new Array();
			arrError.push({
				"errorCode" : "Message",
				"errorMessage" : "Funded amount exceeds the Available Balance of parent account"
			// TODO : getLabel
			});
			doHandlePaintErrors(arrError);				
		}
	}
}

function showPopup(frmId) {

	$('#' + frmId).dialog({
		resizable : false,
		maxHeight : 500,
		width : 869,
		dialogClass : "hide-title-bar",
		// title : 'Payout Parameters',
		modal : true,
		focus : function() {

		},
		close : function() {
		}
	});
	$('#' + frmId).dialog("open");
	$('#' + frmId).parent().appendTo($("#frmMain"));

}

function updateVADetail(strDetailId) {
	postVADetail('services/updateVADtl', strDetailId, $("#viewState").val());
}

function editVADetail(record, dtlMode) {
	var dataToPopulate = [], strDetailId;
	dataToPopulate = record.data;
	strDetailId = dataToPopulate.identifier;
	$("#panelBodyVADetail :input").not('input[id=popUppayerCode], input[id=popUppayerDesc]').val('');

	$('#btnVAAdd').addClass('hidden');
	$('#btnVAUpdate').removeClass('hidden');
	$('#btnVAUpdate').unbind('click');
	$('#btnVAUpdate').click(function() {
		updateVADetail(strDetailId);
	});
	if(mode === 'VERIFY' || mode === 'VIEW' || dtlMode === 'VIEW')
		{
		showPopup("DetailsViewPopup");
		$("#vaNoView").text(dataToPopulate.virtualAccNo);
		$("#nameView").text(dataToPopulate.virtualAccName);
		$("#uniqueIdView").text(dataToPopulate.uniqueId);
		$("#payerCodeView").text(dataToPopulate.partyDesc);
		$("#referenceView").text(dataToPopulate.reference);
		$("#addInfo1View").text(dataToPopulate.addInfo1);
		$("#addInfo2View").text(dataToPopulate.addInfo2);
		$("#addInfo3View").text(dataToPopulate.addInfo3);
		$("#addInfo4View").text(dataToPopulate.addInfo4);
		$("#addInfo5View").text(dataToPopulate.addInfo5);
	//	$("#availableBalanceView").text(dataToPopulate.parentAcctAvailBalance);
        
		$("#fundedAmountView").text(ccySymbol+' '+dataToPopulate.fundAmount.toFixed(2));
		
		

		$("#perValueView").text(dataToPopulate.fundPercentage);		
		if(dataToPopulate.maintainAcctLedger == 'Y')
			$("#maintainAcctLedgerView").attr("src", "static/images/icons/icon_checked.gif");
		else
			$("#maintainAcctLedgerView").attr("src", "static/images/icons/icon_unchecked.gif");
		if(dataToPopulate.fundVirtualAccount == 'Y')
			$("#fundVAlblView").attr("src", "static/images/icons/icon_checked.gif");
		else
			$("#fundVAlblView").attr("src", "static/images/icons/icon_unchecked.gif");
	    if(dataToPopulate.fundBasedOn == 'P')
	    {
	    	$("#fundPerBasedView").attr('checked', 'checked');
	    }else{
	    	$("#fundFixAmntView").attr('checked', 'checked');
	    }		
		
		$("#vaNoView").attr('title',dataToPopulate.virtualAccNo);
		$("#nameView").attr('title',dataToPopulate.virtualAccName);
		$("#uniqueIdView").attr('title',dataToPopulate.uniqueId);
		$("#payerCodeView").attr('title',dataToPopulate.partyDesc);
		$("#referenceView").attr('title',dataToPopulate.reference);
		$("#addInfo1View").attr('title',dataToPopulate.addInfo1);
		$("#addInfo2View").attr('title',dataToPopulate.addInfo2);
		$("#addInfo3View").attr('title',dataToPopulate.addInfo3);
		$("#addInfo4View").attr('title',dataToPopulate.addInfo4);
		$("#addInfo5View").attr('title',dataToPopulate.addInfo5);
		//$("#availableBalanceView").attr('title',dataToPopulate.parentAcctAvailBalance);
		$("#maintainAcctLedgerView").attr('title',dataToPopulate.maintainAcctLedger);
		$("#fundVAlblView").attr('title',dataToPopulate.fundVirtualAccount);
		
		$("#fundedAmountView").attr('title',dataToPopulate.fundAmount);
		    if(dataToPopulate.fundBasedOn == 'P')
		    {
		    	$("#fundPerBasedView").attr('title',dataToPopulate.fundBasedOn);
		    }else{
		    	$("#fundFixAmntView").attr('title',dataToPopulate.fundBasedOn);
		    }
		$("#perValueView").attr('title',dataToPopulate.fundPercentage);
		}
	else
		{
	showPopup("DetailsPopup");
	balanceData = 0;
	// doClearMessageSection()
	$("#vaNo").val(dataToPopulate.virtualAccNo);
	$("#name").val(dataToPopulate.virtualAccName);
	$("#uniqueId").val(dataToPopulate.uniqueId);
	$("#popUppayerDesc").val(dataToPopulate.partyDesc);
	$("#popUppayerCode").val(dataToPopulate.partyCode);
	if (vaCategory === "1") {
		
		$('#popUppayerCode').attr('disabled', true);
		$('#popUppayerDesc').attr('disabled', true);
		$('#popUppayerCode').addClass('disabled');
		$('#popUppayerDesc').addClass('disabled');
	}
	
	$("#reference").val(dataToPopulate.reference);
	$("#additionalInfo1").val(dataToPopulate.addInfo1);
	$("#additionalInfo2").val(dataToPopulate.addInfo2);
	$("#additionalInfo3").val(dataToPopulate.addInfo3);
	$("#additionalInfo4").val(dataToPopulate.addInfo4);
	$("#additionalInfo5").val(dataToPopulate.addInfo5);
    if(dataToPopulate.maintainAcctLedger == 'Y')
    {
    	$("#maintainAcctLedger").val(dataToPopulate.maintainAcctLedger);
		$('#maintainAcctLedgerlbl').prop("checked",true);
    }
    else
	{
		$('#maintainAcctLedgerlbl').prop("checked",false);
		toggleSpan();
	}
    if(dataToPopulate.fundVirtualAccount == 'Y')
    {    
    	$("#fundVirtualAccount").val(dataToPopulate.fundVirtualAccount);	
		$('#fundVAlbl').prop("checked",true); 
		$('#singleCheck1').show();		
		$('#singleCheck2').show();	
		$('#balCheck').hide();	
		$("#balSpan").html('');
    }
    else
	{
    	$('#balCheck').show();	
		$('#fundVAlbl').prop("checked",false);
		toggleSpan();
	}
    if(dataToPopulate.fundBasedOn == 'P')
    {	
		$("#fundPerBased").val(dataToPopulate.fundBasedOn);
		$('#fundPerBased').prop("checked",true);
		$('#perValue').attr('disabled', false);		
		$('#fundFixAmnt').prop("checked",false);	
		$('#fundedAmount').attr('disabled', true);
	}else{
		$("#fundFixAmnt").val(dataToPopulate.fundBasedOn);
		$('#fundFixAmnt').prop("checked",true);
		$('#fundPerBased').prop("checked",false);
		$('#perValue').attr('disabled', true);
		$('#perValue').val('');		
		$('#fundedAmount').attr('disabled', false);
	}
	$("#perValue").val(dataToPopulate.fundPercentage);	
	$('#fundedAmount').autoNumeric('set',dataToPopulate.fundAmount);		
	$("#fundCcy").val(ccyCode);    
	$("#ccyCode").val(ccyCode);    
    
	

	$('#popupArea, #popupErrContentDiv').addClass('hidden');
   }
  }


function postVADetail(strUrl, strDetailIdentifier, strParentIdentifier) {
	var jsonObject = generateVAJSON(strDetailIdentifier, strParentIdentifier);
	$.ajax({
		url : strUrl,
		type : 'POST',
		contentType : "application/json",
		data : JSON.stringify(jsonObject),
		complete : function(XMLHttpRequest, textStatus) {
			if ("error" == textStatus) {
				var arrError = new Array();
				arrError.push({
					"errorCode" : "Message",
					"errorMessage" : "Unknown Error"
				// TODO : getLabel
				});
				doHandlePaintErrors(arrError);
			}
		},
		success : function(data) {
			if (data && data.length > 0) {
				var objResponse = data[0];
				if (objResponse.success === 'Y') {
					$('#viewState').val(objResponse.successValue);
					// doClearMessageSection();
					closeAddVADtlPopup('UPDATE');
					$(document).trigger("OnSaveRestoreGrid");
					detailMode = null;
				}
				else
					if (objResponse.errors && objResponse.errors.length > 0) {
						var objErrors = objResponse.errors;
						doHandlePaintErrors(objErrors);
					}
			}
		}
	});
}
function closeAddVADtlPopup(dtlMode) {
	if(mode === 'VIEW' || mode === 'VERIFY' ||dtlMode === 'VIEW')
	{
		$('#DetailsViewPopup').dialog("close");
	}
	else
	{
		$('#DetailsPopup').dialog("close");	
	}
}

String.prototype.replaceAll = function(search, replacement) {
    var target = this;
    return target.replace(new RegExp(search, 'g'), replacement);
};

function generateVAJSON(strDetailIdentifier, strParentIdentifier) {
	var jsonObject = {};
	var isLedgMaintain;
	var fundAccount;
	var payerCode = $('#popUppayerCode').val();
	var payerDesc = $('#popUppayerDesc').val();
	if (payerDesc.indexOf("%") >= 0){
		payerDesc = payerDesc.replaceAll('%','');
	}

	if($('#maintainAcctLedgerlbl').is(':checked') == true){
		isLedgMaintain = 'Y';
	}else{
		isLedgMaintain = 'N';
	}
	jsonObject['maintainAcctLedger'] = isLedgMaintain;
	if($('#fundVAlbl').is(':checked') == true){
		fundAccount = 'Y';
		jsonObject['perValue'] = $('#perValue').val();
		jsonObject['fundAmount'] = $('#fundedAmount').val();
		
		if(document.getElementById('fundFixAmnt').checked)
		{
			jsonObject['fundBasedOn'] = 'F';
		}else{
			jsonObject['fundBasedOn'] = 'P';	
		}		
	}else{
		fundAccount = 'N';
		jsonObject['perValue'] = '0.00';
		jsonObject['fundAmount'] = '0.00';
		jsonObject['fundBasedOn'] = 'F';
	}	
	jsonObject['fundVirtualAccount'] = fundAccount;
	jsonObject['identifier'] = strParentIdentifier;
	jsonObject['detailIdentifier'] = strDetailIdentifier;
	jsonObject['name'] = $('#name').val();
	jsonObject['uniqueId'] = $('#uniqueId').val();
	if(isEmpty(payerCode) && !isEmpty(payerDesc)){
		payerCode = payerDesc;
	}
	jsonObject['popUppayerCode'] = payerCode;
	jsonObject['popUppayerDesc'] = payerDesc;
	jsonObject['reference'] = $('#reference').val();
	jsonObject['additionalInfo1'] = $('#additionalInfo1').val();
	jsonObject['additionalInfo2'] = $('#additionalInfo2').val();
	jsonObject['additionalInfo3'] = $('#additionalInfo3').val();
	jsonObject['additionalInfo4'] = $('#additionalInfo4').val();
	jsonObject['additionalInfo5'] = $('#additionalInfo5').val();
	

//	jsonObject['availableBalance'] = $('#availableBalance').val();

	return jsonObject;
}
function doHandlePaintErrors(arrError) {
	var element = null, strTargetDivId = 'popupArea', strErrorCode = '';
	if (arrError && arrError.length > 0) {
		$('#' + strTargetDivId).empty();
		$.each(arrError, function(index, error) {
			strErrorCode = error.errorCode || error.code;
			if (!isEmpty(strErrorCode)) {
				var msg = error.errorMessage;
				element = $('<p>').text(msg);
				element.appendTo($('#' + strTargetDivId));
				$('#' + strTargetDivId + ', #popupErrContentDiv').removeClass('hidden');
			}
		});
		$(".ft-content-pane-scroll").animate({
			scrollTop : 0
		}, "slow");
	}
}
function populateAvailableLength(clientConstant) {
	var strUrl = "services/VirtualAccMaintenance/fetchAvailableLength.json";
	if (!Ext.isEmpty(clientConstant)) {
		$.ajax({
			url : strUrl,
			method : "GET",
			async : false,
			data : {
				$clientConstant : clientConstant,
				$clientCode : $('#clientId').val()
			},
			success : function(response) {

				if (response !== undefined) {
					$('#availableLength').val(response.availableLength);
				}

			},
			failure : function(response) {
			}
		});
	}
	else {
		$('#availableLength').val('');
	}
}
function discardProfile(strUrl){
	var frm = document.forms["frmMain"];
	frm.action = strUrl;
	$("input").removeAttr('disabled');
	$("select").removeAttr('disabled');
		
	frm.target = "";
	frm.method = "POST";
	frm.submit();
}

function doClearMessageSection() 
{
	$('#messageArea').empty();
	$('#messageArea, #messageContentDiv').addClass('hidden');
}
function getInstrumentGrid() {
	var grid = null;
	if (typeof objSummaryView != 'undefined' && objSummaryView) {
		grid = objSummaryView.getGrid();
	}
	return grid;
}
function toggleInstrumentPagination(strMode) {

	var classSuffix = strMode === 'UPDATE' ? 'Update' : '';
	$('.previousTxn' + classSuffix).unbind('click').bind('click', function() {
				handleInstrumentPagination(-1, strMode);
			});
	$('.nextTxn' + classSuffix).unbind('click').bind('click', function() {
				handleInstrumentPagination(1, strMode);
			});
}
function updatePagingParamsEdit(intCurrentIndex, intTotalRows) {

	var instGrid = getInstrumentGrid();
	var pageSize = instGrid.getStore().pageSize;
	var totalPrevLimit = (intTotalRows - pageSize) + 1;
	
	$('.currentPageUpdate').html(intCurrentIndex);
	$('.totalPagesUpdate').html(intTotalRows);
	if(intCurrentIndex === 1){
		$(".previousTxnUpdate").addClass('button-grey-effect');
		$(".nextTxnUpdate").removeClass('button-grey-effect');
	} else if(intCurrentIndex === intTotalRows){
		$(".previousTxnUpdate").removeClass('button-grey-effect');
		$(".nextTxnUpdate").addClass('button-grey-effect');
	} else if(intCurrentIndex === totalPrevLimit) {
		$(".previousTxnUpdate").addClass('button-grey-effect');
		$(".nextTxnUpdate").removeClass('button-grey-effect');
	}else{
		$(".previousTxnUpdate").removeClass('button-grey-effect');
		$(".nextTxnUpdate").removeClass('button-grey-effect');
	}
}
function updatePagingParamsView(intCurrentIndex, intTotalRows) {
	
	var instGrid = getInstrumentGrid();
	var pageSize = instGrid.getStore().pageSize;
	var totalPrevLimit = (intTotalRows - pageSize) + 1;
	
	$('.currentPage').html(intCurrentIndex);
	$('.totalPages').html(intTotalRows);
	if(intCurrentIndex === 1){
		$(".previousTxn").addClass('button-grey-effect');
		$(".nextTxn").removeClass('button-grey-effect');
	}else if(intCurrentIndex === intTotalRows){
		$(".previousTxn").removeClass('button-grey-effect');
		$(".nextTxn").addClass('button-grey-effect');
	} else if(intCurrentIndex === totalPrevLimit) {
		$(".previousTxn").addClass('button-grey-effect');
		$(".nextTxn").removeClass('button-grey-effect');
	}else{
		$(".previousTxn").removeClass('button-grey-effect');
		$(".nextTxn").removeClass('button-grey-effect');
	}
}
function handleInstrumentPagination(intCount, strMode) {
	var classSuffix = (strMode === 'UPDATE') ? 'Update' : '';
	var intCurrentInst = parseInt($($('.currentPage' + classSuffix)[0]).text(),10);
	var grid = getInstrumentGrid();
	var intMoveTo = 0, record, strInstIdentifier;
	if (grid) {
		intMoveTo = intCurrentInst + intCount;
		var pageSize = grid.getStore().pageSize;
		var tempMoveTo = 0;
		
		var instGrid = getInstrumentGrid();
		var pager = instGrid.down('toolbar[xtype="smartGridPager"]');
		
		var totalpageCount = (!Ext.isEmpty(pager) && !Ext.isEmpty(pager
				.getPageData().pageCount)) ? pager.getPageData().pageCount : 1;
		var toRecordCount = (!Ext.isEmpty(pager) && !Ext.isEmpty(pager
				.getPageData().toRecord)) ? pager.getPageData().toRecord : 1;
		var currentPage = instGrid.getCurrentPage();
		var totalRecordCount = instGrid.store.totalCount;
		
		if(currentPage < totalpageCount){
			totalRecordCount = toRecordCount;
		}
		
		if((intMoveTo != pageSize) && (intMoveTo%pageSize != 0)){
			tempMoveTo = (intMoveTo%pageSize);
		}
		else{
			if(intMoveTo%pageSize == 0){
				tempMoveTo = pageSize;
			}
			else{
			tempMoveTo = intMoveTo;
			}
		}
		if(strMode === 'UPDATE'){
			while(tempMoveTo <= grid.store.getCount()){
				record = grid.getRecord(tempMoveTo);
				if(record.data.status === 0 || record.data.status === 1 || record.data.status === 2)
				{
					break;
				}
				if(tempMoveTo === grid.store.getCount())
					{
						record = null;
					}
				intMoveTo = intCurrentInst+ intCount + intCount;
			}
		}
		else{
			record = grid.getRecord(tempMoveTo);
		}
		if (record) {
			if (record && record.data && record.data.identifier)
				strInstIdentifier = record.data.identifier;
			if (strInstIdentifier) {
				doClearMessageSection();
				//blockInstrumentUI(true);

				if (strMode === 'UPDATE') {
					editVADetail(record, 'UPDATE');
					updatePagingParamsEdit(intMoveTo, totalRecordCount);
				} else if (strMode === 'VIEW') {
					editVADetail(record, 'VIEW');
					updatePagingParamsView(intMoveTo, totalRecordCount);
				}
				
			}
		}

	}
}
function handleBatchDetailGridRowAction(grid, rowIndex, columnIndex, action,
		event, record) {
	var strAction = action;
	var strInstIdentifier = null, strPaintAction = null, strDivId = null, strButtonMask = null, strRightsMask = null, strActionMask = null;

	if(rowIndex === undefined)
		rowIndex = 0;
	if (record) {
		if (record.data && record.data.identifier)
			strInstIdentifier = record.data.identifier;
		if (record.store && record.store.proxy && record.store.proxy.reader
				&& record.store.proxy.reader.jsonData
				&& record.store.proxy.reader.jsonData.d
				&& record.store.proxy.reader.jsonData.d.__buttonMask)
			strButtonMask = record.store.proxy.reader.jsonData.d.__buttonMask;

		if (record.data && record.data.__metadata && record.data.__metadata
				&& record.data.__metadata.__rightsMap)
			strRightsMask = record.data.__metadata.__rightsMap;

		var maskArray = new Array();
		maskArray.push(strButtonMask);
		maskArray.push(strRightsMask);
		var intMaskSize = !isEmpty(strButtonMask)
				? strButtonMask.length
				: (!isEmpty(strRightsMask) ? strRightsMask.length : 0);
		strActionMask = doAndOperation(maskArray, intMaskSize);
	}
	if (!isEmpty(strInstIdentifier) && !isEmpty(strAction)) {
		doClearMessageSection();
		if (strAction === 'btnEdit')
			strPaintAction = 'UPDATE';
		else if (strAction === 'btnView') {
			strDivId = 'transactionWizardViewPopup';
			strPaintAction = 'VIEW';
		} else if (strAction === 'btnError') {
			strPaintAction = 'ERROR';
		}
		if (strPaintAction === 'VIEW' || strPaintAction === 'UPDATE') {
			var instGrid = getInstrumentGrid();
			
			var pager = instGrid.down('toolbar[xtype="smartGridPager"]');
			var totalpageCount = (!Ext.isEmpty(pager) && !Ext.isEmpty(pager
					.getPageData().pageCount)) ? pager.getPageData().pageCount : 1;
			var toRecordCount = (!Ext.isEmpty(pager) && !Ext.isEmpty(pager
					.getPageData().toRecord)) ? pager.getPageData().toRecord : 1;
			var currentPage = instGrid.getCurrentPage();
			var totalRecordCount = instGrid.store.totalCount;
			if(currentPage < totalpageCount){
				totalRecordCount = toRecordCount;
			}
			
			if (strPaintAction === 'VIEW') {
				if (instGrid) {
					toggleInstrumentPagination(strPaintAction);
					updatePagingParamsView(instGrid.getRowNumber(rowIndex + 1),
							totalRecordCount);
					if(instGrid.store.getCount() === 1){
						$('.previousTxn').addClass('button-grey-effect');
						$('.nextTxn').addClass('button-grey-effect');
					}
				}
				showPopup("DetailsViewPopup",strInstIdentifier, strPaintAction,
						strDivId, strActionMask);
			}
			if (strPaintAction === 'UPDATE') {
				$('.instrumentEditPaginationBar').removeClass('hidden');
				if (instGrid) {
					toggleInstrumentPagination(strPaintAction);
					updatePagingParamsEdit(instGrid.getRowNumber(rowIndex + 1),
							totalRecordCount);
					if(instGrid.store.getCount() === 1){
						$('.previousTxnUpdate').addClass('button-grey-effect');
						$('.nextTxnUpdate').addClass('button-grey-effect');
					}
				}
				showPopup("DetailsPopup",strInstIdentifier, strPaintAction,
						strDivId, strActionMask);
			}
			
		}

	}
}
function getReportPaymentTxnDetail(screenType, actionName){
	var arrExtension = {
			downloadXls : 'xls',
			downloadCsv : 'csv',
			downloadPdf : 'pdf',
			downloadTsv : 'tsv'
		};
	var strExtension = arrExtension[actionName];
	var withHeaderFlag = $('#headerCheckBox').is(':checked');
	var intCurrentInst = parseInt($($('.currentPage')[0]).text(),10);
	var strUrl = '';
	strUrl = 'services/getVirtualAccMaintViewRecordDetailReport.' + strExtension;
	form = document.createElement( 'FORM' );
	form.name = 'frmMain';
	form.id = 'frmMain';
	form.method = 'POST';
	form.appendChild( createFormField( 'INPUT', 'HIDDEN', csrfTokenName, tokenValue ) );
	form.appendChild( createFormField( 'INPUT', 'HIDDEN', '$Recordkey', strRecKey ) );
	form.appendChild( createFormField( 'INPUT', 'HIDDEN', '$issuanceNumber', dtlssuanceNumber ) );
	form.appendChild( createFormField( 'INPUT', 'HIDDEN', '$screenType', screenType ) );
	form.appendChild( createFormField( 'INPUT', 'HIDDEN', '$InstNumber', intCurrentInst ) );
	form.appendChild( createFormField( 'INPUT', 'HIDDEN', '$txtCSVFlag',withHeaderFlag) );
	form.action = strUrl;
	document.body.appendChild( form );
	form.submit();
	document.body.removeChild( form );
}

function createFormField(element, type, name, value) {
	var inputField;
	inputField = document.createElement(element);
	inputField.type = type;
	inputField.name = name;
	inputField.value = value;
	return inputField;
}

function togglevirtualAccimportTransactionBtn() {
	if (mode === 'EDIT') {
		$('#btnImportVirtualAcc').removeClass('hidden');
		$('#btnImportVirtualAcc').unbind('click');
		$('#btnImportVirtualAcc').bind('click', showImportVirtualAccountPopup);
	}
	else {
		$('#btnImportVirtualAcc').addClass('hidden');
		$('#btnImportVirtualAcc').unbind('click');

	}
}

function showImportVirtualAccountPopup() {
	doClearMessageSection();
	var strIdentifier = encodeURIComponent($('#viewState').val());
	$('#virtualAccimportTransactionPopup').dialog({
		modal : true,
		maxHeight : 550,
		width : 735,
		resizable : false,
		draggable : false,
		title : getLabel('importAccounts', 'Import Virtual Accounts'),
		open : function(event, ui) {
			populateVirtualAccMapCodes();
			$('#importTxn_btnUpload').unbind('click');
			$('#importTxn_btnUpload').bind('click', function() {
				doUploadFile();
			});
			$('#virtualAccDetailsGridDiv').empty();
			txnDetailsGrid = createTxnGrid('virtualAccDetailsGridDiv', strIdentifier);
		}
	});
}

function closeImportVirtualAccountPopup() {
	$('#virtualAccimportTransactionPopup').dialog('close');
}

function doUploadFile() {
	var strId = encodeURIComponent($('#viewState').val());
	var url = 'services/importAccounts' + '(' + strId + ').json';
	var data = new FormData();
	data.append('file', document.getElementById('virtualAccountImportFile').files[0]);
	data.append('clientMapCode', $('#clientMapCode').val());
	data.append('is', $('input[name=processParameterBean]:checked').val());
	$.ajax({
		url : url,
		type : 'POST',
		data : data,
		processData : false,
		contentType : false,
		complete : function(XMLHttpRequest, textStatus) {
			if ('error' === textStatus) {
				var arrError = [];
				arrError.push({
					'errorCode' : 'Message',
					'errorMessage' : 'Error'
				});
				closeImportVirtualAccountPopup();
				paintErrors(arrError);
			}
		},
		success : function(data) {
			if (data && data.d && data.d.success === 'SUCCESS') {
				closeImportVirtualAccountPopup();
			}
			else
				if (data && data.d && data.d.success === 'FAILED') {
					closeImportVirtualAccountPopup();
					if (data.d.message) {
						paintErrors(data.d.message.errors);
					}
				}
				else {
					closeImportVirtualAccountPopup();
					doHandleFileUploadStatus();
				}
		}
	});
}

function createTxnGrid(divId, strIdentifier) {
	var renderToDiv = !isEmpty(divId) ? divId : 'virtualAccDetailsGridDiv';
	var store = createTxnGridStore(strIdentifier);
	var grid = Ext
			.create(
					'Ext.grid.Panel',
					{
						store : store,
						maxHeight : 200,
						scroll : 'vertical',
						cls : 't7-grid',
						popup : true,
						listeners : {
							cellclick : function(view, td, cellIndex, record, tr, rowIndex, e, eOpts) {
								if (record.data.statusCode === 'E' || record.data.statusCode === 'T') {
									showUploadErrorReport(record.data);
									;
								}

							}
						},
						columns : [
								{
									text : getLabel('lblAction', 'Action'),
									width : 70,
									draggable : false,
									resizable : false,
									sortable : false,
									hideable : false,
									colType : 'action',
									renderer : function(value, metaData, record, rowIndex, colIndex, store) {
										if (record.data.statusCode === 'E' || record.data.statusCode === 'T') {
											return '<a class="grey cursor_pointer action-link-align grid-row-action-icon icon-error" name="btnViewError" title="'
													+ getLabel('lblViewReport', 'View Report') + '">&nbsp;&nbsp;</a>';
										}
										if (record.data.statusCode === 'Q' || record.data.statusCode === 'R') {
											return '<i class="fa fa-spinner"></i>';
										}
										else {
											return '<a class="grey cursor_pointer action-link-align grid-row-action-icon icon-completed" name="btnViewOk" title="'
													+ getLabel('lblCompleted', 'Completed') + '">&nbsp;&nbsp;</a>';
										}
									}

								}, {
									text : getLabel('lblFileName', 'File Name'),
									dataIndex : 'fileName',
									width : 150,
									draggable : false,
									resizable : true,
									hideable : false,
									sortable : false
								}, {
									text : getLabel('lblCreatedOn', 'Import DateTime'),
									dataIndex : 'createdOn',
									width : 130,
									draggable : false,
									resizable : true,
									hideable : false,
									sortable : false
								}, {
									text : getLabel('lblRemarks', 'Status'),
									dataIndex : 'remarks',
									flex : 1,
									draggable : false,
									resizable : true,
									hideable : false,
									sortable : false
								} ],
						renderTo : renderToDiv
					});
	return grid;
}

function createTxnGridStore(strIdentifier) {
	var jsonData = null;
	if (!isEmpty(strIdentifier)) {
		$.ajax({
			url : 'services/importAccountStatus(' + strIdentifier + ').json',
			type : 'POST',
			async : false,
			complete : function(XMLHttpRequest, textStatus) {
			},
			success : function(data) {
				if (data && data.d){
					jsonData = data.d.status;
				}
			}
		});
	}
	var myStore = Ext.create('Ext.data.Store', {
		id : 'matrixStore',
		fields : [ 'fileName', 'createdOn', 'remarks', 'statusCode', 'ahtskdata', 'ahtskclient' ],
		data : jsonData,
		autoLoad : true
	});
	return myStore;
}

function populateVirtualAccMapCodes() {
	var strData = {};
	strData['identifier'] = encodeURIComponent($('#viewState').val());
	strData[csrfTokenName] = csrfTokenValue;
	$.ajax({
		url : 'services/virtualaccmapcodelist.json',
		data : strData,
		method : 'POST',
		success : function(responseData) {
			if (!isEmpty(responseData)) {
				var data = responseData;
				var el = $('#clientMapCode');
				$(el).empty();
				for (index = 0; index < data.length; index++) {
					obj = data[index];
					Object.keys(obj).forEach(function(key)
					{
						var opt = $('<option />', {
							value : key,
							text : obj[key]
						});
					opt.attr('selected', 'selected');
					opt.appendTo(el);
					});
				}
			}
			$('#clientMapCode').niceSelect('destroy');
			$('#clientMapCode').niceSelect();
		}
	});
}

function toggleMoreLessText(me) {
	$('.moreCriteria').toggleClass('hidden');
	$('#moreLessCriteriaCaret').toggleClass('fa-caret-up fa-caret-down');
	var textContainer = $(me).children('#moreLessCriteriaText');
	var labelText = textContainer.text().trim();
	if (labelText === getLabel('lblHideImportHeader', 'Hide Import Transaction Details')) {
		textContainer.text(getLabel('lblShowImportHeader', 'Show Import Transaction Details'));

	}
	else
		if (labelText === getLabel('lblShowImportHeader', 'Show Import Transaction Details')) {
			textContainer.text(getLabel('lblHideImportHeader', 'Hide Import Transaction Details'));

		}
}

function showUploadErrorReport(record) {
	var me = this;
	var strUrl = 'services/importAccount/getUploadErrorReport.pdf';
	form = document.createElement('FORM');
	form.name = 'frmMain';
	form.id = 'frmMain';
	form.method = 'POST';
	form.appendChild(me.createFormField('INPUT', 'HIDDEN', csrfTokenName, csrfTokenValue));
	form.appendChild(me.createFormField('INPUT', 'HIDDEN', 'taskid', record.ahtskdata));
	form.appendChild(me.createFormField('INPUT', 'HIDDEN', 'client', record.ahtskclient));
	form.action = strUrl;
	document.body.appendChild(form);
	form.submit();
	document.body.removeChild(form);
}

function showRealAccountBalance(record){
	var strAccNumber = $('#clientCreditAccountNo').val();	
	$.ajax({
		url : 'services/getParentAccountBalance.json',
		type : 'GET',
		async : false,
		data : {
			$accountNumber : $('#clientCreditAccountNo').val()
		},		
		success : function(response) {
			if (response.length !== 0) {
				var balAmount = parseInt(response.availableBalance).toFixed(2);
				$("#balSpan").html(ccyCode + " - " + balAmount).addClass('grey popupSmallFont inline');
				balanceData = response.availableBalance;
			}
		}
	});
	
	//$('#availableBalance').val(balanceData);
	//$('#availableBalance').val(balanceData);
	//$('#ccyCode').val(ccyCode);
}

function doHandleFileUploadStatus() {
	var strIdentifier = encodeURIComponent($('#viewState').val());
	$.ajax({
		url : 'services/importAccountStatus(' + strIdentifier + ').json',
		type : 'POST',
		async : false,
		complete : function(XMLHttpRequest, textStatus) {
			if ('error' === textStatus) {
				var arrError = [];
				arrError.push({
					'errorCode' : 'Message',
					'errorMessage' : getLabel('unknownError', 'Unknown Error')
				});
				paintErrors(arrError);
			}
		},

		success : function(data) {
			if ((data && data.d && data.d.success === 'INPROGRESS')) {
			}
			else
				if ((data && data.d && data.d.success === 'SUCCESS')) {
					closeImportVirtualAccountPopup();

				}
				else
					if ((data && data.d && data.d.success === 'FAILED')) {
						closeImportVirtualAccountPopup();
					}
		}
	});
}

function paintErrors(arrError, strErrTitle) {
	var element = null, strMsg = null, strTargetDivId = 'messageArea', strErrorCode = '';
	if(isEmpty(strErrTitle)){
		strErrTitle = getLabel('errorlbl', 'ERROR');
	}
	if (!isEmpty(strErrTitle)) {
		$('#messageCodeSpan').empty();
		$('#messageCodeSpan').text(strErrTitle + ':');
	}
	if (arrError && arrError.length > 0) {
		$('#' + strTargetDivId).empty();
		$('#' + strTargetDivId).removeClass("hidden");
		$.each(arrError, function(index, error) {
			strMsg = error.errorMessage;
			strErrorCode = error.errorCode || error.code;
			strMsg += !isEmpty(strErrorCode) ? ' (' + strErrorCode + ')' : '';
			if (!isEmpty(strErrorCode)) {
				if (strErrorCode.toUpperCase().indexOf("WARN") >= 0) {
					var msg = mapLbl['warnMsg'];
					if (!isEmpty(msg)){
						msg += ' : ';
					}
					element = $('<p>').text(msg + error.errorMessage);
					element.appendTo($('#' + strTargetDivId));
					$('#' + strTargetDivId + ', #messageContentDiv').removeClass('hidden');
				}
				else {
					element = $('<p>').text(strMsg);
					if (strErrorCode === 'P22') {
						$("<a id='hrefValidate' href='#'>").css({
							'display' : 'none',
							'float' : 'right'
						}).addClass('t7-anchor').text('Validate').appendTo(element).click(function() {
							doRRValidateHeader();
						});
					}
					element.appendTo($('#' + strTargetDivId));
					$('#' + strTargetDivId + ', #messageContentDiv').removeClass('hidden');
				}
				$("html, body").animate({
					scrollTop : 0
				}, "slow");
			}
		});

	}

}