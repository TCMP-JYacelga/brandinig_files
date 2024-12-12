/**
 * @class GCP.view.StationeryProdMstView
 * @extends Ext.container.Container
 * @author Himanshu Dixit
 */
Ext.define('GCP.view.StationeryProdMstView',
{
    extend : 'Ext.container.Container',
    xtype : 'stationeryProdMstView',
    requires : [ 'Ext.container.Container',
            'GCP.view.StationeryProdMstTitleView',
            'GCP.view.StationeryProdMstFilterView',
            'GCP.view.StationeryProdMstGridView' ],
    width : '100%',
    autoHeight : true,
    minHeight : 600,
    initComponent : function() {
        var me = this;
        me.items = [{
            xtype : 'stationeryProdMstTitleView',
            width : '100%',
            cls : 'ux_no-border ux_largepaddingtb'
        },{
            xtype : 'stationeryProdMstFilterView',
            width : '100%',
            title : getLabel('filterBy', 'Filter By: ') + '<img id="imgFilterInfo" class="largepadding icon-information"/>'
        },{
            xtype : 'stationeryProdMstGridView',
            width : '100%'
        }];
        me.on('resize', function() {
            me.doLayout();
        });
        me.callParent(arguments);
    }
});
