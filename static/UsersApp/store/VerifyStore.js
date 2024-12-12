/*global jQuery, RoleDetails */

var authMatrixStore = [], subsidiaryStore = [];

(function ($) {
	'use strict';

	var UserVerifyDetails = {
	
		//On Click of Submit
		submitUser : function(){

				var url;
				$.ajax({
			        url: "services/userCommandApi/submit?" + csrfTokenName + "=" + csrfTokenValue,
			        type: "POST",
			        data: JSON.stringify(userCommand),
			        async : false,
			        contentType: "application/json; charset=utf-8",
			        success: function (data) {
			        	if(data !=null && data[0] != undefined  && data[0].success === 'Y')
			        	window.location = 'userAdminList.form';
			        	//$.unblockUI();
						else if(data !=null && data[0] != undefined  && data[0].success === 'N'){
							$('#errorDiv').removeClass('hidden');
							$('#errorPara').text(data[0].errors[0].errorMessage);
							window.scrollTo(0,0);
						}
			        },
			        error: function () {
			            $('#errorDiv').removeClass('hidden');
			        	$('#errorPara').text("An error has occured!!!");
			        	if(event)
				            event.preventDefault();
			        	$.unblockUI();
			        }
			    });
			    
		}
	};
	
	
	UsersApp.bind('SubmitUser', UserVerifyDetails.submitUser);
	
	
})(jQuery);
