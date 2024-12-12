Ext.define('BANKUSER.controller.BankAdminUserSellerController', {
	extend : 'Ext.app.Controller',
	requires : ['BANKUSER.view.BankAdminUserSellerPopup','Ext.ux.gcp.FilterPopUpView'],
	refs : 
		[
	        {
				ref : 'userSellerView',
				selector : 'userSellerPopup[itemId=seller_list_view]'
			},
			 {
					ref : 'clientView',
					selector : 'filterPopUpView[itemId=client_view]'
				}, {
					ref : 'clientGrid',
					selector : 'filterPopUpView smartgrid[itemId=summaryGrid_client_view]'
				}
				
	    ],
	strUrl : '',
	userCLientMstSelectPopup : null,
	init : function() {
		var me = this;
		  showSellerList = function() {
				me.showSellerListPopup();
			  };
		serviceUrl =function (popupHandler) {
		  	var strUrl="";
		  	switch (popupHandler.service) {
		  	case 'clientCode' :
		  		strUrl	= '&userId=' + popupHandler.userId 
				//+ popupHandler.module ;
				break;
		  	}
		  	return strUrl
		};
		  saveMethod=function (popupHandler) {
				var popup = popupHandler;
				if (!Ext.isEmpty(popup)) {
					//if (mode != "VIEW")
						{
					
						 if (popup.itemId === 'client_view')
							me.handleCompanyClose();
						
						
						if (null != document
								.getElementById(popup.hiddenValuePopUpField)
								&& undefined != document
										.getElementById(popup.hiddenValuePopUpField)) {
							document
									.getElementById(popup.hiddenValuePopUpField).value = 'Y';
						}
						
						var checkValue=document.getElementById(popup.checkboxId);
						if(checkValue !=null && checkValue.getAttribute('src').indexOf('/icon_unchecked')!=-1){
					var grid = popup.down('smartgrid');
					var records = grid.selectedRecordList;
					var blnIsUnselected = records.length < grid.store
							.getTotalCount() ? true : false;
					
					if (popup.displayCount && !Ext.isEmpty(popup.fnCallback)
							&& typeof popup.fnCallback == 'function') {
						popup.fnCallback(records, blnIsUnselected);
						selectedr = [];
						
					}
					}
						
							popup.hide();
				
						}
					if (pageMode === "VIEW")
						 {
						popup.destroy();
					} 

					}
				};
			cancelMethod=function (popupHandler) {
				var popup = popupHandler;
				if (!Ext.isEmpty(popup)) {
					popup.destroy();
				}
				};
		BANKUSER.getApplication().on({
			showSellerList : function() {
				me.showSellerListPopup();
			},
			showClientIds : function() {
			me.getClientsPopup();
		}
		});
		me.control({});
	},
	getParamValues : function() {
		var me = this;
		var paramValues = {
			"viewState" : viewState,
			"loggedInSeller" : document.getElementById("sellerId").value
		};
		return paramValues;
	},
	setParamValuesToPopUpandRefreshGrid : function(popup) {
		var me = this;
		var paramValues = me.getParamValues();
		popup.viewState = paramValues.viewState;
		popup.loggedInSeller = paramValues.loggedInSeller;
		popup.handleSmartGridLoading();
	},
	handleCompanyClose : function() {
		var me = this;
		if (!Ext.isEmpty(me.getClientGrid())) {
			var gridRecords = me.getClientGrid().selectedRecordList;
			me.handleSelectedRecordsForClient(gridRecords);
		}
	},
	handleSelectedRecordsForClient : function(records) {
		var me = this;
		var objSelectedRecords= me.getClientGrid().selectedRecordList;
		var deSelectedRecord=me.getClientGrid().deSelectedRecordList;
		var objArray = new Array();
		var packageIds = '';
		for (var index = 0; index < objSelectedRecords.length; index++) {
			var objArrayLocal = new Array();
			var ClientCode = objSelectedRecords[index]['clientCode'];
			var clientDesc = objSelectedRecords[index]['clientDesc'];
			var identifier = objSelectedRecords[index]['identifier'];
			var assigned = true;
			if(assigned != null){
					objArrayLocal.push({
						"clientCode": ClientCode,
						"clientDesc": clientDesc,
						"identifier": identifier,
						"assigned": assigned
					});
			}
			objArray.push(objArrayLocal);
		}
		for (var index = 0; index < deSelectedRecord.length; index++) {
			var objArrayLocal = new Array();
			var ClientCode = deSelectedRecord[index]['clientCode'];
			var clientDesc = deSelectedRecord[index]['clientDesc'];
			var identifier = deSelectedRecord[index]['identifier'];
			var assigned = false;
			if(assigned != null){
					objArrayLocal.push({
						"clientCode": ClientCode,
						"clientDesc": clientDesc,
						"identifier": identifier,
						"assigned": assigned
					});
			}
			objArray.push(objArrayLocal);
		}
		if (!Ext.isEmpty(objArray)) {
			if (!Ext.isEmpty(document.getElementById('selectedClientIds')))
				document.getElementById('selectedClientIds').value = Ext.encode(objArray);			
		}
	},
	getClientsPopup :function()
	{
		
		var me = this;
		me.Module = "";
		var localIsAllAssigned = $('#allCompanyIdSelectedFlag').val();
		var module = '';
		var userMstSelectPopup = me.userCLientMstSelectPopup;
		if (Ext.isEmpty(userMstSelectPopup)) {
			var colModel = [{
						colId : 'clientDesc',
						colDesc : 'Company Name',
						colHeader : 'Company Name'
					}, {
						colId : 'assignmentStatus',
						colDesc : 'Status',
						colHeader : 'Status'
					}];
			var storeModel = {
				fields : ['isAssigned', 'assignmentStatus',
						'clientDesc',  'clientCode',
						'identifier'],
				proxyUrl : 'services/bankAdminUser/clientList.json',
				rootNode : 'd.details',
				totalRowsNode : 'd.__count'
			};
			userMstSelectPopup = Ext.create('Ext.ux.gcp.FilterPopUpView', {
				title :'Select Client',
				isAllSelected : localIsAllAssigned,
				keyNode : 'clientCode',
				itemId : 'client_view',
				service : 'clientCode',
				checkboxId:'chkAllClientSelectedFlag',
				displayCount : false,
				cfgModel : {
				     pageSize : 5,
					storeModel : storeModel,
					columnModel : colModel
				   },
				
				   cfgFilterLabel:'client',
				       cfgAutoCompleterUrl:'clientList',
				   cfgUrl : 'services/bankAdminUser/clientList.json',
				   paramName:'filterName',
					dataNode:'clientDesc',
					rootNode : 'd.details',
					autoCompleterExtraParam:
						[{
							//key:'&module',value: module
							//key:'&userId',value: userId						
						}],
				

				   cfgShowFilter : true,
				   userMode : pageMode,
				   userId : srcUserRecKey,
				   module : module,
				   hiddenValueField : 'selectedClientIds',
				   hiddenValuePopUpField :'popupCompanyIdsSelectedFlag',
				   savefnCallback :saveMethod,
				   urlCallback :serviceUrl,
				   cancelfnCallback :cancelMethod
			});
			if(pageMode != "VIEW")
			me.userCLientMstSelectPopup = userMstSelectPopup;
		} 
		userMstSelectPopup.show();
	},
	showSellerListPopup : function() {
		var me = this;
		var userSelectPopup = null;
		var paramValues = me.getParamValues();

		var popUpId = 'seller_list_view';

		userSelectPopup = me.getUserSellerView();

		if (null == userSelectPopup) {
			userSelectPopup = Ext.create(
						'BANKUSER.view.BankAdminUserSellerPopup', {
							title : "Select Financial Institution",
							searchFlag : false,
							keyNode : 'entitlementName',
							itemId : popUpId,
							viewState : paramValues.viewState,
							loggedInSeller : paramValues.loggedInSeller,
							isAllAssigned : 'N'
						});
			userSelectPopup.show();
			} else {
				me.setParamValuesToPopUpandRefreshGrid(userSelectPopup);
				userSelectPopup.show();
			}
	}
});

function getClientIds(module) {
	BANKUSER.getApplication().fireEvent('showClientIds', module);
}

function getSellerListPopup() {
	//GCP.getApplication().fireEvent('showSellerList');
	showSellerList();
}
