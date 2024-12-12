Ext.define('CPON.view.BRActionBarView', {
	extend : 'Ext.toolbar.Toolbar',
	xtype : 'brActionBarView',
	enableOverflow : true,
	border : false,
	componentCls : 'xn-custom xn-btn-default-toolbar-small xn-custom-toolbar',
	initComponent : function() {
		var me = this;
		me.items = [{
			text : getLabel('prfMstActionAssign', 'Assign'),
			disabled : true,
			actionName : 'assign',
			itemId : 'assign',
			maskPosition : 1,
			handler : function(btn, opts) {
				setDirtyBit();
				me.parent.fireEvent('performGroupAction', btn, me.parent, opts);
				me.fireEvent('performGroupAction', btn, opts);
			}
		},'-', {
			text : getLabel('prfMstActionUnassign', 'Unassign'),
			disabled : true,
			actionName : 'unassign',
			itemId : 'unassign',
			maskPosition : 1,
			handler : function(btn, opts) {
				setDirtyBit();
				me.parent.fireEvent('performGroupAction', btn, me.parent, opts);
				me.fireEvent('performGroupAction', btn, opts);
			}
		}];


		me.callParent();
	},
	listeners : {
		/*resize : function(toolbar, width, height, oldWidth, oldHeight, eOpts) {
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

		}*/
	}

});