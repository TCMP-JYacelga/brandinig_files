/**
 * @class Ext.ux.gcp.FilterView
 * @extends Ext.panel.Panel
 * @author Aditya Sharma
 * @author Vinay Thube
 * 
 * Filter View provides a panel that shows upon mouseover on the filter button.
 * It has a fixed right panel to display the action buttons and a content panel
 * to display the dynamic items.
 */
Ext.define('Ext.ux.gcp.FilterView', {
	extend : 'Ext.panel.Panel',
	requires : ['Ext.toolbar.Toolbar', 'Ext.container.Container'],
	xtype : 'filterView',
	cls : 'filter-view xn-ribbon',
	shadow : false,
	autoHeight : true,
	title: '<i class="fa fa-filter"></i>' + ' '+getLabel('filters', 'Filters'),
	collapsed : true,
	collapsible : true,
	titleCollapse : true,
	width : '100%',
	margin : '0 0 5 0',
	bodyCls: 'filter-body',
	// layout : 'hbox',
	/**
	 * cfgFilter Model contains two configs, for layout and items
	 * 
	 * @example
	 * {cfgContentPanelLayout : 'fit',cfgContentPanelItems : []}
	 */
	cfgFilterModel : {},
	cfgShowAdvancedFilterLink : true,
	/**
	 * @cfg{Boolean} cfgShowFilter controls whether the filter panel to be
	 *               displayed or not
	 * 
	 * @default false
	 */
	cfgShowFilter : false,
	/**
	 * @cfg{Boolean} cfgShowFilterInfo controls whether the applied filter panel
	 *               information(text-only) to be displayed or not
	 * 
	 * @default false
	 */
	cfgShowFilterInfo : false,

	initComponent : function() {		
		var me = this, arrItems = [], objFilterCt = null, objFilterInfoCt = null;
		me.on('beforecollapse', function() {
			if(me.cfgShowFilterInfo === true){
			var strFilterHeaderText = me.down('container[itemId="filterInfoCt"]') ? me.down('container[itemId="filterInfoCt"]').strFilterText : null;
			if(Ext.isEmpty(strFilterHeaderText))
				strFilterHeaderText = getLabel('nofiltersapplied', 'No filters applied');
			
			var headerText = me.getHeader();
			title = "<i class='fa fa-filter'></i>" + " "+getLabel('filters', 'Filters')+" " + "<span class='applied-filter-header ft-padding-l'> " + strFilterHeaderText + "</span>";
			headerText.setTitle(title);
			me.getHeader().getEl().set({
            	'data-qtip': Ext.isEmpty(strFilterHeaderText) ? '': "<span class='applied-filter-header'> " + strFilterHeaderText + "</span>"
        	});
			}
			
		});
		
		me.on('beforeexpand', function() {
			var headerText = me.getHeader();
			headerText.setTitle("<i class='fa fa-filter'></i>" + " "+getLabel('filters', 'Filters')+" ");
			me.getHeader().getEl().set({
            	'data-qtip': ''
       		 });
		});
		
		if (me.cfgShowFilter === true) {
			objFilterCt = me.createFilterContainer();
			arrItems.push(objFilterCt)
		}
		if (me.cfgShowFilterInfo === true) {
			objFilterInfoCt = me.createFilterInfoContainer();
			arrItems.push(objFilterInfoCt)
		}
		me.items = arrItems;
		me.collapsed = !Ext.isEmpty((me.cfgFilterModel || {}).collapsed) ? me.cfgFilterModel.collapsed : true;
		me.callParent(arguments);
	},
	createFilterContainer : function() {
		var me = this, objFilterCt = null;
		objFilterCt = Ext.create('Ext.container.Container', {
			flex : 1,
			layout : 'hbox',
			items : [{
						xtype : 'container',
						flex : 0.85,
						padding : '0 0 15 0',
//						height : 70,
						layout : (me.cfgFilterModel.cfgContentPanelLayout || 'fit'),
						items : (me.cfgFilterModel.cfgContentPanelItems || [])
					}, {
						xtype : 'container',
						flex : 0.15,
						height: '100%',
						padding : '0 0 15 0',
						layout : {
							type : 'vbox',
							align : 'left',
							padding : '5 5 5 5',
							pack: 'end'
						},
						defaults : {
							margin : '22 15 0 0'
						},
						items : [{
									xtype : 'label',
									itemId : 'createAdvanceFilterLabel',
									cls : 'create-advanced-filter-label',
									text : getLabel('morefilters', 'More Filters'),
									margin : '0 0 4 0',
									hidden : !me.cfgShowAdvancedFilterLink,
									listeners : {
										render : function(c) {
											c.getEl().on('click', function() {
														this.fireEvent('click',
																c);
													}, c);
										}
									}
								}]
					}]
		});
		return objFilterCt;

	},
	createFilterInfoContainer : function() {
		var me = this, objCt = null, arrItems = [], objPanel= null;
		arrItems.push({
					xtype : 'label',
					text : getLabel('appliedfilter', 'Applied Filter:  '),
					cls : 'ft-normal-font',
					minWidth : 50
				});
		/*objToolBar = Ext.create('Ext.toolbar.Toolbar', {
			itemId : 'filterInfoToolBar',
			padding : '0 0 0 4',
			flex : 1,
			//enableOverflow : true,
			componentCls : 'xn-custom xn-btn-default-toolbar-small xn-custom-toolbar',
			items : [{
						cls : 'ft-font-italic label-font-normal',
						text : 'None'
					}]
		});*/
		
		/*objToolBar = Ext.create('Ext.panel.Panel', {
		itemId : 'filterInfoToolBar',
		layout : 'column',
		padding : '0 0 0 4',
		autoHeight : true,
		flex : 1,
		//enableOverflow : true,
		//componentCls : 'xn-custom xn-btn-default-toolbar-small xn-custom-toolbar',
		items : [{
					xtype :'label',
					cls : 'ft-font-italic label-font-normal',
					text : 'None'
				}]
		});*/
		
		objPanel = Ext.create('Ext.panel.Panel', {
			itemId : 'filterInfoPanel',
			padding : '0 0 0 4',
			flex : 1,
			layout : 'auto',
			autoHeight : true,
			//enableOverflow : true,
			//componentCls : 'xn-custom xn-btn-default-toolbar-small xn-custom-toolbar',
			items : [{
						xtype : 'label',
						cls : 'label-font-normal',
						text : getLabel('nofiltersapplied', 'No filters applied'),
						margin: '0 0 10 0'
					}]
		});
		
		arrItems.push(objPanel)
		objCt = Ext.create('Ext.container.Container', {
					xtype : 'container',
					itemId : 'filterInfoCt',
					strFilterText : '',
					layout : 'hbox',
					dock : 'top',
					flex : 1,
//					padding : '0 0 8 0',
					items : arrItems
				});
		return objCt;

	},
	/**
	 * @cfg{ARRAY} arrFilterInfoJson The json model used populate filter
	 *             inofrmation
	 * @default {}
	 * 
	 * @example [{
	 * 								"fieldId" : "statusField", 
	 * 								"fieldLabel" : "Status", 
	 * 								"fieldValue" : [],
	 * 								"fieldTipValue" : "",
	 * 								"fieldObjData" : {}
	 * 							}]
	 */
	updateFilterInfo : function(arrFilterInfoJson) {
		var me = this, objDisplayHtml= '', objfilterInfoPanel = null, arrInfo = arrFilterInfoJson
				|| [], arrItems = [], strText = '', strDisplayText = '',strDisplayTip = '', objNone = {
				xtype : 'label',
				cls : 'label-font-normal',
				text : getLabel('nofiltersapplied', 'No filters applied'), 
				margin: '0 0 10 0'
		}
		objfilterInfoPanel = me.down('panel[itemId="filterInfoPanel"]');
		var filterInfoContainer = me.down('container[itemId="filterInfoCt"]');
		if (!Ext.isEmpty(objfilterInfoPanel)) {
			objfilterInfoPanel.removeAll(true);
			if (arrInfo.length > 10) {
				filterInfoContainer.strFilterText = "";
				for(var index=0;index<10;index++) {
					if(index < arrInfo.length){
						var cfg = arrInfo[index];
						var objHtml = '';
							if (cfg.fieldValue instanceof Array
									&& cfg.fieldValue.length > 0)
								strText = cfg.fieldValue.toString();
							else
								strText = cfg.fieldValue;
							
								strDisplayText = Ext.String.format(
										'{0} : {1} ',
										cfg.fieldLabel, cfg.fieldValue);
								
								strDisplayTip = Ext.String.format(
										'{0} : {1} ',
										cfg.fieldLabel, cfg.fieldTipValue);
							
							arrItems.push({
								xtype : 'button',
								text : strDisplayText,
								tooltip : strDisplayTip,
								cls : cfg.fieldIsMandatory ? 'btn-applied-filter blockCursor' : 'btn-applied-filter',
								iconCls : cfg.fieldIsMandatory ? 'xn-close-button blockCursor' : 'xn-close-button',
								data : cfg.fieldObjData,
								listeners : {
									'click' : function(btn){
										me.fireEvent('appliedFilterDelete',btn);
									}
								}
							});
							filterInfoContainer.strFilterText = filterInfoContainer.strFilterText + strDisplayText +  ", "; 
							//objDisplayHtml += objHtml;
							}
							else 
								break;
						};
						filterInfoContainer.strFilterText = filterInfoContainer.strFilterText.slice(0,-2); //To remove extra ', ' at the end
						arrItems.push({
							xtype : 'label',
							text : "......",
							cls: 'ft-margin-r'
						});
						
				if (arrItems.length == 0)
					arrItems.push(objNone);
				else 
					arrItems.push({
						xtype : 'button',
						itemId : 'clearSettingsButton',
						text : getLabel('clearfilters', 'Clear Filters'),
						cls : 't7-action-link',
						action : 'clearSettings',
						listeners : {
									'click' : function(btn){
											filterInfoContainer.strFilterText = "";
									}
						}
					});
			} 
			else if(arrInfo.length > 0){
				filterInfoContainer.strFilterText = "";
				Ext.each(arrInfo, function(cfg,index) {
						if (cfg.fieldValue instanceof Array
								&& cfg.fieldValue.length > 0)
							strText = cfg.fieldValue.toString();
						else
							strText = cfg.fieldValue;
						
							strDisplayText = Ext.String.format(
									'{0} : {1}',
									cfg.fieldLabel, cfg.fieldValue);
							
							strDisplayTip = Ext.String.format(
									'{0} : {1}',
									cfg.fieldLabel, cfg.fieldTipValue);
							
							arrItems.push({
								xtype : 'button',
								text : strDisplayText,
								tooltip : strDisplayTip,
								cls : cfg.fieldIsMandatory ? 'btn-applied-filter blockCursor' : 'btn-applied-filter',
								iconCls : cfg.fieldIsMandatory ? 'xn-close-button blockCursor' : 'xn-close-button',
								data : cfg.fieldObjData,
								listeners : {
									'click' : function(btn){
										if(!cfg.fieldIsMandatory)
											me.fireEvent('appliedFilterDelete',btn);
									}
								}
							});
							filterInfoContainer.strFilterText = filterInfoContainer.strFilterText + strDisplayText +  ", "; 
					});
					filterInfoContainer.strFilterText = filterInfoContainer.strFilterText.slice(0,-2); //To remove extra ', ' at the end
					
				if (arrItems.length == 0)
					arrItems.push(objNone);
				else
					arrItems.push({
						xtype : 'button',
						itemId : 'clearSettingsButton',
						text : getLabel('clearfilters', 'Clear Filters'),
						cls : 't7-action-link',
						action : 'clearSettings',
						listeners : {
							'click' : function(btn){
									filterInfoContainer.strFilterText = "";
							}
						}

					});
			}
			else {
				arrItems.push(objNone);
				filterInfoContainer.strFilterText = "";
			}
			objfilterInfoPanel.add(arrItems)
		}
		if(me.cfgShowFilterInfo && me.getCollapsed()){
				var headerText = me.getHeader();
				if(Ext.isEmpty(filterInfoContainer.strFilterText)) {
					filterInfoContainer.strFilterText = getLabel('nofiltersapplied', 'No filters applied');
				}
				title = "<i class='fa fa-filter'></i>" + " "+getLabel('filters', 'Filters')+" " + "<span class='applied-filter-header ft-padding-l'> " + filterInfoContainer.strFilterText + "</span>";
				headerText.setTitle(title);
				me.getHeader().getEl().set({
	            	'data-qtip': Ext.isEmpty(filterInfoContainer.strFilterText) ? '': "<span class='applied-filter-header'> " + filterInfoContainer.strFilterText + "</span>"
	        	});	
		}
	}
});