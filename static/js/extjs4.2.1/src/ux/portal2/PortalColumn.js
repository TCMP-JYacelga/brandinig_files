/**
 * @class Ext.ux.portal.PortalColumn
 * @extends Ext.container.Container
 * A layout column class used internally be {@link Ext.app.PortalPanel}.
 */
Ext.define('Ext.ux.portal2.PortalColumn', {
    extend: 'Ext.container.Container',
    alias: 'widget.portalcolumn2',

    requires: ['Ext.ux.portal2.Portlet'],

    layout: {
        type: 'column'
    },
    defaultType: 'portlet2',
    cls: 'x-portal-column',
	
    
	 // Set columnWidth, and set first and last column classes to allow exact CSS targeting.
    beforeLayout: function() {
		var items = this.layout.getLayoutItems(),
            len = items.length,
            i = 0,
            item;

        for (; i < len; i++) {
            item = items[i];
            var span = item.colSize;
            if(span == 1 || span == 2){
				item.columnWidth = 1/2;
			} else {
				item.columnWidth = 1;
			}
        }
        return this.callParent(arguments);
    }

    // This is a class so that it could be easily extended
    // if necessary to provide additional behavior.
});
