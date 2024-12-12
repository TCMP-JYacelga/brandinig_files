var receiverGrid = null;
var isReceiverAdded = false;
var arrayList = [];
function showReceiverSlectionPopup() {
	var grid;
	$("#receiverSelectionPopup").dialog({
		resizable : false,
		draggable : false,
		modal : true,
		width : 735,
		maxHeight : 550,
		position: {
            my: "center",
            at: "center",
            of: window
        },
		title : (strLayoutType === 'WIRELAYOUT' && strLayoutSubType === 'DRAWDOWN') ? getLabel('addDebitPartylbl', 'Add Debit Party') : getLabel('addReceiverslbl', 'Add Receivers'),
		dialogClass : 'receiverSelectionPopupSelector',
		// dialogClass : "hide-title-bar",
		open : function(event, ui) {
		//$(".ui-widget-overlay").remove(); // removed blur screen at the time of receiver addition
			//$('.ui-dialog-buttonpane').find('.ui-dialog-buttonset button').addClass('receiverselection-footer-button');
			isReceiverAdded = false;
			arrayList = [];
			doClearMessageSection();
			$('#messageContentDiv')
					.appendTo($("#messageContentAddUsingRecDiv"));
			receiverGrid = null;
			if (!receiverGrid) {
				receiverGrid = createReceiverSelectionGrid();
				$('#receiverSelectionCriteria').unbind("keyup");
				$('#receiverSelectionCriteria').bind("keyup", function() {
							filterReceiverGrid();
						});
			}
		$('.receiverSelectionPopupSelector .ft-button-primary:contains(Submit)')
					.text(getLabel('btnClose', 'Close'));
		$('#receiverSelectionPopup').dialog('option', 'position', 'center');
		},
		close : function(event, ui) {
			$('#messageContentDiv').appendTo($('#messageContentHeaderDiv'));
			if (isReceiverAdded && typeof objInstrumentEntryGrid != 'undefined'
					&& objInstrumentEntryGrid) {
				objInstrumentEntryGrid.refreshData();
			}
			$('#receiverSelectionCriteria').val('');
			receiverGrid.destroy();
		}/*,
		buttons : {
			'Close' : function() {
				$(this).dialog("close");
				$('#messageContentDiv').appendTo($('#messageContentHeaderDiv'));
			}
		}*/
	});

}
function closeReceiverSlectionPopup() {
	$('#receiverSelectionPopup').dialog('close');
	$('#messageContentDiv').appendTo($('#messageContentHeaderDiv'));
}

function addSelectedReceivers() {
	try {
		
	$('#addSelectedReceivers').attr('disabled', 'disabled');
	$(document).trigger("addReceivers",[arrayList]);
	} catch (err) {
		
	}
	$('#addSelectedReceivers').removeAttr('disabled');
	$('#receiverSelectionPopup').dialog('close');
}

// TODO : Label should come from resource bundle, to be changed
function createReceiverSelectionGrid() {
	var store = createGridStore();
	var sm = Ext.create('Ext.selection.CheckboxModel',
	{
		headerWidth : 40,
		allowDeselect : false,
		injectCheckbox : 'first',
		showHeaderCheckbox : false,
		checkOnly : true,
		listeners : {
		select : function(row, record,index, eopts) {
				var isPresent = false;
				var targetRow = Ext.get(receiverGrid.getView().getNode(parseInt(index,10)));
				isReceiverAdded = true;
				if(targetRow && targetRow.hasCls('xn-checked-disabled-row')){ 
					return false;
				}

				var selected=Ext.getCmp('AddUsingReceiversGrid').getView().getSelectionModel().getSelection();
				Ext.each(selected, function (item) {
					isPresent = false;
					if(arrayList.length > 0)
					{
						for(var index = 0; index < arrayList.length; index++)
						{
							if(arrayList[index].receiverCode == item.data.receiverCode)
							{
								isPresent = true;
								break;
							}
						}
						// add item only when its not already present in arrayList
						if(!isPresent)
							arrayList.push(item.data);
					}
					else
					{
						arrayList.push(item.data);
					}
				});	
			},
		beforedeselect : function(row, record,index, eopts){
				var targetRow = Ext.get(receiverGrid.getView().getNode(parseInt(index,10)));
				var checkBox = targetRow.dom.childNodes[0];
				if(checkBox.classList.contains('xn-checked-disabled-row')){
					return false;
				}
			},
		deselect : function(row, record,index, eopts) {
				$(document).trigger("removeFromSelection",[record.get('receiverCode'), 'REC',record.get('receiverName')]);
				var targetRow = Ext.get(receiverGrid.getView().getNode(parseInt(index,10)));
				if(targetRow && targetRow.hasCls('xn-checked-disabled-row')){ 
					return false;
				}
			},
			beforeselect : function(chkBox, record, index, eOpts) {
				var targetRow = Ext.get(receiverGrid.getView().getNode(parseInt(index,10)));
				if(targetRow && targetRow.hasCls('xn-checked-disabled-row')){ 
					return false;
				}
			}

		}
	});
	var grid = Ext.create('Ext.grid.Panel', {
		id: 'AddUsingReceiversGrid',
		store : store,
		selModel : sm,
		maxHeight : 365,
		layout: 'fit',
		autoScroll:true,
		columns : [{
					//text : 'Receiver Name',
					text : (strLayoutType === 'WIRELAYOUT' && strLayoutSubType === 'DRAWDOWN') ? getLabel('debitPartyNamelbl', 'Debit Party Name') : getLabel('receiverNamelbl', 'Receiver Name'),
					dataIndex : 'receiverDesc',
					draggable : false,
					width : 120,
					resizable : false,
					hideable : false,
					sortable : false,
					renderer : function(value,metaData) {
						metaData.tdAttr = 'title="' + value + '"';
						return value;
					}
				}, 
				{
					//text : 'Receiver Code',
					text : (strLayoutType === 'WIRELAYOUT' && strLayoutSubType === 'DRAWDOWN') ? getLabel('debitPartyCodelbl', 'Debit Party Code') : getLabel('receiverCodelbl', 'Receiver Code'),
					dataIndex : 'drawerCode',
					draggable : false,
					forceFit : true,
					width : 110,
					resizable : false,
					hideable : false,
					sortable : false,
					renderer : function(value,metaData) {
						metaData.tdAttr = 'title="' + value + '"';
						return value;
					}
				}, {
					text : getLabel('accountID', 'Receiving Account'),
					dataIndex : 'accountNumber',
					draggable : false,
					width : 150,
					resizable : false,
					hideable : false,
					sortable : false,
					renderer : function(value,metaData) {
						metaData.tdAttr = 'title="' + value + '"';
						return value;
					}
				}, {
					text : getLabel('bankName', 'Bank Branch Name'),
					dataIndex : 'branchName',
					draggable : false,
					width : 150,
					resizable : false,
					hideable : false,
					sortable : false,
					renderer : function(value,metaData,record, rowIndex, colIndex, store,
							view, colId) {
						if (value === "" || typeof value  === 'undefined' ) {
							value = record.get('adhocBrnchdesc');
						}
						metaData.tdAttr = 'title="' + value + '"';
						return value;
					}
				}, {
					text : getLabel('beneficiaryBankIDCode_WIRELAYOUT', 'Identifier'),
					dataIndex : 'bankCode',
					draggable : false,
					width : 150,
					resizable : false,
					hideable : false,
					sortable : false,
					renderer : function(value,metaData) {
						metaData.tdAttr = 'title="' + value + '"';
						return value;
					}
				}/*, {
					text : getLabel('country', 'Country'),
					dataIndex : 'country',
					draggable : false,
					width : 70,
					//resizable : false,
					hideable : false,
					sortable : false,
					renderer : function(value,metaData) {
						metaData.tdAttr = 'title="' + value + '"';
						return value;
					}
				}*/],
		dockedItems : [/*{
					xtype : 'pagingtoolbar',
					store : store,
					pageSize : 10,
					dock : 'bottom',
					displayInfo : true
				}*/],
		renderTo : 'receiverSelectionGrid'
	});
	var gridSmartPager = Ext.create('Ext.ux.gcp.GCPPager', {
		store : store,
		baseCls : 'xn-paging-toolbar',
		dock : 'bottom',
		displayInfo : true
	});
	grid.addDocked(gridSmartPager);
	store.on('load',function(store, records, options){
		$('#receiverSelectionPopup').dialog('option', 'position', 'center');
	});
	return grid;
}

function getPaymentRegisteredReceiverData(strMyProduct, strBankProduct,
		strFilter) {
	var jsonData = null;
	var anyIdFlag = instrumentEntryGridRowData.d.paymentEntry.paymentMetaData.anyIdPaymentFlag 
	? instrumentEntryGridRowData.d.paymentEntry.paymentMetaData.anyIdPaymentFlag
	: "N" ;
	if (!isEmpty(strMyProduct) && !isEmpty(strBankProduct)) {
		$.ajax({
					url : 'services/recieverseek/' + strMyProduct + '/'
							+ strBankProduct + '.json',
					data : {
						qfilter : strFilter,
						$top : -1,
						anyIdFlag : anyIdFlag
					},
					async : false,
					complete : function(XMLHttpRequest, textStatus) {
						// $.unblockUI();
						// if ("error" == textStatus)
						// alert("Unable to complete your request!");
					},
					success : function(data) {
						if (data && data.d) {
							jsonData = data;
						}
					}
				});

		return jsonData;
	}
}
function createGridStore() {
	var strBankProduct = $('#bankProductHdr').val();
	var gridData = getPaymentRegisteredReceiverData(strMyProduct,
			strBankProduct, '%');

	var myStore = Ext.create('Ext.data.Store', {
				storeId : 'receiverStore',
				fields : ['receiverCode', 'drawerCode','receiverDesc', 'accountNumber',
						'bankCode', 'bankName', 'country', 'adhocBrnchdesc', 'receiverIdentifier','anyIdType','anyIdValue'],
				pageSize : 10,
				proxy : {
					type : 'pagingmemory',
					data : gridData,
					reader : {
						type : 'json',
						root : 'd.receivers',
						totalProperty : 'totalRows',
						successProperty : 'SUCCESS'

					}
				},
				autoLoad : true
			});
	return myStore;
}

function filterReceiverGrid() {
	var strFilter = $('#receiverSelectionCriteria').val();
	var strFilter = isEmpty($('#receiverSelectionCriteria').val())
			? '%'
			: $('#receiverSelectionCriteria').val();
	var strBankProduct = $('#bankProductHdr').val();
	var gridData = getPaymentRegisteredReceiverData(strMyProduct,
			strBankProduct, strFilter);
	var store = receiverGrid.getStore();
	store.setProxy({
				type : 'pagingmemory',
				data : gridData,
				reader : {
					type : 'json',
					root : 'd.receivers',
					totalProperty : 'totalRows',
					successProperty : 'SUCCESS'
				}
			});
	store.load();
}
