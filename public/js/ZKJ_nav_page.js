(function ($) {
	$.fn.nav_close = function () {
		return this.each(function () {
			this.style.cssText = "";
			var nav_name = $(this).attr("data-nav-name");
			var query = '*[data-nav-name="'+nav_name+'"]';
			var $nav_zhujian = $(query);
			for (var i=0;i<$nav_zhujian.length;i++)
			    {
			    	if ($nav_zhujian.eq(i).hasClass("nav-style"))
			    	    {
			    	    	$nav_zhujian.eq(i)[0].style.cssText = ""
			    	    }
			    	else if ($nav_zhujian.eq(i).hasClass("ZKJ-page"))
			    	    {
			    	    	$nav_zhujian.eq(i).css("display","none")
			    	    }
			    }
		})
	}
})(jQuery);
(function ($) {
    $.fn.nav_open = function () {
        return this.each(function () {
            if ($(this).attr("data-nav-group")!=undefined)
            {
                var nav_group = $(this).attr("data-nav-group");
                var groupQuery = '*[data-nav-group="'+nav_group+'"]';
                var $nav_group = $(groupQuery);
                $nav_group.nav_close();
            }
            if ($(this).attr("data-open-style")!=undefined)
                {
                	this.style.cssText = $(this).attr("data-open-style");
                }
            var nav_name = $(this).attr("data-nav-name");
            var query = '*[data-nav-name="'+nav_name+'"]';

            var $nav_zhujian = $(query);
            for (var i=0;i<$nav_zhujian.length;i++)
                {
                	if ($nav_zhujian.eq(i).hasClass("nav-style")&&($nav_zhujian.eq(i).attr("data-open-style")!=undefined))
                	    {
                	        $nav_zhujian.eq(i)[0].style.cssText = $nav_zhujian.eq(i).attr("data-open-style");   
                	    }
                	else if ($nav_zhujian.eq(i).hasClass("ZKJ-page"))
                	    {
                            $nav_zhujian.eq(i).css("display","block")
                	    }
                }
        })
    }
})(jQuery);
(function ($) {
	$.ZKJ_nav_page = function () {
	    $nav = $(".ZKJ-nav");
	    for (var i=0;i<$nav.length;i++)
	        {
	        	if ($nav.eq(i).attr("data-nav-check")=="true")
	        	    {
	        	    	$nav.eq(i).nav_open();
	        	    };
	        	if ($nav.eq(i).attr("data-nav-open")=="mouseover")
	        	    { 
                         $nav.eq(i).mouseover(function () {
                             $(this).nav_open();
                         })
	        	    }
	        	else
	        	    {
	        	    	$nav.eq(i).click(function () {
                             $(this).nav_open();
                         })
	        	    }
	        }
	}
})(jQuery)