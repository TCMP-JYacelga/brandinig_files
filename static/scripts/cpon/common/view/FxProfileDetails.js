/**
 * @class GCP.view.FxProfilesDetails
 * @extends Ext.window.Window
 * @author Shraddha Mirashi
 */
Ext.define('GCP.view.FxProfileDetails', {
    extend: 'Ext.window.Window',
    xtype: 'fxprofiledetailspopup',
    modal: true,
    width: 390,
    height: 300,
    overflowY: 'auto',
    componentCls : 'ux_panel-transparent-background',
    requires: ['Ext.form.Label', 'Ext.layout.container.VBox', 'Ext.layout.container.HBox', 'Ext.button.Button'],
    title: getLabel('lblfxprofiledetails', 'FX Profile Change Confirmation'),
    config: {
        title: null,
        oldProfileId: null,
        oldProfileDesc: null,
        newProfileId: null,
        newProfileDesc: null,
        data: null,
        lstOldCcyPairs: null,
        lstNewCcyPairs: null
    },
    initComponent: function() {
        var me = this;
        var arrItems = [];
        var panel = null;
        var data = me.fetchFxProfileDetails();
        if (!Ext.isEmpty(data)) {
            me.lstOldCcyPairs = data.oldProfileDetails;
            me.lstNewCcyPairs = data.newProfileDetails;
            me.oldProfileDesc = data.oldProfileDesc;
            me.newProfileDesc = data.newProfileDesc;
        }
        panel = me.createConfirmationPanel();
        arrItems.push(panel);
        panel = me.createProfileDescriptionPanel();
        arrItems.push(panel);
        panel = me.createProfileDetailsPanel();
        arrItems.push(panel);
        this.buttons = me.createButtonArray();
        me.items = arrItems;
        me.callParent(arguments);
    },
    createConfirmationPanel: function() {
        var me = this;
        var fldLblOldProfileDesc = me.createLabel(getLabel("lblConfirmationMessage", "Following are the Currency Pair being added/removed. Are you sure you want to perform this change?"), true);
        var parentPanel = Ext.create('Ext.panel.Panel', {
            layout: 'vbox',
            flex: 1,
            cls : 'ux_extralargemargin-top',
            itemId: 'popupConfirmationPnl',
            items: [fldLblOldProfileDesc]
        });
        return parentPanel;
    },
    createProfileDescriptionPanel: function() {
        var me = this;
        var fldLblOldProfileDesc = me.createLabel(getLabel("lblOldProfileName", "Old Profile Name"), true);
        var fldLblNewProfileDesc = me.createLabel(getLabel("lblNewProfileName", "New Profile Name"), true);
        var fieldOldProfileDesc = me.createLabel(me.oldProfileDesc, false);
        var fieldNewProfileDesc = me.createLabel(me.newProfileDesc, false);
        var lblPanel = Ext.create('Ext.panel.Panel', {
            layout: 'vbox',
            itemId: 'popupProfilelblPnl',
            flex: 0.5,
            items: [fldLblOldProfileDesc, fieldOldProfileDesc]
        });
        var descPanel = Ext.create('Ext.panel.Panel', {
            layout: 'vbox',
            itemId: 'popupProfileDescPnl',
            flex: 0.5,
            items: [fldLblNewProfileDesc, fieldNewProfileDesc]
        });
        var parentPanel = Ext.create('Ext.panel.Panel', {
            layout: 'hbox',
            padding: '12 0 0 0',
            flex: 1,
            itemId: 'popupProfileNamePnl',
            items: [lblPanel, descPanel]
        });
        return parentPanel;
    },
    createProfileDetailsPanel: function() {
        var me = this;
        var fldLblOldProfileDesc = me.createLabel(getLabel("lblOldCcyPairs", "Currency Pairs being removed"), true);
        var fldLblNewProfileDesc = me.createLabel(getLabel("lblNewCcyPairs", "Currency Pairs being added"), true);
        var pnlOldProfileDtl = me.createCcyPairsList(me.lstOldCcyPairs);
        var pnlNewProfileDtl = me.createCcyPairsList(me.lstNewCcyPairs);

        var lblPanel = Ext.create('Ext.panel.Panel', {
            layout: 'vbox',
            flex: 0.5,
            items: [fldLblOldProfileDesc, pnlOldProfileDtl]
        });
        var descPanel = Ext.create('Ext.panel.Panel', {
            layout: 'vbox',

            flex: 0.5,
            items: [fldLblNewProfileDesc, pnlNewProfileDtl]
        });
        var parentPanel = Ext.create('Ext.panel.Panel', {
            layout: 'hbox',
            padding: '12 0 0 0',
            flex: 1,
            items: [lblPanel, descPanel]
        });
        return parentPanel;
    },
    createButtonArray: function() {
        var me = this;
        var arrItems = [];
        arrItems.push({
            xtype: 'button',
            itemId: 'OkBtnId',
            text: getLabel('lblFxProfileOkBtn', 'Ok'),
            cls: 'xn-button ux_button-background-color ux_cancel-button',
            listeners: {
                'click': function(btn, e, eOpts) {
                    me.handleOkAction();
                }
            }
        }, {
            xtype: 'button',
            itemId: 'CancelBtnId',
            text: getLabel('lblFxProfileCancelBtn', 'Cancel'),
             cls: 'xn-button ux_button-background-color ux_cancel-button',
             glyph : 'xf056@fontawesome',
            listeners: {
                'click': function(btn, e, eOpts) {
                    me.handleCancelAction();
                }
            }
        });
        return arrItems;
    },
    handleOkAction: function() {
        var me = this;
        me.close();
    },
    handleCancelAction: function() {
        var me = this;
        $("#fxProfileId").val(strOldFxProfileId);
        me.close();
    },
    createLabel: function(lblText, header) {
        var me = this;
        var lbl = Ext.create('Ext.form.Label', {
            cls: header == true ? 'font_bold ux_font-size14-normal ux_normalmargin-bottom' : 'ux_font-size14-normal',
            width: '100%',
            text: lblText
        });
        return lbl;
    },
    createCcyPairsList: function(lstCcyPairs) {
        var me = this;

        var pnlCcyPair = Ext.create('Ext.panel.Panel', {
            cls: 'xn-filter-toolbar',
            overflowY: 'auto',
            width: '100%',
            layout: {
                type: 'vbox'
            },
            items: []
        });
        if (!Ext.isEmpty(lstCcyPairs)) {
            var array = new Array();
            for (var key in lstCcyPairs) {
                array.push(lstCcyPairs[key]);
            }
            for (i = 0; i < array.length; i++) {
                pnlCcyPair.add(me.createLabel(array[i], false));
            }
        }
        return pnlCcyPair;
    },
    fetchFxProfileDetails: function() {
        var me = this;
        var data = null;
        Ext.Ajax.request({
            url: 'services/clientServiceSetup/fxProfileDetails.json?newProfileId=' + me.newProfileId + '&oldProfileId=' + me.oldProfileId,
            method: 'POST',
            async: false,
            success: function(response) {
                data = Ext.decode(response.responseText);
            },
            failure: function(response) {
                //console.log("fxProfileDetails.json service failed");
                return null;
            }
        });
        if (!Ext.isEmpty(data)) {
            return data;
        }
    }
});