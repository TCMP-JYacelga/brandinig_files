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
					hideRowNumbererColumn : true,
					minHeight : 150,
					height : 200,
					minWidth : 647,
					padding:'12 0 0 0',
					cls:'t7-grid',
					showPager : false,
					columnModel : colModel,
					enableColumnAutoWidth : _blnGridAutoColumnWidth,
					enableColumnHeaderMenu : false,
					storeModel : {
						fields : ['axsSequence', 'axsUser', 'axsMinreq','viewState',
								'identifier','axmTo'],
						proxyUrl : strUrl,
						rootNode : 'd.details',
						totalRowsNode : 'd.__count'
					},
					handleMoreMenuItemClick : function(view, rowIndex, cellIndex, menu,
							eventObj, record) {
						var totalCount = view.store.totalCount;
						var clickedRow = rowIndex+1;
						if( menu.itemId =='btnEdit' ){
							
							if (Ext.isEmpty(record.get('identifier')))
							 {
								showApproversPopup(
										document.getElementById('axmFromAuth').value,
										document.getElementById('axmToAuth').value,document.getElementById('totalLevelsAuth').value,
										record.get('axsUser'), record.get('axsMinreq'),
										record.get('axsSequence'), record
												.get('viewState'),'ADD',totalCount,clickedRow, record.get('axmTo'));
							}
							else
							{
								showApproversPopup(
										document.getElementById('axmFromAuth').value,
										document.getElementById('axmToAuth').value,document.getElementById('totalLevelsAuth').value,
										record.get('axsUser'), record.get('axsMinreq'),
										record.get('axsSequence'), record
												.get('viewState'),'EDIT',totalCount,clickedRow,record.get('axmTo'));								
							}
						}
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
						rowIndex, e, eOpts) {/*
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
				*/});

		this.items = [slabListView];
		this.callParent(arguments);
	},

	getColumns : function() {
		var me = this;
		var arrCols = new Array(), objCol = null, cfgCol = null;
		var arrColsPref = [ {
					"colId" : "axsSequence",
					"colDesc" : getLabel('level', 'Level'),
					"colType" : "number",
					"sortable" : false,
					"menuDisabled": false,
					"resizable": false
				}, {
					"colId" : "axsMinreq",
					"colDesc" : getLabel('approvers#', 'Number of Approvers'),
					"colType" : "number",
					"sortable" : false,
					"menuDisabled": false,
					"resizable": false
				}, {
					"colId" : "axsUser",
					"colDesc" : getLabel('approvers', 'Approvers'),
					"sortable" : false,
					"menuDisabled": false,
					"resizable": false
				}, {
					"colId" : "status",
					"colDesc" : getLabel('status', 'Status'),
					"sortable" : false,
					"menuDisabled": false,
					"resizable": false
				}];
		arrCols.push(me.createActionColumn())
		if (!Ext.isEmpty(arrColsPref)) {
			for (var i = 0; i < arrColsPref.length; i++) {
				objCol = arrColsPref[i];
				cfgCol = {};
				cfgCol.colHeader = objCol.colDesc;
				cfgCol.colId = objCol.colId;
				cfgCol.sortable = objCol.sortable;
				cfgCol.resizable = objCol.resizable;
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
						itemId : 'btnEdit',
						itemCls : 'grid-row-action-icon icon-edit',
						toolTip : getLabel('editToolTip', 'Edit Approver'),
						itemLabel : getLabel('editToolTip', 'Edit Approver'),
						text : getLabel('editToolTip', 'Edit Approver')
					}
				 ]
			};							
		return objActionCol;
	},

	columnRenderer : function(value, meta, record, rowIndex, colIndex, store,
			view, colId) {
		var strRetValue = "";
		var strTitleRetValue = "";
		if (colId == 'col_status') {
			if (!record.get('isEmpty')) {
				if (Ext.isEmpty(record.get('axsUser'))) {
					strRetValue = '<span class="black">'+getLabel('Incomplete', 'Incomplete')+'</span>';
					strTitleRetValue = getLabel('Incomplete', 'Incomplete');
				} else {
					strRetValue = getLabel('OK', 'OK');
					strTitleRetValue = getLabel('OK', 'OK');
				}
			} else {
				strRetValue = '<span class="black">'+getLabel('Incomplete', 'Incomplete')+'</span>';
				strTitleRetValue = getLabel('Incomplete', 'Incomplete');
			}
		} else if (colId == 'col_actions') {
			if (!record.get('isEmpty')) {
				if (Ext.isEmpty(record.get('identifier'))) {
					strRetValue = '<span class="grey addLink cursor_pointer t7-anchor">Add Approvers</span>';
					strTitleRetValue = 'Add Approvers';
				} else {
					strRetValue = '<span class="grey editLink cursor_pointer t7-anchor">Edit Approvers</span>';
					strTitleRetValue = 'Edit Approvers';
				}
			} else {
				strRetValue = '<span class="grey addLink cursor_pointer t7-anchor">Add Approvers</span>';
				strTitleRetValue = 'Add Approvers';
			}
		} else {
			strRetValue = value;
			strTitleRetValue = strRetValue;
		}
		meta.tdAttr = 'title="' + strTitleRetValue + '"';
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
		
		grid.on('cellclick', function(view, td, cellIndex, record, tr, rowIndex, e) {
			var clickedColumn = view.getGridColumns()[cellIndex];
			var columnType = clickedColumn.colType;
			if(Ext.isEmpty(columnType)) {
				var containsCheckboxCss = (clickedColumn.cls.indexOf('x-column-header-checkbox') > -1)
				columnType = containsCheckboxCss ? 'checkboxColumn' : '';
			}
			me.handleGridRowClick(view,record, grid, columnType, rowIndex);
		});
	},
	handleGridRowClick : function(view, record, grid, columnType, rowIndex) {
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
				me.doHandleRowActions(view, arrVisibleActions[0].itemId, grid, record,rowIndex);
			}
		} else {
		}
	},
	doHandleRowActions : function(view, actionName, objGrid, record,rowIndex) {
		var me = this;
		/*var groupView = me.getGroupView();
		var grid = groupView.getGrid();*/
		var totalCount = view.store.totalCount;
		var clickedRow = rowIndex+1;
		if (Ext.isEmpty(record.get('identifier')))
		 {
			showApproversPopup(
					document.getElementById('axmFromAuth').value,
					document.getElementById('axmToAuth').value,document.getElementById('totalLevelsAuth').value,
					record.get('axsUser'), record.get('axsMinreq'),
					record.get('axsSequence'), record
							.get('viewState'),'ADD',totalCount,clickedRow,record.get('axmTo'));
		}
		else
		{
			showApproversPopup(
					document.getElementById('axmFromAuth').value,
					document.getElementById('axmToAuth').value,document.getElementById('totalLevelsAuth').value,
					record.get('axsUser'), record.get('axsMinreq'),
					record.get('axsSequence'), record
							.get('viewState'),'EDIT',totalCount,clickedRow,record.get('axmTo'));								
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
