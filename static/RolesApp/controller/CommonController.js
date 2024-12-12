/*global jQuery, RoleDetails */
var CommonRole;
(function ($) {
	'use strict';

	CommonRole = {
		
		setQuickLink : function (e, data) {
			$('#quickLinkLists').children().each(function () {
				if($(this).attr('id') == data.id)
					$(this).children().addClass("active");
				else
					$(this).children().removeClass("active");							
			});
		},
		
		permissionNext : function (e, data) {
			var assignedAssets = [];
			
			for (var itemp = 0,jtemp =0; itemp < data.details.services.length; itemp++) { 
        		if(data.details.services[itemp].assignedFlag && data.details.services[itemp].serviceNameDisplay != "Limits"){
        			
        			assignedAssets[jtemp] = {
        				"assetName" : (data.details.services[itemp].serviceName).replace(/ /g, ''),
        				"assetNameDisplay" : (data.details.services[itemp].serviceNameDisplay).replace(/ /g, ''),
        				"assetId" : data.details.services[itemp].serviceId
        			}
        			jtemp++;
        		}
        	}
			
			var detailviewName = data.viewName.split("/")[3];
			var viewName;
        	var index;
        	for (var i = 0; i < assignedAssets.length; i++) {
        		if (assignedAssets[i]["assetNameDisplay"] == "Receivables" ) {
        			assignedAssets[i]["assetNameDisplay"] = "Collection";
        		}
        		if (assignedAssets[i]["assetNameDisplay"] == "CashFlowForecast" ) {
        			assignedAssets[i]["assetNameDisplay"] = "Forecasting";
        		}
        	}
        	for (var i = 0; i < assignedAssets.length; i++) {

        		if (assignedAssets[i]["assetNameDisplay"] == detailviewName.split(".")[0]) {
        			index = i;
        			break;
        		}
        	}
			 if((index+1) == assignedAssets.length){
				 viewName = "Verify";
				 
				 var lblVerify = CommonRole.getLabel('lbl.role.verify','Verify');
				 $('#saveAndVerify').hide();
				 $('#permissionNext').text(lblVerify);
			 }
			 else{
				 var lblNext = CommonRole.getLabel('lbl.role.next','Next');
				 viewName = assignedAssets[index+1].assetNameDisplay;
				 $('#permissionNext').text(lblNext);
				 $('#saveAndVerify').show();
			 } 
			
        	$('#permissionNext')[0].href = "#/" +(viewName).replace(/ /g, '');
        	
			
		},
		checkAssignAll : function(e, data){
			var index = data.details.assets.findIndex(function(obj){
				return obj.assetId == data.id;
        	})
        	var prevAll = false;
        	if(data.details.assets[index].assignAllMessages){
					$("#messageAll_"+data.id).attr('src',"static/images/icons/icon_checked.gif");
					$('img[id^="chkMsg_"]').attr('src',"static/images/icons/icon_checked.gif");
					//$('img[id^="chkMsg_"]').off('click');
					
				}
			
			if(data.details.assets[index].assignAllReports){
				$("#reportsAll_"+data.id).attr('src',"static/images/icons/icon_checked.gif");
				$('img[id^="chkRep_"]').attr('src',"static/images/icons/icon_checked.gif");
				//$('img[id^="chkRep_"]').off('click');
				
			}
			
			if(data.details.assets[index].assignAllWidgets){
				$("#widgetsAll_"+data.id).attr('src',"static/images/icons/icon_checked.gif");
				$('img[id^="chkWidget_"]').attr('src',"static/images/icons/icon_checked.gif");
				//$('img[id^="chkWidget_"]').off('click');
				
			}
			if(data.details.assets[index].assignAllAlerts){
					$("#alertsAll_"+data.id).attr('src',"static/images/icons/icon_checked.gif");
					$('img[id^="chkAlert_"]').attr('src',"static/images/icons/icon_checked.gif");
					//$('img[id^="chkAlert_"]').off('click');
					
				}
			if(data.details.assets[index].assignAllInterfaces){
					$("#interfaceAll_"+data.id).attr('src',"static/images/icons/icon_checked.gif");
					$('img[id^="chkInterface"]').attr('src',"static/images/icons/icon_checked.gif");
					//$('img[id^="chkInterface"]').off('click');
					
				}
			if(data.details.assets[index].assignAllAccounts){
					$("#accountAll_"+data.id).attr('src',"static/images/icons/icon_checked.gif");
					$('img[id^="chkAccount_"]').attr('src',"static/images/icons/icon_checked.gif");
					//$('img[id^="chkAccount_"]').off('click');
					
				}
			if(data.details.assets[index].assignAllTemplates){
				$("#templateAll_"+data.id).attr('src',"static/images/icons/icon_checked.gif");
				$('img[id^="chkTemp_"]').attr('src',"static/images/icons/icon_checked.gif");
				//$('img[id^="chkTemp_"]').off('click');
				
			}
			if(data.details.assets[index].assignAllPackages){
					$("#packagesAll_"+data.id).attr('src',"static/images/icons/icon_checked.gif");
					$('img[id^="chkPkg_"]').attr('src',"static/images/icons/icon_checked.gif");
					//$('img[id^="chkPkg_"]').off('click');
					
				}
			if(data.details.assets[index].assignAllCompanyIds){
					$("#companyIdAll_"+data.id).attr('src',"static/images/icons/icon_checked.gif");
					$('img[id^="chkcmpId_"]').attr('src',"static/images/icons/icon_checked.gif");
					//$('img[id^="chkcmpId_"]').off('click');
					
				} 
			if(data.details.assets[index].assignAllBR){
				$("#bankReportAll_"+data.id).attr('src',"static/images/icons/icon_checked.gif");
				$('img[id^="chkBankReports_"]').attr('src',"static/images/icons/icon_checked.gif");
				//$('img[id^="chkBankReports_"]').off('click');
				
			} 
			if(data.details.assets[index].assignAllNotionals){
				$("#agreementAll_"+data.id).attr('src',"static/images/icons/icon_checked.gif");
				$('img[id^="chkNotional_"]').attr('src',"static/images/icons/icon_checked.gif");
				//$('img[id^="chkNotional_"]').off('click');
				
			} 
			if(data.details.assets[index].assignAllSweeps){
				$("#sweepAgreementAll_"+data.id).attr('src',"static/images/icons/icon_checked.gif");
				$('img[id^="chkSweepAgreements_"]').attr('src',"static/images/icons/icon_checked.gif");
				//$('img[id^="chkSweepAgreements_"]').off('click');
				
			} 
			if(data.details.assets[index].assetId == '01')
			{
				for (var iTemp = 0; iTemp < data.details.assets[index].permissions.length; iTemp++) {
					if(!(data.details.assets[index].permissions[iTemp].view)){
						prevAll = true;
						break;
					}
					
				}
				
			}else{
				if(data.details.assets[index].permissions != null){
					for (var iTemp = 0; iTemp < data.details.assets[index].permissions.length; iTemp++) {
						if(!(data.details.assets[index].permissions[iTemp].auth && data.details.assets[index].permissions[iTemp].edit && data.details.assets[index].permissions[iTemp].view)){
							prevAll = true;
							break;
						}
						
					  }
				}
			}
			if(data.details.assets[0].permissions? (data.details.assets[0].permissions.length == 0 ? true : false) :false)
				prevAll = true;
			
			if(prevAll){
				$("#prevAll_"+data.id).attr('src',"static/images/icons/icon_unchecked.gif");
			}else{
				$("#prevAll_"+data.id).attr('src',"static/images/icons/icon_checked.gif");
				$('img[id^="chkPrev"]').attr('src',"static/images/icons/icon_checked.gif");
				//$('img[id^="chkPrev"]').off('click');
			}
			
		},
		
		toggleLabelCheckUncheck: function () {
			if ($(this).length == 1) {
				var chkBoxId = '#' + $(this).attr('for');
				$(chkBoxId).click();
			}
		},

		getLabel :  function (key, defaultText) {
			return (clientRoleLabelsMap && clientRoleLabelsMap[key]) ? clientRoleLabelsMap[key]
				: defaultText
		},
		
		getStringWithSpecialChars :  function (key) {
			return key.replace(/&amp;/g, '&')
	        .replace(/&lt;/g, '<')
	        .replace(/&gt;/g, '>')
	        .replace(/&quot;/g, '"')
	        .replace(/&apos;/g, "'")
	        .replace(/&#39;/g, "'")
			.replace(/&#039;/g, "'")
			.replace(/&#034;/g,'"')
			.replace(/&#34;/g,'"');
		},
		
		getModLabel :  function (key, defaultText) {
			return getModuleLabel(key, defaultText);
		},
		
		next : function(){
			roleCommand = CommonRole.getAssetStore();
			var assetId = "03";  // Default Admin asset
			if(roleCommand.length > 0 ){
				assetId = roleCommand[0].kv.assetId;
				RolesApp.trigger('SaveAsset', {assetId: assetId} );				
			}
			
		},	
		cancel : function(){
			var buttonsOpts = {};
			buttonsOpts[CommonRole.getLabel('lbl.btncontinue','Continue')] =  function() {
						window.location = 'userAdminCategoryList.form';
					};
						
			buttonsOpts[CommonRole.getLabel('lbl.role.cancel','Cancel')] = function() {
						$(this).dialog("close");
					};
				
			$('#confirmMsgPopup').dialog({
				autoOpen : false,
				title:CommonRole.getLabel('lbl.message.title','Message'),
				maxHeight: 550,
				minHeight:'auto',
				width : 400,
				modal : true,
				resizable: false,
				draggable: false,
				open: function() {
						var msg = CommonRole.getLabel('lbl.conf.message','Any changes made by you will be lost, Do you want to continue?');
						$(this).html(msg);
				},
				buttons :buttonsOpts
			});
			$( '#confirmMsgPopup' ).dialog( 'open' );
		},
		
		getAssetStore : function(){
			return roleCommand.concat(permissionStore,granBRPrivilegesStore,granLoansPrivilegesStore,granChkMgmtPrivilegesStore,granPosPayPrivilegesStore,
					granPayPrivilegesStore,granSIPrivilegesStore,granReversalPrivilegesStore,granTempPrivilegesStore,
					messageStore,reportStore,widgetStore,accountStore,
					interfaceStore,alertStore,featureStore,allFlagStore,packageStore,templateStore,companyIdStore,bankReport,notionalAgreementStore,sweepAgreementStore);
		},
		
		checkSelectAll : function(checkBoxItemId, selectAllCheckBoxId) {
			var allChecked = true;

			$('img[id^="'+checkBoxItemId+'"]').each(function (){
				if($(this).attr('src').search("unchecked") != -1){
					allChecked = false;
					return;
				}	
			});
			
			if(allChecked) {
				$('img[id^="'+selectAllCheckBoxId+'"]').trigger('click')
				//$("#selectAllCheckBoxId").trigger('click');
			} else {
				$('img[id^="'+selectAllCheckBoxId+'"]').attr('src',"static/images/icons/icon_unchecked.gif");
			}
		},
		
		updateStore: function(element, roleCardType, checkBoxItemId, moduleName) {

			if ($(element).attr('src').search("unchecked") != -1) {
				return;
			}

			commandVersion += 1;

			if (roleCardType == 'Alerts' && alertCount == alertsAssignedCount) {
				var assetId;
				
				$('img[id^="' + checkBoxItemId + '"]').each(function(index, ele) {
					if (!($(ele).attr('src').search("unchecked") != -1)) {
						assetId = $(ele).attr('data-assetid')
					}
				});
				RolesApp.trigger('RemoveAllAlerts', {
					commandName: "RemoveAllAlerts",
					path: '/rolesApi/' + moduleName + '/Alerts',
					kv: {
						assetId: assetId,
						assignAllAlerts: false,
						commandVersion: commandVersion
					}
				});

				$('img[id^="' + checkBoxItemId + '"]').each(function(index, ele) {
					if (!($(ele).attr('src').search("unchecked") != -1)) {
						commandVersion += 1;
						RolesApp.trigger('AddAlerts', {
							commandName: "AddAlerts",
							path: '/rolesApi/' + moduleName + '/Alerts',
							kv: {
								alertId: $(ele).data('alertid'),
								alertType: $(ele).data('alerttype'),
								assetId: $(ele).attr('data-assetid'),
								digest: $(ele).data('digest'),
								assignedFlag: true,
								commandVersion: commandVersion
							}
						});
					}
				});
			} else if (roleCardType == 'Widgets' && widgetsCount == widgetsAssignedCount) {
				var assetId;
				
				$('img[id^="' + checkBoxItemId + '"]').each(function(index, ele) {
					if (!($(ele).attr('src').search("unchecked") != -1)) {
						assetId = $(ele).attr('data-assetid')
					}
				});
				RolesApp.trigger('RemoveAllWidgets', {
					commandName: "RemoveAllWidgets",
					path: '/rolesApi/' + moduleName + '/Widgets',
					kv: {
						assetId: assetId,
						assignAllWidgets: false,
						commandVersion: commandVersion
					}
				});

				$('img[id^="' + checkBoxItemId + '"]').each(function(index, ele) {
					if (!($(ele).attr('src').search("unchecked") != -1)) {
						commandVersion += 1;
						RolesApp.trigger('AddWidgets', {
							commandName: "AddWidgets",
							path: '/rolesApi/' + moduleName + '/Widgets',
							kv: {
								widgetId: $(ele).data('widgetid'),
								widgetType: $(ele).data('widgettype'),
								assetId: $(ele).attr('data-assetid'),
								digest: $(ele).data('digest'),
								assignedFlag: true,
								commandVersion: commandVersion
							}
						});
					}
				});
			} else if (roleCardType == 'Accounts' && accountsCount == accountsAssignedCount) {
				var assetId;
				
				$('img[id^="' + checkBoxItemId + '"]').each(function(index, ele) {
					if (!($(ele).attr('src').search("unchecked") != -1)) {
						assetId = $(ele).attr('data-assetid')
					}
				});
				
				RolesApp.trigger('RemoveAllAccounts', {
					commandName: "RemoveAllAccounts",
					path: '/rolesApi/' + moduleName + '/Accounts',
					kv: {
						assetId: assetId,
						assignAllAccounts: false,
						commandVersion: commandVersion
					}
				});
				

				$('img[id^="' + checkBoxItemId + '"]').each(function(index, ele) {
					if (!($(ele).attr('src').search("unchecked") != -1)) {
						commandVersion += 1;
						RolesApp.trigger('AddAccounts', {
							commandName: "AddAccounts",
							path: '/rolesApi/' + moduleName + '/Accounts',
							kv: {
								subsidiaryId: $(ele).attr('data-subsidiaryid'),
								accountName: $(ele).data('accountname'),
								accountId: $(ele).attr('data-accountid'),
								accountNo: $(ele).attr('data-accountno'),
								subsidiaryName: $(ele).data('subsidiaryname'),
								assetId: $(ele).attr('data-assetid'),
								digest: $(ele).data('digest'),
								assignedFlag: true,
								commandVersion: commandVersion
							}
						});
					}
				});
			} else if (roleCardType == 'Reports' && reportsCount == reportsAssignedCount) {
                var assetId;
				
				$('img[id^="' + checkBoxItemId + '"]').each(function(index, ele) {
					if (!($(ele).attr('src').search("unchecked") != -1)) {
						assetId = $(ele).attr('data-assetid')
					}
				});
				RolesApp.trigger('RemoveAllReports', {
					commandName: "RemoveAllReports",
					path: '/rolesApi/' + moduleName + '/Reports',
					kv: {
						assetId: assetId,
						assignAllReports: false,
						commandVersion: commandVersion
					}
				});

				$('img[id^="' + checkBoxItemId + '"]').each(function(index, ele) {
					if (!($(ele).attr('src').search("unchecked") != -1)) {
						commandVersion += 1;
						RolesApp.trigger('AddReports', {
							commandName: "AddReports",
							path: '/rolesApi/' + moduleName + '/Reports',
							kv: {
								reportId: $(ele).data('reportid'),
								reportType: $(ele).data('reporttype'),
								assetId: $(ele).attr('data-assetid'),
								digest: $(ele).data('digest'),
								assignedFlag: true,
								commandVersion: commandVersion
							}
						});
					}
				});
			} else if (roleCardType == 'Packages' && packagesCount == packagesAssignedCount) {
                var assetId;
				
				$('img[id^="' + checkBoxItemId + '"]').each(function(index, ele) {
					if (!($(ele).attr('src').search("unchecked") != -1)) {
						assetId = $(ele).attr('data-assetid')
					}
				});
				
				RolesApp.trigger('RemoveAllPackages', {
					commandName: "RemoveAllPackages",
					path: '/rolesApi/' + moduleName + '/Packages',
					kv: {
						assetId: assetId,
						assignAllPackages: false,
						commandVersion: commandVersion
					}
				});

				$('img[id^="' + checkBoxItemId + '"]').each(function(index, ele) {
					if (!($(ele).attr('src').search("unchecked") != -1)) {
						commandVersion += 1;
						RolesApp.trigger('AddPackages', {
							commandName: "AddPackages",
							path: '/rolesApi/' + moduleName + '/Packages',
							kv: {
								subsidiaryId: $(ele).attr('data-subsidiaryid'),
								packageName: $(ele).data('packagename'),
								packageId: $(ele).attr('data-packageid'),
								subsidiaryName: $(ele).data('subsidiaryname'),
								productCatType: $(ele).data('productcattype'),
								assetId: $(ele).attr('data-assetid'),
								digest: $(ele).data('digest'),
								assignedFlag: true,
								commandVersion: commandVersion
							}
						});
					}
				});
			} else if (roleCardType == 'Messages' && messagesCount == messagesAssignedCount) {

				RolesApp.trigger('RemoveAllMessages', {
					commandName: "RemoveAllMessages",
					path: '/rolesApi/' + moduleName + '/Messages',
					kv: {
						assetId: "03",
						assignAllMessages: false,
						commandVersion: commandVersion
					}
				});
				$('img[id^="' + checkBoxItemId + '"]').each(function(index, ele) {
					if (!($(ele).attr('src').search("unchecked") != -1)) {
						commandVersion += 1;
						RolesApp.trigger('AddMessages', {
							commandName: "AddMessages",
							path: '/rolesApi/' + moduleName + '/Messages',
							kv: {
								messageId: $(ele).data('messageid'),
								messageType: $(ele).data('messagetype'),
								assetId: $(ele).attr('data-assetid'),
								digest: $(ele).data('digest'),
								assignedFlag: true,
								commandVersion: commandVersion
							}
						});

					}
				});
			} else if (roleCardType == 'Notional' && notionalAgreementsCount == notionalAgreementsAssignedCount) {

				RolesApp.trigger('RemoveAllNotional', {
					commandName: "RemoveAllNotional", 
					path: '/rolesApi/' + moduleName + '/Agreements', 
					kv: {	
						assetId : "04",
						assignAllNotionals : false,
			            commandVersion : commandVersion
					}
				});
				
				$('img[id^="' + checkBoxItemId + '"]').each(function(index, ele) {
					if (!($(ele).attr('src').search("unchecked") != -1)) {
						commandVersion += 1;
						RolesApp.trigger('AddNotional', {
							commandName: "AddNotional",
							path: '/rolesApi/' + moduleName + '/Agreements',
							kv: {	
								agreementCode :  $(ele).data('agreementcode'),
								agreementName : $(ele).data('agreementname'), 
								assetId : $(ele).attr('data-assetid'),
								subsidiaryId:$(ele).attr('data-subsidairyid'),
								subsidiaryName:$(ele).data('subsidairyname'),
								digest :  $(ele).data('digest'),
								assignedFlag : true,
					            commandVersion : commandVersion
							}
						});

					}
				});
			} else if (roleCardType == 'Sweep' && sweepAgreementsCount == sweepAgreementsAssignedCount) {

				RolesApp.trigger('RemoveAllSweep', {
					commandName: "RemoveAllSweep", 
					path: '/rolesApi/' + moduleName + '/Agreements', 
					kv: {	
						assetId : "04",
						assignAllSweeps : false,
			            commandVersion : commandVersion
					}
				});
					
				$('img[id^="' + checkBoxItemId + '"]').each(function(index, ele) {
					if (!($(ele).attr('src').search("unchecked") != -1)) {
						commandVersion += 1;
						
						RolesApp.trigger('AddSweep', {
							commandName: "AddSweep",
							path: '/rolesApi/' + moduleName + '/Agreements',
							kv: {	
								agreementCode :  $(ele).data('agreementcode'),
								agreementName : $(ele).data('agreementname'), 
								assetId : $(ele).attr('data-assetid'),
								subsidiaryId:$(ele).attr('data-subsidairyid'),
								subsidiaryName:$(ele).data('subsidairyname'), 
								digest :  $(ele).data('digest'),
								assignedFlag : true,
					            commandVersion : commandVersion
							}
						});
					}
				});
			} else if (roleCardType == 'Templates' && templatesCount == templatesAssignedCount) {

				RolesApp.trigger('RemoveAllTemplates', {
					commandName: "RemoveAllTemplates", 
					path: '/rolesApi/' + moduleName + '/Templates', 
					kv: {	
						assetId : "02",
						assignAllTemplates : false,
						commandVersion : commandVersion
					}
				});
						
				$('img[id^="' + checkBoxItemId + '"]').each(function(index, ele) {
					if (!($(ele).attr('src').search("unchecked") != -1)) {
						commandVersion += 1;
						RolesApp.trigger('AddTemplates', {
							commandName: "AddTemplates",
							path: '/rolesApi/' + moduleName + '/Templates',
							kv: {						
									subsidiaryId:$(ele).attr('data-subsidiaryid'),
									templateId: $(ele).data('templateid'),
									subsidiaryName:$(ele).data('subsidiaryname'),
									templateName:$(ele).data('templatename'),
									assetId : $(ele).attr('data-assetid'),
									digest :  $(ele).data('digest'),
									assignedFlag : true,
									commandVersion : commandVersion
							}
						});
					}
				});
			} else if (roleCardType == 'CompanyId' && companyIdCount == companyIdAssignedCount) {

				RolesApp.trigger('RemoveAllCompanyID', {
					commandName: "RemoveAllCompanyIds", 
					path: '/rolesApi/' + moduleName + '/CompanyID', 
					kv: {	
						assetId : "02",
						assignAllCompanyIds : false,
						commandVersion : commandVersion
					}
				});
						
				$('img[id^="' + checkBoxItemId + '"]').each(function(index, ele) {
					if (!($(ele).attr('src').search("unchecked") != -1)) {
						commandVersion += 1;
						RolesApp.trigger('AddCompanyID', {
							commandName: "AddCompanyId",
							path: '/rolesApi/' + moduleName + '/CompanyID',
							kv: {						
									subsidiaryId:$(ele).attr('data-subsidiaryid'),
									accountName: $(ele).data('accountname'),
									accountId:$(ele).attr('data-accountid'),
									accountNo:$(ele).attr('data-accountno'),
									companyName:$(ele).data('companyname'),
									subsidiaryName:$(ele).data('subsidiaryname'),
									companyId:$(ele).data('companyid'),
									assetId : $(ele).attr('data-assetid'),
									digest :  $(ele).data('digest'),
									assignedFlag : true,
									commandVersion : commandVersion
							}
						});
					}
				});
			} else if (roleCardType == 'BankReports') {

				RolesApp.trigger('RemoveAllBankReports', {
					commandName: "RemoveAllBankReports", 
					path: '/rolesApi/BankReports', 
					kv: {	
						assetId : "15",
						assignAllBR : false,
						commandVersion : commandVersion
					}
				});
						
				$('img[id^="' + checkBoxItemId + '"]').each(function(index, ele) {
					if (!($(ele).attr('src').search("unchecked") != -1)) {
						commandVersion += 1;
						RolesApp.trigger('AddBankReports', {
							commandName: "AddBankReports",
							path: '/rolesApi/BankReports',
							kv: {						
									distributionId: $(this).attr('data-distributionid'),
									reportId: $(this).data('reportid'),
									reportName: $(this).data('reportname'),
									type: $(this).data('type'),
									assetId: $(this).attr('data-assetid'),
									clientId: $(this).attr('data-clientid'),
									digest :  $(this).data('digest'),
									assignedFlag : true,
									commandVersion : commandVersion
							}
						});
					}
				});
			}else if (roleCardType == 'Interfaces') {

				RolesApp.trigger('RemoveAllInterfaces', {
					commandName: "RemoveAllInterfaces", 
					path: '/rolesApi/' + moduleName + '/Interfaces', 
					kv: {	
						assetId : "03",
						assignAllInterfaces : false,
						commandVersion : commandVersion
					}
				});
							
				$('img[id^="' + checkBoxItemId + '"]').each(function(index, ele) {
					if (!($(ele).attr('src').search("unchecked") != -1)) {
						commandVersion += 1;
					var interfaceId = $(ele).attr('id').split("_"),execute,edit;
					
				    if(null != interfaceId){
					var id = $(ele).attr('data-interfaceid');
					edit = AdminItem.isChecked($('#chkInterfaceEdit_'+interfaceId[1]+'_'+id).attr('src'));
					execute = AdminItem.isChecked($('#chkInterfaceExecute_'+interfaceId[1]+'_'+id).attr('src'));
				   }
						RolesApp.trigger('UpdateInterfaces', {
							commandName: "UpdateInterfaces",
							path: '/rolesApi/' + moduleName + '/Interfaces',
							kv: {						
									interfaceType: $(this).data('interfacetype'),
									interfaceId: $(this).data('interfaceid'),
									subModule:$(this).data('submodule'),
			 		                assetId: $(this).attr('data-assetid'),
			 		                digest :  $(this).data('digest'),
									edit : edit,
									execute : execute,
									model : $(this).data('model'),
						            commandVersion : commandVersion
							}
						});
					}
				});
			}

		}
	};
	

	RolesApp.bind('setQuickLink', CommonRole.setQuickLink);
	RolesApp.bind('permissionNext', CommonRole.permissionNext);
	RolesApp.bind('checkAssignAll', CommonRole.checkAssignAll);
			
})(jQuery);
