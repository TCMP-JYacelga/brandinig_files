var objAccountTypeSelectionPopup = null;
var objCurrenciesSelectionPopup = null;
var objPoolCurrenciesSelectionPopup = null;
var objPoolAccountTypeSelectionPopup = null;


var objWidgetsSelectionPopup = null;
var objActionsSelectionPopup = null;
var objReportProfileFilterPopup = null;
var objAlertProfileFilterPopup = null;
var objBillingProfileFilterPopup = null;
var objLiquidityPopup = null;
var objLiquidityFeaturePopup = null;
var objLiquidityProdChangePopup = null;
var isLiquidityOptionsAllSelected = 'N';
var popupLiqFeaturesSelectedValue = 'N';
var saveItemsFn=null;
var serviceURLFn=null;
Ext.Loader.setConfig({
			enabled : true,
			setPath : {
				'Ext' : 'static/js/extjs4.2.1/src',
				'Ext.ux' : 'static/js/extjs4.2.1/src/ux'
			}
		});
Ext.application({
			name : 'CPON',
			appFolder : 'static/scripts/cpon/clientSetupMst/liquidityService/app',
			requires : ['CPON.view.LiquidityFeaturePopup','CPON.view.LiquidityProductChangePopup','Ext.ux.gcp.FilterPopUpView'],
			launch : function() {
				serviceURLFn = function (popup) {
		            var strUrl="";
		            if(popup.featureType === 'C' || popup.featureType === 'A' )
		            	strUrl = '&featureType=' + popup.featureType + '&module='
						+ popup.module + '&profileId=' + popup.profileId + '&productId=' + popup.productId + '&id=' + encodeURIComponent(parentkey);
		            else
			            strUrl = '&featureType=' + popup.featureType + '&module='
								+ popup.module + '&profileId=' + popup.profileId + '&id=' + encodeURIComponent(parentkey);
		           
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
				
					/*objCurrenciesSelectionPopup = Ext.create('Ext.ux.gcp.FilterPopUpView',
							{
								fnCallback : setSelectedCurrenciesItems,
								title :  getLabel('currencies', 'Currency'),
								labelId : 'currenciesCnt',
								keyNode : 'value',
								itemId : 'currenciesSelectionPopup',
								checkboxId:'chkAllCurrenciesSelectedFlag',
								displayCount:true,
								profileId :liquidityPofileId,
								productId : liquidityProductId,
								featureType:'C',
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
												colDesc : getLabel('ccycode', 'Currency Code'),
												colId : 'name',
												colHeader : getLabel('ccycode', 'Currency Code'),
												sortable : false,
												width : 90
											},{
												colDesc : getLabel('ccyName', 'Currency Name'),
												colId : 'value',
												colHeader : getLabel('ccyName', 'Currency Name'),
												sortable : false,
												width : 200
											}]
								   },
								cfgShowFilter:true,
								cfgFilterLabel:getLabel('lbl.serachbyCurrency','Search by Currency Name'),
								autoCompleterEmptyText : getLabel('lbl.serachbyCurrency','Search by Currency Name'),
								module : '04',
								 cfgAutoCompleterUrl:'cponFeatures',
									cfgUrl:'cpon/clientServiceSetup/{0}',
									paramName:'filterName',
									dataNode:'name',
									rootNode : 'd.filter',
									autoCompleterExtraParam:
										[{
											key:'featureType',value:'C'
										},{
											key:'module',value: '04'
										},{
											key:'profileId',value: liquidityPofileId
										},{
											key:'id',value: encodeURIComponent(parentkey)
										}],
								module : '04',
								userMode: viewmode,
								hiddenValueField : 'selectedCurrencies',
								hiddenValuePopUpField :'popupCurrenciesSelectedFlag',
								savefnCallback :saveItemsFn,
								urlCallback :serviceURLFn,
								listeners : {
									beforeshow : function(t) {
										var lms_grid_Container = objWidgetsSelectionPopup.down('container[itemId="gridContainer"]');
										lms_grid_Container.maxHeight = 390;
									},
									resize : function(){
										this.center();
									}
								}
							});*/
					
				objWidgetsSelectionPopup = Ext.create('Ext.ux.gcp.FilterPopUpView',
						{
							fnCallback : setSelectedWidgetItems,
							title :  getLabel('Widgets', 'Widgets'),
							labelId : 'widgetCnt',
							keyNode : 'value',
							itemId : 'widgetSelectionPopup',
							checkboxId:'chkAllWidgetsSelectedFlag',
							displayCount:true,
							profileId :liquidityPofileId,
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
							userMode: viewmode,
							autoCompleterEmptyText : getLabel('lbl.serachbywidget','Search by Widget Name'),
							module : '04',
							 cfgAutoCompleterUrl:'cponFeatures',
								cfgUrl:'cpon/clientServiceSetup/{0}',
								paramName:'filterName',
								dataNode:'name',
								rootNode : 'd.filter',
								autoCompleterExtraParam:
									[{
										key:'featureType',value:'W'
									},{
										key:'module',value: '04'
									},{
										key:'profileId',value: liquidityPofileId
									},{
										key:'id',value: encodeURIComponent(parentkey)
									}],
							hiddenValueField : 'selectedWidgets',
							hiddenValuePopUpField :'popupWidgetsSelectedFlag',
							savefnCallback :saveItemsFn,
							urlCallback :serviceURLFn
							/*listeners : {
								beforeshow : function(t) {
									var br_grid_Container = objWidgetsSelectionPopup.down('container[itemId="gridContainer"]');
									br_grid_Container.maxHeight = 390;
								},
								resize : function(){
									this.center();
								}
							}*/
						});
				objActionsSelectionPopup = Ext.create('Ext.ux.gcp.FilterPopUpView',
						{
							fnCallback : setSelectedActionItems,
							title : getLabel('actionlinks', 'Action Links'),
							labelId : 'widgetCnt',
							keyNode : 'value',
							itemId : 'actionSelectionPopup',
							checkboxId:'chkAllLinksSelectedFlag',
							displayCount:true,
							profileId :liquidityPofileId,
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
												colDesc : getLabel('actionLink','Action Link'),
												colId : 'name',
												colHeader : getLabel('actionLink','Action Link'),
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
										key:'module',value: '04'
									},{
										key:'profileId',value: liquidityPofileId
									},{
										key:'id',value: encodeURIComponent(parentkey)
									}],
							module : '04',
							userMode: viewmode,
							hiddenValueField : 'selectedActionLinks',
							hiddenValuePopUpField :'popupLinksSelectedFlag',
							savefnCallback :saveItemsFn,
							urlCallback :serviceURLFn
							/*listeners : {
								beforeshow : function(t) {
									var br_grid_Container = objActionsSelectionPopup.down('container[itemId="gridContainer"]');
									br_grid_Container.maxHeight = 390;
								},
								resize : function(){
									this.center();
								}
							}*/
						});
			   objLiquidityFeaturePopup = Ext.create('CPON.view.LiquidityFeaturePopup', {
						itemId : 'liquidityFeaturePopup',
						fnCallback : setSelectedLiqFeatureItems,					
						profileId : liquidityPofileId,
						featureType : 'P',
						module : '04',
						title : getLabel('liquidityAdvanceOptions', 'Liquidity Advance Options'),
						isAllSelected : isLiquidityOptionsAllSelected
					});
			   objLiquidityProdChangePopup = Ext.create('CPON.view.LiquidityProductChangePopup', {
					itemId : 'liquidityProductChangePopup',
					fnCallback : setSelectedLiqFeatureItems,					
					profileId : liquidityPofileId,
					featureType : 'P',
					module : '04', 
					title : getLabel('agreementNotif', 'Liquidity Product Change Alert'),
					 isAllSelected : isLiquidityOptionsAllSelected
				});
			   
				objWorkflowProfileFilterPopup = Ext.create('CPON.view.ProfileFilterPopup',
						{
					       fnCallback : showSelectedFields
				        });
				objReportProfileFilterPopup = Ext.create('CPON.view.ProfileFilterPopup',
						{
					         fnCallback : showSelectedFields
			         	});
				objAlertProfileFilterPopup = Ext.create('CPON.view.ProfileFilterPopup',
						{
					fnCallback : showSelectedFields
				});
				objBillingProfileFilterPopup = Ext.create('CPON.view.ProfileFilterPopup',
						{
					fnCallback : showSelectedFields
				});
				objSystemReceiverProfileFilterPopup = Ext.create('CPON.view.ProfileFilterPopup',
						{
					fnCallback : showSelectedFields
				});
				objLiquidityPopup = Ext.create('CPON.view.LiquidityPopup');	
				
			}
		});

function getSelectWidgetsPopup() {
	selectedr = [];
	var optionsSelected = $('#selectedWidgets').val();
	if (!Ext.isEmpty(optionsSelected)) {
		var options = optionsSelected.split(",");
		isLiqWidgetsAllSelected = 'N';
	} else {
		var selectFlag = $('#allWidgetsSelectedFlag').val();
		if (!Ext.isEmpty(selectFlag))
			isLiqWidgetsAllSelected = selectFlag;
		else
			isLiqWidgetsAllSelected = 'N';
	}	
	if (Ext.isEmpty(objWidgetsSelectionPopup)) {
		objWidgetsSelectionPopup = Ext.create('Ext.ux.gcp.FilterPopUpView',
				{
					fnCallback : setSelectedWidgetItems,
					title :  getLabel('widget', 'Widget'),
					labelId : 'widgetCnt',
					keyNode : 'value',
					itemId : 'widgetSelectionPopup',
					checkboxId:'chkAllWidgetsSelectedFlag',
					displayCount:true,
					profileId :liquidityPofileId,
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
								key:'module',value: '04'
							},{
								key:'profileId',value: liquidityPofileId
							},{
								key:'id',value: encodeURIComponent(parentkey)
							}],
					module : '04',
					userMode: viewmode,
					hiddenValueField : 'selectedWidgets',
					hiddenValuePopUpField :'popupWidgetsSelectedFlag',
					savefnCallback :saveItemsFn,
					urlCallback :serviceURLFn
				});
		objWidgetsSelectionPopup.on('beforeshow' , function(t) {
			var br_grid_Container = objWidgetsSelectionPopup.down('container[itemId="gridContainer"]');
			br_grid_Container.maxHeight = 390;
		});
		objWidgetsSelectionPopup.show();
	}
	else{
		objWidgetsSelectionPopup.isAllSelected = isLiqWidgetsAllSelected;					
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

function getSelectActionLinkPopup() {
	selectedr = [];
	var optionsSelected = $('#selectedActionLinks').val();
	if (!Ext.isEmpty(optionsSelected)) {
		var options = optionsSelected.split(",");
		isLiqActionLinksAllSelected = 'N';
	} else {
		var selectFlag = $('#allLinksSelectedFlag').val();
		if (!Ext.isEmpty(selectFlag))
			isLiqActionLinksAllSelected = selectFlag;
		else
			isLiqActionLinksAllSelected = 'N';
	}	
	if (Ext.isEmpty(objActionsSelectionPopup)) {
		objActionsSelectionPopup = Ext.create('Ext.ux.gcp.FilterPopUpView',
				{
					fnCallback : setSelectedActionItems,
					title : getLabel('actionlinks', 'Action Links'),
					keyNode : 'value',
					itemId : 'actionSelectionPopup',
					checkboxId:'chkAllLinksSelectedFlag',
					displayCount:true,
					profileId :liquidityPofileId,
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
								key:'module',value: '04'
							},{
								key:'profileId',value: liquidityPofileId
							},{
								key:'id',value: encodeURIComponent(parentkey)
							}],
					module : '04',
					userMode: viewmode,
					hiddenValueField : 'selectedActionLinks',
					hiddenValuePopUpField :'popupLinksSelectedFlag',
					savefnCallback :saveItemsFn,
					urlCallback :serviceURLFn
				});
		
		objWidgetsSelectionPopup.on('beforeshow' , function(t) {
			var br_grid_Container = objActionsSelectionPopup.down('container[itemId="gridContainer"]');
			br_grid_Container.maxHeight = 390;
		});
		objActionsSelectionPopup.show();
	}
	else{
		//objActionsSelectionPopup.lastSelectedWidgets = options;
		//objActionsSelectionPopup.isAllSelected = isHomeActionLinksAllSelected;
		objActionsSelectionPopup.isAllSelected = isLiqActionLinksAllSelected;			
		objActionsSelectionPopup.show();
		var searchField = objActionsSelectionPopup.down('container[itemId="filterContainer"] AutoCompleter');
		if(searchField!="" && searchField!=undefined)
		searchField.setValue('');
		var clearlink = objActionsSelectionPopup.down('component[itemId="clearLink"]');
		clearlink.hide();
	}
	objActionsSelectionPopup.center();
}
function setSelectedWidgetItems(records,Derecords, blnIsUnselected) {
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

function showLiquidityProfileSeek() {
	objLiquidityPopup.show();
}

function showSelectedFields(service, dropdownId, dropdownType, seachType, category1, category2, alertType){
	var strUrl = 'cpon/clientServiceSetup/filterProfile.json';
	strUrl = strUrl + '?&type='+seachType+'&category='+category1+'&subcategory='+category2+'&service='+service+'&dropdownType='+dropdownType;
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
						}
					});
}

function setSelectedLiqFeatureItems(records,objJson) {
	var selectedLiquidityFItems = new Array();
	var items = records.items;
	var unSelected = false;
	for ( var i = 0; i < items.length; i++) {
		var val = items[i].data;		
		var obj = {
			name : val.name,
			value : val.value,
			profileId : val.profileId,
			isAssigned : val.isAssigned,
			isAutoApproved : val.isAutoApproved
		};
		selectedLiquidityFItems.push(obj);
	}
	for ( var i = 0; i < items.length; i++) 
	{
		var val = items[i].data;	
		if(!val.isAssigned)
		{
			unSelected = true;
			break;
		}
	}
	if(!unSelected)
	{
		for ( var i = 0; i < objJson.length; i++) 
		{
			if(!objJson[i].featureValue)
			{
				unSelected = true;
				break;
			}
		}
	}
	strLMSFeatureList = JSON.stringify(objJson);
	selectedLiquidityFeatureList = JSON.stringify(selectedLiquidityFItems);
	popupLiqFeaturesSelectedValue = 'Y';
	setDirtyBit();
	if(unSelected)
	{
		 $('#chkAllLiquidityFeaturesSelectedFlag').attr('src','static/images/icons/icon_unchecked.gif');
	}
	else
	{
		 $('#chkAllLiquidityFeaturesSelectedFlag').attr('src','static/images/icons/icon_checked.gif');
	}
}

function getSelectLiquidityFeaturePopup() {
	var selectFlag = $('#allLiquidityFeaturesSelectedFlag').val();
	if (!Ext.isEmpty(selectFlag))
		isLiquidityOptionsAllSelected = selectFlag;
	else
		isLiquidityOptionsAllSelected = 'N';

	if (Ext.isEmpty(objLiquidityFeaturePopup)) {
		objLiquidityFeaturePopup = Ext.create('CPON.view.LiquidityFeaturePopup', {
			itemId : 'liquidityFeaturePopup',
			fnCallback : setSelectedLiqFeatureItems,
			profileId : liquidityPofileId,
			featureType : 'P',
			module : '04',
			title : getLabel('liquidityAdvanceOptions', 'Liquidity Advance Options'),
			isAllSelected : isLiquidityOptionsAllSelected
		});
		objLiquidityFeaturePopup.isAllSelected = isLiquidityOptionsAllSelected;
		if ('Y' === isLiquidityOptionsAllSelected) {
			var brCheckBoxes = objLiquidityFeaturePopup.query('container');
			for (var i = 0; i < brCheckBoxes.length; i++) {
				var cBox = brCheckBoxes[i].query('checkbox');
				for (var j = 0; j < cBox.length; j++) {
					if (!cBox[j].isDisabled())
						cBox[j].setValue(true);
				}
			}
		} else if ('N' === isLiquidityOptionsAllSelected
				&& 'Y' === allOptionsSelectionInModel) {
			var brCheckBoxes = objLiquidityFeaturePopup.query('container');
			for (var i = 0; i < brCheckBoxes.length; i++) {
				var cBox = brCheckBoxes[i].query('checkbox');
				for (var j = 0; j < cBox.length; j++) {
					cBox[j].setValue(false);
				}
			}
		}
		objLiquidityFeaturePopup.show();
		objLiquidityFeaturePopup.center();
	}
	else
	{
		if ('Y' === isLiquidityOptionsAllSelected) {
			var brCheckBoxes = objLiquidityFeaturePopup.query('container');
			for (var i = 0; i < brCheckBoxes.length; i++) {
				var cBox = brCheckBoxes[i].query('checkbox');
				for (var j = 0; j < cBox.length; j++) {
					if (!cBox[j].isDisabled())
						cBox[j].setValue(true);
				}
			}
		} else if ('N' === isLiquidityOptionsAllSelected
				&& 'Y' === allOptionsSelectionInModel) {
			var brCheckBoxes = objLiquidityFeaturePopup.query('container');
			for (var i = 0; i < brCheckBoxes.length; i++) {
				var cBox = brCheckBoxes[i].query('checkbox');
				for (var j = 0; j < cBox.length; j++) {
					cBox[j].setValue(false);
				}
			}
		}
		objLiquidityFeaturePopup.show();
		objLiquidityFeaturePopup.center();
	}
	if(isLiquidityOptionsAllSelected == 'Y') {
		var grid = objLiquidityFeaturePopup.down('grid[itemId=lmsFeatureViewId]');
		var data = grid.store.data;
		for(var i=0;i<data.length;i++) {
			var record = grid.store.data.getAt(i).data;
			record.isAssigned = true;
		}
		grid.getView().refresh();
		grid.store.on('load',function(){
			var grid = objLiquidityFeaturePopup.down('grid[itemId=lmsFeatureViewId]');
			var data = grid.store.data;
			for(var i=0;i<data.length;i++) {
				var record = grid.store.data.getAt(i).data;
				record.isAssigned = true;
			}
			grid.getView().refresh();
		})
	}
}

function getAccountTypePopup() {
	selectedr = [];
	var optionsSelected = $('#selectedAccountType').val();
	if (!Ext.isEmpty(optionsSelected)) {
		var options = optionsSelected.split(",");
		isLiqWidgetsAllSelected = 'N';
	} 
	if (Ext.isEmpty(objAccountTypeSelectionPopup)) {
		objAccountTypeSelectionPopup = Ext.create('Ext.ux.gcp.FilterPopUpView',
				{
					fnCallback : setAccountTypeItems,
					title :  getLabel('AccountTypes', 'Account Types'),
					labelId : 'widgetCnt',
					keyNode : 'name',
					itemId : 'accountTypeSelectionPopup',
					checkboxId:'chkAllAccountsTypeSelectedFlag',
					displayCount:true,
					profileId :liquidityPofileId,
					productId : liquidityProductId,
					featureType:'A',
					responseNode :'filter',
					userMode: 'VIEW',
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
										colDesc : getLabel('accountType','Account Type'),
										colId : 'value',
										colHeader : getLabel('accountType','Account Type'),
										width : 330,
										sortable : false
									}]
					   },
					cfgShowFilter:true,
					autoCompleterEmptyText : getLabel('lbl.serachbyAccountTypes','Search By Account Type'),
					cfgFilterLabel:getLabel('AccountTypes', 'Account Types'),
					 cfgAutoCompleterUrl:'cponFeatures',
						cfgUrl:'cpon/clientServiceSetup/{0}',
						paramName:'filterName',
						dataNode:'name',
						dataNode2 : 'value',
						rootNode : 'd.filter',
						autoCompleterExtraParam:
							[{
								key:'featureType',value:'A'
							},{
								key:'module',value: '04'
							},{
								key:'productId',value: liquidityProductId
							},{
								key:'profileId',value: liquidityPofileId
							},{
								key:'id',value: encodeURIComponent(parentkey)
							}],
					module : '04',
					hiddenValueField : 'selectedAccountType',
					hiddenValuePopUpField :'popupAccountTypeSelectedFlag',
					savefnCallback :saveItemsFn,
					urlCallback :serviceURLFn
				});
		objAccountTypeSelectionPopup.show();
	}
	else{
		//objAccountTypeSelectionPopup.isAllSelected = isLiqWidgetsAllSelected;					
		objAccountTypeSelectionPopup.show();
		var searchField = objAccountTypeSelectionPopup.down('container[itemId="filterContainer"] AutoCompleter');
		if(searchField!="" && searchField!=undefined)
			searchField.setValue('');
		var clearlink = objAccountTypeSelectionPopup.down('component[itemId="clearLink"]');
		clearlink.hide();
	}
	objAccountTypeSelectionPopup.center();
	var filterContainer = objAccountTypeSelectionPopup.down('container[itemId="filterContainer"] AutoCompleter');
	 filterContainer.focus();
}
function setAccountTypeItems(records,Derecords, blnIsUnselected) {
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
	$("#accountTypeCnt").text(widgetCount);
	popupAccountTypeSelectedValue = 'Y';
	}

function getSelectCurrenciesPopup(){
	selectedr = [];
	var optionsSelected = $('#selectedCurrencies').val();
	isLiqCurrenciesAllSelected = 'N';
	if (!Ext.isEmpty(optionsSelected)) {
		var options = optionsSelected.split(",");
	} /*else {
		var selectFlag = $('#allCurrenciesSelectedFlag').val();
		if (!Ext.isEmpty(selectFlag))
			isLiqCurrenciesAllSelected = selectFlag;
		else
			isLiqCurrenciesAllSelected = 'N';
	}*/
	
	if (Ext.isEmpty(objCurrenciesSelectionPopup)) {
		objCurrenciesSelectionPopup = Ext.create('Ext.ux.gcp.FilterPopUpView',
				{
					fnCallback : setSelectedCurrenciesItems,
					title :  getLabel('currencies', 'Currency'),
					labelId : 'currenciesCnt',
					keyNode : 'name',
					itemId : 'currenciesSelectionPopup',
					checkboxId:'chkAllCurrenciesSelectedFlag',
					displayCount:true,
					profileId :liquidityPofileId,
					productId : liquidityProductId,
					featureType:'C',
					responseNode :'filter',
					cls : 'non-xn-popup',
					userMode: 'VIEW',
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
									colDesc : getLabel('ccycode', 'Currency Code'),
									colId : 'name',
									colHeader : getLabel('ccycode', 'Currency Code'),
									sortable : false,
									width : 90
								},{
									colDesc : getLabel('ccyName', 'Currency Name'),
									colId : 'value',
									colHeader : getLabel('ccyName', 'Currency Name'),
									sortable : false,
									width : 200
								}]
					   },
					cfgShowFilter:true,
					autoCompleterEmptyText : getLabel('lbl.serachbyCurrency','Search By Currency Name'),
					cfgFilterLabel:getLabel('LmsCurrencyName','Currency Name'),
					 cfgAutoCompleterUrl:'cponFeatures',
						cfgUrl:'cpon/clientServiceSetup/{0}',
						paramName:'filterName',
						dataNode:'name',
						dataNode2 : 'value',
						rootNode : 'd.filter',
						autoCompleterExtraParam:
							[{
								key:'featureType',value:'C'
							},{
								key:'module',value: '04'
							},{
								key:'profileId',value: liquidityPofileId
							},{
								key:'productId',value: liquidityProductId
							},{
								key:'id',value: encodeURIComponent(parentkey)
							}],
					module : '04',
					hiddenValueField : 'selectedCurrencies',
					hiddenValuePopUpField :'popupCurrenciesSelectedFlag',
					savefnCallback :saveItemsFn,
					urlCallback :serviceURLFn
				});
		objCurrenciesSelectionPopup.show();
	}
	else{
		objCurrenciesSelectionPopup.isAllSelected = isLiqCurrenciesAllSelected;					
		objCurrenciesSelectionPopup.show();
		var searchField = objCurrenciesSelectionPopup.down('container[itemId="filterContainer"] AutoCompleter');
		if(searchField!="" && searchField!=undefined)
			searchField.setValue('');
		var clearlink = objCurrenciesSelectionPopup.down('component[itemId="clearLink"]');
		clearlink.hide();
	}
	objCurrenciesSelectionPopup.center();
	var filterContainer = objCurrenciesSelectionPopup.down('container[itemId="filterContainer"] AutoCompleter');
	 filterContainer.focus();
}

function setSelectedCurrenciesItems(records,Derecords, blnIsUnselected){
	var temp= lastCurrencyValCnt;
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

	var currencyCount = '(' + temp + ')';
	$("#currenciesCnt").text(currencyCount);
	popupCurrenciesSelectedValue = 'Y';
}

function getPoolCurrenciesPopup(){
	selectedr = [];
	var optionsSelected = $('#selectedPoolCurrencies').val();
	isLiqCurrenciesAllSelected = 'N';
	if (!Ext.isEmpty(optionsSelected)) {
		var options = optionsSelected.split(",");
	} 
	
	if (Ext.isEmpty(objPoolCurrenciesSelectionPopup)) {
		objPoolCurrenciesSelectionPopup = Ext.create('Ext.ux.gcp.FilterPopUpView',
				{
					fnCallback : setSelectedPoolCurrenciesItems,
					title :  getLabel('currencies', 'Currency'),
					labelId : 'PoolCurrenciesCnt',
					keyNode : 'name',
					itemId : 'currenciesPoolSelectionPopup',
					checkboxId:'chkAllCurrenciesSelectedFlag',
					displayCount:true,
					profileId :liquidityPofileId,
					productId : liquidityPoolProductId,
					featureType:'C',
					responseNode :'filter',
					userMode: 'VIEW',
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
									colDesc : getLabel('ccycode', 'Currency Code'),
									colId : 'name',
									colHeader : getLabel('ccycode', 'Currency Code'),
									sortable : false,
									width : 90
								},{
									colDesc : getLabel('ccyName', 'Currency Name'),
									colId : 'value',
									colHeader : getLabel('ccyName', 'Currency Name'),
									sortable : false,
									width : 200
								}]
					   },
					cfgShowFilter:true,
					autoCompleterEmptyText : getLabel('lbl.serachbyCurrency','Search By Currency Name'),
					cfgFilterLabel:getLabel('LmsCurrencyName','Currency Name'),
					 cfgAutoCompleterUrl:'cponFeatures',
						cfgUrl:'cpon/clientServiceSetup/{0}',
						paramName:'filterName',
						dataNode:'name',
						dataNode2 : 'value',
						rootNode : 'd.filter',
						autoCompleterExtraParam:
							[{
								key:'featureType',value:'C'
							},{
								key:'module',value: '04'
							},{
								key:'profileId',value: liquidityPofileId
							},{
								key:'productId',value: liquidityPoolProductId
							},{
								key:'id',value: encodeURIComponent(parentkey)
							}],
					module : '04',
					hiddenValueField : 'selectedPoolCurrencies',
					hiddenValuePopUpField :'popupPoolCurrencySelectedFlag',
					savefnCallback :saveItemsFn,
					urlCallback :serviceURLFn
				});
		objPoolCurrenciesSelectionPopup.show();
	}
	else{
		objPoolCurrenciesSelectionPopup.isAllSelected = isLiqCurrenciesAllSelected;					
		objPoolCurrenciesSelectionPopup.show();
		var searchField = objPoolCurrenciesSelectionPopup.down('container[itemId="filterContainer"] AutoCompleter');
		if(searchField!="" && searchField!=undefined)
			searchField.setValue('');
		var clearlink = objPoolCurrenciesSelectionPopup.down('component[itemId="clearLink"]');
		clearlink.hide();
	}
	objPoolCurrenciesSelectionPopup.center();
	var filterContainer = objPoolCurrenciesSelectionPopup.down('container[itemId="filterContainer"] AutoCompleter');
	 filterContainer.focus();
}

function setSelectedPoolCurrenciesItems(records,Derecords, blnIsUnselected){
	var temp= lastCurrencyPoolValCnt;
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

	var currencyCount = '(' + temp + ')';
	$("#PoolCurrenciesCnt").text(currencyCount);
	popupPoolCurrenciesSelectedValue = 'Y';
}


function getPoolAccountTypePopup() {
	selectedr = [];
	var optionsSelected = $('#selectedPoolAccountType').val();
	if (!Ext.isEmpty(optionsSelected)) {
		var options = optionsSelected.split(",");
		isLiqWidgetsAllSelected = 'N';
	} 
	if (Ext.isEmpty(objPoolAccountTypeSelectionPopup)) {
		objPoolAccountTypeSelectionPopup = Ext.create('Ext.ux.gcp.FilterPopUpView',
				{
					fnCallback : setPoolAccountTypeItems,
					title :  getLabel('AccountTypes', 'Account Types'),
					labelId : 'PoolActCnt',
					keyNode : 'name',
					itemId : 'poolAccountTypeSelectionPopup',
					checkboxId:'chkAllAccountsTypeSelectedFlag',
					displayCount:true,
					profileId :liquidityPofileId,
					productId : liquidityPoolProductId,
					featureType:'A',
					responseNode :'filter',
					userMode: 'VIEW',
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
										colDesc : getLabel('accountType','Account Type'),
										colId : 'value',
										colHeader : getLabel('accountType','Account Type'),
										width : 330,
										sortable : false
									}]
					   },
					cfgShowFilter:true,
					autoCompleterEmptyText : getLabel('lbl.serachbyAccountTypes','Search By Account Type'),
					cfgFilterLabel:getLabel('AccountTypes', 'Account Types'),
					 cfgAutoCompleterUrl:'cponFeatures',
						cfgUrl:'cpon/clientServiceSetup/{0}',
						paramName:'filterName',
						dataNode:'name',
						dataNode2 : 'value',
						rootNode : 'd.filter',
						autoCompleterExtraParam:
							[{
								key:'featureType',value:'A'
							},{
								key:'module',value: '04'
							},{
								key:'productId',value: liquidityPoolProductId
							},{
								key:'profileId',value: liquidityPofileId
							},{
								key:'id',value: encodeURIComponent(parentkey)
							}],
					module : '04',
					hiddenValueField : 'selectedPoolAccountType',
					hiddenValuePopUpField :'popupPoolAccountTypeSelectedFlag',
					savefnCallback :saveItemsFn,
					urlCallback :serviceURLFn
				});
		objPoolAccountTypeSelectionPopup.show();
	}
	else{
		//objAccountTypeSelectionPopup.isAllSelected = isLiqWidgetsAllSelected;					
		objPoolAccountTypeSelectionPopup.show();
		var searchField = objPoolAccountTypeSelectionPopup.down('container[itemId="filterContainer"] AutoCompleter');
		if(searchField!="" && searchField!=undefined)
			searchField.setValue('');
		var clearlink = objPoolAccountTypeSelectionPopup.down('component[itemId="clearLink"]');
		clearlink.hide();
	}
	objPoolAccountTypeSelectionPopup.center();
	var filterContainer = objPoolAccountTypeSelectionPopup.down('container[itemId="filterContainer"] AutoCompleter');
	 filterContainer.focus();
}
function setPoolAccountTypeItems(records,Derecords, blnIsUnselected) {
	var temp= lastAccTypPoolValCnt;
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

	var accountCount = '(' + temp + ')';
	$("#PoolAccountTypeCnt").text(accountCount);
	popupPoolAccountTypeSelectedFlag = 'Y';
	}