var objClientCodeAutoCompleter = null;
var objAgreementCodeAutoCompleter = null;
var clientCodeVal = null;
var clientNameVal = null;
var agreementCodeVal = null;


Ext.Loader.setConfig({
	enabled : true,
	disableCaching : false,
	setPath : {
		'Ext' : 'static/js/extjs4.2.1/src',
		'Ext.ux' : 'static/js/extjs4.2.1/src/ux'
	}
});



jQuery.fn.CompanyNameAutoComplete = function() {
	
	return this.each(function() {
					$(this).autocomplete({
					source : function(request, response) {
						$.ajax({
									url :'services/userseek/AgreementFrequencyClientCodeSeek.json',
									dataType : "json",
									type:'POST',
									data : {
										$filtercode1:document.getElementById("sellerId").value,
										$autofilter : request.term
									},
									success : function(data) {
										var rec = data.d.preferences;
										response($.map(rec, function(item) {
													return {
														label : item.DESCRIPTION,
														clientDesc : item.DESCRIPTION,
														value : item.DESCRIPTION,
														clientDtl : item
													}
												}));
									}
								});
					},
					minLength : 1,
					select : function(event, ui) {
						var data = ui.item.clientDtl;
						document.getElementById("clientId").value=data.CODE;				
						document.getElementById("clientName").value = data.DESCRIPTION;
						document.getElementById("agreementCode").value = "";
						document.getElementById("agreementName").value = "";
						document.getElementById("agreementRecKey").value = "";
						setCponEnforcedStructureType();
						/*objAgreementCodeAutoCompleter.cfgExtraParams = [ 
									{
										key : '$filtercode1',
										value : document.getElementById("sellerId").value
									},
									{
										key : '$filtercode2',
										value : document.getElementById("clientId").value
									}                                      	
                         ];*/
						 setDirtyBit();	
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
			var inner_html = '<a><ol class="t7-autocompleter"><ul  >'
					//+ item.label
					//+ '</ul><ul  >'
					+ item.clientDesc + '</ul></ol></a>';
			return $("<li></li>").data("item.autocomplete", item)
					.append(inner_html).appendTo(ul);
		};*/
	});
};

jQuery.fn.AgreementCodeAutoComplete = function() {
	
	return this.each(function() {
					$(this).autocomplete({
					source : function(request, response) {
						$.ajax({
									url :'services/userseek/AgreementFrequencyAgreementCodeSeek.json',
									dataType : "json",
									type:'POST',
									data : {
										$top:20,
										$filtercode1:document.getElementById("sellerId").value,
										$filtercode2:document.getElementById("clientId").value,
										$autofilter : request.term
									},
									success : function(data) {
										var rec = data.d.preferences;
										if (isEmpty(rec) || (isEmpty(data.d)) || rec.length === 0) {
											rec = [ {
												label : 'No match found..',
												value : ""
											}];
											response($.map(rec, function(item) {
												return {
													label : item.label,
													value : item.value
												}
											}));

										}
										else{
											response($.map(rec, function(item) {
												return {
													label : item.CODE,
													agreementDesc : item.DESCRIPTION,
													value : item.CODE,
													agreementDtl : item
												}
											}));
										}
									}
								});
					},
					minLength : 1,
					select : function(event, ui) {
						var data = ui.item.agreementDtl;
						document.getElementById("agreementCode").value = data.CODE;
						document.getElementById("agreementName").value = data.DESCRIPTION;
						document.getElementById("agreementRecKey").value = data.AGREEMENTID;
						setDirtyBit();
						setFrequencyType();
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
			var inner_html = '<a><ol class="t7-autocompleter"><ul  >'
					//+ item.label
					//+ '</ul><ul  >'
					+ item.label + '</ul></ol></a>';
			return $("<li></li>").data("item.autocomplete", item)
					.append(inner_html).appendTo(ul);
		};*/
	});
};

function showTxnInstrumentInfoPopup() {
	$('#agreementSchedulingTrasanctionSummaryDiv').dialog(
			{
				autoOpen : false,
				maxHeight : 620,
				width : 690,
				modal : true,
				dialogClass : 'ft-dialog',
				title : getLabel('title.transactions.info', 'Transaction Information'),
				open : function() {
					$('#agreementSchedulingTrasanctionSummaryDiv').removeClass('hidden');
					var additionalInfo = getAgreementAddtionalInfo($('#viewState').val());
					if (!isEmpty(additionalInfo)) {
						if (additionalInfo && additionalInfo.companyName
								&& additionalInfo.companyAddress) {
							var strCompany = additionalInfo.companyName + '</br>'
									+ additionalInfo.companyAddress;
							$('.companydetails_InfoSpan ').html(strCompany);
						}
						if (additionalInfo && additionalInfo.agreementName) {
							$('.agreementName_InfoSpan').text(additionalInfo.agreementName);
						}
						if (additionalInfo && additionalInfo.agreementType) {
							$('.agreementType_InfoSpan').text(additionalInfo.agreementType);
						}
						if (additionalInfo && additionalInfo.enteredBy) {
							$('.enteredBy_InfoSpan').text(additionalInfo.enteredBy);
						}
						if (additionalInfo && additionalInfo.status) {
							$('.status_InfoSpan').text(additionalInfo.status);
						}
					}
					if (!isEmpty(additionalInfo.history) && additionalInfo.history.length > 0) {
						paintAgreementAuditInfoGrid(additionalInfo.history);
					}
					$('#agreementSchedulingTrasanctionSummaryDiv').dialog('option', 'position', 'center');
				},
				close : function() {
				}
			});
	$('#agreementSchedulingTrasanctionSummaryDiv').dialog('open');
	$('#agreementSchedulingTrasanctionSummaryDiv').dialog('option', 'position', 'center');
}

function getAgreementAddtionalInfo(strIdentifier) {
	var objResponseData = null;
	var strData = {};
	strData[csrfTokenName] = csrfTokenValue;
	if (strIdentifier && strIdentifier !== '') {
		var strUrl = 'services/agreementFrequencyMst/agreementSchedulingAdditionalInfo.json?viewState=' + strIdentifier;
		$.ajax({
			url : strUrl,
			type : 'POST',
			data : strData,
			async : false,
			contentType : 'application/json',
			complete : function(XMLHttpRequest, textStatus) {
			},
			success : function(data) {
				if (data && data.d) {
					objResponseData = data.d;
				}
			}
		});
	}
	return objResponseData;
}

function paintAgreementAuditInfoGrid(data) {
	var renderToDiv = 'auditInfoGridDiv';
	$('#auditInformationInfoHdrDiv').removeClass('hidden');
	if (!isEmpty(renderToDiv)) {
		$('#' + renderToDiv).empty();
		var store = createAuditInfoGridStore(data);
		var grid = Ext.create('Ext.grid.Panel', {
			store : store,
			popup : true,
			columns : [ {
				dataIndex : 'userCode',
				text : getLabel('userCode', 'User'),
				width : 150,
				draggable : false,
				resizable : false,
				hideable : false
			}, {
				dataIndex : 'logDate',
				text : getLabel('logDate', 'Date Time'),
				width : 200,
				draggable : false,
				resizable : false,
				hideable : false
			}, {
				dataIndex : 'statusDesc',
				text : getLabel('statusDesc', 'Status'),
				width : 150,
				draggable : false,
				resizable : false,
				hideable : false,
				renderer : function(value, metadata) {
					if (!Ext.isEmpty(value) && value.length > 11) {
						metadata.tdAttr = 'title="' + value + '"';
					}
					return value;
				}
			}, {
				dataIndex : 'remarks',
				text : getLabel('remarks', 'Reject Remarks'),
				flex : 1,
				draggable : false,
				resizable : false,
				hideable : false,
				renderer : function(value, metadata) {
					if (!Ext.isEmpty(value) && value.length > 11) {
						metadata.tdAttr = 'title="' + value + '"';
					}
					return value;
				}
			} ],
			renderTo : renderToDiv
		});
		var layout = Ext.create('Ext.container.Container', {
			width : 'auto',
			items : [ grid ],
			renderTo : renderToDiv
		});
		layout;
		return layout;
	}
function createAuditInfoGridStore(jsonData) {
	var myStore = Ext.create('Ext.data.Store', {
		fields : [ 'version', 'parentRecordKeyNo', 'userCode', 'logDate', 'statusDesc', 'clientCode', 'logNumber',
				'billerCode', 'remarks', '__metadata' ],
		data : jsonData,
		autoLoad : true
	});
	return myStore;
}
}