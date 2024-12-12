var objDefApprovalMatrixGrid = null;
var templateApprovalMatrixData = [];
var currentRowIndex = null, totalLevels = 0;
var selectedUser = new Array();

function defApprovalMatrixClick(payType) {
	var me = this;
	var strPostfix = '';
	if(payType === 'B')
		strPostfix = 'Hdr';

	if ($("#defineApprovalMatrix"+strPostfix).prop('checked') == true) {
		defineAVMGrid('edit', payType);
	} else if ($("#defineApprovalMatrix"+strPostfix).prop('checked') == false) {
		openCancelConfirmPopup("#defineApprovalMatrix"+strPostfix, payType);
	}
}

function defineAVMGrid(mode, payType){
	fetchTemplateApprovalMatrixData(payType);
	createAVMGrid(mode);
}

function fetchTemplateApprovalMatrixData(payType){
	if(payType === 'B'){
		if(!Ext.isEmpty(paymentResponseHeaderData)
			&& !Ext.isEmpty(paymentResponseHeaderData.d)
			&& !Ext.isEmpty(paymentResponseHeaderData.d.paymentEntry)
			&& !Ext.isEmpty(paymentResponseHeaderData.d.paymentEntry.templateApprovalMatrix)){
				templateApprovalMatrixData = JSON.parse(JSON.stringify(paymentResponseHeaderData.d.paymentEntry.templateApprovalMatrix));
			}
	} else if(payType === 'Q'){
		if(!Ext.isEmpty(paymentResponseInstrumentData)
			&& !Ext.isEmpty(paymentResponseInstrumentData.d)
			&& !Ext.isEmpty(paymentResponseInstrumentData.d.paymentEntry)
			&& !Ext.isEmpty(paymentResponseInstrumentData.d.paymentEntry.templateApprovalMatrix)){
				templateApprovalMatrixData = JSON.parse(JSON.stringify(paymentResponseInstrumentData.d.paymentEntry.templateApprovalMatrix));
			}
	}
}

function getColumns(mode) {
	var me = this;
	var arrCols = new Array(), objCol = null, cfgCol = null;
	var objWidthMap =
	{
		"limitFrom" : 120,
		"limitTo" : 200,
		"level" : 120,
		"approvers" : 250,
		"users" : 650	
			
	};
	var arrColsPref = [{
			"colId" : "limitFrom",
			"colDesc" : getLabel('limitFrom', 'Limit From'),
			"colType" : "number",
			"sortable" : false,
			"menuDisabled": false
		}, {
			"colId" : "limitTo",
			"colDesc" : getLabel('limitTo', 'Limit To'),
			"colType" : "number",
			"sortable" : false,
			"menuDisabled": false
		}, {
			"colId" : "level",
			"colDesc" : getLabel('numOfLevels', 'Level'),
			"colType" : "number",
			"sortable" : false,
			"menuDisabled": false
		}, {
			"colId" : "approvers",
			"colDesc" :getLabel('numOfApprovers', 'Number of Approvers'),
			"colType" : "number",
			"sortable" : false,
			"menuDisabled": false
		},{
			"colId" : "users",
			"colDesc" :getLabel('users', 'Users'),
			"sortable" : false,
			"menuDisabled": false
		}];
		if(mode === 'edit')
			arrCols.push(createActionColumn());
		if (!Ext.isEmpty(arrColsPref)) {
			for ( var i = 0; i < arrColsPref.length; i++) {
				objCol = arrColsPref[i];
				cfgCol = {};
				cfgCol.colHeader = objCol.colDesc;
				cfgCol.colId = objCol.colId;
				cfgCol.sortable = objCol.sortable;
				cfgCol.menuDisabled = objCol.menuDisabled;
				if (!Ext.isEmpty(objCol.colType)) {
					cfgCol.colType = objCol.colType;
					if (cfgCol.colType === "number")
						cfgCol.align = 'right';
				}

				cfgCol.width = objWidthMap[objCol.colId];
				cfgCol.fnColumnRenderer = me.columnRendererForAVMGrid;
				arrCols.push(cfgCol);

			}
		}
	return arrCols;
}

function createAVMGrid(mode){
	var me = this;
	
	if (!Ext.isEmpty(objDefApprovalMatrixGrid))
		Ext.destroy(objDefApprovalMatrixGrid);
			
	$('#templateApprovalDefGrid').empty();
	var colModel = null;
	colModel = getColumns(mode);
	Ext.application({
			name : 'GCP',
			launch : function() {
				objDefApprovalMatrixGrid = Ext.create(
					'Ext.ux.gcp.SmartGrid', {
						stateful : false,
						showEmptyRow : false,
						showCheckBoxColumn : false,
						hideRowNumbererColumn : true,
						cls: "t7-grid",
						height : 200,
						showPager : false,
						columnModel : colModel,
						enableColumnHeaderMenu : false,
						enableColumnDrag : false,
						fnRowIconVisibilityHandler : me.isRowIconVisible,
						handleMoreMenuItemClick : function(view, rowIndex, cellIndex, menu,
								eventObj, record) {
							// TO-DO	
						},
						storeModel : {
							fields : [ 'tier','limitFrom', 'limitTo', 'level',
									'approvers', 'users','usersCode','__rightsMap'],
							rootNode : 'templateApprovalMatrix'
						},
						listeners : {
							afterrender : function(grid) {
									me.handleLoadGridData(grid,
											grid.store.dataUrl, grid.pageSize,
											1, 1, null);
								}
						},
						checkBoxColumnRenderer : function(value, metaData,
								record, rowIndex, colIndex, store, view) {

						},
						isRowIconVisible : me.isRowIconVisible
			});
			
			var layout = Ext.create('Ext.container.Container', {
					width : 'auto',
					items : [objDefApprovalMatrixGrid],
					renderTo : mode === 'edit' ? 'templateApprovalDefGrid' : 'templateApprovalDefGridVerify'
			});
		}
	});
}
function createActionColumn() {
	var me = this;
	var objActionCol =
		{
			colType : 'actioncontent',
			colId : 'actioncontent',
			colHeader : getLabel('actions', 'Actions'),
			visibleRowActionCount : 1,
			width : 108,
			locked : true,
			lockable : false,
			sortable : false,
			hideable : false,
			resizable : false,
			draggable : false,
			items :
			[
			 	{
					itemId : 'btnEdit',
					itemCls : 'grid-row-action-icon',
					toolTip : getLabel('editToolTip', 'Modify Record'),
					text : getLabel('editToolTip', 'Modify Record'),
					maskPosition : 1,
					fnClickHandler : function(tableView, rowIndex,
						columnIndex, btn, event, record) {
						actionClickHandler(tableView, rowIndex, columnIndex, btn,
						event, record);
					}
			 	},
			 	{
					itemId : 'btnAddLevel',
					itemCls : 'grid-row-action-icon',
					toolTip : getLabel('addLevelToolTip', 'Add Level'),
					text : getLabel('addLevelToolTip', 'Add Level'),
					maskPosition : 3,
					fnClickHandler : function(tableView, rowIndex,
						columnIndex, btn, event, record) {
						actionClickHandler(tableView, rowIndex, columnIndex, btn,
						event, record);
					}
			 	},
			 	{
					itemId : 'btnAddTier',
					itemCls : 'grid-row-action-icon',
					toolTip : getLabel('addTierToolTip', 'Add Tier'),
					text : getLabel('addTierToolTip', 'Add Tier'),
					maskPosition : 2,
					fnClickHandler : function(tableView, rowIndex,
						columnIndex, btn, event, record) {
						actionClickHandler(tableView, rowIndex, columnIndex, btn,
						event, record);
					}
			 	},
			 	{
					itemId : 'btnDeleteTier',
					itemCls : 'grid-row-action-icon',
					toolTip : getLabel('deleteTierToolTip', 'Delete Tier'),
					text : getLabel('deleteTierToolTip', 'Delete Tier'),
					maskPosition : 4,
					fnClickHandler : function(tableView, rowIndex,
						columnIndex, btn, event, record) {
						actionClickHandler(tableView, rowIndex, columnIndex, btn,
						event, record);
					}
			 	},
			 	{
					itemId : 'btnDeleteLevel',
					itemCls : 'grid-row-action-icon',
					toolTip : getLabel('deleteLevelToolTip', 'Delete Level'),
					text : getLabel('deleteLevelToolTip', 'Delete Level'),
					maskPosition : 5,
					fnClickHandler : function(tableView, rowIndex,
						columnIndex, btn, event, record) {
						actionClickHandler(tableView, rowIndex, columnIndex, btn,
						event, record);
					}
			 	}
			 	
			 ]
		};
	return objActionCol;
}

function handleLoadGridData(grid, url, pgSize, newPgNo,oldPgNo, sorter){
	var me = this;
	var formatUserData = null;
	var objOfGridStore = {},nextLevel=null,nextTier=null;
	if(!Ext.isEmpty(templateApprovalMatrixData)){
		formatUserData =templateApprovalMatrixData; 
		
		Ext.each(formatUserData, function(items, index) {
			var strValue ='' ,strUsers = ''; strUsersCode='';
			strValue = items.users;
			if(Ext.isArray(strValue) && strValue.length > 0){
				Ext.each(strValue, function(item, index) {
					strUsers += item.description;
					strUsersCode += item.code;
					 if (index < strValue.length - 1) {
							 strUsers += ",";
							 strUsersCode += ",";
						 }
				});
			items.users  = strUsers;
			items.usersCode = strUsersCode;
			}
		});
		
		objOfGridStore["templateApprovalMatrix"] = formatUserData;
		if (objOfGridStore && grid) {
			grid.store.loadRawData(objOfGridStore, false);
		}
		generateRightsMap(grid);
	}
	else{
		// Do not load the grid
	}
}

function columnRendererForAVMGrid(value, meta, record, rowIndex,colIndex, store, view, colId) {
	var strValue = value;
	var strUsers = '';
	
	if(colId === 'col_users'){
		if(Ext.isArray(strValue) && strValue.length > 0){
			Ext.each(strValue, function(item, index) {
				strUsers += item.description;
				 if (index < strValue.length - 1) {
						 strUsers += ", ";
					 }
			});
			strValue = strUsers;
		}
	}
	if("col_limitTo" === colId || "col_limitFrom" === colId){
		var obj = $('<input type="text">');
		obj.autoNumeric('init');
		obj.autoNumeric('set',value);
		strValue = obj.val();
		obj.remove();
	}
	if(!Ext.isEmpty(strValue)) {
		meta.tdAttr = 'title="' + strValue + '"';
	}
	return strValue;
}

function handleGridRowClick(record, grid, columnType) {
	if(columnType !== 'actioncontent' && columnType !== 'checkboxColumn') {
		var me = this;
		var columnModel = null;
		var columnAction = null;
		if (!Ext.isEmpty(grid.columnModel)) {
			columnModel = grid.columnModel;
			for (var index = 0; index < columnModel.length; index++) {
				if (columnModel[index].colId == 'actioncontent') {
					columnAction = columnModel[index].items;
					break;
				}
			}
		}
		var arrVisibleActions = [];
		var arrAvailableActions = [];
		if (!Ext.isEmpty(columnAction))
			arrAvailableActions = columnAction;
		var store = grid.getStore();
		var jsonData = store.proxy.reader.jsonData;
		if (!Ext.isEmpty(arrAvailableActions)) {
			for (var count = 0; count < arrAvailableActions.length; count++) {
				var btnIsEnabled = false;
				if (!Ext.isEmpty(grid) && !Ext.isEmpty(grid.isRowIconVisible)) {
					btnIsEnabled = grid.isRowIconVisible(store, record,
							jsonData, arrAvailableActions[count].itemId,
							arrAvailableActions[count].maskPosition);
					if (btnIsEnabled == true) {
						arrVisibleActions.push(arrAvailableActions[count]);
						btnIsEnabled = false;
					}
				}
			}
		}
		if (!Ext.isEmpty(arrVisibleActions)) {
			me.doHandleRowActions(arrVisibleActions[0].itemId, grid, record);
		}
	} else {
	}
}

function enableEntryButtons() {
	slabGridLoaded = true;
	//disableGridButtons(false);
}

function openCancelConfirmPopup(checkboxElement, payType){
	var _objDialog = $('#discardAVMConfirmationPopup');
	_objDialog.dialog({
				bgiframe : true,
				autoOpen : false,
				modal : true,
				resizable : false,
				width : "320px",
				id:'discardAVMConfirmationPopupBtn',
				
				buttons : [{				
					text:getLabel('btnOk','Ok'),
					id:   "btnOk",
					tabindex :'1',
					blur : function()
					{ 
						$("#btnCancel").focus();
					},
					click:function(){
						$(this).dialog("close");
						if (!Ext.isEmpty(objDefApprovalMatrixGrid)){
							Ext.destroy(objDefApprovalMatrixGrid);
							templateApprovalMatrixData = null;
							resetPaymentResponseForNewGrid(payType);
						}
					}						
				},{
					text:getLabel('btncancel','Cancel'),
					id:   "btnCancel",
					tabindex :'1',
					blur : function()
					{ 
						$("#btnOk").focus();
					},
					click:function() {						
					$(checkboxElement).prop('checked', true);
						$(this).dialog('destroy');
					}
				}]
			});
	_objDialog.dialog('open');
	_objDialog.dialog('option', 'position', 'center');	

}

function actionClickHandler(tableView, rowIndex, columnIndex, btn, event, record){
	var actionName = btn.itemId;
	if(actionName == 'btnEdit')
		editTier(tableView, rowIndex, columnIndex, btn, event, record);
	else if(actionName == 'btnAddLevel')
		addLevel(tableView, rowIndex, columnIndex, btn, event, record);
	else if(actionName == 'btnAddTier')
		addTier(tableView, rowIndex, columnIndex, btn, event, record);
	else if(actionName == 'btnDeleteTier')
		deleteTier(tableView, rowIndex, columnIndex, btn, event, record);
	else if(actionName == 'btnDeleteLevel')
		deleteLevel(tableView, rowIndex, columnIndex, btn, event, record);
}

function editTier(grid, rowIndex, columnIndex, btn, event, record){
	showAVMDialog(grid, rowIndex, columnIndex, btn, event, record);
}

function addLevel(grid, rowIndex, columnIndex, btn, event, record){
	var store = grid.store;
	var tempRecord = {
		"limitFrom" : record.data.limitFrom,
		"limitTo" : record.data.limitTo,
		"level" : record.data.level + 1,
		"tier" : record.data.tier,
		"approvers" : 1
	};
	$("#axsUser").empty();
	store.insert(rowIndex + 1, tempRecord)
	generateRightsMap(grid);
	grid.refresh();
}

function addTier(grid, rowIndex, columnIndex, btn, event, record) {
	var store = grid.store;
	var limitFromAmount = null;
	var decimalString = '';
	decimalString = createDecimalString();
	if(record && record.data && record.data.limitTo)
	{
		// parseFloat() give data upto 12 decimals when we are adding numbers like 30.98 + 0.01 etc
		// to fix these issues we need to use toFixed() function
		limitFromAmount = (parseFloat(record.data.limitTo) + parseFloat(decimalString)).toFixed(strAmountMinFraction);		
	var tempRecord = {
			"limitFrom" : limitFromAmount ,
		"limitTo" : null,
		"level" : 1,
		"tier" : record.data.tier + 1,
		"approvers" : 1
	};
	$("#axsUser").empty();
	store.insert(rowIndex + 1, tempRecord)
	generateRightsMap(grid);
	grid.refresh();
}
}

function deleteTier(grid, rowIndex, columnIndex, btn, event, record) {
	var store = grid.store;
	var arrStore = grid.store.data.items;
	var currentTierNumber = record.data.tier;
	var startPos = null;
	var counter = 0;
	for (var i = 0; i < arrStore.length; i++) {
		if (arrStore[i].data.tier === currentTierNumber) {
			if (startPos == null)
				startPos = i;
			counter++;
		}
	}
	var _objDialog = $('#discardTierConfirmationPopup');
    _objDialog.dialog({
           bgiframe : true,
           autoOpen : false,
           modal : true,
           resizable : false,
           width : "320px",
           buttons :[
   			{
   				text:getLabel('btnOk','Ok'),
   				click : function() {
   					if (!Ext.isEmpty(startPos) && counter > 0) {
   	                    store.removeAt(startPos, counter);
   	             }
   	             generateRightsMap(grid);
   	             grid.refresh();
   	             $(this).dialog("close");
   				}
   			},
   			{
   				text:getLabel('btncancel','Cancel'),
   				click : function() {
   					 $(this).dialog('destroy');
   				}
   			}
   			]
     });
   _objDialog.dialog('open');
   _objDialog.dialog('option', 'position', 'center');

}

function deleteLevel(grid, rowIndex, columnIndex, btn, event, record) {
	var store = grid.store;
	var currentTierData = store.getAt(rowIndex);
	// Get the data of next node from store
	var nextTierData = store.getAt(rowIndex + 1);
	if (!Ext.isEmpty(nextTierData) && !Ext.isEmpty(nextTierData.data)
			&& !Ext.isEmpty(nextTierData.data.level)
			&& !Ext.isEmpty(nextTierData.data.tier)) {
		if (currentTierData.data.tier === nextTierData.data.tier) { // i.e. same
																	// tier
			if (currentTierData.data.level < nextTierData.data.level) {
				// Do not remove tier/level, throw message
			} else {
				// Remove tier/level
				store.removeAt(rowIndex);
			}
		} else { // i.e. next tier is different
			// so remove tier/level
			store.removeAt(rowIndex);
		}
	} else {
		// Its a last tier, remove it
		store.removeAt(rowIndex);
	}
	generateRightsMap(grid);
	grid.refresh();
}

function isRowIconVisible(store, record, jsonData, itmId, maskPosition) {
	var maskSize = 5;
	var maskArray = new Array();
	var actionMask = '';
	var rightsMap = record.data.__rightsMap;
	var buttonMask = '11111';
	var retValue = true;
	var bitPosition = '';

	if (!Ext.isEmpty(maskPosition)) {
		bitPosition = parseInt(maskPosition,10) - 1;
		maskSize = maskSize;
	}
	maskArray.push(buttonMask);
	maskArray.push(rightsMap);

	actionMask = doAndOperation(maskArray, maskSize);
	if (Ext.isEmpty(bitPosition))
		return retValue;
	retValue = isActionEnabled(actionMask, bitPosition);
	return retValue;
}

function generateRightsMap(grid) {
	var arrStore = grid.store.data.items;
	var lastTier = getLastTier(grid);
	for (i = 0; i < arrStore.length; i++) {
		currentTier = arrStore[i].data.tier;
		currentLevel = arrStore[i].data.level;
		if (arrStore[i + 1] && arrStore[i + 1].data) {
			nextTier = arrStore[i + 1].data.tier;
			nextLevel = arrStore[i + 1].data.level;
		}
		if (arrStore.length === 1) {
			if(arrStore[i].data.limitTo > 0)
				arrStore[i].data.__rightsMap = '11100';
			else
				arrStore[i].data.__rightsMap = '10000';
		} else if (i == arrStore.length - 1) {
			if((currentLevel === nextLevel) && currentTier > 1 && currentLevel ===1){
				if(arrStore[i].data.limitTo > 0)
					arrStore[i].data.__rightsMap = '11110';
				else
					arrStore[i].data.__rightsMap = '10010';
			}else
				arrStore[i].data.__rightsMap = '11101';
		} else if (currentTier === nextTier) {
			if (currentLevel < nextLevel) {
				arrStore[i].data.__rightsMap = '10000';
			} else
				arrStore[i].data.__rightsMap = '10001';
			if ((currentLevel < nextLevel) 
					&& currentTier > 1
					&& currentLevel === 1
					&& currentTier === lastTier)
				arrStore[i].data.__rightsMap = '10010';
		} else if (currentTier != nextTier) {
			if(currentLevel === 1){
				arrStore[i].data.__rightsMap = '10100';
			}else if (currentTier < nextTier) {
				arrStore[i].data.__rightsMap = '10101';
			}
		} else if (currentLevel < nextLevel) {
			arrStore[i].data.__rightsMap = '10101';
		}
	}
}

function showAVMDialog(grid, rowIndex, columnIndex, btn, event, record){
	doClearUserAVMPopupMessageSection();
	$("#axmFromDtl,#axmToDtl").val('');
	$('#avmDetailPopup').dialog({
		autoOpen : false,
		//height : 440,
		width : 780,
		modal : true,
		maxHeight : 550,
		resizable : false,
		draggable : false,
		open:function(event, ui){
			$('#axmFromDtl , #axmToDtl').autoNumeric("init",
					{
							aSep: strGroupSeparator,
							dGroup: strAmountDigitGroup,
							aDec: strDecimalSeparator,
							mDec: strAmountMinFraction
					});
			
			if(!Ext.isEmpty(record.get('limitFrom')))
				$('#axmFromDtl').autoNumeric('set',record.get('limitFrom'));
			
			if(!Ext.isEmpty(record.get('limitTo')))
				$('#axmToDtl').autoNumeric('set',record.get('limitTo'));
			
			if(!Ext.isEmpty(record.get('level')))
				$("#totalLevelsDtl").val(record.get('level'));
			

			if(!Ext.isEmpty(record.get('approvers')))
				$("#axsMinreqDtl").val(record.get('approvers'));
			
			$("#axsMinreqDtl").OnlyNumbers();
			initializeTransferSelect();
			initializeSaveNextPre(grid, rowIndex, columnIndex, btn, event, record);
      		handleUserPopulation(grid,record);
      		setAVMPopupGlobalLevels(grid, rowIndex, columnIndex, btn, event, record);
      		handleBtnVisibility(record.get('level'));
      		if(((record.get('level') === 1) || isEmpty(record.get('limitTo'))))
				$("#axmToDtl").removeAttr('disabled');
			else
				$("#axmToDtl").attr('disabled','disabled');
			$("#minReqLabel").text(' ');
			$("#minReqLabel").append(getLabel('numberOfApproversInLevel','Number of Approvers in Level')+' '+ record.get('level'));
			$('#avmDetailPopup').dialog('option','position','center');
			autoFocusOnFirstElement(null,'avmDetailPopup',true);
      }
	});
	
	$("#avmDetailPopup").dialog({
				close : function(event, ui) {
					$("#avmDetailPopup").dialog("destroy");
					//slabGridListView.refreshData();
				}
			});
	
	$('#avmDetailPopup').dialog("open");
}

function initializeSaveNextPre(grid, rowIndex, columnIndex, btn, event, record){
	$('#btnSave,#btnSaveAndNext,#btnSaveAndPrev')
	.unbind('click');
	
	$('#btnSave').bind('click',{ grid: grid, rowIndex:rowIndex,record:record }, function(event) {
		var data = event.data;
		if (!isEmpty(currentRowIndex)) {
			var currentRecord = grid.store.data.getAt(currentRowIndex);
			handleSaveApprovalUsersToGird(data.grid,currentRowIndex,currentRecord, 'saveBtn');
			generateRightsMap(grid);
			grid.refresh();
		}
	});
	$('#btnSaveAndNext').bind('click',{ grid: grid, rowIndex:rowIndex,record:record }, function(event) {
		var data = event.data;
		var currentRecord = grid.store.data.getAt(currentRowIndex);
		var currentLevel = currentRecord.data.level;
		if (currentLevel < totalLevels) {
			//currentRowIndex++;
			handleSaveApprovalUsersToGird(data.grid,currentRowIndex-1,currentRecord, 'nextBtn');
		}
	});
	$('#btnSaveAndPrev').bind('click',{ grid: grid, rowIndex:rowIndex,record:record }, function(event) {
		var data = event.data;
		if (currentRowIndex > 0) {
			//currentRowIndex--;
			var currentRecord = grid.store.data.getAt(currentRowIndex);
			handleSaveApprovalUsersToGird(data.grid,currentRowIndex,currentRecord, 'prevBtn');
		}
	});
}

function handleCancelUserPopup(){
	$('#avmDetailPopup').dialog("close");
}

function handleBtnVisibility(currLvl){	
	if(currLvl === 1 && totalLevels > 1){
		$("#btnSaveAndNext").removeClass('button-grey-effect');
		$("#btnSaveAndPrev").addClass('button-grey-effect');
	} else if(currentRowIndex === 0){
		$("#btnSaveAndNext").addClass('button-grey-effect');
		$("#btnSaveAndPrev").addClass('button-grey-effect');
	}else if(currLvl === totalLevels && totalLevels>1){
		$("#btnSaveAndNext").addClass('button-grey-effect');
		$("#btnSaveAndPrev").removeClass('button-grey-effect');
	} else if(currLvl < totalLevels){
		$("#btnSaveAndNext").removeClass('button-grey-effect');
		$("#btnSaveAndPrev").removeClass('button-grey-effect');
	}else if(totalLevels === 1){
		$("#btnSaveAndNext").addClass('button-grey-effect');
		$("#btnSaveAndPrev").addClass('button-grey-effect');
	}
}

function handleUserPopulation(grid,record){
	var numOfLevel,strUrl;
	var apprUsers = [];
	var userCodes = [];
	var userDesc = [];
	copySelectedUsers(record);
	
	
	if( undefined != record.get('usersCode') &&  record.get('usersCode') != ''
		&& !Ext.isEmpty(record.get('usersCode')))
	{
		var select = $("#axsUser");
		document.getElementById('axsUser').options.length = 0;
		userCodes = record.get('usersCode');
		userDesc = record.get('users');
		var strUser = userCodes.split(",");
		var strUserDesc = userDesc.split(",");
		for (var i = 0; i < strUser.length; i++) {
			var text = userDesc[i];
			if (strUser[i] != null) {
				var opt = $('<option />', {
					value: strUser[i],
					text: strUser[i] +"/"+strUserDesc[i],
					description : strUserDesc[i]
				});
				opt.appendTo(select);
			}
		}
	}else {
		$("#axsUser").empty();
	}
	
	numOfLevel= record.get('level');
	strUrl = 'services/templateusers/' + numOfLevel;
	
	$.ajax({
		url : strUrl,
		type:"POST",
		//dataType : "json",
		success : function(data) {
			$("#addUser").empty();
			var select = $("#addUser");
			
			if (null != data && data.length != 0) {
				$.each(data, function(key, value) {
					var opt = $('<option />', {
						value: key,
						text: key +"/"+value,
						description : value
					});
					opt.appendTo(select);
				});
			}
			removeSelectedUsers();
		},
		complete: function(data){
	       if(!Ext.isEmpty(record.get('users')) && !Ext.isEmpty(record.get('usersCode')))
  				populateSelectedUsers(record.get('users'),record.get('usersCode'));
        }
	});
}

function copySelectedUsers(record) {
	var gridStore,objGridData;
	selectedUser = [];
	if(!isEmpty(objDefApprovalMatrixGrid)){
		gridStore = objDefApprovalMatrixGrid.getStore(); 
		if(!isEmpty(gridStore))
			objGridData =gridStore.data.items; 
		
		if(!isEmpty(objGridData))
		{
			$.each(objGridData, function(index, cfg) {
				var data = cfg.data;
				// copy all selected user, under current tier records.[for all level under this tier]
				if(data.tier == record.get('tier') )
				{
					pushUserCodeIntoList(data.usersCode);
				}
			});
			
		}
	}	
}

function pushUserCodeIntoList(userCodes){
	var temp = new Array();
	temp = userCodes.split(",");
	
	for (var i = 0; i < temp.length; i++) {
		if(!Ext.isEmpty(temp[i])){
			selectedUser.push(temp[i]);
		}
	}
}
function removeSelectedUsers() {
	var selectedCount = selectedUser.length;
	for (var i = 0; i < selectedCount; i++) {
		for (var j = 0; j < $("#addUser option").length; j++) {
			if (selectedUser[i] === document
					.getElementById('addUser').options[j].value) {
				document.getElementById('addUser').remove(j);
				break;
			}
		}
	}
}

function populateSelectedUsers(users,code){
	var arrUserCodes = Ext.isEmpty(code) ? '' : code.split(',');
	$('#addUser').val(arrUserCodes);
	$('#addUser option:selected').remove().appendTo('#axsUser');
	$('#axsUser option').prop('selected', false);
}

function initializeTransferSelect() {
	$('#btnMoveAllToRight,#btnMoveToRight,#btnMoveAllToLeft,#btnMoveToLeft')
			.unbind('click');

	$('#btnMoveAllToRight').bind('click', function() {
		$('#addUser option').prop('selected', true);
		$('#addUser option:selected').remove().appendTo('#axsUser');
		$('#axsUser option').prop('selected', false);
	});
	$('#btnMoveToRight').bind('click', function() {
		$('#addUser option:selected').remove().appendTo('#axsUser');
		$('#axsUser option').prop('selected', false);
	});
	$('#btnMoveAllToLeft').bind('click', function() {
		$('#axsUser option').prop('selected', true);
		$('#axsUser option:selected').remove().appendTo('#addUser');
		$('#addUser option').prop('selected', false);
	});
	$('#btnMoveToLeft').bind('click', function() {
		$('#axsUser option:selected').remove().appendTo('#addUser');
		$('#addUser option').prop('selected', false);
	});

}

function handleSaveApprovalUsersToGird(grid,rowIndex,record, calledFrom){
	var valLimitTo,valLimitFrom,valNoOfApp,arrUserDesc=[],strUser,arrUserCode=[],strUserCode,valLimitToNextTier;
	var arrError = [],blnFromAutoNumeric=false,blnToAutoNumeric=false,lengthOfSelectedUser;
	var gridStore;
	
	valLimitFrom = $("#axmFromDtl").val();
	blnFromAutoNumeric = isAutoNumericApplied('axmFromDtl');
	if (blnFromAutoNumeric)
		valLimitFrom = $('#axmFromDtl').autoNumeric('get');
	
	valLimitTo = $("#axmToDtl").val();
	blnToAutoNumeric = isAutoNumericApplied('axmToDtl');
	if (blnToAutoNumeric)
		valLimitTo = $('#axmToDtl').autoNumeric('get');
	
	valNoOfApp = $("#axsMinreqDtl").val();
	
	lengthOfSelectedUser = $("#axsUser option").length;
	
	if(lengthOfSelectedUser < valNoOfApp){
		arrError.push({
			"errorCode" : "EXS-013",
			"errorMessage" :  getLabel("approvalMatrixEXS-013","No. of selected users for approval level in tier is less than no. of approvers defined.")
		});
		paintUserAVMPopupErrors(arrError);
	}
	if(Ext.isEmpty(valNoOfApp)|| parseFloat(valNoOfApp)< 1){
		arrError.push({
			"errorCode" : "EXS-031",
			"errorMessage" :  getLabel("approvalMatrixEXS-031","No. of Approval Levels in tiers should be greater than zero.")
		});
		paintUserAVMPopupErrors(arrError);
	}
	if(Ext.isEmpty(valLimitTo)){
		arrError.push({
			"errorCode" : "MAND-0001",
			"errorMessage" :  getLabel("approvalMatrixMAND-0001","Limit To is mandatory")
		});
		paintUserAVMPopupErrors(arrError);
	}
	if(parseFloat(valLimitTo) <= parseFloat(valLimitFrom)){
		if(valLimitTo === valLimitFrom){
			arrError.push({
				"errorCode" : "EXS-032",
				"errorMessage" :  getLabel("approvalMatrixEXS-032","Limit To, Limit From should not be same.")
			});
		}
		else{
			arrError.push({
				"errorCode" : "LIMIT-0005",
				"errorMessage" :  getLabel("approvalMatrixLIMIT-0005","Limit To should be greater than Limit From")
			});
		}
		paintUserAVMPopupErrors(arrError);
	}

	if(!isEmpty(grid))
		gridStore = grid.getStore();
	var nextTierData = getNextTierData(grid, record.get('tier'));
	if(!Ext.isEmpty(nextTierData)){
		valLimitToNextTier = nextTierData.limitTo;
		if(parseFloat(valLimitTo) >= parseFloat(valLimitToNextTier)){
			if(valLimitTo === valLimitToNextTier){
				arrError.push({
					"errorCode" : "EXS-033",
					"errorMessage" :  getLabel("approvalMatrixEXS-033","Limit To amount should not be equal to Limit To amount of next tier")
				});
			}
			else{
				arrError.push({
					"errorCode" : "LIMIT-0006",
					"errorMessage" : getLabel("approvalMatrixLIMIT-0006","Limit To amount should be less than Limit To amount of next tier")
				});
			}
			paintUserAVMPopupErrors(arrError);
		}
	}
	if(Ext.isEmpty(arrError)){
		$("#axsUser option").each(function()
		{
			arrUserDesc.push($(this).attr('description'));
			arrUserCode.push($(this).val());
		});
		strUser = arrUserDesc.toString();
		strUserCode = arrUserCode.toString();
		record.set('limitTo',valLimitTo);
		record.set('approvers',valNoOfApp);
		record.set('users',strUser);
		record.set('usersCode',strUserCode);
		record.commit(true);
		
		if(!isEmpty(grid))
			gridStore = grid.getStore(); 
		if(!Ext.isEmpty(gridStore)){
			var objStoreData = gridStore.data.items;
			for (var i = 0; i < objStoreData.length; i++) {
				var objData = objStoreData[i].data;
				if (objData.tier === record.get('tier')) {
					var objCurRec = gridStore.getAt(i);
					objCurRec.set('limitTo',valLimitTo);
					objCurRec.commit(true);
				} else if (objData.tier === (record.get('tier')+1)) {
					decimalString = createDecimalString();
					var valNextLimitFrom = (parseFloat(valLimitTo) + parseFloat(decimalString)).toFixed(strAmountMinFraction);
					var objCurRec = gridStore.getAt(i);
					objCurRec.set('limitFrom',valNextLimitFrom);
					objCurRec.commit(true);
				}
			}
		}
		if(calledFrom === 'saveBtn'){
			$('#avmDetailPopup').dialog("close");
		}
		else if(calledFrom === 'nextBtn' && Ext.isEmpty(arrError)){
			currentRowIndex++;
			handleSaveAndNextApprovalUsersToGird(grid,currentRowIndex);
		}
		else if (calledFrom === 'prevBtn' && Ext.isEmpty(arrError)){
			currentRowIndex--;
			handleSaveAndPrevApprovalUsersToGird(grid,currentRowIndex);
		}
		$('#userAVMPopup_messageContentDiv').addClass('hidden');
		grid.refresh();
	}
}

function handleSaveAndNextApprovalUsersToGird(grid,rowIndex){
	var nxtRecord = grid.store.data.getAt(rowIndex);
	var nxtLvl = null;
	if(!isEmpty(nxtRecord))
	{
		nxtLvl = nxtRecord.data.level;
		$("#axmFromDtl").val(nxtRecord.data.limitFrom);	
		$("#axmToDtl").val(nxtRecord.data.limitTo);
		$("#totalLevelsDtl").val(nxtRecord.data.level);
		$("#axsMinreqDtl").val(nxtRecord.data.approvers);
		$("#minReqLabel").text(' ');
		$("#minReqLabel").append(getLabel('numberOfApproversInLevel','Number of Approvers in Level')+' '+ nxtLvl);
		if(nxtLvl === 1 || isEmpty(nxtRecord.data.limitTo))
			$("#axmToDtl").removeAttr('disabled');
		else
			$("#axmToDtl").attr('disabled','disabled');
		handleUserPopulation(grid,nxtRecord);
		handleBtnVisibility(nxtRecord.data.level);
	}
}

function handleSaveAndPrevApprovalUsersToGird(grid,rowIndex){
	var prevRecord = grid.store.data.getAt(rowIndex);
	var prevLvl = null;
	if(!isEmpty(prevRecord))
	{
		prevLvl = prevRecord.data.level;
		$("#axmFromDtl").val(prevRecord.data.limitFrom);	
		$("#axmToDtl").val(prevRecord.data.limitTo);
		$("#totalLevelsDtl").val(prevRecord.data.level);
		$("#axsMinreqDtl").val(prevRecord.data.approvers);
		$("#minReqLabel").text(' ');
		$("#minReqLabel").append(getLabel('numberOfApproversInLevel','Number of Approvers in Level')+' '+ prevLvl);
		if(prevLvl === 1 || isEmpty(prevRecord.data.limitTo))
			$("#axmToDtl").removeAttr('disabled');
		else
			$("#axmToDtl").attr('disabled','disabled');
		handleUserPopulation(grid,prevRecord);
		handleBtnVisibility(prevRecord.data.level);
	}
}

function generateJsonForApprovalMatrix(){
	var arrGridStoreData = new Array(),objGridStoreData={};
	var gridStore,objGridData;
	
	if(!isEmpty(objDefApprovalMatrixGrid)){
		gridStore = objDefApprovalMatrixGrid.getStore(); 
		if(!isEmpty(gridStore))
			objGridData =gridStore.data.items; 
		
		if(!isEmpty(objGridData))
		{
			$.each(objGridData, function(index, cfg) {
				var data = cfg.data;
				var objData = {};
				objData["tier"]=data.tier;
				objData["level"]=data.level;
				objData["limitFrom"]=data.limitFrom;
				objData["limitTo"]=parseFloat(data.limitTo);
				objData["approvers"]=parseFloat(data.approvers);
				objData["users"]= getUserArrJson(data);
				arrGridStoreData.push(objData);
			});
			
			//objGridStoreData["templateApprovalMatrix"] = arrGridStoreData;
		}
		return arrGridStoreData;
	}
	
}

function getUserArrJson(data){
	var objArrUser = [],strUserCode,strUserDesc,arrUserDesc=[],arrUserCode=[];
	strUserCode = data.usersCode;
	strUserDesc = data.users;
	
	if(!Ext.isEmpty(strUserDesc))
		arrUserDesc = strUserDesc.split(',');
	if(!Ext.isEmpty(strUserCode))
		arrUserCode = strUserCode.split(',');
	
	if(arrUserDesc.length == arrUserCode.length){
		for(var i=0;i<arrUserDesc.length;i++){
			var objData={};
			objData["code"] = arrUserCode[i];
			objData["description"] = arrUserDesc[i];
			objArrUser.push(objData);
		}
	}
	return objArrUser;
	
}

function setAVMPopupGlobalLevels(grid, rowIndex, columnIndex, btn, event, record){
	var arrStore = grid.store.data.items;
	currentRowIndex = rowIndex;
	totalLevels = 0;
	// Logic to get total levels in the current tier.
	var currentTier = record.data.tier;
	for (var i = 0; i < arrStore.length; i++) {
		if (arrStore[i].data.tier == currentTier) {
			totalLevels++;
		}
	}
}

function paintUserAVMPopupErrors(arrError){
	var element = null, strMsg = null, strTargetDivId = 'userAVMPopup_messageArea', strErrorCode = '';
	if (arrError && arrError.length > 0) {
		$('#' + strTargetDivId).empty();
		$.each(arrError, function(index, error) {
					strMsg = error.errorMessage;
					strErrorCode = error.errorCode || error.code;
					strMsg += !isEmpty(strErrorCode) ? ' (' + strErrorCode + ')' : '';
					if (!isEmpty(strErrorCode)) {
							element = $('<p>').text(strMsg);
							element.appendTo($('#' + strTargetDivId));
							$('#' + strTargetDivId + ', #userAVMPopup_messageContentDiv')
									.removeClass('hidden');
						

					}
				});
	}
}

function doClearUserAVMPopupMessageSection() {
	$('#userAVMPopup_messageArea').empty();
	$('#userAVMPopup_messageContentDiv')
			.addClass('hidden');
}

function resetPaymentResponseForNewGrid(payType){
	if(payType === 'B'){
		if(!Ext.isEmpty(paymentResponseHeaderData)
			&& !Ext.isEmpty(paymentResponseHeaderData.d)
			&& !Ext.isEmpty(paymentResponseHeaderData.d.paymentEntry)
			&& !Ext.isEmpty(paymentResponseHeaderData.d.paymentEntry.templateApprovalMatrix)){
				//templateApprovalMatrixData = JSON.parse(JSON.stringify(paymentResponseHeaderData.d.paymentEntry.templateApprovalMatrix));
				paymentResponseHeaderData.d.paymentEntry.templateApprovalMatrix = [{tier: 1, level: 1, limitFrom: 0, approvers: 1, users: []}];
			}
	} else if(payType === 'Q'){
		if(!Ext.isEmpty(paymentResponseInstrumentData)
			&& !Ext.isEmpty(paymentResponseInstrumentData.d)
			&& !Ext.isEmpty(paymentResponseInstrumentData.d.paymentEntry)
			&& !Ext.isEmpty(paymentResponseInstrumentData.d.paymentEntry.templateApprovalMatrix)){
				//templateApprovalMatrixData = JSON.parse(JSON.stringify(paymentResponseInstrumentData.d.paymentEntry.templateApprovalMatrix));
				paymentResponseInstrumentData.d.paymentEntry.templateApprovalMatrix = [{tier: 1, level: 1, limitFrom: 0, approvers: 1, users: []}];
			}
	}
}

function getLastTier(grid){
	var arrStore = grid.store.data.items;
	return arrStore[arrStore.length-1].data.tier;
}

function getNextTierData(grid, currentTier){
	if(!isEmpty(grid))
		gridStore = grid.getStore();
	
	if(!Ext.isEmpty(gridStore)){
		var objStoreData = gridStore.data.items;
		for (var i = 0; i < objStoreData.length; i++) {
			var objData = objStoreData[i].data;
			if (objData.tier === currentTier+1)
				return objData;
		}
		return null;
	}
}