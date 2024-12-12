var objBrFeatureIntradayAccountsPopup = null;
var objBrFeaturePrevdayAccountsPopup = null;

var objBrFeatureAccountsPopup = null;

var objBRProfileSeek = null;
var objBrCPCSelectionPopup = null;
var objBrWidgetsSelectionPopup = null;
var objBrActionsSelectionPopup = null;
var objReportProfileFilterPopup = null;
var objAlertProfileFilterPopup = null;
var objInterfaceProfileFilterPopup = null;
var objBillingProfileFilterPopup = null;
var objTypeProfileFilterPopup = null;
var objFxProfileFilterPopup = null;
var objBRFeaturePopup = null;
var categoryStore = null;
var subCategoryStore = null;
var isBrWidgetsAllSelected = 'U';
var isBrActionLinksAllSelected = 'U';
var isBrPrevAcctAllSelected = 'U';
var isBrIntraAcctAllSelected = 'U';
var isBrAcctAllSelected = 'U';
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
	requires : [  'GCP.view.BRFeaturePopup',
			'Ext.util.MixedCollection', 'Ext.util.Filter','Ext.ux.gcp.FilterPopUpView',
			'GCP.view.AdminFeaturePopup', 'GCP.view.CopyProfileSeek','GCP.view.BRFeatureAccountsPopup',
			'GCP.view.ProfileFilterPopup' ],
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
										.getElementById(me.hiddenValuePopUpField) && 'M' == clientType) {
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
		/*
 = Ext.create('Ext.data.Store', {
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
		}); */

		objBRProfileSeek = Ext
				.create('GCP.view.CopyBRProfileSeek',
						{
							itemId : 'brProfileSeek',
							title : getLabel('copybrprofile',
									'Copy BR Feature Profile'),
							columnName : getLabel('brfeatureprfname',
									'BR Feature Profile Name'),
							actionUrl : 'doCopyBRProfile.form'
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
		objBillingProfileFilterPopup = Ext.create(
				'GCP.view.ProfileFilterPopup', {
					fnCallback : showSelectedFields
				});
		objTypeProfileFilterPopup = Ext.create('GCP.view.ProfileFilterPopup', {
			fnCallback : showSelectedFields
		});
		objFxProfileFilterPopup = Ext.create('GCP.view.ProfileFilterPopup', {
			fnCallback : showSelectedFields
		});
	}
});

function getBRFeaturePopup() {
	if(Ext.isEmpty(objBRFeaturePopup))
	{
		objBRFeaturePopup = Ext.create('GCP.view.BRFeaturePopup', {
			itemId : 'brFeaturePopup',
			fnCallback : setSelectedBRFeatureItems,
			profileId : adminFeatureProfileId,
			featureType : 'P',
			module : '01',
			listeners : {
				'resize' : function(){
					this.center();
				}
			}
		});
	}
	
	var originalFields = [];
	var strCpFeatureChecked = document.getElementById('chkImg_F_SRV_BR_PRV_CP');
	var brCheckBoxes = objBRFeaturePopup.query('container[itemId=brContainer]');
	var objErrorLbl;
	if (brCheckBoxes[0] != undefined) {
			var cBox = brCheckBoxes[0].query('checkbox');
			
			for ( var j = 0; j < cBox.length; j++) {
				originalFields.push(cBox[j]);
			}
		}

	if(Ext.isEmpty(fieldJson)) {
		for ( var i = 0; i < brCheckBoxes.length; i++)
		{
			if (brCheckBoxes[i] != undefined)
			{
				var cBox = brCheckBoxes[i].query('checkbox');
				for ( var j = 0; j < cBox.length; j++)
				{
					if (cBox[j].defVal !== true)
					{
						if(!cBox[j].isDisabled())
						{
							cBox[j].setValue(false);
						}
					}
				}
			}
		}
	} else
	{		
		var featureDepandancy=['INTRAACT','VCIMG','PREVACT','PREVVCIMG','CASHPOSACNT','CASHPOSTRANS'];
		var strParentFeatureReference;
		for ( var i = 0; i < fieldJson.length-1; i++)
		{
			for(var j = 0; j < originalFields.length;j++)
			{
			if((fieldJson[i].checked == true) && (fieldJson[i].featureId === originalFields[j].featureId))
			{
				originalFields[j].checked = true;
			} else
			{
				//originalFields[i].checked = false;
			}	
			if($.inArray(originalFields[j].featureId,featureDepandancy)>-1)	
			{
				strParentFeatureReference=getParentFeatureReference(originalFields[j].featureId); 
				if(strParentFeatureReference == null) {
					originalFields[j].hidden = true;
				}
				if(strParentFeatureReference && (strParentFeatureReference.src.indexOf("icon_unchecked.gif") > -1 || strParentFeatureReference.src.indexOf("icon_unchecked_grey.gif") > -1))
				{
					originalFields[j].checked=false;
					originalFields[j].setValue(false);
					originalFields[j].setDisabled(true);
					originalFields[j].hide();							
				}
				else
				{
					originalFields[j].show();
					if('S' === clientType)
						originalFields[j].setDisabled(true);
					else
						originalFields[j].setDisabled(false);
				}
			}
			}
		}
	}

	if ($('#chkAllBRFeaturesSelectedFlag').attr('src') == 'static/images/icons/icon_checked.gif') {
		var objErrorLbl;
		var brCheckBoxes = objBRFeaturePopup.query('container');
		for ( var i = 0; i < brCheckBoxes.length; i++) {
			var cBox = brCheckBoxes[i].query('checkbox');
			for ( var j = 0; j < cBox.length; j++) {
				if (!cBox[j].isDisabled())
				{
					cBox[j].setValue(true);
				}
				
			}
		}
		var brTextFields = objBRFeaturePopup.query('textfield');
		for ( var i = 0; i < brTextFields.length; i++) {
			if ("textfield" === brTextFields[i].xtype) {
				brTextFields[i].setValue("999");
			}
		}
		
	}
	if(!Ext.isEmpty(objBRFeaturePopup))
		 objErrorLbl = objBRFeaturePopup.down('label[itemId=errorLabel]');
	if(!Ext.isEmpty(objErrorLbl))
		objErrorLbl.hide();
	objBRFeaturePopup.show();
	objBRFeaturePopup.center();
}
function getParentFeatureReference(featureId){
	var featureCheckBoxId;
	switch(featureId){
		case 'CASHPOSACNT':
		case 'CASHPOSTRANS':{featureCheckBoxId='chkImg_F_SRV_BR_PRV_CP';break;}
		case 'INTRAACT':
		case 'VCIMG':{featureCheckBoxId='chkImg_IRD';break;}
		case 'PREVACT':
		case 'PREVVCIMG':{featureCheckBoxId='chkImg_PRV';break;}
	}
	return document.getElementById(featureCheckBoxId);
}
function setSelectedBRFeatureItems(records, objJson) {
	var selectedAdminFItems = new Array();
	var isUnselected = false;
	/*
	 * var msgCount='('+records.length+')'; $("#msgCnt").text(msgCount);
	 */
	strBrPrevililegesList = JSON.stringify(selectedAdminFItems);
	if ('S' === clientType) {
		strBrFeatureList = JSON.stringify([]);
	} else {
		strBrFeatureList = JSON.stringify(objJson);
		
		for (i = 0; i < objJson.length; i++)
		{
			if(!objJson[i].featureValue)
			{
				isUnselected = true;
				break;
			}
		}
		if(isUnselected)
		{
			$('#chkAllBRFeaturesSelectedFlag').attr('src',
					'static/images/icons/icon_unchecked.gif');
		}
		else
		{
			$('#chkAllBRFeaturesSelectedFlag').attr('src',
					'static/images/icons/icon_checked.gif');
		}
	}
	
	popupBrFeaturesSelectedValue = 'Y';
	setDirtyBit();
}

function showBRProfileSeek() {
	if (null != objBRProfileSeek) {
		objBRProfileSeek.show();
	}
}

function getSelectBrWidgetsPopup() {
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
	if (Ext.isEmpty(objBrWidgetsSelectionPopup)) {
		objBrWidgetsSelectionPopup = Ext.create('Ext.ux.gcp.FilterPopUpView', {
					fnCallback : setSelectedWidgetItems,
					title : getLabel('Widgets', 'Widgets'),
					isAllSelected : isBrWidgetsAllSelected,
					labelId : 'widgetCnt',
					keyNode : 'value',
					itemId : 'brWidgetSelectionPopup',
					checkboxId : 'chkAllWidgetsSelectedFlag',
					displayCount : true,
					profileId : adminFeatureProfileId,
					featureType : 'W',
					responseNode : 'filter',
					cls : 'non-xn-popup',
					width : 480,
					//maxWidth : 735,
					minHeight : 156,
					maxHeight : 550,
					draggable : false,
					resizable : false,
					autoHeight : false,
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
									width : 330
								}]
					},
					//cfgFilterLabel : 'Widgets',
					autoCompleterEmptyText : getLabel('lbl.serachbywidget','Search by Widget Name'),
					cfgAutoCompleterUrl : 'cponFeatures',
					cfgUrl : 'cpon/clientServiceSetup/{0}',
					paramName : 'filterName',
					dataNode : 'name',
					rootNode : 'd.filter',
					autoCompleterExtraParam : [{
								key : 'featureType',
								value : 'W'
							}, {
								key : 'module',
								value : '01'
							}, {
								key : 'profileId',
								value : adminFeatureProfileId
							}, {
								key : 'id',
								value : encodeURIComponent(parentkey)
							}],
					module : '01',
					userMode : viewmode,
					hiddenValueField : 'selectedWidgets',
					hiddenValuePopUpField : 'popupWidgetsSelectedFlag',
					savefnCallback : saveItemsFn,
					urlCallback : serviceURLFn
					/*listeners : {
						beforeshow : function(t) {
							var br_grid_Container = objBrWidgetsSelectionPopup.down('container[itemId="gridContainer"]');
							br_grid_Container.maxHeight = 390;
						},
						afterrender : function(t) {
							var filterContainer = objBrWidgetsSelectionPopup.down('container[itemId="filterContainer"] AutoCompleter');
					    	filterContainer.focus();
						},
						resize : function(){
					    this.center();
					   }
					}*/
				});
				objBrWidgetsSelectionPopup.on('beforeshow' , function(t) {
					var grid_Container = objBrWidgetsSelectionPopup.down('container[itemId="gridContainer"]');
					grid_Container.maxHeight = 390;
				});
				objBrWidgetsSelectionPopup.on('afterrender' , function(t) {
					var filterContainer = objBrWidgetsSelectionPopup.down('container[itemId="filterContainer"] AutoCompleter');
			    	filterContainer.focus();
				});
		objBrWidgetsSelectionPopup.show();
	} else {
		objBrWidgetsSelectionPopup.lastSelectedWidgets = options;
		objBrWidgetsSelectionPopup.isAllSelected = isBrWidgetsAllSelected;
		objBrWidgetsSelectionPopup.show();
		var searchField = objBrWidgetsSelectionPopup.down('container[itemId="filterContainer"] AutoCompleter');
		if(searchField!="" && searchField!=undefined)
			searchField.setValue('');
		var clearlink = objBrWidgetsSelectionPopup.down('component[itemId="clearLink"]');
		clearlink.hide();
	}
	objBrWidgetsSelectionPopup.center();
	var filterContainer = objBrWidgetsSelectionPopup.down('container[itemId="filterContainer"] AutoCompleter');
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

function getSelectBrActionLinkPopup() {
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
			lastSelectedRecords : '',
			title : getLabel('actionlinks', 'Action Links'),
			columnName : getLabel('actionLinkNm',
							'Action Links Name'),
			isAllSelected : isBrActionLinksAllSelected,
			labelId : 'actionCnt',
			lastSelectedWidgets : options,
			keyNode : 'value',
			itemId : 'brActionSelectionPopup',
			checkboxId:'chkAllLinksSelectedFlag',
			displayCount:true,
			profileId :adminFeatureProfileId,
			featureType:'L',
			responseNode :'filter',
			cls : 'non-xn-popup',
			width : 480,
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
								width : 330
							}]
			   },
			
			//cfgFilterLabel:'Action Links',
			 cfgAutoCompleterUrl:'cponFeatures',
			autoCompleterEmptyText : getLabel('searchByName', 'Search By Action Link Name'),
				cfgUrl:'cpon/clientServiceSetup/{0}',
				paramName:'filterName',
				dataNode:'name',
				rootNode : 'd.filter',
				autoCompleterExtraParam:
					[{
						key:'featureType',value:'L'
					},{
						key:'module',value: '01'
					},{
						key:'profileId',value: adminFeatureProfileId
					},{
						key:'id',value: encodeURIComponent(parentkey)
					}],
			module : '01',
					userMode: viewmode,
			hiddenValueField : 'selectedActionLinks',
			hiddenValuePopUpField :'popupLinksSelectedFlag',
			savefnCallback :saveItemsFn,
			urlCallback :serviceURLFn
			/*listeners : {
				beforeshow : function(t) {
					var br_grid_Container = objBrActionsSelectionPopup.down('container[itemId="gridContainer"]');
					br_grid_Container.maxHeight = 390;
				},
				resize : function(){
					this.center();
				}
			}*/
		});
		objBrActionsSelectionPopup.on('beforeshow' , function(t) {
					var grid_Container = objBrActionsSelectionPopup.down('container[itemId="gridContainer"]');
					grid_Container.maxHeight = 390;
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

function getSelectBRFeatureIntraAccountsPopup() {
	selectedr = [];
	var optionsSelected = $('#selectedIntraDayAccnts').val();
	if (!Ext.isEmpty(optionsSelected)) {
		var options = optionsSelected.split(",");
		isBrIntraAcctAllSelected = 'N';
	} else {
		var selectFlag = $('#allIntraDayAccntsSelectedFlag').val();

		if (!Ext.isEmpty(selectFlag))
			isBrIntraAcctAllSelected = selectFlag;
		else
			isBrIntraAcctAllSelected = 'N';
	}

	if (!Ext.isEmpty(objBrFeatureIntradayAccountsPopup)) {
		
		objBrFeatureIntradayAccountsPopup = Ext.create('Ext.ux.gcp.FilterPopUpView',
		{
			fnCallback : setSelectedBRIntraAccountItems,
			title : getLabel('intradayaccounts', 'Intra Day Accounts'),
			isAllSelected : isBrIntraAcctAllSelected,
			labelId : 'featureCnt',
			keyNode : 'value',
			itemId : 'brAccountFeaturePopup',
			checkboxId:'chkAllIntraDayAccntsSelectedFlag',
			displayCount:true,
			profileId :adminFeatureProfileId,
			featureType:'IA',
			responseNode :'filter',
			cfgModel : {
				 pageSize : 5,
				storeModel : {
					fields : ['name', 'value','isAssigned','readOnly'],
			proxyUrl : 'cpon/clientServiceSetup/brAccountsData',
			rootNode : 'd.filter',
			totalRowsNode : 'd.count'
				  },
			columnModel : [{
								colDesc : getLabel('intradayaccounts', 'Intra Day Accounts'),
								colId : 'name',
								colHeader : getLabel('lblAcctNumber', 'Account'),
								width : 330
							}]
			   },
			cfgFilterLabel:getLabel('intradayaccounts', 'Intra Day Accounts'),
			 cfgAutoCompleterUrl:'brAccountsData',
				cfgUrl:'cpon/clientServiceSetup/{0}',
				paramName:'filterName',
				dataNode:'name',
				rootNode : 'd.filter',
				autoCompleterExtraParam:
					[{
						key:'featureType',value:'IA'
					},{
						key:'module',value: '01'
					},{
						key:'profileId',value: adminFeatureProfileId
					},{
						key:'id',value: encodeURIComponent(parentkey)
					}],
			module : '01',
			userMode: viewmode,
			hiddenValueField : 'selectedIntraDayAccnts',
			hiddenValuePopUpField :'popupIntraDayAcctSelectedFlag',
			savefnCallback :saveItemsFn,
			urlCallback :serviceURLFn
			/*listeners : {
				beforeshow : function(t) {
					var br_grid_Container = objBrFeatureIntradayAccountsPopup.down('container[itemId="gridContainer"]');
					br_grid_Container.maxHeight = 390;
				}
			}*/
		});
		objBrFeatureIntradayAccountsPopup.on('beforeshow' , function(t) {
					var br_grid_Container = objBrFeatureIntradayAccountsPopup.down('container[itemId="gridContainer"]');
					br_grid_Container.maxHeight = 390;
				});
		objBrFeatureIntradayAccountsPopup.show();
	}
	else{
		objBrFeatureIntradayAccountsPopup.lastSelectedWidgets = options;
		objBrFeatureIntradayAccountsPopup.isAllSelected = isBrIntraAcctAllSelected;
		objBrFeatureIntradayAccountsPopup.show();
	}
}

function setSelectedBRIntraAccountItems(records,Derecords,  blnIsUnselected) {

	var intradayCnt = '(' + records.length + ')';
	$("#intradayCnt").text(intradayCnt);
	popupIntraDayAcctSelectedValue = 'Y';
	setDirtyBit();
}

function getSelectBRFeaturePrevAccountsPopup() {
	selectedr = [];
	var optionsSelected = $('#selectedPrevDayAccnts').val();
	if (!Ext.isEmpty(optionsSelected)) {
		var options = optionsSelected.split(",");
		isBrPrevAcctAllSelected = 'N';
	} else {
		var selectFlag = $('#allPrevDayAccntsSelectedFlag').val();

		if (!Ext.isEmpty(selectFlag))
			isBrPrevAcctAllSelected = selectFlag;
		else
			isBrPrevAcctAllSelected = 'N';
	}
	if (!Ext.isEmpty(objBrFeaturePrevdayAccountsPopup)) {
		
	objBrFeaturePrevdayAccountsPopup = Ext.create('Ext.ux.gcp.FilterPopUpView',
		{
			fnCallback : setSelectedBRPrevAccountItems,
			title : getLabel('predeayaccounts','Previous Day Accounts'),
			isAllSelected : isBrPrevAcctAllSelected,
			labelId : 'featureCnt',
			keyNode : 'value',
			itemId : 'brAccountFeaturePopup',
			checkboxId:'chkAllPrevDayAccntsSelectedFlag',
			displayCount:true,
			profileId :adminFeatureProfileId,
			featureType:'PA',
			responseNode :'filter',
			cfgModel : {
				 pageSize : 5,
				storeModel : {
					fields : ['name', 'value','isAssigned','readOnly'],
			proxyUrl : 'cpon/clientServiceSetup/brAccountsData',
			rootNode : 'd.filter',
			totalRowsNode : 'd.count'
				  },
			columnModel : [{
								colDesc : getLabel('predeayaccounts','Previous Day Accounts'),
								colId : 'name',
								colHeader : getLabel('lblAcctNumber', 'Account'),
								width : 330
							}]
			   },
			
			cfgFilterLabel:getLabel('predeayaccounts','Previous Day Accounts'),
			 cfgAutoCompleterUrl:'brAccountsData',
				cfgUrl:'cpon/clientServiceSetup/{0}',
				paramName:'filterName',
				dataNode:'name',
				rootNode : 'd.filter',
				autoCompleterExtraParam:
					[{
						key:'featureType',value:'PA'
					},{
						key:'module',value: '01'
					},{
						key:'profileId',value: adminFeatureProfileId
					},{
						key:'id',value: encodeURIComponent(parentkey)
					}],
			module : '01',
					userMode: viewmode,
			hiddenValueField : 'selectedPrevDayAccnts',
			hiddenValuePopUpField :'popupPrevDayAcctSelectedFlag',
			savefnCallback :saveItemsFn,
			urlCallback :serviceURLFn
		});
		objBrFeaturePrevdayAccountsPopup.show();
	}
	else{
		objBrFeaturePrevdayAccountsPopup.lastSelectedWidgets = options;
		objBrFeaturePrevdayAccountsPopup.isAllSelected = isBrPrevAcctAllSelected;
		objBrFeaturePrevdayAccountsPopup.show();
	}
}

function setSelectedBRPrevAccountItems(records,Derecords,  blnIsUnselected) {

	var intradayCnt = '(' + records.length + ')';
	$("#previousdayCnt").text(intradayCnt);
	popupPrevDayAcctSelectedValue = 'Y';
	setDirtyBit();
}

function getSelectBRFeatureAccountsPopup() {
	selectedr = [];
	var optionsSelected = $('#selectedAccounts').val();
	if (!Ext.isEmpty(optionsSelected)) {
		var options = optionsSelected.split(",");
		isBrAcctAllSelected = 'N';
	} else {
		var selectFlag = $('#allBRAccntsSelectedFlag').val();

		if (!Ext.isEmpty(selectFlag))
			isBrAcctAllSelected = selectFlag;
		else
			isBrAcctAllSelected = 'N';
	}
	if (!Ext.isEmpty(objBrFeatureAccountsPopup)) {
	objBrFeatureAccountsPopup = Ext.create('Ext.ux.gcp.FilterPopUpView',
		{
			fnCallback : setSelectedBRAccountItems,
			lastSelectedRecords : '',
			title : getLabel('braccounts', 'BR Accounts'),
			columnName : getLabel('accountNmbr', 'Account'),
			isAllSelected : isBrAcctAllSelected,
			labelId : 'featureCnt',
			lastSelectedWidgets : options,
			keyNode : 'value',
			itemId : 'brAccountFeaturePopup',
			checkboxId:'chkAllBRAccntsSelectedFlag',
			displayCount:true,
			profileId :adminFeatureProfileId,
			featureType:'BA',
			responseNode :'filter',
			cfgModel : {
				 pageSize : 5,
				storeModel : {
					fields : ['name', 'value','isAssigned','readOnly'],
			proxyUrl : 'cpon/clientServiceSetup/brAccountsData',
			rootNode : 'd.filter',
			totalRowsNode : 'd.count'
				  },
			columnModel : [{
								colDesc : getLabel('brfeatureaccounts', 'BR Feature Accounts'),
								colId : 'name',
								colHeader : getLabel('accountNmbr', 'Account'),
								width : 330
							}]
			   },
			
			cfgFilterLabel:'Accounts',
			 cfgAutoCompleterUrl:'brAccountsData',
				cfgUrl:'cpon/clientServiceSetup/{0}',
				paramName:'filterName',
				dataNode:'name',
				rootNode : 'd.filter',
				autoCompleterExtraParam:
					[{
						key:'featureType',value:'BA'
					},{
						key:'module',value: '01'
					},{
						key:'profileId',value: adminFeatureProfileId
					},{
						key:'id',value: encodeURIComponent(parentkey)
					}],
			module : '01',
					userMode: viewmode,
			hiddenValueField : 'selectedBrFeatures',
			hiddenValuePopUpField :'popupBrFeaturesSelectedFlag',
			savefnCallback :saveItemsFn,
			urlCallback :serviceURLFn
			/*listeners : {
				resize : function(){
					this.center();
				}
			}*/
		});
		objBrFeatureAccountsPopup.show();
	}
	else{
		objBrFeatureAccountsPopup.lastSelectedWidgets = options;
		objBrFeatureAccountsPopup.isAllSelected = isBrAcctAllSelected;
		objBrFeatureAccountsPopup.show();
	}
}

function setSelectedBRAccountItems(records, Derecords, blnIsUnselected) {

	var intradayCnt = '(' + records.length + ')';
	$("#brAccntCnt").text(intradayCnt);

	popupAcctSelectedValue = 'Y';
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

function showInterfacesProfileFilterPopup(service, dropdownId) {
	if (null != objInterfaceProfileFilterPopup) {
		objInterfaceProfileFilterPopup.setService(service);
		objInterfaceProfileFilterPopup.setDropdownId(dropdownId);
		objInterfaceProfileFilterPopup.setDropdownType('I');
		objInterfaceProfileFilterPopup.show();
	}
}

function showBillingProfileFilterPopup(service, dropdownId) {
	if (null != objBillingProfileFilterPopup) {
		objBillingProfileFilterPopup.setService(service);
		objBillingProfileFilterPopup.setDropdownId(dropdownId);
		objBillingProfileFilterPopup.setDropdownType('B');
		objBillingProfileFilterPopup.show();
	}
}

function showTypeProfileFilterPopup(service, dropdownId) {
	if (null != objTypeProfileFilterPopup) {
		objTypeProfileFilterPopup.setService(service);
		objTypeProfileFilterPopup.setDropdownId(dropdownId);
		objTypeProfileFilterPopup.setDropdownType('T');
		objTypeProfileFilterPopup.show();
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

function showFxProfileFilterPopup(service, dropdownId) {
	if (null != objFxProfileFilterPopup) {
		objFxProfileFilterPopup.setService(service);
		objFxProfileFilterPopup.setDropdownId(dropdownId);
		objFxProfileFilterPopup.setDropdownType('F');
		objFxProfileFilterPopup.show();
	}
}

function getSelectBrCPCPopup() {
	selectedr = [];
	var optionsSelected = $('#selectedCPC').val();
	if (!Ext.isEmpty(optionsSelected)) {
		var options = optionsSelected.split(",");
		isBrCPCAllSelected = 'N';
	} else {
		var selectFlag = $('#allCPCSelectedFlag').val();
		if (!Ext.isEmpty(selectFlag))
			isBrCPCAllSelected = selectFlag;
		else
			isBrCPCAllSelected = 'N';
	}
	if (Ext.isEmpty(objBrCPCSelectionPopup)) {
		objBrCPCSelectionPopup = Ext.create('Ext.ux.gcp.FilterPopUpView', {
					fnCallback : setSelectedCPCItems,
					title : getLabel('category', 'Category'),
					isAllSelected : isBrCPCAllSelected,
					labelId : 'CPCCnt',
					keyNode : 'value',
					itemId : 'brCPCSelectionPopup',
					checkboxId : 'chkAllCPCSelectedFlag',
					displayCount : true,
					profileId : adminFeatureProfileId,
					featureType : 'T',
					responseNode : 'filter',
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
							fields : ['name', 'value', 'isAssigned', 'readOnly'],
							proxyUrl : 'cpon/clientServiceSetup/cponFeatures',
							rootNode : 'd.filter',
							totalRowsNode : 'd.count'
						},
						columnModel : [{
									colDesc : getLabel('typeCodeCategory', 'Type Code Category'),
									colId : 'name',
									colHeader : getLabel('typeCodeCategory', 'Type Code Category'),
									sortable : false,
									width : 330
								}]
					},
					autoCompleterEmptyText : getLabel('lbl.serachbytypeCode','Search by Type Code Category'),
					cfgAutoCompleterUrl : 'cponFeatures',
					cfgUrl : 'cpon/clientServiceSetup/{0}',
					paramName : 'filterName',
					dataNode : 'name',
					rootNode : 'd.filter',
					autoCompleterExtraParam : [{
								key : 'featureType',
								value : 'T'
							}, {
								key : 'module',
								value : '01'
							}, {
								key : 'profileId',
								value : adminFeatureProfileId
							}, {
								key : 'id',
								value : encodeURIComponent(parentkey)
							}],
					module : '01',
					userMode : viewmode,
					hiddenValueField : 'selectedCPC',
					hiddenValuePopUpField : 'popupCPCSelectedFlag',
					savefnCallback : saveItemsFn,
					urlCallback : serviceURLFn
					
				});
				objBrCPCSelectionPopup.on('beforeshow' , function(t) {
					var grid_Container = objBrCPCSelectionPopup.down('container[itemId="gridContainer"]');
					grid_Container.maxHeight = 390;
				});
				objBrCPCSelectionPopup.on('afterrender' , function(t) {
					var filterContainer = objBrCPCSelectionPopup.down('container[itemId="filterContainer"] AutoCompleter');
			    	filterContainer.focus();
				});
		objBrCPCSelectionPopup.show();
	} else {
		objBrCPCSelectionPopup.lastselectedCPC = options;
		objBrCPCSelectionPopup.isAllSelected = isBrCPCAllSelected;
		objBrCPCSelectionPopup.show();
		var searchField = objBrCPCSelectionPopup.down('container[itemId="filterContainer"] AutoCompleter');
		if(searchField!="" && searchField!=undefined)
			searchField.setValue('');
		var clearlink = objBrCPCSelectionPopup.down('component[itemId="clearLink"]');
		clearlink.hide();
	}
	objBrCPCSelectionPopup.center();
	var filterContainer = objBrCPCSelectionPopup.down('container[itemId="filterContainer"] AutoCompleter');
	 filterContainer.focus();
}
function setSelectedCPCItems(records,Derecords,  blnIsUnselected) {
	var temp= lastCPCValCnt;
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
	var CPCCount = '(' + temp + ')';
	$("#CPCCnt").text(CPCCount);
	popupCPCSelectedValue = 'Y';
	setDirtyBit();
}