var accountGrid = null;
var isAccountAdded = false;
function showAccountSlectionPopup() {
	$("#accountSelectionPopup").dialog({
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
		title : getLabel('addAccount', 'Add Accounts'),
		dialogClass : 'accountSelectionPopupSelector',
		// dialogClass : "hide-title-bar",
		open : function(event, ui) {
			//$('.ui-dialog-buttonpane').find('.ui-dialog-buttonset button').addClass('receiverselection-footer-button');
			isAccountAdded = false;
			$('.accountSelectionPopupSelector .ft-button-primary:contains(Submit)')
					.text('Close');
			doClearMessageSection();
			$('#messageContentDiv')
					.appendTo($("#messageContentAddUsingAccDiv"));
			accountGrid = null; 
			$('#accountSelectionCriteria').val('');
			if (!accountGrid) {
				var accountId = $('#accountNoHdr').val();
				accountGrid = createAccountSelectionGrid(accountId ? accountId : '%');
				$('#accountSelectionCriteria').unbind("keyup");
				$('#accountSelectionCriteria').bind("keyup", function() {
							filterAccountGrid(accountId ? accountId : '%');
						});
			}
			$('#accountSelectionPopup').dialog('option', 'position', 'center');
		},
		close : function(event, ui) {
			$('#messageContentDiv').appendTo($('#messageContentHeaderDiv'));
			if (isAccountAdded && typeof objInstrumentEntryGrid != 'undefined'
					&& objInstrumentEntryGrid) {
				 objInstrumentEntryGrid.refreshData();
			}
			accountGrid.destroy();
		}
		/*buttons : {
			'Close' : function() {
				$(this).dialog("close");
				$('#messageContentDiv').appendTo($('#messageContentHeaderDiv'));
			}
		}*/
	});
}

function closeAccountSlectionPopup() {
	$('#accountSelectionPopup').dialog('close');
}

function addSelectedAccounts() {
	var arrayList = [];
	try {
	$('#addSelectedAccounts').attr('disabled', 'disabled');
	var selected=Ext.getCmp('AddUsingAccountsGrid').getView().getSelectionModel().getSelection();
	Ext.each(selected, function (item) {
		   arrayList.push(item.data);
	});
	$(document).trigger("addAccounts",[arrayList]);
	} catch (err) {
		
	}
	$('#addSelectedAccounts').removeAttr('disabled');
	$('#accountSelectionPopup').dialog('close');
}

function createAccountSelectionGrid(accountId) {
	var store = createAccountGridStore(accountId);
	var sm = Ext.create('Ext.selection.CheckboxModel',
	{
		headerWidth : 40,
		allowDeselect : false,
		injectCheckbox : 'first',
		showHeaderCheckbox : false,
		checkOnly : true,
		listeners : {
		select : function(row, record,index, eopts) {
				var targetRow = Ext.get(accountGrid.getView().getNode(parseInt(index,10)));
				isAccountAdded = true;
				if(targetRow && targetRow.hasCls('xn-checked-disabled-row')) {
					return false;
				}
				//if(targetRow) targetRow.addCls('xn-checked-disabled-row');
				/*
				if(targetRow && targetRow.dom && targetRow.dom.childNodes[0]){
					var rowClass = targetRow.dom.childNodes[0].className
					targetRow.dom.childNodes[0].className = rowClass + ' xn-checked-disabled-row'
				}
				isAccountAdded = true;
				$(document).trigger("addRecordUsing", [record.get('CODE'), 'ACC']);
				$('.accountSelectionPopupSelector .ft-button-primary:contains(Close)')
					.text(getLabel('btnSubmit', 'Submit'));
				*/
			},
		beforedeselect : function(row, record,index, eopts){
			var targetRow = Ext.get(accountGrid.getView().getNode(parseInt(index,10)));
			var checkBox = targetRow.dom.childNodes[0];
			if(checkBox.classList.contains('xn-checked-disabled-row')){
				return false;
			}
		},
		deselect : function(row, record,index, eopts) {
				var targetRow = Ext.get(accountGrid.getView().getNode(parseInt(index,10)));
				if(targetRow && targetRow.hasCls('xn-checked-disabled-row')){ 
					return false;
				}
			},
			beforeselect : function(chkBox, record, index, eOpts) {
				var targetRow = Ext.get(accountGrid.getView().getNode(parseInt(index,10)));
				if(targetRow && targetRow.hasCls('xn-checked-disabled-row')){ 
					return false;
				}
			}
		}
	});
	var grid = Ext.create('Ext.grid.Panel', {
		id: 'AddUsingAccountsGrid',
		store : store,
		selModel : sm,
		maxHeight : 365,
		columns : [{
					text : getLabel('accountNumber', 'Account'),
					dataIndex : 'CODE',
					width : 190,
					draggable : false,
					sortable : false,
					resizable : true,
					hideable : false,
					renderer: function(val, meta, rec, rowIndex, colIndex, store) {
						meta.tdAttr = 'title="' + val + '"';
						return val;
					}
				}, {
					text : getLabel('accountCCY', 'Account Currency'),
					dataIndex : 'ACCOUNTCCY',
					width : 100,
					draggable : false,
					resizable : true,
					sortable : false,
					hideable : false,
					renderer: function(val, meta, rec, rowIndex, colIndex, store) {
						meta.tdAttr = 'title="' + val + '"';
						return val;
					}

				}, {
					text : getLabel('accountDesc', 'Account Description'),
					dataIndex : 'DESCRIPTION',
					width : 360,
					draggable : false,
					resizable : true,
					sortable : false,
					hideable : false,
					renderer: function(val, meta, rec, rowIndex, colIndex, store) {
						meta.tdAttr = 'title="' + val + '"';
						return val;
					}
				}],
		dockedItems : [/*{
					xtype : 'pagingtoolbar',
					store : store,
					// same store GridPanel is using
					dock : 'bottom',
					displayInfo : true
				}*/],
		renderTo : 'accountSelectionGrid'
	});
	var gridSmartPager = Ext.create('Ext.ux.gcp.GCPPager', {
		store : store,
		baseCls : 'xn-paging-toolbar',
		dock : 'bottom',
		displayInfo : true
	});
	grid.addDocked(gridSmartPager);
	store.on('load',function(store, records, options){
		$('#accountSelectionPopup').dialog('option', 'position', 'center');
	});
	return grid;
}
function getPaymentUserAccountsData(strFilter, accountId ) {
	var jsonData = null;
	var strUrl = 'services/userseek/clientAccountSeek.json';
		
	if( paymentResponseHeaderData && paymentResponseHeaderData.d &&
		paymentResponseHeaderData.d.paymentEntry && paymentResponseHeaderData.d.paymentEntry.paymentHeaderInfo &&
		paymentResponseHeaderData.d.paymentEntry.paymentHeaderInfo.hdrDrCrFlag )
	{
		if( paymentResponseHeaderData.d.paymentEntry.paymentHeaderInfo.hdrDrCrFlag === 'D' )
			strUrl = 'services/userseek/clientCrPaymentAccountSeek.json';
		else if( paymentResponseHeaderData.d.paymentEntry.paymentHeaderInfo.hdrDrCrFlag === 'C')
			strUrl = 'services/userseek/clientDrPaymentAccountSeek.json'
	}

	$.ajax({
				url : strUrl,
				data : {
					$autofilter : strFilter,
					$filtercode1 : accountId,
					$top : -1
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
function createAccountGridStore( accountId ) {
	if( accountId != null || accountId != '' || accountId !== "undefined" )
	{
		var gridData = getPaymentUserAccountsData('%', accountId);
	}
	else
	{
		var gridData = getPaymentUserAccountsData('%','%');
	}
	var myStore = Ext.create('Ext.data.Store', {
				storeId : 'accountStore',
				fields : ['ACCOUNTCCY', 'CODE', 'DESCRIPTION'],
				pageSize : 10,
				proxy : {
					type : 'pagingmemory',
					data : gridData,
					reader : {
						type : 'json',
						root : 'd.preferences',
						totalProperty : 'totalRows',
						successProperty : 'SUCCESS'

					}
				},
				autoLoad : true
			});
	return myStore;
}
function filterAccountGrid( accountId ) {
	var strFilter = isEmpty($('#accountSelectionCriteria').val())
			? '%'
			: $('#accountSelectionCriteria').val() + '%';
	var gridData = getPaymentUserAccountsData(strFilter, accountId);
	var store = accountGrid.getStore();
	store.setProxy({
				type : 'pagingmemory',
				data : gridData,
				reader : {
					type : 'json',
					root : 'd.preferences',
					totalProperty : 'totalRows',
					successProperty : 'SUCCESS'
				}
			});
	store.load();
	// }
}