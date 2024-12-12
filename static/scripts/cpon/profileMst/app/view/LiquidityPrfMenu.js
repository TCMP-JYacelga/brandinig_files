Ext
		.define(
				'GCP.view.LiquidityPrfMenu',
				{
					extend : 'Ext.panel.Panel',
					xtype : 'liquidityPrfMenu',
					margin : '10 10 10 0',
					width : '20%',
					parent : null,
					layout : {
						type : 'vbox'
					},
					selectedProfileMenu : null,
					initComponent : function() {
						var me = this;
						this.items = [ {
							xtype : 'label',
							cls : 'selected-cb-background cursor_pointer',
							height : 22,
							name : 'liquidity',
							width : '100%',
							padding : '2 0 0 10',
							listeners : {
								render : function(c) {
									c.getEl().on('click', function() {
										me.parent.fireEvent('menuClick', c);
									}, c);
									me.updateCountLabel(c);
								}
							}
						} ];
						this.callParent(arguments);
						this.hideProfileMenuBasedOnRights();
						this.setSelectedLiquidityProfileMenu();
					},
					hideProfileMenuBasedOnRights : function() {
						var me = this;
						var liquidityProfilesPermissionObj = Ext
								.decode(liquidityProfilesPermission);
						Ext.each(liquidityProfilesPermissionObj, function(field,
								index) {
							liquidityProfilesPermissionObj = field;
						});
						if (liquidityProfilesPermissionObj != undefined
								&& liquidityProfilesPermissionObj.liquidityProfilesPermission.VIEW == false) {
							me.hideProfileMenu("liquidity");
						}
					},
					setSelectedLiquidityProfileMenu : function() {
						var me = this;
						var liquidityProfilesPermissionObj = Ext
								.decode(liquidityProfilesPermission);
						Ext.each(liquidityProfilesPermissionObj, function(field,
								index) {
							liquidityProfilesPermissionObj = field;
						});
						if (liquidityProfilesPermissionObj != undefined
								&& liquidityProfilesPermissionObj.liquidityProfilesPermission.VIEW == false) {
							/* Add New Profile Here */
							// this.setSelectedProfile('check');
						} else if (liquidityProfilesPermissionObj != undefined) {
							this
									.setSelectedProfile(
											'liquidity',
											liquidityProfilesPermissionObj.liquidityProfilesPermission.VIEW);
						}

					},
					setSelectedProfile : function(profile,
							canSelectedProfileView) {

						if (!strSelectedProfileFromBackAction
								&& (strSelectedProfile == null || strSelectedProfile == '')
								&& canSelectedProfileView) {
							strSelectedProfile = profile;
							this.selectedProfileMenu = profile;
						}
						if ((this.selectedProfileMenu == null || this.selectedProfileMenu == '')
								&& canSelectedProfileView) {
							this.selectedProfileMenu = profile;
						}
					},
					getselectedProfileMenu : function() {
						return this.selectedProfileMenu;
					},
					hideProfileMenu : function(lableName) {
						var profileMenu = this.down('label[name=' + lableName
								+ ']');
						if (profileMenu)
							profileMenu.hide();
					},
					updateCountLabel : function(c) {
						var name = c.name;
						var prf = null;
						if (!Ext.isEmpty(prfMstCnt)
								&& !Ext.isEmpty(prfMstCnt.d))
							prf = prfMstCnt.d[name];

						if (prf) {
							var profilesPendingAuthCount = prf.profilesPendingAuthCount;
							var profilesCount = prf.profilesCount;
							var text;
							if (profilesPendingAuthCount > 0) {
								text = getLabel(name, name) + ' ('
										+ profilesCount + '|'
										+ '<span class="red">'
										+ profilesPendingAuthCount + '</span>'
										+ ')';
							} else {
								text = getLabel(name, name) + ' ('
										+ profilesCount + '|'
										+ profilesPendingAuthCount + ')'
								')';
							}
							c.update(text);
						}
					}

				});