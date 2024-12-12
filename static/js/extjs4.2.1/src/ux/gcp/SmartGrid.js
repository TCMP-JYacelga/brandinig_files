/**
 * @class Ext.ux.gcp.SmartGrid
 * @extends Ext.grid.Panel
 * @author Vinay Thube
 */
Ext.define('Ext.ux.gcp.SmartGrid', {
	extend : 'Ext.grid.Panel',
	xtype : 'smartgrid',
	requires : ['Ext.grid.column.Action', 'Ext.grid.column.Column',
			'Ext.grid.column.Number', 'Ext.ux.grid.feature.MultiSorting',
			'Ext.selection.CheckboxModel', 'Ext.grid.RowNumberer',
			'Ext.ux.gcp.SmartGridPager', 'Ext.ux.gcp.SmartGridSorter',
			'Ext.ux.gcp.SmartStore', 'Ext.state.LocalStorageProvider',
			'Ext.state.Manager', 'Ext.EventManager', 'Ext.data.Store',
			'Ext.form.Panel', 'Ext.grid.feature.Summary',
			'Ext.ux.gcp.Override.view.Table',
			'Ext.ux.gcp.extend.SmartRowEditing', 'Ext.grid.plugin.CellEditing',
			'Ext.Array', 'Ext.ux.grid.FiltersFeature',
			'Ext.ux.grid.filter.ListFilter', 'Ext.ux.gcp.Override.LoadMask',
			'Ext.button.Split', 'Ext.ux.gcp.FilterView','Ext.ux.gcp.RibbonView',
			'Ext.ux.gcp.SmartGridSettingButton',
			'Ext.ux.gcp.Override.menu.Menu',
			'Ext.ux.gcp.Override.grid.header.Container',
			'Ext.ux.gcp.RowExpanderGrid',
			'Ext.ux.gcp.Override.grid.lockable.Lockable'],
	columnModel : [],
	storeModel : null,
	enableActionMenu : false,
	multiSort : true,
	/**
	 * @cfg{Boolean} showSorterToolbar control whether to show sorter toolbar or not
	 * @default false
	 */
	showSorterToolbar : false,
	pageSize : null,
	pageNo : 1,
	bodyCls : 'single-border',
	viewConfig : {
            enableTextSelection : true
        },
	enableLocking : true,
	enableRowEditing : false,
	enableCellEditing : false,
	enableColumnAutoWidth : false,
	enableColumnHeaderFilter : false,
	columnHeaderFilterCfg : null,
	stateful : true,
	hideRowNumbererColumn : false,
	rowNumbererColumnWidth : null,
	showCheckBoxColumn : true,
	checkBoxColumnWidth : null,
	showSummaryRow : false,
	showEmptyRow : true,
	/**
	 * @cfg{boolean} autoSortColumnList True to sort columns list context menu
	 *               alphabetically
	 * 
	 * @default false
	 */
	autoSortColumnList : false,
	showPager : true,
	showPagerForced : true,
	enableRowSizeCombo : true,
	showPagerRefreshLink : true,
	showAllRecords : false,
	rowEditor : null,
	cellEditor : null,
	rowNester : null,
	nestedGridConfigs : {},
	headerDockedItems : [],
	isFirstDataLoadCall : true,
	/**
	 * @cfg{boolean} escapeHtml True to enable the html escape
	 * 
	 * @default false
	 */
	escapeHtml : true,
	/**
	 * @cfg{String} cfgSmartGridSettingHeightOption This is smargrid setting
	 *              height option. Possibles value are S/M/L This config is used
	 *              only in case of the GroupView.
	 * 
	 * @default null
	 */
	heightOption : null,
	enableQueryParam : false,
	enableColumnDrag : true,
	enableColumnHeaderMenu : true,
	/**
	 * @cfg{Boolean} cfgShowFilter controls whether the filter panel to be
	 *               displayed or not
	 * 
	 * @default false
	 */
	cfgShowFilter : false,
	/**
	 * @cfg{Boolean} cfgShowRibbon controls whether the ribbon panel to be
	 *               displayed or not
	 * 
	 * @default false
	 */
	cfgShowRibbon : false,
	/**
	 * @cfg{Object} cfgRibbonModel contains ribbon model
	 * 
	 * @example { itemId : 'ribbon1', items : []}
	 * 
	 * @default {}
	 */
	cfgRibbonModel : {},
	/**
	 * @cfg{number} cfgSorterLimit specifies the maximum number of columns to be
	 *              allowed for sorting.
	 * @default 3
	 */
	cfgSorterLimit : 3,
	/**
	 * @cfg{Boolean} cfgShowFilterInfo controls whether the applied filter panel
	 *               information(text-only) to be displayed or not
	 * 
	 * @default false
	 */
	cfgShowFilterInfo : false,
	/**
	 * cfgFilter Model contains two configs, for layout and items
	 * cfgContentPanelLayout:'fit'
	 */
	cfgFilterModel : {},
	/**
	 * @cfg{boolean} cfgShowAdvancedFilterLink True to make the advanced filter
	 *               link visible .False to hide the link. This config will
	 *               ignored when cfgShowFilter is set to false
	 * 
	 * @default true
	 */
	cfgShowAdvancedFilterLink : true,
	/**
	 * @cfg{boolean} cfgEnableRowLevelActionComboStyling True to make Row Level
	 *               Action styling as a combobox. If
	 *               cfgEnableRowLevelActionComboStyling false then it will
	 *               display Row level action with default styling
	 * 
	 * @default false
	 */
	cfgEnableRowLevelActionComboStyling : false,
	/**
	 * @cfg{String} cfgCaptureColumnSettingAt Column model to be capture at. i.e
	 *              G : Group Level, L : Local , i.e at grid level
	 * 
	 * @default G
	 */
	cfgCaptureColumnSettingAt : 'G',
	initComponent : function() {
		var me = this;
		if (typeof enableRowLevelActionComboStyling !== 'undefined'
				&& enableRowLevelActionComboStyling !== null
				&& typeof enableRowLevelActionComboStyling === 'boolean')
			me.cfgEnableRowLevelActionComboStyling = enableRowLevelActionComboStyling;
		if (Ext.isEmpty(me.height) && Ext.isEmpty(me.minHeight))
			me.minHeight = '550';
		var multiSortFeature = null, objPager, objSorter, objSortView = null, colHdrFilterFeature = null, objFilterInfoCt = null, objFilterPanel = null, objRibbonPanel = null;
		var arrFeatures = new Array(), arrDocekdItems = new Array(), arrPlugins = new Array(), arrHeaderDockedItems = (me.headerDockedItems || []);
		var objStore = null, dockedPanel = null, arrColumns = [];
		if (localStorage) {
			Ext.state.Manager.setProvider(Ext
					.create('Ext.state.LocalStorageProvider'));
		}
		if (!Ext.isEmpty(me.id))
			me.stateId = me.id;
		objStore = me.createGridStore(me.storeModel);
		me.store = objStore;
		if(me.showSorterToolbar === true){
			me.store.on('beforeload', function() {
				if( me.store.sorters.length > me.cfgSorterLimit){
					return false;	
				}
			});
		}
		// multiSortFeature = Ext.create('Ext.ux.grid.feature.MultiSorting');
		if (me.multiSort === true)
			arrFeatures.push({
						ftype : 'multisorting'
					});
		if (me.showSummaryRow === true)
			arrFeatures.push({
						ftype : 'summary',
						showSummaryRow : me.showSummaryRow
					})
		if (me.enableColumnHeaderFilter === true) {
			colHdrFilterFeature = me.createColumnHeaderFilterFeature();
			if (colHdrFilterFeature)
				arrFeatures.push(colHdrFilterFeature);
		}
		if (me.features && Ext.isArray(me.features)) {
			for (var i = 0; i < me.features.length; i++) {
				arrFeatures.push(me.features[i]);
			}
		}
		me.features = arrFeatures;
		if (me.enableRowEditing) {
			me.rowEditor = Ext.create('Ext.ux.gcp.extend.SmartRowEditing', {
						editing : false,
						listeners : {
							cancelEdit : function(rowEditing, context) {
								// Canceling editing of a locally added, unsaved
								// record: remove it
								if (context.record.phantom) {
									me.store.remove(context.record);
								}
								me.getView().refresh();
							}
						}
					});
			arrPlugins.push(me.rowEditor);
		}
		if (me.enableCellEditing) {
			me.cellEditor = Ext.create('Ext.grid.plugin.CellEditing', {
						clicksToEdit : 1,
						editing : false
					});
			arrPlugins.push(me.cellEditor);
		}
		if (me.nestedGridConfigs.enableGridNesting) {
	       me.rowNester = Ext.create('Ext.ux.gcp.RowExpanderGrid', {
						gridConfig : me.nestedGridConfigs.innerGridConfig
					});
			arrPlugins.push(me.rowNester);
		}
		if (arrPlugins && arrPlugins.length > 0)
			me.plugins = arrPlugins;
		arrColumns = (me.createColumns(me.columnModel) || []);
		if (me.enableRowEditing === false && me.enableCellEditing === false
			&& typeof gridShowEmptyColumn != 'undefined' && gridShowEmptyColumn === 'Y') {
				me.columns = arrColumns.concat([me.createEmptyColumn()]);
		} else
			me.columns = arrColumns;
		objPager = me.createPager(objStore);
		arrDocekdItems.push(objPager);
		me.fireSortChange = true;
		if (me.cfgShowFilter === true || me.cfgShowFilterInfo === true) {
			objFilterPanel = me.createFilterPanel();
			arrDocekdItems.push(objFilterPanel);
		}
		if (me.cfgShowRibbon === true) {
			objRibbonPanel = me.createRibbonPanel();
			arrDocekdItems.push(objRibbonPanel);
		}
		if (me.multiSort === true
				|| (arrHeaderDockedItems && arrHeaderDockedItems.length > 0)) {
					
			if (me.multiSort === true && me.showSorterToolbar === true) {
				objSorter = me.createSorter();
				// objSorter.flex = 1;
				arrHeaderDockedItems.push(objSorter);
			}
			if (me.cfgCaptureColumnSettingAt === 'L')
				arrHeaderDockedItems.push({
							xtype : 'toolbar',
							items : ['->', {
										xtype : 'button',
										cls : 'xn-button-transparent',
										html : '<i class="fa fa-wrench"></i>',
										margin : '0 0 0 4',
										itemId : 'btnSetting',
										tooltip : getLabel('iconSetting',
												'Setting'),
										handler : function(btn) {
											me.fireEvent('gridSettingClick')
										}
									}]
						});
			dockedPanel = Ext.create('Ext.panel.Panel', {
						itemId : 'smartGridHeaderDockedPanel',
						layout : 'hbox',
						dock : 'top',
						items : arrHeaderDockedItems
					});
			arrDocekdItems.push(dockedPanel);
		}
		me.dockedItems = arrDocekdItems;
		me.on('pagechange', me.handlePagination);
		// TODO : New Event to be introduced...!
		// me.on('pagesizechange', me.handlePageSizeChange);
		me.on('pagesizechange', me.handleStateChange);
		me.on('columnhide', me.handleStateChange);
		me.on('columnmove', me.handleStateChange);
		me.on('columnresize', me.handleStateChange);
		me.on('columnshow', me.handleStateChange);
		me.on('sortchange', me.handleStateChange);
		me.on('lockcolumn', function(ct, colmn, width, opts) {
					var filter = me.getColumnFilterInstance();
					if (false) {
						filter.suspendEvents();
						filter.clearFilters();
						filter.resumeEvents();
					}
					me.handleStateChange(ct, colmn, width, opts)
				});
		me.on('unlockcolumn', function(ct, colmn, width, opts) {
					var filter = me.getColumnFilterInstance();
					if (false) {
						filter.suspendEvents();
						filter.clearFilters();
						filter.resumeEvents();
					}
					me.handleStateChange(ct, colmn, width, opts)
				});
		me.on('afterrender', me.handleAfterRender);
		me.on('columnfilterupdate', me.handleColumnFilterUpdate);

		if (me.enableRowEditing) {
			me.on('beforeedit', function(editor, e) {
						me.fireEvent('beforeRecordEdit', e.record, editor, me,
								e);
						return me.doBeforeRecordEdit(e.record, editor, me, e);
					});
			me.on('edit', function(editor, e) {
						me.fireEvent('recordEdit', e.record, editor, me, e);
						me.doRecordEdit(e.record, editor, me, e);
					});
			// TODO : To be verify
			me.rowEditor.on('editPrevious', function(editor, previousContext) {
						me.fireEvent('recordEditPrevious',
								previousContext.record, editor, me,
								previousContext);
						me.doRecordEditPrevious(previousContext.record,
								editor.record, editor, me, previousContext);
					});
			me.on('validateedit', function(editor, e) {
						me.fireEvent('validateRecordEdit', e.record, editor,
								me, e);
						me.doValidateRecordEdit(e.record, editor, me, e);
					});
			me.on('canceledit', function(editor, e) {
						me.fireEvent('cancelRecordEdit', e.record, editor, me,
								e)
						me.doCancelRecordEdit(e.record, editor, me, e);
					});
		}

		me.on('cellclick', function(gridView, td, cellIndex, record, tr,
						rowIndex, eventObj) {
					me.handleGridCellClick(gridView, td, cellIndex, record, tr,
							rowIndex, eventObj);
				});

		me.on('itemcontextmenu', function(gridView, record, item, index, e,
						eOpts) {
					me.handleRightContextMenu(gridView, record, item, index, e,
							eOpts);
				});
		me.on('expandedrow',me.handleRenderInnerGrid);
		me.viewConfig.enableTextSelection = true;
		Ext.EventManager.onWindowResize(function(w, h) {
					me.doComponentLayout();
				});
		me.callParent(arguments);
	},
	createEmptyColumn : function() {
		return {
			colType : 'emptyColumn',
			text : '',
			dataIndex : '',
			hideable : false,
			lockable : false,
			draggable : false,
			flex : 1,
			menuDisabled : true,
			sortable : false
		};
	},
	handlePagination : function(pager, newPgNo, oldPgNo) {
		var me = this;
		var objStore = pager.store;
		var strUrl = objStore.dataUrl;
		var filterData = me.getColumnFilterData();
		me.fireEvent('gridPageChange', me, strUrl, me.pageSize, newPgNo,
				oldPgNo, objStore.sorters, filterData);
	},
	handlePageSizeChange : function(pager, newPgSize, oldPgSize, newPgNo,
			oldPgNo) {
		var me = this;
		var objStore = pager.store;
		var strUrl = objStore.dataUrl;
		var filterData = me.getColumnFilterData();
		me.fireEvent('gridPageSizeChange', me, strUrl, newPgSize, newPgNo,
				oldPgNo, objStore.sorters, filterData, oldPgSize);
	},
	handleSortChange : function(newPgNo, oldPgNo) {
		var me = this;
		var objStore = me.store;
		var strUrl = objStore.dataUrl;
		var filterData = me.getColumnFilterData();
		if (Ext.isEmpty(me.storeModel.sortState) || !me.isFirstDataLoadCall) {
			me.fireEvent('gridSortChange', me, strUrl, me.pageSize, newPgNo,
					oldPgNo, objStore.sorters, filterData);
		}
		me.isFirstDataLoadCall = false;
	},
	handleGridCellClick : function(gridView, td, cellIndex, record, tr,
			rowIndex, eventObj) {
		var grid = this;
		var column = gridView.getHeaderAtIndex(cellIndex);
		if (eventObj.target.textContent != " "
				|| eventObj.target.tagName == "A") {
			var arrVisibleActions = [];
			var arrAvailableActions = column.actions;
			var store = gridView.getStore();
			var jsonData = store.proxy.reader.jsonData;
			var targetObj = {}, isMoreClicked = false, isEditorOn = false;

			var intActionCount = !Ext.isEmpty(column.visibleRowActionCount)
					? parseInt(column.visibleRowActionCount)
					: 2;
			if (grid.cfgEnableRowLevelActionComboStyling === true && column.disableComboStyle !== true )
				intActionCount = 0;
			targetObj.name = eventObj.target.name;
			targetObj.itemId = eventObj.target.name;
			targetObj.action = eventObj.target.name;
			if (!Ext.isEmpty(arrAvailableActions)) {
				for (var count = 0; count < arrAvailableActions.length; count++) {
					var fnIsVisible = null, blnIsEnabled = false, clickHandler = null;
					fnIsVisible = arrAvailableActions[count].fnVisibilityHandler;
					if (eventObj.target.name === arrAvailableActions[count].itemId) {
						clickHandler = arrAvailableActions[count].fnClickHandler;
						if (!Ext.isEmpty(clickHandler)
								&& typeof clickHandler == 'function') {
							clickHandler(gridView, rowIndex, cellIndex,
									targetObj, null, record);
						} else {
							grid.handleRowIconClick(gridView, rowIndex,
									cellIndex, targetObj, eventObj, record);
						}
					} else if (eventObj.target.tagName == "A"
							&& eventObj.target.name == "btnMore") {
						isMoreClicked = true;
						if (isMoreClicked) {
							if (grid.cfgEnableRowLevelActionComboStyling === true)
								eventObj.target.className = "icon-action-dropdown";
							if (grid.cfgEnableRowLevelActionComboStyling === false) {
								eventObj.target.className = "action-down-hover";
								eventObj.target.style.padding = '5px';
							}
						}

						if (!Ext.isEmpty(fnIsVisible)
								&& typeof fnIsVisible == 'function')
							blnIsEnabled = fnIsVisible(store, record, jsonData,
									arrAvailableActions[count].itemId,
									arrAvailableActions[count].maskPosition);
						else if (!Ext.isEmpty(grid)
								&& !Ext.isEmpty(grid.isRowIconVisible))
							blnIsEnabled = grid.isRowIconVisible(store, record,
									jsonData,
									arrAvailableActions[count].itemId,
									arrAvailableActions[count].maskPosition);
						else
							blnIsEnabled = true;

						if (blnIsEnabled == true) {
							arrVisibleActions.push(arrAvailableActions[count]);
						}
					}
				}
				isEditorOn = grid.rowEditor && grid.rowEditor.editing ? grid.rowEditor.editing : false; 
				if (!isEditorOn && isMoreClicked && !Ext.isEmpty(arrVisibleActions))
					grid.createMoreMenu(arrVisibleActions, gridView, rowIndex,
							cellIndex, targetObj, eventObj, record,
							intActionCount);
			}
		}
	},
	createMoreMenu : function(arrVisibleActions, gridView, rowIndex, cellIndex,
			targetObj, eventObj, record, intActionCount) {
		var me = this;
		var arrMoreMenuActions = [], objMenu = null, column = null, intWidth = 105;
		column = gridView.getHeaderAtIndex(cellIndex);
		intWidth = column.width;
		for (var index = 0; index < arrVisibleActions.length; index++) {
			if (index >= intActionCount && index < arrVisibleActions.length) {
				var clickHandler = null, text = "";
				if (!Ext.isEmpty(arrVisibleActions[index].text))
					text = arrVisibleActions[index].text;
				else if (!Ext.isEmpty(arrVisibleActions[index].itemLabel))
					text = arrVisibleActions[index].itemLabel;

				arrMoreMenuActions.push({
							text : text,
							itemId : arrVisibleActions[index].itemId,
							iconCls : arrVisibleActions[index].itemCls + ' ' + arrVisibleActions[index].itemId,
							maskPosition : arrVisibleActions[index].maskPosition,
							fnClickHandler : arrVisibleActions[index].fnClickHandler,
							fnIconRenderer : arrVisibleActions[index].fnIconRenderer,
							handler : function(menu) {
								menu.dataParams = {
									'record' : record,
									'rowIndex' : rowIndex,
									'columnIndex' : cellIndex,
									'view' : gridView
								};
								if (!Ext.isEmpty(menu))
									clickHandler = menu.fnClickHandler;
								if (!Ext.isEmpty(clickHandler)
										&& typeof clickHandler == 'function') {
									clickHandler(gridView, rowIndex, cellIndex,
											menu, eventObj, record);
								} else
									me.handleMoreMenuItemClick(gridView,
											rowIndex, cellIndex, menu,
											eventObj, record);
							}
						});
			}
		}
		if (me.moreMenu)
			me.moreMenu.destroy(true);
		if (!Ext.isEmpty(arrMoreMenuActions)) {
			objMenu = Ext.create('Ext.menu.Menu', {
				itemId : 'moreMenu',
				floating : true,
				// cls : 'ext-dropdown-menu',
				cls : (me.cfgEnableRowLevelActionComboStyling)
						? 'action-dropdown-menu'
						: 'ext-dropdown-menu',
				autoHeight : true,
				minWidth: 150,
				maxWidth: 560,
				defaultMinWidth : $('#btnMore_' + rowIndex).width(),
				items : arrMoreMenuActions,
				listeners : {
					'hide' : function() {
						if (me.cfgEnableRowLevelActionComboStyling === true)
							eventObj.target.className = "icon-action-dropdown cursor_pointer";
						else if (me.cfgEnableRowLevelActionComboStyling === false) {
							eventObj.target.className = "icon-dropdown cursor_pointer";
							eventObj.target.style.padding = 0;
						}
					}
				}
			});
			objMenu.showAt(eventObj.getXY());
			if (eventObj.target)
				objMenu.anchorTo(eventObj.target);
			me.moreMenu = objMenu;
		}
	},
	createColumns : function(columnModel) {
		var me = this;
		var columns = [];
		var colindx = 0;
		if (!Ext.isEmpty(me.hideRowNumbererColumn)
				&& me.hideRowNumbererColumn === false) {
			columns.push(me.createRowNumberer(colindx));
			colindx++;
		}
		if (!Ext.isEmpty(me.showCheckBoxColumn)
				&& me.showCheckBoxColumn === true) {
			me.selModel = me.createCheckBoxModel(colindx);
			colindx++;
		}
		if (!Ext.isEmpty(columnModel)) {
			for (var i = 0; i < columnModel.length; i++)
				columns.push(me.createColumn(columnModel[i], i+1));
		}
		return columns;
	},
	createColumn : function(colModel, intSeq) {
		var me = this;
		var arrArgs = null;
		var column = {}, sortable = true, hidden = false, hideable = true, lockable = true, resizable = true, draggable = true, locked = false, colType = 'content', width = 120, colSequence = intSeq;
		var renderTo = null;
		column.id = me.id + 'col_' + colModel.colId;
		column.itemId = 'col_' + colModel.colId;
		column.width = !Ext.isEmpty(colModel.width) ? colModel.width : width;

		if (!Ext.isEmpty(colModel.minWidth))
			column.minWidth = colModel.minWidth;

		if (!Ext.isEmpty(colModel.maxWidth))
			column.maxWidth = colModel.maxWidth;

		// column.tdCls = 'xn-grid-cell-padding ';
		column.defaultWidth = null;
		column.allowSubTotal = colModel.allowSubTotal || 'N';
		column.metaInfo = !Ext.isEmpty(colModel.metaInfo)
				? colModel.metaInfo
				: null;
		column.text = !Ext.isEmpty(colModel.colHeader)
				? colModel.colHeader
				: '';
		column.align = !Ext.isEmpty(colModel.align) ? colModel.align : 'left';
		if (!Ext.isEmpty(colModel.sortable)
				&& (colModel.sortable === true || colModel.sortable === false))
			sortable = colModel.sortable;
		column.sortable = sortable;

		if (!Ext.isEmpty(colModel.hideable)
				&& (colModel.hideable === true || colModel.hideable === false))
			hideable = colModel.hideable;
		column.hideable = hideable;

		if (!Ext.isEmpty(colModel.hidden)
				&& (colModel.hidden === true || colModel.hidden === false))
			hidden = colModel.hidden;
		column.hidden = hidden;

		if (!Ext.isEmpty(colModel.lockable)
				&& (colModel.lockable === true || colModel.lockable === false))
			lockable = colModel.lockable;
		column.lockable = lockable;

		if (!Ext.isEmpty(colModel.resizable)
				&& (colModel.resizable === true || colModel.resizable === false))
			resizable = colModel.resizable;
		column.resizable = resizable;

		if (!Ext.isEmpty(colModel.draggable)
				&& (colModel.draggable === true || colModel.draggable === false))
			draggable = colModel.draggable;

		if (me.enableColumnDrag === false)
			draggable = false;
		column.draggable = draggable;

		if (!Ext.isEmpty(colModel.colSequence))
			colSequence = colModel.colSequence;

		column.colSequence = colSequence;

		if (me.enableColumnHeaderMenu === false)
			column.menuDisabled = true;

		if (!Ext.isEmpty(colModel.locked)
				&& (colModel.locked === true || colModel.locked === false)
				&& me.enableLocking === true)
			locked = colModel.locked;
		column.locked = locked;

		if (!Ext.isEmpty(colModel.colType)) {
			colType = colModel.colType;
		}

		column.colType = colType || 'content';

		if (!Ext.isEmpty(colModel.summaryType))
			column.summaryType = colModel.summaryType;

		if (!Ext.isEmpty(colModel.editor))
			column.editor = colModel.editor;

		if (!Ext.isEmpty(colModel.autoWidth)
				&& (colModel.autoWidth === true || colModel.autoWidth === false))
			column.autoWidth = colModel.autoWidth;
		else
			column.autoWidth = true;

		if (!Ext.isEmpty(colModel.colHeaderField)) {
			renderTo = 'div_' + colModel.colId;
			var div = '<div id="' + renderTo + '"></div>';
			column.text = div;
			column.listeners = {
				'afterrender' : function() {
					me.fireEvent('modifyColumnHeader', column,
							colModel.colHeaderField, renderTo)
				}
			}
		}

		if (colType === 'action') {
			var arrItem = [];
			var objItem = {};
			var objMoreItem = {};
			var isVisible = null, isMoreVisible = null, objTemp = null, itemCls = '';
			var jsonData = null, maskPosition = null;
			var objMenu = null, fnIconRenderer = null;
			column.xtype = 'actioncolumn';

			if (!Ext.isEmpty(colModel.items)) {
				for (var i = 0; i < colModel.items.length; i++) {
					objTemp = colModel.items[i];
					maskPosition = objTemp.maskPosition;
					objItem = {};
					objItem.itemId = objTemp.itemId;
					objItem.maskPosition = maskPosition;
					isVisible = objTemp.fnVisibilityHandler;
					fnIconRenderer = objTemp.fnIconRenderer;
					itemCls = objTemp.itemCls + ' cursor_pointer';
					if (!Ext.isEmpty(objTemp.toolTip))
						objItem.tooltip = objTemp.toolTip;
					if (!Ext.isEmpty(fnIconRenderer)
							&& typeof fnIconRenderer == 'function')
						objItem.getClass = fnIconRenderer;
					else
						objItem.getClass = Ext.Function.bind(
								function(value, metaData, record, rowIndex,
										colIndex, store, view, itmCls, itmId,
										bitPosition) {
									var blnIsEnabled = false;
									jsonData = store.proxy.reader.jsonData;
									if (!Ext.isEmpty(isVisible)
											&& typeof isVisible == 'function')
										blnIsEnabled = isVisible(store, record,
												jsonData, itmId, bitPosition);
									else if (!Ext.isEmpty(me)
											&& !Ext
													.isEmpty(me.isRowIconVisible))
										blnIsEnabled = me.isRowIconVisible(
												store, record, jsonData, itmId,
												bitPosition);
									else
										blnIsEnabled = true;
									if (blnIsEnabled)
										return itmCls;
									else
										return 'xn-hide';
								}, '', [itemCls, objTemp.itemId, maskPosition],
								true);
					if (!Ext.isEmpty(objTemp.fnClickHandler))
						objItem.handler = objTemp.fnClickHandler;
					else if (!Ext.isEmpty(me)
							&& !Ext.isEmpty(me.handleRowIconClick))
						objItem.handler = me.handleRowIconClick;
					arrItem.push(objItem);
				}
			}
			if (!Ext.isEmpty(colModel.moreMenu)) {
				var cfgMore = colModel.moreMenu;
				var arrMenuItems = new Array();
				var objMoreItems = cfgMore.items;
				var menuItem = {};
				itemCls = 'icon-dropdown cursor_pointer';

				isMoreVisible = cfgMore.fnMoreMenuVisibilityHandler;
				objMoreItem.itemId = 'moreMenu';
				objMoreItem.itemCls = itemCls;
				objMoreItem.moreItems = objMoreItems;

				for (var i = 0; i < objMoreItems.length; i++) {
					menuItem = {
						text : objMoreItems[i].itemLabel,
						iconCls : objMoreItems[i].itemCls,
						itemId : objMoreItems[i].itemId,
						maskPosition : objMoreItems[i].maskPosition

					};
					if (!Ext.isEmpty(objMoreItems[i].fnClickHandler))
						menuItem.handler = objMoreItems[i].fnClickHandler;
					else if (!Ext.isEmpty(me)
							&& !Ext.isEmpty(me.handleRowMoreMenuItemClick))
						menuItem.handler = me.handleRowMoreMenuItemClick;

					arrMenuItems.push(menuItem);
				}
				objMenu = Ext.create('Ext.menu.Menu', {
							floating : true,
							items : arrMenuItems
						});
				objMoreItem.menu = objMenu;
				objMoreItem.getClass = Ext.Function.bind(function(value,
								metaData, record, rowIndex, colIndex, store,
								view, itmCls, itmId, menu) {
							var blnIsEnabled = false;
							jsonData = store.proxy.reader.jsonData;
							if (!Ext.isEmpty(isMoreVisible)
									&& typeof isMoreVisible == 'function')
								blnIsEnabled = isMoreVisible(store, record,
										jsonData, itmId, menu);
							else if (!Ext.isEmpty(me)
									&& !Ext.isEmpty(me.isRowMoreMenuVisible))
								blnIsEnabled = me.isRowMoreMenuVisible(store,
										record, jsonData, itmId, menu);

							if (blnIsEnabled)
								return itmCls;
							else
								return 'xn-hide';
						}, '', [itemCls, 'moreMenu', objMenu], true);

				if (!Ext.isEmpty(cfgMore.fnMoreMenuClickHandler))
					objMoreItem.handler = cfgMore.fnMoreMenuClickHandler;
				else if (!Ext.isEmpty(me)
						&& !Ext.isEmpty(me.handleRowMoreMenuClick))
					objMoreItem.handler = me.handleRowMoreMenuClick;
				arrItem.push(objMoreItem);

			}
			column.items = arrItem;
			if (!Ext.isEmpty(colModel.fnColumnRenderer))
				column.renderer = Ext.Function.bind(colModel.fnColumnRenderer,
						column, column.itemId, true);
		} else if (colType === 'number' || colType === 'amount'
				|| colType === 'count') {
			column.xtype = 'numbercolumn';
			if (!Ext.isEmpty(colModel.colId))
				column.dataIndex = colModel.colId;

			if (!Ext.isEmpty(colModel.format))
				column.format = colModel.format;

			column.align = !Ext.isEmpty(colModel.align)
					? colModel.align
					: 'right';
			if (!Ext.isEmpty(colModel.fnColumnRenderer))
				column.renderer = Ext.Function.bind(colModel.fnColumnRenderer,
						column, column.itemId, true);
			else
				column.renderer = Ext.Function.bind(me.columnRenderer, column,
						column.itemId, true);
			if (me.showSummaryRow === true) {
				arrArgs = [me.store, column.itemId];
				column.summaryType = (colModel.summaryType || 'sum');
				if (!Ext.isEmpty(colModel.fnSummaryRenderer)) {
					column.summaryRenderer = Ext.Function.bind(
							colModel.fnSummaryRenderer, column, column.itemId,
							true);
				} else {
					column.summaryRenderer = Ext.Function.bind(
							me.summaryRenderer, column, column.itemId, true);
				}
			}

		} else if (colType === 'actioncontent') {
			var arrItem = [];
			var objItem = {};
			var objTemp = null;
			var maskPosition = null;
			column.colType = colType;
			column.disableComboStyle = !Ext.isEmpty(colModel.disableComboStyle) ? colModel.disableComboStyle : false;
			if (me.cfgEnableRowLevelActionComboStyling === true && column.disableComboStyle !== true) {
				column.width = colModel.width || 115;
				column.tdCls = 'action-Content-Col';
			}
			if (!Ext.isEmpty(colModel.items)) {
				for (var i = 0; i < colModel.items.length; i++) {
					objTemp = colModel.items[i];
					maskPosition = objTemp.maskPosition;
					objItem = {
						text : objTemp.text,
						itemLabel : objTemp.itemLabel,
						itemId : objTemp.itemId,
						itemCls : objTemp.itemCls,
						toolTip : objTemp.toolTip,
						maskPosition : maskPosition,
						fnVisibilityHandler : objTemp.fnVisibilityHandler,
						fnClickHandler : objTemp.fnClickHandler,
						fnIconRenderer : objTemp.fnIconRenderer
					};

					arrItem.push(objItem);
				}
				column.actions = arrItem;
				column.visibleRowActionCount = colModel.visibleRowActionCount;
			}
			if (!Ext.isEmpty(colModel.fnColumnRenderer))
				column.renderer = Ext.Function.bind(colModel.fnColumnRenderer,
						column, column.itemId, true);
			else
				column.renderer = function(value, meta, record, rowIndex,
						colIndex, store, view) {
					var value = "";
					value = me.actionContentColumnRenderer(column, me, value,
							meta, record, rowIndex, colIndex, store, view);
					return value;
				}
		} else {
			// Default colType i.e content
			column.xtype = 'gridcolumn';
			if (!Ext.isEmpty(colModel.colId))
				column.dataIndex = colModel.colId;

			if (!Ext.isEmpty(colModel.fnColumnRenderer))
				column.renderer = Ext.Function.bind(colModel.fnColumnRenderer,
						column, column.itemId, true);
			else
				column.renderer = Ext.Function.bind(me.columnRenderer, column,
						column.itemId, true);
			if (me.showSummaryRow === true) {
				arrArgs = [me.store, column.itemId];
				column.summaryType = (colModel.summaryType || 'sum');
				if (!Ext.isEmpty(colModel.fnSummaryRenderer)) {
					column.summaryRenderer = Ext.Function.bind(
							colModel.fnSummaryRenderer, column, column.itemId,
							true);
				} else {
					column.summaryRenderer = Ext.Function.bind(
							me.summaryRenderer, column, column.itemId, true);
				}
			}
		}
		return column;
	},
	createColumnHeaderFilterFeature : function() {
		var me = this;
		var filresCfg = me.columnHeaderFilterCfg || null, filterFeature = null, cfgFilter = null;
		var blnRemoteFilter = filresCfg.remoteFilter || true, blnFilter = blnRemoteFilter === true
				? false
				: true;
		var arrTypes = ['numeric', 'string', 'numeric', 'date', 'list',
				'boolean'], arrFieldTypes = ['select'], arrCfgFilters = null, arrFilter = [];
		if (filresCfg) {
			arrCfgFilters = filresCfg.filters || [];
			Ext.each(arrCfgFilters, function(cfg) {
						if (Ext.Array.contains(arrTypes, cfg.type)) {
							cfgFilter = {};
							// TODO: Currently list is supported, rest of the
							// types to be supported
							if (cfg.type === 'list') {
								cfgFilter['type'] = cfg.type;
								cfgFilter['dataIndex'] = cfg.colId || '';
								cfgFilter['options'] = cfg.options || [];
								arrFilter.push(cfgFilter);
							}
						}
					});
			filterFeature = {
				ftype : 'filters',
				autoReload : false,
				encode : true,
				local : blnFilter,
				filters : arrFilter
			};
		}
		return filterFeature;
	},
	createPager : function(objStore) {
		var me = this;
		var arrItem = new Array();
		var rowList = me.rowList;
		var intMinValue = me.pageSize;
		var pager = null;
		if (!Ext.isEmpty(rowList) && Ext.isArray(rowList) && rowList.length > 0) {
			intMinValue = Ext.Array.min(rowList);
			var arrData = new Array();
			var pgSize = !Ext.isEmpty(me.pageSize) ? me.pageSize : rowList[0];
			intMinValue = pgSize <= intMinValue ? pgSize : intMinValue;
			me.store.pageSize = pgSize;
			
			if(!Ext.isEmpty(me.enableRowSizeCombo) && me.enableRowSizeCombo){
				if (Ext.Array.contains(rowList, pgSize)) {
					arrItem.push('-');
					for (var i = 0; i < rowList.length; i++)
						arrData.push({
									key : rowList[i],
									value : rowList[i]
								});
					arrItem.push({
						xtype : 'tbtext',
						itemId : 'lblRowPerPage',
						text : getLabel('rowperpage','Rows Per Page')
					});
					arrItem.push({
								xtype : 'combobox',
								itemId : 'pgSize',
								name : 'pgSize',
								editable : false,
								fieldCls : 'xn-form-field',
								triggerBaseCls : 'xn-form-trigger',
								margins : '-1 2 3 0',
								value : pgSize,
								displayField : 'value',
								valueField : 'key',
								matchFieldWidth : true,
								maxWidth : 50,
								listConfig : {
									minWidth : 15
								},
								store : Ext.create('Ext.data.Store', {
											fields : ['key', 'value'],
											data : arrData
										}),
								listeners : {
									change : function(combo, newValue, oldValue) {
										me.pageSize = newValue;
										me.store.pageSize = newValue;
										me.store.currentPage = 1;
										combo.ownerCt.doHandlePageSizeChange(combo,
												newValue, oldValue);
										combo.ownerCt.doRefresh();
									}
								}
							});
				}
			}
		}
		pager = Ext.create('Ext.ux.gcp.SmartGridPager', {
					baseCls : 'xn-paging-toolbar',
					store : objStore,
					dock : 'bottom',
					displayInfo : true,
					showPager : me.showPager,
					showPagerForced : me.showPagerForced,
					showPagerRefreshLink : me.showPagerRefreshLink,
					grid : me,
					minPgSize : intMinValue,
					items : arrItem
				});
		return pager;
	},
	createSorter : function() {
		var me = this;
		var sorter = Ext.create('Ext.ux.gcp.SmartGridSorter', {
					dock : 'top',
					itemId : 'sortToolbar',
					autoScroll : false
				});
		sorter.on('afterrender', function(sorter) {
					var reorderPlugin = sorter.getPlugin('sort-reorderer');
					reorderPlugin.on('Drop', me.changeSortOrder, me);
				})
		return sorter;
	},
	/**
	 * The function createFilterPanel creates filter panel.
	 */
	createFilterPanel : function() {
		var me = this, objFilterPanel = null;
		objFilterPanel = Ext.create('Ext.ux.gcp.FilterView', {
					itemId : 'smartgridFilterView',
					cfgShowAdvancedFilterLink : me.cfgShowAdvancedFilterLink,
					cfgFilterModel : me.cfgFilterModel,
					cfgShowFilter : me.cfgShowFilter,
					cfgShowFilterInfo : me.cfgShowFilterInfo,
					parent : me,
					dock : 'top'
				});
		return objFilterPanel;
	},
		/**
		 * The function createRibbonPanel creates ribbon panel.
		 */
	createRibbonPanel : function() {
		var me = this, objRibbon = null;
		objRibbon = Ext.create('Ext.ux.gcp.RibbonView', {
					itemId : (me.cfgRibbonModel || {} ).itemId || 'ribbonView',
					parent : me,
					dock : 'top',
					cfgRibbonModel : me.cfgRibbonModel || {}
				});
		return objRibbon;
	},
	/**
	 * @cfg{ARRAY} arrFilterInfoJson The json model used populate filter
	 *             inofrmation
	 * @default {}
	 * 
	 * @example [{ "fieldId" : "statusField", "fieldLabel" : "Status",
	 *          "fieldValue" : [] }]
	 */
	updateFilterInfo : function(arrFilterInfoJson) {
		var me = this, filterPanel = me
				.down('panel[itemId="smartgridFilterView"]');
		if (filterPanel)
			filterPanel.updateFilterInfo(arrFilterInfoJson);
	},

	createGridStore : function(storeModel) {
		var me = this;
		var pageSize = !Ext.isEmpty(me.pageSize) ? me.pageSize : 20;
		var pageNo = !Ext.isEmpty(me.pageNo) ? me.pageNo : 1;
		
		var storeCfg = {}, objStore = null, fields = [], proxy = null, proxyType = 'memory', autoLoad = false, remoteSort = true, sorters = [];
		me.pageSize = pageSize;
		if (!Ext.isEmpty(storeModel)) {
			if (!Ext.isEmpty(storeModel.fields))
				fields = storeModel.fields;
			fields.push({
						name : 'isEmpty',
						type : 'bool',
						defaultValue : false
					}, {
						name : 'isActionTaken',
						type : 'string',
						defaultValue : 'N'
					});

			// if (!Ext.isEmpty(storeModel.remoteSort) && storeModel.remoteSort
			// === true)
			// proxyType = 'memory';
			proxy = {};
			proxy.type = proxyType;
			proxy.reader = {};
			proxy.reader.type = 'json';

			proxy.limitParam = undefined;
			proxy.startParam = undefined;
			proxy.pageParam = undefined;
			proxy.sortParam = undefined;

			// TODO : To be discuss
			if (!Ext.isEmpty(storeModel.proxyUrl)) {
				/*
				 * if (typeof generateUrl == 'function') proxy.url = generateUrl
				 * (storeModel.proxyUrl, pageSize, 1,1,null); else proxy.url =
				 * storeModel.proxyUrl;
				 */
				storeCfg.dataUrl = storeModel.proxyUrl;
			}

			if (!Ext.isEmpty(storeModel.rootNode))
				proxy.reader.root = storeModel.rootNode;

			if (!Ext.isEmpty(storeModel.totalRowsNode))
				proxy.reader.totalProperty = storeModel.totalRowsNode;

			if (!Ext.isEmpty(storeModel.autoLoad)
					&& (storeModel.autoLoad === true || storeModel.autoLoad === false))
				autoLoad = storeModel.autoLoad;

			if (!Ext.isEmpty(storeModel.remoteSort)
					&& (storeModel.remoteSort === true || storeModel.remoteSort === false))
				remoteSort = storeModel.remoteSort;

			if (!Ext.isEmpty(storeModel.sortState))
				sorters = storeModel.sortState;
		}
		storeCfg.pageSize = pageSize;
		storeCfg.fields = fields;
		if (!Ext.isEmpty(proxy))
			storeCfg.proxy = proxy;
		storeCfg.autoLoad = autoLoad;
		storeCfg.remoteSort = remoteSort;
		storeCfg.multiSort = me.multiSort;
		storeCfg.currentPage = pageNo;
		storeCfg.sorters = sorters;
		storeCfg.showEmptyRow = me.showEmptyRow;
		objStore = Ext.create('Ext.ux.gcp.SmartStore', storeCfg);
		objStore.on('smartStoreLoad', me.handleStoreLoad, me);
		return objStore;
	},
	handleStoreLoad : function(store, records, isSuccessFull) {
		var me = this, objCol = null, arrAllCols = me.getAllColumns()
		/*
		 * if (!Ext.isEmpty(me.enableColumnAutoWidth) &&
		 * me.enableColumnAutoWidth === true) me.autoSizeGridColumns();
		 */
		me.fireEvent('gridStoreLoad', me, store, records, isSuccessFull);
	},
	autoSizeGridColumns : function() {
		var me = this, arrAllCols = me.getAllColumns(),store = me.getStore(),storeCount = 0;
		if(!Ext.isEmpty(store)){
			storeCount = store.getCount();
		}
		if (arrAllCols.length > 1 && storeCount > 0)
			Ext.each(arrAllCols, function(col) {
						// For single column grid this should not apply
						if (col.colType != 'actioncontent'
								&& col.colType != 'action' && col.colType != 'emptyColumn' && col.colType != 'rowNumber') {
								col.autoSize();
						}
					});
	},

	createCheckBoxModel : function(injectPosition) {
		var me = this;
		var intWidth = me.checkBoxColumnWidth || 24;
		var checkBoxModel = new Ext.selection.CheckboxModel({
			checkOnly : true,
			headerWidth : intWidth,
			ignoreRightMouseSelection : true,
			injectCheckbox : injectPosition,
			renderer : function(value, metaData, record, rowIndex, colIndex,
					store, view) {
				if (record.get('isEmpty'))
					return '';
				else {
					var baseCSSPrefix = Ext.baseCSSPrefix;
					metaData.tdCls = baseCSSPrefix + 'grid-cell-special '
							+ baseCSSPrefix + 'grid-cell-row-checker';
					return '<div class="' + baseCSSPrefix
							+ 'grid-row-checker">&#160;</div>';

				}
			},
			// Overrided
			updateHeaderState : function() {
				var selectedCount = this.selected.getCount();
				var storeCount = this.store.getCount();
				var emptyRowCount = this.store.emptyRowCount
						? this.store.emptyRowCount
						: 0;
				// check to see if all records are selected
				var hdSelectStatus = (selectedCount === storeCount || selectedCount === storeCount
						- emptyRowCount);
				this.toggleUiHeader(hdSelectStatus);
			},
			listeners : {
				selectionchange : function(grid, selectedRecords, opts) {
					// me.fireEvent('gridRowSelectionChange',me,selectedRecords);
				},
				select : function(row, record, index, eopts) {
					var selectedRecords = me.getSelectionModel().getSelection();
					var jsonData = null;
					jsonData = me.store.proxy.reader.jsonData;
					if(me.nestedGridConfigs.isInnerGrid)
					{
					 me.fireEvent('innergridRowSelectionChange', me, record, index,
							selectedRecords, jsonData, 'select');
					}
					else
					me.fireEvent('gridRowSelectionChange', me, record, index,
							selectedRecords, jsonData, 'select');
				},
				deselect : function(row, record, index, eopts) {
					var selectedRecords = me.getSelectionModel().getSelection();
					var jsonData = null;
					jsonData = me.store.proxy.reader.jsonData;
					if(me.nestedGridConfigs.isInnerGrid)
					{
					 me.fireEvent('innergridRowSelectionChange', me, record, index,
							selectedRecords, jsonData, 'deselect');
					}
					else
					me.fireEvent('gridRowSelectionChange', me, record, index,
							selectedRecords, jsonData, 'deselect');
				},
				/** This is default implementation */
				beforeselect : function(chkBox, record, index, eOpts) {
					if (me.rowEditor && me.rowEditor.editing)
						return false;
					else
						return me.handleBeforeRowSelect(me, chkBox, record,
								index, eOpts);
				}
			}
		});
		return checkBoxModel;
	},
	/**
	 * Selects a record instance by record instance or index.
	 * 
	 * @param {Ext.data.Model[]/Number}
	 *            records An array of records or an index
	 * @param {Boolean}
	 *            [keepExisting=false] True to retain existing selections
	 * @param {Boolean}
	 *            [suppressEvent=false] True to not fire a select event
	 */
	selectRecord : function(records, keepExisting, suppressEvent) {
		var me = this;
		var selectionModel = me.getSelectionModel();
		if (selectionModel)
			selectionModel.select(records, keepExisting, suppressEvent);
	},
	/**
	 * Deselects a record instance by record instance or index.
	 * 
	 * @param {Ext.data.Model[]/Number}
	 *            records An array of records or an index
	 * @param {Boolean}
	 *            [suppressEvent=false] True to not fire a deselect event
	 */
	deSelectRecord : function(records, suppressEvent) {
		var me = this;
		var selectionModel = me.getSelectionModel();
		if (selectionModel)
			selectionModel.deselect(records, suppressEvent);
	},
	/** This is default implementation */
	handleBeforeRowSelect : function(grid, chkBox, record, index, eOpts) {
		if (record.get('isEmpty'))
			return false;
		else {
			if (!Ext.isEmpty(record.get('isActionTaken'))
					&& record.get('isActionTaken') === 'Y')
				return false;
			else
				return true;
		}
	},
	createRowNumberer : function() {
		var me = this;
		var isLocked = (me.enableLocking === true) ? true : false;
		var rowNumberer = Ext.create('Ext.grid.column.Column', {
			text : 'Seq. No.',
			colType : 'rowNumber',
			align : 'center',
			hideable : false,
			sortable : false,
			draggable : false,
			resizable : false,
			locked : isLocked,
			lockable : false,
			menuDisabled : true,
			// tdCls : 'xn-grid-cell-padding ',
			width : (me.rowNumbererColumnWidth || 80),
			minWidth : (me.rowNumbererColumnWidth || 35),
			renderer : function(value, metaData, record, rowIdx, colIdx, store) {
				if (record.get('isEmpty')) {
					if (rowIdx === 0) {
						metaData.style = "display:inline;text-align:center;position:absolute;white-space: nowrap !important;empty-cells:hide;";
						return getLabel('gridNoDataMsg',
								'No records present at this moment!');
					} else
						return '';
				} else {
					var curPage = store.currentPage;
					var pageSize = store.pageSize;
					var intValue = ((curPage - 1) * pageSize) + rowIdx + 1;
					if (Ext.isEmpty(intValue))
						intValue = rowIdx + 1;
					return intValue;
				}
			}
		});
		return rowNumberer;

	},
	updateSortViewToolbar : function() {
		var me = this;
		var store = me.getStore();
		var sorters = store.sorters;
		var toolbarItems = null;
		var sortToolbar = me.down('toolbar[itemId="sortToolbar"]');

		toolbarItems = new Array();
		if(sortToolbar != null){
			sortToolbar.setVisible(false);
	
			if (!Ext.isEmpty(sorters)) {
				toolbarItems.push({
							xtype : 'label',
							cls : 'ft-batch-action',
							padding : '6 0 2 4',
							text : getLabel('sortingorder','Sorting Order: '),
							reorderable : false
							// width : 80
						});
			}
			if (!Ext.isEmpty(sorters)) {
				sorters.each(function(item) {
					if (!Ext.isEmpty(item)) {
						var column = me.down('[dataIndex=' + item.property + ']');
						if (column) {
							var toolbarField = {
								xtype : 'splitbutton',
								// iconCls : (item.direction == 'ASC')
								// ? 'icon_sort_asc'
								// : 'icon_sort_desc',
								cls : 'xn-close-button',
								property : item.property,
								direction : item.direction,
								text : column.text,
								listeners : {
									'render' : function(button) {
										var contextMenu = new Ext.menu.Menu({
													showSeparator : false,
													items : [{
														text : getLabel(
																'btnRemove',
																'remove'),
														handler : function() {
															sortToolbar
																	.remove(button);
															column
																	.setSortState(null);
														}
													}]
												});
										var el = button.getEl();
										el.on('contextmenu', function(event) {
													contextMenu.showAt(event
															.getXY());
												});
									},
									'click' : function(btn) {
										var sortState = (btn.direction == 'ASC')
												? 'DESC'
												: 'ASC';
										column
												.setSortState(sortState, false,
														false);
									},
									'arrowclick' : function(btn) {
										sortToolbar.remove(btn);
										column.setSortState(null);
									},
									scope : this
								}
							};
							toolbarItems.push(toolbarField);
						}
					}
				});
			}
			if (!Ext.isEmpty(toolbarItems)) {
				sortToolbar.removeAll();
				sortToolbar.add(toolbarItems);
				sortToolbar.sorters = sorters;
				sortToolbar.setVisible(true);
			}
			if (toolbarItems.length == 1) {
				sortToolbar.removeAll();
				sortToolbar.setVisible(false);
			}
		}
	},
	doSort : function(ownerHeaderCt, header, state) {
		var ds = header.up('[store]').store;
		var me = this;
		if(me.showSorterToolbar === true){
			if( me.store.sorters.length > me.cfgSorterLimit){
				ds.sorters.removeAtKey(header.getSortParam());
				header.removeCls("x-column-header-sort-ASC");
				header.removeCls("x-column-header-sort-DESC");
				return false;
			}
		}
		if (state === null) {
			ds.sorters.removeAtKey(header.getSortParam());
		}
		if (me.fireSortChange === true) {
			ds.currentPage = !Ext.isEmpty(me.pageNo) ? me.pageNo : 1;
			if (me.multiSort === true && me.showSorterToolbar===true)
				me.updateSortViewToolbar();
			me.handleSortChange(1, 1);
		} else
			me.fireSortChange = true;
	},
	changeSortOrder : function(ux, container, dragCmp, startIdx, idx, eOpts) {
		if (startIdx === idx)
			return false;
		var me = this;
		var sortTbar = me.down('toolbar[itemId="sortToolbar"]');
		var toolbarItems = sortTbar ? sortTbar.items.items : [];
		var toolbarBtnArray = new Array();
		for (var count = 1; count < toolbarItems.length; count++) {
			toolbarBtnArray.push({
						property : toolbarItems[count].property,
						direction : toolbarItems[count].direction
					});
		}

		me.getStore().sort(toolbarBtnArray, null, false);
		me.getStore().currentPage = 1;
		me.handleSortChange(1, 1);
	},
	doEscapeHtmlJSONValues : function(sourceJSON) {
		var me = this;
		if (!Ext.isEmpty(sourceJSON)) {
			for (var i in sourceJSON) {
				if (typeof sourceJSON[i] === 'object') {
					me.doEscapeHtmlJSONValues(sourceJSON[i]);
				} else if (typeof sourceJSON[i] === 'string') {
					sourceJSON[i] = Ext.util.Format.htmlEncode(sourceJSON[i]);
				}
			}
		}
		return sourceJSON;
	},
	loadGridData : function(strUrl, ptFunction, args, showLoadingIndicator,
			scope, objPostParams, dataPreprocessor) {
		var me = this, blnLoad = true;
		var strRegex = /[?&]([^=#]+)=([^&#]*)/g, objParam = objPostParams || {}, arrMatches, strGeneratedUrl;
		if (!Ext.isEmpty(showLoadingIndicator)
				&& showLoadingIndicator === false)
			blnLoad = false;
		me.setLoading(blnLoad);
		if (me.enableQueryParam === false) {
			while (arrMatches = strRegex.exec(strUrl)) {
				objParam[arrMatches[1]] = decodeURIComponent(arrMatches[2]);
			}
			strGeneratedUrl = strUrl.substring(0, strUrl.indexOf('?'));
			
			// Stopping load grid service request if no mandatory filter selected.
			if(typeof gridMandatoryFilter != 'undefined' && gridMandatoryFilter === 'Y' 
					&& typeof _EntityType != 'undefined' && _EntityType == 0
					&& typeof arMandatoryFilterForGridLoad != 'undefined' && strGeneratedUrl)
			{
				var blnStopPageLoad = false;
				Ext.each(arMandatoryFilterForGridLoad, function(obj) {
					if(strGeneratedUrl.indexOf(obj.url) !== -1)
					{
						var blnIsFilterCheck = true;
						var data = obj.filter;
						//Extra request parameters check wherever it required.
						for (var key in data) {
							if (key != 'filter') {
	    						var value = data[key];
							    if (!Ext.isEmpty(objParam[key]) && objParam[key] == value) {
							    	blnIsFilterCheck = true;
							    }
							    else {
							    	blnIsFilterCheck = false;
							    	break;
							    }
						    }
						}
  						if (!Ext.isEmpty(data) && blnIsFilterCheck)
  						{
  							var rExp = new RegExp(data.filter,'g');
							if(Ext.isEmpty(objParam.$filter) || !(rExp.test(objParam.$filter)))
							{
								blnStopPageLoad = true;
								return false;
							}
  						}
					}
				});
				if(blnStopPageLoad)
				{
					var emptydata = {
							d : {}
						};
					me.store.loadRawData(emptydata);
					me.isFirstDataLoadCall = false;
					if (!Ext.isEmpty(ptFunction) && typeof ptFunction == 'function') {
						// ptFunction(me, data, args);
						Ext.callback(ptFunction, (scope || me), [me, emptydata, args,
										'Y']);
					}
					if (blnLoad)
						me.setLoading(false);
					
					return false;
				}
			}
		}
		strGeneratedUrl = !Ext.isEmpty(strGeneratedUrl)
				? strGeneratedUrl
				: strUrl;
		Ext.Ajax.request({
			url : strGeneratedUrl,
			method : 'POST',
			params : objParam,
			success : function(response) {
				var data = Ext.decode(!Ext.isEmpty(response.responseText) ? response.responseText : null);
				// Escape Html character in Response Data (JSON)
				if (me.escapeHtml === true) {
					data = me.doEscapeHtmlJSONValues(data);
				}
				if (!Ext.isEmpty(dataPreprocessor) && typeof dataPreprocessor == 'function')
				{
					data = dataPreprocessor(me, data);	
				}
				// TODO : Generate empty data based on configuration
				if (Ext.isEmpty(data))
					data = {
						d : {}
					};
				//Recall the service with page-1 if user navigates through pages and applies the filter.
				var result = me.store.proxy.reader.read(data);
				if(me.store.currentPage > 1 
						&& result.records.length === 0 && result.total > 0) {
					me.store.currentPage = 1;
					me.refreshData();
				}
				else {
					me.store.loadRawData(data);
					me.isFirstDataLoadCall = false;
					if (!Ext.isEmpty(ptFunction) && typeof ptFunction == 'function') {
						// ptFunction(me, data, args);
						Ext.callback(ptFunction, (scope || me), [me, data, args,
										'Y']);
					}
					if (blnLoad)
						me.setLoading(false);
				}
			},
			failure : function() {
				if (blnLoad)
					me.setLoading(false);
				me.fireEvent('gridLoadDataFails', me);
				Ext.MessageBox.show({
							title : getLabel('errorPopUpTitle', 'Error'),
							msg : getLabel('errorPopUpMsg',
									'Error while fetching data..!'),
							buttons : Ext.MessageBox.OK,
							buttonText: {
								ok: getLabel('btnOk', 'OK')
							},
							icon : Ext.MessageBox.ERROR
						});
				if (!Ext.isEmpty(ptFunction) && typeof ptFunction == 'function') {
					// ptFunction(me, data, args);
					Ext.callback(ptFunction, (scope || me), [me, null, args,
									'N']);
				}
			}
		});
	},
	handleStateChange : function(ct, colmn, width, opts) {
		this.fireEvent('statechange', this);
	},
	generateUrl : function(strUrl, pageSize, newPgNo, oldPgNo, sorterJson) {
		var me = this;
		var strSortUrl = null;
		me.store.currentPage = newPgNo;
		if (me.showAllRecords === true)
			strUrl = strUrl + '?$top=-1';
		else if (!Ext.isEmpty(pageSize))
			strUrl = strUrl + '?$top=' + pageSize;
		else
			strUrl = strUrl + '?$top=20';

		if (!Ext.isEmpty(newPgNo))
			strUrl = strUrl + '&$skip=' + newPgNo;
		else
			strUrl = strUrl + '&$skip=1';

		strUrl = strUrl + '&$inlinecount=allpages';

		strSortUrl = me.generateUrlWithSortParams(sorterJson);
		if (!Ext.isEmpty(strSortUrl))
			strUrl = strUrl + strSortUrl

		return strUrl;
	},

	generateUrlWithSortParams : function(sorters) {
		var strSort = '&$orderby=';
		var sortColumn = '';
		var strTemp = '';
		if (!Ext.isEmpty(sorters)) {
			sorters.each(function(item) {
				if (!Ext.isEmpty(item.property) && !Ext.isEmpty(item.direction)) {
					sortColumn = (typeof arrSortColumn != 'undefined')
							? arrSortColumn[item.property]
							: item.property;
					if (!Ext.isEmpty(sortColumn)) {
						strTemp = strTemp + sortColumn;
						strTemp = strTemp + ' '
								+ (item.direction).toLowerCase() + ',';
					}
				}
			});

			strTemp = strTemp.replace(/\,$/, '');
		}
		if (!Ext.isEmpty(strTemp))
			return strSort + strTemp;
		else
			return '';
	},
	handleRowExpand : function(record, grid, rowIndex){
		var me = this;
		me.nestedGridConfigs.innerGridConfig = grid.nestedGridConfigs.innerGridConfig;
		countExpand++;
		var view = grid.getView().normalView;
		var lview = grid.getView().lockedView;
		var lrow = lview.getNode(rowIndex);
        var lrowId = lrow.id;
		var row = grid.getView().getNode(record); 
		var rowId = row.id;
		var expandRow = $('#'+rowId).closest('tr').next();
		if(countExpand == 1)
			$('#'+lrowId).height(255);
		view.fireEvent('expandbody', row, record, expandRow, null, grid, rowIndex);
	},
	handleRenderInnerGrid : function(record, outerGrid, innerGrid, storeModel, rowIndex){
		var innerGridStore = Ext.create('Ext.data.Store', {	
			fields : storeModel.fields,
			data : record.data[storeModel.dataNode]
		});
		innerGrid.reconfigure(innerGridStore);	
		innerGrid.setHeight(record.data[storeModel.dataNode].length*50 + 50);
		var lview = outerGrid.getView().lockedView;
		var lrow = lview.getNode(rowIndex);
		var lrowId = lrow.id;
		var iscollapsed = $('#'+lrowId).hasClass( "x-grid-row-collapsed" );
		if(iscollapsed)
			$('#'+lrowId).height(55);
		else{
			$('#'+lrowId).height(record.data[storeModel.dataNode].length*50 + 50);
		}
	},
	handleAfterRender : function(grid) {
		var me = this;
		var isLockingEnable = grid.enableLocking;
			if (isLockingEnable) {
				var multisort = grid.normalGrid.features
						? grid.normalGrid.features[0]
						: null;
				if (multisort && !me.nestedGridConfigs.enableGridNesting)
					multisort.grid.headerCt.on('sortchange', this.doSort, this);
				else
					grid.on("sortchange", this.doSort, this);
	
				multisort = grid.lockedGrid.features
						? grid.lockedGrid.features[0]
						: null;
				if (multisort && !me.nestedGridConfigs.enableGridNesting)
					multisort.grid.headerCt.on('sortchange', this.doSort, this);
				else
					grid.on("sortchange", this.doSort, this);
				if (me.normalGrid && me.normalGrid.filters
						&& me.normalGrid.filters.grid)
					me.normalGrid.filters.grid.on('filterupdate', function() {
								me.fireEvent('columnfilterupdate',
										me.normalGrid.filters);
							});
				if (me.lockedGrid && me.lockedGrid.filters
						&& me.lockedGrid.filters.grid)
					me.lockedGrid.filters.grid.on('filterupdate', function() {
								me.fireEvent('columnfilterupdate',
										me.normalGrid.filters);
							});
	
			} else {
				var multisort = grid.features ? grid.features[0] : null;
				if (multisort && !me.nestedGridConfigs.enableGridNesting)
					multisort.view.headerCt.on('sortchange', this.doSort, this);
				else
					grid.on("sortchange", this.doSort, this);
				if (me.filters && me.filters.grid)
					me.filters.grid.on('filterupdate', function() {
								me.fireEvent('columnfilterupdate', me.filters);
							});
			}
		grid.getView().on('refresh', function() {
			var arrAllCols = me.getAllColumns()
			if (!Ext.isEmpty(me.enableColumnAutoWidth)
					&& me.enableColumnAutoWidth === true)
				me.autoSizeGridColumns();

			if (me.enableColumnDrag === true) {
				// TODO colSequence of each columns to be updated
			}

		});
		me.setSortState();
		me.updateSortViewToolbar();

	},
	getColumnFilterInstance : function() {
		var me = this;
		var objFilter = null;
		var isLockingEnable = me.enableLocking;
		if (isLockingEnable)
			objFilter = (me.lockedGrid && me.lockedGrid.filters
					? me.lockedGrid.filters
					: null)
					|| (me.normalGrid && me.normalGrid.filters
							? me.normalGrid.filters
							: null);
		else
			objFilter = me.filters || null;

		return objFilter;

	},
	getColumnFilterData : function(filter) {
		var me = this;
		var objData = null, retArray = null;
		var objFilter = (filter || me.getColumnFilterInstance());
		var arrData = null;
		if (objFilter) {
			arrData = objFilter.getFilterData() || [];
			Ext.each(arrData, function(obj) {
						objData = {};
						retArray = (retArray || {})
						objData['fieldName'] = obj.field;
						objData['type'] = obj.data.type;
						objData['value'] = obj.data.value;
						retArray[obj.field] = objData;
					});
		}
		return retArray;
	},

	onLockedHeaderSortChange : function(headerCt, header, sortState) {
		if (sortState) {
			// no real header, and silence the event so we dont get into an
			// infinite loop
			// this.normalGrid.headerCt.clearOtherSortStates(null, true);
		}
	},
	onNormalHeaderSortChange : function(headerCt, header, sortState) {
		if (sortState) {
			// no real header, and silence the event so we dont get into an
			// infinite loop
			// this.lockedGrid.headerCt.clearOtherSortStates(null, true);
		}
	},
	getState : function() {
		var me = this, state = me.callParent(), sorter = me.store.sorters
				.first(), sorters = me.store.sorters.items;
		// sorters = me.store.sorters;
		state = me.addPropertyToState(state, 'columns', (me.headerCt || me)
						.getColumnsState());
		if (sorters) {
			state = me.addPropertyToState(state, 'sort', sorters);
		}
		return state;
	},
	applyState : function(state) {
		var me = this, sorter = state.sort, store = me.store, columns = state.columns;
		delete state.columns;
		// Ensure superclass has applied *its* state.
		// AbstractComponent saves dimensions (and anchor/flex) plus collapsed
		// state.
		if (columns) {
			(me.headerCt || me).applyColumnsState(columns);
		}
		if (sorter) {
			if (store.remoteSort) {
				// Pass false to prevent a sort from occurring
				store.sort(sorter, null, false);
			} else {
				store.sort(sorter.property, sorter.direction);
			}
		}
		me.setSortState();
		if (me.multiSort === true && me.showSorterToolbar===true)
			me.updateSortViewToolbar();
	},
	setSortState : function() {
		var me = this;
		if (this.enableLocking) {
			var headerCt, sorters, grid;

			grid = this.normalGrid;
			headerCt = grid.view.headerCt;
			sorters = grid.store.sorters;

			headerCt.items.each(function(header) {
						sortState = header.sortState;
						if (sorters.containsKey(header.getSortParam())) {
							sorter = sorters.getByKey(header.getSortParam());
							header.suspendEvents();
							me.fireSortChange = false;
							header.setSortState(sorter.direction, false, true);
							header.resumeEvents();
						}
					}, grid);

			grid = this.lockedGrid;
			headerCt = grid.view.headerCt;
			sorters = grid.store.sorters;

			headerCt.items.each(function(header) {
						sortState = header.sortState;
						if (sorters.containsKey(header.getSortParam())) {
							sorter = sorters.getByKey(header.getSortParam());
							header.suspendEvents();
							me.fireSortChange = false;
							header.setSortState(sorter.direction, false, true);
							header.resumeEvents();
						}
					}, grid);
		}
	},
	handleColumnFilterUpdate : function(filters) {
		var me = this;
		var filterData = me.getColumnFilterData(filters);
		var objStore = me.store;
		var strUrl = objStore.dataUrl;
		me.fireEvent('gridColumnFilterChange', me, strUrl, me.pageSize, 1, me
						.getCurrentPage(), objStore.sorters, filterData);
	},
	getSelectedRecords : function() {
		var me = this;
		if (!Ext.isEmpty(me.getSelectionModel()))
			return me.getSelectionModel().getSelection();
		else
			return new Array();
	},
	setSelectedRecords : function(arrRecords, keepExisting, suppressEvent) {
		var me = this;
		if (!Ext.isEmpty(me.getSelectionModel()))
			me.getSelectionModel().select((arrRecords || []), keepExisting,
					suppressEvent);
	},
	selectAllRecords : function(suppressEvent) {
		var me = this;
		if (!Ext.isEmpty(me.getSelectionModel()))
			me.getSelectionModel().selectAll(suppressEvent);
	},
	enableCheckboxColumn : function(isEnabled) {
		var me = this;
		if (!Ext.isEmpty(me.showCheckBoxColumn)
				&& me.showCheckBoxColumn === true) {
			me.getSelectionModel().setLocked(isEnabled);
		}
	},
	refreshData : function() {
		var me = this;
		var pager = me.down('toolbar[xtype="smartGridPager"]');
		var oldPageNum = me.store.currentPage;
		var pageCount = (!Ext.isEmpty(pager) && !Ext.isEmpty(pager
				.getPageData().pageCount)) ? pager.getPageData().pageCount : 1;
		var current = pageCount === oldPageNum ? 1 : oldPageNum;
		me.store.currentPage = current;
		me.fireEvent('pagechange', me, current, oldPageNum);
	},
	getPageSize : function() {
		return this.store.pageSize;
	},
	getCurrentPage : function() {
		return this.store.currentPage;
	},
	getRecord : function(index) {
		var record = null;
		if (!Ext.isEmpty(index) && Ext.isNumeric(index))
			record = this.store.getAt(parseInt(index) - 1);
		return record;
	},
	getRecordIndex : function(record) {
		return this.store.indexOf(record) + 1;
	},
	getTotalRecordCount : function(index) {
		return this.store.totalCount;
	},
	getRow : function(index) {
		var row = null
		if (!Ext.isEmpty(index) && Ext.isNumeric(index))
			row = Ext.get(this.getView().getNode(parseInt(index) - 1))
		return row;
	},
	getLockedGridRow : function(index) {
		var row = null
		if (!Ext.isEmpty(index) && Ext.isNumeric(index) && this.lockedGrid)
			row = Ext.get(this.lockedGrid.getView()
					.getNode(parseInt(index) - 1))
		return row;
	},
	getDataUrl : function() {
		return this.store.dataUrl;
	},
	getSorters : function() {
		return this.store.sorters;
	},
	getAllColumns : function() {
		return this.columns;
	},
	getAllVisibleColumns : function() {
		return this.query('gridcolumn:not([hidden]):not([isGroupHeader])');
	},
	getRowNumber : function(index) {
		var curPage = this.getCurrentPage();
		var pageSize = this.getPageSize();
		if (Ext.isNumeric(index))
			return ((curPage - 1) * pageSize) + parseInt(index);
		return 0;
	},
	getFirstRowNumber : function(intPageNo) {
		var me = this;
		var curPage = this.getCurrentPage();
		if (Ext.isNumeric(intPageNo)) {
			curPage = intPageNo;
		}
		return ((curPage - 1) * pageSize) + parseInt(1);
	},
	getLastRowNumber : function(intPageNo) {
		var me = this;
		var curPage = this.getCurrentPage();
		var pageSize = this.getPageSize();
		if (Ext.isNumeric(intPageNo)) {
			curPage = intPageNo;
		}
		return ((curPage - 1) * pageSize) + parseInt(pageSize);
	},
	getRowIndex : function(intSerialNo) {
		var curPage = this.getCurrentPage();
		var retIndex = 0;
		var pageSize = this.getPageSize();
		if (Ext.isNumeric(intSerialNo)) {
			retIndex = (parseInt(intSerialNo) - ((curPage - 1) * pageSize)) - 1;
		}
		return retIndex;
	},
	moveToNextPage : function() {
		var me = this;
		var pager = me.down('toolbar[xtype="smartGridPager"]');
		if (pager) {
			pager.moveNext();
		}
	},
	moveToPrevousPage : function() {
		var me = this;
		var pager = me.down('toolbar[xtype="smartGridPager"]');
		if (pager) {
			pager.movePrevious();
		}
	},
	actionContentColumnRenderer : function(column, grid, value, meta, record,
			rowIndex, colIndex, store, view) {
		var me = this;
		var strRetValue = "";
		var arrActions = column.actions;
		var jsonData = store.proxy.reader.jsonData;
		var arrVisibleActions = [];
		var strToolTip = "";
		var intActionCount = !Ext.isEmpty(column.visibleRowActionCount)
				? parseInt(column.visibleRowActionCount)
				: 2;
		if (me.cfgEnableRowLevelActionComboStyling === true && column.disableComboStyle !== true)
			intActionCount = 0;

		if (!Ext.isEmpty(arrActions)) {
			for (var count = 0; count < arrActions.length; count++) {
				var fnIsVisible = null, blnIsEnabled = false, clickHandler = null;
				fnIsVisible = arrActions[count].fnVisibilityHandler;
				if (!Ext.isEmpty(fnIsVisible)
						&& typeof fnIsVisible == 'function')
					blnIsEnabled = fnIsVisible(store, record, jsonData,
							arrActions[count].itemId,
							arrActions[count].maskPosition);
				else if (!Ext.isEmpty(grid)
						&& !Ext.isEmpty(grid.isRowIconVisible))
					blnIsEnabled = grid.isRowIconVisible(store, record,
							jsonData, arrActions[count].itemId,
							arrActions[count].maskPosition);

				if (blnIsEnabled == true) {
					arrVisibleActions.push(arrActions[count]);
				}
			}

			if (!Ext.isEmpty(arrVisibleActions)) {
				for (var index = 0; index < arrVisibleActions.length; index++) {
					strToolTip = !Ext.isEmpty(arrVisibleActions[index].toolTip)
							? arrVisibleActions[index].toolTip
							: '';
					var actionCls = "action-link", actionText = "";
					if (!Ext.isEmpty(arrVisibleActions[index].itemCls))
						actionCls = arrVisibleActions[index].itemCls;
					if (!Ext.isEmpty(arrVisibleActions[index].text))
						actionText = arrVisibleActions[index].text;
					if (index < intActionCount) {
						strRetValue += '<a class="';
						if(column.id && column.id.toLowerCase().indexOf('_groupaction')!==-1){
							strRetValue += 'action-link-color';
						}else{
							strRetValue += 'grey';
						}
						strRetValue += ' cursor_pointer action-link-align '
								+ actionCls
								+ '" name="'
								+ arrVisibleActions[index].itemId
								+ '" title = "'
								+ strToolTip
								+ '">'
								+ actionText + '&nbsp;&nbsp;</a> ';
					} else if (index == intActionCount) {
						if (me.cfgEnableRowLevelActionComboStyling === true && column.disableComboStyle !== true)
							strRetValue += '<a class="icon-action-dropdown cursor_pointer" name="btnMore"  id="btnMore_'
									+ rowIndex + '">'+getLabel('select','Select')+ '</a>';
						else if (me.cfgEnableRowLevelActionComboStyling === false || column.disableComboStyle === true)
							strRetValue += '<a class="icon-dropdown cursor_pointer" name="btnMore"  id="btnMore_'
									+ rowIndex + '">&nbsp;&nbsp;</a>';
						break;
					}
				}
			}
		}
		return strRetValue;
	},
	columnRenderer : function(value, meta, record, rowIndex, colIndex, store,
			view, colId) {
		// meta.tdAttr = 'data-qtip="' + value + '"';
		return value;
	},
	summaryRenderer : function(value, summaryData, dataIndex, rowIndex,
			colIndex, store, view, colId) {
		// meta.tdAttr = 'data-qtip="' + value + '"';
		return '';
	},
	// TODO : To be removed
	// Can be overridden if needed
	handleRowMoreMenuClick : function(tableView, rowIndex, columnIndex, btn,
			event, record) {
		btn.menu.showAt(event.xy[0] + 5, event.xy[1] + 5);
	},
	// TODO : To be removed
	handleRowMoreMenuItemClick : function(menu, event) {
	},
	// Can be overridden if needed
	handleMoreMenuItemClick : function(gridView, rowIndex, cellIndex, menu,
			eventObj, record) {
	},

	handleRowIconClick : function(tableView, rowIndex, columnIndex, btn, event,
			record) {
	},

	isRowIconVisible : function(store, record, jsonData, itmId, maskPosition) {
		return true;
	},
	// TODO : To be removed
	isRowMoreMenuVisible : function(store, record, jsonData, itmId, menu) {
		return true;
	},
	removeAppliedSort : function() {
		var me = this;
		var store = me.getStore();
		var sorters = store.sorters;
		var sortToolbar = me.down('toolbar[itemId="sortToolbar"]');
		if (!Ext.isEmpty(sortToolbar)) {
			sortToolbar.setVisible(false);
			sortToolbar.removeAll();
		}
		if (!Ext.isEmpty(sorters)) {
			var column = null;
			sorters.each(function(item) {
						if (!Ext.isEmpty(item)) {
							column = me.down('[dataIndex=' + item.property
									+ ']');
							if (!Ext.isEmpty(column)) {
								me.fireSortChange = false;
								column.suspendEvents();
								column.setSortState(null);
								column.resumeEvents();
							}
						}
					});
		}
	},
	/*
	 * @param {sorter} array of JSON e.g : [ { "property": "client",
	 * "direction": "ASC", "root": "data" }, { "property": "clientReference",
	 * "direction": "ASC", "root": "data" } ]
	 */
	applySort : function(sorter) {
		var me = this, store = me.store;
		if (sorter) {
			if (store.remoteSort) {
				me.fireSortChange = false;
				// Pass false to prevent a sort from occurring
				store.sort(sorter, null, false);
				if (me.multiSort === true && me.showSorterToolbar===true)
					me.updateSortViewToolbar();
			}
		}
	},
	/**
	 * Returns the SmartGrid State.
	 * 
	 * @return {JSON} JSON object
	 * 
	 * @example { columns : [ { colId : 'effectiveDate', colHeader : 'Effective
	 *          Date', hidden : false, colType : 'string', width : 'auto',
	 *          allowSubTotal : 'N', metaInfo : {} } ], pageSize : 20, width :
	 *          'auto', height : 500 }
	 * 
	 */
	getGridState : function() {
		var me = this;
		var arrCols = null, objCol = null, arrColPref = null, objState = {}, objCfg = null;
		arrCols = me.headerCt.getGridColumns();
		arrColPref = new Array();
		for (var j = 0; j < arrCols.length; j++) {
			objCol = arrCols[j];
			if (!Ext.isEmpty(objCol) && !Ext.isEmpty(objCol.itemId)
					&& objCol.itemId.startsWith('col_')
					&& !Ext.isEmpty(objCol.xtype)
					&& objCol.colType != 'actioncontent'
					&& objCol.colType != 'action'
					&& objCol.colType != 'emptyColumn') {
				objCfg = {
					colId : objCol.dataIndex,
					colHeader : objCol.text,
					hidden : objCol.hidden,
					colType : objCol.colType,
					width : objCol.width,
					metaInfo : objCol.metaInfo,
					allowSubTotal : objCol.allowSubTotal,
					sortable : objCol.sortable,
					align : objCol.align,
					colSequence : objCol.colSequence

				};
				if (!Ext.isEmpty(objCol.locked))
					objCfg.locked = objCol.locked;
				arrColPref.push(objCfg);
			}
		}
		objState['columns'] = arrColPref;
		objState['pageSize'] = me.getPageSize();
		objState['width'] = me.getWidth();
		objState['height'] = me.getHeight();
		objState['sortState'] = me.getSortState();
		return objState;
	},
	/**
	 * Returns the SmartGrid sorter.
	 * 
	 * @return {JSON} JSON object
	 * 
	 * @example { sortState:[ {"property":"account", "direction":"ASC"} ] }
	 */
	getSortState : function() {
		var me = this;
		var arrSortState = new Array(), store = me.getStore(), arrSorters = store.sorters, arrSorter = arrSorters
				? arrSorters.items
				: [];
		for (var i = 0; i < arrSorter.length; i++) {
			arrSortState.push({
						property : arrSorter[i].property,
						direction : arrSorter[i].direction
					});
		}
		return arrSortState;
	},
	doValidateRecordEdit : function(record, editor, grid, context) {

	},
	doBeforeRecordEdit : function(record, editor, grid, context) {
		return true;
	},
	doRecordEdit : function(record, editor, grid, context) {

	},
	doRecordEditPrevious : function(prevRecord, currentRecord, editor, grid,
			preContext) {

	},
	doCancelRecordEdit : function(record, editor, grid, context) {

	},
	handleRightContextMenu : function(gridView, record, item, index, e, eOpts) {
		var me = this, isEditorOn = false;
		isEditorOn = me.rowEditor && me.rowEditor.editing ? me.rowEditor.editing : false; 
		var arrVisibleActions = me.getArrVisibleActions(gridView, record, item,
				index, e, eOpts);
		if (!isEditorOn && !Ext.isEmpty(arrVisibleActions)) {
			me.createRightClickMenu(arrVisibleActions, gridView, record, item,
					index, e, eOpts);
		}
	},
	getArrVisibleActions : function(gridView, record, item, index, e, eOpts) {
		var me = this;
		var columnModel = null, columnAction = null, arrVisibleActions = [], arrAvailableActions = [], store, jsonData;
		if (!Ext.isEmpty(me.columnModel)) {
			columnModel = me.columnModel;
			for (var index = 0; index < columnModel.length; index++) {
				if (columnModel[index].colId == 'actioncontent') {
					columnAction = columnModel[index].items;
					break;
				}
			}
		}

		if (!Ext.isEmpty(columnAction))
			arrAvailableActions = columnAction;
		store = me.getStore();
		jsonData = store.proxy.reader.jsonData;
		if (!Ext.isEmpty(arrAvailableActions)) {
			for (var count = 0; count < arrAvailableActions.length; count++) {
				var btnIsEnabled = false;
				if (!Ext.isEmpty(me) && !Ext.isEmpty(me.isRowIconVisible)) {
					btnIsEnabled = me.isRowIconVisible(store, record, jsonData,
							arrAvailableActions[count].itemId,
							arrAvailableActions[count].maskPosition);
					if (btnIsEnabled == true) {
						arrVisibleActions.push(arrAvailableActions[count]);
						btnIsEnabled = false;
					}
				}
			}
		}
		return arrVisibleActions;
	},
	createRightClickMenu : function(arrVisibleActions, gridView, record, item,
			rowindex, e, eOpts) {
		var me = this;
		var arrMoreMenuActions = [], objMenu = null;
		for (var index = 0; index < arrVisibleActions.length; index++) {
			var clickHandler = null, text = "";
			if (!Ext.isEmpty(arrVisibleActions[index].text))
				text = arrVisibleActions[index].text;
			else if (!Ext.isEmpty(arrVisibleActions[index].itemLabel))
				text = arrVisibleActions[index].itemLabel;

			arrMoreMenuActions.push({
				text : text,
				itemId : arrVisibleActions[index].itemId,
				iconCls : arrVisibleActions[index].itemCls,
				maskPosition : arrVisibleActions[index].maskPosition,
				fnClickHandler : arrVisibleActions[index].fnClickHandler,
				fnIconRenderer : arrVisibleActions[index].fnIconRenderer,
				handler : function(menu) {
					menu.dataParams = {
						'record' : record,
						'rowIndex' : rowindex,
						// 'columnIndex' : cellIndex,
						'view' : gridView
					};
					if (!Ext.isEmpty(menu))
						clickHandler = menu.fnClickHandler;
					if (!Ext.isEmpty(clickHandler)
							&& typeof clickHandler == 'function') {
						clickHandler(gridView, rowindex, null, menu, e, record);
					} else
						me.handleMoreMenuItemClick(gridView, rowindex, null,
								menu, e, record);
				}
			});
		}

		if (me.rightClickMoreMenu)
			me.rightClickMoreMenu.destroy(true);
		if (!Ext.isEmpty(arrMoreMenuActions)) {
			objMenu = Ext.create('Ext.menu.Menu', {
						itemId : 'rightClickMoreMenu',
						floating : true,
						cls : 'action-dropdown-menu',
						autoHeight : true,
						minWidth: 150,
						maxWidth: 560,
						items : arrMoreMenuActions,
						listeners : {
							'hide' : function() {
							}
						}
					});
			objMenu.showAt(e.getXY());
			if (e.target)
				objMenu.anchorTo(e.target);
			me.rightClickMoreMenu = objMenu;
		}
	}

});