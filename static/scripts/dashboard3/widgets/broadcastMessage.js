const broadcastMsgPopupTemplate = '<div id="viewBroadcastMsgPopup" class="modal" tabindex="-1" role="dialog" data-backdrop="static">'+
									'<div class="modal-dialog" role="document">'+
									 '<div class="modal-content">'+
									  '<div class="modal-header">'+
                                        '<h5></h5>'+
									    '<button type="button" class="close" data-dismiss="modal" aria-label="Close">'+
									      '<span aria-hidden="true">&times;</span>'+
									    '</button>'+
									  '</div>'+
                                       '<div class="modal-body broadcastMsg-popup" id="broadcast_message_details_popup">'+
									  '<div class="row">'+
                                        '<div class="col-6"><div class="broadcast-message-field">'+	
									    '<label for="broadcastMsg_sendDate" class="label-messageForms font-weight-bold">'+getDashLabel('broadcastMsg.sendDate') +'</label>'+
								            '<div id="broadcastMsg_sendDate" style="font-weight: normal" class="text-break"></div>'+
                                            '</div></div>'+
                                            '<div class="col-6"><div class="broadcast-message-field d-none" id="broadcastMsg_messagetype_field">'+
										'<label for="broadcastMsg_messagetype" class="label-messageForms font-weight-bold">'+getDashLabel('broadcastMsg.messageType') +'</label>'+
										'<div id="broadcastMsg_messagetype" style="font-weight: normal" class="text-break"></div>'+
									    '</div></div>'+
                                      '</div>'+
                                      '<br/>'+
                                      '<div class="broadcast-message-field d-none" id="broadcastMsg_messageBody_div">'+
										'<label for="broadcastMsg_messageBody" class="label-messageForms font-weight-bold">'+ getDashLabel('broadcastMsg.messageBody')+'</label>'+
										'<div id="broadcastMsg_messageBody" style="font-weight: normal" class="text-break"></div>'+
									  '</div>'+
                                      '<br/>'+
                                      '<div class="broadcast-message-field d-none" id="broadcastMsg_attachment_div">'+
										'<label for="broadcastMsg_attachment" class="label-messageForms font-weight-bold">'+ getDashLabel('broadcastMsg.attachment')+'</label>'+
										'<div id="broadcastMsg_attachment" style="font-weight: normal" class="text-break">'+
                                     	'</div>' +     
									  '</div>'+
                                     '</div>'+
                                     '<div class="modal-footer">'+
                                        '<button type="button" class="btn btn-raised btn-primary" data-dismiss="modal">'+ getDashLabel('broadcastMsg.btn.close')+'</button>'+
                                      '</div>'+
									'</div>'+
									'</div>';

widgetMetaData.broadcastMessage= function(widgetId, widgetType)
{
	let metadata = {

			  'title': getDashLabel('broadcastMsg.title'),
			  'desc': getDashLabel('broadcastMsg.title'),
			  'type': 'card',
              'subType': '', 
		 	  'widgetType' : widgetType,
		      'cloneMaxCount': 1,
		      'seeMoreUrl': 'clientBroadcastMessageMstList.form',
		      'autoRefreshInterval': 60, // auto-refresh every 60 seconds
			  'fields': {
				'columns': [],
				'rows':{}	
			  },
              'actions' : {
				 'refresh' : {
						  'callbacks' : {
							  'init' : function(addData, metaData){
								  $('#widget-body-'+widgetId).empty().html('<div class="loading-indicator"></div>');				  
								  getBroadcastMessages(addData, metaData);
							  }
						  }
					  }
			  }		
			  }	
	return metadata;
}

function getBroadcastMessages(addData, metaData) {
  var strUrl = rootUrl+'/services/getBroadcastMessages.json';
  var strData = {$top: '3', $filter: "ClientId eq '" + window.strClient + "'"};
   $.ajax(
   {
		 type : 'POST',
		 data : strData,
		 url : strUrl,
		 dataType : 'json',
         async : false,
		 success : function( data )
		 {
			 paintBroadcastMsgPopup(data, addData, metaData);
             handleClickOnBroadcastMsg(data.broadcast,data.broadcastViewState);
             $('.page-body').append(broadcastMsgPopupTemplate);
		 }                       
   });
}

function paintBroadcastMsgPopup(data, addData, metaData) {
  let rowData = {};				   
  rowData.dataArray = [];
  $(data.broadcast).each(function(index, msg){
    if(index<3) {
	var length = (msg.details) ? msg.details.length : 0;
	var messageDetailTrucated = false;
	if (msg.details && msg.details.length >= 90) {
		length = msg.details.indexOf(' ', 89);
		messageDetailTrucated = true;
		if (length === -1) // this is the situation where there is only one word from position 89 
		{
			length = msg.details.length;
			messageDetailTrucated = false;
		}
	}
    let urgentMessage = (msg.urgent=== 'Urgent') ? 'urgent_message' : '';
    let msgOverflowInd = messageDetailTrucated === true ? '...' : '';
    let messageBody = (msg.details) ? msg.details.substring(0, length) + msgOverflowInd : '';
    let msgDate= (msg.artifactDate)? msg.artifactDate.split(' ')[0]:'';
     var broadcastMsg =  '<div msg_index="'+index + '" class = "broadcast_message" id="broadcast_msg_'+index + '">'+
                         '<div class="row">' + 
                         '<div class="col-9"><h6 class="'+ urgentMessage +' text-truncate">'+msg.title+'</h6></div>' +
                         '<div class="col-3"><span class="float-right text-truncate" style="color:#414141">'+ (msg.internalName ? '<i class="material-icons h6">attach_file</i>' : '') + '' + msgDate + '</span></div>' +
                         '</div>'+   
                         '<div class="broadcast_messageDetails">'+messageBody +'</div>' +
                         '<a id="readmore_link" class="read_more_link float-right">' + getDashLabel('broadcastMsg.readMore') +'</a>'+
                         '</div>';
                          
  rowData.dataArray.push(broadcastMsg);
  }
  });				   
  addData(rowData, metaData);
}

function handleClickOnBroadcastMsg(msgs,broadcastViewState) {  
   $('.read_more_link').click(function(){
       $('#broadcastMsg_messagetype_field').addClass('d-none');
       $('#broadcastMsg_messageBody_div').addClass('d-none');
       $('#broadcastMsg_messageBody_html_div').addClass('d-none');
       $('#viewBroadcastMsgPopup .modal-header h5').empty();
       $('#broadcastMsg_sendDate').empty();
       $('#broadcastMsg_attachedFile').empty();
       let msgIndex = $(this).parent().attr('msg_index');
       $(msgs).each(function(index, data){
		if(index==msgIndex)
		{
			$('#viewBroadcastMsgPopup .modal-dialog').css("max-width","");
			$('#viewBroadcastMsgPopup .modal-dialog').css("min-width","");
            if (data.docName !== undefined) 
            { 
                $('#broadcastMsg_messageBody').empty();
                $('#broadcastMsg_messageBody_div').removeClass('d-none');
                $('#broadcastMsg_messageBody_html_div').removeClass('d-none');
                $('#viewBroadcastMsgPopup .modal-dialog').css("max-width","80vw");
                $('#viewBroadcastMsgPopup .modal-dialog').css("min-width","960px");
                var artifactId = data.artifactId;
                downloadView('', artifactId , 'true');                
            }
            else  {
                $('#broadcastMsg_messageBody').empty();
                $('#broadcastMsg_messageBody_div').removeClass('d-none');
                $('#broadcastMsg_messageBody').text((data.details)?data.details:'');
            }
    		$('#viewBroadcastMsgPopup .modal-header h5').text(data.title);
    		$('#viewBroadcastMsgPopup .modal-header h5').addClass("text-truncate");
    		$('#broadcastMsg_sendDate').text((data.artifactDate)? data.artifactDate.split(' ')[0]:'');
             if((data.urgent) && data.urgent=== 'Urgent') {
                  $('#broadcastMsg_messagetype_field').removeClass('d-none');
    	          $('#broadcastMsg_messagetype').text((data.urgent)?data.urgent:'');
             }
             if (data.internalName !== undefined) 
             {
             	
             	$('#broadcastMsg_attachment').empty();
				$('#broadcastMsg_attachment_div').removeClass('d-none');
				$('#broadcastMsg_attachment').addClass("text-truncate");
				$('#broadcastMsg_attachment').html("<a title=" + data.internalName + " href=\"#\">" + data.internalName  + "</a>");
                 
				$('#broadcastMsg_attachment').click(function(){
                     downloadNewsAttachment('downloadNewsForm','downloadBroadcastpdf.form',''+msgIndex+'',''+broadcastViewState+'');
				});
             }
         }
         });
        $('#viewBroadcastMsgPopup').modal('show');
   })
}

function downloadView(htmlUrl, artifectId, bIsDynamicHtmlFlow) {
    var strUrl = rootUrl + '/downloadHtmlFile.srvc?'+csrfTokenName + '=' + csrfTokenValue + '&$brodcastId='+ artifectId;
    var strData = {};
    $.ajax(
    {
        type: 'POST',
        data: strData,
        url: strUrl,
        contentType: 'text/html',
        async: false,
        success: function (response)
        {
            showBroadcastMessageHtml(response);
        }
    });
}
function downloadNewsAttachment(frmId,strUrl,intIndex,viewState)
{
       var frm = document.getElementById(frmId);
       frm.target = "downloadWin";
       frm.action = strUrl;
       document.getElementById('newsIndexId').value = intIndex;
       document.getElementById('newsViewState').value = viewState;
       frm.submit();
}

function showBroadcastMessageHtml(strHtmlContents) {
 $('#broadcastMsg_messageBody').append(strHtmlContents);
}

