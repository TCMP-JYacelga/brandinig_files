Ext.define('GCP.controller.EndClientViewDocumentController', {
	extend : 'Ext.app.Controller',
	views : ['GCP.view.EndClientVerifyDocumentView'],
	refs : [{
				ref : 'viewDocumentDtl',
				selector : 'EndClientVerifyDocumentView panel[itemId="viewDocumentDtl"]'
			},{
				ref : 'grid',
				selector : 'EndClientVerifyDocumentView smartgrid'
			}],
	config : {},
	init : function() {
		var me = this;
		me.control({
			'EndClientVerifyDocumentView' : {
				render : function(panel) {
					me.handleSmartGridLoading();
					
				}
			},
			
			'EndClientVerifyDocumentView smartgrid' : {
			  'cellclick' : me.doHandleCellClick,
				render : function(grid) {
					me.handleLoadGridData(grid, grid.store.dataUrl,
							grid.pageSize, 1, 1, null);
					grid.store.on('load',function(store){
						if(!Ext.isEmpty(store)){
							me.checkStoreCount(store.getTotalCount());
						}
					});
				},
				gridPageChange : me.handleLoadGridData,
				gridSortChange : me.handleLoadGridData
				}
		});
	},

	handleLoadGridData : function(grid, url, pgSize, newPgNo, oldPgNo, sorter) {
		var me = this;
		var strUrl = grid.generateUrl(url, pgSize, newPgNo, oldPgNo, sorter);
		var viewState = document.getElementById('viewState').value;
		strUrl = strUrl + '&$viewState='+viewState;
		//if('MODIFIEDVIEW' === viewmode)
		//strUrl = strUrl+'&$select=' + "OLD";
		grid.loadGridData(strUrl, me.enableEntryButtons, null,
								false);
	},
	doHandleCellClick : function( view, td, cellIndex, record, tr, rowIndex, e, eOpts ) {
		var me = this;
			
			var clickedId = e.target.id ;
	
			 if( clickedId == 'retrieveDocument')
			{
				me.retrieveFileNetDocument(record);
			}		
	},
	retrieveFileNetDocument : function( record )
	{
		var me = this;		
		me.submitRequest( 'retrieveDocument', record );
	},
	submitRequest : function(str, record) {
		var me = this;
		form = document.createElement('FORM');
		form.name = 'frmMain';
		form.id = 'frmMain';
		form.method = 'POST';
		if (str == 'retrieveDocument') {
			strUrl = "retrieveEndClientFileNetDocument.srvc";
			form.appendChild(me.createFormField('INPUT', 'HIDDEN', 'objectId',
					record.get('objectId')));		
			}		
		form.appendChild(me.createFormField('INPUT', 'HIDDEN', csrfTokenName,
				csrfTokenValue));
		form.action = strUrl;
		document.body.appendChild(form);
		form.submit();
		document.body.removeChild(form);
	},
	createFormField : function(element, type, name, value) {
		var inputField;
		inputField = document.createElement(element);
		inputField.type = type;
		inputField.name = name;
		inputField.value = value;
		return inputField;  
	},
	getColumns : function(arrColsPref) {
		var me = this;
		var arrCols = new Array(), objCol = null, cfgCol = null;
	
		if (!Ext.isEmpty(arrColsPref)) {
			for (var i = 0; i < arrColsPref.length; i++) {
				objCol = arrColsPref[i];
				cfgCol = {};
				cfgCol.colHeader = objCol.colDesc;
				cfgCol.colId = objCol.colId;
				cfgCol.sortable = objCol.sortable;
				if (!Ext.isEmpty(objCol.colType)) {
					cfgCol.colType = objCol.colType;
					if (cfgCol.colType === "number")
						cfgCol.align = 'right';
				}
				cfgCol.fnColumnRenderer = me.columnRenderer;
				arrCols.push(cfgCol);
			}
		}
		return arrCols;
	},

	handleSmartGridLoading : function() {
		var me = this;

	var arrColsPref = [{
					"colId" : "entityTypeDesc",
					"colDesc" : getLabel('lblEntityType', 'Entity Type'),					
					"sortable":true
				},{
					"colId" : "contentTypeDesc",
					"colDesc" : getLabel('lblContenType', 'Content Type'),					
					"sortable":true
				}, {
					"colId" : "documentTypeDesc",
					"colDesc" : getLabel('lblDocumentType', 'Document Type'),					
					"sortable":true
				},{
					"colId" : "fileName",
					"colDesc" : getLabel('lblFileName', 'File Name'),				
					"sortable":true
				},{
					"colId" : "objectId",
					"colDesc" : getLabel('lblObjectId', 'Document Reference'),				
					"sortable":true
				}, {
					"colId" : "uploadedTimeStamp",
					"colDesc" : getLabel('uploadedTimestamp', 'Time Stamp'),					
					"sortable":true
				}];		
			
		
		var storeModel = {
			fields : ['identifier','entityType','enterpriseTypeId','contentTypeId','documentTypeId','infoTypeId','fileName','objectId','uploadedBy','uploadedTimeStamp', 'isDeleted', 
			          			'entityTypeDesc','enterpriseTypeDesc','infoTypeDesc','contentTypeDesc','documentTypeDesc','viewState'],
			proxyUrl : 'services/endClientDocumentMst.json',
			rootNode : 'd.documentList',
			totalRowsNode : 'd.__count'
		};
		
		arrCols = me.getColumns(arrColsPref);
		var pgSize = null;
		pgSize = 10;
		viewDocumentGrid = Ext.create('Ext.ux.gcp.SmartGrid', {
			itemId : 'gridViewMstId',
			pageSize : _GridSizeMaster,
			stateful : false,			
			hideRowNumbererColumn : true,
			showEmptyRow : false,	
			rowList : _AvailableGridSize,
			minHeight : 0,
			columnModel : arrCols,
			storeModel : storeModel,
			showCheckBoxColumn : false,
			enableColumnAutoWidth : true,
			enableColumnHeaderMenu:false,
			cls: 't7-grid'
			//isRowIconVisible : me.isRowIconVisible,
			
		
		});
		
		
		var viewDocumentDtl = me.getViewDocumentDtl();
		viewDocumentDtl.add(viewDocumentGrid);
		viewDocumentDtl.doLayout();
	},
	columnRenderer : function(value, meta, record, rowIndex, colIndex, store,
			view, colId) {		
		var strRetValue = "";
	if( colId === 'col_fileName' ){
			strRetValue = '<a class = "button_underline thePointer ux_font-size14-normal" href="#" id="retrieveDocument">' + value+'</a>';
			return strRetValue;
		}
		else{			
			return value;
		}
	},
	checkStoreCount : function(storeCount){
		if(storeCount == 0){
		$('#contentId4').addClass('hidden');
		}
		
	 }
});