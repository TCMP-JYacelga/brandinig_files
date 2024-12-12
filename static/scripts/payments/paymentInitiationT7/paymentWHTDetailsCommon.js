var objWHTMetaData = null;
var objWHTDetailGrid = null;
function showWHTDetailsEntryPopup() {
	$('#whtEntryPopup').dialog({
		autoOpen : false,
		maxHeight : 620,
		width : 690,
		modal : true,
		dialogClass : 'ft-dialog',
		title : getLabel('whtdetailstitle','WHT Details'),
		open : function() {
			$("#invoiceDate").removeClass('requiredField');
			$('#whtPopupDetailsMessageDiv #messageArea').empty();
			$('#whtPopupDetailsMessageDiv').hide();
			$('#whtEntryPopup').removeClass('hidden');
			$('#whtEntryPopup').dialog('option', 'position', 'center');
		},
		close : function() {
			doClearWHTDetailsPopup();
		}
	});
	$('#whtEntryPopup').find('input[type=text]').each(function() {
		$(':text').attr('disabled', false);
	});
	$("#invoiceDate").datepicker().datepicker('enable');
	$('#btnWhtUpdate').addClass('hidden');
	$('#btnWhtSave').removeClass('hidden');
	$('#whtEntryPopup').dialog("open");
}
function closeWhtEntryPopup() {
	$('#whtEntryPopup').dialog('close');
}

function paintPaymentWHTAdditionalDetailsGrid(objWhtDetailsData, isViewOnly) {
	if (!Ext.isEmpty(objWHTDetailGrid)) Ext.destroy(objWHTDetailGrid);

	$('#whtAdditionalGridDiv').empty();
	var gridData = objWhtDetailsData[0], whtGridStore = null, whtGridPager = null,pagerPanel=null;
	var gridCols = new Array();
	var gridObjectJson = new Array();
	gridCols = getWHTGridColumns(isViewOnly);
	gridObjectJson = loadWHTGridData(gridObjectJson);
	whtGridStore = createWHTDetailsGridStore(gridObjectJson);
	Ext.application({
		name : 'GCP',
		launch : function() {
			objWHTDetailGrid = Ext.create('Ext.grid.Panel', {
				store : whtGridStore,
				maxHeight : ( navigator.userAgent.search("Firefox") > -1 ? 550 : 500),
				minHeight: ( navigator.userAgent.search("Firefox") > -1 ? 180 : 150),
				cls : 'whtGrid',
				columns : gridCols,
				dockedItems : [],
				renderTo : (isViewOnly === false) ? 'whtAdditionalGridDiv' : 'whtAdditionalGridViewDiv',
				listeners : {

				},
				handleGridCellClick : function(gridView, td, cellIndex, record, tr, rowIndex, eventObj) {
					var me = gridView;
					if (me.moreMenu) me.moreMenu.destroy(true);
					var arrMoreMenuActions = [ {
						"text" : getLabel('editRecordToolTip', 'Modify Record'),
						"itemId" : "btnEdit",
						"iconCls" : "grid-row-action-icon icon-edit",
						"handler" : function(menu) {
							menu.dataParams = {
								'record' : record,
								'rowIndex' : rowIndex,
								'columnIndex' : cellIndex,
								'view' : gridView
							};
							handleMoreMenuItemClick(gridView, rowIndex, cellIndex, menu, eventObj, record);
						}
					},{
						"text" : getLabel('viewRecordToolTip', 'View Record'),
						"itemId" : "btnView",
						"iconCls" : "grid-row-action-icon icon-view",
						"handler" : function(menu) {
							menu.dataParams = {
								'record' : record,
								'rowIndex' : rowIndex,
								'columnIndex' : cellIndex,
								'view' : gridView
							};
							handleMoreMenuItemClick(gridView, rowIndex, cellIndex, menu, eventObj, record);
						}
					},{
						"text" : getLabel('instrumentsActionDiscard', 'Discard Record'),
						"itemId" : "btnDelete",
						"iconCls" : "grid-row-action-icon icon-delete",
						"handler" : function(menu) {
							menu.dataParams = {
								'record' : record,
								'rowIndex' : rowIndex,
								'columnIndex' : cellIndex,
								'view' : gridView
							};
							handleMoreMenuItemClick(gridView, rowIndex, cellIndex, menu, eventObj, record);
						}
					} ];
					if (!Ext.isEmpty(arrMoreMenuActions)) {
						objMenu = Ext.create('Ext.menu.Menu', {
							itemId : 'moreMenu',
							floating : true,
							cls : 'action-dropdown-menu',
							autoHeight : true,
							minWidth : 150,
							maxWidth : 560,
							defaultMinWidth : $('#btnMore_' + rowIndex).width(),
							items : arrMoreMenuActions,
							listeners : {
								'hide' : function() {
									eventObj.target.className = "icon-action-dropdown cursor_pointer";
								}
							}
						});
						objMenu.showAt(eventObj.getXY());
						if (eventObj.target) objMenu.anchorTo(eventObj.target);
						me.moreMenu = objMenu;
					}
				}
			});
			whtGridPager = Ext.create('Ext.ux.gcp.GCPPager', {
				store : whtGridStore,
				pageSize: 5,
				showPager : true,
				baseCls : 'xn-paging-toolbar',
				dock : 'bottom',
				displayInfo : true
			});
			pagerPanel = Ext.create('Ext.container.Container', {
				cls: 't7-grid',
				dock : 'bottom',
				items: [whtGridPager]
			});
			objWHTDetailGrid.addDocked(pagerPanel);
			objWHTDetailGrid.on('cellclick', function(gridView, td, cellIndex, record, tr, rowIndex, eventObj) {
				if(eventObj.target.tagName == "A" && eventObj.target.name == "btnMore"){
					objWHTDetailGrid.handleGridCellClick(gridView, td, cellIndex, record, tr, rowIndex, eventObj);
				}
			});
		}
	});
}

function handleMoreMenuItemClick(gridView, rowIndex, cellIndex, menu, eventObj, record){
	if(menu.itemId === 'btnEdit'){
		editWHTDtl(gridView, rowIndex, cellIndex, menu, eventObj, record);
	}
	else if(menu.itemId === 'btnView'){
		viewWHTDtl(gridView, rowIndex, cellIndex, menu, eventObj, record);
	}
	else if(menu.itemId === 'btnDelete'){
		deleteWHTDtl(gridView, rowIndex, cellIndex, menu, eventObj, record);
	}
}

function createWHTDetailsGridStore(gridObjectJson) {
	var objGridStore = Ext.create('Ext.data.Store', {
		id : 'whtStore',
		buffered : false,
		pageSize : 5,
		limit : 5,
		autoLoad : true,
		proxy : {
			type : 'pagingmemory',
			data : gridObjectJson,
			reader : {
				type : 'json',
				root : 'd.records',
				totalProperty : 'totalRows',
				successProperty : 'SUCCESS'

			}
		},
		fields : [ 'natureofIncomepayments', 'atc', 'firstMonthOfQuarter', 'secondMonthOfQuarter', 'thirdMonthOfQuarter', 'total',
				'taxWithheldForQuarter', 'invoiceDate' ]
	});
	return objGridStore;
}

function loadWHTGridData(grid) {
	var gridJson = {}, finalJson = {};
	var arrGridStoreData = new Array();
	var eachWHTDataObj = null, objOfEveryWHTParam = nullobjOfParam = null;

	if (!isEmpty(objWhtDetails)) {
		for (var i = 0; i < objWhtDetails.length; i++) {
			if (objWhtDetails[i]) {
				objOfEachMultiSetEnrich = objWhtDetails[i];
				eachWHTDataObj = {};
				objOfEveryWHTParam = objWhtDetails[i].parameters;
				if (objOfEveryWHTParam) {
					for (var j = 0; j < objOfEveryWHTParam.length; j++) {
						objOfParam = objOfEveryWHTParam[j];
						if (objOfParam && objOfParam.code && objOfParam.value) {
							if (objOfParam.displayType === 4 || objOfParam.displayType === 11) {
								var objDispVal = getEnrichValueToDispayed(objOfParam);
								eachWHTDataObj[objOfParam.code + "desc"] = objDispVal;
								eachWHTDataObj[objOfParam.code] = objOfParam.value;
							}
							else
								eachWHTDataObj[objOfParam.code] = objOfParam.value;
						}
					}
				}
			}
			if (!jQuery.isEmptyObject(eachWHTDataObj)) arrGridStoreData.push(eachWHTDataObj);
		}
	}

	if (arrGridStoreData) {
		gridJson['records'] = arrGridStoreData;
		gridJson['totalRows'] = arrGridStoreData.length;
		gridJson['SUCCESS'] = true;
	}
	finalJson['d'] = gridJson;
	return finalJson;
}

function getWHTGridColumns(isViewOnly) {
	var WHT_GRID_COLUMN_MODEL = [];
	var firefox  = navigator.userAgent.indexOf('Firefox') > -1;
	var chrome = navigator.userAgent.indexOf('Chrome') > -1;
	var objActionColumn =  {
			text : getLabel('actions', 'Actions'),
			width : firefox == true ? 108 : (chrome == true ? 110 : 98),
			draggable : false,
			resizable : false,
			hideable : false,
			sortable : false,
			cls : 'action-Content-Col',
			xtype : 'actioncolumn',
			renderer : function(value, metaData, record, rowIndex, colIndex, store) {
				return '<a class="icon-action-dropdown cursor_pointer" name="btnMore"  id="btnMore_' + rowIndex + '">'+getLabel('lblselect', 'Select')+'</a>';
			}
		};
	
	WHT_GRID_COLUMN_MODEL.push({
		text : '#',
		itemId : 'srNo',
		hidden : false,
		width : 60,
		align : 'center',
		resizable : false,
		hideable : false,
		draggable : false,
		renderer : this.columnRenderer
	}, {
		text : getLabel('natureofIncomepayments', 'Nature of Income-payments'),
		itemId : 'natureofIncomepayments',
		dataIndex : 'natureofIncomepayments',
		width : 200,
		draggable : false,
		sortable : false,
		resizable : false,
		hideable : false,
		renderer : this.columnRenderer
	}, {
		text : getLabel('atc', 'ATC'),
		dataIndex : 'atc',
		itemId : 'atc',
		width : 200,
		draggable : false,
		resizable : false,
		sortable : false,
		hideable : false,
		renderer : this.columnRenderer
	}, {
		text : getLabel('firstMonthOfQuarter', '1st Month Of Quarter'),
		dataIndex : 'firstMonthOfQuarter',
		itemId : 'firstMonthOfQuarter',
		width : 200,
		draggable : false,
		align : 'right',
		resizable : false,
		sortable : false,
		hideable : false,
		renderer : this.columnRenderer
	}, {
		text : getLabel('secondMonthOfQuarter', '2nd Month Of Quarter'),
		dataIndex : 'secondMonthOfQuarter',
		width : 200,
		align : 'right',
		itemId : 'secondMonthOfQuarter',
		draggable : false,
		sortable : false,
		resizable : false,
		hideable : false,
		renderer : this.columnRenderer
	}, {
		text : getLabel('thirdMonthOfQuarter', '3rd Month Of Quarter'),
		dataIndex : 'thirdMonthOfQuarter',
		itemId : 'thirdMonthOfQuarter',
		width : 200,
		draggable : false,
		align : 'right',
		resizable : false,
		sortable : false,
		hideable : false,
		renderer : this.columnRenderer
	}, {
		text : getLabel('total', 'Total'),
		dataIndex : 'total',
		itemId : 'total',
		width : 200,
		align : 'right',
		draggable : false,
		resizable : false,
		sortable : false,
		hideable : false,
		renderer : this.columnRenderer
	}, {
		text : getLabel('taxWithheldForQuarter', 'Tax With held For Quarter'),
		dataIndex : 'taxWithheldForQuarter',
		itemId : 'taxWithheldForQuarter',
		width : 200,
		draggable : false,
		resizable : false,
		sortable : false,
		hideable : false,
		renderer : this.columnRenderer
	}, {
		text : getLabel('invoiceDate', 'Invoice Date'),
		dataIndex : 'invoiceDate',
		itemId : 'invoiceDate',
		width : 200,
		draggable : false,
		align : 'right',
		resizable : false,
		sortable : false,
		hideable : false,
		renderer : this.columnRenderer
	});
	
	if(isViewOnly === false)
		WHT_GRID_COLUMN_MODEL.splice(1, 0,objActionColumn);
	
	return WHT_GRID_COLUMN_MODEL;
}

function editWHTDtl(gridView, rowIndex, cellIndex, menu, eventObj, record) {
	var objEditWHTPopup = null;
	$('#whtPopupDetailsMessageDiv #messageArea').empty();
	$('#whtPopupDetailsMessageDiv').hide();
	if (record.data) {
		objEditWHTPopup = $('#whtEntryPopup').dialog({
			autoOpen : false,
			width : 690,
			modal : true,
			title : getLabel('whtdetailstitle','WHT Details'),
			dialogClass : 'ft-dialog'
		});

		$('#natureofIncomepayments').val(record.data['natureofIncomepayments'] || '');
		$('#atc').val(record.data['atc'] || '');

		if (isAutoNumericApplied("firstMonthOfQuarter"))
			$('#firstMonthOfQuarter').autoNumeric('set', (record.data['firstMonthOfQuarter'] || ''));
		if (isAutoNumericApplied("secondMonthOfQuarter"))
			$('#secondMonthOfQuarter').autoNumeric('set', (record.data['secondMonthOfQuarter'] || ''));
		if (isAutoNumericApplied("thirdMonthOfQuarter"))
			$('#thirdMonthOfQuarter').autoNumeric('set', (record.data['thirdMonthOfQuarter'] || ''));
		if (isAutoNumericApplied("whtDetailAmount")) $('#whtDetailAmount').autoNumeric('set', (record.data['total'] || ''));

		$('#taxWithheldForQuarter').val(record.data['taxWithheldForQuarter'] || '');
		$('#invoiceDate').val(record.data['invoiceDate'] || '');

		$('#whtEntryPopup').find('input[type=text]').each(function() {
			$(':input').attr('disabled', false);
		});
		$( "#invoiceDate" ).datepicker().datepicker('enable');

		$('#btnWhtSave').addClass('hidden');
		$('#btnWhtUpdate').removeClass('hidden');
		$('#btnWhtUpdate').unbind('click');
		$('#btnWhtUpdate').click(function() {
			saveEditValueToWhtGrid(rowIndex, record, objEditWHTPopup);
			doClearWHTDetailsPopup();
		});
		
		objEditWHTPopup.dialog('open');
		$('#whtEntryPopup').removeClass('hidden');
		objEditWHTPopup.dialog('option', 'position', 'center');
	}
}

function viewWHTDtl(gridView, rowIndex, cellIndex, menu, eventObj, record) {
	var objViewWHTPopup = null;
	$('#whtPopupDetailsMessageDiv #messageArea').empty();
	$('#whtPopupDetailsMessageDiv').hide();
	if (record.data) {
		
		objViewWHTPopup = $('#whtEntryPopup').dialog({
			autoOpen : false,
			width : 690,
			modal : true,
			title : getLabel('whtdetailstitle','WHT Details'),
			dialogClass : 'ft-dialog'
		});

		$('#natureofIncomepayments').val(record.data['natureofIncomepayments'] || '');
		$('#atc').val(record.data['atc'] || '');
		if (isAutoNumericApplied("firstMonthOfQuarter"))
			$('#firstMonthOfQuarter').autoNumeric('set', (record.data['firstMonthOfQuarter'] || ''));
		if (isAutoNumericApplied("secondMonthOfQuarter"))
			$('#secondMonthOfQuarter').autoNumeric('set', (record.data['secondMonthOfQuarter'] || ''));
		if (isAutoNumericApplied("thirdMonthOfQuarter"))
			$('#thirdMonthOfQuarter').autoNumeric('set', (record.data['thirdMonthOfQuarter'] || ''));
		if (isAutoNumericApplied("whtDetailAmount")) $('#whtDetailAmount').autoNumeric('set', (record.data['total'] || ''));
		$('#taxWithheldForQuarter').val(record.data['taxWithheldForQuarter'] || '');
		$('#invoiceDate').val(record.data['invoiceDate'] || '');
		$('#natureofIncomepayments').attr('disabled', true);
		$('#atc').attr('disabled', true);
		$('#firstMonthOfQuarter').attr('disabled', true);
		$('#secondMonthOfQuarter').attr('disabled', true);
		$('#thirdMonthOfQuarter').attr('disabled', true);
		$('#whtDetailAmount').attr('disabled', true);
		$('#taxWithheldForQuarter').attr('disabled', true);
		$( "#invoiceDate" ).datepicker().datepicker('disable');

		$('#btnWhtSave').addClass('hidden');
		$('#btnWhtUpdate').addClass('hidden');
		
		objViewWHTPopup.dialog('open');
		$('#whtEntryPopup').removeClass('hidden');
		objViewWHTPopup.dialog('option', 'position', 'center');
	}
}

function deleteWHTDtl(gridView, rowIndex, cellIndex, menu, eventObj, record) {
	var objGrid = null;
	objGrid = objWHTDetailGrid,objStoreData = null,objGridPager = null,arrGridStoreData = [],gridJson={},finalJson = {};
	if (record && objGrid) {
		 var objGrid = null; 
	        objGrid = objWHTDetailGrid; 
	        if (record && objGrid) { 
	                objGrid.getStore().remove(record); 
	                objGrid.getStore().proxy.data.d.records.splice(record.index,1);
	                if(!isEmpty(objGrid.getStore().proxy.data.d.records))
	                	objStoreData = objGrid.getStore().proxy.data.d.records;
	                if (!isEmpty(objStoreData)) {
	        			for (var i = 0; i < objStoreData.length; i++) {
	        				arrGridStoreData.push(objStoreData[i]);
	        			}
	        		}
	                if (arrGridStoreData) {
	    				gridJson['records'] = arrGridStoreData;
	    				gridJson['totalRows'] = arrGridStoreData.length;
	    				gridJson['SUCCESS'] = true;
	    			}
	    			finalJson['d'] = gridJson;

	    			if (!jQuery.isEmptyObject(finalJson)) {
	    				objGrid.store.loadRawData(finalJson);
	    				objGrid.store.proxy.data = finalJson;
	    			}
	    			objGrid.store.load({
	    				start : 0,
	    				limit : 5
	    			});
	                objGrid.getView().refresh(); 
	                objGridPager = objGrid.down('toolbar[xtype="gcpPager"]');
	    			if(!isEmpty(objGridPager))
	    				objGridPager.doRefresh();
	        } 
	}
}

function doClearWHTDetailsPopup() {
	$('#natureofIncomepayments').val('');
	$('#atc').val('');
	$('#firstMonthOfQuarter').val('');
	$('#secondMonthOfQuarter').val('');
	$('#thirdMonthOfQuarter').val('');
	$('#whtDetailAmount').val('');
	$('#taxWithheldForQuarter').val('');
	$('#invoiceDate').val('');
}

function saveEditValueToWhtGrid(rowIndex, recordObj, objEditWHTPopup) {
	var objGrid = objWHTDetailGrid;

	recordObj.set('natureofIncomepayments', $('#natureofIncomepayments').val());
	recordObj.set('atc', $('#atc').val());

	if (isAutoNumericApplied("firstMonthOfQuarter"))
		recordObj.set('firstMonthOfQuarter', $('#firstMonthOfQuarter').autoNumeric('get'));
	if (isAutoNumericApplied("secondMonthOfQuarter"))
		recordObj.set('secondMonthOfQuarter', $('#secondMonthOfQuarter').autoNumeric('get'));
	if (isAutoNumericApplied("thirdMonthOfQuarter"))
		recordObj.set('thirdMonthOfQuarter', $('#thirdMonthOfQuarter').autoNumeric('get'));
	if (isAutoNumericApplied("whtDetailAmount")) recordObj.set('total', $('#whtDetailAmount').autoNumeric('get'));

	recordObj.set('taxWithheldForQuarter', $('#taxWithheldForQuarter').val());
	
	recordObj.set('invoiceDate', $('#invoiceDate').val());
	if(objGrid.getStore().proxy.data.d.records){
		if(objGrid.getStore().proxy.data.d.records[recordObj.index])
			objGrid.getStore().proxy.data.d.records[recordObj.index] = recordObj.data;
	}

	if (objGrid) {
		objGrid.getView().refresh();
	}
	objEditWHTPopup.dialog("close");
}

function saveWhtDetailsToGrid() {
	var objGrid = null, objGridStore = null, objStoreData = null,objGridPager = null, dataobj = {}, arrGridStoreData = new Array(), gridJson = {}, finalJson = {};
	if(!doValidateInvoiceDate()) 
	{
		$('#whtPopupDetailsMessageDiv').show();
		markRequired($('#invoiceDate'));
	}
	else
	{
		$('#whtPopupDetailsMessageDiv #messageArea').empty();
		$('#whtPopupDetailsMessageDiv').hide();
	
		if (!isEmpty(objWHTDetailGrid)) objGrid = objWHTDetailGrid;
	
		if (!isEmpty(objGrid)) {
			objGridStore = objGrid.getStore();
			if (!isEmpty(objGridStore)) {
				if(!isEmpty(objGridStore.proxy.data.d.records))
					objStoreData = objGridStore.proxy.data.d.records;
			}
			if (!isEmpty(objStoreData)) {
				for (var i = 0; i < objStoreData.length; i++) {
					arrGridStoreData.push(objStoreData[i]);
				}
			}
			if ($('#natureofIncomepayments').val() != '' || $('#atc').val() != '' || $('#firstMonthOfQuarter').autoNumeric('get') != ''
					|| $('#secondMonthOfQuarter').autoNumeric('get') != '' || $('#thirdMonthOfQuarter').autoNumeric('get') != ''
					|| $('#whtDetailAmount').autoNumeric('get') != '' || $('#taxWithheldForQuarter').val() != '' || $('#invoiceDate').val() != '') {
				dataobj['natureofIncomepayments'] = $('#natureofIncomepayments').val();
				dataobj['atc'] = $('#atc').val();
				if (isAutoNumericApplied("firstMonthOfQuarter"))
					dataobj['firstMonthOfQuarter'] = $('#firstMonthOfQuarter').autoNumeric('get');
				if (isAutoNumericApplied("secondMonthOfQuarter"))
					dataobj['secondMonthOfQuarter'] = $('#secondMonthOfQuarter').autoNumeric('get');
				if (isAutoNumericApplied("thirdMonthOfQuarter"))
					dataobj['thirdMonthOfQuarter'] = $('#thirdMonthOfQuarter').autoNumeric('get');
				if (isAutoNumericApplied("whtDetailAmount")) dataobj['total'] = $('#whtDetailAmount').autoNumeric('get');
				dataobj['taxWithheldForQuarter'] = $('#taxWithheldForQuarter').val();
				
				dataobj['invoiceDate'] = $('#invoiceDate').val();
	
				if (!jQuery.isEmptyObject(dataobj)) arrGridStoreData.push(dataobj);
	
				if (arrGridStoreData) {
					gridJson['records'] = arrGridStoreData;
					gridJson['totalRows'] = arrGridStoreData.length;
					gridJson['SUCCESS'] = true;
				}
				finalJson['d'] = gridJson;
	
				if (!jQuery.isEmptyObject(finalJson)) {
					objGrid.store.loadRawData(finalJson);
					objGrid.store.proxy.data = finalJson;
				}
				objGrid.store.load({
					start : 0,
					limit : 5
				});
				doClearWHTDetailsPopup();
				closeWhtEntryPopup();
				objGrid.getView().refresh();
				objGridPager = objGrid.down('toolbar[xtype="gcpPager"]');
				if(!isEmpty(objGridPager))
					objGridPager.doRefresh();
			}
			else {
				closeWhtEntryPopup();
			}
		}
	}
}

function createCopyOfWHTObj(p, c) {
	var c = c || {};
	for ( var i in p) {
		if (typeof p[i] === 'object') {
			c[i] = (p[i].constructor === Array) ? [] : {};
			createCopyOfWHTObj(p[i], c[i]);
		}
		else
			c[i] = p[i];
	}
	return c;
}

function getWHTDetailsJsonArray() {
	if (objWHTDetailGrid) {
		var objOfGridStore = objWHTDetailGrid.getStore();
		var arrOfGridRecord = new Array();
		var arrOfJsonObject = new Array();
		var records = objOfGridStore.proxy.data.d.records;
		for (var i = 0; i < records.length; i++) {
			arrOfGridRecord.push(records[i]);
		}
		var objOfWHTDetails = objWhtDetails[0];

		for (var i = 0; i < arrOfGridRecord.length; i++) {
			var objRecr = arrOfGridRecord[i];
			var cloneNewObj = createCopyOfWHTObj(objOfWHTDetails);
			var objParam = cloneNewObj.parameters;
			for (var j = 0; j < objParam.length; j++) {
				var paramfirstobj = objParam[j];
				var codeObj = paramfirstobj.code;
				paramfirstobj["value"] = objRecr[codeObj];
				paramfirstobj["string"] = objRecr[codeObj];
			}
			arrOfJsonObject.push(cloneNewObj);
		}
		return arrOfJsonObject;
	}
}
function columnRenderer(value, meta, record, rowIndex, colIndex, store, view, colId) {
	var strRetValue = value;
	if (meta.column.itemId == 'firstMonthOfQuarter' || meta.column.itemId == 'secondMonthOfQuarter'
			|| meta.column.itemId == 'thirdMonthOfQuarter' || meta.column.itemId == 'total') {
		if (!Ext.isEmpty(value)) {
			obj = $('<input type="text">');
			obj.autoNumeric('init');
			obj.autoNumeric('set', value);
			strRetValue = obj.val();
			obj.remove();
		}
	}
	else
		if (meta.column.itemId == 'srNo') {
			var curPage = store.currentPage;
			var pageSize = store.pageSize;
			var intValue = ((curPage - 1) * pageSize) + rowIndex + 1;
			if (Ext.isEmpty(intValue)) intValue = rowIndex + 1;
			strRetValue = intValue;
		}
	return strRetValue;

}