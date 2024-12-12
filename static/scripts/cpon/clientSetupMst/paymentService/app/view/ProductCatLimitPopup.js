Ext.define('CPON.view.ProductCatLimitPopup', {
    extend: 'Ext.window.Window',
    xtype: 'productCatLimitPopup',
    requires: ['Ext.button.Button'],
    modal: true,
    title: getLabel('limits', 'Limits'),
    closeAction: 'destroy',
    height: 320,
	overflowY: 'auto',
    width: 450,
    layout: 'fit',
    config: {
        mode: null
    },
    initComponent: function () {
        var me = this;
        var limitProfiles = Ext.create('Ext.data.Store', {
            fields: ['name', 'value'],
            proxy: {
                type: 'ajax',
                url: 'cpon/cponseek/productCatLimitProfiles.json',
                reader: {
                    type: 'json',
                    root: 'd.filter'
                },
                actionMethods: {
                    create: "POST",
                    read: "POST",
                    update: "POST",
                    destroy: "POST"
                }
            },
            autoLoad: true
        });
        var existingLimitProfiles = Ext.create('Ext.data.Store', {
            fields: ['name', 'value'],
            proxy: {
                type: 'ajax',
                url: 'cpon/cponDataList/existingProductCatLimits.json?id=' + encodeURIComponent(parentkey),
                reader: {
                    type: 'json',
                    root: 'd.filter'
                },
                actionMethods: {
                    create: "POST",
                    read: "POST",
                    update: "POST",
                    destroy: "POST"
                }
            },
            autoLoad: true
        });
        var cmpArray = new Array();
        for (var cnt = 0; cnt < prodCatList.length; cnt++) {
            if ('ADD' === me.mode) {
                if (this.arrayContains(selectedCategories, prodCatList[cnt].categoryId)) {
                    if (!Ext.isEmpty(prodCatList[cnt].limitProfileId)) {
                        var cmp = Ext.create('Ext.container.Container', {
                            layout: 'hbox',
                            cls: 'largepadding_top',
                            items: [{
                                xtype: 'label',
                                cls: 'middleAlign w14',
                                text: prodCatList[cnt].categoryName
                            }, {
                                xtype: 'combo',
                                itemId: 'limitcombo_' + prodCatList[cnt].categoryId,
                                fieldCls: 'xn-form-field',
                                triggerBaseCls: 'xn-form-trigger',
                                queryMode: 'local',
                                displayField: 'name',
                                store: limitProfiles,
                                editable: false,
                                valueField: 'value',
                                value: prodCatList[cnt].limitProfileId,
                                padding: '0 5 0 0',
                                emptyText: getLabel('select', 'Select'),
                                allowBlank: true
                            }]
                        });
                        cmpArray.push(cmp);
                    } else {
                        var cmp = Ext.create('Ext.container.Container', {
                            layout: 'hbox',
                            cls: 'largepadding_top',
                            items: [{
                                xtype: 'label',
                                cls: 'middleAlign w14',
                                text: prodCatList[cnt].categoryName
                            }, {
                                xtype: 'combo',
                                itemId: 'limitcombo_' + prodCatList[cnt].categoryId,
                                fieldCls: 'xn-form-field',
                                triggerBaseCls: 'xn-form-trigger',
                                queryMode: 'local',
                                displayField: 'name',
                                store: limitProfiles,
                                editable: false,
                                valueField: 'value',
                                padding: '0 5 0 0',
                                emptyText: getLabel('select', 'Select'),
                                allowBlank: true
                            }]
                        });
                        cmpArray.push(cmp);
                    }

                }
            } else {
                if (this.arrayContains(selectedCategories, prodCatList[cnt].categoryId)) {

                	if (!Ext.isEmpty(prodCatList[cnt].limitProfileId)) {
                        var cmp = Ext.create('Ext.container.Container', {
                            layout: 'hbox',
                            cls: 'largepadding_top',
                            items: [{
                                xtype: 'label',
                                cls: 'middleAlign w14',
                                text: prodCatList[cnt].categoryName
                            }, {
                                xtype: 'combo',
                                itemId: 'limitcombo_' + prodCatList[cnt].categoryId,
                                fieldCls: 'xn-form-field',
                                triggerBaseCls: 'xn-form-trigger',
                                queryMode: 'local',
                                displayField: 'name',
                                store: limitProfiles,
                                editable: false,
                                valueField: 'value',
                                value: prodCatList[cnt].limitProfileId,
                                padding: '0 5 0 0',
                                emptyText: getLabel('select', 'Select'),
                                allowBlank: true,
                                disabled : true
                            }]
                        });
                        cmpArray.push(cmp);
                    } else {
                        var cmp = Ext.create('Ext.container.Container', {
                            layout: 'hbox',
                            cls: 'largepadding_top',
                            items: [{
                                xtype: 'label',
                                cls: 'middleAlign w14',
                                text: prodCatList[cnt].categoryName
                            }, {
                                xtype: 'combo',
                                itemId: 'limitcombo_' + prodCatList[cnt].categoryId,
                                fieldCls: 'xn-form-field',
                                triggerBaseCls: 'xn-form-trigger',
                                queryMode: 'local',
                                displayField: 'name',
                                store: limitProfiles,
                                editable: false,
                                valueField: 'value',
                                padding: '0 5 0 0',
                                emptyText: getLabel('select', 'Select'),
                                allowBlank: true,
                                disabled : true
                            }]
                        });
                        cmpArray.push(cmp);
                    }

                }
            }
        }
        me.items = [{
            xtype: 'container',
            cls: 'extralargepadding',
            items: [{
                xtype: 'label',
                cls: 'w14',
                text: getLabel('productcategory', 'Product Category'),
                padding: '0 85 0 0'
            }, {
                xtype: 'label',
                text: getLabel('limitprofile', 'Limit Profile'),
                padding: '0 0 0 0'
            }, {
                xtype: 'container',
                itemId: 'categoryContainer',
                padding: '7 0 0 0',
                items: cmpArray
            }]
        }];

        me.buttons = [{
            text: getLabel('save', 'Save'),
            clickedFrom: null,
            cls: 'xn-button ux_button-background-color ux_cancel-button',
            glyph : 'xf0c7@fontawesome',
            itemId: 'savebtn',
            handler: function () {
                me.saveItems();

            }
        }, {
            text: getLabel('close', 'Close'),
            cls: 'xn-button ux_button-background-color ux_cancel-button',
            glyph : 'xf056@fontawesome',
            itemId: 'closebtn',
            margin: '6 0 0 0',
            handler: function () {
                me.close();
            }
        }];
        this.callParent(arguments);
    },

    saveItems: function () {
        var me = this;
        var arrayJson = new Array();
        var comboBoxes = this.query('combo');
        var serialNoCounter = 1;
        selectedCategoryLimitList = "";
        for (var i = 0, j = 0; i < prodCatList.length && j < prodCatList.length; i++) {
            if (undefined != comboBoxes[j] && null != comboBoxes[j].getValue()) {
                var objUserMessage = {
                    categoryId: prodCatList[i].categoryId,
                    limitProfileId: comboBoxes[j].getValue()
                };
                arrayJson.push(objUserMessage);
                j++;
            } else if (undefined != comboBoxes[j] && null == comboBoxes[j].getValue() && comboBoxes[j].isVisible() && comboBoxes[j].getItemId() == 'limitcombo_' + prodCatList[i].categoryId) {
                var objUserMessage = {
                    categoryId: prodCatList[i].categoryId
                };
                arrayJson.push(objUserMessage);
                j++;
            }


        }
		selectedTotalCategories = arrayJson;
        
        me.close();
    },
    arrayContains: function (arrayList, key) {
        for (i = 0; i < arrayList.length; i++) {
            if (arrayList[i] === key) {
                return true;
            }
        }
        return false;
    }

});