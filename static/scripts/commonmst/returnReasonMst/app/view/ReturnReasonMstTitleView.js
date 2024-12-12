Ext.define('GCP.view.ReturnReasonMstTitleView', {
    extend : 'Ext.panel.Panel',
    xtype : 'returnReasonMstTitleView',
    requires : [ 'Ext.form.Label', 'Ext.Img', 'Ext.button.Button' ],
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
        var me = this;
        me.items = [{
            xtype : 'label',
            text : getLabel('returnReasonCode', 'Standard Rejection Reasons'),
            itemId : 'pageTitle',
            cls : 'page-heading'
        },{
            xtype : 'label',
            flex : 25
        }];
        me.callParent(arguments);
    }
});
