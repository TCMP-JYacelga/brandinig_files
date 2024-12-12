var bankGrid = null;
function showBankBranchPopup() {
	var grid;
	$("#bankBranchSelectionPopup").dialog({
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
		title :getLabel('selectBank', 'Select Bank'),
		dialogClass : 'receiverSelectionPopupSelector highZIndex',
		open : function(event, ui) {
			var strFilter = isEmpty($('#beneficiaryBranchDescriptionA').val())
							? '': $('#beneficiaryBranchDescriptionA').val();
			$('#bankBranchCriteria').val(strFilter);
			if(!bankGrid){
				bankGrid = createBankBranchGrid();		
				$('#bankBranchCriteria').unbind("keyup");
				$('#bankBranchCriteria').bind("keyup", function() {
							filterBankBranchGrid();
						});
			} else {
				filterBankBranchGrid();
			}	
		},
		close : function(event, ui) {
		}
	});
	 
}
function closeBankBranchSelectionPopup() {
	$('#bankBranchSelectionPopup').dialog('close');
}

function createBankBranchGrid() {
	var store = createBankBranchGridStore();
	var checkBoxModel = new Ext.selection.CheckboxModel({
			checkOnly : true,
			headerWidth : 40,
			mode : "SINGLE",
			ignoreRightMouseSelection : true,
			injectCheckbox : 0,
			listeners : {
				selectionchange : function(grid, selectedRecords, opts) {
					// me.fireEvent('gridRowSelectionChange',me,selectedRecords);
				}
			}
		});
	var grid = Ext.create('Ext.grid.Panel', {
		store : store,
		//popup : true,
		maxHeight : 365,
		style : {
			'overflow-y' : 'hidden !important;'
		},
		selModel: checkBoxModel, 
		pageSize: 10,
		columns : [/*{ xtype : 'checkcolumn', 
					//text : 'Active', 
					dataIndex : 'active',
					width : 40
				},*/{
					text : getLabel('bank', 'Bank'),
					dataIndex : 'BANKDESCRIPTION',
					draggable : false,
					forceFit : true,
					flex : 40,
					resizable : false,
					hideable : false
				}, {
					text : getLabel('branch', 'Branch'),
					dataIndex : 'BRANCHDESCRIPTION',
					draggable : false,
					flex : 40,
					resizable : false,
					hideable : false
				}, {
					text : getLabel('country', 'Country'),
					dataIndex : 'COUNTRY',
					draggable : false,
					flex : 20,
					resizable : false,
					hideable : false
				}],
				bbar: Ext.create('Ext.ux.gcp.GCPPager', {
					baseCls : 'xn-paging-toolbar',
					store : store,
					pageSize: 10,
					displayInfo : true,
					showPager : true,
					hidden : false					
				}),
		renderTo : 'bankBranchSelectionGrid'
	});
	return grid;
}
function getBankBranchData(strFilter) {
	var jsonData = null;
		$.ajax({
					url : 'services/userseek/beneEntryByName.json',
					data : {
						$autofilter : strFilter,
						$top : autocompleterSize,
						$filtercode1 : $('#beneficiaryBankIDTypeA-niceSelect')
										.is(':hidden')
										? 'FED'
										: $('#beneficiaryBankIDTypeA').val(),
						$filtercode2 : strPaymentCategory
					},
					async : false,
					complete : function(XMLHttpRequest, textStatus) {
					},
					success : function(data) {
						if (data && data.d) {
							jsonData = data;
						}
					}
				});

		return jsonData;
}
function createBankBranchGridStore() {
	var strFilter = isEmpty($('#beneficiaryBranchDescriptionA').val())
	? '%'
	: $('#beneficiaryBranchDescriptionA').val();
	var gridData = getBankBranchData(strFilter);
	var myStore = Ext.create('Ext.data.Store', {
				storeId : 'bankBranchStore',
				fields : ['BANKCODE', 'BANKDESCRIPTION', 'BRANCHDESCRIPTION',
						'COUNTRY', 'BRANCHCODE','ROUTINGNUMBER'],
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
				autoLoad : true,
				listeners : {
				load : function() {
					$("#bankBranchSelectionPopup").dialog('option','position','center');
				}
			}
			});
	return myStore;
}

function filterBankBranchGrid() {
	var strFilter = isEmpty($('#beneficiaryBranchDescriptionA').val())
			? '%'
			: $('#beneficiaryBranchDescriptionA').val();
	var gridData = getBankBranchData(strFilter);
	var store = bankGrid.getStore();
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
}

function setSelectedValue() {
	var selected = bankGrid.getSelectionModel().getSelection();	
	if(selected){
		selected = selected[0];
		var data = selected.data;
		if (data) {
					if (!isEmpty(data.BRANCHDESCRIPTION))
						$('#beneficiaryBranchDescriptionA')
								.val(data.BRANCHDESCRIPTION);

					if (!isEmpty(data.ROUTINGNUMBER)) {
						$('#beneficiaryBankIDCodeA').val(data.ROUTINGNUMBER);
						$("#beneficiaryBankIDCodeAutoCompleter")
								.val(data.ROUTINGNUMBER);
					}

					if (!isEmpty(data.BANKCODE))
						$('#drawerBankCodeA').val(data.BANKCODE);
					if (!isEmpty(data.BRANCHCODE))
						$('#drawerBranchCodeA').val(data.BRANCHCODE);
					if (!isEmpty(data.BRANCHDESCRIPTION)) {
						$('#beneficiaryBranchDescriptionA')
								.val(data.BRANCHDESCRIPTION);
					}
					if (!isEmpty(data.BANKDESCRIPTION)) {
						$('#beneficiaryBankDescriptionA')
								.val(data.BANKDESCRIPTION);
					}
					if (!isEmpty(data.ROUTINGNUMBER)) {
						$('#beneficiaryBankIDCodeA').val(data.ROUTINGNUMBER);
						$("#beneficiaryBankIDCodeAutoCompleter")
								.val(data.ROUTINGNUMBER);
					}
					// $('#bankBranchDtlSpan').html(strText);
					if (!isEmpty(data.ADDRESS))
						$('#drawerBankAddressA').val(data.ADDRESS);

					setBankIDValue($('#beneficiaryBankIDTypeA').val(),
							$('#beneficiaryBankIDCodeA'), data);
					$('#drawerBankBranchDescALbl').removeClass("required");
				}
	}	
	closeBankBranchSelectionPopup();
}