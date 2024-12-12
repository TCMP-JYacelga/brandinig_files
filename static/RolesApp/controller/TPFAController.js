/*global jQuery, RoleDetails */

(function ($) {
	'use strict';

	var TPFAItem = {
		
		togglePrivi : function(){
			if($(this).length == 1){
				var prevId = $(this).attr('id').split("_"),view,edit,auth;

				if($(this).attr('src').search("unchecked") != -1){
					if(prevId[0] == "chkPrevEdit" || prevId[0] == "chkPrevAuth"){
						$('#chkPrevView_'+prevId[1]+'_'+prevId[2]).attr('src','static/images/icons/icon_checked.gif');
					}
					$(this).attr('src',"static/images/icons/icon_checked.gif");
				}else{
					if(prevId[0] == "chkPrevView"){
						$('#chkPrevEdit_'+prevId[1]+'_'+prevId[2]).attr('src','static/images/icons/icon_unchecked.gif');
						$('#chkPrevAuth_'+prevId[1]+'_'+prevId[2]).attr('src','static/images/icons/icon_unchecked.gif');
					}
					$(this).attr('src',"static/images/icons/icon_unchecked.gif")
				}
				
				if(null != prevId){
					if($('#chkPrevView_'+prevId[1]+'_'+prevId[2]).attr('src') != undefined)
						view = TPFAItem.isChecked($('#chkPrevView_'+prevId[1]+'_'+prevId[2]).attr('src'));
					else
						view = false;
					
					if($('#chkPrevEdit_'+prevId[1]+'_'+prevId[2]).attr('src') != undefined)
						edit = TPFAItem.isChecked($('#chkPrevEdit_'+prevId[1]+'_'+prevId[2]).attr('src'));
					else
						edit = false;
					
					if($('#chkPrevAuth_'+prevId[1]+'_'+prevId[2]).attr('src') != undefined)
						auth = TPFAItem.isChecked($('#chkPrevAuth_'+prevId[1]+'_'+prevId[2]).attr('src'));
					else
						auth = false;
				}
				
				var cmdVersion = commandVersion + 1 ;
    			commandVersion += 1 ;
				RolesApp.trigger('UpdatePermission', {
					commandName: "UpdatePermission",
					path: '/rolesApi/TPFA/Permissions',
					kv: {		
						   screenId: $(this).data('screenid'),
				           screenName: $(this).data('screenname'),
				           screenWeight:$(this).data('screenweight'),
				           module:$(this).data('module'),
			               subModule:$(this).data('submodule'),
			               tciRmParent: $(this).data('tcirmparent'),
			               assetId: $(this).attr('data-assetid'),
			               digest :  $(this).data('digest'),
			               view:view,
			               edit:edit,
			               auth:auth,
			               commandVersion : cmdVersion
					}
				});
				CommonRole.checkSelectAll('chkPrev','prevAll');	
			}
		},
		
	/*	toggleInterface : function(){
			if($(this).length == 1){
				var interfaceId = $(this).attr('id').split("_"),execute,edit;

				if($(this).attr('src').search("unchecked") != -1){
					$(this).attr('src',"static/images/icons/icon_checked.gif");
				}else{
					$(this).attr('src',"static/images/icons/icon_unchecked.gif")
				}
				
				if(null != interfaceId){
					var id = $(this).data('interfaceid');
					edit = TPFAItem.isChecked($('#chkInterfaceEdit_'+interfaceId[1]+'_'+id).attr('src'));
					execute = TPFAItem.isChecked($('#chkInterfaceExecute_'+interfaceId[1]+'_'+id).attr('src'));
				}
				var cmdVersion = commandVersion + 1 ;
    			commandVersion += 1 ;
				RolesApp.trigger('UpdateInterfaces', {
					commandName: "UpdateInterfaces",
					path: '/rolesApi/Admin/Interfaces',
					kv: {						
						interfaceType: $(this).data('interfacetype'),
						interfaceId: $(this).data('interfaceid'),
						subModule:$(this).data('submodule'),
 		                assetId: $(this).attr('data-assetid'),
 		                digest :  $(this).data('digest'),
						edit : edit,
						execute : execute,
						model : $(this).data('model'),
			            commandVersion : cmdVersion
					}
				});
			}
		},	*/
		
		
		toggleFeature : function(){
			if($(this).length == 1){
				var featureId = $(this).attr('id').split("_");

				if($(this).attr('src').search("unchecked") != -1){
					$(this).attr('src',"static/images/icons/icon_checked.gif");
					var cmdVersion = commandVersion + 1 ;
	    			commandVersion += 1 ;
					RolesApp.trigger('AddFeatures', {
						commandName: "AddFeatures",
						path: '/rolesApi/TPFA/Features',
						kv: {						
							featureId : $(this).data('featureid'),
							featureName : $(this).data('featurename'), 
							assetId : $(this).attr('data-assetid'),
							digest :  $(this).data('digest'),
							assignedFlag : true,
				            commandVersion : cmdVersion
						}
					});
				}else{
					$(this).attr('src',"static/images/icons/icon_unchecked.gif")
					var cmdVersion = commandVersion + 1 ;
					commandVersion += 1 ;
					RolesApp.trigger('RemoveFeatures', {
						commandName: "RemoveFeatures",
						path: '/rolesApi/TPFA/Features',
						kv: {						
							featureId : $(this).data('featureid'),
							featureName : $(this).data('featurename'), 
							assetId : $(this).attr('data-assetid'),
							digest :  $(this).data('digest'),
							assignedFlag : false,
				            commandVersion : cmdVersion
						}
					});
				}
			}
		
		},
		
	/*	toggleMsg : function(){
			if($(this).length == 1){
				var msgId = $(this).attr('id').split("_");

				if($(this).attr('src').search("unchecked") != -1){
					$(this).attr('src',"static/images/icons/icon_checked.gif");
					var cmdVersion = commandVersion + 1 ;
	    			commandVersion += 1 ;
					RolesApp.trigger('AddMessages', {
						commandName: "AddMessages",
						path: '/rolesApi/Admin/Messages',
						kv: {
							messageId :  $(this).data('messageid'),
							messageType : $(this).data('messagetype'), 
							assetId : $(this).attr('data-assetid'),
							digest :  $(this).data('digest'),
							assignedFlag : true,
				            commandVersion : cmdVersion
						}
					});
				}else{
					$(this).attr('src',"static/images/icons/icon_unchecked.gif")
					var cmdVersion = commandVersion + 1 ;
					commandVersion += 1 ;
					RolesApp.trigger('RemoveMessages', {
						commandName: "RemoveMessages",
						path: '/rolesApi/Admin/Messages',
						kv: {						
							messageId :  $(this).data('messageid'),
							messageType : $(this).data('messagetype'), 
							assetId : $(this).attr('data-assetid'),
							digest :  $(this).data('digest'),
							assignedFlag : false,
				            commandVersion : cmdVersion
						}
					});
				}
			}
		
		},		*/
		
		
		toggleRep : function(){
			if($(this).length == 1){
				var repId = $(this).attr('id').split("_");
                CommonRole.updateStore(this, 'Reports', 'chkRep_','TPFA');
				if($(this).attr('src').search("unchecked") != -1){
					$(this).attr('src',"static/images/icons/icon_checked.gif");
					var cmdVersion = commandVersion + 1 ;
	    			commandVersion += 1 ;
					RolesApp.trigger('AddReports', {
						commandName: "AddReports",
						path: '/rolesApi/TPFA/Reports',
						kv: {
							reportId :  $(this).data('reportid'),
							reportType : $(this).data('reporttype'), 
							assetId : $(this).attr('data-assetid'),
							digest :  $(this).data('digest'),
							assignedFlag : true,
				            commandVersion : cmdVersion
						}
					});
				}else{
					$(this).attr('src',"static/images/icons/icon_unchecked.gif")
					var cmdVersion = commandVersion + 1 ;
					commandVersion += 1 ;
					RolesApp.trigger('RemoveReports', {
						commandName: "RemoveReports",
						path: '/rolesApi/TPFA/Reports',
						kv: {						
							reportId :  $(this).data('reportid'),
							reportType : $(this).data('reporttype'), 
							assetId : $(this).attr('data-assetid'),
							digest :  $(this).data('digest'),
							assignedFlag : false,
				            commandVersion : cmdVersion
						}
					});
				}
				CommonRole.checkSelectAll('chkRep_','reportsAll');		
			}
		
		},
		
		
	/*	toggleWidget : function(){
			if($(this).length == 1){
				var widgetId = $(this).attr('id').split("_");

				if($(this).attr('src').search("unchecked") != -1){
					$(this).attr('src',"static/images/icons/icon_checked.gif");
					var cmdVersion = commandVersion + 1 ;
	    			commandVersion += 1 ;
					RolesApp.trigger('AddWidgets', {
						commandName: "AddWidgets",
						path: '/rolesApi/Admin/Widgets',
						kv: {	
							widgetId :  $(this).data('widgetid'),
							widgetType : $(this).data('widgettype'), 
							assetId : $(this).attr('data-assetid'),
							digest :  $(this).data('digest'),
							assignedFlag : true,
				            commandVersion : cmdVersion
						}
					});
				}else{
					$(this).attr('src',"static/images/icons/icon_unchecked.gif")
					var cmdVersion = commandVersion + 1 ;
					commandVersion += 1 ;
					RolesApp.trigger('RemoveWidgets', {
						commandName: "RemoveWidgets",
						path: '/rolesApi/Admin/Widgets',
						kv: {						
							widgetId :  $(this).data('widgetid'),
							widgetType : $(this).data('widgettype'), 
							assetId : $(this).attr('data-assetid'),
							digest :  $(this).data('digest'),
							assignedFlag : false,
				            commandVersion : cmdVersion
						}
					});
				}
			}
		
		},		*/
		
		toggleAlert : function(){
			if($(this).length == 1){
				var alertId = $(this).attr('id').split("_"),view,edit,auth;
  				CommonRole.updateStore(this, 'Alerts', 'chkAlert_','TPFA');
				if($(this).attr('src').search("unchecked") != -1){
					$(this).attr('src',"static/images/icons/icon_checked.gif");
					var cmdVersion = commandVersion + 1 ;
	    			commandVersion += 1 ;
					RolesApp.trigger('AddAlerts', {
						commandName: "AddAlerts",
						path: '/rolesApi/TPFA/Alerts',
						kv: {				
							alertId :  $(this).data('alertid'),
							alertType : $(this).data('alerttype'), 
							assetId : $(this).attr('data-assetid'),
							digest :  $(this).data('digest'),
							assignedFlag : true,
				            commandVersion : cmdVersion
						}
					});
				}else{
					$(this).attr('src',"static/images/icons/icon_unchecked.gif")
					var cmdVersion = commandVersion + 1 ;
					commandVersion += 1 ;
					RolesApp.trigger('RemoveAlerts', {
						commandName: "RemoveAlerts",
						path: '/rolesApi/TPFA/Alerts',
						kv: {						
							alertId :  $(this).data('alertid'),
							alertType : $(this).data('alerttype'), 
							assetId : $(this).attr('data-assetid'),
							digest :  $(this).data('digest'),
							assignedFlag : false,
				            commandVersion : cmdVersion
						}
					});
				}
				CommonRole.checkSelectAll('chkAlert_','alertsAll');
			}
		
		},		
		
		isChecked : function(src){
			if(src.search("unchecked") != -1){
				return false;
			}else{
				return true;
			}
		},
		
		
		toggleFeatureCaret: function () {
			$('#featureCaret').toggleClass("fa-caret-up fa-caret-down");
			$('#featureDiv').slideToggle(200);
			return false;

		},
		
	/*	toggleMessageCaret: function () {
			$('#messageInfoCaret').toggleClass("fa-caret-up fa-caret-down");
			$('#messageInfoDiv').slideToggle(200);
			return false;

		},	*/
		
		togglePrivilegesCaret: function () {
			$('#privilegesInfoCaret').toggleClass("fa-caret-up fa-caret-down");
			$('#privilegesInfoDiv').slideToggle(200);
			return false;

		},
		
		toggleAlertsCaret: function () {
			$('#alertsInfoCaret').toggleClass("fa-caret-up fa-caret-down");
			$('#alertsInfoDiv').slideToggle(200);
			return false;

		},	
		
		toggleReportsCaret: function () {
			$('#reportsInfoCaret').toggleClass("fa-caret-up fa-caret-down");
			$('#reportsInfoDiv').slideToggle(200);
			return false;

		},
		
	/*	toggleWidgetsCaret: function () {
			$('#widgetsInfoCaret').toggleClass("fa-caret-up fa-caret-down");
			$('#widgetsInfoDiv').slideToggle(200);
			return false;

		},	*/
		
	/*	toggleIntrefacePrevCaret: function () {
			$('#intrefacePrevInfoCaret').toggleClass("fa-caret-up fa-caret-down");
			$('#intrefacePrevInfoDiv').slideToggle(200);
			return false;

		},	*/
		
		toggleExpandAll: function () {
			$("[id$='Caret']").addClass("fa-caret-up");
			$("[id$='Caret']").removeClass("fa-caret-down");
			$("[id$='InfoDiv']").slideDown(200);
			return false;
		},
		
		toggleCollapseAll: function () {
			$("[id$='Caret']").addClass("fa-caret-down");
			$("[id$='Caret']").removeClass("fa-caret-up");
			$("[id$='InfoDiv']").slideUp(200);
			return false;
		},
		
		back: function () {
        	//RolesApp.trigger('renderRoleDetails', workingData );
			if(CommonRole.getAssetStore().length > 0){
				CommonRole.next();
			}
		},
		
	/*	toggleMsgAll : function(){
			if($(this).length == 1){
				
				if($(this).attr('src').search("unchecked") != -1){
					//$("#messageInfoDiv").addClass("disable");
					$(this).attr('src',"static/images/icons/icon_checked.gif");
					$('img[id^="chkMsg_"]').attr('src',"static/images/icons/icon_checked_grey.gif");
					$('img[id^="chkMsg_"]').off('click');
					
					var cmdVersion = commandVersion + 1 ;
					commandVersion += 1 ;
					
					RolesApp.trigger('ApplyAllMessages', {
						commandName: "ApplyAllMessages", 
						path: '/rolesApi/Admin/Messages', 
						kv: {	
							assetId : "22",
							assignAllMessages : true,
				            commandVersion : cmdVersion
						}
					});
			
				}else{
					$(this).attr('src',"static/images/icons/icon_unchecked.gif");
					//$("#messageInfoDiv").removeClass("disable");
					$('img[id^="chkMsg_"]').attr('src',"static/images/icons/icon_unchecked.gif");
					$('img[id^="chkMsg_"]').on('click',TPFAItem.toggleMsg);
					
					var cmdVersion = commandVersion + 1 ;
					commandVersion += 1 ;
					
					RolesApp.trigger('RemoveAllMessages', {
						commandName: "RemoveAllMessages", 
						path: '/rolesApi/Admin/Messages', 
						kv: {	
							assetId : "22",
							assignAllMessages : false,
				            commandVersion : cmdVersion
						}
					});
				}
			}
		
		},		*/
		
		toggleReportAll : function(){
			if($(this).length == 1){
				if($(this).attr('src').search("unchecked") != -1){
				//	$("#reportsInfoDiv").addClass("disable");
					$(this).attr('src',"static/images/icons/icon_checked.gif");
					$('img[id^="chkRep_"]').attr('src',"static/images/icons/icon_checked.gif");
					//$('img[id^="chkRep_"]').off('click');
					
					var cmdVersion = commandVersion + 1 ;
					commandVersion += 1 ;
					
					RolesApp.trigger('ApplyAllReports', {
						commandName: "ApplyAllReports", 
						path: '/rolesApi/TPFA/Reports', 
						kv: {	
							assetId : "22",
							assignAllReports : true,
				            commandVersion : cmdVersion
						}
					});
					
				}else{
					$(this).attr('src',"static/images/icons/icon_unchecked.gif");
				//	$("#reportsInfoDiv").removeClass("disable");
					$('img[id^="chkRep_"]').attr('src',"static/images/icons/icon_unchecked.gif");
					//$('img[id^="chkRep_"]').on('click',TPFAItem.toggleRep);
					
					var cmdVersion = commandVersion + 1 ;
					commandVersion += 1 ;
					
					RolesApp.trigger('RemoveAllReports', {
						commandName: "RemoveAllReports", 
						path: '/rolesApi/TPFA/Reports', 
						kv: {	
							assetId : "22",
							assignAllReports : false,
				            commandVersion : cmdVersion
						}
					});
				}
			}
		
		},
		
	/*	toggleWidgetAll : function(){
			if($(this).length == 1){
				if($(this).attr('src').search("unchecked") != -1){
				//	$("#widgetsInfoDiv").addClass("disable");
					$(this).attr('src',"static/images/icons/icon_checked.gif");
					$('img[id^="chkWidget_"]').attr('src',"static/images/icons/icon_checked_grey.gif");
					$('img[id^="chkWidget_"]').off('click');
					
					var cmdVersion = commandVersion + 1 ;
					commandVersion += 1 ;
					
					RolesApp.trigger('ApplyAllWidgets', {
						commandName: "ApplyAllWidgets", 
						path: '/rolesApi/Admin/Widgets', 
						kv: {	
							assetId : "22",
							assignAllWidgets : true,
				            commandVersion : cmdVersion
						}
					});
					
				}else{
					$(this).attr('src',"static/images/icons/icon_unchecked.gif");
					//$("#widgetsInfoDiv").removeClass("disable");
					$('img[id^="chkWidget_"]').attr('src',"static/images/icons/icon_unchecked.gif");
					$('img[id^="chkWidget_"]').on('click',TPFAItem.toggleWidget);
					var cmdVersion = commandVersion + 1 ;
					commandVersion += 1 ;
					RolesApp.trigger('RemoveAllWidgets', {
						commandName: "RemoveAllWidgets", 
						path: '/rolesApi/Admin/Widgets', 
						kv: {	
							assetId : "22",
							assignAllWidgets : false,
				            commandVersion : cmdVersion
						}
					});
				}
			}
		
		},		*/
		
		toggleAlertAll : function(){
			if($(this).length == 1){
				if($(this).attr('src').search("unchecked") != -1){
				//	$("#alertsInfoDiv").addClass("disable");
					$(this).attr('src',"static/images/icons/icon_checked.gif");
					$('img[id^="chkAlert_"]').attr('src',"static/images/icons/icon_checked.gif");
					//$('img[id^="chkAlert_"]').off('click');
					var cmdVersion = commandVersion + 1 ;
					commandVersion += 1 ;
					RolesApp.trigger('ApplyAllAlerts', {
						commandName: "ApplyAllAlerts", 
						path: '/rolesApi/TPFA/Alerts', 
						kv: {	
							assetId : "22",
							assignAllAlerts : true,
				            commandVersion : cmdVersion
						}
					});
					
				}else{
					$(this).attr('src',"static/images/icons/icon_unchecked.gif");
				//	$("#alertsInfoDiv").removeClass("disable");
					$('img[id^="chkAlert_"]').attr('src',"static/images/icons/icon_unchecked.gif");
					//$('img[id^="chkAlert_"]').on('click',TPFAItem.toggleAlert);
					var cmdVersion = commandVersion + 1 ;
					commandVersion += 1 ;
					RolesApp.trigger('RemoveAllAlerts', {
						commandName: "RemoveAllAlerts", 
						path: '/rolesApi/TPFA/Alerts', 
						kv: {	
							assetId : "22",
							assignAllAlerts : false,
				            commandVersion : cmdVersion
						}
					});
				}
			}
	},		
		
	/*	toggleInterfaceAll : function(){
			if($(this).length == 1){
				if($(this).attr('src').search("unchecked") != -1){
				//	$("#intrefacePrevInfoDiv").addClass("disable");
					$(this).attr('src',"static/images/icons/icon_checked.gif");
					$('img[id^="chkInterface"]').attr('src',"static/images/icons/icon_checked_grey.gif");
					$('img[id^="chkInterface"]').off('click');
					var cmdVersion = commandVersion + 1 ;
					commandVersion += 1 ;
					RolesApp.trigger('ApplyAllInterfaces', {
						commandName: "ApplyAllInterfaces", 
						path: '/rolesApi/Admin/Interfaces', 
						kv: {	
							assetId : "22",
							assignAllInterfaces : true,
				            commandVersion : cmdVersion
						}
					});
					
				}else{
					$(this).attr('src',"static/images/icons/icon_unchecked.gif");
			//		$("#intrefacePrevInfoDiv").removeClass("disable");
					$('img[id^="chkInterface"]').attr('src',"static/images/icons/icon_unchecked.gif");
					$('img[id^="chkInterface"]').on('click',TPFAItem.toggleInterface);
					var cmdVersion = commandVersion + 1 ;
					commandVersion += 1 ;
					RolesApp.trigger('RemoveAllInterfaces', {
						commandName: "RemoveAllInterfaces", 
						path: '/rolesApi/Admin/Interfaces', 
						kv: {	
							assetId : "22",
							assignAllInterfaces : false,
				            commandVersion : cmdVersion
						}
					});
					
				}
			}
		
		},		*/
		
		togglePermissionAll : function(){
			if($(this).length == 1){
				if($(this).attr('src').search("unchecked") != -1){
				//	$("#privilegesInfoDiv").addClass("disable");
					$(this).attr('src',"static/images/icons/icon_checked.gif");
					$('img[id^="chkPrev"]').attr('src',"static/images/icons/icon_checked.gif");
					//$('img[id^="chkPrev"]').off('click');
										
					$.each($('img[id^="chkPrevView"]'),function(index, obj){
						
						var cmdVersion = commandVersion + 1 ;
						commandVersion += 1 ;
						
						RolesApp.trigger('UpdatePermission', {
							commandName: "UpdatePermission", 
							path: '/rolesApi/TPFA/Permissions', 
							kv: {
								   screenId: $(this).data('screenid'),
						           screenName: $(this).data('screenname'),
						           screenWeight:$(this).data('screenweight'),
						           module:$(this).data('module'),
					               subModule:$(this).data('submodule'),
					               tciRmParent: $(this).data('tcirmparent'),
					               assetId: $(this).attr('data-assetid'),
					               digest :  $(this).data('digest'),
					               view:true,
					               edit:true,
					               auth:true,
						           commandVersion : cmdVersion
							}
						});
						
					});
				}else{
					$(this).attr('src',"static/images/icons/icon_unchecked.gif");
				//	$("#privilegesInfoDiv").removeClass("disable");
					$('img[id^="chkPrev"]').attr('src',"static/images/icons/icon_unchecked.gif");
					//$('img[id^="chkPrev"]').on('click',TPFAItem.togglePrivi);
					
					$.each($('img[id^="chkPrevView"]'),function(index, obj){
						
						var cmdVersion = commandVersion + 1 ;
						commandVersion += 1 ;
						
						RolesApp.trigger('UpdatePermission', {
							commandName: "UpdatePermission", 
							path: '/rolesApi/TPFA/Permissions', 
							kv: {
								   screenId: $(this).data('screenid'),
						           screenName: $(this).data('screenname'),
						           screenWeight:$(this).data('screenweight'),
						           module:$(this).data('module'),
					               subModule:$(this).data('submodule'),
					               tciRmParent: $(this).data('tcirmparent'),
					               assetId: $(this).attr('data-assetid'),
					               digest :  $(this).data('digest'),
					               view:false,
					               edit:false,
					               auth:false,
						           commandVersion : cmdVersion
							}
						});
						
					});
					
				}
			}
		},
			
		init: function () {
			console.log("TPFA Service Controller received");		
			
			$('img[id^="chkImgFeature"]').on('click',TPFAItem.toggleFeature);
			$('img[id^="chkPrev"]').on('click',TPFAItem.togglePrivi);
			//$('img[id^="chkInterface"]').on('click',TPFAItem.toggleInterface);
			
			//$('img[id^="chkMsg_"]').on('click',TPFAItem.toggleMsg);
			$('img[id^="chkRep_"]').on('click',TPFAItem.toggleRep);
			//$('img[id^="chkWidget_"]').on('click',TPFAItem.toggleWidget);	
			$('img[id^="chkAlert_"]').on('click',TPFAItem.toggleAlert);
									
			$('#privilegesInfoCaret').on('click',TPFAItem.togglePrivilegesCaret);	
			//$('#intrefacePrevInfoCaret').on('click',TPFAItem.toggleIntrefacePrevCaret);	
			//$('#messageInfoCaret').on('click',TPFAItem.toggleMessageCaret);	
			$('#reportsInfoCaret').on('click',TPFAItem.toggleReportsCaret);	
			//$('#widgetsInfoCaret').on('click',TPFAItem.toggleWidgetsCaret);
			$('#alertsInfoCaret').on('click',TPFAItem.toggleAlertsCaret);
			$('#featureCaret').on('click',TPFAItem.toggleFeatureCaret);
			
			$('#expandAll').on('click',TPFAItem.toggleExpandAll);
			$('#collapseAll').on('click',TPFAItem.toggleCollapseAll);	

			$('#back').on('click',TPFAItem.back);
			//$('#messageAll_22').on('click',TPFAItem.toggleMsgAll);
			$('#reportsAll_22').on('click',TPFAItem.toggleReportAll);
			//$('#widgetsAll_22').on('click',TPFAItem.toggleWidgetAll);
			$('#alertsAll_22').on('click',TPFAItem.toggleAlertAll);
			//$('#interfaceAll_22').on('click',TPFAItem.toggleInterfaceAll);
			$('#prevAll_22').on('click',TPFAItem.togglePermissionAll);		
			
			$('#permissionNext, #saveAndVerify').on('click', CommonRole.next);
			$('#btnCancelRoleEntry').on('click', CommonRole.cancel);
			
			//$('label[id^="messageAll_22"]').on('click', CommonRole.toggleLabelCheckUncheck);
			$('label[id^="reportsAll_22"]').on('click', CommonRole.toggleLabelCheckUncheck);
			$('label[id^="prevAll_22"]').on('click', CommonRole.toggleLabelCheckUncheck);
			//$('label[id^="interfaceAll_22"]').on('click', CommonRole.toggleLabelCheckUncheck);
			//$('label[id^="widgetsAll_22"]').on('click', CommonRole.toggleLabelCheckUncheck);
			//$('label[id^="alertsAll_22"]').on('click', CommonRole.toggleLabelCheckUncheck);
			$('label[id^="lblImgSrvc_"]').on('click', CommonRole.toggleLabelCheckUncheck);
			
		}
	};

	RolesApp.bind('tpfaServiceInit', TPFAItem.init);
	
})(jQuery);