Ext.define('GCP.view.PrfFilterView', {
			extend : 'Ext.panel.Panel',
			xtype : 'prfFilterView',
			requires : ['Ext.ux.gcp.AutoCompleter'],
			width : '100%',
			layout : {
				type : 'vbox'
			},
			initComponent : function() {
				var me = this;
				this.items = [{
							xtype : 'container',
							itemId : 'containerHeader',
							//componentCls : 'gradiant_back',
							cls : 'lbl-cls',
							width : '100%',
							minHeight : '20',
							items : [{
										xtype : 'label',
										itemId : 'containerHdrLabel',
										text : 'Alert Profiles',
										cls : 'ux_font-size14 ux_hide-image',
										padding : '8 0 0 8'
									}]
						}, {
							xtype : 'container',
							itemId : 'filterContainerHeader',
							//componentCls : 'gradiant_back',
							width : '100%',
							margin : '5 0 0 0',
							minHeight : '10',
							items : [{
										xtype : 'label',
										itemId : 'filterContainerHdrLabel',
										cls : 'ux_font-size14',
										text :  getLabel('filter', 'Filter'),
										padding : '8 0 0 8'
									}]
						}, {
							xtype : 'container',
							itemId : 'flterContainer',
							width : '100%',
							margin : '5 0 0 0'
						}];
				this.callParent(arguments);
			},
			renderFilterView : function(data, selectedPrfMst) {
				var me = this;
				var profileArr = data;
				var container = me.down('container[itemId=flterContainer]');
				if (container.items.length > 0) {
					container.removeAll();
				}
				for (var i = 0; i < profileArr.length; i++) {
					var subProfile = profileArr[i];
					var mainContainer = me.createContainerWithColumnLayout();
					for (var j = 0; j < subProfile.length; j++) {
						var field = null;
						var compo = subProfile[j];
						var subContainer = me.createContainer();
						var text = getLabel(compo.label, compo.label)
						switch (compo.componentType) {
							// AutoCompleter
							case 'AutoCompleter' :
								if (compo.showLabel) {
									subContainer.add(me.createLabel(text));
								}
								field = this.createAutoCompleteText(
										compo.itemId, compo.name, compo.cfgUrl,
										compo.cfgSeekId, compo.cfgKeyNode,
										compo.cfgRootNode, compo.cfgDataNode1);
								subContainer.add(field);
								break;
							// ComboBox
							case 'ComboBox' :
								var value = getLabel(compo.value, compo.value)
								if (compo.showLabel) {
									subContainer.add(me.createLabel(text));
								}
								field = this.createCombobox(compo.url,
										compo.displayField, compo.itemId,
										compo.fltParamName, value,
										compo.cfgRootNode, compo.valueField);
								subContainer.add(field);
								break;
							// button
							case 'button' :
								field = this.createSearchButton(text);
								subContainer.layout = 'vbox';
								subContainer.margin = '23 0 0 0';
								subContainer.add(field);
								break;
						}
						mainContainer.add(subContainer);
					}
					container.add(mainContainer);
				}
			},
			createAutoCompleteText : function(itemId, name, cfgUrl, cfgSeekId,
					cfgKeyNode, cfgRootNode, cfgDataNode1) {
				var keyNode;
				if (!Ext.isEmpty(cfgKeyNode)) {
					keyNode = cfgKeyNode;
				} else {
					keyNode = cfgDataNode1;
				}
				var autoCompleteField = Ext.create('Ext.ux.gcp.AutoCompleter',
						{
							//padding : '1 0 0 10',
							fieldCls : 'xn-form-text w12 xn-suggestion-box',
							name : name,
							itemId : itemId,
							cfgUrl : cfgUrl,
							cfgQueryParamName : 'qfilter',
							cfgRecordCount : -1,
							cfgSeekId : cfgSeekId,
							cfgKeyNode : keyNode,
							cfgRootNode : cfgRootNode,
							cfgDataNode1 : cfgDataNode1,
							cfgProxyMethodType : 'POST',
							enableQueryParam:false
						});
				return autoCompleteField;
			},

			createCombobox : function(strUrl, strDisplayField, fldId,
					fltParamName, defaultValue, cfgRootNode, valueField) {

				objStore = Ext.create('Ext.data.Store', {
							fields : ["name", "value"],
							proxy : {
								type : 'ajax',
								autoLoad : true,
								url : strUrl,
								noCache: false,
								actionMethods : {
									read : 'POST'
								},
								reader : {
									type : 'json',
									root : cfgRootNode
								}
							}
						});
				var field = Ext.create('Ext.form.field.ComboBox', {
							displayField : strDisplayField,
							fieldCls : 'xn-form-field inline_block',
							triggerBaseCls : 'xn-form-trigger',
							filterParamName : 'module',
							itemId : fldId,
							valueField : valueField,
							name : fltParamName,
							editable : false,
							value : defaultValue,
							store : objStore,							
							//padding : '1 0 0 10',
							width : 165
						});
				return field;
			},

			createSearchButton : function(label) {
				var buttonField = Ext.create('Ext.button.Button', {
							itemId : 'filterBtnId',
							cls : 'xn-button ux_button-background-color ux_button-padding',
							text : label
							//width : 60,
							//height : 22
						});
				return buttonField;
			},

			createLabel : function(label) {
				var label = Ext.create('Ext.form.Label', {
							text : label,
							cls : 'frmLabel'
						});
				return label;
			},

			createContainerWithColumnLayout : function() {
				var container = Ext.create('Ext.container.Container', {
							width : '100%',
							layout : 'column'
						});
				return container;
			},

			createContainer : function() {
				var container = Ext.create('Ext.container.Container', {
							columnWidth : 0.33,
							padding : '10px'
						});
				return container;
			}
		});