var objProfileView = null;
var objFSCWidgetsSelectionPopup = null;
var objBrActionsSelectionPopup = null;
var objFSCProfileSeek = null;
var objBRFeaturePopup = null;
var objLineCodesPopup = null;
var isBrWidgetsAllSelected = 'U';
var isBrActionLinksAllSelected = 'U';
var isLineCodesAllSelected = 'U';
var objInvEProfileFilterPopup = null;
var objFinancingProfileFilterPopup = null;
var objOverdueProfileFilterPopup = null;
var objEnrichmentsFilterPopup = null;
var objPackagesFilterPopup = null;
var objReportsFilterPopup = null;
var objCannedAlertsFilterPopup = null;
var objCustomAlertsFilterPopup = null;
var saveItemsFn=null;
var serviceURLFn=null;
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
	appFolder : 'static/scripts/cpon/clientSetupMst/FSCService/app',
	requires : ['CPON.view.ScmProductView','CPON.view.ScmProductActionBarView',
			'Ext.util.MixedCollection', 'Ext.util.Filter','CPON.view.ScmProfileFilterPopup','Ext.ux.gcp.FilterPopUpView' ],
	controllers : ['CPON.controller.FscServiceScmProductController'],
	launch : function() {
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
				if(me.hiddenValueField!=null && me.hiddenValuePopUpField!=null )
				{
					var objSelectedRecords = grid.selectedRecordList;
					var objDeSelectedRecordList = grid.deSelectedRecordList;
					var keyNode = me.keyNode;
					var selectedList=new Array();
					var deSelectedList=new Array();
					var iCount=0;
					for(;iCount<objSelectedRecords.length;iCount++)
					{
						selectedList.push(objSelectedRecords[iCount][keyNode]);
					}
					iCount=0;
					for(;iCount<objDeSelectedRecordList.length;iCount++)
					{
						deSelectedList.push(objDeSelectedRecordList[iCount][keyNode]);
					}
					var jsonObj = {
						"selectedRecords" : selectedList.join(),
						"deSelectedRecords" : deSelectedList.join()
			}
					document.getElementById(me.hiddenValueField).value = Ext
								.encode(jsonObj);
						if (null != document
								.getElementById(me.hiddenValuePopUpField)
								&& undefined != document
										.getElementById(me.hiddenValuePopUpField)) {
							document
									.getElementById(me.hiddenValuePopUpField).value = 'Y';
						}
				}
						
				if(checkValueEle.getAttribute('src').indexOf('/icon_unchecked')!=-1 && me.userMode != 'VIEW' && me.userMode != 'VERIFY'){
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
		objProfileView = Ext.create('CPON.view.ScmProductView', {
					renderTo : 'scmProductGridDiv'
				});
				
				
						objFSCProfileSeek = Ext
				.create('GCP.view.CopyFSCProfileSeek',
						{
							itemId : 'fscProfileSeek',
							title : getLabel('copyfscprofile',
									'Copy FSC Feature Profile'),
							columnName : getLabel('fscfeatureprfname',
									'FSC Feature Profile Name'),
							actionUrl : 'doCopyFSCProfile.form'
						});
					
		objFSCWidgetsSelectionPopup = Ext.create('Ext.ux.gcp.FilterPopUpView',
				{
					fnCallback : setSelectedWidgetItems,
					title :  getLabel('Widgets', 'Widgets'),
					labelId : 'widgetCnt',
					keyNode : 'value',
					itemId : 'widgetSelectionPopup',
					checkboxId:'chkAllWidgetsSelectedFlag',
					displayCount:true,
					profileId :fscFeatureProfileId,
					featureType:'W',
					responseNode :'filter',
					cls : 'non-xn-popup',
					width : 480,
					minHeight : 156,
					maxHeight : 550,
					draggable : false,
					resizable : false,
					autoHeight : false,
					cfgModel : {
					     pageSize : 5,
						storeModel : {
							fields : ['name', 'value','isAssigned','readOnly'],
					proxyUrl : 'cpon/clientServiceSetup/cponFeatures',
					rootNode : 'd.filter',
					totalRowsNode : 'd.count'
					      },
					columnModel : [{
										colDesc : getLabel('widgetsName','Widget Name'),
										colId : 'name',
										colHeader : getLabel('widgetsName','Widget Name'),
										width : 330
									}]
					   },
					cfgShowFilter:true,
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
								key:'module',value: '06'
							},{
								key:'profileId',value: fscFeatureProfileId
							},{
								key:'id',value: encodeURIComponent(parentkey)
							}],
					module : '06',
					userMode: viewmode,
					hiddenValueField : 'selectedWidgets',
					hiddenValuePopUpField :'popupWidgetsSelectedFlag',
					savefnCallback :saveItemsFn,
					urlCallback :serviceURLFn,
					listeners : {
						beforeshow : function(t) {
							var br_grid_Container = objFSCWidgetsSelectionPopup.down('container[itemId="gridContainer"]');
							br_grid_Container.maxHeight = 390;
						},
						resize : function(){
							this.center();
						}
					}
				});
	objBrActionsSelectionPopup = Ext.create('Ext.ux.gcp.FilterPopUpView',
				{
					fnCallback : setSelectedActionItems,
					title : getLabel('actionlinks', 'Action Links'),
					labelId : 'widgetCnt',
					keyNode : 'value',
					itemId : 'actionSelectionPopup',
					checkboxId:'chkAllLinksSelectedFlag',
					displayCount:true,
					profileId :fscFeatureProfileId,
					featureType:'L',
					responseNode :'filter',
					cls : 'non-xn-popup',
					width : 480,
					minHeight : 156,
					maxHeight : 550,
					draggable : false,
					resizable : false,
					autoHeight : false,
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
										width : 330
									}]
					   },
					cfgShowFilter:true,
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
								key:'module',value: '06'
							},{
								key:'profileId',value: fscFeatureProfileId
							},{
								key:'id',value: encodeURIComponent(parentkey)
							}],
					module : '06',
					userMode: viewmode,
					hiddenValueField : 'selectedActionLinks',
					hiddenValuePopUpField :'popupLinksSelectedFlag',
					savefnCallback :saveItemsFn,
					urlCallback :serviceURLFn,
					listeners : {
						beforeshow : function(t) {
							var br_grid_Container = objBrActionsSelectionPopup.down('container[itemId="gridContainer"]');
							br_grid_Container.maxHeight = 390;
						},
						resize : function(){
							this.center();
						}
					}
				});
		objLineCodesPopup = Ext.create('CPON.view.LineCodesPopup', {
			itemId : 'fscLineCodesPopup',
			fnCallback : setSelectedLineItems,
			profileId : fscFeatureProfileId,
			featureType : 'LI',
			module : '06'
		});
	
		objInvEProfileFilterPopup = Ext.create('CPON.view.ScmProfileFilterPopup',
				{
			fnCallback : showSelectedFields
		});
		
		objFinancingProfileFilterPopup = Ext.create('CPON.view.ScmProfileFilterPopup',
				{
			fnCallback : showSelectedFields
		});
		
		objOverdueProfileFilterPopup= Ext.create('CPON.view.ScmProfileFilterPopup',
				{
			fnCallback : showSelectedFields
		});
		
		objEnrichmentsFilterPopup = Ext.create('CPON.view.ScmProfileFilterPopup',
				{
			fnCallback : showSelectedFields
		});
		
		objPackagesFilterPopup = Ext.create('CPON.view.ScmProfileFilterPopup',
				{
			fnCallback : showSelectedFields
		});
		objReportsFilterPopup = Ext.create('CPON.view.ScmProfileFilterPopup',
				{
			fnCallback : showSelectedFields
		});
		objCannedAlertsFilterPopup = Ext.create('CPON.view.ScmProfileFilterPopup',
				{
			fnCallback : showSelectedFields
		});		
		objCustomAlertsFilterPopup = Ext.create('CPON.view.ScmProfileFilterPopup',
				{
			fnCallback : showSelectedFields
		});
		
	}
});
function resizeContentPanel() {
	if (!Ext.isEmpty(objProfileView)) {
		objProfileView.hide();
		objProfileView.show();
	}
}
function getLineCodesPopup()
{
	selectedr = [];
	var optionsSelected = $('#selectedLineCodes').val();
	if (!Ext.isEmpty(optionsSelected)) {
		var options = optionsSelected.split(",");
		isLineCodesAllSelected = 'N';
	} else {
		var selectFlag = $('#allLineCodeSelectedFlag').val();
		if (!Ext.isEmpty(selectFlag))
			isLineCodesAllSelected = selectFlag;
		else
			isLineCodesAllSelected = 'N';
	}	
	if (!Ext.isEmpty(objLineCodesPopup)) {
		objLineCodesPopup =  Ext.create('CPON.view.LineCodesPopup', {
			itemId : 'fscLineCodesPopup',
			fnCallback : setSelectedLineItems,
			profileId : fscFeatureProfileId,
			featureType : 'LI',
			isAllSelected : isLineCodesAllSelected,
			module : '06',
			viewmode: viewmode,
			listeners : {
				resize : function(){
					this.center();
				}
			}
		});

		objLineCodesPopup.show();
	}
	else{
		objLineCodesPopup.lastSelectedWidgets = options;
		objLineCodesPopup.isAllSelected = isLineCodesAllSelected;
		objLineCodesPopup.show();
	}
	objLineCodesPopup.center();
}

function getFSCFeaturePopup() {

	var selectFlag = $('#allFSCFeaturesSelectedFlag').val();
	if (!Ext.isEmpty(selectFlag))
		isFSCOptionsAllSelected = selectFlag;
	else
		isFSCOptionsAllSelected = 'N';
	if (!Ext.isEmpty(objBRFeaturePopup) && isFSCOptionsAllSelected === 'N') {
		objBRFeaturePopup.isAllSelected = isFSCOptionsAllSelected;
		if ('Y' === isFSCOptionsAllSelected) {
			var brCheckBoxes = objBRFeaturePopup.query('checkboxgroup');
			for ( var i = 0; i < brCheckBoxes.length; i++) {
				var cBox = brCheckBoxes[i].query('checkbox');
				for ( var j = 0; j < cBox.length; j++) {
					if(!cBox[j].isDisabled())
					cBox[j].setValue(true);
				}
			}
			var brTextFields = objBRFeaturePopup.query('textfield');
			for ( var i = 0; i < brTextFields.length; i++) {
				if ("textfield" === brTextFields[i].xtype) {
					brTextFields[i].setValue("999");
				}
			}
		}
		else if('N' === isFSCOptionsAllSelected && 
		'Y'===allOptionsSelectionInModel)
		{
			var brCheckBoxes = objBRFeaturePopup.query('checkboxgroup');
			for ( var i = 0; i < brCheckBoxes.length; i++) {
				var cBox = brCheckBoxes[i].query('checkbox');
				for ( var j = 0; j < cBox.length; j++) {
					cBox[j].setValue(false);
				}
			}
			var brTextFields = objBRFeaturePopup.query('textfield');
			for ( var i = 0; i < brTextFields.length; i++) {
				if ("textfield" === brTextFields[i].xtype) {
					brTextFields[i].setValue("999");
				}
			}
		}
		objBRFeaturePopup.show();
	
	}else {
		if (null != objBRFeaturePopup)
			objBRFeaturePopup.destroy();
			objBRFeaturePopup = Ext.create('GCP.view.FSCFeaturePopup', {
					itemId : 'fscFeaturePopup',
					fnCallback : setSelectedBRFeatureItems,
					profileId : fscFeatureProfileId,
					featureType : 'P',
					module : '06',
					title : getLabel('FSCAdvanceOptions', 'FSC Advance Options'),
					isAllSelected : isFSCOptionsAllSelected,
					listeners : {
						'resize' : function() {
							this.center();
						}
					}
				});
		objBRFeaturePopup.isAllSelected = isFSCOptionsAllSelected;
		if ('Y' === isFSCOptionsAllSelected) {
			var brCheckBoxes = objBRFeaturePopup.query('checkboxgroup');
			for ( var i = 0; i < brCheckBoxes.length; i++) {
				var cBox = brCheckBoxes[i].query('checkbox');
				for ( var j = 0; j < cBox.length; j++) {
					if(!cBox[j].isDisabled())
					cBox[j].setValue(true);
				}
			}
			var brTextFields = objBRFeaturePopup.query('textfield');
			for ( var i = 0; i < brTextFields.length; i++) {
				if ("textfield" === brTextFields[i].xtype) {
					brTextFields[i].setValue("999");
				}
			}
		}
		else if('N' === isFSCOptionsAllSelected && 
		'Y'===allOptionsSelectionInModel)
		{
			var brCheckBoxes = objBRFeaturePopup.query('checkboxgroup');
			for ( var i = 0; i < brCheckBoxes.length; i++) {
				var cBox = brCheckBoxes[i].query('checkbox');
				for ( var j = 0; j < cBox.length; j++) {
					cBox[j].setValue(false);
				}
			}
			var brTextFields = objBRFeaturePopup.query('textfield');
			for ( var i = 0; i < brTextFields.length; i++) {
				if ("textfield" === brTextFields[i].xtype) {
					brTextFields[i].setValue("999");
				}
			}
		}
		objBRFeaturePopup.show();
	}
	objBRFeaturePopup.center();
}

function setSelectedBRFeatureItems(records, objJson, isUnselected) {
	var selectedAdminFItems = new Array();
	var items = records.items;
	var unSelected =false;
	if('S'==clientType){
		strFSCPrevililegesList='[]';
		strFSCFeatureList='[]';
	}else{
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
		strFSCPrevililegesList = JSON.stringify(selectedAdminFItems);
		strFSCFeatureList = JSON.stringify(objJson);
	}
	popupFSCFeaturesSelectedValue = 'Y';
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
		$('#chkAllFSCFeaturesSelectedFlag').attr('src',
				'static/images/icons/icon_unchecked.gif');
	}
	else
	{
		$('#chkAllFSCFeaturesSelectedFlag').attr('src',
				'static/images/icons/icon_checked.gif');
	}
	setDirtyBit();
}

function showFSCProfileSeek() {
	if (null != objFSCProfileSeek) {
		objFSCProfileSeek.show();
	}
}

function getSelectFSCWidgetsPopup() {
	selectedr = [];
	var optionsSelected = $('#selectedWidgets').val();
	if (!Ext.isEmpty(optionsSelected)) {
		var options = optionsSelected.split(",");
		isBrWidgetsAllSelected = 'N';
	} else {
		var selectFlag = $('#allWidgetsSelectedFlag').val();
		if (!Ext.isEmpty(selectFlag))
			isBrWidgetsAllSelected = selectFlag;
		else
			isBrWidgetsAllSelected = 'N';
	}
	if (Ext.isEmpty(objFSCWidgetsSelectionPopup)) {
		objFSCWidgetsSelectionPopup = Ext.create('Ext.ux.gcp.FilterPopUpView',
				{
					fnCallback : setSelectedWidgetItems,
					title :  getLabel('widget', 'Widget'),
					labelId : 'widgetCnt',
					keyNode : 'value',
					itemId : 'widgetSelectionPopup',
					checkboxId:'chkAllWidgetsSelectedFlag',
					displayCount:true,
					profileId :fscFeatureProfileId,
					featureType:'W',
					responseNode :'filter',
					cfgModel : {
					     pageSize : 5,
						storeModel : {
							fields : ['name', 'value','isAssigned','readOnly'],
					proxyUrl : 'cpon/clientServiceSetup/cponFeatures',
					rootNode : 'd.filter',
					totalRowsNode : 'd.count'
					      },
					columnModel : [{
										colDesc : getLabel('widgetsName','Widget Name'),
										colId : 'name',
										colHeader : getLabel('widgetsName','Widget Name'),
										width : 330
									}]
					   },
					cfgShowFilter:true,
					cfgFilterLabel:'Widgets',
					 cfgAutoCompleterUrl:'cponFeatures',
						cfgUrl:'cpon/clientServiceSetup/{0}',
						paramName:'filterName',
						dataNode:'name',
						rootNode : 'd.filter',
						autoCompleterExtraParam:
							[{
								key:'featureType',value:'W'
							},{
								key:'module',value: '06'
							},{
								key:'profileId',value: fscFeatureProfileId
							},{
								key:'id',value: encodeURIComponent(parentkey)
							}],
					module : '06',
					userMode: viewmode,
					hiddenValueField : 'selectedWidgets',
					hiddenValuePopUpField :'popupWidgetsSelectedFlag',
					savefnCallback :saveItemsFn,
					urlCallback :serviceURLFn
				});
		objFSCWidgetsSelectionPopup.show();
	}
	else{
		objFSCWidgetsSelectionPopup.lastSelectedWidgets = options;
		objFSCWidgetsSelectionPopup.isAllSelected = isBrWidgetsAllSelected;
		objFSCWidgetsSelectionPopup.show();
		var searchField = objFSCWidgetsSelectionPopup.down('container[itemId="filterContainer"] AutoCompleter');
		if(searchField!="" && searchField!=undefined)
			searchField.setValue('');
		var clearlink = objFSCWidgetsSelectionPopup.down('component[itemId="clearLink"]');
		clearlink.hide();
	}
	objFSCWidgetsSelectionPopup.center();
	var filterContainer = objFSCWidgetsSelectionPopup.down('container[itemId="filterContainer"] AutoCompleter');
	 filterContainer.focus();
}

function setSelectedWidgetItems(records,Derecords,  blnIsUnselected) {
	var temp= lastWdgValCnt;
	for ( var i = 0; i < records.length; i++) {
		var val = records[i];
		if (!val.isAssigned) {
			temp=temp+1;
		}
	}
for ( var i = 0; i < Derecords.length; i++) {
	var val = Derecords[i];
	if (val.isAssigned) {
		temp=temp-1;
	}
}
	var widgetCount = '(' + temp + ')';
	$("#widgetCnt").text(widgetCount);
	popupWidgetsSelectedValue = 'Y';
	setDirtyBit();
}

function setSelectedActionItems(records,Derecords, blnIsUnselected) {
var temp= lastActValCnt;
for ( var i = 0; i < records.length; i++) {
	var val = records[i];
	if (!val.isAssigned) {
		temp=temp+1;
	}
}
for ( var i = 0; i < Derecords.length; i++) {
var val = Derecords[i];
if (val.isAssigned) {
	temp=temp-1;
}
}
	var actionCount = '(' + temp + ')';
	$("#actionCnt").text(actionCount);
	popupLinksSelectedValue = 'Y';
}
function getSelectFSCActionLinkPopup() {
	selectedr = [];
	var optionsSelected = $('#selectedActionLinks').val();
	if (!Ext.isEmpty(optionsSelected)) {
		var options = optionsSelected.split(",");
		isBrActionLinksAllSelected = 'N';
	} else {
		var selectFlag = $('#allLinksSelectedFlag').val();
		if (!Ext.isEmpty(selectFlag))
			isBrActionLinksAllSelected = selectFlag;
		else
			isBrActionLinksAllSelected = 'N';
	}
	if (Ext.isEmpty(objBrActionsSelectionPopup)) {

			objBrActionsSelectionPopup = Ext.create('Ext.ux.gcp.FilterPopUpView',
				{
					fnCallback : setSelectedActionItems,
					title : getLabel('actionlinks', 'Action Links'),
					labelId : 'widgetCnt',
					keyNode : 'value',
					itemId : 'actionSelectionPopup',
					checkboxId:'chkAllWidgetsSelectedFlag',
					displayCount:true,
					profileId :fscFeatureProfileId,
					featureType:'L',
					responseNode :'filter',
					cfgModel : {
					     pageSize : 5,
						storeModel : {
							fields : ['name', 'value','isAssigned','readOnly'],
					proxyUrl : 'cpon/clientServiceSetup/cponFeatures',
					rootNode : 'd.filter',
					totalRowsNode : 'd.count'
					      },
					columnModel : [{
										colDesc : getLabel('actionLink', 'Action Links'),
										colId : 'name',
										colHeader : getLabel('actionLink', 'Action Links'),
										width : 330
									}]
					   },
						cfgShowFilter:true,
					userMode: viewmode,
					cfgFilterLabel:getLabel('actionlinks', 'Action Links'),
					 cfgAutoCompleterUrl:'cponFeatures',
						cfgUrl:'cpon/clientServiceSetup/{0}',
						paramName:'filterName',
						dataNode:'name',
						rootNode : 'd.filter',
						autoCompleterExtraParam:
							[{
								key:'featureType',value:'L'
							},{
								key:'module',value: '06'
							},{
								key:'profileId',value: fscFeatureProfileId
							},{
								key:'id',value: encodeURIComponent(parentkey)
							}],
					module : '06',
					hiddenValueField : 'selectedActionLinks',
					hiddenValuePopUpField :'popupLinksSelectedFlag',
					savefnCallback :saveItemsFn,
					urlCallback :serviceURLFn
				});
		objBrActionsSelectionPopup.show();
	}
	
	else{
		objBrActionsSelectionPopup.lastSelectedWidgets = options;
		objBrActionsSelectionPopup.isAllSelected = isBrActionLinksAllSelected;
		objBrActionsSelectionPopup.show();
		var searchField = objBrActionsSelectionPopup.down('container[itemId="filterContainer"] AutoCompleter');
		if(searchField!="" && searchField!=undefined)
		searchField.setValue('');
		var clearlink = objBrActionsSelectionPopup.down('component[itemId="clearLink"]');
		clearlink.hide();
	}
	objBrActionsSelectionPopup.center();
	var filterContainer = objBrActionsSelectionPopup.down('container[itemId="filterContainer"] AutoCompleter');
	 filterContainer.focus();
}

function setSelectedActionItems(records,Derecords,  blnIsUnselected) {
	var temp= lastActValCnt;
	for ( var i = 0; i < records.length; i++) {
		var val = records[i];
		if (!val.isAssigned) {
			temp=temp+1;
		}
	}
for ( var i = 0; i < Derecords.length; i++) {
	var val = Derecords[i];
	if (val.isAssigned) {
		temp=temp-1;
	}
}

	var actionCount = '(' + temp + ')';
	$("#actionCnt").text(actionCount);
	popupLinksSelectedValue = 'Y';
	setDirtyBit();
}

function setSelectedLineItems(records, blnIsUnselected) {
	var selectedLineItems = "";
	var recCount = 0; 
	for ( var i = 0; i < records.length; i++) {
		var val = records[i];
		
		if (!Ext.isEmpty(val) && !Ext.isEmpty(val.data))
		{
			
			
			if(! (selectedLineItems.indexOf(val.data.featureId) > -1))
			{
				selectedLineItems = selectedLineItems + val.data.featureId + ':' + val.data.value;
				recCount = recCount + 1;
				if (i < records.length - 1) {
					selectedLineItems = selectedLineItems + ',';
				}
			}	
		}
	}
	if (blnIsUnselected == true) {
		$('#allLineCodeSelectedFlag').val('N');
		$('#chkAllLineCodesSelectedFlag').attr('src',
				'static/images/icons/icon_unchecked.gif');
	}
	var lineCodeCount = '(' + recCount + ')';
	//$("#lineItemCnt").text(lineCodeCount);
	selectedLineItemsList = selectedLineItems;
	popupLineItemsSelectedValue = 'Y';
	setDirtyBit();
}

function showInvEProfileFilterPopup(service,dropdownId){
	if (null != objInvEProfileFilterPopup){
		objInvEProfileFilterPopup.setService(service);
		objInvEProfileFilterPopup.setDropdownId(dropdownId);
		objInvEProfileFilterPopup.setDropdownType('W');
		objInvEProfileFilterPopup.show();
	}
}

function showFinancingProfileFilterPopup(service,dropdownId){
	if (null != objFinancingProfileFilterPopup){
		objFinancingProfileFilterPopup.setService(service);
		objFinancingProfileFilterPopup.setDropdownId(dropdownId);
		objFinancingProfileFilterPopup.setDropdownType('F');
		objFinancingProfileFilterPopup.show();
	}
}

function showOverdueProfileFilterPopup(service,dropdownId){
	if (null != objOverdueProfileFilterPopup){
		objOverdueProfileFilterPopup.setService(service);
		objOverdueProfileFilterPopup.setDropdownId(dropdownId);
		objOverdueProfileFilterPopup.setDropdownType('O');
		objOverdueProfileFilterPopup.show();
	}
}

function showEnrichmentsFilterPopup(service,dropdownId, dropdownType){
	if (null != objEnrichmentsFilterPopup){
		objEnrichmentsFilterPopup.setService(service);
		objEnrichmentsFilterPopup.setDropdownId(dropdownId);
		objEnrichmentsFilterPopup.setDropdownType(dropdownType);
		objEnrichmentsFilterPopup.show();
	}
}

function showPackagesFilterPopup(service,dropdownId){
	if (null != objPackagesFilterPopup){
		objPackagesFilterPopup.setService(service);
		objPackagesFilterPopup.setDropdownId(dropdownId);
		objPackagesFilterPopup.setDropdownType('P');
		objPackagesFilterPopup.show();
	}
}
function showReportsFilterPopup(service,dropdownId){
	if (null != objReportsFilterPopup){
		objReportsFilterPopup.setService(service);
		objReportsFilterPopup.setDropdownId(dropdownId);
		objReportsFilterPopup.setDropdownType('R');
		objReportsFilterPopup.show();
	}
}
function showCannedAlertsFilterPopup(service,dropdownId){
	if (null != objCannedAlertsFilterPopup){
		objCannedAlertsFilterPopup.setService(service);
		objCannedAlertsFilterPopup.setDropdownId(dropdownId);
		objCannedAlertsFilterPopup.setDropdownType('N');
		objCannedAlertsFilterPopup.show();
	}
}
function showCustomAlertsFilterPopup(service,dropdownId){
	if (null != objCustomAlertsFilterPopup){
		objCustomAlertsFilterPopup.setService(service);
		objCustomAlertsFilterPopup.setDropdownId(dropdownId);
		objCustomAlertsFilterPopup.setDropdownType('U');
		objCustomAlertsFilterPopup.show();
	}
}
function showSelectedFields(service, dropdownId, dropdownType, seachType, category1, category2){
	var strUrl = 'services/fscScmProduct/filterProfile.json';
	strUrl = strUrl + '?&id='+encodeURIComponent(parentkey);
	strUrl = strUrl + '&type='+seachType+'&category='+category1+'&subcategory='+category2+'&service='+service+'&dropdownType='+dropdownType+'&productCode='+productCode;
	Ext.Ajax.request({
						url : strUrl,
						method : 'POST',
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
						}
					});
}