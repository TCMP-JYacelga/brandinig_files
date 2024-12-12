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
							hideRowNumbererColumn : true,
				            cls:'t7-grid',
				            padding:'12 0 0 0',
							minHeight : 150,
							height : 200,
							showPager : false,
							columnModel : colModel,
							enableColumnAutoWidth : _blnGridAutoColumnWidth,
							enableColumnHeaderMenu : false,
							handleMoreMenuItemClick : function(view, rowIndex, cellIndex, menu,
									eventObj, record) {
								var totalCount = view.store.totalCount;
								var clickedRow = rowIndex+1;
								if( menu.itemId =='btnView' ){
									showApproversPopup(axmFrom,axmTo,
											$("#totalLevelsAuth").val(),record.get('axsUser'),record.get('axsMinreq'),record.get('axsSequence'),record.get('viewState'),'VIEW',totalCount,clickedRow,null);
								}
							},							
							storeModel : {
								fields : ['axsSequence','axsUser','axsMinreq','identifier','viewState','axmCcySymbol' ],
								proxyUrl : strUrl,
								rootNode : 'd.details',
								totalRowsNode : 'd.__count'
							},
							listeners : {
								render : function(grid) {
									me.handleLoadGridData(grid,
											grid.store.dataUrl, grid.pageSize,
											1, 1, null);
									$("#tab-2").hide();
								},
								gridPageChange : me.handleLoadGridData,
								gridSortChange : me.handleLoadGridData,
								gridRowSelectionChange : function(grid, record,
										recordIndex, records, jsonData) {
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
					"colId" : "axsSequence",
					"colDesc" :getLabel('level', 'Level'),
					"colType" : "number",
					"sortable" : false,
					"menuDisabled": false
				}, {
					"colId" : "axsMinreq",
					"colDesc" : getLabel('approvers#', 'Number of Approvers'),
					"colType" : "number",
					"sortable" : false,
					"menuDisabled": false
				}, {
					"colId" : "axsUser",
					"colDesc" :  getLabel('approvers', 'Approvers'),
					"sortable" : false,
					"menuDisabled": false
				}, {
					"colId" : "status",
					"colDesc" : getLabel('status', 'Status'),
					"sortable" : false,
					"menuDisabled": false
				}];				
				arrCols.push(me.createActionColumn())
		if (!Ext.isEmpty(arrColsPref)) {
			for (var i = 0; i < arrColsPref.length; i++) {
				objCol = arrColsPref[i];
				cfgCol = {};
				cfgCol.colHeader = objCol.colDesc;
				cfgCol.colId = objCol.colId;
				cfgCol.sortable = objCol.sortable;
				cfgCol.menuDisabled = objCol.menuDisabled;
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
	
	createActionColumn : function()
	{
			var objActionCol =
			{
				colType : 'actioncontent',
				colId : 'actioncontent',
				colHeader : getLabel('action', 'Actions'),
				visibleRowActionCount : 1,
				width : 130,
				locked : true,
				lockable : false,
				sortable : false,
				hideable : false,
				resizable : false,
				draggable : false,
				items :
				[
				 	{
						itemId : 'btnView',
						itemCls : 'grid-row-action-icon icon-view',
						toolTip : getLabel('viewToolTip', 'View Approver'),
						text : getLabel('viewToolTip', 'View Approver')
					}
				 ]
			};							
		return objActionCol;
	},

			columnRenderer : function(value, meta, record, rowIndex, colIndex, store,
			view, colId) {
			var strRetValue = "";
			var strToolTipValue = "";
			if (colId == 'col_status')
			{
				if (!record.get('isEmpty')) {
					if (Ext.isEmpty(record.get('axsUser')))
					{
						strRetValue = '<span class="black">'+getLabel('Incomplete', 'Incomplete')+'</span>';
						strToolTipValue = getLabel('Incomplete', 'Incomplete');
					}
					else
					{
						strRetValue =getLabel('OK', 'OK');
						strToolTipValue = getLabel('OK', 'OK');
					}
				}
				else
				{
					strRetValue = '<span class="black">'+getLabel('Incomplete', 'Incomplete')+'</span>';
					strToolTipValue = getLabel('Incomplete', 'Incomplete');
				}
			}
			else if (colId == 'col_actions')
			{
				if (!record.get('isEmpty')) {
					strRetValue = '<span class="grey smallfont addLink cursor_pointer t7-anchor">View Approvers</span>';
					strToolTipValue = 'View Approvers';
				}
			}
			else if (colId == 'col_axmFrom' && record.get('axmFrom') != '' && record.get('axmFrom') != '-')
			{
				strRetValue =  $('#axmCcySymbol').val() + ' ' + value;
				strToolTipValue = strRetValue;
			} 
			else if (colId == 'col_axmTo' && record.get('col_axmTo') != '' && record.get('axmFrom') != '-')
			{
				strRetValue =  $('#axmCcySymbol').val() + ' ' + value;
				strToolTipValue = strRetValue;
			}
			else
			{
				strRetValue = value;
				strToolTipValue = value;
			}
			
			meta.tdAttr = 'title="' + strToolTipValue + '"';
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
				
				grid.on('cellclick', function(tableView, td, cellIndex, record, tr, rowIndex, e) {
					var clickedColumn = tableView.getGridColumns()[cellIndex];
					var columnType = clickedColumn.colType;
					if(Ext.isEmpty(columnType)) {
						var containsCheckboxCss = (clickedColumn.cls.indexOf('x-column-header-checkbox') > -1)
						columnType = containsCheckboxCss ? 'checkboxColumn' : '';
					}
					me.handleGridRowClick(record, grid, columnType, rowIndex);
				});
			},
			handleGridRowClick : function(record, grid, columnType, rowIndex ) {
				if(columnType !== 'actioncontent' && columnType !== 'checkboxColumn') {
					var me = this;
					var columnModel = null;
					var columnAction = null;
					if (!Ext.isEmpty(grid.columnModel)) {
						columnModel = grid.columnModel;
						for (var index = 0; index < columnModel.length; index++) {
							if (columnModel[index].colId == 'actioncontent') {
								columnAction = columnModel[index].items;
								break;
							}
						}
					}
					var arrVisibleActions = [];
					var arrAvailableActions = [];
					if (!Ext.isEmpty(columnAction))
						arrAvailableActions = columnAction;
					var store = grid.getStore();
					var jsonData = store.proxy.reader.jsonData;
					if (!Ext.isEmpty(arrAvailableActions)) {
						for (var count = 0; count < arrAvailableActions.length; count++) {
							var btnIsEnabled = false;
							if (!Ext.isEmpty(grid) && !Ext.isEmpty(grid.isRowIconVisible)) {
								btnIsEnabled = grid.isRowIconVisible(store, record,
										jsonData, arrAvailableActions[count].itemId,
										arrAvailableActions[count].maskPosition);
								if (btnIsEnabled == true) {
									arrVisibleActions.push(arrAvailableActions[count]);
									btnIsEnabled = false;
								}
							}
						}
					}
					if (!Ext.isEmpty(arrVisibleActions)) {
						
						var totalCount = grid.store.totalCount;
						var clickedRow = rowIndex+1;
						showApproversPopup(axmFrom,axmTo,
							$("#totalLevelsAuth").val(),record.get('axsUser'),record.get('axsMinreq'),record.get('axsSequence'),record.get('viewState'),'VIEW',totalCount,clickedRow,null);						
					}
				} else {
				}
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
