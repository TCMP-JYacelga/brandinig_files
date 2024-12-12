/**
 * @classExt.ux.gcp.SmartGridSettingButton
 * @extends Ext.button.Button
 * @author Vinay
 * @auther Aditya Sharma
 */
Ext.define('Ext.ux.gcp.SmartGridSettingButton', {
			extend : 'Ext.button.Button',
			xtype : 'smartGridSettingButton',
			cls : 'smartGridSettingButton',
			menuAlign : 'tr-br',
			dock : 'right',
			showSettingsButton : false,
			parentCt : null,
			config : {
				heightOption : null,
				showPager : false
			},
			listeners : {
				'click' : function(button) {
					var me = this;
					if (!button.menu.isHidden()) {
						button.addCls('smartGridSettingButtonClick');
						var groupView = me.parentCt;
						if (false && !Ext.isEmpty(groupView) && groupView.cfgShowFilter) {
							var filterButton = groupView
									.down('button[itemId="filterButton"]');
							var objFilterView = filterButton.panel;
							if (!Ext.isEmpty(objFilterView)) {
								objFilterView.hide();
								filterButton.filterVisible = false;
								filterButton.removeCls('filter-icon-hover');
							}
						}
					}
				}
			},
			initComponent : function() {
				var me = this;
				me.setHiddenState(!me.showSettingsButton);
				var itemText = ['SMALL', 'MEDIUM', 'LARGE',
						'Toggle Pagination', 'Refresh Data'];
				var itemValue = ['S', 'M', 'L', 'TP', 'RD'];
				var arrMenus = [];
				var gridHeightLabel = {
					text : 'Grid Height:',
					disabled : true,
					cls : 'menu-grid-height-label'
				};
				arrMenus.push(gridHeightLabel);
				for (var i = 0; i < itemText.length; i++) {
					if(itemValue[i] == 'TP') {
						arrMenus.push({
							cls : 'menu-separator'
						})
					}
					arrMenus.push({
								text : itemText[i],
								value : itemValue[i],
								listeners : {
									'click' : function(item) {
										me.itemClickHandler(item, me);
									}
								}
							})
				}
				me.menu = Ext.create('Ext.menu.Menu', {
							itemId : 'smartGridSettingButtonMenu',
							items : arrMenus,
							plain : true,
							cls : 'smartSettingCls ext-dropdown-menu',
							listeners : {
								'hide' : function(menu) {
									menu
											.up('button')
											.removeCls('smartGridSettingButtonClick');
								}
							}
						})
				me.callParent(arguments);
			},
			getMappedHeight : function(strKey) {
				var mapHeight = {
					'S' : 350,
					'M' : 610,
					'L' : 920
				};
				return mapHeight[strKey];
			},
			toggleActiveMenu : function() {
				var me = this, objMenu = me.menu, arrItems = [];
				if (objMenu) {
					arrItems = objMenu.items.items || [];
					Ext.each(arrItems, function(item) {
								if (item.value === me.heightOption)
									item.addCls('ext-active-menu');
								else
									item.removeCls('ext-active-menu');
							});
				}

			},
			itemClickHandler : function(item, me) {
				var value = item.value;
				var mainCt = null, pager = null, blnToggle = false;
				var intGridHeight = me.getMappedHeight(value);
				switch (value) {
					case 'S' :
						me.setGridHeight(intGridHeight);
						me.heightOption = value;
						if (this.parentCt && this.parentCt.getGrid())
							this.parentCt.getGrid().fireEvent('statechange');
						break;
					case 'M' :
						me.setGridHeight(intGridHeight);
						me.heightOption = value;
						if (this.parentCt && this.parentCt.getGrid())
							this.parentCt.getGrid().fireEvent('statechange');
						break;
					case 'L' :
						me.setGridHeight(intGridHeight);
						me.heightOption = value;
						if (this.parentCt && this.parentCt.getGrid())
							this.parentCt.getGrid().fireEvent('statechange');
						break;
					case 'TP' :
						mainCt = this.parentCt;
						pager = mainCt.down('smartGridPager');
						if (pager) {
							if (pager.isHidden()) {
								pager.show();
								blnToggle = true;
							} else {
								pager.hide();
								blnToggle = false;
							}
							me.showPager = pager.isHidden();
							pager.grid.fireEvent('toggleGridPager', pager.grid,
									pager, blnToggle);
						}
						break;
					case 'RD' :
						if (this.parentCt) {
							this.parentCt.fireEvent('refreshGroupView');
						}
						break;
				}
				me.toggleActiveMenu();
			},
			setGridHeight : function(height) {
				var grid = this.parentCt.down('smartgrid');
				grid.maxHeight = height;
				grid.doLayout();
			},
			getGridSettings : function() {
				var me = this;
				var objState = {};
				var pager = me.parentCt.down('smartGridPager');
				pager.showPagerForced = !pager.isHidden();
				objState['heightOption'] = me.heightOption;
				objState['showPager'] = pager.showPagerForced
				return objState;
			}
		});