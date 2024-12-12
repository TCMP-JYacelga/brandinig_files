function changeGtySort(sortCol, sorOrd, colId)
{
	var frm = document.getElementById('frmMain');
	if (!frm) 
	{
		alert(_errMessages.ERR_NOFORM);
		return false;
	}
	if(!isEmpty(colId))
	{
		document.getElementById("txtSortColId").value = colId;
		if(!isEmpty(sortCol))
		{
			document.getElementById("txtSortColName").value = sortCol;
		}
		if(!isEmpty(sorOrd))
		{
			document.getElementById("txtSortOrder").value = sorOrd;			
		}
		frm.action = "sortExportGuaranteeList.form";
		frm.target = "";
		frm.method = "POST";
		frm.submit();		
	}
}
function getAdvancedFilterPopup(frmId) 
{
	$('#advancedFilterPopup').dialog( {
		autoOpen : false,
		height : 290,
		width : 473,
		modal : true,
		buttons : {
			"Filter" : function() {
				if ($('#fromDate').val() == "From Date") {
					$('#fromDate').val("");
				}
				if ($('#toDate').val() == "To Date") {
					$('#toDate').val("");
				}
				if ($('#txtAmount').val() == "") {
					$('#txtAmount').val("0");
				}
		
				$(this).dialog("close");
				filterLC(frmId);
			},
				
		    "Clear" : function() {
					$('#filterForm').each (function(){
							this.reset();
							$('#txtAmount').val("0.00");
							fromDate="";
							toDate="";
							$('#txtReference').val("");
							$('#txtDrawer').val("");
					});
			},
				
			"Cancel" : function() {
					$('#filterForm').each (function(){
							this.reset();
							$('#txtAmount').val("0.00");
							fromDate="";
							toDate="";
							$('#txtReference').val("");
							$('#txtDrawer').val("");
							
					});
					$(this).dialog("close");
			}
		},
		open: function() {
			$('.ui-dialog-buttonpane').find('.ui-dialog-buttonset').addClass('nofloating centerAlign');
            $('.ui-dialog-buttonpane').find('button:contains("Clear")').attr("title","Clear");
            
            $('.ui-dialog-buttonpane').find('button:contains("Cancel")').attr("title","Cancel");
            $('.ui-dialog-buttonpane').find('button:contains("Cancel")').find('.ui-button-text').prepend('<span class="fa fa-minus-circle">&nbsp;&nbsp</span>');
            $('.ui-dialog-buttonpane').find('button:contains("Filter")').attr("title","Filter");
            $('.ui-dialog-buttonpane').find('button:contains("Filter")').find('.ui-button-text').prepend('<span class="fa fa-filter">&nbsp;&nbsp</span>');
        }
	});
	$('#advancedFilterPopup').dialog("open");
}
function filterLC(frmId)
{
	var frm = document.getElementById(frmId);
	frm.action = "advanceFilterExportGuarantee.form";
	frm.target = "";
	frm.method = "POST";
	frm.submit();
}
function viewGtyData(frmId, rowIndex)
{
	var frm = document.getElementById(frmId);
	document.getElementById("txtRecordIndex").value = rowIndex;
	frm.action = "viewExportGuaranteeMasterDetails.form ";
	frm.target = "";
	frm.method = "POST";
	frm.submit();
}
function simpleFilter(frmId)
{
	var frm = document.getElementById(frmId);

	if($("#txtExportGuaranteeClientDesc").length)
	{
		if($('#txtExportGuaranteeClientDesc').val()== null || $('#txtExportGuaranteeClientDesc').val()=='')
		{
			$('#txtExportGuaranteeClientCode').val('');
		}
		else
		{
			if($('#txtExportGuaranteeClientCode').val()== null || $('#txtExportGuaranteeClientCode').val()=='')
			{
				$('#txtExportGuaranteeClientCode').val($('#txtExportGuaranteeClientDesc').val());  
			}		  
		}
	}
	frm.action = "simpleFilterExportGuarantee.form";
	frm.target = "";
	frm.method = "POST";
	frm.submit();	
}
function changePage(navType, newPage) 
{
		var frm = document.getElementById('frmMain');
		if (!frm) 
		{
			alert(_errMessages.ERR_NOFORM);
			return false;
		}	
		var curPage=$('.pcontrol input', this.pDiv).val();
		var totPage='<c:out value="${total_pages}"/>';
		
		switch(navType) 
		{
			case 'first':
				frm.action = 'exportGuaranteeCenter_first.form';
				break;
			case 'prev':
				frm.action = 'exportGuaranteeCenter_previous.form';
				break;
			case 'next':
				if(curPage>=totPage)
					  return false;
				frm.action = 'exportGuaranteeCenter_next.form';
				break;
			case 'last':
				frm.action = 'exportGuaranteeCenter_last.form';
				break;
			case 'input':
				$('#page_number').val(curPage);
				frm.action = 'exportGuaranteeCenter_goto.form';
				break;
			default:
				alert(_errMessages.ERR_NAVIGATE);
				return false;
		}
		frm.target = "";
		frm.method = "POST";
		frm.submit();
}
function goBackToMaster(frmId,type)
{
	var frm = document.getElementById(frmId);
	var type = document.getElementById("type").value;
	if(type == 'SBLC')
	{
		frm.action = "viewExportStandbyLcMasterDetails.form";
	}
	if(type == 'GTY')
	{
		frm.action = "viewExportGuaranteeMasterDetails.form";
	}
	frm.target = "";
	frm.method = "POST";
	frm.submit();	
}
function goBackToAmendMaster(frmId,type)
{
	var frm = document.getElementById(frmId);
	var type = document.getElementById("type").value;
	document.getElementById("txtIndex").value = 0;
	if(type == 'SBLC')
	{
		frm.action = "backToViewExpStandbyLcAmendmentMstDetails.form";
	}
	if(type == 'GTY')
	{
		frm.action = "backToViewExpGuaranteeAmendmentMstDetails.form";
	}
	frm.target = "";
	frm.method = "POST";
	frm.submit();	
}
function goBackToCancelMaster(frmId,type)
{
	var frm = document.getElementById(frmId);
	var type = document.getElementById("type").value;
	if(type == 'SBLC')
	{
		frm.action = "viewExpStandbyLcCancellationMstDetails.form";
	}
	if(type == 'GTY')
	{
		frm.action = "viewExpGuaranteeCancellationMstDetails.form";
	}
	frm.target = "";
	frm.method = "POST";
	frm.submit();	
}
function getExportGTYHistoryPopUp(frmId, rowIndex)
{
	var frm = document.getElementById(frmId);
	document.getElementById("txtRecordIndex").value = rowIndex;
	frm.action = "exportGuaranteeHistory.hist";
	frm.target = "hWinSeek";
	frm.method = "POST";
	var strAttr;
	var intTop  = (screen.availHeight - 300)/2;
	var intLeft = (screen.availWidth - 600)/2;
	strAttr = "dependent=yes,scrollbars=yes,";
	strAttr = strAttr + "left=" + intLeft + ",";
	strAttr = strAttr + "top=" + intTop + ",";
	strAttr = strAttr + "width=700,height=300";
	window.open ("", "hWinSeek", strAttr);
	frm.submit();
	frm.target = "";
}
jQuery.fn.clientCodeSeekAutoCompleteExportGTY= function() {
	return this.each(function() {
		$(this).autocomplete({
					source : function(request, response) {
						$.ajax({
									url : "services/userseek/userclients.json",
									type: "POST",
									dataType : "json",
									data : {
										$autofilter : request.term,
										$top:-1
									},
									success : function(data) {
										var rec = data.d.preferences;
										response($.map(rec, function(item) {
													return {														
														label : item.DESCR,														
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
							if (!isEmpty(data.DESCR))
							{
								$('#txtExportGuaranteeClientDesc').val(data.DESCR);
								$('#txtExportGuaranteeClientCode').val(data.CODE);
							}
							simpleFilter('frmMain');
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

jQuery.fn.ForceAlphaNumericAndPercentOnly = function() {
	return this
			.each(function(){
				$(this)
						.keypress(function(e) 
						{
							// allows only alphabets & numbers, backspace, tab
							var keycode = e.which || e.keyCode;						
							if ((keycode >= 48 && keycode <= 57) || (keycode >= 65 && keycode <= 90) || (keycode >= 97 && keycode <= 122)
									|| keycode == 8 || keycode == 9 || keycode == 37)
								return true;

							return false;
						})
			})
};