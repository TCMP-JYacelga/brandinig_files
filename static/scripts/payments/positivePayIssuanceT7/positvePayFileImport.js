function importIssuance() {
	$('#importIssuanceDiv').dialog({
				autoOpen : false,
				maxHeight : 550,
				minHeight:156,
				width : 800,
				modal : true,
				resizable: false,
				draggable: false,
				/*
				 * buttons:[{ id: 'cancel', text: 'Cancel', click: function(){
				 * $(this).dialog("close"); } },{ id: 'import', text: 'Import',
				 * click: function(){
				 * $(this).trigger('savePositivePayImportAction');
				 * $(this).dialog("close"); } }],
				 */
				open : function() {
					doResetForm();
					hideForClient();
					addSellerMenuItemsToImportPopUp();
					handleImportFIselect();
					createUploadDetailsGrid();
					showImportDetails('show');
					$('#importIssuanceDiv').dialog("option","position","center");
				},
				close : function(){
					$('#fileUploadDetailsDiv').empty();
				}
			});
	$('#importIssuanceDiv').dialog("open");
}

function newfileselected () {
	var filename = $('#file').val();
	if(filename) {
		$('#lblSelectedFileName').html(filename.substring(filename.lastIndexOf('\\')+1));
	} else {
		$('#lblSelectedFileName').html(labels.lblNoFileSelected);
	}
}

function chooseFileClicked() {
	$('#file').click();
}

function refreshImportIssuanceGrid()
{
	$("#fileUploadDetailsDiv").empty();
	createUploadDetailsGrid();
}

function addSellerMenuItemsToImportPopUp() {
	var strUrl = 'services/userseek/importFile.json?$top=-1&$skip=-1&$filtercode1='+$('#clientSelct').val();
	if (entityType == 1) {
		if (!Ext.isEmpty(sessionCorporation)) {
			strUrl = strUrl;
		}
	}	 
	$.ajax({
				url : strUrl,
				type : 'POST',
				async : false,
				success : function(response) {
					var responseData = response;
					var data = responseData.d.preferences;
					loadSellersMenuToImportPopUp(data);
				},
				failure : function() {
					// console.log("Error Occured - Addition Failed");
				}
			});
}
function loadSellersMenuToImportPopUp(data) {
	var elementId = 'fileSelect';
	var el = $("#" + elementId);
	var fileFormatType='';
	$('#fileSelect option[value!="0"]').remove()
	if (data && data.length) {
		for (index = 0; index < data.length; index++) {
			fileFormatType = data[index].CODE;
			fileFormatType = fileFormatType.concat("  -  ");
			fileFormatType = fileFormatType.concat(data[index].DESCRIPTION );
			
			var opt = $('<option />', {
						value : data[index].CODE,
					//	text : data[index].CODE  data[index].DESCRIPTION
						text : fileFormatType
					});
			fileFormatType = '';
			opt.appendTo(el);
		}
		if (data.length === 1)
			$("#" + elementId).removeClass('hidden');
	}else{
		var opt = $('<option />', {
						value : '',
						text : 'Select'
					});

			opt.appendTo(el);
	}
	//handleImportFIselect();
}
function handleImportFIselect() {
	//var fiSelect = $("#fiSelect");
	var selectedSellerCode = sessionSellerCode;
	if (selectedSellerCode != "") {
		addClientMenuItemsToImportPopUp(selectedSellerCode);
	}
}
function addClientMenuItemsToImportPopUp(selectedSellerCode) {
	var strUrl = 'services/positivePayClientList.json?' + '$sellerCode='
			+ selectedSellerCode;
	if (entityType == 1) {
		if (!Ext.isEmpty(sessionCorporation)) {
			strUrl = strUrl + '?$corpId=' + sessionCorporation;
		}
	}
	$.ajax({
				url : strUrl,
				method : 'GET',
				async : false,
				success : function(response) {
					var responseData = response;
					var data = responseData.d;
					loadClientsMenuToImportPopUp(data);
				},
				failure : function() {
					// console.log("Error Occured - Addition Failed");
				}
			});
}
function loadClientsMenuToImportPopUp(data) {
	var elementId = 'clientSelct';
	var el = $("#" + elementId);
	if (data && data.length) {
		for (index = 0; index < data.length; index++) {
			var opt = $('<option />', {
						value : data[index].filterCode,
						text : data[index].filterValue
					});

			opt.appendTo(el);
		}
		if (data.length === 1)
			$("#" + elementId).removeClass('hidden');
	}
}
function hideForClient() {
	if (isClientUser()) {
		$('#fiDiv').hide();
		$('#clientDiv').hide();

	} else {
		
		$('#fiDiv').hide();
		$('#clientDiv').show();
	}
}
function closePositiveIssuanceImportPopup() {
	var filename = $('#file').val();
	if(filename) {
		$('#lblSelectedFileName').html("no file selected");
	}
	$('#importIssuanceDiv').dialog('close');
}
function paintErrors(arrError) {
	var element = null, strMsg = null, strTargetDivId = 'importError', strErrorCode = '';
	if (arrError && arrError.length > 0) {
		$('#' + strTargetDivId).empty();
		$.each(arrError, function(index, error) {
					strErrorCode = error.errorCode || error.code;
					strMsg = !isEmpty(strErrorCode) ? strErrorCode : '';
					if (!isEmpty(strMsg))
						strMsg += ' : ';
					strMsg += error.errorMessage;
					if (!isEmpty(strErrorCode)) {
						element = $('<p>').text(strMsg);
						element.appendTo($('#' + strTargetDivId));
						$('#' + strTargetDivId + ', #ImporterrorContainerDiv')
								.show();
					}
				});

	}
}
function doResetForm() {
	 $('#issuanceFile').replaceWith($('#issuanceFile').val('').clone(true));
	 doClearMessageSection();
}
function doClearMessageSection() {
	$('#importError').empty();
	$('#ImporterrorContainerDiv').hide();
}

function createUploadDetailsGrid() {
	var renderToDiv = 'fileUploadDetailsDiv';
	var store = createTxnDetailsGridStore();
	store.loadPage(1);
	var grid = Ext.create('Ext.grid.Panel', {
				store : store,
				maxHeight : 240,
				scroll : 'vertical',
				cls : 't7-grid',
				popup : true,
				sortableColumns: true,
				listeners: {
					cellclick: function(view, td, cellIndex, record,tr, rowIndex, e, eOpts) {
						if(record.data.ahtskStatus === 'Aborted' || record.data.ahtskStatus === 'Rejected' || record.data.ahtskStatus === 'Error' || record.data.ahtskStatus === 'Partial'){
				    		showUploadErrorReport(record.data);;
						}

					}
				},
					bbar: Ext.create('Ext.ux.gcp.GCPPager', {
					baseCls : 'xn-paging-toolbar',
					store : store,
					pageSize: 10,
					displayInfo : true,
					showPager : true,
					hidden : false					
				}),
			columns : [{
							text : getLabel('lblAction', 'Action'),
							width : 60,
							draggable : false,
							resizable : false,
							hideable : false,
							sortable : false,
							colType : 'action',
							renderer: function(value, metaData, record, rowIndex, colIndex, store){
								if(record.data.ahtskStatus === 'Aborted' || record.data.ahtskStatus === 'Rejected' || record.data.ahtskStatus === 'Error' || record.data.ahtskStatus === 'Partial'){
						    		//return '<i class="fa fa-exclamation-circle" style="color:#F78181"></i>';
									return '<a class="grey cursor_pointer action-link-align grid-row-action-icon icon-error" name="btnViewError" title="'+getLabel('lblViewReport', 'View Report')+'">&nbsp;&nbsp;</a>';
								}
								if(record.data.ahtskStatus === 'In Queue' || record.data.ahtskStatus === 'Running'){
						    		return '<i class="fa fa-spinner"></i>';
								}
								else{
									 return '<a class="grey cursor_pointer action-link-align grid-row-action-icon icon-completed" name="btnViewOk" title="'+getLabel('lblCompleted', 'Completed')+'">&nbsp;&nbsp;</a>';
								}
							 }
							
						},{
							text : getLabel('lblFileName', 'File Name'),
							dataIndex : 'ahtskSrc',
							width : 390,
							draggable : false,
							resizable : true,
							hideable : false,
							sortable : false
						}, {
							text : getLabel('lblCreatedOn', 'Import DateTime'),
							dataIndex : 'uploadDate',
							width : 198,
							draggable : false,
							resizable : true,
							hideable : false,
							sortable : false
						}, {
							text : getLabel('lblRemarks', 'Status'),
							dataIndex : 'ahtskStatus',
							flex : 1,
							width : 109,
							draggable : false,
							resizable : true,
							hideable : false,
							sortable : false
						}],
				renderTo : renderToDiv
			});
	return grid;
}
function createTxnDetailsGridStore() {
	var jsonData = null;
		/*$.ajax({
					url : 'services/positivePayIssuanceUploadList.json??$top=',
					type : 'POST',
					async: false,
					success : function(data) {
						if (data && data.d)
							jsonData = data.d.fileUploadCenter;
					}
				})*/
	var myStore = Ext.create('Ext.data.Store', {
				id : 'issuanceUploadStore',
				buffered: false,
				pageSize : 10,
				limit : 10,
				autoLoad  : false,
				proxy : {
					type : 'ajax',
					method : 'POST',
				    pageParam: '$skip',
				    limitParam : '$top',
				    extraParams: {
				    	$clientCode: $('#clientSelct').val()
			        },
					api : {
						read : 'services/positivePayIssuanceUploadList.json'
					},
					reader : {
						type : 'json',
						root : 'd.fileUploadCenter',
						totalProperty : 'd.__count'
					},
                    actionMethods: {
                        read: 'POST'
                    }
				},
				fields : ['ahtskSrc', 'uploadDate', 'ahtskid', 'ahtskdata',
						'ahtskStatus', 'identifier', 'ahtskclient', 'ahtskClientDesc','recordKeyNo'],
				data : jsonData
			});
	return myStore;
}

function showUploadErrorReport(record) {
		var me = this;
		var strUrl = 'services/getFileUploadCenterList/getUploadErrorReport.pdf'
		form = document.createElement( 'FORM' );
		form.name = 'frmMain';
		form.id = 'frmMain';
		form.method = 'POST';
		form.appendChild( me.createFormField( 'INPUT', 'HIDDEN', csrfTokenName,  csrfTokenValue ) );
		form.appendChild( me.createFormField( 'INPUT', 'HIDDEN', 'taskid', record.recordKeyNo ) );
		form.appendChild( me.createFormField( 'INPUT', 'HIDDEN', 'isImportReport', 'N' ) );
		form.appendChild( me.createFormField( 'INPUT', 'HIDDEN', 'client', record.ahtskclient) );
		form.action = strUrl;
		document.body.appendChild( form );
		form.submit();
		document.body.removeChild( form );
	}
