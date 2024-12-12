var objPayCompanyIdPopup = null;
var pkgDetails = null;
var collPkgDetails = null;
Ext.Loader.setConfig({
			enabled : true,
			setPath : {
				'Ext' : 'static/js/extjs4.2.1/src',
				'Ext.ux' : 'static/js/extjs4.2.1/src/ux'
			}
		});
Ext.application({
			name : 'CPON',
			appFolder : 'static/scripts/cpon/clientSetupMst/paymentService/app',
			requires : ['CPON.view.PayCompanyIDPopup','CPON.view.PkgAssignmentPopupView'],
			controllers : ['CPON.controller.ClientPayAccountServiceController'],
			launch : function() {
				if(popupClick == 'COMPANYCLICK')
				{
					getPayCompanyIdPopup();
				}
				else if(popupClick == 'PAYMENTCLICK')
				{
					attachPaymentMethodToAccount();
				}
				else if(popupClick == 'RECEIVABLECLICK')
				{
					attachReceivableMethodToAccount();
				}
				$('#popupClick').val('');
			}
		});


function getPayCompanyIdPopup() {
	objPayCompanyIdPopup = Ext.create('CPON.view.PayCompanyIDPopup');
	if(mode == 'ADD' && checkAccountMandatory())
	{
		document.getElementById("popupClick").value = "COMPANYCLICK" ;
		goToAccountPage('saveClientAccountMaster.form','frmMain');
	}
	else if(mode != 'ADD')
	{
		if (null != objPayCompanyIdPopup) {
			objPayCompanyIdPopup.show();
		}
	}
}
function saveItemsFn(popup) {
				var me = popup;
				var grid = me.down('smartgrid');
				var records = grid.selectedRecordList;
				var deSelected = grid.deSelectedRecordList;
				var strModuleCode =  me.module;
				var keyNode = me.keyNode;
				var arrayJson = new Array();
		for (var index = 0; index < records.length; index++) {
			arrayJson.push({
						serialNo :1,
						identifier : detailkey,
						userMessage : records[index][keyNode]
					});
		}
		for (var index = 0; index < deSelected.length; index++) {
			arrayJson.push({
						serialNo :0,
						identifier : detailkey,
						userMessage : deSelected[index][keyNode]
					});
		}
		if (arrayJson)
			arrayJson = arrayJson.sort(function(valA, valB) {
						return valA.serialNo - valB.serialNo
					});			
		if (records.length == 0) {
			arrayJson.push({
				serialNo : 1,
				identifier : detailkey,
				userMessage : null
			});
		}
		var strAccUrl = null;
		if(strModuleCode=='02')
		{
			strAccUrl = 'cpon/clientPayment/addAccPackageLinkage';	
		}
		if(strModuleCode=='05')
		{
			strAccUrl = 'cpon/clientCollection/addAccPackageLinkage';
		}		
		Ext.Ajax.request({
					url : strAccUrl,
					method : 'POST',
					params : {'id': parentkey},
					jsonData : Ext.encode(arrayJson),
					success : function(response) {
						me.close();
						var errorMessage = '';
						if (!Ext.isEmpty(response.responseText)) {
							var data = Ext.decode(response.responseText);
							if (!Ext.isEmpty(data))
							{
								if(!Ext.isEmpty(data.parentIdentifier))
								{
									parentkey = data.parentIdentifier;
									document.getElementById('viewState').value = data.parentIdentifier;
								}
								if(!Ext.isEmpty(data.listActionResult))
								{
							        Ext.each(data.listActionResult[0].errors, function(error, index) {
								         errorMessage = errorMessage +  error.code +' : '+ error.errorMessage +"<br/>";
								        });
								}
							}
							if ('' != errorMessage
									&& null != errorMessage) {
								Ext.MessageBox.show({
									title : getLabel(
											'instrumentErrorPopUpTitle',
											'Error'),
									msg : errorMessage,
									buttons : Ext.MessageBox.OK,
									icon : Ext.MessageBox.ERROR
								});
							}
						}
					},
					failure : function() {
						var errMsg = "";
						Ext.MessageBox.show({
									title : getLabel(
											'instrumentErrorPopUpTitle',
											'Error'),
									msg : getLabel('instrumentErrorPopUpMsg',
											'Error while fetching data..!'),
									buttons : Ext.MessageBox.OK,
									icon : Ext.MessageBox.ERROR
								});
					}
				});
				
				
			}
function checkAccountMandatory()
{
	var mandatoryFieldsArray = new Array();
	var i = 0;
	mandatoryFieldsArray[i++] = "acctType";
	mandatoryFieldsArray[i++] = "acctSubType";
	mandatoryFieldsArray[i++] = "acctNmbr";
	mandatoryFieldsArray[i++] = "orgAccName";
	for( var i = 0 ; i < mandatoryFieldsArray.length ; i++ )
	{
		if(document.getElementById(mandatoryFieldsArray[i]).value == null 
				|| document.getElementById(mandatoryFieldsArray[i]).value == "")
		{
			return false ;
			break;
		}
		else
		{
			return true ;
		}
	}
}
function serviceURLFn(popup) {
            var strUrl="";
            strUrl = strUrl + '&id=' + encodeURIComponent(parentkey);
			strUrl = strUrl + '&$select=' + popup.accountId;
			strUrl = strUrl + '&$mt101Applicable=' + mt101Applicable;
			strUrl = strUrl + '&$systemBankFlag=' + $("#hiddenService_systemBankFlag").val();
			return strUrl;
          }
function attachPaymentMethodToAccount()
{
	if(mode == 'ADD' && checkAccountMandatory())
	{
		document.getElementById("popupClick").value = "PAYMENTCLICK" ;
		goToAccountPage('saveClientAccountMaster.form','frmMain');
	}
	else if(mode != 'ADD')
	{
		pkgDetails = Ext.create('CPON.view.PkgAssignmentPopupView',
				{
					title :  getLabel('attachPaymentMethod','Attach Payment Package'),
					keyNode : 'packageId',
					itemId : 'pkgAssignmentPopup',
					checkboxId:'chkAllPaymentMethodSelectedFlag',
					responseNode :'accounts',
					cls : 'non-xn-popup',
					width : 650,
					maxWidth : 735,
					minHeight : 156,
					maxHeight : 550,
					draggable : false,
					resizable : false,
					cfgModel : {
					     pageSize : 5,
						storeModel : {
							fields : ['packageDesc', 'identifier', 'isAssigned',
								'packageId', 'allowAllPayAcctsFlag'],
					proxyUrl : 'cpon/clientPayment/availablePackages.json',
					rootNode : 'd.accounts',
					totalRowsNode : 'd.__count'
					      },
					columnModel : [{
										colDesc : getLabel('packageName', 'Package Name'),
										colId : 'packageDesc',
										colHeader : getLabel('packageName', 'Package Name'),
										sortable : false,
										width : 517
									}]
					   },
					cfgShowFilter:true,
					autoCompleterEmptyText : getLabel('payMethodNameSearch','Search by Payment Package Name'),
					 cfgAutoCompleterUrl:'availablePackages.json',
						cfgUrl:'cpon/clientPayment/{0}',
						paramName:'packageName',
						dataNode:'packageDesc',
						rootNode : 'd.accounts',
						autoCompleterExtraParam:
							[{
								key : 'id',
								value : encodeURIComponent(parentkey)
							}, {
								key : '$select',
								value : $("#accountId").val()
							}, {
								key : '$mt101Applicable',
								value : mt101Applicable
							}, {
								key : '$systemBankFlag',
								value : $("#hiddenService_systemBankFlag").val()
							}],
					module : '02',
					accountId : $("#accountId").val(),
					userMode: viewmode,
					savefnCallback :saveItemsFn,
					urlCallback :serviceURLFn
				});
		pkgDetails.show();
	}
}
function attachReceivableMethodToAccount()
{
	var pkgDetails = null;
	if(mode == 'ADD' && checkAccountMandatory())
	{
		document.getElementById("popupClick").value = "RECEIVABLECLICK" ;
		goToAccountPage('saveClientAccountMaster.form','frmMain');
	}
	else if(mode != 'ADD')
	{
		collPkgDetails = Ext.create('CPON.view.PkgAssignmentPopupView',
				{
					title :  getLabel('attachCollectionMethod','Attach Receivable Package'),
					keyNode : 'packageId',
					itemId : 'pkgAssignmentPopup',
					checkboxId:'chkAllReceivableMethodSelectedFlag',
					responseNode :'accounts',
					cls : 'non-xn-popup',
					width : 650,
					maxWidth : 735,
					minHeight : 156,
					maxHeight : 550,
					draggable : false,
					resizable : false,
					cfgModel : {
					     pageSize : 5,
						storeModel : {
							fields : ['packageDesc', 'identifier', 'isAssigned',
								'packageId', 'allowAllPayAcctsFlag'],
					proxyUrl : 'cpon/clientCollection/availableCollPackages.json',
					rootNode : 'd.accounts',
					totalRowsNode : 'd.__count'
					      },
					columnModel : [{
										colDesc : getLabel('collectionMethodName', 'Collection Method Name'),
										colId : 'packageDesc',
										colHeader : getLabel('collectionMethodName', 'Collection Method Name'),
										sortable : false,
										width : 517
									}]
					   },
					cfgShowFilter:true,
					autoCompleterEmptyText :  getLabel('searchByReceivableMethod','Search by Receivable Method Name'),
					 cfgAutoCompleterUrl:'availableCollPackages.json',
						cfgUrl:'cpon/clientCollection/{0}',
						paramName:'packageName',
						dataNode:'packageDesc',
						rootNode : 'd.accounts',
						autoCompleterExtraParam:
							[{
								key : 'id',
								value : encodeURIComponent(parentkey)
							}, {
								key : '$select',
								value : $("#accountId").val()
							}],
					module : '05',
					accountId : $("#accountId").val(),
					userMode: viewmode,
					savefnCallback :saveItemsFn,
					urlCallback :serviceURLFn
				});
				
		collPkgDetails.show();
	}
}