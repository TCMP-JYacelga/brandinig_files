var userProfile = {};
 
userProfile.saveChangesOnViewProfile = function() {
  if(usrDashboardPref){
	usrDashboardPref.horizontal_menu = {
		"enabled" : $('#profile_menu_select').is(':checked')
	};
	userProfile.updateDashboardPref();
  }
  $.cookie('is-enabled-horizontal-menu', $('#profile_menu_select').is(':checked'));
  languageChange.changeUsrLang($('#profile_language').val());	
};

userProfile.updateDashboardPref = function(){
	$.ajax({
		url : rootUrl+'/services/updateWidgetPreferences',
		dataType : 'JSON',
		method : 'POST',
		async : false,
		data : {
			"$dashboardWidgets" : JSON.stringify(usrDashboardPref)
		},
		success : function(data){
		}
	});	
};
