/**
 * @class GCP.view.StationeryBranchTitleView
 * @extends Ext.panel.Panel
 * @author Himanshu Dixit
 */
Ext.define('GCP.view.StationeryBranchTitleView',{
    extend : 'Ext.panel.Panel',
    xtype : 'stationeryBranchTitleView',
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
            text : getLabel('stnBranchMaster', 'Stationery Indent Request'),
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
        },
        {
            xtype : 'button',
            border : 0,
            text : getLabel('lbl.lms.export', 'Export'),
            cls : 'cursor_pointer xn-saved-filter-btnmenu ux_font-size14 ux_export-btn',
            glyph : 'xf019@fontawesome',
            glyph : 'xf019@fontawesome',
            width: 75,
            menu : Ext.create('Ext.menu.Menu', {
            items : [ {
                        text : getLabel('btnXLSText', 'XLS'),
                        glyph : 'xf1c3@fontawesome',
                        itemId : 'downloadXls',
                        parent : this,
                        handler : function(btn, opts) {
                            this.parent.fireEvent('performReportAction', btn, opts);
                        }
                    }, {
                        text : getLabel('btnCSVText', 'CSV'),
                        glyph : 'xf0f6@fontawesome',
                        itemId : 'downloadCsv',
                        parent : this,
                        handler : function(btn, opts) {
                            this.parent.fireEvent('performReportAction', btn, opts);
                        }
                    }, {
                        text : getLabel('btnTSVText', 'TSV'),
                        glyph : 'xf1c9@fontawesome',
                        itemId : 'downloadTsv',
                        parent : this,
                        hidden : true,
                        handler : function(btn, opts) {
                             this.parent.fireEvent('performReportAction', btn, opts);
                        }
                     }]
            })
        }];
        this.callParent(arguments);
    }
});
