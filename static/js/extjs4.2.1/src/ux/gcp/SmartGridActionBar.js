/**
 * @class Ext.ux.gcp.SmartGridActionBar
 * @extends Ext.toolbar.Toolbar
 * @author Vinay Thube
 */
Ext.define('Ext.ux.gcp.SmartGridActionBar', {
			extend : 'Ext.toolbar.Toolbar',
			xtype : 'smartgridactionbar',
			enableOverflow : true,
			border : false,
			componentCls : 'xn-btn-default-toolbar-small',
			initComponent : function() {
				this.callParent();
			},
			listeners : {
				resize : function(toolbar, width, height, oldWidth, oldHeight,
						eOpts) {
					if (false) {
						// This Code is used to change toolbar's menu trigger
						// button i.e >>
						// to |more
						var tbarId = toolbar.id;
						var button = Ext.select('a[id="' + tbarId
								+ '-menu-trigger-btnEl"]');
						var imgSpan = Ext.select('span[id="' + tbarId
								+ '-menu-trigger-btnIconEl"]');
						var txtSpan = Ext.select('span[id="' + tbarId
								+ '-menu-trigger-btnInnerEl"]');
						if (button) {
							if (imgSpan)
								imgSpan.remove();
							if (txtSpan)
								txtSpan.remove();
							button.setHTML(getLabel('instrumentsMoreMenuTitle',
									'more'));
							button.addCls('xn-trigger-cls');
						}

					}
				}
			}

		});