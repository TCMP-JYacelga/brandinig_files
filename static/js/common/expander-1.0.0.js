// JavaScript Document
function Expander(strDiv, intMin, intMax) {
	var stepId = 0;
	var divName = strDiv;
	var maxStepId = intMax;
	var minStepId = intMin;
	var opType = "plus";

	this.showhide = function(ctrl) {
		if ("plus" === opType)
		{
			stepId++;
			if (stepId >= maxStepId)
			{
				opType = "minus";
				if (ctrl)
				{
					var child = $(ctrl).children().get(0);
                	$(child).addClass("icon-collapse");
					$(child).removeClass("icon-expand");
					$(child).text("less details...");
				}
			}
			$("#" + strDiv + "-" + stepId).removeClass("ui-helper-hidden");
		}
		else if ("minus" === opType)
		{
			stepId--;
			if (stepId <= minStepId)
			{
				opType = "plus";
				if (ctrl)
				{
                	var child = $(ctrl).children().get(0);
                	$(child).addClass("icon-expand");
					$(child).removeClass("icon-collapse");
                    $(child).text("more details...");
				}
			}
            $("#" + strDiv + "-" + (stepId + 1)).addClass("ui-helper-hidden");
		}
	};
};

/** 
Helper method for PayDetail Expander
intintExpanded: div number to be shown as expanded
blnExpand: this will false if last div to be expanded else true
*/
function PayExpander(strDiv, intMin, intMax, intExpanded, blnExpand) {
	var stepId = 0;
	var divName = strDiv;
	var maxStepId = intMax;
	var minStepId = intMin;
	var opType = "plus";

	stepId = intExpanded;
	if (!blnExpand)
	{
		opType = "minus"
	}

	this.showhide = function(ctrl) {
		if ("plus" === opType)
		{
			stepId++;
			if (stepId >= maxStepId)
			{
				opType = "minus";
				if (ctrl)
				{
					var child = $(ctrl).children().get(0);
                	$(child).addClass("icon-collapse");
					$(child).removeClass("icon-expand");
					$(child).text("less details...");
				}
			}
			$("#" + strDiv + "-" + stepId).removeClass("ui-helper-hidden");
		}
		else if ("minus" === opType)
		{
			stepId--;
			if (stepId <= minStepId)
			{
				opType = "plus";
				if (ctrl)
				{
                	var child = $(ctrl).children().get(0);
                	$(child).addClass("icon-expand");
					$(child).removeClass("icon-collapse");
                    $(child).text("more details...");
				}
			}
            $("#" + strDiv + "-" + (stepId + 1)).addClass("ui-helper-hidden");
		}
	};
};

function showHideMore(ctrl, blnExpand)
{
	if (!blnExpand)
	{
		if (ctrl)
		{
			var child = $(ctrl).children().get(0);
        	$(child).addClass("icon-collapse");
			$(child).removeClass("icon-expand");
			$(child).text("less details...");
		}
	}
	else
	{
		if (ctrl)
		{
        	var child = $(ctrl).children().get(0);
        	$(child).addClass("icon-expand");
			$(child).removeClass("icon-collapse");
            $(child).text("more details...");
		}
	}
	
}
