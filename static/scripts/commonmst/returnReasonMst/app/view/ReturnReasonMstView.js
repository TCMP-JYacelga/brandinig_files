Ext.define('GCP.view.ReturnReasonMstView',
{
    extend : 'Ext.container.Container',
    xtype : 'returnReasonMstView',
    requires : [ 'Ext.container.Container', 'GCP.view.ReturnReasonMstTitleView',
            'GCP.view.ReturnReasonMstFilterView','GCP.view.ReturnReasonMstGridView' ],
    width : '100%',
    autoHeight : true,
    minHeight : 600,
    initComponent : function() {
        var me = this;
        me.items = [{
            xtype : 'returnReasonMstTitleView',
            width : '100%',
            cls : 'ux_no-border ux_largepaddingtb'
        },{
            xtype : 'returnReasonMstFilterView',
            width : '100%',
            title : getLabel('filterBy', 'Filter By: ') + '<img id="imgFilterInfo" class="largepadding icon-information"/>'
        },{
            xtype : 'returnReasonMstGridView',
            width : '100%'
        }];
        me.on('resize', function() {
            me.doLayout();
        });
        me.callParent(arguments);
    }
});
