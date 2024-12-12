/**
 * @class bankAdminCategoryPrivilege_app
 * @author Nilesh Shinde
 */

var objAdminPrivilegePopup = null;
var objOnBehalfPrivilegePopup = null;
var objReportPrivilegePopup = null;
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
		'GCP.view.BankAdminPrivilegeView', 'GCP.view.BankAdminOnBehalfPrivilegeView',
		'GCP.view.BankAdminCategoryReportPrivilegePopup', 'Ext.util.MixedCollection', 'Ext.util.Filter','GCP.view.BankAdminCategoryInterfacePrivilegePopup'
	],
	controllers :
	[
		'GCP.controller.BankAdminPrivilegeViewController'
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
		strPrevilegeListUrl = strPrevilegeListUrl + "&" + "$viewState=" + viewState;
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
		objAdminPrivilegePopup = Ext.create( 'GCP.view.BankAdminPrivilegeView',
		{
			itemId : 'bankAdminCategoryAdminPrivilegePopupItemId',
			fnCallback : setSelectedAdminFeatureItems,
			renderTo: 'admPrvDiv',
			//profileId : brFeatureProfileId,
			//featureType : 'P',
			module : '04'
		//title : getLabel("brfeatureProfile", "BR Feature")
		} );

		objOnBehalfPrivilegePopup = Ext.create( 'GCP.view.BankAdminOnBehalfPrivilegeView',
		{
			itemId : 'bankAdminCategoryOnBehalfPrivilegePopupItemId',
			fnCallback : setSelectedAdminFeatureItems,
			renderTo: 'onBehalfPrvDiv',
			module : '04'
		} );

		objReportPrivilegePopup = Ext.create( 'GCP.view.BankAdminReportPrivilegeView',
		{
			itemId : 'bankAdminCategoryReportPrivilegePopupItemId',
			fnCallback : setSelectedAdminReportItems,
			renderTo: 'reportDiv',
			module : '04'
		} );
		
		objIntrefacePrivilegePopup = Ext.create( 'GCP.view.BankAdminInterfacePrivililegeView',
				{
					itemId : 'bankAdminCategoryInterfacePrivilegePopupItemId',
					fnCallback : setSelectedAdminInterfaceItems,
					renderTo: 'interfaceDiv',
					module : '04'
				} );
			
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
}

function getBankAdminCategoryReportPrivilegePopup()
{
	if( $( '#chkallPrivilagesSelectedFlag' ).attr( 'src' ) == 'static/images/icons/icon_checked.gif' )
	{
		var brCheckBoxes = objReportPrivilegePopup.query( 'checkbox' );
		for( var i = 0 ; i < brCheckBoxes.length ; i++ )
		{
			brCheckBoxes[ i ].setValue( true );
		}
		objReportPrivilegePopup.show();
	}
	else
	{
		var brCheckBoxes = objReportPrivilegePopup.query( 'checkbox' );
		for( var i = 0 ; i < brCheckBoxes.length ; i++ )
		{
			if( brCheckBoxes[ i ] != undefined )
			{
				if( brCheckBoxes[ i ].defVal !== true )
					brCheckBoxes[ i ].setValue( false );
			}
		}
		objReportPrivilegePopup.show();
	}
	objReportPrivilegePopup.center();
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

function setSelectedAdminInterfaceItems( selectedInterfaceCodes )
{
	document.getElementById( "selectedInterfaceCodes" ).value = JSON.stringify( selectedInterfaceCodes );
}