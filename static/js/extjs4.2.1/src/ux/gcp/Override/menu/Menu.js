/**
 * The method onMouseLeave is overridden here because "Extjs grid's column
 * header "column" option hide/show is not working on Chrome latest version"
 */
/**
 * @class Ext.override.menu.Menu
 * @override Ext.menu.Menu
 * @author Vinay Thube
 */
Ext.define('Ext.ux.gcp.Override.menu.Menu', {
			override : 'Ext.menu.Menu',
			onMouseLeave : function(e) {
				var me = this;
				// If the mouseleave was into the active submenu, do not dismiss
				if (me.activeChild) {
					if (e.within(me.activeChild.el, true)) {
						return;
					}
				}
				me.deactivateActiveItem();
				if (me.disabled) {
					return;
				}
				me.fireEvent('mouseleave', me, e);
			}
		});