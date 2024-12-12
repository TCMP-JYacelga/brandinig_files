Ext.define('GCP.view.DraweeBankSuspensionView',
{
    extend : 'Ext.container.Container',
    xtype : 'draweeBankSuspensionView',
    requires : [ 'Ext.container.Container',
            'GCP.view.DraweeBankSuspensionTitleView',
            'GCP.view.DraweeBankSuspensionFilterView',
            'GCP.view.DraweeBankSuspensionGridView' ],
    width : '100%',
    autoHeight : true,
    minHeight : 600,
    initComponent : function() {
        var me = this;
        me.items = [{
            xtype : 'draweeBankSuspensionTitleView',
            width : '100%',
            cls : 'ux_no-border ux_largepaddingtb'
        },{
            xtype : 'draweeBankSuspensionFilterView',
            width : '100%',
            title : getLabel('filterBy', 'Filter By: ')
                    + '<img id="imgFilterInfo" class="largepadding icon-information"/>'
        },{
            xtype : 'draweeBankSuspensionGridView',
            width : '100%'
        }];
        me.on('resize', function() {
            me.doLayout();
        });
        me.callParent(arguments);
    }
});
