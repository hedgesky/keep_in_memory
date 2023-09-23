//= require home_screen
//= require learning_screen
//= require finished_screen
//= require tutorial_popup

window.App = {
  screens: { home: Home, learning: Learning, finished: Finished },

  init: function() {
    Home.init();
    Learning.init();
    Finished.init();
    Tutorial.init();

    try {
      Telegram.WebApp.onEvent('themeChanged', function(){
        document.documentElement.className = Telegram.WebApp.colorScheme;
      });
    } catch(error) {
      console.log(error)
    }
  },

  showScreen: function(screen_name) {
    $(".screen").addClass("hidden")
    $(".screen-" + screen_name).removeClass("hidden")

    App.screens[screen_name].onShow();
  },

  clearMainButtonCallbacks: function() {
    try {
      Telegram.WebApp.MainButton.offClick(Learning.onClickedNext);
      Telegram.WebApp.MainButton.offClick(Learning.onClickedYes);
      Telegram.WebApp.MainButton.offClick(Telegram.WebApp.close);
    } catch(error) {
      console.log(error)
    }
  },

  interactWithMainButton: function(interaction_function) {
    try {
      interaction_function()
    } catch(error) {
      alert("Interaction with Telegram client failed. Try updating your Telegram client");
    }
  }
}

// Uncomment the line below to re-enable the tutorial. Useful for local development.
// Tutorial.reset()

App.init();
