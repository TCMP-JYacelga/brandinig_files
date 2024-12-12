  
	   var Widget = function (id, name, config, renderFunction, dependencies, outEvents, inEvents)
	   {
			var _widget = {
				parent 	    : null,
				id 		    : 'id',
				name	    : 'none',
				rendered    : false,
				dsName      : 'payments',
				eventBus    : null,
				outEvents   : [],
				inEvents    : [],
				config      : {},
				dashboard   : null,
				domAdapter  : null,
				dependencies: dependencies,
				render		: renderFunction,
				paintWidget : function (self) {
					return function (data){
						renderFunction(self, data)
					}
				},
				renderWidget: function ()
				{
					this.refresh();
				},
				init        : function(dashboard)
				{
					var self = this;
					self.dashboard 	= dashboard;
					self.domAdapter = dashboard.domAdapter;
					self.eventBus	= dashboard.eventBus;
					
					if (config.dsName) {
						self.eventBus.subscribe('refreshDS'+config.dsName, self.render);
					}
				},
				create : function(id, name, config, outEvents, inEvents)
				{
					var self = this;
					self.id     = id;
					self.name   = name;
					self.config = config;
					self.outEvents.push(outEvents);
					self.inEvents.push(inEvents);
					
					if (self.config.dataSource) {
						self.config.dataSource.onLoad(self.paintWidget(self));
					}

					return self;
				},
				refresh : function(filter) {
					this.config.dataSource.refresh();
				}
			};
			return _widget.create(id, name, config, renderFunction, outEvents, inEvents);
	   }