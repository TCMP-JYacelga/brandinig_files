Ext.define('GCP.view.WHTRefundActionBarView', {
	extend : 'Ext.toolbar.Toolbar',
	xtype : 'WHTRefundActionBarView',
	enableOverflow : true,
	border : false,
	componentCls : 'xn-custom xn-btn-default-toolbar-small xn-custom-toolbar',
	availableActions : null,
	initComponent : function() {
		var me = this;
		me.items = me.getAvailableActions();
		me.callParent();
	},
	listeners : {
		resize : function(toolbar, width, height, oldWidth, oldHeight, eOpts) {
			// This Code is used to change toolbar's menu trigger button
			// i.e >>
			// to |more
			var tbarId = toolbar.id;
			var button = Ext
					.select('a[id="' + tbarId + '-menu-trigger-btnEl"]');
			var imgSpan = Ext.select('span[id="' + tbarId
					+ '-menu-trigger-btnIconEl"]');
			var txtSpan = Ext.select('span[id="' + tbarId
					+ '-menu-trigger-btnInnerEl"]');
			if (button) {
				if (imgSpan)
					imgSpan.remove();
				if (txtSpan)
					txtSpan.remove();
				button.setHTML(getLabel('instrumentsMoreMenuTitle', 'more'));
				button.addCls('xn-trigger-cls');
			}

		}
	},
	getAvailableActions : function() {
		var me = this;
		var arrAvailableActions = me.availableActions;
		var arrItems = [], cfgAction = null;
		if (!Ext.isEmpty(arrAvailableActions)) {
			for (var count = 0; count < arrAvailableActions.length; count++) {
				cfgAction = mapWHTRefundActionModel[arrAvailableActions[count]] ?
				            mapWHTRefundActionModel[arrAvailableActions[count]] : null;
				if (cfgAction) {
					cfgAction = me.cloneObject(cfgAction);
					cfgAction.disabled = true;
					cfgAction.handler = function(btn, opts) {
						me.parent.fireEvent('performGroupAction', btn,
								me.parent, opts);
						me.fireEvent('performGroupAction', btn, opts);
					}
					arrItems.push(cfgAction);
				}
			}
		}
		return arrItems;
	},
	cloneObject : function(obj) {
		return JSON.parse(JSON.stringify(obj));
	}
});
