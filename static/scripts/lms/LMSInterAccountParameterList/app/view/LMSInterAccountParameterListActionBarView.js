Ext.define('GCP.view.LMSInterAccountParameterListActionBarView', {
	extend : 'Ext.toolbar.Toolbar',
	xtype : 'lmsInterAccountParameterListActionBarView',
	enableOverflow : true,
	border : false,
	componentCls : 'xn-custom xn-btn-default-toolbar-small xn-custom-toolbar',
	initComponent : function() {
		var me = this;
		me.items = [{
			text : getLabel('prfMstActionSubmit', 'Submit'),
			disabled : true,
			actionName : 'submit',
			maskPosition : 1,
			handler : function(btn, opts) {
				me.fireEvent('performGroupAction', btn, opts);
			}
		}, {
			text : getLabel('prfMstActionApprove', 'Approve'),
			disabled : true,
			actionName : 'accept',
			maskPosition : 2,
			handler : function(btn, opts) {
				me.fireEvent('performGroupAction', btn, opts);
			}
		},{
			text : getLabel('prfMstActionReject', 'Reject'),
			disabled : true,
			actionName : 'reject',
			maskPosition : 3,
			handler : function(btn, opts) {
				me.fireEvent('performGroupAction', btn, opts);
			}
		},{
			text : getLabel('prfMstActionEnable', 'Enable'),
			disabled : true,
			actionName : 'enable',
			maskPosition : 4,
			handler : function(btn, opts) {
				me.fireEvent('performGroupAction', btn, opts);
			}
		},{
			text : getLabel('prfMstActionDisable', 'Disable'),
			disabled : true,
			actionName : 'disable',
			maskPosition : 5,
			handler : function(btn, opts) {
				me.fireEvent('performGroupAction', btn, opts);
			}
		},{
			text : getLabel('prfMstActionDiscard', 'Discard'),
			disabled : true,
			actionName : 'discard',
			maskPosition : 6,
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