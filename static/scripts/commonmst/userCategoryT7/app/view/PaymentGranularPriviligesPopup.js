var granularPrivfieldJson = [];
var isFilterApplied = false;
var featureMap = {};
var accountAssignedMap = {};
var payPackageAssignedMap = {};
var allAccountsSelectedFlag = 'N';
var allPackagesSelectedFlag = 'N';
var granularPageNo = 1;
var granularCount = 1;
var granularPageSize = 10;
var granularTotalPage = 1;
var granularTotalNumberOfRecord = 1;
var granularPrivfieldJsonTemp = [];
var jsonArrayGlobal = [];

var totalPaymentRecordFrmServer = 1;
var totalPaymentDisplay = 50;
var totalPaymentRecordsDisplay = [];
var currentPaymentBunchOfPage = 0;
var granularPaymentOverAllTTotalPage = 1;
var granularPaymentOverAllTPageNo = 1;
var prevPaymentRecordMaxCount=0;
var nextPaymentMinRecordCount=0;
var numberPaymentRecordsToDisplay = 0;
var granularTotalRecordPage;
var navigationVisible=true;

var totalNumberPaymentRecordsDisplayed = 0;
Ext.define('GCP.view.PaymentGranularPriviligesPopup', {
	extend: 'Ext.window.Window',
	xtype: 'paymentGranularPriviligesPopup',
	minWidth : 400,
	maxWidth : 735,
	minHeight : 156,
	maxHeight : 550,
	overflowY: 'auto',
	overflowX: 'auto',
	cls : 'xn-popup',
	title: getLabel('paymentGranularPrivilege','Payment Granular Privileges'),
	config: {
		modal : true,
		draggable : false,
		resizable:false,
		closeAction : 'hide',
		autoScroll : true,
		fnCallback : null,
		profileId : null,
		featureType : null,
		module : null,
		title : null
	},
	listeners : {
	'resize':function(){
		this.center();
	},
	'afterrender' : function() {
			if (this.header.body.dom.firstElementChild.clientWidth != this.header.body.dom.firstElementChild.firstElementChild.clientWidth) {
				this.header.body.dom.firstElementChild.firstElementChild.className = "";
			}
		}
	},
	
	loadGranularFeaturs: function() {
	var me = this;
		if(mode === "VIEW"){
				Ext.Ajax.request({
					url : 'services/userCategory/accountPackagePrivileges.json',
					method : 'POST',
					async: false,
					params : { module: '02',categoryId:userCategory,serviceType:'PAY'},
					success : function(response) {
					 	 payGranularFeatureData = Ext.JSON.decode(response.responseText);
						return payGranularFeatureData; 
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
		
		return payGranularFeatureData;
	},
	filterFeatures: function(data) {
	   var allFeatures = new Ext.util.MixedCollection();
	   allFeatures.addAll(data);
	   // var featurs = allFeatures.filter(featureFilter);
		return allFeatures.items;
	},
	getBooleanvalue : function(strValue)
	{
		if(strValue == 'Y' || strValue == true)
		{
			return true;
		}
		else
		{
			return false;
		}
	},
	setColumnHeader : function(serviceType) {
		var featureItems = [];
		featureItems.push({
			xtype : 'label',
			text : getLabel("lbl.type", "Type"),
			padding : '0 0 0 0',
			cls : 'boldText label-lineHeight granular-privilege-label privilege-grid-main-header privilege-grid-type-label granular-payprivilege-type'
		});

		if (featureMap["PYB_41"] != undefined) {
			if (featureMap["PYB_41"].canView == 'Y') {
				featureItems.push({
					xtype : 'label',
					text : getLabel("view", "View"),
					padding : '0 0 0 5',
					cls : 'boldText label-lineHeight granular-privilege-label privilege-grid-main-header granular-privilege-main-headers'
				});
			}
			if (featureMap["PYB_41"].canEdit == 'Y') {
				featureItems.push({
					xtype : 'label',
					text : getLabel("edit", "Edit"),
					padding : '0 0 0 5',
					cls : 'boldText label-lineHeight granular-privilege-label privilege-grid-main-header granular-privilege-main-headers'
				});

			}
		}
		if (featureMap["PYB_381"] != undefined
				&& featureMap["PYB_381"].canEdit == 'Y') {
			featureItems.push({
				xtype : 'label',
				text : getLabel("delete", "Delete"),
				padding : '0 0 0 5',
				cls : 'boldText label-lineHeight granular-privilege-label privilege-grid-main-header granular-privilege-main-headers'
			});

		}
		
		// recall modified to Modify
		if (featureMap["PYB_364"] != undefined) {
			if (featureMap["PYB_364"].canEdit == 'Y') {
				featureItems.push({
					xtype : 'label',
					text : getLabel("lblmodify", "Modify"),
					padding : '0 0 0 5',
					cls : 'boldText label-lineHeight granular-privilege-label privilege-grid-main-header granular-privilege-main-headers'
				});

				// featureItems.push({xtype: 'label',columnWidth:0.0875,text:
				// "Delete",padding:'0 0 0 5',cls:'boldText background'});
			}
		}
		
		if (featureMap["PYB_41"] != undefined) {
			if (featureMap["PYB_41"].canAuth == 'Y') {
				featureItems.push({
					xtype : 'label',
					text : getLabel("quickApprove", "Quick Approve"),
					padding : '0 0 0 5',
					cls : 'boldText label-lineHeight granular-privilege-label privilege-grid-main-header granular-privilege-main-headers'
				});
			}
		}

		if (featureMap["PYB_363"] != undefined) {
			if (featureMap["PYB_363"].canAuth == 'Y') {
				featureItems.push({
					xtype : 'label',
					text : getLabel("detailApprove", "Detail Approve"),
					padding : '0 0 0 5',
					cls : 'boldText label-lineHeight granular-privilege-label privilege-grid-main-header granular-privilege-main-headers'
				});
			}
		}
		
		if (featureMap["PYB_380"] != undefined) {
			if (featureMap["PYB_380"].canEdit == 'Y') {
				featureItems.push({
					xtype : 'label',
					text : getLabel("import", "Import"),
					padding : '0 0 0 5',
					cls : 'boldText label-lineHeight granular-privilege-label privilege-grid-main-header granular-privilege-main-headers'
				});
			}
		}

		if (featureMap["STPP_46"] != undefined) {
			if (featureMap["STPP_46"].canEdit == 'Y') {
				featureItems.push({
					xtype : 'label',
					text : getLabel("canel", "Cancel"),
					padding : '0 0 0 5',
					cls : 'boldText label-lineHeight granular-privilege-label privilege-grid-main-header granular-privilege-main-headers'
				});
			}
			if (featureMap["STPP_46"].canAuth == 'Y') {
				featureItems.push({
					xtype : 'label',
					text : getLabel("cancelApprove", "Cancel Approve"),
					padding : '0 0 0 5',
					cls : 'boldText label-lineHeight granular-privilege-label privilege-grid-main-header granular-privilege-main-headers'
				});
			}
		}

		return featureItems;
	},
	setPanelHeader : function(id, title)
	{
		var featureItems = [];
		featureItems.push({
			xtype : 'label',
			text : getLabel('lbl.account', 'Account'),
			padding : '8 0 0 10',
			cls : 'boldText granular-privilege-accountno granular-privilege-account-header',
			height : 50
		});
		featureItems.push({
			xtype : 'label',
			text : getLabel('accountName', 'Account Name'),
			padding : '8 0 0 0',
			cls : 'boldText granular-privilege-accountno granular-privilege-account-header',
			height : 50
		});
		featureItems.push({
			xtype : 'label',
			text : getLabel('lbl.paymentPackage', 'Payment Package'),
			padding : '8 0 0 10',
			cls : 'boldText granular-privilege-headers granular-privilege-account-header',
			height : 50
		});

		if (featureMap["PYB_41"] != undefined) {
			if (featureMap["PYB_41"].canView == 'Y') {
				/*
				 * featureItems.push({xtype: 'button',icon:
				 * "./static/images/icons/icon_uncheckmulti.gif",margin: '5 5 2
				 * 29',width : 10, height : 20, itemId : id+"_viewIcon", border :
				 * 0,cls:'btn'});
				 */
				featureItems.push({
					xtype : 'panel',
					cls : 'privilege-grid-main-header granular-privilege-headers',
					text : title,
					padding : '5 0 0 10',
					items : [{
								xtype : 'checkbox',
								margin : '2 5 2 28',
								width : 10,
								height : 20,
								itemId : id + "_viewIcon",
								border : 0,
								disabled : (mode == "VIEW") ? true : false
							}]
				});
			}
			if (featureMap["PYB_41"].canEdit == 'Y') {
				/*
				 * featureItems.push({xtype: 'button',icon:
				 * "./static/images/icons/icon_uncheckmulti.gif",margin: '5 5 2
				 * 62',width : 10, height : 20, itemId : id+"_editIcon", border :
				 * 0,cls:'btn'}); }
				 */
				featureItems.push({
					xtype : 'panel',
					cls : 'privilege-grid-main-header granular-privilege-headers',
					text : title,
					padding : '5 0 0 10',
					items : [{
								xtype : 'checkbox',
								margin : '2 5 2 28',
								width : 10,
								height : 20,
								itemId : id + "_editIcon",
								border : 0,
								disabled : (mode == "VIEW") ? true : false
							}]
				});
			}
		}
		
		if (featureMap["PYB_381"] != undefined
				&& featureMap["PYB_381"].canEdit === 'Y') {
			featureItems.push({
						xtype : 'panel',
						cls : 'privilege-grid-main-header granular-privilege-headers',
						text : title,
						padding : '5 0 0 10',
						items : [{
									xtype : 'checkbox',
									margin : '2 5 2 28',
									width : 10,
									height : 20,
									itemId : id + "_deleteIcon",
									border : 0,
									disabled : (mode == "VIEW") ? true : false
								}]
					});
		}
		if (featureMap["PYB_364"] != undefined) {
			if (featureMap["PYB_364"].canEdit == 'Y') {
				/*
				 * featureItems.push({xtype: 'button',icon:
				 * "./static/images/icons/icon_uncheckmulti.gif",margin: '5 5 2
				 * 63',width : 10, height : 20, itemId : id+"_recallIcon",
				 * border : 0,cls:'btn'});
				 */
				featureItems.push({
					xtype : 'panel',
					cls : 'privilege-grid-main-header granular-privilege-headers',
					text : title,
					padding : '5 0 0 10',
					items : [{
								xtype : 'checkbox',
								margin : '2 5 2 28',
								width : 10,
								height : 20,
								itemId : id + "_recallIcon",
								border : 0,
								disabled : (mode == "VIEW") ? true : false
							}]
				});
			}
		}
		/*
		 * featureItems.push({xtype: 'button',columnWidth:0.0875,icon:
		 * "./static/images/icons/icon_uncheckmulti.gif",margin: '5 5 2
		 * 65',width : 10, height : 20, itemId : id+"_deleteIcon", border :
		 * 0,cls:'btn'});
		 */
		if (featureMap["PYB_41"] != undefined) {
			if (featureMap["PYB_41"].canAuth == 'Y') {
				/*
				 * featureItems.push({xtype: 'button',icon:
				 * "./static/images/icons/icon_uncheckmulti.gif",margin: '5 5 2
				 * 62',width : 10, height : 20, itemId : id+"_authIcon", border :
				 * 0,cls:'btn'});
				 */
				featureItems.push({
					xtype : 'panel',
					cls : 'privilege-grid-main-header granular-privilege-headers',
					text : title,
					padding : '5 0 0 10',
					items : [{
								xtype : 'checkbox',
								margin : '2 5 2 28',
								width : 10,
								height : 20,
								itemId : id + "_authIcon",
								border : 0,
								disabled : (mode == "VIEW") ? true : false
							}]
				});
			}
		}

		if (featureMap["PYB_363"] != undefined) {
			if (featureMap["PYB_363"].canAuth == 'Y') {
				/*
				 * featureItems.push({xtype: 'button',icon:
				 * "./static/images/icons/icon_uncheckmulti.gif",margin: '5 5 2
				 * 63',width : 10, height : 20, itemId : id+"_quickApproveIcon",
				 * border : 0,cls:'btn'});
				 */
				featureItems.push({
					xtype : 'panel',
					cls : 'privilege-grid-main-header granular-privilege-headers',
					text : title,
					padding : '5 0 0 10',
					items : [{
								xtype : 'checkbox',
								margin : '2 5 2 28',
								width : 10,
								height : 20,
								itemId : id + "_quickApproveIcon",
								border : 0,
								disabled : (mode == "VIEW") ? true : false
							}]
				});
			}
		}
		
		if (featureMap["PYB_380"] != undefined
				&& featureMap["PYB_380"].canEdit === 'Y') {
			featureItems.push({
						xtype : 'panel',
						cls : 'privilege-grid-main-header granular-privilege-headers',
						text : title,
						padding : '5 0 0 10',
						items : [{
									xtype : 'checkbox',
									margin : '2 5 2 28',
									width : 10,
									height : 20,
									itemId : id + "_importIcon",
									border : 0,
									disabled : (mode == "VIEW") ? true : false
								}]
					});
		}

		if (featureMap["STPP_46"] != undefined) {
			if (featureMap["STPP_46"].canEdit == 'Y') {
				/*
				 * featureItems.push({xtype: 'button',icon:
				 * "./static/images/icons/icon_uncheckmulti.gif",margin: '5 5 2
				 * 62',width : 10, height : 20, itemId : id+"_cancelIcon",
				 * border : 0,cls:'btn'});
				 */
				featureItems.push({
					xtype : 'panel',
					cls : 'privilege-grid-main-header granular-privilege-headers',
					text : title,
					padding : '5 0 0 10',
					items : [{
								xtype : 'checkbox',
								margin : '2 5 2 28',
								width : 10,
								height : 20,
								itemId : id + "_cancelIcon",
								border : 0,
								disabled : (mode == "VIEW") ? true : false
							}]
				});
				
			}
			if (featureMap["STPP_46"].canAuth == 'Y') {
				/*featureItems.push({xtype: 'button',icon: "./static/images/icons/icon_uncheckmulti.gif",margin: '5 5 2 63',width : 10, height : 20, itemId : id+"_cancelApproveIcon", border : 0,cls:'btn'});*/
				featureItems.push({
					xtype : 'panel',
					cls : 'privilege-grid-main-header granular-privilege-headers',
					text : title,
					padding : '5 0 0 10',
					items : [{
								xtype : 'checkbox',
								margin : '2 5 2 28',
								width : 10,
								height : 20,
								itemId : id + "_cancelApproveIcon",
								border : 0,
								disabled : (mode == "VIEW") ? true : false
							}]
				});
			}
		}
		
		return featureItems;
	},
	setPriviligeMenu : function(feature, MODE, index, flag) {
		var obj = new Object();
		if(Ext.isEmpty(flag))
			flag = false;
		if (MODE == 'VIEW') {
			obj.checked = this.getBooleanvalue(feature.viewFlag);
		} else if (MODE == 'EDIT') {
			obj.checked = this.getBooleanvalue(feature.editFlag);
		} else if (MODE == 'AUTH') {
			obj.checked = this.getBooleanvalue(feature.approveFlag);
		} else if (MODE == 'QUICKAPPROVE') {
			obj.checked = this.getBooleanvalue(feature.quickApproveFlag);
		} else if (MODE == 'IMPORT') {
			obj.checked = this.getBooleanvalue(feature.importFlag);
		} else if (MODE == 'RECALL') {
			obj.checked = this.getBooleanvalue(feature.recallFlag);
		} else if (MODE == 'CANCEL') {
			obj.checked = this.getBooleanvalue(feature.cancelFlag);
		} else if (MODE == 'CANCELAPPROVE') {
			obj.checked = this.getBooleanvalue(feature.cancelApproveFlag);
		} else if (MODE == 'DELETE') {
			obj.checked = this.getBooleanvalue(feature.deleteFlag);
		}
		if(flag)
			obj.checked = flag;
		obj.xtype = "checkbox";
		if (index % 2 == 0)
			obj.cls = 'granular-cellContent privilege-grid-odd granular-privilege-headers';
		else
			obj.cls = 'granular-cellContent privilege-grid-even granular-privilege-headers';
		obj.padding = '0 0 0 0';
		obj.height = 25;
		obj.itemId = feature.accountId + "_" + feature.packageId + "_" + MODE;
		obj.mode = MODE;
		obj.accountId = feature.accountId;
		obj.packageId = feature.packageId;
		obj.checkChange = function(){
					var panelPointer = this.up('panel');
					checkPayGranularViewIfNotSelected(this.value,panelPointer,obj);
				}
		if (null != obj.checked && undefined != obj.checked) {
			obj.defVal = obj.checked;
		}

		if (mode === "VIEW") {
			obj.readOnly = true;
		}
		var flag = 'N';
		for (var i in granularPrivfieldJson) {
			if (granularPrivfieldJson[i].itemId == obj.itemId) {
				flag = 'Y';
				break; // Stop this loop, we found it!
			}
		}
		if (flag === 'N') {
			granularPrivfieldJson.push(obj);
		}
		return obj;
	},
		createPrivilegesContainer : function(filteredData){
		var self = this;
		var featureItems = [];
		
		//priviously submited granular Permissiong
		var prevPositivePayGranularPermissions = document.getElementById("payCenterGranularPermissions");
		
		var payGranularPrivHeaderViewIcon = Ext.ComponentQuery.query('checkbox[itemId=payGranularPrivHeader_viewIcon]');
		if(!Ext.isEmpty(payGranularPrivHeaderViewIcon))
			payGranularPrivHeaderViewIcon=payGranularPrivHeaderViewIcon[0].checked;
			
		var payGranularPrivHeaderquickApproveIcon = Ext.ComponentQuery.query('checkbox[itemId=payGranularPrivHeader_quickApproveIcon]');
		if(!Ext.isEmpty(payGranularPrivHeaderquickApproveIcon))
			payGranularPrivHeaderquickApproveIcon=payGranularPrivHeaderquickApproveIcon[0].checked;
		var payGranularPrivHeadercancelApproveIcon = Ext.ComponentQuery.query('checkbox[itemId=payGranularPrivHeader_cancelApproveIcon]');
		if(!Ext.isEmpty(payGranularPrivHeadercancelApproveIcon))
			payGranularPrivHeadercancelApproveIcon=payGranularPrivHeadercancelApproveIcon[0].checked;
		var payGranularPrivHeadereditIcon = Ext.ComponentQuery.query('checkbox[itemId=payGranularPrivHeader_editIcon]');
		if(!Ext.isEmpty(payGranularPrivHeadereditIcon))
			payGranularPrivHeadereditIcon=payGranularPrivHeadereditIcon[0].checked;
		var payGranularPrivHeaderapproveIcon = Ext.ComponentQuery.query('checkbox[itemId=payGranularPrivHeader_authIcon]');
		if(!Ext.isEmpty(payGranularPrivHeaderapproveIcon))
			payGranularPrivHeaderapproveIcon=payGranularPrivHeaderapproveIcon[0].checked;
		var payGranularPrivHeaderimportIcon = Ext.ComponentQuery.query('checkbox[itemId=payGranularPrivHeader_importIcon]');
		if(!Ext.isEmpty(payGranularPrivHeaderimportIcon))
			payGranularPrivHeaderimportIcon=payGranularPrivHeaderimportIcon[0].checked;
		var payGranularPrivHeaderrecallIcon = Ext.ComponentQuery.query('checkbox[itemId=payGranularPrivHeader_recallIcon]');
		if(!Ext.isEmpty(payGranularPrivHeaderrecallIcon))
			payGranularPrivHeaderrecallIcon=payGranularPrivHeaderrecallIcon[0].checked;
		var payGranularPrivHeadercancelIcon = Ext.ComponentQuery.query('checkbox[itemId=payGranularPrivHeader_cancelIcon]');
		if(!Ext.isEmpty(payGranularPrivHeadercancelIcon))
			payGranularPrivHeadercancelIcon=payGranularPrivHeadercancelIcon[0].checked;
		var payGranularPrivHeaderdeleteIcon = Ext.ComponentQuery.query('checkbox[itemId=payGranularPrivHeader_deleteIcon]');
		if(!Ext.isEmpty(payGranularPrivHeaderdeleteIcon))
			payGranularPrivHeaderdeleteIcon=payGranularPrivHeaderdeleteIcon[0].checked;
		
		Ext.each(filteredData, function(feature, index) {
			var panel = Ext.create('Ext.panel.Panel', {
						columnWidth : 1,
						layout : 'column',
						bodyStyle : {
							background : '#FAFAFA'
						}
					});
			var accountText = feature.accountNo + '|' + feature.accountName;
			var packageKey = feature.productCategoryCode + '|'
					+ feature.packageId;
			
			if (self.allPackagesSelectedFlag == 'Y'
					|| payPackageAssignedMap[packageKey] == true) {
				if (self.allAccountsSelectedFlag == 'Y'
						|| accountAssignedMap[accountText] == true) {

					panel.insert({
						xtype : 'label',
						text : feature.accountNo,
						padding : '5 0 0 20',
						height : 'auto',
						cls : 'ux_text-elipsis granular-privilege-accountno privilege-grid-main-header privilege-grid-odd privilege-admin-rights',
						autoEl : {
							tag : 'label',
							'data-qtip' : feature.accountNo
						}
					});
					panel.insert({
						xtype : 'label',
						text : feature.accountName,
						padding : '5 0 0 10',
						height : 'auto',
						cls : 'ux_text-elipsis granular-privilege-accountno privilege-grid-odd privilege-admin-rights',
						autoEl : {
							tag : 'label',
							'data-qtip' : feature.accountName
						}
					});
					panel.insert({
						xtype : 'label',
						text : feature.packageName,
						padding : '5 0 0 10',
						height : 'auto',
						cls : 'ux_text-elipsis  granular-privilege-headers privilege-grid-odd privilege-admin-rights',
						autoEl : {
							tag : 'label',
							'data-qtip' : feature.packageName
						}
					});

					if (self
							.isHiddenElementNotNull(prevPositivePayGranularPermissions)) {
						var previouslySubmitedJsonObj = Ext
								.decode(prevPositivePayGranularPermissions.value);
						self.updateFeatureIfPreviouslySelected(feature,
								previouslySubmitedJsonObj);

					}

					if (featureMap["PYB_41"] != undefined) {
						if (featureMap["PYB_41"].canView == 'Y') {
							panel.insert(self.setPriviligeMenu(feature, "VIEW",
									index,payGranularPrivHeaderViewIcon));
						}
						if (featureMap["PYB_41"].canEdit == 'Y') {
							panel.insert(self.setPriviligeMenu(feature, "EDIT",
									index,payGranularPrivHeadereditIcon));
						}
					}

					if (featureMap["PYB_381"] != undefined
							&& featureMap["PYB_381"].canEdit === 'Y') {
						panel.insert(self.setPriviligeMenu(feature, "DELETE",
								index,payGranularPrivHeaderdeleteIcon));
					}

					if (featureMap["PYB_364"] != undefined) {
						if (featureMap["PYB_364"].canEdit == 'Y') {
							panel.insert(self.setPriviligeMenu(feature,
									"RECALL", index,payGranularPrivHeaderrecallIcon));
						}
					}
					// panel.insert(self.setPriviligeMenu(feature,"DELETE"));
					if (featureMap["PYB_41"] != undefined) {
						if (featureMap["PYB_41"].canAuth == 'Y') {
							panel.insert(self.setPriviligeMenu(feature, "AUTH",
									index,payGranularPrivHeaderapproveIcon));
						}
					}

					if (featureMap["PYB_363"] != undefined) {
						if (featureMap["PYB_363"].canAuth == 'Y') {
							panel.insert(self.setPriviligeMenu(feature,
									"QUICKAPPROVE", index,payGranularPrivHeaderquickApproveIcon));
						}
					}
					
					if (featureMap["PYB_380"] != undefined
							&& featureMap["PYB_380"].canEdit === 'Y') {
						panel.insert(self.setPriviligeMenu(feature, "IMPORT",
								index,payGranularPrivHeaderimportIcon));
					}

					if (featureMap["STPP_46"] != undefined) {
						if (featureMap["STPP_46"].canEdit == 'Y') {
							panel.insert(self.setPriviligeMenu(feature,
									"CANCEL", index,payGranularPrivHeadercancelIcon));
						}
						if (featureMap["STPP_46"].canAuth == 'Y') {
							panel.insert(self.setPriviligeMenu(feature,
									"CANCELAPPROVE", index,payGranularPrivHeadercancelApproveIcon));

						}
					}

					featureItems.push(panel);

				}
			}
		});
		
		for(var i=0;i<featureItems.length;i++){
				var panels=featureItems[i];
				var panelId=Ext.getCmp(panels.id);
				if(i%2==0){ //white privilege-grid-odd
					for(var j=0;j<panels.items.items.length;j++){
						if(panels.items.items[j].hasCls('privilege-grid-even')){
							panels.items.items[j].removeCls('privilege-grid-even');
							panels.items.items[j].addCls('privilege-grid-odd');
						}
					}
				}
				else{ //grey privilege-grid-even
					for(var k=0;k<panels.items.items.length;k++){
						if(panels.items.items[k].hasCls('privilege-grid-odd')){
							panels.items.items[k].removeCls('privilege-grid-odd');
							panels.items.items[k].addCls('privilege-grid-even');
						}
					}
				}
			}
			
		return featureItems;
		
		},setSplitPaymentData : function(){
		var self = this;
		var data = self.loadGranularFeaturs();
		var filteredData = this.filterFeatures(data);
		totalPaymentRecordFrmServer = filteredData.length;
		var temp = totalPaymentRecordFrmServer/totalPaymentDisplay;
		granularTotalRecordPage = totalPaymentRecordFrmServer/granularPageSize;
		numberPaymentRecordsToDisplay = 0;
		totalNumberPaymentRecordsDisplayed = 0;
		navigationVisible = true;
		Ext.each(filteredData, function(feature, index) {
			var accountText = feature.accountNo + '|' + feature.accountName;
			var packageKey = feature.productCategoryCode + '|'
					+ feature.packageId;

			if (self.allPackagesSelectedFlag == 'Y'
					|| payPackageAssignedMap[packageKey] == true) {
				if (self.allAccountsSelectedFlag == 'Y'
						|| accountAssignedMap[accountText] == true) {
					numberPaymentRecordsToDisplay++;	
				}
			}
		});
		for(var i=0;i<temp;i++)
		{
			if((totalPaymentRecordFrmServer)<=(((i+1)*totalPaymentDisplay)-1))
				totalPaymentRecordsDisplay.push(totalPaymentRecordFrmServer-(totalPaymentDisplay*i));
			else
				totalPaymentRecordsDisplay.push(totalPaymentDisplay);
		}
		granularPaymentOverAllTTotalPage = totalPaymentRecordsDisplay.length;
	},
	getSplitPaymentData : function(calledFrom,filteredData,prevRecordMaxCountLoc,nextMinRecordCountLoc){
		if(totalPaymentRecordFrmServer<totalPaymentDisplay && calledFrom=='onLoad')
			return filteredData;
		var filteredDataTemp = [];
		if(calledFrom=='onLoad')
		{
			for(var k=0;k<totalPaymentRecordsDisplay[0];k++){
				filteredDataTemp.push(filteredData[k])
			}
		}
		else//Calling from pagination
		{
			for(var k=prevRecordMaxCountLoc;k<nextMinRecordCountLoc;k++){
				filteredDataTemp.push(filteredData[k])
			}
		}
		return filteredDataTemp;
	},setPayGranularRightsNew : function(calledFrom,prevRecordMaxCountLoc,nextMinRecordCountLoc){
			var self = this;
			var data = self.loadGranularFeaturs();
			var filteredData = this.filterFeatures(data);
			var featureItems = [];
			var splitFilterData = this.getSplitPaymentData(calledFrom,filteredData,prevRecordMaxCountLoc,nextMinRecordCountLoc);
			featureItems = self.createPrivilegesContainer(splitFilterData);
			//featureItems = self.createPrivilegesContainer(filteredData);
			//granularPrivfieldJsonTemp.push(featureItems);
			granularPrivfieldJsonTemp = [];
			for (var i in featureItems) {
				granularPrivfieldJsonTemp.push(featureItems[i]);
			}
			granularTotalNumberOfRecord = granularPrivfieldJsonTemp.length;
			granularTotalPage = granularTotalNumberOfRecord/granularPageSize;
		},
	setPayGranularRights : function()
	{
		var self = this;
		var data = self.loadGranularFeaturs();
		var filteredData = this.filterFeatures(data);
		var featureItems = [];
		var splitFilterData = this.getSplitPaymentData('onLoad',filteredData,'','');
		featureItems = self.createPrivilegesContainer(splitFilterData);
		if(featureItems.length<granularPageSize || numberPaymentRecordsToDisplay<=100)
		{
			featureItems = [];
			featureItems = self.createPrivilegesContainer(filteredData);
			navigationVisible = false;
			return featureItems;
		}
		//featureItems = self.createPrivilegesContainer(filteredData);
		var granularPrivfieldJsonTempNew = [];
		var featureItemsTemp = [];
		var tempPageSize = granularPageSize;
		if(featureItems.length<granularPageSize)
			tempPageSize = featureItems.length;
		for(var k=0;k<tempPageSize;k++){
			featureItemsTemp.push(featureItems[k]);
			totalNumberPaymentRecordsDisplayed++;
		}
		return featureItemsTemp;
	},loadGranularFeatursNew : function(){
		return granularPrivfieldJsonTemp;
	},resetPaginationValues : function(){
		granularPageNo = 1;
		granularCount = 1;
		granularPageSize = 10;
		granularTotalPage = 1;
		granularTotalNumberOfRecord = 1;
	},resetAll : function(){
		var thisClass = this;
		currentPaymentBunchOfPage = 0;
		granularPaymentOverAllTTotalPage = 1;
		granularPaymentOverAllTPageNo = 1;
		prevPaymentRecordMaxCount=0;
		nextPaymentMinRecordCount=0;
		numberPaymentRecordsToDisplay = 0;
		granularTotalRecordPage=0;
		totalPaymentRecordsDisplay = [];
		thisClass.resetPaginationValues();
	},showError : function(calledFrom){
		var errMsg ="Navigation not Allowed";
		if(calledFrom=='navigationNotAllowed')
			errMsg = "Navigation not Allowed" ;
		else if(calledFrom=='first')
			errMsg = "Navigation not Allowed, Already in First Page" ;
		else if(calledFrom=='last')
			errMsg = "Navigation not Allowed, Already in Last Page" ;
		else if(calledFrom=='next')
			errMsg = "Navigation not Allowed, Already in Last Page" ;
		else if(calledFrom=='previous')
			errMsg = "Navigation not Allowed, Already in First Page" ;
			
		Ext.MessageBox.show({
			title : getLabel(
			'granularNavigationError',
			'Error'),
			msg : errMsg,
				buttons : Ext.MessageBox.OK,
				cls : 't7-popup',
				icon : Ext.MessageBox.ERROR
		});
		
	},
	nextItems : function() {
		var thisClass = this;
		if(!navigationVisible)
		{
			thisClass.showError('navigationNotAllowed');
			return;
		}
		if((granularTotalPage<granularPageNo && granularPaymentOverAllTPageNo>granularPaymentOverAllTTotalPage) 
			|| totalNumberPaymentRecordsDisplayed==numberPaymentRecordsToDisplay)
		{
			thisClass.showError('next');
			return;
		}
		
		thisClass.saveItemsTemp();
		Ext.getCmp('payGranPrivParametersSection').removeAll();
		if((granularTotalPage<=granularPageNo && granularPaymentOverAllTPageNo<=granularPaymentOverAllTTotalPage) 
					&& granularTotalRecordPage>granularTotalPage)
		{
			prevPaymentRecordMaxCount = prevPaymentRecordMaxCount + totalPaymentRecordsDisplay[currentPaymentBunchOfPage];
			currentPaymentBunchOfPage = currentPaymentBunchOfPage+1;
			nextPaymentMinRecordCount = totalPaymentRecordsDisplay[currentPaymentBunchOfPage];
			thisClass.setPayGranularRightsNew('pagination',prevPaymentRecordMaxCount,prevPaymentRecordMaxCount+nextPaymentMinRecordCount);
			granularPaymentOverAllTPageNo = granularPaymentOverAllTPageNo + 1;
			granularPageNo = 0;
		}
		else if(currentPaymentBunchOfPage==0)
			thisClass.setPayGranularRightsNew('onLoad','','');
		else{
			var tempPrevPayment = totalPaymentRecordsDisplay[currentPaymentBunchOfPage]*(granularPaymentOverAllTPageNo-1);
			var tempNextPayment = totalPaymentRecordsDisplay[currentPaymentBunchOfPage];
			thisClass.setPayGranularRightsNew('pagination',tempPrevPayment,tempNextPayment+tempPrevPayment);
		}
		var temp1 = granularPageSize*granularPageNo;
		granularPageNo = granularPageNo+1;
		
		var featureItems = [];
		var temp = granularPageSize*granularPageNo;
		var granularPrivfieldJsonTempNew = thisClass.loadGranularFeatursNew();
		if(temp>granularPrivfieldJsonTempNew.length)
			temp = granularPrivfieldJsonTempNew.length;
		for(var k=temp1;k<temp;k++){
			featureItems.push(granularPrivfieldJsonTempNew[k]);
			totalNumberPaymentRecordsDisplayed++;
		}
		Ext.getCmp('payGranPrivParametersSection').add(featureItems);
		
	},
	lastItems : function() {
		var thisClass = this;
		if(!navigationVisible)
		{
			thisClass.showError('navigationNotAllowed');
			return;
		}
		if((granularTotalPage<granularPageNo && granularPaymentOverAllTPageNo>granularPaymentOverAllTTotalPage) 
			|| totalNumberPaymentRecordsDisplayed==numberPaymentRecordsToDisplay)
		{
			thisClass.showError('last');
			return;
		}
		thisClass.saveItemsTemp();
		Ext.getCmp('payGranPrivParametersSection').removeAll();
		thisClass.resetAll();
		thisClass.setSplitPaymentData();
		prevPaymentRecordMaxCount = totalPaymentDisplay * (granularPaymentOverAllTTotalPage-1);
		nextPaymentMinRecordCount = prevPaymentRecordMaxCount + totalPaymentRecordsDisplay[granularPaymentOverAllTTotalPage-1];
		currentPaymentBunchOfPage = granularPaymentOverAllTTotalPage-1;
		thisClass.setPayGranularRightsNew('pagination',prevPaymentRecordMaxCount,nextPaymentMinRecordCount);
		granularPaymentOverAllTPageNo = granularPaymentOverAllTTotalPage;
		//granularPageNo = 0;
		var granularPrivfieldJsonTempNew = thisClass.loadGranularFeatursNew();
		/*Last Page in case of less record*/
		while(granularPrivfieldJsonTempNew.length==0 && granularPaymentOverAllTPageNo>1)
		{		
			granularPaymentOverAllTPageNo = currentPaymentBunchOfPage;
			currentPaymentBunchOfPage--;
			prevPaymentRecordMaxCount = totalPaymentDisplay * (currentPaymentBunchOfPage);
			nextPaymentMinRecordCount = prevPaymentRecordMaxCount + totalPaymentRecordsDisplay[currentPaymentBunchOfPage];
			thisClass.setPayGranularRightsNew('pagination',prevPaymentRecordMaxCount,nextPaymentMinRecordCount);
			granularPrivfieldJsonTempNew = thisClass.loadGranularFeatursNew();
		}	
		
		
		granularPageNo = Math.ceil(granularTotalPage);
		var temp1 = granularPageSize*(granularPageNo-1);
		//granularPageNo = granularPageNo+1;
		var featureItems = [];
		var temp = granularPageSize*granularPageNo;
		if(temp>granularPrivfieldJsonTempNew.length)
			temp = granularPrivfieldJsonTempNew.length;
		for(var k=temp1;k<temp;k++){
			featureItems.push(granularPrivfieldJsonTempNew[k])
		}
		totalNumberPaymentRecordsDisplayed=numberPaymentRecordsToDisplay;
		Ext.getCmp('payGranPrivParametersSection').add(featureItems);
		
	},
	firstItems : function(){
		var thisClass = this;
		if(!navigationVisible)
		{
			thisClass.showError('navigationNotAllowed');
			return;
		}
		if(granularPageNo==1 && granularPaymentOverAllTPageNo==1)
		{
			thisClass.showError('first');
			return;
		}
		thisClass.saveItemsTemp();
		Ext.getCmp('payGranPrivParametersSection').removeAll();
		thisClass.resetAll();
		thisClass.setSplitPaymentData();
		thisClass.setPayGranularRightsNew('onLoad');
		Ext.getCmp('payGranPrivParametersSection').add(thisClass.setPayGranularRights() );
	},
	previousItems : function() {
		var self = this;
		if(!navigationVisible)
		{
			self.showError('navigationNotAllowed');
			return;
		}
		if(granularPageNo==1 && granularPaymentOverAllTPageNo==1)
		{
			self.showError('previous');
			return;
		}	
		self.saveItemsTemp();
		Ext.getCmp('payGranPrivParametersSection').removeAll();
		//self.setPayGranularRightsNew();
		
		if((granularPageNo == 1 && granularPaymentOverAllTPageNo<=granularPaymentOverAllTTotalPage) 
					&& granularTotalRecordPage>granularTotalPage)
		{
			//prevPaymentRecordMaxCount = totalPaymentRecordsDisplay[currentPaymentBunchOfPage]*(granularPaymentOverAllTPageNo-1);
			prevPaymentRecordMaxCount = totalPaymentDisplay*currentPaymentBunchOfPage;
			currentPaymentBunchOfPage = currentPaymentBunchOfPage-1;
			nextPaymentMinRecordCount = totalPaymentRecordsDisplay[currentPaymentBunchOfPage];
			self.setPayGranularRightsNew('pagination',prevPaymentRecordMaxCount-nextPaymentMinRecordCount,prevPaymentRecordMaxCount);
			granularPaymentOverAllTPageNo = granularPaymentOverAllTPageNo - 1;
			granularPageNo = Math.ceil(granularTotalPage)+1;
		}
		else if(prevPaymentRecordMaxCount==0)
			self.setPayGranularRightsNew('onLoad','','');
		else
		{
			//var tempPrevPayment = totalPaymentRecordsDisplay[currentPaymentBunchOfPage]*(granularPaymentOverAllTPageNo);
			var tempPrevPayment = totalPaymentDisplay*currentPaymentBunchOfPage;
			var tempNextPayment = totalPaymentRecordsDisplay[currentPaymentBunchOfPage];
			self.setPayGranularRightsNew('pagination',tempPrevPayment,tempPrevPayment+tempNextPayment);
		}
		
		
		if(granularPageNo>1)
		{
			granularPageNo = granularPageNo-1;
		}
		var temp1 = granularPageSize*granularPageNo;
		var featureItems1 = [];
		var temp = temp1 - granularPageSize;
		var granularPrivfieldJsonTempNew = self.loadGranularFeatursNew();
		for(var kk=temp;kk<temp1;kk++){
			featureItems1.push(granularPrivfieldJsonTempNew[kk]);
			totalNumberPaymentRecordsDisplayed--;
		}
		if(granularPageNo==1 && granularPaymentOverAllTPageNo==1)
		{
			prevPaymentRecordMaxCount = 0;
			nextPaymentMinRecordCount = 0;
			totalNumberPaymentRecordsDisplayed = temp+temp1;
		}
		Ext.getCmp('payGranPrivParametersSection').add(featureItems1);
	},
	loadPrivilegesFeaturs: function() {
	var me = this;
		if(mode === "VIEW"){
				Ext.Ajax.request({
					url : 'services/userCategory/previlige.json',
					method : 'POST',
					async: false,
					params : { module: '02',categoryId:userCategory},
					success : function(response) {
						featureData = Ext.JSON.decode(response.responseText);
						return featureData; 
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
		return featureData;
	},
	loadAccounts: function() {
	var me = this;
		if(mode === "VIEW"){
				Ext.Ajax.request({
					url : 'services/userCategory/accounts.json',
					method : 'POST',
					async: false,
					params : { module: '02',categoryId:userCategory,$inlinecount:'allpages',$top:5000},
					success : function(response) {
					 	 paymentAccountsData = Ext.JSON.decode(response.responseText);
						return paymentAccountsData; 
					},
					failure : function() {
						var errMsg = "";
						Ext.MessageBox.show({
									title : getLabel(
											'instrumentErrorPopUpTitle',
											'Error'),
									msg : getLabel('instrumentErrorPopUpMsg',
											'Error while fetching Accounts data..!'),
									buttons : Ext.MessageBox.OK,
									icon : Ext.MessageBox.ERROR
								});
					}
				});

		}
		return paymentAccountsData;
	},
	
	loadPaymentPackages: function() {
	var me = this;
		if(mode === "VIEW"){
				Ext.Ajax.request({
					url : 'services/userCategory/catPackageList.json',
					method : 'POST',
					async: false,
					params : { module: '02',categoryId:userCategory,$inlinecount:'allpages',$top:5000},
					success : function(response) {
					 	 paymentPackagesData = Ext.JSON.decode(response.responseText);
						return paymentPackagesData; 
					},
					failure : function() {
						var errMsg = "";
						Ext.MessageBox.show({
									title : getLabel(
											'instrumentErrorPopUpTitle',
											'Error'),
									msg : getLabel('instrumentErrorPopUpMsg',
											'Error while fetching Payment Packages data..!'),
									buttons : Ext.MessageBox.OK,
									icon : Ext.MessageBox.ERROR
								});
					}
				});

		}
		return paymentPackagesData;
	},

	
	getStringBooleanvalue : function(value)
	{
		if(value && value == true)
		{
			return 'Y';
		}
		else
		{
			return 'N';
		}
	},
	
setPaymentPackagesData : function()
	{
		var self = this;
		
		var privdata = self.loadPaymentPackages();
		
		//in case there are no packages for service check array is empty
		
		var filteredPrivData;
		
		if(privdata!== null  && privdata.length!== 0 ){
			filteredPrivData = privdata.d.details;
		}
		var selectedPackages  = document.getElementById('selectedPackages');
		var selectedPackagesObj; 
		if(typeof selectedPackages!== undefined && selectedPackages!==null && selectedPackages.value){
		  selectedPackagesObj = Ext.decode(selectedPackages.value);
		}
		
		var allPPFlag = document.getElementById('allPackagesSelectedFlag');
		if( self.isHiddenElementNotNull(allPPFlag)){
		  self.allPackagesSelectedFlag = allPPFlag.value;
		}
	 
		
		Ext.each(filteredPrivData, function(payPackage, index) {
			var payPackageKey = payPackage.productCategoryCode + '|'+ payPackage.productCode;
			var isAssigned = payPackage.assignmentStatus === 'Assigned' ? true :false ;
			var prevSelectedPayPackageObj;
			
			prevSelectedPayPackageObj = self.getPayPackageFromSelectedList(selectedPackagesObj,payPackage);
			
			if(typeof prevSelectedPayPackageObj !== undefined && prevSelectedPayPackageObj!==null){
			     
				 isAssigned = prevSelectedPayPackageObj.assigned;
			 }
		
		    payPackageAssignedMap[payPackageKey] = isAssigned;
			
			
		});
		
	//console.log("payPackageAssignedMap :"+payPackageAssignedMap); 
		
	},
	
	 getPayPackageFromSelectedList: function(selectedPackagesObj,payPackage){
	 
		 for(key in selectedPackagesObj){
		   var payPkgObj = selectedPackagesObj[key][0];
		   
		   if(payPackage.productCategoryCode == payPkgObj.productCategoryCode && payPackage.productCode == payPkgObj.productCode ){
				return payPkgObj;
		   }	   
		   
		 }
		 return null;
	 },

setPaymentAccounts : function()
	{
		var self = this;
		
		var privdata = self.loadAccounts();
		
		//in case there are no accounts for service check array is empty
		
		var filteredPrivData;
		
		if(privdata!== null  && privdata.length!== 0 ){
			filteredPrivData = privdata.d.details;
		}
		var selectedAccounts  = document.getElementById('selectedAccounts');
		var selectedAccountsObj; 
		if(typeof selectedAccounts!== undefined && selectedAccounts!==null && selectedAccounts.value){
		  selectedAccountsObj = Ext.decode(selectedAccounts.value);
		}
		
		var allPPFlag = document.getElementById('allbRAccountsSelectedFlag');
		if( self.isHiddenElementNotNull(allPPFlag)){
		  self.allAccountsSelectedFlag = allPPFlag.value;
		}
	 
		
		Ext.each(filteredPrivData, function(account, index) {
			var accountKey = account.accountNumber + '|'+ account.accountName;
			var isAssigned = account.isAssigned;
			var prevSelectedAccountObj;
			
			prevSelectedAccountObj = self.getAccountFromSelectedList(selectedAccountsObj,account);
			
			if(typeof prevSelectedAccountObj !== undefined && prevSelectedAccountObj!==null){
			     
				 isAssigned = prevSelectedAccountObj.assigned;
			 }
		
		    accountAssignedMap[accountKey] = isAssigned;
			
			
		});
		
	//console.log("accountAssignedMap :"+accountAssignedMap); 
		
	},
	 getAccountFromSelectedList: function(selectedBRAccountsObj,account){
	 
		 for(key in selectedBRAccountsObj){
		   var accountObj = selectedBRAccountsObj[key][0];
		   
		   if(account.accountNumber == accountObj.accountNumber){
				return accountObj;
		   }	   
		   
		 }
		 return null;
	 },
	
	setPaymentRights : function()
	{
		var self = this;
			
		var privdata = self.loadPrivilegesFeaturs();
		var filteredPrivData = this.filterFeatures(privdata);
		
		var viewRightsSerials  = document.getElementById('viewRightsSerials');
		var editRightsSerials  = document.getElementById('editRightsSerials');
		var authRightsSerials  = document.getElementById('authRightsSerials');
		
		var selectedViewRightsObj,selectedEditRightsObj,selectedAuthRightsObj; 
		
		if( self.isHiddenElementNotNull(viewRightsSerials) ){
		    selectedViewRightsObj = Ext.decode(viewRightsSerials.value);
		}
		
		if( self.isHiddenElementNotNull(editRightsSerials) ){
		    selectedEditRightsObj = Ext.decode(editRightsSerials.value);
		}
		
		if( self.isHiddenElementNotNull(authRightsSerials) ){
		    selectedAuthRightsObj = Ext.decode(authRightsSerials.value);
		}
		
		Ext.each(filteredPrivData, function(feature, index) {
			//using key as below due to multiple weights for same feature id
			var key = feature.featureId + "_"+feature.featureWeight;
			//var value = feature;
			var rightValue;
			var rmserial = feature.rmSerial;
			
			if(typeof selectedViewRightsObj!== undefined && selectedViewRightsObj){
			    rightValue = undefined;
			   if(selectedViewRightsObj.hasOwnProperty(rmserial)){
			     rightValue = selectedViewRightsObj[rmserial];
			   }
			   if(rightValue!== undefined)
			   feature.canView = self.getStringBooleanvalue(rightValue);
			}
			
			if(typeof selectedEditRightsObj!== undefined && selectedEditRightsObj){
			  rightValue = undefined;
			   if(selectedEditRightsObj.hasOwnProperty(rmserial)){
			     rightValue = selectedEditRightsObj[rmserial];
			   }
			   if(rightValue!== undefined)
			   feature.canEdit = self.getStringBooleanvalue(rightValue);
			}
			
			if(typeof selectedAuthRightsObj!== undefined && selectedAuthRightsObj){
			  rightValue = undefined;
			   if(selectedAuthRightsObj.hasOwnProperty(rmserial)){
			     rightValue = selectedAuthRightsObj[rmserial];
			   }
			   if(rightValue!== undefined)
			   feature.canAuth = self.getStringBooleanvalue(rightValue);
			}
						
			featureMap[key] = feature;
			
		});
		
		
		
		},
		
	reconfigure : function(){
		var thisClass = this;

		Ext.getCmp('payGranPrivParametersSection').removeAll();
		Ext.getCmp('payGranularPrivHeader').removeAll();
		Ext.getCmp('payGranularPrivColumnHeader').removeAll();
		
		thisClass.setPaymentRights();
		thisClass.setPaymentPackagesData();
		thisClass.setPaymentAccounts();
		//thisClass.resetPaginationValues();
		thisClass.setSplitPaymentData();
		thisClass.resetPaginationValues();
		thisClass.setPayGranularRightsNew('onLoad');

		Ext.getCmp('payGranPrivParametersSection').add(thisClass.setPayGranularRights() );
		Ext.getCmp('payGranularPrivHeader').add(thisClass.setPanelHeader('payGranularPrivHeader','Account'));
		Ext.getCmp('payGranularPrivColumnHeader').add(thisClass.setColumnHeader());
	
	
	
	},	
	isHiddenElementNotNull: function(object){
	
	  if(typeof object!== undefined &&  object!==null && object.value){
	     return true;
	  }
	  return false;
	},
	
	updateFeatureIfPreviouslySelected:function( feature ,previouslySubmitedJsonObj) {
			 
		 for(key in previouslySubmitedJsonObj.accountPackagePrivileges){
			var previousSelectedObj = previouslySubmitedJsonObj.accountPackagePrivileges[key];
			if ( previousSelectedObj.accountId == feature.accountId && previousSelectedObj.packageId == feature.packageId)
			{
				if (previousSelectedObj.privileges.hasOwnProperty("VIEW")) {
					feature.viewFlag = previousSelectedObj.privileges.VIEW
							? true
							: false;
				}
				if (previousSelectedObj.privileges.hasOwnProperty("EDIT")) {
					feature.editFlag = previousSelectedObj.privileges.EDIT
							? true
							: false;
				}

				if (previousSelectedObj.privileges.hasOwnProperty("AUTH")) {
					feature.approveFlag = previousSelectedObj.privileges.AUTH
							? true
							: false;
				}
				if (previousSelectedObj.privileges
						.hasOwnProperty("QUICKAPPROVE")) {
					feature.quickApproveFlag = previousSelectedObj.privileges.QUICKAPPROVE
							? true
							: false;
				}

				if (previousSelectedObj.privileges.hasOwnProperty("RECALL")) {
					feature.recallFlag = previousSelectedObj.privileges.RECALL
							? true
							: false;
				}

				if (previousSelectedObj.privileges.hasOwnProperty("CANCEL")) {
					feature.cancelFlag = previousSelectedObj.privileges.CANCEL
							? true
							: false;
				}

				if (previousSelectedObj.privileges
						.hasOwnProperty("CANCELAPPROVE")) {
					feature.cancelApproveFlag = previousSelectedObj.privileges.CANCELAPPROVE
							? true
							: false;
				}
				if (previousSelectedObj.privileges.hasOwnProperty("DELETE")) {
					feature.deleteFlag = previousSelectedObj.privileges.DELETE
							? true
							: false;
				}
				if (previousSelectedObj.privileges.hasOwnProperty("IMPORT")) {
					feature.importFlag = previousSelectedObj.privileges.IMPORT
							? true
							: false;
				}
			}
		  }
			 
		

	},
	
	initComponent: function() {
	var thisClass = this;
	
		thisClass.setPaymentRights();
		thisClass.setPaymentPackagesData();
		thisClass.setPaymentAccounts();
		thisClass.setSplitPaymentData();
		thisClass.resetPaginationValues();
		thisClass.setPayGranularRightsNew('onLoad');
		thisClass.items = [{
					xtype:'panel',
					width : 'auto',
					items:[{
						xtype: 'panel',
						width : 'auto',
						id : 'payGranularPrivFilterBox',
						layout:'column',
						cls: 'ft-padding-bottom',
						//height : 35,
						items: [
							{
								xtype : 'AutoCompleter',
								//cls : 'autoCmplete-field ux_paddingb',
								fieldCls : 'xn-form-text xn-suggestion-box granular-autocompleter',
								id : 'payAccountIDFilterItemId',
								itemId : 'payAccountIDFilterItemId',
								name : 'payAccountIDFilterItemId',
								matchFieldWidth : true,
								labelSeparator : '',
								labelAlign : 'top',
								labelCls : 'ft-bold-font page-content-font',
								fieldLabel :  getLabel( 'lbl.account', 'Account' ),
								emptyText : getLabel('searchByAccNumberOrName','Search by Account number or name'),
								cfgUrl : 'services/userseek/accountPackagesSeekForSI.json',
								cfgQueryParamName : '$autofilter',
								cfgRecordCount : -1,
								cfgSeekId : 'payAccountIDFilterItemId',
								cfgRootNode : 'd.preferences',
								cfgKeyNode : 'ID',
								cfgDataNode1 : 'DESCRIPTION',
								cfgStoreFields:['ID','CODE','DESCRIPTION']
								,
								cfgExtraParams : [
								   {
										key : '$filtercode1',
										value : catCorporationCode
									}],
								listeners : {
								'select':function(){
									thisClass.filterHandler(); 
									var selected = thisClass.down('component[itemId="accountClearLink"]');
          								  selected.show();									
								 },
								   'change':function(){
									 var filterContainer = thisClass.down('[itemId="payAccountIDFilterItemId"]');
								   if(Ext.isEmpty(filterContainer.getValue())){
										var selected = thisClass.down('component[itemId="accountClearLink"]');
										selected.hide();
									  thisClass.filterHandler();
									  }
								 }
							 }	
							},
							{
								xtype : 'component',
								layout : 'hbox',
								itemId : 'accountClearLink',
								hidden : true,
								style : {
									'line-height' : 4
								},
								cls : 'clearlink-a cursor_pointer page-content-font ft-padding-l',
								html: '<a>'+getLabel('clear','Clear')+'</a>',
								listeners: {
									'click': function() {
										var filterContainer = thisClass.down('[itemId="payAccountIDFilterItemId"]');
										filterContainer.setValue("");
										var selected = thisClass.down('component[itemId="accountClearLink"]');
										selected.hide();
										thisClass.filterHandler();
									},
									element: 'el',
									delegate: 'a'
								}
							},{
								margin : '0 0 0 40',
								xtype : 'AutoCompleter',
								//cls : 'autoCmplete-field ux_paddingb',
								fieldCls : 'xn-form-text xn-suggestion-box popup-searchBox ',
								id : 'paymentPayPkgFilterItemId',
								itemId : 'paymentPayPkgFilterItemId',
								name : 'paymentPayPkgFilterItemId',
								matchFieldWidth : true,
								labelSeparator : '',
								labelAlign : 'top',
								labelCls : 'ft-bold-font page-content-font',
								fieldLabel :  getLabel( 'pmtPackage', 'Package' ),
								emptyText : getLabel('searchByPmtPackage','Search by Payment Package'),
								cfgUrl : 'services/userseek/packagesSeekForSI.json',
								cfgQueryParamName : '$autofilter',
								cfgRecordCount : -1,
								cfgSeekId : 'paymentPayPkgFilterItemId',
								cfgRootNode : 'd.preferences',
								cfgKeyNode : 'PKGID',
								cfgDataNode1 : 'PKGNAME',
								cfgStoreFields:['PKGID','PKGNAME']
								,
								cfgExtraParams : [
								   {
										key : '$filtercode1',
										value : catCorporationCode
									}],
								listeners : {
								'select':function(){
									thisClass.filterHandler(); 
									var selected = thisClass.down('component[itemId="paypkgClearLink"]');
          								  selected.show();									
								 },
								   'change':function(){
									 var filterContainer = thisClass.down('[itemId="paymentPayPkgFilterItemId"]');
								   if(Ext.isEmpty(filterContainer.getValue())){
										var selected = thisClass.down('component[itemId="paypkgClearLink"]');
										selected.hide();
									  thisClass.filterHandler();
									  }
								 }
							 }
							},{
								xtype : 'component',
								layout : 'hbox',
								itemId : 'paypkgClearLink',
								hidden : true,
								style : {
									'line-height' : 4
								},
								cls : 'clearlink-a cursor_pointer page-content-font ft-padding-l',
								html: '<a>'+getLabel('clear','Clear')+'</a>',
								listeners: {
									'click': function() {
										var filterContainer = thisClass.down('[itemId="paymentPayPkgFilterItemId"]');
										filterContainer.setValue("");
										var selected = thisClass.down('component[itemId="paypkgClearLink"]');
										selected.hide();
										thisClass.filterHandler();
									},
									element: 'el',
									delegate: 'a'
								}
							}
							
						]
						
						
				  }]
			 },{
	    	xtype: 'container',
			maxHeight : 1800,
			width : 'auto',
			//layout : 'vbox',
			overflowX: 'auto',
			overflowY: 'hidden',
	    	cls : 'privilege gran-privilege',
			items:[{
					xtype:'panel',	
					width : 'auto',
					items:[{
						xtype: 'panel',
						width : 'auto',
						id : 'payGranularPrivColumnHeader',
						layout: {
					        type: 'hbox'
					    },
						cls: 'mainHeader',
						padding: '0 0 0 10',
						items: thisClass.setColumnHeader()
				  }]
			 },{
			 		xtype:'panel',
					width : 'auto',		
					layout: {
						        type: 'vbox'
						    },
					maxHeight : 1800,
			 		items:[{
							xtype: 'panel',
							width : 'auto',
							id : 'payGranularPrivHeader',
							layout: {
						        type: 'column'
						    },
							cls:'red-bg',
							height : 50,
							items: thisClass.setPanelHeader('payGranularPrivHeader',getLabel('lbl.account','Account'))
						},
						{
							xtype: 'panel',
							width : 'auto',
							//minHeight : 35,
							maxHeight : 1800,
							//maxWidth : thisClass.max_width,
							titleAlign : "left", 
							//collapsible : true,
							cls : 'xn-ribbon',
							collapseFirst : true,
							itemId : 'payGranPrivParametersSection',
							id : 'payGranPrivParametersSection',
							layout: {
							        type: 'vbox'
							    },
							items: thisClass.setPayGranularRights()
							
						}]
			 }]
		}];
		if(mode === "VIEW"){
			thisClass.bbar=[
			         '->', { 
			        	  text: getLabel('btnClose','Close'),
			        	  cls : 'ft-button-primary',
			        	  /*handler : function(btn,opts) {
			        		thisClass.close();
			        				}*/
						listeners: {
						  click : function(){
			        	  thisClass.close();
						  }
							}			
			          }
			        ];
		}
		else
		{
			thisClass.bbar=[
			          { 
			        	  text: getLabel('btnCancel','Cancel'),
			        	  cls : 'ft-button-light',
			        	  handler : function(btn,opts) {
			        		thisClass.destroy();
							objPayGranularPrivPriviligePopup= null;
							document.getElementById("payCenterGranularPermissions").value='';
							//thisClass.hide();
			        				}
			          },'->',{ 
			        	  text: getLabel('First','First'),
			        	  cls : 'ft-button-primary',
						  //hidden  : !isNavigationVisible(),
			        	  /*handler : function(btn,opts) {
			        	  	thisClass.saveItems();
			        		thisClass.close();
			        				}*/
						 listeners: {
						  click : function(){
						  thisClass.firstItems();
						  }
							}			
			          },
					  { 
			        	  text: getLabel('Previous','Previous'),
			        	  cls : 'ft-button-primary',
						  //hidden  : !isNavigationVisible(),
			        	  /*handler : function(btn,opts) {
			        	  	thisClass.saveItems();
			        		thisClass.close();
			        				}*/
						 listeners: {
						  click : function(){
						  thisClass.previousItems();
						  }
							}			
			          },
					  { 
			        	  text: getLabel('Next','Next'),
			        	  cls : 'ft-button-primary',
						  //hidden  : !isNavigationVisible(),
			        	  /*handler : function(btn,opts) {
			        	  	thisClass.saveItems();
			        		thisClass.close();
			        				}*/
						 listeners: {
						  click : function(){
						  thisClass.nextItems();
						  }
							}			
			          },{ 
			        	  text: getLabel('Last','Last'),
			        	  cls : 'ft-button-primary',
						  //hidden  : !isNavigationVisible(),
			        	  /*handler : function(btn,opts) {
			        	  	thisClass.saveItems();
			        		thisClass.close();
			        				}*/
						 listeners: {
						  click : function(){
						  thisClass.lastItems();
						  }
							}			
			          },
					  { 
			        	  text: getLabel('submit','Submit'),
			        	  cls : 'ft-button-primary',
			        	  /*handler : function(btn,opts) {
			        	  	thisClass.saveItems();
			        		thisClass.close();
			        				}*/
						 listeners: {
						  click : function(){
						  thisClass.saveItems();
			        	  thisClass.close();
						  }
							}			
			          }
			        ];
		}
		this.callParent(arguments);
	},
	
	filterHandler :function(){
	  var self = this;
	  var filterCode = Ext.getCmp('payAccountIDFilterItemId').getValue();
	  var packageName = Ext.getCmp('paymentPayPkgFilterItemId').getValue();
	   
	  Ext.getCmp('payGranPrivParametersSection').removeAll();
	  
	 
		//Ext.getBody().mask("dasd", 'loading');
	   var filterResponse = [];
	   //console.log("filterCode "+filterCode);
		var filteredData ;
		if(filterCode && packageName){
			payGranularFeatureData.forEach(function (arrayElem){ 
				if((arrayElem.accountId === filterCode && arrayElem.packageId === packageName) ||
						((arrayElem.accountId === filterCode) && 
						(( arrayElem.packageName.toUpperCase().indexOf(packageName.toUpperCase()) > -1 ) ||(arrayElem.packageId === packageName ))) ){
				   //console.log("arrayElem "+arrayElem);
					filterResponse.push(JSON.parse(JSON.stringify(arrayElem)));
				   //break;
				}
			});		
			   filteredData = filterResponse;
			   navigationVisible = false;
			   isFilterApplied =true;
		   }	
		else if(packageName){
			 payGranularFeatureData.forEach(function (arrayElem){ 
				if((arrayElem.packageId.toUpperCase() === packageName.toUpperCase()) || (arrayElem.packageName.toUpperCase().indexOf(packageName.toUpperCase()) > -1 )  ){
				   //console.log("arrayElem "+arrayElem);
					filterResponse.push(JSON.parse(JSON.stringify(arrayElem)));
				   //break;
				}
			});		
			isFilterApplied =true;
		   navigationVisible = false;
		   filteredData = filterResponse;
			 
		  } 	  
		  else if(filterCode)	{
				payGranularFeatureData.forEach(function (arrayElem){ 
				if(arrayElem.accountId === filterCode){
				   //console.log("arrayElem "+arrayElem);
					filterResponse.push(JSON.parse(JSON.stringify(arrayElem)));
				   //break;
				}
			});		
		 isFilterApplied =true;
		 navigationVisible = false;
		   filteredData = filterResponse;
		   //isNavigationVisible();
		  }  		  
		  else{
		    isFilterApplied =false;
			filteredData = this.filterFeatures(payGranularFeatureData);
		  }
		var featureItems = [];
		
			if(!isFilterApplied)
			{
				var filteredDataTemp = this.getSplitPaymentData('onLoad',filteredData,'','');
				featureItems = self.createPrivilegesContainer(filteredDataTemp);
				if(featureItems.length<granularPageSize || numberPaymentRecordsToDisplay<=100)
				{	
					var featureItemsTemp = [];
					featureItemsTemp = self.createPrivilegesContainer(filteredData);
					navigationVisible = false;
				}
				else
				{
					navigationVisible = true;
					self.resetPaginationValues();
					var featureItemsTemp = [];
					var temp = granularPageSize;
					if(featureItems.length<granularPageSize)
						temp = featureItems.length;
					for(var k=0;k<temp;k++){
						featureItemsTemp.push(featureItems[k])
					}
				}
				Ext.getCmp('payGranPrivParametersSection').add(featureItemsTemp);
			}
			else{
				featureItems = self.createPrivilegesContainer(filteredData);
				Ext.getCmp('payGranPrivParametersSection').add(featureItems);
			}
		
	}
	,
	saveItems : function() {	
					var me = this;
					var jsonData = {};
					Ext.each(granularPrivfieldJson, function(field, index) {
						var featureId = field.itemId;
						var accountId =field.accountId;
						var pkgId =field.packageId;
						var element = me.down('checkboxfield[itemId='+featureId+']');
						var objectKey = accountId+'_'+pkgId;
							
						if(element != null && element != undefined && !element.hidden){
										
									var mode = element.mode;
									//console.log("jsonData :"+JSON.stringify(jsonData));
								if(!(objectKey in jsonData)){ 
										//console.log("accountiD adding for first time :"+accountId);
										var newEntry = {};
										newEntry['accountId'] = accountId;
										newEntry['packageId'] = pkgId;
										newEntry['privileges'] = {};
							     		jsonData[objectKey] = newEntry;
									}
									
															
									if('VIEW' == mode){
										jsonData[objectKey]['privileges']['VIEW'] = element.getValue();
									}
									if('EDIT' == mode){
										jsonData[objectKey]['privileges']['EDIT'] = element.getValue();
									}
									if('AUTH' == mode){
										jsonData[objectKey]['privileges']['AUTH'] = element.getValue();
									}
									if('QUICKAPPROVE' == mode){
										jsonData[objectKey]['privileges']['QUICKAPPROVE'] = element.getValue();
									}
									if('RECALL' == mode){
										jsonData[objectKey]['privileges']['RECALL'] = element.getValue();
									}
									if('CANCEL' == mode){
										jsonData[objectKey]['privileges']['CANCEL'] = element.getValue();
									}
									if('CANCELAPPROVE' == mode){
										jsonData[objectKey]['privileges']['CANCELAPPROVE'] = element.getValue();
									}
									if('DELETE' == mode){
										jsonData[objectKey]['privileges']['DELETE'] = element.getValue();;
									}
									if('IMPORT' == mode){
										jsonData[objectKey]['privileges']['IMPORT'] = element.getValue();;
									}
								
									for(var mode in jsonData[objectKey]['privileges']) {
										if( !jsonData[objectKey]['privileges']['VIEW'] && jsonData[objectKey]['privileges'][mode]){
										   	jsonData[objectKey]['privileges']['VIEW'] = true;
										   	break;
										}
									}
							}
			});
			
			var jsonObj = {};
			jsonObj['serviceType'] = 'PAY';
			jsonObj['moduleCode'] = '02';
			var jsonArray = [];
			//only add those records which are updated
			for (var index  in payGranularFeatureDataBackup){
				var orginalObj = payGranularFeatureDataBackup[index];
			    var accountId =orginalObj.accountId;
			    var pkgId =orginalObj.packageId;
				var objectKey = accountId+'_'+pkgId;
				var recordKeyNo = orginalObj.recordKeyNo;
			  	if((objectKey in jsonData)){ 
                       var newObj = jsonData[objectKey];
					 if (newObj['privileges']['VIEW'] == this
						.getBooleanvalue(orginalObj.viewFlag)
						&& newObj['privileges']['EDIT'] == this
								.getBooleanvalue(orginalObj.editFlag)
						&& newObj['privileges']['AUTH'] == this
								.getBooleanvalue(orginalObj.approveFlag)
						&& newObj['privileges']['QUICKAPPROVE'] == this
								.getBooleanvalue(orginalObj.quickApproveFlag)
						&& newObj['privileges']['RECALL'] == this
								.getBooleanvalue(orginalObj.recallFlag)
						&& newObj['privileges']['CANCEL'] == this
								.getBooleanvalue(orginalObj.cancelFlag)
						&& newObj['privileges']['CANCELAPPROVE'] == this
								.getBooleanvalue(orginalObj.cancelApproveFlag)
						&& newObj['privileges']['DELETE'] == this
								.getBooleanvalue(orginalObj.deleteFlag)
						&& newObj['privileges']['IMPORT'] == this
								.getBooleanvalue(orginalObj.importFlag)) {
					// if none of the values are changed no need to push into
					// array
						//jsonArray.push(newObj)
				} else {
					jsonArray.push(newObj)
				}
				
				}else{
				
						//recordKeyNo of record means its saved in db and if its not found in jsonData (i.e currently present in rows on screen) then make all flag N for that account
					
						if(recordKeyNo!== undefined && recordKeyNo!=null && recordKeyNo)
						{
						
							if(  false  ===  this.getBooleanvalue(orginalObj.viewFlag)  && 
								 false  ===  this.getBooleanvalue(orginalObj.editFlag) &&
								 false  ===  this.getBooleanvalue(orginalObj.deleteFlag) &&
								 false  ===  this.getBooleanvalue(orginalObj.approveFlag) &&
								 false  ===  this.getBooleanvalue(orginalObj.quickApproveFlag) &&
								 false  ===  this.getBooleanvalue(orginalObj.recallFlag) &&
								 false  ===  this.getBooleanvalue(orginalObj.cancelFlag) &&
								 false  ===  this.getBooleanvalue(orginalObj.cancelApproveFlag &&
								 false  ===  this.getBooleanvalue(orginalObj.importFlag)))
							 {
							 // if all flags are N means record is previously removed no need to add into deleted array 
								 
							 }else{
								if(!isFilterApplied && navigationVisible)
								{
									var newEntry = {};
									newEntry['accountId'] = accountId;
									newEntry['packageId'] = pkgId;
									var privileges = {'VIEW':false,'EDIT':false,'AUTH':false,'QUICKAPPROVE':false,'RECALL':false,'CANCEL':false,'CANCELAPPROVE':false,'DELETE':false,'IMPORT':false};
									newEntry['privileges'] = privileges;
									jsonArray.push(newEntry);
								}
							 }
						}
				}
			}
			
			var v1 =true;
			Ext.each(jsonArray, function(field, index) {
					var accountId =field.accountId;
					var pkgId =field.packageId;
					var objectKey = accountId+'_'+pkgId;
					
				//if(objectKey in jsonData){
					var newObj = jsonData[objectKey];
					Ext.each(jsonArrayGlobal, function(fieldNew, indexNew) {
						var accountIdNew =fieldNew.accountId;
						var pkgIdNew =fieldNew.packageId;
						var objectKeyNew = accountIdNew+'_'+pkgIdNew;
						//if(objectKeyNew in jsonArrayGlobal) {
							if(objectKeyNew==objectKey){ 
								v1=false;
								var newObj1 = jsonArrayGlobal[indexNew];
						if(!Ext.isEmpty(newObj) && !Ext.isEmpty(newObj1))
						{
							  if (newObj1.privileges.VIEW!= newObj['privileges']['VIEW']
								||newObj1.privileges.EDIT!= newObj['privileges']['EDIT']
								||newObj1.privileges.AUTH!= newObj['privileges']['AUTH']
								||newObj1.privileges.QUICKAPPROVE!= newObj['privileges']['QUICKAPPROVE']
								||newObj1.privileges.RECALL!= newObj['privileges']['RECALL']
								||newObj1.privileges.CANCEL!= newObj['privileges']['CANCEL']
								||newObj1.privileges.CANCELAPPROVE!= newObj['privileges']['CANCELAPPROVE']
								||newObj1.privileges.DELETE!= newObj['privileges']['DELETE']
								||newObj1.privileges.IMPORT!= newObj['privileges']['IMPORT'])
								{
									jsonArrayGlobal[indexNew].privileges=jsonArray[index].privileges;
								}
							
						}
						}
							/*else{
								jsonArrayGlobal.push(newObj);
								}*/
						//}
					});
				//}
			});
			if (Ext.isEmpty(jsonArrayGlobal)){
				jsonArrayGlobal = jsonArray;
			}else if(v1){
				jsonArrayGlobal = jsonArrayGlobal.concat(jsonArray);
			}
			if(!isFilterApplied && navigationVisible){
				var headerViewIcon = me.down('checkbox[itemId=payGranularPrivHeader_viewIcon]');
				var headerEditIcon = me.down('checkbox[itemId=payGranularPrivHeader_editIcon]');
				var headerDeleteIcon = me.down('checkbox[itemId=payGranularPrivHeader_deleteIcon]');
				var headerApproveIcon = me.down('checkbox[itemId=payGranularPrivHeader_authIcon]');
				var headerQuickApproveIcon = me.down('checkbox[itemId=payGranularPrivHeader_quickApproveIcon]');
				var headerRecallIcon = me.down('checkbox[itemId=payGranularPrivHeader_recallIcon]');
				var headerCancelIcon = me.down('checkbox[itemId=payGranularPrivHeader_cancelIcon]');
				var headerCancelApproveIcon = me.down('checkbox[itemId=payGranularPrivHeader_cancelApproveIcon]');
				var headerImportIcon = me.down('checkbox[itemId=payGranularPrivHeader_importIcon]');
				var newEntryJsonAll = [];
				for (var index  in payGranularFeatureDataBackup){
					var orginalObj = payGranularFeatureDataBackup[index];
					var accountId =orginalObj.accountId;
					var pkgId =orginalObj.packageId;
					var objectKey = accountId+'_'+pkgId;
					//var recordKeyNo = orginalObj.recordKeyNo;
					var tempFlag=true;
					Ext.each(jsonArrayGlobal, function(fieldNew, indexNew) {
						var accountIdNew =fieldNew.accountId;
						var pkgIdNew =fieldNew.packageId;
						var objectKeyNew = accountIdNew+'_'+pkgIdNew;
						if(objectKeyNew==objectKey)
						{
							tempFlag = false;
							if(headerViewIcon && headerViewIcon.checked){
								jsonArrayGlobal[indexNew].privileges.VIEW =true;
							}
							if(headerEditIcon && headerEditIcon.checked){
								jsonArrayGlobal[indexNew].privileges.EDIT = true;
							}
							if(headerDeleteIcon && headerDeleteIcon.checked){
								jsonArrayGlobal[indexNew].privileges.DELETE = true;
							}
							if(headerApproveIcon && headerApproveIcon.checked){
								jsonArrayGlobal[indexNew].privileges.APPROVE = true;
							}
							if(headerQuickApproveIcon && headerQuickApproveIcon.checked){
								jsonArrayGlobal[indexNew].privileges.QUICKAPPROVE = true;
							}
							if(headerRecallIcon && headerRecallIcon.checked){
								jsonArrayGlobal[indexNew].privileges.RECALL = true;
							}
							if(headerCancelIcon && headerCancelIcon.checked){
								jsonArrayGlobal[indexNew].privileges.CANCEL = true;
							}
							if(headerCancelApproveIcon && headerCancelApproveIcon.checked){
								jsonArrayGlobal[indexNew].privileges.CANCELAPPROVE = true;
							}
							if(headerImportIcon && headerImportIcon.checked){
								jsonArrayGlobal[indexNew].privileges.IMPORT = true;
							}
						}
					});
					if(tempFlag)
					{
						var accountText = orginalObj.accountNo + '|' + orginalObj.accountName;
						var packageKey = orginalObj.productCategoryCode + '|'
										+ orginalObj.packageId;
					if (me.allPackagesSelectedFlag == 'Y'
						|| payPackageAssignedMap[packageKey] == true) {
								if (me.allAccountsSelectedFlag == 'Y'
									|| accountAssignedMap[accountText] == true)
								{		
									var newEntryJson = {};
									newEntryJson['accountId'] = accountId;
									newEntryJson['packageId'] = pkgId;
									var view=false;
									var edit=false;
									var auth=false;
									var quickapprove=false;
									var recall=false;
									var cancel=false;
									var cancelapprove=false;
									var vDelete=false;
									var vImport=false;
									var flagUpdate = false;
									
									if(headerViewIcon && headerViewIcon.checked){
										view =true;
										flagUpdate = true;
									}
									if(headerEditIcon && headerEditIcon.checked){
										edit = true;
										flagUpdate = true;
									}
									if(headerDeleteIcon && headerDeleteIcon.checked){
										vDelete = true;
										flagUpdate = true;
									}
									if(headerApproveIcon && headerApproveIcon.checked){
										auth = true;
										flagUpdate = true;
									}
									if(headerQuickApproveIcon && headerQuickApproveIcon.checked){
										quickapprove = true;
										flagUpdate = true;
									}
									if(headerRecallIcon && headerRecallIcon.checked){
										recall = true;
										flagUpdate = true;
									}
									if(headerCancelIcon && headerCancelIcon.checked){
										cancel = true;
										flagUpdate = true;
									}
									if(headerCancelApproveIcon && headerCancelApproveIcon.checked){
										cancelapprove = true;
										flagUpdate = true;
									}
									if(headerImportIcon && headerImportIcon.checked){
										vImport = true;
										flagUpdate = true;
									}
									var privileges = {'VIEW':view,'EDIT':edit,'AUTH':auth,'QUICKAPPROVE':quickapprove,'RECALL':recall,'CANCEL':cancel,'CANCELAPPROVE':cancelapprove,'DELETE':vDelete,'IMPORT':vImport};
									newEntryJson['privileges'] = privileges;
									if(flagUpdate)
										newEntryJsonAll.push(newEntryJson);
								}
						}
					}
				}
			}
			if(!Ext.isEmpty(newEntryJsonAll))
				jsonArrayGlobal = jsonArrayGlobal.concat(newEntryJsonAll);
			jsonObj['accountPackagePrivileges'] = jsonArrayGlobal;
			//console.log("length :"+jsonArray.length);
			//console.log("jsonData :"+JSON.stringify(jsonObj));
				if (!Ext.isEmpty(me.fnCallback)
						&& typeof me.fnCallback == 'function') {
					me.fnCallback(jsonObj);
					me.close();
				}
			},setPayGranularOptionsTemp : function(jsonObj) {
				document.getElementById("payCenterGranularPermissions").value = JSON.stringify(jsonObj);
			},
			saveItemsTemp : function() {	
					var me = this;
					var jsonData = {};
					Ext.each(granularPrivfieldJson, function(field, index) {
						var featureId = field.itemId;
						var accountId =field.accountId;
						var pkgId =field.packageId;
						var element = me.down('checkboxfield[itemId='+featureId+']');
						var objectKey = accountId+'_'+pkgId;
							
						if(element != null && element != undefined && !element.hidden){
										
									var mode = element.mode;
									//console.log("jsonData :"+JSON.stringify(jsonData));
								if(!(objectKey in jsonData)){ 
										//console.log("accountiD adding for first time :"+accountId);
										var newEntry = {};
										newEntry['accountId'] = accountId;
										newEntry['packageId'] = pkgId;
										newEntry['privileges'] = {};
							     		jsonData[objectKey] = newEntry;
									}
									
															
									if('VIEW' == mode){
										jsonData[objectKey]['privileges']['VIEW'] = element.getValue();
									}
									if('EDIT' == mode){
										jsonData[objectKey]['privileges']['EDIT'] = element.getValue();
									}
									if('AUTH' == mode){
										jsonData[objectKey]['privileges']['AUTH'] = element.getValue();
									}
									if('QUICKAPPROVE' == mode){
										jsonData[objectKey]['privileges']['QUICKAPPROVE'] = element.getValue();
									}
									if('RECALL' == mode){
										jsonData[objectKey]['privileges']['RECALL'] = element.getValue();
									}
									if('CANCEL' == mode){
										jsonData[objectKey]['privileges']['CANCEL'] = element.getValue();
									}
									if('CANCELAPPROVE' == mode){
										jsonData[objectKey]['privileges']['CANCELAPPROVE'] = element.getValue();
									}
									if('DELETE' == mode){
										jsonData[objectKey]['privileges']['DELETE'] = element.getValue();;
									}
									if('IMPORT' == mode){
										jsonData[objectKey]['privileges']['IMPORT'] = element.getValue();;
									}
								
									for(var mode in jsonData[objectKey]['privileges']) {
										if( !jsonData[objectKey]['privileges']['VIEW'] && jsonData[objectKey]['privileges'][mode]){
										   	jsonData[objectKey]['privileges']['VIEW'] = true;
										   	break;
										}
									}
							}
			});
			
			var jsonObj = {};
			var jsonArray = [];
			jsonObj['serviceType'] = 'PAY';
			jsonObj['moduleCode'] = '02';
			for (var index  in jsonData){
				var orginalObj = jsonData[index];
			    var accountId =orginalObj.accountId;
			    var pkgId =orginalObj.packageId;
				var objectKey = accountId+'_'+pkgId;
				var recordKeyNo = orginalObj.recordKeyNo;
			  	if((objectKey in jsonData)){ 
                       var newObj = jsonData[objectKey];
					   jsonArray.push(newObj);
					   
				}
			}
			var v1 =true;
			Ext.each(jsonArray, function(field, index) {
					var accountId =field.accountId;
					var pkgId =field.packageId;
					var objectKey = accountId+'_'+pkgId;
				//if(objectKey in jsonData){
					var newObj = jsonData[objectKey];
					Ext.each(jsonArrayGlobal, function(fieldNew, indexNew) {
						var accountIdNew =fieldNew.accountId;
						var pkgIdNew =fieldNew.packageId;
						var objectKeyNew = accountIdNew+'_'+pkgIdNew;
						//if(objectKeyNew in jsonArrayGlobal) {
							if(objectKeyNew==objectKey){ 
								v1=false;
								var newObj1 = jsonArrayGlobal[objectKeyNew];
								if(!Ext.isEmpty(newObj) && !Ext.isEmpty(newObj1))
								{
								  if (newObj1.privileges.VIEW!= newObj['privileges']['VIEW']
									||newObj1.privileges.EDIT!= newObj['privileges']['EDIT']
									||newObj1.privileges.AUTH!= newObj['privileges']['AUTH']
									||newObj1.privileges.QUICKAPPROVE!= newObj['privileges']['QUICKAPPROVE']
									||newObj1.privileges.RECALL!= newObj['privileges']['RECALL']
									||newObj1.privileges.CANCEL!= newObj['privileges']['CANCEL']
									||newObj1.privileges.CANCELAPPROVE!= newObj['privileges']['CANCELAPPROVE']
									||newObj1.privileges.DELETE!= newObj['privileges']['DELETE']
									||newObj1.privileges.IMPORT!= newObj['privileges']['IMPORT'])
									{
										jsonArrayGlobal[indexNew].privileges=jsonArray[index].privileges;
									}
								}
							/*else{
								jsonArrayGlobal.push(newObj);
								}*/
						//}
						}
					});
				//}	
			});
			if (Ext.isEmpty(jsonArrayGlobal)){
				jsonArrayGlobal = jsonArray;
			}else if(v1){
				jsonArrayGlobal = jsonArrayGlobal.concat(jsonArray);
			}
			jsonObj['accountPackagePrivileges'] = jsonData;
				if (!Ext.isEmpty(me.fnCallback)
						&& typeof me.fnCallback == 'function') {
					me.setPayGranularOptionsTemp(jsonObj);
					//me.close();
				}
			}
});
function checkPayGranularViewIfNotSelected(isSelected,panelPointer,obj){
	if(null != panelPointer && undefined != panelPointer){
		if (isSelected){
			//var viewHeaderItemId = Ext.ComponentQuery.query('checkbox[itemId=payGranularPrivHeader_viewIcon]');
			//viewHeaderItemId[0].setValue(true);
			var viewItemId =obj.accountId + "_" + obj.packageId + "_VIEW";
			var view_chk_box = panelPointer.down('checkbox[itemId='+viewItemId+']');
			if(null != view_chk_box && undefined != view_chk_box && view_chk_box.value== false){
				view_chk_box.setValue(true);
				/*view_chk_box.defVal = true;*/
			}
		}else{
			if("VIEW"===obj.mode){
				var editIconItemId = panelPointer.down('checkbox[itemId='+obj.accountId + "_" + obj.packageId + '_EDIT' +']');
				if( editIconItemId )
				{
					editIconItemId.setValue( false );
					editIconItemId.defVal = false;
				}
				var authIconItemId = panelPointer.down('checkbox[itemId='+obj.accountId + "_" + obj.packageId + '_AUTH' +']');
				if( authIconItemId )
				{
					authIconItemId.setValue( false );
					authIconItemId.defVal = false;
				}
				var quickauthIconItemId = panelPointer.down('checkbox[itemId='+obj.accountId + "_" + obj.packageId + '_QUICKAPPROVE' +']');
				if( quickauthIconItemId )
				{
					quickauthIconItemId.setValue( false );
					quickauthIconItemId.defVal = false;
				}
				var recallIconItemId = panelPointer.down('checkbox[itemId='+obj.accountId + "_" + obj.packageId + '_RECALL' +']');
				if( recallIconItemId )
				{
					recallIconItemId.setValue( false );
					recallIconItemId.defVal = false;
				}
				var cancelIconItemId = panelPointer.down('checkbox[itemId='+obj.accountId + "_" + obj.packageId + '_CANCEL' +']');
				if( cancelIconItemId )
				{
					cancelIconItemId.setValue( false );
					cancelIconItemId.defVal = false;
				}
				var cancelapproveIconItemId = panelPointer.down('checkbox[itemId='+obj.accountId + "_" + obj.packageId + '_CANCELAPPROVE' +']');
				if( cancelapproveIconItemId )
				{
					cancelapproveIconItemId.setValue( false );
					cancelapproveIconItemId.defVal = false;
				}
				var deleteIconItemId = panelPointer.down('checkbox[itemId='+obj.accountId + "_" + obj.packageId + '_DELETE' +']');
				if( deleteIconItemId )
				{
					deleteIconItemId.setValue( false );
					deleteIconItemId.defVal = false;
				}
				var importIconItemId = panelPointer.down('checkbox[itemId='+obj.accountId + "_" + obj.packageId + '_IMPORT' +']');
				if( importIconItemId )
				{
					importIconItemId.setValue( false );
					importIconItemId.defVal = false;
				}
			}
		}
	}

};
