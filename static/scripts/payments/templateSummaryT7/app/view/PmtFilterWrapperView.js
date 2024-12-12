Ext.define('GCP.view.PmtFilterWrapperView', {
			extend : 'Ext.panel.Panel',
			width : '100%',
			cls : 'filter-ribbon-wrapper',
			id : 'wrapper',
			requires : ['Ext.layout.container.Fit',
					'GCP.view.PmtViewTxnFilterView'],
			config : {
				wrapperfilterUrl : ''
			},
			initComponent : function() {
				this.items = [{
							xtype : 'pmtViewTxnFilterView',
							id : 'filterView',
							width : '100%',
							parent : this,
							minHeight : 10,
							autoHeight : true
						}];
				this.callParent(arguments);
			},
			getFilterUrl : function() {
				return this.wrapperfilterUrl;
			},
			updateFilterRibbon : function() {
				var me = this;
				var objTxnFilterView = me.down('pmtViewTxnFilterView');
				if(!Ext.isEmpty(objTxnFilterView))
				     objTxnFilterView.refreshFilterRibbon();
			}

		});