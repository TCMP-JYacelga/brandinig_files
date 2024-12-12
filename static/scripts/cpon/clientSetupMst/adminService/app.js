var objWidgetsSelectionPopup = null;
var objActionsSelectionPopup = null;
var objMessageSelectionPopup = null;
var objAdminFeaturePopup = null;
var objAdminProfileSeek = null;
var objThemeProfileFilterPopup = null;
var objReportProfileFilterPopup = null;
var objAlertProfileFilterPopup = null;
var objInterfaceProfileFilterPopup = null;
//var objBillingProfileFilterPopup = null;
var objFxProfileFilterPopup = null;
var objMFAProfileFilterPopup = null;
var objGroupByProfileFilterPopup = null;
var isAdminWidgetsAllSelected = 'N';
var isHomeActionLinksAllSelected = 'N';
var isAdminOptionsAllSelected = 'N';
var categoryStore = null;
var subCategoryStore = null;
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
	// appFolder : 'app',
	requires : [ 'GCP.view.BRFeaturePopup',
			'GCP.view.AdminFeaturePopup', 'GCP.view.CopyProfileSeek', 
			'GCP.view.ProfileFilterPopup','Ext.ux.gcp.FilterPopUpView' ],
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
			if ('M' == clientType)
			{
					document.getElementById(me.hiddenValueField).value = Ext
								.encode(jsonObj);
			}
						if (null != document
								.getElementById(me.hiddenValuePopUpField)
								&& undefined != document
										.getElementById(me.hiddenValuePopUpField) && 'M' == clientType)
						{
							if( "allMessagesSelectedFlag" == me.hiddenValuePopUpField )
								document.getElementById( "popupMessagessSelectedFlag" ).value = 'Y';
							else
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
		/*categoryStore = Ext.create('Ext.data.Store', {
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
		});*/
		
		objAdminProfileSeek = Ext.create('GCP.view.CopyProfileSeek', {
			itemId : 'adminProfileSeek',
			title : getLabel('copyadminprofile', 'Copy Admin Feature Profile'),
			columnName : getLabel('admfeatureprfname',
					'Admin Feature Profile Name'),
			actionUrl : 'doCopyAdminProfile.form'
		});

		objThemeProfileFilterPopup = Ext.create('GCP.view.ProfileFilterPopup',
				{
					fnCallback : showSelectedFields
				});
		objReportProfileFilterPopup = Ext.create('GCP.view.ProfileFilterPopup',
				{
					fnCallback : showSelectedFields
				});
		objAlertProfileFilterPopup = Ext.create('GCP.view.ProfileFilterPopup',
				{
					fnCallback : showSelectedFields
				});
		objInterfaceProfileFilterPopup = Ext.create(
				'GCP.view.ProfileFilterPopup', {
					fnCallback : showSelectedFields
				});
		/*
		objBillingProfileFilterPopup = Ext.create(
				'GCP.view.ProfileFilterPopup', {
					fnCallback : showSelectedFields
				});
		*/
		objTypeProfileFilterPopup = Ext.create('GCP.view.ProfileFilterPopup', {
			fnCallback : showSelectedFields
		});
		objFxProfileFilterPopup = Ext.create('GCP.view.ProfileFilterPopup', {
			fnCallback : showSelectedFields
		});
		objMFAProfileFilterPopup = Ext.create('GCP.view.ProfileFilterPopup', {
			fnCallback : showSelectedFields
		});
		
		objGroupByProfileFilterPopup = Ext.create('GCP.view.ProfileFilterPopup', {
			fnCallback : showSelectedFields
		});		
	}
});

function getSelectWidgetsPopup() {
	selectedr = [];
	var widgets;
	var homeWidgetSelected = $('#selectedWidgets').val();

	if (!Ext.isEmpty(homeWidgetSelected)) {
		widgets = homeWidgetSelected.split(",");
		isAdminWidgetsAllSelected = 'N';
	} else {
		var selectFlag = $('#allWidgetsSelectedFlag').val();
		if (!Ext.isEmpty(selectFlag)) {
			isAdminWidgetsAllSelected = selectFlag;
		} else {
			isAdminWidgetsAllSelected = 'N';
		}
	}

	if (Ext.isEmpty(objWidgetsSelectionPopup)) {
		objWidgetsSelectionPopup = Ext.create('Ext.ux.gcp.FilterPopUpView', {
					fnCallback : setSelectedWidgetItems,
					isAllSelected : isAdminWidgetsAllSelected,
					labelId : 'widgetCnt',
					keyNode : 'value',
					itemId : 'widgetSelectionPopup',
					checkboxId : 'chkAllWidgetsSelectedFlag',
					displayCount : true,
					profileId : adminFeatureProfileId,
					featureType : 'W',
					title : getLabel('Widgets', 'Widgets'),
					responseNode : 'filter',
					cls : 'non-xn-popup',
					width : 650,
					//maxWidth : 735,
					minHeight : 156,
					maxHeight : 550,
					draggable : false,
					resizable : false,
					cfgModel : {
						pageSize : 5,
						storeModel : {
							fields : ['name', 'value', 'isAssigned', 'readOnly'],
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
					cfgShowFilter : true,
					//cfgFilterLabel : 'Widgets',
					cfgAutoCompleterUrl : 'cponFeatures',
					autoCompleterEmptyText : getLabel('lbl.serachbywidget','Search by Widget Name'),
					cfgUrl : 'cpon/clientServiceSetup/{0}',
					paramName : 'filterName',
					dataNode : 'name',
					rootNode : 'd.filter',
					autoCompleterExtraParam : [{
								key : 'featureType',
								value : 'W'
							}, {
								key : 'module',
								value : '03'
							}, {
								key : 'profileId',
								value : adminFeatureProfileId
							}, {
								key : 'id',
								value : encodeURIComponent(parentkey)
							}],
					module : '03',
					userMode : viewmode,
					hiddenValueField : 'selectedWidgets',
					hiddenValuePopUpField : 'popupWidgetsSelectedFlag',
					savefnCallback : saveItemsFn,
					urlCallback : serviceURLFn
					/*listeners : {
						beforeshow : function(t) {
							var grid_Container = objWidgetsSelectionPopup.down('container[itemId="gridContainer"]');
							grid_Container.maxHeight = 390;
						},
						resize : function(){
					    this.center();
					   }
					}*/
				});
		objWidgetsSelectionPopup.on('beforeshow' , function(t) {
					var grid_Container = objWidgetsSelectionPopup.down('container[itemId="gridContainer"]');
					grid_Container.maxHeight = 390;
				});
		objWidgetsSelectionPopup.show();
	} else {
		objWidgetsSelectionPopup.lastSelectedWidgets = homeWidgetSelected;
		objWidgetsSelectionPopup.isAllSelected = isAdminWidgetsAllSelected;
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
	setDirtyBit();
}

function getSelectActionLinkPopup() {
	selectedr = [];
	var options;
	var optionsSelected = $('#selectedActionLinks').val();
	if (!Ext.isEmpty(optionsSelected)) {
		options = optionsSelected.split(",");
		isHomeActionLinksAllSelected = 'N';
	} else {
		var selectFlag = $('#allLinksSelectedFlag').val();
		if (!Ext.isEmpty(selectFlag))
			isHomeActionLinksAllSelected = selectFlag;
		else
			isHomeActionLinksAllSelected = 'N';
	}
	if (Ext.isEmpty(objActionsSelectionPopup)) {

	objActionsSelectionPopup = Ext.create('Ext.ux.gcp.FilterPopUpView',
		{
			fnCallback : setSelectedActionItems,
			title : getLabel('actionlinks', 'Action Links'),
			isAllSelected : isHomeActionLinksAllSelected,
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
								colDesc : getLabel('actionLink', 'Action Link'),
								colId : 'name',
								colHeader : getLabel('actionLinkNm', 'Action Links Name'),
								sortable : false,
								width : 517
							}]
			   },
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
						key:'module',value: '03'
					},{
						key:'profileId',value: adminFeatureProfileId
					},{
						key:'id',value: encodeURIComponent(parentkey)
					}],
			module : '03',
			userMode: viewmode,
			hiddenValueField : 'selectedActionLinks',
			hiddenValuePopUpField :'popupLinksSelectedFlag',
			savefnCallback :saveItemsFn,
			urlCallback :serviceURLFn
			/*listeners : {
				beforeshow : function(t) {
					var grid_Container = objActionsSelectionPopup.down('container[itemId="gridContainer"]');
					grid_Container.maxHeight = 390;
				},
				resize : function(){
					this.center();
				}
			}*/
		});
		objActionsSelectionPopup.on('beforeshow' , function(t) {
					var grid_Container = objActionsSelectionPopup.down('container[itemId="gridContainer"]');
					grid_Container.maxHeight = 390;
				});
		objActionsSelectionPopup.show();
	}
	else{
		objActionsSelectionPopup.lastSelectedWidgets = options;
		objActionsSelectionPopup.isAllSelected = isHomeActionLinksAllSelected;
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
	var actionCount = '(' + records.length + ')';
	$("#actionCnt").text(actionCount);

	popupLinksSelectedValue = 'Y';
	setDirtyBit();
}

function getSelectMessagePopup() {
	selectedr = [];
	var options;
	var optionsSelected = $('#selectedMessages').val();
	if (!Ext.isEmpty(optionsSelected)) {
		options = optionsSelected.split(",");

	} 
		if (Ext.isEmpty(objMessageSelectionPopup)) {
		objMessageSelectionPopup = Ext.create('Ext.ux.gcp.FilterPopUpView',
				{
					fnCallback : setSelectedMessageItems,
					lastSelectedRecords : '',
					title : getLabel('adminMessage', 'Message'),
					columnName : getLabel('adminMessageName',
								'Message Name'),
					//isAllSelected : isBrWidgetsAllSelected,
					labelId : 'msgCnt',
					lastSelectedWidgets : options,
					keyNode : 'value',
					itemId : 'messageSelectionPopup',
					checkboxId:'chkAllMessagesSelectedFlag',
					displayCount:true,
					profileId :adminFeatureProfileId,
					featureType:'M',
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
										colDesc : getLabel('adminMessageName', 'Message Name'),
										colId : 'name',
										colHeader : getLabel('adminMessageName', 'Message Name'),
										sortable : false,
										width : 517
									}]
					   },
						//cfgFilterLabel:'Message Types',
						 autoCompleterEmptyText : getLabel('searchByMsgname', 'Search By Message Name'),
						 cfgAutoCompleterUrl:'cponFeatures',
							cfgUrl:'cpon/clientServiceSetup/{0}',
							paramName:'filterName',
							dataNode:'name',
							rootNode : 'd.filter',
							autoCompleterExtraParam:
								[{
									key:'featureType',value:'M'
								},{
									key:'module',value: '03'
								},{
									key:'profileId',value: adminFeatureProfileId
								},{
									key:'id',value: encodeURIComponent(parentkey)
								}],
					module : '03',
					userMode: viewmode,
					hiddenValueField : 'selectedMessages',
					hiddenValuePopUpField :'allMessagesSelectedFlag',
					savefnCallback :saveItemsFn,
					urlCallback :serviceURLFn
					/*listeners : {
						beforeshow : function(t) {
							var grid_Container = objMessageSelectionPopup.down('container[itemId="gridContainer"]');
							grid_Container.maxHeight = 390;
						},
						resize : function(){
							this.center();
						}
					}*/
				});
		objMessageSelectionPopup.on('beforeshow' , function(t) {
					var grid_Container = objMessageSelectionPopup.down('container[itemId="gridContainer"]');
					grid_Container.maxHeight = 390;
				});
		objMessageSelectionPopup.show();
	}
	else{
		objMessageSelectionPopup.lastSelectedWidgets = options;
		//objMessageSelectionPopup.isAllSelected = isHomeActionLinksAllSelected;
		objMessageSelectionPopup.show();
		var searchField = objMessageSelectionPopup.down('container[itemId="filterContainer"] AutoCompleter');
		if(searchField!="" && searchField!=undefined)
		searchField.setValue('');
		var clearlink = objMessageSelectionPopup.down('component[itemId="clearLink"]');
		clearlink.hide();
	}
		objMessageSelectionPopup.center();
 var filterContainer = objMessageSelectionPopup.down('container[itemId="filterContainer"] AutoCompleter');
 filterContainer.focus();
}

function setSelectedMessageItems(records,Derecords,blnIsUnselected) {
var temp= lastMsgValCnt;
	for ( var i = 0; i < records.length; i++) {
			var val = records[i];
			if (!val.isAssigned) {
				temp=temp+1;
			}
		}
	temp=temp-Derecords.length;	
	var msgCount = '(' + temp + ')';
	$("#msgCnt").text(msgCount);
	popupMessagessSelectedValue = 'Y';
	setDirtyBit();
}

function getSelectAdminFeaturePopup(displaypopup) {
	var selectFlag = $('#allAdmFeaturesSelectedFlag').val();
	if (!Ext.isEmpty(selectFlag))
		isAdminOptionsAllSelected = selectFlag;
	else
		isAdminOptionsAllSelected = 'N';

	if (Ext.isEmpty(objAdminFeaturePopup) || (isAdminOptionsAllSelected === 'Y')) {
		objAdminFeaturePopup = Ext.create('GCP.view.AdminFeaturePopup', {
			itemId : 'adminFeaturePopup',
			fnCallback : setSelectedAdmFeatureItems,
			profileId : adminFeatureProfileId,
			featureType : 'P',
			module : '03',
			title : getLabel('adminAdvanceOptions', 'Admin Advance Options'),
			isAllSelected : isAdminOptionsAllSelected,
			listeners : {
				resize : function(){
					this.center();
				}
			}
		});
	}
	if(displaypopup)
	{
	objAdminFeaturePopup.show();
	objAdminFeaturePopup.center();
	}
	else{
		objAdminFeaturePopup.show();
		objAdminFeaturePopup.hide();
	}
	if(btnViewOld){
				for(var i=0;i<admPrivList.length;i++)
				{
					var tdArray1 = new Array();
					tdArray1 = $('#Advpopup'+i).parent().parent().parent().children();
					if(admPrivList[i] === 'modifiedFieldValue')
					{
						$('#'+tdArray1[1].id).children().addClass('modifiedmenus');
					}
					else if(admPrivList[i] === 'newFieldGridValue')
					{
						$('#'+tdArray1[1].id).children().addClass('newFieldPopupValue');
					}					
				}
				for(var i=0;i<admPrivAutoAppList.length;i++)
				{
					var tdArray1 = new Array();
					tdArray1 = $('#Advpopup'+i).parent().parent().parent().children();
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
	else
	{
		for(var i=0;i<admPrivList.length;i++)
				{
					if(admPrivList[i] === 'modifiedFieldValue')
					{
						var tdArray1 = new Array();
						tdArray1 = $('#Advpopup'+i).parent().parent().parent().children();
						$('#'+tdArray1[1].id).children().removeClass('modifiedmenus');
					}					
				}
				for(var i=0;i<admPrivAutoAppList.length;i++)
				{
					if(admPrivAutoAppList[i] === 'modifiedFieldValue')
					{
						var tdArray1 = new Array();
						tdArray1 = $('#Advpopup'+i).parent().parent().parent().children();
						$('#'+tdArray1[2].id).children().removeClass('modifiedmenus');
					}					
				}
	}
}
function setSelectedAdmFeatureItems(records) {
	var blnIsUnselected = false;
	var selectedAdminFItems = new Array();
	var items = records.items;
	for ( var i = 0; i < items.length; i++) {
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
	selectedAdminFeatureList = JSON.stringify(selectedAdminFItems);
	popupAdmFeaturesSelectedValue = 'Y';
	var count = 0 ;
	for ( var i = 0; i < items.length; i++) {
		var val = items[i].data;
		blnIsUnselected = val.isAssigned;
		if(val.isAssigned)
			count = count+1;
	}
	if(count==items.length)
	{
		blnIsUnselected = false;	
	}
	else
	{
		blnIsUnselected = true;
	}
	
	if(blnIsUnselected)
	{
		$('#chkAllAdmFeaturesSelectedFlag').attr('src',
		'static/images/icons/icon_unchecked.gif');
	}
	else
	{
		$('#chkAllAdmFeaturesSelectedFlag').attr('src',
		'static/images/icons/icon_checked.gif');
	}
	setDirtyBit();
}
function showAdminProfileSeek() {
	if (null != objAdminProfileSeek) {
		objAdminProfileSeek.show();
	}
}

function showThemesProfileFilterPopup(service, dropdownId) {
	if (null != objThemeProfileFilterPopup) {
		objThemeProfileFilterPopup.setService(service);
		objThemeProfileFilterPopup.setDropdownId(dropdownId);
		objThemeProfileFilterPopup.setDropdownType('H');
		objThemeProfileFilterPopup.show();
	}
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

function showInterfacesProfileFilterPopup(service, dropdownId) {
	if (null != objInterfaceProfileFilterPopup) {
		objInterfaceProfileFilterPopup.setService(service);
		objInterfaceProfileFilterPopup.setDropdownId(dropdownId);
		objInterfaceProfileFilterPopup.setDropdownType('I');
		objInterfaceProfileFilterPopup.show();
	}
}

/*
function showBillingProfileFilterPopup(service, dropdownId) {
	if (null != objBillingProfileFilterPopup) {
		objBillingProfileFilterPopup.setService(service);
		objBillingProfileFilterPopup.setDropdownId(dropdownId);
		objBillingProfileFilterPopup.setDropdownType('B');
		objBillingProfileFilterPopup.show();
	}
}
*/

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

function showFxProfileFilterPopup(service, dropdownId) {
	if (null != objFxProfileFilterPopup) {
		objFxProfileFilterPopup.setService(service);
		objFxProfileFilterPopup.setDropdownId(dropdownId);
		objFxProfileFilterPopup.setDropdownType('F');
		objFxProfileFilterPopup.show();
	}
}

function showMFAProfileFilterPopup(service, dropdownId) {
	if (null != objMFAProfileFilterPopup) {
		objMFAProfileFilterPopup.setService(service);
		objMFAProfileFilterPopup.setDropdownId(dropdownId);
		objMFAProfileFilterPopup.setDropdownType('M');
		objMFAProfileFilterPopup.show();
	}
}

function showGroupByProfileFilterPopup(service, dropdownId) {
	if (null != objGroupByProfileFilterPopup) {
		objGroupByProfileFilterPopup.setService(service);
		objGroupByProfileFilterPopup.setDropdownId(dropdownId);
		objGroupByProfileFilterPopup.setDropdownType('G');
		objGroupByProfileFilterPopup.show();
	}
}

function getFxProfilesDetailsPopup() {
    if (!Ext.isEmpty(strOldFxProfileId) && strOldFxProfileId != $("#fxProfileId").val()) {
        var objFxProfilesDetails = Ext.create(
            'GCP.view.FxProfileDetails', {
                itemId: 'fxProfilesDetails',
                newProfileId: $("#fxProfileId").val(),
                lastSelectedWidgets: $("#fxProfileId option:selected").text(),
                oldProfileId: strOldFxProfileId,
                oldProfileDesc: strOldFxProfileDesc
            });
        objFxProfilesDetails.show();
    }
}