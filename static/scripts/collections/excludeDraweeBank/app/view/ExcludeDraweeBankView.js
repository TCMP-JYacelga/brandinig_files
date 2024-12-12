/**
 * @class GCP.view.ExcludeDraweeBankView
 * @extends Ext.container.Container
 * @author Himanshu Dixit
 */
Ext.define('GCP.view.ExcludeDraweeBankView',
{
    extend : 'Ext.container.Container',
    xtype : 'excludeDraweeBankView',
    requires : [ 'Ext.container.Container',
            'GCP.view.ExcludeDraweeBankTitleView',
            'GCP.view.ExcludeDraweeBankFilterView',
            'GCP.view.ExcludeDraweeBankGridView' ],
    width : '100%',
    autoHeight : true,
    minHeight : 600,
    initComponent : function() {
        var me = this;
        me.items = [{
            xtype : 'excludeDraweeBankTitleView',
            width : '100%',
            cls : 'ux_no-border ux_largepaddingtb'
        },{
            xtype : 'excludeDraweeBankFilterView',
            width : '100%',
            title : getLabel('filterBy', 'Filter By: ') + '<img id="imgFilterInfo" class="largepadding icon-information"/>'
        },{
            xtype : 'excludeDraweeBankGridView',
            width : '100%'
        }];
        me.on('resize', function() {
            me.doLayout();
        });
        me.callParent(arguments);
    }
});
