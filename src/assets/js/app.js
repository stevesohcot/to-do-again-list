if ("serviceWorker" in navigator) {
  window.addEventListener("load", function() {
    navigator.serviceWorker
      .register("/assets/js/serviceWorker.js")
      .then(res => console.log("service worker registered"))
      .catch(err => console.log("service worker not registered", err))
  })
}


// jQuery for jump to the top
$(window).scroll(function() {
	if ($(this).scrollTop() > $(".navbar").height()) {
		$("#top").fadeIn();
	} else {
		$("#top").fadeOut();
	}
});
  
$("#top").click(function() {
	$("html, body").animate({ scrollTop: 0 }, 500);
});