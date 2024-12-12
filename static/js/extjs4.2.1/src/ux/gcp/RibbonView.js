/**
 * @class Ext.ux.gcp.RibbonView
 * @extends Ext.panel.Panel
 * @author Vinay Thube
 * 
 * Ribbon View provides a panel to render summary ribbon or any other
 * components.
 */
Ext.define('Ext.ux.gcp.RibbonView', {
	extend : 'Ext.panel.Panel',
	requires : ['Ext.toolbar.Toolbar', 'Ext.container.Container'],
	xtype : 'ribbonView',
	cls : 'filter-view xn-ribbon ribbon-view',
	shadow : false,
	autoHeight : true,
	collapsed : true,
	collapsible : true,
	titleCollapse : true,
	width : '100%',
	margin : '10 0 0 0',
	bodyCls : 'filter-body',
	/**
	 * @cfg{Object} cfgRibbonModel contains ribbon model
	 * 
	 * @example { itemId : 'ribbon1', items : [], showSetting : true, collapsed : false}
	 * 
	 * @default {}
	 */
	cfgRibbonModel : {},
	initComponent : function() {
		var me = this, arrItems = [], objFilterCt = null, objFilterInfoCt = null, strTitle = '';
		strTitle = getLabel('summaryInformation', 'Summary Information')
				+ '<span id="' + (me.itemId || "") + '_SPAN' + '"></span>';
		strTitle += (me.cfgRibbonModel && me.cfgRibbonModel.showSetting === true)
				? '<i class="fa fa-gear pull-right ribbon-settings cursor_pointer" id="ribbonSettings" title="'+getLabel("Settings","Settings")+'"></i>'
				: '';
		me.title = strTitle;
		if (me.cfgRibbonModel && me.cfgRibbonModel.items
				&& me.cfgRibbonModel.items.length > 0)
			me.items = me.cfgRibbonModel.items;

		me.on('afterrender', function() {
					var settingsIcon = me.getHeader().getEl()
							.down('#ribbonSettings');
					if (!Ext.isEmpty(settingsIcon)) {
						settingsIcon.on('click', function() {
									me.fireEvent('ribbonSettingClick');
								});
					}
				});
		me.collapsed = !Ext.isEmpty((me.cfgRibbonModel || {}).collapsed)? me.cfgRibbonModel.collapsed : true;
		if(me.cfgRibbonModel && !Ext.isEmpty(me.cfgRibbonModel.minHeight))
		{
			me.minHeight = me.cfgRibbonModel.minHeight;
		}
		me.callParent(arguments);
	}
});