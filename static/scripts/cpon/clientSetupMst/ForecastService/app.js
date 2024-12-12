
var objForecastWidgetsSelectionPopup = null;
var objForecastActionsSelectionPopup = null;
var objReportProfileFilterPopup = null;
var objAlertProfileFilterPopup = null;
var categoryStore = null;
var subCategoryStore = null;
var isForecastWidgetsAllSelected = 'U';
var isForecastActionLinksAllSelected = 'U';
var saveItemsFn=null;
var serviceURLFn=null;
var strForecastFeatureList = '[]';
Ext.Loader.setConfig({
	enabled : true,
	setPath : {
		'Ext' : 'static/js/extjs4.2.1/src',
		'Ext.ux' : 'static/js/extjs4.2.1/src/ux'
	}
});

Ext.Loader.setPath('GCP', 'static/scripts/cpon/common');
Ext.Loader.setPath('GCPView', 'static/scripts/cpon/common');

Ext.application({
	name : 'CPON',
	// appFolder : 'app',
	requires : [ 'Ext.util.MixedCollection', 'Ext.util.Filter',
			 'GCP.view.CopyProfileSeek','GCP.view.ProfileFilterPopup','Ext.ux.gcp.FilterPopUpView', 'GCPView.view.ForecastFeatuesPopup' ],
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
						
				if(checkValueEle != null &&  checkValueEle.getAttribute('src').indexOf('/icon_unchecked')!=-1 && me.userMode != 'VIEW' && me.userMode != 'VERIFY'){
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
				actionMethods : {
					create : "POST",
					read : "POST",
					update : "POST",
					destroy : "POST"
				},
				noCache:false
			},
			autoLoad : true
		});

		categoryStore.on('load', function(store) {
			store.insert(0, {
				"name" : getLabel('all', 'ALL'),
				"value" : ""
			});
		});
	
		objForecastWidgetsSelectionPopup = Ext.create('Ext.ux.gcp.FilterPopUpView',
				{
					fnCallback : setSelectedWidgetItems,
					title :  getLabel('Widgets', 'Widgets'),
					labelId : 'widgetCnt',
					keyNode : 'value',
					itemId : 'forecastWidgetSelectionPopup',
					checkboxId:'chkAllWidgetsSelectedFlag',
					displayCount:true,
					profileId :forecastFeatureProfileId,
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
								key:'module',value: '10'
							},{
								key:'profileId',value: ''
							},{
								key:'id',value: encodeURIComponent(parentkey)
							}],
					cfgShowFilter:true,
					userMode: viewmode,
					module : '10',
					hiddenValueField : 'selectedWidgets',
					hiddenValuePopUpField :'popupWidgetsSelectedFlag',
					savefnCallback :saveItemsFn,
					urlCallback :serviceURLFn
					/*listeners : {
						beforeshow : function(t) {
							var br_grid_Container = objForecastWidgetsSelectionPopup.down('container[itemId="gridContainer"]');
							br_grid_Container.maxHeight = 390;
						},
						resize : function(){
							this.center();
						}
					}*/
				});
		objForecastActionsSelectionPopup = Ext.create('Ext.ux.gcp.FilterPopUpView',
				{
					fnCallback : setSelectedActionItems,
					title : getLabel('actionlinks', 'Action Links'),
					labelId : 'widgetCnt',
					keyNode : 'value',
					itemId : 'forecastActionSelectionPopup',
					checkboxId:'chkAllLinksSelectedFlag',
					displayCount:true,
					profileId :forecastFeatureProfileId,
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
								key:'module',value: '10'
							},{
								key:'profileId',value: forecastFeatureProfileId
							},{
								key:'id',value: encodeURIComponent(parentkey)
							}],
					module : '10',
					userMode: viewmode,
					hiddenValueField : 'selectedActionLinks',
					hiddenValuePopUpField :'popupLinksSelectedFlag',
					savefnCallback :saveItemsFn,
					urlCallback :serviceURLFn
					/*listeners : {
						beforeshow : function(t) {
							var br_grid_Container = objForecastActionsSelectionPopup.down('container[itemId="gridContainer"]');
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

function getSelectForecastWidgetsPopup() {
	selectedr = [];
	var optionsSelected = $('#selectedWidgets').val();
	if (!Ext.isEmpty(optionsSelected)) {
		var options = optionsSelected.split(",");
		isForecastWidgetsAllSelected = 'N';
	} else {
		var selectFlag = $('#allWidgetsSelectedFlag').val();
		if (!Ext.isEmpty(selectFlag))
			isForecastWidgetsAllSelected = selectFlag;
		else
			isForecastWidgetsAllSelected = 'N';
	}
	if (Ext.isEmpty(objForecastWidgetsSelectionPopup)) {

		objForecastWidgetsSelectionPopup = Ext.create('Ext.ux.gcp.FilterPopUpView',
				{
					fnCallback : setSelectedWidgetItems,
					title :  getLabel('widget', 'Widget'),
					labelId : 'widgetCnt',
					keyNode : 'value',
					itemId : 'forecastWidgetSelectionPopup',
					checkboxId:'chkAllWidgetsSelectedFlag',
					displayCount:true,
					profileId :forecastFeatureProfileId,
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
				   cfgFilterLabel:getLabel('Widgets', 'Widgets'),
					   cfgAutoCompleterUrl:'cponFeatures',
						cfgUrl:'cpon/clientServiceSetup/{0}',
						paramName:'filterName',
						dataNode:'name',
						rootNode : 'd.filter',
						autoCompleterExtraParam:
							[{
								key:'featureType',value:'W'
							},{
								key:'module',value: '10'
							},{
								key:'profileId',value: ''
							},{
								key:'id',value: encodeURIComponent(parentkey)
							}],
					module : '10',
					userMode: viewmode,
					hiddenValueField : 'selectedWidgets',
					hiddenValuePopUpField :'popupWidgetsSelectedFlag',
					savefnCallback :saveItemsFn,
					urlCallback :serviceURLFn
				});
		
		objForecastWidgetsSelectionPopup.on('beforeshow' , function(t) {
			var br_grid_Container = objForecastWidgetsSelectionPopup.down('container[itemId="gridContainer"]');
			br_grid_Container.maxHeight = 390;
		});
		
		objForecastWidgetsSelectionPopup.show();
		objForecastWidgetsSelectionPopup.center();
	}
	else{
		objForecastWidgetsSelectionPopup.lastSelectedWidgets = options;
		objForecastWidgetsSelectionPopup.isAllSelected = isForecastWidgetsAllSelected;				
		objForecastWidgetsSelectionPopup.show();
		objForecastWidgetsSelectionPopup.center();
		var searchField = objForecastWidgetsSelectionPopup.down('container[itemId="filterContainer"] AutoCompleter');
		if(searchField!="" && searchField!=undefined)
			searchField.setValue('');
		var clearlink = objForecastWidgetsSelectionPopup.down('component[itemId="clearLink"]');
		clearlink.hide();
	}
	var filterContainer = objForecastWidgetsSelectionPopup.down('container[itemId="filterContainer"] AutoCompleter');
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
}

function getSelectForecastActionLinkPopup() {
	selectedr = [];
	var optionsSelected = $('#selectedActionLinks').val();
	if (!Ext.isEmpty(optionsSelected)) {
		var options = optionsSelected.split(",");
		isForecastActionLinksAllSelected = 'N';
	} else {
		var selectFlag = $('#allLinksSelectedFlag').val();
		if (!Ext.isEmpty(selectFlag))
			isForecastActionLinksAllSelected = selectFlag;
		else
			isForecastActionLinksAllSelected = 'N';
	}
	if (Ext.isEmpty(objForecastActionsSelectionPopup)) {

		objForecastActionsSelectionPopup = Ext.create('Ext.ux.gcp.FilterPopUpView',
				{
					fnCallback : setSelectedActionItems,
					title : getLabel('actionlinks', 'Action Links'),
					labelId : 'widgetCnt',
					keyNode : 'value',
					itemId : 'forecastActionSelectionPopup',
					checkboxId:'chkAllLinksSelectedFlag',
					displayCount:true,
					profileId :forecastFeatureProfileId,
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
					cfgShowFilter:true,
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
								key:'module',value: '10'
							},{
								key:'profileId',value: forecastFeatureProfileId
							},{
								key:'id',value: encodeURIComponent(parentkey)
							}],
					module : '10',
					userMode: viewmode,
					hiddenValueField : 'selectedActionLinks',
					hiddenValuePopUpField :'popupLinksSelectedFlag',
					savefnCallback :saveItemsFn,
					urlCallback :serviceURLFn
				});
		
		objForecastActionsSelectionPopup.on('beforeshow' , function(t) {
			var br_grid_Container = objForecastActionsSelectionPopup.down('container[itemId="gridContainer"]');
			br_grid_Container.maxHeight = 390;
		});
		objForecastActionsSelectionPopup.show();
		objForecastActionsSelectionPopup.center();
	}
	else{
		objForecastActionsSelectionPopup.lastSelectedWidgets = options;
		objForecastActionsSelectionPopup.isAllSelected = isForecastActionLinksAllSelected;		
		objForecastActionsSelectionPopup.show();
		objForecastActionsSelectionPopup.center();
		var searchField = objForecastActionsSelectionPopup.down('container[itemId="filterContainer"] AutoCompleter');
		if(searchField!="" && searchField!=undefined)
		searchField.setValue('');
		var clearlink = objForecastActionsSelectionPopup.down('component[itemId="clearLink"]');
		clearlink.hide();
	}
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

	Ext.Ajax.request({
		url : strUrl,
		method : 'POST',
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

function getSelectForecastFeaturesPopup(){
	if(Ext.isEmpty(forecastFeaturePopupInst)) {
		forecastFeaturePopupInst = Ext.create('GCPView.view.ForecastFeatuesPopup',{
			fnCallback : setSelectedForecastFeatureItems
		});
	}
		if ($('#chkAllForecastFeaturesSelectedFlag').attr('src') == 'static/images/icons/icon_checked.gif') {
			var brCheckBoxes = forecastFeaturePopupInst.query('container');
			for ( var i = 0; i < brCheckBoxes.length; i++) {
				var cBox = brCheckBoxes[i].query('checkbox');
				for ( var j = 0; j < cBox.length; j++) {
					cBox[j].setValue(true);
					cBox[j].setReadOnly(true);
				}
			}
			var objErrorLbl;
			if(!Ext.isEmpty(forecastFeaturePopupInst))
				 objErrorLbl = forecastFeaturePopupInst.down('label[itemId=errorLabel]');
			if(!Ext.isEmpty(objErrorLbl))
				objErrorLbl.hide();
			forecastFeaturePopupInst.show();
		} else {
			var brCheckBoxes = forecastFeaturePopupInst.query('container');
			for ( var i = 0; i < brCheckBoxes.length; i++) {
				var cBox = brCheckBoxes[i].query('checkbox');
				for ( var j = 0; j < cBox.length; j++) {
					cBox[j].setReadOnly(false);
				}
			}
		}
	
	forecastFeaturePopupInst.show();
	forecastFeaturePopupInst.center();
}

function setSelectedForecastFeatureItems(records, objJson) {
	var isUnselected = false;
	if ('S' === clientType) {
		strForecastFeatureList = JSON.stringify([]);
	} else {
		strForecastFeatureList = JSON.stringify(objJson);
		for (i = 0; i < objJson.length; i++) {
			if(!objJson[i].featureValue) {
				isUnselected = true;
				break;
			}
		}
		if(isUnselected) {
			$('#chkAllForecastFeaturesSelectedFlag').attr('src', 'static/images/icons/icon_unchecked.gif');
		}
		else
		{
			$('#chkAllForecastFeaturesSelectedFlag').attr('src', 'static/images/icons/icon_checked.gif');
		}
	}
	
	popupForecastFeaturesSelectedValue = 'Y';
	popupForecastFeaturesSelectedFlag = 'Y';
	setDirtyBit();
}
