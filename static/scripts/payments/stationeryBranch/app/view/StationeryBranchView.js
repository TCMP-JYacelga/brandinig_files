/**
 * @class GCP.view.StationeryBranchView
 * @extends Ext.container.Container
 * @author Himanshu Dixit
 */
Ext.define('GCP.view.StationeryBranchView',
{
    extend : 'Ext.container.Container',
    xtype : 'stationeryBranchView',
    requires : [ 'Ext.container.Container',
            'GCP.view.StationeryBranchTitleView',
            'GCP.view.StationeryBranchFilterView',
            'GCP.view.StationeryBranchGridView' ],
    width : '100%',
    autoHeight : true,
    minHeight : 600,
    initComponent : function() {
        var me = this;
        me.items = [{
            xtype : 'stationeryBranchTitleView',
            width : '100%',
            cls : 'ux_no-border ux_largepaddingtb'
        },{
            xtype : 'stationeryBranchFilterView',
            width : '100%',
            title : getLabel('filterBy', 'Filter By: ') + '<img id="imgFilterInfo" class="largepadding icon-information"/>'
        },{
            xtype : 'stationeryBranchGridView',
            width : '100%'
        }];
        me.on('resize', function() {
            me.doLayout();
        });
        me.callParent(arguments);
    }
});
