function paintPaymentTransactionVerificationRulesGrid(docVerificationRules){
	var renderToDiv = 'verificationRulesGridDiv';
	$('#' + renderToDiv).empty();
	var store = createVerificationRulesGridStore(docVerificationRules);
	var grid = Ext.create('Ext.grid.Panel', {
				store : store,
				popup : true,
				columns : [{
					dataIndex : 'code',
					text : mapLbl['code'],
					width : 200,
					draggable : false,
					resizable : false,
					hideable : false,
					sortable : false
				}, {
					dataIndex : 'description',
					text : mapLbl['description'],
					width : 220,
					draggable : false,
					resizable : false,
					hideable : false,
					sortable : false
				}],
				renderTo : renderToDiv
			});
	var layout = Ext.create('Ext.container.Container', {
				width : 'auto',
				items : [grid],
				renderTo : renderToDiv
			});
	auditGrid = layout;
	return layout;
}

function createVerificationRulesGridStore(docVerificationRules){
	var myStore = Ext.create('Ext.data.Store', {
		fields : ['code','description'],
		data : docVerificationRules,
		autoLoad : true
	});
	return myStore;
}

function paintPaymentTransactionUploadedDocumentsGrid(uploadedDocuments){
	var renderToDiv = 'uploadedDocumentsGridDiv';
	$('#' + renderToDiv).empty();
	var store = createUploadedDocumentsGridStore(uploadedDocuments);
	var grid = Ext.create('Ext.grid.Panel', {
				store : store,
				popup : true,
				listeners: {
					cellclick: function(view, td, cellIndex, record,tr, rowIndex, e, eOpts) {
						var linkClicked = (e.target.tagName == 'A');
						if (linkClicked) {
							var className = e.target.className;
							if (!Ext.isEmpty(className)	&& className.indexOf('fa-paperclip') !== -1) {
								downloadAttachedDocumentFile();
							}
						}
					}
				},
				columns : [{
							xtype : 'actioncolumn',
							header : getLabel('attachment', 'Attachment'),
							align : 'center',
							sortable:false,
							width : 200,
							menuDisabled : true,
							renderer: function(value, metaData, record, rowIndex, colIndex, store){
								    return '<a id="downloadAttachment" class="fa fa-paperclip fa-rotate-90 fa-lg cursor_pointer" title='+getLabel('download', 'Download Attachment')+'></a>';
							 }
						},{
							dataIndex : 'fileName',
							text : mapLbl['fileName'],
							width : 220,
							draggable : false,
							resizable : false,
							hideable : false,
							sortable : false,
							renderer : function(value, metaData){
								metaData.style = 'text-decoration:underline';
								metaData.tdAttr = 'title="' + value + '"';
								return value;
							}
						}],
				renderTo : renderToDiv
			});
	var layout = Ext.create('Ext.container.Container', {
				width : 'auto',
				items : [grid],
				renderTo : renderToDiv
			});
	auditGrid = layout;
	return layout;
}

function createUploadedDocumentsGridStore(uploadedDocuments){
	var myStore = Ext.create('Ext.data.Store', {
		fields : ['fileName'],
		data : [{"fileName":uploadedDocuments}],
		autoLoad : true
	});
	return myStore;
}

function downloadAttachedDocumentFile(){
	var data = new FormData();
	if (!isEmpty(strPaymentInstrumentIde)){
		var form = document.createElement('FORM');
		var strUrl = "services/docverification/download.srvc";
		form.name = 'frmMain';
		form.id = 'frmMain';
		form.method = 'POST';
		form.appendChild(createFormField('INPUT', 'HIDDEN',
				csrfTokenName, tokenValue));
		form.appendChild(createFormField('INPUT', 'HIDDEN',
				'identifier', strPaymentInstrumentIde));
		form.action = strUrl;
		document.body.appendChild(form);
		form.submit();
		document.body.removeChild(form);
	}
}

