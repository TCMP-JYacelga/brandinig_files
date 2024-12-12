Ext.define('GCP.view.SlabLevelGridReadOnlyView', {
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
							padding : '5 0 0 0',
							minHeight : 150,
							height : 200,
							showPager : false,
							columnModel : colModel,
							storeModel : {
								fields : ['axsSequence','axsUser','axsMinreq','identifier' ],
								proxyUrl : strUrl,
								rootNode : 'd.details',
								totalRowsNode : 'd.__count'
							},
							listeners : {
								render : function(grid) {
									me.handleLoadGridData(grid,
											grid.store.dataUrl, grid.pageSize,
											1, 1, null);
								},
								gridPageChange : me.handleLoadGridData,
								gridSortChange : me.handleLoadGridData,
								gridRowSelectionChange : function(grid, record,
										recordIndex, records, jsonData) {
								}
							}

						});
								
			adminListView.on('cellclick', function(view, td, cellIndex, record,
						tr, rowIndex, e, eOpts) {
				var totalCount = view.store.totalCount;
				var clickedRow = rowIndex+1;
					var linkClicked = (e.target.tagName == 'SPAN');
					if (linkClicked) {
							showApproversPopup(axmFrom,axmTo,
									$("#totalLevelsAuth").val(),record.get('axsUser'),record.get('axsMinreq'),record.get('axsSequence'),record.get('identifier'),'VIEW',totalCount,clickedRow);
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
				},{
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
			if (colId == 'col_status')
			{
				if (!record.get('isEmpty')) {
					if (Ext.isEmpty(record.get('axsUser')))
					{
						strRetValue = '<span class="red">Incomplete</span>';
					}
					else
					{
						strRetValue = 'Ok';
					}
				}
				else
				{
					strRetValue = '<span class="red">Incomplete</span>';
				}
			}
			else if (colId == 'col_actions')
			{
				if (!record.get('isEmpty')) {
					strRetValue = '<span class="grey smallfont addLink cursor_pointer">View Approvers</span>';
				}
			}
			else
			{
				strRetValue = value;
			}
			
		return strRetValue;
	},
			
			handleLoadGridData : function(grid, url, pgSize, newPgNo, oldPgNo,
					sorter) {
				var me = this;
				var strUrl = grid.generateUrl(url, pgSize, newPgNo, oldPgNo,
						sorter);
				axmFrom = $("#axmFromAuth").val();
				axmTo = $("#axmToAuth").val();
				strUrl = strUrl + "&$filter="+encodeURIComponent(matrixId);
				strUrl = strUrl + "&$from="+axmFrom;
				strUrl = strUrl + "&$to="+axmTo;
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
