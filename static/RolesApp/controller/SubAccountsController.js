/*global jQuery, RoleDetails */

(function($) {
	'use strict';
	var subAccountsItem = {

		togglePrivi : function() {
			if ($(this).length === 1) {
				var prevId = $(this).attr('id').split("_"), view, edit, auth;

				if ($(this).attr('src').search("unchecked") !== -1) {
					if (prevId[0] === "chkPrevEdit" || prevId[0] === "chkPrevAuth") {
						$('#chkPrevView_' + prevId[1] + '_' + prevId[2]).attr('src', 'static/images/icons/icon_checked.gif');
					}
					$(this).attr('src', "static/images/icons/icon_checked.gif");
				}
				else {
					if (prevId[0] === "chkPrevView") {
						$('#chkPrevEdit_' + prevId[1] + '_' + prevId[2]).attr('src', 'static/images/icons/icon_unchecked.gif');
						$('#chkPrevAuth_' + prevId[1] + '_' + prevId[2]).attr('src', 'static/images/icons/icon_unchecked.gif');
					}
					$(this).attr('src', "static/images/icons/icon_unchecked.gif");
				}

				if (null != prevId) {
					if ($('#chkPrevView_' + prevId[1] + '_' + prevId[2]).attr('src') !== undefined) {
						view = subAccountsItem.isChecked($('#chkPrevView_' + prevId[1] + '_' + prevId[2]).attr('src'));
					}
					else {
						view = false;
					}
					if ($('#chkPrevEdit_' + prevId[1] + '_' + prevId[2]).attr('src') !== undefined) {
						edit = subAccountsItem.isChecked($('#chkPrevEdit_' + prevId[1] + '_' + prevId[2]).attr('src'));
					}
					else {
						edit = false;
					}

					if ($('#chkPrevAuth_' + prevId[1] + '_' + prevId[2]).attr('src') !== undefined) {
						auth = subAccountsItem.isChecked($('#chkPrevAuth_' + prevId[1] + '_' + prevId[2]).attr('src'));
					}
					else {
						auth = false;
					}
				}

				var cmdVersion = commandVersion + 1;
				commandVersion += 1;
				RolesApp.trigger('UpdatePermission', {
					commandName : "UpdatePermission",
					path : '/rolesApi/SubAccounts/Permissions',
					kv : {
						screenId : $(this).data('screenid'),
						screenName : $(this).data('screenname'),
						screenWeight : $(this).data('screenweight'),
						module : $(this).data('module'),
						subModule : $(this).data('submodule'),
						tciRmParent : $(this).data('tcirmparent'),
						assetId : $(this).attr('data-assetid'),
						digest : $(this).data('digest'),
						view : view,
						edit : edit,
						auth : auth,
						commandVersion : cmdVersion
					}
				});
				CommonRole.checkSelectAll('chkPrev','prevAll');	
			}
		},

		toggleAcc : function() {
			if ($(this).length === 1) {
				CommonRole.updateStore(this, 'Accounts', 'chkAccount_','SubAccounts');
				if ($(this).attr('src').search("unchecked") !== -1) {
					
					$(this).attr('src', "static/images/icons/icon_checked.gif");
					var cmdVersion = commandVersion + 1;
					commandVersion += 1;
					RolesApp.trigger('AddAccounts', {
						commandName : "AddAccounts",
						path : '/rolesApi/SubAccounts/Accounts',
						kv : {
							subsidiaryId : $(this).attr('data-subsidiaryid'),
							accountName : $(this).data('accountname'),
							accountId : $(this).attr('data-accountid'),
							accountNo : $(this).attr('data-accountno'),
							subsidiaryName : $(this).data('subsidiaryname'),
							assetId : $(this).attr('data-assetid'),
							digest : $(this).data('digest'),
							assignedFlag : true,
							commandVersion : cmdVersion
						}
					});

				}
				else {
					$(this).attr('src', "static/images/icons/icon_unchecked.gif");
					var cmdVersion = commandVersion + 1;
					commandVersion += 1;
					RolesApp.trigger('RemoveAccounts', {
						commandName : "RemoveAccounts",
						path : '/rolesApi/SubAccounts/Accounts',
						kv : {
							subsidiaryId : $(this).attr('data-subsidiaryid'),
							accountName : $(this).data('accountname'),
							accountId : $(this).attr('data-accountid'),
							accountNo : $(this).attr('data-accountno'),
							subsidiaryName : $(this).data('subsidiaryname'),
							assetId : $(this).attr('data-assetid'),
							digest : $(this).data('digest'),
							assignedFlag : false,
							commandVersion : cmdVersion
						}
					});
				}
				CommonRole.checkSelectAll('chkAccount_','accountAll');	
			}

		},

		toggleFeature : function() {
			if ($(this).length === 1) {
				if ($(this).attr('src').search("unchecked") !== -1) {
					$(this).attr('src', "static/images/icons/icon_checked.gif");
					var cmdVersion = commandVersion + 1;
					commandVersion += 1;
					RolesApp.trigger('AddFeatures', {
						commandName : "AddFeatures",
						path : '/rolesApi/SubAccounts/Features',
						kv : {
							featureId : $(this).data('featureid'),
							featureName : $(this).data('featurename'),
							assetId : $(this).attr('data-assetid'),
							digest : $(this).data('digest'),
							assignedFlag : true,
							commandVersion : cmdVersion
						}
					});
				}
				else {
					$(this).attr('src', "static/images/icons/icon_unchecked.gif");
					var cmdVersion = commandVersion + 1;
					commandVersion += 1;
					RolesApp.trigger('RemoveFeatures', {
						commandName : "RemoveFeatures",
						path : '/rolesApi/SubAccounts/Features',
						kv : {
							featureId : $(this).data('featureid'),
							featureName : $(this).data('featurename'),
							assetId : $(this).attr('data-assetid'),
							digest : $(this).data('digest'),
							assignedFlag : false,
							commandVersion : cmdVersion
						}
					});
				}
			}

		},

		toggleRep : function() {
			if ($(this).length === 1) {
                CommonRole.updateStore(this, 'Reports', 'chkRep_','SubAccounts');
				if ($(this).attr('src').search("unchecked") !== -1) {
					$(this).attr('src', "static/images/icons/icon_checked.gif");
					var cmdVersion = commandVersion + 1;
					commandVersion += 1;
					RolesApp.trigger('AddReports', {
						commandName : "AddReports",
						path : '/rolesApi/SubAccounts/Reports',
						kv : {
							reportId : $(this).data('reportid'),
							reportType : $(this).data('reporttype'),
							assetId : $(this).attr('data-assetid'),
							digest : $(this).data('digest'),
							assignedFlag : true,
							commandVersion : cmdVersion
						}
					});

				}
				else {
					$(this).attr('src', "static/images/icons/icon_unchecked.gif");
					var cmdVersion = commandVersion + 1;
					commandVersion += 1;
					RolesApp.trigger('RemoveReports', {
						commandName : "RemoveReports",
						path : '/rolesApi/SubAccounts/Report',
						kv : {
							reportId : $(this).data('reportid'),
							reportType : $(this).data('reporttype'),
							assetId : $(this).attr('data-assetid'),
							digest : $(this).data('digest'),
							assignedFlag : false,
							commandVersion : cmdVersion
						}
					});

				}
				CommonRole.checkSelectAll('chkRep_','reportsAll');
			}
		},

		toggleAlert : function() {
			if ($(this).length === 1) {
                CommonRole.updateStore(this, 'Alerts', 'chkAlert_','SubAccounts');
				if ($(this).attr('src').search("unchecked") !== -1) {
					$(this).attr('src', "static/images/icons/icon_checked.gif");
					var cmdVersion = commandVersion + 1;
					commandVersion += 1;
					RolesApp.trigger('AddAlerts', {
						commandName : "AddAlerts",
						path : '/rolesApi/SubAccounts/Alerts',
						kv : {
							alertId : $(this).data('alertid'),
							alertType : $(this).data('alerttype'),
							assetId : $(this).attr('data-assetid'),
							digest : $(this).data('digest'),
							assignedFlag : true,
							commandVersion : cmdVersion
						}
					});

				}
				else {
					$(this).attr('src', "static/images/icons/icon_unchecked.gif");
					var cmdVersion = commandVersion + 1;
					commandVersion += 1;
					RolesApp.trigger('RemoveAlerts', {
						commandName : "RemoveAlerts",
						path : '/rolesApi/SubAccounts/Alerts',
						kv : {
							alertId : $(this).data('alertid'),
							alertType : $(this).data('alerttype'),
							assetId : $(this).attr('data-assetid'),
							digest : $(this).data('digest'),
							assignedFlag : false,
							commandVersion : cmdVersion
						}
					});

				}
				CommonRole.checkSelectAll('chkAlert_','alertsAll');
			}

		},
		togglePrivilegesCaret : function() {
			$('#privilegesInfoCaret').toggleClass("fa-caret-up fa-caret-down");
			$('#privilegesInfoDiv').slideToggle(200);
			return false;

		},

		toggleAccountsCaret : function() {
			$('#accountsInfoCaret').toggleClass("fa-caret-up fa-caret-down");
			$('#accountsInfoDiv').slideToggle(200);
			return false;

		},

		toggleAlertsCaret : function() {
			$('#alertsInfoCaret').toggleClass("fa-caret-up fa-caret-down");
			$('#alertsInfoDiv').slideToggle(200);
			return false;

		},
		toggleReportsCaret : function() {
			$('#reportsInfoCaret').toggleClass("fa-caret-up fa-caret-down");
			$('#reportsInfoDiv').slideToggle(200);
			return false;

		},
		toggleExpandAll : function() {
			$("[id$='Caret']").addClass("fa-caret-up");
			$("[id$='Caret']").removeClass("fa-caret-down");
			$("[id$='InfoDiv']").slideDown(200);
			return false;
		},
		toggleCollapseAll : function() {
			$("[id$='Caret']").addClass("fa-caret-down");
			$("[id$='Caret']").removeClass("fa-caret-up");
			$("[id$='InfoDiv']").slideUp(200);
			return false;
		},
		toggleFeatureCaret : function() {
			$('#featureCaret').toggleClass("fa-caret-up fa-caret-down");
			$('#featureDiv').slideToggle(200);
			return false;

		},
		toggleReportAll : function() {
			if ($(this).length === 1) {
				if ($(this).attr('src').search("unchecked") !== -1) {
					$(this).attr('src', "static/images/icons/icon_checked.gif");
					$('img[id^="chkRep_"]').attr('src',"static/images/icons/icon_checked.gif");
					//$('img[id^="chkRep_"]').off('click');
					var cmdVersion = commandVersion + 1;
					commandVersion += 1;
					RolesApp.trigger('ApplyAllReports', {
						commandName : "ApplyAllReports",
						path : '/rolesApi/SubAccounts/Reports',
						kv : {
							assetId : "21",
							assignAllReports : true,
							commandVersion : cmdVersion
						}
					});
				}
				else {
					$(this).attr('src', "static/images/icons/icon_unchecked.gif");
					$('img[id^="chkRep_"]').attr('src', "static/images/icons/icon_unchecked.gif");
					//$('img[id^="chkRep_"]').on('click', subAccountsItem.toggleRep);
					var cmdVersion = commandVersion + 1;
					commandVersion += 1;
					RolesApp.trigger('RemoveAllReports', {
						commandName : "RemoveAllReports",
						path : '/rolesApi/SubAccounts/Reports',
						kv : {
							assetId : "21",
							assignAllReports : false,
							commandVersion : cmdVersion
						}
					});
				}
			}

		},
		toggleAlertAll : function() {
			if ($(this).length === 1) {
				if ($(this).attr('src').search("unchecked") !== -1) {
					$(this).attr('src', "static/images/icons/icon_checked.gif");
					$('img[id^="chkAlert_"]').attr('src',"static/images/icons/icon_checked.gif");
					//$('img[id^="chkAlert_"]').off('click');
					var cmdVersion = commandVersion + 1;
					commandVersion += 1;
					RolesApp.trigger('ApplyAllAlerts', {
						commandName : "ApplyAllAlerts",
						path : '/rolesApi/SubAccounts/Alerts',
						kv : {
							assetId : "21",
							assignAllAlerts : true,
							commandVersion : cmdVersion
						}
					});
				}
				else {
					$(this).attr('src', "static/images/icons/icon_unchecked.gif");
					$('img[id^="chkAlert_"]').attr('src', "static/images/icons/icon_unchecked.gif");
					//$('img[id^="chkAlert_"]').on('click', subAccountsItem.toggleAlert);
					var cmdVersion = commandVersion + 1;
					commandVersion += 1;
					RolesApp.trigger('RemoveAllAlerts', {
						commandName : "RemoveAllAlerts",
						path : '/rolesApi/SubAccounts/Alerts',
						kv : {
							assetId : "21",
							assignAllAlerts : false,
							commandVersion : cmdVersion
						}
					});
				}
			}

		},
		toggleAccountAll : function() {
			if ($(this).length === 1) {
				if ($(this).attr('src').search("unchecked") !== -1) {
					$(this).attr('src', "static/images/icons/icon_checked.gif");
					$('img[id^="chkAccount_"]').attr('src',"static/images/icons/icon_checked.gif");
					//$('img[id^="chkAccount_"]').off('click');
					var cmdVersion = commandVersion + 1;
					commandVersion += 1;
					RolesApp.trigger('ApplyAllAccounts', {
						commandName : "ApplyAllAccounts",
						path : '/rolesApi/SubAccounts/Accounts',
						kv : {
							assetId : "21",
							assignAllAccounts : true,
							commandVersion : cmdVersion
						}
					});

				}
				else {
					$(this).attr('src', "static/images/icons/icon_unchecked.gif");
					$('img[id^="chkAccount_"]').attr('src', "static/images/icons/icon_unchecked.gif");
					//$('img[id^="chkAccount_"]').on('click', subAccountsItem.toggleAcc);
					var cmdVersion = commandVersion + 1;
					commandVersion += 1;
					RolesApp.trigger('RemoveAllAccounts', {
						commandName : "RemoveAllAccounts",
						path : '/rolesApi/SubAccounts/Accounts',
						kv : {
							assetId : "21",
							assignAllAccounts : false,
							commandVersion : cmdVersion
						}
					});
				}
			}

		},

		isChecked : function(src) {
			if (src.search("unchecked") !== -1) {
				return false;
			}
			else {
				return true;
			}
		},

		togglePermissionAll : function() {
			if ($(this).length === 1) {
				if ($(this).attr('src').search("unchecked") !== -1) {
					$(this).attr('src', "static/images/icons/icon_checked.gif");
					$('img[id^="chkPrev"]').attr('src',"static/images/icons/icon_checked.gif");
					//$('img[id^="chkPrev"]').off('click');

					$.each($('img[id^="chkPrevView"]'), function(index, obj) {

						var cmdVersion = commandVersion + 1;
						commandVersion += 1;
						RolesApp.trigger('UpdatePermission', {
							commandName : "UpdatePermission",
							path : '/rolesApi/SubAccounts/Permissions',
							kv : {
								screenId : $(this).data('screenid'),
								screenName : $(this).data('screenname'),
								screenWeight : $(this).data('screenweight'),
								module : $(this).data('module'),
								subModule : $(this).data('submodule'),
								tciRmParent : $(this).data('tcirmparent'),
								assetId : $(this).attr('data-assetid'),
								digest : $(this).data('digest'),
								view : true,
								edit : true,
								auth : true,
								commandVersion : cmdVersion
							}
						});
					});
				}
				else {
					$(this).attr('src', "static/images/icons/icon_unchecked.gif");
					$('img[id^="chkPrev"]').attr('src', "static/images/icons/icon_unchecked.gif");
					//$('img[id^="chkPrev"]').on('click', subAccountsItem.togglePrivi);

					$.each($('img[id^="chkPrevView"]'), function(index, obj) {
						var cmdVersion = commandVersion + 1;
						commandVersion += 1;
						RolesApp.trigger('UpdatePermission', {
							commandName : "UpdatePermission",
							path : '/rolesApi/SubAccounts/Permissions',
							kv : {
								screenId : $(this).data('screenid'),
								screenName : $(this).data('screenname'),
								screenWeight : $(this).data('screenweight'),
								module : $(this).data('module'),
								subModule : $(this).data('submodule'),
								tciRmParent : $(this).data('tcirmparent'),
								assetId : $(this).attr('data-assetid'),
								digest : $(this).data('digest'),
								view : false,
								edit : false,
								auth : false,
								commandVersion : cmdVersion
							}
						});
					});
				}
			}
		},
		init : function() {
			$('img[id^="chkImgFeature"]').on('click', subAccountsItem.toggleFeature);
			$('img[id^="chkPrev"]').on('click', subAccountsItem.togglePrivi);
			$('img[id^="chkAccount_"]').on('click', subAccountsItem.toggleAcc);
			$('img[id^="chkAlert_"]').on('click', subAccountsItem.toggleAlert);
			$('img[id^="chkRep_"]').on('click', subAccountsItem.toggleRep);
			$('#privilegesInfoCaret').on('click', subAccountsItem.togglePrivilegesCaret);
			$('#accountsInfoCaret').on('click', subAccountsItem.toggleAccountsCaret);
			$('#alertsInfoCaret').on('click', subAccountsItem.toggleAlertsCaret);
			$('#reportsInfoCaret').on('click', subAccountsItem.toggleReportsCaret);
			$('#featureCaret').on('click', subAccountsItem.toggleFeatureCaret);

			$('#expandAll').on('click', subAccountsItem.toggleExpandAll);
			$('#collapseAll').on('click', subAccountsItem.toggleCollapseAll);

			$('#accountAll_21').on('click', subAccountsItem.toggleAccountAll);
			$('#reportsAll_21').on('click', subAccountsItem.toggleReportAll);
			$('#alertsAll_21').on('click', subAccountsItem.toggleAlertAll);
			$('#prevAll_21').on('click', subAccountsItem.togglePermissionAll);

			$('#permissionNext, #saveAndVerify').on('click', CommonRole.next);
			$('label[id^="prevAll_21"]').on('click', CommonRole.toggleLabelCheckUncheck);
			$('label[id^="alertsAll_21"]').on('click', CommonRole.toggleLabelCheckUncheck);
			$('label[id^="accountAll_21"]').on('click', CommonRole.toggleLabelCheckUncheck);
			$('label[id^="lblImgSrvc_"]').on('click', CommonRole.toggleLabelCheckUncheck);
		}
	};

	RolesApp.bind('subAccountsServiceInit', subAccountsItem.init);

})(jQuery);