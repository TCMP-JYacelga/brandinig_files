/**
 * @class GCP.view.common.SummaryRibbonTypeCodePopUpView
 * @extends Ext.window.Window
 * @author Vinay Thube
 */
Ext.define('GCP.view.common.SummaryRibbonTypeCodePopUpView', {
	extend : 'Ext.window.Window',
	requires : ['Ext.button.Button', 'Ext.form.Label',
			'Ext.ux.form.ItemSelector'],
	xtype : 'summaryRibbonTypeCodePopUpView',
	title : getLabel('typeCode', 'Type Code'),
	height : 370,
	width : 540,
	overflow : 'auto',
	typecodeStoreData : null,
	selectedValues : [],
	closeAction : 'hide',
	modal : true,
	layout : 'fit',
	initComponent : function() {
		var me = this;
		var typeCodeStore = me.getTypeCodeStore();
		var typeCodeView = Ext.create('Ext.panel.Panel', {
			width : 400,
			height : 400,
			itemId : 'typeCodeView',
			items : [{
				xtype : 'label',
				html : getLabel('select', 'Select ')
						+ "<span class='red'>"
						+ getLabel('max5', 'Max 5 ')
						+ "</span>"
						+ getLabel('typecodeSelMsg',
								' Type Codes to show on page.'),
				margin : 10
			}, {
				xtype : 'itemselector',
				itemId : 'typeCodeSelector',
				cls : 'widget-selector',
				margin : 10,
				height : 250,
				autoScroll : true,
				width : '100%',
				store : typeCodeStore,
				displayField : 'typeCodeDescription',
				valueField : 'typeCode',
				maxSelections : 5,
				minSelections : 1,
				msgTarget : 'under',
				fromTitle : getLabel("available", "Available"),
				toTitle : getLabel("selected", "Selected"),
				value : me.selectedValues
					// tpl: '<tpl for="."><div class="x-boundlist-item" >
					// ({typeCode}){typeCodeDescription}</div></tpl>',
				}],
			bbar : ['->', {
				xtype : 'button',
				text : getLabel('save', 'Save'),
				itemId : 'saveTypeCodeBtn',
				cls : 'xn-button ux_button-background-color ux_save-search-button',
				glyph : 'xf0c7@fontawesome',
				parent : this,
				handler : function() {
					if (me.down('itemselector').hasActiveError()) {
						Ext.MessageBox.alert('Error!!',
								'Incorrect data. Please check for errors!');
					} else {
						var selectorField = me
								.down('itemselector[itemId="typeCodeSelector"]');
						var arrValues = selectorField ? selectorField
								.getValue() : [];
						me.parent.fireEvent('saveSummaryTypeCodes', arrValues);
						me.close();
					}
				}
			}, {
				xtype : 'button',
				text : getLabel('cancel', 'Cancel'),
				cls : 'xn-button ux_button-background-color ux_cancel-button',
				glyph : 'xf056@fontawesome',
				margin : '0 0 0 10',
				handler : function() {
					me.close();
				}
			}, '->']
		});
		me.items = [typeCodeView];
		me.callParent(arguments);
	},
	getTypeCodeStore : function() {
		var me = this;
		var storeData = me.typecodeStoreData;
		var selectedValues = [];
		var objStore = Ext.create('Ext.data.Store', {
					fields : ['preference', 'typeCode', 'typeCodeDescription',
							'typeCodeAmount'],
					data : storeData
				});

		objStore.each(function(record) {
					if (record.get('preference')) {
						selectedValues.push(record.get('typeCode'));
					}
				});
		me.selectedValues = selectedValues;
		return objStore;
	}
});
