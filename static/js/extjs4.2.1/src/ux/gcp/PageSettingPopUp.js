/**
 * @class Ext.ux.gcp.PageSettingPopUp
 * @extends Ext.window.Window
 * @author Shraddha Chauhan
 * @author Vinay Thube
 */
Ext.define('Ext.ux.gcp.PageSettingPopUp', {
	extend : 'Ext.window.Window',
	xtype : 'pageSettingPopUp',
	autoHeight : true,
	closeAction : 'destroy',
	cls : 'xn-popup pagesetting',
	modal : true,
	requires : ['Ext.form.field.ComboBox', 'Ext.form.Label'],
	width : '60%',
	itemId : 'pageSettingPopUp',
	id : 'pageSettingPopUp',
	draggable : false,
	resizable : false,
	constrainHeader : true,
	title : getLabel("Settings", "Settings"),
	showAdvanceFilter : true,
	cfgGridHeight : 300,
	/**
	 * @cfg{JSON} cfgPopUpData, The cfgPopUpData used for page setting popup
	 *            initiatlization
	 * 
	 * @example {
	 *	"groupByData": [{
	 *		"groupTypeDesc": "Status",
	 *		"groupTypeCode": "PAYSUM_OPT_STATUS",
	 *		"autoRefresh": "N",
	 *		"groups": [{
	 *			"groupId": "STATUS",
	 *			"groupCode": "STATUS_DRAFT",
	 *			"groupDescription": "Draft and Repair",
	 *			"groupQuery": "hasInstrDraft eq 1"
	 *		}, {
	 *			"groupId": "STATUS",
	 *			"groupCode": "STATUS_PENDING",
	 *			"groupDescription": "Pending Approval and Posting",
	 *			"groupQuery": "hasInstrPending eq 1"
	 *		}]
	 *	}, {
	 *		"groupTypeDesc": "Payment Category",
	 *		"groupTypeCode": "PAYSUM_OPT_PRODCAT",
	 *		"autoRefresh": "N",
	 *		"groups": [{
	 *			"groupId": "productCategory",
	 *			"groupCode": "CAT_ACCTRAN",
	 *			"groupDescription": "Account Transfer",
	 *			"groupQuery": "ProductCategory eq 'ACCOUNTTRF'",
	 *			"columns": [{
	 *				"colId": "clientReference",
	 *				"colDesc": "Payment Reference",
	 *				"width": 160,
	 *				"isTypeCode": "N",
	 *				"allowSubTotal": "N",
	 *				"colType": "string",
	 *				"colHeader": "Payment Reference",
	 *				"colSequence": 1,
	 *				"hidden": false,
	 *				"hideable": true
	 *			}, {
	 *				"colId": "sendingAccount",
	 *				"colDesc": "Sending Account#",
	 *				"width": 140,
	 *				"isTypeCode": "N",
	 *				"allowSubTotal": "N",
	 *				"colType": "string",
	 *				"colHeader": "Sending Account#",
	 *				"colSequence": 2,
	 *				"hidden": false,
	 *				"hideable": true
	 *			}]
	 *		}, {
	 *			"groupId": "productCategory",
	 *			"groupCode": "CAT_ACH",
	 *			"groupDescription": "ACH",
	 *			"groupQuery": "ProductCategory eq 'ACH'",
	 *			"columns": [{
	 *				"colId": "recieverName",
	 *				"colDesc": "Receiver Name ",
	 *				"width": 160,
	 *				"isTypeCode": "N",
	 *				"allowSubTotal": "N",
	 *				"colType": "string",
	 *				"colHeader": "Receiver Name ",
	 *				"colSequence": 3,
	 *				"hidden": false,
	 *				"hideable": true
	 *			}, {
	 *				"colId": "amount",
	 *				"colDesc": "Amount ",
	 *				"width": 140,
	 *				"isTypeCode": "N",
	 *				"allowSubTotal": "N",
	 *				"colType": "amount",
	 *				"colHeader": "Amount ",
	 *				"colSequence": 4,
	 *				"hidden": false,
	 *				"hideable": true
	 *			}]
	 *		}]
	 *	}],
	 *	"filterUrl": "services/userfilterslist/groupViewFilter.json",
	 *	"rowPerPage": [10, 25, 50, 100, 200, 500],
	 *	"groupByVal": "PAYSUM_OPT_STATUS",
	 *	"filterVal": "",
	 *	"gridSizeVal": "M",
	 *	"rowPerPageVal": 50
	 *	}
	 * 
	 * @default null
	 */
	cfgPopUpData : null,
	/**
	 * @cfg{Array} cfgDefaultColumnModel This is default/super set of columns
	 *             applicable if groupview's cfgCaptureColumnSettingAt has value
	 *             G i.e global. This will be either from gridset/use
	 *             defined/preferences.
	 * 
	 * @example [{
	 * 				"allowSubTotal": "N",
	 *				"colDesc": "Sending Account#",
	 *				"colHeader": "Sending Account#",
	 *				"colId": "sendingAccount",
	 *				"colType": "string",
	 *				"hidden": false,
	 *				"hideable": true,
	 *				"isTypeCode": "N",
	 *				"width": 140,
	 *				"locked": true,
	 *				"metaInfo": "",
	 *				"colSequence": 2
	 *			}, {
	 *				"allowSubTotal": "N",
	 *				"colDesc": "Payment Reference",
	 *				"colHeader": "Payment Reference",
	 *				"colId": "clientReference",
	 *				"colType": "string",
	 *				"hidden": false,
	 *				"hideable": false,
	 *				"isTypeCode": "N",
	 *				"width": 160,
	 *				"locked": true,
	 *				"metaInfo": "",
	 *				"colSequence": 1
	 *			}]
	 * @default []
	 */
	cfgDefaultColumnModel : [],
	/**
	 * @cfg{Ext.ux.gcp.GroupView} cfgGroupView Instance of groupview
	 * @default null
	 */
	cfgGroupView : null,
	cfgViewOnly : false,
	/**
	 * @cfg{String} cfgInvokedFrom Invoked from. i.e PAGE : Page Setting click,
	 *              GRID : Grid setting clicked
	 * 
	 * @default null
	 */
	cfgInvokedFrom : 'PAGE',
	initComponent : function() {
		var me = this, cfgData = me.cfgPopUpData, arrItems = new Array(), objFilterPanel = null, objGridPanel = null, strCaputerAt = me.cfgGroupView
				&& me.cfgGroupView.cfgCaptureColumnSettingAt
				? me.cfgGroupView.cfgCaptureColumnSettingAt
				: 'G';
		me.cfgViewOnly = !Ext.isEmpty(me.cfgViewOnly)
				&& typeof me.cfgViewOnly === 'boolean' ? me.cfgViewOnly : false;
		objFilterPanel = me.createFilterPanel();
		objGridPanel = me.createGridPanel(cfgData);
		if (strCaputerAt === 'G'
				|| (strCaputerAt === 'L' && me.cfgInvokedFrom === 'PAGE'))
			arrItems.push(objFilterPanel);
		if (strCaputerAt === 'G'
				|| (strCaputerAt === 'L' && me.cfgInvokedFrom === 'GRID'))
			arrItems.push(objGridPanel);
		me.items = arrItems;
		me.bbar = [{
					xtype : 'button',
					text : getLabel('btncancel', 'Cancel'),
					itemId : 'cancelBtn',
					cls : 'ft-button ft-button-light',
					tabIndex : '1',
					handler : function() {
						me.destroy();
					}
				}, '->', {
					xtype : 'button',
					text : getLabel('btnRestore', "Restore"),
					cls : 'ft-btn-link',
					tabIndex : '1',
					hidden : me.cfgViewOnly,
					handler : function() {
						me.restoreSettings();
					},
					listeners :
						{
							focus : function(thisObj, eventObj, thisOptions)
							{
								$("#"+thisObj.id+" span").addClass("hover-link-span");
							},
							mouseover : function(thisObj, eventObj, thisOptions)
							{
								$("#"+thisObj.id+" span").addClass("hover-link-span");
							},
							blur : function(thisObj, eventObj, thisOptions)
							{
								$("#"+thisObj.id+" span").removeClass("hover-link-span");
							},
							mouseout : function(thisObj, eventObj, thisOptions)
							{
								$("#"+thisObj.id+" span").removeClass("hover-link-span");
							}
						}
				}, {
					xtype : 'button',
					text : getLabel('btnSave', "Save"),
					cls : 'ft-btn-link',
					tabIndex : '1',
					hidden : me.cfgViewOnly || strCaputerAt === 'L',
					handler : function() {
						me.handleApplySetting('Y');
					},
					listeners :
					{
						focus : function(thisObj, eventObj, thisOptions)
						{
							$("#"+thisObj.id+" span").addClass("hover-link-span");
						},
						mouseover : function(thisObj, eventObj, thisOptions)
						{
							$("#"+thisObj.id+" span").addClass("hover-link-span");
						},
						blur : function(thisObj, eventObj, thisOptions)
						{
							$("#"+thisObj.id+" span").removeClass("hover-link-span");
						},
						mouseout : function(thisObj, eventObj, thisOptions)
						{
							$("#"+thisObj.id+" span").removeClass("hover-link-span");
						}
					}
				}, {
					xtype : 'button',
					text : getLabel('btnApply', "Apply"),
					cls : 'ft-button canDisable ft-button-primary ft-margin-l',
					tabIndex : '1',
					hidden : me.cfgViewOnly,
					handler : function() {
						me.handleApplySetting('N');
					}
				}];
		me.on('resize', function() {
					me.doLayout();
				});
		me.callParent(arguments);
	},
	createFilterPanel : function() {
		var me = this, objFilterContainer, cfgData = me.cfgPopUpData;
		var objDefaultGroupByStore, objGridSizeStore, objRowPerPageStore;
		var strGroupByValue = '', strDefaultFilterVal = '', gridSizeVal = '', rowPerPageVal = '', arrRows = [], blnHideFilter = false;
		if (!Ext.isEmpty(cfgData)) {
			strGroupByValue = cfgData.groupByVal || '';
			strDefaultFilterVal = cfgData.filterVal || '';
			gridSizeVal = cfgData.gridSizeVal || '';
			rowPerPageVal = cfgData.rowPerPageVal || '';
		}
		objDefaultGroupByStore = me.createDefaultGroupByStore();
		objGridSizeStore = me.createGridSizeStore();
		arrRows = me.cfgGroupView && me.cfgGroupView.cfgGridModel
				&& me.cfgGroupView.cfgGridModel.rowList
				? me.cfgGroupView.cfgGridModel.rowList
				: cfgData.rowPerPage;
		blnHideFilter = ((me.cfgGroupView
				&& !Ext.isEmpty(me.cfgGroupView.cfgShowAdvancedFilterLink) && me.cfgGroupView.cfgShowAdvancedFilterLink === true))
				? false
				: true;

		if (blnHideFilter === false)
			blnHideFilter = (me.showAdvanceFilter === true) ? false : true;

		objRowPerPageStore = me.createRowPerPageStore(arrRows);

		objFilterContainer = Ext.create('Ext.container.Container', {
					itemId : 'filterContainer',
					layout : 'vbox',
					width : '100%',
					autoHeight : true
				});
		var strGroupByValue = !Ext.isEmpty(objDefaultGroupByStore
										.findRecord('key', strGroupByValue))
										? strGroupByValue
										: (objDefaultGroupByStore && !Ext
												.isEmpty(objDefaultGroupByStore
														.getAt(0)))
												? (objDefaultGroupByStore
														.getAt(0)).get('key')
												: '';
		var objGeneralFilterPanel = Ext.create('Ext.container.Container', {
			itemId : 'generalFilterPanel',
			autoHeight : true,
			width : '100%',
			items : [{
				xtype : 'fieldset',
				title : getLabel('defaultView', 'Default View'),
				autoHeight : true,
				layout : 'hbox',
				width : '100%',
				//hidden : strGroupByValue === 'none' && blnHideFilter,
				items : [{
					xtype : 'container',
					itemId : 'groupByContainer',
					layout : 'vbox',
					//hidden : strGroupByValue === 'none',
					flex : 1,
					items : [{
								xtype : 'label',
								text : getLabel('groupVy', 'Group By')
							}, {
								xtype : 'combo',
								itemId : 'defaultGroupByCombo',
								name : 'defaultGroupBy',
								width : 200,
								editable : false,
								/*disabled : me.cfgViewOnly || (objDefaultGroupByStore
											&& objDefaultGroupByStore.data
											&& objDefaultGroupByStore.data.items
											&& objDefaultGroupByStore.data.items.length === 1 ? true : false),*/
								displayField : 'value',
								valueField : 'key',
								queryMode : 'local',
								triggerAction : 'all',
								matchFieldWidth : true,
								fieldCls  : (objDefaultGroupByStore
											&& objDefaultGroupByStore.data
											&& objDefaultGroupByStore.data.items
											&& objDefaultGroupByStore.data.items.length === 1 ? 'grid-field x-form-field ' : 'x-form-field'),
								store : objDefaultGroupByStore,
								value : strGroupByValue,
								//hidden : strGroupByValue === 'none',
								tabIndex : '1'
							}]
				}, {
					xtype : 'container',
					itemId : 'defaultFilter',
					layout : 'vbox',
					hidden : blnHideFilter,
					flex : 1,
					items : [{
								xtype : 'label',
								text : getLabel('defaultFilter',
										'Default Filter')
							}, {
								xtype : 'combo',
								width : 200,
								valueField : 'filterName',
								displayField : 'filterValue',
								disabled : me.cfgViewOnly,
								fieldCls  : (me.cfgViewOnly ? 'grid-field x-form-field ' : 'x-form-field'),
								queryMode : 'local',
								itemId : 'defaultFilterCombo',
								triggerAction : 'all',
								editable : false,
								tabIndex : '1',
								store : me
										.createDefaultFilterStore(blnHideFilter ? '' : cfgData.filterUrl),
								// value : strDefaultFilterVal,
								listeners : {
									afterrender : function(combo) {
										var objStore = combo.getStore();
										objStore.on('load', function() {
											if (!Ext.isEmpty(objStore)) {
												var strDefFilter = objStore.findRecord('filterName', strDefaultFilterVal);
												var recordSelected = Ext.isEmpty(strDefaultFilterVal) ||Ext.isEmpty(strDefFilter)
														? objStore.getAt(0) 
														: strDefFilter;

												if (!Ext.isEmpty(recordSelected))
													combo.setValue(recordSelected.get('filterName'));
											}
										});
									}
								}
							}]
				}]
			}]
		});

		var objGridSettingFilterPanel = Ext.create('Ext.container.Container', {
			itemId : 'gridSettingFilterPanel',
			autoHeight : true,
			width : '100%',
			padding : '10 0 0 0',
			items : [{
				xtype : 'fieldset',
				title : getLabel('gridSetting', 'Table Settings'),
				autoHeight : true,
				layout : 'hbox',
				width : '100%',
				items : [{
							xtype : 'container',
							itemId : 'rowPerPageContainer',
							layout : 'vbox',
							flex : 1,
							items : [{
										xtype : 'label',
										text : getLabel('rowperpage',
												'Rows Per Page')
									}, {
										xtype : 'combo',
										valueField : 'key',
										width : 200,
										disabled : me.cfgViewOnly,
										fieldCls  : (me.cfgViewOnly ? 'grid-field x-form-field ' : 'x-form-field'),
										displayField : 'value',
										queryMode : 'local',
										itemId : 'rowPerPageCombo',
										triggerAction : 'all',
										// emptyText : getLabel('select',
										// 'Select'),
										editable : false,
										store : objRowPerPageStore,
										value : rowPerPageVal || '',
										tabIndex : '1'
									}]
						}, {
							xtype : 'container',
							itemId : 'gridSizeContainer',
							layout : 'vbox',
							flex : 1,
							items : [{
										xtype : 'label',
										text : getLabel('gridSize',
												'Table Size')
									}, {
										xtype : 'combo',
										itemId : 'girdSizeCombo',
										name : 'girdSizeCombo',
										width : 200,
										editable : false,
										disabled : me.cfgViewOnly,
										fieldCls  : (me.cfgViewOnly ? 'grid-field x-form-field ' : 'x-form-field'),
										displayField : 'value',
										valueField : 'key',
										queryMode : 'local',
										triggerAction : 'all',
										tabIndex : '1',
										// emptyText : getLabel('select',
										// 'Select'),
										matchFieldWidth : true,
										store : objGridSizeStore,
										value : gridSizeVal || _GridSizeVal,
										listeners1 : {
											afterrender : function(combo) {
												var objStore = combo.getStore();
												objStore.on('load', function() {
													if (!Ext.isEmpty(objStore)) {
														var recordSelected = Ext
																.isEmpty(gridSizeVal)
																? objStore
																		.getAt(0)
																: objStore
																		.findRecord(
																				'key',
																				gridSizeVal);
														if (!Ext
																.isEmpty(recordSelected))
															combo
																	.setValue(recordSelected
																			.get('key'));
													}
												});
											}
										}
									}]
						}]
			}]
		});

		objFilterContainer.add(objGeneralFilterPanel);
		objFilterContainer.add(objGridSettingFilterPanel);
		return objFilterContainer;
	},
	createGridPanel : function(objData) {
		var me = this;
		var objGridContainer, objGrid, objGridFieldSet = null, objGridStore = null, arrColumns = [], objSmartGrid = me.cfgGroupView
				? me.cfgGroupView.getGrid()
				: null;
		arrColumns = (me.cfgGroupView
				&& me.cfgGroupView.cfgCaptureColumnSettingAt === 'G'
				? me.cfgDefaultColumnModel
				: (objSmartGrid ? objSmartGrid.getAllColumns() : []))
				|| [];
		objGridStore = me.createColumnSettingGridStore(arrColumns);
		objGridContainer = Ext.create('Ext.container.Container', {
					itemId : 'gridContainer',
					width : '100%',
					autoHeight : true
				});

		objGrid = Ext.create('Ext.grid.Panel', {
			store : objGridStore,
			height : me.cfgGridHeight,
			itemId : 'columnSettingGrid',
			forceFit : true,
			cls : 't7-grid',
			columns : [{
				text : 'Seq. No.',
				flex:0.1,
				align : 'center',
				sortable : false,
				itemId : 'rowNumber',
				menuDisabled : true,
				draggable : false,
				resizable: false,
				renderer : function(value, meta, record, rowIndex, colIndex,
						store, view) {
					meta.tdAttr = 'data-qtip="'+(rowIndex + 1)+'"';
					return rowIndex + 1;
				}
			}, {
				text : getLabel('columnname', 'Column Name'),
				dataIndex : 'colHeader',
				itemId : 'columnName',
				flex:0.24,
				sortable : false,
				menuDisabled : true,
				align : 'left',
				draggable : false,
				resizable: false,
				renderer : function(value, meta, record, rowIndex, colIndex,
						store, view) {
					value = me.columnRenderer(value, meta, record, rowIndex,
							colIndex, store, view);
					var value1 = value.replace(/\s/g,'');
                    value = getLabel(value1,value)
                     meta.tdAttr = 'title="' + value + '"';
					return value;
				}
			}, {
				xtype : 'checkcolumn',
				text : getLabel('hideColumn', 'Hide Column'),
				dataIndex : 'hidden',
				flex:0.24,
				itemId : 'hideColumn',
				sortable : false,
				align : 'left',
				menuDisabled : true,
				draggable : false,
				resizable: false,
				renderer : function(value, meta, record, rowIndex, colIndex,
						store, view) {
					var isHidden = value;
					var isHideable = record.data.hideable;
					var cssPrefix = Ext.baseCSSPrefix, cls = [cssPrefix
							+ 'grid-checkcolumn'];

					if (this.disabled || me.cfgViewOnly) {
						meta.tdCls += ' ' + this.disabledCls;
					}
					if (isHideable == true && isHidden == true) {
						cls.push(cssPrefix + 'grid-checkcolumn-checked');
					} else if (isHideable == false && isHidden == false) {
						cls.push(cssPrefix + 'grid-checkcolumn-unchecked');
						meta.tdCls += ' ' + this.disabledCls;
					} else if (isHideable == true && isHidden == false) {
						cls.push(cssPrefix + 'grid-checkcolumn-unchecked');
					}
					return '<img class="' + cls.join(' ') + '" src="'
							+ Ext.BLANK_IMAGE_URL + '"/>';
				},
				listeners : {
					checkchange : function(check, rowIndex, checked, eOpts) {
						me.handleHiddenColumn(check, rowIndex, checked);
					},
					beforecheckchange : function(checkcolumn, rowIndex,
							checked, eOpts) {
						if (me.cfgViewOnly === true)
							return false;
						var objGridStore = this
								.up('grid[itemId="columnSettingGrid"]')
								.getStore();
						// all columns can not be hidden
						var nTotalHide = 0 ;
						for (i=0; i< objGridStore.data.items.length; i++){
							var objRecord = objGridStore.getAt(i);
							if (!Ext.isEmpty(objRecord)) {
								if (objRecord.data.hidden)
									++nTotalHide;
							}
							
						}
						if(nTotalHide==objGridStore.data.items.length-1 && checked)
						{
							var errMsg = "Atleast one column has to be Unhide";
							Ext.MessageBox.show({
								title : 'Message',
								msg : errMsg,
//								buttons :[{
////									xtype : 'button',
//									itemId : 'btnPageSettingErrorPopupClose',
////									tabIndex : '1',
////									cls : 'ft-button ft-button-light',
//									text : getLabel( 'btnOk', 'Close' ),
////									handler : function()
////									{
////										$(this).close();
////									}
//								}],
								buttons : Ext.MessageBox.OK,
								icon : Ext.MessageBox.INFO
							});
							return false;
						}
						if (!Ext.isEmpty(objGridStore)) {
							var objRecord = objGridStore.getAt(rowIndex);
							if (!Ext.isEmpty(objRecord)) {
								if (objRecord.data.hideable == false)
									return false;
								else {
									return true;
								}
							}
						}
					}
				}
			}, {
				xtype : 'checkcolumn',
				text : getLabel('freezeColumn', 'Freeze Column'),
				dataIndex : 'locked',
				flex:0.24,
				sortable : false,
				itemId : 'freezeColumn',
				align : 'left',
				menuDisabled : true,
				draggable : false,
				resizable: false,
				renderer : function(value, meta, record, rowIndex, colIndex,
						store, view) {
					
					var isLocked = value;
					var isLockable = !Ext.isEmpty(record.data.lockable) ? record.data.lockable : true;
					var cssPrefix = Ext.baseCSSPrefix, cls = [cssPrefix
							+ 'grid-checkcolumn'];

					if (this.disabled || me.cfgViewOnly) {
						meta.tdCls += ' ' + this.disabledCls;
					}
					if (isLockable == true && isLocked == true) {
						cls.push(cssPrefix + 'grid-checkcolumn-checked');
					} else if (isLockable == false && isLocked == false) {
						cls.push(cssPrefix + 'grid-checkcolumn-unchecked');
						meta.tdCls += ' ' + this.disabledCls;
					} else if (isLockable == true && isLocked == false) {
						cls.push(cssPrefix + 'grid-checkcolumn-unchecked');
					}
					return '<img class="' + cls.join(' ') + '" src="'
							+ Ext.BLANK_IMAGE_URL + '"/>';
				},
				listeners : {
					beforecheckchange : function(checkcolumn, rowIndex,
							checked, eOpts) {
						
						var objGridStore = this
								.up('grid[itemId="columnSettingGrid"]')
								.getStore();
						if (!Ext.isEmpty(objGridStore)) {
							var objRecord = objGridStore.getAt(rowIndex);
							if (!Ext.isEmpty(objRecord)) {
								if (objRecord.data.hidden == true)
									return false;
							}
						}
						if (!Ext.isEmpty(objGridStore)) {
							var objRecord = objGridStore.getAt(rowIndex);
							if (!Ext.isEmpty(objRecord)) {
								if (objRecord.data.lockable == false)
									return false;
								else {
									return true;
								}
							}
						}
						if (me.cfgViewOnly === true)
							return false;
					}
				}
			}, {
				xtype : 'actioncolumn',
				align : 'center',
				flex:0.24,
				itemId : 'orderColumn',
				header : getLabel('columnorder', 'Column Order'),
				sortable : false,
				menuDisabled : true,
				draggable : false,
				resizable: false,
				align : 'left',
				items : [{
					iconCls : 'grid-row-up-icon',
					tooltip : getLabel('up', 'Up'),
					handler : function(grid, rowIndex, colIndex) {
						if (!me.cfgViewOnly){
							grid.saveScrollState();
							me.handleGridRecordOreder(grid, rowIndex, -1);
							grid.restoreScrollState();
						}
					},
					getClass : function(value, meta, record, rowIx, ColIx,
							store) {
						var arrStoreData = store.data.items;
						return (rowIx == 0)
								? 'grid-row-up-icon invisible'
								: 'grid-row-up-icon';
					}
				}, {
					iconCls : 'grid-row-down-icon',
					tooltip : getLabel('down', 'Down'),
					handler : function(grid, rowIndex, colIndex) {
						if (!me.cfgViewOnly){
							grid.saveScrollState();
							me.handleGridRecordOreder(grid, rowIndex, 1);
							grid.restoreScrollState();
						}
					},
					getClass : function(value, meta, record, rowIx, ColIx,
							store) {
						var arrStoreData = store.data.items;
						var storeItemLength = store.data.items.length;

						return (rowIx == storeItemLength - 1)
								? 'x-hide-display'
								: 'grid-row-down-icon';
					}
				}],
				renderer : function(value, meta, record, rowIndex, colIndex,
						store, view) {
					value = me.columnRenderer(value, meta, record, rowIndex,
							colIndex, store, view);
					return value;
				}
			}],
			viewConfig : {
				getRowClass : function(record, index) {
					if (!Ext.isEmpty(record)) {
						var data = record.data;
						if (data.locked === true)
							return 'xn-freeze-row';
						else
							return;
					}
				}
			}
		});
		if (me.cfgInvokedFrom !== 'GRID') {
			objGridFieldSet = Ext.create('Ext.form.FieldSet', {
						title : getLabel('columnsetting', 'Column Settings'),
						width : '100%',
						items : [objGrid]
					});

			objGridContainer.add(objGridFieldSet);
		} else
			objGridContainer.add(objGrid);
		return objGridContainer;
	},
	columnRenderer : function(value, meta, record, rowIndex, colIndex, store,
			view) {
		if(!Ext.isEmpty(colIndex) && colIndex === 1)
			meta.tdAttr = 'data-qtip="'+value+'"';
		return value;
	},
	createDefaultGroupByStore : function() {
		var me = this, objStore = null, arrGroups = null, cfgData = me.cfgPopUpData, arrData = [];
		arrGroups = (me.cfgGroupView && me.cfgGroupView.cfgGroupByData
				? me.cfgGroupView.cfgGroupByData
				: cfgData.groupByData)
				|| [];
		for (var i = 0; i < arrGroups.length; i++)
			arrData.push({
						key : arrGroups[i].groupTypeCode,
						value : getLabel(arrGroups[i].groupTypeCode,arrGroups[i].groupTypeDesc)
					});

		objStore = Ext.create('Ext.data.Store', {
					fields : ['key', 'value'],
					data : arrData
				})
		/*objStore.insert(0, {
					'key' : '',
					'value' : 'Select'
				})*/;
		return objStore;
	},
	createDefaultFilterStore : function(strUrl) {
		var me = this, objStore = null;
		if (strUrl)
			objStore = Ext.create('Ext.data.ArrayStore', {
						autoLoad : true,
						fields : ['filterName', 'filterValue'],
						proxy : {
							type : 'ajax',
							url : strUrl,
							reader : {
								type : 'json',
								root : 'd.filters'
							}
						},
						listeners : {
							load : function(store, records, success, opts) {
								store.each(function(record) {
											record
													.set('filterName',
															record.raw);
											record.set('filterValue',
													record.raw);
										});
								store.insert(0, {
											'filterName' : '',
											'filterValue' : getLabel('select', 'Select')
										});
							}
						}
					});
		else
			objStore = Ext.create('Ext.data.Store', {
						fields : ['filterName', 'filterName'],
						data : [{
									'filterName' : '',
									'filterValue' : getLabel('select', 'Select')
								}]
					});
		return objStore;
	},
	createGridSizeStore : function() {
		var me = this;
		var objStore = Ext.create('Ext.data.Store', {
					autoload : true,
					fields : ['key', 'value'],
					data : [{
								'key' : 'S',
								'value' : getLabel('small', 'Small')
							}, {
								'key' : 'M',
								'value' : getLabel('medium', 'Medium')
							}, {
								'key' : 'L',
								'value' : getLabel('large', 'Large')
							},
							{
								'key' : 'A',
								'value' : getLabel('autosize', 'AutoSize')
							}]
				});
		return objStore;
	},
	createRowPerPageStore : function(arrRows) {
		var me = this, objStore, arrData = new Array();
		if (!Ext.isEmpty(arrRows)) {
			for (var i = 0; i < arrRows.length; i++)
				arrData.push({
							key : arrRows[i],
							value : arrRows[i]
						});
			objStore = Ext.create('Ext.data.Store', {
						fields : ['key', 'value'],
						autoload : true,
						data : arrData
					})
		}
		return objStore;
	},
	createColumnSettingGridStore : function(arrColumns) {
		var me = this, arrCols, locked = false, arrData = new Array(), objStore, col = null;
		arrData = me.populateColumnSettingGridStoreData(arrColumns);
		objStore = Ext.create('Ext.data.Store', {
					/*
					 * fields:['columnName', 'isColHidden',
					 * 'freezeColumn','colWidth','isColHideable'],
					 */
					fields : ['allowSubTotal', 'colDesc', 'colHeader', 'colId',
							'colType', 'isTypeCode', 'width', 'metaInfo',
							'colSequence', {
								name : 'locked',
								type : 'boolean',
								defaultValue : false
							}, {
								name : 'hidden',
								type : 'boolean',
								defaultValue : false
							}, {
								name : 'hideable',
								type : 'boolean',
								defaultValue : true
							}, {
								name : 'hideable',
								type : 'boolean',
								defaultValue : true
							},{
								name : 'lockable',
								type : 'boolean',
								defaultValue : true
							}],
					data : {
						'items' : arrData
					},
					proxy : {
						type : 'memory',
						reader : {
							type : 'json',
							root : 'items'
						}
					}
				});

		return objStore;
	},
	loadColumnSettingGridStoreData : function(arrRawData) {
		var me = this, grid = me.down('grid[itemId="columnSettingGrid"]');
		if (grid)
			grid.store.loadRawData(arrRawData || []);
	},
	populateColumnSettingGridStoreData : function(arrColumns) {
		var me = this, locked = false, arrData = new Array(), col = null;
		if (!Ext.isEmpty(arrColumns)) {
			for (var i = 0; i < arrColumns.length; i++) {
				col = arrColumns[i];
				if (col.colType != 'actioncontent' && col.colType != 'action'
						&& col.colType != 'emptyColumn') {
					locked = false;
					if (!Ext.isEmpty(col.locked) && col.locked == true)
						locked = true;
					arrData.push({
								allowSubTotal : col.allowSubTotal,
								colDesc : col.colDesc || col.text,
								colHeader : col.colHeader || col.text,
								colId : col.colId
										|| (col.itemId || '').replace('col_',
												''),
								colType : col.colType,
								hidden : col.hidden,
								hideable : col.hideable,
								width : col.width,
								colSequence : col.colSequence,
								locked : locked,
								metaInfo : col.metaInfo,
								lockable : !Ext.isEmpty(col.lockable) ? col.lockable : true 
							});
				}
			}
		}
		return arrData;
	},
	
	handleHiddenColumn : function(checkboxcolumn, rowIndex, checked) {
		var me = this,objGird,objStore,currentRecord;
		var isObjHide,isObjFreeze;
		objGird = me.down('grid[itemId="columnSettingGrid"]');
		if (!Ext.isEmpty(objGird))
			objStore = objGird.getStore();
		
		currentRecord = objGird.getStore().getAt(rowIndex);
		if(!Ext.isEmpty(currentRecord)){
		isObjHide = currentRecord.get('hidden');
		if(isObjHide)
			currentRecord.set('locked', false);
		}
	},
	handleGridRecordOreder : function(grid, rowIndex, direction) {
		var me = this;
		var objGird = me.down('grid[itemId="columnSettingGrid"]');
		var record = grid.getStore().getAt(rowIndex);

		var store = grid.getStore();
		if (!record) {
			return;
		}
		var index = rowIndex;

		if (direction < 0) {
			index--;
			if (index < 0) {
				return;
			}
			var beforeRecord = store.getAt(index);
			store.remove(beforeRecord);
			store.remove(record);

			store.insert(index, record);
			store.insert(index + 1, beforeRecord);
		} else {
			if (index >= grid.getStore().getCount() - 1) {
				return;
			}
			var currentRecord = record;
			store.remove(currentRecord);
			var afterRecord = store.getAt(index);
			store.remove(afterRecord);
			store.insert(index, afterRecord);
			store.insert(index + 1, currentRecord);
		}
		//objGird.getView().refresh();
		store.each(function(rcd, idx) {
					rcd.set('colSequence', idx + 1);
					//rcd.commit();
				});
		// me.handleVisualIndicationGridRow(true);
	},
	getRow : function(index) {
		var me = this;
		var row = null
		var objGird = me.down('grid[itemId="columnSettingGrid"]');
		if (!Ext.isEmpty(index) && Ext.isNumeric(index)
				&& !Ext.isEmpty(objGird))
			row = Ext.get(objGird.getView().getNode(parseInt(index)))
		return row;
	},
	handleVisualIndicationGridRow : function(blnVal) {
		var me = this;
		var objGrid, objGridStore, arrGridStoreData;
		objGrid = me.down('grid[itemId="columnSettingGrid"]');
		if (!Ext.isEmpty(objGrid)) {
			objGridStore = objGrid.getStore();
			if (objGridStore && objGridStore.data && objGridStore.data.items)
				arrGridStoreData = objGridStore.data.items;

			Ext.each(arrGridStoreData, function(cfg, index) {
						var objData = cfg.data;
						var targetRow;
						if (!Ext.isEmpty(objData))
							if (objData.locked == true) {
								targetRow = me.getRow(index);
								targetRow.addCls('xn-freeze-row');
							} else if (objData.locked == false) {
								targetRow = me.getRow(index);
								targetRow.removeCls('xn-freeze-row');
							}

					});
		}
	},
	handleApplySetting : function(strSaveOnly) {
		var me = this, objGrpBy = null, blnIsGroupByHidden = false, strCaputerAt = me.cfgGroupView
				&& me.cfgGroupView.cfgCaptureColumnSettingAt
				? me.cfgGroupView.cfgCaptureColumnSettingAt
				: 'G';
		var blnHideFilter = ((me.cfgGroupView
				&& !Ext.isEmpty(me.cfgGroupView.cfgShowAdvancedFilterLink) && me.cfgGroupView.cfgShowAdvancedFilterLink === true))
				? false
				: true;
		if (blnHideFilter === false)
			blnHideFilter = (me.showAdvanceFilter === true) ? false : true;
		objGrpBy = me.down('combo[itemId="defaultGroupByCombo"]');
		blnIsGroupByHidden = objGrpBy &&  objGrpBy.isHidden() === true? true : false; 
		
		if (me.cfgInvokedFrom === 'PAGE') {
			var msgPopup = Ext.create('Ext.window.Window', {
				autoHeight : true,
				height : (screen.width > 1024) ? 200 : 150,
				closeAction : 'destroy',
				cls : 'xn-popup pagesetting',
				modal : true,
				requires : ['Ext.form.field.ComboBox', 'Ext.form.Label'],
				width : '40%',
				itemId : 'pageSettingPopUp',
				draggable : false,
				resizable : false,
				title : getLabel("Message", "Message"),
				bbar : [{
							xtype : 'button',
							text : getLabel('btncancel', 'Cancel'),
							itemId : 'cancelBtn',
							id : 'cancelBtnSetting',
							tabIndex : "1",
							cls : 'ft-button ft-btn-light',
							handler : function() {
								msgPopup.destroy();
							}
						}, '->', {
							xtype : 'button',
							tabIndex : "1",
							cls : 'ft-button ft-btn-primary',
							text : getLabel('btnOk', "Ok"),
							handler : function() {
								me
										.postHandleApplySetting(
												this
														.up('window')
														.down('checkboxgroup[itemId="checkSettingId"]')
														.getValue(), msgPopup,
												strSaveOnly);

							}
						}],
				layout : 'vbox',
				items : [{
							xtype : 'label',
							text : getLabel('selectionMsg',
										'Please select what to be saved.')
						}, {
							xtype : 'checkboxgroup',
							columns : 3,
							width : '100%',
							vertical : false,
							layout : 'column',
							itemId : 'checkSettingId',
							id : 'checkSettingId',
							items : [{
								boxLabel : getLabel('defaultView',
										'Default View'),
								name : 'GeneralSetting',
								checked : true,
								tabIndex : "1",
								columnWidth : 0.33,
								id : 'GeneralSetting',
								hidden : blnIsGroupByHidden && blnHideFilter
							}, {
								boxLabel : getLabel('lblGridSetting',
										'Table Settings'),
								name : 'GridSetting',
								checked : true,
								tabIndex : "1",
								id : 'GridSetting',
								columnWidth : 0.33
							}, {
								boxLabel : getLabel('lblColumnSetting',
										'Column Settings'),
								name : 'ColumnSetting',
								checked : strCaputerAt === 'L' ? false : true,
								tabIndex : "1",
								columnWidth : 0.33,
								Id : 'ColumnSetting',
								hidden : strCaputerAt === 'L'
							}],
							listeners : {
								change : function(fld, newValue, oldValue,
										eOpts) {
									var objVal = this.getValue();
									if (Ext.isEmpty(objVal['GeneralSetting'])
											&& Ext
													.isEmpty(objVal['GridSetting'])
											&& Ext
													.isEmpty(objVal['ColumnSetting'])) {
										this.setValue(oldValue);
									}
								}
							}
						}]
			});
			msgPopup.show();
			msgPopup.center();
			Ext.getCmp('GeneralSetting').focus();
		} else {
			me.postHandleApplySetting({
						"ColumnSetting" : "on"
					}, null, strSaveOnly)
		}
	},
	/**
	 * The function postHandleApplySetting handles apply setting
	 * 
	 * @param{JSON} JSON object of confirmation popup values
	 * 
	 * returns JSON preference array
	 * 
	 * @example
	 * ObjConfirm Data : 
	 * { 
	 * 	"GeneralSetting": "on", 
	 * 	"GridSetting": "on",
	 * 	"ColumnSetting": "on" 
	 * }
	 * 
	 * Return JSON : 
	 * [{
	 *		"module": "GeneralSetting",
	 *		"jsonPreferences": {
	 *			"defaultGroupByCode": "PAYSUM_OPT_STATUS",
	 *			"defaultGroupByDesc": "Status",
	 *			"defaultFilterCode": "",
	 *			"defaultFilterDesc": ""
	 *	}
	 *}, {
	 *	"module": "GridSetting",
	 *	"jsonPreferences": {
	 *		"defaultGridSize": "M",
	 *		"defaultGridSizeDesc": "Medium",
	 *		"defaultRowPerPage": 50,
	 *		"defaultRowPerPageDesc": "50"
	 *	}
	 *}, {
	 *	"module": "ColumnSetting",
	 *	"jsonPreferences": {
	 *		"gridCols": [{
	 *			"allowSubTotal": "N",
	 *			"colDesc": "Sending Account#",
	 *			"colHeader": "Sending Account#",
	 *			"colId": "sendingAccount",
	 *			"colType": "string",
	 *			"hidden": false,
	 *			"hideable": true,
	 *			"isTypeCode": "N",
	 *			"width": 140,
	 *			"locked": true,
	 *			"metaInfo": "",
	 *			"colSequence": 2
	 *		}, {
	 *			"allowSubTotal": "N",
	 *			"colDesc": "Payment Reference",
	 *			"colHeader": "Payment Reference",
	 *			"colId": "clientReference",
	 *			"colType": "string",
	 *			"hidden": false,
	 *			"hideable": false,
	 *				"isTypeCode": "N",
	 *				"width": 160,
	 *				"locked": true,
	 *				"metaInfo": "",
	 *				"colSequence": 1
	 *			}]
	 *		}
	 *	}]
	 * 
	 */
	postHandleApplySetting : function(objConfirmData, msgPopup, strSaveOnly) {
		var me = this, arrPref = me.getPreferenceData(objConfirmData);
		if (strSaveOnly === 'Y')
			me.fireEvent('savePageSetting', me, arrPref, me.cfgInvokedFrom);
		else
			me.fireEvent('applyPageSetting', me, arrPref, me.cfgInvokedFrom);
		if (msgPopup)
			msgPopup.destroy();
		me.close();
	},
	getPreferenceData : function(objConfirmData) {
		var me = this;
		var arrPref = [], arrGridJson = [], objGeneralSetting = {}, objGridOptionSetting = {}, objConfirmData = objConfirmData
				|| {};
		var objGrpBy, objDefaultFilter, objGridSize, objRowPerPage;
		var objGrid, objGridStore, arrStoreData;
		var arrFreezeCol=[],arrHideCol=[],arrUnHideCol=[],arrGridCol = [];
		
		if (objConfirmData['GeneralSetting']) {
			objGrpBy = me.down('combo[itemId="defaultGroupByCombo"]');
			if (!Ext.isEmpty(objGrpBy)) {
				var objVal = objGrpBy.getValue();
				if (objVal === 'Select')
					objVal = "";
				objGeneralSetting.defaultGroupByCode = objVal;
				objGeneralSetting.defaultGroupByDesc = objGrpBy.getRawValue();
			}
			objDefaultFilter = me.down('combo[itemId="defaultFilterCombo"]');
			if (!Ext.isEmpty(objDefaultFilter)) {
				var objVal = objDefaultFilter.getValue();
				if (objVal === getLabel('select', 'Select'))
					objVal = "";
				objGeneralSetting.defaultFilterCode = objVal || '';
				objGeneralSetting.defaultFilterDesc = objDefaultFilter
						.getRawValue();
			}
			arrPref.push({
						"module" : "GeneralSetting",
						"jsonPreferences" : objGeneralSetting
					});
		}
		if (objConfirmData['GridSetting']) {
			objGridSize = me.down('combo[itemId="girdSizeCombo"]');
			if (!Ext.isEmpty(objGridSize)) {
				var objVal = objGridSize.getValue();
				/*
				 * if (objVal === 'Select') objVal = "";
				 */
				objGridOptionSetting.defaultGridSize = objVal;
				objGridOptionSetting.defaultGridSizeDesc = objGridSize
						.getRawValue();
			}
			objRowPerPage = me.down('combo[itemId="rowPerPageCombo"]');
			if (!Ext.isEmpty(objRowPerPage)) {
				var objVal = objRowPerPage.getValue();
				/*
				 * if (objVal === 'Select') objVal = "";
				 */
				objGridOptionSetting.defaultRowPerPage = objVal;
				objGridOptionSetting.defaultRowPerPageDesc = objRowPerPage
						.getRawValue();
			}
			arrPref.push({
						"module" : "GridSetting",
						"jsonPreferences" : objGridOptionSetting
					});
		}
		if (objConfirmData['ColumnSetting']) {
			objGrid = me.down('grid[itemId="columnSettingGrid"]');
			if (!Ext.isEmpty(objGrid)) {
				objGridStore = objGrid.getStore();
				if (!Ext.isEmpty(objGridStore)) {
					arrStoreData = objGridStore.data.items;
					Ext.each(arrStoreData,function(cfg,index){
						var objData = cfg.data;
						if(objData['locked'] === true){
							arrFreezeCol.push(objData);
						}
						else if(objData['hidden'] === true){
							arrHideCol.push(objData);
						}
						else{
							arrUnHideCol.push(objData);
						}
					});
					
					arrFreezeCol = me.sortByKey(arrFreezeCol,'colSequence');
					arrHideCol = me.sortByKey(arrHideCol,'colSequence');
					arrUnHideCol = me.sortByKey(arrUnHideCol,'colSequence');
					arrGridCol = arrGridCol.concat(arrFreezeCol,arrUnHideCol,arrHideCol);
					Ext.each(arrGridCol, function(cfg,index) {
							cfg.colSequence = index+1;
							arrGridJson.push(cfg);
						});
				}
			}
			arrPref.push({
						"module" : "ColumnSetting",
						"jsonPreferences" : {
							'gridCols' : arrGridJson
						}
					});
		}
		return arrPref;

	},
	restoreSettings : function() {
		var me = this, objConfirmData = {
			"GeneralSetting" : "on",
			"GridSetting" : "on",
			"ColumnSetting" : "on"
		}, strCaputerAt = me.cfgGroupView
				&& me.cfgGroupView.cfgCaptureColumnSettingAt
				? me.cfgGroupView.cfgCaptureColumnSettingAt
				: 'G';
		if (strCaputerAt === 'L' && me.cfgInvokedFrom === 'GRID') {
			delete objConfirmData['GeneralSetting'];
			delete objConfirmData['GridSetting']
		} else if (strCaputerAt === 'L' && me.cfgInvokedFrom === 'PAGE') {
			delete objConfirmData['ColumnSetting'];
		}
		me.fireEvent('restorePageSetting', me, me
						.getPreferenceData(objConfirmData), me.cfgInvokedFrom);
		me.close();

	},
	sortByKey : function(array, key) {
	    return array.sort(function(a, b) {
	        var x = a[key]; var y = b[key];
	        return ((x < y) ? -1 : ((x > y) ? 1 : 0));
	    });
	},
	listeners:{
        show:function(){
           setTimeout(function() {autoFocusOnFirstElement(null, 'pageSettingPopUp',true);}, 100);
        }
    }
});