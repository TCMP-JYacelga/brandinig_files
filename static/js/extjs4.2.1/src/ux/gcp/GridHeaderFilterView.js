/**
 * @class Ext.ux.gcp.GridHeaderFilterView
 * @extends Ext.panel.Panel
 * @author Vijayanaresh Bandaru
 */
/**
 * Ext.ux.gcp.GridHeaderFilterView is a component, which used for Grid Header Panel Filter View.
 *  
 * @example
 * 	Ext.create('Ext.ux.gcp.GridHeaderFilterView', {
 *					cfgShowFilter : true,										
 *					cfgShowRefreshLink : false,
 *					cfgSmartGridSetting : true,
 *					cfgSummaryLabel : 'Balances',
 *					cls : 't7-grid',
 *					cfgParentCt : me,
 *					cfgFilterModel : {
 *					cfgContentPanelItems : [{
*								xtype : 'accountBalancesFilterView'
*							}],
*					cfgContentPanelLayout : {
*						type : 'vbox',
*						align : 'stretch'
*					}
*				},
*		});
**/
Ext.define('Ext.ux.gcp.GridHeaderFilterView', {
	extend : 'Ext.panel.Panel',
	xtype : 'gridHeaderFilterView',
	requires : ['Ext.toolbar.Toolbar', 'Ext.button.Button', 'Ext.form.Label',
			'Ext.menu.Menu', 'Ext.layout.container.HBox', 'Ext.tab.Panel',
			'Ext.container.Container', 'Ext.ux.gcp.SmartGrid',
			'Ext.ux.gcp.SmartGridActionBar', 'Ext.ux.gcp.FilterView',
			'Ext.ux.gcp.SmartGridSettingButton'],
	autoHeight : true,
	width : '100%',
	cls : 'xn-group-view ux_header ux_panel-background',
	itemId : 'groupViewPanel',
	/**
	 * @cfg{String} cfgSummaryLabel The text to be displyed in summary label
	 * @default 'Summary Details'
	 */
	cfgSummaryLabel : null,	
	/**
	 * @cfg{Boolean} cfgShowFilter controls whether the filter icon should
	 *               appear on the tab bar
	 * 
	 * @default false
	 */
	cfgShowFilter : false,
	/**
	 * cfgFilter Model contains two configs, for layout and items
	 * cfgContentPanelLayout:'fit'
	 */
	cfgFilterModel : {},
	cfgSmartGridSetting : false,
	/**
	 * @cfg{Boolean} cfgShowRefreshLink controls whether the refresh data link
	 *               should appear on right top below the tab bar
	 * 
	 * @default true
	 */
	cfgShowRefreshLink : true,
	/**
	 * @cfg{Object} cfgParentCt The parent container, used to show/hide loading
	 *              indicator while grid data load
	 * 
	 * @default null
	 */
	cfgParentCt : null,
	/**
	 * @cfg{boolean} cfgCollpasible True to make the panel collapsible and have
	 *               an expand/collapse toggle Tool added into the header tool
	 *               button area. False to keep the panel sized either
	 *               statically, or by an owning layout manager, with no toggle
	 *               Tool.
	 * 
	 * @default true
	 */
	cfgCollpasible : true,
	initComponent : function() {
		var me = this;
		var objNavigationPanel = me.createNavigationPanel();
		me.items = [objNavigationPanel];	
		me.on('resize', function() {
					me.doLayout();
				});
		me.callParent(arguments);

	},
	/**
	 * The function createNavigationPanel creates navigation panel. Filter
	 * button has been modified so as to display the menu on hover and disappear
	 * as soon as mouse moves out. This has been done by using the mouseover,
	 * mouseout listeners.
	 */
	createNavigationPanel : function() {
		var me = this;
		var objContainer = null, objToolBar = null, objTabPanel = null, objFilterButton = null, objSettingButton = null;
		var arrItems = [];

		objToolBar = me.createSummaryToolBar();
		arrItems.push(objToolBar);
		
		if (me.cfgSmartGridSetting === true) {
			objSettingButton = Ext.create('Ext.ux.gcp.SmartGridSettingButton',
			{
				showSettingsButton : me.cfgSmartGridSetting,
				parentCt : me.cfgParentCt,
				itemId : 'gridSettingButton'
			});
			arrItems.push(objSettingButton);
		}
		if (me.cfgShowFilter === true) {
			objFilterButton = Ext.create('Ext.Button', {
				itemId : 'filterButton',
				hidden : false,
				width : 30,
				top : 20,
				cls : 'smart-filter-button',
				iconCls : 'icon-filter-T7',
				filterVisible : false,
				listeners : {
					click : function(button) {
						var panel;
						if (me.showSettingsButton) {
							var settingsButton = me
									.down('smartGridSettingButton');
							button.removeCls('smartGridSettingButtonClick');
						}
						if (button.panel)
							panel = button.panel;
						else {
							panel = Ext.create('Ext.ux.gcp.FilterView', {
								buttonClicked : button,
								cfgContentPanelLayout : me.cfgFilterModel.cfgContentPanelLayout,
								cfgContentPanelItems : me.cfgFilterModel.cfgContentPanelItems
							});
							button.panel = panel;
						}
						var xy = button.getXY();
						var y = xy[1] - 90;
						if (!button.filterVisible) {
							var width = button.up('container[itemId=navigationContainer]').getWidth();
							panel.showAt((xy[0]+button.width)-width,y);
							// panel.anchorTo(button, 'tr-br', button.getXY());
							button.filterVisible = true;
							button.addCls('filter-icon-hover');
						} else {
							panel.hide();
							// Vinay : Commented the code. Need to verify..
							// button.panel = null;
							button.filterVisible = false;
							button.removeCls('filter-icon-hover');
						}

					}
				}
			});
			arrItems.push(objFilterButton);
		}
		objContainer = Ext.create('Ext.container.Container', {
					itemId : 'navigationContainer',
					cls : 'xn-panel-header',
					layout : {
						type : 'hbox'
					},
					items : arrItems
				});
		return objContainer;
	},
	
	toggleFilterIcon : function(isFilterApplied){
		var me = this;
		var btn = me.down('button[itemId="filterButton"]');
		var strIconCls = isFilterApplied === true ? 'icon-filter-on-T7' : 'icon-filter-T7';
		if(btn){
			btn.setIconCls(strIconCls);
		}
	},
	
	/**
	 * The function createSummaryToolBar creates the Tool Bar. Groupby button
	 * has also been changes so as to provide the functionality of menu show on
	 * hover.
	 */
	createSummaryToolBar : function() {
		var me = this;
		var strSummaryLabel = me.cfgSummaryLabel || 'Summary Details';				
		var objToolBar = null		
		var hideTask;
		var isToggleBtnVisible = me.cfgCollpasible === true ? false : true;
		objToolBar = Ext.create('Ext.toolbar.Toolbar', {
			itemId : 'summaryToolBar',
			flex : 1,
			//minWidth : 1235,// Changed for demo Only...Need to change it .
			//maxWidth : 1235,
			items : [{
				xtype : 'button',
				itemId : 'summaryToggleButton',
				width : 25,
				hidden : isToggleBtnVisible,
				iconCls : 'icon-collapse-rounded',
				cls : 'xn-button-transparent summaryToggleButton ux_smallmargin-right',
				collapsed : false,
				handler : function(btn) {
					btn.collapsed = !btn.collapsed;
					var strCls = btn.collapsed === true
							? 'icon-expand-rounded'
							: 'icon-collapse-rounded';
					me.toggleView(btn.collapsed);
					btn.setIconCls(strCls);
				}
			}, {
				xtype : 'label',
				itemId : 'summaryLabel',
				cls : 'ux_texttransform-upper ux_font-size16-normal groupview-header-title',
				text : strSummaryLabel
			}]
		});		
		return objToolBar;
	},
	
	/**
	 * Handle hide/show of the "Group By" list, "Group By" label,"Group Tabs"
	 * and "Grid"
	 * 
	 * @param {Boolean}
	 *            isHidden flag used to hide/show
	 */
	toggleView : function(isHidden) {
		var me = this;
		var gridContainer = me.cfgParentCt.down("smartgrid");
		var filterButton = me.down('button[itemId="filterButton"]');
		var navigationContainer = me
				.down('container[itemId="navigationContainer"]');
		var gridSettingButton = me.down('smartGridSettingButton');

		if (gridContainer)
			gridContainer.setVisible(!isHidden);

		if (filterButton) {
			filterButton.setVisible(!isHidden);
			if (filterButton.filterVisible) {
				filterButton.panel.hide();
				filterButton.removeCls('filter-icon-hover');
			}
		}

		if (gridSettingButton && me.cfgSmartGridSetting != false)
			gridSettingButton.setVisible(!isHidden);
		if (navigationContainer) {
			if (isHidden)
				navigationContainer.removeCls('smallborder_b');
			else
				navigationContainer.addCls('smallborder_b');
		}
	}	
});