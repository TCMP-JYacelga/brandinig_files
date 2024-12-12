Ext.define('GCP.view.BRPrfMenu', {
			extend : 'Ext.panel.Panel',
			xtype : 'brPrfMenu',
			parent : null,
			layout : {
				type : 'vbox'
			},
			selectedProfileMenu : null,
			initComponent : function() {
				var me = this;
				this.items = [{
							xtype : 'label',
							cls : 'cursor_pointer ux_font-size14-normal ux_panel-transparent-background',
							height : 30,
							name : 'typecode',
							width : '100%',
							padding : '7 0 0 5',
							listeners : {
								render : function(c) {
									c.getEl().on('click', function() {
												me.parent.fireEvent(
														'menuClick', c);
											}, c);
									me.updateCountLabel(c);
								}
							}
						}/*, {
							xtype : 'label',
							height : 22,
							cls : 'cursor_pointer',
							name : 'brfeature',
							width : '100%',
							padding : '2 0 0 10',
							listeners : {
								render : function(c) {
									c.getEl().on('click', function() {
												me.parent.fireEvent(
														'menuClick', c);
											}, c);
									me.updateCountLabel(c);
								}
							}
						}*/];
				this.callParent(arguments);
				this.hideProfileMenuBasedOnRights();
				this.setSelectedBRProfileMenu();
			},
			hideProfileMenuBasedOnRights : function(){
				var me  =this;
				var brProfilesPermissionObj = Ext.decode(balanceReportingProfilesPermission);
				Ext.each(brProfilesPermissionObj, function(field, index) {
					brProfilesPermissionObj = field;
				});
				if(brProfilesPermissionObj != undefined && brProfilesPermissionObj.typecodePermission.VIEW == false){		
					me.hideProfileMenu("typecode");
				}
				
			},
			setSelectedBRProfileMenu : function(){
				var me  =this;
				var brProfilesPermissionObj = Ext.decode(balanceReportingProfilesPermission);
				Ext.each(brProfilesPermissionObj, function(field, index) {
					brProfilesPermissionObj = field;
				});
				if(brProfilesPermissionObj != undefined)
				{
					this.setSelectedProfile('typecode',brProfilesPermissionObj.typecodePermission.VIEW);
				}
				if(brProfilesPermissionObj != undefined && brProfilesPermissionObj.brfeaturePermission.VIEW == false){		
					//this.setSelectedProfile('paymentPackage');
				}
			},
			setSelectedProfile : function(profile,canSelectedProfileView){
				
				if(!strSelectedProfileFromBackAction && (strSelectedProfile == null || strSelectedProfile == '') &&
				canSelectedProfileView ){
					strSelectedProfile = profile;
					this.selectedProfileMenu = profile;
				}
				if((this.selectedProfileMenu == null || this.selectedProfileMenu == '')&& canSelectedProfileView){
					this.selectedProfileMenu = profile;
				}
			},
			getselectedProfileMenu : function(){
				return this.selectedProfileMenu;
			},
			hideProfileMenu : function(lableName){
				var profileMenu = this.down('label[name='+lableName+']');
				if (profileMenu) profileMenu.hide();
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
						text = getLabel(name, name) + ' (' + profilesCount
								+ '|' + '<span class="red">'
								+ profilesPendingAuthCount + '</span>' + ')';
					} else {
						text = getLabel(name, name) + ' (' + profilesCount
								+ '|' + profilesPendingAuthCount + ')'
						')';
					}
					c.update(text);
				}
			}

		});