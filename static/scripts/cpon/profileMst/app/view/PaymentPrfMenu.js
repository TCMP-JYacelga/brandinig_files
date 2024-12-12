Ext.define('GCP.view.PaymentPrfMenu', {
	extend : 'Ext.panel.Panel',
	xtype : 'paymentPrfMenu',
	width : '20%',
	parent : null,
	layout : {
		type : 'vbox'
	},
	selectedProfileMenu : null,
	initComponent : function() {
		var me = this;
		this.items = [{
					xtype : 'label',
					cls : 'cursor_pointer ofcontents ux_font-size14-normal ux_panel-transparent-background',
					name : 'paymentWorkflow',
					height : 30,
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
					height : 30,
					width : '100%',
					cls : 'cursor_pointer ux_font-size14-normal dark_grey',
					padding : '7 0 0 5',
					name : 'systemBene',
					listeners : {
						render : function(c) {
							c.getEl().on('click', function() {
										me.parent.fireEvent('menuClick', c);
									}, c);
							me.updateCountLabel(c);
						}
					}
				}, {
					xtype : 'label',
					height : 30,
					width : '100%',
					cls : 'cursor_pointer ux_font-size14-normal dark_grey',
					padding : '7 0 0 5',
					name : 'achPassThru',
					listeners : {
						render : function(c) {
							c.getEl().on('click', function() {
										me.parent.fireEvent('menuClick', c);
									}, c);
							me.updateCountLabel(c);
						}
					}
				} /*{
					xtype : 'label',
					height : 30,
					name : 'paymentPackage',
					cls : 'cursor_pointer',
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
				}, {
					xtype : 'label',
					height : 30,
					name : 'paymentFeature',
					cls : 'cursor_pointer',
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
				}*/];
		this.callParent(arguments);
		this.hideProfileMenuBasedOnRights();
		this.setSelectedPaymentsProfileMenu();
	},
	hideProfileMenuBasedOnRights : function() {
		var me = this;
		var brProfilesPermissionObj = Ext.decode(paymentsProfilesPermission);
		Ext.each(brProfilesPermissionObj, function(field, index) {
					brProfilesPermissionObj = field;
				});
		if (brProfilesPermissionObj != undefined
				&& brProfilesPermissionObj.paymentWorkflowPermission.VIEW == false) {
			me.hideProfileMenu("paymentWorkflow");
		}
		if (brProfilesPermissionObj != undefined
				&& brProfilesPermissionObj.systemBenePermission.VIEW == false) {
			me.hideProfileMenu("systemBene");
		}
		if (brProfilesPermissionObj != undefined
				&& brProfilesPermissionObj.paymentPackagePermission.VIEW == false) {
			me.hideProfileMenu("paymentPackage");
		}
		if (brProfilesPermissionObj != undefined
				&& brProfilesPermissionObj.paymentFeaturePermission.VIEW == false) {
			me.hideProfileMenu("paymentFeature");
		}
		if (brProfilesPermissionObj != undefined
				&& brProfilesPermissionObj.achPassThruBenePermission.VIEW == false) {
			me.hideProfileMenu("achPassThru");
		}

	},
	setSelectedPaymentsProfileMenu : function() {
		var me = this;
		var brProfilesPermissionObj = Ext.decode(paymentsProfilesPermission);
		Ext.each(brProfilesPermissionObj, function(field, index) {
					brProfilesPermissionObj = field;
				});
		if (brProfilesPermissionObj != undefined
				&& brProfilesPermissionObj.paymentWorkflowPermission.VIEW == false) {
			this.setSelectedProfile('systemBene',
					brProfilesPermissionObj.systemBenePermission.VIEW);
		} else if (brProfilesPermissionObj != undefined) {
			this.setSelectedProfile('paymentWorkflow',
					brProfilesPermissionObj.paymentWorkflowPermission.VIEW);
		}
		if (brProfilesPermissionObj != undefined
				&& brProfilesPermissionObj.systemBenePermission.VIEW == false) {
			this.setSelectedProfile('paymentPackage',
					brProfilesPermissionObj.paymentPackagePermission.VIEW);
		}
		if (brProfilesPermissionObj != undefined
				&& brProfilesPermissionObj.paymentPackagePermission.VIEW == false) {
			this.setSelectedProfile('paymentFeature',
					brProfilesPermissionObj.paymentFeaturePermission.VIEW);
		}
		if (brProfilesPermissionObj != undefined
				&& brProfilesPermissionObj.paymentFeaturePermission.VIEW == false) {
			this.setSelectedProfile('achPassThru',
					brProfilesPermissionObj.achPassThruBenePermission.VIEW);
		}
		if (brProfilesPermissionObj != undefined
				&& brProfilesPermissionObj.achPassThruBenePermission.VIEW == false) {
			// this.setSelectedProfile(paymentFeature);
		}
	},
	setSelectedProfile : function(profile, canSelectedProfileView) {
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
		var profileMenu = this.down('label[name=' + lableName + ']');
		if ( null != profileMenu )
		profileMenu.hide();
	},
	updateCountLabel : function(c) {
		var name = c.name;
		var prf = null;
		if (!Ext.isEmpty(prfMstCnt) && !Ext.isEmpty(prfMstCnt.d))
			prf = prfMstCnt.d[name];
		if (prf) {
			var profilesPendingAuthCount = prf.profilesPendingAuthCount;
			var profilesCount = prf.profilesCount;
			var text;
			if (profilesPendingAuthCount > 0) {
				text = getLabel(name, name) + ' (' + profilesCount + '|'
						+ '<span class="red">' + profilesPendingAuthCount
						+ '</span>' + ')';
			} else {
				text = getLabel(name, name) + ' (' + profilesCount + '|'
						+ profilesPendingAuthCount + ')'
				')';
			}
			c.update(text);
		}
	}

});