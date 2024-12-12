Ext.define('Ext.ux.gcp.SavedFilterView',
{
	extend : 'Ext.panel.Panel',
	xtype : 'SavedFilterView',
	requires : ['Ext.form.Panel'],
	config : {
		savedFiltes : []
	},
	header : false,
	height : 25,
	border : 0,
	layout : 'hbox',
	getFilterUrl : null,
	parent : null,
	initComponent : function() {
		var me = this;
		me.parent.getAllSaveFilter();
		this.items = [{
					xtype : 'label',
					cls : 'font_bold w6',
					text : getLabel('savedFilters', 'Saved Filters'),
					margin : '6 20 0 0'
				}, {
					xtype : 'toolbar',
					enableOverflow : true,
					id : 'filterItemsToolbar',
					flex : 1,
					cls : 'xn-saved-filter-labels',
					items : [],
					listeners : {
						resize : function(toolbar, width, height, oldWidth,
								oldHeight, eOpts) {
							var id = toolbar.id + '-menu-trigger';
							var moreMenu = Ext.getCmp(id);
							if (moreMenu && !moreMenu.hidden) {
								moreMenu.addCls('xn-hide');
							}
						}
					}
				}, {
					xtype : 'button',
					margin : '6 0 0 20',
					border : 0,
					menu : Ext.create('Ext.menu.Menu', {
						items : [{
									xtype : 'combo',
									id : 'filterItemsMoreCombo',
									fieldCls : 'xn-form-text w18 xn-suggestion-box',
									triggerBaseCls : 'xn-form-trigger',
									hideTrigger : true,
									displayField : 'value',
									valueField : 'key',
									queryMode : 'local',
									typeAhead : false,
									defaultListConfig : {loadingHeight: 100, minWidth: 70, maxHeight: 100, shadow: 'sides'},
									// minChars : 2,
									store : new Ext.data.Store({
												fields : ['key', 'value'],
												data : []

											}),
									listeners : {
										// buffer : 50,
											keypress : function(field)
											{
											var newValue = field.getValue();
											var store = this.store;

											if (!Ext.isEmpty(newValue)) {
												store.clearFilter();
												store.filter({
															property : 'key',
															value : newValue,
															anyMatch : true
														});
											} else {
												store.clearFilter();
											}
										},
										select : function(combo, records, eOpts) {
											combo.ownerCt.hide();
											var fltCode = combo.getValue();
											me.parent.fireEvent('handleSavedFilterItemClick',
															fltCode);

										},
										focus : function(combo) {
											if (!combo.isExpanded) {
												combo.expand()
											}
										}
									}
								}]
							}),
					text : getLabel('savedFiltesMore', 'more..'),
					cls : 'xn-saved-filter-more cursor_pointer xn-saved-filter-btnmenu w3'
				}];
		this.dockedItems = [{
					xtype : 'toolbar',
					itemId : 'advFilterActions',
					dock : 'right',
					layout : 'hbox',
					margin : '0 0 0 50',
					displayInfo : true,
					cls : 'xn-saved-filter-labels',
					items : [{
						btnId : 'btnAdvancedFilter',
						text : getLabel('btnAdvancedFilter', 'Advanced Filter'),
						handler : function(btn) {
							me.parent.fireEvent("handleShowAdvancedFilterAction", btn);
						}
					}, {
						btnId : 'btnResetAdvacedFilter',
						text : getLabel('btnReset', 'Reset'),
						handler : function(btn) {
							me.parent.fireEvent("handleResetFilterAction", btn);
						}
					}]
				}];
		this.callParent();
	},
	addAllSavedFilterCodeToView : function(arrFilters) {
		var me = this;
		var objSavedFilter = this;
		var objToolbar = Ext.getCmp('filterItemsToolbar');
		var objMoreCombo = Ext.getCmp('filterItemsMoreCombo');
		if (objToolbar.items && objToolbar.items.length > 0)
			objToolbar.removeAll();
		if (arrFilters && arrFilters.length > 0) {
			objSavedFilter.savedFiltes = arrFilters;
			var toolBarItems = [];
			var comboData = [];
			var item;
			for (var i = 0; i < arrFilters.length; i++) {
				item = Ext.create('Ext.Button', {
							cls : 'xn-saved-filter-labels',
							text : arrFilters[i],
							itemId : arrFilters[i],
							handler : function(btn, opts) {
								me.parent.fireEvent('handleSavedFilterItemClick',btn.itemId);
							}
						});
				toolBarItems.push(item);
				comboData.push({
							'key' : arrFilters[i],
							'value' : arrFilters[i]
						});
			}
			objMoreCombo.store.loadRawData(comboData);
			objToolbar.removeAll();
			objToolbar.add(toolBarItems);
		}else {
			objSavedFilter.savedFiltes = [];

		} 
	}
});
