Ext
		.define(
				'GCP.view.OthersPrfMenu',
				{
					extend : 'Ext.panel.Panel',
					xtype : 'othersPrfMenu',
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
							name : 'others',
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
						this.setSelectedOthersProfileMenu();
					},
					hideProfileMenuBasedOnRights : function() {
						var me = this;
						var othersProfilesPermissionObj = Ext
								.decode(othersProfilesPermission);
						Ext.each(othersProfilesPermissionObj, function(field,
								index) {
							othersProfilesPermissionObj = field;
						});
						if (othersProfilesPermissionObj != undefined
								&& othersProfilesPermissionObj.othersProfilePermission.VIEW == false) {
							me.hideProfileMenu("others");
						}
					},
					setSelectedOthersProfileMenu : function() {
						var me = this;
						var othersProfilesPermissionObj = Ext
								.decode(othersProfilesPermission);
						Ext.each(othersProfilesPermissionObj, function(field,
								index) {
							othersProfilesPermissionObj = field;
						});
						if (othersProfilesPermissionObj != undefined
								&& othersProfilesPermissionObj.othersProfilePermission.VIEW == false) {
							/* Add New Profile Here */
							// this.setSelectedProfile('check');
						} else if (othersProfilesPermissionObj != undefined) {
							this
									.setSelectedProfile(
											'others',
											othersProfilesPermissionObj.othersProfilePermission.VIEW);
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