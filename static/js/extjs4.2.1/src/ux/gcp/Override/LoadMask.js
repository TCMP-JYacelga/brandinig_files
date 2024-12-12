/**
 * The method setZIndex is overridden here as setLoading(true) gives error in
 * IE8
 */
/**
 * @class Ext.ux.gcp.Override.LoadMask
 * @override Ext.grid.Panel
 * @author Vinay Thube
 */
Ext.define('Ext.ux.gcp.Override.LoadMask', {
			override : 'Ext.LoadMask',
			setZIndex : function(index) {
				var me = this;
				var owner = me.activeOwner;
				if (owner) {
					index = parseInt(owner.el.getStyle('zIndex'), 10);
					if (isNaN(index)) {
						index = 0;
					}
					index++;
				}
				me.getMaskEl().setStyle('zIndex', index - 1);
				return me.mixins.floating.setZIndex.apply(me, arguments);
			}
		});