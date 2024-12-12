function getProductPopUp() {
	$('#productPopup').dialog( {
		autoOpen : false,
		resizable : false,
		width : 480,
		height : 350,
		modal : true,
		position : [ 'center', 'middle' ],
		buttons : {
			"Cancel" : function() {
				$(this).dialog("close");
			}
		},
		open:function(){
			$('.ui-dialog-buttonpane').find('.ui-dialog-buttonset').addClass('nofloating centerAlign');
			$('.ui-dialog-buttonpane').find('button:contains("Cancel")').attr("title","Cancel");
            $('.ui-dialog-buttonpane').find('button:contains("Cancel")').find('.ui-button-text').prepend('<span class="fa fa-minus-circle">&nbsp;&nbsp</span>');
		}
	});
	$('#productPopup').dialog("open");
}

function getAdvancedFilterPopup(strUrl, frmId) {
	var loggerDesc = null;
	if (typeof selectedFilterLoggerDesc !== 'undefined') {
		loggerDesc = selectedFilterLoggerDesc;
	}
	if(loggerDesc == 'BUYER')
	{
		$('#lblBene').text(getLabel("seller","Seller"));
	}
	else
	{
		$('#lblBene').text(getLabel("buyer","Buyer"));
	}
    var defaultFromDate=btns['defaultFromDate'];
	var defaultToDate=btns['defaultToDate'];
	var fromDate=$('#fromDate').val();
	var toDate= $('#toDate').val();
	var dueFromDate= $('#fromDueDate').val();
	var dueToDate= $('#toDueDate').val();
	if(fromDate==null || fromDate=="")
     {
	 $('#fromDate').addClass('grey');
	 $('#fromDate').val(defaultFromDate);
	 }
	if(toDate==null || toDate=="")
	{
	 $('#toDate').addClass('grey');
	 $('#toDate').val(defaultToDate);
	}
	if(dueFromDate==null || dueFromDate=="")
     {
	 $('#fromDueDate').addClass('grey');
	 $('#fromDueDate').val(defaultFromDate);
	 }
	if(dueToDate==null || dueToDate=="")
	{
	 $('#toDueDate').addClass('grey');
	 $('#toDueDate').val(defaultToDate);
	}
	

	buttonsOpts[btns['cancelBtn']]=function() {
					$('form#filterForm').each (function(){
							this.reset();
							$('#txtAmount').val("0.00");
							fromDate="";
							toDate="";
							dueFromDate="";
							dueToDate="";
							
					});
					$(this).dialog("close");
				};
	buttonsOpts[btns['clearBtn']]=function() {
		var itemId, defaultItemValue;
		$('form#filterForm, form#filterForm1').find('input:visible, select:visible').each(function(index, item) {
			item = $(item);
			itemId = item.attr('id');
			defaultItemValue = '';
			if(itemId === 'fromDate' || itemId === 'fromDueDate') {
				defaultItemValue = defaultFromDate;
			} else if(itemId === 'toDate' || itemId === 'toDueDate') {
				defaultItemValue = defaultToDate;
			}
			if(defaultItemValue !== '') {
				item.addClass('grey');
			}
			item.val(defaultItemValue);
		});
	};
	buttonsOpts[btns['goBtn']]=function() {
					if ($('#fromDate').val() == defaultFromDate) {
						$('#fromDate').val("");
					}
					if ($('#fromDueDate').val() == defaultFromDate) {
						$('#fromDueDate').val("");
					}
					if ($('#toDate').val() == defaultToDate) {
						$('#toDate').val("");
					}
					if ($('#toDueDate').val() == defaultToDate) {
						$('#toDueDate').val("");
					}
					if ($('#txtAmount').val() == "") {
						$('#txtAmount').val("0");
					}
			
					$(this).dialog("close");
					goToPage(strUrl, frmId);
				};	

		$('#advancedFilterPopup').dialog({
		autoOpen : false,
		maxHeight: 580,
		minHeight: (screen.width) > 1024 ? 156 : 0 ,
		width : 840,
		dialogClass: 'ft-dialog',
		resizable: false,
		draggable: false,
		title : getLabel("advancedFilter","Advanced Filter"),
		modal : true,
	open:function(){
      	  hideErrorPanel('#advancedFilterErrorDiv');
      	  $('#advancedFilterPopup').dialog('option', 'position', 'center');
      },
	  focus :function(){
			/* if(!isEmpty(selectedClient))
				$("#msClient").val(selectedClient); */
	  },
	  close : function(){
	  }
	});
	$('#advancedFilterPopup').dialog("open");

}
function changeMode(element,strUrl, frmId)
{
	var frm = document.getElementById(frmId);
	frm.action = strUrl;
	frm.target = "";
	frm.method = "POST";
	if(element.value!=USERMODE)
	{
		frm.submit();
	}
}
function setSearchRefTextOnFocus()
{
	var referenceVal=$('#searchReference').val();
	$('#fromDate').addClass('black');
	if(referenceVal=="" || referenceVal==null )
	{
		$('#searchReference').removeClass('black');
		$('#searchReference').addClass('grey');
		$('#searchReference').val("Reference No");
	}
	else if(referenceVal=="Reference No")
	{
		$('#searchReference').val("");
	}
}

function setSearchRefText()
{
	var referenceVal=$('#searchReference').val();
	if(referenceVal=="" || referenceVal==null )
	{	
	$('#searchReference').removeClass('black');
	$('#searchReference').addClass('grey');
		$('#searchReference').val("Reference No");
	}
}