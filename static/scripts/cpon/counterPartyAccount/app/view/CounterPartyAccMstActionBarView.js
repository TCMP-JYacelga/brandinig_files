Ext.define('CPON.view.CounterPartyAccMstActionBarView', {
	extend : 'Ext.toolbar.Toolbar',
	xtype : 'counterPartyAccMstActionBarView',
	enableOverflow : true,
	border : false,
	componentCls : 'xn-custom xn-btn-default-toolbar-small xn-custom-toolbar',
	initComponent : function() {
		var me = this;
		me.items = [{
			text : getLabel('prfMstActionEnable', 'Enable'),
			disabled : true,
			actionName : 'enable',
			itemId : 'btnEnable',
			maskPosition : 8,
			handler : function(btn, opts) {
				me.fireEvent('performGroupAction', btn, opts);
			}
		},'-', {
			text : getLabel('prfMstActionDisable', 'Disable'),
			disabled : true,
			actionName : 'disable',
			itemId : 'btnDisable',
			maskPosition : 9,
			handler : function(btn, opts) {
				me.fireEvent('performGroupAction', btn, opts);
			}
		}];
		me.callParent();
	},
	listeners : {
		resize : function(toolbar, width, height, oldWidth, oldHeight, eOpts) {
			// This Code is used to change toolbar's menu trigger button i.e >>
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
	}

});