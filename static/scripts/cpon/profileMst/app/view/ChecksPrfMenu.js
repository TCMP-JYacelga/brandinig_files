Ext.define('GCP.view.ChecksPrfMenu', {
			extend : 'Ext.panel.Panel',
			xtype : 'checksPrfMenu',
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
							height : 30,
							name : 'check',
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
						}];
				this.callParent(arguments);
				this.hideProfileMenuBasedOnRights();
				this.setSelectedChecksProfileMenu();
			},
			hideProfileMenuBasedOnRights : function(){
				var me  =this;
				var checkProfilesPermissionObj = Ext.decode(checksProfilesPermission);
				Ext.each(checkProfilesPermissionObj, function(field, index) {
					checkProfilesPermissionObj = field;
				});
				if(checkProfilesPermissionObj != undefined && checkProfilesPermissionObj.check.VIEW == false){		
					me.hideProfileMenu("check");
				}
				
							
			},
			setSelectedChecksProfileMenu : function(){
				var me  =this;
				var checkProfilesPermissionObj = Ext.decode(checksProfilesPermission);
				Ext.each(checkProfilesPermissionObj, function(field, index) {
					checkProfilesPermissionObj = field;
				});
				if(checkProfilesPermissionObj != undefined && checkProfilesPermissionObj.check.VIEW == false){	
					/* Add New Profile Here*/
					//this.setSelectedProfile('check');
				}
				else if(checkProfilesPermissionObj != undefined){
					this.setSelectedProfile('check',checkProfilesPermissionObj.check.VIEW);
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