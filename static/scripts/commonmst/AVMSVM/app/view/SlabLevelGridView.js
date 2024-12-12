Ext.define('GCP.view.SlabLevelGridView', {
	extend : 'Ext.panel.Panel',
	requires : ['Ext.ux.gcp.SmartGrid', 'Ext.data.Store'],
	closeAction : 'destroy',
	initComponent : function() {
		var me = this;
		this.title = me.title;
		var strUrl = 'services/authMatrix/authMatrixDetailList.json';
		var colModel = me.getColumns();
		slabListView = Ext.create('Ext.ux.gcp.SmartGrid', {
					stateful : false,
					showEmptyRow : false,
					showCheckBoxColumn : false,
					padding : '5 0 0 0',
					minHeight : 150,
					height : 200,
					minWidth : 647,
					width : 647,
					showPager : false,
					columnModel : colModel,
					storeModel : {
						fields : ['axsSequence', 'axsUser', 'axsMinreq','viewState',
								'identifier'],
						proxyUrl : strUrl,
						rootNode : 'd.details',
						totalRowsNode : 'd.__count'
					},
					listeners : {
						render : function(grid) {
							me.handleLoadGridData(grid, grid.store.dataUrl,
									grid.pageSize, 1, 1, null);
						},
						gridPageChange : me.handleLoadGridData,
						gridSortChange : me.handleLoadGridData,
						gridRowSelectionChange : function(grid, record,
								recordIndex, records, jsonData) {
						}
					},
					checkBoxColumnRenderer : function(value, metaData, record,
							rowIndex, colIndex, store, view) {

					}

				});

		slabListView.on('cellclick', function(view, td, cellIndex, record, tr,
						rowIndex, e, eOpts) {
						var totalCount = view.store.totalCount;
						var clickedRow = rowIndex+1;
					var linkClicked = (e.target.tagName == 'SPAN');
					if (linkClicked) {
						var className = e.target.className;
						if (!Ext.isEmpty(className)
								&& className
										.indexOf('addLink') !== -1) {
							showApproversPopup(
									document.getElementById('axmFromAuth').value,
									document.getElementById('axmToAuth').value,document.getElementById('totalLevelsAuth').value,
									record.get('axsUser'), record.get('axsMinreq'),
									record.get('axsSequence'), record
											.get('viewState'),'ADD',totalCount,clickedRow);
						}
						if (!Ext.isEmpty(className)
								&& className
										.indexOf('editLink') !== -1) {
							showApproversPopup(
									document.getElementById('axmFromAuth').value,
									document.getElementById('axmToAuth').value,document.getElementById('totalLevelsAuth').value,
									record.get('axsUser'), record.get('axsMinreq'),
									record.get('axsSequence'), record
											.get('viewState'),'EDIT',totalCount,clickedRow);
						}	
						
					}
				});

		this.items = [slabListView];
		this.callParent(arguments);
	},

	getColumns : function() {
		var me = this;
		var arrCols = new Array(), objCol = null, cfgCol = null;
		var arrColsPref = [{
					"colId" : "actions",
					"colDesc" : ""
				}, {
					"colId" : "axsSequence",
					"colDesc" : "Level",
					"colType" : "number"
				}, {
					"colId" : "axsMinreq",
					"colDesc" : "No. of Approvers",
					"colType" : "number"
				}, {
					"colId" : "axsUser",
					"colDesc" : "Approvers"
				}, {
					"colId" : "status",
					"colDesc" : "Status"
				}];
		if (!Ext.isEmpty(arrColsPref)) {
			for (var i = 0; i < arrColsPref.length; i++) {
				objCol = arrColsPref[i];
				cfgCol = {};
				cfgCol.colHeader = objCol.colDesc;
				cfgCol.colId = objCol.colId;
				if (!Ext.isEmpty(objCol.colType)) {
					cfgCol.colType = objCol.colType;
					if (cfgCol.colType === "number")
						cfgCol.align = 'right';
				}

				cfgCol.width = 120;
				cfgCol.fnColumnRenderer = me.columnRenderer;
				arrCols.push(cfgCol);

			}
		}
		return arrCols;
	},

	columnRenderer : function(value, meta, record, rowIndex, colIndex, store,
			view, colId) {
		var strRetValue = "";
		if (colId == 'col_status') {
			if (!record.get('isEmpty')) {
				if (Ext.isEmpty(record.get('axsUser'))) {
					strRetValue = '<span class="red">Incomplete</span>';
				} else {
					strRetValue = 'Ok';
				}
			} else {
				strRetValue = '<span class="red">Incomplete</span>';
			}
		} else if (colId == 'col_actions') {
			if (!record.get('isEmpty')) {
				if (Ext.isEmpty(record.get('identifier'))) {
					strRetValue = '<span class="grey addLink cursor_pointer">Add Approvers</span>';
				} else {
					strRetValue = '<span class="grey editLink cursor_pointer">Edit Approvers</span>';
				}
			} else {
				strRetValue = '<span class="grey addLink cursor_pointer">Add Approvers</span>';
			}
		} else {
			strRetValue = value;
		}

		return strRetValue;
	},

	handleLoadGridData : function(grid, url, pgSize, newPgNo, oldPgNo, sorter) {
		var me = this;
		var strUrl = grid.generateUrl(url, pgSize, newPgNo, oldPgNo, sorter);
		strUrl = strUrl + "&$filter=" + encodeURIComponent(matrixId);
		  var from = document.getElementById('axmFromAuth').value;
		     from.concat(".01");
		strUrl = strUrl + "&$from=" + from;
		strUrl = strUrl + "&$to=" + document.getElementById('axmToAuth').value;
		grid.loadGridData(strUrl, null, null, false);
	},
	createFormField : function(element, type, name, value) {
		var inputField;
		inputField = document.createElement(element);
		inputField.type = type;
		inputField.name = name;
		inputField.value = value;
		return inputField;
	}
});
