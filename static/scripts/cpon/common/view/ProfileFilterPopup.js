Ext.define('GCP.view.ProfileFilterPopup', {
			extend : 'Ext.window.Window',
			xtype : 'profilefilterpopup',
			width : 470,
			autoHeight : true,
			modal : true,
			draggable : true,
			closeAction : 'hide',
			autoScroll : true,
			title : getLabel('advanceSearch', 'Advance Search'),
			config : {
				fnCallback : null,
				itemId : null,
				service : null,
				dropdownId : null,
				dropdownType : null,
				alertType : null
			},

			initComponent : function() {
				var me = this;
					
				me.items = [{
				            xtype : 'container',
							layout : 'hbox',
							items : [{
							xtype : 'radiogroup',
							margin : '20px 0 0 0',
							width : 200,
							fieldLabel : '',
							items : [{
										xtype : 'radiofield',
										name : 'searchType',
										boxLabel : getLabel('standard','Standard'),
										value : 'S',
										itemId : 'S',
										checked : true
									}, {
										xtype : 'radiofield',
										name : 'searchType',
										boxLabel : getLabel('custom','Custom'),
										value : 'C',
										itemId : 'C'
									}]
						}, {
							xtype : 'container',
							
							items : [{
										xtype : 'combobox',
										padding: '0 25 0 0',
										itemId : 'category1',
										fieldLabel : getLabel('category','Category'),
										fieldCls : 'xn-form-field inline_block',
										triggerBaseCls : 'xn-form-trigger',
										labelAlign : 'top',
										labelCls : 'frmLabel',
										labelSeparator : '',
										valueField : 'value',
										displayField : 'name',
										editable : false,
										value : '',
										store : categoryStore
									}]
						}]
                    }]
				me.buttons = [{
							xtype : 'button',
							text : '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;'+getLabel('go', 'Go'),
							cls : 'ux_button-padding ux_button-background-color',
							glyph : 'xf058@fontawesome',
							handler : function() {
								me.saveItems();
							}
						}], me.callParent(arguments);
			},
			saveItems : function() {
				var me = this;
				var searchType1 = me.down('radio[itemId=S]').getValue();
				var searchType2 = me.down('radio[itemId=C]').getValue();

				if (searchType1)
					searchType = me.down('radio[itemId=S]').getItemId();
				else
					searchType = me.down('radio[itemId=C]').getItemId();

				var category1 = me.down('combo[itemId=category1]').getValue();
				var service = me.service;
				var alertType = me.alertType;
				var category2='';
				var dropdownId = me.dropdownId;
				if (!Ext.isEmpty(me.fnCallback)
						&& typeof me.fnCallback == 'function') {
					me.fnCallback(service, dropdownId, me.dropdownType,
							searchType, category1, category2, alertType);
					me.close();
				}

			}
		});
