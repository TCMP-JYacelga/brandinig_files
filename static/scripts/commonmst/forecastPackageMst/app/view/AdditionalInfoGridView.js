Ext.define('GCP.view.AdditionalInfoGridView', {
	extend : 'Ext.panel.Panel',
	itemId : 'additionalInfoGridView',
	requires : ['Ext.ux.gcp.SmartGrid', 'Ext.ux.gcp.GroupView',
			'Ext.data.Store'],
	initComponent : function() {
		var me = this;
		var groupView = me.createGroupView();
		me.items = [groupView];
		me.callParent(arguments);
		this.title = me.title;
		$(document).on('OnSaveRestoreGrid', function() {
					me.refreshGridData(me);
				});
	},
	createGroupView : function() {
		var me = this, groupView = null;
		var objGroupByPref = {}
		var objGeneralSetting = {}, objGridSetting = {}, arrColumnSetting;
		var colModel = me.getColumns();
		groupView = Ext.create('Ext.ux.gcp.GroupView', {
			cfgGroupByUrl : 'static/scripts/commonmst/forecastPackageMst/data/groupBy.json',
			cfgParentCt : me,
			cls : 't7-grid',
			cfgShowFilter : false,
			cfgShowFilterInfo : false,
			cfgGroupingDisabled : true,
			cfgShowAdvancedFilterLink : false,
			cfgShowRefreshLink : false,
			cfgSmartGridSetting : false,
			cfgAutoGroupingDisabled : true,
			cfgGroupCode : objGeneralSetting.defaultGroupByCode || null,
			cfgCaptureColumnSettingAt : 'G',
			cfgPrefferedColumnModel : arrColumnSetting,
			cfgGridModel : {
				pageSize : objGridSetting.defaultRowPerPage || _GridSizeMaster,
				rowList : _AvailableGridSize,
				stateful : false,
				showSorterToolbar : _charEnableMultiSort,
				heightOption : objGridSetting.defaultGridSize,
				columnHeaderFilterCfg : {},
				showEmptyRow : false,
				showPager : true,
				minHeight : 100,
				checkBoxColumnWidth : _GridCheckBoxWidth,
				hideRowNumbererColumn : true,
				enableColumnHeaderFilter : false,
				enableColumnAutoWidth : _blnGridAutoColumnWidth,
				showPagerRefreshLink : false,
				showCheckBoxColumn : false,
				storeModel : {
					fields : ['enrichNmbr', 'enrichLabelDescription', 'mandatoryFlag','identifier',
							  'enrichDataType','enrichMaxLength','enrichFormat','viewState'],
					proxyUrl : 'services/cffEnrichmentsList.json',
					rootNode : 'd.profileDetails',
					totalRowsNode : 'd.__count'
				},
				defaultColumnModel : colModel,
				fnRowIconVisibilityHandler : me.isRowIconVisible,
				fnColumnRenderer : me.columnRenderer

			},
			listeners : {
				'groupTabChange' : me.doHandleGroupTabChange,
				'gridRender' : me.doHandleLoadGridData,
				'gridPageChange' : me.doHandleLoadGridData,
				'gridSortChange' : me.doHandleLoadGridData,
				'gridPageSizeChange' : me.doHandleLoadGridData,
				'gridColumnFilterChange' : me.doHandleLoadGridData,
				'gridRowActionClick' : function(grid, rowIndex, columnIndex,
						actionName, record) {
					me.handleRowIconClick(grid, rowIndex, columnIndex,
							actionName, record);
				},
				'afterrender' : function(ct) {
					var objCt = ct
							.down('container[itemId="navigationContainer"]');
					if (objCt) {
						objCt.insert(0, {
									xtype : 'container',
									id : 'emptyCt',
									padding : '0 0 0 20',
									listeners : {
										'render' : function() {
											$('#btnAddAdditionalInfo')
													.appendTo($('#emptyCt'));

										}
									}
								});
					}
				},
				'toggleGridPager' : function(grid, pager, blnShowPager) {
					grid.showPagerForced = blnShowPager;
					pager.showPagerForced = blnShowPager;
				}
			}
		});
		return groupView;
	},
	getColumns : function() {
		var me = this;
		var arrCols = new Array(), objCol = null, cfgCol = null;
		var arrColsPref = [ {
							"colId" : "enrichLabelDescription",
							"colDesc" : getLabel('enrichmentLabel',"Enrichment Label"),
							"sort" : true
						},{
							"colId" : "enrichNmbr",
							"colDesc" : getLabel("lblSequece","Sequence"),
							"colType" : "number",
							"sort" : true
						}, {
							"colId" : "enrichDataType",
							"colDesc" : getLabel('lblDataType',"Data Type"),
							"sort" : true
						},{
							"colId" : "enrichMaxLength",
							"colDesc" : getLabel("lblEnrichLength","Max Size"),
							"colType" : "number",
							"sort" : true
						},  {
							"colId" : "enrichFormat",
							"colDesc" : getLabel("enrichmentFormat","Format"),
							"sort" : true
						}, {
							"colId" : "mandatoryFlag",
							"colDesc" : getLabel('lblMandatory',"Mandatory"),
							"sort" : true
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

				cfgCol.width = 135;
				cfgCol.fnColumnRenderer = me.columnRenderer;
				arrCols.push(cfgCol);

			}
		}
		return arrCols;
	},
	columnRenderer : function(value, meta, record, rowIndex, colIndex, store,
			view, colId) {
		var strRetValue = "";
			strRetValue = isEmpty(value) ? "" : value;
		if (colId == 'col_mandatoryFlag') {
			strRetValue =  value == 'Y' ? 'Yes' : 'No';
		}
		if (colId == 'col_enrichDataType') {
			switch(value)
			{
			case 'S': strRetValue = "Text";
			break;
			case 'A': strRetValue = "Amount";
			break;
			case 'D': strRetValue = "Date";
			break;
			case 'N': strRetValue = "Number";
			break;
			default: strRetValue = getLabel('enrichmentDataType.' + value, value);
			}
			
		}
		return strRetValue;
	},
	createActionColumn : function() {
		var objActionCol = {
			colType : 'actioncontent',
			colId : 'actioncontent',
			colHeader : 'Actions',
			visibleRowActionCount : 1,
			width : 108,
			locked : true,
			lockable : false,
			sortable : false,
			hideable : false,
			resizable : false,
			draggable : false,
			items : (mode === 'VIEW' || mode === 'VERIFY') ? [{
						itemId : 'btnView',
						itemCls : 'grid-row-action-icon icon-edit',
						toolTip : 'Edit Rule',
						text : 'View Record'
					}] : [{
						itemId : 'btnEdit',
						itemCls : 'grid-row-action-icon icon-edit',
						toolTip : 'Edit Rule',
						text : 'Modify Record'
					}, {
						itemId : 'btnView',
						itemCls : 'grid-row-action-icon icon-edit',
						toolTip : 'Edit Rule',
						text : 'View Record'
					}, {
						itemId : 'btnDiscard',
						itemCls : 'grid-row-action-icon icon-edit',
						toolTip : 'Edit Rule',
						text : 'Discard'

					}

			]
		};
		return objActionCol;
	},
	doHandleLoadGridData : function(groupInfo, subGroupInfo, grid, url, pgSize,
			newPgNo, oldPgNo, sorter, filterData) {
		var me = this;
		var strUrl = grid.generateUrl(url, pgSize, newPgNo, oldPgNo, sorter);
		strUrl = strUrl + '&$parentId='
				+ encodeURIComponent($('#viewState').val());
		grid.loadGridData(strUrl, null, null, false);

	},
	doHandleGroupTabChange : function(groupInfo, subGroupInfo, tabPanel,
			newCard, oldCard) {
		var me = this;
		me.up('panel[itemId="additionalInfoGridView"]')
				.postHandleDoHandleGroupTabChange();
	},
	postHandleDoHandleGroupTabChange : function(data, args) {
		var me = this;
		var objGroupView = me.down('groupView');
		var objPref = null, gridModel = null, intPgSize = null, heightOption = null;
		var colModel = null, arrCols = null;
		colModel = me.getColumns();
		heightOption = null;
		if (colModel) {
			gridModel = {
				columnModel : colModel,
				handleMoreMenuItemClick : function(view, rowIndex, cellIndex,
						menu, eventObj, record) {
					if (menu.itemId == 'btnView') {
						viewEnrichDetail(record);
					} else if (menu.itemId == 'btnEdit') {
						editEnrichDetail(record);
					} else if (menu.itemId == 'btnDiscard') {
						discardEnrichDetail(record.get('identifier'));
					}
				},
				//showPagerForced : showPager,
				heightOption : heightOption,
				storeModel : {
					fields : ['enrichNmbr', 'enrichLabelDescription', 'mandatoryFlag','identifier',
							  'enrichDataType','enrichMaxLength','enrichFormat', 'viewState'],
					proxyUrl : 'services/cffEnrichmentsList.json',
					rootNode : 'd.profileDetails',
					totalRowsNode : 'd.__count'
				}
			};
		}

		objGroupView.reconfigureGrid(gridModel);
	},
	handleRowIconClick : function(tableView, rowIndex, columnIndex, menu,
			record) {
		if (menu == 'btnView') {
			viewEnrichDetail(record);
		} else if (menu == 'btnEdit') {
			editEnrichDetail(record);
		} else if (menu == 'btnDiscard') {
			discardEnrichDetail(record.get('identifier'));
		}
	},
	refreshGridData : function(me) {
		me.down('smartgrid').refreshData();
	}
});
