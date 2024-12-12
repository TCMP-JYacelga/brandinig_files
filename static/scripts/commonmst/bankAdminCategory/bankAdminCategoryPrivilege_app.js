/**
 * @class bankAdminCategoryPrivilege_app
 * @author Nilesh Shinde
 */

var objAdminPrivilegePopup = null;
var objOnBehalfPrivilegePopup = null;
var objReportPrivilegePopup = null;
var userMessageMstSelectPopup = null;
var fieldJson = [];
var viewSerials = {};
var authSerials = {};
var editSerials = {};
var menuDataa,featureDataa;
Ext.Loader.setConfig(
{
	enabled : true,
	setPath :
	{
		'Ext' : 'static/js/extjs4.2.1/src',
		'Ext.ux' : 'static/js/extjs4.2.1/src/ux'
	}
} );

Ext.application(
{
	name : 'GCP',
	appFolder : 'static/scripts/commonmst/bankAdminCategory/app',
	requires :
	[
		'GCP.view.BankAdminCategoryAdminPrivilegePopup', 'GCP.view.BankAdminCategoryOnBehalfPrivilegePopup',
		'GCP.view.BankAdminCategoryReportPrivilegePopup', 'Ext.util.MixedCollection', 'Ext.util.Filter','GCP.view.BankAdminCategoryInterfacePrivilegePopup'
	],
	controllers :
	[
		'GCP.controller.BankAdminCategoryPrivilegeController'
	],

	launch : function()
	{
		//
		var me = this;
		var strMenuListUrl = 'getBankAdminMenuList.srvc?';
		var objParam = {}, arrMatches, strRegex = /[?&]([^=#]+)=([^&#]*)/g;
		strMenuListUrl = strMenuListUrl + '$accessType=' + 'B';
		strMenuListUrl = strMenuListUrl + "&" + '$menuMode=CW';
		strMenuListUrl = strMenuListUrl + '&' + csrfTokenName + '=' + csrfTokenValue;
         while (arrMatches = strRegex.exec(strMenuListUrl)) {
					objParam[arrMatches[1]] = arrMatches[2];
				}
		var strGeneratedUrl = strMenuListUrl.substring(0, strMenuListUrl.indexOf('?'));
				strMenuListUrl = strGeneratedUrl;

		Ext.Ajax.request(
		{
			url : strMenuListUrl,
			method : 'POST',
			async : false,
			params:objParam,
			success : function( response )
			{
				menuDataa = Ext.JSON.decode( response.responseText );
				return menuDataa;
			},
			failure : function()
			{
				var errMsg = "";
				Ext.MessageBox.show(
				{
					title : getLabel( 'instrumentErrorPopUpTitle', 'Error' ),
					msg : getLabel( 'instrumentErrorPopUpMsg', 'Error while fetching data..!' ),
					buttons : Ext.MessageBox.OK,
					icon : Ext.MessageBox.ERROR
				} );
			}
		} );
		//
		//
		var objParam = {}, arrMatches, strRegex = /[?&]([^=#]+)=([^&#]*)/g;
		var strPrevilegeListUrl = 'getBankAdminPrevilegeList.srvc?';
		strPrevilegeListUrl = strPrevilegeListUrl + "$accessType=B";
		strPrevilegeListUrl = strPrevilegeListUrl + "&" + "$moduleCode=ALL";
		strPrevilegeListUrl = strPrevilegeListUrl + "&" + "$menuMode=CW";
		strPrevilegeListUrl = strPrevilegeListUrl + "&" + "$accessTypeCode=ALL";
		strPrevilegeListUrl = strPrevilegeListUrl + "&" + "$viewState=" +  viewState ;
		strPrevilegeListUrl = strPrevilegeListUrl + "&" + csrfTokenName + "=" + csrfTokenValue;
         while (arrMatches = strRegex.exec(strPrevilegeListUrl)) {
					objParam[arrMatches[1]] = arrMatches[2];
				}
		var strGeneratedUrl = strPrevilegeListUrl.substring(0, strPrevilegeListUrl.indexOf('?'));
				strPrevilegeListUrl = strGeneratedUrl;

		Ext.Ajax.request(
		{
			url : strPrevilegeListUrl,
			method : 'POST',
			async : false,
			params:objParam,
			success : function( response )
			{
				featureDataa = Ext.JSON.decode( response.responseText );
				return featureDataa;
			},
			failure : function()
			{
				var errMsg = "";
				Ext.MessageBox.show(
				{
					title : getLabel( 'instrumentErrorPopUpTitle', 'Error' ),
					msg : getLabel( 'instrumentErrorPopUpMsg', 'Error while fetching data..!' ),
					buttons : Ext.MessageBox.OK,
					icon : Ext.MessageBox.ERROR
				} );
			}
		} );
		//
		objAdminPrivilegePopup = Ext.create( 'GCP.view.BankAdminCategoryAdminPrivilegePopup',
		{
			itemId : 'bankAdminCategoryAdminPrivilegePopupItemId',
			fnCallback : setSelectedAdminFeatureItems,
			//profileId : brFeatureProfileId,
			//featureType : 'P',
			module : '04'
		//title : getLabel("brfeatureProfile", "BR Feature")
		} );
		objAdminPrivilegePopup.center();		

		objOnBehalfPrivilegePopup = Ext.create( 'GCP.view.BankAdminCategoryOnBehalfPrivilegePopup',
		{
			itemId : 'bankAdminCategoryOnBehalfPrivilegePopupItemId',
			fnCallback : setSelectedAdminFeatureItems,
			module : '04'
		} );
		objOnBehalfPrivilegePopup.center();

		objReportPrivilegePopup = Ext.create( 'GCP.view.BankAdminCategoryReportPrivilegePopup',
		{
			itemId : 'bankAdminCategoryReportPrivilegePopupItemId',
			fnCallback : setSelectedAdminReportItems,
			module : '04'
		} );
		objReportPrivilegePopup.center();
		
		objIntrefacePrivilegePopup = Ext.create( 'GCP.view.BankAdminCategoryInterfacePrivilegePopup',
		{
			itemId : 'bankAdminCategoryInterfacePrivilegePopupItemId',
			fnCallback : setSelectedAdminInterfaceItems,
			module : '04'
		} );
		objIntrefacePrivilegePopup.center();
		blockBankRolePermUI(false);
	}
} );

function getBankAdminCategoryAdminPrivilegePopup()
{
	if( $( '#chkallPrivilagesSelectedFlag' ).attr( 'src' ) == 'static/images/icons/icon_checked.gif' )
	{
		var brCheckBoxes = objAdminPrivilegePopup.query( 'checkbox' );
		for( var i = 0 ; i < brCheckBoxes.length ; i++ )
		{
			brCheckBoxes[ i ].setValue( true );
		}
		objAdminPrivilegePopup.show();
	}
	else
	{
		var brCheckBoxes = objAdminPrivilegePopup.query( 'checkbox' );
		for( var i = 0 ; i < brCheckBoxes.length ; i++ )
		{
			if( brCheckBoxes[ i ] != undefined )
			{
				if( brCheckBoxes[ i ].defVal !== true )
					brCheckBoxes[ i ].setValue( false );
			}
		}
		objAdminPrivilegePopup.show();
	}
	objAdminPrivilegePopup.center();
	if(higlightOldnewValue && screenMode == 'PERMISSIONS' && null != adminPrivilegeOldNewValueList){
	   paintPrivilageOldNewValueList(adminPrivilegeOldNewValueList);
	}
}

function getBankAdminCategoryOnBehalfPrivilegePopup()
{
	if( $( '#chkallPrivilagesSelectedFlag' ).attr( 'src' ) == 'static/images/icons/icon_checked.gif' )
	{
		var brCheckBoxes = objOnBehalfPrivilegePopup.query( 'checkbox' );
		for( var i = 0 ; i < brCheckBoxes.length ; i++ )
		{
			brCheckBoxes[ i ].setValue( true );
		}
		objOnBehalfPrivilegePopup.show();
	}
	else
	{
		var brCheckBoxes = objOnBehalfPrivilegePopup.query( 'checkbox' );
		for( var i = 0 ; i < brCheckBoxes.length ; i++ )
		{
			if( brCheckBoxes[ i ] != undefined )
			{
				if( brCheckBoxes[ i ].defVal !== true )
					brCheckBoxes[ i ].setValue( false );
			}
		}
		objOnBehalfPrivilegePopup.show();
	}
	objOnBehalfPrivilegePopup.center();
	if(higlightOldnewValue && screenMode == 'PERMISSIONS' && null != adminPrivilegeOldNewValueList){
       paintPrivilageOldNewValueList(adminPrivilegeOldNewValueList);
    }
}

function getBankAdminCategoryReportPrivilegePopup()
{
	objReportPrivilegePopup.show();
	objReportPrivilegePopup.center();
	if(higlightOldnewValue && screenMode == 'PERMISSIONS' && null != reportPrevilegeOldNewDiffLst){
           paintPrivilageOldNewValueList(reportPrevilegeOldNewDiffLst);
    }
}

function getBankAdminCategoryInterfacePrivilegePopup()
{
	var brCheckBoxes = objIntrefacePrivilegePopup.query( 'checkbox' );
	for( var i = 0 ; i < brCheckBoxes.length ; i++ )
	{
		if( brCheckBoxes[ i ] != undefined )
		{
			if( brCheckBoxes[ i ].defVal !== true )
				brCheckBoxes[ i ].setValue( false );
		}
	}
	objIntrefacePrivilegePopup.show();
	objIntrefacePrivilegePopup.center();
}

function getBankAdminCategoryInterfacePrivilegePopup(strSrc)
{
	var isChkInterface = false;
	if(allowAllInterface === 'Y')
	{
		var imgElement = document.getElementById('chkAllInterfaceImg');
		if (imgElement.src.indexOf("icon_checked.gif") > -1 || imgElement.src.indexOf("icon_checked_grey.gif") > -1 )
		{
			if(strSrc != null && strSrc === 'ALL' && pageMode === 'EDIT')
			{
				imgElement.src = "static/images/icons/icon_unchecked.gif";
				isChkInterface = false;
			}
			else
				isChkInterface = true;
		}
		else
		{
			if(strSrc != null && strSrc === 'ALL' && pageMode === 'EDIT')
			{
				imgElement.src = "static/images/icons/icon_checked.gif";
				isChkInterface = true;
			}
			else
				isChkInterface = false;
		}
	}
	var brCheckBoxes = objIntrefacePrivilegePopup.query( 'checkbox' );
		for( var i = 0 ; i < brCheckBoxes.length ; i++ )
		{
			if( brCheckBoxes[ i ] != undefined )
			{		
				if(allowAllInterface === 'Y')
				{
					if(strSrc != null && strSrc === 'ALL' && isChkInterface == false)
					{
						brCheckBoxes[ i ].setValue( isChkInterface );
						brCheckBoxes[ i ].disabled = false;
						brCheckBoxes[ i ].readOnly=false;
					}
					else if(isChkInterface)
						brCheckBoxes[ i ].setValue( isChkInterface );
					
					if(brCheckBoxes[ i ].defVal !== true && brCheckBoxes[ i ].checked !== true)
						brCheckBoxes[ i ].setValue( isChkInterface );
					else if(brCheckBoxes[ i ].defVal !== true && brCheckBoxes[ i ].checked == true)
						brCheckBoxes[ i ].setValue( true );	
					
						if(isChkInterface || pageMode !== 'EDIT')
							brCheckBoxes[i].readOnly = true;
						else
						{
							brCheckBoxes[ i ].setDisabled(false);
							brCheckBoxes[ i ].readOnly = false;
						}
						if(pageMode == 'EDIT' && (strSrc == '' || strSrc == null) && imgElement.src.indexOf("icon_unchecked.gif") > -1 )
						{
							brCheckBoxes[ i ].setDisabled(false);
							brCheckBoxes[ i ].readOnly = false;
							
						}
				}
				else
				{
				if( brCheckBoxes[ i ].defVal !== true)
					brCheckBoxes[ i ].setValue( isChkInterface );
				}
			}
		}
	if(strSrc == '' || strSrc == null)
	{
		objIntrefacePrivilegePopup.show();
		objIntrefacePrivilegePopup.center();
	}
    if(higlightOldnewValue && screenMode == 'PERMISSIONS' && null != interfacePrevilegeOldNewDiffLst){
           paintPrivilageOldNewValueList(interfacePrevilegeOldNewDiffLst);
    }
}

function setSelectedAdminFeatureItems( viewSerials, authSerials, editSerials )
{
	document.getElementById( "viewRightsSerials" ).value = JSON.stringify( viewSerials );
	document.getElementById( "editRightsSerials" ).value = JSON.stringify( editSerials );
	document.getElementById( "authRightsSerials" ).value = JSON.stringify( authSerials );
}

function setSelectedAdminReportItems( selectedReportCodes )
{
	document.getElementById( "selectedReportCodes" ).value = JSON.stringify( selectedReportCodes );
}

function getMsgDestinationPopup() {
	if("Y" == messageApplicable) {
	GCP.getApplication().fireEvent('showMsgDestinationPopup');
	}
}

function setSelectedAdminInterfaceItems( selectedInterfaceCodes )
{
	document.getElementById( "selectedInterfaceCodes" ).value = JSON.stringify( selectedInterfaceCodes );
}

function blockBankRolePermUI(blnBlock) 
{
	if (blnBlock === true) {
		$("#pageContentDiv").addClass('hidden');
		$('#blockUIDiv').removeClass('hidden');
		$('#blockUIDiv').block({
			overlayCSS : {
				opacity : 0
			},
			baseZ : 2000,
			message : '<div id="loadingMsg"><img src="static/styles/Themes/t7-main/resources/images/T7/loading.gif" style="background-position: left center;width:30px;height:30px;"/><span style="vertical-align: text-top; margin-left: 5px;">Loading...</span></div>',
			css : {
			}
		});
	} else {
		$("#pageContentDiv").removeClass('hidden');
		$('#blockUIDiv').addClass('hidden');
		$('#blockUIDiv').unblock();
	}
}

function paintPrivilageOldNewValueList(oldNewValueList){
        $.each(oldNewValueList, function (key, val) {
             $.each(val, function(innerKey, innerValue) {
                if("canView" == innerValue){
                      $("#"+key+"_VIEW tr").addClass('checkboxtick');
                }
                else if("canViewDeleted" == innerValue){
                      $("#"+key+"_VIEW tr").addClass('checkboxuntick');
                }
                if("canEdit" == innerValue){
                      $("#"+key+"_EDIT tr").addClass('checkboxtick');
                }
                else if("canEditDeleted" == innerValue){
                      $("#"+key+"_EDIT tr").addClass('checkboxuntick');
                }
                if("canAuth" == innerValue){
                      $("#"+key+"_AUTH tr").addClass('checkboxtick');
                }
                else if("canAuthDeleted" == innerValue){
                      $("#"+key+"_AUTH tr").addClass('checkboxuntick');
                }
                if("canExecute" == innerValue){
                      $("#"+key+"_EXECUTE tr").addClass('checkboxtick');
                }
                else if("canExecuteDeleted" == innerValue){
                      $("#"+key+"_EXECUTE tr").addClass('checkboxuntick');
                }
             });
        });
}