Ext.define('GCP.view.CollectionPrfMenu', {
	extend : 'Ext.panel.Panel',
	xtype : 'collectionPrfMenu',
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
					cls : 'cursor_pointer ux_font-size14 ux_panel-transparent-background',
					name : 'Receivable',
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
				}];
		this.callParent(arguments);
		this.hideProfileMenuBasedOnRights();
		this.setSelectedCollectionProfileMenu();
	},
	hideProfileMenuBasedOnRights : function() {
		var me = this;
		var collectionProfilesPermissionObj = Ext.decode(collectionProfilesPermission);
		Ext.each(collectionProfilesPermissionObj, function(field, index) {
					collectionProfilesPermissionObj = field;
				});
		if (collectionProfilesPermissionObj != undefined
				&& collectionProfilesPermissionObj.collectionProfilesPermission.VIEW == false) {
			me.hideProfileMenu("Receivable");
		}

	},
	setSelectedCollectionProfileMenu : function(){
		var me = this;
		var collectionProfilesPermissionObj = Ext.decode(collectionProfilesPermission);
		Ext.each(collectionProfilesPermissionObj, function(field, index) {
					collectionProfilesPermissionObj = field;
		});
		if(collectionProfilesPermissionObj != undefined){
			this.setSelectedProfile('Receivable',collectionProfilesPermissionObj.collectionProfilesPermission.VIEW);
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
		}else
		{
			c.update(name);
		}
	}

});