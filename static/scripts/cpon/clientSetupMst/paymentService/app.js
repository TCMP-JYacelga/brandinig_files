var objWidgetsSelectionPopup = null;
var objActionsSelectionPopup = null;
var objPaymentProfileSeek = null;
var objPayFeaturePopup = null;
var objProfileFilterPopup = null;
var objPayCompanyIdPopup = null;
var isPaymentOptionsAllSelected = null;
var objAlertProfileFilterPopup = null;
var objReportProfileFilterPopup = null;
var objBillingProfileFilterPopup = null;
var objSystemReceiverProfileFilterPopup = null;
var objProfileView = null;
var objLineCodesPopup = null;
var saveItemsFn=null;
var serviceURLFn=null;
var pkgTypeFilter = '\'None\'';
Ext.Loader.setConfig({
			enabled : true,
			disableCaching : false,
			setPath : {
				'Ext' : 'static/js/extjs4.2.1/src',
				'Ext.ux' : 'static/js/extjs4.2.1/src/ux'
			}
		});
	
Ext.application({
	name : 'CPON',
	appFolder : 'static/scripts/cpon/clientSetupMst/paymentService/app',
	requires : ['CPON.view.ClientPayServiceView','CPON.view.PayFeaturePopup','CPON.view.CopyProfileSeek','CPON.view.PayCompanyIDPopup',
	'CPON.view.ProfileFilterPopup','CPON.view.CollectionFeaturePopup','CPON.view.LineCodesPopup','Ext.ux.gcp.FilterPopUpView' ],
	controllers : ['CPON.controller.ClientPayServiceController'],
	launch : function() {
        Ext.Ajax.timeout = Ext.isEmpty( requestTimeout ) ? 60000 : parseInt( requestTimeout,10 ) * 1000 * 60;
		serviceURLFn = function (popup) {
            var strUrl="";
            strUrl = '&featureType=' + popup.featureType + '&module='
					+ popup.module + '&profileId=' + popup.profileId + '&id=' + encodeURIComponent(parentkey)
					+ '&viewmode='+viewmode;

           return strUrl;
          };
          saveItemsFn= function(popup) {
				var me = popup;
				var grid = me.down('smartgrid');
				var checkValueEle=document.getElementById(me.checkboxId);
				if (me.hiddenValueField != null && me.hiddenValuePopUpField != null) {
				var objSelectedRecords = grid.selectedRecordList;
				var objDeSelectedRecordList = grid.deSelectedRecordList;
				var keyNode = me.keyNode;
				var selectedList = new Array();
				var deSelectedList = new Array();
				var iCount = 0;
				for (; iCount < objSelectedRecords.length; iCount++) {
					selectedList.push(objSelectedRecords[iCount][keyNode]);
				}
				iCount = 0;
				for (; iCount < objDeSelectedRecordList.length; iCount++) {
					deSelectedList
							.push(objDeSelectedRecordList[iCount][keyNode]);
				}
				var jsonObj = {
					"selectedRecords" : selectedList.join(),
					"deSelectedRecords" : deSelectedList.join()
				}
				document.getElementById(me.hiddenValueField).value = Ext
						.encode(jsonObj);
				if (null != document.getElementById(me.hiddenValuePopUpField)
						&& undefined != document
								.getElementById(me.hiddenValuePopUpField)) {
					document.getElementById(me.hiddenValuePopUpField).value = 'Y';
				}
			}
						
				if(checkValueEle != null && checkValueEle.getAttribute('src').indexOf('/icon_unchecked')!=-1 && me.userMode != 'VIEW' && me.userMode != 'VERIFY'){
				var records = grid.selectedRecordList;
				var derecords = grid.deSelectedRecordList;
				var blnIsUnselected = records.length < grid.store
						.getTotalCount() ? true : false;
				
				if (me.displayCount && !Ext.isEmpty(me.fnCallback)
						&& typeof me.fnCallback == 'function') {
					me.fnCallback(records,derecords, blnIsUnselected);
					selectedr = [];
					
				}
				}
				me.hide();
			};
		objProfileView = Ext.create('CPON.view.ClientPayServiceView', {
					renderTo : 'payServiceDiv'
				});
	objPaymentProfileSeek = Ext.create('CPON.view.CopyProfileSeek', {
					itemId : 'paymentProfileseek',
					title : getLabel('copypaymentprofile', 'Copy Payment Feature Profile'),
					strUrl : 'services/copyProfile/paymentProfileSeek.json',
					columnName : getLabel('pmtfeatureprfname', 'Payment Feature Profile Name'),
					actionUrl : 'doCopyPaymentProfile.form'
						});
	/*objWidgetsSelectionPopup = Ext.create('Ext.ux.gcp.FilterPopUpView',
				{
					fnCallback : setSelectedWidgetItems,
					title :  getLabel('Widgets', 'Widgets'),
					labelId : 'widgetCnt',
					keyNode : 'value',
					itemId : 'widgetSelectionPopup',
					checkboxId:'chkAllWidgetsSelectedFlag',
					displayCount:true,
					profileId :adminFeatureProfileId,
					featureType:'W',
					responseNode :'filter',
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
							fields : ['name', 'value','isAssigned','readOnly'],
					proxyUrl : 'cpon/clientServiceSetup/cponFeatures',
					rootNode : 'd.filter',
					totalRowsNode : 'd.count'
					      },
					columnModel : [{
										colDesc : getLabel('widgetsName', 'Widget Name'),
										colId : 'name',
										colHeader : getLabel('widgetsName', 'Widget Name'),
										sortable : false,
										width : 517
									}]
					   },
					cfgShowFilter:true,
					//cfgFilterLabel:'Widgets',
					autoCompleterEmptyText : getLabel('lbl.serachbywidget','Search by Widget Name'),
					 cfgAutoCompleterUrl:'cponFeatures',
						cfgUrl:'cpon/clientServiceSetup/{0}',
						paramName:'filterName',
						dataNode:'name',
						rootNode : 'd.filter',
						autoCompleterExtraParam:
							[{
								key:'featureType',value:'W'
							},{
								key:'module',value: srvcCode
							},{
								key:'profileId',value: adminFeatureProfileId
							},{
								key:'id',value: encodeURIComponent(parentkey)
							}],
					module : srvcCode,
					userMode: viewmode,
					hiddenValueField : 'selectedWidgets',
					hiddenValuePopUpField :'popupWidgetsSelectedFlag',
					savefnCallback :saveItemsFn,
					urlCallback :serviceURLFn
					/*listeners : {
						beforeshow : function(t) {
							var pay_grid_Container = objWidgetsSelectionPopup.down('container[itemId="gridContainer"]');
							pay_grid_Container.maxHeight = 390;
						},
						resize : function(){
					    this.center();
					   }
					}*/
				//});
				/*objActionsSelectionPopup = Ext.create('Ext.ux.gcp.FilterPopUpView',
				{
					fnCallback : setSelectedActionItems,
					title : getLabel('actionlinks', 'Action Links'),
					labelId : 'actionCnt',
					keyNode : 'value',
					itemId : 'actionSelectionPopup',
					checkboxId:'chkAllLinksSelectedFlag',
					displayCount:true,
					profileId :adminFeatureProfileId,
					featureType:'L',
					responseNode :'filter',
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
							fields : ['name', 'value','isAssigned','readOnly'],
					proxyUrl : 'cpon/clientServiceSetup/cponFeatures',
					rootNode : 'd.filter',
					totalRowsNode : 'd.count'
					      },
					columnModel : [{
										colDesc : getLabel('actionLinkNm', 'Action Links Name'),
										colId : 'name',
										colHeader : getLabel('actionLinkNm', 'Action Links Name'),
										sortable : false,
										width : 517
									}]
					   },
					cfgShowFilter:true,
					//cfgFilterLabel:'Action Links',
					autoCompleterEmptyText : getLabel('searchByName', 'Search By Action Link Name'),
					 cfgAutoCompleterUrl:'cponFeatures',
						cfgUrl:'cpon/clientServiceSetup/{0}',
						paramName:'filterName',
						dataNode:'name',
						rootNode : 'd.filter',
						autoCompleterExtraParam:
							[{
								key:'featureType',value:'L'
							},{
								key:'module',value: srvcCode
							},{
								key:'profileId',value: adminFeatureProfileId
							},{
								key:'id',value: encodeURIComponent(parentkey)
							}],
					module : srvcCode,
					userMode: viewmode,
					hiddenValueField : 'selectedActionLinks',
					hiddenValuePopUpField :'popupLinksSelectedFlag',
					savefnCallback :saveItemsFn,
					urlCallback :serviceURLFn
					/*listeners : {
						beforeshow : function(t) {
							var pay_grid_Container = objActionsSelectionPopup.down('container[itemId="gridContainer"]');
							pay_grid_Container.maxHeight = 390;
						},
						resize : function(){
							this.center();
						}
					}*/
				//});
						

		if (!isEmpty(srvcCode) && srvcCode == '05') {
			objLineCodesPopup = Ext.create('CPON.view.LineCodesPopup', {
						itemId : 'collectionLineCodesPopup',
						fnCallback : setSelectedLineItems,
						profileId : adminFeatureProfileId,
						featureType : 'LI',
						module : '05'
					});
		}
//	Commenting service calls as UI code is commented
//				objFXProfileFilterPopup = Ext.create('CPON.view.ProfileFilterPopup',
//						{
//					fnCallback : showSelectedFields
//				});
//				objWorkflowProfileFilterPopup = Ext.create('CPON.view.ProfileFilterPopup',
//						{
//					fnCallback : showSelectedFields
//				});
//				objAlertProfileFilterPopup = Ext.create('CPON.view.ProfileFilterPopup',
//						{
//					fnCallback : showSelectedFields
//				});
//				objReportProfileFilterPopup = Ext.create('CPON.view.ProfileFilterPopup',
//						{
//					fnCallback : showSelectedFields
//				});
//				objBillingProfileFilterPopup = Ext.create('CPON.view.ProfileFilterPopup',
//						{
//					fnCallback : showSelectedFields
//				});
//				
//				objSystemReceiverProfileFilterPopup = Ext.create('CPON.view.ProfileFilterPopup',
//						{
//					fnCallback : showSelectedFields
//				});
	}
});
function resizeContentPanel() {
	if (!Ext.isEmpty(objProfileView)) {
		objProfileView.hide();
		objProfileView.show();
	}
}

function updateAttachPackageLink(enableDisableFlag){
    CPON.getApplication().fireEvent('checkClicked',enableDisableFlag);
}


function showPaymentProfileSeek() {
	if (null != objPaymentProfileSeek) {
		objPaymentProfileSeek.show();
	}
}

function getPaymentFeaturePopup(displayPopup) {
	var selectFlag = $('#allPaymentFeaturesSelectedFlag').val();
	if (!Ext.isEmpty(selectFlag))
		isPaymentOptionsAllSelected = selectFlag;
	else
		isPaymentOptionsAllSelected = 'N';
	if((viewmode == "VIEW" || viewmode == "MODIFIEDVIEW") && !Ext.isEmpty(objPayFeaturePopup) && !displayPopup)
	{
		objPayFeaturePopup.destroy();
		objPayFeaturePopup = null;
	}
	if (!Ext.isEmpty(objPayFeaturePopup)) {
		/*
		 * objPayFeaturePopup = Ext.create('CPON.view.PayFeaturePopup', { itemId :
		 * 'payFeaturePopup', fnCallback : setSelectedPayFeatureItems, profileId :
		 * adminFeatureProfileId, featureType : 'P', module : srvcCode, title :
		 * getLabel('payAdvanceOptions', 'Payment Advance Options'),
		 * isAllSelected : isPaymentOptionsAllSelected });
		 */
		if ('Y' === isPaymentOptionsAllSelected) {
			var brCheckBoxes = objPayFeaturePopup.query('container');
			for (var i = 0; i < brCheckBoxes.length; i++) {
				var cBox = brCheckBoxes[i].query('checkbox');
				for (var j = 0; j < cBox.length; j++) {
					if (!cBox[j].isDisabled())
						cBox[j].setValue(true);
				}
			}
			var brTextFields = objPayFeaturePopup.query('textfield');
			for (var i = 0; i < brTextFields.length; i++) {
				if ("textfield" === brTextFields[i].xtype) {
					brTextFields[i].setValue("999");
				}
			}
		} else if ('N' === isPaymentOptionsAllSelected
				&& 'Y' === allOptionsSelectionInModel) {
			var brCheckBoxes = objPayFeaturePopup.query('container');
			for (var i = 0; i < brCheckBoxes.length; i++) {
				var cBox = brCheckBoxes[i].query('checkbox');
				for (var j = 0; j < cBox.length; j++) {
					cBox[j].setValue(false);
				}
			}
			var brTextFields = objPayFeaturePopup.query('textfield');
			for (var i = 0; i < brTextFields.length; i++) {
				if ("textfield" === brTextFields[i].xtype) {
					brTextFields[i].setValue("999");
				}
			}
		}
		handleTemplateFeatureDependencies();
		//objPayFeaturePopup.show();
	} else {
		objPayFeaturePopup = Ext.create('CPON.view.PayFeaturePopup', {
					itemId : 'payFeaturePopup',
					fnCallback : setSelectedPayFeatureItems,
					profileId : adminFeatureProfileId,
					featureType : 'P',
					module : srvcCode,
					title : getLabel('payAdvanceOptions',
							'Payment Advance Options'),
					isAllSelected : isPaymentOptionsAllSelected,
					listeners : {
						resize : function() {
							this.center();
						},
						destroy : function(){
							objPayFeaturePopup = null;
						}
					}
				});
		objPayFeaturePopup.isAllSelected = isPaymentOptionsAllSelected;
		if ('Y' === isPaymentOptionsAllSelected) {
			var brCheckBoxes = objPayFeaturePopup.query('container');
			for (var i = 0; i < brCheckBoxes.length; i++) {
				var cBox = brCheckBoxes[i].query('checkbox');
				for (var j = 0; j < cBox.length; j++) {
					if (!cBox[j].isDisabled())
						cBox[j].setValue(true);
				}
			}
			var brTextFields = objPayFeaturePopup.query('textfield');
			for (var i = 0; i < brTextFields.length; i++) {
				if ("textfield" === brTextFields[i].xtype) {
					brTextFields[i].setValue("999");
				}
			}
		} else if ('N' === isPaymentOptionsAllSelected
				&& 'Y' === allOptionsSelectionInModel) {
			var brCheckBoxes = objPayFeaturePopup.query('container');
			for (var i = 0; i < brCheckBoxes.length; i++) {
				var cBox = brCheckBoxes[i].query('checkbox');
				for (var j = 0; j < cBox.length; j++) {
					cBox[j].setValue(false);
				}
			}
			var brTextFields = objPayFeaturePopup.query('textfield');
			for (var i = 0; i < brTextFields.length; i++) {
				if ("textfield" === brTextFields[i].xtype) {
					brTextFields[i].setValue("999");
				}
			}
		}
		handleTemplateFeatureDependencies();
	}
	if(displayPopup){
		objPayFeaturePopup.show();
		objPayFeaturePopup.center();
	}
	else{
		objPayFeaturePopup.show();
		objPayFeaturePopup.hide();
	}
	if(btnViewOld){
				for(var i=0;i<admPrivList.length;i++)
				{
					var tdArray1 = new Array();
					tdArray1 = $('#Advpopup'+i).parent().parent().parent().children();
					if(!Ext.isEmpty(tdArray1[1]))
					{
						if(admPrivList[i] === 'modifiedFieldValue')
						{
							$('#'+tdArray1[1].id).children().addClass('modifiedmenus');
						}
						else if(admPrivList[i] === 'newFieldGridValue')
						{
							$('#'+tdArray1[1].id).children().addClass('newFieldPopupValue');
						}
					}					
				}
				for(var i=0;i<admPrivAutoAppList.length;i++)
				{
					var tdArray1 = new Array();
					tdArray1 = $('#Advpopup'+i).parent().parent().parent().children();
					if(!Ext.isEmpty(tdArray1[1]))
						{
						if(admPrivAutoAppList[i] === 'modifiedFieldValue')
						{
							$('#'+tdArray1[2].id).children().addClass('modifiedmenus');
						}
						else if(admPrivAutoAppList[i] === 'newFieldGridValue')
						{
							$('#'+tdArray1[2].id).children().addClass('newFieldPopupValue');
						}
					}					
				}
				
			var brCheckBoxes = objPayFeaturePopup.query('container');
			for (var i = 0; i < brCheckBoxes.length; i++) {
				var cBox = brCheckBoxes[i].query('checkbox');
				for (var j = 0; j < cBox.length; j++) {
					if(cBox[j].boxLabel.includes('newFieldGridValue'))
					{
						$('#VIEW_'+cBox[j].featureId).addClass('newFieldGridValue');
					}
					else if(cBox[j].boxLabel.includes('modifiedFieldValue'))
					{
						$('#VIEW_'+cBox[j].featureId).addClass('modifiedFieldValue');
					}
					else if(cBox[j].boxLabel.includes('deletedFieldValue'))
					{
						$('#VIEW_'+cBox[j].featureId).addClass('deletedFieldValue');
					}
				}
			}
	}
	else
	{
		for(var i=0;i<admPrivList.length;i++)
				{
					var tdArray1 = new Array();
					tdArray1 = $('#Advpopup'+i).parent().parent().parent().children();
					if(!Ext.isEmpty(tdArray1[1]))
					{
						if(admPrivList[i] === 'modifiedFieldValue')
						{							
						    $('#'+tdArray1[1].id).children().removeClass('modifiedmenus');
						}
					   if(admPrivList[i] === 'newFieldGridValue')
						{
							$('#'+tdArray1[1].id).children().removeClass('newFieldPopupValue');
						}	
					}					
				}
				for(var i=0;i<admPrivAutoAppList.length;i++)
				{
					var tdArray1 = new Array();
					tdArray1 = $('#Advpopup'+i).parent().parent().parent().children();
					if(!Ext.isEmpty(tdArray1[1]))
					{
						if(admPrivAutoAppList[i] === 'modifiedFieldValue')
						{	
							$('#'+tdArray1[2].id).children().removeClass('modifiedmenus');
						}		
						if(admPrivAutoAppList[i] === 'newFieldGridValue')
						{
							$('#'+tdArray1[2].id).children().removeClass('newFieldPopupValue');
						}	
					}					
				}
		if(!btnViewOld && displayPopup)//!btnViewOld &&
		{
			var brCheckBoxes = objPayFeaturePopup.query('container');
			for (var i = 0; i < brCheckBoxes.length; i++) {
				var cBox = brCheckBoxes[i].query('checkbox');
				for (var j = 0; j < cBox.length; j++) {
					if(cBox[j].boxLabel.includes('newFieldGridValue') || cBox[j].boxLabel.includes('modifiedFieldValue')
						|| cBox[j].boxLabel.includes('deletedFieldValue'))
					{
						$('#VIEW_'+cBox[j].featureId).removeClass('newFieldGridValue');
						$('#VIEW_'+cBox[j].featureId).removeClass('modifiedFieldValue');
						$('#VIEW_'+cBox[j].featureId).removeClass('deletedFieldValue');
					}
				}
			}
		}
	}
}
function handleTemplateFeatureDependencies() {
	var objSemiRep = null, objRep = null, objNonRep = null;
	if (isPaymentTemplateApplicable === "Y") {
		var payCheckBoxes = objPayFeaturePopup.query('container');
		for (var i = 0; i < payCheckBoxes.length; i++) {
			if (payCheckBoxes[i].id == "templatesSection") {
				var cBox = payCheckBoxes[i].query('checkbox');
				for (var j = 0; j < cBox.length; j++) {
					if (!isEmpty(cBox[j].featureId)) {
						if ('REP' === cBox[j].featureId)
							objRep = cBox[j];
						if ('SREP' === cBox[j].featureId)
							objSemiRep = cBox[j];
						if ('NREP' === cBox[j].featureId)
							objNonRep = cBox[j];
					}
				}
				payCheckBoxes[i].show();
				if ((null!=objRep && !objRep.getValue()) && (null!=objSemiRep && !objSemiRep.getValue())
						&& (null!=objNonRep && !objNonRep.getValue())) {
					objRep.setValue(true);
					objRep.setDisabled(true);
				}

			}
		}
		if (isPaymentTemplateApplicable === "Y"
				&& isPaymentTemplateApprovalApplicable === "N") {
			for (var i = 0; i < payCheckBoxes.length; i++) {
				if (payCheckBoxes[i].id == "templatesApprovalSection") {
					var cBox = payCheckBoxes[i].query('checkbox');
					for (var j = 0; j < cBox.length; j++) {
						cBox[j].setValue(false);
					}
					payCheckBoxes[i].hide();
				}
			}
		}
		if (isPaymentTemplateApplicable === "Y"
				&& isPaymentTemplateApprovalApplicable === "Y") {
			for (var i = 0; i < payCheckBoxes.length; i++) {
				if (payCheckBoxes[i].id == "templatesApprovalSection") {
					payCheckBoxes[i].show();
				}
			}
		}
	} else {
		var payCheckBoxes = objPayFeaturePopup.query('container');
		for (var i = 0; i < payCheckBoxes.length; i++) {
			if (payCheckBoxes[i].id == "templatesSection"
					|| payCheckBoxes[i].id == "templatesApprovalSection") {
				var cBox = payCheckBoxes[i].query('checkbox');
				for (var j = 0; j < cBox.length; j++) {
					cBox[j].setValue(false);
				}
				payCheckBoxes[i].hide();
			}
		}
	}
}
function getCollectionFeaturePopup(displayPopup) {
	var selectFlag = $('#allPaymentFeaturesSelectedFlag').val();
	if (!Ext.isEmpty(selectFlag))
		isPaymentOptionsAllSelected = selectFlag;
	else
		isPaymentOptionsAllSelected = 'N';
	if((viewmode == "VIEW" || viewmode == "MODIFIEDVIEW") && !Ext.isEmpty(objPayFeaturePopup) && !displayPopup)
	{
		objPayFeaturePopup.destroy();
		objPayFeaturePopup = null;
	}
	if (!Ext.isEmpty(objPayFeaturePopup) && 'N' === isPaymentOptionsAllSelected) {
		// objPayFeaturePopup = Ext.create('CPON.view.CollectionFeaturePopup', {
		// itemId : 'collectionFeaturePopup',
		// fnCallback : setSelectedCollectionFeatureItems,
		// profileId : adminFeatureProfileId,
		// featureType : 'P',
		// module : srvcCode,
		// title : getLabel('collectionAdvanceOptions', 'Receivables Advance
		// Options'),
		// isAllSelected : isPaymentOptionsAllSelected
		//		});
		
		if('Y'===allOptionsSelectionInModel)
		{
			var brCheckBoxes = objPayFeaturePopup.query('checkboxgroup');
			for ( var i = 0; i < brCheckBoxes.length; i++) {
				var cBox = brCheckBoxes[i].query('checkbox');
				for ( var j = 0; j < cBox.length; j++) {
					cBox[j].setValue(false);
				}
			}
			var brTextFields = objPayFeaturePopup.query('textfield');
			for ( var i = 0; i < brTextFields.length; i++) {
				if ("textfield" === brTextFields[i].xtype) {
					brTextFields[i].setValue("999");
				}
			}
		}
		//objPayFeaturePopup.show();
		//objPayFeaturePopup.center();
	} else {
		objPayFeaturePopup = Ext.create('CPON.view.CollectionFeaturePopup', {
			itemId : 'collectionFeaturePopup',
			fnCallback : setSelectedCollectionFeatureItems,
			profileId : adminFeatureProfileId,
			featureType : 'P',
			module : srvcCode,
			title : getLabel('collectionAdvanceOptions', 'Receivables Advance Options'),
			isAllSelected : isPaymentOptionsAllSelected
		});
		objPayFeaturePopup.isAllSelected = isPaymentOptionsAllSelected;
		if ('Y' === isPaymentOptionsAllSelected) {
			var brCheckBoxes = objPayFeaturePopup.query('checkboxgroup');
			for ( var i = 0; i < brCheckBoxes.length; i++) {
				var cBox = brCheckBoxes[i].query('checkbox');
				for ( var j = 0; j < cBox.length; j++) {
					if(!cBox[j].isDisabled())
					cBox[j].setValue(true);
				}
			}
			var brTextFields = objPayFeaturePopup.query('textfield');
			for ( var i = 0; i < brTextFields.length; i++) {
				if ("textfield" === brTextFields[i].xtype) {
					brTextFields[i].setValue("999");
				}
			}
		}
		else if('N' === isPaymentOptionsAllSelected && 
		'Y'===allOptionsSelectionInModel)
		{
			var brCheckBoxes = objPayFeaturePopup.query('checkboxgroup');
			for ( var i = 0; i < brCheckBoxes.length; i++) {
				var cBox = brCheckBoxes[i].query('checkbox');
				for ( var j = 0; j < cBox.length; j++) {
					cBox[j].setValue(false);
				}
			}
			var brTextFields = objPayFeaturePopup.query('textfield');
			for ( var i = 0; i < brTextFields.length; i++) {
				if ("textfield" === brTextFields[i].xtype) {
					brTextFields[i].setValue("999");
				}
			}
		}
		//objPayFeaturePopup.show();
		//objPayFeaturePopup.center();
	}
	if(displayPopup){
		objPayFeaturePopup.show();
		objPayFeaturePopup.center();
	}
	else{
		objPayFeaturePopup.show();
		objPayFeaturePopup.hide();
	}
	if(btnViewOld){
				for(var i=0;i<admPrivList.length;i++)
				{
					var tdArray1 = new Array();
					tdArray1 = $('#Advpopup'+i).parent().parent().parent().children();
					if(!Ext.isEmpty(tdArray1[1]))
					{
						if(admPrivList[i] === 'modifiedFieldValue')
						{
							$('#'+tdArray1[1].id).children().addClass('modifiedmenus');
						}
						else if(admPrivList[i] === 'newFieldGridValue')
						{
							$('#'+tdArray1[1].id).children().addClass('newFieldPopupValue');
						}
					}						
				}
				for(var i=0;i<admPrivAutoAppList.length;i++)
				{
					var tdArray1 = new Array();
					tdArray1 = $('#Advpopup'+i).parent().parent().parent().children();
					if(!Ext.isEmpty(tdArray1[1]))
					{
						if(admPrivAutoAppList[i] === 'modifiedFieldValue')
						{
							$('#'+tdArray1[2].id).children().addClass('modifiedmenus');
						}
						else if(admPrivAutoAppList[i] === 'newFieldGridValue')
						{
							$('#'+tdArray1[2].id).children().addClass('newFieldPopupValue');
						}		
					}					
				}
				
			var brCheckBoxes = objPayFeaturePopup.query('container');
			for (var i = 0; i < brCheckBoxes.length; i++) {
				var cBox = brCheckBoxes[i].query('checkbox');
				for (var j = 0; j < cBox.length; j++) {
					if(cBox[j].boxLabel.includes('newFieldGridValue'))
					{
						$('#VIEW_'+cBox[j].featureId).addClass('newFieldGridValue');
					}
					else if(cBox[j].boxLabel.includes('modifiedFieldValue'))
					{
						$('#VIEW_'+cBox[j].featureId).addClass('modifiedFieldValue');
					}
					else if(cBox[j].boxLabel.includes('deletedFieldValue'))
					{
						$('#VIEW_'+cBox[j].featureId).addClass('deletedFieldValue');
					}
				}
			}
	}
	else
	{
		for(var i=0;i<admPrivList.length;i++)
				{
					var tdArray1 = new Array();
				    tdArray1 = $('#Advpopup'+i).parent().parent().parent().children();
					if(!Ext.isEmpty(tdArray1[1]))
					{
						if(admPrivList[i] === 'modifiedFieldValue')
						{				
							$('#'+tdArray1[1].id).children().removeClass('modifiedmenus');
						}
						else if(admPrivList[i] === 'newFieldGridValue')
						{
							$('#'+tdArray1[1].id).children().removeClass('newFieldPopupValue');
						}
					}					
				}
				for(var i=0;i<admPrivAutoAppList.length;i++)
				{
					var tdArray1 = new Array();
					tdArray1 = $('#Advpopup'+i).parent().parent().parent().children();
				    if(!Ext.isEmpty(tdArray1[1]))
					{	
						if(admPrivAutoAppList[i] === 'modifiedFieldValue')
						{						
							$('#'+tdArray1[2].id).children().removeClass('modifiedmenus');
						}	
						else if(admPrivAutoAppList[i] === 'newFieldGridValue')
						{
							$('#'+tdArray1[2].id).children().removeClass('newFieldPopupValue');
						}	
					}					
				}
		if(!btnViewOld && displayPopup)//!btnViewOld &&
		{
			var brCheckBoxes = objPayFeaturePopup.query('container');
			for (var i = 0; i < brCheckBoxes.length; i++) {
				var cBox = brCheckBoxes[i].query('checkbox');
				for (var j = 0; j < cBox.length; j++) {
					if(cBox[j].boxLabel.includes('newFieldGridValue') || cBox[j].boxLabel.includes('modifiedFieldValue')
						|| cBox[j].boxLabel.includes('deletedFieldValue'))
					{
						$('#VIEW_'+cBox[j].featureId).removeClass('newFieldGridValue');
						$('#VIEW_'+cBox[j].featureId).removeClass('modifiedFieldValue');
						$('#VIEW_'+cBox[j].featureId).removeClass('deletedFieldValue');
					}
				}
			}
		}
	}
}

function getPayCompanyIdPopup() {
	objPayCompanyIdPopup = Ext.create('CPON.view.PayCompanyIDPopup');
	if (null != objPayCompanyIdPopup) {
		objPayCompanyIdPopup.show();
	}
}
function setSelectedPayFeatureItems(records, objJson, isUnselected) {
	var selectedAdminFItems = new Array();
	var items = records.items;
	var unSelected =false ;
	for (var i = 0; i < items.length; i++) {
		var val = items[i].data;

		var obj = {
			name : val.name,
			value : val.value,
			profileId : val.profileId,
			isAssigned : val.isAssigned,
			isAutoApproved : val.isAutoApproved
		};
		selectedAdminFItems.push(obj);
	}
	for (var i = 0; i < items.length; i++) 
	{
		var val = items[i].data;
		if(!val.isAssigned)
		{
			unSelected= true;
			break;
		}
	}
	if(!unSelected)
	{
		for (var i = 0; i < objJson.length; i++) 
		{
		 	if(!objJson[i].isAssigned)
			{
				unSelected= true;
				break;
			}
		}
	}
	if(unSelected)
	{
		$('#chkAllPayFeaturesSelectedFlag').attr('src',
				'static/images/icons/icon_unchecked.gif');
	}
	else
	{
		$('#chkAllPayFeaturesSelectedFlag').attr('src',
				'static/images/icons/icon_checked.gif');
	}
	
	strPaymentFeatureList = JSON.stringify(objJson);

	if ('S' === strClientType) {
		strPaymentPrevililegesList = JSON.stringify([]);
	} else {
		strPaymentPrevililegesList = JSON.stringify(selectedAdminFItems);
	}
	allpaySelectedrecords = [];
	popupPayFeaturesSelectedValue = 'Y';
	setDirtyBit();
}
function setSelectedCollectionFeatureItems(records, objJson , isUnselected) {
	var selectedAdminFItems = new Array();
	var items = records.items;
	var unSelected= false;
	for (var i = 0; i < items.length; i++) {
		var val = items[i].data;
		var obj = {
			name : val.name,
			value : val.value,
			profileId : val.profileId,
			isAssigned : val.isAssigned,
			isAutoApproved : val.isAutoApproved
		};
		selectedAdminFItems.push(obj);
	}
	strPaymentFeatureList = JSON.stringify(objJson);
	allpaySelectedrecords = [];
	popupPayFeaturesSelectedValue ='Y';
	if ('S' === clientType) {
		strPaymentPrevililegesList = JSON.stringify([]);
	} else {
		strPaymentPrevililegesList = JSON.stringify(selectedAdminFItems);
	}
	
	for (var i = 0; i < items.length; i++)
	 {
		var val = items[i].data;
		if(! val.isAssigned)
		{
			unSelected = true;
			break;
		}
	}
	if(!unSelected)
	{
		for (var i = 0; i < objJson.length; i++)
	 	{
			if(! objJson[i].isAssigned)
			{
				unSelected = true;
				break;
			}
		}
	}
	
	if(unSelected)
	{
		$('#chkAllPayFeaturesSelectedFlag').attr('src',
				'static/images/icons/icon_unchecked.gif');
	}
	else
	{
		$('#chkAllPayFeaturesSelectedFlag').attr('src',
				'static/images/icons/icon_checked.gif');
	}
	setDirtyBit();
}
function getPaySelectWidgetsPopup() {
	selectedr = [];
	var options;
	var optionsSelected = $('#selectedWidgets').val();
	if (!Ext.isEmpty(optionsSelected)) {
		options = optionsSelected.split(",");
		isPaymentWidgetsAllSelected = 'N';
	} else{
	var selectFlag = $('#allWidgetsSelectedFlag').val();
	if (!Ext.isEmpty(selectFlag))
		isPaymentWidgetsAllSelected = selectFlag;
	else
		isPaymentWidgetsAllSelected = 'N';
}
	if (Ext.isEmpty(objWidgetsSelectionPopup)) {
	
		objWidgetsSelectionPopup = Ext.create('Ext.ux.gcp.FilterPopUpView',
				{
					fnCallback : setSelectedWidgetItems,
					lastSelectedRecords : '',
					title :  getLabel('widget', 'Widget'),
					columnName :  getLabel('widget', 'Widget'),
					labelId : 'widgetCnt',
					lastSelectedWidgets : options,
					keyNode : 'value',
					itemId : 'widgetSelectionPopup',
					checkboxId:'chkAllWidgetsSelectedFlag',
					displayCount:true,
					profileId :adminFeatureProfileId,
					featureType:'W',
					responseNode :'filter',
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
							fields : ['name', 'value','isAssigned','readOnly'],
					proxyUrl : 'cpon/clientServiceSetup/cponFeatures',
					rootNode : 'd.filter',
					totalRowsNode : 'd.count'
					      },
					columnModel : [{
										colDesc : getLabel('widgetsName', 'Widget Name'),
										colId : 'name',
										colHeader : getLabel('widgetsName', 'Widget Name'),
										width : 330
									}]
					   },
					cfgShowFilter:true,
					userMode: viewmode,
					autoCompleterEmptyText : getLabel('lbl.serachbywidget','Search by Widget Name'),
					 cfgAutoCompleterUrl:'cponFeatures',
						cfgUrl:'cpon/clientServiceSetup/{0}',
						paramName:'filterName',
						dataNode:'name',
						rootNode : 'd.filter',
						autoCompleterExtraParam:
							[{
								key:'featureType',value:'W'
							},{
								key:'module',value: srvcCode
							},{
								key:'profileId',value: adminFeatureProfileId
							},{
								key:'id',value: encodeURIComponent(parentkey)
							}],
					module : srvcCode,
					hiddenValueField : 'selectedWidgets',
					hiddenValuePopUpField :'popupWidgetsSelectedFlag',
					savefnCallback :saveItemsFn,
					urlCallback :serviceURLFn
				});
		objWidgetsSelectionPopup.on('beforeshow' , function(t) {
			var pay_grid_Container = objWidgetsSelectionPopup.down('container[itemId="gridContainer"]');
			pay_grid_Container.maxHeight = 390;
		});
		objWidgetsSelectionPopup.show();
	}
	else{
		objWidgetsSelectionPopup.lastSelectedWidgets = options;
		objWidgetsSelectionPopup.show();
		var searchField = objWidgetsSelectionPopup.down('container[itemId="filterContainer"] AutoCompleter');
		if(searchField!="" && searchField!=undefined)
			searchField.setValue('');
		var clearlink = objWidgetsSelectionPopup.down('component[itemId="clearLink"]');
		clearlink.hide();
	}
	objWidgetsSelectionPopup.center();
	var filterContainer = objWidgetsSelectionPopup.down('container[itemId="filterContainer"] AutoCompleter');
	 filterContainer.focus();
}

function getPaySelectActionLinkPopup() {
	selectedr = [];
	
	var options;
	var optionsSelected = $('#selectedActionLinks').val();
	if (!Ext.isEmpty(optionsSelected)) {
		options = optionsSelected.split(",");
		isPaymentActionAllSelected = 'N';
	} else {var selectFlag = $('#allLinksSelectedFlag').val();
	if (!Ext.isEmpty(selectFlag))
		isPaymentActionAllSelected = selectFlag;
	else
		isPaymentActionAllSelected = 'N';
}
  if((viewmode == "VIEW" || viewmode == "MODIFIEDVIEW") && !Ext.isEmpty(objActionsSelectionPopup))
	{
		objActionsSelectionPopup.destroy();
		objActionsSelectionPopup = null;
	}
	if (Ext.isEmpty(objActionsSelectionPopup)) {
	
		objActionsSelectionPopup = Ext.create('Ext.ux.gcp.FilterPopUpView',
				{
					fnCallback : setSelectedActionItems,
					title : getLabel('actionlinks', 'Action Links'),
					labelId : 'actionCnt',
					lastSelectedWidgets : options,
					keyNode : 'value',
					itemId : 'actionSelectionPopup',
					checkboxId:'chkAllLinksSelectedFlag',
					displayCount:true,
					profileId :adminFeatureProfileId,
					featureType:'L',
					responseNode :'filter',
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
							fields : ['name', 'value','isAssigned','readOnly'],
					proxyUrl : 'cpon/clientServiceSetup/cponFeatures',
					rootNode : 'd.filter',
					totalRowsNode : 'd.count'
					      },
					columnModel : [{
										colDesc : getLabel('actionLink', 'Action Link'),
										colId : 'name',
										colHeader : getLabel('actionLink', 'Action Link'),
										width : 330
									}]
					   },
					cfgShowFilter:true,
					userMode: viewmode,
					autoCompleterEmptyText : getLabel('searchByName', 'Search By Action Link Name'),
					 cfgAutoCompleterUrl:'cponFeatures',
						cfgUrl:'cpon/clientServiceSetup/{0}',
						paramName:'filterName',
						dataNode:'name',
						rootNode : 'd.filter',
						autoCompleterExtraParam:
							[{
								key:'featureType',value:'L'
							},{
								key:'module',value: srvcCode
							},{
								key:'profileId',value: adminFeatureProfileId
							},{
								key:'id',value: encodeURIComponent(parentkey)
							}],
					module : srvcCode,
					hiddenValueField : 'selectedActionLinks',
					hiddenValuePopUpField :'popupLinksSelectedFlag',
					savefnCallback :saveItemsFn,
					urlCallback :serviceURLFn
				});
		objActionsSelectionPopup.on('beforeshow' , function(t) {
			var pay_grid_Container = objActionsSelectionPopup.down('container[itemId="gridContainer"]');
			pay_grid_Container.maxHeight = 390;
		});
		objActionsSelectionPopup.show();
	}
	else{
		objActionsSelectionPopup.lastSelectedWidgets = options;
		objActionsSelectionPopup.show();
		var searchField = objActionsSelectionPopup.down('container[itemId="filterContainer"] AutoCompleter');
		if(searchField!="" && searchField!=undefined)
		searchField.setValue('');
		var clearlink = objActionsSelectionPopup.down('component[itemId="clearLink"]');
		clearlink.hide();
	}
	objActionsSelectionPopup.center();
	var filterContainer = objActionsSelectionPopup.down('container[itemId="filterContainer"] AutoCompleter');
	 filterContainer.focus();
}

function setSelectedWidgetItems(records, Derecords, blnIsUnselected) {
	var temp = lastWdgValCnt;
	for (var i = 0; i < records.length; i++) {
		var val = records[i];
		if (!val.isAssigned) {
			temp = temp + 1;
		}
	}
	for (var i = 0; i < Derecords.length; i++) {
		var val = Derecords[i];
		if (val.isAssigned) {
			temp = temp - 1;
		}
	}
	var widgetCount = '(' + temp + ')';
	$("#widgetCnt").text(widgetCount);
	popupWidgetsSelectedValue = 'Y';
	setDirtyBit();
}

function setSelectedActionItems(records, Derecords, blnIsUnselected) {
	var temp = lastActValCnt;
	for (var i = 0; i < records.length; i++) {
		var val = records[i];
		if (!val.isAssigned) {
			temp = temp + 1;
		}
	}
	for (var i = 0; i < Derecords.length; i++) {
		var val = Derecords[i];
		if (val.isAssigned) {
			temp = temp - 1;
		}
	}
	var actionCount = '(' + temp + ')';
	$("#actionCnt").text(actionCount);
	popupLinksSelectedValue = 'Y';
	setDirtyBit();
}
function showPayFcyRateProfileFilterPopup(service,dropdownId){
	if (null != objFXProfileFilterPopup){
		objFXProfileFilterPopup.setService(service);
		objFXProfileFilterPopup.setDropdownId(dropdownId);
		objFXProfileFilterPopup.setDropdownType('F');
		objFXProfileFilterPopup.show();
	}
}

function showPayWorkflowProfileFilterPopup(service,dropdownId){
	if (null != objWorkflowProfileFilterPopup){
		objWorkflowProfileFilterPopup.setService(service);
		objWorkflowProfileFilterPopup.setDropdownId(dropdownId);
		objWorkflowProfileFilterPopup.setDropdownType('W');
		objWorkflowProfileFilterPopup.show();
	}
}

function showReportsProfileFilterPopup(service,dropdownId){
	if (null != objReportProfileFilterPopup){
		objReportProfileFilterPopup.setService(service);
		objReportProfileFilterPopup.setDropdownId(dropdownId);
		objReportProfileFilterPopup.setDropdownType('R');
		objReportProfileFilterPopup.show();
	}
}

function showAlertsProfileFilterPopup(service,dropdownId,alertType){
	if (null != objAlertProfileFilterPopup){
		objAlertProfileFilterPopup.setService(service);
		objAlertProfileFilterPopup.setDropdownId(dropdownId);
		objAlertProfileFilterPopup.setDropdownType('A');
		objAlertProfileFilterPopup.setAlertType(alertType);
		objAlertProfileFilterPopup.show();
	}
}

function showBillingProfileFilterPopup(service,dropdownId){
	if (null != objBillingProfileFilterPopup){
		objBillingProfileFilterPopup.setService(service);
		objBillingProfileFilterPopup.setDropdownId(dropdownId);
		objBillingProfileFilterPopup.setDropdownType('B');
		objBillingProfileFilterPopup.show();
	}	
}

function showSystemReceiverProfileFilterPopup(service,dropdownId){
	if (null != objSystemReceiverProfileFilterPopup){
		objSystemReceiverProfileFilterPopup.setService(service);
		objSystemReceiverProfileFilterPopup.setDropdownId(dropdownId);
		objSystemReceiverProfileFilterPopup.setDropdownType('S');
		objSystemReceiverProfileFilterPopup.show();
	}	
}

function showSelectedFields(service, dropdownId, dropdownType, seachType, category1, alertType){
	var strUrl = 'services/clientServiceSetup/filterProfile.json';
	strUrl = strUrl + '?&type='+seachType+'&category='+category1+'&service='+service+'&dropdownType='+dropdownType;
	strUrl = strUrl + '&alertType='+alertType;
	var strRegex = /[?&]([^=#]+)=([^&#]*)/g, objParam = {}, arrMatches, strGeneratedUrl;
	while (arrMatches = strRegex.exec(strUrl)) {
				objParam[arrMatches[1]] = arrMatches[2];
	}
	strGeneratedUrl = strUrl.substring(0, strUrl
							.indexOf('?'));
	strUrl=strGeneratedUrl;						
	Ext.Ajax.request({
						url : strUrl,
						method : 'POST',
						params:objParam,
						success : function(response) {
							var data = Ext.decode(response.responseText);
							var combo = document.getElementById(dropdownId);
							combo.innerHTML="";
							var option = document.createElement("option");
								option.text = getLabel('select','Select');
								option.value = '';
								combo.appendChild(option);
							for(var i =0;i<data.length;i++)
							{
								var option = document.createElement("option");
								option.text = data[i].profile_name;
								option.value = data[i].profile_id;
								combo.appendChild(option);
							}
						},
						failure : function(response) {
							//console.log("Ajax Get data Call Failed");
						}

					});
}

function setSelectedLineItems(records, blnIsUnselected) {
	var selectedLineItems = "";
	for ( var i = 0; i < records.length; i++) {
		var val = records[i];
		if (!Ext.isEmpty(val))
		{
			selectedLineItems = selectedLineItems + val.featureId + ':' + val.value;
			if (i < records.length - 1) {
				selectedLineItems = selectedLineItems + ',';
			}
		}
	}
	if (blnIsUnselected == true) {
		//$('#allLineCodeSelectedFlag').val('N');
		//$('#chkAllLineCodesSelectedFlag').attr('src',
			//	'static/images/icons/icon_unchecked.gif');
	}
	var lineCodeCount = '(' + records.length + ')';
	$("#lineItemCnt").text(lineCodeCount);
	selectedLineItemsList = selectedLineItems;
	
	popupLineItemsSelectedValue = 'Y';
	setDirtyBit();
}

function getLineCodesPopup()
{
	selectedr = [];
	var optionsSelected = $('#selectedLineCodes').val();
	if (!Ext.isEmpty(optionsSelected)) {
		var options = optionsSelected.split(",");
//		isLineCodesAllSelected = 'N';
	} /*else {
		var selectFlag = $('#allLineCodeSelectedFlag').val();
		if (!Ext.isEmpty(selectFlag))
			isLineCodesAllSelected = selectFlag;
		else
			isLineCodesAllSelected = 'N';
	}*/
	if (Ext.isEmpty(objLineCodesPopup) || (!Ext.isEmpty(objLineCodesPopup) && (viewmode === 'VIEW' || viewmode === 'MODIFIEDVIEW'))) {
		objLineCodesPopup =  Ext.create('CPON.view.LineCodesPopup', {
			itemId : 'collectionLineCodesPopup',
			fnCallback : setSelectedLineItems,
			profileId : adminFeatureProfileId,
			featureType : 'LI',
			module : '05'
		});

		objLineCodesPopup.show();
	}
	else{
		objLineCodesPopup.lastSelectedWidgets = options;
	//	objLineCodesPopup.isAllSelected = isLineCodesAllSelected;
		objLineCodesPopup.show();
	}
}