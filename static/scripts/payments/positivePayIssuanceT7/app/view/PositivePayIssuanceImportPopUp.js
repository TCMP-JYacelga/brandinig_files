Ext.define('GCP.view.PositivePayIssuanceImportPopUp', {
	extend : 'Ext.window.Window',
	requires : [],
	xtype : 'positivePayIssuanceImportPopUp',
	itemId : 'positivePayImportPopUp',
	width : 375,
	autoHeight : true,
	autoScroll : true,
	closeAction : 'destroy',
	modal : true,
	title : getLabel('importPosPayIssuane', 'Import Issuance'),
	config : {
		mode : null,
		layout : 'fit'
	},
	initComponent : function() {
		var me = this;
		me.items = [{
			xtype : 'panel',
			items : [{
						xtype : 'container',
						itemId : 'errorContainer',
						maxHeight : 200,
						layout : 'vbox',
						height : 'auto',
						margin : '0 0 10 0'
						//hidden : true
					},{
					xtype : 'container',
					layout : 'column',
					items :[{
						xtype : 'label',
						columnWidth: 0.35,
						padding : '10 0 0 5',
						itemId : 'fiLabel',
						text : getLabel("financialInst", "Financial Institution"),
						cls : modeVal == 'VIEW'
								? 'f13 ux_font-size14 '
								: 'f13 ux_font-size14 '
					}, {
						xtype : 'container',
						columnWidth: 0.65,
						padding : '10 0 0 15',
						layout : 'hbox',
						itemId : 'posPayFIContainer',
						items : [{
							xtype : 'combo',
							itemId : 'posPayImportFICombo',
							name : 'posPayImportFICombo',
							width : 200,
							queryMode : 'local',
							fieldCls : 'xn-form-field',
							disabled : (modeVal == 'EDIT' || modeVal == 'VIEW'),
							triggerBaseCls : 'xn-form-trigger',
							store : me.getNewStore(),
							editable : false,
							displayField : 'DESCR',
							valueField : 'CODE',
							emptyText : getLabel('select', 'Select'),
							listeners : {
								select : function(combo, records, eOpts) {
									//var corpId = records[0].get('CODE');
									//me.fireEvent('changeClientStore',corpId);
								}
							}
						}]
					},{
						xtype : 'label',
						text : getLabel("client", "Company Name"),
						itemId : 'clientLabel',
						columnWidth: 0.35,
						padding : '12 0 0 5',
						cls : modeVal == 'VIEW'
							? 'f13 ux_font-size14 '
							: 'f13 ux_font-size14 '
					}, {
						xtype : 'container',
						columnWidth: 0.65,
						padding : '10 0 0 15',
						layout : 'hbox',
						itemId : 'posPayClientContainer',
						items : [{
							xtype : 'combo',
							itemId : 'posPayImportClientCombo',
							name : 'posPayImportClientCombo',
							width : 200,
							queryMode : 'local',
							fieldCls : 'xn-form-field',
							disabled : (modeVal == 'EDIT' || modeVal == 'VIEW'),
							triggerBaseCls : 'xn-form-trigger',
							store : me.getNewStore(),
							editable : false,
							displayField : 'DESCR',
							valueField : 'CODE',
							emptyText : getLabel('select', 'Select'),
							listeners : {
								select : function(combo, records, eOpts) {
									//var corpId = records[0].get('CODE');
									//me.fireEvent('changeClientStore',corpId);
								}
							}
						}]
					}, {
						xtype : 'label',
						text : getLabel("fileFormatType", "File Format Type"),
						columnWidth: 0.35,
						padding : '12 0 0 5',
						cls : modeVal == 'VIEW'
							? 'f13 ux_font-size14 '
							: 'f13 ux_font-size14 '
					}, {
						xtype : 'container',
						columnWidth: 0.65,
						padding : '10 0 0 15',
						layout : 'hbox',
						itemId : 'posPayFileTypeContainer',
						items : [{
							xtype : 'combo',
							itemId : 'posPayFileTypeCombo',
							name : 'posPayFileTypeCombo',
							width : 200,
							queryMode : 'local',
							fieldCls : 'xn-form-field',
							disabled : (modeVal == 'EDIT' || modeVal == 'VIEW'),
							triggerBaseCls : 'xn-form-trigger',
							store : me.getNewStore(),
							editable : false,
							displayField : 'DESCR',
							valueField : 'CODE',
							emptyText : getLabel('select', 'Select'),
							listeners : {
								select : function(combo, records, eOpts) {
									//var corpId = records[0].get('CODE');
									//me.fireEvent('changeClientStore',corpId);
								}
							}
						}]
					}]
					},
					{
						xtype: 'filefield',
						name : 'issuanceFile',
						padding : '10 0 0 5',
						fieldLabel: getLabel('fileName','File Name'),
						labelCls : 'f13 ux_font-size14 ',
						labelAlign : 'top',
						msgTarget: 'side',
						width : 340,
						allowBlank: true,
						anchor: '100%',
						buttonText: '',
						buttonConfig: {
							iconCls: 'icon-upload-file'
						}
					},
					{
						xtype : 'container',
						padding : '10 0 0 5',
						layout : 'vbox',
						items : [
							{
							xtype : 'text',
							text : getLabel('note', 'Note :')
							},
							{
							xtype : 'text',
							padding : '4 0 0 0',
							text : '1. File to be imported should consists valid issuance details.'
							},
							{
							xtype : 'text',
							padding : '2 0 0 0',
							text : '2. Please do not import file with same name again as this will be'
							},
							{
							xtype : 'text',
							padding : '2 0 0 11',
							text : ' rejected as duplicate.'
							},
							{
							xtype : 'text',
							padding : '2 0 0 0',
							text : '3. Max file size allowed is 5MB.'
							}
						]
					}]
		}, {
			xtype : 'panel',
			dockedItems : [{
				xtype : 'toolbar',
				cls : 'ux_panel-transparent-background xn-pad-10 ux_border-top',
				margin : '10 0 0 0',
				dock : 'bottom',
				items : [{
							xtype : 'button',
							itemId : 'btnCancel',
							text : getLabel('btnCancel', 'Cancel'),
							cls : 'ux_button-background-color ux_font-color-black',
							glyph : 'xf056@fontawesome',
							parent : this,
							handler : function(btn, opts) {
								me.close();
							}
						}, '->', {
							xtype : 'button',
							itemId : 'btnSaveAndAdd',
							margin : '0 0 0 120',
							text : getLabel('btnImport', 'Import'),
							hidden : (modeVal == 'EDIT' || modeVal == 'VIEW'),
							cls : 'ux_button-background-color ux_font-color-black',
							glyph : 'xf058@fontawesome',
							parent : this,
							handler : function(btn, opts) {
								me
								.fireEvent('savePositivePayImportAction',
										btn, opts);
							}
						}]
				}]
		}];
		me.callParent(arguments);
		me.hideFields();
	},
	getNewStore : function() {
		var store = Ext.create('Ext.data.Store', {
					fields : ['CODE', 'DESCR'],
					autoLoad : true,
					data : [{
								"CODE" : "IMPORT_ISSUE_FILE",
								"DESCR" : "IMPORT_ISSUE_FILE"
							}]
				});
		return store;
	},
	hideFields : function(){
		var me = this;
		if(isClientUser()){
			me.down('label[itemId="fiLabel"]').hide();
			me.down('container[itemId="posPayFIContainer"]').hide();
			me.down('label[itemId="clientLabel"]').hide();
			me.down('container[itemId="posPayClientContainer"]').hide();
		}
	}
});