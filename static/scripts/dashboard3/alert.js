var _alerts = function(){
	return alerts();
};

function alerts(){
	var _this = {};
	_this.updateAlertsCount = function(){
	    let alertHeader = $('.alerts-dropdown .alerts-header h2');
	    let alertSubTitle = $('.alerts-dropdown .alerts-header #alert_subtitle');
		let alertBadge = $('#alerts .alerts-badge');
		let alertHeaderItem = getDashLabel('alerts.subTitle','You have {0} new Notifications');
		document.getElementById("alerts").title = getDashLabel('toolbar.tooltip.alerts');
		$(alertHeader).empty();		
		$(alertHeader).append(getDashLabel('alerts.title'));
		$.ajax({
		    type : "GET",
			url : rootUrl+'/services/unreadAlerts.srvc?'+csrfTokenName+'='+csrfTokenValue,
			data : {
				$top: '5',
				$skip: '1',
				$inlinecount: 'allpages',
				$filter: "(status eq 'N' or status eq 'U')"
			},
			accept   : "application/json;charset=UTF-8",
	        contentType: "application/x-www-form-urlencoded",
			success : function(res) {
				if(res && res.d && res.d.msgCenterAlert)
				{ 
			        $(alertBadge).empty();
		            $(alertSubTitle).empty();
				    let alertsCount = res.d.__count;
				    var unreadMsgList = res.d.msgCenterAlert;
	                $(alertBadge).append(alertsCount);
					$(alertSubTitle).append(alertHeaderItem.replace('{0}', alertsCount));
	                _this.updateAlertDropdownList(unreadMsgList);
					
					
				}
			}
		}); 
		
	};
	_this.updateAlertDropdownList = function(unreadMessages){
		let alertBodyDiv = $('.alerts-dropdown .alerts-body');
		$(alertBodyDiv).empty();
		$(unreadMessages).each(function(index, data){
			
			let alertItem='<div class="dropdown-divider"></div>';   			
			alertItem+=     '<div id="alert-items">'; 
			alertItem+=       '<div class="row alert-items">';
			alertItem+=       '<div class="alerts-item col-9 font-weight-bold"';
			alertItem+=         'data-viewunreadmsg="' + index + '"';
			alertItem+=         'id=alert_item_' + index + '>';
			alertItem+=      '<div class="row">'
			alertItem+=       '<div class="col-2 text-center">';
			alertItem+=         '<div class="' + _this.getClassName(data.category) +'"></div>';
			alertItem+=       '</div>';
            alertItem+=    	  '<div id="alert_content_' + index+' "class="col-10">';
            alertItem+=		     '<div class = "alert-subject">' + data.subject + '</div>';
            alertItem+=       '</div>';
			alertItem+=      '</div>';
			alertItem+=      '</div>';
			alertItem+=       '<div class="col-3 alerts-time">';
            alertItem+=          '<span class="color-grey">'+$.timeago(data.eventDt)+'</span>';
			alertItem+=          '<span class="alerts-delete"' + 'data-viewunreadmsg="' + index + '"' + '><i class="material-icons">delete</i></span>';
            alertItem+=   	  '</div>';
			alertItem+=      '</div>';
            alertItem+=      '</div>';           					
				
			$(alertBodyDiv).append(alertItem);
		});
		
		$('.alerts-dropdown').click(function(e) {
				e.stopPropagation();
		});
		_this.handleClick(unreadMessages);
		
	};
	_this.handleClick = function(unreadMessages){
		let alertClearAllBtn = $('.alerts-dropdown .alerts-footer #alerts_btn_clearAll');
		var msgId, msgSubject, msgDate, msgSenderMail, msgText, journalId;
		
		$('.alerts-delete i').click(function(){
			let identifier = new Array();
			let id = $(this).parent().attr('data-viewunreadmsg');
			let alertItem = 'alert_item_'+id;
			$('#'+alertItem).removeClass("font-weight-bold");
			$(unreadMessages).each(function(index, data){
				if(index==id)
					{
						identifier.push({
							identifier : data.identifier
							});
					}
					
				});
			
			_this.readAlerts(identifier);	
			;})
		$('.alerts-dropdown .alerts-body .alerts-item').click(function(){
			   $('#alerts').trigger('click');
			   let identifier = new Array();
			   let id = $(this).attr('id');
			   $('#'+id).removeClass("font-weight-bold");
			   
			   msgId = $(this).attr('data-viewunreadmsg');
			   $(unreadMessages).each(function(index, data){
					if(index==msgId)
						{
							msgSubject = data.subject;
			                msgDate = data.eventDt;
			                msgSenderMail = data.senderMail;                    
			                msgText = data.messageText;
			                journalId = data.jornalNmbr;
			                identifier.push({
								identifier : data.identifier
								});
						}
					
				});
				var sTitle = getDashLabel('alerts.viewAlerts'); 
		        $('#subject').text(msgSubject);
		        $('#sent').text(msgDate);
		        $('#from').text(msgSenderMail);
		        $('#messageText').addClass("ux_font-size14-normal");
		        if(null != msgText) {
		            var msgDisplay = msgText.replace(/__newlineflag__/g,"<br />");
		            msgDisplay = msgDisplay.replace(/\n/g, "<br />");
		            $('#messageText').html(msgDisplay);
		        }
				$('#viewAlertsPopup').modal('show'); 
		});
		$(alertClearAllBtn).click(function(){
			var arrayJson = new Array();
			$(unreadMessages).each(function(index, data){
				{
					arrayJson.push({
                        identifier : data.identifier
						});
				}
			
			});
			_this.readAlerts(arrayJson);
		 });		
	};
	_this.readAlerts = function(identifier){
		$.ajax({
			url : rootUrl+'/services/markAlertAsRead?'+csrfTokenName+'=' + csrfTokenValue ,
			type : 'POST',
			data : JSON.stringify(identifier),
			accept   : "application/json;charset=UTF-8",
	        contentType: "application/json",
			dataType : "json",
			success : function(res) {
			  _this.updateAlertsCount();
			}
		});
    		
	};
	_this.getClassName = function(category) {
	  let className;
	  switch(category) {
		  case 'NTFCTN' : className = 'alerts-notification';
		                  break;
		  case 'SCRTY' : className = 'alerts-security';
		                 break;
		  case 'ACCNT' : className = 'alerts-account';
		                 break;	
		  case 'BRDCST' : className = 'alerts-broadcast';
		                  break;
		  default:  className = 'alerts-broadcast';	
	   }
	   return className;

	};  
 return _this;	
		
}  