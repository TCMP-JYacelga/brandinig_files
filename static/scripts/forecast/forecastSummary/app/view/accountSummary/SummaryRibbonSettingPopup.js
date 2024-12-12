Ext.define('GCP.view.accountSummary.SummaryRibbonSettingPopup', {
	extend : 'Ext.window.Window',
	xtype : 'summaryRibbonSettingPopup',
	autoHeight : true,
	closeAction : 'destroy',
	cls : 'xn-popup pagesetting',
	modal : true,
	requires : ['Ext.form.field.ComboBox', 'Ext.form.Label'],
	width : '60%',
	draggable : false,
	resizable : false,
	title : getLabel("summaryInfo", "Summary Information"),
	cfgPopUpData : {},
	cfgDefaultColumnModel : [],
	cfgViewOnly : false,
	cfgInvokedFrom : 'PAGE',
	initComponent : function() {
		var me = this, cfgData = me.cfgPopUpData, arrItems = new Array(), objFilterPanel = null, objGridPanel = null;
		me.cfgViewOnly = !Ext.isEmpty(me.cfgViewOnly)
				&& typeof me.cfgViewOnly === 'boolean' ? me.cfgViewOnly : false;
		objFilterPanel = me.createFilterPanel();
		objGridPanel = me.createGridPanel(cfgData);
		arrItems.push(objFilterPanel);
		arrItems.push(objGridPanel);
		me.items = arrItems;
		me.bbar = [{
					xtype : 'button',
					text : getLabel('btncancel', 'Cancel'),
					itemId : 'cancelBtn',
					cls : 'ft-btn-light',
					handler : function() {
						me.destroy();
					}
				}, '->', {
					xtype : 'button',
					text : getLabel('btnRestore', "Restore"),
					cls : 'ft-btn-link',
					hidden : me.cfgViewOnly,
					handler : function() {
						me.handleRestoreSettings();
					}
				}, {
					xtype : 'button',
					text : getLabel('btnSave', "Save"),
					cls : 'ft-btn-link',
					hidden : me.cfgViewOnly,
					handler : function() {
						me.handleSaveSettings('Y');
					}
				}, {
					xtype : 'button',
					text : getLabel('btnApply', "Apply"),
					cls : 'ft-btn-primary',
					hidden : me.cfgViewOnly,
					handler : function() {
						me.handleApplySetting('N');
					}
				}];		
		me.on('resize', function() {
					me.doLayout();
					me.center();
				});
		me.callParent(arguments);
		me.on('refresh',function(){
			this.center();
		});
	},
	createFilterPanel : function() {
		var me = this, objFilterContainer, cfgData = me.cfgPopUpData;
		var strCurrencyValue = strSellerCcy, CharDisplayBalSummary ='';
		if (!Ext.isEmpty(cfgData)) {
			strCurrencyValue = cfgData.cfgData 
							&& cfgData.cfgData.d.preferences
							&& cfgData.cfgData.d.preferences.GeneralSetting
							&& cfgData.cfgData.d.preferences.GeneralSetting.defaultCcyCode || '';
			CharDisplayBalSummary = cfgData.isDisplayBalSum || '';
		}
		
		objFilterContainer = Ext.create('Ext.container.Container', {
					itemId : 'filterContainer',
					layout : 'vbox',
					width : '100%',
					autoHeight : true
				});
		var objGeneralFilterPanel = Ext.create('Ext.container.Container', {
			itemId : 'generalFilterPanel',
			autoHeight : true,
			hidden : false,
			width : '100%',
			items : [{
				xtype : 'fieldset',
				title : getLabel('defaultView', 'Default Filter'),
				autoHeight : true,
				layout : 'hbox',
				width : '100%',
				items : [ {
					xtype : 'container',
					itemId : 'defaultCurrencyContainer',
					layout : 'vbox',
					flex : 1,
					items : [{
								xtype : 'label',
								text : getLabel('defaultEquivalentCurrency',
										'Summary Information to be shown in')
							}, {
								xtype : 'combo',
								width : 250,
								valueField : 'CODE',
								displayField : 'DESCR',
								disabled : me.cfgViewOnly,
								emptyText : getLabel('selectCurrency',
										'Select Currency'),
								queryMode : 'local',
								itemId : 'defaultCurrencyCombo',
								triggerAction : 'all',
								editable : true,
								store : me.createDefaultCurrencyStore(cfgData.currencyUrl),
								value : (!Ext.isEmpty(strCurrencyValue) ? strCurrencyValue :strSellerCcy),
								listeners : {
									'focus' : function(c){
										c.expand();
									}
								}
							}]
				}]
			}]
		});

		objFilterContainer.add(objGeneralFilterPanel);
		return objFilterContainer;
	},
	createDefaultCurrencyStore : function(strUrl) {
		var me = this, objStore = null;
		objStore = Ext.create('Ext.data.ArrayStore', {
					autoLoad : true,
					fields : ['CODE','DESCR','SYMBOL'],
					proxy : {
						type : 'ajax',
						url : strUrl,
						reader : {
							type : 'json',
							root : 'd.preferences'
						}
					}
				})
		return objStore;
	},
	createGridPanel : function() {
		var me = this;
		var objGridContainer, objGrid, objGridFieldSet = null, objGridStore = null, arrColumns = [];
		arrColumns = me.cfgDefaultColumnModel ? me.cfgDefaultColumnModel : [] ;
		objGridStore = me.createColumnSettingGridStore(arrColumns);
		objGridContainer = Ext.create('Ext.container.Container', {
					itemId : 'gridContainer',
					width : '100%',
					autoHeight : true
				});

		objGrid = Ext.create('Ext.grid.Panel', {
			store : objGridStore,
			maxHeight : 300,
			minHeight : 100,
			itemId : 'columnSettingGrid',
			forceFit : true,
			cls : 't7-grid',
			columns : [{
				text : '#',
				width : 10,
				align : 'center',
				sortable : false,
				itemId : 'rowNumber',
				menuDisabled : true,
				renderer : function(value, meta, record, rowIndex, colIndex,
						store, view) {
					return rowIndex + 1;
				}
			}, {
				text : getLabel('columnname', 'Column Name'),
				dataIndex : 'colHeader',
				itemId : 'columnName',
				width : 40,
				sortable : false,
				menuDisabled : true,
				align : 'left',
				renderer : function(value, meta, record, rowIndex, colIndex,
						store, view) {
					value = me.columnRenderer(value, meta, record, rowIndex,
							colIndex, store, view);
					return value;
				}
			}, {
				xtype : 'checkcolumn',
				text : getLabel('hideColumn', 'Hide Column'),
				dataIndex : 'hidden',
				width : 25,
				itemId : 'hideColumn',
				sortable : false,
				align : 'left',
				menuDisabled : true,
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
						this.up('grid[itemId="columnSettingGrid"]').getView().restoreScrollState();
					},
					beforecheckchange : function(checkcolumn, rowIndex,
							checked, eOpts) {
						this.up('grid[itemId="columnSettingGrid"]').getView().saveScrollState();
						if (me.cfgViewOnly === true)
							return false;
						var objGridStore = this
								.up('grid[itemId="columnSettingGrid"]')
								.getStore();
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
			},{
				xtype : 'actioncolumn',
				align : 'center',
				width : 25,
				itemId : 'orderColumn',
				header : getLabel('columnorder', 'Column Order'),
				sortable : false,
				menuDisabled : true,
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
			}]
		});
		objGridFieldSet = Ext.create('Ext.form.FieldSet', {
			title : getLabel('columnsetting', 'Column Settings'),
			width : '100%',
			items : [objGrid]
		});

		objGridContainer.add(objGridFieldSet);
		objGridContainer.add(objGrid);
		return objGridContainer;
	},
	columnRenderer : function(value, meta, record, rowIndex, colIndex, store,
			view) {
		return value;
	},
	createColumnSettingGridStore : function(arrColumns) {
		var me = this, arrCols, arrData = new Array(), objStore, col = null;
		arrData = me.populateColumnSettingGridStoreData(arrColumns);
		objStore = Ext.create('Ext.data.Store', {
					fields : ['allowSubTotal', 'colDesc', 'colHeader', 'colId',
							'colType', 'isTypeCode', 'width', 'metaInfo',
							'colSequence', {
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
	populateColumnSettingGridStoreData : function(arrColumns) {
		var me = this, arrData = new Array(), col = null;
		if (!Ext.isEmpty(arrColumns)) {
			for (var i = 0; i < arrColumns.length; i++) {
				col = arrColumns[i];
				
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
								isTypeCode : col.isTypeCode || 'N',
								width : col.width,
								colSequence : col.colSequence
								
							});
				}
			}
		return arrData;
	},
	handleHiddenColumn : function(checkboxcolumn, rowIndex, checked, strEvent) {
		var me = this, currentRecord, previousRecord, objStore, objstoreLength;
		var objGird = me.down('grid[itemId="columnSettingGrid"]');
		if (!Ext.isEmpty(objGird)) {
			if (strEvent == 'up') {
				objStore = objGird.getStore();
				currentRecord = objGird.getStore().getAt(rowIndex);
				if (!currentRecord)
					return;

				objStore.remove(currentRecord);
				var visibleRecordsCount = 0;
				var arrStoreData = objStore.data.items;
				Ext.each(arrStoreData, function(cfg) {
							var objData = cfg.data;
							if (objData.hidden == false) {
								visibleRecordsCount++;
								return true;
							} else if (objData.hidden == true) {
								return false;
							}
						});
				objStore.insert(visibleRecordsCount, currentRecord);
			} else if (strEvent == 'down') {
				objStore = objGird.getStore();
				currentRecord = objGird.getStore().getAt(rowIndex);
				if (!currentRecord)
					return;

				objStore.remove(currentRecord);
				if (objStore && objStore.data && objStore.data.items)
					objstoreLength = objStore.data.items.length;
				objStore.insert(objstoreLength, currentRecord);
			}
			//objGird.getView().refresh();
			objStore.each(function(rcd, idx) {
						rcd.set('colSequence', idx + 1);
						//rcd.commit();
					});
		}
	},
	handleApplySetting : function(){
		var me = this;
		var me = this,arrPref = me.getPreferenceData();
		me.fireEvent('applyPageSetting', me, arrPref, me.cfgInvokedFrom);
		me.close();
	},
	handleSaveSettings : function(){
		var me = this;
		var me = this,arrPref = me.getPreferenceData();
		me.fireEvent('savePageSetting', me, arrPref, me.cfgInvokedFrom);
		me.close();
	},
	handleRestoreSettings : function(){
		var me = this;
		var me = this,arrPref = me.getPreferenceData();
		me.fireEvent('restorePageSetting', me, arrPref, me.cfgInvokedFrom);
		me.close();
	},
	getPreferenceData : function() {
		var me = this;
		var arrPref = [], arrGridJson = [], objGeneralSetting = {};
		var objBalsummChkBox, objDefaultEqCcy;
		var objGrid, objGridStore,objDefaultEqCcyStore, arrStoreData,arrCcyStoreData;
		var arrHideCol=[],arrUnHideCol=[],arrGridCol = [];

		/*objBalsummChkBox = me.down('checkbox[itemId="disBalSummCheckBox"]');
			if (!Ext.isEmpty(objBalsummChkBox)) {
				var objVal = objBalsummChkBox.getValue();
				
				objGeneralSetting.defaultBalsummCode = objVal;
			}*/
		objDefaultEqCcy = me.down('combo[itemId="defaultCurrencyCombo"]');
			if (!Ext.isEmpty(objDefaultEqCcy)) {
				var objVal = objDefaultEqCcy.getValue();				
			}
			
			if (!Ext.isEmpty(objDefaultEqCcy)) {
				objDefaultEqCcyStore = objDefaultEqCcy.getStore();
				if (!Ext.isEmpty(objDefaultEqCcyStore)) {
					var  objData = objDefaultEqCcyStore.findRecord('CODE',objVal);
					if (objData )		
					{
						objGeneralSetting.defaultCcySymbol = objData.data.SYMBOL;
						objGeneralSetting.defaultCcyDesc = objData.data.DESCR;
						objGeneralSetting.defaultCcyCode = objData.data.CODE;
					}
				}
			}
			arrPref.push({
						"module" : "GeneralSetting",
						"jsonPreferences" : objGeneralSetting
					});
		
		objGrid = me.down('grid[itemId="columnSettingGrid"]');
			if (!Ext.isEmpty(objGrid)) {
				objGridStore = objGrid.getStore();
				if (!Ext.isEmpty(objGridStore)) {
					arrStoreData = objGridStore.data.items;
					Ext.each(arrStoreData, function(cfg) {
								var objData = cfg.data;
								if(objData['hidden'] === true){
									arrHideCol.push(objData);
								}
								else{
									arrUnHideCol.push(objData);
								}
							});
					arrHideCol = me.sortByKey(arrHideCol,'colSequence');
					arrUnHideCol = me.sortByKey(arrUnHideCol,'colSequence');
					arrGridCol = arrGridCol.concat(arrUnHideCol,arrHideCol);
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
		
			return arrPref;
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
	},
	sortByKey : function(array, key) {
	    return array.sort(function(a, b) {
	        var x = a[key]; var y = b[key];
	        return ((x < y) ? -1 : ((x > y) ? 1 : 0));
	    });
	}
});