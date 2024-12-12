var objTradeWidgetsSelectionPopup = null;
var objTradeActionsSelectionPopup = null;
var objReportProfileFilterPopup = null;
var objAlertProfileFilterPopup = null;
var objTradeFeaturePopup = null;
var categoryStore = null;
var subCategoryStore = null;
var isTradeWidgetsAllSelected = 'U';
var isTradeActionLinksAllSelected = 'U';
var isTradeOptionsAllSelected = null;
var saveItemsFn=null;
var serviceURLFn=null;
Ext.Loader.setConfig({
	enabled : true,
	setPath : {
		'Ext' : 'static/js/extjs4.2.1/src',
		'Ext.ux' : 'static/js/extjs4.2.1/src/ux'
	}
});

Ext.Loader.setPath('GCP', 'static/scripts/cpon/common');

Ext.application({
	name : 'CPON',
	appFolder : 'static/scripts/cpon/clientSetupMst/tradeService/app',
	requires : [  'Ext.util.MixedCollection', 'Ext.util.Filter',
			 'GCP.view.CopyProfileSeek','GCP.view.ProfileFilterPopup','GCP.view.TradeFeaturePopup','Ext.ux.gcp.FilterPopUpView'],
	launch : function() {
		serviceURLFn = function (popup) {
            var strUrl="";
            strUrl = '&featureType=' + popup.featureType + '&module='
					+ popup.module + '&profileId=' + popup.profileId + '&id=' + encodeURIComponent(parentkey)
					+ '&viewmode='+ viewmode;

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
		categoryStore = Ext.create('Ext.data.Store', {
			fields : [ 'name', 'value' ],
			proxy : {
				type : 'ajax',
				url : 'cpon/cponseek/categoryList.json',
				reader : {
					type : 'json',
					root : 'd.filter'
				},
				noCache:false,
				actionMethods : {
					create : "POST",
					read : "POST",
					update : "POST",
					destroy : "POST"
				}
			},
			autoLoad : true
		});

		categoryStore.on('load', function(store) {
			store.insert(0, {
				"name" : getLabel('all', 'ALL'),
				"value" : ""
			});
		});
		
objTradeWidgetsSelectionPopup = Ext.create('Ext.ux.gcp.FilterPopUpView',
				{
					fnCallback : setSelectedWidgetItems,
					title :  getLabel('Widgets','Widgets'),
					labelId : 'widgetCnt',
					keyNode : 'value',
					itemId : 'tradeWidgetSelectionPopup',
					checkboxId:'chkAllWidgetsSelectedFlag',
					displayCount:true,
					profileId :tradeFeatureProfileId,
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
								key:'module',value: '09'
							},{
								key:'profileId',value: tradeFeatureProfileId
							},{
								key:'id',value: encodeURIComponent(parentkey)
							}],
					module : '09',
					userMode: viewmode,
					hiddenValueField : 'selectedWidgets',
					hiddenValuePopUpField :'popupWidgetsSelectedFlag',
					savefnCallback :saveItemsFn,
					urlCallback :serviceURLFn
					/*listeners : {
						beforeshow : function(t) {
							var br_grid_Container = objTradeWidgetsSelectionPopup.down('container[itemId="gridContainer"]');
							br_grid_Container.maxHeight = 390;
						},
						resize : function(){
							this.center();
						}
					}*/
				});
		objTradeActionsSelectionPopup  = Ext.create('Ext.ux.gcp.FilterPopUpView',
				{
					fnCallback : setSelectedActionItems,
					title :  getLabel('actionlinks', 'Action Links'),
					labelId : 'actionCnt',
					keyNode : 'value',
					itemId : 'tradeActionSelectionPopup',
					checkboxId:'chkAllLinksSelectedFlag',
					displayCount:true,
					profileId :tradeFeatureProfileId,
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
										colDesc : getLabel('actionLinkNm','Action Links Name'),
										colId : 'name',
										colHeader : getLabel('actionLinkNm','Action Links Name'),
										width : 330
									}]
					   },
					autoCompleterEmptyText : getLabel('searchByName', 'Search By Action Link Name'),
					cfgShowFilter:true,
					 cfgAutoCompleterUrl:'cponFeatures',
						cfgUrl:'cpon/clientServiceSetup/{0}',
						paramName:'filterName',
						dataNode:'name',
						rootNode : 'd.filter',
						autoCompleterExtraParam:
							[{
								key:'featureType',value:'L'
							},{
								key:'module',value: '09'
							},{
								key:'profileId',value: tradeFeatureProfileId
							},{
								key:'id',value: encodeURIComponent(parentkey)
							}],
					userMode: viewmode,
					module : '09',
					hiddenValueField : 'selectedActionLinks',
					hiddenValuePopUpField :'popupLinksSelectedFlag',
					savefnCallback :saveItemsFn,
					urlCallback :serviceURLFn
					/*listeners : {
						beforeshow : function(t) {
							var br_grid_Container = objTradeActionsSelectionPopup.down('container[itemId="gridContainer"]');
							br_grid_Container.maxHeight = 390;
						},
						resize : function(){
							this.center();
						}
					}*/
				});
		
		objReportProfileFilterPopup = Ext.create('GCP.view.ProfileFilterPopup',
				{
					fnCallback : showSelectedFields
				});
		objAlertProfileFilterPopup = Ext.create('GCP.view.ProfileFilterPopup',
				{
					fnCallback : showSelectedFields
				});
	
	}
});




function showBRProfileSeek() {
	if (null != objBRProfileSeek) {
		objBRProfileSeek.show();
	}
}

function getSelectTradeWidgetsPopup() {
	selectedr = [];
	var optionsSelected = $('#selectedWidgets').val();
	if (!Ext.isEmpty(optionsSelected)) {
		var options = optionsSelected.split(",");
		isTradeWidgetsAllSelected = 'N';
	} else {
		var selectFlag = $('#allWidgetsSelectedFlag').val();
		if (!Ext.isEmpty(selectFlag))
			isTradeWidgetsAllSelected = selectFlag;
		else
			isTradeWidgetsAllSelected = 'N';
	}
	if (Ext.isEmpty(objTradeWidgetsSelectionPopup)) {

			objTradeWidgetsSelectionPopup = Ext.create('Ext.ux.gcp.FilterPopUpView',
				{
					fnCallback : setSelectedWidgetItems,
					title :  getLabel('widget', 'Widget'),
					labelId : 'widgetCnt',
					keyNode : 'value',
					itemId : 'tradeWidgetSelectionPopup',
					checkboxId:'chkAllWidgetsSelectedFlag',
					displayCount:true,
					profileId :tradeFeatureProfileId,
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
					cfgFilterLabel:getLabel('widget', 'Widget'),
					 cfgAutoCompleterUrl:'cponFeatures',
						cfgUrl:'cpon/clientServiceSetup/{0}',
						paramName:'filterName',
						dataNode:'name',
						rootNode : 'd.filter',
						autoCompleterExtraParam:
							[{
								key:'featureType',value:'W'
							},{
								key:'module',value: '09'
							},{
								key:'profileId',value: adminFeatureProfileId
							},{
								key:'id',value: encodeURIComponent(parentkey)
							}],
					userMode: viewmode,
					module : '09',
					hiddenValueField : 'selectedWidgets',
					hiddenValuePopUpField :'popupWidgetsSelectedFlag',
					savefnCallback :saveItemsFn,
					urlCallback :serviceURLFn
				});
			
			objTradeWidgetsSelectionPopup.on('beforeshow' , function(t) {
				var br_grid_Container = objTradeWidgetsSelectionPopup.down('container[itemId="gridContainer"]');
				br_grid_Container.maxHeight = 390;	
			});
		objTradeWidgetsSelectionPopup.show();
	}
	else{
		objTradeWidgetsSelectionPopup.lastSelectedWidgets = options;
		objTradeWidgetsSelectionPopup.isAllSelected = isTradeActionLinksAllSelected;
		objTradeWidgetsSelectionPopup.show();
		var searchField = objTradeWidgetsSelectionPopup.down('container[itemId="filterContainer"] AutoCompleter');
		if(searchField!="" && searchField!=undefined)
			searchField.setValue('');
		var clearlink = objTradeWidgetsSelectionPopup.down('component[itemId="clearLink"]');
		clearlink.hide();
	}
	objTradeWidgetsSelectionPopup.center();
	var filterContainer = objTradeWidgetsSelectionPopup.down('container[itemId="filterContainer"] AutoCompleter');
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

function getSelectTradeActionLinkPopup() {
	selectedr = [];
	var optionsSelected = $('#selectedActionLinks').val();
	if (!Ext.isEmpty(optionsSelected)) {
		var options = optionsSelected.split(",");
		isTradeActionLinksAllSelected = 'N';
	} else {
		var selectFlag = $('#allLinksSelectedFlag').val();
		if (!Ext.isEmpty(selectFlag))
			isTradeActionLinksAllSelected = selectFlag;
		else
			isTradeActionLinksAllSelected = 'N';
	}
	if (Ext.isEmpty(objTradeActionsSelectionPopup)) {

		objTradeActionsSelectionPopup = Ext.create('Ext.ux.gcp.FilterPopUpView',
				{
					fnCallback : setSelectedActionItems,
					title : getLabel('actionlinks', 'Action Links'),
					labelId : 'actionCnt',
					keyNode : 'value',
					itemId : 'tradeActionSelectionPopup',
					checkboxId:'chkAllLinksSelectedFlag',
					displayCount:true,
					profileId :tradeFeatureProfileId,
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
										colDesc : getLabel('actionLink','Action Link'),
										colId : 'name',
										colHeader : getLabel('actionLink','Action Link'),
										width : 330
									}]
					   },
						cfgFilterLabel: getLabel('actionLink','Action Link'),
					cfgShowFilter:true,
					 cfgAutoCompleterUrl:'cponFeatures',
						cfgUrl:'cpon/clientServiceSetup/{0}',
						paramName:'filterName',
						dataNode:'name',
						rootNode : 'd.filter',
						autoCompleterExtraParam:
							[{
								key:'featureType',value:'L'
							},{
								key:'module',value: '09'
							},{
								key:'profileId',value: tradeFeatureProfileId
							},{
								key:'id',value: encodeURIComponent(parentkey)
							}],
					module : '09',
					userMode: viewmode,
					hiddenValueField : 'selectedActionLinks',
					hiddenValuePopUpField :'popupLinksSelectedFlag',
					savefnCallback :saveItemsFn,
					urlCallback :serviceURLFn
				});
		
		objTradeActionsSelectionPopup.on('beforeshow' , function(t) {
			var br_grid_Container = objTradeActionsSelectionPopup.down('container[itemId="gridContainer"]');
			br_grid_Container.maxHeight = 390;
		});
		objTradeActionsSelectionPopup.show();
	}
	else{
		objTradeActionsSelectionPopup.lastSelectedWidgets = options;
		objTradeActionsSelectionPopup.isAllSelected = isTradeActionLinksAllSelected;		
		objTradeActionsSelectionPopup.show();
		var searchField = objTradeActionsSelectionPopup.down('container[itemId="filterContainer"] AutoCompleter');
		if(searchField!="" && searchField!=undefined)
		searchField.setValue('');
		var clearlink = objTradeActionsSelectionPopup.down('component[itemId="clearLink"]');
		clearlink.hide();
	}
	objTradeActionsSelectionPopup.center();
	var filterContainer = objTradeActionsSelectionPopup.down('container[itemId="filterContainer"] AutoCompleter');
	 filterContainer.focus();
}

function getTradeFeaturePopup() {
	var selectFlag = $('#allTradeFeaturesSelectedFlag').val();
	if (!Ext.isEmpty(selectFlag))
		isTradeOptionsAllSelected = selectFlag;
	else
		isTradeOptionsAllSelected = 'N';
	if (!Ext.isEmpty(objTradeFeaturePopup)) {
		objTradeFeaturePopup = Ext.create('GCP.view.TradeFeaturePopup', {
			itemId : 'tradeFeaturePopup',
			fnCallback : setSelectedTradeFeatureItems,
			profileId : tradeFeatureProfileId,
			featureType : 'P',
			module : srvcCode,
			title : getLabel('tradeAdvanceOptions', 'Trade Advance Options'),
			isAllSelected : isTradeOptionsAllSelected
		});
		if ('Y' === isTradeOptionsAllSelected) {
			var brCheckBoxes = objTradeFeaturePopup.query('checkboxgroup');
			for ( var i = 0; i < brCheckBoxes.length; i++) {
				var cBox = brCheckBoxes[i].query('checkbox');
				for ( var j = 0; j < cBox.length; j++) {
					if(!cBox[j].isDisabled())
					cBox[j].setValue(true);
				}
			}
			
		}
		else if('N' === isTradeOptionsAllSelected && 
		'Y'===allOptionsSelectionInModel)
		{
			var brCheckBoxes = objTradeFeaturePopup.query('checkboxgroup');
			for ( var i = 0; i < brCheckBoxes.length; i++) {
				var cBox = brCheckBoxes[i].query('checkbox');
				for ( var j = 0; j < cBox.length; j++) {
					cBox[j].setValue(false);
				}
			}
			
		}
		objTradeFeaturePopup.show();
	} else {
		objTradeFeaturePopup = Ext.create('GCP.view.TradeFeaturePopup', {
			itemId : 'tradeFeaturePopup',
			fnCallback : setSelectedTradeFeatureItems,
			profileId : tradeFeatureProfileId,
			featureType : 'P',
			module : srvcCode,
			title : getLabel('tradeAdvanceOptions', 'Trade Advance Options'),
			isAllSelected : isTradeOptionsAllSelected
		});
		objTradeFeaturePopup.isAllSelected = isTradeOptionsAllSelected;
		if ('Y' === isTradeOptionsAllSelected) {
			var brCheckBoxes = objTradeFeaturePopup.query('checkboxgroup');
			for ( var i = 0; i < brCheckBoxes.length; i++) {
				var cBox = brCheckBoxes[i].query('checkbox');
				for ( var j = 0; j < cBox.length; j++) {
					if(!cBox[j].isDisabled())
					cBox[j].setValue(true);
				}
			}
			
		}
		else if('N' === isTradeOptionsAllSelected && 
		'Y'===allOptionsSelectionInModel)
		{
			var brCheckBoxes = objTradeFeaturePopup.query('checkboxgroup');
			for ( var i = 0; i < brCheckBoxes.length; i++) {
				var cBox = brCheckBoxes[i].query('checkbox');
				for ( var j = 0; j < cBox.length; j++) {
					cBox[j].setValue(false);
				}
			}
			
		}
		objTradeFeaturePopup.show();
	}
}

function setSelectedTradeFeatureItems(records, objJson, isUnselected) {
	
	var selectedAdminFItems = new Array();
	var items = records.items;
	var unSelected =false;
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
		$('#chkAllTradeFeaturesSelectedFlag').attr('src',
				'static/images/icons/icon_unchecked.gif');
	}
	else
	{
		$('#chkAllTradeFeaturesSelectedFlag').attr('src',
				'static/images/icons/icon_checked.gif');
	}
	
	strTradePrevililegesList = JSON.stringify(selectedAdminFItems);	
	strTradeFeatureList = JSON.stringify(objJson);
	allTradeSelectedrecords = [];
	popupTradeFeaturesSelectedValue ='Y';
	
	setDirtyBit();
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
	temp=temp-Derecords.length;	
	var actionCount = '(' + temp + ')';
	$("#actionCnt").text(actionCount);
	popupLinksSelectedValue = 'Y';
}


function showAlertsProfileFilterPopup(service, dropdownId, alertType) {
	if (null != objAlertProfileFilterPopup) {
		objAlertProfileFilterPopup.setService(service);
		objAlertProfileFilterPopup.setDropdownId(dropdownId);
		objAlertProfileFilterPopup.setDropdownType('A');
		objAlertProfileFilterPopup.setAlertType(alertType);
		objAlertProfileFilterPopup.show();
	}
}

function showReportsProfileFilterPopup(service, dropdownId) {
	if (null != objReportProfileFilterPopup) {
		objReportProfileFilterPopup.setService(service);
		objReportProfileFilterPopup.setDropdownId(dropdownId);
		objReportProfileFilterPopup.setDropdownType('R');
		objReportProfileFilterPopup.show();
	}
}



function showSelectedFields(service, dropdownId, dropdownType, seachType,
		category1, category2, alertType) {
	var strUrl = 'cpon/clientServiceSetup/filterProfile.json';
	strUrl = strUrl + '?&type=' + seachType + '&category=' + category1
			+ '&subcategory=' + category2 + '&service=' + service
			+ '&dropdownType=' + dropdownType;

	strUrl = strUrl + '&alertType=' + alertType;
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
			combo.innerHTML = "";
			var option = document.createElement("option");
			option.text = getLabel('select', 'Select');
			option.value = '';
			combo.appendChild(option);
			for ( var i = 0; i < data.length; i++) {
				var option = document.createElement("option");
				option.text = data[i].profile_name;
				option.value = data[i].profile_id;
				combo.appendChild(option);
			}
		},
		failure : function(response) {
			// console.log("Ajax Get data Call Failed");
		}

	});
}


