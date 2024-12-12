Ext.define('Ext.ux.portal2.WidgetContainer', {
	extend : 'Ext.ux.portal2.PortalPanel',
	xtype : 'widgetContainer',
	requires : [ 'Ext.layout.container.*', 'Ext.resizer.Splitter',
			'Ext.fx.target.Element', 'Ext.fx.target.Component'],
	hideHeaders : false,
	autoHeight : true,
	minHeight : 500,
	/**
	 * @cfg {Number} cols Total number of columns to be created.
	 */
	cols : 1,
	widgets : [],
	initComponent : function() {
		var me = this;
		Ext.apply(this, {
			items : me.handleWidgetLayout()
		});
		Ext.EventManager.onWindowResize(function(w, h) {
			me.doComponentLayout();
		});
		this.callParent(arguments);
	},

	/**
	 * Created the column based on cols {@link #cols}. Add the item
	 * accordingly. ### Array [ {id : 'col-1',items : [ { title : 'Pay Portlet',
	 * id : 'portlet-1', xtype : 'payPortlet'}, { id : 'portlet-2', title :
	 * 'Portlet 2', xtype : 'newsPortlet' } ]}, {id : 'col-2',items : [ { id :
	 * 'portlet-3', title : 'Portlet 3', xtype : 'messagePortlet'} ] }, {id :
	 * 'col-3',items : [ { id : 'portlet-4', title : 'Stock Portlet', xtype :
	 * 'chartPortlet'} ]}, {id : 'col-4',items : [ { id : 'portlet-5', title :
	 * 'Stock Portlet', xtype : 'chartPortlet'} ]} ]
	 * 
	 * @return {Array} The Array of the objects.
	 */
	handleWidgetLayout : function() {
		var me = this;
		var itemArray = new Array();
		var colArray = new Array();
		var len = me.widgets ? me.widgets.length : 0;
		var objConf = null;

		for ( var i = 0; i < me.cols; i++) {
			itemArray[i] = new Array();
		}
		for ( var i = 0; i < len; i++) {
			objConf = me.widgets[i];
			itemArray[i % me.cols].push(objConf);
		}
		for ( var i = 0; i < me.cols; i++) {
			colArray.push({
				//id : 'col-' + (i + 1),
				itemId : 'col-' + (i + 1),
				items : itemArray[i] ? itemArray[i] : []
			});
		}
		return colArray;
	}
});
