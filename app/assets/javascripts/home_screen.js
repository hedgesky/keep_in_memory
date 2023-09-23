window.Home = {
  init: function() {
    $(".js-choose-language").click(Home.onDeckSelected);
  },

  onDeckSelected: function(e) {
    e.preventDefault();
    let id = $(this).data("id");
    Learning.setDeck(Decks[id]);
    App.showScreen("learning");
  },

  onShow: function() {
    App.interactWithMainButton(function() {
      Telegram.WebApp.MainButton.hide();
    })

    try {
      Telegram.WebApp.BackButton.hide();
    } catch(error) {
      console.log(error);
    }
  }
}
