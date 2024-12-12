function getCancelConfirmPopUp(strUrl) {
	if ( $('#dirtyBitSet').val() == 'true' ){
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
		$('#cancelConfirmMsg').bind('click',function(){
			$('#confirmMsgPopup').dialog("close");
		});
		
		$('#doneConfirmMsgbutton').bind('click',function(){
			$('#confirmMsgPopup').dialog("close");
			gotoPage(strUrl,'frmMain');
		});
		$('#textContent').focus();
	} else {
		gotoPage(strUrl,'frmMain');
	}
}

function goToPage(strUrl, frmId) 
{	
	$("#locationCode").removeAttr("disabled");
	var frm = document.getElementById(frmId);
	frm.action = strUrl;
	frm.target = "";
	frm.method = "POST";
	frm.submit(); 
}		

function setAutoCompleter(elementId,seekId){
	$(elementId).autocomplete({
		minLength: 1,
		source: function(request, response) {
			var strUrl = 'services/userseek/';
			strUrl+= seekId+'.json';
			$.ajax({
				url :strUrl,    
				data : {$autofilter : request.term, $filtercode1 : $('#locationCode').val()},
				async: false,  
				success : function(data) {
					if(isEmpty(data) 
							|| (isEmpty(data.d)) 
							|| (isEmpty(data.d.preferences))
							|| data.d.preferences.length == 0) {
						var rec = [{
							label: "",
							value: getLabel('suggestionBoxEmptyText', 'No match found..')
						}];
						response($.map(rec, function(item) {
							return {
								label : item.label,  
								value : item.value
							}
						}));
					} else if(!isEmpty(data)&&!(isEmpty(data.d))){
						var rec = data.d.preferences;
						response($.map(rec, function(item) {
							return {
								label : item.DESCR,
								value : item.CODE,  
							}
						}));	
					}
				}
			});
		},
		select : function(event, ui) {
			var data,label,value,nextElement = null;
			data = ui.item.bankDtl;
			label = ui.item.label;
			value = ui.item.value;
			if (label && value) {
				nextElement = $(this)[0].nextSibling.nextElementSibling.id;
				$("#"+nextElement).val(value);
				 $(this).val(label);
				 return false;
			}
		},
		change: function( event, ui ) {
			var nextElement = null;
			if(isEmpty(ui) || isEmpty(ui.item)){
				$(this)[0].value='';
				nextElement = $(this)[0].nextSibling.nextElementSibling.id;
				$("#"+nextElement).val('');
			}
		}
		});/* .data("autocomplete")._renderItem = function(ul, item) {
			var inner_html = '<a><ol class="t7-autocompleter"><ul>'
				+ item.value + '</ul></ol></a>';
			return $("<li></li>").data("item.autocomplete", item).append(inner_html).appendTo(ul);
		}; */
}

function setDirtyBit()
{
	document.getElementById( "dirtyBitSet" ).value = 'true';
    $(".submit_button").removeClass("disabled");
}

function populateStates(elmt, mState)
{
    var state = "";
    if(elmt && elmt.id == "country")
    {
        if(elmt.value == "")
        {
            $('#state').attr("disabled", "true");
            $('#state').val("");
        }
        else
        {
            $('#state').removeAttr("disabled");
            state = document.getElementById("state");
        }
    }		    
    if(elmt && elmt.value != "")
    {
        blockClientUI(true);
        $.post('cpon/clientServiceSetup/clientCountryStateList.json', { $countryCode: elmt.value}, 
        function(data){
            populateData(state, data);
            if(mState != "")
                state.value = mState;
            blockClientUI(false);
             
        })
        .fail(function() 
        {
            blockClientUI(false);		            
        });
    }
}

function blockClientUI(blnBlock) {
    if (blnBlock === true) {
        $("#pageContentDiv").addClass('ui-helper-hidden');
        $('#entryFormDiv').block({
            overlayCSS : {
                opacity : 0
            },
            baseZ : 2000,
            message : '<div style="z-index: 1"><h2><img src="static/images/backgrounds/busy.gif" class="middleAlign"/>&nbsp;Processing your request...</h2></div>',
            css : {
                height : '32px',
                padding : '8px 0 0 0'
            }
        });
    } else {
        $("#pageContentDiv").removeClass('ui-helper-hidden');
        $('#entryFormDiv').unblock();
    }
} 

function populateData(select, states)
{
    var x;
    select.length=1;
    
    for (x in states)
    {
        var option=document.createElement("option");
        option.text=getStateMstLabel(states[x].COUNTRY_CODE+"."+states[x].STATE_CODE,states[x].STATE_DESC);
        option.value=states[x].STATE_CODE;
        if(option.value!='undefined')
            select.add(option);
    }
}

function handlePrimaryLocFlag(element)
{	
	if(element.value == 'Y')
	{
		$('#primaryLocDesc').removeAttr('disabled');
		$("#primaryLocDesc").removeClass('disabled');
		$('#primaryLocDesc').val("");
		$('#primaryLoc').val("");		
	}
	else
	{		
		var description = $('#description').val();
		if(description)
		{
			$('#primaryLocDesc').val(description);
		}
		else
		{
			$('#primaryLocDesc').val("");
		}
		$('#primaryLocDesc').attr("disabled", "true");
		$("#primaryLocDesc").addClass('disabled');		
	}
}

function handlePrimaryLoc()
{
	var selected = $("input[type='radio'][name='primaryLocFlag']:checked");
	if(selected && selected.val() == 'N')
	{
		$('#primaryLocDesc').removeAttr('disabled');
		$("#primaryLocDesc").removeClass('disabled');
		var description = $('#description').val();
		if(description)
		{
			$('#primaryLocDesc').val(description);
		}
		else
		{
			$('#primaryLocDesc').val("");
		}
		$('#primaryLocDesc').attr("disabled", "true");
		$("#primaryLocDesc").addClass('disabled');		
	}
}