Ext.define('GCP.view.PaymentPackageGridView', {
	extend : 'Ext.panel.Panel',
	requires : ['Ext.ux.gcp.SmartGrid','GCP.view.PaymentPackageActionBarView','Ext.panel.Panel'],
	xtype : 'paymentPackageGridView',
	width : '100%',
	initComponent : function() {
		var me = this;
		var actionBar = Ext.create('GCP.view.PaymentPackageActionBarView', {
					itemId : 'clientGroupActionBarView_clientDtl',
					height : 21,
					width : '100%',
					margin : '1 0 0 0',
					parent : me
				});
		this.items = [{
			xtype : 'container',
			cls : 'ux_extralargepaddingtb ux_panel-background',
			layout : 'hbox',
			width : '100%',
			items : [{
						xtype : 'button',
						itemId : 'addNewProfileId',
						name : 'alert',
						text : '<span>'
								+ getLabel('paymentPackageNewProfile', 'Payment Package')
								+ '</span>',
						cls : 'ux_button-background-color ux_button-padding ux_loan-center-button',
						glyph : 'xf055@fontawesome',
						hidden : ACCESSNEW == 'false' ? true : false,
						handler : function() {
							me.parent.fireEvent('addAlertEvent', this);
						}
					}, {
						xtype : 'container',
						layout : 'hbox',
						cls : 'ux_hide-image',
						flex : 1,
						items : [{
									xtype : 'label',
									text : '',
									flex : 1
								}, {
									xtype : 'container',
									layout : 'hbox',
									cls : 'rightfloating',
									items : [{
										xtype : 'button',
										border : 0,
										itemId : 'btnSearchOnPage',
										text : getLabel('searchOnPage',
												'Search on Page'),
										cls : 'xn-custom-button cursor_pointer',
										padding : '4 0 0 3',
										menu : Ext.create('Ext.menu.Menu', {
													itemId : 'menu',
													items : [{
														xtype : 'radiogroup',
														itemId : 'matchCriteria',
														vertical : true,
														columns : 1,
														items : [{
															boxLabel : getLabel(
																	'exactMatch',
																	'Exact Match'),
															name : 'searchOnPage',
															inputValue : 'exactMatch'
														}, {
															boxLabel : getLabel(
																	'anyMatch',
																	'Any Match'),
															name : 'searchOnPage',
															inputValue : 'anyMatch',
															checked : true
														}]

													}]
												})
									}, {
										xtype : 'textfield',
										itemId : 'searchTextField',
										cls : 'w10',
										padding : '0 0 0 5'
									}]
								}]
					}]
		}, {
			xtype : 'panel',
			collapsible : true,
			width : '100%',
			cls : 'xn-ribbon ux_border-bottom ux_panel-transparent-background',
			bodyCls : 'x-portlet ux_no-padding',
			title : getLabel('paymentPackageNewProfile', 'Payment Package'),
			itemId : 'prfMstDtlView',
			items : [{
				xtype : 'container',
				itemId : 'pmtPkgButContainer',
				layout : 'hbox',
				items : [{
					xtype : 'panel',
					width : '100%',
					layout : 'hbox',
					items : [{
						xtype : 'button',
						margin : '5 0 0 10',
						itemId : 'btnPkgList',
						text : getLabel('showAllPackages', 'Show All Payment Package'),
						cls : 'xn-account-filter-btnmenu font_bold',
						handler : function() {
							me.parent.fireEvent('changePkgProductList', this,
									'showpackage')
						}
					},  {
						xtype : 'button',
						margin : '5 0 0 10',
						itemId : 'btnProductList',
						text : getLabel('showAllProduct', 'Show All Product'),
						cls : 'xn-account-filter-btnmenu font_bold',
						handler : function() {
							me.parent.fireEvent('changePkgProductList', this,
									'showproduct')
						}
					}]
				}]

			}, {
			xtype : 'panel',
			width : '100%',
			autoHeight : true,
			margin : '5 0 0 0',
			itemId : 'clientSetupDtlView',
			items : [{
						xtype : 'container',
						layout : 'hbox',
						items : [{
									xtype : 'label',
									text : getLabel('actions', 'Actions') + ':',
									cls : 'action_label ux_font-size14',
									padding : '5 0 0 10'
								}, actionBar, {
									xtype : 'label',
									text : '',
									flex : 1
								}]

					}]
		}]
		}];
		this.callParent(arguments);
	}
	

});