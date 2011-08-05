if($)
{
   var maxdate = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
   var mondate = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", 
      "SEP", "OCT", "NOV", "DEC"];

   var timelineStyle = {
      "width" : "30px",
      "background-color" : "RGB(120, 120, 120)",
      "height" : "20px",
      "top"    : "0px",
      "left"   : "48px",
      "position" : "absolute",
      "cursor" : "grab",
      "cursor" : "-moz-grab",
      "height" : "100%"//$(window).height()
   };

   var dateDIVStyle = {
      "color" : "RGB(120, 120, 120)",
      "font-family" : "helvetica",
      "font-size"   : "12px",
      "height"      : "20px",
      "width"       : "24px",
      "text-align" : "right",
      "left"       : "0px",
      "cursor"     : "pointer"
   };

   var TodayCSS =
   {
      "font-size" : "48px",
      "height"    : "48px",
      "font-weight" : "Bold"
   }

   var fWeekendCSS = 
   {
      "color": "RGB(230, 255, 40)"
   }

   var WeekendCSS =
   {
      "color": "RGB(130, 190, 0)"
   }

   var futureDIVStyle = 
   {
      "color": "RGB(200, 200, 200)"
   }

   var monthCSS = 
   {
	"color"             : "RGB(0, 150, 205)",
	"writing-mode"      : "tb-rl",
	"-webkit-transform" : "rotate(-90deg)",
	"-moz-transform" : "rotate(-90deg)",
	"-o-transform"   : "rotate(-90deg)",
	"font-family"    : "Helvetica",
	"font-weight"    : "Bold",
	"font-size"      : "56px",
	"opacity"        : "0.3",
	"z-index"        : "-100",
	"filter"         : "alpha(opacity=30)",
	"-ms-filter"     : "'progid:DXImageTransform.Microsoft.Alpha(Opacity=30)'",
	"width"          : "300px",
	"position"       : "absolute"
   }
   
   var controlContCSS = 
   {
      "position": "absolute",
      "left" : "300px",
      "top"  : "0px",
      "height" : "100%", //String($(window).height()) + "px",
      "overflow" : "hidden",
      "width" : "82px"
   }

   var lessCont = 
   {
      "position"  : "absolute",
      "top"       : "0px",
      "height"    : "100%", //String($(window).height()) + "px",
      "overflow"  : "hidden",
      "width"     : "15px",
   }

   var numMSInDay = 86400000;

   /**
    * calculates the number of months from (fromMonth/fromYear) to
    * toMonth/toYear
    */
   function numMonths(fromMonth, fromYear, toMonth, toYear)
   {
      if(fromYear > toYear) 
	 return -numMonths(toMonth, toYear, fromMonth, fromYear);
      if(fromYear == toYear) return (toMonth - fromMonth);
      return (toYear - fromYear) * 12 + (toMonth - fromMonth);
   }

   function Timeline(container)
   {
      var _self = this;

      var datesCont = $("<div></div>");
      var timeline = $("<div></div>");
      var controlCont = $("<div></div>");
      var monthCont = $("<div></div>");

      var dateObj = new Date();
      var day = dateObj.getDate();
      var month = dateObj.getMonth();
      var year = dateObj.getFullYear();
      var lastOffset = 0;

      var curUTC = Date.UTC(year, month, day) + numMSInDay;

      function removeDates(num, FoL)
      {
	 
	 if(FoL === undefined) FoL = "before";
	 var firstRemainder = 
	    $(datesCont.children(".dateItem").toArray()[num]); 
	 var setTop = firstRemainder.position().top;

	 if(FoL == "after")
	    datesCont.children(":lt(" + String(num) + ")").remove();
	 else
	 {
	    var limit = datesCont.children().length - num;
	    datesCont.children(":gt(" + String(limit) + ")").remove();
	 }
   
	 if(FoL == "after")
	    firstRemainder.css("margin-top", String(lastOffset = setTop) + "px");
      }

      function createMonthLabel(dateObj, FoL)
      {
	 if(FoL === undefined) FoL = "before";

	 var monthDIV = $("<div>" + mondate[dateObj.getMonth()] + 
	    " " + String(dateObj.getFullYear()) + "</div>");
	 var curTop = _self.findPosition(dateObj);
	 monthDIV.css(monthCSS);
	 var centrePt = -(monthDIV.width() + monthDIV.height())/2
	 monthDIV.css(
	    {   "left" : String(centrePt + 8) + "px",
		"top" : String(centrePt - 5 + curTop) + "px"});
	 if(FoL == "before")
	 {
	    monthCont.append(monthDIV);
	 }
	 else
	 {
	    monthCont.prepend(monthDIV);
	 }
      }

      function updateMonths()
      {
	 monthCont.css("top", String(datesCont.position().top) + "px");
	 // get the first month
	 dateObj.setTime(parseInt(datesCont.children().first().attr("UTC")));
	 var currentMonth = dateObj.getMonth(); 
	 var currentYear = dateObj.getFullYear();
	 var curLastMonth = currentMonth;
	 var curLastYear = currentYear;
	 dateObj.setDate(1);

	 var firstDay = new Date();
	 firstDay.setTime(parseInt(datesCont.children().last().attr("UTC")));
	 firstDay.setDate(1);

	 if(monthCont.attr("set") === undefined)
	 {
	    monthCont.attr("set", "true");

	    // is there a month in monthCont?
	    while(dateObj >= firstDay)
	    {
	       createMonthLabel(dateObj); 
	       if(currentMonth != 0) --currentMonth;
	       else {
		  currentMonth = 11; --currentYear; 
	       }
	       dateObj.setMonth(currentMonth);
	    }
	 }
	 else
	 {
	    var lastMonth = parseInt(monthCont.attr("lastMonth"));
	    var lastYear = parseInt(monthCont.attr("lastYear"));
	    
	    var numMonth = numMonths(lastMonth, lastYear, currentMonth, currentYear);
	    if(numMonth < 0) // it means that we have to delete some 
	    {
	       // delete month code
	       monthCont.children(":lt(" + String(-numMonth) + ")").remove();
	    }
	    else
	    {
	       var lastDate = new Date();
	       lastDate.setFullYear(lastYear, lastMonth, 2);
	       
	       while(dateObj >= lastDate)
	       {
		  createMonthLabel(dateObj, "after");
		  if(currentMonth != 0) --currentMonth;
		  else {
		     currentMonth = 11; --currentYear; 
		     dateObj.setFullYear(currentYear);
		  }
		  dateObj.setMonth(currentMonth);
	       }
	    }


	    var firstMonth = parseInt(monthCont.attr("firstMonth"));
	    var firstYear = parseInt(monthCont.attr("firstYear"));

	    numMonth = numMonths(firstDay.getMonth(), firstDay.getFullYear(),
	       firstMonth, firstYear);

	    if(numMonth < 0) // it means that we have to delete some
	    {
	       var limit = monthCont.children().length + numMonth - 1;
	       monthCont.children(":gt(" + limit + ")").remove();
	    }
	    else
	    {
	       var firstDate = new Date();
	       firstDate.setFullYear(firstYear, firstMonth, 1);

	       dateObj.setFullYear(currentYear = firstDay.getFullYear(), 
		  currentMonth = firstDay.getMonth(), 1);

	       while(dateObj < firstDate)
	       {
		  createMonthLabel(dateObj);
		  if(currentMonth != 11) ++currentMonth;
		  else {
		     currentMonth = 0; ++currentYear;
		     dateObj.setFullYear(currentYear);
		  }
		  dateObj.setMonth(currentMonth);
	       }
	    }

	 }

	 monthCont.attr(
	 {
	    "firstMonth": firstDay.getMonth(),
	    "firstYear" : firstDay.getFullYear(),
	    "lastMonth" : curLastMonth,
	    "lastYear"  : curLastYear 
	 });

      }

      function addToday(FoL)
      {
	 if(FoL === undefined) FoL = "after";

	 var dayOfWeek = (new Date()).getDay();
	 var todayDIV = $("<div>" + day + "</div>");

	 if(FoL == "before")
	    datesCont.append(todayDIV);
	 else datesCont.prepend(todayDIV);
	 todayDIV.css(dateDIVStyle);
	 todayDIV.css(TodayCSS);
	 todayDIV.addClass("dateItem");
	 todayDIV.attr("UTC", curUTC);

	 if(dayOfWeek == 0 || dayOfWeek == 6)
	    todayDIV.css(WeekendCSS);

	 return todayDIV;
      }

      function addDates(num, FoL)
      { 
	 if(FoL === undefined) FoL = "before";

	 var startUTC = 0;
	 var firstChild;
	 var firstChildPos = 0;

	 if(datesCont.children().length == 0) 
	    startUTC = curUTC;
	 else if(FoL == "after")
	 {
	    startUTC = 
	       parseInt((firstChild = 
		  datesCont.children(".dateItem").first()).attr("UTC"));
	    firstChildPos = firstChild.position().top;
	 }
	      
	 else
	    startUTC = parseInt(datesCont.children().last().attr("UTC"));

	 for(var i = 1; i < num + 1; i++)
	 {
	    var itemUTC = startUTC + ((FoL == "after")? i : -i) * numMSInDay;
	    dateObj.setTime(itemUTC);

	    if(itemUTC == curUTC)
	    {
	       addToday(FoL);
	       continue;
	    }

	    var itemDoM = dateObj.getDate();
	    var dateDIV = $("<div>" + itemDoM + "</div>");
	    var itemDoW = dateObj.getDay();

	    if(FoL == "after") datesCont.prepend(dateDIV);
	    else datesCont.append(dateDIV);

	    dateDIV.css(dateDIVStyle);
	    if(itemUTC > curUTC) 
	    {
	       dateDIV.css(futureDIVStyle);
	       if(itemDoW == 0 || itemDoW == 6)
		  dateDIV.css(fWeekendCSS);
	    }
	    else if(itemDoW == 0 || itemDoW == 6)
	       dateDIV.css(WeekendCSS);

	    dateDIV.addClass("dateItem");
	    dateDIV.attr("UTC", itemUTC);
	 }

	 if(FoL == "after")
	 {
	    firstChild.css("margin-top", "0px");
	    datesCont.children().first().css("margin-top", 
	       String(lastOffset = 
		  (firstChildPos - firstChild.position().top + lastOffset)) + "px");
	 }
      }

      function barDown(evt)
      {
	 var initY = evt.pageY;
	 evt.preventDefault();
	 var initTop = datesCont.offset().top;
	 var delta = 0;
	 $("html").css({"cursor" : "grabbing", "cursor": "-moz-grabbing"});
	 $("div").css({"cursor": "grabbing", "cursor": "-moz-grabbing"});

	 function barDrag(evt)
	 {
	    $(document).css({"cursor": "grabbing", "cursor": "-moz-grabbing"});
	    delta = evt.pageY - initY;
	    datesCont.css("top", String(initTop + delta) + "px");
	    monthCont.css("top", String(datesCont.position().top) + "px");
	 }

	 function barUp(evt)
	 {
	    $("html").css("cursor", "inherit");
	    $(document).css("cursor", "inherit");
	    $("div").css("cursor", "default");
	    $("body").css({"cursor": "inherit"});
	    $(".dateItem").css("cursor", "pointer");
	    controlCont.css("cursor", "default");
	    timeline.css({"cursor": "pointer", "cursor": "-moz-grab"});

	    $(document).unbind("mousemove", barDrag);
	    $(document).unbind("mouseup", barUp);

	    var numCreate = Math.round(delta/parseInt(dateDIVStyle["height"]));
	    if(numCreate == 0) return;

	    if(numCreate > 0)
	    {
	       addDates(numCreate, "after");
	       removeDates(numCreate, "before");
	    }
	    else
	    {
	       addDates(-numCreate, "before");
	       removeDates(-numCreate, "after");
	    }
	    updateMonths();
	 }

	 $(document).bind("mousemove", barDrag);
	 $(document).bind("mouseup", barUp);
      }

      this.draw = function()
      {
	 container.append(controlCont);
	 controlCont.css(controlContCSS);

	 controlCont.append(datesCont);
	 controlCont.append(monthCont);
	 datesCont.css({"position": "absolute", 
	    "left": "20px",
	    "top": "0px"});
	 monthCont.css({"position": "absolute",
	    "left": "20px",
	    "top" : "0px"});

	 controlCont.append(timeline);
	 timeline.css(timelineStyle);

	 timeline.bind("mousedown", barDown);

	 var todayDIV = addToday();

	 addDates(80, "before");
	 addDates(80, "after");
	
	 updateMonths();

      }

      this.addBar = function(color)
      {
	 var barCont = $("<div></div>");
	 var bar = $("<div></div>");

	 controlCont.append(barCont);
	 barCont.css(lessCont);
	 barCont.css({"background-color": color,
	    "left" : String(timeline.position().left + timeline.width() + 2) + "px"});
	 controlCont.css("width", 
	    String(controlCont.width() + barCont.width()) + "px");

	 var obj = { htmlObj: bar,
	             addTick : function(date) {}}

	 return bar;
      }

      this.getWidth = function()
      {
	 return controlCont.width();
      }

      this.position = function()
      {
	 return controlCont.position();
      }

      this.offset = function()
      {
	 return controlCont.offset();
      }
      this.findPosition = function(datesArr)
      {
	 var lastUTC = parseInt(datesCont.children().first().attr("UTC"));
	 var datesUTC = datesArr.getTime();
	 var numDays = Math.round((lastUTC - datesUTC)/numMSInDay);

	 var guessTop = datesCont.children(":nth-child(2)").position().top + 
	    ((numDays - 1)  * 20) - 3;

	 if(lastUTC > curUTC && datesUTC < curUTC) guessTop += 28;

	 return guessTop; 
      }

      this.test = function()
      {
	 removeChildren(30, "first");
      }
   }
}
