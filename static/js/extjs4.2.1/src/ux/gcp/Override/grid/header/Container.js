/**
 * The method getMenuItems is overridden here to sort column list in
 * alphabetical order
 */
/**
 * @class EExt.ux.gcp.Override.grid.header.Container
 * @override Ext.grid.header.Container
 * @author Vinay Thube
 */
Ext.define('Ext.ux.gcp.Override.grid.header.Container', {
			override : 'Ext.grid.header.Container',
			/**
			 * Returns an array of menu items to be placed into the shared menu
			 * across all headers in this header container.
			 * 
			 * @returns {Array} menuItems
			 */
			getMenuItems : function() {
				var me = this, menuItems = [], hideableColumns = me.enableColumnHide
						? me.getColumnMenu(me)
						: null;
				if (me.sortable) {
					menuItems = [{
								itemId : 'ascItem',
								text : getLabel('sortascending',me.sortAscText), 
								cls : me.menuSortAscCls,
								handler : me.onSortAscClick,
								scope : me
							}, {
								itemId : 'descItem',
								text : getLabel('sortdescending',me.sortDescText),
								cls : me.menuSortDescCls,
								handler : me.onSortDescClick,
								scope : me
							}];
				}
				if (hideableColumns && hideableColumns.length) {
					if (me.sortable) {
						menuItems.push({
									itemId : 'columnItemSeparator',
									xtype : 'menuseparator'
								});
					}
					// Sort Columns Aplhabetically changes start
					if (me.ownerCt.ownerCt.autoSortColumnList === true) {
						Ext.Array.sort(hideableColumns, me.sortColumnArray);
					}
					// Sort Columns Aplhabetically changes start
					menuItems.push({
								itemId : 'columnItem',
								text : me.columnsText,
								cls : me.menuColsIcon,
								menu : hideableColumns,
								hideOnClick : false
							});
				}
				return menuItems;
			},
			sortColumnArray : function(a, b) {
				return a.text < b.text ? -1 : a.text > b.text ? 1 : 0;
			}

		});