window.Finished = {
  init: function () {
    $(".js-continue-learning").click(function(e){
      e.preventDefault();
      Learning.setCurrentSessionCards();
      App.showScreen("learning");
    })
  },

  onShow: function() {
    if (Learning.hasMoreCards()) {
      $(".js-continue-learning").show();
      $(".js-partial-progress").show();
      $(".js-deck-fully-completed").hide();

      App.interactWithMainButton(function() {
        Telegram.WebApp.MainButton.hide();
      })
    } else {
      $(".js-continue-learning").hide();
      $(".js-partial-progress").hide();
      $(".js-deck-fully-completed").show();

      App.clearMainButtonCallbacks();

      App.interactWithMainButton(function() {
        Telegram.WebApp.MainButton.setParams({
          textColor: Telegram.WebApp.themeParams.button_color || "#fff",
          color: Telegram.WebApp.themeParams.button_color || "#2ea6ff",
          text: Translations.close
        }).onClick(Telegram.WebApp.close);
      });
    }

    $(".js-finished-section-contents").removeClass("invisible");
  }
}
