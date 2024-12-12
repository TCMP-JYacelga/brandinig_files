var objWidgetsSelectionPopup = null;
var saveItemsFn=null;
var serviceURLFn=null;
var isDepositWidgetsAllSelected = null;
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
	appFolder : 'static/scripts/cpon/clientSetupMst/DepositService/app',
	requires : ['Ext.ux.gcp.FilterPopUpView'],
	launch : function() {
		serviceURLFn = function (popup) {
            var strUrl="";
            strUrl = '&featureType=' + popup.featureType + '&module='
					+ popup.module + '&profileId=' + popup.profileId + '&id=' + encodeURIComponent(parentkey)+ '&viewmode='+ viewmode;

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
	
	objWidgetsSelectionPopup = Ext.create('Ext.ux.gcp.FilterPopUpView',
				{
					fnCallback : setSelectedWidgetItems,
					title :  getLabel('Widgets', 'Widgets'),
					autoCompleterEmptyText : getLabel('lbl.serachbywidget','Search by Widget Name'),
					labelId : 'widgetCnt',
					keyNode : 'value',
					itemId : 'widgetSelectionPopup',
					checkboxId:'chkAllWidgetsSelectedFlag',
					displayCount:true,
					profileId :adminFeatureProfileId,
					featureType:'W',
					responseNode :'filter',
					cls : 'non-xn-popup',
					width : 480,
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
										colDesc : 'Widget Name',
										colId : 'name',
										colHeader : 'Widget Name',
										sortable : false,
										width : 330
									}]
					   },
					cfgShowFilter:true,
					//cfgFilterLabel:'Widgets',
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
							var gridContainer = objWidgetsSelectionPopup.down('container[itemId="gridContainer"]');
							gridContainer.maxHeight = 390;
						},
						resize : function(){
					    this.center();
					   }
					}*/
				});

						
				
	}
});

function updateAttachPackageLink(enableDisableFlag){
    CPON.getApplication().fireEvent('checkClicked',enableDisableFlag);
}


function setSelectedPayFeatureItems(records, objJson, isUnselected) {
	
	var selectedAdminFItems = new Array();
	var items = records.items;
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
	/*var msgCount='('+records.length+')';
	 $("#featureCnt").text(msgCount);*/
	console.log(isUnselected);
	if(isUnselected)
	{
		$('#allPaymentFeaturesSelectedFlag').val('N');
		$('#chkAllPayFeaturesSelectedFlag').attr('src',
				'static/images/icons/icon_unchecked.gif');
	}
	
	strPaymentPrevililegesList = JSON.stringify(selectedAdminFItems);	
	strPaymentFeatureList = JSON.stringify(objJson);
	allpaySelectedrecords = [];
	popupPayFeaturesSelectedValue ='Y';
}

function getDepositSelectWidgetsPopup() {
	selectedr = [];
	var options;
	var optionsSelected = $('#selectedWidgets').val();
	if (!Ext.isEmpty(optionsSelected)) {
		options = optionsSelected.split(",");
		isDepositWidgetsAllSelected = 'N';
	} else{
	var selectFlag = $('#allWidgetsSelectedFlag').val();
	if (!Ext.isEmpty(selectFlag))
		isDepositWidgetsAllSelected = selectFlag;
	else
		isDepositWidgetsAllSelected = 'N';
}
	if (Ext.isEmpty(objWidgetsSelectionPopup)) {
	
		objWidgetsSelectionPopup = Ext.create('Ext.ux.gcp.FilterPopUpView',
				{
					fnCallback : setSelectedWidgetItems,
					lastSelectedRecords : '',
					title :  getLabel('widget', 'Widget'),
					isAllSelected : isDepositWidgetsAllSelected,
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
					cfgModel : {
					     pageSize : 5,
						storeModel : {
							fields : ['name', 'value','isAssigned','readOnly'],
					proxyUrl : 'cpon/clientServiceSetup/cponFeatures',
					rootNode : 'd.filter',
					totalRowsNode : 'd.count'
					      },
					columnModel : [{
										colDesc : 'Widget Name',
										colId : 'name',
										colHeader : 'Message Name',
										width : 330
									}]
					   },
					cfgShowFilter:true,
					userMode: viewmode,
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
			var gridContainer = objWidgetsSelectionPopup.down('container[itemId="gridContainer"]');
			gridContainer.maxHeight = 390;
		});
		objWidgetsSelectionPopup.show();
	}
	else{
		objWidgetsSelectionPopup.lastSelectedWidgets = options;
		objWidgetsSelectionPopup.isAllSelected = isDepositWidgetsAllSelected;
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