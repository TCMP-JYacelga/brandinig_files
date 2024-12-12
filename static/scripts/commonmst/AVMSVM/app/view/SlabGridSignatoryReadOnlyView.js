Ext.define('GCP.view.SlabGridSignatoryReadOnlyView', {
	extend : 'Ext.panel.Panel',
	requires : ['Ext.ux.gcp.SmartGrid', 'Ext.data.Store'],

	initComponent : function() {
		var me = this;
		this.title = me.title;
		var strUrl = 'services/authMatrix/authMatrixDetailList.json';
		var colModel = me.getColumns();
		adminListView = Ext.create('Ext.ux.gcp.SmartGrid', {
					stateful : false,
					showEmptyRow : false,
					showCheckBoxColumn : false,
					padding : '5 10 10 10',
					minHeight : 150,
					height : 200,
					showPager : false,
					columnModel : colModel,
					storeModel : {
						fields : ['axmFrom', 'axmTo', 'axmRule', 'identifier'],
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
					}
				});
				adminListView.on('cellclick', function(view, td, cellIndex, record, tr,
						rowIndex, e, eOpts) {
					var linkClicked = (e.target.tagName == 'SPAN');
					if (linkClicked) {
						var className = e.target.className;
						
						if (!Ext.isEmpty(className)
								&& className.indexOf('viewLink') !== -1) {
							showSVMDetailViewPopup(
                                    record
                                    .get('axmFrom'),
                                    record.get('axmTo'),
                                    record
                                    .get('axsUser'),
                                    record
                                    .get('axmRule'),
                                    record
                                    .get('viewState'),
                                    'EDIT');
						}
					}
				});

		this.items = [adminListView];
		this.callParent(arguments);
	},

	getColumns : function() {
		var me = this;
		var arrCols = new Array(), objCol = null, cfgCol = null;
		var arrColsPref = [{
					"colId" : "actions",
					"colDesc" : ""
				}, {
					"colId" : "axmFrom",
					"colDesc" : "Limit From",
					"colType" : "number"
				}, {
					"colId" : "axmTo",
					"colDesc" : "Limit To",
					"colType" : "number"
				}, {
					"colId" : "axmRule",
					"colDesc" : "Matrix Rule"
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
				if (!Ext.isEmpty(record.get('axmRule'))
						&& record.get('axmRule') == '-') {
					strRetValue ='<span class="red">Incomplete</span>';
				} else {
					strRetValue = 'Ok';
				}
			} else {
				strRetValue = '<span class="red">Incomplete</span>';
			}
		} else if (colId == 'col_actions') {
			if (!record.get('isEmpty')) {
					strRetValue = '<span class="grey viewLink cursor_pointer">View Tier</span>';
				}
		} else if (colId == 'col_axmRule') {
			if (!record.get('isEmpty')) {
				if (!Ext.isEmpty(record.get('axmRule'))) {
					var rule = record.get('axmRule');
					var splitRule = rule.split(",");
					strRetValue = ShowRuleDesc(splitRule);
				}
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
		grid.loadGridData(strUrl, me.enableEntryButtons, null, false);
	},
	enableEntryButtons:function(){
		slabGridLoaded=true;
		enableDisableGridButtons(false);
	}
});
