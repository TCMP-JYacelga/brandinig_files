/**
 * @class GCP.view.StationeryCpuView
 * @extends Ext.container.Container
 * @author Himanshu Dixit
 */
Ext.define('GCP.view.StationeryCpuView',
{
    extend : 'Ext.container.Container',
    xtype : 'stationeryCpuView',
    requires : [ 'Ext.container.Container',
            'GCP.view.StationeryCpuTitleView',
            'GCP.view.StationeryCpuFilterView',
            'GCP.view.StationeryCpuGridView' ],
    width : '100%',
    autoHeight : true,
    minHeight : 600,
    initComponent : function() {
        var me = this;
        me.items = [{
            xtype : 'stationeryCpuTitleView',
            width : '100%',
            cls : 'ux_no-border ux_largepaddingtb'
        },{
            xtype : 'stationeryCpuFilterView',
            width : '100%',
            title : getLabel('filterBy', 'Filter By: ') + '<img id="imgFilterInfo" class="largepadding icon-information"/>'
        },{
            xtype : 'stationeryCpuGridView',
            width : '100%'
        }];
        me.on('resize', function() {
            me.doLayout();
        });
        me.callParent(arguments);
    }
});
