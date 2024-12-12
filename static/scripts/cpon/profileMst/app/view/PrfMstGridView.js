Ext.define('GCP.view.PrfMstGridView', {
	extend : 'Ext.panel.Panel',
	requires : ['GCP.view.PrfMstGroupActionBarView', 'Ext.ux.gcp.SmartGrid'],
	xtype : 'prfMstGridView',
	componentCls : 'gradiant_back',
	//padding : '12 0 0 0',
	cls : ' x-portlet ux_no-padding ux_no-margin',
	autoHeight : true,
	width : '100%',
	parent : null,

	initComponent : function() {
		var me = this;
		var actionBar = Ext.create('GCP.view.PrfMstGroupActionBarView', {
					itemId : 'prfMstGroupActionBarView_summDtl',
					height : 21,
					width : '100%',
					margin : '1 0 0 0',
					parent : me
				});
		this.items = [{
			xtype : 'container',
			cls : 'ux_panel-background ux_extralargepadding-bottom ',
			layout : 'hbox',
			width : '100%',
			items : [ {
						xtype : 'button',
						itemId : 'addNewProfileId',
						name : 'alert',
						glyph : 'xf055@fontawesome',
						//flex : 0.15,
						cls : 'ux_button-padding ux_button-background-color ux_cancel-button',						
						text : getLabel('addNewAlertPrf', 'Alert Profile'),
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
										itemId : 'searchTxnTextField',
										cls : 'w10',
										padding : '0 0 0 5'
									}]
								}]
					}]
		}, {
			xtype : 'panel',
			collapsible : true,
			width : '100%',
			cls : 'xn-ribbon ux_border-bottom gradiant_back',
			title : getLabel('alertProfiles', 'Alert Profiles'),
			itemId : 'prfMstDtlView',
			items : [{
				xtype : 'container',
				itemId : 'pmtPkgButContainer',
				hidden : true,
				layout : 'hbox',
				items : [{
					xtype : 'panel',
					width : '100%',
					layout : 'hbox',
					items : [{
						xtype : 'button',
						margin : '5 0 0 3',
						itemId : 'btnPkgList',
						text : getLabel('showAllPackages', 'Show All Packages'),
						cls : 'xn-account-filter-btnmenu font_bold',
						handler : function() {
							me.parent.fireEvent('changePkgProductList', this,
									'showpackage')
						}
					}, {
						xtype : 'image',
						src : 'static/images/icons/icon_spacer.gif',
						height : 16,
						padding : '5 0 0 7'
					}, {
						xtype : 'button',
						margin : '5 0 0 3',
						itemId : 'btnProductList',
						text : '<span class="button_underline thePoniter ux_font-size14-normal">'
								+ getLabel('showAllProduct', 'Show All Product')
								+ '</span>',
						cls : 'xn-account-filter-btnmenu',
						handler : function() {
							me.parent.fireEvent('changePkgProductList', this,
									'showproduct')
						}
					}]
				}]

			}, {
				xtype : 'container',
				itemId : 'actionToolBar',
				layout : 'hbox',
				items : [{
							xtype : 'label',
							text : getLabel('actions', 'Action') + ':',
							cls : 'ux_font-size14 ux-ActionLabel',
							padding : '5 0 0 10'
						}, actionBar, {
							xtype : 'label',
							text : '',
							flex : 1
						}]

			}]
		}];
		this.callParent(arguments);
		this.handleAddNewProfile();
	},
	handleAddNewProfile : function() {
		var adminProfilesPermissionObj = Ext.decode(adminProfilesPermission);
		Ext.each(adminProfilesPermissionObj, function(field, index) {
					adminProfilesPermissionObj = field;
				});
		if (adminProfilesPermissionObj != undefined
				&& !adminProfilesPermissionObj.alertPermission.EDIT) {
			var addProfileObj = this.down('button[itemId=addNewProfileId]');
			addProfileObj.hide();
		}

	}

});