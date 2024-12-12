Ext.define('GCP.view.IncomingPaymentsPrfMenu', {
			extend : 'Ext.panel.Panel',
			xtype : 'incomingPaymentsPrfMenu',
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
							name : 'incomingPayment',
							text : getLabel('incomingPayment', 'Incoming ACH Profile'),
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
						},
						{
							xtype : 'label',
							name : 'positivePay',
							text : getLabel('positivePay', 'Positive Pay Profile'),
							height : 30,
							cls : 'cursor_pointer ux_font-size14-normal dark_grey',
							padding : '7 0 0 5',
							width : '100%',
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
				this.setSelectedIncomingPaymentsProfileMenu();
			},
			hideProfileMenuBasedOnRights : function(){
				var me  =this;
				var incomingPaymentProfilesPermissionObj = Ext.decode(incomingPaymentsProfilesPermission);
				Ext.each(incomingPaymentProfilesPermissionObj, function(field, index) {
					incomingPaymentProfilesPermissionObj = field;
				});
				if(incomingPaymentProfilesPermissionObj != undefined && incomingPaymentProfilesPermissionObj.incomingPaymentPermission.VIEW == false){		
					me.hideProfileMenu("incomingPayment");
				}
				if(incomingPaymentProfilesPermissionObj != undefined && incomingPaymentProfilesPermissionObj.positivePayPermission.VIEW == false){		
					me.hideProfileMenu("positivePay");
				}
				
							
			},
			setSelectedIncomingPaymentsProfileMenu : function(){
				var me  =this;
				var incomingPaymentProfilesPermissionObj = Ext.decode(incomingPaymentsProfilesPermission);
				Ext.each(incomingPaymentProfilesPermissionObj, function(field, index) {
					incomingPaymentProfilesPermissionObj = field;
				});
				if(incomingPaymentProfilesPermissionObj != undefined && incomingPaymentProfilesPermissionObj.incomingPaymentPermission.VIEW == false){	
					/* Add New Profile Here*/
					//this.setSelectedProfile('check');
				}
				else if(incomingPaymentProfilesPermissionObj != undefined){
					this.setSelectedProfile('incomingPayment',incomingPaymentProfilesPermissionObj.incomingPaymentPermission.VIEW);
				}
				 if(incomingPaymentProfilesPermissionObj != undefined){
						this.setSelectedProfile('positivePay',incomingPaymentProfilesPermissionObj.positivePayPermission.VIEW);
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