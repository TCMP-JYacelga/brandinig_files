Ext.define( 'GCP.view.NotionalTreeGridView',
{
	extend : 'Ext.panel.Panel',
	requires :
	[
		'Ext.data.*', 'Ext.grid.*', 'Ext.util.*', 'Ext.tree.*', 'Ext.ux.CheckColumn'
	],
	xtype : 'notionalTreeGridViewType',
	cls : 'ft-grid-header',
	autoHeight : true,
	minHeight : 140,
	maxHeight : 500,
	parent : null,
	title : getLabel( 'treeView', 'Tree View' ),
	initComponent : function()
	{
		var me = this;
		this.items = [];
		this.callParent( arguments );
	}
} );

Ext.define( 'GCP.view.NotionalTreeGridPopupView',
{
	extend : 'Ext.window.Window',
	xtype : 'notionalTreeGridPopupViewType',
//	bodyPadding : '2 4 2 2',
	modal : true,
	//autoHeight : true,
	width : '95%',
	minHeight : 140,
	maxHeight : 530,
	cls : 'xn-popup',
	draggable : false,
	resizable : false,	
	closeAction : 'hide',
	parent : null,
	title : getLabel( 'treeView', 'Tree View' ),
	initComponent : function()
	{
		var me = this;
		this.items = [];
		me.bbar=['->',
					   { 
			        	  text: getLabel('closeBtn','Close'),						  			        	
			        	  handler : function(btn,opts) {
			        		me.close();							
			        	}
						}
				]	
		this.callParent( arguments );
	}
} );

Ext.define( 'Pool.model',
{
	extend : 'Ext.data.Model',
	fields :
	[
		{
			name : 'nodeId',
			type : 'string'
		},
		{
			name : 'parentNodeId',
			type : 'string'
		},
		{
			name : 'nodeType',
			type : 'string'
		},
		{
			name : 'nodeName',
			type : 'string'
		},
		{
			name : 'nodeDescription',
			type : 'string'
		},
		{
			name : 'nodeBalance',
			type : 'string'
		},
		{
			name : 'nodeCurrency',
			type : 'string'
		},
		{
			name : 'grossCrBalance',
			type : 'string'
		},
		{
			name : 'grossDrBalance',
			type : 'string'
		},
		{
			name : 'apportionApplicable',
			type : 'string'
		},
		{
			name : 'creditApportionRate',
			type : 'string'
		},
		{
			name : 'creditApportionAmount',
			type : 'string'
		},
		{
			name : 'debitApportionRate',
			type : 'string'
		},
		{
			name : 'debitApportionAmount',
			type : 'string'
		},
		{
			name : 'pairedNode',
			type : 'string'
		}
	]
} );

Ext.define( 'GCP.controller.NotionalTreeGridController',
{
	extend : 'Ext.app.Controller',
	requires :
	[
		'Ext.grid.*', 'Ext.util.*', 'Ext.tree.*', 'Ext.ux.CheckColumn'
	],

	/**
	 * Array of configs to build up references to views on page.
	 */
	refs :
	[
		{
			ref : 'notionalTreeGridViewRef',
			selector : 'notionalTreeGridViewType'
		}
	],

	config :
	{
		treeGridViewPopup : null
	},

	/**
	 * A template method that is called when your application boots. It is
	 * called before the Application's launch function is executed so gives a
	 * hook point to run any code before your Viewport is created.
	 */
	init : function()
	{
		var me = this;

		GCP.getApplication().on(
		{
			showTreeGridExtPopupAction : function()
			{
				me.showTreeGridPopup();
			}
		} );

		me.control(
		{
			'notionalTreeGridViewType' :
			{
				render : function( panel )
				{
					me.handleTreeGridConfig();
				}
			}
		} );
	},

	showTreeGridPopup : function()
	{
		var me = this;
		me.treeGridViewPopup = Ext.create( 'GCP.view.NotionalTreeGridPopupView' );
		me.treeGridViewPopup.items = me.getNotionalTreeGridViewRef().items;
		me.treeGridViewPopup.show();
	},

	handleTreeGridConfig : function()
	{
		var me = this;
		cellEditGrid = Ext.create( 'Ext.tree.Panel',
		{
			xtype : 'tree-grid',
			id : 'poolgrid',
			itemId : 'poolgrid',
			cls : 'ft-grid-header',
			//margin :'21 0 0 0',
			minHeight : 10,
			maxHeight : 415,
			useArrows : true,
			rootVisible : false,
			multiSelect : true,
			singleExpand : false,
			viewConfig : {},

			listeners : { 
					resize : function() {
						if(me.treeGridViewPopup != null )
						me.treeGridViewPopup.doLayout();						
					}			
			},
			store : new Ext.data.TreeStore(
			{
				model : Pool.model,
				proxy :
				{
					type : 'ajax',
					url : 'viewCompNotionalTreeGrid.srvc?$viewState=' + encodeURIComponent( viewState ) + '&'
						+ csrfTokenName + "=" + csrfTokenValue + '&' + "$selectedDate=" + selectedDate,
					method : 'POST',
					reader :
					{
						type : 'json'
					}
				},
				folderSort : true
			} ),
			columns :
			[
				{
					xtype : 'treecolumn', // this is so we know which
					// column will show the tree
					text : getLabel('nodeName','Node Name'),
					locked : true,
					width : 180,
					sortable : false,
					dataIndex : 'nodeName',
					menuDisabled: true
				},
				{
					text : getLabel('nodeBalance', 'Balance' ),
					width : 170,
					sortable : false,
					dataIndex : 'nodeBalance',
					align : 'right',
					menuDisabled: true
				},
				{
					text : getLabel('grossCrBalance', 'Cr Gross Balance' ),
					width : 170,
					sortable : false,
					dataIndex : 'grossCrBalance',
					align : 'right',
					menuDisabled: true
				},
				{
					text : getLabel('grossDrBalance', 'Dr Gross Balance' ),
					width : 170,
					sortable : false,
					dataIndex : 'grossDrBalance',
					align : 'right',
					menuDisabled: true
				},
				{
					text : getLabel('apportionApplicable', 'Apportion Applicable'),
					width : 130,
					sortable : false,
					dataIndex : 'apportionApplicable',
					menuDisabled: true
				},
				{
					text : getLabel('creditApportionRate', 'Cr Apportion Rate'),
					width : 130,
					sortable : false,
					dataIndex : 'creditApportionRate',
					align : 'right',
					menuDisabled: true
				},
				{
					text : getLabel('creditApportionAmount', 'Cr Apportion Amount'),
					width : 170,
					sortable : false,
					dataIndex : 'creditApportionAmount',
					align : 'right',
					menuDisabled: true
				},
				{
					text : getLabel('debitApportionRate', 'Dr Apportion Rate'),
					width : 130,
					sortable : false,
					dataIndex : 'debitApportionRate',
					align : 'right',
					menuDisabled: true
				},
				{
					text : getLabel('debitApportionAmount', 'Dr Apportion Amount'),
					width : 170,
					sortable : false,
					dataIndex : 'debitApportionAmount',
					align : 'right',
					menuDisabled: true
				},
				{
					text : getLabel('pairedNode', 'Paired Node'),
					width : 100,
					sortable : false,
					dataIndex : 'pairedNode',
					menuDisabled: true
				}
			]
		} );

		var editTreeGridView = me.getNotionalTreeGridViewRef();
		editTreeGridView.add( cellEditGrid );
		editTreeGridView.doLayout();
	}

} );

function showTreeGridExtPopup()
{
	GCP.getApplication().fireEvent( 'showTreeGridExtPopupAction' );
}