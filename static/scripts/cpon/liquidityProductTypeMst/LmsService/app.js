var currencySelectionPopup = null;
var accountSelectionPopup = null;

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
	requires : ['Ext.ux.gcp.FilterPopUpView'],
	launch : function() {
		
		serviceURLFn = function (popup) {
            var strUrl="";
            strUrl = '&featureType=' + popup.featureType + '&productId=' + popup.profileId + '&id=' + encodeURIComponent(parentkey),
					+ '&viewmode='+viewMode;

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
										.getElementById(me.hiddenValuePopUpField))
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
			
	}
});

function getLmsCurrencyPopup() {
	selectedr = [];
	var widgets;
	var currencySelected = $('#selectedCurrency').val();
	var strProductCategoryType = $('#productCategoryType').val();
	var strProductCategoryTypeParamter = strProductCategoryType === 'N' ? 'Pooling' : 'Sweeping';
	isAdminWidgetsAllSelected = 'N';

	if (!Ext.isEmpty(currencySelected)) {
		widgets = currencySelected.split(",");
		isCurrencyAllSelected = 'N';
	} 

	if (Ext.isEmpty(currencySelectionPopup)) {
		currencySelectionPopup = Ext.create('Ext.ux.gcp.FilterPopUpView', {
					fnCallback : setSelectedCurrencyItems,
					labelId : 'widgetCnt',
					keyNode : 'name',
					itemId : 'CurrencySelectionPopup',
					checkboxId : 'chkAllCurrencySelectedFlag',
					displayCount : true,
					profileId : adminFeatureProductId,
					featureType : 'C',
					title : getLabel('lmscurrencylist', 'Currency List'),
					responseNode : 'filter',
					cls : 'non-xn-popup',
					width : 480,
					//maxWidth : 735,
					minHeight : 156,
					maxHeight : 550,
					draggable : false,
					resizable : false,
					cfgModel : {
						pageSize : 5,
						storeModel : {
							fields : ['name', 'value', 'isAssigned', 'readOnly'],
							proxyUrl : getLmsProductTypeEntryUrl('lmsFeatures'),
							rootNode : 'd.filter',
							totalRowsNode : 'd.count'
						},
						columnModel : [{
									colDesc : getLabel('CCyCode', 'Currency Code'),
									colId : 'name',
									colHeader : getLabel('CCyCode', 'Currency Code'),
									sortable : false,
									width : 90
								},{
									colDesc : getLabel('lmscurrencyname', 'Currency Name'),
									colId : 'value',
									colHeader : getLabel('lmscurrencyname', 'Currency Name'),
									sortable : false,
									width : 200
								}]
					},
					cfgShowFilter : true,
					//cfgFilterLabel : 'Widgets',
					cfgAutoCompleterUrl : 'LmsFeatures',
					autoCompleterEmptyText : getLabel('lmssearchbycurrency','Search by Currency Name'),
					cfgUrl : 'cpon/liquidity'+strProductCategoryTypeParamter+'ProductTypeMst/{0}',
					paramName : 'filterName',
					dataNode : 'name',
					rootNode : 'd.filter',
					autoCompleterExtraParam : [{
								key : 'featureType',
								value : 'C'
							},{
								key : 'productId',
								value : adminFeatureProductId
							},{
								key : 'id',
								value : encodeURIComponent(parentkey)
							}],
					module : '03',
					userMode : viewMode,
					dataNode2 : 'value',
					hiddenValueField : 'selectedCurrency',
					hiddenValuePopUpField : 'popupCurrencySelectedFlag',
					savefnCallback : saveItemsFn,
					urlCallback : serviceURLFn,
					listeners : {
						beforeshow : function(t) {
							var grid_Container = currencySelectionPopup.down('container[itemId="gridContainer"]');
							grid_Container.maxHeight = 390;
						},
						resize : function(){
					    this.center();
					   },
						'afterrender' : function() {
							var objGridCt = currencySelectionPopup.down('smartgrid');
							if (objGridCt){
								objGridCt.on('selectionUpdated', function(grid) {
									handleSelectionUpdatedForCurrencySelectionPopup(grid);
								});
								objGridCt.on('gridStoreLoad', function(grid) {
									handleSelectionUpdatedForCurrencySelectionPopup(grid);
								});
							}
						}
					}
				});
				


		
	} else {
		
		var searchField = currencySelectionPopup.down('container[itemId="filterContainer"] AutoCompleter');
		if(searchField!="" && searchField!=undefined)
			searchField.setValue('');
		var clearlink = currencySelectionPopup.down('component[itemId="clearLink"]');
		clearlink.hide();
	}
	currencySelectionPopup.show();
	currencySelectionPopup.center();
	var filterContainer = currencySelectionPopup.down('container[itemId="filterContainer"] AutoCompleter');
	 filterContainer.focus();
}

function setSelectedCurrencyItems(records,Derecords, blnIsUnselected) {
	var temp = currencyCounter;
	/*var temp= lastWdgValCnt;
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
	popupWidgetsSelectedValue = 'Y';*/
	
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
	

	/*var arrSelected = [], arrDeselected = [];
	var currencySelected = $('#selectedCurrency').val();
	if (!Ext.isEmpty(currencySelected) && errorPresent && ccyCountSet) {
		arrSelected = JSON.parse(currencySelected);
		arrSelected = arrSelected.selectedRecords.split(',');
		arrDeselected = JSON.parse(currencySelected);
		arrDeselected = arrDeselected.deSelectedRecords.split(',');
		temp=temp-arrSelected.length;
		temp=temp+arrDeselected.length;
		ccyCountSet = false;
	}*/
	$('#currencyCounter').text('(' + temp + ')');
	$('#ccyCounter').val(temp);
}

function setSelectedAccountItems(records,Derecords, blnIsUnselected) {

	/*var temp= lastWdgValCnt;
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
	popupWidgetsSelectedValue = 'Y';*/
	var temp = accountCounter;
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
	$('#accountCounter').text('(' + temp + ')');
	$('#accCounter').val(temp);
}


function getLmsCurrencyAccount() {
	selectedr = [];
	var widgets;
	var accountSelected = $('#selectedAccountType').val();
	var strProductCategoryType = $('#productCategoryType').val();
	var strProductCategoryTypeParamter = strProductCategoryType === 'N' ? 'Pooling' : 'Sweeping';
	isAdminWidgetsAllSelected = 'N';

	if (!Ext.isEmpty(accountSelected)) {
		widgets = accountSelected.split(",");
		isCurrencyAllSelected = 'N';
	} 

	if (Ext.isEmpty(accountSelectionPopup)) {
		accountSelectionPopup = Ext.create('Ext.ux.gcp.FilterPopUpView', {
					fnCallback : setSelectedAccountItems,
					isAllSelected : isAdminWidgetsAllSelected,
					labelId : 'widgetCnt',
					keyNode : 'name',
					itemId : 'AccountSelectionPopup',
					checkboxId : 'chkAllAccountSelectedFlag',
					displayCount : true,
					profileId : adminFeatureProductId,
					featureType : 'A',
					title : getLabel('accountType', 'Account Type'),
					responseNode : 'filter',
					cls : 'non-xn-popup',
					width : 480,
					//maxWidth : 735,
					minHeight : 156,
					maxHeight : 550,
					draggable : false,
					resizable : false,
					cfgModel : {
						pageSize : 5,
						storeModel : {
							fields : ['name', 'value', 'isAssigned', 'readOnly'],
							proxyUrl : getLmsProductTypeEntryUrl('lmsFeatures'),
							rootNode : 'd.filter',
							totalRowsNode : 'd.count'
						},
						columnModel : [{
//									colDesc : getLabel('accountName', 'Account Name'),
//									colId : 'name',
//									colHeader : getLabel('accountName', 'Account Name'),
//									sortable : false,
//									width : 90
//								},{
									colDesc : getLabel('accountType', 'Account Type'),
									colId : 'value',
									colHeader : getLabel('accountType', 'Account Type'),
									sortable : false,
									width : 200
								}]
					},
					cfgShowFilter : true,
					//cfgFilterLabel : 'Widgets',
					cfgAutoCompleterUrl : 'LmsFeatures',
					autoCompleterEmptyText : getLabel('lmssearchbyaccount','Search by Account Type'),
					cfgUrl : 'cpon/liquidity'+strProductCategoryTypeParamter+'ProductTypeMst/{0}',
					paramName : 'filterName',
					dataNode : 'name',
					rootNode : 'd.filter',
					autoCompleterExtraParam : [{
								key : 'featureType',
								value : 'A'
							},{
								key : 'productId',
								value : adminFeatureProductId
							},{
								key : 'id',
								value : encodeURIComponent(parentkey)
							}],
					module : '03',
					userMode : viewMode,
					dataNode2 : 'value',
					hiddenValueField : 'selectedAccountType',
					hiddenValuePopUpField : 'popupAccountTypeSelectedFlag',
					savefnCallback : saveItemsFn,
					urlCallback : serviceURLFn,
					listeners : {
						beforeshow : function(t) {
							var grid_Container = accountSelectionPopup.down('container[itemId="gridContainer"]');
							grid_Container.maxHeight = 390;
						},
						resize : function(){
					    this.center();
				},
				'afterrender' : function() {
					var objGridCt = accountSelectionPopup.down('smartgrid');
					if (objGridCt){
						objGridCt.on('selectionUpdated', function(grid) {
							handleSelectionUpdatedForAccountSelectionPopup(grid);
						});
						objGridCt.on('gridStoreLoad', function(grid) {
							handleSelectionUpdatedForAccountSelectionPopup(grid);
						});
					}
				}
			}
				});
			
	} else {
		var searchField = accountSelectionPopup.down('container[itemId="filterContainer"] AutoCompleter');
		if(searchField!="" && searchField!=undefined)
			searchField.setValue('');
		var clearlink = accountSelectionPopup.down('component[itemId="clearLink"]');
		clearlink.hide();
	}
	accountSelectionPopup.show();
	accountSelectionPopup.center();
	var filterContainer = accountSelectionPopup.down('container[itemId="filterContainer"] AutoCompleter');
	 filterContainer.focus();
}

function handleSelectionUpdatedForAccountSelectionPopup(grid) {
	var arrSelected = [], arrDeselected = [], selectedRecord = [], deselectedRecord = [];
	var accountSelected = $('#selectedAccountType').val();
	if (!Ext.isEmpty(accountSelected) && errorPresent) {
		arrSelected = JSON.parse(accountSelected);
		arrSelected = arrSelected.selectedRecords.split(',');
		arrDeselected = JSON.parse(accountSelected);
		arrDeselected = arrDeselected.deSelectedRecords.split(',');
		var records = grid.store.getRange();
		for (i = 0; i < records.length; i++) {
			var recordData = records[i].data;
			for (j = 0; j < arrSelected.length; j++) {
				if (recordData.name == arrSelected[j])
					selectedRecord.push(records[i]);
			}
			for (j = 0; j < arrDeselected.length; j++) {
				if (recordData.name == arrDeselected[j])
					deselectedRecord.push(records[i]);
			}
		}
		grid.getSelectionModel().select(selectedRecord);
		grid.getSelectionModel().deselect(deselectedRecord);
	}
}

function handleSelectionUpdatedForCurrencySelectionPopup(grid) {
	var arrSelected = [], arrDeselected = [], selectedRecord = [], deselectedRecord = [];
	var currencySelected = $('#selectedCurrency').val();
	if (!Ext.isEmpty(currencySelected) && errorPresent) {
		arrSelected = JSON.parse(currencySelected);
		arrSelected = arrSelected.selectedRecords.split(',');
		arrDeselected = JSON.parse(currencySelected);
		arrDeselected = arrDeselected.deSelectedRecords.split(',');
		var records = grid.store.getRange();
		for (i = 0; i < records.length; i++) {
			var recordData = records[i].data;
			for (j = 0; j < arrSelected.length; j++) {
				if (recordData.name == arrSelected[j])
					selectedRecord.push(records[i]);
			}
			for (j = 0; j < arrDeselected.length; j++) {
				if (recordData.name == arrDeselected[j])
					deselectedRecord.push(records[i]);
			}
		}
		grid.getSelectionModel().select(selectedRecord);
		grid.getSelectionModel().deselect(deselectedRecord);
	}
}


