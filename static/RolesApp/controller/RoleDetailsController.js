/*global jQuery, RoleDetails Controller */
var TT_RoleAppItem;
var existingRoleData =[];
(function ($) {
	'use strict';

	TT_RoleAppItem = {
		descChange: function () {			
			console.log("desc Change");
			//$('input[id^="roleId"]').val($('#roleId').val().toUpperCase());
			$('input[id^="roleId"]').val($('#roleId').val().replace(/ /g, '').toUpperCase());
			$('input[id^="roleDesc"]').val($('#roleDesc').val().toUpperCase());
			if(mode == "new" && (null == workingData.recordKeyNo)){
				var cmdVersion = commandVersion + 1 ;
    			commandVersion += 1 ;
    			
    			if(workingData.copyFromFlag){
        			RolesApp.trigger('CopyRoleDetail', {
    					commandName: "CopyRoleDetail",
    					path: '/rolesApi/roleDetails/CopyRole',
    					kv: {
    						roleId: $('#roleId').val(),
    						roleDesc: $('#roleDesc').val(),
    						company : workingData.corporationId,
    						srcRoleId : workingData.srcRoleId,
    						srcRoleDesc : workingData.srcRoleDesc, 
    						srcComapany : workingData.srcComapany,
    						commandVersion : cmdVersion
    					}
    				});

    			}else{
        			RolesApp.trigger('CreateRoleDetail', {
    					commandName: "CreateRoleDetail",
    					path: '/rolesApi/roleDetails/CreateRole',
    					kv: {
    						roleId: $('#roleId').val(),
    						roleDesc: $('#roleDesc').val(),
    						company : workingData.corporationId,
    						commandVersion : cmdVersion
    					}
    				});    				
    			}
			}
			else{
				var cmdVersion = commandVersion + 1 ;
    			commandVersion += 1 ;
    			RolesApp.trigger('UpdateRoleDetail', {
					commandName: "UpdateRoleDetail",
					path: '/rolesApi/roleDetails/UpdateRole',
					kv: {
						roleId: $('#roleId').val(),
						roleDesc: $('#roleDesc').val(),
						corpId : workingData.corporationId,
						commandVersion : cmdVersion
					}
				});
			}
		},
		
		next : function(event){
			var validate = false, srvcValid=false;
			$('#errorPara').text("");
			$.blockUI();
			$.blockUI({overlayCSS: {opacity: 0.5 }, baseZ: 2000,  message: '<div style="z-index: 1, position: absolute"><h2><img src="static/styles/Themes/t7-main/resources/images/T7/loading1.gif" class="middleAlign"/>&nbsp;'+getLabel("loading", "Loading")+'...</h2></div>',
				css:{ width:'400px',height:'64px',padding:'20px 0 0 0'}});
			if($('#roleId').val()==''){	
				$('#errorDiv').removeClass('hidden');
	        	$('#errorPara').append("Name is required. </br> ");
	        	if(event)
	            	event.preventDefault();
	        	validate =true;
	        	$.unblockUI();
			}	
			if($('#roleDesc').val()==''){	
				$('#errorDiv').removeClass('hidden');
				$('#errorPara').append("Role Description is required.</br>")
	        	if(event)
		            event.preventDefault();
				validate =true;
	        	$.unblockUI();
			}	
			if($('#subsidiaries').val()== null){	
				$('#errorDiv').removeClass('hidden');
				$('#errorPara').append("At least one subsidiary should be select.</br>")
				if(event)
		            event.preventDefault();
				validate =true;
	        	$.unblockUI();
			}
			
			if(workingData.admin && $('#corporation').val()== null){	
				$('#errorDiv').removeClass('hidden');
				$('#errorPara').append("Corporation is required.</br>")
				if(event)
		            event.preventDefault();
				validate =true;
	        	$.unblockUI();
			}
			
			if(workingData.copyFromFlag && existingRoleData.length == 0){
				$('#errorDiv').removeClass('hidden');
				$('#errorPara').append("Role is not valid.</br>")
				if(event)
		            event.preventDefault();
				validate =true;
	        	$.unblockUI();
			}

			$.each($('img[id^="chkImgSrvc_"]'), function(index, service){
				if($(this).attr('src').search("unchecked") != -1){
					srvcValid = false;
				}else{
					srvcValid = true;
					return false;
				}
			});
			if(!srvcValid){
				$('#errorDiv').removeClass('hidden');
				$('#errorPara').append("At least one service should be select.")
				if(event)
		            event.preventDefault();
	        	$.unblockUI();
			}
			
			if(!validate && srvcValid){
	        //	$.unblockUI();
				$('#errorDiv').addClass('hidden');
				
				workingData.services.sort(function(a, b) {
        		  var nameA = a.serviceName.toUpperCase(); // ignore upper and lowercase
        		  var nameB = b.serviceName.toUpperCase(); // ignore upper and lowercase
        		  if (nameA < nameB) {
        		    return -1;
        		  }
        		  if (nameA > nameB) {
        		    return 1;
        		  }

        		  // names must be equal
        		  return 0;
        		});
				
				if(CommonRole.getAssetStore().length > 0){
					RolesApp.trigger('SaveRole');
					if($('#errorPara').length && $('#errorPara').text().length != 0 ) {
						return false;
					}
				}else{
		        	$.unblockUI();
				}
			}
		},
		roleIdDetail : function(){
			$('#roleId').ForceNoSpecialSymbolWithSpace();
		},
		roleDescDetail : function(){
			$('#roleDesc').ForceNoSpecialSymbolWithSpace();
		},
		
		subsidiaryChange: function () {
			$.blockUI();
			$.blockUI({overlayCSS: {opacity: 0.5 }, baseZ: 2000,  message: '<div style="z-index: 1, position: absolute"><h2><img src="static/styles/Themes/t7-main/resources/images/T7/loading1.gif" class="middleAlign"/>&nbsp;'+getLabel("loading", "Loading")+'...</h2></div>',
			css:{ width:'400px',height:'64px',padding:'20px 0 0 0'}});
			var opt = $('#chkSub_'+ $(this).attr('value') );
			if(null == $(this).attr('aria-selected') || $(this).attr('aria-selected') == "false"){
				//Subsidiary selected/added
				var cmdVersion = commandVersion + 1 ;
    			commandVersion += 1 ;
    			RolesApp.trigger('AddSubsidiary', {
					commandName: "AddSubsidiary",
					path: '/rolesApi/roleDetails/Subsidiary',
					kv: {						
						subsidiaryId : $(this).val(),
						subsidiaryName : $(this).next().text(),
						assignedFlag : true,
						digest :  $(this).data('digest'),
						commandVersion : cmdVersion
					}
				});
				
			}else{
				//Subsidiary unselected/removed
				var cmdVersion = commandVersion + 1 ;
    			commandVersion += 1 ;
    			RolesApp.trigger('RemoveSubsidiary', {
					commandName: "RemoveSubsidiary",
					path: '/rolesApi/roleDetails/Subsidiary',
					kv: {						
						subsidiaryId : $(this).val(),
						subsidiaryName : $(this).next().text(),
						assignedFlag : false,
						digest :  $(this).data('digest'),
						commandVersion : cmdVersion
					}
				});
			}
		  $.unblockUI();
		},

		toggleCheckUncheck: function () {
			if ($(this).length == 1) {
				if ($(this).attr('src').search("unchecked") != -1) {
					$(this).attr('src','static/images/icons/icon_checked.gif');
					if ($(this).attr('id').split("_")[0] == "chkImgGran") {
						var grPrivId = $(this).attr('id').split("_")
						var cmdVersion = commandVersion + 1 ;
		    			commandVersion += 1 ;
						RolesApp.trigger('AddGR', {
							commandName: "AddGR",
							path: '/rolesApi/roleDetails/Granular',
							kv: {						
								granularPrivilegeId : grPrivId[1],
								assignedFlag : true,
								commandVersion : cmdVersion,
								digest :  $(this).data('digest'),
								granularPrivilegeName : $('#lblImgGran_' + grPrivId[1]).text().trim()
							}
						});
						
						if(grPrivId[1] == "01"){
							var cmdVer = commandVersion + 1 ;
			    			commandVersion += 1 ;
							RolesApp.trigger('RemoveAllAccounts', {
								commandName: "RemoveAllAccounts", 
								path: '/rolesApi/BalanceReporting/Accounts', 
								kv: {	
									assetId : "01",
									assignAllAccounts : false,
									commandVersion : cmdVer	
								}
							});
						}else if(grPrivId[1] == "02"){
							var cmdVer = commandVersion + 1 ;
			    			commandVersion += 1 ;
							RolesApp.trigger('RemoveAllAccounts', {
								commandName: "RemoveAllAccounts", 
								path: '/rolesApi/Payments/Accounts', 
								kv: {	
									assetId : "02",
									assignAllAccounts : false,
									commandVersion : cmdVer
								}
							});
							
							cmdVer = commandVersion + 1 ;
			    			commandVersion += 1 ;
							RolesApp.trigger('RemoveAllPackages', {
								commandName: "RemoveAllPackages", 
								path: '/rolesApi/Payments/Packages', 
								kv: {	
									assetId : "02",
									assignAllPackages : false,
									commandVersion : cmdVer
								}
							});
							commandVersion += 1 ;
						}
					} else {
						var srvcId = $(this).attr('id').split("_")
						
						if(srvcId[1] == "01" || srvcId[1] == "02" || srvcId[1] == "07" || srvcId[1] == "13" || srvcId[1] == "14")
							$('#divGranular_'+srvcId[1]).removeClass('hidden');
						
						var serviceName = $('#lblImgSrvc_' + srvcId[1]);
						var cmdVersion = commandVersion + 1 ;
		    			commandVersion += 1 ;
		    			RolesApp.trigger('AddServices', {
							commandName: "AddServices",
							path: '/rolesApi/roleDetails/Services',
							kv: {						
								serviceId : srvcId[1],
								assignedFlag : true,
								//serviceName : $('#lblImgSrvc_' + srvcId[1]).text().trim(),
								serviceName : $('#lblImgSrvc_' + srvcId[1]).val().trim(),
								digest :  $(this).data('digest'),								
								commandVersion : cmdVersion
							}
						});
						
					}

				} else {
					$(this).attr('src','static/images/icons/icon_unchecked.gif');

					if ($(this).attr('id').split("_")[0] == "chkImgGran") {

						var grPrivId = $(this).attr('id').split("_")
						var cmdVersion = commandVersion + 1 ;
		    			commandVersion += 1 ;
						RolesApp.trigger('RemoveGR', {
							commandName: "RemoveGR",
							path: '/rolesApi/roleDetails/Granular',
							kv: {						
								granularPrivilegeId : grPrivId[1],
								assignedFlag : false,
								commandVersion : cmdVersion,
								digest :  $(this).data('digest'),
								granularPrivilegeName : $('#lblImgGran_' + grPrivId[1]).text().trim()
									
							}
						});
						
						if(grPrivId[1] == "01"){
							accountStore = [];							
						}else if(grPrivId[1] == "02"){
							accountStore = [];
							packageStore = [];
						}
						
					} else {
						var srvcId = $(this).attr('id').split("_");
						//TODO - Remove comments 
						if(srvcId[1] == "01" || srvcId[1] == "02" || srvcId[1] == "07" || srvcId[1] == "13" || srvcId[1] == "14"){
							$('#divGranular_'+srvcId[1]).addClass('hidden');
							if($('#chkImgGran_'+srvcId[1]).attr('src') != undefined){
								if($('#chkImgGran_'+srvcId[1]).attr('src').search("unchecked") == -1){
									var cmdVersion = commandVersion + 1 ;
					    			commandVersion += 1 ;
									RolesApp.trigger('RemoveGR', {
										commandName: "RemoveGR",
										path: '/rolesApi/roleDetails/Granular',
										kv: {						
											granularPrivilegeId : srvcId[1],
											assignedFlag : false,
											commandVersion : cmdVersion,
											digest :  $(this).data('digest'),
											granularPrivilegeName : $('#lblImgGran_' + srvcId[1]).text().trim()
										}
									});								
								}
								$('#chkImgGran_'+srvcId[1]).attr('src','static/images/icons/icon_unchecked.gif');
							}
						}
							
						var cmdVersion = commandVersion + 1 ;
		    			commandVersion += 1 ;
		    			RolesApp.trigger('RemoveServices', {
							commandName: "RemoveServices",
							path: '/rolesApi/roleDetails/Services',
							kv: {						
								serviceId : srvcId[1],
								assignedFlag : false,
								serviceName : $('#lblImgSrvc_' + srvcId[1]).val().trim(),
								digest :  $(this).data('digest'),
								commandVersion : cmdVersion
							}
						});
					}
				}
				RolesApp.trigger('footerLinkRef');
			}
		},

		toggleLabelCheckUncheck: function () {
			if ($(this).length == 1) {
				var chkBoxId = '#' + $(this).attr('for');
				$(chkBoxId).click();
			}
		},
		
		toggleServicesCaret: function () {
			$('#servicesInfoCaret').toggleClass("fa-caret-up fa-caret-down");
			$('#servicesInfoDiv').toggle();
			return false;

		},
		
		toggleGranularPrivilegsCaret: function () {
			$('#granularPrivilegsInfoCaret').toggleClass("fa-caret-up fa-caret-down");
			$('#allowedGranularPrivilegesInfoDiv').toggle();
			return false;

		},
		
		toggleCopyFrom : function(){
			if($(this).attr('src').search("unchecked") != -1){
				$(this).attr('src',"static/images/icons/icon_checked.gif");
				$('#copyFromRole').removeAttr('disabled');
				workingData.copyFromFlag = true; 
				TT_RoleAppItem.descChange();
			}else{
				$(this).attr('src',"static/images/icons/icon_unchecked.gif");
				$('#copyFromRole').val("");
				$('#copyFromRole').attr('disabled','disabled');
				workingData.copyFromFlag = false; 
				TT_RoleAppItem.descChange();
			}
		},
		
		init: function () {
			console.log("RoleDetailsController recieved");
			$("#roleDesc").on('keydown', TT_RoleAppItem.roleDescDetail); 
			$('#roleDesc').on('change', TT_RoleAppItem.descChange);
			$("#roleId").on('keydown', TT_RoleAppItem.roleIdDetail); 
			$('#roleId').on('change', TT_RoleAppItem.descChange);

			$('img[id^="chkImgSrvc_"]').on('click', TT_RoleAppItem.toggleCheckUncheck);
			$('label[id^="lblImgSrvc_"]').on('click', TT_RoleAppItem.toggleLabelCheckUncheck);
			$('label[id^="chkCopyFrom"]').on('click', TT_RoleAppItem.toggleLabelCheckUncheck);
			$('img[id^="chkImgGran_"]').on('click', TT_RoleAppItem.toggleCheckUncheck);
			$('label[id^="lblImgGran_"]').on('click', TT_RoleAppItem.toggleLabelCheckUncheck);
			$('#saveUpdate').on('click', TT_RoleAppItem.next);
			
			$('input[id^="ui-multiselect-chkSub"]').on('click',TT_RoleAppItem.subsidiaryChange);
			$('#Next').on('click', TT_RoleAppItem.next);
			$('#btnCancel').on('click', CommonRole.cancel);
						
			$('#servicesInfoCaret').on('click',TT_RoleAppItem.toggleServicesCaret);
			$('#granularPrivilegsInfoCaret').on('click',TT_RoleAppItem.toggleGranularPrivilegsCaret);
			
			$('img[id="chkCopyFrom"]').on('click', TT_RoleAppItem.toggleCopyFrom);
			
		}
	};

	RolesApp.bind('roleDetailInit', TT_RoleAppItem.init);

})(jQuery);
