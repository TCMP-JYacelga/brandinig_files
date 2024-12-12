Ext.define('GCP.view.ReconRuleGridView', {
	extend : 'Ext.panel.Panel',
	itemId : 'reconRuleGridView',
	requires : ['Ext.ux.gcp.SmartGrid', 'Ext.ux.gcp.GroupView',
			'Ext.data.Store', 'GCP.view.ReconRuleFilterView'],
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
			cfgGroupByUrl : 'static/scripts/fsc/ReconRule/data/groupBy.json',
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
				storeModel : {
					fields : ['receiptEnrichFieldName', 'receiptTrFieldName',
							'matchType', 'invoiceField', 'invEnrichFieldName',
							'invTrFieldName', 'pm', 'fixedValue', 'factor',
							'operator', 'receiptField', 'identifier',
							'viewState'],
					proxyUrl : 'services/reconRuleDetailList.json',
					rootNode : 'd.detailList',
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
											$('#btnAddRuleDetail')
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
		var arrColsPref = [{
					"colId" : "matchType",
					"colDesc" : getLabel('recon.matchtype', 'Match Type'),
					"sortable" : false,
					"menuDisabled" : false
				}, {
					"colId" : "invoiceField",
					"colDesc" : getLabel('recon.invoicefield', 'Invoice Field'),
					"sortable" : false,
					"menuDisabled" : false
				}, {
					"colId" : "invTrFieldName",
					"colDesc" : getLabel('recon.fieldname', 'Field Name'),
					"sortable" : false,
					"menuDisabled" : false
				}, {
					"colId" : "operator",
					"colDesc" : getLabel('recon.operator', 'Operator'),
					"sortable" : false,
					"menuDisabled" : false
				}, {
					"colId" : "receiptField",
					"colDesc" : getLabel('recon.receiptfield', 'Receipt Field'),
					"sortable" : false,
					"menuDisabled" : false
				}, {
					"colId" : "receiptTrFieldName",
					"colDesc" : getLabel('recon.fieldname', 'Field Name'),
					"sortable" : false,
					"menuDisabled" : false
				}, {
					"colId" : "pm",
					"colDesc" : getLabel('recon.tolerance', 'Tolerance'),
					"sortable" : false,
					"menuDisabled" : false
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
	columnRenderer : function(value, meta, record, rowIndex, colIndex, store,
			view, colId) {
		var strRetValue = "";
		var matchingval = '<span class="black">'
				+ getLabel('recon.matchtype.matching', 'MATCHING') + '</span>';
		var nearmatchingval = '<span class="black">'
				+ getLabel('recon.matchtype.nearmatching', 'NEAR MATCHING')
				+ '</span>';
		var transcationval = '<span class="black">'
				+ getLabel('recon.invoicefield.transaction', 'TRANSACTION')
				+ '</span>';
		var enrichmentsval = '<span class="black">'
				+ getLabel('recon.invoicefield.enrichments', 'ENRICHMENTS')
				+ '</span>';
		var operatorval = '<span class="black">'
				+ getLabel('recon.fixedvalue', 'FIXED_VALUE') + '</span>';

		if (colId === 'col_matchType') {
			strRetValue = !isEmpty(record.get('matchType'))
					&& record.get('matchType') === 'M'
					? matchingval
					: nearmatchingval;

		} else if (colId === 'col_invoiceField' || colId == 'col_receiptField') {
			strRetValue = !isEmpty(record.get('invoiceField'))
					&& record.get('invoiceField') === 'T'
					? transcationval
					: enrichmentsval;
		} else if (colId === 'col_pm') {
			var strPmValue = !isEmpty(record.get('pm')) ? record.get('pm') : "";
			var strFactorValue = !isEmpty(record.get('factor')) ? record
					.get('factor') : "";
			var strFixedValue = !isEmpty(record.get('fixedValue')) ? record
					.get('fixedValue') : "";
			strRetValue = strPmValue
					+ (!isEmpty(strFactorValue) || !isEmpty(strFixedValue)
							? " " + strFixedValue + " " + strFactorValue + "%"
							: "");
		} else if (colId === 'col_operator') {
			strRetValue = !isEmpty(record.get('operator'))
					&& record.get('operator') === 'F' ? operatorval : value;
		}else if (colId === 'col_invTrFieldName') {
			strRetValue = !isEmpty(record.get('invoiceField'))
					&& record.get('invoiceField') === 'T'
					? getLabel(record.get('invTrFieldName'),record.get('invTrFieldName'))
				    : getLabel(record.get('invEnrichFieldName'),record.get('invEnrichFieldName'));		
		}
		else if (colId === 'col_receiptTrFieldName') {
			strRetValue = getLabel(record.get('receiptTrFieldName'),record.get('receiptTrFieldName'));
		}
		else {
			strRetValue = isEmpty(value) ? "" : value;
		}

		return strRetValue;
	},
	createActionColumn : function() {
		var objActionCol = {
			colType : 'actioncontent',
			colId : 'actioncontent',
			colHeader : getLabel('actions','Actions'),
			visibleRowActionCount : 1,
			width : 108,
			locked : true,
			lockable : false,
			sortable : false,
			hideable : false,
			resizable : false,
			draggable : false,
			items : strMode === 'VIEW' ? [{
						itemId : 'btnView',
						itemCls : 'grid-row-action-icon icon-edit',
						toolTip : 'Edit Rule',
						text : 	getLabel('viewToolTip','View Record'),
					}] : [{
						itemId : 'btnEdit',
						itemCls : 'grid-row-action-icon icon-edit',
						toolTip : 'Edit Rule',
						text :  getLabel('editToolTip','Modify Record'),
					}, {
						itemId : 'btnView',
						itemCls : 'grid-row-action-icon icon-edit',
						toolTip : 'Edit Rule',
						text : getLabel('viewToolTip','View Record'),
					}, {
						itemId : 'btnDiscard',
						itemCls : 'grid-row-action-icon icon-edit',
						toolTip : 'Edit Rule',
						text : getLabel('userMstActionDiscard','Discard')

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
		me.up('panel[itemId="reconRuleGridView"]')
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
						viewRuleDetail(record.get('matchType'), record
										.get('invoiceField'), record
										.get('invTrFieldName'), record
										.get('operator'), record.get('pm'),
								record.get('fixedValue'), record.get('factor'),
								record.get('receiptField'), record
										.get('receiptTrFieldName'), record
										.get('identifier'));
					} else if (menu.itemId == 'btnEdit') {
						editRuleDetail(record.get('matchType'), record
										.get('invoiceField'), record
										.get('invTrFieldName'), record
										.get('operator'), record.get('pm'),
								record.get('fixedValue'), record.get('factor'),
								record.get('receiptField'), record
										.get('receiptTrFieldName'), record
										.get('identifier'));
					} else if (menu.itemId == 'btnDiscard') {
						discardRuleDetail(record.get('identifier'));
					}
				},
				//showPagerForced : showPager,
				heightOption : heightOption,
				storeModel : {
					fields : ['receiptEnrichFieldName', 'receiptTrFieldName',
							'matchType', 'invoiceField', 'invEnrichFieldName',
							'invTrFieldName', 'pm', 'fixedValue', 'factor',
							'operator', 'receiptField', 'identifier',
							'viewState'],
					proxyUrl : 'services/reconRuleDetailList.json',
					rootNode : 'd.detailList',
					totalRowsNode : 'd.__count'
				}
			};
		}

		objGroupView.reconfigureGrid(gridModel);
	},
	handleRowIconClick : function(tableView, rowIndex, columnIndex, menu,
			record) {
		if (menu == 'btnView') {
			viewRuleDetail(record.get('matchType'), record.get('invoiceField'),
					record.get('invTrFieldName'), record.get('operator'),
					record.get('pm'), record.get('fixedValue'), record
							.get('factor'), record.get('receiptField'), record
							.get('receiptTrFieldName'), record
							.get('identifier'));
		} else if (menu == 'btnEdit') {
			editRuleDetail(record.get('matchType'), record.get('invoiceField'),
					record.get('invoiceField') == "T" ? record.get('invTrFieldName') : 
					record.get('invEnrichFieldName') ,record.get('operator'),
					record.get('pm'), record.get('fixedValue'), record
							.get('factor'), record.get('receiptField'), record
							.get('receiptTrFieldName'), record
							.get('identifier'));
		} else if (menu == 'btnDiscard') {
			discardRuleDetail(record.get('identifier'));
		}
	},
	refreshGridData : function(me) {
		me.down('smartgrid').refreshData();
	}
});
