/**
 * @class GCP.view.CreditCardBinMstTitleView
 * @extends Ext.panel.Panel
 * @author Himanshu Dixit
 */
Ext.define('GCP.view.CreditCardBinMstTitleView',{
    extend : 'Ext.panel.Panel',
    xtype : 'creditCardBinMstTitleView',
    requires : [ 'Ext.form.Label','Ext.button.Button','Ext.menu.Menu','Ext.toolbar.Toolbar' ],
    width : '100%',
    defaults : {
        style : {
            padding : '0 0 0 0px'
        }
    },
    layout : {
        type : 'hbox'
    },
    initComponent : function() {
        this.items = [{
            xtype : 'label',
            text : getLabel('mstMaster', 'Credit Card BIN Master'),
            itemId : 'pageTitle',
            cls : 'page-heading'
        },
        {
            xtype : 'toolbar',
            flex : 1,
            cls : 'ux_panel-background',
            items : [
                    '->',
                    {
                        xtype : 'image',
                        src : 'static/images/icons/icon_spacer.gif',
                        height : 18,
                        cls : 'ux_hide-image'
                    },
                    {
                        cls : 'black inline_block button-icon icon-button-pdf ux_hide-image',
                        flex : 0
                    } ]
        },
           {
            xtype : 'label',
            flex : 25
        }];
        this.callParent(arguments);
    }
});
