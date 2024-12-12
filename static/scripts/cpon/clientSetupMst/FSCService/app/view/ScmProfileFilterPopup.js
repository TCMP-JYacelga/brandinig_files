Ext.define('CPON.view.ScmProfileFilterPopup', {
			extend : 'Ext.window.Window',
			xtype : 'scmProfileFilterPopup',
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
				var categoryStore = Ext.create('Ext.data.Store', {
							fields : ['name', 'value'],
							proxy : {
								type : 'ajax',
								url : 'cpon/cponseek/categoryList.json',
								reader : {
									type : 'json',
									root : 'd.filter'
								},
								noCache:false,
								actionMethods:  {
									create: "POST", 
									read: "POST", 
									update: "POST", 
									destroy: "POST"
								}
							},
							autoLoad : true
						});
						
				categoryStore.on('load',function(store){
					store.insert(0,{"name" : getLabel('all','ALL'), "value" : ""});
				});
										
			me.items = [
				         {
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
										fieldLabel : getLabel('catName','Category'),
										fieldCls : 'xn-form-field inline_block',
										triggerBaseCls : 'xn-form-trigger',
										labelAlign : 'top',
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
							text : getLabel('go', 'Go'),
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
				var category2 = '';
				var service = me.service;
				var alertType = me.alertType;
				var dropdownId = me.dropdownId;
				if (!Ext.isEmpty(me.fnCallback)
						&& typeof me.fnCallback == 'function') {
					me.fnCallback(service, dropdownId, me.dropdownType,
							searchType, category1, category2, alertType);
					me.close();
				}

			}
		});
