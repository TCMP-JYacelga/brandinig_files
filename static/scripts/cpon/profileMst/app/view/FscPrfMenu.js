Ext.define('GCP.view.FscPrfMenu',{
		extend : 'Ext.panel.Panel',
		xtype : 'fscPrfMenu',
		width : '20%',
		parent : null,
		layout : {
			type : 'vbox'
		},
		selectedProfileMenu : null,
		initComponent : function() {
			var me = this;
			this.items = [ /*{ //Feature Profiles are removed (This is FSC feature profile)
					xtype : 'label',
					cls : 'cursor_pointer ux_font-size14-normal ux_panel-transparent-background',
					height : 30,
					name : 'fsc',
					width : '100%',
					padding : '7 0 0 5',
					listeners : {
						render : function(c) {
							c.getEl().on('click', function() {
								me.parent.fireEvent('menuClick', c);
							}, c);
							me.updateCountLabel(c);
						}
					}
				}, */{
					xtype : 'label',
					cls : 'cursor_pointer ofcontents ux_font-size14-normal  ux_panel-transparent-background',
					height : 30,
					name : 'workflow',
					width : '100%',
					padding : '7 0 0 5',
					listeners : {
						render : function(c) {
							c.getEl().on('click', function() {
								me.parent.fireEvent('menuClick', c);
							}, c);
							me.updateCountLabel(c);
							Ext.create('Ext.tip.ToolTip',{
								target: c.getEl(),
								html: c.html
								});
						}
					}
				}, {
					xtype : 'label',
					cls : 'cursor_pointer ux_font-size14-normal dark_grey',
					height : 30,
					name : 'overdue',
					width : '100%',
					padding : '7 0 0 5',
					listeners : {
						render : function(c) {
							c.getEl().on('click', function() {
								me.parent.fireEvent('menuClick', c);
							}, c);
							me.updateCountLabel(c);
						}
					}
				},
				 {
					xtype : 'label',
					cls : 'cursor_pointer ux_font-size14-normal dark_grey',
					height : 30,
					name : 'financing',
					width : '100%',
					padding : '7 0 0 5',
					listeners : {
						render : function(c) {
							c.getEl().on('click', function() {
								me.parent.fireEvent('menuClick', c);
							}, c);
							me.updateCountLabel(c);
						}
					}
				}
			];
			this.callParent(arguments);
			this.hideProfileMenuBasedOnRights();
			this.setSelectedOthersProfileMenu();
		},
		hideProfileMenuBasedOnRights : function() {
			var me = this;
			var fscProfilesPermissionObj = Ext.decode(fscProfilesPermission);
			Ext.each(fscProfilesPermissionObj, function(field, index) {
				fscProfilesPermissionObj = field;
			});
			if (fscProfilesPermissionObj != undefined && fscProfilesPermissionObj.fscProfilesPermission.VIEW == false) {
				me.hideProfileMenu("fsc");
			}
			if (fscProfilesPermissionObj != undefined && fscProfilesPermissionObj.workflowProfilesPermission.VIEW == false) {
				me.hideProfileMenu("workflow");
			}
			if (fscProfilesPermissionObj != undefined && fscProfilesPermissionObj.overdueProfilesPermission.VIEW == false) {
				me.hideProfileMenu("overdue");
			}
			if (fscProfilesPermissionObj != undefined && fscProfilesPermissionObj.financingProfilesPermission.VIEW == false) {
				me.hideProfileMenu("financing");
			}
		},
		setSelectedOthersProfileMenu : function() {
			var me = this;
			var fscProfilesPermissionObj = Ext.decode(fscProfilesPermission);
			Ext.each(fscProfilesPermissionObj, function(field, index) {
				fscProfilesPermissionObj = field;
			});
			
			if (fscProfilesPermissionObj != undefined && fscProfilesPermissionObj.fscProfilesPermission.VIEW == false) {
				this.setSelectedProfile('workflow',fscProfilesPermissionObj.workflowProfilesPermission.VIEW);
			}
			else if (fscProfilesPermissionObj != undefined) {
				this.setSelectedProfile('fsc', fscProfilesPermissionObj.fscProfilesPermission.VIEW);
			} 
			if (fscProfilesPermissionObj != undefined && fscProfilesPermissionObj.workflowProfilesPermission.VIEW == false) {
				this.setSelectedProfile('overdue', fscProfilesPermissionObj.overdueProfilesPermission.VIEW);
			}
			if (fscProfilesPermissionObj != undefined && fscProfilesPermissionObj.overdueProfilesPermission.VIEW == false) {
				this.setSelectedProfile('fsc', fscProfilesPermissionObj.fscProfilesPermission.VIEW);
			}
			if (fscProfilesPermissionObj != undefined && fscProfilesPermissionObj.fscProfilesPermission.VIEW == false) {
				this.setSelectedProfile('financing', fscProfilesPermissionObj.financingProfilesPermission.VIEW);
			}
			if(fscProfilesPermissionObj != undefined && fscProfilesPermissionObj.financingProfilesPermission.VIEW == false){
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
			}else
			{
				c.update(name);
			}
		}

	});