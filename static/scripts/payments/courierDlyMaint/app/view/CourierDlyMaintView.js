/**
 * @class GCP.view.CourierDlyMaintView
 * @extends Ext.container.Container
 * @author Sumith Khandagle
 */
Ext.define('GCP.view.CourierDlyMaintView',
{
    extend : 'Ext.container.Container',
    xtype : 'courierDlyMaintView',
    requires : [ 'Ext.container.Container',
            'GCP.view.CourierDlyMaintTitleView',
            'GCP.view.CourierDlyMaintFilterView',
            'GCP.view.CourierDlyMaintGridView' ],
    width : '100%',
    autoHeight : true,
    minHeight : 600,
    initComponent : function() {
        var me = this;
        me.items = [{
            xtype : 'courierDlyMaintTitleView',
            width : '100%',
            cls : 'ux_no-border ux_largepaddingtb'
        },{
            xtype : 'courierDlyMaintFilterView',
            width : '100%',
            title : getLabel('filterBy', 'Filter By: ')
                    + '<img id="imgFilterInfo" class="largepadding icon-information"/>'
        },{
            xtype : 'courierDlyMaintGridView',
            width : '100%'
        }];
        me.on('resize', function() {
            me.doLayout();
        });
        me.callParent(arguments);
    }
});
