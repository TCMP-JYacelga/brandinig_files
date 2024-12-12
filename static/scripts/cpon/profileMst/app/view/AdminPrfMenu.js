Ext.define('GCP.view.AdminPrfMenu', {
			extend : 'Ext.panel.Panel',
			xtype : 'adminPrfMenu',
			//margin : '10 10 10 0',
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
							name : 'alert',
							cls : 'cursor_pointer ux_font-size14 ux_panel-transparent-background',
							height : 30,
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
						}, {
							xtype : 'label',
							name : 'report',
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
						}, {
							xtype : 'label',
							name : 'interface',
							height : 30,
							cls : 'cursor_pointer ux_font-size14-normal dark_grey',
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
						}, {
							xtype : 'label',
							name : 'limit',
							height : 30,
							width : '100%',
							cls : 'cursor_pointer ux_font-size14-normal dark_grey',
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
						},  {
							xtype : 'label',
							name : 'tax',
							height : 30,
							width : '100%',
							cls : 'cursor_pointer ux_font-size14-normal dark_grey',
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
						},  {
							xtype : 'label',
							name : 'chargeFrequency',
							height : 30,
							width : '100%',
							cls : 'cursor_pointer ofcontents ux_font-size14-normal dark_grey',
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
						}, {
							xtype : 'label',
							name : 'charge',
							height : 30,
							width : '100%',
							cls : 'cursor_pointer ux_font-size14-normal dark_grey',
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
						}, {
							xtype : 'label',
							text : getLabel('cutOff', 'Cut Off'),
							name : 'cutoff',
							height : 30,
							width : '100%',
							cls : 'cursor_pointer ux_font-size14-normal dark_grey',
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
						}, /*{
							xtype : 'label',
							height : 30,
							name : 'fxSpread',
							cls : 'cursor_pointer ux_font-size14-normal dark_grey',
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
						}, {
							xtype : 'label',
							text : getLabel('adminfeature', 'Admin Feature'),
							name : 'adminfeature',
							height : 22,
							width : '100%',
							cls : 'cursor_pointer',
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
						}*/,{
							xtype : 'label',
							text : getLabel('password', 'Password Attributes'),
							name : 'password',
							height : 30,
							width : '100%',
							cls : 'cursor_pointer ux_font-size14-normal dark_grey',
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
						},{
							xtype : 'label',
							text : getLabel('token', 'MFA'),
							name : 'token',
							height : 30,
							width : '100%',
							cls : 'cursor_pointer ux_font-size14-normal dark_grey',
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
						}
						,{
							xtype : 'label',
							text : getLabel('groupBy', 'Group By'),
							name : 'groupBy',
							height : 30,
							width : '100%',
							cls : 'cursor_pointer ux_font-size14-normal dark_grey',
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
							text : getLabel('schedule', 'Schedule'),
							name : 'schedule',
							height : 30,
							width : '100%',
							cls : 'cursor_pointer ux_font-size14-normal dark_grey',
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
						},{
							xtype : 'label',
							text : getLabel('arrangement', 'Arrangement'),
							name : 'arrangement',
							height : 30,
							width : '100%',
							cls : 'cursor_pointer ux_font-size14-normal dark_grey',
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
				this.setSelectedAdminProfileMenu();
				
			},
			hideProfileMenuBasedOnRights : function(){
				var me  =this;
				var adminProfilesPermissionObj = Ext.decode(adminProfilesPermission);
				Ext.each(adminProfilesPermissionObj, function(field, index) {
					adminProfilesPermissionObj = field;
				});
				if(adminProfilesPermissionObj != undefined && adminProfilesPermissionObj.alertPermission.VIEW == false){		
					me.hideProfileMenu("alert");
				}
				if(adminProfilesPermissionObj != undefined && adminProfilesPermissionObj.reportPermission.VIEW == false){		
					me.hideProfileMenu("report");
				}
				if(adminProfilesPermissionObj != undefined && adminProfilesPermissionObj.interfacePermission.VIEW == false){		
					me.hideProfileMenu("interface");
				}
				if(adminProfilesPermissionObj != undefined && adminProfilesPermissionObj.enrichmentPermission.VIEW == false){		
					me.hideProfileMenu("enrichment");
				}
				if(adminProfilesPermissionObj != undefined && adminProfilesPermissionObj.limitPermission.VIEW == false){		
					me.hideProfileMenu("limit");
				}
				if(adminProfilesPermissionObj != undefined && adminProfilesPermissionObj.taxPermission.VIEW == false){		
					me.hideProfileMenu("tax");
				}
				if(adminProfilesPermissionObj != undefined && adminProfilesPermissionObj.computationposting.VIEW == false){		
					me.hideProfileMenu("chargeFrequency");
				}	
				if(adminProfilesPermissionObj != undefined && adminProfilesPermissionObj.billingPermission.VIEW == false){		
					me.hideProfileMenu("charge");
				}
				if(adminProfilesPermissionObj != undefined && adminProfilesPermissionObj.cutoffPermission.VIEW == false){		
					me.hideProfileMenu("cutoff");
				}
				if(adminProfilesPermissionObj != undefined && adminProfilesPermissionObj.adminfeaturePermission.VIEW == false){		
					me.hideProfileMenu("adminfeature");
				}
				if(adminProfilesPermissionObj != undefined && adminProfilesPermissionObj.fxSpreadPermission.VIEW == false){		
					me.hideProfileMenu("fxSpread");
				}
				if(adminProfilesPermissionObj != undefined && adminProfilesPermissionObj.password.VIEW == false){
					me.hideProfileMenu("password");
				}				
				if(adminProfilesPermissionObj != undefined && adminProfilesPermissionObj.token.VIEW == false){
					me.hideProfileMenu("token");
				}
				if(adminProfilesPermissionObj != undefined && adminProfilesPermissionObj.groupBy.VIEW == false){
					me.hideProfileMenu("groupBy");
				}
				if(adminProfilesPermissionObj != undefined && adminProfilesPermissionObj.schedulePermission.VIEW == false){
					me.hideProfileMenu("schedule");
				}
				if(adminProfilesPermissionObj != undefined && adminProfilesPermissionObj.arrangementPermission.VIEW == false){
					me.hideProfileMenu("arrangement");
				}
			},
			setSelectedAdminProfileMenu : function(){
				var me  =this;
				var adminProfilesPermissionObj = Ext.decode(adminProfilesPermission);
				Ext.each(adminProfilesPermissionObj, function(field, index) {
					adminProfilesPermissionObj = field;
				});
				if(adminProfilesPermissionObj != undefined && adminProfilesPermissionObj.alertPermission.VIEW == false){		
					this.setSelectedProfile('report',adminProfilesPermissionObj.reportPermission.VIEW);
				}
				else if(adminProfilesPermissionObj != undefined){
					this.setSelectedProfile('alert',adminProfilesPermissionObj.alertPermission.VIEW);
				}
				if(adminProfilesPermissionObj != undefined && adminProfilesPermissionObj.reportPermission.VIEW == false){		
					this.setSelectedProfile('interface',adminProfilesPermissionObj.interfacePermission.VIEW);
				}
				if(adminProfilesPermissionObj != undefined && adminProfilesPermissionObj.interfacePermission.VIEW == false){		
					this.setSelectedProfile('enrichment',adminProfilesPermissionObj.enrichmentPermission.VIEW);
				}
				if(adminProfilesPermissionObj != undefined && adminProfilesPermissionObj.enrichmentPermission.VIEW == false){		
					this.setSelectedProfile('limit',adminProfilesPermissionObj.limitPermission.VIEW);
				}
				if(adminProfilesPermissionObj != undefined && adminProfilesPermissionObj.limitPermission.VIEW == false){		
					this.setSelectedProfile('tax',adminProfilesPermissionObj.taxPermission.VIEW);
				}
				if(adminProfilesPermissionObj != undefined && adminProfilesPermissionObj.computationposting.VIEW == false){		
					this.setSelectedProfile('computationposting',adminProfilesPermissionObj.computationposting.VIEW);
				}
				if(adminProfilesPermissionObj != undefined && adminProfilesPermissionObj.computationposting.VIEW == false){		
					this.setSelectedProfile('billing',adminProfilesPermissionObj.billingPermission.VIEW);
				}
				if(adminProfilesPermissionObj != undefined && adminProfilesPermissionObj.billingPermission.VIEW == false){		
					this.setSelectedProfile('cutoff',adminProfilesPermissionObj.cutoffPermission.VIEW);
				}
				if(adminProfilesPermissionObj != undefined && adminProfilesPermissionObj.cutoffPermission.VIEW == false){		
					this.setSelectedProfile('adminfeature',adminProfilesPermissionObj.adminfeaturePermission.VIEW);
				}
				if(adminProfilesPermissionObj != undefined && adminProfilesPermissionObj.adminfeaturePermission.VIEW == false){
					this.setSelectedProfile('fxSpread',adminProfilesPermissionObj.fxSpreadPermission.VIEW);
				}
				if(adminProfilesPermissionObj != undefined && adminProfilesPermissionObj.fxSpreadPermission.VIEW == false){
					this.setSelectedProfile('password',adminProfilesPermissionObj.password.VIEW);
				}
				if(adminProfilesPermissionObj != undefined && adminProfilesPermissionObj.password.VIEW == false){
					this.setSelectedProfile('token',adminProfilesPermissionObj.token.VIEW);					
				}
				if(adminProfilesPermissionObj != undefined && adminProfilesPermissionObj.token.VIEW == false){
					this.setSelectedProfile('groupBy',adminProfilesPermissionObj.groupBy.VIEW);	
				}
				if(adminProfilesPermissionObj != undefined && adminProfilesPermissionObj.groupBy.VIEW == false){
					this.setSelectedProfile('schedule',adminProfilesPermissionObj.schedulePermission.VIEW);	
				}
				if(adminProfilesPermissionObj != undefined && adminProfilesPermissionObj.schedulePermission.VIEW == false){
					this.setSelectedProfile('arrangement',adminProfilesPermissionObj.arrangementPermission.VIEW);	
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
				if(null != profileMenu && undefined != profileMenu){
					profileMenu.hide();
				}
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
				}
				c.update(text);
			}

		});